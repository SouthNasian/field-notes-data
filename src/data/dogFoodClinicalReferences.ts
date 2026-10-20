/**
 * Small Animal Clinical Nutrition, 5th ed., chapter 13,
 * "Feeding Young Adult Dogs: Before Middle Age", Table 13-3 (p. 261).
 * Recommended food levels, NOT AAFCO regulatory thresholds or toxicity limits.
 * Nutrient concentrations are dry-matter values; energy density is kcal ME/g DM.
 * Assumes 4.0 kcal/g food; adjust when food energy density differs.
 */
export type AdultCondition = "normal" | "inactive";
export type ClinicalRange = { min: number | null; max: number | null; unit: "%" | "mg/kg" | "IU/kg" | "kcal/g" };
export const dogFoodClinicalReferences: Record<AdultCondition, Record<string, ClinicalRange>> = {
  normal: {
    protein: { min: 15, max: 30, unit: "%" },
    fat: { min: 10, max: 20, unit: "%" },
    fiber: { min: null, max: 5, unit: "%" },
    phosphorus: { min: 0.4, max: 0.8, unit: "%" },
    sodium: { min: 0.2, max: 0.4, unit: "%" },
    selenium: { min: 0.5, max: 1.3, unit: "mg/kg" },
    vitaminE: { min: 400, max: null, unit: "IU/kg" },
    vitaminC: { min: 100, max: null, unit: "mg/kg" },
    energyDensity: { min: 3.5, max: 4.5, unit: "kcal/g" },
  },
  inactive: {
    protein: { min: 15, max: 30, unit: "%" },
    fat: { min: 7, max: 10, unit: "%" },
    fiber: { min: 10, max: null, unit: "%" },
    phosphorus: { min: 0.4, max: 0.8, unit: "%" },
    sodium: { min: 0.2, max: 0.4, unit: "%" },
    selenium: { min: 0.5, max: 1.3, unit: "mg/kg" },
    vitaminE: { min: 400, max: null, unit: "IU/kg" },
    vitaminC: { min: 100, max: null, unit: "mg/kg" },
    energyDensity: { min: 3.0, max: 3.5, unit: "kcal/g" },
  },
};
