// functions/api/results.js
// 저장된 응답을 모두 가져옵니다. 관리자 비밀번호로 보호합니다.
// 호출 URL: /api/results?key=비밀번호

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";

  // 환경변수 ADMIN_KEY 와 비교 (대시보드에서 설정)
  const adminKey = env.ADMIN_KEY || "change-me";
  if (key !== adminKey) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { results } = await env.DB.prepare(
      "SELECT id, created_at, payload, country FROM responses ORDER BY id DESC"
    ).all();

    const rows = results.map(r => ({
      id: r.id,
      created_at: r.created_at,
      country: r.country,
      answers: JSON.parse(r.payload)
    }));

    return new Response(JSON.stringify({ ok: true, count: rows.length, rows }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
