import dagre from 'dagre'

// 텍스트 길이 기반 노드 폭 계산
export function estimateNodeWidth(label, fontSize = 28, padding = 40) {
  const avg = fontSize * 0.65 // 한글 평균 폭
  return Math.max(180, Math.min(450, padding + label.length * avg))
}

export function nodeHeight(hasRole = false) {
  return hasRole ? 80 : 60
}

// Dagre 그래프 레이아웃 실행
export function layoutGraph(nodes, edges) {
  const g = new dagre.graphlib.Graph()

  // 그래프 설정
  g.setGraph({
    rankdir: 'LR',          // Left to Right (가로 레이아웃)
    nodesep: 70,            // 같은 레이어(세로 컬럼) 노드 간격 - 줄임
    ranksep: 300,           // 레이어(가로 단계) 간 간격
    marginx: 120,
    marginy: 80,            // 상하 여백 줄임
    edgesep: 35,            // 엣지 간 간격 줄임
    acyclicer: 'greedy',
    ranker: 'longest-path'  // 계층 정렬 방식
  })

  g.setDefaultEdgeLabel(() => ({}))

  // 노드 추가
  nodes.forEach(node => {
    g.setNode(node.id, {
      width: node.width,
      height: node.height,
      label: node.label,
      group: node.group,
      role: node.role,
      isRoot: node.isRoot,
      branchKey: node.branchKey
    })
  })

  // 엣지 추가
  edges.forEach(edge => {
    g.setEdge(edge.sources[0], edge.targets[0])
  })

  // 레이아웃 계산
  dagre.layout(g)

  // 결과를 ELK 형식과 유사하게 반환
  const children = []
  const edgeResults = []

  g.nodes().forEach(nodeId => {
    const node = g.node(nodeId)
    children.push({
      id: nodeId,
      x: node.x - node.width / 2,   // dagre는 중심점 반환, 좌상단으로 변환
      y: node.y - node.height / 2,
      width: node.width,
      height: node.height,
      properties: node
    })
  })

  g.edges().forEach(e => {
    const edge = g.edge(e)
    edgeResults.push({
      id: `${e.v}->${e.w}`,
      sources: [e.v],
      targets: [e.w],
      points: edge.points || []
    })
  })

  return {
    children,
    edges: edgeResults,
    width: g.graph().width,
    height: g.graph().height
  }
}

// Helper: Calculate edge attach point on rectangle
export function rectAttachPoint(ax, ay, aw, ah, bx, by) {
  const cx = ax + aw / 2
  const cy = ay + ah / 2
  const dx = bx - cx
  const dy = by - cy

  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
    return { x: cx, y: cy }
  }

  const tX = dx > 0 ? aw / 2 : -aw / 2
  const tY = dy > 0 ? ah / 2 : -ah / 2

  // Determine which edge (top/bottom vs left/right) is hit first
  if (Math.abs(dx / (aw / 2)) > Math.abs(dy / (ah / 2))) {
    // Hit left or right edge first
    const ry = cy + (dy / dx) * tX
    return { x: cx + tX, y: ry }
  } else {
    // Hit top or bottom edge first
    const rx = cx + (dx / dy) * tY
    return { x: rx, y: cy + tY }
  }
}

// 이벤트 박스 위치 계산 - 법선 방향 오프셋으로 노드 겹침 방지
export function placeEventBox(ax, ay, bx, by, offset = 150, boxWidth = 300, boxHeight = 120, allPositions = {}) {
  const mx = (ax + bx) / 2
  const my = (ay + by) / 2
  const dx = bx - ax
  const dy = by - ay
  const len = Math.max(1, Math.hypot(dx, dy))

  // 법선 벡터 (-dy, dx)
  const nx = -dy / len
  const ny = dx / len

  // 기본 오프셋 적용
  let candidateX = mx + nx * offset
  let candidateY = my + ny * offset

  // 노드와 겹치는지 체크하고 오프셋 증가
  let finalOffset = offset
  let attempts = 0
  while (attempts < 5) {
    let hasOverlap = false

    for (const pos of Object.values(allPositions)) {
      // 박스와 노드 겹침 체크
      if (!(candidateX + boxWidth / 2 < pos.x ||
            candidateX - boxWidth / 2 > pos.x + pos.w ||
            candidateY + boxHeight / 2 < pos.y ||
            candidateY - boxHeight / 2 > pos.y + pos.h)) {
        hasOverlap = true
        break
      }
    }

    if (!hasOverlap) break

    // 겹치면 오프셋 증가
    finalOffset += 80
    candidateX = mx + nx * finalOffset
    candidateY = my + ny * finalOffset
    attempts++
  }

  return {
    x: candidateX,
    y: candidateY
  }
}

// 브랜치별 bbox 계산
export function calculateBranchBoxes(nodes, positions, structureData) {
  const branchBoxes = {}
  const branchMeta = {}

  // 브랜치 메타데이터 수집
  structureData.trisolaranSide.branches.forEach((b, i) => {
    branchMeta[`tri-${i}`] = { title: b.title, color: b.color }
  })
  structureData.humanSide.branches.forEach((b, i) => {
    branchMeta[`hum-${i}`] = { title: b.title, color: b.color }
  })

  // 각 노드를 순회하며 bbox 계산
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

  return branchBoxes
}

// Dagre 엣지 포인트를 SVG path로 변환
export function edgePathFromPoints(points) {
  if (!points || points.length < 2) return ''

  const d = [`M ${points[0].x} ${points[0].y}`]
  for (let i = 1; i < points.length; i++) {
    d.push(`L ${points[i].x} ${points[i].y}`)
  }
  return d.join(' ')
}
