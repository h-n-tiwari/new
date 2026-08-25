import { Database } from 'bun:sqlite';

const db = new Database('indexer.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS blocks (
    number INTEGER PRIMARY KEY,
    hash TEXT NOT NULL,
    parent_hash TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    transaction_count INTEGER NOT NULL,
    ipfs_cid TEXT
  )
`);

export function saveBlock(block: {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactionCount: number;
  ipfsCid?: string;
}) {
  const statement = db.prepare(`
    INSERT OR REPLACE INTO blocks (
      number,
      hash,
      parent_hash,
      timestamp,
      transaction_count,
      ipfs_cid
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  statement.run(
    block.number,
    block.hash,
    block.parentHash,
    block.timestamp,
    block.transactionCount,
    block.ipfsCid ?? null
  );
}
