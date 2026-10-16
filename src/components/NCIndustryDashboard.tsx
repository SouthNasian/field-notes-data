import NCEmploymentGrowthChart from "@/components/NCEmploymentGrowthChart";
import NCWageGrowthChart from "@/components/NCWageGrowthChart";
import NCEmploymentWageScatterPlot from "@/components/NCEmploymentWageScatterPlot";

const findings = [
  {
    number: "01",
    kicker: "THE BIG PICTURE",
    headline: "11 of 15 industries grew on both measures",
    description:
      "Among industries with comparable 2019 and 2025 data, 11 increased both employment and inflation-adjusted average weekly wages. Two gained jobs while real wages fell, and two lost jobs while real wages rose.",
    accent: "var(--evergreen)",
  },
  {
    number: "02",
    kicker: "GROWTH LEADERS",
    headline: "Professional services and finance advanced",
    description:
      "Professional, scientific, and technical services increased employment 26.6% and real average weekly wages 9.0%. Finance and insurance grew 26.9% and 7.3%, respectively.",
    accent: "var(--evergreen-2)",
  },
  {
    number: "03",
    kicker: "THE DISCONNECT",
    headline: "More jobs did not always mean higher real wages",
    description:
      "Transportation and warehousing employment grew 28.0%, yet real average weekly wages slipped 0.7%. Utilities also gained jobs while real average weekly wages declined 5.5%.",
    accent: "var(--rust)",
  },
];

export default function NCIndustryDashboard() {
  return (
    <div style={{ width: "100%" }}>
      <section aria-labelledby="nc-key-findings" style={{ marginTop: "36px", fontFamily: "var(--sans)" }}>
        <p className="eyebrow">RESEARCH FINDINGS / NORTH CAROLINA / 2019–2025</p>
        <h2 id="nc-key-findings" style={{ marginBottom: "12px" }}>Three Key Findings</h2>
        <p style={{ color: "var(--slate)", lineHeight: 1.7, maxWidth: "800px", marginBottom: "22px" }}>
          Employment growth and wage growth tell different parts of North Carolina&apos;s economic story.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))", gap: "16px" }}>
          {findings.map((finding) => (
            <article
              key={finding.number}
              style={{
                background: "var(--paper)",
                border: "1px solid var(--line)",
                borderTop: `4px solid ${finding.accent}`,
                padding: "clamp(20px, 2.4vw, 28px)",
                color: "var(--charcoal)",
              }}
            >
              <p style={{ color: finding.accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "20px" }}>
                {finding.number} / {finding.kicker}
              </p>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.2rem, 2vw, 1.5rem)", lineHeight: 1.3, marginBottom: "16px" }}>
                {finding.headline}
              </h3>
              <p style={{ color: "var(--slate)", fontSize: "0.9rem", lineHeight: 1.75, margin: 0 }}>
                {finding.description}
              </p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: "18px", color: "var(--slate)", fontSize: "0.8rem", lineHeight: 1.7 }}>
          Source: U.S. Bureau of Labor Statistics, QCEW and CPI-U. Real wage growth adjusts
          2019 average weekly wages to 2025 dollars using annual-average CPI-U
          (2019: 255.657; 2025: 321.943). Findings cover 15 industries with comparable
          endpoint data. Industry averages can change with workforce composition and do not
          represent individual workers&apos; raises.
        </p>
      </section>

      <div style={{ marginTop: "40px" }}><NCEmploymentGrowthChart /></div>
      <div style={{ marginTop: "40px" }}><NCWageGrowthChart /></div>
      <div style={{ marginTop: "40px" }}><NCEmploymentWageScatterPlot /></div>
    </div>
  );
}
