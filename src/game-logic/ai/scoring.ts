import { Card } from "../../data/types/card";
import { GameState } from "../gameState";
import { Player } from "../../data/types/player";
import { AIPersonality } from "../../data/types/aiPlayer";
import { checkResources } from "../utils/resourceCheck";
import { Wonder, WonderStage } from "../../data/types/wonder";
import { Resource, ResourceType } from "../../data/types/resource";

interface ActionScore {
  action: "play" | "wonder" | "discard";
  score: number;
  card: Card;
}

export function scoreActions(
  player: Player,
  card: Card,
  gameState: GameState
): ActionScore[] {
  const scores: ActionScore[] = [];
  const personality = player.aiPersonality!;

  // Score playing the card
  if (checkResources(player, card, null)) {
    scores.push({
      action: "play",
      score: calculatePlayScore(card, player, gameState, personality),
      card,
    });
  }

  // Score building wonder
  const nextWonderStage = player.wonder.wonderStages.find(
    (stage) => !stage.isBuilt
  );
  if (nextWonderStage && checkResources(player, null, nextWonderStage)) {
    scores.push({
      action: "wonder",
      score: calculateWonderScore(
        nextWonderStage,
        player,
        gameState,
        personality
      ),
      card,
    });
  }

  // Score discarding (always possible)
  scores.push({
    action: "discard",
    score: calculateDiscardScore(card, player, gameState, personality),
    card,
  });

  return scores;
}

function calculatePlayScore(
  card: Card,
  player: Player,
  gameState: GameState,
  personality: AIPersonality
): number {
  let score = 0;

  // Base score for being able to play a card
  score += 15;

  // Military scoring
  if (card.shields) {
    score += calculateMilitaryScore(card, player, gameState, personality);
  }

  // Resource production scoring (enhanced with trading analysis)
  if (card.production) {
    const ageMultiplier = Math.max(1, 4 - gameState.age); // More valuable in early ages
    const baseResourceScore = 10 * ageMultiplier;

    // Analyze current wonder needs
    const wonderNeeds = analyzeWonderNeeds(player.wonder);

    // Analyze trading options
    const tradingOptions = analyzeTradingOptions(player, gameState);

    if ("choice" in card.production) {
      // For choice production cards, score based on what resources we need
      score +=
        baseResourceScore +
        scoreChoiceProduction(
          card.production.choice,
          wonderNeeds,
          tradingOptions,
          personality
        );
    } else {
      // For fixed production cards, score based on how much they help with wonder building
      Object.entries(card.production).forEach(([resource, amount]) => {
        const need = wonderNeeds[resource];
        if (need) {
          score += (amount as number) * need.priority;
        }

        // Extra value if this resource is expensive/difficult to trade for
        const tradingOption = tradingOptions.get(resource);
        if (tradingOption) {
          const tradingScore = scoreTradingOption(resource, tradingOptions);
          score += tradingScore * (1 - personality.tradingPreference);
        }
      });
    }
  }

  // Victory Points from blue cards
  if (card.victoryPoints) {
    score += card.victoryPoints * 3;
  }

  // Science scoring
  if (card.science) {
    const existingScienceTypes = Object.values(player.science).filter(
      (v) => v > 0
    ).length;
    const competingScience = analyzeCompetingScience(player, gameState);

    if (personality.scienceFocus > 0.6) {
      // Only heavily invest if science-focused
      if (competingScience < 2) {
        // Low competition
        score += (15 + existingScienceTypes * 8) * personality.scienceFocus;
      } else {
        // High competition
        score += 5; // Minimal score, better to focus elsewhere
      }
    } else {
      // For non-science focused AI
      if (existingScienceTypes > 0) {
        // Already have some science
        score += 10 + existingScienceTypes * 5; // Moderate value for completing sets
      } else {
        score += 5; // Low value for starting science late
      }
    }
  }

  // Gold generation
  if (card.gold) {
    score += card.gold * 2;
  }

  // Card color strategies
  switch (card.cardColor) {
    case "Brown":
    case "Grey":
      score += 5 * (4 - gameState.age); // More valuable in early ages
      break;
    case "Red":
      score += 5 * personality.militaryAggression;
      break;
    case "Green":
      score += 5 * personality.scienceFocus;
      break;
    case "Yellow":
      score += 5 * personality.tradingPreference;
      break;
  }

  return score;
}

