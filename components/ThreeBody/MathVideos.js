import { useState } from 'react'
import styles from './styles/MathVideos.module.css'

const videos = [
  {
    id: 1,
    title: '삼체 문제의 수학적 이해 1',
    youtubeId: 'J8KKfyZC9l4',
    description: '3체 문제의 기본 개념과 혼돈 이론',
    duration: '약 15분'
  },
  {
    id: 2,
    title: '삼체 문제의 수학적 이해 2',
    youtubeId: '123NRIgIQkk',
    description: '3체 문제의 수학적 해법과 시뮬레이션',
    duration: '약 20분'
  }
]

export default function MathVideos() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>삼체의 수학적 이해</h1>
        <p className={styles.subtitle}>
          3체 문제(Three-Body Problem)의 수학적 원리와 혼돈 이론을 영상으로 이해하기
        </p>
      </div>

      {/* 비디오 플레이어 */}
      <div className={styles.videoPlayer}>
        <div className={styles.videoWrapper}>
          <iframe
            key={selectedVideo.youtubeId}
            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
            title={selectedVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="lazy"
            className={styles.iframe}
            style={{ border: 0, pointerEvents: 'auto' }}
          ></iframe>
        </div>
        <div className={styles.videoInfo}>
          <h2>{selectedVideo.title}</h2>
          <p>{selectedVideo.description}</p>
          <span className={styles.duration}>{selectedVideo.duration}</span>
          <div style={{ marginTop: '15px' }}>
            <a
              href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.youtubeLink}
            >
              YouTube에서 직접 보기 →
            </a>
          </div>
        </div>
      </div>

      {/* 비디오 목록 */}
      <div className={styles.videoList}>
        <h3 className={styles.listTitle}>재생 목록</h3>
        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <div
              key={video.id}
              className={`${styles.videoCard} ${selectedVideo.id === video.id ? styles.active : ''}`}
              onClick={() => setSelectedVideo(video)}
            >
              <div className={styles.thumbnail}>
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className={styles.thumbnailImg}
                />
                {selectedVideo.id === video.id && (
                  <div className={styles.playingBadge}>재생 중</div>
                )}
              </div>
              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{video.title}</h4>
                <p className={styles.cardDesc}>{video.description}</p>
                <span className={styles.cardDuration}>{video.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 수학적 배경 설명 */}
      <div className={styles.mathContext}>
        <h3>3체 문제란?</h3>
        <p>
          3체 문제는 3개의 천체가 서로의 중력에 의해 운동할 때 그 궤도를 예측하는 문제입니다.
          2개 천체는 케플러 법칙으로 정확히 예측 가능하지만, 3개 이상이 되면 해석적 해가 존재하지 않습니다.
        </p>
        <p>
          앙리 푸앵카레는 1890년대에 3체 문제를 연구하면서 <strong>혼돈 이론(Chaos Theory)</strong>의 기초를 세웠습니다.
          초기 조건의 아주 작은 차이가 시간이 지나면서 엄청나게 다른 결과를 만들어내는 "초기값 민감성"을 발견했습니다.
        </p>
        <p>
          류츠신의 소설 <strong>《삼체》</strong>는 이 수학적 난제를 문명의 생존 문제로 확장했습니다.
          예측 불가능한 3항성계에서 살아남기 위해 문명이 200번 멸망하고 재건되는 설정은,
          수학적 혼돈이 실존적 위협으로 구현된 것입니다.
        </p>
      </div>
    </div>
  )
}
