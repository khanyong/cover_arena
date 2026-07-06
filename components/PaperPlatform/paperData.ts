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
      "ko": "KT 부장, 연세대학교 경영학 박사 수료, 코네티컷 대학교 법학 석사 (LL.M.)",
      "en": "KT Director, Ph.D. Candidate at Yonsei University, LL.M. at UCONN"
    },
    "abstract": {
      "versions": {
        "v1": {
          "ko": "",
          "en": ""
        },
        "v2": {
          "ko": "현대 양자역학의 코펜하겐 해석은 관측 전 미시 입자의 상태를 확률적 파동 함수로 기술하며, 대상의 본질적 실재성(Physical Reality)을 배제하는 철학적 한계를 안고 있다. 본 논문은 파동-입자 이중성의 역설을 해결하기 위해, 입자의 실재성과 파동성을 분리하는 '공간의 진동(Spatial Vibration)' 가설을 제안한다. 본 연구는 전자와 광자 등 모든 양자가 명백한 입자임을 전제하며, 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동성을 띠어서가 아니라 입자가 이동하는 배경 공간의 미세한 진동이 형성한 궤적에 기인함을 논증한다. 또한, 관측 행위로 인한 붕괴 현상을 거시적 관측 에너지가 미시 공간 진동에 섭동을 일으켜 파동성을 잃게 만드는 감쇠 효과(Damping effect)로 수학화한다. 본 연구는 공간 진동의 영향력이 거시 스케일에서 상쇄되어 뉴턴 역학으로 수렴하는 과정을 규명함으로써, 미시와 거시를 잇는 새로운 결정론적 프레임워크를 제시한다.",
          "en": "<math>\\\\lim_{E_{obs} \\\\to \\\\infty} \\\\gamma(E_{obs}) Q_s = 0</math>"
        },
        "v3": {
          "ko": "현대 양자역학의 코펜하겐 해석은 관측 전 미시 입자의 상태를 확률적 파동 함수로 기술하며, 대상의 본질적 실재성(Physical Reality)을 배제하는 철학적 한계를 안고 있다. 본 논문은 파동-입자 이중성의 역설을 해결하기 위해, 입자의 실재성과 파동성을 분리하는 **'공간의 진동(Spatial Vibration)' 가설**을 제안한다.\n본 연구는 전자와 광자 등 모든 양자가 명백한 입자임을 전제하며, 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동성을 띠어서가 아니라 **입자가 이동하는 배경 공간의 미세한 진동(Quantum spatial fluctuation)이 형성한 궤적**에 기인함을 논증한다. 또한, 관측 행위로 인한 붕괴 현상을 거시적 관측 에너지가 미시 공간 진동에 섭동을 일으켜 파동성을 잃게 만드는 감쇠 효과(Damping effect)로 수학화한다.\n$$\n$$\n본 연구는 공간 진동의 영향력이 거시 스케일에서 상쇄되어 뉴턴 역학으로 수렴하는 과정을 규명함으로써, 미시와 거시를 잇는 새로운 결정론적 프레임워크를 제시한다.",
          "en": "$$\n\\\\lim_{E_{obs} \\\\to \\\\infty} \\\\gamma(E_{obs}) Q_s = 0\n$$"
        },
        "v4": {
          "ko": "현대 양자역학의 코펜하겐 해석은 관측 전 미시 입자의 상태를 확률적 파동 함수로 기술하며, 대상의 본질적 실재성(Physical Reality)을 배제하는 철학적 한계를 안고 있다. 본 논문은 파동-입자 이중성의 역설을 해결하기 위해, 입자의 실재성과 파동성을 완벽히 분리하는 **'공간의 기하학적 진동(Geometrical Fluctuation of Space)'** 가설을 제안한다.\n본 연구는 전자와 광자 등 모든 양자가 명백한 입자임을 전제하며, 이중 슬릿 실험에서 관측되는 간섭 무늬는 입자 자체가 파동성을 띠어서가 아니라 **입자가 이동하는 배경 공간의 미세한 기하학적 요동이 형성한 궤적 지형도($Q_s$)**에 기인함을 역학적으로 논증한다. 또한, 관측 행위로 인한 파동 붕괴 현상을 거시적 관측 에너지가 미시 공간 진동에 섭동을 일으켜 기하학적으로 평탄화시키는 감쇠 효과(Damping effect)로 수학화한다.\n$$ \\\\lim_{E_{obs} \\\\to \\\\infty} \\\\gamma(E_{obs}) Q_s = 0 $$\n나아가 본 연구는 양자 얽힘(Quantum Entanglement) 현상을 내부 거리가 0으로 수렴하는 기하학적 $\\\\Omega$(오메가) 접합 튜브의 동시적 붕괴 착시로 해명하며, 공간 진동의 궤적 유도력이 대상의 질량 밀도 증가에 따라 관성적으로 억제되어 고전 뉴턴 역학으로 수렴하는 과정을 규명함으로써 미시와 거시를 잇는 새로운 결정론적 대통일 프레임워크를 제시한다.",
          "en": "The Copenhagen interpretation of modern quantum mechanics describes the state of a microscopic particle prior to observation via a probabilistic wave function, harboring a philosophical limitation that excludes the intrinsic physical reality of the object. To resolve the paradox of wave-particle duality, this paper proposes the **'Geometrical Fluctuation of Space'** hypothesis, which strictly decouples the particle's physical reality from its wave-like phenomena.\nThis study postulates that all quanta are definitive real particles. It argues that the interference pattern observed in the double-slit experiment is not due to the particle exhibiting wave properties, but rather emerges as an ensemble of trajectories guided by the microscopic geometrical curvature fluctuations of the background space ($Q_s$). Furthermore, the phenomenon of wave function collapse triggered by observation is mathematically formulated as a mechanical damping effect, where macroscopic observational energy perturbs and flattens the microscopic spatial vibration.\n$$ \\\\lim_{E_{obs} \\\\to \\\\infty} \\\\gamma(E_{obs}) Q_s = 0 $$\nMoreover, this study elucidates quantum entanglement geometrically as an illusion of simultaneous collapse caused by a topological $\\\\Omega$-shaped spatial junction where internal distance converges to zero. By demonstrating that the guiding force of spatial vibration is dynamically suppressed by the inertia of increasing mass—thereby converging to Newtonian mechanics—this paper presents a novel deterministic framework unifying the microscopic and macroscopic realms."
        },
        "v5": {
          "ko": "현대 양자역학의 코펜하겐 해석은 관측 전 미시 입자의 상태를 확률적 파동 함수로 기술하며, 대상의 본질적 실재성(Physical Reality)을 배제하는 철학적 한계를 안고 있다. 본 논문은 파동-입자 이중성의 역설을 해결하기 위해, 입자의 실재성과 파동성을 완벽히 분리하는 **'공간의 기하학적 진동(Geometrical Fluctuation of Space)'** 가설을 제안한다.\n본 연구는 전자와 광자 등 모든 양자가 명백한 실재적 입자임을 전제하며, 이중 슬릿 실험의 간섭 무늬는 입자 자체가 파동이어서가 아니라 **입자가 맹렬히 진동하는 배경 공간의 텐서 지형도($Q_s$)를 따라 이동하며 누적된 통계적 앙상블**에 기인함을 역학적으로 논증한다. 나아가 관측에 의한 파동 붕괴 현상을 거시적 관측 에너지($E_{obs}$)가 미시 공간 진동에 섭동을 일으켜 기하학적으로 평탄화시키는 감쇠 효과(Damping effect)로 수학화한다.\n$$ \\\\lim_{E_{obs} \\\\to \\\\infty} \\\\gamma(E_{obs}) Q_s = 0 $$\n또한 본 연구는 양자 얽힘 현상을 내부 거리가 0으로 수렴하는 기하학적 $\\\\Omega$(오메가) 접합 튜브를 통한 동시적 붕괴 착시로 해명한다. 본 논문은 '기하학적 텐서 마찰'이라는 단일 원리를 통해 양자 도약, 터널링, 중첩, 스핀, 불확정성, 소산, 힉스 메커니즘 등 코펜하겐 해석의 모든 미해결 난제를 결정론적으로 해체하며, 질량 관성의 증가에 따라 공간 유도력이 억제되어 뉴턴 역학으로 수렴($\\\\lim_{m \\\\to \\\\infty} \\\\mathbf{F}_{space} = 0$)하는 대통일 프레임워크를 제시한다.",
          "en": "The Copenhagen interpretation of modern quantum mechanics describes the state of a microscopic particle prior to observation via a probabilistic wave function, harboring a philosophical limitation that excludes the intrinsic physical reality of the object. To resolve the paradox of wave-particle duality, this paper proposes the **'Geometrical Fluctuation of Space'** hypothesis, which strictly decouples the particle's physical reality from its wave-like phenomena.\nThis study postulates that all quanta are definitive real particles. It mathematically proves that the interference pattern observed in the double-slit experiment emerges not because the particle itself is a wave, but as a **statistical ensemble of trajectories accumulated along the geometrical tensor topography ($Q_s$) carved by the fiercely vibrating background space**. Furthermore, the wave function collapse triggered by observation is mathematically formulated as a mechanical damping effect, where macroscopic observational energy ($E_{obs}$) perturbs and geometrically flattens the microscopic spatial vibration.\n$$ \\\\lim_{E_{obs} \\\\to \\\\infty} \\\\gamma(E_{obs}) Q_s = 0 $$\nMoreover, this study single-handedly obliterates the eight great mysteries of modern physics—Quantum Entanglement (0-distance $\\\\Omega$-junction), Quantum Leap (vertical short-circuit), Quantum Tunneling (phase pairing), Superposition (saddle point equilibrium), Spin (co-moving fluid vortex), Uncertainty Principle (destructive trade-off), Quantum Dissipation (geometrical viscosity), and the Higgs Mechanism (tensor drag)—reducing them all to deterministic tensor mechanics. By demonstrating that the guiding force of spatial vibration is dynamically suppressed by increasing mass inertia, converging to classical Newtonian mechanics ($\\\\lim_{m \\\\to \\\\infty} \\\\mathbf{F}_{space} = 0$), this paper presents a novel deterministic Grand Unified framework bridging particle physics and macroscopic mechanics."
        },
        "v5.1": {
          "ko": "양자역학의 코펜하겐 해석은 측정 전 미시 시스템을 확률적으로 해석되는 파동 함수로 기술하며, 관측 전에 대상에 확정적인 고전적 특성을 부여하는 것을 유보한다. 파동-입자 이중성과 관련된 개념적 긴장을 해소하기 위해, 본 논문은 입자의 물리적 실재와 파동적 현상의 발현을 단일 결정론적 모델의 물리적으로 구별되는 측면으로 취급하는 '공간의 기하학적 요동' 가설을 제안한다.\n본 가설 내에서 미시 입자는 기저의 공간 진동 구조에 의해 유도되는 확정적인 입자적 실체로 취급된다. 본 논문은 극형식 분해를 통해 비상대론적 슈뢰딩거 방정식을 재정식화하고, 봄(Bohm)의 양자 퍼텐셜과 대수적으로 동일한 공간 진동 퍼텐셜 $Q_s$를 식별한다. 그러나 기존의 봄 해석과 달리, $Q_s$는 물리적 공간의 기하학적 요동에 대한 유효 스칼라 척도라는 존재론적 해석을 부여받는다.\n이중 슬릿 간섭 무늬는 초기 입자 분포가 보른 규칙 조건 $\\\\rho(\\\\mathbf{r},0)=|\\\\psi(\\\\mathbf{r},0)|^2$를 만족할 때 $Q_s$에 의해 유도된 궤적들의 통계적 앙상블로 해석된다. 측정에 의해 유발된 간섭의 상실은 측정 상호작용 동안 $Q_s$가 유계(bounded) 상태를 유지한다는 가정 하에, 유효 측정 상호작용 척도 $E_{obs}$가 공간 유도 항을 억제하는 현상론적인 감쇠 과정으로 모델링된다:\n$$ \\\\lim_{E_{obs}/\\\\epsilon_c\\\\to\\\\infty}\\\\gamma(E_{obs})Q_s=0 $$\n본 연구는 더 나아가 신호 전달 금지(no-signaling) 조건을 보존하면서 얽힘 상관관계, 양자 전이, 터널링, 중첩 및 스핀 등 여러 핵심 양자 현상을 결정론적 텐서 역학 프레임워크 내에서 재해석하고자 시도한다. 진폭 기울기가 유계되어 있다는 가정하에 공간 유도력이 질량 관성이 증가함에 따라 무시할 수 있게 됨($\\\\lim_{m\\\\to\\\\infty}F_{space}=0$)을 보임으로써, 본 논문은 사변적인 고차원 가정에 의존하지 않고 4차원 시공간 기술 내에서 입자 척도의 동역학과 유효 거시 뉴턴 역학을 연결하는 결정론적 프레임워크를 제안한다.",
          "en": "The Copenhagen interpretation of quantum mechanics describes a microscopic system prior to measurement in terms of a probabilistically interpreted wave function, while refraining from assigning definite classical properties before observation. To address the conceptual tension associated with wave-particle duality, this paper proposes the Geometrical Fluctuation of Space hypothesis, which treats the particle-like reality of quanta and the emergence of wave-like phenomena as physically distinct aspects of a single deterministic model.\nWithin this hypothesis, microscopic particles are postulated to behave as definite particle-like entities guided by an underlying spatial-vibration structure. The paper reformulates the nonrelativistic Schrödinger equation through polar decomposition and identifies a spatial-vibration potential, $Q_s$, algebraically identical to Bohm's quantum potential. Unlike the conventional Bohmian interpretation, however, $Q_s$ is assigned an ontological interpretation as an effective scalar measure of geometric fluctuation in physical space.\nThe double-slit interference pattern is interpreted as a statistical ensemble of trajectories guided by $Q_s$, provided that the initial particle distribution satisfies the Born-rule condition $\\\\rho(\\\\mathbf{r},0)=|\\\\psi(\\\\mathbf{r},0)|^2$. Measurement-induced loss of interference is modeled phenomenologically as a damping of the spatial-guidance term:\n$$ \\\\lim_{E_{obs}/\\\\epsilon_c\\\\to\\\\infty}\\\\gamma(E_{obs})Q_s=0, $$\nunder the assumption that $Q_s$ remains bounded during the measurement interaction.\nThe paper further discusses possible interpretive extensions to tunneling, superposition, decoherence, and entanglement correlations, while emphasizing that these extensions require additional mathematical development. In the large-mass limit, the spatial-guidance force becomes negligible under bounded-amplitude-gradient assumptions, suggesting a possible route from particle-scale guidance dynamics to effective macroscopic Newtonian behavior."
        },
        "v6": {
          "ko": "양자역학의 코펜하겐 해석은 측정 전 미시 시스템을 확률적 파동 함수로 기술하며, 관측 이전 객체의 확정적 고전적 특성을 유보한다. 본 논문은 입자의 물리적 실재와 파동적 현상을 단일 결정론적 모델의 물리적으로 구별되는 측면으로 취급하는 **'공간의 기하학적 요동'** 가설을 제안한다.\n본 논문은 비상대론적 슈뢰딩거 방정식을 재정식화하고 공간 진동 퍼텐셜 $Q_s$를 식별하며, 이를 물리적 3차원 공간의 기하학적 요동에 대한 유효 스칼라 척도로 해석한다. 마디점 특이점($R \\\\to 0$) 문제를 해결하기 위해 진공 영점 요동을 활용한 정칙화 메커니즘을 도입하며, $3N$차원 배위 공간 딜레마를 우회하기 위해 다중 연결된 3차원 위상 구조를 제안한다.\n측정에 의해 유발된 간섭 상실은 미시적 공간 곡률을 거시적 감쇠 과정으로 시간 평균화하는 상호작용 해밀토니안($H_{int}$)을 통해 동역학적으로 유도된다. 결정적으로, 표준 확률론적 이론에 대한 반증 가능성을 만족시키기 위해 본 모델은 중간 거시 간섭계에서 마르코프 근사와 대비되는 측정 가능한 **'기하역학적 붕괴 지연(Geomechanical Damping Delay)'**을 예측한다. 큰 질량 극한에서 유도력이 무시할 수 있게 됨($\\\\lim_{m \\\\to \\\\infty} \\\\mathbf{F}_{space} = 0$)을 입증함으로써, 본 논문은 입자 척도의 동역학과 유효 거시 뉴턴 역학을 연결하는 결정론적 프레임워크를 제안한다.",
          "en": "The Copenhagen interpretation of quantum mechanics describes a microscopic system prior to measurement in terms of a probabilistically interpreted wave function. To address the conceptual tension associated with wave-particle duality, this paper proposes the **'Geometrical Fluctuation of Space'** hypothesis, which treats the particle-like reality of quanta and the emergence of wave-like phenomena as physically distinct aspects of a single deterministic model.\nWithin this hypothesis, microscopic particles are postulated to behave as definite particle-like entities guided by an underlying spatial-vibration structure. The paper reformulates the nonrelativistic Schrödinger equation through polar decomposition and identifies a spatial-vibration potential, $Q_s$. To address the unphysical energy divergence at nodal singularities ($R \\\\to 0$), a regularization mechanism utilizing zero-point vacuum fluctuations is introduced. Furthermore, to circumvent the abstract $3N$-dimensional configuration space dilemma of many-particle entanglement, we propose a multiply-connected 3D topological structure.\nThe double-slit interference pattern is interpreted as a statistical ensemble of trajectories guided by $Q_s$. Measurement-induced loss of interference is dynamically derived by integrating a measurement-interaction Hamiltonian ($H_{int}$) that time-averages the microscopic spatial curvature into a macroscopic damping process. Crucially, to satisfy falsifiability against standard probabilistic theories, this model predicts a measurable **'Geomechanical Damping Delay'** in mesoscopic interferometry, diverging from standard Markovian approximations."
        },
        "v7": {
          "ko": "양자역학의 코펜하겐 해석은 미시 시스템을 확률적으로 해석하며 관측 이전의 확정적 실재를 유보한다. 본 논문은 입자의 물리적 실재와 파동적 현상을 분리하는 **'공간의 기하학적 요동'** 가설을 제안한다.\n확률 보존(Unitarity) 파괴를 피하기 위해, 전역적 게이지 불변을 만족하는 실수(Real-valued) 기하 점성 항($+\\\\gamma(S - \\\\langle S \\\\rangle)$)을 포함하는 비선형 슈뢰딩거 방정식을 제안한다. 이를 통해 전역적인 확률 밀도 보존($\\\\partial\\\\rho/\\\\partial t + \\\\nabla\\\\cdot(\\\\rho\\\\mathbf{v})=0$)을 증명한다. 또한 $R \\\\to 0$ 마디점에서의 에너지 발산 문제는 임의의 절단이 아니라, 양자 퍼텐셜 $Q_s$의 무한 인력 우물과 소용돌이 위상의 회전 운동 에너지가 발생시키는 원심 척력이 수학적으로 완벽히 100% 상쇄(Cancellation)되는 메커니즘을 통해 자가 정칙화됨을 입증한다.\n관측 붕괴는 측정 상호작용 해밀토니안이 공간 위상($S$)에 노이즈를 주입하여 궤적을 헝클어뜨리는 **'위상 난류(Phase Turbulence)'** 메커니즘으로 동역학적으로 유도되며, 축소 밀도 행렬의 비대각 성분을 지수적으로 소거한다. 주류 마르코프 근사와 차별화되는 반증 가능성을 위해, 결어긋남 시간이 진공 온도에 종속되는 새로운 척도 법칙($\\\\tau_{dec} \\\\sim \\\\hbar (\\\\rho_{\\\\mathrm{fluid}} c^2) d^3 / (k_B T_{vac})^2$)을 예측한다.",
          "en": "To address the conceptual tension associated with wave-particle duality, this paper proposes the **Geometrical Fluctuation of Space** hypothesis. This model attributes wave-like phenomena to dynamical fluctuations of the spatial background, treating quanta as definite particle-like entities guided by this geometry.\nTo resolve probability non-conservation inherent in ad-hoc damping models, we introduce a phenomenological, non-linear modification to the Schrödinger equation incorporating a real-valued, gauge-invariant spatial geometric viscosity term ($+\\\\gamma(S - \\\\langle S \\\\rangle)$). We demonstrate that while probability density is strictly conserved ($\\\\partial\\\\rho/\\\\partial t + \\\\nabla\\\\cdot(\\\\rho\\\\mathbf{v})=0$), the mechanical trajectory experiences effective damping. Furthermore, the nodal singularity divergence ($R \\\\to 0$) is mathematically resolved via quantized topological defects; the infinite attractive potential well of $Q_s$ is exactly canceled by the divergent centrifugal phase kinetic energy, preserving geometric regularity without arbitrary cutoffs.\nMeasurement-induced decoherence is dynamically modeled via an interaction Hamiltonian injecting high-frequency thermodynamic noise into the spatial phase ($S$). This generates **'Phase Turbulence'**, exponentially suppressing the off-diagonal elements of the reduced density matrix. To distinguish this model from standard Markovian decoherence, we predict a novel **'Tensor-Thermodynamic Scaling Law'** where the geomechanical decoherence time scales as $\\\\tau_{dec} \\\\sim \\\\hbar (\\\\rho_{fluid} c^2) d^3 / (k_B T_{vac})^2$. By preserving unitarity and bridging particle-scale geodynamics with effective macroscopic Newtonian behavior ($\\\\lim_{m \\\\to \\\\infty} \\\\mathbf{F}_{space} = 0$), this paper proposes a rigorous deterministic framework."
        },
        "v8": {
          "ko": "양자역학의 코펜하겐 해석은 미시 시스템을 확률적으로 기술하며 관측 이전의 확정적 실재를 유보한다. 본 논문은 입자의 물리적 실재와 파동적 현상을 분리하는 **'공간의 기하학적 요동'** 가설을 제안한다.\n확률 보존 파괴를 피하기 위해, 전역적 게이지 불변을 만족하는 실수 기하 점성 항($+\\\\gamma(S - \\\\langle S \\\\rangle)$)을 포함하는 코스틴(Kostin) 형태의 비선형 슈뢰딩거 방정식을 제안한다. 이를 통해 전역적인 확률 밀도 보존($\\\\partial\\\\rho/\\\\partial t + \\\\nabla\\\\cdot(\\\\rho\\\\mathbf{v})=0$)을 증명한다. 또한 $R \\\\to 0$ 마디점에서의 에너지 발산 문제는 임의의 컷오프가 아니라, 양자 퍼텐셜 $Q_s$의 무한 인력 우물과 소용돌이 위상의 회전 운동 에너지가 발생시키는 원심 척력이 수학적으로 완벽히 100% 상쇄(Exact Cancellation)되는 메커니즘을 통해 자가 정칙화됨을 입증한다.\n관측 붕괴는 공간 위상($S$)에 노이즈를 주입하여 궤적을 헝클어뜨리는 **'위상 난류(Phase Turbulence)'** 메커니즘으로 유도되며, 축소 밀도 행렬의 비대각 성분을 지수적으로 소거한다. 주류 이론의 마르코프 근사와 차별화되는 반증 가능성을 위해, 결어긋남 시간이 진공 온도에 종속되는 비마르코프 척도 법칙($\\\\tau_{dec} \\\\sim \\\\hbar (\\\\rho_{\\\\mathrm{fluid}} c^2) d^3 / (k_B T_{vac})^2$)을 예측하며 차원 분석의 정합성($[T]$)을 증명한다.",
          "en": "To address the conceptual tension associated with wave-particle duality, this paper proposes the **Geometrical Fluctuation of Space** hypothesis. This model attributes wave-like phenomena to dynamical fluctuations of the spatial background, treating quanta as definite particle-like entities guided by this geometry.\nTo resolve probability non-conservation inherent in ad-hoc damping models, we introduce a phenomenological, non-linear modification to the Schrödinger equation incorporating a real-valued, gauge-invariant spatial geometric viscosity term ($+\\\\gamma(S - \\\\langle S \\\\rangle)$) analogous to the Kostin formulation. We demonstrate that while probability density is strictly conserved ($\\\\partial\\\\rho/\\\\partial t + \\\\nabla\\\\cdot(\\\\rho\\\\mathbf{v})=0$), the mechanical trajectory experiences effective damping. Furthermore, the nodal singularity divergence ($R \\\\to 0$) is mathematically resolved via quantized topological defects; the infinite attractive potential well of $Q_s$ is exactly canceled by the divergent centrifugal phase kinetic energy, bypassing singularities and preserving geometric regularity without arbitrary cutoffs.\nMeasurement-induced decoherence is dynamically modeled via an interaction Hamiltonian injecting high-frequency thermodynamic noise into the spatial phase ($S$). This generates **'Phase Turbulence'**, exponentially suppressing the off-diagonal elements of the reduced density matrix. To distinguish this model from standard Markovian decoherence, we predict a novel **'Tensor-Thermodynamic Scaling Law'** where the geomechanical decoherence time scales non-Markovianly as $\\\\tau_{dec} \\\\sim \\\\hbar (\\\\rho_{\\\\mathrm{fluid}} c^2) d^3 / (k_B T_{vac})^2$. By preserving unitarity and bridging particle-scale geodynamics with effective macroscopic Newtonian behavior ($\\\\lim_{m \\\\to \\\\infty} \\\\mathbf{F}_{\\\\mathrm{space}} = 0$), this paper proposes a rigorous deterministic framework."
        },
        "v8.1": {
          "ko": "양자역학의 코펜하겐 해석은 미시 시스템을 확률적으로 기술하며 관측 이전의 확정적 실재를 유보한다. 본 논문은 입자의 물리적 실재와 파동적 현상을 분리하는 **'공간의 기하학적 요동'** 가설을 제안한다.\n확률 보존을 위해, 전역적 게이지 불변을 만족하는 실수 기하 점성 항($+\\\\gamma(S - \\\\langle S \\\\rangle)$)을 포함하는 비선형 슈뢰딩거 방정식을 제안한다. $R \\\\to 0$ 마디점에서의 에너지 발산 문제는 양자 퍼텐셜 $Q_s$의 무한 인력 우물과 소용돌이 위상의 원심 척력이 수학적으로 100% 완벽히 상쇄(Exact Cancellation)되어 자가 정칙화됨을 입증한다. 관측 붕괴는 공간 위상($S$)에 노이즈를 주입하여 궤적을 헝클어뜨리는 **'위상 난류(Phase Turbulence)'** 메커니즘으로 유도되며, 결어긋남 시간이 진공 온도에 종속되는 새로운 비마르코프 척도 법칙($\\\\tau_{dec} \\\\sim \\\\hbar (\\\\rho_{\\\\mathrm{fluid}} c^2) d^3 / (k_B T_{vac})^2$)을 예측한다. 이는 결정론적 기하역학 프레임워크를 제안한다. 인터랙티브 시뮬레이션은 다음 주소에서 제공된다: [https://doi.org/10.5281/zenodo.21206843](https://doi.org/10.5281/zenodo.21206843).",
          "en": "To address the conceptual tension associated with wave-particle duality, this paper proposes the **Geometrical Fluctuation of Space** hypothesis. This model attributes wave-like phenomena to dynamical fluctuations of the spatial background, treating quanta as definite particle-like entities guided by this geometry.\nTo resolve probability non-conservation, we introduce a non-linear modification to the Schrödinger equation incorporating a real-valued, gauge-invariant spatial geometric viscosity term ($+\\\\gamma(S - \\\\langle S \\\\rangle)$). We demonstrate that the nodal singularity divergence ($R \\\\to 0$) is mathematically resolved via quantized topological defects, where the infinite attractive potential well of $Q_s$ is exactly canceled by centrifugal phase kinetic energy. Measurement-induced decoherence is dynamically modeled as **'Phase Turbulence'** injecting high-frequency thermodynamic noise into the spatial phase ($S$). We predict a novel **'Tensor-Thermodynamic Scaling Law'** where $\\\\tau_{dec} \\\\sim \\\\hbar (\\\\rho_{\\\\mathrm{fluid}} c^2) d^3 / (k_B T_{vac})^2$. By preserving unitarity and bridging particle-scale geodynamics with effective macroscopic Newtonian behavior, this paper proposes a rigorous deterministic framework. Interactive simulations are available at: [https://doi.org/10.5281/zenodo.21206843](https://doi.org/10.5281/zenodo.21206843)."
        }
      }
    },
    "chapters": [
      {
        "number": 1,
        "title": {
          "ko": "1. 서론",
          "en": "1. Introduction"
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
              },
              "v4": {
                "ko": "본 논문은 이러한 양자역학과 고전 물리학 사이의 간극을 메우기 위해, 파동-입자 이중성의 근원을 대상 자체가 아닌 대상을 둘러싼 **'배경 공간(Background Space)의 역학적 진동'**으로 해석하는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 물질을 담는 수동적이고 텅 빈 무(無)의 그릇이나 에테르와 같은 특정 매질(Medium)로 전제하던 고전적 관점을 철저히 탈피한다. 대신, 공간 그 자체를 내재적인 요동(Intrinsic fluctuation)과 기하학적 장력(Geometrical tension)을 지닌 **'동역학적 실체(Dynamical Entity)'**로 재정의한다. 텅 빈 시공간의 기하학적 위상 자체가 스스로 요동칠 수 있다는 '공간 진동(Spatial Vibration)' 모델을 통해, 본 연구는 미시 세계의 확률적 현상과 거시 세계의 결정론을 단일 프레임워크로 통합하고자 한다.",
                "en": "To bridge the gap between quantum mechanics and classical physics, this paper proposes a new paradigm that attributes the origin of wave-particle duality not to the object itself, but to the **'mechanical vibration of the background space'**. This study completely departs from classical views that premise vacuum space as a passive, empty vessel or an absolute space filled with a specific medium. Instead, space itself is redefined as a **'dynamical entity'** possessing intrinsic fluctuations and geometrical tension. By introducing the 'Spatial Vibration' model, where the geometrical topology of empty spacetime can self-fluctuate, this study aims to integrate probabilistic quantum phenomena into a deterministic mechanical framework."
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
          },
          {
            "id": "p1_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "현대 물리학에서 양자역학은 미시 세계를 가장 성공적으로 기술하는 이론이지만, 그 해석적 기반인 코펜하겐 해석(Copenhagen Interpretation)은 대상의 본질적 실재성(Physical Reality)에 대해 심각한 철학적 한계를 지니고 있다 [1]. 코펜하겐 해석은 관측 이전의 양자적 대상을 확률적 파동 함수(Wave function)로 기술하며, 관측 행위가 파동 함수의 붕괴(Collapse)를 야기한다고 가정한다. 이는 관측자의 존재가 물리적 실재를 결정한다는 주관주의적 모순을 내포한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "특히, 이중 슬릿 실험(Double-slit experiment)에서 단일 입자가 보여주는 파동-입자 이중성(Wave-Particle Duality)은 \"하나의 객체가 입자인 동시에 파동일 수 있는가\"라는 근본적인 역설을 제시한다. 기존의 해석은 입자 자체가 공간에 확률적으로 퍼져 파동처럼 행동한다고 설명하지만, 이는 직관적인 인과율 및 고전 역학의 결정론적 세계관과 정면으로 충돌한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "While quantum mechanics is the most successful theory describing the microscopic world, its foundational Copenhagen Interpretation harbors a profound contradiction regarding physical reality [1]. The postulation that the act of observation induces the collapse of the probabilistic wave function implies a subjectivist paradox where the observer's existence determines physical reality."
              }
            }
          },
          {
            "id": "p1_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "In particular, the wave-particle duality exhibited by a single particle in the double-slit experiment directly conflicts with classical determinism and causality. Although hidden-variable theories like the De Broglie-Bohm theory attempted to separate the particle's reality from the pilot-wave, they failed to clearly identify the physical essence of the wave guiding the particle."
              }
            }
          },
          {
            "id": "p1_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "현대 물리학에서 양자역학은 미시 세계를 가장 성공적으로 기술하는 이론이지만, 그 해석적 기반인 코펜하겐 해석(Copenhagen Interpretation)은 대상의 본질적 실재성에 대해 심각한 철학적 딜레마를 지니고 있다 [1]. 코펜하겐 해석은 관측 이전의 대상을 확률적 파동 함수로 취급하며, 관측 행위가 파동 함수의 붕괴를 야기한다고 가정한다. 이는 관측자의 존재가 물리적 실재를 결정한다는 주관주의적 모순을 내포하며 직관적 인과율 및 결정론적 세계관과 정면으로 충돌한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "본 논문은 이러한 간극을 메우기 위해, 파동 현상의 근원을 대상 입자 자체가 아닌 대상을 둘러싼 **'배경 공간(Background Space)의 역학적 진동'**으로 귀속시키는 새로운 패러다임을 제안한다. 본 연구는 우주 공간을 수동적이고 텅 빈 무(無)의 그릇으로 전제하던 관점을 탈피하여, 내재적인 요동과 기하학적 텐서 장력(Tension)을 지닌 **'동역학적 실체(Dynamical Entity)'**로 재정의한다. 어떠한 물리적 매질 없이도 시공간의 위상 자체가 스스로 요동칠 수 있다는 '공간 진동' 모델을 통해, 미시 세계의 확률적 현상과 거시 세계의 결정론을 단일 역학으로 대통합하고자 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "While quantum mechanics is the most successful theory describing the microscopic world, its foundational Copenhagen Interpretation harbors a profound dilemma regarding physical reality [1]. Treating unobserved objects as probabilistic wave functions and assuming that observation induces a collapse implies a subjectivist paradox, directly conflicting with classical deterministic causality."
              }
            }
          },
          {
            "id": "p1_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "To bridge this gap, this paper proposes a new paradigm that attributes the origin of wave-particle duality to the **'mechanical vibration of the background space'**. Space itself is redefined as a **'dynamical entity'** possessing intrinsic fluctuations and geometrical tensor tension. Through this 'Spatial Vibration' model, where the geometrical topology of empty spacetime can self-fluctuate, this study aims to integrate probabilistic quantum phenomena into a unified deterministic mechanical framework."
              }
            }
          },
          {
            "id": "p1_v5.1_ko_1",
            "versions": {
              "v5.1": {
                "ko": "양자역학은 미시 현상을 기술하는 가장 성공적인 이론적 프레임워크 중 하나이지만, 코펜하겐 해석은 측정 이전의 양자 상태의 물리적 지위에 관해 미해결된 의문을 남긴다 [1]. 특히, 확률적으로 해석되는 파동 함수와 측정에 수반되는 붕괴 공리는 미시 시스템이 관측과 독립적으로 확정적인 특성을 갖는지에 대한 의문을 제기한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v5.1_ko_2",
            "versions": {
              "v5.1": {
                "ko": "이러한 개념적 간극을 해소하기 위해, 본 논문은 파동적 양자 현상을 기저 공간 배경의 기하학적 요동에 귀속시키는 공간 진동 가설을 제안한다. 이 모델에서 공간은 내재적 미시 요동과 이와 연관된 유효 기하학적 장을 특징으로 하는 동역학적 실체로 취급된다. 본 모델은 텅 빈 공간이 미시적 기하학적 요동을 지원할 수 있다고 가정하며, 확률적 양자 현상을 결정론적 역학 프레임워크 내에서 재해석하고자 시도한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v5.1_ko_3",
            "versions": {
              "v5.1": {
                "ko": "제안된 프레임워크는 마델룽 및 봄의 정식화에서 사용되는 슈뢰딩거 방정식의 극형식 분해와 수학적으로 연관되어 있다 [2, 3]. 그러나 결과적인 유도 퍼텐셜을 단순한 추상적 유도 항으로 취급하는 대신, 물리적 공간의 기하학적 요동에 대한 유효한 발현으로 취급함으로써 다른 물리적 해석을 부여한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v5.1_en_1",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Quantum mechanics is one of the most successful theoretical frameworks for describing microscopic phenomena, yet its Copenhagen interpretation leaves unresolved questions concerning the physical status of quantum states prior to measurement. In particular, the use of a probabilistically interpreted wave function and the collapse postulate associated with measurement raise questions about whether microscopic systems possess definite properties independent of observation \\cite{Einstein1935}."
              }
            }
          },
          {
            "id": "p1_v5.1_en_2",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "To address this conceptual gap, this paper proposes the Spatial Vibration hypothesis, which attributes wave-like quantum phenomena to geometric fluctuations of the underlying spatial background. In this model, space is treated as a dynamical entity characterized by intrinsic microscopic fluctuations and an associated effective geometric field. The model assumes that otherwise empty space can support microscopic geometric fluctuations, and it seeks to reinterpret probabilistic quantum phenomena within a deterministic mechanical framework."
              }
            }
          },
          {
            "id": "p1_v5.1_en_3",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The proposed framework is mathematically related to the polar decomposition of the Schrödinger equation used in Madelung-type and Bohmian formulations \\cite{Madelung1927, Bohm1952}. However, it assigns a different physical interpretation to the resulting guidance potential by treating it as an effective manifestation of spatial geometric fluctuation rather than as an abstract guiding term alone."
              }
            }
          },
          {
            "id": "p1_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "양자역학은 미시 현상을 기술하는 가장 성공적인 프레임워크 중 하나이나, 코펜하겐 해석은 측정 이전의 양자 상태에 관해 의문을 남긴다 [1]. 본 논문은 파동적 양자 현상을 기저 공간 배경의 기하학적 요동에 귀속시키는 공간 진동 가설을 제안한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "제안된 프레임워크는 마델룽 및 봄의 정식화와 수학적으로 연관되어 있으나 [2, 3], 결과적인 유도 퍼텐셜을 물리적 공간의 기하학적 요동에 대한 유효한 발현으로 취급함으로써 존재론적 해석을 달리한다. 본 모델은 결정론적 모델의 핵심 비판인 존재론적 잉여, 배위 공간의 비국소성, 마디점 특이점, 자의적 붕괴 메커니즘의 한계를 기하역학적으로 돌파한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Quantum mechanics is one of the most successful theoretical frameworks, yet its Copenhagen interpretation leaves unresolved questions concerning the physical status of quantum states prior to measurement [1]. To address this conceptual gap, this paper proposes the Spatial Vibration hypothesis, which attributes wave-like quantum phenomena to geometric fluctuations of the underlying spatial background."
              }
            }
          },
          {
            "id": "p1_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "The proposed framework is mathematically related to the polar decomposition of the Schrödinger equation used in Madelung-type and Bohmian formulations [2, 3]. However, it assigns a different physical interpretation to the resulting guidance potential by treating it as an effective manifestation of spatial geometric fluctuation."
              }
            }
          },
          {
            "id": "p1_v7_ko_1",
            "versions": {
              "v7": {
                "ko": "양자역학의 코펜하겐 해석은 관측 이전의 양자 상태의 실재성에 관해 철학적 의문을 남긴다 [1]. 본 논문은 파동적 양자 현상을 3차원 물리적 공간의 기하학적 요동으로 취급함으로써 엄격한 수학적 정칙성의 통제를 받는 결정론적 역학 프레임워크를 정립하고자 시도한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v7_en_1",
            "versions": {
              "v7": {
                "ko": "",
                "en": "Quantum mechanics is arguably the most successful framework for describing microscopic phenomena, yet its Copenhagen interpretation leaves unresolved questions concerning the physical status of quantum states prior to measurement [1]. To address this conceptual gap, this paper proposes the Spatial Vibration hypothesis, which attributes wave-like quantum phenomena to geometric fluctuations of the underlying spatial background in physical 3D space."
              }
            }
          },
          {
            "id": "p1_v8_ko_1",
            "versions": {
              "v8": {
                "ko": "양자역학의 코펜하겐 해석은 관측 이전의 양자 상태의 실재성에 관해 철학적 의문을 남긴다 [1]. 본 논문은 파동적 양자 현상을 3차원 물리적 공간의 기하학적 요동으로 취급함으로써 엄격한 수학적 정칙성의 통제를 받는 결정론적 역학 프레임워크를 정립하고자 시도한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v8_en_1",
            "versions": {
              "v8": {
                "ko": "",
                "en": "Quantum mechanics is arguably the most successful framework for describing microscopic phenomena, yet its Copenhagen interpretation leaves unresolved questions concerning the physical status of quantum states prior to measurement [1]. To address this conceptual gap, this paper proposes the Spatial Vibration hypothesis, which attributes wave-like quantum phenomena to geometric fluctuations of the underlying spatial background in physical 3D space."
              }
            }
          },
          {
            "id": "p1_v8.1_ko_1",
            "versions": {
              "v8.1": {
                "ko": "본 논문은 파동적 양자 현상을 3차원 물리적 공간의 기하학적 요동으로 취급함으로써 엄격한 수학적 정칙성의 통제를 받는 결정론적 역학 프레임워크를 정립하고자 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v8.1_en_1",
            "versions": {
              "v8.1": {
                "ko": "",
                "en": "Quantum mechanics leaves unresolved questions concerning the physical status of quantum states prior to measurement. This paper proposes the Spatial Vibration hypothesis, attributing wave-like quantum phenomena to geometric fluctuations of the underlying spatial background."
              }
            }
          }
        ]
      },
      {
        "number": 2,
        "title": {
          "ko": "2. 수학적 정식화",
          "en": "2. Mathematical Formulation"
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
              },
              "v4": {
                "ko": "본 연구는 미시 입자의 실재성을 복원하고, 파동적 현상의 기원을 공간으로 환원하기 위해 다음의 5가지 핵심 공리(Axioms)를 제안한다.",
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
              },
              "v4": {
                "ko": "전자, 광자 등을 포함한 모든 양자는 관측 여부와 관계없이 항상 확정된 위치와 질량, 운동량을 갖는 명백한 '실재적 입자(Real Particle)'이다. 입자는 결코 스스로 분할되거나 파동의 형태로 공간에 흩어져 존재하지 않는다.",
                "en": "All quanta, including electrons and photons, are definitive 'real particles' possessing determined positions and masses, regardless of observation. A particle never divides itself nor exists probabilistically dispersed as a wave."
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
          },
          {
            "id": "p2_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "### 2.1. 양자의 절대적 실재성 (Absolute Reality of Quanta)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "### 2.2. 파동성의 외주화: 기하학적 공간 요동 (Externalization of Waveness)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_5",
            "versions": {
              "v4": {
                "ko": "이중 슬릿 실험에서 간섭 무늬가 나타나는 것은 텅 빈 배경 공간이 극미세 스케일에서 끊임없이 요동(Spatial Fluctuation)하고 있기 때문이다. 실재하는 단일 입자는 하나의 슬릿만 통과하지만, 통과한 입자는 물리적 매질 없이 진동하는 공간의 기하학적 곡률 결(Geometrical Wave-front)에 의해 역학적으로 유도(Guided)되어 물결무늬 패턴으로 착탄하게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_6",
            "versions": {
              "v4": {
                "ko": "### 2.3. 관측 역학과 진동 상쇄 (Observation Mechanics and Damping Effect)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_7",
            "versions": {
              "v4": {
                "ko": "관측을 통해 간섭 무늬가 사라지는 것은 파동 함수의 신비로운 붕괴가 아니다. 관측을 위해 투사되는 광자나 전자기장은 거시적인 에너지를 수반하는 강력한 물리적 섭동(Perturbation)이다. 이 막대한 에너지는 미시적인 공간 진동을 기계적으로 억제·평탄화(Damping)시키며, 궤적 유도를 잃은 입자는 관성 법칙에 의해 직진하게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_8",
            "versions": {
              "v4": {
                "ko": "### 2.4. 파동 함수의 물리적 재정의 (Redefinition of the Wave Function)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_9",
            "versions": {
              "v4": {
                "ko": "양자역학의 슈뢰딩거 방정식에서 파동 함수($\\psi$)는 대상의 존재 확률 분포가 아니라, 입자를 밀어내고 이끄는 **'공간 진동 에너지의 텐서 밀도 분포'**를 나타내는 유체역학적 도구로 재해석되어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_10",
            "versions": {
              "v4": {
                "ko": "### 2.5. 거시 세계로의 관성적 수렴 (Convergence to Macroscopic Mechanics)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_11",
            "versions": {
              "v4": {
                "ko": "공간 진동의 궤적 유도력은 대상 물질의 질량($m$)에 반비례한다. 질량이 거시(Macro) 단위로 커질수록 거대한 관성력이 진동을 압도하므로, 역학적 굴절 비율은 0으로 수렴하여 고전 역학(Newtonian Mechanics)으로 환원된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "This study proposes the following core axioms to restore the physical reality of micro-particles and reduce the origin of wave phenomena to space itself."
              }
            }
          },
          {
            "id": "p2_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 2.1. Absolute Reality of Quanta"
              }
            }
          },
          {
            "id": "p2_v4_en_4",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 2.2. Externalization of Waveness: Geometric Fluctuation of Space"
              }
            }
          },
          {
            "id": "p2_v4_en_5",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Interference patterns in the double-slit experiment do not emerge because the particle possesses wave properties. The seemingly empty background space is a geometrical continuum constantly fluctuating at infinitesimal scales. A single real particle passes through only one slit, but its trajectory is dynamically guided by the geometrical wave-front created by this vibrating space, eventually accumulating into an interference pattern."
              }
            }
          },
          {
            "id": "p2_v4_en_6",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 2.3. Observation Mechanics and Damping Effect"
              }
            }
          },
          {
            "id": "p2_v4_en_7",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The disappearance of interference patterns upon observation is not a mysterious collapse of the wave function. The photons or electromagnetic fields projected for observation carry macroscopic energy. This massive energy exerts strong perturbations on the microscopic spatial vibration, suppressing and damping its geometrical curvature. As the spatial wave is flattened, the particle moves in a straight line governed by inertia."
              }
            }
          },
          {
            "id": "p2_v4_en_8",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 2.4. Redefinition of the Wave Function"
              }
            }
          },
          {
            "id": "p2_v4_en_9",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The wave function ($\\psi$) in the Schrödinger equation should be reinterpreted not as the probability distribution of the particle's existence, but as a hydrodynamic tool representing the **'tensor density distribution of spatial vibration energy'** that guides the real particle."
              }
            }
          },
          {
            "id": "p2_v4_en_10",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 2.5. Convergence to Macroscopic Mechanics"
              }
            }
          },
          {
            "id": "p2_v4_en_11",
            "versions": {
              "v4": {
                "ko": "",
                "en": "As the mass ($m$) of an object scales up to the macroscopic level, the minute guidance force ($\\mathbf{F}_{space}$) of spatial vibration is mechanically ignored due to the overwhelming classical inertia. Therefore, spatial vibration effects are suppressed in the macro world, converging to Newtonian classical mechanics based purely on particle nature."
              }
            }
          },
          {
            "id": "p2_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "미시 입자의 실재성을 복원하고 양자 현상의 기원을 공간으로 환원하기 위해 다음의 5가지 핵심 공리(Axioms)를 선언한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "### 2.1. 양자의 절대적 실재성 (Absolute Reality of Quanta)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "모든 양자는 관측 여부와 관계없이 확정된 위치와 궤적을 갖는 명백한 '실재 입자(Real Particle)'이다. 입자는 결코 파동의 형태로 쪼개져 존재하지 않는다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_4",
            "versions": {
              "v5": {
                "ko": "### 2.2. 파동성의 외주화: 기하학적 공간 요동 (Externalization of Waveness)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_5",
            "versions": {
              "v5": {
                "ko": "이중 슬릿에서 간섭 무늬가 나타나는 것은 텅 빈 배경 공간이 극미세 스케일에서 끊임없이 기하학적으로 요동(Fluctuation)하고 있기 때문이다. 입자는 물리적 매질 없이 진동하는 공간의 기하학적 곡률 결(Wave-front)에 의해 역학적으로 유도(Guided)되어 굴절된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_6",
            "versions": {
              "v5": {
                "ko": "### 2.3. 관측 역학과 진동 상쇄 (Observation Mechanics and Damping Effect)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_7",
            "versions": {
              "v5": {
                "ko": "관측을 통해 간섭 무늬가 사라지는 것은 파동 함수의 마법적 붕괴가 아니다. 관측 광자나 전자기장 에너지는 강력한 물리적 섭동이다. 이 에너지는 미시 공간의 진동을 기계적으로 억제·평탄화(Damping)시키며, 궤도를 잃은 입자는 관성에 의해 직진한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_8",
            "versions": {
              "v5": {
                "ko": "### 2.4. 파동 함수의 물리적 재정의 (Redefinition of the Wave Function)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_9",
            "versions": {
              "v5": {
                "ko": "양자역학의 파동 함수($\\psi$)는 입자의 발견 확률이 아니라, 입자를 이끄는 **'공간 진동 에너지의 기하학적 텐서 밀도 분포'**를 나타내는 유체역학적 지도(Map)로 재해석되어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_10",
            "versions": {
              "v5": {
                "ko": "### 2.5. 거시 세계로의 관성적 수렴 (Convergence to Macroscopic Mechanics)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_11",
            "versions": {
              "v5": {
                "ko": "공간 진동의 궤적 유도력은 대상 질량($m$) 관성에 반비례한다. 질량이 거시 단위로 커질수록 막대한 관성력이 미세한 공간 진동을 압도하여 무시하게 되므로, 역학은 고전 뉴턴 역학으로 필연적 수렴을 이룬다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "To restore the physical reality of micro-particles and reduce wave origins to space itself, this study declares the following five core axioms."
              }
            }
          },
          {
            "id": "p2_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 2.1. Absolute Reality of Quanta"
              }
            }
          },
          {
            "id": "p2_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "All quanta are definitive 'real particles' possessing determined trajectories, regardless of observation. A particle never exists probabilistically dispersed as a wave."
              }
            }
          },
          {
            "id": "p2_v5_en_4",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 2.2. Externalization of Waveness: Geometrical Spatial Fluctuation"
              }
            }
          },
          {
            "id": "p2_v5_en_5",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Interference patterns in the double-slit emerge because the seemingly empty background space is geometrically fluctuating at infinitesimal scales. The particle is dynamically guided and refracted by the geometrical wave-fronts of this vibrating space without any physical medium."
              }
            }
          },
          {
            "id": "p2_v5_en_6",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 2.3. Observation Mechanics and Damping Effect"
              }
            }
          },
          {
            "id": "p2_v5_en_7",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The disappearance of interference patterns upon observation is not a magical wave function collapse. The photons or electromagnetic fields projected for observation are powerful physical perturbations. This energy mechanically suppresses and flattens (Damping) the microscopic spatial vibration."
              }
            }
          },
          {
            "id": "p2_v5_en_8",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 2.4. Redefinition of the Wave Function"
              }
            }
          },
          {
            "id": "p2_v5_en_9",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The wave function ($\\psi$) must be reinterpreted not as a probability distribution of existence, but as a hydrodynamic map representing the **'geometrical tensor density distribution of spatial vibration energy'** guiding the particle."
              }
            }
          },
          {
            "id": "p2_v5_en_10",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 2.5. Inertial Convergence to the Macroscopic World"
              }
            }
          },
          {
            "id": "p2_v5_en_11",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The guidance force of spatial vibration is inversely proportional to the mass ($m$) inertia. As mass scales up macroscopically, immense inertia overpowers and ignores the minute spatial vibrations, inevitably converging to classical Newtonian mechanics."
              }
            }
          },
          {
            "id": "p2_v5.1_ko_1",
            "versions": {
              "v5.1": {
                "ko": "미시 입자의 거동에 대한 결정론적 해석을 공식화하는 동시에 파동적 현상을 공간 역학에 귀속시키기 위해, 본 연구는 다음의 5가지 핵심 공리를 제안한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_2",
            "versions": {
              "v5.1": {
                "ko": "### 2.1. 미시 입자의 확정적 실재성",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_3",
            "versions": {
              "v5.1": {
                "ko": "본 논문에서 고려되는 비상대론적 시스템에 대하여, 미시 입자는 관측과 무관하게 잘 정의된 궤적을 갖는 확정적인 입자적 실체로 가정된다. 이 프레임워크에서 양자 현상의 확률적 특성은 입자 자체의 존재론적 분산이 아니라, 그 운동을 유도하는 공간 진동 구조에 기인한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_4",
            "versions": {
              "v5.1": {
                "ko": "### 2.2. 파동성의 외주화: 기하학적 공간 요동",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_5",
            "versions": {
              "v5.1": {
                "ko": "이중 슬릿 실험의 간섭 무늬는 미시적 규모에서 겉보기에 텅 빈 공간 배경의 기하학적 요동으로부터 발생하는 것으로 제안된다. 파동적 거동을 입자 자체의 내재적 퍼짐으로 취급하는 대신, 입자는 기저 기하 장의 공간적 변화에 의해 동역학적으로 유도된다고 가정한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_6",
            "versions": {
              "v5.1": {
                "ko": "### 2.3. 관측 역학과 감쇠 효과",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_7",
            "versions": {
              "v5.1": {
                "ko": "측정 하에서 간섭 무늬가 사라지는 것은 측정에 의해 유발된 섭동과 관련된 유효한 감쇠 과정의 결과로 해석된다. 측정 장치와 미시 시스템 간의 상호작용은 미시적 공간 요동의 결맞음을 억제하는 물리적 결합으로 취급된다. 이 모델에서 이러한 결합은 현상론적인 감쇠 메커니즘을 통해 공간 진동 유도 구조를 약화시킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_8",
            "versions": {
              "v5.1": {
                "ko": "### 2.4. 파동 함수의 재정의",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_9",
            "versions": {
              "v5.1": {
                "ko": "이 모델에서 파동 함수 $\\psi$는 존재론적 물질파가 아니라, 입자의 운동을 유도하는 공간 진동 구조의 유효한 수학적 재현으로 재해석된다. $\\psi$의 진폭과 위상은 공간 유도 장에 대한 정보를 인코딩하는 것으로 가정되며, 이는 추후 공간 진동 퍼텐셜 $Q_s$를 통해 표현된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_10",
            "versions": {
              "v5.1": {
                "ko": "### 2.5. 거시 세계로의 관성적 수렴",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_ko_11",
            "versions": {
              "v5.1": {
                "ko": "공간 진동 유도에 의해 유발되는 가속도는 관련 질량 척도가 증가함에 따라 감소하는 것으로 가정된다. 진폭 장의 유계된 공간적 변화를 포함한 적절한 거시적 조건 하에서 공간 진동 유도 항은 고전적 힘에 비해 무시할 수 있게 된다. 이는 거시적 극한에서 뉴턴 역학적 거동을 향한 유효한 수렴을 산출한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5.1_en_1",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "To formulate a deterministic interpretation of microscopic particle behavior while attributing wave-like phenomena to spatial dynamics, this study proposes the following core postulates."
              }
            }
          },
          {
            "id": "p2_v5.1_en_2",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 2.1. Definite Reality of Microscopic Particles"
              }
            }
          },
          {
            "id": "p2_v5.1_en_3",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "For the nonrelativistic systems considered in this paper, microscopic particles are postulated to possess definite particle-like reality and well-defined trajectories independent of observation. In this framework, the probabilistic character of quantum phenomena is not attributed to an ontological dispersion of the particle itself, but to the spatial-vibration structure that guides its motion."
              }
            }
          },
          {
            "id": "p2_v5.1_en_4",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 2.2. Externalization of Wave-like Behavior: Geometric Spatial Fluctuation"
              }
            }
          },
          {
            "id": "p2_v5.1_en_5",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Interference patterns in the double-slit experiment are proposed to arise from geometric fluctuations of the apparently empty spatial background at microscopic scales. The particle is assumed to be dynamically guided by spatial variations of the underlying geometric field, rather than by treating wave-like behavior as an intrinsic spreading of the particle itself."
              }
            }
          },
          {
            "id": "p2_v5.1_en_6",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 2.3. Observation Mechanics and Damping Effect"
              }
            }
          },
          {
            "id": "p2_v5.1_en_7",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The disappearance of interference patterns under measurement is interpreted as the result of an effective damping process associated with measurement-induced perturbation. The interaction between the measuring apparatus and the microscopic system is treated as a physical coupling that suppresses the coherence of microscopic spatial fluctuations. In this model, such coupling attenuates the spatial-vibration guidance structure through a phenomenological damping mechanism."
              }
            }
          },
          {
            "id": "p2_v5.1_en_8",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 2.4. Reinterpretation of the Wave Function"
              }
            }
          },
          {
            "id": "p2_v5.1_en_9",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "In this model, the wave function, $\\psi$, is reinterpreted not as an ontological matter wave, but as an effective mathematical representation of the spatial-vibration structure that guides particle motion. The amplitude and phase of $\\psi$ are assumed to encode information about the spatial-guidance field, which is later expressed through the spatial-vibration potential $Q_s$."
              }
            }
          },
          {
            "id": "p2_v5.1_en_10",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 2.5. Inertial Convergence to the Macroscopic World"
              }
            }
          },
          {
            "id": "p2_v5.1_en_11",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The acceleration induced by spatial-vibration guidance is assumed to decrease as the relevant mass scale increases. Under appropriate macroscopic conditions, including bounded spatial variations of the amplitude field, the spatial-vibration guidance term becomes negligible relative to classical forces. This yields an effective convergence toward Newtonian behavior in the macroscopic limit."
              }
            }
          },
          {
            "id": "p2_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "미시 입자의 거동에 대한 결정론적 해석을 공식화하는 동시에 파동적 현상을 공간 역학에 귀속시키기 위해, 본 연구는 다음의 핵심 공리를 제안한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "1. 미시 입자는 관측과 무관하게 잘 정의된 궤적을 갖는 확정적인 입자적 실체이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "2. 간섭 무늬는 미시적 규모에서 공간 배경의 기하학적 요동으로부터 발생한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_4",
            "versions": {
              "v6": {
                "ko": "3. 간섭 무늬가 사라지는 것은 측정 장치와의 물리적 섭동과 관련된 감쇠 과정의 결과이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_5",
            "versions": {
              "v6": {
                "ko": "4. 공간 진동 유도에 의해 유발되는 가속도는 질량 척도가 증가함에 따라 감소한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "To formulate a deterministic interpretation, this study proposes the following core postulates:"
              }
            }
          },
          {
            "id": "p2_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "1. **Definite Reality:** Particles possess well-defined trajectories independent of observation."
              }
            }
          },
          {
            "id": "p2_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "2. **Externalization of Waveness:** Interference patterns arise from geometric fluctuations of the apparently empty spatial background."
              }
            }
          },
          {
            "id": "p2_v6_en_4",
            "versions": {
              "v6": {
                "ko": "",
                "en": "3. **Observation Mechanics:** The disappearance of interference patterns is the result of an effective damping process."
              }
            }
          },
          {
            "id": "p2_v6_en_5",
            "versions": {
              "v6": {
                "ko": "",
                "en": "4. **Reinterpretation of $\\psi$:** The wave function represents the spatial-vibration structure that guides particle motion."
              }
            }
          },
          {
            "id": "p2_v6_en_6",
            "versions": {
              "v6": {
                "ko": "",
                "en": "5. **Inertial Convergence:** The acceleration induced by spatial-vibration guidance decreases as the relevant mass scale increases."
              }
            }
          },
          {
            "id": "p2_v7_ko_1",
            "versions": {
              "v7": {
                "ko": "### 2.1. 게이지 불변성을 띤 비선형 수정 슈뢰딩거 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_2",
            "versions": {
              "v7": {
                "ko": "열린 양자계의 코스틴(Kostin) 모델 [4]을 차용하여 공간 텐서 유체의 점성을 나타내는 실수 현상론적 비선형 항을 도입한다. 게이지 대칭성 보존을 위해 공간 기댓값을 뺀 형태로 구성된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_3",
            "versions": {
              "v7": {
                "ko": "$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V + \\gamma (S - \\langle S \\rangle) \\right] \\psi $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_4",
            "versions": {
              "v7": {
                "ko": "마찰 계수 $\\gamma$는 거시 환경과 상호작용할 때만 동역학적으로 발현되는 '유효 환경 파라미터'이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_5",
            "versions": {
              "v7": {
                "ko": "### 2.2. 극형식 변환과 연속 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_6",
            "versions": {
              "v7": {
                "ko": "$\\psi = R e^{iS/\\hbar}$로 분해하여 허수부를 분리하면 완벽한 연속 방정식이 도출된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_7",
            "versions": {
              "v7": {
                "ko": "$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{v}) = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_8",
            "versions": {
              "v7": {
                "ko": "점성 항이 실수부에만 작용하므로 전역적인 확률 밀도 $\\rho$는 완벽하게 보존된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_9",
            "versions": {
              "v7": {
                "ko": "### 2.3. 마디점(Node)의 기적적 상쇄와 자가 정칙화",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_10",
            "versions": {
              "v7": {
                "ko": "실수부 해밀턴-야코비 방정식에는 공간 진동 퍼텐셜 $Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$ 가 나타난다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_11",
            "versions": {
              "v7": {
                "ko": "마디점($R \\to 0$) 근처 2차원 소용돌이 코어에서 라플라시안에 의해 $Q_s$는 강력한 인력 우물($-\\frac{\\hbar^2}{2m r^2}$)로 발산한다. 그러나 코어 주변의 위상 회전($S = \\hbar \\theta$)에 의해 위상 운동 에너지 항 $\\frac{(\\nabla S)^2}{2m}$은 원심력 척력($+\\frac{\\hbar^2}{2m r^2}$)을 산출한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_12",
            "versions": {
              "v7": {
                "ko": "$$ \\frac{(\\nabla S)^2}{2m} + Q_s = +\\frac{\\hbar^2}{2m r^2} - \\frac{\\hbar^2}{2m r^2} = 0 \\quad (\\text{as } r \\to 0) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_ko_13",
            "versions": {
              "v7": {
                "ko": "두 기하학적 항이 수학적으로 100% 상쇄되어, 입자는 특이점으로 추락하지 않고 우회(Bypassing)하게 되어 동역학적 자가 정칙화를 이룬다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v7_en_1",
            "versions": {
              "v7": {
                "ko": "",
                "en": "### 2.1. Gauge-Invariant Non-linear Modified Schrödinger Equation"
              }
            }
          },
          {
            "id": "p2_v7_en_2",
            "versions": {
              "v7": {
                "ko": "",
                "en": "To naturally derive quantum dissipation without violating probability conservation, we introduce a phenomenological non-linear, real-valued term representing the geomechanical viscosity of the spatial tensor fluid. To strictly preserve global gauge invariance ($\\psi \\to \\psi e^{i\\theta}$), the viscosity term must subtract the spatial expectation value of the phase:"
              }
            }
          },
          {
            "id": "p2_v7_en_3",
            "versions": {
              "v7": {
                "ko": "",
                "en": "$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left( -\\frac{\\hbar^2}{2m} \\nabla^2 + V + \\gamma(S - \\langle S \\rangle) \\right) \\psi $$"
              }
            }
          },
          {
            "id": "p2_v7_en_4",
            "versions": {
              "v7": {
                "ko": "",
                "en": "Crucially, $\\gamma$ is an *effective environmental parameter* that emerges dynamically only during macroscopic thermodynamic interactions. For isolated microscopic systems, $\\gamma \\to 0$."
              }
            }
          },
          {
            "id": "p2_v7_en_5",
            "versions": {
              "v7": {
                "ko": "",
                "en": "### 2.2. Polar Transformation and the Continuity Equation"
              }
            }
          },
          {
            "id": "p2_v7_en_6",
            "versions": {
              "v7": {
                "ko": "",
                "en": "Using polar decomposition $\\psi = R e^{iS/\\hbar}$, we separate the imaginary part to yield the continuity equation:"
              }
            }
          },
          {
            "id": "p2_v7_en_7",
            "versions": {
              "v7": {
                "ko": "",
                "en": "$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{v}) = 0 $$"
              }
            }
          },
          {
            "id": "p2_v7_en_8",
            "versions": {
              "v7": {
                "ko": "",
                "en": "Because the dissipative term is purely real, probability density $\\rho$ is strictly conserved globally."
              }
            }
          },
          {
            "id": "p2_v7_en_9",
            "versions": {
              "v7": {
                "ko": "",
                "en": "### 2.3. Quantum Hamilton-Jacobi Equation and the Spatial Vibration Potential ($Q_s$)"
              }
            }
          },
          {
            "id": "p2_v7_en_10",
            "versions": {
              "v7": {
                "ko": "",
                "en": "Separating the real part yields the modified Hamilton-Jacobi equation:"
              }
            }
          },
          {
            "id": "p2_v7_en_11",
            "versions": {
              "v7": {
                "ko": "",
                "en": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s + \\gamma(S - \\langle S \\rangle) = 0 $$"
              }
            }
          },
          {
            "id": "p2_v7_en_12",
            "versions": {
              "v7": {
                "ko": "",
                "en": "where $Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$."
              }
            }
          },
          {
            "id": "p2_v7_en_13",
            "versions": {
              "v7": {
                "ko": "",
                "en": "### 2.4. Topological Regularization of Nodal Singularities"
              }
            }
          },
          {
            "id": "p2_v7_en_14",
            "versions": {
              "v7": {
                "ko": "",
                "en": "A severe mathematical dilemma occurs at destructive interference nodes where $R \\to 0$. Around a 2D vortex core ($R \\propto r$), $Q_s$ diverges as $-\\frac{\\hbar^2}{2m r^2}$, creating an infinite attractive well."
              }
            }
          },
          {
            "id": "p2_v7_en_15",
            "versions": {
              "v7": {
                "ko": "",
                "en": "However, nodes are **Quantized Topological Vortices**. Around the core, the phase field circulates as $S = \\hbar \\theta$, generating a phase gradient $\\nabla S = \\hbar/r$. When substituted into the phase kinetic energy term of Eq. (3), we obtain exactly $+\\frac{\\hbar^2}{2m r^2}$."
              }
            }
          },
          {
            "id": "p2_v7_en_16",
            "versions": {
              "v7": {
                "ko": "",
                "en": "$$ \\frac{(\\nabla S)^2}{2m} + Q_s = +\\frac{\\hbar^2}{2m r^2} - \\frac{\\hbar^2}{2m r^2} = 0 \\quad (\\text{as } r \\to 0) $$"
              }
            }
          },
          {
            "id": "p2_v7_en_17",
            "versions": {
              "v7": {
                "ko": "",
                "en": "The centrifugal repulsion perfectly and exactly cancels the infinite attractive well of $Q_s$, achieving intrinsic self-regularization."
              }
            }
          },
          {
            "id": "p2_v8_ko_1",
            "versions": {
              "v8": {
                "ko": "### 2.1. 게이지 불변성을 띤 비선형 수정 슈뢰딩거 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_2",
            "versions": {
              "v8": {
                "ko": "열린 양자계의 코스틴(Kostin) 모델 [4]을 차용하여 공간 텐서 유체의 점성을 나타내는 실수 현상론적 비선형 항을 도입한다. 게이지 대칭성 보존을 위해 공간 기댓값을 뺀 형태로 구성된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_3",
            "versions": {
              "v8": {
                "ko": "$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}) + \\gamma (S - \\langle S \\rangle) \\right] \\psi $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_4",
            "versions": {
              "v8": {
                "ko": "마찰 계수 $\\gamma$는 거시 환경과 상호작용할 때만 동역학적으로 발현되는 '유효 환경 파라미터'이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_5",
            "versions": {
              "v8": {
                "ko": "### 2.2. 극형식 변환과 연속 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_6",
            "versions": {
              "v8": {
                "ko": "$\\psi = R e^{iS/\\hbar}$로 분해하여 허수부를 분리하면 완벽한 연속 방정식이 도출된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_7",
            "versions": {
              "v8": {
                "ko": "$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{v}) = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_8",
            "versions": {
              "v8": {
                "ko": "점성 항이 실수부에만 작용하므로 전역적인 확률 밀도 $\\rho$는 완벽하게 보존된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_9",
            "versions": {
              "v8": {
                "ko": "### 2.3. 마디점(Node)의 기적적 상쇄와 자가 정칙화",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_10",
            "versions": {
              "v8": {
                "ko": "실수부 해밀턴-야코비 방정식에는 공간 진동 퍼텐셜 $Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$ 가 나타난다. 마디점 근처 2차원 소용돌이 코어에서 $Q_s$는 강력한 인력 우물($-\\frac{\\hbar^2}{2m r^2}$)로 발산한다. 그러나 코어 주변의 위상 회전($S = \\hbar \\theta$)에 의해 위상 운동 에너지 항 $\\frac{(\\nabla S)^2}{2m}$은 원심력 척력($+\\frac{\\hbar^2}{2m r^2}$)을 산출한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_11",
            "versions": {
              "v8": {
                "ko": "$$ \\frac{(\\nabla S)^2}{2m} + Q_s = \\frac{\\hbar^2}{2m r^2} - \\frac{\\hbar^2}{2m r^2} = 0 \\quad (\\text{as } r \\to 0) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_ko_12",
            "versions": {
              "v8": {
                "ko": "두 기하학적 항이 수학적으로 100% 상쇄되어 자가 정칙화(Self-regularization)를 이룬다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8_en_1",
            "versions": {
              "v8": {
                "ko": "",
                "en": "### 2.1. Gauge-Invariant Non-linear Modified Schrödinger Equation"
              }
            }
          },
          {
            "id": "p2_v8_en_2",
            "versions": {
              "v8": {
                "ko": "",
                "en": "To naturally derive quantum dissipation without violating probability conservation (unitarity), we reject imaginary potentials that lead to unphysical particle loss. Instead, drawing from the Kostin friction model [4], we introduce a phenomenological non-linear, real-valued term representing the geomechanical viscosity of the spatial tensor fluid. To strictly preserve global gauge invariance ($\\psi \\to \\psi e^{i\\theta}$), the viscosity term must subtract the spatial expectation value of the phase:"
              }
            }
          },
          {
            "id": "p2_v8_en_3",
            "versions": {
              "v8": {
                "ko": "",
                "en": "$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}) + \\gamma(S - \\langle S \\rangle) \\right] \\psi $$"
              }
            }
          },
          {
            "id": "p2_v8_en_4",
            "versions": {
              "v8": {
                "ko": "",
                "en": "Crucially, $\\gamma$ is an *effective environmental parameter* that emerges dynamically only during macroscopic thermodynamic interactions. For isolated microscopic systems, $\\gamma \\to 0$."
              }
            }
          },
          {
            "id": "p2_v8_en_5",
            "versions": {
              "v8": {
                "ko": "",
                "en": "### 2.2. Polar Transformation and the Continuity Equation"
              }
            }
          },
          {
            "id": "p2_v8_en_6",
            "versions": {
              "v8": {
                "ko": "",
                "en": "Using polar decomposition $\\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar}$, we separate the imaginary part to yield the continuity equation:"
              }
            }
          },
          {
            "id": "p2_v8_en_7",
            "versions": {
              "v8": {
                "ko": "",
                "en": "$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{v}) = 0 $$"
              }
            }
          },
          {
            "id": "p2_v8_en_8",
            "versions": {
              "v8": {
                "ko": "",
                "en": "where $\\rho = R^2$ and $\\mathbf{v} = \\nabla S / m$. Because the dissipative term is purely real, probability density $\\rho$ is strictly conserved globally."
              }
            }
          },
          {
            "id": "p2_v8_en_9",
            "versions": {
              "v8": {
                "ko": "",
                "en": "### 2.3. Quantum Hamilton-Jacobi Equation and Nodal Cancellation"
              }
            }
          },
          {
            "id": "p2_v8_en_10",
            "versions": {
              "v8": {
                "ko": "",
                "en": "Separating the real part yields the modified Hamilton-Jacobi equation:"
              }
            }
          },
          {
            "id": "p2_v8_en_11",
            "versions": {
              "v8": {
                "ko": "",
                "en": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V(\\mathbf{r}) + Q_s + \\gamma(S - \\langle S \\rangle) = 0 $$"
              }
            }
          },
          {
            "id": "p2_v8_en_12",
            "versions": {
              "v8": {
                "ko": "",
                "en": "A severe mathematical dilemma occurs at destructive interference nodes where $R \\to 0$. Around a 2D vortex core ($R \\propto r$), $Q_s$ diverges as $-\\frac{\\hbar^2}{2m r^2}$, creating an infinite attractive well."
              }
            }
          },
          {
            "id": "p2_v8_en_13",
            "versions": {
              "v8": {
                "ko": "",
                "en": "However, nodes are **Quantized Topological Vortices**. Around the core, the phase field circulates as $S = \\hbar \\theta$, generating a phase gradient $|\\nabla S| = \\hbar/r$. When substituted into the phase kinetic energy term, we obtain exactly $+\\frac{\\hbar^2}{2m r^2}$."
              }
            }
          },
          {
            "id": "p2_v8_en_14",
            "versions": {
              "v8": {
                "ko": "",
                "en": "$$ \\frac{(\\nabla S)^2}{2m} + Q_s = \\frac{\\hbar^2}{2m r^2} - \\frac{\\hbar^2}{2m r^2} = 0 \\quad (\\text{as } r \\to 0) $$"
              }
            }
          },
          {
            "id": "p2_v8_en_15",
            "versions": {
              "v8": {
                "ko": "",
                "en": "The centrifugal repulsion perfectly and exactly cancels the infinite attractive well of $Q_s$, achieving intrinsic self-regularization without arbitrary cutoffs."
              }
            }
          },
          {
            "id": "p2_v8.1_ko_1",
            "versions": {
              "v8.1": {
                "ko": "### 2.1. 게이지 불변성을 띤 비선형 수정 슈뢰딩거 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8.1_ko_2",
            "versions": {
              "v8.1": {
                "ko": "$$i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}) + \\gamma (S - \\langle S \\rangle) \\right] \\psi$$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8.1_ko_3",
            "versions": {
              "v8.1": {
                "ko": "### 2.2. 마디점의 기적적 상쇄",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8.1_ko_4",
            "versions": {
              "v8.1": {
                "ko": "마디점 근처에서 위상 회전에 의한 원심 척력($+\\frac{\\hbar^2}{2mr^2}$)이 $Q_s$의 인력 우물($-\\frac{\\hbar^2}{2mr^2}$)을 상쇄하여 특이점 문제를 해결한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v8.1_en_1",
            "versions": {
              "v8.1": {
                "ko": "",
                "en": "### 2.1. Gauge-Invariant Non-linear Modified Schrödinger Equation"
              }
            }
          },
          {
            "id": "p2_v8.1_en_2",
            "versions": {
              "v8.1": {
                "ko": "",
                "en": "To derive quantum dissipation without violating unitarity, we introduce a phenomenological viscosity term:"
              }
            }
          },
          {
            "id": "p2_v8.1_en_3",
            "versions": {
              "v8.1": {
                "ko": "",
                "en": "$$i\\hbar \\frac{\\partial \\psi}{\\partial t} = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r}) + \\gamma(S - \\langle S \\rangle) \\right] \\psi$$"
              }
            }
          },
          {
            "id": "p2_v8.1_en_4",
            "versions": {
              "v8.1": {
                "ko": "",
                "en": "### 2.2. Topological Regularization"
              }
            }
          },
          {
            "id": "p2_v8.1_en_5",
            "versions": {
              "v8.1": {
                "ko": "",
                "en": "At nodes where $R \\to 0$, the spatial-vibration potential $Q_s$ diverges. However, nodes are **Quantized Topological Vortices**. The centrifugal repulsion ($+\\frac{\\hbar^2}{2m r^2}$) perfectly cancels the attractive well ($-\\frac{\\hbar^2}{2m r^2}$), achieving intrinsic self-regularization."
              }
            }
          }
        ]
      },
      {
        "number": 3,
        "title": {
          "ko": "3. 관측 붕괴와 결어긋남",
          "en": "3. Decoherence and Scaling Law"
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
              },
              "v4": {
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
              },
              "v4": {
                "ko": "",
                "en": "$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi $$"
              },
              "v5": {
                "ko": "",
                "en": "$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi $$"
              },
              "v5.1": {
                "ko": "",
                "en": "$$ i\\hbar\\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\nabla^2\\psi + V\\psi $$"
              },
              "v6": {
                "ko": "",
                "en": "$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi $$"
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
              },
              "v4": {
                "ko": "### 3.2. 방정식의 분해 및 유도 과정",
                "en": "### Decomposition and Derivation"
              },
              "v5": {
                "ko": "### 3.2. 방정식의 분해 및 유도 과정",
                "en": "### Decomposition and Derivation"
              },
              "v5.1": {
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
              },
              "v4": {
                "ko": "",
                "en": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0 $$"
              },
              "v5": {
                "ko": "",
                "en": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V - \\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} = 0 $$"
              },
              "v5.1": {
                "ko": "",
                "en": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0 $$"
              },
              "v6": {
                "ko": "",
                "en": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0, \\quad Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} $$"
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
              },
              "v4": {
                "ko": "",
                "en": "$$ Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} $$"
              },
              "v5": {
                "ko": "",
                "en": "$$ Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} \\quad \\Rightarrow \\quad \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0 $$"
              },
              "v5.1": {
                "ko": "",
                "en": "$$ Q_s \\equiv -\\frac{\\hbar^2}{2m}\\frac{\\nabla^2 R}{R} $$"
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
              },
              "v4": {
                "ko": "*이 방정식은 입자가 외부 퍼텐셜($V$)뿐만 아니라, 기하학적 요동($Q_s$)에 의해 수역학적으로 유도됨을 증명한다.*",
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
              },
              "v4": {
                "ko": "",
                "en": "$$ \\frac{\\partial R^2}{\\partial t} + \\nabla \\cdot \\left( R^2 \\frac{\\nabla S}{m} \\right) = 0 $$"
              },
              "v5": {
                "ko": "",
                "en": "$$ \\frac{\\partial R^2}{\\partial t} + \\nabla \\cdot \\left( R^2 \\frac{\\nabla S}{m} \\right) = 0 $$"
              },
              "v5.1": {
                "ko": "",
                "en": "$$ \\frac{\\partial R^2}{\\partial t} + \\nabla\\cdot \\left( \\frac{R^2\\nabla S}{m} \\right) = 0 $$"
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
              },
              "v4": {
                "ko": "이 식은 '공간의 진동 에너지가 유실되지 않고 흐름(Flow)을 유지하며 보존된다'는 실재를 의미한다.",
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
          },
          {
            "id": "p3_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "본 연구는 슈뢰딩거 방정식의 수학적 구조를 보존하면서도, 그 의미를 '확률적 파동 함수의 붕괴'에서 '공간 기하학적 요동의 역학'으로 재정의한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "### 3.1. 파동 함수의 극좌표 변환 (Polar Transformation)",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "$$ i\\hbar \\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m} \\nabla^2 \\psi + V\\psi $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_5",
            "versions": {
              "v4": {
                "ko": "우리는 파동 함수 $\\psi(\\mathbf{r}, t)$를 기하학적 진폭 $R(\\mathbf{r}, t)$와 위상 작용 $S(\\mathbf{r}, t)$를 사용하여 극좌표 형태로 분해한다 [2]:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_6",
            "versions": {
              "v4": {
                "ko": "$$ \\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_8",
            "versions": {
              "v4": {
                "ko": "$\\psi$를 슈뢰딩거 방정식에 대입하여 미분한 뒤 양변에서 $e^{iS/\\hbar}$를 소거하면 실수부와 허수부가 분리된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_9",
            "versions": {
              "v4": {
                "ko": "**[실수부 (Real Part): 양자 해밀턴-야코비 방정식]**",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_10",
            "versions": {
              "v4": {
                "ko": "실수부 항을 정리하면 고전 역학의 해밀턴-야코비 방정식에 양자적 섭동 항이 추가된 형태가 도출된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_11",
            "versions": {
              "v4": {
                "ko": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V - \\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_12",
            "versions": {
              "v4": {
                "ko": "본 모델에서는 추가된 이 항을 **'공간 진동 퍼텐셜(Spatial Vibration Potential, $Q_s$)'**이라 명명한다. 이는 과거 데이비드 봄(D. Bohm)이 은닉 변수 이론에서 유도한 양자 퍼텐셜 구조와 대수적으로 동일하나 [3], 본 연구에서는 이를 입자 내부의 가상의 힘이 아닌 **'배경 공간 자체의 기하학적 요동 에너지'**로 완전히 새롭게 재정의한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_13",
            "versions": {
              "v4": {
                "ko": "$$ Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_14",
            "versions": {
              "v4": {
                "ko": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_16",
            "versions": {
              "v4": {
                "ko": "**[허수부 (Imaginary Part): 연속 방정식]**",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_17",
            "versions": {
              "v4": {
                "ko": "허수부 항을 정리하면, 진동 에너지 밀도($R^2$)가 공간에서 보존됨을 나타내는 연속 방정식이 도출된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_18",
            "versions": {
              "v4": {
                "ko": "$$ \\frac{\\partial R^2}{\\partial t} + \\nabla \\cdot \\left( R^2 \\frac{\\nabla S}{m} \\right) = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_20",
            "versions": {
              "v4": {
                "ko": "### 3.3. 선행 이론의 비판적 고찰: 기하 역학으로의 승화",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_21",
            "versions": {
              "v4": {
                "ko": "봄 역학은 입자를 유도하는 파동의 실체를 다차원의 '가상의 형상 공간'에 존재하는 신비한 힘으로 남겨두었다. 본 모델은 $\\nabla^2 R$ 항을 **'3차원 물리적 무대를 채우고 있는 진공 공간 자체의 기하학적 곡률'**로 정의함으로써, 은닉 변수 이론의 형이상학적 한계를 타파하고 양자 현상을 완벽히 실재적이고 관측 가능한 기하 역학(Geometrical Dynamics)의 영역으로 끌어내린다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "This chapter mathematically proves how the Schrödinger equation transforms into a 'spatial vibration equation' describing physical reality."
              }
            }
          },
          {
            "id": "p3_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 3.1. Polar Transformation"
              }
            }
          },
          {
            "id": "p3_v4_en_3",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Defining the Schrödinger equation:"
              }
            }
          },
          {
            "id": "p3_v4_en_5",
            "versions": {
              "v4": {
                "ko": "",
                "en": "We decompose the wave function $\\psi(\\mathbf{r}, t)$ into a polar form using the geometrical amplitude $R(\\mathbf{r}, t)$ and phase action $S(\\mathbf{r}, t)$ [2]:"
              }
            }
          },
          {
            "id": "p3_v4_en_6",
            "versions": {
              "v4": {
                "ko": "",
                "en": "$$ \\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar} $$"
              }
            }
          },
          {
            "id": "p3_v4_en_7",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 3.2. Equation Decomposition and Derivation"
              }
            }
          },
          {
            "id": "p3_v4_en_8",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Substituting $\\psi$ into the Schrödinger equation and separating the real and imaginary parts yields:"
              }
            }
          },
          {
            "id": "p3_v4_en_9",
            "versions": {
              "v4": {
                "ko": "",
                "en": "**[Real Part: Quantum Hamilton-Jacobi Equation]**"
              }
            }
          },
          {
            "id": "p3_v4_en_10",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Rearranging the real part yields a form where a quantum perturbation term is added to the classical Hamilton-Jacobi equation."
              }
            }
          },
          {
            "id": "p3_v4_en_12",
            "versions": {
              "v4": {
                "ko": "",
                "en": "In this model, the added term is defined as the **'Spatial Vibration Potential ($Q_s$)'**. While its mathematical structure is identical to the quantum potential in Bohm's hidden-variable theory [3], this study completely redefines it not as an unknown internal force, but as the **'geometrical fluctuation energy of the background space itself'**."
              }
            }
          },
          {
            "id": "p3_v4_en_15",
            "versions": {
              "v4": {
                "ko": "",
                "en": "**[Imaginary Part: Continuity Equation]**"
              }
            }
          },
          {
            "id": "p3_v4_en_16",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Rearranging the imaginary part yields a continuity equation indicating the conservation of vibration energy density ($R^2$) in space."
              }
            }
          },
          {
            "id": "p3_v4_en_18",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 3.3. Critical Review of Preceding Theories"
              }
            }
          },
          {
            "id": "p3_v4_en_19",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Bohmian mechanics failed to identify the physical reality of the pilot-wave, leaving it as a mysterious force residing in an abstract 'configuration space'. By interpreting the Laplacian term ($\\nabla^2 R$) as the geometrical curvature of the 3D physical background space, this model breaks through the metaphysical limitations of hidden-variable theories, bringing quantum phenomena into the realm of observable deterministic Geometrical Dynamics."
              }
            }
          },
          {
            "id": "p3_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "본 장은 슈뢰딩거 방정식의 수학적 구조를 보존하되, 그 물리적 의미를 '공간 기하학적 요동의 역학'으로 역설계한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "### 3.1. 파동 함수의 극좌표 변환 (Polar Transformation)",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "슈뢰딩거 방정식의 파동 함수 $\\psi(\\mathbf{r}, t)$를 기하학적 진폭 $R(\\mathbf{r}, t)$와 위상 작용 $S(\\mathbf{r}, t)$를 사용하여 극좌표 형태로 분해한다 [2]:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_4",
            "versions": {
              "v5": {
                "ko": "$$ \\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_6",
            "versions": {
              "v5": {
                "ko": "**[실수부: 양자 해밀턴-야코비 방정식]**",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_7",
            "versions": {
              "v5": {
                "ko": "실수부 항을 정리하면 고전 역학 방정식에 양자적 섭동 항이 추가된 형태가 도출된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_8",
            "versions": {
              "v5": {
                "ko": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V - \\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_9",
            "versions": {
              "v5": {
                "ko": "본 모델에서는 추가된 이 마지막 항을 **'공간 진동 퍼텐셜(Spatial Vibration Potential, $Q_s$)'**이라 명명한다. 이는 데이비드 봄(D. Bohm)의 '양자 퍼텐셜' 구조와 대수적으로 동일하나 [3], 본 연구는 이를 형이상학적 은닉 변수가 아닌 **'3차원 물리적 배경 공간 자체의 기하학적 요동 에너지'**로 완전히 새롭게 재정의한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_10",
            "versions": {
              "v5": {
                "ko": "$$ Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} \\quad \\Rightarrow \\quad \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_11",
            "versions": {
              "v5": {
                "ko": "**[허수부: 연속 방정식]**",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_12",
            "versions": {
              "v5": {
                "ko": "$$ \\frac{\\partial R^2}{\\partial t} + \\nabla \\cdot \\left( R^2 \\frac{\\nabla S}{m} \\right) = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_13",
            "versions": {
              "v5": {
                "ko": "이 식은 진동 에너지 밀도($R^2$)가 공간에서 유실 없이 보존됨을 의미한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_14",
            "versions": {
              "v5": {
                "ko": "### 3.3. 선행 이론의 비판적 고찰: 기하 역학으로의 승화",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_15",
            "versions": {
              "v5": {
                "ko": "봄 역학은 입자를 유도하는 파동의 실체를 다차원의 '가상의 형상 공간'에 존재하는 신비한 힘으로 남겨두었다. 본 모델은 $\\nabla^2 R$ 항을 **'3차원 물리적 무대를 채우고 있는 진공 공간 자체의 기하학적 곡률'**로 정의함으로써, 은닉 변수 이론의 형이상학적 한계를 타파하고 양자 현상을 완벽히 실재적이고 관측 가능한 기하 역학(Geometrical Dynamics)의 영역으로 끌어내린다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "This chapter reverse-engineers the Schrödinger equation to transform its physical meaning into the mechanics of spatial geometrical fluctuation."
              }
            }
          },
          {
            "id": "p3_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 3.1. Polar Transformation"
              }
            }
          },
          {
            "id": "p3_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Defining the Schrödinger equation:"
              }
            }
          },
          {
            "id": "p3_v5_en_5",
            "versions": {
              "v5": {
                "ko": "",
                "en": "We decompose the wave function $\\psi(\\mathbf{r}, t)$ into a polar form using the geometrical amplitude $R(\\mathbf{r}, t)$ and phase action $S(\\mathbf{r}, t)$ [2]:"
              }
            }
          },
          {
            "id": "p3_v5_en_6",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ \\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar} $$"
              }
            }
          },
          {
            "id": "p3_v5_en_7",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 3.2. Equation Decomposition and Derivation"
              }
            }
          },
          {
            "id": "p3_v5_en_8",
            "versions": {
              "v5": {
                "ko": "",
                "en": "**[Real Part: Quantum Hamilton-Jacobi Equation]**"
              }
            }
          },
          {
            "id": "p3_v5_en_9",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Rearranging the real part yields the classical Hamilton-Jacobi equation with an added quantum perturbation term."
              }
            }
          },
          {
            "id": "p3_v5_en_11",
            "versions": {
              "v5": {
                "ko": "",
                "en": "This added term is defined as the **'Spatial Vibration Potential ($Q_s$)'**. Although algebraically identical to Bohm's quantum potential [3], this study completely redefines it not as a metaphysical hidden variable, but as the **'geometrical fluctuation energy of the 3D physical background space itself'**."
              }
            }
          },
          {
            "id": "p3_v5_en_13",
            "versions": {
              "v5": {
                "ko": "",
                "en": "**[Imaginary Part: Continuity Equation]**"
              }
            }
          },
          {
            "id": "p3_v5_en_15",
            "versions": {
              "v5": {
                "ko": "",
                "en": "This proves that spatial vibration energy density ($R^2$) is conserved, maintaining a physical flow without loss in 4D spacetime."
              }
            }
          },
          {
            "id": "p3_v5_en_16",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 3.3. Critical Review of Preceding Theories"
              }
            }
          },
          {
            "id": "p3_v5_en_17",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Bohmian mechanics failed to identify the physical reality of the pilot-wave, leaving it as a mysterious force residing in an abstract 'configuration space'. By interpreting the Laplacian term ($\\nabla^2 R$) as the **'geometrical curvature of the 3D physical background vacuum space'**, this model breaks through the metaphysical limitations of hidden-variable theories, bringing quantum phenomena into the realm of observable deterministic Geomechanical Dynamics."
              }
            }
          },
          {
            "id": "p3_v5.1_ko_1",
            "versions": {
              "v5.1": {
                "ko": "이 절은 공간 기하학적 요동 측면에서 물리적 해석을 재정립하기 위해 슈뢰딩거 방정식을 재정식화한다. 이 절의 분석은 단일 비상대론적 스핀리스(spinless) 입자에 국한된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_2",
            "versions": {
              "v5.1": {
                "ko": "### 3.1. 극형식 변환",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_3",
            "versions": {
              "v5.1": {
                "ko": "시간에 의존하는 슈뢰딩거 방정식에서 출발하여:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_4",
            "versions": {
              "v5.1": {
                "ko": "$$ i\\hbar\\frac{\\partial \\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\nabla^2\\psi + V\\psi \\tag{1} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_5",
            "versions": {
              "v5.1": {
                "ko": "우리는 실수 비음수 진폭 $R(\\mathbf{r},t) \\ge 0$와 실수 작용 함수 $S(\\mathbf{r},t) \\in \\mathbb{R}$를 사용하여 파동 함수 $\\psi(\\mathbf{r},t)$를 극형식으로 분해한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_6",
            "versions": {
              "v5.1": {
                "ko": "$$ \\psi(\\mathbf{r},t) = R(\\mathbf{r},t)e^{iS(\\mathbf{r},t)/\\hbar} \\tag{2} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_8",
            "versions": {
              "v5.1": {
                "ko": "**a. 실수부: 양자 해밀턴-야코비 방정식**",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_9",
            "versions": {
              "v5.1": {
                "ko": "실수부를 분리하면 양자 퍼텐셜 항이 추가된 해밀턴-야코비 형태의 방정식이 도출된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_10",
            "versions": {
              "v5.1": {
                "ko": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V - \\frac{\\hbar^2}{2m}\\frac{\\nabla^2 R}{R} = 0 \\tag{3} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_11",
            "versions": {
              "v5.1": {
                "ko": "추가적인 항은 여기서 공간 진동 퍼텐셜 $Q_s$로 정의된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_12",
            "versions": {
              "v5.1": {
                "ko": "$$ Q_s \\equiv -\\frac{\\hbar^2}{2m}\\frac{\\nabla^2 R}{R} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_13",
            "versions": {
              "v5.1": {
                "ko": "따라서,",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_14",
            "versions": {
              "v5.1": {
                "ko": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0 \\tag{4} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_15",
            "versions": {
              "v5.1": {
                "ko": "이 정식화에서 $Q_s$는 스칼라 퍼텐셜이다. 이를 물리적 공간의 기하학적 요동에 대한 척도로 해석하는 것은 극형식 분해의 결과라기보다는 본 모델의 추가적인 물리적 공리로 도입된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_16",
            "versions": {
              "v5.1": {
                "ko": "**b. 허수부: 연속 방정식**",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_17",
            "versions": {
              "v5.1": {
                "ko": "허수부를 분리하면 연속 방정식이 도출된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_18",
            "versions": {
              "v5.1": {
                "ko": "$$ \\frac{\\partial R^2}{\\partial t} + \\nabla\\cdot \\left( \\frac{R^2\\nabla S}{m} \\right) = 0 \\tag{5} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_19",
            "versions": {
              "v5.1": {
                "ko": "$\\rho=R^2$ 및 $\\mathbf{v}=\\nabla S/m$로 정의하면, 이 방정식은 다음과 같이 다시 쓸 수 있다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_20",
            "versions": {
              "v5.1": {
                "ko": "$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla\\cdot(\\rho \\mathbf{v}) = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_21",
            "versions": {
              "v5.1": {
                "ko": "표준 양자역학에서 $\\rho = |\\psi|^2$는 확률 밀도로 해석된다. 본 모델에서 $\\rho$는 공간 진동 구조와 연관된 유효 밀도로서 추가적인 해석을 부여받으며, 이는 별도의 물리적 공리를 요구한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_22",
            "versions": {
              "v5.1": {
                "ko": "### 3.3. 선행 이론들과의 관계",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_23",
            "versions": {
              "v5.1": {
                "ko": "봄 역학은 입자 궤적이 파동 함수에 의해 유도되는 결정론적 해석을 제공한다. 본 정식화는 비상대론적 단일 입자 슈뢰딩거 방정식 수준에서 마델룽/봄 분해와 수학적으로 동일하며, $Q_s$는 대수적으로 봄의 양자 퍼텐셜과 동일하다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_ko_24",
            "versions": {
              "v5.1": {
                "ko": "본 연구에서 제안하는 차이점은 대수적인 것이 아니라 존재론적인 것이다. 양자 퍼텐셜을 형상 공간(configuration space)의 비고전적 유도 항으로 취급하는 대신, 본 모델은 $Q_s$를 물리적 공간 배경의 기하학적 요동에 대한 유효 스칼라 척도로 해석한다. 다입자 시스템에 대한 이러한 확장은 진폭 $R$이 일반적으로 3차원 공간이 아닌 형상 공간에서 정의되기 때문에 추가적인 정식화를 필요로 하며, 이는 얽힘 상관관계를 다루는 데 특히 중요하다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5.1_en_1",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "This section reformulates the Schrödinger equation in order to reinterpret its physical interpretation in terms of spatial geometric fluctuations. The analysis in this section is limited to a single nonrelativistic spinless particle."
              }
            }
          },
          {
            "id": "p3_v5.1_en_2",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 3.1. Polar Transformation"
              }
            }
          },
          {
            "id": "p3_v5.1_en_3",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Starting from the time-dependent Schrödinger equation,"
              }
            }
          },
          {
            "id": "p3_v5.1_en_5",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "we decompose the wave function $\\psi(\\mathbf{r},t)$ into polar form using a real non-negative amplitude $R(\\mathbf{r},t) \\ge 0$ and a real action function $S(\\mathbf{r},t) \\in \\mathbb{R}$:"
              }
            }
          },
          {
            "id": "p3_v5.1_en_6",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\psi(\\mathbf{r},t) = R(\\mathbf{r},t)e^{iS(\\mathbf{r},t)/\\hbar} $$"
              }
            }
          },
          {
            "id": "p3_v5.1_en_7",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 3.2. Equation Decomposition and Derivation"
              }
            }
          },
          {
            "id": "p3_v5.1_en_8",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "**[Real Part: Quantum Hamilton-Jacobi Equation]**"
              }
            }
          },
          {
            "id": "p3_v5.1_en_9",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Separating the real part yields a Hamilton-Jacobi-type equation with an additional quantum-potential term:"
              }
            }
          },
          {
            "id": "p3_v5.1_en_11",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The additional term is defined here as the spatial-vibration potential, $Q_s$:"
              }
            }
          },
          {
            "id": "p3_v5.1_en_13",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Accordingly,"
              }
            }
          },
          {
            "id": "p3_v5.1_en_15",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "In this formulation, $Q_s$ is a scalar potential. Its interpretation as a measure of spatial geometric fluctuation is introduced as an additional physical postulate of the present model, rather than as a direct consequence of the polar decomposition alone."
              }
            }
          },
          {
            "id": "p3_v5.1_en_16",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "**[Imaginary Part: Continuity Equation]**"
              }
            }
          },
          {
            "id": "p3_v5.1_en_17",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Separating the imaginary part yields the continuity equation:"
              }
            }
          },
          {
            "id": "p3_v5.1_en_19",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Defining $\\rho=R^2$ and $\\mathbf{v}=\\nabla S/m$, this equation can be written as"
              }
            }
          },
          {
            "id": "p3_v5.1_en_20",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\frac{\\partial \\rho}{\\partial t} + \\nabla\\cdot(\\rho \\mathbf{v}) = 0 $$"
              }
            }
          },
          {
            "id": "p3_v5.1_en_21",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "In standard quantum mechanics, $\\rho = |\\psi|^2$ is interpreted as the probability density. In the present model, $\\rho$ is further assigned an effective physical interpretation as a density associated with the spatial-vibration structure. This additional interpretation requires a separate physical postulate and does not follow from the continuity equation alone."
              }
            }
          },
          {
            "id": "p3_v5.1_en_22",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 3.3. Relation to Preceding Theories"
              }
            }
          },
          {
            "id": "p3_v5.1_en_23",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Bohmian mechanics provides a deterministic interpretation in which particle trajectories are guided by the wave function. The present formulation is mathematically equivalent to the Madelung/Bohmian decomposition at the level of the nonrelativistic single-particle Schrödinger equation. In particular, $Q_s$ is algebraically identical to Bohm's quantum potential."
              }
            }
          },
          {
            "id": "p3_v5.1_en_24",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The distinction proposed in this study is ontological rather than algebraic. Rather than treating the quantum potential solely as a nonclassical guiding term in configuration space, the present model interprets $Q_s$ as an effective scalar measure of geometric fluctuation in the physical spatial background. This identification is introduced as a postulate of the Spatial Vibration hypothesis and must be supported by further physical modeling."
              }
            }
          },
          {
            "id": "p3_v5.1_en_25",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The extension of this interpretation to many-particle systems requires additional formulation, since the amplitude $R$ is generally defined on configuration space rather than ordinary three-dimensional space. This issue is particularly important for any treatment of entanglement correlations."
              }
            }
          },
          {
            "id": "p3_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "비상대론적 슈뢰딩거 방정식에서 파동 함수 $\\psi(\\mathbf{r}, t)$를 극형식으로 분해한다. 실수부를 분리하면 양자 퍼텐셜 항이 추가된 해밀턴-야코비 형태의 방정식이 도출된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = 0, \\quad Q_s \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "**노달 특이점의 정칙화:** 상쇄 간섭 노드($R \\to 0$)에서 $Q_s$가 발산하는 비물리적 현상을 해결하기 위해 진폭 $R$은 최소 위상 기저값 $R_{min} > 0$으로 유계된다고 가정하여 정칙화된 퍼텐셜을 제안한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_4",
            "versions": {
              "v6": {
                "ko": "$$ Q_s^{reg} \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{\\sqrt{R^2 + R_{min}^2}} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_5",
            "versions": {
              "v6": {
                "ko": "**3N차원 배위 공간 딜레마 해소:** 다입자 시스템에 대해 본 모델은 3N차원 공간이 다중 연결된 3차원 물리적 위상을 평탄한 유클리드 공간에 투영하여 생긴 환영이라고 가설을 세운다. 얽힌 입자들은 3차원 공간 내에 국소화되고 극도로 뒤틀린 위상 튜브를 통해 기하학적 거리를 단락시킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 3.1. Polar Transformation"
              }
            }
          },
          {
            "id": "p3_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Starting from the time-dependent Schrödinger equation:"
              }
            }
          },
          {
            "id": "p3_v6_en_4",
            "versions": {
              "v6": {
                "ko": "",
                "en": "we decompose $\\psi(\\mathbf{r}, t)$ into polar form:"
              }
            }
          },
          {
            "id": "p3_v6_en_5",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ \\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar} $$"
              }
            }
          },
          {
            "id": "p3_v6_en_6",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 3.2. Equation Decomposition and Regularization of Nodal Singularities"
              }
            }
          },
          {
            "id": "p3_v6_en_7",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Separating the real part yields a Hamilton-Jacobi-type equation:"
              }
            }
          },
          {
            "id": "p3_v6_en_9",
            "versions": {
              "v6": {
                "ko": "",
                "en": "A critical mathematical dilemma arises at destructive interference nodes where $R \\to 0$. To resolve this, we introduce a regularization mechanism based on zero-point vacuum fluctuations ($R_{min} > 0$)."
              }
            }
          },
          {
            "id": "p3_v6_en_10",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ Q_s^{reg} \\equiv -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{\\sqrt{R^2 + R_{min}^2}} $$"
              }
            }
          },
          {
            "id": "p3_v6_en_11",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Consequently, $Q_s$ reaches a finite geometrical tensor peak at the nodes, acting as a mechanical threshold."
              }
            }
          },
          {
            "id": "p3_v6_en_12",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 3.3. Resolution of the 3N-Dimensional Dilemma"
              }
            }
          },
          {
            "id": "p3_v6_en_13",
            "versions": {
              "v6": {
                "ko": "",
                "en": "For many-particle systems, traditional hidden-variable models define $Q_s$ in an abstract $3N$-dimensional configuration space. The present model circumvents this by restricting dynamics to physical 3D space via a **multiply-connected topology**. Entangled particles share a geometrical phase guided by localized, highly warped topological phase tubes within 3D space, which effectively short-circuit the internal geometrical metric."
              }
            }
          },
          {
            "id": "p3_v7_ko_1",
            "versions": {
              "v7": {
                "ko": "해밀턴-야코비 방정식의 기울기를 취하면 유도 운동 방정식이 도출된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v7_ko_2",
            "versions": {
              "v7": {
                "ko": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V - \\nabla Q_s - \\gamma m \\mathbf{v} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v7_ko_3",
            "versions": {
              "v7": {
                "ko": "간섭 무늬 $|\\psi|^2$는 보른 규칙 초기 분포를 조건으로 기하학적 계곡을 따라 누적되는 궤적들의 앙상블로 해석된다 [5].",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v7_en_1",
            "versions": {
              "v7": {
                "ko": "",
                "en": "Taking the gradient of Eq. (3) yields the guidance equation:"
              }
            }
          },
          {
            "id": "p3_v7_en_2",
            "versions": {
              "v7": {
                "ko": "",
                "en": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla (V + Q_s) - \\gamma m \\mathbf{v} $$"
              }
            }
          },
          {
            "id": "p3_v7_en_3",
            "versions": {
              "v7": {
                "ko": "",
                "en": "The double-slit interference pattern $|\\psi|^2$ is interpreted as a statistical ensemble of particle trajectories accumulating along stable valleys of $Q_s$ [4]. Transitions, tunneling, and superposition are reinterpreted as rapid reconfigurations, phase-mediated transmissions, and dynamically balanced saddle points, respectively."
              }
            }
          },
          {
            "id": "p3_v8_ko_1",
            "versions": {
              "v8": {
                "ko": "해밀턴-야코비 방정식의 기울기를 취하면 유도 운동 방정식이 도출된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v8_ko_2",
            "versions": {
              "v8": {
                "ko": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t) - \\gamma m \\mathbf{v} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v8_ko_3",
            "versions": {
              "v8": {
                "ko": "간섭 무늬 $|\\psi|^2$는 보른 규칙 초기 분포를 조건으로 기하학적 계곡을 따라 누적되는 궤적들의 앙상블로 해석된다 [5].",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v8_en_1",
            "versions": {
              "v8": {
                "ko": "",
                "en": "Taking the gradient of Eq. (3) yields the guidance equation:"
              }
            }
          },
          {
            "id": "p3_v8_en_2",
            "versions": {
              "v8": {
                "ko": "",
                "en": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t) - \\gamma m \\mathbf{v} $$"
              }
            }
          },
          {
            "id": "p3_v8_en_3",
            "versions": {
              "v8": {
                "ko": "",
                "en": "The double-slit interference pattern $|\\psi|^2$ is interpreted as a statistical ensemble of particle trajectories accumulating along stable valleys of $Q_s$ [5]. Transitions, tunneling, and superposition are reinterpreted as rapid reconfigurations, phase-mediated transmissions, and dynamically balanced saddle points, respectively."
              }
            }
          },
          {
            "id": "p3_v8.1_ko_1",
            "versions": {
              "v8.1": {
                "ko": "측정 상호작용은 공간 위상($S$)에 고주파 노이즈를 주입하여 **'위상 난류'**를 유도한다. 이는 확률 밀도를 보존하면서도 밀도 행렬의 간섭항을 지수적으로 소거하여 결어긋남을 동역학적으로 설명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v8.1_en_1",
            "versions": {
              "v8.1": {
                "ko": "",
                "en": "Measurement injects thermodynamic noise into the spatial phase ($S$), generating **'Phase Turbulence'**. This scrambles the velocity field, suppressing off-diagonal interference terms. The predicted **'Tensor-Thermodynamic Scaling Law'** provides a falsifiable experimental test for this geomechanical framework."
              }
            }
          }
        ]
      },
      {
        "number": 4,
        "title": {
          "ko": "4. 결론",
          "en": "4. Conclusion"
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
              },
              "v4": {
                "ko": "",
                "en": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t) $$"
              },
              "v5": {
                "ko": "",
                "en": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t) $$"
              },
              "v5.1": {
                "ko": "",
                "en": "$$ m\\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r},t) $$"
              },
              "v6": {
                "ko": "",
                "en": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t) $$"
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
              },
              "v5.1": {
                "ko": "",
                "en": "In the double-slit experiment, regions near destructive-interference nodes, where $R$ approaches zero, can produce sharp variations in $Q_s$, while regions of constructive interference correspond to more stable trajectory channels. The particle is therefore modeled as being guided through a spatial-vibration potential landscape."
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
              },
              "v4": {
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
              },
              "v4": {
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
              },
              "v4": {
                "ko": "",
                "en": "$$ \\mathbf{r}(t) = \\mathbf{r}_0 + \\int_0^t \\frac{\\nabla S(\\mathbf{r}, t')}{m} dt' $$"
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
          },
          {
            "id": "p4_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "### 4.1. 유도 운동 방정식 (Guidance Equation of Motion)",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "해밀턴-야코비 방정식을 공간에 대해 미분($\\nabla$)하면 입자가 받는 역학적 운동 방정식이 도출된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_3",
            "versions": {
              "v4": {
                "ko": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "여기서 $-\\nabla Q_s(\\mathbf{r}, t)$는 공간 자체의 기하학적 곡률이 입자를 밀어내는 **'유도력(Guidance Force)'**이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_6",
            "versions": {
              "v4": {
                "ko": "두 슬릿을 빠져나온 공간 요동은 상쇄 간섭($R \\to 0$) 지점에서 거대한 $Q_s$ 척력 장벽(산맥)을 형성하며, 보강 간섭 지점은 에너지가 낮은 골짜기가 된다. 단일 슬릿을 직진하려던 실재하는 입자는 이 $-\\nabla Q_s$의 척력 장벽에 부딪혀 골짜기로 미끄러지듯 강제 유도되어 스크린을 향해 궤적이 굴절된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_8",
            "versions": {
              "v4": {
                "ko": "단일 입자의 궤적은 결정론적 경로를 따른다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_9",
            "versions": {
              "v4": {
                "ko": "$$ \\mathbf{r}(t) = \\mathbf{r}_0 + \\int_0^t \\frac{\\nabla S(\\mathbf{r}, t')}{m} dt' $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_10",
            "versions": {
              "v4": {
                "ko": "스크린의 간섭 무늬가 확률적 분포($|\\psi|^2$)를 띠는 이유는 실험자가 무수히 발사하는 입자들의 극미세한 초기 발사 위치($\\mathbf{r}_0$)를 완벽하게 동일하게 제어할 수 없기 때문이다. 결론적으로, 간섭 패턴은 무작위한 초기 위치를 가진 입자들이 미리 깎여진 진동 지형도 수로(Channel)를 따라 누적되었을 때 나타나는 **'통계학적 앙상블(Statistical Ensemble)'**일 뿐이다. 이러한 진동 파동에 의한 궤적 유도는 거시적 액적(Walking droplets) 실험을 통해서도 물리적 타당성이 성공적으로 입증되었다 [4].",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 4.1. Guidance Equation of Motion"
              }
            }
          },
          {
            "id": "p4_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Taking the gradient ($\\nabla$) of the Hamilton-Jacobi equation yields the particle's equation of motion:"
              }
            }
          },
          {
            "id": "p4_v4_en_4",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Here, $-\\nabla Q_s(\\mathbf{r}, t)$ is the **'Guidance Force'** where the geometrical curvature of space itself repels and steers the particle."
              }
            }
          },
          {
            "id": "p4_v4_en_5",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 4.2. Formation of Interference Topology and Trajectory Refraction"
              }
            }
          },
          {
            "id": "p4_v4_en_6",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The spatial fluctuation exiting the two slits undergoes constructive and destructive interference. At points of destructive interference where $R \\to 0$, $Q_s$ spikes extremely, forming massive 'potential repulsion barriers'. Conversely, constructive interference points become deep 'valleys'. The particle cannot pass through the mountains and is deterministically guided to slide into the valleys, resulting in trajectory refraction."
              }
            }
          },
          {
            "id": "p4_v4_en_7",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 4.3. Identity of Probability: Ensemble of Microscopic Initial Conditions"
              }
            }
          },
          {
            "id": "p4_v4_en_8",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The trajectory of a single particle follows a strict deterministic path:"
              }
            }
          },
          {
            "id": "p4_v4_en_10",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The interference pattern on the screen appears probabilistic ($|\\psi|^2$) because the exact microscopic initial position ($\\mathbf{r}_0$) of each emitted particle cannot be perfectly controlled. The interference pattern is merely a **'Statistical Ensemble'** of numerous particles accumulating along the pre-carved channels of the spatial vibration topography ($Q_s$). Such deterministic guidance by background waves has been physically validated via macroscopic walking droplet experiments [4]."
              }
            }
          },
          {
            "id": "p4_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "본 장에서는 공간 진동 퍼텐셜($Q_s$) 단 하나만을 적용하여 코펜하겐 해석의 모든 핵심 딜레마를 철저한 유체역학적 기하 역학으로 타파한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "### 4.1. 유도 운동 방정식 (Guidance Equation of Motion)",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "해밀턴-야코비 방정식을 미분하면 입자가 받는 역학적 가속도 방정식이 도출된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_4",
            "versions": {
              "v5": {
                "ko": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_5",
            "versions": {
              "v5": {
                "ko": "여기서 $-\\nabla Q_s$는 공간 자체의 기하학적 곡률이 실재하는 입자를 밀어내는 물리적인 **'유도력(Guidance Force)'**이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_6",
            "versions": {
              "v5": {
                "ko": "### 4.2. 파동-입자 이중성: 간섭 지형도의 형성과 궤적의 앙상블",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_7",
            "versions": {
              "v5": {
                "ko": "이중 슬릿을 통과한 공간 요동파는 상쇄 간섭 지점($R \\to 0$)에서 맹렬한 $Q_s$ 척력 장벽(산맥)을 형성하고, 보강 간섭 지점에 골짜기를 판다. 단일 입자는 이 척력 장벽에 튕겨 골짜기로 강제 유도된다. 스크린의 간섭 무늬 확률 분포($|\\psi|^2$)는 입자가 붕괴한 것이 아니라, 통제 불가능한 미세 초기 위치차($\\mathbf{r}_0$)를 지닌 무수한 입자들이 깎여진 진동 수로를 따라 누적된 **'결정론적 궤적의 통계학적 앙상블(Statistical Ensemble)'**일 뿐이다 [4].",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_8",
            "versions": {
              "v5": {
                "ko": "### 4.3. 보어의 양자 도약(Quantum Leap): 기하학적 수직 단락",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_9",
            "versions": {
              "v5": {
                "ko": "전자가 특정 궤도에 존재하는 것은 공간 진동파가 만든 '정상파 텐서 골짜기'에 갇혀 굴러가기 때문이다. 외부 에너지가 흡수되어 장벽이 극단적으로 뒤틀릴 때, 하위 궤도와 상위 궤도가 맞닿아 내부 거리가 0으로 수렴하는 **'기하학적 수직 단락(Short-circuit)'**이 발생한다. 전자는 스스로 도약한 것이 아니라 이 단락된 튜브(거리 0)로 미끄러져 들어갔을 뿐이며, 이는 시간 소모 없이($t=0$) 이동하는 착시를 일으킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_10",
            "versions": {
              "v5": {
                "ko": "### 4.4. 양자 터널링(Quantum Tunneling): 주파수 공명과 위상 페어링",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_11",
            "versions": {
              "v5": {
                "ko": "터널링은 에너지가 부족한 입자가 벽을 유령처럼 통과하는 현상이 아니다. 입자가 절연체 장벽에 부딪힐 때, 장벽 안팎의 공간 진동 주파수가 우연히 공명(Resonance)하면 양쪽 시공간이 **'위상 페어링(Phase Pairing)'**된다. 이 찰나에 장벽 두께를 무시하고 횡단형 $\\Omega$ 위상 튜브(거리 0)가 뚫려 입자가 기하학적 지름길로 관통하는 철저한 텐서 역학적 현상이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_12",
            "versions": {
              "v5": {
                "ko": "### 4.5. 슈뢰딩거의 고양이(중첩): 안장점(Saddle Point)에서의 평형",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_13",
            "versions": {
              "v5": {
                "ko": "양자 중첩은 대상을 쪼개는 마법이 아니다. 그것은 $\\Omega$ 튜브 꼭짓점이라는 기하학적 안장점(Saddle Point) 위에서, 입자가 A로 구를지 B로 구를지 결정되지 않은 채 완벽한 **기계적 힘의 평형 대기 상태(Hovering)**를 이루고 있는 것이다. 관측은 이 대칭성을 깨뜨려 입자를 한쪽 골짜기로 결정론적으로 굴러떨어지게 만든다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_14",
            "versions": {
              "v5": {
                "ko": "### 4.6. 양자 스핀(Spin): 공간 텐서 유체의 동반 회전 소용돌이",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_15",
            "versions": {
              "v5": {
                "ko": "점 입자는 초광속으로 스스로 자전(Rotation)할 수 없다. 스핀의 정체는 궤적을 맹렬히 이동하는 입자를 축으로 삼아, 질량 없는 배경 시공간 유체가 휘감아 도는 **'동반 회전 텐서 소용돌이(Co-moving Tensor Vortex)'** 현상이다. 위상학적 록킹 조건에 의해 이 소용돌이는 오직 시계(Down)와 반시계(Up) 방향이라는 이산적인 두 기하학적 정렬 상태만을 안정적으로 유지한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_16",
            "versions": {
              "v5": {
                "ko": "### 4.7. 불확정성 원리: 텐서 지형도의 파괴적 트레이드오프",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_17",
            "versions": {
              "v5": {
                "ko": "입자의 점 위치($x$)를 찍기 위해 거시적 관측 에너지($E_{obs}$)를 강타하면, 전자를 유도하던 텐서 궤도($p$) 지형도($\\nabla^2 R$) 자체가 기하학적으로 박살 나 우주에서 영원히 삭제된다. 반대로 파도 궤도($p$)를 유지하려면 해상도를 포기해야 하므로 점 위치($x$)를 특정할 수 없다. 진공은 비선형 카오스 유체이므로, 불확정성은 측정 한계가 아니라 관측 폭력과 진동 텐서 지형 보존 간의 파괴적 **트레이드오프(Destructive Trade-off)**이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_18",
            "versions": {
              "v5": {
                "ko": "### 4.8. 양자 소산(Dissipation): 기하학적 점성과 마찰 감쇠",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_19",
            "versions": {
              "v5": {
                "ko": "텅 빈 공간은 비선형 유체로서 기하학적 점성(Viscosity)을 지닌다. 양자 소산은 입자가 이 유체와 텐서 마찰을 일으키며 에너지를 진공에 흩뿌리고, 가장 깊은 기하학적 안식처(바닥 상태)로 굴러떨어지는 철저한 유체역학적 감쇠(Hydrodynamic Damping) 과정이다. 해밀턴-야코비 방정식 우변에 **점성 마찰 계수($-\\Gamma$)**를 추가함으로써 이 역학이 완성된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_20",
            "versions": {
              "v5": {
                "ko": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = -\\Gamma(\\mathbf{v}, \\nabla R) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_21",
            "versions": {
              "v5": {
                "ko": "### 4.9. 힉스 메커니즘(Higgs Mechanism)의 기하역학적 환원",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_22",
            "versions": {
              "v5": {
                "ko": "입자에 질량을 부여한다는 '힉스 장'의 실체는 본 연구의 **'진동하는 공간 텐서 유체'** 그 자체이다. 가속하는 입자가 이 텐서 유체의 끈적임(마찰 $\\Gamma$)을 뚫기 위해 겪어야 하는 **기하학적 텐서 항력(Drag Force)의 총량**이 바로 **'관성 질량($m$)'**으로 창발한다. 입자 가속기 충돌 시 찢겨 나간 이 텐서 소용돌이 껍질의 기하학적 물보라(파편)가 바로 힉스 보손(Higgs Boson)의 정체이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_23",
            "versions": {
              "v5": {
                "ko": "### 4.10. [고찰] 공간 텐서 역학의 범용적 확장성",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_24",
            "versions": {
              "v5": {
                "ko": "*   **카시미르 효과:** 극도로 좁은 판 사이에 긴 진동파($Q_s$)가 진입하지 못해 내부 압력이 떨어지며, 강력한 외부 진동 복사압($p_{vib}$)이 판을 기계적으로 짓누르는 고전적 텐서 압착 현상이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_25",
            "versions": {
              "v5": {
                "ko": "*   **초전도 현상:** 극저온에서 열적 섭동이 멈추면, 텐서 유체 소용돌이들이 마찰 없이 완벽한 '거시적 위상 록킹'을 형성하여 점성 마찰 계수 $\\Gamma=0$인 무저항 초유체 흐름이 창발한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_26",
            "versions": {
              "v5": {
                "ko": "*   **블랙홀 정보 역설 / 시간의 화살:** 블랙홀이 빨아들인 텐서 위상 결(정보)은 증발 시 기하학적 복원력에 의해 풀려나와 보존된다. 비선형 진공 유체에 영구적으로 새겨지는 비가역적 위상 흉터(Topological Scars)의 누적이 바로 시간이 단방향으로 흐르는 엔트로피 증가의 원인이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "This chapter deterministically dismantles all quantum mysteries—from the double-slit to quantum leaps, tunneling, and the Higgs mechanism—through a singular geomechanical mechanism governed by the spatial vibration potential ($Q_s$)."
              }
            }
          },
          {
            "id": "p4_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.1. Guidance Equation of Motion"
              }
            }
          },
          {
            "id": "p4_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Taking the gradient ($\\nabla$) of the Hamilton-Jacobi equation yields the particle's mechanical equation of motion:"
              }
            }
          },
          {
            "id": "p4_v5_en_5",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Here, $-\\nabla Q_s$ is the **'Guidance Force'** where the geometrical curvature of space itself repels and steers the particle."
              }
            }
          },
          {
            "id": "p4_v5_en_6",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.2. Wave-Particle Duality: Trajectory Refraction and Statistical Ensemble"
              }
            }
          },
          {
            "id": "p4_v5_en_7",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Destructive interference points ($R \\to 0$) form massive $Q_s$ repulsion barriers (mountains), while constructive points become deep valleys. The particle is deterministically guided to slide into the valleys. The interference pattern on the screen ($|\\psi|^2$) is merely a **'Statistical Ensemble'** of numerous particles accumulating along pre-carved channels of the spatial vibration topography, caused by uncontrollable minute differences in initial positions ($\\mathbf{r}_0$) [4]."
              }
            }
          },
          {
            "id": "p4_v5_en_8",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.3. Bohr's Quantum Leap: Vertical Geometrical Short-circuit"
              }
            }
          },
          {
            "id": "p4_v5_en_9",
            "versions": {
              "v5": {
                "ko": "",
                "en": "An electron resides in a specific orbit because it settles into a 'standing wave valley' geometrically carved by the nucleus's spatial vibration. When external energy strikes the tensor space, the potential barrier separating two orbits distorts extremely, forming a vertical **$\\Omega$-shaped spatial junction** where the distance becomes zero. The electron mechanically slides through this short-circuit in zero time ($t=0$), creating the illusion of teleportation."
              }
            }
          },
          {
            "id": "p4_v5_en_10",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.4. Quantum Tunneling: Horizontal Phase Pairing"
              }
            }
          },
          {
            "id": "p4_v5_en_11",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Tunneling is not ghostly penetration. When the spatial vibration inside the barrier and the external spatial vibration accidentally achieve frequency resonance (**'Phase Pairing'**), an $\\Omega$-phase tube horizontally pierces the barrier. The electron mechanically jumps through this 'zero-distance geometrical wormhole'. If the barrier is too dense, the noise destroys the pairing, mechanically preventing tunneling."
              }
            }
          },
          {
            "id": "p4_v5_en_12",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.5. Quantum Superposition (Schrödinger's Cat): Saddle Point Equilibrium"
              }
            }
          },
          {
            "id": "p4_v5_en_13",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Superposition is not a state of existing in two places simultaneously. The apex of the $\\Omega$-tube where two orbital valleys meet is a perfect **'Geometrical Saddle Point'** where the tensor guidance forces sum to a net zero. Superposition is an unstable state of perfect mechanical force equilibrium, where a single particle is hovering precariously on the razor-edge of a tensor mountain. Observation breaks this delicate symmetry, causing the particle to deterministically roll down into one of the valleys."
              }
            }
          },
          {
            "id": "p4_v5_en_14",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.6. Quantum Spin: Co-moving Tensor Vortex"
              }
            }
          },
          {
            "id": "p4_v5_en_15",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Point particles cannot rotate superluminally. Spin is not the rotation of the particle, but a **'Co-moving Tensor Vortex'** of the massless spatial fluid swirling fiercely ($\\nabla \\times \\mathbf{v} \\neq 0$) around the moving particle. Topological locking dictates that this vortex can only stabilize in two discrete orientations: clockwise (Down) or counter-clockwise (Up)."
              }
            }
          },
          {
            "id": "p4_v5_en_16",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.7. Uncertainty Principle: Destructive Tensor Trade-off"
              }
            }
          },
          {
            "id": "p4_v5_en_17",
            "versions": {
              "v5": {
                "ko": "",
                "en": "To pinpoint a particle's exact dot position ($x$), immense observational energy ($E_{obs}$) must be injected, which instantly shatters and flattens the guiding spatial topography ($\\nabla^2 R \\to 0$). Gaining position ($x$) permanently erases the 3D geometrical information of the 'wave flow' (momentum $p$). The uncertainty principle is a mechanical inevitability born from the **destructive trade-off between observation energy perturbation and the preservation of vibration tensor topography**."
              }
            }
          },
          {
            "id": "p4_v5_en_18",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.8. Quantum Dissipation: Geometrical Viscosity of Tensor Fluid"
              }
            }
          },
          {
            "id": "p4_v5_en_19",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Vacuum space is a nonlinear chaotic fluid with intrinsic geometrical viscosity ($\\Gamma$). As a particle translates through this sticky tensor fluid, it experiences topological friction. Kinetic energy is dissipated into the vacuum as tensor ripples, causing the particle to hydrodynamically damp and roll down to the lowest stable 'Ground State'."
              }
            }
          },
          {
            "id": "p4_v5_en_20",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = -\\Gamma(\\mathbf{v}, \\nabla R) $$"
              }
            }
          },
          {
            "id": "p4_v5_en_21",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.9. Geometrical Reduction of the Higgs Mechanism: Dynamical Emergence of Mass"
              }
            }
          },
          {
            "id": "p4_v5_en_22",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The 'Higgs Field' that endows particles with mass is the **'Vibrating Spatial Tensor Fluid'** defined in this study. Mass ($m$) is simply the **'Geometrical Tensor Drag'** experienced by a particle accelerating through this viscous spatial fluid. The Higgs Boson discovered at CERN is merely a **'Tensor Splash'**—fragmented debris of the highly condensed tensor vortex shell violently shattered during proton collisions."
              }
            }
          },
          {
            "id": "p4_v5_en_23",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.10. [Discussion] Universal Scalability of Spatial Tensor Mechanics"
              }
            }
          },
          {
            "id": "p4_v5_en_24",
            "versions": {
              "v5": {
                "ko": "",
                "en": "*   **Casimir Effect:** A classical tensor compression caused by the difference in macroscopic 'vibrational radiation pressure ($p_{vib}$)' outside versus suppressed waves inside narrowly spaced metal plates."
              }
            }
          },
          {
            "id": "p4_v5_en_25",
            "versions": {
              "v5": {
                "ko": "",
                "en": "*   **Superconductivity:** At absolute zero, thermal perturbations cease, allowing tensor vortices to form perfect macroscopic topological locking ($\\Gamma=0$), creating a zero-resistance superfluid tensor flow."
              }
            }
          },
          {
            "id": "p4_v5_en_26",
            "versions": {
              "v5": {
                "ko": "",
                "en": "*   **Black Hole Information Paradox & Arrow of Time:** Information (tensor phase) is tightly twisted into the black hole and preserved, later released via geometrical elastic restoration during Hawking radiation. The irreversible accumulation of 'Topological Scars' dictates the unidirectional flow of time."
              }
            }
          },
          {
            "id": "p4_v5.1_ko_1",
            "versions": {
              "v5.1": {
                "ko": "이 절은 결정론적 기하역학 프레임워크 내에서 선택된 양자 현상을 재해석하기 위해 공간 진동 퍼텐셜 $Q_s$를 적용한다. 하위 항목들은 완전한 수학적 유도가 아니라 해석적 확장(interpretive extensions)으로 이해되어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_2",
            "versions": {
              "v5.1": {
                "ko": "### 4.1. 유도 운동 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_3",
            "versions": {
              "v5.1": {
                "ko": "속도장을 $\\mathbf{v}=\\nabla S/m$로 정의하고 궤적을 따라 양자 해밀턴-야코비 방정식의 기울기를 취하면 도출된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_4",
            "versions": {
              "v5.1": {
                "ko": "$$ m\\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r},t) \\tag{6} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_5",
            "versions": {
              "v5.1": {
                "ko": "여기서 $d/dt = \\partial/\\partial t + \\mathbf{v}\\cdot\\nabla$는 궤적을 따른 전미분을 나타낸다. 이 유도는 노드 또는 특이점을 제외하고 단일값 위상 $S$와 비회전성 속도장을 가정한다. $-\\nabla Q_s$는 $Q_s$의 공간적 변화에 따라 입자의 운동을 수정하는 유도력으로 작용한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_6",
            "versions": {
              "v5.1": {
                "ko": "### 4.2. 파동-입자 이중성: 궤적 유도와 통계적 앙상블",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_7",
            "versions": {
              "v5.1": {
                "ko": "이중 슬릿 실험에서 $R$이 0에 접근하는 상쇄 간섭 노드 근처 영역은 $Q_s$에 급격한 변화를 일으키며, 보강 간섭 영역은 안정적인 궤적 채널에 해당한다. 검출 화면에서 관찰된 간섭 무늬 $|\\psi|^2$는 초기 궤적 분포가 $\\rho(\\mathbf{r},0)=|\\psi(\\mathbf{r},0)|^2$를 만족할 경우, 다수의 입자 궤적들의 통계적 앙상블로 해석될 수 있다. 연속 방정식 하에서 이 분포는 등변(equivariant) 상태를 유지한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_8",
            "versions": {
              "v5.1": {
                "ko": "$$ \\rho(\\mathbf{r},0)=|\\psi(\\mathbf{r},0)|^2 \\Rightarrow \\rho(\\mathbf{r},t)=|\\psi(\\mathbf{r},t)|^2 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_9",
            "versions": {
              "v5.1": {
                "ko": "### 4.3. 양자 전이: 안정된 상태 간의 재구성",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_10",
            "versions": {
              "v5.1": {
                "ko": "이 모델에서 전자는 상응하는 공간 진동 유도 구조가 안정될 때 안정 상태에 존재한다. 외부 에너지가 공급되면 퍼텐셜이 변형되어 전이가 허용된다. 양자 전이의 외견상 불연속성은 즉각적인 입자의 이동이 아니라 유도 기하학의 빠른 재구성으로 해석된다. 완전한 정식화는 $E_f - E_i = \\hbar\\omega$ 조건과 전이 확률을 재현해야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_11",
            "versions": {
              "v5.1": {
                "ko": "### 4.4. 양자 터널링: 위상 매개 투과",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_12",
            "versions": {
              "v5.1": {
                "ko": "양자 터널링은 장벽 내외의 공간 진동 구조가 상관관계를 유지할 때 유효한 투과 채널이 형성되는 위상 매개 과정으로 재해석된다. 터널링 확률은 이 상관관계의 안정성에 좌우되며, 표준 예측과의 동등성을 확립하기 위해 WKB 형태의 의존성을 재현해야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_13",
            "versions": {
              "v5.1": {
                "ko": "### 4.5. 양자 중첩: 결합된 유도 구조",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_14",
            "versions": {
              "v5.1": {
                "ko": "중첩은 입자가 여러 위치로 문자 그대로 분할되는 것이 아니라, 중첩된 상태 $\\psi=c_1\\psi_1+c_2\\psi_2$가 결합된 공간 진동 유도 구조를 생성하는 것으로 해석된다. 유도 장은 경쟁하는 궤적 채널들을 포함하며, 측정은 이 구조를 교란하여 보른 규칙($P_i = |c_i|^2$)과 일치하는 결과를 산출한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_15",
            "versions": {
              "v5.1": {
                "ko": "### 4.6. 양자 스핀: 스피너 구조로의 확장 필요성",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_16",
            "versions": {
              "v5.1": {
                "ko": "스핀은 점 입자의 자전이 아니라 국소적인 공간 진동 장과 관련된 내재적인 각운동량 유사 구조로 해석된다. 그러나 현재의 스칼라 정식화는 스핀-1/2 거동을 도출하기에 불충분하며, 파울리 또는 디랙 스피너로의 확장을 필요로 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_17",
            "versions": {
              "v5.1": {
                "ko": "### 4.7. 불확정성 원리: 국소화와 위상-기울기 트레이드오프",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_18",
            "versions": {
              "v5.1": {
                "ko": "불확정성 관계는 공간적 국소화와 위상-기울기 정보 보존 사이의 트레이드오프에서 발생하는 구조적 한계로 재해석된다. 측정 상호작용은 필연적으로 운동량 관련 정보를 암호화하는 공간 진동 구성을 교란하며, 이는 표준 연산자 기반 관계와 호환된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_19",
            "versions": {
              "v5.1": {
                "ko": "$$ \\Delta x \\Delta p \\ge \\frac{\\hbar}{2} \\tag{7} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_20",
            "versions": {
              "v5.1": {
                "ko": "### 4.8. 양자 소산: 현상론적 기하학적 감쇠",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_21",
            "versions": {
              "v5.1": {
                "ko": "소산 거동을 설명하기 위해, 유효 기하학적 감쇠 항 $\\Gamma(\\mathbf{v}, \\nabla R)$을 해밀턴-야코비 형태의 방정식에 현상론적으로 도입한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_22",
            "versions": {
              "v5.1": {
                "ko": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = -\\Gamma(\\mathbf{v}, \\nabla R) \\tag{8} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_ko_23",
            "versions": {
              "v5.1": {
                "ko": "이는 닫힌계의 슈뢰딩거 방정식에서 도출되지 않으므로 개방형 시스템을 위한 제안된 확장으로 이해되어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5.1_en_1",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "This section applies the spatial-vibration potential, $Q_s$, to reinterpret selected quantum phenomena within a deterministic geomechanical framework. The guidance equation and the double-slit trajectory interpretation follow directly from the polar decomposition discussed above. The subsequent subsections should be understood as interpretive extensions of the core framework, rather than as complete derivations from the guidance equation."
              }
            }
          },
          {
            "id": "p4_v5.1_en_2",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 4.1. Guidance Equation of Motion"
              }
            }
          },
          {
            "id": "p4_v5.1_en_3",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Defining the velocity field as $\\mathbf{v}=\\nabla S/m$, and taking the gradient of the quantum Hamilton-Jacobi equation along a particle trajectory yields"
              }
            }
          },
          {
            "id": "p4_v5.1_en_5",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "where $d/dt = \\partial/\\partial t + \\mathbf{v}\\cdot\\nabla$ denotes the total derivative along the trajectory. This derivation assumes a single-valued phase $S$ and an irrotational velocity field except at nodal or singular points. In this formulation, $-\\nabla Q_s$ acts as a guidance force that modifies the particle's motion according to the spatial variation of $Q_s$."
              }
            }
          },
          {
            "id": "p4_v5.1_en_6",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 4.2. Wave-Particle Duality: Trajectory Guidance and Statistical Ensemble"
              }
            }
          },
          {
            "id": "p4_v5.1_en_8",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The interference pattern observed on the detection screen, represented by $|\\psi|^2$, can be interpreted as a statistical ensemble of many particle trajectories, provided that the initial trajectory distribution satisfies $\\rho(\\mathbf{r},0)=|\\psi(\\mathbf{r},0)|^2$. Under the continuity equation derived above, this distribution remains equivariant:"
              }
            }
          },
          {
            "id": "p4_v5.1_en_9",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\rho(\\mathbf{r},0)=|\\psi(\\mathbf{r},0)|^2 \\Rightarrow \\rho(\\mathbf{r},t)=|\\psi(\\mathbf{r},t)|^2 $$"
              }
            }
          },
          {
            "id": "p4_v5.1_en_10",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "A full treatment of nodal regions, where $R=0$ and $Q_s$ may become singular, requires either regularization or a separate analysis."
              }
            }
          },
          {
            "id": "p4_v5.1_en_11",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 4.3. Quantum Transitions: Reconfiguration Between Stable States"
              }
            }
          },
          {
            "id": "p4_v5.1_en_12",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "In this model, an electron is associated with a stable state when the corresponding spatial-vibration guidance structure is dynamically stable. When external energy is supplied, the spatial-vibration potential may be deformed, allowing a transition between two stable configurations. The apparent discontinuity of the quantum transition is therefore interpreted as a rapid reconfiguration of the guiding spatial geometry rather than as literal instantaneous motion. A complete formulation of this process must reproduce the standard energy condition,"
              }
            }
          },
          {
            "id": "p4_v5.1_en_13",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ E_f - E_i = \\hbar\\omega $$"
              }
            }
          },
          {
            "id": "p4_v5.1_en_14",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "as well as transition probabilities and selection rules."
              }
            }
          },
          {
            "id": "p4_v5.1_en_15",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 4.4. Quantum Tunneling: Phase-Mediated Transmission"
              }
            }
          },
          {
            "id": "p4_v5.1_en_16",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Quantum tunneling is reinterpreted here as a phase-mediated transmission process. When the spatial-vibration structure within a potential barrier remains sufficiently correlated with the external spatial-vibration field, an effective transmission channel may form across the barrier. In this framework, the tunneling probability is expected to depend on the stability of this phase correlation, as well as on the barrier height, barrier width, particle mass, and incident energy. To establish equivalence with standard quantum predictions, the model must reproduce the usual tunneling transmission behavior, including the WKB-type dependence:"
              }
            }
          },
          {
            "id": "p4_v5.1_en_17",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ T \\sim \\exp\\left( -2\\int \\kappa(x) dx \\right), \\quad \\kappa(x)=\\frac{\\sqrt{2m(V(x)-E)}}{\\hbar} $$"
              }
            }
          },
          {
            "id": "p4_v5.1_en_18",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 4.5. Quantum Superposition: Combined Guidance Structure"
              }
            }
          },
          {
            "id": "p4_v5.1_en_19",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Superposition is not treated in this model as a literal division of a particle into multiple physical locations. Instead, a superposed state,"
              }
            }
          },
          {
            "id": "p4_v5.1_en_20",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\psi=c_1\\psi_1+c_2\\psi_2 $$"
              }
            }
          },
          {
            "id": "p4_v5.1_en_21",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "is interpreted as generating a combined spatial-vibration guidance structure through its full amplitude and phase. The resulting guidance field may contain competing trajectory channels and interference regions. Measurement perturbs this combined structure and produces one of the available outcomes according to probabilities that must remain consistent with the Born rule ($P_i = |c_i|^2$)."
              }
            }
          },
          {
            "id": "p4_v5.1_en_22",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 4.6. Quantum Spin: Required Extension to Spinor Structure"
              }
            }
          },
          {
            "id": "p4_v5.1_en_23",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Spin is not treated as the literal rotation of a point particle. However, the scalar formulation developed so far is based on the nonrelativistic spinless Schrödinger equation and is therefore insufficient to derive spin-1/2 behavior. A complete treatment of spin requires extending the model to Pauli or Dirac spinor wave functions, including the reproduction of discrete spin measurement outcomes, magnetic moment coupling, and the observed $\\pm\\hbar/2$ angular momentum values. The possible interpretation of spin as a local vortical structure of the spatial field is therefore presented only as a speculative direction for future development."
              }
            }
          },
          {
            "id": "p4_v5.1_en_24",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 4.7. Uncertainty Principle: Localization and Phase-Gradient Trade-off"
              }
            }
          },
          {
            "id": "p4_v5.1_en_25",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The uncertainty relation is reinterpreted here as a structural limitation arising from the trade-off between spatial localization and the preservation of phase-gradient information. This interpretation is intended to be compatible with, rather than replace, the standard operator-based uncertainty relation,"
              }
            }
          },
          {
            "id": "p4_v5.1_en_26",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\Delta x \\Delta p \\ge \\frac{\\hbar}{2} $$"
              }
            }
          },
          {
            "id": "p4_v5.1_en_27",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "In the present model, a sharply localized spatial distribution requires a correspondingly broad range of phase-gradient or momentum components. Measurement interactions may further disturb the spatial-vibration configuration that encodes momentum-related information."
              }
            }
          },
          {
            "id": "p4_v5.1_en_28",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 4.8. Quantum Dissipation: Phenomenological Geometric Damping"
              }
            }
          },
          {
            "id": "p4_v5.1_en_29",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "To describe dissipative quantum behavior, this model introduces an effective geometric damping term, $\\Gamma(\\mathbf{v}, \\nabla R)$, into the Hamilton-Jacobi-like equation:"
              }
            }
          },
          {
            "id": "p4_v5.1_en_30",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\frac{\\partial S}{\\partial t} + \\frac{(\\nabla S)^2}{2m} + V + Q_s = -\\Gamma(\\mathbf{v}, \\nabla R) $$"
              }
            }
          },
          {
            "id": "p4_v5.1_en_31",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Here, $\\Gamma$ represents a phenomenological coupling between particle motion and unresolved spatial-vibration degrees of freedom. Since this term does not follow from the conservative Schrödinger equation, it should be understood as a proposed extension for open or dissipative systems. A complete formulation must specify the functional form and physical dimension of $\\Gamma$, and must demonstrate consistency with probability conservation, energy balance, and known open-system quantum dynamics."
              }
            }
          },
          {
            "id": "p4_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "유도 운동 방정식은 $m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla Q_s(\\mathbf{r}, t)$ 이다. 간섭 무늬 $|\\psi|^2$는 다수 입자 궤적들의 통계적 앙상블로 해석된다 [4]. 안정된 상태 간의 양자 전이는 기하학적 유도 구조의 빠른 재구성으로, 터널링은 공명에 의한 위상 매개 투과 과정으로, 중첩은 경쟁하는 유도 채널들의 안장점(Saddle point)에서의 역학적 균형으로 재해석된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Taking the gradient of the quantum Hamilton-Jacobi equation yields the guidance equation:"
              }
            }
          },
          {
            "id": "p4_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "The interference pattern $|\\psi|^2$ is interpreted as a statistical ensemble of many particle trajectories accumulating along geometrical channels [4]. Transitions are interpreted as rapid reconfigurations of geometry. Quantum tunneling is reinterpreted as a phase-mediated transmission process. Superposition is represented as an unstable mechanical equilibrium at a geometrical saddle point."
              }
            }
          },
          {
            "id": "p4_v7_ko_1",
            "versions": {
              "v7": {
                "ko": "### 4.1. 위상 난류(Phase Turbulence)와 밀도 행렬의 붕괴",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v7_ko_2",
            "versions": {
              "v7": {
                "ko": "관측 해밀토니안 $H_{int}$은 진폭이 아닌 **위상 $S$**에 열역학적 노이즈를 주입하여 속도장 $\\mathbf{v}$에 극심한 **'위상 난류'**를 발생시킨다. 확률 밀도는 보존됨에도 불구하고, 무작위로 헝클어진 위상 요동에 대해 앙상블 평균을 취하면 축소 밀도 행렬의 비대각선 성분들이 지수함수적으로 소거($\\langle e^{i(S_A - S_B)/\\hbar} \\rangle \\to 0$)되어 결어긋남 [6]을 동역학적으로 설명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v7_ko_3",
            "versions": {
              "v7": {
                "ko": "### 4.2. 반증 가능한 예측: 텐서-열역학적 스케일링 법칙",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v7_ko_4",
            "versions": {
              "v7": {
                "ko": "결어긋남 붕괴 과정이 공간 유체의 기하학적 점성 마찰에 의존하는 비마르코프적 현상이라고 주장한다. 본 연구는 붕괴 지연 시간 $\\tau_{dec}$가 진공 요동 온도 $T_{vac}$의 제곱에 반비례하는 **'텐서-열역학적 스케일링 법칙'**을 독자적으로 예측한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v7_ko_5",
            "versions": {
              "v7": {
                "ko": "$$ \\tau_{dec} \\sim \\frac{\\hbar (\\rho_{\\mathrm{fluid}} c^2) d^3}{(k_B T_{vac})^2} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v7_ko_6",
            "versions": {
              "v7": {
                "ko": "### 4.3. 겉보기 동시성과 인과율",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v7_ko_7",
            "versions": {
              "v7": {
                "ko": "은닉 변수 이론의 3N차원 비국소성을 다중 연결된 3차원 물리적 위상(위상 튜브)으로 해석한다. 붕괴 상쇄파는 상대론적 인과율($v \\le c$)을 엄수하며 전파된다. 다중 연결된 튜브 내부 기하학적 거리가 0으로 단락되어 있으므로 물리적 전송 시간은 $t \\approx 0$이 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v7_en_1",
            "versions": {
              "v7": {
                "ko": "",
                "en": "### 4.1. Phase Turbulence and Density Matrix Decoherence"
              }
            }
          },
          {
            "id": "p4_v7_en_2",
            "versions": {
              "v7": {
                "ko": "",
                "en": "An interaction Hamiltonian injects broadband thermodynamic noise directly into the spatial phase ($S$), generating severe **'Phase Turbulence'** within the spatial fluid. While probability density remains strictly conserved, the reduced density matrix undergoes rapid exponential suppression of its off-diagonal interference terms ($\\langle e^{i(S_A - S_B)/\\hbar} \\rangle \\to 0$). The ensemble mechanically blurs into a classical mixed state [5]."
              }
            }
          },
          {
            "id": "p4_v7_en_3",
            "versions": {
              "v7": {
                "ko": "",
                "en": "### 4.2. Falsifiable Prediction: Tensor-Thermodynamic Scaling Law"
              }
            }
          },
          {
            "id": "p4_v7_en_4",
            "versions": {
              "v7": {
                "ko": "",
                "en": "To distinguish this geomechanical damping from standard Markovian open-system dynamics, we propose a falsifiable prediction. Incorporating the spatial energy density $\\rho_{\\mathrm{fluid}} c^2$, the decoherence time scale is predicted to follow a **'Tensor-Thermodynamic Scaling Law'**:"
              }
            }
          },
          {
            "id": "p4_v7_en_5",
            "versions": {
              "v7": {
                "ko": "",
                "en": "$$ \\tau_{dec} \\sim \\frac{\\hbar (\\rho_{\\mathrm{fluid}} c^2) d^3}{(k_B T_{vac})^2} $$"
              }
            }
          },
          {
            "id": "p4_v7_en_6",
            "versions": {
              "v7": {
                "ko": "",
                "en": "Observing this specific quadratic geometric deviation ($\\propto T_{vac}^{-2}$) would serve as a crucial experimental verification."
              }
            }
          },
          {
            "id": "p4_v7_en_7",
            "versions": {
              "v7": {
                "ko": "",
                "en": "### 4.3. Apparent Simultaneity and Causality in Entanglement"
              }
            }
          },
          {
            "id": "p4_v7_en_8",
            "versions": {
              "v7": {
                "ko": "",
                "en": "Entanglement is interpreted as a nonseparable phase correlation within a multiply-connected 3D topology. Disturbance propagates strictly obeying relativistic causality ($v \\le c$). However, because the internal geometrical distance traversing the multiply-connected spatial junction is effectively zero, the physical transmission time inevitably becomes $t \\approx 0$."
              }
            }
          },
          {
            "id": "p4_v8_ko_1",
            "versions": {
              "v8": {
                "ko": "### 4.1. 위상 난류(Phase Turbulence)와 밀도 행렬의 붕괴",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8_ko_2",
            "versions": {
              "v8": {
                "ko": "관측 상호작용 해밀토니안은 **위상 $S$**에 거시적인 열역학적 노이즈를 주입하여 극심한 **'위상 난류(Phase Turbulence)'**를 발생시킨다. 확률 밀도 $\\rho$가 공간상에서 엄격히 보존됨에도 불구하고, 거시적 관측 시간 동안 앙상블 평균을 취하면 축소 밀도 행렬의 비대각선 성분들이 지수함수적으로 소거($\\langle e^{i(S_A - S_B)/\\hbar} \\rangle \\to 0$)되어 결어긋남 [6]을 완벽히 동역학적으로 설명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8_ko_3",
            "versions": {
              "v8": {
                "ko": "### 4.2. 반증 가능한 예측: 텐서-열역학적 스케일링 법칙",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8_ko_4",
            "versions": {
              "v8": {
                "ko": "공간 유체의 에너지 밀도($\\rho_{\\mathrm{fluid}} c^2$)를 차원 분석하여, 붕괴 지연 시간 $\\tau_{dec}$가 진공 요동 온도 $T_{vac}$의 제곱에 반비례하는 척도 법칙을 예측한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8_ko_5",
            "versions": {
              "v8": {
                "ko": "$$ \\tau_{dec} \\sim \\frac{\\hbar (\\rho_{\\mathrm{fluid}} c^2) d^3}{(k_B T_{vac})^2} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8_ko_6",
            "versions": {
              "v8": {
                "ko": "차원 분석을 통해 $\\frac{[E \\cdot T] [E \\cdot L^{-3}] [L^3]}{[E]^2} = [T]$(시간) 임이 증명된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8_ko_7",
            "versions": {
              "v8": {
                "ko": "### 4.3. 겉보기 동시성과 인과율",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8_ko_8",
            "versions": {
              "v8": {
                "ko": "얽힘 붕괴 상쇄파는 상대론적 인과율($v \\le c$)을 엄수하며 전파된다. 그러나 다중 연결된 위상 튜브를 가로지르는 내부 기하학적 거리가 사실상 0으로 단락되어 있으므로 물리적 전송 시간은 $t \\approx 0$이 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8_en_1",
            "versions": {
              "v8": {
                "ko": "",
                "en": "### 4.1. Phase Turbulence and Density Matrix Decoherence"
              }
            }
          },
          {
            "id": "p4_v8_en_2",
            "versions": {
              "v8": {
                "ko": "",
                "en": "An interaction Hamiltonian injects broadband thermodynamic noise directly into the spatial phase ($S$), generating severe **'Phase Turbulence'** within the spatial fluid. While probability density remains strictly conserved, the reduced density matrix undergoes rapid exponential suppression of its off-diagonal interference terms ($\\langle e^{i(S_A - S_B)/\\hbar} \\rangle \\to 0$). The ensemble mechanically blurs into a classical mixed state [6]."
              }
            }
          },
          {
            "id": "p4_v8_en_3",
            "versions": {
              "v8": {
                "ko": "",
                "en": "### 4.2. Falsifiable Prediction: Tensor-Thermodynamic Scaling Law"
              }
            }
          },
          {
            "id": "p4_v8_en_4",
            "versions": {
              "v8": {
                "ko": "",
                "en": "Incorporating the spatial energy density $\\rho_{\\mathrm{fluid}} c^2$, the decoherence time scale is predicted to follow a **'Tensor-Thermodynamic Scaling Law'**:"
              }
            }
          },
          {
            "id": "p4_v8_en_5",
            "versions": {
              "v8": {
                "ko": "",
                "en": "$$ \\tau_{dec} \\sim \\frac{\\hbar (\\rho_{\\mathrm{fluid}} c^2) d^3}{(k_B T_{vac})^2} $$"
              }
            }
          },
          {
            "id": "p4_v8_en_6",
            "versions": {
              "v8": {
                "ko": "",
                "en": "Observing this specific quadratic geometric deviation ($\\propto T_{vac}^{-2}$) would serve as a crucial experimental verification."
              }
            }
          },
          {
            "id": "p4_v8_en_7",
            "versions": {
              "v8": {
                "ko": "",
                "en": "### 4.3. Apparent Simultaneity and Causality in Entanglement"
              }
            }
          },
          {
            "id": "p4_v8_en_8",
            "versions": {
              "v8": {
                "ko": "",
                "en": "Entanglement is interpreted as a nonseparable phase correlation within a multiply-connected 3D topology. Disturbance propagates strictly obeying relativistic causality ($v \\le c$). However, because the internal geometrical distance traversing the multiply-connected spatial junction is effectively zero, the physical transmission time inevitably becomes $t \\approx 0$."
              }
            }
          },
          {
            "id": "p4_v8.1_ko_1",
            "versions": {
              "v8.1": {
                "ko": "본 연구는 이전 모델들의 확률 보존 파괴 및 특이점 발산 모순을 완전히 해결하였다. 척도 법칙의 예측은 본 프레임워크를 실험적으로 검증 가능하며 수학적으로 무결한 동역학 모델로 격상시킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v8.1_en_1",
            "versions": {
              "v8.1": {
                "ko": "",
                "en": "We resolved the unphysical singularities and probability conservation violations inherent in preceding models. This framework elevates spatial geomechanics from a philosophical interpretation to an empirically testable deterministic physical model."
              }
            }
          }
        ]
      },
      {
        "number": 5,
        "title": {
          "ko": "5. 결론",
          "en": "5. Conclusion"
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
              },
              "v4": {
                "ko": "",
                "en": "$$ \\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right) $$"
              },
              "v5": {
                "ko": "",
                "en": "$$ \\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right) \\quad \\Rightarrow \\quad m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla \\left[ \\gamma \\cdot Q_s(\\mathbf{r}, t) \\right] $$"
              },
              "v5.1": {
                "ko": "",
                "en": "$$ \\gamma(E_{obs}) = \\exp\\left( -\\frac{E_{obs}}{\\epsilon_c} \\right) $$"
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
              },
              "v4": {
                "ko": "",
                "en": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla \\left[ \\gamma(E_{obs}) \\cdot Q_s(\\mathbf{r}, t) \\right] $$"
              },
              "v5.1": {
                "ko": "",
                "en": "$$ m\\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla\\left[ \\gamma(E_{obs})Q_s(\\mathbf{r},t) \\right] $$"
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
                "en": "\\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) = 0"
              },
              "v4": {
                "ko": "",
                "en": "$$ \\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) = 0 \\quad \\Rightarrow \\quad m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r}) $$"
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
              },
              "v5.1": {
                "ko": "",
                "en": "$$ m\\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r}) $$"
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
          },
          {
            "id": "p5_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "### 5.1. 감쇠 인자가 적용된 확장 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "관측 기기가 공간에 가하는 물리적 섭동은 진동의 결맞음을 교란한다. 관측 에너지 $E_{obs}$에 반비례하여 공간 진동을 억제하는 **'감쇠 함수(Damping function, $\\gamma$)'**를 도입한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_3",
            "versions": {
              "v4": {
                "ko": "$$ \\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "$$ m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla \\left[ \\gamma(E_{obs}) \\cdot Q_s(\\mathbf{r}, t) \\right] $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_5",
            "versions": {
              "v4": {
                "ko": "### 5.2. 결맞음 파괴와 간섭 무늬의 역학적 소멸",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_6",
            "versions": {
              "v4": {
                "ko": "관측을 위해 막대한 에너지($E_{obs} \\gg \\epsilon_c$)를 투사하는 순간, 감쇠 인자는 0에 수렴한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_7",
            "versions": {
              "v4": {
                "ko": "$$ \\lim_{E_{obs} \\to \\infty} \\gamma(E_{obs}) = 0 \\quad \\Rightarrow \\quad m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r}) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_8",
            "versions": {
              "v4": {
                "ko": "공간 진동($Q_s$)이 물리적으로 평탄화(Flattening)되었으므로 입자는 고전적 장벽($V$)만을 느끼며 직선 운동하게 된다. 즉, 주류 양자역학의 '환경 유도 결맞음 파괴(Environment-induced decoherence)' 현상 [5]은 **'거시적 타격 에너지에 의한 미시 공간 곡률의 기계적 상쇄'** 메커니즘으로 완벽히 구체화된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_9",
            "versions": {
              "v4": {
                "ko": "### 5.3. 양자 얽힘의 비국소성 규명: $\\Omega$(오메가)형 파도와 '거리 0' 공간 접합",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_10",
            "versions": {
              "v4": {
                "ko": "코펜하겐 해석의 난제인 '양자 얽힘'은 관측 시 우주 반대편 입자의 상태가 초광속으로 결정되는 듯한 비국소성을 보인다. 본 연구는 이를 공간 텐서의 극단적 기하학적 뒤틀림이 빚어낸 **'공간 접합(Spatial Junction)'** 착시 현상으로 해명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_11",
            "versions": {
              "v4": {
                "ko": "두 입자가 얽힐 때 공간 진폭은 극단적인 보강 간섭을 일으키며 파도의 아랫부분이 오목하게 말려들어가는 $\\Omega$(오메가) 형태로 시공간을 기하학적으로 뒤튼다. 이 곡률의 극한에서 위상 튜브의 가장 좁은 목 부분이 강제로 맞닿게 되며, 두 입자 사이를 관통하는 내부 기하학적 거리는 **수학적 극한인 '0'으로 단락(Short-circuit)**된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_12",
            "versions": {
              "v4": {
                "ko": "### 5.4. 진동 평탄화의 국소적 전달과 붕괴 동시성의 착시 (Illusion of Simultaneity)",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_13",
            "versions": {
              "v4": {
                "ko": "지구의 입자 A를 관측 타격하면 감쇠 충격파가 튜브 표면의 곡률을 평탄화($\\nabla_A^2 R \\to 0$)시킨다. 이 상쇄파(Damping Wave)는 접합된 공간의 축을 타고 명백히 아인슈타인의 인과율을 엄수하는 **빛의 속도 이하($v \\le c$)**로 이동하여 반대편 입자 B의 유도력마저 무너뜨린다. 그러나 튜브 내부 기하학적 거리가 이미 '0'으로 단락되어 있었기 때문에 도달 시간 역시 **$t = 0$ (0초)**이 되어, 외부 3차원 관찰자에게는 초광속 동시 붕괴라는 착시(Illusion)를 일으킬 뿐이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_14",
            "versions": {
              "v4": {
                "ko": "### 5.5. 양자 얽힘의 자발적 붕괴: 위상 튜브의 핀치-오프(Pinch-off) 메커니즘",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_15",
            "versions": {
              "v4": {
                "ko": "현실의 양자 시스템에서 얽힘은 외부 타격이 없어도 자발적으로 붕괴한다. $\\Omega$형 위상 튜브의 가장 좁은 중간 목(Neck) 부위는 공간 자체의 끊임없는 미세 진동으로 인해 쉴 새 없이 출렁인다. 이 찌그러짐이 시공간 탄성 한계를 초과하면, 목 부위가 정면충돌하며 기하학적으로 찢어지는 **핀치-오프(Topological Pinch-off)** 현상이 발생한다. 허리가 끊어지는 순간, 입자들을 거리 0으로 묶어주던 장력망은 사멸하며 얽힘은 자발적 결맞음 파괴(Spontaneous Decoherence)를 맞이한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_16",
            "versions": {
              "v4": {
                "ko": "### 5.6. 시공간 절단의 역학적 운명: 자기 치유(Self-healing)와 다중 우주 창발",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_17",
            "versions": {
              "v4": {
                "ko": "목이 찢어져 분리된 튜브 하단부는 유체의 표면장력처럼 기하학적 자기 치유(Self-healing)를 통해 3차원 연속성을 회복한다. 반면 분리된 상단부 접합점은 본래 우주와 단절된 닫힌 4차원의 **'위상 거품(Topological Bubble)'**이 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_18",
            "versions": {
              "v4": {
                "ko": "우주 초기의 급팽창 시기, 이 공간의 찢어짐과 치유가 남긴 무수한 위상 흉터들이 우주 공간을 파편화시켜 훗날 제3논문에서 다룰 '거대 공간 판(Spatial Plates)'과 '단층대'를 형성하였다. 또한 거대하게 찢겨 나간 위상 거품은 그 자체로 팽창하여 새로운 **다중 우주(Multiverse)**의 창발로 이어지는 근원적 텐서 메커니즘을 완성한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 5.1. Extended Equation with Damping Factor"
              }
            }
          },
          {
            "id": "p5_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The observational energy ($E_{obs}$) projected to observe the target acts as macroscopic violence that destroys spatial coherence. To formulate this, an exponential **'Damping function ($\\gamma$)'** is introduced."
              }
            }
          },
          {
            "id": "p5_v4_en_5",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 5.2. Mechanical Erasure of Interference and Decoherence"
              }
            }
          },
          {
            "id": "p5_v4_en_6",
            "versions": {
              "v4": {
                "ko": "",
                "en": "When strong observation energy is applied ($E_{obs} \\gg \\epsilon_c$), the damping factor converges to 0."
              }
            }
          },
          {
            "id": "p5_v4_en_8",
            "versions": {
              "v4": {
                "ko": "",
                "en": "As the spatial vibration potential term ($-\\nabla Q_s$) is eliminated, the geometrical waves ($Q_s$) are mechanically flattened. The particle travels in a straight line governed by inertia. This deterministically materializes the phenomenon known as 'environment-induced decoherence' [5]."
              }
            }
          },
          {
            "id": "p5_v4_en_9",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 5.3. Elucidation of Non-locality: The $\\Omega$-Wave and Spatial Junction"
              }
            }
          },
          {
            "id": "p5_v4_en_10",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Quantum entanglement exhibits non-locality, where observing one particle seemingly determines the state of the other superluminally. This study explains this ghost-like phenomenon not as a faster-than-light transmission of signals, but as an illusion caused by a **'topological short-circuit'** in vibrating space."
              }
            }
          },
          {
            "id": "p5_v4_en_11",
            "versions": {
              "v4": {
                "ko": "",
                "en": "When two particles are entangled, violent constructive interference forces the spatial tensor to warp into an $\\Omega$ (Omega) shape where the lower parts curl inward. At the extreme of this curvature, the narrowest neck regions of the tube are forced into contact, and the internal geometrical distance penetrating the two particles is short-circuited to a mathematical limit of **'zero' (Spatial Junction)**."
              }
            }
          },
          {
            "id": "p5_v4_en_12",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 5.4. Illusion of Simultaneity"
              }
            }
          },
          {
            "id": "p5_v4_en_13",
            "versions": {
              "v4": {
                "ko": "",
                "en": "When particle A is observed, the damping shockwave flattens the geometrical spatial phase. This damping wave travels along the axis of the joined space strictly obeying Einstein's causality at **subluminal speeds ($v \\le c$)**. However, because the geometrical distance was already short-circuited to '0', the physical time taken for wave transmission inevitably becomes **$t = 0$ seconds**. Thus, the instantaneous collapse of entanglement is an illusion caused by the local transmission of a damping wave through a geometrically zero-distance phase tube."
              }
            }
          },
          {
            "id": "p5_v4_en_14",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 5.5. Spontaneous Decoherence: The Pinch-off Mechanism"
              }
            }
          },
          {
            "id": "p5_v4_en_15",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Entanglement spontaneously decoheres due to geometrical instability. The constant vacuum fluctuations repeatedly distort the narrow neck of the $\\Omega$-tube. When the curvature exceeds the elastic limit of spacetime, the neck collides and undergoes a **'Topological Pinch-off'**, permanently severing the spatial junction and naturally destroying the entanglement without external observation."
              }
            }
          },
          {
            "id": "p5_v4_en_16",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 5.6. Spacetime Self-healing and Emergence of Multiverses"
              }
            }
          },
          {
            "id": "p5_v4_en_17",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Upon pinch-off, the parent 3D universe undergoes immediate geometrical 'self-healing', preserving macroscopic continuity. Meanwhile, the detached upper junction isolates into a closed 4D 'Topological Bubble'. During cosmic inflation, these topological scars formed the seeds of 'Spatial Plates' and 'Fault Lines'. Furthermore, a massively energetic topological bubble expanding independently forms the seed of a 'Baby Universe', or **Multiverse**."
              }
            }
          },
          {
            "id": "p5_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "### 5.1. 감쇠 인자가 적용된 확장 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "관측 기기가 가하는 거시적 에너지($E_{obs}$)에 반비례하여 공간 진동을 억제하는 **'감쇠 함수(Damping function, $\\gamma$)'**를 도입한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "$$ \\gamma(E_{obs}) = \\exp \\left( -\\frac{E_{obs}}{\\epsilon_c} \\right) \\quad \\Rightarrow \\quad m \\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla \\left[ \\gamma(E_{obs}) \\cdot Q_s(\\mathbf{r}, t) \\right] $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_4",
            "versions": {
              "v5": {
                "ko": "### 5.2. 스케일 비대칭성과 입자성의 강요: 거시적 쓰나미 파장에 의한 미시 텐서 지형의 덮어쓰기 (Forced Particle Nature: Overwriting of Micro-Topography by Macroscopic Tsunami Wavelengths)",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_5",
            "versions": {
              "v5": {
                "ko": "이중 슬릿의 간섭 무늬는 대상 입자(전자)의 크기 척도에 부합하는 극도로 섬세하고 미시적인(Micro-scale) 공간 진동 파장이 궤적 수로를 형성할 때만 성립한다. 그러나 전자를 관측하기 위해 투사되는 막대한 관측 섭동($E_{obs} \\gg \\epsilon_c$)은 미시적 세계와는 차원이 완전히 다른 스케일의 물리적 개입이다. 관측 에너지는 미시 공간의 잔물결 지형 위에 압도적인 진폭과 거대한 파장을 지닌 **'거시적 쓰나미(Macroscopic Tsunami)'**를 투하하는 것과 같다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_6",
            "versions": {
              "v5": {
                "ko": "이 거대한 섭동 에너지가 덮치는 순간, 전자를 유도하던 미세한 기하학적 잔물결($Q_s$)들은 이 압도적인 거시적 진동의 파면(Wave-front) 아래에 완전히 파묻혀 물리적으로 덮어씌워져(Overwritten) 버린다. 가장 결정적인 역학적 핵심은, 이 관측 파동의 스케일이 양자의 체급에 비해 비정상적으로 거대하다는 점이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_7",
            "versions": {
              "v5": {
                "ko": "지구가 둥글지만 인간의 척도에서는 완벽한 평면으로 인식되듯, 극미세한 전자의 입장에서는 자신을 덮친 이 거대한 단일 관측 파동의 굴곡(파동성)을 전혀 감지할 수 없다. 양자에게 이 덮쳐온 공간은 기하학적 굴절 곡률($\\nabla^2 R \\to 0$)을 상실한 완벽하게 평탄한 텐서 비탈길(직선)로만 인식될 뿐이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_8",
            "versions": {
              "v5": {
                "ko": "$$ \\lim_{E_{obs} \\to \\text{Macro}} \\gamma(E_{obs}) = 0 \\quad \\Rightarrow \\quad m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r}) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_9",
            "versions": {
              "v5": {
                "ko": "결과적으로 $\\gamma \\to 0$이 되는 실체는 진동 에너지가 단순히 소산되는 것이 아니다. 스케일이 다른 거대 관측 파동이 공간을 덮어버림으로써, 양자는 미세한 파동적 유도력($Q_s$)을 빼앗기고 **오직 무자비한 직선적 관성력만을 따르도록 '입자성(Particle Nature)'을 역학적으로 강요(Forced)받게 된다.** 슬릿을 통과한 전자는 더 이상 굴절되지 않고 당구공처럼 직진하며, 이것이 주류 양자역학이 신비주의로 일관해 온 '환경 유도 결맞음 파괴' [5]의 철저한 척도 기하역학적(Scale-Geomechanical) 실체이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_10",
            "versions": {
              "v5": {
                "ko": "### 5.3. 양자 얽힘의 비국소성 규명: $\\Omega$(오메가)형 공간 접합",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_11",
            "versions": {
              "v5": {
                "ko": "두 입자가 얽힐 때 극단적인 보강 간섭은 시공간을 파도의 아랫부분이 오목하게 말려들어가는 $\\Omega$(오메가) 형태로 뒤튼다. 이 곡률의 극한에서 위상 튜브의 가장 좁은 목 부분이 강제로 맞닿아 융합되는 **'공간 접합(Spatial Junction)'**이 발생하며, 두 입자를 잇는 내부 기하학적 거리는 수학적 극한인 **'0'**으로 단락(Short-circuit)된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_12",
            "versions": {
              "v5": {
                "ko": "### 5.4. 진동 평탄화의 국소적 전달과 붕괴 동시성의 착시 (Illusion of Simultaneity)",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_13",
            "versions": {
              "v5": {
                "ko": "지구의 입자 A를 관측 타격하면 튜브 표면 곡률이 강제로 평탄화($\\nabla_A^2 R \\to 0$)된다. 이 상쇄파(Damping Wave)는 단락된 튜브 축을 타고 명백히 아인슈타인의 인과율을 엄수하는 **빛의 속도 이하($v \\le c$)**로 튜브를 타고 이동하여 반대편 입자 B의 유도력마저 무너뜨린다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_14",
            "versions": {
              "v5": {
                "ko": "그러나 충격파가 통과해야 할 내부 기하학적 거리가 이미 '0'으로 단축되어 있었기 때문에 도달 시간 역시 **$t = 0$ (0초)**이 되어, 외부 3차원 관찰자에게는 빛보다 빠른 동시 붕괴라는 결정론적 착시(Illusion)를 일으킬 뿐이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_15",
            "versions": {
              "v5": {
                "ko": "### 5.5. 양자 얽힘의 자발적 붕괴: 위상 튜브의 핀치-오프(Pinch-off) 메커니즘",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_16",
            "versions": {
              "v5": {
                "ko": "현실의 진공은 끊임없이 진동하므로 $\\Omega$ 튜브의 가장 좁은 중간 목(Neck) 부위 역시 출렁인다. 이 찌그러짐이 시공간 탄성 한계를 초과하면, 목 부위가 서로 충돌하며 기하학적으로 찢어지는 **핀치-오프(Topological Pinch-off)** 현상이 발생한다. 허리가 찢어짐과 동시에 튜브 내부 거리를 0으로 묶던 장력망은 사멸하며 얽힘은 외부 관측 없이도 자발적 붕괴(Spontaneous Decoherence)를 맞이한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_17",
            "versions": {
              "v5": {
                "ko": "### 5.6. 시공간 절단의 역학적 운명과 다중 우주(Multiverse) 창발",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_18",
            "versions": {
              "v5": {
                "ko": "목이 찢어져 분리된 튜브 하단부는 유체 표면장력처럼 자기 치유(Self-healing)를 거쳐 거시적 3차원 연속성을 복원한다. 반면 분리된 최상단부 접합점은 부모 우주와 단절된 닫힌 4차원 **'위상 거품(Topological Bubble)'**이 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_19",
            "versions": {
              "v5": {
                "ko": "우주 초기의 팽창 속에서 찢어지고 치유되며 남겨진 무수한 위상 흉터들은 우주 공간을 파편화시켜 훗날 제3논문의 '거대 공간 판(Spatial Plates)'과 단층대를 형성하였다. 나아가 막대한 에너지를 품고 찢겨 독립한 거대 위상 거품은 자체적인 복사압으로 무한 팽창하여 새로운 **다중 우주(Multiverse)**의 창발로 이어지는 근원적 텐서 메커니즘을 완성한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 5.1. Extended Equation with Damping Factor"
              }
            }
          },
          {
            "id": "p5_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The observational energy ($E_{obs}$) acts as macroscopic violence that destroys spatial coherence. An exponential **'Damping function ($\\gamma$)'** is introduced:"
              }
            }
          },
          {
            "id": "p5_v5_en_4",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 5.2. Mechanical Erasure of Interference and Forced Particle-Nature: Overwriting of Micro-Topography by Macroscopic Tsunami Wavelengths"
              }
            }
          },
          {
            "id": "p5_v5_en_5",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The interference pattern in the double-slit experiment manifests only when delicate, micro-scale spatial vibration wavelengths—commensurate with the size of the target particle (electron)—carve out trajectory channels. However, the immense observational perturbation ($E_{obs} \\gg \\epsilon_c$) projected to detect the electron constitutes a physical intervention of a completely different dimensional scale. This observational energy is akin to dropping a **'Macroscopic Tsunami'**—with overwhelming amplitude and immense wavelength—onto the microscopic ripples of the spatial terrain."
              }
            }
          },
          {
            "id": "p5_v5_en_6",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The instant this colossal perturbation energy floods the space, the minute geometrical ripples ($Q_s$) guiding the electron are completely submerged and overwritten by the overwhelming amplitude and macroscopic wavelength of the observation wave. The decisive mechanical crux lies in this extreme mismatch of wavelength scales."
              }
            }
          },
          {
            "id": "p5_v5_en_7",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Just as the spherical Earth appears perfectly flat to a human observer, from the perspective of an infinitesimal electron, the curvature (waveness) of this massive, overarching observation wave is entirely imperceptible. To the electron, the engulfed space is perceived merely as a perfectly flat tensor slope devoid of geometrical refractive curvature ($\\nabla^2 R \\to 0$)."
              }
            }
          },
          {
            "id": "p5_v5_en_8",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ \\lim_{E_{obs} \\to \\text{Macro}} \\gamma(E_{obs}) = 0 \\quad \\Rightarrow \\quad m \\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r}) $$"
              }
            }
          },
          {
            "id": "p5_v5_en_9",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Consequently, the reality of $\\gamma \\to 0$ is not a mere dissipation of energy. Because an observation wave of a disparate scale overrides the space, the quantum is stripped of its delicate wave-like guidance and is **'mechanically forced' to exhibit only linear inertial motion (Forced Particle-Nature).** The electron passing through the slit is no longer refracted but hurdled in a straight line. This is the thorough scale-geomechanical reality of 'environment-induced decoherence' [5], which mainstream quantum mechanics has long shrouded in mysticism."
              }
            }
          },
          {
            "id": "p5_v5_en_10",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 5.3. Elucidation of Non-locality: The $\\Omega$-Wave and Spatial Junction"
              }
            }
          },
          {
            "id": "p5_v5_en_11",
            "versions": {
              "v5": {
                "ko": "",
                "en": "When two particles are entangled, violent constructive interference forces the spatial tensor to warp into an **$\\Omega$ (Omega) shape**. At the extreme of this curvature, the narrowest neck regions are forced into contact, short-circuiting the internal geometrical distance penetrating the two particles to a mathematical limit of **'zero' (Spatial Junction)**."
              }
            }
          },
          {
            "id": "p5_v5_en_12",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 5.4. Illusion of Simultaneity"
              }
            }
          },
          {
            "id": "p5_v5_en_13",
            "versions": {
              "v5": {
                "ko": "",
                "en": "When particle A is observed, the damping shockwave flattens its spatial phase. This damping wave travels along the joined space strictly obeying Einstein's causality at **subluminal speeds ($v \\le c$)** to collapse particle B. However, because the geometrical distance was already short-circuited to '0', the physical transmission time inevitably becomes **$t = 0$ seconds**, creating a deterministic illusion of superluminal simultaneous collapse."
              }
            }
          },
          {
            "id": "p5_v5_en_14",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 5.5. Spontaneous Decoherence: The Pinch-off Mechanism"
              }
            }
          },
          {
            "id": "p5_v5_en_15",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Entanglement spontaneously decoheres due to geometrical instability. Vacuum fluctuations repeatedly distort the narrow neck of the $\\Omega$-tube. When the curvature exceeds the elastic limit of spacetime, the neck collides and undergoes a **'Topological Pinch-off'**, physically severing the spatial junction and naturally destroying the entanglement."
              }
            }
          },
          {
            "id": "p5_v5_en_16",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 5.6. Spacetime Self-healing and Emergence of Multiverses"
              }
            }
          },
          {
            "id": "p5_v5_en_17",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Upon pinch-off, the parent 3D universe undergoes immediate geometrical 'self-healing', preserving macroscopic continuity. The detached upper junction isolates into a closed 4D **'Topological Bubble'**. During cosmic inflation, these torn topological bubbles expanded independently to form the seeds of **Multiverses**, while the remaining topological scars fragmented our universe into 'Spatial Plates', bridging quantum mechanics directly to cosmological plate tectonics."
              }
            }
          },
          {
            "id": "p5_v5.1_ko_1",
            "versions": {
              "v5.1": {
                "ko": "### 5.1. 감쇠 인자가 포함된 확장 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_2",
            "versions": {
              "v5.1": {
                "ko": "측정은 미시 시스템과 거시 관측 환경 간의 상호작용으로 취급되며, 이는 공간 진동 구성의 결맞음을 억제한다. 무차원 감쇠 인자 $\\gamma$가 도입된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_3",
            "versions": {
              "v5.1": {
                "ko": "$$ \\gamma(E_{obs}) = \\exp\\left( -\\frac{E_{obs}}{\\epsilon_c} \\right) \\tag{9} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_4",
            "versions": {
              "v5.1": {
                "ko": "여기서 $E_{obs}$는 유효 측정-상호작용 척도를 나타낸다. 해당 유도 방정식은 다음과 같이 작성된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_5",
            "versions": {
              "v5.1": {
                "ko": "$$ m\\frac{d\\mathbf{v}}{dt} = -\\nabla V(\\mathbf{r}) - \\nabla\\left[ \\gamma(E_{obs})Q_s(\\mathbf{r},t) \\right] \\tag{10} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_6",
            "versions": {
              "v5.1": {
                "ko": "### 5.2. 측정 하에서의 파동적 유도 억제",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_7",
            "versions": {
              "v5.1": {
                "ko": "강한 측정 극한($E_{obs} / \\epsilon_c \\gg 1$)에서 감쇠 인자는 0에 접근한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_8",
            "versions": {
              "v5.1": {
                "ko": "$$ \\lim_{E_{obs}/\\epsilon_c \\to \\infty} \\gamma(E_{obs}) = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_9",
            "versions": {
              "v5.1": {
                "ko": "측정 동안 $Q_s$가 유계된 상태로 유지된다는 가정 하에, 유도 방정식에 대한 $Q_s$의 기여는 강하게 억제된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_10",
            "versions": {
              "v5.1": {
                "ko": "$$ m\\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V(\\mathbf{r}) \\tag{11} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_11",
            "versions": {
              "v5.1": {
                "ko": "관측 하에서 간섭이 사라지는 현상은 측정 상호작용에 의한 감쇠 과정으로 해석되며, 이는 환경 유도 결맞음 파괴(decoherence)에 대한 현상론적 유추를 제공한다. 완전한 연결은 밀도 행렬 정식화를 요구한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_12",
            "versions": {
              "v5.1": {
                "ko": "### 5.3. 비분리적 공간 진동 상관관계로서의 얽힘",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_13",
            "versions": {
              "v5.1": {
                "ko": "두 입자 시스템에서 얽힘은 비분리적(nonseparable) 결합 파동 함수에 해당한다. 본 모델에서 이는 결합된 공간 진동 구성 내의 비분리적 위상 상관관계로 해석된다. 얽힘을 일반 공간을 통해 전송되는 신호로 취급하는 대신, 시스템의 결합 구성에 대한 제약으로 해석한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_14",
            "versions": {
              "v5.1": {
                "ko": "### 5.4. 겉보기 동시성과 인과율",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_15",
            "versions": {
              "v5.1": {
                "ko": "상관된 측정 결과의 겉보기 동시성은 본 연구에서 통제 가능한 초광속 통신으로 해석되지 않는다. 대신, 이는 비분리적 구조의 발현으로 취급된다. 국소 측정에 의한 모든 물리적 교란은 상대론적 인과율($v \\le c$)의 지배를 받으며 전파되는 것으로 가정된다. 따라서 본 모델은 신호 전달 금지(no-signaling) 조건과 호환되도록 구성된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_16",
            "versions": {
              "v5.1": {
                "ko": "### 5.5. 환경적 결맞음 파괴로서의 위상 상관관계 상실",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_ko_17",
            "versions": {
              "v5.1": {
                "ko": "결맞음 파괴는 환경적 또는 배경 자유도와의 결합에 의해 발생하는 위상 상관관계의 점진적 상실로 모델링된다. 배경 요동이 얽힘을 지지하는 결합 구성을 불안정하게 만들면, 상태는 고전적으로 상관된 기술로 효과적으로 전이된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5.1_en_1",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 5.1. Extended Equation with a Damping Factor"
              }
            }
          },
          {
            "id": "p5_v5.1_en_2",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "In this model, measurement is treated as an interaction between a microscopic system and a macroscopic observational environment. This interaction is assumed to suppress the coherence of the spatial-vibration configuration. To represent this effect phenomenologically, a dimensionless damping factor, $\\gamma$, is introduced:"
              }
            }
          },
          {
            "id": "p5_v5.1_en_4",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "where $E_{obs}$ denotes an effective measurement-interaction scale, rather than necessarily the literal injected energy, and $\\epsilon_c$ is a characteristic coherence-suppression scale. The corresponding guidance equation is written as"
              }
            }
          },
          {
            "id": "p5_v5.1_en_6",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "If $E_{obs}$ is treated as spatially uniform over the microscopic region of interest, this reduces to a multiplicative suppression of the guidance force. If $E_{obs}$ depends on position or time, additional gradient terms such as $-Q_s\\nabla\\gamma$ must be included."
              }
            }
          },
          {
            "id": "p5_v5.1_en_7",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 5.2. Suppression of Wave-like Guidance Under Measurement"
              }
            }
          },
          {
            "id": "p5_v5.1_en_8",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "In the strong-measurement limit,"
              }
            }
          },
          {
            "id": "p5_v5.1_en_9",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\frac{E_{obs}}{\\epsilon_c} \\gg 1, $$"
              }
            }
          },
          {
            "id": "p5_v5.1_en_10",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "the damping factor approaches zero:"
              }
            }
          },
          {
            "id": "p5_v5.1_en_11",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\lim_{E_{obs}/\\epsilon_c \\to \\infty} \\gamma(E_{obs}) = 0 $$"
              }
            }
          },
          {
            "id": "p5_v5.1_en_12",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Provided that $Q_s$ remains bounded under the measurement interaction, the contribution of $Q_s$ to the guidance equation is strongly suppressed:"
              }
            }
          },
          {
            "id": "p5_v5.1_en_14",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The disappearance of interference under observation is interpreted as the damping of the spatial-vibration guidance structure by the measurement interaction. At the phenomenological level, this may be related to the loss of interference visibility, for example through a relation of the form $\\mathcal{V} \\approx \\mathcal{V}_0\\gamma(E_{obs})$, where $\\mathcal{V}$ denotes the observed interference visibility. A full connection with environment-induced decoherence would require a density-matrix formulation showing the suppression of off-diagonal coherence terms."
              }
            }
          },
          {
            "id": "p5_v5.1_en_15",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 5.3. Entanglement as Nonseparable Spatial-Vibration Correlation"
              }
            }
          },
          {
            "id": "p5_v5.1_en_16",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "For a two-particle system, entanglement corresponds to a nonfactorizable joint wave function,"
              }
            }
          },
          {
            "id": "p5_v5.1_en_17",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\psi(\\mathbf{r}_1,\\mathbf{r}_2,t) \\neq \\psi_1(\\mathbf{r}_1,t)\\psi_2(\\mathbf{r}_2,t) $$"
              }
            }
          },
          {
            "id": "p5_v5.1_en_18",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "In the present model, this nonfactorizability is interpreted as a nonseparable phase correlation in the joint spatial-vibration configuration associated with the two-particle system. Rather than treating entanglement as a signal transmitted through ordinary space, the model interprets it as a constraint on the joint configuration of the system."
              }
            }
          },
          {
            "id": "p5_v5.1_en_19",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "This interpretation requires additional formulation because the joint amplitude and phase of an entangled state are generally defined on configuration space rather than ordinary three-dimensional space."
              }
            }
          },
          {
            "id": "p5_v5.1_en_20",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 5.4. Apparent Simultaneity and Causality"
              }
            }
          },
          {
            "id": "p5_v5.1_en_21",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The apparent simultaneity of correlated measurement outcomes is not interpreted here as controllable superluminal communication. Instead, it is treated as a manifestation of the nonseparable structure of the joint spatial-vibration configuration. Any physical disturbance generated by a local measurement is assumed to propagate subject to relativistic causality, $v \\le c$."
              }
            }
          },
          {
            "id": "p5_v5.1_en_22",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Therefore, the model is constructed to remain compatible with the no-signaling condition while accounting for the apparent nonlocal character of entanglement. A complete treatment must specify how the model reproduces Bell-type correlations, including Bell-inequality violations, without enabling superluminal signaling."
              }
            }
          },
          {
            "id": "p5_v5.1_en_23",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "### 5.5. Environmental Decoherence as Loss of Phase Correlation"
              }
            }
          },
          {
            "id": "p5_v5.1_en_24",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Decoherence is modeled as the gradual loss of phase correlation caused by coupling to environmental or background degrees of freedom. In this interpretation, fluctuations of the spatial-vibration background destabilize the joint configuration that supports entanglement. Once the phase correlation becomes sufficiently degraded, the entangled state effectively transitions into a classically correlated or separable description."
              }
            }
          },
          {
            "id": "p5_v5.1_en_25",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "This process is not assumed to occur in an isolated closed system, but through interaction with environmental or background modes. A complete formulation would require a decoherence rate, a specification of the relevant environmental degrees of freedom, and a density-matrix description of the suppression of coherence."
              }
            }
          },
          {
            "id": "p5_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "### 5.1. 감쇠 인자의 동역학적 유도",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "측정 과정에서 상호작용 항($H_{int}$)으로 유입된 에너지는 공간 곡률 항($\\nabla^2 R$)에 광대역의 고주파 열역학적 노이즈를 도입한다. 거시적 관측 시간 $\\tau$에 대한 시간 평균을 적용하면, 리만-르베그 보조정리에 의해 요동들이 점근적으로 상쇄되어 지형도를 평탄화시킨다:",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "$$ \\langle \\nabla^2 R \\rangle_{\\tau} \\approx 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_4",
            "versions": {
              "v6": {
                "ko": "이는 현상론적 감쇠 함수 $\\gamma(E_{obs})$를 정당화하며, 결맞음 파괴 [5]에 대한 동역학적 기반을 제공한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_5",
            "versions": {
              "v6": {
                "ko": "### 5.2. 반증 가능한 예측: 기하역학적 붕괴 지연",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_6",
            "versions": {
              "v6": {
                "ko": "본 모델은 결맞음 파괴를 공간 텐서의 유체역학적 평탄화로 취급하므로, 중간 거시(mesoscopic) 간섭계에서 지수함수적 감쇠를 예측하는 주류 이론과 달리, $\\mathcal{V}(t) \\sim 1 - (t/\\tau_{Zeno})^2$ 형태의 측정 가능한 **'기하역학적 붕괴 지연'**이 발생할 것을 예측한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_7",
            "versions": {
              "v6": {
                "ko": "### 5.3. 겉보기 동시성과 인과율",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_8",
            "versions": {
              "v6": {
                "ko": "입자 A가 관측될 때 감쇠 파동은 상대론적 인과율($v \\le c$)을 엄수하며 전파된다. 그러나 다중 연결된 위상 튜브를 가로지르는 내부 기하학적 거리가 유효하게 0이므로, 물리적 전송 시간은 $t \\approx 0$이 된다. 따라서 상관된 결과의 겉보기 동시성은 결정론적 착시이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 5.1. Dynamical Derivation of the Damping Factor"
              }
            }
          },
          {
            "id": "p5_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Consider a full Hamiltonian $H = H_{sys} + H_{app} + H_{int}$. During measurement, macroscopic energy from the apparatus flows into the interaction term, introducing broadband, high-frequency thermodynamic noise into the spatial curvature term ($\\nabla^2 R$). By applying time-averaging over the observation timescale $\\tau$, the Riemann-Lebesgue lemma dictates that these fluctuations cancel out:"
              }
            }
          },
          {
            "id": "p5_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ \\langle \\nabla^2 R \\rangle_{\\tau} \\approx 0 $$"
              }
            }
          },
          {
            "id": "p5_v6_en_4",
            "versions": {
              "v6": {
                "ko": "",
                "en": "This mathematical averaging justifies the phenomenological damping factor $\\gamma(E_{obs}) = \\exp(-E_{obs}/\\epsilon_c)$, providing a geomechanical basis for environment-induced decoherence [5]."
              }
            }
          },
          {
            "id": "p5_v6_en_5",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 5.2. Falsifiable Prediction: Geomechanical Damping Delay"
              }
            }
          },
          {
            "id": "p5_v6_en_6",
            "versions": {
              "v6": {
                "ko": "",
                "en": "To satisfy Occam's razor, this model predicts a measurable **'Geomechanical Damping Delay'** in mesoscopic interferometry: $\\mathcal{V}(t) \\sim 1 - (t/\\tau_{Zeno})^2$. Experimental verification of this specific nonlinear temporal deviation would serve as a critical falsification test."
              }
            }
          },
          {
            "id": "p5_v6_en_7",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 5.3. Apparent Simultaneity and Causality"
              }
            }
          },
          {
            "id": "p5_v6_en_8",
            "versions": {
              "v6": {
                "ko": "",
                "en": "When measurement dampens the spatial phase of Particle A, this disturbance propagates strictly obeying relativistic causality ($v \\le c$). However, because the internal geometrical distance traversing the multiply-connected spatial junction is effectively zero, the physical transmission time inevitably becomes $t \\approx 0$. The apparent simultaneity is thus a deterministic illusion."
              }
            }
          },
          {
            "id": "p5_v7_ko_1",
            "versions": {
              "v7": {
                "ko": "본 연구는 게이지 불변성을 지키는 점성 항과 위상 결함의 자가 정칙화 메커니즘을 도입하여, 이전 모델들의 확률 보존 파괴 및 특이점 발산 모순을 완전히 해결하였다. 위상 난류를 통한 밀도 행렬 붕괴 유도와 스케일링 법칙의 예측은 본 프레임워크를 실험적으로 검증 가능하며 수학적으로 무결한 동역학 모델로 격상시킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v7_en_1",
            "versions": {
              "v7": {
                "ko": "",
                "en": "By integrating a gauge-invariant geometric viscosity term and utilizing the exact mathematical cancellation between centrifugal phase kinetic energy and the quantum potential well at nodal points, we resolved the unphysical singularities and probability conservation violations inherent in preceding models. Measurement-induced decoherence is dynamically modeled as phase turbulence scrambling the guidance field, rigorously suppressing off-diagonal elements, thereby proposing an empirically testable deterministic physical model."
              }
            }
          },
          {
            "id": "p5_v8_ko_1",
            "versions": {
              "v8": {
                "ko": "본 연구는 게이지 불변성을 지키는 코스틴 방정식 형태의 실수 점성 항과 위상 결함의 자가 정칙화(기하학적 상쇄) 메커니즘을 도입하여, 이전 모델들의 확률 보존 파괴 및 특이점 발산 모순을 완전히 해결하였다. 위상 난류를 통한 밀도 행렬의 비대각선 성분 소거 역학과 차원이 완벽히 일치하는 $\\tau_{dec}$ 척도 법칙의 예측은, 본 프레임워크를 사변적 철학에서 실험적으로 검증 가능하며 수학적으로 무결한 동역학 모델로 격상시킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v8_en_1",
            "versions": {
              "v8": {
                "ko": "",
                "en": "By integrating a gauge-invariant geometric viscosity term and utilizing the exact mathematical cancellation between centrifugal phase kinetic energy and the quantum potential well at nodal points, we resolved the unphysical singularities and probability conservation violations inherent in preceding models. Measurement-induced decoherence is dynamically modeled as phase turbulence scrambling the guidance field, rigorously suppressing off-diagonal elements, thereby proposing an empirically testable deterministic physical model."
              }
            }
          }
        ]
      },
      {
        "number": 6,
        "title": {
          "ko": "6. 거시-미시 경계 및 결론",
          "en": "6. The Macro-Micro Boundary and Conclusion"
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
              },
              "v4": {
                "ko": "",
                "en": "$$ \\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) $$"
              },
              "v5.1": {
                "ko": "",
                "en": "$$ \\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) $$"
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
                "en": "\\lim_{m \\to \\text{Macro}} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0"
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
          },
          {
            "id": "p6_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "공간 진동 유도력($\\mathbf{F}_{space}$)의 수식을 분석하면 거시와 미시가 어떻게 통일되는지 명확히 드러난다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "$$ \\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v4_ko_3",
            "versions": {
              "v4": {
                "ko": "거시 물체의 질량 $m$이 천문학적으로 커짐에 따라($m \\to \\infty$), 역학적 유도력은 분모의 거시적 발산으로 인해 완벽히 $0$에 수렴하게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "$$ \\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v4_ko_5",
            "versions": {
              "v4": {
                "ko": "거시 물체는 아보가드로 수($\\approx 10^{23}$)에 달하는 입자들이 결합된 고밀도 복합체로, 그 자체가 공간의 미세 요동을 뚫고 지나가는 어마어마한 '고전적 관성(Classical Inertia)'을 지닌다. 맹렬히 진동하는 빈 공간의 곡률도 압도적인 질량 관성 앞에서는 운동 역학적으로 철저히 무시되므로, 물체의 궤적 방정식은 뉴턴 역학($m \\frac{d\\mathbf{v}}{dt} = -\\nabla V$)으로 자연스럽게 환원된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 6.1. Inverse Mass Proportion of Spatial Vibration Potential"
              }
            }
          },
          {
            "id": "p6_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The spatial guidance force ($\\mathbf{F}_{space}$) is inversely proportional to the mass ($m$):"
              }
            }
          },
          {
            "id": "p6_v4_en_4",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 6.2. Convergence to Macro-Scale: Inertial Domination"
              }
            }
          },
          {
            "id": "p6_v4_en_5",
            "versions": {
              "v4": {
                "ko": "",
                "en": "As an object scales up to the macroscopic level:"
              }
            }
          },
          {
            "id": "p6_v4_en_6",
            "versions": {
              "v4": {
                "ko": "",
                "en": "$$ \\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0 $$"
              }
            }
          },
          {
            "id": "p6_v4_en_7",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The spatial fluctuation is not destroyed; rather, the overwhelming **'classical inertia'** of macroscopic objects mechanically ignores and pierces through the local spatial vibrations. Therefore, the trajectory equation naturally converges to Newton's second law of motion ($m \\frac{d\\mathbf{v}}{dt} = -\\nabla V$)."
              }
            }
          },
          {
            "id": "p6_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "공간 진동 유도력($\\mathbf{F}_{space}$) 수식을 분석하면 거시와 미시가 어떻게 통일되는지 명확히 드러난다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "$$ \\lim_{m \\to \\infty} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "거시 물체는 아보가드로 수($\\approx 10^{23}$)에 달하는 입자들이 조밀하게 결합된 고밀도 복합체로, 어마어마한 '고전적 관성 질량 밀도'를 지닌다. 맹렬히 진동하는 빈 공간의 미세 곡률도 이 압도적인 관성 앞에서는 역학적으로 철저히 '무시(Ignored)'된다. 유도 텐서 항이 0으로 수학적 소멸을 겪으면서, 우주의 모든 거시 운동 방정식은 뉴턴의 고전 역학($m \\frac{d\\mathbf{v}}{dt} = -\\nabla V$)으로 완벽하게 환원된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The spatial guidance force ($\\mathbf{F}_{space}$) is inversely proportional to the mass ($m$):"
              }
            }
          },
          {
            "id": "p6_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ \\lim_{m \\to \\infty} \\mathbf{F}_{space} = \\lim_{m \\to \\infty} \\left[ \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\right] = 0 $$"
              }
            }
          },
          {
            "id": "p6_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "A macroscopic object ($10^{23}$ particles) possesses overwhelming 'classical inertia density'. It mercilessly crushes and mechanically 'ignores' the minute curvatures of the vibrating empty space. As the guidance tensor term approaches mathematical zero, all macroscopic equations perfectly reduce to Newton's classical mechanics ($m \\frac{d\\mathbf{v}}{dt} = -\\nabla V$)."
              }
            }
          },
          {
            "id": "p6_v5.1_ko_1",
            "versions": {
              "v5.1": {
                "ko": "$Q_s$와 관련된 공간 유도력은 다음과 같이 주어진다:",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v5.1_ko_2",
            "versions": {
              "v5.1": {
                "ko": "$$ \\mathbf{F}_{space} = -\\nabla Q_s = \\frac{\\hbar^2}{2m} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) \\tag{12} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v5.1_ko_3",
            "versions": {
              "v5.1": {
                "ko": "진폭 의존 기하학적 항이 $\\nabla (\\nabla^2 R/R) = o(m)$을 만족하고, 노드 특이점이 적절히 정칙화된다면 공간 유도력은 큰 질량 극한에서 무시할 수 있게 된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v5.1_ko_4",
            "versions": {
              "v5.1": {
                "ko": "$$ \\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0 \\tag{13} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v5.1_ko_5",
            "versions": {
              "v5.1": {
                "ko": "이 극한에서 미시적 공간 유도 가속도는 관성에 의해 억제되며, 유효 운동 방정식은 뉴턴 형태 $m d\\mathbf{v}/dt \\approx -\\nabla V$에 접근한다. 이는 고전적 거시 역학과 연결되는 유효 거시 극한을 제공한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v5.1_en_1",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The spatial-guidance force associated with $Q_s$ is given by"
              }
            }
          },
          {
            "id": "p6_v5.1_en_3",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The corresponding acceleration contribution is"
              }
            }
          },
          {
            "id": "p6_v5.1_en_4",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\mathbf{a}_{space} = \\frac{\\mathbf{F}_{space}}{m} = \\frac{\\hbar^2}{2m^2} \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) $$"
              }
            }
          },
          {
            "id": "p6_v5.1_en_5",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Therefore, if the amplitude-dependent geometric term satisfies"
              }
            }
          },
          {
            "id": "p6_v5.1_en_6",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\nabla \\left( \\frac{\\nabla^2 R}{R} \\right) = o(m) $$"
              }
            }
          },
          {
            "id": "p6_v5.1_en_7",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "and if nodal singularities are absent or appropriately regularized, the spatial-guidance force becomes negligible in the large-mass limit:"
              }
            }
          },
          {
            "id": "p6_v5.1_en_8",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ \\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0 $$"
              }
            }
          },
          {
            "id": "p6_v5.1_en_9",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Under the same assumptions, the acceleration induced by microscopic spatial-guidance effects is further suppressed by inertia. Consequently, the effective equation of motion approaches the Newtonian form,"
              }
            }
          },
          {
            "id": "p6_v5.1_en_10",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "$$ m\\frac{d\\mathbf{v}}{dt} \\approx -\\nabla V $$"
              }
            }
          },
          {
            "id": "p6_v5.1_en_11",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "This provides a possible route for connecting the proposed microscopic guidance mechanism with classical macroscopic dynamics. However, this convergence should be understood as an effective macroscopic limit, requiring appropriate smoothness, bounded-gradient conditions, and, for composite macroscopic objects, a separate treatment of center-of-mass and environmental decoherence effects."
              }
            }
          },
          {
            "id": "p6_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "조건 $\\nabla (\\nabla^2 R/R) = o(m)$을 만족할 때, 공간 유도력은 큰 질량 극한에서 무시할 수 있게 되어 뉴턴 역학으로 수렴한다($\\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0$). 본 연구는 공간 진동 퍼텐셜 $Q_s$를 통해 양자 현상들을 기하역학적으로 재해석하였으며, 동역학적으로 유도된 감쇠 과정과 기하역학적 붕괴 지연이라는 반증 가능한 예측을 도입하여 본 프레임워크를 실험적으로 검증 가능한 모델로 격상시켰다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "## 부록: 우주론적 확장 (Part II, III)",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "Part II는 공간 진동 텐서를 아인슈타인 장 방정식과 결합하여 거시적 공간 진동이 암흑 물질과 암흑 에너지로 어떻게 발현될 수 있는지 탐구할 것이다. 나아가 Part III에서는 우주 공간 판구조론을 제안함으로써 공간의 거시적 위상 균열이 거대 구조 형성과 고속 전파 폭발(FRBs)에 어떻게 관여할 수 있는지 탐구할 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p6_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Under the condition $\\nabla (\\nabla^2 R/R) = o(m)$, the spatial-guidance force becomes negligible in the large-mass limit:"
              }
            }
          },
          {
            "id": "p6_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ \\lim_{m \\to \\infty} \\mathbf{F}_{space} = 0 $$"
              }
            }
          },
          {
            "id": "p6_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "In this limit, the effective equation of motion approaches the Newtonian form. This study proposes a deterministic framework connecting particle-scale dynamics with macroscopic behavior, introducing falsifiable predictions that elevate it to an empirically testable model."
              }
            }
          },
          {
            "id": "p6_v6_en_4",
            "versions": {
              "v6": {
                "ko": "",
                "en": "## Appendix: Cosmological Extensions"
              }
            }
          },
          {
            "id": "p6_v6_en_5",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Part II of this series will rigorously couple the spatial vibration tensor to the Einstein field equations. Part III will explore macroscopic topological fractures ('Cosmological Spatial Plate Tectonics'), providing geometric interpretations for Dark Matter and Dark Energy."
              }
            }
          }
        ]
      },
      {
        "number": 7,
        "title": {
          "ko": "7장. 결론",
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
              },
              "v4": {
                "ko": "**[향후 연구 과제: 프랙탈적 스케일 대칭성과 우주론적 확장]**",
                "en": "This first paper has elucidated the mechanism by which the 'geometrical vibration of space' manifests in the quantum realm, and has demonstrated that at the meso-macro scale, the dense mass coupling of matter forms a temporary inertial dominance, rendering Newtonian mechanics dominant."
              },
              "v5": {
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
          },
          {
            "id": "p7_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "본 연구는 파동-입자 이중성과 양자 얽힘 등 양자역학의 난제들을 **'공간 자체의 기하학적 요동과 텐서 장력'**이라는 단일 역학으로 결정론적으로 규명하였다. 이중 슬릿의 간섭 패턴은 관측 파동 상쇄에 의한 궤적의 앙상블임이 규명되었으며, 얽힘의 초광속 딜레마마저 $\\Omega$형 공간 접합 튜브의 기하학적 단락이 빚어낸 $0$초 동시성 착시 현상으로 완벽히 해명하며 인과율을 수호해 냈다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v4_ko_3",
            "versions": {
              "v4": {
                "ko": "본 논문은 국소적으로 억제되었던 공간의 역학적 유도력($\\mathbf{F}_{space}$)이, 우주적 척도로 확장될 때 극적인 **'프랙탈적 회귀와 스케일 대칭성(Scale Symmetry)'**을 발현할 것임을 강력히 예측한다. 수억 광년에 달하는 텅 빈 심우주(Deep Space)가 요동칠 때, 그 방대한 체적에 누적된 거시적 텐서 에너지 총량은 다시 거대 은하들의 관성을 압도하게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "후속 연작인 **[공간의 진동 역학 II: 거시 중력장과 암흑 우주 대체 모델]**에서는 이 거시적 공간 진동이 시공간 곡률(중력장)과 결합할 때, 어떻게 **'암흑 물질(텐서 응축)'**과 **'암흑 에너지(진동 복사압)'**라는 우주의 인력과 척력으로 발현되는지를 추적할 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "This study establishes a deterministic framework of 'Geometrical Fluctuation of Space', resolving the wave-particle duality, decoherence, and the superluminal paradox of quantum entanglement. The superluminal dilemma of entanglement is perfectly resolved as an illusion of $0$-second simultaneity birthed by the geometrical short-circuit of the $\\Omega$-shaped spatial junction tube."
              }
            }
          },
          {
            "id": "p7_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "**[Future Outlook: Fractal Scale Symmetry]**"
              }
            }
          },
          {
            "id": "p7_v4_en_3",
            "versions": {
              "v4": {
                "ko": "",
                "en": "While mass inertia suppresses spatial vibration at macro-scales, this dynamic relationship undergoes a dramatic **'Fractal Scale Symmetry'** when expanded to cosmological scales. The vast volume of deep space accumulates immense vibrational energy, which once again dominates the inertia of giant galaxies. Subsequent papers in this series will explore how this macroscopic spatial vibration couples with gravity to manifest as Dark Matter (tensor condensation) and Dark Energy (vibrational radiation pressure)."
              }
            }
          },
          {
            "id": "p7_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "본 연구는 파동-입자 이중성부터 양자 도약, 터널링, 중첩, 스핀, 얽힘, 힉스 질량 메커니즘에 이르는 양자역학의 모든 8대 난제들을 **'공간 자체의 기하학적 요동과 텐서 마찰'**이라는 단 하나의 결정론적 보편 역학으로 완벽히 통일 및 해체하였다. 얽힘의 초광속 딜레마마저 $\\Omega$형 공간 접합 튜브의 기하학적 단락이 빚어낸 $0$초 동시성 착시 현상으로 완벽히 해명하며 아인슈타인의 인과율을 굳건히 수호해 냈다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "본 논문은 질량 관성에 의해 국소적으로 억제되었던 공간 진동의 텐서 유도력($\\mathbf{F}_{space}$)이, 초거시 우주론적 척도로 확장될 때 극적인 '스케일 역전(Scale Inversion)'을 발현할 것임을 강력히 예측한다. 수억 광년에 달하는 텅 빈 심우주(Deep Space)의 방대한 체적에 누적된 거시적 텐서 에너지는 다시금 거대 은하들의 관성을 압도하게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5_ko_4",
            "versions": {
              "v5": {
                "ko": "후속 연작인 **[공간의 진동 역학 II 및 III]**에서는 이 거시적 공간 진동이 아인슈타인의 휜 시공간 중력장과 결합할 때, 어떻게 극한의 텐서 응축을 통한 **암흑 물질(Dark Matter)**을 잉태하고, 억압 없는 진동 복사압 발산을 통해 가속 팽창(**암흑 에너지**)을 유발하며, 우주 공간 판구조 충돌 지형도(Cosmic Web)를 깎아내게 되는지를 역학적으로 추적하여 물리학의 궁극적 대통일 이론을 완성할 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "This study deterministically dismantled the greatest mysteries of modern physics—duality, leaps, tunneling, superposition, spin, entanglement, dissipation, and the Higgs mechanism—via a single geomechanical principle: the **'topology and tensor friction of vibrating space'**. The superluminal dilemma of entanglement is perfectly resolved as an illusion of $0$-second simultaneity birthed by the geometrical short-circuit of the $\\Omega$-shaped spatial junction tube, staunchly defending causality."
              }
            }
          },
          {
            "id": "p7_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "**[Future Outlook: Fractal Scale Symmetry]**"
              }
            }
          },
          {
            "id": "p7_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "While mass inertia suppresses spatial vibration at macro-scales, this dynamic relationship undergoes a dramatic **'Fractal Scale Symmetry'** cosmologically. The immense vibrational energy accumulated within deep space once again dominates the inertia of giant galaxies. Subsequent papers in this series will explore how this macroscopic spatial vibration couples with gravity to manifest as Dark Matter (tensor condensation) and Dark Energy (vibrational radiation pressure)."
              }
            }
          },
          {
            "id": "p7_v5.1_ko_1",
            "versions": {
              "v5.1": {
                "ko": "본 연구는 요동치는 공간 배경의 유효 기하학적 구조에 기초하여 선택된 양자 현상들의 결정론적 기하역학적 재해석을 제안하였다. 이 프레임워크 내에서 봄의 양자 퍼텐셜과 대수적으로 동일한 공간 진동 퍼텐셜 $Q_s$는 물리적 공간의 기하학적 요동에 대한 유효 척도로 재해석된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_2",
            "versions": {
              "v5.1": {
                "ko": "본 모델은 파동-입자 이중성, 터널링, 중첩, 결맞음 파괴 및 얽힘 상관관계에 대한 해석적 제안을 제공한다. 측정은 공간 유도 항을 억제하는 감쇠 과정으로 현상학적으로 모델링되며, 얽힘은 초광속 신호가 아니라 신호 전달 금지 조건과 양립하는 비분리적 상관 구조로 해석된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_3",
            "versions": {
              "v5.1": {
                "ko": "본 정식화는 비상대론적 단일 입자 영역에 국한되며 선택된 현상에 대한 현상론적 확장을 수반한다. 다입자 시스템, 벨 유형 얽힘 상관관계, 스피너 동역학, 상대론적 장론 및 실험적으로 검증 가능한 예측으로 모델을 확장하기 위해서는 추가 연구가 필요하다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_4",
            "versions": {
              "v5.1": {
                "ko": "**[끈 이론적 접근법과의 관계]**",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_5",
            "versions": {
              "v5.1": {
                "ko": "다수의 끈 이론적 접근법 역시 진동의 개념을 사용하지만 1차원 연장된 개체를 도입하며 컴팩트화된 차원을 요구한다. 대조적으로 본 모델은 유효한 4차원 시공간 프레임워크 내에 진동 구조를 위치시키려 시도하며, 이는 두 접근법 간의 개념적 차이를 명확히 하기 위함이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_6",
            "versions": {
              "v5.1": {
                "ko": "**[범위 및 사변적 확장]**",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_7",
            "versions": {
              "v5.1": {
                "ko": "시공간 위상, 다중 우주 형성, 또는 우주론적 규모의 암흑 섹터(암흑 물질 및 에너지)와 관련된 주장들은 별도의 상대론적 및 우주론적 정식화를 필요로 하므로, 본 모델의 확립된 결과가 아니라 향후 조사를 위한 사변적 방향으로 남겨둔다.",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_8",
            "versions": {
              "v5.1": {
                "ko": "\\begin{thebibliography}{99}",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_9",
            "versions": {
              "v5.1": {
                "ko": "\\bibitem{Einstein1935} A. Einstein, B. Podolsky, and N. Rosen, \\textit{Phys. Rev.} \\textbf{47}, 777 (1935).",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_10",
            "versions": {
              "v5.1": {
                "ko": "\\bibitem{Madelung1927} E. Madelung, \\textit{Z. Phys.} \\textbf{40}, 322 (1927).",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_11",
            "versions": {
              "v5.1": {
                "ko": "\\bibitem{Bohm1952} D. Bohm, \\textit{Phys. Rev.} \\textbf{85}, 166 (1952).",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_12",
            "versions": {
              "v5.1": {
                "ko": "\\bibitem{Couder2006} Y. Couder and E. Fort, \\textit{Phys. Rev. Lett.} \\textbf{97}, 154101 (2006).",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_13",
            "versions": {
              "v5.1": {
                "ko": "\\bibitem{Zurek2003} W. H. Zurek, \\textit{Rev. Mod. Phys.} \\textbf{75}, 715 (2003).",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_ko_14",
            "versions": {
              "v5.1": {
                "ko": "\\end{thebibliography}",
                "en": ""
              }
            }
          },
          {
            "id": "p7_v5.1_en_1",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "This study proposed a deterministic geomechanical reinterpretation of selected quantum phenomena based on an effective spatial-vibration structure associated with a fluctuating spatial background. Within this framework, the spatial-vibration potential, $Q_s$, which is algebraically identical to Bohm's quantum potential in the single-particle nonrelativistic formulation, is reinterpreted as an effective measure of geometric fluctuation in physical space."
              }
            }
          },
          {
            "id": "p7_v5.1_en_2",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The model offers reinterpretations of wave-particle duality, tunneling, superposition, decoherence, and entanglement correlations through a common guidance mechanism. Measurement is modeled phenomenologically as a damping process that suppresses the spatial-guidance term, while entanglement is interpreted as a nonseparable correlation structure rather than as a controllable superluminal signal. A complete treatment of spin requires an extension of the present scalar formulation to spinor-based dynamics."
              }
            }
          },
          {
            "id": "p7_v5.1_en_3",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "The present formulation remains limited to the nonrelativistic single-particle regime, with phenomenological extensions to measurement, decoherence, and selected quantum phenomena. Further work is required to extend the model to many-particle systems, Bell-type entanglement correlations, spinor dynamics, relativistic field theory, and experimentally testable predictions."
              }
            }
          },
          {
            "id": "p7_v5.1_en_4",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "**a. Relation to String-Theoretic Approaches**"
              }
            }
          },
          {
            "id": "p7_v5.1_en_5",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Many string-theoretic approaches also employ the concept of vibration, but in a different mathematical setting: the fundamental objects are one-dimensional extended entities, and additional compact dimensions are often introduced. In contrast, the present model attempts to locate the relevant vibration-like structure within an effective spatial-geometric framework, without introducing additional compact dimensions at this stage. This comparison is intended only to clarify the conceptual distinction between the two approaches, not to establish equivalence or superiority."
              }
            }
          },
          {
            "id": "p7_v5.1_en_6",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "**b. Scope and Speculative Extensions**"
              }
            }
          },
          {
            "id": "p7_v5.1_en_7",
            "versions": {
              "v5.1": {
                "ko": "",
                "en": "Possible connections between spatial-vibration defects and large-scale cosmological structures remain speculative. Claims involving spacetime topology, multiverse formation, or cosmological-scale dark sectors, including dark matter and dark energy, would require a separate relativistic and cosmological formulation. These topics are therefore not treated as established consequences of the present model, but as possible directions for future investigation."
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
      "ko": "KT 부장, 연세대학교 경영학 박사 수료, 코네티컷 대학교 법학 석사 (LL.M.)",
      "en": "KT Director, Ph.D. Candidate at Yonsei University, LL.M. at UCONN"
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
          "ko": "현대 우주론은 은하의 회전 속도 곡선 이상과 우주의 가속 팽창 문제를 해결하기 위해 암흑 물질(Dark Matter)과 암흑 에너지(Dark Energy), 그리고 우주 상수(Cosmological Constant, $\\\\Lambda$)를 도입하였으나, 이들의 물리적 실체는 현재까지 규명되지 않았다. 본 논문은 제1논문에서 입증된 '공간의 기하학적 진동' 모델을 우주론적 척도로 확장하여, 가상의 입자와 임시방편적인 상수를 전면 폐기하고 암흑 우주를 결정론적 기하 역학으로 대통합하는 대안적 역학 모델을 제시한다.\n본 연구는 아인슈타인의 장 방정식(Einstein Field Equations)에 물리적 실재를 지닌 **'공간 진동 텐서($\\\\tilde{V}_{\\\\mu\\\\nu}$)'**를 확장 도입한다. 은하 헤일로와 같이 질량 밀도가 희박한 영역에서 진동파가 거대 중력 우물(소용돌이)로 유입되며 극한의 보강 간섭을 일으켜 '텐서 응축(Tensor Condensation)'을 발생시킴을 역학적으로 규명하고, 이 막대한 응축 에너지가 질량-에너지 등가원리에 의해 잉여 중력(암흑 물질)으로 창발함을 증명한다.\n반면, 어떠한 중력적 억제력도 없는 광활한 우주 거대 공동(Voids)에서는 공간의 요동 텐서가 사방으로 뿜어내는 '진동 복사압(Vibrational Radiation Pressure, $p_{vib} < 0$)'이 시공간을 밀어내는 척력으로 작용하여 가속 팽창(암흑 에너지)을 주도함을 프리드만 방정식을 통해 수학화한다. 나아가 특수상대성이론의 길이 수축 현상을 광속 비행체가 겪는 진동 파동의 도플러 압착(Doppler Compression)으로 해명하며, 공간 접합에 의한 광학적 시간 도약(Optical Time-Leap) 및 중력 렌즈의 미세 섭동을 새로운 관측 지표로 제시한다.",
          "en": "To resolve the profound paradoxes of anomalous galactic rotation curves and the accelerating expansion of the universe, this study completely discards hypothetical particles (Dark Matter) and the ad-hoc cosmological constant (Dark Energy). Instead, it proposes a unified mechanical model by introducing the **'Geometrical Spatial Vibration Tensor ($\\\\tilde{V}_{\\\\mu\\\\nu}$)'**—established in our preceding paper—into the Einstein Field Equations.\nThis paper demonstrates the mechanism of 'Scale Inversion', where spatial vibrations previously suppressed by mass inertia regain dynamic dominance in sparse cosmic regions such as galactic halos. Spatial waves entering immense gravity wells undergo extreme constructive interference and 'Tensor Condensation', which emerges as effective surplus mass generating surplus gravity (Dark Matter) via mass-energy equivalence. Conversely, in unsuppressed vast cosmic voids, the intrinsic vibrational radiation pressure ($p_{vib} < 0$) emitted by the fluctuating vacuum acts as a repulsive field, driving the accelerated expansion of the universe (Dark Energy). Furthermore, length contraction in Special Relativity is mechanically elucidated as the 'Doppler Compression' of spatial waves during high-speed flight, and optical time-leaps (chronological illusions) induced by spatial junctions alongside micro-scattering in gravitational lensing are predicted as novel astronomical observational markers."
        },
        "v4": {
          "ko": "현대 우주론의 은하 회전 곡선 이상과 우주의 가속 팽창 문제를 해결하기 위해, 본 연구는 표준 암흑 물질 및 암흑 에너지 패러다임에 대한 기하역학적 대안을 탐구한다. 제1논문에서 도입된 '공간의 기하학적 요동' 가설을 바탕으로, 본 논문은 아인슈타인 장 방정식에 현상론적인 **'공간 진동 텐서($\\\\tilde{V}_{\\\\mu\\\\nu}$)'**를 도입하여 유효한 통합 모델을 제안한다.\n본 연구는 국소적 거시 규모에서는 질량 관성에 의해 억제되었던 공간 진동이 은하 헤일로와 같이 질량 밀도가 희박한 영역에서 역학적 타당성을 회복하는 '스케일 역전(Scale Inversion)' 메커니즘을 조사한다. 공간 파동이 깊은 중력 우물로 진입할 때 보강 간섭을 겪어 '텐서 응축(Tensor Condensation)'을 초래하며, 질량-에너지 등가원리에 의해 이 응축된 에너지가 유효 질량으로 작용하여 암흑 물질에 대한 현상론적 유추를 제공한다. 반대로, 거대 우주 공동에서는 요동하는 공간 배경이 방출하는 내재적 진동 복사압($p_{vib} < 0$)이 척력 장으로 작용하여 우주의 가속 팽창(암흑 에너지)을 주도하는 사변적 메커니즘을 제안한다.\n나아가 특수상대성이론의 길이 수축 현상을 휴리스틱하게 공간 파동의 '도플러 압착'으로 재해석하고, 중력 렌즈 현상에서의 미세 섭동을 관측 가능한 지표로 제시한다. 본 논문은 사변적인 해석에 머물러 있으며 엄밀한 상대론적 정식화를 필요로 하지만, 미시적 공간 요동과 거시적 우주 현상을 연결하는 개념적 경로를 개괄한다.",
          "en": "To address the cosmological challenges associated with anomalous galactic rotation curves and the accelerating expansion of the universe, this study explores a geomechanical alternative to standard dark matter and dark energy paradigms. Building upon the 'Geometrical Fluctuation of Space' hypothesis introduced in Part I, this paper proposes an effective unified model by incorporating a phenomenological 'Spatial Vibration Tensor' ($\\\\tilde{V}_{\\\\mu\\\\nu}$) into the Einstein field equations.\nWe investigate a 'Scale Inversion' mechanism, wherein spatial vibrations—hypothesized to be suppressed by mass inertia at local macroscopic scales—regain dynamic relevance in regions of sparse mass density, such as galactic halos. The model posits that spatial waves entering deep gravitational wells undergo constructive interference, resulting in 'Tensor Condensation'. By mass-energy equivalence, this condensed vibration energy may act as an effective mass, offering a phenomenological analogy to dark matter. Conversely, in vast cosmic voids, the intrinsic vibrational radiation pressure ($p_{vib} < 0$) emitted by the fluctuating spatial background is proposed as a repulsive effective field, providing a speculative mechanism for the accelerated expansion of the universe (dark energy).\nFurthermore, relativistic length contraction is heuristically reinterpreted as the 'Doppler Compression' of spatial waves, and micro-perturbations in gravitational lensing are suggested as potential observational markers. While remaining largely interpretive and requiring rigorous relativistic formulations, this paper outlines a conceptual pathway connecting microscopic spatial fluctuations with macroscopic cosmological phenomena."
        },
        "v5": {
          "ko": "은하 회전 곡선 이상과 우주의 가속 팽창이 야기하는 우주론적 역설을 해결하기 위해, 본 연구는 가상의 입자와 임시방편적 우주 상수를 배제하고 아인슈타인 장 방정식에 **'공간 진동 텐서($\\\\tilde{V}_{\\\\mu\\\\nu}$)'**를 도입하여 통합적인 기하역학 모델을 제안한다.\n본 모델은 아인슈타인의 등가원리와 에너지-운동량 보존 법칙을 엄격히 준수하기 위해 카멜레온 장(Chameleon Field) 메커니즘과 유사하게 주변 물질 밀도($\\\\rho_m$)에 동역학적으로 결합하는 상태 방정식 $w(\\\\rho_m)$을 지닌 '통합 암흑 유체' 역학을 도입한다. 국소적 거시 규모에서는 질량 관성에 의해 억제되었던 공간 진동이 희박한 은하 헤일로에서 역학적 타당성을 회복(스케일 역전)하며, 보강 간섭을 통해 운동 에너지 모드가 갇혀 **'텐서 응축'**($w \\\\approx 0$)을 일으키고 잉여 중력(암흑 물질)을 창발한다. 반면, 거대 공동에서는 퍼텐셜 모드가 지배적($w \\\\approx -1$)이 되어 방출되는 강력한 진동 복사압($p_{vib} < 0$)이 우주의 가속 팽창(암흑 에너지)을 주도한다.\n나아가 임의의 힘을 추가하는 오류를 배제하고 고주파 계량 텐서 섭동에 의한 **'확률론적 측지선 편차'** 방정식을 유도하여, 중력 렌즈 현상에서의 광학적 번짐과 공간 접합에 의한 광학적 시간 도약(Time-Leap)을 새로운 관측 지표로 제시한다.",
          "en": "To address the cosmological challenges associated with anomalous galactic rotation curves and the accelerating expansion of the universe, this study explores a geomechanical alternative to standard dark matter and dark energy paradigms. Building upon the 'Geometrical Fluctuation of Space' hypothesis introduced in Part I, this paper proposes an effective unified model by incorporating a phenomenological 'Spatial Vibration Tensor' ($\\\\tilde{V}_{\\\\mu\\\\nu}$) into the Einstein Field Equations.\nTo preserve the equivalence principle and local energy-momentum conservation, spatial vibration is modeled as high-frequency perturbations to the background metric. We propose a 'Unified Dark Fluid' behavior analogous to chameleon fields: in dense galactic halos, constructive interference traps kinetic modes, emerging as an effective mass ($w \\\\approx 0$) that generates surplus gravity (phenomenological Dark Matter). Conversely, in vast cosmic voids, the unsuppressed potential tension of the vacuum acts as a repulsive vibrational radiation pressure ($w \\\\approx -1$), driving accelerated expansion (Dark Energy). Furthermore, micro-perturbations in gravitational lensing are rigorously modeled as stochastic geodesic deviations driven by these metric perturbations, predicting optical blurring and optical time-leaps as novel observational markers."
        },
        "v6": {
          "ko": "은하 회전 곡선 이상과 우주의 가속 팽창이 야기하는 우주론적 역설을 해결하기 위해, 본 연구는 가상의 입자와 임시방편적 우주 상수를 배제하고 아인슈타인 장 방정식에 현상론적인 **'공간 진동 텐서($\\\\tilde{V}_{\\\\mu\\\\nu}$)'**를 도입하여 통합적인 기하역학 모델을 제안한다.\n본 모델은 아인슈타인의 등가원리와 에너지-운동량 보존 법칙을 엄격히 준수하기 위해 아이작슨(Isaacson) 고주파 평균화 기법을 차용하며, 주변 물질 밀도($\\\\rho_m$)에 동역학적으로 결합하는 카멜레온 장(Chameleon Field) 메커니즘을 도입하여 '통합 암흑 유체' 역학을 제시한다. 국소적 거시 규모에서는 질량 관성에 의해 억제되었던 공간 진동이 희박한 은하 헤일로에서 역학적 타당성을 회복(스케일 역전)하며, 보강 간섭을 통해 운동 에너지 모드가 갇혀 **'텐서 응축'**($w \\\\approx 0$)을 일으키고 잉여 중력(암흑 물질)을 창발한다. 반면, 거대 공동에서는 퍼텐셜 모드가 지배적($w \\\\to -1$)이 되어 방출되는 강력한 진동 복사압($p_{vib} < 0$)이 우주의 가속 팽창(암흑 에너지)을 주도한다.\n나아가 임의의 힘을 추가하는 오류를 배제하고 고주파 계량 텐서 섭동에 의한 **'확률론적 측지선 편차'** 방정식을 유도하여, 가스 산란과 구별되는 반증 가능한 **'파장 무관(Achromatic) 광학적 번짐'**을 예측한다. 국소적 음압($p_{vib} < 0$)에 의해 유지되는 거시적 공간 접합부는 광속을 위배하지 않으면서도 연대기적 착시(광학적 타임리프)를 일으키는 역학적 기제로 제안된다.",
          "en": "To address the cosmological challenges associated with anomalous galactic rotation curves and the accelerating expansion of the universe, this study explores a geomechanical alternative to standard dark matter and dark energy paradigms. Building upon the 'Geometrical Fluctuation of Space' hypothesis introduced in Part I, this paper proposes an effective unified model by incorporating a phenomenological 'Spatial Vibration Tensor' ($\\\\tilde{V}_{\\\\mu\\\\nu}$) into the Einstein Field Equations.\nTo preserve the equivalence principle and local energy-momentum conservation, spatial vibration is modeled as high-frequency perturbations to the background metric, averaged via the Isaacson limit ($\\\\tilde{V}_{\\\\mu\\\\nu} \\\\propto \\\\langle \\\\nabla_\\\\alpha h_{\\\\mu\\\\beta}^{vib} \\\\nabla^\\\\alpha h^{\\\\nu\\\\beta}_{vib} \\\\rangle$). We propose a 'Unified Dark Fluid' behavior employing a heuristic chameleon-like transition function: in dense galactic halos, constructive interference traps kinetic modes, emerging as an effective mass ($w \\\\approx 0$) that generates surplus gravity (phenomenological Dark Matter). Conversely, in vast cosmic voids, the unsuppressed potential tension of the vacuum acts as a repulsive vibrational radiation pressure ($w \\\\to -1$), driving accelerated expansion (Dark Energy). Furthermore, micro-perturbations in gravitational lensing are rigorously modeled as stochastic geodesic deviations, predicting 'Achromatic Optical Blurring' and optical time-leaps sustained by negative pressure as novel falsifiable observational markers."
        }
      }
    },
    "chapters": [
      {
        "number": 1,
        "title": {
          "ko": "1. 서론",
          "en": "1. Introduction"
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
          },
          {
            "id": "p1_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "제1논문에서 미시 세계의 확률적 파동 현상이 공간 배경의 기하학적 요동에서 비롯되는 것으로 모델링되었다. 또한, 조밀한 거시적 질량은 그 관성으로 인해 이 국소적 유도력을 동력학적으로 억제하여 뉴턴 고전 역학으로 유효하게 수렴함을 제안했다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "그러나 우주론적 차원으로 확장될 때, 심우주의 방대한 부피에 분포된 공간 진동 에너지가 희박한 질량 밀도 영역에서 천체의 거시적 관성을 다시 압도할 수 있으며, 이를 **'스케일 역전'**이라 정의한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "In Paper I, a framework was proposed wherein probabilistic wave phenomena in the microscopic realm are modeled as arising from the geometric fluctuations of the spatial background. It was also suggested that dense macroscopic masses dynamically suppress this local guidance force due to their inertia, leading to an effective convergence toward Newtonian mechanics."
              }
            }
          },
          {
            "id": "p1_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "However, when scaling up to cosmological dimensions, the dynamic interplay between mass inertia and spatial volume may undergo a significant shift. The spatial vibrational energy distributed across the vast volumes of deep space might overpower the macroscopic inertia of celestial bodies in regions of highly diluted mass density—a phenomenon defined here as **'Scale Inversion'**."
              }
            }
          },
          {
            "id": "p1_v4_en_3",
            "versions": {
              "v4": {
                "ko": "",
                "en": "From this macroscopic perspective, this paper investigates the theoretical interactions between the macroscopic spacetime curvature described by General Relativity and the proposed microscopic geometrical fluctuation of space."
              }
            }
          },
          {
            "id": "p1_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "제1논문(공간의 진동 역학 I)에서 미시 세계의 확률적 파동 현상이 공간 배경의 기하학적 요동에서 비롯되는 것으로 모델링되었다. 또한, 조밀한 거시적 질량은 그 압도적인 관성으로 인해 이 국소적 유도력을 동력학적으로 무시하여 뉴턴 고전 역학이 지배함을 규명하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "그러나 우주론적 차원으로 확장될 때, 질량 관성과 공간 체적 간의 역학적 줄다리기는 극적인 변화를 겪는다. 심우주의 방대한 체적에 누적된 공간 진동 에너지가 질량 밀도가 극도로 희박한 영역에서 천체의 거시적 관성을 다시 압도하게 되며, 이를 **'스케일 역전(Scale Inversion)'**이라 정의한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "이 초거시적 관점에서 본 논문은 일반상대성이론이 기술하는 거시적 시공간 곡률과 본 연구가 제안하는 미시적 기하학적 공간 요동 사이의 역학적 상호작용을 탐구한다. 시공간 곡률이 공간 진동을 왜곡하고, 이것이 다시 유효 에너지-운동량 텐서에 기여하는 현상론적 피드백 루프를 공식화함으로써, 본 연구는 암흑 물질과 암흑 에너지 현상을 텅 빈 공간 자체의 역학적 상전이(Phase Transition) 현상으로 재해석하고자 시도한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "In Paper I, this research mathematically proved that probabilistic wave phenomena in the microscopic realm originate from the 'geometrical fluctuation' of the empty background space. It also elucidated that dense macroscopic masses mechanically pierce through and ignore this local guidance force due to their overwhelming inertia, resulting in the domination of Newtonian classical mechanics."
              }
            }
          },
          {
            "id": "p1_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "However, when scaling up to cosmological dimensions, the dynamic tug-of-war between mass inertia and spatial volume undergoes a dramatic inversion. The immense spatial vibrational energy accumulated within the vast volumes of deep space seizes the opportunity of diluted mass density to once again overpower the macroscopic inertia of celestial bodies—a phenomenon defined as **'Scale Inversion'**."
              }
            }
          },
          {
            "id": "p1_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "From this macroscopic perspective, this paper investigates the mechanical interactions between the 'Macroscopic Spacetime Curvature' described by General Relativity and the 'Microscopic Geometrical Fluctuation of Space'. By formulating a feedback loop where spacetime curvature distorts spatial vibrations, which in turn dynamically contribute to the effective energy-momentum tensor, this study replaces the unknown phenomena of dark matter and dark energy with the mechanical phase transitions of empty space itself."
              }
            }
          },
          {
            "id": "p1_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "제1논문(공간의 진동 역학 I)에서 미시 세계의 확률적 파동 현상이 공간 배경의 기하학적 요동에서 비롯되는 것으로 모델링되었다. 또한, 조밀한 거시적 질량은 그 압도적인 관성으로 이 국소적 유도력을 동력학적으로 무시하여 뉴턴 고전 역학이 지배함을 규명하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "그러나 우주론적 차원으로 확장될 때, 심우주의 방대한 체적에 누적된 공간 진동 에너지가 질량 밀도가 극도로 희박한 영역에서 천체의 거시적 관성을 다시 압도하게 되며, 이를 **'스케일 역전(Scale Inversion)'**이라 정의한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "이 초거시적 관점에서 본 논문은 일반상대성이론이 기술하는 거시적 시공간 곡률과 본 연구가 제안하는 미시적 기하학적 공간 요동 사이의 역학적 상호작용을 탐구한다. 시공간 곡률이 공간 진동을 왜곡하고, 이것이 다시 유효 에너지-운동량 텐서에 동역학적으로 기여하는 피드백 루프를 공식화함으로써, 본 연구는 암흑 물질과 암흑 에너지 현상을 텅 빈 공간 자체의 역학적 상전이(Phase Transition) 현상으로 재해석하고자 시도한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p1_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "In Paper I of this series, a framework was proposed wherein probabilistic wave phenomena in the microscopic realm are modeled as arising from the geometric fluctuations of the spatial background. It was also established that dense macroscopic masses dynamically suppress this local guidance force due to their inertia, leading to an effective convergence toward Newtonian classical mechanics."
              }
            }
          },
          {
            "id": "p1_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "However, when scaling up to cosmological dimensions, the dynamic interplay between mass inertia and spatial volume undergoes a dramatic inversion. The immense spatial vibrational energy accumulated within the vast volumes of deep space seizes the opportunity of diluted mass density to once again overpower the macroscopic inertia of celestial bodies—a phenomenon defined here as **'Scale Inversion'**."
              }
            }
          },
          {
            "id": "p1_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "From this macroscopic perspective, this paper investigates the mechanical interactions between the macroscopic spacetime curvature described by General Relativity and the microscopic geometrical fluctuation of space. By formulating a feedback loop where spacetime curvature distorts spatial vibrations, which in turn dynamically contribute to the effective energy-momentum tensor, this study attempts to reinterpret the phenomena attributed to dark matter and dark energy as consequences of the mechanical phase transitions of empty space itself."
              }
            }
          }
        ]
      },
      {
        "number": 2,
        "title": {
          "ko": "2. 진동과 중력의 결합 방정식",
          "en": "2. Coupled Equations of Vibration and Gravity"
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
          },
          {
            "id": "p2_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "### 2.1. 공간 진동 텐서($\\tilde{V}_{\\mu\\nu}$)",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "요동하는 공간이 방출하는 유효 운동 에너지와 복사압을 기술하기 위해, 아인슈타인 방정식의 추가 소스 항으로 현상론적인 **'공간 진동 텐서'**를 도입한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_3",
            "versions": {
              "v4": {
                "ko": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "이 탐색적 모델에서 우주 상수 $\\Lambda$는 생략되며, 그 역할은 진동 텐서의 팽창하는 복사압의 창발적 특성으로 조사된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_5",
            "versions": {
              "v4": {
                "ko": "### 2.2. 길이 수축의 휴리스틱 재해석",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_ko_6",
            "versions": {
              "v4": {
                "ko": "특수상대성이론의 길이 수축 현상은 본 모델에서 휴리스틱하게 공간 파동의 **'도플러 압착'**으로 유추될 수 있다. 공간 파장이 물리적 거리를 측정하는 유효 척도 역할을 한다고 가정할 때, 전방의 파동이 압축되는 것은 척도 자체의 유효한 수축을 의미한다. 그러나 이 유추는 보다 엄밀한 상대론적 검증을 필요로 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The standard Einstein field equations typically assume the vacuum state to be a smooth continuum. However, following the postulates of Paper I, the vacuum is modeled as possessing geometrical amplitudes fluctuating at microscopic scales."
              }
            }
          },
          {
            "id": "p2_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 2.1. The Spatial Vibration Tensor ($\\tilde{V}_{\\mu\\nu}$)"
              }
            }
          },
          {
            "id": "p2_v4_en_3",
            "versions": {
              "v4": {
                "ko": "",
                "en": "To describe the effective kinetic energy and radiation pressure emitted by the fluctuating space, a phenomenological **'Spatial Vibration Tensor' ($\\tilde{V}_{\\mu\\nu}$)** is introduced as an additional source term in the Einstein equations:"
              }
            }
          },
          {
            "id": "p2_v4_en_4",
            "versions": {
              "v4": {
                "ko": "",
                "en": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$"
              }
            }
          },
          {
            "id": "p2_v4_en_5",
            "versions": {
              "v4": {
                "ko": "",
                "en": "In this exploratory model, the cosmological constant $\\Lambda$ is omitted, and its role is investigated as an emergent property of the expansive radiation pressure of the vibration tensor $\\tilde{V}_{\\mu\\nu}$."
              }
            }
          },
          {
            "id": "p2_v4_en_6",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 2.2. Heuristic Reinterpretation of Length Contraction"
              }
            }
          },
          {
            "id": "p2_v4_en_7",
            "versions": {
              "v4": {
                "ko": "",
                "en": "The phenomenon of length contraction in Special Relativity can be heuristically analogized as the **'Doppler Compression'** of spatial waves. Assuming the spatial wavelength serves as an effective metric measuring physical distance, the compression of spatial wave-fronts ahead of an object approaching the wave propagation speed $c$ implies an effective contraction of the metric yardstick. This analogy, however, requires further rigorous relativistic validation."
              }
            }
          },
          {
            "id": "p2_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "표준 아인슈타인 장 방정식은 진공을 매끄러운 연속체로 가정한다 [1]. 그러나 제1논문의 공리에 따라, 진공은 미시적 스케일에서 끊임없이 요동치는 기하학적 진폭을 지닌 것으로 모델링된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "### 2.1. 공간 진동 텐서($\\tilde{V}_{\\mu\\nu}$)의 도입",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "요동하는 공간이 방출하는 유효 운동 에너지와 척력적 복사압을 기술하기 위해, 아인슈타인 방정식의 추가 소스 항으로 현상론적인 **'공간 진동 텐서'**를 도입한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_4",
            "versions": {
              "v5": {
                "ko": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_5",
            "versions": {
              "v5": {
                "ko": "이 모델에서 임시방편적인 우주 상수 $\\Lambda$는 완전히 폐기된다. 비안키 항등식($\\nabla^\\mu G_{\\mu\\nu} = 0$)에 따른 국소적 에너지-운동량 보존을 엄격히 만족하기 위해, 공간 진동 텐서는 거시적으로 평균화된 배경 계량 텐서의 고주파 섭동 장($g_{\\mu\\nu} = \\bar{g}_{\\mu\\nu} + h_{\\mu\\nu}^{vib}$)에서 기인하는 유효 텐서로 취급된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_6",
            "versions": {
              "v5": {
                "ko": "### 2.2. 동역학적 피드백 루프와 계량 섭동",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_ko_7",
            "versions": {
              "v5": {
                "ko": "아인슈타인의 등가원리를 엄격히 수호하기 위해, 공간 진동은 외부의 힘이 아니라 배경 계량 텐서 자체에 대한 고주파 미세 섭동으로 취급된다. 거대 질량체가 시공간을 강하게 휠 때, 주변의 공간 진동파는 중력 우물로 유입되어 극심하게 압축(Blue-shift)된다. 이 압축된 파동들은 극한의 보강 간섭을 일으켜 국소적 텐서 에너지 밀도를 폭증시키고, 이는 다시 거시적 배경 시공간 $\\bar{g}_{\\mu\\nu}$을 휘게 만드는 유효 응력-에너지로 작용하는 비선형 피드백 루프를 형성한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The standard Einstein Field Equations assume the vacuum state to be a smooth continuum [1]. However, according to this study's axioms, the vacuum possesses geometrical amplitudes fluctuating at microscopic scales."
              }
            }
          },
          {
            "id": "p2_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 2.1. Introduction of the Spatial Vibration Tensor ($\\tilde{V}_{\\mu\\nu}$)"
              }
            }
          },
          {
            "id": "p2_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "To describe the kinetic energy and geometrical repulsive radiation pressure inherently emitted by the fiercely vibrating empty space, a novel **'Spatial Vibration Tensor ($\\tilde{V}_{\\mu\\nu}$)'** is introduced as an additional source term:"
              }
            }
          },
          {
            "id": "p2_v5_en_4",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$"
              }
            }
          },
          {
            "id": "p2_v5_en_5",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The cosmological constant $\\Lambda$ is entirely discarded. To strictly satisfy the Bianchi Identity ($\\nabla^\\mu G_{\\mu\\nu} = 0$), the vibration tensor is mandated to conserve energy-momentum locally, treated as an effective tensor arising from high-frequency metric perturbations ($g_{\\mu\\nu} = \\bar{g}_{\\mu\\nu} + h_{\\mu\\nu}^{vib}$) averaged over macroscopic scales."
              }
            }
          },
          {
            "id": "p2_v5_en_6",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 2.2. Dynamical Feedback Loop"
              }
            }
          },
          {
            "id": "p2_v5_en_7",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The extended equation reveals a nonlinear feedback loop. As a massive object curves the background spacetime ($\\bar{g}_{\\mu\\nu}$), surrounding spatial vibrational waves ($h_{\\mu\\nu}^{vib}$) are drawn into the gravity well, becoming severely compressed and distorted. These compressed waves undergo extreme constructive interference, explosively increasing local tensor energy density, which in turn acts as an effective source to further curve the macroscopic spacetime."
              }
            }
          },
          {
            "id": "p2_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "표준 아인슈타인 장 방정식은 진공을 매끄러운 연속체로 가정한다 [1]. 그러나 제1논문의 공리에 따라, 진공은 미시적 스케일에서 끊임없이 요동치는 기하학적 진폭을 지닌 것으로 모델링된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "### 2.1. 공간 진동 텐서($\\tilde{V}_{\\mu\\nu}$)의 도입과 아이작슨 한계",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "요동하는 공간이 방출하는 유효 운동 에너지와 척력적 복사압을 기술하기 위해, 아인슈타인 방정식의 추가 소스 항으로 현상론적인 **'공간 진동 텐서'**를 도입한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_4",
            "versions": {
              "v6": {
                "ko": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_5",
            "versions": {
              "v6": {
                "ko": "임시방편적인 우주 상수 $\\Lambda$는 완전히 폐기된다. 비안키 항등식($\\nabla^\\mu G_{\\mu\\nu} = 0$)에 따른 국소적 에너지-운동량 보존을 엄격히 만족하기 위해, 공간 진동은 배경 계량 텐서의 고주파 미세 섭동($g_{\\mu\\nu} = \\bar{g}_{\\mu\\nu} + h_{\\mu\\nu}^{vib}$)으로 취급된다. 파동 자체의 단순 선형 평균은 0이 되므로($\\langle h_{\\mu\\nu}^{vib} \\rangle = 0$), 유효 공간 진동 텐서는 아이작슨 고주파 극한(Isaacson high-frequency limit) [2]과 수학적으로 유사하게 계량 섭동의 도함수 제곱 항에 대한 거시적 공간 평균으로부터 유도된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_6",
            "versions": {
              "v6": {
                "ko": "$$ \\tilde{V}_{\\mu\\nu} \\propto \\frac{c^4}{G} \\langle \\nabla_\\alpha h_{\\mu\\beta}^{vib} \\nabla^\\alpha h^{\\nu\\beta}_{vib} \\rangle $$",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_7",
            "versions": {
              "v6": {
                "ko": "### 2.2. 동역학적 피드백 루프",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_ko_8",
            "versions": {
              "v6": {
                "ko": "거대 질량체가 거시적 시공간($\\bar{g}_{\\mu\\nu}$)을 강하게 휠 때, 주변의 공간 진동파는 중력 우물로 유입되어 극심하게 압축된다. 이 압축된 파동들은 극한의 보강 간섭을 일으켜 국소적 텐서 에너지 밀도를 폭증시키고, 이는 다시 거시적 배경 시공간을 휘게 만드는 유효 응력-에너지로 작용하는 비선형 피드백 루프를 형성한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p2_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "The standard Einstein Field Equations typically assume the vacuum state to be a smooth continuum [1]. However, according to this study's axioms, the vacuum possesses geometrical amplitudes fluctuating at microscopic scales."
              }
            }
          },
          {
            "id": "p2_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 2.1. Introduction of the Spatial Vibration Tensor and Isaacson Limit"
              }
            }
          },
          {
            "id": "p2_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "To describe the kinetic energy and geometrical repulsive radiation pressure inherently emitted by the vibrating empty space, a phenomenological **'Spatial Vibration Tensor' ($\\tilde{V}_{\\mu\\nu}$)** is introduced as an additional source term:"
              }
            }
          },
          {
            "id": "p2_v6_en_4",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} \\left( T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu} \\right) $$"
              }
            }
          },
          {
            "id": "p2_v6_en_5",
            "versions": {
              "v6": {
                "ko": "",
                "en": "The cosmological constant $\\Lambda$ is entirely discarded. To strictly satisfy the Bianchi Identity ($\\nabla^\\mu G_{\\mu\\nu} = 0$), the vibration tensor is mandated to conserve energy-momentum locally."
              }
            }
          },
          {
            "id": "p2_v6_en_6",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Spatial vibration is treated as high-frequency metric perturbations ($g_{\\mu\\nu} = \\bar{g}_{\\mu\\nu} + h_{\\mu\\nu}^{vib}$). The linear spatial average of a pure wave is exactly zero ($\\langle h_{\\mu\\nu}^{vib} \\rangle = 0$). Therefore, the effective spatial vibration tensor $\\tilde{V}_{\\mu\\nu}$ is mathematically constructed analogously to the Isaacson high-frequency limit [2], derived from the macroscopic spatial averaging of the quadratic derivative terms of the metric perturbations:"
              }
            }
          },
          {
            "id": "p2_v6_en_7",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ \\tilde{V}_{\\mu\\nu} \\propto \\frac{c^4}{G} \\langle \\nabla_\\alpha h_{\\mu\\beta}^{vib} \\nabla^\\alpha h^{\\nu\\beta}_{vib} \\rangle $$"
              }
            }
          },
          {
            "id": "p2_v6_en_8",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 2.2. Dynamical Feedback Loop"
              }
            }
          },
          {
            "id": "p2_v6_en_9",
            "versions": {
              "v6": {
                "ko": "",
                "en": "The extended equation reveals a nonlinear feedback loop. As a massive object curves the background spacetime ($\\bar{g}_{\\mu\\nu}$), surrounding spatial vibrational waves ($h_{\\mu\\nu}^{vib}$) are drawn into the gravity well, becoming severely compressed and distorted. These compressed waves undergo extreme constructive interference, explosively increasing local tensor energy density, which in turn acts as an effective source to further curve the macroscopic spacetime."
              }
            }
          }
        ]
      },
      {
        "number": 3,
        "title": {
          "ko": "3. 중력 렌즈 현상의 미세 섭동 예측",
          "en": "3. Prediction of Micro-Perturbations in Gravitational Lensing"
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
          },
          {
            "id": "p3_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "### 3.1. 요동치는 측지선 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "현상론적으로 수정된 측지선 방정식을 제안한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_3",
            "versions": {
              "v4": {
                "ko": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\Gamma^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = \\mathbf{f}_{\\mathrm{jitter}} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "여기서 $\\mathbf{f}_{\\mathrm{jitter}}$는 유효 미시 진동 산란 항을 나타낸다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_5",
            "versions": {
              "v4": {
                "ko": "### 3.2. 관측 가능한 예측",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_ko_6",
            "versions": {
              "v4": {
                "ko": "중력 렌즈 관측 시 테두리에서 서브 픽셀 수준의 산란인 **'광학적 번짐'**이 나타날 수 있다. 또한 고전적 샤피로 시간 지연 외에 공간 진동 텐서의 경로 적분에 비례하는 **'잉여 위상 지연'**이 예측된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "If the spatial background fluctuates, light passing through massive gravity wells may experience micro-perturbation errors due to vibrational scattering."
              }
            }
          },
          {
            "id": "p3_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 3.1. Perturbed Geodesic Equation"
              }
            }
          },
          {
            "id": "p3_v4_en_3",
            "versions": {
              "v4": {
                "ko": "",
                "en": "A phenomenologically modified geodesic equation is proposed:"
              }
            }
          },
          {
            "id": "p3_v4_en_4",
            "versions": {
              "v4": {
                "ko": "",
                "en": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\Gamma^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = \\mathbf{f}_{\\mathrm{jitter}} $$"
              }
            }
          },
          {
            "id": "p3_v4_en_5",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Here, $\\mathbf{f}_{\\mathrm{jitter}}$ denotes an effective microscopic vibrational scattering term."
              }
            }
          },
          {
            "id": "p3_v4_en_6",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 3.2. Observational Predictions"
              }
            }
          },
          {
            "id": "p3_v4_en_7",
            "versions": {
              "v4": {
                "ko": "",
                "en": "High-resolution observations of gravitational lenses might reveal sub-pixel scattered **'Optical Blurring'** at the edges. Additionally, a **'Surplus Phase Delay ($\\Delta t_{\\mathrm{vibration}}$)'** proportional to the path integral of the spatial vibration tensor is predicted, supplementary to the classical Shapiro time delay."
              }
            }
          },
          {
            "id": "p3_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "고전 이론은 거대 중력 우물을 지나는 빛의 궤적이 완벽히 매끄러운 측지선을 따른다고 전제해 왔다. 그러나 격렬하게 요동치는 텐서 표면을 통과하는 빛은 미시적 산란 오류를 겪어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "### 3.1. 확률론적 측지선 편차 (Stochastic Geodesic Deviation)",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "등가원리를 수호하기 위해 측지선 방정식 우변에 임의의 힘을 더하지 않는다. 대신 빛은 섭동된 계량 $g_{\\mu\\nu}$의 영 측지선(Null geodesics)을 엄격히 따른다. 크리스토펠 기호의 확률론적 요동($\\delta \\Gamma^\\mu_{\\rho\\sigma}$)이 포함된 수정된 방정식이 도출된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_4",
            "versions": {
              "v5": {
                "ko": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\bar{\\Gamma}^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_5",
            "versions": {
              "v5": {
                "ko": "이는 빛의 궤적에 **'확률론적 측지선 편차'**를 유발하여 일반상대론의 원리를 위배하지 않고 자연스러운 미세 산란을 발생시킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_6",
            "versions": {
              "v5": {
                "ko": "### 3.2. 관측 가능한 예측: 광학적 번짐과 잉여 위상 지연",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_7",
            "versions": {
              "v5": {
                "ko": "중력 렌즈 관측 시 테두리에서 확률론적 산란에 의한 서브 픽셀 수준의 **'광학적 번짐(Optical Blurring)'** 현상이 나타날 것이다. 또한 빛이 굽이치는 진동 계곡을 따라 우회해야 하므로 고전적 샤피로 시간 지연 [2] 외에 공간 진동 텐서의 경로 적분에 비례하는 **'잉여 위상 지연($\\Delta t_{vibration}$)'**이 필수적으로 추가될 것을 예측한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_8",
            "versions": {
              "v5": {
                "ko": "### 3.3. 공간 접합에 의한 광학적 시간 도약과 연대기적 착시",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_9",
            "versions": {
              "v5": {
                "ko": "제1논문에서 규명한 '거리 0의 공간 접합($\\Omega$형 위상 튜브)' 현상이 거시 텐서 응축 지대에서 발현될 경우, 심우주의 별빛이 기하학적으로 극단적으로 꼬여 맞닿은 거시적 **'공간 접합부(Spatial Junction)'**를 관통하게 된다. 이때 빛은 물리적인 수백만 광년 거리를 시간 지연 없이($t \\approx 0$) 순식간에 건너뛰는 **'광학적 시간 도약(Optical Time-Leap)'**을 겪게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_ko_10",
            "versions": {
              "v5": {
                "ko": "이는 제임스 웹 우주 망원경(JWST)이 발견한 빅뱅 직후의 초거대 조숙 은하들이 공간 단락 지름길을 타고 넘어와 마치 우주 초창기에 존재하는 것처럼 심각한 **'연대기적 착시'**를 일으킬 가능성을 사변적으로 설명한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Classical theory assumes the trajectory of light passing through massive gravity wells traces perfectly smooth geodesics. However, light passing through violently fluctuating tensor surfaces must generate micro-perturbation errors."
              }
            }
          },
          {
            "id": "p3_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 3.1. Stochastic Geodesic Deviation"
              }
            }
          },
          {
            "id": "p3_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "To preserve the Einstein Equivalence Principle, we do not introduce arbitrary forces. Instead, because the background metric itself contains high-frequency spatial vibrations ($h_{\\mu\\nu}^{vib}$), the Christoffel symbols undergo stochastic fluctuations ($\\Gamma^\\mu_{\\rho\\sigma} = \\bar{\\Gamma}^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V})$). Light perfectly follows the null geodesic of this perturbed metric, resulting in a **'Stochastic Geodesic Deviation'**:"
              }
            }
          },
          {
            "id": "p3_v5_en_4",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\bar{\\Gamma}^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = 0 $$"
              }
            }
          },
          {
            "id": "p3_v5_en_5",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 3.2. Observational Predictions: Optical Blurring and Surplus Phase Delay"
              }
            }
          },
          {
            "id": "p3_v5_en_6",
            "versions": {
              "v5": {
                "ko": "",
                "en": "High-resolution observations of gravitational lenses (Einstein Rings) should inevitably reveal sub-pixel scattered **'Optical Blurring (Micro-Scattering)'** at the edges, resulting directly from the stochastic geodesic deviation. Additionally, because light must detour along undulating vibrational valleys, a **'Surplus Phase Delay ($\\Delta t_{vibration}$)'** proportional to the path integral of the spatial vibration tensor is predicted, supplementary to the classical Shapiro time delay [2]."
              }
            }
          },
          {
            "id": "p3_v5_en_7",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 3.3. Optical Time-Leap via Spatial Junctions"
              }
            }
          },
          {
            "id": "p3_v5_en_8",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Conversely, the 'zero-distance spatial junction' ($\\Omega$-shaped phase tube) phenomenon established in Part I can manifest macroscopically in extreme tensor condensation zones. If starlight from deep space penetrates a macroscopic **'Spatial Junction'**—where severely twisted space folds onto itself, short-circuiting the internal geometrical distance to near zero—the light bypasses physical distance in effectively zero time ($t \\approx 0$)."
              }
            }
          },
          {
            "id": "p3_v5_en_9",
            "versions": {
              "v5": {
                "ko": "",
                "en": "This **'Optical Time-Leap'** offers a speculative explanation for chronological illusions confounding modern astronomy. The impossibly mature early galaxies recently discovered by JWST might be an illusion caused by light traveling through geometrically shortened paths."
              }
            }
          },
          {
            "id": "p3_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "고전 이론은 거대 중력 우물을 지나는 빛의 궤적이 완벽히 매끄러운 측지선을 따른다고 전제한다. 그러나 격렬하게 요동치는 텐서 표면을 통과하는 빛은 미시적 산란 오류를 겪어야 한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "### 3.1. 확률론적 측지선 편차 (Stochastic Geodesic Deviation)",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "등가원리를 수호하기 위해 측지선 방정식 우변에 임의의 힘을 더하지 않는다. 대신 배경 계량 텐서 자체가 고주파 미세 섭동을 가지므로, 크리스토펠 기호의 확률론적 요동($\\delta \\Gamma^\\mu_{\\rho\\sigma}$)이 포함된 수정된 측지선 방정식이 도출된다:",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_4",
            "versions": {
              "v6": {
                "ko": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\bar{\\Gamma}^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = 0 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_5",
            "versions": {
              "v6": {
                "ko": "이는 빛의 궤적에 **'확률론적 측지선 편차'**를 유발하여 일반상대론의 원리를 위배하지 않고 자연스러운 미세 산란을 발생시킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_6",
            "versions": {
              "v6": {
                "ko": "### 3.2. 반증 가능 예측: 파장 무관성(Achromatic) 광학적 번짐",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_7",
            "versions": {
              "v6": {
                "ko": "중력 렌즈 관측 시 테두리에서 확률론적 산란에 의한 서브 픽셀 수준의 **'광학적 번짐(Optical Blurring)'** 현상이 나타날 것이다. 일반적인 우주 가스나 플라즈마에 의한 산란은 파장에 따라 굴절률이 다른 색수차를 발생시킨다. 반면, 본 모델이 예측하는 기하학적 시공간 진동에 의한 산란은 전파부터 감마선까지 **모든 파장 대역에서 완벽하게 동일한 폭의 파장 무관성 번짐(Achromatic Blurring)**을 보여야 하며, 이는 본 이론을 입증하는 결정적 반증 기준이다. 고전적 샤피로 지연 [3] 외에 경로 적분에 비례하는 잉여 위상 지연 또한 추가될 것을 예측한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_8",
            "versions": {
              "v6": {
                "ko": "### 3.3. 공간 접합부의 음압(Negative Pressure)과 시간 도약",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_9",
            "versions": {
              "v6": {
                "ko": "제1논문에서 규명한 '거리 0의 공간 접합($\\Omega$형 위상 튜브)' 현상이 거시 텐서 응축 지대에서 발현될 경우, 심우주의 별빛이 기하학적으로 극단적으로 꼬여 맞닿은 거시적 **'공간 접합부(Spatial Junction)'**를 관통하게 된다. 이때 빛은 물리적인 수백만 광년 거리를 시간 지연 없이($t \\approx 0$) 순식간에 건너뛰는 **'광학적 시간 도약(Optical Time-Leap)'**을 겪게 된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_ko_10",
            "versions": {
              "v6": {
                "ko": "이러한 거시적 웜홀 구조가 일반상대론의 인과율을 붕괴시킨다는 역설은 동역학적으로 해결된다. 접합부 내부는 물질이 희박하므로 (4.1절의 카멜레온 메커니즘에 따라) 강력한 **음압($p_{vib} < 0$)**이 자발적으로 발생하며 웜홀 구조가 붕괴하지 않도록 역학적으로 지탱한다. 빛은 국소적 광속($c$)을 철저히 보존하지만, 텐서 응결이 시공간을 극도로 압축하는 기하학적 렌즈 역할을 하여 JWST의 조숙 은하들과 같은 심각한 **'연대기적 착시(Chronological Illusion)'**를 일으킬 뿐이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p3_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 3.1. Stochastic Geodesic Deviation"
              }
            }
          },
          {
            "id": "p3_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "To preserve the Einstein Equivalence Principle, we do not introduce arbitrary forces. Instead, because the background metric itself contains high-frequency spatial vibrations ($h_{\\mu\\nu}^{vib}$), the Christoffel symbols undergo stochastic fluctuations ($\\Gamma^\\mu_{\\rho\\sigma} = \\bar{\\Gamma}^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V})$). Light perfectly follows the null geodesic of this perturbed metric, resulting in a **'Stochastic Geodesic Deviation'**:"
              }
            }
          },
          {
            "id": "p3_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ \\frac{d^2 x^\\mu}{d\\lambda^2} + \\left( \\bar{\\Gamma}^\\mu_{\\rho\\sigma} + \\delta \\Gamma^\\mu_{\\rho\\sigma}(\\tilde{V}) \\right) \\frac{dx^\\rho}{d\\lambda} \\frac{dx^\\sigma}{d\\lambda} = 0 $$"
              }
            }
          },
          {
            "id": "p3_v6_en_4",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 3.2. Falsifiable Prediction: Achromatic Optical Blurring"
              }
            }
          },
          {
            "id": "p3_v6_en_5",
            "versions": {
              "v6": {
                "ko": "",
                "en": "High-resolution observations of gravitational lenses should inevitably reveal sub-pixel scattered **'Optical Blurring'** at the edges due to stochastic geodesic deviation. Conventional astronomy might dismiss this as simple scattering by intergalactic gas or plasma."
              }
            }
          },
          {
            "id": "p3_v6_en_6",
            "versions": {
              "v6": {
                "ko": "",
                "en": "To establish a crucial falsification test, we emphasize the **Achromaticity** of our prediction. Plasma scattering is wavelength-dependent (chromatic aberration). Conversely, the micro-scattering predicted by our model arises from pure geometrical spacetime vibrations. Therefore, we predict a strictly **'Achromatic Blurring'**—an identical blurring width across all frequency bands from radio waves to gamma rays. This serves as a definitive falsification standard."
              }
            }
          },
          {
            "id": "p3_v6_en_7",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Additionally, a **'Surplus Phase Delay ($\\Delta t_{vibration}$)'** proportional to the path integral of the spatial vibration tensor is predicted, supplementary to the classical Shapiro time delay [3]."
              }
            }
          },
          {
            "id": "p3_v6_en_8",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 3.3. Optical Time-Leap and the Wormhole Paradox"
              }
            }
          },
          {
            "id": "p3_v6_en_9",
            "versions": {
              "v6": {
                "ko": "",
                "en": "If starlight penetrates a macroscopic **'Spatial Junction'**—where severely twisted space folds onto itself, short-circuiting the internal geometrical distance—light bypasses immense physical distances in effectively zero time ($t \\approx 0$)."
              }
            }
          },
          {
            "id": "p3_v6_en_10",
            "versions": {
              "v6": {
                "ko": "",
                "en": "To avoid violating causality via traversable wormholes (which require unphysical negative energy), we propose that this junction is dynamically sustained by the extreme **Negative Pressure ($p_{vib} < 0$)** generated via the chameleon mechanism (Section 4.1). Furthermore, this **'Optical Time-Leap'** does not violate the local speed of light $c$. The tensor condensation acts as an extreme 'Geometric Magnifier'. Consequently, the 'impossibly mature early galaxies' recently discovered by JWST are a profound **Chronological Illusion** caused by light traveling through these geometrically shortened paths, strictly preserving relativistic causality."
              }
            }
          }
        ]
      },
      {
        "number": 4,
        "title": {
          "ko": "4. 통합 암흑 유체: 카멜레온 장 역학",
          "en": "4. The Unified Dark Fluid: Chameleon Dynamics of the Tensor Sector"
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
          },
          {
            "id": "p4_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "### 4.1. 텐서 응축으로서의 암흑 물질",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "은하 헤일로와 같은 영역에서 은하 중력 우물로 유입된 진동파들은 보강 간섭을 겪는다. $\\tilde{V}_{\\mu\\nu}$ 에너지 밀도의 이러한 급증을 **'텐서 응축'**으로 정의한다. 이 응축된 에너지는 질량-에너지 등가원리에 따라 창발 중력 개념과 유사하게 잉여 중력에 기여한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_3",
            "versions": {
              "v4": {
                "ko": "$$ M_{\\mathrm{eff}}(r) = M_{\\mathrm{visible}}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\tilde{V}_{00}(r') \\, 4\\pi r'^2 dr' $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_4",
            "versions": {
              "v4": {
                "ko": "따라서 암흑 물질은 응축된 공간 진동 에너지에 의해 생성된 기하학적 잉여 중력으로 현상론적으로 재해석된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_5",
            "versions": {
              "v4": {
                "ko": "### 4.2. 진동 복사압으로서의 암흑 에너지",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_6",
            "versions": {
              "v4": {
                "ko": "거대 공동과 같이 중력적 억제가 없는 텅 빈 공간에서 공간 진동은 척력 압력을 바깥으로 방출한다($p_{\\mathrm{vib}} \\approx -\\rho_{\\mathrm{vib}} c^2$). 이를 프리드만 가속도 방정식에 대입하면:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_7",
            "versions": {
              "v4": {
                "ko": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{\\mathrm{vib}}}{c^2} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_ko_8",
            "versions": {
              "v4": {
                "ko": "우주가 팽창함에 따라 진공 부피가 방출하는 총 척력 압력이 증가하여 가속 팽창($\\ddot{a}>0$)을 주도한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "This section explores an alternative to standard $\\Lambda$CDM cosmology by interpreting dark sector phenomena through the mechanics of the spatial vibration tensor."
              }
            }
          },
          {
            "id": "p4_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 4.1. Dark Matter as Tensor Condensation"
              }
            }
          },
          {
            "id": "p4_v4_en_3",
            "versions": {
              "v4": {
                "ko": "",
                "en": "In regions with extremely low visible mass density, such as galactic halos, 'Scale Inversion' allows spatial vibration energy to regain dynamic relevance. Vibrational waves drawn into the galactic gravitational well undergo constructive interference. This surge in the energy density of $\\tilde{V}_{\\mu\\nu}$ is defined as **'Tensor Condensation'**."
              }
            }
          },
          {
            "id": "p4_v4_en_4",
            "versions": {
              "v4": {
                "ko": "",
                "en": "By mass-energy equivalence, this condensed tensor energy assumes an 'Effective Mass', contributing to surplus gravity, similar to the concept of emergent gravity."
              }
            }
          },
          {
            "id": "p4_v4_en_5",
            "versions": {
              "v4": {
                "ko": "",
                "en": "$$ M_{\\mathrm{eff}}(r) = M_{\\mathrm{visible}}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\tilde{V}_{00}(r') \\, 4\\pi r'^2 dr' $$"
              }
            }
          },
          {
            "id": "p4_v4_en_6",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Dark matter is thus phenomenologically reinterpreted as the geometrical surplus gravity generated by the condensed spatial vibration energy."
              }
            }
          },
          {
            "id": "p4_v4_en_7",
            "versions": {
              "v4": {
                "ko": "",
                "en": "### 4.2. Dark Energy as Vibrational Radiation Pressure"
              }
            }
          },
          {
            "id": "p4_v4_en_8",
            "versions": {
              "v4": {
                "ko": "",
                "en": "In vast empty spaces devoid of strong gravitational suppression (Cosmic Voids), the intrinsic geometrical vibration of space ($\\tilde{V}_{\\mu\\nu}$) radiates a repulsive pressure outward:"
              }
            }
          },
          {
            "id": "p4_v4_en_9",
            "versions": {
              "v4": {
                "ko": "",
                "en": "$$ p_{\\mathrm{vib}} \\approx -\\rho_{\\mathrm{vib}} c^2 $$"
              }
            }
          },
          {
            "id": "p4_v4_en_10",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Substituting this into the Friedmann acceleration equation yields:"
              }
            }
          },
          {
            "id": "p4_v4_en_11",
            "versions": {
              "v4": {
                "ko": "",
                "en": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{\\mathrm{vib}}}{c^2} \\right) $$"
              }
            }
          },
          {
            "id": "p4_v4_en_12",
            "versions": {
              "v4": {
                "ko": "",
                "en": "As the universe expands and matter density dilutes, the total repulsive pressure emitted by the growing vacuum volume increases, driving an accelerated expansion ($\\ddot{a}>0$)."
              }
            }
          },
          {
            "id": "p4_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "이 장은 $\\Lambda$CDM 우주론 [3, 5]을 대체하여 암흑 물질과 암흑 에너지를 단일 공간 진동 텐서의 밀도 종속적 상전이로 해석한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "### 4.1. 카멜레온 메커니즘: 가변적 상태 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "동일한 텐서가 뭉침(인력)과 팽창(척력)이라는 상반된 성질을 띠는 모순을 해결하기 위해 카멜레온 장(Chameleon Field) 메커니즘을 차용한다. 공간 진동 텐서의 유효 상태 방정식 $w = p_{vib} / (\\rho_{vib} c^2)$는 주변 바리온 물질 밀도($\\rho_m$)에 동역학적으로 결합하여 연속적으로 전환된다 ($w \\equiv w(r, \\rho_m)$).",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_4",
            "versions": {
              "v5": {
                "ko": "### 4.2. 텐서 응축으로서의 암흑 물질 ($w \\approx 0$)",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_5",
            "versions": {
              "v5": {
                "ko": "가시적 질량 밀도가 희박해지는 은하 헤일로 영역에서는 '스케일 역전'에 의해 공간 진동이 역학적 주도권을 회복한다. 은하의 중력 소용돌이로 유입된 진동파들은 극한의 보강 간섭을 일으킨다. 물질 밀도가 존재하는 곳의 결합 함수에 의해 진동 유체의 운동 에너지 모드가 갇히게 되며, 상태 방정식은 먼지($w \\approx 0$)처럼 거동한다. 이렇게 폭증한 텐서 에너지 밀도를 **'텐서 응축'**이라 정의한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_6",
            "versions": {
              "v5": {
                "ko": "질량-에너지 등가원리에 의해 이 응축된 에너지는 '유효 질량'을 띠어 잉여 중력으로 창발한다 [4].",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_7",
            "versions": {
              "v5": {
                "ko": "$$ M_{eff}(r) = M_{visible}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\langle \\tilde{V}_{00}(r') \\rangle \\, 4\\pi r'^2 dr' $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_8",
            "versions": {
              "v5": {
                "ko": "따라서 암흑 물질은 미지의 입자가 아니라 은하 중력 우물 내에서 끓어오르는 극도로 응축된 공간 진동 에너지의 현상론적 재해석이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_9",
            "versions": {
              "v5": {
                "ko": "### 4.3. 진동 복사압으로서의 암흑 에너지 ($w \\approx -1$)",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_10",
            "versions": {
              "v5": {
                "ko": "반면, 물질이 전무한 거대 공동(Voids, $\\rho_m \\to 0$)에서는 카멜레온 결합이 해제되어 퍼텐셜 에너지 모드가 지배하게 되며 상태 방정식은 $w \\approx -1$로 전이된다. 억제되지 않은 공간의 내재적 기하학적 진동은 바깥으로 강력한 **'진동 복사압'**을 뿜어낸다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_11",
            "versions": {
              "v5": {
                "ko": "$$ p_{vib} \\approx -\\rho_{vib} c^2 $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_12",
            "versions": {
              "v5": {
                "ko": "이를 프리드만 가속도 방정식에 대입하면:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_13",
            "versions": {
              "v5": {
                "ko": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{vib}}{c^2} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_ko_14",
            "versions": {
              "v5": {
                "ko": "우주가 팽창하여 은하 간 물질 밀도가 묽어질수록 방출되는 진동 복사압의 총량이 기하급수적으로 폭증하여, 물질의 인력을 압도하는 완벽한 양성 피드백에 의한 가속 팽창($\\ddot{a}>0$)을 주도한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "This chapter explores an alternative to standard $\\Lambda$CDM cosmology [3, 5] by interpreting Dark Matter and Dark Energy as density-dependent phase transitions of $\\tilde{V}_{\\mu\\nu}$."
              }
            }
          },
          {
            "id": "p4_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.1. Chameleon Mechanism: Variable Equation of State"
              }
            }
          },
          {
            "id": "p4_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "To avoid an arbitrary transition of the tensor's properties, we adopt a dynamic analogous to the 'Chameleon Field' mechanism. The equation of state parameter $w = p_{vib} / (\\rho_{vib} c^2)$ of the vibration tensor dynamically couples to the ambient baryonic matter density ($\\rho_m$). The ratio of the tensor's kinetic to potential energy shifts continuously depending on the local gravitational environment: $w \\equiv w(r, \\rho_m)$."
              }
            }
          },
          {
            "id": "p4_v5_en_4",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.2. Dark Matter as Tensor Condensation ($w \\approx 0$)"
              }
            }
          },
          {
            "id": "p4_v5_en_5",
            "versions": {
              "v5": {
                "ko": "",
                "en": "In galactic halos, 'Scale Inversion' allows spatial vibration energy to regain dynamic relevance. Vibrational waves drawn into the galactic gravitational well undergo constructive interference. Due to the coupling near massive galaxies, the kinetic energy mode of the spatial fluid is trapped. This surge in energy density, defined as **'Tensor Condensation'**, behaves dynamically as pressureless dust ($w \\approx 0$). By mass-energy equivalence, this assumes an 'Effective Mass', creating surplus gravity [4]:"
              }
            }
          },
          {
            "id": "p4_v5_en_6",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ M_{eff}(r) = M_{visible}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\langle \\tilde{V}_{00} \\rangle \\, 4\\pi r'^2 dr' $$"
              }
            }
          },
          {
            "id": "p4_v5_en_7",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Dark matter is thus phenomenologically reinterpreted as the geometrical surplus gravity generated by condensed spatial vibration energy boiling within the galactic gravity well."
              }
            }
          },
          {
            "id": "p4_v5_en_8",
            "versions": {
              "v5": {
                "ko": "",
                "en": "### 4.3. Dark Energy as Vibrational Radiation Pressure ($w \\approx -1$)"
              }
            }
          },
          {
            "id": "p4_v5_en_9",
            "versions": {
              "v5": {
                "ko": "",
                "en": "In vast Cosmic Voids devoid of matter ($\\rho_m \\to 0$), the chameleon coupling releases the tensor tension. The potential energy mode dominates, shifting the equation of state to $w \\approx -1$. The intrinsic geometrical vibration of space fiercely radiates a powerful repulsive pressure outward:"
              }
            }
          },
          {
            "id": "p4_v5_en_10",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ p_{vib} \\approx -\\rho_{vib} c^2 $$"
              }
            }
          },
          {
            "id": "p4_v5_en_11",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Substituting this vibrational radiation pressure into the Friedmann acceleration equation yields:"
              }
            }
          },
          {
            "id": "p4_v5_en_12",
            "versions": {
              "v5": {
                "ko": "",
                "en": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{vib}}{c^2} \\right) $$"
              }
            }
          },
          {
            "id": "p4_v5_en_13",
            "versions": {
              "v5": {
                "ko": "",
                "en": "As the universe expands and matter density ($\\rho_m$) dilutes, the total **'Vibrational Radiation Pressure ($p_{vib}$)'** emitted by the exponentially growing vacuum volume increases. Overcoming the attractive force of matter, it drives a deterministic positive feedback loop of accelerated expansion ($\\ddot{a}>0$)."
              }
            }
          },
          {
            "id": "p4_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "이 장은 $\\Lambda$CDM 우주론을 대체하여 암흑 물질 [4]과 암흑 에너지를 단일 공간 진동 텐서의 밀도 종속적 상전이로 해석한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "### 4.1. 카멜레온 메커니즘: 가변적 상태 방정식",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "동일한 텐서가 뭉침(인력)과 팽창(척력)이라는 상반된 성질을 동시에 띠는 모순을 자연스럽게 해결하기 위해 카멜레온 장(Chameleon Field) 메커니즘 [5]을 차용한다. 공간 진동 텐서의 유효 상태 방정식 $w = p_{vib} / (\\rho_{vib} c^2)$는 주변 바리온 물질 밀도($\\rho_m$)에 동역학적으로 결합하여 연속적으로 전환된다. 현상론적 로지스틱 전이 함수를 제안한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_4",
            "versions": {
              "v6": {
                "ko": "$$ w(\\rho_m) \\approx -1 + \\frac{1}{1 + e^{-(\\rho_m - \\rho_{\\mathrm{crit}})/\\sigma}} $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_5",
            "versions": {
              "v6": {
                "ko": "물질 밀도가 임계치($\\rho_{\\mathrm{crit}}$)보다 낮아지면 텐서의 운동 에너지가 억제되고 퍼텐셜이 지배하여 암흑 에너지 상태($w \\to -1$)로 부드럽게 수렴한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_6",
            "versions": {
              "v6": {
                "ko": "### 4.2. 텐서 응축으로서의 암흑 물질 ($w \\approx 0$)",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_7",
            "versions": {
              "v6": {
                "ko": "가시적 질량 밀도가 희박한 은하 헤일로 영역에서는 '스케일 역전'에 의해 진동파들이 극한의 보강 간섭을 일으킨다. 높은 주변 물질 밀도로 인해 결합 함수에 의해 진동 유체의 운동 에너지 모드가 갇히게 되며 먼지($w \\approx 0$)처럼 거동하는 **'텐서 응축'**이 발생한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_8",
            "versions": {
              "v6": {
                "ko": "이는 질량-에너지 등가원리에 의해 잉여 중력으로 창발한다 [6]. 일반상대론적 정합성을 위해 불변 고유 부피 요소(Proper volume element) $\\sqrt{-g^{(3)}}$를 반영하여 정확한 유효 질량 공식을 구성한다:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_9",
            "versions": {
              "v6": {
                "ko": "$$ M_{\\mathrm{eff}}(r) = M_{\\mathrm{visible}}(r) + \\frac{1}{c^2} \\int_0^r \\langle \\tilde{V}_{00} \\rangle \\sqrt{-g^{(3)}} \\, d^3x $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_10",
            "versions": {
              "v6": {
                "ko": "따라서 암흑 물질은 미지의 입자가 아니라 은하 중력 우물 내에서 끓어오르는 극도로 응축된 공간 진동 에너지가 창출한 기하학적 잉여 중력이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_11",
            "versions": {
              "v6": {
                "ko": "### 4.3. 진동 복사압으로서의 암흑 에너지 ($w \\to -1$)",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_12",
            "versions": {
              "v6": {
                "ko": "물질이 전무한 거대 공동(Voids, $\\rho_m \\ll \\rho_{\\mathrm{crit}}$)에서는 카멜레온 결합이 해제되어 퍼텐셜 에너지 모드가 지배하며($w \\to -1$), 바깥으로 강력한 **'진동 복사압'**을 뿜어낸다 ($p_{vib} \\approx -\\rho_{vib} c^2$).",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_13",
            "versions": {
              "v6": {
                "ko": "이를 프리드만 가속도 방정식에 대입하면:",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_14",
            "versions": {
              "v6": {
                "ko": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{vib}}{c^2} \\right) $$",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_ko_15",
            "versions": {
              "v6": {
                "ko": "우주가 팽창하여 은하 간 물질 밀도가 묽어질수록 방출되는 진동 복사압의 총량이 기하급수적으로 폭증하여, 물질의 인력을 압도하는 완벽한 양성 피드백에 의한 가속 팽창($\\ddot{a}>0$) [7]을 주도한다.",
                "en": ""
              }
            }
          },
          {
            "id": "p4_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "This chapter explores an alternative to standard $\\Lambda$CDM cosmology [4] by interpreting Dark Matter and Dark Energy as density-dependent phase transitions of $\\tilde{V}_{\\mu\\nu}$."
              }
            }
          },
          {
            "id": "p4_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 4.1. Chameleon Mechanism: Variable Equation of State"
              }
            }
          },
          {
            "id": "p4_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "To avoid an arbitrary transition of the tensor's properties, we adopt a dynamic analogous to Chameleon Cosmology [5]. The equation of state parameter $w = p_{vib} / (\\rho_{vib} c^2)$ of the vibration tensor dynamically couples to the ambient baryonic matter density ($\\rho_m$). We propose a heuristic transition function governing this phase shift:"
              }
            }
          },
          {
            "id": "p4_v6_en_4",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ w(\\rho_m) \\approx -1 + \\frac{1}{1 + e^{-(\\rho_m - \\rho_{crit})/\\sigma}} $$"
              }
            }
          },
          {
            "id": "p4_v6_en_5",
            "versions": {
              "v6": {
                "ko": "",
                "en": "When the matter density drops below a critical threshold ($\\rho_{crit}$), the kinetic energy is suppressed, and potential tension dominates, smoothly converging the tensor fluid to a dark energy state ($w \\to -1$)."
              }
            }
          },
          {
            "id": "p4_v6_en_6",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 4.2. Dark Matter as Tensor Condensation ($w \\approx 0$)"
              }
            }
          },
          {
            "id": "p4_v6_en_7",
            "versions": {
              "v6": {
                "ko": "",
                "en": "In galactic halos ($\\rho_m > \\rho_{crit}$), kinetic modes are trapped ($w \\approx 0$). Fierce vibrational waves drawn into the gravity well undergo constructive interference, triggering **'Tensor Condensation'**. By mass-energy equivalence, this assumes an 'Effective Mass' [6]. To rigorously account for the curvature of spacetime, the effective surplus mass is calculated using the proper invariant volume element ($\\sqrt{-g^{(3)}}$):"
              }
            }
          },
          {
            "id": "p4_v6_en_8",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ M_{eff}(r) = M_{visible}(r) + \\frac{1}{c^2} \\int_{0}^{r} \\langle \\tilde{V}_{00} \\rangle \\sqrt{-g^{(3)}} \\, 4\\pi r'^2 dr' $$"
              }
            }
          },
          {
            "id": "p4_v6_en_9",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Dark matter is thus phenomenologically reinterpreted as the geometrical surplus gravity generated by condensed spatial vibration energy boiling within the galactic gravity well."
              }
            }
          },
          {
            "id": "p4_v6_en_10",
            "versions": {
              "v6": {
                "ko": "",
                "en": "### 4.3. Dark Energy as Vibrational Radiation Pressure ($w \\to -1$)"
              }
            }
          },
          {
            "id": "p4_v6_en_11",
            "versions": {
              "v6": {
                "ko": "",
                "en": "In vast Cosmic Voids ($\\rho_m \\ll \\rho_{crit}$), the chameleon coupling shifts to $w \\to -1$. The intrinsic geometrical vibration of space fiercely radiates a powerful repulsive pressure outward:"
              }
            }
          },
          {
            "id": "p4_v6_en_12",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ p_{vib} \\approx -\\rho_{vib} c^2 $$"
              }
            }
          },
          {
            "id": "p4_v6_en_13",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Substituting this into the Friedmann acceleration equation yields:"
              }
            }
          },
          {
            "id": "p4_v6_en_14",
            "versions": {
              "v6": {
                "ko": "",
                "en": "$$ \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3} \\left( \\rho_m + \\frac{3p_{vib}}{c^2} \\right) $$"
              }
            }
          },
          {
            "id": "p4_v6_en_15",
            "versions": {
              "v6": {
                "ko": "",
                "en": "As the universe expands and matter dilutes, the repulsive pressure emitted by the growing vacuum volume increases exponentially, driving a deterministic positive feedback loop of accelerated expansion ($\\ddot{a}>0$)."
              }
            }
          }
        ]
      },
      {
        "number": 5,
        "title": {
          "ko": "5. 결론",
          "en": "5. Conclusion"
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
          },
          {
            "id": "p5_v4_ko_1",
            "versions": {
              "v4": {
                "ko": "본 논문은 아인슈타인 장 방정식에 유효 공간 진동 텐서를 결합하여 암흑 물질과 암흑 에너지를 공간 기하학적 요동의 발현으로 통합하는 현상론적 재해석을 제공한다. 이러한 확장은 고도로 사변적인 상태로 남아 있다. 공간 진동 텐서의 타당성을 입증하기 위해서는 근본적인 상대론적 작용 원리로부터의 엄밀한 도출이 요구된다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_2",
            "versions": {
              "v4": {
                "ko": "**[향후 전망: 우주 공간 판구조론]**",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_ko_3",
            "versions": {
              "v4": {
                "ko": "팽창하는 우주가 완벽한 전역적 위상 결맞음을 유지할 수 없다고 가정할 때, 우주는 서로 다른 진동 위상을 가진 위상 도메인들로 파편화되었을 수 있다. 본 연작의 최종 논문에서는 이 도메인들의 거시적 경계(단층대)에서의 파동 마찰을 탐구하고, 우주 거미줄 형성 및 고속 전파 폭발(FRBs)과 같은 현상을 촉발하는 잠재적 역할을 조사할 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v4_en_1",
            "versions": {
              "v4": {
                "ko": "",
                "en": "This paper offers a unified phenomenological reinterpretation of Dark Matter and Dark Energy as manifestations of the geometrical fluctuation of space. These extensions remain highly speculative. A rigorous derivation from a fundamental relativistic action principle is required to establish the validity of the spatial vibration tensor and its interaction with standard model fields."
              }
            }
          },
          {
            "id": "p5_v4_en_2",
            "versions": {
              "v4": {
                "ko": "",
                "en": "**[Future Outlook: Spatial Plate Tectonics]**"
              }
            }
          },
          {
            "id": "p5_v4_en_3",
            "versions": {
              "v4": {
                "ko": "",
                "en": "Assuming the expanding universe cannot maintain perfect global phase coherence, it may have fragmented into topological domains with distinct vibrational phases. The final paper in this series will explore the wave friction at the macroscopic boundaries of these domains, investigating their potential role in forming the cosmic web and triggering phenomena such as Fast Radio Bursts (FRBs)."
              }
            }
          },
          {
            "id": "p5_v5_ko_1",
            "versions": {
              "v5": {
                "ko": "아인슈타인 장 방정식에 공간 진동 텐서를 결합하고 밀도에 종속되는 카멜레온 형태의 상전이를 도입함으로써, 본 논문은 에너지 보존과 등가원리를 완벽히 준수하면서 암흑 물질과 암흑 에너지를 단일 암흑 유체의 동역학적 현상으로 대통합하는 재해석을 제공하였다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_2",
            "versions": {
              "v5": {
                "ko": "**[향후 전망: 우주 공간 판구조론]**",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_ko_3",
            "versions": {
              "v5": {
                "ko": "팽창하는 우주가 완벽한 전역적 위상 결맞음을 유지할 수 없다고 가정할 때, 우주는 서로 다른 진동 위상을 가진 거대 **'위상 도메인'**들로 파편화되었을 수밖에 없다. 본 연작의 최종 논문(Part III)에서는 이 도메인들이 마찰하는 거시적 단층대(Fault Lines)의 역학을 탐구하고, 우주 거미줄로의 에너지 재분배 및 게르첸슈타인 효과에 의한 고속 전파 폭발(FRBs) 촉발 메커니즘을 조사할 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v5_en_1",
            "versions": {
              "v5": {
                "ko": "",
                "en": "By coupling the 'Spatial Vibration Tensor' with the Einstein field equations and introducing a chameleon-like dynamic equation of state, this paper provides a unified phenomenological reinterpretation of Dark Matter and Dark Energy without violating the equivalence principle or local energy conservation."
              }
            }
          },
          {
            "id": "p5_v5_en_2",
            "versions": {
              "v5": {
                "ko": "",
                "en": "**[Future Outlook: Cosmological Spatial Plate Tectonics]**"
              }
            }
          },
          {
            "id": "p5_v5_en_3",
            "versions": {
              "v5": {
                "ko": "",
                "en": "Assuming the expanding universe cannot maintain perfect global phase coherence, it must have inevitably fragmented into numerous giant **'Topological Domains'** possessing distinct intrinsic vibrational phases."
              }
            }
          },
          {
            "id": "p5_v5_en_4",
            "versions": {
              "v5": {
                "ko": "",
                "en": "The final sequel, **[Mechanics of Spatial Vibration III]**, will trace the wave friction at the macroscopic boundaries (Fault Lines) where these disconnected spatial domains collide. We will investigate their role in energy redistribution (forming the cosmic web) and trigger phenomena such as Fast Radio Bursts (FRBs) via gravitational-electromagnetic resonance."
              }
            }
          },
          {
            "id": "p5_v6_ko_1",
            "versions": {
              "v6": {
                "ko": "아인슈타인 장 방정식에 아이작슨 평균화된 공간 진동 텐서를 결합하고 밀도에 종속되는 카멜레온 형태의 상전이를 도입함으로써, 본 논문은 에너지 보존과 등가원리를 완벽히 준수하면서 암흑 물질과 암흑 에너지를 단일 암흑 유체의 동역학적 현상으로 대통합하는 재해석을 제공하였다. 파장 무관 광학적 번짐과 연대기적 착시의 예측은 본 모델을 사변적 가설에서 반증 가능한 우주론으로 격상시킨다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_2",
            "versions": {
              "v6": {
                "ko": "**[향후 전망: 우주 공간 판구조론]**",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_ko_3",
            "versions": {
              "v6": {
                "ko": "팽창하는 우주가 완벽한 전역적 위상 결맞음을 유지할 수 없다고 가정할 때, 우주는 서로 다른 진동 위상을 가진 거대 **'위상 도메인(Topological Domains)'**들로 파편화되었을 것이다. 본 연작의 최종 논문(Part III)에서는 도메인 월 관측 불일치를 방어하기 위한 초기 인플레이션 희석화 가설을 도입하고, 도메인들이 마찰하는 거시적 단층대(Fault Lines)의 역학을 탐구한다. 우주 거미줄로의 에너지 재분배 및 게르첸슈타인 효과에 의한 고속 전파 폭발(FRBs) 촉발 메커니즘을 조사할 것이다.",
                "en": ""
              }
            }
          },
          {
            "id": "p5_v6_en_1",
            "versions": {
              "v6": {
                "ko": "",
                "en": "By coupling the Spatial Vibration Tensor with the Einstein field equations via Isaacson averaging and introducing a chameleon-like dynamic equation of state, this paper provides a unified phenomenological reinterpretation of Dark Matter and Dark Energy without violating the equivalence principle or local energy conservation. The predictions of achromatic optical blurring and chronological illusions elevate this model to a testable cosmological framework."
              }
            }
          },
          {
            "id": "p5_v6_en_2",
            "versions": {
              "v6": {
                "ko": "",
                "en": "**[Future Outlook: Cosmological Spatial Plate Tectonics]**"
              }
            }
          },
          {
            "id": "p5_v6_en_3",
            "versions": {
              "v6": {
                "ko": "",
                "en": "Assuming the expanding universe cannot maintain perfect global phase coherence, it must have inevitably fragmented into giant **'Topological Domains'** possessing distinct intrinsic vibrational phases. The final sequel, **[Mechanics of Spatial Vibration III]**, will trace the wave friction at the macroscopic boundaries (Fault Lines) of these domains. To address the Domain Wall Problem, we will discuss the early dilution of these topological defects during inflation, and investigate how their ruptures trigger Fast Radio Bursts (FRBs) via gravitational-electromagnetic resonance (Gertsenshtein effect)."
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
      "ko": "KT 부장, 연세대학교 경영학 박사 수료, 코네티컷 대학교 법학 석사 (LL.M.)",
      "en": "KT Director, Ph.D. Candidate at Yonsei University, LL.M. at UCONN"
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
          "ko": "본 논문은 공간 진동 역학 3부작의 최종편으로, 우주 가속 팽창의 인과율적 한계(Causality Limit)로 인해 단일한 파동 동기화를 상실한 138억 광년 우주의 비균질성 문제를 해결한다. 본 연구는 광활한 우주가 고유의 진동 위상(Phase)을 가진 수많은 거대 '위상 도메인(Topological Domains)'들로 파편화되어 있다는 혁명적 가설인 **'우주 공간 판구조론(Cosmological Spatial Plate Tectonics)'**을 최초로 도입한다.\n거대 공간 판들이 맞닿고 마찰하는 공간 단층대(Spatial Fault Lines)에서의 파동 간섭 역학을 통해, 현대 우주론의 미해결 난제인 우주 거대 공동(Voids, 상쇄 간섭)과 은하 거미줄(Cosmic Web, 보강 간섭)의 기하학적 기원을 결정론적으로 규명한다. 나아가 공간 단층대에 누적된 위상 마찰 응력 텐서($S_{\\\\mu\\\\nu}$)가 시공간의 탄성 임계점을 초과하며 찢어지는 **'우주 지진(Cosmic Quake)'** 현상을 모델링하여 고속 전파 폭발(FRB)의 메커니즘을 규명한다. 이를 바탕으로 확률론적 배경 중력파(SGWB) 데이터를 역산하여 우주 단층 3D 지도를 그리고, 극한 우주 폭발 현상의 좌표를 선제적으로 예측하는 **POINTING(Predictive Observation of Intersecting Node Topology and Interference in Nominal Gravity)** 프로토콜을 제안하며 관측 천문학의 새로운 패러다임을 선언한다.",
          "en": "As the concluding part of the Spatial Vibration Mechanics Trilogy, this paper resolves the inhomogeneity of the 13.8-billion-year-old universe, which has lost unitary wave synchronization due to the causality limits of its accelerated expansion. This study introduces the revolutionary hypothesis of **'Cosmological Spatial Plate Tectonics'**, proposing that the vast universe is fragmented into numerous colossal 'Topological Domains' possessing distinct intrinsic vibrational phases.\nThrough the wave interference mechanics at the 'Spatial Fault Lines' where these massive spatial plates converge and exert friction, the geometrical origins of modern cosmology's unsolved mysteries—Cosmic Voids (destructive interference) and the Cosmic Web (constructive interference)—are deterministically elucidated. Furthermore, this study models the phenomenon of **'Cosmic Quakes'**, where topological friction stress tensors ($S_{\\\\mu\\\\nu}$) accumulated on these fault lines rupture by exceeding the elastic limit of spacetime, thereby deciphering the mechanism of Fast Radio Bursts (FRBs). By inversely calculating Stochastic Gravitational-Wave Background (SGWB) data, this paper maps the 3D topology of cosmic fault lines and proposes the **POINTING (Predictive Observation of Intersecting Node Topology and Interference in Nominal Gravity)** protocol, declaring a preemptive observational paradigm for cosmic extreme events."
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
