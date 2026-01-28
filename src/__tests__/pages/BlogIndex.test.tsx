import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import BlogIndex from '../../pages/BlogIndex';
import * as postsApi from '../../lib/postsApi';

jest.mock('../../lib/postsApi');

const mockPosts = [
  {
    slug: 'test-post-1',
    title: 'Test Post 1',
    date: '2024-01-01',
    excerpt: 'Test excerpt 1',
    tags: ['test'],
  },
  {
    slug: 'test-post-2',
    title: 'Test Post 2',
    date: '2024-01-02',
    excerpt: 'Test excerpt 2',
    tags: ['test'],
  },
];

const renderWithRouter = (component: React.ReactElement, initialEntries = ['/blog']) => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
    </HelmetProvider>
  );
};

describe('BlogIndex', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (postsApi.getAllPosts as jest.Mock).mockResolvedValue(mockPosts);
  });

  it('renders blog index page', async () => {
    renderWithRouter(<BlogIndex />);
    
    await waitFor(() => {
      expect(screen.queryByText('Test Post 1')).toBeInTheDocument();
    });
  });

  it('loads and displays blog posts', async () => {
    renderWithRouter(<BlogIndex />);

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });

  it('calls getAllPosts on mount', async () => {
    renderWithRouter(<BlogIndex />);

    await waitFor(() => {
      expect(postsApi.getAllPosts).toHaveBeenCalledTimes(1);
    });
  });

  it('handles empty posts list', async () => {
    (postsApi.getAllPosts as jest.Mock).mockResolvedValue([]);
    
    renderWithRouter(<BlogIndex />);

    await waitFor(() => {
      expect(postsApi.getAllPosts).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (postsApi.getAllPosts as jest.Mock).mockRejectedValue(new Error('API Error'));

    renderWithRouter(<BlogIndex />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
