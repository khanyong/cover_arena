import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import styles from './styles/DoomsdayBattle3D.module.css'

// 실제 함선 이름들
const shipNames = [
  '당랑호', '피니트호', '디스턴스호', '포그혼호', '남극호', '극한호',
  '갠지스호', '콜롬비아호', '정의호', '마사다호', '양성자호', '염제호',
  '대서양호', '시리우스호', '추수감사절호', '전진호', '한호', '폭풍우호',
  '메이지호', '뉴턴호', '계몽호', '백악기호', '북방호', '만년공붕호',
  '넬슨호', '그린호', '히말라야호', '토르호', '메신저호', '창세기호',
  '아인슈타인호', '하호', '양자호', '청동시대호', '방주호', '엔터프라이즈호',
  '콘스티튜션호', '유나이티드호', '프리덤호', '리버티호', '빅토리호',
  '인디펜던스호', '레볼루션호', '데모크라시호', '이퀄리티호', '저스티스호',
  '자연선택호' // 마지막 생존 함선
]

// 함선 상세 정보
const getShipDetails = (name, index) => {
  const types = ['항성급 전함', '순양함', '구축함', '정찰함']
  const crews = [800, 1000, 1200, 950, 850, 900, 1100, 750]
  const weapons = [
    '핵융합 미사일 × 200',
    '레이저 포 × 50',
    '전자기포 × 30',
    '플라즈마 캐논 × 20'
  ]

  return {
    name: name,
    type: types[index % types.length],
    crew: crews[index % crews.length],
    weapons: weapons[index % weapons.length],
    status: '대기 중'
  }
}

// 함선 이름을 랜덤하게 더 추가
const generateShipNames = (count) => {
  const names = [...shipNames]
  const prefixes = ['신', '구', '제2', '제3', '개량형']
  while (names.length < count) {
    const randomShip = shipNames[Math.floor(Math.random() * shipNames.length)]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    names.push(`${prefix} ${randomShip}`)
  }
  return names
}

