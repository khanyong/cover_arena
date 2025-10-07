// Events data - key events between characters/groups
export const eventsData = [
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

export const eventColors = {
  contact: '#FFD700',
  alliance: '#4CAF50',
  appointment: '#2196F3',
  conflict: '#F44336',
  ideological: '#9C27B0',
  battle: '#FF5722'
}
