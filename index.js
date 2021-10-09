require('dotenv').config();

const Web3 = require('web3');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

const checkCode = async (code) => {
  try {
    const code = await web3.eth.getCode(code);
    console.log(code);
  } catch (e) {
    console.log(e);
  }
};

fs.createReadStream(path.resolve(__dirname, 'whitelist.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', (error) => console.error(error))
  .on('data', (row) => console.log(row))
  .on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));
