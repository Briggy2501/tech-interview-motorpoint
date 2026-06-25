import { describe, expect, it } from "@jest/globals";
import VehicleRepository from "../src/repositories/vehicle-repository";
import { testVehicles } from "./fixtures/vehicles";

describe("VehicleRepository data fixture", () => {
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

      if (vehicle.co2_level !== undefined) {
        expect(typeof vehicle.co2_level).toBe("number");
      }
    });
  });
});

describe("VehicleRepository filtering", () => {
  it("matches make case-insensitively without changing returned vehicle data", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.findByMake("Volkswagen");

    expect(result).toHaveLength(2);
    expect(result.every(vehicle => vehicle.make === "VOLKSWAGEN")).toBe(true);
  });

  it("matches model case-insensitively without changing returned vehicle data", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.findByModel("golf");

    expect(result).toHaveLength(1);
    expect(result[0].model).toBe("GOLF");
  });

  it("trims whitespace from make and model filters", () => {
    const repository = new VehicleRepository(testVehicles);

    const resultMake = repository.findByMake("  volkswagen  ");
    const resultModel = repository.findByModel("  golf  ");

    expect(resultMake).toHaveLength(2);
    expect(resultMake.every(vehicle => vehicle.make === "VOLKSWAGEN")).toBe(true);

    expect(resultModel).toHaveLength(1);
    expect(resultModel[0].model).toBe("GOLF");
  });

  it("returns all vehicles when no filters are provided", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.find();

    expect(result).toHaveLength(testVehicles.length);
  });

  it("returns all vehicles when filters are empty", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.find({});

    expect(result).toHaveLength(testVehicles.length);
  });

  it("returns vehicles that are within the specified price range", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.find({ minPrice: 1000, maxPrice: 5000 });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(vehicle => vehicle.price >= 1000 && vehicle.price <= 5000)).toBe(true);
  });

  it("returns vehicles that are within the specified engine size range", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.find({ minEngineSize: 1000, maxEngineSize: 2000 });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(vehicle => vehicle.engine_size >= 1000 && vehicle.engine_size <= 2000)).toBe(true);
  });

  it("returns vehicles that have mileage less than or equal to the specified maximum", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.find({ maxMileage: 50000 });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(vehicle => vehicle.mileage <= 50000)).toBe(true);
  });

  it("returns vehicles that have CO2 level less than or equal to the specified maximum", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.find({ maxCO2Level: 120 });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(vehicle => vehicle.co2_level !== undefined && vehicle.co2_level <= 120)).toBe(true);
  });

  it("returns a defensive copy of the vehicles when using getAll", () => {
    const repository = new VehicleRepository(testVehicles);

    const vehicles = repository.getAll();
    vehicles.pop();

    const vehiclesAfterModification = repository.getAll();

    expect(vehiclesAfterModification).toHaveLength(testVehicles.length);
  });

  it("returns vehicles matching multiple filters", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.find({
      make: "volkswagen",
      model: "golf"
    });

    expect(result).toHaveLength(1);
    expect(result[0].make).toBe("VOLKSWAGEN");
    expect(result[0].model).toBe("GOLF");
  });

  it("returns an empty array when no vehicles match the filters", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.findByMake("not-a-real-make");

    expect(result).toEqual([]);
  });

  it("returns vehicles registered within the specified date range", () => {
    const repository = new VehicleRepository(testVehicles);

    const result = repository.find({
      dateFirstRegFrom: "2010-01-01",
      dateFirstRegTo: "2015-12-31"
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result.every(vehicle => {
      const [day, month, year] = vehicle.date_first_reg.split("/").map(Number);
      const regDate = new Date(year, month - 1, day);

      return regDate >= new Date("2010-01-01") && regDate <= new Date("2015-12-31");
    })).toBe(true);
  });
});