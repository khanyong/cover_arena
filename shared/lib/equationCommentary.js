import index from './equationCommentaryIndex.js';

export const equationCommentaryIndex = index;
export const normalizeDisplayMath = text => String(text).replace(/^\$\$[ \t]+(.+?)[ \t]+\$\$[ \t]*$/gm, (_match, math) => `$$\n${math}\n$$`);
const plain = node => node?.value ?? (node?.children || []).map(plain).join('');
const text = value => ({ type: 'text', value });
const link = (url, value) => ({ type: 'link', url, children: [text(value)] });
export const equationTarget = (language, kind, number) => kind === 'detail'
  ? `equation-detail-${language}-${number}`
  : `paragraph-${index.equations.find(e => e.number === number)?.source[language].unit}`;

/** Exact approved headings distinguish commentary from ordinary quotations/dialogue.
 * Only display structure and navigation are added. Stored manuscript text is untouched.
 */
export function remarkEquationCommentary(options = {}) {
  const resolve = options.resolve || ((language, kind, number) => `/novel/quantum-vibration-novel${language === 'en' ? '/en' : ''}#${equationTarget(language, kind, number)}`);
  return tree => {
    for (const node of tree.children || []) {
      if (node.type === 'blockquote') {
        const heading = plain(node.children?.[0]);
        const group = index.groups.find(g => Object.values(g.titles).includes(heading));
        if (!group || node.children?.[0]?.children?.[0]?.type !== 'strong') continue;
        const language = heading === group.titles.en ? 'en' : 'ko';
        node.data = { ...node.data, hProperties: { className: ['equation-commentary'], 'data-equation-note': group.number } };
        node.children.push({ type: 'paragraph', data: { hProperties: { className: ['equation-commentary-links'] } }, children: [text(language === 'ko' ? '상세 해설: ' : 'Detailed notes: '), ...group.equations.flatMap((n, i) => [...(i ? [text(' · ')] : []), link(resolve(language, 'detail', n), String(n))])] });
      }
      if (node.type === 'heading' && node.depth === 2) {
        const heading = plain(node);
        const equation = index.equations.find(e => ['en', 'ko'].some(l => heading === `${e.number}. ${e.titles[l]}`));
        if (!equation) continue;
        const language = heading === `${equation.number}. ${equation.titles.en}` ? 'en' : 'ko';
        node.data = { ...node.data, hProperties: { id: equationTarget(language, 'detail', equation.number), className: ['equation-detail-heading'] } };
        // Each companion entry is a complete stored block; append its return link after its conditions.
        tree.children.push({ type: 'paragraph', data: { hProperties: { className: ['equation-commentary-links'] } }, children: [link(resolve(language, 'source', equation.number), language === 'ko' ? '본문의 수식으로 돌아가기' : 'Return to the equation in the text')] });
      }
    }
  };
}
