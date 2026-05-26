import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, Flag, ChevronRight, AlertTriangle, X, FileText, SlidersHorizontal, ArrowUpDown, Layers, Clock, TrendingUp, ExternalLink, WifiOff, Calendar, Ship, BookOpen, CalendarClock, ShieldAlert, Info, Building2, Moon, Sun } from "lucide-react";

// ============================================================================
//  SOLAS II-2/14.2.2 — Fire Protection Maintenance, Testing & Inspection
//  REFERENCE LOOKUP TOOL
//  Grounded on: MSC.1/Circ.1432 (as amended by MSC.1/Circ.1516),
//  MSC.1/Circ.1318/Rev.1 (fixed CO2), MSC.1/Circ.1312 (foam concentrates),
//  Resolution A.951(23) (marine portable extinguishers).
// ============================================================================

// ----------------------------------------------------------------------------
//  VERSION  — bump VERSION + BUILD_DATE (to the ACTUAL current date) on every change, and add a CHANGELOG line.
//  Semantic versioning: MAJOR.MINOR.PATCH
//    PATCH = data fix / wording / single-flag update (e.g. 1.1.0 -> 1.1.1)
//    MINOR = new content set or feature (e.g. 1.1.x -> 1.2.0)
//    MAJOR = redesign / breaking change to structure (e.g. 1.x -> 2.0.0)
//  The version shows in the header and footer of the app automatically.
// ----------------------------------------------------------------------------
const VERSION = "1.24.0";
const BUILD_DATE = "26/05/2026"; // dd/mm/yyyy
const COPYRIGHT_YEAR = "2026";
const COPYRIGHT_HOLDER = "Kittipong Sookchai";
const CHANGELOG = [
  { v: "1.24.0", d: "26/05/2026", note: "Added 5 Gard alerts: fire-safety overview (recurring PSC deficiencies), and case studies on engine-room fire + fixed-system failure (container ship), lube-oil filter fire (bulk carrier), effective CO\u2082 use (UK MAIB), and the engine-room fire-prevention Loss Prevention Circular." },
  { v: "1.23.0", d: "26/05/2026", note: "Added Alert: IMO FSI 20 lessons learned \u2014 crew-accommodation fires (combustible construction, prohibited cabin heaters, non-working extinguishers/hoses, EEBDs & escape marking). Only the fire-safety cases from the source were included." },
  { v: "1.22.0", d: "26/05/2026", note: "Added a dark-mode toggle (moon/sun) in the header for low-glare night/bridge use; theme runs through CSS variables." },
  { v: "1.21.0", d: "26/05/2026", note: "Added Alert: Hong Kong MD \u2014 PSC detainable deficiencies for blocked discharge nozzles of fixed fire-fighting systems (SOLAS II-2/14.2.1.2; inspect nozzle cleanliness before port calls). Source: Hong Kong Marine Department letter, 3 Feb 2023." },
  { v: "1.20.1", d: "26/05/2026", note: "Alerts: added a one-click \u2018Clear (N)\u2019 button that resets all active filters, matching the Reference tab." },
  { v: "1.20.0", d: "26/05/2026", note: "Added Alert: engine-room fire BSAFE case study (Britannia P&I, FERNANDA) \u2014 lessons on fixed-system boundary closure (two dampers left open), machinery-space manning, and fixed-system effectiveness." },
  { v: "1.19.3", d: "26/05/2026", note: "Renamed the \u2018Approved Supplier Search\u2019 tab to \u2018Approved Service Supplier\u2019 and removed its search box (only 12 societies)." },
  { v: "1.19.2", d: "26/05/2026", note: "Corrected the build date and recent changelog dates to the actual update date. New versions are now stamped with the current date." },
  { v: "1.19.1", d: "26/05/2026", note: "Alerts: renamed the \u2018Class Society\u2019 filter to \u2018Source\u2019 (LR pinned first); the PSC filter now selects by Memorandum of Understanding (Paris MoU, Tokyo MoU, etc.); PSC cards show their MoU(s)." },
  { v: "1.19.0", d: "26/05/2026", note: "Alerts: added Flag, Class Society (issuing body), and PSC filters; each alert now shows source / flag / PSC chips. Tagged all 45 alerts with flag, source and PSC metadata." },
  { v: "1.18.0", d: "23/05/2026", note: "Added 16 ClassNK Technical Information alerts (flag-specific requirements): fire-fighter radios/communication (Malaysia, Liberia, Cook Islands, Greece), Fire Control Plan symbols (Panama, Cook Islands, Malta), BA/SCBA spare-cylinder recharging (UK/Red Ensign, SVG, Antigua, Singapore, Bahamas), paint-locker extinguishing (Marshall Is.), EEBDs (Cyprus), boiler-space 135 L extinguisher exemption (MSC.409(97)), and spare charges/extinguishers (Panama)." },
  { v: "1.17.0", d: "23/05/2026", note: "Added Alert: documenting PFOS-free fire-extinguishing foam on board \u2014 verification at first safety-equipment survey after 01/01/2026, three documentation routes (maker declaration / accredited lab test <10 mg/kg / TA-MED certificate), traceability. Source: DNV Technical & Regulatory News, 4 May 2026." },
  { v: "1.16.0", d: "23/05/2026", note: "Added Alert: DNV \u2014 deficiencies in CO\u2082 fire-extinguishing systems (depleted cylinders from incorrect ultrasonic level gauging and copper bursting-disc fatigue on pre-2016 NK Co. systems). Source: DNV Technical & Regulatory News, 23 Oct 2025." },
  { v: "1.15.5", d: "23/05/2026", note: "IACS Rec.88 citations (EEBD cylinder hydrostatic test) now link to the IACS recommendation page." },
  { v: "1.15.4", d: "23/05/2026", note: "Planner: the \u2018Approved Service Supplier\u2019 badge is now clickable and opens the Approved Supplier Search tab." },
  { v: "1.15.3", d: "23/05/2026", note: "Renamed the \u2018Suppliers\u2019 tab to \u2018Approved Supplier Search\u2019." },
  { v: "1.15.2", d: "23/05/2026", note: "Supplier Lookup: updated ABS badge colour to #E21E2D and DNV to #009639." },
  { v: "1.15.1", d: "23/05/2026", note: "Supplier Lookup: each Classification Society badge now uses its brand colour, with automatic black/white text for legibility on light brand colours." },
  { v: "1.15.0", d: "23/05/2026", note: "Inspection Planner: added ship-type applicability filter, expandable reference-detail panels (SOLAS/MSC/FSS/interpretation + interval basis), an \u2018Approved Service Supplier\u2019 badge and supplier-only filter, and quick-access buttons (Find LR Approved Firm / Open Supplier Lookup). Added a Find LR Approved Firm action to the Reference tab. Extended the item data model accordingly." },
  { v: "1.14.0", d: "23/05/2026", note: "Added \u2018Suppliers\u2019 tab \u2014 Approved Service Supplier Lookup: searchable cards linking to 12 Classification Society approved-supplier databases (LR pinned first, rest alphabetical by abbreviation)." },
  { v: "1.13.1", d: "23/05/2026", note: "Footer Source instruments: the instrument number itself is now the link (PDF label removed)." },
  { v: "1.13.0", d: "23/05/2026", note: "Added professional copyright footer, a Legal tab (Terms of Use & Disclaimer), copyright/author/noarchive metadata, and frontend-protection notes. All Rights Reserved." },
  { v: "1.12.0", d: "23/05/2026", note: "Reference rows now show related alerts as a single collapsible \u2018N related alerts\u2019 toggle (collapsed by default, expand to view and click through), keeping rows clean." },
  { v: "1.11.4", d: "23/05/2026", note: "Each reference item's source citation is now a clickable link to the relevant instrument (1432, 1516, 1318/Rev.1, 1312, A.951(23)); links disable gracefully when offline." },
  { v: "1.11.3", d: "23/05/2026", note: "Source instruments in the footer (MSC.1/Circ.1432, 1516, 1318/Rev.1, 1312, A.951(23)) now link to their PDF documents; links disable gracefully when offline." },
  { v: "1.11.2", d: "23/05/2026", note: "Renamed the \u2018Survey planner\u2019 tab to \u2018Inspection Planner\u2019 and moved it to the last position (Reference \u2192 Alerts \u2192 Inspection Planner)." },
  { v: "1.11.1", d: "23/05/2026", note: "Filled in LR Class News 26/2015 with full details: SOLAS II-2/13.4 means of escape from machinery spaces (MSC.365(93), UI MSC.1/Circ.1511), for new passenger & cargo ships keel-laid on/after 01/01/2016." },
  { v: "1.11.0", d: "23/05/2026", note: "Alerts: clicking an inline marker in Reference now scrolls to and highlights that specific alert; each alert shows its release date; alerts are ordered chronologically with a Newest/Oldest sort control." },
  { v: "1.10.1", d: "23/05/2026", note: "Removed the LR Class News 10/2014 alert (carriage of petroleum-oil blends \u2014 a cargo item, not fire protection)." },
  { v: "1.10.0", d: "23/05/2026", note: "Added 22 LR Class News alerts (IMO guideline revisions, SOLAS/FSS amendments, manufacturer recalls, USCG/PSC campaigns, lithium-battery and engine-room safety, China service-supplier rules, etc.). Added an Active/Historical status indicator and filter to the Alerts view." },
  { v: "1.9.0", d: "23/05/2026", note: "Added Alert: Port State Control Fire Safety Concentrated Inspection Campaign (Paris & Tokyo MoU, Sep\u2013Nov 2023) \u2014 indicates PSC fire-safety focus areas (source: LR Class News 16/2023). Updated developer credit to Kittipong Sookchai." },
  { v: "1.8.1", d: "23/05/2026", note: "Removed the numeric count badge from the Alerts tab." },
  { v: "1.8.0", d: "23/05/2026", note: "Added Alert (regulation): On-deck container fire protection \u2014 SOLAS II-2/10 requires a water mist lance (and mobile water monitors for 5+ container tiers; 2 monitors \u226430 m beam, 4 if wider) on new container-carrying ships built on/after 01/01/2016. Source: LR Class News 02/2015." },
  { v: "1.7.2", d: "23/05/2026", note: "Ro-Ro fire safety alert: changed the cited source to LR Class News 07/2026 (1 Apr 2026) and added the MSC.1/Circ.1695 detector-spacing unified interpretation." },
  { v: "1.7.1", d: "23/05/2026", note: "Added an understated developer credit (Kit) with a LinkedIn link in the footer across all views." },
  { v: "1.7.0", d: "23/05/2026", note: "Added Alert (regulation): Fire safety amendments for Ro-Ro, passenger & cargo ships \u2014 SOLAS II-2/7 & 20 and FSS Code Ch.7 & 9 (MSC.550(108)/MSC.555(108)), in force 01/01/2026; affects detection, water-based suppression and structural protection. Summarised from ABS Regulatory News No. 15/2025." },
  { v: "1.6.0", d: "23/05/2026", note: "Alerts: added search + kind/system filters (scales for future alerts); reframed the CO\u2082 level-indicator item as a technical recommendation (removed unattributed \u2018requires\u2019 wording, no source claimed); added a \u2018Recommended\u2019 alert kind." },
  { v: "1.5.0", d: "23/05/2026", note: "Added Alert: CO\u2082 cylinder content check by level indicator only valid below 25\u00b0C (CO\u2082 critical temp ~31\u00b0C); use weighing where ambient is too high. Basis: MSC.1/Circ.1318/Rev.1 \u00a76.1 content-verification requirement." },
  { v: "1.4.1", d: "23/05/2026", note: "Renamed the third tab from \u201cSafety alerts\u201d to \u201cAlerts\u201d, since it covers both regulatory changes and safety lessons." },
  { v: "1.4.0", d: "23/05/2026", note: "Added Safety Alerts & Advisories: PFOS prohibition in fire-extinguishing media (SOLAS II-2/10.11, MSC.532(107), in force 01/01/2026) and MAIB 16/2018 unintended CO\u2082 release safety lesson; inline advisory markers on affected items." },
  { v: "1.3.0", d: "22/05/2026", note: "Added Survey Planner: enter a ship build date to generate age-based due/overdue/upcoming periodic items, ranked by priority, with per-item last-completed overrides and category filters." },
  { v: "1.2.1", d: "22/05/2026", note: "Replaced raw circular filenames with proper document names (notice/circular number + date) for all baseline flags, e.g. Isle of Man \u2192 Manx Shipping Notice MSN 057." },
  { v: "1.2.0", d: "22/05/2026", note: "Added LR Approved Firm lookup: opens the LR Approvals database in a new tab with a suggested search keyword per equipment type; shown only for service-supplier-relevant systems; disables gracefully when offline." },
  { v: "1.1.0", d: "22/05/2026", note: "Added Smart Natural-Language Search (synonyms, fuzzy/typo tolerance, interval-phrase recognition, ranked results, suggestions, did-you-mean)." },
  { v: "1.0.2", d: "22/05/2026", note: "Cross-checked against ClassNK Table-1: added Quarterly water-quality (1516 §6.5) and EEBD hydrostatic (IACS Rec.88); updated flag circular references and added Japan, Malaysia, Myanmar, Switzerland, United States." },
  { v: "1.0.1", d: "22/05/2026", note: "Cross-checked against LR guidance note: added 2-Year water-mist cylinder check for table parity." },
  { v: "1.0.0", d: "22/05/2026", note: "Initial reference tool: 7 intervals, 10 system media, IMO baseline + flag overlays, offline single-file build with embedded fonts." },
];

const INTERVALS = ["Weekly", "Monthly", "Quarterly", "Annual", "2-Year", "5-Year", "10-Year"];
const INTERVAL_RANK = Object.fromEntries(INTERVALS.map((v, i) => [v, i]));

// ===========================================================================
//  LR APPROVED FIRM LOOKUP
//  ---------------------------------------------------------------------------
//  Helps surveyors jump to Lloyd's Register's Approved Firm / Service Supplier
//  database for the equipment they're viewing. The LR Approvals page hosts a
//  dynamic search widget (no stable ?search= deep-link), so we open the
//  homepage in a new tab AND show the suggested keyword to type there.
//
//  To extend: add/edit a line in APPROVAL_SEARCH_MAP keyed by medium id.
//  Set a medium to null (or omit it) to hide the button for that system.
// ===========================================================================

// Official LR Approvals landing page (Type Approval / Works Approval /
// Approved Service Supplier certificate database).
const LR_APPROVALS_URL = "https://www.lr.org/en/services/classification-certification/materials-equipment-components-product-certification/lr-approvals/";

// medium id -> suggested search keyword for the LR approvals database.
// Only media that normally involve an LR approved service supplier appear here.
const APPROVAL_SEARCH_MAP = {
  detection: "fire detection and alarm system",
  water:     "water mist fire extinguishing system",
  foam:      "foam fire extinguishing system",
  gas:       "fixed gas fire extinguishing system",   // incl. CO2
  powder:    "dry powder fire extinguishing system",
  aerosol:   "aerosol fire extinguishing system",
  portable:  "portable fire extinguisher servicing",
  ba:        "breathing apparatus servicing",
  // Excluded (no distinct LR approved-service-supplier relevance):
  //   structural (doors/dampers/ventilation), lighting (low-location lighting)
};

// Is an approved-firm lookup applicable to this medium?
function hasApprovalLookup(mediumId) {
  return Object.prototype.hasOwnProperty.call(APPROVAL_SEARCH_MAP, mediumId);
}

// Build the URL to open. The LR site has no reliable query param, so we open
// the homepage; the keyword is shown in the UI/tooltip for the user to type.
function approvalUrl() {
  return LR_APPROVALS_URL;
}

const MEDIA = [
  { id: "all", label: "All systems", short: "All" },
  { id: "detection", label: "Detection & alarm", short: "Detection" },
  { id: "water", label: "Water mist / spray / sprinkler", short: "Water mist" },
  { id: "foam", label: "Foam", short: "Foam" },
  { id: "gas", label: "Fixed gas (incl. CO\u2082)", short: "Fixed gas" },
  { id: "powder", label: "Dry chemical powder", short: "Powder" },
  { id: "aerosol", label: "Aerosol", short: "Aerosol" },
  { id: "portable", label: "Portable / wheeled extinguishers", short: "Portable" },
  { id: "ba", label: "Breathing apparatus / EEBD", short: "BA / EEBD" },
  { id: "structural", label: "Doors / dampers / ventilation", short: "Doors/vent" },
  { id: "lighting", label: "Low-location lighting", short: "LL lighting" },
];

// ---------------------------------------------------------------------------
//  TASK DATABASE  — interval, medium, text, source ref
// ---------------------------------------------------------------------------
const TASKS = [
  // WEEKLY
  { i: "Weekly", m: "detection", t: "Verify all fire detection & alarm control panel indicators are functional via the lamp/indicator test switch.", src: "1432 §4.1" },
  { i: "Weekly", m: "gas", t: "Verify all fixed gas system control panel indicators are functional (lamp/indicator test); verify all control/section valves are in correct position.", src: "1432 §4.2" },
  { i: "Weekly", m: "structural", t: "Verify all fire door control panel indicators (if provided) are functional.", src: "1432 §4.3" },
  { i: "Weekly", m: "detection", t: "Verify public address and general alarm systems are functioning properly.", src: "1432 §4.4" },
  { i: "Weekly", m: "ba", t: "Examine all breathing apparatus and EEBD cylinder gauges to confirm correct pressure range.", src: "1432 §4.5" },
  { i: "Weekly", m: "lighting", t: "Verify low-location lighting is functional by switching off normal lighting in selected locations.", src: "1432 §4.6" },
  { i: "Weekly", m: "water", t: "Verify control panel indicators & alarms functional; visually inspect pump unit & fittings; check pump unit valve positions (if not locked).", src: "1432 §4.7" },
  // MONTHLY
  { i: "Monthly", m: "water", t: "Verify hydrants, hoses, nozzles in place & serviceable; operate all fire pumps for adequate pressure; emergency fire pump fuel supply adequate.", src: "1432 §5.1" },
  { i: "Monthly", m: "gas", t: "Verify containers/cylinders fitted with pressure gauges read in proper range and installation is free from leakage.", src: "1432 §5.2" },
  { i: "Monthly", m: "foam", t: "Verify all control & section valves in proper open/closed position and pressure gauges in proper range.", src: "1432 §5.3" },
  { i: "Monthly", m: "water", t: "Verify control/pump/section valves correct; sprinkler pressure tanks correct water level; test pump auto-start; pressure gauges in range; test sample of section valves for flow & alarm.", src: "1432 §5.4" },
  { i: "Monthly", m: "ba", t: "Verify firefighter's outfit lockers contain full inventory and equipment is serviceable.", src: "1432 §5.5" },
  { i: "Monthly", m: "powder", t: "Verify all control & section valves in proper position and pressure gauges in proper range.", src: "1432 §5.6" },
  { i: "Monthly", m: "aerosol", t: "Verify electrical connections / manual stations properly arranged & in condition; actuation/control panel circuits within manufacturer specs.", src: "1432 §5.7" },
  { i: "Monthly", m: "portable", t: "Verify all portable foam applicators in place, properly arranged & in proper condition.", src: "1432 §5.8" },
  { i: "Monthly", m: "portable", t: "Verify all wheeled (mobile) extinguishers in place, properly arranged & in proper condition.", src: "1432 §5.9" },
  { i: "Monthly", m: "detection", t: "Test a sample of detectors & manual call points so all devices tested within 5 years (sample size for very large systems per Administration).", src: "1432 §5.10" },
  { i: "Monthly", m: "gas", t: "CO\u2082: general visual inspection (\u226530 days) \u2013 stop valves closed, releasing controls correct & accessible, piping/tubing intact, HP cylinders secured, alarm devices in place & undamaged. LP systems: gauge in range, liquid level correct, main service & vapour supply valves secured open.", src: "1318R1 §4" },
  // QUARTERLY
  { i: "Quarterly", m: "water", t: "Verify international shore connection(s) in serviceable condition.", src: "1432 §6.1" },
  { i: "Quarterly", m: "foam", t: "Verify proper quantity of foam concentrate provided in the foam system storage tank.", src: "1432 §6.2" },
  { i: "Quarterly", m: "water", t: "Water mist/spray/sprinkler: assess the quality of water in the system (water-quality assessment), to confirm the supply is not degrading pipework or nozzles.", src: "1516 §6.5" },
  { i: "Quarterly", m: "structural", t: "Test all fire dampers for local operation.", src: "1432 §6.3" },
  { i: "Quarterly", m: "structural", t: "Test all fire doors in main vertical zone bulkheads for local operation.", src: "1432 §6.4" },
  // ANNUAL
  { i: "Annual", m: "water", t: "Fire mains/pumps/hydrants/hoses/nozzles: visually inspect components; flow test pumps (emergency pump w/ isolation valves closed); test hydrant valves; pressure-test sample of hoses (all within 5 yrs); verify relief valve settings; examine filters/strainers; verify nozzle size/type.", src: "1432 §7.1" },
  { i: "Annual", m: "detection", t: "Test all detection systems (incl. those releasing extinguishing systems); visually inspect accessible detectors (all within 1 yr); test emergency power switchover.", src: "1432 §7.2" },
  { i: "Annual", m: "gas", t: "Fixed gas: inspect components; externally examine HP cylinders for damage/corrosion; check hydrostatic test date of containers; test alarms; verify valve positions; check pilot piping tightness; examine flexible hoses; test fuel shut-offs; inspect space boundaries; verify double release lines integrity if cylinders inside space.", src: "1432 §7.3" },
  { i: "Annual", m: "foam", t: "Foam: inspect components; test audible alarms; flow test water supply & foam pumps (flush w/ fresh water after); test cross-connections; verify relief valves; examine filters; verify valve positions; blow-through HiEx discharge piping; sample foam concentrates for periodical control tests (Circ.1312 / 670). Test fuel shut-offs.", src: "1432 §7.4" },
  { i: "Annual", m: "foam", t: "Foam concentrate periodical control: sedimentation, pH, expansion ratio, drainage time, volumic mass (+ small-scale fire test & acetone stability for protein-based AR). First test \u2264 3 yrs after supply (except non-AR foam). Annual thereafter.", src: "1312 §4\u20135" },
  { i: "Annual", m: "water", t: "Water mist/spray/sprinkler: verify operation via test valves; inspect components; externally examine HP cylinders; check hydrostatic dates; test alarms; flow test pumps; test antifreeze; test cross-connections; verify relief valves; examine filters; verify valve positions; blow-through dry-pipe discharge; test emergency power switchover; inspect sprinklers in aggressive/damage-prone areas (all within 1 yr).", src: "1432 §7.5 / 1516" },
  { i: "Annual", m: "water", t: "Automatic sprinkler/water-mist nozzle functional testing per the Circ.1516 flow chart (Basic + Extended testing, RFB-based). For systems \u22655 yrs: test 2 per type in 10 sections (20 total). Conduct water-quality testing in each corresponding piping section.", src: "1516 §3 (7.5.17\u2013.18)" },
  { i: "Annual", m: "structural", t: "Ventilation & fire dampers: test dampers for remote operation; verify galley exhaust ducts/filters free of grease; test ventilation controls interconnected with fire systems.", src: "1432 §7.6" },
  { i: "Annual", m: "structural", t: "Test all remotely-controlled fire doors for proper release.", src: "1432 §7.7" },
  { i: "Annual", m: "ba", t: "Breathing apparatus: check air recharging systems for air quality; check face masks & demand valves serviceable; check EEBDs per maker's instructions.", src: "1432 §7.8" },
  { i: "Annual", m: "powder", t: "Dry chemical powder: inspect components; verify pressure regulators within calibration; agitate powder charge with (moisture-free) nitrogen per maker.", src: "1432 §7.9" },
  { i: "Annual", m: "aerosol", t: "Verify aerosol generators have not exceeded mandatory replacement date; demonstrate pneumatic/electric actuators working as far as practicable.", src: "1432 §7.10" },
  { i: "Annual", m: "portable", t: "Portable foam applicators: verify correct proportioning ratio & condition; verify factory-sealed containers within service life; sealed non-protein concentrate <10 yrs may be accepted without periodical tests; protein-based >5 yrs subject to Circ.1312 tests or renew; non-sealed/undocumented subject to Circ.1312 tests.", src: "1432 §7.11" },
  { i: "Annual", m: "portable", t: "Wheeled (mobile) extinguishers: periodical inspection per maker; inspect components; check hydrostatic test date of each cylinder; invert dry-powder units to agitate.", src: "1432 §7.12" },
  { i: "Annual", m: "structural", t: "Check galley & deep-fat cooking fire-extinguishing systems per manufacturer's instructions.", src: "1432 §7.13" },
  { i: "Annual", m: "portable", t: "Portable extinguishers serviced at intervals not exceeding one year (annual inspection per Table 9.1.3: safety clip, pressure device, external exam, weight, hose/nozzle, operating instructions).", src: "A.951(23) §9.1" },
  { i: "Annual", m: "gas", t: "CO\u2082 annual: inspect protected-space boundaries for uncloseable openings; inspect storage containers (corroded/dented/bulging \u2192 retest/replace); inspect piping & nozzles; check manifold hoses/fittings tight; entrance doors close & warning signs present; remote releasing controls clear.", src: "1318R1 §5" },
  // TWO-YEAR
  { i: "2-Year", m: "gas", t: "Fixed gas: weigh all HP extinguishing-agent & pilot cylinders (or verify contents) \u2013 charge must be >95% of nominal; refill below 95%. Blow-through discharge piping to confirm clear.", src: "1432 §8.1" },
  { i: "2-Year", m: "powder", t: "Dry chemical powder: blow dry nitrogen through discharge piping; operationally test local/remote controls & section valves; verify propellant cylinder contents; sample powder for moisture; pressure-test containment vessel, safety valve & discharge hoses.", src: "1432 §8.2" },
  { i: "2-Year", m: "water", t: "Water mist/spray/sprinkler with gas or water pressure cylinders: weigh all HP propellant/agent cylinders (or verify contents by reliable means) \u2013 charge must be >95% of nominal, refill if below; blow-through discharge piping & nozzles to confirm clear. (Per the §8.1 two-yearly cylinder regime applied to pressurised water-based systems; LR guidance note marks water mist at 2-yearly.)", src: "1432 §8.1 (cyl.)" },
  { i: "2-Year", m: "gas", t: "CO\u2082 (passenger \u2013 biennial \u00b13 mo; cargo \u2013 intermediate/periodical/renewal): weigh HP & pilot cylinders (charge >90% of nominal, refill below); check LP tank liquid level; check hydrostatic test dates; HP cylinders periodical test \u2264 10 yrs; blow-through discharge piping & nozzles.", src: "1318R1 §6.1" },
  { i: "2-Year", m: "gas", t: "CO\u2082 (passenger \u2013 biennial; cargo \u2013 renewal): test activating heads at full working pressure (or blank/connect pilot lines & test); check manual pull cables/pulleys; clean & adjust cable components; verify pneumatic remote release & pilot gas charge; verify controls/warning devices & time delay; return system to service.", src: "1318R1 §6.2" },
  // FIVE-YEAR
  { i: "5-Year", m: "gas", t: "Fixed gas: perform internal inspection of all control valves.", src: "1432 §9.1" },
  { i: "5-Year", m: "foam", t: "Foam: internal inspection of all control valves; flush HiEx piping with fresh water, drain & purge with air; check nozzles clear; test proportioners (mixing ratio within +30/\u221210% of approval).", src: "1432 §9.2" },
  { i: "5-Year", m: "water", t: "Water mist/spray/sprinkler: flush all ro-ro deck deluge piping (drain & purge w/ air); internal inspection of control/section valves (+ water-quality testing in corresponding sections per 7.5.18 if not done in last 5 yrs); check/renew batteries.", src: "1432 §9.3 / 1516 §9.3" },
  { i: "5-Year", m: "ba", t: "Hydrostatic test of all steel SCBA cylinders; aluminium & composite cylinders tested to Administration's satisfaction.", src: "1432 §9.4" },
  { i: "5-Year", m: "ba", t: "EEBD cylinders: hydrostatic test of EEBD pressure cylinders at the interval specified by the maker / recognized standard (ClassNK references IACS Rec.88).", src: "IACS Rec.88" },
  { i: "5-Year", m: "lighting", t: "Test luminance of all low-location lighting systems per resolution A.752(18).", src: "1432 §9.5" },
  { i: "5-Year", m: "portable", t: "Visually examine at least one wheeled extinguisher of each type manufactured in the same year & kept on board.", src: "1432 §9.6" },
  { i: "5-Year", m: "gas", t: "CO\u2082: internal inspection of all control valves at least once every five years.", src: "1318R1 §7" },
  { i: "5-Year", m: "portable", t: "Test-discharge at least one portable extinguisher of each type manufactured in same year, every 5 yrs (as part of a fire drill).", src: "A.951(23) §9.1.1" },
  // TEN-YEAR
  { i: "10-Year", m: "gas", t: "Fixed gas: hydrostatic test & internal exam of 10% of agent & pilot cylinders. If 1+ fail \u2192 50% tested; if further fail \u2192 all tested. Replace flexible hoses (\u226410 yr intervals). Halon: visual + NDT in lieu of hydrostatic if Administration permits.", src: "1432 §10.1" },
  { i: "10-Year", m: "water", t: "Water mist/spray/sprinkler: hydrostatic test & internal exam of gas & water pressure cylinders per flag guidelines or EN 1968:2002+A1.", src: "1432 §10.2" },
  { i: "10-Year", m: "powder", t: "Subject all dry-powder containment vessels to hydrostatic or NDT by an accredited service agent.", src: "1432 §10.3" },
  { i: "10-Year", m: "aerosol", t: "Renew condensed/dispersed aerosol generators per manufacturer's recommendations.", src: "1432 §10.4" },
  { i: "10-Year", m: "portable", t: "Hydrostatically test all wheeled extinguishers & propellant cartridges by specially trained persons per recognized standards / maker.", src: "1432 §10.5" },
  { i: "10-Year", m: "gas", t: "CO\u2082 HP cylinders: 10-yr periodical test \u2013 10% internal inspection & hydrostatic test; if 1+ fail \u2192 50%; if further fail \u2192 all. Before 20-yr anniversary & every 10 yrs thereafter: ALL cylinders hydrostatic test. Flexible hoses \u2264 10 yrs.", src: "1318R1 §6.1.2" },
  { i: "10-Year", m: "portable", t: "Hydraulically test all portable extinguishers & propellant cartridges per recognized standard / maker (\u2264 10 yr intervals).", src: "A.951(23) §9.1.2" },
];

