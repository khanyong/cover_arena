// 샘플 생활기록부 데이터
export const sampleStudentRecord = {
  studentInfo: {
    name: "유아인",
    school: "대일외국어고등학교",
    currentGrade: 3,
    targetMajor: "철학"
  },

  records: [
    // 1학년
    {
      year: 1,
      category: "자율활동",
      activities: [
        {
          id: "a1-1",
          title: "학급 도서부장",
          description: "학급 도서 관리 및 독서 토론회 기획. 월 1회 독서 토론회를 주도하여 학급 독서 문화 활성화에 기여함.",
          period: "2024.03 - 2025.02",
          keywords: ["리더십", "독서", "기획력"],
          relatedSubjects: ["국어", "사회"]
        },
        {
          id: "a1-2",
          title: "환경보호 캠페인",
          description: "교내 플라스틱 제로 캠페인 참여. 일회용품 사용 줄이기 홍보물 제작 및 배포.",
          period: "2024.05 - 2024.06",
          keywords: ["환경", "사회참여", "창의성"],
          relatedSubjects: ["과학", "사회"]
        }
      ]
    },
    {
      year: 1,
      category: "동아리활동",
      activities: [
        {
          id: "c1-1",
          title: "코딩동아리 'Algorithm Club'",
          description: "Python 기초부터 자료구조 알고리즘까지 학습. 백준 온라인 저지에서 100문제 이상 해결. 동아리 내 알고리즘 스터디 그룹 운영.",
          period: "2024.03 - 2025.02",
          keywords: ["프로그래밍", "문제해결", "협업"],
          relatedSubjects: ["정보", "수학"],
          achievements: ["백준 실버 티어 달성", "동아리 내 스터디 리더"]
        }
      ]
    },
    {
      year: 1,
      category: "진로활동",
      activities: [
        {
          id: "p1-1",
          title: "IT 진로탐색",
          description: "소프트웨어 개발자 직업 조사 및 발표. 현직 개발자 인터뷰를 통해 직업의 실제를 탐색하고 필요한 역량 파악.",
          period: "2024.09 - 2024.10",
          keywords: ["진로탐색", "소프트웨어", "직업이해"],
          relatedSubjects: ["정보", "진로"]
        }
      ]
    },
    {
      year: 1,
      category: "전공관련교과",
      subjects: [
        {
          id: "s1-1",
          name: "정보",
          grade: "A",
          highlights: "Python 프로그래밍 우수. 프로젝트 과제에서 간단한 게임 제작하여 A+ 평가.",
          projects: ["Snake Game 제작", "계산기 프로그램"]
        },
        {
          id: "s1-2",
          name: "수학",
          grade: "A",
          highlights: "수학적 사고력 우수. 특히 확률과 통계 단원에서 뛰어난 이해도 보임.",
          projects: []
        }
      ]
    },
    {
      year: 1,
      category: "그외교과",
      subjects: [
        {
          id: "o1-1",
          name: "영어",
          grade: "B+",
          highlights: "영어 독해 능력 양호. 영어 에세이 작성 능력 향상 필요."
        },
        {
          id: "o1-2",
          name: "과학",
          grade: "A",
          highlights: "물리 실험 활동에 적극적으로 참여. 과학적 탐구 능력 우수."
        }
      ]
    },
    {
      year: 1,
      category: "행동특성",
      traits: [
        "성실하고 책임감이 강함",
        "모둠 활동에서 협력적인 태도를 보임",
        "새로운 기술에 대한 호기심이 많고 학습 의욕이 높음",
        "친구들과의 관계가 원만하며 긍정적인 학급 분위기 조성에 기여"
      ]
    },

    // 2학년
    {
      year: 2,
      category: "자율활동",
      activities: [
        {
          id: "a2-1",
          title: "학급 학술부장",
          description: "학급 내 학술 분위기 조성. 또래 튜터링 프로그램 기획 및 운영.",
          period: "2025.03 - 2026.02",
          keywords: ["리더십", "교육", "나눔"],
          relatedSubjects: ["수학", "정보"]
        },
        {
          id: "a2-2",
          title: "교내 SW 페스티벌 기획위원",
          description: "교내 소프트웨어 축제 기획 및 운영 참여. 학생 작품 전시회 코너 담당.",
          period: "2025.10 - 2025.11",
          keywords: ["기획력", "SW", "행사운영"],
          relatedSubjects: ["정보"]
        }
      ]
    },
    {
      year: 2,
      category: "동아리활동",
      activities: [
        {
          id: "c2-1",
          title: "코딩동아리 'Algorithm Club' 부장",
          description: "동아리 부장으로서 연간 활동 기획 및 운영. ICPC 대회 준비반 운영. 1학년 후배들을 위한 멘토링 프로그램 진행.",
          period: "2025.03 - 2026.02",
          keywords: ["리더십", "알고리즘", "멘토링"],
          relatedSubjects: ["정보", "수학"],
          achievements: ["교내 알고리즘 대회 3위", "ICPC 인터넷 예선 진출"]
        },
        {
          id: "c2-2",
          title: "AI 연구동아리 'Deep Learners'",
          description: "머신러닝 기초 이론 학습 및 실습. TensorFlow를 활용한 간단한 이미지 분류 프로젝트 수행.",
          period: "2025.03 - 2026.02",
          keywords: ["AI", "머신러닝", "프로젝트"],
          relatedSubjects: ["정보", "수학"],
          achievements: ["손글씨 숫자 인식 모델 제작"]
        }
      ]
    },
    {
      year: 2,
      category: "진로활동",
      activities: [
        {
          id: "p2-1",
          title: "대학 연구실 탐방",
          description: "서울대학교 컴퓨터공학부 연구실 방문. AI 연구실에서 최신 연구 동향 청취 및 질의응답.",
          period: "2025.07",
          keywords: ["진로탐색", "AI", "대학연구"],
          relatedSubjects: ["정보"]
        },
        {
          id: "p2-2",
          title: "SW 마이스터 특강",
          description: "현직 개발자 특강 참여. 실무에서의 개발 프로세스와 필요 역량에 대해 학습.",
          period: "2025.09",
          keywords: ["진로", "소프트웨어", "실무"],
          relatedSubjects: ["정보", "진로"]
        }
      ]
    },
    {
      year: 2,
      category: "전공관련교과",
      subjects: [
        {
          id: "s2-1",
          name: "정보과학",
          grade: "A+",
          highlights: "자료구조와 알고리즘 심화 학습. 개인 프로젝트로 웹 크롤러 제작.",
          projects: ["뉴스 크롤러 및 키워드 분석 프로그램", "자료구조 시각화 웹앱"]
        },
        {
          id: "s2-2",
          name: "수학II",
          grade: "A",
          highlights: "미적분 개념을 알고리즘 최적화에 적용. 수학과 프로그래밍의 연계성 이해.",
          projects: []
        },
        {
          id: "s2-3",
          name: "확률과 통계",
          grade: "A+",
          highlights: "통계적 데이터 분석 능력 우수. 머신러닝의 기초가 되는 확률 개념 깊이 이해.",
          projects: ["데이터 분석 프로젝트"]
        }
      ]
    },
    {
      year: 2,
      category: "그외교과",
      subjects: [
        {
          id: "o2-1",
          name: "영어II",
          grade: "A",
          highlights: "영어 논문 읽기 시작. IT 관련 영어 문서 독해 능력 향상."
        },
        {
          id: "o2-2",
          name: "물리학I",
          grade: "A",
          highlights: "물리 시뮬레이션 프로그램 제작. 과학과 프로그래밍의 융합 시도."
        }
      ]
    },
    {
      year: 2,
      category: "행동특성",
      traits: [
        "목표 지향적이며 자기주도적 학습 능력이 뛰어남",
        "동아리 부장으로서 책임감 있게 조직을 이끌었음",
        "후배 멘토링에 적극적이며 지식 나눔을 즐김",
        "어려운 문제에 직면해도 포기하지 않는 끈기를 보임",
        "새로운 기술 트렌드에 관심이 많고 스스로 학습함"
      ]
    },

    // 3학년
    {
      year: 3,
      category: "자율활동",
      activities: [
        {
          id: "a3-1",
          title: "학생회 IT지원부",
          description: "학생회 홈페이지 개발 및 유지보수. 온라인 투표 시스템 구축.",
          period: "2026.03 - 현재",
          keywords: ["웹개발", "시스템구축", "봉사"],
          relatedSubjects: ["정보"]
        }
      ]
    },
    {
      year: 3,
      category: "동아리활동",
      activities: [
        {
          id: "c3-1",
          title: "교내 SW 개발 프로젝트팀",
          description: "팀 프로젝트로 학교 급식 메뉴 추천 앱 개발. 팀장으로서 프로젝트 관리 및 개발 주도.",
          period: "2026.03 - 2026.08",
          keywords: ["프로젝트관리", "앱개발", "팀워크"],
          relatedSubjects: ["정보"],
          achievements: ["교내 SW 경진대회 금상"]
        }
      ]
    },
    {
      year: 3,
      category: "진로활동",
      activities: [
        {
          id: "p3-1",
          title: "AI 해커톤 참가",
          description: "서울 AI 해커톤 참가. 자연어 처리를 활용한 챗봇 개발팀에서 활동.",
          period: "2026.05",
          keywords: ["AI", "해커톤", "NLP"],
          relatedSubjects: ["정보"],
          achievements: ["장려상 수상"]
        }
      ]
    },
    {
      year: 3,
      category: "전공관련교과",
      subjects: [
        {
          id: "s3-1",
          name: "인공지능 기초",
          grade: "A+",
          highlights: "딥러닝 모델 학습 및 평가. 개인 프로젝트로 감성 분석 모델 구현.",
          projects: ["영화 리뷰 감성 분석 시스템"]
        },
        {
          id: "s3-2",
          name: "자료구조와 알고리즘",
          grade: "A+",
          highlights: "고급 알고리즘 이해 및 구현. 최적화 문제 해결 능력 우수.",
          projects: ["경로 최적화 알고리즘 구현"]
        }
      ]
    },
    {
      year: 3,
      category: "그외교과",
      subjects: [
        {
          id: "o3-1",
          name: "영어 독해와 작문",
          grade: "A",
          highlights: "영어 기술 문서 작성 능력 향상. GitHub 프로젝트 README 영문 작성."
        }
      ]
    },
    {
      year: 3,
      category: "행동특성",
      traits: [
        "3년간 꾸준히 성장하는 모습을 보임",
        "리더십과 협업 능력이 조화롭게 발달함",
        "전공에 대한 열정이 뚜렷하며 진로 목표가 명확함",
        "실패를 통해 배우는 성장 마인드셋을 가짐",
        "기술적 역량뿐만 아니라 문제 정의 능력도 뛰어남"
      ]
    }
  ],

  // 특기사항
  specialNotes: [
    "3년간 지속적인 프로그래밍 학습 및 프로젝트 수행",
    "알고리즘, AI, 웹개발 등 다양한 분야의 SW 경험 보유",
    "리더십과 멘토링 경험 풍부",
    "이론과 실습의 균형잡힌 학습",
    "명확한 진로 목표와 그에 맞는 체계적 준비"
  ]
};

// 생활기록부 카테고리 정의
export const recordCategories = [
  { id: "자율활동", name: "자율활동", color: "#3b82f6" },
  { id: "동아리활동", name: "동아리활동", color: "#8b5cf6" },
  { id: "진로활동", name: "진로활동", color: "#ec4899" },
  { id: "전공관련교과", name: "전공관련 교과", color: "#10b981" },
  { id: "그외교과", name: "그 외 교과", color: "#f59e0b" },
  { id: "행동특성", name: "행동특성 및 종합의견", color: "#6366f1" }
];

// 학년 정의
export const grades = [
  { id: 1, name: "1학년" },
  { id: 2, name: "2학년" },
  { id: 3, name: "3학년" }
];
