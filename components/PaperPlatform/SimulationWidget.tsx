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
  
  // Physics Parameters
  const [mass, setMass] = useState<number>(1);
  const [slitDist, setSlitDist] = useState<number>(30);
  const [qsAmplitude, setQsAmplitude] = useState<number>(4);
  const [eObs, setEObs] = useState<number>(0); // Chapter 5 perturbation
  
  // 3D Omega Tube Parameters
  const [pinchStrength, setPinchStrength] = useState<number>(1.8);
  const [junctionHeight, setJunctionHeight] = useState<number>(4.5);
  const [isDecohering, setIsDecohering] = useState<boolean>(false);
  const [decohereProgress, setDecohereProgress] = useState<number>(0);
  
  // 3D View Angles (in Radians)
  const [angleX, setAngleX] = useState<number>(15 * Math.PI / 180); // elev
  const [angleY, setAngleY] = useState<number>(60 * Math.PI / 180); // azim
  
  // Drag rotation helper
  const isDragging = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Animation state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const screenHitsRef = useRef<number[]>(new Array(100).fill(0));
  const deadTrailsRef = useRef<{x: number, y: number}[][]>([]);
  const requestRef = useRef<number | null>(null);

  // Restart simulation helper
  const resetSimulation = () => {
    particlesRef.current = [];
    screenHitsRef.current = new Array(100).fill(0);
    deadTrailsRef.current = [];
    setIsDecohering(false);
    setDecohereProgress(0);
  };

  useEffect(() => {
    resetSimulation();
  }, [simMode, mass, slitDist, qsAmplitude, eObs]);

  // Decoherence animation timer
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

    let width = canvas.width = 600;
    let height = canvas.height = 350;

    const runFrame = () => {
      // 1. Clear background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      if (simMode !== 'omega') {
        // ==========================================
        // 2D Wave Interference Simulation Rendering
        // ==========================================
        const decoherenceFactor = Math.exp(-eObs * 1.5);
        const activeAmplitude = qsAmplitude * (simMode === 'decoherence' ? decoherenceFactor : 1);
        
        const drawTopography = () => {
          ctx.save();
          ctx.globalAlpha = 0.08;
          const slitX = 180;
          for (let x = slitX; x < width - 40; x += 6) {
            const distance = x - slitX;
            for (let y = 10; y < height - 10; y += 8) {
              const angle = Math.atan2(y - height / 2, distance);
              const pathDifference = (slitDist * Math.sin(angle));
              const potential = activeAmplitude * Math.cos(0.08 * pathDifference * Math.sqrt(distance));
              
              if (potential > 0) {
                ctx.fillStyle = `rgba(59, 130, 246, ${potential / 6})`;
              } else {
                ctx.fillStyle = `rgba(168, 85, 247, ${Math.abs(potential) / 6})`;
              }
              ctx.fillRect(x, y, 4, 4);
            }
          }
          ctx.restore();
        };

        drawTopography();

        // Draw Slits
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(180, 0);
        ctx.lineTo(180, height / 2 - slitDist / 2 - 10);
        ctx.moveTo(180, height / 2 - slitDist / 2 + 10);
        ctx.lineTo(180, height / 2 + slitDist / 2 - 10);
        ctx.moveTo(180, height / 2 + slitDist / 2 + 10);
        ctx.lineTo(180, height / 2 + 320);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(177, height / 2 - slitDist / 2 - 10, 6, 20);
        ctx.fillRect(177, height / 2 + slitDist / 2 - 10, 6, 20);
        ctx.globalAlpha = 1.0;

        if (simMode === 'decoherence' && eObs > 0) {
          ctx.font = '10px monospace';
          ctx.fillStyle = '#ef4444';
          ctx.fillText(`📡 Observation perturb energy (E_obs): ${eObs.toFixed(1)} GeV`, 190, 25);
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

        // Emit particle
        if (Math.random() < 0.25 && particlesRef.current.length < 50) {
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

        // Draw accumulated dead trails (persist historical trajectories)
        ctx.save();
        ctx.lineWidth = 0.5;
        deadTrailsRef.current.forEach(trail => {
          ctx.strokeStyle = simMode === 'mass' && mass > 50 ? 'rgba(234, 179, 8, 0.04)' : 'rgba(59, 130, 246, 0.04)';
          ctx.beginPath();
          trail.forEach((t, i) => i === 0 ? ctx.moveTo(t.x, t.y) : ctx.lineTo(t.x, t.y));
          ctx.stroke();
        });
        ctx.restore();

        const activeMass = simMode === 'mass' ? mass : 1.0;

        particlesRef.current.forEach((p) => {
          if (!p.active) return;

          ctx.beginPath();
          ctx.strokeStyle = simMode === 'mass' && mass > 50 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(59, 130, 246, 0.15)';
          ctx.lineWidth = 1.5;
          p.trail.forEach((t, i) => {
            if (i === 0) ctx.moveTo(t.x, t.y);
            else ctx.lineTo(t.x, t.y);
          });
          ctx.stroke();

          if (p.trail.length > 25) p.trail.shift();
          p.trail.push({ x: p.x, y: p.y });

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
            const forceGradient = -activeAmplitude * Math.sin(frequency * pathDifference) * Math.cos(angle) * 0.12;
            
            const acceleration = forceGradient / activeMass;
            p.vy += acceleration;
            if (p.vy > 2.5) p.vy = 2.5;
            if (p.vy < -2.5) p.vy = -2.5;
            p.y += p.vy;
          }

          ctx.fillStyle = simMode === 'mass' && mass > 50 ? '#eab308' : '#60a5fa';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          if (p.x >= width - 30) {
            p.active = false;
            deadTrailsRef.current.push([...p.trail, { x: p.x, y: p.y }]); // Save final trajectory
            if (deadTrailsRef.current.length > 300) deadTrailsRef.current.shift(); // Memory limits
            const binIndex = Math.floor((p.y / height) * 100);
            if (binIndex >= 0 && binIndex < 100) {
              screenHitsRef.current[binIndex]++;
            }
          }
        });

        particlesRef.current = particlesRef.current.filter((p) => p.active || p.trail.length > 0);

        // Screen hits histogram
        ctx.fillStyle = '#60a5fa';
        ctx.globalAlpha = 0.8;
        const binWidth = height / 100;
        let maxHits = Math.max(...screenHitsRef.current, 1);

        screenHitsRef.current.forEach((hits, idx) => {
          if (hits === 0) return;
          const barWidth = (hits / maxHits) * 26;
          const y = idx * binWidth;
          
          ctx.fillStyle = simMode === 'mass' && mass > 50 ? '#eab308' : '#3b82f6';
          ctx.fillRect(width - 30, y, barWidth, binWidth - 0.5);
        });
        ctx.globalAlpha = 1.0;

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

      } else {
        // ==========================================
        // 3D Omega-Phase Tube Simulation Rendering
        // ==========================================
        const uMin = -3.5, uMax = 3.5, uSteps = 30;
        const vMin = 0, vMax = 2 * Math.PI, vSteps = 36;
        
        const centerX = width / 2;
        const centerY = height / 2 + 10;
        const scale = 55; // Screen projection scale

        // Pre-compute current animated parameters for pinch-off decoherence
        // During decoherence, the neck pinchStrength is driven towards maximum collapse, Z height gets slightly distorted
        const activePinch = pinchStrength + (2.5 - pinchStrength) * decohereProgress;
        const activeJunction = junctionHeight * (1 - 0.85 * decohereProgress);
        
        // 3D projection & rotation mapping
        const project = (x: number, y: number, z: number) => {
          // Rotate around Y axis (azimuth / Y-rot)
          const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
          const x1 = x * cosY - y * sinY;
          const y1 = x * sinY + y * cosY;

          // Rotate around X axis (elevation / X-rot)
          const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
          const z2 = z * cosX - y1 * sinX;
          const y2 = z * sinX + y1 * cosX; // Depth coordinate (Z in camera space)

          // Camera distance projection
          const d = 9; // Camera focus distance
          const projX = (x1 * d) / (y2 + d) * scale + centerX;
          const projY = (z2 * d) / (z2 + d) * scale + centerY;

          return { px: projX, py: projY, depth: y2 };
        };

        // 1. Generate 3D Mesh vertices
        const points: Point3D[][] = [];
        for (let i = 0; i <= uSteps; i++) {
          const u = uMin + (i / uSteps) * (uMax - uMin);
          points[i] = [];
          
          // Apply extreme neck pinching formulation
          let xProf = u - activePinch * u * Math.exp(-u * u);
          let zProf = activeJunction * Math.exp(-u * u);

          // 80% 이상 진행 시 기하학적 절단(Pinch-off) 및 거품 분리 연출
          if (isDecohering && decohereProgress > 0.8) {
            const severFactor = (decohereProgress - 0.8) * 5; // 0 to 1
            
            // 1. 목(Neck) 부위 렌더링 절단 (u가 0.5 ~ 1.5 부근)
            if (Math.abs(u) > 0.5 && Math.abs(u) < 1.5) {
              xProf *= Math.max(0, 1 - severFactor * 2); 
            }
            
            // 2. 최상단부(Topological Bubble) 허공으로 부상
            if (Math.abs(u) <= 0.5) {
              zProf += severFactor * 3.0; 
            }
          }

          for (let j = 0; j <= vSteps; j++) {
            const v = vMin + (j / vSteps) * (vMax - vMin);
            const x = xProf * Math.cos(v);
            const y = xProf * Math.sin(v);
            const z = zProf;
            points[i].push({ x, y, z, u });
          }
        }

        // 2. Build 3D mesh polygons
        const polygons: Polygon[] = [];
        for (let i = 0; i < uSteps; i++) {
          for (let j = 0; j < vSteps; j++) {
            const p1 = points[i][j];
            const p2 = points[i+1][j];
            const p3 = points[i+1][j+1];
            const p4 = points[i][j+1];

            // Project 4 vertices
            const pr1 = project(p1.x, p1.y, p1.z);
            const pr2 = project(p2.x, p2.y, p2.z);
            const pr3 = project(p3.x, p3.y, p3.z);
            const pr4 = project(p4.x, p4.y, p4.z);

            // Backface culling / boundary discard if outside canvas
            const avgZ = (pr1.depth + pr2.depth + pr3.depth + pr4.depth) / 4;
            polygons.push({
              pts: [pr1, pr2, pr3, pr4],
              avgZ,
              uVal: (p1.u + p2.u) / 2
            });
          }
        }

        // 3. Sort polygons using Painter's Algorithm (render furthest first)
        polygons.sort((a, b) => b.avgZ - a.avgZ);

        // 4. Render 3D Surface Mesh
        polygons.forEach(poly => {
          ctx.beginPath();
          ctx.moveTo(poly.pts[0].px, poly.pts[0].py);
          ctx.lineTo(poly.pts[1].px, poly.pts[1].py);
          ctx.lineTo(poly.pts[2].px, poly.pts[2].py);
          ctx.lineTo(poly.pts[3].px, poly.pts[3].py);
          ctx.closePath();

          // Coolwarm gradient based on the uVal parameter (necks vs sides)
          const normU = (poly.uVal + 3.5) / 7.0; // 0.0 ~ 1.0
          const r = Math.floor(50 + 205 * (1 - normU));
          const g = Math.floor(65 + 130 * Math.sin(normU * Math.PI));
          const b = Math.floor(220 * normU);
          
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.55)`;
          ctx.fill();

          // Draw Wireframe grid lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });

        // 5. Draw 3D Quivers / Arrows
        // Helper function to draw projected arrows
        const drawArrow3D = (x: number, y: number, z: number, dx: number, dy: number, dz: number, color: string, thickness: number = 2) => {
          const start = project(x, y, z);
          const end = project(x + dx, y + dy, z + dz);

          ctx.strokeStyle = color;
          ctx.lineWidth = thickness;
          ctx.beginPath();
          ctx.moveTo(start.px, start.py);
          ctx.lineTo(end.px, end.py);
          ctx.stroke();

          // Draw arrow head
          const angle = Math.atan2(end.py - start.py, end.px - start.px);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(end.px, end.py);
          ctx.lineTo(end.px - 8 * Math.cos(angle - Math.PI / 6), end.py - 8 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(end.px - 8 * Math.cos(angle + Math.PI / 6), end.py - 8 * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fill();
        };

        // Primary Spatial Junction Star (u = 0, z = activeJunction)
        let starZ = activeJunction;
        if (isDecohering && decohereProgress > 0.8) {
          starZ += (decohereProgress - 0.8) * 5 * 3.0;
        }
        const junctionProj = project(0, 0, starZ);
        const starColor = decohereProgress > 0.8 ? '#4b5563' : '#fbbf24'; // Greyed out if decohered
        
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = starColor;
        ctx.fillStyle = starColor;
        ctx.beginPath();
        // 5-point star path
        const spikes = 5, outerRadius = 14 * (1 - 0.5 * decohereProgress), innerRadius = 6 * (1 - 0.5 * decohereProgress);
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        ctx.moveTo(junctionProj.px, junctionProj.py - outerRadius);
        for (let k = 0; k < spikes; k++) {
          let sx = junctionProj.px + Math.cos(rot) * outerRadius;
          let sy = junctionProj.py + Math.sin(rot) * outerRadius;
          ctx.lineTo(sx, sy);
          rot += step;

          sx = junctionProj.px + Math.cos(rot) * innerRadius;
          sy = junctionProj.py + Math.sin(rot) * innerRadius;
          ctx.lineTo(sx, sy);
          rot += step;
        }
        ctx.lineTo(junctionProj.px, junctionProj.py - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Star 3D Label (Fixed to star location)
        ctx.font = 'bold 11px font-sans';
        ctx.fillStyle = decohereProgress > 0.8 ? '#9ca3af' : '#f87171';
        ctx.textAlign = 'center';
        ctx.fillText(
          decohereProgress > 0.8 ? "Junction Decohered\n(Entanglement Lost)" : "Primary Spatial Junction\n(Entanglement Active)",
          junctionProj.px,
          junctionProj.py - 20
        );

        // Particle A and Particle B Setups
        const partU = 2.4;
        const getParticlePos = (u: number, vAngle: number) => {
          const xProf = u - activePinch * u * Math.exp(-u * u);
          const zProf = activeJunction * Math.exp(-u * u);
          const x = xProf * Math.cos(vAngle);
          const y = xProf * Math.sin(vAngle);
          const z = zProf;
          return { x, y, z };
        };

        const posA = getParticlePos(partU, 0);
        const posB = getParticlePos(partU, Math.PI);

        const projA = project(posA.x, posA.y, posA.z);
        const projB = project(posB.x, posB.y, posB.z);

        // Draw quantum entanglement bridge line (dashed blue, fades during decoherence)
        if (decohereProgress < 0.95) {
          ctx.save();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.7 * (1 - decohereProgress)})`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(projA.px, projA.py);
          ctx.lineTo(projB.px, projB.py);
          ctx.stroke();
          ctx.restore();
        }

        // Draw 3D Spheres for Particle A and B
        const drawSphere3D = (proj: { px: number; py: number; depth: number }, name: string, color: string) => {
          ctx.save();
          ctx.shadowBlur = 12;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, 7, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();

          // Particle Label
          ctx.font = 'bold 11px font-sans';
          ctx.fillStyle = '#60a5fa';
          ctx.textAlign = 'center';
          ctx.fillText(name, proj.px, proj.py - 12);
        };

        drawSphere3D(projA, "Particle A", "#3b82f6");
        drawSphere3D(projB, "Particle B", "#3b82f6");

        // Quiver: Vulnerable Neck Region Arrow (Elevated purple arrowpointing to neck)
        // Neck u-coord is approx 0.8 where the profile pinches most. Let's point arrow to neck.
        const neckTargetPos = getParticlePos(0.8, -Math.PI / 2); // Pointing to neck valley
        const neckArrowProj = project(neckTargetPos.x, neckTargetPos.y - 1.2, neckTargetPos.z);
        drawArrow3D(neckTargetPos.x, neckTargetPos.y - 1.5, neckTargetPos.z, 0, 1.2, 0, '#a855f7', 2.5);

        ctx.font = 'bold 10.5px font-sans';
        ctx.fillStyle = '#c084fc';
        ctx.textAlign = 'center';
        ctx.fillText(
          "Vulnerable 'Neck' Region\n(Risk of Pinch-off & Decoherence)",
          neckArrowProj.px,
          neckArrowProj.py - 30
        );

        // 5. Draw 3D Quivers / Arrows (Replaced with dynamic propagation damping wave)
        if (isDecohering && decohereProgress > 0 && decohereProgress < 1) {
          const prog = decohereProgress;
          if (prog < 0.5) {
            // 0~50%: A 입자에서 상단으로 타고 올라가는 Damping Wave
            const t = prog * 2; 
            const curX = posA.x * (1 - t);
            const curY = posA.y * (1 - t);
            const curZ = posA.z + (starZ - posA.z) * t;
            drawSphere3D(project(curX, curY, curZ), "Damping Wave (v ≤ c)", "#ef4444");
          } else {
            // 50~100%: 튜브가 끊어지며 B 입자로 순식간에 내리꽂히는 착시 파동
            const t = (prog - 0.5) * 2;
            const curX = posB.x * t;
            const curY = posB.y * t;
            const curZ = starZ - (starZ - posB.z) * t;
            drawSphere3D(project(curX, curY, curZ), "Instantaneous Collapse Illusion", "#ef4444");
          }
        }

        // 3D View Calibration Info overlay
        ctx.font = '10px monospace';
        ctx.fillStyle = '#71717a';
        ctx.textAlign = 'left';
        ctx.fillText("🖱 Drag on 3D grid to rotate viewport (elev / azim)", 15, height - 15);
        ctx.fillText(`View Angles: θx = ${(angleX * 180 / Math.PI).toFixed(0)}°, θy = ${(angleY * 180 / Math.PI).toFixed(0)}°`, 15, 20);
        ctx.fillText(`Pinch parameter: ${activePinch.toFixed(2)}`, 15, 35);
        ctx.fillText(`Junction height: ${activeJunction.toFixed(2)}`, 15, 50);
      }

      requestRef.current = requestAnimationFrame(runFrame);
    };

    requestRef.current = requestAnimationFrame(runFrame);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [simMode, mass, slitDist, qsAmplitude, eObs, pinchStrength, junctionHeight, isDecohering, decohereProgress, angleX, angleY]);

  // Handle drag-rotation actions on 3D Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (simMode !== 'omega') return;
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || simMode !== 'omega') return;
    const dx = e.clientX - prevMousePos.current.x;
    const dy = e.clientY - prevMousePos.current.y;

    setAngleY(prev => prev + dx * 0.007);
    setAngleX(prev => {
      const next = prev - dy * 0.007;
      // Clamp elevation angle to prevent flipping
      return Math.max(-Math.PI / 3, Math.min(Math.PI / 3, next));
    });

    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-6 my-6 shadow-xl selection:bg-none">
      {/* Simulation Dashboard Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h3 className="text-md font-bold text-zinc-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            공간 역학 동역학적 시뮬레이터 (Decisive Physics Sandbox)
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            제1부 4장~6장 및 Ω-Phase 튜브 모델에 기반한 결정론적 궤적 및 물리적 수렴성을 실시간으로 확인합니다.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap bg-zinc-900 border border-zinc-800 p-1 rounded-lg self-start">
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
          <button
            onClick={() => setSimMode('omega')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              simMode === 'omega' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🧩 Ω-튜브 얽힘 역학
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Area */}
        <div className="lg:col-span-2 bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 p-2 flex items-center justify-center relative">
          <canvas 
            ref={canvasRef} 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`w-full max-w-[600px] h-auto rounded-lg shadow-inner ${
              simMode === 'omega' ? 'cursor-grab active:cursor-grabbing' : ''
            }`} 
          />
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
                <div className="p-3 bg-red-950/20 border border-red-900/35 rounded-lg text-[11px] text-red-300 leading-relaxed font-serif">
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
                
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                  <div className="text-[10px] text-zinc-400 mb-2 font-mono text-center">
                    {"공간 유도 가속도 수렴성: $\\lim_{m \\to \\infty} \\frac{\\nabla Q_s}{m} = 0$"}
                  </div>
                  <div className="h-16 flex items-end justify-center relative">
                    <svg className="w-full h-full text-zinc-700" viewBox="0 0 100 40">
                      <path
                        d="M 10 5 Q 30 35 90 38"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="1.5"
                        strokeDasharray={mass > 50 ? 'none' : '2'}
                      />
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

                <div className="space-y-1">
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
                    onClick={() => {
                      if (isDecohering) {
                        setIsDecohering(false);
                        setDecohereProgress(0);
                      } else {
                        setIsDecohering(true);
                      }
                    }}
                    className={`w-full py-2.5 text-xs font-bold rounded-lg transition-all shadow-md active:scale-95 ${
                      isDecohering 
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' 
                        : 'bg-[#b31b1b] hover:bg-red-800 text-white'
                    }`}
                  >
                    {isDecohering ? '🔄 시뮬레이션 리셋' : '📡 관측 에너지 투사 (Decoherence)'}
                  </button>
                </div>
                
                <div className="p-3 bg-purple-950/20 border border-purple-900/30 rounded-lg text-[11px] text-purple-300 leading-relaxed font-serif">
                  <strong>수학적 위상 결합:</strong> {"u축 메쉬 단면 프로필 곡선 $X = u - a \\cdot u \\cdot e^{-u^2}$ 상에서, 관측 파동 개입 시 $a$(꼬임 강도)가 최대치로 치솟아 잘록한 목이 끊어져 나가며(Pinch-off), 주 접합점의 얽힘이 동시 상실되는 역학입니다."}
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
            <span className="text-[10px] text-zinc-550 font-mono">
              {simMode === 'omega' ? '3D ENGINE: ONLINE' : 'Status: CALIBRATING...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
