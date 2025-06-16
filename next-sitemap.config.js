/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// ブログ記事のスラッグと最終更新日を取得する関数
const getBlogPosts = () => {
  const postsDirectory = path.join(process.cwd(), 'public/content');
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const allContents = fs.readdirSync(postsDirectory, { withFileTypes: true });
  
  return allContents
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(({ name }) => {
      const slug = name.replace('.md', '');
      const filePath = path.join(postsDirectory, name);
      
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        const stats = fs.statSync(filePath);
        
        // 記事内のdateフィールドまたはファイル更新日を使用
        const lastmod = data.date 
          ? new Date(data.date).toISOString() 
          : stats.mtime.toISOString();
          
        return { slug, lastmod };
      } catch (error) {
        console.warn(`Failed to parse ${name}:`, error.message);
        return { slug, lastmod: new Date().toISOString() };
      }
    });
};

// ページング用のURLを生成する関数
const getPaginationPages = (totalPosts, postsPerPage = 5) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pages = [];
  
  for (let page = 2; page <= totalPages; page++) {
    pages.push({
      loc: `/blog?page=${page}`,
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    });
  }
  
  return pages;
};

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://rhiroe.github.io',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    additionalSitemaps: [
      'https://rhiroe.github.io/sitemap.xml',
    ],
  },
  // 追加のページを動的に生成
  additionalPaths: async (config) => {
    const blogPosts = getBlogPosts();
    
    const blogPages = blogPosts.map(({ slug, lastmod }) => ({
      loc: `/blog/${slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod,
    }));

    // 静的ページも追加
    const staticPages = [
      {
        loc: '/',
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/blog',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/profile',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      },
    ];

    return [...staticPages, ...blogPages, ...getPaginationPages(blogPosts.length, 5)];
  },
  // 除外するパス
  exclude: ['/api/*'],
  // 設定オプション
  generateIndexSitemap: false,
  // GitHub Pages用の静的エクスポート時はoutディレクトリに出力
  outDir: process.env.EXPORT === 'true' ? './out' : './public',
};
