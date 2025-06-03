/**
 * 静的サイト用のRSS・Atomフィード生成スクリプト
 * Next.js build後に実行し、out/フォルダに静的XMLファイルを生成
 */

import { generateFeed, getFeedConfig } from '../src/lib/feedUtils';
import fs from 'fs';
import path from 'path';

async function generateStaticFeeds() {
    try {
        console.log('フィードを生成中...');
        
        const config = getFeedConfig();
        const feed = await generateFeed(config);
        
        // outフォルダが存在しない場合は作成
        const outDir = path.join(process.cwd(), 'out');
        const feedsDir = path.join(outDir, 'feeds');
        
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }
        
        if (!fs.existsSync(feedsDir)) {
            fs.mkdirSync(feedsDir, { recursive: true });
        }
        
        // RSS feed生成
        const rssContent = feed.rss2();
        fs.writeFileSync(path.join(feedsDir, 'rss.xml'), rssContent, 'utf8');
        
        // Atom feed生成
        const atomContent = feed.atom1();
        fs.writeFileSync(path.join(feedsDir, 'atom.xml'), atomContent, 'utf8');
        
        console.log('✓ RSS and Atom feeds generated successfully');
        console.log('  - /feeds/rss.xml');
        console.log('  - /feeds/atom.xml');
        
    } catch (error) {
        console.error('フィード生成エラー:', error);
        process.exit(1);
    }
}

generateStaticFeeds();
