// 花瓣飄落
document.addEventListener('DOMContentLoaded',()=>{
  for(let i=0;i<20;i++){
    const p=document.createElement('div');
    p.className='petal';
    p.style.left=Math.random()*100+'vw';
    p.style.animationDuration=5+Math.random()*5+'s';
    p.style.animationDelay=Math.random()*5+'s';
    document.body.appendChild(p);
  }
});

// 婚紗牆輪播
const slides=document.querySelectorAll('.slide');
const prev=document.querySelector('.carousel-btn.prev');
const next=document.querySelector('.carousel-btn.next');
let current=0,timer=null;

function showSlide(i){slides.forEach((s,idx)=>s.classList.toggle('active',idx===i));}
function nextSlide(){current=(current+1)%slides.length;showSlide(current);}
function prevSlide(){current=(current-1+slides.length)%slides.length;showSlide(current);}

next.addEventListener('click',()=>{nextSlide();resetTimer();});
prev.addEventListener('click',()=>{prevSlide();resetTimer();});
function startAuto(){timer=setInterval(nextSlide,6000);}
function resetTimer(){clearInterval(timer);startAuto();}
startAuto();

// 手機滑動切換
let startX=0,endX=0;
const carousel=document.getElementById('carousel');
carousel.addEventListener('touchstart',e=>startX=e.touches[0].clientX);
carousel.addEventListener('touchend',e=>{
  endX=e.changedTouches[0].clientX;
  if(endX-startX>50){prevSlide();resetTimer();}
  if(startX-endX>50){nextSlide();resetTimer();}
});

// 浪漫文字
const romanticText=document.getElementById('romanticText');
const lines=["我們的故事，從微笑開始。","每一次凝望，都是永恆的誓言。","愛，是兩顆心的方向一致。","此刻的幸福，願永不散場。"];
let idx=0;
function changeText(){
  romanticText.classList.remove('show');
  setTimeout(()=>{
    romanticText.textContent=lines[idx];
    romanticText.classList.add('show');
    idx=(idx+1)%lines.length;
  },1000);
}
setInterval(changeText,5000);changeText();

// 留言送出
const form=document.getElementById('messageForm');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(form);
  fetch('https://script.google.com/macros/s/AKfycbyJO6_X6KImZimQW3lQ5H92TM4YF5do9a9weQbz_q_aFWEEk8WF_zjEpvgDJJwfXHS1/exec',{
    method:'POST',body:data
  }).then(()=>{alert('感謝您的祝福 💕');form.reset();}).catch(()=>alert('送出失敗，請稍後再試。'));
});
