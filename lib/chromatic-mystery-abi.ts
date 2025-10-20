export const CHROMATIC_MYSTERY_ADDRESS = "0xb4ff3973F012a4b3709DE4083924930E1fD4ab11"

export const CHROMATIC_MYSTERY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "finalScore",
        type: "uint256",
      },
    ],
    name: "MysteryGameLost",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "guessedColor",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "correct",
        type: "bool",
      },
    ],
    name: "MysteryGuessSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "MysteryRewardClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newScore",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "potentialReward",
        type: "uint256",
      },
    ],
    name: "MysterySequenceSolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
    ],
    name: "MysteryStarted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
    ],
    name: "calculateReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "claimMysteryReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getMystery",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "stake",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "score",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "currentMysteryIndex",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "lastRoundTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint8[]",
            name: "mysterySequence",
            type: "uint8[]",
          },
          {
            internalType: "uint8",
            name: "sequenceProgress",
            type: "uint8",
          },
        ],
        internalType: "struct ChromaticMystery.MysterySession",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getMysterySequence",
    outputs: [
      {
        internalType: "uint8[]",
        name: "",
        type: "uint8[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getPotentialReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "getSequenceProgress",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "colorId",
        type: "uint8",
      },
    ],
    name: "guessMysteryColor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "mysteries",
    outputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "stake",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
      {
        internalType: "uint8",
        name: "currentMysteryIndex",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "lastRoundTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "sequenceProgress",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startMystery",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const
