export default function DogFoodMethodology() {
  const topics = [
    {
      title: "Why compare nutrients on a dry-matter basis?",
      text: "Dry-matter (DM) percentages exclude water so that foods with different moisture contents can be compared on a more consistent basis. A label's maximum moisture guarantee is not a measured moisture value, however, so it cannot be used to calculate an exact DM concentration from a guaranteed-analysis value.",
    },
    {
      title: "Manufacturer-reported measurements",
      text: "A manufacturer-reported DM concentration is displayed as reported, rather than estimated from a label guarantee. For example, Eukanuba supplied dry-matter nutrient concentrations in its October 19, 2026 response. These reported values are different kinds of evidence from the minimums and maximums printed on a product label.",
    },
    {
      title: "Guaranteed-analysis bounds",
      text: "A guaranteed minimum means the nutrient concentration is at least the stated as-fed percentage; it is not the food's exact concentration. With only a maximum moisture guarantee, that as-fed minimum also provides a conservative DM lower bound. An as-fed maximum can provide a conservative DM upper bound by dividing the stated maximum by (1 − maximum moisture fraction). The chart uses ≥ and ≤ to identify these bounds; it does not present them as measured values.",
    },
    {
      title: "How to read AAFCO reference lines",
      text: "Where available, the dashed lines show AAFCO adult-maintenance nutrient minimums or maximums from the reference dataset used in this inquiry. They are regulatory nutrient-profile reference thresholds, not ideal targets for every dog. A plotted bound near or across a line does not, by itself, establish whether the finished food meets the full AAFCO nutrient profile or is suitable for an individual dog.",
    },
    {
      title: "Missing data and other limitations",
      text: "Data unavailable means a comparable nutrient measurement or guarantee has not been documented in this inquiry; it does not mean the nutrient is absent from the food. The seven tracked nutrients are only a subset of a complete nutritional profile. Manufacturer measurements and label guarantees may differ in reporting basis, precision, and evidentiary meaning. Prices are retailer snapshots and may change.",
    },
  ];

  return (
    <section
      id="dog-food-methodology"
      aria-labelledby="dog-food-methodology-title"
      style={{
        marginTop: 28,
        padding: "clamp(18px, 3vw, 38px)",
        border: "1px solid var(--line)",
        background: "var(--paper)",
        fontFamily: "var(--sans)",
      }}
    >
      <p className="eyebrow">METHODOLOGY / READING THE DATA</p>
      <h2 id="dog-food-methodology-title">How to Interpret This Comparison</h2>
      <p style={{ color: "var(--slate)", lineHeight: 1.7 }}>
        This comparison separates manufacturer-reported concentrations from
        guaranteed-analysis bounds. Neither the chart nor its coverage summary
        establishes that one food is nutritionally superior or that a food meets
        every AAFCO requirement.
      </p>
      <div style={{ display: "grid", gap: 18, marginTop: 22 }}>
        {topics.map((topic, index) => (
          <div key={topic.title}>
            <h3 style={{ margin: "0 0 6px", fontSize: "1.05rem" }}>
              {index + 1}. {topic.title}
            </h3>
            <p style={{ margin: 0, color: "var(--slate)", lineHeight: 1.7 }}>
              {topic.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
