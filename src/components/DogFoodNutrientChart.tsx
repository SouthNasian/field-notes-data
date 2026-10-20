"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import EChartsChart from "./EChartsChart";
import { dogFoods } from "../data/dogFoodNutrition";
import {
  aafcoAdultMaintenance,
  type AafcoNutrient,
} from "../data/aafcoAdultMaintenance";

type NutrientKey = "protein" | "fat" | "calcium" | "phosphorus" | "fiber" | "omega3" | "omega6";
type ChartKey = NutrientKey | "price";

const nutrientKeys: NutrientKey[] = [
  "protein",
  "fat",
  "calcium",
  "phosphorus",
  "fiber",
  "omega3",
  "omega6",
];

const additionalLabels: Partial<Record<NutrientKey, string>> = {
  fiber: "Crude fiber",
  omega3: "Omega-3 fatty acids",
  omega6: "Omega-6 fatty acids",
};

// Fiber and total omega-3/omega-6 have no matching concentration thresholds
// in the AAFCO adult-maintenance dataset; do not invent reference lines.
const nutrients: Record<NutrientKey, AafcoNutrient> = Object.fromEntries(
  nutrientKeys.map((key) => {
    const reference = aafcoAdultMaintenance.find((entry) => entry.id === key);
    return [key, reference ?? {
      id: key,
      label: additionalLabels[key] ?? key,
      category: "Vitamins & other" as const,
      unit: "%" as const,
      min: null,
      max: null,
    }];
  })
) as Record<NutrientKey, AafcoNutrient>;

const chewyPrices = [
  { name: "Inukshuk 26/16", bagLb: 33, price: 60.64, url: "https://www.chewy.com/inukshuk-professional-dry-dog-food/dp/149200" },
  { name: "Eukanuba Adult Medium", bagLb: 35, price: 74.99, url: "https://www.chewy.com/eukanuba-adult-medium-breed-dry-dog/dp/4093742" },
  { name: "Purina Pro Plan", bagLb: 35, price: 74.48, url: "https://www.chewy.com/purina-pro-plan-high-protein-shredded/dp/52448" },
];

const foods = dogFoods;

// A maximum moisture guarantee is not a measured moisture value.
// Therefore, published as-fed minimums yield conservative DM lower bounds;
// published as-fed maximums yield conservative DM upper bounds.
// Reported dry-matter values are left unchanged.
function dryMatterComparison(food: (typeof foods)[number], key: NutrientKey) {
  const entry = food.values[key];
  if (!entry) return null;
  if (entry.basis === "Dry matter") {
    return { value: entry.value, qualifier: "Reported DM", explanation: "Manufacturer-reported dry-matter concentration" };
  }
  if (entry.type === "Minimum") {
    return {
      value: entry.value,
      qualifier: "DM lower bound",
      explanation: `At least ${entry.value}% DM (conservative bound from as-fed minimum; moisture ≤${food.moistureMax}%)`,
    };
  }
  return {
    value: entry.value / (1 - food.moistureMax / 100),
    qualifier: "DM upper bound",
    explanation: `At most ${(entry.value / (1 - food.moistureMax / 100)).toFixed(2)}% DM (conservative bound from as-fed maximum; moisture ≤${food.moistureMax}%)`,
  };
}

// Show a nutrient only when at least one food has a documented value.
const availableNutrients = (Object.keys(nutrients) as NutrientKey[]).filter((key) =>
  foods.some((food) => food.values[key] !== undefined)
);

