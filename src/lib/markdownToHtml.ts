import { remark } from "remark";
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeMermaid from 'rehype-mermaid';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

/**
 * Markdown を解析して HTML にして返す
 * @param markdown Markdown ファイル名
 * @returns HTML
 */
const markdownToHtml = async (markdown: string) => {
    const result = await remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeMermaid, {
            strategy: 'img-svg',
            dark: true,
            colorScheme: 'dark'
        })
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(markdown);
    return result.toString();
};

export default markdownToHtml;
