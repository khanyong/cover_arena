import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import katex from 'katex';
import { SimulationWidget_V2 } from '../../../components/PaperPlatform/SimulationWidget_V2';

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
  simMode?: 'rotation' | 'expansion' | 'lensing' | null;
}

export default function SpatialVibration2Lecture() {
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
      titleKo: '우주론의 난제와 척도 역전 현상', 
      titleEn: 'Dark Sector & Scale Inversion', 
      slides: [0, 4] 
    },
    { 
      id: '2교시', 
      time: '60~110분', 
      titleKo: '공간 진동 텐서와 카멜레온 동역학', 
      titleEn: 'Spatial Vibration Tensor & Chameleon Dynamics', 
      slides: [5, 9] 
    },
    { 
      id: '3교시', 
      time: '120~170분', 
      titleKo: '광학적 예측과 연대기적 착시', 
      titleEn: 'Optical Blurring & Chronological Illusions', 
      slides: [10, 11] 
    },
    { 
      id: '마무리', 
      time: '170~180분', 
      titleKo: '질의응답 및 시뮬레이션 시연', 
      titleEn: 'Q&A and Interactive Sandbox', 
      slides: [12, 12] 
    },
  ];

  // 13 Slides Database
  const slides: Slide[] = [
    {
      id: 1,
      period: '1교시',
      periodTitle: { ko: '우주론의 난제와 척도 역전 현상', en: 'Dark Sector & Scale Inversion' },
      title: { ko: 'Mechanics of Spatial Vibration II', en: 'Mechanics of Spatial Vibration II' },
      subtitle: {
        ko: '거시적 중력과 미시적 공간 진동의 상호작용 및 통합 암흑 유체 모델',
        en: 'Interaction of Macroscopic Gravity with Microscopic Vibration and a Unified Dark Fluid Model'
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
        ko: '반갑습니다. 지난 시간 우리는 \'공간의 진동\'이 미시 양자 세계를 어떻게 지배하는지 살펴보았습니다. 오늘 우리는 시야를 은하계 단위의 \'거시 우주\'로 확장합니다. 현대 우주론의 가장 큰 미스터리인 \'암흑 물질\'과 \'암흑 에너지\'를 유령 입자가 아닌, 빈 공간 자체의 \'유체역학적 상전이\'로 풀어내는 여정을 시작하겠습니다.',
        en: 'Hello everyone, and welcome back. In our last session, we explored how spatial fluctuations dominate the microscopic quantum world. Today, we expand our field of view to the cosmic scale. We will begin our journey to resolve the greatest mysteries of modern cosmology—Dark Matter and Dark Dark Energy—not as phantom particles, but as fluid-dynamical phase transitions of space itself.'
      },
      simMode: null
    },
    {
      id: 2,
      period: '1교시',
      periodTitle: { ko: '우주론의 난제와 척도 역전 현상', en: 'Dark Sector & Scale Inversion' },
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
        { type: 'bullet', ko: '공식 Zenodo DOI: $10.5281/zenodo.21233252$', en: 'Official Zenodo DOI: $10.5281/zenodo.21233252$' }
      ],
      script: {
        ko: '저는 KT에서 글로벌데이터서비스를 담당하는 동시에, 연세대학교에서 기술경영으로 경영학 박사 학위를 취득하고 양자물리의 결정론적 해법을 연구해 왔습니다. 앞선 1부 논문에 이어 이번 2부에서는 거시 우주의 암흑 섹터를 공간의 기하역학 텐서로 설명해 나가는 여정을 함께하게 됩니다.',
        en: 'While managing Global Data Service at KT, I earned my Ph.D. in Technology Management at Yonsei University and have conducted research on the geomechanical foundations of physics. Today, in Part II, we extend our spatial vibration model to address the macroscopic cosmic anomalies.'
      },
      simMode: null
    },
    {
      id: 3,
      period: '1교시',
      periodTitle: { ko: '우주론의 난제와 척도 역전 현상', en: 'Dark Sector & Scale Inversion' },
      title: { ko: 'Course Overview & Index (목차)', en: 'Course Overview & Index' },
      bullets: [
        { type: 'bullet', ko: '1. **배경지식:** 현대 우주론의 난제와 암흑 물질/에너지', en: '1. **Background:** The Dark Sector Problem in Cosmology' },
        { type: 'bullet', ko: '2. **척도 역전 현상:** 미시에서 거시 우주 스케일로의 기하역학 확장', en: '2. **The Scale Inversion:** Extending Geomechanics from Micro to Cosmic Scales' },
        { type: 'bullet', ko: '3. **수학적 기초:** 아인슈타인 장방정식의 구조', en: '3. **Mathematical Prerequisites:** The Einstein Field Equations' },
        { type: 'bullet', ko: '4. **수학적 정식화:** 공간 진동 요동 텐서와 아이작슨 고주파 평균', en: '4. **Mathematical Formulation:** Spatial Vibration Tensor & Isaacson Limit' },
        { type: 'bullet', ko: '5. **카멜레온 동역학:** 밀도에 따라 상전이하는 통합 암흑 유체', en: '5. **Chameleon Dynamics:** Unified Dark Fluid Phase Transitions' },
        { type: 'bullet', ko: '6. **암흑 물질의 실체:** 은하 헤일로의 텐서 정상파 응축', en: '6. **Dark Matter:** Standing Tensor Wave Condensation' },
        { type: 'bullet', ko: '7. **암흑 에너지의 실체:** 거대 공동의 진동 척력 복사압', en: '7. **Dark Energy:** Repulsive Vibrational Radiation Pressure in Voids' },
        { type: 'bullet', ko: '8. **반증 가능한 예측:** 무색광학적 중력렌즈 번짐과 제임스 웹 은하의 연대기적 착시', en: '8. **Falsifiable Predictions:** Achromatic Optical Blurring & Chronological Illusions' }
      ],
      script: {
        ko: '오늘 다룰 강의안의 주요 구성입니다. 미시 세계에서 질량 때문에 억눌려 있던 공간 요동 에너지가 우주 공동이라는 초저밀도 거대 구역에서 어떻게 다시 고개를 들고 일어나는지(척도 역전), 그리고 이것이 우주 장방정식 속에서 어떻게 암흑 물질과 에너지로 유도되는지 확인해 보겠습니다.',
        en: 'Here is the outline for today. We will see how spatial fluctuations, suppressed by inertia in the microscopic limit, rise again in the ultra-low-density voids of deep space (Scale Inversion), and how this is mathematically formulated inside the Einstein field equations as a unified dark fluid.'
      },
      simMode: null
    },
    {
      id: 4,
      period: '1교시',
      periodTitle: { ko: '우주론의 난제와 척도 역전 현상', en: 'Dark Sector & Scale Inversion' },
      title: { ko: 'Background - The Dark Sector Problem (암흑 섹터의 딜레마)', en: 'Background - The Dark Sector Problem' },
      bullets: [
        { type: 'header', ko: '암흑 물질 (Dark Matter)', en: 'Dark Matter' },
        { type: 'bullet', ko: '비정상적 은하 회전 곡선 (Anomalous galactic rotation curves): 은하 외곽 별들의 회전 속도가 뉴턴 중력 예측치를 아득히 초과. 보이지 않는 거대한 가상 질량이 필요함.', en: 'Anomalous galactic rotation curves: Velocity of outer stars exceeds Newtonian gravity prediction. Requires massive unseen mass.' },
        { type: 'header', ko: '암흑 에너지 (Dark Energy)', en: 'Dark Energy' },
        { type: 'bullet', ko: '가속 팽창 (Accelerating expansion): 우주가 가속하며 팽창함. 만유인력에 대항해 우주를 밖으로 밀어내는 공간 자체의 음의 압력(Negative pressure)이 필요함.', en: 'Accelerating expansion: Spacetime expands at an accelerating rate. Requires negative pressure to push space outward.' },
        { type: 'header', ko: '현 주류 이론 ($\\Lambda$CDM Cosmology)의 한계', en: 'Limits of Current Paradigm ($\\Lambda$CDM)' },
        { type: 'bullet', ko: '우주상수($\\Lambda$)와 가상의 암흑 물질 입자를 상정하나, 수십 년간 직접 관측에 모조리 실패하여 물리적 실체를 입증하지 못함.', en: 'Postulates a cosmological constant ($\\Lambda$) and hypothetical cold dark matter particles, but direct detection has failed for decades.' }
      ],
      script: {
        ko: '우주를 구성하는 에너지의 95%가 무엇인지 우리는 아직 모릅니다. 이것들은 정말 우리가 아직 찾지 못한 새로운 입자일까요? 우리는 시각을 바꿔, 비어있는 줄 알았던 \'진공 자체의 성질\'을 의심해 볼 것입니다.',
        en: "We still do not know what 95% of the universe is composed of. Are these truly undiscovered particles? We will shift our perspective and investigate the active geomechanical properties of the vacuum itself."
      },
      simMode: 'rotation'
    },
    {
      id: 5,
      period: '1교시',
      periodTitle: { ko: '우주론의 난제와 척도 역전 현상', en: 'Dark Sector & Scale Inversion' },
      title: { ko: 'The Scale Inversion (척도 역전 현상)', en: 'The Scale Inversion' },
      bullets: [
        { type: 'header', ko: '관성 억제 (Inertial Suppression - Part I 회고)', en: 'Inertial Suppression (Review of Part I)' },
        { type: 'bullet', ko: '미시 세계에서는 공간 요동이 두드러지나, 고전적인 고밀도 물체(야구공, 행성 등) 주변에서는 입자의 질량에 의한 관성이 공간이 미는 미세한 힘을 완전히 압도하여 상쇄함.', en: 'Vibrational guiding forces are strong in the micro-world, but near dense classical bodies, mass-induced inertia completely suppresses spatial fluctuations.' },
        { type: 'header', ko: '우주론적 척도 역전 (Scale Inversion in Cosmology)', en: 'Scale Inversion in Cosmology' },
        { type: 'bullet', ko: '심우주(Deep space/void)로 나가면 물질의 평균 밀도($\\rho_m$)가 극도로 희박해짐.', en: 'In deep space voids, the local matter density ($\\rho_m$) becomes extremely low.' },
        { type: 'bullet', ko: '그에 따라 억눌려 있던 미시적 공간 진동 요동 에너지가 거대한 우주 체적 속에 누적되어, 천체들의 고전적 관성을 다시 압도하고 지배하기 시작함!', en: 'Consequently, the suppressed spatial vibrational energy accumulates across vast volumes, overriding classical inertia once again at cosmological scales!' }
      ],
      script: {
        ko: '야구공 앞에서는 꼼짝 못 하던 공간의 진동이, 물질이 텅 빈 심우주(Deep space)로 나가면 \'척도 역전\'을 통해 다시 거시 세계의 지배자가 됩니다. 물리 법칙이 바뀌는 것이 아니라, 밀도와 부피의 힘겨루기가 역전되는 것입니다.',
        en: 'A spatial fluctuation that is powerless against a baseball becomes the ruler of the cosmos in the empty voids of deep space through "scale inversion." The laws of physics do not change; rather, the balance of power between density and volume shifts.'
      },
      simMode: 'expansion'
    },
    {
      id: 6,
      period: '2교시',
      periodTitle: { ko: '공간 진동 텐서와 카멜레온 동역학', en: 'Spatial Vibration Tensor & Chameleon Dynamics' },
      title: { ko: 'Math Prerequisites - Einstein Field Equations (아인슈타인 장방정식)', en: 'Math Prerequisites - Einstein Field Equations' },
      bullets: [
        { type: 'header', ko: '일반상대성이론 (General Relativity)', en: 'General Relativity' },
        { type: 'bullet', ko: '$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu} $$', en: '$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu} $$' },
        { type: 'bullet', ko: '$G_{\\mu\\nu}$: 시공간의 기하학적 곡률(Spacetime geometry)', en: '$G_{\\mu\\nu}$: Spacetime curvature/geometry' },
        { type: 'bullet', ko: '$T_{\mu\\nu}$: 에너지-운동량 텐서(Energy-momentum of matter)', en: '$T_{\mu\\nu}$: Energy-momentum tensor representing matter' },
        { type: 'header', ko: '우주상수 (The Cosmological Constant, $\\Lambda$)의 한계', en: 'The Cosmological Constant ($\\Lambda$)' },
        { type: 'bullet', ko: '가속 팽창을 끼워 맞추기 위해 인위적으로 도출된 불변 상수. 본 물리 모델에서는 물리적 정합성을 위해 $\\Lambda = 0$으로 완전히 배제(Discarded)함.', en: 'An arbitrary constant introduced to fit accelerated expansion. In this model, we discard $\\Lambda$ entirely for physical consistency.' }
      ],
      script: {
        ko: '아인슈타인의 위대한 방정식입니다. 좌변은 우주의 굽어짐을, 우변은 우주에 들어있는 물질을 뜻합니다. 우리는 우변에 미지의 입자나 임의의 우주상수를 넣는 대신, \'공간의 진동\'이라는 물리적 에너지를 추가할 것입니다.',
        en: "This is Einstein's field equation. The left side represents geometry; the right side represents energy. Instead of injecting hypothetical dark matter particles or an arbitrary cosmological constant, we will inject the physical energy of spatial fluctuations directly into the right-hand side."
      },
      simMode: null
    },
    {
      id: 7,
      period: '2교시',
      periodTitle: { ko: '공간 진동 텐서와 카멜레온 동역학', en: 'Spatial Vibration Tensor & Chameleon Dynamics' },
      title: { ko: 'Math Formulation - Spatial Vibration Tensor (공간 진동 텐서)', en: 'Math Formulation - Spatial Vibration Tensor' },
      bullets: [
        { type: 'header', ko: '수정 아인슈타인 방정식 (Modified Field Equation)', en: 'Modified Einstein Field Equation' },
        { type: 'bullet', ko: '$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\mathbf{\\tilde{V}_{\\mu\\nu}} \\right) $$', en: '$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\mathbf{\\tilde{V}_{\\mu\\nu}} \\right) $$' },
        { type: 'bullet', ko: '$\\tilde{V}_{\\mu\\nu}$: 미시 공간 요동이 유도해 내는 거시 중력 효과를 나타내는 공간 진동 텐서.', en: '$\\tilde{V}_{\\mu\\nu}$: The spatial vibration tensor capturing the macroscopic gravity effects of microscopic fluctuations.' },
        { type: 'header', ko: '아이작슨 고주파 극한 (Isaacson High-Frequency Average)', en: 'Isaacson High-Frequency Limit' },
        { type: 'bullet', ko: '미세 공간 메트릭의 출렁임 요동을 $h_{\\alpha\\beta}^{vib}$라 할 때, 거시적 곡률 텐서 유도 식:', en: 'Derived macroscopic tensor under high-frequency metric fluctuation $h_{\\alpha\\beta}^{vib}$:' },
        { type: 'bullet', ko: '$$ \\tilde{V}_{\\mu\\nu} \\propto \\frac{c^4}{G} \\langle \\nabla_mu h_{\\alpha\\beta}^{vib} \\nabla_nu h^{\\alpha\\beta}_{vib} \\rangle $$', en: '$$ \\tilde{V}_{\\mu\\nu} \\propto \\frac{c^4}{G} \\langle \\nabla_mu h_{\\alpha\\beta}^{vib} \\nabla_nu h^{\\alpha\\beta}_{vib} \\rangle $$' }
      ],
      script: {
        ko: '미세한 파도의 높이 평균은 0이지만, 파도가 가진 파괴력(에너지)은 0이 아닙니다. 아이작슨 평균화는 이 미세한 공간 요동의 에너지를 거시적인 중력 텐서로 변환하는 수학적 마법입니다.',
        en: 'The average height of micro-waves is zero, but the energy of those waves is not. The Isaacson limit is a mathematical framework that converts micro-metric fluctuations into a macroscopic energy-momentum tensor.'
      },
      simMode: 'expansion'
    },
    {
      id: 8,
      period: '2교시',
      periodTitle: { ko: '공간 진동 텐서와 카멜레온 동역학', en: 'Spatial Vibration Tensor & Chameleon Dynamics' },
      title: { ko: 'Chameleon Dynamics & Unified Dark Fluid (카멜레온 동역학)', en: 'Chameleon Dynamics & Unified Dark Fluid' },
      bullets: [
        { type: 'header', ko: '가변 상태 방정식 (Variable Equation of State)', en: 'Variable Equation of State' },
        { type: 'bullet', ko: '암흑 물질과 암흑 에너지는 기원이 다른 개별 실체가 아니다. 주변 물질의 밀도($\\rho_m$)에 따라 행동 방식을 완전히 바꾸는 하나의 **통합 텐서 유체(Unified Tensor Fluid)**이다.', en: 'Dark Matter and Dark Energy are not separate entities. They are two faces of a single Unified Tensor Fluid that changes behavior based on local matter density ($\\rho_m$).' },
        { type: 'header', ko: '밀도 의존적 상전이 함수 (Transition Function)', en: 'Transition Function' },
        { type: 'bullet', ko: '$$ w(\\rho_m) \\approx -1 + \\frac{1}{1 + e^{-(\\rho_m - \\rho_{crit})/\\sigma}} $$', en: '$$ w(\\rho_m) \\approx -1 + \\frac{1}{1 + e^{-(\\rho_m - \\rho_{crit})/\\sigma}} $$' },
        { type: 'bullet', ko: '은하 내부 (고밀도 $\\rho_m \\gg \\rho_{crit}$): 상태방정식 인수 $w \\approx 0$. 압력이 없는 먼지 물질(Dark Matter)처럼 작용.', en: 'Galactic core (High density): Equation of state parameter $w \\approx 0$. Acts like pressureless dust (Dark Matter).' },
        { type: 'bullet', ko: '은하 외부 공동 (저밀도 $\\rho_m \\ll \\rho_{crit}$): 상태방정식 인수 $w \\to -1$. 음의 압력을 가진 진공 에너지(Dark Energy)처럼 작용.', en: 'Cosmic voids (Low density): Equation of state parameter $w \\to -1$. Acts like repulsive dark energy.' }
      ],
      script: {
        ko: '공간 진동은 마치 환경에 따라 색을 바꾸는 카멜레온과 같습니다. 은하 내부처럼 밀도가 높은 곳과 텅 빈 우주 공동에서 이 유체는 전혀 다른 물리적 특성을 드러냅니다.',
        en: 'Spatial vibration acts like a chameleon, changing its colors based on the environment. In high-density galactic centers vs. empty cosmic voids, the same spatial fluid displays completely different physical properties.'
      },
      simMode: 'expansion'
    },
    {
      id: 9,
      period: '2교시',
      periodTitle: { ko: '공간 진동 텐서와 카멜레온 동역학', en: 'Spatial Vibration Tensor & Chameleon Dynamics' },
      title: { ko: 'Dark Matter as Tensor Condensation (텐서 응축 암흑 물질)', en: 'Dark Matter as Tensor Condensation' },
      bullets: [
        { type: 'header', ko: '은하 헤일로 지역의 정상파 형성', en: 'Standing Waves in Galactic Halos' },
        { type: 'bullet', ko: '우주 요동 진동파가 은하의 거대한 중력 우물(Potential Well)에 포획됨. 파동들이 중첩되며 보강 간섭(Constructive interference)을 일으킴.', en: 'Spatial fluctuation waves get trapped in galactic potential wells, causing constructive interference.' },
        { type: 'header', ko: '텐서 응축 (Tensor Condensation)', en: 'Tensor Condensation' },
        { type: 'bullet', ko: '갇힌 파동들이 정상파(Standing waves)를 이루며 거시적인 유효 질량(Effective Mass, $w \\approx 0$)을 획득함:', en: 'The trapped waves build standing waves, acquiring effective gravitational mass ($w \\approx 0$):' },
        { type: 'bullet', ko: '$$ M_{eff}(r) = M_{visible}(r) + \\frac{4\\pi}{c^2} \\int_{0}^{r} \\langle \\tilde{V}_{00} \\rangle \\sqrt{g_{rr}} r\'^2 dr\' $$', en: '$$ M_{eff}(r) = M_{visible}(r) + \\frac{4\\pi}{c^2} \\int_{0}^{r} \\langle \\tilde{V}_{00} \\rangle \\sqrt{g_{rr}} r\'^2 dr\' $$' },
        { type: 'bullet', ko: '은하 외곽에 가상의 질량 효과(잉여 중력)를 유도하여 은하 회전 속도를 평탄하게 유지하는 **암흑 물질**의 정체.', en: 'Creates surplus gravity at galactic outskirts, keeping rotation curves flat without needing phantom particles.' }
      ],
      script: {
        ko: '은하 외곽의 회전 곡선이 평탄한 이유는 입자가 더 있어서가 아닙니다. 은하 중력에 갇힌 공간 요동파가 정상파로 굳어지며(텐서 응축) 추가 중력을 유도해 내기 때문입니다.',
        en: 'The outer galactic stars rotate fast not because of hypothetical particles, but because trapped spatial fluctuations form standing waves (Tensor Condensation), generating effective mass and surplus gravity.'
      },
      simMode: 'rotation'
    },
    {
      id: 10,
      period: '2교시',
      periodTitle: { ko: '공간 진동 텐서와 카멜레온 동역학', en: 'Spatial Vibration Tensor & Chameleon Dynamics' },
      title: { ko: 'Dark Energy as Radiation Pressure (진동 복사압 암흑 에너지)', en: 'Dark Energy as Radiation Pressure' },
      bullets: [
        { type: 'header', ko: '거대 공동에서의 장력 방출', en: 'Release of Tension in Cosmic Voids' },
        { type: 'bullet', ko: '은하들이 몰려있는 은하군 사이의 거대한 빈 구역(Cosmic Voids)에서는 물질의 결합력이 상실됨.', en: 'In vast cosmic voids, the absence of matter releases spatial vibrational tension.' },
        { type: 'header', ko: '음의 복사압과 프리드만 방정식', en: 'Negative Radiation Pressure & Friedmann Equation' },
        { type: 'bullet', ko: '요동이 구속되지 않고 급격히 확산하며 척력성 복사압 방출: $p_{vib} \\approx -\\rho_{vib} c^2$', en: 'Unbound fluctuations propagate rapidly, generating a strong repulsive pressure: $p_{vib} \\approx -\\rho_{vib} c^2$.' },
        { type: 'bullet', ko: '$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\rho_{vib} + \\frac{3p_{vib}}{c^2} \\right) $$', en: '$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\rho_{vib} + \\frac{3p_{vib}}{c^2} \\right) $$' },
        { type: 'bullet', ko: '수식 괄호 안의 결합 에너지가 음수($\\rho_{vib} + 3p_{vib}/c^2 = -2\\rho_{vib}$)로 전환되며 우주를 척력으로 밀어내 가속 팽창($\\ddot{a} > 0$)시키는 **암흑 에너지**의 실체.', en: 'The effective pressure term in Friedmann equation becomes strongly negative ($-2\\rho_{vib}$), driving the cosmic acceleration.' }
      ],
      script: {
        ko: '물질이 없는 텅 빈 거대 공동에서는 공간의 텐션이 풀리면서 막강한 척력 복사압이 방출됩니다. 이것이 프리드만 가속 팽창식에 따라 우주 전체를 가속 팽창시키는 실제 원인입니다.',
        en: 'In empty cosmic voids, the release of spatial tension generates a repulsive radiation pressure. Under the Friedmann acceleration equation, this negative pressure acts as the physical source of Dark Energy.'
      },
      simMode: 'expansion'
    },
    {
      id: 11,
      period: '3교시',
      periodTitle: { ko: '광학적 예측과 연대기적 착시', en: 'Optical Blurring & Chronological Illusions' },
      title: { ko: 'Prediction 1 - Achromatic Optical Blurring (무색광학적 번짐)', en: 'Prediction 1 - Achromatic Optical Blurring' },
      bullets: [
        { type: 'header', ko: '측지선 미세 굴절 (Stochastic Geodesic Deviation)', en: 'Stochastic Geodesic Deviation' },
        { type: 'bullet', ko: '은하단을 통과하는 광자(빛)가 공간 텐서의 고주파 요동 파도를 지날 때 측지선 궤적이 미세하게 흔들리며 미세하게 번짐(Scattering).', en: 'Photons passing through galactic clusters travel over metric fluctuations, experiencing micro-refractions that blur their geodesics.' },
        { type: 'header', ko: '기하학적 검증 조건: 무색성 (Achromaticity)', en: 'Key Validation: Achromaticity' },
        { type: 'bullet', ko: '우주 먼지나 가스 플라즈마에 의한 일반 번짐은 파장(주파수)에 따라 번짐 폭이 달라지는 색수차(Chromatic dispersion)를 보임.', en: 'Dust or plasma scattering causes chromatic dispersion (blurring width varies with wavelength).' },
        { type: 'bullet', ko: '반면, 본 기하역학 모델의 요동은 순수 시공간 곡률이므로, 전파부터 감마선까지 **모든 파장의 빛이 정확히 동일한 폭으로 번져야 함 (Achromaticity)**.', en: 'Conversely, spacetime geometry fluctuations are purely gravitational, meaning all wavelengths (from radio to gamma rays) must blur by the exact same width.' }
      ],
      script: {
        ko: '이 이론이 맞다면, 중력 렌즈 주변을 지나는 빛은 반드시 미세하게 번져 보여야 합니다. 중요한 건 색깔(파장)에 상관없이 똑같이 번져야 한다는 점이며, 이는 이 가설을 검증할 결정적 관측 기준이 됩니다.',
        en: 'If this theory is correct, light passing through gravitational lenses must exhibit a micro-blurring. Crucially, because geometry affects all wavelengths identically, this blurring must be achromatic, offering a clear verification test.'
      },
      simMode: 'lensing'
    },
    {
      id: 12,
      period: '3교시',
      periodTitle: { ko: '광학적 예측과 연대기적 착시', en: 'Optical Blurring & Chronological Illusions' },
      title: { ko: 'Prediction 2 - Chronological Illusions (연대기적 착시)', en: 'Prediction 2 - Chronological Illusions' },
      bullets: [
        { type: 'header', ko: '제임스 웹 망원경(JWST)의 은하 이상 관측', en: 'The JWST Cosmic Dawn Anomaly' },
        { type: 'bullet', ko: '우주 극초기(빅뱅 직후)에 존재할 수 없을 만큼 극도로 성숙하고 비대한 은하들이 다수 발견됨. 주류 우주론에 큰 모순 발생.', en: 'JWST discovered mature, massive galaxies in the early universe, violating standard galaxy formation timelines.' },
        { type: 'header', ko: '기하학적 경로 단축 (Geometrical Path-Shortening)', en: 'Geometrical Path-Shortening' },
        { type: 'bullet', ko: '통합 암흑 유체의 초고밀도 요동 영역(은하 핵 부근) 주변부에서 강하게 걸린 음압에 의해 공간 메트릭이 단축되어 **Spatial Junction (공간 접합 지점)**이 유도됨.', en: 'Extreme negative pressures near high-density spatial domains fold local metrics, creating spatial junctions.' },
        { type: 'bullet', ko: '빛이 이 굽어진 단축 경로를 따라 지름길로 이동하여 예상보다 훨씬 일찍 지구 망원경에 도달함.', en: 'Photons traverse these shortcuts, arriving at Earth much faster than their cosmological redshift distance suggests.' },
        { type: 'bullet', ko: '**결론:** 은하가 비정상적으로 일찍 태어난 것이 아니라, 빛이 단축 경로를 타고 일찍 도달한 **연대기적 착시(Chronological Illusion)**이다!', en: 'Conclusion: The galaxies are not inexplicably old; rather, the light took a geometric shortcut, creating a chronological illusion!' }
      ],
      script: {
        ko: '제임스 웹 망원경이 발견한 초기 우주의 괴물 은하들은 은하가 조기 성숙한 것이 아닙니다. 카멜레온 메커니즘이 강하게 공간을 접어 지름길을 만들었고, 그 길을 타고 광자가 우리에게 일찍 도착해서 늙어 보이는 착시를 준 것뿐입니다.',
        en: 'The massive early galaxies discovered by JWST do not violate natural timelines. The chameleon pressure folded spacetime paths, creating shortcuts that allowed photons to arrive early. It is a chronological illusion.'
      },
      simMode: 'lensing'
    },
    {
      id: 13,
      period: '마무리',
      periodTitle: { ko: '질의응답 및 시뮬레이션 시연', en: 'Q&A and Interactive Sandbox' },
      title: { ko: 'Conclusion & Q&A (결론 및 질의응답)', en: 'Conclusion & Q&A' },
      bullets: [
        { type: 'header', ko: '요약 (Summary)', en: 'Summary' },
        { type: 'bullet', ko: '암흑 물질과 에너지는 별개의 가상 입자가 아닌, 주변 밀도에 따라 상전이하는 단 하나의 \'공간 진동 텐서\'가 유도하는 기하학적 유체역학 현상이다.', en: 'Dark Matter and Dark Energy are not separate phantom particles, but manifestations of a single spatial vibration tensor undergoing density-dependent phase transitions.' },
        { type: 'header', ko: '시뮬레이션 대시보드 시연', en: 'Interactive Sandbox Demonstration' },
        { type: 'bullet', ko: '오른쪽 샌드박스에서 은하 외곽 정상파 형성(암흑 물질), 공동 척력 팽창(암흑 에너지), 그리고 측지선 렌즈 산란(광학 번짐)을 직접 질량과 점성 매개변수를 바꾸며 조작해 보세요.', en: 'In the right sandbox, you can directly manipulate mass and coupling parameters to visualize standing wave halos, void expansions, and geodesic lensing.' },
        { type: 'bullet', ko: '🔗 **공식 DOI:** [10.5281/zenodo.21233252](https://doi.org/10.5281/zenodo.21233252)', en: '🔗 **Official DOI:** [10.5281/zenodo.21233252](https://doi.org/10.5281/zenodo.21233252)' },
        { type: 'header', ko: '다음 강의 예고', en: 'Next Lecture Teaser' },
        { type: 'bullet', ko: '팽창하는 거대 우주에서 서로 다른 위상 진동을 가진 공간 블록들이 충돌하면 어떻게 될까요? 우주 단층대의 위상학적 파열과 우주 지진을 다루는 **Part III**에서 뵙겠습니다.', en: 'What happens when spatial blocks with different vibrational phases collide in expanding space? See you in Part III, addressing cosmic faults and spacetime seismology!' }
      ],
      script: {
        ko: '오늘 강의는 여기까지입니다. 질문이 있으시다면 자유롭게 말씀해 주시기 바랍니다. 이어서 암흑 물질과 에너지 동역학을 체험할 수 있는 Part II 샌드박스를 작동하여 은하 회전 곡선 보강 현상과 렌즈 미세 산란을 보여드리겠습니다.',
        en: 'This concludes our second lecture. I will now take any questions you have, and then demonstrate the Part II sandbox, showcasing standing wave halos and geodesic lensing effects.'
      },
      simMode: 'rotation'
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
        <title>Lecture Presentation | Mechanics of Spatial Vibration II</title>
        <meta name="description" content="Lecture presentation slides and interactive physics sandbox for Mechanics of Spatial Vibration II." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;755;855&family=Outfit:wght@400;500;600;700;850&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      {/* Top Banner Ribbon */}
      <div className="h-9 bg-[#8b1a1a] text-white text-[11px] px-6 py-2 font-mono flex justify-between items-center border-b border-[#721515] relative z-40 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <Link href="/papers" className="hover:text-zinc-200 transition-colors font-bold flex items-center gap-1">
            <span>← ACADEMIC ARCHIVE</span>
          </Link>
          <span className="opacity-40">|</span>
          <span className="font-bold tracking-widest uppercase font-mono">Mechanics of Spatial Vibration II Lecture</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-black/30 text-[10px] px-2 py-0.5 rounded font-bold border border-white/10 font-mono hidden sm:inline">DOI: 10.5281/zenodo.21233252</span>
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
                  Mechanics of Spatial Vibration II • Slide {currentSlide.id}
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
                            <SimulationWidget_V2 initialMode={currentSlide.simMode} compact={true} />
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
