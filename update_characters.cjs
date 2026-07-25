const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. versionHistory 에 v4.0 추가
if (!content.includes('"v4.0"')) {
  content = content.replace(/versionHistory:\s*\[([^\]]+)\]/, (match, versions) => {
    return `versionHistory: [${versions.trim()}, "v4.0"]`;
  });
}

// 2. Characters 치환
const newCharacters = `characters: [
    {
      id: "ian",
      name: "이안 (Ian)",
      role: "공간 기하학자 / 학계의 이단아",
      description: "그의 천재성은 축복이 아닌 저주다. 칠판 위 3D 공간 곡률 그래프를 볼 때마다 그는 그것이 폭풍우 치는 바다처럼 자신을 집어삼키려 한다는 감각적 공포와 황홀경을 동시에 느낀다. 그의 고독은 타인의 부재가 아니라 우주의 비명을 홀로 목격하는 자의 형벌이다.",
      tagline: "공간은 비명 지르는 매질이며, 수식은 그 비명을 기록한 악보다."
    },
    {
      id: "sarah",
      name: "세라 (Sarah)",
      role: "응용 물리학 엔지니어",
      description: "이안의 추상적인 기하학을 물리적 실체로 붙잡는 '공학적 직관'의 소유자. 이안이 공간의 파동을 환영으로 본다면, 그녀는 기계 장치를 통해 그것을 '진동'으로 느끼고 제어한다. 이안의 위태로운 천재성을 현실의 단단한 지면에 접지시키는 유일한 파트너다.",
      tagline: "증명되지 않은 진리는 가공되지 않은 원석에 불과하다."
    },
    {
      id: "stirling",
      name: "스털링 (Stirling)",
      role: "주류 물리학계 거두",
      description: "단순한 꼰대 보수주의자가 아니다. 평생을 바쳐 쌓아온 '정적인 우주'라는 신념 체계가 붕괴되는 것을 목격하며 극심한 존재론적 위기(Ontological Dread)를 겪는 비극적 인물. 그의 분노는 권위 수호가 아니라 자신이 알던 우주가 낯선 괴물로 변하는 것에 대한 근원적인 공포 방어 기제다.",
      tagline: "우주는 정해진 상수 안에서만 안전하고 아름답다."
    }
  ],`;

content = content.replace(/characters:\s*\[[\s\S]*?\],\s*(?=\n\s*acts:)/, newCharacters + '\n');

fs.writeFileSync(targetPath, content);
console.log('Successfully updated characters and versionHistory for v4.0');
