import { DID } from 'dids';
import Ceramic from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import KeyDidResolver from 'key-did-resolver';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import ECKey from 'ec-key';
import { generalVerify } from 'jose/jws/general/verify';

// export async function verifySignature() {
//   console.log('verifySignature');
//   // const threeIdConnect = new ThreeIdConnect();
//   // const provider = await threeIdConnect.getDidProvider();

//   const did = new DID({
//     // provider,
//     // resolver: { ...KeyDidResolver.getResolver() },
//   });

//   console.log(did);

//   const result = await did.verifyJWS(jws);

//   // console.log(result);
// }
import { generateKeyPair } from 'jose/util/generate_key_pair';

import didJ from 'did-jwt';

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

  window.did = did;
  ceramic.did = did;

  ceramic.did.setProvider(provider);
  const userId = await ceramic.did.authenticate();
  window.userId = userId;

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
  await idx.set('basicProfile', data);
}

export async function getProfile() {
  const profile = await idx.get('basicProfile', window.userId);
  return profile;
}

const jws = { payload: 'hello', signatures: [{ protected: 'eyJraWQiOiJkaWQ6MzpranpsNmN3ZTFqdzE0NXE4M2diOGZwejliMnFuYWU1aDR3cTRoa2FhdHpldHVvOW40N3VpOTdmdHlzbm1ib2k_dmVyc2lvbi1pZD0wI2thN1hZdFRKTlRZakJHcCIsImFsZyI6IkVTMjU2SyJ9', signature: 'aBx-zpkOMCaJTWFy4Ilx5nX_lkBfy4okStj2PRW-Bl9KTfuZn728CLUm4C1UVjSRvZOT6uew9-gJGLO_1gdbzw' }] };
const decoder = new TextDecoder();

export async function verifySignature(data) {
  // const randomKey = ECKey.createECKey('P-521');
  // const { publicKey, privateKey } = await generateKeyPair('ES256')

  // console.log(publicKey, privateKey );

  // const encoder = new TextEncoder();

  // const sign = new GeneralSign(encoder.encode('It’s a dangerous business, Frodo, going out your door.'));

  // sign
  //   .addSignature(privateKey)
  //   .setProtectedHeader({ alg: 'ES256' });

  // const jws = await sign.sign();

  // console.log(jws);

  // const { payload, protectedHeader } = await generalVerify(jws, '0x5d7ad2787f53eea0c919844684354ffe7610303d')

  // const a = await didJ.verifyJWS(jwsString, [{
  //   id: 'did:3:kjzl6cwe1jw145q83gb8fpz9b2qnae5h4wq4hkaatzetuo9n47ui97ftysnmboi#ka7XYtTJNTYjBGp', type: 'EcdsaSecp256k1Signature2019', controller: 'did:3:kjzl6cwe1jw145q83gb8fpz9b2qnae5h4wq4hkaatzetuo9n47ui97ftysnmboi', publicKeyBase58: 'ts6EkHe9tGmqRwdX2JT2XNB6EBSH2CXabd8f12nRWhR6',
  // }]);
  // console.log('verified', a);
}
