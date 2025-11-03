# Multi-AI Agent 설정 가이드 (Claude Code + GPT Codex)

이 문서는 Cursor IDE에서 Claude Code와 OpenAI Codex를 병행하여 사용하는 방법을 안내합니다.

## 📌 중요 사항

### Codex에 대해
- **OpenAI Codex**는 코드 생성에 특화된 모델입니다
- 현재는 GPT-4의 코드 생성 기능으로 통합되었지만, "codex" 스타일의 코드 생성으로 사용 가능합니다
- Cursor에서는 **GPT-4o** 또는 **GPT-4 Turbo**가 Codex의 역할을 수행합니다

---

## 🚀 설정 방법

### 1. 패키지 설치 (나중에 실행)

```bash
npm install openai @anthropic-ai/sdk
```

### 2. 환경 변수 설정

`.env.local` 파일에 추가:

```env
# OpenAI API (Codex 사용)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API (Claude 사용)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**API 키 발급:**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/settings/keys

### 3. Cursor 설정에서 멀티 모델 활성화

#### 방법 A: Cursor 설정 파일 직접 편집

프로젝트 루트에 `.cursor/config.json` 파일 생성 (또는 기존 파일 편집):

```json
{
  "models": {
    "default": "claude-3.5-sonnet",
    "codeGeneration": {
      "primary": "claude-3.5-sonnet",
      "secondary": "gpt-4o",
      "enableParallel": true
    },
    "chat": {
      "primary": "claude-3.5-sonnet",
      "secondary": "gpt-4o",
      "enableParallel": true
    }
  },
  "agents": {
    "claude": {
      "model": "claude-3.5-sonnet",
      "provider": "anthropic",
      "enabled": true
    },
    "codex": {
      "model": "gpt-4o",
      "provider": "openai",
      "enabled": true,
      "codeGeneration": true
    }
  }
}
```

#### 방법 B: Cursor UI에서 설정

1. `Cmd + Shift + P` (Mac) 또는 `Ctrl + Shift + P` (Windows)
2. "Preferences: Open Settings (UI)" 입력
3. 다음 항목 검색 및 설정:
   - `cursor.multipleAgents.enabled`: `true`
   - `cursor.multipleAgents.agents`: `["claude", "codex"]`
   - `cursor.codeGeneration.model`: `gpt-4o` (Codex용)
   - `cursor.chat.model`: `claude-3.5-sonnet` (Claude용)

---

## 💻 프로젝트 내 코드 통합 방법

### AI 에이전트 관리 유틸리티 생성

`lib/aiAgents.js` 파일 생성:

```javascript
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// OpenAI (Codex 스타일) 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Anthropic (Claude) 초기화
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Codex (GPT-4o)를 사용한 코드 생성
 * @param {string} prompt - 코드 생성 프롬프트
 * @param {string} language - 프로그래밍 언어
 * @returns {Promise<string>} 생성된 코드
 */
export async function generateCodeWithCodex(prompt, language = 'javascript') {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a code generation expert. Generate clean, efficient ${language} code. Focus on best practices and performance.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // 코드 생성은 낮은 temperature 권장
      max_tokens: 2000
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Codex generation error:', error);
    throw error;
  }
}

/**
 * Claude를 사용한 코드 리뷰/개선
 * @param {string} code - 리뷰할 코드
 * @param {string} context - 컨텍스트 설명
 * @returns {Promise<string>} 리뷰 결과
 */
