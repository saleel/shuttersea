import didJwt from 'did-jwt';

// eslint-disable-next-line import/prefer-default-export
export async function verifyJWS(jws, publicKeys) {
  await didJwt.verifyJWS(jws, publicKeys);
}
