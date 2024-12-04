export interface ProductionChoice {
    cardName: string;
    cardImage: string;
    options: string[];
    amount: number;
  }
  
  export interface ProductionChoiceState {
    choices: ProductionChoice[];
    currentChoiceIndex: number;
  }