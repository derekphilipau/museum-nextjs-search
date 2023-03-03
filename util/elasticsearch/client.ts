'use strict';

import { readFileSync } from 'fs';
import { Client } from '@elastic/elasticsearch';

/**
 * Get an Elasticsearch client
 *
 * @returns Elasticsearch client
 */
export function getClient(): Client | undefined {
  if (process.env.ELASTICSEARCH_USE_CLOUD === 'true') {
    const id = process.env.ELASTICSEARCH_CLOUD_ID;
    const username = process.env.ELASTICSEARCH_CLOUD_USERNAME;
    const password = process.env.ELASTICSEARCH_CLOUD_PASSWORD;
    if (!id || !username || !password) return undefined;
    const clientSettings = {
      cloud: { id },
      auth: { username, password },
    };
    return new Client(clientSettings);
  }

  const caFile = process.env.ELASTICSEARCH_CA_FILE;
  const node = `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOST}:${process.env.ELASTICSEARCH_PORT}`;
  const apiKey = process.env.ELASTICSEARCH_API_KEY;
  if (!caFile || !node || !apiKey) return undefined;
  const ca = readFileSync(caFile);
  const clientSettings = {
    node,
    auth: {
      apiKey,
    },
    tls: {
      ca,
      rejectUnauthorized: false,
    },
  };
  return new Client(clientSettings);
}
