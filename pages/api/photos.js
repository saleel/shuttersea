import fs from 'fs';
import { Web3Storage, File } from 'web3.storage';
import { ThreadID } from '@textile/hub';
import formData from '../../middleware/form-data';
import { verifyJWS } from '../../helpers/auth';
import { getThreadDbClient, getUser } from '../../helpers/thread';
import { resizeImage, parseImageInfo } from '../../helpers/image';
import { getFileNameForSize } from '../../helpers/common';

const {
  WEB3_STORAGE_TOKEN,
  THREAD_ID,
} = process.env;

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const threadId = ThreadID.fromString(THREAD_ID);

async function create(req, res) {
  try {
    // Parse formdata
    await runMiddleware(req, res, formData);

    const {
      title, tags, userId, location, signature,
    } = req.body;

    // Verify same user uploaded
    const threadClient = await getThreadDbClient();
    const user = await getUser(threadClient, threadId, userId);
    await verifyJWS(signature, user.publicKeys);

    const { photo } = req.files;
    const { originalFilename: fileName, size: fileSize, headers: { 'content-type': fileType } } = photo;

    // Convert photos to smaller sizes
    const photoBuffer = fs.readFileSync(photo.path);
    const allSizes = await resizeImage(photoBuffer);

    // Upload photos
    const web3StorageClient = new Web3Storage({ token: WEB3_STORAGE_TOKEN });

    const photoFiles = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [size, buffer] of Object.entries(allSizes)) {
      const extension = fileName.split('.').pop();
      let fileNameForSize = fileName.split('.').slice(0, -1);
      fileNameForSize.push('_', size, '.', extension);
      fileNameForSize = fileNameForSize.join('');

      const photoFile = new File([buffer], getFileNameForSize(fileName, size));
      photoFiles.push(photoFile);
    }

    const cid = await web3StorageClient.put(photoFiles);

    // Parse exif Data
    const info = await parseImageInfo(photoBuffer);

    const existing = await threadClient.find(threadId, 'photos', {
      ands: [
        {
          fieldPath: 'cid',
          operation: 0,
          value: { string: cid },
        },
      ],
    });
    if (existing.length) {
      throw new Error('This image was already uploaded before');
    }

    const photoDoc = {
      title,
      cid,
      availableSizes: Object.keys(allSizes),
      fileName,
      fileSize,
      fileType,
      tags: (tags || '').split(',').map((t) => t.trim()),
      views: 0,
      downloads: 0,
      userId,
      location,
      info,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // console.log(photoDoc);

    const created = await threadClient.create(threadId, 'photos', [photoDoc]);

    res.status(200).json(created);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
}

async function find(req, res) {
  const { id, keyword = '', userId } = req.query;
  const client = await getThreadDbClient();

  const query = {
    ands: [
      id && {
        fieldPath: '_id',
        operation: 0,
        value: { string: id },
      },
      userId && {
        fieldPath: 'userId',
        operation: 0,
        value: { string: userId },
      },
      // keyword && {
      //   fieldPath: 'tags',
      //   operation: 0,
      //   value: { string: keyword },
      // },
    ].filter(Boolean),
  };

  const photos = await client.find(threadId, 'photos', query);

  // TODO: Fix this
  // Really inefficient way of finding filter by tags. Research on $in operator equivalent of ThreadDB.
  const filtered = photos.filter((p) => p.tags.includes(keyword));

  res.status(200).json(filtered);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await find(req, res);
  } else if (req.method === 'POST') {
    await create(req, res);
  } else {
    res.status(400).json({ error: 'Invalid method' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
