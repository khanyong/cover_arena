const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. versionHistory 에 v3.1 추가
if (!content.includes('"v3.1"')) {
  content = content.replace(/versionHistory:\s*\[([^\]]+)\]/, (match, versions) => {
    return `versionHistory: [${versions.trim()}, "v3.1"]`;
  });
}

// 사용자 제공 텍스트 1부 (2장 후반부 대체)
const part1Content = `그 순간, 문가에 멈춰 서 있던 이안이 경호원들을 조용히 밀어내며 다시 회장실 안으로 걸어 들어왔다.

"회장님. 현대 의학의 그 잘난 '물리적 한계'라는 것의 방향을... 완전히 틀어드릴 수 있다면 어쩌시겠습니까?"

마커스가 핏발 선 눈으로 이안을 노려보았다. "내 딸을 상대로 장난을 칠 셈인가?"

"저는 의사도, 마법사도 아닙니다." 이안이 테이블 위의 태블릿을 자신 쪽으로 돌리며 덤덤하게 말했다. "하지만 당신의 의료진이 레이저 수술을 실패한 이유는 짐작할 수 있습니다. 그들은 클로이의 뇌를 3차원의 꽉 찬 고체 덩어리로만 보고, 일직선으로 나아가는 빛과 '확률'에만 의존했기 때문입니다. 그게 바로 스털링 교수를 비롯한 낡은 학계의 방식이죠."

이안이 태블릿 화면에 아틀라스 코퍼레이션의 초정밀 의료 레이저 시뮬레이션 데이터를 띄우고, 그 위에 자신의 텐서 수식을 거침없이 덮어씌우기 시작했다.

"뇌신경은 고체가 아닙니다. 아주 미세하지만 텅 빈 3차원 공간 속에 떠 있는 유기체 네트워크죠. 제 이론에 따르면 공간은 텅 비어있지 않은 유체입니다."
이안이 홀로그램 펜으로 수술 타겟인 뇌종양 세포의 주변 궤적에 복잡한 수식을 그려 넣었다.
"현대 의학이 정상 세포의 확률적 손상을 두려워한다면, 종양을 둘러싼 '정상 신경세포의 공간' 표면에 맹렬히 회전하는 '위상 소용돌이 방어막(Topological Vortex)'을 형성하게끔 레이저의 위상(Phase)을 조정하면 됩니다. 레이저가 투사될 때, 이 미세한 공간 원심력이 빛의 물리적 궤적을 튕겨내어 정상 세포를 기하학적으로 완벽히 비껴가게(Bypass) 만들 겁니다. 당신들의 칼날 스스로가 정상 조직을 우회하여 암세포에만 박히게 되는 기하학적 궤적을 제시하는 겁니다."

마커스는 이안의 태블릿을 뚫어지게 바라보았다. 이안이 수식을 입력한 시뮬레이션 속에서, 100% 사망 판정이 났던 레이저의 궤적이 마치 강물이 바위를 피해 흐르듯 정상 신경 다발을 매끄럽게 우회하며 종양만을 정확히 타격하는 결과값이 도출되고 있었다.

평생 비주류로 살아온 이론 물리학자의 눈빛에는, 우주의 진리를 목도한 자만이 가질 수 있는 서늘한 확신이 서려 있었다.

"이안 박사." 마커스가 떨리는 목소리로 물었다. "당신의 그 텐서 수식이... 내 딸을 살릴 수 있는 장비를 만들 '이론적 청사진'이란 말이오?"

"제 이론은 주사위 놀이를 하지 않습니다, 회장님." 이안이 확고하게 대답했다. "저는 이론과 방정식을 제공할 뿐입니다. 하지만 회장님의 10만 엘리트 엔지니어들과 막대한 자본이라면, 이 수식을 현실의 '위상 제어 의료기기'로 완벽하게 깎아낼 수 있습니다."

마커스의 턱이 미세하게 떨렸다. 전 세계의 돈과 권력을 쥐고도 절망했던 그에게, 이 차가운 물리학자는 1%의 도박이 아닌 100%의 논리적 희망(가능성)을 제시하고 있었다.

"클로이의 뇌 속 미시 공간에서 벌어질 이 특이점 제어는, 8개월 뒤 거시 우주의 찢어짐을 튕겨낼 거대 방주(Ark)의 '위상 방어막'과 완벽히 같은 물리 법칙입니다."
이안이 마커스를 똑바로 응시했다. "따님을 구하기 위해 제 수식을 증명해 내십시오. 그것이 곧 이 지구를 구하는 증명이 될 겁니다."`;

