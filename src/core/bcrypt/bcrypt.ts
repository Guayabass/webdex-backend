/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';

export function encodePassword(rawPassword: string) {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(rawPassword, SALT);//ENCODE PASSWORD AND STORE IT THAT WAY, IT IS NEVER DECODED
}

export function comparePasswords(rawPassword: string, hash: string) {
  return bcrypt.compareSync(rawPassword, hash);// COMPARE PASSWORDS, IT COMPARES THE HASH AND THE PASSWORD GIVEN.
}
