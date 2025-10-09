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
    description: "완벽한 거울면을 가진 삼체 탐사선 - 암흑전투의 공포",
    tags: ["워터드롭", "삼체", "우주선", "무적"],
    imagePath: '/images/three-body/scenes/droplet.png',
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
  }
]

export default function ImageGallery() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedImage, setSelectedImage] = useState(null)

  const categories = ["전체", "소설", "넷플릭스", "컨셉아트"]

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
