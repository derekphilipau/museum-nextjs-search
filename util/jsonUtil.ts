import { createReadStream } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';
import readline from 'readline';

/**
 * Usage:
 * let jsonArray = await loadJsonFile('path-to-your-file.json.gz');
 * 
 * @param filePath Path to the gzipped JSON file
 * @returns Array of JSON objects
 */
export async function loadJsonFile(filePath: string) {
    // Create a stream to read the gzipped file
    const readStream = createReadStream(filePath);
    // Create a Gunzip stream to unzip data
    const gunzipStream = createGunzip();
    // Create readline interface for reading the file line by line
    const rl = readline.createInterface({ input: gunzipStream });
    
    // Array to store JSON objects
    const jsonArray: any[] = [];

    // Read the file line by line
    rl.on('line', (line) => {
        // Parse each line to a JSON object and push it to the array
        jsonArray.push(JSON.parse(line));
    });

    // Wait for the 'close' event to make sure all lines have been read
    await new Promise(resolve => rl.on('close', resolve));

    // Use pipeline to pipe the read stream through the Gunzip stream
    await pipeline(readStream, gunzipStream);

    return jsonArray;
}
