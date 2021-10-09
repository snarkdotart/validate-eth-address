require('dotenv').config();

const Web3 = require('web3');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

type Whitelist = Array<[string, string, string]>;
interface IWhitelistItem {
  wallet: string;
  q: string;
}

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const newWhitelist: Whitelist = [['wallet', 'q', 'isContract']];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Write .csv filename here (without extension): ", (filename: string): void => {
  rl.close();

  const checkCode = async (address: string): Promise<boolean> => {
    try {
      const code: string = await web3.eth.getCode(address);

      return code !== '0x';
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  const handleError = (error: string): void => {
    console.error(error);
  };

  const handleEnd = (): void => {
    csv.writeToPath(`${__dirname}/${filename}-formatted.csv`, newWhitelist);
  };

  const handleTransformRow = async (row: IWhitelistItem): Promise<void> => {
    stream.pause();

    const isCodeValid: boolean = await checkCode(row.wallet);
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
});
