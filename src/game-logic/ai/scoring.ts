import { Card } from "../types/card";
import { GameState } from "../gameState";
import { Player } from "../types/player";
import { AIPersonality } from "../types/aiPlayer";
import { checkResources } from "../utils/resourceCheck";
import { Wonder, WonderStage } from "../types/wonder";

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

  // Military scoring (replace the simple military scoring with the detailed one)
  if (card.shields) {
    score += calculateMilitaryScore(card, player, gameState, personality);
  }

  // Victory Points from blue cards (reduce direct VP weight)
  if (card.victoryPoints) {
    score += card.victoryPoints * 3; // Reduced from whatever it was before
  }

  // Resources (increase weight for early game)
  if (card.production) {
    const ageMultiplier = Math.max(1, 4 - gameState.age); // More valuable in early ages
    score += 10 * ageMultiplier;
  }

  // Science (increase base value and scale with existing cards)
  if (card.science) {
    const existingScienceTypes = Object.values(player.science).filter(v => v > 0).length;
    score += (10 + existingScienceTypes * 5) * personality.scienceFocus;
  }

  // Gold generation (reduce direct gold value)
  if (card.gold) {
    score += card.gold * 2; // Reduced from whatever it was before
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
  let score = 10 * personality.wonderFocus; // Base score for wonder building

  // Increase value of early wonder stages
  const stagesBuilt = player.wonder.wonderStages.filter(s => s.isBuilt).length;
  score += (3 - stagesBuilt) * 5; // Earlier stages worth more

  if (wonderStage.victoryPoints) {
    score += wonderStage.victoryPoints * 3;
  }
  if (wonderStage.shields) {
    score += wonderStage.shields * 5 * personality.militaryAggression;
  }
  if (wonderStage.science) {
    score += 15 * personality.scienceFocus;
  }
  if (wonderStage.gold) {
    score += wonderStage.gold * 2;
  }

  return score;
}

function calculateDiscardScore(
  card: Card,
  player: Player,
  gameState: GameState,
  personality: AIPersonality
): number {
  // Significantly reduce base score for discarding
  let score = 0;

  // Only encourage discarding if really needed
  if (player.gold < 3) {
    score += 15; // Emergency gold needed
  } else {
    score += 3; // Base value for gaining gold
  }

  // Discourage discarding valuable cards
  if (checkResources(player, card, null)) {
    score -= 10; // Bigger penalty for discarding playable cards
  }

  // Discourage discarding cards that align with personality
  if (card.shields) {
    score -= 5 * personality.militaryAggression;
  }
  if (card.science) {
    score -= 5 * personality.scienceFocus;
  }

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

// TODO: Implement this
/*function calculateResourceScore(
  card: Card,
  player: Player,
  gameState: GameState,
  personality: AIPersonality
): number {
  let score = 0;

  // Analyze wonder requirements
  const wonderNeeds = analyzeWonderNeeds(player.wonder);

  // Analyze available trading options
  const tradingOptions = analyzeTradingOptions(player, gameState);

  // Score the card based on how well it addresses resource needs
  if (card.production) {
    if (card.production.choice) {
      // Handle choice production cards
      score += scoreChoiceProduction(
        card.production.choice,
        wonderNeeds,
        tradingOptions,
        personality
      );
    } else {
      // Handle fixed production cards
      score += scoreFixedProduction(
        card.production,
        wonderNeeds,
        tradingOptions,
        personality
      );
    }
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

function analyzeTradingOptions(player: Player, gameState: GameState) {
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
        resource
      );
      const rightProduction = calculateNeighborProduction(
        player.rightPlayer!,
        resource
      );

      tradingOptions.set(resource, {
        leftCost: calculateTradeCost(player, player.leftPlayer!, resource),
        rightCost: calculateTradeCost(player, player.rightPlayer!, resource),
        availability: determineAvailability(leftProduction, rightProduction),
      });
    }
  );

  return tradingOptions;
}

function scoreChoiceProduction(
  choices: any,
  needs: ResourceNeeds,
  tradingOptions: Map<string, any>,
  personality: AIPersonality
): number {
  let score = 0;

  choices.forEach((choice) => {
    const bestOption = choice.options.reduce(
      (best, resource) => {
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
}*/
