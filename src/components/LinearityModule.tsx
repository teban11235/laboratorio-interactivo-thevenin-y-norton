import React, { useState } from 'react';
import { ParameterControl } from './ParameterControl';
import { AlertTriangle, CheckCircle2, RotateCcw, Sliders, TrendingUp } from 'lucide-react';

interface LinearityModuleProps {
  isPresentationMode: boolean;
}

export const LinearityModule: React.FC<LinearityModuleProps> = ({ isPresentationMode }) => {
  const [subTab, setSubTab] = useState<'homogeneity' | 'additivity'>('homogeneity');
  const [resistance, setResistance] = useState<number>(4);
  const [i1, setI1] = useState<number>(2);
  const [i2, setI2] = useState<number>(3);
  const [scaleK, setScaleK] = useState<number>(2.5);

  const safeR = Math.max(0.5, resistance);

  // Homogeneity calculations
  const v1 = i1 * safeR;
  const scaledI = scaleK * i1;
  const scaledV = scaledI * safeR; // = scaleK * v1
  const p1 = i1 * i1 * safeR;
  const scaledPActual = scaledI * scaledI * safeR; // = k^2 * p1
  const scaledPLinearWrong = scaleK * p1; // k * p1 (incorrect linear assumption)

  // Additivity calculations
  const v2 = i2 * safeR;
  const iSum = i1 + i2;
  const vSumActual = iSum * safeR;
  const vSumParts = v1 + v2;

  // Power non-linearity in additivity
  const p2 = i2 * i2 * safeR;
  const pSumPartsWrong = p1 + p2; // i1^2 R + i2^2 R
  const pCrossTerm = 2 * i1 * i2 * safeR; // 2 * i1 * i2 * R
  const pTotalActual = iSum * iSum * safeR; // (i1 + i2)^2 R

  const handleReset = () => {
    setResistance(4);
    setI1(2);
    setI2(3);
    setScaleK(2.5);
  };

  return (
    <div className="space-y-6">
      {/* Module Header & Mode Switch */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Fundamentos de Redes Lineales</span>
            <span aria-hidden="true">·</span>
            <span>Ley de Ohm y Potencia</span>
          </div>
          <h2 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            Propiedad de Linealidad de un Circuito
          </h2>
          <p className={`text-slate-600 mt-1 w-full ${isPresentationMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
            Un circuito o elemento es lineal si cumple simultáneamente <strong>homogeneidad (escalamiento)</strong> y{' '}
            <strong>aditividad</strong>. Esto valida el principio de superposición y los teoremas de Thévenin y Norton para tensiones y corrientes, pero no para la potencia.
          </p>
        </div>

        {/* Interactive Sub-Tab Selector */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start shrink-0">
          <button
            type="button"
            onClick={() => setSubTab('homogeneity')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              subTab === 'homogeneity'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            a. Homogeneidad (Escalamiento)
          </button>
          <button
            type="button"
            onClick={() => setSubTab('additivity')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              subTab === 'additivity'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            b. Aditividad y Trampa de Potencia
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch">
        {/* LEFT ZONE: Interactive Visual Stage (8 cols / ~66%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive Circuit Schematic Comparison */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-xl' : 'text-base'}`}>
                  {subTab === 'homogeneity'
                    ? 'Comparación Esquemática: Excitación Base vs. Excitación Escalada por k'
                    : 'Comparación Esquemática: Excitaciones Separadas vs. Suma Simultánea'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ajusta los valores libres en el panel derecho para observar el escalamiento de tensión y corriente en tiempo real.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 tabular-nums shrink-0">
                R = {safeR.toFixed(1)} Ω
              </span>
            </div>

            {subTab === 'homogeneity' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Base Circuit */}
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
                    <span>Estado Base (Excitación i)</span>
                    <span className="font-mono font-semibold text-sky-700 tabular-nums">
                      v = i · R = {v1.toFixed(2)} V
                    </span>
                  </div>
                  <svg viewBox="0 0 320 175" className="w-full h-auto">
                    {/* Wires */}
                    <path
                      d="M 65 45 L 235 45 L 235 65 M 235 115 L 235 140 L 65 140 L 65 115 M 65 65 L 65 45"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                    {/* Animated Current */}
                    <path
                      d="M 65 45 L 235 45 L 235 140 L 65 140 Z"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      className={i1 >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                      opacity="0.75"
                    />
                    {/* Current Source */}
                    <circle cx="65" cy="90" r="24" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                    <line x1="65" y1="104" x2="65" y2="78" stroke="#0284c7" strokeWidth="2.5" />
                    <polygon points="65,72 60,81 70,81" fill="#0284c7" />
                    <text x="28" y="94" textAnchor="end" className="text-[12px] font-mono font-semibold fill-sky-700">
                      {i1.toFixed(1)} A
                    </text>

                    {/* Current Arrow Top */}
                    <polygon points="155,45 145,40 145,50" fill="#d97706" />
                    <text x="150" y="34" textAnchor="middle" className="text-[12px] font-mono font-semibold fill-amber-700">
                      i = {i1.toFixed(1)} A
                    </text>

                    {/* Resistor R */}
                    <rect x="219" y="65" width="32" height="50" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <path
                      d="M 235 68 L 227 74 L 243 82 L 227 90 L 243 98 L 227 106 L 235 112"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text x="259" y="88" className="text-[12px] font-mono font-semibold fill-emerald-800">
                      R = {safeR.toFixed(1)} Ω
                    </text>
                    <text x="259" y="105" className="text-[12px] font-mono font-bold fill-sky-700">
                      v = {v1.toFixed(2)} V
                    </text>
                    <text x="208" y="72" className="text-[13px] font-mono font-bold fill-slate-700">+</text>
                    <text x="208" y="116" className="text-[13px] font-mono font-bold fill-slate-700">−</text>
                  </svg>
                </div>

                {/* Scaled Circuit (k * i) */}
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
                    <span>Estado Escalado (k = {scaleK.toFixed(2)})</span>
                    <span className="font-mono font-semibold text-sky-700 tabular-nums">
                      k·v = (k·i)R = {scaledV.toFixed(2)} V
                    </span>
                  </div>
                  <svg viewBox="0 0 320 175" className="w-full h-auto">
                    <path
                      d="M 65 45 L 235 45 L 235 65 M 235 115 L 235 140 L 65 140 L 65 115 M 65 65 L 65 45"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 65 45 L 235 45 L 235 140 L 65 140 Z"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="3"
                      className={scaledI >= 0 ? 'animate-current-flow' : 'animate-current-flow-reverse'}
                      opacity="0.85"
                    />
                    {/* Scaled Source */}
                    <circle cx="65" cy="90" r="24" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
                    <line x1="65" y1="104" x2="65" y2="78" stroke="#0284c7" strokeWidth="2.5" />
                    <polygon points="65,72 60,81 70,81" fill="#0284c7" />
                    <text x="35" y="88" textAnchor="end" className="text-[11px] font-mono font-semibold fill-sky-700">
                      k·i
                    </text>
                    <text x="35" y="102" textAnchor="end" className="text-[12px] font-mono font-bold fill-sky-800">
                      {scaledI.toFixed(2)} A
                    </text>

                    {/* Current Arrow Top */}
                    <polygon points="155,45 145,40 145,50" fill="#d97706" />
                    <text x="150" y="34" textAnchor="middle" className="text-[12px] font-mono font-semibold fill-amber-700">
                      k·i = {scaledI.toFixed(2)} A
                    </text>

                    {/* Resistor R */}
                    <rect x="219" y="65" width="32" height="50" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <path
                      d="M 235 68 L 227 74 L 243 82 L 227 90 L 243 98 L 227 106 L 235 112"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text x="256" y="88" className="text-[12px] font-mono font-semibold fill-emerald-800">
                      R = {safeR.toFixed(1)} Ω
                    </text>
                    <text x="256" y="105" className="text-[12px] font-mono font-bold fill-sky-700">
                      kv = {scaledV.toFixed(2)} V
                    </text>
                    <text x="208" y="72" className="text-[13px] font-mono font-bold fill-slate-700">+</text>
                    <text x="208" y="116" className="text-[13px] font-mono font-bold fill-slate-700">−</text>
                  </svg>
                </div>
              </div>
            ) : (
              /* Additivity Schematic + Geometric Power Square Proof */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="circuit-grid border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
                    <span>Suma de Excitaciones (i₁ + i₂)</span>
                    <span className="font-mono font-semibold text-sky-700 tabular-nums">
                      v = (i₁ + i₂)R = {vSumActual.toFixed(2)} V
                    </span>
                  </div>
                  <svg viewBox="0 0 320 185" className="w-full h-auto">
                    {/* Parallel current sources feeding R */}
                    <path
                      d="M 55 45 L 240 45 L 240 65 M 240 120 L 240 145 L 55 145 M 55 45 L 55 70 M 55 120 L 55 145 M 120 45 L 120 70 M 120 120 L 120 145"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 120 45 L 240 45 L 240 145 L 120 145"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                      className="animate-current-flow"
                      opacity="0.8"
                    />
                    {/* Source i1 */}
                    <circle cx="55" cy="95" r="22" fill="#ffffff" stroke="#0284c7" strokeWidth="2.2" />
                    <line x1="55" y1="108" x2="55" y2="84" stroke="#0284c7" strokeWidth="2.2" />
                    <polygon points="55,78 50,86 60,86" fill="#0284c7" />
                    <text x="55" y="164" textAnchor="middle" className="text-[11px] font-mono font-semibold fill-sky-700">
                      i₁ = {i1.toFixed(1)} A
                    </text>

                    {/* Source i2 */}
                    <circle cx="120" cy="95" r="22" fill="#ffffff" stroke="#d97706" strokeWidth="2.2" />
                    <line x1="120" y1="108" x2="120" y2="84" stroke="#d97706" strokeWidth="2.2" />
                    <polygon points="120,78 115,86 125,86" fill="#d97706" />
                    <text x="120" y="164" textAnchor="middle" className="text-[11px] font-mono font-semibold fill-amber-700">
                      i₂ = {i2.toFixed(1)} A
                    </text>

                    {/* Combined current label */}
                    <text x="182" y="35" textAnchor="middle" className="text-[11px] font-mono font-bold fill-slate-800">
                      i₁+i₂ = {iSum.toFixed(1)} A
                    </text>

                    {/* Resistor R */}
                    <rect x="224" y="65" width="32" height="55" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                    <path
                      d="M 240 70 L 232 76 L 248 84 L 232 92 L 248 100 L 232 108 L 240 115"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <text x="262" y="88" className="text-[11px] font-mono font-semibold fill-emerald-800">
                      R = {safeR.toFixed(1)} Ω
                    </text>
                    <text x="262" y="106" className="text-[11px] font-mono font-bold fill-sky-700">
                      v = {vSumActual.toFixed(1)} V
                    </text>
                  </svg>
                </div>

                {/* Visual Proof of why Power is NOT Additive: (i1 + i2)^2 R */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                      <span>Demostración Geométrica: P = (i₁ + i₂)² · R</span>
                      <span className="font-mono text-red-600 tabular-nums">
                        P_total ≠ P₁ + P₂
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Al elevar al cuadrado la suma de corrientes aparece el término cruzado{' '}
                      <span className="font-mono font-semibold text-red-700">2·i₁·i₂·R = {pCrossTerm.toFixed(2)} W</span>:
                    </p>
                  </div>

                  {/* Proportional Area Square */}
                  {(() => {
                    const absI1 = Math.max(0.2, Math.abs(i1));
                    const absI2 = Math.max(0.2, Math.abs(i2));
                    const total = absI1 + absI2;
                    const pct1 = Math.round((absI1 / total) * 100);
                    const pct2 = 100 - pct1;
                    return (
                      <div className="w-full h-36 border-2 border-slate-800 rounded-md overflow-hidden flex flex-col font-mono text-xs">
                        <div className="flex w-full" style={{ height: `${pct1}%` }}>
                          <div
                            style={{ width: `${pct1}%` }}
                            className="bg-sky-100 border-r border-b border-slate-400 flex flex-col items-center justify-center p-1 text-sky-900 font-semibold"
                          >
                            <span>P₁ = i₁²R</span>
                            <span className="tabular-nums text-[11px]">{p1.toFixed(1)} W</span>
                          </div>
                          <div
                            style={{ width: `${pct2}%` }}
                            className="bg-red-100/90 border-b border-slate-400 flex flex-col items-center justify-center p-1 text-red-900 font-medium"
                          >
                            <span>i₁·i₂·R</span>
                            <span className="tabular-nums text-[11px]">{(i1 * i2 * safeR).toFixed(1)} W</span>
                          </div>
                        </div>
                        <div className="flex w-full" style={{ height: `${pct2}%` }}>
                          <div
                            style={{ width: `${pct1}%` }}
                            className="bg-red-100/90 border-r border-slate-400 flex flex-col items-center justify-center p-1 text-red-900 font-medium"
                          >
                            <span>i₁·i₂·R</span>
                            <span className="tabular-nums text-[11px]">{(i1 * i2 * safeR).toFixed(1)} W</span>
                          </div>
                          <div
                            style={{ width: `${pct2}%` }}
                            className="bg-amber-100 flex flex-col items-center justify-center p-1 text-amber-900 font-semibold"
                          >
                            <span>P₂ = i₂²R</span>
                            <span className="tabular-nums text-[11px]">{p2.toFixed(1)} W</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Coordinate Graph: Linear V(i) vs Quadratic P(i) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600 shrink-0" />
                <h3 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-xl' : 'text-base'}`}>
                  Curva Lineal de Tensión v(i) = i·R vs. Curva Cuadrática de Potencia p(i) = i²·R
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-sky-700 font-semibold">― Tensión v(i) [Lineal]</span>
                <span className="text-red-600 font-semibold">- - Potencia p(i) [No lineal]</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7">
                <svg viewBox="0 0 400 220" className="w-full h-auto bg-slate-50 rounded-lg border border-slate-200 p-2">
                  {/* Grid Lines */}
                  {[40, 80, 120, 160].map((y) => (
                    <line key={y} x1="45" y1={y} x2="375" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                  ))}
                  {[110, 175, 240, 305, 370].map((x) => (
                    <line key={x} x1={x} y1="20" x2={x} y2="185" stroke="#e2e8f0" strokeWidth="1" />
                  ))}
                  {/* Axes */}
                  <line x1="45" y1="185" x2="380" y2="185" stroke="#475569" strokeWidth="2" />
                  <line x1="45" y1="185" x2="45" y2="20" stroke="#475569" strokeWidth="2" />
                  <text x="375" y="205" textAnchor="end" className="text-[11px] font-mono fill-slate-600">
                    Corriente i (A)
                  </text>
                  <text x="52" y="30" className="text-[11px] font-mono fill-slate-600">
                    Magnitud (V / W)
                  </text>

                  {/* Plot Curves */}
                  {(() => {
                    const maxI = Math.max(6, Math.abs(scaledI) * 1.15, Math.abs(iSum) * 1.15);
                    const maxY = Math.max(40, maxI * maxI * safeR * 1.05, maxI * safeR * 1.2);

                    const toX = (curr: number) => 45 + (Math.max(0, curr) / maxI) * 325;
                    const toY = (val: number) => 185 - Math.min(160, (Math.max(0, val) / maxY) * 160);

                    // Build quadratic path for P(i) = i^2 * R
                    const steps = 32;
                    let powerPath = '';
                    for (let s = 0; s <= steps; s++) {
                      const curr = (s / steps) * maxI;
                      const pVal = curr * curr * safeR;
                      const px = toX(curr);
                      const py = toY(pVal);
                      powerPath += `${s === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
                    }

                    // Linear path for V(i) = i * R
                    const vLineX = toX(maxI);
                    const vLineY = toY(maxI * safeR);

                    const activeCurr = subTab === 'homogeneity' ? Math.abs(scaledI) : Math.abs(iSum);
                    const activeV = activeCurr * safeR;
                    const activeP = activeCurr * activeCurr * safeR;

                    return (
                      <>
                        {/* Linear V(i) line */}
                        <line
                          x1="45"
                          y1="185"
                          x2={vLineX}
                          y2={vLineY}
                          stroke="#0284c7"
                          strokeWidth="2.5"
                        />
                        {/* Quadratic P(i) curve */}
                        <path
                          d={powerPath}
                          fill="none"
                          stroke="#dc2626"
                          strokeWidth="2.5"
                          strokeDasharray="5 4"
                        />

                        {/* Operating Point Markers */}
                        <line
                          x1={toX(activeCurr)}
                          y1="185"
                          x2={toX(activeCurr)}
                          y2={Math.min(toY(activeV), toY(activeP))}
                          stroke="#94a3b8"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <circle cx={toX(activeCurr)} cy={toY(activeV)} r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" />
                        <circle cx={toX(activeCurr)} cy={toY(activeP)} r="5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />

                        <text
                          x={Math.min(340, toX(activeCurr) + 8)}
                          y={Math.max(30, toY(activeV) - 6)}
                          className="text-[11px] font-mono font-bold fill-sky-700"
                        >
                          v = {activeV.toFixed(1)} V
                        </text>
                        <text
                          x={Math.min(340, toX(activeCurr) + 8)}
                          y={Math.max(30, toY(activeP) - 8)}
                          className="text-[11px] font-mono font-bold fill-red-600"
                        >
                          p = {activeP.toFixed(1)} W
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Critical Pedagogical Warning Box */}
              <div className="md:col-span-5 bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-sm">
                      Regla Fundamental: No Superponer Potencias
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      Aunque tensión y corriente obedecen relaciones lineales en resistores ideales, la potencia{' '}
                      <span className="font-mono font-semibold">p = v·i = i²·R</span> es cuadrática. Primero se superponen tensiones o corrientes y al final se calcula la potencia.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-amber-200/80 rounded-lg p-3 font-mono text-xs space-y-1.5 tabular-nums">
                  {subTab === 'homogeneity' ? (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>Escalamiento lineal erróneo (k·P₁):</span>
                        <span className="line-through text-red-600 font-semibold">{scaledPLinearWrong.toFixed(2)} W</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold">
                        <span>Potencia real (k²·P₁):</span>
                        <span className="text-emerald-700">{scaledPActual.toFixed(2)} W</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>Suma directa errónea (P₁ + P₂):</span>
                        <span className="line-through text-red-600 font-semibold">{pSumPartsWrong.toFixed(2)} W</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Término cruzado omitido (2·i₁·i₂·R):</span>
                        <span className="text-amber-700">+{pCrossTerm.toFixed(2)} W</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-100">
                        <span>Potencia real ((i₁+i₂)²·R):</span>
                        <span className="text-emerald-700">{pTotalActual.toFixed(2)} W</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT ZONE: Parameter Controls & Live Equations (4 cols / ~34%) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h3 className="font-display font-bold text-slate-900 text-sm">
                  Parámetros Libres del Circuito
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
                label="Resistencia Ideal"
                symbol="R"
                value={resistance}
                min={0.5}
                max={25}
                step={0.5}
                unit="Ω"
                onChange={setResistance}
                accentColor="emerald"
                isPresentationMode={isPresentationMode}
              />

              <ParameterControl
                label="Corriente de Excitación 1"
                symbol="i₁"
                value={i1}
                min={-10}
                max={10}
                step={0.5}
                unit="A"
                onChange={setI1}
                accentColor="sky"
                isPresentationMode={isPresentationMode}
              />

              {subTab === 'homogeneity' ? (
                <ParameterControl
                  label="Constante de Escalamiento"
                  symbol="k"
                  value={scaleK}
                  min={-4}
                  max={5}
                  step={0.25}
                  unit="×"
                  onChange={setScaleK}
                  accentColor="amber"
                  helperText="Multiplica la entrada por k y verifica que la salida se multiplica por k."
                  isPresentationMode={isPresentationMode}
                />
              ) : (
                <ParameterControl
                  label="Corriente de Excitación 2"
                  symbol="i₂"
                  value={i2}
                  min={-10}
                  max={10}
                  step={0.5}
                  unit="A"
                  onChange={setI2}
                  accentColor="amber"
                  helperText="Segunda excitación independiente aplicada al mismo resistor lineal."
                  isPresentationMode={isPresentationMode}
                />
              )}
            </div>
          </div>

          {/* Mathematical Verification Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-slate-900 text-sm">
                Verificación Matemática Paso a Paso
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                Lineal en v e i
              </span>
            </div>

            {subTab === 'homogeneity' ? (
              <div className="space-y-3 text-xs font-mono tabular-nums">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="text-slate-500 font-sans font-medium">
                    1. Respuesta original por Ley de Ohm:
                  </div>
                  <div className="text-slate-900 font-semibold">
                    v = i₁ · R = ({i1.toFixed(2)} A) · ({safeR.toFixed(2)} Ω) = {v1.toFixed(2)} V
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="text-slate-500 font-sans font-medium">
                    2. Escalamiento de la excitación por k = {scaleK.toFixed(2)}:
                  </div>
                  <div className="text-slate-900 font-semibold">
                    (k · i₁) · R = ({scaledI.toFixed(2)} A) · ({safeR.toFixed(2)} Ω) = {scaledV.toFixed(2)} V
                  </div>
                  <div className="text-sky-700 font-semibold">
                    k · v = {scaleK.toFixed(2)} · ({v1.toFixed(2)} V) = {(scaleK * v1).toFixed(2)} V
                  </div>
                </div>

                <div className="text-slate-600 font-sans text-xs pt-1">
                  Se comprueba formalmente la homogeneidad:{' '}
                  <span className="font-mono font-semibold text-slate-900">
                    v = iR ⇒ (ki)R = kv
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs font-mono tabular-nums">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="text-slate-500 font-sans font-medium">
                    1. Respuestas individuales por separado:
                  </div>
                  <div className="text-sky-700 font-semibold">
                    v₁ = i₁ · R = ({i1.toFixed(2)}) · ({safeR.toFixed(2)}) = {v1.toFixed(2)} V
                  </div>
                  <div className="text-amber-700 font-semibold">
                    v₂ = i₂ · R = ({i2.toFixed(2)}) · ({safeR.toFixed(2)}) = {v2.toFixed(2)} V
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="text-slate-500 font-sans font-medium">
                    2. Respuesta a la suma de excitaciones:
                  </div>
                  <div className="text-slate-900 font-semibold">
                    (i₁ + i₂) · R = ({iSum.toFixed(2)} A) · ({safeR.toFixed(2)} Ω) = {vSumActual.toFixed(2)} V
                  </div>
                  <div className="text-emerald-700 font-semibold">
                    v₁ + v₂ = {v1.toFixed(2)} V + {v2.toFixed(2)} V = {vSumParts.toFixed(2)} V
                  </div>
                </div>

                <div className="text-slate-600 font-sans text-xs pt-1">
                  Se comprueba formalmente la aditividad:{' '}
                  <span className="font-mono font-semibold text-slate-900">
                    (i₁ + i₂)R = v₁ + v₂
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
