require('dotenv').config();

const Web3 = require('web3');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const newWhitelist = [['wallet', 'q', 'isContract']];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Write .csv filename here (without extension): ", (filename) => {
  rl.close();

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
    csv.writeToPath(`${filename}-formatted.csv`, newWhitelist);
  };

  const handleTransformRow = async (row) => {
    stream.pause();

    const isCodeValid = await checkCode(row.wallet);
    newWhitelist.push([
      row.wallet,
      row.q,
      isCodeValid ? 'TRUE' : 'FALSE',
    ]);

    stream.resume();
  };

  const stream = fs.createReadStream(path.resolve(__dirname, `${filename}.csv`))
    .pipe(csv.parse({ headers: true }))
    .on('error', handleError)
    .on('data', handleTransformRow)
    .on('end', handleEnd);
})
