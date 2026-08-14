import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createEmptyParagraph = (ver) => {
  const id = `p-${crypto.randomUUID()}`;
  return {
    id: id,
    activeVersion: ver,
    versions: {
      [ver]: {
        version: ver,
        content: "(이곳에 내용을 입력하세요)",
        note: "초안",
        createdAt: new Date().toISOString().substring(0, 16)
      }
    },
    aiPrompts: []
  };
};

const vol2Acts = [
  {
    number: 0,
    title: "프롤로그 (The Empty Urn)",
    summary: "어머니가 발견한 과거 아버지의 화장 기록. 화장 시간 2시간 전에 유골함이 이미 운송되었다. \"그렇다면 내가 묻은 재는 누구의 것이지?\"",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "과거 기록의 발견", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 1,
    title: "제 1 막 (After the End of the World)",
    summary: "우주 지진 이후 오디세우스 기술이 경제의 핵심이 됨. 몰락한 스털링이 이안을 찾아와 경고함. \"난 네 이론이 틀려서 두려웠던 게 아니야. 누군가 그것을 '소형화(Miniaturization)'할까 봐 두려웠던 거지.\"",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "달라진 세계와 스털링의 경고", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 2,
    title: "제 2 막 (The Ghost in the System)",
    summary: "한 국가의 블랙 프로그램이 오디세우스 코일을 수 미터로 축소한 'NEEDLE' 개발. 거리를 순간적으로 지워버려 방공망을 무력화시키는 무기. 동시에 아버지가 죽지 않고 블랙 사이트 'ORPHEUS'로 이송되었음을 알아냄.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "블랙 프로그램과 남겨진 흔적", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 3,
    title: "제 3 막 (Geometry Has No Flag)",
    summary: "미사일 없는 내부 폭발(Invisible Strike)의 발생. 어머니는 이것이 과거 아버지를 조작했던 False Flag의 패턴과 동일함을 찾아냄. 이안은 비밀 시설에 침투해 늙은 아버지를 만남. \"결국 건축가가 되었구나.\"",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "보이지 않는 타격과 재회", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 4,
    title: "제 4 막 (Who Owns Spacetime?)",
    summary: "아버지는 국가적 거짓 깃발 작전의 핵심 증인이라 삭제된 채 구금되어 있었음. 아버지는 조언함. \"너는 인간이 조작할 수 없는 우주를 찾았지만, 문제는 단 한 번도 우주였던 적이 없단다.\" 이안은 기술을 국가에 넘기는 대신 다국적 'Spacetime Commons'로 개방함.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "Spacetime Commons", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 5,
    title: "에필로그 (The Missing Room)",
    summary: "하지만 늦었음. 누군가 공간 연결성을 0으로 만드는 'Topological Severance(위상 절단)' 코드를 훔쳐 감. 사막의 비밀 연구소가 폭발도 없이 10x10m 빈 공간만 남기고 우주에서 완벽히 분리되며 끝남.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "위상 절단과 사라진 공간", paragraphs: [createEmptyParagraph('v1.0')] }]
  }
];

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  let book2 = novels.find(n => n.id === 'quantum-vibration-vol2');
  if (book2) {
    let data2 = { 
      ...book2.data, 
      title: "공간의 진동 2권: 권력의 기하학",
      subtitle: "BOOK II : THE GEOMETRY OF POWER",
      logline: "공간을 누가 지배할 권리가 있는가? (Who owns spacetime?)",
      acts: vol2Acts,
      slug: 'quantum-vibration-vol2' 
    };
    await supabase.from('novel_documents').update({ title: data2.title, data: data2 }).eq('id', 'quantum-vibration-vol2');
    console.log("Updated Book 2 structure");
  } else {
    console.log("Book 2 not found");
  }
}

main().catch(console.error);
