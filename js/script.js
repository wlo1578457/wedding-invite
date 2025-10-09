// V3 script.js - 完整功能：localStorage 留言牆、單張輪播、花瓣、音樂、倒數、lightbox

// 音樂控制 (bg-music.mp3)
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let musicPlaying = false;
musicBtn.textContent = '🔇';
musicBtn.addEventListener('click', ()=>{
  if (musicPlaying){ bgMusic.pause(); musicBtn.textContent='🔇'; }
  else { bgMusic.play().catch(()=>{}); musicBtn.textContent='🔊'; }
  musicPlaying = !musicPlaying;
});
document.addEventListener('click', function once(){ bgMusic.play().catch(()=>{}); document.removeEventListener('click', once); }, {once:true});

// 回到頂端
document.getElementById('topBtn').addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));

// 倒數計時（婚禮 2025-11-15 11:00）
(function countdown(){
  const target = new Date('2025-11-15T11:00:00');
  const el = document.getElementById('countdownTimer');
  function tick(){
    const now = new Date();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / (24*3600*1000)); diff %= 24*3600*1000;
    const hours = Math.floor(diff / (3600*1000)); diff %= 3600*1000;
    const mins = Math.floor(diff / (60*1000)); diff %= 60*1000;
    const secs = Math.floor(diff / 1000);
    el.textContent = days + ' 天 ' + String(hours).padStart(2,'0') + ':' + String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);
})();

// 櫻花花瓣（DOM 版）
(function petals(){
  const n=28;
  for (let i=0;i<n;i++){
    const p = document.createElement('div');
    p.className='petal';
    p.style.left = Math.random()*100 + 'vw';
    p.style.width = 8 + Math.random()*12 + 'px';
    p.style.height = 6 + Math.random()*10 + 'px';
    p.style.animationDuration = 6 + Math.random()*6 + 's';
    p.style.animationDelay = Math.random()*6 + 's';
    document.body.appendChild(p);
  }
})();

// Lightbox for photo preview
const lightbox = document.getElementById('lightbox');
lightbox.addEventListener('click', ()=>{ lightbox.classList.remove('show'); lightbox.setAttribute('aria-hidden','true'); });

// 相框單張輪播
(function gallery(){
  const frames = Array.from(document.querySelectorAll('.photo-frame'));
  const prev = document.querySelector('.arrow.prev');
  const next = document.querySelector('.arrow.next');
  const wrap = document.getElementById('frameWrap');
  let idx = 0, timer = null;

  function applyOrientation(){
    frames.forEach(f=>{
      const img = f.querySelector('img');
      if (img.naturalWidth && img.naturalHeight){
        if (img.naturalHeight > img.naturalWidth) f.classList.add('portrait');
      }
    });
  }
  frames.forEach(f=>{ const img=f.querySelector('img'); if (img.complete) applyOrientation(); else img.onload = applyOrientation; });

  function show(i){
    frames.forEach((f, j)=> f.style.display = (j===i)?'flex':'none');
  }
  function nextSlide(){ idx = (idx+1) % frames.length; show(idx); }
  function prevSlide(){ idx = (idx-1+frames.length) % frames.length; show(idx); }

  next.addEventListener('click', ()=>{ nextSlide(); reset(); });
  prev.addEventListener('click', ()=>{ prevSlide(); reset(); });

  function start(){ timer = setInterval(nextSlide, 5000); }
  function reset(){ clearInterval(timer); start(); }
  start();

  // swipe support on wrap
  let sx=0, sy=0;
  wrap.addEventListener('touchstart', e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; });
  wrap.addEventListener('touchend', e=>{
    const ex=e.changedTouches[0].clientX, ey=e.changedTouches[0].clientY;
    const dx=ex-sx, dy=ey-sy;
    if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)){ if (dx>0) prevSlide(); else nextSlide(); reset(); }
  });

  // click to open lightbox
  frames.forEach(f=> f.addEventListener('click', ()=>{ const src = f.querySelector('img').src; lightbox.innerHTML = '<img src="'+src+'">'; lightbox.classList.add('show'); lightbox.setAttribute('aria-hidden','false'); }));

  // initial show
  show(0);
})();

// ===== 留言牆（localStorage） =====
(function guestbook(){
  const nameInput = document.getElementById('guestName');
  const msgInput = document.getElementById('guestMsg');
  const postBtn = document.getElementById('postBtn');
  const wall = document.getElementById('bubbles');

  function load(){ 
    wall.innerHTML = ''; 
    const data = JSON.parse(localStorage.getItem('guestbook_v3') || '[]').reverse();
    data.forEach(item => {
      const b = document.createElement('div'); b.className = 'bubble';
      b.innerHTML = '<strong>'+escapeHtml(item.name)+'</strong><div class="txt">'+escapeHtml(item.msg)+'</div>';
      wall.appendChild(b);
    });
  }

  function save(name, msg){
    const arr = JSON.parse(localStorage.getItem('guestbook_v3') || '[]');
    arr.push({name, msg, t:Date.now()});
    localStorage.setItem('guestbook_v3', JSON.stringify(arr));
  }

  postBtn.addEventListener('click', ()=>{
    const name = (nameInput.value || '匿名').trim();
    const msg = (msgInput.value || '').trim();
    if (!msg) return alert('請輸入留言內容');
    save(name, msg);
    nameInput.value=''; msgInput.value='';
    load();
  });

  function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  load();

})();