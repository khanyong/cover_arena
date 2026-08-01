const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const newParagraphs = {
  'act3-ch3-p1': {
    content: `"부품 조달률 30% 미만. 카멜레온 엔진 코어 완성 불가능."\n세라가 절망적인 목소리로 브리핑을 마쳤다. 대재앙까지 남은 시간은 고작 3주. 지구의 모든 국가와 자본이 뭉쳤지만, 미쳐버린 기상 이변과 텐서 붕괴 속에서 직경 5km의 거대 방주 '오디세우스'를 띄우는 것은 물리적으로 불가능했다. 회의장에 모인 세계 정상들의 얼굴에 죽음의 그림자가 드리워졌다.\n\n"우리는 끝났소." 미국 대통령이 이마를 짚었다. "우주 지진의 본진(Main Quake)이 지구를 때리면, 인류는 이 쇳덩어리 무덤 안에서 흔적도 없이 타죽겠군."\n\n"아니요. 방주(Ark)가 실패했다면, 방패(Shield)로 쓰면 됩니다."\n침묵을 깨고 이안이 메인 콘솔로 걸어 나왔다. 그의 눈빛은 1막에서 제네바 가속기 코어의 폭주를 멈춰 세웠던 그 서늘한 천재의 그것으로 빛나고 있었다.\n\n"3년 전, 저는 좁은 가속기 안에서 무한대의 붕괴 특이점을 '정확히 똑같은 힘을 가진 위상 원심력'으로 부딪혀 0으로 완벽히 상쇄(Cancel-out)시켰습니다. 그 프랙탈 원리를 이 지구 스케일로 스케일 업(Scale-up)하는 겁니다."\n이안이 미완성된 오디세우스의 설계도를 붉게 물들였다.\n"우주로 도망치는 엔진을 포기합니다. 대신, 남은 모든 전력을 방주 외벽의 '위상 제어 초전도 코일'에 100만 배로 과부하시켜 쏟아붓습니다. 다가오는 우주 지진의 파동과 정확히 180도 위상($\\Delta \\theta \\approx \\pi$)이 반대인 '거대 인공 우주 지진'을 우리 손으로 직접 쏘아 올리는 겁니다!"\n\n"미쳤어! 행성 크기의 충격파 두 개가 정면충돌하면, 상쇄가 아니라 지구가 통째로 박살 날 거요!" 한 물리학자가 경악하며 소리쳤다.\n"빛과 열의 충돌이라면 그렇겠죠. 하지만 이건 '텐서 기하학'의 충돌입니다!"\n이안이 칠판에 자신의 논문 3편의 연속 방정식 유체 휩쓸림(Advection) 수식을 거침없이 갈겨썼다.\n"완벽한 상쇄 간섭(Destructive Interference)이 일어나는 노드(Node) 지점에서, 에너지는 터지지 않습니다. 극단적인 기하학적 압력 구배가 형성되며, 파멸의 텐서 유체는 마치 모세의 기적처럼 지구를 비껴가며 양옆으로 맹렬히 휩쓸려(Bypass) 나갈 겁니다! 지구 스스로가 우주 지진의 한가운데서 완벽한 '태풍의 눈(안전지대)'이 되는 겁니다!"`,
    note: "v3.0: 오디세우스 엔진 실패와 지구 단위 위상 방어막(Shield)으로의 발상 전환",
    commentary: "오디세우스 엔진 미완성과 이안의 거시적 상쇄 방어막 제안"
  },
  'act3-ch3-p2': {
    content: `3주 뒤, 운명의 날.\n태양계 너머에서 빛의 속도로 날아온 핏빛 초고주파 중력파(FRB)의 쓰나미가 대기권을 덮치기 직전, 하일랜드 지하의 오디세우스 코어가 끔찍한 비명을 지르며 100만 배의 역위상 텐서 에너지를 성층권 밖으로 쏘아 올렸다.\n두 우주적 파동이 지구 상공 100km에서 정면으로 격돌했다.\n\n눈이 멀 것 같은 섬광이 터지리란 예상과 달리, 하늘은 소름 끼치도록 고요해졌다. 무한대에 가까운 핏빛 우주 지진의 쓰나미는 오디세우스가 쏘아 올린 푸른 위상 방어막에 부딪히는 순간, 폭발하지 않고 부드럽게 두 갈래로 갈라졌다. 찢어지는 공간의 파도는 지구를 둥글게 감싸며 완벽하게 미끄러져 우주 저편으로 휩쓸려 나갔다.\n\n수십 년 전 양자역학 교과서에 머물러 있던 '상쇄 간섭'의 원리가, 거대 우주의 재앙을 완벽히 지워버리는 인류 최고의 기하학적 승리로 증명되는 벅찬 순간이었다.`,
    note: "v3.0: 지구를 감싸는 거대 인공 우주 지진과 상쇄 간섭의 기하학적 승리",
    commentary: "운명의 날, 거시적 상쇄 간섭(Destructive Interference) 성공과 태풍의 눈이 된 지구"
  }
};

