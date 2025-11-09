# Spectra - On-Chain Color Guessing Game

A fully on-chain blockchain game built on Somnia Testnet where players guess colors to multiply their stake. Features smart contract integration, Web3 wallet connectivity, and a beautiful cyberpunk-inspired UI.

##  Game Overview

**Spectra** is a provably fair, on-chain game where players:
1. Connect their MetaMask wallet to Somnia Testnet
2. Stake STT tokens (minimum 0.01 STT)
3. Choose one of 5 colors (Red, Blue, Green, Yellow, Violet)
4. Win if they match the randomly generated color (20% chance)
5. Earn 1.2x multiplier per successful round
6. Claim rewards at any time or continue playing

##  Quick Start

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd spectra

# Install dependencies
pnpm install
# or
npm install
# or
yarn install

# Run development server
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Network Configuration

The game runs on **Somnia Testnet**:
- **Chain ID:** 50312 (0xc4a8 in hex)
- **RPC URL:** https://dream-rpc.somnia.network
- **Explorer:** https://shannon-explorer.somnia.network
- **Native Token:** STT (Somnia Token)

**Get Testnet Tokens:**
Visit the [Somnia Faucet](https://faucet.somnia.network) to get free STT tokens for testing.

##  Smart Contract

### Contract Address
```
0x0889DD96EC1f23930D111e7011BA9947FDCcC77b
```

### Key Functions

```solidity
// Start a new game (payable)
function startGame() external payable

// Choose a color (1-5)
function chooseColor(uint8 colorId) external

// Claim your reward
function claimReward() external

// View your game state
function getGame(address player) external view returns (GameSession)

// Calculate potential reward
function calculateReward(uint256 stake, uint256 score) public pure returns (uint256)
```

### Game Mechanics

* **Color IDs:** 1=Red, 2=Blue, 3=Green, 4=Yellow, 5=Violet
* **Win Probability:** 20% (1 in 5)
* **Reward Multiplier:** 1.2x per round
* **Minimum Stake:** 0.01 STT
* **Randomness:** On-chain using `block.timestamp`, `block.prevrandao`, and player data

##  Features

### Wallet Integration
- MetaMask connection with auto-detection
- Automatic network switching to Somnia Testnet
- Network addition if not present
- Persistent connection state
- Account change handling

### Game Features
- Real-time game state updates
- Live balance tracking
- Score progression
- Potential reward calculation
- Visual color selection
- Animated result feedback
- Claim rewards anytime

### UI/UX
- Cyberpunk-inspired gradient design
- Animated background patterns
- Responsive layout (mobile-friendly)
- Loading states and error handling
- Color-coded status indicators
- Smooth transitions and animations

### Expected Value

The game has negative expected value:
```
EV per round = Stake × 1.2 × 0.2 = Stake × 0.24
```

This means on average, you can expect to lose 76% of your stake per round.

See [GAME_STRATEGY.md](GAME_STRATEGY.md) for detailed strategy analysis.

##  Technology Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library

### Blockchain
- **Viem** - Ethereum library
- **Solidity 0.8.30** - Smart contracts
- **Somnia Testnet** - Blockchain network

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Package management

##  Security Considerations

### Smart Contract
- Minimum stake enforcement (0.01 STT)
- No active game check before starting
- Proper reward calculation with overflow protection
- Failed transfer handling
- On-chain randomness (note: not cryptographically secure)

### Frontend
- No localStorage for sensitive data
- Proper error handling for all blockchain interactions
- Transaction timeout protection (60 seconds)
- Network validation before transactions

**Warning:** This is a testnet demonstration. The on-chain randomness using `block.prevrandao` is not suitable for production mainnet gambling applications.

##  Usage Examples

### Starting a Game

```typescript
// 1. Connect wallet
await window.ethereum.request({ method: 'eth_requestAccounts' });

// 2. Start game with 0.01 STT stake
const tx = await startGame("0.01");
await tx.wait();

// 3. Choose a color (1-5)
await chooseColor(1); // Red

// 4. Claim reward if you want to stop
await claimReward();
```

### Checking Game State

```typescript
const gameState = await getGameState();
console.log({
  active: gameState.active,
  stake: gameState.stake,
  score: gameState.score,
  potentialReward: gameState.potentialReward
});
```

##  Environment Variables

Create `.env.local` (optional):

```env
# No API keys needed for testnet
# Network configuration is hardcoded
```

##  Troubleshooting

### MetaMask Connection Issues
1. Ensure MetaMask is installed and unlocked
2. Check you're on Somnia Testnet (Chain ID: 50312)
3. Clear browser cache and reconnect
4. Try disabling other wallet extensions

### Transaction Failures
1. Verify you have enough STT tokens
2. Check gas balance (need STT for gas)
3. Wait for previous transaction to confirm
4. Try increasing gas limit manually in MetaMask

### Game State Not Updating
1. Refresh the page
2. Wait 5-10 seconds for blockchain sync
3. Check transaction on explorer
4. Disconnect and reconnect wallet

##  Build & Deploy

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔗 Links

- **Explorer:** [View Contract on Somnia](https://shannon-explorer.somnia.network/address/0x0889DD96EC1f23930D111e7011BA9947FDCcC77b)
- **Faucet:** [Get Testnet STT](https://faucet.somnia.network)
- **Somnia Docs:** [Documentation](https://docs.somnia.network)

##  Disclaimer

This is a **testnet demonstration project** for educational purposes only. 

- Use only testnet tokens (no real value)
- On-chain randomness is not cryptographically secure
- Not audited for production use
- Gambling can be addictive - play responsibly
- No warranty or guarantee of any kind

