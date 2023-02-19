import type { NextApiRequest, NextApiResponse } from 'next'
import {getDocument} from '@/util/elasticsearch'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query
    console.log('getting... ' + id);
    if (!id || Array.isArray(id)) res.status(500).json({ error: 'Id not provided' });
    else {
      const result = await getDocument('collections', parseInt(id));
      res.status(200).json(result)  
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}