// ---------------------------------------------------------------------------
//  FLAG OVERLAYS  — deviations / clarifications on top of the IMO baseline.
// ---------------------------------------------------------------------------
const FLAGS = [
  { id: "imo", name: "IMO baseline", circ: "MSC.1/Circ.1432 as amended + 1516, 1318/Rev.1, A.951(23)", notes: [] },
  { id: "antigua", name: "Antigua & Barbuda", circ: "Antigua & Barbuda Circular 2012-011 (25 Jan 2024)", notes: [] },
  { id: "australia", name: "Australia", circ: "Australia Marine Order 15 (21 May 2014)", notes: [] },
  { id: "bahamas", name: "Bahamas", circ: "BMA Marine Notice MN079 v2.2 (20 Dec 2025); MN080 sprinklers; MN081 EEBDs", notes: [
    { m: "gas", txt: "CO\u2082: at 10-yr, test 10%; if fail, all tested. Further 10% at the 20th anniversary regime; before 20-yr & every 10 yrs thereafter all cylinders hydrostatic tested.", interval: "10-Year" },
    { m: "ba", txt: "Breathing apparatus: 5-year hydrostatic test on bottles.", interval: "5-Year" },
    { m: "portable", txt: "Additional extinguishers of same type & capacity shall be carried in lieu of spare charges where recharge on board is not possible.", interval: "Annual" },
    { m: "foam", txt: "PFOS/PFAS foam prohibition not later than first survey on/after 1 Jan 2026.", interval: "Annual" },
  ]},
  { id: "bahrain", name: "Bahrain", circ: "Bahrain Directive No. SOLAS/12 (29 Dec 2016)", notes: [] },
  { id: "barbados", name: "Barbados", circ: "Barbados Bulletin 012 (20 Aug 2025)", notes: [] },
  { id: "bermuda", name: "Bermuda", circ: "Bermuda Shipping Notice 2024-021 / 2024-027 / 2021-028 / 2019-06", notes: [] },
  { id: "cayman", name: "Cayman Islands", circ: "Cayman Islands Shipping Notice 01/2014 Rev.2 (6 Oct 2022)", notes: [] },
  { id: "cookislands", name: "Cook Islands", circ: "Cook Islands Circular 55/2013 (10 Apr 2015)", notes: [] },
  { id: "cyprus", name: "Cyprus", circ: "Circular No. 41/2021 (9 Dec 2021)", notes: [
    { m: "gas", txt: "Adopts revised CO\u2082 hydrostatic-test regime and introduces 5-yearly internal inspection of control valves.", interval: "5-Year" },
    { m: "all", txt: "Survey window of \u00b1 three months from the Cargo Ship Safety anniversary date.", interval: null },
    { m: "ba", txt: "Irrespective of number of EEBDs in place, at least one additional EEBD should be provided.", interval: "Annual" },
  ]},
  { id: "dominica", name: "Dominica", circ: "Dominica CD-MSC 33-01 Rev.01 (18 Apr 2008)", notes: [] },
  { id: "gibraltar", name: "Gibraltar", circ: "Gibraltar Shipping Guidance Notice 046 / SGN 115(a) (8 Jun 2023)", notes: [] },
  { id: "hongkong", name: "Hong Kong", circ: "Hong Kong Merchant Shipping Information Note No. 14/2016 (18 Jan 2016)", notes: [] },
  { id: "isleofman", name: "Isle of Man", circ: "Isle of Man Ship Registry Manx Shipping Notice MSN 057 (May 2025)", notes: [] },
  { id: "japan", name: "Japan", circ: "NK Rules Part R 14.2.2 (to be based on MSC.1/Circ.1432 & 1516)", notes: [] },
  { id: "kiribati", name: "Kiribati", circ: "Kiribati Marine Circular 16/2012 Rev.2 (2 Dec 2019)", notes: [] },
  { id: "liberia", name: "Liberia", circ: "Marine Notice FIR-001 Rev.01/26 (23 Jan 2026)", notes: [
    { m: "gas", txt: "CO\u2082 internal inspection & hydrostatic test referenced to the cylinder's 10-year anniversary date of the last test.", interval: "10-Year" },
    { m: "foam", txt: "PFOS-containing extinguishing media prohibited \u2013 phase out not later than the first survey on/after 1 Jan (PFAS transition); confirm foam concentrate compliance.", interval: "Annual" },
  ]},
  { id: "luxembourg", name: "Luxembourg", circ: "Luxembourg CAM 01/2022 (5 Apr 2022)", notes: [] },
  { id: "malaysia", name: "Malaysia", circ: "MSN 05/2023 (22 Mar 2023)", notes: [] },
  { id: "malta", name: "Malta", circ: "Technical Notice SLS6 Rev.4 (5 Feb 2025)", notes: [
    { m: "portable", txt: "For extinguishers that cannot be recharged on board, additional extinguishers of the same type & capacity to be carried.", interval: "Annual" },
    { m: "gas", txt: "Standard hydrostatic pressure test regime applied per IMO baseline.", interval: "10-Year" },
  ]},
  { id: "marshall", name: "Marshall Islands", circ: "Marine Notice 2-011-14 Rev. Aug/2025 (27 Aug 2025)", notes: [
    { m: "ba", txt: "Dedicated guidance on hydrostatic testing of SCBA cylinders (see MG §10.4).", interval: "5-Year" },
    { m: "foam", txt: "Foam containing PFAS: ships constructed before 1 Jan 2026 to comply not later than the date of the first survey thereafter.", interval: "Annual" },
  ]},
  { id: "myanmar", name: "Myanmar", circ: "Directive 5/2016 (21 Nov 2016); SS3656 for portable extinguishers", notes: [] },
  { id: "netherlands", name: "Netherlands", circ: "Netherlands ItoS – SOLAS Chapter II-2 Ver.8 (2 Jun 2023)", notes: [] },
  { id: "oman", name: "Oman", circ: "Oman Circular B09 / B10", notes: [] },
  { id: "panama", name: "Panama", circ: "Merchant Marine Circular MMC-281 V.04 (Jul 2022); MMC-142 EEBDs (Nov 2023)", notes: [
    { m: "all", txt: "Where the RO determines equipment does not comply, request SEGUMAR authorization for a Conditional Statutory Certificate (conditionals@segumar.com) per MMC-156.", interval: null },
    { m: "foam", txt: "Circ.1312 (foam) applied as recommendation only; additional referenced circulars include MSC.1/Circ.798 (medium-exp.) & 670 (high-exp.) foam.", interval: "Annual" },
  ]},
  { id: "saudi", name: "Saudi Arabia", circ: "Saudi Arabia Shipping Notice 02/2020 (Feb 2020)", notes: [] },
  { id: "singapore", name: "Singapore", circ: "MPA Shipping Circular No. 13 of 2021", notes: [
    { m: "gas", txt: "CO\u2082 HP cylinders: from 1 Jan 2022 hydrostatic test of ALL cylinders at/before 20th & 30th anniversary, then every 10 yrs. Transitional regimes apply to ships that completed 20th/30th-anniversary maintenance under the old Circular No.19/2013.", interval: "10-Year" },
    { m: "gas", txt: "Whenever CO\u2082 cylinders are removed for hydrostatic test they shall be replaced to maintain FSS Code Ch.5 §2.2.1 quantity (exception during dry-docking).", interval: "10-Year" },
  ]},
  { id: "svg", name: "St. Vincent & the Grenadines", circ: "St. Vincent & the Grenadines Circular No. SOL 006 Rev.11", notes: [] },
  { id: "switzerland", name: "Switzerland", circ: "Circular No. CH50 (SMNO, 1 Nov 2016)", notes: [] },
  { id: "tuvalu", name: "Tuvalu", circ: "Tuvalu Marine Circular MC-7/2011/1 (Jun 2018) / MC-17/2011/1 (Apr 2018)", notes: [] },
  { id: "uk", name: "United Kingdom", circ: "UK MCA Marine Guidance Notes MGN 258 / 276 / 355 / 374; MSIS 12", notes: [] },
  { id: "usa", name: "United States", circ: "US CFRs (mandatory); MSC.1/Circ.1432 as minimum guideline", notes: [
    { m: "all", txt: "US-flag: the Code of Federal Regulations (CFRs) are mandatory and take precedence; MSC.1/Circ.1432 is treated only as a minimum-level guideline.", interval: null },
  ]},
  { id: "vanuatu", name: "Vanuatu", circ: "Vanuatu Fleet/Safety Letter (25 May 2016)", notes: [] },
  { id: "vietnam", name: "Vietnam", circ: "Vietnam Technical Information 023TI.E/12TB (20 Jul 2012)", notes: [] },
];

const SOURCE_DOCS = [
  { ref: "1432", full: "MSC.1/Circ.1432 — Revised guidelines for maintenance & inspection of fire protection systems and appliances (31 May 2012)", link: "https://www.classnk.or.jp/hp/pdf/activities/statutory/solas/solas_treaty/fire_protection/imo_circular/ci_1432_e.pdf" },
  { ref: "1516", full: "MSC.1/Circ.1516 — Amendments to MSC.1/Circ.1432 (8 Jun 2015)", link: "https://maritime.lr.org/l/941163/2022-01-25/2vhym/941163/1643104451v6zvMWiI/MSC.1_CIRC.1516.pdf" },
  { ref: "1318R1", full: "MSC.1/Circ.1318/Rev.1 — Maintenance & inspection of fixed CO\u2082 fire-extinguishing systems (25 May 2021)", link: "https://www.classnk.or.jp/hp/pdf/activities/statutory/solas/solas_treaty/fire_protection/imo_circular/ci_1318_rev.1.pdf" },
  { ref: "1312", full: "MSC.1/Circ.1312 — Performance, testing & survey of foam concentrates (10 Jun 2009)", link: "https://www.classnk.or.jp/hp/pdf/activities/statutory/solas/solas_treaty/fire_protection/imo_circular/ci_1312.pdf" },
  { ref: "A.951(23)", full: "Resolution A.951(23) — Improved guidelines for marine portable fire extinguishers", link: "https://www.classnk.or.jp/hp/pdf/activities/statutory/solas/solas_treaty/fire_protection/imo_circular/ci_951.pdf" },
];

// Map a row citation (e.g. "1432 §7.3", "A.951(23) §9.1", "1318R1 §5",
// "1432 §7.5 / 1516", "IACS Rec.88") to the source URL of the leading
// instrument it cites. Returns null when no linkable instrument is recognised.
function srcUrl(srcStr) {
  if (!srcStr) return null;
  const map = {};
  SOURCE_DOCS.forEach(d => { if (d.link) map[d.ref] = d.link; });
  // Order matters: check the most specific/leading codes first.
  if (/^A\.951\(23\)/.test(srcStr)) return map["A.951(23)"] || null;
  if (/^1318R1/.test(srcStr))       return map["1318R1"] || null;
  if (/^1516/.test(srcStr))         return map["1516"] || null;
  if (/^1312/.test(srcStr))         return map["1312"] || null;
  if (/^1432/.test(srcStr))         return map["1432"] || null;
  if (/^IACS Rec\.?88/i.test(srcStr)) return "https://iacs.org.uk/resolutions/recommendations/81-100/rec-88-rev1-cln";
  return null;
}

