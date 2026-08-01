const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Update Act 1 Metadata
content = content.replace(
  'title: "제 1 막: 파열하는 우주",',
  'title: "제 1 막: 다가오는 우주 지진",'
);
content = content.replace(
  'summary: "원작 논문 Part I 반영 - 마디(Node) 특이점과 궤적의 기하학적 미끄러짐(Bypass), 은폐와 우주 지진 전조",',
  'summary: "제네바 사건 3년 후 스코틀랜드 은둔지에서 세라와의 재회. 관측 데이터를 분석하여 다가오는 우주 지진(Space Quake)의 핏빛 전조를 발견함.",'
);
content = content.replace(
  'theory: "마디(Node) 특이점에서의 무한대 폭주와 위상 회전 원심력에 의한 완벽한 상쇄 (-∞ + ∞ = 0).",',
  'theory: "우주상수 Λ 파기 및 카멜레온 메커니즘을 통한 텐서 유체 상전이 현상. 무색채 광학 흐림(Achromatic Blurring) 해석.",'
);
content = content.replace(
  'story: "입자가속기가 붕괴하려는 찰나 이안이 위상 원심력 수식을 주입해 특이점을 극복하고, 은폐 속에서 연구소를 떠나며 우주 지진의 전조(Foreshocks)가 잡힘.",',
  'story: "은둔하던 이안에게 세라가 1급 기밀 관측 데이터를 들고 찾아온다. 이안은 카멜레온 메커니즘으로 고대 문명의 미스터리부터 초공간 통신망까지 인류의 새로운 진화 청사진을 제시하지만, 3광년 밖의 텐서 지문(PTA)이 과거 제네바 특이점과 완벽히 얽혀 있음을 확인하고 거대한 우주 지진이 다가오고 있음을 깨닫는다.",'
);

// 2. Remove Act 1 Chapter 1 completely
const chapter1StartStr = '        {\n          number: 1,\n          title: "제 1 장: 무너지는 제네바 가속기",';
const chapter2StartStr = '        {\n          number: 2,\n          title: "제 2 장: 스코틀랜드의 은둔자와 3년 만의 재회",';

const ch1Index = content.indexOf(chapter1StartStr);
const ch2Index = content.indexOf(chapter2StartStr);

if (ch1Index !== -1 && ch2Index !== -1) {
  content = content.slice(0, ch1Index) + content.slice(ch2Index);
} else {
  console.log("Could not find Chapter 1 or 2 boundaries for deletion.");
}

// 3. Renumber remaining chapters (2 to 6 -> 1 to 5)
// Need to be careful because Act 2, Act 3 etc also have Chapter 1, 2, 3...
// We only want to replace titles between ch2Index (now the start of Act 1 chapters) and the start of Act 2.

const act2StartIndex = content.indexOf('title: "제 2 막: 오디세우스의 투자자"');
let act1Content = content.slice(ch1Index, act2StartIndex); // ch1Index is where chapter 2 now starts

act1Content = act1Content.replace(/number: 2,\n\s*title: "제 2 장: 스코틀랜드의 은둔자와 3년 만의 재회"/g, 'number: 1,\n          title: "제 1 장: 스코틀랜드의 은둔자와 3년 만의 재회"');
act1Content = act1Content.replace(/number: 3,\n\s*title: "제 3 장: 암흑 유체의 상전이 수식 \(Chameleon Mechanism\)"/g, 'number: 2,\n          title: "제 2 장: 암흑 유체의 상전이 수식 (Chameleon Mechanism)"');
act1Content = act1Content.replace(/number: 4,\n\s*title: "제 4 장: 공간 유체 역학이 해명하는 잃어버린 역사와 미스터리"/g, 'number: 3,\n          title: "제 3 장: 공간 유체 역학이 해명하는 잃어버린 역사와 미스터리"');
act1Content = act1Content.replace(/number: 5,\n\s*title: "제 5 장: 초공간 문명으로의 진화 청사진과 붉은 전조"/g, 'number: 4,\n          title: "제 4 장: 초공간 문명으로의 진화 청사진과 붉은 전조"');
act1Content = act1Content.replace(/number: 6,\n\s*title: "제 6 장: 3광년 밖의 텐서 지문과 데칼코마니 \(Phase-locking\)"/g, 'number: 5,\n          title: "제 5 장: 3광년 밖의 텐서 지문과 데칼코마니 (Phase-locking)"');

content = content.slice(0, ch1Index) + act1Content + content.slice(act2StartIndex);

fs.writeFileSync(targetPath, content);
console.log('Successfully resolved overlap between Prologue and Act 1.');
