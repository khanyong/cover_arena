import React, { useState, useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  trail: { x: number; y: number }[];
}

export const SimulationWidget: React.FC = () => {
  const [simMode, setSimMode] = useState<'slit' | 'decoherence' | 'mass'>('slit');
  
  // Physics Parameters
  const [mass, setMass] = useState<number>(1);
  const [slitDist, setSlitDist] = useState<number>(30);
  const [qsAmplitude, setQsAmplitude] = useState<number>(4);
  const [eObs, setEObs] = useState<number>(0); // Chapter 5 perturbation
  
  // Animation state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const screenHitsRef = useRef<number[]>(new Array(100).fill(0));
  const requestRef = useRef<number | null>(null);

  // Restart simulation helper
  const resetSimulation = () => {
    particlesRef.current = [];
    screenHitsRef.current = new Array(100).fill(0);
  };

  useEffect(() => {
    resetSimulation();
  }, [simMode, mass, slitDist, qsAmplitude, eObs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = 600;
    let height = canvas.height = 320;

    const runFrame = () => {
      // 1. Clear background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw background interference topography (Qs Potential Field)
      // Visualizing the valleys and peaks
      const decoherenceFactor = Math.exp(-eObs * 1.5);
      const activeAmplitude = qsAmplitude * (simMode === 'decoherence' ? decoherenceFactor : 1);
      
      const drawTopography = () => {
        ctx.save();
        ctx.globalAlpha = 0.08;
        const slitX = 180;
        for (let x = slitX; x < width - 40; x += 6) {
          const distance = x - slitX;
          for (let y = 10; y < height - 10; y += 8) {
            // Wave intensity approximation: I = cos(d * sin(theta))
            const angle = Math.atan2(y - height / 2, distance);
            const pathDifference = (slitDist * Math.sin(angle));
            const potential = activeAmplitude * Math.cos(0.08 * pathDifference * Math.sqrt(distance));
            
            // Render potential gradient as colored dots/grids
            if (potential > 0) {
              ctx.fillStyle = `rgba(59, 130, 246, ${potential / 6})`; // Blue peak
            } else {
              ctx.fillStyle = `rgba(168, 85, 247, ${Math.abs(potential) / 6})`; // Purple valley
            }
            ctx.fillRect(x, y, 4, 4);
          }
        }
        ctx.restore();
      };

      drawTopography();

      // 3. Draw Slits & Screen
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 4;
      // Slit wall
      ctx.beginPath();
      ctx.moveTo(180, 0);
      ctx.lineTo(180, height / 2 - slitDist / 2 - 10);
      ctx.moveTo(180, height / 2 - slitDist / 2 + 10);
      ctx.lineTo(180, height / 2 + slitDist / 2 - 10);
      ctx.moveTo(180, height / 2 + slitDist / 2 + 10);
      ctx.lineTo(180, height / 2 + 320);
      ctx.stroke();

      // Draw Slit channels
      ctx.fillStyle = '#10b981';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(177, height / 2 - slitDist / 2 - 10, 6, 20);
      ctx.fillRect(177, height / 2 + slitDist / 2 - 10, 6, 20);
      ctx.globalAlpha = 1.0;

      // Detector label for Decoherence mode
      if (simMode === 'decoherence' && eObs > 0) {
        ctx.font = '10px monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`📡 Observation perturb energy (E_obs): ${eObs.toFixed(1)} GeV`, 190, 25);
        // Detector beam overlay
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(180, height / 2, slitDist + 20, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }

      // Detection screen
      ctx.fillStyle = '#1f1f23';
      ctx.fillRect(width - 30, 0, 30, height);
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width - 30, 0);
      ctx.lineTo(width - 30, height);
      ctx.stroke();

      // 4. Update and Draw Particles
      // Emit particle occasionally
      if (Math.random() < 0.25 && particlesRef.current.length < 50) {
        // Slightly random initial Y to represent micro initial condition dispersion
        const initialY = height / 2 + (Math.random() - 0.5) * 12;
        particlesRef.current.push({
          x: 10,
          y: initialY,
          vx: 3.2,
          vy: 0,
          active: true,
          trail: []
        });
      }

      const activeMass = simMode === 'mass' ? mass : 1.0;

      particlesRef.current.forEach((p) => {
        if (!p.active) return;

        // Draw trail
        ctx.beginPath();
        ctx.strokeStyle = simMode === 'mass' && mass > 50 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(59, 130, 246, 0.15)';
        ctx.lineWidth = 1.5;
        p.trail.forEach((t, i) => {
          if (i === 0) ctx.moveTo(t.x, t.y);
          else ctx.lineTo(t.x, t.y);
        });
        ctx.stroke();

        // Save trail
        if (p.trail.length > 25) p.trail.shift();
        p.trail.push({ x: p.x, y: p.y });

        // Physics integration
        p.x += p.vx;
        
        // Before slit: straight trajectory
        if (p.x < 180) {
          // Guide them through either upper slit or lower slit deterministically
          if (p.x > 150) {
            const targetSlitY = p.y < height / 2 
              ? height / 2 - slitDist / 2 
              : height / 2 + slitDist / 2;
            p.y += (targetSlitY - p.y) * 0.12; // bend into the slits
          }
        } else {
          // After slit: deflected by spatial vibration force gradient
          const distance = p.x - 180;
          const angle = Math.atan2(p.y - height / 2, distance);
          const pathDifference = (slitDist * Math.sin(angle));
          
          // F_space acceleration formula: a = -grad(Qs) / mass
          // Approximated spatial vibration steering field:
          const frequency = 0.08 * Math.sqrt(distance || 1);
          const forceGradient = -activeAmplitude * Math.sin(frequency * pathDifference) * Math.cos(angle) * 0.12;
          
          const acceleration = forceGradient / activeMass;
          p.vy += acceleration;
          // Apply speed limit
          if (p.vy > 2.5) p.vy = 2.5;
          if (p.vy < -2.5) p.vy = -2.5;

          p.y += p.vy;
        }

        // Render particle
        ctx.fillStyle = simMode === 'mass' && mass > 50 ? '#eab308' : '#60a5fa';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Collision with screen
        if (p.x >= width - 30) {
          p.active = false;
          // Map Y coordinate to bin
          const binIndex = Math.floor((p.y / height) * 100);
          if (binIndex >= 0 && binIndex < 100) {
            screenHitsRef.current[binIndex]++;
          }
        }
      });

      // Filter out dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.active || p.trail.length > 0);

      // 5. Draw Accumulated Hits on Screen (Histograms / Wave Pattern)
      ctx.fillStyle = '#60a5fa';
      ctx.globalAlpha = 0.8;
      const binWidth = height / 100;
      let maxHits = Math.max(...screenHitsRef.current, 1);

      screenHitsRef.current.forEach((hits, idx) => {
        if (hits === 0) return;
        const barWidth = (hits / maxHits) * 26; // max 26px
        const y = idx * binWidth;
        
        ctx.fillStyle = simMode === 'mass' && mass > 50 ? '#eab308' : '#3b82f6';
        ctx.fillRect(width - 30, y, barWidth, binWidth - 0.5);
      });
      ctx.globalAlpha = 1.0;

      // Draw Info Overlays
      ctx.font = '11px monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(`Active Mode: ${simMode.toUpperCase()}`, 15, 20);
      
      if (simMode === 'mass') {
        ctx.fillText(`Mass (m): ${mass} a.u.`, 15, 35);
        ctx.fillText(`Decel force: ${(1 / mass).toFixed(3)}x`, 15, 50);
        if (mass > 50) {
          ctx.fillStyle = '#eab308';
          ctx.fillText(`⚠️ Newtonian Limit Reached (F_space ≈ 0)`, 15, 65);
        }
      } else if (simMode === 'slit') {
        ctx.fillText(`Slit spacing: ${slitDist}px`, 15, 35);
        ctx.fillText(`Potential amp (Qs): ${qsAmplitude}`, 15, 50);
      } else {
        ctx.fillText(`Decoherence factor: ${decoherenceFactor.toFixed(3)}`, 15, 35);
      }

      requestRef.current = requestAnimationFrame(runFrame);
    };

    requestRef.current = requestAnimationFrame(runFrame);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [simMode, mass, slitDist, qsAmplitude, eObs]);

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-6 my-6 shadow-xl">
      {/* Simulation Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h3 className="text-md font-bold text-zinc-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            공간 역학 동역학적 시뮬레이터 (Decisive Physics Sandbox)
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            제1부 4장~6장에 가정한 공간 진동에 기반한 결정론적 궤적 및 물리적 수렴성을 실시간으로 확인합니다.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-lg self-start">
          <button
            onClick={() => setSimMode('slit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              simMode === 'slit' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            4장. 이중 슬릿 궤적
          </button>
          <button
            onClick={() => setSimMode('decoherence')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              simMode === 'decoherence' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            5장. 관측과 결맞음 붕괴
          </button>
          <button
            onClick={() => setSimMode('mass')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              simMode === 'mass' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            6장. 거시 질량 극한 수렴
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-2 bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 p-2 flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full max-w-[600px] h-auto rounded-lg shadow-inner" />
        </div>

        {/* Sliders / Control Panel */}
        <div className="flex flex-col justify-between space-y-4 bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-xl">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">매개변수 미세 조정 (Acoustic Knobs)</h4>

            {simMode === 'slit' && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>슬릿 간격 (Slit Spacing)</span>
                    <span className="text-blue-400 font-mono">{slitDist}px</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    value={slitDist}
                    onChange={(e) => setSlitDist(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>공간 진동 강도 ($Q_s$)</span>
                    <span className="text-blue-400 font-mono">{qsAmplitude}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={qsAmplitude}
                    onChange={(e) => setQsAmplitude(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </>
            )}

            {simMode === 'decoherence' && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>{"관측 타격 에너지 ($E_{obs}$)"}</span>
                    <span className="text-red-400 font-mono">{eObs === 0 ? '0 (무관측)' : `${eObs.toFixed(1)} GeV`}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={eObs}
                    onChange={(e) => setEObs(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
                <div className="p-3 bg-red-950/20 border border-red-900/35 rounded-lg text-[11px] text-red-300 leading-relaxed">
                  <strong>물리적 원리:</strong> {"관측 검출 에너지가 방출될 때 미시 공간의 탄성 복원파가 지수적으로 감쇄합니다 ($e^{-\\gamma(E) t}$). 감쇠에 의해 파동 곡률 등고선이 소멸하고 입자는 직선 관성 궤적으로 수렴하게 됩니다."}
                </div>
              </>
            )}

            {simMode === 'mass' && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>입자 질량 ($m$)</span>
                    <span className="text-amber-400 font-mono">{mass === 1 ? '1.0 (미시 양자)' : `${mass} (거시 질량)`}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={mass}
                    onChange={(e) => setMass(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
                
                {/* Asymptotic SVG graph */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                  <div className="text-[10px] text-zinc-400 mb-2 font-mono text-center">
                    {"공간 유도 가속도 수렴성: $\\lim_{m \\to \\infty} \\frac{\\nabla Q_s}{m} = 0$"}
                  </div>
                  <div className="h-16 flex items-end justify-center relative">
                    <svg className="w-full h-full text-zinc-700" viewBox="0 0 100 40">
                      {/* Asymptotic Curve */}
                      <path
                        d="M 10 5 Q 30 35 90 38"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="1.5"
                        strokeDasharray={mass > 50 ? 'none' : '2'}
                      />
                      {/* Active line indicator */}
                      <line 
                        x1={10 + (mass / 100) * 80} 
                        y1="5" 
                        x2={10 + (mass / 100) * 80} 
                        y2="38" 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth="1"
                      />
                      <circle 
                        cx={10 + (mass / 100) * 80} 
                        cy={35 - (mass / 100) * 30} 
                        r="3" 
                        fill="#eab308" 
                      />
                    </svg>
                    <span className="absolute bottom-1 right-2 text-[9px] text-zinc-500">m → ∞</span>
                    <span className="absolute top-1 left-2 text-[9px] text-zinc-500">Acceleration</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex justify-between items-center">
            <button
              onClick={resetSimulation}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              🔄 데이터 초기화
            </button>
            <span className="text-[10px] text-zinc-550 font-mono">Status: CALIBRATING...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
