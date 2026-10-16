"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import type { EChartsOption } from "echarts";
import EChartsChart from "./EChartsChart";

// BLS CPI-U, U.S. city average, all items, annual averages (1982–84 = 100).
const CPI_2019 = 255.657;
const CPI_2025 = 321.943;
const INFLATION_FACTOR = CPI_2025 / CPI_2019;

type QCEWRow = {
  year: string;
  ownership_code: string;
  industry_code: string;
  industry_name: string;
  industry_level: string;
  average_weekly_wage_usd: string;
  is_suppressed: string;
};

type WageGrowth = {
  code: string;
  name: string;
  wage2019: number;
  wage2025: number;
  adjusted2019: number;
  nominalPct: number;
  realPct: number;
};

type Metric = "real" | "nominal";
type SortKey = "name" | "wage2019" | "adjusted2019" | "wage2025" | "realPct" | "nominalPct";

const mutedStyle = { color: "var(--slate)", fontSize: "0.875rem", lineHeight: 1.6 };
const cellStyle = { padding: "13px 12px", borderBottom: "1px solid var(--line)", textAlign: "right" as const, fontVariantNumeric: "tabular-nums" as const };
const currency = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const percent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export default function NCWageGrowthChart() {
  const [data, setData] = useState<WageGrowth[]>([]);
  const [metric, setMetric] = useState<Metric>("real");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const response = await fetch("/data/nc_qcew_2019_2025_clean.csv");
        if (!response.ok) throw new Error("Unable to load the QCEW dataset.");
        const parsed = Papa.parse<QCEWRow>(await response.text(), { header: true, skipEmptyLines: true });
        if (parsed.errors.length) throw new Error("CSV parsing failed.");
        const industries = new Map<string, { name: string; wages: Map<string, number> }>();
        for (const row of parsed.data) {
          const wage = Number(row.average_weekly_wage_usd);
          if (
            row.ownership_code !== "5" ||
            row.industry_level !== "NAICS sector" ||
            (row.year !== "2019" && row.year !== "2025") ||
            row.is_suppressed?.toLowerCase() === "true" ||
            !row.average_weekly_wage_usd?.trim() ||
            !Number.isFinite(wage) || wage <= 0
          ) continue;
          if (!industries.has(row.industry_code)) {
            industries.set(row.industry_code, { name: row.industry_name, wages: new Map() });
          }
          const industry = industries.get(row.industry_code)!;
          industry.wages.set(row.year, wage);
          if (row.year === "2025") industry.name = row.industry_name;
        }
        const rows: WageGrowth[] = [];
        for (const [code, industry] of industries) {
          const wage2019 = industry.wages.get("2019");
          const wage2025 = industry.wages.get("2025");
          if (wage2019 === undefined || wage2025 === undefined) continue;
          const adjusted2019 = wage2019 * INFLATION_FACTOR;
          rows.push({
            code, name: industry.name, wage2019, wage2025, adjusted2019,
            nominalPct: (wage2025 / wage2019 - 1) * 100,
            realPct: (wage2025 / adjusted2019 - 1) * 100,
          });
        }
        if (!cancelled) setData(rows);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadData();
    return () => { cancelled = true; };
  }, []);

  const metricKey: "realPct" | "nominalPct" = metric === "real" ? "realPct" : "nominalPct";
  const rankedData = useMemo(() => [...data].sort((a, b) => b[metricKey] - a[metricKey]), [data, metricKey]);
  const effectiveSortKey: SortKey = sortKey ?? metricKey;
  const effectiveSortAscending = sortKey === null ? false : sortAscending;
  const tableData = useMemo(() => {
    if (sortKey === null) return rankedData;
    return [...data].sort((a, b) => {
      const comparison = sortKey === "name" ? a.name.localeCompare(b.name) : a[sortKey] - b[sortKey];
      return (sortAscending ? 1 : -1) * comparison || a.name.localeCompare(b.name);
    });
  }, [data, rankedData, sortKey, sortAscending]);

  function changeSort(key: SortKey) {
    if (effectiveSortKey === key) {
      setSortKey(key);
      setSortAscending(!effectiveSortAscending);
    } else {
      setSortKey(key);
      setSortAscending(key === "name");
    }
  }

  const option = useMemo<EChartsOption>(() => ({
    backgroundColor: "#FBFAF6",
    textStyle: { color: "#20231F", fontFamily: "DM Sans, Arial, sans-serif" },
    tooltip: {
      trigger: "axis", axisPointer: { type: "shadow" },
      backgroundColor: "#FBFAF6", borderColor: "#C9CBC3", textStyle: { color: "#20231F" },
      formatter: (params: any) => {
        const item = Array.isArray(params) ? params[0] : params;
        const industry = rankedData[item?.dataIndex];
        if (!industry) return "";
        return [
          `<strong>${industry.name}</strong>`,
          `Real wage growth: ${percent(industry.realPct)}`,
          `Nominal wage growth: ${percent(industry.nominalPct)}`,
          `2019 weekly wage: ${currency(industry.wage2019)}`,
          `2019 wage in 2025 dollars: ${currency(industry.adjusted2019)}`,
          `2025 weekly wage: ${currency(industry.wage2025)}`,
        ].join("<br/>");
      },
    },
    grid: { left: 220, right: 65, top: 24, bottom: 65 },
    xAxis: {
      type: "value", name: metric === "real" ? "Real wage growth (%)" : "Nominal wage growth (%)",
      nameTextStyle: { color: "#69716B" },
      axisLabel: { color: "#69716B", formatter: "{value}%" },
      splitLine: { lineStyle: { color: "#D9D9D0" } },
      axisLine: { lineStyle: { color: "#69716B" } },
    },
    yAxis: {
      type: "category", inverse: true, data: rankedData.map((row) => row.name),
      axisLabel: { width: 190, overflow: "truncate", color: "#20231F", fontFamily: "DM Sans, Arial, sans-serif" },
      axisTick: { show: false }, axisLine: { show: false },
    },
    series: [{
      type: "bar", barMaxWidth: 22,
      data: rankedData.map((row) => {
        const value = Number(row[metricKey].toFixed(2));
        return { value, itemStyle: { color: value < 0 ? "#B65F3C" : "#29483A" } };
      }),
    }],
  }), [rankedData, metric, metricKey]);

  if (loading) return <p>Loading North Carolina wage data...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (data.length === 0) return <p>No comparable industry wage data was found.</p>;

  const buttonStyle = (selected: boolean) => ({
    padding: "11px 16px", cursor: "pointer" as const, borderRadius: "3px",
    border: "1px solid var(--evergreen)",
    backgroundColor: selected ? "var(--evergreen)" : "var(--paper)",
    color: selected ? "var(--paper)" : "var(--evergreen)",
    fontFamily: "var(--sans)", fontSize: "0.76rem", fontWeight: 700,
    letterSpacing: "0.04em", textTransform: "uppercase" as const,
  });

  return (
    <section aria-label="North Carolina industry wage growth" style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "clamp(18px, 3vw, 38px)", color: "var(--charcoal)", fontFamily: "var(--sans)" }}>
      <p className="eyebrow">DATA INQUIRY / NORTH CAROLINA / 2019–2025</p>
      <h2 style={{ maxWidth: "850px" }}>Are North Carolina Industry Wages Keeping Up?</h2>
      <p style={{ ...mutedStyle, maxWidth: "730px" }}>
        Compare changes in average weekly wages by industry. Real growth adjusts 2019 wages for inflation and shows changes in purchasing power; nominal growth shows changes in unadjusted dollars.
      </p>
      <div role="group" aria-label="Select wage growth metric" style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "24px 0" }}>
        <button type="button" onClick={() => { setMetric("real"); setSortKey(null); }} aria-pressed={metric === "real"} style={buttonStyle(metric === "real")}>Real wage growth (%)</button>
        <button type="button" onClick={() => { setMetric("nominal"); setSortKey(null); }} aria-pressed={metric === "nominal"} style={buttonStyle(metric === "nominal")}>Nominal wage growth (%)</button>
      </div>
      <p style={{ ...mutedStyle, marginBottom: "8px" }}>On smaller screens, scroll horizontally to explore the full chart.</p>
      <div role="region" aria-label="Scrollable North Carolina industry wage growth chart" tabIndex={0} style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "8px 0", width: "100%", maxWidth: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ minWidth: "760px" }}><EChartsChart option={option} height={Math.max(450, rankedData.length * 36)} /></div>
      </div>
      <div style={{ marginTop: "42px", borderTop: "1px solid var(--line)", paddingTop: "26px" }}>
        <p className="eyebrow">SOURCE DATA / INTERACTIVE TABLE</p>
        <h3>Industry wage data</h3>
        <p id="nc-wage-table-description" style={mutedStyle}>Select a column heading or use the controls below to sort the table. Clicking the selected heading reverses the sort order.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", margin: "20px 0", fontSize: "0.84rem" }}>
          <label htmlFor="nc-wage-sort-field" style={{ fontWeight: 600 }}>Sort table by</label>
          <select id="nc-wage-sort-field" value={effectiveSortKey} onChange={(event) => { const key = event.target.value as SortKey; setSortKey(key); setSortAscending(key === "name"); }} style={{ padding: "8px", border: "1px solid var(--line)", borderRadius: "3px", color: "var(--charcoal)", backgroundColor: "var(--paper)" }}>
            <option value="name">Industry</option><option value="wage2019">2019 wage</option><option value="adjusted2019">2019 wage (2025 $)</option><option value="wage2025">2025 wage</option><option value="realPct">Real growth (%)</option><option value="nominalPct">Nominal growth (%)</option>
          </select>
          <button type="button" onClick={() => { setSortKey(effectiveSortKey); setSortAscending(!effectiveSortAscending); }} style={{ padding: "8px 12px", border: "1px solid var(--evergreen)", borderRadius: "3px", backgroundColor: "var(--paper)", color: "var(--evergreen)", cursor: "pointer" }}>{effectiveSortAscending ? "Ascending ↑" : "Descending ↓"} — reverse order</button>
        </div>
        <div role="region" aria-label="Scrollable industry wage data table" tabIndex={0} style={{ maxWidth: "100%", overflowX: "auto", border: "1px solid var(--line)" }}>
          <table aria-describedby="nc-wage-table-description" style={{ width: "100%", minWidth: "930px", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", background: "var(--paper)", fontSize: "0.86rem" }}>
            <caption style={{ textAlign: "left", padding: "12px", color: "var(--slate)", fontSize: "0.78rem" }}>Average weekly wages for North Carolina private-sector NAICS industries, 2019 and 2025</caption>
            <thead><tr>
              {([ ["name", "Industry"], ["wage2019", "2019 wage"], ["adjusted2019", "2019 wage (2025 $)"], ["wage2025", "2025 wage"], ["realPct", "Real growth (%)"], ["nominalPct", "Nominal growth (%)"] ] as const).map(([key, label]) => (
                <th key={key} scope="col" aria-sort={effectiveSortKey === key ? (effectiveSortAscending ? "ascending" : "descending") : "none"} style={{ padding: "12px", borderBottom: "2px solid var(--evergreen)", background: "var(--bone)", color: "var(--evergreen)", textAlign: key === "name" ? "left" : "right", whiteSpace: "nowrap" }}>
                  <button type="button" onClick={() => changeSort(key)} style={{ font: "inherit", fontWeight: 600, color: "inherit", background: "none", border: 0, cursor: "pointer", textAlign: "inherit" }}>{label}{effectiveSortKey === key ? (effectiveSortAscending ? " ↑" : " ↓") : ""}</button>
                </th>
              ))}
            </tr></thead>
            <tbody>{tableData.map((row) => (
              <tr key={row.code}>
                <th scope="row" style={{ ...cellStyle, textAlign: "left", fontWeight: 500 }}>{row.name}</th>
                <td style={cellStyle}>{currency(row.wage2019)}</td>
                <td style={cellStyle}>{currency(row.adjusted2019)}</td>
                <td style={cellStyle}>{currency(row.wage2025)}</td>
                <td style={cellStyle}>{percent(row.realPct)}</td>
                <td style={cellStyle}>{percent(row.nominalPct)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <p style={{ ...mutedStyle, borderTop: "1px solid var(--line)", marginTop: "28px", paddingTop: "18px", fontSize: "0.78rem" }}>
        Sources: U.S. Bureau of Labor Statistics, Quarterly Census of Employment and Wages (QCEW) and CPI-U (U.S. city average, all items, annual average). CPI: 2019 = 255.657; 2025 = 321.943 (1982–84 = 100). 2019 wages are expressed in 2025 dollars using the CPI ratio. Industries with missing or suppressed wages in either year are excluded. Industry average wages are not individual worker pay raises; shifts in workforce composition may affect these averages.
      </p>
    </section>
  );
}