function calculateWonderScore(
  wonderStage: WonderStage,
  player: Player,
  gameState: GameState,
  personality: AIPersonality
): number {
  // Remove wonderFocus dependency, increase base score
  let score = 25; // Higher base score because Wonders are generally good

  // Value special effects even higher
  if (wonderStage.specialEffect) {
    score += 30; // Increased from 20

    switch (wonderStage.specialEffect.type) {
      case "cardFromDiscard":
        score += 20 + gameState.discardPile.length * 2;
        break;
      case "playSeventhCard":
        score += 20;
        break;
      case "copyGuild":
        score += gameState.age === 3 ? 30 : 15;
        break;
    }
  }

  // Increase value of all Wonder rewards
  if (wonderStage.victoryPoints) {
    score += wonderStage.victoryPoints * 4; // Increased multiplier
  }
  if (wonderStage.shields) {
    score += wonderStage.shields * 6 * personality.militaryAggression;
  }
  if (wonderStage.science) {
    score += 20 * personality.scienceFocus;
  }
  if (wonderStage.gold) {
    score += wonderStage.gold * 3;
  }

  // Add extra incentive for completing Wonder stages in order
  const builtStages = player.wonder.wonderStages.filter(
    (s) => s.isBuilt
  ).length;
  score += (3 - builtStages) * 10; // Earlier stages worth more

  return score;
}

function calculateDiscardScore(
  card: Card,
  player: Player,
  gameState: GameState,
  personality: AIPersonality
): number {
  let score = 0;

  // Analyze resource needs and trading options
  const wonderNeeds = analyzeWonderNeeds(player.wonder);
  const tradingOptions = analyzeTradingOptions(player, gameState);

  // Calculate how valuable the card's resources would be
  if (card.production) {
    let resourceValue = 0;

    if ("choice" in card.production) {
      resourceValue = scoreChoiceProduction(
        card.production.choice,
        wonderNeeds,
        tradingOptions,
        personality
      );
    } else {
      Object.entries(card.production).forEach(([resource, amount]) => {
        const need = wonderNeeds[resource];
        if (need) {
          resourceValue += (amount as number) * need.priority;
        }
        const tradingOption = tradingOptions.get(resource);
        if (tradingOption) {
          resourceValue += scoreTradingOption(resource, tradingOptions);
        }
      });
    }

    // Penalize discarding valuable resource production
    score -= resourceValue;
  }

  // Only encourage discarding if really needed
  if (player.gold < 3) {
    score += 15; // Emergency gold needed
  } else {
    // Reduce base gold value if we already have enough
    score += Math.max(0, 3 - Math.floor(player.gold / 5));
  }

  // Discourage discarding playable cards
  if (checkResources(player, card, null)) {
    score -= 10;
  }

  // Discourage discarding cards that align with personality
  if (card.shields) {
    score -= 5 * personality.militaryAggression;
  }
  if (card.science) {
    score -= 5 * personality.scienceFocus;
  }

  // Extra penalty for discarding cards that produce resources we need
  Object.entries(wonderNeeds).forEach(([resource, need]) => {
    if (need.priority > 5) {
      // High priority needs
      score -= need.priority;
    }
  });

  return score;
}

