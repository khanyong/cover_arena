import { useEffect, useRef, useState } from 'react'
import styles from './styles/CharacterNetwork.module.css'
import { characterDetails } from './data/characters'
import { eventsData, eventColors } from './data/events'
import { structureData, groupColors, relationshipDescriptions } from './data/structure'
import { estimateNodeWidth, nodeHeight, layoutGraph, calculateBranchBoxes, placeEventBox, edgePathFromPoints, rectAttachPoint } from './utils/dagreLayout'
import Legend from './Legend'
import DetailPanel from './DetailPanel'

export default function CharacterNetwork() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 })

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const svg = svgRef.current
    const container = containerRef.current
    svg.innerHTML = ''

    // 1) 구조 데이터를 ELK 그래프로 변환
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
        width: estimateNodeWidth(label, isRoot ? 40 : 28, isRoot ? 50 : 40),
        height: nodeHeight(!!role)
      })
    }

    const addEdge = (src, tgt) => {
      edges.push({ id: `${src}->${tgt}`, sources: [src], targets: [tgt] })
    }

    // Trisolaran side
    addNode(
      structureData.trisolaranSide.root.id,
      structureData.trisolaranSide.root.id,
      structureData.trisolaranSide.root.group,
      undefined,
      true,
      'trisolaran-root'
    )

    structureData.trisolaranSide.branches.forEach((branch, bi) => {
      const key = `tri-${bi}`
      branch.nodes.forEach(node => {
        addNode(node.id, node.id, node.group, node.role, false, key)
        if (node.parent) {
          addEdge(node.parent, node.id)
        } else if (node.level === 1) {
          addEdge(structureData.trisolaranSide.root.id, node.id)
        }
      })
    })

    // Human side
    addNode(
      structureData.humanSide.root.id,
      structureData.humanSide.root.id,
      structureData.humanSide.root.group,
      undefined,
      true,
      'human-root'
    )

    structureData.humanSide.branches.forEach((branch, bi) => {
      const key = `hum-${bi}`
      branch.nodes.forEach(node => {
        addNode(node.id, node.id, node.group, node.role, false, key)
        if (node.parent) {
          addEdge(node.parent, node.id)
        } else if (node.level === 1) {
          addEdge(structureData.humanSide.root.id, node.id)
        }
      })
    })

    // 2) Dagre 레이아웃 실행 (동기 방식)
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
        node
      }
    })

    // 4) 브랜치 bbox 계산
    const branchBoxes = calculateBranchBoxes(nodes, positions, structureData)

    // 5) SVG 크기
    const pad = 150
    const maxX = Math.max(...Object.values(positions).map(p => p.x + p.w)) + pad
    const maxY = Math.max(...Object.values(positions).map(p => p.y + p.h)) + pad
    const viewBox = `0 0 ${maxX} ${maxY}`
    svg.setAttribute('viewBox', viewBox)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

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

    // 7) 엣지 (구조 링크) - Dagre points 사용
    const edgeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    ;(graph.edges || []).forEach(edge => {
      const d = edgePathFromPoints(edge.points)
      if (!d) return

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', d)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', '#7fe3d6')
      path.setAttribute('stroke-width', '2.5')
      path.setAttribute('opacity', '0.5')
      path.setAttribute('class', 'link-path')

      // 툴팁 이벤트 추가
      const relationKey = edge.id.replace('->', '->')
      const description = relationshipDescriptions[relationKey]

      if (description) {
        path.style.cursor = 'pointer'

        path.addEventListener('mouseenter', (e) => {
          const rect = container.getBoundingClientRect()
          setTooltip({
            show: true,
            text: description,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          })
          path.setAttribute('stroke-width', '4')
          path.setAttribute('opacity', '0.8')
        })

        path.addEventListener('mouseleave', () => {
          setTooltip({ show: false, text: '', x: 0, y: 0 })
          path.setAttribute('stroke-width', '2.5')
          path.setAttribute('opacity', '0.5')
        })
      }

      edgeLayer.appendChild(path)
    })
    svg.appendChild(edgeLayer)

    // 8) 이벤트 링크 삭제됨 (사용자 요청)

    // 9) 노드 렌더
    const nodeLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    nodes.forEach(node => {
      const pos = positions[node.id]
      const gNode = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      gNode.setAttribute('class', 'node-group')
      gNode.setAttribute('data-group', node.group)

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', pos.x)
      rect.setAttribute('y', pos.y)
      rect.setAttribute('width', pos.w)
      rect.setAttribute('height', pos.h)
      rect.setAttribute('rx', '12')
      rect.setAttribute('ry', '12')
      rect.setAttribute('fill', groupColors[node.group] || '#999')
      rect.setAttribute('stroke', '#fff')
      rect.setAttribute('stroke-width', node.isRoot ? '4' : '3')
      rect.style.filter = 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))'
      rect.style.cursor = 'pointer'

      rect.addEventListener('click', e => {
        e.stopPropagation()
        setSelectedCharacter(node.label)
      })
      gNode.appendChild(rect)

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      label.setAttribute('x', pos.x + 15)
      label.setAttribute('y', pos.y + (node.isRoot ? 32 : 26))
      label.setAttribute('fill', '#fff')
      label.setAttribute('font-size', node.isRoot ? '28' : '22')
      label.setAttribute('font-weight', node.isRoot ? '800' : '700')
      label.textContent = node.label
      gNode.appendChild(label)

      if (node.role) {
        const role = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        role.setAttribute('x', pos.x + 15)
        role.setAttribute('y', pos.y + (node.isRoot ? 60 : 50))
        role.setAttribute('fill', '#ffeead')
        role.setAttribute('font-size', '17')
        role.setAttribute('font-style', 'italic')
        role.textContent = `(${node.role})`
        gNode.appendChild(role)
      }

      nodeLayer.appendChild(gNode)
    })
    svg.appendChild(nodeLayer)
  }, [])

  const handleLegendClick = group => {
    if (selectedGroup === group) {
      // 같은 그룹 재클릭 시 필터 해제
      setSelectedGroup(null)
      document.querySelectorAll('.node-group').forEach(el => {
        el.style.opacity = '1'
      })
      document.querySelectorAll('.link-path').forEach(el => {
        el.style.opacity = '0.5'
      })
    } else {
      // 그룹 필터 적용
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

  const characterInfo = selectedCharacter ? characterDetails[selectedCharacter] : null

  return (
    <div className={styles.networkWrapper} ref={containerRef} onClick={() => setSelectedCharacter(null)}>
      <Legend
        groupColors={groupColors}
        selectedGroup={selectedGroup}
        onGroupClick={handleLegendClick}
      />

      <div className={styles.graphContainer}>
        <svg ref={svgRef} className={styles.networkSvg} />

        {tooltip.show && (
          <div
            className={styles.edgeTooltip}
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      <DetailPanel
        character={selectedCharacter}
        characterInfo={characterInfo}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  )
}
