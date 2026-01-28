import { useEffect, useRef, useMemo } from 'react';
import { useThemeContext } from '../../theme/ThemeContext';

type MermaidProps = {
  content: string;
};

type ThemeVariables = {
  darkMode: boolean;
  background: string;
  primaryColor: string;
  primaryTextColor: string;
  primaryBorderColor: string;
  lineColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  mainBkg: string;
  secondBkg: string;
  tertiaryBkg: string;
  textColor: string;
  nodeTextColor: string;
  titleColor: string;
  nodeBkg: string;
  nodeBorder: string;
  edgeColor: string;
  edgeLabelBackground: string;
  clusterBkg: string;
  fillType0: string;
  fillType1: string;
  fillType2: string;
  fillType3?: string;
  cScale0: string;
  cScale1: string;
  cScale2: string;
  actorBkg: string;
  actorBorder: string;
  actorTextColor: string;
  signalColor: string;
  signalTextColor: string;
  messageLine0: string;
  messageLine1: string;
  messageText: string;
  loopTextColor: string;
  noteBkgColor: string;
  noteBorderColor: string;
  noteTextColor: string;
  attributeBackgroundColorOdd: string;
  attributeBackgroundColorEven: string;
  entityBkgColor: string;
  entityTextColor: string;
  entityBorderColor: string;
  relationLabelBackground: string;
  relationLabelColor: string;
  altBackground: string;
};

// テーマ変数の定義を分離
const getDarkThemeVariables = (): ThemeVariables => ({
  darkMode: true,
  background: '#0d1117',
  primaryColor: '#21262d',
  primaryTextColor: '#f0f6fc',
  primaryBorderColor: '#30363d',
  lineColor: '#484f58',
  secondaryColor: '#161b22',
  tertiaryColor: '#30363d',
  mainBkg: '#21262d',
  secondBkg: '#30363d',
  tertiaryBkg: '#161b22',
  textColor: '#f0f6fc',
  nodeTextColor: '#f0f6fc',
  titleColor: '#f0f6fc',
  nodeBkg: '#21262d',
  nodeBorder: '#30363d',
  edgeColor: '#484f58',
  edgeLabelBackground: '#161b22',
  clusterBkg: '#161b22',
  fillType0: '#21262d',
  fillType1: '#30363d',
  fillType2: '#161b22',
  fillType3: '#484f58',
  cScale0: '#21262d',
  cScale1: '#30363d',
  cScale2: '#161b22',
  actorBkg: '#21262d',
  actorBorder: '#30363d',
  actorTextColor: '#f0f6fc',
  signalColor: '#f0f6fc',
  signalTextColor: '#f0f6fc',
  messageLine0: '#484f58',
  messageLine1: '#484f58',
  messageText: '#f0f6fc',
  loopTextColor: '#f0f6fc',
  noteBkgColor: '#161b22',
  noteBorderColor: '#30363d',
  noteTextColor: '#f0f6fc',
  attributeBackgroundColorOdd: '#262c36',
  attributeBackgroundColorEven: '#0d1117',
  entityBkgColor: '#21262d',
  entityTextColor: '#f0f6fc',
  entityBorderColor: '#30363d',
  relationLabelBackground: '#161b22',
  relationLabelColor: '#f0f6fc',
  altBackground: '#161b22'
});

const getLightThemeVariables = (): ThemeVariables => ({
  darkMode: false,
  background: '#ffffff',
  primaryColor: '#f6f8fa',
  primaryTextColor: '#24292f',
  primaryBorderColor: '#d0d7de',
  lineColor: '#656d76',
  secondaryColor: '#ffffff',
  tertiaryColor: '#f6f8fa',
  mainBkg: '#ffffff',
  secondBkg: '#f6f8fa',
  tertiaryBkg: '#ffffff',
  textColor: '#24292f',
  nodeTextColor: '#24292f',
  titleColor: '#24292f',
  nodeBkg: '#f6f8fa',
  nodeBorder: '#d0d7de',
  edgeColor: '#656d76',
  edgeLabelBackground: '#ffffff',
  clusterBkg: '#f6f8fa',
  fillType0: '#f6f8fa',
  fillType1: '#ffffff',
  fillType2: '#eaeef2',
  fillType3: '#d0d7de',
  cScale0: '#f6f8fa',
  cScale1: '#ffffff',
  cScale2: '#eaeef2',
  actorBkg: '#f6f8fa',
  actorBorder: '#d0d7de',
  actorTextColor: '#24292f',
  signalColor: '#24292f',
  signalTextColor: '#24292f',
  messageLine0: '#656d76',
  messageLine1: '#656d76',
  messageText: '#24292f',
  loopTextColor: '#24292f',
  noteBkgColor: '#fff8c5',
  noteBorderColor: '#d0d7de',
  noteTextColor: '#24292f',
  attributeBackgroundColorOdd: '#ffffff',
  attributeBackgroundColorEven: '#f6f8fa',
  entityBkgColor: '#f6f8fa',
  entityTextColor: '#24292f',
  entityBorderColor: '#d0d7de',
  relationLabelBackground: '#ffffff',
  relationLabelColor: '#24292f',
  altBackground: '#ffffff'
});

