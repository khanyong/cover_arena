const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// versionHistory 갱신
if (!content.includes('"v6.2"')) {
  content = content.replace(/versionHistory:\s*\[([^\]]+)\]/, (match, versions) => {
    return `versionHistory: [${versions.trim()}, "v6.2"]`;
  });
}

// 1. 프롤로그 2장, 3장 텍스트 (추가용)
const prologueCh2P1 = `
            {
              id: "act0-ch2-p1",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "\\\"안 먹힙니다! 이건 모니터 안의 통계 에러가 아니라 현실의 물리적 붕괴예요!\\\" 통제실 구석에서 백업 데이터나 정리하던 이안이 다급한 걸음으로 다가왔다. \\\"강제로 차단 상수를 넣지 마시고, 제 수식을 시스템에 입력해야 합니다. 특이점 중심으로 쏟아지는 무한대의 인력은, 똑같은 힘을 가진 위상 회전의 '원심력' 벡터를 주입하면 완벽하게 상쇄시킬 수 있습니다!\\\"",
                  note: "이안의 난입",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            },`;

const prologueCh2P2 = `
            {
              id: "act0-ch2-p2",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "이안은 보안 요원들을 뿌리치고 메인 콘솔을 향해 몸을 던졌다. 스털링을 거칠게 밀어내고 콘솔 오버라이드 엔터키를 쾅 내리쳤다.\\n\\n$$ \\frac{(\\nabla S)^2}{2m} + Q_s = 0 $$\\n\\n진폭 $R \\to 0$ 인 마디 지점에서 양자 퍼텐셜 $Q_s$ 는 $-\\frac{\\hbar^2}{2mr^2}$ 의 무한대 인력($-\\infty$)으로 발산한다. 이안이 주입한 위상($S$) 회전 원심력 항 $+\\frac{\\hbar^2}{2mr^2}$ ($+\\infty$)이 시스템 연산 결과 $- \\infty + \\infty = 0$ 이라는 'Exact Cancellation'을 달성하는 순간이었다.",
                  note: "상쇄의 수식 발동",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            },`;

const prologueCh2P3 = `
            {
              id: "act0-ch2-p3",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "\\\"특이점은 맹렬하게 공간의 위상(Phase)이 회전하고 있는 '태풍의 눈'입니다!\\\" 세라의 푸른 눈이 경악으로 커졌다. \\\"마이너스 무한대의 블랙홀 인력을, 정확히 똑같은 비율의 플러스 무한대 위상 원심력으로 정면충돌 시킨 거군요!\\\" 디스플레이 위에서 파멸의 싱크홀을 향해 수직 추락하던 빔 궤적들이 매끄럽고 우아한 곡선을 그리며 태풍의 눈(마디)을 안전하게 비껴가기 시작했다 (Bypass).",
                  note: "세라의 경악과 기적의 회피",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            }`;

const prologueCh3P1 = `
            {
              id: "act0-ch3-p1",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "스털링 교수의 얼굴에는 안도감 대신 기분 나쁜 창백함이 번지고 있었다. \\\"전원 복귀해! 단순 해프닝이다. 코어 붕괴 기록은 삭제하고 단순 에러로 보고서 작성해! 그리고 이안, 넌 해고다. 네 사이비 기하학은 학계 어떤 저널에도 실리지 못할 거다.\\\"",
                  note: "스털링의 은폐 지시",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            },`;

const prologueCh3P2 = `
            {
              id: "act0-ch3-p2",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "이안은 USB를 조용히 뽑았다. 머릿속 수식이 현실의 무한대를 억누른 기적을 확인했기에 분노도 없었다. \\\"공간은 주사위 놀이를 하지 않는다는 걸 증명한 것으로 저는 충분합니다. 미시 세계의 증명은 이걸로 끝났습니다.\\\"",
                  note: "이안의 덤덤한 반응",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            },`;

const prologueCh3P3 = `
            {
              id: "act0-ch3-p3",
              activeVersion: "v6.2",
              versions: {
                "v6.2": {
                  version: "v6.2",
                  content: "\\\"저는 이제... 텅 비어있다고 착각했던 이 거대 우주의 진짜 뼈대를 찾아 더 큰 증명을 시작하려 합니다.\\\" 이안은 뒤도 돌아보지 않은 채 연구소를 떠났다.",
                  note: "추방과 새로운 시작",
                  createdAt: "${new Date().toISOString().slice(0, 16).replace('T', ' ')}"
                }
              }
            }`;

