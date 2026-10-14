import { render, screen } from '@testing-library/react';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
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
    expect(screen.getByText('RHEO Studio')).toBeInTheDocument();
  });

  it('renders navigation cards', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('📝 Blog')).toBeInTheDocument();
    expect(screen.getByText('🎤 Presentations')).toBeInTheDocument();
  });

  it('renders links to each section', () => {
    renderWithRouter(<Home />);
    const blogLink = screen.getByRole('link', { name: /blog/i });
    const presentationsLink = screen.getByRole('link', { name: /presentations/i });

    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(presentationsLink).toHaveAttribute('href', '/presentations');
  });
});
