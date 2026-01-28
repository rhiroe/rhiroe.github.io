import { getAllPosts, getPostBySlug, resetCache } from '../../lib/postsApi';

global.fetch = jest.fn();

const mockPostsIndex = [
  {
    slug: 'test-post',
    title: 'Test Post',
    date: '2024-01-01',
    excerpt: 'Test excerpt',
    tags: ['test'],
  },
];

const mockMarkdownContent = `---
title: Test Post
date: '2024-01-01'
tags: ['test']
---

# Test Content

This is a test post.
`;

describe('postsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the cache before each test
    resetCache();
  });

  describe('getAllPosts', () => {
    it('fetches all posts from posts-index.json', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostsIndex,
      });

      const posts = await getAllPosts();

      expect(fetch).toHaveBeenCalledWith('/posts-index.json');
      expect(posts).toEqual(mockPostsIndex);
    });

    it('throws error when fetch fails', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(getAllPosts()).rejects.toThrow('Failed to fetch posts index: Not Found');
    });

    it('handles network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getAllPosts()).rejects.toThrow('Network error');
    });
  });

  describe('getPostBySlug', () => {
    beforeEach(async () => {
      // Load posts index before each test
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostsIndex,
      });
      await getAllPosts();
      jest.clearAllMocks();
    });

    it('fetches a post by slug', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        text: async () => mockMarkdownContent,
      });

      const content = await getPostBySlug('test-post');

      expect(fetch).toHaveBeenCalledWith('/content/test-post.md');
      expect(content).toHaveProperty('content', mockMarkdownContent);
    });

    it('throws error when post is not found in index', async () => {
      await expect(getPostBySlug('non-existent')).rejects.toThrow(
        'Post not found: non-existent'
      );
    });
  });
});
