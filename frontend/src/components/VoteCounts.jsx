import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "0x777736f96B60FA22A6B7b791E5c00dc14c0ac167"; // Replace with your deployed contract address
const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "candidates",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCandidates",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "candidateIndex", type: "uint256" },
    ],
    name: "getVotes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "votes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

const VoteCounts = () => {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    checkConnection();
    if (account) {
      fetchVoteCounts();
    }
  }, [account]);

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      try {
        const currentAccount = await signer.getAddress();
        setAccount(currentAccount);
        console.log("Already connected account:", currentAccount);
      } catch (error) {
        console.log("Not connected.");
      }
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Connected account:", address);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setError("Failed to connect to MetaMask.");
      }
    } else {
      setError("MetaMask is not installed.");
    }
  };

  const fetchVoteCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (account) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const votingContract = new ethers.Contract(
          contractAddress,
          abi,
          provider
        );

        const fetchedCandidates = await votingContract.getCandidates();
        setCandidates(fetchedCandidates);

        const fetchedVotes = await Promise.all(
          fetchedCandidates.map((_, index) => votingContract.getVotes(index))
        );
        setVotes(fetchedVotes.map((v) => v.toString()));
      }
    } catch (err) {
      console.error("Error fetching vote counts:", err);
      setError("Failed to fetch vote counts.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={styles.p}>Loading vote counts...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.body}>
      <header style={styles.header}>Vote Counts</header>
      <main style={styles.main}>
        {!account ? (
          <button onClick={connectMetaMask} style={styles.button}>
            Connect MetaMask
          </button>
        ) : (
          <div>
            <h2 style={styles.h2}>Current Vote Totals</h2>
            <ul style={styles.votesList}>
              {candidates.map((candidate, index) => (
                <li key={index} style={styles.listItem}>
                  <span style={styles.candidateName}>{candidate}:</span>
                  <span style={styles.voteCount}>
                    {votes[index] || 0} votes
                  </span>
                </li>
              ))}
            </ul>
            <p style={styles.connectedAccount}>Connected Account: {account}</p>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    backgroundColor: "#f7f9fc",
    color: "#333",
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    backgroundColor: "rgb(76,175,80)",
    color: "white",
    padding: "20px 0",
    fontSize: "1.5em",
    fontWeight: "bold",
    width: "100%",
    marginBottom: "20px",
  },
  main: {
    maxWidth: "600px",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1em",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "10px",
  },
  buttonHover: {
    backgroundColor: "#0b7dda",
  },
  h2: {
    color: "#333",
    marginBottom: "15px",
  },
  votesList: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemLast: {
    borderBottom: "none",
  },
  candidateName: {
    fontWeight: "bold",
    color: "#555",
  },
  voteCount: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  connectedAccount: {
    marginTop: "20px",
    color: "#777",
    fontSize: "0.9em",
  },
  p: {
    fontSize: "1em",
    color: "#555",
    marginTop: "10px",
  },
  error: {
    color: "#f44336",
    fontSize: "1em",
    marginTop: "10px",
  },
};

export default VoteCounts;
