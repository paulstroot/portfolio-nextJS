import Contact from "./components/contact";
import Hero from "./components/hero";
import Profile from "./components/profile";
import Projects from "./components/projects";
import Recognition from "./components/recognition";
import Skills from "./components/skills";

import type { Metadata } from "next";
export const metadata: Metadata = {
  // title: "Paul Stroot",
  // description: "Web development without injuries.",
};

export default async function Home() {
  return (
    <main className="flex-1">
      <Hero />

      <Skills />
      <Projects />
      <Recognition />
      <Profile />
      <Contact />
    </main>
  );
}
