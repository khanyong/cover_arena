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
        note: "핵심 대사 및 플롯",
        createdAt: new Date().toISOString().substring(0, 16)
      }
    },
    aiPrompts: []
  };
};

const vol2ActsDetailed = [
  {
    number: 0,
    title: "프롤로그 (The Empty Urn)",
    summary: "어머니가 발견한 과거 아버지의 화장 기록. 화장 시간 2시간 전에 유골함이 이미 운송되었다.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "빈 유골함", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\n"그렇다면 내가 묻은 재는 누구의 것이지?"`)] 
    }]
  },
  {
    number: 1,
    title: "제 1 막 (After the End of the World)",
    summary: "우주 지진 이후 오디세우스 기술이 경제의 핵심이 됨. 몰락한 스털링이 이안을 찾아와 경고함.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "세계의 끝 그 이후", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\n스털링: "난 네 이론이 틀려서 두려웠던 게 아니야. 누군가 그것을 '소형화(Miniaturization)'할까 봐 두려웠던 거지."`)] 
    }]
  },
  {
    number: 2,
    title: "제 2 막 (The Ghost in the System)",
    summary: "한 국가의 블랙 프로그램이 오디세우스 코일을 수 미터로 축소한 'NEEDLE' 개발. 거리를 순간적으로 지워버려 방공망을 무력화시키는 무기. 동시에 아버지가 죽지 않고 블랙 사이트 'ORPHEUS'로 이송되었음을 알아냄.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "시스템 안의 유령", 
      paragraphs: [createParagraph('v1.0', `**[핵심 요소]**\n* 공간 기하학의 무기화 (소형화)\n* 블랙 사이트 'ORPHEUS'의 발견`)] 
    }]
  },
  {
    number: 3,
    title: "제 3 막 (Geometry Has No Flag)",
    summary: "미사일 없는 내부 폭발(Invisible Strike)의 발생. 어머니는 이것이 과거 아버지를 조작했던 False Flag의 패턴과 동일함을 찾아냄. 이안은 비밀 시설에 침투해 늙은 아버지를 만남.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "기하학에는 국기가 없다", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\nYoo Ji-man (아버지): "결국 건축가가 되었구나."`)] 
    }]
  },
  {
    number: 4,
    title: "제 4 막 (Who Owns Spacetime?)",
    summary: "아버지는 국가적 거짓 깃발 작전의 핵심 증인이라 삭제된 채 구금되어 있었음. 이안은 기술을 국가에 넘기는 대신 다국적 'Spacetime Commons'로 개방함.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "시공간은 누구의 것인가?", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\nYoo Ji-man (아버지): "너는 인간이 조작할 수 없는 우주를 찾았지만, 문제는 단 한 번도 우주였던 적이 없단다."`)] 
    }]
  },
  {
    number: 5,
    title: "에필로그 (The Missing Room)",
    summary: "하지만 늦었음. 누군가 공간 연결성을 0으로 만드는 'Topological Severance(위상 절단)' 코드를 훔쳐 감. 사막의 비밀 연구소가 폭발도 없이 10x10m 빈 공간만 남기고 우주에서 완벽히 분리되며 끝남.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "사라진 방", 
      paragraphs: [createParagraph('v1.0', `(3권을 위한 씨앗이 심어짐)`)] 
    }]
  }
];