// 프롤로그 Act 안의 paragraphs 배열 닫는 부분 ( ] } ] } 부분)을 찾아서 2장과 3장을 이어붙인다.
const prologueEndSearch = '            }\n          ]\n        }\n      ]\n    },';
const prologueInsertStr = `            }
          ]
        },
        {
          number: 2,
          title: "Exact Cancellation (상쇄의 수식)",
          synopsis: "마이너스 무한대와 플러스 무한대의 정면충돌",
          paragraphs: [${prologueCh2P1}${prologueCh2P2},${prologueCh2P3}
          ]
        },
        {
          number: 3,
          title: "은폐와 추방",
          synopsis: "은폐되는 기적, 그리고 떠나는 이안",
          paragraphs: [${prologueCh3P1}${prologueCh3P2},${prologueCh3P3}
          ]
        }
      ]
    },`;

if (content.includes(prologueEndSearch)) {
  content = content.replace(prologueEndSearch, prologueInsertStr);
}

// 2. 1막과 2막 통합
// 기존 1막(number: 1)과 2막(number: 2)의 챕터들을 모두 새로운 1막으로 통합한다.
// 기존 act 1: 1장, 2장, 3장
// 기존 act 2: 1장, 2장, 3장 (기존 2막은 스코틀랜드 하일랜드라는 설정이 있었으나, 모두 "3년 후"로 통일)
// 단순히 타이틀과 넘버링만 조정하면 된다.
content = content.replace(/number: 1,\n\s*title: "제 1 막",/, 'number: 1,\n      title: "제 1 막 (파열하는 우주)",');
content = content.replace(/summary: ".*?",/g, (match, offset, string) => {
    if(string.substring(offset - 20, offset).includes('"제 1 막"')) {
        return 'summary: "3년 후, 은둔 중인 이안과 전 지구적 대재앙의 발발",';
    }
    return match;
});

// "제 2 막" 이라는 텍스트를 없애고 해당 부분을 1막의 챕터 연장선으로 붙이는 작업은 AST 없이 정규식으로 완벽히 하긴 매우 까다로우므로
// 텍스트 기반으로 1막 끝나는 부분인 `] } }, { number: 2, title: "제 2 막"` 을 이어버린다.

const act1to2JunctionRegex = /]\n\s*}\n\s*]\n\s*},\n\s*{\n\s*number: 2,\n\s*title: "제 2 막",\n\s*summary: ".*?",\n\s*theory: ".*?",\n\s*story: ".*?",\n\s*chapters: \[\n\s*{\n\s*number: 1,/s;

if (act1to2JunctionRegex.test(content)) {
  content = content.replace(act1to2JunctionRegex, `]
        },
        {
          number: 4,`); // 기존 2막 1장을 1막 4장으로.
  
  // 기존 2막 2장을 5장으로, 3장을 6장으로
  content = content.replace(/number: 2,\n\s*title: "거시적 붕괴 \(FRB\)",/, 'number: 5,\n          title: "거시적 붕괴 (FRB)",');
  content = content.replace(/number: 3,\n\s*title: "증명되지 않은 기하학",/, 'number: 6,\n          title: "증명되지 않은 기하학",');
}

// 3. Act 2.1을 Act 2로 승격, Act 2.5를 Act 2.5로 유지
content = content.replace(/number: 2\.1,\n\s*title: "제 2\.1 막",/g, 'number: 2,\n      title: "제 2 막",');

// Act 1 1장 p1이 "3년 후, 3년 후, " 처럼 중복되었을 수 있으니 정리
content = content.replace(/3년 후, 3년 후, /g, "3년 후, ");
// v6.0 시절의 "방아쇠를 당긴 건 나였어" 에서 "3년 전 사고"가 묘사되어 있으나 이젠 프롤로그가 있으므로 자연스럽다.

fs.writeFileSync(targetPath, content);
console.log('Successfully merged Acts and expanded Prologue.');
