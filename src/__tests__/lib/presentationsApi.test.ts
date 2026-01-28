import { getAllPresentations, resetCache } from '../../lib/presentationsApi';

global.fetch = jest.fn();

const mockPresentations = [
  {
    slug: 'test-presentation',
    title: 'Test Presentation',
    date: '2024-01-01',
    path: '/presentations/test-presentation.html',
  },
];

describe('presentationsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the cache before each test
    resetCache();
  });

  describe('getAllPresentations', () => {
    it('fetches all presentations from presentations-index.json', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPresentations,
      });

      const presentations = await getAllPresentations();

      expect(fetch).toHaveBeenCalledWith('/presentations-index.json');
      expect(presentations).toEqual(mockPresentations);
    });

    it('throws error when fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(getAllPresentations()).rejects.toThrow(
        'Failed to fetch presentations index: Not Found'
      );
    });

    it('handles network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getAllPresentations()).rejects.toThrow('Network error');
    });

    it('returns empty array when presentations-index.json is empty', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const presentations = await getAllPresentations();

      expect(presentations).toEqual([]);
    });
  });
});
