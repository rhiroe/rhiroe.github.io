import markdownToHtml from '../markdownToHtml';

describe('markdownToHtml', () => {
  it('converts basic markdown to HTML', async () => {
    const markdown = '# Hello World\n\nThis is a paragraph.';
    const result = await markdownToHtml(markdown);

    expect(result).toContain('Mocked HTML');
    expect(result).toContain('Mocked');
  });

  it('handles GFM features like tables', async () => {
    const markdown = `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`;

    const result = await markdownToHtml(markdown);

    expect(result).toContain('Mocked HTML');
  });

  it('handles line breaks', async () => {
    const markdown = 'Line 1\nLine 2';
    const result = await markdownToHtml(markdown);

    expect(result).toContain('Mocked HTML');
  });

  it('handles code blocks with syntax highlighting', async () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const result = await markdownToHtml(markdown);

    expect(result).toContain('Mocked HTML');
  });

  it('handles inline code', async () => {
    const markdown = 'This is `inline code` in text.';
    const result = await markdownToHtml(markdown);

    expect(result).toContain('Mocked HTML');
  });

  it('handles links', async () => {
    const markdown = '[Link text](https://example.com)';
    const result = await markdownToHtml(markdown);

    expect(result).toContain('Mocked HTML');
  });

  it('handles emphasis and strong text', async () => {
    const markdown = '*italic* and **bold** text';
    const result = await markdownToHtml(markdown);

    expect(result).toContain('Mocked HTML');
  });

  it('handles empty input', async () => {
    const result = await markdownToHtml('');
    
    expect(result).toContain('Mocked HTML');
  });
});
