// Client-side API for accessing blog posts

export type Post = {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    tags?: string[];
};

export type PostWithContent = Post & {
    content: string;
};

let postsCache: Post[] | null = null;

export async function getAllPosts(fields: string[] = []): Promise<Post[]> {
    if (!postsCache) {
        const response = await fetch('/posts-index.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch posts index: ${response.statusText}`);
        }
        postsCache = await response.json();
    }
    
    if (!postsCache) {
        return [];
    }
    
    // If no fields specified, return all fields
    if (fields.length === 0) {
        return postsCache.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return postsCache.map(post => {
        const result: Record<string, string | string[] | undefined> = {};
        fields.forEach(field => {
            if (field in post) {
                result[field] = post[field as keyof Post];
            }
        });
        return result as Post;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string, fields: string[] = []): Promise<PostWithContent> {
    // Load posts index
    if (!postsCache) {
        const response = await fetch('/posts-index.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch posts index: ${response.statusText}`);
        }
        postsCache = await response.json();
    }
    
    if (!postsCache) {
        throw new Error('Posts index not loaded');
    }
    
    const postMeta = postsCache.find(p => p.slug === slug);
    if (!postMeta) {
        throw new Error(`Post not found: ${slug}`);
    }
    
    // Load markdown content
    const contentResponse = await fetch(`/content/${slug}.md`);
    const markdownContent = await contentResponse.text();
    
    // If no fields specified, return all fields plus content
    if (fields.length === 0) {
        return {
            ...postMeta,
            content: markdownContent
        };
    }
    
    const result: Record<string, string | string[] | undefined> = {
        content: markdownContent
    };
    
    fields.forEach(field => {
        if (field === 'slug') {
            result.slug = slug;
        } else if (field === 'content') {
            result.content = markdownContent;
        } else if (field in postMeta) {
            result[field] = postMeta[field as keyof Post];
        }
    });
    
    return result as PostWithContent;
}

// For testing purposes
export function resetCache() {
    postsCache = null;
}
