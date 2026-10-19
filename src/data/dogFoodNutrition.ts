export type NutrientMeasurement = {
  value: number;
  type: "Minimum" | "Maximum" | "Reported";
  basis: "As-fed" | "Dry matter";
};

export type DogFoodNutrition = {
  name: string;
  moistureMax: number;
  values: Partial<Record<string, NutrientMeasurement>>;
  // Keep label guarantees when a newer manufacturer-reported DM value is used for comparison.
  guaranteedAnalysis?: Partial<Record<string, NutrientMeasurement>>;
  // Non-percentage metrics are kept separately to avoid mislabeling units or basis.
  additionalMetrics?: {
    vitaminD3?: { value: number; unit: "IU/kg"; basis: "Not specified" };
    metabolizableEnergy?: { kcalPerKg: number; kcalPerCup: number };
    calciumPhosphorusRatio?: string;
    ash?: null;
  };
  manufacturerDataSource?: string;
};

export const dogFoods: DogFoodNutrition[] = [
  {
    name: "Inukshuk 26/16",
    moistureMax: 10,
    values: {
      protein: { value: 26, type: "Minimum", basis: "As-fed" },
      fat: { value: 16, type: "Minimum", basis: "As-fed" },
      calcium: { value: 1.3, type: "Maximum", basis: "As-fed" },
      phosphorus: { value: 1.1, type: "Maximum", basis: "As-fed" },
    },
  },
  {
    name: "Eukanuba Adult Medium",
    moistureMax: 10,
    values: {
      protein: { value: 29.02, type: "Reported", basis: "Dry matter" },
      fat: { value: 18.48, type: "Reported", basis: "Dry matter" },
      fiber: { value: 2.39, type: "Reported", basis: "Dry matter" },
      calcium: { value: 1.41, type: "Reported", basis: "Dry matter" },
      phosphorus: { value: 1.09, type: "Reported", basis: "Dry matter" },
      omega3: { value: 0.23, type: "Reported", basis: "Dry matter" },
      omega6: { value: 3.97, type: "Reported", basis: "Dry matter" },
    },
    guaranteedAnalysis: {
      protein: { value: 24.5, type: "Minimum", basis: "As-fed" },
      fat: { value: 15, type: "Minimum", basis: "As-fed" },
    },
    additionalMetrics: {
      vitaminD3: { value: 1086.96, unit: "IU/kg", basis: "Not specified" },
      metabolizableEnergy: { kcalPerKg: 3755, kcalPerCup: 376 },
      calciumPhosphorusRatio: "1.3:1",
      ash: null,
    },
    manufacturerDataSource: "Eukanuba customer support email, October 19, 2026",
  },
  {
    name: "Purina Pro Plan",
    moistureMax: 12,
    values: {
      protein: { value: 26, type: "Minimum", basis: "As-fed" },
      fat: { value: 16, type: "Minimum", basis: "As-fed" },
      calcium: { value: 1, type: "Minimum", basis: "As-fed" },
      phosphorus: { value: 0.8, type: "Minimum", basis: "As-fed" },
    },
  },
];
