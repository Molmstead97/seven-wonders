import { Card } from "../types/card";
import { cards } from "../data/cards";

export function dealCards(numPlayers: number, age: number): Card[] {
  // Filter purple cards
  const purpleCards = cards.filter((card) => card.color === "Purple");

  // Shuffle purple cards
  const shuffledPurpleCards = purpleCards.sort(() => Math.random() - 0.5);

  // Filter other eligible cards based on age and number of players
  const eligibleCards = cards.filter(
    (card) =>
      card.age === age &&
      card.playerCount?.some((count) => count.minPlayers <= numPlayers)
  );

  // Add shuffled purple cards if it's Age 3 and limit to numPlayers + 2
  if (age === 3) {
    const selectedPurpleCards = shuffledPurpleCards.slice(0, numPlayers + 2);
    eligibleCards.push(...selectedPurpleCards);
  }

  // Shuffle the eligible cards
  const shuffledCards = eligibleCards.sort(() => Math.random() - 0.5);

  // Calculate the number of cards to deal
  const cardsPerPlayer = 7;
  const totalCardsToDeal = numPlayers * cardsPerPlayer;

  // Return the dealt cards
  return shuffledCards.slice(0, totalCardsToDeal);
}
