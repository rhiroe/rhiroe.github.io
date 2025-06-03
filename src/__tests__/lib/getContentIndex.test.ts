import { getPostSlugs, getPostBySlug, getAllPosts } from '../../lib/getContentIndex';
import fs from 'fs';
import matter from 'gray-matter';

// fs と matter をモック化
jest.mock('fs');
jest.mock('gray-matter');

const mockFs = fs as jest.Mocked<typeof fs>;
const mockMatter = jest.mocked(matter);

describe('getContentIndex', () => {
  const originalCwd = process.cwd;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // process.cwd をモック化
    process.cwd = jest.fn().mockReturnValue('/mock/workspace');
  });

  afterEach(() => {
    process.cwd = originalCwd;
  });

  describe('getPostSlugs', () => {
    test('should return slugs from markdown files', () => {
      // fs.readdirSync をモック化
      mockFs.readdirSync.mockReturnValue([
        { name: 'test-post-1.md', isFile: () => true } as any,
        { name: 'test-post-2.md', isFile: () => true } as any,
        { name: 'subfolder', isFile: () => false } as any,
      ]);

      const slugs = getPostSlugs();
      
      expect(slugs).toEqual(['test-post-1', 'test-post-2']);
      expect(mockFs.readdirSync).toHaveBeenCalledWith(
        expect.stringContaining('public/content'),
        { withFileTypes: true }
      );
    });

    test('should handle empty directory', () => {
      mockFs.readdirSync.mockReturnValue([]);

      const slugs = getPostSlugs();
      
      expect(slugs).toEqual([]);
    });
  });

  describe('getPostBySlug', () => {
    test('should return post data for specified fields', () => {
      const mockContent = '# Test Post\n\nThis is a test post.';
      const mockData = {
        title: 'Test Post',
        date: '2023-01-01',
        excerpt: 'This is a test excerpt',
        tags: ['test', 'sample']
      };

      mockFs.readFileSync.mockReturnValue(mockContent);
      mockMatter.mockReturnValue({
        data: mockData,
        content: mockContent
      });

      const post = getPostBySlug('test-post', ['slug', 'title', 'date', 'content', 'excerpt', 'tags']);

      expect(post).toEqual({
        slug: 'test-post',
        title: 'Test Post',
        date: '2023-01-01',
        content: mockContent,
        excerpt: 'This is a test excerpt',
        tags: ['test', 'sample']
      });

      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('test-post.md'),
        'utf8'
      );
      expect(mockMatter).toHaveBeenCalledWith(mockContent);
    });

    test('should handle missing optional fields', () => {
      const mockContent = '# Test Post';
      const mockData = {
        title: 'Test Post',
        date: '2023-01-01'
      };

      mockFs.readFileSync.mockReturnValue(mockContent);
      mockMatter.mockReturnValue({
        data: mockData,
        content: mockContent
      });

      const post = getPostBySlug('test-post', ['slug', 'title', 'excerpt', 'tags']);

      expect(post).toEqual({
        slug: 'test-post',
        content: '',
        title: 'Test Post',
        date: '',
        excerpt: '',
        tags: []
      });
    });
  });

  describe('getAllPosts', () => {
    test('should return all posts sorted by date', () => {
      // getPostSlugs をモック化
      mockFs.readdirSync.mockReturnValue([
        { name: 'post-1.md', isFile: () => true } as any,
        { name: 'post-2.md', isFile: () => true } as any,
      ]);

      // 各ポストのデータをモック化
      const mockPosts = [
        { title: 'Post 1', date: '2023-01-01' },
        { title: 'Post 2', date: '2023-01-02' }
      ];

      mockFs.readFileSync
        .mockReturnValueOnce('# Post 1')
        .mockReturnValueOnce('# Post 2');

      mockMatter
        .mockReturnValueOnce({ data: mockPosts[0], content: '# Post 1' })
        .mockReturnValueOnce({ data: mockPosts[1], content: '# Post 2' });

      const posts = getAllPosts(['title', 'date']);

      expect(posts).toHaveLength(2);
      // 新しい日付が最初に来ることを確認
      expect(posts[0].date).toBe('2023-01-02');
      expect(posts[1].date).toBe('2023-01-01');
    });
  });
});
