import { Web3Storage, File } from 'web3.storage';
// import EXIFParser from 'exif-parser';
import { Client, ThreadID } from '@textile/hub';

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

const threadId = ThreadID.fromString(THREAD_ID);

const web3StorageClient = new Web3Storage({ token: WEB3_STORAGE_TOKEN });

async function create(req, res) {
  const {
    imageBase64, title, fileName, extension, tags, authorId, location,
  } = req.body;

  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const originalCid = await web3StorageClient.put([new File(imageBuffer, fileName)]);

  // const parser = EXIFParser.create(imageBuffer);
  // const exifData = parser.parse();

  // console.log('xif', exifData);

  const client = await getClient();

  const photo = {
    title,
    originalCid,
    fileName,
    extension,
    // smallCid: '',
    // mediumCid: '',
    // largeCid: '',
    tags,
    views: 0,
    downloads: 0,
    authorId,
    location,
    // info: exifData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log('photo', photo);

  const created = await client.create(threadId, THREAD_COLLECTION, [photo]);

  res.status(200).json(created);
}

async function find(req, res) {
  const { keyword } = req.query;

  const client = await getClient();
  const found = await client.find(threadId, THREAD_COLLECTION, { name: keyword });

  res.status(200).json(found);
}

export default async function handler(req, res) {
  console.log(req.method);
  if (req.method === 'GET') {
    find(req, res);
  } else if (req.method === 'POST') {
    create(req, res);
  } else {
    res.status(400).json({ error: 'Invalid method' });
  }
}
