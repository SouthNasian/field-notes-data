"use client";

import { useMemo, useState } from "react";
import type { EChartsOption } from "echarts";
import EChartsChart from "./EChartsChart";

type NutrientKey = "protein" | "fat" | "calcium" | "phosphorus";
type ChartKey = NutrientKey | "price";
type NutrientValue = {
  value: number;
  type: "Minimum" | "Maximum" | "Reported";
  basis: "As-fed" | "Dry matter";
};

const nutrients: Record<NutrientKey, { label: string; min: number; max: number | null }> = {
  protein: { label: "Protein", min: 18, max: null },
  fat: { label: "Fat", min: 5.5, max: null },
  calcium: { label: "Calcium", min: 0.5, max: 2.5 },
  phosphorus: { label: "Phosphorus", min: 0.4, max: 1.6 },
};

const chewyPrices = [
  { name: "Inukshuk 26/16", bagLb: 33, price: 60.64, url: "https://www.chewy.com/inukshuk-professional-dry-dog-food/dp/149200" },
  { name: "Eukanuba Adult Medium", bagLb: 35, price: 74.99, url: "https://www.chewy.com/eukanuba-adult-medium-breed-dry-dog/dp/4093742" },
  { name: "Purina Pro Plan", bagLb: 35, price: 74.48, url: "https://www.chewy.com/purina-pro-plan-high-protein-shredded/dp/52448" },
];

const foods: { name: string; values: Record<NutrientKey, NutrientValue> }[] = [
  {
    name: "Inukshuk 26/16",
    values: {
      protein: { value: 26, type: "Minimum", basis: "As-fed" },
      fat: { value: 16, type: "Minimum", basis: "As-fed" },
      calcium: { value: 1.3, type: "Maximum", basis: "As-fed" },
      phosphorus: { value: 1.1, type: "Maximum", basis: "As-fed" },
    },
  },
  {
    name: "Eukanuba Adult Medium",
    values: {
      protein: { value: 24.5, type: "Minimum", basis: "As-fed" },
      fat: { value: 15, type: "Minimum", basis: "As-fed" },
      calcium: { value: 1.31, type: "Reported", basis: "Dry matter" },
      phosphorus: { value: 1.1, type: "Reported", basis: "Dry matter" },
    },
  },
  {
    name: "Purina Pro Plan",
    values: {
      protein: { value: 26, type: "Minimum", basis: "As-fed" },
      fat: { value: 16, type: "Minimum", basis: "As-fed" },
      calcium: { value: 1, type: "Minimum", basis: "As-fed" },
      phosphorus: { value: 0.8, type: "Minimum", basis: "As-fed" },
    },
  },
];

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
        const entry = food.values[selected];
        return `${food.name}<br/>${nutrients[selected].label}: ${entry.value}%<br/>${entry.type} · ${entry.basis}`;
      },
    },
    grid: { left: 175, right: 80, top: 40, bottom: 60 },
    xAxis: {
      type: "value",
      // Keep the AAFCO upper limit visible even when all food bars are shorter.
      max: nutrient?.max == null ? undefined : Math.ceil(nutrient.max * 1.3 * 10) / 10,
      name: isPrice ? "Chewy price per pound (USD)" : "Published percentage (%)",
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
        data: isPrice ? chewyPrices.map((listing) => Number((listing.price / listing.bagLb).toFixed(4))) : foods.map((food) => food.values[selected as NutrientKey].value),
        itemStyle: { color: "#29483A" },
        label: { show: true, position: "right", formatter: (params: any) => isPrice ? `$${Number(params.value).toFixed(2)}` : `${params.value}%` },
        markLine: isPrice ? undefined : {
          symbol: "none",
          silent: true,
          data: [
            {
              name: "AAFCO minimum",
              xAxis: nutrient!.min,
              lineStyle: { color: "#B88938", type: "dashed", width: 2 },
              label: { formatter: "AAFCO min", position: "insideEndBottom" },
            },
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
        {(Object.keys(nutrients) as NutrientKey[]).map((key) => (
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
          : "AAFCO reference lines use dry-matter percentages. Food bars show published figures, which may be as-fed guarantees or reported dry-matter concentrations. These values are not yet directly comparable and should not be interpreted as confirmed AAFCO compliance."}
      </p>

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
            <thead><tr><th style={{ textAlign: "left" }}>Food</th><th>Value</th><th>Reporting type</th><th>Basis</th></tr></thead>
            <tbody>{foods.map((food) => {
              const entry = food.values[selected];
              return (
                <tr key={food.name}>
                  <td>{food.name}</td>
                  <td style={{ textAlign: "center" }}>{entry.value}%</td>
                  <td style={{ textAlign: "center" }}>{entry.type}</td>
                  <td style={{ textAlign: "center" }}>{entry.basis}</td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </div>
    </section>
  );
}
