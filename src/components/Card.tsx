import React from "react";
import * as THREE from "three";

import { Card } from "../game-logic/types/card";

import { GameState } from "../game-logic/gameState";
import { Wonder } from "../game-logic/types/wonder";

interface CardProps {
  card: Card;
  gameState: GameState;
  playerId: number;
  currentWonder: Wonder;
}



export default ({ card }: CardProps) => {
  return <div>{card.name}</div>;
};



export type { CardProps };
