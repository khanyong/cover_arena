import { useEffect, useRef, useState } from 'react'
import styles from './styles/CharacterNetwork.module.css'
import { estimateNodeWidth, nodeHeight, layoutGraph, calculateBranchBoxes, edgePathFromPoints } from './utils/dagreLayout'
import Legend from './Legend'
import DetailPanel from './DetailPanel'

// 넷플릭스 삼체 인물 관계 데이터
const netflixStructureData = {
  // San-Ti (삼체) 측
  santiSide: {
    root: {
      id: "San-Ti",
      group: "외계"
    },
    branches: [
      {
        title: "ETO (지구삼체조직)",
        color: "#FF9900",
        nodes: [
          { id: "Ye Wenjie", group: "ETO", role: "ETO 창립자", level: 1 },
          { id: "Tatiana", group: "ETO", role: "암살자", level: 2, parent: "Ye Wenjie" },
          { id: "Mike Evans", group: "ETO", role: "억만장자", level: 1 },
          { id: "Wade", group: "ETO-반", role: "방어위원회", level: 1 }
        ]
      },
      {
        title: "Sophon",
        color: "#FF3366",
        nodes: [
          { id: "Sophon (AI)", group: "외계", role: "San-Ti 대리인", level: 1 }
        ]
      }
    ]
  },

  // 인류 측
  humanSide: {
    root: {
      id: "인류",
      group: "지구"
    },
    branches: [
      {
        title: "옥스퍼드 5인 (Oxford Five)",
        color: "#66CCFF",
        nodes: [
          { id: "Jin Cheng", group: "옥스퍼드", role: "이론물리학자", level: 1 },
          { id: "Auggie Salazar", group: "옥스퍼드", role: "나노과학자", level: 1 },
          { id: "Saul Durand", group: "옥스퍼드", role: "물리학자", level: 1 },
          { id: "Will Downing", group: "옥스퍼드", role: "물리학자", level: 1 },
          { id: "Jack Rooney", group: "옥스퍼드", role: "물리학자", level: 1 }
        ]
      },
      {
        title: "군사/정보",
        color: "#0099CC",
        nodes: [
          { id: "Thomas Wade", group: "군사", role: "방어위원회 국장", level: 1 },
          { id: "Clarence Shi", group: "군사", role: "보안요원", level: 2, parent: "Thomas Wade" },
          { id: "Raj Varma", group: "군사", role: "군사 전문가", level: 1 }
        ]
      },
      {
        title: "과학/연구",
        color: "#00CC99",
        nodes: [
          { id: "Vera Ye", group: "과학", role: "Ye Wenjie의 딸", level: 1 },
          { id: "Da Shi", group: "민간", role: "형사", level: 1 }
        ]
      }
    ]
  }
}

const netflixGroupColors = {
  "외계": "#FF6666",
  "ETO": "#FF9900",
  "ETO-반": "#FFCC00",
  "옥스퍼드": "#66CCFF",
  "군사": "#0099CC",
  "과학": "#00CC99",
  "민간": "#CCCCCC",
  "지구": "#66CC66"
}

const netflixCharacterDetails = {
  "Ye Wenjie": {
    name: "Ye Wenjie",
    role: "ETO 창립자",
    description: "천체물리학자. 문화대혁명 시기 아버지를 잃고 인류에 절망하여 외계문명과 첫 접촉을 시도한다.",
    era: "1960s-현대"
  },
  "Jin Cheng": {
    name: "Jin Cheng (진청)",
    role: "이론물리학자",
    description: "옥스퍼드 5인 중 한 명. Ye Wenjie의 제자로 삼체 위기의 핵심 인물이 된다.",
    era: "현대"
  },
  "Auggie Salazar": {
    name: "Auggie Salazar",
    role: "나노과학자",
    description: "나노섬유 기술 개발자. San-Ti의 간섭으로 연구에 위기를 맞는다.",
    era: "현대"
  },
  "Saul Durand": {
    name: "Saul Durand",
    role: "물리학자",
    description: "옥스퍼드 5인 중 한 명. 이론물리학 전문가.",
    era: "현대"
  },
  "Will Downing": {
    name: "Will Downing",
    role: "물리학자",
    description: "옥스퍼드 5인 중 한 명. 말기 암 진단을 받는다.",
    era: "현대"
  },
  "Jack Rooney": {
    name: "Jack Rooney",
    role: "물리학자",
    description: "옥스퍼드 5인 중 한 명. ETO에 의해 살해당한다.",
    era: "현대"
  },
  "Thomas Wade": {
    name: "Thomas Wade",
    role: "방어위원회 국장",
    description: "냉혹한 현실주의자. 인류를 구하기 위해 수단과 방법을 가리지 않는다.",
    era: "현대"
  },
  "Clarence Shi": {
    name: "Clarence (Da Shi)",
    role: "보안요원/형사",
    description: "직관적인 형사. 옥스퍼드 5인을 보호하는 임무를 맡는다.",
    era: "현대"
  },
  "Tatiana": {
    name: "Tatiana",
    role: "ETO 암살자",
    description: "ETO의 암살 요원. 과학자들을 제거하는 임무를 수행한다.",
    era: "현대"
  },
  "Sophon (AI)": {
    name: "Sophon",
    role: "San-Ti 대리인",
    description: "San-Ti가 보낸 AI. 인류의 과학 발전을 방해하고 감시한다.",
    era: "현대"
  },
  "Vera Ye": {
    name: "Vera Ye",
    role: "Ye Wenjie의 딸",
    description: "과학자. 어머니 Ye Wenjie의 과거를 추적한다.",
    era: "현대"
  },
  "Mike Evans": {
    name: "Mike Evans",
    role: "ETO 억만장자",
    description: "환경운동가 출신 억만장자. ETO에 자금과 자원을 제공한다.",
    era: "현대"
  }
}

