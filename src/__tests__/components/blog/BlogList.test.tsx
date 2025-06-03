import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BlogList } from '../../../components/blog/BlogList';

// Next.js Link コンポーネントをモック化
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const mockPosts = [
  {
    slug: 'test-post-1',
    title: 'First Test Post',
    date: '2023-01-01',
    excerpt: 'This is the first test post excerpt',
    tags: ['javascript', 'react']
  },
  {
    slug: 'test-post-2',
    title: 'Second Test Post',
    date: '2023-01-02',
    excerpt: 'This is the second test post excerpt',
    tags: ['typescript', 'nextjs']
  },
  {
    slug: 'test-post-3',
    title: 'Third Test Post',
    date: '2023-01-03',
    excerpt: 'This is the third test post excerpt'
    // tagsが無いケース
  }
];

describe('BlogList Component', () => {
  test('should render all posts', () => {
    render(<BlogList posts={mockPosts} />);
    
    expect(screen.getByText('First Test Post')).toBeInTheDocument();
    expect(screen.getByText('Second Test Post')).toBeInTheDocument();
    expect(screen.getByText('Third Test Post')).toBeInTheDocument();
  });

  test('should render post excerpts', () => {
    render(<BlogList posts={mockPosts} />);
    
    expect(screen.getByText('This is the first test post excerpt')).toBeInTheDocument();
    expect(screen.getByText('This is the second test post excerpt')).toBeInTheDocument();
    expect(screen.getByText('This is the third test post excerpt')).toBeInTheDocument();
  });

  test('should render formatted dates', () => {
    render(<BlogList posts={mockPosts} />);
    
    // 日本語フォーマットの日付をチェック
    expect(screen.getByText('2023/1/1')).toBeInTheDocument();
    expect(screen.getByText('2023/1/2')).toBeInTheDocument();
    expect(screen.getByText('2023/1/3')).toBeInTheDocument();
  });

  test('should render tags when available', () => {
    render(<BlogList posts={mockPosts} />);
    
    // 最初の投稿のタグ
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    
    // 2番目の投稿のタグ
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
  });

  test('should not render tags section when tags are not provided', () => {
    const postsWithoutTags = [
      {
        slug: 'no-tags-post',
        title: 'Post Without Tags',
        date: '2023-01-01',
        excerpt: 'This post has no tags'
      }
    ];
    
    render(<BlogList posts={postsWithoutTags} />);
    
    expect(screen.getByText('Post Without Tags')).toBeInTheDocument();
    // タグが無い場合はタグ用のChipコンポーネントが表示されない
  });

  test('should create correct links to blog posts', () => {
    render(<BlogList posts={mockPosts} />);
    
    const links = screen.getAllByRole('link');
    
    expect(links[0]).toHaveAttribute('href', 'blog/test-post-1');
    expect(links[1]).toHaveAttribute('href', 'blog/test-post-2');
    expect(links[2]).toHaveAttribute('href', 'blog/test-post-3');
  });

  test('should handle empty posts array', () => {
    render(<BlogList posts={[]} />);
    
    // グリッドコンテナは存在するが、投稿は無い
    expect(screen.queryByText('First Test Post')).not.toBeInTheDocument();
  });

  test('should render posts with all required elements', () => {
    render(<BlogList posts={[mockPosts[0]]} />);
    
    // タイトルがh2要素として表示される
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('First Test Post');
    
    // 日付がtime要素として表示される
    const time = screen.getByText('2023/1/1');
    expect(time.tagName.toLowerCase()).toBe('time');
  });
});
