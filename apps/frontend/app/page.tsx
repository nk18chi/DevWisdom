import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { TagList } from '@/components/TagList';

export default async function Home() {
  return (
    <main className="mx-auto max-w-screen-xl px-2">
      <Navbar />
      <Hero />
      <TagList />
      <Footer />

      {/* <RelayPaginationComponent />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<>loading</>}>
          <ClientComponent />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<>loading</>}>
          <ServerComponent />
        </Suspense>
      </ErrorBoundary>
      <Link href="/sentry-example-page">Link</Link> */}
    </main>
  );
}
