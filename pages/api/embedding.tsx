import type { NextApiRequest, NextApiResponse } from 'next';
import { similarCollectionObjectEmbeddingById } from '@/util/elasticsearch/search/similarObjectEmbedding';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const result = await similarCollectionObjectEmbeddingById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
}
