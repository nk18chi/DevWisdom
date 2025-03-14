interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface TagListProps {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const TagList = ({
  heading = 'Tag List',
  logo = {
    src: 'https://www.shadcnblocks.com/images/block/block-1.svg',
    alt: 'blocks for shadcn/ui',
    title: 'Shadcnblocks.com',
    url: 'https://www.shadcnblocks.com',
  },
  tagline = 'Components made easy.',
  menuItems = [
    {
      title: 'Product',
      links: [
        { text: 'Overview', url: '#' },
        { text: 'Pricing', url: '#' },
        { text: 'Marketplace', url: '#' },
        { text: 'Features', url: '#' },
        { text: 'Integrations', url: '#' },
        { text: 'Pricing', url: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', url: '#' },
        { text: 'Team', url: '#' },
        { text: 'Blog', url: '#' },
        { text: 'Careers', url: '#' },
        { text: 'Contact', url: '#' },
        { text: 'Privacy', url: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Help', url: '#' },
        { text: 'Sales', url: '#' },
        { text: 'Advertise', url: '#' },
      ],
    },
    {
      title: 'Social',
      links: [
        { text: 'Twitter', url: '#' },
        { text: 'Instagram', url: '#' },
        { text: 'LinkedIn', url: '#' },
      ],
    },
  ],
  copyright = '© 2024 Copyright. All rights reserved.',
  bottomLinks = [
    { text: 'Terms and Conditions', url: '#' },
    { text: 'Privacy Policy', url: '#' },
  ],
}: TagListProps) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="container flex flex-col items-center text-center">
          <h1 className="my-6 text-pretty text-2xl font-bold lg:text-4xl">{heading}</h1>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {menuItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <ul className="space-y-4 text-muted-foreground">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="font-medium hover:text-primary">
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { TagList };
