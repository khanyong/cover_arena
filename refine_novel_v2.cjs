const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const newParagraphs = {
  // Act 3, Chapter 3 (Idea 3: Decoherence to survive)
  'act2_5-ch3-p4': {
    content: "\"하지만 이안, 거시 세계에서는 질량 관성에 의해 양자 진동이 철저히 억제(Inertial Suppression)되잖아요. 수백 톤 여객기가 어떻게 관성을 무시하고 양자 현상을 겪을 수 있죠?\"\n세라의 떨리는 질문에 이안이 대답했다.\n\"우주적 스케일의 압축 유입(Compressive Influx) 때문입니다. 3광년 밖 우주 단층 파열의 광대한 텐서 파동 에너지가, 3년 전 우리가 제네바에서 열어버린 미세 위상 튜브를 타고 지구 국소 좌표로 초고밀도 강제 펌핑(Pumping)되어 들어오고 있습니다.\"\n\n지하 기지가 미세하게 진동하며, 천장의 조명들이 불길하게 깜빡거렸다. 지상의 모든 물리 법칙이 붕괴되어 가고 있다는 무언의 공포가 연구원들의 숨통을 조여왔다.\n\"대서양 상공의 공간 밀도(Tensor Density)가 임계치를 과도하게 초과하면서, 3차원 공간 자체가 '거대 질량의 관성을 찢어버릴 만큼 극단적인 미시적 양자 상태'로 강제 상전이(Phase Transition)를 일으킨 겁니다. 비행기가 먼지처럼 가벼워진 게 아니라, 지구 전체가 거대한 양자 요동의 압력솥이 되었습니다!\"\n\n\"그럼... 우리가 있는 이 아틀라스 지하 기지도 당장 증발하거나 벽 속으로 텔레포트 될 수 있다는 거군요.\" 마커스 회장이 창백한 얼굴로 물었다. \"어떻게 막아야 합니까?\"\n\"기지 주변에 1만 도가 넘는 '고온 플라즈마 막(열역학적 노이즈)'을 방출해 강제로 위상 난류(Phase Turbulence)를 일으켜야 합니다!\"\n이안이 메인 콘솔의 붉은 스위치들을 거칠게 올려치며 외쳤다. \"미쳐버린 텐서 유체를 열에너지로 끓여버리면, 강제적인 결어긋남(Decoherence)이 발생합니다. 우리 기지만 양자 얽힘에서 빠져나와 닻을 내리듯 고전 역학의 현실에 남을 수 있습니다. 이것이 텐서-열역학 스케일링 법칙(Tensor-Thermodynamic Scaling Law)입니다. 본진(Main Quake)이 오기 전 서둘러야 합니다!\"",
    note: "v4.0: 양자 압력솥의 공포감 고조 및 열역학적 결어긋남(Decoherence)을 통한 생존 개연성 추가",
    commentary: "거시적 양자 도약의 공포와 열역학적 위상 난류를 통한 생존 해명"
  },

  // Act 4, Chapter 3 (Idea 1 & 2: Stripe melting & Algebraic cancellation)
  'act3-ch3-p2': {
    content: "3주 뒤, 운명의 날.\n태양계 너머에서 빛의 속도로 날아온 핏빛 초고주파 중력파(FRB)의 쓰나미가 지구의 대기권을 짓누르기 시작했다. 하늘이 피를 머금은 듯 붉게 물들고, 대지가 짐승처럼 울부짖었다. 이안이 땀에 젖은 손으로 오디세우스의 위상 제어 초전도 코일에 100만 배의 전력을 쏟아붓는 순간, 통제실 전체에 새빨간 경고등이 미친 듯이 점멸했다.\n\n\"안 돼요! 전력이 코일로 넘어가지 않습니다!\" 세라가 스크린을 부여잡고 비명을 질렀다. \"지구를 짓누르는 거대한 우주 지진의 중력 압박(2D Squeezing) 때문에 코일의 텐서 그리드가 으스러지고 있어요! '1D 위상-미끄러짐 벽(Phase-slip walls)', 즉 전하 줄무늬(Charge Stripe) 결함이 생겨났습니다! 초전도 현상이 붕괴되고 방어막이 꺼지려 합니다!\"\n다 잡아놓은 인류의 생명줄이 끊어지려는 찰나, 이안은 절망하는 대신 오디세우스 외벽의 거대한 레이저 포대(Optical Pump) 시스템을 수동으로 전개했다.\n\n\"긴즈버그-란다우(Ginzburg-Landau) 방정식을 물리적으로 증명할 때입니다!\"\n이안이 타는 듯한 목소리로 외쳤다. \"코일 표면에 강력한 광학 펄스(빛)를 맹렬하게 쏘아, 저 징그러운 줄무늬(Stripe) 패턴들을 강제로 녹여버리세요(Melting)! 방해물이 증발한 그 찰나의 틈을 타, 일시적으로 극대화된 층간 조셉슨 초전도(Transient Josephson Coherence)를 터뜨리는 겁니다!\"\n세라가 메인 오버라이드 스위치를 내리찍자, 눈이 멀 듯한 순백의 광학 레이저가 방주의 코일을 맹렬히 강타했다. 줄무늬 결함이 안개처럼 증발하는 순간, 억눌려 있던 에너지가 해방되며 상상도 못할 거대한 푸른빛의 초거대 위상 방어막(Anti-vortex)이 성층권을 뚫고 솟구쳐 올랐다.\n\n마침내 우주 지진의 핏빛 파도(Vortex)와 오디세우스의 푸른 방어막이 상공 100km에서 정면으로 격돌했다.\n두 우주의 힘이 부딪히는 순간, 하늘이 찢어지는 폭발음이 지구를 집어삼키리란 예상과 달리... 세상은 소름 끼치도록 고요해졌다. 두 거대한 공간의 소용돌이가 서로 부드럽게 얽혀 들어가더니, '위상 기울기가 0으로 대수적 상쇄(Algebraic Cancellation)'를 이루었다. 핏빛 하늘의 찢어짐이 마치 허공에 달린 거대한 지퍼가 닫히듯 완벽하고 고요하게 소멸(Annihilation)해 갔다.\n절망의 텐서 유체는 기하학적 압력 구배에 밀려 마치 모세의 기적처럼 지구를 둥글게 비껴가며 맹렬히 휩쓸려 나갔다. 낡은 양자역학 교과서 속 '상쇄 간섭'의 원리가, 거대 우주의 재앙을 춤추듯 지워버린 인류 최고의 기하학적 기적이었다.",
    note: "v5.0: 위상 미끄러짐 결함 위기와 광학 펄스 극복, 그리고 소름 끼치도록 고요한 대수적 상쇄(지퍼) 묘사 추가",
    commentary: "광학 펄스를 통한 결함 극복과 고요한 대수적 상쇄(Algebraic Cancellation)의 기적"
  },

  // Act 4, Chapter 4 (Idea 4: Topological Pinch-off & Moon Falling)
  'act3-ch4-p1': {
    content: "\"해냈어! 텐서 마찰 수치가 0으로 떨어집니다! 지구가... 우리가 우주 지진을 막아냈어요!\"\n세라가 오열하며 주저앉았고, 오디세우스 통제실과 전 세계의 피난처 스크린 너머로 터질 듯한 환호성이 메아리쳤다. 인류가 우주의 압도적 파멸을 지성으로 꺾어버린 위대한 승리였다.\n\n하지만 안도의 한숨을 내쉬던 이안의 핏발 선 눈동자가 모니터를 훑다가 차갑게 얼어붙었다. 상쇄 장벽이 보호한 '안전 구역' 바깥, 우주 지진이 비껴간 태양계 외곽의 빈 공간에서 끔찍하고도 경이로운 거시적 파열이 진행되고 있었다.\n\"맙소사...\" 이안이 창백하게 질린 쉰 목소리로 중얼거렸다. \"엄청난 텐서 응력이 한계를 돌파하며, 목성 너머의 우주 공간 일부가 아예 뜯겨 나가는 '거시적 위상 꼬집기(Macroscopic Topological Pinch-off)' 현상입니다.\"\n\n스크린 속에서 뜯겨 나간 거대한 우주 공간은, 완전히 닫힌 '위상 블랙홀(Topological Bubble)'이 되어 우리 우주와의 탯줄을 끊고 영원한 어둠 속으로 분리되어 버렸다.\n\"지금 우리는... 저 끊어진 공간 속에서 새로운 아기 우주(Baby Universe)가 잉태되는 창세기, 다중 우주(Multiverse)가 찢어져 나가는 경이로운 순간을 목격한 겁니다.\"\n\n우주의 신비 앞에 인간이 넋을 잃은 것도 잠시. 삐빅- 삐비빅- 통제실 전체에 핏빛 경고창이 무자비하게 깜빡이며 방금 전의 벅찬 감동을 무참한 공포로 짓밟아버렸다.\n[경고. 달의 공전 궤도 이탈. 이심률 붕괴 중.]\n다중 우주가 분리되는 그 끔찍한 텐서 휩쓸림 에너지가, 안전 구역 바깥에 매달려 있던 달의 궤도 공간을 정통으로 찢어발긴 것이다. 공간의 곡률이 붕괴되자, 질량 7천경 톤의 거대한 달이 45억 년간 머물던 궤도에서 미끄러져 내려왔다. 핏빛으로 물든 달이 무시무시한 가속도로 팽창하며 지구를 향해 나선형으로 추락하기 시작했다. 우주 지진이라는 보이지 않는 기하학적 재앙을 간신히 막아냈더니, 이번엔 하늘 전체를 짓누르는 가장 압도적이고 직관적인 물리적 폭격이 눈앞에 닥쳐오고 있었다.",
    note: "v5.0: 다중 우주가 탄생하는 위상 꼬집기의 경외감과 직후 달이 추락하는 극단적 공포의 대비 추가",
    commentary: "다중 우주 분리의 경외감과 곧바로 닥쳐오는 물리적 질량(달) 추락의 공포"
  }
};

function insertVersion(originalCode, paragraphId, newVersionKey, contentStr, noteStr, commentaryStr) {
  const searchStr = 'id: "' + paragraphId + '"';
  const pIndex = originalCode.indexOf(searchStr);
  if (pIndex === -1) return originalCode;
  
  // Update commentary
  const commentStr = 'commentary: "';
  const cIndex = originalCode.indexOf(commentStr, pIndex);
  if (cIndex !== -1 && cIndex < pIndex + 500) {
    const cEndIndex = originalCode.indexOf('",', cIndex);
    if (cEndIndex !== -1) {
      originalCode = originalCode.slice(0, cIndex + commentStr.length) + commentaryStr + originalCode.slice(cEndIndex);
    }
  }
  
  // Insert new version
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
  
  // Update activeVersion
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

fs.writeFileSync(targetPath, content);
console.log('Successfully updated novelData.ts with deeply atmospheric Hard SF refinements.');
