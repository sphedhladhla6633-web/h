export interface TerminalItem {
  pin: number;
  label: string;
  name: string;
  category: 'power' | 'control' | 'sensor' | 'signal';
  dcUsage: string;
  acUsage: string;
  description: string;
  notes?: string;
}

export const TERMINAL_LIST: TerminalItem[] = [
  {
    pin: 1,
    label: 'L',
    name: 'Live (230V AC)',
    category: 'power',
    dcUsage: 'Not connected in DC installs',
    acUsage: 'Main AC Live in. Bridge from Live to COM (Pin 5) for standard switch.',
    description: 'Main alternating current live phase supply.',
    notes: 'To reverse the switch action, remove bridge to COM and wire pump Live directly with Live.'
  },
  {
    pin: 2,
    label: 'N',
    name: 'Neutral (230V AC)',
    category: 'power',
    dcUsage: 'Not connected in DC installs',
    acUsage: 'Main AC Neutral. Pump Neutral connects to main N.',
    description: 'Main alternating current neutral line.',
    notes: 'Ensure solid neutral bonding before testing pump activation.'
  },
  {
    pin: 3,
    label: 'E',
    name: 'Earth / Ground',
    category: 'power',
    dcUsage: 'Ground/Earth connection for chassis & pump negative',
    acUsage: 'Main protective Earth (PE) connection',
    description: 'Grounding post for electrical safety and reference.',
    notes: 'Do not use for Eltomatic earth. Solenoid relay pump negative also ties to ground.'
  },
  {
    pin: 4,
    label: 'N/O',
    name: 'Normally Open Relay Contact',
    category: 'control',
    dcUsage: 'Coil signal to relay pin 86 or bowser coil 1',
    acUsage: 'Pump Live switched feed connects here',
    description: 'Switched contact that closes when pump is authorized.',
    notes: 'Triggers relay energization upon authorization from Fuel Track unit.'
  },
  {
    pin: 5,
    label: 'COM',
    name: 'Common Relay Contact',
    category: 'control',
    dcUsage: 'Bridge from 12V+ or 24V+ to COM',
    acUsage: 'Bridge from AC Live (Pin 1) to COM',
    description: 'Common feed for the internal relay switch.',
    notes: 'On modern pump, COM connects to ground wire replacement.'
  },
  {
    pin: 6,
    label: '12/24V DC',
    name: 'DC Power Positive',
    category: 'power',
    dcUsage: 'Primary 12V or 24V DC positive power input',
    acUsage: 'Not used when unit is purely AC powered',
    description: 'Power supply input for DC fuel management boards.',
    notes: 'Take out the internal power supply if using external 12V/24V pump battery.'
  },
  {
    pin: 7,
    label: 'Tamper',
    name: 'Tamper Switch',
    category: 'signal',
    dcUsage: 'Door/lid tamper switch loop',
    acUsage: 'Door/lid tamper switch loop',
    description: 'Anti-theft enclosure tamper sensing circuit.',
    notes: 'Must remain closed circuit to prevent tamper lockouts.'
  },
  {
    pin: 8,
    label: 'Valve',
    name: 'Valve Control / Valve (+)',
    category: 'control',
    dcUsage: 'Valve (+) or Bowser coil 2 to Valve (−)',
    acUsage: 'Solenoid valve activation feed if applicable',
    description: 'Controls fuel anti-siphon or dispenser solenoid valve.',
    notes: 'IQ Plant Hire old units use Valve (−) on relay pin 85.'
  },
  {
    pin: 9,
    label: 'OPTO −',
    name: 'Optical Pulse Negative / Ground',
    category: 'sensor',
    dcUsage: 'Optical pulser negative return / Modern pump "Perr (−)"',
    acUsage: 'Optical pulser negative return / Modern pump "Perr (−)"',
    description: 'Optically isolated pulse counting ground reference.',
    notes: 'On modern pumps: "Perr" is negative (−), connects directly to OPTO −.'
  },
  {
    pin: 10,
    label: 'OPTO +',
    name: 'Optical Pulse Positive / Signal',
    category: 'sensor',
    dcUsage: 'Optical pulser positive signal / Eltomatic Green / Modern pump "Pull (+)"',
    acUsage: 'Optical pulser positive signal / Eltomatic Green / Modern pump "Pull (+)"',
    description: 'Optically isolated pulse counting signal input.',
    notes: 'Green wire on Eltomatic. "Pull" on modern pumps.'
  },
  {
    pin: 11,
    label: 'Puls −',
    name: 'Pulse Counter Ground / Negative',
    category: 'sensor',
    dcUsage: 'Mechanical / reed pulser ground (Not needed for Eltomatic)',
    acUsage: 'Mechanical / reed pulser ground (Not needed for Eltomatic)',
    description: 'Standard pulse input negative terminal.',
    notes: 'Eltomatic does not require Puls −.'
  },
  {
    pin: 12,
    label: 'Puls +',
    name: 'Pulse Counter Positive / Hot',
    category: 'sensor',
    dcUsage: 'Pulse signal input / Eltomatic White wire',
    acUsage: 'Pulse signal input / Eltomatic White wire',
    description: 'Primary pulse counter input line.',
    notes: 'Eltomatic White wire connects here. If reading wrong on old boards, pulse may be inverted.'
  }
];

