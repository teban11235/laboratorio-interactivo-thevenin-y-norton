import React, { useState } from 'react';
import { ParameterControl } from './ParameterControl';
import { renderSvgMathText } from '../utils/mathFormat';
import { ArrowLeftRight, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';

interface NortonModuleProps {
  isPresentationMode: boolean;
}

type NortonView = 'shortCircuit' | 'transformation';

export const NortonModule: React.FC<NortonModuleProps> = ({ isPresentationMode }) => {
  const [view, setView] = useState<NortonView>('transformation');

  // Freely configurable parameters
  // Initial default: V_Th = 4 V, R_Th = R_N = 4 Ω, I_N = 1 A, R_L = 4 Ω
  const [vTh, setVTh] = useState<number>(4);
  const [rEq, setREq] = useState<number>(4);
  const [rLoad, setRLoad] = useState<number>(4);

  const safeR = Math.max(0.5, rEq);
  const safeRL = Math.max(0.5, rLoad);

  // Derived Norton Short-Circuit Current I_N = V_Th / R_Th
  const iNorton = vTh / safeR;

  // When load R_L is connected to Thévenin (Series Voltage Divider)
  const iLoadThevenin = vTh / (safeR + safeRL);
  const vAbThevenin = iLoadThevenin * safeRL;

  // When load R_L is connected to Norton (Parallel Current Divider)
  const rParallel = (safeR * safeRL) / (safeR + safeRL);
  const vAbNorton = iNorton * rParallel;
  const iLoadNorton = iNorton * (safeR / (safeR + safeRL));
  const iShuntNorton = iNorton - iLoadNorton;

  // Handler when user edits I_N directly: updates V_Th = I_N * R_N automatically
  const handleINortonChange = (newIN: number) => {
    setVTh(Number((newIN * safeR).toFixed(2)));
  };

  const handleReset = () => {
    setVTh(4);
    setREq(4);
    setRLoad(4);
  };

  return (
    <div className="space-y-6">
      {/* Header & View Mode Switch */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Equivalente en Paralelo y Transformación de Fuentes</span>
            <span aria-hidden="true">·</span>
            <span>I<sub>N</sub> = I<sub>corto</sub> y R<sub>N</sub> = R<sub>Th</sub></span>
          </div>
          <h2 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            Teorema de Norton y Relación Thévenin ↔ Norton
          </h2>
          <p className={`text-slate-600 mt-1 w-full ${isPresentationMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
            Cualquier circuito lineal de dos terminales puede reemplazarse por una fuente de corriente{' '}
            <span className="font-mono font-semibold text-amber-700">I<sub>N</sub> = I<sub>corto</sub></span> en paralelo con una resistencia{' '}
            <span className="font-mono font-semibold text-emerald-700">R<sub>N</sub> = R<sub>Th</sub></span>, siendo directamente interconvertible con el modelo de Thévenin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start shrink-0">
          <button
            type="button"
            onClick={() => setView('shortCircuit')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${view === 'shortCircuit'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            1. Corriente de Cortocircuito (I<sub>N</sub>) y R<sub>N</sub>
          </button>
          <button
            type="button"
            onClick={() => setView('transformation')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${view === 'transformation'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            2. Conversión Thévenin ↔ Norton con Carga R<sub>L</sub>
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch">
        {/* LEFT ZONE: Interactive SVG Stage (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-xl' : 'text-base'}`}>
                  {view === 'shortCircuit' ? (
                    <>Determinación de Parámetros: Cortocircuito entre a–b (I<sub>N</sub> = I<sub>corto</sub>) y Equivalente de Norton</>
                  ) : (
                    <>Equivalencia Terminal: Fuente de Tensión en Serie (Thévenin) ↔ Fuente de Corriente en Paralelo (Norton)</>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {view === 'shortCircuit' ? (
                    <>La corriente de Norton I<sub>N</sub> es la corriente que circula al conectar directamente los terminales a y b mediante un cortocircuito.</>
                  ) : (
                    <>Modifica V<sub>Th</sub>, I<sub>N</sub>, R<sub>Th</sub> = R<sub>N</sub> o R<sub>L</sub> en el panel derecho para verificar que V<sub>ab</sub> e I<sub>L</sub> son idénticos en ambos modelos.</>
                  )}
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md tabular-nums">
                I<sub>N</sub> = V<sub>Th</sub> / R<sub>Th</sub> = {iNorton.toFixed(2)} A
              </span>
            </div>

            {view === 'shortCircuit' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Short-circuit measurement at terminals a-b */}
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>a) Medición de Corriente de Cortocircuito</span>
                    <span className="font-mono text-amber-700 tabular-nums">
                      I<sub>N</sub> = I<sub>corto</sub> = {iNorton.toFixed(2)} A
                    </span>
                  </div>
                  <svg viewBox="0 0 385 205" className="w-full h-auto">
                    {/* Two-terminal linear network box */}
                    <rect
                      x="25"
                      y="35"
                      width="175"
                      height="135"
                      rx="8"
                      fill="#f8fafc"
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    <text x="112" y="88" textAnchor="middle" className="text-[12px] font-display font-bold fill-slate-800">
                      Circuito lineal de
                    </text>
                    <text x="112" y="106" textAnchor="middle" className="text-[12px] font-display font-bold fill-slate-800">
                      dos terminales
                    </text>
                    <text x="112" y="128" textAnchor="middle" className="text-[11px] font-mono fill-slate-600">
                      {renderSvgMathText(`(V_oc = ${vTh.toFixed(1)} V, R_eq = ${safeR.toFixed(1)} Ω)`)}
                    </text>

                    {/* Terminal wires to a and b */}
                    <line x1="200" y1="60" x2="255" y2="60" stroke="#334155" strokeWidth="2.5" />
                    <line x1="200" y1="145" x2="255" y2="145" stroke="#334155" strokeWidth="2.5" />

                    {/* Direct Short-Circuit Wire between a and b */}
                    <line x1="255" y1="60" x2="255" y2="145" stroke="#d97706" strokeWidth="3.5" />
                    <path
                      d="M 200 60 L 255 60 L 255 145 L 200 145"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="3"
                      className={iNorton >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                    />

                    {/* Arrow on short-circuit branch */}
                    <polygon points="255,112 249,100 261,100" fill="#b45309" />
                    <text x="270" y="98" className="text-[12px] font-mono font-bold fill-amber-800">
                      {renderSvgMathText('I_corto = I_N')}
                    </text>
                    <text x="270" y="116" className="text-[13px] font-mono font-bold fill-slate-900">
                      {iNorton.toFixed(2)} A
                    </text>

                    {/* Terminals a and b */}
                    <circle cx="255" cy="60" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="255" y="47" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">a</text>
                    <circle cx="255" cy="145" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="255" y="164" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">b</text>
                  </svg>
                </div>

                {/* Right: Resulting Norton Equivalent Circuit */}
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>b) Circuito Equivalente de Norton</span>
                    <span className="font-mono text-emerald-700 tabular-nums">
                      R<sub>N</sub> = R<sub>Th</sub> = {safeR.toFixed(1)} Ω
                    </span>
                  </div>
                  <svg viewBox="0 0 385 205" className="w-full h-auto">
                    {/* Parallel Wires */}
                    <line x1="75" y1="55" x2="270" y2="55" stroke="#334155" strokeWidth="2.5" />
                    <line x1="75" y1="150" x2="270" y2="150" stroke="#334155" strokeWidth="2.5" />

                    {/* Current Source Branch */}
                    <line x1="75" y1="55" x2="75" y2="80" stroke="#334155" strokeWidth="2.5" />
                    <line x1="75" y1="126" x2="75" y2="150" stroke="#334155" strokeWidth="2.5" />
                    <circle cx="75" cy="103" r="23" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
                    <line x1="75" y1="116" x2="75" y2="92" stroke="#d97706" strokeWidth="2.5" />
                    <polygon points="75,85 70,94 80,94" fill="#d97706" />
                    <text x="75" y="172" textAnchor="middle" className="text-[12px] font-mono font-bold fill-amber-800">
                      {renderSvgMathText(`I_N = ${iNorton.toFixed(2)} A`)}
                    </text>

                    {/* Parallel Resistor R_N Branch */}
                    <line x1="175" y1="55" x2="175" y2="75" stroke="#334155" strokeWidth="2.5" />
                    <line x1="175" y1="130" x2="175" y2="150" stroke="#334155" strokeWidth="2.5" />
                    <rect x="159" y="75" width="32" height="55" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <path
                      d="M 175 80 L 167 86 L 183 94 L 167 102 L 183 110 L 167 118 L 175 125"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text x="198" y="100" className="text-[12px] font-mono font-bold fill-emerald-800">
                      {renderSvgMathText(`R_N = ${safeR.toFixed(1)} Ω`)}
                    </text>
                    <text x="198" y="116" className="text-[11px] font-mono fill-slate-500">
                      {renderSvgMathText('(R_N = R_Th)')}
                    </text>

                    {/* Terminals a and b */}
                    <circle cx="270" cy="55" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="284" y="59" className="text-[13px] font-mono font-bold fill-slate-900">a</text>
                    <circle cx="270" cy="150" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="284" y="154" className="text-[13px] font-mono font-bold fill-slate-900">b</text>
                  </svg>
                </div>
              </div>
            ) : (
              /* Side-by-Side Source Transformation Comparison with Load R_L */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Thévenin Equivalent + R_L */}
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Equivalente de Thévenin (Serie)</span>
                    <span className="font-mono text-sky-700 tabular-nums">
                      V<sub>ab</sub> = {vAbThevenin.toFixed(2)} V · I<sub>L</sub> = {iLoadThevenin.toFixed(2)} A
                    </span>
                  </div>
                  <svg viewBox="0 0 385 205" className="w-full h-auto">
                    <path
                      d="M 80 80 L 80 50 L 125 50 M 190 50 L 250 50 M 250 160 L 80 160 L 80 130"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 255 50 L 315 50 L 315 78 M 315 132 L 315 160 L 255 160"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 80 50 L 315 50 L 315 160 L 80 160 Z"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      className={iLoadThevenin >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                      opacity="0.85"
                    />

                    {/* V_Th */}
                    <circle cx="80" cy="105" r="23" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
                    <text x="80" y="100" textAnchor="middle" className="text-[14px] font-mono font-bold fill-sky-700">+</text>
                    <text x="80" y="117" textAnchor="middle" className="text-[14px] font-mono font-bold fill-sky-700">−</text>
                    <text x="115" y="184" textAnchor="middle" className="text-[11px] font-mono font-bold fill-sky-800">
                      {renderSvgMathText(`V_Th = I_N·R_N = ${vTh.toFixed(2)} V`)}
                    </text>

                    {/* R_Th */}
                    <rect x="125" y="37" width="65" height="26" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.2" />
                    <text x="157" y="54" textAnchor="middle" className="text-[11px] font-mono font-bold fill-emerald-800">
                      {renderSvgMathText(`R_Th=${safeR}Ω`)}
                    </text>

                    {/* Terminals a and b */}
                    <circle cx="250" cy="50" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="250" y="38" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">a</text>
                    <circle cx="250" cy="160" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="250" y="178" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">b</text>

                    {/* Load R_L */}
                    <rect x="299" y="78" width="32" height="54" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <text x="315" y="102" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-800">
                      {renderSvgMathText('R_L')}
                    </text>
                    <text x="315" y="116" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-emerald-700">
                      {safeRL}Ω
                    </text>
                  </svg>
                </div>

                {/* Norton Equivalent + R_L */}
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Equivalente de Norton (Paralelo)</span>
                    <span className="font-mono text-amber-700 tabular-nums">
                      V<sub>ab</sub> = {vAbNorton.toFixed(2)} V · I<sub>L</sub> = {iLoadNorton.toFixed(2)} A
                    </span>
                  </div>
                  <svg viewBox="0 0 385 205" className="w-full h-auto">
                    <line x1="80" y1="50" x2="250" y2="50" stroke="#334155" strokeWidth="2.5" />
                    <line x1="80" y1="160" x2="250" y2="160" stroke="#334155" strokeWidth="2.5" />
                    <line x1="80" y1="50" x2="80" y2="82" stroke="#334155" strokeWidth="2.5" />
                    <line x1="80" y1="128" x2="80" y2="160" stroke="#334155" strokeWidth="2.5" />
                    <line x1="165" y1="50" x2="165" y2="78" stroke="#334155" strokeWidth="2.5" />
                    <line x1="165" y1="132" x2="165" y2="160" stroke="#334155" strokeWidth="2.5" />

                    {/* External Load R_L */}
                    <path
                      d="M 255 50 L 315 50 L 315 78 M 315 132 L 315 160 L 255 160"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 80 50 L 315 50 L 315 160 L 80 160 Z"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2.5"
                      className={iLoadNorton >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                      opacity="0.85"
                    />

                    {/* I_N */}
                    <circle cx="80" cy="105" r="23" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
                    <line x1="80" y1="118" x2="80" y2="94" stroke="#d97706" strokeWidth="2.5" />
                    <polygon points="80,87 75,96 85,96" fill="#d97706" />
                    <text x="115" y="184" textAnchor="middle" className="text-[11px] font-mono font-bold fill-amber-800">
                      {renderSvgMathText(`I_N = V_Th/R_Th = ${iNorton.toFixed(2)} A`)}
                    </text>

                    {/* R_N */}
                    <rect x="149" y="78" width="32" height="54" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.2" />
                    <text x="165" y="102" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-800">
                      {renderSvgMathText('R_N')}
                    </text>
                    <text x="165" y="116" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-emerald-700">
                      {safeR}Ω
                    </text>

                    {/* Terminals a and b */}
                    <circle cx="250" cy="50" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="250" y="38" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">a</text>
                    <circle cx="250" cy="160" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                    <text x="250" y="178" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">b</text>

                    {/* Load R_L */}
                    <rect x="299" y="78" width="32" height="54" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <text x="315" y="102" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-800">
                      {renderSvgMathText('R_L')}
                    </text>
                    <text x="315" y="116" textAnchor="middle" className="text-[10px] font-mono font-semibold fill-emerald-700">
                      {safeRL}Ω
                    </text>
                  </svg>
                </div>
              </div>
            )}

            {/* Equations Banner: Relación entre Teoremas de Thévenin y Norton */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs tabular-nums">
                <div className="text-slate-500 font-sans font-medium mb-1">
                  De Thévenin a Norton
                </div>
                <div className="text-base font-bold text-amber-700">
                  I<sub>N</sub> = V<sub>Th</sub> / R<sub>Th</sub> = {iNorton.toFixed(2)} A
                </div>
                <div className="text-slate-600 mt-1">
                  ({vTh.toFixed(2)} V) / ({safeR.toFixed(2)} Ω)
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs tabular-nums">
                <div className="text-slate-500 font-sans font-medium mb-1">
                  De Norton a Thévenin
                </div>
                <div className="text-base font-bold text-sky-700">
                  V<sub>Th</sub> = I<sub>N</sub> · R<sub>N</sub> = {vTh.toFixed(2)} V
                </div>
                <div className="text-slate-600 mt-1">
                  ({iNorton.toFixed(2)} A) · ({safeR.toFixed(2)} Ω)
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs tabular-nums">
                <div className="text-slate-500 font-sans font-medium mb-1">
                  Igualdad de Resistencias
                </div>
                <div className="text-base font-bold text-emerald-700">
                  R<sub>N</sub> = R<sub>Th</sub> = {safeR.toFixed(2)} Ω
                </div>
                <div className="text-slate-600 mt-1">
                  Vista desde a–b con fuentes apagadas
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT ZONE: Bidirectional Source Transformation Controls & Verification (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Convertidor Bidireccional en Vivo
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
                label="Tensión de Thévenin"
                symbol="V_Th"
                value={vTh}
                min={-60}
                max={60}
                step={1}
                unit="V"
                onChange={setVTh}
                accentColor="sky"
                helperText="Al ajustar V_Th se actualiza automáticamente I_N = V_Th / R_Th."
                isPresentationMode={isPresentationMode}
              />

              <ParameterControl
                label="Corriente de Norton"
                symbol="I_N"
                value={Number(iNorton.toFixed(2))}
                min={-20}
                max={20}
                step={0.25}
                unit="A"
                onChange={handleINortonChange}
                accentColor="amber"
                helperText="Al ajustar I_N se actualiza automáticamente V_Th = I_N · R_N."
                isPresentationMode={isPresentationMode}
              />

              <ParameterControl
                label="Resistencia Equivalente"
                symbol="R_Th = R_N"
                value={rEq}
                min={0.5}
                max={40}
                step={0.5}
                unit="Ω"
                onChange={setREq}
                accentColor="emerald"
                isPresentationMode={isPresentationMode}
              />

              <ParameterControl
                label="Carga Conectada en a–b"
                symbol="R_L"
                value={rLoad}
                min={1}
                max={50}
                step={1}
                unit="Ω"
                onChange={setRLoad}
                accentColor="slate"
                isPresentationMode={isPresentationMode}
              />
            </div>
          </div>

          {/* Terminal Verification Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4 text-sky-600" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Verificación de Coherencia en a–b
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Idénticos
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono tabular-nums">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-sans font-semibold text-sky-800">
                  Usando el Equivalente de Thévenin:
                </div>
                <div className="text-slate-700">
                  I<sub>L</sub> = V<sub>Th</sub> / (R<sub>Th</sub> + R<sub>L</sub>) = {vTh.toFixed(2)} / ({safeR.toFixed(2)} + {safeRL.toFixed(2)})
                </div>
                <div className="text-sky-700 font-bold">
                  I<sub>L</sub> = {iLoadThevenin.toFixed(3)} A · V<sub>ab</sub> = {vAbThevenin.toFixed(2)} V
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-sans font-semibold text-amber-800">
                  Usando el Equivalente de Norton:
                </div>
                <div className="text-slate-700">
                  V<sub>ab</sub> = I<sub>N</sub> · (R<sub>N</sub> ∥ R<sub>L</sub>) = {iNorton.toFixed(2)} · ({rParallel.toFixed(2)} Ω)
                </div>
                <div className="text-amber-700 font-bold">
                  I<sub>L</sub> = {iLoadNorton.toFixed(3)} A · V<sub>ab</sub> = {vAbNorton.toFixed(2)} V
                </div>
                <div className="text-slate-500 text-[11px] pt-0.5">
                  Corriente derivada por R<sub>N</sub>: {iShuntNorton.toFixed(3)} A
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
