import fs from "fs";
import path from "path";

export interface Presentation {
  id: string;
  title: string;
  path: string;
  created?: string;
}

const presentationsDirectory: string = path.join(process.cwd(), "public/presentations");

/**
 * public/presentations/ ディレクトリ内のすべてのHTMLファイルを取得
 */
export const getAllPresentations = (): Presentation[] => {
  // ディレクトリが存在しない場合は空配列を返す
  if (!fs.existsSync(presentationsDirectory)) {
    return [];
  }

  const allContents = fs.readdirSync(presentationsDirectory, { withFileTypes: true });
  
  return allContents
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.html'))
    .map((dirent) => {
      const fileName = dirent.name;
      const id = fileName.replace('.html', '');
      const filePath = path.join(presentationsDirectory, fileName);
      // ファイル名から日本語タイトルを生成（スネークケースを変換）
      const title = id
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      // HTMLからcreatedメタデータを取得
      let created = undefined;
      try {
        const html = fs.readFileSync(filePath, 'utf8');
        const match = html.match(/<meta name="created" content="([^"]+)"/);
        if (match) {
          created = match[1];
        }
      } catch {
        // パースエラー時はcreatedを設定しない
      }
      return {
        id,
        title,
        path: `/presentations/${fileName}`,
        created
      };
    })
    .sort((a, b) => {
      if (a.created && b.created) {
        return b.created.localeCompare(a.created);
      }
      if (a.created) return -1;
      if (b.created) return 1;
      return a.id.localeCompare(b.id);
    });
}

// Generate presentations index JSON file
if (import.meta.url === `file://${process.argv[1]}`) {
    const presentations = getAllPresentations();
    const outputPath = path.join(process.cwd(), "public/presentations-index.json");
    fs.writeFileSync(outputPath, JSON.stringify(presentations, null, 2));
    console.log(`Generated ${outputPath} with ${presentations.length} presentations`);
}
