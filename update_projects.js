const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'shared/data/projects.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const novelProject = `,
  {
    id: 'quantum-vibration-novel',
    slug: 'quantum-vibration-novel',
    title: '텐서의 바다: 공간의 진동',
    subtitle: 'Interactive Hard SF Novel',
    category: 'Literature & Web Platform',
    year: '2026',
    status: 'active',
    path: '/novel/quantum-vibration-novel',
    executiveSummary: '물리학적 상상력과 소설이 결합된 하드 SF 소설 뷰어 플랫폼입니다. 독자가 실시간으로 단락의 버전을 수정하고 조합할 수 있는 양방향 독서 경험을 제공합니다.',
    metrics: [
      { label: 'Chapters', value: '4' },
      { label: 'Versions', value: 'v3.0' },
      { label: 'Features', value: 'Inline Edit & Diff' }
    ],
    overview: '이안과 세라가 우주의 근원인 텐서 유체의 비밀을 풀고 거대한 방주 오디세우스를 타고 탈출하는 하드 SF 서사시입니다. Next.js 기반의 커스텀 뷰어 플랫폼 위에서, 독자는 모든 단락의 과거 버전을 조회하고, 직접 내용을 수정하여 새로운 버전을 파생시키는 창작자(Architect)의 역할을 함께 수행합니다.',
    problemStatement: '기존의 정적 텍스트 기반 소설은 버전 업데이트나 대안적 서사를 동시에 탐구하기 어렵습니다. SF의 특성상 과학적 설명이나 묘사가 발전함에 따라 텍스트가 어떻게 다채로워지는지 직관적으로 확인할 플랫폼이 필요했습니다.',
    solution: '단락(Paragraph) 단위로 텍스트를 컴포넌트화하여, 인라인 퀵 에디터와 Diff Viewer를 통한 즉각적인 수정 및 대조를 지원합니다. 또한 KaTeX 렌더링 엔진을 탑재해 소설 내부의 물리학 수식을 아름답게 표현합니다.',
    technicalHighlights: [
      'Full Continuous Reader: 전체 단락 끊김 없는 양방향 렌더링',
      'Inline Quick Editor: 모달리스 기반의 즉각적 텍스트 수정 및 버전 관리',
      'Diff Viewer: 과거 버전과 현재 작성 중인 텍스트 간의 시각적 디프 대조',
      'React Markdown & KaTeX: 하드 SF 특화된 수학 공식 및 서식 렌더링'
    ],
    results: '총 1막~3막, 에필로그에 이르는 전체 데이터 세팅 및 v3.0 버전 스케일업 묘사가 완료되었으며, 완벽한 LaTeX 렌더러가 장착되었습니다.',
    tech: [
      'Next.js',
      'React',
      'TypeScript',
      'React Markdown',
      'KaTeX',
      'Tailwind CSS'
    ],
    features: [
      { title: '인라인 버전 에디팅', desc: '본문의 어떤 단락이든 클릭해 내용을 덮어쓰지 않고 새로운 버전 생성' },
      { title: '과거 버전 대조 (Diff)', desc: '이전 버전과 현재 작성 중인 텍스트의 변경점을 시각적으로 비교' },
      { title: '수식 렌더링', desc: 'KaTeX를 활용한 미려한 아인슈타인 방정식 및 카멜레온 메커니즘 수식 표현' },
      { title: '연속 읽기 모드', desc: '부드러운 스크롤 트래킹과 Sticky 네비게이션으로 끊김 없는 독서 경험 제공' }
    ]
  }
];`;

content = content.replace(/\n  \}\n\]/g, '\n  }' + novelProject);
fs.writeFileSync(targetPath, content);
console.log('Successfully added novel project to shared/data/projects.ts');
