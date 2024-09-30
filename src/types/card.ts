export interface PlayerCountThreshold {
    minPlayers: number;
    copies: number;
  }
  
  export interface AgeVariant {
    age: 2 | 3;  // Age variants only apply to Ages 2 or 3
    maxPlayers: number;
  }
  
  export interface Resource {
    [key: string]: number;
  }
  
  export interface Card {
    name: string;
    description: string;
    production: Resource | null
    playerCount: PlayerCountThreshold[] | null;
    upgradeCard: boolean;
    cost: Resource | null;
    age: 1 | 2 | 3;
    color: 'Brown' | 'Grey' | 'Blue' | 'Yellow' | 'Red' | 'Green' | 'Purple';
    ageVariant?: AgeVariant;  // Optional, only for cards that change based on age
  } 