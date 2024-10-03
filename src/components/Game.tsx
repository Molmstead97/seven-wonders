import React, { useState, useEffect } from 'react';
import { Card } from '../types/card';
import { Resource, ResourceType, Gold, VictoryPoints, Science, Shields, Production } from '../types/resource';
import { Wonder } from '../types/wonder';
import { Player } from '../types/player';
import GameBoard from './GameBoard';
import PlayerArea from './PlayerArea';
import PlayerHand from './PlayerHand';
import ActionPanel from './components/ActionPanel';
import { dealCards } from '../utils/cardDealer';
import { setupPlayers } from '../utils/setupPlayers';

interface InitialGameState {
  age: number;
  players: Player[];
  deck: Card[];
  discardPile: Card[];
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<InitialGameState | null>(null);
  
  const initializeGame = (numPlayers: number, age: number): InitialGameState => {
    const players = setupPlayers();
    
    
    const initialCards: Card[] = dealCards(numPlayers, age);

    return {
      age: 1,
      players,
      deck: initialCards,
      discardPile: [],
      // ... other game state properties
    };
  };

  useEffect(() => {
    const gameState = initializeGame(4, 1); // Example with 4 players, age 1
    setGameState(gameState);
  }, []);

  /*const handleCardPlay = (card: Card) => {
    function playCard(player: Player, card: Card) {
        // Add the card to the player's board
        player.playerBoard.push(card);
        
        // Apply the effects of the card
        applyCardEffects(player, card);
        
        // Remove the card from the player's hand
        const index = player.playerHand.indexOf(card);
        if (index > -1) {
          player.playerHand.splice(index, 1);
        }
      }
      
      function applyCardEffects(player: Player, card: Card) {
        // Apply resource production
        if (card.production) {
          applyProduction(player, card.production);
        }
      
        // Apply victory points
        if (card.victoryPoints) {
          player.victoryPoints.victoryPoints += card.victoryPoints.victoryPoints;
        }
      
        // Apply gold
        if (card.gold) {
          player.coin.gold += card.gold.gold;
        }
      
        // Apply science
        if (card.science) {
          player.science[card.science.type]++;
        }
      
        // Apply shields
        if (card.shields) {
          player.military.shields += card.shields.shields;
        }
      }
      
      function applyProduction(player: Player, production: Production) {
        // Handle resource production based on card effects
        Object.entries(production).forEach(([resource, amount]) => {
          if (amount !== undefined) {
            player.resources[resource as ResourceType] = 
              (player.resources[resource as ResourceType] || 0) + amount;
          }
        });
      }
      
  }; */

  const handleWonderBuild = () => {
    // Logic for building a wonder stage
  };

  const handleCardDiscard = (card: Card) => {
    const index = this.playerHand.indexOf(card);
    if (index > -1) {
      this.playerHand.splice(index, 1);
    }
    this.coin.gold += 3;
  };

  const handleResourceTrade = () => {
    // Logic for trading with players
  };

  const handlePassHand = () => {
    // Logic for passing the hand
  };

  const regenerateResources = () => {
    // Logic for regenerating resources at the start of the round
  };

  const handleAgeEnd = () => {
    // Logic for ending the age
  };

  const handleEndGame = () => {
    // Logic for ending the game
  };

  return (
    <>
      
    </>
  );
};

export default Game;







