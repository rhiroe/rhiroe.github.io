import { NextApiRequest, NextApiResponse } from 'next';
import { generateFeed, getFeedConfig } from '../../lib/feedUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    try {
        const config = getFeedConfig();
        const feed = await generateFeed(config);
        const atomXml = feed.atom1();

        res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600');
        res.status(200).send(atomXml);
    } catch (error) {
        console.error('Error generating Atom feed:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
