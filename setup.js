import {
  Client, ThreadID,
} from '@textile/hub';

export default async function setup() {
  if (!process.env.THREAD_KEY) {
    throw new Error('ENV THREAD_KEY missing');
  }

  const client = await Client.withKeyInfo({
    key: process.env.THREAD_KEY,
    secret: process.env.THREAD_SECRET,
  });

  let threadId;
  if (process.env.THREAD_ID) {
    threadId = ThreadID.fromString(process.env.THREAD_ID);
  } else {
    threadId = await client.newDB(ThreadID.fromRandom());
    console.log(threadId.toString());
  }

  // await client.deleteCollection(threadId, 'Photos');

  await client.newCollection(threadId, {
    name: process.env.THREAD_COLLECTION,
    schema: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Photos',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        originalCid: { type: 'string' },
        smallCid: { type: 'string' },
        mediumCid: { type: 'string' },
        largeCid: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        views: { type: 'number' },
        downloads: { type: 'number' },
        authorId: { type: 'string' },
        location: { type: 'string' },
        fileName: { type: 'string' },
        extension: { type: 'string' },
        info: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  });
}
