// src/utils/crypto.js

import { getPublicKey, getSharedSecret } from '@noble/secp256k1';
import { bytesToHex } from '@noble/hashes/utils';

/**
 * Generates a new cryptographic key pair.
 * @returns {{privateKey: string, publicKey: string}}
 */
export const generateKeys = () => {
  const privateKeyBytes = window.crypto.getRandomValues(new Uint8Array(32));
  const privateKeyHex = bytesToHex(privateKeyBytes);
  const publicKey = bytesToHex(getPublicKey(privateKeyHex));
  return { privateKey: privateKeyHex, publicKey: publicKey };
};

/**
 * Derives a shared secret and returns it as a raw byte array.
 * @returns {Uint8Array} The raw shared secret bytes.
 */
export const deriveSharedSecret = (privateKey, otherPublicKey) => {
  const sharedPoint = getSharedSecret(privateKey, otherPublicKey);
  // Return the raw byte array directly. This is crucial.
  return sharedPoint.slice(1, 33);
};

/**
 * Encrypts a message using the raw shared secret.
 * @param {Uint8Array} sharedSecretBytes - The raw shared secret.
 * @param {string} message - The plaintext message.
 * @returns {Promise<{iv: string, message: string}>}
 */
export async function encryptMessage(sharedSecretBytes, message) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedMessage = new TextEncoder().encode(message);

  // Import the key directly from the raw byte array.
  const key = await window.crypto.subtle.importKey(
    'raw',
    sharedSecretBytes, // Use the byte array directly
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt']
  );

  // console.log("Encrypting with IV:", bytesToHex(iv));
  // console.log("Encrypting with sharedSecretBytes:", bytesToHex(sharedSecretBytes));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedMessage
  );

  return {
    iv: bytesToHex(iv),
    message: bytesToHex(new Uint8Array(encrypted)),
  };
}

/**
 * Decrypts a message using the raw shared secret.
 * @param {Uint8Array} sharedSecretBytes - The raw shared secret.
 * @param {{iv: string, message: string}} encryptedData
 * @returns {Promise<string>}
 */

async function deriveKeyFromPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}
/**
 * Encrypts the user's private key with a key derived from their password.
 * @param {string} privateKeyHex The private key to encrypt.
 * @param {string} password The user's password.
 * @returns {Promise<{encryptedPrivateKey: string, salt: string, iv: string}>}
 */
export async function encryptPrivateKey(privateKeyHex, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKeyFromPassword(password, salt);
  const enc = new TextEncoder();

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    enc.encode(privateKeyHex)
  );

  return {
    encryptedPrivateKey: bytesToHex(new Uint8Array(encrypted)),
    salt: bytesToHex(salt),
    iv: bytesToHex(iv),
  };
}

/**
 * Decrypts the user's private key with a key derived from their password.
 * @param {{encryptedPrivateKey: string, salt: string, iv: string}} keyData The encrypted key data from the server.
 * @param {string} password The user's password.
 * @returns {Promise<string>} The decrypted private key hex.
 */
export async function decryptPrivateKey(keyData, password) {
  const salt = new Uint8Array(keyData.privateKeySalt.match(/.{1,2}/g).map(b => parseInt(b, 16)));
  const iv = new Uint8Array(keyData.privateKeyIv.match(/.{1,2}/g).map(b => parseInt(b, 16)));
  const encrypted = new Uint8Array(keyData.encryptedPrivateKey.match(/.{1,2}/g).map(b => parseInt(b, 16)));
  
  const key = await deriveKeyFromPassword(password, salt);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}


export async function decryptMessage(sharedSecretBytes, encryptedData) {
  const ivBytes = new Uint8Array(encryptedData.iv.match(/.{1,2}/g).map(b => parseInt(b, 16)));
  const messageBytes = new Uint8Array(encryptedData.message.match(/.{1,2}/g).map(b => parseInt(b, 16)));

  // Import the key directly from the raw byte array.
  const key = await window.crypto.subtle.importKey(
    'raw',
    sharedSecretBytes, // Use the byte array directly
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt']
  );

  // console.log("Decrypting with IV:", encryptedData.iv);
  // console.log("Decrypting with sharedSecretBytes:", bytesToHex(sharedSecretBytes));

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      key,
      messageBytes
    );
    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    return "⚠️ Could not decrypt message";
  }
}