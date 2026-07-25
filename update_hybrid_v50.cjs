const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

if (!content.includes('"v5.0"')) {
  content = content.replace(/versionHistory:\s*\[([^\]]+)\]/, (match, versions) => {
    return `versionHistory: [${versions.trim()}, "v5.0"]`;
  });
}

const v5Data = {
  // 1막
  'act1-ch1-p1': "텅 빈 제네바의 연구실. 칠판 위에서 이안의 손가락이 미세한 경련을 일으켰다. 하얀 분필 가루가 흩날리는 무거운 정적 속에서, 그는 낡은 우주의 확률론적 지도를 찢어발기고 새로운 텐서 공간의 등고선을 새겨 넣는 미친 예술가처럼 투쟁하고 있었다.",
  'act1-ch1-p2': "그의 눈앞에 펼쳐진 것은 단순한 기호의 나열이 아니었다. 그것은 현실의 거대한 지각판들이 서로를 무자비하게 갈아낼 때 터져 나오는 공간의 비명 소리였다.\n\n$$ G_{\\mu\\nu} = \\frac{8\\pi G}{c^4} (T_{\\mu\\nu} + \\tilde{V}_{\\mu\\nu}) $$\n\n그는 날뛰는 암흑에너지의 거시적 변수들을 '통합 암흑 유체 방정식'이라는 차가운 강철 감옥에 강제로 쑤셔 넣고 있었다.",
  'act1-ch1-p3': "우주가 내뿜는 거친 마찰열을 맨손으로 움켜쥐는 가혹한 노동이었다. 시야에는 공간 자체가 기괴하게 뒤틀리며 구토를 쏟아내는 듯한 환각이 겹쳐졌다. 질량 밀도 $\\rho_m$이 임계치를 넘어서는 순간, 비어있다고 믿었던 진공이 스스로 거대한 해일처럼 일어서는 카멜레온 메커니즘($w \\approx -1$)의 실체가 눈앞에 그려졌다.",
  'act1-ch2-p1': "쾅 하는 파열음과 함께 연구실 문이 부서질 듯 열리며 스털링 교수가 들이닥쳤다. 노학자의 창백한 얼굴에는 단순한 분노를 넘어, 평생을 바쳐 숭배해 온 우주의 정적인 질서가 무너져 내리는 것에 대한 처절한 존재론적 공포(Ontological Dread)가 서려 있었다.",
  'act1-ch2-p2': '"자네가 지금 무슨 짓을 하는지 아나! 우주는 정해진 상수 안에서만 안전하고 아름다워. 자네는 지금 그 성스러운 상수들의 배를 가르고 있어!"\n스털링의 외침은 마치 붕괴하는 신전의 기둥을 맨몸으로 떠받치려는 늙은 사제의 단말마처럼 처절했다.',
  'act1-ch3-p1': '"교수님, 신전은 이미 무너지고 있습니다." 이안이 핏물이 맺힌 손끝으로 분필 자국 가득한 칠판을 가리켰다.\n"이 수식들은 신전의 잔해가 쏟아지는 소리를 기록한 악보일 뿐입니다. 공간이라는 매질이 비명을 지르며 찢어지는 궤적을 제발 똑바로 보십시오! 확률의 장난이 아니라 명백한 기하학적 붕괴입니다."',
  'act1-ch3-p2': "지하 100미터 아래 입자가속기의 임계 경고음이 심장 박동처럼 진동하기 시작했다. 낡은 패러다임의 사제와 진실의 눈을 떠버린 혁명가의 시선이 충돌하는 그 순간, 1초가 영겁처럼 늘어지며 연구실의 허공이 맹렬하게 소용돌이치기 시작했다. 텐서의 바다가 요동치는, 기하학적 붕괴의 서막이었다.",

  // 2막
  'act2-ch1-p1': '"시동(Startup). 점화(Ignition). 가속(Acceleration)." 세라의 건조한 음성이 텅 빈 관제실을 채웠다. 스타카토처럼 짧게 끊어지는 카운트다운 속에서, 입자가속기 내부의 위상 압력은 폭발 직전의 활화산처럼 끓어오르고 있었다.',
  'act2-ch1-p2': '"수식의 오차 0.0001%가 인류를 이 기하학적 감옥에 영원히 가둘 것이다."\n\n$$ \\nabla_\\alpha F^{\\alpha\\beta} = \\mu_0 J^\\beta + \\mathcal{O}(\\epsilon) $$\n\n세라의 손끝이 콘솔 위에서 미세하게 떨렸다. 추상적인 텐서를 현실의 기계 진동으로 엮어내는 이 작업에서, 그녀의 어깨를 짓누르는 것은 인류 전체의 명운이 걸린 벼랑 끝의 공학적 무게였다.',
  'act2-ch2-p1': 'POINTING 프로토콜이 발동된 순간, 도시 전체에 초거대 우주 지진(FRB)의 여파가 들이닥쳤다. 땅이 흔들린 것이 아니었다. 대기의 공간 자체가 고무줄처럼 팽팽하게 길게 늘어났다가 기괴하게 수축하는 끔찍한 현상이었다.',
  'act2-ch2-p2': "빌딩 사이의 거리가 일그러지고, 수평선이 기괴한 곡선으로 휘어져 내렸다.\n\n$$ \\Delta s^2 = g_{\\mu\\nu}(x) dx^\\mu dx^\\nu $$\n\n시민들은 단순한 어지러움을 넘어, 저 절대적 거리 측정 방식인 메트릭 텐서($g_{\\mu\\nu}$)마저 붕괴하며 발생하는 내장 깊숙한 곳의 역겨움, 즉 '비유클리드적 구역질(Non-Euclidean Nausea)'에 사로잡혀 거리에 쓰러졌다.",
  'act2-ch3-p1': '"보십시오! 이것이 우리가 살고 있는 껍데기입니다!" 이안이 깨진 유리창 너머로 뒤틀리는 하늘을 보며 소리쳤다. "우주는 결코 아름다운 상수가 아닙니다. 분노하고 요동치며 찢어지는 거대한 유체(Fluid)란 말입니다!"',
  'act2-ch3-p2': "세라는 이안의 절규를 등진 채, 핏발 선 눈으로 모니터의 진동 계수(Oscillation Coeff)를 필사적으로 보정하고 있었다. 이안의 거친 수식을 현실의 단단한 지면에 접지(Grounding)시켜야만, 이 무자비한 공간의 폭주를 막을 수 있다는 것만이 그녀의 유일한 진실이었다.",

  // 2.1막
  'act2_1-ch1-p1': "전 세계가 시공간의 끔찍한 멀미에 신음할 때, 아틀라스 코퍼레이션의 펜트하우스는 섬뜩하리만치 고요했다. 마커스 밴스 회장은 식어가는 10살짜리 딸 클로이의 손을 쥔 채, 자본으로도 어쩔 수 없는 무력감 속에 무너져 있었다.",
  'act2_1-ch1-p2': '"종양이 뇌 신경망을 너무 깊이 파고들었습니다. 빛이 일직선으로 나아가는 물리적 확률 오차 한계 때문에, 암세포를 도려내려다 정상 뇌세포까지 연쇄 붕괴하여 즉사하게 됩니다."',
  'act2_1-ch2-p1': "그때, 굳게 닫힌 문을 거칠게 열고 이안이 들어왔다. 우주의 깊은 심연을 맨눈으로 엿본 자 특유의 서늘한 광기가 그의 두 눈동자에서 번뜩였다.",
  'act2_1-ch2-p2': '"회장님, 빛의 궤적을 억지로 굽혀버릴 수 있다면 어쩌시겠습니까?" 이안이 테이블 위에 낡은 태블릿을 던지듯 올려놓으며 거침없이 시뮬레이션을 덮어씌웠다.',
  'act2_1-ch3-p1': "화면 속에서 경이로운 광경이 펼쳐졌다. 레이저 빛이 암세포 주변의 텅 빈 공간을 휘감고 도는 '위상 소용돌이(Topological Vortex)'를 탔다.\n\n$$ \\nabla \\times \\mathbf{A} = \\mathbf{B}_{vortex} $$\n\n빛의 칼날은 기하학적 굴절률에 의해 밀려나며 건강한 뇌신경 다발을 강물처럼 부드럽게 굽이쳐 우회하고, 오직 암세포만을 타격했다.",
  'act2_1-ch3-p2': '"클로이의 뇌 속 공간을 튕겨내는 이 수식이, 바로 우리가 탈출할 거대 방주의 위상 방어막입니다."\n이안의 눈빛이 마커스를 꿰뚫었다. 철저한 실용주의자였던 밴스 회장의 눈동자에, 인류를 구원할 기하학적 희망을 향한 3천억 달러짜리 거대한 결단이 끓어오르고 있었다.',

  // 2.5막
  'act2_5-ch1-p1': "방주의 외벽이 거의 완성되어 가던 날, 토성의 아름다운 고리가 무참히 찢겨 나갔다. 우주의 보이지 않는 거대한 기하학적 손톱이 태양계의 살점을 뜯어내는 듯한 끔찍한 광경이었다.",
  'act2_5-ch1-p2': "이안과 세라는 직경 5킬로미터에 달하는 검은 원반형 방주, '오디세우스'를 건조하고 있었다. 그 외벽은 낡은 우주의 폭력을 튕겨낼 수식적 방어막,\n\n$$ \\delta R_{\\mu\\nu} = 8\\pi G \\, \\delta T_{\\mu\\nu} $$\n\n즉, 공간 자체를 응축시킨 미세 진동 장갑으로 빼곡히 덮여 있었다.",

  // 3막
  'act3-ch1-p1': '"단층선이 찢어집니다!" 세라의 외침과 함께 대기권 밖 칠흑 같은 아가리가 벌어졌다. 게르첸슈타인 효과(Gertsenshtein Effect)가 가동되자, 방주를 둘러싼 투명한 공기가 순식간에 유리처럼 단단하게 응축되며 눈부신 기하학적 갑옷으로 돌변했다.',
  'act3-ch1-p2': "거대한 방주가 마침내 허공으로 솟아올랐다. 공간의 거친 파도가 장갑을 때릴 때마다 찬란한 굴절이 뿜어져 나왔다. 그것은 낡은 우주의 허물을 찢고 나가는, 마치 좁고 고통스러운 산도(産道)를 통과하는 우주적 진통이었다.",
  'act3-ch2-p1': "이안이 콘솔의 붉은 레버를 당겼다. '위상 절단(Topological Pinch-off)'.\n\n$$ \\int_{\\partial V} K dA = 2\\pi \\chi(V) $$\n\n그것은 옛 우주가 끝까지 붙잡고 늘어지던 끈적한 기하학적 탯줄을 오일러 지표($\\chi$)의 왜곡을 통해 스스로 썰어내는 행위였다. 낡은 상수의 죄수에 불과했던 인류가 시공간의 건축가로 각성하는 지적 진화의 정점이었다.",
  'act3-ch2-p2': "빛조차 존재하지 않는 낯선 다중 우주의 심연으로 미끄러져 들어가는 순간, 이안의 어깨를 짓누르던 극심한 중압감이 씻은 듯이 사라졌다. 스스로의 터전을 빚어내는 창조적 주체로 거듭났다는 묵직한 해방감이 방주 전체를 따뜻하게 감쌌다.",

  // 에필로그
  'epilogue-ch1-p1': "멸망하는 태양계로부터 살점을 뜯어내듯 도약한 방주 '오디세우스'는 마침내 낯선 텐서의 바다에 고요히 멈춰 섰다. 그곳은 물질이라고는 단 한 줌도 존재하지 않는, 완벽히 텅 빈 도화지 같은 절대 암흑이었다.",
  'epilogue-ch1-p2': '메인 브릿지의 창밖을 내다보던 세라가 물었다. "우리는 살아남았어요. 하지만 이곳엔 은하도, 태양도, 흙 한 줌조차 없어요. 어떻게 살아가야 하죠?"',
  'epilogue-ch1-p3': '이안이 손끝으로 장치를 조작하자 맥박처럼 푸른빛이 뿜어졌다.\n\n$$ \\tilde{\\Psi}(x, t) = \\sum_{n} c_n e^{i(k_n x - \\omega_n t)} $$\n\n"걱정 마. 공간이 텅 비어 있다면... 이 순수한 진동 방정식으로 파동을 중첩시켜 우리가 직접 별과 대지를 빚어내면 되니까. 우리는 이 텅 빈 바다의 새로운 아담과 이브가 될 거야."'
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

for (const pId in v5Data) {
  content = insertVersion(content, pId, 'v5.0', v5Data[pId], 'v5.0: 하이브리드 개정판 (수학적 텐서 수식 + 감각적 비유 융합)');
}

fs.writeFileSync(targetPath, content);
console.log('Successfully updated all paragraphs with v5.0 Hybrid texts');
