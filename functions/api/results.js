<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>만족도 조사 · 결과 보기</title>
<link href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=Jua&display=swap" rel="stylesheet">
<style>
  :root{--ink:#23243a;--accent:#ff5d73;--accent2:#ffb03a;--mint:#2fc6a0;--blue:#4f7dff;--line:#e8e2d5;--card:#fff;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Gowun Dodum',sans-serif;color:var(--ink);background:linear-gradient(135deg,#fff5e0,#eaf6ff);min-height:100vh;padding:24px;}
  .container{max-width:1000px;margin:0 auto;}
  h1{font-family:'Jua';font-size:1.7rem;margin-bottom:4px;color:#1f4e79;}
  .sub{color:#8d8169;margin-bottom:20px;}
  .gate{background:var(--card);border-radius:18px;padding:28px;max-width:380px;margin:60px auto;box-shadow:0 16px 36px -18px rgba(60,40,20,.3);text-align:center;}
  .gate input{width:100%;padding:13px 14px;border:2px solid var(--line);border-radius:12px;font-size:1rem;margin:14px 0;font-family:'Gowun Dodum';}
  .gate button,.dl{font-family:'Jua';background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border:none;border-radius:12px;padding:12px 18px;font-size:1rem;cursor:pointer;}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px;}
  .stat{background:var(--card);border-radius:16px;padding:18px;box-shadow:0 10px 24px -16px rgba(60,40,20,.3);}
  .stat .n{font-family:'Jua';font-size:2rem;color:var(--accent);}
  .stat .l{color:#8d8169;font-size:.9rem;margin-top:4px;}
  .panel{background:var(--card);border-radius:18px;padding:22px;margin-bottom:22px;box-shadow:0 12px 28px -18px rgba(60,40,20,.3);}
  .panel h2{font-family:'Jua';font-size:1.15rem;margin-bottom:14px;color:#1f4e79;}
  .barRow{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:.92rem;}
  .barRow .q{flex:0 0 46%;}
  .barRow .track{flex:1;height:18px;background:#f1ead8;border-radius:10px;overflow:hidden;}
  .barRow .fill{height:100%;border-radius:10px;background:linear-gradient(90deg,var(--mint),var(--blue));}
  .barRow .val{flex:0 0 54px;text-align:right;font-family:'Jua';color:var(--blue);}
  table{width:100%;border-collapse:collapse;font-size:.84rem;}
  th,td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top;}
  th{background:#1f4e79;color:#fff;font-weight:normal;position:sticky;top:0;}
  .tableWrap{overflow:auto;max-height:480px;border-radius:12px;}
  .toolbar{display:flex;gap:10px;justify-content:flex-end;margin-bottom:12px;flex-wrap:wrap;}
  .msg{text-align:center;color:#8d8169;padding:40px;}
  .danger{font-family:'Jua';background:#fff;color:#e23b5a;border:2px solid #ffc4cf;border-radius:12px;padding:12px 18px;font-size:1rem;cursor:pointer;}
  .danger:hover{background:#fff0f3;}
  .delBtn{background:#fff;border:1.5px solid #ffc4cf;color:#e23b5a;border-radius:8px;padding:4px 9px;cursor:pointer;font-size:.8rem;font-family:'Gowun Dodum';}
  .delBtn:hover{background:#ffe1e7;}
  .modal{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center;z-index:100;}
  .modal.show{display:flex;}
  .modalCard{background:#fff;border-radius:18px;padding:26px;max-width:380px;width:90%;text-align:center;box-shadow:0 20px 50px -20px rgba(0,0,0,.4);}
  .modalCard h3{font-family:'Jua';font-size:1.2rem;color:#e23b5a;margin-bottom:10px;}
  .modalCard p{color:#6b6354;line-height:1.6;margin-bottom:18px;font-size:.95rem;}
  .modalBtns{display:flex;gap:10px;}
  .modalBtns button{flex:1;font-family:'Jua';border:none;border-radius:12px;padding:12px;font-size:1rem;cursor:pointer;}
  .mYes{background:#e23b5a;color:#fff;}
  .mNo{background:#eee;color:#555;}
</style>
</head>
<body>
<div class="container">

  <div id="gate" class="gate">
    <h1>🔒 결과 보기</h1>
    <p class="sub" style="margin:6px 0 0;">관리자 비밀번호를 입력하세요</p>
    <input type="password" id="keyInput" placeholder="비밀번호" onkeydown="if(event.key==='Enter')load()">
    <button onclick="load()">열기</button>
    <p id="gateMsg" style="color:var(--accent);margin-top:10px;font-size:.9rem;"></p>
  </div>

  <div id="dash" style="display:none;">
    <h1>📊 연합 교류활동 만족도 조사 · 결과</h1>
    <p class="sub">2026 포천·가평 청소년자치기구</p>

    <div class="cards" id="statCards"></div>

    <div class="panel">
      <h2>📈 문항별 평균 점수 (5점 만점)</h2>
      <div id="avgBars"></div>
    </div>

    <div class="panel">
      <div class="toolbar">
        <button class="dl" onclick="downloadCSV()">⬇ CSV 다운로드</button>
        <button class="danger" onclick="confirmDeleteAll()">🗑 전체 삭제</button>
      </div>
      <h2>📋 전체 응답</h2>
      <div class="tableWrap" id="tableWrap"></div>
    </div>
  </div>

</div>

<!-- 삭제 확인 모달 -->
<div class="modal" id="modal">
  <div class="modalCard">
    <h3 id="modalTitle">정말 삭제할까요?</h3>
    <p id="modalText"></p>
    <div class="modalBtns">
      <button class="mNo" onclick="closeModal()">취소</button>
      <button class="mYes" id="modalYes">삭제</button>
    </div>
  </div>
</div>

<script>
let DATA=null, KEY="";

async function load(){
  KEY=document.getElementById("keyInput").value.trim();
  const msg=document.getElementById("gateMsg");
  msg.textContent="불러오는 중…";
  try{
    const res=await fetch("/api/results?key="+encodeURIComponent(KEY));
    const d=await res.json();
    if(!d.ok){ msg.textContent= res.status===401 ? "비밀번호가 틀렸어요." : ("오류: "+d.error); return; }
    DATA=d;
    document.getElementById("gate").style.display="none";
    document.getElementById("dash").style.display="block";
    render();
  }catch(e){ msg.textContent="네트워크 오류: "+e.message; }
}

function render(){
  const rows=DATA.rows;
  // 통계 카드
  document.getElementById("statCards").innerHTML=`
    <div class="stat"><div class="n">${rows.length}</div><div class="l">총 응답 수</div></div>
    <div class="stat"><div class="n">${overallAvg(rows)}</div><div class="l">전체 평균 만족도</div></div>
    <div class="stat"><div class="n">${rows[0]?rows[0].created_at.slice(0,10):"-"}</div><div class="l">최근 응답일</div></div>`;

  // 문항별 평균(점수형 문항만)
  const qkeys = rows.length ? Object.keys(rows[0].answers) : [];
  let barsHtml="";
  qkeys.forEach(k=>{
    const sample=rows[0].answers[k];
    const nums=rows.map(r=>r.answers[k]?.answer).filter(v=>typeof v==="number" || (!isNaN(parseFloat(v))&&isFinite(v)&&v!==""));
    if(nums.length && typeof sample.answer==="number"){
      const avg=(nums.reduce((a,b)=>a+(+b),0)/nums.length).toFixed(2);
      const pct=(avg/5*100).toFixed(0);
      barsHtml+=`<div class="barRow"><span class="q">${stripEmoji(sample.question)}</span>
        <span class="track"><span class="fill" style="width:${pct}%"></span></span>
        <span class="val">${avg}점</span></div>`;
    }
  });
  document.getElementById("avgBars").innerHTML=barsHtml || '<p class="msg">점수형 응답이 아직 없어요.</p>';

  // 전체 응답 표
  if(!rows.length){ document.getElementById("tableWrap").innerHTML='<p class="msg">아직 응답이 없어요.</p>'; return; }
  let head="<tr><th>#</th><th>제출시각</th>";
  qkeys.forEach((k,i)=>head+=`<th>${i+1}</th>`);
  head+="<th>관리</th></tr>";
  let bodyHtml="";
  rows.forEach((r,ri)=>{
    bodyHtml+=`<tr><td>${rows.length-ri}</td><td>${r.created_at}</td>`;
    qkeys.forEach(k=>{ const a=r.answers[k]; bodyHtml+=`<td>${a&&a.answer!==""?a.answer:"-"}</td>`; });
    bodyHtml+=`<td><button class="delBtn" onclick="confirmDeleteOne(${r.id})">삭제</button></td>`;
    bodyHtml+="</tr>";
  });
  document.getElementById("tableWrap").innerHTML=`<table>${head}${bodyHtml}</table>`;
}

function overallAvg(rows){
  let sum=0,c=0;
  rows.forEach(r=>Object.values(r.answers).forEach(a=>{ if(typeof a.answer==="number"){sum+=a.answer;c++;} }));
  return c? (sum/c).toFixed(2):"-";
}
function stripEmoji(s){ return (s||"").replace(/[🎤📚🎮💬🍱✨🛠💭💌🤗🥳]/g,"").trim(); }

function downloadCSV(){
  const rows=DATA.rows;
  if(!rows.length) return;
  const qkeys=Object.keys(rows[0].answers);
  const header=["번호","제출시각",...qkeys.map(k=>'"'+stripEmoji(rows[0].answers[k].question).replace(/"/g,'""')+'"')];
  const lines=[header.join(",")];
  rows.forEach((r,ri)=>{
    const cells=[rows.length-ri, '"'+r.created_at+'"'];
    qkeys.forEach(k=>{ let v=r.answers[k]?r.answers[k].answer:""; cells.push('"'+String(v).replace(/"/g,'""')+'"'); });
    lines.push(cells.join(","));
  });
  const blob=new Blob(["\uFEFF"+lines.join("\n")],{type:"text/csv;charset=utf-8"}); // BOM: 엑셀 한글 깨짐 방지
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="만족도조사_응답_"+new Date().toISOString().slice(0,10)+".csv";
  a.click();
}

// ===== 삭제 기능 =====
let pendingAction=null;

function confirmDeleteOne(id){
  document.getElementById("modalTitle").textContent="이 응답을 삭제할까요?";
  document.getElementById("modalText").textContent="#"+id+" 응답이 영구적으로 삭제됩니다. 되돌릴 수 없어요.";
  pendingAction=()=>doDelete({id});
  openModal();
}

function confirmDeleteAll(){
  const n=DATA?DATA.rows.length:0;
  if(!n){ alert("삭제할 응답이 없어요."); return; }
  document.getElementById("modalTitle").textContent="전체 응답을 삭제할까요?";
  document.getElementById("modalText").textContent="총 "+n+"개의 응답이 모두 영구 삭제됩니다. 되돌릴 수 없어요. 정말 진행할까요?";
  pendingAction=()=>doDelete({all:true});
  openModal();
}

function openModal(){
  const yes=document.getElementById("modalYes");
  yes.onclick=()=>{ if(pendingAction) pendingAction(); };
  document.getElementById("modal").classList.add("show");
}
function closeModal(){
  document.getElementById("modal").classList.remove("show");
  pendingAction=null;
}

async function doDelete(opts){
  const body=Object.assign({key:KEY}, opts);
  try{
    const res=await fetch("/api/delete",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body)
    });
    const d=await res.json();
    closeModal();
    if(d.ok){
      await load();   // 목록 새로고침
    }else{
      alert("삭제 실패: "+(d.error||"알 수 없는 오류"));
    }
  }catch(e){
    closeModal();
    alert("네트워크 오류: "+e.message);
  }
}
</script>
</body>
</html>
