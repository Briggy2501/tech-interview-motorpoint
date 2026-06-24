import vehicles from "./vehicles.json";
import { Vehicle } from "../models/vehicle";
import { VehicleFilters } from "../models/vehicle-filters";

class VehicleRepository {
  private readonly vehicles: Vehicle[];

  constructor(vehicleData: Vehicle[] = vehicles as Vehicle[]) {
    this.vehicles = [...vehicleData];
  }

  getAll(): Vehicle[] {
    return [...this.vehicles];
  }

  findByMake(make: string): Vehicle[] {
    return this.find({ make });
  }

  findByModel(model: string): Vehicle[] {
    return this.find({ model });
  }

  find(filters: VehicleFilters = {}): Vehicle[] {
    return this.vehicles.filter((vehicle) => {
      return (
        this.matchesText(vehicle.make, filters.make) &&
        this.matchesText(vehicle.model, filters.model) &&
        this.matchesText(vehicle.trim, filters.trim) &&
        this.matchesText(vehicle.colour, filters.colour) &&
        this.matchesText(vehicle.transmission, filters.transmission) &&
        this.matchesText(vehicle.fuel_type, filters.fuelType) &&
        this.isInRange(vehicle.price, filters.minPrice, filters.maxPrice) &&
        this.isInRange(vehicle.engine_size, filters.minEngineSize, filters.maxEngineSize) &&
        this.isBelowOrEqual(vehicle.mileage, filters.maxMileage) &&
        this.isBelowOrEqual(vehicle.co2_level, filters.maxCO2Level) &&
        this.isDateInRange(vehicle.date_first_reg, filters.dateFirstRegFrom, filters.dateFirstRegTo)
      );
    });
  }

  private matchesText(actual: string, expected?: string): boolean {
    if (expected == undefined) {
      return true;
    }

    const normalizedExpected = this.normalizeString(expected);

    if (!normalizedExpected) {
      return true;
    }

    return this.normalizeString(actual) === normalizedExpected;
  }

  private normalizeString(value: string): string {
    return value.trim().toLowerCase();
  }

  private isInRange(value: number, min?: number, max?: number): boolean {
    if (min !== undefined && value < min) {
      return false;
    }

    if (max !== undefined && value > max) {
      return false;
    }

    return true;
  }

  private isBelowOrEqual(value: number | undefined, max?: number): boolean {
    if (max === undefined) {
      return true;
    }

    return value !== undefined && value <= max;
  }

  private isDateInRange(value: string, from?: string, to?: string): boolean {
    if (!from && !to) {
      return true;
    }

    const date = new Date(value);

    if (from && date < new Date(from)) {
      return false;
    }

    if (to && date > new Date(to)) {
      return false;
    }

    return true;
  }
}

export default VehicleRepository;