const vol3ActsDetailed = [
  {
    number: 0,
    title: "프롤로그 (Zero Contact)",
    summary: "분리된 연구소의 마지막 통신. (그들은 죽지 않았다. 영구 격리되었을 뿐이다.)",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "마지막 통신", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\n"We're still here."`)] 
    }]
  },
  {
    number: 1,
    title: "제 1 막 (Topological Deterrence)",
    summary: "새로운 군사 독트린의 탄생. 도시 주위의 위상을 닫아버려 우주에서 분리하는 무기. 스털링의 마지막 일침.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "위상학적 억지력", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\n스털링: "넌 권위 없는 진실을 원했지. 이제 진실이 궁극의 권위가 되어버렸군."`)] 
    }]
  },
  {
    number: 2,
    title: "제 2 막 (The Severed World)",
    summary: "대규모 군사기지가 지형째로 사라짐. 분석 결과 내부의 시간은 흐르고 있음. 어머니는 이것이 전쟁을 유발하려는 False Flag 2.0임을 알아냄. 한 개인을 제거하던 기술이 국가를 제거하는 기술이 됨.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "단절된 세계", 
      paragraphs: [createParagraph('v1.0', `**[핵심 요소]**\n* 단절된 구역의 끔찍한 현실 (존재의 감옥)\n* 거시적 스케일로 진화한 거짓 깃발 작전`)] 
    }]
  },
  {
    number: 3,
    title: "제 3 막 (False Flag 2.0)",
    summary: "제2의 사라예보. 이안은 공격 서명이 자신이 만든 코드가 아니라 스털링이 제네바에서 훔쳤던 '초기 Exact Cancellation'의 변형임을 알아냄. 양국 모두 이안을 의심하며 보복 공격(Retaliation)까지 남은 시간 17분.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "거짓 깃발 2.0", 
      paragraphs: [createParagraph('v1.0', `**[핵심 요소]**\n* 전 지구적 위상 보복 공격까지 남은 17분의 카운트다운\n* 도난당했던 제네바 코드의 귀환`)] 
    }]
  },
  {
    number: 4,
    title: "제 4 막 (Crossing the Cut)",
    summary: "이안과 세라가 역위상 튜브를 타고 사상 최초로 '단절된 우주(Closed Manifold)' 내부로 직접 침투. 이안은 목숨을 걸고 위상을 재연결(Reconnection)해 전쟁을 막음.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "단면을 건너다", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\n세라: "감옥을 만드는 수학과, 창세기의 수학은 동일한 방정식이야."`)] 
    }]
  },
  {
    number: 5,
    title: "에필로그 (A Universe with No Door)",
    summary: "하지만 첫 번째 실험으로 잘려 나간 작은 공간은 이미 너무 멀리 진화하여 재결합 불가능. 내부가 팽창 중임.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "문이 없는 우주", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\n이안의 독백: "우린 감옥을 만든 줄 알았는데... 우주를 만든 거였어."`)] 
    }]
  }
];

