/**
 * AAFCO Dog Food Nutrient Profiles — Adult Maintenance.
 * Dry-matter basis; assumes 4,000 kcal ME/kg DM.
 * For foods >4,000 kcal ME/kg DM, nutrient density adjustment is required.
 * null means no numeric threshold established here, NOT zero.
 * Source: https://www.aafco.org/wp-content/uploads/2023/01/Pet_Food_Report_Annual_2014-Appendix_A-Revised_AAFCO_Nutrient_Profiles-Final_092214.pdf
 * Verify against the current AAFCO Official Publication before compliance claims.
 */
export type AafcoNutrient = {
  id: string;
  label: string;
  category: "Protein & amino acids" | "Fat & fatty acids" | "Minerals" | "Vitamins & other";
  unit: "%" | "mg/kg" | "IU/kg";
  min: number | null;
  max: number | null;
};

export const aafcoAdultMaintenance: readonly AafcoNutrient[] = [
  { id: "protein", label: "Crude protein", category: "Protein & amino acids", unit: "%", min: 18, max: null },
  { id: "arginine", label: "Arginine", category: "Protein & amino acids", unit: "%", min: 0.51, max: null },
  { id: "histidine", label: "Histidine", category: "Protein & amino acids", unit: "%", min: 0.19, max: null },
  { id: "isoleucine", label: "Isoleucine", category: "Protein & amino acids", unit: "%", min: 0.38, max: null },
  { id: "leucine", label: "Leucine", category: "Protein & amino acids", unit: "%", min: 0.68, max: null },
  { id: "lysine", label: "Lysine", category: "Protein & amino acids", unit: "%", min: 0.63, max: null },
  { id: "methionine", label: "Methionine", category: "Protein & amino acids", unit: "%", min: 0.33, max: null },
  { id: "methionineCystine", label: "Methionine + cystine", category: "Protein & amino acids", unit: "%", min: 0.65, max: null },
  { id: "phenylalanine", label: "Phenylalanine", category: "Protein & amino acids", unit: "%", min: 0.45, max: null },
  { id: "phenylalanineTyrosine", label: "Phenylalanine + tyrosine", category: "Protein & amino acids", unit: "%", min: 0.74, max: null },
  { id: "threonine", label: "Threonine", category: "Protein & amino acids", unit: "%", min: 0.48, max: null },
  { id: "tryptophan", label: "Tryptophan", category: "Protein & amino acids", unit: "%", min: 0.16, max: null },
  { id: "valine", label: "Valine", category: "Protein & amino acids", unit: "%", min: 0.49, max: null },
  { id: "fat", label: "Crude fat", category: "Fat & fatty acids", unit: "%", min: 5.5, max: null },
  { id: "linoleicAcid", label: "Linoleic acid", category: "Fat & fatty acids", unit: "%", min: 1.1, max: null },
  { id: "calcium", label: "Calcium", category: "Minerals", unit: "%", min: 0.5, max: 2.5 },
  { id: "phosphorus", label: "Phosphorus", category: "Minerals", unit: "%", min: 0.4, max: 1.6 },
  { id: "potassium", label: "Potassium", category: "Minerals", unit: "%", min: 0.6, max: null },
  { id: "sodium", label: "Sodium", category: "Minerals", unit: "%", min: 0.08, max: null },
  { id: "chloride", label: "Chloride", category: "Minerals", unit: "%", min: 0.12, max: null },
  { id: "magnesium", label: "Magnesium", category: "Minerals", unit: "%", min: 0.06, max: null },
  { id: "iron", label: "Iron", category: "Minerals", unit: "mg/kg", min: 40, max: null },
  { id: "copper", label: "Copper", category: "Minerals", unit: "mg/kg", min: 7.3, max: null },
  { id: "manganese", label: "Manganese", category: "Minerals", unit: "mg/kg", min: 5, max: null },
  { id: "zinc", label: "Zinc", category: "Minerals", unit: "mg/kg", min: 80, max: null },
  { id: "iodine", label: "Iodine", category: "Minerals", unit: "mg/kg", min: 1, max: 11 },
  { id: "selenium", label: "Selenium", category: "Minerals", unit: "mg/kg", min: 0.35, max: 2 },
  { id: "vitaminA", label: "Vitamin A", category: "Vitamins & other", unit: "IU/kg", min: 5000, max: 250000 },
  { id: "vitaminD", label: "Vitamin D", category: "Vitamins & other", unit: "IU/kg", min: 500, max: 3000 },
  { id: "vitaminE", label: "Vitamin E", category: "Vitamins & other", unit: "IU/kg", min: 50, max: null },
  { id: "thiamine", label: "Thiamine (B1)", category: "Vitamins & other", unit: "mg/kg", min: 2.25, max: null },
  { id: "riboflavin", label: "Riboflavin (B2)", category: "Vitamins & other", unit: "mg/kg", min: 5.2, max: null },
  { id: "pantothenicAcid", label: "Pantothenic acid (B5)", category: "Vitamins & other", unit: "mg/kg", min: 12, max: null },
  { id: "niacin", label: "Niacin (B3)", category: "Vitamins & other", unit: "mg/kg", min: 13.6, max: null },
  { id: "pyridoxine", label: "Pyridoxine (B6)", category: "Vitamins & other", unit: "mg/kg", min: 1.5, max: null },
  { id: "folicAcid", label: "Folic acid", category: "Vitamins & other", unit: "mg/kg", min: 0.216, max: null },
  { id: "vitaminB12", label: "Vitamin B12", category: "Vitamins & other", unit: "mg/kg", min: 0.028, max: null },
  { id: "choline", label: "Choline", category: "Vitamins & other", unit: "mg/kg", min: 1360, max: null },
];

// Ratio constraints are distinct from concentration thresholds.
export const aafcoAdultMaintenanceRatios = {
  calciumToPhosphorus: { min: 1, max: 2 },
  aafcoSpecifiedOmega6ToOmega3: { max: 30 },
} as const;

// Adult omega-3 minima (ALA and EPA+DHA) are not determined in this profile.
