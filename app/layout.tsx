import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CLAT Possible — Free In-Person CLAT Seminar · 5th July",
  description:
    "A free 3-hour, in-person CLAT seminar for Class 10, 11, 12 students and droppers, hosted by Dr. Surabhi Modi Sahai on 5th July. Walk out with one clear plan to a top NLU. Register free (₹999 FREE).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/funnel.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
