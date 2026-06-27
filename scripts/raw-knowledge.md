# LHD Hydraulic System — Maintenance Knowledge Base

## Overview of LHD Hydraulic Systems

A Load-Haul-Dump (LHD) machine is a rubber-tyred underground loader used to scoop broken ore from a drawpoint, haul it to an orepass, and dump it. The hydraulic system powers the boom, bucket, steering, and brakes. All four functions share a common reservoir and pump in most designs, with separate circuits for steering and braking to meet safety requirements. System operating pressure typically runs between 200 and 350 bar depending on manufacturer and machine size. The hydraulic oil reservoir is mounted at the rear of the machine and holds between 100 and 300 litres. Oil is drawn through a suction strainer, pressurised by the main gear or piston pump, distributed through directional control valves to the work cylinders and steering circuit, and returned through the return line filter back to the reservoir.

Hydraulic oil cleanliness is the single most important factor in system longevity. Most LHD hydraulic failures are caused or accelerated by contaminated oil. Target cleanliness is ISO 4406 class 16/14/11 or better. Contamination enters the system through worn seals, degraded breather filters, improper fluid top-up practices, and hose replacement work done without capping open ports. Underground environments are particularly harsh — rock dust, water, and blast fumes all accelerate contamination. Regular oil sampling and analysis is the most effective early warning system available.

---

## Hose Burst and Fitting Failures

### faultKey: hose-burst

A hydraulic hose burst is the most common LHD hydraulic failure in underground mining. High-pressure hoses carry oil at 200–350 bar and are subjected to mechanical abrasion from rock, repeated flexing, heat cycling, and chemical attack from mine water. A burst hose produces a sudden, loud report followed by immediate loss of pressure in the affected circuit. If the boom or bucket circuit loses pressure, the bucket will drop. If the return line bursts, oil floods the machine compartment. The risk of fire is real if pressurised oil contacts hot exhaust surfaces — this makes a hose burst a potential safety event that must be assessed before the mechanic approaches the machine.

Symptoms of an imminent hose failure include visible cracking or weathering of the outer cover, pinhole weeping at fittings or mid-hose, blistering or soft spots in the hose wall, and oil staining on surrounding surfaces. Operators should report any weeping hose immediately — a weeping hose becomes a burst hose under load.

When replacing a burst hose, the replacement must match the original in bore size, pressure rating, and end fitting type. Using an undersized bore increases velocity and heat. Using a lower pressure rating creates an immediate re-burst risk. Both open ends must be capped immediately after disconnection to prevent contamination ingress. The system should be depressurised before work begins by lowering the bucket to the ground and cycling the controls several times with the engine off.

Fitting blowouts are distinct from mid-hose bursts. A fitting separates from the hose body, usually due to improper crimping, wrong ferrule size, or corrosion of the fitting body. The fitting should be inspected for thread damage and replaced rather than re-crimped onto the same hose end.

---

## Hydraulic Pump Failure

### faultKey: pump-failure

The main hydraulic pump on an LHD is typically a gear pump or an axial piston pump driven directly from the engine through a power take-off or transfer gearbox. Gear pumps are simpler and more tolerant of contaminated oil. Piston pumps produce higher pressure and flow but are sensitive to fluid cleanliness and require careful priming on startup.

Early signs of pump wear include gradual reduction in boom and bucket speed, difficulty achieving full system pressure under load, increased cycle times, and unusual noise — a whining or cavitation noise that changes with engine speed. A cavitating pump is drawing air into the inlet, which accelerates wear and can destroy the pump in minutes if not corrected. Common causes of cavitation are a blocked suction strainer, a collapsed suction hose, low fluid level, or oil too viscous for the ambient temperature.

Internal pump wear produces metal particles that circulate through the system. Once a pump begins shedding particles, the entire hydraulic system is at risk. The return line filter will catch the largest particles but fine particles bypass the filter and score valve spools and cylinder bores. When replacing a failed pump, the system must be fully flushed, all filters replaced, and the oil sampled after a short run to confirm particle counts have returned to acceptable levels before returning the machine to service.

Pump shaft seal failure is common on older machines and presents as oil weeping from the pump body where the drive shaft exits. A weeping shaft seal will worsen rapidly under pressure and should be replaced promptly. The seal can often be replaced without removing the pump from the machine.

---

## Hydraulic Cylinder Seal Failure

