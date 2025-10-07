import { useState } from 'react'
import styles from './styles/ImageGallery.module.css'

const galleryImages = [
  {
    id: 1,
    title: "삼체 1부 - 삼체",
    category: "소설",
    description: "류츠신의 SF 대작 삼체 1부 표지",
    tags: ["소설", "1부", "표지"]
  },
  {
    id: 2,
    title: "삼체 2부 - 암흑의 숲",
    category: "소설",
    description: "인류의 생존 전략을 그린 2부",
    tags: ["소설", "2부", "표지"]
  },
  {
    id: 3,
    title: "삼체 3부 - 사신의 영생",
    category: "소설",
    description: "우주의 종말을 다룬 최종부",
    tags: ["소설", "3부", "표지"]
  },
  {
    id: 4,
    title: "넷플릭스 삼체 포스터",
    category: "넷플릭스",
    description: "2024년 넷플릭스 각색 드라마",
    tags: ["넷플릭스", "드라마", "포스터"]
  },
  {
    id: 5,
    title: "3항성계 시뮬레이션",
    category: "컨셉아트",
    description: "혼돈의 3항성계를 표현한 아트워크",
    tags: ["과학", "3항성", "시뮬레이션"]
  },
  {
    id: 6,
    title: "암흑의 숲 타격",
    category: "컨셉아트",
    description: "우주 공격 장면 시각화",
    tags: ["암흑의숲", "공격", "우주"]
  },
  {
    id: 7,
    title: "지자(智子) 전개",
    category: "컨셉아트",
    description: "2차원에서 11차원으로 전개되는 소폰",
    tags: ["지자", "소폰", "차원"]
  },
  {
    id: 8,
    title: "옥스퍼드 5인",
    category: "넷플릭스",
    description: "넷플릭스 드라마의 주인공들",
    tags: ["넷플릭스", "옥스퍼드", "캐릭터"]
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
            <div className={styles.imagePlaceholder}>
              <div className={styles.placeholderIcon}>🖼️</div>
              <div className={styles.placeholderText}>{image.title}</div>
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
            <div className={styles.lightboxImage}>
              <div className={styles.lightboxPlaceholder}>
                <div className={styles.lightboxIcon}>🖼️</div>
                <div className={styles.lightboxTitle}>{selectedImage.title}</div>
              </div>
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
          💡 실제 이미지는 저작권 문제로 플레이스홀더로 표시됩니다.
          <br />
          이미지를 클릭하면 확대하여 볼 수 있습니다.
        </p>
      </div>
    </div>
  )
}
