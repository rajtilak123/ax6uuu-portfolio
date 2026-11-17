import { useState } from 'react'
import { SmoothScroll } from './components/motion/SmoothScroll'
import { Navbar } from './components/navigation/Navbar'
import { Hero } from './components/hero/Hero'
import { About } from './components/about/About'
import { Services } from './components/services/Services'
import { FreeSampleCta } from './components/cta/FreeSampleCta'
import { Contact } from './components/contact/Contact'
import { VideoModal } from './components/video/VideoModal'
import type { ProjectItem } from './data/projects'

function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#F9F9FB] text-[#0E0F14] flex flex-col selection:bg-electric selection:text-white overflow-x-hidden relative">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Landmark */}
        <main className="flex-1">
          <Hero onSelectProject={handleSelectProject} isModalOpen={isModalOpen} />
          <About />
          <Services onSelectProject={handleSelectProject} />
          <FreeSampleCta />
          <Contact />
        </main>

        {/* Global Cinema Video Lightbox */}
        <VideoModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </SmoothScroll>
  )
}

export default App
