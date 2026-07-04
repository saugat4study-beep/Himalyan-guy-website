import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "The Himalayan Guy — Exploring Nepal One Trail at a Time",
    template: "%s | The Himalayan Guy",
  },
  description: "Trekking journals, village stories, and mountain photography from the Nepal Himalaya.",
  openGraph: {
    type: "website",
    siteName: "The Himalayan Guy",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
