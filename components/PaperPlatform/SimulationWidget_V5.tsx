import React, { useState, useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  type: 'spinUp' | 'spinDown' | 'probe' | 'knot';
  color: string;
}

interface VortexVector {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  intensity: number;
}

export const SimulationWidget_V5: React.FC<{ initialMode?: 'neutralization' | 'stripe' | 'meissner', compact?: boolean }> = ({ initialMode, compact = false }) => {
  const [simMode, setSimMode] = useState<'neutralization' | 'stripe' | 'meissner'>('neutralization');
  const [dimSqueeze, setDimSqueeze] = useState<number>(0); // Mode B: 0 to 1

  useEffect(() => {
    if (initialMode) {
      setSimMode(initialMode);
    }
  }, [initialMode]);

  // Global refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const vectorsRef = useRef<VortexVector[]>([]);
  const requestRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);
  const neutralizationProgressRef = useRef<number>(0);

  // 3D View angle tracking
  const angleXRef = useRef<number>(15 * Math.PI / 180);
  const angleYRef = useRef<number>(30 * Math.PI / 180);
  const isDragging = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const resetSimulation = () => {
    particlesRef.current = [];
    vectorsRef.current = [];
    neutralizationProgressRef.current = 0;
    frameCountRef.current = 0;
    // Dim squeeze should not be reset here, but we can set it to 0 if entering stripe mode for the first time
    if (simMode !== 'stripe') {
      setDimSqueeze(0);
    }

    if (simMode === 'neutralization') {
      particlesRef.current.push({
        x: -40, y: -40, z: 0, vx: 0.2, vy: 0.3, vz: 0, type: 'spinUp', color: '#60a5fa' // Blue
      });
      particlesRef.current.push({
        x: 40, y: 40, z: 0, vx: -0.3, vy: -0.2, vz: 0, type: 'spinDown', color: '#f87171' // Red
      });
      particlesRef.current.push({
        x: -80, y: 0, z: 0, vx: 0.8, vy: 0.1, vz: 0, type: 'probe', color: '#fbbf24' // Yellow probe
      });
    } else if (simMode === 'stripe') {
      // Create random particles
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push({
          x: (Math.random() - 0.5) * 160,
          y: (Math.random() - 0.5) * 160,
          z: 0,
          vx: 0, vy: 0, vz: 0,
          type: i % 2 === 0 ? 'spinUp' : 'spinDown',
          color: i % 2 === 0 ? '#60a5fa' : '#f87171'
        });
      }
    }
  };

  // Only reset on simMode change
  useEffect(() => {
    resetSimulation();
  }, [simMode]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - prevMousePos.current.x;
    const dy = e.clientY - prevMousePos.current.y;
    angleYRef.current += dx * 0.007;
    angleXRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, angleXRef.current - dy * 0.007));
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 600 * dpr;
    canvas.height = 420 * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = '600px';
    canvas.style.height = 'auto';
    ctx.scale(dpr, dpr);

    const render = () => {
      frameCountRef.current += 1;
      const width = 600;
      const height = 420;
      const centerX = width * 0.55;
      const centerY = height * 0.55;
      const scale = 50;

      // Dark Cosmic background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';

      const project = (x: number, y: number, z: number) => {
        const cosY = Math.cos(angleYRef.current), sinY = Math.sin(angleYRef.current);
        const x1 = x * cosY - y * sinY;
        const y1 = x * sinY + y * cosY;
        const cosX = Math.cos(angleXRef.current), sinX = Math.sin(angleXRef.current);
        const z2 = z * cosX - y1 * sinX;
        const y2 = z * sinX + y1 * cosX;
        const projX = (x1 * 8) / (y2 + 8) * scale + centerX;
        const projY = centerY - (z2 * 8) / (z2 + 8) * scale;
        return { px: projX, py: projY, depth: y2 };
      };

      if (simMode === 'neutralization') {
        // ==========================================
        // Mode A: Topological Neutralization
        // ==========================================
        const p1 = particlesRef.current[0];
        const p2 = particlesRef.current[1];
        const p3 = particlesRef.current[2];

        if (p1 && p2 && p3) {
          // Attract p1 and p2 to center
          p1.vx -= p1.x * 0.005; p1.vy -= p1.y * 0.005;
          p2.vx -= p2.x * 0.005; p2.vy -= p2.y * 0.005;

          // Friction
          p1.vx *= 0.92; p1.vy *= 0.92;
          p2.vx *= 0.92; p2.vy *= 0.92;

          p1.x += p1.vx; p1.y += p1.vy;
          p2.x += p2.vx; p2.y += p2.vy;

          const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
          
          // Neutralization check
          if (dist < 10) {
            neutralizationProgressRef.current += 0.05;
          } else {
            neutralizationProgressRef.current -= 0.02;
          }
          neutralizationProgressRef.current = Math.max(0, Math.min(1, neutralizationProgressRef.current));

          // P3 (probe) logic: wanders in, gets repelled if neutralized
          if (frameCountRef.current % 300 === 0 && p3.x > 100) {
             p3.x = -80; p3.y = (Math.random() - 0.5) * 40; p3.vx = 2.0; p3.vy = (Math.random() - 0.5);
          }
          
          let p3ForceX = -p3.x * 0.001; // weak attraction
          let p3ForceY = -p3.y * 0.001;
          
          const p3CenterDist = Math.sqrt(p3.x * p3.x + p3.y * p3.y);
          if (neutralizationProgressRef.current > 0.8 && p3CenterDist < 30) {
            // Strong repulsion (Geometric Exclusion)
            p3ForceX = (p3.x / p3CenterDist) * 5;
            p3ForceY = (p3.y / p3CenterDist) * 5;
          }
          p3.vx += p3ForceX; p3.vy += p3ForceY;
          
          p3.vx *= 0.95; p3.vy *= 0.95;
          p3.x += p3.vx; p3.y += p3.vy;
        }

        // Draw grid
        ctx.lineWidth = 1;
        const gridColorRed = 239 - (239 - 16) * neutralizationProgressRef.current; // #ef4444 to #10b981
        const gridColorGreen = 68 + (185 - 68) * neutralizationProgressRef.current;
        const gridColorBlue = 68 + (129 - 68) * neutralizationProgressRef.current;
        
        const wellDepth = -60 * (1 - neutralizationProgressRef.current);
        const p3CenterDistForGrid = p3 ? Math.sqrt(p3.x*p3.x + p3.y*p3.y) : 100;
        
        const getZ = (x: number, y: number) => {
          const r = Math.sqrt(x*x + y*y);
          const baseWell = Math.exp(-r*r / 400) * wellDepth;
          // Mountain from p3 approaching
          const distToP3 = Math.sqrt((x - p3.x)**2 + (y - p3.y)**2);
          const bumpHeight = 40 * neutralizationProgressRef.current * Math.exp(-distToP3*distToP3 / 100);
          return baseWell + bumpHeight;
        };

        for (let i = -10; i <= 10; i++) {
          ctx.beginPath();
          for (let j = -10; j <= 10; j++) {
            const x = i * 10;
            const y = j * 10;
            const z = getZ(x, y);
            const pt = project(x, y, z);
            j === -10 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
          }
          ctx.strokeStyle = `rgba(${gridColorRed}, ${gridColorGreen}, ${gridColorBlue}, 0.5)`;
          ctx.stroke();
        }
        for (let j = -10; j <= 10; j++) {
          ctx.beginPath();
          for (let i = -10; i <= 10; i++) {
            const x = i * 10;
            const y = j * 10;
            const z = getZ(x, y);
            const pt = project(x, y, z);
            i === -10 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
          }
          ctx.stroke();
        }

        // Draw particles
        particlesRef.current.forEach(p => {
          const pt = project(p.x, p.y, p.z);
          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, p.type === 'probe' ? 4 : 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

      } else if (simMode === 'stripe') {
        // ==========================================
        // Mode B: Dimensional Squeezing & Stripe Phase
        // ==========================================
        const getZ = (x: number, y: number, squeeze: number) => {
          // 3 Distinct Point Wells at dimSqueeze = 0
          const d1 = Math.sqrt(x*x + (y+50)*(y+50));
          const d2 = Math.sqrt(x*x + y*y);
          const d3 = Math.sqrt(x*x + (y-50)*(y-50));
          const rPoint = Math.min(d1, d2, d3);
          
          // 1D Valley along diagonal (d-wave symmetry, x=y) at dimSqueeze = 1
          const rValley = Math.abs(x - y) * 0.7071;
          
          const rMorph = rPoint * (1 - squeeze) + rValley * squeeze;
          return Math.exp(-rMorph*rMorph / 250) * -50;
        };

        // Draw Grid
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.lineWidth = 1;
        
        for (let i = -12; i <= 12; i++) {
          ctx.beginPath();
          for (let j = -12; j <= 12; j++) {
            const x = i * 8;
            const y = j * 8;
            const z = getZ(x, y, dimSqueeze);
            const pt = project(x, y, z);
            j === -12 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
          }
          ctx.stroke();
        }
        for (let j = -12; j <= 12; j++) {
          ctx.beginPath();
          for (let i = -12; i <= 12; i++) {
            const x = i * 8;
            const y = j * 8;
            const z = getZ(x, y, dimSqueeze);
            const pt = project(x, y, z);
            i === -12 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
          }
          ctx.stroke();
        }

        // Update particles (Gradient Descent)
        particlesRef.current.forEach(p => {
          // Calculate local gradient of the space
          const z0 = getZ(p.x, p.y, dimSqueeze);
          const zdx = getZ(p.x + 1, p.y, dimSqueeze);
          const zdy = getZ(p.x, p.y + 1, dimSqueeze);
          const gradX = zdx - z0;
          const gradY = zdy - z0;
          
          // Real-time Gradient Descent force (-∇E)
          p.vx -= gradX * 0.15;
          p.vy -= gradY * 0.15;

          // Particle repulsions & Swarm clustering
          particlesRef.current.forEach(other => {
            if (p !== other) {
              const ddx = p.x - other.x;
              const ddy = p.y - other.y;
              const dsq = ddx*ddx + ddy*ddy;
              if (dsq > 0 && dsq < 100) {
                const dist = Math.sqrt(dsq);
                let force = 8 / dsq; // base Coulomb repulsion
                
                // Opposite spins attract to form alternating chains in the stripe phase
                if (p.type !== other.type && dist < 12) {
                   force -= 4 / dsq; 
                }
                p.vx += (ddx / dist) * force;
                p.vy += (ddy / dist) * force;
              }
            }
          });

          // Friction and Flow
          if (dimSqueeze > 0.8 && Math.abs(p.x - p.y) * 0.7071 < 15) {
            // Superconducting Glide (Zero Friction along diagonal)
            p.vx -= 0.25; 
            p.vy -= 0.25; 
            
            // Separate into parallel and perpendicular velocities
            const vParallel = (p.vx + p.vy) * 0.5;
            const vPerp = (p.vx - p.vy) * 0.5;
            
            // Suppress perpendicular (leave valley), preserve parallel (glide)
            p.vx = vParallel * 0.98 + vPerp * 0.7;
            p.vy = vParallel * 0.98 - vPerp * 0.7;
          } else {
            // Normal spatial friction
            p.vx *= 0.90;
            p.vy *= 0.90;
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -100) p.x = 100;
          if (p.y < -100) p.y = 100;
          if (p.x > 100) p.x = -100;
          if (p.y > 100) p.y = -100;

          // Draw Particle
          const pt = project(p.x, p.y, getZ(p.x, p.y, dimSqueeze));
          ctx.save();
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

      } else if (simMode === 'meissner') {
        // ==========================================
        // Mode C: Meissner Exclusion
        // ==========================================
        ctx.strokeStyle = 'rgba(63, 63, 70, 0.6)';
        ctx.lineWidth = 0.5;
        for (let i = -15; i <= 15; i++) {
          ctx.beginPath();
          for (let j = -15; j <= 15; j++) {
            const pt = project(i * 8, j * 8, 0);
            j === -15 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
          }
          ctx.stroke();
        }
        for (let j = -15; j <= 15; j++) {
          ctx.beginPath();
          for (let i = -15; i <= 15; i++) {
            const pt = project(i * 8, j * 8, 0);
            i === -15 ? ctx.moveTo(pt.px, pt.py) : ctx.lineTo(pt.px, pt.py);
          }
          ctx.stroke();
        }

        if (frameCountRef.current % 2 === 0) {
           vectorsRef.current.push({
             x: (Math.random() - 0.5) * 120,
             y: (Math.random() - 0.5) * 120,
             z: 100 + Math.random() * 20,
             vx: 0, vy: 0, vz: -2,
             intensity: 1.0
           });
        }

        vectorsRef.current.forEach(v => {
          if (v.z < 20) {
            const repulsion = Math.exp(-v.z / 5) * 0.8;
            v.vz += repulsion;
            v.vx += (v.x) * 0.005 * repulsion;
            v.vy += (v.y) * 0.005 * repulsion;
          }
          
          v.x += v.vx;
          v.y += v.vy;
          v.z += v.vz;

          v.intensity -= 0.005;

          if (v.intensity > 0) {
            const ptStart = project(v.x, v.y, v.z);
            const ptEnd = project(v.x + v.vx*3, v.y + v.vy*3, v.z + v.vz*3);
            
            ctx.save();
            ctx.strokeStyle = `rgba(168, 85, 247, ${v.intensity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(ptStart.px, ptStart.py);
            ctx.lineTo(ptEnd.px, ptEnd.py);
            ctx.stroke();
            
            ctx.fillStyle = `rgba(168, 85, 247, ${v.intensity})`;
            ctx.beginPath();
            ctx.arc(ptEnd.px, ptEnd.py, 1.5, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
          }
        });
        
        vectorsRef.current = vectorsRef.current.filter(v => v.intensity > 0 && v.z > -10);
      }

      ctx.globalCompositeOperation = 'source-over';

      // ==========================================
      // UI Overlays (Energy Graphs & Labels)
      // ==========================================
      if (simMode === 'neutralization') {
        const gx = 20, gy = height - 120, gw = 180, gh = 90;
        
        // Background
        ctx.fillStyle = 'rgba(24, 24, 27, 0.8)';
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeStyle = '#3f3f46';
        ctx.strokeRect(gx, gy, gw, gh);
        
        // Axis Labels
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '10px monospace';
        ctx.fillText('E_topo = (κ/2)∫|∇θ_total|²d³r', gx + 5, gy - 5);
        ctx.fillText('r (Distance to Node Center)', gx + 15, gy + gh + 15);
        
        // Axis Line (E=0 Base Level)
        const zeroY = gy + gh/2 + 20; // 0 line is near the bottom
        ctx.strokeStyle = '#52525b';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(gx, zeroY);
        ctx.lineTo(gx + gw, zeroY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw the E(r) Curve
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const p3 = particlesRef.current[2];
        const p3CenterDist = p3 ? Math.sqrt(p3.x*p3.x + p3.y*p3.y) : 100;

        for (let x = 0; x <= gw; x++) {
          const r = x * (100 / gw); // Mapping X-axis to Distance (0 to 100)
          
          // Original well depth (lifted if not neutralized)
          const baseWell = 40 * (1 - neutralizationProgressRef.current) * Math.exp(-(r*r) / 400);
          
          // Tensor spike when 3rd particle approaches (only when neutralized)
          const mountain = 60 * neutralizationProgressRef.current * Math.exp(-Math.pow(r - p3CenterDist, 2) / 80);
          
          const E = baseWell + mountain; 
          
          const px = gx + x;
          const py = zeroY - E; // E>0 goes up
          
          x === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Draw 3rd Particle Position & Repulsion Vector on Graph
        if (p3 && neutralizationProgressRef.current > 0.8) {
           const p3X = gx + p3CenterDist * (gw / 100);
           const p3E = 60 * Math.exp(0); // At the peak
           const p3Y = zeroY - p3E;
           
           ctx.fillStyle = p3.color;
           ctx.beginPath();
           ctx.arc(p3X, p3Y, 4, 0, Math.PI*2);
           ctx.fill();

           // F_rep label when pushed back
           if (p3CenterDist < 45 && p3.vx > 0) { // Moving away
             ctx.fillStyle = '#ef4444';
             ctx.font = 'bold 11px monospace';
             ctx.fillText('F_rep = -∇E_3-body', p3X + 15, p3Y - 5);
             
             // Draw repelling arrow
             ctx.strokeStyle = '#ef4444';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.moveTo(p3X, p3Y);
             ctx.lineTo(p3X + 15, p3Y + 15);
             ctx.stroke();
             ctx.beginPath();
             ctx.moveTo(p3X + 15, p3Y + 15);
             ctx.lineTo(p3X + 10, p3Y + 15);
             ctx.lineTo(p3X + 15, p3Y + 10);
             ctx.stroke();
           }
        }
      }

      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(
        simMode === 'neutralization' ? 'MODE A: TOPOLOGICAL NEUTRALIZATION & 2-BODY LIMIT' :
        simMode === 'stripe' ? 'MODE B: DIMENSIONAL SQUEEZING & STRIPE PHASE' :
        'MODE C: MEISSNER EXCLUSION', 20, 30
      );
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '9px monospace';
      ctx.fillText('🔄 Click & Drag canvas to rotate geometry', 20, height - 20);

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [simMode, dimSqueeze]);

  return (
    <div className="relative w-full h-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 font-mono">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setSimMode('neutralization')}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${simMode === 'neutralization' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          Neutralization
        </button>
        <button
          onClick={() => setSimMode('stripe')}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${simMode === 'stripe' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          Stripe Phase
        </button>
        <button
          onClick={() => setSimMode('meissner')}
          className={`px-3 py-1.5 text-xs font-semibold rounded ${simMode === 'meissner' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          Meissner
        </button>
      </div>

      {simMode === 'stripe' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-64 bg-zinc-900/80 p-3 rounded-lg border border-zinc-700 backdrop-blur-sm">
          <label className="text-zinc-300 text-xs mb-2 font-semibold flex justify-between w-full">
            <span>Dimensional Squeezing:</span>
            <span className="text-emerald-400">{(dimSqueeze * 100).toFixed(0)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={dimSqueeze}
            onChange={(e) => setDimSqueeze(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="cursor-move block w-full h-auto"
      />
    </div>
  );
};
