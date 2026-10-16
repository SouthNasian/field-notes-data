"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import type { EChartsOption } from "echarts";
import EChartsChart from "./EChartsChart";

const CPI_2019 = 255.657;
const CPI_2025 = 321.943;
const INFLATION_FACTOR = CPI_2025 / CPI_2019;

type QCEWRow = {
  year: string;
  ownership_code: string;
  industry_code: string;
  industry_name: string;
  industry_level: string;
  annual_avg_employment: string;
  average_weekly_wage_usd: string;
  is_suppressed: string;
};

type Industry = {
  code: string;
  name: string;
  employmentGrowth: number;
  realWageGrowth: number;
  nominalWageGrowth: number;
  jobsAdded: number;
};

type WageMetric = "real" | "nominal";
const fmt = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export default function NCEmploymentWageScatterPlot() {
  const [data, setData] = useState<Industry[]>([]);
  const [metric, setMetric] = useState<WageMetric>("real");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/data/nc_qcew_2019_2025_clean.csv");
        if (!response.ok) throw new Error("Unable to load the QCEW dataset.");
        const parsed = Papa.parse<QCEWRow>(await response.text(), { header: true, skipEmptyLines: true });
        if (parsed.errors.length) throw new Error("CSV parsing failed.");
        const byIndustry = new Map<string, { name: string; values: Map<string, { employment: number; wage: number }> }>();
        for (const row of parsed.data) {
          if (row.ownership_code !== "5" || row.industry_level !== "NAICS sector" ||
              (row.year !== "2019" && row.year !== "2025") || row.is_suppressed?.toLowerCase() === "true" ||
              !row.annual_avg_employment?.trim() || !row.average_weekly_wage_usd?.trim()) continue;
          const employment = Number(row.annual_avg_employment);
          const wage = Number(row.average_weekly_wage_usd);
          if (!Number.isFinite(employment) || employment <= 0 || !Number.isFinite(wage) || wage <= 0) continue;
          if (!byIndustry.has(row.industry_code)) byIndustry.set(row.industry_code, { name: row.industry_name, values: new Map() });
          const industry = byIndustry.get(row.industry_code)!;
          industry.values.set(row.year, { employment, wage });
          if (row.year === "2025") industry.name = row.industry_name;
        }
        const comparable: Industry[] = [];
        for (const [code, industry] of byIndustry) {
          const start = industry.values.get("2019");
          const end = industry.values.get("2025");
          if (!start || !end) continue;
          comparable.push({
            code, name: industry.name,
            employmentGrowth: (end.employment / start.employment - 1) * 100,
            realWageGrowth: (end.wage / (start.wage * INFLATION_FACTOR) - 1) * 100,
            nominalWageGrowth: (end.wage / start.wage - 1) * 100,
            jobsAdded: end.employment - start.employment,
          });
        }
        if (!cancelled) setData(comparable);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const option = useMemo<EChartsOption>(() => {
    const real = metric === "real";
    const yValue = (item: Industry) => real ? item.realWageGrowth : item.nominalWageGrowth;
    return {
      backgroundColor: "#FBFAF6",
      textStyle: { color: "#20231F", fontFamily: "DM Sans, Arial, sans-serif" },
      grid: { left: 75, right: 36, top: 35, bottom: 75 },
      tooltip: {
        trigger: "item", backgroundColor: "#FBFAF6", borderColor: "#C9CBC3",
        textStyle: { color: "#20231F" },
        formatter: (params: any) => {
          const item = data[params.dataIndex];
          if (!item) return "";
          return [
            `<strong>${item.name}</strong>`,
            `Employment growth: ${fmt(item.employmentGrowth)}`,
            `Real wage growth: ${fmt(item.realWageGrowth)}`,
            `Nominal wage growth: ${fmt(item.nominalWageGrowth)}`,
            `Jobs added: ${item.jobsAdded.toLocaleString()}`,
          ].join("<br/>");
        },
      },
      xAxis: {
        type: "value", name: "Employment growth (%)", nameLocation: "middle", nameGap: 42,
        axisLabel: { color: "#69716B", formatter: "{value}%" },
        splitLine: { lineStyle: { color: "#D9D9D0" } },
      },
      yAxis: {
        type: "value", name: real ? "Real wage growth (%)" : "Nominal wage growth (%)",
        nameLocation: "middle", nameGap: 53,
        axisLabel: { color: "#69716B", formatter: "{value}%" },
        splitLine: { lineStyle: { color: "#D9D9D0" } },
      },
      series: [{
        type: "scatter", symbolSize: 15,
        data: data.map((item) => ({
          value: [Number(item.employmentGrowth.toFixed(2)), Number(yValue(item).toFixed(2))],
          itemStyle: { color: yValue(item) < 0 ? "#B65F3C" : "#29483A", opacity: 0.9 },
        })),
        markLine: {
          silent: true, symbol: "none", label: { show: false },
          lineStyle: { color: "#69716B", type: "dashed", width: 1 },
          data: [{ xAxis: 0 }, { yAxis: 0 }],
        },
      }],
    };
  }, [data, metric]);

  if (loading) return <p>Loading employment and wage comparison...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (!data.length) return <p>No industries have comparable employment and wage data.</p>;

  const buttonStyle = (selected: boolean) => ({
    padding: "11px 16px", cursor: "pointer" as const, borderRadius: "3px",
    border: "1px solid var(--evergreen)", backgroundColor: selected ? "var(--evergreen)" : "var(--paper)",
    color: selected ? "var(--paper)" : "var(--evergreen)", fontFamily: "var(--sans)",
    fontSize: "0.76rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" as const,
  });
  return (
    <section aria-label="North Carolina employment and wage growth relationship" style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "clamp(18px, 3vw, 38px)", color: "var(--charcoal)", fontFamily: "var(--sans)" }}>
      <p className="eyebrow">DATA INQUIRY / NORTH CAROLINA / 2019–2025</p>
      <h2>Are Growing Industries Also Paying More?</h2>
      <p style={{ color: "var(--slate)", fontSize: "0.875rem", lineHeight: 1.6, maxWidth: "750px" }}>
        Each point represents one private-sector industry. Compare employment growth with wage growth to see whether expanding industries also experienced increases in purchasing power.
      </p>
      <div role="group" aria-label="Select wage growth measure" style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "24px 0" }}>
        <button type="button" aria-pressed={metric === "real"} onClick={() => setMetric("real")} style={buttonStyle(metric === "real")}>Real wage growth (%)</button>
        <button type="button" aria-pressed={metric === "nominal"} onClick={() => setMetric("nominal")} style={buttonStyle(metric === "nominal")}>Nominal wage growth (%)</button>
      </div>
      <p style={{ color: "var(--slate)", fontSize: "0.875rem", marginBottom: "8px" }}>Hover or tap a point for industry details. On smaller screens, scroll horizontally.</p>
      <div role="region" aria-label="Scrollable employment and wage scatter plot" tabIndex={0} style={{ width: "100%", maxWidth: "100%", overflowX: "auto", border: "1px solid var(--line)" }}>
        <div style={{ minWidth: "700px" }}><EChartsChart option={option} height={530} /></div>
      </div>
      <p style={{ color: "var(--slate)", fontSize: "0.8rem", lineHeight: 1.7, marginTop: "18px" }}>
        {data.length} industries with comparable 2019 and 2025 employment and wage values. Dashed lines indicate zero growth. Green points indicate positive {metric === "real" ? "real" : "nominal"} wage growth; rust points indicate negative growth. CPI-U annual averages: 2019 = 255.657; 2025 = 321.943. Industry-average wages can change with workforce composition and do not represent individual workers’ raises. Source: U.S. Bureau of Labor Statistics, QCEW and CPI-U.
      </p>
    </section>
  );
}
