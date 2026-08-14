import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const bible = {
  book2: {
    title: "공간의 진동: 권력의 기하학",
    subtitle: "BOOK II : THE GEOMETRY OF POWER",
    logline: "공간을 누가 지배할 권리가 있는가? (Who owns spacetime?)",
    acts: [
      { number: 0, title: "Prologue (The Empty Urn)", summary: "어머니가 발견한 과거 아버지의 화장 기록 의혹.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 1, title: "Act 1 (After the End of the World)", summary: "오디세우스 기술 경제 핵심화. 스털링의 경고.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 2, title: "Act 2 (The Ghost in the System)", summary: "NEEDLE 무기 개발 및 아버지 생존 사실 발견.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 3, title: "Act 3 (Geometry Has No Flag)", summary: "내부 폭발 발생. 비밀 시설 침투해 아버지 만남.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 4, title: "Act 4 (Who Owns Spacetime?)", summary: "기술을 Spacetime Commons로 개방.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 5, title: "Epilogue (The Missing Room)", summary: "Topological Severance 코드 도난 및 비밀 연구소 분리.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] }
    ]
  },
  book3: {
    title: "공간의 진동: 단절된 세계",
    subtitle: "BOOK III : THE SEVERED WORLD",
    logline: "존재 자체를 지워버리는 것이 무기가 될 수 있는가? (Can existence itself become a weapon?)",
    acts: [
      { number: 0, title: "Prologue (Zero Contact)", summary: "분리된 연구소의 마지막 통신.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 1, title: "Act 1 (Topological Deterrence)", summary: "도시 주위 위상을 닫아 분리하는 무기와 스털링의 마지막 일침.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 2, title: "Act 2 (The Severed World)", summary: "대규모 군사기지 소멸. False Flag 2.0 인지.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 3, title: "Act 3 (False Flag 2.0)", summary: "초기 Exact Cancellation의 변형 공격. 보복 공격 카운트다운.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 4, title: "Act 4 (Crossing the Cut)", summary: "단절된 우주 침투 및 위상 재연결을 통한 전쟁 저지.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 5, title: "Epilogue (A Universe with No Door)", summary: "재결합 불가능한 팽창하는 우주. 이안의 독백.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] }
    ]
  },
  book4: {
    title: "공간의 진동: 창세기의 건축가들",
    subtitle: "BOOK IV : ARCHITECTS OF GENESIS",
    logline: "창조할 능력이 있다고 해서 만들 권리까지 있는가? (Does understanding creation give us the right to create?)",
    acts: [
      { number: 0, title: "Prologue (The First Grain)", summary: "위상 매듭 안정화로 수소 원자 합성 성공.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 1, title: "Act 1 (The Loom of Matter)", summary: "물질은 공간의 기하학적 매듭임 입증.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 2, title: "Act 2 (Building a Universe)", summary: "제네시스 엔진 건설 및 첫 아기 우주(딸 우주) 생성.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 3, title: "Act 3 (The Creator's Paradox)", summary: "아기 우주의 복잡성 발견. 감옥 활용 시도 저지.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 4, title: "Act 4 (Architects of Genesis)", summary: "제네시스 기술 통제권 충돌. 영원한 지배의 사슬인 탯줄 인식.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] },
      { number: 5, title: "Final Epilogue (The Compass)", summary: "탯줄 절단 및 우주의 완전한 독립. 통제의 한계를 인정함.", chapters: [{ number: 1, title: "시작", synopsis: "", paragraphs: [] }] }
    ]
  }
};

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  // Book 2
  let book2 = novels.find(n => n.id === 'quantum-vibration-vol2');
  if (book2) {
    let data2 = { ...book2.data, ...bible.book2, slug: 'quantum-vibration-vol2' };
    await supabase.from('novel_documents').update({ title: data2.title, data: data2 }).eq('id', 'quantum-vibration-vol2');
    console.log("Updated Book 2");
  }

  // Book 3
  let book3 = novels.find(n => n.id === 'quantum-vibration-vol3');
  if (book3) {
    let data3 = { ...book3.data, ...bible.book3, slug: 'quantum-vibration-vol3' };
    await supabase.from('novel_documents').update({ title: data3.title, data: data3 }).eq('id', 'quantum-vibration-vol3');
    console.log("Updated Book 3");
  }

  // Delete corrupted en rows
  await supabase.from('novel_documents').delete().in('id', ['quantum-vibration-vol2-en', 'quantum-vibration-vol3-en']);
  console.log("Deleted corrupted en rows");

  // Create Book 4
  const book4Slug = 'quantum-vibration-vol4';
  const data4 = { ...book2.data, ...bible.book4, slug: book4Slug }; // use book2.data as base to retain generic novel structure
  const { error: err4 } = await supabase.from('novel_documents').insert([{ id: book4Slug, slug: book4Slug, title: data4.title, data: data4 }]);
  if (err4) console.log("Insert Book 4 error:", err4.message);
  else console.log("Created Book 4");
}

main().catch(console.error);
