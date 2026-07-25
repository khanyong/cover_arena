const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const act3Data = {
  'act2_5-ch1-p1': "방주의 외벽이 거의 완성되어 가던 날, 토성의 아름다운 고리가 무참히 찢겨 나갔다. 우주의 보이지 않는 거대한 기하학적 손톱이 태양계의 살점을 뜯어내는 듯한 끔찍한 광경이었다. 방어막이 없는 거시 세계의 행성들은 속수무책으로 우주적 학살을 당하고 있었다.",
  'act2_5-ch1-p2': "이안과 세라는 스코틀랜드 하일랜드의 깊은 지하 격납고에서, 인류 역사상 가장 거대하고 기괴한 피난처를 깎아내고 있었다. 직경 5킬로미터에 달하는 검은 원반형 방주, '오디세우스'. 그 외벽은 낡은 우주의 폭력을 튕겨낼 미세한 진동 장갑으로 빼곡히 덮여 있었다.",
  'act3-ch1-p1': '"PTA 레이더의 노이즈가 임계점을 돌파했습니다. 단층선이... 찢어집니다." 세라의 외침과 함께, 지구의 대기권 밖에서 공간이 칠흑 같은 아가리를 벌렸다. 방주의 방어막이 가동되자, 선체를 둘러싼 투명한 공기가 순식간에 유리처럼 단단하게 응축되며 침입자를 거부하는 눈부신 기하학적 갑옷으로 돌변했다.',
  'act3-ch1-p2': "거대한 방주가 마침내 허공으로 솟아올랐다. 공간의 거친 파도가 방주의 장갑을 때릴 때마다 찬란한 빛의 굴절이 신기루처럼 뿜어져 나왔다. 그것은 단순한 비행이 아니었다. 낡은 우주의 허물을 찢고 나가는, 마치 좁은 산도(産道)를 통과하는 듯한 거대하고 끔찍한 진통이었다.",
  'act3-ch2-p1': "이안이 메인 콘솔의 붉은 레버를 당겼다. '위상 절단(Topological Pinch-off)'. 그것은 옛 우주가 끝까지 붙잡고 늘어지던 끈적한 기하학적 탯줄을 스스로 썰어내는 행위였다. 우주의 이치에 갇힌 죄수에 불과했던 인류가, 마침내 시공간의 건축가로 각성하는 지적 진화의 정점이었다.",
  'act3-ch2-p2': "빛조차 존재하지 않는 낯선 다중 우주의 심연으로 미끄러져 들어가는 순간, 이안의 어깨를 평생 짓누르던 극심한 중압감이 씻은 듯이 사라졌다. 환경에 순응하던 미약한 유기체 종족이, 비로소 스스로의 터전을 빚어내는 창조적 주체로 거듭났다는 묵직한 해방감이 방주 전체를 따뜻하게 감쌌다.",
  'epilogue-ch1-p1': "멸망하는 태양계로부터 살점을 뜯어내듯 도약한 방주 '오디세우스'는 마침내 낯선 텐서의 바다에 고요히 멈춰 섰다. 그곳은 물질이라고는 단 한 줌도 존재하지 않는, 완벽히 텅 빈 도화지 같은 절대 암흑이었다.",
  'epilogue-ch1-p2': "메인 브릿지의 거대한 창밖을 내다보던 세라가 경외감이 섞인 목소리로 입을 열었다. '이안. 우리는 살아남았어요. 하지만 이곳엔 은하도, 태양도, 우리가 밟고 설 흙 한 줌조차 없어요. 우리는 이제 어떻게 살아남아야 하죠?'",
  'epilogue-ch1-p3': "이안이 희미하게 미소 지었다. 그의 손끝에서 '위상 제어 장치'가 부드러운 맥박처럼 푸른빛을 뿜어냈다. '걱정 마, 세라. 공간이 텅 비어 있다면... 우리가 직접 진동을 일으켜 별과 대지를 빚어내면 되니까. 우리는 이 텅 빈 바다의 새로운 아담과 이브가 될 거야.'"
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

for (const pId in act3Data) {
  content = insertVersion(content, pId, 'v4.0', act3Data[pId], 'v4.0: 수식 배제 및 감각적 비유(Sense of Wonder) 극대화');
}

fs.writeFileSync(targetPath, content);
console.log('Successfully updated Act 3 and Epilogue with v4.0 sensory texts');
