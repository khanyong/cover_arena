# 삼체 Universe - 필요한 이미지 목록

## 우선순위 1: 핵심 이미지 (필수)

### 1. 소설 표지 (3장)
- `book1-cover.jpg` - 삼체 1부 표지
- `book2-cover.jpg` - 삼체 2부: 암흑의 숲 표지
- `book3-cover.jpg` - 삼체 3부: 사신의 영생 표지

### 2. 주요 인물 (8명)
- `wang-miao.jpg` - 왕먀오 (나노과학자, 1부 주인공)
- `ye-wenjie.jpg` - 예원제 (ETO 창립자, 천체물리학자)
- `luo-ji.jpg` - 뤄지 (면벽자, 검잡이, 2부 주인공)
- `zhang-beihai.jpg` - 장베이하이 (우주군 정치위원)
- `cheng-xin.jpg` - 정청신 (3부 주인공, 2대 검잡이)
- `mike-evans.jpg` - 마이크 에반스 (ETO 수장)
- `da-shi.jpg` - 스창/다스 (형사, 왕먀오의 동료)
- `guan-yifan.jpg` - 관이판 (우주 항법사, 정청신의 동반자)

---

## 우선순위 2: 명장면 이미지 (10장)

### TOP 10 명장면
1. `ye-wenjie-betrayal.jpg` - 예원제가 홍안 기지에서 신호 보내는 장면
2. `dark-forest-theory.jpg` - 우주 암흑의 숲 이미지
3. `doomsday-battle.jpg` - 워터 드롭이 인류 함대 파괴하는 장면
4. `swordholder-handover.jpg` - 검잡이 교체 순간
5. `dimensional-strike.jpg` - 태양계가 2차원으로 붕괴하는 장면
6. `operation-guzheng.jpg` - 나노와이어로 유조선 절단하는 장면
7. `zhang-beihai-choice.jpg` - 자연선택호가 우주로 도주하는 장면
8. `dark-battle.jpg` - 우주선들이 서로 공격하는 암흑 전투
9. `fairy-tales.jpg` - 윈톈밍의 동화책 이미지
10. `universe-reset.jpg` - 우주 재시작, 빅뱅 이미지

---

## 우선순위 3: 우주선 & 기술 (10장)

### 우주선 (5장)
- `natural-selection.jpg` - 자연선택호 (인류 전함)
- `blue-space.jpg` - 블루스페이스호 (인류 전함)
- `gravity.jpg` - 중력호 (3부 주요 함선)
- `water-drop.jpg` - 워터 드롭 (삼체 탐사선, 완벽한 거울 구체)
- `trisolaran-fleet.jpg` - 삼체 함대 전체 이미지

### 기술 (5장)
- `nanofiber.jpg` - 나노와이어 (투명한 실 이미지)
- `sophon.jpg` - 소폰/지자 (양자 AI)
- `curvature-drive.jpg` - 곡률 추진 우주선의 항적
- `dimensional-weapon.jpg` - 차원 무기, 이차원 조각
- `solar-amplification.jpg` - 태양을 증폭기로 사용하는 이미지

---

## 우선순위 4: 추가 인물 (10명)

- `yang-dong.jpg` - 양둥 (예원제의 딸, 물리학자)
- `ding-yi.jpg` - 딩이 (이론물리학자)
- `chang-weisi.jpg` - 창웨이스 (우주군 사령관)
- `yun-tianming.jpg` - 윈톈밍 (정청신의 친구, 삼체 포로)
- `thomas-wade.jpg` - 토마스 웨이드 (PIA 국장)
- `dong-fengwei.jpg` - 둥펑웨이 (여성 함대 사령관)
- `wu-yue.jpg` - 우웨이 (블루스페이스호 함장)
- `frederick-tyler.jpg` - 프레데릭 타일러 (면벽자)
- `manuel-reidiaz.jpg` - 마누엘 레이디아즈 (면벽자)
- `bill-hines.jpg` - 빌 하인즈 (면벽자, 신경과학자)

---

## 우선순위 5: 넷플릭스 & 컨셉아트 (선택)

### 넷플릭스 드라마
- `netflix-poster.jpg` - 넷플릭스 삼체 메인 포스터
- `netflix-ep1.jpg` ~ `netflix-ep8.jpg` - 각 에피소드 스틸 (8장)

### 컨셉 아트
- `three-body-game.jpg` - VR 삼체 게임 화면
- `red-coast-base.jpg` - 홍안 기지 외관
- `trisolaran-planet.jpg` - 삼체 행성 (3개 태양)
- `earth-invasion.jpg` - 삼체 함대가 지구 접근하는 모습

---

## 이미지 사양 권장사항

### 인물 이미지
- **크기**: 400x500px (세로형)
- **형식**: JPG
- **배경**: 어두운 톤 또는 SF 느낌

### 장면 이미지
- **크기**: 1200x675px (16:9 비율)
- **형식**: JPG
- **스타일**: 영화적, 다크 SF 톤

### 우주선/기술 이미지
- **크기**: 800x600px (가로형)
- **형식**: JPG
- **스타일**: 테크니컬, 블루프린트 또는 3D 렌더링

### 표지 이미지
- **크기**: 400x600px (세로형, 책 비율)
- **형식**: JPG
- **품질**: 고해상도

---

## Supabase Storage 구조

업로드 후 다음 경로로 저장해주세요:

```
three-body-images/
├── characters/       # 인물 이미지
├── scenes/          # 명장면 이미지
├── ships/           # 우주선 이미지
├── tech/            # 기술 이미지
├── covers/          # 소설 표지
├── netflix/         # 넷플릭스 관련
└── concept-art/     # 컨셉 아트
```

---

## 총 필요 이미지 개수

- **우선순위 1 (필수)**: 11장 (표지 3 + 인물 8)
- **우선순위 2**: 10장 (명장면)
- **우선순위 3**: 10장 (우주선 5 + 기술 5)
- **우선순위 4**: 10장 (추가 인물)
- **우선순위 5 (선택)**: 13장+ (넷플릭스 + 컨셉아트)

**최소 필요**: 31장
**전체**: 54장+

---

## 이미지 소스 추천

1. **공식 출판사 홍보 이미지** (가장 안전)
   - 한국: 현대문학 출판사
   - 중국: 重庆出版社

2. **넷플릭스 공식 홍보 자료**
   - Netflix Media Center

3. **팬아트 (작가 표기 필수)**
   - ArtStation, DeviantArt 등

4. **AI 생성 이미지**
   - Midjourney, Stable Diffusion 등으로 생성 가능
   - 프롬프트 예시: "Chinese sci-fi character Luo Ji, dark background, cinematic portrait"

---

## 다음 단계

1. ✅ 이미지 목록 작성 완료
2. ⏳ 사용자가 이미지 업로드 & URL 제공
3. ⏳ 각 컴포넌트에 이미지 URL 연동
4. ⏳ 이미지 로딩 에러 핸들링
5. ⏳ 레이지 로딩 최적화