### faultKey: cylinder-leak

LHD lift and tilt cylinders operate the boom and bucket. They are double-acting cylinders — oil pressure drives the piston in both directions. The rod seals prevent oil from escaping along the cylinder rod as it extends and retracts. Wiper seals remove dirt from the rod before it re-enters the cylinder body. Both rod seals and wiper seals are wear items that require periodic replacement.

External oil weeping along the cylinder rod is the primary symptom of rod seal failure. A small amount of oil film on the rod is normal and provides lubrication. Continuous dripping, pooling under the cylinder, or oil streaks running down the machine side indicate seal failure that requires immediate attention. A leaking cylinder will also cause the boom or bucket to drift slowly under gravity even with the controls in neutral — called cylinder drift — which is a safety issue if the bucket is elevated.

A scored or pitted cylinder rod is the most common cause of rapid seal failure. Rod scoring happens when the machine operates with a failed wiper seal and rock dust or grit is drawn across the rod surface. Once scored, the rod will destroy replacement seals within hours. The rod must be assessed before seal replacement — minor scoring can be polished, but deep scoring requires rod replacement or chrome replating. BBT Machining in Sudbury offers hydraulic cylinder rod chrome repair services.

Cylinder end cap seals and port O-rings also fail, though less frequently than rod seals. An end cap leak presents as oil weeping from the base of the cylinder where the end cap is threaded or bolted on.

---

## Steering System Failure

### faultKey: steering-loss

Loss of hydraulic steering on an LHD underground is immediately safety-critical. The machine cannot be steered and must be stopped immediately. The machine should not be moved until the fault is diagnosed and corrected or until a tow is arranged. Attempting to operate an LHD with compromised steering underground puts the operator, the machine, and other personnel at serious risk.

LHD steering is typically a hydrostatic system with an orbitrol (hydraulic steering control unit) that sends oil to a double-acting steering cylinder mounted at the articulation joint. The orbitrol is a priority valve — it takes flow from the main pump before any other circuit, which means partial pump failure will affect boom and bucket before it affects steering.

Common causes of steering loss include orbitrol valve failure, a burst hose in the steering circuit, steering cylinder seal failure, or loss of main pump pressure severe enough to starve the steering circuit. The first diagnostic step is to check if the boom and bucket also lack pressure — if they do, the fault is upstream in the pump or main supply. If only steering is affected, the fault is in the steering circuit itself.

The orbitrol valve is a precision component and is not serviceable in the field. A failed orbitrol must be replaced as a unit. Steering cylinder seal failure presents identically to boom cylinder seal failure — oil weeping along the rod and cylinder drift. The steering cylinder is physically smaller than the boom cylinders but the seals are replaced using the same process.

---

## Low System Pressure

### faultKey: low-pressure

System-wide low pressure causes all hydraulic functions to be slow or weak simultaneously — slow boom lift, slow bucket curl, sluggish steering response. This distinguishes low pressure from a single-circuit fault like a stuck valve or a leaking cylinder, where other circuits function normally.

The most common causes of system-wide low pressure are a worn main pump unable to maintain flow against system resistance, a pressure relief valve stuck open or set too low, and severely restricted flow through a blocked filter causing high backpressure. A worn pump is the most frequent cause on high-hour machines.

To distinguish pump wear from a relief valve fault, measure system pressure at the test port near the main pump outlet with the machine under load. If pressure is low at this point, the pump is not generating adequate flow. If pressure is normal at the pump outlet but low elsewhere, the fault is downstream — likely a partially stuck directional control valve or an internal bypass in a cylinder.

The system pressure relief valve is a cartridge valve that limits maximum system pressure to protect hoses and components from overpressure. If the cartridge seat is worn or contaminated with debris, it may crack open at below-normal pressure, dumping flow to tank and reducing available pressure across the whole system. Cleaning or replacing the relief valve cartridge is a low-cost first step when diagnosing low pressure on a machine where pump hours are not excessive.

---

## Fluid Contamination

### faultKey: contamination

Hydraulic fluid contamination is the root cause of more than 70% of hydraulic system failures by industry estimates. In underground mining, the contamination risk is amplified by the presence of blast fumes, rock dust, mine water, and the difficulty of maintaining clean work practices in a confined underground environment.

