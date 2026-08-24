import dotenv from "dotenv";

dotenv.config();

const PINATA_API_URL = "https://uploads.pinata.cloud/v3/files";


interface PinataUploadResponse {
  data: {
    cid: string;
  };
}

export async function uploadToPinata(data: unknown) {
  const jwt = process.env.PINATA_JWT;

  if (!jwt) {
    throw new Error("PINATA_JWT is missing");
  }

  // Convert JavaScript data → JSON
  const json = JSON.stringify(data, null, 2);

  // Convert JSON → File
  const file = new File(
    [json],
    "blockchain-data.json",
    {
      type: "application/json",
    }
  );

  // Create multipart/form-data
  const formData = new FormData();

  formData.append("file", file);

  // Send request directly to Pinata API
  const response = await fetch(
    PINATA_API_URL,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Pinata upload failed: ${response.status} ${error}`
    );
  }

  const result = (await response.json()) as PinataUploadResponse;

  console.log("Pinata CID:", result.data.cid);

  return result.data.cid;
}
