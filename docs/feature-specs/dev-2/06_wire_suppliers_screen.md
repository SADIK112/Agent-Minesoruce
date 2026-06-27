Wire the suppliers screen to the real API and Leaflet map.

### Geolocation

On mount, call `navigator.geolocation.getCurrentPosition`. On success, store the coordinates in local component state. On denial or timeout, default silently to Sudbury city centre (`46.4917, -80.9930`). Never prompt the user about location or show an error message about geolocation.

### API Call

Once coordinates are known (or defaulted), call `GET /api/suppliers` through `src/lib/api.ts` with:
- `categories` derived from `parts.primaryParts` in the MineSource store (the categories used for matching)
- `lat` and `lng` from the geolocation step

Call `setScreenStatus("suppliers", "loading")` before the request. On success, call `setSuppliers(result)`. On failure, retry once. If the second attempt also fails, call `setSuppliers([])` and show an empty state message with a retry button.

### Loading State

While `screenStatus.suppliers === "loading"`, show a placeholder grey rectangle at map height and three skeleton rows for the supplier list below it.

### Result Rendering

When `suppliers` is set in the store:

**Map** — render `SupplierMap` from feature 05 with the suppliers list and the user's coordinates as centre.

**Supplier list** — below the map, render a vertical list of supplier cards. Each card shows: name, address, and a tap-to-call button (`tel:` href). Cards are ordered by distance (nearest first, as returned by the API).

### Scope

Only `src/routes/suppliers.tsx` and `src/lib/api.ts` are modified. The Leaflet map component (feature 05) must be in place before this screen is wired.

### Check When Done

- Geolocation is attempted on mount; Sudbury default used silently on failure
- API is called with parts categories from the store
- Loading placeholders render at correct heights
- `SupplierMap` renders with correct markers
- Supplier cards appear below the map, ordered nearest-first
- Tap-to-call links work on mobile
