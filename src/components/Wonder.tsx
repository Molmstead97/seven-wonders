import React, { useState } from "react";
import { Resource, Production } from "../game-logic/types/resource";
import { Wonder as WonderType } from "../game-logic/types/wonder";


interface WonderProps {
  wonder: WonderType;
}

const Wonder: React.FC<WonderProps> = ({ wonder }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const renderProduction = (production: Production): string => {
    
    return Object.entries(production)
      .map(([resource, amount]) => `${amount} ${resource}`)
      .join(", ");
  };

  const renderStageRequirements = (cost: Resource | number | null): string => {
    if (cost === null) return "Free";
    
    return Object.entries(cost)
      .map(([resource, amount]) => `${amount} ${resource}`)
      .join(", ");
  };

  const renderStageRewards = (stage: any): string[] => {
    const rewards: string[] = [];
    
    if (stage.victoryPoints) rewards.push(`${stage.victoryPoints} Victory Points`);
    if (stage.gold) rewards.push(`${stage.gold} Gold`);
    if (stage.shields) rewards.push(`${stage.shields} Shields`);
    if (stage.production) rewards.push(`Produces: ${renderProduction(stage.production)}`);
    if (stage.specialEffect) rewards.push(`Special Effect: ${stage.specialEffect.type}`);
    
    return rewards;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative w-full">
        <img 
          src={wonder.imagePath} 
          alt={wonder.name} 
          className="w-full h-auto"
        />
        
        {/* Resource Production Area */}
        <div 
          className="absolute top-[10%] left-[10%] w-[15%] h-[15%] cursor-pointer"
          onMouseEnter={() => setHoveredSection("production")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          {hoveredSection === "production" && (
            <div className="absolute z-10 p-2 text-sm text-white bg-black/80 rounded whitespace-nowrap pointer-events-none">
              Produces: {renderProduction(wonder.production)}
            </div>
          )}
        </div>

        {/* Wonder Stages */}
        {wonder.wonderStages.map((stage, index) => (
          <div
            key={index}
            className={`absolute bottom-[20%] w-[20%] h-[30%] cursor-pointer
              ${index === 0 ? 'left-[20%]' : index === 1 ? 'left-[40%]' : 'left-[60%]'}
              ${stage.isBuilt ? 'opacity-70' : ''}`}
            onMouseEnter={() => setHoveredSection(`stage-${index + 1}`)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {hoveredSection === `stage-${index + 1}` && (
              <div className="absolute z-10 p-2 text-sm text-white bg-black/80 rounded whitespace-nowrap pointer-events-none">
                <div>Cost: {renderStageRequirements(stage.cost)}</div>
                {renderStageRewards(stage).map((reward, i) => (
                  <div key={i}>{reward}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <h2 className="mt-4 text-xl font-bold text-center">{wonder.name}</h2>
    </div>
  );
};

export default Wonder;
