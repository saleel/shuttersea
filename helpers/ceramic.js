import { DID } from 'dids';
import Ceramic from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import KeyDidResolver from 'key-did-resolver';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';

const ceramic = new Ceramic('https://ceramic-clay.3boxlabs.com');
const idx = new IDX({ ceramic });

function jwsToString(jws) {
  const jwsString = `${jws.signatures[0].protected}.${jws.payload}.${jws.signatures[0].signature}`;
  return jwsString;
}

// eslint-disable-next-line import/prefer-default-export
export async function authenticate() {
  const addresses = await window.ethereum.enable();

  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);

  await threeIdConnect.connect(authProvider);
  const provider = await threeIdConnect.getDidProvider();

  const did = new DID({
    provider,
    resolver: { ...KeyDidResolver.getResolver(), ...ThreeIdResolver.getResolver(ceramic) },
  });

  ceramic.did = did;
  ceramic.did.setProvider(provider);
  const userId = await ceramic.did.authenticate();

  window.userId = userId;
  window.did = did;

  // Get public keys for did
  // TODO: Find a better way to get public keys
  const jws = await ceramic.did.createJWS('test');
  const verified = await ceramic.did.verifyJWS(jwsToString(jws));
  const publicKeys = verified.didResolutionResult.didDocument?.verificationMethod || [];

  return {
    userId,
    publicKeys,
  };
}

export async function updateProfile(data) {
  if (!window.userId) {
    await authenticate();
  }

  await idx.set('basicProfile', data);
}

export async function getProfile() {
  const profile = await idx.get('basicProfile', window.userId);
  return profile;
}

export async function signData(data) {
  const jws = await ceramic.did.createJWS(data);
  return jwsToString(jws);
}

export async function getProfileById(did) {
  const profile = await idx.get('basicProfile', did);
  return profile;
}
