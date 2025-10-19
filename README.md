# Spectra - Fully On-Chain Survival Game

**Spectra** is a single-player, fully on-chain survival game deployed on **Somnia Testnet**. Players compete against the blockchain itself through color-based survival rounds with exponential rewards.

## Quick Start

### Prerequisites
- MetaMask wallet with STT (Somnia Token) on Somnia Testnet
- Modern web browser

### Play Now
1. Visit the Spectra DApp
2. Click "Connect MetaMask"
3. Approve network addition to Somnia Testnet
4. Enter stake amount (minimum 0.01 STT)
5. Click "Start Game"
6. Choose a color (1 in 5 chance to survive)
7. Claim rewards or continue playing

## Game Rules

### Objective
Survive as many color-guessing rounds as possible to multiply your stake.

### Gameplay Flow

\`\`\`
1. Start Game
   └─ Lock STT stake on-chain

2. Choose Color (1-5)
   ├─ Red (1)
   ├─ Blue (2)
   ├─ Green (3)
   ├─ Yellow (4)
   └─ Violet (5)

3. Blockchain Randomness
   └─ Contract generates random color (1-5)

4. Outcome
   ├─ Match → Survive, Score +1, Reward × 1.2
   └─ No Match → Game Over, Stake Lost

5. Decision
   ├─ Continue → Risk winnings for next round
   └─ Claim → End game, collect accumulated STT
\`\`\`

### Reward Formula

$$\text{Reward} = \text{Stake} \times 1.2^{\text{Score}}$$

**Examples:**
- Score 1: 1.2x stake
- Score 2: 1.44x stake
- Score 3: 1.728x stake
- Score 5: 2.488x stake
- Score 10: 6.192x stake

### Probability

Each round has a **20% survival rate** (1 in 5 chance).

**Expected Rounds Before Loss:**
- 50% chance to lose within 3 rounds
- 10% chance to reach score 10
- 1% chance to reach score 20

## Smart Contract

### Deployed Address
\`\`\`
0x0889DD96EC1f23930D111e7011BA9947FDCcC77b
\`\`\`

### Network
\`\`\`
Chain ID: 50312
Network: Somnia Testnet
RPC: https://dream-rpc.somnia.network
Explorer: https://shannon-explorer.somnia.network
\`\`\`

### Functions

#### `startGame()`
- **Type:** Payable
- **Input:** STT value (stake amount)
- **Output:** None
- **Effect:** Creates new game session, locks stake
- **Events:** `GameStarted`

#### `chooseColor(uint8 colorId)`
- **Type:** Non-payable
- **Input:** Color ID (1-5)
- **Output:** None
- **Effect:** Processes color choice, generates randomness, updates game state
- **Events:** `ColorChosen`, `RoundSurvived` or `GameLost`

#### `claimReward()`
- **Type:** Non-payable
- **Input:** None
- **Output:** None
- **Effect:** Ends game, transfers reward to player
- **Events:** `RewardClaimed`

#### `getGame(address player)`
- **Type:** View
- **Input:** Player address
- **Output:** GameSession struct
- **Returns:**
  ```solidity
  {
    address player,
    uint256 stake,
    uint256 score,
    bool active,
    uint256 lastRoundTimestamp
  }
  \`\`\`

#### `getPotentialReward(address player)`
- **Type:** View
- **Input:** Player address
- **Output:** Potential reward amount (uint256)

#### `calculateReward(uint256 stake, uint256 score)`
- **Type:** Pure
- **Input:** Stake amount, score
- **Output:** Calculated reward

### Events

```solidity
event GameStarted(address indexed player, uint256 stake);
event ColorChosen(address indexed player, uint8 colorId, bool survived, uint8 randomColor);
event RoundSurvived(address indexed player, uint256 newScore, uint256 potentialReward);
event GameLost(address indexed player, uint256 finalScore, uint8 chosenColor, uint8 randomColor);
event RewardClaimed(address indexed player, uint256 reward);
