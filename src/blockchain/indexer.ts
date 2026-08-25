import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(
  process.env.BLOCKCHAIN_RPC_URL
);

export async function getLatestBlock() {
  return await provider.getBlockNumber();
}

export async function getBlock(blockNumber: number) {
  const block = await provider.getBlock(
    blockNumber,
    true
  );

  if (!block) {
    throw new Error(
      `Block ${blockNumber} not found`
    );
  }

  return {
    number: block.number,
    hash: block.hash,
    parentHash: block.parentHash,
    timestamp: block.timestamp,
    transactions: block.transactions,
  };

}
