let data = {};
let current = {mood:null, idx:0};

// Load moods.json
fetch('moods.json')
  .then(res=>res.json())
  .then(json=>{
    data=json;
    const grid = document.getElementById('moodGrid');
    data.moods.forEach(m=>{
      const tile = document.createElement('div');
      tile.className='tile';
      tile.textContent = m.label;
      tile.onclick=()=>openMood(m.id);
      grid.appendChild(tile);
    });
  });

const card = document.getElementById('card');
const arabic = document.getElementById('arabic');
const translation = document.getElementById('translation');

function openMood(id){
  const mood = data.moods.find(x=>x.id===id);
  if(!mood) return;
  current.mood=mood;
  current.idx=0;
  showVerse();
}

function showVerse(){
  const v = current.mood.verses[current.idx];
  arabic.textContent=v.arabic;
  translation.innerHTML=<strong>${v.translation}</strong><p style="margin-top:6px">${v.reflection}</p>;
  card.style.display='block';
}

document.getElementById('nextBtn').onclick = ()=>{
  current.idx=(current.idx+1)%current.mood.verses.length;
  showVerse();
};

document.getElementById('saveBtn').onclick=()=>{
  const key = saved_${current.mood.id};
  const saved = JSON.parse(localStorage.getItem(key)||"[]");
  saved.push(current.mood.verses[current.idx]);
  localStorage.setItem(key, JSON.stringify(saved));
  alert('Saved to your device.');
};

document.getElementById('shareBtn').onclick=()=>{
  const v=current.mood.verses[current.idx];
  const text = ${v.translation}\n\n— Reflection: ${v.reflection};
  if(navigator.share) navigator.share({text}).catch(()=>navigator.clipboard.writeText(text));
  else navigator.clipboard.writeText(text).then(()=>alert('Copied to clipboard'));
};