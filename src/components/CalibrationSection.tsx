import React, { useState } from 'react';
import { Sliders, Calculator, Smartphone, CheckCircle, AlertTriangle, XCircle, Sparkles, RefreshCw } from 'lucide-react';

export const CalibrationSection: React.FC = () => {
  // 10-Tap Phone Secret Menu Simulator state
  const [tapCount, setTapCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Tank Dipping Variance Calculator state
  const [expectedVolume, setExpectedVolume] = useState<string>('5000');
  const [dippedVolume, setDippedVolume] = useState<string>('5008');

  // Pulse 20L Drum Test Calculator state
  const [drumSize, setDrumSize] = useState<string>('20.0');
  const [countedPulses, setCountedPulses] = useState<string>('2000');
  const [kFactor, setKFactor] = useState<string>('100'); // Pulses per Liter

  // Handle secret 10-tap interaction
  const handleSecretTap = () => {
    if (isUnlocked) return;
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 10) {
      setIsUnlocked(true);
    }
  };

  const resetSecretMenu = () => {
    setTapCount(0);
    setIsUnlocked(false);
  };

  // Dipping variance calculation
  const expVal = parseFloat(expectedVolume) || 0;
  const dipVal = parseFloat(dippedVolume) || 0;
  const diffLiters = dipVal - expVal;
  const absDiffLiters = Math.abs(diffLiters);
  const variancePct = expVal > 0 ? (absDiffLiters / expVal) * 100 : 0;

  let varianceStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'WARNING' | 'FAILED' = 'OPTIMAL';
  if (variancePct <= 0.20) {
    varianceStatus = 'OPTIMAL';
  } else if (variancePct <= 0.80) {
    varianceStatus = 'ACCEPTABLE';
  } else if (variancePct <= 1.00) {
    varianceStatus = 'WARNING';
  } else {
    varianceStatus = 'FAILED';
  }

  // Pulse 20L Drum Test calculation
  const drumVol = parseFloat(drumSize) || 20.0;
  const pulses = parseFloat(countedPulses) || 0;
  const kRate = parseFloat(kFactor) || 100;
  const measuredVol = kRate > 0 ? pulses / kRate : 0;
  const volErrorLiters = measuredVol - drumVol;
  const volErrorMl = volErrorLiters * 1000;
  const pulseErrorPct = drumVol > 0 ? (volErrorLiters / drumVol) * 100 : 0;
  const absPulseErrorPct = Math.abs(pulseErrorPct);

  const pulseStatus = absPulseErrorPct <= 0.5 ? 'PASS' : 'RECALIBRATE';

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-500" />
          <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
            Calibration &amp; Tank Dipping Suite
          </h2>
        </div>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
          Field technician tools for fuel tank probe calibration, secret menu unlocking, dipping variance verification, and 20L pulse drum accuracy testing.
        </p>
      </div>

      {/* 1. Phone Secret 10-Tap Menu Interactive Guide */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Tank Calibration: 10-Tap Technician Unlock
            </h3>
          </div>
          <button
            onClick={resetSecretMenu}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset demo
          </button>
        </div>

        {/* Steps */}
        <ol className="space-y-2.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 list-decimal pl-4 marker:font-bold marker:text-amber-500">
          <li>
            On the Fuel Track mobile phone, tap the <strong>Gear icon</strong> (Settings).
          </li>
          <li>
            Tap <strong>ten times in a row</strong> anywhere on the screen to reveal the hidden calibration console.
          </li>
          <li>Select the specific tank and enter the full vertical height in <strong>cm</strong>.</li>
          <li>
            Calibrate probe voltages: Capture the baseline voltage with probe <strong>out of fuel</strong>, then re-insert and capture voltage <strong>placed back in fuel</strong>.
          </li>
          <li>Once all voltages are recorded, enter the authorized <strong>installer code</strong> and transmit calibration.</li>
        </ol>

        {/* Interactive Phone Simulator Widget */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white flex flex-col items-center justify-center space-y-3">
          <div className="w-full max-w-xs flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span>Fuel Track Unit App</span>
            <span className="font-mono text-amber-400">⚙ Settings</span>
          </div>

          <div
            onClick={handleSecretTap}
            className={`w-full max-w-xs h-36 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all select-none p-4 text-center border-2 ${
              isUnlocked
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-slate-800/80 border-slate-700 active:scale-98'
            }`}
          >
            {isUnlocked ? (
              <div className="space-y-1 animate-in zoom-in-95 duration-200">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-emerald-200">Technician Menu Unlocked!</p>
                <p className="text-[11px] text-emerald-400">Enter tank height in cm &amp; record probe voltages</p>
              </div>
            ) : (
              <div className="space-y-1">
                <Sparkles className="w-6 h-6 text-amber-400 mx-auto animate-pulse" />
                <p className="text-xs font-semibold text-slate-200">
                  Tap here to simulate 10 taps
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < tapCount ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{tapCount} of 10 taps</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Tank Dipping Variance Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Tank Dipping Variance Calculator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Technical Rule: Variance should be low, ideally below <strong>0.20%</strong>, but never over <strong>1.00%</strong>. 0.80% is pushing limits.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Theoretical / Expected Volume (Liters)
            </label>
            <input
              type="number"
              step="any"
              value={expectedVolume}
              onChange={e => setExpectedVolume(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Actual Physical Dip Reading (Liters)
            </label>
            <input
              type="number"
              step="any"
              value={dippedVolume}
              onChange={e => setDippedVolume(e.target.value)}
              placeholder="e.g. 5008"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Variance Results Display Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            varianceStatus === 'OPTIMAL'
              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
              : varianceStatus === 'ACCEPTABLE'
              ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/60 text-blue-900 dark:text-blue-200'
              : varianceStatus === 'WARNING'
              ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
              : 'bg-red-50/60 dark:bg-red-950/20 border-red-300 dark:border-red-800/60 text-red-900 dark:text-red-200'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              {varianceStatus === 'OPTIMAL' && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {varianceStatus === 'ACCEPTABLE' && <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              {varianceStatus === 'WARNING' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              {varianceStatus === 'FAILED' && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}

              <span className="font-bold text-sm uppercase tracking-wider">
                {varianceStatus === 'OPTIMAL' && 'Optimal (Within <0.20% Standard)'}
                {varianceStatus === 'ACCEPTABLE' && 'Acceptable (0.20% – 0.80%)'}
                {varianceStatus === 'WARNING' && 'Pushing Limits (0.80% – 1.00%)'}
                {varianceStatus === 'FAILED' && 'REJECT (Exceeds 1.00% Limit)'}
              </span>
            </div>
            <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
              Difference: <strong>{diffLiters >= 0 ? `+${diffLiters.toFixed(2)}` : diffLiters.toFixed(2)} L</strong> ({absDiffLiters.toFixed(2)} Liters variance)
            </p>
          </div>

          <div className="text-right sm:border-l sm:pl-4 border-slate-300 dark:border-slate-700">
            <span className="text-xs text-slate-500 block uppercase font-semibold">Calculated Variance</span>
            <span className="text-2xl font-black font-mono tracking-tight">
              {variancePct.toFixed(3)}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. 20L Pulse Calibration Drum Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              20L Pulse Test &amp; K-Factor Calculator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test pulse count accuracy using the standard certified 20L metal proving drum.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Prover Drum Volume (L)
            </label>
            <input
              type="number"
              value={drumSize}
              onChange={e => setDrumSize(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pulses Counted in 20L
            </label>
            <input
              type="number"
              value={countedPulses}
              onChange={e => setCountedPulses(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target K-Factor (Pulses / L)
            </label>
            <input
              type="number"
              value={kFactor}
              onChange={e => setKFactor(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Pulse Results Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 block uppercase font-bold">Meter Output Analysis:</span>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
              Dispensed equivalent: <strong className="font-mono">{measuredVol.toFixed(3)} Liters</strong>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Discrepancy: <span className="font-mono">{volErrorMl >= 0 ? `+${volErrorMl.toFixed(0)}` : volErrorMl.toFixed(0)} mL</span> ({pulseErrorPct.toFixed(2)}%)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                pulseStatus === 'PASS'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
              }`}
            >
              {pulseStatus === 'PASS' ? 'Within Flow Tolerance' : 'Recalibrate K-Factor'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
