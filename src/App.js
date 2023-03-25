import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);


function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockInfo, setBlockInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    async function getBlockInfo() {
      const blockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(blockNumber);

      const block = await alchemy.core.getBlockWithTransactions(blockNumber);
      setBlockInfo(block);
      setTransactions(block.transactions);

      const fetchedReceipts = [];
      for (const transaction of block.transactions) {
        const receipt = await alchemy.core.getTransactionReceipt(transaction.hash);
        fetchedReceipts.push(receipt);
      }
      setReceipts(fetchedReceipts);
    }

    getBlockInfo();
  }, []);

  return (
    <div className="App">
      <h1>Block Number: {blockNumber}</h1>
      {blockInfo && (
        <div>
          <h2>Block Information:</h2>
          <pre>{JSON.stringify(blockInfo, null, 2)}</pre>
        </div>
      )}
      {transactions.length > 0 && (
        <div>
          <h2>Transactions:</h2>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>
                <pre>{JSON.stringify(transaction, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
      {receipts.length > 0 && (
        <div>
          <h2>Transaction Receipts:</h2>
          <ul>
            {receipts.map((receipt, index) => (
              <li key={index}>
                <pre>{JSON.stringify(receipt, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
