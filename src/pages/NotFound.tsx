import { useScenePreset } from '../hooks/useScenePreset'
import { PageHero } from '../components/layout/PageHero'
import { PremiumButton } from '../components/ui/PremiumButton'
import './pages.css'

export default function NotFound() {
  useScenePreset('industries', 'Page not found')
  return (
    <div className="page">
      <PageHero eyebrow="404" lines={['This room', <>is <span className="accent-text">empty.</span></>]} lead="The page you’re looking for doesn’t exist or has moved.">
        <PremiumButton to="/">Back to home</PremiumButton>
        <PremiumButton to="/contact" variant="ghost">
          Contact us
        </PremiumButton>
      </PageHero>
    </div>
  )
}
