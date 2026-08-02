import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updatePrologue() {
  const { data, error } = await supabase
    .from('novel_documents')
    .select('data')
    .eq('slug', 'quantum-vibration-novel')
    .single();

  if (error || !data) {
    console.error("Error fetching novel:", error);
    return;
  }

  const novel = data.data;
  
  // Find Prologue (Act 0), Chapter 1, Paragraph 1
  const prologueAct = novel.acts.find(a => a.number === 0);
  const chapter1 = prologueAct.chapters[0];
  const firstParagraph = chapter1.paragraphs[0];

  const newContent = `지하 100미터, 알프스의 화강암 암반 깊숙이 요새처럼 자리 잡은 제네바 차세대 거대 양자 가속기(Next-Gen Quantum Collider, NGC)의 중앙 통제실(CCC)은 문자 그대로 아수라장이었다.

넓고 푸른색 톤으로 디자인된 거대한 원형 룸 안에는 4개의 구역으로 나뉜 39개의 콘솔 책상들이 타원형으로 도열해 있었다. 평소라면 차분한 침묵 속에 컵 커피를 든 엔지니어들이 모니터를 응시해야 할 곳이었지만, 지금은 천장에 달린 주황색 회전 경광등이 통제실 전체를 핏빛으로 물들이며 비상 사이렌과 함께 귀를 찢는 굉음을 토해내고 있었다.

콘솔을 지키는 십수 명의 오퍼레이터들은 셔츠 소매를 걷어붙이거나 안전모가 바닥에 뒹구는 것도 모른 채 키보드를 부서져라 두드리고 있었다. 통제실 한쪽 벽면을 가득 채운 대형 '비스타(Vistar)' 모니터 화면에는 끔찍한 데이터가 폭포수처럼 쏟아졌다. 둘레 100킬로미터에 달하는 거대한 초전도 진공 파이프 내부에서 테라전자볼트(TeV) 단위로 가속되던 입자 빔 궤적들이, 규칙적인 직선과 곡선을 잃고 화면 위에서 거미줄처럼 비틀리며 요동쳤다. 입자의 에너지를 나타내는 컬러 스펙트럼이 안전선인 녹색을 넘어 붉은색, 급기야 섬광 같은 흰색으로 치솟으며 임계치를 산산조각 내고 있었다.

"4번 저온 유지 장치(Cryostat) 압력 폭주! 액체 헬륨 초유동체(Superfluid) 층이 무너집니다!"

극저온 분배 박스(QUI) 콘솔을 맡은 엔지니어가 절망적인 목소리로 외쳤다. 영하 271도를 유지해야 할 냉각 시스템의 밸브들이 압력을 견디지 못하고 모니터 상에서 차례로 터져나가는 붉은 X 표시를 띄웠다. 전면의 두꺼운 방탄 차폐 유리 너머 수직 갱도 아래로는, 에펠탑과 맞먹는 7,000톤의 무게에 직경 25미터의 거대한 원통형 '메인 검출기(Detector Core)'가 진동을 이기지 못해 금방이라도 지지대를 찢고 튀어나올 듯 불길한 푸른빛의 스파크를 토해내고 있었다.`;

  const newVersionKey = "v6.4";
  
  if (!novel.versionHistory.includes(newVersionKey)) {
    novel.versionHistory.push(newVersionKey);
  }

  firstParagraph.versions[newVersionKey] = {
    version: newVersionKey,
    content: newContent,
    note: "AI 코멘트 피드백 반영: 현장감 넘치는 통제실 묘사 추가",
    createdAt: new Date().toISOString().substring(0, 10),
    author: "AI Assistant"
  };
  
  firstParagraph.activeVersion = newVersionKey;

  const { error: updateError } = await supabase
    .from('novel_documents')
    .update({ data: novel })
    .eq('slug', 'quantum-vibration-novel');

  if (updateError) {
    console.error("Failed to update:", updateError);
  } else {
    console.log("Successfully updated Prologue paragraph 1!");
  }
}

updatePrologue();
