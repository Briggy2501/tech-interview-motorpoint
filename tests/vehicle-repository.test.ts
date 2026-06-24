import VehicleRepository from "../src/repositories/vehicle-repository";
import { testVehicles } from "./fixtures/vehicles";

describe("VehicleRepository", () => {
  const repository = new VehicleRepository();

  it("returns all vehicles", () => {
    const vehicles = repository.getAll();

    expect(Array.isArray(vehicles)).toBe(true);
    expect(vehicles.length).toBeGreaterThan(0);
  });

  it("returns vehicles with the expected shape", () => {
    const vehicles = repository.getAll();

    vehicles.forEach((vehicle) => {
      expect(typeof vehicle.price).toBe("number");
      expect(typeof vehicle.make).toBe("string");
      expect(typeof vehicle.model).toBe("string");
      expect(typeof vehicle.trim).toBe("string");
      expect(typeof vehicle.colour).toBe("string");
      expect(typeof vehicle.transmission).toBe("string");
      expect(typeof vehicle.fuel_type).toBe("string");
      expect(typeof vehicle.engine_size).toBe("number");
      expect(typeof vehicle.date_first_reg).toBe("string");
      expect(typeof vehicle.mileage).toBe("number");

      if(vehicle.co2_level !== undefined) {
        expect(typeof vehicle.co2_level).toBe("number");
      }
    });
  });

  it("returns a copy of the vehicle list", () => {
    const vehicles = repository.getAll();
    const originalLength = vehicles.length;

    vehicles.pop();

    expect(repository.getAll()).toHaveLength(originalLength);
  });

  it("matches make case-insensitively without changing returned vehicle data", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.findByMake("Volkswagen");

    expect(result).toHaveLength(2);
    expect(result.every(vehicle => vehicle.make === "VOLKSWAGEN")).toBe(true);
  });
});