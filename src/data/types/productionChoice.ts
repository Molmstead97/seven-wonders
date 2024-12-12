import { ResourceType, ScienceType } from './resource';

export interface ProductionChoice {
  sourceName: string;
  sourceImage: string;
  options: ResourceType[] | ScienceType[];
  amount: number;
  sourceType: 'card' | 'wonder' | 'science';
}

export interface ProductionChoiceState {
  choices: ProductionChoice[];
  currentChoiceIndex: number;
}