export interface CapacityResult {
  maximumCapacityKg: number;
  loadedWeightKg: number;
  remainingCapacityKg: number;
  utilizationPercentage: number;
  isOverloaded: boolean;
}

export function calculateCapacity(
  maximumCapacityKg: number,
  loadedWeightKg: number
): CapacityResult {
  const safeCapacity = Math.max(0, maximumCapacityKg);
  const safeLoad = Math.max(0, loadedWeightKg);

  const remainingCapacityKg = safeCapacity - safeLoad;

  const utilizationPercentage =
    safeCapacity > 0
      ? (safeLoad / safeCapacity) * 100
      : 0;

  return {
    maximumCapacityKg: safeCapacity,
    loadedWeightKg: safeLoad,
    remainingCapacityKg,
    utilizationPercentage,
    isOverloaded: safeLoad > safeCapacity,
  };
}