/**
 * 생활기록부에서 키워드를 자동 추출하는 유틸리티
 */

/**
 * 텍스트에서 핵심 키워드를 추출
 * @param {string} text - 분석할 텍스트
 * @returns {Array<{keyword: string, count: number, category: string}>}
 */
export const extractKeywords = (text) => {
  if (!text) return [];

  // 1. 전공/학문 관련 키워드
  const academicKeywords = [
    '철학', '정치', '외교', '법', '윤리', '정의', '도덕', '사상',
    '스페인어', '포르투갈어', '언어', '문화', '어문학',
    '지리', '경제', '사회', '역사', '정책', '제도'
  ];

  // 2. 철학자/사상가 키워드
  const philosopherKeywords = [
    '칸트', '벤담', '롤스', '하버마스', '듀이', '하이데거', '아렌트',
    '니체', '플라톤', '사르트르', '장자', '오컴', '아퀴나스', '아우구스티누스',
    '알랭 드 보통', '로크'
  ];

  // 3. 개념/이론 키워드
  const conceptKeywords = [
    '공리주의', '의무론', '정언명령', '담론윤리', '실존주의', '응보권',
    '악의 평범성', '실용주의', '이상주의', '민주주의', '자유의지',
    '사형제도', '정의론', '차등의 원칙', '배려윤리'
  ];

  // 4. 활동/주제 키워드
  const activityKeywords = [
    '한류', '외국인 노동자', '청소년 배심원', '학교폭력', '디지털 유산',
    '사적 제재', '구독경제', '청년실업', '숙의 민주제',
    '미세먼지', '환경', '기아 문제', '난민', '역사 왜곡',
    '카르스트 지형', '언더독 효과', '복수극'
  ];

  // 5. 활동 유형 키워드
  const typeKeywords = [
    '탐구', '발표', '토론', '독서', '봉사', '교육', '연구', '분석',
    '제안', '비평', '토의', '시연', '합창'
  ];

  const allKeywordCategories = [
    { keywords: academicKeywords, category: '전공/학문' },
    { keywords: philosopherKeywords, category: '철학자/사상가' },
    { keywords: conceptKeywords, category: '개념/이론' },
    { keywords: activityKeywords, category: '주제/이슈' },
    { keywords: typeKeywords, category: '활동유형' }
  ];

  const keywordCounts = {};

  // 키워드 추출
  allKeywordCategories.forEach(({ keywords, category }) => {
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      if (matches) {
        if (!keywordCounts[keyword]) {
          keywordCounts[keyword] = {
            keyword,
            count: 0,
            category
          };
        }
        keywordCounts[keyword].count += matches.length;
      }
    });
  });

  // 빈도순 정렬
  return Object.values(keywordCounts).sort((a, b) => b.count - a.count);
};

/**
 * 생활기록부 전체에서 키워드 추출
 */
export const extractAllKeywords = (studentRecord) => {
  if (!studentRecord || !studentRecord.recordByYear) return [];

  let allText = '';

  // 모든 학년의 텍스트를 합침
  Object.values(studentRecord.recordByYear).forEach(yearData => {
    ['자율활동', '동아리활동', '진로활동'].forEach(activityType => {
      if (yearData[activityType]?.내용) {
        allText += ' ' + yearData[activityType].내용;
      }
    });
  });

  return extractKeywords(allText);
};

/**
 * 활동별로 키워드 매핑
 */
export const mapKeywordsToActivities = (studentRecord) => {
  if (!studentRecord || !studentRecord.recordByYear) return [];

  const activities = [];
  let activityId = 0;

  Object.entries(studentRecord.recordByYear).forEach(([year, yearData]) => {
    ['자율활동', '동아리활동', '진로활동'].forEach(activityType => {
      if (yearData[activityType]?.내용) {
        const content = yearData[activityType].내용;
        const keywords = extractKeywords(content);

        // 활동을 문장 단위로 분리 (여러 활동이 합쳐진 경우)
        const sentences = content.split(/\n+/).filter(s => s.trim());

        sentences.forEach((sentence, idx) => {
          const sentenceKeywords = extractKeywords(sentence);

          if (sentenceKeywords.length > 0) {
            // 활동 제목 추출 (첫 문장의 주요 내용)
            const titleMatch = sentence.match(/^([^.!?]+[.!?])/);
            const title = titleMatch
              ? titleMatch[1].substring(0, 50) + (titleMatch[1].length > 50 ? '...' : '')
              : sentence.substring(0, 50) + '...';

            activities.push({
              id: `activity-${activityId++}`,
              year: year.replace('grade', '') + '학년',
              type: activityType,
              title,
              content: sentence,
              keywords: sentenceKeywords.slice(0, 5), // 상위 5개 키워드만
              allKeywords: sentenceKeywords
            });
          }
        });
      }
    });
  });

  return activities;
};

/**
 * 키워드 간 연결 관계 분석
 * 같은 활동에 등장하는 키워드들을 연결
 */
