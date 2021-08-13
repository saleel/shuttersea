import { Client, ThreadID } from '@textile/hub';

const {
  THREAD_KEY,
  THREAD_SECRET,
} = process.env;


export async function getThreadDbClient() {
  const client = await Client.withKeyInfo({
    key: THREAD_KEY,
    secret: THREAD_SECRET,
  });

  return client;
}

export async function getUser(threadClient, threadId, did) {
  const users = await threadClient.find(threadId, 'users', { did });
  if (!users.length) {
    throw new Error('Invalid user');
  }
  const [user] = users;

  return user;
}
