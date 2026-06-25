import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import type { Vehicle } from "../src/models/vehicle";

describe("Vehicle API routes", () => {
  it("returns API status", async () => {
    const response = await request(app).get("/api/status");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("lists all cars", async () => {
    const response = await request(app).get("/api/cars");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("lists cars by make", async () => {
    const response = await request(app).get("/api/cars/make/VOLKSWAGEN");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(
      response.body.every((vehicle: Vehicle) => vehicle.make === "VOLKSWAGEN")
    ).toBe(true);
  });

  it("lists cars by model", async () => {
    const response = await request(app).get("/api/cars/model/GOLF");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(
      response.body.every((vehicle: Vehicle) => vehicle.model.trim() === "GOLF")
    ).toBe(true);
  });

  it("filters cars using query parameters", async () => {
    const response = await request(app)
      .get("/api/cars")
      .query({
        make: "volkswagen",
        model: "golf"
      });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(
      response.body.every((vehicle: Vehicle) =>
        vehicle.make === "VOLKSWAGEN" && vehicle.model.trim() === "GOLF"
      )
    ).toBe(true);
  });

  it("returns 400 for invalid query parameters", async () => {
    const response = await request(app)
      .get("/api/cars")
      .query({ minPrice: "abc" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        message: "minPrice must be a valid number."
      }
    });
  });

  it("returns an empty array when no cars match the make", async () => {
    const response = await request(app).get("/api/cars/make/not-a-real-make");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns 400 when minPrice is greater than maxPrice", async () => {
    const response = await request(app)
      .get("/api/cars")
      .query({ minPrice: "5000", maxPrice: "1000" });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe(
      "Invalid range: minPrice cannot be greater than maxPrice."
    );
  });
});