import { describe, expect, it } from "@jest/globals";
import { parseVehicleFilters } from "../src/services/vehicle-query-parser";

describe("parseVehicleFilters", () => {
  it("parses string and numeric query parameters into vehicle filters", () => {
    const result = parseVehicleFilters({
      make: " Volkswagen ",
      model: "Golf",
      minPrice: "1000",
      maxPrice: "5000",
      maxMileage: "50000",
      dateFirstRegFrom: "2010-01-01",
      dateFirstRegTo: "2015-12-31"
    });

    expect(result).toEqual({
      make: "Volkswagen",
      model: "Golf",
      minPrice: 1000,
      maxPrice: 5000,
      maxMileage: 50000,
      dateFirstRegFrom: "2010-01-01",
      dateFirstRegTo: "2015-12-31"
    });
  });

  it("removes empty and undefined values from the returned filters", () => {
    const result = parseVehicleFilters({
      make: "   ",
      model: undefined,
      minPrice: ""
    });

    expect(result).toEqual({});
  });

  it("throws when a numeric filter is invalid", () => {
    expect(() => parseVehicleFilters({ minPrice: "abc" }))
      .toThrow("minPrice must be a valid number.");
  });

  it("throws when a numeric filter is negative", () => {
    expect(() => parseVehicleFilters({ maxMileage: "-1" }))
      .toThrow("maxMileage cannot be negative.");
  });

  it("throws when minPrice is greater than maxPrice", () => {
    expect(() => parseVehicleFilters({ minPrice: "5000", maxPrice: "1000" }))
      .toThrow("Invalid range: minPrice cannot be greater than maxPrice.");
  });

  it("throws when minEngineSize is greater than maxEngineSize", () => {
    expect(() => parseVehicleFilters({ minEngineSize: "2000", maxEngineSize: "1000" }))
      .toThrow("Invalid range: minEngineSize cannot be greater than maxEngineSize.");
  });

  it("throws when date filters are not ISO formatted", () => {
    expect(() => parseVehicleFilters({ dateFirstRegFrom: "31/12/2015" }))
      .toThrow("dateFirstRegFrom must use YYYY-MM-DD format.");
  });

  it("throws when dateFirstRegFrom is later than dateFirstRegTo", () => {
    expect(() => parseVehicleFilters({
      dateFirstRegFrom: "2016-01-01",
      dateFirstRegTo: "2015-01-01"
    })).toThrow("Invalid date range");
  });

  it("parses additional string filters", () => {
    const result = parseVehicleFilters({
      trim: " 1.4 SEL 5dr ",
      colour: " Grey ",
      transmission: " Manual ",
      fuelType: " Unleaded "
    });

    expect(result).toEqual({
      trim: "1.4 SEL 5dr",
      colour: "Grey",
      transmission: "Manual",
      fuelType: "Unleaded"
    });
  });

  it("parses additional numeric filters", () => {
    const result = parseVehicleFilters({
      minEngineSize: "1000",
      maxEngineSize: "2000",
      maxCO2Level: "120"
    });

    expect(result).toEqual({
      minEngineSize: 1000,
      maxEngineSize: 2000,
      maxCO2Level: 120
    });
  });
});