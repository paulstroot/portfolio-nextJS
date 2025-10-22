import { createTheme, ThemeModeScript, ThemeProvider } from "flowbite-react";
import type { Metadata } from "next";
import {
  Josefin_Sans,
  Libre_Baskerville,
  Montserrat,
  Playball,
  Roboto,
} from "next/font/google";
import "../../styles/style.css";
import Footer from "./components/footer";
import Header from "./components/header";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto", // Define a CSS variable
});
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre",
  weight: ["400", "700"],
});

const playball = Playball({
  subsets: ["latin"],
  variable: "--font-playball",
  weight: ["400"],
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["400", "700"],
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Paul Stroot - Full-Stack Stuntman",
  description:
    "Full-Stack web development. From React to WordPress, AI or Cloud, I've got you covered.",
  openGraph: {
    title: "Paul Stroot Web Developer",
    description: "Web development without injuries.",
    url: "http://portfolio.paulstroot.com",
    siteName: "Paul Stroot Web Developer",
    images: [
      {
        url: "http://portfolio.paulstroot.com/images/social-share.jpg", // Must be an absolute URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const customTheme = createTheme({
  button: {
    color: {
      default: "bg-primary hover:bg-primary-600 text-primary-contrast",
      primary: "bg-primary hover:bg-primary-600 text-primary-contrast",
      secondary: "bg-secondary hover:bg-secondary-600 text-secondary-contrast",
      accent: "bg-accent text-accent-contrast",
      alternative: "bg-accent text-accent-contrast",
      success: "bg-success text-light",
      info: "bg-info text-light",
      warning: "bg-warning text-dark",
      danger: "bg-danger text-light",
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${roboto.variable} ${libreBaskerville.variable} ${josefin.variable} ${playball.variable}`}
    >
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`theme-default font-body antialiased flex min-h-screen flex-col`}
      >
        <ThemeProvider theme={customTheme}>
          <Header />

          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