export interface InstallStep {
  id: number;
  title: string;
  category: 'Planning' | 'Hardware' | 'Electrical' | 'Testing' | 'Handover';
  detail: string;
  safetyNote?: string;
}

export const INSTALL_STEPS: InstallStep[] = [
  {
    id: 1,
    title: 'Inspect site and plan',
    category: 'Planning',
    detail: 'Survey fuel tank location, pump distances, cable routing, operator access, and hazardous zoning.',
    safetyNote: 'Ensure ATEX/flammable vapor boundaries are respected before drilling or mounting.'
  },
  {
    id: 2,
    title: 'Start Safety Culture inspection',
    category: 'Planning',
    detail: 'Open the Safety Culture app, start a new audit issue (+), take the site sign photo and complete the initial risk assessment questions.',
    safetyNote: 'Mandatory sign-off required prior to commencing any physical work.'
  },
  {
    id: 3,
    title: 'Decide where power comes from',
    category: 'Electrical',
    detail: 'Locate clean 230V AC mains or stable 12V/24V DC battery supply. Use a certified site electrician if mains work is required.',
    safetyNote: 'Always verify power isolation and lock-out tag-out (LOTO).'
  },
  {
    id: 4,
    title: 'Mount the orange Fuel Track box',
    category: 'Hardware',
    detail: 'Position at ergonomic height for the fuel attendant without obstructing the emergency stop switch or driver sightlines.',
    safetyNote: 'Ensure the box does not impede vehicle clearance or spill kits.'
  },
  {
    id: 5,
    title: 'Mount the junction box',
    category: 'Hardware',
    detail: 'Install in a weather-shielded, accessible spot where maintenance is easy and cables remain protected from traffic.',
    safetyNote: 'Use IP65+ rated cable glands facing downward.'
  },
  {
    id: 6,
    title: 'Install conjure pipe from tank to box',
    category: 'Hardware',
    detail: 'Run dedicated conduit/conjure pipe from tank top dipping access to the junction box for electronic probe cable routing.',
    safetyNote: 'Keep conjure free of sharp bends to avoid probe cable pinching.'
  },
  {
    id: 7,
    title: 'Run power to junction board & box',
    category: 'Electrical',
    detail: 'Route cabling with electricity isolated. Double-check polarity (DC) or L/N/E (AC) with a multimeter before energizing.',
    safetyNote: 'Never work on live junction board terminals.'
  },
  {
    id: 8,
    title: 'Connect pump, pulse, and power wiring',
    category: 'Electrical',
    detail: 'Terminate pulse meter (OPTO/Puls), pump control relay (N/O, COM), and power supply into terminals 1–12.',
    safetyNote: 'Emergency stopper wires are both positive feeds.'
  },
  {
    id: 9,
    title: 'Test pump activation',
    category: 'Testing',
    detail: 'Authorize pump via attendant tag or test mode. Confirm internal relay clicks and pump motor energizes smoothly.',
    safetyNote: 'Keep nozzle secured in holster during first motor spin.'
  },
  {
    id: 10,
    title: 'Test pulse with 20L calibration drum',
    category: 'Testing',
    detail: 'Dispense exactly 20 liters into a certified calibration vessel. Compare displayed volume against the drum meniscus gauge.',
    safetyNote: 'Check grounding clamp on metal drum before dispensing fuel.'
  },
  {
    id: 11,
    title: 'Calibrate the tank probe',
    category: 'Testing',
    detail: 'Access technician secret menu (tap gear, tap screen 10 times). Enter tank depth in cm and capture probe voltages out vs in.',
    safetyNote: 'Ensure tank variance is below 0.20% (maximum allowable 1.00%).'
  },
  {
    id: 12,
    title: 'Manager inspection and handover',
    category: 'Handover',
    detail: 'Demonstrate live transaction, emergency stop trigger, dip reading, and obtain site manager signature on sign-off sheet.',
    safetyNote: 'Review emergency stop functionality in presence of site staff.'
  },
  {
    id: 13,
    title: 'Take complete photos & upload Safety Culture',
    category: 'Handover',
    detail: 'Photograph all 9 required angles (board, unit, meter, calibrations, contacts). Finalize and submit the Safety Culture audit.',
    safetyNote: 'Include closing note: “Work completed, when left everything was good”.'
  }
];

