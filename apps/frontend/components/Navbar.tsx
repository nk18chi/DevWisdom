import { Book, Menu, Sunset, Trees, Zap } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import Image from 'next/image';

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: {
      text: string;
      url: string;
    };
    signup: {
      text: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: '/',
    src: '/icon.png',
    alt: 'logo',
    title: 'Dev Wisdom',
  },
  auth = {
    login: { text: 'Log in', url: '#' },
    signup: { text: 'Sign up', url: '#' },
  },
}: NavbarProps) => {
  return (
    <section className="py-4">
      <nav className="hidden justify-between lg:flex">
        <div className="flex items-center gap-6">
          <a href={logo.url} className="flex items-center gap-2">
            <Image src={logo.src} width={32} height={32} alt={logo.alt} className="w-7 scale-x-[-1]" />
            <span className="text-lg font-semibold">{logo.title}</span>
          </a>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={auth.login.url}>{auth.login.text}</a>
          </Button>
          <Button asChild size="sm">
            <a href={auth.signup.url}>{auth.signup.text}</a>
          </Button>
        </div>
      </nav>
      <div className="block lg:hidden">
        <div className="flex items-center justify-between">
          <a href={logo.url} className="flex items-center gap-2">
            <Image src={logo.src} width={32} height={32} alt={logo.alt} className="w78 scale-x-[-1]" />
            <span className="text-lg font-semibold">{logo.title}</span>
          </a>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  <a href={logo.url} className="flex items-center gap-2">
                    <Image src={logo.src} width={32} height={32} alt={logo.alt} className="w-8" />
                    <span className="text-lg font-semibold">{logo.title}</span>
                  </a>
                </SheetTitle>
              </SheetHeader>
              <div className="my-6 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <Button asChild variant="outline">
                    <a href={auth.login.url}>{auth.login.text}</a>
                  </Button>
                  <Button asChild>
                    <a href={auth.signup.url}>{auth.signup.text}</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
