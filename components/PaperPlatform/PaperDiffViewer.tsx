import React from 'react';

interface PaperDiffViewerProps {
  paragraphId: string;
  lang: 'ko' | 'en';
}

export const PaperDiffViewer: React.FC<PaperDiffViewerProps> = ({ paragraphId, lang }) => {
  // Manually calibrated high-quality academic diffs matching paperData
  const diffs: Record<string, { ko: React.ReactNode; en: React.ReactNode }> = {
    p1_1: {
      ko: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-400 line-through px-1 rounded block mb-2">
            {"- 양자역학의 발달 이래 이중 슬릿 실험은 물리적 대상의 본질을 의심케 하는 리트머스 시험지였다. 코펜하겐 해석은 관측 전 상태를 오직 파동함수라는 확률적 표현으로 매핑하며 대상의 구체적인 실재성(Physical Reality)을 부정한다. 그러나 이는 물리학이 추구해야 할 인과적 결정론과 실재관을 포기하는 한계를 가진다."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ 현대 양자역학의 근간을 이루는 코펜하겐 해석은 관측 전 상태를 확률론적 중첩 상태로 정의하며, 물리적 대상의 국소적 실재성(Physical Reality)을 부정하는 도구주의적 입장을 취한다 [1]. 그러나 이러한 확률론적 접근은 미시 세계를 지배하는 물리적 인과성(Causal Chain)의 원인을 명쾌히 기술하지 못한다. 본 연구에서는 기존 양자역학이 갖는 확률론적 한계를 비판하고, 수동적인 빈 무대(Passive Stage)로 취급받던 공간을 내재적 에너지를 가진 '기하학적으로 요동치는 동역학적 매질(Dynamical Geometrical Medium)'로 정의함으로써 새로운 패러다임을 제안한다 [2]."}
          </span>
        </span>
      ),
      en: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-400 line-through px-1 rounded block mb-2">
            {"- Since the inception of quantum mechanics, the double-slit experiment has stood as a litmus test challenging the essence of physical reality. The Copenhagen interpretation maps the pre-measurement state strictly onto a probabilistic wave function, negating physical reality. However, this abandons the causal determinism and objective reality that physics fundamentally pursues."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ The Copenhagen interpretation, which forms the cornerstone of modern quantum mechanics, defines the pre-measurement state as a probabilistic superposition, adopting an instrumentalist stance that denies local physical reality [1]. However, this probabilistic approach falls short of clarifying the underlying physical causes that govern the micro-world. In this study, we critique these probabilistic limitations and propose a paradigm shift: redefining space from a passive stage to an energetic, geometrically fluctuating dynamical medium [2]."}
          </span>
        </span>
      )
    },
    p2_1: {
      ko: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-400 line-through px-1 rounded block mb-2">
            {"- 우리는 공간이 조용하지 않으며 고유의 주파수로 진동하고 있다는 가설을 세운다. 이 진동이 바로 물질의 파동성을 유도하는 근원이다. 공간의 기하학적 파동은 입자의 본질적 성질이 아니며, 입자는 단지 진동하는 공간의 지형에 이끌릴 뿐이다. 이를 위해 5대 공리를 제안한다."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ 공간 진동 가설의 핵심은 입자의 파동성이 입자 자체의 성질이 아니라, 입자가 운동하는 '배경 공간'의 고유한 기하학적 요동의 결과라는 점이다. 이를 구체화하기 위해 다음과 같은 5대 핵심 공리(Axioms)를 선언한다: (1) 모든 미시 공간은 플랑크 스케일의 에너지를 지닌 기본 공간파로 요동친다. (2) 입자의 질량은 공간 요동파와 결합하는 감수성(Sensitivity) 계수를 결정한다. (3) 이중 슬릿은 공간 지형을 굴절시켜 정상파 형태의 간섭 등고선을 형성한다. (4) 입자는 스스로 파동을 발산하지 않으며, 외재적 공간 등고선에서 유도되는 척력을 받는다. (5) 파동 함수의 붕괴는 존재하지 않으며, 관측은 공간의 기하학적 요동을 역학적으로 감쇠시킬 뿐이다. 이로써 '실재하는 입자'와 입자의 궤적을 결정하는 '배경 공간의 진동'이 완벽하게 역학적으로 분리된다."}
          </span>
        </span>
      ),
      en: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-455 line-through px-1 rounded block mb-2">
            {"- We hypothesize that space is not silent, but vibrates at its own characteristic frequencies. This spatial vibration is the origin of wave properties in matter. The wave behavior is not intrinsic to the particle; instead, the particle is simply guided by the topology of fluctuating space. To formalize this, we present five core axioms."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ The core of the Spatial Vibration Hypothesis is that wave properties are not intrinsic to the particle itself, but stem from the geometric fluctuations of the background space in which it travels. To specify this, we declare five core axioms: (1) All micro-space oscillates with fundamental spatial waves carrying Planck-scale energy. (2) The mass of a particle determines its coupling sensitivity coefficient with these spatial waves. (3) The double slits refract the spatial topography, creating standing wave-like interference contours. (4) Particles do not emit waves themselves; they experience a repulsive force guided by extrinsic spatial contours. (5) There is no wave function collapse; observation mechanically dampens spatial vibrations. This achieves a complete mechanical separation between the 'physical particle' and the 'background spatial vibrations'."}
          </span>
        </span>
      )
    },
    p3_1: {
      ko: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-400 line-through px-1 rounded block mb-2">
            {"- 슈뢰딩거 방정식은 파동함수의 극좌표 형식인 마델룽(Madelung) 변환을 거치면 역학적 형태로 유도될 수 있다. 여기서 얻어지는 양자 퍼텐셜을 우리는 공간 진동 퍼텐셜 $Q_s$로 정식화한다. 이 퍼텐셜은 공간의 기하학적 곡률에 비례한다: $Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$. 이 퍼텐셜이 가지는 힘에 의해 입자가 이끄는 궤적이 정의된다."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ 수학적 정식화를 위해 복소수 파동 함수 $\\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar}$를 슈뢰딩거 방정식에 대입하여 실수부와 허수부로 분리한다(Madelung 분해) [3]. 이 과정에서 수정된 해밀턴-야코비 방정식이 다음과 같이 도출된다: ∂S/∂t + (∇S)²/(2m) + V + Qs = 0. 여기서 공간 진동 퍼텐셜 $Q_s$는 공간의 기하학적 곡률에 의해 정식화된다: Qs(r) = -(ħ²/2m) ∇²R(r)/R(r). 기존 데이비드 봄의 양자 퍼텐셜 해석과 달리, 본 가설은 $Q_s$를 입자가 지닌 잠재적 장이 아닌, '공간의 뒤틀림과 요동 진폭($R$)'에 의해 생성된 공간 자체의 탄성 에너지 경사로 규정한다 [4]. 이 퍼텐셜 필드에 놓인 질량 $m$의 입자는 힘 $\\mathbf{F}_{space} = -\\nabla Q_s$를 받아 실재론적으로 운동한다."}
          </span>
        </span>
      ),
      en: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-455 line-through px-1 rounded block mb-2">
            {"- The Schrödinger equation can be rewritten in a fluid dynamical form using Madelung's polar conversion. The resulting quantum potential is formalized as our spatial vibration potential $Q_s$. This potential is proportional to the geometric curvature of space: $Q_s = -\\frac{\\hbar^2}{2m} \\frac{\\nabla^2 R}{R}$. The forces derived from this potential govern the trajectories of the particles."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ For a rigorous mathematical formulation, we substitute the polar wave function $\\psi(\\mathbf{r}, t) = R(\\mathbf{r}, t) e^{iS(\\mathbf{r}, t)/\\hbar}$ into the Schrödinger equation and split it into real and imaginary components (Madelung decomposition) [3]. This yields the modified Hamilton-Jacobi equation: ∂S/∂t + (∇S)²/(2m) + V + Qs = 0. Here, the spatial vibration potential $Q_s$ is formalized via the spatial curvature: Qs(r) = -(ħ²/2m) ∇²R(r)/R(r). Unlike David Bohm's quantum potential interpretation, our hypothesis frames $Q_s$ not as a field emitted by the particle, but as the elastic energy gradient of space itself generated by spatial warping and vibration amplitude ($R$) [4]. A particle of mass $m$ placed in this potential moves deterministically under the force $\\mathbf{F}_{space} = -\\nabla Q_s$."}
          </span>
        </span>
      )
    },
    p4_1: {
      ko: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-400 line-through px-1 rounded block mb-2">
            {"- 입자가 두 슬릿 중 하나를 통과할 때, 공간 진동은 두 슬릿 모두에서 전파된다. 이 두 전파가 만나 간섭 등고선을 만들고 입자는 이 등고선을 지나면서 한 방향으로 굴절된다. 이것이 바로 간섭 무늬의 기하학적 유도 과정이다."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ 이중 슬릿 장치에서 입자는 단 하나의 슬릿만을 통과하지만, 공간 진동파는 두 슬릿 모두를 통과하여 슬릿 후방 영역에 일정한 간섭 지형도(산맥과 골짜기 형태의 $Q_s$ 지형)를 구축한다. 슬릿을 나선 입자는 $Q_s$가 생성하는 공간 척력($-\\nabla Q_s$)에 의해 골짜기 경로(안정 궤적)로 유도되며 꺾이게 된다. 즉, 스크린 상에 수집된 간섭 분포($|\\psi|^2$)는 상태의 붕괴나 확률 파동이 아닌, 입자의 초기 발사각과 입사 위치의 극도로 미세한 차이가 복합적인 요동 등고선을 타고 흐르며 누적된 '결정론적 통계 앙상블(Deterministic Statistical Ensemble)'이다 [5]."}
          </span>
        </span>
      ),
      en: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-455 line-through px-1 rounded block mb-2">
            {"- When a particle passes through one of the slits, spatial vibrations propagate through both. These vibrations interfere, constructing contours that deflect the particle along specific paths. This is the geometric process that yields the interference pattern."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ In a double-slit setup, the particle passes through only one slit, but the spatial vibration waves propagate through both, constructing a standing interference topography (peaks and valleys of $Q_s$) behind the slits. Emerging particles are pushed away from peaks by the repulsive force ($-\\nabla Q_s$) and settle into the valleys (stable trajectories). Thus, the interference pattern ($|\\psi|^2$) collected on the screen is not the result of wave collapse, but rather a deterministic statistical ensemble built from microscopic variations in initial launch conditions guided along these contours [5]."}
          </span>
        </span>
      )
    },
    p5_1: {
      ko: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-400 line-through px-1 rounded block mb-2">
            {"- 관측 행위는 입자에 강한 에너지를 가하게 된다. 이 외부 에너지는 예민한 공간의 미시적 진동을 무너트린다. 결과적으로 공간 진동에 의한 유도력이 사라지게 되어 입자는 똑바로 나아가고, 이 때문에 간섭 무늬가 사라지는 것이다."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ 관측 장비가 미시적 물리계에 결맞음 측정을 시도할 때, 검출 장치는 불가피하게 거시적 섭동 에너지($E_{obs}$)를 방출한다. 이 에너지는 입자가 아닌, 입자를 감싸는 배경 공간의 미세 진동 매질에 섭동을 가한다. 결맞음 파괴 인자 $\\gamma(E_{obs})$에 따라 공간 퍼텐셜의 왜곡 및 감쇠 계수를 수식화할 수 있다: Qs(r, t) → Qs(r, 0) · e^-γ(Eobs)t. 섭동 에너지가 플랑크 임계 수준을 크게 초과할 때($E_{obs} \\gg E_p$), 공간 요동은 소실되며 평평한 공간 복원 척력에 수렴한다. 따라서 입자는 어떠한 굴절력($-\\nabla Q_s \\approx 0$)도 받지 못해 뉴턴식 직선 운동을 재개하며, 이는 관측에 의한 파동성의 기계적 소실 메커니즘을 명백하게 입증한다."}
          </span>
        </span>
      ),
      en: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-455 line-through px-1 rounded block mb-2">
            {"- The act of measurement imparts a strong energy onto the particle. This external energy collapses the sensitive spatial vibrations. Consequently, the guiding force vanishes, causing the particle to move linearly and destroying the interference pattern."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ When detector equipment attempts to measure the micro-system, it inevitably emits a macroscopic perturbation energy ($E_{obs}$). This energy perturbs the delicate spatial vibration medium surrounding the particle. The attenuation of the spatial potential is modeled using the decoherence factor $\\gamma(E_{obs})$: Qs(r, t) → Qs(r, 0) · e^-γ(Eobs)t. When the perturbation energy vastly exceeds the Planck threshold ($E_{obs} \\gg E_p$), spatial fluctuations collapse, flattening out the active topography. Consequently, the particle experiences no lateral force ($-\\nabla Q_s \\approx 0$), resuming a linear Newtonian trajectory. This explains the physical mechanism of wave-collapse under measurement."}
          </span>
        </span>
      )
    },
    p6_1: {
      ko: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-400 line-through px-1 rounded block mb-2">
            {"- 왜 거시 물체는 이 공간 진동의 영향을 받지 않는가? 그것은 거시 물체의 질량이 너무 무겁기 때문이다. 질량이 무거울수록 공간의 힘은 약해진다. 공식적으로 질량이 무한대에 가까워지면 공간 유도력은 0이 되어 완벽한 뉴턴 역학으로 돌아간다."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ 우리가 거시 세계에서 공간 진동 효과를 목격하지 못하는 원인은 '질량 관성적 압도'에 기인한다. 공간 진동 가설의 운동 방정식에 따르면, 공간 진동 유도력 $\\mathbf{F}_{space}$는 입자의 질량 $m$에 반비례한다: a = Fext/m - ∇Qs/m. 따라서 질량에 극단적인 상한을 가할 시, 공간력의 가속도 성분은 아래와 같이 소실된다: lim(m→∞) ∇Qs/m = 0. 결과적으로, 거대 질량체가 결합한 고전적 고체 물질은 공간 진동 등고선이 가하는 척력을 무시하며 뉴턴 역학의 결정론적 관성 궤적으로 정확히 수렴하게 됨을 수학적으로 규명할 수 있다."}
          </span>
        </span>
      ),
      en: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-455 line-through px-1 rounded block mb-2">
            {"- Why do macroscopic objects remain unaffected by these spatial fluctuations? It is because macroscopic masses are too heavy. As mass increases, the spatial guiding force decreases. Mathematically, as mass approaches infinity, the spatial force approaches zero, reverting back to classical Newtonian mechanics."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ The reason we do not observe spatial vibration effects in the macroscopic domain is due to 'inertial domination'. According to the equation of motion derived from the Spatial Vibration Hypothesis, the acceleration component due to spatial forces is inversely proportional to the mass $m$: a = Fext/m - ∇Qs/m. Taking the limit as the mass approaches macroscopic scales yields: lim(m→∞) ∇Qs/m = 0. Consequently, macroscopic solid bodies bound by large masses override the spatial vibrational gradients and converge precisely onto the inertial trajectories governed by classical Newtonian mechanics."}
          </span>
        </span>
      )
    },
    p7_1: {
      ko: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-400 line-through px-1 rounded block mb-2">
            {"- 이처럼 공간 진동 역학은 양자 세계와 고전 세계를 하나의 질량 변수를 통해 통합적으로 엮어낸다. 또한 마지막으로 우리는 스케일 대칭성을 제안한다. 만일 질량이 더 크지만 공간의 크기도 훨씬 더 거대해진다면, 어쩌면 우주적 규모에서 다시 공간 진동이 천체의 궤적을 굴절시킬지도 모른다."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ 본 논문은 질량 변수 $m$의 단순한 연속적 조절을 통하여 단절되었던 양자 역학과 고전 고전 뉴턴 역학을 동일한 기하학적 뼈대 위에 단일 프레임워크로 통합하였다. 이에 덧붙여, 공간 요동파가 지닌 **'프랙탈적 스케일 대칭성(Fractal Scale Symmetry)'**을 새로운 패러다임으로 제시한다. 비록 단일 천체의 질량은 거대하지만, 우주적 스케일로 공간 영역이 확장되어 배경 공간의 방대한 체적이 지닌 탄성 에너지와 맞물릴 경우, 관성 질량을 역학적으로 압도하는 '스케일 역전'이 일어날 수 있다. 이는 차후 은하 회전 곡선 문제나 우주 팽창을 물질의 가상 암흑 에너지 대신 공간 요동의 고차원 대규모 조화 진동으로 극복해 낼 수 있는 결정적인 복선이 된다."}
          </span>
        </span>
      ),
      en: (
        <span className="leading-relaxed">
          <span className="bg-red-500/10 text-red-455 line-through px-1 rounded block mb-2">
            {"- Thus, spatial vibration mechanics bridges the quantum and classical worlds through a single mass variable. Lastly, we propose a scale symmetry. If the mass is larger but the scale of space is also cosmic, perhaps spatial vibrations could once again guide celestial trajectories."}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded block">
            {"+ This work unifies quantum mechanics and classical Newtonian physics under a single geometric framework through the continuous scaling of the mass variable $m$. Additionally, we introduce the concept of 'Fractal Scale Symmetry'. While a single celestial body exhibits massive inertia, when scaled up to cosmic volumes, the cumulative spatial volume and its associated elastic energy can trigger a 'scale inversion' that overrides massive inertia. This paves the way for explaining galactic rotation curves and cosmic expansion via high-dimensional cosmic spatial harmonic vibrations rather than resorting to hypothetical dark matter or dark energy."}
          </span>
        </span>
      )
    }
  };

  const currentDiff = diffs[paragraphId];

  if (!currentDiff) return null;

  return (
    <div className="my-2 border border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-zinc-950 p-4 font-serif text-sm">
      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-3 pb-1.5 border-b border-zinc-900">
        <span>📄 Git-style Revision Diff (v1.0.0 → v2.0.0)</span>
        <span className="text-emerald-500">+Insertions</span>
      </div>
      <div>
        {lang === 'ko' ? currentDiff.ko : currentDiff.en}
      </div>
    </div>
  );
};