function insertVersion(originalCode, paragraphId, newVersionKey, contentStr, noteStr, commentaryStr) {
  const searchStr = 'id: "' + paragraphId + '"';
  const pIndex = originalCode.indexOf(searchStr);
  if (pIndex === -1) return originalCode;
  
  // 1. Update commentary
  const commentStr = 'commentary: "';
  const cIndex = originalCode.indexOf(commentStr, pIndex);
  if (cIndex !== -1 && cIndex < pIndex + 500) {
    const cEndIndex = originalCode.indexOf('",', cIndex);
    if (cEndIndex !== -1) {
      originalCode = originalCode.slice(0, cIndex + commentStr.length) + commentaryStr + originalCode.slice(cEndIndex);
    }
  }
  
  // 2. Insert new version
  const versionsIndex = originalCode.indexOf('versions: {', pIndex);
  if (versionsIndex === -1) return originalCode;
  
  const insertPos = versionsIndex + 'versions: {'.length;
  
  // We use string interpolation with proper newlines.
  // Instead of JSON.stringify, let's wrap it in backticks since original texts use backticks.
  // We must escape backticks and ${} inside the content if they exist (they don't in this text).
  const safeContent = JSON.stringify(contentStr);
  
  const insertText = `
                "${newVersionKey}": {
                  version: "${newVersionKey}",
                  content: ${safeContent},
                  note: "${noteStr}",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                },`;
  
  let newCode = originalCode.slice(0, insertPos) + insertText + originalCode.slice(insertPos);
  
  // 3. Update activeVersion
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
    return parts[0] + searchStr + parts[1];
  }
  return newCode;
}

for (const pId in newParagraphs) {
  const item = newParagraphs[pId];
  content = insertVersion(content, pId, 'v3.0', item.content, item.note, item.commentary);
}

content = content.replace(
  'title: "제 3 장: 위상 상쇄 방어막 (-∞ + ∞ = 0)과 공간 파도 서핑"',
  'title: "제 3 장: 오디세우스 엔진 실패와 지구 방어막(Shield) 전환"'
);
content = content.replace(
  'synopsis: "카멜레온 반중력 드라이브(w → -1) 이륙, 거시적 위상 상쇄 방어막 전개로 마이너스 무한대 인력(-∞)을 튕겨내며 완벽한 공간 서핑(Surfing)."',
  'synopsis: "카멜레온 엔진 완성 불가능. 이륙을 포기한 오디세우스를 지구 단위의 위상 방어막으로 전환하여 거시적 상쇄 간섭(Destructive Interference)을 이뤄냄."'
);
content = content.replace(
  '특이점 무한대 인력(-∞)을 위상 원심력(+∞)으로 상쇄(-∞ + ∞ = 0)하며 파도 위를 서핑함.',
  '이륙을 포기하고 지상에서 특이점 무한대 인력(-∞)을 역위상 원심력(+∞)으로 튕겨내는 전지구적 상쇄 간섭(-∞ + ∞ = 0) 방어막을 전개함.'
);

fs.writeFileSync(targetPath, content);
console.log('Successfully updated novelData.ts with v3.0 climax climax changes.');
