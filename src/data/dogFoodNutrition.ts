export type NutrientMeasurement = {
  value: number;
  type: "Minimum" | "Maximum" | "Reported";
  basis: "As-fed" | "Dry matter";
};

export type DogFoodNutrition = {
  name: string;
  moistureMax: number;
  values: Partial<Record<string, NutrientMeasurement>>;
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
      protein: { value: 24.5, type: "Minimum", basis: "As-fed" },
      fat: { value: 15, type: "Minimum", basis: "As-fed" },
      calcium: { value: 1.31, type: "Reported", basis: "Dry matter" },
      phosphorus: { value: 1.1, type: "Reported", basis: "Dry matter" },
    },
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
