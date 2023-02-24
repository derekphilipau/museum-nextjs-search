import type { NextApiRequest, NextApiResponse } from 'next';
import { similarCollectionObjectsById } from '@/util/elasticsearch';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    const result = await similarCollectionObjectsById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
}
