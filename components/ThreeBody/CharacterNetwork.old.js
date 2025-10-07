import { useEffect, useRef, useState } from 'react'
import styles from './styles/CharacterNetwork.module.css'

// Character details data
const characterDetails = {
  "삼체 문명": {
    role: "3항성계 외계 문명",
    description: "혼돈의 3항성계에서 생존을 위해 지구를 침공하려는 외계 문명",
    actions: ["지구 신호 수신", "소폰(智子) 파견", "함대 파견"],
    relations: ["예원제(첫 접촉)", "마이크 에반스(ETO 협력)"]
  },
  "인류 연합": {
    role: "지구 방위 연합 조직",
    description: "삼체 침공에 맞서 인류의 생존을 위해 결성된 연합 조직체",
    actions: ["PDC 설립", "면벽 계획 수립", "우주군 창설", "과학기술 발전"],
    relations: []
  },
  "예원제": {
    role: "천체물리학자, ETO 창립자",
    description: "문화대혁명 중 아버지가 살해당한 후 인류에 절망하여 삼체 문명에 신호를 보냄",
    actions: ["홍안 기지에서 삼체에 신호 송신", "ETO 조직 창립", "마이크 에반스와 협력"],
    relations: ["예저타이(부녀-아버지)", "양둥(모녀-딸)"],
    fate: "왕먀오에 의해 사망"
  },
  "마이크 에반스": {
    role: "ETO 수장, 극단적 환경보호주의자",
    description: "인류의 환경파괴에 절망하여 삼체를 통한 지구 정화를 꿈꿈",
    actions: ["ETO 실질적 운영", "구세파/구도파 조직화", "심판자호로 삼체 통신 중계"],
    relations: ["예원제(협력자)"],
    fate: "나노와이어 작전으로 사망"
  },
  "뤄지": {
    role: "사회학자, 면벽자, 검잡이",
    description: "암흑의 숲 이론을 발견하여 삼체를 위협, 62년간 지구-삼체 평화 유지",
    actions: ["암흑의 숲 이론 발견", "187J3X1 항성 파괴", "검잡이로 62년 평화 유지"],
    relations: ["좡옌(부부-아내)", "예원제(스승-제자)"],
    fate: "정청신에게 검잡이 역할 전달 후 생존"
  },
  "프레데릭 타일러": {
    role: "미국 전 국방장관, 면벽자",
    description: "군사 전략가로 면벽자가 되었으나 전략이 파벽인에게 간파됨",
    actions: ["우주 방어 전략 수립", "카미카제 전술 개발"],
    relations: [],
    fate: "전략 실패 후 사임"
  },
  "마누엘 레이디아즈": {
    role: "베네수엘라 전 대통령, 면벽자",
    description: "수성을 거대한 핵폭탄으로 만들어 삼체 함대 파괴 시도",
    actions: ["수성 핵폭탄 계획", "극단적 전략으로 논란"],
    relations: [],
    fate: "계획 실패 후 자살"
  },
  "빌 하인즈": {
    role: "영국 뇌과학자, 면벽자",
    description: "사고강인 프로젝트로 인류를 전쟁에 적합하게 개조하려 시도",
    actions: ["사고강인 프로젝트 추진", "인류 심리 개조 시도"],
    relations: ["아마소 게이코(부부-아내)"],
    fate: "계획 실패 후 은퇴"
  },
  "아마소 게이코": {
    role: "일본 뇌과학자, 빌 하인즈의 아내",
    description: "남편의 면벽 계획을 도우며 협력",
    actions: ["사고강인 프로젝트 협력"],
    relations: ["빌 하인즈(부부-남편)"],
    fate: "남편과 함께 은퇴"
  },
  "장베이하이": {
    role: "우주군 정치위원, 극단적 생존주의자",
    description: "인류의 패배를 확신하고 종족 보존을 위해 도망주의 실천",
    actions: ["자연선택호 탈취", "블루스페이스호와 탈출", "암흑 전투 참전"],
    relations: ["창웨이스(사상적 대립)"],
    fate: "우주 전투에서 전사"
  },
  "창웨이스": {
    role: "우주군 초대 사령관, 현실적 방어주의자",
    description: "장베이하이와 대비되는 현실주의자, 인류의 방어 능력을 믿음",
    actions: ["우주 함대 방어 체계 구축", "말일 전투 지휘"],
    relations: ["장베이하이(사상적 대립)"],
    fate: "말일 전투에서 전사"
  },
  "우웨이": {
    role: "해군 대령, 블루스페이스호 함장",
    description: "장베이하이와 함께 도망주의를 실천",
    actions: ["블루스페이스호 지휘", "태양계 탈출"],
    relations: ["장베이하이(동료)"],
    fate: "우주 깊은 곳에서 생존"
  },
  "조지 피츠로이": {
    role: "미국 장군",
    description: "우주군 연합 작전 참여",
    actions: ["군사 연합 작전 지휘"],
    relations: [],
    fate: "말일 전투에서 전사"
  },
  "세이": {
    role: "UN 사무총장",
    description: "삼체 위기 상황에서 인류의 정치적 통합을 이끈 지도자",
    actions: ["면벽 계획 승인", "국제 협력 조율", "PDC 설립"],
    relations: [],
    fate: "임기 후 생존"
  },
  "켄트": {
    role: "PDC 연락 담당관",
    description: "면벽 계획의 실무적 조율자",
    actions: ["면벽자와 UN 소통", "뤄지 지원"],
    relations: [],
    fate: "생존"
  },
  "가라닛": {
    role: "PDC 의장",
    description: "행성방위이사회를 이끌며 최고 수준의 의사결정",
    actions: ["PDC 전략 결정", "면벽자 감시"],
    relations: [],
    fate: "임기 후 생존"
  },
  "둥펑웨이": {
    role: "자연선택호 함장, 여성 최초 함대 사령관",
    description: "뛰어난 전술 능력과 리더십으로 존경받음",
    actions: ["아시아 함대 지휘", "말일 전투 참전"],
    relations: [],
    fate: "말일 전투에서 전사"
  },
  "벤저 시트": {
    role: "아시아 함대 협의회 파견관",
    description: "생존을 위한 극단적 선택에 직면",
    actions: ["블루스페이스호와 암흑 전투"],
    relations: [],
    fate: "도덕적 딜레마 직면"
  },
  "지쯔": {
    role: "아시아 함대 과학교",
    description: "함대 과학 지원 담당",
    actions: ["함대 과학 기술 지원"],
    relations: [],
    fate: "말일 전투에서 전사"
  },
  "샹원차오": {
    role: "은퇴 노동자",
    description: "민간인 시각에서 위기를 바라봄",
    actions: ["민간 생존 경험"],
    relations: [],
    fate: "생존"
  },
  "양진원": {
    role: "은퇴 교사",
    description: "민간인 시각에서 위기를 바라봄",
    actions: ["교육적 관점 제시"],
    relations: [],
    fate: "생존"
  },
  "마오푸취안": {
    role: "사업가",
    description: "경제적 관점에서 위기 대응",
    actions: ["민간 경제 활동"],
    relations: [],
    fate: "생존"
  },
  "소창": {
    role: "PDC 보안 담당관",
    description: "행성방위이사회 보안 업무 담당",
    actions: ["PDC 보안 유지"],
    relations: ["소샤오밍(부자-아들)"],
    fate: "생존"
  },
  "소샤오밍": {
    role: "소창의 아들",
    description: "아버지 소창과 함께 등장",
    actions: [],
    relations: ["소창(부자-아버지)"],
    fate: "생존"
  },
  "딩이": {
    role: "이론물리학자",
    description: "물리학 법칙 붕괴를 발견",
    actions: ["과학 연구", "소폰 현상 발견"],
    relations: ["왕먀오(동료)"],
    fate: "생존"
  },
  "장잉": {
    role: "예술가",
    description: "철학적·예술적 관점 제시",
    actions: ["예술 활동", "철학적 교류"],
    relations: [],
    fate: "생존"
  }
}

