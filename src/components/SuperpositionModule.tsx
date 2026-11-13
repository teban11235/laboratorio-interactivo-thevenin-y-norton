import React, { useState } from 'react';
import { ParameterControl } from './ParameterControl';
import { Power, RotateCcw, Sliders, Zap } from 'lucide-react';

interface SuperpositionModuleProps {
  isPresentationMode: boolean;
}

type SourceMode = 'both' | 'onlyV' | 'onlyI';

export const SuperpositionModule: React.FC<SuperpositionModuleProps> = ({ isPresentationMode }) => {
  const [sourceMode, setSourceMode] = useState<SourceMode>('both');

  // Freely configurable circuit parameters
  // Initial values produce v_o^(V) = 4V, v_o^(I) = 8V, v_o = 12V across R_o = 2 Ω
  const [vSource, setVSource] = useState<number>(20);
  const [iSource, setISource] = useState<number>(8);
  const [r1, setR1] = useState<number>(5);
  const [r2, setR2] = useState<number>(3);
  const [rTarget, setRTarget] = useState<number>(2);

  const safeR1 = Math.max(0.5, r1);
  const safeR2 = Math.max(0.5, r2);
  const safeRo = Math.max(0.5, rTarget);
  const totalLoopR = safeR1 + safeR2 + safeRo;

  // Contribution of Voltage Source V_s (with Current Source I_s = 0 A -> Open Circuit)
  const iFromV = vSource / totalLoopR;
  const voFromV = iFromV * safeRo;

  // Contribution of Current Source I_s (with Voltage Source V_s = 0 V -> Short Circuit)
  // Current divider at top node between left branch (R1) and right branch (R2 + Ro)
  const iFromI = iSource * (safeR1 / totalLoopR);
  const voFromI = iFromI * safeRo;

  // Total response by Superposition
  const iTotal = iFromV + iFromI;
  const voTotal = voFromV + voFromI;

  // Displayed values according to active mode
  const displayedVo =
    sourceMode === 'both' ? voTotal : sourceMode === 'onlyV' ? voFromV : voFromI;
  const displayedIo =
    sourceMode === 'both' ? iTotal : sourceMode === 'onlyV' ? iFromV : iFromI;

  // Power comparison on R_o
  const pFromV = (voFromV * voFromV) / safeRo;
  const pFromI = (voFromI * voFromI) / safeRo;
  const pWrongSum = pFromV + pFromI;
  const pCorrectTotal = (voTotal * voTotal) / safeRo;

  const handleReset = () => {
    setVSource(20);
    setISource(8);
    setR1(5);
    setR2(3);
    setRTarget(2);
    setSourceMode('both');
  };

  const isVActive = sourceMode === 'both' || sourceMode === 'onlyV';
  const isIActive = sourceMode === 'both' || sourceMode === 'onlyI';

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Redes con Múltiples Fuentes Independientes</span>
            <span aria-hidden="true">·</span>
            <span>Aislamiento y Suma Algebraica</span>
          </div>
          <h2 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            Principio de Superposición y Regla de Apagado de Fuentes
          </h2>
          <p className={`text-slate-600 mt-1 w-full ${isPresentationMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
            En cualquier circuito lineal, una variable eléctrica es la suma algebraica de las contribuciones individuales de cada fuente independiente actuando por separado mientras las demás se apagan.
          </p>
        </div>

        {/* 3-State Interactive Source Mode Selector */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start shrink-0">
          <button
            type="button"
            onClick={() => setSourceMode('both')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              sourceMode === 'both'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Circuito Completo (V + I)
          </button>
          <button
            type="button"
            onClick={() => setSourceMode('onlyV')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              sourceMode === 'onlyV'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Solo Fuente V (I → Abierto)
          </button>
          <button
            type="button"
            onClick={() => setSourceMode('onlyI')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              sourceMode === 'onlyI'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Solo Fuente I (V → Cortocircuito)
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch">
        {/* LEFT ZONE: Interactive Schematic & Source Deactivation Rules (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive SVG Circuit Canvas */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-xl' : 'text-base'}`}>
                  Esquemático Interactivo: Haz clic en los botones de estado o sobre cada fuente
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Observa cómo cambia físicamente la topología del circuito al igualar a cero cada fuente independiente.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-800 font-semibold tabular-nums">
                  Lectura actual en R_o: v_o = {displayedVo.toFixed(2)} V
                </span>
              </div>
            </div>

            <div className="circuit-grid border border-slate-200 rounded-lg p-4">
              <svg viewBox="-20 0 690 280" className="w-full h-auto">
                {/* Main Top & Bottom Wires */}
                {/* Left loop top wire through R1 to Node N */}
                <line x1="85" y1="65" x2="145" y2="65" stroke="#334155" strokeWidth="2.5" />
                <line x1="225" y1="65" x2="310" y2="65" stroke="#334155" strokeWidth="2.5" />

                {/* Right loop top wire from Node N through R2 to R_o */}
                <line x1="310" y1="65" x2="375" y2="65" stroke="#334155" strokeWidth="2.5" />
                <line x1="455" y1="65" x2="535" y2="65" stroke="#334155" strokeWidth="2.5" />

                {/* Bottom return wire */}
                <line x1="85" y1="220" x2="535" y2="220" stroke="#334155" strokeWidth="2.5" />

                {/* Left branch vertical wires for V_s */}
                <line x1="85" y1="65" x2="85" y2="112" stroke="#334155" strokeWidth="2.5" />
                <line x1="85" y1="172" x2="85" y2="220" stroke="#334155" strokeWidth="2.5" />

                {/* Center branch vertical wires for I_s */}
                <line x1="310" y1="65" x2="310" y2="112" stroke="#334155" strokeWidth="2.5" />
                <line x1="310" y1="172" x2="310" y2="220" stroke="#334155" strokeWidth="2.5" />

                {/* Right branch vertical wires for R_o */}
                <line x1="535" y1="65" x2="535" y2="108" stroke="#334155" strokeWidth="2.5" />
                <line x1="535" y1="178" x2="535" y2="220" stroke="#334155" strokeWidth="2.5" />

                {/* Animated Current Flow Overlay along active branches */}
                {Math.abs(displayedIo) > 0.01 && (
                  <path
                    d="M 310 65 L 535 65 L 535 220 L 310 220"
                    fill="none"
                    stroke={sourceMode === 'onlyV' ? '#0284c7' : sourceMode === 'onlyI' ? '#d97706' : '#059669'}
                    strokeWidth="3"
                    className={displayedIo >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                    opacity="0.8"
                  />
                )}
                {isVActive && Math.abs(vSource) > 0.01 && (
                  <path
                    d="M 85 220 L 85 65 L 310 65"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                    className={vSource >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                    opacity="0.7"
                  />
                )}

                {/* Node N Marker */}
                <circle cx="310" cy="65" r="4.5" fill="#0f172a" />
                <text x="310" y="50" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-700">
                  Nodo Central
                </text>

                {/* RESISTOR R1 */}
                <rect x="145" y="51" width="80" height="28" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
                <path
                  d="M 153 65 L 161 56 L 171 74 L 181 56 L 191 74 L 201 56 L 211 74 L 218 65"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                />
                <text x="185" y="42" textAnchor="middle" className="text-[12px] font-mono font-semibold fill-slate-700">
                  R₁ = {safeR1.toFixed(1)} Ω
                </text>

                {/* RESISTOR R2 */}
                <rect x="375" y="51" width="80" height="28" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
                <path
                  d="M 383 65 L 391 56 L 401 74 L 411 56 L 421 74 L 431 56 L 441 74 L 448 65"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                />
                <text x="415" y="42" textAnchor="middle" className="text-[12px] font-mono font-semibold fill-slate-700">
                  R₂ = {safeR2.toFixed(1)} Ω
                </text>

                {/* TARGET RESISTOR R_o (where v_o is measured) */}
                <rect x="517" y="108" width="36" height="70" rx="5" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                <path
                  d="M 535 114 L 525 122 L 545 132 L 525 142 L 545 152 L 525 162 L 535 172"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.2"
                />
                <text x="504" y="122" textAnchor="end" className="text-[14px] font-mono font-bold fill-emerald-700">
                  +
                </text>
                <text x="504" y="148" textAnchor="end" className="text-[13px] font-mono font-bold fill-emerald-800">
                  {sourceMode === 'both'
                    ? 'v_o'
                    : sourceMode === 'onlyV'
                    ? 'v_o^(V)'
                    : 'v_o^(I)'}
                </text>
                <text x="504" y="174" textAnchor="end" className="text-[14px] font-mono font-bold fill-emerald-700">
                  −
                </text>
                <text x="562" y="136" className="text-[12px] font-mono font-semibold fill-emerald-800">
                  R_o = {safeRo.toFixed(1)} Ω
                </text>
                <text x="562" y="155" className="text-[13px] font-mono font-bold fill-slate-900">
                  {displayedVo.toFixed(2)} V
                </text>
                <text x="562" y="172" className="text-[11px] font-mono fill-slate-600">
                  i_o = {displayedIo.toFixed(2)} A
                </text>

                {/* SOURCE 1: VOLTAGE SOURCE V_s (Active vs Short Circuit 0 V) */}
                <g
                  onClick={() => setSourceMode(sourceMode === 'onlyI' ? 'both' : 'onlyI')}
                  className="cursor-pointer"
                >
                  {isVActive ? (
                    <>
                      <circle cx="85" cy="142" r="28" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
                      <text x="85" y="136" textAnchor="middle" className="text-[15px] font-mono font-bold fill-sky-700">
                        +
                      </text>
                      <text x="85" y="156" textAnchor="middle" className="text-[15px] font-mono font-bold fill-sky-700">
                        −
                      </text>
                      <text x="45" y="138" textAnchor="end" className="text-[12px] font-mono font-bold fill-sky-700">
                        V_s
                      </text>
                      <text x="45" y="154" textAnchor="end" className="text-[12px] font-mono font-semibold fill-slate-800">
                        {vSource.toFixed(1)} V
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Short Circuit replacement: direct thick bridge wire */}
                      <rect x="52" y="110" width="66" height="64" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3" />
                      <line x1="85" y1="112" x2="85" y2="172" stroke="#dc2626" strokeWidth="4" />
                      <circle cx="85" cy="112" r="4" fill="#dc2626" />
                      <circle cx="85" cy="172" r="4" fill="#dc2626" />
                      <text x="85" y="192" textAnchor="middle" className="text-[11px] font-mono font-bold fill-red-700">
                        V_s = 0 V (Cortocircuito)
                      </text>
                    </>
                  )}
                </g>

                {/* SOURCE 2: CURRENT SOURCE I_s (Active vs Open Circuit 0 A) */}
                <g
                  onClick={() => setSourceMode(sourceMode === 'onlyV' ? 'both' : 'onlyV')}
                  className="cursor-pointer"
                >
                  {isIActive ? (
                    <>
                      <circle cx="310" cy="142" r="28" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
                      <line x1="310" y1="158" x2="310" y2="130" stroke="#d97706" strokeWidth="2.5" />
                      <polygon points="310,122 304,132 316,132" fill="#d97706" />
                      <text x="270" y="138" textAnchor="end" className="text-[12px] font-mono font-bold fill-amber-700">
                        I_s
                      </text>
                      <text x="270" y="154" textAnchor="end" className="text-[12px] font-mono font-semibold fill-slate-800">
                        {iSource.toFixed(1)} A
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Open Circuit replacement: open terminals */}
                      <rect x="272" y="110" width="76" height="64" rx="8" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 3" />
                      <circle cx="310" cy="116" r="4.5" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
                      <circle cx="310" cy="168" r="4.5" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
                      <text x="310" y="192" textAnchor="middle" className="text-[11px] font-mono font-bold fill-amber-800">
                        I_s = 0 A (Circuito Abierto)
                      </text>
                    </>
                  )}
                </g>
              </svg>
            </div>

            {/* Summary Cards for the 3 Superposition Terms: v_o^(V) + v_o^(I) = v_o */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <button
                type="button"
                onClick={() => setSourceMode('onlyV')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  sourceMode === 'onlyV'
                    ? 'bg-sky-50/70 border-sky-500 ring-1 ring-sky-500'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Aporte de Fuente de Tensión</span>
                  <span className="font-mono font-semibold text-sky-700">I_s = 0 A (Abierto)</span>
                </div>
                <div className="font-mono font-bold text-xl text-sky-700 tabular-nums">
                  v_o^(V) = {voFromV.toFixed(2)} V
                </div>
                <div className="text-xs font-mono text-slate-600 mt-1 tabular-nums">
                  i_o^(V) = {iFromV.toFixed(2)} A
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSourceMode('onlyI')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  sourceMode === 'onlyI'
                    ? 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Aporte de Fuente de Corriente</span>
                  <span className="font-mono font-semibold text-amber-700">V_s = 0 V (Corto)</span>
                </div>
                <div className="font-mono font-bold text-xl text-amber-700 tabular-nums">
                  v_o^(I) = {voFromI.toFixed(2)} V
                </div>
                <div className="text-xs font-mono text-slate-600 mt-1 tabular-nums">
                  i_o^(I) = {iFromI.toFixed(2)} A
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSourceMode('both')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  sourceMode === 'both'
                    ? 'bg-emerald-50/70 border-emerald-600 ring-1 ring-emerald-600'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Suma Algebraica Total</span>
                  <span className="font-mono font-semibold text-emerald-700">v_o^(V) + v_o^(I)</span>
                </div>
                <div className="font-mono font-bold text-xl text-emerald-800 tabular-nums">
                  v_o = {voTotal.toFixed(2)} V
                </div>
                <div className="text-xs font-mono text-slate-600 mt-1 tabular-nums">
                  i_o = {iTotal.toFixed(2)} A
                </div>
              </button>
            </div>
          </div>

          {/* Visual Guide: Regla de Apagado de Fuentes Independientes + Ventaja/Desventaja */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-sky-600" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Regla de "Apagado de las Fuentes"
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Desactivar una fuente independiente significa igualar su valor a cero y reemplazarla por su modelo pasivo equivalente:
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-sans font-medium text-slate-700">a. Fuente ideal de tensión:</span>
                  <span className="text-sky-700 font-bold">0 V ⇒ Cortocircuito</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="font-sans font-medium text-slate-700">b. Fuente ideal de corriente:</span>
                  <span className="text-amber-700 font-bold">0 A ⇒ Circuito Abierto</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Cálculo de Potencia y Costo Computacional
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Con <span className="font-mono font-semibold">N</span> fuentes independientes se deben resolver <span className="font-mono font-semibold">N</span> circuitos más simples. Recuerda no sumar las potencias individuales:
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono space-y-1 tabular-nums">
                <div className="flex justify-between text-slate-600">
                  <span>P_o^(V) + P_o^(I) (Incorrecto):</span>
                  <span className="line-through text-red-600 font-semibold">
                    {pFromV.toFixed(2)} + {pFromI.toFixed(2)} = {pWrongSum.toFixed(2)} W
                  </span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold">
                  <span>P_o = v_o² / R_o (Correcto):</span>
                  <span className="text-emerald-700">{pCorrectTotal.toFixed(2)} W</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT ZONE: Free Parameter Controls & Step-by-Step Derivation (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Valores Configurables del Circuito
                </h3>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restablecer
              </button>
            </div>

            <div className="space-y-1">
              <ParameterControl
                label="Fuente de Tensión"
                symbol="V_s"
                value={vSource}
                min={-50}
                max={60}
                step={1}
                unit="V"
                onChange={setVSource}
                accentColor="sky"
                isPresentationMode={isPresentationMode}
              />
              <ParameterControl
                label="Fuente de Corriente"
                symbol="I_s"
                value={iSource}
                min={-20}
                max={25}
                step={0.5}
                unit="A"
                onChange={setISource}
                accentColor="amber"
                isPresentationMode={isPresentationMode}
              />
              <ParameterControl
                label="Resistor Izquierdo"
                symbol="R₁"
                value={r1}
                min={1}
                max={30}
                step={0.5}
                unit="Ω"
                onChange={setR1}
                accentColor="slate"
                isPresentationMode={isPresentationMode}
              />
              <ParameterControl
                label="Resistor Intermedio"
                symbol="R₂"
                value={r2}
                min={1}
                max={30}
                step={0.5}
                unit="Ω"
                onChange={setR2}
                accentColor="slate"
                isPresentationMode={isPresentationMode}
              />
              <ParameterControl
                label="Resistor de Salida"
                symbol="R_o"
                value={rTarget}
                min={1}
                max={25}
                step={0.5}
                unit="Ω"
                onChange={setRTarget}
                accentColor="emerald"
                helperText="Elemento donde se determina la tensión objetivo v_o."
                isPresentationMode={isPresentationMode}
              />
            </div>
          </div>

          {/* Step-by-Step Procedure Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <h3 className="font-display font-bold text-slate-900 text-sm">
              Procedimiento Sistemático en Vivo
            </h3>

            <div className="space-y-2.5 text-xs font-mono tabular-nums">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-sans font-semibold text-sky-800">
                  Paso 1: Activar solo V_s ({vSource.toFixed(1)} V), apagar I_s (0 A)
                </div>
                <div className="text-slate-600 font-sans text-[11px]">
                  Con I_s en circuito abierto, R₁, R₂ y R_o quedan en serie:
                </div>
                <div className="text-slate-900 font-semibold pt-1">
                  v_o^(V) = V_s · [R_o / (R₁ + R₂ + R_o)]
                </div>
                <div className="text-sky-700 font-bold">
                  v_o^(V) = {vSource.toFixed(1)} · [{safeRo.toFixed(1)} / {totalLoopR.toFixed(1)}] = {voFromV.toFixed(2)} V
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-sans font-semibold text-amber-800">
                  Paso 2: Activar solo I_s ({iSource.toFixed(1)} A), apagar V_s (0 V)
                </div>
                <div className="text-slate-600 font-sans text-[11px]">
                  Con V_s en cortocircuito, I_s se divide entre R₁ y (R₂ + R_o):
                </div>
                <div className="text-slate-900 font-semibold pt-1">
                  i_o^(I) = I_s · [R₁ / (R₁ + R₂ + R_o)] = {iFromI.toFixed(2)} A
                </div>
                <div className="text-amber-700 font-bold">
                  v_o^(I) = i_o^(I) · R_o = ({iFromI.toFixed(2)}) · ({safeRo.toFixed(1)}) = {voFromI.toFixed(2)} V
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 space-y-1">
                <div className="font-sans font-semibold text-emerald-900">
                  Paso 3: Sumar algebraicamente las contribuciones
                </div>
                <div className="text-emerald-800 font-bold text-sm">
                  v_o = v_o^(I) + v_o^(V) = {voFromI.toFixed(2)} V + ({voFromV.toFixed(2)} V) = {voTotal.toFixed(2)} V
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
