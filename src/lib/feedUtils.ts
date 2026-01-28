import { Feed } from 'feed';
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import markdownToHtml from './markdownToHtml';

export type Post = {
    slug: string;
    content: string;
    title: string;
    excerpt?: string;
    date: string;
    tags?: string[];
};

const postsDirectory: string = path.join(process.cwd(), "public/content");

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

export interface FeedConfig {
    siteUrl: string;
    title: string;
    description: string;
    author: {
        name: string;
        email?: string;
        link: string;
    };
}

export async function generateFeed(config: FeedConfig): Promise<Feed> {
    const { siteUrl, title, description, author } = config;
    
    const feed = new Feed({
        title,
        description,
        id: siteUrl,
        link: siteUrl,
        language: 'ja',
        image: `${siteUrl}/favicon.ico`,
        favicon: `${siteUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, ${author.name}`,
        updated: new Date(),
        generator: 'Vite + React',
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

    return feed;
}

export function getFeedConfig(): FeedConfig {
    const siteUrl = process.env.SITE_URL || 'https://rhiroe.github.io';
    
    return {
        siteUrl,
        title: 'rhiroe.github.io',
        description: 'プログラミングと技術に関するブログ',
        author: {
            name: 'rhiroe',
            email: process.env.AUTHOR_EMAIL || '',
            link: siteUrl,
        }
    };
}
