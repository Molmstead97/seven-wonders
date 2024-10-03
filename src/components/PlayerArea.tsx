import React from 'react';
import { Player } from '../types/player';

interface PlayerAreaProps {
  player: Player;
  children: React.ReactNode;
}

 const PlayerArea: React.FC<PlayerAreaProps> = ({ player, children }) => {
  return (
    <></>
  );
}; 

export default PlayerArea;