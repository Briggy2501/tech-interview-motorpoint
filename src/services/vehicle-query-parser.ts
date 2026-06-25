import { VehicleFilters } from "../models/vehicle-filters";

type QueryParams = Record<string, unknown>;

export function parseVehicleFilters(query: QueryParams): VehicleFilters {
  const filters: VehicleFilters = {};

  filters.make = getString(query.make, "make");
  filters.model = getString(query.model, "model");
  filters.trim = getString(query.trim, "trim");
  filters.colour = getString(query.colour, "colour");
  filters.transmission = getString(query.transmission, "transmission");
  filters.fuelType = getString(query.fuelType, "fuelType");

  filters.minPrice = getPositiveNumber(query.minPrice, "minPrice");
  filters.maxPrice = getPositiveNumber(query.maxPrice, "maxPrice");

  filters.minEngineSize = getPositiveNumber(query.minEngineSize, "minEngineSize");
  filters.maxEngineSize = getPositiveNumber(query.maxEngineSize, "maxEngineSize");

  filters.maxMileage = getPositiveNumber(query.maxMileage, "maxMileage");
  filters.maxCO2Level = getPositiveNumber(query.maxCO2Level, "maxCO2Level");

  filters.dateFirstRegFrom = getDateString(query.dateFirstRegFrom, "dateFirstRegFrom");
  filters.dateFirstRegTo = getDateString(query.dateFirstRegTo, "dateFirstRegTo");

  validateRange(filters.minPrice, filters.maxPrice, "minPrice", "maxPrice");
  validateRange(filters.minEngineSize, filters.maxEngineSize, "minEngineSize", "maxEngineSize");
  validateDateRange(filters.dateFirstRegFrom, filters.dateFirstRegTo);

  return removeUndefinedValues(filters);
}

function getString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    value = value[0];
  }

  if (typeof value !== "string") {
    throw new Error(`Invalid query parameter value for ${fieldName}. Expected a string.`);
  }

  const trimmed = value.trim();

  return trimmed || undefined;
}

function getNumber(value: unknown, fieldName: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (Array.isArray(value)) {
    value = value[0];
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a valid number.`);
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }
  
  return parsed;
}

function getPositiveNumber(value: unknown, fieldName: string): number | undefined {
  const number = getNumber(value, fieldName);

  if (number !== undefined && number < 0) {
    throw new Error(`${fieldName} cannot be negative.`);
  }

  return number;
}

function getDateString(value: unknown, fieldName: string): string | undefined {
  const dateString = getString(value, fieldName);

  if (!dateString) {
    return undefined;
  }

  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoDatePattern.test(dateString)) {
    throw new Error(`${fieldName} must use YYYY-MM-DD format.`);
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date for ${fieldName}.`);
  }

  return dateString;
}

function validateRange(
  min: number | undefined,
  max: number | undefined,
  minName: string,
  maxName: string,
): void {
  if (min !== undefined && max !== undefined && min > max) {
    throw new Error(`Invalid range: ${minName} cannot be greater than ${maxName}.`);
  }
}

function validateDateRange(from?: string, to?: string): void {
  if (!from || !to) {
    return;
  }

  if (new Date(from) > new Date(to)) {
    throw new Error("Invalid date range: dateFirstRegFrom cannot be later than dateFirstRegTo.");
  }
}

function removeUndefinedValues(filters: VehicleFilters): VehicleFilters {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined)
  ) as VehicleFilters;
}