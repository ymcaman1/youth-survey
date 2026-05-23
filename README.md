# 📋 설문 데이터를 Cloudflare에 저장하기 — GitHub 연동 방식 (터미널 없이)

이 안내는 **터미널을 전혀 쓰지 않고**, GitHub 웹사이트와 Cloudflare 대시보드의
클릭·드래그만으로 설문 응답이 D1 데이터베이스에 저장되도록 설정하는 방법입니다.

전체는 6단계이고, 천천히 따라 하면 30분 정도 걸립니다.

═══════════════════════════════════════════════
 ⚠️ 먼저 알아둘 점
═══════════════════════════════════════════════
지금 youth-survey.pages.dev 는 "직접 업로드" 방식으로 만들어졌습니다.
이 방식은 데이터 저장 코드(functions)가 작동하지 않습니다.
그래서 GitHub 연동으로 "새 프로젝트"를 하나 만들게 됩니다.
→ 주소가 youth-survey-2.pages.dev 처럼 살짝 바뀔 수 있습니다.
   (우선 작동부터 시키는 게 목표)

═══════════════════════════════════════════════
 1단계 · GitHub 계정 만들기 (있으면 건너뛰기)
═══════════════════════════════════════════════
1. github.com 접속 → Sign up
2. 이메일, 비밀번호 입력해서 무료 가입

═══════════════════════════════════════════════
 2단계 · GitHub에 저장소(폴더) 만들고 파일 올리기
═══════════════════════════════════════════════
1. 로그인 후 오른쪽 위 [+] → New repository 클릭
2. Repository name 에 youth-survey 입력
3. Public 선택 → Create repository 클릭
4. 다음 화면에서 "uploading an existing file" 링크 클릭
5. 받으신 압축(youth-survey-github.zip)을 푼 뒤,
   그 안의 내용물을 통째로 이 화면에 드래그해서 올립니다.
   ★ 반드시 아래 구조가 그대로 유지되어야 합니다:
        public/index.html
        public/results.html
        functions/api/submit.js
        functions/api/results.js
        wrangler.toml
   (폴더째 드래그하면 구조가 유지됩니다)
6. 아래 Commit changes 초록 버튼 클릭

═══════════════════════════════════════════════
 3단계 · D1 데이터베이스 만들기
═══════════════════════════════════════════════
1. dash.cloudflare.com 접속
2. 왼쪽 메뉴 Storage & Databases → D1 SQL Database
3. Create 클릭 → 이름 survey-db 입력 → 생성
4. survey-db 안으로 들어가서 Console(콘솔) 탭 클릭
5. 아래를 붙여넣고 실행(Execute):

   CREATE TABLE IF NOT EXISTS responses (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     created_at TEXT DEFAULT (datetime('now','localtime')),
     payload TEXT, user_agent TEXT, country TEXT
   );

   → "Success" 비슷한 메시지가 뜨면 완료

═══════════════════════════════════════════════
 4단계 · Cloudflare에 GitHub 연결해서 새 사이트 만들기
═══════════════════════════════════════════════
1. Workers & Pages → Create → Pages → "Connect to Git" 선택
2. GitHub 계정 연결 (처음이면 권한 허용 화면 → 승인)
3. 방금 만든 youth-survey 저장소 선택 → Begin setup
4. 빌드 설정(Build settings) — 여기가 중요합니다:
        Framework preset : None (없음)
        Build command    : exit 0      ← 그대로 입력
        Build output directory : public  ← public 이라고 입력
5. Save and Deploy 클릭 → 잠시 기다리면 새 주소 생성

═══════════════════════════════════════════════
 5단계 · D1 연결(바인딩) + 비밀번호 설정
═══════════════════════════════════════════════
[D1 연결]
1. 방금 만든 Pages 프로젝트 → Settings → Bindings
2. Add → D1 database
3. Variable name 에  DB  입력   ★ 반드시 대문자 DB
4. D1 database 에서 survey-db 선택 → 저장

[관리자 비밀번호]
5. 같은 Settings → Variables and Secrets (환경변수)
6. Add 클릭 → 이름 ADMIN_KEY, 값에 원하는 비밀번호 입력
   (예: pocheon2026) → Secret(암호화) 권장 → 저장

[적용]
7. Deployments 탭 → 최근 배포의 ⋯ 메뉴 → Retry deployment
   (바인딩·환경변수는 재배포해야 적용됩니다)

═══════════════════════════════════════════════
 6단계 · 확인
═══════════════════════════════════════════════
- 설문:  새주소.pages.dev
  → 끝까지 응답하면 "✅ 응답이 안전하게 제출되었어요!" 표시되면 성공
- 결과:  새주소.pages.dev/results.html
  → ADMIN_KEY 비밀번호 입력 → 응답 수, 평균 점수, 전체 표, CSV 다운로드

───────────────────────────────────────────────
 앞으로 설문 내용을 고치고 싶으면?
───────────────────────────────────────────────
GitHub에서 해당 파일을 열고 연필(✏️) 아이콘으로 수정 → Commit 하면
Cloudflare가 자동으로 다시 배포합니다. (터미널 불필요)

───────────────────────────────────────────────
 잘 안 될 때 체크리스트
───────────────────────────────────────────────
□ 제출 후 "⚠️ 문제가 생겼어요"
   → D1 바인딩 변수 이름이 정확히 DB 인가?
   → survey-db 에 테이블(responses)을 만들었나?
   → 바인딩 추가 후 재배포(Retry)를 했나?
□ results 페이지 "비밀번호가 틀렸어요"
   → ADMIN_KEY 를 등록했나? 재배포했나?
□ 사이트는 뜨는데 functions가 없다고 나옴
   → GitHub에 functions 폴더가 구조 그대로 올라갔는지 확인

비용: 응답 수백 건 규모는 D1 무료 플랜으로 충분합니다.
