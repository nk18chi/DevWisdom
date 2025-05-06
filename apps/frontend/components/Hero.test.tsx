import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it.todo('Should show the quote');
  it.todo('Should show the author name');
  it.todo('Should show who liked the quote');
  it.todo('Should show the number of likes');
  it('Should show the button to show a new quote', async () => {
    render(<Hero />);
    const button = screen.getByText('Next Inspiration');
    expect(button).toBeInTheDocument();
  });
  it('Should show the button to view the quote details', async () => {
    render(<Hero />);
    const button = screen.getByText('View Details');
    expect(button).toBeInTheDocument();
  });
});
