export type VehicleFilters = {
  make?: string;
  model?: string;
  trim?: string;
  colour?: string;
  transmission?: string;
  fuelType?: string;

  minPrice?: number;
  maxPrice?: number;

  minEngineSize?: number;
  maxEngineSize?: number;

  maxMileage?: number;
  maxCO2Level?: number;

  dateFirstRegFrom?: string;
  dateFirstRegTo?: string;
};