export const analyzeKeywordConnections = (activities) => {
  const connections = [];
  const connectionMap = new Map();

  activities.forEach(activity => {
    const keywords = activity.keywords || [];

    // 같은 활동 내의 키워드끼리 연결
    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const key1 = keywords[i].keyword;
        const key2 = keywords[j].keyword;
        const connectionKey = [key1, key2].sort().join('-');

        if (!connectionMap.has(connectionKey)) {
          connectionMap.set(connectionKey, {
            source: key1,
            target: key2,
            strength: 0,
            activities: []
          });
        }

        const connection = connectionMap.get(connectionKey);
        connection.strength++;
        connection.activities.push(activity.title);
      }
    }
  });

  return Array.from(connectionMap.values()).sort((a, b) => b.strength - a.strength);
};

/**
 * 키워드별 개념/쟁점/배경지식 데이터
 * Phase 2에서 사용
 */
export const keywordKnowledgeBase = {
  '칸트': {
    개념: '정언명령(categorical imperative)을 제시한 독일 철학자. 도덕적 행위는 결과가 아닌 의무에서 비롯되어야 한다고 주장',
    쟁점: 'AI가 칸트의 정언명령을 따르도록 프로그래밍할 수 있는가? 이것이 진정한 도덕성인가?',
    배경지식: '의무론적 윤리학, 자율성(autonomy)과 타율성(heteronomy), 정언명령 vs 가언명령'
  },
  '벤담': {
    개념: '공리주의(utilitarianism)의 창시자. "최대 다수의 최대 행복"을 도덕의 기준으로 제시',
    쟁점: '공리주의는 소수의 희생을 정당화할 수 있는가? (트롤리 딜레마)',
    배경지식: '공리 계산법, 쾌락과 고통의 측정, 결과주의 윤리학'
  },
  '롤스': {
    개념: '정의론(A Theory of Justice)을 통해 공정으로서의 정의를 제시. 차등의 원칙으로 불평등을 정당화',
    쟁점: '원초적 입장(original position)과 무지의 베일(veil of ignorance)은 실현 가능한가?',
    배경지식: '정의의 두 원칙, 최소 수혜자 우선, 사회 계약론'
  },
  '하버마스': {
    개념: '담론윤리학. 모든 이해당사자가 자유롭고 평등한 조건에서 대화를 통해 합의에 도달해야 함',
    쟁점: '완벽한 의사소통 상황은 현실에서 가능한가? 권력 관계는 어떻게 극복하나?',
    배경지식: '의사소통 행위 이론, 공론장(public sphere), 이상적 담화 상황'
  },
  '아렌트': {
    개념: '악의 평범성(banality of evil). 나치 전범 아이히만을 통해 악이 사유의 부��에서 비롯됨을 주장',
    쟁점: '명령에 복종한 것이 면죄부가 될 수 있는가? 사유하지 않는 것도 죄인가?',
    배경지식: '전체주의의 기원, 판단력, 정치적 행위'
  },
  '사형제도': {
    개념: '범죄자의 생명을 박탈하는 형벌. 응보적 정의 vs 인권의 충돌',
    쟁점: '국가가 생명을 박탈할 권리가 있는가? 억울한 처형 가능성은? 범죄 억제 효과가 있는가?',
    배경지식: '응보주의 vs 교정주의, 사법 살인 논쟁, 국제적 폐지 추세'
  },
  '사적 제재': {
    개념: '법적 절차를 거치지 않고 개인이나 집단이 직접 처벌하는 행위 (디지털 교도소, 복수극 등)',
    쟁점: '법이 정의를 실현하지 못할 때 사적 응징은 정당한가? 폭력의 정당성 기준은?',
    배경지식: '로크의 응보권, 법치주의, 자력구제 금지 원칙'
  },
  '민주주의': {
    개념: '국민이 주권을 가지고 스스로 다스리는 정치 체제',
    쟁점: '직접민주주의 vs 대의민주주의, 다수결의 폭력 문제, 포퓰리즘',
    배경지식: '듀이의 민주주의 교육론, 숙의 민주주의, 참여 민주주의'
  },
  '외국인 노동자': {
    개념: '노동력 부족을 해결하기 위해 유입되는 외국 국적 노동자',
    쟁점: '차등 임금제는 정당한가? 노동의 가치는 국적에 따라 달라지는가?',
    배경지식: '최저임금제도, 이주노동, 인권의 보편성'
  },
  '청소년 배심원': {
    개념: '청소년 관련 재판에 청소년을 배심원으로 참여시키는 제도',
    쟁점: '청소년의 판단력은 충분한가? 또래 심리가 공정성을 해칠 수 있는가?',
    배경지식: '배심원 제도, 소년법, 시민 참여'
  }
};

/**
 * 특정 키워드의 상세 정보 가져오기
 */
export const getKeywordDetails = (keyword) => {
  return keywordKnowledgeBase[keyword] || {
    개념: '추가 정보를 준비 중입니다.',
    쟁점: '면접에서 다룰 수 있는 쟁점을 정리해보세요.',
    배경지식: '관련 자료를 찾아 학습하세요.'
  };
};
