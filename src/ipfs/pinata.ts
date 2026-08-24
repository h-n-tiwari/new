import dotenv from "dotenv";

dotenv.config();

const PINATA_API_URL = "https://uploads.pinata.cloud/v3/files";

export function uploadToPinata(data: unknown) {
  const jwt = process.env.PINATA_JWT;

  if (!jwt) {
    throw new Error("PINATA_JWT is missing");
  }

  // Convert data to a JSON string
  const json = JSON.stringify(data, null, 2);

  // Convert JSON -> File
  const file = new File(
    [json],
    "blockchain-data.json",
    {
      type: "application/json",
    }
  );











}
