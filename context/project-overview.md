# Agent MineSource — Project Overview

## What It Is

Agent MineSource is a mobile-first web wizard that helps underground mine maintenance staff in Northern Ontario go from a plain-language breakdown report to a likely AI diagnosis, a parts checklist, and nearby Sudbury supplier contacts — all in under two minutes.

## Who It's For

A maintenance worker or shift supervisor at an underground mine near Sudbury, Ontario. Often on a phone or tablet, sometimes with gloves, sometimes underground with patchy signal. The UI is built for that environment: large tap targets, plain language, minimal typing.

## The Flow

Five screens, linear progression:

1. **Landing** — entry point, one CTA to start a report
2. **Report** — describe the breakdown, pick severity and location
3. **Diagnosis** — AI agent returns likely faults, confidence scores, safety flags
4. **Parts** — checklist of part categories split into primary and related tiers
5. **Suppliers** — ranked Sudbury suppliers on a real map with tap-to-call

## Current State

The frontend prototype is complete — all five screens exist with mock/hardcoded data. No backend exists yet. The goal of this build is to replace every hardcoded value with real data flowing through real API routes backed by an AI agent.

## MVP Scope

- Equipment: LHD (Load-Haul-Dump) only
- Subsystem: Hydraulics only
- Data: Public sources only — no OEM catalogs, no live prices, no SKUs
- No auth, no database, no persistence beyond sessionStorage

## Explicit Exclusions

- User accounts or login
- Photo upload or vision-based diagnosis
- Live pricing or OEM part number lookup
- Equipment types beyond LHD
- Subsystems beyond hydraulics
- Multi-agent architecture
- Real-time vector database
- CMMS or ERP integration

## Team

- **Mine Agents** — hackathon team
- **Dev 1** — owns backend: data files, agent tools, API routes, orchestrator
- **Dev 2** — owns frontend: store, API wiring, Leaflet map, screen connections

## Success Criteria

- All three demo scenarios complete the five-screen wizard without errors
- The "unsafe brakes" scenario triggers the red stop-work banner
- Suppliers appear on a real OpenStreetMap map with real Sudbury businesses
- Parts list reflects the diagnosed fault type, not a hardcoded fallback
- Demo works on bad Wi-Fi — fallback activates silently, no broken UI
- No prices shown anywhere
- No OEM part numbers shown anywhere
