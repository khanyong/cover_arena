const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const newParagraphs = {
  // Prologue changes
  'act0-ch2-p2': {
    content: "이안은 보안 요원들을 뿌리치고 메인 콘솔을 향해 몸을 던졌다. 스털링을 거칠게 밀어내고 시스템 제어권을 장악한 그는, 지하 200미터 파이프에 배열된 수만 개의 '위상 제어 자기장 코일'의 물리적 배열을 자신의 기하학적 수식에 맞춰 맹렬한 속도로 강제 재조정(Reversing)하기 시작했다.\n\n$$ \\frac{(\\nabla S)^2}{2m} + Q_s = 0 $$\n\n진폭 $R \\to 0$ 인 마디 지점에서 양자 퍼텐셜 $Q_s$ 는 $-\\frac{\\hbar^2}{2mr^2}$ 의 무한대 인력($-\\infty$)으로 발산한다. 이안이 코일을 통해 물리적으로 주입한 위상($S$) 회전 원심력 항 $+\\frac{\\hbar^2}{2mr^2}$ ($+\\infty$)이 시스템 연산 결과 $-\\infty + \\infty = 0$ 이라는 'Exact Cancellation' 달성 순간이었다.",
    note: "v7.0: 수식 입력에서 위상 제어 자기장 코일의 물리적 재조정으로 변경하여 하드 SF 개연성 강화",
    commentary: "이안의 수식 기반 물리적 제어와 상쇄의 수식 발동"
  },
  'act0-ch3-p1': {
    content: "스털링 교수의 얼굴에는 기적을 목도한 경외감과 깊은 공포가 뒤섞인 창백함이 번지고 있었다.\n\"이안, 넌 해고다.\" 스털링이 떨리는 목소리로 말했다. \"네 이론은 입증되었다. 하지만 그건 인류가 감당할 수 없는 판도라의 상자다. 입자가속기 하나를 구하자고 우주를 구성하는 공간 자체의 뼈대를 건드리는 짓은 미친 짓이야. 너의 그 사이비 기하학은 표준 모형을 무너뜨리고 세상의 질서를 파괴할 거다.\"",
    note: "v7.0: 스털링 교수를 학문적 신념과 공포를 가진 입체적 인물로 변경",
    commentary: "학계의 신념 충돌과 스털링의 공포 섞인 추방 선고"
  },
  
  // Act 1 changes
  'act2-ch1-p2': {
    content: "\"스털링 교수 몰래 가져왔어요. 제임스 웹 우주망원경(JWST)의 1급 기밀 관측 데이터와 최신 펄서 타이밍 어레이(PTA) 기록이에요.\"\n세라가 콘솔에 데이터를 연결하고 시뮬레이션을 가동하자, 낡은 관측소 허공에 심우주의 은하단 이미지가 홀로그램으로 떠올랐다.\n\"이건... 기존의 낡은 표준 모형으로는 도저히 존재할 수 없는 시간대의 고대 은하들입니다. 하지만 진짜 문제는 이거예요.\"\n세라의 조작에 따라 시뮬레이션 필터가 전환되자, 은하 주변의 렌즈 공간이 실시간으로 끔찍하게 찢어지고 뒤틀리는 시각적 결과물이 도출되었다. 이안과 세라는 동시에 숨을 헉 들이켰다.\n\"완벽한 무색채 광학 흐림(Achromatic Blurring) 현상...\" 이안이 중얼거렸다.\n\"빛을 싣고 날아오는 '공간 자체'가 고주파로 진동하고 있기 때문에 렌즈 초점이 완전히 뭉개져 버린 겁니다!\"",
    note: "v3.0: JWST 데이터 분석을 시뮬레이션을 통한 시각적 발견 과정으로 역동성 강화",
    commentary: "시뮬레이션 가동을 통한 무색채 광학 흐림(Achromatic Blurring)의 시각적 발견"
  },
  'act2-ch5-p1': {
    content: "\"세라... 이 극저주파(nHz) 노이즈 기록, 첫 파동이 잡힌 게 언제부터입니까?\"\n\"최초 노이즈는 며칠 전 포착됐어요. 진원지는... 지구로부터 정확히 3광년 밖이고요.\"\n이안의 목소리가 차갑게 떨렸다.\n\"3년 전 제네바에서 찢어낸 거시적 양자 얽힘(t≈0)의 여파로 3광년 밖 공간이 즉각적으로 찢어졌고, 그 파열음(중력파)이 광속(c)을 타고 정확히 3년이 걸려 지금 우리에게 도착한 겁니다.\"\n이안은 아이작슨 고주파 극한 공식으로 노이즈의 껍질을 벗겨냈다. 홀로그램 스크린에 띄워진 3광년 밖의 파형과 3년 전 제네바 특이점 로그가 0.0001%의 오차도 없이 데칼코마니처럼 포개어졌다. 완벽히 인과관계가 일치하는 '위상 동기화(Phase-locking)' 상태였다.\n\"방아쇠를 당긴 건... 3년 전의 나였어.\"",
    note: "v3.0: 3광년 밖 PTA 노이즈의 타임 파라독스를 얽힘(즉각적 찢어짐)과 중력파(광속 이동)로 명확히 해명",
    commentary: "양자 얽힘과 중력파 광속 이동의 인과관계 해명 및 위상 동기화 증명"
  },

  // Act 2 changes
  'act2_1-ch3-p1': {
    content: "깊은 침묵이 회장실을 맴돌았다. 마커스는 테이블 위의 시뮬레이션 결과와 낡은 서류 가방을 든 초라한 물리학자를 번갈아 보았다.\n\"기계를 바꿀 필요 없습니다.\" 이안이 차갑고 단호하게 말했다. \"아틀라스의 초정밀 레이저 기기가 실패한 건 하드웨어 탓이 아닙니다. 완벽한 기계에 '올바른 기하학적 궤도'를 지시할 위상 제어 알고리즘(소프트웨어)이 없었기 때문이죠. 제 수식을 알고리즘으로 주입하십시오. 당신들의 칼날 스스로가 정상 조직을 완벽히 우회하여 암세포에만 박히는 궤적을 제시할 겁니다.\"\n\n평생을 철저한 실용주의자로 살아온 재벌 총수의 눈동자에, 단 한 번도 본 적 없는 거대한 결단이 차오르기 시작했다.\n\"이안 박사. 자네가 방금 이 시뮬레이션에서 보여준 기하학적 희망을... 18개월 뒤 저 찢어지는 거대 우주를 향해서도 똑같이 증명해 보일 자신이 있나?\"\n이안이 묵묵히 고개를 끄덕였다.\n\n밴스가 뒤에 선 비서실장에게 명령했다.\n\"오늘부로 아틀라스 코퍼레이션의 상업 프로젝트를 전면 중단한다. 가용 자산 3천억 달러를 전부 '오디세우스 프로젝트'에 백지수표로 양도해. 내 10만 명의 엘리트 엔지니어들은 이안 박사의 지휘를 받는다. 주주들은 18개월 뒤면 우주 먼지가 될 거다! 내 지시는 절대적이야.\"\n\n비주류로 쫓겨난 고독한 천재 물리학자의 '소프트웨어'가, 마침내 초거대 자본의 '하드웨어'라는 완벽한 날개를 단 순간이었다.",
    note: "v4.0: 하드웨어 결함이 아닌 소프트웨어(위상 알고리즘) 결핍 해결로 기계적 개연성 강화 및 카운트다운 통일",
    commentary: "소프트웨어 결핍 해결로 기계적 개연성을 확보한 이안과 마커스의 초거대 자본 투자 승인"
  },

  // Act 3 changes
  'act2_5-ch1-p3': {
    content: "스위스 제네바 UN 본부 긴급 대책 회의. 전 세계 정상들의 스크린에 마리아나 해구 바다 역류와 롯데월드타워 붕괴 영상이 재생되었다.\n스털링 교수가 땀범벅이 되어 보고했다.\n\"이건 거시적인 자기장 역전(Magnetic Reversal) 현상과 대규모 지각 변동이 우연히 겹친 결과입니다! 기존 지구물리학으로 설명이 가능합니다!\"\n\n\"개소리 집어치우시오!\"\n회의장 뒷문을 걷어차고 미 국방부 장관의 호위 속에 이안과 세라가 난입했다.\n\"자기장 역전이요? 이 데이터를 보시죠.\"\n이안이 띄운 홀로그램 스크린에, 런던발 뉴욕행 보잉 777 여객기의 비행 로그가 떠올랐다.\n\"이 여객기는 대서양 한가운데서 연료 소모 '제로' 상태로 3천 킬로미터를 0초 만에 텔레포트했습니다! 승객들은 커피 한 방울도 흘리지 않았고요. 당신들의 낡은 지구물리학과 중력 방정식은 이미 처참히 붕괴되었습니다!\"\n\n미국 대통령이 창백한 얼굴로 명령했다.\n\"스털링 교수, 당장 물러나시오. 이안 박사... 보이지 않는 적이 전 세계 중력과 공간을 주무르고 있소. 우리에게 얼마나 남았소?\"",
    note: "v3.0: 스털링의 합리적 지구물리학 방어와 이안의 여객기 텔레포트 데이터를 통한 쾌감 넘치는 논파",
    commentary: "기존 물리학의 붕괴를 입증하는 여객기 텔레포트 데이터와 스털링 논파"
  },

  // Act 4 changes
  'act3-ch4-p2': {
    content: "물리적 질량(로켓)이 아닌, 텅 빈 공간의 텐서(암흑 물질)를 통제하여 천체의 궤도를 주무르겠다는 신(God)의 영역에 도전하는 선언이었다.\n마커스 회장이 피가 흐르는 주먹을 꽉 쥐며 외쳤다.\n\"해봅시다, 이안 박사. 우주가 우리에게 던진 이 미친 달덩어리의 목줄을, 인간의 수식으로 묶어버립시다!\"\n\n며칠 뒤, L1 라그랑주점에 텐서 유체가 극도로 밀집되며 보이지 않는 거대한 인공 중력 우물(Gravity Well)이 형성되었다. 인공 중력 닻이 거대한 달을 억지로 붙잡아 세우는 순간, 지구 전역에는 극단적인 조석력(Tidal force)이 발생했다.\n전 세계의 바다가 수백 미터 높이로 요동치며 해안선을 집어삼키고 거대한 해일이 대륙을 강타했지만... 지구라는 행성 자체가 부서지는 끔찍한 질량 충돌만은 면할 수 있었다. 거시 우주의 뼈대를 재조립한 인류의 처절하고 위대한 승리였다.",
    note: "v4.0: 달 주차 과정에서 발생한 처절한 부작용(극단적 조석력과 메가 쓰나미) 묘사 추가",
    commentary: "달을 주차시킨 인공 암흑 물질 닻과 그 대가로 발생한 극단적 조석력의 해일"
  },

  // Epilogue changes
  'epilogue-ch3-p1': {
    content: "이안의 조작에 따라 방주 오디세우스의 위상 제어 코일이 굉음을 내며 가동되었다. 이번에는 다가오는 위협을 튕겨내거나 중력을 만드는 것이 아니었다.\n\"질량-에너지 등가원리(E=mc²).\" 이안이 선언했다. \"지구를 덮쳤던 우주 지진의 막대한 텐서 에너지를 방어막으로 튕겨낼 때, 오디세우스의 초전도 축전기 배터리에는 엄청난 잉여 에너지가 흡수되어 저장되었습니다. 이 막대한 에너지를 물리적 질량으로 변환하는 겁니다.\"\n\n방주 전방의 대기권 상공, 완벽하게 텅 빈 허공의 텐서 유체가 거대한 나선형을 그리며 뒤틀리기 시작했다. 공간 자체가 720도(4π)로 맹렬하게 꼬이며 절대 풀리지 않는 기하학적 매듭(n=1)이 형성되는 순간, 눈이 멀 듯한 푸른 섬광과 함께 기적이 일어났다.\n허공에서 아무것도 없던 진공 상태를 뚫고, 가장 순수하고 깨끗한 맑은 물(H₂O)과 산소가 폭포수처럼 쏟아져 내리기 시작한 것이다.\n\n\"맙소사...\" 세라가 쏟아지는 물줄기를 보며 두 손으로 입을 틀어막았다.\n마커스 회장을 비롯해 스크린 너머로 이 광경을 지켜보던 전 세계 생존자들이 환호성을 질렀다. 잿빛 대지를 적시는 생명의 비는 인류가 더 이상 우주의 변덕에 휘둘리는 무력한 존재가 아님을 증명하고 있었다.\n\n멸망의 위기를 견뎌낸 인류는 이제 방어자를 넘어섰다. 시공간의 기하학적 구조를 이해하고, 텅 빈 진공에서 별과 생명의 씨앗을 직조해 내는 자들. 진정한 '시공간의 건축가(Architects of Space-Time)'로 거듭난 인류는 상처 입은 지구를 치유하며 새로운 우주의 창세기를 써 내려가기 시작했다.",
    note: "v4.0: E=mc² 원리를 기반으로 우주 지진 방어 시 축적된 에너지를 질량 창조에 사용하여 하드 SF 핍진성 완성",
    commentary: "축적된 우주 지진 에너지를 활용한 무에서의 물질(물, 산소) 창조와 진정한 시공간의 건축가 탄생"
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
  content = insertVersion(content, pId, item.note.substring(0, 4), item.content, item.note, item.commentary);
}

// Global replace of "8개월" with "18개월" where appropriate (excluding numbers ending in 18개월 like 18개월)
// Safest way is just replacing "고작 8개월" -> "고작 18개월" and "예언하고 8개월" -> "예언하고 18개월"
content = content.replace(/8개월/g, '18개월');
// Fix any "118개월" if it happened
content = content.replace(/118개월/g, '18개월');

fs.writeFileSync(targetPath, content);
console.log('Successfully updated novelData.ts with detailed Hard SF refinements.');
