export default async function aesGcmEncrypt(plaintext, password) {
  const pwUtf8 = new TextEncoder().encode(password); // encode password as UTF-8
  const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8); // hash the password

  const iv = crypto.getRandomValues(new Uint8Array(12)); // get 96-bit random iv

  const alg = { name: 'AES-GCM', iv }; // specify algorithm to use

  const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']); // generate key from pw

  const ptUint8 = new TextEncoder().encode(plaintext); // encode plaintext as UTF-8
  const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8); // encrypt plaintext using key

  const ctArray = Array.from(new Uint8Array(ctBuffer)); // ciphertext as byte array
  const ctStr = ctArray.map((byte) => String.fromCharCode(byte)).join(''); // ciphertext as string
  const ctBase64 = btoa(ctStr); // encode ciphertext as base64

  const ivHex = Array.from(iv).map((b) => (`00${b.toString(16)}`).slice(-2)).join(''); // iv as hex string

  return ivHex + ctBase64; // return iv+ciphertext
}
