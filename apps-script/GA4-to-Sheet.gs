// === Configuration ===
const PROPERTY_ID_NEW = '538903336';  // New GA4 property ID (numeric only)
const SHEET_NAME_NEW = 'Google Analytics Automated Data';
// NOTE: SPREADSHEET_ID is referenced below (openById) exactly as in your original
// script — keep it defined in your project (config or another .gs file). It was
// not part of the code you shared, so it is left untouched here.

// === PRIMARY FUNCTIONS ===
function backfillData() {
  fetchAndWriteData('2026-07-01', '2026-10-30');
}

function dailyUpdate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const s = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  fetchAndWriteData(s, s);  // Fetch data for yesterday
}

// === ONE-TIME: clear the sheet so all rows are rewritten in the new (real-date) format ===
// Run this ONCE, then run backfillData(). Needed because old rows were stored as text
// dates and cannot be re-sorted or matched cleanly against the new real-date rows.
// (Also run this once now that new event columns were added, so every row is rewritten
//  with the extra columns after Bounce Rate, then run backfillData().)
function resetSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME_NEW);
  sheet.clearContents();
  ensureHeader(sheet);
  Logger.log('Sheet cleared and header set. Now run backfillData().');
}

// === CORE FETCH & WRITE FUNCTION ===
function fetchAndWriteData(startDate, endDate) {
  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(SHEET_NAME_NEW);

  ensureHeader(sheet);

  /***********************
   * A) PAGE-LEVEL DATA
   ***********************/
  const bodyA = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'date' },
      { name: 'pagePath' }
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'userEngagementDuration' },
      { name: 'newUsers' },
      { name: 'bounceRate' }
    ],
    orderBys: [
      { dimension: { dimensionName: 'date' } },
      { dimension: { dimensionName: 'pagePath' } }
    ],
    limit: '100000'
  };

  const respA = runReportApi(bodyA);

  const map = {};

  (respA.rows || []).forEach(r => {
    const date = r.dimensionValues[0].value;
    const page = r.dimensionValues[1].value;
    const key = `${date}|${page}`;

    map[key] = {
      date,
      page,
      activeUsers: toNum(r.metricValues[0]?.value),
      pageViews: toNum(r.metricValues[1]?.value),
      sessions: toNum(r.metricValues[2]?.value),
      engTime: toNum(r.metricValues[3]?.value),
      firstVisits: toNum(r.metricValues[4]?.value),
      bounceRate: toNum(r.metricValues[5]?.value)
    };
  });

  /***********************
   * B) EVENT COUNTS
   ***********************/
  const bodyB = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'date' },
      { name: 'pagePath' },
      { name: 'eventName' }
    ],
    metrics: [{ name: 'eventCount' }],
    limit: '100000'
  };

  const respB = runReportApi(bodyB);

  (respB.rows || []).forEach(r => {
    const date = r.dimensionValues[0].value;
    const page = r.dimensionValues[1].value;
    const event = r.dimensionValues[2].value;
    const key = `${date}|${page}`;

    if (!map[key]) return;

    const val = toNum(r.metricValues[0]?.value);

    if (event === 'user_engagement') map[key].userEngagements = val;
    if (event === 'scroll') map[key].scrolls = val;

    // --- Custom CLAT Possible funnel events (once-per-browser front-end events) ---
    if (event === 'add_to_cart')          map[key].addToCart         = val; // LP: any CTA click
    if (event === 'registered')           map[key].registered        = val; // LP: "Book My Free Seat"
    if (event === 'claim_vip')            map[key].claimVip          = val; // /vip: "Claim My VIP Seat"
    if (event === 'free_community')       map[key].freeCommunity     = val; // /vip: "Join the free community"
    if (event === 'joined_free_whatsapp') map[key].joinedFreeWhatsapp = val; // /confirmation: "Join now"
    if (event === 'joined_vip_whatsapp')  map[key].joinedVipWhatsapp  = val; // /vip-thankyou: "Join now"
  });

  /***********************
   * BUILD SHEET ROWS
   ***********************/
  const rows = Object.values(map).map(r => {
    const viewsPerUser = r.activeUsers
      ? round(r.pageViews / r.activeUsers, 2)
      : 0;

    const avgEng = r.activeUsers
      ? round(r.engTime / r.activeUsers, 2)
      : 0;

    return [
      toDateObj(r.date),          // real Date value (not a text string)
      r.page,
      r.activeUsers,
      r.pageViews,
      r.sessions,
      viewsPerUser,
      avgEng,
      r.userEngagements || 0,
      r.firstVisits || 0,
      r.scrolls || 0,
      typeof r.bounceRate === 'number' ? round(r.bounceRate, 2) : '',
      // --- Custom funnel events (new columns, after Bounce Rate) ---
      r.addToCart || 0,
      r.registered || 0,
      r.claimVip || 0,
      r.freeCommunity || 0,
      r.joinedFreeWhatsapp || 0,
      r.joinedVipWhatsapp || 0
    ];
  });

  upsertRowsByDateAndPage(sheet, rows);
  formatAndSortSheet(sheet);
}

