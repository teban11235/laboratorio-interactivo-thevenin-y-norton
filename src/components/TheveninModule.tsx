import React, { useState } from 'react';
import { ParameterControl } from './ParameterControl';
import { ArrowRightLeft, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';

interface TheveninModuleProps {
  isPresentationMode: boolean;
}

type TheveninStage = 'voc' | 'rth' | 'compare';

export const TheveninModule: React.FC<TheveninModuleProps> = ({ isPresentationMode }) => {
  const [stage, setStage] = useState<TheveninStage>('compare');

  // Freely configurable parameters
  // Default values give V_Th = 30 V and R_Th = 4 Ω
  const [vSource, setVSource] = useState<number>(30);
  const [iSource, setISource] = useState<number>(2.5);
  const [r1, setR1] = useState<number>(6);
  const [r2, setR2] = useState<number>(12);
  const [r3, setR3] = useState<number>(0);
  const [rLoad, setRLoad] = useState<number>(6);

  const safeR1 = Math.max(0.5, r1);
  const safeR2 = Math.max(0.5, r2);
  const safeR3 = Math.max(0, r3);
  const safeRL = Math.max(0.5, rLoad);

  // Equivalent parallel resistance of R1 and R2
  const rParallel = (safeR1 * safeR2) / (safeR1 + safeR2);

  // R_Th seen from terminals a-b with independent sources turned off
  const rTh = rParallel + safeR3;

  // V_Th = V_oc at terminals a-b with load R_L disconnected (i_R3 = 0)
  const vThFromV = vSource * (safeR2 / (safeR1 + safeR2));
  const vThFromI = iSource * rParallel;
  const vTh = vThFromV + vThFromI;

  // Load current I_L, terminal voltage V_ab, and load power P_L
  const iLoad = vTh / (rTh + safeRL);
  const vAb = iLoad * safeRL;
  const pLoad = iLoad * iLoad * safeRL;

  // Quick load comparison table for 6 Ω, 16 Ω, 36 Ω, plus current custom R_L
  const comparisonLoads = [6, 16, 36];

  const handleReset = () => {
    setVSource(30);
    setISource(2.5);
    setR1(6);
    setR2(12);
    setR3(0);
    setRLoad(6);
    setStage('compare');
  };

  return (
    <div className="space-y-6">
      {/* Header & Procedure Stage Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Simplificación de Redes entre Dos Terminales (a–b)</span>
            <span aria-hidden="true">·</span>
            <span>Fuente de Tensión en Serie con Resistencia</span>
          </div>
          <h2 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            Teorema de Thévenin y Efecto de la Carga Variable (R_L)
          </h2>
          <p className={`text-slate-600 mt-1 w-full ${isPresentationMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
            Permite reemplazar toda la parte fija de una red lineal de dos terminales por una fuente de tensión{' '}
            <span className="font-mono font-semibold text-sky-700">V_Th = V_oc</span> en serie con una resistencia{' '}
            <span className="font-mono font-semibold text-emerald-700">R_Th = R_eq</span>, evitando recalcular toda la red cada vez que cambia la carga <span className="font-mono font-semibold">R_L</span>.
          </p>
        </div>

        {/* Interactive Step Selector */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start shrink-0">
          <button
            type="button"
            onClick={() => setStage('voc')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              stage === 'voc'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paso 1: Hallar V_Th = V_oc
          </button>
          <button
            type="button"
            onClick={() => setStage('rth')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              stage === 'rth'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paso 2: Hallar R_Th = R_eq
          </button>
          <button
            type="button"
            onClick={() => setStage('compare')}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              stage === 'compare'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paso 3: Conectar R_L y Comparar
          </button>
        </div>
      </div>

      {/* Main Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch">
        {/* LEFT ZONE: Interactive Schematics & Load Comparison (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-xl' : 'text-base'}`}>
                  {stage === 'voc' && 'Paso 1: Desconectar la carga R_L y medir el voltaje en circuito abierto (V_Th = V_oc)'}
                  {stage === 'rth' && 'Paso 2: Apagar las fuentes independientes y hallar la resistencia equivalente (R_Th)'}
                  {stage === 'compare' && 'Paso 3: Equivalencia exacta entre la Red Original y el Circuito Equivalente de Thévenin'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {stage === 'voc' &&
                    'Con los terminales a–b abiertos, no circula corriente por R₃ y el voltaje medido en bornes es V_Th.'}
                  {stage === 'rth' &&
                    'Fuente de tensión V_s → cortocircuito (0 V); fuente de corriente I_s → circuito abierto (0 A).'}
                  {stage === 'compare' &&
                    'Ambos circuitos producen exactamente la misma corriente I_L y tensión V_ab sobre cualquier carga R_L.'}
                </p>
              </div>

              {/* Quick Load Selector Buttons (6 Ω, 16 Ω, 36 Ω) */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-slate-500 font-sans mr-1">Cargas de prueba:</span>
                {comparisonLoads.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setRLoad(val);
                      setStage('compare');
                    }}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                      Math.abs(safeRL - val) < 0.01
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {val} Ω
                  </button>
                ))}
              </div>
            </div>

            {stage === 'compare' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Full Linear Network with Load R_L */}
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>a) Red Lineal Original + Carga R_L</span>
                    <span className="font-mono text-sky-700 tabular-nums">I_L = {iLoad.toFixed(2)} A</span>
                  </div>
                  <svg viewBox="0 0 360 215" className="w-full h-auto">
                    {/* Dashed box representing fixed two-terminal network */}
                    <rect
                      x="14"
                      y="20"
                      width="232"
                      height="175"
                      rx="8"
                      fill="rgba(241, 245, 249, 0.55)"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="5 4"
                    />
                    <text x="24" y="36" className="text-[10px] font-sans font-semibold fill-slate-500">
                      Red lineal fija de dos terminales
                    </text>

                    {/* Wires inside original network */}
                    <line x1="48" y1="60" x2="78" y2="60" stroke="#334155" strokeWidth="2.2" />
                    <line x1="128" y1="60" x2="260" y2="60" stroke="#334155" strokeWidth="2.2" />
                    <line x1="48" y1="175" x2="260" y2="175" stroke="#334155" strokeWidth="2.2" />
                    <line x1="48" y1="60" x2="48" y2="98" stroke="#334155" strokeWidth="2.2" />
                    <line x1="48" y1="138" x2="48" y2="175" stroke="#334155" strokeWidth="2.2" />

                    {/* R2 vertical branch */}
                    <line x1="150" y1="60" x2="150" y2="92" stroke="#334155" strokeWidth="2.2" />
                    <line x1="150" y1="142" x2="150" y2="175" stroke="#334155" strokeWidth="2.2" />

                    {/* I_s vertical branch */}
                    <line x1="205" y1="60" x2="205" y2="98" stroke="#334155" strokeWidth="2.2" />
                    <line x1="205" y1="138" x2="205" y2="175" stroke="#334155" strokeWidth="2.2" />

                    {/* Voltage Source V_s */}
                    <circle cx="48" cy="118" r="19" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                    <text x="48" y="114" textAnchor="middle" className="text-[12px] font-mono font-bold fill-sky-700">+</text>
                    <text x="48" y="128" textAnchor="middle" className="text-[12px] font-mono font-bold fill-sky-700">−</text>
                    <text x="48" y="156" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-sky-800">
                      {vSource.toFixed(0)}V
                    </text>

                    {/* R1 */}
                    <rect x="78" y="50" width="50" height="20" rx="3" fill="#fff" stroke="#475569" strokeWidth="2" />
                    <text x="103" y="64" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-slate-700">
                      R₁={safeR1}Ω
                    </text>

                    {/* R2 */}
                    <rect x="137" y="92" width="26" height="50" rx="3" fill="#fff" stroke="#475569" strokeWidth="2" />
                    <text x="150" y="120" textAnchor="middle" className="text-[9px] font-mono font-semibold fill-slate-700">
                      {safeR2}Ω
                    </text>

                    {/* Current Source I_s */}
                    <circle cx="205" cy="118" r="19" fill="#fffbeb" stroke="#d97706" strokeWidth="2" />
                    <line x1="205" y1="129" x2="205" y2="110" stroke="#d97706" strokeWidth="2" />
                    <polygon points="205,104 201,111 209,111" fill="#d97706" />
                    <text x="205" y="156" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-amber-800">
                      {iSource.toFixed(1)}A
                    </text>

                    {/* Terminals a and b */}
                    <circle cx="260" cy="60" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="260" y="48" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">a</text>
                    <circle cx="260" cy="175" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="260" y="193" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">b</text>

                    {/* External Load R_L connection */}
                    <path
                      d="M 265 60 L 312 60 L 312 90 M 312 145 L 312 175 L 265 175"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 265 60 L 312 60 L 312 175 L 265 175"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      className={iLoad >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                    />
                    <rect x="296" y="90" width="32" height="55" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <text x="312" y="114" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-800">
                      R_L
                    </text>
                    <text x="312" y="128" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-emerald-700">
                      {safeRL}Ω
                    </text>
                  </svg>
                </div>

                {/* Right: Simplified Thévenin Equivalent Circuit + Load R_L */}
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>b) Equivalente de Thévenin + Carga R_L</span>
                    <span className="font-mono text-sky-700 tabular-nums">I_L = {iLoad.toFixed(2)} A</span>
                  </div>
                  <svg viewBox="0 0 360 215" className="w-full h-auto">
                    {/* Dashed box representing Thévenin Equivalent */}
                    <rect
                      x="20"
                      y="20"
                      width="215"
                      height="175"
                      rx="8"
                      fill="rgba(240, 249, 255, 0.55)"
                      stroke="#0284c7"
                      strokeWidth="1.5"
                      strokeDasharray="5 4"
                    />
                    <text x="32" y="36" className="text-[10px] font-sans font-semibold fill-sky-800">
                      Equivalente de Thévenin (V_Th, R_Th)
                    </text>

                    {/* Single Loop Wires */}
                    <path
                      d="M 68 92 L 68 60 L 112 60 M 182 60 L 250 60 M 250 175 L 68 175 L 68 144"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                    {/* External Load Wires */}
                    <path
                      d="M 255 60 L 308 60 L 308 90 M 308 145 L 308 175 L 255 175"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />
                    {/* Animated Current */}
                    <path
                      d="M 68 60 L 308 60 L 308 175 L 68 175 Z"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      className={iLoad >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                      opacity="0.85"
                    />

                    {/* V_Th Source */}
                    <circle cx="68" cy="118" r="24" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                    <text x="68" y="113" textAnchor="middle" className="text-[14px] font-mono font-bold fill-sky-700">+</text>
                    <text x="68" y="130" textAnchor="middle" className="text-[14px] font-mono font-bold fill-sky-700">−</text>
                    <text x="68" y="160" textAnchor="middle" className="text-[11px] font-mono font-bold fill-sky-800">
                      V_Th = {vTh.toFixed(1)} V
                    </text>

                    {/* R_Th Series Resistor */}
                    <rect x="112" y="46" width="70" height="28" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <path
                      d="M 120 60 L 128 52 L 138 68 L 148 52 L 158 68 L 168 52 L 175 60"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text x="147" y="88" textAnchor="middle" className="text-[11px] font-mono font-bold fill-emerald-800">
                      R_Th = {rTh.toFixed(2)} Ω
                    </text>

                    {/* Terminals a and b */}
                    <circle cx="250" cy="60" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="250" y="48" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">a</text>
                    <circle cx="250" cy="175" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="250" y="193" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">b</text>

                    {/* Load Resistor R_L */}
                    <rect x="292" y="90" width="32" height="55" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <text x="308" y="114" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-800">
                      R_L
                    </text>
                    <text x="308" y="128" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-emerald-700">
                      {safeRL}Ω
                    </text>
                    <text x="275" y="120" textAnchor="end" className="text-[11px] font-mono font-bold fill-sky-700">
                      V_ab={vAb.toFixed(1)}V
                    </text>
                  </svg>
                </div>
              </div>
            ) : (
              /* Detailed Step View for Step 1 (V_oc) or Step 2 (R_Th) */
              <div className="circuit-grid border border-slate-200 rounded-lg p-5">
                <svg viewBox="0 0 600 220" className="w-full h-auto">
                  {/* Top & Bottom Wires */}
                  <line x1="80" y1="55" x2="140" y2="55" stroke="#334155" strokeWidth="2.5" />
                  <line x1="220" y1="55" x2="380" y2="55" stroke="#334155" strokeWidth="2.5" />
                  <line x1="450" y1="55" x2="495" y2="55" stroke="#334155" strokeWidth="2.5" />
                  <line x1="80" y1="180" x2="495" y2="180" stroke="#334155" strokeWidth="2.5" />

                  {/* Vertical branches */}
                  <line x1="80" y1="55" x2="80" y2="95" stroke="#334155" strokeWidth="2.5" />
                  <line x1="80" y1="145" x2="80" y2="180" stroke="#334155" strokeWidth="2.5" />
                  <line x1="270" y1="55" x2="270" y2="85" stroke="#334155" strokeWidth="2.5" />
                  <line x1="270" y1="150" x2="270" y2="180" stroke="#334155" strokeWidth="2.5" />
                  <line x1="355" y1="55" x2="355" y2="95" stroke="#334155" strokeWidth="2.5" />
                  <line x1="355" y1="145" x2="355" y2="180" stroke="#334155" strokeWidth="2.5" />

                  {/* R1 */}
                  <rect x="140" y="42" width="80" height="26" rx="4" fill="#fff" stroke="#475569" strokeWidth="2.2" />
                  <text x="180" y="59" textAnchor="middle" className="text-[12px] font-mono font-semibold fill-slate-800">
                    R₁ = {safeR1} Ω
                  </text>

                  {/* R2 */}
                  <rect x="254" y="85" width="32" height="65" rx="4" fill="#fff" stroke="#475569" strokeWidth="2.2" />
                  <text x="270" y="122" textAnchor="middle" className="text-[11px] font-mono font-semibold fill-slate-800">
                    R₂={safeR2}Ω
                  </text>

                  {/* R3 */}
                  <rect x="380" y="42" width="70" height="26" rx="4" fill="#fff" stroke="#475569" strokeWidth="2.2" />
                  <text x="415" y="59" textAnchor="middle" className="text-[12px] font-mono font-semibold fill-slate-800">
                    R₃ = {safeR3} Ω
                  </text>

                  {/* Source 1 (V_s) state depends on stage */}
                  {stage === 'voc' ? (
                    <>
                      <circle cx="80" cy="120" r="24" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
                      <text x="80" y="115" textAnchor="middle" className="text-[14px] font-mono font-bold fill-sky-700">+</text>
                      <text x="80" y="132" textAnchor="middle" className="text-[14px] font-mono font-bold fill-sky-700">−</text>
                      <text x="45" y="124" textAnchor="end" className="text-[12px] font-mono font-bold fill-sky-700">
                        {vSource} V
                      </text>
                    </>
                  ) : (
                    <>
                      <line x1="80" y1="95" x2="80" y2="145" stroke="#dc2626" strokeWidth="4" />
                      <text x="45" y="124" textAnchor="end" className="text-[11px] font-mono font-bold fill-red-600">
                        V_s=0V (Corto)
                      </text>
                    </>
                  )}

                  {/* Source 2 (I_s) state depends on stage */}
                  {stage === 'voc' ? (
                    <>
                      <circle cx="355" cy="120" r="24" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
                      <line x1="355" y1="134" x2="355" y2="108" stroke="#d97706" strokeWidth="2.5" />
                      <polygon points="355,102 350,110 360,110" fill="#d97706" />
                      <text x="355" y="164" textAnchor="middle" className="text-[11px] font-mono font-bold fill-amber-700">
                        I_s = {iSource} A
                      </text>
                    </>
                  ) : (
                    <>
                      <circle cx="355" cy="95" r="4" fill="#fff" stroke="#d97706" strokeWidth="2" />
                      <circle cx="355" cy="145" r="4" fill="#fff" stroke="#d97706" strokeWidth="2" />
                      <text x="355" y="124" textAnchor="middle" className="text-[11px] font-mono font-bold fill-amber-700">
                        I_s=0A (Abierto)
                      </text>
                    </>
                  )}

                  {/* Open Terminals a and b */}
                  <circle cx="495" cy="55" r="5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                  <text x="495" y="42" textAnchor="middle" className="text-[13px] font-mono font-bold fill-slate-900">a</text>
                  <circle cx="495" cy="180" r="5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                  <text x="495" y="198" textAnchor="middle" className="text-[13px] font-mono font-bold fill-slate-900">b</text>

                  {stage === 'voc' ? (
                    <>
                      <text x="515" y="70" className="text-[14px] font-mono font-bold fill-sky-700">+</text>
                      <text x="515" y="116" className="text-[13px] font-mono font-bold fill-sky-700">
                        V_oc = V_Th
                      </text>
                      <text x="515" y="134" className="text-[14px] font-mono font-bold fill-slate-900">
                        {vTh.toFixed(2)} V
                      </text>
                      <text x="515" y="172" className="text-[14px] font-mono font-bold fill-sky-700">−</text>
                    </>
                  ) : (
                    <>
                      <line x1="550" y1="118" x2="508" y2="118" stroke="#059669" strokeWidth="2.5" />
                      <polygon points="502,118 511,113 511,123" fill="#059669" />
                      <text x="520" y="102" className="text-[12px] font-mono font-bold fill-emerald-700">
                        R_eq = R_Th
                      </text>
                      <text x="520" y="140" className="text-[14px] font-mono font-bold fill-slate-900">
                        {rTh.toFixed(2)} Ω
                      </text>
                    </>
                  )}
                </svg>
              </div>
            )}

            {/* Dynamic Table of Load Responses (6 Ω, 16 Ω, 36 Ω + Current Custom R_L) */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-bold text-slate-900 text-sm">
                  Tabla de Respuesta ante Cargas Variables: I_L = V_Th / (R_Th + R_L)
                </h4>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  V_Th = {vTh.toFixed(2)} V · R_Th = {rTh.toFixed(2)} Ω
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-sans">
                      <th className="py-2.5 px-3 font-semibold">Carga Conectada (R_L)</th>
                      <th className="py-2.5 px-3 font-semibold">Resistencia Total (R_Th + R_L)</th>
                      <th className="py-2.5 px-3 font-semibold">Corriente en la Carga (I_L)</th>
                      <th className="py-2.5 px-3 font-semibold">Voltaje Terminal (V_ab)</th>
                      <th className="py-2.5 px-3 font-semibold">Potencia en Carga (P_L)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {Array.from(new Set([...comparisonLoads, safeRL]))
                      .sort((a, b) => a - b)
                      .map((loadVal) => {
                        const isSelected = Math.abs(loadVal - safeRL) < 0.01;
                        const curr = vTh / (rTh + loadVal);
                        const volt = curr * loadVal;
                        const pow = curr * curr * loadVal;
                        return (
                          <tr
                            key={loadVal}
                            onClick={() => setRLoad(loadVal)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-emerald-50/80 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-emerald-700 font-semibold">
                              {loadVal.toFixed(1)} Ω {isSelected ? ' (Activa)' : ''}
                            </td>
                            <td className="py-2.5 px-3">{(rTh + loadVal).toFixed(2)} Ω</td>
                            <td className="py-2.5 px-3 text-sky-700 font-bold">{curr.toFixed(3)} A</td>
                            <td className="py-2.5 px-3">{volt.toFixed(2)} V</td>
                            <td className="py-2.5 px-3 text-amber-700">{pow.toFixed(2)} W</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT ZONE: Free Parameter Controls & Step-by-Step Verification (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Parámetros de la Red y Carga R_L
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
                label="Carga Variable en a–b"
                symbol="R_L"
                value={rLoad}
                min={1}
                max={60}
                step={1}
                unit="Ω"
                onChange={setRLoad}
                accentColor="emerald"
                helperText="Cambia R_L libremente sin tener que recalcular V_Th ni R_Th."
                isPresentationMode={isPresentationMode}
              />
              <ParameterControl
                label="Fuente de Tensión"
                symbol="V_s"
                value={vSource}
                min={-60}
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
                min={-15}
                max={15}
                step={0.5}
                unit="A"
                onChange={setISource}
                accentColor="amber"
                isPresentationMode={isPresentationMode}
              />
              <ParameterControl
                label="Resistor Serie Fuente"
                symbol="R₁"
                value={r1}
                min={1}
                max={30}
                step={1}
                unit="Ω"
                onChange={setR1}
                accentColor="slate"
                isPresentationMode={isPresentationMode}
              />
              <ParameterControl
                label="Resistor en Derivación"
                symbol="R₂"
                value={r2}
                min={1}
                max={30}
                step={1}
                unit="Ω"
                onChange={setR2}
                accentColor="slate"
                isPresentationMode={isPresentationMode}
              />
              <ParameterControl
                label="Resistor de Salida"
                symbol="R₃"
                value={r3}
                min={0}
                max={20}
                step={0.5}
                unit="Ω"
                onChange={setR3}
                accentColor="slate"
                isPresentationMode={isPresentationMode}
              />
            </div>
          </div>

          {/* Mathematical Summary Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 text-sm">
                Cálculo del Equivalente de Thévenin
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Verificado
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono tabular-nums">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-sans font-semibold text-emerald-800">
                  1. Resistencia de Thévenin (R_Th):
                </div>
                <div className="text-slate-700">
                  R_Th = (R₁ ∥ R₂) + R₃
                </div>
                <div className="text-emerald-700 font-bold">
                  R_Th = ({safeR1}·{safeR2})/({safeR1}+{safeR2}) + {safeR3} = {rTh.toFixed(2)} Ω
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-sans font-semibold text-sky-800">
                  2. Tensión de Thévenin (V_Th = V_oc):
                </div>
                <div className="text-slate-700">
                  V_Th = V_s·[R₂/(R₁+R₂)] + I_s·(R₁ ∥ R₂)
                </div>
                <div className="text-sky-700 font-bold">
                  V_Th = {vThFromV.toFixed(2)} V + {vThFromI.toFixed(2)} V = {vTh.toFixed(2)} V
                </div>
              </div>

              <div className="p-3 bg-sky-50/70 rounded-lg border border-sky-200 space-y-1">
                <div className="font-sans font-semibold text-slate-900">
                  3. Corriente en la Carga R_L = {safeRL} Ω:
                </div>
                <div className="text-sky-800 font-bold text-sm">
                  I_L = V_Th / (R_Th + R_L) = {vTh.toFixed(2)} / ({rTh.toFixed(2)} + {safeRL}) = {iLoad.toFixed(3)} A
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