Water contamination is detected by a milky or foamy appearance to the reservoir oil. Water enters through condensation in the reservoir breather, damaged reservoir seals, or coolant leaks from a hydraulic oil cooler that also cools engine coolant. Water in the oil causes corrosion of cylinder bores and valve bores, accelerates seal degradation, and reduces the load-carrying capacity of the oil film on bearings and gear teeth.

Particle contamination from wear metals, rock dust, and weld slag is invisible to the naked eye but detectable by oil analysis. A sudden spike in iron, copper, or silicon particle counts indicates active component wear or ingress of external contamination. The only effective response is to identify the contamination source, flush the system, replace all filters, and refill with clean fluid of the correct specification.

Cross-contamination with wrong fluid type is a serious risk on sites that use both hydraulic oil and biodegradable hydraulic fluids. Mixing fluid types causes seal swelling or shrinkage and can break down the additive packages in both fluids. The system must be fully flushed if wrong fluid is introduced.

The reservoir breather filter is the most overlooked maintenance item on LHD hydraulic systems. A blocked or missing breather forces the reservoir to draw air through seals and joints, pulling contamination in. The breather should be replaced on the same schedule as the return line filter.

---

## Control Valve Malfunction

### faultKey: valve-stuck

Directional control valves route pressurised oil to the correct side of each cylinder. On an LHD, separate valve sections control the boom lift, bucket tilt, and auxiliary circuits. Each section contains a spool — a precision-machined cylindrical slide — that shifts to connect ports when the operator moves the control lever. Valve spools are machined to clearances of a few micrometres and are extremely sensitive to contamination.

A valve spool stuck in the open position causes the associated cylinder to creep continuously in one direction even with the control lever in neutral. A spool stuck in the closed position means the circuit has no response at all — the lever moves but the cylinder does not. Partial sticking causes sluggish, jerky response.

The most common cause of valve sticking is contamination — a particle lodges between the spool and bore, preventing free movement. The first response is to cycle the valve rapidly several times while the system is running, which sometimes dislodges the particle. If this does not restore normal operation, the valve section must be removed, disassembled, cleaned, and inspected for scoring. A scored spool or bore cannot be repaired in the field and requires a replacement valve section.

Solenoid-operated valves have an additional failure mode — the electrical solenoid coil fails, preventing the valve from shifting under electrical command. Solenoid failure is easy to diagnose by checking for 24V DC supply at the coil terminals while the operator activates the function. No voltage indicates an electrical fault upstream. Correct voltage with no valve movement indicates solenoid or spool failure.

---

## Filter Blockage

### faultKey: filter-blocked

Hydraulic filters are the primary defence against contamination damage. A typical LHD hydraulic circuit has a suction strainer in the reservoir, a high-pressure filter after the pump, and a return line filter before the reservoir. Each filter has a bypass valve that opens when differential pressure across the filter element exceeds the bypass setting — typically 3–6 bar. When the bypass opens, unfiltered oil circulates through the system.

A blocked return line filter presents as slow or sluggish hydraulic response, elevated oil temperature, and potentially a visual indicator on the filter head showing bypass. The bypass does not protect the system — it is a fail-safe to prevent the filter housing from collapsing. Operating with the bypass open allows contamination to accumulate in the system and accelerates wear in pumps, valves, and cylinders.

Filter replacement intervals on LHDs in underground mining should be shortened from OEM recommendations when oil analysis shows elevated contamination. The standard 500-hour or 1,000-hour filter change interval assumes relatively clean operating conditions. In dusty, wet, or high-wear environments, changing all filters at 250 hours is common practice.

A blocked suction strainer causes pump cavitation — the pump cannot draw enough fluid from the reservoir and begins drawing air. The resulting noise and vibration are distinctive and the pump will overheat rapidly. The suction strainer is a coarse mesh element that only becomes blocked under severe contamination or after a major internal component failure that has shed large particles.

After any filter replacement, the new element should be checked for bypassing by monitoring oil temperature and system pressure response in the first hour of operation. A significant temperature rise without load increase suggests bypassing.

---

## Brake System Hydraulics

### faultKey: brake-fade

LHD hydraulic brakes are a critical safety system. All underground mobile equipment is required to have service brakes capable of stopping the loaded machine on the maximum gradient, and a parking brake that holds on the same gradient with the engine off. Brake failure underground is a high-consequence event. Any brake system fault must be treated as safety-critical and the machine must not be operated until the fault is resolved.

