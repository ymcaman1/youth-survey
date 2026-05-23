-- schema.sql
-- 설문 응답을 저장할 테이블
CREATE TABLE IF NOT EXISTS responses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT DEFAULT (datetime('now', 'localtime')),
  payload     TEXT,        -- 응답 전체를 JSON 문자열로 저장
  user_agent  TEXT,        -- 참고용: 접속 기기 정보
  country     TEXT         -- 참고용: 접속 국가
);
