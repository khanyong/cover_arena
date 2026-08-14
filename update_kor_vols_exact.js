import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createParagraph = (ver, content) => {
  const id = `p-${crypto.randomUUID()}`;
  return {
    id: id,
    activeVersion: ver,
    versions: {
      [ver]: {
        version: ver,
        content: content,
        note: "초안",
        createdAt: new Date().toISOString().substring(0, 16)
      }
    },
    aiPrompts: []
  };
};

const vol2Logline = `* **Core Question:** 공간을 누가 지배할 권리가 있는가? (Who owns spacetime?)
* **Genre:** 정치 SF + 테크노 첩보 스릴러 (스케일의 축소, 밀도의 상승)
* **Ian's Arc:** Control -> Doubt (통제의 한계와 의심)

[핵심 구조 및 플롯]
1권에서 우주가 적이었다면, 2권에서는 **인간**이 적이 됩니다.`;

const vol2ActsExact = [
  {
    number: 0,
    title: "Prologue (The Empty Urn)",
    summary: `어머니가 발견한 과거 아버지의 화장 기록. 화장 시간 2시간 전에 유골함이 이미 운송되었다. *"그렇다면 내가 묻은 재는 누구의 것이지?"*`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "빈 유골함", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 1,
    title: "Act 1 (After the End of the World)",
    summary: `우주 지진 이후 오디세우스 기술이 경제의 핵심이 됨. 몰락한 스털링이 이안을 찾아와 경고함. *"난 네 이론이 틀려서 두려웠던 게 아니야. 누군가 그것을 '소형화(Miniaturization)'할까 봐 두려웠던 거지."*`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "경고", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 2,
    title: "Act 2 (The Ghost in the System)",
    summary: `한 국가의 블랙 프로그램이 오디세우스 코일을 수 미터로 축소한 **'NEEDLE'** 개발. 거리를 순간적으로 지워버려 방공망을 무력화시키는 무기. 동시에 아버지가 죽지 않고 블랙 사이트 'ORPHEUS'로 이송되었음을 알아냄.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "비밀의 발견", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 3,
    title: "Act 3 (Geometry Has No Flag)",
    summary: `미사일 없는 내부 폭발(Invisible Strike)의 발생. 어머니는 이것이 과거 아버지를 조작했던 False Flag의 패턴과 동일함을 찾아냄. 이안은 비밀 시설에 침투해 늙은 아버지를 만남. *"결국 건축가가 되었구나."*`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "보이지 않는 타격", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 4,
    title: "Act 4 (Who Owns Spacetime?)",
    summary: `아버지는 국가적 거짓 깃발 작전의 핵심 증인이라 삭제된 채 구금되어 있었음. 아버지는 조언함. *"너는 인간이 조작할 수 없는 우주를 찾았지만, 문제는 단 한 번도 우주였던 적이 없단다."* 이안은 기술을 국가에 넘기는 대신 다국적 'Spacetime Commons'로 개방함.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "통제의 포기", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 5,
    title: "Epilogue (The Missing Room)",
    summary: `하지만 늦었음. 누군가 공간 연결성을 0으로 만드는 **'Topological Severance(위상 절단)'** 코드를 훔쳐 감. 사막의 비밀 연구소가 폭발도 없이 10x10m 빈 공간만 남기고 우주에서 완벽히 분리되며 끝남.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "위상 절단", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  }
];

const vol3Logline = `* **Core Question:** 존재 자체를 지워버리는 것이 무기가 될 수 있는가? (Can existence itself become a weapon?)
* **Genre:** 지정학적 SF + 실존적 전쟁 스릴러
* **Ian's Arc:** Doubt -> Responsibility (자신이 연 판도라의 상자에 대한 책임감)

[핵심 구조 및 플롯]
적을 죽이는 핵무기를 넘어, 현실과의 연결을 끊어버리는 '위상학적 억지력'의 공포.`;

const vol3ActsExact = [
  {
    number: 0,
    title: "Prologue (Zero Contact)",
    summary: `분리된 연구소의 마지막 통신. *"We're still here."* (그들은 죽지 않았다. 영구 격리되었을 뿐이다.)`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "연결 끊김", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 1,
    title: "Act 1 (Topological Deterrence)",
    summary: `새로운 군사 독트린의 탄생. 도시 주위의 위상을 닫아버려 우주에서 분리하는 무기. 스털링의 마지막 일침. *"넌 권위 없는 진실을 원했지. 이제 진실이 궁극의 권위가 되어버렸군."*`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "진실의 무게", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 2,
    title: "Act 2 (The Severed World)",
    summary: `대규모 군사기지가 지형째로 사라짐. 분석 결과 내부의 시간은 흐르고 있음. 어머니는 이것이 전쟁을 유발하려는 False Flag 2.0임을 알아냄. 한 개인을 제거하던 기술이 국가를 제거하는 기술이 됨.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "사라진 기지", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 3,
    title: "Act 3 (False Flag 2.0)",
    summary: `제2의 사라예보. 이안은 공격 서명이 자신이 만든 코드가 아니라 스털링이 제네바에서 훔쳤던 '초기 Exact Cancellation'의 변형임을 알아냄. 양국 모두 이안을 의심하며 보복 공격(Retaliation)까지 남은 시간 17분.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "17분의 카운트다운", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 4,
    title: "Act 4 (Crossing the Cut)",
    summary: `이안과 세라가 역위상 튜브를 타고 사상 최초로 '단절된 우주(Closed Manifold)' 내부로 직접 침투. 세라가 깨닫는다. **"감옥을 만드는 수학과, 창세기의 수학은 동일한 방정식이야."** 이안은 목숨을 걸고 위상을 재연결(Reconnection)해 전쟁을 막음.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "방정식의 본질", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 5,
    title: "Epilogue (A Universe with No Door)",
    summary: `하지만 첫 번째 실험으로 잘려 나간 작은 공간은 이미 너무 멀리 진화하여 재결합 불가능. 내부가 팽창 중임. 이안의 독백. *"우린 감옥을 만든 줄 알았는데... 우주를 만든 거였어."*`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "우주의 탄생", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  }
];

