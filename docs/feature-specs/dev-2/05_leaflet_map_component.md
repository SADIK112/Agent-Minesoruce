Build the real map component for the suppliers screen.

### Component

Create `src/components/minesource/SupplierMap.tsx`. It accepts:

- `suppliers` — `Supplier[]` to display as markers
- `center` — `{ lat: number; lng: number }` for the initial map viewport

### Leaflet SSR Guard

Leaflet accesses `window` at import time and breaks server-side rendering. Guard against this:

- Use `useState(false)` + `useEffect(() => setMounted(true), [])` inside the component
- Only render the Leaflet map container when `mounted` is `true`
- While not mounted, render a grey placeholder div of the same height

### Map Behaviour

- Base tiles from OpenStreetMap (no API key required)
- Initial zoom level shows all Sudbury suppliers in view
- One marker per supplier at their `lat`/`lng` coordinates
- Clicking a marker opens a popup showing: name, address, and a tap-to-call link (`tel:` href) for the phone number

### Constraints

Install `leaflet`, `react-leaflet`, and `@types/leaflet` via npm if not already present. No other map libraries.

Do not show supplier `website` in the marker popup — keep the popup small for mobile tap targets.

### Scope

Only `src/components/minesource/SupplierMap.tsx` is created. Wiring this component into the suppliers screen is covered in feature 06.

### Check When Done

- `SupplierMap.tsx` renders without server-side errors
- Map appears after client hydration
- Each supplier has a marker at the correct coordinates
- Clicking a marker shows name, address, and tap-to-call link
- Grey placeholder renders on server/before mount