// 사용자 제공 텍스트 2부 (3장 전반부 대체)
const part2Content = `깊은 침묵이 회장실을 맴돌았다. 마커스는 테이블 위의 시뮬레이션 결과와 낡은 서류 가방을 든 초라한 물리학자를 번갈아 보았다. 평생을 철저한 실용주의자로 살아온 재벌 총수의 눈동자에, 단 한 번도 본 적 없는 거대한 결단이 차오르기 시작했다.

"이안 박사." 마커스의 목소리는 차분했지만, 세계 최고의 기업가다운 거대한 힘이 서려 있었다. "자네가 방금 이 시뮬레이션에서 보여준 기하학적 희망을... 8개월 뒤 저 찢어지는 거대 우주를 향해서도 똑같이 증명해 보일 자신이 있나?"

이안이 묵묵히 고개를 끄덕였다.
밴스가 뒤에 선 비서실장에게 차갑고 단호하게 명령했다.

"오늘부로 아틀라스 코퍼레이션의 모든 상업 프로젝트를 전면 중단한다. 회사의 가용 자산 3천억 달러를 전부 '오디세우스 프로젝트'에 백지수표로 양도해. 그리고 당장 내일부터 의료 공학팀을 제외한 내 회사의 10만 명의 엘리트 엔지니어들은 이안 박사와 세라 수석의 지휘를 받는다."

"회장님! 주주들의 승인 없이는 무리—"

"주주들은 8개월 뒤면 우주 먼지가 될 거다! 내 지시는 절대적이야."
밴스가 이안에게 다가가 맹렬하고 굳게 악수를 청했다.
"내 최고의 엔지니어들이 자네의 위상 수식을 이용해 클로이를 살릴 칼을 벼려내는 동안... 자네와 세라 수석은 이 지구의 인류가 도망칠 방주를 만드시오."

비주류로 쫓겨나 수없는 거절과 문전박대를 당하던 고독한 천재 물리학자의 이론이, 거대한 우연 속에서 가장 논리적이고 절박한 희망을 제시하며 마침내 초거대 자본이라는 거대한 날개를 단 순간이었다.`;

const part3Content = `[본 단락의 서사는 v3.1 시뮬레이션 통합 업데이트로 인해 이전 단락(제 3장 단락 1)으로 완전히 병합되었습니다.]`;

// 문자열 내 버전 인서트 도구 함수
function insertVersion(originalCode, paragraphId, newVersionKey, contentStr, noteStr) {
  const pIndex = originalCode.indexOf(`id: "${paragraphId}"`);
  if (pIndex === -1) return originalCode;

  const versionsIndex = originalCode.indexOf('versions: {', pIndex);
  if (versionsIndex === -1) return originalCode;

  // Insert before the first version or after "versions: {"
  const insertPos = versionsIndex + 'versions: {'.length;
  
  // JSON stringify to safely escape quotes and newlines
  const safeContent = JSON.stringify(contentStr);
  
  const insertText = `
                "${newVersionKey}": {
                  version: "${newVersionKey}",
                  content: ${safeContent},
                  note: "${noteStr}",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                },`;
                
  const newCode = originalCode.slice(0, insertPos) + insertText + originalCode.slice(insertPos);
  
  // activeVersion 갱신
  const activeVerRegex = new RegExp(`(id:\\s*"${paragraphId}"[\\s\\S]*?activeVersion:\\s*")[^"]+(")`);
  return newCode.replace(activeVerRegex, `$1${newVersionKey}$2`);
}

content = insertVersion(content, 'act2_1-ch2-p2', 'v3.1', part1Content, '사용자 수정: 이안의 즉각적인 태블릿 시뮬레이션 시연 및 설득');
content = insertVersion(content, 'act2_1-ch3-p1', 'v3.1', part2Content, '사용자 수정: 3일 뒤 수술 과정 대신 즉각적인 회장의 수락과 투자 승인으로 대체');
content = insertVersion(content, 'act2_1-ch3-p2', 'v3.1', part3Content, '단락 내용이 앞 단락으로 병합됨');

fs.writeFileSync(targetPath, content);
console.log('Successfully updated novelData.ts with v3.1 modifications');