// === REST API CALL ===
function runReportApi(requestBody) {
  const token = ScriptApp.getOAuthToken();
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID_NEW}:runReport`;

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + token },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error("Analytics Data API error (" + response.getResponseCode() + "): " + response.getContentText());
  }
  return JSON.parse(response.getContentText());
}

// === UTILITIES ===
function toNum(v) { const n = Number(v); return isNaN(n) ? 0 : n; }
function round(n, p = 0) { const f = Math.pow(10, p); return Math.round((n || 0) * f) / f; }

// Convert GA4 'yyyyMMdd' (e.g. '20260704') into a real Date at local noon.
// Noon avoids any midnight timezone off-by-one when the cell is displayed.
function toDateObj(yyyymmdd) {
  const y = Number(yyyymmdd.slice(0, 4));
  const m = Number(yyyymmdd.slice(4, 6));
  const d = Number(yyyymmdd.slice(6, 8));
  return new Date(y, m - 1, d);  // midnight local, date-only
}

// Normalize any date cell value (Date object, dd/MM/yyyy text, or yyyy-MM-dd text)
// into a canonical 'yyyy-MM-dd' key, so upsert matching is reliable across formats.
function dateKey(value) {
  if (value instanceof Date && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const s = String(value).trim();
  let m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);      // dd/MM/yyyy
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);             // yyyy-MM-dd
  if (m) return s;
  const d = new Date(s);
  if (!isNaN(d)) return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return s;
}

function getDateRangeYYYYMMDD(start, end) {
  const arr = [];
  let cur = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  while (cur <= e) {
    arr.push(Utilities.formatDate(cur, Session.getScriptTimeZone(), 'yyyyMMdd'));
    cur.setDate(cur.getDate() + 1);
  }
  return arr;
}
function yyyymmddToDdMmYyyy(s) {
  return `${s.slice(6, 8)}/${s.slice(4, 6)}/${s.slice(0, 4)}`;
}

// === SHEET HELPERS ===

function ensureHeader(sheet) {
  const header = [
    'Date',
    'Page Path',
    'Active Users',
    'Page Views',
    'Session Start',
    'Views Per Active User',
    'Avg. Engagement Time / User (In sec)',
    'User Engagements (Event)',
    'First Visits',
    'Scroll Events',
    'Bounce Rate (approx.)',
    // --- Custom funnel events (new columns, after Bounce Rate) ---
    'Add to Cart (LP CTA)',
    'Registered (Book Free Seat)',
    'Claim VIP',
    'Free Community',
    'Joined Free WhatsApp',
    'Joined VIP WhatsApp'
  ];

  const curr = sheet.getRange(1, 1, 1, header.length).getValues()[0];
  if (curr.join('|') !== header.join('|')) {
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
  }
}

function upsertRowsByDateAndPage(sheet, rows) {
  const last = sheet.getLastRow();
  const existing = {};

  if (last >= 2) {
    // Read as values (not display) so real date cells come back as Date objects.
    const values = sheet.getRange(2, 1, last - 1, 2).getValues();
    values.forEach((r, i) => {
      existing[dateKey(r[0]) + '|' + r[1]] = i + 2;
    });
  }

  const toAppend = [];
  rows.forEach(r => {
    const key = dateKey(r[0]) + '|' + r[1];
    if (existing[key]) {
      sheet.getRange(existing[key], 1, 1, r.length).setValues([r]);
    } else {
      toAppend.push(r);
    }
  });

  if (toAppend.length) {
    sheet
      .getRange(sheet.getLastRow() + 1, 1, toAppend.length, toAppend[0].length)
      .setValues(toAppend);
  }
}

// Force the Date column to display as dd/MM/yyyy, then sort the whole data
// region by Date (ascending), then Page Path (ascending). Runs after every write
// so order stays correct on daily incremental updates too.
function formatAndSortSheet(sheet) {
  const last = sheet.getLastRow();
  if (last < 2) return;
  const lastCol = sheet.getLastColumn();

  sheet.getRange(2, 1, last - 1, 1).setNumberFormat('dd/MM/yyyy');

  sheet.getRange(2, 1, last - 1, lastCol).sort([
    { column: 1, ascending: true },
    { column: 2, ascending: true }
  ]);
}

// === TRIGGER SETUP (run once) ===
function createTrigger() {
  ScriptApp.newTrigger('dailyUpdate')
    .timeBased()
    .atHour(11)
    .nearMinute(0)
    .everyDays(1)
    .create();
}
