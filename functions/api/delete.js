// functions/api/delete.js
// 저장된 응답을 삭제합니다. 관리자 비밀번호로 보호합니다.
// 호출: POST /api/delete  body: { key, id }  또는  { key, all: true }

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const key = body.key || "";

    // 비밀번호 확인
    const adminKey = env.ADMIN_KEY || "change-me";
    if (key !== adminKey) {
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json" }
      });
    }

    if (body.all === true) {
      // 전체 삭제 + id 번호 초기화
      await env.DB.prepare("DELETE FROM responses").run();
      await env.DB.prepare("DELETE FROM sqlite_sequence WHERE name='responses'").run();
      return new Response(JSON.stringify({ ok: true, deleted: "all" }), {
        status: 200, headers: { "Content-Type": "application/json" }
      });
    }

    // 여러 개 선택 삭제
    if (Array.isArray(body.ids)) {
      const ids = body.ids.map(n => parseInt(n, 10)).filter(Number.isInteger);
      if (ids.length === 0) {
        return new Response(JSON.stringify({ ok: false, error: "no valid ids" }), {
          status: 400, headers: { "Content-Type": "application/json" }
        });
      }
      const placeholders = ids.map(() => "?").join(",");
      await env.DB.prepare(
        `DELETE FROM responses WHERE id IN (${placeholders})`
      ).bind(...ids).run();
      return new Response(JSON.stringify({ ok: true, deleted: ids.length }), {
        status: 200, headers: { "Content-Type": "application/json" }
      });
    }

    // 개별 삭제
    const id = parseInt(body.id, 10);
    if (!Number.isInteger(id)) {
      return new Response(JSON.stringify({ ok: false, error: "invalid id" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }
    await env.DB.prepare("DELETE FROM responses WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ ok: true, deleted: id }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
