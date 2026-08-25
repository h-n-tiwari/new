import dotenv from "dotenv";

import {
  getLatestBlock,
  getBlock,
} from "./blockchain/indexer";

import {
  uploadToKubo,
} from "./ipfs/kubo";

import {
  uploadToPinata,
} from "./ipfs/pinata";

import {
  saveBlock,
} from "./database/database";
import { hash } from "bun";

dotenv.config();

async function main() {
  console.log("Starting blockchain indexer...");

  const latestBlock = await getLatestBlock();

  console.log(
    `Latest Block: ${latestBlock}`
  );

  const blockNumber = latestBlock;

  const block = await getBlock(
    blockNumber
  );

  console.log(
    `Processing Block: ${block.number}`
  );

  const blockData = {
    number: block.number,
    hash: block.hash,
    parentHash: block.parentHash,
    timestamp: block.timestamp,
    transactions: block.transactions,
  };

  // Store Complete block data on local IPFS
  const kuboCid = await uploadToKubo(
    blockData
  );

  // Pin the same data using Pinata
  const pinataCid = await uploadToPinata(
    blockData
  );

  console.log(
    "Kubo CID:",
    kuboCid
  );

  console.log(
    "Pinata CID:",
    pinataCid
  );

  // Store metadata in database
  saveBlock({
    number: block.number,
    hash: block.hash!,
    parentHash: block.parentHash!,
    timestamp: block.timestamp,
    transactionCount: block.transactions.length,
    ipfsCid: pinataCid,
  });

  console.log(
    `Block ${block.number} indexed successfully`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
})
