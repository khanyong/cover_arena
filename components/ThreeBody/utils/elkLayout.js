import ELK from 'elkjs/lib/elk.bundled.js'

const elk = new ELK()

// 텍스트 길이 기반 노드 폭 계산
export function estimateNodeWidth(label, fontSize = 28, padding = 40) {
  const avg = fontSize * 0.65 // 한글 평균 폭
  return Math.max(180, Math.min(450, padding + label.length * avg))
}

export function nodeHeight(hasRole = false) {
  return hasRole ? 80 : 60
}

// ELK polyline → SVG path (includes all bendPoints)
export function edgePathFromSections(sections) {
  if (!sections || !sections.length) return ''
  const s = sections[0]

  // Combine startPoint + bendPoints + endPoint
  const points = [
    s.startPoint,
    ...(s.bendPoints || []),
    s.endPoint
  ].filter(Boolean)

  if (!points || !points.length) return ''

  const d = [`M ${points[0].x} ${points[0].y}`]
  for (let i = 1; i < points.length; i++) {
    d.push(`L ${points[i].x} ${points[i].y}`)
  }
  return d.join(' ')
}

// ELK 그래프 레이아웃 실행 - 겹침 최소화 옵션
export async function layoutGraph(nodes, edges) {
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',

      // ★ 간격 키우기 (가로 레이아웃에 맞게 조정)
      'elk.layered.spacing.nodeNodeBetweenLayers': '280',
      'elk.spacing.nodeNode': '150',
      'elk.spacing.edgeNode': '60',
      'elk.spacing.edgeEdge': '40',
      'elk.spacing.labelNode': '35',
      'elk.spacing.componentComponent': '320',

      // ★ 노드 배치 전략 (겹침/교차 최소화)
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',

      // ★ 엣지 라우팅 - 곡선으로 부드럽게
      'elk.edgeRouting': 'SPLINES',
      'elk.layered.mergeEdges': 'true',

      // ★ 포트/라벨 간격
      'elk.portConstraints': 'FIXED_SIDE',
      'elk.spacing.portPort': '25',

      'elk.padding': '[top=120,left=120,bottom=120,right=120]'
    },
    children: nodes.map(n => ({
      id: n.id,
      width: n.width,
      height: n.height,
      labels: [{ id: `${n.id}_label`, text: n.label }]
    })),
    edges: edges.map(e => ({
      id: e.id,
      sources: e.sources,
      targets: e.targets
    }))
  }

  return elk.layout(graph)
}