const vol4Logline = `* **Core Question:** 창조할 능력이 있다고 해서 만들 권리까지 있는가? (Does understanding creation give us the right to create?)
* **Genre:** 우주론적 하드 SF + 철학적 SF
* **Ian's Arc:** Responsibility -> Humility (창조주의 겸손과 놓아줌)

[핵심 구조 및 플롯]
이 권의 적은 국가도 재난도 아닌 '인간 자신의 창조 능력과 오만'입니다.`;

const vol4ActsExact = [
  {
    number: 0,
    title: "Prologue (The First Grain)",
    summary: `수년 후. 1권 에필로그의 씨앗 회수. 이안과 세라가 공간의 위상 매듭(Topological winding)을 안정화하여 텐서 에너지를 질량으로 변환(E_tensor -> mc^2)하는 데 성공. 인류 최초의 수소 원자(Hydrogen Atom)를 합성함.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "첫 원자", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 1,
    title: "Act 1 (The Loom of Matter)",
    summary: `물질은 공간의 안정된 기하학적 매듭임이 입증됨. 하지만 효율은 극도로 낮아 무한한 자원 생성기는 아님. 입자와 단절된 우주(Severed Universe)가 스케일만 다를 뿐 동일한 수학적 프랙탈 구조임이 완성됨.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "프랙탈 구조", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 2,
    title: "Act 2 (Building a Universe)",
    summary: `'제네시스 엔진' 건설. 밴스 등 팽창주의자들은 파괴된 지구를 두고 싸울 바에 새로운 우주(Eden)를 무한히 만들어 확장하자고 주장함. 초기 조건을 조절해 인류가 최초로 딸 우주(Daughter Universe)를 의도적으로 생성함. 모두가 축하하지만 이안은 두려움을 느낌.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "딸 우주", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 3,
    title: "Act 3 (The Creator's Paradox)",
    summary: `첫 아기 우주에서 장기적인 복잡성(생명 존재 가능성)이 발견됨. 실험 윤리가 우주론으로 바뀜. 일부 국가는 제네시스 기술을 범죄자나 위험 AI를 영구 격리할 감옥으로 쓰려 함. 어머니의 마지막 대답. *"힘 있는 자들이 인간을 변수 취급했기에 네 아버지가 파멸했다. 네가 우주를 변수 취급할 만큼 강력해져서는 안 된다."*`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "창조자의 딜레마", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 4,
    title: "Act 4 (Architects of Genesis)",
    summary: `제네시스 기술 통제권을 둔 마지막 충돌. 이안은 아기 우주를 부모 우주(지구)와 연결해 두는 '탯줄(Umbilical Cord)'이 관측과 자원을 가능하게 하지만, 동시에 영원한 지배의 사슬임을 깨닫는다. 모든 변수를 통제하고 싶어 했던 이안은 자신이 만든 우주를 살리기 위해, 영원히 알 수 없는 상태로 놓아주어야 하는 가장 고통스러운 선택을 마주한다.`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "선택", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  },
  {
    number: 5,
    title: "Final Epilogue (The Compass)",
    summary: `이안은 메인 콘솔에서 마지막 명령 \`[Sever (절단)]\`을 실행한다. 탯줄 위상이 사라지고 우주가 완전히 독립함.
이안은 늙은 아버지의 은빛 제도용 컴퍼스를 손에 쥐고 있음. 컴퍼스의 진정한 역할은 선을 긋는 것, 즉 "어디까지 통제할지 스스로 경계(한계)를 긋는 것"임을 깨달음. 컴퍼스를 닫는다. 아무런 신호도 돌아오지 않는 것은 실패가 아니라 완전한 독립의 증거. *"I must let it go."*`,
    chapters: [{ number: 1, title: "제 1 장", synopsis: "컴퍼스의 의미", paragraphs: [createParagraph('v1.0', `(내용을 입력하세요)`)] }]
  }
];

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  // Book 2 KOR
  let vol2 = novels.find(n => n.id === 'quantum-vibration-vol2');
  if (vol2) {
    let data2 = { ...vol2.data, logline: vol2Logline, acts: vol2ActsExact };
    await supabase.from('novel_documents').update({ data: data2 }).eq('id', 'quantum-vibration-vol2');
    console.log("Updated Book 2 KOR exact");
  }

  // Book 3 KOR
  let vol3 = novels.find(n => n.id === 'quantum-vibration-vol3');
  if (vol3) {
    let data3 = { ...vol3.data, logline: vol3Logline, acts: vol3ActsExact };
    await supabase.from('novel_documents').update({ data: data3 }).eq('id', 'quantum-vibration-vol3');
    console.log("Updated Book 3 KOR exact");
  }

  // Book 4 KOR
  let vol4 = novels.find(n => n.id === 'quantum-vibration-vol4');
  if (vol4) {
    let data4 = { ...vol4.data, logline: vol4Logline, acts: vol4ActsExact };
    await supabase.from('novel_documents').update({ data: data4 }).eq('id', 'quantum-vibration-vol4');
    console.log("Updated Book 4 KOR exact");
  }
}

main().catch(console.error);
