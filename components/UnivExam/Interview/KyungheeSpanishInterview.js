import React, { useState, useEffect } from 'react';
import {
  getUserQuestion,
  getUserAnswer,
  saveUserQuestion,
  saveUserAnswer,
  getAnyQuestionByQuestionId,
  getAnyAnswerByQuestionId,
  getLatestAnswersByQuestionId,
  getAllQuestionsByIds,
  getAllAnswersByIds
} from '../../../lib/interviewService';

/**
 * 경희대학교 스페인어학과 면접 준비 컴포넌트
 * 경희대 스페인어학과 특화 예상 질문과 모범 답변
 */
const KyungheeSpanishInterview = ({ completionStatus = {}, toggleCompletion, user }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showDepartmentInfo, setShowDepartmentInfo] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [userCustomizations, setUserCustomizations] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // 경희대학교 스페인어학과 면접 질문 데이터
  const kyungheeInterviewQuestions = [
    // 학과정보
    {
      id: 'kyunghee-spanish-1',
      category: '학과정보',
      question: '스페인어·중남미 문화를 중점적으로 배우는 학과',
      answer: '경희대학교 스페인어학과는 언어·문화·문학·사회를 중점적으로 배우는 학과입니다. 단순히 스페인어를 배우는 것을 넘어, 스페인과 중남미 지역의 풍부한 문화적 배경과 역사, 사회적 맥락을 함께 이해하는 것을 목표로 합니다. 저는 이러한 통합적 접근 방식이 진정한 언어 전문가가 되는 데 필수적이라고 생각하며, 경희대의 교육 철학에 깊이 공감합니다.',
      keywords: ['언어', '문화', '문학', '사회', '중남미']
    },
    {
      id: 'kyunghee-spanish-2',
      category: '학과정보',
      question: '다문화 인어 교과와 아니라 스페인어와 권력가 융합의 목적',
      answer: '스페인어는 전 세계 20개 이상의 국가에서 공용어로 사용되며, 약 5억 명 이상이 사용하는 세계적인 언어입니다. 경희대 스페인어학과는 단순한 언어 교육을 넘어, 스페인어권 국가들의 다양한 문화와 사회를 이해하고, 이를 통해 글로벌 시대에 필요한 융합적 사고력을 기르는 것을 목표로 합니다. 저는 이러한 융합 교육을 통해 언어와 문화를 매개로 세계와 소통하는 인재가 되고자 합니다.',
      keywords: ['스페인어권', '융합', '글로벌', '문화이해', '소통']
    },
    {
      id: 'kyunghee-spanish-3',
      category: '학과정보',
      question: '경희대학교에서 특성화하여 특성 있는 언어·지역 교육가 강화 경쟁',
      answer: '경희대학교는 언어와 지역을 통합적으로 교육하는 특성화된 프로그램을 운영하고 있습니다. 스페인어학과는 언어 능력 향상뿐만 아니라, 스페인과 중남미 지역의 정치, 경제, 사회, 문화를 심층적으로 학습할 수 있는 커리큘럼을 제공합니다. 이러한 지역 전문가 양성 프로그램은 단순한 언어 구사를 넘어, 해당 지역의 전문가로 성장할 수 있는 기반을 마련해줍니다.',
      keywords: ['특성화', '지역전문가', '통합교육', '경쟁력', '전문성']
    },
    {
      id: 'kyunghee-spanish-4',
      category: '학과정보',
      question: '경희대학교에서 프로그램을 통한 실무적 성장가 외국가 강화 학습',
      answer: '경희대학교는 교환학생 프로그램, 현장실습, 인턴십 등 다양한 실무 중심 프로그램을 제공합니다. 특히 스페인과 중남미 지역의 협력 대학들과의 교류를 통해 현지에서 직접 언어와 문화를 체험할 수 있는 기회가 풍부합니다. 저는 이러한 프로그램을 적극 활용하여 실무 능력을 강화하고, 글로벌 감각을 갖춘 인재로 성장하고자 합니다.',
      keywords: ['교환학생', '현장실습', '인턴십', '실무능력', '글로벌']
    },

    // 인재상
    {
      id: 'kyunghee-spanish-5',
      category: '인재상',
      question: '언어 능력 + 문화 감수성을 갖춘 글로벌 전문 역량',
      answer: '경희대 스페인어학과가 추구하는 인재상은 단순히 언어를 잘하는 사람이 아니라, 문화적 감수성과 글로벌 시각을 갖춘 전문가입니다. 저는 고등학교 시절 다양한 문화 탐구 활동을 통해 언어와 문화가 불가분의 관계임을 깨달았습니다. 앞으로도 스페인어권 문화에 대한 깊은 이해를 바탕으로, 서로 다른 문화 간의 가교 역할을 할 수 있는 인재로 성장하겠습니다.',
      keywords: ['언어능력', '문화감수성', '글로벌', '전문역량', '가교역할']
    },
    {
      id: 'kyunghee-spanish-6',
      category: '인재상',
      question: '스페인어·중남미 문화를 대한 깊은 이해를 통한 지역 전문가 양성',
      answer: '경희대는 스페인어권 지역의 전문가를 양성하는 것을 목표로 합니다. 저는 단순히 언어를 배우는 것을 넘어, 스페인과 중남미의 역사, 정치, 경제, 사회 구조를 체계적으로 학습하여 해당 지역의 전문가가 되고자 합니다. 특히 중남미 지역의 다양성과 발전 가능성에 주목하며, 한국과 중남미 간의 경제·문화 교류에 기여할 수 있는 전문가로 성장하겠습니다.',
      keywords: ['지역전문가', '중남미', '역사', '정치경제', '교류']
    },
    {
      id: 'kyunghee-spanish-7',
      category: '인재상',
      question: '교육학적·학술적 역량을 갖춘 실무적 성장가 외국가 강화 인재 양성',
      answer: '경희대는 이론과 실무를 겸비한 인재를 양성합니다. 저는 학술적 기반을 탄탄히 다지면서도, 현장에서 바로 활용할 수 있는 실무 능력을 키우고자 합니다. 교환학생 프로그램과 인턴십을 통해 현지 경험을 쌓고, 학술 연구와 실무 경험을 융합하여 국제 무대에서 활약할 수 있는 전문가가 되겠습니다.',
      keywords: ['학술역량', '실무능력', '이론과실무', '현장경험', '국제무대']
    },
    {
      id: 'kyunghee-spanish-8',
      category: '인재상',
      question: '언어·문화·지역을 융합한 창의적 성장가 외국가 강화 학습',
      answer: '경희대가 추구하는 인재는 언어, 문화, 지역을 융합적으로 이해하고 창의적으로 사고하는 사람입니다. 저는 고등학교에서 다양한 융합 탐구 활동을 통해 여러 분야를 연결하는 사고력을 길러왔습니다. 앞으로도 스페인어를 중심으로 문화, 역사, 사회를 통합적으로 학습하며, 창의적인 문제 해결 능력을 갖춘 인재로 성장하겠습니다.',
      keywords: ['융합', '창의성', '통합적사고', '문제해결', '다학제적']
    },

    // 교육목표
    {
      id: 'kyunghee-spanish-9',
      category: '교육목표',
      question: '스페인어 역량(읽기·쓰기·듣기·말하기)과 실무 강화',
      answer: '경희대 스페인어학과는 읽기, 쓰기, 듣기, 말하기의 4대 언어 능력을 균형 있게 발전시키는 것을 목표로 합니다. 저는 고등학교에서 스페인어를 학습하며 기초를 다졌고, 대학에서는 더욱 체계적인 교육을 통해 실무에서 바로 활용할 수 있는 수준의 언어 능력을 갖추고자 합니다. 특히 회화와 작문 능력을 집중적으로 향상시켜, 현지인과 자유롭게 소통할 수 있는 실력을 목표로 합니다.',
      keywords: ['4대언어능력', '읽기', '쓰기', '듣기', '말하기', '실무']
    },
    {
      id: 'kyunghee-spanish-10',
      category: '교육목표',
      question: '스페인어·중남미 문화와 사회에 대한 이해를 통한 지역 전문가 양성',
      answer: '경희대는 언어 교육과 함께 스페인어권 지역의 문화와 사회에 대한 깊은 이해를 강조합니다. 저는 스페인과 중남미의 역사, 정치, 경제, 사회 구조를 체계적으로 학습하여 단순한 언어 구사자가 아닌, 해당 지역의 전문가로 성장하고자 합니다. 이를 통해 한국과 스페인어권 국가 간의 교류와 협력에 기여할 수 있는 인재가 되겠습니다.',
      keywords: ['문화이해', '사회구조', '지역전문가', '국제협력', '전문성']
    },
    {
      id: 'kyunghee-spanish-11',
      category: '교육목표',
      question: '교육학적 학술과 프로그램을 통한 학술적 성장가 외국가 강화 역량',
      answer: '경희대는 학술적 기반을 탄탄히 하는 동시에 실무 경험을 쌓을 수 있는 다양한 프로그램을 제공합니다. 저는 학부 과정에서 스페인어학, 문학, 문화 이론을 심도 있게 학습하고, 교환학생과 인턴십 프로그램을 통해 현장 경험을 쌓겠습니다. 이러한 학술과 실무의 균형 잡힌 성장을 통해 국제 무대에서 경쟁력 있는 전문가가 되겠습니다.',
      keywords: ['학술기반', '실무경험', '이론과실제', '교환학생', '경쟁력']
    },
    {
      id: 'kyunghee-spanish-12',
      category: '교육목표',
      question: '언어·문화·지역을 융합한 창의적 성장가 외국가 강화 학습',
      answer: '경희대의 교육 목표는 언어, 문화, 지역을 융합적으로 이해하고 창의적으로 사고하는 인재를 양성하는 것입니다. 저는 스페인어를 중심으로 문학, 역사, 사회학 등 다양한 분야를 통합적으로 학습하며, 복합적인 문제를 창의적으로 해결할 수 있는 능력을 키우겠습니다. 이러한 융합적 사고는 글로벌 시대에 필수적인 역량이라고 생각합니다.',
      keywords: ['융합교육', '창의적사고', '통합학습', '문제해결', '글로벌역량']
    },

    // 커리큘럼
    {
      id: 'kyunghee-spanish-13',
      category: '커리큘럼',
      question: '기초(1~2학년): 기초 스페인어, 문법, 회화, 읽기·쓰기 등 언어 보다 구축',
      answer: '1~2학년 과정에서는 스페인어의 기초를 탄탄히 다지는 것이 목표입니다. 문법, 회화, 독해, 작문 등 언어의 기본기를 체계적으로 학습하며, 스페인어로 자유롭게 의사소통할 수 있는 기반을 마련하겠습니다. 특히 원어민 교수님들과의 회화 수업을 통해 실용적인 언어 능력을 키우고, 스페인어권 문화에 대한 기초적인 이해도 함께 쌓아가겠습니다.',
      keywords: ['기초스페인어', '문법', '회화', '독해', '작문', '기본기']
    },
    {
      id: 'kyunghee-spanish-14',
      category: '커리큘럼',
      question: '심화(2~3학년): 스페인어·중남미 문화와 역사·사회에 대한 과목',
      answer: '2~3학년에서는 언어 능력을 심화하는 동시에, 스페인과 중남미의 문화, 역사, 사회를 본격적으로 학습합니다. 스페인어권 문학 작품을 원서로 읽고 분석하며, 각국의 역사적 배경과 사회 구조를 이해하는 과정을 통해 지역 전문가로서의 기반을 다지겠습니다. 이러한 심화 학습은 단순한 언어 구사를 넘어, 문화적 맥락을 이해하는 전문가가 되는 데 필수적입니다.',
      keywords: ['심화학습', '문화', '역사', '사회', '문학', '지역이해']
    },
    {
      id: 'kyunghee-spanish-15',
      category: '커리큘럼',
      question: '저학(3~4학년): 교육학생 프로그램, 문화 체험, 통번역·국제협력 관련 실무 과목',
      answer: '3~4학년에서는 교환학생 프로그램을 통해 스페인이나 중남미 현지에서 직접 언어와 문화를 체험하고, 통번역, 국제협력 등 실무 중심의 과목을 이수하겠습니다. 현지에서의 경험은 교실에서 배운 이론을 실제로 적용하고, 문화적 감수성을 높이는 데 큰 도움이 될 것입니다. 또한 통번역 실습과 국제협력 프로젝트를 통해 졸업 후 바로 현장에서 활약할 수 있는 실무 능력을 갖추겠습니다.',
      keywords: ['교환학생', '문화체험', '통번역', '국제협력', '실무과목', '현장경험']
    },
    {
      id: 'kyunghee-spanish-16',
      category: '커리큘럼',
      question: '중등·상급(3~4학년): 통번역·상급 문화, 문학, 통번역·국제협력 관련 실무 과목',
      answer: '고학년 과정에서는 고급 스페인어 능력을 바탕으로 전문 분야에 특화된 학습을 진행합니다. 통번역 이론과 실습, 스페인어권 문학의 심층 분석, 국제협력과 외교 관련 과목 등을 통해 전문성을 극대화하겠습니다. 특히 통번역 실무 과목을 통해 회의 통역, 문서 번역 등 실제 현장에서 요구되는 기술을 익히고, 졸업 후 즉시 전문가로 활동할 수 있는 역량을 갖추겠습니다.',
      keywords: ['고급스페인어', '통번역', '문학분석', '국제협력', '전문성', '실무기술']
    },
    {
      id: 'kyunghee-spanish-17',
      category: '커리큘럼',
      question: '비즈니스 스페인어, 언어 통역, 문화·국제협력 관련 실무 실무 과목',
      answer: '경희대 스페인어학과는 비즈니스 스페인어, 언어 통역, 문화 교류, 국제협력 등 실무 중심의 다양한 과목을 제공합니다. 저는 이러한 과목들을 통해 국제 비즈니스 현장에서 필요한 전문 용어와 비즈니스 매너를 익히고, 통역 실무 능력을 강화하겠습니다. 또한 문화 교류와 국제협력 프로젝트에 참여하여 실제 현장 경험을 쌓고, 졸업 후 글로벌 기업이나 국제기구에서 바로 활약할 수 있는 인재가 되겠습니다.',
      keywords: ['비즈니스스페인어', '통역', '문화교류', '국제협력', '실무능력', '현장경험']
    },
    {
      id: 'kyunghee-spanish-18',
      category: '커리큘럼',
      question: '교육학적, 협업적, 문화 관련 프로젝트',
      answer: '경희대는 교육학적 이론과 협업 능력을 강화하는 다양한 프로젝트 수업을 운영합니다. 저는 팀 프로젝트를 통해 스페인어권 문화 연구, 번역 프로젝트, 문화 교류 기획 등 실제적인 과제를 수행하며 협업 능력과 프로젝트 관리 능력을 키우겠습니다. 이러한 경험은 졸업 후 다양한 분야에서 팀원들과 효과적으로 협력하며 프로젝트를 성공적으로 이끌어가는 데 큰 자산이 될 것입니다.',
      keywords: ['프로젝트수업', '협업', '문화연구', '번역', '팀워크', '프로젝트관리']
    },
    {
      id: 'kyunghee-spanish-19',
      category: '커리큘럼',
      question: '졸업논문 또는 실무 연구 가능',
      answer: '졸업 시에는 학술 논문 작성 또는 실무 연구 프로젝트 중 선택할 수 있습니다. 저는 스페인어권 문화나 사회 이슈에 대한 심층 연구를 통해 학술적 역량을 강화하거나, 실무 프로젝트를 통해 현장 경험을 쌓는 등 제 진로에 맞는 방향을 선택하겠습니다. 이러한 졸업 연구는 대학원 진학이나 취업 시 중요한 포트폴리오가 될 것이며, 전문가로서의 첫걸음을 내딛는 데 큰 도움이 될 것입니다.',
      keywords: ['졸업논문', '실무연구', '학술역량', '현장경험', '포트폴리오', '전문성']
    }
  ];

  // 카테고리 목록 추출
  const categories = ['전체', ...new Set(kyungheeInterviewQuestions.map(q => q.category))];

  // 필터링된 질문 목록
  const filteredQuestions = selectedCategory === '전체'
    ? kyungheeInterviewQuestions
    : kyungheeInterviewQuestions.filter(q => q.category === selectedCategory);

  // 질문 확장/축소 토글
  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  // 완료 상태 확인
  const isQuestionCompleted = (questionId) => {
    return completionStatus.kyungheeSpanishInterview?.includes(questionId) || false;
  };

  // 완료 토글
  const handleToggleCompletion = (questionId) => {
    if (toggleCompletion) {
      toggleCompletion('kyungheeSpanishInterview', questionId);
    }
  };

  // 진행률 계산
  const getProgress = () => {
    const total = kyungheeInterviewQuestions.length;
    const completed = completionStatus.kyungheeSpanishInterview?.length || 0;
    return Math.round((completed / total) * 100);
  };

  // 공통 질문 섹션 컴포넌트 (마스터-디테일 레이아웃)
  const CommonQuestionsSection = () => {
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    const questions = [
      {
        number: 1,
        title: "자기소개를 해보세요.",
        versions: [
          {
            title: "버전 1: 융합적 사고 중심",
            content: "호기심과 특히 스페인어를 공부하면서 언어가 단순한 말이 아니라 한 나라의 역사와 문화가 담긴 소통의 방식이라는 점을 알게 되었고, 이 과정에서 언어와 문화의 연결성에 큰 매력을 느꼈습니다. 독서와 토론 활동으로 생각을 정리하고 표현하는 힘을 길렀고, 학급 활동에서는 맡은 역할을 책임감 있게 수행하며 협력의 가치를 실천해 왔습니다. 이런 경험을 통해 저는 세상을 다양한 시각에서 바라보는 힘을 갖게 되었고, 앞으로 경희대 스페인어학과에서 더 넓은 세계와 소통하며 성장하는 인재가 되고 싶습니다."
          },
          {
            title: "버전 2: 구체적 활동 중심",
            content: "저는 스스로를 '시계'에 비유합니다. 목표를 설정한 후 시계처럼 체계적으로 계획을 세우고 시간을 효율적으로 관리하며 끊임없이 노력하기 때문입니다. 1학년 때 '스페인과 대한민국의 문화와 미디어 비교분석'을 주제로 탐구하며 스페인어가 단순한 언어를 넘어 문화, 역사, 가치관을 담고 있다는 사실을 깨달았습니다. 외국어 합창제에서 스페인어로 'Something's Never Change'를 합창하며 협동심을 키웠고, 신문활용교육에서 '한류의 이중성'을 발표하며 각국의 문화를 비판적으로 수용하고 존중하는 태도의 중요성을 배웠습니다. 교육봉사반에서 카르스트 지형을 탐구하여 부원들에게 수업을 시연하며 교수법의 중요성을 깨달았고, 사회과학연구반에서 '정치외교학에서의 실용주의와 이상주의'를 탐구하며 국제적 이슈에 대한 다양한 관점을 학습했습니다."
          },
          {
            title: "버전 3: 창의·융합 인재 (경희대 인재상)",
            content: "저는 언어 능력과 인문학적 소양을 결합하여 새로운 가치를 창출하는 '융합형 인재'를 꿈꿉니다. 고교 시절 스페인어 학습뿐만 아니라, 빅데이터 분석 동아리 활동을 통해 '스페인어권 국가의 소셜 미디어 트렌드 분석' 프로젝트를 수행하며 언어와 기술의 융합 가능성을 확인했습니다. 경희대학교의 '문화세계창조'라는 비전은 저에게 큰 영감을 주었습니다. 단순히 언어를 잘하는 것을 넘어, 인류 문명의 평화와 공영에 기여하는 세계시민으로 성장하고 싶습니다. 입학 후 후마니타스 칼리지의 교양 교육을 통해 인간과 세계에 대한 깊은 이해를 쌓고, 이를 바탕으로 스페인어권과 한국을 잇는 창의적인 문화 콘텐츠를 기획하는 전문가가 되겠습니다."
          }
        ]
      },
      {
        number: 2,
        title: "지원동기를 말씀해보세요.",
        versions: [
          {
            title: "버전 1: 교육 프로그램 중심",
            content: "저는 스페인어권의 언어와 문화 다양성에 깊은 흥미를 느껴 경희대 스페인어학과에 지원했습니다. 경희대는 언어뿐 아니라 스페인과 중남미의 문화·문학·사회까지 폭넓게 배우는 교육 체계를 갖추고 있고, 교환학생과 'Cafe con Leche' 같은 문화 체험 프로그램 등 실제로 경험하며 성장할 기회가 많다는 점이 큰 장점이라고 생각했습니다. 이를 통해 배운 언어를 실제 현장에서 사용해 보고, 스페인어권 사회를 직접 체감하며 전문성을 키울 수 있다는 점이 저에게 매우 매력적이었습니다. 그래서 저는 경희대에서 스페인어권을 깊이 이해하고, 한국과 스페인·중남미를 연결하는 다리 역할을 하고 싶습니다."
          },
          {
            title: "버전 2: 탐구 경험 중심",
            content: "스페인어 회화 수업에서 스페인의 다중언어정책을 깊이 있게 조사하며 다양한 언어와 문화를 존중하는 스페인의 다문화 사회적 면모에 감명받았습니다. '스페인과 대한민국의 문화와 미디어 비교분석' 탐구를 통해 두 나라의 문화가 서로 다른 경로를 거쳐 국제적 영향력을 가지게 된 과정을 이해했고, 글로벌화 속에서 다양한 문화와 가치관이 상호작용하는 현상을 확인했습니다. 특수외국어 언어 문화 이해 증진 프로그램에서 이탈리아어, 포르투갈어, 헝가리어를 학습하며 언어가 단순한 의사소통 도구가 아니라 해당 언어권의 문화와 사고방식을 포괄하는 매체임을 깨달았습니다. 경희대 스페인어학과의 체계적인 교육과 풍부한 교환학생 프로그램을 통해 언어와 문화를 깊이 이해하고, 한국과 스페인어권 국가 간의 문화적 교류를 촉진하는 외교관 또는 국제기구 전문가가 되고 싶습니다."
          },
          {
            title: "버전 3: 문화세계창조 기여 (경희대 인재상)",
            content: "경희대학교가 추구하는 '문화세계창조'의 가치에 깊이 공감하여 지원했습니다. 저는 고등학교 때 '세계시민교육' 동아리에서 활동하며 빈곤, 환경, 평화 등 지구촌 문제에 대해 토론하고 해결 방안을 모색했습니다. 특히 중남미 지역의 불평등 문제와 원주민 문화 보존에 관심을 갖게 되면서, 스페인어가 단순한 도구가 아니라 이들과 소통하고 연대하는 열쇠임을 깨달았습니다. 경희대 스페인어학과는 인문학적 성찰을 바탕으로 글로벌 리더를 양성하는 최고의 요람입니다. 이곳에서 스페인어권의 역사와 문화를 심도 있게 배우고, 나아가 인류 사회의 보편적 가치를 실현하는 데 기여하는 진정한 '세계인'으로 성장하고 싶습니다."
          }
        ]
      },
      {
        number: 3,
        title: "학업계획을 말씀해보세요.",
        versions: [
          {
            title: "버전 1: 단계별 학습 계획",
            content: "입학 후에는 먼저 기본기인 스페인어 회화, 문법, 독해를 중심으로 탄탄한 언어 기반을 먼저 쌓고, 스페인과 중남미의 문화, 문학, 사회를 심화해 지역 이해도를 높여 전공심화를 탐구할 계획입니다. 또한 교환학생 프로그램을 활용해 글로벌 시대를 이끌어 나갈 언어적 역량과 문화적 역량을 기르겠습니다. 방학 중에는 인턴십이나 학과 프로그램에 참여해 언어가 사회와 산업 현장에서 어떻게 쓰이는지 직접 체험하며 실무 감각도 함께 기르겠습니다. 이런 과정을 통해 학문적 지식과 실제 경험을 겸비한 국제형 인재로 성장하고자 합니다."
          },
          {
            title: "버전 2: 융합 학습 계획",
            content: "1학년에는 스페인어 기초 문법, 회화, 독해, 작문을 체계적으로 학습하며 언어의 기본기를 탄탄히 다지겠습니다. 2학년부터는 '스페인어권 문화'와 '스페인어 독해와 작문' 과목을 통해 스페인과 중남미의 문화, 역사, 사회를 본격적으로 탐구하겠습니다. 고등학교에서 '페루 및 볼리비아의 아이마라 원주민 문화'를 탐구하며 자연을 존중하는 방법을 배운 경험을 바탕으로, 대학에서는 더 깊이 있는 문화 연구를 진행하겠습니다. 3-4학년에는 교환학생 프로그램을 통해 스페인이나 중남미 현지에서 직접 언어와 문화를 체험하고, 통번역과 국제협력 관련 실무 과목을 이수하겠습니다. 또한 철학 교양 과목을 수강하여 언어 철학과 스페인어권 사상가들의 철학을 융합적으로 학습하며, 언어와 철학을 연결하는 독창적인 관점을 개발하겠습니다."
          },
          {
            title: "버전 3: 통섭적 학문 탐구 (경희대 인재상)",
            content: "경희대의 자랑인 '후마니타스 칼리지' 교육 과정을 적극 활용하여 인문, 사회, 과학을 아우르는 통섭적 시각을 기르겠습니다. 1학년 때는 '인간의 가치 탐색' 등 중핵 교과를 통해 비판적 사고력을 키우고, 전공 기초를 다지겠습니다. 고학년이 되면 스페인어학 전공 심화 학습과 더불어, '국제학' 또는 '경영학'을 복수 전공하여 스페인어권 지역 전문가로서의 실질적인 역량을 갖추겠습니다. 특히 '독립연구' 프로그램을 통해 '중남미 지역의 지속가능한 발전 모델'을 주제로 연구를 수행하고 싶습니다. 교환학생 기간에는 현지 대학생들과의 교류를 통해 문화적 다양성을 체득하고, 글로벌 이슈에 대한 공동의 해법을 고민하는 실천적인 지식인이 되겠습니다."
          }
        ]
      },
      {
        number: 4,
        title: "졸업 후 진로계획을 말씀해보세요.",
        versions: [
          {
            title: "버전 1: 문화·경제 교류 전문가",
            content: "졸업 후에는 스페인어권과 한국을 연결하는 국제 비즈니스나 문화 교류 분야에서 실무 경험을 쌓고 싶습니다. 이후에는 대학원에 진학해 언어·문화 교류 또는 국제협력 분야를 전문적으로 연구하며 역량을 더 깊게 확장할 계획입니다. 궁극적으로는 스페인어권 국가들과의 문화·경제 협력을 이끄는 전문가가 되어, 언어를 매개로 상호 이해와 실제 협력을 만들어 내는 역할을 하고 싶습니다."
          },
          {
            title: "버전 2: 외교·국제기구 전문가",
            content: "고등학교 때부터 외교와 국제협력 분야에 깊은 관심을 가져왔습니다. '국제정치 패러다임'을 탐구하며 동맹관계와 국제정치 이론을 학습했고, '내가 세우는 국가 정책' 활동에서 청소년배심원제도 도입 정책을 제안하며 정책 입안 능력을 키웠습니다. 졸업 후에는 외교부나 국제기구에서 인턴십을 경험하며 실무 감각을 쌓고, 스페인어권 국가와의 외교 업무를 담당하는 외교관이 되고 싶습니다. 특히 중남미 지역의 다양성과 발전 가능성에 주목하며, 한국과 중남미 간의 경제·문화 교류를 촉진하는 가교 역할을 하겠습니다. 이후 대학원에서 국제관계학이나 지역학을 전공하여 학술적 기반을 강화하고, 궁극적으로는 한국의 글로벌 위상을 높이는 데 기여하는 외교 전문가가 되겠습니다."
          },
          {
            title: "버전 3: 글로벌 공헌 실천가 (경희대 인재상)",
            content: "저는 '학문과 평화'라는 경희대의 전통을 이어받아, 국제사회에 공헌하는 실천가가 되고 싶습니다. 졸업 후 KOICA(한국국제협력단)나 국제 NGO에 진출하여 중남미 개발도상국의 교육 및 문화 발전 프로젝트에 참여하겠습니다. 현장에서 스페인어로 소통하며 그들의 삶을 이해하고, 실질적인 도움을 주는 활동을 하고 싶습니다. 장기적으로는 국제기구에서 활동하며 문화 다양성 보존과 평화 구축을 위한 정책을 입안하는 전문가로 성장하겠습니다. 경희대에서 배운 '지구적 존엄'의 가치를 전 세계에 전파하며, 더 나은 세상을 만드는 데 일조하는 것이 저의 최종 목표입니다."
          }
        ]
      },
      {
        number: 5,
        title: "복수 합격 시 경희대를 선택할 것인가요?",
        versions: [
          {
            title: "버전 1: 교육 프로그램 강점",
            content: "여러 대학을 비교해보았지만, 저는 복수 합격하더라도 경희대 스페인어학과를 선택할 것입니다. 첫째, 경희대는 언어 교육뿐 아니라 문화·문학·사회 이해를 통합적으로 다루는 교육 체계를 갖추고 있으며, 둘째, 스페인과 중남미 대학과의 교환학생, 문화 체험 행사, 다양한 국제 프로그램 등 실제로 성장할 수 있는 기회가 풍부합니다. 셋째, 스페인어권을 깊이 있게 이해하며 실무 능력까지 키울 수 있는 환경이라는 점이 제 진로와 가장 잘 맞습니다. 그래서 저는 경희대에서 제 꿈을 가장 주체적으로 키울 수 있다고 확신합니다."
          },
          {
            title: "버전 2: 융합 교육과 가치 일치",
            content: "경희대 스페인어학과는 언어·문화·문학·사회를 통합적으로 교육하는 특성화된 프로그램을 운영하고 있습니다. 저는 고등학교에서 언어와 철학을 융합적으로 탐구해왔는데, 2학년 때 '중세철학에서 종교의 의미'를 발표하며 철학의 역사적 맥락을 깊이 있게 탐구했고, 3학년 때 '타나토노트'를 중심으로 종교적·철학적 죽음관을 탐구하며 철학적 사고력을 키웠습니다. 경희대는 스페인어 교육과 함께 스페인어권 철학자들의 사상을 학습할 수 있는 기회를 제공하며, 언어와 철학을 연결하는 융합적 사고를 발전시킬 수 있는 최적의 환경입니다. 또한 '문화세계창조'라는 경희대의 이념은 제가 추구하는 '문화를 통한 세계 이해와 소통'이라는 가치와 완벽히 일치합니다. 복수 합격하더라도 경희대를 선택하겠습니다."
          },
          {
            title: "버전 3: 경희 정신과의 공명 (경희대 인재상)",
            content: "네, 저는 주저 없이 경희대학교를 선택하겠습니다. 다른 대학들도 훌륭한 커리큘럼을 가지고 있지만, 경희대학교만이 가진 '대학다운 미래대학'이라는 비전과 '지구공동사회' 건설이라는 목표가 제 가치관과 깊이 공명하기 때문입니다. 저는 대학이 단순히 취업을 위한 준비 기관이 아니라, 인류의 미래를 고민하고 새로운 가치를 창조하는 학문의 전당이어야 한다고 생각합니다. 경희대의 후마니타스 칼리지 교육과 활발한 국제화 프로그램은 제가 꿈꾸는 '실천하는 지성인'으로 성장할 수 있는 유일하고도 최적의 토양입니다. 경희의 정신을 이어받아 학교의 명예를 드높이는 인재가 되겠습니다."
          }
        ]
      },
      {
        number: 6,
        title: "마지막으로 하고 싶은 말이 있나요?",
        versions: [
          {
            title: "버전 1: 가치관과 포부 강조",
            content: "저는 언어를 배우는 것은 새로운 세계를 이해하고 서로를 연결하는 과정이라고 생각합니다. 스페인어를 공부하며 그 나라의 역사와 문화, 그리고 사람들의 가치가 언어 안에 얼마나 깊게 담겨 있는지 깨달았고, 이 경험이 제 시야를 훨씬 넓혀주었습니다. 경희대 스페인어학과는 언어뿐 아니라 문화·문학·사회 전반을 통합적으로 배울 수 있는 곳이고, 교환학생과 다양한 문화 프로그램을 통해 배움을 실제 경험으로 확장할 수 있다는 점이 제게 큰 동기부여가 되었습니다. 저는 경희대에서 배운 지식을 바탕으로 스페인어권과 한국을 연결하는 다리 역할을 하고 싶습니다. 성실함과 책임감을 바탕으로 주어진 기회를 적극적으로 활용하며, 학교의 이름을 빛내는 인재로 성장하겠습니다. 감사합니다."
          },
          {
            title: "버전 2: 열정과 성장 가능성 강조",
            content: "오늘 면접을 통해 경희대 스페인어학과에 대한 저의 열정을 보여드릴 수 있어 영광이었습니다. 고등학교 3년 동안 스페인어와 스페인어권 문화를 탐구하며 키워온 꿈을 경희대라는 최고의 환경에서 펼치고 싶습니다. 입학 후에는 단순히 지식을 습득하는 것에 그치지 않고, 끊임없이 질문하고 탐구하며 '문화세계창조'에 기여하는 인재가 되겠습니다. 저의 잠재력을 믿고 뽑아주신다면, 경희대의 자랑스러운 동문으로 성장하여 학교와 사회에 보답하겠습니다. 꼭 합격하여 교수님들과 선배님들을 캠퍼스에서 다시 뵙고 싶습니다. 감사합니다."
          },
          {
            title: "버전 3: 공감과 소통의 의지 (경희대 인재상)",
            content: "경희대학교의 인재상인 '교양, 공감, 창의로 연결된 융합형 인재'는 바로 제가 지향하는 모습입니다. 저는 타인의 아픔에 공감하고, 다름을 인정하며 소통하는 능력이 글로벌 리더의 가장 중요한 자질이라고 믿습니다. 경희대 스페인어학과에 입학한다면, 동기들과 치열하게 토론하고 협력하며 함께 성장하는 학풍을 만들어가겠습니다. 또한, 제가 가진 열정과 재능을 나누며 지역사회와 학교 발전에 기여하는 '나눔의 리더십'을 실천하겠습니다. 저의 가능성을 믿고 선발해 주신다면, 경희대학교가 꿈꾸는 더 나은 미래를 함께 만들어가는 주역이 되겠습니다. 경청해 주셔서 감사합니다."
          }
        ]
      }
    ];

    const activeQuestion = questions[activeQuestionIndex];

    const versionConfig = [
      {
        icon: '📘',
        label: 'Version A',
        headerBg: '#1976d2',
        headerColor: 'white',
        borderColor: '#1976d2'
      },
      {
        icon: '📗',
        label: 'Version B',
        headerBg: '#f57c00',
        headerColor: 'white',
        borderColor: '#f57c00'
      },
      {
        icon: '📕',
        label: 'Version C',
        headerBg: '#7b1fa2',
        headerColor: 'white',
        borderColor: '#7b1fa2'
      }
    ];

    return (
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* 왼쪽: 질문 목록 (사이드바) */}
        <div style={{
          flex: '0 0 280px',
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e1e8ed',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            padding: '16px 20px',
            background: '#f8f9fa',
            borderBottom: '1px solid #e1e8ed',
            fontWeight: '700',
            color: '#2c3e50'
          }}>
            질문 목록
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setActiveQuestionIndex(index)}
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  background: activeQuestionIndex === index ? '#e3f2fd' : 'white',
                  border: 'none',
                  borderBottom: '1px solid #f1f3f5',
                  borderLeft: activeQuestionIndex === index ? '4px solid #1976d2' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{
                  background: activeQuestionIndex === index ? '#1976d2' : '#e9ecef',
                  color: activeQuestionIndex === index ? 'white' : '#495057',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  flexShrink: 0
                }}>{q.number}</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: activeQuestionIndex === index ? '700' : '500',
                  color: activeQuestionIndex === index ? '#1565c0' : '#495057',
                  lineHeight: '1.4'
                }}>{q.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 오른쪽: 상세 내용 (메인) */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div className="common-question-number" style={{ marginBottom: '8px' }}>질문 {activeQuestion.number}</div>
            <h4 className="common-question-title" style={{ fontSize: '22px' }}>{activeQuestion.title}</h4>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {activeQuestion.versions.map((version, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e1e8ed',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `4px solid ${versionConfig[index].borderColor}`
              }}>
                <div style={{
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  background: versionConfig[index].headerBg,
                  color: versionConfig[index].headerColor
                }}>
                  <span style={{
                    fontSize: '24px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}>{versionConfig[index].icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      opacity: 0.9
                    }}>{versionConfig[index].label}</span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      lineHeight: '1.3'
                    }}>{version.title}</span>
                  </div>
                </div>
                <div style={{ padding: '24px', background: '#fff', flexGrow: 1 }}>
                  <p style={{
                    color: '#2c3e50',
                    fontSize: '16px',
                    lineHeight: '1.8',
                    margin: 0,
                    wordBreak: 'keep-all',
                    textAlign: 'justify'
                  }}>{version.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="interview-container">
      {/* 헤더 */}
      <div className="interview-header">
        <h2>🎓 경희대학교 스페인어학과 면접 준비</h2>
        <p className="interview-subtitle">
          경희대학교 스페인어학과 맞춤형 예상 질문과 답변
        </p>
      </div>

      {/* 진행률 표시 */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">전체 진행률</span>
          <span className="progress-percentage">{getProgress()}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>{completionStatus.kyungheeSpanishInterview?.length || 0} / {kyungheeInterviewQuestions.length} 완료</span>
        </div>
      </div>

      {/* 공통 문항 - 중요 강조 섹션 */}
      <div className="common-questions-highlight">
        <div className="common-questions-header">
          <h3>⭐ 공통 문항 (필수 준비)</h3>
          <p className="common-questions-subtitle">
            모든 지원자에게 공통으로 질문되는 핵심 문항입니다. 좌측 목록에서 질문을 선택하여 확인하세요!
          </p>
        </div>

        <CommonQuestionsSection />
      </div>

      {/* 학과 정보 */}
      <div className="department-info-card">
        <button
          className="department-info-toggle"
          onClick={() => setShowDepartmentInfo(!showDepartmentInfo)}
        >
          <span className="toggle-icon">{showDepartmentInfo ? '▼' : '▶'}</span>
          <span className="toggle-text">경희대학교 스페인어학과 정보</span>
        </button>

        {showDepartmentInfo && (
          <div className="department-info-content">
            <h3>📋 면접 개요</h3>
            <div className="interview-overview-table">
              <div className="overview-row">
                <div className="overview-label">전형명</div>
                <div className="overview-value">네오르네상스전형</div>
              </div>
              <div className="overview-row">
                <div className="overview-label">면접방법</div>
                <div className="overview-value">
                  공통질문(자원동기, 가치관 및 인성 등) 및 개인 서류 확인 면접
                </div>
              </div>
              <div className="overview-row">
                <div className="overview-label">면접시간</div>
                <div className="overview-value">
                  개인면접으로, 면접관(2인) 대(對)지원자(1인) 10분 내외 면접
                </div>
              </div>
              <div className="overview-row">
                <div className="overview-label">면접내용</div>
                <div className="overview-value">
                  학교생활기록부의 자상한 내용을 토대로 지원자 개별 확인 질문
                  <br />
                  (평가요소: 인성(가치관 및 태도, 의사소통능력) 50%, 전공적합성(전공기초소양, 논리적 사고력) 50%)
                </div>
              </div>
            </div>

            <h3>📚 학과 특징</h3>
            <ul>
              <li><strong>전형:</strong> 학생부종합 (네오르네상스)</li>
              <li><strong>특징:</strong> 문화세계창조, 인문학중심</li>
              <li><strong>교육목표:</strong> 스페인어권 문화와 언어 전문가 양성</li>
              <li><strong>주요 프로그램:</strong> 교환학생, 복수전공, 해외 인턴십</li>
            </ul>

            <h3>💡 면접 팁</h3>
            <ul>
              <li>경희대의 "문화세계창조" 이념에 대한 이해</li>
              <li>스페인어권 문화에 대한 관심과 이해도</li>
              <li>인문학적 소양과 융합적 사고</li>
              <li>글로벌 시민으로서의 자질</li>
              <li>생활기록부 내용을 바탕으로 한 구체적인 답변 준비</li>
              <li>인성과 전공적합성을 균형있게 어필</li>
            </ul>
          </div>
        )}
      </div>

      {/* 카테고리 필터 */}
      <div className="category-filter">
        <div className="category-label">카테고리:</div>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {category !== '전체' && (
                <span className="category-count">
                  ({kyungheeInterviewQuestions.filter(q => q.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 질문 목록 */}
      <div className="questions-list">
        {filteredQuestions.map((item, index) => {
          const isCompleted = isQuestionCompleted(item.id);
          const isExpanded = expandedQuestion === item.id;

          return (
            <div
              key={item.id}
              className={`question-card ${isCompleted ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}`}
            >
              {/* 질문 헤더 */}
              <div className="question-header" onClick={() => toggleQuestion(item.id)}>
                <div className="question-header-left">
                  <span className="question-number">Q{index + 1}</span>
                  <span className="question-category-badge">{item.category}</span>
                  <h3 className="question-title">{item.question}</h3>
                </div>
                <div className="question-header-right">
                  {user && (
                    <button
                      className={`completion-checkbox ${isCompleted ? 'checked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCompletion(item.id);
                      }}
                      title={isCompleted ? '완료 취소' : '완료 표시'}
                    >
                      {isCompleted ? '✓' : ''}
                    </button>
                  )}
                  <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* 질문 내용 (확장 시) */}
              {isExpanded && (
                <div className="question-content">
                  <div className="answer-section">
                    <h4 className="answer-label">💡 모범 답변</h4>
                    <div className="answer-text">
                      {item.answer}
                    </div>
                  </div>

                  {item.keywords && item.keywords.length > 0 && (
                    <div className="keywords-section">
                      <h4 className="keywords-label">🔑 핵심 키워드</h4>
                      <div className="keywords-list">
                        {item.keywords.map((keyword, idx) => (
                          <span key={idx} className="keyword-tag">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!user && (
                    <div className="login-required-notice">
                      <p>🔒 완료 체크는 로그인 후 이용 가능합니다.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 안내 메시지 */}
      <div className="interview-notice">
        <h4>📌 안내사항</h4>
        <ul>
          <li>위 질문들은 경희대학교 스페인어학과 면접을 위한 예상 질문입니다.</li>
          <li>각 질문에 대한 답변을 충분히 준비하고, 자신의 경험과 연결하여 답변하세요.</li>
          <li>경희대의 "문화세계창조" 이념과 연계하여 답변을 구성하면 좋습니다.</li>
          <li>실제 면접에서는 생활기록부 기반 질문이 추가될 수 있습니다.</li>
        </ul>
      </div>

      <style jsx>{`
        .interview-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .interview-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .interview-header h2 {
          font-size: 28px;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .interview-subtitle {
          color: #7f8c8d;
          font-size: 16px;
        }

        .progress-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          border-radius: 12px;
          color: white;
          margin-bottom: 30px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .progress-label {
          font-size: 16px;
          font-weight: 600;
        }

        .progress-percentage {
          font-size: 24px;
          font-weight: bold;
        }

        .progress-bar {
          background: rgba(255, 255, 255, 0.3);
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          background: white;
          height: 100%;
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .progress-stats {
          text-align: right;
          font-size: 14px;
          opacity: 0.9;
        }

        .common-questions-highlight {
          background: #f5f7fa;
          padding: 30px;
          border-radius: 16px;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 2px solid #e1e8ed;
        }

        .common-questions-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .common-questions-header h3 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .common-questions-subtitle {
          color: #5a6c7d;
          font-size: 15px;
          margin: 0;
        }

        .common-questions-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .common-question-with-versions {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
        }

        .common-question-with-versions:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        .question-header-section {
          margin-bottom: 16px;
        }

        .common-question-number {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .common-question-title {
          color: #2c3e50;
          font-size: 19px;
          margin: 0;
          font-weight: 600;
        }

        .versions-split-view {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 20px;
        }

        .version-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e1e8ed;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease;
        }

        .version-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
        }

        .version-header {
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .version-card.version-1 .version-header {
          background: #1976d2 !important;
          color: white !important;
        }

        .version-card.version-2 .version-header {
          background: #f57c00 !important;
          color: white !important;
        }

        .version-icon {
          font-size: 24px;
          background: rgba(255, 255, 255, 0.2);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .version-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .version-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.9;
        }

        .version-title {
          font-size: 16px;
          font-weight: 700;
          color: white;
          line-height: 1.3;
        }

        .version-body {
          padding: 24px;
          background: #fff;
          flex-grow: 1;
        }

        .version-text {
          color: #2c3e50;
          font-size: 16px;
          line-height: 1.8;
          margin: 0;
          word-break: keep-all;
          text-align: justify;
        }

        @media (max-width: 768px) {
          .versions-split-view {
            grid-template-columns: 1fr;
          }
          
          .version-card {
            margin-bottom: 16px;
          }

          .common-questions-highlight {
            padding: 20px;
          }

          .common-questions-header h3 {
            font-size: 20px;
          }
        }

        .department-info-card {
          background: #f8f9fa;
          border-radius: 12px;
          margin-bottom: 30px;
          overflow: hidden;
        }

        .department-info-toggle {
          width: 100%;
          padding: 15px 20px;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          transition: background 0.2s;
        }

        .department-info-toggle:hover {
          background: #e9ecef;
        }

        .toggle-icon {
          color: #667eea;
        }

        .department-info-content {
          padding: 20px;
          border-top: 1px solid #dee2e6;
        }

        .department-info-content h3 {
          color: #667eea;
          font-size: 18px;
          margin-bottom: 15px;
          margin-top: 20px;
        }

        .department-info-content h3:first-child {
          margin-top: 0;
        }

        .department-info-content ul {
          list-style: none;
          padding: 0;
        }

        .department-info-content li {
          padding: 8px 0;
          color: #495057;
          line-height: 1.6;
        }

        .interview-overview-table {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid #dee2e6;
        }

        .overview-row {
          display: grid;
          grid-template-columns: 120px 1fr;
          border-bottom: 1px solid #dee2e6;
        }

        .overview-row:last-child {
          border-bottom: none;
        }

        .overview-label {
          background: #f8f9fa;
          padding: 12px 15px;
          font-weight: 600;
          color: #495057;
          border-right: 1px solid #dee2e6;
        }

        .overview-value {
          padding: 12px 15px;
          color: #495057;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .overview-row {
            grid-template-columns: 1fr;
          }

          .overview-label {
            border-right: none;
            border-bottom: 1px solid #dee2e6;
          }
        }

        .category-filter {
          margin-bottom: 30px;
        }

        .category-label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .category-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .category-btn {
          padding: 8px 16px;
          border: 2px solid #dee2e6;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #495057;
          transition: all 0.2s;
        }

        .category-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .category-btn.active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .category-count {
          margin-left: 5px;
          opacity: 0.7;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .question-card {
          background: white;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .question-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }

        .question-card.completed {
          border-color: #28a745;
          background: #f8fff9;
        }

        .question-header {
          padding: 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .question-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .question-number {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
        }

        .question-category-badge {
          background: #e9ecef;
          color: #495057;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
        }

        .question-title {
          font-size: 16px;
          color: #2c3e50;
          margin: 0;
          font-weight: 600;
        }

        .question-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .completion-checkbox {
          width: 28px;
          height: 28px;
          border: 2px solid #dee2e6;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s;
        }

        .completion-checkbox:hover {
          border-color: #28a745;
        }

        .completion-checkbox.checked {
          background: #28a745;
          border-color: #28a745;
          color: white;
        }

        .expand-icon {
          color: #667eea;
          font-size: 14px;
        }

        .question-content {
          padding: 0 20px 20px 20px;
          border-top: 1px solid #e9ecef;
        }

        .answer-section {
          margin-top: 20px;
        }

        .answer-label {
          font-size: 16px;
          color: #667eea;
          margin-bottom: 12px;
        }

        .answer-text {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          line-height: 1.8;
          color: #495057;
          white-space: pre-wrap;
        }

        .keywords-section {
          margin-top: 20px;
        }

        .keywords-label {
          font-size: 16px;
          color: #667eea;
          margin-bottom: 12px;
        }

        .keywords-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .keyword-tag {
          background: #e7f3ff;
          color: #0066cc;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
        }

        .login-required-notice {
          margin-top: 20px;
          padding: 15px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          border-radius: 4px;
        }

        .login-required-notice p {
          margin: 0;
          color: #856404;
          font-size: 14px;
        }

        .interview-notice {
          margin-top: 40px;
          padding: 20px;
          background: #e7f3ff;
          border-left: 4px solid #0066cc;
          border-radius: 8px;
        }

        .interview-notice h4 {
          color: #0066cc;
          margin-bottom: 15px;
          font-size: 16px;
        }

        .interview-notice ul {
          margin: 0;
          padding-left: 20px;
        }

        .interview-notice li {
          color: #495057;
          line-height: 1.8;
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .interview-container {
            padding: 15px;
          }

          .interview-header h2 {
            font-size: 22px;
          }

          .question-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .question-header-left {
            flex-wrap: wrap;
          }

          .question-header-right {
            align-self: flex-end;
          }

          .category-buttons {
            flex-direction: column;
          }

          .category-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default KyungheeSpanishInterview;
