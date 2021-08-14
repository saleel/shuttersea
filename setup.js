const dotenv = require('dotenv');
const {
  Client, ThreadID,
} = require('@textile/hub');

dotenv.config({ path: '.env.local' });

async function setup() {
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
  }

  // await client.deleteCollection(threadId, 'actions')
  // await client.deleteCollection(threadId, 'photos')
  // const ids = await client.find(threadId, 'photos', {});
  // console.log(ids);
  // await client.delete(threadId, 'photos', ids.map((a) => a._id));

  const collections = await client.listCollections(threadId);

  if (!collections.some((c) => c.name === 'photos')) {
    await client.newCollection(threadId, {
      name: 'photos',
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'Photos',
        type: 'object',
        required: ['title', 'cid'],
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          cid: { type: 'string' },
          availableSizes: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          views: { type: 'number' },
          downloads: { type: 'number' },
          userId: { type: 'string' },
          location: { type: 'string' },
          fileName: { type: 'string' },
          fileSize: { type: 'number' },
          fileType: { type: 'string' },
          info: { type: 'object' },
          signature: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    });

    console.log('Created photos');
  }

  // Just to store public key of users, to verify signatured
  // Actual auth is using 3ID DID (Ceramix IDX)
  if (!collections.some((c) => c.name === 'users')) {
    await client.newCollection(threadId, {
      name: 'users',
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'Users',
        type: 'object',
        properties: {
          _id: { type: 'string' },
          did: { type: 'string' },
          publicKeys: { type: 'array' },
        },
      },
    });

    console.log('Created users');
  }

  if (!collections.some((c) => c.name === 'actions')) {
    await client.newCollection(threadId, {
      name: 'actions',
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'Actions',
        type: 'object',
        properties: {
          _id: { type: 'string' },
          action: { type: 'string' },
          photoId: { type: 'string' },
          userId: { type: 'string' },
          signature: { type: 'string' },
        },
      },
    });

    console.log('Created actions');
  }

  console.log('Done');
}

setup();
