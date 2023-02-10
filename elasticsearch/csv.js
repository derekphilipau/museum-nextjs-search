import fs from 'fs';
import {parse} from 'csv-parse';

export async function readCsvFileToArray(filename, delimiter = ',') {
  const promise = () => new Promise((resolve, reject) => {
    const arr=[];

    fs.createReadStream(filename)
      .pipe(parse({delimiter, columns: true}))
      .on('data', function(csvrow) {
        //console.log(csvrow);
        //do something with csvrow
        arr.push(csvrow);        
    })
    .on('end',function() {
      resolve(arr)
    })
    .on('error', function(err) {
      reject(err);
    });
  });

  const arr = await promise();
  return arr;
}