export interface PlayerCountThreshold {
    minPlayers: number;
    maxPlayers: number | null;  // null means no upper limit
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
    resources: Resource;
    playerCount: PlayerCountThreshold[];
    upgradeCard: boolean;
    cost: Resource | null;
    age: 1 | 2 | 3;
    color: 'Brown' | 'Grey' | 'Blue' | 'Yellow' | 'Red' | 'Green' | 'Purple';
    ageVariant?: AgeVariant;  // Optional, only for cards that change based on age
  }

  