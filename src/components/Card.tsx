import React from "react";
import * as THREE from "three";

import { Card } from "../data/types/card";

import { GameState } from "../game-logic/gameState";
import { Wonder } from "../data/types/wonder";

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
