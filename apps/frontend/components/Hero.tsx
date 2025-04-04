import { ArrowDownRight } from 'lucide-react';

import { Avatar, AvatarImage } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';

interface HeroProps {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  reviews?: {
    count: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero = ({
  buttons = {
    primary: {
      text: 'Next Inspiration',
      url: 'https://www.shadcnblocks.com',
    },
    secondary: {
      text: 'View Details',
      url: 'https://www.shadcnblocks.com',
    },
  },
  reviews = {
    count: 200,
    avatars: [
      {
        src: 'https://www.shadcnblocks.com/images/block/avatar-1.webp',
        alt: 'Avatar 1',
      },
      {
        src: 'https://www.shadcnblocks.com/images/block/avatar-2.webp',
        alt: 'Avatar 2',
      },
      {
        src: 'https://www.shadcnblocks.com/images/block/avatar-3.webp',
        alt: 'Avatar 3',
      },
      {
        src: 'https://www.shadcnblocks.com/images/block/avatar-4.webp',
        alt: 'Avatar 4',
      },
      {
        src: 'https://www.shadcnblocks.com/images/block/avatar-5.webp',
        alt: 'Avatar 5',
      },
    ],
  },
}: HeroProps) => {
  return (
    <section id="hero" data-testid="hero">
      <div className="container grid items-center gap-10 lg:gap-20">
        <div className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left">
          <Testimonial />
          <div className="mb-12 flex w-full flex-col items-center gap-4 sm:flex-row justify-center">
            <span className="inline-flex items-center -space-x-4">
              {reviews.avatars.map((avatar, index) => (
                <Avatar key={index} className="size-12 border">
                  <AvatarImage src={avatar.src} alt={avatar.alt} />
                </Avatar>
              ))}
            </span>
            <div>
              <p className="text-muted-foreground text-left font-medium">from {reviews.count}+ likes</p>
            </div>
          </div>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            {buttons.primary && (
              <Button asChild className="w-full sm:w-auto">
                <a href={buttons.primary.url}>
                  {buttons.primary.text}
                  <ArrowDownRight className="ml-2 size-4" />
                </a>
              </Button>
            )}
            {buttons.secondary && (
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={buttons.secondary.url}>
                  {buttons.secondary.text}
                  <ArrowDownRight className="ml-2 size-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

interface TestimonialProps {
  quote?: string;
  author?: {
    name: string;
    role: string;
    avatar: {
      src: string;
      alt: string;
    };
  };
}

const Testimonial = ({
  quote = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig doloremque mollitia fugiat omnis! Porro facilis quo animi consequatur. Explicabo.',
  author = {
    name: 'Customer Name',
    role: 'Role',
    avatar: {
      src: 'https://www.shadcnblocks.com/images/block/avatar-1.webp',
      alt: 'Customer Name',
    },
  },
}: TestimonialProps) => {
  return (
    <section className="pt-28 pb-12">
      <div className="flex flex-col items-center text-center">
        <p className="mb-4 max-w-4xl px-8 font-medium lg:text-3xl">&ldquo;{quote}&rdquo;</p>
        <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">by {author.name}</p>
      </div>
    </section>
  );
};

export { Hero };