// Events data - key events between characters/groups
const eventsData = [
  {
    from: "삼체 문명",
    to: "예원제",
    event: "첫 접촉 (1979)",
    description: "예원제가 홍안 기지에서\n삼체에 신호 송신",
    type: "contact"
  },
  {
    from: "예원제",
    to: "마이크 에반스",
    event: "ETO 결성",
    description: "지구삼체조직 창립",
    type: "alliance"
  },
  {
    from: "인류 연합",
    to: "뤄지",
    event: "면벽자 임명 (2008)",
    description: "면벽 계획 시작",
    type: "appointment"
  },
  {
    from: "뤄지",
    to: "삼체 문명",
    event: "암흑의 숲 위협",
    description: "187J3X1 항성계 파괴로\n삼체 함대 후퇴",
    type: "conflict"
  },
  {
    from: "창웨이스",
    to: "장베이하이",
    event: "사상적 대립",
    description: "승리주의 vs 도망주의",
    type: "ideological"
  },
  {
    from: "인류 연합",
    to: "창웨이스",
    event: "말일 전투 (2208)",
    description: "삼체 탐사선에 패배\n인류 함대 전멸",
    type: "battle"
  },
  {
    from: "마이크 에반스",
    to: "인류 연합",
    event: "나노와이어 작전",
    description: "심판자호 절단\nETO 소탕",
    type: "battle"
  }
]

