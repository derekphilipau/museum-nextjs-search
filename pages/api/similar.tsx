import type { NextApiRequest, NextApiResponse } from 'next'
import {similar} from './util/elasticsearch.js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await similar(req.query);
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
}