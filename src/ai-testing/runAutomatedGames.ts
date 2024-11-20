import { automateGame } from './automateGame';

const numberOfGames = 10; // or whatever number you want to test
const aiPlayerCount = 5; // or whatever number you want to test

console.log(`Running ${numberOfGames} automated games with ${aiPlayerCount} AI players each...`);

for (let i = 0; i < numberOfGames; i++) {
    console.log(`\nGame ${i + 1}:`);
    automateGame(aiPlayerCount);
}