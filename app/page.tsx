import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Gallery />
      </main>
    </div>
  );
}