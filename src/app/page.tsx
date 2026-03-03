import HeroSlider from "../components/sections/HeroSlider";
import AboutMe from "../components/sections/AboutMe";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <div className="font-sans">
      <HeroSlider />
      <AboutMe />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
}
