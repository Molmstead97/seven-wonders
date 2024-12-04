import React from 'react';
import { Wonder, WonderStage } from '../../game-logic/types/wonder';
import { GenericWonder } from './GenericWonder';
import { wonders } from '../../data/wonders';

interface EphesosProps {
  side: 'A' | 'B';
}

// Get base wonder data and extend it with positions
const getEphesosData = (side: 'A' | 'B'): WonderStage[] => {
  const wonderData = wonders.find(w => w.name === `Éphesos ${side}`)?.wonderStages || [];
  return wonderData;
};

const Ephesos: React.FC<EphesosProps> = ({ side }) => {
  const stageData = getEphesosData(side);
  const wonderName = `Éphesos ${side}`;

  return (
    <GenericWonder
      name={wonderName}
      side={side}
      baseProduction="Papyrus"
      stages={stageData}
      // Add an image url when we have one
    />
  );
};

export default Ephesos;