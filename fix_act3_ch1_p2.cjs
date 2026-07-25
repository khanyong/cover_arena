const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'components/NovelPlatform/novelData.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const targetId = 'act3-ch1-p2';
const pIndex = content.indexOf(`id: "${targetId}"`);
if (pIndex !== -1) {
  const v6Index = content.indexOf('"v6.0": {', pIndex);
  if (v6Index !== -1) {
    const contentIndex = content.indexOf('content: "', v6Index);
    if (contentIndex !== -1) {
      const endQuoteIndex = content.indexOf('",\n', contentIndex);
      if (endQuoteIndex !== -1) {
        const newText = "그때, 절망에 빠진 이안의 어깨를 거칠게 밀쳐내며 세라가 나섰다. \\\"이안, 당신의 수학은 완벽해! 이 낡아빠진 기계가 기하학의 속도를 못 따라갈 뿐이야!\\\" 그녀는 공포에 떠는 대신 붉게 달아오르는 콘솔 덮개를 맨손으로 뜯어냈다. 치솟는 증기 속에서 폭주하는 냉각 밸브를 수동으로 강제 바이패스(Bypass)시키고, 예비 전력 텐서를 주 도선에 직접 스패너로 찍어 눌러 접지시켜 버렸다. \\\"증명되지 않은 진리는 가공되지 않은 원석일 뿐이야!\\\" 그녀는 이안의 수식이 현실과 마찰하며 빚어낸 오차를, 거친 쇳덩이와 공학적 직관으로 무자비하게 짓이겨 맞춰냈다. 그 순간, 방어막이 굉음을 내며 억지로 가동되었고 선체를 둘러싼 대기가 유리처럼 단단하게 응축되며 눈부신 기하학적 갑옷으로 돌변했다.";
        content = content.slice(0, contentIndex + 'content: "'.length) + newText + content.slice(endQuoteIndex);
        fs.writeFileSync(targetPath, content);
        console.log('Successfully updated act3-ch1-p2 for v6.0');
      }
    }
  }
}
