import { useState } from 'react'
import ImageWithFallback from './ImageWithFallback'
import styles from './styles/ImageGallery.module.css'

const galleryImages = [
  {
    id: 1,
    title: "삼체 1부 - 삼체",
    category: "소설",
    description: "류츠신의 SF 대작 삼체 1부 표지",
    tags: ["소설", "1부", "표지"],
    imagePath: '/images/three-body/covers/book1-cover.jpg',
    fallback: 'https://via.placeholder.com/400x600/1a1a2e/4ecdc4?text=삼체+1부'
  },
  {
    id: 2,
    title: "삼체 2부 - 암흑의 숲",
    category: "소설",
    description: "인류의 생존 전략을 그린 2부",
    tags: ["소설", "2부", "표지"],
    imagePath: '/images/three-body/covers/book2-cover.jpg',
    fallback: 'https://via.placeholder.com/400x600/16213e/4ecdc4?text=암흑의+숲'
  },
  {
    id: 3,
    title: "삼체 3부 - 사신의 영생",
    category: "소설",
    description: "우주의 종말을 다룬 최종부",
    tags: ["소설", "3부", "표지"],
    imagePath: '/images/three-body/covers/book3-cover.jpg',
    fallback: 'https://via.placeholder.com/400x600/0f3460/4ecdc4?text=사신의+영생'
  },
  {
    id: 4,
    title: "워터 드롭 (水滴)",
    category: "컨셉아트",
    description: "완벽한 거울면을 가진 삼체 탐사선 - 말일전투의 공포",
    tags: ["워터드롭", "삼체", "우주선", "무적"],
    imagePath: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
    fallback: 'https://via.placeholder.com/800x600/1a1a2e/c0c0c0?text=워터+드롭'
  },
  {
    id: 5,
    title: "넷플릭스 삼체 포스터",
    category: "넷플릭스",
    description: "2024년 넷플릭스 각색 드라마",
    tags: ["넷플릭스", "드라마", "포스터"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/600x900/e94560/fff?text=Netflix+3+Body+Problem'
  },
  {
    id: 6,
    title: "3항성계 시뮬레이션",
    category: "컨셉아트",
    description: "혼돈의 3항성계를 표현한 아트워크",
    tags: ["과학", "3항성", "시뮬레이션"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/1a1a2e/ff6b6b?text=3항성계'
  },
  {
    id: 7,
    title: "암흑의 숲 타격",
    category: "컨셉아트",
    description: "우주 공격 장면 시각화",
    tags: ["암흑의숲", "공격", "우주"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/0f3460/4ecdc4?text=암흑의+숲'
  },
  {
    id: 8,
    title: "소폰(智子) 전개",
    category: "컨셉아트",
    description: "2차원에서 11차원으로 전개되는 소폰",
    tags: ["지자", "소폰", "차원"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/800x600/16213e/ffce56?text=소폰'
  },
  {
    id: 9,
    title: "홍안 기지",
    category: "컨셉아트",
    description: "예원제가 삼체에 신호를 보낸 군사 전파 천문학 기지",
    tags: ["홍안", "예원제", "첫접촉", "기지"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/2c3e50/e74c3c?text=홍안+기지'
  },
  {
    id: 10,
    title: "뤄지 - 검잡이",
    category: "인물",
    description: "암흑의 숲 이론을 발견하고 62년간 검잡이로 활동한 면벽자",
    tags: ["뤄지", "검잡이", "면벽자", "영웅"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/600x800/34495e/3498db?text=뤄지'
  },
  {
    id: 11,
    title: "정청신",
    category: "인물",
    description: "계단 프로젝트를 제안하고 검잡이가 된 3부 주인공",
    tags: ["정청신", "검잡이", "계단프로젝트"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/600x800/8e44ad/e8daef?text=정청신'
  },
  {
    id: 12,
    title: "예원제",
    category: "인물",
    description: "인류를 배신하고 삼체에 지구 위치를 알린 천체물리학자",
    tags: ["예원제", "ETO", "배신자"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/600x800/c0392b/ecf0f1?text=예원제'
  },
  {
    id: 13,
    title: "태양계 2000척 함대",
    category: "컨셉아트",
    description: "말일 전투 직전 인류의 우주 함대 집결",
    tags: ["함대", "말일전투", "우주전"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1400x700/0c2340/00a8e8?text=인류+함대'
  },
  {
    id: 14,
    title: "자연선택호",
    category: "우주선",
    description: "장베이하이가 탈취하여 도망친 아시아 함대 함선",
    tags: ["자연선택호", "장베이하이", "도망주의"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1000x600/2c3e50/18bc9c?text=자연선택호'
  },
  {
    id: 15,
    title: "블루스페이스호",
    category: "우주선",
    description: "말일 전투에서 살아남아 우주 깊은 곳으로 떠난 함선",
    tags: ["블루스페이스호", "생존", "암흑전투"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1000x600/34495e/3498db?text=블루스페이스호'
  },
  {
    id: 16,
    title: "중력호",
    category: "우주선",
    description: "정청신과 관이판이 타고 우주로 떠난 광속 우주선",
    tags: ["중력호", "광속", "곡률추진"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1000x600/8e44ad/d7bde2?text=중력호'
  },
  {
    id: 17,
    title: "태양계 이차원화",
    category: "컨셉아트",
    description: "차원 타격으로 3차원에서 2차원으로 붕괴되는 태양계",
    tags: ["이차원화", "차원공격", "종말"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1400x700/000000/ff6b6b?text=태양계+이차원화'
  },
  {
    id: 18,
    title: "삼체 게임 VR",
    category: "컨셉아트",
    description: "ETO가 만든 삼체 문명 시뮬레이션 VR 게임",
    tags: ["삼체게임", "VR", "ETO"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/e67e22/ecf0f1?text=삼체+게임'
  },
  {
    id: 19,
    title: "나노와이어 작전",
    category: "장면",
    description: "왕먀오의 나노섬유로 심판자호를 67층으로 절단",
    tags: ["나노와이어", "심판자호", "왕먀오"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/c0392b/ecf0f1?text=나노와이어+작전'
  },
  {
    id: 20,
    title: "계단 프로젝트 발사",
    category: "장면",
    description: "윈톈밍의 뇌를 담은 탐사선이 핵폭탄으로 가속되는 장면",
    tags: ["계단프로젝트", "윈톈밍", "핵폭탄"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1400x700/34495e/f39c12?text=계단+프로젝트'
  },
  {
    id: 21,
    title: "윈톈밍과 정청신",
    category: "인물",
    description: "사랑하는 사람을 위해 뇌만으로 우주를 여행한 남자",
    tags: ["윈톈밍", "정청신", "사랑"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1000x600/8e44ad/ecf0f1?text=윈톈밍+❤+정청신'
  },
  {
    id: 22,
    title: "4명의 면벽자",
    category: "인물",
    description: "뤄지, 타일러, 레이디아즈, 하인즈 - 인류의 마지막 희망",
    tags: ["면벽자", "뤄지", "전략"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1400x700/2c3e50/3498db?text=4명의+면벽자'
  },
  {
    id: 23,
    title: "토마스 웨이드",
    category: "인물",
    description: "광속 추진을 위해 싸운 냉혹한 현실주의자",
    tags: ["토마스웨이드", "PIA", "광속추진"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/600x800/7f8c8d/ecf0f1?text=토마스+웨이드'
  },
  {
    id: 24,
    title: "장베이하이",
    category: "인물",
    description: "인류 종족 보존을 위해 도망주의를 실천한 정치위원",
    tags: ["장베이하이", "도망주의", "우주군"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/600x800/16a085/ecf0f1?text=장베이하이'
  },
  {
    id: 25,
    title: "넷플릭스 - 옥스퍼드 5인",
    category: "넷플릭스",
    description: "드라마판 주인공들 - Jin, Auggie, Jack, Will, Saul",
    tags: ["넷플릭스", "옥스퍼드", "캐릭터"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1400x700/e94560/ffffff?text=옥스퍼드+5인'
  },
  {
    id: 26,
    title: "넷플릭스 - 예원제",
    category: "넷플릭스",
    description: "드라마에서 예원제 역을 맡은 배우의 장면",
    tags: ["넷플릭스", "예원제", "드라마"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1200x675/e94560/ffffff?text=예원제'
  },
  {
    id: 27,
    title: "넷플릭스 - 나노섬유 장면",
    category: "넷플릭스",
    description: "시즌1 하이라이트 - 유조선 절단 장면",
    tags: ["넷플릭스", "나노섬유", "명장면"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1400x700/e94560/ffffff?text=나노섬유+장면'
  },
  {
    id: 28,
    title: "삼체 문명의 삼체인",
    category: "컨셉아트",
    description: "3항성계에서 살아남기 위해 진화한 외계 생명체",
    tags: ["삼체인", "외계인", "생명체"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1000x800/192a56/f39c12?text=삼체인'
  },
  {
    id: 29,
    title: "DX3906 행성계",
    category: "컨셉아트",
    description: "윈톈밍이 정청신에게 선물한 별",
    tags: ["DX3906", "별", "선물"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1400x700/2c3e50/f39c12?text=DX3906'
  },
  {
    id: 30,
    title: "암흑의 숲 - 뤄지의 브로드캐스트",
    category: "장면",
    description: "187J3X1 항성 좌표를 우주로 송신하는 결정적 순간",
    tags: ["암흑의숲", "뤄지", "브로드캐스트"],
    imagePath: '',
    fallback: 'https://via.placeholder.com/1400x700/0f3460/e74c3c?text=암흑의+숲+브로드캐스트'
  }
]

export default function ImageGallery() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedImage, setSelectedImage] = useState(null)

  const categories = ["전체", "소설", "넷플릭스", "컨셉아트", "인물", "우주선", "장면"]

  const filteredImages = selectedCategory === "전체"
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryHeader}>
        <h1 className={styles.galleryTitle}>이미지 갤러리</h1>
        <p className={styles.gallerySubtitle}>
          삼체 세계관을 시각적으로 탐험해보세요
        </p>
      </div>

      <div className={styles.filterBar}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.imageGrid}>
        {filteredImages.map(image => (
          <div
            key={image.id}
            className={styles.imageCard}
            onClick={() => setSelectedImage(image)}
          >
            <div className={styles.imageWrapper}>
              <ImageWithFallback
                src={image.imagePath}
                fallbackSrc={image.fallback}
                alt={image.title}
                width={400}
                height={300}
                className={styles.galleryImage}
              />
            </div>
            <div className={styles.imageInfo}>
              <h3 className={styles.imageTitle}>{image.title}</h3>
              <p className={styles.imageDescription}>{image.description}</p>
              <div className={styles.imageTags}>
                {image.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <div className={styles.lightboxImageWrapper}>
              <ImageWithFallback
                src={selectedImage.imagePath}
                fallbackSrc={selectedImage.fallback}
                alt={selectedImage.title}
                width={1200}
                height={800}
                className={styles.lightboxImage}
                objectFit="contain"
              />
            </div>
            <div className={styles.lightboxInfo}>
              <h2>{selectedImage.title}</h2>
              <p className={styles.lightboxCategory}>{selectedImage.category}</p>
              <p className={styles.lightboxDescription}>{selectedImage.description}</p>
              <div className={styles.lightboxTags}>
                {selectedImage.tags.map((tag, index) => (
                  <span key={index} className={styles.lightboxTag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.galleryNote}>
        <p>
          💡 이미지를 클릭하면 확대하여 볼 수 있습니다.
          <br />
          실제 이미지는 Supabase Storage에 업로드 후 자동으로 표시됩니다.
        </p>
      </div>
    </div>
  )
}
