import { Client, ThreadID } from '@textile/hub';

const {
  THREAD_ID,
  THREAD_KEY,
  THREAD_SECRET,
} = process.env;

async function getClient() {
  const client = await Client.withKeyInfo({
    key: THREAD_KEY,
    secret: THREAD_SECRET,
  });

  return client;
}

const threadId = ThreadID.fromString(THREAD_ID);

async function create(req, res) {
  const {
    did, publicKeys,
  } = req.body;

  const client = await getClient();

  const existing = await client.find(threadId, 'users', { did });

  if (existing.length) {
    res.status(200).json(existing[0]);
    return;
  }

  const created = await client.create(threadId, 'users', [{ did, publicKeys }]);
  res.status(200).json(created);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await create(req, res);
  } else {
    res.status(400).json({ error: 'Invalid method' });
  }
}
