import fs from 'fs';
import { Web3Storage, File } from 'web3.storage';
import EXIFParser from 'exif-parser';
import { Client, ThreadID } from '@textile/hub';
import formData from '../../middleware/form-data';

const {
  WEB3_STORAGE_TOKEN,
  THREAD_ID,
  THREAD_KEY,
  THREAD_SECRET,
  THREAD_COLLECTION,
} = process.env;

async function getClient() {
  const client = await Client.withKeyInfo({
    key: THREAD_KEY,
    secret: THREAD_SECRET,
  });

  return client;
}

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

const web3StorageClient = new Web3Storage({ token: WEB3_STORAGE_TOKEN });

async function create(req, res) {
  try {
    await runMiddleware(req, res, formData);
  } catch (error) {
    res.json({ error });
  }
  // console.log('here now');

  const {
    title, tags, authorId, location,
  } = req.body;

  const { photo } = req.files;
  const { originalFilename: fileName, size: fileSize, headers: { 'content-type': fileType } } = photo;

  // console.log(photo);

  const photoBuffer = fs.readFileSync(photo.path);
  const photoFile = new File([photoBuffer], fileName);
  const originalCid = await web3StorageClient.put([photoFile]);

  // const parser = EXIFParser.create(photoBuffer);
  // const exifData = parser.parse();

  // console.log('xif', exifData);

  const client = await getClient();

  const photoDoc = {
    title,
    originalCid,
    fileName,
    fileSize,
    fileType,
    // smallCid: '',
    // mediumCid: '',
    // largeCid: '',
    tags: (tags || '').split(',').map((t) => t.trim()),
    views: 0,
    downloads: 0,
    authorId,
    location,
    // info: exifData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log(photoDoc);

  const created = await client.create(threadId, THREAD_COLLECTION, [photoDoc]);
  res.status(200).json(created);
}

async function find(req, res) {
  const { keyword } = req.query;

  const client = await getClient();

  // const found = await client.delete(threadId, THREAD_COLLECTION, ['bafybeigyr7pxdbgqolaux64keh7fls5wqeh3wxqjm5hmy4iz5us65umqfa',])

  const found = await client.find(threadId, THREAD_COLLECTION, { name: keyword });

  res.status(200).json(found);
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