// 충돌 해결 - 같은 레이어의 노드들 밀어내기 (array-based with layer info)
// 가로 레이아웃(RIGHT)에서는 x축 대신 y축으로 정렬/밀어내기
export function resolveCollisions(posArray, gap = 30, direction = 'RIGHT') {
  // Group by layer
  const layers = new Map()
  posArray.forEach(pos => {
    const layerKey = pos.layer ?? 0
    if (!layers.has(layerKey)) layers.set(layerKey, [])
    layers.get(layerKey).push(pos)
  })

  // Sort and nudge within each layer
  if (direction === 'RIGHT') {
    // 가로 레이아웃: 같은 레이어(세로 컬럼)에서 y축으로 겹침 해결
    layers.forEach(layer => {
      layer.sort((a, b) => a.y - b.y)
      for (let i = 1; i < layer.length; i++) {
        const prev = layer[i - 1]
        const cur = layer[i]
        const overlap = (prev.y + prev.h + gap) - cur.y
        if (overlap > 0) cur.y += overlap
      }
    })
  } else {
    // 세로 레이아웃: 같은 레이어(가로 행)에서 x축으로 겹침 해결
    layers.forEach(layer => {
      layer.sort((a, b) => a.x - b.x)
      for (let i = 1; i < layer.length; i++) {
        const prev = layer[i - 1]
        const cur = layer[i]
        const overlap = (prev.x + prev.w + gap) - cur.x
        if (overlap > 0) cur.x += overlap
      }
    })
  }

  return posArray
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
// 박스 크기와 노드 위치를 고려하여 충분한 간격 확보
export function placeEventBox(ax, ay, bx, by, offset = 100, boxWidth = 300, boxHeight = 120, allPositions = {}) {
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

// ★ Step 4: Hierarchical sub-layout for branches (horizontal layout)
export async function layoutWithClusters(structureData) {
  const elk = new ELK()
  const clusters = []
  let xOffset = 150

  // Trisolaran root
  const triRoot = {
    id: structureData.trisolaranSide.root.id,
    x: xOffset,
    y: 400,
    w: estimateNodeWidth(structureData.trisolaranSide.root.id, 40, 50),
    h: 60,
    isRoot: true,
    group: structureData.trisolaranSide.root.group
  }
  clusters.push(triRoot)
  xOffset += 350

  // Trisolaran branches
  for (const [bi, branch] of structureData.trisolaranSide.branches.entries()) {
    const branchNodes = branch.nodes.map(n => ({
      id: n.id,
      width: estimateNodeWidth(n.id, 28, 40),
      height: nodeHeight(!!n.role),
      group: n.group,
      role: n.role
    }))

    const branchEdges = []
    branch.nodes.forEach(n => {
      if (n.parent) {
        branchEdges.push({ id: `${n.parent}->${n.id}`, sources: [n.parent], targets: [n.id] })
      }
    })

    const graph = {
      id: `tri-branch-${bi}`,
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'RIGHT',
        'elk.layered.spacing.nodeNodeBetweenLayers': '120',
        'elk.spacing.nodeNode': '90'
      },
      children: branchNodes,
      edges: branchEdges
    }

    const layout = await elk.layout(graph)
    layout.children.forEach(child => {
      clusters.push({
        id: child.id,
        x: child.x + xOffset,
        y: child.y + 200,
        w: child.width,
        h: child.height,
        group: branchNodes.find(n => n.id === child.id)?.group,
        role: branchNodes.find(n => n.id === child.id)?.role,
        branchKey: `tri-${bi}`
      })
    })

    xOffset += (layout.width || 400) + 200
  }

  xOffset += 150

  // Human root
  const humRoot = {
    id: structureData.humanSide.root.id,
    x: xOffset,
    y: 400,
    w: estimateNodeWidth(structureData.humanSide.root.id, 40, 50),
    h: 60,
    isRoot: true,
    group: structureData.humanSide.root.group
  }
  clusters.push(humRoot)
  xOffset += 350

  // Human branches
  for (const [bi, branch] of structureData.humanSide.branches.entries()) {
    const branchNodes = branch.nodes.map(n => ({
      id: n.id,
      width: estimateNodeWidth(n.id, 28, 40),
      height: nodeHeight(!!n.role),
      group: n.group,
      role: n.role
    }))

    const branchEdges = []
    branch.nodes.forEach(n => {
      if (n.parent) {
        branchEdges.push({ id: `${n.parent}->${n.id}`, sources: [n.parent], targets: [n.id] })
      }
    })

    const graph = {
      id: `hum-branch-${bi}`,
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'RIGHT',
        'elk.layered.spacing.nodeNodeBetweenLayers': '120',
        'elk.spacing.nodeNode': '90'
      },
      children: branchNodes,
      edges: branchEdges
    }

    const layout = await elk.layout(graph)
    layout.children.forEach(child => {
      clusters.push({
        id: child.id,
        x: child.x + xOffset,
        y: child.y + 200,
        w: child.width,
        h: child.height,
        group: branchNodes.find(n => n.id === child.id)?.group,
        role: branchNodes.find(n => n.id === child.id)?.role,
        branchKey: `hum-${bi}`
      })
    })

    xOffset += (layout.width || 400) + 200
  }

  return clusters
}
