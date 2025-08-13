export const metadata = {
  title: "About Me",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">
          Passionate game developer and level designer with expertise in creating 
          immersive gaming experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6">Background</h2>
          <div className="space-y-4 text-lg opacity-90">
            <p>
              I'm a dedicated game developer specializing in level design and technical implementation. 
              My passion lies in crafting engaging gameplay experiences that challenge and delight players.
            </p>
            <p>
              With experience in both professional and personal projects, I bring creativity 
              and technical expertise to every challenge I tackle.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Game Development</h3>
              <ul className="text-sm space-y-1 opacity-80">
                <li>• Level Design</li>
                <li>• Game Mechanics</li>
                <li>• Player Experience</li>
                <li>• Prototyping</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-600">Technical Skills</h3>
              <ul className="text-sm space-y-1 opacity-80">
                <li>• Unity/Unreal</li>
                <li>• C# Programming</li>
                <li>• 3D Modeling</li>
                <li>• Version Control</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Let's Work Together</h2>
        <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
          I'm always interested in new opportunities and collaborations. 
          Whether it's a commercial project or an innovative experiment, let's create something amazing.
        </p>
        <div className="flex justify-center gap-4">
          <a href="mailto:contact@odissey.space" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Get In Touch
          </a>
          <a href="/resume.pdf" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
}


