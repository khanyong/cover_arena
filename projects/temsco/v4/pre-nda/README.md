# NDA 이전·이후 투자자료 독립 관리 — 40페이지 원본 유지형

2026-09-13 사용자 정정 반영. 기존 14페이지 요약본을 현재 4안 전체 40페이지의 선택 비공개 처리본으로 교체. 사업·기술·시너지 설명, 표·그래프·목차·간지 및 페이지 순서 유지.

## 제공 자료

| 구분 | NDA 이전 투자 검토용 | NDA 이후 상세 검토용 |
|---|---|---|
| 목적 | 최초 사업성 검토 및 후속 미팅 | 내부 수치와 가정의 상세 실사 |
| 구성 | 4안 전체 40페이지 + 선택 가림 | 기존 4안 전체 40페이지 |
| 화면 | `/temsco/pre-nda` | `/temsco/deck-v4` |
| 콘텐츠 | 고정 원본 `source/approved-v4.pdf` + `redaction-config.json` | 기존 `components/TemscoV4/` 및 `lib/temsco/v4-slide-catalog.ts` |
| 디자인 | 원본 PDF의 배치·글꼴·도표 유지 | 기존 4안 디자인 |
| PDF 출력 | `public/temsco/pre-nda/pdf/` | `public/temsco/v4/pdf/` |
| 메타데이터 API | `/api/temsco/pre-nda-pdf` | `/api/temsco/v4-pdf` |
| 다운로드명 | `TEMSCO_NDA이전_투자검토용.pdf` | `TEMSCO_4안_NDA이후_상세검토용.pdf` |

- `/temsco` 랜딩의 ‘투자 검토 단계별 자료’에서 두 화면과 별도 다운로드 제공.
- 기존 1·2·3안 및 4안 상세 본문·재무 모델 유지. 4안 표지에 NDA 이후 분류 추가.
- NDA 이전 PDF와 화면에는 전체 제안서·원본 엑셀·내부 경로로 이동하는 링크 없음.
- A4 가로 40페이지. 원본의 기술 사진·거래 다이어그램·재무표·시나리오·Exit 구성 유지.
- 웹 미리보기는 실제 가림 처리 PDF에서 생성한 40개 PNG만 사용. 원본 재무 모델·상세 자료의 클라이언트 import 없음.

## 공개 범위

- [페이지별 선택 비공개 정책](redaction-policy.md)에 따라 민감 값과 구절만 가림. 정책과 검증 파일은 내부 제작용이며 원본 수치 포함.
- 사업·기술 설명, 협업 메커니즘, 성장 방향, 자금 용도, 평가 접근법, 조건부 Exit 구조 유지.
- 민감 재무표·거래 조건은 숫자 영역을 묶은 밝은 패널에 CONFIDENTIAL 및 NDA 체결 후 제공 표기. 설명·기술·그래프 페이지는 옅은 큰 워터마크 적용. 단어별 CONF. 표기 제거. 내부 수치·고객 식별정보·정밀 사양의 실제 삭제 범위 유지.
- 과거 손실·채권 손상·차입 및 자금 부담과 사업화 불확실성은 정성적으로 유지.
- PDF의 해당 문자와 이미지 픽셀을 실제 삭제한 후 가림 표시 추가. 새 PDF 카탈로그에 복사하여 원본 태그·대체 텍스트·첨부물·링크·폼·주석 제외. 원본 SEM 눈금·장비 식별표 이미지의 잔존 리소스도 검사.
- 그래프의 막대·선·색상·상대관계는 투자 검토를 위해 의도적으로 유지. 절대값 축과 라벨만 비공개. 외부에서 절대값을 알고 있는 경우 상대관계로 추정 가능하므로 모든 정량 관계를 숨긴 문서로 해석하지 않음.
- 연도·기간·계정·공식·시장 WACC·일반 세율·상각기간·산업 대용 가정·시나리오 입력값 유지.
- 현황과 개발·성장 목표 구분. 가정이나 전망을 실적으로 표현하지 않음.

## 수정 및 PDF 갱신