function calculateMilitaryScore(
  card: Card,
  player: Player,
  gameState: GameState,
  personality: AIPersonality
): number {
  let score = 0;
  const leftNeighbor = player.leftPlayer!;
  const rightNeighbor = player.rightPlayer!;

  // Calculate potential shields after playing this card
  const potentialShields = player.shields + (card.shields || 0);

  // Calculate minimum shields needed for victory against each neighbor
  const shieldsNeededLeft = leftNeighbor.shields + 1;
  const shieldsNeededRight = rightNeighbor.shields + 1;

  // Check if this card would help secure a victory
  if (potentialShields <= Math.max(shieldsNeededLeft, shieldsNeededRight)) {
    // Card helps achieve military victory without overshooting
    score += 15 * personality.militaryAggression;

    // Extra points if it secures victory against both neighbors
    if (
      potentialShields > shieldsNeededLeft &&
      potentialShields > shieldsNeededRight
    ) {
      score += 5 * personality.militaryAggression;
    }
  } else {
    // Penalize overshooting on military
    score -= 5 * personality.militaryAggression;
  }

  // Consider age-specific military strategy
  if (gameState.age === 1) {
    // In Age 1, getting 1-2 shields is usually good
    if (potentialShields <= 2) score += 5 * personality.militaryAggression;
  } else if (gameState.age === 2) {
    // In Age 2, staying competitive but not overcommitting
    if (potentialShields <= 4) score += 5 * personality.militaryAggression;
  }

  return score;
}

interface ResourceNeeds {
  [resource: string]: {
    total: number; // Total amount needed
    priority: number; // How urgently it's needed (1-10)
    available: number; // Currently available through production/trading
  };
}

function analyzeWonderNeeds(wonder: Wonder): ResourceNeeds {
  const needs: ResourceNeeds = {};

  // Analyze remaining wonder stages
  wonder.wonderStages
    .filter((stage) => !stage.isBuilt)
    .forEach((stage) => {
      Object.entries(stage.cost || {}).forEach(([resource, amount]) => {
        if (!needs[resource]) {
          needs[resource] = { total: 0, priority: 0, available: 0 };
        }
        needs[resource].total += amount;
        // Higher priority for resources needed sooner
        needs[resource].priority += 10 - wonder.wonderStages.indexOf(stage);
      });
    });

  return needs;
}

export function analyzeTradingOptions(player: Player, gameState: GameState) {
  const tradingOptions = new Map<
    string,
    {
      leftCost: number;
      rightCost: number;
      availability: "high" | "medium" | "low";
    }
  >();

  // Check each neighbor's production capabilities
  ["Wood", "Stone", "Clay", "Ore", "Glass", "Papyrus", "Textile"].forEach(
    (resource) => {
      const leftProduction = calculateNeighborProduction(
        player.leftPlayer!,
        resource as keyof Resource
      );
      const rightProduction = calculateNeighborProduction(
        player.rightPlayer!,
        resource as keyof Resource
      );

      tradingOptions.set(resource, {
        leftCost: calculateTradeCost(
          player,
          player.leftPlayer!,
          resource as keyof Resource
        ),
        rightCost: calculateTradeCost(
          player,
          player.rightPlayer!,
          resource as keyof Resource
        ),
        availability: determineAvailability(leftProduction, rightProduction),
      });
    }
  );

  return tradingOptions;
}

function calculateNeighborProduction(
  player: Player,
  resource: keyof Resource
): number {
  let production = 0;

  // Only count fixed production from cards (not wonder stages or choice production)
  player.playerBoard.forEach((card) => {
    if (card.production && !("choice" in card.production)) {
      const resourceAmount = card.production[resource];
      if (resourceAmount) {
        production += resourceAmount;
      }
    }
  });

  return production;
}

function calculateTradeCost(
  player: Player,
  neighbor: Player,
  resource: keyof Resource
): number {
  // Base trading cost is 2
  let cost = 2;

  // Check for trading post effects (yellow cards that reduce trading costs)
  player.playerBoard.forEach((card) => {
    if (
      card.specialEffect?.type === "tradeDiscount" &&
      card.specialEffect.neighbor ===
        (neighbor === player.leftPlayer ? "left" : "right")
    ) {
      cost = 1;
    }
  });

  return cost;
}

