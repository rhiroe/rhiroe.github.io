import fs from "fs";
import path from "path";
import matter from "gray-matter";

type PostMetadata = {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    tags?: string[];
};

const postsDirectory: string = path.join(process.cwd(), "public/content");

export const getPostSlugs = (): string[] => {
    const allContents = fs.readdirSync(postsDirectory, { withFileTypes: true });
    return allContents
        .filter((dirent) => dirent.isFile())
        .map(({ name }) => name.split('.')[0]);
}

export const getPostMetadata = (slug: string): PostMetadata => {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
        slug,
        title: data.title || "",
        date: data.date || "",
        excerpt: data.excerpt || "",
        tags: data.tags || []
    };
}

export function getAllPostsMetadata(): PostMetadata[] {
    const slugs = getPostSlugs();
    return slugs
        .map((slug) => getPostMetadata(slug))
        .sort((a, b) => (a.date > b.date ? -1 : 1));
}

// Generate posts index JSON file
if (import.meta.url === `file://${process.argv[1]}`) {
    const posts = getAllPostsMetadata();
    const outputPath = path.join(process.cwd(), "public/posts-index.json");
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
    console.log(`Generated ${outputPath} with ${posts.length} posts`);
}
