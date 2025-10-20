// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChromaticMystery {
    struct MysterySession {
        address player;
        uint256 stake;
        uint256 score;
        bool active;
        uint8 currentMysteryIndex;
        uint256 lastRoundTimestamp;
        uint8[] mysterySequence;
        uint8 sequenceProgress;
    }

    mapping(address => MysterySession) public mysteries;

    event MysteryStarted(address indexed player, uint256 stake);
    event MysteryGuessSubmitted(address indexed player, uint8 guessedColor, bool correct);
    event MysterySequenceSolved(address indexed player, uint256 newScore, uint256 potentialReward);
    event MysteryGameLost(address indexed player, uint256 finalScore);
    event MysteryRewardClaimed(address indexed player, uint256 reward);

    function startMystery() external payable {
        require(msg.value >= 0.01 ether, "Minimum stake is 0.01 STT");
        require(!mysteries[msg.sender].active, "Game already active");

        // Generate initial mystery sequence (3-5 colors)
        uint8 sequenceLength = uint8((uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 3) + 3);
        uint8[] memory sequence = new uint8[](sequenceLength);

        for (uint8 i = 0; i < sequenceLength; i++) {
            uint256 randomValue = uint256(
                keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, i))
            );
            sequence[i] = uint8((randomValue % 5) + 1);
        }

        mysteries[msg.sender] = MysterySession({
            player: msg.sender,
            stake: msg.value,
            score: 0,
            active: true,
            currentMysteryIndex: 0,
            lastRoundTimestamp: block.timestamp,
            mysterySequence: sequence,
            sequenceProgress: 0
        });

        emit MysteryStarted(msg.sender, msg.value);
    }

    function guessMysteryColor(uint8 colorId) external {
        MysterySession storage session = mysteries[msg.sender];
        require(session.active, "No active game");
        require(colorId >= 1 && colorId <= 5, "Invalid color (1-5)");

        uint8 correctColor = session.mysterySequence[session.sequenceProgress];
        bool isCorrect = colorId == correctColor;

        if (isCorrect) {
            session.sequenceProgress++;

            if (session.sequenceProgress >= session.mysterySequence.length) {
                // Mystery solved!
                session.score++;
                session.sequenceProgress = 0;

                // Generate new mystery for next round
                uint8 newSequenceLength = uint8(
                    (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, session.score))) % 3) + 3
                );
                uint8[] memory newSequence = new uint8[](newSequenceLength);

                for (uint8 i = 0; i < newSequenceLength; i++) {
                    uint256 randomValue = uint256(
                        keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, i, session.score))
                    );
                    newSequence[i] = uint8((randomValue % 5) + 1);
                }

                session.mysterySequence = newSequence;

                emit MysterySequenceSolved(msg.sender, session.score, calculateReward(session.stake, session.score));
            }

            emit MysteryGuessSubmitted(msg.sender, colorId, true);
        } else {
            // Wrong guess - game over
            session.active = false;
            emit MysteryGuessSubmitted(msg.sender, colorId, false);
            emit MysteryGameLost(msg.sender, session.score);
        }
    }

    function claimMysteryReward() external {
        MysterySession storage session = mysteries[msg.sender];
        require(!session.active, "Game still active");
        require(session.stake > 0, "No reward to claim");

        uint256 reward = calculateReward(session.stake, session.score);

        // Clear session
        session.stake = 0;
        session.score = 0;

        // Transfer reward
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Transfer failed");

        emit MysteryRewardClaimed(msg.sender, reward);
    }

    function getMystery(address player) external view returns (MysterySession memory) {
        return mysteries[player];
    }

    function getMysterySequence(address player) external view returns (uint8[] memory) {
        return mysteries[player].mysterySequence;
    }

    function getSequenceProgress(address player) external view returns (uint8) {
        return mysteries[player].sequenceProgress;
    }

    function calculateReward(uint256 stake, uint256 score) public pure returns (uint256) {
        if (score == 0) return 0;

        uint256 multiplier = 120; // 1.2x = 120/100
        uint256 reward = stake;

        for (uint256 i = 0; i < score; i++) {
            reward = (reward * multiplier) / 100;
        }

        return reward;
    }

    function getPotentialReward(address player) external view returns (uint256) {
        MysterySession memory session = mysteries[player];
        return calculateReward(session.stake, session.score);
    }

    receive() external payable {}
}
