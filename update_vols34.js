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

const vol3Acts = [
  {
    number: 0,
    title: "프롤로그 (Zero Contact)",
    summary: "분리된 연구소의 마지막 통신. \"We're still here.\" (그들은 죽지 않았다. 영구 격리되었을 뿐이다.)",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "마지막 통신", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 1,
    title: "제 1 막 (Topological Deterrence)",
    summary: "새로운 군사 독트린의 탄생. 도시 주위의 위상을 닫아버려 우주에서 분리하는 무기. 스털링의 마지막 일침. \"넌 권위 없는 진실을 원했지. 이제 진실이 궁극의 권위가 되어버렸군.\"",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "위상학적 억지력", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 2,
    title: "제 2 막 (The Severed World)",
    summary: "대규모 군사기지가 지형째로 사라짐. 분석 결과 내부의 시간은 흐르고 있음. 어머니는 이것이 전쟁을 유발하려는 False Flag 2.0임을 알아냄. 한 개인을 제거하던 기술이 국가를 제거하는 기술이 됨.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "단절된 세계와 사라진 기지", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 3,
    title: "제 3 막 (False Flag 2.0)",
    summary: "제2의 사라예보. 이안은 공격 서명이 자신이 만든 코드가 아니라 스털링이 제네바에서 훔쳤던 '초기 Exact Cancellation'의 변형임을 알아냄. 양국 모두 이안을 의심하며 보복 공격(Retaliation)까지 남은 시간 17분.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "공격의 진짜 서명", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 4,
    title: "제 4 막 (Crossing the Cut)",
    summary: "이안과 세라가 역위상 튜브를 타고 사상 최초로 '단절된 우주(Closed Manifold)' 내부로 직접 침투. 세라가 깨닫는다. \"감옥을 만드는 수학과, 창세기의 수학은 동일한 방정식이야.\" 이안은 목숨을 걸고 위상을 재연결(Reconnection)해 전쟁을 막음.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "단절된 우주로의 침투", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 5,
    title: "에필로그 (A Universe with No Door)",
    summary: "하지만 첫 번째 실험으로 잘려 나간 작은 공간은 이미 너무 멀리 진화하여 재결합 불가능. 내부가 팽창 중임. 이안의 독백. \"우린 감옥을 만든 줄 알았는데... 우주를 만든 거였어.\"",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "새로운 우주의 탄생", paragraphs: [createEmptyParagraph('v1.0')] }]
  }
];

const vol4Acts = [
  {
    number: 0,
    title: "프롤로그 (The First Grain)",
    summary: "수년 후. 1권 에필로그의 씨앗 회수. 이안과 세라가 공간의 위상 매듭(Topological winding)을 안정화하여 텐서 에너지를 질량으로 변환($E_{\\text{tensor}} \\rightarrow mc^2$)하는 데 성공. 인류 최초의 수소 원자(Hydrogen Atom)를 합성함.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "첫 번째 입자", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 1,
    title: "제 1 막 (The Loom of Matter)",
    summary: "물질은 공간의 안정된 기하학적 매듭임이 입증됨. 하지만 효율은 극도로 낮아 무한한 자원 생성기는 아님. 입자와 단절된 우주(Severed Universe)가 스케일만 다를 뿐 동일한 수학적 프랙탈 구조임이 완성됨.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "물질의 베틀", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 2,
    title: "제 2 막 (Building a Universe)",
    summary: "'제네시스 엔진' 건설. 밴스 등 팽창주의자들은 파괴된 지구를 두고 싸울 바에 새로운 우주(Eden)를 무한히 만들어 확장하자고 주장함. 초기 조건을 조절해 인류가 최초로 딸 우주(Daughter Universe)를 의도적으로 생성함. 모두가 축하하지만 이안은 두려움을 느낌.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "제네시스 엔진 가동", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 3,
    title: "제 3 막 (The Creator's Paradox)",
    summary: "첫 아기 우주에서 장기적인 복잡성(생명 존재 가능성)이 발견됨. 실험 윤리가 우주론으로 바뀜. 일부 국가는 제네시스 기술을 범죄자나 위험 AI를 영구 격리할 감옥으로 쓰려 함. 어머니의 마지막 대답. \"힘 있는 자들이 인간을 변수 취급했기에 네 아버지가 파멸했다. 네가 우주를 변수 취급할 만큼 강력해져서는 안 된다.\"",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "창조자의 역설과 윤리", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 4,
    title: "제 4 막 (Architects of Genesis)",
    summary: "제네시스 기술 통제권을 둔 마지막 충돌. 이안은 아기 우주를 부모 우주(지구)와 연결해 두는 '탯줄(Umbilical Cord)'이 관측과 자원을 가능하게 하지만, 동시에 영원한 지배의 사슬임을 깨닫는다. 모든 변수를 통제하고 싶어 했던 이안은 자신이 만든 우주를 살리기 위해, 영원히 알 수 없는 상태로 놓아주어야 하는 가장 고통스러운 선택을 마주한다.",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "영원한 지배의 탯줄", paragraphs: [createEmptyParagraph('v1.0')] }]
  },
  {
    number: 5,
    title: "최종 에필로그 (The Compass)",
    summary: "이안은 메인 콘솔에서 마지막 명령 `[Sever (절단)]`을 실행한다. 탯줄 위상이 사라지고 우주가 완전히 독립함. 이안은 늙은 아버지의 은빛 제도용 컴퍼스를 손에 쥐고 있음. 컴퍼스의 진정한 역할은 선을 긋는 것, 즉 \"어디까지 통제할지 스스로 경계(한계)를 긋는 것\"임을 깨달음. 컴퍼스를 닫는다. 아무런 신호도 돌아오지 않는 것은 실패가 아니라 완전한 독립의 증거. \"I must let it go.\"",
    chapters: [{ number: 1, title: "제 1 장", synopsis: "독립과 경계", paragraphs: [createEmptyParagraph('v1.0')] }]
  }
];

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  // Update Book 3
  let book3 = novels.find(n => n.id === 'quantum-vibration-vol3');
  if (book3) {
    let data3 = { 
      ...book3.data, 
      title: "공간의 진동 3권: 단절된 세계",
      subtitle: "BOOK III : THE SEVERED WORLD",
      logline: "존재 자체를 지워버리는 것이 무기가 될 수 있는가? (Can existence itself become a weapon?)",
      acts: vol3Acts,
      slug: 'quantum-vibration-vol3' 
    };
    await supabase.from('novel_documents').update({ title: data3.title, data: data3 }).eq('id', 'quantum-vibration-vol3');
    console.log("Updated Book 3 structure");
  } else {
    console.log("Book 3 not found");
  }

  // Update Book 4
  let book4 = novels.find(n => n.id === 'quantum-vibration-vol4');
  if (book4) {
    let data4 = { 
      ...book4.data, 
      title: "공간의 진동 4권: 창세기의 건축가들",
      subtitle: "BOOK IV : ARCHITECTS OF GENESIS",
      logline: "창조할 능력이 있다고 해서 만들 권리까지 있는가? (Does understanding creation give us the right to create?)",
      acts: vol4Acts,
      slug: 'quantum-vibration-vol4' 
    };
    await supabase.from('novel_documents').update({ title: data4.title, data: data4 }).eq('id', 'quantum-vibration-vol4');
    console.log("Updated Book 4 structure");
  } else {
    console.log("Book 4 not found");
  }
}

main().catch(console.error);
