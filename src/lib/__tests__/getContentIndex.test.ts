import fs from 'fs';
import path from 'path';

// Mock modules before importing the actual functions
jest.mock('fs');
jest.mock('gray-matter');

// Mock process.cwd to use actual current working directory
Object.defineProperty(process, 'cwd', {
  value: jest.fn().mockReturnValue(process.cwd()),
  configurable: true,
});

// Now import the functions to test
import { getPostSlugs, getPostBySlug, getAllPosts } from '../getContentIndex';

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;
const mockMatter = require('gray-matter') as jest.MockedFunction<any>;

describe('getContentIndex', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPostSlugs', () => {
    it('returns array of post slugs', () => {
      const mockDirents = [
        { name: 'post1.md', isFile: () => true },
        { name: 'post2.md', isFile: () => true },
        { name: 'folder', isFile: () => false },
        { name: 'post3.md', isFile: () => true },
      ];

      mockFs.readdirSync.mockReturnValue(mockDirents as any);

      const result = getPostSlugs();

      expect(result).toEqual(['post1', 'post2', 'post3']);
      expect(mockFs.readdirSync).toHaveBeenCalledWith(
        expect.stringContaining('/public/content'),
        { withFileTypes: true }
      );
    });

    it('returns empty array when no files exist', () => {
      mockFs.readdirSync.mockReturnValue([]);

      const result = getPostSlugs();

      expect(result).toEqual([]);
    });
  });

  describe('getPostBySlug', () => {
    const mockFileContent = `---
title: Test Post
date: 2023-01-01
excerpt: This is a test post
tags: [javascript, testing]
---

This is the content of the test post.`;

    beforeEach(() => {
      mockFs.readFileSync.mockReturnValue(mockFileContent);
      mockMatter.mockReturnValue({
        data: {
          title: 'Test Post',
          date: '2023-01-01',
          excerpt: 'This is a test post',
          tags: ['javascript', 'testing'],
        },
        content: '\nThis is the content of the test post.',
      });
    });

    it('returns post with all requested fields', () => {
      const fields = ['slug', 'title', 'date', 'content', 'excerpt', 'tags'];
      const result = getPostBySlug('test-post', fields);

      expect(result).toEqual({
        slug: 'test-post',
        title: 'Test Post',
        date: '2023-01-01',
        content: '\nThis is the content of the test post.',
        excerpt: 'This is a test post',
        tags: ['javascript', 'testing'],
      });

      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('/public/content/test-post.md'),
        'utf8'
      );
    });

    it('returns post with only requested fields', () => {
      const fields = ['slug', 'title'];
      const result = getPostBySlug('test-post', fields);

      expect(result).toEqual({
        slug: 'test-post',
        content: '',
        title: 'Test Post',
        date: '',
        excerpt: '',
      });
    });

    it('handles missing excerpt field', () => {
      mockMatter.mockReturnValue({
        data: {
          title: 'Test Post',
          date: '2023-01-01',
          tags: ['javascript'],
        },
        content: '\nContent without excerpt.',
      });

      const result = getPostBySlug('test-post', ['excerpt', 'tags']);

      expect(result.excerpt).toBe('');
      expect(result.tags).toEqual(['javascript']);
    });
  });

  describe('getAllPosts', () => {
    it('returns all posts sorted by date descending', () => {
      const mockDirents = [
        { name: 'post1.md', isFile: () => true },
        { name: 'post2.md', isFile: () => true },
        { name: 'post3.md', isFile: () => true },
      ];

      mockFs.readdirSync.mockReturnValue(mockDirents as any);

      // Mock different matter responses for sorting test
      mockMatter
        .mockReturnValueOnce({
          data: { title: 'Old Post', date: '2023-01-01' },
          content: 'Old content',
        })
        .mockReturnValueOnce({
          data: { title: 'New Post', date: '2023-12-31' },
          content: 'New content',
        })
        .mockReturnValueOnce({
          data: { title: 'Middle Post', date: '2023-06-15' },
          content: 'Middle content',
        });

      const result = getAllPosts(['slug', 'title', 'date']);

      expect(result).toHaveLength(3);
      expect(result[0].title).toBe('New Post'); // Latest first
      expect(result[1].title).toBe('Middle Post');
      expect(result[2].title).toBe('Old Post'); // Oldest last
    });

    it('returns empty array when no posts exist', () => {
      mockFs.readdirSync.mockReturnValue([]);

      const result = getAllPosts();

      expect(result).toEqual([]);
    });
  });
});
