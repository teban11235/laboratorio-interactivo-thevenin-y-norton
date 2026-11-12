import React, { useState } from 'react';
import { ParameterControl } from './ParameterControl';
import { Award, CheckCircle2, Eye, HelpCircle, RefreshCw, XCircle } from 'lucide-react';

interface EvaluationModuleProps {
  isPresentationMode: boolean;
}

interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Propiedad de Linealidad',
    question:
      '¿Cuáles son las dos propiedades fundamentales que debe cumplir simultáneamente un circuito para considerarse lineal?',
    options: [
      'Homogeneidad (escalamiento) y aditividad',
      'Conservación de carga y proporcionalidad cuadrática',
      'Simetría de terminales y reciprocidad de potencia',
      'Equivalencia en serie y resonancia resistiva',
    ],
    correctIndex: 0,
    explanation:
      'Un circuito es lineal si cumple homogeneidad (si la entrada se multiplica por k, la salida se multiplica por k) y aditividad (la respuesta a la suma de entradas es igual a la suma de las respuestas individuales).',
  },
  {
    id: 2,
    topic: 'No-Linealidad de la Potencia',
    question:
      'Al analizar un circuito con dos fuentes independientes mediante superposición, una fuente produce 4 V y la otra 8 V sobre un resistor de 2 Ω. ¿Cómo se debe determinar la potencia total disipada en dicho resistor?',
    options: [
      'Sumando directamente las potencias parciales: P = (4²/2) + (8²/2) = 40 W',
      'Sumando primero los voltajes (v_o = 4 V + 8 V = 12 V) y luego calculando P = 12² / 2 = 72 W',
      'Multiplicando las potencias individuales: P = (8 W) · (32 W) = 256 W',
      'Promediando las potencias individuales de cada fuente: P = (8 + 32) / 2 = 20 W',
    ],
    correctIndex: 1,
    explanation:
      'La potencia (p = v²/R = i²R) NO es una relación lineal respecto de v o i. Nunca se deben superponer potencias directamente; primero se superponen tensiones o corrientes (12 V) y al final se calcula la potencia (12² / 2 = 72 W).',
  },
  {
    id: 3,
    topic: 'Regla de Apagado de Fuentes',
    question:
      'En el principio de superposición y en el cálculo de R_Th / R_N, ¿qué significa en términos prácticos "apagar" o desactivar las fuentes independientes?',
    options: [
      'Fuente de tensión → circuito abierto; Fuente de corriente → cortocircuito',
      'Fuente de tensión → cortocircuito (0 V); Fuente de corriente → circuito abierto (0 A)',
      'Ambas fuentes se reemplazan por resistores de 1 Ω',
      'Ambas fuentes se desconectan dejando todos los nodos abiertos',
    ],
    correctIndex: 1,
    explanation:
      'Igualar a cero una fuente ideal de tensión (0 V entre sus terminales) equivale a un cortocircuito; igualar a cero una fuente ideal de corriente (0 A de flujo) equivale a un circuito abierto.',
  },
  {
    id: 4,
    topic: 'Teorema de Thévenin',
    question:
      '¿Qué representa físicamente la tensión de Thévenin (V_Th) entre dos terminales de interés a–b?',
    options: [
      'El voltaje medido en la carga cuando R_L es igual a cero',
      'El voltaje en circuito abierto (V_oc) entre los terminales a–b cuando la carga se encuentra desconectada',
      'La suma aritmética de todas las fuentes de tensión de la red sin importar las resistencias',
      'La caída de tensión interna en R_Th cuando circula una corriente de 1 A',
    ],
    correctIndex: 1,
    explanation:
      'La tensión de Thévenin V_Th corresponde exactamente al voltaje en circuito abierto (V_oc) medido entre los terminales a–b con la carga R_L desconectada.',
  },
  {
    id: 5,
    topic: 'Teorema de Norton',
    question:
      '¿Cómo se define la corriente de Norton (I_N) y cómo se relaciona la resistencia de Norton (R_N) con la de Thévenin (R_Th)?',
    options: [
      'I_N es la corriente con carga máxima y R_N = 1 / R_Th',
      'I_N es la corriente de cortocircuito (I_corto) entre los terminales a–b, y R_N = R_Th',
      'I_N es la corriente en circuito abierto y R_N = 2 · R_Th',
      'I_N = V_Th · R_Th y la resistencia R_N se conecta en serie',
    ],
    correctIndex: 1,
    explanation:
      'La corriente de Norton I_N es la corriente que circula al conectar directamente los terminales a–b en cortocircuito (I_N = I_corto = V_Th / R_Th), y la resistencia vista desde los terminales es idéntica: R_N = R_Th.',
  },
  {
    id: 6,
    topic: 'Conversión Thévenin ↔ Norton',
    question:
      'Si un circuito lineal visto desde los terminales a–b tiene un equivalente de Thévenin con V_Th = 30 V y R_Th = 4 Ω, ¿cuál es su equivalente de Norton y qué corriente entrega a una carga R_L = 6 Ω?',
    options: [
      'I_N = 7.5 A en paralelo con R_N = 4 Ω; corriente en la carga I_L = 3 A',
      'I_N = 120 A en serie con R_N = 4 Ω; corriente en la carga I_L = 5 A',
      'I_N = 7.5 A en serie con R_N = 6 Ω; corriente en la carga I_L = 7.5 A',
      'I_N = 5 A en paralelo con R_N = 6 Ω; corriente en la carga I_L = 3 A',
    ],
    correctIndex: 0,
    explanation:
      'Por transformación de fuentes: I_N = V_Th / R_Th = 30 V / 4 Ω = 7.5 A en paralelo con R_N = R_Th = 4 Ω. Al conectar R_L = 6 Ω, la corriente en la carga es I_L = 30 / (4 + 6) = 3 A.',
  },
];

