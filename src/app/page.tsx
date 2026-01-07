import Contact from "./components/contact"
import Hero from "./components/hero"
import Profile from "./components/profile"
import Projects from "./components/projects"
import Recognition from "./components/recognition"
import Skills from "./components/skills"

export default async function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <div id="main"></div>
      <Skills />
      <Projects />
      <Recognition />
      <Profile />
      <Contact />
    </main>
  )
}
