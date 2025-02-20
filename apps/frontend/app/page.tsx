import { Button } from '@workspace/ui/components/button';

export default async function Home() {
  return (
    <main>
      <div>Header</div>
      <div>Random Wisdom</div>
      <div>Random Button</div>
      <div>Tag</div>
      <div>Tag List</div>
      <div>Footer</div>

      <Button>Click me</Button>
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
