import { initialNovelData } from './components/NovelPlatform/novelData';

const act3 = initialNovelData.acts.find(a => a.number === 3);
const ch2 = act3.chapters.find(c => c.number === 2);

console.log(JSON.stringify(ch2.scenes.map(s => s.id), null, 2));
