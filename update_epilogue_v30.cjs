const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const newParagraphs = {
  'epilogue-ch1-p1': {
    content: `달이 새로운 궤도에 안착하고 1년이 지났다. 인류는 우주 지진의 직격과 달의 추락이라는 두 번의 거대한 멸망 위기를 기하학의 힘으로 극복해냈다.\n하지만 승리의 대가는 가혹했다. 핏빛 우주 지진의 여파와 거대 쓰나미, 전 지구적 화산 폭발로 인해 지구의 대기는 유독한 재로 뒤덮였고, 바다는 오염되었으며, 비옥했던 토양은 불타버렸다.\n\n메인 브릿지 밖, 회색빛으로 물든 척박한 지구의 대지를 내려다보던 세라가 입을 열었다.\n"이안... 우리는 살아남았어요. 하지만 너무 많은 것을 잃었죠. 식수 정화 시스템은 한계에 달했고, 방사능과 화산재 때문에 작물은 자라지 않아요. 우주의 재난은 막아냈지만, 결국 우리는 이 병든 지구 위에서 서서히 굶어 죽게 될지도 몰라요."\n세라의 목소리에는 무거운 절망이 배어 있었다. 파괴된 지구의 자원만으로는 인류의 생존과 문명 재건이 불가능해 보였다.`,
    note: "v3.0: 재난 이후 파괴된 지구의 생태계와 자원 고갈 위기",
    commentary: "상처 입은 지구와 문명 재건의 막막함, 세라의 절망"
  },
  'epilogue-ch2-p1': {
    content: `"세라. 100년 전의 낡은 물리학은 자원을 얻기 위해 땅을 파고 물질을 쪼갰습니다. 주어진 물질을 소비할 줄만 알았지, 없는 것을 만들어낼 수는 없었죠."\n이안은 미소 지으며 메인 콘솔의 홀로그램을 작동시켰다. 스크린에 그가 은둔 시절 완성했던 마지막 네 번째 논문의 수식이 찬란하게 떠올랐다.\n\n💡 [이안의 홀로그램 스크린: 스카름 위상 감김과 물질 창조]\n- 텅 빈 공간을 엮어 물질(Baryon)을 창조하는 기하학적 조형 공식:\nB = (1 / 24π²) ∫ d³x ε_ijk Tr(L_i L_j L_k) = n  (n ∈ ℤ)\n\n"하지만 물질은 알갱이가 아닙니다. 저 텅 빈 공간의 유체들이 특정한 위상으로 얽히고설킨 '매듭(Knot)'일 뿐입니다."\n이안의 손가락이 허공에 홀로그램 매듭을 지어 보였다.\n"공간 유체의 흐름을 3차원적으로 완벽하게 맞물려, 절대 풀리지 않는 위상학적 자물쇠인 '감김 수(Winding Number, n=1)'를 만들어 낸다면... 우리는 더 이상 지구의 자원을 갉아먹을 필요가 없습니다. 텅 빈 유체를 720도(4π)로 비틀어 꼬아 무(無)의 허공에서 깨끗한 질량을 직접 빚어낼 겁니다."`,
    note: "v3.0: 물질은 공간의 매듭이라는 깨달음과 4부 논문 수식을 통한 질량 창조 선언",
    commentary: "채굴이 아닌 '창조'의 선언, 이안의 4번째 논문 위상 감김 수식"
  },
  'epilogue-ch3-p1': {
    content: `이안의 조작에 따라 방주 오디세우스의 위상 제어 코일이 굉음을 내며 가동되었다. 이번에는 다가오는 위협을 튕겨내거나 중력을 만드는 것이 아니었다.\n방주 전방의 대기권 상공, 완벽하게 텅 빈 허공의 텐서 유체가 거대한 나선형을 그리며 뒤틀리기 시작했다.\n\n공간 자체가 720도(4π)로 맹렬하게 꼬이며 절대 풀리지 않는 기하학적 매듭(n=1)이 형성되는 순간, 눈이 멀 듯한 푸른 섬광과 함께 기적이 일어났다.\n허공에서 아무것도 없던 진공 상태를 뚫고, 가장 순수하고 깨끗한 맑은 물($H_2O$)과 산소가 폭포수처럼 쏟아져 내리기 시작한 것이다.\n\n"맙소사..." 세라가 쏟아지는 물줄기를 보며 두 손으로 입을 틀어막았다.\n마커스 회장을 비롯해 스크린 너머로 이 광경을 지켜보던 전 세계 생존자들이 환호성을 질렀다. 잿빛 대지를 적시는 생명의 비는 인류가 더 이상 우주의 변덕에 휘둘리는 무력한 존재가 아님을 증명하고 있었다.\n\n멸망의 위기를 견뎌낸 인류는 이제 방어자를 넘어섰다. 시공간의 기하학적 구조를 이해하고, 텅 빈 진공에서 별과 생명의 씨앗을 직조해 내는 자들. 진정한 '시공간의 건축가(Architects of Space-Time)'로 거듭난 인류는 상처 입은 지구를 치유하며 새로운 우주의 창세기를 써 내려가기 시작했다.`,
    note: "v3.0: 허공에서 물과 산소를 창조하여 지구를 치유하는 시공간의 건축가들",
    commentary: "매듭에서 쏟아지는 폭포수, 병든 지구를 치유하며 창조주로 거듭난 인류의 새로운 창세기"
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

// Update Epilogue metadata
content = content.replace(
  'story: "다중 우주로 도약한 오디세우스. 물질 하나 없는 진공 아기 우주에서 이안이 4번째 논문의 스카름 감김 수 수식을 가동. 방주 전면 위상 제어기로 텅 빈 공간 유체를 720도(4π)로 비틀어 꼬아 절대 풀리지 않는 수학적 매듭(n=1)을 만들어 첫 번째 수소 원자를 창조함. 인류가 시공간의 건축가(창조주)로 거듭나며 원작 논문 4부작 아카이브(DOI: 10.5281/zenodo.21438016)와 함께 대단원의 막을 내림."',
  'story: "우주 지진과 달의 추락을 막아내고 살아남은 인류. 그러나 파괴된 생태계와 자원 고갈이라는 현실적 절망이 찾아옴. 이안이 4번째 논문의 스카름 감김 수 수식을 가동해, 방주 위상 제어기로 텅 빈 공간 유체를 720도(4π)로 비틀어 꼬아 허공에서 깨끗한 물과 산소를 창조함. 인류가 상처 입은 지구를 직접 치유하는 진정한 시공간의 건축가(창조주)로 거듭나며 대단원의 막을 내림."'
);

content = content.replace(
  'title: "제 1 장: 낯선 암흑 우주와 세라의 질문"',
  'title: "제 1 장: 상처 입은 지구와 세라의 절망"'
);
content = content.replace(
  'synopsis: "위상 절단 후 물질도 빛도 없는 텅 빈 3차원 공간 진동 유체의 닫힌 아기 우주에 멈춰 선 오디세우스와 세라의 생존에 대한 불안."',
  'synopsis: "달을 주차시키고 살아남았으나, 재난의 여파로 생태계가 붕괴되고 자원이 고갈된 지구를 보며 절망하는 세라."'
);
content = content.replace(
  'synopsis: "물질은 알갱이가 아니라 공간 유체의 기하학적 매듭(Knot). 이안의 4번째 논문(강입자 스카름 감김 수) 홀로그램 공개."',
  'synopsis: "물질은 알갱이가 아니라 공간 유체의 기하학적 매듭(Knot). 파괴된 자원에 얽매이지 않고 허공에서 질량을 창조하겠다는 4번째 논문 수식 공개."'
);
content = content.replace(
  'title: "제 3 장: 최초 수소 원자의 창조와 시공간의 건축가들"',
  'title: "제 3 장: 생명의 비 창조와 시공간의 건축가들"'
);
content = content.replace(
  'synopsis: "방주 전면 위상 제어기로 전방 100km 진공 공간을 720도(4π) 회전 비틀어 첫번째 수소 원자 섬광 창조. 인류가 시공간의 건축가로 각성."',
  'synopsis: "대기권 상공의 텅 빈 공간 유체를 720도(4π) 회전 비틀어 허공에서 순수한 물과 산소를 창조함. 지구를 치유하는 시공간의 건축가로 각성."'
);

fs.writeFileSync(targetPath, content);
console.log('Successfully updated novelData.ts with v3.0 Epilogue changes.');
