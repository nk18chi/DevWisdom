import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('Should show the title', async () => {
    render(<Navbar />);
    const title = screen.getAllByText('Dev Wisdom');
    expect(title.length).toBeGreaterThan(0);
    expect(title[0]).toBeInTheDocument();
  });
  it('Should redirect to the home page when the logo is clicked', async () => {
    render(<Navbar />);
    const title = screen.getAllByText('Dev Wisdom');
    title[0].click();
    expect(window.location.href).toBe('http://localhost:3000/');
  });
  it('Should show the login button', async () => {
    render(<Navbar />);
    const login = screen.getByText('Log in');
    expect(login).toBeInTheDocument();
  });
  it('Should show the signup button', async () => {
    render(<Navbar />);
    const signup = screen.getByText('Sign up');
    expect(signup).toBeInTheDocument();
  });
});
