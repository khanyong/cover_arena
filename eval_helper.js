
  function getParagraphText(
  paragraph: NovelParagraph,
  versionKey: string
): string {
  if (paragraph.versions[versionKey]) {
    return paragraph.versions[versionKey].content;
  }
  if (paragraph.versions[paragraph.activeVersion]) {
    return paragraph.versions[paragraph.activeVersion].content;
  }
  const keys = Object.keys(paragraph.versions);
  return keys.length > 0 ? paragraph.versions[keys[keys.length - 1]].content : "";
}
  function getSceneTitle(
  scene: NovelScene,
  customVersionMap?: Record<string, string>
): string {
  // 사용자가 명시적으로 지은 진짜 제목인지 확인 (플레이스홀더성 제목 제외)
  const isPlaceholderTitle = !scene.title || scene.title === '새 장면' || scene.title.startsWith('SCENE ');
  if (!isPlaceholderTitle) return scene.title;
  
  if (scene.paragraphs && scene.paragraphs.length > 0) {
    const firstParagraph = scene.paragraphs[0];
    const versionKey = customVersionMap ? customVersionMap[firstParagraph.id] : undefined;
    const text = getParagraphText(firstParagraph, versionKey || firstParagraph.activeVersion).trim();
    
    if (text) {
      // 1. 첫 번째 줄(Line break 기준)만 가져오기
      let firstLine = text.split('\n')[0].trim();
      
      // 2. 마크다운 헤더(### 등) 기호 제거
      firstLine = firstLine.replace(/^#+\s*/, '').trim();
      
      // 3. 만약 줄 전체가 대괄호 [ ] 로 감싸져 있다면 제거 (예: [Scene 1: Title])
      firstLine = firstLine.replace(/^\[(.*?)\]$/, '$1').trim();
      
      // 4. 문장 부호 분리 로직 (첫 줄이 너무 길 경우에만 마침표 등으로 자르기)
      const sentenceMatch = firstLine.match(/^.*?[.?!](?:\s|$)/);
      let title = firstLine;
      
      if (title.length > 50 && sentenceMatch) {
         title = sentenceMatch[0].trim();
      }
      
      if (title.length > 40) {
        title = title.substring(0, 40) + '...';
      }
      
      if (title) return title;
    }
  }
  
  return `SCENE ${scene.number}`;
}
  
  module.exports = { getSceneTitle };
