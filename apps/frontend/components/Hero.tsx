import { ArrowDownRight } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import { RandomQuoteDocument, RandomQuoteQuery } from '@/gql/generated/types';
import { query } from '@/lib/ApolloClient';

const Hero = async () => {
  const { data } = await query<RandomQuoteQuery>({ query: RandomQuoteDocument });
  const randomQuote = data?.randomQuote;
  if (!randomQuote) {
    return null;
  }
  console.log('randomQuote', randomQuote);
  return (
    <section id="hero" data-testid="hero">
      <div className="container grid items-center gap-10 lg:gap-20">
        <div className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left">
          <Testimonial quote={randomQuote.content} authorName={randomQuote.author} />
          <div className="mb-12 flex w-full flex-col items-center gap-4 sm:flex-row justify-center">
            <span className="inline-flex items-center -space-x-4">
              {randomQuote.likedUsers.map((user, index) => (
                <Avatar key={index} className="size-12 border">
                  <AvatarImage src={user.avatar || ''} alt={user.displayName || ''} />
                  <AvatarFallback className="AvatarFallback" delayMs={600}>
                    {user.displayName?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </span>
            <div>
              <p className="text-muted-foreground text-left font-medium">from {randomQuote.likeCount}+ likes</p>
            </div>
          </div>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <a href="https://www.shadcnblocks.com">
                Next Inspiration
                <ArrowDownRight className="ml-2 size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href="https://www.shadcnblocks.com">
                View Details
                <ArrowDownRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialProps {
  quote: string;
  authorName: string;
}

const Testimonial = ({ quote, authorName }: TestimonialProps) => {
  return (
    <section className="pt-28 pb-12">
      <div className="flex flex-col items-center text-center">
        <p className="mb-4 max-w-4xl px-8 font-medium lg:text-3xl">&ldquo;{quote}&rdquo;</p>
        <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">by {authorName}</p>
      </div>
    </section>
  );
};

export { Hero };
