import { Router, Request, Response } from "express";
import VehicleRepository from "../repositories/vehicle-repository";
import { parseVehicleFilters } from "../services/vehicle-query-parser";

const router = Router();
const vehicleRepository = new VehicleRepository();

router.get("/", (req: Request, res: Response) => {
  try {
    const filters = parseVehicleFilters(req.query);
    const vehicles = vehicleRepository.find(filters);

    res.json(vehicles);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid query parameters.";

    res.status(400).json({ 
      error: {
        message,
      } 
    });
  }
});

router.get("/make/:make", (req: Request, res: Response) => {
  const vehicles = vehicleRepository.findByMake(req.params.make);

  res.json(vehicles);
});

router.get("/model/:model", (req: Request, res: Response) => {
  const vehicles = vehicleRepository.findByModel(req.params.model);

  res.json(vehicles);
});

export default router;