const vol4ActsDetailed = [
  {
    number: 0,
    title: "프롤로그 (The First Grain)",
    summary: "수년 후. 1권 에필로그의 씨앗 회수. 이안과 세라가 공간의 위상 매듭(Topological winding)을 안정화하여 텐서 에너지를 질량으로 변환(E_tensor -> mc^2)하는 데 성공. 인류 최초의 수소 원자(Hydrogen Atom)를 합성함.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "첫 번째 입자", 
      paragraphs: [createParagraph('v1.0', `(프롤로그 본문 입력)`)] 
    }]
  },
  {
    number: 1,
    title: "제 1 막 (The Loom of Matter)",
    summary: "물질은 공간의 안정된 기하학적 매듭임이 입증됨. 하지만 효율은 극도로 낮아 무한한 자원 생성기는 아님. 입자와 단절된 우주(Severed Universe)가 스케일만 다를 뿐 동일한 수학적 프랙탈 구조임이 완성됨.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "물질의 베틀", 
      paragraphs: [createParagraph('v1.0', `**[핵심 요소]**\n* 공간 기하학으로부터 물질 합성\n* 양자 입자와 거시 우주를 잇는 프랙탈적 깨달음`)] 
    }]
  },
  {
    number: 2,
    title: "제 2 막 (Building a Universe)",
    summary: "'제네시스 엔진' 건설. 밴스 등 팽창주의자들은 파괴된 지구를 두고 싸울 바에 새로운 우주(Eden)를 무한히 만들어 확장하자고 주장함. 초기 조건을 조절해 인류가 최초로 딸 우주(Daughter Universe)를 의도적으로 생성함. 모두가 축하하지만 이안은 두려움을 느낌.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "우주 건설", 
      paragraphs: [createParagraph('v1.0', `**[핵심 요소]**\n* 최초의 의도적인 아기 우주 생성\n* 생존에서 무한 팽창으로 패러다임 전환`)] 
    }]
  },
  {
    number: 3,
    title: "제 3 막 (The Creator's Paradox)",
    summary: "첫 아기 우주에서 장기적인 복잡성(생명 존재 가능성)이 발견됨. 실험 윤리가 우주론으로 바뀜. 일부 국가는 제네시스 기술을 범죄자나 위험 AI를 영구 격리할 감옥으로 쓰려 함.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "창조자의 역설", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\n어머니의 마지막 대답: "힘 있는 자들이 인간을 변수 취급했기에 네 아버지가 파멸했다. 네가 우주를 변수 취급할 만큼 강력해져서는 안 된다."`)] 
    }]
  },
  {
    number: 4,
    title: "제 4 막 (Architects of Genesis)",
    summary: "제네시스 기술 통제권을 둔 마지막 충돌. 이안은 아기 우주를 부모 우주(지구)와 연결해 두는 '탯줄(Umbilical Cord)'이 관측과 자원을 가능하게 하지만, 동시에 영원한 지배의 사슬임을 깨닫는다. 모든 변수를 통제하고 싶어 했던 이안은 자신이 만든 우주를 살리기 위해, 영원히 알 수 없는 상태로 놓아주어야 하는 가장 고통스러운 선택을 마주한다.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "창세기의 건축가들", 
      paragraphs: [createParagraph('v1.0', `**[핵심 요소]**\n* 창조물의 소유권을 둘러싼 지정학적 전쟁\n* 탯줄에 관한 철학적 역설`)] 
    }]
  },
  {
    number: 5,
    title: "최종 에필로그 (The Compass)",
    summary: "이안은 메인 콘솔에서 마지막 명령 [Sever (절단)]을 실행한다. 탯줄 위상이 사라지고 우주가 완전히 독립함. 이안은 늙은 아버지의 은빛 제도용 컴퍼스를 손에 쥐고 있음. 컴퍼스의 진정한 역할은 선을 긋는 것, 즉 '어디까지 통제할지 스스로 경계(한계)를 긋는 것'임을 깨달음. 컴퍼스를 닫는다. 아무런 신호도 돌아오지 않는 것은 실패가 아니라 완전한 독립의 증거.",
    chapters: [{ 
      number: 1, 
      title: "제 1 장", 
      synopsis: "나침반과 경계", 
      paragraphs: [createParagraph('v1.0', `**[핵심 대사]**\n이안: "I must let it go. (나는 놓아주어야 한다.)"`)] 
    }]
  }
];

async function main() {
  const { data: novels, error } = await supabase.from('novel_documents').select('*');
  if (error) throw error;
  
  // Book 2 KOR
  let vol2 = novels.find(n => n.id === 'quantum-vibration-vol2');
  if (vol2) {
    let data2 = { ...vol2.data, acts: vol2ActsDetailed };
    await supabase.from('novel_documents').update({ data: data2 }).eq('id', 'quantum-vibration-vol2');
    console.log("Updated Book 2 KOR with detailed synopses and dialogue");
  }

  // Book 3 KOR
  let vol3 = novels.find(n => n.id === 'quantum-vibration-vol3');
  if (vol3) {
    let data3 = { ...vol3.data, acts: vol3ActsDetailed };
    await supabase.from('novel_documents').update({ data: data3 }).eq('id', 'quantum-vibration-vol3');
    console.log("Updated Book 3 KOR with detailed synopses and dialogue");
  }

  // Book 4 KOR
  let vol4 = novels.find(n => n.id === 'quantum-vibration-vol4');
  if (vol4) {
    let data4 = { ...vol4.data, acts: vol4ActsDetailed };
    await supabase.from('novel_documents').update({ data: data4 }).eq('id', 'quantum-vibration-vol4');
    console.log("Updated Book 4 KOR with detailed synopses and dialogue");
  }
}

main().catch(console.error);
