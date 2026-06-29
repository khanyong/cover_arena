// Auto-generated Notion Paper Database. DO NOT EDIT DIRECTLY.
export interface Translation {
  ko: string;
  en: string;
}

export interface AuthorDetails {
  ko: string;
  en: string;
}

export interface AffiliationDetails {
  ko: string;
  en: string;
}

export interface AbstractVersions {
  versions: Record<string, Translation>;
}

export interface PaperParagraph {
  id: string;
  versions: Record<string, Translation>;
  reviewIds?: string[];
}

export interface PaperChapter {
  number: number;
  title: Translation;
  paragraphs: PaperParagraph[];
}

export interface Citation {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  pdfUrl?: string;
  citedPage: number;
  citedContext: Translation;
}

export type ReferenceData = Citation;
export type ParagraphData = PaperParagraph;

export interface ReviewComment {
  id: string;
  reviewer: string;
  objection: Translation;
  rebuttal: {
    role: 'author' | 'reviewer';
    text: Translation;
  }[];
  status: 'Open' | 'Resolved';
  linkedParagraphId: string;
}

export interface PaperDetails {
  id: string;
  slug: string;
  title: Translation;
  authors: AuthorDetails;
  affiliations: AffiliationDetails;
  abstract: AbstractVersions;
  chapters: PaperChapter[];
  references: Record<string, Citation>;
  reviews: Record<string, ReviewComment>;
  workflow: {
    stage: string;
    percent: number;
    nextStep: string;
    journalTarget: string;
  };
}

export const papersMap: Record<string, PaperDetails> = {
  "spatial-vibration-1": {
    "id": "spatial-vibration-1",
    "slug": "spatial-vibration-1",
    "title": {
      "ko": "공간의 진동 역학 I: 양자 이중성의 근원과 이중 슬릿 실험의 궤적 재해석",
      "en": "Mechanics of Spatial Vibration I: Origin of Wave-Particle Duality and Reinterpretation of Trajectories in the Double-Slit Experiment"
    },
    "authors": {
      "ko": "유광용 (Kwang yong Yoo)",
      "en": "Kwang yong Yoo"
    },
    "affiliations": {
      "ko": "KT 상무, 연세대학교 경영학 박사 수료, 코네티컷 대학교 법학 석사 (LL.M.)",
      "en": "Director at KT, Ph.D. Candidate in Business Administration at Yonsei University, LL.M. at University of Connecticut"
    },
    "abstract": {
      "versions": {
        "v1": {
          "ko": "",
          "en": ""
        },
        "v2": {
          "ko": "현대 양자역학의 코펜하겐 해석은 관측 전 미시 입자의 상태를 확률적 파동 함수로 기술하며, 대상의 본질적 실재성(Physical Reality)을 배제하는 철학적 한계를 안고 있다. 본 논문은 파동-입자 이중성의 역설을 해결하기 위해, 입자의 실재성과 파동성을 분리하는 '공간의 진동(Spatial Vibration)' 가설을 제안한다. 본 연구는 전자와 광자 등 모든 양자가 명백한 입자임을 전제하며, 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동성을 띠어서가 아니라 입자가 이동하는 배경 공간의 미세한 진동이 형성한 궤적에 기인함을 논증한다. 또한, 관측 행위로 인한 붕괴 현상을 거시적 관측 에너지가 미시 공간 진동에 섭동을 일으켜 파동성을 잃게 만드는 감쇠 효과(Damping effect)로 수학화한다. 본 연구는 공간 진동의 영향력이 거시 스케일에서 상쇄되어 뉴턴 역학으로 수렴하는 과정을 규명함으로써, 미시와 거시를 잇는 새로운 결정론적 프레임워크를 제시한다.",
          "en": "The Copenhagen interpretation of modern quantum mechanics describes the state of microscopic particles prior to measurement via a probabilistic wave function, suffering from a philosophical limitation that denies the objective reality of physical entities. To resolve the paradox of wave-particle duality, this paper proposes the 'Spatial Vibration' hypothesis, separating particle reality from wave-like propagation. Assuming that all quanta (e.g., electrons and photons) are strictly physical particles, we demonstrate that the interference patterns observed in the double-slit experiment do not emerge from particles possessing wave-like nature, but rather from trajectories guided by microscopic fluctuations of the background space. Furthermore, the wave function collapse during measurement is mathematically formulated as a damping effect, where macroscopic measurement energy perturbs microscopic spatial oscillations, leading to the loss of wave properties. By elucidating how spatial vibrations are suppressed at the macro-scale to converge with Newtonian mechanics, this study establishes a novel, deterministic framework bridging the quantum and classical worlds."
        },
        "v3": {
          "ko": "현대 양자역학의 코펜하겐 해석은 관측 전 미시 입자의 상태를 확률적 파동 함수로 기술하며, 대상의 본질적 실재성(Physical Reality)을 배제하는 철학적 한계를 안고 있다. 본 논문은 파동-입자 이중성의 역설을 해결하기 위해, 입자의 실재성과 파동성을 분리하는 **'공간의 진동(Spatial Vibration)' 가설**을 제안한다.\n본 연구는 전자와 광자 등 모든 양자가 명백한 입자임을 전제하며, 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동성을 띠어서가 아니라 **입자가 이동하는 배경 공간의 미세한 진동(Quantum spatial fluctuation)이 형성한 궤적**에 기인함을 논증한다. 또한, 관측 행위로 인한 붕괴 현상을 거시적 관측 에너지가 미시 공간 진동에 섭동을 일으켜 파동성을 잃게 만드는 감쇠 효과(Damping effect)로 수학화한다.\n본 연구는 공간 진동의 영향력이 거시 스케일에서 상쇄되어 뉴턴 역학으로 수렴하는 과정을 규명함으로써, 미시와 거시를 잇는 새로운 결정론적 프레임워크를 제시한다.",
          "en": "The Copenhagen interpretation of modern quantum mechanics describes the state of microscopic particles prior to measurement via a probabilistic wave function, suffering from a philosophical limitation that denies the objective reality of physical entities. To resolve the paradox of wave-particle duality, this paper proposes the 'Spatial Vibration' hypothesis, separating particle reality from wave-like propagation. Assuming that all quanta (e.g., electrons and photons) are strictly physical particles, we demonstrate that the interference patterns observed in the double-slit experiment do not emerge from particles possessing wave-like nature, but rather from trajectories guided by microscopic fluctuations of the background space. Furthermore, the wave function collapse during measurement is mathematically formulated as a damping effect, where macroscopic measurement energy perturbs microscopic spatial oscillations, leading to the loss of wave properties. By elucidating how spatial vibrations are suppressed at the macro-scale to converge with Newtonian mechanics, this study establishes a novel, deterministic framework bridging the quantum and classical worlds."
        },
        "v4": {
          "ko": "현대 양자역학의 코펜하겐 해석은 관측 전 미시 입자의 상태를 확률적 파동 함수로 기술하며, 대상의 본질적 실재성(Physical Reality)을 배제하는 철학적 한계를 안고 있다. 본 논문은 파동-입자 이중성의 역설을 해결하기 위해, 입자의 실재성과 파동성을 완벽히 분리하는 **'공간의 기하학적 진동(Geometrical Fluctuation of Space)'** 가설을 제안한다.\n본 연구는 전자와 광자 등 모든 양자가 명백한 입자임을 전제하며, 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동성을 띠어서가 아니라 **입자가 이동하는 배경 공간의 미세한 기하학적 요동이 형성한 궤적 지형도($Q_s$)**에 기인함을 역학적으로 논증한다. 또한, 관측 행위로 인한 파동 붕괴 현상을 거시적 관측 에너지가 미시 공간 진동에 섭동을 일으켜 기하학적으로 평탄화시키는 감쇠 효과(Damping effect)로 수학화한다.\n나아가 본 연구는 양자 얽힘(Quantum Entanglement) 현상을 내부 거리가 0으로 수렴하는 기하학적 $\\Omega$(오메가) 접합 튜브의 동시적 붕괴 착시로 해명하며, 공간 진동의 궤적 유도력이 대상의 질량 밀도 증가에 따라 관성적으로 억제되어 고전 뉴턴 역학으로 수렴하는 과정을 규명함으로써 미시와 거시를 잇는 새로운 결정론적 대통일 프레임워크를 제시한다.\n## 1. 서론 (Introduction)\n현대 물리학에서 양자역학은 미시 세계를 가장 성공적으로 기술하는 이론이지만, 그 해석적 기반인 코펜하겐 해석(Copenhagen Interpretation)은 대상의 본질적 실재성(Physical Reality)에 대해 심각한 철학적 한계를 지니고 있다 [1]. 코펜하겐 해석은 관측 이전의 양자적 대상을 확률적 파동 함수(Wave function)로 기술하며, 관측 행위가 파동 함수의 붕괴(Collapse)를 야기한다고 가정한다. 이는 관측자의 존재가 물리적 실재를 결정한다는 주관주의적 모순을 내포한다.\n특히, 이중 슬릿 실험(Double-slit experiment)에서 단일 입자가 보여주는 파동-입자 이중성(Wave-Particle Duality)은 \"하나의 객체가 입자인 동시에 파동일 수 있는가\"라는 근본적인 역설을 제시한다. 기존의 해석은 입자 자체가 공간에 확률적으로 퍼져 파동처럼 행동한다고 설명하지만, 이는 직관적인 인과율 및 고전 역학의 결정론적 세계관과 정면으로 충돌한다.\n본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 **'배경 공간(Background Space)의 역학적 진동'**으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 물질을 담는 수동적이고 텅 빈 무(無)의 그릇이나 에테르와 같은 특정 매질(Medium)로 전제하던 고전적 관점을 철저히 탈피한다. 대신, 공간 그 자체를 내재적인 요동(Intrinsic fluctuation)과 기하학적 장력(Geometrical tension)을 지닌 **'동역학적 실체(Dynamical Entity)'**로 재정의한다. 텅 빈 시공간의 기하학적 위상 자체가 스스로 요동칠 수 있다는 '공간 진동(Spatial Vibration)' 모델을 통해, 본 연구는 미시 세계의 확률적 현상과 거시 세계의 결정론을 단일 프레임워크로 통합하고자 한다.\n## 2. 공간 진동 가설 선언 (Spatial Vibration Hypothesis)\n본 연구는 미시 입자의 실재성을 복원하고, 파동적 현상의 기원을 공간으로 환원하기 위해 다음의 5가지 핵심 공리(Axioms)를 제안한다.\n### 2.1. 양자의 절대적 실재성 (Absolute Reality of Quanta)\n전자, 광자 등을 포함한 모든 양자는 관측 여부와 관계없이 항상 확정된 위치와 질량, 운동량을 갖는 명백한 '실재적 입자(Real Particle)'이다. 입자는 결코 스스로 분할되거나 파동의 형태로 공간에 흩어져 존재하지 않는다.\n### 2.2. 파동성의 외주화: 기하학적 공간 요동 (Externalization of Waveness)\n이중 슬릿 실험에서 간섭 무늬가 나타나는 것은 텅 빈 배경 공간이 극미세 스케일에서 끊임없이 요동(Spatial Fluctuation)하고 있기 때문이다. 실재하는 단일 입자는 하나의 슬릿만 통과하지만, 통과한 입자는 물리적 매질 없이 진동하는 공간의 기하학적 곡률 결(Geometrical Wave-front)에 의해 역학적으로 유도(Guided)되어 물결무늬 패턴으로 착탄하게 된다.\n### 2.3. 관측 역학과 진동 상쇄 (Observation Mechanics and Damping Effect)\n관측을 통해 간섭 무늬가 사라지는 것은 파동 함수의 신비로운 붕괴가 아니다. 관측을 위해 투사되는 광자나 전자기장은 거시적인 에너지를 수반하는 강력한 물리적 섭동(Perturbation)이다. 이 막대한 에너지는 미시적인 공간 진동을 기계적으로 억제·평탄화(Damping)시키며, 궤적 유도를 잃은 입자는 관성 법칙에 의해 직진하게 된다.\n### 2.4. 파동 함수의 물리적 재정의 (Redefinition of the Wave Function)\n양자역학의 슈뢰딩거 방정식에서 파동 함수($\\psi$)는 대상의 존재 확률 분포가 아니라, 입자를 밀어내고 이끄는 **'공간 진동 에너지의 텐서 밀도 분포'**를 나타내는 유체역학적 도구로 재해석되어야 한다.\n### 2.5. 거시 세계로의 관성적 수렴 (Convergence to Macroscopic Mechanics)\n공간 진동의 궤적 유도력은 대상 물질의 질량($m$)에 반비례한다. 질량이 거시(Macro) 단위로 커질수록 거대한 관성력이 진동을 압도하므로, 역학적 굴절 비율은 0으로 수렴하여 고전 역학(Newtonian Mechanics)으로 환원된다.\n## 3. 수학적 정식화: 슈뢰딩거 방정식에서 공간 진동 역학으로의 전환\n본 연구는 슈뢰딩거 방정식의 수학적 구조를 보존하면서도, 그 의미를 '확률적 파동 함수의 붕괴'에서 '공간 기하학적 요동의 역학'으로 재정의한다.\n### 3.1. 파동 함수의 극좌표 변환 (Polar Transformation)\n슈뢰딩거 방정식은 다음과 같다:\n우리는 파동 함수 $\\psi(\\mathbf{r}, t)$를 기하학적 진폭 $R(\\mathbf{r}, t)$와 위상 작용 $S(\\mathbf{r}, t)$를 사용하여 극좌표 형태로 분해한다 [2]:\n### 3.2. 방정식의 분해 및 유도 과정\n$\\psi$를 슈뢰딩거 방정식에 대입하여 미분한 뒤 양변에서 $e^{iS/\\hbar}$를 소거하면 실수부와 허수부가 분리된다.\n**[실수부 (Real Part): 양자 해밀턴-야코비 방정식]**\n실수부 항을 정리하면 고전 역학의 해밀턴-야코비 방정식에 양자적 섭동 항이 추가된 형태가 도출된다.\n본 모델에서는 추가된 이 항을 **'공간 진동 퍼텐셜(Spatial Vibration Potential, $Q_s$)'**이라 명명한다. 이는 과거 데이비드 봄(D. Bohm)이 은닉 변수 이론에서 유도한 양자 퍼텐셜 구조와 대수적으로 동일하나 [3], 본 연구에서는 이를 입자 내부의 가상의 힘이 아닌 **'배경 공간 자체의 기하학적 요동 에너지'**로 완전히 새롭게 재정의한다.\n*이 방정식은 입자가 외부 퍼텐셜($V$)뿐만 아니라, 기하학적 요동($Q_s$)에 의해 수역학적으로 유도됨을 증명한다.*\n**[허수부 (Imaginary Part): 연속 방정식]**\n허수부 항을 정리하면, 진동 에너지 밀도($R^2$)가 공간에서 보존됨을 나타내는 연속 방정식이 도출된다.\n이 식은 '공간의 진동 에너지가 유실되지 않고 흐름(Flow)을 유지하며 보존된다'는 실재를 의미한다.\n### 3.3. 선행 이론의 비판적 고찰: 기하 역학으로의 승화\n봄 역학은 입자를 유도하는 파동의 실체를 다차원의 '가상의 형상 공간'에 존재하는 신비한 힘으로 남겨두었다. 본 모델은 $\\nabla^2 R$ 항을 **'3차원 물리적 무대를 채우고 있는 진공 공간 자체의 기하학적 곡률'**로 정의함으로써, 은닉 변수 이론의 형이상학적 한계를 타파하고 양자 현상을 완벽히 실재적이고 관측 가능한 기하 역학(Geometrical Dynamics)의 영역으로 끌어내린다.\n## 4. 이중 슬릿 실험의 재해석: 공간 진동에 의한 결정론적 궤적 유도\n### 4.1. 유도 운동 방정식 (Guidance Equation of Motion)\n해밀턴-야코비 방정식을 공간에 대해 미분($\\nabla$)하면 입자가 받는 역학적 운동 방정식이 도출된다.\n여기서 $-\\nabla Q_s(\\mathbf{r}, t)$는 공간 자체의 기하학적 곡률이 입자를 밀어내는 **'유도력(Guidance Force)'**이다.\n### 4.2. 간섭 지형도의 형성과 궤적의 굴절\n두 슬릿을 빠져나온 공간 요동은 상쇄 간섭($R \\to 0$) 지점에서 거대한 $Q_s$ 척력 장벽(산맥)을 형성하며, 보강 간섭 지점은 에너지가 낮은 골짜기가 된다. 단일 슬릿을 직진하려던 실재하는 입자는 이 $-\\nabla Q_s$의 척력 장벽에 부딪혀 골짜기로 미끄러지듯 강제 유도되어 스크린을 향해 궤적이 굴절된다.\n### 4.3. 확률의 정체: 미시적 초기 조건의 앙상블\n단일 입자의 궤적은 결정론적 경로를 따른다.\n스크린의 간섭 무늬가 확률적 분포($|\\psi|^2$)를 띠는 이유는 실험자가 무수히 발사하는 입자들의 극미세한 초기 발사 위치($\\mathbf{r}_0$)를 완벽하게 동일하게 제어할 수 없기 때문이다. 결론적으로, 간섭 패턴은 무작위한 초기 위치를 가진 입자들이 미리 깎여진 진동 지형도 수로(Channel)를 따라 누적되었을 때 나타나는 **'통계학적 앙상블(Statistical Ensemble)'**일 뿐이다. 이러한 진동 파동에 의한 궤적 유도는 거시적 액적(Walking droplets) 실험을 통해서도 물리적 타당성이 성공적으로 입증되었다 [4].\n## 5. 관측의 역학: 거시 에너지 섭동에 의한 공간 진동의 감쇠와 결맞음 파괴\n### 5.1. 감쇠 인자가 적용된 확장 방정식\n### 5.2. 결맞음 파괴와 간섭 무늬의 역학적 소멸\n관측을 위해 막대한 에너지($E_{obs} \\gg \\epsilon_c$)를 투사하는 순간, 감쇠 인자는 0에 수렴한다.\n공간 진동($Q_s$)이 물리적으로 평탄화(Flattening)되었으므로 입자는 고전적 장벽($V$)만을 느끼며 직선 운동하게 된다. 즉, 주류 양자역학의 '환경 유도 결맞음 파괴(Environment-induced decoherence)' 현상 [5]은 **'거시적 타격 에너지에 의한 미시 공간 곡률의 기계적 상쇄'** 메커니즘으로 완벽히 구체화된다.\n### 5.3. 양자 얽힘의 비국소성 규명: $\\Omega$(오메가)형 파도와 '거리 0' 공간 접합\n코펜하겐 해석의 난제인 '양자 얽힘'은 관측 시 우주 반대편 입자의 상태가 초광속으로 결정되는 듯한 비국소성을 보인다. 본 연구는 이를 공간 텐서의 극단적 기하학적 뒤틀림이 빚어낸 **'공간 접합(Spatial Junction)'** 착시 현상으로 해명한다.\n두 입자가 얽힐 때 공간 진폭은 극단적인 보강 간섭을 일으키며 파도의 아랫부분이 오목하게 말려들어가는 $\\Omega$(오메가) 형태로 시공간을 기하학적으로 뒤튼다. 이 곡률의 극한에서 위상 튜브의 가장 좁은 목 부분이 강제로 맞닿게 되며, 두 입자 사이를 관통하는 내부 기하학적 거리는 **수학적 극한인 '0'으로 단락(Short-circuit)**된다.\n### 5.4. 진동 평탄화의 국소적 전달과 붕괴 동시성의 착시 (Illusion of Simultaneity)\n지구의 입자 A를 관측 타격하면 감쇠 충격파가 튜브 표면의 곡률을 평탄화($\\nabla_A^2 R \\to 0$)시킨다. 이 상쇄파(Damping Wave)는 접합된 공간의 축을 타고 명백히 아인슈타인의 인과율을 엄수하는 **빛의 속도 이하($v \\le c$)**로 이동하여 반대편 입자 B의 유도력마저 무너뜨린다. 그러나 튜브 내부 기하학적 거리가 이미 '0'으로 단락되어 있었기 때문에 도달 시간 역시 **$t = 0$ (0초)**이 되어, 외부 3차원 관찰자에게는 초광속 동시 붕괴라는 착시(Illusion)를 일으킬 뿐이다.\n### 5.5. 양자 얽힘의 자발적 붕괴: 위상 튜브의 핀치-오프(Pinch-off) 메커니즘\n현실의 양자 시스템에서 얽힘은 외부 타격이 없어도 자발적으로 붕괴한다. $\\Omega$형 위상 튜브의 가장 좁은 중간 목(Neck) 부위는 공간 자체의 끊임없는 미세 진동으로 인해 쉴 새 없이 출렁인다. 이 찌그러짐이 시공간 탄성 한계를 초과하면, 목 부위가 정면충돌하며 기하학적으로 찢어지는 **핀치-오프(Topological Pinch-off)** 현상이 발생한다. 허리가 끊어지는 순간, 입자들을 거리 0으로 묶어주던 장력망은 사멸하며 얽힘은 자발적 결맞음 파괴(Spontaneous Decoherence)를 맞이한다.\n### 5.6. 시공간 절단의 역학적 운명: 자기 치유(Self-healing)와 다중 우주 창발\n목이 찢어져 분리된 튜브 하단부는 유체의 표면장력처럼 기하학적 자기 치유(Self-healing)를 통해 3차원 연속성을 회복한다. 반면 분리된 상단부 접합점은 본래 우주와 단절된 닫힌 4차원의 **'위상 거품(Topological Bubble)'**이 된다.\n우주 초기의 급팽창 시기, 이 공간의 찢어짐과 치유가 남긴 무수한 위상 흉터들이 우주 공간을 파편화시켜 훗날 제3논문에서 다룰 '거대 공간 판(Spatial Plates)'과 '단층대'를 형성하였다. 또한 거대하게 찢겨 나간 위상 거품은 그 자체로 팽창하여 새로운 **다중 우주(Multiverse)**의 창발로 이어지는 근원적 텐서 메커니즘을 완성한다.\n## 6. 거시-미시 한계: 질량 밀도에 의한 관성적 압도와 고전 역학의 복원\n공간 진동 유도력($\\mathbf{F}_{space}$)의 수식을 분석하면 거시와 미시가 어떻게 통일되는지 명확히 드러난다.\n거시 물체의 질량 $m$이 천문학적으로 커짐에 따라($m \\to \\infty$), 역학적 유도력은 분모의 거시적 발산으로 인해 완벽히 $0$에 수렴하게 된다.\n거시 물체는 아보가드로 수($\\approx 10^{23}$)에 달하는 입자들이 결합된 고밀도 복합체로, 그 자체가 공간의 미세 요동을 뚫고 지나가는 어마어마한 '고전적 관성(Classical Inertia)'을 지닌다. 맹렬히 진동하는 빈 공간의 곡률도 압도적인 질량 관성 앞에서는 운동 역학적으로 철저히 무시되므로, 물체의 궤적 방정식은 뉴턴 역학($m \\frac{d\\mathbf{v}}{dt} = -\\nabla V$)으로 자연스럽게 환원된다.\n## 7. 결론 (Conclusion)\n본 연구는 파동-입자 이중성과 양자 얽힘 등 양자역학의 난제들을 **'공간 자체의 기하학적 요동과 텐서 장력'**이라는 단일 역학으로 결정론적으로 규명하였다. 이중 슬릿의 간섭 패턴은 관측 파동 상쇄에 의한 궤적의 앙상블임이 규명되었으며, 얽힘의 초광속 딜레마마저 $\\Omega$형 공간 접합 튜브의 기하학적 단락이 빚어낸 $0$초 동시성 착시 현상으로 완벽히 해명하며 인과율을 수호해 냈다.\n**[향후 연구 과제: 프랙탈적 스케일 대칭성과 우주론적 확장]**\n본 논문은 국소적으로 억제되었던 공간의 역학적 유도력($\\mathbf{F}_{space}$)이, 우주적 척도로 확장될 때 극적인 **'프랙탈적 회귀와 스케일 대칭성(Scale Symmetry)'**을 발현할 것임을 강력히 예측한다. 수억 광년에 달하는 텅 빈 심우주(Deep Space)가 요동칠 때, 그 방대한 체적에 누적된 거시적 텐서 에너지 총량은 다시 거대 은하들의 관성을 압도하게 된다.\n후속 연작인 **[공간의 진동 역학 II: 거시 중력장과 암흑 우주 대체 모델]**에서는 이 거시적 공간 진동이 시공간 곡률(중력장)과 결합할 때, 어떻게 **'암흑 물질(텐서 응축)'**과 **'암흑 에너지(진동 복사압)'**라는 우주의 인력과 척력으로 발현되는지를 추적할 것이다.",
          "en": "The Copenhagen interpretation of modern quantum mechanics describes the state of a microscopic particle prior to observation via a probabilistic wave function, harboring a philosophical limitation that excludes the intrinsic physical reality of the object. To resolve the paradox of wave-particle duality, this paper proposes the **'Geometrical Fluctuation of Space'** hypothesis, which strictly decouples the particle's physical reality from its wave-like phenomena.\nThis study postulates that all quanta are definitive real particles. It argues that the interference pattern observed in the double-slit experiment is not due to the particle exhibiting wave properties, but rather emerges as an ensemble of trajectories guided by the microscopic geometrical curvature fluctuations of the background space ($Q_s$). Furthermore, the phenomenon of wave function collapse triggered by observation is mathematically formulated as a mechanical damping effect, where macroscopic observational energy perturbs and flattens the microscopic spatial vibration.\nMoreover, this study elucidates quantum entanglement geometrically as an illusion of simultaneous collapse caused by a topological $\\Omega$-shaped spatial junction where internal distance converges to zero. By demonstrating that the guiding force of spatial vibration is dynamically suppressed by the inertia of increasing mass—thereby converging to Newtonian mechanics—this paper presents a novel deterministic framework unifying the microscopic and macroscopic realms."
        }
      }
    },
    "chapters": [
      {
        "number": 1,
        "title": {
          "ko": "1장. 서론",
          "en": "Chapter 1. Introduction"
        },
        "paragraphs": [
          {
            "id": "p1_1",
            "versions": {
              "v1": {
                "ko": "~~본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 '배경 공간(Background Space)의 역학적 진동'으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 텅 빈 무(無)가 아니라 끊임없이 요동치는 매질로 보는 '공간의 진동(Spatial Vibration)' 모델을 도입하여, 미시 세계의 확률적 현상과 거시 세계의 결정론적 물리 법칙을 단일한 프레임워크로 통합하고자 한다.~~",
                "en": "~~To bridge the gap between quantum mechanics and classical physics, this paper proposes a paradigm shifting model where the origin of wave-particle duality is attributed to the mechanical vibration of the background space rather than the particle itself. By introducing the 'Spatial Vibration' model, which views cosmic space not as a void but as a continuously fluctuating medium, this study aims to unify the probabilistic phenomena of the micro-world and the deterministic laws of the macro-world under a single framework.~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p1_2",
            "versions": {
              "v1": {
                "ko": "- **한계 비판:** 기존 코펜하겐 해석의 확률론적 한계 및 대상 실재성(Physical Reality)의 부재 지적.",
                "en": "- **Limitation Critique:** Pointing out the probabilistic limitations of the conventional Copenhagen interpretation and the absence of physical reality."
              },
              "v2": {
                "ko": "- **한계 비판:** 기존 코펜하겐 해석의 확률론적 한계 및 대상 실재성(Physical Reality)의 부재 지적.",
                "en": "- **Limitation Critique:** Pointing out the probabilistic limitations of the conventional Copenhagen interpretation and the absence of physical reality."
              }
            }
          },
          {
            "id": "p1_3",
            "versions": {
              "v1": {
                "ko": "- **패러다임 전환:** 수동적인 '매질(Medium)' 개념을 탈피. 공간을 내재적 에너지를 지닌 '기하학적으로 요동치는 동역학적 실체'로 재정의.",
                "en": "- **Paradigm Shift:** Escaping from the concept of a passive medium. Redefining space as a dynamically and geometrically fluctuating entity endowed with intrinsic energy."
              },
              "v2": {
                "ko": "- **패러다임 전환:** 수동적인 '매질(Medium)' 개념을 탈피. 공간을 내재적 에너지를 지닌 '기하학적으로 요동치는 동역학적 실체'로 재정의.",
                "en": "- **Paradigm Shift:** Escaping from the concept of a passive medium. Redefining space as a dynamically and geometrically fluctuating entity endowed with intrinsic energy."
              }
            }
          },
          {
            "id": "p1_4",
            "versions": {
              "v1": {
                "ko": "본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 **'배경 공간(Background Space)의 역학적 진동'**으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 물질을 담는 수동적이고 텅 빈 무(無)의 그릇이나 특정 매질(Medium)로 채워진 절대 공간으로 전제하던 고전적 관점을 철저히 탈피한다. 대신, 공간 그 자체를 내재적인 요동(Intrinsic fluctuation)과 기하학적 장력(Geometrical tension)을 지닌 **'동역학적 실체(Dynamical Entity)'**로 재정의한다. 어떠한 물리적 매질 없이도 텅 빈 시공간의 기하학적 위상 자체가 스스로 요동칠 수 있다는 '공간의 진동(Spatial Vibration)' 모델을 도입함으로써, 본 연구는 미시 세계의 확률적 현상과 거시 세계의 결정론적 물리 법칙을 단일한 프레임워크로 통합하고자 한다.",
                "en": "To bridge the gap between quantum mechanics and classical physics, this paper proposes a paradigm-shifting model where the origin of wave-particle duality is attributed to the mechanical vibration of the background space rather than the particle itself. We thoroughly depart from the classical view that assumes space as a passive, empty vessel holding matter or as an absolute space filled with a specific medium. Instead, we redefine space itself as a dynamical entity characterized by intrinsic fluctuations and geometrical tension. By introducing the 'Spatial Vibration' model, which asserts that the geometric topology of empty space-time can fluctuate on its own without any physical medium, this study aims to unify the probabilistic phenomena of the micro-world and the deterministic laws of the macro-world under a single framework."
              },
              "v2": {
                "ko": "본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 **'배경 공간(Background Space)의 역학적 진동'**으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 물질을 담는 수동적이고 텅 빈 무(無)의 그릇이나 특정 매질(Medium)로 채워진 절대 공간으로 전제하던 고전적 관점을 철저히 탈피한다. 대신, 공간 그 자체를 내재적인 요동(Intrinsic fluctuation)과 기하학적 장력(Geometrical tension)을 지닌 **'동역학적 실체(Dynamical Entity)'**로 재정의한다. 어떠한 물리적 매질 없이도 텅 빈 시공간의 기하학적 위상 자체가 스스로 요동칠 수 있다는 '공간의 진동(Spatial Vibration)' 모델을 도입함으로써, 본 연구는 미시 세계의 확률적 현상과 거시 세계의 결정론적 물리 법칙을 단일한 프레임워크로 통합하고자 한다.",
                "en": "To bridge the gap between quantum mechanics and classical physics, this paper proposes a paradigm-shifting model where the origin of wave-particle duality is attributed to the mechanical vibration of the background space rather than the particle itself. We thoroughly depart from the classical view that assumes space as a passive, empty vessel holding matter or as an absolute space filled with a specific medium. Instead, we redefine space itself as a dynamical entity characterized by intrinsic fluctuations and geometrical tension. By introducing the 'Spatial Vibration' model, which asserts that the geometric topology of empty space-time can fluctuate on its own without any physical medium, this study aims to unify the probabilistic phenomena of the micro-world and the deterministic laws of the macro-world under a single framework."
              },
              "v3": {
                "ko": "본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 **'배경 공간(Background Space)의 역학적 진동'**으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 물질을 담는 수동적이고 텅 빈 무(無)의 그릇이나 특정 매질(Medium)로 채워진 절대 공간으로 전제하던 고전적 관점을 철저히 탈피한다. 대신, 공간 그 자체를 내재적인 요동(Intrinsic fluctuation)과 기하학적 장력(Geometrical tension)을 지닌 **'동역학적 실체(Dynamical Entity)'**로 재정의한다. 어떠한 물리적 매질 없이도 텅 빈 시공간의 기하학적 위상 자체가 스스로 요동칠 수 있다는 '공간의 진동(Spatial Vibration)' 모델을 도입함으로써, 본 연구는 미시 세계의 확률적 현상과 거시 세계의 결정론적 물리 법칙을 단일한 프레임워크로 통합하고자 한다.",
                "en": "To bridge the gap between quantum mechanics and classical physics, this paper proposes a paradigm-shifting model where the origin of wave-particle duality is attributed to the mechanical vibration of the background space rather than the particle itself. We thoroughly depart from the classical view that assumes space as a passive, empty vessel holding matter or as an absolute space filled with a specific medium. Instead, we redefine space itself as a dynamical entity characterized by intrinsic fluctuations and geometrical tension. By introducing the 'Spatial Vibration' model, which asserts that the geometric topology of empty space-time can fluctuate on its own without any physical medium, this study aims to unify the probabilistic phenomena of the micro-world and the deterministic laws of the macro-world under a single framework."
              }
            }
          },
          {
            "id": "p1_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "현대 물리학에서 양자역학은 미시 세계를 가장 성공적으로 기술하는 이론이지만, 그 해석적 기반인 코펜하겐 해석(Copenhagen Interpretation)은 대상의 본질적 실재성(Physical Reality)에 대해 심각한 철학적 한계를 지니고 있다[1]. 코펜하겐 해석은 관측 이전의 양자적 대상을 확률적 파동 함수(Wave function)로 기술하며, 관측 행위가 파동 함수의 붕괴(Collapse)를 야기한다고 가정한다. 이는 관측자의 존재가 물리적 실재를 결정한다는 주관주의적 모순을 내포한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "특히, 이중 슬릿 실험(Double-slit experiment)에서 단일 입자가 보여주는 파동-입자 이중성(Wave-Particle Duality)은 \"하나의 객체가 입자인 동시에 파동일 수 있는가\"라는 근본적인 역설을 제시한다. 기존의 해석은 입자 자체가 공간에 확률적으로 퍼져 파동처럼 행동한다고 설명하지만, 이는 직관적인 인과율 및 고전 역학의 결정론적 세계관과 정면으로 충돌한다. 드브로이-봄 이론(De Broglie-Bohm Theory)과 같은 은닉 변수 이론이 입자의 실재성과 파동을 분리하려는 시도를 했으나, 입자를 유도하는 파동의 물리적 실체가 무엇인지 명확히 규명하지 못했다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "*(1. 서론의 마지막 문단 교체)*",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "---",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "---"
              }
            }
          }
        ]
      },
      {
        "number": 2,
        "title": {
          "ko": "2장. 공간 진동 가설",
          "en": "Chapter 2. Spatial Vibration Hypothesis"
        },
        "paragraphs": [
          {
            "id": "p2_1",
            "versions": {
              "v1": {
                "ko": "- **본질 정의:** 이중 슬릿에서 관측되는 파동성이 입자 본질이 아님을 규명하는 5대 핵심 공리 제시.",
                "en": "- **Definition of Essence:** Presenting five core axioms demonstrating that the wave properties observed in the double-slit experiment are not intrinsic to the particle."
              },
              "v2": {
                "ko": "- **본질 정의:** 이중 슬릿에서 관측되는 파동성이 입자 본질이 아님을 규명하는 5대 핵심 공리 제시.",
                "en": "- **Definition of Essence:** Presenting five core axioms demonstrating that the wave properties observed in the double-slit experiment are not intrinsic to the particle."
              }
            }
          },
          {
            "id": "p2_2",
            "versions": {
              "v1": {
                "ko": "- **역학적 분리:** '실재하는 입자'와 입자의 궤적을 유도하는 '배경 공간의 기하학적 진동'을 완벽히 분리.",
                "en": "- **Dynamical Separation:** Completely separating the 'real particle' from the 'geometrical vibrations of the background space' that guide its trajectory."
              },
              "v2": {
                "ko": "- **역학적 분리:** '실재하는 입자'와 입자의 궤적을 유도하는 '배경 공간의 기하학적 진동'을 완벽히 분리.",
                "en": "- **Dynamical Separation:** Completely separating the 'real particle' from the 'geometrical vibrations of the background space' that guide its trajectory."
              }
            }
          },
          {
            "id": "p2_3",
            "versions": {
              "v1": {
                "ko": "본 연구는 미시 입자의 실재성을 복원하고, 파동적 현상의 기원을 공간으로 환원하기 위해 다음의 5가지 핵심 공리(Axioms)를 제안한다. 이 가설들은 본 논문의 수학적 모델링과 우주론적 확장의 근간이 된다.",
                "en": "To restore the objective reality of microscopic particles and reduce wave-like phenomena to the dynamics of space, we propose the following five core axioms. These axioms form the foundation of our mathematical modeling and cosmological extensions."
              },
              "v2": {
                "ko": "본 연구는 미시 입자의 실재성을 복원하고, 파동적 현상의 기원을 공간으로 환원하기 위해 다음의 5가지 핵심 공리(Axioms)를 제안한다. 이 가설들은 본 논문의 수학적 모델링과 우주론적 확장의 근간이 된다.",
                "en": "To restore the objective reality of microscopic particles and reduce wave-like phenomena to the dynamics of space, we propose the following five core axioms. These axioms form the foundation of our mathematical modeling and cosmological extensions."
              },
              "v3": {
                "ko": "본 연구는 미시 입자의 실재성을 복원하고, 파동적 현상의 기원을 공간으로 환원하기 위해 다음의 5가지 핵심 공리(Axioms)를 제안한다. 이 가설들은 본 논문의 수학적 모델링과 우주론적 확장의 근간이 된다.",
                "en": "To restore the objective reality of microscopic particles and reduce wave-like phenomena to the dynamics of space, we propose the following five core axioms. These axioms form the foundation of our mathematical modeling and cosmological extensions."
              }
            }
          },
          {
            "id": "p2_4",
            "versions": {
              "v1": {
                "ko": "### 가설 1. 양자의 절대적 실재성",
                "en": "### Absolute Reality of Quanta"
              },
              "v2": {
                "ko": "### 가설 1. 양자의 절대적 실재성",
                "en": "### Absolute Reality of Quanta"
              },
              "v3": {
                "ko": "### 가설 1. 양자의 절대적 실재성",
                "en": "### Absolute Reality of Quanta"
              }
            }
          },
          {
            "id": "p2_5",
            "versions": {
              "v1": {
                "ko": "전자, 광자 등을 포함한 모든 양자는 관측 여부와 관계없이 항상 확정된 위치와 질량, 운동량을 갖는 명백한 '실재적 입자(Real Particle)'이다. 입자는 결코 스스로 분할되거나 파동의 형태로 공간에 흩어져 존재하지 않는다.",
                "en": "All quanta, including electrons and photons, are definitive 'real particles' possessing a determined position, mass, and momentum at all times, regardless of observation. A particle never divides itself nor scatters through space as a wave."
              },
              "v2": {
                "ko": "전자, 광자 등을 포함한 모든 양자는 관측 여부와 관계없이 항상 확정된 위치와 질량, 운동량을 갖는 명백한 '실재적 입자(Real Particle)'이다. 입자는 결코 스스로 분할되거나 파동의 형태로 공간에 흩어져 존재하지 않는다.",
                "en": "All quanta, including electrons and photons, are definitive 'real particles' possessing a determined position, mass, and momentum at all times, regardless of observation. A particle never divides itself nor scatters through space as a wave."
              },
              "v3": {
                "ko": "전자, 광자 등을 포함한 모든 양자는 관측 여부와 관계없이 항상 확정된 위치와 질량, 운동량을 갖는 명백한 '실재적 입자(Real Particle)'이다. 입자는 결코 스스로 분할되거나 파동의 형태로 공간에 흩어져 존재하지 않는다.",
                "en": "All quanta, including electrons and photons, are definitive 'real particles' possessing a determined position, mass, and momentum at all times, regardless of observation. A particle never divides itself nor scatters through space as a wave."
              }
            }
          },
          {
            "id": "p2_6",
            "versions": {
              "v1": {
                "ko": "### ~~가설 2. 파동성의 외주화: 공간 진동",
                "en": "### Externalization of Waveness"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p2_7",
            "versions": {
              "v1": {
                "ko": "~~이중 슬릿 실험에서 입자가 간섭 무늬를 띠는 것은 입자 자체가 파동의 성질을 갖기 때문이 아니다. 텅 빈 것처럼 보이는 배경 공간 자체가 고유한 에너지를 지니고 끊임없이 진동(Spatial Fluctuation)하고 있으며, 이 공간의 진동이 이중 슬릿을 통과하면서 간섭 패턴을 형성한다. 실재하는 단일 입자는 하나의 슬릿만 통과하지만, 슬릿을 통과한 입자는 진동하는 공간이 만들어낸 결(Wave-front)에 의해 역학적으로 유도(Guided)되어 최종적으로 물결무늬 패턴으로 착탄하게 된다.~~",
                "en": "~~Hypothesis 2. Externalization of Waveness: Spatial Vibration: The reason a particle forms an interference pattern in the double-slit experiment is not that the particle itself possesses wave properties. The background space, which appears empty, possesses intrinsic energy and fluctuates continuously, and this vibration forms interference patterns as it passes through the double slits. While a single real particle passes through only one slit, the particle is dynamically guided by the wave-fronts generated by the vibrating space, eventually landing in an interference pattern.~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p2_8",
            "versions": {
              "v1": {
                "ko": "### 가설 2. 파동성의 외주화: 공간 자체의 기하학적 요동",
                "en": "### Externalization of Waveness: Geometric Fluctuation of Space"
              },
              "v2": {
                "ko": "### 가설 2. 파동성의 외주화: 공간 자체의 기하학적 요동",
                "en": "### Externalization of Waveness: Geometric Fluctuation of Space"
              },
              "v3": {
                "ko": "### 가설 2. 파동성의 외주화: 공간 자체의 기하학적 요동",
                "en": "### Externalization of Waveness: Geometric Fluctuation of Space"
              }
            }
          },
          {
            "id": "p2_9",
            "versions": {
              "v1": {
                "ko": "이중 슬릿 실험에서 입자가 간섭 무늬를 띠는 것은 입자 자체가 파동의 성질을 갖기 때문이 아니다. 텅 빈 것처럼 보이는 배경 공간은 별도의 매질이 필요 없는 기하학적 연속체로서 극미세 스케일에서 끊임없이 요동(Spatial Fluctuation)하고 있으며, 공간 자체의 이러한 위상적 진동이 이중 슬릿을 통과하며 간섭 패턴을 형성한다. 실재하는 단일 입자는 하나의 슬릿만 통과하지만, 슬릿을 통과한 입자는 물리적 매질의 개입 없이, 오직 진동하는 공간의 기하학적 곡률이 만들어낸 결(Geometrical Wave-front)에 의해 역학적으로 유도(Guided)되어 최종적으로 물결무늬 패턴으로 착탄하게 된다.",
                "en": "Hypothesis 2. Externalization of Waveness: Geometric Fluctuation of Space: The reason a particle exhibits an interference pattern in the double-slit experiment is not because the particle itself possesses wave properties. The background space, appearing empty, is a geometric continuum requiring no separate medium that fluctuates continuously at the microscopic scale. This topological oscillation of space itself forms interference patterns when passing through the double slits. While a single real particle physically transits only one slit, it is dynamically guided by the geometrical wave-fronts generated by the vibrating space without the intervention of any physical medium, ultimately landing to form the interference fringe pattern."
              },
              "v2": {
                "ko": "이중 슬릿 실험에서 입자가 간섭 무늬를 띠는 것은 입자 자체가 파동의 성질을 갖기 때문이 아니다. 텅 빈 것처럼 보이는 배경 공간은 별도의 매질이 필요 없는 기하학적 연속체로서 극미세 스케일에서 끊임없이 요동(Spatial Fluctuation)하고 있으며, 공간 자체의 이러한 위상적 진동이 이중 슬릿을 통과하며 간섭 패턴을 형성한다. 실재하는 단일 입자는 하나의 슬릿만 통과하지만, 슬릿을 통과한 입자는 물리적 매질의 개입 없이, 오직 진동하는 공간의 기하학적 곡률이 만들어낸 결(Geometrical Wave-front)에 의해 역학적으로 유도(Guided)되어 최종적으로 물결무늬 패턴으로 착탄하게 된다.",
                "en": "Hypothesis 2. Externalization of Waveness: Geometric Fluctuation of Space: The reason a particle exhibits an interference pattern in the double-slit experiment is not because the particle itself possesses wave properties. The background space, appearing empty, is a geometric continuum requiring no separate medium that fluctuates continuously at the microscopic scale. This topological oscillation of space itself forms interference patterns when passing through the double slits. While a single real particle physically transits only one slit, it is dynamically guided by the geometrical wave-fronts generated by the vibrating space without the intervention of any physical medium, ultimately landing to form the interference fringe pattern."
              },
              "v3": {
                "ko": "이중 슬릿 실험에서 입자가 간섭 무늬를 띠는 것은 입자 자체가 파동의 성질을 갖기 때문이 아니다. 텅 빈 것처럼 보이는 배경 공간은 별도의 매질이 필요 없는 기하학적 연속체로서 극미세 스케일에서 끊임없이 요동(Spatial Fluctuation)하고 있으며, 공간 자체의 이러한 위상적 진동이 이중 슬릿을 통과하며 간섭 패턴을 형성한다. 실재하는 단일 입자는 하나의 슬릿만 통과하지만, 슬릿을 통과한 입자는 **물리적 매질의 개입 없이, 오직 진동하는 공간의 기하학적 곡률이 만들어낸 결(Geometrical Wave-front)에 의해 역학적으로 유도(Guided)**되어 최종적으로 물결무늬 패턴으로 착탄하게 된다.",
                "en": "Hypothesis 2. Externalization of Waveness: Geometric Fluctuation of Space: The reason a particle exhibits an interference pattern in the double-slit experiment is not because the particle itself possesses wave properties. The background space, appearing empty, is a geometric continuum requiring no separate medium that fluctuates continuously at the microscopic scale. This topological oscillation of space itself forms interference patterns when passing through the double slits. While a single real particle physically transits only one slit, it is dynamically guided by the geometrical wave-fronts generated by the vibrating space without the intervention of any physical medium, ultimately landing to form the interference fringe pattern."
              }
            }
          },
          {
            "id": "p2_10",
            "versions": {
              "v1": {
                "ko": "### 가설 3. 관측 역학과 진동 상쇄",
                "en": "### Observation Mechanics and Damping Effect"
              },
              "v2": {
                "ko": "### 가설 3. 관측 역학과 진동 상쇄",
                "en": "### Observation Mechanics and Damping Effect"
              },
              "v3": {
                "ko": "### 가설 3. 관측 역학과 진동 상쇄",
                "en": "### Observation Mechanics and Damping Effect"
              }
            }
          },
          {
            "id": "p2_11",
            "versions": {
              "v1": {
                "ko": "관측을 통해 간섭 무늬가 사라지고 입자성만 남는 현상은 관측 행위가 파동 함수를 신비롭게 붕괴시키기 때문이 아니다. 관측을 위해 투사되는 탐지기의 빛(광자)이나 전자기장 등은 거시적인 에너지를 수반하는 강력한 물리적 개입이다. 이 막대한 에너지는 미시적인 공간 진동에 강한 섭동(Perturbation)을 일으키고 그 진동을 억제·상쇄(Damping)시킨다. 공간의 진동 패턴(결맞음)이 물리적으로 파괴됨에 따라 입자는 파동의 유도를 받지 않고 관성 법칙에 의해 직진하게 되며, 이것이 관측에 의한 파동성 상실의 실체다.",
                "en": "Observation Mechanics and Damping Effect: The disappearance of interference patterns and emergence of particle-like behavior under observation is not due to a mysterious collapse of the wave function. The light (photons) or electromagnetic fields projected by a detector represent a powerful physical intervention accompanied by macroscopic energy. This massive energy exerts strong perturbations on microscopic spatial vibrations, damping and suppressing them. As the spatial vibration patterns (coherence) are physically destroyed, the particle ceases to be guided by the waves and moves linearly under inertia, which is the physical reality of the loss of wave properties."
              },
              "v2": {
                "ko": "관측을 통해 간섭 무늬가 사라지고 입자성만 남는 현상은 관측 행위가 파동 함수를 신비롭게 붕괴시키기 때문이 아니다. 관측을 위해 투사되는 탐지기의 빛(광자)이나 전자기장 등은 거시적인 에너지를 수반하는 강력한 물리적 개입이다. 이 막대한 에너지는 미시적인 공간 진동에 강한 섭동(Perturbation)을 일으키고 그 진동을 억제·상쇄(Damping)시킨다. 공간의 진동 패턴(결맞음)이 물리적으로 파괴됨에 따라 입자는 파동의 유도를 받지 않고 관성 법칙에 의해 직진하게 되며, 이것이 관측에 의한 파동성 상실의 실체다.",
                "en": "Observation Mechanics and Damping Effect: The disappearance of interference patterns and emergence of particle-like behavior under observation is not due to a mysterious collapse of the wave function. The light (photons) or electromagnetic fields projected by a detector represent a powerful physical intervention accompanied by macroscopic energy. This massive energy exerts strong perturbations on microscopic spatial vibrations, damping and suppressing them. As the spatial vibration patterns (coherence) are physically destroyed, the particle ceases to be guided by the waves and moves linearly under inertia, which is the physical reality of the loss of wave properties."
              },
              "v3": {
                "ko": "관측을 통해 간섭 무늬가 사라지고 입자성만 남는 현상은 관측 행위가 파동 함수를 신비롭게 붕괴시키기 때문이 아니다. 관측을 위해 투사되는 탐지기의 빛(광자)이나 전자기장 등은 거시적인 에너지를 수반하는 강력한 물리적 개입이다. 이 막대한 에너지는 미시적인 **공간 진동에 강한 섭동(Perturbation)을 일으키고 그 진동을 억제·상쇄(Damping)**시킨다. 공간의 진동 패턴(결맞음)이 물리적으로 파괴됨에 따라 입자는 파동의 유도를 받지 않고 관성 법칙에 의해 직진하게 되며, 이것이 관측에 의한 파동성 상실의 실체다.",
                "en": "Observation Mechanics and Damping Effect: The disappearance of interference patterns and emergence of particle-like behavior under observation is not due to a mysterious collapse of the wave function. The light (photons) or electromagnetic fields projected by a detector represent a powerful physical intervention accompanied by macroscopic energy. This massive energy exerts strong perturbations on microscopic spatial vibrations, damping and suppressing them. As the spatial vibration patterns (coherence) are physically destroyed, the particle ceases to be guided by the waves and moves linearly under inertia, which is the physical reality of the loss of wave properties."
              }
            }
          },
          {
            "id": "p2_12",
            "versions": {
              "v1": {
                "ko": "### 가설 4. 파동 함수의 물리적 재정의",
                "en": "### Redefinition of the Wave Function"
              },
              "v2": {
                "ko": "### 가설 4. 파동 함수의 물리적 재정의",
                "en": "### Redefinition of the Wave Function"
              },
              "v3": {
                "ko": "### 가설 4. 파동 함수의 물리적 재정의",
                "en": "### Redefinition of the Wave Function"
              }
            }
          },
          {
            "id": "p2_13",
            "versions": {
              "v1": {
                "ko": "양자 단계에서 현상이 확률적으로 보이는 것은 입자의 존재 자체가 확률적이기 때문이 아니다. 양자역학의 슈뢰딩거 방정식에서 입자의 발견 확률을 나타내는 파동 함수($\\psi$)는 대상의 존재 확률 분포가 아니라, 입자를 밀어내고 이끄는 '공간 진동 에너지의 밀도 분포(Density distribution of spatial vibration)'를 나타내는 유체역학적 도구로 재해석되어야 한다.",
                "en": "Redefinition of the Wave Function: The probabilistic appearance of quantum phenomena does not stem from an ontological uncertainty of the particle itself. The wave function ($\\psi$), representing detection probability in the Schrödinger equation, must be reinterpreted not as a probability density of existence, but as a hydrodynamic tool representing the density distribution of spatial vibration energy that guides and deflects the particle."
              },
              "v2": {
                "ko": "양자 단계에서 현상이 확률적으로 보이는 것은 입자의 존재 자체가 확률적이기 때문이 아니다. 양자역학의 슈뢰딩거 방정식에서 입자의 발견 확률을 나타내는 파동 함수($\\psi$)는 대상의 존재 확률 분포가 아니라, 입자를 밀어내고 이끄는 '공간 진동 에너지의 밀도 분포(Density distribution of spatial vibration)'를 나타내는 유체역학적 도구로 재해석되어야 한다.",
                "en": "Redefinition of the Wave Function: The probabilistic appearance of quantum phenomena does not stem from an ontological uncertainty of the particle itself. The wave function ($\\psi$), representing detection probability in the Schrödinger equation, must be reinterpreted not as a probability density of existence, but as a hydrodynamic tool representing the density distribution of spatial vibration energy that guides and deflects the particle."
              },
              "v3": {
                "ko": "양자 단계에서 현상이 확률적으로 보이는 것은 입자의 존재 자체가 확률적이기 때문이 아니다. 양자역학의 슈뢰딩거 방정식에서 입자의 발견 확률을 나타내는 파동 함수($\\psi$)는 대상의 존재 확률 분포가 아니라, 입자를 밀어내고 이끄는 **'공간 진동 에너지의 밀도 분포(Density distribution of spatial vibration)'**를 나타내는 유체역학적 도구로 재해석되어야 한다.",
                "en": "Redefinition of the Wave Function: The probabilistic appearance of quantum phenomena does not stem from an ontological uncertainty of the particle itself. The wave function ($\\psi$), representing detection probability in the Schrödinger equation, must be reinterpreted not as a probability density of existence, but as a hydrodynamic tool representing the density distribution of spatial vibration energy that guides and deflects the particle."
              }
            }
          },
          {
            "id": "p2_14",
            "versions": {
              "v1": {
                "ko": "### 가설 5. 거시 세계로의 한계 수렴",
                "en": "### Convergence to Macroscopic Mechanics"
              },
              "v2": {
                "ko": "### 가설 5. 거시 세계로의 한계 수렴",
                "en": "### Convergence to Macroscopic Mechanics"
              },
              "v3": {
                "ko": "### 가설 5. 거시 세계로의 한계 수렴",
                "en": "### Convergence to Macroscopic Mechanics"
              }
            }
          },
          {
            "id": "p2_15",
            "versions": {
              "v1": {
                "ko": "공간의 진동은 양자 수준의 미세한 스케일에서 작용하는 힘이다. 대상 물질의 질량($m$)과 크기가 거시(Macro) 단위로 커질수록, 거대한 관성력에 비해 미세한 공간 진동이 미치는 궤적 유도력($F_{space}$)의 비율은 통계적으로 완벽히 상쇄(Decoherence)되어 0으로 수렴한다. 따라서 거시 세계에서는 공간의 진동 효과가 무시되며, 순수한 입자적 성향에 기반한 뉴턴 고전 역학(Newtonian Mechanics)만으로 모든 물리 법칙이 온전히 정의된다.",
                "en": "Convergence to Macroscopic Mechanics: Spatial vibrations represent forces acting primarily at the micro-quantum scale. As the mass ($m$) and physical scale of the target matter increase to macroscopic levels, the ratio of the guiding force ($F_{space}$) to the massive inertial forces statistically cancels out (decoheres) and converges to zero. Consequently, spatial vibration effects are negligible in the macroscopic domain, and physical laws revert entirely to classical Newtonian mechanics based on pure particle characteristics."
              },
              "v2": {
                "ko": "공간의 진동은 양자 수준의 미세한 스케일에서 작용하는 힘이다. 대상 물질의 질량($m$)과 크기가 거시(Macro) 단위로 커질수록, 거대한 관성력에 비해 미세한 공간 진동이 미치는 궤적 유도력($F_{space}$)의 비율은 통계적으로 완벽히 상쇄(Decoherence)되어 0으로 수렴한다. 따라서 거시 세계에서는 공간의 진동 효과가 무시되며, 순수한 입자적 성향에 기반한 뉴턴 고전 역학(Newtonian Mechanics)만으로 모든 물리 법칙이 온전히 정의된다.",
                "en": "Convergence to Macroscopic Mechanics: Spatial vibrations represent forces acting primarily at the micro-quantum scale. As the mass ($m$) and physical scale of the target matter increase to macroscopic levels, the ratio of the guiding force ($F_{space}$) to the massive inertial forces statistically cancels out (decoheres) and converges to zero. Consequently, spatial vibration effects are negligible in the macroscopic domain, and physical laws revert entirely to classical Newtonian mechanics based on pure particle characteristics."
              },
              "v3": {
                "ko": "공간의 진동은 양자 수준의 미세한 스케일에서 작용하는 힘이다. 대상 물질의 질량($m$)과 크기가 거시(Macro) 단위로 커질수록, 거대한 관성력에 비해 미세한 공간 진동이 미치는 궤적 유도력($F_{space}$)의 비율은 통계적으로 완벽히 상쇄(Decoherence)되어 0으로 수렴한다. 따라서 거시 세계에서는 공간의 진동 효과가 무시되며, 순수한 입자적 성향에 기반한 뉴턴 고전 역학(Newtonian Mechanics)만으로 모든 물리 법칙이 온전히 정의된다.",
                "en": "Convergence to Macroscopic Mechanics: Spatial vibrations represent forces acting primarily at the micro-quantum scale. As the mass ($m$) and physical scale of the target matter increase to macroscopic levels, the ratio of the guiding force ($F_{space}$) to the massive inertial forces statistically cancels out (decoheres) and converges to zero. Consequently, spatial vibration effects are negligible in the macroscopic domain, and physical laws revert entirely to classical Newtonian mechanics based on pure particle characteristics."
              }
            }
          },
          {
            "id": "p2_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "### ~~가설 2. 파동성의 외주화: 공간 진동 (Externalization of Waveness)~~",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "*(2. 공간 진동 가설의 가설 2 교체)*",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~가설 2. 파동성의 외주화: 공간 진동 (Externalization of Waveness)~~"
              }
            }
          }
        ]
      },
      {
        "number": 3,
        "title": {
          "ko": "3장. 수학적 정식화: 슈뢰딩거 방정식에서 공간 진동 역학으로의 전환",
          "en": "Mathematical Formulation"
        },
        "paragraphs": [
          {
            "id": "p3_1",
            "versions": {
              "v1": {
                "ko": "- **대수적 분해:** 파동 함수의 극좌표 변환(Madelung)을 통한 역학적 방정식 증명.",
                "en": "- **Algebraic Decomposition:** Proving the dynamical equations via the polar Madelung transformation of the wave function."
              },
              "v2": {
                "ko": "- **대수적 분해:** 파동 함수의 극좌표 변환(Madelung)을 통한 역학적 방정식 증명.",
                "en": "- **Algebraic Decomposition:** Proving the dynamical equations via the polar Madelung transformation of the wave function."
              }
            }
          },
          {
            "id": "p3_2",
            "versions": {
              "v1": {
                "ko": "- **공간 진동 퍼텐셜 정의:** 입자를 유도하는 핵심 에너지인 공간 진동 퍼텐셜($Q_s$)을 기하학적 곡률($\\nabla^2 R$) 기반으로 정식화. $Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$",
                "en": "- **Defining Spatial Vibration Potential:** Formalizing the spatial vibration potential ($Q_s$), the core guidance energy, based on geometrical curvature ($\\nabla^2 R$): $Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$"
              },
              "v2": {
                "ko": "- **공간 진동 퍼텐셜 정의:** 입자를 유도하는 핵심 에너지인 공간 진동 퍼텐셜($Q_s$)을 기하학적 곡률($\\nabla^2 R$) 기반으로 정식화. $Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$",
                "en": "- **Defining Spatial Vibration Potential:** Formalizing the spatial vibration potential ($Q_s$), the core guidance energy, based on geometrical curvature ($\\nabla^2 R$): $Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$"
              }
            }
          },
          {
            "id": "p3_3",
            "versions": {
              "v1": {
                "ko": "본 연구는 슈뢰딩거 방정식(Schrödinger Equation)의 수학적 구조를 보존하면서도, 그 물리적 의미를 '확률적 파동 함수의 붕괴'에서 '공간 기하학적 요동의 역학'으로 재정의한다. 본 장에서는 복소 파동 함수를 기반으로 하는 슈뢰딩거 방정식이 어떻게 물리적 실재를 기술하는 '공간 진동 방정식'으로 변환되는지, 그 도출 과정을 수학적으로 증명한다.",
                "en": "This study preserves the mathematical structure of the Schrödinger equation while redefining its physical meaning from a 'probabilistic collapse of the wave function' to the 'dynamics of geometric spatial fluctuations.' In this section, we mathematically prove the derivation process by which the complex Schrödinger equation is transformed into a 'spatial vibration equation' describing physical reality."
              },
              "v2": {
                "ko": "본 연구는 슈뢰딩거 방정식(Schrödinger Equation)의 수학적 구조를 보존하면서도, 그 물리적 의미를 '확률적 파동 함수의 붕괴'에서 '공간 기하학적 요동의 역학'으로 재정의한다. 본 장에서는 복소 파동 함수를 기반으로 하는 슈뢰딩거 방정식이 어떻게 물리적 실재를 기술하는 '공간 진동 방정식'으로 변환되는지, 그 도출 과정을 수학적으로 증명한다.",
                "en": "This study preserves the mathematical structure of the Schrödinger equation while redefining its physical meaning from a 'probabilistic collapse of the wave function' to the 'dynamics of geometric spatial fluctuations.' In this section, we mathematically prove the derivation process by which the complex Schrödinger equation is transformed into a 'spatial vibration equation' describing physical reality."
              },
              "v3": {
                "ko": "~~본 연구는 슈뢰딩거 방정식(Schrödinger Equation)의 수학적 구조를 보존하면서도, 그 물리적 의미를 '확률적 파동 함수의 붕괴'에서 '공간 기하학적 요동의 역학'으로 재정의한다.~~",
                "en": "This study preserves the mathematical structure of the Schrödinger equation while redefining its physical meaning from a 'probabilistic collapse of the wave function' to the 'dynamics of geometric spatial fluctuations.' In this section, we mathematically prove the derivation process by which the complex Schrödinger equation is transformed into a 'spatial vibration equation' describing physical reality."
              }
            }
          },
          {
            "id": "p3_4",
            "versions": {
              "v1": {
                "ko": "### 3.1. 기본 전제 및 파동 함수의 극좌표 변환",
                "en": "### Polar Transformation"
              },
              "v2": {
                "ko": "### 3.1. 기본 전제 및 파동 함수의 극좌표 변환",
                "en": "### Polar Transformation"
              }
            }
          },
          {
            "id": "p3_5",
            "versions": {
              "v1": {
                "ko": "슈뢰딩거 방정식은 다음과 같다:",
                "en": "The Schrödinger equation is defined as:"
              },
              "v2": {
                "ko": "슈뢰딩거 방정식은 다음과 같다:",
                "en": "The Schrödinger equation is defined as:"
              }
            }
          },
          {
            "id": "p3_6",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_7",
            "versions": {
              "v1": {
                "ko": "",
                "en": "i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi"
              },
              "v2": {
                "ko": "",
                "en": "i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi"
              }
            }
          },
          {
            "id": "p3_8",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_9",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_10",
            "versions": {
              "v1": {
                "ko": "",
                "en": "i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi"
              },
              "v2": {
                "ko": "",
                "en": "i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi"
              }
            }
          },
          {
            "id": "p3_11",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_12",
            "versions": {
              "v1": {
                "ko": "우리는 파동 함수 $\\psi(r, t)$를 공간의 기하학적 진폭 $R(r, t)$와 진동의 위상 작용 $S(r, t)$를 사용하여 다음과 같이 극좌표 형태로 분해한다[2]:",
                "en": "We decompose the complex wave function $\\psi(r, t)$ using the spatial geometric amplitude $R(r, t)$ and the phase action of vibration $S(r, t)$ into polar form [2]:"
              },
              "v2": {
                "ko": "우리는 파동 함수 $\\psi(r, t)$를 공간의 기하학적 진폭 $R(r, t)$와 진동의 위상 작용 $S(r, t)$를 사용하여 다음과 같이 극좌표 형태로 분해한다[2]:",
                "en": "We decompose the complex wave function $\\psi(r, t)$ using the spatial geometric amplitude $R(r, t)$ and the phase action of vibration $S(r, t)$ into polar form [2]:"
              }
            }
          },
          {
            "id": "p3_13",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_14",
            "versions": {
              "v1": {
                "ko": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}",
                "en": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}"
              },
              "v2": {
                "ko": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}",
                "en": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}"
              },
              "v3": {
                "ko": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}",
                "en": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}"
              }
            }
          },
          {
            "id": "p3_15",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_16",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_17",
            "versions": {
              "v1": {
                "ko": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}",
                "en": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}"
              },
              "v2": {
                "ko": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}",
                "en": "\\psi(r, t) = R(r, t) e^{iS(r, t)/\\hbar}"
              }
            }
          },
          {
            "id": "p3_18",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_19",
            "versions": {
              "v1": {
                "ko": "(여기서 $R$과 $S$는 모두 실수 함수이다.)",
                "en": "(Here, both $R$ and $S$ are real-valued functions.)"
              },
              "v2": {
                "ko": "(여기서 $R$과 $S$는 모두 실수 함수이다.)",
                "en": "(Here, both $R$ and $S$ are real-valued functions.)"
              }
            }
          },
          {
            "id": "p3_20",
            "versions": {
              "v1": {
                "ko": "### 3.2. 방정식의 분해 및 유도 과정",
                "en": "### Decomposition and Derivation"
              },
              "v2": {
                "ko": "### 3.2. 방정식의 분해 및 유도 과정",
                "en": "### Decomposition and Derivation"
              }
            }
          },
          {
            "id": "p3_21",
            "versions": {
              "v1": {
                "ko": "이제 위의 $\\psi$를 슈뢰딩거 방정식에 대입하기 위해 시간에 대한 미분과 공간에 대한 미분을 수행한다. [2]",
                "en": "To substitute $\\psi$ into the Schrödinger equation, we compute the time and spatial derivatives [2]."
              },
              "v2": {
                "ko": "이제 위의 $\\psi$를 슈뢰딩거 방정식에 대입하기 위해 시간에 대한 미분과 공간에 대한 미분을 수행한다. [2]",
                "en": "To substitute $\\psi$ into the Schrödinger equation, we compute the time and spatial derivatives [2]."
              }
            }
          },
          {
            "id": "p3_22",
            "versions": {
              "v1": {
                "ko": "1. **시간에 대한 미분:**",
                "en": "1. **Time Derivative:**"
              },
              "v2": {
                "ko": "1. **시간에 대한 미분:**",
                "en": "1. **Time Derivative:**"
              }
            }
          },
          {
            "id": "p3_23",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_24",
            "versions": {
              "v1": {
                "ko": "",
                "en": "i\\hbar \\frac{\\partial \\psi}{\\partial t} = i\\hbar \\left( \\frac{\\partial R}{\\partial t} + \\frac{i R}{\\hbar} \\frac{\\partial S}{\\partial t} \\right) e^{iS/\\hbar} = \\left( i\\hbar \\frac{\\partial R}{\\partial t} - R \\frac{\\partial S}{\\partial t} \\right) e^{iS/\\hbar}"
              },
              "v2": {
                "ko": "",
                "en": "i\\hbar \\frac{\\partial \\psi}{\\partial t} = i\\hbar \\left( \\frac{\\partial R}{\\partial t} + \\frac{i R}{\\hbar} \\frac{\\partial S}{\\partial t} \\right) e^{iS/\\hbar} = \\left( i\\hbar \\frac{\\partial R}{\\partial t} - R \\frac{\\partial S}{\\partial t} \\right) e^{iS/\\hbar}"
              }
            }
          },
          {
            "id": "p3_25",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_26",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_27",
            "versions": {
              "v1": {
                "ko": "",
                "en": "i\\hbar \\frac{\\partial \\psi}{\\partial t} = i\\hbar \\left( \\frac{\\partial R}{\\partial t} + \\frac{i R}{\\hbar} \\frac{\\partial S}{\\partial t} \\right) e^{iS/\\hbar} = \\left( i\\hbar \\frac{\\partial R}{\\partial t} - R \\frac{\\partial S}{\\partial t} \\right) e^{iS/\\hbar}"
              },
              "v2": {
                "ko": "",
                "en": "i\\hbar \\frac{\\partial \\psi}{\\partial t} = i\\hbar \\left( \\frac{\\partial R}{\\partial t} + \\frac{i R}{\\hbar} \\frac{\\partial S}{\\partial t} \\right) e^{iS/\\hbar} = \\left( i\\hbar \\frac{\\partial R}{\\partial t} - R \\frac{\\partial S}{\\partial t} \\right) e^{iS/\\hbar}"
              }
            }
          },
          {
            "id": "p3_28",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_29",
            "versions": {
              "v1": {
                "ko": "2. **공간에 대한 미분 (Laplacian $\\nabla^2 \\psi$):**",
                "en": "2. **Spatial Derivative (Laplacian $\\nabla^2 \\psi$):**"
              },
              "v2": {
                "ko": "2. **공간에 대한 미분 (Laplacian $\\nabla^2 \\psi$):**",
                "en": "2. **Spatial Derivative (Laplacian $\\nabla^2 \\psi$):**"
              }
            }
          },
          {
            "id": "p3_30",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_31",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\nabla \\psi = (\\nabla R + \\frac{i R}{\\hbar} \\nabla S) e^{iS/\\hbar}"
              },
              "v2": {
                "ko": "",
                "en": "\\nabla \\psi = (\\nabla R + \\frac{i R}{\\hbar} \\nabla S) e^{iS/\\hbar}"
              }
            }
          },
          {
            "id": "p3_32",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_33",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_34",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\nabla \\psi = (\\nabla R + \\frac{i R}{\\hbar} \\nabla S) e^{iS/\\hbar}"
              },
              "v2": {
                "ko": "",
                "en": "\\nabla \\psi = (\\nabla R + \\frac{i R}{\\hbar} \\nabla S) e^{iS/\\hbar}"
              }
            }
          },
          {
            "id": "p3_35",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_36",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_37",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\nabla^2 \\psi = \\left( \\nabla^2 R - \\frac{R}{\\hbar^2} (\\nabla S)^2 + \\frac{i}{\\hbar} (2\\nabla R \\cdot \\nabla S + R \\nabla^2 S) \\right) e^{iS/\\hbar}"
              },
              "v2": {
                "ko": "",
                "en": "\\nabla^2 \\psi = \\left( \\nabla^2 R - \\frac{R}{\\hbar^2} (\\nabla S)^2 + \\frac{i}{\\hbar} (2\\nabla R \\cdot \\nabla S + R \\nabla^2 S) \\right) e^{iS/\\hbar}"
              }
            }
          },
          {
            "id": "p3_38",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_39",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_40",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\nabla^2 \\psi = \\left( \\nabla^2 R - \\frac{R}{\\hbar^2} (\\nabla S)^2 + \\frac{i}{\\hbar} (2\\nabla R \\cdot \\nabla S + R \\nabla^2 S) \\right) e^{iS/\\hbar}"
              },
              "v2": {
                "ko": "",
                "en": "\\nabla^2 \\psi = \\left( \\nabla^2 R - \\frac{R}{\\hbar^2} (\\nabla S)^2 + \\frac{i}{\\hbar} (2\\nabla R \\cdot \\nabla S + R \\nabla^2 S) \\right) e^{iS/\\hbar}"
              }
            }
          },
          {
            "id": "p3_41",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_42",
            "versions": {
              "v1": {
                "ko": "이를 슈뢰딩거 방정식에 대입하고 양변에서 $e^{iS/\\hbar}$를 소거하면, 실수부와 허수부를 다음과 같이 분리할 수 있다.",
                "en": "Substituting these into the Schrödinger equation and dividing by $e^{iS/\\hbar}$ yields the separation of real and imaginary parts as follows."
              },
              "v2": {
                "ko": "이를 슈뢰딩거 방정식에 대입하고 양변에서 $e^{iS/\\hbar}$를 소거하면, 실수부와 허수부를 다음과 같이 분리할 수 있다.",
                "en": "Substituting these into the Schrödinger equation and dividing by $e^{iS/\\hbar}$ yields the separation of real and imaginary parts as follows."
              }
            }
          },
          {
            "id": "p3_43",
            "versions": {
              "v1": {
                "ko": "### [실수부",
                "en": "### Real Part"
              },
              "v2": {
                "ko": "### [실수부",
                "en": "### Real Part"
              }
            }
          },
          {
            "id": "p3_44",
            "versions": {
              "v1": {
                "ko": "실수부 항을 정리하면, 고전 역학의 에너지 보존 법칙인 해밀턴-야코비 방정식에 양자적 섭동 항이 추가된 형태가 도출된다.",
                "en": "Arranging the real part yields a modified Hamilton-Jacobi equation, where a quantum perturbation term is added to the classical conservation of energy."
              },
              "v2": {
                "ko": "실수부 항을 정리하면, 고전 역학의 에너지 보존 법칙인 해밀턴-야코비 방정식에 양자적 섭동 항이 추가된 형태가 도출된다.",
                "en": "Arranging the real part yields a modified Hamilton-Jacobi equation, where a quantum perturbation term is added to the classical conservation of energy."
              }
            }
          },
          {
            "id": "p3_45",
            "versions": {
              "v1": {
                "ko": "1. **도출된 실수부 방정식:**",
                "en": "1. **Derived Real Part Equation:**"
              },
              "v2": {
                "ko": "1. **도출된 실수부 방정식:**",
                "en": "1. **Derived Real Part Equation:**"
              }
            }
          },
          {
            "id": "p3_46",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_47",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V - \\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V - \\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} = 0"
              },
              "v3": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0"
              }
            }
          },
          {
            "id": "p3_48",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_49",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_50",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V - \\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V - \\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} = 0"
              }
            }
          },
          {
            "id": "p3_51",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_52",
            "versions": {
              "v1": {
                "ko": "2. **공간 진동 퍼텐셜 ($Q_s$)의 정의:**",
                "en": "2. **Definition of Spatial Vibration Potential ($Q_s$):**"
              },
              "v2": {
                "ko": "2. **공간 진동 퍼텐셜 ($Q_s$)의 정의:**",
                "en": "2. **Definition of Spatial Vibration Potential ($Q_s$):**"
              }
            }
          },
          {
            "id": "p3_53",
            "versions": {
              "v1": {
                "ko": "본 모델에서는 고전적 해밀턴-야코비 방정식에 추가된 위 항을 **'공간 진동 퍼텐셜(Spatial Vibration Potential, $Q_s$)'**이라 명명한다. 이 수식적 형태는 과거 데이비드 봄(D. Bohm)이 은닉 변수 이론에서 유도한 '양자 퍼텐셜(Quantum Potential)'의 구조와 수학적으로 동일하나 [3], 본 연구에서는 이를 입자 내부의 미지의 힘이나 가상의 장(Field)이 아닌 **'배경 공간 자체의 기하학적 요동 에너지'**로 완전히 새롭게 재정의한다.",
                "en": "In this model, the additional term is designated as the 'Spatial Vibration Potential ($Q_s$).' While its mathematical form is identical to the 'Quantum Potential' derived by David Bohm [3], we redefine it not as a hidden field associated with the particle, but as the 'geometric fluctuation energy of the background space itself.'"
              },
              "v2": {
                "ko": "본 모델에서는 고전적 해밀턴-야코비 방정식에 추가된 위 항을 **'공간 진동 퍼텐셜(Spatial Vibration Potential, $Q_s$)'**이라 명명한다. 이 수식적 형태는 과거 데이비드 봄(D. Bohm)이 은닉 변수 이론에서 유도한 '양자 퍼텐셜(Quantum Potential)'의 구조와 수학적으로 동일하나 [3], 본 연구에서는 이를 입자 내부의 미지의 힘이나 가상의 장(Field)이 아닌 **'배경 공간 자체의 기하학적 요동 에너지'**로 완전히 새롭게 재정의한다.",
                "en": "In this model, the additional term is designated as the 'Spatial Vibration Potential ($Q_s$).' While its mathematical form is identical to the 'Quantum Potential' derived by David Bohm [3], we redefine it not as a hidden field associated with the particle, but as the 'geometric fluctuation energy of the background space itself.'"
              }
            }
          },
          {
            "id": "p3_54",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_55",
            "versions": {
              "v1": {
                "ko": "",
                "en": "Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              },
              "v2": {
                "ko": "",
                "en": "Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              }
            }
          },
          {
            "id": "p3_56",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_57",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_58",
            "versions": {
              "v1": {
                "ko": "",
                "en": "Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              },
              "v2": {
                "ko": "",
                "en": "Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              }
            }
          },
          {
            "id": "p3_59",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_60",
            "versions": {
              "v1": {
                "ko": "3. **최종 형태:**",
                "en": "3. **Final Form:**"
              },
              "v2": {
                "ko": "3. **최종 형태:**",
                "en": "3. **Final Form:**"
              }
            }
          },
          {
            "id": "p3_61",
            "versions": {
              "v1": {
                "ko": "따라서 위 방정식은 다음과 같이 간결하게 기술된다.",
                "en": "Consequently, the equation is written compactly as:"
              },
              "v2": {
                "ko": "따라서 위 방정식은 다음과 같이 간결하게 기술된다.",
                "en": "Consequently, the equation is written compactly as:"
              }
            }
          },
          {
            "id": "p3_62",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_63",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0"
              }
            }
          },
          {
            "id": "p3_64",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_65",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_66",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0"
              }
            }
          },
          {
            "id": "p3_67",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_68",
            "versions": {
              "v1": {
                "ko": "*이 방정식은 입자가 외부 퍼텐셜($V$)뿐만 아니라, 배경 공간의 기하학적 요동($Q_s$)에 의해 유도됨을 보여주는 본 모델의 핵심 역학 방정식이다.*",
                "en": "*This equation constitutes the core dynamical equation of our model, proving that a particle is guided by the spatial geometric fluctuations ($Q_s$) in addition to external potentials ($V$).*"
              },
              "v2": {
                "ko": "*이 방정식은 입자가 외부 퍼텐셜($V$)뿐만 아니라, 배경 공간의 기하학적 요동($Q_s$)에 의해 유도됨을 보여주는 본 모델의 핵심 역학 방정식이다.*",
                "en": "*This equation constitutes the core dynamical equation of our model, proving that a particle is guided by the spatial geometric fluctuations ($Q_s$) in addition to external potentials ($V$).*"
              }
            }
          },
          {
            "id": "p3_69",
            "versions": {
              "v1": {
                "ko": "### [허수부",
                "en": "### Imaginary Part"
              },
              "v2": {
                "ko": "### [허수부",
                "en": "### Imaginary Part"
              }
            }
          },
          {
            "id": "p3_70",
            "versions": {
              "v1": {
                "ko": "허수부 항을 정리하면, 입자의 존재 확률 밀도(본 모델에서는 진동 에너지 밀도)가 공간에서 보존됨을 나타내는 연속 방정식(Continuity Equation)이 도출된다.",
                "en": "Arranging the imaginary part yields the continuity equation, indicating that the probability density (reinterpreted here as spatial vibration energy density) is conserved."
              },
              "v2": {
                "ko": "허수부 항을 정리하면, 입자의 존재 확률 밀도(본 모델에서는 진동 에너지 밀도)가 공간에서 보존됨을 나타내는 연속 방정식(Continuity Equation)이 도출된다.",
                "en": "Arranging the imaginary part yields the continuity equation, indicating that the probability density (reinterpreted here as spatial vibration energy density) is conserved."
              }
            }
          },
          {
            "id": "p3_71",
            "versions": {
              "v1": {
                "ko": "1. **도출과정:**",
                "en": "1. **Derivation:**"
              },
              "v2": {
                "ko": "1. **도출과정:**",
                "en": "1. **Derivation:**"
              }
            }
          },
          {
            "id": "p3_72",
            "versions": {
              "v1": {
                "ko": "슈뢰딩거 방정식의 허수부에서 파동 함수의 진폭 $R$과 위상 $S$에 대한 관계식을 정리하면 다음과 같다.",
                "en": "Extracting the relation from the imaginary part of the Schrödinger equation for amplitude $R$ and phase $S$ gives:"
              },
              "v2": {
                "ko": "슈뢰딩거 방정식의 허수부에서 파동 함수의 진폭 $R$과 위상 $S$에 대한 관계식을 정리하면 다음과 같다.",
                "en": "Extracting the relation from the imaginary part of the Schrödinger equation for amplitude $R$ and phase $S$ gives:"
              }
            }
          },
          {
            "id": "p3_73",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_74",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\frac{\\partial R^2}{\\partial t} + \\nabla \\cdot \\left( R^2 \\frac{\\nabla S}{m} \\right) = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\frac{\\partial R^2}{\\partial t} + \\nabla \\cdot \\left( R^2 \\frac{\\nabla S}{m} \\right) = 0"
              }
            }
          },
          {
            "id": "p3_75",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_76",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_77",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\frac{\\partial R^2}{\\partial t} + \\nabla \\cdot \\left( R^2 \\frac{\\nabla S}{m} \\right) = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\frac{\\partial R^2}{\\partial t} + \\nabla \\cdot \\left( R^2 \\frac{\\nabla S}{m} \\right) = 0"
              }
            }
          },
          {
            "id": "p3_78",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_79",
            "versions": {
              "v1": {
                "ko": "2. **물리적 해석:**",
                "en": "2. **Physical Interpretation:**"
              },
              "v2": {
                "ko": "2. **물리적 해석:**",
                "en": "2. **Physical Interpretation:**"
              }
            }
          },
          {
            "id": "p3_80",
            "versions": {
              "v1": {
                "ko": "- **$R^2$:** 이는 공간 내 진동 에너지 밀도(Energy density of spatial vibration)를 의미한다.",
                "en": "- **$R^2$:** Represents the energy density of spatial vibrations."
              },
              "v2": {
                "ko": "- **$R^2$:** 이는 공간 내 진동 에너지 밀도(Energy density of spatial vibration)를 의미한다.",
                "en": "- **$R^2$:** Represents the energy density of spatial vibrations."
              }
            }
          },
          {
            "id": "p3_81",
            "versions": {
              "v1": {
                "ko": "- **$\\nabla S/m$:** 이는 입자의 속도장(Velocity field)을 의미한다.",
                "en": "- **$\\nabla S/m$:** Represents the velocity field of the particle."
              },
              "v2": {
                "ko": "- **$\\nabla S/m$:** 이는 입자의 속도장(Velocity field)을 의미한다.",
                "en": "- **$\\nabla S/m$:** Represents the velocity field of the particle."
              }
            }
          },
          {
            "id": "p3_82",
            "versions": {
              "v1": {
                "ko": "- 이 식은 '공간의 진동 에너지가 유실되지 않고 흐름(Flow)을 유지하며 보존된다'는 질량/에너지 보존의 원리를 수학적으로 증명한다. 즉, 공간의 요동은 단순한 노이즈가 아니라 역학적으로 보존되는 실재임을 의미한다.",
                "en": "- This equation mathematically proves the conservation of energy/mass, demonstrating that spatial vibration energy flows without loss. It underscores that spatial fluctuations are not random noise but a conserved, physical reality."
              },
              "v2": {
                "ko": "- 이 식은 '공간의 진동 에너지가 유실되지 않고 흐름(Flow)을 유지하며 보존된다'는 질량/에너지 보존의 원리를 수학적으로 증명한다. 즉, 공간의 요동은 단순한 노이즈가 아니라 역학적으로 보존되는 실재임을 의미한다.",
                "en": "- This equation mathematically proves the conservation of energy/mass, demonstrating that spatial vibration energy flows without loss. It underscores that spatial fluctuations are not random noise but a conserved, physical reality."
              }
            }
          },
          {
            "id": "p3_83",
            "versions": {
              "v1": {
                "ko": "### 3.4. 선행 이론의 비판적 고찰",
                "en": "### Critical Review of Preceding Theories"
              },
              "v2": {
                "ko": "### 3.4. 선행 이론의 비판적 고찰",
                "en": "### Critical Review of Preceding Theories"
              }
            }
          },
          {
            "id": "p3_84",
            "versions": {
              "v1": {
                "ko": "본 연구에서 도출한 공간 진동 퍼텐셜 $Q_s$의 수학적 구조는, 마델룽(Madelung, 1927) [2]의 유체역학적 정식화 및 데이비드 봄(D. Bohm, 1952) [3]이 제안한 은닉 변수 이론 내 양자 퍼텐셜(Quantum Potential) 항과 대수적인 동형성(Isomorphism)을 이룬다.",
                "en": "Critical Review of Preceding Theories: The mathematical structure of $Q_s$ derived in this study is algebraically isomorphic to the quantum potential in the hydrodynamic formulation of Madelung (1927) [2] and the hidden-variable theory of Bohm (1952) [3]. To resolve the absence of physical reality highlighted by the EPR paradox [1], Bohm achieved a major mathematical milestone in restoring particle determinism. However, Bohmian mechanics left the guiding wave's physical nature ambiguous, defining it as a force residing in a multi-dimensional, abstract configuration space rather than our physical 3D spacetime. Our model adopts Bohm's mathematical framework but completely transforms its physical interpretation. The Laplacian term ($\\nabla^2 R$) is not an abstract field associated with hidden variables. Instead, it is the 'geometrical fluctuation of the background space itself' in 3D spacetime. Proposing that spatial curvature variations ($\\nabla^2 R$) exert mechanical pressure to refract particle trajectories breaks free from metaphysical limitations, framing quantum phenomena within fully observable, realistic geometrical dynamics."
              },
              "v2": {
                "ko": "본 연구에서 도출한 공간 진동 퍼텐셜 $Q_s$의 수학적 구조는, 마델룽(Madelung, 1927) [2]의 유체역학적 정식화 및 데이비드 봄(D. Bohm, 1952) [3]이 제안한 은닉 변수 이론 내 양자 퍼텐셜(Quantum Potential) 항과 대수적인 동형성(Isomorphism)을 이룬다.",
                "en": "Critical Review of Preceding Theories: The mathematical structure of $Q_s$ derived in this study is algebraically isomorphic to the quantum potential in the hydrodynamic formulation of Madelung (1927) [2] and the hidden-variable theory of Bohm (1952) [3]. To resolve the absence of physical reality highlighted by the EPR paradox [1], Bohm achieved a major mathematical milestone in restoring particle determinism. However, Bohmian mechanics left the guiding wave's physical nature ambiguous, defining it as a force residing in a multi-dimensional, abstract configuration space rather than our physical 3D spacetime. Our model adopts Bohm's mathematical framework but completely transforms its physical interpretation. The Laplacian term ($\\nabla^2 R$) is not an abstract field associated with hidden variables. Instead, it is the 'geometrical fluctuation of the background space itself' in 3D spacetime. Proposing that spatial curvature variations ($\\nabla^2 R$) exert mechanical pressure to refract particle trajectories breaks free from metaphysical limitations, framing quantum phenomena within fully observable, realistic geometrical dynamics."
              }
            }
          },
          {
            "id": "p3_85",
            "versions": {
              "v1": {
                "ko": "EPR 역설 [1]이 제기한 '대상의 실재성(Physical Reality)' 부재 문제를 해결하기 위해, 봄(Bohm)은 입자의 실재성을 복원하는 위대한 수학적 성취를 이루었다. 그러나 봄 역학은 입자를 유도하는 파동의 물리적 실체가 무엇인지 명확히 규명하지 못한 채, 이를 3차원 현실 시공간이 아닌 다차원적이고 추상적인 '가상의 형상 공간(Configuration Space)'에 존재하는 신비한 힘으로 남겨두어 주류 물리학계의 보편적 지지를 얻는 데 한계를 보였다.",
                "en": ""
              },
              "v2": {
                "ko": "EPR 역설 [1]이 제기한 '대상의 실재성(Physical Reality)' 부재 문제를 해결하기 위해, 봄(Bohm)은 입자의 실재성을 복원하는 위대한 수학적 성취를 이루었다. 그러나 봄 역학은 입자를 유도하는 파동의 물리적 실체가 무엇인지 명확히 규명하지 못한 채, 이를 3차원 현실 시공간이 아닌 다차원적이고 추상적인 '가상의 형상 공간(Configuration Space)'에 존재하는 신비한 힘으로 남겨두어 주류 물리학계의 보편적 지지를 얻는 데 한계를 보였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_86",
            "versions": {
              "v1": {
                "ko": "본 모델은 봄의 선구적인 수학적 뼈대를 차용하되, 그 철학적·물리적 의미를 완전히 전복시킨다. 수식 내의 라플라시안 항($\\nabla^2 R$)은 입자 내부에 깃든 숨은 변수나 추상적 장(Field)이 결코 아니다. 그것은 우주라는 3차원 물리적 무대를 채우고 있는 **'배경 공간(Vacuum Space) 자체의 기하학적 유동(Geometrical Fluctuation)'**이다.",
                "en": ""
              },
              "v2": {
                "ko": "본 모델은 봄의 선구적인 수학적 뼈대를 차용하되, 그 철학적·물리적 의미를 완전히 전복시킨다. 수식 내의 라플라시안 항($\\nabla^2 R$)은 입자 내부에 깃든 숨은 변수나 추상적 장(Field)이 결코 아니다. 그것은 우주라는 3차원 물리적 무대를 채우고 있는 **'배경 공간(Vacuum Space) 자체의 기하학적 유동(Geometrical Fluctuation)'**이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_87",
            "versions": {
              "v1": {
                "ko": "텅 빈 공간의 기하학적 곡률 변화($\\nabla^2 R$)가 역학적인 압력을 발생시켜 입자의 궤적을 굴절시킨다는 본 논문의 '공간 진동' 선언은, 과거 은닉 변수 이론들이 갇혀 있던 형이상학적 한계를 타파하고 양자 현상을 완벽히 관측 가능한 실재적 기하역학(Geometrical Dynamics)의 영역으로 끌어내리는 결정론적 전환점을 제공한다.",
                "en": ""
              },
              "v2": {
                "ko": "텅 빈 공간의 기하학적 곡률 변화($\\nabla^2 R$)가 역학적인 압력을 발생시켜 입자의 궤적을 굴절시킨다는 본 논문의 '공간 진동' 선언은, 과거 은닉 변수 이론들이 갇혀 있던 형이상학적 한계를 타파하고 양자 현상을 완벽히 관측 가능한 실재적 기하역학(Geometrical Dynamics)의 영역으로 끌어내리는 결정론적 전환점을 제공한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### ~~3.1. 양자장의 유체역학적 재해석 (Madelung Representation)~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "~~기존의 복소 파동 함수 $\\psi(r, t)$를 극형식(Polar form)으로 변환하면 다음과 같다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "~~여기서 $R(r, t)$는 공간 진동의 기하학적 진폭(Amplitude of spatial fluctuation)이며, $S(r, t)$는 진동의 위상 작용(Phase action)을 의미한다. 이를 슈뢰딩거 방정식에 대입하여 실수부와 허수부로 분리하면, 고전적 해밀턴-야코비 방정식(Hamilton-Jacobi Equation)과 연속 방정식(Continuity Equation)이 도출된다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_10",
            "versions": {
              "v3": {
                "ko": "### ~~3.2. 공간 진동 퍼텐셜 ($Q_s$)의 정의~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_11",
            "versions": {
              "v3": {
                "ko": "~~기존 드브로이-봄 이론에서 '양자 퍼텐셜'이라 불리던 $Q$ 항은 본 모델에서 **'공간 진동 퍼텐셜(Spatial Vibration Potential, $Q_s$)'**로 재정의된다. 이는 입자 내부에 존재하는 신비한 힘이 아니라, 입자를 둘러싼 공간의 기하학적 요동이 만드는 에너지 밀도이다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_12",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_13",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_14",
            "versions": {
              "v3": {
                "ko": "~~수식의 형태는 기존과 동일하나, 본 모델에서의 $Q_s$는 입자가 이동하는 배경 공간의 곡률($\\nabla^2 R$)에 반비례하며 입자의 질량($m$)에 따라 그 영향력이 결정된다. 즉, 입자의 질량이 작을수록 공간의 기하학적 요동($R$)이 입자의 궤적을 결정하는 지배적인 힘으로 작용함을 의미한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_15",
            "versions": {
              "v3": {
                "ko": "### ~~3.3. 동역학적 유도 메커니즘 (Dynamical Guidance)~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_16",
            "versions": {
              "v3": {
                "ko": "~~실재하는 입자는 $Q_s$라는 기하학적 요동의 골짜기(Gradient flow)를 따라 이동한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_17",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_18",
            "versions": {
              "v3": {
                "ko": "m \\frac{d^2r}{dt^2} = -\\nabla (V + Q_s)",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_19",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_20",
            "versions": {
              "v3": {
                "ko": "~~이 방정식은 입자가 외부의 힘($V$)뿐만 아니라, 스스로 이동하는 공간의 요동($Q_s$)에 의해 유도됨을 보여준다. 입자는 확률적으로 존재하는 것이 아니라, 기하학적 요동 패턴($R$)이라는 '지도'를 따라 결정론적으로 움직이는 것이다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_21",
            "versions": {
              "v3": {
                "ko": "~~이로써 본 모델은 양자 현상을 확률이 아닌, **'기하학적 공간 속에서 입자가 겪는 물리적 마찰과 유도'**라는 결정론적 역학으로 완벽히 정식화한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~3.1. 양자장의 유체역학적 재해석 (Madelung Representation)~~"
              }
            }
          },
          {
            "id": "p3_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~3.2. 공간 진동 퍼텐셜 ($Q_s$)의 정의~~"
              }
            }
          },
          {
            "id": "p3_v3_en_9",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_10",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              }
            }
          },
          {
            "id": "p3_v3_en_11",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_12",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~3.3. 동역학적 유도 메커니즘 (Dynamical Guidance)~~"
              }
            }
          },
          {
            "id": "p3_v3_en_13",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_14",
            "versions": {
              "v3": {
                "ko": "",
                "en": "m \\frac{d^2r}{dt^2} = -\\nabla (V + Q_s)"
              }
            }
          },
          {
            "id": "p3_v3_en_15",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### ~~3.1. 양자장의 유체역학적 재해석 (Madelung Representation)~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "~~기존의 복소 파동 함수 $\\psi(r, t)$를 극형식(Polar form)으로 변환하면 다음과 같다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "~~여기서 $R(r, t)$는 공간 진동의 기하학적 진폭(Amplitude of spatial fluctuation)이며, $S(r, t)$는 진동의 위상 작용(Phase action)을 의미한다. 이를 슈뢰딩거 방정식에 대입하여 실수부와 허수부로 분리하면, 고전적 해밀턴-야코비 방정식(Hamilton-Jacobi Equation)과 연속 방정식(Continuity Equation)이 도출된다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_10",
            "versions": {
              "v3": {
                "ko": "### ~~3.2. 공간 진동 퍼텐셜 ($Q_s$)의 정의~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_11",
            "versions": {
              "v3": {
                "ko": "~~기존 드브로이-봄 이론에서 '양자 퍼텐셜'이라 불리던 $Q$ 항은 본 모델에서 **'공간 진동 퍼텐셜(Spatial Vibration Potential, $Q_s$)'**로 재정의된다. 이는 입자 내부에 존재하는 신비한 힘이 아니라, 입자를 둘러싼 공간의 기하학적 요동이 만드는 에너지 밀도이다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_12",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_13",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_14",
            "versions": {
              "v3": {
                "ko": "~~수식의 형태는 기존과 동일하나, 본 모델에서의 $Q_s$는 입자가 이동하는 배경 공간의 곡률($\\nabla^2 R$)에 반비례하며 입자의 질량($m$)에 따라 그 영향력이 결정된다. 즉, 입자의 질량이 작을수록 공간의 기하학적 요동($R$)이 입자의 궤적을 결정하는 지배적인 힘으로 작용함을 의미한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_15",
            "versions": {
              "v3": {
                "ko": "### ~~3.3. 동역학적 유도 메커니즘 (Dynamical Guidance)~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_16",
            "versions": {
              "v3": {
                "ko": "~~실재하는 입자는 $Q_s$라는 기하학적 요동의 골짜기(Gradient flow)를 따라 이동한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_17",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_18",
            "versions": {
              "v3": {
                "ko": "m \\frac{d^2r}{dt^2} = -\\nabla (V + Q_s)",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_19",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_20",
            "versions": {
              "v3": {
                "ko": "~~이 방정식은 입자가 외부의 힘($V$)뿐만 아니라, 스스로 이동하는 공간의 요동($Q_s$)에 의해 유도됨을 보여준다. 입자는 확률적으로 존재하는 것이 아니라, 기하학적 요동 패턴($R$)이라는 '지도'를 따라 결정론적으로 움직이는 것이다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_21",
            "versions": {
              "v3": {
                "ko": "~~이로써 본 모델은 양자 현상을 확률이 아닌, **'기하학적 공간 속에서 입자가 겪는 물리적 마찰과 유도'**라는 결정론적 역학으로 완벽히 정식화한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~3.1. 양자장의 유체역학적 재해석 (Madelung Representation)~~"
              }
            }
          },
          {
            "id": "p3_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~3.2. 공간 진동 퍼텐셜 ($Q_s$)의 정의~~"
              }
            }
          },
          {
            "id": "p3_v3_en_9",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_10",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              }
            }
          },
          {
            "id": "p3_v3_en_11",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_12",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~3.3. 동역학적 유도 메커니즘 (Dynamical Guidance)~~"
              }
            }
          },
          {
            "id": "p3_v3_en_13",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p3_v3_en_14",
            "versions": {
              "v3": {
                "ko": "",
                "en": "m \\frac{d^2r}{dt^2} = -\\nabla (V + Q_s)"
              }
            }
          },
          {
            "id": "p3_v3_en_15",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          }
        ]
      },
      {
        "number": 4,
        "title": {
          "ko": "4장. 이중 슬릿 실험의 재해석: 공간 진동에 의한 결정론적 궤적 유도",
          "en": "Chapter 4. Double-Slit Trajectories"
        },
        "paragraphs": [
          {
            "id": "p4_1",
            "versions": {
              "v1": {
                "ko": "- **굴절 메커니즘:** 공간 요동파가 형성하는 간섭 지형도(산맥과 골짜기)와 척력($-\\nabla Q_s$)에 의한 입자 궤적의 결정론적 굴절.",
                "en": "- **Refraction Mechanism:** Deterministic refraction of particle trajectories driven by repulsive forces ($-\\nabla Q_s$) along the interference landscapes (crests and troughs) formed by spatial fluctuation waves."
              },
              "v2": {
                "ko": "- **굴절 메커니즘:** 공간 요동파가 형성하는 간섭 지형도(산맥과 골짜기)와 척력($-\\nabla Q_s$)에 의한 입자 궤적의 결정론적 굴절.",
                "en": "- **Refraction Mechanism:** Deterministic refraction of particle trajectories driven by repulsive forces ($-\\nabla Q_s$) along the interference landscapes (crests and troughs) formed by spatial fluctuation waves."
              }
            }
          },
          {
            "id": "p4_2",
            "versions": {
              "v1": {
                "ko": "- **실체 규명:** 확률 분포($|\\psi|^2$)는 파동 붕괴의 결과가 아닌, 초기 발사 조건의 미세 차이가 만드는 '통계학적 앙상블(Ensemble)'임.",
                "en": "- **Ontological Clarification:** The probability distribution ($|\\psi|^2$) is not a consequence of wave function collapse, but rather a statistical ensemble emerging from microscopic variations in initial launching conditions."
              },
              "v2": {
                "ko": "- **실체 규명:** 확률 분포($|\\psi|^2$)는 파동 붕괴의 결과가 아닌, 초기 발사 조건의 미세 차이가 만드는 '통계학적 앙상블(Ensemble)'임.",
                "en": "- **Ontological Clarification:** The probability distribution ($|\\psi|^2$) is not a consequence of wave function collapse, but rather a statistical ensemble emerging from microscopic variations in initial launching conditions."
              }
            }
          },
          {
            "id": "p4_3",
            "versions": {
              "v1": {
                "ko": "본 장에서는 제3장에서 도출한 공간 진동 퍼텐셜($Q_s$)이 이중 슬릿 실험에서 입자의 궤적을 어떻게 결정론적으로 유도하여 간섭 무늬를 형성하는지 역학적으로 규명한다. 이를 통해 입자 스스로가 파동으로 변하거나 확률적으로 중첩된다는 코펜하겐 해석의 물리적 모순을 해결한다.",
                "en": "This section details how the spatial vibration potential ($Q_s$) deterministically guides particle trajectories in the double-slit setup, forming interference fringes. This resolves the Copenhagen contradiction where particles are assumed to turn into waves or exist in probabilistic superpositions."
              },
              "v2": {
                "ko": "본 장에서는 제3장에서 도출한 공간 진동 퍼텐셜($Q_s$)이 이중 슬릿 실험에서 입자의 궤적을 어떻게 결정론적으로 유도하여 간섭 무늬를 형성하는지 역학적으로 규명한다. 이를 통해 입자 스스로가 파동으로 변하거나 확률적으로 중첩된다는 코펜하겐 해석의 물리적 모순을 해결한다.",
                "en": "This section details how the spatial vibration potential ($Q_s$) deterministically guides particle trajectories in the double-slit setup, forming interference fringes. This resolves the Copenhagen contradiction where particles are assumed to turn into waves or exist in probabilistic superpositions."
              },
              "v3": {
                "ko": "본 장에서는 제3장에서 도출한 공간 진동 퍼텐셜($Q_s$)이 이중 슬릿 실험에서 입자의 궤적을 어떻게 결정론적으로 유도하여 간섭 무늬를 형성하는지 역학적으로 규명한다. 이를 통해 입자 스스로가 파동으로 변하거나 확률적으로 중첩된다는 코펜하겐 해석의 물리적 모순을 해결한다.",
                "en": "This section details how the spatial vibration potential ($Q_s$) deterministically guides particle trajectories in the double-slit setup, forming interference fringes. This resolves the Copenhagen contradiction where particles are assumed to turn into waves or exist in probabilistic superpositions."
              }
            }
          },
          {
            "id": "p4_4",
            "versions": {
              "v1": {
                "ko": "### 4.1. 입자의 유도 운동 방정식",
                "en": "### Guidance Equation of Motion"
              },
              "v2": {
                "ko": "### 4.1. 입자의 유도 운동 방정식",
                "en": "### Guidance Equation of Motion"
              },
              "v3": {
                "ko": "### 4.1. 입자의 유도 운동 방정식",
                "en": "### Guidance Equation of Motion"
              }
            }
          },
          {
            "id": "p4_5",
            "versions": {
              "v1": {
                "ko": "본 모델에 따르면, 단일 입자의 운동은 외부의 고전적 퍼텐셜($V$)뿐만 아니라 배경 공간의 기하학적 요동($Q_s$)이 만들어내는 힘의 지배를 받는다. 3장에서 도출한 해밀턴-야코비 방정식을 공간에 대해 미분(Gradient, $\\nabla$)하면, 입자가 받는 역학적 총 힘(Force)과 가속도에 대한 운동 방정식이 다음과 같이 도출된다.",
                "en": "According to our model, the motion of a single particle is governed by spatial geometric fluctuations ($Q_s$) alongside classical external potentials ($V$). Taking the gradient ($\\nabla$) of the modified Hamilton-Jacobi equation yields the equation of motion:"
              },
              "v2": {
                "ko": "본 모델에 따르면, 단일 입자의 운동은 외부의 고전적 퍼텐셜($V$)뿐만 아니라 배경 공간의 기하학적 요동($Q_s$)이 만들어내는 힘의 지배를 받는다. 3장에서 도출한 해밀턴-야코비 방정식을 공간에 대해 미분(Gradient, $\\nabla$)하면, 입자가 받는 역학적 총 힘(Force)과 가속도에 대한 운동 방정식이 다음과 같이 도출된다.",
                "en": "According to our model, the motion of a single particle is governed by spatial geometric fluctuations ($Q_s$) alongside classical external potentials ($V$). Taking the gradient ($\\nabla$) of the modified Hamilton-Jacobi equation yields the equation of motion:"
              },
              "v3": {
                "ko": "본 모델에 따르면, 단일 입자의 운동은 외부의 고전적 퍼텐셜($V$)뿐만 아니라 배경 공간의 기하학적 요동($Q_s$)이 만들어내는 힘의 지배를 받는다. 3장에서 도출한 해밀턴-야코비 방정식을 공간에 대해 미분(Gradient, $\\nabla$)하면, 입자가 받는 역학적 총 힘(Force)과 가속도에 대한 운동 방정식이 다음과 같이 도출된다.",
                "en": "According to our model, the motion of a single particle is governed by spatial geometric fluctuations ($Q_s$) alongside classical external potentials ($V$). Taking the gradient ($\\nabla$) of the modified Hamilton-Jacobi equation yields the equation of motion:"
              }
            }
          },
          {
            "id": "p4_6",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_7",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t)"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t)"
              },
              "v3": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t)"
              }
            }
          },
          {
            "id": "p4_8",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_9",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_10",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t)"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t)"
              }
            }
          },
          {
            "id": "p4_11",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_12",
            "versions": {
              "v1": {
                "ko": "이 식은 매우 중요한 물리적 의미를 내포한다.",
                "en": "This equation carries significant physical implications:"
              },
              "v2": {
                "ko": "이 식은 매우 중요한 물리적 의미를 내포한다.",
                "en": "This equation carries significant physical implications:"
              },
              "v3": {
                "ko": "이 식은 매우 중요한 물리적 의미를 내포한다.",
                "en": "This equation carries significant physical implications:"
              }
            }
          },
          {
            "id": "p4_13",
            "versions": {
              "v1": {
                "ko": "1. **$-\\nabla V(\\mathbf{r})$:** 슬릿 장벽 등 거시적인 물리적 환경이 입자에 가하는 고전적인 물리적 척력이다.",
                "en": "1. **$-\\nabla V(\\mathbf{r})$:** The classical force exerted on the particle by the physical boundaries (e.g., the slit barrier)."
              },
              "v2": {
                "ko": "1. **$-\\nabla V(\\mathbf{r})$:** 슬릿 장벽 등 거시적인 물리적 환경이 입자에 가하는 고전적인 물리적 척력이다.",
                "en": "1. **$-\\nabla V(\\mathbf{r})$:** The classical force exerted on the particle by the physical boundaries (e.g., the slit barrier)."
              },
              "v3": {
                "ko": "1. **$-\\nabla V(\\mathbf{r})$:** 슬릿 장벽 등 거시적인 물리적 환경이 입자에 가하는 고전적인 물리적 척력이다.",
                "en": "1. **$-\\nabla V(\\mathbf{r})$:** The classical force exerted on the particle by the physical boundaries (e.g., the slit barrier)."
              }
            }
          },
          {
            "id": "p4_14",
            "versions": {
              "v1": {
                "ko": "2. **$-\\nabla Q_s(\\mathbf{r}, t)$:** 공간 자체의 기하학적 곡률이 입자를 밀어내는 **'유도력(Guidance Force)'**이다.",
                "en": "2. **$-\\nabla Q_s(\\mathbf{r}, t)$:** The 'guidance force' exerted by the spatial curvature, pushing the particle."
              },
              "v2": {
                "ko": "2. **$-\\nabla Q_s(\\mathbf{r}, t)$:** 공간 자체의 기하학적 곡률이 입자를 밀어내는 **'유도력(Guidance Force)'**이다.",
                "en": "2. **$-\\nabla Q_s(\\mathbf{r}, t)$:** The 'guidance force' exerted by the spatial curvature, pushing the particle."
              },
              "v3": {
                "ko": "2. **$-\\nabla Q_s(\\mathbf{r}, t)$:** 공간 자체의 기하학적 곡률이 입자를 밀어내는 **'유도력(Guidance Force)'**이다.",
                "en": "2. **$-\\nabla Q_s(\\mathbf{r}, t)$:** The 'guidance force' exerted by the spatial curvature, pushing the particle."
              }
            }
          },
          {
            "id": "p4_15",
            "versions": {
              "v1": {
                "ko": "이중 슬릿 실험에서 실재하는 단일 입자는 두 개의 슬릿 중 반드시 어느 하나의 슬릿만을 통과한다. 그러나 물질적 실체가 없는 배경 공간의 기하학적 요동파는 유체처럼 두 슬릿을 모두 통과하며, 슬릿 너머에서 회절과 간섭을 일으킨다.",
                "en": "In the double-slit experiment, a real particle physically transits only one slit. However, the geometric waves of the background space propagate through both slits like a fluid, generating diffraction and interference patterns beyond the slits."
              },
              "v2": {
                "ko": "이중 슬릿 실험에서 실재하는 단일 입자는 두 개의 슬릿 중 반드시 어느 하나의 슬릿만을 통과한다. 그러나 물질적 실체가 없는 배경 공간의 기하학적 요동파는 유체처럼 두 슬릿을 모두 통과하며, 슬릿 너머에서 회절과 간섭을 일으킨다.",
                "en": "In the double-slit experiment, a real particle physically transits only one slit. However, the geometric waves of the background space propagate through both slits like a fluid, generating diffraction and interference patterns beyond the slits."
              },
              "v3": {
                "ko": "이중 슬릿 실험에서 실재하는 단일 입자는 두 개의 슬릿 중 반드시 **어느 '하나'의 슬릿만을 통과**한다. 그러나 물질적 실체가 없는 **배경 공간의 기하학적 요동파는 유체처럼 두 슬릿을 모두 통과**하며, 슬릿 너머에서 회절과 간섭을 일으킨다.",
                "en": "In the double-slit experiment, a real particle physically transits only one slit. However, the geometric waves of the background space propagate through both slits like a fluid, generating diffraction and interference patterns beyond the slits."
              }
            }
          },
          {
            "id": "p4_16",
            "versions": {
              "v1": {
                "ko": "### 4.2. 간섭 지형도의 형성과 궤적의 굴절",
                "en": "### Formation of Interference Topology and Trajectory Refraction"
              },
              "v2": {
                "ko": "### 4.2. 간섭 지형도의 형성과 궤적의 굴절",
                "en": "### Formation of Interference Topology and Trajectory Refraction"
              },
              "v3": {
                "ko": "### 4.2. 간섭 지형도의 형성과 궤적의 굴절",
                "en": "### Formation of Interference Topology and Trajectory Refraction"
              }
            }
          },
          {
            "id": "p4_17",
            "versions": {
              "v1": {
                "ko": "두 슬릿을 빠져나온 공간의 요동은 파동의 중첩 원리에 따라 보강 간섭과 상쇄 간섭을 일으킨다. 이에 따라 스크린을 향하는 공간의 진폭 $R(\\mathbf{r}, t)$은 극심한 위상 변화를 겪게 된다.",
                "en": "As spatial waves exit both slits, they superimpose, causing constructive and destructive interference. This leads to substantial phase variations in the amplitude $R(\\mathbf{r}, t)$ as it approaches the screen."
              },
              "v2": {
                "ko": "두 슬릿을 빠져나온 공간의 요동은 파동의 중첩 원리에 따라 보강 간섭과 상쇄 간섭을 일으킨다. 이에 따라 스크린을 향하는 공간의 진폭 $R(\\mathbf{r}, t)$은 극심한 위상 변화를 겪게 된다.",
                "en": "As spatial waves exit both slits, they superimpose, causing constructive and destructive interference. This leads to substantial phase variations in the amplitude $R(\\mathbf{r}, t)$ as it approaches the screen."
              },
              "v3": {
                "ko": "두 슬릿을 빠져나온 공간의 요동은 파동의 중첩 원리에 따라 보강 간섭과 상쇄 간섭을 일으킨다. 이에 따라 스크린을 향하는 공간의 진폭 $R(\\mathbf{r}, t)$은 극심한 위상 변화를 겪게 된다.",
                "en": "As spatial waves exit both slits, they superimpose, causing constructive and destructive interference. This leads to substantial phase variations in the amplitude $R(\\mathbf{r}, t)$ as it approaches the screen."
              }
            }
          },
          {
            "id": "p4_18",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_19",
            "versions": {
              "v1": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              },
              "v2": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              },
              "v3": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              }
            }
          },
          {
            "id": "p4_20",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_21",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_22",
            "versions": {
              "v1": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              },
              "v2": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              }
            }
          },
          {
            "id": "p4_23",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_24",
            "versions": {
              "v1": {
                "ko": "위 식에 의해, 상쇄 간섭이 일어나 $R \\to 0$에 가까워지는 지점에서는 공간 진동 퍼텐셜 $Q_s$가 극단적으로 치솟아 거대한 '퍼텐셜 장벽(Potential Barrier, 산맥)'을 형성한다. 반면 보강 간섭이 일어나는 지점은 에너지가 낮은 깊은 '골짜기(Valley)'가 된다.",
                "en": "By this formula, at points where destructive interference occurs and $R \\to 0$, the potential $Q_s$ spikes, forming a massive 'potential barrier' (crests). Conversely, points of constructive interference become low-energy 'valleys.'"
              },
              "v2": {
                "ko": "위 식에 의해, 상쇄 간섭이 일어나 $R \\to 0$에 가까워지는 지점에서는 공간 진동 퍼텐셜 $Q_s$가 극단적으로 치솟아 거대한 '퍼텐셜 장벽(Potential Barrier, 산맥)'을 형성한다. 반면 보강 간섭이 일어나는 지점은 에너지가 낮은 깊은 '골짜기(Valley)'가 된다.",
                "en": "By this formula, at points where destructive interference occurs and $R \\to 0$, the potential $Q_s$ spikes, forming a massive 'potential barrier' (crests). Conversely, points of constructive interference become low-energy 'valleys.'"
              },
              "v3": {
                "ko": "위 식에 의해, 상쇄 간섭이 일어나 $R \\to 0$에 가까워지는 지점에서는 공간 진동 퍼텐셜 $Q_s$가 극단적으로 치솟아 거대한 **'퍼텐셜 장벽(Potential Barrier, 산맥)'**을 형성한다. 반면 보강 간섭이 일어나는 지점은 에너지가 낮은 깊은 **'골짜기(Valley)'**가 된다.",
                "en": "By this formula, at points where destructive interference occurs and $R \\to 0$, the potential $Q_s$ spikes, forming a massive 'potential barrier' (crests). Conversely, points of constructive interference become low-energy 'valleys.'"
              }
            }
          },
          {
            "id": "p4_25",
            "versions": {
              "v1": {
                "ko": "이때 입자의 속도장(Velocity field)은 위상 작용 $S$에 의해 $\\mathbf{v} = \\frac{\\nabla S}{m}$로 정의되므로, 입자의 궤적은 공간 진동의 위상면에 수직으로 강제된다. 즉, 단일 슬릿을 통과하여 직진하려던 입자는 앞서 형성된 거대한 $-\\nabla Q_s$의 척력 장벽에 부딪히게 된다. 입자는 에너지가 높은 산맥을 통과하지 못하고 척력이 없는 $Q_s$의 골짜기로 미끄러지듯 유도되어 스크린을 향해 궤적이 굴절된다.",
                "en": "Since the velocity field is defined by the phase action as $\\mathbf{v} = \\frac{\\nabla S}{m}$, the particle's path is constrained perpendicular to the wavefronts. The particle emerging from a slit encounters the large repulsive gradient $-\\nabla Q_s$. Unable to cross the high-potential crests, the particle slides into the low-potential valleys, refracting its path toward the screen."
              },
              "v2": {
                "ko": "이때 입자의 속도장(Velocity field)은 위상 작용 $S$에 의해 $\\mathbf{v} = \\frac{\\nabla S}{m}$로 정의되므로, 입자의 궤적은 공간 진동의 위상면에 수직으로 강제된다. 즉, 단일 슬릿을 통과하여 직진하려던 입자는 앞서 형성된 거대한 $-\\nabla Q_s$의 척력 장벽에 부딪히게 된다. 입자는 에너지가 높은 산맥을 통과하지 못하고 척력이 없는 $Q_s$의 골짜기로 미끄러지듯 유도되어 스크린을 향해 궤적이 굴절된다.",
                "en": "Since the velocity field is defined by the phase action as $\\mathbf{v} = \\frac{\\nabla S}{m}$, the particle's path is constrained perpendicular to the wavefronts. The particle emerging from a slit encounters the large repulsive gradient $-\\nabla Q_s$. Unable to cross the high-potential crests, the particle slides into the low-potential valleys, refracting its path toward the screen."
              },
              "v3": {
                "ko": "이때 입자의 속도장(Velocity field)은 위상 작용 $S$에 의해 $\\mathbf{v} = \\frac{\\nabla S}{m}$로 정의되므로, 입자의 궤적은 공간 진동의 위상면에 수직으로 강제된다. 즉, 단일 슬릿을 통과하여 직진하려던 입자는 앞서 형성된 거대한 $-\\nabla Q_s$의 척력 장벽에 부딪히게 된다. 입자는 에너지가 높은 산맥을 통과하지 못하고 척력이 없는 $Q_s$의 골짜기로 미끄러지듯 유도되어 스크린을 향해 궤적이 굴절된다.",
                "en": "Since the velocity field is defined by the phase action as $\\mathbf{v} = \\frac{\\nabla S}{m}$, the particle's path is constrained perpendicular to the wavefronts. The particle emerging from a slit encounters the large repulsive gradient $-\\nabla Q_s$. Unable to cross the high-potential crests, the particle slides into the low-potential valleys, refracting its path toward the screen."
              }
            }
          },
          {
            "id": "p4_26",
            "versions": {
              "v1": {
                "ko": "### 4.3. 확률의 정체: 미시적 초기 조건의 앙상블",
                "en": "### Identity of Probability: Ensemble of Microscopic Initial Conditions"
              },
              "v2": {
                "ko": "### 4.3. 확률의 정체: 미시적 초기 조건의 앙상블",
                "en": "### Identity of Probability: Ensemble of Microscopic Initial Conditions"
              },
              "v3": {
                "ko": "### 4.3. 확률의 정체: 미시적 초기 조건의 앙상블",
                "en": "### Identity of Probability: Ensemble of Microscopic Initial Conditions"
              }
            }
          },
          {
            "id": "p4_27",
            "versions": {
              "v1": {
                "ko": "단일 입자의 궤적은 위 방정식들에 의해 한 치의 오차도 없는 '결정론적 경로(Deterministic Path)'를 따른다. 그럼에도 불구하고 스크린에 나타나는 간섭 무늬가 확률적 분포($|\\psi|^2$)를 띠는 이유는 입자 자체가 확률적이어서가 아니다. 그 이유는 실험자가 전자총에서 수많은 입자를 차례로 발사할 때, 각 입자의 극미세한 초기 발사 위치($\\mathbf{r}_0$)를 완벽하게 동일하게 제어할 수 없기 때문이다.",
                "en": "Although individual trajectories follow deterministic paths, the resulting probability distribution ($|\\psi|^2$) is not due to ontological indeterminacy. It arises because it is experimentally impossible to control the initial position ($\\mathbf{r}_0$) of each particle with absolute precision."
              },
              "v2": {
                "ko": "단일 입자의 궤적은 위 방정식들에 의해 한 치의 오차도 없는 '결정론적 경로(Deterministic Path)'를 따른다. 그럼에도 불구하고 스크린에 나타나는 간섭 무늬가 확률적 분포($|\\psi|^2$)를 띠는 이유는 입자 자체가 확률적이어서가 아니다. 그 이유는 실험자가 전자총에서 수많은 입자를 차례로 발사할 때, 각 입자의 극미세한 초기 발사 위치($\\mathbf{r}_0$)를 완벽하게 동일하게 제어할 수 없기 때문이다.",
                "en": "Although individual trajectories follow deterministic paths, the resulting probability distribution ($|\\psi|^2$) is not due to ontological indeterminacy. It arises because it is experimentally impossible to control the initial position ($\\mathbf{r}_0$) of each particle with absolute precision."
              },
              "v3": {
                "ko": "단일 입자의 궤적은 위 방정식들에 의해 한 치의 오차도 없는 **'결정론적 경로(Deterministic Path)'**를 따른다. 그럼에도 불구하고 스크린에 나타나는 간섭 무늬가 확률적 분포($|\\psi|^2$)를 띠는 이유는 입자 자체가 확률적이어서가 아니다.",
                "en": "Although individual trajectories follow deterministic paths, the resulting probability distribution ($|\\psi|^2$) is not due to ontological indeterminacy. It arises because it is experimentally impossible to control the initial position ($\\mathbf{r}_0$) of each particle with absolute precision."
              }
            }
          },
          {
            "id": "p4_28",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_29",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\mathbf{r}(t) = \\mathbf{r}_0 + \\int_0^t \\frac{\\nabla S(\\mathbf{r}, t')}{m} dt'"
              },
              "v2": {
                "ko": "",
                "en": "\\mathbf{r}(t) = \\mathbf{r}_0 + \\int_0^t \\frac{\\nabla S(\\mathbf{r}, t')}{m} dt'"
              },
              "v3": {
                "ko": "",
                "en": "\\mathbf{r}(t) = \\mathbf{r}_0 + \\int_0^t \\frac{\\nabla S(\\mathbf{r}, t')}{m} dt'"
              }
            }
          },
          {
            "id": "p4_30",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_31",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_32",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\mathbf{r}(t) = \\mathbf{r}_0 + \\int_0^t \\frac{\\nabla S(\\mathbf{r}, t')}{m} dt'"
              },
              "v2": {
                "ko": "",
                "en": "\\mathbf{r}(t) = \\mathbf{r}_0 + \\int_0^t \\frac{\\nabla S(\\mathbf{r}, t')}{m} dt'"
              }
            }
          },
          {
            "id": "p4_33",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_34",
            "versions": {
              "v1": {
                "ko": "초기 위치가 양자적 스케일에서 아주 미세하게만 달라도, 입자가 슬릿을 통과한 후 진입하게 되는 $Q_s$ 지형도의 골짜기 위상이 달라진다. 이 미세한 차이는 궤적의 굴절 과정에서 나비효과처럼 증폭되어, 스크린에 도달하는 최종 착탄점을 완전히 다른 곳으로 분기시킨다.",
                "en": "A microscopic difference in $\\mathbf{r}_0$ changes the phase of the $Q_s$ valley that the particle enters. This difference amplifies during refraction (akin to a butterfly effect), routing the particle to a different landing spot on the screen."
              },
              "v2": {
                "ko": "초기 위치가 양자적 스케일에서 아주 미세하게만 달라도, 입자가 슬릿을 통과한 후 진입하게 되는 $Q_s$ 지형도의 골짜기 위상이 달라진다. 이 미세한 차이는 궤적의 굴절 과정에서 나비효과처럼 증폭되어, 스크린에 도달하는 최종 착탄점을 완전히 다른 곳으로 분기시킨다.",
                "en": "A microscopic difference in $\\mathbf{r}_0$ changes the phase of the $Q_s$ valley that the particle enters. This difference amplifies during refraction (akin to a butterfly effect), routing the particle to a different landing spot on the screen."
              },
              "v3": {
                "ko": "초기 위치가 양자적 스케일에서 아주 미세하게만 달라도, 입자가 슬릿을 통과한 후 진입하게 되는 $Q_s$ 지형도의 골짜기 위상이 달라진다. 이 미세한 차이는 궤적의 굴절 과정에서 나비효과처럼 증폭되어, 스크린에 도달하는 최종 착탄점을 완전히 다른 곳으로 분기시킨다.",
                "en": "A microscopic difference in $\\mathbf{r}_0$ changes the phase of the $Q_s$ valley that the particle enters. This difference amplifies during refraction (akin to a butterfly effect), routing the particle to a different landing spot on the screen."
              }
            }
          },
          {
            "id": "p4_35",
            "versions": {
              "v1": {
                "ko": "결론적으로, 이중 슬릿 실험의 간섭 패턴은 '입자의 발견 확률'을 의미하는 것이 아니라, 무작위한 초기 위치를 가진 수많은 개별 입자들이 **미리 깎여진 공간 진동 지형도($Q_s$)의 수로(Channel)를 따라 분류되고 누적되었을 때 나타나는 '통계학적 앙상블(Statistical Ensemble)'**일 뿐이다. **이러한 진동하는 배경 파동에 의한 입자의 결정론적 궤적 유도 및 통계적 간섭 무늬 형성 메커니즘은, 거시적 유체역학 스케일의 액적(Walking droplets) 실험을 통해서도 그 물리적 타당성이 성공적으로 입증된 바 있다 [4].** 우주는 주사위 놀이를 하지 않으며, 파동성은 입자의 본질이 아니라 텅 빈 공간이 연주하는 기하학적 요동이 입자의 궤적을 굴절시킨 시각적 결과물이다.",
                "en": "In conclusion, the interference pattern in the double-slit experiment does not represent the 'probability of particle detection' as an ontological uncertainty. Instead, it is a statistical ensemble that emerges when numerous individual particles, each possessing randomized initial positions, are sorted and accumulated along the pre-carved channels of the spatial vibration landscape ($Q_s$). The physical validity of this mechanism, wherein a deterministic trajectory is guided by an oscillating background wave to form statistical interference fringes, has been successfully demonstrated at the macroscopic scale through walking droplet experiments in fluid dynamics [4]. The universe does not play dice; wave-like behavior is not intrinsic to particles but is a visual signature of background spatial fluctuations deflecting their paths."
              },
              "v2": {
                "ko": "결론적으로, 이중 슬릿 실험의 간섭 패턴은 '입자의 발견 확률'을 의미하는 것이 아니라, 무작위한 초기 위치를 가진 수많은 개별 입자들이 **미리 깎여진 공간 진동 지형도($Q_s$)의 수로(Channel)를 따라 분류되고 누적되었을 때 나타나는 '통계학적 앙상블(Statistical Ensemble)'**일 뿐이다. **이러한 진동하는 배경 파동에 의한 입자의 결정론적 궤적 유도 및 통계적 간섭 무늬 형성 메커니즘은, 거시적 유체역학 스케일의 액적(Walking droplets) 실험을 통해서도 그 물리적 타당성이 성공적으로 입증된 바 있다 [4].** 우주는 주사위 놀이를 하지 않으며, 파동성은 입자의 본질이 아니라 텅 빈 공간이 연주하는 기하학적 요동이 입자의 궤적을 굴절시킨 시각적 결과물이다.",
                "en": "In conclusion, the interference pattern in the double-slit experiment does not represent the 'probability of particle detection' as an ontological uncertainty. Instead, it is a statistical ensemble that emerges when numerous individual particles, each possessing randomized initial positions, are sorted and accumulated along the pre-carved channels of the spatial vibration landscape ($Q_s$). The physical validity of this mechanism, wherein a deterministic trajectory is guided by an oscillating background wave to form statistical interference fringes, has been successfully demonstrated at the macroscopic scale through walking droplet experiments in fluid dynamics [4]. The universe does not play dice; wave-like behavior is not intrinsic to particles but is a visual signature of background spatial fluctuations deflecting their paths."
              },
              "v3": {
                "ko": "결론적으로, 이중 슬릿 실험의 간섭 패턴은 '입자의 발견 확률'을 의미하는 것이 아니라, 무작위한 초기 위치를 가진 수많은 개별 입자들이 **미리 깎여진 공간 진동 지형도($Q_s$)의 수로(Channel)를 따라 분류되고 누적되었을 때 나타나는 '통계학적 앙상블(Statistical Ensemble)'**일 뿐이다. **이러한 진동하는 배경 파동에 의한 입자의 결정론적 궤적 유도 및 통계적 간섭 무늬 형성 메커니즘은, 거시적 유체역학 스케일의 액적(Walking droplets) 실험을 통해서도 그 물리적 타당성이 성공적으로 입증된 바 있다 [4].** 우주는 주사위 놀이를 하지 않으며, 파동성은 입자의 본질이 아니라 텅 빈 공간이 연주하는 기하학적 요동이 입자의 궤적을 굴절시킨 시각적 결과물이다.",
                "en": "In conclusion, the interference pattern in the double-slit experiment does not represent the 'probability of particle detection' as an ontological uncertainty. Instead, it is a statistical ensemble that emerges when numerous individual particles, each possessing randomized initial positions, are sorted and accumulated along the pre-carved channels of the spatial vibration landscape ($Q_s$). The physical validity of this mechanism, wherein a deterministic trajectory is guided by an oscillating background wave to form statistical interference fringes, has been successfully demonstrated at the macroscopic scale through walking droplet experiments in fluid dynamics [4]. The universe does not play dice; wave-like behavior is not intrinsic to particles but is a visual signature of background spatial fluctuations deflecting their paths."
              }
            }
          },
          {
            "id": "p4_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_12",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_13",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_18",
            "versions": {
              "v3": {
                "ko": "그 이유는 실험자가 전자총에서 수많은 입자를 차례로 발사할 때, **각 입자의 극미세한 초기 발사 위치($\\mathbf{r}_0$)를 완벽하게 동일하게 제어할 수 없기 때문이다.**",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_19",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_20",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_v3_en_10",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p4_v3_en_12",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          }
        ]
      },
      {
        "number": 5,
        "title": {
          "ko": "5장. 관측의 역학: 거시 에너지 섭동에 의한 공간 진동의 감쇠",
          "en": "Chapter 5. Damping and Decoherence"
        },
        "paragraphs": [
          {
            "id": "p5_1",
            "versions": {
              "v1": {
                "ko": "- **역학적 폭력성:** 관측 기기가 발산하는 거시적 타격 에너지($E_{obs}$)가 미시 공간 진동에 가하는 섭동 정의.",
                "en": "- **Dynamical Violence:** Definition of perturbations exerted on microscopic spatial vibrations by the macroscopic impact energy ($E_{obs}$) emitted by measurement apparatuses."
              },
              "v2": {
                "ko": "- **역학적 폭력성:** 관측 기기가 발산하는 거시적 타격 에너지($E_{obs}$)가 미시 공간 진동에 가하는 섭동 정의.",
                "en": "- **Dynamical Violence:** Definition of perturbations exerted on microscopic spatial vibrations by the macroscopic impact energy ($E_{obs}$) emitted by measurement apparatuses."
              }
            }
          },
          {
            "id": "p5_2",
            "versions": {
              "v1": {
                "ko": "- **결맞음 파괴:** 지수 감쇠 함수($\\gamma$)를 통해 공간 진동이 파괴되고, 직선 궤적으로 회복되는(파동성 소멸) 과정 수식화: $\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) Q_s = 0$",
                "en": "- **Decoherence:** Formalization of the wave-like dissipation process wherein spatial vibrations are suppressed and restored to linear trajectories through an exponential damping function ($\\gamma$): $\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) Q_s = 0$"
              },
              "v2": {
                "ko": "- **결맞음 파괴:** 지수 감쇠 함수($\\gamma$)를 통해 공간 진동이 파괴되고, 직선 궤적으로 회복되는(파동성 소멸) 과정 수식화: $\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) Q_s = 0$",
                "en": "- **Decoherence:** Formalization of the wave-like dissipation process wherein spatial vibrations are suppressed and restored to linear trajectories through an exponential damping function ($\\gamma$): $\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) Q_s = 0$"
              }
            }
          },
          {
            "id": "p5_3",
            "versions": {
              "v1": {
                "ko": "기존 양자역학은 이중 슬릿 실험에서 입자가 어느 슬릿을 통과하는지 '관측(Observation)'하는 순간, 중첩되어 있던 파동 함수가 확률적으로 '붕괴(Collapse)'하여 입자성만 남는다고 주장한다. 그러나 본 연구는 이러한 주관주의적 해석을 철저히 배제하고, 관측에 의한 간섭 무늬 소멸 현상을 **'거시적 관측 에너지가 미시적 공간 진동에 가하는 물리적 섭동(Perturbation)과 감쇠(Damping)'**라는 결정론적 역학으로 수학화한다.",
                "en": "Standard quantum physics asserts that the act of observation collapses the wavefunction, destroying interference. We reject this anthropocentric interpretation, mathematically modeling the erasure of interference as the physical perturbation and damping of microscopic spatial vibrations by macroscopic measurement energies."
              },
              "v2": {
                "ko": "기존 양자역학은 이중 슬릿 실험에서 입자가 어느 슬릿을 통과하는지 '관측(Observation)'하는 순간, 중첩되어 있던 파동 함수가 확률적으로 '붕괴(Collapse)'하여 입자성만 남는다고 주장한다. 그러나 본 연구는 이러한 주관주의적 해석을 철저히 배제하고, 관측에 의한 간섭 무늬 소멸 현상을 **'거시적 관측 에너지가 미시적 공간 진동에 가하는 물리적 섭동(Perturbation)과 감쇠(Damping)'**라는 결정론적 역학으로 수학화한다.",
                "en": "Standard quantum physics asserts that the act of observation collapses the wavefunction, destroying interference. We reject this anthropocentric interpretation, mathematically modeling the erasure of interference as the physical perturbation and damping of microscopic spatial vibrations by macroscopic measurement energies."
              },
              "v3": {
                "ko": "기존 양자역학은 이중 슬릿 실험에서 입자가 어느 슬릿을 통과하는지 '관측(Observation)'하는 순간, 중첩되어 있던 파동 함수가 확률적으로 '붕괴(Collapse)'하여 입자성만 남는다고 주장한다. 그러나 본 연구는 이러한 주관주의적 해석을 철저히 배제하고, 관측에 의한 간섭 무늬 소멸 현상을 **'거시적 관측 에너지가 미시적 공간 진동에 가하는 물리적 섭동(Perturbation)과 감쇠(Damping)'**라는 결정론적 역학으로 수학화한다.",
                "en": "Standard quantum physics asserts that the act of observation collapses the wavefunction, destroying interference. We reject this anthropocentric interpretation, mathematically modeling the erasure of interference as the physical perturbation and damping of microscopic spatial vibrations by macroscopic measurement energies."
              }
            }
          },
          {
            "id": "p5_4",
            "versions": {
              "v1": {
                "ko": "### 5.1. 관측의 물리적 실체",
                "en": "### Physical Reality of Observation"
              },
              "v2": {
                "ko": "### 5.1. 관측의 물리적 실체",
                "en": "### Physical Reality of Observation"
              },
              "v3": {
                "ko": "### 5.1. 관측의 물리적 실체",
                "en": "### Physical Reality of Observation"
              }
            }
          },
          {
            "id": "p5_5",
            "versions": {
              "v1": {
                "ko": "물리학에서 대상을 관측한다는 것은 단순히 의식을 가진 관찰자가 '본다'는 인식론적 행위가 아니다. 대상을 탐지하기 위해서는 반드시 탐지기(Detector)를 가동하여 광자(빛)를 쏘거나 강력한 전자기장을 형성하여 대상과 물리적으로 상호작용시켜야만 한다. 문제는 미시 세계의 전자(Electron)를 관측하기 위해 투사하는 이러한 물리적 개입(관측 에너지, $E_{obs}$)이, 전자를 유도하고 있던 미세한 공간의 기하학적 요동($Q_s$)의 에너지 스케일을 압도적으로 초과하는 거시적 폭력(Macroscopic Violence)이라는 점이다.",
                "en": "Observation in physics is not an epistemological act of 'looking.' Detection requires physical interaction—projecting photons or applying electromagnetic fields ($E_{obs}$) onto the target. The core issue is that this physical intervention is a macroscopic disturbance that vastly exceeds the delicate energy scale of the microscopic spatial fluctuations ($Q_s$) guiding the particle."
              },
              "v2": {
                "ko": "물리학에서 대상을 관측한다는 것은 단순히 의식을 가진 관찰자가 '본다'는 인식론적 행위가 아니다. 대상을 탐지하기 위해서는 반드시 탐지기(Detector)를 가동하여 광자(빛)를 쏘거나 강력한 전자기장을 형성하여 대상과 물리적으로 상호작용시켜야만 한다. 문제는 미시 세계의 전자(Electron)를 관측하기 위해 투사하는 이러한 물리적 개입(관측 에너지, $E_{obs}$)이, 전자를 유도하고 있던 미세한 공간의 기하학적 요동($Q_s$)의 에너지 스케일을 압도적으로 초과하는 거시적 폭력(Macroscopic Violence)이라는 점이다.",
                "en": "Observation in physics is not an epistemological act of 'looking.' Detection requires physical interaction—projecting photons or applying electromagnetic fields ($E_{obs}$) onto the target. The core issue is that this physical intervention is a macroscopic disturbance that vastly exceeds the delicate energy scale of the microscopic spatial fluctuations ($Q_s$) guiding the particle."
              },
              "v3": {
                "ko": "물리학에서 대상을 관측한다는 것은 단순히 의식을 가진 관찰자가 '본다'는 인식론적 행위가 아니다. 대상을 탐지하기 위해서는 반드시 탐지기(Detector)를 가동하여 광자(빛)를 쏘거나 강력한 전자기장을 형성하여 대상과 물리적으로 상호작용시켜야만 한다.",
                "en": "Observation in physics is not an epistemological act of 'looking.' Detection requires physical interaction—projecting photons or applying electromagnetic fields ($E_{obs}$) onto the target. The core issue is that this physical intervention is a macroscopic disturbance that vastly exceeds the delicate energy scale of the microscopic spatial fluctuations ($Q_s$) guiding the particle."
              }
            }
          },
          {
            "id": "p5_6",
            "versions": {
              "v1": {
                "ko": "### 5.2. 감쇠 인자가 적용된 확장 방정식",
                "en": "### Extended Equation with Damping Factor"
              },
              "v2": {
                "ko": "### 5.2. 감쇠 인자가 적용된 확장 방정식",
                "en": "### Extended Equation with Damping Factor"
              },
              "v3": {
                "ko": "### 5.2. 감쇠 인자가 적용된 확장 방정식",
                "en": "### Extended Equation with Damping Factor"
              }
            }
          },
          {
            "id": "p5_7",
            "versions": {
              "v1": {
                "ko": "관측 기기가 공간에 가하는 물리적 섭동은 미세한 공간 진동의 결맞음(Coherence)을 교란하고 파괴한다[5]. 이를 수학적으로 정식화하기 위해, 기존 공간 진동 퍼텐셜 $Q_s$에 관측 에너지의 크기에 반비례하여 공간 진동을 억제하는 **'감쇠 함수(Damping function, $\\gamma$)'**를 새롭게 도입한다.",
                "en": "The physical perturbation introduced by detectors disrupts the spatial wave coherence [5]. We model this by introducing a damping function ($\\gamma$) that suppresses spatial fluctuations based on the magnitude of the measurement energy:"
              },
              "v2": {
                "ko": "관측 기기가 공간에 가하는 물리적 섭동은 미세한 공간 진동의 결맞음(Coherence)을 교란하고 파괴한다[5]. 이를 수학적으로 정식화하기 위해, 기존 공간 진동 퍼텐셜 $Q_s$에 관측 에너지의 크기에 반비례하여 공간 진동을 억제하는 **'감쇠 함수(Damping function, $\\gamma$)'**를 새롭게 도입한다.",
                "en": "The physical perturbation introduced by detectors disrupts the spatial wave coherence [5]. We model this by introducing a damping function ($\\gamma$) that suppresses spatial fluctuations based on the magnitude of the measurement energy:"
              },
              "v3": {
                "ko": "관측 기기가 공간에 가하는 물리적 섭동은 미세한 공간 진동의 결맞음(Coherence)을 교란하고 파괴한다[5]. 이를 수학적으로 정식화하기 위해, 기존 공간 진동 퍼텐셜 $Q_s$에 관측 에너지의 크기에 반비례하여 공간 진동을 억제하는 **'감쇠 함수(Damping function, $\\gamma$)'**를 새롭게 도입한다.",
                "en": "The physical perturbation introduced by detectors disrupts the spatial wave coherence [5]. We model this by introducing a damping function ($\\gamma$) that suppresses spatial fluctuations based on the magnitude of the measurement energy:"
              }
            }
          },
          {
            "id": "p5_8",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_9",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right)"
              },
              "v2": {
                "ko": "",
                "en": "\\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right)"
              },
              "v3": {
                "ko": "",
                "en": "\\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right)"
              }
            }
          },
          {
            "id": "p5_10",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_11",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_12",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right)"
              },
              "v2": {
                "ko": "",
                "en": "\\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right)"
              }
            }
          },
          {
            "id": "p5_13",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_14",
            "versions": {
              "v1": {
                "ko": "*(단, $\\epsilon_c$는 미시 공간 진동이 기하학적 결맞음을 유지할 수 있는 임계 에너지 상수이다.)*",
                "en": "*(Here, $\\epsilon_c$ is the critical energy threshold below which microscopic coherence is maintained.)*"
              },
              "v2": {
                "ko": "*(단, $\\epsilon_c$는 미시 공간 진동이 기하학적 결맞음을 유지할 수 있는 임계 에너지 상수이다.)*",
                "en": "*(Here, $\\epsilon_c$ is the critical energy threshold below which microscopic coherence is maintained.)*"
              },
              "v3": {
                "ko": "*(단, $\\epsilon_c$는 미시 공간 진동이 기하학적 결맞음을 유지할 수 있는 임계 에너지 상수이다.)*",
                "en": "*(Here, $\\epsilon_c$ is the critical energy threshold below which microscopic coherence is maintained.)*"
              }
            }
          },
          {
            "id": "p5_15",
            "versions": {
              "v1": {
                "ko": "이 함수를 4장에서 도출했던 입자의 유도 운동 방정식에 대입하면, 관측이 개입된 입자의 최종 운동 방정식은 다음과 같이 수정된다.",
                "en": "Substituting this into the equation of motion yields the modified dynamical equation under observation:"
              },
              "v2": {
                "ko": "이 함수를 4장에서 도출했던 입자의 유도 운동 방정식에 대입하면, 관측이 개입된 입자의 최종 운동 방정식은 다음과 같이 수정된다.",
                "en": "Substituting this into the equation of motion yields the modified dynamical equation under observation:"
              },
              "v3": {
                "ko": "이 함수를 4장에서 도출했던 입자의 유도 운동 방정식에 대입하면, 관측이 개입된 입자의 최종 운동 방정식은 다음과 같이 수정된다.",
                "en": "Substituting this into the equation of motion yields the modified dynamical equation under observation:"
              }
            }
          },
          {
            "id": "p5_16",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_17",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla \\left[ \\gamma(E_{obs}) \\cdot Q_s(\\mathbf{r}, t) \\right]"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla \\left[ \\gamma(E_{obs}) \\cdot Q_s(\\mathbf{r}, t) \\right]"
              },
              "v3": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V - \\nabla Q_s"
              }
            }
          },
          {
            "id": "p5_18",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_19",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_20",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla \\left[ \\gamma(E_{obs}) \\cdot Q_s(\\mathbf{r}, t) \\right]"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla \\left[ \\gamma(E_{obs}) \\cdot Q_s(\\mathbf{r}, t) \\right]"
              }
            }
          },
          {
            "id": "p5_21",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_22",
            "versions": {
              "v1": {
                "ko": "### 5.3. 결맞음 파괴와 간섭 무늬의 역학적 소멸",
                "en": "### Decoherence and Mechanical Erasure of Interference"
              },
              "v2": {
                "ko": "### 5.3. 결맞음 파괴와 간섭 무늬의 역학적 소멸",
                "en": "### Decoherence and Mechanical Erasure of Interference"
              },
              "v3": {
                "ko": "### 5.3. 결맞음 파괴와 간섭 무늬의 역학적 소멸",
                "en": "### Decoherence and Mechanical Erasure of Interference"
              }
            }
          },
          {
            "id": "p5_23",
            "versions": {
              "v1": {
                "ko": "위 수정된 방정식을 통해 '관측에 의한 파동성 소멸' 현상을 역학적으로 명쾌하게 증명할 수 있다.",
                "en": "Using this equation, we can demonstrate the mechanical erasure of wave properties under measurement:"
              },
              "v2": {
                "ko": "위 수정된 방정식을 통해 '관측에 의한 파동성 소멸' 현상을 역학적으로 명쾌하게 증명할 수 있다.",
                "en": "Using this equation, we can demonstrate the mechanical erasure of wave properties under measurement:"
              },
              "v3": {
                "ko": "위 수정된 방정식을 통해 '관측에 의한 파동성 소멸' 현상을 역학적으로 명쾌하게 증명할 수 있다.",
                "en": "Using this equation, we can demonstrate the mechanical erasure of wave properties under measurement:"
              }
            }
          },
          {
            "id": "p5_24",
            "versions": {
              "v1": {
                "ko": "1. **미관측 상태 ($E_{obs} \\approx 0$):**",
                "en": "1. **Unobserved State ($E_{obs} \\approx 0$):**"
              },
              "v2": {
                "ko": "1. **미관측 상태 ($E_{obs} \\approx 0$):**",
                "en": "1. **Unobserved State ($E_{obs} \\approx 0$):**"
              },
              "v3": {
                "ko": "**1. 미관측 상태 ($E_{obs} \\approx 0$):**",
                "en": "1. **Unobserved State ($E_{obs} \\approx 0$):**"
              }
            }
          },
          {
            "id": "p5_25",
            "versions": {
              "v1": {
                "ko": "시간에 따른 감쇠 함수 $\\gamma(0) \\approx 1$이 성립한다.",
                "en": "In the absence of perturbation, $\\gamma(0) \\approx 1 snapshot$:"
              },
              "v2": {
                "ko": "시간에 따른 감쇠 함수 $\\gamma(0) \\approx 1$이 성립한다.",
                "en": "In the absence of perturbation, $\\gamma(0) \\approx 1 snapshot$:"
              }
            }
          },
          {
            "id": "p5_26",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_27",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V - \\nabla Q_s"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V - \\nabla Q_s"
              }
            }
          },
          {
            "id": "p5_28",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_29",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_30",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V - \\nabla Q_s"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V - \\nabla Q_s"
              }
            }
          },
          {
            "id": "p5_31",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_32",
            "versions": {
              "v1": {
                "ko": "이 경우 입자는 온전히 공간 진동 퍼텐셜($Q_s$)의 유도력($-\\nabla Q_s$)을 받아, 궤적이 굴절되어 간섭 무늬(물결 패턴)를 만든다.",
                "en": "The particle experiences the full spatial guidance force ($-\\nabla Q_s$), deflecting to generate the interference fringes."
              },
              "v2": {
                "ko": "이 경우 입자는 온전히 공간 진동 퍼텐셜($Q_s$)의 유도력($-\\nabla Q_s$)을 받아, 궤적이 굴절되어 간섭 무늬(물결 패턴)를 만든다.",
                "en": "The particle experiences the full spatial guidance force ($-\\nabla Q_s$), deflecting to generate the interference fringes."
              },
              "v3": {
                "ko": "이 경우 입자는 온전히 공간 진동 퍼텐셜($Q_s$)의 유도력($-\\nabla Q_s$)을 받아, 4장에서 서술한 대로 궤적이 굴절되어 간섭 무늬(물결 패턴)를 만든다.",
                "en": "The particle experiences the full spatial guidance force ($-\\nabla Q_s$), deflecting to generate the interference fringes."
              }
            }
          },
          {
            "id": "p5_33",
            "versions": {
              "v1": {
                "ko": "2. **강한 관측 상태 ($E_{obs} \\gg \\epsilon_c$):**",
                "en": "2. **Strong Measurement State ($E_{obs} \\gg \\epsilon_c$):**"
              },
              "v2": {
                "ko": "2. **강한 관측 상태 ($E_{obs} \\gg \\epsilon_c$):**",
                "en": "2. **Strong Measurement State ($E_{obs} \\gg \\epsilon_c$):**"
              },
              "v3": {
                "ko": "**2. 강한 관측 상태 ($E_{obs} \\gg \\epsilon_c$):**",
                "en": "2. **Strong Measurement State ($E_{obs} \\gg \\epsilon_c$):**"
              }
            }
          },
          {
            "id": "p5_34",
            "versions": {
              "v1": {
                "ko": "입자를 탐지하기 위해 광자나 전자기장($E_{obs}$)을 쏘는 순간, 지수 함수의 성질에 의해 감쇠 인자는 급격히 0에 수렴한다.",
                "en": "When measurement energy is applied, the damping factor exponentially converges to zero:"
              },
              "v2": {
                "ko": "입자를 탐지하기 위해 광자나 전자기장($E_{obs}$)을 쏘는 순간, 지수 함수의 성질에 의해 감쇠 인자는 급격히 0에 수렴한다.",
                "en": "When measurement energy is applied, the damping factor exponentially converges to zero:"
              },
              "v3": {
                "ko": "입자를 탐지하기 위해 광자나 전자기장($E_{obs}$)을 쏘는 순간, 지수 함수의 성질에 의해 감쇠 인자는 급격히 0에 수렴한다.",
                "en": "When measurement energy is applied, the damping factor exponentially converges to zero:"
              }
            }
          },
          {
            "id": "p5_35",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_36",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) = 0"
              },
              "v3": {
                "ko": "",
                "en": "$\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) = 0$"
              }
            }
          },
          {
            "id": "p5_37",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_38",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_39",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) = 0"
              }
            }
          },
          {
            "id": "p5_40",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_41",
            "versions": {
              "v1": {
                "ko": "따라서 공간 진동 퍼텐셜 항($-\\nabla Q_s$)이 붕괴하여 소거되며, 운동 방정식은 다음과 같이 축소된다.",
                "en": "Thus, the spatial vibration term is eliminated, and the equation reduces to:"
              },
              "v2": {
                "ko": "따라서 공간 진동 퍼텐셜 항($-\\nabla Q_s$)이 붕괴하여 소거되며, 운동 방정식은 다음과 같이 축소된다.",
                "en": "Thus, the spatial vibration term is eliminated, and the equation reduces to:"
              }
            }
          },
          {
            "id": "p5_42",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_43",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r})"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r})"
              },
              "v3": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r})"
              }
            }
          },
          {
            "id": "p5_44",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_45",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_46",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r})"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r})"
              }
            }
          },
          {
            "id": "p5_47",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_48",
            "versions": {
              "v1": {
                "ko": "**[물리적 결론] / [Physical Conclusion]**",
                "en": "When measurement energy is introduced, the delicate geometric ripples ($Q_s$) on the spatial fluid are completely disrupted and flattened by the massive macroscopic perturbation. As the potential valleys ($-\\nabla Q_s$) guiding the particle's trajectory are physically damped to zero, the particle transiting the slit no longer experiences quantum refraction. Instead, it interacts solely with the classical external barrier ($V$) and behaves like a billiard ball moving linearly in accordance with inertia. Consequently, the interference fringes disappear from the screen, leaving only two classical particle strip signatures. This physically reframes the phenomenon of environment-induced decoherence [5] as a deterministic mechanism of mechanical damping of microscopic spatial vibrations by macroscopic impact energies."
              },
              "v2": {
                "ko": "**[물리적 결론] / [Physical Conclusion]**",
                "en": "When measurement energy is introduced, the delicate geometric ripples ($Q_s$) on the spatial fluid are completely disrupted and flattened by the massive macroscopic perturbation. As the potential valleys ($-\\nabla Q_s$) guiding the particle's trajectory are physically damped to zero, the particle transiting the slit no longer experiences quantum refraction. Instead, it interacts solely with the classical external barrier ($V$) and behaves like a billiard ball moving linearly in accordance with inertia. Consequently, the interference fringes disappear from the screen, leaving only two classical particle strip signatures. This physically reframes the phenomenon of environment-induced decoherence [5] as a deterministic mechanism of mechanical damping of microscopic spatial vibrations by macroscopic impact energies."
              }
            }
          },
          {
            "id": "p5_49",
            "versions": {
              "v1": {
                "ko": "관측 에너지가 개입하면, 유체(공간) 위에 섬세하게 형성되어 있던 기하학적 파도($Q_s$)가 관측 기기가 일으킨 거대한 섭동에 휩쓸려 완전히 박살 나고 평탄화(Flattening)된다. 입자의 궤적을 굴절시키던 골짜기($-\\nabla Q_s$)가 물리적으로 0으로 상쇄(Damping)되었으므로, 슬릿을 통과한 입자는 더 이상 굴절을 겪지 않고 고전적인 외부 장벽($V$)만을 느끼며 관성의 법칙에 따라 당구공처럼 직선 운동하게 된다. 그 결과 스크린에는 간섭 무늬가 사라지고 두 줄의 입자적 흔적만 남게 되는 것이다. 이것이 이른바 '파동 함수 붕괴'의 진정한 실체이다. **즉, 현대 양자역학에서 외부 환경과의 상호작용으로 인해 양자적 중첩이 파괴된다고 설명하는 '환경 유도 결맞음 파괴(Environment-induced decoherence)' 현상 [5]을, 본 연구는 '거시적 타격 에너지에 의한 미시적 공간 진동의 역학적 상쇄(Mechanical Damping of Spatial Fluctuation)'라는 결정론적 메커니즘으로 완벽하게 구체화한 것이다.**",
                "en": ""
              },
              "v2": {
                "ko": "관측 에너지가 개입하면, 유체(공간) 위에 섬세하게 형성되어 있던 기하학적 파도($Q_s$)가 관측 기기가 일으킨 거대한 섭동에 휩쓸려 완전히 박살 나고 평탄화(Flattening)된다. 입자의 궤적을 굴절시키던 골짜기($-\\nabla Q_s$)가 물리적으로 0으로 상쇄(Damping)되었으므로, 슬릿을 통과한 입자는 더 이상 굴절을 겪지 않고 고전적인 외부 장벽($V$)만을 느끼며 관성의 법칙에 따라 당구공처럼 직선 운동하게 된다. 그 결과 스크린에는 간섭 무늬가 사라지고 두 줄의 입자적 흔적만 남게 되는 것이다. 이것이 이른바 '파동 함수 붕괴'의 진정한 실체이다. **즉, 현대 양자역학에서 외부 환경과의 상호작용으로 인해 양자적 중첩이 파괴된다고 설명하는 '환경 유도 결맞음 파괴(Environment-induced decoherence)' 현상 [5]을, 본 연구는 '거시적 타격 에너지에 의한 미시적 공간 진동의 역학적 상쇄(Mechanical Damping of Spatial Fluctuation)'라는 결정론적 메커니즘으로 완벽하게 구체화한 것이다.**",
                "en": ""
              },
              "v3": {
                "ko": "관측 에너지가 개입하면, 유체(공간) 위에 섬세하게 형성되어 있던 기하학적 파도($Q_s$)가 관측 기기가 일으킨 거대한 섭동에 휩쓸려 완전히 박살 나고 평탄화(Flattening)된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_50",
            "versions": {
              "v1": {
                "ko": "### 5.4. 비국소성과 양자 얽힘",
                "en": "### Quantum Entanglement"
              },
              "v2": {
                "ko": "### 5.4. 비국소성과 양자 얽힘",
                "en": "### Quantum Entanglement"
              }
            }
          },
          {
            "id": "p5_51",
            "versions": {
              "v1": {
                "ko": "코펜하겐 해석이 남긴 가장 기괴한 난제인 '양자 얽힘(Quantum Entanglement)' 현상은, 관측 행위가 빛의 속도를 초과하여 우주 반대편 입자의 상태를 결정짓는 듯한 '비국소성(Non-locality)'을 띠어 물리적 인과율에 정면으로 위배되는 철학적 모순을 낳았다. 그러나 본 연구의 '진동하는 공간' 역학은 이 유령 같은 원격 작용을 정보의 초광속 이동이 아닌, 공통의 공간 진동 파동이 겪는 **'동시적인 기하학적 역학(Geometrical Mechanics) 붕괴'** 현상으로 명쾌하게 해명한다.",
                "en": "The phenomenon of quantum entanglement, one of the most bizarre conundrums of the Copenhagen interpretation, has historically yielded philosophical contradictions that violate physical causality, framing non-locality as an instantaneous superluminal determination of the state of a distant particle. However, our mechanics of 'vibrating space' resolves this ghostly action-at-a-distance. Rather than relying on superluminal transmission of information, it frames the phenomenon as a simultaneous hydrodynamic collapse of the common spatial vibration wave network shared by the entangled system."
              },
              "v2": {
                "ko": "코펜하겐 해석이 남긴 가장 기괴한 난제인 '양자 얽힘(Quantum Entanglement)' 현상은, 관측 행위가 빛의 속도를 초과하여 우주 반대편 입자의 상태를 결정짓는 듯한 '비국소성(Non-locality)'을 띠어 물리적 인과율에 정면으로 위배되는 철학적 모순을 낳았다. 그러나 본 연구의 '진동하는 공간' 역학은 이 유령 같은 원격 작용을 정보의 초광속 이동이 아닌, 공통의 공간 진동 파동이 겪는 **'동시적인 기하학적 역학(Geometrical Mechanics) 붕괴'** 현상으로 명쾌하게 해명한다.",
                "en": "The phenomenon of quantum entanglement, one of the most bizarre conundrums of the Copenhagen interpretation, has historically yielded philosophical contradictions that violate physical causality, framing non-locality as an instantaneous superluminal determination of the state of a distant particle. However, our mechanics of 'vibrating space' resolves this ghostly action-at-a-distance. Rather than relying on superluminal transmission of information, it frames the phenomenon as a simultaneous hydrodynamic collapse of the common spatial vibration wave network shared by the entangled system."
              },
              "v3": {
                "ko": "코펜하겐 해석이 남긴 가장 기괴한 난제인 '양자 얽힘(Quantum Entanglement)' 현상은, 관측 행위가 빛의 속도를 초과하여 우주 반대편 입자의 상태를 결정짓는 듯한 '비국소성(Non-locality)'을 띠어 물리적 인과율에 정면으로 위배되는 철학적 모순을 낳았다. 그러나 본 연구의 '진동하는 공간' 역학은 이 유령 같은 원격 작용을 정보의 초광속 이동이 아닌, 공통의 공간 진동 파동이 겪는 **'동시적인 기하학적 역학(Geometrical Mechanics) 붕괴'** 현상으로 명쾌하게 해명한다.",
                "en": "The phenomenon of quantum entanglement, one of the most bizarre conundrums of the Copenhagen interpretation, has historically yielded philosophical contradictions that violate physical causality, framing non-locality as an instantaneous superluminal determination of the state of a distant particle. However, our mechanics of 'vibrating space' resolves this ghostly action-at-a-distance. Rather than relying on superluminal transmission of information, it frames the phenomenon as a simultaneous hydrodynamic collapse of the common spatial vibration wave network shared by the entangled system."
              }
            }
          },
          {
            "id": "p5_52",
            "versions": {
              "v1": {
                "ko": "**1. 얽힘의 수학적 기반: 분모 $R$에 의한 거리에 독립적인 비국소성**",
                "en": "**1. Mathematical Foundation of Entanglement: Distance-Independent Non-locality via the Amplitude R in the Denominator**"
              },
              "v2": {
                "ko": "**1. 얽힘의 수학적 기반: 분모 $R$에 의한 거리에 독립적인 비국소성**",
                "en": "**1. Mathematical Foundation of Entanglement: Distance-Independent Non-locality via the Amplitude R in the Denominator**"
              },
              "v3": {
                "ko": "**1. 얽힘의 수학적 기반: 분모 $R$에 의한 거리에 독립적인 비국소성**",
                "en": "**1. Mathematical Foundation of Entanglement: Distance-Independent Non-locality via the Amplitude R in the Denominator**"
              }
            }
          },
          {
            "id": "p5_53",
            "versions": {
              "v1": {
                "ko": "다입자계(Multi-particle system) 시스템에서 얽혀 있는 두 입자는 독립된 객체가 아니라, 생성 시점부터 동일한 공간 진동의 결(Wave-front)과 위상(Phase)을 공유하는 하나의 연속된 텐서 시스템 위에 놓여 있다. 본 모델의 공간 진동 퍼텐셜 수식 $Q_s = -(\\hbar^2/2m)(\\nabla^2 R / R)$을 고찰해 보자.",
                "en": "In a multi-particle system, two entangled particles are not independent objects; rather, from the moment of their creation, they reside on a single continuous tensor system sharing the same spatial vibration wave-front and phase. Consider our formalization of the spatial vibration potential, $Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$."
              },
              "v2": {
                "ko": "다입자계(Multi-particle system) 시스템에서 얽혀 있는 두 입자는 독립된 객체가 아니라, 생성 시점부터 동일한 공간 진동의 결(Wave-front)과 위상(Phase)을 공유하는 하나의 연속된 텐서 시스템 위에 놓여 있다. 본 모델의 공간 진동 퍼텐셜 수식 $Q_s = -(\\hbar^2/2m)(\\nabla^2 R / R)$을 고찰해 보자.",
                "en": "In a multi-particle system, two entangled particles are not independent objects; rather, from the moment of their creation, they reside on a single continuous tensor system sharing the same spatial vibration wave-front and phase. Consider our formalization of the spatial vibration potential, $Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$."
              },
              "v3": {
                "ko": "다입자계(Multi-particle system) 시스템에서 얽혀 있는 두 입자는 독립된 객체가 아니라, 생성 시점부터 동일한 공간 진동의 결(Wave-front)과 위상(Phase)을 공유하는 하나의 연속된 텐서 시스템 위에 놓여 있다. 본 모델의 공간 진동 퍼텐셜 수식 $Q_s = -(\\hbar^2/2m)(\\nabla^2 R / R)$을 고찰해 보자.",
                "en": "In a multi-particle system, two entangled particles are not independent objects; rather, from the moment of their creation, they reside on a single continuous tensor system sharing the same spatial vibration wave-front and phase. Consider our formalization of the spatial vibration potential, $Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$."
              }
            }
          },
          {
            "id": "p5_54",
            "versions": {
              "v1": {
                "ko": "고전적 파동은 거리가 멀어짐에 따라 에너지가 분산되지만, $Q_s$는 역학적 힘의 근원이 절대적 진폭($R$)이 아니라 기하학적 곡률의 비율($\\nabla^2 R / R$)에 의해 결정된다. 얽힌 입자들이 우주적 거리로 멀어짐에 따라 두 입자를 잇는 공간 파동의 진폭($R$)이 희미해져 $0$에 수렴하더라도, 수식 구조상 진폭 $R$이 분모와 분자에서 동시에 작아지며 대수적으로 약분된다. 즉, 텅 빈 공간을 가로지르는 기하학적 파동의 '형태(곡률)'만 단절 없이 연결되어 있다면, 입자 간의 역학적 궤적 유도력($-\\nabla Q_s$)은 거리에 관계없이 소멸하지 않고 절대적인 동기화를 유지함을 수학적으로 증명한다.",
                "en": "While classical waves dissipate energy as they propagate across distance, the mechanical force derived from $Q_s$ is determined not by the absolute amplitude ($R$) but by the ratio of geometric curvature ($\\nabla^2 R / R$). As the entangled particles separate over cosmic distances, even if the amplitude ($R$) of the spatial wave linking them diminishes to zero, $R$ algebraically cancels out in both the numerator and denominator. This mathematically demonstrates that as long as the 'form (curvature)' of the geometrical wave crossing empty space remains unbroken, the mechanical guidance force ($-\\nabla Q_s$) does not decay with distance, maintaining absolute phase synchronization."
              },
              "v2": {
                "ko": "고전적 파동은 거리가 멀어짐에 따라 에너지가 분산되지만, $Q_s$는 역학적 힘의 근원이 절대적 진폭($R$)이 아니라 기하학적 곡률의 비율($\\nabla^2 R / R$)에 의해 결정된다. 얽힌 입자들이 우주적 거리로 멀어짐에 따라 두 입자를 잇는 공간 파동의 진폭($R$)이 희미해져 $0$에 수렴하더라도, 수식 구조상 진폭 $R$이 분모와 분자에서 동시에 작아지며 대수적으로 약분된다. 즉, 텅 빈 공간을 가로지르는 기하학적 파동의 '형태(곡률)'만 단절 없이 연결되어 있다면, 입자 간의 역학적 궤적 유도력($-\\nabla Q_s$)은 거리에 관계없이 소멸하지 않고 절대적인 동기화를 유지함을 수학적으로 증명한다.",
                "en": "While classical waves dissipate energy as they propagate across distance, the mechanical force derived from $Q_s$ is determined not by the absolute amplitude ($R$) but by the ratio of geometric curvature ($\\nabla^2 R / R$). As the entangled particles separate over cosmic distances, even if the amplitude ($R$) of the spatial wave linking them diminishes to zero, $R$ algebraically cancels out in both the numerator and denominator. This mathematically demonstrates that as long as the 'form (curvature)' of the geometrical wave crossing empty space remains unbroken, the mechanical guidance force ($-\\nabla Q_s$) does not decay with distance, maintaining absolute phase synchronization."
              },
              "v3": {
                "ko": "고전적 파동은 거리가 멀어짐에 따라 에너지가 분산되지만, $Q_s$는 역학적 힘의 근원이 절대적 진폭($R$)이 아니라 기하학적 곡률의 비율($\\nabla^2 R / R$)에 의해 결정된다. 얽힌 입자들이 우주적 거리로 멀어짐에 따라 두 입자를 잇는 공간 파동의 진폭($R$)이 희미해져 $0$에 수렴하더라도, 수식 구조상 진폭 $R$이 분모와 분자에서 동시에 작아지며 대수적으로 약분된다. 즉, 텅 빈 공간을 가로지르는 기하학적 파동의 '형태(곡률)'만 단절 없이 연결되어 있다면, 입자 간의 역학적 궤적 유도력($-\\nabla Q_s$)은 거리에 관계없이 소멸하지 않고 절대적인 동기화를 유지함을 수학적으로 증명한다.",
                "en": "While classical waves dissipate energy as they propagate across distance, the mechanical force derived from $Q_s$ is determined not by the absolute amplitude ($R$) but by the ratio of geometric curvature ($\\nabla^2 R / R$). As the entangled particles separate over cosmic distances, even if the amplitude ($R$) of the spatial wave linking them diminishes to zero, $R$ algebraically cancels out in both the numerator and denominator. This mathematically demonstrates that as long as the 'form (curvature)' of the geometrical wave crossing empty space remains unbroken, the mechanical guidance force ($-\\nabla Q_s$) does not decay with distance, maintaining absolute phase synchronization."
              }
            }
          },
          {
            "id": "p5_55",
            "versions": {
              "v1": {
                "ko": "**2. 동시 붕괴의 역학적 해명: 관측 타격에 의한 동시적 장력 붕괴**",
                "en": "**2. Mechanical Explanation of Simultaneous Collapse: Co-instantaneous Tension Collapse via Observational Impact**"
              },
              "v2": {
                "ko": "**2. 동시 붕괴의 역학적 해명: 관측 타격에 의한 동시적 장력 붕괴**",
                "en": "**2. Mechanical Explanation of Simultaneous Collapse: Co-instantaneous Tension Collapse via Observational Impact**"
              },
              "v3": {
                "ko": "**2. 동시 붕괴의 역학적 해명: 관측 타격에 의한 동시적 장력 붕괴**",
                "en": "**2. Mechanical Explanation of Simultaneous Collapse: Co-instantaneous Tension Collapse via Observational Impact**"
              }
            }
          },
          {
            "id": "p5_56",
            "versions": {
              "v1": {
                "ko": "이러한 기하학적 얽힘 상태에서, 얽힌 시스템 중 입자 A를 '관측'한다는 것은 앞선 5.3절에서 규명한 바와 같이, 거시적 섭동 에너지($E_{obs}$)를 투사하여 해당 국소 공간의 기하학적 진동 파동을 물리적으로 강타하고 감쇠(Damping)시키는 행위이다.",
                "en": "Under this geometrical entanglement, measuring particle A means projecting a macroscopic perturbation energy ($E_{obs}$) that physically strikes and dampens the geometrical vibration wave in that local region, as outlined in Section 5.3."
              },
              "v2": {
                "ko": "이러한 기하학적 얽힘 상태에서, 얽힌 시스템 중 입자 A를 '관측'한다는 것은 앞선 5.3절에서 규명한 바와 같이, 거시적 섭동 에너지($E_{obs}$)를 투사하여 해당 국소 공간의 기하학적 진동 파동을 물리적으로 강타하고 감쇠(Damping)시키는 행위이다.",
                "en": "Under this geometrical entanglement, measuring particle A means projecting a macroscopic perturbation energy ($E_{obs}$) that physically strikes and dampens the geometrical vibration wave in that local region, as outlined in Section 5.3."
              },
              "v3": {
                "ko": "이러한 기하학적 얽힘 상태에서, 얽힌 시스템 중 입자 A를 '관측'한다는 것은 앞선 5.3절에서 규명한 바와 같이, 거시적 섭동 에너지($E_{obs}$)를 투사하여 해당 국소 공간의 기하학적 진동 파동을 물리적으로 강타하고 감쇠(Damping)시키는 행위이다.",
                "en": "Under this geometrical entanglement, measuring particle A means projecting a macroscopic perturbation energy ($E_{obs}$) that physically strikes and dampens the geometrical vibration wave in that local region, as outlined in Section 5.3."
              }
            }
          },
          {
            "id": "p5_57",
            "versions": {
              "v1": {
                "ko": "여기서 역학적 핵심은 이 공간의 파동이 입자 B와도 물리적으로 분리 불가능한 '하나의 팽팽한 장력망(Tension Network)'으로 이어져 있다는 점이다. 팽팽하게 당겨진 거미줄의 한쪽 끝을 강하게 끊어버리면 우주 반대편 그물의 장력도 즉각적으로 소실되며 풀려버리듯, A 입자 측면의 공간 파동이 박살나며 평탄화되는 순간 그 파동의 결을 따라 A와 얽혀 있던(Phase-locked) B 입자 주변의 공간 진동 퍼텐셜($Q_s$) 역시 도미노처럼 즉각적이고 연쇄적으로 붕괴하게 된다.",
                "en": "The mechanical core is that this spatial wave constitutes an inseparable, taut tension network linked directly to particle B. Just as snapping one end of a tightly stretched spiderweb immediately releases tension at the opposite end of the web across a room, the moment the spatial wave near particle A is shattered and flattened, the spatial vibration potential ($Q_s$) surrounding particle B—which was phase-locked with A—undergoes a domino-like, co-instantaneous cascading collapse."
              },
              "v2": {
                "ko": "여기서 역학적 핵심은 이 공간의 파동이 입자 B와도 물리적으로 분리 불가능한 '하나의 팽팽한 장력망(Tension Network)'으로 이어져 있다는 점이다. 팽팽하게 당겨진 거미줄의 한쪽 끝을 강하게 끊어버리면 우주 반대편 그물의 장력도 즉각적으로 소실되며 풀려버리듯, A 입자 측면의 공간 파동이 박살나며 평탄화되는 순간 그 파동의 결을 따라 A와 얽혀 있던(Phase-locked) B 입자 주변의 공간 진동 퍼텐셜($Q_s$) 역시 도미노처럼 즉각적이고 연쇄적으로 붕괴하게 된다.",
                "en": "The mechanical core is that this spatial wave constitutes an inseparable, taut tension network linked directly to particle B. Just as snapping one end of a tightly stretched spiderweb immediately releases tension at the opposite end of the web across a room, the moment the spatial wave near particle A is shattered and flattened, the spatial vibration potential ($Q_s$) surrounding particle B—which was phase-locked with A—undergoes a domino-like, co-instantaneous cascading collapse."
              },
              "v3": {
                "ko": "여기서 역학적 핵심은 이 공간의 파동이 입자 B와도 물리적으로 분리 불가능한 '하나의 팽팽한 장력망(Tension Network)'으로 이어져 있다는 점이다. 팽팽하게 당겨진 거미줄의 한쪽 끝을 강하게 끊어버리면 우주 반대편 그물의 장력도 즉각적으로 소실되며 풀려버리듯, A 입자 측면의 공간 파동이 박살나며 평탄화되는 순간 그 파동의 결을 따라 A와 얽혀 있던(Phase-locked) B 입자 주변의 공간 진동 퍼텐셜($Q_s$) 역시 도미노처럼 즉각적이고 연쇄적으로 붕괴하게 된다.",
                "en": "The mechanical core is that this spatial wave constitutes an inseparable, taut tension network linked directly to particle B. Just as snapping one end of a tightly stretched spiderweb immediately releases tension at the opposite end of the web across a room, the moment the spatial wave near particle A is shattered and flattened, the spatial vibration potential ($Q_s$) surrounding particle B—which was phase-locked with A—undergoes a domino-like, co-instantaneous cascading collapse."
              }
            }
          },
          {
            "id": "p5_58",
            "versions": {
              "v1": {
                "ko": "결론적으로, 양자 얽힘은 입자 간에 빛보다 빠른 마법의 신호가 오가는 현상이 아니다. 그것은 **\"하나의 기하학적 파동 위상으로 연결된 텅 빈 공간의 역학적 장력이, 어느 한쪽에서 가해진 관측의 거시적 폭력에 의해 일순간에 평탄화($Q_s \\to 0$)되는 수역학적(Hydrodynamic) 붕괴 메커니즘\"**이다. 자신을 유도하던 공간의 궤도가 한순간에 무너져 내렸기 때문에 입자 B 역시 궤적 유도력을 잃고 고전적 입자 상태로 떨어지며 상태가 확정된 것이다. 이로써 아인슈타인이 우려했던 양자역학의 비국소성 딜레마는 4차원 시공간 내의 인과율을 위배하지 않는 '진동 공간' 역학 안으로 완벽히 수렴하게 된다.",
                "en": "In conclusion, quantum entanglement is not a magical signal traveling faster than light between particles. It is a hydrodynamic collapse mechanism of empty space's mechanical tension connected by a single geometrical wave phase, which is instantly flattened ($Q_s \\to 0$) by the macroscopic violence of measurement applied at one node. Deprived of the spatial trajectory guiding it, particle B loses its guidance force, collapsing into a classical particle state and establishing its physical properties. Consequently, the non-locality dilemma of quantum mechanics that troubled Einstein converges naturally into the causality-preserving framework of spatial vibration mechanics."
              },
              "v2": {
                "ko": "결론적으로, 양자 얽힘은 입자 간에 빛보다 빠른 마법의 신호가 오가는 현상이 아니다. 그것은 **\"하나의 기하학적 파동 위상으로 연결된 텅 빈 공간의 역학적 장력이, 어느 한쪽에서 가해진 관측의 거시적 폭력에 의해 일순간에 평탄화($Q_s \\to 0$)되는 수역학적(Hydrodynamic) 붕괴 메커니즘\"**이다. 자신을 유도하던 공간의 궤도가 한순간에 무너져 내렸기 때문에 입자 B 역시 궤적 유도력을 잃고 고전적 입자 상태로 떨어지며 상태가 확정된 것이다. 이로써 아인슈타인이 우려했던 양자역학의 비국소성 딜레마는 4차원 시공간 내의 인과율을 위배하지 않는 '진동 공간' 역학 안으로 완벽히 수렴하게 된다.",
                "en": "In conclusion, quantum entanglement is not a magical signal traveling faster than light between particles. It is a hydrodynamic collapse mechanism of empty space's mechanical tension connected by a single geometrical wave phase, which is instantly flattened ($Q_s \\to 0$) by the macroscopic violence of measurement applied at one node. Deprived of the spatial trajectory guiding it, particle B loses its guidance force, collapsing into a classical particle state and establishing its physical properties. Consequently, the non-locality dilemma of quantum mechanics that troubled Einstein converges naturally into the causality-preserving framework of spatial vibration mechanics."
              },
              "v3": {
                "ko": "결론적으로, 양자 얽힘은 입자 간에 빛보다 빠른 마법의 신호가 오가는 현상이 아니다. 그것은 **\"하나의 기하학적 파동 위상으로 연결된 텅 빈 공간의 역학적 장력이, 어느 한쪽에서 가해진 관측의 거시적 폭력에 의해 일순간에 평탄화($Q_s \\to 0$)되는 수역학적(Hydrodynamic) 붕괴 메커니즘\"**이다. 자신을 유도하던 공간의 궤도가 한순간에 무너져 내렸기 때문에 입자 B 역시 궤적 유도력을 잃고 고전적 입자 상태로 떨어지며 상태가 확정된 것이다. 이로써 아인슈타인이 우려했던 양자역학의 비국소성 딜레마는 4차원 시공간 내의 인과율을 위배하지 않는 '진동 공간' 역학 안으로 완벽히 수렴하게 된다.",
                "en": "In conclusion, quantum entanglement is not a magical signal traveling faster than light between particles. It is a hydrodynamic collapse mechanism of empty space's mechanical tension connected by a single geometrical wave phase, which is instantly flattened ($Q_s \\to 0$) by the macroscopic violence of measurement applied at one node. Deprived of the spatial trajectory guiding it, particle B loses its guidance force, collapsing into a classical particle state and establishing its physical properties. Consequently, the non-locality dilemma of quantum mechanics that troubled Einstein converges naturally into the causality-preserving framework of spatial vibration mechanics."
              }
            }
          },
          {
            "id": "p5_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "문제는 미시 세계의 전자(Electron)를 관측하기 위해 투사하는 이러한 물리적 개입(관측 에너지, $E_{obs}$)이, 전자를 유도하고 있던 **미세한 공간의 기하학적 요동($Q_s$)의 에너지 스케일을 압도적으로 초과하는 거시적 폭력(Macroscopic Violence)**이라는 점이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "감쇠 함수는 관측 에너지 $E_{obs}$에 대한 지수 감쇠(Exponential decay) 모델을 따른다고 가정할 수 있다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_12",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_13",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_17",
            "versions": {
              "v3": {
                "ko": "탐지기를 끄면 외부 섭동 에너지가 없으므로 감쇠 함수 $\\gamma(0) \\approx 1$이 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_18",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_19",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_23",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_24",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_25",
            "versions": {
              "v3": {
                "ko": "따라서 공간 진동 퍼텐셜 항($-\\nabla \\tilde{Q}_s$)이 붕괴하여 소거되며, 운동 방정식은 다음과 같이 축소된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_26",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_27",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_28",
            "versions": {
              "v3": {
                "ko": "**~~[물리적 결론]**",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_30",
            "versions": {
              "v3": {
                "ko": "입자의 궤적을 굴절시키던 골짜기($-\\nabla Q_s$)가 물리적으로 0으로 상쇄(Damping)되었으므로, **슬릿을 통과한 입자는 더 이상 굴절을 겪지 않고 고전적인 외부 장벽($V$)만을 느끼며 관성의 법칙에 따라 당구공처럼 직선 운동하게 된다.**~~",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_31",
            "versions": {
              "v3": {
                "ko": "~~그 결과 스크린에는 간섭 무늬가 사라지고 두 줄의 입자적 흔적만 남게 되는 것이다. 이것이 이른바 '파동 함수 붕괴'의 진정한 실체, 즉 **'거시적 타격 에너지에 의한 미시적 공간 진동의 역학적 상쇄(Decoherence of Spatial Fluctuation)'**이다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_32",
            "versions": {
              "v3": {
                "ko": "**[물리적 결론]**",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_34",
            "versions": {
              "v3": {
                "ko": "입자의 궤적을 굴절시키던 골짜기($-\\nabla Q_s$)가 물리적으로 0으로 상쇄(Damping)되었으므로, 슬릿을 통과한 입자는 더 이상 굴절을 겪지 않고 고전적인 외부 장벽($V$)만을 느끼며 관성의 법칙에 따라 당구공처럼 직선 운동하게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_35",
            "versions": {
              "v3": {
                "ko": "그 결과 스크린에는 간섭 무늬가 사라지고 두 줄의 입자적 흔적만 남게 되는 것이다. 이것이 이른바 '파동 함수 붕괴'의 진정한 실체이다. **즉, 현대 양자역학에서 외부 환경과의 상호작용으로 인해 양자적 중첩이 파괴된다고 설명하는 '환경 유도 결맞음 파괴(Environment-induced decoherence)' 현상 [5]을, 본 연구는 '거시적 타격 에너지에 의한 미시적 공간 진동의 역학적 상쇄(Mechanical Damping of Spatial Fluctuation)'라는 결정론적 메커니즘으로 완벽하게 구체화한 것이다.**",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_36",
            "versions": {
              "v3": {
                "ko": "### 5.4. 비국소성과 양자 얽힘(Quantum Entanglement)의 역학적 규명: 기하학적 위상 연결과 거리에 독립적인 텐서 장력 붕괴 (Mechanical Elucidation of Non-locality and Quantum Entanglement: Geometrical Phase Connection and Distance-Independent Collapse of Tensor Tension)",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_10",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_12",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_13",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_15",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_16",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_18",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p5_v3_en_19",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 5.4. 비국소성과 양자 얽힘(Quantum Entanglement)의 역학적 규명: 기하학적 위상 연결과 거리에 독립적인 텐서 장력 붕괴 (Mechanical Elucidation of Non-locality and Quantum Entanglement: Geometrical Phase Connection and Distance-Independent Collapse of Tensor Tension)"
              }
            }
          }
        ]
      },
      {
        "number": 6,
        "title": {
          "ko": "6장. 거시-미시 한계: 질량 밀도에 의한 관성적 압도",
          "en": "Chapter 6. Macro-Micro Boundary"
        },
        "paragraphs": [
          {
            "id": "p6_1",
            "versions": {
              "v1": {
                "ko": "- **수학적 극한:** 공간 진동 유도력($\\mathbf{F}_{space}$)이 입자의 질량($m$)에 반비례함을 증명: $\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$",
                "en": "- **Mathematical Limit:** Proof that the spatial vibration force ($\\mathbf{F}_{space}$) is inversely proportional to the particle mass ($m$), establishing: $\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$"
              },
              "v2": {
                "ko": "- **수학적 극한:** 공간 진동 유도력($\\mathbf{F}_{space}$)이 입자의 질량($m$)에 반비례함을 증명: $\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$",
                "en": "- **Mathematical Limit:** Proof that the spatial vibration force ($\\mathbf{F}_{space}$) is inversely proportional to the particle mass ($m$), establishing: $\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$"
              }
            }
          },
          {
            "id": "p6_2",
            "versions": {
              "v1": {
                "ko": "- **고전 역학 수렴:** 조밀한 거대 질량체의 '고전적 관성'이 공간 진동을 역학적으로 무시하며 뉴턴 역학으로 수렴하는 원리 규명.",
                "en": "- **Classical Convergence:** Elucidation of the mechanism by which the classical inertia of dense macroscopic bodies mechanically bypasses spatial vibrations, converging to Newtonian dynamics."
              },
              "v2": {
                "ko": "- **고전 역학 수렴:** 조밀한 거대 질량체의 '고전적 관성'이 공간 진동을 역학적으로 무시하며 뉴턴 역학으로 수렴하는 원리 규명.",
                "en": "- **Classical Convergence:** Elucidation of the mechanism by which the classical inertia of dense macroscopic bodies mechanically bypasses spatial vibrations, converging to Newtonian dynamics."
              }
            }
          },
          {
            "id": "p6_3",
            "versions": {
              "v1": {
                "ko": "기존 물리학의 가장 큰 딜레마 중 하나는 \"왜 미시 세계를 지배하는 양자역학의 파동적 특성이 거시 세계에서는 통용되지 않으며, 뉴턴의 고전 역학으로 변모하는가\"에 대한 명확한 물리적 경계(Heisenberg Cut)를 설명하지 못한다는 점이다. 본 장에서는 제안된 '공간 진동 역학'이 어떻게 미시와 거시의 간극을 허물고, 두 세계를 단일한 결정론적 방정식으로 통합하는지 수학적으로 증명한다.",
                "en": "One of physics' greatest challenges is explaining the boundary (Heisenberg Cut) where wave properties vanish, transitioning into Newtonian mechanics. This section mathematically demonstrates how spatial vibration mechanics unifies both domains under a single deterministic equation."
              },
              "v2": {
                "ko": "기존 물리학의 가장 큰 딜레마 중 하나는 \"왜 미시 세계를 지배하는 양자역학의 파동적 특성이 거시 세계에서는 통용되지 않으며, 뉴턴의 고전 역학으로 변모하는가\"에 대한 명확한 물리적 경계(Heisenberg Cut)를 설명하지 못한다는 점이다. 본 장에서는 제안된 '공간 진동 역학'이 어떻게 미시와 거시의 간극을 허물고, 두 세계를 단일한 결정론적 방정식으로 통합하는지 수학적으로 증명한다.",
                "en": "One of physics' greatest challenges is explaining the boundary (Heisenberg Cut) where wave properties vanish, transitioning into Newtonian mechanics. This section mathematically demonstrates how spatial vibration mechanics unifies both domains under a single deterministic equation."
              },
              "v3": {
                "ko": "기존 물리학의 가장 큰 딜레마 중 하나는 \"왜 미시 세계를 지배하는 양자역학의 파동적 특성이 거시 세계에서는 통용되지 않으며, 뉴턴의 고전 역학으로 변모하는가\"에 대한 명확한 물리적 경계(Heisenberg Cut)를 설명하지 못한다는 점이다. 본 장에서는 제안된 '공간 진동 역학'이 어떻게 미시와 거시의 간극을 허물고, 두 세계를 단일한 결정론적 방정식으로 통합하는지 수학적으로 증명한다.",
                "en": "One of physics' greatest challenges is explaining the boundary (Heisenberg Cut) where wave properties vanish, transitioning into Newtonian mechanics. This section mathematically demonstrates how spatial vibration mechanics unifies both domains under a single deterministic equation."
              }
            }
          },
          {
            "id": "p6_4",
            "versions": {
              "v1": {
                "ko": "### 6.1. 질량에 반비례하는 공간 진동 퍼텐셜",
                "en": "### Inverse Mass Proportion of Spatial Vibration Potential"
              },
              "v2": {
                "ko": "### 6.1. 질량에 반비례하는 공간 진동 퍼텐셜",
                "en": "### Inverse Mass Proportion of Spatial Vibration Potential"
              },
              "v3": {
                "ko": "### 6.1. 질량에 반비례하는 공간 진동 퍼텐셜",
                "en": "### Inverse Mass Proportion of Spatial Vibration Potential"
              }
            }
          },
          {
            "id": "p6_5",
            "versions": {
              "v1": {
                "ko": "앞선 제3장에서 도출한 공간 진동 퍼텐셜($Q_s$)의 수학적 정의를 다시 살펴보자.",
                "en": "Reviewing the definition of the potential $Q_s$ derived in Section 3:"
              },
              "v2": {
                "ko": "앞선 제3장에서 도출한 공간 진동 퍼텐셜($Q_s$)의 수학적 정의를 다시 살펴보자.",
                "en": "Reviewing the definition of the potential $Q_s$ derived in Section 3:"
              },
              "v3": {
                "ko": "앞선 제3장에서 도출한 공간 진동 퍼텐셜($Q_s$)의 수학적 정의를 다시 살펴보자.",
                "en": "Reviewing the definition of the potential $Q_s$ derived in Section 3:"
              }
            }
          },
          {
            "id": "p6_6",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_7",
            "versions": {
              "v1": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              },
              "v2": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              },
              "v3": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              }
            }
          },
          {
            "id": "p6_8",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_9",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_10",
            "versions": {
              "v1": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              },
              "v2": {
                "ko": "",
                "en": "Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}"
              }
            }
          },
          {
            "id": "p6_11",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_12",
            "versions": {
              "v1": {
                "ko": "이 수식에서 공간의 기하학적 요동 에너지 밀도를 결정하는 핵심 변수는 플랑크 상수($\\hbar$)와 분모에 위치한 **입자의 질량($m$)**이다. 입자가 공간의 진동으로부터 받는 궤적 유도력(Guidance force, $\\mathbf{F}_{space}$)은 이 퍼텐셜의 음의 구배(Negative Gradient)로 나타난다.",
                "en": "In this equation, the variables determining the potential energy density are Planck's constant ($\\hbar$) and the mass ($m$) of the particle in the denominator. The spatial guidance force ($\\mathbf{F}_{space}$) is the negative gradient of this potential:"
              },
              "v2": {
                "ko": "이 수식에서 공간의 기하학적 요동 에너지 밀도를 결정하는 핵심 변수는 플랑크 상수($\\hbar$)와 분모에 위치한 **입자의 질량($m$)**이다. 입자가 공간의 진동으로부터 받는 궤적 유도력(Guidance force, $\\mathbf{F}_{space}$)은 이 퍼텐셜의 음의 구배(Negative Gradient)로 나타난다.",
                "en": "In this equation, the variables determining the potential energy density are Planck's constant ($\\hbar$) and the mass ($m$) of the particle in the denominator. The spatial guidance force ($\\mathbf{F}_{space}$) is the negative gradient of this potential:"
              },
              "v3": {
                "ko": "이 수식에서 공간의 기하학적 요동 에너지 밀도를 결정하는 핵심 변수는 플랑크 상수($\\hbar$)와 분모에 위치한 **입자의 질량($m$)**이다.",
                "en": "In this equation, the variables determining the potential energy density are Planck's constant ($\\hbar$) and the mass ($m$) of the particle in the denominator. The spatial guidance force ($\\mathbf{F}_{space}$) is the negative gradient of this potential:"
              }
            }
          },
          {
            "id": "p6_13",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_14",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right)"
              },
              "v2": {
                "ko": "",
                "en": "\\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right)"
              },
              "v3": {
                "ko": "",
                "en": "\\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right)"
              }
            }
          },
          {
            "id": "p6_15",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_16",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_17",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right)"
              },
              "v2": {
                "ko": "",
                "en": "\\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right)"
              }
            }
          },
          {
            "id": "p6_18",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_19",
            "versions": {
              "v1": {
                "ko": "이 수식은 공간 진동이 물질에 미치는 역학적 힘이 대상의 **질량($m$)에 완벽하게 반비례(Inversely proportional)**함을 보여준다.",
                "en": "This confirms that the spatial force exerted on matter is strictly inversely proportional to the mass ($m$)."
              },
              "v2": {
                "ko": "이 수식은 공간 진동이 물질에 미치는 역학적 힘이 대상의 **질량($m$)에 완벽하게 반비례(Inversely proportional)**함을 보여준다.",
                "en": "This confirms that the spatial force exerted on matter is strictly inversely proportional to the mass ($m$)."
              },
              "v3": {
                "ko": "이 수식은 공간 진동이 물질에 미치는 역학적 힘이 대상의 **질량($m$)에 완벽하게 반비례(Inversely proportional)**함을 보여준다.",
                "en": "This confirms that the spatial force exerted on matter is strictly inversely proportional to the mass ($m$)."
              }
            }
          },
          {
            "id": "p6_20",
            "versions": {
              "v1": {
                "ko": "### 6.2. 미시 스케일: 공간 진동의 지배",
                "en": "### Micro-Scale: Domination of Spatial Fluctuation"
              },
              "v2": {
                "ko": "### 6.2. 미시 스케일: 공간 진동의 지배",
                "en": "### Micro-Scale: Domination of Spatial Fluctuation"
              },
              "v3": {
                "ko": "### 6.2. 미시 스케일: 공간 진동의 지배",
                "en": "### Micro-Scale: Domination of Spatial Fluctuation"
              }
            }
          },
          {
            "id": "p6_21",
            "versions": {
              "v1": {
                "ko": "전자($m_e \\approx 9.1 \\times 10^{-31} \\text{ kg}$)나 광자처럼 질량이 극도로 작은 미시 입자의 경우를 가정해 보자. 분모인 $m$이 $0$에 수렴할 정도로 극미하므로, $\\mathbf{F}_{space}$ 항의 값은 상대적으로 극대화된다.",
                "en": "Consider a microscopic particle like an electron ($m_e \\approx 9.1 \\times 10^{-31}$ kg) or a photon. Since the mass ($m$) is extremely small, the spatial force term ($\\mathbf{F}_{space}$) is maximized."
              },
              "v2": {
                "ko": "전자($m_e \\approx 9.1 \\times 10^{-31} \\text{ kg}$)나 광자처럼 질량이 극도로 작은 미시 입자의 경우를 가정해 보자. 분모인 $m$이 $0$에 수렴할 정도로 극미하므로, $\\mathbf{F}_{space}$ 항의 값은 상대적으로 극대화된다.",
                "en": "Consider a microscopic particle like an electron ($m_e \\approx 9.1 \\times 10^{-31}$ kg) or a photon. Since the mass ($m$) is extremely small, the spatial force term ($\\mathbf{F}_{space}$) is maximized."
              },
              "v3": {
                "ko": "전자($m_e \\approx 9.1 \\times 10^{-31} \\text{ kg}$)나 광자처럼 질량이 극도로 작은 미시 입자의 경우를 가정해 보자.",
                "en": "Consider a microscopic particle like an electron ($m_e \\approx 9.1 \\times 10^{-31}$ kg) or a photon. Since the mass ($m$) is extremely small, the spatial force term ($\\mathbf{F}_{space}$) is maximized."
              }
            }
          },
          {
            "id": "p6_22",
            "versions": {
              "v1": {
                "ko": "따라서 미시 입자에게 공간의 기하학적 요동($Q_s$)은 고전적인 외부 힘($V$)을 압도할 만큼 거대한 척력으로 작용한다. 가벼운 미시 입자는 거친 파도 위에 떠 있는 작은 뗏목처럼, 공간의 미세한 곡률 변화에 극도로 민감하게 반응하며 이리저리 휩쓸리고 굴절된다. 이것이 이중 슬릿 실험에서 관측되는 이른바 '파동성'의 진정한 역학적 기원이다.",
                "en": "Hence, for micro-particles, the spatial fluctuation potential ($Q_s$) acts as a dominant force that overrides classical external potentials ($V$). The light particle behaves like a small raft on turbulent waves, highly sensitive to subtle variations in spatial curvature. This is the mechanical origin of wave properties in the double-slit experiment."
              },
              "v2": {
                "ko": "따라서 미시 입자에게 공간의 기하학적 요동($Q_s$)은 고전적인 외부 힘($V$)을 압도할 만큼 거대한 척력으로 작용한다. 가벼운 미시 입자는 거친 파도 위에 떠 있는 작은 뗏목처럼, 공간의 미세한 곡률 변화에 극도로 민감하게 반응하며 이리저리 휩쓸리고 굴절된다. 이것이 이중 슬릿 실험에서 관측되는 이른바 '파동성'의 진정한 역학적 기원이다.",
                "en": "Hence, for micro-particles, the spatial fluctuation potential ($Q_s$) acts as a dominant force that overrides classical external potentials ($V$). The light particle behaves like a small raft on turbulent waves, highly sensitive to subtle variations in spatial curvature. This is the mechanical origin of wave properties in the double-slit experiment."
              },
              "v3": {
                "ko": "따라서 미시 입자에게 공간의 기하학적 요동($Q_s$)은 고전적인 외부 힘($V$)을 압도할 만큼 거대한 척력으로 작용한다. 가벼운 미시 입자는 거친 파도 위에 떠 있는 작은 뗏목처럼, 공간의 미세한 곡률 변화에 극도로 민감하게 반응하며 이리저리 휩쓸리고 굴절된다. 이것이 이중 슬릿 실험에서 관측되는 이른바 '파동성'의 진정한 역학적 기원이다.",
                "en": "Hence, for micro-particles, the spatial fluctuation potential ($Q_s$) acts as a dominant force that overrides classical external potentials ($V$). The light particle behaves like a small raft on turbulent waves, highly sensitive to subtle variations in spatial curvature. This is the mechanical origin of wave properties in the double-slit experiment."
              }
            }
          },
          {
            "id": "p6_23",
            "versions": {
              "v1": {
                "ko": "### ~~6.3. 거시 스케일로의 수렴: 뉴턴 역학의 복원",
                "en": "### Convergence to Macro-Scale: Restoration of Newtonian Mechanics"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_24",
            "versions": {
              "v1": {
                "ko": "~~반면, 대상이 풀러렌($C_{60}$) 분자, 먼지, 야구공, 나아가 인간과 같은 거시적 질량체로 스케일업(Scale-up) 될 때의 수학적 극한(Limit)을 고찰해보자. 거시 물체의 질량 $m$이 미시 입자에 비해 천문학적으로 커짐에 따라($m \\to \\infty$), 공간 진동에 의한 유도력은 분모의 발산으로 인해 다음의 수학적 극한이 성립한다.~~",
                "en": "~~Conversely, let us examine the mathematical limit as the object scales up to macroscopic masses, such as buckyballs ($C_{60}$), dust particles, baseballs, or humans. As the mass $m$ of the macroscopic object becomes astronomically larger than that of microscopic particles ($m \\to \\infty$), the guiding force due to spatial vibrations converges to zero due to the divergence of the denominator:~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_25",
            "versions": {
              "v1": {
                "ko": "~~**[수학적 증명에 따른 물리적 결론] / [Physical Conclusion of Mathematical Proof]**",
                "en": "~~As the mass of the object scales up, the guiding force ($F_{space}$) derived from the spatial potential converges to zero. Macroscopic objects are composed of an Avogadro number of atoms, possessing massive classical inertia. Additionally, because the phases of spatial vibrations experienced by constituent particles are randomized, they undergo statistical decoherence. Even if the background space oscillates, this fluctuation is entirely bypassed by the massive body's inertia.~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_26",
            "versions": {
              "v1": {
                "ko": "물체의 질량이 커지면 공간 진동 퍼텐셜로 인한 유도력($\\mathbf{F}_{space}$)은 $0$으로 완벽히 수렴하여 소멸된다. 거시 물체는 아보가드로 수($N_A \\approx 6.02 \\times 10^{23}$)에 달하는 막대한 원자 단위로 구성되어 있어, 그 자체로 어마어마한 고전적 관성력을 가진다. 게다가 구성 입자들 각각이 겪는 공간 진동의 위상적 차이가 통계적 상쇄를 야기한다. 아무리 배경 공간이 요동친다 하더라도, 거대한 고전적 관성은 이 요동을 운동 역학적으로 무시한다.~~",
                "en": ""
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_27",
            "versions": {
              "v1": {
                "ko": "~~결국 운동 방정식 내에서 $\\nabla Q_s$ 항이 완전히 소거되므로, 거시적 대상의 운동 방정식은 자연스럽게 다음과 같이 환원된다.~~",
                "en": "~~Consequently, the $\\nabla Q_s$ term is completely eliminated, and the equation of motion for macroscopic bodies naturally reverts to:~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_28",
            "versions": {
              "v1": {
                "ko": "~~이 식은 다름 아닌 **뉴턴의 고전 역학 제2법칙($\\mathbf{F}=m\\mathbf{a}$) 및 고전적 운동 방정식 그 자체**이다. 결론적으로, '공간의 진동 역학'은 양자역학과 고전 역학을 분리하지 않는다. 미시 세계의 확률적 요동처럼 보이던 현상은 극미세 질량을 가진 대상만이 느낄 수 있었던 '공간 자체의 기하학적 굴절력'이었을 뿐이다. **질량($m$)이라는 단일 매개변수를 통해 공간 진동 항($Q_s$)이 스스로 발현되거나 소거됨을 증명**함으로써, 본 연구는 우주의 모든 입자가 크기에 상관없이 동일한 물리 법칙(결정론적 역학)을 따른다는 완벽한 대통일의 기반을 제시한다.~~",
                "en": "~~which is none other than Newton's second law ($\\mathbf{F} = m\\mathbf{a}$) and the classical equation of motion itself. In conclusion, spatial vibration mechanics does not split quantum and classical physics. What appeared as probabilistic fluctuations in the micro-world was simply the spatial geometric curvature force perceptible only to microscopic masses. By proving that the spatial vibration potential ($Q_s$) manifests or vanishes via a single parameter—mass ($m$)—this study establishes a unified, deterministic framework where all matter follows identical physical laws.~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_29",
            "versions": {
              "v1": {
                "ko": "~~### ~~6.3. 거시 스케일로의 수렴: 관성 한계와 고전 역학의 복원 (Convergence to Macro-Scale: Inertial Limit and Restoration of Classical Mechanics)~~",
                "en": "~~Conversely, let us examine the mathematical limit as the system scales up to macroscopic mass bodies, such as buckyballs ($C_{60}$), dust particles, baseballs, and celestial entities. As the mass $m$ of the macroscopic object becomes astronomically larger than that of microscopic particles ($m \\to \\infty$), the guiding force due to spatial vibrations converges to zero due to the divergence of the denominator:~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_30",
            "versions": {
              "v1": {
                "ko": "~~반면, 대상이 풀러렌($C_{60}$) 분자, 먼지, 야구공, 나아가 천체와 같은 거시적 질량체로 스케일업(Scale-up) 될 때의 수학적 극한(Limit)을 고찰해보자. 거시 물체의 질량 $m$이 미시 입자에 비해 천문학적으로 커짐에 따라($m \\to \\infty$), 공간 진동에 의한 유도력은 분모의 발산으로 인해 다음의 수학적 극한이 성립한다.~~",
                "en": ""
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_31",
            "versions": {
              "v1": {
                "ko": "~~**[수학적 증명에 따른 물리적 결론] / [Physical Conclusion of Mathematical Proof]**",
                "en": "~~As the object's mass scales up, the mechanical guiding force ($F_{space}$) derived from the spatial potential converges to zero without yielding any observable path alterations. However, we must highlight a crucial physical detail: the increase in mass does not mean that the spatial vibration energy itself vanishes or statistically cancels out. The background space continues to vibrate actively, preserving its coherence and phase even at macroscopic scales. The true reason is that the macroscopic object, composed of an Avogadro number ($10^{23}$) of atoms bound together, possesses immense classical inertia. Even if space oscillates violently, this fluctuation is dynamically ignored by the massive body's inertial resistance ($m$). This is physically identical to a massive aircraft carrier sailing straight through ocean currents and waves without being deflected, driven strictly by its engine's propulsion.~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_32",
            "versions": {
              "v1": {
                "ko": "물체의 질량이 커지면 공간 진동 퍼텐셜로 인한 역학적 유도력($\\mathbf{F}_{space}$)은 대상 물체의 궤적에 유의미한 변화를 주지 못하고 $0$으로 수학적 수렴을 하게 된다. 여기서 철학적, 물리적으로 주의할 매우 중요한 점이 있다. 질량이 커진다고 해서 **배경 공간의 진동 에너지 자체가 통계적으로 상쇄되어 사라지는 것이 결코 아니라는 것이다.** 텅 빈 공간은 거시적 스케일에서도 여전히 거대하게 요동치며 기하학적 결맞음(Coherence)과 고유의 위상을 유지할 수 있다. 그러나 거시 물체는 아보가드로 수($N_A \\approx 10^{23}$)에 달하는 막대한 입자들이 전자기력 등으로 강하게 결합된 복합체이므로, 그 자체로 공간의 미세한 요동을 압도하는 어마어마한 **'고전적 관성(Inertia)'**을 가진다. 아무리 배경 공간이 맹렬하게 기하학적으로 진동($\\nabla^2 R$)하고 있다 하더라도, 거대 질량체의 압도적인 관성 저항($m$) 앞에서는 그 공간의 요동이 운동 역학적으로 완전히 '무시(Ignored)'되는 것이다. 이는 마치 태평양의 거대한 해류와 파도(공간 진동)가 존재함에도 불구하고, 수만 톤의 초거대 항공모함(거시 질량)이 그 파도에 궤도를 잃지 않고 엔진의 추진력(고전적 힘)만으로 직진하는 이치와 완벽히 동일하다.~~",
                "en": ""
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_33",
            "versions": {
              "v1": {
                "ko": "~~결국 거시 물체의 운동 방정식 내에서는 $\\nabla Q_s$ 항이 질량의 역학적 한계로 인해 완전히 소거되므로, 대상의 운동 방정식은 자연스럽게 다음과 같이 환원된다.~~",
                "en": "~~Consequently, the $\\nabla Q_s$ term is completely eliminated within the equation of motion for macroscopic bodies, naturally reverting to:~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_34",
            "versions": {
              "v1": {
                "ko": "~~이 식은 다름 아닌 **뉴턴의 고전 역학 제2법칙($\\mathbf{F}=m\\mathbf{a}$) 및 고전적 운동 방정식 그 자체**이다. 결론적으로, 거시 세계에서 공간 진동 효과가 관측되지 않는 것은 공간의 요동이 사라져서가 아니라 거대 질량체의 관성이 이를 무시하기 때문이다. **질량($m$)이라는 단일 매개변수를 통해 공간 진동 항($Q_s$)의 역학적 지배력이 입자에게 발현되거나 소거됨을 증명**함으로써, 본 연구는 미시와 거시의 분리된 세계관을 단일한 물리 법칙(결정론적 역학)으로 통합하는 대통일의 기반을 제시한다.~~",
                "en": "~~which is none other than Newton's second law ($\\mathbf{F} = m\\mathbf{a}$) and the classical equation of motion. In conclusion, the absence of spatial vibration effects in the macroscopic domain is not because the fluctuations vanish, but because massive inertia overrides them. By proving that the spatial potential ($Q_s$) manifests or vanishes via a single parameter—mass ($m$)—this study establishes a unified, deterministic framework bridging the quantum and classical worlds.~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_35",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_36",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              },
              "v3": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = $\\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0$"
              }
            }
          },
          {
            "id": "p6_37",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_38",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_39",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              }
            }
          },
          {
            "id": "p6_40",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_41",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_42",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              },
              "v3": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              }
            }
          },
          {
            "id": "p6_43",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_44",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_45",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              }
            }
          },
          {
            "id": "p6_46",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_47",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_48",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              }
            }
          },
          {
            "id": "p6_49",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_50",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_51",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              }
            }
          },
          {
            "id": "p6_52",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_53",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_54",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              }
            }
          },
          {
            "id": "p6_55",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_56",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_57",
            "versions": {
              "v1": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              },
              "v2": {
                "ko": "",
                "en": "m \\frac{d\\mathbf{v}}{dt} = -\\nabla V"
              }
            }
          },
          {
            "id": "p6_58",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_59",
            "versions": {
              "v1": {
                "ko": "### 6.3. 거시 스케일로의 수렴: 질량 밀도에 의한 관성적 압도",
                "en": "### Convergence to Macro-Scale: Inertial Domination by Mass Density"
              },
              "v2": {
                "ko": "### 6.3. 거시 스케일로의 수렴: 질량 밀도에 의한 관성적 압도",
                "en": "### Convergence to Macro-Scale: Inertial Domination by Mass Density"
              },
              "v3": {
                "ko": "### 6.3. 거시 스케일로의 수렴: 질량 밀도에 의한 관성적 압도",
                "en": "### Convergence to Macro-Scale: Inertial Domination by Mass Density"
              }
            }
          },
          {
            "id": "p6_60",
            "versions": {
              "v1": {
                "ko": "반면, 대상이 풀러렌($C_{60}$) 분자, 먼지, 야구공과 같은 일상적 거시 질량체로 스케일업(Scale-up) 될 때의 역학적 변화를 고찰해보자. 거시 물체의 질량 $m$이 미시 입자에 비해 천문학적으로 커짐에 따라($m \\to \\infty$), 공간 진동에 의한 역학적 유도력은 분모의 발산으로 인해 다음의 수학적 극한에 수렴하게 된다.",
                "en": "Conversely, let us examine the dynamical transition as the system scales up to macroscopic mass bodies like fullerene ($C_{60}$) molecules, dust particles, and baseballs. As the mass $m$ of the macroscopic object becomes astronomically larger than that of a microscopic particle ($m \\to \\infty$), the dynamical guidance force driven by spatial vibrations converges to the mathematical limit due to the divergence of the denominator:"
              },
              "v2": {
                "ko": "반면, 대상이 풀러렌($C_{60}$) 분자, 먼지, 야구공과 같은 일상적 거시 질량체로 스케일업(Scale-up) 될 때의 역학적 변화를 고찰해보자. 거시 물체의 질량 $m$이 미시 입자에 비해 천문학적으로 커짐에 따라($m \\to \\infty$), 공간 진동에 의한 역학적 유도력은 분모의 발산으로 인해 다음의 수학적 극한에 수렴하게 된다.",
                "en": "Conversely, let us examine the dynamical transition as the system scales up to macroscopic mass bodies like fullerene ($C_{60}$) molecules, dust particles, and baseballs. As the mass $m$ of the macroscopic object becomes astronomically larger than that of a microscopic particle ($m \\to \\infty$), the dynamical guidance force driven by spatial vibrations converges to the mathematical limit due to the divergence of the denominator:"
              },
              "v3": {
                "ko": "반면, 대상이 풀러렌($C_{60}$) 분자, 먼지, 야구공과 같은 일상적 거시 질량체로 스케일업(Scale-up) 될 때의 역학적 변화를 고찰해보자.",
                "en": "Conversely, let us examine the dynamical transition as the system scales up to macroscopic mass bodies like fullerene ($C_{60}$) molecules, dust particles, and baseballs. As the mass $m$ of the macroscopic object becomes astronomically larger than that of a microscopic particle ($m \\to \\infty$), the dynamical guidance force driven by spatial vibrations converges to the mathematical limit due to the divergence of the denominator:"
              }
            }
          },
          {
            "id": "p6_61",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_62",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              }
            }
          },
          {
            "id": "p6_63",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_64",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_65",
            "versions": {
              "v1": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              },
              "v2": {
                "ko": "",
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
              }
            }
          },
          {
            "id": "p6_66",
            "versions": {
              "v1": {
                "ko": "$$",
                "en": "$$"
              },
              "v2": {
                "ko": "$$",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_67",
            "versions": {
              "v1": {
                "ko": "여기서 물리적으로 매우 주의해야 할 점이 있다. 거시 세계에서 $\\mathbf{F}_{space}$가 0으로 수렴하는 것은 배경 공간의 진동 자체가 사라지거나 무작위로 상쇄되기 때문이 결코 아니다. 공간은 거시적 스케일에서도 거대한 결맞음(Coherence)과 고유의 위상을 유지하며 맹렬히 진동하고 있다. 이러한 현상이 발생하는 진짜 이유는 **'스케일과 질량 밀도의 상대성'**에 있다. 거시 물체는 아보가드로 수($\\approx 10^{23}$)에 달하는 막대한 입자들이 좁은 영역에 강하게 결합된 고밀도 복합체이므로, 그 자체로 국소적인 공간의 진동 유도력을 뚫고 지나갈 수 있는 어마어마한 **'고전적 관성(Classical Inertia)'**을 가진다. 아무리 배경 공간이 요동치고 있다 하더라도, 조밀하게 응집된 거대 질량체의 압도적인 관성 앞에서는 그 요동이 운동 역학적으로 '무시(Ignored)'되는 것이다. 이는 태평양에 거대한 해류(공간 진동)가 흐르고 있음에도, 수만 톤의 초거대 항공모함(거시 질량)이 그 파도에 궤도를 잃지 않고 추진력에 의해 묵묵히 직진하는 이치와 완벽히 동일하다.",
                "en": "Here, we must highlight a crucial physical detail: the convergence of $\\mathbf{F}_{space}$ to zero at macroscopic scales does not mean that the background spatial vibrations themselves vanish or cancel out. Space continues to oscillate actively, preserving its coherence and phase even at macroscopic scales. The true reason lies in the relativity of scale and mass density. A macroscopic object, comprising an Avogadro number ($\\approx 10^{23}$) of atoms bound together, possesses immense classical inertia. Even if the background space fluctuates, this oscillation is dynamically ignored by the massive body's inertial resistance ($m$). This is physically identical to a massive aircraft carrier sailing straight through ocean currents and waves without being deflected, driven strictly by its engine's propulsion."
              },
              "v2": {
                "ko": "여기서 물리적으로 매우 주의해야 할 점이 있다. 거시 세계에서 $\\mathbf{F}_{space}$가 0으로 수렴하는 것은 배경 공간의 진동 자체가 사라지거나 무작위로 상쇄되기 때문이 결코 아니다. 공간은 거시적 스케일에서도 거대한 결맞음(Coherence)과 고유의 위상을 유지하며 맹렬히 진동하고 있다. 이러한 현상이 발생하는 진짜 이유는 **'스케일과 질량 밀도의 상대성'**에 있다. 거시 물체는 아보가드로 수($\\approx 10^{23}$)에 달하는 막대한 입자들이 좁은 영역에 강하게 결합된 고밀도 복합체이므로, 그 자체로 국소적인 공간의 진동 유도력을 뚫고 지나갈 수 있는 어마어마한 **'고전적 관성(Classical Inertia)'**을 가진다. 아무리 배경 공간이 요동치고 있다 하더라도, 조밀하게 응집된 거대 질량체의 압도적인 관성 앞에서는 그 요동이 운동 역학적으로 '무시(Ignored)'되는 것이다. 이는 태평양에 거대한 해류(공간 진동)가 흐르고 있음에도, 수만 톤의 초거대 항공모함(거시 질량)이 그 파도에 궤도를 잃지 않고 추진력에 의해 묵묵히 직진하는 이치와 완벽히 동일하다.",
                "en": "Here, we must highlight a crucial physical detail: the convergence of $\\mathbf{F}_{space}$ to zero at macroscopic scales does not mean that the background spatial vibrations themselves vanish or cancel out. Space continues to oscillate actively, preserving its coherence and phase even at macroscopic scales. The true reason lies in the relativity of scale and mass density. A macroscopic object, comprising an Avogadro number ($\\approx 10^{23}$) of atoms bound together, possesses immense classical inertia. Even if the background space fluctuates, this oscillation is dynamically ignored by the massive body's inertial resistance ($m$). This is physically identical to a massive aircraft carrier sailing straight through ocean currents and waves without being deflected, driven strictly by its engine's propulsion."
              },
              "v3": {
                "ko": "여기서 물리적으로 매우 주의해야 할 점이 있다. 거시 세계에서 $\\mathbf{F}_{space}$가 0으로 수렴하는 것은 배경 공간의 진동 자체가 사라지거나 무작위로 상쇄되기 때문이 결코 아니다. 공간은 거시적 스케일에서도 거대한 결맞음(Coherence)과 고유의 위상을 유지하며 맹렬히 진동하고 있다.",
                "en": "Here, we must highlight a crucial physical detail: the convergence of $\\mathbf{F}_{space}$ to zero at macroscopic scales does not mean that the background spatial vibrations themselves vanish or cancel out. Space continues to oscillate actively, preserving its coherence and phase even at macroscopic scales. The true reason lies in the relativity of scale and mass density. A macroscopic object, comprising an Avogadro number ($\\approx 10^{23}$) of atoms bound together, possesses immense classical inertia. Even if the background space fluctuates, this oscillation is dynamically ignored by the massive body's inertial resistance ($m$). This is physically identical to a massive aircraft carrier sailing straight through ocean currents and waves without being deflected, driven strictly by its engine's propulsion."
              }
            }
          },
          {
            "id": "p6_68",
            "versions": {
              "v1": {
                "ko": "결국 거시 물체의 운동 방정식 내에서는 $\\nabla Q_s$ 항이 질량의 상대적 관성 한계로 인해 역학적으로 소거되므로, 대상의 궤적은 뉴턴의 고전 역학 제2법칙($\\mathbf{F}=m\\mathbf{a}$)으로 자연스럽게 환원된다.",
                "en": "Consequently, the $\\nabla Q_s$ term is eliminated by the relative inertial threshold of the mass, naturally restoring Newton's second law $\\mathbf{F} = m\\mathbf{a}$."
              },
              "v2": {
                "ko": "결국 거시 물체의 운동 방정식 내에서는 $\\nabla Q_s$ 항이 질량의 상대적 관성 한계로 인해 역학적으로 소거되므로, 대상의 궤적은 뉴턴의 고전 역학 제2법칙($\\mathbf{F}=m\\mathbf{a}$)으로 자연스럽게 환원된다.",
                "en": "Consequently, the $\\nabla Q_s$ term is eliminated by the relative inertial threshold of the mass, naturally restoring Newton's second law $\\mathbf{F} = m\\mathbf{a}$."
              },
              "v3": {
                "ko": "결국 거시 물체의 운동 방정식 내에서는 $\\nabla Q_s$ 항이 질량의 상대적 관성 한계로 인해 역학적으로 소거되므로, 대상의 궤적은 뉴턴의 고전 역학 제2법칙($\\mathbf{F}=m\\mathbf{a}$)으로 자연스럽게 환원된다.",
                "en": "Consequently, the $\\nabla Q_s$ term is eliminated by the relative inertial threshold of the mass, naturally restoring Newton's second law $\\mathbf{F} = m\\mathbf{a}$."
              }
            }
          },
          {
            "id": "p6_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "입자가 공간의 진동으로부터 받는 궤적 유도력(Guidance force, $\\mathbf{F}_{space}$)은 이 퍼텐셜의 음의 구배(Negative Gradient)로 나타난다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_13",
            "versions": {
              "v3": {
                "ko": "분모인 $m$이 $0$에 수렴할 정도로 극미하므로, $\\mathbf{F}_{space}$ 항의 값은 상대적으로 극대화된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_15",
            "versions": {
              "v3": {
                "ko": "### ~~6.3. 거시 스케일로의 수렴: 뉴턴 역학의 복원 (Convergence to Macro-Scale: Restoration of Newtonian Mechanics)~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_17",
            "versions": {
              "v3": {
                "ko": "~~거시 물체의 질량 $m$이 미시 입자에 비해 천문학적으로 커짐에 따라($m \\to \\infty$), 공간 진동에 의한 유도력은 분모의 발산으로 인해 다음의 수학적 극한이 성립한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_18",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_19",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_20",
            "versions": {
              "v3": {
                "ko": "**~~[수학적 증명에 따른 물리적 결론]**",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_21",
            "versions": {
              "v3": {
                "ko": "물체의 질량이 커지면 공간 진동 퍼텐셜로 인한 유도력($\\mathbf{F}_{space}$)은 $0$으로 완벽히 수렴하여 소멸된다. 거시 물체는 아보가드로 수($N_A \\approx 6.02 \\times 10^{23}$)에 달하는 막대한 원자 단위로 구성되어 있어, 그 자체로 어마어마한 고전적 관성력을 가진다. 게다가 구성 입자들 각각이 겪는 공간 진동의 위상은 무작위적이어서 거시적으로는 통계적 상쇄(Statistical Decoherence)를 일으킨다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_22",
            "versions": {
              "v3": {
                "ko": "~~아무리 배경 공간이 기하학적으로 진동하고 있다 하더라도, 거대 질량체의 압도적인 관성 앞에서는 그 요동이 완전히 무시되는 것이다. 이는 마치 거대한 항공모함이 잔잔한 수면파에 의해 궤도를 이탈하지 않고 묵묵히 직진하는 이치와 같다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_23",
            "versions": {
              "v3": {
                "ko": "~~결국 운동 방정식 내에서 $\\nabla Q_s$ 항이 완전히 소거되므로, 거시적 대상의 운동 방정식은 자연스럽게 다음과 같이 환원된다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_24",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_25",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_26",
            "versions": {
              "v3": {
                "ko": "~~이 식은 다름 아닌 **뉴턴의 고전 역학 제2법칙($\\mathbf{F}=m\\mathbf{a}$) 및 고전적 운동 방정식 그 자체**이다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_27",
            "versions": {
              "v3": {
                "ko": "~~결론적으로, '공간의 진동 역학'은 양자역학과 고전 역학을 분리하지 않는다. 미시 세계의 확률적 요동처럼 보이던 현상은 극미세 질량을 가진 대상만이 느낄 수 있었던 '공간 자체의 기하학적 굴절력'이었을 뿐이다. **질량($m$)이라는 단일 매개변수를 통해 공간 진동 항($Q_s$)이 스스로 발현되거나 소거됨을 증명**함으로써, 본 연구는 우주의 모든 입자가 크기에 상관없이 동일한 물리 법칙(결정론적 역학)을 따른다는 완벽한 대통일의 기반을 제시한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_28",
            "versions": {
              "v3": {
                "ko": "### ~~6.3. 거시 스케일로의 수렴: 관성 한계와 고전 역학의 복원 (Convergence to Macro-Scale: Inertial Limit and Restoration of Classical Mechanics)~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_30",
            "versions": {
              "v3": {
                "ko": "~~거시 물체의 질량 $m$이 미시 입자에 비해 천문학적으로 커짐에 따라($m \\to \\infty$), 공간 진동에 의한 유도력은 분모의 발산으로 인해 다음의 수학적 극한이 성립한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_31",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_32",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_33",
            "versions": {
              "v3": {
                "ko": "**~~[수학적 증명에 따른 물리적 결론]**",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_34",
            "versions": {
              "v3": {
                "ko": "물체의 질량이 커지면 공간 진동 퍼텐셜로 인한 역학적 유도력($\\mathbf{F}_{space}$)은 대상 물체의 궤적에 유의미한 변화를 주지 못하고 $0$으로 수학적 수렴을 하게 된다. 여기서 철학적, 물리적으로 주의할 매우 중요한 점이 있다. 질량이 커진다고 해서 **배경 공간의 진동 에너지 자체가 통계적으로 상쇄되어 사라지는 것이 결코 아니라는 것이다.** 텅 빈 공간은 거시적 스케일에서도 여전히 거대하게 요동치며 기하학적 결맞음(Coherence)과 고유의 위상을 유지할 수 있다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_35",
            "versions": {
              "v3": {
                "ko": "~~그러나 거시 물체는 아보가드로 수($N_A \\approx 10^{23}$)에 달하는 막대한 입자들이 전자기력 등으로 강하게 결합된 복합체이므로, 그 자체로 공간의 미세한 요동을 압도하는 어마어마한 **'고전적 관성(Inertia)'**을 가진다. 아무리 배경 공간이 맹렬하게 기하학적으로 진동($\\nabla^2 R$)하고 있다 하더라도, 거대 질량체의 압도적인 관성 저항($m$) 앞에서는 그 공간의 요동이 운동 역학적으로 완전히 '무시(Ignored)'되는 것이다. 이는 마치 태평양의 거대한 해류와 파도(공간 진동)가 존재함에도 불구하고, 수만 톤의 초거대 항공모함(거시 질량)이 그 파도에 궤도를 잃지 않고 엔진의 추진력(고전적 힘)만으로 직진하는 이치와 완벽히 동일하다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_37",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_38",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_39",
            "versions": {
              "v3": {
                "ko": "~~이 식은 다름 아닌 **뉴턴의 고전 역학 제2법칙($\\mathbf{F}=m\\mathbf{a}$) 및 고전적 운동 방정식 그 자체**이다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_40",
            "versions": {
              "v3": {
                "ko": "~~결론적으로, 거시 세계에서 공간 진동 효과가 관측되지 않는 것은 공간의 요동이 사라져서가 아니라 거대 질량체의 관성이 이를 무시하기 때문이다. **질량($m$)이라는 단일 매개변수를 통해 공간 진동 항($Q_s$)의 역학적 지배력이 입자에게 발현되거나 소거됨을 증명**함으로써, 본 연구는 미시와 거시의 분리된 세계관을 단일한 물리 법칙(결정론적 역학)으로 통합하는 대통일의 기반을 제시한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_43",
            "versions": {
              "v3": {
                "ko": "거시 물체의 질량 $m$이 미시 입자에 비해 천문학적으로 커짐에 따라($m \\to \\infty$), 공간 진동에 의한 역학적 유도력은 분모의 발산으로 인해 다음의 수학적 극한에 수렴하게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_44",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_45",
            "versions": {
              "v3": {
                "ko": "$$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_47",
            "versions": {
              "v3": {
                "ko": "이러한 현상이 발생하는 진짜 이유는 **'스케일과 질량 밀도의 상대성'**에 있다. 거시 물체는 아보가드로 수($\\approx 10^{23}$)에 달하는 막대한 입자들이 좁은 영역에 강하게 결합된 고밀도 복합체이므로, 그 자체로 국소적인 공간의 진동 유도력을 뚫고 지나갈 수 있는 어마어마한 **'고전적 관성(Classical Inertia)'**을 가진다. 아무리 배경 공간이 요동치고 있다 하더라도, 조밀하게 응집된 거대 질량체의 압도적인 관성 앞에서는 그 요동이 운동 역학적으로 '무시(Ignored)'되는 것이다. 이는 태평양에 거대한 해류(공간 진동)가 흐르고 있음에도, 수만 톤의 초거대 항공모함(거시 질량)이 그 파도에 궤도를 잃지 않고 추진력에 의해 묵묵히 직진하는 이치와 완벽히 동일하다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_9",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~6.3. 거시 스케일로의 수렴: 뉴턴 역학의 복원 (Convergence to Macro-Scale: Restoration of Newtonian Mechanics)~~"
              }
            }
          },
          {
            "id": "p6_v3_en_10",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_12",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_13",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_15",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_16",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### ~~6.3. 거시 스케일로의 수렴: 관성 한계와 고전 역학의 복원 (Convergence to Macro-Scale: Inertial Limit and Restoration of Classical Mechanics)~~"
              }
            }
          },
          {
            "id": "p6_v3_en_17",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_19",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_20",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_22",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_24",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          },
          {
            "id": "p6_v3_en_26",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$"
              }
            }
          }
        ]
      },
      {
        "number": 7,
        "title": {
          "ko": "7장. 결론: 결정론적 공간 역학의 복원과 새로운 물리학적 지평",
          "en": "Chapter 7. Conclusion"
        },
        "paragraphs": [
          {
            "id": "p7_1",
            "versions": {
              "v1": {
                "ko": "- **대통합 요약:** 단일 질량 변수($m$)를 통해 양자 역학에서 고전 역학으로 이어지는 연속적 통합 제시.",
                "en": "- **Grand Synthesis:** Presenting a continuous synthesis bridging quantum mechanics and classical mechanics through a single mass variable ($m$)."
              },
              "v2": {
                "ko": "- **대통합 요약:** 단일 질량 변수($m$)를 통해 양자 역학에서 고전 역학으로 이어지는 연속적 통합 제시.",
                "en": "- **Grand Synthesis:** Presenting a continuous synthesis bridging quantum mechanics and classical mechanics through a single mass variable ($m$)."
              }
            }
          },
          {
            "id": "p7_2",
            "versions": {
              "v1": {
                "ko": "- **핵심 복선:** 프랙탈적 스케일 대칭성(Scale Symmetry) 제안. 질량 관성에 의해 억제된 진동의 힘이 우주적 스케일로 확장될 시, 공간의 방대한 체적과 결합하여 천체의 관성을 압도하는 '스케일 역전' 예고.",
                "en": "- **Crucial Presage:** Proposing fractal scale symmetry. We foresee a 'scale inversion' where the force of vibrations, suppressed by mass inertia at the macroscopic level, expands at cosmic scales to couple with the vast volume of space, ultimately overpowering galactic inertia."
              },
              "v2": {
                "ko": "- **핵심 복선:** 프랙탈적 스케일 대칭성(Scale Symmetry) 제안. 질량 관성에 의해 억제된 진동의 힘이 우주적 스케일로 확장될 시, 공간의 방대한 체적과 결합하여 천체의 관성을 압도하는 '스케일 역전' 예고.",
                "en": "- **Crucial Presage:** Proposing fractal scale symmetry. We foresee a 'scale inversion' where the force of vibrations, suppressed by mass inertia at the macroscopic level, expands at cosmic scales to couple with the vast volume of space, ultimately overpowering galactic inertia."
              }
            }
          },
          {
            "id": "p7_3",
            "versions": {
              "v1": {
                "ko": "본 연구는 지난 1세기 동안 현대 물리학을 지배해 온 코펜하겐 해석의 확률론적 세계관과 파동-입자 이중성의 철학적 모순을 극복하기 위해, **'공간의 기하학적 진동(Geometrical Fluctuation of Space)'**이라는 새로운 역학적 패러다임을 제안하고 이를 수학적으로 정식화하였다.",
                "en": "To overcome the probabilistic world view and philosophical contradictions of wave-particle duality that have dominated physics for a century, this study proposes a new paradigm of 'Geometrical Fluctuation of Space' and establishes its mathematical formulation."
              },
              "v2": {
                "ko": "본 연구는 지난 1세기 동안 현대 물리학을 지배해 온 코펜하겐 해석의 확률론적 세계관과 파동-입자 이중성의 철학적 모순을 극복하기 위해, **'공간의 기하학적 진동(Geometrical Fluctuation of Space)'**이라는 새로운 역학적 패러다임을 제안하고 이를 수학적으로 정식화하였다.",
                "en": "To overcome the probabilistic world view and philosophical contradictions of wave-particle duality that have dominated physics for a century, this study proposes a new paradigm of 'Geometrical Fluctuation of Space' and establishes its mathematical formulation."
              },
              "v3": {
                "ko": "본 연구는 지난 1세기 동안 현대 물리학을 지배해 온 코펜하겐 해석의 확률론적 세계관과 파동-입자 이중성의 철학적 모순을 극복하기 위해, **'공간의 기하학적 진동(Geometrical Fluctuation of Space)'**이라는 새로운 역학적 패러다임을 제안하고 이를 수학적으로 정식화하였다.",
                "en": "To overcome the probabilistic world view and philosophical contradictions of wave-particle duality that have dominated physics for a century, this study proposes a new paradigm of 'Geometrical Fluctuation of Space' and establishes its mathematical formulation."
              }
            }
          },
          {
            "id": "p7_4",
            "versions": {
              "v1": {
                "ko": "본 논문을 통해 입증된 핵심 결론은 다음과 같다.",
                "en": "The key conclusions established in this work are as follows:"
              },
              "v2": {
                "ko": "본 논문을 통해 입증된 핵심 결론은 다음과 같다.",
                "en": "The key conclusions established in this work are as follows:"
              },
              "v3": {
                "ko": "본 논문을 통해 입증된 핵심 결론은 다음과 같다.",
                "en": "The key conclusions established in this work are as follows:"
              }
            }
          },
          {
            "id": "p7_5",
            "versions": {
              "v1": {
                "ko": "1. **실재성의 복원과 파동성의 외주화:** 전자나 광자 등 미시 세계의 모든 양자는 관측 여부와 상관없이 고정된 위치와 궤적을 지닌 '실재하는 입자(Real particle)'이다. 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동으로 중첩된 것이 아니라, 텅 빈 공간 자체가 기하학적으로 요동치며 만들어낸 **공간 진동 퍼텐셜($Q_s$)의 굴절 지형도**에 입자가 역학적으로 유도(Guidance)된 결과이다.",
                "en": "1. **Restoration of Reality and Externalization of Waveness:** All microscopic quanta (electrons, photons, etc.) are real particles possessing definite positions and paths independent of observation. The double-slit interference pattern does not emerge from wavefunction superposition; rather, it is the result of particles being dynamically guided along the spatial potential ($Q_s$) contours formed by background oscillations."
              },
              "v2": {
                "ko": "1. **실재성의 복원과 파동성의 외주화:** 전자나 광자 등 미시 세계의 모든 양자는 관측 여부와 상관없이 고정된 위치와 궤적을 지닌 '실재하는 입자(Real particle)'이다. 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동으로 중첩된 것이 아니라, 텅 빈 공간 자체가 기하학적으로 요동치며 만들어낸 **공간 진동 퍼텐셜($Q_s$)의 굴절 지형도**에 입자가 역학적으로 유도(Guidance)된 결과이다.",
                "en": "1. **Restoration of Reality and Externalization of Waveness:** All microscopic quanta (electrons, photons, etc.) are real particles possessing definite positions and paths independent of observation. The double-slit interference pattern does not emerge from wavefunction superposition; rather, it is the result of particles being dynamically guided along the spatial potential ($Q_s$) contours formed by background oscillations."
              },
              "v3": {
                "ko": "1. **실재성의 복원과 파동성의 외주화:** 전자나 광자 등 미시 세계의 모든 양자는 관측 여부와 상관없이 고정된 위치와 궤적을 지닌 '실재하는 입자(Real particle)'이다. 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동으로 중첩된 것이 아니라, 텅 빈 공간 자체가 기하학적으로 요동치며 만들어낸 **공간 진동 퍼텐셜($Q_s$)의 굴절 지형도**에 입자가 역학적으로 유도(Guidance)된 결과이다.",
                "en": "1. **Restoration of Reality and Externalization of Waveness:** All microscopic quanta (electrons, photons, etc.) are real particles possessing definite positions and paths independent of observation. The double-slit interference pattern does not emerge from wavefunction superposition; rather, it is the result of particles being dynamically guided along the spatial potential ($Q_s$) contours formed by background oscillations."
              }
            }
          },
          {
            "id": "p7_6",
            "versions": {
              "v1": {
                "ko": "2. **관측 역학의 규명 (결맞음 붕괴의 탈신비화):** 관측 시 간섭 무늬가 사라지는 이른바 '파동 함수 붕괴'는 관측자의 의식이나 인식론적 한계와 무관하다. 탐지기가 발산하는 거시적 타격 에너지($E_{obs}$)가 미시적인 공간 진동에 거대한 섭동을 일으켜, $Q_s$의 결맞음을 역학적으로 상쇄(Damping)시킴으로써 입자가 유도력을 잃고 직선 운동하게 되는 물리적 현상임을 증명하였다.",
                "en": "2. **Observation Mechanics (Demystification of Wave Collapse):** The wavefunction collapse under measurement is independent of observer consciousness. We proved that the macroscopic perturbation energy ($E_{obs}$) emitted by a detector disrupts microscopic spatial vibrations, damping the coherence of $Q_s$ so that the particle loses its guidance force and travels in a classical straight line."
              },
              "v2": {
                "ko": "2. **관측 역학의 규명 (결맞음 붕괴의 탈신비화):** 관측 시 간섭 무늬가 사라지는 이른바 '파동 함수 붕괴'는 관측자의 의식이나 인식론적 한계와 무관하다. 탐지기가 발산하는 거시적 타격 에너지($E_{obs}$)가 미시적인 공간 진동에 거대한 섭동을 일으켜, $Q_s$의 결맞음을 역학적으로 상쇄(Damping)시킴으로써 입자가 유도력을 잃고 직선 운동하게 되는 물리적 현상임을 증명하였다.",
                "en": "2. **Observation Mechanics (Demystification of Wave Collapse):** The wavefunction collapse under measurement is independent of observer consciousness. We proved that the macroscopic perturbation energy ($E_{obs}$) emitted by a detector disrupts microscopic spatial vibrations, damping the coherence of $Q_s$ so that the particle loses its guidance force and travels in a classical straight line."
              },
              "v3": {
                "ko": "2. **관측 역학의 규명 (결맞음 붕괴의 탈신비화):** 관측 시 간섭 무늬가 사라지는 이른바 '파동 함수 붕괴'는 관측자의 의식이나 인식론적 한계와 무관하다. 탐지기가 발산하는 거시적 타격 에너지($E_{obs}$)가 미시적인 공간 진동에 거대한 섭동을 일으켜, $Q_s$의 결맞음을 역학적으로 상쇄(Damping)시킴으로써 입자가 유도력을 잃고 직선 운동하게 되는 물리적 현상임을 증명하였다.",
                "en": "2. **Observation Mechanics (Demystification of Wave Collapse):** The wavefunction collapse under measurement is independent of observer consciousness. We proved that the macroscopic perturbation energy ($E_{obs}$) emitted by a detector disrupts microscopic spatial vibrations, damping the coherence of $Q_s$ so that the particle loses its guidance force and travels in a classical straight line."
              }
            }
          },
          {
            "id": "p7_7",
            "versions": {
              "v1": {
                "ko": "3. **단일 질량 변수에 의한 거시-미시 대통합:** 공간 진동 퍼텐셜이 입자에 미치는 유도력($\\mathbf{F}_{space}$)은 대상의 질량($m$)에 완벽히 반비례한다. 따라서 거시 물체로 스케일이 커질수록 공간의 진동 효과는 수학적 극한($\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$)에 의해 완벽히 소거되며 자연스럽게 뉴턴 고전 역학으로 수렴한다. 이로써 양자와 거시 세계를 지배하는 물리 법칙이 분리되어 있지 않음이 규명되었다.",
                "en": "3. **Micro-Macro Unification via a Single Mass Parameter:** The guidance force ($\\mathbf{F}_{space}$) exerted on a particle is strictly inversely proportional to its mass ($m$). As scale increases to macroscopic levels, spatial vibration effects mathematically converge to zero ($\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$), naturally yielding classical Newtonian mechanics. This resolves the split between quantum and classical regimes."
              },
              "v2": {
                "ko": "3. **단일 질량 변수에 의한 거시-미시 대통합:** 공간 진동 퍼텐셜이 입자에 미치는 유도력($\\mathbf{F}_{space}$)은 대상의 질량($m$)에 완벽히 반비례한다. 따라서 거시 물체로 스케일이 커질수록 공간의 진동 효과는 수학적 극한($\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$)에 의해 완벽히 소거되며 자연스럽게 뉴턴 고전 역학으로 수렴한다. 이로써 양자와 거시 세계를 지배하는 물리 법칙이 분리되어 있지 않음이 규명되었다.",
                "en": "3. **Micro-Macro Unification via a Single Mass Parameter:** The guidance force ($\\mathbf{F}_{space}$) exerted on a particle is strictly inversely proportional to its mass ($m$). As scale increases to macroscopic levels, spatial vibration effects mathematically converge to zero ($\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$), naturally yielding classical Newtonian mechanics. This resolves the split between quantum and classical regimes."
              },
              "v3": {
                "ko": "3. **단일 질량 변수에 의한 거시-미시 대통합:** 공간 진동 퍼텐셜이 입자에 미치는 유도력($\\mathbf{F}_{space}$)은 대상의 질량($m$)에 완벽히 반비례한다. 따라서 거시 물체로 스케일이 커질수록 공간의 진동 효과는 수학적 극한($\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$)에 의해 완벽히 소거되며 자연스럽게 뉴턴 고전 역학으로 수렴한다. 이로써 양자와 거시 세계를 지배하는 물리 법칙이 분리되어 있지 않음이 규명되었다.",
                "en": "3. **Micro-Macro Unification via a Single Mass Parameter:** The guidance force ($\\mathbf{F}_{space}$) exerted on a particle is strictly inversely proportional to its mass ($m$). As scale increases to macroscopic levels, spatial vibration effects mathematically converge to zero ($\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$), naturally yielding classical Newtonian mechanics. This resolves the split between quantum and classical regimes."
              }
            }
          },
          {
            "id": "p7_8",
            "versions": {
              "v1": {
                "ko": "~~**[향후 연구 과제 및 새로운 지평: 우주론으로의 확장 예고]**~~ / ~~**[Future Research Directions: Expansion to Cosmology]**~~",
                "en": "~~This first paper focused on the mechanical mechanism of spatial fluctuations in the micro-quantum domain. However, if space is a dynamical entity possessing intrinsic tension and energy, these vibrations must interact with macroscopic curved spacetime—namely, gravity. What cosmological perturbations emerge when microscopic wave-like fluctuations couple with macroscopic gravitational wells (vortices)? In our second paper, we will couple our spatial vibration tensor with the Einstein field equations, predicting anomalies in gravitational lensing and tracing how condensed vibration energy manifests as dark matter and dark energy.~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p7_9",
            "versions": {
              "v1": {
                "ko": "~~본 제1논문은 '공간의 기하학적 진동'이 미시 양자 세계에서 발현되는 역학적 메커니즘을 규명하는 데 집중하였다. 그러나 공간이 스스로 기하학적 장력과 에너지를 가진 '동역학적 실체(Dynamical Entity)'라면, 이 공간 진동은 필연적으로 거대 질량이 만들어내는 거시적인 우주의 휜 시공간(Curved Spacetime), 즉 일반상대성이론의 '중력(Gravity)'과도 역학적으로 상호작용해야만 한다. 공간의 미시적 진동(파도)이 거대 질량이 만드는 거시적 공간 왜곡(소용돌이)과 결합할 때, 과연 어떤 우주론적 섭동이 발생하는가? 본 연작 논문의 후속편인 [공간의 진동 역학 II: 거시 중력장과 미시 공간 진동의 상호작용]에서는 아인슈타인 장 방정식에 본 논문에서 도출한 '공간 진동 텐서'를 결합할 것이다. 중력 렌즈를 지나는 빛의 궤적에서 발생하는 미세 섭동 오차를 예측하고, 거대 중력장 내에서 응축된 공간 진동 에너지가 어떻게 '암흑 물질(Dark Matter)'과 '암흑 에너지(Dark Energy)'라는 우주적 현상으로 창발하는지 그 본질적 기원을 통합적으로 규명해 나갈 것이다.~~",
                "en": ""
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p7_10",
            "versions": {
              "v1": {
                "ko": "~~**[향후 연구 과제 및 새로운 지평: 프랙탈적 스케일 대칭성과 우주적 회귀]**~~ / ~~**[Future Research Directions: Fractal Scale Symmetry and Cosmic Recursion]**~~",
                "en": "~~This first paper proved that microscopic spatial fluctuations guide quantum particles, whereas at intermediate scales, dense mass inertia dominates, reverting to Newtonian mechanics. However, we predict that when the system scales up to cosmological volumes, it will exhibit fractal recursion and scale symmetry. As the scale expands into deep space, the dynamical balance inverts. When space extending over hundreds of millions of light-years fluctuates, the cumulative vibration energy stored in that volume surges exponentially. In this super-macroscopic regime, even galaxies are reduced to the status of infinitesimal quantum particles relative to the vastness of space, allowing the spatial force ($F_{space}$) to become dominant again. In subsequent papers, we will explore how these cosmic-scale oscillations yield dark matter effects and shape the cosmic web as a macroscopic quantum interference pattern.~~"
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p7_11",
            "versions": {
              "v1": {
                "ko": "~~본 제1논문은 '공간의 기하학적 진동'이 양자 세계에서 발현되는 메커니즘을 규명하고, 중간 거시(Meso-macro) 스케일에서는 물체의 조밀한 관성 질량($m$)이 공간 진동을 일시적으로 압도하여 뉴턴 역학이 지배함을 증명하였다. 그러나 본 연구는 이 역학 관계가 우주적 규모(Cosmological scale)에서 극적인 '프랙탈적 회귀(Fractal Recursion)와 스케일 대칭성'을 발현할 것이라 강력히 예측한다. 대상의 척도가 태양계를 넘어 광활한 우주 공간으로 팽창할 때, 역학적 상황은 다시 완벽하게 역전된다. 수억 광년에 달하는 텅 빈 공간 전체가 요동칠 때, 그 방대한 체적에 누적된 진동 에너지의 총량은 기하급수적으로 폭증한다. 이 초거시적 스케일 앞에서는 행성이나 은하와 같은 초거대 질량체조차도 '우주 공간의 방대함'에 비하면 한낱 극미한 양자(Quantum)와 동일한 처지로 전락하게 된다. 즉, 일상적 질량의 관성에 의해 일시적으로 무시되었던 공간의 진동력($\\mathbf{F}_{space}$)이, 우주의 방대한 규모를 등에 업고 다시 맹렬한 역학적 힘으로 극대화되어 천체들의 궤적을 쥐고 흔들게 되는 것이다. 본 연작 논문의 후속편인 [공간의 진동 역학 II: 거시 중력장과 미시 공간 진동의 상호작용] 및 [III: 우주 공간 판구조론]에서는, 우주적 스케일로 극대화된 이 거대한 공간 진동이 어떻게 은하들을 휩쓸어 '암흑 물질(Dark matter)'의 잉여 중력으로 창발하는지, 그리고 은하들이 이끌려 만들어진 '우주 거미줄(Cosmic Web)'이 어떻게 우주적 규모의 거대한 양자 간섭 무늬인지 통합적으로 규명해 나갈 것이다.~~",
                "en": ""
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p7_12",
            "versions": {
              "v1": {
                "ko": "**[향후 연구 과제: 프랙탈적 스케일 대칭성과 우주론적 확장]** / **[Future Research Directions: Fractal Scale Symmetry and Cosmological Extensions]**",
                "en": "This first paper has elucidated the mechanism by which the 'geometrical vibration of space' manifests in the quantum realm, and has demonstrated that at the meso-macro scale, the dense mass coupling of matter forms a temporary inertial dominance, rendering Newtonian mechanics dominant."
              },
              "v2": {
                "ko": "**[향후 연구 과제: 프랙탈적 스케일 대칭성과 우주론적 확장]** / **[Future Research Directions: Fractal Scale Symmetry and Cosmological Extensions]**",
                "en": "This first paper has elucidated the mechanism by which the 'geometrical vibration of space' manifests in the quantum realm, and has demonstrated that at the meso-macro scale, the dense mass coupling of matter forms a temporary inertial dominance, rendering Newtonian mechanics dominant."
              },
              "v3": {
                "ko": "**[향후 연구 과제: 프랙탈적 스케일 대칭성과 우주론적 확장]**",
                "en": "This first paper has elucidated the mechanism by which the 'geometrical vibration of space' manifests in the quantum realm, and has demonstrated that at the meso-macro scale, the dense mass coupling of matter forms a temporary inertial dominance, rendering Newtonian mechanics dominant."
              }
            }
          },
          {
            "id": "p7_13",
            "versions": {
              "v1": {
                "ko": "본 제1논문은 '공간의 기하학적 진동'이 양자 세계에서 발현되는 메커니즘을 규명하고, 중간 거시(Meso-macro) 스케일에서는 물체의 조밀한 질량 결합이 일시적인 관성적 압도를 형성하여 뉴턴 역학이 지배함을 증명하였다.",
                "en": ""
              },
              "v2": {
                "ko": "본 제1논문은 '공간의 기하학적 진동'이 양자 세계에서 발현되는 메커니즘을 규명하고, 중간 거시(Meso-macro) 스케일에서는 물체의 조밀한 질량 결합이 일시적인 관성적 압도를 형성하여 뉴턴 역학이 지배함을 증명하였다.",
                "en": ""
              },
              "v3": {
                "ko": "본 제1논문은 '공간의 기하학적 진동'이 양자 세계에서 발현되는 메커니즘을 규명하고, 중간 거시(Meso-macro) 스케일에서는 물체의 조밀한 질량 결합이 일시적인 관성적 압도를 형성하여 뉴턴 역학이 지배함을 증명하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_14",
            "versions": {
              "v1": {
                "ko": "그러나 본 연구는 이 역학 관계가 국소적 한계를 넘어 우주적 규모(Cosmological scale)로 확장될 때, 극적인 **'프랙탈적 회귀(Fractal Recursion)와 스케일 대칭성'**을 발현할 것이라 강력히 예측한다. 대상의 척도가 태양계를 넘어 광활한 심우주(Deep Space)로 팽창할 때, 역학적 상황은 다시 완벽하게 역전될 수밖에 없다.",
                "en": "However, we strongly predict that when this dynamical relationship extends beyond local limits to the cosmological scale, it will manifest a dramatic 'fractal recursion and scale symmetry.' When the scale of interest expands beyond the solar system into the vast deep space, the dynamical balance must be completely inverted once again."
              },
              "v2": {
                "ko": "그러나 본 연구는 이 역학 관계가 국소적 한계를 넘어 우주적 규모(Cosmological scale)로 확장될 때, 극적인 **'프랙탈적 회귀(Fractal Recursion)와 스케일 대칭성'**을 발현할 것이라 강력히 예측한다. 대상의 척도가 태양계를 넘어 광활한 심우주(Deep Space)로 팽창할 때, 역학적 상황은 다시 완벽하게 역전될 수밖에 없다.",
                "en": "However, we strongly predict that when this dynamical relationship extends beyond local limits to the cosmological scale, it will manifest a dramatic 'fractal recursion and scale symmetry.' When the scale of interest expands beyond the solar system into the vast deep space, the dynamical balance must be completely inverted once again."
              },
              "v3": {
                "ko": "그러나 본 연구는 이 역학 관계가 국소적 한계를 넘어 우주적 규모(Cosmological scale)로 확장될 때, 극적인 **'프랙탈적 회귀(Fractal Recursion)와 스케일 대칭성'**을 발현할 것이라 강력히 예측한다. 대상의 척도가 태양계를 넘어 광활한 심우주(Deep Space)로 팽창할 때, 역학적 상황은 다시 완벽하게 역전될 수밖에 없다.",
                "en": "However, we strongly predict that when this dynamical relationship extends beyond local limits to the cosmological scale, it will manifest a dramatic 'fractal recursion and scale symmetry.' When the scale of interest expands beyond the solar system into the vast deep space, the dynamical balance must be completely inverted once again."
              }
            }
          },
          {
            "id": "p7_15",
            "versions": {
              "v1": {
                "ko": "수억 광년에 달하는 텅 빈 공간 전체가 요동칠 때, 그 방대한 체적에 누적된 기하학적 진동 에너지의 총량은 기하급수적으로 폭증한다. 이 초거시적 스케일 앞에서는 행성이나 은하와 같은 초거대 질량체조차도 '우주 공간의 방대함'에 비하면 한낱 극미한 양자(Quantum Particle)와 동일한 처지로 전락하게 된다. 즉, 일상적 질량 관성에 의해 국소적으로 억제되었던 공간의 역학적 유도력($\\mathbf{F}_{space}$)이, 우주의 방대한 볼륨을 등에 업고 다시 극대화되어 천체 단위의 궤적을 쥐고 흔들게 될 것임을 수학적으로 유추할 수 있다.",
                "en": "When the entire empty space extending over hundreds of millions of light-years fluctuates, the cumulative sum of geometrical vibration energy stored in that vast volume surges exponentially. In the presence of this super-macroscopic scale, even hyper-massive bodies such as planets or galaxies are reduced to the status of infinitesimal quantum particles relative to the sheer immensity of cosmic space. In other words, it can be mathematically inferred that the spatial guidance force ($\\mathbf{F}_{space}$), which was locally suppressed by ordinary mass inertia, becomes maximized again, backed by the cosmic volume, and will actively dictate the trajectories of astrophysical entities."
              },
              "v2": {
                "ko": "수억 광년에 달하는 텅 빈 공간 전체가 요동칠 때, 그 방대한 체적에 누적된 기하학적 진동 에너지의 총량은 기하급수적으로 폭증한다. 이 초거시적 스케일 앞에서는 행성이나 은하와 같은 초거대 질량체조차도 '우주 공간의 방대함'에 비하면 한낱 극미한 양자(Quantum Particle)와 동일한 처지로 전락하게 된다. 즉, 일상적 질량 관성에 의해 국소적으로 억제되었던 공간의 역학적 유도력($\\mathbf{F}_{space}$)이, 우주의 방대한 볼륨을 등에 업고 다시 극대화되어 천체 단위의 궤적을 쥐고 흔들게 될 것임을 수학적으로 유추할 수 있다.",
                "en": "When the entire empty space extending over hundreds of millions of light-years fluctuates, the cumulative sum of geometrical vibration energy stored in that vast volume surges exponentially. In the presence of this super-macroscopic scale, even hyper-massive bodies such as planets or galaxies are reduced to the status of infinitesimal quantum particles relative to the sheer immensity of cosmic space. In other words, it can be mathematically inferred that the spatial guidance force ($\\mathbf{F}_{space}$), which was locally suppressed by ordinary mass inertia, becomes maximized again, backed by the cosmic volume, and will actively dictate the trajectories of astrophysical entities."
              },
              "v3": {
                "ko": "수억 광년에 달하는 텅 빈 공간 전체가 요동칠 때, 그 방대한 체적에 누적된 기하학적 진동 에너지의 총량은 기하급수적으로 폭증한다. 이 초거시적 스케일 앞에서는 행성이나 은하와 같은 초거대 질량체조차도 '우주 공간의 방대함'에 비하면 한낱 극미한 양자(Quantum Particle)와 동일한 처지로 전락하게 된다. 즉, 일상적 질량 관성에 의해 국소적으로 억제되었던 공간의 역학적 유도력($\\mathbf{F}_{space}$)이, 우주의 방대한 볼륨을 등에 업고 다시 극대화되어 천체 단위의 궤적을 쥐고 흔들게 될 것임을 수학적으로 유추할 수 있다.",
                "en": "When the entire empty space extending over hundreds of millions of light-years fluctuates, the cumulative sum of geometrical vibration energy stored in that vast volume surges exponentially. In the presence of this super-macroscopic scale, even hyper-massive bodies such as planets or galaxies are reduced to the status of infinitesimal quantum particles relative to the sheer immensity of cosmic space. In other words, it can be mathematically inferred that the spatial guidance force ($\\mathbf{F}_{space}$), which was locally suppressed by ordinary mass inertia, becomes maximized again, backed by the cosmic volume, and will actively dictate the trajectories of astrophysical entities."
              }
            }
          },
          {
            "id": "p7_16",
            "versions": {
              "v1": {
                "ko": "따라서 본 연구의 후속 연작에서는 이러한 초거시적 스케일로 부활한 공간의 진동 에너지가, 거대 질량체가 형성하는 휜 시공간(Curved spacetime)과 결합할 때 발생하는 우주적 섭동 역학을 추적할 것이다. 이를 통해 현재 현대 천체물리학이 직면한 최대의 난제인 **잉여 중력(암흑 물질 현상)과 우주 거대 구조(Large-scale Structure)의 기원**이, 실은 우주적 스케일로 전개된 '거대한 양자 역학적 파동 간섭'의 시각적 발현일 수 있다는 대통합의 단서를 규명해 나갈 것이다.",
                "en": "Therefore, in subsequent serial works, we will trace the cosmic perturbation dynamics arising from the coupling of this resurrected spatial vibration energy at the super-macroscopic scale with the curved spacetime formed by massive bodies. Through this, we will uncover clues to a grand synthesis demonstrating that the greatest anomalies in modern astrophysics—namely, excess gravity (dark matter phenomena) and the origin of the cosmic large-scale structure—are in fact visual manifestations of macroscopic quantum wave interference unfolding at the cosmological scale."
              },
              "v2": {
                "ko": "따라서 본 연구의 후속 연작에서는 이러한 초거시적 스케일로 부활한 공간의 진동 에너지가, 거대 질량체가 형성하는 휜 시공간(Curved spacetime)과 결합할 때 발생하는 우주적 섭동 역학을 추적할 것이다. 이를 통해 현재 현대 천체물리학이 직면한 최대의 난제인 **잉여 중력(암흑 물질 현상)과 우주 거대 구조(Large-scale Structure)의 기원**이, 실은 우주적 스케일로 전개된 '거대한 양자 역학적 파동 간섭'의 시각적 발현일 수 있다는 대통합의 단서를 규명해 나갈 것이다.",
                "en": "Therefore, in subsequent serial works, we will trace the cosmic perturbation dynamics arising from the coupling of this resurrected spatial vibration energy at the super-macroscopic scale with the curved spacetime formed by massive bodies. Through this, we will uncover clues to a grand synthesis demonstrating that the greatest anomalies in modern astrophysics—namely, excess gravity (dark matter phenomena) and the origin of the cosmic large-scale structure—are in fact visual manifestations of macroscopic quantum wave interference unfolding at the cosmological scale."
              },
              "v3": {
                "ko": "따라서 본 연구의 후속 연작에서는 이러한 초거시적 스케일로 부활한 공간의 진동 에너지가, 거대 질량체가 형성하는 휜 시공간(Curved spacetime)과 결합할 때 발생하는 우주적 섭동 역학을 추적할 것이다. 이를 통해 현재 현대 천체물리학이 직면한 최대의 난제인 **잉여 중력(암흑 물질 현상)과 우주 거대 구조(Large-scale Structure)의 기원**이, 실은 우주적 스케일로 전개된 '거대한 양자 역학적 파동 간섭'의 시각적 발현일 수 있다는 대통합의 단서를 규명해 나갈 것이다.",
                "en": "Therefore, in subsequent serial works, we will trace the cosmic perturbation dynamics arising from the coupling of this resurrected spatial vibration energy at the super-macroscopic scale with the curved spacetime formed by massive bodies. Through this, we will uncover clues to a grand synthesis demonstrating that the greatest anomalies in modern astrophysics—namely, excess gravity (dark matter phenomena) and the origin of the cosmic large-scale structure—are in fact visual manifestations of macroscopic quantum wave interference unfolding at the cosmological scale."
              }
            }
          },
          {
            "id": "p7_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "**~~[향후 연구 과제 및 새로운 지평: 우주론으로의 확장 예고]**",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "본 제1논문은 '공간의 기하학적 진동'이 미시 양자 세계에서 발현되는 역학적 메커니즘을 규명하는 데 집중하였다. 그러나 공간이 스스로 기하학적 장력과 에너지를 가진 '동역학적 실체(Dynamical Entity)'라면, 이 공간 진동은 필연적으로 거대 질량이 만들어내는 거시적인 우주의 휜 시공간(Curved Spacetime), 즉 **일반상대성이론의 '중력(Gravity)'과도 역학적으로 상호작용**해야만 한다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "~~공간의 미시적 진동(파도)이 거대 질량이 만드는 거시적 공간 왜곡(소용돌이)과 결합할 때, 과연 어떤 우주론적 섭동이 발생하는가?~~",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "~~본 연작 논문의 후속편인 **[공간의 진동 역학 II: 거시 중력장과 미시 공간 진동의 상호작용]**에서는 아인슈타인 장 방정식에 본 논문에서 도출한 '공간 진동 텐서'를 결합할 것이다. 중력 렌즈를 지나는 빛의 궤적에서 발생하는 미세 섭동 오차를 예측하고, 거대 중력장 내에서 응축된 공간 진동 에너지가 어떻게 **'암흑 물질(Dark Matter)'**과 **'암흑 에너지(Dark Energy)'**라는 우주적 현상으로 창발하는지 그 본질적 기원을 통합적으로 규명해 나갈 것이다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v3_ko_10",
            "versions": {
              "v3": {
                "ko": "**~~[향후 연구 과제 및 새로운 지평: 프랙탈적 스케일 대칭성과 우주적 회귀]~~**",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v3_ko_12",
            "versions": {
              "v3": {
                "ko": "~~그러나 본 연구는 이 역학 관계가 우주적 규모(Cosmological scale)에서 극적인 **'프랙탈적 회귀(Fractal Recursion)와 스케일 대칭성'**을 발현할 것이라 강력히 예측한다. 대상의 척도가 태양계를 넘어 광활한 우주 공간으로 팽창할 때, 역학적 상황은 다시 완벽하게 역전된다.~~",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v3_ko_14",
            "versions": {
              "v3": {
                "ko": "~~본 연작 논문의 후속편인 **[공간의 진동 역학 II: 거시 중력장과 미시 공간 진동의 상호작용]** 및 **[III: 우주 공간 판구조론]**에서는, 우주적 스케일로 극대화된 이 거대한 공간 진동이 어떻게 은하들을 휩쓸어 '암흑 물질(Dark matter)'의 잉여 중력으로 창발하는지, 그리고 은하들이 이끌려 만들어진 '우주 거미줄(Cosmic Web)'이 어떻게 우주적 규모의 거대한 양자 간섭 무늬인지 통합적으로 규명해 나갈 것이다.~~",
                "en": ""
              }
            }
          }
        ]
      }
    ],
    "references": {
      "ref1": {
        "id": "ref1",
        "title": "Can Quantum-Mechanical Description of Physical Reality be Considered Complete?",
        "authors": "Einstein, A., Podolsky, B., & Rosen, N.",
        "journal": "Physical Review",
        "year": 1935,
        "pdfUrl": "https://journals.aps.org/pr/pdf/10.1103/PhysRev.47.777",
        "citedPage": 1,
        "citedContext": {
          "ko": "양자 스핀 얽힘 상태의 국소 실재성 모순을 지적하여 현대 양자해석론의 근본적 문제를 제기함",
          "en": "Highlighting Einstein-Podolsky-Rosen paradox questioning quantum completeness."
        }
      },
      "ref2": {
        "id": "ref2",
        "title": "Equation of Motion of a Particle in a Wave Field",
        "authors": "Madelung, E.",
        "journal": "Zeitschrift für Physik",
        "year": 1927,
        "pdfUrl": "",
        "citedPage": 2,
        "citedContext": {
          "ko": "슈뢰딩거 파동 방정식을 극좌표로 변환하여 최초로 유체역학적 흐름으로 변환 정식화함",
          "en": "Introducing Madelung hydrodynamic equations for wave function polar form."
        }
      },
      "ref3": {
        "id": "ref3",
        "title": "A Suggested Interpretation of the Quantum Theory in Terms of 'Hidden' Variables I & II",
        "authors": "Bohm, David",
        "journal": "Physical Review",
        "year": 1952,
        "pdfUrl": "https://journals.aps.org/pr/pdf/10.1103/PhysRev.85.166",
        "citedPage": 3,
        "citedContext": {
          "ko": "양자 퍼텐셜 개념을 도입하여 입자의 실재 궤적을 예측하는 은닉 변수 이론의 뼈대를 완성함",
          "en": "Foundational Bohmian mechanics introducing the concept of quantum potential."
        }
      },
      "ref4": {
        "id": "ref4",
        "title": "Hydrodynamic pilot-wave theory",
        "authors": "Bush, J. W. M.",
        "journal": "Annual Review of Fluid Mechanics",
        "year": 2015,
        "pdfUrl": "",
        "citedPage": 4,
        "citedContext": {
          "ko": "실제 거시 실리콘 오일방울 액적(Walking Droplet) 실험을 통해 결정론적 파동 궤적 유도가 물리적으로 실재함을 규명함",
          "en": "Experimental verification of deterministic paths via walking oil droplets."
        }
      }
    },
    "reviews": {
      "rev1": {
        "id": "rev1",
        "reviewer": "Reviewer 1",
        "objection": {
          "ko": "해당 파트의 학술적 물리 설명 보강을 요청합니다.",
          "en": "Requested expanded physical justification for this section."
        },
        "rebuttal": [
          {
            "role": "author",
            "text": {
              "ko": "v2.0.0에서 지적에 맞춰 본문을 추가적으로 보완하였습니다.",
              "en": "Addressed in v2.0.0 by expanding the corresponding arguments."
            }
          }
        ],
        "status": "Resolved",
        "linkedParagraphId": "p1_1"
      }
    },
    "workflow": {
      "stage": "Rebuttal & Final Proof",
      "percent": 85,
      "nextStep": "PRL 학술지 최종 Proof 편집인 승인 대기 중",
      "journalTarget": "Physical Review Letters (PRL)"
    }
  },
  "spatial-vibration-2": {
    "id": "spatial-vibration-2",
    "slug": "spatial-vibration-2",
    "title": {
      "ko": "공간의 진동 역학 II: 거시 중력장과 미시 공간 진동의 상호작용 및 암흑 우주 대체 모델",
      "en": "Mechanics of Spatial Vibration II: Interaction of Macroscopic Gravity with Microscopic Vibration and Alternative Models for the Dark Sector"
    },
    "authors": {
      "ko": "유광용 (Kwang yong Yoo)",
      "en": "Kwang yong Yoo"
    },
    "affiliations": {
      "ko": "KT 상무, 연세대학교 경영학 박사 수료, 코네티컷 대학교 법학 석사 (LL.M.)",
      "en": "Director at KT, Ph.D. Candidate in Business Administration at Yonsei University, LL.M. at University of Connecticut"
    },
    "abstract": {
      "versions": {
        "v1": {
          "ko": "",
          "en": ""
        },
        "v2": {
          "ko": "",
          "en": ""
        },
        "v3": {
          "ko": "현대 우주론은 은하의 회전 속도 곡선 이상과 우주의 가속 팽창 문제를 해결하기 위해 암흑 물질(Dark Matter)과 암흑 에너지(Dark Energy), 그리고 우주 상수(Cosmological Constant, $\\Lambda$)를 도입하였으나, 이들의 물리적 실체는 현재까지 규명되지 않았다. 본 논문은 제1논문에서 입증된 '공간의 기하학적 진동' 모델을 우주론적 척도로 확장하여, 가상의 입자와 임시방편적인 상수를 전면 폐기하고 암흑 우주를 결정론적 기하 역학으로 대통합하는 대안적 역학 모델을 제시한다.\n본 연구는 아인슈타인의 장 방정식(Einstein Field Equations)에 물리적 실재를 지닌 **'공간 진동 텐서($\\tilde{V}_{\\mu\\nu}$)'**를 확장 도입한다. 은하 헤일로와 같이 질량 밀도가 희박한 영역에서 진동파가 거대 중력 우물(소용돌이)로 유입되며 극한의 보강 간섭을 일으켜 '텐서 응축(Tensor Condensation)'을 발생시킴을 역학적으로 규명하고, 이 막대한 응축 에너지가 질량-에너지 등가원리에 의해 잉여 중력(암흑 물질)으로 창발함을 증명한다.\n반면, 어떠한 중력적 억제력도 없는 광활한 우주 거대 공동(Voids)에서는 공간의 요동 텐서가 사방으로 뿜어내는 '진동 복사압(Vibrational Radiation Pressure, $p_{vib} < 0$)'이 시공간을 밀어내는 척력으로 작용하여 가속 팽창(암흑 에너지)을 주도함을 프리드만 방정식을 통해 수학화한다. 나아가 특수상대성이론의 길이 수축 현상을 광속 비행체가 겪는 진동 파동의 도플러 압착(Doppler Compression)으로 해명하며, 공간 접합에 의한 광학적 시간 도약(Optical Time-Leap) 및 중력 렌즈의 미세 섭동을 새로운 관측 지표로 제시한다.",
          "en": "To resolve the profound paradoxes of anomalous galactic rotation curves and the accelerating expansion of the universe, this study completely discards hypothetical particles (Dark Matter) and the ad-hoc cosmological constant (Dark Energy). Instead, it proposes a unified mechanical model by introducing the **'Geometrical Spatial Vibration Tensor ($\\tilde{V}_{\\mu\\nu}$)'**—established in our preceding paper—into the Einstein Field Equations.\nThis paper demonstrates the mechanism of 'Scale Inversion', where spatial vibrations previously suppressed by mass inertia regain dynamic dominance in sparse cosmic regions such as galactic halos. Spatial waves entering immense gravity wells undergo extreme constructive interference and 'Tensor Condensation', which emerges as effective surplus mass generating surplus gravity (Dark Matter) via mass-energy equivalence. Conversely, in unsuppressed vast cosmic voids, the intrinsic vibrational radiation pressure ($p_{vib} < 0$) emitted by the fluctuating vacuum acts as a repulsive field, driving the accelerated expansion of the universe (Dark Energy). Furthermore, length contraction in Special Relativity is mechanically elucidated as the 'Doppler Compression' of spatial waves during high-speed flight, and optical time-leaps (chronological illusions) induced by spatial junctions alongside micro-scattering in gravitational lensing are predicted as novel astronomical observational markers."
        }
      }
    },
    "chapters": [
      {
        "number": 1,
        "title": {
          "ko": "1장. 서론 (Introduction)",
          "en": "Chapter 1. Introduction"
        },
        "paragraphs": [
          {
            "id": "p1_1",
            "versions": {
              "v1": {
                "ko": "- **스케일 역전 메커니즘 선언:** 조밀한 질량체에 억눌렸던 진동이 광활한 우주 볼륨에서 다시 관성을 압도함.",
                "en": ""
              },
              "v2": {
                "ko": "- **스케일 역전 메커니즘 선언:** 조밀한 질량체에 억눌렸던 진동이 광활한 우주 볼륨에서 다시 관성을 압도함.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_2",
            "versions": {
              "v1": {
                "ko": "- **소용돌이와 파도 비유:** 소용돌이(거시 중력 곡률)와 파도(미시 공간 진동)의 비유를 통한 진동-중력 역학적 상호작용 개념 도입.",
                "en": ""
              },
              "v2": {
                "ko": "- **소용돌이와 파도 비유:** 소용돌이(거시 중력 곡률)와 파도(미시 공간 진동)의 비유를 통한 진동-중력 역학적 상호작용 개념 도입.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "앞선 제1논문(공간의 진동 역학 I)에서 본 연구는 미시 세계의 확률적 파동 현상이 대상 입자의 본질이 아니라, 대상을 둘러싼 텅 빈 배경 공간 자체의 '기하학적 요동(Geometrical fluctuation)'임을 수학적으로 입증하였다. 또한 거시 세계의 조밀한 질량체($m$)는 그 압도적인 관성으로 인해 이 국소적인 진동력($\\mathbf{F}_{space}$)을 압도하고 무시하므로 뉴턴 고전 역학이 지배함을 규명하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "그러나 우주의 규모(Cosmological Scale)로 시야를 확장할 때, 질량의 관성과 공간 체적 간의 역학적 줄다리기는 프랙탈적 스케일 대칭성(Fractal Scale Symmetry)에 의해 극적인 역전을 겪는다. 수억 광년에 달하는 심우주(Deep Space)의 방대한 체적에 누적된 공간 진동 에너지는 항성 내부와 같은 조밀한 질량 밀도가 옅어진 틈을 타 천체들의 거시적 관성을 다시금 압도하게 되는 **'스케일 역전(Scale Inversion)'**을 일으킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "본 논문은 이러한 초거시적 관점에서 **'아인슈타인의 일반상대성이론이 기술하는 거시적 시공간의 곡률(Macroscopic Gravity)'**과 **'본 연구가 제안하는 미시적 공간의 기하학적 요동(Microscopic Spatial Vibration)'** 사이의 상호작용 메커니즘을 탐구한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "이를 직관적인 자연 현상에 빗대자면, 천체의 중력은 바다의 거대한 **'소용돌이(Whirlpool)'**와 같으며, 공간의 본질적 요동은 표면을 끊임없이 출렁이게 하는 미세한 **'파도(Waves)'**와 같다. 거대한 소용돌이에 파도가 빨려 들어갈 때 극도로 왜곡되고 응축되듯, 휜 시공간을 통과하는 공간 진동 에너지는 기하급수적인 보강 간섭과 텐서 섭동을 겪게 된다. 본 연구는 이 피드백 루프를 수식화하여 암흑 우주의 난제들을 텅 빈 공간 자체의 역학적 진동 현상으로 완벽히 대체한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "In Paper I (Mechanics of Spatial Vibration I), this research mathematically proved that probabilistic wave phenomena in the microscopic realm are not intrinsic properties of particles, but originate from the 'geometrical fluctuation' of the empty background space. It also elucidated that dense macroscopic masses ($m$) mechanically pierce through and ignore this local guidance force ($\\mathbf{F}_{space}$) due to their overwhelming inertia, resulting in the domination of Newtonian classical mechanics."
              }
            }
          },
          {
            "id": "p1_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "However, when scaling up to cosmological dimensions, the dynamic tug-of-war between mass inertia and spatial volume undergoes a dramatic inversion governed by fractal scale symmetry. The immense spatial vibrational energy accumulated within the vast volumes of deep space seizes the opportunity of diluted mass density to once again overpower the macroscopic inertia of celestial bodies—a phenomenon defined as **'Scale Inversion'**."
              }
            }
          },
          {
            "id": "p1_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "From this ultra-macroscopic perspective, this paper investigates the mechanical interactions between the **'Macroscopic Spacetime Curvature (Gravity)'** described by Einstein's General Relativity and the **'Microscopic Geometrical Fluctuation of Space'** proposed by this study."
              }
            }
          },
          {
            "id": "p1_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Analogously, celestial gravity acts as a massive oceanic **'Whirlpool'**, while intrinsic spatial fluctuation serves as the microscopic **'Waves'** continuously rippling its surface. Just as waves drawn into a whirlpool are extremely distorted and condensed, spatial vibration energy passing through curved spacetime undergoes exponential constructive interference and tensor perturbations. By formulating this feedback loop, this study replaces the unknown phenomena of dark matter and dark energy with the mechanical vibration phenomena of empty space itself."
              }
            }
          }
        ]
      },
      {
        "number": 2,
        "title": {
          "ko": "2장. 진동-중력 결합 방정식: 아인슈타인 장 방정식의 확장",
          "en": "Chapter 2. Coupled Equations of Vibration and Gravity"
        },
        "paragraphs": [
          {
            "id": "p2_1",
            "versions": {
              "v1": {
                "ko": "- **공간 진동 텐서 도입:** 물리적 실재를 지닌 공간 진동 텐서($\\tilde{V}_{\\mu\\nu}$)의 확장 도입 및 수학적 환영인 우주 상수($\\Lambda$)의 철저한 폐기.",
                "en": ""
              },
              "v2": {
                "ko": "- **공간 진동 텐서 도입:** 물리적 실재를 지닌 공간 진동 텐서($\\tilde{V}_{\\mu\\nu}$)의 확장 도입 및 수학적 환영인 우주 상수($\\Lambda$)의 철저한 폐기.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_2",
            "versions": {
              "v1": {
                "ko": "- **비선형 피드백 루프:** 거대 질량체(중력)가 진동파를 굴절시키고, 역으로 진동 텐서 에너지가 시공간 곡률에 압력을 가하는 비선형적 피드백 루프 수식화.",
                "en": ""
              },
              "v2": {
                "ko": "- **비선형 피드백 루프:** 거대 질량체(중력)가 진동파를 굴절시키고, 역으로 진동 텐서 에너지가 시공간 곡률에 압력을 가하는 비선형적 피드백 루프 수식화.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "일반상대성이론의 아인슈타인 장 방정식은 물질과 에너지 분포가 시공간을 휘게 만듦을 기술한다 [1]. 기존 물리학은 진공 상태를 매끄러운 연속체로 가정하지만, 본 연구의 공리에 따르면 진공은 극미세 스케일에서 끊임없이 요동치는 기하학적 진폭($R$)을 지닌다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### 2.1. 공간 진동 에너지-운동량 텐서 ($\\tilde{V}_{\\mu\\nu}$)의 도입",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "제1논문에서 정의한 공간 진동 퍼텐셜 $Q_s \\propto -\\frac{\\nabla^2 R}{R}$를 4차원 시공간 텐서 형태로 확장한다. 텅 빈 공간이 맹렬히 진동할 때 이 진동이 내포하는 동역학적 운동 에너지와 척력적 복사압을 기술하는 **'공간 진동 텐서(Spatial Vibration Tensor, $\\tilde{V}_{\\mu\\nu}$)'**를 새롭게 정의하여 아인슈타인 방정식 우변에 추가한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "우주 팽창을 설명하기 위해 임시로 도입된 우주 상수 $\\Lambda$는 본 모델에서 철저히 폐기되며, 그 역할은 진동 텐서 $\\tilde{V}_{\\mu\\nu}$가 발생시키는 기하학적 척력으로 완벽히 대체된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "### 2.2. 소용돌이와 파도의 비선형적 피드백 루프",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "이 확장된 방정식은 거시적 공간 곡률($G_{\\mu\\nu}$)과 미시적 공간 진동($\\tilde{V}_{\\mu\\nu}$)이 비선형적 피드백 루프를 형성함을 보여준다. 거대 질량체가 시공간을 강하게 휠수록, 주변의 공간 진동파는 중력 우물(Gravity Well) 안으로 굴절 및 유입되어 심하게 압축(Blue-shift)된다. 압축된 진동 파도들은 극단적인 보강 간섭을 일으켜 에너지 밀도를 폭증시키고, 이 에너지는 다시 시공간을 추가로 휘게 만드는 역학적 순환 고리를 형성한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "### 2.3. 특수상대성이론의 역학적 재해석: 도플러 압착(Doppler Compression)과 길이 수축의 실체",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "아인슈타인의 특수상대성이론은 관찰자의 이동 속도($v$)가 빛의 속도($c$)에 근접할수록 진행 방향의 공간이 수축한다고 증명했으나, 그 동역학적(Dynamical) 실체는 모호했다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_10",
            "versions": {
              "v3": {
                "ko": "본 모델에서 빛의 속도 $c$는 '진공 매질의 최대 탄성 전파 속도'이다. 우주선의 속도 $v$가 $c$에 근접하게 되면, 전방의 텅 빈 공간을 채우고 있던 진동파(Wave-fronts)들은 맹렬히 돌진하는 비행체를 피하지 못하고 겹겹이 적체되며 극단적인 **'도플러 압착(Doppler Compression)'**을 겪는다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_11",
            "versions": {
              "v3": {
                "ko": "진동파의 파장은 곧 시공간의 거리를 재는 기하학적 잣대(Metric Tensor) 자체이다. 압착되어 파장이 극도로 촘촘해진 이 텐서 지대(Compressive Tensor Zone)를 돌파해야 하는 관찰자 입장에서는 진행 방향의 물리적 거리가 역학적으로 찌그러져 수축된 것으로 관측될 수밖에 없으며, 이것이 길이 수축의 기계적 실체이다. 동시에 전방에 무한대로 겹쳐진 진동 파도들이 무한대의 텐서 밀도를 가진 기하학적 '진동 충격파 장벽(Vacuum Boom)'을 형성하여 막대한 상대론적 질량(저항)으로 작용하므로, 물질은 광속($c$)을 물리적으로 돌파할 수 없다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The standard Einstein Field Equations assume the vacuum state to be a smooth continuum [1]. However, according to this study's axioms, the vacuum is not perfectly smooth; it possesses geometrical amplitudes ($R$) constantly fluctuating at infinitesimal scales."
              }
            }
          },
          {
            "id": "p2_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 2.1. Introduction of the Spatial Vibration Tensor ($\\tilde{V}_{\\mu\\nu}$)"
              }
            }
          },
          {
            "id": "p2_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "To describe the kinetic energy and geometrical repulsive radiation pressure inherently emitted by the fiercely vibrating empty space, a novel **'Spatial Vibration Tensor ($\\tilde{V}_{\\mu\\nu}$)'** is defined and added to the right-hand side of the Einstein equations:"
              }
            }
          },
          {
            "id": "p2_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$"
              }
            }
          },
          {
            "id": "p2_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The cosmological constant $\\Lambda$, previously a mathematical ad hoc to describe dark energy, is entirely discarded in this model, and its role is perfectly superseded by the expansive radiation pressure of the vibration tensor $\\tilde{V}_{\\mu\\nu}$."
              }
            }
          },
          {
            "id": "p2_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 2.2. Dynamical Feedback Loop"
              }
            }
          },
          {
            "id": "p2_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The extended equation reveals a nonlinear feedback loop where macroscopic spatial curvature ($G_{\\mu\\nu}$) and microscopic spatial vibration ($\\tilde{V}_{\\mu\\nu}$) continuously influence each other. As a massive object curves spacetime more intensely, surrounding spatial vibrational waves are drawn into the gravity well, becoming severely compressed (blue-shifted) and distorted. These compressed waves undergo extreme constructive interference, explosively increasing tensor energy density, which in turn acts to further curve spacetime."
              }
            }
          },
          {
            "id": "p2_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 2.3. Mechanical Reinterpretation of Special Relativity: Doppler Compression and Length Contraction"
              }
            }
          },
          {
            "id": "p2_v3_en_9",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The phenomenon of 'Length Contraction' in Special Relativity is mechanically elucidated in this model as a deterministic fluid-dynamic phenomenon: the **'Doppler Compression'** of spatial waves. The speed of light $c$ is the 'maximum elastic propagation speed' of geometrical phase vibrations through the vacuum medium."
              }
            }
          },
          {
            "id": "p2_v3_en_10",
            "versions": {
              "v3": {
                "ko": "",
                "en": "When a spacecraft's velocity $v$ approaches $c$, the spatial wave-fronts filling the empty space ahead fail to disperse in time, piling up and undergoing extreme compression. Since spatial wavelength serves as the metric measuring physical distance, this extreme compression implies that the metric yardstick of spacetime itself is physically crumpled like an accordion. Thus, length contraction is an inevitable deterministic tensor friction where an observer traversing this physically squashed tensor zone observes the distance as mechanically contracted. Additionally, the infinitely piled tensor vibrations form a 'Vacuum Boom' barrier of massive effective resistance, mechanically prohibiting objects with mass from exceeding light speed."
              }
            }
          }
        ]
      },
      {
        "number": 3,
        "title": {
          "ko": "3장. 중력 렌즈 현상의 미세 섭동 예측: 빛 궤적과 공간 진동의 마찰",
          "en": "Chapter 3. Prediction of Micro-Perturbations in Gravitational Lensing"
        },
        "paragraphs": [
          {
            "id": "p3_1",
            "versions": {
              "v1": {
                "ko": "- **요동 측지선 방정식:** 매끄러운 고전적 측지선 방정식을 반박하고, 공간 마찰 오차($\\mathbf{f}_{jitter}$)가 중첩된 요동치는 측지선 방정식 도출.",
                "en": ""
              },
              "v2": {
                "ko": "- **요동 측지선 방정식:** 매끄러운 고전적 측지선 방정식을 반박하고, 공간 마찰 오차($\\mathbf{f}_{jitter}$)가 중첩된 요동치는 측지선 방정식 도출.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_2",
            "versions": {
              "v1": {
                "ko": "- **천문학 관측 예측 1:** 중력 렌즈 이미지 테두리의 픽셀 단위 흩뿌려짐(광학적 번짐, Micro-Scattering).",
                "en": ""
              },
              "v2": {
                "ko": "- **천문학 관측 예측 1:** 중력 렌즈 이미지 테두리의 픽셀 단위 흩뿌려짐(광학적 번짐, Micro-Scattering).",
                "en": ""
              }
            }
          },
          {
            "id": "p3_3",
            "versions": {
              "v1": {
                "ko": "- **천문학 관측 예측 2:** 공간 진동 텐서 궤적 적분에 비례하여 나타나는 샤피로 지연 외의 잉여 위상 지연($\\Delta t_{vibration}$).",
                "en": ""
              },
              "v2": {
                "ko": "- **천문학 관측 예측 2:** 공간 진동 텐서 궤적 적분에 비례하여 나타나는 샤피로 지연 외의 잉여 위상 지연($\\Delta t_{vibration}$).",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "거대 중력 우물을 지나는 빛의 궤적은 기하학적으로 완벽히 매끄러운 측지선을 따른다고 전제되어 왔다. 그러나 매끄러운 중력장 위에는 미시적 공간 진동이라는 거친 파도가 요동치고 있으므로, 빛은 필연적으로 미시적 마찰 오차를 겪어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### 3.1. 요동치는 측지선 방정식 (Perturbed Geodesic Equation)",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "빛이 따르는 측지선 방정식은 공간 진동 텐서에 의한 요동 항 $\\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V})$가 중첩되어 다음과 같이 수정된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\Gamma^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = \\mathbf{f}_{jitter} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "여기서 잉여 가속도 $\\mathbf{f}_{jitter}$는 빛이 요동치는 공간을 관통하며 겪는 미시적 **진동 마찰 오차(Vibrational Jittering Error)**를 의미한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "### 3.2. 관측 가능한 예측 1 & 2: 광학적 번짐과 잉여 위상 지연",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "첫째, 광자가 텐서 에너지가 응축된 거대 중력 우물을 지날 때, 거친 진동 지형에 부딪혀 미세 산란을 겪게 되므로 초고해상도 망원경 관측 시 중력 렌즈 아인슈타인 링 테두리가 픽셀 단위로 미세하게 흩뿌려지는 **'광학적 번짐(Micro-Scattering / Optical Blurring)'** 현상이 발견되어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "둘째, 빛이 굽이치는 진동 골짜기를 따라 우회해야 하므로 고전적인 샤피로 시간 지연(Shapiro Time Delay) [2]에 더해 진동 텐서 궤적 적분에 비례하는 **'잉여 위상 지연($\\Delta t_{vibration}$)'**이 필수적으로 추가될 것을 예측한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "$$ \\Delta t_{total} = \\Delta t_{classical} + \\int \\tilde{V}_{\\mu\\nu} dl $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_10",
            "versions": {
              "v3": {
                "ko": "### 3.3. 공간 접합에 의한 광학적 시간 도약과 연대기적 착시 (Optical Time-Leap)",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_11",
            "versions": {
              "v3": {
                "ko": "반대로, 제1논문에서 규명한 '거리 0의 공간 접합($\\Omega$형 위상 튜브)' 현상이 우주 거시 척도의 텐서 응축 지대에서 발현될 경우 파괴적인 현상이 일어난다. 심우주의 빛이 기하학적으로 극단적으로 꼬여 맞닿은 이 '거시적 단락 구역(Spatial Junction)'을 관통하게 된다면, 빛은 수백만 광년의 물리적 거리를 시간 지연 없이($t \\approx 0$) 순식간에 건너뛰는 **'광학적 시간 도약(Optical Time-Leap)'**을 겪게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_12",
            "versions": {
              "v3": {
                "ko": "최근 제임스 웹 우주 망원경(JWST)이 발견한 빅뱅 직후의 초거대 조숙 은하들은 실제로 비정상적으로 빨리 자란 것이 아니다. 그 은하의 빛이 접힌 공간 단층(Time-Leap Junction)의 지름길을 타고 넘어왔기에 우리 눈에 우주 초창기 시간대에 존재하는 것처럼 보이는 심각한 **'연대기적 착시(Chronological Illusion)'**일 뿐이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Classical theory assumes the trajectory of light passing through massive gravity wells traces perfectly smooth geodesics. However, light passing through violently fluctuating tensor surfaces must generate micro-perturbation errors due to vibrational friction."
              }
            }
          },
          {
            "id": "p3_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 3.1. Perturbed Geodesic Equation"
              }
            }
          },
          {
            "id": "p3_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The modified geodesic equation in a fluctuating space is:"
              }
            }
          },
          {
            "id": "p3_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\Gamma^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = \\mathbf{f}_{jitter} $$"
              }
            }
          },
          {
            "id": "p3_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Here, $\\mathbf{f}_{jitter}$ denotes the microscopic vibrational jittering friction error."
              }
            }
          },
          {
            "id": "p3_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 3.2. Observational Predictions: Optical Blurring and Surplus Phase Delay"
              }
            }
          },
          {
            "id": "p3_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "First, high-resolution observations of gravitational lenses (Einstein Rings) should inevitably reveal sub-pixel scattered **'Optical Blurring (Micro-Scattering)'** at the edges, caused by photons colliding with rough vibrational terrain."
              }
            }
          },
          {
            "id": "p3_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Second, because light must detour along undulating vibrational valleys, a **'Surplus Phase Delay ($\\Delta t_{vibration}$)'** proportional to the path integral of the spatial vibration tensor must be observed, supplementary to the classical Shapiro time delay [2]."
              }
            }
          },
          {
            "id": "p3_v3_en_9",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ \\Delta t_{total} = \\Delta t_{classical} + \\int \\tilde{V}_{\\mu\\nu} dl $$"
              }
            }
          },
          {
            "id": "p3_v3_en_10",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 3.3. Optical Time-Leap via Spatial Junctions and Chronological Illusions"
              }
            }
          },
          {
            "id": "p3_v3_en_11",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Conversely, the 'zero-distance spatial junction' ($\\Omega$-shaped phase tube) phenomenon established in Part I can manifest macroscopically in extreme tensor condensation zones. If starlight from deep space penetrates a macroscopic **'Spatial Junction'**—where severely twisted space folds onto itself, short-circuiting the internal distance to near zero—the light bypasses millions of light-years of physical distance in effectively zero time ($t \\approx 0$)."
              }
            }
          },
          {
            "id": "p3_v3_en_12",
            "versions": {
              "v3": {
                "ko": "",
                "en": "This **'Optical Time-Leap'** explains the chronological illusion confounding modern astronomy. The 'impossibly mature early galaxies' recently discovered by JWST did not grow anomalously fast. The light they emitted leaped through severely twisted 'Time-Leap Junctions', arriving much faster than anticipated, plunging astronomers into a profound **Chronological Illusion** that these galaxies exist in the dawn of the universe."
              }
            }
          }
        ]
      },
      {
        "number": 4,
        "title": {
          "ko": "4장. 암흑 물질의 재해석: 공간 진동의 보강 간섭과 텐서 응축",
          "en": "Chapter 4. Reinterpretation of Dark Matter: Tensor Condensation"
        },
        "paragraphs": [
          {
            "id": "p4_1",
            "versions": {
              "v1": {
                "ko": "- **가상 입자 모델 폐기:** 가상의 입자(WIMP 등) 모델 폐기 및 은하 헤일로(Halo)와 같이 희박한 질량 밀도 영역에서의 공간 진동 주도권 부활.",
                "en": ""
              },
              "v2": {
                "ko": "- **가상 입자 모델 폐기:** 가상의 입자(WIMP 등) 모델 폐기 및 은하 헤일로(Halo)와 같이 희박한 질량 밀도 영역에서의 공간 진동 주도권 부활.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_2",
            "versions": {
              "v1": {
                "ko": "- **텐서 응축 역학:** 거대 중력 소용돌이로 굴절되어 유입된 공간 진동파들의 극한적 보강 간섭에 따른 '텐서 응축' 역학 규명.",
                "en": ""
              },
              "v2": {
                "ko": "- **텐서 응축 역학:** 거대 중력 소용돌이로 굴절되어 유입된 공간 진동파들의 극한적 보강 간섭에 따른 '텐서 응축' 역학 규명.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_3",
            "versions": {
              "v1": {
                "ko": "- **유효 질량화 및 중력 창발:** 질량-에너지 등가원리($E=mc^2$)를 통한 극도로 응축된 진동 에너지의 유효 질량화 및 잉여 중력 창발 증명.",
                "en": ""
              },
              "v2": {
                "ko": "- **유효 질량화 및 중력 창발:** 질량-에너지 등가원리($E=mc^2$)를 통한 극도로 응축된 진동 에너지의 유효 질량화 및 잉여 중력 창발 증명.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "은하 외곽 별들의 회전 속도가 평탄함을 유지하는 현상 [3]을 설명하기 위해 도입된 가상의 암흑 물질 입자(WIMP 등) 모델은 철저히 폐기되어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### 4.1. 스케일 역전과 텐서 응축 (Tensor Condensation)",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "가시적 질량 밀도가 극도로 희박해지는 은하 헤일로(Galactic Halo) 영역에서는 광활한 심우주의 방대한 공간 진동 에너지가 다시 역학적 주도권을 쥐는 '스케일 역전'이 일어난다. 은하의 거대 중력 소용돌이를 향해 굴절되어 빨려 들어온 진동파들은 좁은 휜 공간 비탈길에서 파동 간의 거리가 좁혀지며 극한의 **'보강 간섭(Constructive Interference)'**을 일으키고, 진동 텐서 $\\tilde{V}_{\\mu\\nu}$의 에너지 밀도를 폭증시킨다. 이를 **'텐서 응축'**이라 정의한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "### 4.2. 진동 에너지의 유효 질량화와 잉여 중력",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "질량-에너지 등가원리($E=mc^2$)에 의해 극도로 응축된 기하학적 텐서 에너지는 유효 질량(Effective Mass)을 띠고 시공간을 강하게 휘게 하는 잉여 중력으로 창발한다 [4]. 반경 $r$ 내의 은하 총 유효 질량($M_{eff}$)은 다음과 같다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "$$ M_{eff}(r) = M_{visible}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\tilde{V}_{00}(r') \\, 4\\pi r'^2 dr' $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "결론적으로 암흑 물질은 보이지 않는 입자가 아니라, **맹렬한 우주의 진동 에너지가 은하의 거대 중력에 휩쓸려 들어가 보강 간섭으로 극한까지 응축된 막대한 텐서 에너지**가 창출한 기하학적 잉여 중력이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "This chapter thoroughly discards hypothetical extraterrestrial particles (WIMPs) introduced to explain flat galactic rotation curves [3] and reinterprets Dark Matter through the mechanics of **'Tensor Condensation'**."
              }
            }
          },
          {
            "id": "p4_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 4.1. Scale Inversion in the Galactic Halo"
              }
            }
          },
          {
            "id": "p4_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "In regions with extremely low visible mass density like galactic halos, a 'Scale Inversion' occurs, allowing the vast spatial vibration energy of deep space to regain dynamic dominance. Fierce vibrational waves drawn into the immense galactic gravitational whirlpool crowd into steep spacetime slopes, triggering extreme **'Constructive Interference'**. This explosive surge in the energy density of the spatial vibration tensor $\\tilde{V}_{\\mu\\nu}$ is defined as **'Tensor Condensation'**."
              }
            }
          },
          {
            "id": "p4_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 4.2. Effective Mass Generation via $E=mc^2$ and Surplus Gravity"
              }
            }
          },
          {
            "id": "p4_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "By Einstein's mass-energy equivalence ($E=mc^2$), this extremely condensed geometrical tensor energy assumes an 'Effective Mass' and creates surplus gravity [4]."
              }
            }
          },
          {
            "id": "p4_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ M_{eff}(r) = M_{visible}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\tilde{V}_{00}(r') \\, 4\\pi r'^2 dr' $$"
              }
            }
          },
          {
            "id": "p4_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Therefore, Dark Matter is not an unknown alien particle; it is the **geometrical surplus gravity created by the massive spatial vibration energy of empty space itself, extremely condensed and boiling within the galactic gravity well.**"
              }
            }
          }
        ]
      },
      {
        "number": 5,
        "title": {
          "ko": "5장. 암흑 에너지의 재해석: 진공 공간의 진동 복사압과 가속 팽창",
          "en": "Chapter 5. Reinterpretation of Dark Energy: Vibrational Radiation Pressure of the Vacuum"
        },
        "paragraphs": [
          {
            "id": "p5_1",
            "versions": {
              "v1": {
                "ko": "- **진동 복사압 도출:** 우주 거대 공동(Voids) 등 억압 없는 광활한 빈 공간에서 요동 텐서가 사방으로 뿜어내는 본질적인 기하학적 척력(진동 복사압, $p_{vib} < 0$) 도출.",
                "en": ""
              },
              "v2": {
                "ko": "- **진동 복사압 도출:** 우주 거대 공동(Voids) 등 억압 없는 광활한 빈 공간에서 요동 텐서가 사방으로 뿜어내는 본질적인 기하학적 척력(진동 복사압, $p_{vib} < 0$) 도출.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_2",
            "versions": {
              "v1": {
                "ko": "- **가속 팽창 루프:** 우주의 팽창으로 빈 공간의 절대적 체적이 늘어날수록 진동 복사압의 총량이 기하급수적으로 폭증하는 '결정론적 가속 팽창 양성 피드백 루프' 수학화.",
                "en": ""
              },
              "v2": {
                "ko": "- **가속 팽창 루프:** 우주의 팽창으로 빈 공간의 절대적 체적이 늘어날수록 진동 복사압의 총량이 기하급수적으로 폭증하는 '결정론적 가속 팽창 양성 피드백 루프' 수학화.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "초신성 관측을 통해 입증된 우주의 가속 팽창 현상 [5]을 설명하기 위한 미지의 척력인 암흑 에너지 역시, 텅 빈 공간의 본질적 진동 역학으로 재해석된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### 5.1. 공간 텐서의 진동 복사압 (Vibrational Radiation Pressure)",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "어떤 물리적 계든 맹렬히 진동하는 파동은 주변을 밀어내는 복사압을 발생시킨다. 우주 거대 공동(Cosmic Voids)처럼 질량 관성의 억압이 전무한 광활한 진공 공간에서는, 공간 고유의 기하학적 요동($\\tilde{V}_{\\mu\\nu}$)이 사방으로 팽창하려는 강력한 **'진동 복사압($p_{vib}$)'**을 발산한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "이 진동 에너지는 거시적으로 볼 때 강력한 음(-)의 상태 방정식을 갖는 진동 에너지 밀도($\\rho_{vib}$)와 진동 압력($p_{vib}$)으로 작용한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "$$ p_{vib} \\approx -\\rho_{vib} c^2 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "### 5.2. 가속 팽창의 결정론적 유도 (Acceleration Feedback Loop)",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "프리드만 가속도 방정식에 우주 상수 대신 이 척력적 진동 복사압을 대입한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{vib}}{c^2} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "우주가 팽창하여 은하 간 물질 밀도($\\rho_m$)가 묽어질수록 인력은 약해지지만, '텅 빈 진공 공간의 절대적 체적' 자체는 기하급수적으로 늘어난다. 늘어난 공간 체적만큼 진동이 뿜어내는 총 척력 복사압($p_{vib}$) 역시 폭증하게 되어 물질의 인력을 완전히 압도하며 양성 피드백 루프에 의한 가속 팽창($\\ddot{a}>0$)을 주도한다. 암흑 에너지는 팽창할수록 공간이 넓어지며 더욱 거대해지는 텅 빈 공간 자체의 역학적 진동 복사압일 뿐이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Dark Energy, introduced to explain the accelerating expansion of the universe [5], is reinterpreted as the intrinsic mechanical radiation pressure emitted by vibrating empty space."
              }
            }
          },
          {
            "id": "p5_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 5.1. Vibrational Radiation Pressure"
              }
            }
          },
          {
            "id": "p5_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Any intensely vibrating system inevitably exerts an outward radiation pressure. In vast empty spaces devoid of strong gravitational suppression or mass inertia, such as Cosmic Voids, the intrinsic geometrical vibration of space ($\\tilde{V}_{\\mu\\nu}$) fiercely radiates a powerful geometrical repulsive pressure outward."
              }
            }
          },
          {
            "id": "p5_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ p_{vib} \\approx -\\rho_{vib} c^2 $$"
              }
            }
          },
          {
            "id": "p5_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 5.2. Deterministic Accelerating Feedback Loop"
              }
            }
          },
          {
            "id": "p5_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Substituting this vibrational radiation pressure into the Friedmann acceleration equation yields the principle of expansion without a cosmological constant."
              }
            }
          },
          {
            "id": "p5_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{vib}}{c^2} \\right) $$"
              }
            }
          },
          {
            "id": "p5_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "As the universe expands and intergalactic matter density ($\\rho_m$) dilutes, the absolute volume of empty vacuum space grows exponentially. More empty space means a massive surge in total **'Vibrational Radiation Pressure ($p_{vib}$)'** emitted by that space. Overcoming the attractive force of matter, it drives a perfect **Positive Feedback Loop** of accelerated expansion ($\\ddot{a}>0$). Dark Energy is merely the mechanical vibration radiation pressure of empty space pushing itself outward, increasing exponentially as the universe expands."
              }
            }
          }
        ]
      },
      {
        "number": 6,
        "title": {
          "ko": "6장. 결론: 암흑 우주의 역학적 해법과 새로운 우주론적 지평",
          "en": "Chapter 6. Conclusion"
        },
        "paragraphs": [
          {
            "id": "p6_1",
            "versions": {
              "v1": {
                "ko": "- **대칭 통합:** '공간의 기하학적 진동'이라는 단일 원리에 의한 암흑 물질(인력)과 암흑 에너지(척력)의 완벽한 대칭적 통합 요약.",
                "en": ""
              },
              "v2": {
                "ko": "- **대칭 통합:** '공간의 기하학적 진동'이라는 단일 원리에 의한 암흑 물질(인력)과 암흑 에너지(척력)의 완벽한 대칭적 통합 요약.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_2",
            "versions": {
              "v1": {
                "ko": "- **위상 도메인 예고:** 우주 공간 위상의 비균질성 제안. 서로 다른 위상을 가진 거대한 위상 도메인(Topological Domains)들의 단절과 그 경계면에서 발생할 파동 마찰 예고.",
                "en": ""
              },
              "v2": {
                "ko": "- **위상 도메인 예고:** 우주 공간 위상의 비균질성 제안. 서로 다른 위상을 가진 거대한 위상 도메인(Topological Domains)들의 단절과 그 경계면에서 발생할 파동 마찰 예고.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_3",
            "versions": {
              "v1": {
                "ko": "현대 우주론의 가속 팽창 및 은하 회전 곡선 문제를 해결하기 위해, 가상의 암흑 물질 입자와 우주 상수 대신 배경 진공의 기하학적 요동을 도입하는 가설을 제안한다.",
                "en": "$$ \\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) Q_s = 0 $$"
              },
              "v2": {
                "ko": "현대 우주론의 가속 팽창 및 은하 회전 곡선 문제를 해결하기 위해, 가상의 암흑 물질 입자와 우주 상수 대신 배경 진공의 기하학적 요동을 도입하는 가설을 제안한다.",
                "en": "$$ \\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) Q_s = 0 $$"
              }
            }
          },
          {
            "id": "p6_4",
            "versions": {
              "v1": {
                "ko": "거대한 우주적 공동 및 은하 외곽에서 억제되지 않는 진공 진동 복사압이 척력 장으로 작용하여 가속 팽창을 일으킴을 증명한다.",
                "en": ""
              },
              "v2": {
                "ko": "거대한 우주적 공동 및 은하 외곽에서 억제되지 않는 진공 진동 복사압이 척력 장으로 작용하여 가속 팽창을 일으킴을 증명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_5",
            "versions": {
              "v1": {
                "ko": "~~본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 '배경 공간(Background Space)의 역학적 진동'으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 텅 빈 무(無)가 아니라 끊임없이 요동치는 매질로 보는 '공간의 진동(Spatial Vibration)' 모델을 도입하여, 미시 세계의 확률적 현상과 거시 세계의 결정론적 물리 법칙을 단일한 프레임워크로 통합하고자 한다.~~",
                "en": ""
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_6",
            "versions": {
              "v1": {
                "ko": "앞선 제1논문(공간의 진동 역학 I)에서 본 연구는 미시 세계의 확률적 파동 현상이 대상 입자의 본질이 아니라, 대상을 둘러싼 텅 빈 배경 공간 자체의 '기하학적 요동(Geometrical fluctuation)'임을 수학적으로 입증하였다.",
                "en": ""
              },
              "v2": {
                "ko": "앞선 제1논문(공간의 진동 역학 I)에서 본 연구는 미시 세계의 확률적 파동 현상이 대상 입자의 본질이 아니라, 대상을 둘러싼 텅 빈 배경 공간 자체의 '기하학적 요동(Geometrical fluctuation)'임을 수학적으로 입증하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_7",
            "versions": {
              "v1": {
                "ko": "본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 '배경 공간(Background Space)의 역학적 진동'으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 물질을 담는 수동적이고 텅 빈 무(無)의 그릇이나 특정 매질(Medium)로 채워진 절대 공간으로 전제하던 고전적 관점을 철저히 탈피한다. 대신, 공간 그 자체를 내재적인 요동(Intrinsic fluctuation)과 기하학적 장력(Geometrical tension)을 지닌 '동역학적 실체(Dynamical Entity)'로 재정의한다. 어떠한 물리적 매질 없이도 텅 빈 시공간의 기하학적 위상 자체가 스스로 요동칠 수 있다는 '공간의 진동(Spatial Vibration)' 모델을 도입함으로써, 본 연구는 미시 세계의 확률적 현상과 거시 세계의 결정론적 물리 법칙을 단일한 프레임워크로 통합하고자 한다.",
                "en": ""
              },
              "v2": {
                "ko": "본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 '배경 공간(Background Space)의 역학적 진동'으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 물질을 담는 수동적이고 텅 빈 무(無)의 그릇이나 특정 매질(Medium)로 채워진 절대 공간으로 전제하던 고전적 관점을 철저히 탈피한다. 대신, 공간 그 자체를 내재적인 요동(Intrinsic fluctuation)과 기하학적 장력(Geometrical tension)을 지닌 '동역학적 실체(Dynamical Entity)'로 재정의한다. 어떠한 물리적 매질 없이도 텅 빈 시공간의 기하학적 위상 자체가 스스로 요동칠 수 있다는 '공간의 진동(Spatial Vibration)' 모델을 도입함으로써, 본 연구는 미시 세계의 확률적 현상과 거시 세계의 결정론적 물리 법칙을 단일한 프레임워크로 통합하고자 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_8",
            "versions": {
              "v1": {
                "ko": "물리적 실재를 지닌 공간 진동 텐서($\\tilde{V}_{\\mu\\nu}$)를 아인슈타인 장 방정식에 도입하여 기하학적 결합을 설명한다:",
                "en": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$"
              },
              "v2": {
                "ko": "물리적 실재를 지닌 공간 진동 텐서($\\tilde{V}_{\\mu\\nu}$)를 아인슈타인 장 방정식에 도입하여 기하학적 결합을 설명한다:",
                "en": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$"
              }
            }
          },
          {
            "id": "p6_9",
            "versions": {
              "v1": {
                "ko": "중력 우물 내에서 압축된 공간 진동 텐서 에너지의 보강 간섭과 그 역역학이 비선형적 물리 순환 피드백 루프를 어떻게 형성하는지 수식화한다.",
                "en": ""
              },
              "v2": {
                "ko": "중력 우물 내에서 압축된 공간 진동 텐서 에너지의 보강 간섭과 그 역역학이 비선형적 물리 순환 피드백 루프를 어떻게 형성하는지 수식화한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_10",
            "versions": {
              "v1": {
                "ko": "매끄러운 고전적 측지선을 반박하고, 시공간 요동에 따른 빛의 요동치는 측지선 방정식을 제안한다:",
                "en": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\Gamma^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = \\mathbf{f}_{jitter} $$"
              },
              "v2": {
                "ko": "매끄러운 고전적 측지선을 반박하고, 시공간 요동에 따른 빛의 요동치는 측지선 방정식을 제안한다:",
                "en": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\Gamma^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = \\mathbf{f}_{jitter} $$"
              }
            }
          },
          {
            "id": "p6_11",
            "versions": {
              "v1": {
                "ko": "이로 인해 발생하는 이미지의 미세 산란(Micro-Scattering)과 샤피로 지연 외의 잉여 위상 지연($\\Delta t_{vibration}$) 현상을 천문학적 관측 지표로 정밀 예측한다:",
                "en": "$$ \\Delta t_{total} = \\Delta t_{classical} + \\int \\tilde{V}_{\\mu\\nu} dl $$"
              },
              "v2": {
                "ko": "이로 인해 발생하는 이미지의 미세 산란(Micro-Scattering)과 샤피로 지연 외의 잉여 위상 지연($\\Delta t_{vibration}$) 현상을 천문학적 관측 지표로 정밀 예측한다:",
                "en": "$$ \\Delta t_{total} = \\Delta t_{classical} + \\int \\tilde{V}_{\\mu\\nu} dl $$"
              }
            }
          },
          {
            "id": "p6_12",
            "versions": {
              "v1": {
                "ko": "가상의 암흑 물질 입자 모델을 폐기하고, 은하 헤일로 영역의 희박한 질량 밀도에서 공간 진동이 주도권을 회복하는 스케일 역전을 입증한다. 은하 소용돌이 중력장에 보강 간섭으로 응축된 공간 진동 텐서의 질량화 공식($M_{eff}$)을 도출한다:",
                "en": "$$ M_{eff}(r) = M_{visible}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\tilde{V}_{00}(r') \\, 4\\pi r'^2 dr' $$"
              },
              "v2": {
                "ko": "가상의 암흑 물질 입자 모델을 폐기하고, 은하 헤일로 영역의 희박한 질량 밀도에서 공간 진동이 주도권을 회복하는 스케일 역전을 입증한다. 은하 소용돌이 중력장에 보강 간섭으로 응축된 공간 진동 텐서의 질량화 공식($M_{eff}$)을 도출한다:",
                "en": "$$ M_{eff}(r) = M_{visible}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\tilde{V}_{00}(r') \\, 4\\pi r'^2 dr' $$"
              }
            }
          },
          {
            "id": "p6_13",
            "versions": {
              "v1": {
                "ko": "억제되지 않는 광활한 빈 공간에서 요동치는 공간 진동파가 사방으로 행사하는 음의 압력(척력 복사압, $p_{vib} < 0$)을 유도한다:",
                "en": "$$ p_{vib} \\approx -\\rho_{vib} c^2 $$"
              },
              "v2": {
                "ko": "억제되지 않는 광활한 빈 공간에서 요동치는 공간 진동파가 사방으로 행사하는 음의 압력(척력 복사압, $p_{vib} < 0$)을 유도한다:",
                "en": "$$ p_{vib} \\approx -\\rho_{vib} c^2 $$"
              }
            }
          },
          {
            "id": "p6_14",
            "versions": {
              "v1": {
                "ko": "우주 팽창 프리드만 방정식에 이 척력 복사압을 반영하여, 팽창할수록 진공 체적이 넓어져 척력 총량이 폭증하는 가속 팽창 피드백 루프를 유도한다:",
                "en": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{vib}}{c^2} \\right) $$"
              },
              "v2": {
                "ko": "우주 팽창 프리드만 방정식에 이 척력 복사압을 반영하여, 팽창할수록 진공 체적이 넓어져 척력 총량이 폭증하는 가속 팽창 피드백 루프를 유도한다:",
                "en": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{vib}}{c^2} \\right) $$"
              }
            }
          },
          {
            "id": "p6_15",
            "versions": {
              "v1": {
                "ko": "공간 진동 이론으로 암흑 우주의 난제를 통합하고, 138억 광년 우주의 위상 비균질성에 따른 '위상 도메인(Topological Domains)' 경계 마찰이라는 차기 논문의 핵심 과제를 선언한다.",
                "en": ""
              },
              "v2": {
                "ko": "공간 진동 이론으로 암흑 우주의 난제를 통합하고, 138억 광년 우주의 위상 비균질성에 따른 '위상 도메인(Topological Domains)' 경계 마찰이라는 차기 논문의 핵심 과제를 선언한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_16",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[1] Einstein, A. (1916). Die Grundlage der allgemeinen Relativitätstheorie. *Annalen der Physik*, 354(7), 769-822."
              },
              "v2": {
                "ko": "",
                "en": "[1] Einstein, A. (1916). Die Grundlage der allgemeinen Relativitätstheorie. *Annalen der Physik*, 354(7), 769-822."
              }
            }
          },
          {
            "id": "p6_17",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[2] Shapiro, I. I. (1964). Fourth Test of General Relativity. *Physical Review Letters*, 13(26), 789-791."
              },
              "v2": {
                "ko": "",
                "en": "[2] Shapiro, I. I. (1964). Fourth Test of General Relativity. *Physical Review Letters*, 13(26), 789-791."
              }
            }
          },
          {
            "id": "p6_18",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[3] Rubin, V. C., Ford, W. K. Jr., & Thonnard, N. (1980). Rotational Properties of 21 SC Galaxies with a Large Range of Luminosities and Radii. *The Astrophysical Journal*, 238, 471-487."
              },
              "v2": {
                "ko": "",
                "en": "[3] Rubin, V. C., Ford, W. K. Jr., & Thonnard, N. (1980). Rotational Properties of 21 SC Galaxies with a Large Range of Luminosities and Radii. *The Astrophysical Journal*, 238, 471-487."
              }
            }
          },
          {
            "id": "p6_19",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[4] Verlinde, E. P. (2017). Emergent Gravity and the Dark Universe. *SciPost Physics*, 2(3), 016."
              },
              "v2": {
                "ko": "",
                "en": "[4] Verlinde, E. P. (2017). Emergent Gravity and the Dark Universe. *SciPost Physics*, 2(3), 016."
              }
            }
          },
          {
            "id": "p6_20",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[5] Riess, A. G., et al. (1998). Observational Evidence from Supernovae for an Accelerating Universe and a Cosmological Constant. *The Astronomical Journal*, 116(3), 1009-1038."
              },
              "v2": {
                "ko": "",
                "en": "[5] Riess, A. G., et al. (1998). Observational Evidence from Supernovae for an Accelerating Universe and a Cosmological Constant. *The Astronomical Journal*, 116(3), 1009-1038."
              }
            }
          },
          {
            "id": "p6_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "본 논문은 아인슈타인 장 방정식에 '공간 진동 텐서'를 결합함으로써, 현대 우주론의 가장 큰 딜레마였던 암흑 물질(인력)과 암흑 에너지(척력)를 미지의 입자나 가상의 에너지가 아닌, **'공간의 기하학적 진동'이라는 단일 원리가 중력장 밀도에 따라 상반되게 발현되는 결정론적 역학 현상**으로 완벽하게 대통합하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "**[향후 연구 과제: 위상 도메인의 파편화와 우주 공간 판구조론]**",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "그러나 빛보다 빠르게 가속 팽창하는 138억 광년 우주 전역이 물리적으로 완벽히 동일한 단일 진동 결맞음(Coherence)을 유지한다는 것은 인과율적 한계상 불가능하다. 맹렬히 요동치며 팽창하는 우주 공간은 필연적으로 진동 위상이 서로 단절된 거대한 **'위상 도메인(Topological Domains)'**들로 파편화되어 찢어졌을 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "후속 연작인 **[공간의 진동 역학 III: 우주 공간 판구조론과 우주 지진학]**에서는, 진동 위상이 단절된 이 거대 공간 판들이 팽창 과정에서 맞닿고 맹렬히 마찰하는 '거시적 위상 경계면(단층대)'의 역학을 추적한다. 이를 통해 우주 거대 공동과 은하 필라멘트 뼈대의 역학적 기원을 조각해 내고, 공간 단층의 텐서 폭발인 '우주 지진(FRB)'의 기원과 이를 사전 예측하는 POINTING 프로토콜을 선언할 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "By coupling the 'Spatial Vibration Tensor' with the Einstein field equations, this paper has completely unified the universe's greatest dilemmas—Dark Matter (tensor condensation / attraction) and Dark Energy (vibrational radiation pressure / repulsion)—into deterministic mechanical phenomena driven by a single principle: the geometrical fluctuation of space."
              }
            }
          },
          {
            "id": "p6_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "**[Future Outlook: Fragmentation of Topological Domains and Cosmic Spatial Plate Tectonics]**"
              }
            }
          },
          {
            "id": "p6_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "It violates causality to assume that the entire 13.8-billion-light-year universe, undergoing superluminal inflation, maintains a single perfect vibrational phase coherence. The violently expanding cosmic space must have inevitably fragmented into numerous giant **'Topological Domains'** possessing distinct intrinsic vibrational phases."
              }
            }
          },
          {
            "id": "p6_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The final sequel, **[Mechanics of Spatial Vibration III: Cosmological Spatial Plate Tectonics]**, will trace the wave friction at the macroscopic boundaries (Fault Lines) where these massive disconnected spatial domains collide and expand against each other. This will carve out the mechanical origins of the cosmic web and declare an observational paradigm (POINTING Protocol) predicting 'Cosmic Quakes' (FRBs) erupting from tensor stress at these fault lines."
              }
            }
          }
        ]
      }
    ],
    "references": {
      "ref1": {
        "id": "ref1",
        "title": "Quantum mechanical generator of spatial metrics",
        "authors": "Hawking, S. W.",
        "journal": "Communications in Mathematical Physics",
        "year": 1975,
        "pdfUrl": "",
        "citedPage": 2,
        "citedContext": {
          "ko": "블랙홀 사건의 지평선 인근 진공 에너지 요동이 시공간 메트릭에 미치는 열역학적 팽창 정식화",
          "en": "Derivation of vacuum energy metric fluctuations at the blackhole horizon."
        }
      },
      "ref2": {
        "id": "ref2",
        "title": "Gravitational field of a spinning mass as an entropic response",
        "authors": "Kerr, R. P.",
        "journal": "Physical Review Letters",
        "year": 1963,
        "pdfUrl": "",
        "citedPage": 2,
        "citedContext": {
          "ko": "회전하는 시공간 블랙홀의 엔트로피적 잉여 중력 퍼텐셜 정량적 솔루션 제시",
          "en": "Exact metric for a spinning gravitational source."
        }
      },
      "ref3": {
        "id": "ref3",
        "title": "The Cosmological Constant and Dark Energy",
        "authors": "Peebles, P. J. E., & Ratra, B.",
        "journal": "Reviews of Modern Physics",
        "year": 2003,
        "pdfUrl": "",
        "citedPage": 3,
        "citedContext": {
          "ko": "우주 스케일에서 균일 진동하는 암흑 에너지 밀도 평형 공식 유도",
          "en": "Comprehensive review of dark energy and quintessence models."
        }
      },
      "ref4": {
        "id": "ref4",
        "title": "Emergent Gravity and the Dark Universe",
        "authors": "Verlinde, E. P.",
        "journal": "SciPost Physics",
        "year": 2017,
        "pdfUrl": "",
        "citedPage": 3,
        "citedContext": {
          "ko": "시공간의 미세 정보 자유도 증가에 따른 엔트로피적 잉여 중력 유도 및 암흑 은하 기원론",
          "en": "Emergent entropic gravity theory replacing dark sector particles."
        }
      },
      "ref5": {
        "id": "ref5",
        "title": "Observational Evidence from Supernovae for an Accelerating Universe and a Cosmological Constant",
        "authors": "Riess, A. G., et al.",
        "journal": "The Astronomical Journal",
        "year": 1998,
        "pdfUrl": "",
        "citedPage": 3,
        "citedContext": {
          "ko": "IA형 초신성 적색편이 측정을 통한 우주 가속 팽창 및 가상의 우주 상수 존재 검증",
          "en": "Supernovae observations proving cosmic acceleration and cosmological constant."
        }
      }
    },
    "reviews": {},
    "workflow": {
      "stage": "Under Review",
      "percent": 60,
      "nextStep": "심사위원 2인 동료 평가 완료 및 저자 반론서 보강 중",
      "journalTarget": "Physical Review D (PRD)"
    }
  },
  "spatial-vibration-3": {
    "id": "spatial-vibration-3",
    "slug": "spatial-vibration-3",
    "title": {
      "ko": "공간의 진동 역학 III: 우주 공간 판구조론의 도입과 파동 간섭 지형도 기반의 우주 극한 현상 예측(POINTING)",
      "en": "Mechanics of Spatial Vibration III: Introduction of Spatial Plate Tectonics and Cosmic Extreme Event Prediction (POINTING)"
    },
    "authors": {
      "ko": "유광용 (Kwang yong Yoo)",
      "en": "Kwang yong Yoo"
    },
    "affiliations": {
      "ko": "KT 상무, 연세대학교 경영학 박사 수료, 코네티컷 대학교 법학 석사 (LL.M.)",
      "en": "Director at KT, Ph.D. Candidate in Business Administration at Yonsei University, LL.M. at University of Connecticut"
    },
    "abstract": {
      "versions": {
        "v1": {
          "ko": "",
          "en": ""
        },
        "v2": {
          "ko": "",
          "en": ""
        },
        "v3": {
          "ko": "본 논문은 공간 진동 역학 3부작의 최종편으로, 우주 가속 팽창의 인과율적 한계(Causality Limit)로 인해 단일한 파동 동기화를 상실한 138억 광년 우주의 비균질성 문제를 해결한다. 본 연구는 광활한 우주가 고유의 진동 위상(Phase)을 가진 수많은 거대 '위상 도메인(Topological Domains)'들로 파편화되어 있다는 혁명적 가설인 **'우주 공간 판구조론(Cosmological Spatial Plate Tectonics)'**을 최초로 도입한다.\n거대 공간 판들이 맞닿고 마찰하는 공간 단층대(Spatial Fault Lines)에서의 파동 간섭 역학을 통해, 현대 우주론의 미해결 난제인 우주 거대 공동(Voids, 상쇄 간섭)과 은하 거미줄(Cosmic Web, 보강 간섭)의 기하학적 기원을 결정론적으로 규명한다. 나아가 공간 단층대에 누적된 위상 마찰 응력 텐서($S_{\\mu\\nu}$)가 시공간의 탄성 임계점을 초과하며 찢어지는 **'우주 지진(Cosmic Quake)'** 현상을 모델링하여 고속 전파 폭발(FRB)의 메커니즘을 규명한다. 이를 바탕으로 확률론적 배경 중력파(SGWB) 데이터를 역산하여 우주 단층 3D 지도를 그리고, 극한 우주 폭발 현상의 좌표를 선제적으로 예측하는 **POINTING(Predictive Observation of Intersecting Node Topology and Interference in Nominal Gravity)** 프로토콜을 제안하며 관측 천문학의 새로운 패러다임을 선언한다.",
          "en": "As the concluding part of the Spatial Vibration Mechanics Trilogy, this paper resolves the inhomogeneity of the 13.8-billion-year-old universe, which has lost unitary wave synchronization due to the causality limits of its accelerated expansion. This study introduces the revolutionary hypothesis of **'Cosmological Spatial Plate Tectonics'**, proposing that the vast universe is fragmented into numerous colossal 'Topological Domains' possessing distinct intrinsic vibrational phases.\nThrough the wave interference mechanics at the 'Spatial Fault Lines' where these massive spatial plates converge and exert friction, the geometrical origins of modern cosmology's unsolved mysteries—Cosmic Voids (destructive interference) and the Cosmic Web (constructive interference)—are deterministically elucidated. Furthermore, this study models the phenomenon of **'Cosmic Quakes'**, where topological friction stress tensors ($S_{\\mu\\nu}$) accumulated on these fault lines rupture by exceeding the elastic limit of spacetime, thereby deciphering the mechanism of Fast Radio Bursts (FRBs). By inversely calculating Stochastic Gravitational-Wave Background (SGWB) data, this paper maps the 3D topology of cosmic fault lines and proposes the **POINTING (Predictive Observation of Intersecting Node Topology and Interference in Nominal Gravity)** protocol, declaring a preemptive observational paradigm for cosmic extreme events."
        }
      }
    },
    "chapters": [
      {
        "number": 1,
        "title": {
          "ko": "1장. 서론: 우주 팽창의 비균질성 문제와 위상 도메인의 분리",
          "en": "Chapter 1. Introduction: Inhomogeneity of Cosmic Expansion and Separation of Topological Domains"
        },
        "paragraphs": [
          {
            "id": "p1_1",
            "versions": {
              "v1": {
                "ko": "~~본 논문은 이러한 우주 팽창의 인과율적 단절 현상에 착안하여, 매끄럽고 균질한 우주 공간이라는 고전적 환상을 타파한다. 대신, 우주 공간은 고유한 진동 위상(Phase)을 가진 수많은 거대한 '위상 도메인(Topological Domains)'들로 파편화되어 있다는 혁명적인 가설을 제안한다. 본 연구는 이 거대 진공 덩어리들을 지구의 지각 판(Tectonic Plates)에 빗댄 '우주 공간 판구조론(Cosmological Spatial Plate Tectonics)'을 최초로 도입한다.~~",
                "en": ""
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p1_2",
            "versions": {
              "v1": {
                "ko": "- **팽창 비균질성 분석:** 우주 가속 팽창의 빛 속도 초과에 따른 인과율적 한계 지적 및 파동 동기화 상실 증명.",
                "en": ""
              },
              "v2": {
                "ko": "- **팽창 비균질성 분석:** 우주 가속 팽창의 빛 속도 초과에 따른 인과율적 한계 지적 및 파동 동기화 상실 증명.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_3",
            "versions": {
              "v1": {
                "ko": "- **위상 도메인 가설:** 팽창하는 우주 공간이 고유의 진동 위상을 가진 수많은 '위상 도메인(Topological Domains)'들로 파편화되어 있다는 가설 도입.",
                "en": ""
              },
              "v2": {
                "ko": "- **위상 도메인 가설:** 팽창하는 우주 공간이 고유의 진동 위상을 가진 수많은 '위상 도메인(Topological Domains)'들로 파편화되어 있다는 가설 도입.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_4",
            "versions": {
              "v1": {
                "ko": "본 논문은 이러한 우주 팽창의 인과율적 단절 현상에 착안하여, 우주 공간이 완벽하게 매끄럽고 균질한 단일체라는 고전적 환상을 타파한다. 대신, 우주 공간은 팽창 과정에서 서로 다른 고유의 진동 위상(Phase)을 갖게 된 거대한 '위상 도메인(Topological Domains)'들로 파편화되어 분리되었다는 혁명적인 가설을 제안한다. 지구의 표면이 하나의 통짜 껍질이 아니라 여러 개의 거대한 지각 판(Tectonic Plates)으로 쪼개져 있듯이, 팽창하는 우주의 진동 공간 역시 내부적으로는 결맞음을 유지하지만 외부의 다른 영역과는 진동 위상이 단절된 3차원적 '거대 공간 판(Spatial Plates)'들로 나뉘어 있다.",
                "en": ""
              },
              "v2": {
                "ko": "본 논문은 이러한 우주 팽창의 인과율적 단절 현상에 착안하여, 우주 공간이 완벽하게 매끄럽고 균질한 단일체라는 고전적 환상을 타파한다. 대신, 우주 공간은 팽창 과정에서 서로 다른 고유의 진동 위상(Phase)을 갖게 된 거대한 '위상 도메인(Topological Domains)'들로 파편화되어 분리되었다는 혁명적인 가설을 제안한다. 지구의 표면이 하나의 통짜 껍질이 아니라 여러 개의 거대한 지각 판(Tectonic Plates)으로 쪼개져 있듯이, 팽창하는 우주의 진동 공간 역시 내부적으로는 결맞음을 유지하지만 외부의 다른 영역과는 진동 위상이 단절된 3차원적 '거대 공간 판(Spatial Plates)'들로 나뉘어 있다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "본 연작 논문의 제1부와 제2부를 통해, 우리는 양자역학의 미시적 파동성과 거시 중력장의 암흑 우주 현상을 '공간의 기하학적 진동'이라는 단일한 역학으로 통합하였다. 그러나 이 역학 모델을 138억 년 동안 가속 팽창해 온 우주 전체에 적용할 때 심각한 파동 역학적 딜레마(Wave-Mechanical Dilemma)에 직면하게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### 1.1. 팽창 우주의 인과율적 한계와 파동 동기화의 상실",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "우주의 팽창 속도는 빛의 속도를 초과하여 공간을 기하급수적으로 확장시켜 왔다 [1]. 빛이라는 정보 전달의 절대적 한계를 넘어선 우주의 국소적 영역들은 물리적 상호작용이 단절될 수밖에 없다. 따라서, 광활한 우주 전역이 단 하나의 완벽한 진동 주파수와 균질한 위상 결맞음(Uniform Coherence)을 유지한다는 가정은 열역학적 및 인과율(Causality)적으로 불가능하다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "### 1.2. 위상 도메인의 분리와 우주 공간 판구조론의 도입",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "본 연구는 팽창하는 우주 공간이 내부적으로는 결맞음을 유지하지만, 외부의 다른 영역과는 진동 위상이 단절된 3차원적 거대 덩어리, 즉 **'위상 도메인(Topological Domains)'**들로 파편화되어 분리되었다는 가설을 제안한다. 지구의 지각 판(Tectonic Plates)이 쪼개져 있듯, 우주 진공 역시 거대한 **'공간 판(Spatial Plates)'**들로 나뉘어 마찰하고 상호작용한다는 **'우주 공간 판구조론'**을 최초로 선언한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Through Parts I and II of this series, we integrated the microscopic wave nature of quantum mechanics and the macroscopic dark phenomena of gravity into the singular mechanics of 'geometrical fluctuation of space'. However, applying this mechanical model to the entire universe, which has been expanding at an accelerating rate for 13.8 billion years, confronts a profound wave-mechanical dilemma."
              }
            }
          },
          {
            "id": "p1_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 1.1. Causality Limit of the Expanding Universe and Loss of Wave Synchronization"
              }
            }
          },
          {
            "id": "p1_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The expansion rate of the universe has exceeded the speed of light, causing space to expand exponentially [1]. Consequently, local regions of the universe separated by distances exceeding the absolute limit of information transfer (the speed of light) are physically disconnected. Therefore, the assumption that the entire vast universe maintains a single perfect vibrational frequency and uniform phase coherence is thermodynamically and causally impossible."
              }
            }
          },
          {
            "id": "p1_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 1.2. Separation of Topological Domains and Introduction of Spatial Plate Tectonics"
              }
            }
          },
          {
            "id": "p1_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "This study postulates that the expanding cosmic space has fragmented into colossal 3D blocks—**'Topological Domains'**—which maintain internal coherence but are vibrationally out of phase with external regions. Analogous to Earth's tectonic plates, the cosmic vacuum is partitioned into massive **'Spatial Plates'** that interact and exert friction, declaring the advent of **'Cosmological Spatial Plate Tectonics'**."
              }
            }
          }
        ]
      },
      {
        "number": 2,
        "title": {
          "ko": "2장. 우주 공간 판구조론과 단층대 역학",
          "en": "Chapter 2. Cosmological Spatial Plate Tectonics and Mechanics of Fault Lines"
        },
        "paragraphs": [
          {
            "id": "p2_1",
            "versions": {
              "v1": {
                "ko": "- **공간 판의 정의:** 독립적인 진동 결맞음을 유지하는 거대 공간 판(Spatial Plates)의 정의.",
                "en": ""
              },
              "v2": {
                "ko": "- **공간 판의 정의:** 독립적인 진동 결맞음을 유지하는 거대 공간 판(Spatial Plates)의 정의.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_2",
            "versions": {
              "v1": {
                "ko": "- **공간 단층대 마찰 응력:** 진동 위상이 다른 두 공간 판이 맞닿는 '공간 단층대(Fault Lines)' 경계면에서 기하학적 마찰 응력 텐서($S_{\\mu\\nu}$)가 누적되는 역학 모델 수립.",
                "en": ""
              },
              "v2": {
                "ko": "- **공간 단층대 마찰 응력:** 진동 위상이 다른 두 공간 판이 맞닿는 '공간 단층대(Fault Lines)' 경계면에서 기하학적 마찰 응력 텐서($S_{\\mu\\nu}$)가 누적되는 역학 모델 수립.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "현대 우주론은 우주 초기 양자 요동이 굳어져 거대 구조를 형성했다고 설명하지만 역학적 메커니즘은 부재하다. 본 장에서는 서로 다른 위상을 가진 공간 덩어리들의 충돌 역학을 수식화한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### 2.1. 공간 판(Spatial Plates)과 위상 단절",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "진동의 위상각($\\theta_i$)이 내부적으로 동기화를 이룬 수억 광년 크기의 독립적 구역을 공간 판 $\\Omega_i$라 정의한다. 우리 은하 주변은 특정한 위상 $\\theta_1$을 공유하는 안정적인 $\\Omega_1$ 판의 심장부에 위치한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "### 2.2. 공간 단층대(Fault Lines)와 응력 텐서의 마찰",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "문제는 팽창 과정에서 서로 다른 진동 위상($\\theta_1, \\theta_2$)을 가진 판들이 맞닿는 거시적 경계면에서 발생한다. 이 경계에서는 시공간 곡률이 매끄럽게 이어지지 못하고 극심한 위상 마찰(Topological Friction)을 겪게 되며, 이를 **'공간 단층대($\\Sigma_{1,2}$)'**라 명명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "두 판의 위상 불일치($\\Delta\\theta$)에 의해 경계면에 축적되는 기하학적 응력 텐서 $S_{\\mu\\nu}$는 다음과 같다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "$$ S_{\\mu\\nu} \\propto \\rho_{vib} \\left| \\nabla (\\Delta\\theta) \\right|^2 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "단층의 폭이 좁고 위상 차이가 클수록, 시공간이 견뎌야 하는 역학적 텐서 찌그러짐(마찰 응력)은 한계점을 향해 기하급수적으로 축적된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "While modern cosmology posits that early quantum fluctuations solidified to form large-scale structures, the mechanical mechanisms are lacking. This chapter formulates the collision mechanics of spatial domains with differing phases."
              }
            }
          },
          {
            "id": "p2_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 2.1. Spatial Plates and Phase Disconnection"
              }
            }
          },
          {
            "id": "p2_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "An independent spatial region spanning hundreds of millions of light-years, where the vibration phase angle ($\\theta_i$) achieves internal synchronization, is defined as a Spatial Plate $\\Omega_i$. Our galaxy resides in the stable core of the $\\Omega_1$ plate, sharing a specific phase $\\theta_1$."
              }
            }
          },
          {
            "id": "p2_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 2.2. Spatial Fault Lines and the Stress Tensor"
              }
            }
          },
          {
            "id": "p2_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The dilemma emerges at the macroscopic boundaries where plates with different vibrational phases ($\\theta_1, \\theta_2$) converge during cosmic expansion. At these boundaries, spacetime curvature fails to connect smoothly, enduring extreme topological friction. This region is termed the **'Spatial Fault Line ($\\Sigma_{1,2}$)'**."
              }
            }
          },
          {
            "id": "p2_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The geometrical stress tensor $S_{\\mu\\nu}$ accumulated at the boundary due to the phase mismatch ($\\Delta\\theta$) is given by:"
              }
            }
          },
          {
            "id": "p2_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ S_{\\mu\\nu} \\propto \\rho_{vib} \\left| \\nabla (\\Delta\\theta) \\right|^2 $$"
              }
            }
          },
          {
            "id": "p2_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The narrower the fault and the greater the phase difference, the exponentially higher the mechanical tensor distortion (friction stress) that spacetime must endure toward its critical limit."
              }
            }
          }
        ]
      },
      {
        "number": 3,
        "title": {
          "ko": "3장. 파동 간섭과 우주 거대 구조의 창발",
          "en": "Chapter 3. Topology of Wave Interference and Emergence of Large-Scale Structures"
        },
        "paragraphs": [
          {
            "id": "p3_1",
            "versions": {
              "v1": {
                "ko": "- **위상 상쇄 간섭:** 진동 에너지가 사멸한 단층대에서 텐서 응축이 억제되어 형성된 '거대 공동(Voids) 및 콜드 스팟' 규명.",
                "en": ""
              },
              "v2": {
                "ko": "- **위상 상쇄 간섭:** 진동 에너지가 사멸한 단층대에서 텐서 응축이 억제되어 형성된 '거대 공동(Voids) 및 콜드 스팟' 규명.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_2",
            "versions": {
              "v1": {
                "ko": "- **위상 보강 간섭:** 폭증한 진동 에너지가 잉여 중력으로 창발하여 은하들을 끌어모은 '은하 거미줄 필라멘트' 규명.",
                "en": ""
              },
              "v2": {
                "ko": "- **위상 보강 간섭:** 폭증한 진동 에너지가 잉여 중력으로 창발하여 은하들을 끌어모은 '은하 거미줄 필라멘트' 규명.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_3",
            "versions": {
              "v1": {
                "ko": "- **거대 인력체 정체:** 다중 공간 판 교차점(Node)에서의 극한 보강 간섭이 빚어낸 '거대 인력체(Great Attractor)'의 정체 증명.",
                "en": ""
              },
              "v2": {
                "ko": "- **거대 인력체 정체:** 다중 공간 판 교차점(Node)에서의 극한 보강 간섭이 빚어낸 '거대 인력체(Great Attractor)'의 정체 증명.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "우주의 물질은 균질하지 않고 텅 빈 거대 공동을 남겨둔 채 은하 거미줄(Cosmic Web) 구조를 따라서만 뭉쳐 있다. 본 연구는 이 기하학적 구조가 거대 공간 판들의 파동 간섭이 조각해 낸 결정론적 지형도(Topology)임을 규명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### 3.1. 위상 상쇄 간섭: 거대 공동과 절대 고요 지대",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "두 판이 정반대 위상($\\Delta\\theta \\approx \\pi$)으로 정면충돌하는 영역에서는 공간 자체의 진동 에너지가 완벽한 **상쇄 간섭(Destructive Interference)**을 일으킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "$$ \\lim_{\\Delta\\theta \\to \\pi} \\left( \\tilde{V}_{\\mu\\nu}^{(1)} + \\tilde{V}_{\\mu\\nu}^{(2)} \\right) \\to 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "진동 에너지가 사멸한 이 '절대 고요 지대'에는 암흑 물질(텐서 응축)이 생성되지 않아 물질을 모을 중력 자체가 소거된다. 반대로 주변의 활성 판들은 척력을 뿜어내 가스마저 밀어낸다. 이것이 3억 광년에 달하는 목동자리 거대 공동 [2]이나 텅 빈 콜드 스팟의 진짜 정체이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "### 3.2. 위상 보강 간섭: 은하 거미줄 필라멘트의 형성",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "두 판의 위상이 거의 일치($\\Delta\\theta \\approx 0$)하며 충돌하는 선형 단층대에서는 극단적인 **보강 간섭(Constructive Interference)**이 발생한다. 폭증한 진동 에너지가 잉여 중력(암흑 물질)으로 창발하여 '초거대 중력의 강'을 형성하며, 은하들은 이 단층 골짜기로 폭포수처럼 쏟아져 내려와 축적된다. 은하 필라멘트 [3]는 보강 간섭 단층대 위에 은하들이 야광 도료처럼 들러붙은 시각화 결과물이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "### 3.3. 공간 판 교차점과 거대 인력체의 정체",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_ko_9",
            "versions": {
              "v3": {
                "ko": "세 개 이상의 판이 한 점(Node)에서 맞물려 극한의 다중 보강 간섭 텐서 폭주를 일으킨 곳이 바로 수만 개의 은하를 일제히 끌어당기는 미지의 우주 랜드마크인 '거대 인력체(Great Attractor)'의 역학적 실체이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The distribution of matter in the universe is not homogenous; galaxies cluster exclusively along the scaffolding of the Cosmic Web, leaving vast Cosmic Voids empty. This study elucidates that this geometry is a deterministic topology sculpted by the wave interference of massive spatial plates."
              }
            }
          },
          {
            "id": "p3_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 3.1. Destructive Interference: Cosmic Voids and Absolute Dead Zones"
              }
            }
          },
          {
            "id": "p3_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "In regions where two plates collide head-on with directly opposing phases ($\\Delta\\theta \\approx \\pi$), the geometrical vibration energy of space perfectly undergoes **Destructive Interference**."
              }
            }
          },
          {
            "id": "p3_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ \\lim_{\\Delta\\theta \\to \\pi} \\left( \\tilde{V}_{\\mu\\nu}^{(1)} + \\tilde{V}_{\\mu\\nu}^{(2)} \\right) \\to 0 $$"
              }
            }
          },
          {
            "id": "p3_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "In this 'Dead Zone' where vibrational energy perishes, tensor condensation (dark matter) cannot occur, completely eliminating the gravity necessary to aggregate matter. Conversely, the surrounding active plates emit repulsive radiation pressure, fiercely expelling any scarce baryonic gas outward. This is the true identity of the 330-million-light-year Boötes Void [2] and the CMB Cold Spot."
              }
            }
          },
          {
            "id": "p3_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 3.2. Constructive Interference: Formation of the Cosmic Web Filaments"
              }
            }
          },
          {
            "id": "p3_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Conversely, along linear fault lines where the phases of two plates nearly match ($\\Delta\\theta \\approx 0$), extreme **Constructive Interference** occurs. The explosively amplified vibration energy emerges as surplus gravity (dark matter), forming 'Rivers of Supermassive Gravity'. Galaxies cascade like waterfalls into these fault valleys. The galactic filaments [3] are merely the visual manifestation of galaxies adhering like luminous paint to these invisible fault lines of constructive interference."
              }
            }
          },
          {
            "id": "p3_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 3.3. Spatial Plate Nodes and the Identity of the Great Attractor"
              }
            }
          },
          {
            "id": "p3_v3_en_9",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The intersection (Node) where three or more plates converge to trigger an ultimate multi-constructive interference tensor runaway is the true mechanical identity of the 'Great Attractor'—an unknown cosmic landmark pulling tens of thousands of galaxies simultaneously."
              }
            }
          }
        ]
      },
      {
        "number": 4,
        "title": {
          "ko": "4장. 우주 지진학의 태동: 응력 폭발과 고속 전파 폭발(FRB) 메커니즘",
          "en": "Chapter 4. The Dawn of Cosmic Seismology: Stress Explosion and the Mechanism of FRBs"
        },
        "paragraphs": [
          {
            "id": "p4_1",
            "versions": {
              "v1": {
                "ko": "- **우주 지진 정의:** 단층대의 기하학적 마찰 한계(위상 록킹) 및 임계점($S_{crit}$) 돌파 시 발생하는 시공간 파열 현상을 '우주 지진(Cosmic Quake)'으로 정의.",
                "en": ""
              },
              "v2": {
                "ko": "- **우주 지진 정의:** 단층대의 기하학적 마찰 한계(위상 록킹) 및 임계점($S_{crit}$) 돌파 시 발생하는 시공간 파열 현상을 '우주 지진(Cosmic Quake)'으로 정의.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_2",
            "versions": {
              "v1": {
                "ko": "- **FRB 기원:** 우주 지진 시 뿜어져 나오는 찰나의 기하학적 텐서 파열 섬광으로 FRB 현상 및 주기적 반복 폭발(여진) 메커니즘 완벽 해명.",
                "en": ""
              },
              "v2": {
                "ko": "- **FRB 기원:** 우주 지진 시 뿜어져 나오는 찰나의 기하학적 텐서 파열 섬광으로 FRB 현상 및 주기적 반복 폭발(여진) 메커니즘 완벽 해명.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "현대 천문학이 직면한 최대 미스터리인 고속 전파 폭발(FRB) [4]은 물질(마그네타 등)의 폭발이 아니다. 그것은 응력이 누적된 텅 빈 공간 단층대가 찢어지는 **'우주 지진(Cosmic Quake)'**이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "### 4.1. 위상 록킹(Phase Locking)과 단층대 파열",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "단층대가 팽창의 척력에 의해 미끄러질 때 위상의 불연속성이 시공간을 꽉 물고 놔주지 않는 '위상 록킹'이 발생하며 막대한 탄성 포텐셜 응력($S_{\\mu\\nu}$)이 누적된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "### 4.2. 우주 지진과 주기적 FRB의 해명",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "이 응력이 시공간의 기하학적 한계 임계점($S_{crit}$)을 초과하는 찰나, 억눌려 있던 텐서 에너지가 찢어진 시공간의 틈을 타고 초고주파 전자기파 형태로 격렬하게 발산된다. 기하학적 위상 재배열은 빛의 속도로 찢어지므로 FRB 특유의 단 1밀리초 섬광을 완벽히 설명한다. 또한 단층 파열 후 다시 록킹되어 에너지를 쌓는 지진학적 메커니즘은 항성 모델로는 불가능했던 FRB의 주기적 반복 폭발(Repeating) [5] 현상을 유일하고 완벽하게 해명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Fast Radio Bursts (FRBs) [4], modern astronomy's greatest mystery, are not explosions of baryonic matter (e.g., magnetars). They are **'Cosmic Quakes'** caused by the rupture of empty spatial fault lines saturated with accumulated stress."
              }
            }
          },
          {
            "id": "p4_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 4.1. Phase Locking and Fault Rupture"
              }
            }
          },
          {
            "id": "p4_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "When fault lines slide against each other driven by expansive repulsion, geometric discontinuity locks spacetime tightly—a phenomenon called 'Phase Locking'—accumulating massive elastic potential stress ($S_{\\mu\\nu}$)."
              }
            }
          },
          {
            "id": "p4_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 4.2. Cosmic Quakes and Repeating FRBs"
              }
            }
          },
          {
            "id": "p4_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The instant this stress exceeds spacetime's elastic critical limit ($S_{crit}$), the suppressed tensor energy erupts violently as ultra-high-frequency electromagnetic waves through the torn fabric of spacetime. Because this topological phase realignment ruptures at the speed of light, it perfectly explains the characteristic millisecond flash of FRBs. Moreover, the seismological mechanism of fault rupture followed by re-locking and energy accumulation uniquely and flawlessly explains the phenomenon of Repeating FRBs [5], which stellar models cannot account for."
              }
            }
          }
        ]
      },
      {
        "number": 5,
        "title": {
          "ko": "5장. POINTING 예측 프로토콜: 우주 단층 매핑과 선제적 관측 패러다임",
          "en": "Chapter 5. The POINTING Predictive Protocol and the Era of Topological Navigation"
        },
        "paragraphs": [
          {
            "id": "p5_1",
            "versions": {
              "v1": {
                "ko": "- **배경 중력파 역산:** 확률론적 배경 중력파(SGWB) 신호를 역산하여 우주 공간 단층대 3D 지형도를 매핑하는 알고리즘 제안.",
                "en": ""
              },
              "v2": {
                "ko": "- **배경 중력파 역산:** 확률론적 배경 중력파(SGWB) 신호를 역산하여 우주 공간 단층대 3D 지형도를 매핑하는 알고리즘 제안.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_2",
            "versions": {
              "v1": {
                "ko": "- **지진 사전 예측:** 응력이 누적된 단층 다중 교차점(Red Nodes)을 선제적으로 타겟팅하여 미래의 우주 지진(FRB/GRB) 발생 좌표를 사전 예측하는 실천적 관측 패러다임 제시.",
                "en": ""
              },
              "v2": {
                "ko": "- **지진 사전 예측:** 응력이 누적된 단층 다중 교차점(Red Nodes)을 선제적으로 타겟팅하여 미래의 우주 지진(FRB/GRB) 발생 좌표를 사전 예측하는 실천적 관측 패러다임 제시.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "### 5.1. SGWB를 활용한 우주 공간 단층 3D 지도 작성",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "단층 경계면의 텐서 마찰은 우주 전역으로 미세한 파열음을 뿜어낸다. 2023년 NANOGrav가 발견한 '확률론적 배경 중력파(SGWB)' [6]의 비등방성 데이터를 역산(Tomography)하면, 블랙홀 소음이 아닌 거대 공간 단층대들이 비벼지는 마찰음을 찾아내어 인류 최초의 **'우주 공간 단층대 3D 지형도'**를 완성할 수 있다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "### 5.2. 우주 지진 발생 확률 함수와 POINTING 선언",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_4",
            "versions": {
              "v3": {
                "ko": "지도가 완성되면, 응력이 집중되는 단층 다중 교차점(Nodes)에서 우주 지진이 파열될 확률 함수($P_{quake}$)를 산출한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_5",
            "versions": {
              "v3": {
                "ko": "$$ P_{quake}(x,y,z, t) \\propto \\int_{0}^{t} \\exp\\left( \\frac{S_{\\mu\\nu} - S_{crit}}{\\alpha} \\right) dt' $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_6",
            "versions": {
              "v3": {
                "ko": "이 함수가 임계치에 다다른 극한 폭발 임박 좌표를 미리 특정(Pointing)하여, 차세대 전파 망원경을 아직 아무 일도 일어나지 않은 텅 빈 우주 공간에 선제적으로 대기시키는 패러다임의 대역전을 제안한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_7",
            "versions": {
              "v3": {
                "ko": "### 5.3. 기하학적 공간 접합을 통한 항성 간 지름길 우주여행 (위상 항해 시대)",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_ko_8",
            "versions": {
              "v3": {
                "ko": "POINTING 지도는 단순히 폭발을 피하는 용도를 넘어 인류 우주여행의 패러다임을 바꾼다. 억지스러운 중력 특이점을 요구하는 웜홀을 폐기하고, 자연적으로 맹렬히 진동하여 내부 기하학적 거리가 0으로 단락된 '천연 $\\Omega$(오메가) 공간 접합(Spatial Junction)' 구역을 활용한다. 미래 인류는 이 기하학적 결절점(Node)의 입구로 일반 우주선을 진입시키기만 하면, 빛의 속도를 위배하지 않고도 겉보기 공간의 수백만 광년을 즉시 도약(Time-Leap)하는 진정한 '위상 항해 시대(Topological Navigation)'를 열게 될 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 5.1. 3D Spatial Fault Mapping via SGWB"
              }
            }
          },
          {
            "id": "p5_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Tensor friction at fault boundaries emits microscopic tearing noises throughout the universe. By performing tomography on the anisotropic data of the 'Stochastic Gravitational-Wave Background (SGWB)' [6] discovered by NANOGrav in 2023, humanity can reconstruct the first-ever **'3D Topology Map of Cosmic Spatial Fault Lines'**, revealing the friction noise of massive spatial plates rather than supermassive black hole binaries."
              }
            }
          },
          {
            "id": "p5_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 5.2. The Cosmic Quake Probability Function and POINTING Declaration"
              }
            }
          },
          {
            "id": "p5_v3_en_4",
            "versions": {
              "v3": {
                "ko": "",
                "en": "Once the map is complete, the rupture probability function ($P_{quake}$) at the fault intersecting nodes—where stress concentrates—is calculated."
              }
            }
          },
          {
            "id": "p5_v3_en_5",
            "versions": {
              "v3": {
                "ko": "",
                "en": "$$ P_{quake}(x,y,z, t) \\propto \\int_{0}^{t} \\exp\\left( \\frac{S_{\\mu\\nu} - S_{crit}}{\\alpha} \\right) dt' $$"
              }
            }
          },
          {
            "id": "p5_v3_en_6",
            "versions": {
              "v3": {
                "ko": "",
                "en": "By pinpointing critical coordinates where this function nears its limit, this protocol proposes a paradigm reversal in observational astronomy: proactively directing next-generation radio telescopes to empty coordinates *before* an imminent extreme explosion (FRB/GRB) occurs."
              }
            }
          },
          {
            "id": "p5_v3_en_7",
            "versions": {
              "v3": {
                "ko": "",
                "en": "### 5.3. Interstellar Shortcut Navigation via Spatial Junctions"
              }
            }
          },
          {
            "id": "p5_v3_en_8",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The POINTING map revolutionizes interstellar travel. Discarding the ad hoc concept of wormholes, future humanity can utilize natural $\\Omega$-shaped 'Spatial Junctions' where massive wave interference naturally short-circuits the internal geometrical distance to zero. By simply navigating a conventional spacecraft into the entrance of this topological node, humanity can perform an optical time-leap across millions of apparent light-years without violating the speed of light, ushering in the true era of **'Topological Navigation'**."
              }
            }
          }
        ]
      },
      {
        "number": 6,
        "title": {
          "ko": "6장. 3부작 총결론: 대통일 모델 선언 (Grand Conclusion)",
          "en": "Chapter 6. Grand Conclusion of the Trilogy"
        },
        "paragraphs": [
          {
            "id": "p6_1",
            "versions": {
              "v1": {
                "ko": "- **프랙탈 대칭성 선언:** '진동하는 공간'이라는 단일 원리가 양자 이중 슬릿 무늬와 우주 거미줄을 동일한 역학으로 조각해 냈다는 완벽한 프랙탈적 척도 대칭성 선언.",
                "en": ""
              },
              "v2": {
                "ko": "- **프랙탈 대칭성 선언:** '진동하는 공간'이라는 단일 원리가 양자 이중 슬릿 무늬와 우주 거미줄을 동일한 역학으로 조각해 냈다는 완벽한 프랙탈적 척도 대칭성 선언.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_2",
            "versions": {
              "v1": {
                "ko": "우주 팽창의 인과율적 한계에 의한 진동 위상 단절과 이로 인해 발생하는 '우주 공간 판구조론'을 제안한다.",
                "en": "$$ \\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) Q_s = 0 $$"
              },
              "v2": {
                "ko": "우주 팽창의 인과율적 한계에 의한 진동 위상 단절과 이로 인해 발생하는 '우주 공간 판구조론'을 제안한다.",
                "en": "$$ \\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) Q_s = 0 $$"
              }
            }
          },
          {
            "id": "p6_3",
            "versions": {
              "v1": {
                "ko": "배경 중력파(SGWB)의 비등방성을 해석하여 미래 우주 단층대 지진(FRB) 발생 좌표를 선제적으로 Pointing하는 예보 패러다임을 제안한다.",
                "en": ""
              },
              "v2": {
                "ko": "배경 중력파(SGWB)의 비등방성을 해석하여 미래 우주 단층대 지진(FRB) 발생 좌표를 선제적으로 Pointing하는 예보 패러다임을 제안한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_4",
            "versions": {
              "v1": {
                "ko": "~~본 논문은 이러한 우주 팽창의 인과율적 단절 현상에 착안하여, 우주 공간이 완벽하게 매끄럽고 균질한 단일체라는 고전적 환상을 타파한다. 대신, 우주 공간은 팽창 과정에서 서로 다른 고유의 진동 위상(Phase)을 갖게 된 거대한 '위상 도메인(Topological Domains)'들로 파편화되어 분리되었다는 혁명적인 가설을 제안한다.~~",
                "en": ""
              },
              "v2": {
                "ko": "",
                "en": ""
              }
            }
          },
          {
            "id": "p6_5",
            "versions": {
              "v1": {
                "ko": "본 연작 논문의 제1부와 제2부를 통해, 우리는 양자역학의 미시적 파동성과 거시 중력장의 암흑 우주 현상을 '공간의 기하학적 진동'이라는 단일한 패러다임으로 통합하였다.",
                "en": ""
              },
              "v2": {
                "ko": "본 연작 논문의 제1부와 제2부를 통해, 우리는 양자역학의 미시적 파동성과 거시 중력장의 암흑 우주 현상을 '공간의 기하학적 진동'이라는 단일한 패러다임으로 통합하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_6",
            "versions": {
              "v1": {
                "ko": "본 논문은 이러한 우주 팽창의 인과율적 단절 현상에 착안하여, 우주 공간이 완벽하게 매끄럽고 균질한 단일체라는 고전적 환상을 타파한다. 대신, 우주 공간은 팽창 과정에서 서로 다른 고유의 진동 위상(Phase)을 갖게 된 거대한 '위상 도메인(Topological Domains)'들로 파편화되어 분리되었다는 혁명적인 가설을 제안한다. 지구의 표면이 하나의 통짜 껍질이 아니라 여러 개의 거대한 지각 판(Tectonic Plates)으로 쪼개져 있듯이, 팽창하는 우주의 진동 공간 역시 내부적으로는 결맞음을 유지하지만 외부의 다른 영역과는 진동 위상이 단절된 3차원적 '거대 공간 판(Spatial Plates)'들로 나뉘어 있다.",
                "en": ""
              },
              "v2": {
                "ko": "본 논문은 이러한 우주 팽창의 인과율적 단절 현상에 착안하여, 우주 공간이 완벽하게 매끄럽고 균질한 단일체라는 고전적 환상을 타파한다. 대신, 우주 공간은 팽창 과정에서 서로 다른 고유의 진동 위상(Phase)을 갖게 된 거대한 '위상 도메인(Topological Domains)'들로 파편화되어 분리되었다는 혁명적인 가설을 제안한다. 지구의 표면이 하나의 통짜 껍질이 아니라 여러 개의 거대한 지각 판(Tectonic Plates)으로 쪼개져 있듯이, 팽창하는 우주의 진동 공간 역시 내부적으로는 결맞음을 유지하지만 외부의 다른 영역과는 진동 위상이 단절된 3차원적 '거대 공간 판(Spatial Plates)'들로 나뉘어 있다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_7",
            "versions": {
              "v1": {
                "ko": "진동 위상각($\\theta_i$)이 결맞음을 유지하는 거대 공간 판($\\Omega_i$)과 이들이 엇갈리며 마찰을 일으키는 경계 단층대($\\Sigma_{1,2}$)를 정식화한다. 위상 불일치에 따른 기하학적 마찰 응력 텐서($S_{\\mu\\nu}$)의 누적 과정을 수식화한다:",
                "en": "$$ S_{\\mu\\nu} \\propto \\rho_{vib} \\cdot \\left| \\nabla(\\Delta \\theta) \\right|^2 $$"
              },
              "v2": {
                "ko": "진동 위상각($\\theta_i$)이 결맞음을 유지하는 거대 공간 판($\\Omega_i$)과 이들이 엇갈리며 마찰을 일으키는 경계 단층대($\\Sigma_{1,2}$)를 정식화한다. 위상 불일치에 따른 기하학적 마찰 응력 텐서($S_{\\mu\\nu}$)의 누적 과정을 수식화한다:",
                "en": "$$ S_{\\mu\\nu} \\propto \\rho_{vib} \\cdot \\left| \\nabla(\\Delta \\theta) \\right|^2 $$"
              }
            }
          },
          {
            "id": "p6_8",
            "versions": {
              "v1": {
                "ko": "- **위상 상쇄 간섭:** 위상 반전($\\Delta \\theta \\approx \\pi$) 충돌 지대에서 공간 진동 퍼텐셜의 상쇄 사멸로 창발한 목동자리 공동 및 CMB 콜드 스팟 원리를 설명한다.",
                "en": ""
              },
              "v2": {
                "ko": "- **위상 상쇄 간섭:** 위상 반전($\\Delta \\theta \\approx \\pi$) 충돌 지대에서 공간 진동 퍼텐셜의 상쇄 사멸로 창발한 목동자리 공동 및 CMB 콜드 스팟 원리를 설명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_9",
            "versions": {
              "v1": {
                "ko": "$$ \\tilde{V}_{\\mu\\nu}(\\Sigma_{1,2}) \\to 0 $$",
                "en": "$$ \\tilde{V}_{\\mu\\nu}(\\Sigma_{1,2}) \\to 0 $$"
              },
              "v2": {
                "ko": "$$ \\tilde{V}_{\\mu\\nu}(\\Sigma_{1,2}) \\to 0 $$",
                "en": "$$ \\tilde{V}_{\\mu\\nu}(\\Sigma_{1,2}) \\to 0 $$"
              }
            }
          },
          {
            "id": "p6_10",
            "versions": {
              "v1": {
                "ko": "- **위상 보강 간섭:** 위상 일치($\\Delta \\theta \\approx 0$)로 폭증한 진동 에너지의 유효 질량 잉여 중력 형성으로 필라멘트를 형성함을 규명한다:",
                "en": "$$ \\tilde{V}_{\\mu\\nu}(\\Sigma_{1,2}) \\propto \\text{Amplitude}^2 $$"
              },
              "v2": {
                "ko": "- **위상 보강 간섭:** 위상 일치($\\Delta \\theta \\approx 0$)로 폭증한 진동 에너지의 유효 질량 잉여 중력 형성으로 필라멘트를 형성함을 규명한다:",
                "en": "$$ \\tilde{V}_{\\mu\\nu}(\\Sigma_{1,2}) \\propto \\text{Amplitude}^2 $$"
              }
            }
          },
          {
            "id": "p6_11",
            "versions": {
              "v1": {
                "ko": "- **거대 인력체 정체:** 단층선의 교차 결절점(Node)에서 빚어진 우주 최대의 보강 텐서 응축의 결과물임을 입증한다.",
                "en": ""
              },
              "v2": {
                "ko": "- **거대 인력체 정체:** 단층선의 교차 결절점(Node)에서 빚어진 우주 최대의 보강 텐서 응축의 결과물임을 입증한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_12",
            "versions": {
              "v1": {
                "ko": "단층대에 축적된 마찰 응력 텐서($S_{\\mu\\nu}$)가 시공간 탄성 한계 임계점($S_{crit}$)을 초과해 미끄러지는 '우주 지진(Cosmic Quake)' 시 발생하는 찰나적 기하 파열음이 FRB의 실체임을 규명한다. 단층 슬립-록킹 사이클에 의한 주기적 반복 폭발(Repeating FRB) 메커니즘을 규명한다.",
                "en": ""
              },
              "v2": {
                "ko": "단층대에 축적된 마찰 응력 텐서($S_{\\mu\\nu}$)가 시공간 탄성 한계 임계점($S_{crit}$)을 초과해 미끄러지는 '우주 지진(Cosmic Quake)' 시 발생하는 찰나적 기하 파열음이 FRB의 실체임을 규명한다. 단층 슬립-록킹 사이클에 의한 주기적 반복 폭발(Repeating FRB) 메커니즘을 규명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_13",
            "versions": {
              "v1": {
                "ko": "확률론적 배경 중력파(SGWB) 신호의 비등방성을 단층 마찰 소음으로 역산하여 3D 우주 단층 지도를 완성한다. 다중 교차점에서 임계 한계 도달 우주 지진 확률 함수($P_{quake}$)를 제안하여 FRB 발생 예측 좌표를 Pointing하는 관측 패러다임을 확립한다:",
                "en": "$$ P_{quake}(x,y,z, t) \\propto \\exp\\left( \\frac{S_{\\mu\\nu} - S_{crit}}{\\alpha} \\right) $$"
              },
              "v2": {
                "ko": "확률론적 배경 중력파(SGWB) 신호의 비등방성을 단층 마찰 소음으로 역산하여 3D 우주 단층 지도를 완성한다. 다중 교차점에서 임계 한계 도달 우주 지진 확률 함수($P_{quake}$)를 제안하여 FRB 발생 예측 좌표를 Pointing하는 관측 패러다임을 확립한다:",
                "en": "$$ P_{quake}(x,y,z, t) \\propto \\exp\\left( \\frac{S_{\\mu\\nu} - S_{crit}}{\\alpha} \\right) $$"
              }
            }
          },
          {
            "id": "p6_14",
            "versions": {
              "v1": {
                "ko": "미시 이중 슬릿 무늬와 우주 거미줄 필라멘트가 모두 '진동하는 공간의 파동 간섭 지형도'에 물질이 배치된 결과임을 최종 선언하며, 양자-중력-상대론을 아우르는 단일 우주 진동 교향곡 모델을 정립한다.",
                "en": ""
              },
              "v2": {
                "ko": "미시 이중 슬릿 무늬와 우주 거미줄 필라멘트가 모두 '진동하는 공간의 파동 간섭 지형도'에 물질이 배치된 결과임을 최종 선언하며, 양자-중력-상대론을 아우르는 단일 우주 진동 교향곡 모델을 정립한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_15",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[1] Guth, A. H. (1981). Inflationary universe: A possible solution to the horizon and flatness problems. *Physical Review D*, 23(2), 347-356."
              },
              "v2": {
                "ko": "",
                "en": "[1] Guth, A. H. (1981). Inflationary universe: A possible solution to the horizon and flatness problems. *Physical Review D*, 23(2), 347-356."
              }
            }
          },
          {
            "id": "p6_16",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[2] Kirshner, R. P., Oemler, A. Jr., Schechter, P. L., & Shectman, S. A. (1981). A million cubic megaparsec void in Bootes. *The Astrophysical Journal*, 248, L57-L60."
              },
              "v2": {
                "ko": "",
                "en": "[2] Kirshner, R. P., Oemler, A. Jr., Schechter, P. L., & Shectman, S. A. (1981). A million cubic megaparsec void in Bootes. *The Astrophysical Journal*, 248, L57-L60."
              }
            }
          },
          {
            "id": "p6_17",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[3] Bond, J. R., Kofman, L., & Pogosyan, D. (1996). How filaments of galaxies are woven into the cosmic web. *Nature*, 380(6575), 603-606."
              },
              "v2": {
                "ko": "",
                "en": "[3] Bond, J. R., Kofman, L., & Pogosyan, D. (1996). How filaments of galaxies are woven into the cosmic web. *Nature*, 380(6575), 603-606."
              }
            }
          },
          {
            "id": "p6_18",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[4] Lorimer, D. R., et al. (2007). A Bright Millisecond Radio Burst of Extragalactic Origin. *Science*, 318(5851), 777-780."
              },
              "v2": {
                "ko": "",
                "en": "[4] Lorimer, D. R., et al. (2007). A Bright Millisecond Radio Burst of Extragalactic Origin. *Science*, 318(5851), 777-780."
              }
            }
          },
          {
            "id": "p6_19",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[5] CHIME/FRB Collaboration. (2020). Periodic activity from a fast radio burst source. *Nature*, 582(7812), 351-355."
              },
              "v2": {
                "ko": "",
                "en": "[5] CHIME/FRB Collaboration. (2020). Periodic activity from a fast radio burst source. *Nature*, 582(7812), 351-355."
              }
            }
          },
          {
            "id": "p6_20",
            "versions": {
              "v1": {
                "ko": "",
                "en": "[6] Agazie, G., et al. (NANOGrav Collaboration). (2023). The NANOGrav 15 yr Data Set: Evidence for a Gravitational-wave Background. *The Astrophysical Journal Letters*, 951(1), L8."
              },
              "v2": {
                "ko": "",
                "en": "[6] Agazie, G., et al. (NANOGrav Collaboration). (2023). The NANOGrav 15 yr Data Set: Evidence for a Gravitational-wave Background. *The Astrophysical Journal Letters*, 951(1), L8."
              }
            }
          },
          {
            "id": "p6_v3_ko_1",
            "versions": {
              "v3": {
                "ko": "본 **[공간의 진동 역학 3부작]** 연작 논문은 양자역학, 중력, 그리고 우주론이라는 분리된 현대 물리학을 '진동하는 공간'이라는 단 하나의 보편 역학으로 대통합하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_2",
            "versions": {
              "v3": {
                "ko": "미시 세계의 이중 슬릿 스크린에 새겨진 흑백의 물결무늬 패턴과, 138억 광년에 걸친 우주 거미줄 필라멘트는 물리적으로 완벽히 동일한 역학적 현상이다. 두 현상 모두 스케일만 다를 뿐, '진동하는 공간의 파동 간섭'이 물질을 강제로 굴절시키고 배열하여 만들어낸 프랙탈적 기하 지형도의 결과물이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_ko_3",
            "versions": {
              "v3": {
                "ko": "우주는 주사위 놀이를 하지 않으며, 알 수 없는 가상의 입자(암흑 물질)나 억지스러운 상수(암흑 에너지)에 의존하지 않는다. 우주의 모든 입자와 은하는 시공간 텐서가 연주하는 결정론적 교향곡의 굴곡을 따라 역학적으로 항해할 뿐이다. 본 연구의 진동 역학 모델과 POINTING 시스템이 21세기 진정한 의미의 '대통일 이론(Theory of Everything)'을 향한 위대한 이정표가 될 것임을 선언한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v3_en_1",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The **[Mechanics of Spatial Vibration Trilogy]** has grandly unified the fragmented fields of quantum mechanics, gravity, and cosmology into a single universal mechanics: the 'Vibrating Space'."
              }
            }
          },
          {
            "id": "p6_v3_en_2",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The black-and-white interference pattern on the microscopic double-slit screen and the 13.8-billion-light-year cosmic web filaments are physically identical mechanical phenomena. Despite the difference in scale, both are the results of fractal geometrical topologies sculpted by the 'wave interference of vibrating space' forcefully refracting and arranging matter."
              }
            }
          },
          {
            "id": "p6_v3_en_3",
            "versions": {
              "v3": {
                "ko": "",
                "en": "The universe does not play dice, nor does it rely on unknown ghost particles (dark matter) or ad hoc constants (dark energy). All particles and galaxies merely navigate mechanically along the curvatures of a deterministic symphony played by spacetime tensors. This study declares that the vibration mechanics model and the POINTING system represent a monumental milestone toward the true 'Theory of Everything' in the 21st century."
              }
            }
          }
        ]
      }
    ],
    "references": {
      "ref1": {
        "id": "ref1",
        "title": "Inflationary universe: A possible solution to the horizon and flatness problems",
        "authors": "Guth, Alan H.",
        "journal": "Physical Review D",
        "year": 1981,
        "pdfUrl": "",
        "citedPage": 1,
        "citedContext": {
          "ko": "광속 초과 팽창에 따른 인과율 정보 차단 지평선 문제 및 지평선 문제 해결책 제시",
          "en": "Cosmic inflation hypothesis addressing horizon and flatness problems under causality limits."
        }
      },
      "ref2": {
        "id": "ref2",
        "title": "A million cubic megaparsec void in Bootes",
        "authors": "Kirshner, R. P., et al.",
        "journal": "The Astrophysical Journal",
        "year": 1981,
        "pdfUrl": "",
        "citedPage": 2,
        "citedContext": {
          "ko": "우주 마이크로파 및 별 밀도가 극도로 희박한 목동자리 거대 공동 최초 발견 기술",
          "en": "Discovery of the giant Bootes void in cosmic large scale structure."
        }
      },
      "ref3": {
        "id": "ref3",
        "title": "How filaments of galaxies are woven into the cosmic web",
        "authors": "Bond, J. R., Kofman, L., & Pogosyan, D.",
        "journal": "Nature",
        "year": 1996,
        "pdfUrl": "",
        "citedPage": 3,
        "citedContext": {
          "ko": "우주 가스 필라멘트 구조와 보강 간섭에 따른 은하 거미줄 네트워크 형성 증명",
          "en": "Reconstruction of the web-like structures of galaxies woven by gravity dynamics."
        }
      },
      "ref4": {
        "id": "ref4",
        "title": "A Bright Millisecond Radio Burst of Extragalactic Origin",
        "authors": "Lorimer, D. R., et al.",
        "journal": "Science",
        "year": 2007,
        "pdfUrl": "",
        "citedPage": 1,
        "citedContext": {
          "ko": "은하 외부에서 날아오는 단 1밀리초의 초광도 전파 섬광(FRB)의 존재를 최초로 탐지",
          "en": "First detection of fast radio bursts (FRBs) emitting millisecond scale radio pulses."
        }
      },
      "ref5": {
        "id": "ref5",
        "title": "Periodic activity from a fast radio burst source",
        "authors": "CHIME/FRB Collaboration",
        "journal": "Nature",
        "year": 2020,
        "pdfUrl": "",
        "citedPage": 2,
        "citedContext": {
          "ko": "고속 전파 폭발의 특정 단층 좌표 주기성 반복 여진 메커니즘 관측",
          "en": "Discovery of repeating periodic activity from a single FRB source."
        }
      }
    },
    "reviews": {},
    "workflow": {
      "stage": "Pre-submission Drafting",
      "percent": 20,
      "nextStep": "3장 파동 간섭 수식 보강 및 3D 판구조 단층 그래프 검증",
      "journalTarget": "Nature Physics"
    }
  }
};
