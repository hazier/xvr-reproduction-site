'use strict';
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels=['Base Qwen3-VL-2B','Author XVR','H800 FullSFT'];
let cases=[],filtered=[],page=0,active=null,request=0;
const pageSize=8;
function resetFilters(){HTMLFormElement.prototype.reset.call($('filters'));}
async function json(path){const response=await fetch(path);if(!response.ok)throw new Error(`HTTP ${response.status}`);return response.json();}
function imageMarkup(paths){return paths.map((path,i)=>`<figure><button type="button" class="image-button" data-image="${esc(path)}" data-label="Image ${i+1}" aria-label="放大 Image ${i+1}"><img src="${esc(path)}" alt="Image ${i+1}" loading="lazy"></button><figcaption>Image ${i+1} · ${esc(path.split('/').pop())}</figcaption></figure>`).join('');}
function list(){
  const m=Number($('model').value),start=page*pageSize;
  $('count').textContent=`XVR-Eval · ${filtered.length.toLocaleString()} / 1,866 题 · 当前筛选 ${filtered.length? (100*filtered.filter(c=>c.correct[m]).length/filtered.length).toFixed(2)+'%':'—'} 正确`;
  $('list').innerHTML=filtered.slice(start,start+pageSize).map(c=>`<button type="button" class="case-row" data-index="${c.index}" aria-current="${c.index===active}"><span class="row-head"><b>#${c.index+1} · ${esc(c.task)}</b><span class="${c.correct[m]?'good':'bad'}">${c.correct[m]?'正确':'错误'}</span></span><span class="sample-id">${esc(c.id)}</span></button>`).join('')||'<p class="empty">没有匹配的题目</p>';
  $('page').textContent=filtered.length?`${page+1} / ${Math.ceil(filtered.length/pageSize)}`:'0 / 0';
  $('prev').disabled=page===0;$('next').disabled=(page+1)*pageSize>=filtered.length;
}
function filter(){
  const query=$('search').value.trim().toLowerCase(),task=$('task').value,m=Number($('model').value),result=$('result').value;
  filtered=cases.filter(c=>(!task||c.task===task)&&(!query||(c.id+' '+c.question).toLowerCase().includes(query))&&(!result||result==='correct'&&c.correct[m]||result==='wrong'&&!c.correct[m]||result==='gain'&&c.correct[2]&&!c.correct[1]||result==='loss'&&!c.correct[2]&&c.correct[1]));
  page=0;list();if(filtered.length)pick(filtered[0].index);else{active=null;request++;$('detail').innerHTML='<p class="empty">没有匹配的题目</p>';}
}
function traceHTML(t){
  if(!t)return '<p>该题没有归档的 H800 Token Trace。</p>';
  const tokens=t.trace.generated_token_trace||[];
  return `<p class="trace-note">独立诊断运行 · 非主结果的生成轨迹 · 预测 ${esc(t.prediction_norm)} / 标准答案 ${esc(t.answer_norm)} · ${t.correct?'正确':'错误'}</p><div class="table-scroll"><table class="trace-table"><thead><tr><th>Step</th><th>Token</th><th>ID</th><th>概率</th></tr></thead><tbody>${tokens.map(x=>`<tr><td>${x.step}</td><td>${esc(x.token)}</td><td>${x.token_id}</td><td>${Number(x.prob).toPrecision(5)}</td></tr>`).join('')}</tbody></table></div><h3>首 Token 候选</h3><div class="table-scroll"><table class="trace-table"><thead><tr><th>Token</th><th>概率</th><th>Log probability</th></tr></thead><tbody>${(tokens[0]?.top_tokens||[]).map(x=>`<tr><td>${esc(x.token)}</td><td>${Number(x.prob).toPrecision(5)}</td><td>${Number(x.logprob).toFixed(5)}</td></tr>`).join('')}</tbody></table></div><details><summary>Trace 原始记录</summary><pre>${esc(JSON.stringify(t,null,2))}</pre></details>`;
}
async function pick(index,updateURL=true){
  const ticket=++request;active=index;list();$('detail').innerHTML='<p class="empty">正在读取题目…</p>';
  if(updateURL)history.replaceState(null,'','#case='+encodeURIComponent(cases[index].id));
  try{
    const c=await json(`data/cases/${index}.json`);if(ticket!==request)return;
    $('detail').innerHTML=`<div class="case-header"><h2>#${index+1} · ${esc(c.task)}</h2><a href="data/cases/${index}.json" download>原始记录 ↓</a></div><p class="case-id">${esc(c.id)}</p><div class="image-grid">${imageMarkup(c.images)}</div><table class="comparison"><thead><tr><th>模型</th><th>预测</th><th>标准答案</th><th>判定</th></tr></thead><tbody>${c.predictions.map((p,i)=>`<tr><td>${labels[i]}</td><td class="answer">${esc(p.answer)}</td><td>${esc(c.gold)}</td><td class="${p.correct?'good':'bad'}">${p.correct?'正确':'错误'}</td></tr>`).join('')}</tbody></table><h3>题目 / 原始提示词</h3><pre>${esc(c.question)}</pre><details><summary>三模型原始输出</summary>${c.predictions.map((p,i)=>`<h3>${labels[i]}</h3><pre>${esc(p.raw)}</pre>`).join('')}</details><details id="trace-detail"><summary>H800 Token Trace · 独立诊断运行</summary>${traceHTML(c.trace)}</details>`;
    $('detail').insertAdjacentHTML('beforeend','<p class="source-note">题目 / 图片：<a class="cite" href="#ref-2">XVR 数据集 [2]</a> · 模型：<a class="cite" href="#ref-3">Base [3]</a> / <a class="cite" href="#ref-4">Author [4]</a> · 本次输出与独立 Trace：<a class="cite" href="#ref-6">实验记录 [6]</a></p>');
    $('detail').querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.alt+=' · 图片加载失败';img.parentElement.title='图片加载失败，可刷新重试';}));
  }catch(error){if(ticket===request)$('detail').innerHTML='<p class="empty error">题目读取失败，请刷新重试。</p>';}
}
function hashCase(){const match=location.hash.match(/^#case=(.*)$/);if(!match)return null;try{return cases.find(c=>c.id===decodeURIComponent(match[1]));}catch{return null;}}
async function init(){
  try{
    const data=await Promise.all([json('data/cases.json'),json('data/summary.json')]);cases=data[0];const summary=data[1];
    if(cases.length!==1866||summary.total!==1866)throw new Error('Archive count mismatch');
    const tasks=Object.keys(summary.tasks).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
    $('task').innerHTML+='<option disabled>────────</option>'+tasks.map(t=>`<option>${esc(t)}</option>`).join('');
    $('task-results').innerHTML=tasks.map(t=>{const x=summary.tasks[t];return `<tr><td>${esc(t)}</td><td>${x.n}</td>${x.correct.map(n=>`<td>${(100*n/x.n).toFixed(2)}% <small>(${n}/${x.n})</small></td>`).join('')}</tr>`;}).join('');
    filtered=cases;const first=hashCase()||cases[0];page=Math.floor(first.index/pageSize);pick(first.index,false);
  }catch(error){$('count').textContent='归档数据读取失败';$('detail').innerHTML='<p class="empty error">数据暂时无法加载，请刷新页面重试。</p>';}
}
$('filters').addEventListener('submit',event=>event.preventDefault());
$('search').addEventListener('input',filter);['task','model','result'].forEach(id=>$(id).addEventListener('change',filter));
$('reset').onclick=()=>{resetFilters();filter();};
$('list').onclick=event=>{const row=event.target.closest('[data-index]');if(row)pick(Number(row.dataset.index));};
$('prev').onclick=()=>{if(page>0){page--;list();pick(filtered[page*pageSize].index);}};
$('next').onclick=()=>{if((page+1)*pageSize<filtered.length){page++;list();pick(filtered[page*pageSize].index);}};
$('detail').onclick=event=>{const button=event.target.closest('[data-image]');if(!button)return;$('large-image').src=button.dataset.image;$('large-image').alt=button.dataset.label;$('image-caption').textContent=button.dataset.label;$('image-dialog').showModal();};
$('close-image').onclick=()=>$('image-dialog').close();
$('image-dialog').onclick=event=>{if(event.target===$('image-dialog'))$('image-dialog').close();};
window.addEventListener('hashchange',()=>{const c=hashCase();if(c){resetFilters();filtered=cases;page=Math.floor(c.index/pageSize);pick(c.index,false);}});
init();
