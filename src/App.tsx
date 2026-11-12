/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LinearityModule } from './components/LinearityModule';
import { SuperpositionModule } from './components/SuperpositionModule';
import { TheveninModule } from './components/TheveninModule';
import { NortonModule } from './components/NortonModule';
import { EvaluationModule } from './components/EvaluationModule';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

type ModuleId = 'linearity' | 'superposition' | 'thevenin' | 'norton' | 'evaluation';

interface ModuleMeta {
  id: ModuleId;
  shortLabel: string;
  fullTitle: string;
  summary: string;
}

const MODULES: ModuleMeta[] = [
  {
    id: 'linearity',
    shortLabel: 'Linealidad',
    fullTitle: '01. Propiedad de Linealidad de un Circuito',
    summary: 'Homogeneidad, aditividad y por qué no se deben superponer potencias',
  },
  {
    id: 'superposition',
    shortLabel: 'Superposición',
    fullTitle: '02. Principio de Superposición',
    summary: 'Regla de apagado de fuentes independientes y suma algebraica',
  },
  {
    id: 'thevenin',
    shortLabel: 'Thévenin',
    fullTitle: '03. Teorema de Thévenin',
    summary: 'Parámetros equivalentes V_Th, R_Th y análisis con carga variable R_L',
  },
  {
    id: 'norton',
    shortLabel: 'Norton',
    fullTitle: '04. Teorema de Norton y Conversión',
    summary: 'Corriente de cortocircuito I_N, R_N y transformación Thévenin ↔ Norton',
  },
  {
    id: 'evaluation',
    shortLabel: 'Evaluación',
    fullTitle: '05. Reto Práctico y Quiz de Clase',
    summary: 'Verificador de ejercicios en vivo y cuestionario conceptual',
  },
];

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('linearity');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [showFormulaSheet, setShowFormulaSheet] = useState<boolean>(false);

  const currentIdx = MODULES.findIndex((m) => m.id === activeModule);
  const prevModule = currentIdx > 0 ? MODULES[currentIdx - 1] : null;
  const nextModule = currentIdx < MODULES.length - 1 ? MODULES[currentIdx + 1] : null;

  return (
    <div className={`min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 ${isPresentationMode ? 'text-lg' : 'text-base'}`}>
      {/* TOP BAR CONTRACT: 1 row, 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 xl:px-10 py-3">
        <div className="w-full flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveModule('linearity');
            }}
            className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Circuitos Eléctricos
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-sm font-medium text-slate-600">
            {MODULES.map((mod) => {
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveModule(mod.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-slate-900 font-semibold border-sky-600'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {mod.shortLabel}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsPresentationMode(!isPresentationMode)}
              className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isPresentationMode
                  ? 'bg-sky-600 text-white hover:bg-sky-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isPresentationMode ? 'Salir de Modo Presentación' : 'Modo Presentación'}
            </button>
          </div>
        </div>
      </header>

      {/* ACADEMIC CONTEXT & INSTRUCTOR BANNER */}
      <section id="top" className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 xl:px-10 py-4">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-semibold text-slate-800">
                Docente: Esteban Briceño Sánchez
              </span>
              <span aria-hidden="true">·</span>
              <span>Facultad de Ingenierías y Arquitectura</span>
              <span aria-hidden="true">·</span>
              <span>Carrera de Redes y Analítica de Datos</span>
            </div>
            <h1 className={`font-display font-bold tracking-tight text-slate-900 ${isPresentationMode ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl lg:text-2xl'}`}>
              Análisis de Redes Lineales entre Dos Terminales: Superposición, Thévenin y Norton
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Mobile module selector for compact screens */}
            <div className="flex md:hidden items-center gap-1 overflow-x-auto w-full pb-1">
              {MODULES.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveModule(mod.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 ${
                    activeModule === mod.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {mod.shortLabel}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowFormulaSheet(!showFormulaSheet)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              {showFormulaSheet ? 'Ocultar Resumen de Fórmulas' : 'Resumen de Fórmulas y Estrategia'}
            </button>
          </div>
        </div>

        {/* Collapsible Formula & Strategy Reference Sheet */}
        {showFormulaSheet && (
          <div className="w-full mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-display font-bold text-slate-900">
                1. Propiedad de Linealidad
              </div>
              <p className="font-mono text-sky-700 font-semibold">
                v = iR ⇒ (ki)R = kv
              </p>
              <p className="font-mono text-sky-700 font-semibold">
                (i₁ + i₂)R = v₁ + v₂
              </p>
              <p className="text-slate-600 pt-1">
                La potencia <span className="font-mono">p = v·i</span> no es lineal: nunca superpongas potencias directamente.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-display font-bold text-slate-900">
                2. Apagado de Fuentes
              </div>
              <p className="font-mono text-slate-800 font-semibold">
                Fuente Tensión → 0 V (Cortocircuito)
              </p>
              <p className="font-mono text-slate-800 font-semibold">
                Fuente Corriente → 0 A (Abierto)
              </p>
              <p className="text-slate-600 pt-1">
                Analiza una fuente activa a la vez y suma algebraicamente las respuestas.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-display font-bold text-slate-900">
                3. Teorema de Thévenin
              </div>
              <p className="font-mono text-emerald-700 font-semibold">
                V_Th = V_oc (Carga desconectada)
              </p>
              <p className="font-mono text-emerald-700 font-semibold">
                I_L = V_Th / (R_Th + R_L)
              </p>
              <p className="text-slate-600 pt-1">
                Reemplaza la red por una fuente de tensión en serie con <span className="font-mono">R_Th</span>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-display font-bold text-slate-900">
                4. Norton y Conversión
              </div>
              <p className="font-mono text-amber-700 font-semibold">
                I_N = I_corto = V_Th / R_Th
              </p>
              <p className="font-mono text-amber-700 font-semibold">
                V_Th = I_N · R_N · (R_N = R_Th)
              </p>
              <p className="text-slate-600 pt-1">
                Verificación en bornes: <span className="font-mono">V_ab = I_N · (R_N ∥ R_L)</span>.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* MAIN INTERACTIVE WORKSPACE - FULL SCREEN WIDTH & FLEXIBLE HEIGHT */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-5 flex flex-col justify-between">
        <div className="w-full">
          {activeModule === 'linearity' && (
            <LinearityModule isPresentationMode={isPresentationMode} />
          )}
          {activeModule === 'superposition' && (
            <SuperpositionModule isPresentationMode={isPresentationMode} />
          )}
          {activeModule === 'thevenin' && (
            <TheveninModule isPresentationMode={isPresentationMode} />
          )}
          {activeModule === 'norton' && (
            <NortonModule isPresentationMode={isPresentationMode} />
          )}
          {activeModule === 'evaluation' && (
            <EvaluationModule isPresentationMode={isPresentationMode} />
          )}
        </div>

        {/* Sequential Module Stepper Footer for Classroom Flow */}
        <div className="w-full mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            {prevModule ? (
              <button
                type="button"
                onClick={() => setActiveModule(prevModule.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="truncate">Anterior: {prevModule.fullTitle}</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400">Inicio del recorrido temático</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Módulo {currentIdx + 1} de {MODULES.length}</span>
            <span aria-hidden="true">·</span>
            <span>Docente: Esteban Briceño Sánchez</span>
          </div>

          <div className="w-full sm:w-auto">
            {nextModule ? (
              <button
                type="button"
                onClick={() => setActiveModule(nextModule.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span className="truncate">Siguiente: {nextModule.fullTitle}</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveModule('linearity')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
              >
                <span>Volver al Primer Módulo</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* QUIET ACADEMIC FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8 xl:px-10 py-3.5 text-xs text-slate-500">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Recurso Didáctico Interactivo de Circuitos Eléctricos · Docente: <strong>Esteban Briceño Sánchez</strong>
          </div>
          <div>
            Facultad de Ingenierías y Arquitectura · Redes y Analítica de Datos
          </div>
        </div>
      </footer>
    </div>
  );
}
