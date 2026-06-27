Create the fault-to-parts mapping data file.

### Data File

Create `src/data/failure_to_parts.json` with 10 LHD hydraulic fault entries.

Each entry contains:

- `faultKey` — short kebab-case identifier matching what the agent returns in `DiagnosisResult.faults[].key`
- `description` — one plain-language sentence describing the fault
- `primaryParts` — array of part category strings, directly required to fix this fault
- `relatedParts` — array of part category strings, commonly needed alongside primary parts

### Fault Keys

The 10 fault keys should cover common LHD hydraulic failures:

- `hose-burst` — high-pressure hose failure
- `pump-failure` — main hydraulic pump
- `cylinder-leak` — lift cylinder seal failure
- `steering-loss` — steering circuit fault
- `low-pressure` — system-wide low pressure
- `contamination` — fluid contamination
- `valve-stuck` — control valve malfunction
- `filter-blocked` — return or pressure filter
- `brake-fade` — hydraulic brake system
- `cooling-fault` — hydraulic oil overheating

### Part Category Rules

Part names are descriptive strings only. No OEM part numbers, no SKUs, no prices.

Valid: `"High-pressure hydraulic hose assembly (2-inch bore)"` 
Invalid: `"Cat 7X-2536"` or `"$142.00 each"`

### Scope

This feature only creates the JSON file. No API route, no tool function, no schema validation.

### Check When Done

- `src/data/failure_to_parts.json` exists with 10 fault entries
- Every entry has `faultKey`, `description`, `primaryParts`, `relatedParts`
- `faultKey` values match the 10 keys listed above
- No OEM part numbers, SKUs, or prices appear anywhere in the file
