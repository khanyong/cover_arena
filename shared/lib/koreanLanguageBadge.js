// Language presence only. Edition integrity and author decisions are separate.
export function hasDisplayedKorean({ novelSlug, scene, customVersionMap = {} }) {
  if (novelSlug !== 'quantum-vibration-novel' || !Array.isArray(scene?.paragraphs)) return false;
  return scene.paragraphs.some(paragraph => {
    const selected = customVersionMap[paragraph?.id] || paragraph?.activeVersion;
    const content = paragraph?.versions?.[selected]?.content;
    return typeof content === 'string' && /[가-힣]/u.test(content);
  });
}
