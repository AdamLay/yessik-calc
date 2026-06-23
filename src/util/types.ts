export type Unit = {
  skill: number;
  ward: number;
  wounds: number;
  armourTier: number;
  save: number;
  move: number;
  advance: number;
  command: number;
  commandStatus: boolean;
  weapons: Weapon[];
  models: number;
};

export type Weapon = {
  tier: number;
  attacks: number;
  range: number;
  deadly: number;
  ap: number;
  shred: boolean;
  piercing: boolean;
  specialMultiplier?: number;
};
