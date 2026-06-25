import express, { Express, Request, Response } from "express";
import vehicleRoutes from "./routes/vehicle-routes";

const app: Express = express();

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Vehicle API");
});

app.get("/api/status", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/cars", vehicleRoutes);

export default app;