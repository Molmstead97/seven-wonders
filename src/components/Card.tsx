import React from "react";
import * as THREE from "three";
import { Card } from "../game-logic/types/card";

interface CardProps {
  card: Card;
}

export default ({ card }: CardProps) => {
    return <div>{card.name}</div>;
};

export type { CardProps };
