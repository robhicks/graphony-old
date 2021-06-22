export default async function aesGcmDecrypt(ciphertext, password) {
  const pwUtf8 = new TextEncoder().encode(password); // encode password as UTF-8
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8); // hash the password

  const iv = ciphertext.slice(0, 24).match(/.{2}/g).map((byte) => parseInt(byte, 16)); // get iv from ciphertext

  const alg = { name: 'AES-GCM', iv: new Uint8Array(iv) }; // specify algorithm to use

  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']); // use pw to generate key

  const ctStr = atob(ciphertext.slice(24)); // decode base64 ciphertext
  const ctUint8 = new Uint8Array(ctStr.match(/[\s\S]/g).map((ch) => ch.charCodeAt(0))); // ciphertext as Uint8Array
  // note: why doesn't ctUint8 = new TextEncoder().encode(ctStr) work?

  const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8); // decrypt ciphertext using key
  const plaintext = new TextDecoder().decode(plainBuffer); // decode password from UTF-8

  return plaintext; // return the plaintext
}
