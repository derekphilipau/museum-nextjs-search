import type { NextApiRequest, NextApiResponse } from 'next';
import { options } from '@/util/elasticsearch/search';

/*
type ResponseData = {
  message?: string,
  error?: string
}
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await options(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
}
