import CryptoJS from "crypto-js";

/**
 * It takes a string value and a secret string and returns an encrypted string
 * @param {String} value - The value to be encrypted.
 * @param {String} secret - This is the secret key that you will use to encrypt and decrypt the data.
 * @returns The encrypted value
 */

export const encrypt = async (value: string, secret: string) => {
  const encryptedValue = CryptoJS.AES.encrypt(value, secret).toString();

  return encryptedValue;
};

/**
 * It takes a value and a secret, and returns the decrypted value
 * @param {String} value - The value to be decrypted.
 * @param {String} secret - This is the secret key that you will use to encrypt and decrypt your data.
 * @returns The decrypted value.
 */
export const decrypt = async (value: string, secret: string) => {
  const decryptedValue = CryptoJS.AES.decrypt(value, secret);

  return decryptedValue;
};
