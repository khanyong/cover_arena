const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// versionHistory 갱신
if (!content.includes('"v6.1"')) {
  content = content.replace(/versionHistory:\s*\[([^\]]+)\]/, (match, versions) => {
    return `versionHistory: [${versions.trim()}, "v6.1"]`;
  });
}

// novelData.ts 구조 파싱 - ast 기반 조작이 아니므로 정규식과 indexOf를 활용해 조심스럽게 삽입
const actsIndex = content.indexOf('acts: [');
if (actsIndex !== -1) {
  const insertPos = actsIndex + 'acts: ['.length;
  
  // 템플릿 리터럴을 사용하여 안전하게 문자열 선언
  const prologueStr = `
    {
      number: 0,
      title: "프롤로그",
      summary: "3년 전 제네바 NGC 가속기 붕괴 사고 (과거 회상)",
      chapters: [
        {
          number: 1,
          title: "마디(Node) 구역 진입",
          synopsis: "통제를 벗어난 입자가속기와 코펜하겐 해석의 한계",
          paragraphs: [
            {
              id: "act0-ch1-p1",
              activeVersion: "v6.1",
              versions: {
                "v6.1": {
                  version: "v6.1",
                  content: "지하 200미터, 알프스의 단단한 화강암 암반을 뚫고 건설된 제네바 차세대 거대 양자 가속기(Next-Gen Quantum Collider, NGC)의 중앙 통제실은 문자 그대로 아수라장이었다. 둘레만 100킬로미터에 달하는 거대한 초전도 진공 파이프 내부에서 테라전자볼트(TeV) 단위로 가속되던 입자 빔이 완전히 통제를 벗어난 것이다. 영하 271도의 극저온을 유지해야 할 액체 헬륨 냉각 펌프가 한계 압력에 도달해 비명을 질렀고, 전면의 방탄 차폐 유리 너머로 30미터 높이의 메인 코어가 불길한 푸른빛을 뿜어내며 요동치고 있었다.",
                  note: "프롤로그 신설 (도입부 긴장감 극대화)",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            },
            {
              id: "act0-ch1-p2",
              activeVersion: "v6.1",
              versions: {
                "v6.1": {
                  version: "v6.1",
                  content: "\\"진폭이 0에 수렴하고 있습니다! 충돌 빔이 '마디(Node)' 구역으로 강제 진입했습니다!\\" 수석 엔지니어 세라가 모니터에 얼굴을 박을 듯 들이밀며 절망적인 목소리로 외쳤다. 화면 속 수십억 개의 소립자 궤적들이 기괴하게 비틀리며 하나의 거대한 함몰점을 향해 곤두박질치고 있었다. \\"입자들이 상쇄 간섭 지점에 갇히면서 양자 퍼텐셜($Q_s$)이 마이너스 무한대($-\\\\infty$)로 발산하고 있어요! 시공간의 기하학적 붕괴입니다!\\"",
                  note: "세라의 절규 및 붕괴 현상 수식화",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            },
            {
              id: "act0-ch1-p3",
              activeVersion: "v6.1",
              versions: {
                "v6.1": {
                  version: "v6.1",
                  content: "프로젝트 책임자인 백발의 스털링 교수는 땀범벅이 된 채 콘솔 키보드를 부서져라 두드렸다. 노벨상 후보에 세 번이나 올랐던 그는 '관측 전에는 모든 것이 확률'이라고 굳게 믿는 코펜하겐 해석의 대표 물리학자였다. \\"컷오프(Cut-off) 상수를 주입해! 프로그램 분모에 임의의 입실론($\\\\epsilon$) 값을 강제로 끼워 넣어서 에러를 막으란 말이야! 저 마디는 어차피 입자가 존재할 확률이 0%인 무(無)의 공간이야!\\"",
                  note: "스털링 교수의 코펜하겐식 대처",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            }
          ]
        }
      ]
    },`;

  content = content.slice(0, insertPos) + prologueStr + content.slice(insertPos);
  
  // v6.0의 1막 1장 p1 텍스트 수정 (3년 후)
  // "텅 빈 제네바의 연구실." -> "3년 후, 텅 빈 제네바의 연구실."
  const searchStr = '텅 빈 제네바의 연구실.';
  const act1ch1p1Start = content.indexOf(searchStr);
  if (act1ch1p1Start !== -1) {
    content = content.slice(0, act1ch1p1Start) + '3년 후, ' + content.slice(act1ch1p1Start);
  }
  
  fs.writeFileSync(targetPath, content);
  console.log('Successfully prepended Prologue (Act 0) for v6.1');
} else {
  console.log('Failed to find acts array');
}
