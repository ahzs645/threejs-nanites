# PGMaps adapter

The adapter accepts scene v1 packages, legacy seven-field trees, and the additive twelve-field component contract:
`x,y,z,species,height,crownWidth,tone,crownBase,dbhCm,expansion,form,source`.
Crown base is a height fraction: zero is valid, -1 unknown. DBH is cm; zero unknown. Forms are mature/young/shrub (0/1/2); sources are regional/inventory/imported (0/1/2). Optional tree IDs remain aligned through filtering and final-stand merging. Species append hemlock, black spruce, and cottonwood after the original six.

Mature generated trees without explicit morphology retain the detailed, width-binned ez-tree/Nanite path. Imported records and records with crown base, DBH, or young/shrub form use instanced crown/trunk envelopes, with their supplied height, crown width, crown base, and DBH. Unknown dimensions use documented fallbacks in `components.ts`. These are schematic crown volumes, not reconstructions of a measured branch structure. Two crown families and a bare snag family keep batching bounded: adaptive tiles start at 250 m, with at most 24 spatial tiles and 96 living crown/trunk draws (up to 24 extra bare-snag draws). Species tint remains per stem. Species-specific detailed mature growth remains in `species.ts`.

Dense rich imports still submit full component geometry, which can process substantially more vertices than Nanite impostors even when draw counts are bounded. A million rich records also retain hundreds of MiB of CPU/typed-array data. CPU construction results establish neither a GPU speedup nor device memory suitability. Keep this change in draft until real-device images, class/depth capture, culling equivalence, and dense-import GPU measurements pass.

Terrain `stand.cells` indexes a per-grid palette of known height and species shares. Finest known posts override the nearby stem median/common-species fallback. Canopy colour mixes shares; 30 m patch cells sample the mixture deterministically, so mixtures resolve spatially at that scale. Existing canopy closure and ground cover remain authoritative. Treated stumps, snags, logs and felled stems use supplied dimensions and headings; felled side branches are schematic.

## Live controls and captures

Message `{type:'pgmaps-render-options',options:{...}}` updates only this adapter. Unknown/malformed fields retain previous values. Numeric values clamp to the ranges below:

| Field | Default | Range / values | URL |
| --- | --- | --- | --- |
| resolutionScale | 1 | 0.5–1 | renderScale |
| maxFps | 0 | 0 unlimited; 15–120 | maxfps |
| maxInFlight | 2 | 1–3 | gpuqueue |
| dissolveMode | pixels | pixels / relative | dissolve |
| dissolvePixels | 4 | 0.5–16 | cutoffpx |
| dissolveReferenceHeight | 1080 | 240–4320 | referenceheight |
| frustumCulling | true | boolean | culling=0/1 |

Relative dissolve scales the requested pixel threshold by frame height/reference height. The full 20% transition, plus a patch guard, stays inside patch coverage after camera movement. Component envelopes share this transition and dither in image/class/depth passes. Far cards have 1 km spatial chunks with bounds covering billboard orientation, height, slope and crown margins. The culling switch covers adapter components, treated material, far cards/canopy, and Nanite's CPU/GPU frustum tests; distance/LOD rules remain in effect.

Live resolution scaling retains the camera lens and viewport framing. The completion counter bounds submitted frames, gates max FPS independently, and decrements on both completion and rejection. Stats distinguish submitted FPS, completed FPS, completion latency, in-flight count, geometry/texture allocations and draw counters. A rejected GPU completion releases its slot, stops submissions, records the error, and emits one engine error so PGMaps can restore its native view. Representation counts expose component batches and detailed tree counts.

Captures optionally carry a full `renderOptions` snapshot. They render the requested pixel dimensions independently of live scale/FPS/pacing and retain the snapshot's dissolve and culling choices. Reply provenance echoes `renderOptions`, representation, and a `dissolve` object with requested pixels, mode, reference height, resolved cutoff, patch radius, camera offset, and guard. A final capture's `canopyCutoffPx` overrides the requested dissolve threshold using the snapshot's pixel/relative mode. Camera, live controls, classes, depth targets and stand selection restore in `finally`; option updates received during capture apply afterwards.

## Validation

`npm run test:pgmaps`, `npm run typecheck`, `npm run build:pgmaps`, `npm run build:pgmaps-worker`.

CPU tests cover old/new records, zero crown base, DBH/width envelopes, bounded batches, treated orientation, aligned IDs, rich final fields and typed-view offsets, palette precedence, relative dissolve/coverage, and queue rejection recovery. CPU geometry construction is not a GPU or FPS benchmark. Browser screenshots, class/depth captures, culling comparison and device measurements remain necessary for visual/performance acceptance.