// ===========================================================================
//  SAFETY ALERTS & ADVISORIES
//  ---------------------------------------------------------------------------
//  Regulatory changes and safety lessons that affect how fire-protection items
//  are maintained/used, but that aren't simple interval rows. Each advisory can
//  flag one or more media ids so an inline marker appears on matching items.
//  To add one: append an object below. `kind`: "regulation" | "safety".
// ===========================================================================
const SAFETY_ADVISORIES = [
  {
    id: "pfos",
    status: "active",
    date: "01/01/2026",
    flag: "IMO / General",
    source: "IMO",
    psc: false,
    kind: "regulation",
    title: "PFOS prohibited in fire-extinguishing media",
    media: ["foam", "portable"],
    effective: "01/01/2026",
    summary: "IMO amendments to SOLAS Ch. II-2 (reg. 10.11) and the 1994/2000 HSC Codes prohibit the use or storage of fire-extinguishing media \u2014 including firefighting foams \u2014 containing perfluorooctane sulfonic acid (PFOS).",
    points: [
      "Adopted by resolutions MSC.532(107) (SOLAS II-2), MSC.536(107) (1994 HSC Code) and MSC.537(107) (2000 HSC Code); in force 1 January 2026.",
      "Applies to both fixed systems and portable firefighting equipment.",
      "Concentration limit: 10 mg/kg (0.001% by weight), per unified interpretation MSC.1/Circ.1694.",
      "New ships (built on/after 01/01/2026): compliant on delivery. Existing ships: comply no later than the first survey on/after 01/01/2026.",
      "Removed PFOS media must go to appropriate shore-based reception facilities. Verify foam via maker's declaration or laboratory test; replacement media must be certified PFOS-free.",
      "Note: the IMO ban targets PFOS specifically, not all PFAS. Draining and refilling may be insufficient \u2014 PFAS residues can adhere to system internals and re-contaminate new foam.",
    ],
    refs: "SOLAS II-2/10.11 (MSC.532(107)); HSC Codes (MSC.536(107), MSC.537(107)); MSC.1/Circ.1694",
    link: "https://www.lr.org/en/knowledge/class-news/16-25/",
  },
  {
    id: "roro-fire-2026",
    status: "active",
    date: "01/04/2026",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    kind: "regulation",
    title: "Fire safety amendments for Ro-Ro, passenger & cargo ships",
    media: ["detection", "water", "structural"],
    effective: "01/01/2026",
    summary: "IMO resolutions MSC.550(108) and MSC.555(108) amend SOLAS Ch. II-2 (regs 7 & 20) and the FSS Code (Chs 7 & 9), strengthening fire detection/alarm, water-based suppression, and containment in vehicle, special category and Ro-Ro spaces. Driven by Ro-Ro/vehicle-carrier fire incidents and the EMSA FIRESAFE I/II studies.",
    points: [
      "Entry into force 1 January 2026. New ships: built on/after that date. Existing ships: comply no later than the first survey on/after 1 January 2028 (per MSC.1/Circ.1290 'first survey').",
      "Detection & alarm: individually identifiable fixed detection in vehicle/special-category/Ro-Ro spaces; combined smoke & heat detectors; detection aligned with deluge-system sections; weather decks for vehicles need fixed detection with approved detector types/spacing.",
      "Video monitoring: effective continuous video monitoring of vehicle/special-category/Ro-Ro spaces with replay (\u22657 days new ships; \u226524 hours for older passenger ships) at a manned control station/safety centre.",
      "Water-based suppression: weather decks for vehicle carriage to be covered by fixed monitor system(s) per FSS Code Ch.7 \u2014 combined \u22652.0 L/min/m\u00b2, each monitor \u22651,250 L/min, with drainage sized to remove \u2265125% of combined monitor + hose-nozzle capacity.",
      "Structural protection (passenger ships >36 pax): special-category/Ro-Ro boundary bulkheads & decks insulated to A-60 (reducible to A-0 in defined cases); controlled arrangement of openings with safety distances; steel ramps/doors.",
      "FSS Code Ch.9: linear heat detectors (tested to EN 54-22:2015 / IEC 60092-504), detector spacing tables, and consistent alarm presentation; smoke detection may be disabled during vehicle loading/unloading (heat detection & call points may not).",
    ],
    refs: "SOLAS II-2/20 (MSC.550(108)); FSS Code Ch.7 & 9 (MSC.555(108)); MSC.1/Circ.1695 (UI of the FSS Code, detector spacing). Summarised from LR Class News 07/2026 (1 Apr 2026).",
    link: "https://www.lr.org/en/knowledge/class-news/07-26/",
  },
  {
    id: "ondeck-container-fire",
    status: "active",
    date: "03/02/2015",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    kind: "regulation",
    title: "On-deck container fire protection \u2014 water mist lance & mobile monitors",
    media: ["water", "portable"],
    effective: "01/01/2016",
    summary: "IMO amendments to SOLAS regulation II-2/10 introduced fire-protection requirements for on-deck cargo areas of new ships designed to carry containers on or above the weather deck, in response to industry concerns about tackling fires in deck-stowed containers (limited access and, historically, only manual intervention with extinguishers and hoses).",
    points: [
      "Applies to ships designed to carry containers on or above the weather deck, constructed on or after 1 January 2016.",
      "At least one water mist lance shall be fitted, in addition to all other required fire-protection arrangements.",
      "Ships designed to carry five or more tiers of containers on/above the weather deck shall also be provided with mobile water monitors.",
      "Mobile water monitor count by beam: breadth up to 30 m \u2014 at least two; breadth exceeding 30 m \u2014 at least four.",
    ],
    refs: "SOLAS regulation II-2/10 (on-deck cargo areas). Summarised from LR Class News 02/2015 (3 Feb 2015).",
    link: "https://www.lr.org/en/knowledge/class-news/02-15/",
  },
  {
    id: "co2-release",
    status: "active",
    date: "01/01/2018",
    flag: "IMO / General",
    source: "MAIB",
    psc: false,
    kind: "safety",
    title: "Unintended CO\u2082 release \u2014 maintenance of fixed CO\u2082 systems",
    media: ["gas"],
    effective: null,
    summary: "MAIB Report 16/2018 (ro-ro vessels Eddystone & Red Eagle) investigated unintentional CO\u2082 releases and found fire-system maintenance and the available industry guidance to be inadequate. Historically, unintended CO\u2082 release has caused many casualties in the marine sector.",
    points: [
      "Both incidents: gas leaked into the CO\u2082 cylinder compartment but was held back from the engine room by a closed main distribution valve \u2014 the safety margin was narrow.",
      "Safety lessons: maintenance of the fire-extinguishing systems was inadequate; available guidance on CO\u2082 system maintenance/inspection was insufficient.",
      "MAIB asked the MCA to ensure all CO\u2082-system safety devices are maintained/surveyed appropriately and to seek IMO clarification on the maximum periodicity between hydrostatic tests of individual HP cylinders (MSC.1/Circ.1318).",
      "MAIB recommended LR & DNV-GL raise with IACS the quality of service from approved service suppliers maintaining CO\u2082 systems.",
      "Design lesson: review systems where leakage of a single cylinder valve can discharge the entire bank.",
    ],
    refs: "MAIB Accident Investigation Report 16/2018; relates to MSC.1/Circ.1318/Rev.1; MCA Safety Bulletin No. 12",
    link: "https://www.gov.uk/maib-reports/unintentional-release-of-carbon-dioxide-from-fixed-fire-extinguishing-systems-on-ro-ro-vessels-eddystone-and-red-eagle",
  },
  {
    id: "co2-level-indicator",
    status: "active",
    date: "01/01/2025",
    flag: "IMO / General",
    source: "General",
    psc: false,
    kind: "recommendation",
    title: "CO\u2082 cylinder content check by level indicator \u2014 temperature limit",
    media: ["gas"],
    effective: null,
    summary: "Highly recommended practice: measuring CO\u2082 cylinder contents with a level indicator at high ambient temperatures is technically unreliable. CO\u2082 is stored mainly as a liquid under pressure, and level measurement depends on a stable liquid\u2013vapour equilibrium that breaks down as temperature rises.",
    points: [
      "CO\u2082's critical temperature is ~31\u00b0C; above this point CO\u2082 cannot exist as a distinct liquid phase, so level-based measurement becomes unreliable. Even well below the critical point, elevated ambient temperatures affect internal pressure and measurement precision.",
      "Recommendation: use level-indicator methods only when the cylinder temperature is below 25\u00b0C, to ensure sufficient accuracy and reliability.",
      "Level-indicator checks should use properly calibrated equipment with valid calibration certification.",
      "Where temperature conditions are unsuitable (e.g. typical ambient temperatures in Thailand often exceed this threshold), use a more appropriate method such as weighing to obtain reliable, accurate results.",
    ],
    refs: "Technical best-practice recommendation; basis: CO\u2082 content verification under MSC.1/Circ.1318/Rev.1 \u00a76.1 (\u2018weighed or contents verified by other reliable means\u2019)",
  },
  {
    id: "psc-fire-cic-2023",
    status: "historical",
    date: "29/08/2023",
    flag: "IMO / General",
    source: "LR",
    psc: true,
    mou: ["Paris MoU", "Tokyo MoU", "Black Sea MoU", "Acuerdo Vi\u00f1a del Mar"],
    kind: "safety",
    title: "Port State Control \u2014 Fire Safety Concentrated Inspection Campaign",
    media: ["detection", "water", "foam", "gas", "powder", "portable", "ba", "structural"],
    effective: null,
    summary: "A joint Port State Control Concentrated Inspection Campaign (CIC) on fire safety was run by the Paris and Tokyo MoU member authorities from 1 September to 30 November 2023, with the Black Sea MoU and Acuerdo Vi\u00f1a del Mar authorities running parallel campaigns. It indicates the fire-safety areas PSC focuses on during inspections.",
    points: [
      "Conducted as an additional part of regular PSC inspections (one CIC inspection per ship during the campaign period).",
      "Verifies that firefighting systems and equipment comply with requirements and are properly maintained and in operational condition.",
      "Checks that masters and crews are familiar with fire-safety procedures.",
      "Deficiencies may require immediate rectification or rectification within a set period, and can result in detention of the ship.",
      "Although the 2023 campaign has concluded, it remains a useful checklist of what PSC scrutinises on fire safety; LR & UK P&I Club's free PSC Pocket Checklists app supports preparation.",
    ],
    refs: "Paris & Tokyo MoU PSC Concentrated Inspection Campaign on Fire Safety (1 Sep \u2013 30 Nov 2023). Source: LR Class News 16/2023 (29 Aug 2023).",
    link: "https://www.lr.org/en/knowledge/class-news/16-23/",
  },

  // ---- Batch: LR Class News items (added on request) --------------------
  {
    id: "cn-06-13", status: "active",
    date: "01/01/2013", kind: "regulation",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Revised IMO guidelines for maintenance & inspection of fire protection systems",
    media: ["detection", "water", "foam", "gas", "powder", "portable", "ba", "structural"],
    effective: null,
    summary: "IMO issued revised guidelines for the maintenance and inspection of fire-protection systems and appliances (MSC.1/Circ.1432), consolidating periodic testing requirements. These guidelines are the principal basis for the maintenance intervals in this reference tool.",
    points: [
      "Sets out recommended weekly/monthly/quarterly/annual and multi-year maintenance, testing and inspection actions for fire-protection systems.",
      "Later amended by MSC.1/Circ.1516 (in-service testing of water-based systems).",
    ],
    refs: "MSC.1/Circ.1432. Source: LR Class News 06/2013.",
    link: "https://www.lr.org/en/knowledge/class-news/06-13/",
  },
  {
    id: "cn-18-14", status: "active",
    date: "01/07/2014", kind: "regulation",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "2014 amendments to SOLAS and the FSS Code",
    media: ["detection", "water", "foam", "gas", "structural"],
    effective: "01/07/2014",
    summary: "A package of 2014 amendments to SOLAS Chapter II-2 and the Fire Safety Systems (FSS) Code entered into force on 1 July 2014, refining fire-safety construction, systems and equipment requirements.",
    points: [
      "Affects fire detection, fixed extinguishing systems and structural fire protection across the SOLAS/FSS framework.",
      "Consult the consolidated SOLAS/FSS Code text for the specific regulation changes applicable to a given ship.",
    ],
    refs: "2014 SOLAS & FSS Code amendments (in force 01/07/2014). Source: LR Class News 18/2014.",
    link: "https://www.lr.org/en/knowledge/class-news/18-14/",
  },
  {
    id: "cn-43-16", status: "active",
    date: "01/01/2016", kind: "regulation",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Fire-fighting medium weights in lightweight / lightship condition",
    media: ["gas", "powder", "foam", "water"],
    effective: null,
    summary: "Statutory alert clarifying that the weight of fixed fire-fighting mediums (CO\u2082, dry chemical powder, foam concentrate, fresh water, etc.) should be included as part of the lightweight and lightship condition used for stability.",
    points: [
      "The charge of fixed-system mediums is part of the ship's lightship weight and should be accounted for in the stability information.",
      "Relevant when systems are recharged, converted, or media type/quantity changes.",
    ],
    refs: "Statutory alert on lightweight/lightship inclusion of fire-fighting media. Source: LR Class News 43/2016.",
    link: "https://www.lr.org/en/knowledge/class-news/43-16/",
  },
  {
    id: "cn-20-16", status: "active",
    date: "01/01/2016", kind: "regulation",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Revised guidelines for in-service testing of sprinkler & water mist systems",
    media: ["water"],
    effective: null,
    summary: "IMO issued revised guidelines for the in-service testing of automatic sprinkler and automatic water mist systems (MSC.1/Circ.1516, amending MSC.1/Circ.1432), adding quarterly water-quality and section-testing expectations.",
    points: [
      "Introduces in-service testing for water-based systems including water-quality checks and section function tests.",
      "Applies alongside MSC.1/Circ.1432 maintenance schedules.",
    ],
    refs: "MSC.1/Circ.1516. Source: LR Class News 20/2016.",
    link: "https://www.lr.org/en/knowledge/class-news/20-16/",
  },
  {
    id: "cn-39-17", status: "active",
    date: "01/01/2017", kind: "regulation",
    flag: "Bahamas",
    source: "LR",
    psc: false,
    title: "Bahamas \u2014 early implementation of SOLAS II-2/1 & 10 amendments",
    media: ["portable", "foam"],
    effective: null,
    summary: "Statutory alert: IMO resolution MSC.409(97) amended SOLAS Chapter II-2 to waive the requirement for a 135-litre foam-type wheeled fire extinguisher in machinery spaces in defined cases. The Bahamas Maritime Authority permitted early implementation.",
    points: [
      "MSC.409(97) removes the mandatory 135-litre foam wheeled extinguisher in certain machinery-space configurations.",
      "Bahamas-flag ships could apply the relief ahead of the general entry-into-force date.",
    ],
    refs: "SOLAS II-2/1 & II-2/10 (MSC.409(97)); Bahamas Maritime Authority early implementation. Source: LR Class News 39/2017.",
    link: "https://www.lr.org/en/knowledge/class-news/39-17/",
  },
  {
    id: "cn-24-18", status: "historical",
    date: "01/01/2018", kind: "safety",
    flag: "IMO / General",
    source: "LR",
    psc: true,
    mou: ["Riyadh MoU", "Indian Ocean MoU", "Abuja MoU"],
    title: "PSC CIC \u2014 Emergency Systems & Procedures (escape routes & markings)",
    media: ["structural", "lighting"],
    effective: null,
    summary: "A Port State Control Concentrated Inspection Campaign on Emergency Systems and Procedures was run concurrently by the Riyadh, Indian Ocean and Abuja MoUs, with a focus that included escape routes and the location markings of safety equipment.",
    points: [
      "PSC checks covered escape-route arrangements, low-location lighting/markings, and crew familiarity with emergency procedures.",
      "Although the campaign period has passed, it indicates recurring PSC focus areas for emergency systems.",
    ],
    refs: "Riyadh / Indian Ocean / Abuja MoU PSC CIC on Emergency Systems & Procedures. Source: LR Class News 24/2018.",
    link: "https://www.lr.org/en/knowledge/class-news/24-18/",
  },
  {
    id: "cn-29-14", status: "historical",
    date: "01/09/2014", kind: "safety",
    flag: "IMO / General",
    source: "LR",
    psc: true,
    mou: ["Caribbean MoU"],
    title: "Caribbean MoU \u2014 Port State Control inspection campaign (2014)",
    media: ["detection", "water", "foam", "gas", "portable", "ba"],
    effective: null,
    summary: "The Caribbean Memorandum of Understanding on Port State Control launched its second Concentrated Inspection Campaign from 1 September 2014, verifying compliance and operational readiness of ship safety systems.",
    points: [
      "Indicates the kinds of safety-system checks Caribbean MoU PSC officers prioritise.",
      "Historical campaign, retained for reference.",
    ],
    refs: "Caribbean MoU PSC Concentrated Inspection Campaign (from 01/09/2014). Source: LR Class News 29/2014.",
    link: "https://www.lr.org/en/knowledge/class-news/29-14/",
  },
  {
    id: "cn-03-18", status: "active",
    date: "01/01/2018", kind: "safety",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Kidde safety bulletin \u2014 cylinder replacement (HFC227 / Novec 1230)",
    media: ["gas"],
    effective: null,
    summary: "Kidde Fire Protection issued a safety bulletin requiring hardware replacement of certain cylinders used in HFC227ea and Novec 1230 clean-agent fire-extinguishing systems.",
    points: [
      "Affected cylinders require hardware replacement per the manufacturer's bulletin.",
      "Check whether installed clean-agent system cylinders fall within the affected batches and arrange remediation with an approved service supplier.",
    ],
    refs: "Kidde Fire Protection safety bulletin (clean-agent system cylinders). Source: LR Class News 03/2018.",
    link: "https://www.lr.org/en/knowledge/class-news/03-18/",
  },
  {
    id: "cn-04-18", status: "active",
    date: "01/01/2018", kind: "safety",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Cosmo Co. fire doors \u2014 quality defect notice",
    media: ["structural"],
    effective: null,
    summary: "Cosmo Co. Ltd issued an updated Notice Letter and Root Cause Analysis covering a quality issue discovered in a number of their manufactured fire doors.",
    points: [
      "A manufacturing quality defect was identified in affected fire doors.",
      "Verify whether installed fire doors are within the affected production and follow the maker's remediation guidance.",
    ],
    refs: "Cosmo Co. Ltd fire-door Notice Letter & Root Cause Analysis. Source: LR Class News 04/2018.",
    link: "https://www.lr.org/en/knowledge/class-news/04-18/",
  },
  {
    id: "cn-19-23", status: "active",
    date: "01/01/2023", kind: "safety",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Safety notice \u2014 NK Co. Ltd CO\u2082 system cylinders",
    media: ["gas"],
    effective: null,
    summary: "A safety notice was issued concerning CO\u2082 fire-extinguishing system cylinders manufactured by NK Co. Ltd.",
    points: [
      "Affected CO\u2082 cylinders are the subject of a manufacturer/authority safety notice.",
      "Check installed CO\u2082 system cylinders against the affected manufacturer details and follow the notice's instructions.",
    ],
    refs: "Safety notice for NK Co. Ltd CO\u2082 system cylinders. Source: LR Class News 19/2023.",
    link: "https://www.lr.org/en/knowledge/class-news/19-23/",
  },
  {
    id: "cn-23-23", status: "active",
    date: "01/01/2023", kind: "safety",
    flag: "EU",
    source: "LR",
    psc: false,
    title: "Safety recall \u2014 AWG fire hose nozzles",
    media: ["water", "portable"],
    effective: null,
    summary: "The EU Commission's Safety Gate rapid alert system issued Alert A12/01695/23 for defective AWG fire hose nozzles.",
    points: [
      "Defective fire hose nozzles are subject to an EU Safety Gate recall.",
      "Check fire hose nozzle inventory against the recall and replace affected units.",
    ],
    refs: "EU Safety Gate Alert A12/01695/23 (AWG fire hose nozzles). Source: LR Class News 23/2023.",
    link: "https://www.lr.org/en/knowledge/class-news/23-23/",
  },
  {
    id: "cn-14-14", status: "active",
    date: "01/01/2014", kind: "safety",
    flag: "United States",
    source: "LR",
    psc: false,
    title: "USCG \u2014 operational readiness of local application water spray systems",
    media: ["water"],
    effective: null,
    summary: "The U.S. Coast Guard issued a safety bulletin highlighting deficiencies in the operational readiness of local application fire-fighting (water spray) systems protecting machinery-space hazards.",
    points: [
      "Local application water spray systems were found not fully operational during inspections.",
      "Confirm nozzles, sections and release arrangements are tested and ready per the maintenance schedule.",
    ],
    refs: "USCG safety bulletin (local application water spray systems). Source: LR Class News 14/2014.",
    link: "https://www.lr.org/en/knowledge/class-news/14-14/",
  },
  {
    id: "cn-03-15", status: "active",
    date: "01/01/2015", kind: "safety",
    flag: "United States",
    source: "LR",
    psc: false,
    title: "USCG detentions \u2014 water mist system deficiencies (update)",
    media: ["water"],
    effective: null,
    summary: "The U.S. Coast Guard reported having detained over 40 foreign-flag vessels for water mist system deficiencies, underlining the need for proper maintenance and testing of these systems.",
    points: [
      "Common issues relate to maintenance, testing and operational readiness of water mist systems.",
      "Ensure water mist systems are maintained and tested per MSC.1/Circ.1432 / 1516 and the maker's instructions.",
    ],
    refs: "USCG PSC detentions for water mist deficiencies. Source: LR Class News 03/2015.",
    link: "https://www.lr.org/en/knowledge/class-news/03-15/",
  },
  {
    id: "cn-35-13", status: "active",
    date: "01/01/2013", kind: "safety",
    flag: "United States",
    source: "LR",
    psc: false,
    title: "USCG detentions \u2014 inoperative water mist systems",
    media: ["water"],
    effective: null,
    summary: "The U.S. Coast Guard issued several Port State Control detentions for inoperative water mist systems, an early warning that became a sustained enforcement focus.",
    points: [
      "Water mist systems found inoperative led to PSC detentions.",
      "Maintain and function-test water mist systems and keep records available for inspection.",
    ],
    refs: "USCG PSC detentions for inoperative water mist systems. Source: LR Class News 35/2013.",
    link: "https://www.lr.org/en/knowledge/class-news/35-13/",
  },
  {
    id: "cn-11-23", status: "active",
    date: "01/01/2023", kind: "safety",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Engine-room safety \u2014 pipe compression fittings & fire prevention",
    media: ["structural"],
    effective: null,
    summary: "Engine-room safety alert addressing the role of pipe compression fittings in oil leaks and machinery-space fire prevention.",
    points: [
      "Compression fittings on oil/fuel lines can loosen or fail, creating spray-fire risk on hot surfaces.",
      "Inspect, correctly install and maintain pipe fittings, and ensure hot-surface shielding and insulation are intact.",
    ],
    refs: "Engine-room safety \u2014 pipe compression fittings & fire prevention. Source: LR Class News 11/2023.",
    link: "https://www.lr.org/en/knowledge/class-news/11-23/",
  },
  {
    id: "cn-06-25", status: "active",
    date: "01/01/2025", kind: "regulation",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Engine-room means of escape arrangements",
    media: ["structural", "lighting"],
    effective: null,
    summary: "Class News addressing engine-room means of escape arrangements \u2014 the provision, arrangement and protection of escape routes from machinery spaces.",
    points: [
      "Concerns the number, arrangement and protection of escape routes from machinery spaces under SOLAS II-2.",
      "Refer to the Class News and applicable SOLAS II-2 regulations for the detailed arrangement requirements.",
    ],
    refs: "Engine-room means of escape arrangements. Source: LR Class News 06/2025.",
    link: "https://www.lr.org/en/knowledge/class-news/06-25/",
  },
  {
    id: "cn-19-19", status: "active",
    date: "01/01/2019", kind: "safety",
    flag: "Norway",
    source: "LR",
    psc: false,
    title: "Mitigating lithium battery system fires",
    media: ["detection", "water"],
    effective: null,
    summary: "The Norwegian Maritime Authority alerted shipowners and operators to the hazards of lithium battery systems, including thermal runaway and the challenges of detecting and extinguishing battery fires.",
    points: [
      "Lithium battery fires can self-sustain (thermal runaway) and re-ignite, challenging conventional fixed systems.",
      "Consider detection, ventilation, containment and dedicated fire-fighting/cooling arrangements for battery spaces.",
    ],
    refs: "Norwegian Maritime Authority alert on lithium battery system fires. Source: LR Class News 19/2019.",
    link: "https://www.lr.org/en/knowledge/class-news/19-19/",
  },
  {
    id: "cn-19-15", status: "active",
    date: "01/01/2015", kind: "regulation",
    flag: "Norway",
    source: "LR",
    psc: false,
    title: "Norway NMA Reg. 227 \u2014 fire & explosion on mobile offshore units",
    media: ["detection", "water", "foam", "gas", "structural"],
    effective: null,
    summary: "The Norwegian Maritime Authority updated Regulation No. 227 on precautionary measures against fire and explosion on mobile offshore units (MOUs).",
    points: [
      "Applies to mobile offshore units under Norwegian requirements.",
      "Covers fire/explosion prevention, detection and protection measures specific to MOUs.",
    ],
    refs: "Norwegian Maritime Authority Regulation No. 227 (fire & explosion, MOUs). Source: LR Class News 19/2015.",
    link: "https://www.lr.org/en/knowledge/class-news/19-15/",
  },
  {
    id: "cn-15-19", status: "active",
    date: "01/01/2019", kind: "regulation",
    flag: "China",
    source: "LR",
    psc: false,
    title: "China \u2014 control & monitoring of service suppliers",
    media: ["portable", "foam", "gas", "water", "detection", "ba"],
    effective: null,
    summary: "New regulations came into force in China for the control and monitoring of service suppliers \u2014 including firefighting equipment servicing (alongside life-saving appliances, navigation/radio equipment, thickness measurement/NDT and other IMO-required servicing).",
    points: [
      "Firefighting-equipment service suppliers operating in China are subject to control and monitoring requirements.",
      "Verify the approval status of service suppliers used for fire-protection servicing in China.",
    ],
    refs: "China service-supplier control & monitoring requirements. Source: LR Class News 15/2019.",
    link: "https://www.lr.org/en/knowledge/class-news/15-19/",
  },
  {
    id: "cn-01-20", status: "active",
    date: "01/01/2020", kind: "regulation",
    flag: "China",
    source: "LR",
    psc: false,
    title: "China \u2014 service supplier requirements (update)",
    media: ["portable", "foam", "gas", "water", "detection", "ba"],
    effective: null,
    summary: "An update to the new requirements for the control and monitoring of service suppliers in China, following the earlier 2019 alert.",
    points: [
      "Refines the China service-supplier control/monitoring framework introduced in 2019.",
      "Confirm current approval requirements for fire-protection service suppliers in China before arranging servicing.",
    ],
    refs: "Update to China service-supplier requirements. Source: LR Class News 01/2020.",
    link: "https://www.lr.org/en/knowledge/class-news/01-20/",
  },
  {
    id: "cn-26-15", status: "active",
    date: "01/01/2016", kind: "regulation",
    flag: "IMO / General",
    source: "LR",
    psc: false,
    title: "Means of escape from machinery spaces \u2014 SOLAS II-2/13.4",
    media: ["structural"],
    effective: "01/01/2016",
    summary: "IMO amended SOLAS Regulation II-2/13.4 to improve means of escape from machinery spaces on cargo ships, aligning them with existing passenger-ship arrangements. Applies to all new passenger and cargo ships constructed (keel laid) on or after 1 January 2016.",
    points: [
      "Two means of escape required from a machinery control room (new passenger and cargo ships).",
      "Two means of escape required from main workshops within the machinery space, with at least one route providing a continuous fire shelter to a safe position outside the machinery space.",
      "Inclined ladders/stairways with open treads in machinery spaces that form part of or give access to escape routes (and are not within a protected enclosure) must have steel shields fitted to their undersides.",
      "Terms \u2018main workshop\u2019, \u2018machinery control room\u2019, \u2018continuous fire shelter\u2019 and \u2018safe position\u2019 are clarified in the unified interpretation MSC.1/Circ.1511.",
    ],
    refs: "SOLAS II-2/13.4 (IMO Resolution MSC.365(93)); UI in MSC.1/Circ.1511. Source: LR Class News 26/2015.",
    link: "https://www.lr.org/en/knowledge/class-news/26-15/",
  },
  {
    id: "dnv-co2-deficiencies",
    status: "active",
    date: "23/10/2025",
    flag: "Marshall Islands",
    source: "DNV",
    psc: false,
    kind: "safety",
    title: "Deficiencies in CO\u2082 fire-extinguishing systems \u2014 depleted cylinders",
    media: ["gas"],
    effective: null,
    summary: "DNV identified cases where CO\u2082 fire-extinguishing systems had multiple depleted CO\u2082 cylinders, potentially compromising fire safety and vessel integrity. Two primary contributors were found: incorrect use of ultrasonic level gauges, and a bursting-disc material issue.",
    points: [
      "Ultrasonic level gauging above the maker's maximum cylinder temperature gives unreliable readings: at elevated temperatures CO\u2082 becomes a supercritical fluid with no liquid level to measure.",
      "Bursting-disc material: copper bursting discs in the cylinder valve are prone to fatigue failure \u2014 to date observed only in systems supplied by NK Co., Ltd. (South Korea) up to 2016. See Marshall Islands Maritime Safety Advisory No. 14-23.",
      "Keep the latest CO\u2082 user manual on board and follow it.",
      "Use approved service suppliers and stay within the applicable regulatory intervals.",
      "Use ultrasonic level gauges only within the manufacturer's specified temperature range for the liquid-level test of CO\u2082 cylinders.",
    ],
    refs: "DNV Technical & Regulatory News (23 Oct 2025); Marshall Islands Maritime Safety Advisory No. 14-23.",
    link: "https://www.dnv.com/news/2025/deficiencies-in-co2-fire-extinguishing-systems/",
  },
  {
    id: "dnv-pfos-documentation",
    status: "active",
    date: "04/05/2026",
    flag: "IMO / General",
    source: "DNV",
    psc: false,
    kind: "regulation",
    title: "Documenting PFOS-free fire-extinguishing foam on board",
    media: ["foam", "portable"],
    effective: "01/01/2026",
    summary: "At the first safety-equipment survey after 1 January 2026, all fire-extinguishing foams on board (fixed systems and portable equipment) must be PFOS-free, verified by the attending surveyor. This is the practical companion to the PFOS prohibition: how to document compliance and avoid part-held surveys or Conditions of Authority.",
    points: [
      "Applies to all foam on board \u2014 both fixed systems and portable equipment.",
      "Three ways to document PFOS-free foam: (1) a manufacturer's PFOS-free declaration; (2) an accredited-laboratory test report confirming PFOS below 10 mg/kg (0.001% by weight) to a recognised standard; or (3) a Type Approval / MED certificate stating PFOS-free (treated as equivalent to a declaration).",
      "If none can be provided, the foam must be replaced with PFOS-free foam and documented per (1), (2) or (3).",
      "Documentation must be traceable to the actual foam on board \u2014 manufacturer, foam type, production date / batch number, and relevant TA/MED references; on-board marking must support that traceability.",
      "\u2018First survey\u2019 = first annual, periodical or renewal survey for the Cargo Ship Safety Equipment, Cargo Ship Safety, Passenger Ship Safety, or HSC Safety Certificate. Prepare documentation early.",
    ],
    refs: "DNV Technical & Regulatory News (4 May 2026); follow-up to DNV News No. 37 (Nov 2025) on the PFOS prohibition. Basis: SOLAS II-2/10.11.",
    link: "https://www.dnv.com/news/2026/how-to-document-pfos-free-fire-extinguishing-foam-on-board/",
  },

  {
    id: "tec-1318",
    status: "active",
    date: "26/02/2024",
    flag: "Marshall Islands",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Fire-extinguishing arrangement for paint & flammable-liquid lockers — Marshall Islands",
    media: ["portable", "gas", "powder", "water"],
    effective: null,
    summary: "Marshall Islands special requirements (Marine Notice 2-011-6 Rev. 2023) for fire extinguishing of paint and flammable-liquid lockers, scaled by locker deck area and keel-laying date.",
    points: [
      "Small lockers: one or two portable extinguishers located outside the entrance, depending on area and build date.",
      "Larger lockers: a fixed system — CO₂ (≥40% of gross volume), dry powder (≥0.5 kg/m³), or water spray (≥5 L/m² of deck area per minute).",
      "Thresholds tighten for newer vessels; post-2002 ships follow SOLAS II-2/10.6.3 and MSC.1/Circ.1275 guidance.",
    ],
    refs: "Marshall Islands Marine Notice 2-011-6 Rev. 2023. Source: ClassNK Technical Information No. TEC-1318 (26 Feb 2024).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1318e.pdf",
  },
  {
    id: "tec-1280",
    status: "active",
    date: "09/12/2022",
    flag: "Panama",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Fire Control Plan graphical symbols & verification — Panama",
    media: ["structural"],
    effective: null,
    summary: "Panama Merchant Marine Circular MMC-277 on Fire Control Plan graphical symbols and their verification.",
    points: [
      "IMO Res. A.952(23) symbols to be incorporated if a Fire Control Plan is reissued, especially for ships keel-laid on/after 1 Jan 2004.",
      "IMO Res. A.1116(30) symbols to be used in combination with A.952(23) on ships constructed on/after 1 Jan 2019.",
    ],
    refs: "Panama MMC-277. Source: ClassNK Technical Information No. TEC-1280 (9 Dec 2022).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1280e.pdf",
  },
  {
    id: "tec-1256",
    status: "active",
    date: "08/02/2022",
    flag: "Cyprus",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Emergency escape breathing devices (EEBDs) — Cyprus",
    media: ["ba"],
    effective: null,
    summary: "Cyprus Circular 41/2021 specifying the required arrangement and number of EEBDs.",
    points: [
      "Both MSC/Circ.849 and MSC/Circ.1081 are to be followed.",
      "At least one additional EEBD, clearly marked ‘training’, must be available on board solely for training, irrespective of the number in place.",
      "Verified at the first SE periodical survey on/after 1 Jan 2022; Fire Control Plan and drawings to be revised accordingly.",
    ],
    refs: "Cyprus Circular 41/2021. Source: ClassNK Technical Information No. TEC-1256 (8 Feb 2022).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1256e.pdf",
  },
  {
    id: "tec-1232",
    status: "active",
    date: "20/04/2021",
    flag: "Malaysia",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Portable radio apparatus for fire-fighting parties — Malaysia",
    media: ["ba", "detection"],
    effective: null,
    summary: "Malaysia RO Instruction Rev 1.2020 on portable radio apparatus for fire-fighting parties (SOLAS II-2/10.10.4).",
    points: [
      "At least two explosion-proof or intrinsically-safe 2-way UHF radiotelephones per fire party (number based on the muster list).",
      "An additional two units to be carried for the command team.",
      "Fire-fighter radios should be distinctively coloured; conformity certification retained on board for verification.",
    ],
    refs: "Malaysia RO Instruction Rev 1.2020; SOLAS II-2/10.10.4. Source: ClassNK Technical Information No. TEC-1232 (20 Apr 2021).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1232e.pdf",
  },
  {
    id: "tec-1213",
    status: "active",
    date: "04/11/2020",
    flag: "Liberia",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Portable radios for fire-fighting parties — Liberia",
    media: ["ba"],
    effective: null,
    summary: "Liberia Marine Notice FIR-001 Rev. 07/20 on portable radios for fire-fighting parties (SOLAS II-2/10.10.4).",
    points: [
      "Each fire party must have at least two explosion-proof or intrinsically-safe portable radios dedicated to the fire party.",
      "Total number depends on the number of fire parties on the muster list / SMS, not the number of fire-fighter's outfits.",
      "Radios should be stored with the fire-fighter's outfit, or marked/coloured for ready identification.",
    ],
    refs: "Liberia Marine Notice FIR-001 Rev. 07/20; SOLAS II-2/10.10.4. Source: ClassNK Technical Information No. TEC-1213 (4 Nov 2020).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1213e.pdf",
  },
  {
    id: "tec-1181",
    status: "active",
    date: "19/04/2019",
    flag: "Cook Islands",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Graphical symbols for Fire Control Plans — Cook Islands",
    media: ["structural"],
    effective: null,
    summary: "Cook Islands Technical Circular 191/2018 on Fire Control Plan symbols and escape-route/equipment markings.",
    points: [
      "For ships constructed on/after 1 Jan 2019 (and existing ships undergoing relevant repairs/alterations), Res. A.1116(30) to be used together with Res. A.952(23).",
      "A.1116(30) harmonises SOLAS II-2/13, III/9, III/11 and III/20 markings with the ISO 24409 series.",
    ],
    refs: "Cook Islands Technical Circular 191/2018; IMO Res. A.1116(30) & A.952(23). Source: ClassNK Technical Information No. TEC-1181 (19 Apr 2019).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1181e.pdf",
  },
  {
    id: "tec-1178",
    status: "active",
    date: "19/03/2019",
    flag: "Cook Islands",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Two-way portable radios for fire-fighter communication — Cook Islands",
    media: ["ba"],
    effective: null,
    summary: "Cook Islands Technical Circular 179/2018 on fire-fighter communication (SOLAS II-2/10.10.4).",
    points: [
      "At least two two-way portable radiotelephones per fire party, of explosion-proof or intrinsically-safe type.",
      "Ships built on/after 1 Jul 2014 comply on delivery; earlier ships by the first survey after 1 Jul 2018.",
      "Stored with the fire-fighter's outfit; conformity and battery condition checked at SE periodical surveys.",
    ],
    refs: "Cook Islands Technical Circular 179/2018; SOLAS II-2/10.10.4. Source: ClassNK Technical Information No. TEC-1178 (19 Mar 2019).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1178e.pdf",
  },
  {
    id: "tec-1176",
    status: "active",
    date: "22/02/2019",
    flag: "Malta",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Graphical symbols for Fire Control Plans — Malta",
    media: ["structural"],
    effective: null,
    summary: "Malta Technical Notice SLS.30 Rev.1 on Fire Control Plan graphical symbols, by build date.",
    points: [
      "Pre-2004 ships may continue with A.654(16) symbols.",
      "Ships built 2004–2018: A.952(23) symbols.",
      "Ships built on/after 1 Jan 2019 (or whose plans are revised): A.1116(30) in combination with A.952(23).",
    ],
    refs: "Malta Technical Notice SLS.30 Rev.1; IMO Res. A.654(16)/A.952(23)/A.1116(30). Source: ClassNK Technical Information No. TEC-1176 (22 Feb 2019).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1176e.pdf",
  },
  {
    id: "tec-1168",
    status: "active",
    date: "27/12/2018",
    flag: "Greece",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Fire-fighter communication — Greece",
    media: ["ba"],
    effective: null,
    summary: "Greek flag implementation of SOLAS II-2/10.10.4 fire-fighter communication (Ref. 2322.1/52275/2018).",
    points: [
      "Fire-fighter radios are additional to other two-way radiotelephones required by SOLAS.",
      "Radios kept on immediate-operation mode on constant charge, recorded in each fire party's equipment list, and shown on the fire safety plan.",
      "Ships built on/after 1 Jan 2018 comply on delivery; earlier ships by the first SE periodical survey on/after 1 Jul 2019.",
    ],
    refs: "Greece Ref. 2322.1/52275/2018; SOLAS II-2/10.10.4. Source: ClassNK Technical Information No. TEC-1168 (27 Dec 2018).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1168e.pdf",
  },
  {
    id: "tec-1152",
    status: "active",
    date: "18/05/2018",
    flag: "IMO / General",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Exemption of 135 L foam extinguisher in boiler spaces — MSC.409(97)",
    media: ["portable", "foam"],
    effective: null,
    summary: "IMO Res. MSC.409(97): where boiler spaces are protected by the fixed local fire-extinguishing system required by SOLAS II-2/10.5.6, the 135 L foam extinguisher (or equivalent) of SOLAS II-2/10.5.1.2.2 is not required. In force 1 Jan 2020; early implementation per MSC.1/Circ.1566.",
    points: [
      "Applies only where the boiler space has the required fixed local fire-extinguishing system.",
      "ClassNK accepts a CO₂ extinguisher of ≥45 kg or a powder extinguisher of ≥40 kg as the ‘equivalent’ that may be removed.",
      "If the extinguisher is removed, the Fire Control Plan must be revised by the master (no Class approval of the revision required).",
    ],
    refs: "IMO Res. MSC.409(97); MSC.1/Circ.1566. Source: ClassNK Technical Information No. TEC-1152 (18 May 2018).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1152e.pdf",
  },
  {
    id: "tec-1027",
    status: "active",
    date: "22/05/2015",
    flag: "UK / Red Ensign",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Recharging of breathing-apparatus & spare cylinders — UK / Red Ensign group",
    media: ["ba"],
    effective: null,
    summary: "Special requirements for recharging breathing-apparatus cylinders and spare cylinders for UK, Bermuda, British Virgin Islands, Cayman Islands, Gibraltar and Isle of Man flags.",
    points: [
      "Where no on-board recharging means is provided, sufficient additional spare cylinders must be provided for training.",
      "At least one fully-charged training cylinder per required SCBA set; cylinders for training to be prominently marked.",
    ],
    refs: "UK / Red Ensign group flag requirements. Source: ClassNK Technical Information No. TEC-1027 (22 May 2015).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1027e.pdf",
  },
  {
    id: "tec-1020",
    status: "active",
    date: "23/01/2015",
    flag: "St. Vincent & the Grenadines",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Recharging of breathing-apparatus & spare cylinders — St. Vincent & the Grenadines",
    media: ["ba"],
    effective: null,
    summary: "St. Vincent and the Grenadines special requirements for recharging breathing-apparatus cylinders and spare cylinders.",
    points: [
      "Where no on-board recharging means is provided, at least one spare cylinder for drills per fire-fighting team.",
    ],
    refs: "St. Vincent & the Grenadines flag requirement. Source: ClassNK Technical Information No. TEC-1020 (23 Jan 2015).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1020e.pdf",
  },
  {
    id: "tec-1016",
    status: "active",
    date: "26/12/2014",
    flag: "Panama",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Spare charges, additional extinguishers & refilling — Panama",
    media: ["portable"],
    effective: null,
    summary: "Panama Merchant Marine Circular No. 281 on spare charges, additional portable fire extinguishers and refilling.",
    points: [
      "Spare charges for 100% of the first 10 rechargeable extinguishers and 50% of the remainder (max 60 total).",
      "For extinguishers that cannot be recharged on board, provide additional extinguishers of the same type/capacity/number instead.",
      "Number/arrangement of additional extinguishers per MSC.1/Circ.1275; record additions in the Fire Control Plan.",
    ],
    refs: "Panama MMC-281; MSC.1/Circ.1275. Source: ClassNK Technical Information No. TEC-1016 (26 Dec 2014).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1016e.pdf",
  },
  {
    id: "tec-1011",
    status: "active",
    date: "05/11/2014",
    flag: "Antigua & Barbuda",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Fire-fighter's outfit equipment — Antigua & Barbuda",
    media: ["ba"],
    effective: null,
    summary: "Antigua and Barbuda special requirements for fire-fighter's outfit equipment: BA cylinder recharging and fire-fighter communication.",
    points: [
      "At least two spare BA cylinders where recharging is met by spares, to allow a two-man team to drill.",
      "Fire-fighter two-way radios are additional to SOLAS III radios, stowed with the outfits and ready for use.",
      "Battery state-of-charge included in routine fire-fighting equipment inspections.",
    ],
    refs: "Antigua & Barbuda flag requirement; SOLAS II-2/10.10.4. Source: ClassNK Technical Information No. TEC-1011 (5 Nov 2014).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1011e.pdf",
  },
  {
    id: "tec-1009",
    status: "active",
    date: "21/10/2014",
    flag: "Singapore",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Recharging of breathing-apparatus & spare cylinders — Singapore",
    media: ["ba"],
    effective: null,
    summary: "Singapore special requirements for recharging breathing-apparatus cylinders and spare cylinders (SOLAS II-2/15.2.2.6).",
    points: [
      "Where no on-board recharging is provided, the company determines the suitable number of spare cylinders for drills.",
      "In no case fewer than two additional BA cylinders.",
    ],
    refs: "Singapore flag requirement; SOLAS II-2/15.2.2.6. Source: ClassNK Technical Information No. TEC-1009 (21 Oct 2014).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1009e.pdf",
  },
  {
    id: "tec-1008",
    status: "active",
    date: "10/10/2014",
    flag: "Bahamas",
    source: "ClassNK",
    psc: false,
    kind: "regulation",
    title: "Recharging of breathing-apparatus & spare cylinders — Bahamas",
    media: ["ba"],
    effective: null,
    summary: "Bahamas special requirements for recharging breathing-apparatus cylinders and spare cylinders.",
    points: [
      "Bahamas strongly recommends an on-board means of recharging BA cylinders.",
      "Where not provided, the company sets the number of training spares; at least one per fire suit (muster list), but not fewer than two in total.",
    ],
    refs: "Bahamas flag requirement. Source: ClassNK Technical Information No. TEC-1008 (10 Oct 2014).",
    link: "https://www.classnk.or.jp/hp/pdf/tech_info/tech_img/T1008e.pdf",
  },
  {
    id: "britannia-er-fire",
    status: "active",
    date: "25/08/2021",
    flag: "IMO / General",
    source: "Britannia P&I",
    psc: false,
    kind: "safety",
    title: "Engine-room fire \u2014 BSAFE incident case study (Britannia P&I)",
    media: ["detection", "gas", "structural"],
    effective: null,
    summary: "Britannia P&I BSAFE case study of an engine-room fire on the Ro-Ro ship FERNANDA. The fire probably started in the main switchboard and spread rapidly upward through open accesses to the funnel, crew accommodation, navigating bridge and an upper tween-deck cargo space. The fixed halon system failed to extinguish it. A useful lesson on boundary closure, manning and fixed-system effectiveness.",
    points: [
      "Two fire dampers were left open when the engine room was being closed down for the fixed (halon) system to operate \u2014 incomplete boundary closure let the fire breathe and the agent leak away.",
      "Before releasing a fixed gas system, confirm the space is fully sealed: close all dampers, ventilation, skylights, funnel flaps and quick-closing valves per the boundary-closure checklist.",
      "The engine room was unmanned although the ship was not certified for unattended machinery spaces; both watchkeepers were absent and the alarm went unheard, delaying detection and first response.",
      "Fixed fire-extinguishing systems only work if the protected space is gas-tight and the agent quantity is intact \u2014 reinforces routine checks of detection, dampers and the fixed-system charge.",
    ],
    refs: "Britannia P&I BSAFE Incident Case Study No. 10 & Commentary (Aug 2021); ship FERNANDA.",
    link: "https://britanniapandi.com/2021/08/bsafe-incident-case-study-10-engine-room-fire/",
  },
  {
    id: "hkmd-nozzle-psc",
    status: "active",
    date: "03/02/2023",
    flag: "Hong Kong",
    source: "Hong Kong MD",
    psc: false,
    kind: "safety",
    title: "PSC detainable deficiencies \u2014 blocked discharge nozzles of fixed fire-fighting systems",
    media: ["water", "foam", "gas", "powder"],
    effective: null,
    summary: "Hong Kong Marine Department alert after a Hong Kong-registered ship was detained by the USCG because a number of fixed-system discharge nozzles were blocked, rendering the system not readily available for immediate use. Defective or clogged discharge nozzles have been a recurring detainable PSC deficiency.",
    points: [
      "SOLAS II-2/14.2.1.2 requires fire-fighting systems and appliances to be kept in good working order and readily available for immediate use.",
      "Carry out onboard maintenance and inspection per the ship\u2019s maintenance plan and the IMO guidelines MSC.1/Circ.1432 (as amended by MSC.1/Circ.1516).",
      "Thoroughly inspect fixed systems \u2014 including the cleanliness of discharge nozzles \u2014 before calling at any port, not only in the US.",
      "If a defect cannot be rectified before arrival, notify the port authority, class and the flag Administration in advance; arrange rectification without delay or apply for dispensation.",
    ],
    refs: "Hong Kong Marine Department letter (3 Feb 2023); SOLAS II-2/14.2.1.2; MSC.1/Circ.1432 & 1516.",
    link: "https://www.mardep.gov.hk/filemanager/en/share/faq/pdf/let230203.pdf",
  },
  {
    id: "imo-fsi20-accom-fire",
    status: "active",
    date: "01/01/2012",
    flag: "IMO / General",
    source: "IMO",
    psc: false,
    kind: "safety",
    title: "Lessons learned \u2014 crew-accommodation fires (IMO FSI 20)",
    media: ["detection", "portable", "water", "structural", "ba", "lighting"],
    effective: null,
    summary: "IMO \u2018Lessons Learned for Seafarers\u2019 (FSI 20). Two very serious accommodation fires with fatalities: on an old cement carrier, wooden accommodation partitions and doors spread fire rapidly, with no EEBDs and unmarked escape routes; on a bulk carrier, a fire started from a portable cooking heater in a cabin, no fire alarm sounded, and portable extinguishers and hoses were found not working.",
    points: [
      "On older ships built to earlier SOLAS standards, combustible (wooden) accommodation construction can spread fire very rapidly \u2014 alert crews to the elevated risk.",
      "Prohibit appliances that create a fire hazard in cabins (e.g. portable heaters/stoves used for cooking).",
      "Carry out effective routine maintenance, inspection and testing of fire-fighting appliances \u2014 in one case extinguishers did not work and no water came from the hoses \u2014 plus regular drills.",
      "Provide EEBDs and clearly mark escape routes with photoluminescent indicators; ensure fire alarms function and are heard.",
      "Maintain effective ship-shore communication: in one case the master neither alerted the company nor sent distress signals, gravely delaying search and rescue.",
    ],
    refs: "IMO \u2018Lessons Learned for Presentation to Seafarers\u2019, FSI 20 (fire-safety cases 1 & 2). Other (non-fire) cases in the source are not included here.",
    link: "https://wwwcdn.imo.org/localresources/en/OurWork/IIIS/Documents/Lessons%20learned%20English/j%20FSI%2020.pdf",
  },

  {
    id: "gard-fire-overview",
    status: "active",
    date: "08/05/2022",
    flag: "IMO / General",
    source: "Gard",
    psc: false,
    kind: "safety",
    title: "Fire safety onboard ships — a continuous cause for concern (Gard)",
    media: ["detection", "water", "foam", "gas", "powder", "portable", "structural", "ba"],
    effective: null,
    summary: "Gard overview drawing on the USCG PSC Annual Report and Cefor casualty statistics: the same fire-safety deficiencies recur year after year, and the overall frequency of ship fires is not improving — most still originate in the engine room.",
    points: [
      "Recurring detainable deficiencies: fuel-oil leaks and oil-soaked lagging, disabled quick-closing valves, disconnected/defeated fire detectors, breached structural fire protection (fire doors, dampers, ducting), inoperable fixed systems (closed discharge valves, clogged nozzles), weak fire pumps, and depressurised portable extinguishers.",
      "SOLAS II-2/14 requires fire-protection equipment to be kept in good order and ready for immediate use; SOLAS I/11 requires defects affecting safety to be reported to class and flag.",
      "Risk is highest during and just after maintenance — missing hot-work permits, no fire watch, and insulation/spray shields left un-refitted.",
      "Best prevention is a well-trained crew with shared understanding of engine-room fire hazards (ISM Code Ch.3, 6 & 10).",
    ],
    refs: "Gard Insight, 8 May 2022 (USCG PSC Annual Report 2021; Cefor/NoMIS 2021).",
    link: "https://gard.no/en/insights/fire-safety-onboard-ships-continuous-cause-for-concern/",
  },
  {
    id: "gard-cs-er-fire-ffsystems",
    status: "active",
    date: "01/05/2021",
    flag: "IMO / General",
    source: "Gard",
    psc: false,
    kind: "safety",
    title: "Case study — engine-room fire and failure of fixed fire-fighting systems (Gard)",
    media: ["gas", "water", "detection", "powder"],
    effective: null,
    summary: "Gard case study: on an ultra-large container ship, fuel from a fractured, locally-fabricated fuel pressure-sensing line sprayed onto unprotected hot surfaces of an auxiliary engine. The water mist system failed twice and the fixed CO₂ system largely failed to discharge.",
    points: [
      "Fire cause: a locally-fabricated fuel pressure line of inferior specification, poorly supported, cracked from vibration fatigue (the maker had issued service letters warning of this).",
      "Water mist failed: auto-activation needed two flame detectors but only one tripped (the other was fogged by fuel mist), and the local control had been left in ‘manual’ after maintenance — the crew did not know how to override it.",
      "Fixed CO₂ failed: of 397 cylinders only 170 discharged; new flexible pilot/discharge hoses fitted at the last service had a different connection profile and did not seal — leaks at all connections. A bottle-leakage alarm went unnoticed.",
      "Reignition occurred when power/fuel was restored — confirm a fire is fully out and the space safe before restoring machinery; verify third-party-fitted parts match the original specification.",
    ],
    refs: "Gard case study (May 2021); ultra-large container ship.",
    link: "https://assets.eu.ctfassets.net/jchk06tdml2i/adc2c3d7f06b4cb08d08d7d7c898b4cc/8e990ea057687be348ff3ed59141befc/Gard_20Case_20study_20-_20engine_20room_20fire_20and_20failure_20of_20fire_20fighting_20systems.pdf",
  },
  {
    id: "gard-cs-er-fire-lubeoil",
    status: "active",
    date: "01/07/2016",
    flag: "IMO / General",
    source: "Gard",
    psc: false,
    kind: "safety",
    title: "Case study — engine-room fire from a lube-oil filter failure (Gard)",
    media: ["portable", "ba", "structural"],
    effective: null,
    summary: "Gard case study: on a bulk carrier, a sheared lube-oil filter cover bolt on a running auxiliary engine displaced the cover; pressurised lube oil sprayed onto hot surfaces and ignited. The crew sealed the space and extinguished it with portable/semi-portable extinguishers under SCBA.",
    points: [
      "A filter cover bolt sheared (improperly tightened; fittings can loosen from vibration) — regular inspection routines were lacking.",
      "Lube-oil primer pumps kept running after engine shutdown because emergency power restored them, emptying the sump and feeding the fire.",
      "Spray shields and extra bolt-securing arrangements were not fitted to the auxiliary-engine lube-oil pipes and filters.",
      "Engine ratings were carrying out filter work unsupervised while officers were in a meeting — clear delegation and supervision matter; know all engine-room openings to close in a fire.",
    ],
    refs: "Gard case study (Jul 2016); bulk carrier.",
    link: "https://assets.eu.ctfassets.net/jchk06tdml2i/527372bd447041659b9e6e1831da9b47/fae2f87edf8c4a171572ffe17b4ef2ae/Gard_20AS_20-_20Case_20study_20-_20engine_20room_20fire.pdf",
  },
  {
    id: "gard-cs-co2-use",
    status: "active",
    date: "01/02/2018",
    flag: "IMO / General",
    source: "Gard",
    psc: false,
    kind: "safety",
    title: "Case study — effective use of fixed CO₂ systems (Gard, from UK MAIB)",
    media: ["gas"],
    effective: null,
    summary: "Gard case study based on a UK MAIB report: after an engine-room fire (a rubber coupling between main engine and shaft generator overheated), the crew released the fixed CO₂ system but the master kept the main engine and a generator running at slow speed — the machinery drew air from the space and consumed the CO₂, compromising the system.",
    points: [
      "A fixed gas system only works if the protected space is completely sealed and shut down — running machinery takes air from the space and consumes the agent, reducing effectiveness.",
      "Before releasing CO₂: muster and headcount, stop main engine and machinery, shut fire flaps, vents and fuel pumps, and close all openings.",
      "On re-entry after CO₂ flooding, beware reignition and backdraft, and check for hot spots; understand the CO₂ hazard to personnel.",
      "Crew should understand the system’s limitations and feel able to question a senior officer when a response is unsafe.",
    ],
    refs: "Gard case study (Feb 2018), based on a UK MAIB report.",
    link: "https://assets.eu.ctfassets.net/jchk06tdml2i/2cc9f95ea3b7442ab231d4736e740c59/fb9ab3094fd4ff20c2b99a3865e9cc47/Gard_20-_20Case_20study_20_20-_20use_20of_20fixed_20and_20portable_20fire_20extinguishers.pdf",
  },
  {
    id: "gard-lpc-er-prevention",
    status: "active",
    date: "01/03/2012",
    flag: "IMO / General",
    source: "Gard",
    psc: false,
    kind: "safety",
    title: "Loss Prevention Circular — fire prevention in engine rooms (Gard)",
    media: ["structural"],
    effective: null,
    summary: "Gard Loss Prevention Circular No. 02-12: most ship fires start in the engine room, with flammable-oil leaks impinging on hot surfaces the leading cause. Identifying and protecting high-temperature surfaces is a highly effective, practical preventive measure.",
    points: [
      "Mandatory since July 2003 (SOLAS II-2/4): jacketed double pipes on HP fuel lines; insulation of hot surfaces above 220°C at risk of oil impingement; spray shields on fuel/lube/hydraulic oil lines near ignition sources.",
      "Keep the engine room clean and deal with oil leaks promptly; regularly check spray-shield position/condition and jacketed-pipe drainage.",
      "Insulation degrades — inspect visually and with infrared thermo-scanning (annually recommended) to find surfaces over 220°C.",
      "Refit spray shields and insulation immediately after maintenance; consult IMO MSC.1/Circ.1321 for engine-room/pump-room fire-prevention integrity standards.",
    ],
    refs: "Gard Loss Prevention Circular No. 02-12 (Mar 2012); SOLAS II-2/4; MSC.1/Circ.1321.",
    link: "https://assets.eu.ctfassets.net/jchk06tdml2i/28fcde8beedf4059894d2cec3deade8a/b885409cf7e10e38d5195e587ec5b2e4/Gard_20LPC_20Fire_20prevention_20in_20engine_20rooms.pdf",
  },
];

