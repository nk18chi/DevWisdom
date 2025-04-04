import { Navbar } from '@/components/Navbar';
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
