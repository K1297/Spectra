// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Spectra {
    // Constants
    uint8 private constant MAX_COLOR = 5;
    uint256 private constant MIN_STAKE = 0.01 ether;
    uint256 private constant REWARD_MULTIPLIER = 120; // 1.2x = 120%

    // Game session structure
    struct GameSession {
        address player;
        uint256 stake;
        uint256 score;
        bool active;
        uint256 lastRoundTimestamp;
    }

    // State
    mapping(address => GameSession) public games;

    // Events
    event GameStarted(address indexed player, uint256 stake);
    event ColorChosen(address indexed player, uint8 colorId, bool survived, uint8 randomColor);
    event RoundSurvived(address indexed player, uint256 newScore, uint256 potentialReward);
    event GameLost(address indexed player, uint256 finalScore, uint8 chosenColor, uint8 randomColor);
    event RewardClaimed(address indexed player, uint256 reward);

    // Start a new game
    function startGame() external payable {
        require(msg.value >= MIN_STAKE, "Stake too low");
        require(!games[msg.sender].active, "Game already active");

        games[msg.sender] = GameSession({
            player: msg.sender,
            stake: msg.value,
            score: 0,
            active: true,
            lastRoundTimestamp: block.timestamp
        });

        emit GameStarted(msg.sender, msg.value);
    }

    // Choose a color (1-5)
    function chooseColor(uint8 colorId) external {
        require(colorId >= 1 && colorId <= MAX_COLOR, "Invalid color");
        require(games[msg.sender].active, "No active game");

        GameSession storage game = games[msg.sender];

        // Generate on-chain randomness
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    game.score,
                    game.lastRoundTimestamp
                )
            )
        ) % MAX_COLOR + 1;

        uint8 randomColor = uint8(random);

        if (randomColor == colorId) {
            // Survived!
            game.score++;
            game.lastRoundTimestamp = block.timestamp;

            uint256 potentialReward = calculateReward(game.stake, game.score);

            emit ColorChosen(msg.sender, colorId, true, randomColor);
            emit RoundSurvived(msg.sender, game.score, potentialReward);
        } else {
            // Lost!
            game.active = false;

            emit ColorChosen(msg.sender, colorId, false, randomColor);
            emit GameLost(msg.sender, game.score, colorId, randomColor);
        }
    }

    // Claim reward and end game
    function claimReward() external {
        GameSession storage game = games[msg.sender];
        require(game.stake > 0, "No active game");

        uint256 reward = calculateReward(game.stake, game.score);

        // Reset game
        game.active = false;
        game.stake = 0;
        game.score = 0;

        // Transfer reward
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    // Calculate reward based on stake and score
    function calculateReward(uint256 stake, uint256 score) public pure returns (uint256) {
        if (score == 0) return 0;

        uint256 reward = stake;
        for (uint256 i = 0; i < score; i++) {
            reward = (reward * REWARD_MULTIPLIER) / 100;
        }
        return reward;
    }

    // Get current game state
    function getGame(address player) external view returns (GameSession memory) {
        return games[player];
    }

    // Get potential reward for current game
    function getPotentialReward(address player) external view returns (uint256) {
        GameSession memory game = games[player];
        if (!game.active) return 0;
        return calculateReward(game.stake, game.score);
    }

    // Receive ETH
    receive() external payable {}
}