export async function reviewCodeWithClaude(code, context = '') {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Review and improve this code:\n\n${code}\n\nContext: ${context}`
        }
      ]
    });
    
    return message.content[0].text;
  } catch (error) {
    console.error('Claude review error:', error);
    throw error;
  }
}

/**
 * 병행 사용: Codex로 생성하고 Claude로 리뷰
 * @param {string} prompt - 코드 생성 프롬프트
 * @param {string} language - 프로그래밍 언어
 * @returns {Promise<{code: string, review: string}>}
 */
export async function generateAndReviewCode(prompt, language = 'javascript') {
  // Codex로 코드 생성
  const code = await generateCodeWithCodex(prompt, language);
  
  // Claude로 코드 리뷰
  const review = await reviewCodeWithClaude(code, `Generated for: ${prompt}`);
  
  return {
    code,
    review,
    model: {
      generator: 'gpt-4o (codex-style)',
      reviewer: 'claude-3.5-sonnet'
    }
  };
}

/**
 * 두 모델의 답변을 비교하여 최적 선택
 * @param {string} prompt - 프롬프트
 * @returns {Promise<{codex: string, claude: string, comparison: string}>}
 */
export async function compareAgents(prompt) {
  const [codexResponse, claudeResponse] = await Promise.all([
    generateCodeWithCodex(prompt),
    anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    }).then(res => res.content[0].text)
  ]);
  
  return {
    codex: codexResponse,
    claude: claudeResponse,
    comparison: `Codex (GPT-4o): ${codexResponse.length} chars\nClaude: ${claudeResponse.length} chars`
  };
}
```

### API 라우트 예시

`pages/api/ai/generate-code.js` 생성:

```javascript
import { generateAndReviewCode } from '../../../lib/aiAgents.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, language } = req.body;

  try {
    const result = await generateAndReviewCode(prompt, language);
    res.status(200).json(result);
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

---

## 🎯 사용 시나리오

### 시나리오 1: 코드 생성 (Codex 주, Claude 보조)
```javascript
import { generateCodeWithCodex, reviewCodeWithClaude } from '@/lib/aiAgents';

// 1. Codex로 코드 생성
const code = await generateCodeWithCodex(
  'Create a function to parse student records',
  'javascript'
);

// 2. Claude로 리뷰 (선택사항)
const review = await reviewCodeWithClaude(code);
```

### 시나리오 2: 병행 비교
```javascript
import { compareAgents } from '@/lib/aiAgents';

const result = await compareAgents(
  'Generate a function to calculate rankings'
);

console.log('Codex:', result.codex);
console.log('Claude:', result.claude);
```

### 시나리오 3: 통합 워크플로우
```javascript
import { generateAndReviewCode } from '@/lib/aiAgents';

// 한 번에 생성 + 리뷰
const { code, review, model } = await generateAndReviewCode(
  'Create a Next.js API route for video rankings',
  'javascript'
);

console.log('Generated Code:', code);
console.log('Review:', review);
console.log('Used Models:', model);
```

---

## 📝 Cursor 내 사용 방법

### 1. 명령 팔레트 사용

- `Cmd + Shift + P` (Mac) 또는 `Ctrl + Shift + P` (Windows)
- 다음 명령어 사용:
  - "Cursor: Use Codex for code generation"
  - "Cursor: Use Claude for code review"
  - "Cursor: Compare both models"

### 2. 인라인 사용

코드 작성 시:
1. 코드 블록 선택
2. `Cmd + K` (Mac) 또는 `Ctrl + K` (Windows)
3. 프롬프트 입력 시 모델 선택 옵션 표시

### 3. 채팅에서 사용

- Cursor 채팅 패널 열기
- 각 메시지에 `@codex` 또는 `@claude` 태그 추가
- 예: `@codex Generate a sorting function`

---

## ⚙️ 고급 설정

### 모델별 특성 활용

**Codex (GPT-4o):**
- ✅ 빠른 코드 생성
- ✅ 다양한 언어 지원
- ✅ 코드 최적화
- ❌ 컨텍스트 이해가 상대적으로 약함

**Claude Code:**
- ✅ 깊은 코드 분석
- ✅ 코드 리뷰 및 개선 제안
- ✅ 복잡한 로직 이해
- ✅ 보안 이슈 감지
- ❌ 상대적으로 느림

### 병행 사용 전략

1. **코드 생성**: Codex 사용
2. **코드 리뷰**: Claude 사용
3. **버그 수정**: 두 모델 모두 질문 → 비교
4. **복잡한 로직**: Claude로 설계 → Codex로 구현

---

## 🔒 보안 주의사항

1. **API 키 보안**:
   - `.env.local` 파일을 `.gitignore`에 추가
   - 절대 커밋하지 않기

2. **Rate Limiting**:
   - API 호출 제한 설정
   - 에러 핸들링 필수

3. **비용 관리**:
   - 사용량 모니터링
   - 불필요한 호출 최소화

---

## 📚 참고 자료

- OpenAI API 문서: https://platform.openai.com/docs
- Anthropic API 문서: https://docs.anthropic.com
- Cursor 설정 가이드: Cursor 내부 도움말 참조

---

## ✅ 체크리스트

설치 전 확인:
- [ ] OpenAI API 키 발급
- [ ] Anthropic API 키 발급
- [ ] `.env.local` 파일 생성 및 키 추가
- [ ] `package.json`에 의존성 추가 확인
- [ ] Cursor 설정 확인

사용 준비:
- [ ] `lib/aiAgents.js` 파일 생성
- [ ] API 라우트 설정 (선택사항)
- [ ] 테스트 코드 작성
