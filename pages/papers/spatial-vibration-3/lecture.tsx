import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import katex from 'katex';
import { SimulationWidget_V3 } from '../../../components/PaperPlatform/SimulationWidget_V3';

// Types for Slides
interface BulletPoint {
  type: 'bullet' | 'header' | 'sub-bullet' | 'text';
  ko: string;
  en: string;
}

interface Slide {
  id: number;
  period: '1교시' | '2교시' | '3교시' | '마무리';
  periodTitle: { ko: string; en: string };
  title: { ko: string; en: string };
  subtitle?: { ko: string; en: string };
  instructor?: { ko: string; en: string };
  acknowledgments?: { ko: string; en: string };
  bullets?: BulletPoint[];
  script: { ko: string; en: string };
  simMode?: 'web' | 'quake' | 'pointing' | null;
}

export default function SpatialVibration3Lecture() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'presentation'>('split'); // presenter view vs presentation only
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 minutes in seconds

  // Timer Ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Timer tick
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timeLeft]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  if (!mounted) return null;

  // Timetable definition
  const periods = [
    { 
      id: '1교시', 
      time: '00~50분', 
      titleKo: '우주 공간 판구조론과 우주 거대 구조', 
      titleEn: 'Spatial Plate Tectonics & Cosmic Web', 
      slides: [0, 6] 
    },
    { 
      id: '2교시', 
      time: '60~110분', 
      titleKo: '우주 지진학과 다중우주의 탄생', 
      titleEn: 'Cosmic Seismology & Multiverse Genesis', 
      slides: [7, 9] 
    },
    { 
      id: '3교시', 
      time: '120~170분', 
      titleKo: 'POINTING 예측 프로토콜과 3연작 총결론', 
      titleEn: 'POINTING Protocol & Trilogy Conclusion', 
      slides: [10, 11] 
    },
    { 
      id: '마무리', 
      time: '170~180분', 
      titleKo: 'Q&A 및 전체 시뮬레이션 시연', 
      titleEn: 'Q&A and Interactive Sandbox', 
      slides: [12, 12] 
    },
  ];

  // 13 Slides Database
  const slides: Slide[] = [
    {
      id: 1,
      period: '1교시',
      periodTitle: { ko: '우주 공간 판구조론과 우주 거대 구조', en: 'Spatial Plate Tectonics & Cosmic Web' },
      title: { ko: 'Mechanics of Spatial Vibration III', en: 'Mechanics of Spatial Vibration III' },
      subtitle: {
        ko: '우주 공간 판구조론과 파동 간섭 지형도',
        en: 'Cosmological Spatial Plate Tectonics and Wave Interference Topology'
      },
      instructor: {
        ko: '강사: 유광용 (KT 글로벌데이터서비스 담당 부장 / 경영학 박사 / LL.M.)',
        en: 'Instructor: Kwang Yong Yoo (Director at KT / Ph.D. / LL.M.)'
      },
      acknowledgments: {
        ko: 'AI 지원 연구 및 시뮬레이션 개발 지원: Gemini',
        en: 'AI-Assisted Research and Simulation Development Support: Gemini'
      },
      script: {
        ko: '3연작의 대미를 장식할 시간입니다. 우주가 빛보다 빨리 팽창하면서, 이 거대한 공간의 진동이 하나로 유지되지 못하고 쩍쩍 갈라지기 시작합니다. 은하 단위 너머, 관측 가능한 우주의 가장 거대한 구조와 다중우주의 탄생 기원까지 도달해보겠습니다.',
        en: 'Welcome to the grand finale of our trilogy. As the universe expands faster than light, these massive spatial fluctuations fail to synchronize, splitting into fragmented blocks. Today, we journey beyond galaxies to explore the largest structures of the observable universe and the genesis of the multiverse.'
      },
      simMode: null
    },
    {
      id: 2,
      period: '1교시',
      periodTitle: { ko: '우주 공간 판구조론과 우주 거대 구조', en: 'Spatial Plate Tectonics & Cosmic Web' },
      title: { ko: 'Instructor Introduction (강사 소개)', en: 'Instructor Introduction' },
      bullets: [
        { type: 'header', ko: '강사 정보 (Instructor Profile)', en: 'Instructor Profile' },
        { type: 'bullet', ko: '**유광용 (Kwang Yong Yoo, Ph.D. / LL.M.)**', en: '**Kwang Yong Yoo, Ph.D. / LL.M.**' },
        { type: 'bullet', ko: 'KT 글로벌데이터서비스 담당 부장 (Director, KT)', en: 'Director, Global Data Service at KT' },
        { type: 'header', ko: '주요 학력 (Education)', en: 'Education' },
        { type: 'bullet', ko: '연세대학교 일반대학원 경영학 박사 (기술경영 전공, 2009~2026)', en: 'Ph.D. in Business Administration (Technology Management), Yonsei University (2009–2026)' },
        { type: 'bullet', ko: '미국 코네티컷 대학교 로스쿨 법학석사 (LL.M, 2018)', en: 'LL.M. (Master of Laws), University of Connecticut School of Law (2018)' },
        { type: 'bullet', ko: '연세대학교 경영학 석사 (M.B.A) / 한양대학교 경영학 학사 (B.S.)', en: 'M.B.A., Yonsei University / B.S. in Business Administration, Hanyang University' },
        { type: 'header', ko: '연구 분야 및 핵심 성과 (Research & Achievements)', en: 'Research & Achievements' },
        { type: 'bullet', ko: '양자역학의 결정론적 기초 및 공간 진동 기하역학 (Geomechanical Foundations)', en: 'Deterministic Foundations of Quantum Mechanics & Spatial Vibration Geomechanics' },
        { type: 'bullet', ko: '"공간 진동 역학(The Mechanics of Spatial Vibration)" 3연작 저자', en: 'Author of "The Mechanics of Spatial Vibration" Trilogy' },
        { type: 'bullet', ko: '공식 Zenodo DOI: $10.5281/zenodo.21258029$', en: 'Official Zenodo DOI: $10.5281/zenodo.21258029$' }
      ],
      script: {
        ko: '3연작의 완결판인 이번 3부에서는, 1부의 미시 양자 세계와 2부의 암흑 섹터 모델을 종합하여 우주 거시 구조의 형성 원리인 공간 판구조론을 수립하고, 공간이 찢어지는 단층 파열(우주 지진)과 아기 우주의 탄생 원리를 제시합니다.',
        en: 'In this concluding volume, we combine the quantum guides of Part I and the dark fluid of Part II to construct a unified theory of spatial plate tectonics, explaining cosmic web structures, spacetime seismology, and multiverse genesis.'
      },
      simMode: null
    },
    {
      id: 3,
      period: '1교시',
      periodTitle: { ko: '우주 공간 판구조론과 우주 거대 구조', en: 'Spatial Plate Tectonics & Cosmic Web' },
      title: { ko: 'Course Overview & Index (목차)', en: 'Course Overview & Index' },
      bullets: [
        { type: 'bullet', ko: '1. **위상 동기화의 한계:** 광속 가속 팽창과 우주의 파편화', en: '1. **Synchronization Limits:** Cosmic Expansion and Spacetime Fragmentation' },
        { type: 'bullet', ko: '2. **우주 공간 판구조론:** 시공간 위상 블록들과 단층대의 형성', en: '2. **Spatial Plate Tectonics:** Spacetime Phase Domains and Fault Lines' },
        { type: 'bullet', ko: '3. **파동 간섭 지형도 - 거대 공동:** 상쇄 간섭에 의한 유체 유출', en: '3. **Void Formation:** Destructive Wave Interference and Drift Outflow' },
        { type: 'bullet', ko: '4. **파동 간섭 지형도 - 우주 거미줄:** 보강 간섭에 의한 필라멘트 형성', en: '4. **The Cosmic Web:** Constructive Wave Interference and Filament Accretion' },
        { type: 'bullet', ko: '5. **우주 지진학과 전조 현상:** 위상 고정과 배경 중력파(SGWB)의 실체', en: '5. **Cosmic Seismology:** Phase-Locking and the Stochastic Gravitational Background' },
        { type: 'bullet', ko: '6. **고속 전파 폭발(FRB):** 게르첸슈타인 효과와 중력파의 전자기파 변환', en: '6. **Fast Radio Bursts (FRBs):** Gertsenshtein Effect and Wave Conversion' },
        { type: 'bullet', ko: '7. **다중우주의 탄생:** 위상 탯줄과 거시적 절단 메커니즘', en: '7. **Multiverse Genesis:** Topological Pinch-off and Baby Universes' },
        { type: 'bullet', ko: '8. **POINTING 프로토콜:** 우주 지진 및 FRB 조기 탐지 인공신경망 예측 방법론', en: '8. **POINTING Protocol:** Machine Learning Early Warning for Spacetime Ruptures' }
      ],
      script: {
        ko: '오늘 다룰 강의안의 주요 구성입니다. 우주가 거대하게 나뉘며 발생하는 위상학적 경계(단층대)에서 어떻게 Cosmic Web과 Cosmic Voids가 탄생하는지, 그리고 이 판들이 부딪혀 찢어질 때 발생하는 우주 지진(배경 중력파와 FRB) 및 다중우주의 기원을 수학적으로 다루겠습니다.',
        en: 'Here is the outline. We will study how topological phase boundaries form the Cosmic Web and Cosmic Voids, and analyze the physical mechanisms of cosmic quakes (background gravitational waves, FRBs) and baby universe branching.'
      },
      simMode: null
    },
    {
      id: 4,
      period: '1교시',
      periodTitle: { ko: '우주 공간 판구조론과 우주 거대 구조', en: 'Spatial Plate Tectonics & Cosmic Web' },
      title: { ko: 'The Phase-Synchronization Challenge (위상 동기화의 한계)', en: 'The Phase-Synchronization Challenge' },
      bullets: [
        { type: 'header', ko: '인과율의 한계 (Causality Limits)', en: 'Causality Limits' },
        { type: 'bullet', ko: '우주는 빛보다 빠른 속도로 가속 팽창(Accelerated expansion)하고 있음.', en: 'The universe undergoes accelerated expansion, with distant regions receding faster than light.' },
        { type: 'bullet', ko: '우주 반대편에 있는 두 구역은 광속의 한계로 인해 서로 정보와 위상을 정렬하는 신호를 주고받을 수 없음.', en: 'Vast distances prevent physical signals from exchanging information to align local phase angles.' },
        { type: 'header', ko: '위상의 파편화 (Topological Domains)', en: 'Phase Fragmentation' },
        { type: 'bullet', ko: '결과적으로 전체 우주가 단 하나의 공간 진동 위상(Uniform coherence)을 유지하는 것은 불가능함.', en: 'Consequently, the global universe cannot maintain a uniform phase coherence.' },
        { type: 'bullet', ko: '우주는 각자 독립적인 공간 진동 위상($\\theta_i$)을 갖는 수없이 많은 **Topological Domains (위상 도메인)**으로 쪼개지게 됨.', en: 'Instead, space breaks into distinct topological domains, each with a localized phase angle ($\\theta_i$).' }
      ],
      script: {
        ko: '우주가 빛보다 빠르게 팽창하면서, 멀리 떨어진 두 공간은 더 이상 서로의 흔들림을 동기화할 수 없게 됩니다. 우주 진동의 통일성이 깨지고 쩍쩍 갈라져 독립된 블록들이 되는 것입니다.',
        en: 'As the expansion exceeds the speed of light, distant spatial regions lose the physical ability to coordinate their fluctuations. Uniform coherence breaks down, fragmenting space into independent blocks.'
      },
      simMode: 'web'
    },
    {
      id: 5,
      period: '1교시',
      periodTitle: { ko: '우주 공간 판구조론과 우주 거대 구조', en: 'Spatial Plate Tectonics & Cosmic Web' },
      title: { ko: 'Cosmological Spatial Plate Tectonics (우주 공간 판구조론)', en: 'Cosmological Spatial Plate Tectonics' },
      bullets: [
        { type: 'header', ko: '공간 판 (Spatial Plates)', en: 'Spatial Plates' },
        { type: 'bullet', ko: '내부적으로는 균일한 공간 진동 위상($\\theta_i$)을 지니지만, 이웃 판과는 다른 위상을 가진 거대한 시공간 블록 (지구의 지각판에 대응).', en: 'Vast spacetime blocks sharing a uniform local phase angle ($\\theta_i$) internally, but mismatched with neighbors (akin to tectonic plates).' },
        { type: 'header', ko: '공간 단층대 (Spatial Fault Lines, $\\Sigma_{1,2}$)', en: 'Spatial Fault Lines' },
        { type: 'bullet', ko: '서로 다른 위상의 공간 판들이 맞부딪히며 엄청난 기하학적 마찰과 텐션이 축적되는 위상 경계 지역.', en: 'Topological boundaries where phase-mismatched plates grind against each other, building geometric shear stress.' },
        { type: 'header', ko: '기하학적 응력 텐서 (Stress Tensor)', en: 'Geometrical Stress Tensor' },
        { type: 'bullet', ko: '$$ S_{\\mu\\nu} \\propto \\rho_{\\mathrm{vib}} c^2 L_c^2 \\left( \\nabla_\\mu(\\Delta\\theta) \\nabla_\\nu(\\Delta\\theta) - \\frac{1}{2} g_{\\mu\\nu} |\\nabla(\\Delta\\theta)|^2 \\right) $$', en: '$$ S_{\\mu\\nu} \\propto \\rho_{\\mathrm{vib}} c^2 L_c^2 \\left( \\nabla_\\mu(\\Delta\\theta) \\nabla_\\nu(\\Delta\\theta) - \\frac{1}{2} g_{\\mu\\nu} |\\nabla(\\Delta\\theta)|^2 \\right) $$' },
        { type: 'bullet', ko: '$\\Delta\\theta$: 두 판 사이의 위상 불일치 각도. 단층대 주변에 기하학적 응력 유도.', en: '$\\Delta\\theta$: The phase discordance. Generates geometric shear energy density near boundary walls.' }
      ],
      script: {
        ko: '지구 표면이 여러 판으로 나뉘어 지진을 일으키듯, 3차원 우주 공간 역시 거대한 블록들로 나뉘어 서로 부딪히고 긁힙니다. 그 긴장도를 수학적으로 유도해 낸 것이 바로 위 방정식입니다.',
        en: 'Just as Earth\'s crust is divided into tectonic plates that cause earthquakes, 3D space itself is divided into massive phase domains that grind against one another. This equation describes the shear stress built at these boundaries.'
      },
      simMode: 'quake'
    },
    {
      id: 6,
      period: '1교시',
      periodTitle: { ko: '우주 공간 판구조론과 우주 거대 구조', en: 'Spatial Plate Tectonics & Cosmic Web' },
      title: { ko: 'Wave Interference Topology - Voids (거대 공동의 탄생)', en: 'Wave Interference Topology - Voids' },
      bullets: [
        { type: 'header', ko: '위상 상쇄 간섭 (Destructive Interference)', en: 'Destructive Interference' },
        { type: 'bullet', ko: '두 이웃 판의 위상이 정반대($\\Delta\\theta \\approx \\pi$)일 때, 경계면에서 공간 진동파가 완전히 상쇄됨.', en: 'When adjacent plates are out-of-phase ($\Delta\theta \approx \pi$), their spatial vibrations undergo destructive interference.' },
        { type: 'header', ko: '유체역학적 재분배 (Hydrodynamic Drift)', en: 'Hydrodynamic Drift' },
        { type: 'bullet', ko: '파동 에너지는 물리적으로 소멸하지 않고, 연속 방정식에 따라 기하 압력이 낮은 외곽 방향으로 유동 물질을 밀어냄:', en: 'Vibrational energy conservation drives a hydrodynamic drift of matter away from destructive centers:' },
        { type: 'bullet', ko: '$$ \\nabla_\\lambda \\left( \\rho_{\\mathrm{vib}} u^\\lambda_{\\mathrm{drift}} \\right) = 0 $$', en: '$$ \\nabla_\\lambda \\left( \\rho_{\\mathrm{vib}} u^\\lambda_{\\mathrm{drift}} \\right) = 0 $$' },
        { type: 'bullet', ko: '에너지 밀도가 바깥으로 유출되며, 물질이 존재할 수 없는 수억 광년 크기의 텅 빈 **우주 거대 공동 (Cosmic Voids)**을 조각함.', en: 'This drift drains matter out of the interference zones, carving empty voids across hundreds of millions of light-years.' }
      ],
      script: {
        ko: '진동의 위상이 반대여서 흔들림이 상쇄되는 곳에서는 시공간의 기하학적 압력이 발생합니다. 그 압력이 물질들을 사방으로 밀어내어, 우주에서 가장 거대한 구멍인 거대 공동(Void)을 만들게 됩니다.',
        en: 'Where spatial vibrations cancel each other out, localized geometric pressures rise. This pressure expels matter outward, carving out the massive, empty cosmic voids.'
      },
      simMode: 'web'
    },
    {
      id: 7,
      period: '1교시',
      periodTitle: { ko: '우주 공간 판구조론과 우주 거대 구조', en: 'Spatial Plate Tectonics & Cosmic Web' },
      title: { ko: 'Constructive Interference - Cosmic Web (우주 거미줄)', en: 'Constructive Interference - Cosmic Web' },
      bullets: [
        { type: 'header', ko: '위상 보강 간섭 (Constructive Interference)', en: 'Constructive Interference' },
        { type: 'bullet', ko: '두 판의 위상이 일치하여 포개지는 곳($\\Delta\\theta \\approx 0$)에서는 진동 에너지가 폭발적으로 보강 증폭됨.', en: 'Where spatial vibrations align and superpose ($\Delta\theta \approx 0$), fluctuation energy is amplified constructively.' },
        { type: 'header', ko: '필라멘트 형성 (Filament Formation)', en: 'Filament Formation' },
        { type: 'bullet', ko: '진동의 폭이 커진 곳은 에너지가 농축되므로, 아인슈타인 방정식에 따라 강력한 유효 인력(Surplus gravity)을 행사하게 됨.', en: 'Amplified wave crests represent higher localized energy densities, generating surplus gravitational attraction.' },
        { type: 'bullet', ko: '이 잉여 중력 띠가 주변의 모든 은하들을 강력히 잡아당겨 우주에서 가장 거대한 물질 그물망인 **우주 거미줄 필라멘트(Cosmic Web Filaments)**를 정밀하게 직조함.', en: 'These gravity troughs pull in galaxies, weaving them into the web of filaments that forms the skeleton of the universe.' }
      ],
      script: {
        ko: '정말 놀랍지 않습니까? 미시 세계의 이중 슬릿에서 보았던 파동 간섭 무늬가, 이제 억 광년 스케일의 우주에서 프랙탈처럼 똑같이 나타나 우주의 지형도를 조각해 낸 것입니다.',
        en: 'Isn\'t it spectacular? The same wave interference patterns we observed in double-slit experiments at the quantum scale manifest here at megaparsec scales, sculpting the skeleton of the cosmos.'
      },
      simMode: 'web'
    },
    {
      id: 8,
      period: '2교시',
      periodTitle: { ko: '우주 지진학과 다중우주의 탄생', en: 'Cosmic Seismology & Multiverse Genesis' },
      title: { ko: 'Cosmic Quakes & Foreshocks (우주 지진과 전조 현상)', en: 'Cosmic Quakes & Foreshocks' },
      bullets: [
        { type: 'header', ko: '위상 잠금 (Phase Locking)', en: 'Phase Locking' },
        { type: 'bullet', ko: '서로 다른 판이 마찰하며 지나갈 때, 위상이 엇갈린 채로 꽉 물려 찢어지지 않는 탄성 응력(Elastic stress) 상태 도달.', en: 'Grinding phase domains become locked in a state of high friction, building up tremendous elastic stress.' },
        { type: 'header', ko: '전조 지진 (Foreshocks - nHz 배경 중력파)', en: 'Foreshocks (nHz Gravitational Waves)' },
        { type: 'bullet', ko: '단층 경계면이 긁히며 내는 극초저주파(nHz 대역) 시공간 미세 진동 방출.', en: 'As boundaries grind, they emit ultra-low-frequency (nanohertz) spacetime ripples.' },
        { type: 'bullet', ko: '$\to$ 이것이 최근 전 세계 펄사 타이밍 배열(PTA) 관측 연합이 감지한 **확률론적 배경 중력파(SGWB)**의 물리학적 실체!', en: 'This is the source of the Stochastic Gravitational Wave Background (SGWB) recently detected by global Pulsar Timing Arrays (PTA).' },
        { type: 'header', ko: '본진 (Main Quake - 시공간 파열)', en: 'Main Quake (Topological Rupture)' },
        { type: 'bullet', ko: '응력이 시공간 탄성 한계($S_{crit}$)를 넘으면 단층이 순간적으로 찢어지며 초고주파(GHz 대역) 중력파가 폭발적으로 분출됨.', en: 'Once shear stress breaches the critical threshold ($S_{crit}$), the spatial fault snaps, releasing high-frequency (GHz) gravitational pulses.' }
      ],
      script: {
        ko: '시공간 판이 긁히며 내는 비명소리가 바로 최근 발견된 나노헤르츠 배경 중력파입니다. 그리고 이 긴장이 임계를 넘어가 공간이 찢어지는 본진이 발생하면 기가헤르츠 대역의 초강력 중력 펄스가 방출됩니다.',
        en: 'The groaning noise of grinding spacetime plates is what we detect as nanohertz background gravitational waves. When the tension exceeds critical limits, the plate ruptures, emitting a gigahertz gravitational pulse.'
      },
      simMode: 'quake'
    },
    {
      id: 9,
      period: '2교시',
      periodTitle: { ko: '우주 지진학과 다중우주의 탄생', en: 'Cosmic Seismology & Multiverse Genesis' },
      title: { ko: 'FRBs & The Gertsenshtein Effect (FRB의 전자기적 변환)', en: 'FRBs & The Gertsenshtein Effect' },
      bullets: [
        { type: 'header', ko: '고속 전파 폭발 (Fast Radio Bursts - FRB)의 난제', en: 'The Fast Radio Burst (FRB) Mystery' },
        { type: 'bullet', ko: '밀리초(ms) 단위의 짧은 시간 동안 태양 수만 년 치의 에너지를 쏟아내는 정체불명의 고속 전파 버스트.', en: 'Unexplained millisecond radio pulses releasing energies equivalent to tens of thousands of years of solar output.' },
        { type: 'header', ko: '게르첸슈타인 효과 (Gertsenshtein Effect)', en: 'The Gertsenshtein Effect' },
        { type: 'bullet', ko: '강력한 정자기장 환경 속을 고주파 중력파가 통과하면, 중력파가 전자기파(광자)로 변환되는 물리 메커니즘.', en: 'A physical mechanism where high-frequency gravitational waves propagating through static magnetic fields convert into electromagnetic waves.' },
        { type: 'header', ko: '우주 지진 모델에 의한 FRB 규명', en: 'Cosmic Quake Origin of FRBs' },
        { type: 'bullet', ko: '우주 지진(Main quake)으로 터져 나온 대용량 기가헤르츠 중력파가 은하 사이의 성간 플라즈마 자기장 영역을 통과할 때, **순식간에 전파 광자로 강제 변환된 것**이 FRB의 실체.', en: 'High-frequency gravitational quakes passing through intergalactic plasma magnetic fields convert directly into radio photons, appearing to us as FRBs.' }
      ],
      script: {
        ko: '우주 공간의 단층이 부러질 때 나오는 에너지가 자기장을 만나 전자기파로 변환되어 우리에게 도달하는 것, 그것이 바로 FRB의 정체입니다.',
        en: 'The energy released when a spacetime fault ruptures is converted into electromagnetic waves when it encounters cosmic magnetic fields, reaching our telescopes as FRBs.'
      },
      simMode: 'quake'
    },
    {
      id: 10,
      period: '2교시',
      periodTitle: { ko: '우주 지진학과 다중우주의 탄생', en: 'Cosmic Seismology & Multiverse Genesis' },
      title: { ko: 'Extreme Rupture & Multiverse Genesis (다중우주의 탄생)', en: 'Extreme Rupture & Multiverse Genesis' },
      bullets: [
        { type: 'header', ko: '거시적 위상 절단 (Topological Pinch-off)', en: 'Topological Pinch-off' },
        { type: 'bullet', ko: '공간 단층대의 비틀림 에너지가 고전 시공간이 버틸 수 있는 임계를 완전히 초과하여, 공간 판 자체가 물리적으로 찢겨 나가는 극한 단절 현상.', en: 'When boundary energy density exceeds classical spacetime capacity, the spatial plate physically ruptures and pinches off.' },
        { type: 'header', ko: '위상 블랙홀 탯줄 (Topological Black Hole Cord)', en: 'Topological Black Hole Cord' },
        { type: 'bullet', ko: '공간이 잘려나갈 때 특이점 파국을 막기 위해 플랑크 스케일 상전이가 일어나며, 잘려나간 조각과 본 우주를 잇는 닫힌 웜홀 구조의 탯줄 형성.', en: 'To prevent singularity collapse, a Planck-scale phase transition constructs a closed topological black hole cord between the bubble and parent space.' },
        { type: 'header', ko: '아기 우주의 독립과 다중우주 (Multiverse)', en: 'Multiverse Genesis' },
        { type: 'bullet', ko: '탯줄이 끊어지며 찢겨 나간 거대한 공간 버블은 본 우주와의 연결이 완전히 단절된 채 독자적인 급팽창을 개시함 $\to$ 독립된 **아기 우주의 탄생**.', en: 'The umbilical cord pinches off, freeing the bubble to initiate its own inflationary expansion as an independent baby universe.' }
      ],
      script: {
        ko: '위상 응력이 너무 강하면 공간 판 자체가 물리적으로 찢겨 나갑니다. 이 찢겨 나간 거대한 위상 거품은 본 우주와 연결이 끊어지고 독립적 팽창을 시작하며 새로운 아기 우주, 즉 다중우주를 창발하게 됩니다.',
        en: 'If topological stress is too high, the spacetime plate itself tears. This severed bubble, disconnecting from the parent space, starts its own inflation, giving birth to a new baby universe in the multiverse.'
      },
      simMode: 'quake'
    },
    {
      id: 11,
      period: '3교시',
      periodTitle: { ko: 'POINTING 예측 프로토콜과 3연작 총결론', en: 'POINTING Protocol & Trilogy Conclusion' },
      title: { ko: 'The POINTING Predictive Protocol (예측 관측 프로토콜)', en: 'The POINTING Predictive Protocol' },
      bullets: [
        { type: 'header', ko: '프로토콜의 명칭과 원리', en: 'Protocol Definition' },
        { type: 'bullet', ko: '**POINTING:** Phasic Observation & Interferometric Network for Tensor-field Induced Neural Gravitational-signals.', en: '**POINTING:** Phasic Observation & Interferometric Network for Tensor-field Induced Neural Gravitational-signals.' },
        { type: 'header', ko: '예측 메커니즘 (Step-by-Step)', en: 'Predictive Mechanism' },
        { type: 'bullet', ko: '1. PTA(펄사 타이밍 배열) 간섭계를 이용해 공간 단층대의 미세 긁힘음인 나노헤르츠 배경 중력파(SGWB) 실시간 모니터링.', en: '1. Monitor nanohertz background gravitational waves (SGWB) from faults using Pulsar Timing Arrays.' },
        { type: 'bullet', ko: '2. 수집된 중력파 위상 데이터를 기계학습 신경망에 입력하여 단층 파열(우주 지진) 확률 계산:', en: '2. Feed phase data into neural network to calculate rupture probability:' },
        { type: 'bullet', ko: '$$ P_{\\mathrm{quake}}(x,y,z, t) \\propto \\int_{0}^{t} \\exp\\left( \\frac{| S_{\\mu\\nu} | - S_{\\mathrm{crit}}}{\\alpha} \\right) dt\' $$', en: '$$ P_{\\mathrm{quake}}(x,y,z, t) \\propto \\int_{0}^{t} \\exp\\left( \\frac{| S_{\\mu\\nu} | - S_{\\mathrm{crit}}}{\\alpha} \\right) dt\' $$' },
        { type: 'bullet', ko: '3. 파열 확률이 임계에 도달하면 본진 직전(밀리초 전)에 전파 망원경들을 예측된 좌표로 **선제 지향(Pointing)**하여, 중력파가 전자기파로 번쩍 변환되는 FRB 발생 현상을 포착 및 검증.', en: '3. Trigger radio telescope arrays to point at the predicted coordinates before the rupture, capturing the Gertsenshtein conversion (FRB) live.' }
      ],
      script: {
        ko: '이 이론을 실험적으로 검증하기 위한 프로토콜입니다. 펄사 배열이 보내오는 저주파 진동을 인공지능이 분석하여 지진 발생 직전에 전파 망원경을 선제적으로 조준하여 대기합니다. 이를 통해 지진과 동시에 터지는 FRB를 포착하여 이론을 반증할 것입니다.',
        en: 'This protocol tests our theory. A neural network analyzes low-frequency ripples from pulsar arrays, calculating rupture probabilities. By pointing radio telescopes at predicted coordinates ahead of time, we can capture the birth of an FRB.'
      },
      simMode: 'pointing'
    },
    {
      id: 12,
      period: '3교시',
      periodTitle: { ko: 'POINTING 예측 프로토콜과 3연작 총결론', en: 'POINTING Protocol & Trilogy Conclusion' },
      title: { ko: 'Conclusion of the Trilogy (공간 진동 3연작 총결론)', en: 'Conclusion of the Trilogy' },
      bullets: [
        { type: 'header', ko: '1. 프랙탈 척도 대칭성 (Fractal Scale Symmetry)', en: '1. Fractal Scale Symmetry' },
        { type: 'bullet', ko: '미시 세계의 이중 슬릿 회절 무늬와 초거시 우주의 거미줄 필라멘트 및 거대 공동은 본질적으로 대칭적이다. 우주는 단 하나의 \'결정론적 기하역학\' 원리로 작동한다.', en: 'The double-slit interference of the micro-world and the cosmic web of the macro-world are symmetric. Nature operates on a single deterministic geomechanical principle.' },
        { type: 'header', ko: '2. 물리적 유령들의 배제 (Elimination of Ghosts)', en: '2. Elimination of Ghosts' },
        { type: 'bullet', ko: '양자역학의 확률 해석, 암흑 물질, 암흑 에너지라는 현대 물리학의 가상 유령 입자들을 배제하고, 시공간 텐서의 파동 동역학으로 완벽히 대체.', en: 'Eliminates mathematical ghosts—quantum probability, dark matter particles, dark energy constants—replacing them with spacetime wave mechanics.' },
        { type: 'header', ko: '최종 메시지 (The Final Message)', en: 'The Final Message' },
        { type: 'bullet', ko: '*"우주는 주사위 놀이를 하지 않으며, 알 수 없는 유령 입자나 마법에 의존하지 않습니다. 입자와 은하들은 시공간 텐서가 연주하는 결정론적 굴곡을 따라 항해할 뿐입니다."*', en: '*"The universe does not play dice, nor does it rely on magical entities. Particles and galaxies simply sail along the deterministic curves generated by the spacetime tensor."*' }
      ],
      script: {
        ko: '공간 진동 역학 3연작의 결론입니다. 우주는 주사위 놀이를 하지 않으며, 알 수 없는 유령 입자나 마법에 의존하지 않습니다. 미시 입자부터 은하단까지 모두 시공간의 텐서가 연주하는 결정론적 굴곡을 항해할 뿐입니다.',
        en: 'This is the final conclusion of our trilogy. The universe does not play dice, nor does it rely on invisible ghosts. From microscopic electrons to giant galaxy clusters, all entities sail along the deterministic paths paved by the spacetime tensor.'
      },
      simMode: null
    },
    {
      id: 13,
      period: '마무리',
      periodTitle: { ko: 'Q&A 및 전체 시뮬레이션 시연', en: 'Q&A and Interactive Sandbox' },
      title: { ko: 'Q&A and Interactive Sandbox (질의응답 및 시뮬레이션)', en: 'Q&A and Interactive Sandbox' },
      bullets: [
        { type: 'header', ko: '질의응답 (Q&A Session)', en: 'Q&A Session' },
        { type: 'bullet', ko: '공간 판구조론, 거대 구조, 우주 지진 및 POINTING 프로토콜에 관한 질문을 환영합니다.', en: 'Welcome any questions regarding spatial tectonics, cosmic web structure, cosmic quakes, or POINTING protocols.' },
        { type: 'header', ko: '시뮬레이터 작동 시연', en: 'Sandbox Demonstration' },
        { type: 'bullet', ko: '오른쪽 샌드박스를 조작하여 판의 위상 불일치에 따른 Cosmic Web/Void 형성 및 판의 마찰 속도에 따른 중력파/FRB 지진 폭발 전조 현상을 가시화해 볼 수 있습니다.', en: 'In the right sandbox, adjust phase mismatch and slip velocity to simulate cosmic web formation and watch the rupture triggers.' },
        { type: 'bullet', ko: '🔗 **공식 DOI:** [10.5281/zenodo.21258029](https://doi.org/10.5281/zenodo.21258029)', en: '🔗 **Official DOI:** [10.5281/zenodo.21258029](https://doi.org/10.5281/zenodo.21258029)' }
      ],
      script: {
        ko: '이것으로 3연작 특강 세미나를 모두 마칩니다. 참석해 주셔서 대단히 감사합니다. 질문 있으신 분들은 편하게 말씀해 주시고, 샌드박스의 위상 어긋남과 슬립 속도를 변경해가며 우주 거미줄 보강 간섭과 지진 파열 트리거를 시연해 드리겠습니다.',
        en: 'This concludes our seminar trilogy. Thank you very much for your time. Please feel free to ask questions while I demonstrate plate boundaries, cosmic web interference, and seismic rupture triggers.'
      },
      simMode: 'web'
    }
  ];

  const currentSlide = slides[currentSlideIndex];

  // Formatting helper for time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigations
  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  // Inline/Block Math Parser with KaTeX
  const renderTextWithMath = (text: string) => {
    if (!text) return '';

    // First split block equations $$ ... $$
    const blockParts = text.split('$$');
    if (blockParts.length > 1) {
      return blockParts.map((part, index) => {
        if (index % 2 === 1) {
          try {
            const html = katex.renderToString(part.trim(), { displayMode: true, throwOnError: false });
            return (
              <div 
                key={`block-${index}`} 
                className="my-2 p-2.5 bg-zinc-900/60 rounded border border-zinc-800 overflow-x-auto text-center font-serif text-sm md:text-base text-amber-150" 
                dangerouslySetInnerHTML={{ __html: html }} 
              />
            );
          } catch (e) {
            return <pre key={`block-err-${index}`} className="text-red-500 font-mono text-[10px]">{part}</pre>;
          }
        } else {
          return <span key={`text-inline-${index}`}>{renderInlineMath(part)}</span>;
        }
      });
    }

    return renderInlineMath(text);
  };

  const renderInlineMath = (text: string) => {
    const parts = text.split('$');
    if (parts.length === 1) {
      return renderMarkdownText(text);
    }
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        try {
          const html = katex.renderToString(part, { displayMode: false, throwOnError: false });
          return <span key={`inline-math-${index}`} className="font-mono text-amber-200 px-1 inline-block" dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          return <span key={`inline-err-${index}`} className="text-red-400 font-mono text-[11px]">{part}</span>;
        }
      }
      return <span key={`inline-text-${index}`}>{renderMarkdownText(part)}</span>;
    });
  };

  const renderMarkdownText = (text: string) => {
    const boldParts = text.split('**');
    if (boldParts.length === 1) return text;
    return boldParts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={`bold-${idx}`} className="text-amber-400 font-bold">{part}</strong>;
      }
      return part;
    });
  };

  const isPeriodActive = (p: typeof periods[0]) => {
    return currentSlideIndex >= p.slides[0] && currentSlideIndex <= p.slides[1];
  };

  return (
    <div className="h-screen max-h-screen bg-[#09090b] text-zinc-200 selection:bg-[#8b1a1a]/30 selection:text-[#ff9b9b] font-sans antialiased flex flex-col overflow-hidden">
      <Head>
        <title>Lecture Presentation | Mechanics of Spatial Vibration III</title>
        <meta name="description" content="Lecture presentation slides and interactive physics sandbox for Mechanics of Spatial Vibration III." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;755;855&family=Outfit:wght@400;500;600;700;850&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      {/* Top Banner Ribbon */}
      <div className="h-9 bg-[#8b1a1a] text-white text-[11px] px-6 py-2 font-mono flex justify-between items-center border-b border-[#721515] relative z-40 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <Link href="/papers" className="hover:text-zinc-200 transition-colors font-bold flex items-center gap-1">
            <span>← ACADEMIC ARCHIVE</span>
          </Link>
          <span className="opacity-40">|</span>
          <span className="font-bold tracking-widest uppercase font-mono">Mechanics of Spatial Vibration III Lecture</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-black/30 text-[10px] px-2 py-0.5 rounded font-bold border border-white/10 font-mono hidden sm:inline">DOI: 10.5281/zenodo.21258029</span>
        </div>
      </div>

      {/* Navigation & Control Header */}
      <header className="h-16 bg-zinc-950 border-b border-zinc-850 px-6 flex justify-between items-center relative z-30 shrink-0 shadow-lg select-none">
        {/* Brand & Progress */}
        <div className="flex items-center gap-4">
          <div className="bg-zinc-900 border border-zinc-700 px-2.5 py-1 text-[11px] font-mono text-zinc-400 rounded">
            SLIDE <span className="text-white font-bold">{currentSlide.id}</span> / {slides.length}
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono block tracking-wider leading-none mb-0.5">Active Segment</span>
            <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5 font-mono leading-none">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              {currentSlide.period} - {currentSlide.periodTitle[lang]}
            </span>
          </div>
        </div>

        {/* View Mode & Timer Controls */}
        <div className="flex items-center gap-4">
          
          {/* Language Selector */}
          <div className="flex bg-zinc-900 border border-zinc-800 rounded p-1">
            <button
              onClick={() => setLang('ko')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${
                lang === 'ko' 
                  ? 'bg-[#8b1a1a] text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              KO
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${
                lang === 'en' 
                  ? 'bg-[#8b1a1a] text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              EN
            </button>
          </div>

          {/* Lecture Timer */}
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800 rounded px-3 py-1">
            <div className="text-right">
              <span className="text-[8px] uppercase font-bold text-zinc-500 font-mono block leading-none">Timer (180m)</span>
              <span className={`text-xs font-bold font-mono tracking-wider leading-normal ${timeLeft < 10 * 60 ? 'text-red-500 animate-pulse' : 'text-zinc-300'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="flex gap-0.5">
              <button 
                onClick={() => setTimerActive(!timerActive)}
                className={`p-1 rounded transition-all text-xs border ${
                  timerActive 
                    ? 'bg-amber-600/20 border-amber-600/40 text-amber-400' 
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {timerActive ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                )}
              </button>
              <button 
                onClick={() => { setTimeLeft(180 * 60); setTimerActive(false); }}
                className="p-1 bg-zinc-800 border border-zinc-700 text-zinc-500 rounded transition-all text-xs"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" /></svg>
              </button>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex bg-zinc-900 border border-zinc-800 rounded p-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all flex items-center gap-1.5 ${
                viewMode === 'split' 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Presenter
            </button>
            <button
              onClick={() => setViewMode('presentation')}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded transition-all flex items-center gap-1.5 ${
                viewMode === 'presentation' 
                  ? 'bg-zinc-800 text-white shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Projection
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Area */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        
        {/* Left Side: Slide Projection Board */}
        <div className="flex-1 flex flex-col bg-zinc-950 p-4 min-h-0 overflow-hidden justify-between">
          
          {/* Centered Slide Card Frame */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="w-full max-w-5xl aspect-[16/9] max-h-[70vh] bg-[#0a0a0c] border border-zinc-850 rounded-lg shadow-2xl relative overflow-hidden flex flex-col min-h-0">
              
              {/* Decorative slide corner grids */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#8b1a1a]/5 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-zinc-900/40 to-transparent pointer-events-none" />
              
              {/* Slide Header */}
              <div className="h-9 px-6 border-b border-zinc-900/40 flex justify-between items-center shrink-0 select-none bg-[#0a0a0d]">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  Mechanics of Spatial Vibration III • Slide {currentSlide.id}
                </span>
                <span className="text-[8px] font-mono bg-zinc-900 px-2 py-0.5 text-zinc-400 border border-zinc-850 rounded">
                  {currentSlide.periodTitle[lang]}
                </span>
              </div>

              {/* Slide Body */}
              <div className="flex-1 px-8 py-4 overflow-y-auto flex flex-col justify-center min-h-0">
                {currentSlide.id === 1 ? (
                  // TITLE SLIDE SPECIAL LAYOUT
                  <div className="text-center space-y-4 max-w-3xl mx-auto py-2">
                    <div className="inline-block bg-[#8b1a1a]/15 border border-[#8b1a1a]/30 text-[#ff8b8b] text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full animate-pulse">
                      Special University Seminar Session (3 Hours)
                    </div>
                    
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase font-serif border-b border-zinc-900 pb-3">
                      {currentSlide.title[lang]}
                    </h1>

                    <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed max-w-2xl mx-auto whitespace-pre-line font-serif italic">
                      {currentSlide.subtitle?.[lang]}
                    </p>

                    <div className="pt-4 space-y-1 text-[11px] font-mono text-zinc-400">
                      <p className="text-zinc-200 font-serif font-bold text-xs sm:text-sm">{currentSlide.instructor?.[lang]}</p>
                      <p className="text-[10px] text-zinc-400">{currentSlide.acknowledgments?.[lang]}</p>
                    </div>
                  </div>
                ) : (
                  // STANDARD SLIDE LAYOUT
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-center min-h-0">
                    
                    {/* Left/Main Column: Slide Bullet Points */}
                    <div className={`${currentSlide.simMode ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-2.5 overflow-y-auto max-h-full py-1`}>
                      <h2 className="text-xl sm:text-2.5xl font-bold text-white tracking-tight leading-none font-serif flex items-center gap-2">
                        <span className="text-[#8b1a1a] text-sm font-mono">0{currentSlide.id}</span>
                        {currentSlide.title[lang]}
                      </h2>
                      
                      <div className="h-px bg-gradient-to-r from-zinc-800 to-transparent w-full my-2" />

                      <ul className="space-y-2.5 text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
                        {currentSlide.bullets?.map((bullet, idx) => {
                          if (bullet.type === 'header') {
                            return (
                              <li key={idx} className="text-[10px] font-bold text-amber-500 uppercase tracking-widest pt-1.5 font-mono list-none">
                                {bullet[lang]}
                              </li>
                            );
                          }
                          if (bullet.type === 'sub-bullet') {
                            return (
                              <li key={idx} className="pl-4 text-[11px] text-zinc-400 border-l border-zinc-800 py-0.5 list-none font-serif italic">
                                {renderTextWithMath(bullet[lang])}
                              </li>
                            );
                          }
                          return (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#8b1a1a] font-bold mt-1 text-[9px] shrink-0">▪</span>
                              <span className="font-serif">
                                {renderTextWithMath(bullet[lang])}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Right Column: Live Physics Simulation Embed (when available) */}
                    {currentSlide.simMode && (
                      <div className="lg:col-span-6 flex flex-col h-full justify-center min-h-0 overflow-hidden">
                        <div className="bg-zinc-950/80 border border-zinc-855 rounded-md p-2 shadow-inner flex flex-col relative h-full min-h-0 overflow-hidden">
                          <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono mb-1.5 border-b border-zinc-900 pb-1 shrink-0 select-none">
                            <span className="flex items-center gap-1.5 font-bold">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                              LIVE SIMULATOR INTERACTIVE
                            </span>
                            <span className="text-zinc-400 capitalize bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-[8px]">Mode: {currentSlide.simMode}</span>
                          </div>
                          
                          <div className="flex-1 w-full overflow-hidden flex items-center justify-center rounded border border-zinc-900 bg-black/60 min-h-0">
                            <SimulationWidget_V3 initialMode={currentSlide.simMode} compact={true} />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Slide Footer */}
              <div className="h-9 px-6 border-t border-zinc-900/40 flex justify-between items-center shrink-0 bg-[#0a0a0d] text-[9px] font-mono text-zinc-500 select-none">
                <span>© 2026 Kwang Yong Yoo • Spatial Vibration Trilogy</span>
                <div className="flex gap-2">
                  <span className="text-[#8b1a1a]">●</span>
                  <span>PREMIUM PRESENTATION PANEL</span>
                </div>
              </div>

            </div>
          </div>

          {/* Slide Navigation Buttons */}
          <div className="max-w-5xl w-full mx-auto mt-3 h-12 flex justify-between items-center bg-zinc-950/80 border border-zinc-850 px-4 rounded-lg relative z-20 shadow-md select-none shrink-0">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold rounded transition-all flex items-center gap-1 font-mono"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Prev
            </button>

            {/* Quick jump slide dropdown list */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-mono">Jump:</span>
              <select
                value={currentSlideIndex}
                onChange={(e) => setCurrentSlideIndex(parseInt(e.target.value))}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded px-2 py-0.5 text-xs outline-none focus:border-zinc-700 font-mono transition-all"
              >
                {slides.map((s, idx) => (
                  <option key={s.id} value={idx}>
                    Slide {s.id}: {s.title[lang].substring(0, 20)}...
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="px-3 py-1.5 bg-[#8b1a1a] hover:bg-[#a61f1f] disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold rounded transition-all flex items-center gap-1 font-mono"
            >
              Next
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Right Side: Presenter Panel (Hidden in presentation view) */}
        {viewMode === 'split' && (
          <aside className="w-80 md:w-96 border-l border-zinc-850 bg-zinc-950 flex flex-col overflow-hidden shrink-0 relative z-20 shadow-2xl h-full">
            
            {/* Presenter Timetable Summary */}
            <div className="p-4 border-b border-zinc-850 bg-zinc-950 shrink-0 select-none">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 font-mono">
                🕒 Timetable ({lang === 'ko' ? '180분 분량' : '180 Mins'})
              </h3>
              <div className="space-y-1 max-h-[22vh] overflow-y-auto pr-1">
                {periods.map((p) => {
                  const isActive = isPeriodActive(p);
                  return (
                    <div 
                      key={p.id}
                      className={`p-2 rounded border transition-all text-[11px] font-mono flex items-start justify-between gap-2 cursor-pointer ${
                        isActive 
                          ? 'bg-[#8b1a1a]/15 border-[#8b1a1a]/40 text-[#ff8b8b]' 
                          : 'bg-zinc-900/40 border-zinc-900/80 text-zinc-500 hover:border-zinc-800 hover:text-zinc-400'
                      }`}
                      onClick={() => setCurrentSlideIndex(p.slides[0])}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold block text-[10px]">{p.id} ({p.time})</span>
                        <span className="text-[9px] leading-tight block opacity-90">{lang === 'ko' ? p.titleKo : p.titleEn}</span>
                      </div>
                      {isActive && (
                        <span className="bg-[#8b1a1a] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse font-mono">
                          Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Presenter Script Box */}
            <div className="flex-1 p-4 flex flex-col min-h-0 overflow-hidden">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 font-mono flex items-center gap-1.5 shrink-0 select-none">
                <svg className="w-3.5 h-3.5 text-[#8b1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                🗣️ {lang === 'ko' ? '강사 스크립트' : 'Presenter Script'}
              </h3>
              
              <div className="flex-1 bg-zinc-900/40 border border-zinc-850 rounded p-3.5 font-serif text-[13px] text-zinc-200 leading-relaxed text-justify overflow-y-auto shadow-inner border-t-2 border-t-[#8b1a1a]">
                {currentSlide.script[lang]}
              </div>
            </div>

            {/* Small slide index navigator at bottom */}
            <div className="p-4 border-t border-zinc-800 shrink-0 bg-zinc-900/20 text-center font-mono select-none">
              <span className="text-[9px] text-zinc-400 block mb-1.5 font-bold">QUICK INDEX DECK</span>
              <div className="flex flex-wrap gap-1 justify-center">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-5.5 h-5.5 text-[9px] font-bold rounded-sm border transition-all ${
                      idx === currentSlideIndex 
                        ? 'bg-[#8b1a1a] border-[#8b1a1a] text-white shadow-md' 
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

          </aside>
        )}

      </div>
    </div>
  );
}
