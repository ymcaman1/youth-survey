// functions/api/submit.js
// 설문 응답을 받아 D1 데이터베이스(responses 테이블)에 저장합니다.
// 경로 functions/api/submit.js → 실제 호출 URL은 /api/submit 입니다.

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();

    // 전송된 응답(JSON)을 통째로 payload 컬럼에 저장
    const payload = JSON.stringify(body.answers ?? body);

    // 참고용 부가정보
    const ua = request.headers.get("User-Agent") || "";
    const country = request.cf?.country || "";

    await env.DB.prepare(
      "INSERT INTO responses (payload, user_agent, country) VALUES (?, ?, ?)"
    ).bind(payload, ua, country).run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// POST 외 다른 메서드로 들어오면 안내
export async function onRequest(context) {
  if (context.request.method === "POST") {
    return onRequestPost(context);
  }
  return new Response("This endpoint accepts POST only.", { status: 405 });
}
