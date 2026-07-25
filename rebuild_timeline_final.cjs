const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// versionHistory 갱신
if (!content.includes('"v6.1"')) {
  content = content.replace(/versionHistory:\s*\[([^\]]+)\]/, (match, versions) => {
    return `versionHistory: [${versions.trim()}, "v6.1", "v6.2"]`;
  });
}

const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

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
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "지하 200미터, 알프스의 단단한 화강암 암반을 뚫고 건설된 제네바 차세대 거대 양자 가속기(Next-Gen Quantum Collider, NGC)의 중앙 통제실은 문자 그대로 아수라장이었다. 둘레만 100킬로미터에 달하는 거대한 초전도 진공 파이프 내부에서 테라전자볼트(TeV) 단위로 가속되던 입자 빔이 완전히 통제를 벗어난 것이다. 영하 271도의 극저온을 유지해야 할 액체 헬륨 냉각 펌프가 한계 압력에 도달해 비명을 질렀고, 전면의 방탄 차폐 유리 너머로 30미터 높이의 메인 코어가 불길한 푸른빛을 뿜어내며 요동치고 있었다.",
                  note: "프롤로그 도입",
                  createdAt: "${now}"
                }
              }
            },
            {
              id: "act0-ch1-p2",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "\\\"진폭이 0에 수렴하고 있습니다! 충돌 빔이 '마디(Node)' 구역으로 강제 진입했습니다!\\\" 수석 엔지니어 세라가 모니터에 얼굴을 박을 듯 들이밀며 절망적인 목소리로 외쳤다. 화면 속 수십억 개의 소립자 궤적들이 기괴하게 비틀리며 하나의 거대한 함몰점을 향해 곤두박질치고 있었다. \\\"입자들이 상쇄 간섭 지점에 갇히면서 양자 퍼텐셜($Q_s$)이 마이너스 무한대($-\\\\infty$)로 발산하고 있어요! 시공간의 기하학적 붕괴입니다!\\\"",
                  note: "붕괴 현상 수식화",
                  createdAt: "${now}"
                }
              }
            },
            {
              id: "act0-ch1-p3",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "프로젝트 책임자인 백발의 스털링 교수는 땀범벅이 된 채 콘솔 키보드를 부서져라 두드렸다. 노벨상 후보에 세 번이나 올랐던 그는 '관측 전에는 모든 것이 확률'이라고 굳게 믿는 코펜하겐 해석의 대표 물리학자였다. \\\"컷오프(Cut-off) 상수를 주입해! 프로그램 분모에 임의의 입실론($\\\\epsilon$) 값을 강제로 끼워 넣어서 에러를 막으란 말이야! 저 마디는 어차피 입자가 존재할 확률이 0%인 무(無)의 공간이야!\\\"",
                  note: "스털링 교수의 대처",
                  createdAt: "${now}"
                }
              }
            }
          ]
        },
        {
          number: 2,
          title: "Exact Cancellation (상쇄의 수식)",
          synopsis: "마이너스 무한대와 플러스 무한대의 정면충돌",
          paragraphs: [
            {
              id: "act0-ch2-p1",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "\\\"안 먹힙니다! 이건 모니터 안의 통계 에러가 아니라 현실의 물리적 붕괴예요!\\\" 통제실 구석에서 백업 데이터나 정리하던 이안이 다급한 걸음으로 다가왔다. \\\"강제로 차단 상수를 넣지 마시고, 제 수식을 시스템에 입력해야 합니다. 특이점 중심으로 쏟아지는 무한대의 인력은, 똑같은 힘을 가진 위상 회전의 '원심력' 벡터를 주입하면 완벽하게 상쇄시킬 수 있습니다!\\\"",
                  note: "이안의 난입",
                  createdAt: "${now}"
                }
              }
            },
            {
              id: "act0-ch2-p2",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "이안은 보안 요원들을 뿌리치고 메인 콘솔을 향해 몸을 던졌다. 스털링을 거칠게 밀어내고 콘솔 오버라이드 엔터키를 쾅 내리쳤다.\\n\\n$$ \\\\frac{(\\\\nabla S)^2}{2m} + Q_s = 0 $$\\n\\n진폭 $R \\\\to 0$ 인 마디 지점에서 양자 퍼텐셜 $Q_s$ 는 $-\\\\frac{\\\\hbar^2}{2mr^2}$ 의 무한대 인력($-\\\\infty$)으로 발산한다. 이안이 주입한 위상($S$) 회전 원심력 항 $+\\\\frac{\\\\hbar^2}{2mr^2}$ ($+\\\\infty$)이 시스템 연산 결과 $-\\\\infty + \\\\infty = 0$ 이라는 'Exact Cancellation'을 달성하는 순간이었다.",
                  note: "상쇄의 수식 발동",
                  createdAt: "${now}"
                }
              }
            },
            {
              id: "act0-ch2-p3",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "\\\"특이점은 맹렬하게 공간의 위상(Phase)이 회전하고 있는 '태풍의 눈'입니다!\\\" 세라의 푸른 눈이 경악으로 커졌다. \\\"마이너스 무한대의 블랙홀 인력을, 정확히 똑같은 비율의 플러스 무한대 위상 원심력으로 정면충돌 시킨 거군요!\\\" 디스플레이 위에서 파멸의 싱크홀을 향해 수직 추락하던 빔 궤적들이 매끄럽고 우아한 곡선을 그리며 태풍의 눈(마디)을 안전하게 비껴가기 시작했다 (Bypass).",
                  note: "세라의 경악과 기적의 회피",
                  createdAt: "${now}"
                }
              }
            }
          ]
        },
        {
          number: 3,
          title: "은폐와 추방",
          synopsis: "은폐되는 기적, 그리고 떠나는 이안",
          paragraphs: [
            {
              id: "act0-ch3-p1",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "스털링 교수의 얼굴에는 안도감 대신 기분 나쁜 창백함이 번지고 있었다. \\\"전원 복귀해! 단순 해프닝이다. 코어 붕괴 기록은 삭제하고 단순 에러로 보고서 작성해! 그리고 이안, 넌 해고다. 네 사이비 기하학은 학계 어떤 저널에도 실리지 못할 거다.\\\"",
                  note: "스털링의 은폐 지시",
                  createdAt: "${now}"
                }
              }
            },
            {
              id: "act0-ch3-p2",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "이안은 USB를 조용히 뽑았다. 머릿속 수식이 현실의 무한대를 억누른 기적을 확인했기에 분노도 없었다. \\\"공간은 주사위 놀이를 하지 않는다는 걸 증명한 것으로 저는 충분합니다. 미시 세계의 증명은 이걸로 끝났습니다.\\\"",
                  note: "이안의 덤덤한 반응",
                  createdAt: "${now}"
                }
              }
            },
            {
              id: "act0-ch3-p3",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "\\\"저는 이제... 텅 비어있다고 착각했던 이 거대 우주의 진짜 뼈대를 찾아 더 큰 증명을 시작하려 합니다.\\\" 이안은 뒤도 돌아보지 않은 채 연구소를 떠났다.",
                  note: "추방과 새로운 시작",
                  createdAt: "${now}"
                }
              }
            }
          ]
        }
      ]
    },`;

const actsIndex = content.indexOf('acts: [');
if (actsIndex !== -1) {
  const insertPos = actsIndex + 'acts: ['.length;
  // 이번에는 문자열을 replace하지 않고 그대로 넣는다! (백슬래시 4개가 파일에 백슬래시 2개로 쓰이도록)
  content = content.slice(0, insertPos) + '\n' + prologueStr + content.slice(insertPos);
}

// 1막 1장의 시작을 "3년 후" 로 변경
const act1ch1p1Start = content.indexOf('텅 빈 제네바의 연구실.');
if (act1ch1p1Start !== -1) {
  content = content.slice(0, act1ch1p1Start) + '3년 후, ' + content.slice(act1ch1p1Start);
}

// 1막(제네바)과 2막(우주지진) 병합
content = content.replace(/number: 1,\n\s*title: "제 1 막",/, 'number: 1,\n      title: "제 1 막 (파열하는 우주)",');
content = content.replace(/summary: ".*?",/g, (match, offset, string) => {
    if(string.substring(offset - 20, offset).includes('"제 1 막"')) {
        return 'summary: "3년 후, 은둔 중인 이안과 전 지구적 대재앙의 발발",';
    }
    return match;
});

const act1to2JunctionRegex = /]\n\s*}\n\s*]\n\s*},\n\s*{\n\s*number: 2,\n\s*title: "제 2 막",\n\s*summary: ".*?",\n\s*theory: ".*?",\n\s*story: ".*?",\n\s*chapters: \[\n\s*{\n\s*number: 1,/s;
if (act1to2JunctionRegex.test(content)) {
  content = content.replace(act1to2JunctionRegex, `]
        },
        {
          number: 4,`); 
  content = content.replace(/number: 2,\n\s*title: "거시적 붕괴 \(FRB\)",/, 'number: 5,\n          title: "거시적 붕괴 (FRB)",');
  content = content.replace(/number: 3,\n\s*title: "증명되지 않은 기하학",/, 'number: 6,\n          title: "증명되지 않은 기하학",');
}

// 2.1막 -> 2막
content = content.replace(/number: 2\.1,\n\s*title: "제 2\.1 막",/g, 'number: 2,\n      title: "제 2 막",');
content = content.replace(/3년 후, 3년 후, /g, "3년 후, ");

fs.writeFileSync(targetPath, content);
console.log('Successfully and perfectly rebuilt v6.2 timeline, preserving all latex backslashes.');
