/**
 * 静的サイト用のRSS・Atomフィード生成スクリプト
 * Next.js build後に実行し、out/フォルダに静的XMLファイルを生成
 */

import { Feed } from 'feed';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

type Post = {
    slug: string;
    content: string;
    title: string;
    excerpt?: string;
    date: string;
    tags?: string[];
};

const postsDirectory = path.join(process.cwd(), "public/content");

const getPostSlugs = (): string[] => {
    const allContents = fs.readdirSync(postsDirectory, { withFileTypes: true });
    return allContents
        .filter((dirent) => dirent.isFile())
        .map(({ name }) => name.split('.')[0]);
};

const getPostBySlug = (slug: string, fields: string[] = []): Post => {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const items: Post = {
        slug: "",
        content: "",
        title: "",
        date: "",
        excerpt: ""
    };

    fields.forEach((field) => {
        if (field === "slug") {
            items[field] = slug;
        } else if (field === "content") {
            items[field] = content;
        } else if (field === "title" || field === "date") {
            items[field] = data[field];
        } else if (field === "excerpt") {
            items[field] = data[field] || "";
        } else if (field === "tags") {
            items[field] = data[field] || [];
        }
    });
    return items;
};

const getAllPosts = (fields: string[] = []): Post[] => {
    const slugs = getPostSlugs();
    return slugs
        .map((slug) => getPostBySlug(slug, fields))
        .sort((a, b) => (a.date > b.date ? -1 : 1));
};

async function markdownToHtml(markdown: string): Promise<string> {
    const result = await remark()
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(markdown);
    return result.toString();
}

async function generateStaticFeeds() {
    try {
        console.log('フィードを生成中...');
        
        const siteUrl = process.env.SITE_URL || 'https://rhiroe.github.io';
        const author = {
            name: 'rhiroe',
            email: process.env.AUTHOR_EMAIL || '',
            link: siteUrl,
        };
        
        const feed = new Feed({
            title: 'rhiroe.github.io',
            description: 'プログラミングと技術に関するブログ',
            id: siteUrl,
            link: siteUrl,
            language: 'ja',
            image: `${siteUrl}/favicon.ico`,
            favicon: `${siteUrl}/favicon.ico`,
            copyright: `All rights reserved ${new Date().getFullYear()}, ${author.name}`,
            updated: new Date(),
            generator: 'Next.js',
            feedLinks: {
                rss2: `${siteUrl}/feeds/rss.xml`,
                atom: `${siteUrl}/feeds/atom.xml`,
            },
            author
        });

        // 記事を取得してフィードに追加
        const posts = getAllPosts(['slug', 'title', 'date', 'content', 'excerpt', 'tags']);
        
        for (const post of posts) {
            const postUrl = `${siteUrl}/blog/${post.slug}`;
            const htmlContent = await markdownToHtml(post.content);
            
            // 記事のexcerptがない場合は本文の最初の200文字を使用
            const description = post.excerpt || post.content.substring(0, 200).replace(/\n/g, ' ') + '...';
            
            feed.addItem({
                title: post.title,
                id: postUrl,
                link: postUrl,
                description,
                content: htmlContent,
                author: [author],
                date: new Date(post.date),
                category: post.tags?.map(tag => ({ name: tag })) || [],
            });
        }
        
        // outフォルダが存在しない場合は作成
        const outDir = path.join(process.cwd(), 'out');
        const feedsDir = path.join(outDir, 'feeds');
        
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        
        if (!fs.existsSync(feedsDir)) {
            fs.mkdirSync(feedsDir, { recursive: true });
        }
        
        // RSS feed生成
        const rssContent = feed.rss2();
        fs.writeFileSync(path.join(feedsDir, 'rss.xml'), rssContent, 'utf8');
        
        // Atom feed生成
        const atomContent = feed.atom1();
        fs.writeFileSync(path.join(feedsDir, 'atom.xml'), atomContent, 'utf8');
        
        console.log('✓ RSS and Atom feeds generated successfully');
        console.log('  - /feeds/rss.xml');
        console.log('  - /feeds/atom.xml');
        
    } catch (error) {
        console.error('フィード生成エラー:', error);
        process.exit(1);
    }
}

generateStaticFeeds();
