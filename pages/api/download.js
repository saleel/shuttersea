import https from 'https';
import { ThreadID } from '@textile/hub';
import { getThreadDbClient } from '../../helpers/thread';
import { getPhotoUrl } from '../../helpers/common';

const {
  THREAD_ID,
} = process.env;

const threadId = ThreadID.fromString(THREAD_ID);

async function find(req, res) {
  const { photoId, size = 'original' } = req.query;

  const client = await getThreadDbClient();
  const photo = await client.findByID(threadId, 'photos', photoId);

  if (!photo) {
    res.status(404).json({ error: 'Not found' });
  }

  const url = getPhotoUrl(photo, size);

  res.setHeader('Content-Disposition', `attachment; filename="${photo.fileName}"`);

  https.get(url, (res2) => {
    res2.pipe(res);
  });

  client.create(threadId, 'actions', [{
    action: 'download',
    photoId,
  }]);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await find(req, res);
  } else {
    res.status(400).json({ error: 'Invalid method' });
  }
}
