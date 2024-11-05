import { Card } from "../types/card";
import { cards } from "../../data/cards";

// NOTE: NO IDEA IF THIS IS WORKING, CAN'T TEST YET

export function dealCards(numPlayers: number, age: number): Card[] {
  // Filter purple cards
  const purpleCards = cards.filter((card) => card.cardColor === "Purple");

  // Shuffle purple cards
  const shuffledPurpleCards = purpleCards.sort(() => Math.random() - 0.5);

  // Filter and add correct number of copies for eligible cards
  let eligibleCards: Card[] = [];
  cards.forEach((card) => {
    if (card.age === age) {
      let playerCountInfo;
      
      if (age === 2 && card.cardColor === "Grey") {
        // Special handling for Grey cards in Age 2
        if (numPlayers >= 5) {
          playerCountInfo = { minPlayers: 5, copies: 2 };
        } else if (numPlayers >= 3) {
          playerCountInfo = { minPlayers: 3, copies: 1 };
        }
      } else {
        // Normal handling for other cards
        playerCountInfo = card.playerCount?.reduce<{ minPlayers: number; copies: number } | undefined>(
          (prev, curr) => {
            if (curr.minPlayers <= numPlayers) {
              if (!prev || curr.minPlayers > prev.minPlayers) {
                return curr;
              }
            }
            return prev;
          }, 
          undefined
        );
      }

      if (playerCountInfo && playerCountInfo.minPlayers <= numPlayers) {
        const copies = playerCountInfo.copies || 1;
        for (let i = 0; i < copies; i++) {
          eligibleCards.push({ ...card });  // Create a new copy of the card
        }
      }
    }
  });

  // Add shuffled purple cards if it's Age 3 and limit to numPlayers + 2
  if (age === 3) {
    const selectedPurpleCards = shuffledPurpleCards.slice(0, numPlayers + 2);
    eligibleCards.push(...selectedPurpleCards);
  }

  console.log(`Dealing cards for ${numPlayers} players, Age ${age}`);
  console.log(`Total eligible cards: ${eligibleCards.length}`);

  // Shuffle the eligible cards
  const shuffledCards = eligibleCards.sort(() => Math.random() - 0.5);
  console.log(`Shuffled cards:`, shuffledCards.map(card => card.name));

  // Calculate the number of cards to deal
  const cardsPerPlayer = 7;
  const totalCardsToDeal = numPlayers * cardsPerPlayer;

  console.log(`Total cards to deal: ${totalCardsToDeal}`);
  console.log(`Actually dealing: ${shuffledCards.slice(0, totalCardsToDeal).length} cards`);

  // Return the dealt cards
  return shuffledCards.slice(0, totalCardsToDeal);
}
