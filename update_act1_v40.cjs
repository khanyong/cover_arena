const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const act1Data = {
  'act1-ch1-p1': "텅 빈 제네바의 연구실. 칠판 위에서 이안의 손가락이 미세한 경련을 일으켰다. 하얀 분필 가루가 흩날리는 무거운 정적 속에서, 그는 마치 낡은 우주의 지도를 찢어발기고 새로운 공간의 등고선을 새겨 넣는 미친 예술가처럼 투쟁하고 있었다.",
  'act1-ch1-p2': "그의 눈앞에 펼쳐진 방정식은 단순한 기호의 나열이 아니었다. 그것은 현실의 거대한 지각판들이 서로를 무자비하게 갈아낼 때 터져 나오는 공간의 비명 소리를, 차가운 강철 감옥에 강제로 쑤셔 넣는 고통스러운 형벌과도 같았다.",
  'act1-ch1-p3': "날뛰는 암흑에너지의 변수들을 칠판의 이차원 평면에 결박할 때마다, 이안의 시야에는 공간 자체가 기괴하게 뒤틀리며 구토를 쏟아내는 듯한 환각이 겹쳐졌다. 우주가 내뿜는 거친 마찰열을 맨손으로 움켜쥐고 잠재우는 가혹한 노동이었다.",
  'act1-ch2-p1': "쾅 하는 파열음과 함께 연구실 문이 부서질 듯 열리며 스털링 교수가 들이닥쳤다. 노학자의 창백한 얼굴에는 단순한 분노를 넘어, 평생을 바쳐 숭배해 온 우주의 정적인 질서가 무너져 내리는 것에 대한 처절한 존재론적 공포(Ontological Dread)가 서려 있었다.",
  'act1-ch2-p2': '"자네가 지금 무슨 짓을 하는지 아나! 우주는 정해진 상수 안에서만 안전하고 아름다워. 자네는 지금 그 성스러운 상수들의 배를 가르고 있어!" 스털링의 외침은 마치 붕괴하는 신전의 기둥을 맨몸으로 떠받치려는 늙은 사제의 단말마처럼 처절했다.',
  'act1-ch3-p1': '"교수님, 신전은 이미 무너지고 있습니다." 이안이 핏물이 맺힌 손끝으로 분필 자국 가득한 칠판을 가리켰다. "이 수식들은 신전의 잔해가 쏟아지는 소리를 기록한 악보일 뿐입니다. 공간이라는 매질이 비명을 지르며 찢어지는 궤적을 제발 똑바로 보십시오!"',
  'act1-ch3-p2': "숨 막히는 대립 속에서, 지하 100미터 아래 입자가속기의 임계 경고음이 심장 박동처럼 진동하기 시작했다. 낡은 패러다임의 사제와 진실의 눈을 떠버린 혁명가의 시선이 충돌하는 그 순간, 1초가 영겁처럼 늘어지며 연구실의 허공이 맹렬하게 소용돌이치기 시작했다. 기하학적 붕괴의 서막이었다."
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
  
  // Replace activeVersion safely
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

for (const pId in act1Data) {
  content = insertVersion(content, pId, 'v4.0', act1Data[pId], 'v4.0: 수식 배제 및 감각적 비유(Sense of Wonder) 극대화');
}

fs.writeFileSync(targetPath, content);
console.log('Successfully updated Act 1 with v4.0 sensory texts');
