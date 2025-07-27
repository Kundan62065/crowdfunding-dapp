import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./index.css"; // Optional styling

const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalFunds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

// 🔴 Replace this with your actual deployed contract address
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("0");

  // Connect to Web3 + Contract on load
  useEffect(() => {
    const loadWeb3AndContract = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);

        // Fetch balance from contract's totalFunds variable
        const total = await contractInstance.methods.totalFunds().call();
        setBalance(total);
      } else {
        alert("Please install MetaMask!");
      }
    };

    loadWeb3AndContract();
  }, []);

  // Handle contribution
  const contribute = async () => {
    if (!contract || !amount) {
      alert("Please enter amount and wait for contract to load.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();

      await contract.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether")
      });

      // Update displayed balance
      const newTotal = await contract.methods.totalFunds().call();
      setBalance(newTotal);
      setAmount("");
      alert("Contribution successful!");
    } catch (err) {
      console.error(err);
      alert("Transaction failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Crowdfunding DApp</h2>
      <p><strong>Connected Account:</strong> {account}</p>
      <p><strong>Total Funds Raised:</strong> {balance} wei</p>

      <input
        type="text"
        placeholder="Enter amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={contribute} style={{ padding: "6px 12px" }}>Contribute</button>
    </div>
  );
}

export default App;
