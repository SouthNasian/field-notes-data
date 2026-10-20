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
    vitaminD3?: { value: number; unit: "IU/kg"; basis: "Not specified" | "Dry matter" };
    metabolizableEnergy?: { kcalPerKg: number; kcalPerCup: number };
    calciumPhosphorusRatio?: string;
    ash?: null;
    minerals?: { label: string; value: number; unit: "%" | "mg/kg" }[];
    vitamins?: { label: string; value: number; unit: "IU/kg" | "mg/kg" }[];
    aafcoStatement?: string;
  };
  manufacturerDataSource?: string;
};

export const dogFoods: DogFoodNutrition[] = [
  {
    name: "Inukshuk 26/16",
    moistureMax: 10,
    values: {
      protein: { value: 28.89, type: "Reported", basis: "Dry matter" },
      fat: { value: 17.78, type: "Reported", basis: "Dry matter" },
      fiber: { value: 3.70, type: "Reported", basis: "Dry matter" },
      calcium: { value: 1.33, type: "Reported", basis: "Dry matter" },
      phosphorus: { value: 1.11, type: "Reported", basis: "Dry matter" },
      omega3: { value: 0.61, type: "Reported", basis: "Dry matter" },
      omega6: { value: 3.63, type: "Reported", basis: "Dry matter" },
    },
    guaranteedAnalysis: {
      protein: { value: 26, type: "Minimum", basis: "As-fed" },
      fat: { value: 16, type: "Minimum", basis: "As-fed" },
      calcium: { value: 1.3, type: "Maximum", basis: "As-fed" },
      phosphorus: { value: 1.1, type: "Maximum", basis: "As-fed" },
    },
    additionalMetrics: {
      vitaminD3: { value: 1390, unit: "IU/kg", basis: "Dry matter" },
      metabolizableEnergy: { kcalPerKg: 3630, kcalPerCup: 472 },
      calciumPhosphorusRatio: "1.20:1",
      minerals: [
        { label: "Potassium", value: 0.74, unit: "%" },
        { label: "Chloride", value: 0.94, unit: "%" },
        { label: "Zinc", value: 217.8, unit: "mg/kg" },
        { label: "Copper", value: 18.9, unit: "mg/kg" },
        { label: "Selenium", value: 1.20, unit: "mg/kg" },
      ],
      vitamins: [
        { label: "Vitamin A", value: 29144, unit: "IU/kg" },
        { label: "Vitamin E", value: 120, unit: "IU/kg" },
        { label: "Thiamine (B1)", value: 14.2, unit: "mg/kg" },
        { label: "Riboflavin (B2)", value: 12.6, unit: "mg/kg" },
        { label: "Pyridoxine (B6)", value: 4.3, unit: "mg/kg" },
      ],
      aafcoStatement: "Suitable for all life stages including growth of large size dogs (70 lbs or more as an adult).",
    },
    manufacturerDataSource: "Inukshuk Pro customer support email, October 20, 2026 (dry-matter nutrient values)",
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
      protein: { value: 29.90, type: "Reported", basis: "Dry matter" },
      fat: { value: 19.00, type: "Reported", basis: "Dry matter" },
      fiber: { value: 1.60, type: "Reported", basis: "Dry matter" },
      calcium: { value: 1.51, type: "Reported", basis: "Dry matter" },
      phosphorus: { value: 1.12, type: "Reported", basis: "Dry matter" },
    },
    guaranteedAnalysis: {
      protein: { value: 26, type: "Minimum", basis: "As-fed" },
      fat: { value: 16, type: "Minimum", basis: "As-fed" },
      calcium: { value: 1, type: "Minimum", basis: "As-fed" },
      phosphorus: { value: 0.8, type: "Minimum", basis: "As-fed" },
    },
    additionalMetrics: {
      metabolizableEnergy: { kcalPerKg: 4038, kcalPerCup: 387 },
      calciumPhosphorusRatio: "1.35:1 (calculated from rounded dry-matter values)",
      minerals: [
        { label: "Potassium", value: 0.80, unit: "%" },
        { label: "Sodium", value: 0.45, unit: "%" },
        { label: "Chloride", value: 0.81, unit: "%" },
        { label: "Magnesium", value: 0.14, unit: "%" },
      ],
    },
    manufacturerDataSource: "Purina Pro Plan Complete Essentials Adult Shredded Blend Chicken & Rice nutritional information screenshot (formula match believed, not independently confirmed; average values)",
  },
];
