import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getUnitCost, getWeaponCost } from "../util/calculator";
import type { Unit, Weapon } from "../util/types";

export const Route = createFileRoute("/")({ component: Home });

const defaultWeapon = (): Weapon => ({
  tier: 1,
  attacks: 1,
  range: 0,
  deadly: 1,
  ap: 0,
  shred: false,
  piercing: false,
  specialMultiplier: 1,
});

const defaultUnit = (): Unit => ({
  skill: 4,
  ward: 0,
  wounds: 1,
  armourTier: 0,
  save: 5,
  move: 5,
  advance: 5,
  command: 6,
  commandStatus: false,
  models: 10,
  weapons: [defaultWeapon()],
});

function Home() {
  const [unit, setUnit] = useState<Unit>(defaultUnit());

  const updateUnit = <K extends keyof Omit<Unit, "weapons">>(key: K, value: Unit[K]) => {
    setUnit((prev) => ({ ...prev, [key]: value }));
  };

  const updateWeapon = (index: number, updates: Partial<Weapon>) => {
    setUnit((prev) => {
      const weapons = prev.weapons.map((w, i) => (i === index ? { ...w, ...updates } : w));
      return { ...prev, weapons };
    });
  };

  const addWeapon = () => {
    setUnit((prev) => ({ ...prev, weapons: [...prev.weapons, defaultWeapon()] }));
  };

  const removeWeapon = (index: number) => {
    setUnit((prev) => ({ ...prev, weapons: prev.weapons.filter((_, i) => i !== index) }));
  };

  const unitCost = getUnitCost(unit);
  const costPerModel = unit.models > 0 ? unitCost / unit.models : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* <h1 className="text-3xl font-bold">Unit &amp; Weapon Editor</h1> */}

      {/* Unit Stats */}
      <div className="card card-border bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Unit Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Models</legend>
              <input
                type="number"
                className="input w-full"
                min={1}
                value={unit.models}
                onChange={(e) => updateUnit("models", Number(e.target.value))}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Skill</legend>
              <select
                className="select w-full"
                value={unit.skill}
                onChange={(e) => updateUnit("skill", Number(e.target.value))}
              >
                {[2, 3, 4, 5, 6].map((v) => (
                  <option key={v} value={v}>
                    {v}+
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Command Status</legend>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={unit.commandStatus}
                onChange={(e) => updateUnit("commandStatus", e.target.checked)}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Command Value</legend>
              <select
                className="select w-full"
                value={unit.command}
                onChange={(e) => updateUnit("command", Number(e.target.value))}
              >
                {Array.from({ length: 11 }, (_, k) => k + 2).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Armour Tier</legend>
              <select
                className="select w-full"
                value={unit.armourTier}
                onChange={(e) => updateUnit("armourTier", Number(e.target.value))}
              >
                {[0, 1, 2, 3].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Wounds</legend>
              <input
                type="number"
                className="input w-full"
                min={1}
                value={unit.wounds}
                onChange={(e) => updateUnit("wounds", Number(e.target.value))}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Save</legend>
              <select
                className="select w-full"
                value={unit.save}
                onChange={(e) => updateUnit("save", Number(e.target.value))}
              >
                {[2, 3, 4, 5, 6].map((v) => (
                  <option key={v} value={v}>
                    {v}+
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Ward</legend>
              <select
                className="select w-full"
                value={unit.ward}
                onChange={(e) => updateUnit("ward", Number(e.target.value))}
              >
                <option value={0}>No ward</option>
                {[2, 3, 4, 5, 6].map((v) => (
                  <option key={v} value={v}>
                    {v}+
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Move</legend>
              <input
                type="number"
                className="input w-full"
                min={0}
                value={unit.move}
                onChange={(e) => updateUnit("move", Number(e.target.value))}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Advance</legend>
              <input
                type="number"
                className="input w-full"
                min={0}
                value={unit.advance}
                onChange={(e) => updateUnit("advance", Number(e.target.value))}
              />
            </fieldset>
          </div>
        </div>
      </div>

      {/* Weapons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Weapons</h2>
          <button className="btn btn-primary btn-sm" onClick={addWeapon}>
            + Add Weapon
          </button>
        </div>

        {unit.weapons.map((weapon, i) => (
          <div key={i} className="card card-border bg-base-200">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h3 className="card-title text-base">Weapon {i + 1}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-base-content/60">Cost:</span>
                  <span className="badge badge-neutral font-mono">
                    {getWeaponCost(weapon, unit.skill).toFixed(2)} pts
                  </span>
                  <button
                    className="btn btn-error btn-xs btn-outline"
                    onClick={() => removeWeapon(i)}
                    disabled={unit.weapons.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Tier</legend>
                  <select
                    className="select w-full"
                    value={weapon.tier}
                    onChange={(e) => updateWeapon(i, { tier: Number(e.target.value) })}
                  >
                    {[0, 1, 2, 3].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Attacks</legend>
                  <input
                    type="number"
                    className="input w-full"
                    min={1}
                    value={weapon.attacks}
                    onChange={(e) => updateWeapon(i, { attacks: Number(e.target.value) })}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Range</legend>
                  <input
                    type="number"
                    className="input w-full"
                    min={0}
                    value={weapon.range}
                    onChange={(e) => updateWeapon(i, { range: Number(e.target.value) })}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Deadly</legend>
                  <input
                    type="number"
                    className="input w-full"
                    min={1}
                    value={weapon.deadly}
                    onChange={(e) => updateWeapon(i, { deadly: Number(e.target.value) })}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">AP</legend>
                  <input
                    type="number"
                    className="input w-full"
                    min={0}
                    max={3}
                    value={weapon.ap}
                    onChange={(e) => updateWeapon(i, { ap: Number(e.target.value) })}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Special ×</legend>
                  <input
                    type="number"
                    className="input w-full"
                    min={0.1}
                    step={0.1}
                    value={weapon.specialMultiplier ?? 1}
                    onChange={(e) => updateWeapon(i, { specialMultiplier: Number(e.target.value) })}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Shred</legend>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={weapon.shred}
                    onChange={(e) => updateWeapon(i, { shred: e.target.checked })}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Piercing</legend>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={weapon.piercing}
                    onChange={(e) => updateWeapon(i, { piercing: e.target.checked })}
                  />
                </fieldset>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Point Cost Summary */}
      <div className="stats stats-horizontal shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Unit Cost</div>
          <div className="stat-value">{unitCost.toFixed(1)}</div>
          <div className="stat-desc">
            {unit.models} models × {costPerModel.toFixed(2)} pts each
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Weapons</div>
          <div className="stat-value">{unit.weapons.length}</div>
          <div className="stat-desc">
            {unit.weapons
              .map((w, i) => `W${i + 1}: ${getWeaponCost(w, unit.skill).toFixed(2)}`)
              .join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}
