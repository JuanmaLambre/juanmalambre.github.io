import { Sidebar } from "./components/Sidebar/Sidebar";
import { MobileNavbar } from "./components/MobileNavbar/MobileNavbar";
import { Skills } from "./components/Skills/Skills";
import { Timeline } from "./components/Timeline/Timeline";
import { ProjectsGrid } from "./components/Projects/ProjectsGrid";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";
import { About } from "./components/About/About";

export default function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <MobileNavbar />
      <Sidebar />
      <div className="lg:ml-[300px] flex-1 flex flex-col min-h-screen pt-16 lg:pt-0">
        <main className="w-full flex-1 px-4 sm:px-8 lg:px-16 py-12 lg:py-20 lg:max-w-3xl">
          <About />
          <ProjectsGrid />
          <Timeline />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
