import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Parent } from 'mdast';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

interface MermaidNode extends Node {
  lang?: string;
  value: string;
  type: string;
}

const remarkMermaid = () => {
  return async (tree: Node) => {
    const nodesToProcess: MermaidNode[] = [];

    visit(tree, 'code', (node: MermaidNode) => {
      if (node.lang === 'mermaid') {
        nodesToProcess.push(node);
      }
    });

    for (const node of nodesToProcess) {
      try {
        const diagramPath = join(tmpdir(), `diagram-${Math.random().toString(36).slice(2)}.mmd`);
        const outputPath = join(tmpdir(), `diagram-${Math.random().toString(36).slice(2)}.svg`);
        
        await writeFile(diagramPath, node.value);
        
        await execAsync(`npx mmdc -i ${diagramPath} -o ${outputPath} -b transparent`);
        const svg = await readFile(outputPath, 'utf-8');
        
        (node as unknown as Parent).type = 'html';
        (node as unknown as MermaidNode).value = `<div class="mermaid">${svg}</div>`;
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error);
        (node as unknown as MermaidNode).value = `${node.value}`;
      }
    }
  };
};

export default remarkMermaid;