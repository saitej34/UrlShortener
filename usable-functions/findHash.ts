import crypto from "crypto";


export default function generateHash(text : string) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex').slice(0, 5);
  }