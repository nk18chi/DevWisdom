interface TagListProps {
  heading?: string;
  links?: {
    text: string;
    url: string;
  }[];
}

const TagList = ({
  heading = 'Tag List',
  links = [
    { text: 'Overview', url: '#' },
    { text: 'Pricing', url: '#' },
    { text: 'Marketplace', url: '#' },
    { text: 'Features', url: '#' },
    { text: 'Integrations', url: '#' },
    { text: 'Pricing', url: '#' },
    { text: 'About', url: '#' },
    { text: 'Team', url: '#' },
    { text: 'Blog', url: '#' },
    { text: 'Careers', url: '#' },
    { text: 'Contact', url: '#' },
    { text: 'Privacy', url: '#' },
    { text: 'Help', url: '#' },
    { text: 'Sales', url: '#' },
    { text: 'Advertise', url: '#' },
    { text: 'Twitter', url: '#' },
    { text: 'Instagram', url: '#' },
    { text: 'LinkedIn', url: '#' },
  ],
}: TagListProps) => {
  return (
    <section className="py-12">
      <div className="container flex flex-col items-center text-center">
        <h1 className="my-12 text-pretty text-2xl font-bold lg:text-4xl">{heading}</h1>
      </div>

      <ul className="container grid grid-cols-2 gap-4 lg:grid-cols-6 text-muted-foreground">
        {links.map((link, linkIdx) => (
          <li key={linkIdx} className="text-center font-medium hover:text-primary">
            <a href={link.url}>{link.text}</a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export { TagList };