1. NDA 이전의 기준 원본은 `source/approved-v4.pdf`로 고정. 상세 4안 수정이 이 원본을 자동 갱신하지 않음. 새 기준판으로 전환할 때 원본 PDF·SHA-256·페이지별 가림 범위 재검토.
2. Python 환경에 `scripts/temsco/redaction-requirements.txt` 설치 후 PDF 재생성. NDA 이전 생성에는 브라우저·개발 서버 불필요. NDA 이후 생성에는 기존 개발 서버·Playwright 사용.
   - NDA 이전: `npm run temsco:pdf:pre-nda`
   - NDA 이후: `npm run temsco:pdf`
   - 양쪽: `npm run temsco:pdf:all`
3. `npm run temsco:pdf:all:check`로 소스 해시·PDF 해시·실제 페이지 수·A4 규격 검증.
4. `python scripts/temsco/verify-redacted-pdf.py`로 두 PDF 파서, 실제 이미지 리소스, 가림 밖 픽셀 보존, 공개 가정 유지 검사. 검증에는 PyMuPDF·Pillow·pypdf 필요.
5. 40페이지 렌더링 시각 확인 및 브라우저 다운로드 검증 후 제공. 미검수 중간본은 public 밖 `archive/`로 이동.

Python 실행 경로는 `TEMSCO_PYTHON`, 별도 설치 라이브러리는 `PYTHONPATH`로 지정 가능. 기본 상세 미리보기는 `http://localhost:3001`, 다른 포트는 `TEMSCO_PREVIEW_URL` 사용. 예시:

```sh
python3 -m pip install -r scripts/temsco/redaction-requirements.txt
TEMSCO_PYTHON=python3 npm run temsco:pdf:pre-nda
TEMSCO_PLAYWRIGHT_MODULE=/설치경로/playwright/index.mjs npm run temsco:pdf
```

각 자료의 소스 그래프와 manifest 독립 관리. 상세 본문 수정은 고정된 NDA 이전 PDF 내용을 변경하지 않음. 공통 UI·PDF 도구·빌드 설정 변경 시 소스 해시가 달라져 재생성 필요. 개발 중 오래된 PDF 요청은 409로 안내, production 빌드에서도 최신 artifact 검증. Python은 제작 단계에만 필요하며 운영 API는 정적 manifest 사용.

## 제공 범위와 접근 통제의 구분

이번 작업은 제공 파일의 정보 범위와 다운로드를 분리한 작업. NDA 체결 여부를 확인하는 인증·권한 기능은 없음. 기존 랜딩·상세 페이지·정적 PDF 주소는 계속 접근 가능한 구조. NDA 이전 투자자에게는 선택 가림 PDF를 전달하는 방식.

## 검증 기록

현재 검증: `verification/full40-verification.json`, `verification/full40-ui.json`, `verification/full40-post-preservation.json`. 개별 `redaction-<해시>.json`은 삭제 좌표·원문을 포함하는 내부 증적.

이전 `disclosure-register.md`, `lib/temsco/pre-nda-content.ts`, `components/TemscoPreNda/`, 14페이지 검증 기록은 폐기된 요약안의 과거 이력. 현재 라우트·PDF 생성 경로에서 사용하지 않음.

## 최신 표시 정책 — 영역 전체 블러

- 사용자의 후속 정정에 따라 이전 옅은 워터마크·숫자 패널 방식을 대체.
- 재무·평가 본문 등 민감 영역 전체를 원본 배치 기반 강한 블러 이미지로 교체하고 CONFIDENTIAL 표시.
- 원본 숫자를 포함한 배치를 저해상도로 축소 후 블러 처리. PDF에는 원본 문자가 아닌 처리 완료 이미지만 포함.
- 영역 안의 표·설명·가정·그래프를 함께 비공개 처리하며 제목과 영역 밖 공개 내용 유지.
- NDA 이후 원본과 별도 관리.

## 최신 공개 범위 변경

- 1~5페이지: 사용자 승인에 따른 원본 내용 공개. 블러·민감 수치 삭제 제외. 날짜·목차 문구 수정 및 배포 구분 유지.
- 6페이지 이후: 영역 블러 유지, 밝은 덮개 불투명도 38%에서 12%로 축소. 표·도형의 색과 형태 강조, 저해상도 처리와 블러 강도 유지.