// media id -> advisories that flag it (for inline markers)
function advisoriesForMedium(mediumId) {
  return SAFETY_ADVISORIES.filter(a => a.media.includes(mediumId));
}

// Display metadata per advisory kind. Add a new kind here + its CSS classes
// (.alert-<kind>, .alert-badge-<kind>, .row-advisory-<kind>) to extend.
const ALERT_KIND_META = {
  all:            { label: "All" },
  regulation:     { label: "Regulation",     icon: <ShieldAlert size={13} /> },
  safety:         { label: "Safety lesson",  icon: <AlertTriangle size={13} /> },
  recommendation: { label: "Recommended",    icon: <Info size={13} /> },
};

// Alert lifecycle status. `active` = current/in-force/ongoing relevance;
// `historical` = concluded campaign, superseded rule, or past one-off recall
// kept for reference. Drives a small status pill and a filter.
const ALERT_STATUS_META = {
  active:     { label: "Active",     color: "#0d9488", bg: "#f0fdfa", bd: "#99f6e4" },
  historical: { label: "Historical", color: "#64748b", bg: "#f1f5f9", bd: "#cbd5e1" },
};

const ivColor = (i) => ({
  "Weekly": "#3b82f6", "Monthly": "#0891b2", "Quarterly": "#7c3aed", "Annual": "#0d9488",
  "2-Year": "#ca8a04", "5-Year": "#dc2626", "10-Year": "#475569",
}[i] || "#475569");

// ===========================================================================
//  SURVEY PLANNER — SHIP AGE-BASED MAINTENANCE SCHEDULING ENGINE
//  ---------------------------------------------------------------------------
//  Given a build date (and optional commissioning / last-completed overrides),
//  computes which periodic fire-protection items are OVERDUE / DUE THIS YEAR /
//  UPCOMING / NOT YET REQUIRED, based on each item's interval cycle.
//
//  IMPORTANT — this is a PLANNING AID, not a compliance record. Without an
//  actual last-completed date it assumes the theoretical cycle from build/
//  commissioning. Surveyors can enter a last-completed date per item type to
//  make the projection accurate.
//
//  To extend: add a line to MILESTONE_ITEMS. Two interval shapes are supported:
//    { intervalYears: N }                       -> recurs every N years from start
//    { initialIntervalYears: A, recurringIntervalYears: B }
//        -> first due A years after start, then every B years
// ===========================================================================

