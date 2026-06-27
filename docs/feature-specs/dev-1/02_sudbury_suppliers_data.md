Create the Sudbury supplier data file.

### Data File

Create `src/data/sudbury_suppliers.json` with 8–10 real Sudbury businesses that supply hydraulic and heavy equipment parts.

Each entry contains:

- `id` — short kebab-case string, unique
- `name` — business name as it appears publicly
- `address` — full street address in Sudbury, Ontario
- `phone` — real public phone number
- `website` — real public website URL
- `lat` / `lng` — coordinates matching the business address
- `categories` — array of part category strings this supplier stocks

All phone numbers, addresses, and websites must be real, publicly listed information. No made-up businesses.

### Categories

Category strings in each supplier's `categories` array must be plain descriptive phrases only — no OEM part numbers, no SKUs, no prices.

Examples of valid category values:
- `"High-pressure hydraulic hose assembly"`
- `"Hydraulic pump and motor rebuild"`
- `"Heavy equipment filters"`

### Scope

This feature only creates the JSON file. No API route, no tool function, no schema validation.

### Check When Done

- `src/data/sudbury_suppliers.json` exists with 8–10 entries
- Every entry has all required fields (id, name, address, phone, website, lat, lng, categories)
- All phone numbers and addresses are real and publicly listed
- No prices or OEM part numbers appear anywhere in the file
- Coordinates are within the Sudbury, Ontario area
