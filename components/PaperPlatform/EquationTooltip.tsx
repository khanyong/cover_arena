import React, { useState } from 'react';

interface TooltipDetail {
  title: string;
  unit: string;
  description: { ko: string; en: string };
}

const symbolDictionary: Record<string, TooltipDetail> = {
  'Qs': {
    title: '공간 진동 퍼텐셜 (Spatial Vibration Potential)',
    unit: 'J (Joules) 또는 m²kg/s²',
    description: {
      ko: '배경 공간 매질의 기하학적 곡률 분포 $∇²R/R$에 의해 공간 자체적으로 정의되는 유도 에너지 장입니다. 입자를 파동성이 형성하는 골짜기(valley)로 유도합니다.',
      en: 'The guide energy field defined by the spatial geometry curvature $∇²R/R$. It repels and steers the physical particle along spatial wave valleys.'
    }
  },
  'hbar': {
    title: '디랙 상수 (Reduced Planck Constant / Dirac Constant)',
    unit: '1.054571817 × 10⁻³⁴ J·s',
    description: {
      ko: '양자 동역학적 행위를 지배하는 최소 단위 에너지 물리 상수로, 플랑크 상수를 $2\\pi$로 나눈 값입니다.',
      en: 'A fundamental physical constant describing the quantum scale of action, defined as Planck\'s constant divided by $2\\pi$.'
    }
  },
  'm': {
    title: '입자의 질량 (Inertial Mass of Particle)',
    unit: 'kg (Kilograms) 또는 a.u.',
    description: {
      ko: '입자의 물질적 고유 질량입니다. 공간 진동 가설에서 질량은 공간 척력에 저항하는 관성의 척도이자 결합 상수를 정합니다.',
      en: 'The physical inertial mass of the particle. In our model, mass measures resistance to spatial vibrational guidance forces.'
    }
  },
  'LaplacianR': {
    title: '기하학 곡률 라플라시안 (Laplacian of Spatial Amplitude)',
    unit: 'm⁻²',
    description: {
      ko: '공간 요동 진폭 $R$의 공간 2차 편미분 형태로, 배경 공간이 국소적으로 뒤틀리고 요동치는 물리적 곡률 기울기를 나타냅니다.',
      en: 'The spatial second derivative of the vibration amplitude $R$, representing local spatial curvature and topographic warping.'
    }
  },
  'R': {
    title: '곡률 진폭 (Curvature/Vibration Amplitude)',
    unit: '무차원 상수 (Dimensionless)',
    description: {
      ko: '공간 진동파의 국소적 진폭 분포를 뜻하며, 파동 함수 극좌표 분해의 크기에 대응하는 물리량입니다.',
      en: 'The amplitude of the spatial vibration wave field, corresponding directly to the magnitude of the polar wave function.'
    }
  },
  'Eobs': {
    title: '관측 섭동 에너지 (Observation Perturbation Energy)',
    unit: 'GeV (Giga-electronvolts)',
    description: {
      ko: '거시계 관측 검출 장치가 미시 공간 진동 매질에 가하는 불가피한 타격 에너지 크기입니다.',
      en: 'The macroscopic energy emitted by detector equipment that strikes and disrupts the delicate background spatial medium.'
    }
  },
  'gamma': {
    title: '결맞음 감쇠 계수 (Decoherence Decay Factor)',
    unit: 's⁻¹ (Per Second)',
    description: {
      ko: '관측 섭동 에너지가 주어질 때 공간 진동이 지수적으로 붕괴하는 소실 반응 계수입니다.',
      en: 'The exponential attenuation coefficient determining the rate of spatial potential decay under external measurement.'
    }
  }
};

interface EquationTooltipProps {
  symbol: string;
  lang: 'ko' | 'en';
  children: React.ReactNode;
}

export const EquationTooltip: React.FC<EquationTooltipProps> = ({ symbol, lang, children }) => {
  const [visible, setVisible] = useState(false);
  const detail = symbolDictionary[symbol];

  if (!detail) return <span className="font-mono">{children}</span>;

  return (
    <span 
      className="relative inline-block cursor-help group"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="underline decoration-dotted decoration-blue-500 font-mono font-bold text-blue-400 hover:text-blue-300 transition-colors">
        {children}
      </span>

      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-zinc-900 border border-zinc-800 text-white rounded-xl p-4 shadow-2xl z-50 text-left block pointer-events-none transition-all scale-100 opacity-100">
          <span className="block text-xs font-bold text-blue-400 border-b border-zinc-800 pb-1 mb-2">
            {detail.title}
          </span>
          <span className="block text-[10px] font-mono text-zinc-400 mb-1.5">
            Unit: {detail.unit}
          </span>
          <span className="block text-xs text-zinc-300 leading-relaxed font-normal">
            {lang === 'ko' ? detail.description.ko : detail.description.en}
          </span>
          {/* Arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900 block w-0 h-0" />
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-[9px] border-transparent border-t-zinc-800 -z-10 block w-0 h-0" />
        </span>
      )}
    </span>
  );
};
