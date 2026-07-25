const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const act2Data = {
  'act2-ch1-p1': '"시동(Startup). 점화(Ignition). 가속(Acceleration)." 세라의 건조한 음성이 텅 빈 관제실을 채웠다. 스타카토처럼 짧게 끊어지는 카운트다운 속에서, 입자가속기 내부의 위상 압력은 폭발 직전의 활화산처럼 끓어오르고 있었다.',
  'act2-ch1-p2': '"수식의 오차 0.0001%가 인류를 이 기하학적 감옥에 영원히 가둘 것이다." 세라의 손끝이 콘솔 위에서 미세하게 떨렸다. 그녀의 어깨를 짓누르는 것은 단순한 기계적 중압감이 아닌, 인류 전체의 명운이 걸린 벼랑 끝의 공학적 무게였다.',
  'act2-ch2-p1': 'POINTING 프로토콜이 발동된 순간, 도시 전체에 초거대 우주 지진(FRB)의 여파가 들이닥쳤다. 땅이 흔들린 것이 아니었다. 대기의 공간 자체가 고무줄처럼 팽팽하게 길게 늘어났다가 기괴하게 수축하는 끔찍한 현상이었다.',
  'act2-ch2-p2': "빌딩 사이의 거리가 일그러지고, 수평선이 기괴한 곡선으로 휘어져 내렸다. 시민들은 단순한 어지러움을 넘어, 물리 법칙 자체가 붕괴하며 발생하는 내장 깊숙한 곳의 역겨움, 즉 '비유클리드적 구역질(Non-Euclidean Nausea)'에 사로잡혀 거리에 쓰러졌다.",
  'act2-ch3-p1': '"보십시오! 이것이 우리가 살고 있는 껍데기입니다!" 이안이 깨진 유리창 너머로 뒤틀리는 하늘을 보며 소리쳤다. "우주는 결코 아름다운 상수가 아닙니다. 분노하고 요동치며 찢어지는 거대한 유체(Fluid)란 말입니다!"',
  'act2-ch3-p2': "세라는 이안의 절규를 등진 채, 핏발 선 눈으로 흔들리는 모니터의 진동 계수를 필사적으로 보정하고 있었다. 이안의 비명을 현실의 단단한 지면에 접지(Grounding)시켜야만, 이 무자비한 공간의 폭주를 제어할 수 있다는 것만이 그녀의 유일한 진실이었다.",
  
  'act2_1-ch1-p1': "전 세계가 시공간의 끔찍한 멀미에 신음할 때, 아틀라스 코퍼레이션의 철옹성 같은 펜트하우스는 섬뜩하리만치 고요했다. 마커스 밴스 회장은 식어가는 10살짜리 딸 클로이의 창백한 손을 쥔 채, 천문학적인 자본으로도 꺾지 못한 죽음의 그림자 앞에 무너져 있었다.",
  'act2_1-ch1-p2': '"현대 의학은 실패했습니다." 주치의의 목소리가 사형 선고처럼 울렸다. "종양이 신경망을 너무 깊이 파고들었습니다. 빛이 일직선으로 나아가는 물리적 한계 탓에, 암세포를 도려내려다 정상 뇌세포까지 연쇄 붕괴하여 즉사하게 될 겁니다."',
  'act2_1-ch2-p1': "그때, 굳게 닫힌 회장실 문을 거칠게 열고 이안이 걸어 들어왔다. 그의 푹 패인 두 눈동자는 막 우주의 가장 깊은 심연을 맨눈으로 들여다본 자 특유의 서늘한 광기로 번뜩이고 있었다.",
  'act2_1-ch2-p2': '"회장님, 빛의 궤적을 억지로 굽혀버릴 수 있다면 어쩌시겠습니까?" 이안이 테이블 위에 낡은 태블릿을 던지듯 올려놓았다.',
  'act2_1-ch3-p1': "시뮬레이션 화면 속에서 경이로운 광경이 펼쳐졌다. 레이저 빛이 암세포 주변의 텅 빈 공간을 휘감고 도는 '위상 소용돌이(Topological Vortex)'를 타고, 건강한 뇌신경 다발을 강물처럼 부드럽게 굽이쳐 우회하고 있었다. 공간의 곡률 자체를 지배하여 치명적인 궤적을 튕겨내는 기하학적 마법이었다.",
  'act2_1-ch3-p2': '"클로이의 뇌 속 좁은 공간을 튕겨내는 이 원리가, 바로 우리가 탈출할 거대 방주의 위상 방어막입니다." 이안의 눈빛이 마커스의 영혼을 꿰뚫었다. 철저한 실용주의자였던 밴스 회장의 눈동자에, 인류를 구원할 기하학적 희망을 향한 3천억 달러짜리 거대한 결단이 끓어오르고 있었다.'
};

function insertVersion(originalCode, paragraphId, newVersionKey, contentStr, noteStr) {
  const searchStr = 'id: "' + paragraphId + '"';
  const pIndex = originalCode.indexOf(searchStr);
  if (pIndex === -1) return originalCode;
  const versionsIndex = originalCode.indexOf('versions: {', pIndex);
  if (versionsIndex === -1) return originalCode;
  const insertPos = versionsIndex + 'versions: {'.length;
  const safeContent = JSON.stringify(contentStr);
  const insertText = '\n                "' + newVersionKey + '": {\n                  version: "' + newVersionKey + '",\n                  content: ' + safeContent + ',\n                  note: "' + noteStr + '",\n                  createdAt: "' + new Date().toISOString().slice(0, 16).replace('T', ' ') + '"\n                },';
  const newCode = originalCode.slice(0, insertPos) + insertText + originalCode.slice(insertPos);
  
  const parts = newCode.split(searchStr);
  if (parts.length > 1) {
    const subParts = parts[1].split('activeVersion: "');
    if (subParts.length > 1) {
      const activeVerEnd = subParts[1].indexOf('"');
      if (activeVerEnd !== -1) {
        subParts[1] = newVersionKey + subParts[1].substring(activeVerEnd);
        parts[1] = subParts.join('activeVersion: "');
      }
    }
    return parts.join(searchStr);
  }
  return newCode;
}

for (const pId in act2Data) {
  content = insertVersion(content, pId, 'v4.0', act2Data[pId], 'v4.0: 수식 배제 및 감각적 비유(Sense of Wonder) 극대화');
}

fs.writeFileSync(targetPath, content);
console.log('Successfully updated Act 2 and 2.1 with v4.0 sensory texts');
