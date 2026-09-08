# 템스코 3차 투자제안서 자료

## 자료를 넣는 곳

`source-materials/`에 분석할 자료를 넣는다. PDF, Excel, Word, PowerPoint, 이미지, 텍스트 등을 함께 넣어도 된다. 하위 폴더가 있는 경우 폴더째 넣어도 된다.

- 원래 파일명을 유지한다. 같은 이름의 서로 다른 파일은 날짜나 버전으로 구분한다.
- 최신본과 과거본을 함께 넣어도 된다. 어느 자료가 최신·확정본인지 알고 있다면 간단한 메모를 추가한다.
- 회사 소개, 재무 실적·추정, 고객·수주, 기술·제품, 설비·투자계획 등의 자료를 모두 이곳에서 접수한다.
- 계약상 제한이나 IR에 포함하지 않을 내용이 있다면 별도 메모에 표시한다.

## 분석과 작성 기준

원본 자료를 보존하면서 파일별 내용, 기준일, 실적/추정, 수치의 출처와 상충 여부를 정리한다. 자료에 없는 사실을 확정 사실로 채우지 않는다. 사용자가 허용한 미확정 재무항목의 수치화는 출처·분석 가정·실측 교체 항목을 명시한 1차 모델로 작성한다.

작성 대상은 `pages/temsco/deck-v3.tsx`이며, 화면은 `/temsco/deck-v3`이다. 초기원본과 기존 최종본은 독립적으로 유지한다.

- [입력자료 분석](analysis/result.md): 파일별 역할, 출처 셀, 재무모델 불일치와 추가 근거.
- [제3안 작성·디자인 기준](AUTHORING.md): 전문 투자자 대상 44장 구성과 디자인·모델 작성 원칙.
- `projects/temsco/DESIGN-BASELINE.md`는 최초 복제 시점의 기록이다. 사용자의 디자인 업그레이드 지시에 따라 제3안만 새 구성을 적용했다.

## 현재 제3안

- [화면 열기](http://localhost:3000/temsco/deck-v3) / [현재 44장 PDF](output/TEMSCO-IR-v3-assumptions-draft-20260909.pdf)
- [가치추정 분석서](valuation-analysis.md): 정확한 목차, 과거 실적, 시장·경쟁·매출, 전체 추정손익, WACC·FCFF·무성장 TV, 후속 투자유치.
- [1차 가정표](first-pass-assumptions.md): 일반법인 누진세, 자산군별 상각, 산업 운전자본, 추가 개발투자, 주주가치 조정과 변경 위치.
- [세 가지 시나리오 전체 계산](scenario-valuation-analysis.md): 낙관·중도·비관 손익/FCFF, DCF·시장배수 교차가치와 차이, 민감도.
- [회사 전망과 DCF 연결](research/company-forecast.md), [시장·경쟁사](research/market.md), [WACC 시장지표](research/wacc.md), [ERP 방법 선택](research/erp-method-review.md).
- 분석 기준일 2026-09-08 / 1차 가정 갱신 2026-09-09. 현재 DCF EV: 낙관943.65억·중도614.39억·비관283.07억. 2025말 순차입금235.10억·장부 NCI13.30억을 평가일 대용값으로 차감하고 기타 조정0을 가정한 전체 주주가치: 695.25억·365.99억·34.67억. 실측 잔액·확정 거래가격과 구분한다.
- 회사 손익 원표는16페이지에 유지한다. 30~32페이지는 상각·개발투자·누진세를 적용한 모델 손익이다. 실측으로 교체할 입력은 분석서7절과1차 가정표에 정리했다.
- 현재 검증: [44장 화면·PDF·모델 검사](verification-assumptions/result.md), [정밀 입력·출력](verification-assumptions/scenario-results.json).

2026-09-09 문체 개편: 대목차 간지 5장, 제목 명사형, 본문·표·각주 개조식. 검증 기록: [간지·문체 확인](verification-formal/result.md).

2026-09-09 디자인 개편: S08의 디자인·정보 배치 참조, 내용·수치·사진 차용 제외. 본문별 실적 차트·손익 브리지·비교·배분·로드맵 구성. [디자인 참조 분석](design-reference/design-analysis.md), [개편 검증](verification-design/result.md).

2026-09-09 DCF·멀티플 확장 이력: [국내 배수 조사](research/multiples-korea.md), [해외 배수 조사](research/multiples-global.md). 명시적 가정의 조건부 EV·방식별 차이 제시. 가정 갱신 전 [44장 PDF](output/TEMSCO-IR-v3-scenarios-draft-20260909.pdf)와 [시나리오 검증](verification-scenarios/result.md)은 이전 이력으로 보존한다.

2026-09-09 1차 가정 갱신: [산업 운전자본](research/assumed-working-capital.md), [개발투자](research/assumed-development.md), [상각](research/assumed-depreciation.md)의 근거 반영. 운전자본은 산업비율×0.8/1/1.2, 추가 개발투자는 산업 R&D 강도×가정20%, 안정기 명목 g=0 유지. 현재본은 위 `assumptions-draft` PDF와 `verification-assumptions/` 기준이다.

## Git 포함 범위

- 포함: 제3안 코드·실행 이미지·작성 문서·선별된 근거 데이터·검증 스크립트·작성 PDF.
- 로컬 보존: `source-materials/` 원본, `analysis/S*.txt`·`analysis/S*.json` 원문 추출물, 검토용 이미지·이전 코드 사본·중간 PDF.
- 원문 추출물 재생성: 원본 자료 배치 후 `analyze_sources.py` 실행. 원본 접근이 필요한 검증은 해당 로컬 자료 확보 후 수행.