export interface WiringGuideItem {
  id: string;
  title: string;
  system: 'DC' | 'AC' | 'PUMP' | 'PULSE' | 'HARDWARE';
  summary: string;
  bullets: string[];
  notes?: string;
  imageKey?: 'sol' | 'board' | 'relay' | 'iqphoto' | 'iqrelay';
  imageCaption?: string;
  terminalsUsed?: number[];
}

export const WIRING_GUIDES: WiringGuideItem[] = [
  {
    id: 'dc-install',
    title: 'DC Installation (12V / 24V Systems)',
    system: 'DC',
    summary: 'Standard wiring configuration for DC powered pump units and mobile bowsers.',
    bullets: [
      'Pin 3: Earth / Negative',
      'Pin 4: N/O (Normally Open relay control)',
      'Pin 5: COM (Common - bridged to 12/24V DC+)',
      'Pin 6: 12/24V DC Main Power In (+)',
      'Pin 8: Valve (+)',
      'Pin 9: OPTO − (Optical pulse negative)',
      'Pin 10: OPTO + (Optical pulse positive)',
      'Pin 12: Puls + (Pulse signal hot)'
    ],
    notes: 'Take out the internal power supply when fed from vehicle or battery bank. Use a 12V or 24V relay matching pump voltage. Relay posts: Earth/Pump (−) and N/O on top, Power (+) on one side, Pump (+) on the other.',
    imageKey: 'sol',
    imageCaption: 'Solenoid relay: Earth / Pump −, N/O, Power +, Pump +',
    terminalsUsed: [3, 4, 5, 6, 8, 9, 10, 12]
  },
  {
    id: 'ac-install',
    title: 'AC Installation (230V Mains Systems)',
    system: 'AC',
    summary: 'Mains 230V AC wiring for commercial fuel dispensers and fixed depot pumps.',
    bullets: [
      'Pin 1: L (Live 230V AC In)',
      'Pin 2: N (Neutral In)',
      'Pin 3: E (Protective Earth)',
      'Pin 4: N/O (Switched Live to Pump motor)',
      'Pin 5: COM (Bridge from Live Pin 1 to COM Pin 5)',
      'Pin 11: Puls −',
      'Pin 12: Puls +'
    ],
    notes: 'Pump Live goes to N/O (Pin 4). Make a jumper bridge from AC Live (Pin 1) to COM (Pin 5). Pump Neutral goes straight to main N (Pin 2). To reverse the switch action: take out the bridge and wire pump Live directly with main Live. Emergency stopper wires are BOTH positive.',
    terminalsUsed: [1, 2, 3, 4, 5, 11, 12]
  },
  {
    id: 'relay-12v',
    title: '12V Automotive / Industrial Relay (DC)',
    system: 'DC',
    summary: 'Pinout connections for standard automotive cube relays used in 12V DC pump switching.',
    bullets: [
      'Pin 30: 12V DC main positive power',
      'Pin 87: Pump (+) switched motor power',
      'Pin 86: N/O from junction board (Pin 4)',
      'Pin 85: (−) Earth / Ground return'
    ],
    notes: 'On the junction board, make sure a bridge is installed from 12V+ (Pin 6) to COM (Pin 5) to feed the relay coil contact.',
    imageKey: 'relay',
    imageCaption: '12V relay wiring diagram',
    terminalsUsed: [4, 5, 6, 3]
  },
  {
    id: 'iq-plant-hire',
    title: 'IQ Plant Hire (DC - Old Unit with Valve +)',
    system: 'DC',
    summary: 'Legacy DC configuration with valve-switched relay coil ground for IQ Plant Hire units.',
    bullets: [
      'Relay Pin 30 (+): 12V+ power feed',
      'Relay Pin 87 (+): Pump (+) motor supply',
      'Relay Pin 86 (+): COM (Pin 5)',
      'Relay Pin 85 (−): Valve (−) / switched valve return'
    ],
    notes: 'This configuration energizes the relay by grounding Pin 85 through the valve output rather than standard chassis ground.',
    imageKey: 'iqphoto',
    imageCaption: 'IQ Plant Hire junction board wiring',
    terminalsUsed: [5, 6, 8]
  },
  {
    id: 'bowser-control',
    title: 'Bowser Control System (24V DC)',
    system: 'DC',
    summary: 'Dedicated 24V mobile bowser fuel dispensing control hookup.',
    bullets: [
      '24V In to terminals 6 (12/24V in +) and 3 (Earth −)',
      'Coil 1 position connects to N/O (Pin 4)',
      'Coil 2 position connects to Valve − (Pin 8)',
      'Bridge installed from 24V+ (Pin 6) to COM (Pin 5)'
    ],
    notes: 'Ensures dual-coil solenoid or bowser starter interlock triggers cleanly upon transaction authorization.',
    imageKey: 'board',
    imageCaption: 'Junction board with wires in place for bowser control',
    terminalsUsed: [3, 4, 5, 6, 8]
  },
  {
    id: 'modern-pump',
    title: 'Modern Dispensers (PROX Handle & Pull/Perr Pulse)',
    system: 'PUMP',
    summary: 'Interfacing modern electronic pump heads with optical handle switches and electronic pulse transmitters.',
    bullets: [
      'Control: 1st handle wire (Red) connects to "PROX"',
      'Control: 2nd handle wire (Blue) connects to N/O (Pin 4)',
      'Control: Where Blue wire was on "GRND", connect COM (Pin 5)',
      'Counting: "Pull" is positive (+) -> connect to OPTO + (Pin 10)',
      'Counting: "Perr" is negative (−) -> connect to OPTO − (Pin 9)',
      'Board Jumper: MUST be set to OFF (positioned to the left)',
      'Pump Console Switch: Must be switched to STANDALONE, not CONSOLE'
    ],
    notes: 'Critical: If the pump switch is left in CONSOLE mode, the Fuel Track system will not receive pulse feedback or handle activation.',
    terminalsUsed: [4, 5, 9, 10]
  },
  {
    id: 'eltomatic',
    title: 'Eltomatic Pulse Encoder Hookup',
    system: 'PULSE',
    summary: 'Wiring and dipswitch settings for Eltomatic optical shaft pulse encoders.',
    bullets: [
      'White wire: Connects to Puls + (Pin 12)',
      'Green wire: Connects to OPTO + (Pin 10)',
      'Do NOT connect Elto Earth line',
      'Puls − (Pin 11) is NOT needed',
      'Board Jumper: ON (to the right)',
      'Dipswitch 7: Switch to ON',
      'Note: Jumper must be OFF if pump feeds from Pull/Perr'
    ],
    notes: 'Connecting the Eltomatic earth wire can create ground loop interference that degrades pulse count accuracy.',
    terminalsUsed: [10, 12]
  },
  {
    id: 'flow-meter',
    title: 'Flow Meter Mechanical Installation',
    system: 'HARDWARE',
    summary: 'Physical mounting, gland orientation, and thread sealing for in-line fuel meters.',
    bullets: [
      'Cable gland and wiring MUST face toward the pump body',
      'Always inspect and install rubber O-rings and in-line mesh filters',
      'Thread tape application: Wrap thinly at the nose/front and thicker toward the back threads',
      'Avoid tape overhang into the fuel flow path to prevent pulse jamming'
    ],
    notes: 'Debris or loose thread tape is the #1 cause of new flow meters seizing or undercounting on site.',
    terminalsUsed: [9, 10, 11, 12]
  }
];

