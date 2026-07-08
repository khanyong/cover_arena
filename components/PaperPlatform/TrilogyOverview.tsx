import React, { useEffect, useRef } from 'react';

interface Photon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

export const TrilogyOverview: React.FC = () => {
  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas3Ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // ----------------------------------------
    // Part I Canvas: Quantum Wave Surfing
    // ----------------------------------------
    const c1 = canvas1Ref.current;
    if (!c1) return;
    const ctx1 = c1.getContext('2d');
    if (!ctx1) return;

    let animId1: number;
    let t1 = 0;

    const resizeC1 = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = c1.parentElement?.getBoundingClientRect();
      const w = rect?.width || 320;
      const h = 200;
      c1.width = w * dpr;
      c1.height = h * dpr;
      c1.style.width = `${w}px`;
      c1.style.height = `${h}px`;
      ctx1.scale(dpr, dpr);
    };
    resizeC1();

    const drawPart1 = () => {
      t1 += 0.05;
      const w = c1.width / (window.devicePixelRatio || 1);
      const h = c1.height / (window.devicePixelRatio || 1);
      const cy = h / 2;

      ctx1.clearRect(0, 0, w, h);
      ctx1.fillStyle = '#000000';
      ctx1.fillRect(0, 0, w, h);

      // Draw wave
      ctx1.strokeStyle = 'rgba(59, 130, 246, 0.55)';
      ctx1.shadowColor = '#3b82f6';
      ctx1.shadowBlur = 4;
      ctx1.lineWidth = 2.5;
      ctx1.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const env = Math.exp(-Math.pow((x - w / 2) / (w / 3.2), 2));
        const y = cy + Math.sin(x * 0.06 - t1) * 35 * env;
        x === 0 ? ctx1.moveTo(x, y) : ctx1.lineTo(x, y);
      }
      ctx1.stroke();

      // Draw surfing particle
      const px = w / 2 + Math.sin(t1 * 0.7) * (w / 3.5);
      const pEnv = Math.exp(-Math.pow((px - w / 2) / (w / 3.2), 2));
      const py = cy + Math.sin(px * 0.06 - t1) * 35 * pEnv;

      ctx1.save();
      ctx1.shadowBlur = 12;
      ctx1.shadowColor = '#60a5fa';
      ctx1.fillStyle = '#ffffff';
      ctx1.beginPath();
      ctx1.arc(px, py, 5, 0, Math.PI * 2);
      ctx1.fill();
      ctx1.restore();

      animId1 = requestAnimationFrame(drawPart1);
    };
    drawPart1();

    // ----------------------------------------
    // Part II Canvas: Dark Fluid Chameleon
    // ----------------------------------------
    const c2 = canvas2Ref.current;
    if (!c2) return;
    const ctx2 = c2.getContext('2d');
    if (!ctx2) return;

    let animId2: number;
    let t2 = 0;

    const resizeC2 = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = c2.parentElement?.getBoundingClientRect();
      const w = rect?.width || 320;
      const h = 200;
      c2.width = w * dpr;
      c2.height = h * dpr;
      c2.style.width = `${w}px`;
      c2.style.height = `${h}px`;
      ctx2.scale(dpr, dpr);
    };
    resizeC2();

    const drawPart2 = () => {
      t2 += 0.02;
      const w = c2.width / (window.devicePixelRatio || 1);
      const h = c2.height / (window.devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;

      ctx2.clearRect(0, 0, w, h);
      ctx2.fillStyle = '#000000';
      ctx2.fillRect(0, 0, w, h);

      // Dark Matter Condensation
      const rad = 35 + Math.sin(t2 * 4) * 3;
      const grad = ctx2.createRadialGradient(cx, cy, 0, cx, cy, rad);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.7)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx2.fillStyle = grad;
      ctx2.beginPath();
      ctx2.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx2.fill();

      ctx2.save();
      ctx2.shadowBlur = 10;
      ctx2.shadowColor = '#10b981';
      ctx2.fillStyle = '#ffffff';
      ctx2.beginPath();
      ctx2.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx2.fill();
      ctx2.restore();

      // Dark Energy Expansion
      for (let i = 0; i < 3; i++) {
        const offset = (t2 * 0.4 + i / 3) % 1;
        ctx2.strokeStyle = `rgba(239, 68, 68, ${1 - offset})`;
        ctx2.lineWidth = 1.5;
        ctx2.beginPath();
        ctx2.arc(cx, cy, rad + offset * 110, 0, Math.PI * 2);
        ctx2.stroke();
      }

      animId2 = requestAnimationFrame(drawPart2);
    };
    drawPart2();

    // ----------------------------------------
    // Part III Canvas: Cosmic Quake & FRB
    // ----------------------------------------
    const c3 = canvas3Ref.current;
    if (!c3) return;
    const ctx3 = c3.getContext('2d');
    if (!ctx3) return;

    let animId3: number;
    let t3 = 0;
    let photonsList: Photon[] = [];

    const resizeC3 = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = c3.parentElement?.getBoundingClientRect();
      const w = rect?.width || 320;
      const h = 200;
      c3.width = w * dpr;
      c3.height = h * dpr;
      c3.style.width = `${w}px`;
      c3.style.height = `${h}px`;
      ctx3.scale(dpr, dpr);
    };
    resizeC3();

    const drawPart3 = () => {
      t3 += 0.035;
      const w = c3.width / (window.devicePixelRatio || 1);
      const h = c3.height / (window.devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;

      ctx3.clearRect(0, 0, w, h);
      ctx3.fillStyle = '#000000';
      ctx3.fillRect(0, 0, w, h);

      const stress = t3 % Math.PI;
      const isSnap = stress > 3.0;
      const offset = isSnap ? 0 : Math.sin(stress) * 8;

      // Sliding fault line
      ctx3.strokeStyle = 'rgba(168, 85, 247, 0.65)';
      ctx3.lineWidth = 3.5;
      ctx3.beginPath();
      ctx3.moveTo(cx - 2, 0);
      ctx3.lineTo(cx - 2 + offset, h);
      ctx3.stroke();

      ctx3.beginPath();
      ctx3.moveTo(cx + 2, 0);
      ctx3.lineTo(cx + 2 - offset, h);
      ctx3.stroke();

      // Snap-back & Spawn photons
      if (isSnap && photonsList.length === 0) {
        ctx3.save();
        ctx3.strokeStyle = 'rgba(168, 85, 247, 0.9)';
        ctx3.lineWidth = 1.5;
        ctx3.beginPath();
        ctx3.arc(cx, cy, 25, 0, Math.PI * 2);
        ctx3.stroke();
        ctx3.restore();

        for (let i = 0; i < 12; i++) {
          photonsList.push({
            x: cx,
            y: cy,
            vx: Math.cos((i * Math.PI) / 6) * 6,
            vy: Math.sin((i * Math.PI) / 6) * 6,
            alpha: 1.0,
          });
        }
      }

      // Render photons
      for (let i = photonsList.length - 1; i >= 0; i--) {
        const p = photonsList[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        ctx3.save();
        ctx3.shadowBlur = 8;
        ctx3.shadowColor = '#fbbf24';
        ctx3.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        ctx3.beginPath();
        ctx3.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx3.fill();
        ctx3.restore();

        if (p.alpha <= 0) {
          photonsList.splice(i, 1);
        }
      }

      animId3 = requestAnimationFrame(drawPart3);
    };
    drawPart3();

    // Handle Window Resize
    const handleResize = () => {
      resizeC1();
      resizeC2();
      resizeC3();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId1);
      cancelAnimationFrame(animId2);
      cancelAnimationFrame(animId3);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="bg-white border border-zinc-250 p-6 rounded-sm shadow-sm space-y-6">
      <div className="text-center space-y-1 pb-4 border-b border-zinc-200">
        <h3 className="text-xs font-bold text-zinc-900 font-mono tracking-widest uppercase">
          🌌 공간 진동 역학 3연작 (The Spatial Vibration Trilogy)
        </h3>
        <p className="text-[11px] text-zinc-500 font-serif">
          프랙탈 척도 대칭성으로 관통하는 미시 양자 세계와 거시 우주의 통합 기하역학
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Part 1 */}
        <div className="border border-zinc-200 p-4 rounded-sm flex flex-col justify-between space-y-4 hover:shadow transition-shadow relative overflow-hidden bg-zinc-50/50">
          <div className="space-y-2">
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
              Part I: 미시 양자 세계
            </span>
            <h4 className="text-sm font-bold text-zinc-950 font-serif leading-tight">
              파동-입자 이중성의 기하학
            </h4>
            <p className="text-[11px] text-zinc-650 leading-relaxed text-justify font-serif">
              전자는 유령 같은 확률 구름이 아니라 공간 자체가 찰랑거리며 입자의 경로를 유도(Guidance)하는 실체입니다. 관측 장비가 공간에 일으키는 열역학적 노이즈(위상 난류)가 궤적을 흩트려 결어긋남을 유발합니다.
            </p>
          </div>
          <div className="bg-zinc-950 text-amber-400 p-2.5 rounded border border-zinc-800 font-mono text-[10px] text-center">
            {"i\u210f(\u2202\u03c8/\u2202t) = [H\u2080 + \u03b3(S - \u27e8S\u27e9)]\u03c8"}
          </div>
          <div className="relative rounded overflow-hidden border border-zinc-200 aspect-[8/5]">
            <canvas ref={canvas1Ref} className="w-full h-full block bg-black" />
            <div className="absolute bottom-1.5 left-0 w-full text-center text-[8px] text-zinc-500 font-mono">
              Simulation: 공간 파도를 타는 입자
            </div>
          </div>
        </div>

        {/* Part 2 */}
        <div className="border border-zinc-200 p-4 rounded-sm flex flex-col justify-between space-y-4 hover:shadow transition-shadow relative overflow-hidden bg-zinc-50/50">
          <div className="space-y-2">
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              Part II: 거시 은하 세계
            </span>
            <h4 className="text-sm font-bold text-zinc-950 font-serif leading-tight">
              통합 암흑 유체 상전이
            </h4>
            <p className="text-[11px] text-zinc-650 leading-relaxed text-justify font-serif">
              은하 내에 갇힌 미시 공간 진동이 잉여 중력으로 뭉친 상태가 <strong>암흑 물질</strong>이며, 텅 빈 보이드에서 응축되지 못하고 뿜어내는 팽창 척력이 <strong>암흑 에너지</strong>인 단일 카멜레온 텐서 유체 모델입니다.
            </p>
          </div>
          <div className="bg-zinc-950 text-amber-400 p-2.5 rounded border border-zinc-800 font-mono text-[10px] text-center">
            {"G_\u03bc\u03bd = (8\u03c0G/c\u2074)(T_\u03bc\u03bd + Ṽ_\u03bc\u03bd)"}
          </div>
          <div className="relative rounded overflow-hidden border border-zinc-200 aspect-[8/5]">
            <canvas ref={canvas2Ref} className="w-full h-full block bg-black" />
            <div className="absolute bottom-1.5 left-0 w-full text-center text-[8px] text-zinc-500 font-mono">
              Simulation: 텐서 응축(녹색)과 척력 발산(적색)
            </div>
          </div>
        </div>

        {/* Part 3 */}
        <div className="border border-zinc-200 p-4 rounded-sm flex flex-col justify-between space-y-4 hover:shadow transition-shadow relative overflow-hidden bg-zinc-50/50">
          <div className="space-y-2">
            <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-800 border border-purple-200 font-mono">
              Part III: 초거시 우주 구조
            </span>
            <h4 className="text-sm font-bold text-zinc-950 font-serif leading-tight">
              우주 공간 판구조론과 FRB
            </h4>
            <p className="text-[11px] text-zinc-650 leading-relaxed text-justify font-serif">
              우주는 위상이 다른 여러 공간 판들의 파동 간섭 지형선입니다. 판 경계면의 엇갈림 응력이 임계 한계를 돌파할 때 터지는 <strong>우주 지진</strong>이 플라즈마 자기장과 공명(게르첸슈타인)하여 고속 전파 폭발(FRB)로 변환됩니다.
            </p>
          </div>
          <div className="bg-zinc-950 text-amber-400 p-2.5 rounded border border-zinc-800 font-mono text-[10px] text-center font-bold">
            {"P_quake \u221d \u222b exp((||S_\u03bc\u03bd|| - S_c)/\u03b1)"}
          </div>
          <div className="relative rounded overflow-hidden border border-zinc-200 aspect-[8/5]">
            <canvas ref={canvas3Ref} className="w-full h-full block bg-black" />
            <div className="absolute bottom-1.5 left-0 w-full text-center text-[8px] text-zinc-500 font-mono">
              Simulation: 우주 지진 및 FRB 방출
            </div>
          </div>
        </div>
      </div>

      {/* Quote Footer banner */}
      <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-sm text-center">
        <p className="text-xs md:text-sm font-serif italic text-zinc-300 leading-relaxed">
          "본 연구 연작은 미시 세계의 <span className="text-[#fbbf24] font-bold">이중 슬릿 간섭 무늬</span>부터 초거시 척도의 <span className="text-[#fbbf24] font-bold">우주 거미줄 필라멘트</span>에 이르기까지 관통하는 프랙탈적 척도 대칭성을 제안합니다. 이는 우주의 다양한 현상들이 단 하나의 기하학적 파동 원리에 의해 설명될 수 있음을 시사하는 일관된 역학적 모델입니다."
        </p>
      </div>
    </div>
  );
};
