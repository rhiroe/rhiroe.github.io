import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <MemoryRouter>{component}</MemoryRouter>
    </HelmetProvider>
  );
};

describe('Home', () => {
  it('renders the home page with title', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('rhiroe')).toBeInTheDocument();
  });

  it('renders navigation cards', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('📝 Blog')).toBeInTheDocument();
    expect(screen.getByText('🎤 Presentations')).toBeInTheDocument();
    expect(screen.getByText('👤 Profile')).toBeInTheDocument();
  });

  it('renders links to each section', () => {
    renderWithRouter(<Home />);
    const blogLink = screen.getByRole('link', { name: /blog/i });
    const presentationsLink = screen.getByRole('link', { name: /presentations/i });
    const profileLink = screen.getByRole('link', { name: /profile/i });

    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(presentationsLink).toHaveAttribute('href', '/presentations');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });
});
