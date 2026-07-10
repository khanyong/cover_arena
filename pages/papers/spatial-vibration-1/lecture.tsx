import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import katex from 'katex';
import { SimulationWidget } from '../../../components/PaperPlatform/SimulationWidget';

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
  simMode?: 'slit' | 'decoherence' | 'mass' | 'omega' | null;
}

export default function SpatialVibrationLecture() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'split' | 'presentation'>('split'); // presenter view vs presentation only
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180 * 60); // 180 minutes in seconds
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

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
      titleKo: '배경지식 및 양자 딜레마', 
      titleEn: 'Background & The Quantum Dilemma', 
      slides: [0, 5] 
    },
    { 
      id: '2교시', 
      time: '60~110분', 
      titleKo: '공간 진동 가설과 수학적 정식화', 
      titleEn: 'Spatial Vibration Hypothesis & Formulation', 
      slides: [6, 9] 
    },
    { 
      id: '3교시', 
      time: '120~170분', 
      titleKo: '위상학적 정칙화 및 결어긋남', 
      titleEn: 'Topological Regularization & Decoherence', 
      slides: [10, 14] 
    },
    { 
      id: '마무리', 
      time: '170~180분', 
      titleKo: '질의응답 및 시뮬레이션 시연', 
      titleEn: 'Q&A and Interactive Sandbox', 
      slides: [15, 16] 
    },
  ];

  // 17 Slides Database
  const slides: Slide[] = [
    {
      id: 1,
      period: '1교시',
      periodTitle: { ko: '배경지식 및 양자 딜레마', en: 'Background & The Quantum Dilemma' },
      title: { ko: 'Mechanics of Spatial Vibration I', en: 'Mechanics of Spatial Vibration I' },
      subtitle: {
        ko: '파동-입자 이중성의 기하역학적 재해석과 양자 결어긋남에서의 위상 난류',
        en: 'A Geomechanical Reinterpretation of Wave-Particle Duality and Phase Turbulence in Quantum Decoherence'
      },
      instructor: {
        ko: '강사: 유광용 (독립 연구자)',
        en: 'Instructor: Kwang Yong Yoo (Independent Researcher)'
      },
      acknowledgments: {
        ko: 'AI 지원 연구 및 시뮬레이션 개발 지원: Gemini',
        en: 'AI-Assisted Research and Simulation Development Support: Gemini'
      },
      script: {
        ko: '여러분, 반갑습니다. 오늘 우리는 현대 물리학의 가장 거대한 미스터리인 \'양자(Quantum)\'의 세계를 완전히 새로운 시각으로 해부해 볼 것입니다. 익히 들어온 \'확률\'이나 \'관측자의 의식\' 같은 추상적인 개념을 넘어, 우리가 발을 딛고 있는 물리적 3차원 공간의 \'유체 역학적 진동\'으로 양자역학을 재구성하는 결정론적 여정에 여러분을 초대합니다.',
        en: 'Hello everyone, and welcome. Today, we will dissect the greatest mystery of modern physics—the quantum world—from a completely new perspective. Moving beyond abstract concepts like probability or observer consciousness, I invite you to a deterministic journey to reconstruct quantum mechanics through the fluid-mechanical vibration of the physical three-dimensional space we stand upon.'
      },
      simMode: null
    },
    {
      id: 2,
      period: '1교시',
      periodTitle: { ko: '배경지식 및 양자 딜레마', en: 'Background & The Quantum Dilemma' },
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
        { type: 'bullet', ko: '공식 Zenodo DOI: $10.5281/zenodo.21206211$', en: 'Official Zenodo DOI: $10.5281/zenodo.21206211$' }
      ],
      script: {
        ko: '저는 KT에서 글로벌데이터서비스를 담당하는 동시에, 연세대학교에서 기술경영으로 경영학 박사 학위를 취득하고 양자물리의 결정론적 해법을 연구해 왔습니다. 연세대 MBA와 미국 로스쿨 LL.M을 거치며 기술과 학문, 법률적 경계를 넘나들며 쌓아온 다양한 통찰을 바탕으로, 미시적인 양자 세계부터 거시적인 우주 구조까지 \'공간의 기하학적 요동\'이라는 하나의 원리로 꿰어내는 연구를 수행하고 있습니다. 오늘 다룰 내용은 그 거대한 세계관의 첫 번째 발판인 \'미시 양자 세계\' 편입니다.',
        en: "While leading Global Data Service at KT, I completed my Ph.D. in Technology Management at Yonsei University and have researched deterministic solutions in quantum physics. Bridging my MBA and an LL.M from the US, I apply cross-disciplinary insights to unify all scales of nature, from the microscopic quantum realm to the macroscopic cosmic structure, under a single principle: the geometrical fluctuation of space. Today's topic is the first stepping stone of that grand worldview: the microscopic quantum world."
      },
      simMode: null
    },
    {
      id: 3,
      period: '1교시',
      periodTitle: { ko: '배경지식 및 양자 딜레마', en: 'Background & The Quantum Dilemma' },
      title: { ko: 'Course Overview & Index (목차)', en: 'Course Overview & Index' },
      bullets: [
        { type: 'bullet', ko: '1. **배경지식:** 파동-입자 이중성과 코펜하겐 해석', en: '1. **Background:** Wave-Particle Duality & Copenhagen Interpretation' },
        { type: 'bullet', ko: '2. **수학적 기초:** 슈뢰딩거 방정식 극좌표 변환', en: '2. **Mathematical Prerequisites:** The Schrödinger Eq.' },
        { type: 'bullet', ko: '3. **핵심 가설:** 공간의 기하학적 요동', en: '3. **Core Hypothesis:** Geometrical Fluctuation of Space' },
        { type: 'bullet', ko: '4. **수학적 정식화:** 비선형 동역학 마찰항', en: '4. **Mathematical Formulation:** Non-linear Dynamics' },
        { type: 'bullet', ko: '5. **특이점 해결:** 위상학적 정칙화 소용돌이', en: '5. **Resolving Singularities:** Topological Regularization' },
        { type: 'bullet', ko: '6. **양자 결어긋남:** 위상 난류에 의한 파동 붕괴', en: '6. **Quantum Decoherence:** Phase Turbulence' },
        { type: 'bullet', ko: '7. **거시-미시 경계:** 질량에 따른 관성 억제', en: '7. **The Macro-Micro Boundary:** Inertial Suppression' }
      ],
      script: {
        ko: '오늘의 전체적인 흐름입니다. 먼저 고전 물리학과 양자역학의 충돌 지점인 배경지식부터 시작하여, 슈뢰딩거 방정식의 극좌표 변환이라는 수학적 무기를 장착하고, 본 논문의 핵심인 공간 진동 가설로 넘어가겠습니다. 그 후 특이점 해결과 데코히어런스(결어긋남)를 거쳐 거시 세계로의 회귀까지, 차근차근 짚어보겠습니다.',
        en: "Here is the overall flow of today's lecture. We'll start with the background where classical and quantum mechanics collide, equip ourselves with the mathematical tool of polar transformation of the Schrödinger equation, and move on to the core spatial vibration hypothesis of this paper. Then, through resolving singularities and decoherence, we will close with the return to the macroscopic classical limit."
      },
      simMode: null
    },
    {
      id: 4,
      period: '1교시',
      periodTitle: { ko: '배경지식 및 양자 딜레마', en: 'Background & The Quantum Dilemma' },
      title: { ko: 'Background - Wave-Particle Duality (파동-입자 이중성)', en: 'Background - Wave-Particle Duality' },
      bullets: [
        { type: 'header', ko: '이중 슬릿 실험 (The Double-Slit Experiment)', en: 'The Double-Slit Experiment' },
        { type: 'bullet', ko: '전자(Electron)를 하나씩 쏘았을 때, 스크린에는 명확히 점(Particle)으로 찍힘.', en: 'Fired one by one, electrons land as discrete dots (particles) on the screen.' },
        { type: 'bullet', ko: '그러나 수만 개가 누적되면 파동(Wave) 고유의 간섭 무늬(Interference Pattern)가 나타남.', en: 'However, accumulating thousands of electrons reveals an wave-like interference pattern.' },
        { type: 'header', ko: '양자역학의 딜레마 (The Quantum Dilemma)', en: 'The Quantum Dilemma' },
        { type: 'bullet', ko: '"어떻게 쪼개질 수 없는 하나의 실체가 두 개의 슬릿을 동시에 통과하여 스스로 간섭을 일으킬 수 있는가?"', en: '"How can a single, indivisible entity pass through both slits simultaneously to interfere with itself?"' }
      ],
      script: {
        ko: '리처드 파인만은 이 이중 슬릿 실험에 \'양자역학의 유일한 미스터리\'가 모두 담겨있다고 했습니다. 입자 하나를 쏘았는데 간섭 무늬를 만듭니다. 전자는 도대체 파동일까요, 입자일까요?',
        en: 'Richard Feynman said that the double-slit experiment contains the entire mystery of quantum mechanics. A single particle is fired, yet it creates an interference pattern. Is an electron a wave, or is it a particle?'
      },
      simMode: 'slit'
    },
    {
      id: 5,
      period: '1교시',
      periodTitle: { ko: '배경지식 및 양자 딜레마', en: 'Background & The Quantum Dilemma' },
      title: { ko: 'Background - Copenhagen Interpretation (코펜하겐 해석)', en: 'Background - The Copenhagen Interpretation' },
      bullets: [
        { type: 'header', ko: '확률론적 파동함수 (Probabilistic Wave Function, $\\psi$)', en: 'Probabilistic Wave Function ($\\psi$)' },
        { type: 'bullet', ko: '입자는 관측되기 전까지 물리적 실체(Definite classical properties)를 갖지 않는다. 오직 확률 구름의 중첩으로만 존재함.', en: 'Particles have no definite classical properties before measurement. They exist as superpositions of probabilities.' },
        { type: 'header', ko: '파동함수의 붕괴 (Wave Function Collapse)', en: 'Wave Function Collapse' },
        { type: 'bullet', ko: '측정(Observation)을 하는 순간, 파동이 단 하나의 상태로 붕괴한다.', en: 'At the moment of observation/measurement, the wave function collapses to a single point.' },
        { type: 'header', ko: '아인슈타인의 비판 (Einstein\'s Critique)', en: 'Einstein\'s Critique' },
        { type: 'bullet', ko: '*"신은 주사위를 던지지 않는다. 우리가 관측하지 않으면 달은 하늘에 존재하지 않는가?"*', en: '*"God does not play dice. Does the moon not exist if we are not looking at it?"*' }
      ],
      script: {
        ko: '주류 학계인 코펜하겐 해석은 관측 전의 상태를 아예 묻지 말라고 합니다. 훌륭한 계산 도구이긴 하지만, \'관측\'이란 행위가 개입해야만 물리적 실재(Reality)가 결정된다는 철학적 불안정성을 가지고 있습니다.',
        en: "The mainstream Copenhagen interpretation tells us not to ask about the state before measurement. While it is an excellent calculation tool, it carries a philosophical instability—that physical reality is only determined when 'observation' intervenes."
      },
      simMode: 'slit'
    },
    {
      id: 6,
      period: '1교시',
      periodTitle: { ko: '배경지식 및 양자 딜레마', en: 'Background & The Quantum Dilemma' },
      title: { ko: 'Alternative Views - Hidden-Variable Theories (대안 이론들)', en: 'Alternative Views - Hidden-Variable Theories' },
      bullets: [
        { type: 'header', ko: '드 브로이-봄 이론 (De Broglie-Bohm Theory)', en: 'De Broglie-Bohm Theory' },
        { type: 'bullet', ko: '입자는 항상 명확한 궤적(Definite trajectory)을 가지며, 공간의 파일럿 파동(Pilot-wave)이 입자를 가이드한다고 주장.', en: 'Particles always possess a definite trajectory, guided by a physical pilot wave.' },
        { type: 'header', ko: '형이상학적 추상화의 한계 (The Metaphysical Abstraction)', en: 'The Metaphysical Abstraction' },
        { type: 'bullet', ko: '여러 입자를 설명하기 위해 우리가 사는 3차원 공간이 아닌, $3N$-차원의 형이상학적 형태 공간(Configuration Space)을 수학적으로 요구하여 직관을 잃음.', en: 'To describe multiple particles, it mathematically requires a $3N$-Dimensional Configuration Space, rather than the physical 3D space we live in.' }
      ],
      script: {
        ko: '입자가 명확한 궤적을 가진다는 시도는 예전에도 있었습니다. 하지만 이들은 수학적 한계 때문에 현실에 존재하지 않는 $3N$ 차원의 가상 공간을 도입해야만 했죠. 물리적 직관과는 거리가 멉니다.',
        en: 'Attempts to give particles definite trajectories did exist. However, due to mathematical limitations, they had to introduce a virtual $3N$-dimensional space that does not exist in reality. It is far from physical intuition.'
      },
      simMode: 'slit'
    },
    {
      id: 7,
      period: '2교시',
      periodTitle: { ko: '공간 진동 가설과 수학적 정식화', en: 'Spatial Vibration Hypothesis & Formulation' },
      title: { ko: 'The Core Hypothesis - Geometrical Fluctuation of Space (공간 진동 가설)', en: 'The Core Hypothesis - Geometrical Fluctuation of Space' },
      bullets: [
        { type: 'header', ko: '명확한 실재성 (Definite Reality)', en: 'Definite Reality' },
        { type: 'bullet', ko: '양자는 관측과 무관하게 언제나 공간의 실제 입자(Particle-like entities)이다.', en: 'Quantum entities are always particles, independent of observation.' },
        { type: 'header', ko: '파동성의 외부화 (Externalization of Wave-like Behavior)', en: 'Externalization of Wave-like Behavior' },
        { type: 'bullet', ko: '파동처럼 행동하는 것은 입자 자체가 퍼져있기 때문이 아니다.', en: 'The wave-like behavior is not because the particle itself is spread out.' },
        { type: 'bullet', ko: '**"입자가 놓여 있는 텅 빈 우주 공간(Spatial background/vacuum) 자체가 시공간 수준에서 요동(Geometrical fluctuation)치고 있기 때문이다!"**', en: '**"The empty space (spatial background) in which the particle resides is itself fluctuating at the metric level!"**' },
        { type: 'header', ko: '비유 (Analogy)', en: 'Analogy' },
        { type: 'bullet', ko: '호수의 거친 파도(공간 진동)를 타고 휩쓸려 이동하는 나뭇잎(입자).', en: 'A leaf (particle) riding waves (spatial vibrations) on a lake.' }
      ],
      script: {
        ko: '이 논문의 핵심적인 패러다임 전환입니다. 전자는 퍼져있는 유령이 아닙니다. 텅 빈 우주 공간, 즉 진공이 미시 세계에서는 거칠게 요동치고 있으며 전자는 그 기하학적 물결에 이끌려(Guided) 서핑을 할 뿐입니다.',
        en: "This is the core paradigm shift of this paper. Electrons are not spread-out ghosts. The empty space, the vacuum, is violently fluctuating at the microscopic scale, and the electron is simply surfing, guided by this geometrical wave."
      },
      simMode: 'slit'
    },
    {
      id: 8,
      period: '2교시',
      periodTitle: { ko: '공간 진동 가설과 수학적 정식화', en: 'Spatial Vibration Hypothesis & Formulation' },
      title: { ko: 'Mathematical Formulation - Non-linear Modification (비선형 수정 슈뢰딩거 방정식)', en: 'Mathematical Formulation - Non-linear Modification' },
      bullets: [
        { type: 'header', ko: '마찰의 필요성 (The Need for Friction)', en: 'The Need for Friction' },
        { type: 'bullet', ko: '입자가 공간 파도를 타기 위해서는 결합 마찰(Viscosity, $\\gamma$)이 필요. 기존에 허수 퍼텐셜을 넣으면 확률이 보존되지 않고 소멸(Probability non-conservation)하는 모순 발생.', en: 'Friction is required to ride the spatial wave. Adding an imaginary potential causes probability to decay (non-conservation), creating a physical contradiction.' },
        { type: 'header', ko: '본 모델의 수정 방정식 (Our Modification)', en: 'Our Modification' },
        { type: 'bullet', ko: '$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}) + \\mathbf{\\gamma(S - \\langle S \\rangle)} \\right] \\psi $$', en: '$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}) + \\mathbf{\\gamma(S - \\langle S \\rangle)} \\right] \\psi $$' },
        { type: 'bullet', ko: 'Kostin 모델을 발전시킨 실수형(Real-valued) 비선형 방정식.', en: 'A real-valued non-linear equation developing the Kostin model.' },
        { type: 'bullet', ko: '$\\langle S \\rangle$(공간 평균)을 빼주어 게이지 불변(Gauge-invariant) 대칭성을 완벽히 보존.', en: 'Subtracting $\\langle S \\rangle$ (spatial average) perfectly preserves gauge-invariant symmetry.' }
      ],
      script: {
        ko: '우리는 마찰을 넣었을 때 우주에서 입자가 증발해버리는 모순을 피하기 위해 $\\gamma(S - \\langle S \\rangle)$라는 특수한 \'실수 마찰항\'을 고안했습니다.',
        en: "To avoid the contradiction of particles evaporating from the universe when introducing friction, we designed a special 'real-valued friction term' $\\gamma(S - \\langle S \\rangle)$."
      },
      simMode: 'slit'
    },
    {
      id: 9,
      period: '2교시',
      periodTitle: { ko: '공간 진동 가설과 수학적 정식화', en: 'Spatial Vibration Hypothesis & Formulation' },
      title: { ko: 'Math Prerequisites - Polar Transformation (극좌표 변환)', en: 'Math Prerequisites - Polar Transformation' },
      bullets: [
        { type: 'header', ko: '극좌표 분해 (Polar Decomposition)', en: 'Polar Decomposition' },
        { type: 'bullet', ko: '복소수 파동함수를 진폭($R$)과 위상($S$)으로 분리:', en: 'Splitting the complex wave function into amplitude ($R$) and phase ($S$):' },
        { type: 'bullet', ko: '$$ \\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar} $$', en: '$$ \\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar} $$' },
        { type: 'header', ko: '연속 방정식 (Continuity Equation)', en: 'Continuity Equation' },
        { type: 'bullet', ko: '$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{v}) = 0 \\quad (\\text{단, } \\rho = R^2, \\mathbf{v} = \\nabla S / m) $$', en: '$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{v}) = 0 \\quad (\\text{where } \\rho = R^2, \\mathbf{v} = \\nabla S / m) $$' },
        { type: 'bullet', ko: '결론: 도입된 항이 실수이므로 허수부에 영향을 주지 않아, 확률 밀도는 전역적으로 100% 보존됨.', en: 'Conclusion: Since the introduced friction term is real-valued, it does not affect the imaginary part; thus, probability density is 100% conserved globally.' }
      ],
      script: {
        ko: '이 방정식을 크기($R$)와 각도($S$)로 쪼개보면 놀랍게도 유체역학의 연속 방정식이 그대로 나옵니다. 마찰을 겪더라도 입자가 우주에서 사라지지 않는다는 것을 수학적으로 완벽히 증명한 것입니다.',
        en: "By splitting this equation into amplitude ($R$) and angle ($S$), we obtain exactly the fluid dynamics continuity equation. This mathematically proves that the particle does not disappear from the universe even when experiencing friction."
      },
      simMode: 'slit'
    },
    {
      id: 10,
      period: '2교시',
      periodTitle: { ko: '공간 진동 가설과 수학적 정식화', en: 'Spatial Vibration Hypothesis & Formulation' },
      title: { ko: 'Quantum Hamilton-Jacobi Eq. (양자 해밀턴-야코비 방정식)', en: 'Quantum Hamilton-Jacobi Equation' },
      bullets: [
        { type: 'header', ko: '실수부 분리 (Real Part Separation)', en: 'Real Part Separation' },
        { type: 'bullet', ko: '$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V(\\mathbf{r}) + \\mathbf{Q_s} + \\gamma(S - \\langle S \\rangle) = 0 $$', en: '$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V(\\mathbf{r}) + \\mathbf{Q_s} + \\gamma(S - \\langle S \\rangle) = 0 $$' },
        { type: 'header', ko: '공간-진동 퍼텐셜 (Spatial-Vibration Potential, $Q_s$)', en: 'Spatial-Vibration Potential ($Q_s$)' },
        { type: 'bullet', ko: '$$ Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} $$', en: '$$ Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} $$' },
        { type: 'bullet', ko: '입자를 억지로 밀고 당겨서 간섭 무늬를 만드는 보이지 않는 기하학적 곡률(Geometrical curvature)의 물리적 실체.', en: 'The physical reality of the invisible geometrical curvature that guides the particle to form interference patterns.' }
      ],
      script: {
        ko: '실수부를 분리하면 고전 뉴턴 역학과 똑같은 에너지 보존식이 나옵니다. 단 하나, $Q_s$라는 퍼텐셜이 추가되죠. 이것이 바로 빈 공간의 굴곡을 만들어 입자를 이끄는 보이지 않는 힘입니다.',
        en: "Separating the real part yields an energy conservation equation identical to classical Newtonian mechanics. The only difference is the addition of the $Q_s$ potential, which represents the invisible force warping empty space to guide the particle."
      },
      simMode: 'slit'
    },
    {
      id: 11,
      period: '3교시',
      periodTitle: { ko: '위상학적 정칙화 및 결어긋남', en: 'Topological Regularization & Decoherence' },
      title: { ko: 'The Nodal Singularity Dilemma (마디점 특이점의 딜레마)', en: 'The Nodal Singularity Dilemma' },
      bullets: [
        { type: 'header', ko: '치명적 위기 (The Problem)', en: 'The Problem' },
        { type: 'bullet', ko: '이중 슬릿의 어두운 무늬, 즉 상쇄 간섭 마디(Destructive interference nodes)에서는 파동의 진폭 $R \\to 0$이 됨.', en: 'At the dark fringes of the double-slit, i.e., destructive interference nodes, the amplitude $R \\to 0$.' },
        { type: 'header', ko: '수학적 붕괴 (Mathematical Collapse)', en: 'Mathematical Collapse' },
        { type: 'bullet', ko: '분모가 0이 되므로 $Q_s \\to -\\frac{\\hbar^2}{2m r^2}$ 로 중력장처럼 발산.', en: 'Because the denominator becomes zero, $Q_s \to -\\frac{\\hbar^2}{2m r^2}$, diverging to infinity.' },
        { type: 'bullet', ko: '무한 인력 우물(Infinite attractive well)이 형성되어, 입자가 블랙홀처럼 이곳에 영원히 갇혀야 하는 물리적 모순 발생!', en: 'This creates an infinite attractive well. The particle would be trapped forever like a black hole, creating a physical contradiction!' }
      ],
      script: {
        ko: '기존 결정론적 연구자들을 평생 괴롭혀온 \'특이점(Singularity)\' 문제입니다. 파동이 0이 되는 곳에서 수학이 붕괴하며 무한대의 인력이 생깁니다. 이 논문은 이것을 어떻게 피했을까요?',
        en: "This is the 'singularity' problem that plagued deterministic researchers for a lifetime. Where the wave is zero, mathematics collapses and infinite attractive force emerges. How did this paper avoid this?"
      },
      simMode: 'omega'
    },
    {
      id: 12,
      period: '3교시',
      periodTitle: { ko: '위상학적 정칙화 및 결어긋남', en: 'Topological Regularization & Decoherence' },
      title: { ko: 'Topological Regularization (위상학적 정칙화)', en: 'Topological Regularization' },
      bullets: [
        { type: 'header', ko: '우리의 발견 (Our Discovery)', en: 'Our Discovery' },
        { type: 'bullet', ko: '마디점은 단순한 0이 아니라, 공간이 회전하는 양자화된 위상 소용돌이(Quantized Topological Vortices)이다!', en: 'The node is not a simple zero, but a quantized topological vortex where space itself rotates!' },
        { type: 'bullet', ko: '소용돌이 근처에서 위상 기울기: $|\\nabla S| = \\hbar/r$', en: 'Phase gradient near the vortex core: $|\\nabla S| = \\hbar/r$' },
        { type: 'header', ko: '원심 위상 운동 에너지 (Centrifugal Phase Kinetic Energy)', en: 'Centrifugal Phase Kinetic Energy' },
        { type: 'bullet', ko: '$$ \\frac{(\\nabla S)^2}{2m} = +\\frac{\\hbar^2}{2mr^2} $$', en: '$$ \\frac{(\\nabla S)^2}{2m} = +\\frac{\\hbar^2}{2mr^2} $$' },
        { type: 'header', ko: '정확한 상쇄 (Exact Cancellation)', en: 'Exact Cancellation' },
        { type: 'bullet', ko: '$$ \\frac{(\\nabla S)^2}{2m} + Q_s = \\mathbf{+\\frac{\\hbar^2}{2mr^2} - \\frac{\\hbar^2}{2mr^2} = 0} \\quad (\\text{as } r \\to 0) $$', en: '$$ \\frac{(\\nabla S)^2}{2m} + Q_s = \\mathbf{+\\frac{\\hbar^2}{2mr^2} - \\frac{\\hbar^2}{2mr^2} = 0} \\quad (\\text{as } r \\to 0) $$' }
      ],
      script: {
        ko: '이 논문의 가장 아름다운 수학적 클라이맥스입니다. 무한대의 블랙홀을 소용돌이의 원심력이 소수점 끝까지 정확하게 0으로 상쇄시켜(+와 -) 버립니다. 임의의 컷오프(Cutoff) 없이 입자가 특이점을 스스로 피해 가는 것입니다!',
        en: "This is the most beautiful mathematical climax of this paper. The centrifugal force of the vortex cancels out the infinite black-hole-like attraction to exactly zero, digit by digit. The particle bypasses the singularity naturally without any arbitrary cutoff!"
      },
      simMode: 'omega'
    },
    {
      id: 13,
      period: '3교시',
      periodTitle: { ko: '위상학적 정칙화 및 결어긋남', en: 'Topological Regularization & Decoherence' },
      title: { ko: 'Quantum Decoherence (양자 결어긋남과 위상 난류)', en: 'Quantum Decoherence & Phase Turbulence' },
      bullets: [
        { type: 'header', ko: '측정이란 무엇인가? (Measurement Problem)', en: 'Measurement Problem' },
        { type: 'bullet', ko: '"관측 장비는 미시계 입장에서 거대한 고온의 열역학적 노이즈 덩어리이다."', en: '"A measurement apparatus is a massive, warm thermodynamic noise source to a microscopic particle."' },
        { type: 'header', ko: '위상 난류 (Phase Turbulence)', en: 'Phase Turbulence' },
        { type: 'bullet', ko: '장비와의 상호작용($H_{int}$)이 공간 위상($S$)에 고주파 열역학적 노이즈를 흔들어 주입함.', en: 'Interaction with the apparatus ($H_{int}$) injects high-frequency thermodynamic noise into the spatial phase ($S$).' },
        { type: 'bullet', ko: '잔잔했던 공간 파도에 \'난기류\'가 발생하여 입자 궤적의 규칙성을 흩트려 놓음.', en: 'This creates turbulence in the calm spatial waves, scrambling the particle trajectories.' },
        { type: 'header', ko: '밀도 행렬의 붕괴 (Density Matrix Collapse)', en: 'Density Matrix Collapse' },
        { type: 'bullet', ko: '앙상블 평균을 취하면 비대각 간섭 항이 지수함수적으로 소멸함: $\\langle e^{i(S_A - S_B)/\\hbar} \\rangle \\to 0$.', en: 'Taking ensemble averages causes off-diagonal interference terms to decay exponentially: $\\langle e^{i(S_A - S_B)/\\hbar} \\rangle \\to 0$.' }
      ],
      script: {
        ko: '파동 함수의 붕괴는 마법이 아닙니다. 빛(광자)을 쏘아 관측하는 행위 자체가 잔잔한 연못(공간)에 바위를 던지는 것과 같습니다. 공간에 \'위상 난류\'가 생겨 파도가 깨지며 간섭 무늬가 사라지는 지극히 기계적인 현상입니다.',
        en: 'The collapse of the wave function is not magic. Firing light (photons) to observe is like throwing a stone into a calm pond. It generates phase turbulence in space, breaking the wave order and making the interference pattern disappear—a purely mechanical process.'
      },
      simMode: 'decoherence'
    },
    {
      id: 14,
      period: '3교시',
      periodTitle: { ko: '위상학적 정칙화 및 결어긋남', en: 'Topological Regularization & Decoherence' },
      title: { ko: 'Falsifiable Prediction (반증 가능한 예측)', en: 'Falsifiable Prediction' },
      bullets: [
        { type: 'header', ko: '텐서-열역학적 척도 법칙 (Tensor-Thermodynamic Scaling Law)', en: 'Tensor-Thermodynamic Scaling Law' },
        { type: 'bullet', ko: '$$ \\tau_{dec} \\sim \\frac{\\hbar (\\rho_{\\mathrm{fluid}} c^2) d^3}{(k_B T_{vac})^2} $$', en: '$$ \\tau_{dec} \\sim \\frac{\\hbar (\\rho_{\\mathrm{fluid}} c^2) d^3}{(k_B T_{vac})^2} $$' },
        { type: 'header', ko: '물리적 의미 (Physical Meaning)', en: 'Physical Meaning' },
        { type: 'bullet', ko: '결어긋남에 걸리는 시간($\\tau_{dec}$)이 진공 온도($T_{vac}$)의 제곱에 반비례($\\propto T_{vac}^{-2}$)함.', en: 'The decoherence time ($\\tau_{dec}$) is inversely proportional to the square of the vacuum temperature ($T_{vac}$): $\\tau_{dec} \\propto T_{vac}^{-2}$.' },
        { type: 'bullet', ko: '이는 기존 마르코프(Markovian) 모델과는 확연히 다른 비선형적 결과로, 향후 초정밀 실험을 통해 이론을 검증할 수 있는 지표.', en: 'This non-linear scaling differs from standard linear Markovian decay, offering a concrete target for future high-precision testing to verify or falsify the theory.' }
      ],
      script: {
        ko: '우리의 가설은 단순한 해석에 그치지 않고 구체적인 수식으로 반증 가능한 예측을 던집니다. 결어긋남 시간이 진공 온도의 제곱에 반비례한다는 이 법칙은 먼 훗날 초정밀 검증 실험에서 진위를 가려줄 것입니다.',
        en: "Our hypothesis goes beyond interpretation and offers a concrete scaling law. The prediction that the decoherence time scales inversely with the square of the vacuum temperature will serve as a clear verification benchmark in future ultra-precise quantum experiments."
      },
      simMode: 'decoherence'
    },
    {
      id: 15,
      period: '3교시',
      periodTitle: { ko: '위상학적 정칙화 및 결어긋남', en: 'Topological Regularization & Decoherence' },
      title: { ko: 'The Macro-Micro Boundary (거시-미시 경계와 관성 억제)', en: 'The Macro-Micro Boundary' },
      bullets: [
        { type: 'header', ko: '고전적 극한 질문 (The Question)', en: 'The Classical Limit Question' },
        { type: 'bullet', ko: '왜 행성이나 야구공은 이중 슬릿 무늬를 만들지 않을까?', en: 'Why don\'t macroscopic objects like planets or baseballs produce double-slit interference patterns?' },
        { type: 'header', ko: '관성 억제 (Inertial Suppression)', en: 'Inertial Suppression' },
        { type: 'bullet', ko: '$$ \\sum_{m \\to \\infty} \\mathbf{F}_{\\mathrm{space}} = 0 $$', en: '$$ \\lim_{m \\to \\infty} \\mathbf{F}_{\\mathrm{space}} = 0 $$' },
        { type: 'bullet', ko: '질량($m$)이 커질수록 고전적 관성(Inertia)이 압도적으로 강해져, 공간이 미는 미세한 힘($\\mathbf{F}_{\\mathrm{space}}$)은 완전히 짓눌려 무시됨.', en: 'As mass ($m$) increases, classical inertia dominates, rendering the tiny guiding force ($\\mathbf{F}_{\\mathrm{space}}$) exerted by spatial fluctuations completely negligible.' },
        { type: 'header', ko: '뉴턴 역학으로의 수렴 (Conclusion)', en: 'Conclusion' },
        { type: 'bullet', ko: '결론: 미시 세계의 방정식이 질량이 커짐에 따라 고전적인 뉴턴 역학($F=ma$)으로 완벽히 수렴함.', en: 'Conclusion: The microscopic equations naturally converge to macroscopic Newtonian behavior ($F=ma$).' }
      ],
      script: {
        ko: '질량이 너무 커지면 어떻게 될까요? 공간 요동이 입자를 밀치려는 미세한 힘은 입자의 거대한 관성 때문에 100% 무시됩니다. 그렇게 수학은 자연스럽게 뉴턴 역학의 F=ma로 수렴해 갑니다.',
        en: "What happens when mass becomes very large? The tiny kick from spatial fluctuations is 100% suppressed by the object's massive classical inertia. Thus, the mathematics naturally converges back to Newtonian physics, F=ma."
      },
      simMode: 'mass'
    },
    {
      id: 16,
      period: '마무리',
      periodTitle: { ko: '질의응답 및 시뮬레이션 시연', en: 'Q&A and Interactive Sandbox' },
      title: { ko: 'Conclusion (결론)', en: 'Conclusion' },
      bullets: [
        { type: 'header', ko: '1. 결정론적 기하역학 (Deterministic Geomechanics)', en: '1. Deterministic Geomechanics' },
        { type: 'bullet', ko: '양자역학은 주사위 놀이가 아니라, 공간 진동과 입자 간의 실제 기하학적 상호작용이다.', en: 'Quantum mechanics is not a roll of dice, but the local interaction between spatial vibration and physical particles.' },
        { type: 'header', ko: '2. 수학적 엄밀성 (Mathematical Rigor)', en: '2. Mathematical Rigor' },
        { type: 'bullet', ko: '비선형 마찰항과 위상 소용돌이 상쇄 원리로 확률 비보존 및 특이점 붕괴 문제를 완전하게 해결했다.', en: 'The real-valued non-linear friction and topological vortex cancellation successfully resolve probability non-conservation and singularity collapse.' },
        { type: 'header', ko: '3. 동역학적 결어긋남 (Dynamical Decoherence)', en: '3. Dynamical Decoherence' },
        { type: 'bullet', ko: '관측 붕괴를 형이상학에서 끌어내려 \'위상 난류(Phase Turbulence)\'라는 실제적인 유체역학 현상으로 규명했다.', en: 'Measurement collapse is demystified from metaphysics into a fluid-dynamical phenomenon of \'phase turbulence\' caused by thermodynamic noise.' },
        { type: 'header', ko: '4. 3차원 국소적 확장', en: '4. Multiply-connected 3D Space' },
        { type: 'bullet', ko: '추상적인 $3N$ 다차원에 의존하지 않고, 3D 물리 공간의 다중 연결 위상(Multiply-connected topology)으로 양자 얽힘을 국소적으로 설명할 길을 열었다.', en: 'Bypassing $3N$-dimensional spaces, this opens a path to describe entanglement using 3D physical multiply-connected topology.' }
      ],
      script: {
        ko: '오늘 강의의 요약입니다. 공간의 물리적 진동, 그리고 소용돌이 소멸을 통한 특이점 정칙화, 측정에 따른 위상 난류. 우리는 이제 결정론적인 3차원 기하학적 세계로 우주를 돌아볼 수 있는 튼튼한 토대를 마련했습니다.',
        en: "To summarize today's lecture: the physical vibration of space, the singularity regularization via vortex cancellation, and the phase turbulence of measurement. We have established a firm geomechanical foundation to view our universe deterministically in 3D space."
      },
      simMode: 'slit'
    },
    {
      id: 17,
      period: '마무리',
      periodTitle: { ko: '질의응답 및 시뮬레이션 시연', en: 'Q&A and Interactive Sandbox' },
      title: { ko: 'Q&A and Interactive Sandbox (질의응답)', en: 'Q&A and Interactive Sandbox' },
      bullets: [
        { type: 'header', ko: '경청해 주셔서 감사합니다', en: 'Thank You for Your Attention' },
        { type: 'bullet', ko: '대학생 및 연구자 분들의 소중한 관심에 깊이 감사드립니다.', en: 'Thank you very much for your interest and support.' },
        { type: 'header', ko: '시뮬레이터 시연 및 조작', en: 'Interactive Sandbox Demonstration' },
        { type: 'bullet', ko: '오른쪽의 시뮬레이터에서 파동 간섭, 점성 감쇠 및 다중 연결 위상 결합 등을 직접 매개변수를 바꾸며 조작해 보세요.', en: 'An interactive dashboard is prepared for you to directly manipulate parameters (Mass, Slit Spacing, Viscosity) and visualize this model in the browser.' },
        { type: 'bullet', ko: '🔗 **공식 DOI:** [10.5281/zenodo.21206211](https://doi.org/10.5281/zenodo.21206211)', en: '🔗 **Official DOI:** [10.5281/zenodo.21206211](https://doi.org/10.5281/zenodo.21206211)' },
        { type: 'header', ko: '다음 강의 예고', en: 'Next Lecture Teaser' },
        { type: 'bullet', ko: '이 미세 공간 진동이 거시 우주 스케일로 확장되면 무슨 일이 생길까요? 암흑 물질과 에너지를 설명하는 **Part II: Cosmological Vibration**에서 만나뵙겠습니다.', en: 'What happens when these microscopic spatial vibrations expand to the cosmos? See you in Part II, addressing Dark Matter and Dark Energy!' }
      ],
      script: {
        ko: '오늘 긴 시간 경청해 주셔서 감사합니다. 이제 여러분이 직접 이 방정식의 파동과 마찰, 특이점 소용돌이를 웹 환경에서 조작해 보실 수 있는 시뮬레이션 샌드박스를 시연해 드리겠습니다. 궁금한 점이 있으시다면 언제든 질문해 주세요.',
        en: 'Thank you for listening. Now I will demonstrate the interactive sandbox where you can play with the wave interference, friction damping, and topological vortex bypass directly in the web browser. I would be happy to take any questions you have.'
      },
      simMode: 'slit'
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
        <title>Lecture Presentation | Mechanics of Spatial Vibration I</title>
        <meta name="description" content="Lecture presentation slides and interactive physics sandbox for Mechanics of Spatial Vibration I." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;755;855&family=Outfit:wght@400;500;600;700;850&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>

      {/* Top Banner Ribbon */}
      <div className="h-9 bg-[#8b1a1a] text-white text-[11px] px-6 py-2 font-mono flex justify-between items-center border-b border-[#721515] relative z-40 shrink-0 select-none">
        <div className="flex items-center gap-4">
          <Link href="/papers" className="hover:text-zinc-200 transition-colors font-bold flex items-center gap-1">
            <span>← ACADEMIC ARCHIVE</span>
          </Link>
          <span className="opacity-40">|</span>
          <span className="font-bold tracking-widest uppercase font-mono">Mechanics of Spatial Vibration I Lecture</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-black/30 text-[10px] px-2 py-0.5 rounded font-bold border border-white/10 font-mono hidden sm:inline">DOI: 10.5281/zenodo.21206211</span>
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
                  Mechanics of Spatial Vibration I • Slide {currentSlide.id}
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
                        <div className="bg-zinc-950/80 border border-zinc-850 rounded-md p-2 shadow-inner flex flex-col relative h-full min-h-0 overflow-hidden">
                          <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono mb-1.5 border-b border-zinc-900 pb-1 shrink-0 select-none">
                            <span className="flex items-center gap-1.5 font-bold">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                              LIVE SIMULATOR INTERACTIVE
                            </span>
                            <span className="text-zinc-400 capitalize bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-[8px]">Mode: {currentSlide.simMode}</span>
                          </div>
                          
                          <div className="flex-1 w-full overflow-hidden flex items-center justify-center rounded border border-zinc-900 bg-black/60 min-h-0">
                            <SimulationWidget initialMode={currentSlide.simMode} compact={true} />
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
              
              <div className="flex-1 bg-zinc-900/40 border border-zinc-850 rounded p-3.5 font-serif text-[13px] text-zinc-200 leading-relaxed text-justify overflow-y-auto shadow-inner border-t-2 border-t-[#8b1a1a] flex flex-col justify-center items-center min-h-0">
                {isUnlocked ? (
                  <div className="w-full h-full text-zinc-200">
                    {renderTextWithMath(currentSlide.script[lang])}
                  </div>
                ) : (
                  <div className="text-center space-y-3 p-4 select-none my-auto">
                    <div className="text-zinc-600 text-2xl">🔒</div>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {lang === 'ko' ? '스크립트를 보려면 비밀번호를 입력하세요.' : 'Enter passcode to view script.'}
                    </p>
                    <div className="flex gap-1.5 justify-center">
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (passcode === 'spatial' || passcode === '1030')) {
                            setIsUnlocked(true);
                          }
                        }}
                        placeholder="Passcode..."
                        className="bg-zinc-950 border border-zinc-800 text-zinc-300 focus:border-zinc-700 text-xs rounded px-2.5 py-1 outline-none font-mono text-center w-28"
                      />
                      <button
                        onClick={() => {
                          if (passcode === 'spatial' || passcode === '1030') {
                            setIsUnlocked(true);
                          }
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-zinc-300 text-[10px] font-bold font-mono px-3 py-1 rounded border border-zinc-700 transition-colors"
                      >
                        Unlock
                      </button>
                    </div>
                    <p className="text-[8px] text-zinc-600 font-mono">Hint: spatial</p>
                  </div>
                )}
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
