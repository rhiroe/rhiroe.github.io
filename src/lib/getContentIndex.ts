import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Post = {
    slug: string;
    content: string;
    title: string;
    excerpt?: string;
    date: string;
};

const postsDirectory: string = path.join(process.cwd(), "public/content");

export const getPostSlugs = (): string[] => {
    const allContents = fs.readdirSync(postsDirectory, { withFileTypes: true });
    return allContents
        .filter((dirent) => dirent.isFile())
        .map(({ name }) => name.split('.')[0]);
}

export const getPostBySlug = (slug: string, fields: string[] = []): Post => {
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
        }
    });
    return items;
}

export function getAllPosts(fields: string[] = []): Post[] {
    const slugs = getPostSlugs();
    return slugs
        .map((slug) => getPostBySlug(slug, fields))
        .sort((a, b) => (a.date > b.date ? -1 : 1));
}
