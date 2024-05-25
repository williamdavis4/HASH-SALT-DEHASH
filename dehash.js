//will_irs was here bro, no 9-5 in sight.
//rolex on one wrist, ap on the other; we grab a slut by the neck and trickshot that hoe with a bottle of ciroc, and that's not even on gang; that's on N
//no brokies aloud to use this ty

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const api_key = 'insertyourapikeyhere';
const url = 'https://hashes.com/en/api/search';

// Function to dehash a single hash:salt pair
async function dehash(hash_value) {
  try {
    const data = new URLSearchParams();
    data.append('key', api_key);
    data.append('hashes[]', hash_value);

    const response = await axios.post(url, data, { timeout: 10000 });
    if (response.status === 200) {
      const response_data = response.data;
      if (response_data.success) {
        const founds = response_data.founds;
        if (founds.length > 0) {
          return founds[0].plaintext;
        } else {
          return "No plaintext password found in the response.";
        }
      } else {
        return "API request failed: " + response_data.message;
      }
    } else {
      return "Failed to retrieve data: " + response.status;
    }
  } catch (error) {
    return "An error occurred: " + error.message;
  }
}

// Function to process a single file
async function processFile(filePath) {
  try {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    if (lines.length >= 3) {
      const hash_salt = lines[2].trim();
      const plaintext = await dehash(hash_salt);
      lines[2] = plaintext;
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`Dehashed and saved: ${filePath}`);
    } else {
      console.log(`Invalid file format: ${filePath}`);
    }
  } catch (error) {
    console.log(`Error processing file ${filePath}: ${error}`);
  }
}

// Function to process all files in the directory
async function processFilesInDirectory(directory) {
  try {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      if (file.endsWith('.txt')) {
        await processFile(filePath);
      }
    }
  } catch (error) {
    console.log(`Error reading directory ${directory}: ${error}`);
  }
}

// Entry point
const directory = __dirname; // Current directory
processFilesInDirectory(directory);
