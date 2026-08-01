const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const newParagraphs = {
  'act3-ch4-p1': {
    content: `"해냈어! 텐서 마찰 수치가 0으로 떨어집니다! 지구가... 우리가 우주 지진을 막아냈어요!"\n세라가 눈물을 터뜨리며 주저앉았고, 오디세우스 통제실과 제네바 UN 본부의 스크린 너머로 전 세계의 환호성이 터져 나왔다. 인류가 우주의 압도적인 파멸 법칙을 인간의 기하학적 지성으로 이겨낸 위대한 승리의 순간이었다.\n\n이안 역시 땀에 젖은 이마를 짚으며 안도의 한숨을 내쉬었다. 하지만 그가 축배의 잔을 들기도 전, 그의 눈동자가 홀로그램 모니터의 우주 공간 그리드를 훑다가 차갑게 굳어버렸다. 상쇄 장벽이 보호한 '안전 구역(태풍의 눈)'의 반경은 고작 지구 상공 10만 킬로미터에 불과했다.\n\n"세라... 달(Moon)의 궤도 데이터를 띄우세요. 당장!"\n이안의 다급한 외침에 통제실의 환호가 일순간 멎었다. 세라가 급히 달의 레이더 좌표를 스크린 중앙에 띄웠다. 그리고 모두가 숨을 헉 들이켰다.\n\n지구에서 38만 킬로미터 떨어져 있던 달은, 안전 구역 바깥에 무방비로 노출되어 있었다. 지구를 비껴간 우주 지진의 파멸적인 휩쓸림 에너지가 달이 얹혀 있던 공간의 텐서를 정통으로 찢어발기고 지나간 것이다.\n\n[경고. 달의 공전 궤도 이탈. 이심률 붕괴 중.]\n붉은 경고창이 무자비하게 깜빡였다. 공간의 곡률(중력장)이 붕괴되자, 질량 7천경(京) 톤의 거대한 달이 45억 년간 머물던 궤도에서 미끄러져 내려와, 무시무시한 가속도로 지구를 향해 나선형으로 추락하기 시작했다.\n\n"맙소사..." 마커스 회장이 텅 빈 눈으로 하늘을 가리켰다.\n통제실의 투명한 돔 천장 너머로, 평소의 수십 배 크기로 거대해진 핏빛 달이 지구의 대기권을 짓누를 듯 덮쳐오고 있었다.\n우주 지진이라는 보이지 않는 기하학적 재난을 막아냈더니, 이번엔 눈앞에 보이는 압도적인 질량의 폭격이 날아오고 있었다. 달의 인력이 급격히 가까워지자, 수십 미터 높이의 메가 쓰나미가 태평양 연안의 도시들을 집어삼키기 시작했고 지축이 뒤틀리며 전 세계의 화산들이 비명을 지르며 터져 나왔다.`,
    note: "v3.0: 우주 지진의 여파로 궤도를 이탈해 지구로 추락하는 달",
    commentary: "두 번째 절망: 궤도를 이탈하여 나선형으로 추락하는 거대한 핏빛 달"
  },
  'act3-ch4-p2': {
    content: `"충돌까지 남은 시간, 72시간!"\n세라가 패닉에 빠진 목소리로 외쳤다. "상쇄 코일의 전력은 바닥났어요! 핵미사일 수만 발을 쏴도 저 질량을 밀어낼 순 없습니다! 끝이에요. 지구는 저 달에 부딪혀 산산조각 날 겁니다!"\n전 세계의 리더들이 다시 한번 절망의 나락으로 떨어졌다. 이안은 입술을 깨물며 칠판으로 달려갔다. 달을 물리적으로 부술 수 없다면, 달을 붙잡는 '공간'을 창조해야 했다. 그는 자신의 2부 논문, 우주상수를 폐기하고 암흑 물질의 정체를 밝혔던 '카멜레온 전이 함수' 수식을 미친 듯이 전개했다.\n\n💡 [이안의 칠판: 인공 암흑 물질 중력 닻 (Gravity Anchor)]\n텐서 유체를 국소적으로 응축하여 거대한 '유효 질량(M_{eff})'을 창조하는 공식.\n$$M_{eff}(r) = M_{visible}(r) + \\frac{4\\pi}{c^2} \\int_0^r \\langle \\tilde{V}_{00} \\rangle \\sqrt{g_{rr}} r'^2 dr'$$\n\n"달을 밀어낼 필요 없습니다."\n이안이 분필이 부러져라 칠판을 내리찍으며 돌아서서 소리쳤다.\n"달이 추락하는 이유는 지구와의 궤도 공간이 헐거워졌기 때문입니다. 그렇다면, 우리가 직접 허공에 '거대한 중력의 닻(Gravity Anchor)'을 만들어 달의 목줄을 묶어버리면 됩니다."\n\n"중력을 만들자고요? 질량도 없는 텅 빈 허공에요?" 스털링 교수가 화면 너머에서 경악했다.\n"제 논문 2편에서 증명했잖습니까! 암흑 물질($w \\approx 0$)은 정체불명의 입자가 아니라, 텅 빈 공간에 텐서 파동이 갇혀 '정상파(Standing wave)'로 응축된 기하학적 잉여 질량입니다!"\n이안이 달과 지구 사이의 텅 빈 우주 공간 특정 좌표를 붉게 표시했다.\n"방주 오디세우스의 위상 제어 코일 잔여 전력을 모두 모아, 저 L1 라그랑주점 허공에 텐서 파동을 극도로 밀집시킵니다. 텅 빈 우주 공간에 인위적인 '카멜레온 상전이'를 일으켜, 보이지 않는 거대한 암흑 물질 질량 덩어리를 직조해 내는 겁니다! 그 인공 중력 우물(Gravity Well)이 지구 대신 달을 끌어당겨 추락을 멈추고, 새로운 궤도에 달을 강제로 주차(Parking)시킬 겁니다!"\n\n물리적 질량(로켓)이 아닌, 텅 빈 공간의 텐서(암흑 물질)를 통제하여 천체의 궤도를 주무르겠다는 신(God)의 영역에 도전하는 선언이었다.\n마커스 회장이 피가 흐르는 주먹을 꽉 쥐며 외쳤다.\n"해봅시다, 이안 박사. 우주가 우리에게 던진 이 미친 달덩어리의 목줄을, 인간의 수식으로 묶어버립시다!"`,
    note: "v3.0: 인공 암흑 물질 중력 닻(Gravity Anchor)을 통한 달의 강제 주차 선언",
    commentary: "인공 암흑 물질 중력 닻(Gravity Anchor)으로 달을 붙잡는 위대한 스케일 업"
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
  
  // Backtick formatting to prevent Next.js parsing issues with raw \n
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

// Update chapter 4 title & synopsis
content = content.replace(
  'title: "제 4 장: 거시적 위상 절단 (Topological Pinch-off)과 다중 우주(Multiverse)의 탄생"',
  'title: "제 4 장: 떨어진 위성과 텐서의 닻 (인공 암흑 물질)"'
);
content = content.replace(
  'synopsis: "거시적 위상 절단(Macroscopic Topological Pinch-off)으로 낡은 우주의 기하학적 탯줄을 스스로 끊어내고, 새로운 닫힌 우주 자가 팽창 및 다중 우주(Multiverse)의 탄생 선언 피날레."',
  'synopsis: "우주 지진의 여파로 공전 궤도를 이탈하여 지구로 추락하는 달. 인공 암흑 물질 중력 닻(Gravity Anchor)을 창조하여 달을 주차시키려는 이안의 선언."'
);

fs.writeFileSync(targetPath, content);
console.log('Successfully updated novelData.ts with Act 3.5 Moon Crash changes.');
