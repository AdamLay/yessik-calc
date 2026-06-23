import type { Unit, Weapon } from "./types";

export const getUnitCost = (unit: Unit) => {
  const { skill, ward, wounds, armourTier, save, move, advance, weapons, models } = unit;
  const hasWard = ward > 0;
  const defensePointsBase = wounds * Math.pow(3, armourTier) * (2 * ((6 - (save - 1)) / 6));
  const defensePoints = !hasWard ? defensePointsBase : (1 + 0.1 * (6 - ward)) * defensePointsBase;

  const avgSpeed = move + advance + 3.5;

  const threat = avgSpeed + Math.max(...weapons.map((w) => w.range));
  const threatValues = [
    { threat: 8.5, value: 0.5 },
    { threat: 12, value: 0.75 },
    { threat: 18, value: 1 },
    { threat: 24, value: 1.25 },
    { threat: 36, value: 1.5 },
    { threat: 48, value: 1.75 },
    //{ threat: 62, value: 2 } // Not necessary if default is 2
  ];
  const combatReadiness = (() => {
    for (const { threat: t, value } of threatValues) {
      if (threat <= t) return value;
    }
    return 2;
  })();
  const combatReadinessSpecial = 1;
  const combatReadinessTotal = combatReadiness * combatReadinessSpecial;

  const modelPoints =
    combatReadinessTotal * defensePoints +
    weapons.reduce((acc, w) => acc + getWeaponCost(w, skill), 0);
  const modelPointsSpecial = 1;
  const modelPointsTotal = modelPoints * modelPointsSpecial;

  const unitPoints = modelPointsTotal * models;
  const unitPointsSpecial = 1;
  const unitPointsTotal = unitPoints * unitPointsSpecial;

  console.log({
    defensePoints,
    avgSpeed,
    threat,
    combatReadiness,
    combatReadinessTotal,
    modelPointsTotal,
    unitPointsTotal,
  });

  return unitPointsTotal;
};

export const getWeaponCost = (weapon: Weapon, skill: number) => {
  const shredValue = weapon.shred ? 2 : 0;
  const pierceValue = weapon.piercing ? 1 : 0;

  const avgHits = ((7 - skill) / 6) * weapon.attacks;
  const avgNonCritHits = ((6 - pierceValue - skill) / 6) * weapon.attacks; // Should be (7 - p - skill) ?
  const avgCritHits = ((1 + pierceValue) / 6) * weapon.attacks;

  console.log({ avgHits, avgNonCritHits, avgCritHits });

  const dmgPointsMultipliers: { [key: number]: number } = {
    0: 1,
    1: 2,
    2: 5,
    3: 10,
  };

  let tierCosts = 0;
  for (let tier = 0; tier <= 3; tier++) {
    const tierAp = weapon.tier > tier ? -1 * (tier - weapon.tier) * 2 : 0;
    const totalAp = weapon.ap + tierAp;
    const requiredCritRolls = weapon.tier < tier ? tier - weapon.tier : 0;

    const critModifier = Math.pow((1 + pierceValue) / 6, requiredCritRolls); // Name for this? purpose?

    const avgNonCritDmgBase =
      (avgNonCritHits + avgCritHits * shredValue) * (1 / 2 + (1 / 6) * totalAp) * weapon.deadly;
    const avgNonCritDmg =
      requiredCritRolls === 0 ? avgNonCritDmgBase : avgNonCritDmgBase * critModifier;

    const avgCritDmgBase = avgCritHits * (1 / 2 + (1 / 6) * (totalAp + 2)) * weapon.deadly;
    const avgCritDmg = weapon.shred
      ? 0
      : requiredCritRolls === 0
        ? avgCritDmgBase
        : avgCritDmgBase * critModifier;

    const avgTotalDmg = avgNonCritDmg + avgCritDmg;
    const dmgPoints = dmgPointsMultipliers[tier] * avgTotalDmg;
    tierCosts += dmgPoints;
    console.log({
      tier,
      totalAp,
      requiredCritRolls,
      avgNonCritDmg,
      avgCritDmg,
      avgTotalDmg,
      dmgPoints,
    });
  }

  const result = tierCosts * (weapon.specialMultiplier ?? 1);

  console.log("Points:", result);
  return result;
};
