import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom"; // Import the Link component

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
    inputs: [
      { internalType: "uint256", name: "candidateIndex", type: "uint256" },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
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

const VotingApp = () => {
  const [account, setAccount] = useState("");
  const [candidates, setCandidates] = useState([
    "Candidate 1",
    "Candidate 2",
    "Candidate 3",
  ]);
  const [votes, setVotes] = useState([]);
  const [voteStatus, setVoteStatus] = useState("");
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isConnected) {
      displayVotes();
    }
  }, [isConnected]);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        console.log("Connected account:", address);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
      alert(
        "MetaMask is not installed. Please install MetaMask to use this feature."
      );
    }
  };

  const castVote = async () => {
    if (!isConnected) {
      alert("Please connect to MetaMask first.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const votingContract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await votingContract.vote(selectedCandidateIndex);
      setVoteStatus("Casting vote...");
      await tx.wait();
      setVoteStatus(
        `Successfully voted for ${candidates[selectedCandidateIndex]}`
      );
      console.log(
        `Successfully voted for ${candidates[selectedCandidateIndex]}`
      );
      // Optionally, you might want to refresh the vote counts after voting
      // await displayVotes();
    } catch (error) {
      console.error("Error casting vote:", error);
      setVoteStatus("Error casting vote. Please try again.");
    }
  };

  // We still need displayVotes to populate candidates for the voting section
  const displayVotes = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const votingContract = new ethers.Contract(
        contractAddress,
        abi,
        provider
      );

      const fetchedCandidates = await votingContract.getCandidates();
      setCandidates(fetchedCandidates);

      // We are no longer setting the 'votes' state here
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const handleCandidateChange = (event) => {
    setSelectedCandidateIndex(parseInt(event.target.value));
  };

  return (
    <div style={styles.body}>
      <header style={styles.header}>Blockchain Voting System</header>
      <main style={styles.main}>
        <button onClick={connectMetaMask} style={styles.button}>
          Connect MetaMask
        </button>
        {isConnected && <p style={styles.p}>Connected account: {account}</p>}

        {isConnected && (
          <div id="votingSection" style={styles.votingSection}>
            <h2 style={styles.h2}>Cast Your Vote</h2>
            <div style={styles.radioGroup}>
              {candidates.map((candidate, index) => (
                <div key={index} style={styles.radioItem}>
                  <input
                    type="radio"
                    id={`candidate-${index}`}
                    name="candidate"
                    value={index}
                    checked={selectedCandidateIndex === index}
                    onChange={handleCandidateChange}
                    style={styles.radioInput}
                  />
                  <label
                    htmlFor={`candidate-${index}`}
                    style={styles.radioLabel}
                  >
                    {candidate}
                  </label>
                </div>
              ))}
            </div>
            <button onClick={castVote} style={styles.button}>
              Vote
            </button>
            <p id="voteStatus" style={styles.p}>
              {voteStatus}
            </p>
          </div>
        )}

        {/* Button to navigate to the VoteCounts page */}
        {isConnected && (
          <Link to="/votes" style={styles.link}>
            <button style={styles.viewVotesButton}>View Vote Counts</button>
          </Link>
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
  },
  header: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "20px 0",
    fontSize: "1.5em",
    fontWeight: "bold",
  },
  main: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  button: {
    backgroundColor: "#4caf50",
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
    backgroundColor: "#45a049",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: "10px 0",
  },
  radioItem: {
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
  },
  radioInput: {
    marginRight: "10px",
  },
  radioLabel: {
    fontSize: "1em",
    color: "#555",
  },
  p: {
    fontSize: "1em",
    margin: "10px 0",
    color: "#555",
  },
  votingSection: {
    marginTop: "20px",
  },
  link: {
    textDecoration: "none",
  },
  viewVotesButton: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "1em",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background-color 0.3s",
  },
  viewVotesButtonHover: {
    backgroundColor: "#0b7dda",
  },
};

export default VotingApp;
