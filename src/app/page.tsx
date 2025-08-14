import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import Pico8Player from "@/components/Pico8Player";

export default function Home() {
  const projects = getAllProjects();
  const featured = projects.slice(0, 4);
  return (
    <div className="max-w-4xl mx-auto py-8 md:py-16 px-4">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-pixel">odissey.space</h1>
        <p className="text-lg md:text-xl opacity-80 mb-6 md:mb-8 font-poppins">Level / Game / Technical Design Portfolio</p>
        <p className="text-base md:text-lg opacity-70 max-w-2xl mx-auto">
          Explore my journey through game development, level design, and technical innovation. 
          From professional projects to personal experiments.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
        <Link href="/projects/professional" className="group p-4 md:p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-blue-600 font-poppins">Professional Projects</h3>
          <p className="text-xs md:text-sm opacity-70">Commercial games and client work</p>
        </Link>
        <Link href="/projects/personal" className="group p-4 md:p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-blue-600 font-poppins">Personal Projects</h3>
          <p className="text-xs md:text-sm opacity-70">Experiments and passion projects</p>
        </Link>
        <Link href="/projects" className="group p-4 md:p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-blue-600 font-poppins">All Projects</h3>
          <p className="text-xs md:text-sm opacity-70">Complete portfolio overview</p>
        </Link>
        <Link href="/about" className="group p-4 md:p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-blue-600 font-poppins">About Me</h3>
          <p className="text-xs md:text-sm opacity-70">My story and expertise</p>
        </Link>
      </div>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 font-poppins">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((p) => (
            <div key={p.slug} className="group border rounded-lg p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                <Link href={`/projects/${p.slug}`}>{p.title}</Link>
              </div>
              <div className="text-sm opacity-70 mb-3">
                <span className={`px-2 py-1 rounded text-xs ${p.projectType === "professional" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                  {p.projectType === "professional" ? "Professional" : "Personal"}
                </span>
                {p.year && <span className="ml-2">{p.year}</span>}
              </div>
              {p.description && (
                <p className="text-sm opacity-80">{p.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 font-poppins">PICO-8 Games</h2>
        <div className="flex justify-center px-4">
          <div className="w-full max-w-2xl">
            <Pico8Player width={512} height={512} />
          </div>
        </div>
      </section>
    </div>
  );
}
