const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// --- 1. 제 1 막 제목 변경 ---
content = content.replace(/number: 1,\n\s*title: "제 1 막: 태풍의 눈 \(칠판 위의 기적\)",/, 'number: 1,\n      title: "제 1 막: 파열하는 우주",');
content = content.replace(/summary: "현실의 파국과 이를 막아낸 텐서 궤적 방정식. 그러나 이안은 비주류라는 이유로 학계에서 추방당한다.",/, 'summary: "3년 후, 은둔 중인 이안과 전 지구적 대재앙의 발발",');

// --- 2. 중복 회상 씬 제거 및 1막/2막 챕터 병합 ---
// 삭제 시작점: act1-ch1-p1이 끝나는 `            },` 직후
const act1P1IdStr = 'id: "act1-ch1-p1",';
const p1StartIdx = content.indexOf(act1P1IdStr);
if (p1StartIdx === -1) {
  console.log("Error: Cannot find act1-ch1-p1");
  process.exit(1);
}
// p1StartIdx 이후 처음 나오는 `            },` 찾기
const p1EndIdx = content.indexOf('            },', p1StartIdx);
if (p1EndIdx === -1) {
  console.log("Error: Cannot find end of act1-ch1-p1");
  process.exit(1);
}
// 삭제의 시작은 이 콤마 뒤부터다. `\n` 등을 감안해서 잘라낸다.
const deleteStartIdx = p1EndIdx + '            },'.length;

// 삭제 끝점(병합점): 구 2막 1장 "제 1 장: 스코틀랜드의 은둔자와 3년 만의 재회" 가 시작하는 곳
// 단, 이 앞에 1막의 chapters 배열 닫기와 2막 객체 시작부분이 있다. 이를 싹 날려서 1막의 chapters 안으로 들어오게 해야 한다.
const act2Ch1Regex = /{\n\s*number: 1,\n\s*title: "제 1 장: 스코틀랜드의 은둔자와 3년 만의 재회",/g;
const act2Ch1Match = [...content.matchAll(act2Ch1Regex)];
if (act2Ch1Match.length === 0) {
  console.log("Error: Cannot find Act 2 Chapter 1");
  process.exit(1);
}
const deleteEndIdx = act2Ch1Match[0].index;

// 이제 교체한다.
const beforeDelete = content.slice(0, deleteStartIdx);
const afterDelete = content.slice(deleteEndIdx);

// afterDelete에서 구 2막 1장의 챕터 번호를 2로 바꿔준다. 
// 구 2막 1장~7장까지 있으므로 번호를 2~8로 밀어준다.
let newAfterDelete = afterDelete;
newAfterDelete = newAfterDelete.replace(/number: 1,(\n\s*title: "제 1 장: 스코틀랜드)/, 'number: 2,$1');
newAfterDelete = newAfterDelete.replace(/title: "제 1 장: 스코틀랜드/, 'title: "제 2 장: 스코틀랜드');

newAfterDelete = newAfterDelete.replace(/number: 2,(\n\s*title: "제 2 장: 암흑)/, 'number: 3,$1');
newAfterDelete = newAfterDelete.replace(/title: "제 2 장: 암흑/, 'title: "제 3 장: 암흑');

newAfterDelete = newAfterDelete.replace(/number: 3,(\n\s*title: "제 3 장: 공간)/, 'number: 4,$1');
newAfterDelete = newAfterDelete.replace(/title: "제 3 장: 공간/, 'title: "제 4 장: 공간');

newAfterDelete = newAfterDelete.replace(/number: 4,(\n\s*title: "제 4 장: 초공간)/, 'number: 5,$1');
newAfterDelete = newAfterDelete.replace(/title: "제 4 장: 초공간/, 'title: "제 5 장: 초공간');

newAfterDelete = newAfterDelete.replace(/number: 5,(\n\s*title: "제 5 장: 3광년)/, 'number: 6,$1');
newAfterDelete = newAfterDelete.replace(/title: "제 5 장: 3광년/, 'title: "제 6 장: 3광년');

newAfterDelete = newAfterDelete.replace(/number: 6,(\n\s*title: "제 6 장: 8개월)/, 'number: 7,$1');
newAfterDelete = newAfterDelete.replace(/title: "제 6 장: 8개월/, 'title: "제 7 장: 8개월');

newAfterDelete = newAfterDelete.replace(/number: 7,(\n\s*title: "제 7 장: 다자간)/, 'number: 8,$1');
newAfterDelete = newAfterDelete.replace(/title: "제 7 장: 다자간/, 'title: "제 8 장: 다자간');

content = beforeDelete + '\n' + newAfterDelete;

// --- 3. 구 막 번호 교체 ---
// 2.1막 -> 2막
content = content.replace(/number: 2\.1,\n\s*title: "제 2\.1 막: 오디세우스의 투자자",/, 'number: 2,\n      title: "제 2 막: 오디세우스의 투자자",');

// 2.5막 -> 3막
content = content.replace(/number: 2\.5,\n\s*title: "제 2\.5 막: 찢어지는 하늘 \(텐서 응축 폭주\)",/, 'number: 3,\n      title: "제 3 막: 찢어지는 하늘 (텐서 응축 폭주)",');

// 3막 -> 4막
content = content.replace(/number: 3,\n\s*title: "제 3 막: 시공간의 건축가들",/, 'number: 4,\n      title: "제 4 막: 시공간의 건축가들",');

// 에필로그 번호가 만약 4라면 5로 밀어준다.
content = content.replace(/number: 4,\n\s*title: "에필로그: 텐서의 창세기 \(Genesis of Tensors\)",/, 'number: 5,\n      title: "에필로그: 텐서의 창세기 (Genesis of Tensors)",');

fs.writeFileSync(targetPath, content);
console.log("Successfully restructured Acts and removed redundant flashbacks.");