export interface TroubleshootItem {
  id: string;
  symptom: string;
  component: string;
  likelyCause: string;
  solution: string;
  steps: string[];
  imageKey?: 'sol' | 'board' | 'relay';
}

export const TROUBLESHOOT_GUIDES: TroubleshootItem[] = [
  {
    id: 'pulse-not-counting',
    symptom: 'Pulse doesn’t count (New Board)',
    component: 'Zener Diode / Pulse Circuit',
    likelyCause: 'The protective Zener diode on the pulse input rail has blown due to transient voltage or incorrect wiring.',
    solution: 'Inspect the junction board for scorched diode. Replace the Zener diode to restore pulse counting.',
    steps: [
      'Isolate power to the junction box.',
      'Check resistance across the Zener diode on the pulse input channel.',
      'If shorted or open circuit, desolder or replace the board diode.',
      'Test pulse counting using the 20L calibration drum once replaced.'
    ],
    imageKey: 'board'
  },
  {
    id: 'relay-no-click-24v',
    symptom: 'Relay doesn’t click (24V New Board)',
    component: '24V Switching Transistor',
    likelyCause: 'The surface-mount transistor controlling the 24V relay driver has failed.',
    solution: 'Replace the 24V driver transistor or swap with spare junction board.',
    steps: [
      'Verify 24V DC supply is present at terminals 6 & 3.',
      'Listen closely for relay click when fuel authorization tag is scanned.',
      'If voltage does not pull low at coil terminal, the 24V transistor is gone.',
      'Replace the transistor or swap the board.'
    ],
    imageKey: 'sol'
  },
  {
    id: 'unit-not-working',
    symptom: 'Unit sluggish, rebooting, or unstable',
    component: 'Internal Battery / Supply Voltage',
    likelyCause: 'Degraded internal battery is dragging down the system power rail below operating voltage.',
    solution: 'Disconnect or replace the internal backup battery.',
    steps: [
      'Measure main bus voltage with unit running.',
      'Disconnect battery lead and check if unit stabilizes.',
      'Replace aging backup cell if voltage dips below 11.5V under load.'
    ]
  },
  {
    id: 'old-board-startup',
    symptom: 'Old board won’t start or reads pulses wrong',
    component: 'Boot Battery / Pulse Polarity',
    likelyCause: 'Old revision boards require battery presence to complete initial boot sequence; pulse polarity may be inverted.',
    solution: 'Install charged battery, invert pulse polarity, and check top board display connectors.',
    steps: [
      'Install battery to provide cold-start voltage latch.',
      'If pulses count backward or erratic, invert Puls lines (+/−).',
      'Display reset switch wiring: One wire to phone negative (−), other to "EN DEV REG".',
      'Display connector on top board: Right pin = (+), Left pin = (−).'
    ],
    imageKey: 'board'
  },
  {
    id: 'eltomatic-not-counting',
    symptom: 'Eltomatic encoder connected but no pulses',
    component: 'Eltomatic Wire & Dipswitch Setup',
    likelyCause: 'Wrong pin assignment, dipswitch 7 off, or earth wire connected creating ground noise.',
    solution: 'Ensure White is on Puls +, Green on OPTO +, disconnect Elto Earth, set jumper right & dipswitch 7 ON.',
    steps: [
      'Verify White is in Pin 12 (Puls +).',
      'Verify Green is in Pin 10 (OPTO +).',
      'Disconnect Elto Earth if attached.',
      'Set board jumper to the RIGHT.',
      'Flip dipswitch 7 to ON.'
    ]
  },
  {
    id: 'modern-pump-no-pulse',
    symptom: 'Modern pump nozzle lifted but no pulse',
    component: 'Pull/Perr Leads & Console Switch',
    likelyCause: 'Pump still in CONSOLE mode or Jumper left in active position.',
    solution: 'Set pump switch to STANDALONE, move board jumper to OFF (left), and verify Pull/Perr polarity.',
    steps: [
      'Inspect pump internal electronics: toggle console switch to STANDALONE.',
      'Connect Pull (+) to Pin 10 (OPTO +).',
      'Connect Perr (−) to Pin 9 (OPTO −).',
      'Move jumper to the LEFT (OFF position).'
    ]
  },
  {
    id: 'pump-wont-activate',
    symptom: 'Authorized on screen, but pump motor will not start',
    component: 'Relay Bridge / Emergency Stop',
    likelyCause: 'Missing COM bridge, wrong relay coil voltage, or tripped emergency stop.',
    solution: 'Verify COM bridge (12/24V+ in DC, Live in AC), check emergency stopper positive lines.',
    steps: [
      'DC Systems: Is 12V+ or 24V+ bridged to COM (Pin 5)? Does relay click?',
      'AC Systems: Is AC Live bridged to COM (Pin 5) with pump motor on N/O (Pin 4)?',
      'Check emergency stop circuit: remember both wires are positive.',
      'Verify correct relay voltage: 12V relay on 12V pumps, 24V relay on 24V pumps.'
    ],
    imageKey: 'relay'
  },
  {
    id: 'oscilloscope-testing',
    symptom: 'Intermittent signal, false pulses, or relay chattering',
    component: 'Signal Oscilloscope Diagnostics',
    likelyCause: 'Noise transients, unsuppressed relay inductive spikes, or faulty encoder pulses.',
    solution: 'Use oscilloscope with black probe on ground and test positive node on 500ms cycle.',
    steps: [
      'Connect Black probe lead securely to system Earth/Ground.',
      'Place Positive probe lead on the test point (Relay coil, OPTO+, or Puls+).',
      'Configure timebase to 500ms cycle.',
      'Set voltage scale to 1V/div or 5V/div depending on system voltage.',
      'Observe trace: look for flat steady voltage and absence of erratic inductive spikes on relay release.'
    ]
  }
];
