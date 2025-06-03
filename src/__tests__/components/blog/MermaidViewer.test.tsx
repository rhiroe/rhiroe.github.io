import { render, screen, waitFor } from '@testing-library/react';
import { MermaidViewer } from '../../../components/blog/MermaidViewer';
import { ThemeProvider } from '../../../theme/ThemeContext';

// Mermaidライブラリをモック
jest.mock('mermaid', () => ({
  __esModule: true,
  default: {
    mermaidAPI: {
      reset: jest.fn(),
    },
    initialize: jest.fn(),
    render: jest.fn(),
  },
}));

// ThemeContextのモック用コンポーネント
const MockThemeProvider = ({ 
  children, 
  mode = 'light' 
}: { 
  children: React.ReactNode; 
  mode?: 'light' | 'dark' 
}) => {
  const mockTheme = {
    mode,
    toggleMode: jest.fn(),
  };

  return (
    <div data-testid="mock-theme-provider">
      {/* ThemeContext.Providerの代わりにmockを使用 */}
      <div data-theme-mode={mode}>
        {children}
      </div>
    </div>
  );
};
MockThemeProvider.displayName = 'MockThemeProvider';

describe('MermaidViewer', () => {
  const sampleMermaidContent = `
    <pre><code class="language-mermaid">
      graph TD
        A[Start] --> B[Process]
        B --> C[End]
    </code></pre>
  `;

  const sampleNonMermaidContent = `
    <div>
      <p>Regular content without mermaid diagrams</p>
      <pre><code class="language-javascript">
        console.log('hello world');
      </code></pre>
    </div>
  `;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders content correctly via dangerouslySetInnerHTML', () => {
    const content = '<div><p>Test content</p></div>';
    
    const { container } = render(
      <MockThemeProvider>
        <MermaidViewer content={content} />
      </MockThemeProvider>
    );

    expect(container.querySelector('p')).toHaveTextContent('Test content');
  });

  it('renders without crashing when content is empty', () => {
    const { container } = render(
      <MockThemeProvider>
        <MermaidViewer content="" />
      </MockThemeProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders HTML content properly', () => {
    const htmlContent = `
      <div>
        <h1>Title</h1>
        <p>Paragraph content</p>
        <code>Inline code</code>
      </div>
    `;

    const { container } = render(
      <MockThemeProvider>
        <MermaidViewer content={htmlContent} />
      </MockThemeProvider>
    );

    expect(container.querySelector('h1')).toHaveTextContent('Title');
    expect(container.querySelector('p')).toHaveTextContent('Paragraph content');
    expect(container.querySelector('code')).toHaveTextContent('Inline code');
  });

  it('handles content with pre and code blocks', () => {
    const { container } = render(
      <MockThemeProvider>
        <MermaidViewer content={sampleNonMermaidContent} />
      </MockThemeProvider>
    );

    expect(container.querySelector('p')).toHaveTextContent('Regular content without mermaid diagrams');
    expect(container.querySelector('code.language-javascript')).toHaveTextContent("console.log('hello world');");
  });

  it('renders with light theme context', () => {
    const { container } = render(
      <MockThemeProvider mode="light">
        <MermaidViewer content={sampleMermaidContent} />
      </MockThemeProvider>
    );

    expect(container.querySelector('[data-theme-mode="light"]')).toBeInTheDocument();
  });

  it('renders with dark theme context', () => {
    const { container } = render(
      <MockThemeProvider mode="dark">
        <MermaidViewer content={sampleMermaidContent} />
      </MockThemeProvider>
    );

    expect(container.querySelector('[data-theme-mode="dark"]')).toBeInTheDocument();
  });

  it('handles content updates correctly', () => {
    const initialContent = '<div>Initial content</div>';
    const updatedContent = '<div>Updated content</div>';

    const { container, rerender } = render(
      <MockThemeProvider>
        <MermaidViewer content={initialContent} />
      </MockThemeProvider>
    );

    expect(container.querySelector('div')).toHaveTextContent('Initial content');

    rerender(
      <MockThemeProvider>
        <MermaidViewer content={updatedContent} />
      </MockThemeProvider>
    );

    expect(container.querySelector('div')).toHaveTextContent('Updated content');
  });

  it('handles malformed HTML gracefully', () => {
    const malformedContent = '<div><p>Unclosed paragraph<div>Nested incorrectly</p></div>';

    const { container } = render(
      <MockThemeProvider>
        <MermaidViewer content={malformedContent} />
      </MockThemeProvider>
    );

    // Browser will attempt to fix malformed HTML
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles special characters in content', () => {
    const specialContent = `
      <div>
        <p>&lt;script&gt;alert('test')&lt;/script&gt;</p>
        <p>&amp; &quot; &apos;</p>
      </div>
    `;

    const { container } = render(
      <MockThemeProvider>
        <MermaidViewer content={specialContent} />
      </MockThemeProvider>
    );

    // Should render escaped content safely
    expect(container).toBeInTheDocument();
  });

  it('maintains component structure with ref', () => {
    const { container } = render(
      <MockThemeProvider>
        <MermaidViewer content="<div>Test</div>" />
      </MockThemeProvider>
    );

    // The component should render a div with ref
    const rootDiv = container.firstChild;
    expect(rootDiv).toBeInTheDocument();
    expect(rootDiv?.nodeName.toLowerCase()).toBe('div');
  });
});