export default function NetflixCharacterNetwork() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const svg = svgRef.current

    // 기존 SVG 내용 완전히 제거
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild)
    }

    // 1) 구조 데이터를 그래프로 변환
    const nodes = []
    const edges = []
    const idSet = new Set()

    const addNode = (id, label, group, role, isRoot = false, branchKey) => {
      if (idSet.has(id)) return
      idSet.add(id)
      nodes.push({
        id,
        label,
        role,
        group,
        isRoot,
        branchKey,
        width: isRoot ? 200 : 280,  // 고정 폭: 루트 200, 일반 노드 280
        height: nodeHeight(!!role)
      })
    }

    const addEdge = (src, tgt) => {
      edges.push({ id: `${src}->${tgt}`, sources: [src], targets: [tgt] })
    }

    // San-Ti side
    addNode(
      netflixStructureData.santiSide.root.id,
      netflixStructureData.santiSide.root.id,
      netflixStructureData.santiSide.root.group,
      undefined,
      true,
      'santi-root'
    )

    netflixStructureData.santiSide.branches.forEach((branch, bi) => {
      const key = `santi-${bi}`
      branch.nodes.forEach(node => {
        addNode(node.id, node.id, node.group, node.role, false, key)
        if (node.parent) {
          addEdge(node.parent, node.id)
        } else if (node.level === 1) {
          addEdge(netflixStructureData.santiSide.root.id, node.id)
        }
      })
    })

    // Human side
    addNode(
      netflixStructureData.humanSide.root.id,
      netflixStructureData.humanSide.root.id,
      netflixStructureData.humanSide.root.group,
      undefined,
      true,
      'human-root'
    )

    netflixStructureData.humanSide.branches.forEach((branch, bi) => {
      const key = `hum-${bi}`
      branch.nodes.forEach(node => {
        addNode(node.id, node.id, node.group, node.role, false, key)
        if (node.parent) {
          addEdge(node.parent, node.id)
        } else if (node.level === 1) {
          addEdge(netflixStructureData.humanSide.root.id, node.id)
        }
      })
    })

    // 2) Dagre 레이아웃 실행
    const graph = layoutGraph(nodes, edges)

    // 3) 포지션 매핑
    const positions = {}

    graph.children.forEach(child => {
      const node = nodes.find(n => n.id === child.id)

      positions[child.id] = {
        x: child.x,
        y: child.y,
        w: child.width,
        h: child.height,
        group: node.group,
        role: node.role,
        isRoot: node.isRoot
      }
    })

    // 4) 브랜치 박스 계산
    const branchBoxes = {}
    const branchMeta = {}

    netflixStructureData.santiSide.branches.forEach((b, i) => {
      branchMeta[`santi-${i}`] = { title: b.title, color: b.color }
    })
    netflixStructureData.humanSide.branches.forEach((b, i) => {
      branchMeta[`hum-${i}`] = { title: b.title, color: b.color }
    })

    nodes.forEach(n => {
      if (!n.branchKey || n.branchKey.includes('root')) return
      const pos = positions[n.id]
      if (!pos) return

      if (!branchBoxes[n.branchKey]) {
        branchBoxes[n.branchKey] = {
          minX: pos.x,
          minY: pos.y,
          maxX: pos.x + pos.w,
          maxY: pos.y + pos.h,
          ...branchMeta[n.branchKey]
        }
      } else {
        const box = branchBoxes[n.branchKey]
        box.minX = Math.min(box.minX, pos.x)
        box.minY = Math.min(box.minY, pos.y)
        box.maxX = Math.max(box.maxX, pos.x + pos.w)
        box.maxY = Math.max(box.maxY, pos.y + pos.h)
      }
    })

    // 5) SVG 그리기
    const width = graph.width + 240
    const height = graph.height + 160

    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    // 6) 그룹 구분선 렌더
    const groupLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    Object.entries(branchBoxes).forEach(([key, box]) => {
      const y = box.minY - 30
      const x1 = box.minX - 30
      const x2 = box.maxX + 30

      // 구분선
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', x1)
      line.setAttribute('y1', y)
      line.setAttribute('x2', x2)
      line.setAttribute('y2', y)
      line.setAttribute('stroke', box.color || '#4ecdc4')
      line.setAttribute('stroke-width', '2')
      line.setAttribute('stroke-opacity', '0.6')
      groupLayer.appendChild(line)

      // 그룹 타이틀
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      title.setAttribute('x', x1)
      title.setAttribute('y', y - 10)
      title.setAttribute('fill', box.color || '#4ecdc4')
      title.setAttribute('font-size', '24')
      title.setAttribute('font-weight', '600')
      title.textContent = box.title
      groupLayer.appendChild(title)
    })
    svg.appendChild(groupLayer)

    // 7) 엣지 렌더
    const linkLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    graph.edges.forEach(edge => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const pathStr = edgePathFromPoints(edge.points)
      path.setAttribute('d', pathStr)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', '#4ecdc4')
      path.setAttribute('stroke-width', '2')
      path.setAttribute('stroke-opacity', '0.5')
      path.setAttribute('class', 'link-path')
      linkLayer.appendChild(path)
    })
    svg.appendChild(linkLayer)

    // 8) 노드 렌더
    Object.entries(positions).forEach(([id, pos]) => {
      const nodeG = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      nodeG.setAttribute('class', 'node-group')
      nodeG.setAttribute('data-group', pos.group)
      nodeG.style.cursor = 'pointer'

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', pos.x)
      rect.setAttribute('y', pos.y)
      rect.setAttribute('width', pos.w)
      rect.setAttribute('height', pos.h)
      rect.setAttribute('rx', pos.isRoot ? 12 : 8)
      rect.setAttribute('fill', netflixGroupColors[pos.group] || '#333')
      rect.setAttribute('stroke', '#fff')
      rect.setAttribute('stroke-width', pos.isRoot ? 3 : 2)
      nodeG.appendChild(rect)

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', pos.x + pos.w / 2)
      text.setAttribute('y', pos.y + (pos.role ? 28 : pos.h / 2 + 6))
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('fill', '#fff')
      text.setAttribute('font-size', pos.isRoot ? 32 : 20)
      text.setAttribute('font-weight', pos.isRoot ? 'bold' : '600')
      text.textContent = id
      nodeG.appendChild(text)

      if (pos.role) {
        const roleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        roleText.setAttribute('x', pos.x + pos.w / 2)
        roleText.setAttribute('y', pos.y + 50)
        roleText.setAttribute('text-anchor', 'middle')
        roleText.setAttribute('fill', '#ddd')
        roleText.setAttribute('font-size', 14)
        roleText.textContent = pos.role
        nodeG.appendChild(roleText)
      }

      nodeG.addEventListener('click', () => {
        setSelectedCharacter(netflixCharacterDetails[id] || null)
      })

      svg.appendChild(nodeG)
    })

  }, [])

  const handleLegendClick = group => {
    if (selectedGroup === group) {
      setSelectedGroup(null)
      document.querySelectorAll('.node-group').forEach(el => {
        el.style.opacity = '1'
      })
      document.querySelectorAll('.link-path').forEach(el => {
        el.style.opacity = '0.5'
      })
    } else {
      setSelectedGroup(group)
      document.querySelectorAll('.node-group').forEach(el => {
        const g = el.getAttribute('data-group')
        el.style.opacity = g === group ? '1' : '0.15'
      })
      document.querySelectorAll('.link-path').forEach(el => {
        el.style.opacity = '0.08'
      })
    }
  }

  const characterInfo = selectedCharacter ? {
    name: selectedCharacter.name,
    role: selectedCharacter.role,
    description: selectedCharacter.description,
    actions: [],
    relations: [],
    fate: selectedCharacter.era
  } : null

  return (
    <div className={styles.networkWrapper} ref={containerRef} onClick={() => setSelectedCharacter(null)}>
      <Legend
        groupColors={netflixGroupColors}
        selectedGroup={selectedGroup}
        onGroupClick={handleLegendClick}
      />

      <div className={styles.graphContainer}>
        <svg ref={svgRef} className={styles.networkSvg} />
      </div>

      <DetailPanel
        character={selectedCharacter?.name}
        characterInfo={characterInfo}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  )
}