LHD service brakes are typically wet disc brakes — multi-disc assemblies running in oil, clamped by hydraulic pressure from the brake circuit. Brake hydraulic pressure is maintained by an accumulator — a pre-charged vessel that stores enough pressurised oil to apply the brakes several times even if the main pump stops. The accumulator is pre-charged with nitrogen gas. A failed accumulator charge loses its nitrogen pre-charge and cannot store energy. Symptoms include a warning light or audible alarm when the engine is running, and reduced or absent braking effort.

Brake fade — gradual loss of braking effectiveness under repeated application — is caused by overheating of the brake fluid in the system, contamination of the brake fluid with water, or worn brake disc packs. On a long downhill haul underground, wet disc brakes can fade if the cooling oil flow is insufficient. Operators should report any brake pedal feel changes, increased pedal travel, or reduced stopping power immediately.

The hydraulic brake circuit is independent of the main work hydraulic circuit on most LHDs, with a dedicated pump or a priority take-off from the main pump protected by check valves. A burst hose in the brake circuit is a safety emergency. The machine must be stopped on a level area or chocked if on a grade.

---

## Hydraulic Oil Overheating

### faultKey: cooling-fault

Hydraulic oil operating temperature should be maintained between 40°C and 80°C. Above 80°C, oil viscosity drops, reducing the lubricating film on pump and valve surfaces. Above 90°C, oil begins to degrade — oxidation accelerates, seal materials swell or harden, and varnish deposits form on valve spools and cylinder bores. Sustained high-temperature operation causes cumulative damage that is not reversed by returning to normal temperatures.

The hydraulic oil cooler on an LHD is typically an air-blast cooler mounted in the airstream from the engine cooling fan. Some machines use a water-cooled hydraulic heat exchanger. A blocked cooler — from rock dust, mud, or mine debris accumulating on the cooling fins — is the most common cause of overheating. The cooler should be cleaned at each major service and inspected weekly underground.

Low hydraulic fluid level reduces the thermal mass available to dissipate heat and increases the proportion of time any given volume of oil spends under pressure and generating heat. Reservoir level should be checked daily. Top-up must use the correct fluid type — never mix fluid types.

A thermal bypass valve in the cooler circuit opens when oil is cold, bypassing the cooler to allow rapid warm-up. If this valve sticks in the open position, oil never reaches the cooler regardless of temperature. This fault presents as steady temperature rise during operation with no other obvious cause. The thermal bypass valve is a simple cartridge that can be inspected and replaced with the system depressurised.

Overheating can also be caused by excessive internal leakage in a worn pump or worn valve spools. Internal leakage converts hydraulic energy directly to heat without doing useful work, which elevates temperature even at normal load levels. An oil temperature rise that worsens as pump hours increase, with no cooler or fluid level fault, suggests internal leakage as the primary cause.

---

## General Underground Maintenance Practices

### Safe Work Before Any Hydraulic Work

Before any hydraulic maintenance on an LHD, lower the bucket fully to the ground and park on level ground. Chock the wheels if working on a slope. Turn the engine off and depressurise the system by cycling all controls several times with the engine off. Tag and lock out the machine before working under elevated components. Hydraulic oil under pressure can inject through skin — a pinhole leak in a hose must never be checked by hand. Use cardboard or paper to detect leaks from a safe distance.

### Fluid Top-Up and Sampling

Use only the specified hydraulic fluid for the machine. Note the fluid type on the reservoir fill point label. Keep top-up containers sealed and clean. Take oil samples from the sampling port — not from the drain or fill point — to avoid introducing contamination into the sample. Oil analysis results are meaningless if the sample is contaminated at the point of collection.

### Torque and Assembly

Hydraulic fittings must be torqued to specification. Under-torqued fittings leak. Over-torqued fittings crack or strip threads. Use a torque wrench on all hydraulic connections. Apply hydraulic-compatible thread sealant only where specified — many hydraulic fittings use O-ring face seal (ORFS) connections that require no sealant and are damaged by it.

### Post-Repair Checks

After any hydraulic repair, run the machine at low engine speed and cycle all functions slowly before returning to full load. Check all connections for leaks. Monitor oil temperature in the first 30 minutes of operation. Take an oil sample 50 operating hours after a major repair to confirm no elevated wear particle counts from components disturbed during the repair.
