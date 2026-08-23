import { create } from 'kubo-rpc-client';

import dotenv from "dotenv";

dotenv.config();

const kubo = create({
  url: process.env.KUBO_API_URL,
});

export async function uploadToKubo(data: unknown) {
  const content = JSON.stringify(data, null, 2);

  const result = await kubo.add(content);

  console.log("Kubo CID:", result.cid.toString());

  return result.cid.toString();
}

export async function getFromKubo(cid: string) {
  const chunks: Uint8Array[] = [];

  for await (const chunk of kubo.cat(cid)) {
    chunks.push(chunk);
  }

  const data = Buffer.concat(chunks);

  return JSON.parse(data.toString());
}
