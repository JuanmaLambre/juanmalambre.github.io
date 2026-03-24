import { Sidebar } from "./components/Sidebar/Sidebar";
import { Skills } from "./components/Skills/Skills";
import { Timeline } from "./components/Timeline/Timeline";
import { ProjectsGrid } from "./components/Projects/ProjectsGrid";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/Footer";

export default function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="ml-[300px] flex-1 flex flex-col min-h-screen">
        <main className="flex-1 px-16 py-20 max-w-3xl">
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
