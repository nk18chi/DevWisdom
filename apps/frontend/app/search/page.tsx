import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { TagList } from '@/components/TagList';
import { Button } from '@workspace/ui/components/button';

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-screen-xl px-2">
      <Navbar />
      <Button asChild variant="outline" size="sm">
        <span>test</span>
      </Button>
      ,
      {/* <Hero />
      <TagList />
      <Footer /> */}
    </main>
  );
}
