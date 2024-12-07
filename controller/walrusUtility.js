// Set your environment variables
const AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const PUBLISHER = "https://publisher.walrus-testnet.walrus.space";

// Function to store JSON data as a blob
async function storeBlob(jsonData, epochs = 5) {
  try {
    // Convert JSON data to a string
    const dataString = JSON.stringify(jsonData);

    // Check the size of the data
    const blobSize = new Blob([dataString]).size;
    const maxBlobSize = 10 * 1024 * 1024; // 10 MB

    if (blobSize > maxBlobSize) {
      throw new Error("Blob size exceeds the 10 MB limit.");
    }

    // Construct the API URL
    const url = `${PUBLISHER}/v1/store?epochs=${epochs}`;

    // Make the HTTP PUT request
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: dataString,
    });

    if (!response.ok) {
      throw new Error(`Failed to store blob: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Blob stored successfully:", result);

    // Return the blobId
    return result.newlyCreated?.blobObject.blobId || result.alreadyCertified?.blobId;
  } catch (error) {
    console.error("Error storing blob:", error);
    throw error;
  }
}

// Function to read a blob using its blob ID
async function readBlob(blobId) {
  try {
    if (!blobId) {
      throw new Error("Blob ID is required to read the blob.");
    }

    // Construct the API URL
    const url = `${AGGREGATOR}/v1/${blobId}`;

    // Make the HTTP GET request
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to read blob: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Blob data retrieved:", data);

    // Return the blob data
    return data;
  } catch (error) {
    console.error("Error reading blob:", error);
    throw error;
  }
}

// // Example usage
// (async () => {
//   try {
//     // Example JSON data
//     const exampleJsonData = {
//       message: "Hello, this is a test blob!",
//       timestamp: Date.now(),
//       additionalInfo: {
//         key: "value",
//         number: 42,
//       },
//     };

//     // Store the blob and get its blob ID
//     const epochs = 5; // Number of epochs to store the blob
//     const blobId = await storeBlob(exampleJsonData, epochs);

//     console.log("Stored Blob ID:", blobId);

//     // Read the blob using the blob ID
//     if (blobId) {
//       const retrievedData = await readBlob(blobId);
//       console.log("Retrieved Blob Data:", retrievedData);
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// })();
