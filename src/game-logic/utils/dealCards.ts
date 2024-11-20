import { Card } from "../types/card";
import { cards } from "../../data/cards";

export function dealCards(numPlayers: number, age: number): Card[] {
  // Filter purple cards
  const purpleCards = cards.filter((card) => card.cardColor === "Purple");

  // Shuffle purple cards
  const shuffledPurpleCards = purpleCards.sort(() => Math.random() - 0.5);
  console.log('=== AGE START ===');
  console.log(`=== Dealing Age ${age} cards for ${numPlayers} players ===`);

  // Filter and add correct number of copies for eligible cards
  let eligibleCards: Card[] = [];
  cards.forEach((card) => {
    if (card.age === age) {
      
      const playerCountInfo = card.playerCount?.reduce<{ minPlayers: number; copies: number } | undefined>(
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

      if (playerCountInfo && playerCountInfo.minPlayers <= numPlayers) {
        const copies = playerCountInfo.copies || 1;
        for (let i = 0; i < copies; i++) {
          eligibleCards.push({ ...card });
        }
      }
    }
  });

  // Add shuffled purple cards if it's Age 3
  if (age === 3) {
    const selectedPurpleCards = shuffledPurpleCards.slice(0, numPlayers + 2);
    eligibleCards.push(...selectedPurpleCards);
  }

  // Shuffle the eligible cards
  const shuffledCards = eligibleCards.sort(() => Math.random() - 0.5);

  // Calculate the number of cards to deal
  const cardsPerPlayer = 7;
  const totalCardsToDeal = numPlayers * cardsPerPlayer;

  console.log(`Total cards in deck: ${shuffledCards.length}`);
  console.log(`Total cards needed: ${totalCardsToDeal}`);

  // Return the dealt cards
  return shuffledCards.slice(0, totalCardsToDeal);
}
