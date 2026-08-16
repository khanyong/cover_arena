import { novels } from './shared/lib/supabase.js';

async function run() {
  const { data, error } = await novels.getAllNovels();
  if (error || !data) {
    console.error(error);
    return;
  }

  const translations = {
    "공간의 진동: 시공간의 건축가들": "Vibrations of Space: Architects of Spacetime",
    "공간의 진동 2권: 권력의 기하학": "Vibrations of Space Vol 2: Geometry of Power",
    "공간의 진동 3권: 단절된 세계": "Vibrations of Space Vol 3: The Severed World",
    "공간의 진동 4권: 창세기의 건축가들": "Vibrations of Space Vol 4: Architects of Genesis",
    "이안 스털링": "Ian Sterling",
    "세라 첸": "Sarah Chen",
    "데이비드 첸": "David Chen",
    "엘레나 로스토바": "Elena Rostova",
    "제임스 맥팔레인": "James MacFarlane",
    "천재 물리학자/주인공": "Genius Physicist/Protagonist",
    "천재 물리학자": "Genius Physicist",
    "주인공": "Protagonist",
    "NASA 연구원/조력자": "NASA Researcher/Supporter",
    "NASA 연구원": "NASA Researcher",
    "조력자": "Supporter",
    "국방부 장관/메인 빌런": "Secretary of Defense/Main Villain",
    "국방부 장관": "Secretary of Defense",
    "메인 빌런": "Main Villain",
    "수석 엔지니어/스승": "Chief Engineer/Mentor",
    "수석 엔지니어": "Chief Engineer",
    "스승": "Mentor",
    "주임교수/정신적 지주": "Head Professor/Spiritual Anchor",
    "주임교수": "Head Professor",
    "정신적 지주": "Spiritual Anchor"
  };

  const logline_translations = {
    "우주를 구성하는 근본적인 기하학적 텐서(Tensor)가 어긋나기 시작했다. 인류는 시공간의 붕괴를 막을 수식을 찾아야만 한다.": "The fundamental geometric tensors configuring the universe have begun to misalign. Humanity must find the equation to prevent the collapse of spacetime.",
    "권력은 기하학이다. 누군가는 공간을 왜곡하여 지배하고, 누군가는 그 왜곡 속에서 저항한다.": "Power is geometry. Some distort space to rule, while others resist within that distortion.",
    "세계가 단절되었다. 노드(Node) 너머의 진실을 마주한 자들은 침묵하거나, 반역자가 되거나 둘 중 하나다.": "The world has been severed. Those who face the truth beyond the Node must either remain silent or become traitors.",
    "창세기의 비밀은 빛이 아니라 중력의 떨림 속에 있었다. 우리는 붕괴하는 우주를 다시 설계할 수 있을까?": "The secret of genesis was not in light, but in the tremor of gravity. Can we redesign the collapsing universe?"
  };

  for (const row of data) {
    let novel = row.data;
    if (translations[novel.title]) novel.title = translations[novel.title];
    if (logline_translations[novel.logline]) novel.logline = logline_translations[novel.logline];
    
    if (novel.characters) {
      for (let c of novel.characters) {
        if (translations[c.name]) c.name = translations[c.name];
        
        let roleParts = c.role.split('/');
        let translatedRole = roleParts.map(part => translations[part.trim()] || part.trim()).join(' / ');
        c.role = translatedRole;
      }
    }
    await novels.saveNovel(novel);
  }
  console.log("Translation complete!");
}
run();