// Periodic items worth scheduling by vessel age. Weekly/monthly/quarterly are
// continuous routine checks, so they're excluded from age-based milestones.
// `cat` (category) and `m` (medium id) drive the planner filters.
const MILESTONE_ITEMS = [
  // ----- Annual (recur every 1 yr from delivery) -----
  { equipment: "Portable fire extinguisher inspection", m: "portable", cat: "Annual", intervalYears: 1, src: "A.951(23) §9.1", applicableShipTypes: ["all"], requiresApprovedSupplier: false, serviceSupplierNotes: "Normally ship staff — annual verification.", solasReference: "II-2/14.2.2", mscReference: "—", fssReference: "Ch. 4", interpretationNotes: "Hydrostatic interval subject to flag/Class." },
  { equipment: "Wheeled extinguisher periodical inspection", m: "portable", cat: "Annual", intervalYears: 1, src: "1432 §7.12", applicableShipTypes: ["all"], requiresApprovedSupplier: false, serviceSupplierNotes: "Ship staff routine inspection.", solasReference: "II-2/14.2.2", mscReference: "§7.12", fssReference: "Ch. 4", interpretationNotes: "" },
  { equipment: "Fixed gas system annual inspection", m: "gas", cat: "Annual", intervalYears: 1, src: "1432 §7.3", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Annual inspection normally by an approved service supplier.", solasReference: "II-2/14.2.2", mscReference: "§7.3", fssReference: "Ch. 5", interpretationNotes: "" },
  { equipment: "CO\u2082 system annual inspection", m: "gas", cat: "Annual", intervalYears: 1, src: "1318R1 §5", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Annual CO₂ system check normally by an approved service supplier.", solasReference: "II-2/14.2.2", mscReference: "§5 (1318/Rev.1)", fssReference: "Ch. 5", interpretationNotes: "Per MSC.1/Circ.1318/Rev.1." },
  { equipment: "Fire detection & alarm annual test", m: "detection", cat: "Annual", intervalYears: 1, src: "1432 §7.2", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Functional testing often by an approved service supplier or maker.", solasReference: "II-2/7", mscReference: "§7.2", fssReference: "Ch. 9", interpretationNotes: "" },
  { equipment: "Foam system functional test", m: "foam", cat: "Annual", intervalYears: 1, src: "1432 §7.4", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Functional test typically with approved service supplier attendance.", solasReference: "II-2/10", mscReference: "§7.4", fssReference: "Ch. 6/14", interpretationNotes: "" },
  { equipment: "Water mist/spray/sprinkler annual test", m: "water", cat: "Annual", intervalYears: 1, src: "1432 §7.5 / 1516", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Annual test often by approved service supplier; see MSC.1/Circ.1516.", solasReference: "II-2/10", mscReference: "§7.5", fssReference: "Ch. 7/8", interpretationNotes: "In-service testing per MSC.1/Circ.1516." },
  { equipment: "Breathing apparatus annual check", m: "ba", cat: "Annual", intervalYears: 1, src: "1432 §7.8", applicableShipTypes: ["all"], requiresApprovedSupplier: false, serviceSupplierNotes: "Routine check by ship staff; cylinder testing by approved facility.", solasReference: "II-2/10", mscReference: "§7.8", fssReference: "Ch. 3", interpretationNotes: "" },
  { equipment: "Dry powder system annual inspection", m: "powder", cat: "Annual", intervalYears: 1, src: "1432 §7.9", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Annual inspection normally by an approved service supplier.", solasReference: "II-2/10", mscReference: "§7.9", fssReference: "Ch. 6", interpretationNotes: "" },
  // Foam concentrate analysis: first test within 3 yrs of supply, annually after.
  { equipment: "Foam concentrate analysis", m: "foam", cat: "Foam", initialIntervalYears: 3, recurringIntervalYears: 1, src: "1312 §4\u20135", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Periodical analysis by an approved laboratory / service supplier.", solasReference: "II-2/10", mscReference: "§4-5 (1312)", fssReference: "Ch. 14", interpretationNotes: "Per MSC.1/Circ.1312; first test within 3 yrs, then annually." },

  // ----- 2-Year -----
  { equipment: "Fixed gas cylinder weighing (>95% charge)", m: "gas", cat: "Hydrostatic / cylinder", intervalYears: 2, src: "1432 §8.1", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Cylinder content check normally by an approved service supplier.", solasReference: "II-2/14.2.2", mscReference: "§8.1", fssReference: "Ch. 5", interpretationNotes: "" },
  { equipment: "CO\u2082 cylinder content verification", m: "gas", cat: "CO\u2082", intervalYears: 2, src: "1318R1 §6.1", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Content verification by an approved service supplier (weigh / level).", solasReference: "II-2/14.2.2", mscReference: "§6.1 (1318/Rev.1)", fssReference: "Ch. 5", interpretationNotes: "Refill if <90/95%; per MSC.1/Circ.1318/Rev.1." },
  { equipment: "Dry powder 2-yearly test & pipe blow-through", m: "powder", cat: "2-Year", intervalYears: 2, src: "1432 §8.2", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "2-yearly test normally by an approved service supplier.", solasReference: "II-2/10", mscReference: "§8.2", fssReference: "Ch. 6", interpretationNotes: "" },
  { equipment: "Water mist pressure-cylinder weighing", m: "water", cat: "2-Year", intervalYears: 2, src: "1432 §8.1 (cyl.)", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Pressure-cylinder check normally by approved service supplier.", solasReference: "II-2/10", mscReference: "§8.1", fssReference: "Ch. 7", interpretationNotes: "" },

  // ----- 5-Year -----
  { equipment: "Foam system internal valve inspection", m: "foam", cat: "5-Year", intervalYears: 5, src: "1432 §9.2", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "5-yearly internal inspection normally by approved service supplier.", solasReference: "II-2/10", mscReference: "§9.2", fssReference: "Ch. 6/14", interpretationNotes: "" },
  { equipment: "Fixed gas internal valve inspection", m: "gas", cat: "5-Year", intervalYears: 5, src: "1432 §9.1", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "5-yearly internal valve inspection by approved service supplier.", solasReference: "II-2/14.2.2", mscReference: "§9.1", fssReference: "Ch. 5", interpretationNotes: "" },
  { equipment: "CO\u2082 control-valve internal inspection", m: "gas", cat: "CO\u2082", intervalYears: 5, src: "1318R1 §7", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Control-valve internal inspection by approved service supplier.", solasReference: "II-2/14.2.2", mscReference: "§7 (1318/Rev.1)", fssReference: "Ch. 5", interpretationNotes: "Per MSC.1/Circ.1318/Rev.1." },
  { equipment: "SCBA cylinder hydrostatic test", m: "ba", cat: "Hydrostatic / cylinder", intervalYears: 5, src: "1432 §9.4", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Hydrostatic test by an approved testing facility.", solasReference: "II-2/10", mscReference: "§9.4", fssReference: "Ch. 3", interpretationNotes: "" },
  { equipment: "EEBD cylinder hydrostatic test", m: "ba", cat: "Hydrostatic / cylinder", intervalYears: 5, src: "IACS Rec.88", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Hydrostatic test by an approved testing facility.", solasReference: "II-2/13", mscReference: "—", fssReference: "Ch. 3", interpretationNotes: "Interval per IACS Rec.88 / maker." },
  { equipment: "Low-location lighting luminance test", m: "lighting", cat: "5-Year", intervalYears: 5, src: "1432 §9.5", applicableShipTypes: ["all"], requiresApprovedSupplier: false, serviceSupplierNotes: "Photoluminescent/electrical LLL check; staff or supplier.", solasReference: "II-2/13", mscReference: "§9.5", fssReference: "Ch. 11", interpretationNotes: "" },
  { equipment: "Water mist control/section valve internal inspection", m: "water", cat: "5-Year", intervalYears: 5, src: "1432 §9.3 / 1516 §9.3", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Internal inspection normally by approved service supplier.", solasReference: "II-2/10", mscReference: "§9.3", fssReference: "Ch. 7/8", interpretationNotes: "Per MSC.1/Circ.1516 §9.3." },
  { equipment: "Portable extinguisher test-discharge (sample)", m: "portable", cat: "5-Year", intervalYears: 5, src: "A.951(23) §9.1.1", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Test-discharge & recharge by an approved service supplier.", solasReference: "II-2/14.2.2", mscReference: "—", fssReference: "Ch. 4", interpretationNotes: "Per resolution A.951(23)." },

  // ----- 10-Year -----
  { equipment: "Fixed gas cylinder hydrostatic test (10%)", m: "gas", cat: "Hydrostatic / cylinder", intervalYears: 10, src: "1432 §10.1", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Hydrostatic test of cylinders by an approved facility.", solasReference: "II-2/14.2.2", mscReference: "§10.1", fssReference: "Ch. 5", interpretationNotes: "10% sample at 10 yrs (see circular)." },
  { equipment: "CO\u2082 HP cylinder hydrostatic test", m: "gas", cat: "CO\u2082", intervalYears: 10, src: "1318R1 §6.1.2", note: "Special regime: ALL cylinders tested before the 20th anniversary and every 10 yrs thereafter (1318R1).", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "HP cylinder hydrostatic test by an approved facility.", solasReference: "II-2/14.2.2", mscReference: "§6.1.2 (1318/Rev.1)", fssReference: "Ch. 5", interpretationNotes: "All cylinders before 20th anniversary, then every 10 yrs." },
  { equipment: "Dry powder vessel hydrostatic / NDT", m: "powder", cat: "Hydrostatic / cylinder", intervalYears: 10, src: "1432 §10.3", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Vessel hydrostatic / NDT by an approved facility.", solasReference: "II-2/10", mscReference: "§10.3", fssReference: "Ch. 6", interpretationNotes: "" },
  { equipment: "Water mist gas/water pressure-cylinder hydrostatic test", m: "water", cat: "Hydrostatic / cylinder", intervalYears: 10, src: "1432 §10.2", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Pressure-cylinder hydrostatic test by an approved facility.", solasReference: "II-2/10", mscReference: "§10.2", fssReference: "Ch. 7", interpretationNotes: "" },
  { equipment: "Portable extinguisher hydraulic test", m: "portable", cat: "Hydrostatic / cylinder", intervalYears: 10, src: "A.951(23) §9.1.2", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Hydraulic (hydrostatic) test by an approved service supplier.", solasReference: "II-2/14.2.2", mscReference: "—", fssReference: "Ch. 4", interpretationNotes: "Per resolution A.951(23)." },
  { equipment: "Wheeled extinguisher hydrostatic test", m: "portable", cat: "Hydrostatic / cylinder", intervalYears: 10, src: "1432 §10.5", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Hydrostatic test by an approved service supplier.", solasReference: "II-2/14.2.2", mscReference: "§10.5", fssReference: "Ch. 4", interpretationNotes: "" },
  { equipment: "Aerosol generator renewal", m: "aerosol", cat: "10-Year", intervalYears: 10, src: "1432 §10.4", applicableShipTypes: ["all"], requiresApprovedSupplier: true, serviceSupplierNotes: "Generator renewal by maker / approved service supplier.", solasReference: "II-2/10", mscReference: "§10.4", fssReference: "Ch. 6", interpretationNotes: "" },
];

// Planner filter buckets (id -> predicate over an item). Easy to extend.
// Vessel types for the planner applicability filter. "all" matches everything.
// Items carry applicableShipTypes: ["all"] or a list of these ids.
const SHIP_TYPES = [
  { id: "all", label: "All ships" },
  { id: "bulk", label: "Bulk carrier" },
  { id: "oil", label: "Oil tanker" },
  { id: "chem", label: "Chemical tanker" },
  { id: "gas", label: "Gas carrier (LNG/LPG)" },
  { id: "container", label: "Container ship" },
  { id: "roro", label: "RoRo" },
  { id: "passenger", label: "Passenger ship" },
  { id: "offshore", label: "Offshore vessel" },
];

// Does an item apply to the selected ship type? "all" on either side matches.
function appliesToShipType(item, shipType) {
  if (shipType === "all") return true;
  const list = item.applicableShipTypes || ["all"];
  return list.includes("all") || list.includes(shipType);
}

const PLANNER_FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "annual", label: "Annual", test: it => it.cat === "Annual" || effInterval(it) === 1 },
  { id: "5y", label: "5-year", test: it => effInterval(it) === 5 },
  { id: "10y", label: "10-year", test: it => effInterval(it) === 10 },
  { id: "hydro", label: "Hydrostatic", test: it => /hydrostatic|cylinder/i.test(it.cat) || /hydrostatic|hydraulic/i.test(it.equipment) },
  { id: "foam", label: "Foam", test: it => it.m === "foam" },
  { id: "co2", label: "CO\u2082", test: it => it.cat === "CO\u2082" || /CO\u2082/.test(it.equipment) },
  { id: "detection", label: "Detection", test: it => it.m === "detection" },
];

// The effective "primary" recurring interval of an item (years).
function effInterval(it) {
  return it.intervalYears != null ? it.intervalYears : it.recurringIntervalYears;
}

// --- date helpers (work in whole days/months to avoid TZ drift) ------------
function parseDMY(str) {
  // accepts dd/mm/yyyy or yyyy-mm-dd (from <input type=date>)
  if (!str) return null;
  let y, m, d;
  if (str.includes("-")) { [y, m, d] = str.split("-").map(Number); }
  else { [d, m, y] = str.split("/").map(Number); }
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  return isNaN(dt) ? null : dt;
}
function fmtDMY(dt) {
  const p = n => String(n).padStart(2, "0");
  return `${p(dt.getDate())}/${p(dt.getMonth() + 1)}/${dt.getFullYear()}`;
}
function addYears(dt, n) { const d = new Date(dt); d.setFullYear(d.getFullYear() + n); return d; }
function monthsBetween(a, b) {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + (b.getDate() >= a.getDate() ? 0 : -1);
}
function ageString(build, now) {
  let months = monthsBetween(build, now);
  if (months < 0) months = 0;
  const y = Math.floor(months / 12), m = months % 12;
  return `${y} year${y === 1 ? "" : "s"} ${m} month${m === 1 ? "" : "s"}`;
}

// --- core scheduling -------------------------------------------------------
// For an item, find the most recent due date <= now and the next due date.
// `start` is the cycle origin (last-completed if provided, else commissioning,
// else build date).
function computeSchedule(item, build, now, lastDone) {
  const start = lastDone || build;
  const firstOffset = item.initialIntervalYears != null ? item.initialIntervalYears : effInterval(item);
  const recur = item.initialIntervalYears != null ? item.recurringIntervalYears : item.intervalYears;

  // CASE A — surveyor entered a last-completed date.
  // The next due is simply lastDone + (recurring interval). If that date has
  // already passed, the item is overdue; we do NOT assume later cycles happened.
  if (lastDone) {
    const nextDue = addYears(lastDone, recur);
    return { status: classify(nextDue, now), nextDue, lastDue: lastDone, occurrence: "recurring" };
  }

  // CASE B — theoretical cycle from build/commissioning date.
  let firstDue = addYears(start, firstOffset);
  // Not yet reached the first occurrence -> upcoming / not-yet-required.
  if (now < firstDue) {
    return { status: classify(firstDue, now), nextDue: firstDue, lastDue: null, occurrence: "first" };
  }
  // Walk forward in `recur`-year steps to the latest occurrence <= now.
  let due = firstDue;
  while (addYears(due, recur) <= now) { due = addYears(due, recur); }
  const lastDue = due;                 // most recent scheduled occurrence
  const nextDue = addYears(due, recur); // next scheduled occurrence
  return { status: classify(nextDue, now), nextDue, lastDue, occurrence: "recurring" };
}

// Status from the next due date relative to now.
//   OVERDUE       — next due date already passed
//   DUE THIS YEAR — next due within the next 12 months
//   UPCOMING      — due within 13-24 months
//   NOT YET REQ.  — first occurrence is more than 24 months away
// The cycle origin is the last-completed date if the surveyor entered one,
// otherwise the build/commissioning date (theoretical cycle).
function classify(nextDue, now) {
  const months = monthsBetween(now, nextDue);
  if (nextDue < now) return "OVERDUE";
  if (months <= 12) return "DUE";
  if (months <= 24) return "UPCOMING";
  return "NOTYET";
}

const STATUS_RANK = { OVERDUE: 0, DUE: 1, UPCOMING: 2, NOTYET: 3 };
const STATUS_META = {
  OVERDUE:  { label: "Overdue", color: "#dc2626", bg: "#fef2f2", bd: "#fecaca" },
  DUE:      { label: "Due this year", color: "#d97706", bg: "#fffbeb", bd: "#fde68a" },
  UPCOMING: { label: "Upcoming", color: "#0d9488", bg: "#f0fdfa", bd: "#99f6e4" },
  NOTYET:   { label: "Not yet required", color: "#64748b", bg: "#f8fafc", bd: "#e2e8f0" },
};

// Build the full ranked plan for a given build date + overrides.
function buildPlan(buildDate, now, lastDoneMap) {
  const rows = MILESTONE_ITEMS.map(item => {
    const lastDone = lastDoneMap && lastDoneMap[item.equipment] ? lastDoneMap[item.equipment] : null;
    const sch = computeSchedule(item, buildDate, now, lastDone);
    return { item, ...sch };
  });
  // sort: status priority, then soonest next-due first
  rows.sort((a, b) =>
    STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
    a.nextDue - b.nextDue
  );
  return rows;
}

// ===========================================================================
//  SMART NATURAL-LANGUAGE SEARCH ENGINE
//  ---------------------------------------------------------------------------
//  Lightweight, fully client-side, offline. No Fuse.js / no external deps.
//  Pipeline:  query -> tokenize -> expand synonyms + detect interval phrases
//             -> score every task across weighted fields -> rank.
//  Designed so non-developers can extend SYNONYMS and COMMON_SEARCHES easily.
// ===========================================================================

// --- 1. SYNONYM DICTIONARY -------------------------------------------------
// Maps a CANONICAL term -> list of alternative words/phrases a surveyor might
// type. Matching is bidirectional: typing any alias pulls in the canonical
// term and its siblings. To add a new synonym group, just add a line.
// Keep everything lower-case.
const SYNONYMS = [
  ["foam concentrate", "foam", "foam analysis", "foam sample", "foam sampling", "concentrate", "afff", "aff-ff"],
  ["carbon dioxide", "co2", "co\u2082", "carbon-dioxide", "carbondioxide"],
  ["fire extinguisher", "extinguisher", "portable extinguisher", "portable fire extinguisher", "portables"],
  ["wheeled extinguisher", "mobile extinguisher", "trolley extinguisher", "wheeled", "mobile"],
  ["hydrostatic test", "hydrostatic", "pressure test", "hydro test", "hydro", "hydrostatic testing", "hydraulic test"],
  ["breathing apparatus", "scba", "ba", "self contained breathing apparatus", "air bottle", "air cylinder"],
  ["emergency escape breathing device", "eebd", "escape breathing", "escape set", "escape hood"],
  ["detection", "detector", "detectors", "fire detection", "alarm", "fire alarm", "smoke detector", "heat detector"],
  ["water mist", "water-mist", "watermist", "mist", "water spray", "spray", "sprinkler", "sprinklers", "deluge"],
  ["dry chemical powder", "dry powder", "powder", "dcp", "dry-powder", "chemical powder"],
  ["aerosol", "condensed aerosol", "aerosol generator"],
  ["fire damper", "damper", "dampers", "ventilation", "vent", "fire door", "doors", "galley"],
  ["low location lighting", "low-location lighting", "lll", "escape lighting", "luminance"],
  ["nozzle", "nozzles", "discharge nozzle"],
  ["valve", "valves", "control valve", "section valve"],
  ["cylinder", "cylinders", "bottle", "bottles", "container", "containers"],
  ["inspection", "inspect", "check", "examine", "examination", "verify", "verification", "survey"],
  ["test", "testing", "functional test", "operational test"],
  ["serviced", "service", "servicing", "maintenance", "maintain"],
  ["weigh", "weighing", "weight", "verify contents", "contents"],
  // interval words handled separately, but keep loose aliases here too:
  ["annual", "annually", "yearly", "every year", "1 year", "one year", "12 month", "12 months"],
  ["quarterly", "3 month", "3-month", "three month", "3 monthly", "every 3 months"],
  ["5-year", "5 year", "5yr", "five year", "five yearly", "5 yearly", "every 5 years", "quinquennial"],
  ["2-year", "2 year", "2yr", "two year", "two yearly", "biennial", "every 2 years", "2.5 year", "2.5-year", "30 month"],
  ["10-year", "10 year", "10yr", "ten year", "ten yearly", "every 10 years", "decennial"],
];

// Build fast lookup: any token -> Set of all terms in its synonym group(s).
const SYN_INDEX = (() => {
  const idx = {};
  for (const group of SYNONYMS) {
    const all = new Set(group);
    for (const word of group) {
      if (!idx[word]) idx[word] = new Set();
      for (const w of all) idx[word].add(w);
    }
  }
  return idx;
})();

// --- 2. INTERVAL PHRASE DETECTION ------------------------------------------
// Recognizes natural interval expressions and maps them to the canonical
// interval bucket used by the data (matches values in INTERVALS).
const INTERVAL_PHRASES = [
  [/\b(weekly|every week|7 ?days?|weeks?)\b/i, "Weekly"],
  [/\b(monthly|every month|30 ?days?|months?)\b/i, "Monthly"],
  [/\b(quarter|quarterly|3[ -]?months?|three[ -]?months?)\b/i, "Quarterly"],
  [/\b(annual|annually|yearly|every year|1 ?years?|one year|12[ -]?months?)\b/i, "Annual"],
  [/\b(2[ -]?years?|two[ -]?years?|biennial|2\.5[ -]?years?|30[ -]?months?)\b/i, "2-Year"],
  [/\b(5[ -]?years?|five[ -]?years?|5 ?yearly|quinquennial)\b/i, "5-Year"],
  [/\b(10[ -]?years?|ten[ -]?years?|decennial)\b/i, "10-Year"],
];

function detectIntervals(raw) {
  const hits = [];
  for (const [re, label] of INTERVAL_PHRASES) {
    if (re.test(raw)) hits.push(label);
  }
  return hits;
}

// --- 3. TOKENIZE + EXPAND --------------------------------------------------
const STOP = new Set(["the","is","are","a","an","of","for","to","in","on","what","when","should","be","checked","required","do","i","need","my","how","every","at","and","or","with"]);

function tokenize(s) {
  return (s.toLowerCase().match(/[a-z0-9\u00b2]+/gi) || [])
    .map(t => t.trim())
    .filter(t => t && !STOP.has(t));
}

// Expand a query into a weighted set of search terms (originals + synonyms).
function expandQuery(raw) {
  const tokens = tokenize(raw);
  const terms = new Set(tokens);
  // single-token synonym expansion
  for (const t of tokens) {
    if (SYN_INDEX[t]) for (const syn of SYN_INDEX[t]) terms.add(syn);
  }
  // multi-word phrase synonym expansion (e.g. "foam sample")
  const lower = raw.toLowerCase();
  for (const key of Object.keys(SYN_INDEX)) {
    if (key.includes(" ") && lower.includes(key)) {
      for (const syn of SYN_INDEX[key]) terms.add(syn);
    }
  }
  return { tokens, terms: [...terms], intervals: detectIntervals(raw) };
}

// --- 4. TYPO TOLERANCE (bounded Levenshtein) -------------------------------
function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3; // early out, > our threshold
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]; dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(
        dp[i] + 1,
        dp[i - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return dp[m];
}

// --- 5. SCORING ------------------------------------------------------------
// Each task is scored across weighted fields. Higher = more relevant.
//   exact phrase in body .......... +50
//   medium label match ............ +30   (e.g. "foam" matches the system)
//   source ref match .............. +25   (e.g. "§7.5", "1318R1")
//   interval bucket match ......... +40   (query asked for an interval)
//   per term in body .............. +6
//   fuzzy term (1-2 edits) ........ +2
function scoreTask(task, expanded, mediumLabelFn, rawLower) {
  const { tokens, terms, intervals } = expanded;
  const body = task.t.toLowerCase();
  const src = task.src.toLowerCase();
  const medLabel = mediumLabelFn(task.m).toLowerCase();
  let score = 0;
  const matched = new Set();

  // Terms that are purely interval-aliases shouldn't earn body points
  // (otherwise every task mentioning "year" scores). They drive interval intent instead.
  const intervalAlias = new Set();
  for (const [, label] of INTERVAL_PHRASES) void label;
  for (const grp of SYNONYMS) {
    if (["annual","quarterly","5-year","2-year","10-year"].includes(grp[0])) {
      for (const w of grp) intervalAlias.add(w);
    }
  }

  // exact full-phrase hit (strongest signal)
  if (rawLower.length >= 3 && body.includes(rawLower)) { score += 50; matched.add(rawLower); }

  // interval intent — decisive when the user names an interval
  if (intervals.length) {
    if (intervals.includes(task.i)) score += 45;
    else score -= 8; // mild push-down for wrong interval when intent is explicit
  }

  for (const term of terms) {
    if (!term) continue;
    const isIntervalWord = intervalAlias.has(term);
    if (medLabel.includes(term) && !isIntervalWord) { score += 30; matched.add(term); }
    if (src.includes(term)) { score += 25; matched.add(term); }
    if (body.includes(term) && !isIntervalWord) { score += 6; matched.add(term); }
  }

  // typo tolerance on the user's literal tokens against body words
  if (tokens.length) {
    const bodyWords = new Set(body.match(/[a-z0-9]+/g) || []);
    for (const tk of tokens) {
      if (tk.length < 4 || intervalAlias.has(tk)) continue;
      if (bodyWords.has(tk)) continue; // already exact
      for (const bw of bodyWords) {
        if (Math.abs(bw.length - tk.length) > 2) continue;
        if (levenshtein(tk, bw) <= (tk.length > 6 ? 2 : 1)) { score += 2; matched.add(bw); break; }
      }
    }
  }

  return { score, matched: [...matched] };
}

// Main entry: returns ranked [{task, score, matched}] for a query.
function smartSearch(raw, tasks, mediumLabelFn) {
  const rawLower = raw.trim().toLowerCase();
  if (!rawLower) return tasks.map(task => ({ task, score: 0, matched: [] }));
  const expanded = expandQuery(raw);
  const scored = [];
  for (const task of tasks) {
    const r = scoreTask(task, expanded, mediumLabelFn, rawLower);
    if (r.score > 0) scored.push({ task, score: r.score, matched: r.matched });
  }
  scored.sort((a, b) => b.score - a.score || INTERVAL_RANK[a.task.i] - INTERVAL_RANK[b.task.i]);
  return scored;
}

// --- 6. SUGGESTIONS ---------------------------------------------------------
// Common/popular searches surfaced when the box is focused & empty, and used
// for "did you mean" on no-results. Easy to extend.
const COMMON_SEARCHES = [
  "foam sample interval", "CO2 hydrostatic test", "portable extinguisher annual",
  "what should be checked every 5 years", "water mist nozzle inspection",
  "EEBD servicing interval", "fixed gas cylinder weighing", "fire damper test",
  "detection system annual test", "sprinkler 10 year hydrostatic",
];

// Live autosuggestions while typing: matches common searches + equipment names.
function buildSuggestions(raw, mediaList) {
  const q = raw.trim().toLowerCase();
  if (!q) return [];
  const out = [];
  // equipment / medium names
  for (const m of mediaList) {
    if (m.id === "all") continue;
    if (m.label.toLowerCase().includes(q) || m.short.toLowerCase().includes(q)) out.push(m.label);
  }
  // common searches
  for (const c of COMMON_SEARCHES) {
    if (c.toLowerCase().includes(q)) out.push(c);
  }
  // synonym-driven hints (e.g. typing "co2" suggests the canonical phrase)
  for (const key of Object.keys(SYN_INDEX)) {
    if (key.includes(" ") && key.startsWith(q) && !out.includes(key)) out.push(key);
  }
  return [...new Set(out)].slice(0, 6);
}

// "Did you mean" terms for no-results: nearest common searches by token overlap.
function didYouMean(raw) {
  const tk = new Set(tokenize(raw));
  const ranked = COMMON_SEARCHES
    .map(c => {
      const ctk = tokenize(c);
      const overlap = ctk.filter(w => tk.has(w) || [...tk].some(t => levenshtein(t, w) <= 1)).length;
      return { c, overlap };
    })
    .filter(x => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .map(x => x.c);
  return (ranked.length ? ranked : COMMON_SEARCHES).slice(0, 4);
}

// ===========================================================================
//  HIGHLIGHT — wraps any of the matched terms found in the text.
//  Accepts an array of terms (from the search engine) OR a single string.
// ===========================================================================
function Highlight({ text, terms }) {
  const list = (Array.isArray(terms) ? terms : [terms])
    .filter(Boolean)
    .map(t => String(t).trim())
    .filter(t => t.length >= 2)
    // longest first so multi-word phrases win over their sub-words
    .sort((a, b) => b.length - a.length);
  if (!list.length) return <>{text}</>;
  const safe = list.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  let re;
  try { re = new RegExp(`(${safe})`, "ig"); } catch { return <>{text}</>; }
  const parts = String(text).split(re);
  return <>{parts.map((p, i) =>
    p && list.some(t => t.toLowerCase() === p.toLowerCase())
      ? <mark key={i}>{p}</mark>
      : <span key={i}>{p}</span>
  )}</>;
}

// ===========================================================================
//  APPROVAL BUTTON — small "Find LR approved firm" action.
//  Props: mediumId, mediumLabel, online (bool). Hides itself if the medium
//  has no approved-firm relevance. Disables gracefully when offline.
// ===========================================================================
// ===========================================================================
//  FOOTER CREDIT — professional copyright line + developer credit.
//  `onLegal` switches to the Legal view (Terms of Use & Disclaimer).
// ===========================================================================
function DevCredit({ online, onLegal }) {
  return (
    <div className="dev-credit">
      <p className="copyright-line">
        &copy; {COPYRIGHT_YEAR} {COPYRIGHT_HOLDER}. All Rights Reserved.
      </p>
      <p className="copyright-sub">
        Developed as a professional marine compliance reference tool. Unauthorized copying,
        redistribution, modification, or commercial use is prohibited.
      </p>
      <p className="credit-line">
        {onLegal && <><button className="legal-link" onClick={onLegal}>Terms &amp; Disclaimer</button> &middot; </>}
        Developed by {COPYRIGHT_HOLDER} &middot;{" "}
        {online ? (
          <a href="https://www.linkedin.com/in/kitsveyor" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        ) : (
          <span className="dev-credit-off">LinkedIn (offline)</span>
        )}
        {" "}&middot; v{VERSION}
      </p>
    </div>
  );
}

// ===========================================================================
//  ROW ADVISORIES — collapsible list of alerts relevant to a reference row.
//  Collapsed by default (just a count toggle) to keep rows clean; expands to
//  show the individual clickable advisory links.
// ===========================================================================
function RowAdvisories({ mediumId, onOpen }) {
  const [open, setOpen] = useState(false);
  const list = advisoriesForMedium(mediumId);
  if (!list.length) return null;
  return (
    <div className="row-adv-wrap">
      <button className={`row-adv-toggle${open ? " open" : ""}`} onClick={() => setOpen(o => !o)}
        title={open ? "Hide related alerts" : "Show related alerts"}>
        <ChevronRight size={12} className="row-adv-caret" />
        <AlertTriangle size={11} />
        {list.length} related {list.length === 1 ? "alert" : "alerts"}
      </button>
      {open && (
        <div className="row-adv-list">
          {list.map(a => {
            const km = ALERT_KIND_META[a.kind] || ALERT_KIND_META.safety;
            return (
              <button key={a.id} className={`row-advisory row-advisory-${a.kind}`}
                onClick={() => onOpen(a.id)} title="View in Alerts">
                {a.kind === "regulation" ? <ShieldAlert size={11} /> : a.kind === "recommendation" ? <Info size={11} /> : <AlertTriangle size={11} />}
                <span>{km.label}: {a.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ApprovalButton({ mediumId, label, online }) {
  if (!hasApprovalLookup(mediumId)) return null;
  const keyword = APPROVAL_SEARCH_MAP[mediumId];
  if (!online) {
    return (
      <span className="appr-btn appr-off" title="Internet connection required.">
        <WifiOff size={13} /> Approved firm — offline
      </span>
    );
  }
  return (
    <a className="appr-btn" href={approvalUrl()} target="_blank" rel="noopener noreferrer"
       title={`Search LR-approved service suppliers related to this equipment.\nSuggested keyword to type on the LR site: “${keyword}”.`}>
      <ExternalLink size={13} /> Find LR approved firm
      <span className="appr-kw">{keyword}</span>
    </a>
  );
}

// ===========================================================================
//  LEGAL VIEW — Terms of Use, Disclaimer, and copyright/licence summary.
//  Wording is intentionally professional and cautious, not hostile. This is
//  boilerplate for a reference tool, not legal advice.
// ===========================================================================
// ===========================================================================
//  APPROVED SERVICE SUPPLIER LOOKUP
//  ---------------------------------------------------------------------------
//  Directory of Classification Society Approved Service Supplier databases.
//  LR is always pinned first; the rest are sorted alphabetically by
//  abbreviation. To add a society: append to CLASS_SOCIETIES (it will sort
//  automatically, except LR which is force-pinned to the top).
// ===========================================================================
const CLASS_SOCIETIES = [
  { abbr: "LR",  name: "Lloyd\u2019s Register", pinned: true, color: "#04AA9E",
    url: "https://www.lr.org/en/services/classification-certification/materials-equipment-components-product-certification/lr-approvals/" },
  { abbr: "ABS", name: "American Bureau of Shipping", color: "#E21E2D",
    url: "https://www.eagle.org/ABSEaglePrograms/es/es-search.jsp" },
  { abbr: "BV",  name: "Bureau Veritas", color: "#8A8A8A",
    url: "https://approvalexplorer.bureauveritas.com/#/home" },
  { abbr: "CCS", name: "China Classification Society", color: "#003A70",
    url: "https://www.ccs-service.net/supplier/showCcsSuClient" },
  { abbr: "CRS", name: "Croatian Register of Shipping", color: "#294999",
    url: "https://www.crs.hr/approvals-finder/approved-service-suppliers" },
  { abbr: "DNV", name: "DNV", color: "#009639",
    url: "https://approvalfinder.dnv.com/?filterMode=current" },
  { abbr: "IRS", name: "Indian Register of Shipping", color: "#D9B949",
    url: "https://www.irclass.org/marine/statutory-survey/dgs-approved-service-suppliers/" },
  { abbr: "KR",  name: "Korean Register", color: "#0096D6",
    url: "https://e-mesis.krs.co.kr/KeyService/Supplier/En/WKS_CorpAddress_List.aspx" },
  { abbr: "NK",  name: "Nippon Kaiji Kyokai (ClassNK)", color: "#2775BE",
    url: "https://www.classnk.or.jp/appr_list/service_search.aspx?lang=en" },
  { abbr: "PRS", name: "Polski Rejestr Statk\u00f3w", color: "#E3E3E3",
    url: "https://prs.pl/en/maritime-sector/approvals/" },
  { abbr: "RINA", name: "RINA", color: "#000000",
    url: "https://servicesuppliers.rina.org/integration" },
  { abbr: "TL",  name: "T\u00fcrk Loydu", color: "#3049C7",
    url: "https://www.turkloydu.org/en-us/our-services/customer-tools/approved-company-and-product-list/approved-service-supplier-list/" },
];

// LR pinned first, then alphabetical by abbreviation.
function sortedSocieties() {
  const pinned = CLASS_SOCIETIES.filter(s => s.pinned);
  const rest = CLASS_SOCIETIES.filter(s => !s.pinned).sort((a, b) => a.abbr.localeCompare(b.abbr));
  return [...pinned, ...rest];
}

// Pick black/white text for legibility on a given brand background colour.
function readableText(hex) {
  const h = (hex || "").replace("#", "");
  if (h.length !== 6) return "#fff";
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  // relative luminance (sRGB approximation)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#1a2230" : "#fff";
}

function ClassSocietyLookup({ online }) {
  const all = useMemo(() => sortedSocieties(), []);

  return (
    <div className="css-lookup">
      <p className="css-intro">
        Direct links to the Approved Service Supplier databases of major Classification Societies.
        Use these to confirm a supplier&rsquo;s approval scope and validity.
      </p>

      <div className="css-grid">
        {all.map(s => {
          const card = (
            <>
              <span className="css-initials" aria-hidden="true"
                style={{ background: s.color, color: readableText(s.color), border: readableText(s.color) === "#1a2230" ? "1px solid rgba(0,0,0,.12)" : "none" }}>{s.abbr}</span>
              <span className="css-body">
                <span className="css-name">{s.name} <span className="css-abbr">({s.abbr})</span></span>
                <span className="css-cat">Approved Service Supplier Database</span>
              </span>
              {s.pinned && <span className="css-pin" title="Pinned">{"\u2605"}</span>}
              {online && <ExternalLink size={15} className="css-ext" />}
            </>
          );
          return online ? (
            <a key={s.abbr} className={`css-card${s.pinned ? " css-card-pinned" : ""}`}
               href={s.url} target="_blank" rel="noopener noreferrer"
               title={`Open ${s.name} Approved Service Supplier database`}>
              {card}
            </a>
          ) : (
            <div key={s.abbr} className={`css-card css-card-off${s.pinned ? " css-card-pinned" : ""}`}
                 title="Internet connection required.">
              {card}
              <span className="css-off">offline</span>
            </div>
          );
        })}
      </div>

      <p className="css-note">
        <Info size={13} /> Users should always verify the latest approval validity directly from the respective Classification Society database.
      </p>
    </div>
  );
}

function LegalView({ onBack }) {
  return (
    <div className="legal">
      {onBack && <button className="legal-back" onClick={onBack}><ChevronRight size={14} /> Back to Reference</button>}
      <section className="legal-block">
        <h2>Disclaimer</h2>
        <ul>
          <li>This tool is an independent reference aid. It is <strong>not</strong> an official publication of the International Maritime Organization (IMO), any Flag Administration, or any Classification Society, and is not endorsed by them.</li>
          <li>It organises and summarises requirements for convenience; summaries may simplify or omit detail. The information should be <strong>independently verified</strong> against the full text of the applicable instruments, the manufacturer&rsquo;s instructions, and the relevant Flag Administration&rsquo;s current requirements.</li>
          <li>To the maximum extent permitted by law, the developer accepts <strong>no liability</strong> for any loss, damage, compliance deficiency, detention, or consequence arising from use of, or reliance on, this tool or any incorrect interpretation of its contents.</li>
          <li>References to standards, circulars, manufacturers, or third parties are for identification only and do not imply any affiliation or endorsement.</li>
        </ul>
      </section>

      <section className="legal-block">
        <h2>Terms of Use</h2>
        <ul>
          <li><strong>Reference and educational purpose only.</strong> This tool is provided to assist understanding and planning. It does not constitute professional, legal, or classification advice.</li>
          <li><strong>You remain responsible</strong> for verifying regulatory compliance for any vessel, system, or situation, and for acting in accordance with the applicable instruments and your organisation&rsquo;s procedures.</li>
          <li><strong>No warranty.</strong> The tool is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranty of any kind, express or implied, including accuracy, completeness, currency, or fitness for a particular purpose.</li>
          <li><strong>No commercial reuse.</strong> The tool and its contents may not be used for commercial purposes, resold, or incorporated into a paid product or service without the developer&rsquo;s prior written permission.</li>
          <li><strong>No copying or mirroring.</strong> Copying, redistributing, mirroring, modifying, or republishing the tool or its datasets, in whole or in part, is not permitted without prior written permission.</li>
          <li>Use that is inconsistent with these terms is not authorised.</li>
        </ul>
      </section>

      <section className="legal-block">
        <h2>Copyright &amp; Licence</h2>
        <p>
          &copy; {COPYRIGHT_YEAR} {COPYRIGHT_HOLDER}. All Rights Reserved.
        </p>
        <p className="legal-muted">
          This is proprietary software provided under an &ldquo;All Rights Reserved&rdquo; licence. No open-source
          licence is granted. Permission is not given to copy, redistribute, modify, republish, or use the
          software or its datasets commercially without the prior written permission of the copyright holder.
          See the accompanying LICENSE.txt for full terms.
        </p>
        <p className="legal-muted">
          The maintenance, testing and inspection requirements summarised here derive from publicly issued
          instruments (e.g. IMO circulars and resolutions). Those underlying instruments are the property of
          their respective publishers; this tool claims no rights over them and links to the original sources
          where possible.
        </p>
      </section>

      <p className="legal-note">
        This page provides general information for users of this tool and is not legal advice.
      </p>
    </div>
  );
}

// ===========================================================================
//  SAFETY ALERTS COMPONENT — dedicated view listing regulatory changes and
//  safety lessons (PFOS prohibition, MAIB CO2 release, etc.).
// ===========================================================================
function SafetyAlerts({ mediumLabel, online, targetId, onTargetConsumed }) {
  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState("all");   // all | regulation | safety | recommendation
  const [mediaFilter, setMediaFilter] = useState("all"); // all | <medium id>
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | historical
  const [flagFilter, setFlagFilter] = useState("all");   // all | <flag>
  const [sourceFilter, setSourceFilter] = useState("all"); // all | <class society / body>
  const [pscFilter, setPscFilter] = useState("all");     // all | psc
  const [order, setOrder] = useState("desc");            // desc = newest first | asc = oldest first

  // Distinct media present across advisories, for the system filter dropdown.
  const mediaInUse = useMemo(() => {
    const set = new Set();
    SAFETY_ADVISORIES.forEach(a => a.media.forEach(m => set.add(m)));
    return [...set];
  }, []);

  // Distinct flags and issuing bodies, for their filter dropdowns.
  // "IMO / General" is sorted last so specific flags lead the list.
  const flagsInUse = useMemo(() => {
    const set = new Set(SAFETY_ADVISORIES.map(a => a.flag).filter(Boolean));
    const arr = [...set].filter(f => f !== "IMO / General").sort((a, b) => a.localeCompare(b));
    if (set.has("IMO / General")) arr.push("IMO / General");
    return arr;
  }, []);
  const sourcesInUse = useMemo(() => {
    const set = new Set(SAFETY_ADVISORIES.map(a => a.source).filter(Boolean));
    const rest = [...set].filter(s => s !== "LR").sort((a, b) => a.localeCompare(b));
    return set.has("LR") ? ["LR", ...rest] : rest;   // LR pinned first
  }, []);
  // Distinct Port State Control MoUs across the PSC alerts, for the PSC filter.
  const mousInUse = useMemo(() => {
    const set = new Set();
    SAFETY_ADVISORIES.forEach(a => (a.mou || []).forEach(m => set.add(m)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, []);
  const pscCount = useMemo(() => SAFETY_ADVISORIES.filter(a => a.psc).length, []);

  // Filter + search, then sort chronologically by release date.
  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = SAFETY_ADVISORIES.filter(a => {
      if (kindFilter !== "all" && a.kind !== kindFilter) return false;
      if (statusFilter !== "all" && (a.status || "active") !== statusFilter) return false;
      if (mediaFilter !== "all" && !a.media.includes(mediaFilter)) return false;
      if (flagFilter !== "all" && a.flag !== flagFilter) return false;
      if (sourceFilter !== "all" && a.source !== sourceFilter) return false;
      if (pscFilter !== "all" && !(a.mou || []).includes(pscFilter)) return false;
      if (query) {
        const hay = [a.title, a.summary, a.refs, ...(a.points || [])].join(" ").toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
    list.sort((x, y) => {
      const dx = parseDMY(x.date) || new Date(0);
      const dy = parseDMY(y.date) || new Date(0);
      return order === "desc" ? dy - dx : dx - dy;
    });
    return list;
  }, [q, kindFilter, mediaFilter, statusFilter, flagFilter, sourceFilter, pscFilter, order]);

  // When arriving from a Reference inline marker, clear filters, then scroll to
  // and briefly highlight the targeted alert.
  useEffect(() => {
    if (!targetId) return;
    setQ(""); setKindFilter("all"); setMediaFilter("all"); setStatusFilter("all"); setFlagFilter("all"); setSourceFilter("all"); setPscFilter("all");
    const t = setTimeout(() => {
      const el = document.getElementById("alert-" + targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("alert-flash");
        setTimeout(() => el.classList.remove("alert-flash"), 2000);
      }
      onTargetConsumed && onTargetConsumed();
    }, 80);
    return () => clearTimeout(t);
  }, [targetId]);

  const kindCounts = useMemo(() => {
    const c = { all: SAFETY_ADVISORIES.length };
    SAFETY_ADVISORIES.forEach(a => { c[a.kind] = (c[a.kind] || 0) + 1; });
    return c;
  }, []);

  // Active filter count + one-click reset (mirrors the Reference tab).
  const activeFilterCount =
    (q.trim() ? 1 : 0) + (kindFilter !== "all" ? 1 : 0) + (mediaFilter !== "all" ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) + (flagFilter !== "all" ? 1 : 0) +
    (sourceFilter !== "all" ? 1 : 0) + (pscFilter !== "all" ? 1 : 0);
  const clearFilters = () => {
    setQ(""); setKindFilter("all"); setMediaFilter("all"); setStatusFilter("all");
    setFlagFilter("all"); setSourceFilter("all"); setPscFilter("all");
  };

  return (
    <div className="alerts">
      <p className="alerts-intro">
        Regulatory changes, safety lessons, and recommended practices affecting fire-protection
        maintenance and use. These don&rsquo;t change inspection intervals but carry compliance or safety significance.
      </p>

      {/* search */}
      <div className="alerts-search">
        <Search size={16} />
        <input value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search alerts — e.g. PFOS, CO₂, foam, hydrostatic" />
        {q && <button className="clr" onClick={() => setQ("")}><X size={15} /></button>}
      </div>

      {/* filters */}
      <div className="alerts-filters">
        <div className="af-row">
          {["all", "regulation", "safety", "recommendation"].map(k => (
            kindCounts[k] ? (
              <button key={k} className={`pl-chip${kindFilter === k ? " on" : ""}`} onClick={() => setKindFilter(k)}>
                {ALERT_KIND_META[k]?.label || "All"}{k !== "all" && kindCounts[k] ? ` (${kindCounts[k]})` : ""}
              </button>
            ) : null
          ))}
        </div>
        <div className="af-row">
          <span className="af-lbl"><Layers size={12} /> System</span>
          <select value={mediaFilter} onChange={e => setMediaFilter(e.target.value)}>
            <option value="all">All systems</option>
            {mediaInUse.map(m => <option key={m} value={m}>{mediumLabel(m)}</option>)}
          </select>
        </div>
        <div className="af-row">
          <span className="af-lbl"><Clock size={12} /> Status</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="historical">Historical</option>
          </select>
        </div>
        <div className="af-row">
          <span className="af-lbl"><Flag size={12} /> Flag</span>
          <select value={flagFilter} onChange={e => setFlagFilter(e.target.value)}>
            <option value="all">All flags</option>
            {flagsInUse.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="af-row">
          <span className="af-lbl"><Building2 size={12} /> Source</span>
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
            <option value="all">All sources</option>
            {sourcesInUse.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {mousInUse.length > 0 && (
          <div className="af-row">
            <span className="af-lbl"><ShieldAlert size={12} /> PSC MoU</span>
            <select value={pscFilter} onChange={e => setPscFilter(e.target.value)}>
              <option value="all">All</option>
              {mousInUse.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}
        <div className="af-row">
          <span className="af-lbl"><ArrowUpDown size={12} /> Order</span>
          <select value={order} onChange={e => setOrder(e.target.value)}>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
        {activeFilterCount > 0 && (
          <button className="clear-all" onClick={clearFilters}><X size={13} /> Clear ({activeFilterCount})</button>
        )}
      </div>

      <div className="alerts-count">{shown.length} {shown.length === 1 ? "alert" : "alerts"}</div>

      {shown.length === 0 && (
        <div className="alerts-empty">
          <Search size={22} />
          <p>No alerts match.</p>
          <button onClick={clearFilters}>Clear filters</button>
        </div>
      )}

      {shown.map(a => {
        const km = ALERT_KIND_META[a.kind] || ALERT_KIND_META.safety;
        const sm = ALERT_STATUS_META[a.status || "active"];
        return (
          <article key={a.id} id={"alert-" + a.id} className={`alert alert-${a.kind}`}>
            <div className="alert-head">
              <span className={`alert-badge alert-badge-${a.kind}`}>
                {km.icon}{km.label}
              </span>
              <h3>{a.title}</h3>
              {a.date && <span className="alert-date">{a.date}</span>}
              {a.effective && <span className="alert-eff">In force {a.effective}</span>}
              <span className="alert-status" style={{ color: sm.color, background: sm.bg, borderColor: sm.bd }}>{sm.label}</span>
            </div>
            <div className="alert-media">
              {a.source && <span className="alert-meta-chip alert-chip-source"><Building2 size={10} /> {a.source}</span>}
              {a.flag && a.flag !== "IMO / General" && <span className="alert-meta-chip alert-chip-flag"><Flag size={10} /> {a.flag}</span>}
              {a.psc && (a.mou && a.mou.length
                ? a.mou.map(m => <span key={m} className="alert-meta-chip alert-chip-psc"><ShieldAlert size={10} /> {m}</span>)
                : <span className="alert-meta-chip alert-chip-psc"><ShieldAlert size={10} /> PSC</span>)}
              {a.media.map(m => <span key={m} className="alert-tag">{mediumLabel(m)}</span>)}
            </div>
            <p className="alert-summary">{a.summary}</p>
            <ul className="alert-points">
              {a.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <div className="alert-foot">
              <span className="alert-refs">{a.refs}</span>
              {a.link && (online ? (
                <a className="alert-link" href={a.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={12} /> Source
                </a>
              ) : (
                <span className="alert-link alert-link-off" title="Internet connection required."><WifiOff size={12} /> Source (offline)</span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ===========================================================================
//  SURVEY PLANNER COMPONENT
//  Self-contained: build-date input, optional per-item last-completed
//  overrides, status filter, and the ranked due-items list.
// ===========================================================================
function SurveyPlanner({ mediumLabel, online, onOpenSuppliers }) {
  const [buildInput, setBuildInput] = useState("");      // yyyy-mm-dd from date picker
  const [planFilter, setPlanFilter] = useState("all");
  const [shipType, setShipType] = useState("all");
  const [supplierOnly, setSupplierOnly] = useState(false);
  const [overrides, setOverrides] = useState({});        // equipment -> yyyy-mm-dd
  const [showOverrides, setShowOverrides] = useState(false);
  const [expanded, setExpanded] = useState(null);        // equipment name of open detail panel

  const now = new Date();
  const buildDate = useMemo(() => parseDMY(buildInput), [buildInput]);

  const plan = useMemo(() => {
    if (!buildDate) return null;
    const lastDoneMap = {};
    for (const [eq, v] of Object.entries(overrides)) {
      const d = parseDMY(v); if (d) lastDoneMap[eq] = d;
    }
    return buildPlan(buildDate, now, lastDoneMap);
  }, [buildDate, overrides]);

  const filterFn = PLANNER_FILTERS.find(f => f.id === planFilter)?.test || (() => true);
  // category filter + ship-type applicability + optional supplier-only filter
  const itemPasses = (it) =>
    filterFn(it) && appliesToShipType(it, shipType) && (!supplierOnly || it.requiresApprovedSupplier);
  const filteredPlan = plan ? plan.filter(r => itemPasses(r.item)) : [];

  // group by status, preserving sort order
  const byStatus = {};
  for (const r of filteredPlan) (byStatus[r.status] = byStatus[r.status] || []).push(r);

  const setOverride = (eq, val) => setOverrides(o => ({ ...o, [eq]: val }));
  const toggleExpand = (eq) => setExpanded(x => x === eq ? null : eq);

  // Reference detail panel for one item.
  const DetailPanel = ({ item }) => (
    <div className="pl-detail">
      <div className="pl-detail-grid">
        <div className="pl-ref"><span className="pl-ref-lbl">SOLAS</span><span className="pl-ref-val">{item.solasReference || "\u2014"}</span></div>
        <div className="pl-ref"><span className="pl-ref-lbl">MSC.1/Circ.1432</span><span className="pl-ref-val">{item.mscReference || "\u2014"}</span></div>
        <div className="pl-ref"><span className="pl-ref-lbl">FSS Code</span><span className="pl-ref-val">{item.fssReference || "\u2014"}</span></div>
        <div className="pl-ref"><span className="pl-ref-lbl">Testing interval</span><span className="pl-ref-val">{item.cat}{effInterval(item) ? ` \u00b7 ${effInterval(item)}-year cycle` : ""}</span></div>
      </div>
      {item.interpretationNotes ? <p className="pl-detail-note"><strong>Interpretation:</strong> {item.interpretationNotes}</p> : null}
      <p className="pl-detail-note"><strong>Service supplier:</strong> {item.serviceSupplierNotes || (item.requiresApprovedSupplier ? "Normally requires an approved service supplier." : "Normally ship staff.")}</p>
      {item.requiresApprovedSupplier && (
        <div className="pl-detail-actions">
          {online ? (
            <a className="pl-act pl-act-primary" href={LR_APPROVALS_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={13} /> Find LR Approved Firm
            </a>
          ) : (
            <span className="pl-act pl-act-off"><WifiOff size={13} /> Find LR Approved Firm (offline)</span>
          )}
          <button className="pl-act" onClick={onOpenSuppliers}>
            <Building2 size={13} /> Open Approved Service Supplier Lookup
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="planner">
      {/* Input section */}
      <div className="pl-input">
        <div className="pl-field">
          <label><Ship size={13} /> Ship build date</label>
          <input type="date" value={buildInput} max={new Date().toISOString().slice(0, 10)}
            onChange={e => setBuildInput(e.target.value)} />
        </div>
        <div className="pl-field">
          <label><Ship size={13} /> Ship type</label>
          <select value={shipType} onChange={e => setShipType(e.target.value)}>
            {SHIP_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        {buildDate && (
          <div className="pl-age">
            <span className="pl-age-lbl">Vessel age</span>
            <strong>{ageString(buildDate, now)}</strong>
            <span className="pl-age-built">built {fmtDMY(buildDate)}</span>
          </div>
        )}
      </div>

      {!buildDate && (
        <div className="pl-hint">
          <CalendarClock size={26} />
          <p>Enter the ship&rsquo;s build date to generate the due-items plan.</p>
          <span>The planner projects each periodic item&rsquo;s cycle from the build date. For accuracy, you can add a last-completed date per item below the results.</span>
        </div>
      )}

      {plan && (
        <>
          {/* planning-aid disclaimer */}
          <div className="pl-note">
            <AlertTriangle size={14} />
            <span>Planning aid only. Dates are projected from the build date assuming on-schedule cycles. Enter a last-completed date for any item to correct its projection. Always confirm against survey records and the flag Administration.</span>
          </div>

          {/* category filters */}
          <div className="pl-filters">
            {PLANNER_FILTERS.map(f => (
              <button key={f.id} className={`pl-chip${planFilter === f.id ? " on" : ""}`}
                onClick={() => setPlanFilter(f.id)}>{f.label}</button>
            ))}
          </div>

          {/* supplier-only toggle */}
          <label className="pl-supfilter">
            <input type="checkbox" checked={supplierOnly} onChange={e => setSupplierOnly(e.target.checked)} />
            Show only items normally requiring an Approved Service Supplier
          </label>

          {/* status groups */}
          {["OVERDUE", "DUE", "UPCOMING", "NOTYET"].map(st => {
            const rows = byStatus[st] || [];
            if (!rows.length) return null;
            const meta = STATUS_META[st];
            return (
              <section key={st} className="pl-group">
                <div className="pl-group-head" style={{ "--sc": meta.color }}>
                  <span className="pl-dot" style={{ background: meta.color }} />
                  <h3>{meta.label}</h3>
                  <span className="pl-n" style={{ background: meta.color }}>{rows.length}</span>
                </div>
                <div className="pl-rows">
                  {rows.map((r, i) => {
                    const open = expanded === r.item.equipment;
                    return (
                    <div key={r.item.equipment + i} className="pl-row-wrap">
                      <div className="pl-row" style={{ background: meta.bg, borderColor: meta.bd }}>
                        <div className="pl-row-main">
                          <span className="pl-eq">{r.item.equipment}</span>
                          <span className="pl-meta">
                            <span className="pl-tag">{mediumLabel(r.item.m)}</span>
                            <span className="pl-src">{r.item.src}</span>
                            {r.item.requiresApprovedSupplier && (
                              <button className="pl-supbadge pl-supbadge-link" onClick={onOpenSuppliers}
                                title="This item normally requires attendance by an approved service supplier. Click to open Approved Service Supplier.">
                                Approved Service Supplier <ExternalLink size={9} />
                              </button>
                            )}
                          </span>
                          {r.item.note && <span className="pl-special"><AlertTriangle size={10} /> {r.item.note}</span>}
                          <button className="pl-more" onClick={() => toggleExpand(r.item.equipment)} aria-expanded={open}>
                            <ChevronRight size={12} className={open ? "rot" : ""} /> {open ? "Hide details" : "More details"}
                          </button>
                        </div>
                        <div className="pl-due" style={{ color: meta.color }}>
                          <span className="pl-due-lbl">next due</span>
                          <strong>{fmtDMY(r.nextDue)}</strong>
                        </div>
                      </div>
                      {open && <DetailPanel item={r.item} />}
                    </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {filteredPlan.length === 0 && (
            <div className="pl-empty">No items match the current filters.</div>
          )}

          {/* Optional: last-completed overrides */}
          <div className="pl-ov">
            <button className="pl-ov-toggle" onClick={() => setShowOverrides(s => !s)}>
              <ChevronRight size={14} className={showOverrides ? "rot" : ""} />
              Refine with last-completed dates (optional)
            </button>
            {showOverrides && (
              <div className="pl-ov-body">
                <p className="pl-ov-help">Enter the date each item was last carried out to correct its next-due projection. Leave blank to use the theoretical cycle from build date.</p>
                {MILESTONE_ITEMS.filter(itemPasses).map(it => (
                  <div key={it.equipment} className="pl-ov-row">
                    <span>{it.equipment}</span>
                    <input type="date" max={new Date().toISOString().slice(0, 10)}
                      value={overrides[it.equipment] || ""}
                      onChange={e => setOverride(it.equipment, e.target.value)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [flag, setFlag] = useState("imo");
  const [medium, setMedium] = useState("all");
  const [interval, setIntervalSel] = useState("all");
  const [query, setQuery] = useState("");
  const [groupBy, setGroupBy] = useState("interval"); // 'interval' | 'medium' | 'none'
  const [searchFocused, setSearchFocused] = useState(false);
  const [history, setHistory] = useState([]); // session-only (artifacts can't use localStorage)
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [view, setView] = useState("reference"); // 'reference' | 'planner' | 'alerts'
  const [targetAlert, setTargetAlert] = useState(null); // alert id to scroll to when entering Alerts
  const [dark, setDark] = useState(false); // dark mode toggle
  const searchRef = useRef(null);

  // Track connectivity so the approved-firm link can disable gracefully offline.
  useEffect(() => {
    const up = () => setOnline(true), down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape" && document.activeElement === searchRef.current) setQuery("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const flagObj = FLAGS.find(f => f.id === flag);
  const mediumLabel = (id) => MEDIA.find(x => x.id === id)?.label || id;
  const mediumShort = (id) => MEDIA.find(x => x.id === id)?.short || id;

  // Run the smart search engine when there's a query, then apply the dropdown
  // filters (medium / interval) on top. When the box is empty, show everything.
  // `matchMap` carries the matched terms per task so we can highlight them.
  const { filtered, matchMap } = useMemo(() => {
    const ranked = smartSearch(query, TASKS, mediumLabel); // [{task, score, matched}]
    const mm = new Map();
    const list = [];
    for (const r of ranked) {
      const task = r.task;
      if (medium !== "all" && task.m !== medium) continue;
      if (interval !== "all" && task.i !== interval) continue;
      list.push(task);
      mm.set(task, r.matched);
    }
    return { filtered: list, matchMap: mm };
  }, [medium, interval, query]);

  const hasQuery = query.trim().length > 0;
  // When searching, the engine has already ranked by relevance, so a flat list
  // best preserves that order; grouping still works when the user picks it.
  const effectiveGroupBy = hasQuery && groupBy === "interval" ? "relevance" : groupBy;

  const groups = useMemo(() => {
    if (effectiveGroupBy === "none" || effectiveGroupBy === "relevance") return [{ key: null, items: filtered }];
    if (effectiveGroupBy === "interval") {
      return INTERVALS.map(iv => ({ key: iv, items: filtered.filter(t => t.i === iv) })).filter(g => g.items.length);
    }
    // by medium
    return MEDIA.filter(m => m.id !== "all").map(m => ({
      key: m.id,
      items: filtered.filter(t => t.m === m.id).sort((a, b) => INTERVAL_RANK[a.i] - INTERVAL_RANK[b.i])
    })).filter(g => g.items.length);
  }, [filtered, effectiveGroupBy]);

  // Live autosuggestions + helpers for the search dropdown.
  const suggestions = useMemo(() => buildSuggestions(query, MEDIA), [query]);
  const runSearch = (text) => {
    setQuery(text);
    setActiveSuggestion(-1);
    if (text.trim()) {
      setHistory(h => [text, ...h.filter(x => x !== text)].slice(0, 6));
    }
  };

  const relevantNotes = useMemo(() => {
    if (!flagObj || flagObj.notes.length === 0) return [];
    return flagObj.notes
      .filter(n => medium === "all" || n.m === "all" || n.m === medium)
      .filter(n => interval === "all" || !n.interval || n.interval === interval);
  }, [flagObj, medium, interval]);

  const activeFilterCount = (medium !== "all" ? 1 : 0) + (interval !== "all" ? 1 : 0) + (flag !== "imo" ? 1 : 0) + (query ? 1 : 0);
  const clearAll = () => { setMedium("all"); setIntervalSel("all"); setFlag("imo"); setQuery(""); };

  return (
    <div className={`app${dark ? " dark" : ""}`}>
      <style>{CSS}</style>

      <header className="hdr">
        <div className="hdr-top">
          <div className="hdr-id">
            <span className="reg">SOLAS II-2/14.2.2</span>
            <h1>Fire Protection &mdash; Maintenance, Testing &amp; Inspection Reference</h1>
          </div>
          <div className="hdr-right">
            <button className="theme-toggle" onClick={() => setDark(d => !d)}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <span className="hdr-count">{TASKS.length} items &middot; {FLAGS.length - 1} flags &middot; <span className="hdr-ver" title={`Build ${BUILD_DATE}\n${CHANGELOG[0].note}`}>v{VERSION}</span></span>
          </div>
        </div>

        {/* view toggle: reference browser vs survey planner */}
        <div className="viewtabs">
          <button className={view === "reference" ? "on" : ""} onClick={() => setView("reference")}>
            <BookOpen size={14} /> Reference
          </button>
          <button className={view === "alerts" ? "on" : ""} onClick={() => setView("alerts")}>
            <ShieldAlert size={14} /> Alerts
          </button>
          <button className={view === "suppliers" ? "on" : ""} onClick={() => setView("suppliers")}>
            <Building2 size={14} /> Approved Service Supplier
          </button>
          <button className={view === "planner" ? "on" : ""} onClick={() => setView("planner")}>
            <CalendarClock size={14} /> Inspection Planner
          </button>
        </div>

        {view === "reference" && <>
        {/* primary search — natural-language smart search */}
        <div className={`searchbar-wrap${searchFocused ? " open" : ""}`}>
          <div className="searchbar">
            <Search size={18} />
            <input ref={searchRef} value={query}
              onChange={e => { setQuery(e.target.value); setActiveSuggestion(-1); }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              onKeyDown={e => {
                const items = query.trim() ? suggestions : history.length ? history : COMMON_SEARCHES;
                if (e.key === "ArrowDown") { e.preventDefault(); setActiveSuggestion(i => Math.min(i + 1, items.length - 1)); }
                else if (e.key === "ArrowUp") { e.preventDefault(); setActiveSuggestion(i => Math.max(i - 1, -1)); }
                else if (e.key === "Enter") {
                  if (activeSuggestion >= 0 && items[activeSuggestion]) { runSearch(items[activeSuggestion]); searchRef.current?.blur(); }
                  else if (query.trim()) { runSearch(query); searchRef.current?.blur(); }
                }
              }}
              placeholder="Ask in plain words — e.g. when is foam analysis required? · CO₂ hydrostatic · checked every 5 years" />
            {query
              ? <button className="clr" onClick={() => { setQuery(""); searchRef.current?.focus(); }}><X size={16} /></button>
              : <kbd>⌘K</kbd>}
          </div>

          {/* Suggestions / history dropdown */}
          {searchFocused && (
            <div className="suggest">
              {query.trim() ? (
                suggestions.length ? (
                  <>
                    <div className="suggest-h">Suggestions</div>
                    {suggestions.map((s, i) => (
                      <button key={s} className={`suggest-i${i === activeSuggestion ? " on" : ""}`}
                        onMouseDown={() => runSearch(s)}>
                        <Search size={13} /> <Highlight text={s} terms={[query.trim()]} />
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="suggest-empty">Press Enter to search “{query.trim()}”</div>
                )
              ) : (
                <>
                  {history.length > 0 && (
                    <>
                      <div className="suggest-h">Recent</div>
                      {history.map((s, i) => (
                        <button key={s} className={`suggest-i${i === activeSuggestion ? " on" : ""}`}
                          onMouseDown={() => runSearch(s)}><Clock size={13} /> {s}</button>
                      ))}
                    </>
                  )}
                  <div className="suggest-h">Popular searches</div>
                  {COMMON_SEARCHES.slice(0, 6).map((s, i) => {
                    const idx = history.length ? -1 : i; // keyboard index only when no history shown
                    return (
                      <button key={s} className={`suggest-i${idx === activeSuggestion ? " on" : ""}`}
                        onMouseDown={() => runSearch(s)}><TrendingUp size={13} /> {s}</button>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

        {/* filter row */}
        <div className="filters">
          <div className="fgroup">
            <label><Flag size={12} /> Flag</label>
            <select value={flag} onChange={e => setFlag(e.target.value)}>
              {FLAGS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="fgroup">
            <label><Layers size={12} /> Medium</label>
            <select value={medium} onChange={e => setMedium(e.target.value)}>
              {MEDIA.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
          <div className="fgroup">
            <label><SlidersHorizontal size={12} /> Interval</label>
            <select value={interval} onChange={e => setIntervalSel(e.target.value)}>
              <option value="all">All intervals</option>
              {INTERVALS.map(iv => <option key={iv} value={iv}>{iv}</option>)}
            </select>
          </div>
          <div className="fgroup">
            <label><ArrowUpDown size={12} /> Group by</label>
            <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
              <option value="interval">Interval</option>
              <option value="medium">Medium</option>
              <option value="none">Flat list</option>
            </select>
          </div>
          {activeFilterCount > 0 && <button className="clear-all" onClick={clearAll}><X size={13} /> Clear ({activeFilterCount})</button>}
        </div>
        </>}
      </header>

      {view === "legal" ? (
        <main className="main">
          <LegalView onBack={() => setView("reference")} />
          <footer className="ftr">
            <DevCredit online={online} onLegal={null} />
          </footer>
        </main>
      ) : view === "planner" ? (
        <main className="main">
          <SurveyPlanner mediumLabel={mediumLabel} online={online} onOpenSuppliers={() => setView("suppliers")} />
          <footer className="ftr">
            <p className="disclaimer"><strong>Disclaimer:</strong> The inspection planner is a scheduling aid that projects periodic maintenance, testing & inspection cycles from the vessel build date (or the last-completed dates you provide). It does not account for actual survey windows, flag-specific harmonisation, manufacturer instructions, or works already carried out unless entered. Always confirm against the ship&rsquo;s survey records and the flag Administration&rsquo;s requirements.</p>
            <DevCredit online={online} onLegal={() => setView("legal")} />
          </footer>
        </main>
      ) : view === "alerts" ? (
        <main className="main">
          <SafetyAlerts mediumLabel={mediumLabel} online={online} targetId={targetAlert} onTargetConsumed={() => setTargetAlert(null)} />
          <footer className="ftr">
            <p className="disclaimer"><strong>Disclaimer:</strong> Alerts summarise regulatory changes and published safety lessons for awareness. They are not the full legal text. Always refer to the source instrument, the latest IMO/flag guidance, and manufacturer instructions, and verify foam composition through a maker&rsquo;s declaration or laboratory test where PFOS is concerned.</p>
            <DevCredit online={online} onLegal={() => setView("legal")} />
          </footer>
        </main>
      ) : view === "suppliers" ? (
        <main className="main">
          <ClassSocietyLookup online={online} />
          <footer className="ftr">
            <DevCredit online={online} onLegal={() => setView("legal")} />
          </footer>
        </main>
      ) : (
      <main className="main">
        <div className="result-bar">
          <span><strong>{filtered.length}</strong> {filtered.length === 1 ? "item" : "items"}</span>
          {hasQuery && filtered.length > 0 && <span className="rb-rank">ranked by relevance</span>}
          {flag !== "imo" && <span className="rb-flag"><Flag size={12} /> {flagObj.name}<em>{flagObj.circ}</em></span>}
          <span className="rb-spacer" />
          {online ? (
            <a className="rb-lr" href={LR_APPROVALS_URL} target="_blank" rel="noopener noreferrer"
               title="Open the LR Approved Firm / Service Supplier database">
              <ExternalLink size={12} /> Find LR Approved Firm
            </a>
          ) : (
            <span className="rb-lr rb-lr-off"><WifiOff size={12} /> Find LR Approved Firm (offline)</span>
          )}
        </div>

        {/* Approved-firm context bar: shown when one system is selected */}
        {medium !== "all" && hasApprovalLookup(medium) && (
          <div className="appr-bar">
            <span className="appr-bar-txt">
              Need a service supplier for <strong>{mediumLabel(medium)}</strong>?
            </span>
            <ApprovalButton mediumId={medium} label={mediumLabel(medium)} online={online} />
          </div>
        )}

        {/* Flag overlay callout */}
        {relevantNotes.length > 0 && (
          <div className="overlay">
            <div className="ov-head"><AlertTriangle size={15} /> Flag-specific requirements &mdash; {flagObj.name}</div>
            <ul>
              {relevantNotes.map((n, idx) => (
                <li key={idx}>
                  <span className="ov-tag">{mediumShort(n.m)}{n.interval ? ` \u00b7 ${n.interval}` : ""}</span>
                  {n.txt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {flag !== "imo" && flagObj.notes.length === 0 && (
          <div className="baseline-note"><FileText size={14} /> {flagObj.name} adopts the IMO baseline. No flag-specific deviations captured &mdash; consult <strong>{flagObj.circ}</strong> for any local clarifications.</div>
        )}

        {filtered.length === 0 && (
          <div className="empty">
            <Search size={26} />
            {hasQuery ? (
              <>
                <p>No matches for “{query.trim()}”.</p>
                <span className="empty-sub">Try one of these instead:</span>
                <div className="empty-chips">
                  {didYouMean(query).map(s => (
                    <button key={s} className="empty-chip" onClick={() => runSearch(s)}>{s}</button>
                  ))}
                </div>
                <button className="empty-clear" onClick={clearAll}>Clear all filters</button>
              </>
            ) : (
              <>
                <p>No items match these filters.</p>
                <button onClick={clearAll}>Clear filters</button>
              </>
            )}
          </div>
        )}

        {groups.map(g => (
          <section key={g.key ?? "flat"} className="group">
            {g.key && groupBy === "interval" && (
              <div className="g-head" style={{ "--gc": ivColor(g.key) }}>
                <span className="g-dot" /><h2>{g.key}</h2><span className="g-n">{g.items.length}</span>
              </div>
            )}
            {g.key && groupBy === "medium" && (
              <div className="g-head g-head-med">
                <h2>{mediumLabel(g.key)}</h2>
                <span className="g-n g-n-med">{g.items.length}</span>
                <ApprovalButton mediumId={g.key} label={mediumLabel(g.key)} online={online} />
              </div>
            )}
            <div className="rows">
              {g.items.map((task, idx) => {
                const flagNotes = flagObj?.notes.filter(n => (n.m === task.m || n.m === "all") && (!n.interval || n.interval === task.i)) || [];
                const hlTerms = matchMap.get(task) || (hasQuery ? [query.trim()] : []);
                return (
                  <article className="row" key={`${task.src}-${idx}`}>
                    <div className="row-tags">
                      <span className="tag-iv" style={{ background: ivColor(task.i) }}>{task.i}</span>
                      <span className="tag-med">{mediumShort(task.m)}</span>
                    </div>
                    <div className="row-main">
                      <p><Highlight text={task.t} terms={hlTerms} /></p>
                      {flagNotes.map((n, ni) => (
                        <div className="row-flag" key={ni}><Flag size={11} /><span><strong>{flagObj.name}:</strong> {n.txt}</span></div>
                      ))}
                      <RowAdvisories mediumId={task.m} onOpen={(id) => { setTargetAlert(id); setView("alerts"); }} />
                    </div>
                    {(() => {
                      const url = srcUrl(task.src);
                      if (url && online) {
                        return (
                          <a className="row-src row-src-link" href={url} target="_blank" rel="noopener noreferrer"
                             title="Open the source instrument">
                            <Highlight text={task.src} terms={hlTerms} /><ExternalLink size={11} />
                          </a>
                        );
                      }
                      return <span className="row-src"><Highlight text={task.src} terms={hlTerms} /><ChevronRight size={12} /></span>;
                    })()}
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        <footer className="ftr">
          <div className="ftr-srcs">
            <h4>Source instruments</h4>
            {SOURCE_DOCS.map(d => (
              <p key={d.ref}>
                {d.link && online
                  ? <a className="src-code-link" href={d.link} target="_blank" rel="noopener noreferrer" title="Open the source instrument"><code>{d.ref}</code></a>
                  : <code>{d.ref}</code>}
                {" "}{d.full}
              </p>
            ))}
          </div>
          <p className="disclaimer"><strong>Disclaimer:</strong> This reference organizes the maintenance, testing & inspection items from the listed IMO instruments and selected flag circulars for surveyor use. It is not a substitute for the full text of the applicable instruments, the manufacturer's maintenance instructions (which may be more stringent), or the flag Administration's current requirements. Always verify against the latest circular for the relevant flag.</p>
          <details className="ftr-ver">
            <summary>Version {VERSION} &middot; build {BUILD_DATE} &middot; what&rsquo;s new</summary>
            <ul>
              {CHANGELOG.map(c => (
                <li key={c.v}><code>v{c.v}</code> <span className="cl-date">{c.d}</span> {c.note}</li>
              ))}
            </ul>
          </details>
          <DevCredit online={online} onLegal={() => setView("legal")} />
        </footer>
      </main>
      )}
    </div>
  );
}

const CSS = `
  @font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,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) format('woff2');}@font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:500;font-display:swap;src:url(data:font/woff2;base64,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) format('woff2');}@font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:600;font-display:swap;src:url(data:font/woff2;base64,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) format('woff2');}@font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:700;font-display:swap;src:url(data:font/woff2;base64,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) format('woff2');}@font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:500;font-display:swap;src:url(data:font/woff2;base64,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) format('woff2');}@font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:600;font-display:swap;src:url(data:font/woff2;base64,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) format('woff2');}
  :root{
    --ink:#1a2230; --ink-2:#4a5568; --ink-3:#718096; --line:#e2e8f0; --line-2:#edf2f7;
    --bg:#f7f9fb; --paper:#ffffff; --accent:#1e3a5f; --accent-2:#2c5282;
    --hl:#fef08a;
    --chip-bg:#ebf2fa; --tab-bg:#eef2f7; --tab-on:#ffffff; --shadow:rgba(26,34,48,.1);
  }
  /* Dark mode: override the core tokens. Kept calm and low-glare for night
     bridge use. Accent shifts to a brighter teal/blue for contrast on dark. */
  .app.dark{
    --ink:#e6edf3; --ink-2:#aebacb; --ink-3:#8593a8; --line:#2b3645; --line-2:#222c38;
    --bg:#0e151f; --paper:#161f2b; --accent:#7fb0e6; --accent-2:#6aa3e0;
    --hl:#7a6a1f;
    --chip-bg:#1d2a3d; --tab-bg:#1a2433; --tab-on:#22304a; --shadow:rgba(0,0,0,.45);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  .app{font-family:'IBM Plex Sans',system-ui,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;transition:background .2s,color .2s}
  mark{background:var(--hl);color:inherit;border-radius:2px;padding:0 1px}
  .hdr-right{display:flex;align-items:center;gap:14px}
  .theme-toggle{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1px solid var(--line);background:var(--paper);color:var(--ink-2);cursor:pointer;transition:.15s;flex-shrink:0}
  .theme-toggle:hover{color:var(--accent-2);border-color:var(--accent-2)}

  /* HEADER */
  .hdr{position:sticky;top:0;z-index:10;background:var(--paper);border-bottom:1px solid var(--line);padding:16px 24px 14px;box-shadow:0 1px 3px rgba(26,34,48,.04)}
  .hdr-top{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:13px;flex-wrap:wrap}
  .reg{display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;color:var(--accent-2);background:var(--chip-bg);padding:2px 8px;border-radius:4px;letter-spacing:.02em;margin-bottom:6px}
  .hdr-id h1{font-size:18px;font-weight:700;letter-spacing:-.01em;color:var(--ink)}
  .hdr-count{font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--ink-3);white-space:nowrap}
  .hdr-ver{color:var(--accent-2);font-weight:600;cursor:help}

  /* view toggle tabs */
  .viewtabs{display:flex;gap:4px;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:3px;margin-bottom:12px;width:fit-content}
  .viewtabs button{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-size:13px;font-weight:600;color:var(--ink-2);background:0;border:0;border-radius:7px;padding:7px 14px;cursor:pointer;transition:.15s}
  .viewtabs button.on{background:var(--tab-on);color:var(--accent-2);box-shadow:0 1px 3px rgba(26,34,48,.1)}
  .viewtabs button:hover:not(.on){color:var(--ink)}
  .tab-count{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;background:#dc2626;color:#fff;border-radius:20px;padding:1px 6px;margin-left:2px}

  /* safety alerts */
  .alerts{max-width:100%}
  .alerts-intro{font-size:13px;line-height:1.55;color:var(--ink-2);margin-bottom:18px;max-width:620px}
  .alert{border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin-bottom:16px;background:var(--paper)}
  .alert-regulation{border-left:4px solid #b91c1c}
  .alert-safety{border-left:4px solid #d97706}
  .alert-head{display:flex;align-items:center;gap:11px;flex-wrap:wrap;margin-bottom:9px}
  .alert-badge{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:3px 9px;border-radius:6px;white-space:nowrap}
  .alert-badge-regulation{background:#fef2f2;color:#b91c1c}
  .alert-badge-safety{background:#fffbeb;color:#92400e}
  .alert-head h3{font-size:15.5px;font-weight:700;color:var(--ink);flex:1;min-width:200px}
  .alert-eff{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;color:#b91c1c;background:#fef2f2;padding:3px 9px;border-radius:6px;white-space:nowrap}
  .alert-status{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;padding:2px 9px;border-radius:20px;border:1px solid;white-space:nowrap}
  .alert-date{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;color:var(--ink-3);background:var(--bg);border:1px solid var(--line);padding:3px 9px;border-radius:6px;white-space:nowrap}
  .alert-flash{animation:alertFlash 2s ease-out}
  @keyframes alertFlash{0%{box-shadow:0 0 0 3px var(--accent-2);background:var(--chip-bg)}60%{box-shadow:0 0 0 3px var(--accent-2);background:var(--chip-bg)}100%{box-shadow:none}}
  .alert-media{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:11px}
  .alert-tag{font-size:10.5px;font-weight:600;color:var(--ink-2);background:var(--bg);border:1px solid var(--line);padding:2px 9px;border-radius:5px}
  .alert-meta-chip{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:600;padding:2px 9px;border-radius:5px;border:1px solid}
  .alert-meta-chip svg{flex-shrink:0}
  .alert-chip-source{color:#1e40af;background:#eff6ff;border-color:#bfdbfe}
  .alert-chip-flag{color:#9a3412;background:#fff7ed;border-color:#fed7aa}
  .alert-chip-psc{color:#7c2d12;background:#fef2f2;border-color:#fecaca}
  .alert-summary{font-size:13.5px;line-height:1.55;color:var(--ink);margin-bottom:11px}
  .alert-points{list-style:none;margin:0 0 13px;padding:0;display:flex;flex-direction:column;gap:7px}
  .alert-points li{position:relative;padding-left:18px;font-size:12.5px;line-height:1.5;color:var(--ink-2)}
  .alert-points li::before{content:'';position:absolute;left:4px;top:8px;width:5px;height:5px;border-radius:50%;background:var(--accent-2)}
  .alert-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;border-top:1px solid var(--line-2);padding-top:11px}
  .alert-refs{font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--ink-3);line-height:1.4}
  .alert-link{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--accent-2);text-decoration:none;white-space:nowrap}
  .alert-link:hover{text-decoration:underline}
  .alert-link-off{color:var(--ink-3);cursor:not-allowed}
  .alert-link-off:hover{text-decoration:none}

  /* inline advisory marker on reference rows */
  .row-advisory{display:inline-flex;align-items:center;gap:6px;margin-top:8px;font-family:inherit;font-size:11.5px;font-weight:600;text-align:left;border-radius:7px;padding:6px 10px;cursor:pointer;border:1px solid;width:100%}
  .row-adv-wrap{margin-top:8px}
  .row-adv-toggle{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-size:11.5px;font-weight:600;color:var(--ink-2);background:var(--bg);border:1px solid var(--line);border-radius:7px;padding:5px 10px;cursor:pointer;transition:.12s}
  .row-adv-toggle:hover{border-color:#d97706;color:#92400e;background:#fffbeb}
  .row-adv-toggle svg{flex-shrink:0}
  .row-adv-toggle .row-adv-caret{transition:transform .15s}
  .row-adv-toggle.open .row-adv-caret{transform:rotate(90deg)}
  .row-adv-list{display:flex;flex-direction:column;gap:0}
  .row-adv-list .row-advisory{margin-top:6px}
  .row-advisory svg{flex-shrink:0}
  .row-advisory-regulation{color:#b91c1c;background:#fef2f2;border-color:#fecaca}
  .row-advisory-regulation:hover{background:#fee2e2}
  .row-advisory-safety{color:#92400e;background:#fffbeb;border-color:#fde68a}
  .row-advisory-safety:hover{background:#fef3c7}
  .row-advisory-recommendation{color:#0e7490;background:#ecfeff;border-color:#a5f3fc}
  .row-advisory-recommendation:hover{background:#cffafe}

  /* alerts search + filters */
  .alerts-search{display:flex;align-items:center;gap:9px;background:var(--bg);border:1.5px solid var(--line);border-radius:10px;padding:0 12px;height:42px;margin-bottom:12px;max-width:520px}

  /* Approved Service Supplier Lookup */
  .css-lookup{max-width:900px}
  .css-intro{font-size:13px;line-height:1.55;color:var(--ink-2);margin-bottom:16px;max-width:620px}
  .css-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
  .css-card{display:flex;align-items:center;gap:13px;text-decoration:none;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:14px 16px;transition:.15s;position:relative}
  .css-card:hover{border-color:var(--accent-2);box-shadow:0 3px 12px rgba(26,34,48,.09);transform:translateY(-1px)}
  .css-card-pinned{border-color:#cfe5e0;background:#f6fbfa}
  .css-card-pinned:hover{border-color:#04AA9E}
  .css-initials{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:46px;height:46px;border-radius:10px;background:var(--accent-2);color:#fff;font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:700;letter-spacing:-.02em}
  .css-card-pinned .css-initials{background:#04AA9E}
  .css-body{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
  .css-name{font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.3}
  .css-abbr{color:var(--ink-3);font-weight:500}
  .css-cat{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;color:var(--ink-3)}
  .css-ext{color:var(--ink-3);flex-shrink:0}
  .css-card:hover .css-ext{color:var(--accent-2)}
  .css-pin{position:absolute;top:9px;right:10px;color:#04AA9E;font-size:12px}
  .css-card-off{cursor:not-allowed;opacity:.65}
  .css-card-off:hover{border-color:var(--line);box-shadow:none;transform:none}
  .css-off{font-size:10px;font-weight:600;color:var(--ink-3);text-transform:uppercase}
  .css-note{display:flex;align-items:flex-start;gap:7px;margin-top:20px;font-size:12px;line-height:1.5;color:var(--ink-3);background:var(--bg);border:1px solid var(--line);border-radius:9px;padding:11px 14px}
  .css-note svg{flex-shrink:0;margin-top:1px;color:var(--accent-2)}
  @media(max-width:680px){
    .css-grid{grid-template-columns:1fr}
  }
  .alerts-search:focus-within{border-color:var(--accent-2);background:var(--paper);box-shadow:0 0 0 3px rgba(44,82,130,.1)}
  .alerts-search svg{color:var(--ink-3);flex-shrink:0}
  .alerts-search input{flex:1;border:0;background:0;font-family:inherit;font-size:14px;color:var(--ink);height:100%}
  .alerts-search input:focus{outline:0}
  .alerts-filters{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:14px}
  .af-row{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
  .af-lbl{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-3)}
  .af-row select{font-family:inherit;font-size:12.5px;font-weight:500;color:var(--ink);background:var(--paper);border:1.5px solid var(--line);border-radius:8px;padding:6px 10px;cursor:pointer}
  .af-row select:focus{outline:0;border-color:var(--accent-2)}
  .alerts-count{font-size:12.5px;color:var(--ink-3);margin-bottom:14px;font-family:'IBM Plex Mono',monospace}
  .alerts-empty{display:flex;flex-direction:column;align-items:center;gap:9px;padding:40px;color:var(--ink-3)}
  .alerts-empty p{font-size:15px;font-weight:600;color:var(--ink-2)}
  .alerts-empty button{font-family:inherit;font-size:13px;font-weight:600;color:var(--accent-2);background:var(--chip-bg);border:1px solid #d4e2f0;border-radius:8px;padding:8px 16px;cursor:pointer}
  .alert-recommendation{border-left:4px solid #0e7490}
  .alert-badge-recommendation{background:#ecfeff;color:#0e7490}

  /* survey planner */
  .planner{max-width:100%}
  .pl-input{display:flex;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:18px}
  .pl-field{display:flex;flex-direction:column;gap:5px}
  .pl-field label{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-3)}
  .pl-field input{font-family:inherit;font-size:14px;color:var(--ink);background:var(--paper);border:1.5px solid var(--line);border-radius:9px;padding:9px 12px}
  .pl-field input:focus{outline:0;border-color:var(--accent-2);box-shadow:0 0 0 3px rgba(44,82,130,.1)}
  .pl-age{display:flex;flex-direction:column;gap:1px;background:var(--chip-bg);border:1px solid #d4e2f0;border-radius:9px;padding:8px 16px}
  .pl-age-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-3)}
  .pl-age strong{font-size:18px;font-family:'IBM Plex Mono',monospace;color:var(--accent-2)}
  .pl-age-built{font-size:11px;color:var(--ink-3)}
  .pl-hint{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:40px 20px;color:var(--ink-3)}
  .pl-hint svg{color:var(--accent-2)}
  .pl-hint p{font-size:15px;font-weight:600;color:var(--ink-2)}
  .pl-hint span{font-size:12.5px;max-width:460px;line-height:1.5}
  .pl-note{display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.5;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:9px;padding:11px 14px;margin-bottom:16px}
  .pl-note svg{color:#d97706;flex-shrink:0;margin-top:1px}
  .pl-filters{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px}
  .pl-chip{font-family:inherit;font-size:12px;font-weight:600;color:var(--ink-2);background:var(--paper);border:1.5px solid var(--line);border-radius:8px;padding:6px 12px;cursor:pointer;transition:.12s}
  .pl-chip:hover{border-color:var(--accent-2);color:var(--accent-2)}
  .pl-chip.on{background:var(--accent-2);border-color:var(--accent-2);color:#fff}
  .pl-group{margin-bottom:20px}
  .pl-group-head{display:flex;align-items:center;gap:9px;margin-bottom:10px;padding-bottom:7px;border-bottom:2px solid var(--sc)}
  .pl-dot{width:9px;height:9px;border-radius:50%}
  .pl-group-head h3{font-size:15px;font-weight:700;color:var(--ink)}
  .pl-n{margin-left:auto;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;color:#fff;padding:2px 9px;border-radius:20px}
  .pl-rows{display:flex;flex-direction:column;gap:8px}
  .pl-row{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;border:1px solid;border-radius:10px;padding:12px 15px}
  .pl-row-main{flex:1;min-width:0}
  .pl-eq{display:block;font-size:13.5px;font-weight:600;color:var(--ink);line-height:1.4}
  .pl-meta{display:flex;align-items:center;gap:9px;margin-top:5px;flex-wrap:wrap}
  .pl-tag{font-size:10.5px;font-weight:600;color:var(--ink-2);background:rgba(0,0,0,.05);padding:2px 8px;border-radius:5px}
  .pl-src{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;color:var(--ink-3)}
  .pl-special{display:flex;align-items:flex-start;gap:5px;margin-top:7px;font-size:11px;line-height:1.4;color:#92400e}
  .pl-field select{font-family:inherit;font-size:14px;color:var(--ink);background:var(--paper);border:1.5px solid var(--line);border-radius:9px;padding:9px 12px;cursor:pointer}
  .pl-field select:focus{outline:0;border-color:var(--accent-2)}
  .pl-supfilter{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink-2);margin-bottom:18px;cursor:pointer}
  .pl-supfilter input{width:15px;height:15px;cursor:pointer;accent-color:var(--accent-2)}
  .pl-supbadge{font-size:10px;font-weight:600;color:#0e7490;background:#ecfeff;border:1px solid #a5f3fc;padding:2px 8px;border-radius:5px;white-space:nowrap}
  .pl-supbadge-link{display:inline-flex;align-items:center;gap:4px;font-family:inherit;cursor:pointer;transition:.12s}
  .pl-supbadge-link:hover{background:#cffafe;border-color:#67e8f9}
  .pl-supbadge-link svg{flex-shrink:0}
  .pl-row-wrap{display:flex;flex-direction:column}
  .pl-more{display:inline-flex;align-items:center;gap:4px;margin-top:9px;font-family:inherit;font-size:11.5px;font-weight:600;color:var(--accent-2);background:0;border:0;padding:0;cursor:pointer;align-self:flex-start}
  .pl-more svg{transition:transform .15s}
  .pl-more svg.rot{transform:rotate(90deg)}
  .pl-detail{background:var(--paper);border:1px solid var(--line);border-top:0;border-radius:0 0 10px 10px;margin:-6px 0 0;padding:14px 16px 16px}
  .pl-detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:12px}
  .pl-ref{display:flex;flex-direction:column;gap:2px}
  .pl-ref-lbl{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-3)}
  .pl-ref-val{font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:600;color:var(--accent-2)}
  .pl-detail-note{font-size:12px;line-height:1.5;color:var(--ink-2);margin-bottom:8px}
  .pl-detail-note strong{color:var(--ink)}
  .pl-detail-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
  .pl-act{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-size:12px;font-weight:600;color:var(--accent-2);background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:7px 12px;cursor:pointer;text-decoration:none;transition:.12s}
  .pl-act:hover{border-color:var(--accent-2);background:var(--chip-bg)}
  .pl-act-primary{color:#fff;background:#04AA9E;border-color:#04AA9E}
  .pl-act-primary:hover{background:#038a80;border-color:#038a80}
  .pl-act-off{color:var(--ink-3);background:#eef0f2;cursor:not-allowed}
  .pl-act-off:hover{border-color:var(--line);background:#eef0f2}
  .rb-spacer{flex:1}
  .rb-lr{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:var(--accent-2);text-decoration:none;border:1px solid var(--line);border-radius:8px;padding:6px 11px;transition:.12s;white-space:nowrap}
  .rb-lr:hover{border-color:var(--accent-2);background:var(--chip-bg)}
  .rb-lr-off{color:var(--ink-3);border-color:var(--line);cursor:not-allowed}
  @media(max-width:680px){
    .rb-spacer{display:none}
    .rb-lr{width:100%;justify-content:center;margin-top:4px}
  }
  .pl-special svg{flex-shrink:0;margin-top:2px}
  .pl-due{display:flex;flex-direction:column;align-items:flex-end;gap:1px;white-space:nowrap}
  .pl-due-lbl{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;opacity:.75}
  .pl-due strong{font-size:14px;font-family:'IBM Plex Mono',monospace}
  .pl-empty{padding:30px;text-align:center;font-size:14px;color:var(--ink-3)}
  .pl-ov{margin-top:24px;border-top:1px solid var(--line);padding-top:16px}
  .pl-ov-toggle{display:flex;align-items:center;gap:6px;font-family:inherit;font-size:13px;font-weight:600;color:var(--accent-2);background:0;border:0;cursor:pointer;padding:0}
  .pl-ov-toggle svg{transition:transform .15s}
  .pl-ov-toggle svg.rot{transform:rotate(90deg)}
  .pl-ov-body{margin-top:14px}
  .pl-ov-help{font-size:12px;line-height:1.5;color:var(--ink-3);margin-bottom:12px}
  .pl-ov-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--line-2)}
  .pl-ov-row span{font-size:12.5px;color:var(--ink-2)}
  .pl-ov-row input{font-family:inherit;font-size:12.5px;border:1.5px solid var(--line);border-radius:7px;padding:5px 9px;color:var(--ink);background:var(--paper)}
  .pl-ov-row input:focus{outline:0;border-color:var(--accent-2)}
  @media(max-width:680px){
    .pl-input{flex-direction:column;align-items:stretch}
    .pl-field input{width:100%}
    .pl-row{flex-direction:column;gap:8px}
    .pl-due{align-items:flex-start}
    .pl-ov-row{flex-direction:column;align-items:stretch;gap:5px}
  }

  .searchbar-wrap{position:relative;margin-bottom:12px;z-index:20}
  .searchbar{display:flex;align-items:center;gap:10px;background:var(--bg);border:1.5px solid var(--line);border-radius:10px;padding:0 12px;height:44px;transition:.15s}
  .searchbar:focus-within{border-color:var(--accent-2);background:var(--paper);box-shadow:0 0 0 3px rgba(44,82,130,.1)}
  .searchbar svg{color:var(--ink-3);flex-shrink:0}
  .searchbar input{flex:1;border:0;background:0;font-family:inherit;font-size:14.5px;color:var(--ink);height:100%}
  .searchbar input:focus{outline:0}
  .searchbar input::placeholder{color:var(--ink-3)}
  .searchbar kbd{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink-3);background:var(--paper);border:1px solid var(--line);border-radius:4px;padding:2px 6px}
  .clr{background:0;border:0;cursor:pointer;color:var(--ink-3);display:grid;place-items:center;padding:2px}
  .clr:hover{color:var(--ink)}

  .filters{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}
  .fgroup{display:flex;flex-direction:column;gap:4px}
  .fgroup label{display:flex;align-items:center;gap:4px;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-3)}
  .fgroup select{font-family:inherit;font-size:13px;font-weight:500;color:var(--ink);background:var(--paper);border:1.5px solid var(--line);border-radius:8px;padding:7px 10px;cursor:pointer;min-width:120px}
  .fgroup:first-of-type select{min-width:230px}
  .fgroup:nth-of-type(2) select{min-width:200px}
  .fgroup select:focus{outline:0;border-color:var(--accent-2)}
  .clear-all{display:flex;align-items:center;gap:5px;font-family:inherit;font-size:12.5px;font-weight:600;color:#b91c1c;background:#fef2f2;border:1.5px solid #fecaca;border-radius:8px;padding:7px 11px;cursor:pointer;height:35px}
  .clear-all:hover{background:#fee2e2}

  /* MAIN */
  .main{max-width:980px;margin:0 auto;padding:22px 24px 60px}
  .result-bar{display:flex;align-items:center;gap:14px;margin-bottom:16px;font-size:13px;color:var(--ink-2);flex-wrap:wrap}
  .result-bar strong{font-size:15px;color:var(--ink);font-family:'IBM Plex Mono',monospace}
  .rb-flag{display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--accent-2)}
  .rb-flag em{font-style:normal;font-weight:400;color:var(--ink-3);font-size:11.5px}

  .overlay{background:#fffbeb;border:1px solid #fde68a;border-left:4px solid #d97706;border-radius:10px;padding:14px 16px;margin-bottom:18px}
  .ov-head{display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px;color:#92400e;margin-bottom:9px}
  .overlay ul{list-style:none;display:flex;flex-direction:column;gap:8px}
  .overlay li{font-size:12.5px;line-height:1.5;color:#5c4218}
  .ov-tag{display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;text-transform:uppercase;background:#fde68a;color:#92400e;padding:2px 7px;border-radius:4px;margin-right:8px;white-space:nowrap}

  .baseline-note{display:flex;align-items:center;gap:8px;font-size:12.5px;line-height:1.5;color:var(--ink-2);background:#eef4fa;border:1px solid #d4e2f0;border-radius:9px;padding:11px 14px;margin-bottom:18px}
  .baseline-note svg{color:var(--accent-2);flex-shrink:0}

  /* GROUPS */
  .group{margin-bottom:24px}
  .g-head{display:flex;align-items:center;gap:9px;margin-bottom:10px;padding-bottom:7px;border-bottom:2px solid var(--gc)}
  .g-dot{width:9px;height:9px;border-radius:50%;background:var(--gc)}
  .g-head h2{font-size:15px;font-weight:700;color:var(--ink)}
  .g-n{margin-left:auto;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;color:#fff;background:var(--gc);padding:2px 9px;border-radius:20px}
  .g-head-med{border-bottom-color:var(--accent)}
  .g-head-med h2{color:var(--accent)}

  /* LR approved-firm action */
  .appr-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#f0f7f5;border:1px solid #cfe5e0;border-radius:10px;padding:11px 15px;margin-bottom:18px}
  .appr-bar-txt{font-size:13px;color:var(--ink-2)}
  .appr-bar-txt strong{color:var(--ink)}
  .appr-btn{display:inline-flex;align-items:center;gap:7px;font-family:inherit;font-size:12.5px;font-weight:600;color:#fff;background:#04AA9E;border:1px solid #04AA9E;border-radius:8px;padding:7px 13px;cursor:pointer;text-decoration:none;transition:.15s;white-space:nowrap}
  .appr-btn:hover{background:#038a80;border-color:#038a80}
  .appr-btn svg{flex-shrink:0}
  .appr-kw{display:none}
  .g-head-med .appr-btn{margin-left:auto}
  .appr-off{color:var(--ink-3);background:#eef0f2;border-color:var(--line);cursor:not-allowed;font-weight:500}
  .appr-off:hover{background:#eef0f2}
  @media(max-width:680px){
    .appr-bar{flex-direction:column;align-items:stretch}
    .appr-btn{justify-content:center}
    .g-head-med .appr-btn{margin-left:0}
  }
  .g-n-med{background:var(--accent)}

  .rows{display:flex;flex-direction:column;gap:1px;background:var(--line-2);border:1px solid var(--line);border-radius:10px;overflow:hidden}
  .row{display:grid;grid-template-columns:120px 1fr auto;gap:14px;background:var(--paper);padding:13px 16px;align-items:start;transition:.12s}
  .row:hover{background:#fafcfe}
  .row-tags{display:flex;flex-direction:column;gap:5px;padding-top:1px}
  .tag-iv{font-family:'IBM Plex Mono',monospace;font-size:10.5px;font-weight:600;color:#fff;padding:2px 8px;border-radius:5px;text-align:center;letter-spacing:.01em}
  .tag-med{font-size:10.5px;font-weight:600;color:var(--ink-2);background:var(--line-2);border:1px solid var(--line);padding:2px 8px;border-radius:5px;text-align:center}
  .row-main p{font-size:13.5px;line-height:1.55;color:var(--ink)}
  .row-flag{display:flex;gap:6px;align-items:flex-start;margin-top:8px;font-size:12px;line-height:1.45;color:#92400e;background:#fffbeb;border:1px dashed #fcd34d;border-radius:7px;padding:7px 9px}
  .row-flag svg{margin-top:2px;flex-shrink:0;color:#d97706}
  .row-src{display:inline-flex;align-items:center;gap:1px;font-family:'IBM Plex Mono',monospace;font-size:11.5px;font-weight:600;color:var(--accent-2);white-space:nowrap;padding-top:2px}
  .row-src svg{color:var(--ink-3)}
  .row-src-link{text-decoration:none;cursor:pointer}
  .row-src-link:hover{text-decoration:underline}
  .row-src-link svg{color:var(--accent-2)}

  .empty{display:flex;flex-direction:column;align-items:center;gap:10px;padding:50px;color:var(--ink-3)}
  .empty p{font-size:15px;font-weight:600;color:var(--ink-2)}
  .empty button{font-family:inherit;font-size:13px;font-weight:600;color:var(--accent-2);background:var(--chip-bg);border:1px solid #d4e2f0;border-radius:8px;padding:8px 16px;cursor:pointer}

  /* smart-search suggestions dropdown */
  .suggest{position:absolute;top:48px;left:0;right:0;background:#fff;border:1.5px solid var(--line);border-radius:11px;box-shadow:0 12px 32px rgba(26,34,48,.14);padding:6px;max-height:340px;overflow-y:auto;animation:sg .12s ease}
  @keyframes sg{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
  .suggest-h{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3);padding:8px 10px 4px}
  .suggest-i{display:flex;align-items:center;gap:9px;width:100%;text-align:left;font-family:inherit;font-size:13.5px;color:var(--ink);background:0;border:0;border-radius:8px;padding:9px 10px;cursor:pointer}
  .suggest-i svg{color:var(--ink-3);flex-shrink:0}
  .suggest-i:hover,.suggest-i.on{background:var(--bg)}
  .suggest-i.on{box-shadow:inset 2px 0 0 var(--accent-2)}
  .suggest-empty{font-size:13px;color:var(--ink-3);padding:12px 10px}
  .rb-rank{font-size:11.5px;font-weight:600;color:var(--accent-2);background:var(--chip-bg);padding:3px 9px;border-radius:20px}
  .empty-sub{font-size:13px;color:var(--ink-2);margin-top:4px}
  .empty-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:6px;max-width:480px}
  .empty-chip{font-family:inherit;font-size:12.5px;font-weight:500;color:var(--accent-2);background:#fff;border:1.5px solid #d4e2f0;border-radius:20px;padding:7px 14px;cursor:pointer;transition:.12s}
  .empty-chip:hover{background:var(--chip-bg);border-color:var(--accent-2)}
  .empty-clear{margin-top:6px}

  .ftr{margin-top:36px;padding-top:20px;border-top:1px solid var(--line)}
  .ftr-srcs h4{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3);margin-bottom:9px}
  .ftr-srcs p{font-size:11.5px;line-height:1.7;color:var(--ink-2)}
  .ftr-srcs code{font-family:'IBM Plex Mono',monospace;font-weight:600;color:var(--accent-2);background:var(--chip-bg);padding:1px 6px;border-radius:4px;margin-right:5px}
  .src-link{color:var(--accent-2);text-decoration:none;font-weight:600;white-space:nowrap}
  .src-code-link{text-decoration:none}
  .src-code-link code{cursor:pointer}
  .src-code-link:hover code{background:#d7e6f5;text-decoration:underline}
  .src-link:hover{text-decoration:underline}
  .src-link svg{vertical-align:-1px}
  .src-link-off{color:var(--ink-3)}
  .disclaimer{margin-top:16px;font-size:11px;line-height:1.6;color:var(--ink-3)}
  .ftr-ver{margin-top:14px;font-size:11.5px}
  .ftr-ver summary{cursor:pointer;color:var(--accent-2);font-weight:600;font-family:'IBM Plex Mono',monospace;list-style:none;display:inline-flex;align-items:center;gap:5px;user-select:none}
  .ftr-ver summary::-webkit-details-marker{display:none}
  .ftr-ver summary::before{content:'\\25B8';display:inline-block;transition:transform .15s;font-size:10px}
  .ftr-ver[open] summary::before{transform:rotate(90deg)}
  .ftr-ver ul{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-direction:column;gap:7px}
  .ftr-ver li{font-size:11.5px;line-height:1.5;color:var(--ink-2);padding-left:2px}
  .ftr-ver code{font-family:'IBM Plex Mono',monospace;font-weight:600;color:var(--accent-2);background:var(--chip-bg);padding:1px 6px;border-radius:4px;margin-right:6px}
  .dev-credit{margin-top:16px;padding-top:14px;border-top:1px solid var(--line-2)}
  .copyright-line{font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:3px}
  .copyright-sub{font-size:11px;line-height:1.55;color:var(--ink-3);max-width:560px;margin-bottom:8px}
  .credit-line{font-size:11px;color:var(--ink-3);letter-spacing:.01em}
  .credit-line a{color:var(--ink-3);text-decoration:none;border-bottom:1px solid var(--line)}
  .credit-line a:hover{color:var(--accent-2);border-bottom-color:var(--accent-2)}
  .dev-credit-off{color:var(--ink-3)}
  .legal-link{font-family:inherit;font-size:11px;font-weight:600;color:var(--accent-2);background:0;border:0;padding:0;cursor:pointer}
  .legal-link:hover{text-decoration:underline}

  /* Legal view */
  .legal{max-width:760px}
  .legal-back{display:inline-flex;align-items:center;gap:4px;font-family:inherit;font-size:13px;font-weight:600;color:var(--accent-2);background:0;border:0;padding:0;margin-bottom:20px;cursor:pointer}
  .legal-back svg{transform:rotate(180deg)}
  .legal-back:hover{text-decoration:underline}
  .legal-block{margin-bottom:26px;padding-bottom:22px;border-bottom:1px solid var(--line-2)}
  .legal-block h2{font-size:18px;font-weight:700;color:var(--ink);margin-bottom:12px}
  .legal-block ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
  .legal-block li{position:relative;padding-left:18px;font-size:13px;line-height:1.6;color:var(--ink-2)}
  .legal-block li::before{content:'';position:absolute;left:4px;top:9px;width:5px;height:5px;border-radius:50%;background:var(--accent-2)}
  .legal-block p{font-size:13px;line-height:1.6;color:var(--ink-2);margin-bottom:10px}
  .legal-muted{color:var(--ink-3)!important;font-size:12.5px!important}
  .legal-note{font-size:11.5px;color:var(--ink-3);font-style:italic;margin-top:6px}
  .cl-date{color:var(--ink-3);font-family:'IBM Plex Mono',monospace;font-size:10.5px;margin-right:6px}

  @media(max-width:680px){
    .row{grid-template-columns:1fr;gap:8px}
    .row-tags{flex-direction:row}
    .row-src{justify-self:start}
    .fgroup,.fgroup:first-of-type select,.fgroup:nth-of-type(2) select{min-width:0;width:100%}
    .fgroup{flex:1 1 140px}
  }
`;
