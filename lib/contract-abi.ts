export const SPECTRA_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint8", name: "colorId", type: "uint8" },
      { indexed: false, internalType: "bool", name: "survived", type: "bool" },
      { indexed: false, internalType: "uint8", name: "randomColor", type: "uint8" },
    ],
    name: "ColorChosen",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "finalScore", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "chosenColor", type: "uint8" },
      { indexed: false, internalType: "uint8", name: "randomColor", type: "uint8" },
    ],
    name: "GameLost",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "stake", type: "uint256" },
    ],
    name: "GameStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "reward", type: "uint256" },
    ],
    name: "RewardClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "newScore", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "potentialReward", type: "uint256" },
    ],
    name: "RoundSurvived",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "stake", type: "uint256" },
      { internalType: "uint256", name: "score", type: "uint256" },
    ],
    name: "calculateReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "colorId", type: "uint8" }],
    name: "chooseColor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "games",
    outputs: [
      { internalType: "address", name: "player", type: "address" },
      { internalType: "uint256", name: "stake", type: "uint256" },
      { internalType: "uint256", name: "score", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
      { internalType: "uint256", name: "lastRoundTimestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "getGame",
    outputs: [
      {
        components: [
          { internalType: "address", name: "player", type: "address" },
          { internalType: "uint256", name: "stake", type: "uint256" },
          { internalType: "uint256", name: "score", type: "uint256" },
          { internalType: "bool", name: "active", type: "bool" },
          { internalType: "uint256", name: "lastRoundTimestamp", type: "uint256" },
        ],
        internalType: "struct Spectra.GameSession",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "getPotentialReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const

export const SPECTRA_CONTRACT_ADDRESS = "0x0889DD96EC1f23930D111e7011BA9947FDCcC77b"