const PRESET_PROBLEMS = [
  { vSource: 36, iSource: 3, r1: 6, r2: 12, rLoad: 6 },
  { vSource: 24, iSource: 4, r1: 4, r2: 12, rLoad: 5 },
  { vSource: 40, iSource: 2, r1: 10, r2: 10, rLoad: 15 },
  { vSource: 18, iSource: 5, r1: 3, r2: 6, rLoad: 8 },
];

export const EvaluationModule: React.FC<EvaluationModuleProps> = ({ isPresentationMode }) => {
  const [mode, setMode] = useState<'challenge' | 'quiz'>('challenge');

  // Challenge state (Configurable / Randomizable problem)
  const [problemIdx, setProblemIdx] = useState<number>(0);
  const [vSource, setVSource] = useState<number>(36);
  const [iSource, setISource] = useState<number>(3);
  const [r1, setR1] = useState<number>(6);
  const [r2, setR2] = useState<number>(12);
  const [rLoad, setRLoad] = useState<number>(6);

  // Student input fields for checking calculation
  const [inputRTh, setInputRTh] = useState<string>('');
  const [inputVTh, setInputVTh] = useState<string>('');
  const [inputIN, setInputIN] = useState<string>('');
  const [inputIL, setInputIL] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Exact target solutions for the current problem
  const safeR1 = Math.max(0.5, r1);
  const safeR2 = Math.max(0.5, r2);
  const safeRL = Math.max(0.5, rLoad);

  const exactRTh = (safeR1 * safeR2) / (safeR1 + safeR2);
  const exactVThFromV = vSource * (safeR2 / (safeR1 + safeR2));
  const exactVThFromI = iSource * exactRTh;
  const exactVTh = exactVThFromV + exactVThFromI;
  const exactIN = exactVTh / exactRTh;
  const exactIL = exactVTh / (exactRTh + safeRL);

  const isClose = (userStr: string, target: number) => {
    const val = parseFloat(userStr);
    if (Number.isNaN(val)) return false;
    return Math.abs(val - target) <= 0.15;
  };

  const handleNewRandomProblem = () => {
    const nextIdx = (problemIdx + 1) % PRESET_PROBLEMS.length;
    const preset = PRESET_PROBLEMS[nextIdx];
    setProblemIdx(nextIdx);
    setVSource(preset.vSource);
    setISource(preset.iSource);
    setR1(preset.r1);
    setR2(preset.r2);
    setRLoad(preset.rLoad);
    setInputRTh('');
    setInputVTh('');
    setInputIN('');
    setInputIL('');
    setChecked(false);
    setShowSolution(false);
  };

  const correctQuizCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-6">
      {/* Header & Mode Switch */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Consolidación Práctica en el Aula</span>
            <span aria-hidden="true">·</span>
            <span>Verificación Paso a Paso y Diagnóstico Conceptual</span>
          </div>
          <h2 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            Reto Práctico de Cálculo y Quiz de Clase
          </h2>
          <p className={`text-slate-600 mt-1 w-full ${isPresentationMode ? 'text-base sm:text-lg' : 'text-sm'}`}>
            Configura un circuito con los valores que desees para resolverlo en la pizarra junto a los estudiantes, o proyecta el cuestionario conceptual para verificar la comprensión del grupo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg self-start shrink-0">
          <button
            type="button"
            onClick={() => setMode('challenge')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'challenge'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Verificador de Ejercicios en Vivo
          </button>
          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'quiz'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Quiz Conceptual ({Object.keys(selectedAnswers).length}/{QUIZ_QUESTIONS.length})
          </button>
        </div>
      </div>

      {mode === 'challenge' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-stretch">
          {/* LEFT ZONE: Problem Schematic & Student Answer Verification (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-xl' : 'text-base'}`}>
                    Circuito Propuesto para Resolver entre los Terminales a–b
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Determina R_Th, V_Th (por superposición), I_N y la corriente en la carga I_L para los valores actuales.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNewRandomProblem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Cargar Nuevo Ejercicio
                </button>
              </div>

              {/* Schematic of the Problem */}
              <div className="circuit-grid border border-slate-200 rounded-lg p-4 mb-6">
                <svg viewBox="0 0 580 205" className="w-full h-auto">
                  <line x1="75" y1="50" x2="140" y2="50" stroke="#334155" strokeWidth="2.5" />
                  <line x1="220" y1="50" x2="415" y2="50" stroke="#334155" strokeWidth="2.5" />
                  <line x1="75" y1="165" x2="415" y2="165" stroke="#334155" strokeWidth="2.5" />

                  <line x1="75" y1="50" x2="75" y2="85" stroke="#334155" strokeWidth="2.5" />
                  <line x1="75" y1="130" x2="75" y2="165" stroke="#334155" strokeWidth="2.5" />
                  <line x1="265" y1="50" x2="265" y2="80" stroke="#334155" strokeWidth="2.5" />
                  <line x1="265" y1="135" x2="265" y2="165" stroke="#334155" strokeWidth="2.5" />
                  <line x1="350" y1="50" x2="350" y2="85" stroke="#334155" strokeWidth="2.5" />
                  <line x1="350" y1="130" x2="350" y2="165" stroke="#334155" strokeWidth="2.5" />

                  {/* V_s */}
                  <circle cx="75" cy="108" r="22" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
                  <text x="75" y="103" textAnchor="middle" className="text-[14px] font-mono font-bold fill-sky-700">+</text>
                  <text x="75" y="120" textAnchor="middle" className="text-[14px] font-mono font-bold fill-sky-700">−</text>
                  <text x="42" y="112" textAnchor="end" className="text-[12px] font-mono font-bold fill-sky-700">
                    V_s = {vSource} V
                  </text>

                  {/* R1 */}
                  <rect x="140" y="37" width="80" height="26" rx="4" fill="#fff" stroke="#475569" strokeWidth="2.2" />
                  <text x="180" y="54" textAnchor="middle" className="text-[12px] font-mono font-semibold fill-slate-800">
                    R₁ = {safeR1} Ω
                  </text>

                  {/* R2 */}
                  <rect x="249" y="80" width="32" height="55" rx="4" fill="#fff" stroke="#475569" strokeWidth="2.2" />
                  <text x="265" y="112" textAnchor="middle" className="text-[11px] font-mono font-semibold fill-slate-800">
                    R₂={safeR2}Ω
                  </text>

                  {/* I_s */}
                  <circle cx="350" cy="108" r="22" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
                  <line x1="350" y1="120" x2="350" y2="96" stroke="#d97706" strokeWidth="2.5" />
                  <polygon points="350,90 345,98 355,98" fill="#d97706" />
                  <text x="350" y="150" textAnchor="middle" className="text-[11px] font-mono font-bold fill-amber-700">
                    I_s = {iSource} A
                  </text>

                  {/* Terminals a and b */}
                  <circle cx="415" cy="50" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                  <text x="415" y="38" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">a</text>
                  <circle cx="415" cy="165" r="4.5" fill="#fff" stroke="#0f172a" strokeWidth="2.5" />
                  <text x="415" y="182" textAnchor="middle" className="text-[12px] font-mono font-bold fill-slate-900">b</text>

                  {/* Load R_L */}
                  <path
                    d="M 420 50 L 490 50 L 490 80 M 490 135 L 490 165 L 420 165"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                  <rect x="474" y="80" width="32" height="55" rx="4" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
                  <text x="516" y="104" className="text-[12px] font-mono font-bold fill-emerald-800">
                    R_L = {safeRL} Ω
                  </text>
                  <text x="516" y="122" className="text-[11px] font-mono fill-slate-600">
                    Hallar I_L
                  </text>
                </svg>
              </div>

              {/* Interactive Answer Verification Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    1. R_Th = R_N (Ω)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ej. 4.0"
                      value={inputRTh}
                      onChange={(e) => setInputRTh(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                    />
                    {checked && (
                      isClose(inputRTh, exactRTh) ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    2. V_Th = V_oc (V)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ej. 36.0"
                      value={inputVTh}
                      onChange={(e) => setInputVTh(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                    />
                    {checked && (
                      isClose(inputVTh, exactVTh) ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    3. I_N = I_corto (A)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ej. 9.0"
                      value={inputIN}
                      onChange={(e) => setInputIN(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                    />
                    {checked && (
                      isClose(inputIN, exactIN) ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    4. Corriente I_L (A)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Ej. 3.6"
                      value={inputIL}
                      onChange={(e) => setInputIL(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 tabular-nums"
                    />
                    {checked && (
                      isClose(inputIL, exactIL) ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setChecked(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Verificar Respuestas
                </button>
                <button
                  type="button"
                  onClick={() => setShowSolution(!showSolution)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showSolution ? 'Ocultar Resolución Paso a Paso' : 'Mostrar Resolución Paso a Paso'}
                </button>
              </div>

              {showSolution && (
                <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs font-mono tabular-nums">
                  <div className="font-sans font-bold text-slate-900 text-sm">
                    Resolución Detallada del Ejercicio Actual:
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold">1. Resistencia de Thévenin y Norton:</span>{' '}
                    Apagando V_s (cortocircuito) e I_s (circuito abierto), R₁ y R₂ quedan en paralelo:{' '}
                    R_Th = R_N = ({safeR1} · {safeR2}) / ({safeR1} + {safeR2}) = <strong>{exactRTh.toFixed(2)} Ω</strong>
                  </div>
                  <div>
                    <span className="text-sky-700 font-bold">2. Voltaje de Thévenin por Superposición:</span>{' '}
                    V_Th^(V) = {vSource} · [{safeR2}/({safeR1}+{safeR2})] = {exactVThFromV.toFixed(2)} V;{' '}
                    V_Th^(I) = {iSource} · ({exactRTh.toFixed(2)}) = {exactVThFromI.toFixed(2)} V ⇒{' '}
                    V_Th = <strong>{exactVTh.toFixed(2)} V</strong>
                  </div>
                  <div>
                    <span className="text-amber-700 font-bold">3. Corriente de Norton:</span>{' '}
                    I_N = V_Th / R_Th = {exactVTh.toFixed(2)} / {exactRTh.toFixed(2)} = <strong>{exactIN.toFixed(2)} A</strong>
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold">4. Corriente en la carga R_L ({safeRL} Ω):</span>{' '}
                    I_L = V_Th / (R_Th + R_L) = {exactVTh.toFixed(2)} / ({exactRTh.toFixed(2)} + {safeRL}) ={' '}
                    <strong>{exactIL.toFixed(3)} A</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT ZONE: Custom Problem Parameter Sliders (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="font-display font-bold text-slate-900 text-sm pb-3 mb-3 border-b border-slate-200">
                Configurar Valores Libres del Ejercicio
              </h3>
              <div className="space-y-1">
                <ParameterControl
                  label="Fuente de Tensión"
                  symbol="V_s"
                  value={vSource}
                  min={6}
                  max={60}
                  step={2}
                  unit="V"
                  onChange={(v) => {
                    setVSource(v);
                    setChecked(false);
                  }}
                  accentColor="sky"
                  isPresentationMode={isPresentationMode}
                />
                <ParameterControl
                  label="Fuente de Corriente"
                  symbol="I_s"
                  value={iSource}
                  min={1}
                  max={15}
                  step={0.5}
                  unit="A"
                  onChange={(v) => {
                    setISource(v);
                    setChecked(false);
                  }}
                  accentColor="amber"
                  isPresentationMode={isPresentationMode}
                />
                <ParameterControl
                  label="Resistor R₁"
                  symbol="R₁"
                  value={r1}
                  min={2}
                  max={24}
                  step={1}
                  unit="Ω"
                  onChange={(v) => {
                    setR1(v);
                    setChecked(false);
                  }}
                  accentColor="slate"
                  isPresentationMode={isPresentationMode}
                />
                <ParameterControl
                  label="Resistor R₂"
                  symbol="R₂"
                  value={r2}
                  min={2}
                  max={24}
                  step={1}
                  unit="Ω"
                  onChange={(v) => {
                    setR2(v);
                    setChecked(false);
                  }}
                  accentColor="slate"
                  isPresentationMode={isPresentationMode}
                />
                <ParameterControl
                  label="Carga R_L"
                  symbol="R_L"
                  value={rLoad}
                  min={1}
                  max={40}
                  step={1}
                  unit="Ω"
                  onChange={(v) => {
                    setRLoad(v);
                    setChecked(false);
                  }}
                  accentColor="emerald"
                  isPresentationMode={isPresentationMode}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* QUIZ VIEW */
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-sky-600" />
              <div>
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Cuestionario de Verificación Conceptual
                </h3>
                <p className="text-xs text-slate-500">
                  Selecciona una respuesta en cada pregunta para verificar y explicar el fundamento teórico en clase.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                Aciertos: {correctQuizCount} / {QUIZ_QUESTIONS.length}
              </span>
              <button
                type="button"
                onClick={() => setSelectedAnswers({})}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Reiniciar Quiz
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {QUIZ_QUESTIONS.map((q) => {
              const userChoice = selectedAnswers[q.id];
              const isAnswered = userChoice !== undefined;
              const isCorrect = userChoice === q.correctIndex;

              return (
                <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-sky-700">{q.topic}</span>
                      <span className="font-mono">Pregunta {q.id}</span>
                    </div>
                    <h4 className={`font-display font-bold text-slate-900 ${isPresentationMode ? 'text-lg' : 'text-sm'}`}>
                      {q.question}
                    </h4>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, idx) => {
                        const isThisSelected = userChoice === idx;
                        const isThisCorrect = idx === q.correctIndex;

                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                        if (isAnswered) {
                          if (isThisCorrect) {
                            btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                          } else if (isThisSelected) {
                            btnStyle = 'bg-red-50 border-red-400 text-red-900';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [q.id]: idx,
                              }))
                            }
                            className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-start justify-between gap-2 cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isThisCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                            {isAnswered && isThisSelected && !isThisCorrect && (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {isAnswered && (
                    <div
                      className={`p-3 rounded-lg border text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-amber-50/70 border-amber-200 text-slate-800'
                      }`}
                    >
                      <div className="font-semibold mb-0.5 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{isCorrect ? '¡Respuesta Correcta!' : 'Fundamento Teórico:'}</span>
                      </div>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
