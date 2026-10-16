"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import type { EChartsOption } from "echarts";
import EChartsChart from "./EChartsChart";

type QCEWRow = {
  year: string;
  ownership_code: string;
  industry_code: string;
  industry_name: string;
  industry_level: string;
  annual_avg_employment: string;
  is_suppressed: string;
};

type IndustryGrowth = {
  code: string;
  name: string;
  employment2019: number;
  employment2025: number;
  jobsAdded: number;
  growthPct: number;
};

type Metric = "percent" | "jobs";
type SortKey = "name" | "employment2019" | "employment2025" | "jobsAdded" | "growthPct";

export default function NCEmploymentGrowthChart() {
  const [data, setData] = useState<IndustryGrowth[]>([]);
  const [metric, setMetric] = useState<Metric>("percent");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/data/nc_qcew_2019_2025_clean.csv");
        if (!response.ok) {
          throw new Error("Unable to load the QCEW dataset.");
        }

        const csvText = await response.text();
        const parsed = Papa.parse<QCEWRow>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        if (parsed.errors.length > 0) {
          throw new Error("CSV parsing failed.");
        }

        const validRows = parsed.data.filter((row) => {
          const employment = Number(row.annual_avg_employment);
          return (
            row.ownership_code === "5" &&
            row.industry_level === "NAICS sector" &&
            (row.year === "2019" || row.year === "2025") &&
            row.is_suppressed?.toLowerCase() !== "true" &&
            row.annual_avg_employment?.trim() !== "" &&
            Number.isFinite(employment) &&
            employment > 0
          );
        });

        const industries = new Map<
          string,
          { name: string; values: Map<string, number> }
        >();

        for (const row of validRows) {
          if (!industries.has(row.industry_code)) {
            industries.set(row.industry_code, {
              name: row.industry_name,
              values: new Map(),
            });
          }
          const industry = industries.get(row.industry_code)!;
          industry.values.set(row.year, Number(row.annual_avg_employment));
          if (row.year === "2025") industry.name = row.industry_name;
        }

        const growth: IndustryGrowth[] = [];
        for (const [code, industry] of industries) {
          const start = industry.values.get("2019");
          const end = industry.values.get("2025");
          if (start === undefined || end === undefined) continue;
          growth.push({
            code,
            name: industry.name,
            employment2019: start,
            employment2025: end,
            jobsAdded: end - start,
            growthPct: ((end - start) / start) * 100,
          });
        }
        setData(growth);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, []);

  const rankedData = useMemo(
    () =>
      [...data].sort((a, b) =>
        metric === "percent"
          ? b.growthPct - a.growthPct
          : b.jobsAdded - a.jobsAdded
      ),
    [data, metric]
  );

  const tableData = useMemo(() => {
    if (sortKey === null) return rankedData;
    return [...data].sort((a, b) => {
      const comparison = sortKey === "name"
        ? a.name.localeCompare(b.name)
        : a[sortKey] - b[sortKey];
      return sortAscending ? comparison : -comparison;
    });
  }, [data, rankedData, sortKey, sortAscending]);

  const effectiveSortKey: SortKey = sortKey ?? (metric === "percent" ? "growthPct" : "jobsAdded");
  const effectiveSortAscending = sortKey === null ? false : sortAscending;

  function changeSort(key: SortKey) {
    if (effectiveSortKey === key) {
      // The default chart ranking is already descending. Reverse it on the first click.
      setSortKey(key);
      setSortAscending(!effectiveSortAscending);
    } else {
      setSortKey(key);
      setSortAscending(key === "name");
    }
  }

  const option = useMemo<EChartsOption>(() => {
    const isPercent = metric === "percent";
    return {
      backgroundColor: "#FBFAF6",
      textStyle: { color: "#20231F", fontFamily: "DM Sans, Arial, sans-serif" },
      tooltip: {
        backgroundColor: "#FBFAF6",
        borderColor: "#C9CBC3",
        textStyle: { color: "#20231F" },
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params: any) => {
          const item = Array.isArray(params) ? params[0] : params;
          const industry = rankedData[item?.dataIndex];
          if (!industry) return "";
          return [
            `<strong>${industry.name}</strong>`,
            `Growth: ${industry.growthPct.toFixed(1)}%`,
            `Jobs added: ${industry.jobsAdded.toLocaleString()}`,
            `2019 employment: ${industry.employment2019.toLocaleString()}`,
            `2025 employment: ${industry.employment2025.toLocaleString()}`,
          ].join("<br/>");
        },
      },
      grid: { left: 220, right: 65, top: 24, bottom: 65 },
      xAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "#D9D9D0" } },
        axisLine: { lineStyle: { color: "#69716B" } },
        nameTextStyle: { color: "#69716B", fontFamily: "DM Sans, Arial, sans-serif" },
        name: isPercent ? "Employment growth (%)" : "Jobs added",
        axisLabel: {
          color: "#69716B",
          formatter: isPercent ? "{value}%" : (value: number) => value.toLocaleString(),
        },
      },
      yAxis: {
        type: "category",
        inverse: true,
        data: rankedData.map((industry) => industry.name),
        axisLabel: { width: 190, overflow: "truncate", color: "#20231F", fontFamily: "DM Sans, Arial, sans-serif" },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series: [
        {
          type: "bar",
          data: rankedData.map((industry) => {
            const value = isPercent
              ? Number(industry.growthPct.toFixed(2))
              : industry.jobsAdded;
            return {
              value,
              itemStyle: { color: value < 0 ? "#B65F3C" : "#29483A" },
            };
          }),
          barMaxWidth: 22,
        },
      ],
    };
  }, [rankedData, metric]);

  if (loading) return <p>Loading North Carolina employment data...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (data.length === 0) return <p>No comparable industry data was found.</p>;

  const buttonStyle = (selected: boolean) => ({
    padding: "11px 16px",
    cursor: "pointer" as const,
    borderRadius: "3px",
    border: "1px solid var(--evergreen)",
    backgroundColor: selected ? "var(--evergreen)" : "var(--paper)",
    color: selected ? "var(--paper)" : "var(--evergreen)",
    fontFamily: "var(--sans)",
    fontSize: "0.76rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  });

  const mutedTextStyle = { color: "var(--slate)", fontSize: "0.875rem", lineHeight: 1.6 };
  const tableCellStyle = { padding: "13px 12px", borderBottom: "1px solid var(--line)", textAlign: "right" as const, fontVariantNumeric: "tabular-nums" as const };


  return (
    <section aria-label="North Carolina industry employment growth" style={{ background: "var(--paper)", border: "1px solid var(--line)", padding: "clamp(18px, 3vw, 38px)", color: "var(--charcoal)", fontFamily: "var(--sans)" }}>
      <p className="eyebrow">DATA INQUIRY / NORTH CAROLINA / 2019–2025</p>
      <h2 style={{ maxWidth: "850px" }}>North Carolina Employment Growth by Industry</h2>
      <p style={{ ...mutedTextStyle, maxWidth: "730px" }}>
        Annual average private-sector employment, 2019–2025. Choose a metric
        to compare percentage growth or net jobs added by industry.
      </p>

      <div
        role="group"
        aria-label="Select employment growth metric"
        style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "24px 0" }}
      >
        <button
          type="button"
          onClick={() => { setMetric("percent"); setSortKey(null); }}
          aria-pressed={metric === "percent"}
          style={buttonStyle(metric === "percent")}
        >
          Employment Growth (%)
        </button>
        <button
          type="button"
          onClick={() => { setMetric("jobs"); setSortKey(null); }}
          aria-pressed={metric === "jobs"}
          style={buttonStyle(metric === "jobs")}
        >
          Jobs Added
        </button>
      </div>

      <p style={{ ...mutedTextStyle, marginBottom: "8px" }}>
        On smaller screens, scroll horizontally to explore the full chart.
      </p>
      <div
        role="region"
        aria-label="Scrollable North Carolina industry employment chart"
        tabIndex={0}
        style={{
          background: "var(--paper)",
          border: "1px solid var(--line)",
          padding: "8px 0",
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ minWidth: "760px" }}>
          <EChartsChart
            option={option}
            height={Math.max(450, rankedData.length * 36)}
          />
        </div>
      </div>

      <div style={{ marginTop: "42px", borderTop: "1px solid var(--line)", paddingTop: "26px" }}>
        <p className="eyebrow">SOURCE DATA / INTERACTIVE TABLE</p>
        <h3>Industry employment data</h3>
        <p id="nc-industry-table-description" style={mutedTextStyle}>
          Select a column heading or use the controls below to sort the table.
          Clicking the currently selected heading reverses the sort order.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", margin: "20px 0", fontSize: "0.84rem" }}>
          <label htmlFor="nc-industry-sort-field" style={{ fontWeight: 600 }}>Sort table by</label>
          <select
            id="nc-industry-sort-field"
            value={effectiveSortKey}
            onChange={(event) => {
              const key = event.target.value as SortKey;
              setSortKey(key);
              setSortAscending(key === "name");
            }}
            style={{ padding: "8px", border: "1px solid var(--line)", borderRadius: "3px", color: "var(--charcoal)", backgroundColor: "var(--paper)" }}
          >
            <option value="name">Industry</option>
            <option value="employment2019">2019 jobs</option>
            <option value="employment2025">2025 jobs</option>
            <option value="jobsAdded">Jobs added</option>
            <option value="growthPct">Growth (%)</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSortKey(effectiveSortKey);
              setSortAscending(!effectiveSortAscending);
            }}
            style={{ padding: "8px 12px", border: "1px solid var(--evergreen)", borderRadius: "3px", backgroundColor: "var(--paper)", color: "var(--evergreen)", cursor: "pointer" }}
          >
            {effectiveSortAscending ? "Ascending ↑" : "Descending ↓"} — reverse order
          </button>
        </div>
        <div
          role="region"
          aria-label="Scrollable industry employment data table"
          tabIndex={0}
          style={{ maxWidth: "100%", overflowX: "auto", border: "1px solid var(--line)" }}
        >
          <table
            aria-describedby="nc-industry-table-description"
            style={{ width: "100%", minWidth: "760px", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", background: "var(--paper)", fontSize: "0.86rem" }}
          >
            <caption style={{ textAlign: "left", padding: "12px", color: "var(--slate)", fontSize: "0.78rem" }}>
              North Carolina private-sector employment by NAICS industry, 2019 and 2025
            </caption>
            <thead>
              <tr>
                {([
                  ["name", "Industry"],
                  ["employment2019", "2019 jobs"],
                  ["employment2025", "2025 jobs"],
                  ["jobsAdded", "Jobs added"],
                  ["growthPct", "Growth (%)"],
                ] as const).map(([key, label]) => {
                  const active = effectiveSortKey === key;
                  const ascending = effectiveSortAscending;
                  return (
                    <th
                      key={key}
                      scope="col"
                      aria-sort={active ? (ascending ? "ascending" : "descending") : "none"}
                      style={{ padding: "12px", borderBottom: "2px solid var(--evergreen)", background: "var(--bone)", color: "var(--evergreen)", textAlign: key === "name" ? "left" : "right", whiteSpace: "nowrap" }}
                    >
                      <button
                        type="button"
                        onClick={() => changeSort(key)}
                        style={{ font: "inherit", fontWeight: 600, color: "inherit", background: "none", border: 0, cursor: "pointer", textAlign: "inherit" }}
                      >
                        {label}{active ? (ascending ? " ↑" : " ↓") : ""}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tableData.map((industry) => (
                <tr key={industry.code}>
                  <th scope="row" style={{ ...tableCellStyle, textAlign: "left", fontWeight: 500 }}>
                    {industry.name}
                  </th>
                  <td style={tableCellStyle}>{industry.employment2019.toLocaleString()}</td>
                  <td style={tableCellStyle}>{industry.employment2025.toLocaleString()}</td>
                  <td style={tableCellStyle}>{industry.jobsAdded.toLocaleString()}</td>
                  <td style={tableCellStyle}>{industry.growthPct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ ...mutedTextStyle, borderTop: "1px solid var(--line)", marginTop: "28px", paddingTop: "18px", fontSize: "0.78rem" }}>
        Source: U.S. Bureau of Labor Statistics, Quarterly Census of Employment
        and Wages. Industries with missing or suppressed endpoint values are
        excluded. Employment figures represent covered jobs, not unique workers.
      </p>
    </section>
  );
}