// Separated structure: Trisolaran-aligned vs Human organizations
const structureData = {
  // Trisolaran side (top section)
  trisolaranSide: {
    root: {
      id: "삼체 문명",
      group: "삼체",
      x: 350,
      y: 200
    },
    branches: [
      {
        title: "ETO (지구삼체 조직)",
        color: "#FF9900",
        nodes: [
          { id: "예원제", group: "지구-최초접촉", role: "ETO 창립자", level: 1 },
          { id: "마이크 에반스", group: "ETO", role: "ETO 수장", level: 1 },
          { id: "구세파", group: "ETO", role: "극단주의", level: 2, parent: "마이크 에반스" },
          { id: "구도파", group: "ETO", role: "온건파", level: 2, parent: "마이크 에반스" }
        ]
      }
    ]
  },

  // Human side (bottom section) - independent organizations
  humanSide: {
    root: {
      id: "인류 연합",
      group: "정치",
      x: 350,
      y: 500
    },
    branches: [
      {
        title: "면벽 계획",
        color: "#66CCFF",
        nodes: [
          { id: "뤄지", group: "면벽자", role: "사회학자", level: 1 },
          { id: "프레데릭 타일러", group: "면벽자", role: "美 국방장관", level: 1 },
          { id: "마누엘 레이디아즈", group: "면벽자", role: "베네수엘라 대통령", level: 1 },
          { id: "빌 하인즈", group: "면벽자", role: "英 과학자", level: 1 },
          { id: "아마소 게이코", group: "면벽자", role: "日 과학자", level: 2, parent: "빌 하인즈" }
        ]
      },
      {
        title: "PDC (행성방위이사회)",
        color: "#66CC66",
        nodes: [
          { id: "세이", group: "정치", role: "UN 사무총장", level: 1 },
          { id: "가라닛", group: "정치", role: "PDC 의장", level: 1 },
          { id: "켄트", group: "정치", role: "PDC 연락관", level: 2, parent: "가라닛" }
        ]
      },
      {
        title: "우주군",
        color: "#0099CC",
        nodes: [
          { id: "창웨이스", group: "군사", role: "우주군 사령관", level: 1 },
          { id: "장베이하이", group: "군사", role: "정치위원", level: 2, parent: "창웨이스" },
          { id: "둥펑웨이", group: "우주전", role: "함장", level: 2, parent: "창웨이스" },
          { id: "우웨이", group: "군사", role: "해군 대령", level: 2, parent: "창웨이스" }
        ]
      },
      {
        title: "우주 함대",
        color: "#CC66FF",
        nodes: [
          { id: "벤저 시트", group: "우주전", role: "파견관", level: 1 },
          { id: "지쯔", group: "우주전", role: "과학교", level: 1 },
          { id: "조지 피츠로이", group: "군사", role: "美 장군", level: 1 }
        ]
      },
      {
        title: "민간/과학",
        color: "#CCCCCC",
        nodes: [
          { id: "딩이", group: "과학", role: "이론물리학자", level: 1 },
          { id: "소창", group: "민간", role: "PDC 보안", level: 1 },
          { id: "소샤오밍", group: "민간", role: "아들", level: 2, parent: "소창" },
          { id: "샹원차오", group: "민간", role: "은퇴 노동자", level: 1 },
          { id: "양진원", group: "민간", role: "은퇴 교사", level: 1 },
          { id: "장잉", group: "예술", role: "예술가", level: 1 }
        ]
      }
    ]
  }
}

