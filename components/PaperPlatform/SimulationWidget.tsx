import React, { useState, useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  trail: { x: number; y: number }[];
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  u: number; // profile parameter
}

interface Polygon {
  pts: { px: number; py: number }[];
  avgZ: number;
  uVal: number;
}

export const SimulationWidget: React.FC = () => {
  const [simMode, setSimMode] = useState<'slit' | 'decoherence' | 'mass' | 'omega'>('slit');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Physics Parameters
  const [mass, setMass] = useState<number>(1);
  const [slitDist, setSlitDist] = useState<number>(30);
  const [qsAmplitude, setQsAmplitude] = useState<number>(4);
  const [eObs, setEObs] = useState<number>(0);

  // V8 Custom Parameters
  const [tVac, setTVac] = useState<number>(1.5);
  const [gammaViscosity, setGammaViscosity] = useState<number>(0.0);
  const hHistoryRef = useRef<number[]>([]);
  const frameCountRef = useRef<number>(0);

  // 3D Omega Tube Parameters
  const [pinchStrength, setPinchStrength] = useState<number>(1.8);
  const [junctionHeight, setJunctionHeight] = useState<number>(4.5);
  const [isDecohering, setIsDecohering] = useState<boolean>(false);
  const [decohereProgress, setDecohereProgress] = useState<number>(0);

  // 3D View Angles
  const [angleX, setAngleX] = useState<number>(15 * Math.PI / 180);
  const [angleY, setAngleY] = useState<number>(60 * Math.PI / 180);
  const isDragging = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const screenHitsRef = useRef<number[]>(new Array(100).fill(0));
  const deadTrailsRef = useRef<{ x: number, y: number }[][]>([]);
  const requestRef = useRef<number | null>(null);

  const resetSimulation = () => {
    particlesRef.current = [];
    screenHitsRef.current = new Array(100).fill(0);
    deadTrailsRef.current = [];
    setIsDecohering(false);
    setDecohereProgress(0);
    hHistoryRef.current = [];
    frameCountRef.current = 0;
  };

  useEffect(() => {
    resetSimulation();
  }, [simMode, mass, slitDist, qsAmplitude, eObs, tVac, gammaViscosity]);

  useEffect(() => {
    if (!isDecohering) return;
    let timer: number;
    const updateProgress = () => {
      setDecohereProgress(prev => {
        if (prev >= 1.0) {
          cancelAnimationFrame(timer);
          return 1.0;
        }
        timer = requestAnimationFrame(updateProgress);
        return prev + 0.015;
      });
    };
    timer = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(timer);
  }, [isDecohering]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = isExpanded ? 1000 : 600;
    let height = canvas.height = isExpanded ? 650 : 420;

    const runFrame = () => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      if (simMode !== 'omega') {
        frameCountRef.current += 1;
        
        // V8 Hamiltonian calculation (Exponential decay via Gamma)
        const activeGamma = gammaViscosity;
        const decayTime = frameCountRef.current;
        const energyVal = 20 + 60 * Math.exp(-activeGamma * 0.012 * decayTime) + Math.sin(decayTime * 0.1) * 1.5;
        
        hHistoryRef.current.push(energyVal);
        if (hHistoryRef.current.length > 100) hHistoryRef.current.shift();

        // 진폭(R)은 평탄화되지 않고 원래 지형을 유지함 (Decoherence factor 삭제)
        const activeAmplitude = qsAmplitude;

        // V8 Phase Turbulence Vector Field
        const drawPhaseTurbulenceField = () => {
          ctx.save();
          ctx.strokeStyle = simMode === 'decoherence' && eObs > 0 ? 'rgba(239, 68, 68, 0.07)' : 'rgba(96, 165, 250, 0.07)';
          ctx.lineWidth = 1;
          const slitX = 180;
          
          for (let x = slitX + 20; x < width - 40; x += 35) {
            const distance = x - slitX;
            for (let y = 15; y < height - 15; y += 35) {
              const angle = Math.atan2(y - height / 2, distance);
              let flowAngle = angle;
              if (simMode === 'decoherence' && eObs > 0) {
                // Phase noise turbulence injection
                const noise = Math.sin(x * 0.06 + y * 0.06 + frameCountRef.current * 0.12) * eObs * 0.7;
                flowAngle += noise;
              }
              const arrowLength = 10;
              const ax = x + Math.cos(flowAngle) * arrowLength;
              const ay = y + Math.sin(flowAngle) * arrowLength;
              ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ax, ay); ctx.stroke();
              ctx.fillStyle = simMode === 'decoherence' && eObs > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(96, 165, 250, 0.2)';
              ctx.beginPath(); ctx.arc(ax, ay, 1.2, 0, 2 * Math.PI); ctx.fill();
            }
          }
          ctx.restore();
        };

        const drawTopography = () => {
          ctx.save();
          ctx.globalAlpha = 0.08;
          const slitX = 180;
          for (let x = slitX; x < width - 40; x += 6) {
            const distance = x - slitX;
            for (let y = 10; y < height - 10; y += 8) {
              const angle = Math.atan2(y - height / 2, distance);
              const pathDifference = (slitDist * Math.sin(angle));
              let potential = activeAmplitude * Math.cos(0.08 * pathDifference * Math.sqrt(distance));
              
              // [V8 보완] 진폭(R) 평탄화 로직 삭제: 관측이 진폭을 뭉개는 물리적 모순 해결
              
              if (potential > 0) {
                const r = simMode === 'mass' && mass > 50 ? 100 : 59;
                const g = simMode === 'mass' && mass > 50 ? 100 : 130;
                const b = simMode === 'mass' && mass > 50 ? 100 : 246;
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${potential / 6})`;
              } else {
                const r = simMode === 'mass' && mass > 50 ? 80 : 168;
                const g = simMode === 'mass' && mass > 50 ? 80 : 85;
                const b = simMode === 'mass' && mass > 50 ? 80 : 247;
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.abs(potential) / 6})`;
              }
              ctx.fillRect(x, y, 4, 4);
            }
          }
          ctx.restore();
        };

        drawPhaseTurbulenceField();
        drawTopography();

        // Draw Slits
        ctx.strokeStyle = '#27272a'; ctx.lineWidth = 4; ctx.beginPath();
        ctx.moveTo(180, 0); ctx.lineTo(180, height / 2 - slitDist / 2 - 10);
        ctx.moveTo(180, height / 2 - slitDist / 2 + 10); ctx.lineTo(180, height / 2 + slitDist / 2 - 10);
        ctx.moveTo(180, height / 2 + slitDist / 2 + 10); ctx.lineTo(180, height / 2 + 320); ctx.stroke();
        ctx.fillStyle = '#10b981'; ctx.globalAlpha = 0.6; ctx.fillRect(177, height / 2 - slitDist / 2 - 10, 6, 20); ctx.fillRect(177, height / 2 + slitDist / 2 - 10, 6, 20); ctx.globalAlpha = 1.0;

        if (simMode === 'decoherence' && eObs > 0) {
          ctx.font = '10px monospace'; ctx.fillStyle = '#ef4444';
          ctx.fillText(`📡 Phase Turbulence (E_obs): ${eObs.toFixed(1)} GeV`, 190, 25);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(180, height / 2, slitDist + 20, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        }

        // Detection screen
        ctx.fillStyle = '#1f1f23'; ctx.fillRect(width - 30, 0, 30, height);
        ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(width - 30, 0); ctx.lineTo(width - 30, height); ctx.stroke();

        // Emit particle (Deterministic pseudo-random)
        if (frameCountRef.current % 4 === 0 && particlesRef.current.length < 50) {
          const pseudoRandom = Math.sin(frameCountRef.current * 13.5) * 6;
          particlesRef.current.push({ x: 10, y: height / 2 + pseudoRandom, vx: 3.2, vy: 0, active: true, trail: [] });
        }

        // Draw accumulated dead trails (Additive Blending)
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 1.0;
        deadTrailsRef.current.forEach(trail => {
          ctx.strokeStyle = simMode === 'mass' && mass > 50 ? 'rgba(234, 179, 8, 0.06)' : 'rgba(59, 130, 246, 0.06)';
          ctx.beginPath(); trail.forEach((t, i) => i === 0 ? ctx.moveTo(t.x, t.y) : ctx.lineTo(t.x, t.y)); ctx.stroke();
        });
        ctx.restore();

        const activeMass = simMode === 'mass' ? mass : 1.0;

        particlesRef.current.forEach((p) => {
          if (!p.active) return;

          ctx.beginPath(); ctx.strokeStyle = simMode === 'mass' && mass > 50 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(59, 130, 246, 0.15)';
          ctx.lineWidth = 1.5; p.trail.forEach((t, i) => { i === 0 ? ctx.moveTo(t.x, t.y) : ctx.lineTo(t.x, t.y); }); ctx.stroke();
          if (p.trail.length > 25) p.trail.shift(); p.trail.push({ x: p.x, y: p.y });

          p.x += p.vx;
          
          if (p.x < 180) {
            if (p.x > 150) {
              const targetSlitY = p.y < height / 2 ? height / 2 - slitDist / 2 : height / 2 + slitDist / 2;
              p.y += (targetSlitY - p.y) * 0.12;
            }
          } else {
            const distance = p.x - 180;
            const angle = Math.atan2(p.y - height / 2, distance);
            const pathDifference = (slitDist * Math.sin(angle));
            
            const frequency = 0.08 * Math.sqrt(distance || 1);
            let forceGradient = -activeAmplitude * Math.sin(frequency * pathDifference) * Math.cos(angle) * 0.12;
            
            // [V8 보강] 위상(속도장)에 직접 난류 노이즈 주입 (진폭은 그대로 둠)
            if (simMode === 'decoherence' && eObs > 0) {
              const noiseFreq = tVac * 0.2;
              const phaseTurbulence = Math.sin(p.x * 0.05 + frameCountRef.current * noiseFreq) * Math.cos(p.y * 0.05 - frameCountRef.current * noiseFreq * 0.5);
              forceGradient += phaseTurbulence * eObs * 1.5;
            }

            let acceleration = forceGradient / activeMass;
            
            // [V8 보강] 코스틴(Kostin) 게이지 점성에 의한 실제 물리적 항력 (-gamma * m * v) 적용
            if (simMode === 'mass' && gammaViscosity > 0) {
              acceleration -= (gammaViscosity * 0.08) * p.vy;
            }

            p.vy += acceleration;
            if (p.vy > 2.5) p.vy = 2.5; if (p.vy < -2.5) p.vy = -2.5;
            p.y += p.vy;
          }

          ctx.fillStyle = simMode === 'mass' && mass > 50 ? '#eab308' : '#60a5fa'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 4;
          ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

          if (p.x >= width - 30) {
            p.active = false; deadTrailsRef.current.push([...p.trail, { x: p.x, y: p.y }]); 
            if (deadTrailsRef.current.length > 300) deadTrailsRef.current.shift(); 
            const binIndex = Math.floor((p.y / height) * 100);
            if (binIndex >= 0 && binIndex < 100) screenHitsRef.current[binIndex]++;
          }
        });

        particlesRef.current = particlesRef.current.filter((p) => p.active || p.trail.length > 0);

        // Screen hits histogram
        ctx.fillStyle = '#60a5fa'; ctx.globalAlpha = 0.8; const binWidth = height / 100;
        let maxHits = Math.max(...screenHitsRef.current, 1);
        screenHitsRef.current.forEach((hits, idx) => {
          if (hits === 0) return;
          const barWidth = (hits / maxHits) * 26; const y = idx * binWidth;
          ctx.fillStyle = simMode === 'mass' && mass > 50 ? '#eab308' : '#3b82f6';
          ctx.fillRect(width - 30, y, barWidth, binWidth - 0.5);
        });
        ctx.globalAlpha = 1.0;

        ctx.font = '11px monospace'; ctx.fillStyle = '#a1a1aa'; ctx.fillText(`Active Mode: ${simMode.toUpperCase()}`, 15, 20);

        // ==========================================
        // V8 Scientific Visualization Panels
        // ==========================================
        const px = 15, py = 75, pw = 155, ph = 110;

        if (simMode === 'slit') {
          // A. Nodal Singularity Exact Cancellation Plot (V8)
          ctx.save(); ctx.fillStyle = 'rgba(9, 9, 11, 0.9)'; ctx.strokeStyle = '#27272a'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.fill(); ctx.stroke();
          ctx.font = 'bold 8.5px monospace'; ctx.fillStyle = '#fbbf24'; ctx.fillText("Exact Cancellation (Eq. 4)", px + 8, py + 15);

          const midY = py + 60;
          ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(px + 15, midY); ctx.lineTo(px + 145, midY); ctx.stroke();

          // Qs (blue) - 인력 우물 (-1/r^2 발산)
          ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.2; ctx.beginPath();
          for (let r = 1; r <= 120; r++) {
            const rx = px + 15 + r; const rScaled = r * 0.05 + 0.2;
            const qsVal = -2.5 / (rScaled * rScaled); 
            const ry = Math.max(py + 25, Math.min(midY - qsVal, py + 105));
            r === 1 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
          } ctx.stroke();

          // Vc (red) - 원심력 척력 (+1/r^2 발산)
          ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1.2; ctx.beginPath();
          for (let r = 1; r <= 120; r++) {
            const rx = px + 15 + r; const rScaled = r * 0.05 + 0.2;
            const vcVal = 2.5 / (rScaled * rScaled); 
            const ry = Math.max(py + 25, Math.min(midY - vcVal, py + 105));
            r === 1 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
          } ctx.stroke();

          // E_tot (green) - 기적적 상쇄 (0으로 유지)
          ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5; ctx.beginPath();
          ctx.moveTo(px + 15, midY); ctx.lineTo(px + 145, midY); ctx.stroke();

          ctx.font = '7.5px monospace';
          ctx.fillStyle = '#ef4444'; ctx.fillText("+ Centrifugal Repulsion", px + 25, py + 36);
          ctx.fillStyle = '#3b82f6'; ctx.fillText("- Qs Attractive Well", px + 25, py + 90);
          ctx.fillStyle = '#10b981'; ctx.fillText("E_tot = 0 (Regularized)", px + 25, py + 55);
          ctx.restore();

        } else if (simMode === 'mass') {
          // B. Gauge Invariance & Hamiltonian Dissipation Plot
          ctx.save(); ctx.fillStyle = 'rgba(9, 9, 11, 0.9)'; ctx.strokeStyle = '#27272a'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.fill(); ctx.stroke();
          ctx.font = 'bold 8.5px monospace'; ctx.fillStyle = '#fbbf24'; ctx.fillText("Gauge Dissipation (Eq. 3 & 5)", px + 8, py + 15);

          // 확률 밀도 보존 바 (Unitarity Preserved)
          ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5; ctx.setLineDash([2,2]);
          ctx.beginPath(); ctx.moveTo(px + 15, py + 40); ctx.lineTo(px + 145, py + 40); ctx.stroke(); ctx.setLineDash([]);
          ctx.font = '7.5px monospace'; ctx.fillStyle = '#3b82f6'; ctx.fillText(`∫ρ dv = 1 (Unitarity Preserved)`, px + 15, py + 35);

          // 에너지 감쇠 선
          ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(px + 15, py + 95); ctx.lineTo(px + 145, py + 95); ctx.stroke();
          if (hHistoryRef.current.length > 1) {
            ctx.strokeStyle = activeGamma > 0 ? '#f59e0b' : '#10b981'; ctx.lineWidth = 1.5; ctx.beginPath();
            hHistoryRef.current.forEach((val, idx) => {
              const rx = px + 15 + (idx / 100) * 128; const ry = py + 95 - (val / 100) * 45;
              idx === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
            }); ctx.stroke();
          }
          ctx.fillStyle = '#10b981'; ctx.fillText(`H(t) Energy: ${energyVal.toFixed(1)} MeV`, px + 15, py + 88);
          ctx.restore();

        } else if (simMode === 'decoherence') {
          // C. Density Matrix & Scaling Law Dashboard
          ctx.save(); ctx.fillStyle = 'rgba(9, 9, 11, 0.9)'; ctx.strokeStyle = '#27272a'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.roundRect(px, py, 160, 180, 6); ctx.fill(); ctx.stroke();
          ctx.font = 'bold 8.5px monospace'; ctx.fillStyle = '#fbbf24'; ctx.fillText("Reduced Density Matrix ρ_sys", px + 8, py + 15);

          // [V8 보강] T_vac^2 에 비례하여 결어긋남 가속화
          const r11 = 0.5, r22 = 0.5;
          const coherenceDecay = eObs > 0 ? Math.exp(-eObs * (tVac * tVac * 0.3)) : 1.0;
          const r12 = 0.5 * coherenceDecay; const r21 = r12;

          const drawMat = (mx:number, my:number, label:string, val:number, isCoh:boolean) => {
            ctx.fillStyle = isCoh ? `rgba(239, 68, 68, ${val * 1.6})` : `rgba(59, 130, 246, 0.8)`;
            ctx.beginPath(); ctx.rect(mx, my, 35, 18); ctx.fill(); ctx.stroke();
            ctx.fillStyle = val < 0.1 ? '#71717a' : '#f8fafc';
            ctx.font = '8px monospace'; ctx.textAlign = 'center'; ctx.fillText(val.toFixed(2), mx + 17.5, my + 12);
            ctx.font = '6.5px monospace'; ctx.fillStyle = '#a1a1aa'; ctx.fillText(label, mx + 17.5, my - 3);
          };
          drawMat(px + 12, py + 32, "ρ11", r11, false); drawMat(px + 82, py + 32, "ρ12(Coh)", r12, true);
          drawMat(px + 12, py + 68, "ρ21(Coh)", r21, true); drawMat(px + 82, py + 68, "ρ22", r22, false);

          ctx.textAlign = 'left'; ctx.fillStyle = '#fbbf24'; ctx.fillText("Scaling Law (Eq. 6): τ ∝ T_vac^-2", px + 8, py + 104);
          ctx.strokeStyle = '#3f3f46'; ctx.beginPath(); ctx.moveTo(px + 15, py + 170); ctx.lineTo(px + 145, py + 170); ctx.stroke();
          ctx.strokeStyle = '#a855f7'; ctx.beginPath();
          for (let T = 1.0; T <= 3.0; T += 0.1) {
            const rx = px + 15 + ((T - 1.0) / 2.0) * 125; const tau = 45 / (T * T);
            T === 1.0 ? ctx.moveTo(rx, py + 170 - tau) : ctx.lineTo(rx, py + 170 - tau);
          } ctx.stroke();
          const curTau = 45 / (tVac * tVac); const cxPt = px + 15 + ((tVac - 1.0) / 2.0) * 125;
          ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(cxPt, py + 170 - curTau, 3.5, 0, 2 * Math.PI); ctx.fill();
          ctx.font = '7px monospace'; ctx.fillStyle = '#fbbf24'; ctx.fillText(`T_vac=${tVac.toFixed(1)}K  τ=${(curTau/45).toFixed(3)}s`, px + 25, py + 125);
          ctx.restore();
        }

      } else {
        // ==========================================
        // 3D Omega-Phase Tube Simulation Rendering
        // ==========================================
        const uMin = -3.5, uMax = 3.5, uSteps = 30;
        const vMin = 0, vMax = 2 * Math.PI, vSteps = 36;
        const centerX = width / 2; const centerY = height / 2 + (isExpanded ? 110 : 50); const scale = isExpanded ? 78 : 46;
        const activePinch = pinchStrength + (2.5 - pinchStrength) * decohereProgress;
        const activeJunction = junctionHeight * (1 - 0.85 * decohereProgress);

        const project = (x: number, y: number, z: number) => {
          const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
          const x1 = x * cosY - y * sinY; const y1 = x * sinY + y * cosY;
          const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
          const z2 = z * cosX - y1 * sinX; const y2 = z * sinX + y1 * cosX;
          const projX = (x1 * 9) / (y2 + 9) * scale + centerX;
          const projY = centerY - (z2 * 9) / (z2 + 9) * scale;
          return { px: projX, py: projY, depth: y2 };
        };

        const points: Point3D[][] = []; const time = Date.now() * 0.005;
        for (let i = 0; i <= uSteps; i++) {
          const u = uMin + (i / uSteps) * (uMax - uMin); points[i] = [];
          let xProf = u - activePinch * u * Math.exp(-u * u);
          
          // Phase wave ripple propagation running along the tube
          const wave = Math.sin(time - u * 2.5) * 0.12 * Math.exp(-u * u * 0.2) * (1 - decohereProgress);
          xProf += wave;
          let zProf = activeJunction * Math.exp(-u * u);

          if (isDecohering && decohereProgress > 0.8) {
            const sf = (decohereProgress - 0.8) * 5; 
            if (Math.abs(u) > 0.5 && Math.abs(u) < 1.5) xProf *= Math.max(0, 1 - sf * 2);
            if (Math.abs(u) <= 0.5) zProf += sf * 3.0;
          }
          for (let j = 0; j <= vSteps; j++) {
            const v = vMin + (j / vSteps) * (vMax - vMin);
            points[i].push({ x: xProf * Math.cos(v), y: xProf * Math.sin(v), z: zProf, u });
          }
        }

        const polygons: Polygon[] = [];
        for (let i = 0; i < uSteps; i++) {
          for (let j = 0; j < vSteps; j++) {
            const pr1 = project(points[i][j].x, points[i][j].y, points[i][j].z), pr2 = project(points[i+1][j].x, points[i+1][j].y, points[i+1][j].z);
            const pr3 = project(points[i+1][j+1].x, points[i+1][j+1].y, points[i+1][j+1].z), pr4 = project(points[i][j+1].x, points[i][j+1].y, points[i][j+1].z);
            polygons.push({ pts: [pr1, pr2, pr3, pr4], avgZ: (pr1.depth + pr2.depth + pr3.depth + pr4.depth) / 4, uVal: (points[i][j].u + points[i+1][j].u) / 2 });
          }
        }

        polygons.sort((a, b) => b.avgZ - a.avgZ);
        polygons.forEach(poly => {
          ctx.beginPath(); ctx.moveTo(poly.pts[0].px, poly.pts[0].py); ctx.lineTo(poly.pts[1].px, poly.pts[1].py);
          ctx.lineTo(poly.pts[2].px, poly.pts[2].py); ctx.lineTo(poly.pts[3].px, poly.pts[3].py); ctx.closePath();
          const normU = (poly.uVal + 3.5) / 7.0; 
          let r = Math.floor(50 + 205 * (1 - normU)), g = Math.floor(65 + 130 * Math.sin(normU * Math.PI)), b = Math.floor(220 * normU), alpha = 0.55;
          if (isDecohering && decohereProgress > 0.8 && Math.abs(poly.uVal) <= 0.5) {
            const fd = Math.min(1, (decohereProgress - 0.8) * 5); 
            r = Math.floor(r * (1 - fd) + 100 * fd); g = Math.floor(g * (1 - fd) + 100 * fd); b = Math.floor(b * (1 - fd) + 200 * fd); alpha = 0.55 * (1 - fd * 0.9);
          }
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`; ctx.fill(); ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (alpha / 0.55)})`; ctx.lineWidth = 0.5; ctx.stroke();
        });

        let starZ = activeJunction; if (isDecohering && decohereProgress > 0.8) starZ += (decohereProgress - 0.8) * 5 * 3.0;
        const junctionProj = project(0, 0, starZ);
        ctx.fillStyle = decohereProgress > 0.8 ? '#4b5563' : '#fbbf24'; ctx.beginPath(); ctx.arc(junctionProj.px, junctionProj.py, 10, 0, 2*Math.PI); ctx.fill();
        ctx.font = 'bold 11px font-sans'; ctx.textAlign = 'center'; ctx.fillStyle = decohereProgress > 0.8 ? 'rgba(156, 163, 175, 0.5)' : '#f87171';
        const labelText = decohereProgress > 0.8 
          ? "Topological Pinch-off\n(Spontaneous Decoherence)" 
          : "Multiply-Connected Junction\n(Internal Distance ≈ 0)";
        const lines = labelText.split('\n');
        lines.forEach((line, index) => {
          ctx.fillText(line, junctionProj.px, junctionProj.py - 25 + index * 12);
        });

        const partU = 2.4;
        const posA = { x: (partU - activePinch * partU * Math.exp(-partU * partU)) * Math.cos(0), y: (partU - activePinch * partU * Math.exp(-partU * partU)) * Math.sin(0), z: activeJunction * Math.exp(-partU * partU) };
        const posB = { x: (partU - activePinch * partU * Math.exp(-partU * partU)) * Math.cos(Math.PI), y: (partU - activePinch * partU * Math.exp(-partU * partU)) * Math.sin(Math.PI), z: activeJunction * Math.exp(-partU * partU) };
        const projA = project(posA.x, posA.y, posA.z), projB = project(posB.x, posB.y, posB.z);

        if (decohereProgress < 0.95) {
          ctx.save(); ctx.strokeStyle = `rgba(59, 130, 246, ${0.7 * (1 - decohereProgress)})`; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
          ctx.beginPath(); ctx.moveTo(projA.px, projA.py); ctx.lineTo(projB.px, projB.py); ctx.stroke(); ctx.restore();
        }

        const drawSphere3D = (proj: any, name: string, color: string) => {
          ctx.save(); ctx.shadowBlur = 12; ctx.shadowColor = color; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(proj.px, proj.py, 7, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
          ctx.font = 'bold 11px font-sans'; ctx.fillStyle = '#60a5fa'; ctx.textAlign = 'center'; ctx.fillText(name, proj.px, proj.py - 12);
        };
        drawSphere3D(projA, "Particle A", "#3b82f6"); drawSphere3D(projB, "Particle B", "#3b82f6");

        if (isDecohering && decohereProgress > 0 && decohereProgress < 1) {
          if (decohereProgress < 0.5) {
            const t = decohereProgress * 2;
            drawSphere3D(project(posA.x * (1-t), posA.y * (1-t), posA.z + (starZ - posA.z) * t), "Damping Wave (v ≤ c)", "#ef4444");
          } else {
            const t = (decohereProgress - 0.5) * 2;
            ctx.save(); ctx.shadowBlur = 20 + 10 * Math.sin(t * Math.PI); ctx.shadowColor = "#ef4444"; ctx.fillStyle = `rgba(239, 68, 68, ${1 - t})`;
            ctx.beginPath(); ctx.arc(projB.px, projB.py, 10 + 10 * t, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
            ctx.fillStyle = '#f87171'; ctx.fillText("Instantaneous Collapse Illusion", projB.px, projB.py - 25);
          }
        }
      }
      requestRef.current = requestAnimationFrame(runFrame);
    };
    requestRef.current = requestAnimationFrame(runFrame);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [simMode, mass, slitDist, qsAmplitude, eObs, tVac, gammaViscosity, pinchStrength, junctionHeight, isDecohering, decohereProgress, angleX, angleY]);

  const handleDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1 || simMode !== 'omega') return;
    setAngleY(prev => prev + e.movementX * 0.007);
    setAngleX(prev => Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev - e.movementY * 0.007)));
  };

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-6 my-6 shadow-xl selection:bg-none">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h3 className="text-md font-bold text-zinc-100">공간 역학 동역학적 시뮬레이터 (V8 Final Edition)</h3>
          <p className="text-xs text-zinc-400">제1부 4장~6장 및 다중 연결 위상 튜브(Phase Tube) 모델에 기반한 결정론적 궤적 및 물리적 수렴성을 실시간으로 확인합니다.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-lg gap-1">
          <button onClick={() => setSimMode('slit')} className={`px-3 py-1.5 text-xs rounded-md ${simMode === 'slit' ? 'bg-blue-600' : 'text-zinc-400'}`}>4장. 마디점 정칙화</button>
          <button onClick={() => setSimMode('decoherence')} className={`px-3 py-1.5 text-xs rounded-md ${simMode === 'decoherence' ? 'bg-blue-600' : 'text-zinc-400'}`}>5장. 위상 난류 붕괴</button>
          <button onClick={() => setSimMode('mass')} className={`px-3 py-1.5 text-xs rounded-md ${simMode === 'mass' ? 'bg-blue-600' : 'text-zinc-400'}`}>6장. 게이지 점성 및 거시 극한</button>
          <button onClick={() => setSimMode('omega')} className={`px-3 py-1.5 text-xs rounded-md ${simMode === 'omega' ? 'bg-purple-600' : 'text-zinc-400'}`}>🧩 다중 연결 위상 얽힘 (Phase Tube)</button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 p-2"><canvas ref={canvasRef} onMouseMove={handleDrag} className="w-full h-auto rounded-lg shadow-inner" /></div>
        <div className="flex flex-col space-y-4 bg-zinc-900/40 p-5 rounded-xl border border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-300">매개변수 조정</h4>
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

              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>공간 진동 강도 (Q<sub>s</sub>)</span>
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
                  <span>관측 위상 난류 에너지 (E_obs)</span>
                  <span className="text-red-400 font-mono">{eObs.toFixed(1)} GeV</span>
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

              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>진공 열역학적 온도 (T_vac)</span>
                  <span className="text-purple-400 font-mono">{tVac.toFixed(1)} K</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={tVac}
                  onChange={(e) => setTVac(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </>
          )}
          {simMode === 'mass' && (
            <>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>입자 질량 (m)</span>
                  <span className="text-amber-400 font-mono">{mass}</span>
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

              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>공간 기하 점성 (γ)</span>
                  <span className="text-emerald-400 font-mono">{gammaViscosity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.1"
                  value={gammaViscosity}
                  onChange={(e) => setGammaViscosity(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </>
          )}
          {simMode === 'omega' && (
            <>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>목 부분 꼬임 강도 (Pinch)</span>
                  <span className="text-purple-400 font-mono">{pinchStrength.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={pinchStrength}
                  onChange={(e) => setPinchStrength(Number(e.target.value))}
                  disabled={isDecohering}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-40"
                />
              </div>

              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>주 접합점 높이 (Tension)</span>
                  <span className="text-purple-400 font-mono">{junctionHeight.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="6.0"
                  step="0.2"
                  value={junctionHeight}
                  onChange={(e) => setJunctionHeight(Number(e.target.value))}
                  disabled={isDecohering}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-40"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsDecohering(!isDecohering)}
                  className="w-full py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  {isDecohering ? '리셋' : '위상 붕괴 시뮬레이션'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
