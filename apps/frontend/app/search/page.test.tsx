import React from 'react';
import { describe, expect, it } from 'vitest';
import SearchPage from './page';
import { render, screen } from '@testing-library/react';

describe('Search Page', () => {
  describe('Tag', () => {
    it('Should render the header', async () => {
      render(<SearchPage />);
      const headers = screen.getAllByText('Dev Wisdom');
      expect(headers.length).toBeGreaterThan(0);
      expect(headers[0]).toBeInTheDocument();
    });
    it.todo('Should render the headline');
    it.todo('Should render the items');
    it.todo('Should render the "show more" button if there are more items');
  });
});
