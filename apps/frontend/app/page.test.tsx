import React from 'react';
import { describe, expect, it } from 'vitest';
import Home from './page';
import { render, screen } from '@testing-library/react';

describe('Landing Page', () => {
  it('Should render the header', async () => {
    render(<Home />);
    const header = screen.getByText('Dev Wisdom');
    expect(header).toBeInTheDocument();
  });
  it.todo('Should render the random wisdom');
  it.todo('Should render the random button');
  it.todo('Should render the tag headline');
  it.todo('Should render the tag list');
  it.todo('Should render the footer');
});
