import type { NextApiRequest, NextApiResponse } from 'next'
import {search} from './util/elasticsearch.js'

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
    const result = await search(req.query);
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error })
  }
}