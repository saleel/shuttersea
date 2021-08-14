import { ThreadID } from '@textile/hub';
import { verifyJWS } from 'did-jwt';
import { getThreadDbClient, getUser } from '../../helpers/thread';

const {
  THREAD_ID,
} = process.env;

const threadId = ThreadID.fromString(THREAD_ID);

async function create(req, res) {
  const {
    photoId, action, userId, signature,
  } = req.body;

  const threadClient = await getThreadDbClient();
  const photo = await threadClient.findByID(threadId, 'photos', photoId);

  if (!photo) {
    res.status(404).json({ error: 'Not found' });
  }

  if (action === 'view') {
    await threadClient.create(threadId, 'actions', [{
      action: 'view',
      photoId,
    }]);
  }

  if (action === 'like') {
    const user = await getUser(threadClient, threadId, userId);
    await verifyJWS(signature, user.publicKeys);

    await threadClient.create(threadId, 'actions', [{
      action: 'like',
      photoId,
      userId,
      signature,
    }]);
  }

  if (action === 'unlike') {
    const user = await getUser(threadClient, threadId, userId);
    await verifyJWS(signature, user.publicKeys);

    const found = await threadClient.find(threadId, 'actions', {
      ands: [
        {
          fieldPath: 'action',
          operation: 0,
          value: { string: 'like' },
        },
        {
          fieldPath: 'photoId',
          operation: 0,
          value: { string: photoId },
        },
        {
          fieldPath: 'userId',
          operation: 0,
          value: { string: userId },
        },
      ],
    });

    if (found.length) {
      await threadClient.delete(threadId, 'actions', found.map((f) => f._id));
    }
  }

  res.status(200).json({ success: true });
}

async function find(req, res) {
  const { photoId, action } = req.query;
  const client = await getThreadDbClient();

  const query = {
    ands: [
      {
        fieldPath: 'action',
        operation: 0,
        value: { string: action },
      },
      {
        fieldPath: 'photoId',
        operation: 0,
        value: { string: photoId },
      },
    ],
  };

  const results = await client.find(threadId, 'actions', query);

  res.status(200).json({ count: results.length });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await create(req, res);
  } else if (req.method === 'GET') {
    await find(req, res);
  } else {
    res.status(400).json({ error: 'Invalid method' });
  }
}
