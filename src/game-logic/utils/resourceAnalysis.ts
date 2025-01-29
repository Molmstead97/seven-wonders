import { Wonder } from '../../data/types/wonder';
import { Resource, ResourceType } from '../../data/types/resource';
import { Player } from '../../data/types/player';

export interface ResourceNeeds {
  [resource: string]: {
    total: number;
    priority: number;
    available: number;
  };
}

export function analyzeResourceNeeds(player: Player, wonder: Wonder): ResourceNeeds {
  const needs: ResourceNeeds = {};

  // Initialize needs with current resources
  Object.keys(player.resources).forEach((resource) => {
    needs[resource] = {
      total: 0,
      priority: 0,
      available: player.resources[resource as keyof Resource] || 0
    };
  });

  // Analyze remaining wonder stages
  wonder.wonderStages
    .filter((stage) => !stage.isBuilt)
    .forEach((stage, index) => {
      Object.entries(stage.cost || {}).forEach(([resource, amount]) => {
        if (!needs[resource]) {
          needs[resource] = { total: 0, priority: 0, available: 0 };
        }
        needs[resource].total += amount;
        needs[resource].priority += 10 - index; // Higher priority for earlier stages
      });
    });

  return needs;
}

export function calculateResourceDeficit(needs: ResourceNeeds): ResourceType[] {
  return Object.entries(needs)
    .filter(([_, data]) => data.total > data.available)
    .map(([resource]) => resource as ResourceType)
    .sort((a, b) => needs[b].priority - needs[a].priority);
} 