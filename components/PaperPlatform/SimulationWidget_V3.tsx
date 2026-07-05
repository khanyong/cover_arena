import React from 'react';

export const SimulationWidget_V3: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl min-h-[350px] text-center font-mono">
      <div className="text-4xl mb-4 animate-bounce">🚧</div>
      <h3 className="text-sm font-bold text-[#ef4444] uppercase tracking-wider mb-2">
        SimulationWidget_V3 (Paper 3 Simulator)
      </h3>
      <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
        <strong>Cosmic Web Filaments & FRB Quakes (Gertsenshtein Effect)</strong>
      </p>
      <p className="text-[10px] text-zinc-500 mt-4 max-w-xs leading-relaxed">
        This computational sandbox is currently under development to prepare the logical validation models for Paper 3. It will be fully implemented in the next phase.
      </p>
      <div className="mt-6 px-3 py-1.5 bg-zinc-950 border border-zinc-850 rounded text-[9px] text-zinc-600">
        Status: Pipeline Drafting
      </div>
    </div>
  );
};
