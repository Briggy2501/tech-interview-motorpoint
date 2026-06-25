# Motorpoint Vehicle API Technical Test

This project is a TypeScript/Express API for searching vehicle data from the provided JSON dataset.

The task required:

* Add the remaining fields to the vehicle model
* Implement an endpoint for listing all cars
* Implement endpoints for listing cars by make and model
* Add any other useful/relevant endpoints
* Consider error handling and unit tests

## Getting started

Install dependencies:

```bash
npm install
```

Run the project in development mode:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run the compiled app:

```bash
npm start
```

Run tests:

```bash
npm test
```

By default, the API runs at:

```txt
http://localhost:3000
```

## Endpoints

### Status

```txt
GET /api/status
```

Returns a simple status response to confirm the API is running.

Example response:

```json
{
  "status": "ok"
}
```

### List all cars

```txt
GET /api/cars
```

Returns all vehicles in the supplied dataset.

### Filter cars

```txt
GET /api/cars?make=volkswagen&model=golf
```

The `/api/cars` endpoint supports optional query parameters:

```txt
make
model
trim
colour
transmission
fuelType
minPrice
maxPrice
minEngineSize
maxEngineSize
maxMileage
maxCO2Level
dateFirstRegFrom
dateFirstRegTo
```

Numeric filters must be valid non-negative numbers.

Date filters should use `YYYY-MM-DD` format.

Example:

```txt
GET /api/cars?make=volkswagen&model=golf&minPrice=1000&maxPrice=5000
```

### List cars by make

```txt
GET /api/cars/make/:make
```

Example:

```txt
GET /api/cars/make/VOLKSWAGEN
```

### List cars by model

```txt
GET /api/cars/model/:model
```

Example:

```txt
GET /api/cars/model/GOLF
```

## Error handling

Invalid query parameters return a `400` response.

Example:

```txt
GET /api/cars?minPrice=abc
```

Response:

```json
{
  "error": {
    "message": "minPrice must be a valid number."
  }
}
```

List/search endpoints return an empty array when no vehicles match the request. For example:

```txt
GET /api/cars/make/not-a-real-make
```

returns:

```json
[]
```

## Project setup changes

I made a small restructuring pass before implementing the API logic.

The original project had `index.ts` and the repository folder at the root level. I moved the application code into `src/` so the compiled output could be separated cleanly into `dist/`.

The `package.json` scripts were updated to support the expected development/build/test flow:

```bash
npm run dev
npm run build
npm start
npm test
```

The TypeScript config was also updated with:

* `rootDir` and `outDir`, so source and compiled files are separated
* `resolveJsonModule`, so the supplied `vehicles.json` file can be imported directly
* `skipLibCheck`, to avoid type-checking dependency declaration files
* JSON included in the TypeScript project so the vehicle fixture is copied into the compiled output

## Approach

I kept the structure deliberately small, but separated the main responsibilities so the project did not grow out of a single `index.ts` file.

The new structure:

```txt
src/
  app.ts
  index.ts
  models/
  repositories/
  routes/
  services/
```

`index.ts` is responsible for starting the server.

`app.ts` configures the Express app and mounts routes.

`routes/vehicle-routes.ts` handles HTTP endpoints.

`services/vehicle-query-parser.ts` converts raw query parameters into typed vehicle filters and validates invalid input.

`repositories/vehicle-repository.ts` handles access to the vehicle data and contains the search/filtering behaviour.

The provided `vehicles.json` file is treated as a static data source for this task. It is imported by the repository rather than read manually with `fs`, which avoids fragile relative file paths and keeps the implementation simple.

The rest of the application accesses vehicle data through repository methods rather than reading the JSON directly. In a larger application, this repository layer could be replaced with a database, CMS, or external vehicle inventory service without changing the route layer.

The repository also accepts vehicle data via its constructor, defaulting to the provided JSON fixture. This allows the application to use the supplied dataset while keeping the repository easy to unit test with smaller controlled datasets.

## Filtering behaviour

Make, model, trim, colour, transmission and fuel type filters are matched case-insensitively and ignore surrounding whitespace.

The repository exposes specific methods for the required make/model behaviours:

```txt
findByMake
findByModel
```

It also exposes a generic typed filter method:

```txt
find(filters)
```

This avoids adding a separate repository method for every possible filter and makes the search functionality easier to extend.

## Date handling

The provided vehicle data stores registration dates in `DD/MM/YYYY` format.

For API query parameters, date filters use `YYYY-MM-DD` format to avoid ambiguity.

The repository explicitly parses the vehicle data format rather than relying on JavaScript's built-in date parsing for `DD/MM/YYYY` strings.

## Testing

The project uses Jest for tests.

The test coverage includes:

* validating that the provided JSON data matches the expected vehicle model shape
* repository filtering behaviour
* case-insensitive make/model matching
* trimming whitespace from filters
* numeric range filtering
* optional `co2_level` handling
* date range filtering
* query parameter parsing and validation
* API route behaviour using Supertest

Run tests with:

```bash
npm test
```

## Assumptions

* The provided JSON file is treated as the source of truth for this task.
* List/search endpoints return `200` with an empty array when no vehicles match.
* Query date inputs use `YYYY-MM-DD`.
* Vehicle registration dates in the source data are stored as `DD/MM/YYYY`.
* Filters are single-value filters. If the same query parameter is supplied multiple times, the first value is used.
