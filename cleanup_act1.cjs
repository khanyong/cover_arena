const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. act1-ch1-p1 이 끝나는 부분 찾기
// act1-ch1-p1 이 끝나는 객체의 마지막 괄호는 `            },` 일 것이고, 그 직후에 `            {\n              id: "act1-ch1-p2"` 가 온다.
const p2Start = content.indexOf('            {\n              id: "act1-ch1-p2"');

// 2. 구 2막 1장 시작 부분 찾기 (이전에 number: 4로 치환했음)
const act2Ch1StartRegex = /]\n\s*}\n\s*,\n\s*{\n\s*number: 4,\n\s*title: "제 1 장: 스코틀랜드의 은둔자와 3년 만의 재회",/;
const act2Ch1Match = content.match(act2Ch1StartRegex);

if (p2Start !== -1 && act2Ch1Match) {
  // 잘라낼 앞부분 (act1-ch1-p1 까지)
  // 단, act1-ch1-p1 객체 끝의 콤마(,)를 없애야 배열이 올바르게 닫힘.
  // p2Start 앞의 `            },\n` 에서 콤마를 없애기 위해 p2Start 위치부터 탐색
  const beforeP2 = content.slice(0, p2Start).trimEnd();
  // beforeP2의 마지막 문자는 ',' 이다. 이를 제거
  const newBeforeP2 = beforeP2.endsWith(',') ? beforeP2.slice(0, -1) : beforeP2;
  
  // 잘라낼 뒷부분 (number: 4 부터 시작하는 객체)
  // 매치된 문자열이 `]\n        }\n      ,\n      {\n        number: 4,\n...` 일 것이다.
  // act2Ch1Match.index는 매치 시작 위치
  // 그곳을 `\n          ]\n        },\n        {\n          number: 2,\n          title: "제 2 장: 스코틀랜드의 은둔자와 3년 만의 재회",` 로 이어준다.
  
  const endPart = content.slice(act2Ch1Match.index + act2Ch1Match[0].length);
  
  const replacement = `
          ]
        },
        {
          number: 2,
          title: "제 2 장: 스코틀랜드의 은둔자와 3년 만의 재회",`;
          
  content = newBeforeP2 + replacement + endPart;
  
  // number: 5 -> number: 3
  content = content.replace(/number: 5,\n\s*title: "거시적 붕괴 \(FRB\)",/, 'number: 3,\n          title: "제 3 장: 거시적 붕괴 (FRB)",');
  
  // number: 6 -> number: 4
  content = content.replace(/number: 6,\n\s*title: "증명되지 않은 기하학",/, 'number: 4,\n          title: "제 4 장: 증명되지 않은 기하학",');
  
  fs.writeFileSync(targetPath, content);
  console.log('Successfully cleaned up Act 1 redundant flashbacks.');
} else {
  console.log('Could not find markers for cleanup.');
  console.log('p2Start:', p2Start);
  console.log('act2Ch1Match:', !!act2Ch1Match);
}
