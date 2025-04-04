import { describe, expect, it } from 'vitest';
import Home from './page';
import { render, screen } from '@testing-library/react';

describe('Landing Page', () => {
  it('Should render the header component', async () => {
    render(await Home());
    const nav = screen.getByTestId('navigation');
    expect(nav).toBeInTheDocument();
  });
  it('Should render the hero component', async () => {
    render(await Home());
    const hero = screen.getByTestId('hero');
    expect(hero).toBeInTheDocument();
  });
  it('Should render the tag list component', async () => {
    render(await Home());
    const tagList = screen.getByTestId('tag-list');
    expect(tagList).toBeInTheDocument();
  });
  it('Should render the footer component', async () => {
    render(await Home());
    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
  });
});
