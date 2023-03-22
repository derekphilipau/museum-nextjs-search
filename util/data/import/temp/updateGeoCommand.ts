/**
 * Import Elasticsearch data from JSON files.
 *
 * Temporary script, to be removed after the histogram data is added to the collections data import script.
 *
 * npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/updateGeoCommand.ts
 */
import * as fs from 'fs';
import { createWriteStream } from 'fs';
import * as readline from 'node:readline';

import { continents, countries } from '@/components/map/countries';
import { collectionsDataFile } from '../../dataFiles';

async function update() {
  const outputStream = createWriteStream(collectionsDataFile + '.geo');
  const fileStream = fs.createReadStream(collectionsDataFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const obj = line ? JSON.parse(line) : undefined;
    if (!obj) continue;
    if (obj.primaryGeographicalLocationCountry) {
      const countryData = countries.find(
        (c) => c.country === obj.primaryGeographicalLocationCountry
      );
      if (countryData) {
        obj.geographicalCoordinates = {
          lat: countryData.lat,
          lon: countryData.lon,
        };
      }
    }
    if (
      obj.primaryGeographicalLocationContinent &&
      !obj.geographicalCoordinates
    ) {
      const continentData = continents.find(
        (c) => c.continent === obj.primaryGeographicalLocationContinent
      );
      if (continentData) {
        obj.geographicalCoordinates = {
          lat: continentData.lat,
          lon: continentData.lon,
        };
      }
    }
    outputStream.write(`${JSON.stringify(obj)}\n`);
  }
}

async function run() {
  await update();
}

run();
