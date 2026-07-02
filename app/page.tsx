import FunnelScripts from "./FunnelScripts";
import RegisterModal from "./RegisterModal";

const CHAMPS = [
  "Air-1", "Air-2", "Air-3", "Air-4", "Air-5", "Air-5-B", "Air-6", "Air-7",
  "Air-8", "Air-9", "Air-10", "Air-11", "Air-12", "Air-13", "Air",
];
const CHAMP_ROWS = [
  CHAMPS.slice(0, 5),
  CHAMPS.slice(5, 10),
  CHAMPS.slice(10, 15),
];
const TICKER = [
  "Free CLAT Career Seminar",
  "12th July, Constitution Club of India, New Delhi",
  "11 AM to 2 PM, 3 hours",
  "Hosted by Dr. Surabhi Modi Sahai",
  "For Class 10, 11, 12 & droppers",
  "Limited seats, register free",
];

export default function Page() {
  return (
    <>
      <div className="topbar" aria-hidden="true">
        <div className="topbar-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span className="topbar-item" key={i}><span className="topbar-dot"></span>{t}</span>
          ))}
        </div>
      </div>

      <header className="hero">
        <span className="stage-grain" aria-hidden="true"></span>
        <div className="inner hero-inner" style={{position:"relative"}}>
          <span className="eyebrow hero-eyebrow reveal">FOR CLASS 10, 11 &amp; 12 STUDENTS (AND THEIR PARENTS)</span>

          <h1 className="hero-h1 reveal">The Path to a Top NLU Starts With <span className="hh-keep"><span className="uline"><span className="em">One Clear Plan</span><svg className="uline-svg" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true"><path d="M2,11 Q75,2 150,9 Q225,16 298,6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></span>.</span> We&rsquo;ll Hand It to You in 3 Hours.</h1>

          <p className="hero-sub reveal">Most students don&rsquo;t miss CLAT because they aren&rsquo;t smart enough. They miss it because nobody showed them <span className="hl">what to study, in what order, and how to fit it around school</span>. On 12th July, Dr. Surabhi Modi Sahai gives you that exact roadmap, live and in person.</p>

          <div className="hero-cred reveal">Hosted live by <b>Dr. Surabhi Modi Sahai</b>, MD &amp; CEO, CLAT Possible <span className="hero-cred-sep">&middot;</span> she still mentors the class herself</div>

          <div className="hcount reveal" aria-label="Registration closes in">
            <span className="hcount-label">Seats are limited, registration closes soon</span>
            <div className="hcount-units" id="countdown">
              <div className="hcount-unit"><span className="hcount-num" data-d>00</span><span className="hcount-lab">Days</span></div>
              <span className="hcount-sep">:</span>
              <div className="hcount-unit"><span className="hcount-num" data-h>00</span><span className="hcount-lab">Hrs</span></div>
              <span className="hcount-sep">:</span>
              <div className="hcount-unit"><span className="hcount-num" data-m>00</span><span className="hcount-lab">Min</span></div>
              <span className="hcount-sep">:</span>
              <div className="hcount-unit"><span className="hcount-num" data-s>00</span><span className="hcount-lab">Sec</span></div>
            </div>
          </div>

          <div className="hero-layout">
            <div className="hfig reveal">
              <img src="/hero-thumb.png" alt="CLAT Possible: NLU is Possible. Free in-person CLAT seminar with Dr. Surabhi Modi Sahai" />
            </div>
            <div className="hmeta">
              <div className="hcard reveal reveal-d1">
                <span className="hcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/></svg></span>
                <span className="hcard-k">Date</span>
                <span className="hcard-v">12th July, Sunday</span>
              </div>
              <div className="hcard reveal reveal-d2">
                <span className="hcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5l3 2"/></svg></span>
                <span className="hcard-k">Time</span>
                <span className="hcard-v">11 AM to 2 PM</span>
              </div>
              <div className="hcard reveal reveal-d3">
                <span className="hcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21c5-4.6 7-8 7-11a7 7 0 1 0-14 0c0 3 2 6.4 7 11z"/></svg></span>
                <span className="hcard-k">Venue</span>
                <span className="hcard-v">Constitution Club of India, New Delhi</span>
              </div>
              <div className="hcard reveal reveal-d4">
                <span className="hcard-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c0-3.6 2.9-5.6 6.5-5.6s6.5 2 6.5 5.6"/></svg></span>
                <span className="hcard-k">For</span>
                <span className="hcard-v">Class 11, 12 &amp; droppers</span>
              </div>
            </div>
          </div>

          <div className="hcta reveal">
            <a className="cta hero-cta" href="#register"><span>Register Now for <s className="cta-was">&#8377;999</s> FREE</span>
              <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5"/></svg></span></a>
            <div className="hcta-guar"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.6l8 3v5.4c0 4.4-3 7.6-8 8.8-5-1.2-8-4.4-8-8.8V5.6z"/><path d="M9 12l2 2 4-4.2"/></svg> 12th July at Constitution Club of India, New Delhi. Seats are limited and they fill fast.</div>
            <p className="cta-note"><span className="pin">&#9679;</span> 100% free &middot; In person on 12th July &middot; Limited seats</p>
          </div>
        </div>
      </header>


      <section className="section section--soft" id="champions">
        <div className="inner-wide">
          <div className="sec-head"><span className="eyebrow">Our Champions&rsquo; Wall</span>
            <h2 className="sec-h2">Celebrating Remarkable <br className="bk"/><span className="em">CLAT Achievements</span></h2>
            <p className="sec-deck">Real students. Real ranks. Real seats at the NLUs they were aiming for.</p></div>
          <div className="champwall reveal">
            {CHAMP_ROWS.map((row, r) => (
              <div className="champrail" key={r}>
                <div className="champtrack" style={{ "--n": row.length } as React.CSSProperties}>
                  {[...row, ...row].map((f, i) => (
                    <div className="champ" key={i} aria-hidden={i >= row.length ? true : undefined}>
                      <img src={`/champions/${f}.webp`} alt="CLAT Possible topper" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="section">
        <div className="inner">
          <div className="sec-head"><span className="eyebrow">The honest starting point</span>
            <h2 className="sec-h2">Do You Dream of a Seat in a <br className="bk"/>Top NLU, <span className="em">But&hellip;</span></h2>
            <p className="sec-deck">If even one of these is you, this seminar was built for you.</p></div>
          <div className="pains reveal">
            <div className="pain"><span className="pain-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.3 9.3a2.7 2.7 0 0 1 4.7 1.7c0 1.8-2.6 2.1-2.6 3.5"/><path d="M12 17.4h.01"/></svg></span><p>The exam pattern and syllabus still feel like a maze, and every video you watch says something different.</p></div>
            <div className="pain"><span className="pain-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.6C10.3 5.4 7.6 4.9 4 5.1v12.6c3.6-.2 6.3.3 8 1.5 1.7-1.2 4.4-1.7 8-1.5V5.1c-3.6-.2-6.3.3-8 1.5z"/><path d="M12 6.6V19.2"/></svg></span><p>School, tuition, and CLAT prep are all pulling at the same hours, and there is never enough time left to study the way you know you should.</p></div>
            <div className="pain"><span className="pain-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8.4" r="3"/><circle cx="16.6" cy="9.5" r="2.3"/><path d="M3.5 19c0-3 2.6-4.7 5.5-4.7 1.8 0 3.3.6 4.3 1.7M14.7 19c.1-2.3 1.5-3.6 3.3-3.6 1.5 0 2.8.9 3.3 2.2"/></svg></span><p>The competition looks enormous from where you are sitting, and some days you quietly wonder if you can really make it.</p></div>
            <div className="pain"><span className="pain-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a8 8 0 0 1 13.4-5.6L20 8"/><path d="M20 3.6V8h-4.4"/><path d="M20 13a8 8 0 0 1-13.4 5.6L4 16"/><path d="M4 20.4V16h4.4"/></svg></span><p>You start strong, then a busy week breaks your rhythm, and getting back into a routine feels harder each time.</p></div>
            <div className="pain"><span className="pain-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17l-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/></svg></span><p>A low mock score lands and it stings, and you are not sure if it means you are behind or just tested the wrong things.</p></div>
            <div className="pain"><span className="pain-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.7 8.3l-2.2 5.2-5.2 2.2 2.2-5.2z"/><circle cx="12" cy="12" r=".5" fill="currentColor" stroke="none"/></svg></span><p>You are guessing at which topics matter most, so you spend hours on the wrong ones and run out of time for the rest.</p></div>
          </div>
          <p className="pain-kicker">None of this means you are not cut out for law. It means you have been preparing without a map. That is exactly what this seminar fixes.</p>
        </div>
      </section>


      <section className="section section--soft">
        <div className="inner">
          <div className="sec-head"><span className="eyebrow">Instead, Imagine Walking Out With This</span>
            <h2 className="sec-h2">In 3 hours, you start your <br className="bk"/>journey with a <span className="em">map</span>, <br className="bk"/>not a guess</h2></div>
          <div className="imagine reveal">
            <div className="snapshot">
              <div className="snap-top">
                <span className="snap-kicker">After the seminar</span>
                <span className="snap-status"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4 4 10-10.5"/></svg>On track</span>
              </div>
              <h3 className="snap-title">Your whole plan, on <span className="em">a single page</span>.</h3>
              <div className="snap-grid">
                <div className="snap-field"><span className="snap-k"><span className="node"></span>Roadmap</span><span className="snap-v">A crystal-clear roadmap for CLAT, so you always know what to study next instead of guessing.</span></div>
                <div className="snap-field"><span className="snap-k"><span className="node"></span>Materials</span><span className="snap-v">The same study materials and test series that toppers actually trust, so your effort goes into the right things.</span></div>
                <div className="snap-field"><span className="snap-k"><span className="node"></span>Confidence</span><span className="snap-v">Real confidence going into the exam, because you have a proven method behind you instead of scattered advice.</span></div>
                <div className="snap-field"><span className="snap-k"><span className="node"></span>Mocks</span><span className="snap-v">Time management you have genuinely mastered, so your mock scores climb instead of stalling.</span></div>
                <div className="snap-field snap-field--full"><span className="snap-k"><span className="node"></span>Family</span><span className="snap-v">Your parents watching you secure a seat at a prestigious NLU, proud of the plan you stuck to.</span></div>
              </div>
              <div className="snap-foot"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.6l8 3v5.4c0 4.4-3 7.6-8 8.8-5-1.2-8-4.4-8-8.8V5.6z"/><path d="M9 12l2 2 4-4.2"/></svg>We built CLAT Possible to make this real for students like you. The 12th July seminar is where it begins.</div>
            </div>
          </div>
          <div style={{textAlign:"center",marginTop:"clamp(28px,3.4vw,40px)"}}>
            <a className="cta" href="#register"><span>Register Now for <s className="cta-was">&#8377;999</s> FREE</span>
              <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5"/></svg></span></a>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="inner-wide">
          <div className="sec-head"><span className="eyebrow">Why Students Trust CLAT Possible</span>
            <h2 className="sec-h2">A track record we can <br className="bk"/><span className="em">stand behind</span></h2></div>
          <div className="stats reveal">
            <div className="stat"><div className="stat-num" data-count="20000" data-suffix="+">0</div><div className="stat-lab">students trained</div></div>
            <div className="stat"><div className="stat-num" data-count="3000" data-suffix="+">0</div><div className="stat-lab">selections into<br/>leading NLUs</div></div>
            <div className="stat"><div className="stat-num" data-count="28" data-suffix="+">0</div><div className="stat-lab">faculty &amp;<br/>subject experts</div></div>
          </div>
          <p className="honesty">Every rank and stat locks to the latest verified CLAT result before publish. We do not publish numbers we cannot stand behind.</p>
        </div>
      </section>


      <section className="section section--soft">
        <div className="inner-wide">
          <div className="sec-head"><span className="eyebrow">What 3 Hours With Us Actually Gives You</span>
            <h2 className="sec-h2">You walk out knowing <br className="bk"/>exactly what to do <span className="em">Monday morning</span></h2></div>
          <div className="kit kit--even reveal">
            <div className="kit-tile">
              <span className="kt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5 2.5 9 12 13l9.5-4z"/><path d="M6 11v4c0 1.4 2.7 2.4 6 2.4s6-1 6-2.4v-4"/><path d="M21.5 9v4.5"/></svg></span>
              <span className="kt-k"><span className="node"></span>Top Mentors</span>
              <span className="kt-v">You learn directly from India&rsquo;s top CLAT mentors, the people behind 15+ years of proven results.</span>
            </div>
            <div className="kit-tile">
              <span className="kt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.5l8.5 14.5h-17z"/><path d="M12 10v4.2M12 17h.01"/></svg></span>
              <span className="kt-k"><span className="node"></span>The Costly Mistakes</span>
              <span className="kt-v">You find out the common mistakes that quietly cost aspirants their rank, before they cost you yours.</span>
            </div>
            <div className="kit-tile">
              <span className="kt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.2v15.6M7.5 19.8h9M5 7.4 2.7 12.3a2.6 2.6 0 0 0 4.6 0z"/><path d="M19 7.4l-2.3 4.9a2.6 2.6 0 0 0 4.6 0z"/></svg></span>
              <span className="kt-k"><span className="node"></span>School + CLAT, Balanced</span>
              <span className="kt-v">You get a realistic plan for balancing school and CLAT prep, one that fits a real student&rsquo;s week.</span>
            </div>
            <div className="kit-tile">
              <span className="kt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.6l8 3v5.4c0 4.4-3 7.6-8 8.8-5-1.2-8-4.4-8-8.8V5.6z"/><path d="M9 12l2 2 4-4.2"/></svg></span>
              <span className="kt-k"><span className="node"></span>Confidence That Holds</span>
              <span className="kt-v">You leave with the confidence to face the competition head-on, because you finally know your plan holds up.</span>
            </div>
            <div className="kit-tile">
              <span className="kt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5a1 1 0 0 1 1-1h11l3 3v12a1 1 0 0 1-1 1z"/><path d="M8 9h7M8 13h7M8 17h4"/></svg></span>
              <span className="kt-k"><span className="node"></span>The Right Materials</span>
              <span className="kt-v">You get clear guidance on the right study materials and test series, so you stop wasting money and hours on the wrong ones.</span>
            </div>
            <div className="kit-tile">
              <span className="kt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21V4"/><path d="M6 4.5h11l-2.2 3.2L17 11H6"/></svg></span>
              <span className="kt-k"><span className="node"></span>Effort That Pays</span>
              <span className="kt-v">You understand how to structure your preparation for maximum results, not just maximum effort.</span>
            </div>
            <div className="kit-tile">
              <span className="kt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2 7 4-14 2 7h6"/></svg></span>
              <span className="kt-k"><span className="node"></span>What Toppers Do</span>
              <span className="kt-v">You see what this year&rsquo;s top scorers are doing differently, while there is still time to do it too.</span>
            </div>
            <div className="kit-tile">
              <span className="kt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 21V4"/><path d="M6 4.5h11l-2.2 3.2L17 11H6"/><circle cx="18" cy="18" r="3"/></svg></span>
              <span className="kt-k"><span className="node"></span>Your First or Next Step</span>
              <span className="kt-v">Whether this is your first step or your next one, you walk out with clarity on exactly what to do Monday morning.</span>
            </div>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="inner-wide">
          <div className="sec-head"><span className="eyebrow">Meet Your Host</span>
            <h2 className="sec-h2">Taught by the founder who <br className="bk"/>still <span className="em">mentors the class herself</span></h2></div>
          <div className="host reveal">
            <div className="host-photo"><img src="/herocoachimg.webp" alt="Dr. Surabhi Modi Sahai, MD &amp; CEO, CLAT Possible" /></div>
            <div>
              <p className="host-name">Dr. Surabhi Modi Sahai</p>
              <p className="host-role">MD &amp; CEO, CLAT Possible</p>
              <div className="pills">
                <span className="pill">English &amp; CR Mentor</span>
                <span className="pill">Hindu College alumna</span>
                <span className="pill">Fulbright (FLTA) nominee, UC Davis</span>
                <span className="pill">Ph.D., University of Lucknow</span>
              </div>
              <p className="host-bio">Dr. Surabhi built the academic foundation that CLAT Possible runs on, and she has personally mentored thousands of students from confused beginners to NLU admits. <span className="lede">For three hours on 12th July, that experience is in the room with you, answering your questions directly.</span></p>
            </div>
          </div>
        </div>
      </section>


      <section className="section section--soft">
        <div className="inner-wide">
          <div className="sec-head"><span className="eyebrow">This Seminar Is for You If You Are</span>
            <h2 className="sec-h2">Wherever you&rsquo;re starting from, <br className="bk"/>you take the <span className="em">first clear step</span></h2></div>
          <div className="personas reveal">
            <div className="persona"><span className="persona-tag">Class 10, 11 &amp; 12</span>
              <h3>The early starter</h3>
              <p>A Class 10, 11, or 12 student starting your CLAT preparation and wanting to start it right.</p></div>
            <div className="persona"><span className="persona-tag">Dropper</span>
              <h3>The dropper</h3>
              <p>A dropper who has tried before and needs a fresher, sharper strategy this time.</p></div>
            <div className="persona"><span className="persona-tag">First-year &middot; reattempting</span>
              <h3>The reattempter</h3>
              <p>A first-year college student planning to reattempt CLAT alongside your degree.</p></div>
            <div className="persona"><span className="persona-tag">Parent</span>
              <h3>The parent who wants clarity</h3>
              <p>A parent who wants to understand how to genuinely support your child&rsquo;s preparation.</p></div>
          </div>
          <div style={{textAlign:"center",marginTop:"clamp(30px,3.6vw,44px)"}}>
            <p style={{maxWidth:"52ch",margin:"0 auto clamp(18px,2vw,24px)",fontSize:"16px",color:"var(--ink)"}}>You do not have to figure this out alone, and you do not have to figure it out by trial and error. Take the first clear step toward your NLU seat on 12th July.</p>
            <a className="cta" href="#register"><span>Register Now for <s className="cta-was">&#8377;999</s> FREE</span>
              <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5"/></svg></span></a>
          </div>
        </div>
      </section>


      <section className="midband stage">
        <span className="stage-grain" aria-hidden="true"></span>
        <div className="inner" style={{position:"relative"}}>
          <h2>Stop preparing without a map. <span className="em">Come get yours.</span></h2>
          <a className="cta" href="#register"><span>Register Now for <s className="cta-was">&#8377;999</s> FREE</span>
            <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5"/></svg></span></a>
          <p className="cta-note"><span className="pin">&#9679;</span> 100% free &middot; Limited seats &middot; 12th July in person</p>
        </div>
      </section>


      <section className="section">
        <div className="inner">
          <div className="sec-head"><span className="eyebrow">Before You Register</span>
            <h2 className="sec-h2">The honest <span className="em">answers</span></h2></div>
          <div className="faq reveal">
            <details><summary><span className="faq-q">How do I join the seminar?</span><span className="faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5"/></svg></span></summary><p className="faq-a">Register on this page by filling in your details. Once you are registered, your seat is confirmed and you simply come to the venue (Constitution Club of India, New Delhi) on 12th July, Sunday, between 11 AM and 2 PM. There is nothing else to arrange.</p></details>
            <details open><summary><span className="faq-q">Do I have to pay anything?<span className="faq-most"><span className="dot"></span>Most asked</span></span><span className="faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5"/></svg></span></summary><p className="faq-a">No. The seminar is normally priced at &#8377;999, but your registration today is completely free. There is no charge to attend and nothing to pay at the door.</p></details>
            <details><summary><span className="faq-q">How long is the seminar?</span><span className="faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5"/></svg></span></summary><p className="faq-a">It runs for 3 hours, enough time to walk through the full CLAT roadmap and still answer your questions.</p></details>
            <details><summary><span className="faq-q">Can I ask my own questions?</span><span className="faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5"/></svg></span></summary><p className="faq-a">Yes. There is a dedicated Q&amp;A, so you can put your real doubts about CLAT prep, strategy, and NLU admissions straight to Dr. Surabhi and the team.</p></details>
            <details><summary><span className="faq-q">Who is this seminar for?</span><span className="faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5"/></svg></span></summary><p className="faq-a">Class 10, 11 and 12 students, droppers, first-year students planning to reattempt, and parents who want clarity.</p></details>
            <details><summary><span className="faq-q">Will it be in English or Hindi?</span><span className="faq-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8l5 5 5-5"/></svg></span></summary><p className="faq-a">Majorly English, explained simply so every student can follow.</p></details>
          </div>
        </div>
      </section>


      <section className="section stage finale">
        <span className="stage-grain" aria-hidden="true"></span>
        <div className="inner" style={{position:"relative"}}>
          <span className="eyebrow" style={{display:"block",marginBottom:"clamp(18px,2vw,24px)"}}>YOUR SEAT IS WAITING</span>
          <p className="finale-quote">Somewhere a student with your exact marks is about to take the NLU seat you wanted, for one reason only: they had a <span className="em">plan</span>, and you were still guessing.</p>
          <p className="finale-sub">You can fix that in 3 hours on 12th July. Or keep guessing until results day.</p>
          <a className="cta hero-cta" href="#register"><span>Register Now for <s className="cta-was">&#8377;999</s> FREE</span>
            <span className="cta-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5"/></svg></span></a>
          <p className="cta-note"><span className="pin">&#9679;</span> 100% free &middot; Limited seats &middot; 12th July in person</p>
          <div className="colophon">
            <p className="disclaimer"><b>Disclaimer:</b> CLAT Possible is an education and coaching seminar. The information shared in this seminar is for educational and informational purposes only and does not constitute a guarantee of admission, rank, or any specific outcome. Individual results may vary and depend on each student&rsquo;s own effort, consistency, and preparation.</p>
            <p className="disclaimer">This website is operated and maintained by CLAT Possible. Use of this website is governed by our <a href="/terms">Terms &amp; Conditions</a> and <a href="/privacy">Privacy Policy</a>. We do not guarantee specific results or admission to any National Law University. Results vary and depend on individual effort, consistency of preparation, and other factors outside our control.</p>
            <p className="disclaimer">All content is the intellectual property of CLAT Possible. Any duplication, reproduction, or distribution without written permission is strictly prohibited.</p>
            <p className="disclaimer">This website is owned and operated by CLAT Possible.</p>
            <p className="colophon-legal"><a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a> &middot; <a href="/refund">Refund</a> &middot; &copy; 2026 CLAT Possible</p>
          </div>
        </div>
      </section>
      <a className="mcta" id="mcta" href="#register">
        <span className="mcta-price"><span className="mcta-was">&#8377;999</span>FREE<span className="mcta-sub">Limited seats</span></span>
        <span className="mcta-btn">Register Free <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5.5L15.5 10 11 14.5"/></svg></span>
      </a>
      <RegisterModal />
      <FunnelScripts />
    </>
  );
}
