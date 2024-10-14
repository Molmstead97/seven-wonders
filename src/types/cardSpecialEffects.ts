import { Gold, ResourceType, ScienceType, VictoryPoints } from "./resource";
import { CardColor } from "./card";

interface TradingDiscount {
    type: 'trade',
    neighbor: 'left' | 'right' | 'both',
    resource: ResourceType[];
}

interface ScienceBonus {
    type: 'science',
    symbol: ScienceType | ScienceType[],
} 

interface GoldVictoryBonus {
    type: 'goldVictoryBonus',
    cardColor: CardColor | CardColor[],
    gold?: Gold,
    victoryPoints?: VictoryPoints,
    scope: 'self' | 'neighbors' | 'all',
}

// TODO: Add effects for certain guilds that don't fit into the other categories (Builders Guild and Strategists Guild)

export type SpecialEffect = TradingDiscount | ScienceBonus | GoldVictoryBonus;   