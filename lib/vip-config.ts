// Single source of truth for the VIP upsell (One-Time Offer → Razorpay → thank-you).
// Pure constants + tiny helpers, no "use client", so both server routes and client
// components can import it. Price is read from NEXT_PUBLIC_VIP_PRICE_RUPEES (public,
// not a secret) so the display and the server-side order amount stay in sync.

export const VIP_CONFIG = {
  brandName: "CLAT Possible",
  productName: "CLAT Possible — VIP Seat Upgrade",
  currency: "INR",
  defaultPriceRupees: 99,
} as const;

export type VipPerk = {
  key: string;
  title: string;
  blurb: string;
  image: string; // drop a generated graphic here; falls back to the inline icon
};

// The three VIP perks, elaborated for the offer page.
export const VIP_PERKS: VipPerk[] = [
  {
    key: "founders",
    title: "1-on-1 Guidance Session with the Founders",
    blurb:
      "Sit face-to-face with the CLAT Possible founders and get YOUR questions answered — your strengths, your gaps, and the fastest route to your target NLU. No generic advice.",
    image: "/perks/founders.png",
  },
  {
    key: "circle",
    title: "Private Circle: CLAT Achievers & NLU Students",
    blurb:
      "Get into the room with people who have actually cracked CLAT. Ask what worked, learn what to avoid, and build the network most aspirants never get access to.",
    image: "/perks/circle.png",
  },
  {
    key: "roadmap",
    title: "Personalized Roadmap to a Top NLU",
    blurb:
      "A step-by-step plan built around your level, your target, and your timeline — so every week of preparation actually moves you closer to a seat, not just busywork.",
    image: "/perks/roadmap.png",
  },
];

export type VipFounder = {
  name: string;
  role: string;
  photo: string;
  bio: string;
  focus?: string; // object-position for the square crop (default "center 22%")
};

// Founder photos: Surabhi's existing image is reused; add Satyam's at the path below.
export const VIP_FOUNDERS: VipFounder[] = [
  {
    name: "Dr. Surabhi Modi Sahai",
    role: "MD & CEO, CLAT Possible",
    photo: "/herocoachimg.webp",
    bio: "Built the academic foundation CLAT Possible runs on and has personally mentored thousands of students from confused beginners to NLU admits.",
  },
  {
    name: "Satyam Sahai",
    role: "Entrepreneur · Founder, CLAT Possible",
    photo: "/Satyam-Image.jpeg",
    bio: "Works hands-on with serious aspirants on strategy, discipline, and the exact execution plan that turns a target NLU into an admit.",
    focus: "center top", // anchor to the top so his full head/hair is never cropped
  },
];

export type VipAchiever = {
  name: string;
  college: string; // where they are / went (highlighted)
  detail: string; // rank + exam line
  photo?: string; // empty => initials-avatar fallback
  // Non-destructive framing for the circular avatar: `focus` is the face point
  // (object-position / transform-origin), `zoom` scales in so the face fills
  // the circle with no leftover background (default focus "center 26%", zoom 1).
  focus?: string;
  zoom?: number;
};

// Real CLAT achievers & NLU students the VIP gets a private discussion with.
// Photos live in public/achievers (Akashdeep's is pending — left blank).
export const VIP_ACHIEVERS: VipAchiever[] = [
  { name: "Shivangi Misra", college: "NLSIU Bangalore", detail: "AIR 49 · CLAT 2018", photo: "/achievers/shivangi-misra.png", focus: "50% 30%", zoom: 1.25 },
  { name: "Raghav Kohli", college: "Cambridge", detail: "AIR 487 · CLAT 2016", photo: "/achievers/raghav-kohli.png", focus: "49% 43%", zoom: 1.75 },
  { name: "Ankita Gupta", college: "NALSAR → Harvard", detail: "AIR 64 · CLAT 2017", photo: "/achievers/ankita-gupta.jpg", focus: "52% 46%", zoom: 1.6 },
  { name: "Akashdeep Singh", college: "NLSIU Bangalore", detail: "AILET 2015 Rank 1 · CLAT 2025 Rank 7", photo: "/achievers/akashdeep-singh.png", focus: "50% 42%", zoom: 1.2 },
  { name: "Anany Misra", college: "NLU Delhi", detail: "AIR 32 · AILET 2015", photo: "/achievers/anany-misra.png", focus: "50% 35%", zoom: 1.05 },
  { name: "Harsh Srivastav", college: "NLSIU Bangalore", detail: "AIR 26 · CLAT 2016", photo: "/achievers/harsh-srivastav.png", focus: "50% 30%", zoom: 3.6 },
];

// Server-authoritative price (rupees). Reads the public env; falls back to default.
export function getVipPriceRupees(): number {
  const n = parseInt(process.env.NEXT_PUBLIC_VIP_PRICE_RUPEES || "", 10);
  return Number.isFinite(n) && n > 0 ? n : VIP_CONFIG.defaultPriceRupees;
}

export function getVipCompareRupees(): number {
  const n = parseInt(process.env.NEXT_PUBLIC_VIP_COMPARE_RUPEES || "", 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
