# Supabase Storage 설정 가이드

## 1. Supabase 프로젝트 설정

### Supabase Storage Bucket 생성
1. Supabase 대시보드 접속
2. Storage → Create a new bucket
3. Bucket 이름: `three-body-images`
4. Public bucket: **ON** (체크)
5. Create bucket 클릭

### 폴더 구조 생성
Bucket 내에 다음 폴더들을 생성:
```
three-body-images/
├── characters/
├── scenes/
├── ships/
├── tech/
├── covers/
├── netflix/
└── concept-art/
```

---

## 2. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1/object/public/three-body-images
```

### 값 찾기:
1. **SUPABASE_URL**: Supabase 프로젝트 Settings → API → Project URL
2. **SUPABASE_ANON_KEY**: Supabase 프로젝트 Settings → API → anon public key
3. **SUPABASE_STORAGE_URL**: `https://[프로젝트ID].supabase.co/storage/v1/object/public/three-body-images`

---

## 3. 이미지 업로드

### 방법 1: Supabase 대시보드 (권장)
1. Storage → three-body-images 선택
2. 해당 폴더 (characters, scenes 등) 선택
3. Upload file 클릭
4. 이미지 파일 선택하여 업로드

### 방법 2: Supabase CLI
```bash
supabase storage cp ./local-images/wang-miao.jpg three-body-images/characters/wang-miao.jpg
```

---

## 4. 이미지 URL 확인

업로드 후 이미지 URL 형식:
```
https://[프로젝트ID].supabase.co/storage/v1/object/public/three-body-images/characters/wang-miao.jpg
```

### URL 테스트:
브라우저에서 위 URL을 열어 이미지가 표시되는지 확인

---

## 5. 코드에서 사용

이미지는 자동으로 로드됩니다:

```javascript
// ImageGallery.js
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL

const galleryImages = [
  {
    imagePath: `${SUPABASE_URL}/covers/book1-cover.jpg`,
    fallback: 'https://via.placeholder.com/400x600/...'
  }
]
```

- `imagePath`가 유효하면 실제 이미지 표시
- `imagePath`가 404 에러면 자동으로 `fallback` 표시

---

## 6. 필요한 이미지 목록

전체 이미지 목록은 `/docs/three-body-images-list.md` 참조

### 최소 필수 이미지 (11장):
#### 표지 (3장)
- `covers/book1-cover.jpg`
- `covers/book2-cover.jpg`
- `covers/book3-cover.jpg`

#### 주요 인물 (8명)
- `characters/wang-miao.jpg`
- `characters/ye-wenjie.jpg`
- `characters/luo-ji.jpg`
- `characters/zhang-beihai.jpg`
- `characters/cheng-xin.jpg`
- `characters/mike-evans.jpg`
- `characters/da-shi.jpg`
- `characters/guan-yifan.jpg`

---

## 7. 이미지 최적화 권장 사항

### 크기
- 인물: 400x500px
- 장면: 1200x675px
- 우주선: 800x600px
- 표지: 400x600px

### 형식
- JPG (일반 사진)
- PNG (투명 배경 필요 시)
- WebP (최적화된 형식, 권장)

### 파일 크기
- 페이지당 최대 300KB 권장
- 압축 도구: TinyPNG, Squoosh 등 사용

---

## 8. 보안 설정

### Public Access 정책 (RLS)
```sql
-- three-body-images bucket은 public이므로 모두가 읽기 가능
-- 쓰기는 인증된 사용자만 가능 (기본 설정)
```

### 업로드 권한 제한 (선택)
특정 사용자만 업로드 가능하게 하려면:
```sql
CREATE POLICY "Only admins can upload"
ON storage.objects FOR INSERT
TO authenticated
USING (
  bucket_id = 'three-body-images' AND
  auth.jwt() ->> 'email' = 'admin@example.com'
);
```

---

## 9. 트러블슈팅

### 이미지가 표시되지 않음
1. Bucket이 public인지 확인
2. 파일명이 정확한지 확인 (대소문자 구분)
3. 브라우저 콘솔에서 404 에러 확인
4. CORS 설정 확인 (기본적으로 모든 origin 허용)

### 환경 변수가 적용되지 않음
1. `.env.local` 파일명 정확한지 확인
2. 개발 서버 재시작 (`npm run dev` 재실행)
3. `NEXT_PUBLIC_` prefix 확인

---

## 10. 다음 단계

이미지 업로드 완료 후:
1. ✅ ImageGallery에서 이미지 확인
2. ⏳ TopScenes에 장면 이미지 추가
3. ⏳ SpaceshipsAndTech에 우주선/기술 이미지 추가
4. ⏳ CharacterProfiles에 인물 이미지 추가

모든 컴포넌트가 동일한 `ImageWithFallback` 컴포넌트를 사용하므로, 이미지만 업로드하면 자동으로 전체 사이트에 반영됩니다!