export default function DoomsdayBattle3D() {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const shipsRef = useRef([])
  const waterdropRef = useRef(null)
  const explosionParticlesRef = useRef([])
  const timeRef = useRef(0)
  const labelsRef = useRef([])

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [viewMode, setViewMode] = useState('overview')
  const [hoveredShip, setHoveredShip] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const timeline = [
    { time: 0, event: '전투 시작 - 2000척 함대 대기', color: '#66ccff' },
    { time: 10, event: '워터드롭 탐지', color: '#7fe3d6' },
    { time: 20, event: '워터드롭 접근 시작', color: '#ff9900' },
    { time: 30, event: '함대 경계 태세', color: '#ffcc00' },
    { time: 40, event: '워터드롭 공격 개시', color: '#ff6633' },
    { time: 50, event: '1차 관통 - 함선 파괴 시작', color: '#ff3333' },
    { time: 70, event: '함대 대형 붕괴', color: '#cc0000' },
    { time: 90, event: '대다수 함선 파괴', color: '#990000' },
    { time: 100, event: '전투 종료 - 자연선택호만 생존', color: '#666666' }
  ]

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 1000, 4000)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10000
    )
    camera.position.set(0, 400, 1000)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxDistance = 3000
    controls.minDistance = 100

    // 우주 환경 조명 (매우 어둡게)
    const ambientLight = new THREE.AmbientLight(0x222244, 0.4)
    scene.add(ambientLight)

    // 별빛 (더 많고 깊은 우주)
    const createStarField = () => {
      const starsGeometry = new THREE.BufferGeometry()
      const starsVertices = []
      const starsSizes = []
      const starsColors = []

      for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 8000
        const y = (Math.random() - 0.5) * 8000
        const z = (Math.random() - 0.5) * 8000
        starsVertices.push(x, y, z)

        // 별 크기 변화
        starsSizes.push(Math.random() * 2 + 0.5)

        // 별 색상 (흰색, 약간 파란색, 약간 노란색)
        const color = new THREE.Color()
        const temp = Math.random()
        if (temp < 0.7) {
          color.setHex(0xffffff) // 흰색
        } else if (temp < 0.85) {
          color.setHex(0xaaccff) // 파란 별
        } else {
          color.setHex(0xffffaa) // 노란 별
        }
        starsColors.push(color.r, color.g, color.b)
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
      starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starsSizes, 1))
      starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3))

      const starsMaterial = new THREE.PointsMaterial({
        size: 2,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      })

      return new THREE.Points(starsGeometry, starsMaterial)
    }

    const stars = createStarField()
    scene.add(stars)

    // 은하수 효과 (멀리 있는 별 구름)
    const milkyWayGeometry = new THREE.PlaneGeometry(6000, 6000)
    const milkyWayMaterial = new THREE.MeshBasicMaterial({
      color: 0x223344,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    })
    const milkyWay = new THREE.Mesh(milkyWayGeometry, milkyWayMaterial)
    milkyWay.rotation.x = Math.PI / 2
    milkyWay.position.y = -1000
    scene.add(milkyWay)

    // 스타워즈 스타일 방향 텍스트 생성 (3D 텍스트처럼 보이도록)
    const createScrollingText = (lines, position, rotation, color) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 1024
      canvas.height = 512

      // 투명 배경
      context.clearRect(0, 0, canvas.width, canvas.height)

      // 텍스트 스타일
      context.font = 'bold 72px "Arial", sans-serif'
      context.fillStyle = color
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      // 그림자 효과
      context.shadowColor = color
      context.shadowBlur = 20
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0

      // 여러 줄 텍스트
      lines.forEach((line, index) => {
        const y = canvas.height / 2 + (index - lines.length / 2 + 0.5) * 90
        context.fillText(line, canvas.width / 2, y)
      })

      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.9
      })

      const geometry = new THREE.PlaneGeometry(400, 200)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(position)
      mesh.rotation.x = rotation.x
      mesh.rotation.y = rotation.y
      mesh.rotation.z = rotation.z

      return mesh
    }

    // 지구 방향 표시 (뒤쪽, 약간 위로 기울어진 형태)
    const earthText = createScrollingText(
      ['← EARTH', '지구'],
      new THREE.Vector3(0, 200, 1200),
      { x: Math.PI / 6, y: 0, z: 0 },
      '#4da6ff'
    )
    scene.add(earthText)

    // 삼체 방향 표시 (앞쪽, 약간 위로 기울어진 형태)
    const trisolarisText = createScrollingText(
      ['TRISOLARIS →', '삼체 항성계'],
      new THREE.Vector3(0, 200, -1200),
      { x: -Math.PI / 6, y: Math.PI, z: 0 },
      '#ff6633'
    )
    scene.add(trisolarisText)

    // 태양계 행성 생성
    const createPlanet = (name, radius, color, position, hasRings = false) => {
      const group = new THREE.Group()

      // 행성 본체
      const geometry = new THREE.SphereGeometry(radius, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.2,
        metalness: 0.3,
        roughness: 0.7
      })
      const planet = new THREE.Mesh(geometry, material)
      group.add(planet)

      // 행성 발광 효과
      const glowGeometry = new THREE.SphereGeometry(radius * 1.2, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      group.add(glow)

      // 토성 고리
      if (hasRings) {
        const ringGeometry = new THREE.RingGeometry(radius * 1.5, radius * 2.5, 64)
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xccaa88,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.rotation.x = Math.PI / 2
        group.add(ring)
      }

      // 행성 라벨
      const labelCanvas = document.createElement('canvas')
      const labelContext = labelCanvas.getContext('2d')
      labelCanvas.width = 256
      labelCanvas.height = 64

      labelContext.fillStyle = 'rgba(0, 0, 0, 0.7)'
      labelContext.fillRect(0, 0, labelCanvas.width, labelCanvas.height)

      labelContext.font = 'bold 24px Arial'
      labelContext.fillStyle = '#ffffff'
      labelContext.textAlign = 'center'
      labelContext.textBaseline = 'middle'
      labelContext.fillText(name, labelCanvas.width / 2, labelCanvas.height / 2)

      const labelTexture = new THREE.CanvasTexture(labelCanvas)
      const labelMaterial = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true
      })
      const label = new THREE.Sprite(labelMaterial)
      label.scale.set(40, 10, 1)
      label.position.y = radius + 15
      group.add(label)

      group.position.copy(position)
      return group
    }

    // 궤도 생성 함수
    const createOrbit = (radius, color, centerPosition) => {
      const curve = new THREE.EllipseCurve(
        0, 0,
        radius, radius,
        0, 2 * Math.PI,
        false,
        0
      )

      const points = curve.getPoints(128)
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points)
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        linewidth: 2
      })

      const orbit = new THREE.Line(orbitGeometry, orbitMaterial)
      orbit.rotation.x = Math.PI / 2
      orbit.position.copy(centerPosition)
      return orbit
    }

    // 태양 중심 위치
    const sunCenter = new THREE.Vector3(800, 0, 1800)

    // 태양 생성 (특별한 3D 효과)
    const createSun = (position) => {
      const sunGroup = new THREE.Group()

      // 태양 본체 (더 밝고 발광)
      const sunGeometry = new THREE.SphereGeometry(60, 64, 64)
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd00,
        emissive: 0xffaa00,
        emissiveIntensity: 1
      })
      const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
      sunGroup.add(sunMesh)

      // 태양 코로나 (외부 발광층)
      const coronaGeometry = new THREE.SphereGeometry(70, 64, 64)
      const coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xff9900,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      })
      const corona = new THREE.Mesh(coronaGeometry, coronaMaterial)
      sunGroup.add(corona)

      // 더 큰 외부 발광
      const glowGeometry = new THREE.SphereGeometry(85, 64, 64)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      sunGroup.add(glow)

      // 플레어 효과 (추가 발광)
      const flareGeometry = new THREE.SphereGeometry(100, 32, 32)
      const flareMaterial = new THREE.MeshBasicMaterial({
        color: 0xffcc66,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide
      })
      const flare = new THREE.Mesh(flareGeometry, flareMaterial)
      sunGroup.add(flare)

      // 태양 라벨
      const labelCanvas = document.createElement('canvas')
      const labelContext = labelCanvas.getContext('2d')
      labelCanvas.width = 256
      labelCanvas.height = 64

      labelContext.fillStyle = 'rgba(0, 0, 0, 0.7)'
      labelContext.fillRect(0, 0, labelCanvas.width, labelCanvas.height)

      labelContext.font = 'bold 24px Arial'
      labelContext.fillStyle = '#ffdd00'
      labelContext.textAlign = 'center'
      labelContext.textBaseline = 'middle'
      labelContext.fillText('태양 (Sun)', labelCanvas.width / 2, labelCanvas.height / 2)

      const labelTexture = new THREE.CanvasTexture(labelCanvas)
      const labelMaterial = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true
      })
      const label = new THREE.Sprite(labelMaterial)
      label.scale.set(80, 20, 1)
      label.position.y = 120
      sunGroup.add(label)

      sunGroup.position.copy(position)
      return sunGroup
    }

    const sun = createSun(sunCenter)
    scene.add(sun)

    // 태양 조명 (더 강력하게)
    const sunLight = new THREE.PointLight(0xffaa00, 4, 2500)
    sunLight.position.copy(sunCenter)
    scene.add(sunLight)

    // 추가 태양광 (주변 조명)
    const sunAmbient = new THREE.PointLight(0xffdd88, 1.5, 1500)
    sunAmbient.position.copy(sunCenter)
    scene.add(sunAmbient)

    // 행성 궤도 반지름 계산 함수
    const getOrbitRadius = (planetPos, sunPos) => {
      const dx = planetPos.x - sunPos.x
      const dz = planetPos.z - sunPos.z
      return Math.sqrt(dx * dx + dz * dz)
    }

    // 수성 (Mercury)
    const mercuryPos = new THREE.Vector3(600, -100, 1500)
    const mercury = createPlanet('수성 (Mercury)', 8, 0x8c7853, mercuryPos)
    scene.add(mercury)
    const mercuryOrbit = createOrbit(getOrbitRadius(mercuryPos, sunCenter), 0x8c7853, new THREE.Vector3(sunCenter.x, mercuryPos.y, sunCenter.z))
    scene.add(mercuryOrbit)

    // 금성 (Venus)
    const venusPos = new THREE.Vector3(400, 150, 1300)
    const venus = createPlanet('금성 (Venus)', 15, 0xffc649, venusPos)
    scene.add(venus)
    const venusOrbit = createOrbit(getOrbitRadius(venusPos, sunCenter), 0xffc649, new THREE.Vector3(sunCenter.x, venusPos.y, sunCenter.z))
    scene.add(venusOrbit)

    // 지구 (Earth) - 함대 근처
    const earthPos = new THREE.Vector3(-300, -200, 1000)
    const earth = createPlanet('지구 (Earth)', 20, 0x4a90e2, earthPos)
    scene.add(earth)
    const earthOrbit = createOrbit(getOrbitRadius(earthPos, sunCenter), 0x4a90e2, new THREE.Vector3(sunCenter.x, earthPos.y, sunCenter.z))
    scene.add(earthOrbit)

    // 달 (Moon) - 지구 주변 궤도
    const moonPos = new THREE.Vector3(-250, -180, 980)
    const moon = createPlanet('달 (Moon)', 6, 0xaaaaaa, moonPos)
    scene.add(moon)
    const moonOrbit = createOrbit(50, 0xaaaaaa, new THREE.Vector3(earthPos.x, moonPos.y, earthPos.z))
    scene.add(moonOrbit)

    // 화성 (Mars)
    const marsPos = new THREE.Vector3(500, 100, 500)
    const mars = createPlanet('화성 (Mars)', 12, 0xcd5c5c, marsPos)
    scene.add(mars)
    const marsOrbit = createOrbit(getOrbitRadius(marsPos, sunCenter), 0xcd5c5c, new THREE.Vector3(sunCenter.x, marsPos.y, sunCenter.z))
    scene.add(marsOrbit)

    // 목성 (Jupiter)
    const jupiterPos = new THREE.Vector3(-700, 200, 0)
    const jupiter = createPlanet('목성 (Jupiter)', 45, 0xc88b3a, jupiterPos)
    scene.add(jupiter)
    const jupiterOrbit = createOrbit(getOrbitRadius(jupiterPos, sunCenter), 0xc88b3a, new THREE.Vector3(sunCenter.x, jupiterPos.y, sunCenter.z))
    scene.add(jupiterOrbit)

    // 토성 (Saturn) - 고리 포함
    const saturnPos = new THREE.Vector3(600, -300, -400)
    const saturn = createPlanet('토성 (Saturn)', 38, 0xfad5a5, saturnPos, true)
    scene.add(saturn)
    const saturnOrbit = createOrbit(getOrbitRadius(saturnPos, sunCenter), 0xfad5a5, new THREE.Vector3(sunCenter.x, saturnPos.y, sunCenter.z))
    scene.add(saturnOrbit)

    // 천왕성 (Uranus)
    const uranusPos = new THREE.Vector3(-500, 250, -800)
    const uranus = createPlanet('천왕성 (Uranus)', 25, 0x4fd0e7, uranusPos)
    scene.add(uranus)
    const uranusOrbit = createOrbit(getOrbitRadius(uranusPos, sunCenter), 0x4fd0e7, new THREE.Vector3(sunCenter.x, uranusPos.y, sunCenter.z))
    scene.add(uranusOrbit)

    // 해왕성 (Neptune)
    const neptunePos = new THREE.Vector3(400, -200, -1100)
    const neptune = createPlanet('해왕성 (Neptune)', 24, 0x4166f5, neptunePos)
    scene.add(neptune)
    const neptuneOrbit = createOrbit(getOrbitRadius(neptunePos, sunCenter), 0x4166f5, new THREE.Vector3(sunCenter.x, neptunePos.y, sunCenter.z))
    scene.add(neptuneOrbit)

    // 명왕성 (Pluto) - 작지만 포함
    const plutoPos = new THREE.Vector3(-300, 100, -1300)
    const pluto = createPlanet('명왕성 (Pluto)', 5, 0xa0826d, plutoPos)
    scene.add(pluto)
    const plutoOrbit = createOrbit(getOrbitRadius(plutoPos, sunCenter), 0xa0826d, new THREE.Vector3(sunCenter.x, plutoPos.y, sunCenter.z))
    scene.add(plutoOrbit)

    // 함선 이름 생성 함수
    const createTextSprite = (text) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 256
      canvas.height = 64

      context.fillStyle = 'rgba(0, 0, 0, 0.7)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.font = 'bold 20px Arial'
      context.fillStyle = '#66ccff'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(text, canvas.width / 2, canvas.height / 2)

      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
      })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.scale.set(20, 5, 1)
      return sprite
    }

    const ships = []
    const labels = []
    const gridSize = 15
    const spacing = 30
    const totalShips = gridSize * gridSize * 9
    const allShipNames = generateShipNames(totalShips)

    let shipIndex = 0

    // 함대에 포인트 라이트 추가 (함대가 발광하는 효과)
    const fleetLight = new THREE.PointLight(0x66ccff, 2, 500)
    fleetLight.position.set(0, 0, 0)
    scene.add(fleetLight)

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < 9; z++) {
          const shipGeometry = new THREE.BoxGeometry(8, 3, 15)
          const shipMaterial = new THREE.MeshStandardMaterial({
            color: 0x88bbff,
            emissive: 0x0066cc,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
          })
          const ship = new THREE.Mesh(shipGeometry, shipMaterial)

          // 함선 엔진 발광 효과 (작은 포인트 라이트)
          if (Math.random() > 0.95) {
            const engineLight = new THREE.PointLight(0x4da6ff, 0.5, 30)
            engineLight.position.copy(ship.position)
            engineLight.position.z += 8
            scene.add(engineLight)
          }

          ship.position.x = (x - gridSize / 2) * spacing
          ship.position.y = (y - gridSize / 2) * spacing
          ship.position.z = (z - 4.5) * spacing

          const shipName = allShipNames[shipIndex]
          const shipDetails = getShipDetails(shipName, shipIndex)

          ship.userData.alive = true
          ship.userData.gridPos = { x, y, z }
          ship.userData.name = shipName
          ship.userData.index = shipIndex
          ship.userData.details = shipDetails

          // 텍스트 라벨 생성
          const label = createTextSprite(shipName)
          label.position.copy(ship.position)
          label.position.y += 8 // 함선 위에 표시
          label.visible = false // 기본적으로 숨김
          scene.add(label)
          labels.push(label)

          scene.add(ship)
          ships.push(ship)
          shipIndex++
        }
      }
    }
    shipsRef.current = ships
    labelsRef.current = labels

    const waterdropGroup = new THREE.Group()
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 32)
    const waterdropMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x7fe3d6,
      emissiveIntensity: 0.8,
      shininess: 200,
      specular: 0xffffff,
      metalness: 0.9
    })
    const sphere = new THREE.Mesh(sphereGeometry, waterdropMaterial)
    waterdropGroup.add(sphere)

    const coneGeometry = new THREE.ConeGeometry(4, 10, 32)
    const cone = new THREE.Mesh(coneGeometry, waterdropMaterial)
    cone.rotation.x = Math.PI / 2
    cone.position.z = 7
    waterdropGroup.add(cone)

    const glowGeometry = new THREE.SphereGeometry(8, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x7fe3d6,
      transparent: true,
      opacity: 0.3
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    waterdropGroup.add(glow)

    const trailGeometry = new THREE.CylinderGeometry(0.5, 0.5, 200, 8)
    const trailMaterial = new THREE.MeshBasicMaterial({
      color: 0x7fe3d6,
      transparent: true,
      opacity: 0.2
    })
    const trail = new THREE.Mesh(trailGeometry, trailMaterial)
    trail.rotation.x = Math.PI / 2
    trail.position.z = 107
    waterdropGroup.add(trail)

    waterdropGroup.position.set(0, 0, -800)
    scene.add(waterdropGroup)
    waterdropRef.current = waterdropGroup

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      setMousePosition({ x: event.clientX, y: event.clientY })

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(shipsRef.current)

      if (intersects.length > 0) {
        const ship = intersects[0].object
        if (ship.userData.alive) {
          setHoveredShip(ship.userData)
          ship.material.emissiveIntensity = 0.8
        }
      } else {
        setHoveredShip(null)
        shipsRef.current.forEach(ship => {
          if (ship.userData.alive) {
            ship.material.emissiveIntensity = 0.3
          }
        })
      }
    }

    renderer.domElement.addEventListener('mousemove', handleMouseMove)

    const maxTime = 110

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate)

      if (isPlaying) {
        timeRef.current += 0.016 * speed
        if (timeRef.current > maxTime) {
          timeRef.current = maxTime
          setIsPlaying(false)
        }
        setCurrentTime(timeRef.current)
      }

      const time = timeRef.current

      // 태양 펄스 효과 (코로나가 살아있는 것처럼)
      const sunPulse = Math.sin(time * 2) * 0.05 + 1
      if (sun.children[1]) { // corona
        sun.children[1].scale.set(sunPulse, sunPulse, sunPulse)
      }
      if (sun.children[2]) { // glow
        sun.children[2].scale.set(sunPulse * 0.95, sunPulse * 0.95, sunPulse * 0.95)
      }
      if (sun.children[3]) { // flare
        sun.children[3].scale.set(sunPulse * 0.9, sunPulse * 0.9, sunPulse * 0.9)
        sun.children[3].material.opacity = 0.08 + Math.sin(time * 3) * 0.03
      }

      // 행성 자전
      sun.rotation.y += 0.001
      mercury.rotation.y += 0.003
      venus.rotation.y += 0.002
      earth.rotation.y += 0.005
      moon.rotation.y += 0.004
      mars.rotation.y += 0.004
      jupiter.rotation.y += 0.01
      saturn.rotation.y += 0.008
      uranus.rotation.y += 0.006
      neptune.rotation.y += 0.007
      pluto.rotation.y += 0.002

      if (time >= 20 && waterdropRef.current) {
        const progress = Math.min((time - 20) / 80, 1)
        waterdropRef.current.position.z = -800 + progress * 1600
        waterdropRef.current.rotation.y += 0.01
      }

      if (time >= 40) {
        const destructionProgress = (time - 40) / 60
        const destroyIndex = Math.floor(destructionProgress * shipsRef.current.length)

        shipsRef.current.forEach((ship, i) => {
          if (i < destroyIndex && ship.userData.alive) {
            ship.userData.alive = false
            ship.material.color.setHex(0xff3333)
            ship.material.emissive.setHex(0xff6633)
            ship.material.emissiveIntensity = 2

            for (let j = 0; j < 20; j++) {
              const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8)
              const particleMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0xff6633 : 0xffcc00
              })
              const particle = new THREE.Mesh(particleGeometry, particleMaterial)
              particle.position.copy(ship.position)
              particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
              )
              particle.userData.lifetime = 0
              scene.add(particle)
              explosionParticlesRef.current.push(particle)
            }

            setTimeout(() => {
              ship.visible = false
            }, 500)
          }

          if (i === shipsRef.current.length - 1 && time >= 90) {
            ship.material.color.setHex(0x00ff00)
            ship.material.emissive.setHex(0x00cc00)
            ship.material.emissiveIntensity = 1
            ship.position.x += Math.sin(time * 0.1) * 0.5
          }
        })
      }

      explosionParticlesRef.current.forEach((particle, index) => {
        particle.userData.lifetime += 0.016
        if (particle.userData.lifetime > 2) {
          scene.remove(particle)
          explosionParticlesRef.current.splice(index, 1)
        } else {
          particle.position.add(particle.userData.velocity)
          particle.material.opacity = 1 - particle.userData.lifetime / 2
          particle.material.transparent = true
        }
      })

      if (viewMode === 'waterdrop' && waterdropRef.current) {
        camera.position.x = waterdropRef.current.position.x + 30
        camera.position.y = waterdropRef.current.position.y + 20
        camera.position.z = waterdropRef.current.position.z - 50
        camera.lookAt(waterdropRef.current.position)
      } else if (viewMode === 'fleet') {
        camera.position.set(0, 400, 600)
        camera.lookAt(0, 0, 0)
      }

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('mousemove', handleMouseMove)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [isPlaying, speed, viewMode])

  const handleReset = () => {
    timeRef.current = 0
    setCurrentTime(0)
    setIsPlaying(false)
    window.location.reload()
  }

  const getCurrentEvent = () => {
    for (let i = timeline.length - 1; i >= 0; i--) {
      if (currentTime >= timeline[i].time) {
        return timeline[i]
      }
    }
    return timeline[0]
  }

  const currentEvent = getCurrentEvent()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>말일 전투 3D 시각화</h1>
        <p className={styles.subtitle}>
          2000척의 인류 함대 vs 삼체의 워터드롭
        </p>
      </header>

      <div className={styles.visualizationWrapper}>
        <div className={styles.canvasContainer} ref={mountRef} />

        <div className={styles.controls}>
          <div className={styles.playbackControls}>
            <button
              className={styles.playButton}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? '일시정지' : '재생'}
            </button>
            <button className={styles.resetButton} onClick={handleReset}>
              처음부터
            </button>
          </div>

          <div className={styles.speedControls}>
            <label>재생 속도:</label>
            <div className={styles.speedButtons}>
              {[0.5, 1, 2, 5].map(s => (
                <button
                  key={s}
                  className={speed === s ? styles.active : ''}
                  onClick={() => setSpeed(s)}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className={styles.viewControls}>
            <label>시점:</label>
            <div className={styles.viewButtons}>
              <button
                className={viewMode === 'overview' ? styles.active : ''}
                onClick={() => setViewMode('overview')}
              >
                전체 뷰
              </button>
              <button
                className={viewMode === 'waterdrop' ? styles.active : ''}
                onClick={() => setViewMode('waterdrop')}
              >
                워터드롭
              </button>
              <button
                className={viewMode === 'fleet' ? styles.active : ''}
                onClick={() => setViewMode('fleet')}
              >
                함대
              </button>
            </div>
          </div>

        </div>

        {hoveredShip && (
          <div
            className={styles.shipTooltip}
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y + 20
            }}
          >
            <div className={styles.tooltipHeader}>
              <h3>{hoveredShip.details.name}</h3>
              <span className={styles.shipType}>{hoveredShip.details.type}</span>
            </div>
            <div className={styles.tooltipBody}>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>선원:</span>
                <span className={styles.tooltipValue}>{hoveredShip.details.crew}명</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>무장:</span>
                <span className={styles.tooltipValue}>{hoveredShip.details.weapons}</span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>상태:</span>
                <span className={styles.tooltipValue}>{hoveredShip.alive ? '대기 중' : '파괴됨'}</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.timeline}>
          <div className={styles.timelineBar}>
            <div
              className={styles.timelineProgress}
              style={{
                width: `${(currentTime / 110) * 100}%`,
                backgroundColor: currentEvent.color
              }}
            />
          </div>
          <div className={styles.timelineLabels}>
            <span>0s</span>
            <span>50s</span>
            <span>110s</span>
          </div>
        </div>

        <div className={styles.eventDisplay}>
          <div
            className={styles.currentEvent}
            style={{ borderLeftColor: currentEvent.color }}
          >
            <span className={styles.eventTime}>{Math.floor(currentTime)}s</span>
            <span className={styles.eventText}>{currentEvent.event}</span>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.infoCard}>
          <h3>조작 방법</h3>
          <ul>
            <li>🖱️ <strong>마우스 드래그</strong>: 시점 회전</li>
            <li>🖱️ <strong>마우스 휠</strong>: 확대/축소</li>
            <li>⌨️ <strong>재생/일시정지</strong>: 전투 진행 제어</li>
            <li>⚡ <strong>재생 속도</strong>: 0.5x ~ 5x 배속 조절</li>
            <li>👁️ <strong>시점 변경</strong>: 전체/워터드롭/함대 시점</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
