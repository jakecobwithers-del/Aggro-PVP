import Navigation from '@/components/navigation';
import HeroSection from '@/components/hero-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
    </div>
  );
}