# Prologue Chapter 1 Scene 1 — 승인본 사이트 반영 전달서

## 1. 승인된 문안

- 승인 버전: `PRO-CH1-SC1-RESTART-D1`
- 작품: The Resonance of Space: Architects of Spacetime
- 구간: PROLOGUE: THE NODE
- Chapter: The Cathedral in the Molasse
- Scene: The Architecture of Consensus
- 기존 대화상 Scene 식별자: `55b46292-0335-5fbc-ab9e-baa44d3bea70` — 실제 반영 대상과 대조 필요
- 사용자 승인: “전체 검토안으로 승인하고 이를 사이트에 반영하겠다.”
- 본문 파일: `PRO-CH1-SC1-RESTART-D1_APPROVED.md`
- 승인 근거: 직전 대화의 장면 전체 검토안에 대한 사용자 명시적 승인
- 이 전달서의 사이트 반영 상태: 미실행 / 미확인

본문 파일에는 승인된 영문 산문과 수식만 들어 있다. 제목·버전명·편집 해설·검토 표는 본문에 포함하지 않았다. 승인 후 문장 수정은 하지 않았다.

## 2. 적용 범위

Prologue Chapter 1 Scene 1의 첫 문장부터 마지막 `"Mark."`까지 장면 전체를 이번 승인문으로 반영한다. 에피그래프, 목차, Chapter/Scene 제목, Chapter 2 및 다른 장면은 이번 본문 교체 범위에 포함하지 않는다.

승인본의 첫 문단:

> At 07:45 Central European Time, dozens of operators and postdoctoral researchers at the NGC Central Control Center were turning raw telemetry into decisions the machine could execute.

승인본의 마지막 문단:

> "Mark."

## 3. 이전 Block별 문안과의 관계

이번 사이트 반영에서 사용할 현행 문안은 Scene 전체 승인본 `PRO-CH1-SC1-RESTART-D1` 하나다. 이전 `PRO-S1-B1-D1`, `PRO-S1-B2-D1`, `PRO-S1-B2-D2`를 별도로 덧붙이거나 일부를 섞지 않는다.

이전 Block 1의 14문단·285단어·신규 Version 5개 조건과 이전 Block 해시는 그 과거 적용 계약의 기록으로 보존한다. 이를 이번 Scene 전체의 검증 조건으로 사용하지 않는다. 과거 승인·실패 이력을 삭제하거나 완료된 것으로 소급 변경하지 않는다.

## 4. 개발 담당자의 처리 원칙

개발 담당자는 내용·문체·철자·문장부호·수식·문단 순서를 수정하지 않는다. 승인된 문단 경계를 저장 편의에 맞춰 병합하거나 분할하지 않는다. 화면의 자동 줄바꿈은 문단 경계 변경과 구분한다.

반영 전에 대상 Scene과 현재 저장본을 지정 원문과 대조하고 기존 버전을 보존한다. 불일치나 매핑 불명확성이 있으면 차이만 보고하며 임의로 원문을 추정하거나 복구하지 않는다. 잠긴 기준본은 변경하지 않는다.

저장 형식에 맞춘 JSON escaping 등 기술적 표현은 가능하지만, 디코딩된 본문은 승인문과 같아야 한다. 수식은 승인된 LaTeX 원문을 보존한다. 실제 문단 구분을 문자열 `\n\n`로 화면에 노출시키지 않는다.

79개는 산문·수식을 합친 승인 콘텐츠 블록 수이며 신규 DB Version 생성 건수가 아니다. 변경되지 않은 기존 문단은 재사용할 수 있다. DB 매핑·버전 생성 수는 실제 원문 대조 결과에 따라 산출하며, 이 전달서에서는 임의로 확정하지 않는다.

사이트 저장, 운영 반영, 독자용 표시의 실제 결과를 각각 구분해 보고한다. 이 전달서는 사용자 또는 개발 담당에게 넘기는 문안 기준이며, 작성자가 운영 사이트에 접속·저장·배포했다는 의미가 아니다. 일반 Migration·보안·다른 데이터 변경의 포괄 승인으로 확대하지 않는다.

## 5. 본문 파일 검증 기준

- 문자 인코딩: UTF-8, BOM 없음
- 줄바꿈: LF
- 콘텐츠 블록 사이: 빈 줄 1개 (`LF LF`)
- 파일 끝: LF 1개
- 산문·대화·상태 표시 문단: 75개
- 독립 수식 블록: 4개
- 합계 콘텐츠 블록: 79개
- 단어 수: 1,089
- 단어 수 규칙: 제목·해설 제외. 공백 구분. 수식 내용 포함, 독립 수식 구분자 `$$` 제외. 공백 없는 하이픈·대시 연결은 분리하지 않음.
- 파일 크기: 7,955 bytes
- 승인 본문 파일 SHA-256 (파일 끝 LF 포함):

```text
6d237aef954677bb7a942ee87f64c45f143f8fe0e58f8f1da86c88e641baa47a
```

저장 후 DB에서 읽어 온 문단·수식 원문을 같은 순서와 위 구분 규칙으로 재구성하여 승인 파일과 대조한다. 기존 공백·기호를 임의 정규화해 차이를 숨기지 않는다. Viewer에서는 문단 경계, 네 수식, 첫 문장과 마지막 문장, 인접 장면이 변경되지 않았는지 확인한다.

## 6. 반영 결과 보고

다음 사실만 간단히 보고한다.

```text
Applied editorial version: PRO-CH1-SC1-RESTART-D1
Target scene: [실제 확인된 ID]
Previous version preserved: [결과]
Working save: [결과]
Production application: [결과]
Reader publication: [결과]
Decoded text and paragraph boundaries: [MATCH / MISMATCH]
Content blocks: [실측값, 기대 79]
Display equations: [실측값, 기대 4]
Reconstructed manuscript SHA-256: [실측값]
Outside-scene changes: [실측 결과]
Unexpected issues: [내용 / NONE]
```

기술적 반영이 지연되어도 이후 장면의 문학적 편집은 이 대화에서 계속한다.