const groupColors = {
  "삼체": "#FF6666",
  "ETO": "#FF9900",
  "면벽자": "#66CCFF",
  "군사": "#0099CC",
  "정치": "#66CC66",
  "우주전": "#CC66FF",
  "민간": "#CCCCCC",
  "과학": "#00CC99",
  "예술": "#FFCC99",
  "지구-최초접촉": "#FF3366"
}

export default function CharacterNetwork() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const container = containerRef.current
    const width = 3000
    const height = 5000

    // Clear previous content
    const svg = svgRef.current
    svg.innerHTML = ''
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

    // Two separate sections: Trisolaran vs Human
    const nodes = []
    const links = []
    const nodeMap = new Map()
    const groupBoxes = []  // Store group box information

    const branchStartX = 800
    const levelSpacingX = 500
    const nodeSpacingY = 200
    const branchSpacingY = 500

    // Function to render a side (Trisolaran or Human)
    const renderSide = (sideData, startY, nodeIdOffset) => {
      let currentNodeId = nodeIdOffset
      let currentY = startY

      // Root node
      const rootNode = {
        id: currentNodeId++,
        label: sideData.root.id,
        group: sideData.root.group,
        x: sideData.root.x,
        y: currentY,
        isRoot: true
      }
      nodes.push(rootNode)
      nodeMap.set(rootNode.label, rootNode)

      currentY += 180  // Space after root

      // Render branches
      sideData.branches.forEach((branch, branchIndex) => {
        const branchStartY = currentY

        // Group nodes by level
        const levelGroups = {}
        branch.nodes.forEach(node => {
          if (!levelGroups[node.level]) levelGroups[node.level] = []
          levelGroups[node.level].push(node)
        })

        // Calculate max nodes in any level for this branch
        let maxNodesInLevel = 0
        let maxLevel = 0
        Object.keys(levelGroups).forEach(level => {
          maxNodesInLevel = Math.max(maxNodesInLevel, levelGroups[level].length)
          maxLevel = Math.max(maxLevel, parseInt(level))
        })

        // Calculate group box dimensions
        const boxPadding = 80
        const boxX = branchStartX - boxPadding - 400
        const boxY = branchStartY - boxPadding
        const boxWidth = (maxLevel) * levelSpacingX + 800
        const boxHeight = maxNodesInLevel * nodeSpacingY + boxPadding * 2 + 50

        // Store group box info
        groupBoxes.push({
          x: boxX,
          y: boxY,
          width: boxWidth,
          height: boxHeight,
          title: branch.title,
          color: branch.color
        })

        // Position nodes
        Object.keys(levelGroups).sort().forEach((level) => {
          const levelNodes = levelGroups[level]

          levelNodes.forEach((node, nodeIdx) => {
            const nodeData = {
              id: currentNodeId++,
              label: node.id,
              group: node.group,
              role: node.role,
              x: branchStartX + (level - 1) * levelSpacingX,
              y: branchStartY + nodeIdx * nodeSpacingY,
              level: level,
              branch: branchIndex
            }
            nodes.push(nodeData)
            nodeMap.set(node.id, nodeData)

            // Connect to parent
            if (node.parent) {
              const parentNode = nodeMap.get(node.parent)
              if (parentNode) {
                links.push({
                  source: parentNode.id,
                  target: nodeData.id
                })
              }
            } else if (level == 1) {
              // Connect level 1 nodes to root
              links.push({
                source: rootNode.id,
                target: nodeData.id
              })
            }
          })
        })

        // Update currentY based on actual nodes in this branch
        currentY = branchStartY + maxNodesInLevel * nodeSpacingY + 150
      })

      return { nextNodeId: currentNodeId, nextY: currentY }
    }

    // Render Trisolaran side (top)
    let result1 = renderSide(structureData.trisolaranSide, 200, 0)

    // Render Human side (bottom) - dynamic spacing based on Trisolaran side
    let result2 = renderSide(structureData.humanSide, result1.nextY + 250, result1.nextNodeId)

    // Calculate total height needed and update SVG
    const totalHeight = result2.nextY + 100
    svg.setAttribute('viewBox', `0 0 ${width} ${totalHeight}`)

    // Filter function
    const filterByGroup = (group) => {
      const filteredNodes = group ? nodes.filter(n => n.group === group) : nodes
      const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
      const filteredLinks = links.filter(l => filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target))

      // Update visibility
      document.querySelectorAll('.node-group').forEach(el => {
        const nodeGroup = el.getAttribute('data-group')
        if (!group || nodeGroup === group) {
          el.style.opacity = '1'
          el.style.transform = 'scale(1)'
        } else {
          el.style.opacity = '0.1'
          el.style.transform = 'scale(0.8)'
        }
      })

      document.querySelectorAll('.link-path').forEach(el => {
        const sourceId = parseInt(el.getAttribute('data-source'))
        const targetId = parseInt(el.getAttribute('data-target'))
        if (!group || (filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId))) {
          el.style.opacity = '0.5'
        } else {
          el.style.opacity = '0.05'
        }
      })
    }

    // Make filter function available globally
    window.filterThreeBodyByGroup = filterByGroup

    // Render group boxes first (background)
    const groupBoxGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    groupBoxGroup.setAttribute('class', 'group-boxes')

    groupBoxes.forEach(box => {
      // Box background
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', box.x)
      rect.setAttribute('y', box.y)
      rect.setAttribute('width', box.width)
      rect.setAttribute('height', box.height)
      rect.setAttribute('fill', box.color || '#333')
      rect.setAttribute('fill-opacity', '0.1')
      rect.setAttribute('stroke', box.color || '#4ecdc4')
      rect.setAttribute('stroke-width', '3')
      rect.setAttribute('stroke-opacity', '0.6')
      rect.setAttribute('rx', '20')
      rect.setAttribute('ry', '20')
      groupBoxGroup.appendChild(rect)

      // Box title
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      titleText.setAttribute('x', box.x + 20)
      titleText.setAttribute('y', box.y - 10)
      titleText.setAttribute('fill', box.color || '#4ecdc4')
      titleText.setAttribute('font-size', '32px')
      titleText.setAttribute('font-weight', '700')
      titleText.textContent = box.title
      groupBoxGroup.appendChild(titleText)
    })
    svg.appendChild(groupBoxGroup)

    // Render links with horizontal bezier curves
    const linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    linkGroup.setAttribute('class', styles.links)

    links.forEach(link => {
      const source = nodes.find(n => n.id === link.source)
      const target = nodes.find(n => n.id === link.target)

      if (!source || !target) return

      // Horizontal bezier curve
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      const midX = (source.x + target.x) / 2
      const d = `M ${source.x} ${source.y} C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`

      path.setAttribute('d', d)
      path.setAttribute('stroke', '#4ecdc4')
      path.setAttribute('stroke-width', '2')
      path.setAttribute('fill', 'none')
      path.setAttribute('opacity', '0.4')
      path.setAttribute('class', 'link-path')
      path.setAttribute('data-source', link.source)
      path.setAttribute('data-target', link.target)
      path.style.transition = 'opacity 0.3s ease'

      linkGroup.appendChild(path)
    })
    svg.appendChild(linkGroup)

    // Render event links (dotted lines for cross-group events)
    const eventLinkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    eventLinkGroup.setAttribute('class', 'event-links')

    eventsData.forEach(eventData => {
      const sourceNode = nodes.find(n => n.label === eventData.from)
      const targetNode = nodes.find(n => n.label === eventData.to)

      if (!sourceNode || !targetNode) return

      // Check if this is a cross-group event (not parent-child relationship)
      const isExistingLink = links.some(link =>
        (link.source === sourceNode.id && link.target === targetNode.id) ||
        (link.source === targetNode.id && link.target === sourceNode.id)
      )

      if (!isExistingLink) {
        // Draw dotted line for cross-group events
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        const midX = (sourceNode.x + targetNode.x) / 2
        const d = `M ${sourceNode.x} ${sourceNode.y} C ${midX} ${sourceNode.y}, ${midX} ${targetNode.y}, ${targetNode.x} ${targetNode.y}`

        const eventColors = {
          contact: '#FFD700',
          alliance: '#4CAF50',
          appointment: '#2196F3',
          conflict: '#F44336',
          ideological: '#9C27B0',
          battle: '#FF5722'
        }

        path.setAttribute('d', d)
        path.setAttribute('stroke', eventColors[eventData.type] || '#FFA500')
        path.setAttribute('stroke-width', '3')
        path.setAttribute('stroke-dasharray', '8,4')
        path.setAttribute('fill', 'none')
        path.setAttribute('opacity', '0.6')
        eventLinkGroup.appendChild(path)
      }
    })
    svg.appendChild(eventLinkGroup)

    // Render event nodes on links
    const eventGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    eventGroup.setAttribute('class', 'events')

    eventsData.forEach(eventData => {
      const sourceNode = nodes.find(n => n.label === eventData.from)
      const targetNode = nodes.find(n => n.label === eventData.to)

      if (!sourceNode || !targetNode) return

      // Calculate midpoint on the bezier curve
      const midX = (sourceNode.x + targetNode.x) / 2
      const midY = (sourceNode.y + targetNode.y) / 2

      // Event type colors
      const eventColors = {
        contact: '#FFD700',
        alliance: '#4CAF50',
        appointment: '#2196F3',
        conflict: '#F44336',
        ideological: '#9C27B0',
        battle: '#FF5722'
      }

      const eventColor = eventColors[eventData.type] || '#FFA500'

      // Event box
      const eventBox = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      eventBox.setAttribute('class', 'event-node')
      eventBox.style.cursor = 'pointer'

      // Background rectangle - larger size
      const rectWidth = 280
      const rectHeight = 120
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', midX - rectWidth / 2)
      rect.setAttribute('y', midY - rectHeight / 2)
      rect.setAttribute('width', rectWidth)
      rect.setAttribute('height', rectHeight)
      rect.setAttribute('fill', eventColor)
      rect.setAttribute('fill-opacity', '0.9')
      rect.setAttribute('stroke', '#fff')
      rect.setAttribute('stroke-width', '3')
      rect.setAttribute('rx', '15')
      rect.setAttribute('ry', '15')
      rect.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'

      // Event title
      const eventTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      eventTitle.setAttribute('x', midX)
      eventTitle.setAttribute('y', midY - 15)
      eventTitle.setAttribute('fill', '#fff')
      eventTitle.setAttribute('font-size', '20px')
      eventTitle.setAttribute('font-weight', '700')
      eventTitle.setAttribute('text-anchor', 'middle')
      eventTitle.textContent = eventData.event

      // Event description
      const eventDesc = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      eventDesc.setAttribute('x', midX)
      eventDesc.setAttribute('y', midY + 20)
      eventDesc.setAttribute('fill', '#fff')
      eventDesc.setAttribute('font-size', '16px')
      eventDesc.setAttribute('text-anchor', 'middle')

      // Split description by newline
      const descLines = eventData.description.split('\n')
      descLines.forEach((line, idx) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
        tspan.setAttribute('x', midX)
        tspan.setAttribute('dy', idx === 0 ? '0' : '20')
        tspan.textContent = line
        eventDesc.appendChild(tspan)
      })

      // Hover effect
      eventBox.addEventListener('mouseenter', () => {
        rect.setAttribute('fill-opacity', '1')
        rect.style.filter = 'drop-shadow(0 6px 12px rgba(0,0,0,0.7))'
      })
      eventBox.addEventListener('mouseleave', () => {
        rect.setAttribute('fill-opacity', '0.9')
        rect.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
      })

      eventBox.appendChild(rect)
      eventBox.appendChild(eventTitle)
      eventBox.appendChild(eventDesc)
      eventGroup.appendChild(eventBox)
    })
    svg.appendChild(eventGroup)

    // Render nodes
    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    nodeGroup.setAttribute('class', styles.nodes)

    nodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.setAttribute('class', 'node-group')
      g.setAttribute('data-group', node.group)
      g.style.transition = 'opacity 0.3s ease, transform 0.3s ease'

      // Title nodes (category headers)
      if (node.isTitle) {
        const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        titleText.setAttribute('x', node.x)
        titleText.setAttribute('y', node.y)
        titleText.setAttribute('fill', node.color)
        titleText.setAttribute('font-size', '24px')
        titleText.setAttribute('font-weight', '700')
        titleText.setAttribute('text-anchor', 'middle')
        titleText.textContent = `━━ ${node.label} ━━`
        g.appendChild(titleText)
        nodeGroup.appendChild(g)
        return
      }

      // Regular nodes
      const radius = node.isRoot ? 35 : 22

      // Circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', node.x)
      circle.setAttribute('cy', node.y)
      circle.setAttribute('r', radius)
      circle.setAttribute('fill', groupColors[node.group] || '#999')
      circle.setAttribute('stroke', '#fff')
      circle.setAttribute('stroke-width', node.isRoot ? '4' : '3')
      circle.style.cursor = 'pointer'
      circle.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))'

      // Click to show character details
      circle.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelectedCharacter(node.label)
      })

      // Hover effect
      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', radius + 4)
        circle.style.filter = 'drop-shadow(0 4px 12px rgba(78, 205, 196, 0.8))'
      })
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', radius)
        circle.style.filter = 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))'
      })

      // Label (to the right of circle)
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', node.x + radius + 12)
      text.setAttribute('y', node.y)
      text.setAttribute('fill', '#ffffff')
      text.setAttribute('font-size', node.isRoot ? '40px' : '28px')
      text.setAttribute('font-weight', node.isRoot ? '700' : '600')
      text.setAttribute('dominant-baseline', 'middle')
      text.textContent = node.label

      // Role label (smaller, below label)
      if (node.role) {
        const roleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        roleText.setAttribute('x', node.x + radius + 12)
        roleText.setAttribute('y', node.y + 32)
        roleText.setAttribute('fill', '#ff6b6b')
        roleText.setAttribute('font-size', '22px')
        roleText.setAttribute('font-style', 'italic')
        roleText.textContent = `(${node.role})`
        g.appendChild(roleText)
      }

      g.appendChild(circle)
      g.appendChild(text)
      nodeGroup.appendChild(g)
    })
    svg.appendChild(nodeGroup)

  }, [])

  const handleLegendClick = (group) => {
    if (window.filterThreeBodyByGroup) {
      if (selectedGroup === group) {
        setSelectedGroup(null)
        window.filterThreeBodyByGroup(null)
      } else {
        setSelectedGroup(group)
        window.filterThreeBodyByGroup(group)
      }
    }
  }

  const closeDetailPanel = () => {
    setSelectedCharacter(null)
  }

  const characterInfo = selectedCharacter ? characterDetails[selectedCharacter] : null

  return (
    <div className={styles.networkWrapper} ref={containerRef} onClick={() => setSelectedCharacter(null)}>
      <div className={styles.legend}>
        <h3>그룹별 필터 (클릭하여 필터링)</h3>
        <div className={styles.legendGrid}>
          {Object.entries(groupColors).map(([group, color]) => (
            <div
              key={group}
              className={styles.legendItem}
              onClick={() => handleLegendClick(group)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.legendColor} style={{ backgroundColor: color }}></div>
              <span>{group}</span>
            </div>
          ))}
        </div>
        <div className={styles.resetButton} onClick={() => handleLegendClick(null)}>
          🔄 전체 보기
        </div>
      </div>

      <div className={styles.graphContainer}>
        <svg ref={svgRef} className={styles.networkSvg}></svg>
      </div>

      {/* Character Detail Panel */}
      {selectedCharacter && characterInfo && (
        <div className={styles.detailPanel} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={closeDetailPanel}>✕</button>
          <h2 className={styles.detailTitle}>{selectedCharacter}</h2>
          <div className={styles.detailRole}>{characterInfo.role}</div>

          <div className={styles.detailSection}>
            <h3>📝 인물 소개</h3>
            <p>{characterInfo.description}</p>
          </div>

          {characterInfo.actions && characterInfo.actions.length > 0 && (
            <div className={styles.detailSection}>
              <h3>⚡ 주요 활동</h3>
              <ul className={styles.detailList}>
                {characterInfo.actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          )}

          {characterInfo.relations && characterInfo.relations.length > 0 && (
            <div className={styles.detailSection}>
              <h3>👥 인물 관계</h3>
              <ul className={styles.detailList}>
                {characterInfo.relations.map((relation, i) => (
                  <li key={i}>{relation}</li>
                ))}
              </ul>
            </div>
          )}

          {characterInfo.fate && (
            <div className={styles.detailSection}>
              <h3>🎭 최후</h3>
              <p className={styles.detailFate}>{characterInfo.fate}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
