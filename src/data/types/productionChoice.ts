export interface ProductionChoice {
    sourceName: string;
    sourceImage: string;
    options: string[];
    amount: number;
  }
  
  export interface ProductionChoiceState {
    choices: ProductionChoice[];
    currentChoiceIndex: number;
  }