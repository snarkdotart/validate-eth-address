require('dotenv').config();

const Web3 = require('web3');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

const newWhitelist = [['wallet', 'q', 'isContract']];

const checkCode = async (address) => {
  try {
    const code = await web3.eth.getCode(address);

    return code !== '0x';
  } catch (e) {
    console.log(e);
  }
};

const handleError = (error) => {
  console.error(error);
};

const handleEnd = () => {
  console.log(newWhitelist);
  csv.writeToPath('whitelist-formatted.csv', newWhitelist);
};

const handleTransformRow = async (row) => {
  const isCodeValid = await checkCode(row.wallet);

  newWhitelist.push([
    row.wallet,
    row.q,
    isCodeValid ? 'TRUE' : 'FALSE',
  ]);
};

fs.createReadStream(path.resolve(__dirname, 'whitelist.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', handleError)
  .on('data', handleTransformRow)
  .on('end', handleEnd);