// ERダイアグラムのスタイル適用を分離
const applyErDiagramStyles = (svgContainer: HTMLDivElement, isDark: boolean): void => {
  const svgElement = svgContainer.querySelector('svg');
  if (!svgElement) return;

  const style = document.createElement('style');
  style.textContent = isDark ? `
    .er .attributeBoxEven { fill: #0d1117 !important; }
    .er .attributeBoxOdd { fill: #262c36 !important; }
    .er .er-relationshipLabelBox { fill: #161b22 !important; }
    .er .entityBox { fill: #21262d !important; }
    .er .entityLabel { fill: #f0f6fc !important; }
    .er .relationshipLabel { fill: #f0f6fc !important; }
    .er .attributeKeyTypeFK { fill: #f0f6fc !important; }
    .er .attributeKeyTypePK { fill: #f0f6fc !important; }
  ` : `
    .er .attributeBoxEven { fill: #f6f8fa !important; }
    .er .attributeBoxOdd { fill: #ffffff !important; }
    .er .er-relationshipLabelBox { fill: #ffffff !important; }
    .er .entityBox { fill: #f6f8fa !important; }
    .er .entityLabel { fill: #24292f !important; }
    .er .relationshipLabel { fill: #24292f !important; }
    .er .attributeKeyTypeFK { fill: #24292f !important; }
    .er .attributeKeyTypePK { fill: #24292f !important; }
  `;
  svgElement.appendChild(style);
};

// 既存のMermaidコンテナを削除する処理を分離
const removeExistingMermaidContainer = (preElement: HTMLElement): void => {
  const nextSibling = preElement.nextSibling;
  if (nextSibling && nextSibling.nodeType === Node.ELEMENT_NODE) {
    const siblingElement = nextSibling as Element;
    if (siblingElement.classList.contains('mermaid-container')) {
      siblingElement.remove();
    }
  }
};

// SVGコンテナを作成して挿入する処理を分離
const insertSvgContainer = (
  preElement: HTMLElement,
  svg: string,
  graphDefinition: string,
  isDark: boolean
): void => {
  const svgContainer = document.createElement('div');
  svgContainer.className = 'mermaid-container';
  svgContainer.style.backgroundColor = isDark ? '#0d1117' : '#ffffff';
  svgContainer.innerHTML = svg;

  // ERダイアグラムの場合は特別なスタイルを適用
  if (graphDefinition.trim().startsWith('erDiagram')) {
    applyErDiagramStyles(svgContainer, isDark);
  }

  // 元のpre要素を非表示にしてSVGコンテナを挿入
  preElement.style.display = 'none';
  preElement.parentNode?.insertBefore(svgContainer, preElement.nextSibling);
};

// 単一のMermaidブロックをレンダリングする処理を分離
// Mermaidの型定義
interface MermaidAPI {
  reset: () => void;
}

interface MermaidInstance {
  mermaidAPI: MermaidAPI;
  initialize: (config: {
    startOnLoad: boolean;
    theme: string;
    securityLevel: string;
    themeVariables: ThemeVariables;
  }) => void;
  render: (id: string, definition: string) => Promise<{ svg: string }>;
}

const renderSingleMermaidBlock = async (
  codeBlock: Element,
  index: number,
  mermaid: MermaidInstance,
  isDark: boolean
): Promise<void> => {
  const graphDefinition = codeBlock.textContent;
  if (!graphDefinition) return;

  const preElement = codeBlock.parentElement;
  if (!preElement) return;

  try {
    const elementId = `mermaid-${Date.now()}-${index}`;
    const { svg } = await mermaid.render(elementId, graphDefinition);

    removeExistingMermaidContainer(preElement);
    insertSvgContainer(preElement, svg, graphDefinition, isDark);
  } catch (error) {
    console.error('Mermaid rendering error:', error);
  }
};

// Mermaidの初期化処理を分離
const initializeMermaid = async (mermaid: MermaidInstance, themeVariables: ThemeVariables): Promise<void> => {
  try {
    mermaid.mermaidAPI.reset();
  } catch {
    // ignore reset errors
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    themeVariables
  });
};

export const MermaidViewer = ({ content }: MermaidProps) => {
  const { mode } = useThemeContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // テーマ変数をメモ化
  const themeVariables = useMemo(() => {
    return mode === 'dark' ? getDarkThemeVariables() : getLightThemeVariables();
  }, [mode]);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!contentRef.current) return;

      const codeBlocks = contentRef.current.querySelectorAll('pre code.language-mermaid');
      if (codeBlocks.length === 0) return;

      const mermaid = await import('mermaid');
      const isDark = mode === 'dark';

      await initializeMermaid(mermaid.default as MermaidInstance, themeVariables);

      // 各Mermaidブロックを順次処理
      for (let i = 0; i < codeBlocks.length; i++) {
        await renderSingleMermaidBlock(codeBlocks[i], i, mermaid.default as MermaidInstance, isDark);
      }
    };

    renderMermaid();
  }, [mode, content, themeVariables]);

  return (
    <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
  );
};