export default function DogFoodNutrientChart() {
  const [selected, setSelected] = useState<ChartKey>("protein");
  const isPrice = selected === "price";
  const nutrient = isPrice ? null : nutrients[selected];

  const option = useMemo<EChartsOption>(() => ({
    backgroundColor: "#FBFAF6",
    textStyle: { color: "#20231F", fontFamily: "DM Sans, Arial, sans-serif" },
    tooltip: {
      trigger: "item",
      backgroundColor: "#FBFAF6",
      borderColor: "#C9CBC3",
      formatter: (params: any) => {
        const food = foods[params.dataIndex];
        if (!food) return "";
        if (selected === "price") {
          const listing = chewyPrices[params.dataIndex];
          return `${food.name}<br/>$${(listing.price / listing.bagLb).toFixed(2)}/lb<br/>$${listing.price.toFixed(2)} for ${listing.bagLb} lb · Chewy`;
        }
        const comparison = dryMatterComparison(food, selected);
        const entry = food.values[selected];
        if (!comparison || !entry) return `${food.name}<br/>${nutrients[selected].label}: Data not available`;
        return `${food.name}<br/>${nutrients[selected].label}: ${comparison.value.toFixed(2)}% DM<br/>${comparison.qualifier}<br/>Original: ${entry.value}% ${entry.type.toLowerCase()} (${entry.basis})<br/>${comparison.explanation}`;
      },
    },
    grid: { left: 175, right: 80, top: 40, bottom: 60 },
    xAxis: {
      type: "value",
      // Keep the AAFCO upper limit visible even when all food bars are shorter.
      max: nutrient?.max == null ? undefined : Math.ceil(nutrient.max * 1.3 * 10) / 10,
      name: isPrice ? "Chewy price per pound (USD)" : "Dry-matter value or conservative bound (%)",
      nameLocation: "middle",
      nameGap: 35,
      axisLabel: { formatter: isPrice ? "${value}" : "{value}%" },
      splitLine: { lineStyle: { color: "#D9D9D0" } },
    },
    yAxis: {
      type: "category",
      inverse: true,
      data: foods.map((food) => food.name),
      axisLabel: { color: "#20231F" },
    },
    series: [
      {
        type: "bar",
        barMaxWidth: 30,
        data: isPrice ? chewyPrices.map((listing) => Number((listing.price / listing.bagLb).toFixed(4))) : foods.map((food) => dryMatterComparison(food, selected as NutrientKey)?.value ?? null),
        itemStyle: { color: "#29483A" },
        label: { show: true, position: "right", formatter: (params: any) => {
          if (isPrice) return `$${Number(params.value).toFixed(2)}`;
          const comparison = dryMatterComparison(foods[params.dataIndex], selected as NutrientKey);
          if (!comparison) return "N/A";
          const symbol = comparison.qualifier === "DM lower bound" ? "≥" : comparison.qualifier === "DM upper bound" ? "≤" : "";
          return `${symbol}${comparison.value.toFixed(2)}%`;
        } },
        markLine: isPrice ? undefined : {
          symbol: "none",
          silent: true,
          data: [
            ...(nutrient!.min === null
  ? []
  : [{
      name: "AAFCO minimum",
      xAxis: nutrient!.min!,
      lineStyle: {
        color: "#B88938",
        type: "dashed" as const,
        width: 2,
      },
      label: {
        formatter: "AAFCO min",
        position: "insideEndBottom" as const,
      },
    }]),
            ...(nutrient!.max === null
              ? []
              : [{
                  name: "AAFCO maximum",
                  xAxis: nutrient!.max!,
                  lineStyle: { color: "#B65F3C", type: "dashed" as const, width: 2 },
                  label: { formatter: "AAFCO max", position: "insideEndTop" as const },
                }]),
          ],
        },
      },
    ],
  }), [selected, nutrient, isPrice]);

  return (
    <section
      aria-label="Dry dog food nutrient comparison"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--line)",
        padding: "clamp(18px, 3vw, 38px)",
        fontFamily: "var(--sans)",
      }}
    >
      <p className="eyebrow">DATA INQUIRY / DOG NUTRITION</p>
      <h2>Dry Dog Food Nutrition &amp; Price Comparison</h2>

      <label htmlFor="dog-food-nutrient">Select comparison</label>
      <select
        id="dog-food-nutrient"
        value={selected}
        onChange={(event) => setSelected(event.target.value as ChartKey)}
        style={{
          display: "block",
          margin: "12px 0 24px",
          padding: "10px",
          background: "var(--paper)",
          color: "var(--charcoal)",
          border: "1px solid var(--line)",
        }}
      >
        {availableNutrients.map((key) => (
          <option key={key} value={key}>{nutrients[key].label}</option>
        ))}
        <option value="price">Price per Pound (Chewy)</option>
      </select>

      <div role="region" aria-label="Scrollable dog food nutrient chart" tabIndex={0} style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 650 }}>
          <EChartsChart option={option} height={320} />
        </div>
      </div>

      <p style={{ color: "var(--slate)", fontSize: "0.85rem", lineHeight: 1.6 }}>
        {isPrice
          ? "Chewy advertised one-time purchase prices, checked October 17, 2026. Price per pound = bag price / bag weight. Excludes taxes, shipping, Autoship discounts, and promotions. Prices and availability may change."
          : "All plotted nutrient values are on a dry-matter basis. Inukshuk and Eukanuba have manufacturer-reported dry-matter concentrations (October 20 and October 19, 2026, respectively); Purina currently has guaranteed-analysis bounds rather than measured concentrations. ≥ indicates a lower bound derived from an as-fed guaranteed minimum; ≤ indicates an upper bound derived from an as-fed guaranteed maximum and maximum moisture. Fiber and total omega-3/omega-6 have no AAFCO concentration reference lines in this dataset. AAFCO lines are reference thresholds, not optimal targets; these bounds alone do not confirm complete nutritional adequacy."}
      </p>

      <div style={{ marginTop: 22, padding: "16px", border: "1px solid var(--line)" }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Nutrient data coverage</h3>
        <p style={{ color: "var(--slate)", fontSize: "0.85rem", lineHeight: 1.6 }}>
          Coverage of the {Object.keys(nutrients).length} nutrients currently tracked in this comparison.
          This is not coverage of the complete AAFCO nutrient profile, and availability does not establish nutritional adequacy.
        </p>
        <div aria-label="Nutrient evidence categories" style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", margin: "14px 0", fontSize: "0.85rem" }}>
          {[
            { label: "Manufacturer-reported", color: "#29483A" },
            { label: "Guaranteed-analysis bound", color: "#B88938" },
            { label: "Data unavailable", color: "#D9D9D0" },
          ].map((item) => (
            <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span aria-hidden="true" style={{ width: 12, height: 12, background: item.color, display: "inline-block" }} />
              {item.label}
            </span>
          ))}
        </div>
        {foods.map((food) => {
          const total = nutrientKeys.length;
          const reported = nutrientKeys.filter((key) => food.values[key]?.type === "Reported").length;
          const bounds = nutrientKeys.filter((key) => {
            const type = food.values[key]?.type;
            return type === "Minimum" || type === "Maximum";
          }).length;
          const unavailable = total - reported - bounds;
          const segments = [
            { label: "manufacturer-reported", count: reported, color: "#29483A" },
            { label: "guaranteed-analysis bounds", count: bounds, color: "#B88938" },
            { label: "unavailable", count: unavailable, color: "#D9D9D0" },
          ];
          return (
            <div key={food.name} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", fontSize: "0.9rem" }}>
                <span>{food.name}</span>
                <span>{reported} reported · {bounds} bounds · {unavailable} unavailable</span>
              </div>
              <div
                role="img"
                aria-label={`${food.name}: ${reported} manufacturer-reported, ${bounds} guaranteed-analysis bounds, ${unavailable} unavailable, out of ${total} tracked nutrients`}
                style={{ display: "flex", height: 12, marginTop: 7, borderRadius: 4, overflow: "hidden", background: "#D9D9D0" }}
              >
                {segments.filter((segment) => segment.count > 0).map((segment) => (
                  <div
                    key={segment.label}
                    title={`${segment.count} ${segment.label}`}
                    style={{ width: `${(segment.count / total) * 100}%`, background: segment.color }}
                  />
                ))}
              </div>
            </div>
          );
        })}
        <p style={{ color: "var(--slate)", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: 0 }}>
          Other AAFCO nutrients are not yet tracked here. Missing manufacturer values will be shown as “Data not available” when additional nutrients are added.
        </p>
      </div>

      <div style={{ marginTop: 22, padding: "16px", border: "1px solid var(--line)" }}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Additional manufacturer nutrition information</h3>
        {foods.filter((food) => food.additionalMetrics).map((food) => {
          const metrics = food.additionalMetrics!;
          return (
            <div key={food.name} style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
              <p style={{ marginTop: 0 }}><strong>{food.name}</strong> — {food.manufacturerDataSource ?? "Manufacturer-provided information"}</p>
              <p>Vitamin D3: {metrics.vitaminD3 ? `${metrics.vitaminD3.value.toLocaleString()} ${metrics.vitaminD3.unit} (${metrics.vitaminD3.basis === "Dry matter" ? "dry matter" : "basis not specified"})` : "Data not available"}</p>
              <p>Metabolizable energy: {metrics.metabolizableEnergy ? `${metrics.metabolizableEnergy.kcalPerKg.toLocaleString()} kcal/kg; ${metrics.metabolizableEnergy.kcalPerCup} kcal/cup` : "Data not available"}</p>
              <p>Calcium-to-phosphorus ratio: {metrics.calciumPhosphorusRatio ?? "Data not available"}</p>
              {metrics.ash === null && <p>Ash: Manufacturer could not provide a value</p>}
              {!!metrics.minerals?.length && (
                <p>Other minerals (manufacturer-reported dry matter): {metrics.minerals.map((item) => `${item.label} ${item.value.toLocaleString("en-US")} ${item.unit}`).join("; ")}</p>
              )}
              {!!metrics.vitamins?.length && (
                <p>Other vitamins (manufacturer-reported dry matter): {metrics.vitamins.map((item) => `${item.label} ${item.value.toLocaleString("en-US")} ${item.unit}`).join("; ")}</p>
              )}
              {metrics.aafcoStatement && (
                <p>Manufacturer-provided AAFCO suitability statement: {metrics.aafcoStatement} This is a manufacturer statement, not an independent verification of nutrient adequacy.</p>
              )}
              {food.guaranteedAnalysis && (
                <p>
                  Original label guarantees: {Object.entries(food.guaranteedAnalysis)
                    .filter((entry): entry is [string, NonNullable<typeof entry[1]>] => entry[1] !== undefined)
                    .map(([key, value]) => `${key} ${value.value}% ${value.type.toLowerCase()} (${value.basis})`)
                    .join("; ")}. These are retained separately from the new dry-matter measurements.
                </p>
              )}
            </div>
          );
        })}
        <p style={{ color: "var(--slate)", fontSize: "0.85rem", marginBottom: 0 }}>Eukanuba vitamin D3 cannot be compared against dry-matter AAFCO thresholds until its reporting basis is confirmed. Manufacturer-reported concentrations and suitability statements do not independently establish nutritional adequacy.</p>
      </div>

      <div style={{ overflowX: "auto", marginTop: 20 }}>
        {isPrice ? (
          <table style={{ width: "100%", minWidth: 540, borderCollapse: "collapse" }}>
            <thead><tr><th style={{ textAlign: "left" }}>Food</th><th>Bag weight</th><th>Bag price</th><th>Cost/lb</th><th>Retailer</th></tr></thead>
            <tbody>{chewyPrices.map((listing) => (
              <tr key={listing.name}>
                <td>{listing.name}</td>
                <td style={{ textAlign: "center" }}>{listing.bagLb} lb</td>
                <td style={{ textAlign: "center" }}>${listing.price.toFixed(2)}</td>
                <td style={{ textAlign: "center" }}>${(listing.price / listing.bagLb).toFixed(2)}</td>
                <td style={{ textAlign: "center" }}><a href={listing.url} target="_blank" rel="noopener noreferrer">Chewy listing</a></td>
              </tr>
            ))}</tbody>
          </table>
        ) : (
          <table style={{ width: "100%", minWidth: 540, borderCollapse: "collapse" }}>
            <thead><tr><th style={{ textAlign: "left" }}>Food</th><th>DM comparison</th><th>Interpretation</th><th>Original published value</th><th>Moisture max</th></tr></thead>
            <tbody>{foods.map((food) => {
              const entry = food.values[selected];
              const comparison = dryMatterComparison(food, selected);
              if (!comparison || !entry) return (
                <tr key={food.name}><td>{food.name}</td><td colSpan={4} style={{ textAlign: "center" }}>Data not available</td></tr>
              );
              const symbol = comparison.qualifier === "DM lower bound" ? "≥" : comparison.qualifier === "DM upper bound" ? "≤" : "";
              return (
                <tr key={food.name}>
                  <td>{food.name}</td>
                  <td style={{ textAlign: "center" }}>{symbol}{comparison.value.toFixed(2)}%</td>
                  <td style={{ textAlign: "center" }}>{comparison.qualifier}</td>
                  <td style={{ textAlign: "center" }}>{entry.value}% {entry.type.toLowerCase()} ({entry.basis})</td>
                  <td style={{ textAlign: "center" }}>{food.moistureMax}%</td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </div>
    </section>
  );
}
