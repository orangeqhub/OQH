import { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AppErrorBoundary } from './components/layout/AppErrorBoundary'
import { SceneBackground } from './components/3d/SceneBackground'
import { Navbar } from './components/layout/Navbar'
import { CustomCursor } from './components/ui/CustomCursor'
import { FloatingContact } from './components/ui/FloatingContact'
import { PageTransition } from './components/animations/PageTransition'
import { initSmoothScroll } from './lib/smoothScroll'
import { listenPointer } from './lib/sceneStore'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import Industries from './pages/Industries'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    initSmoothScroll()
    listenPointer()
  }, [])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SceneBackground />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <AppErrorBoundary key={pathname}>
          <Outlet />
        </AppErrorBoundary>
      </main>
      <FloatingContact />
      <PageTransition />
      <CustomCursor />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectDetail />} />
          <Route path="industries" element={<Industries />} />
          <Route path="careers" element={<Careers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