function determineAvailability(
  leftProduction: number,
  rightProduction: number
): "high" | "medium" | "low" {
  const totalProduction = leftProduction + rightProduction;
  if (totalProduction >= 3) return "high";
  if (totalProduction >= 1) return "medium";
  return "low";
}

function scoreChoiceProduction(
  choices: any,
  needs: ResourceNeeds,
  tradingOptions: Map<string, any>,
  personality: AIPersonality
): number {
  let score = 0;

  choices.forEach((choice: any) => {
    const bestOption = choice.options.reduce(
      (best: any, resource: string) => {
        const needScore = needs[resource]?.priority || 0;
        const tradingScore = scoreTradingOption(resource, tradingOptions);
        return needScore + tradingScore > best.score
          ? { resource, score: needScore + tradingScore }
          : best;
      },
      { resource: null, score: 0 }
    );

    score += bestOption.score * (1 - personality.tradingPreference);
  });

  return score;
}

function scoreTradingOption(
  resource: string,
  tradingOptions: Map<string, any>
): number {
  const option = tradingOptions.get(resource);
  if (!option) return 0;

  // Higher score for cheaper trading costs and better availability
  const costScore = Math.max(
    0,
    5 - Math.min(option.leftCost, option.rightCost)
  );
  const availabilityScore: Record<"high" | "medium" | "low", number> = {
    high: 5,
    medium: 3,
    low: 1,
  };

  return (
    costScore +
    availabilityScore[option.availability as keyof typeof availabilityScore]
  );
}

function analyzeCompetingScience(player: Player, gameState: GameState): number {
  let competingPlayers = 0;

  gameState.players.forEach((otherPlayer) => {
    if (otherPlayer !== player) {
      const scienceCount = Object.values(otherPlayer.science).reduce(
        (sum, count) => sum + count,
        0
      );
      if (scienceCount > 1) {
        // Consider players with 2+ science symbols as competition
        competingPlayers++;
      }
    }
  });

  return competingPlayers;
}

function chooseOptimalResource(
  player: Player,
  gameState: GameState,
  options: ResourceType[]
): ResourceType {
  // Create a scoring system for each resource option
  const resourceScores = options.map((resource) => {
    let score = 0;

    // 1. Check current resource availability
    const currentAmount =
      (player.resources[resource] || 0) + (player.tempResources[resource] || 0);
    if (currentAmount === 0) {
      score += 5; // Prioritize resources we don't have
    }

    // 2. Check Wonder stage needs
    const wonderNeeds = analyzeWonderNeeds(player.wonder);
    if (wonderNeeds[resource]) {
      score += wonderNeeds[resource].priority;
    }

    // 3. Check trading availability from neighbors
    const tradingOptions = analyzeTradingOptions(player, gameState);
    const tradingScore = tradingOptions.get(resource);
    if (tradingScore) {
      // If resource is easily available through trade, lower its priority
      score -=
        tradingScore.availability === "high"
          ? 3
          : tradingScore.availability === "medium"
          ? 1
          : 0;
    }

    return { resource, score };
  });

  // Sort by score and return the highest scoring resource
  resourceScores.sort((a, b) => b.score - a.score);
  return resourceScores[0].resource;
}

export function applyProductionChoices(
  player: Player,
  gameState: GameState
): Player {
  const updatedPlayer = { ...player };

  // Look through all cards with choice production
  Array.from(player.playerBoard).forEach((card) => {
    if (card.production && "choice" in card.production) {
      card.production.choice.forEach((choice) => {
        const optimalResource = chooseOptimalResource(
          player,
          gameState,
          choice.options as ResourceType[]
        );

        // Add the chosen resource to tempResources
        updatedPlayer.tempResources[optimalResource] =
          (updatedPlayer.tempResources[optimalResource] || 0) + choice.amount;
      });
    }
  });

  return updatedPlayer;
}
