import { Player } from "../types/player";
import { Wonder } from "../types/wonder";

export function gameEnd(players: Player[]): Player[] {
  // Logic for handling the end of the game. Most victory points should be calculated already, since they are being applied to the player immediately, excluding science points. 
  // I think 'CopyGuildEffect' will be applied here, as well as 'ScienceChoiceEffect'
  return players;
}