import type { NextApiRequest, NextApiResponse } from 'next'
import {getDocument} from '../util/elasticsearch.js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query
    console.log('getting... ' + id)
    const result = await getDocument('collections', id);
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
}