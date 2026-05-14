const API_BASE="https://api.safetychecktestltd.co.uk/api";
const grid=document.getElementById("galleryGrid");
const lightbox=document.getElementById("lightbox");
const lightboxImage=document.getElementById("lightboxImage");
const lightboxText=document.getElementById("lightboxText");
const closeLightbox=document.getElementById("closeLightbox");
let items=[];

function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function label(v){return String(v||"").replace(/-/g," ").replace(/\b\w/g,m=>m.toUpperCase())}

function render(filter="all"){
  const visible=items.filter(item=>{
    const values=[item.category,item.stage,item.service].map(v=>String(v||"").toLowerCase());
    return filter==="all"||values.includes(filter);
  });

  if(!visible.length){
    grid.innerHTML='<div class="gallery-empty"><strong>No gallery photos uploaded yet.</strong><br>Admin can upload real project photos and they will appear here automatically.</div>';
    return;
  }

  grid.innerHTML=visible.map(item=>`
    <article class="gallery-card" data-title="${esc(item.title||"")}" data-image="${esc(item.imageUrl||"")}">
      <img src="${esc(item.imageUrl)}" alt="${esc(item.title||"Safety Check Test project photo")}" loading="lazy">
      <div class="gallery-card-content">
        <div class="gallery-tags">
          <span>${esc(label(item.category||"Project"))}</span>
          <span>${esc(label(item.stage||"Work"))}</span>
        </div>
        <h3>${esc(item.title||"Safety Check Test Project")}</h3>
        <p>${esc(item.description||item.service||"Completed project work by Safety Check Test Ltd.")}</p>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".gallery-card").forEach(card=>{
    card.addEventListener("click",()=>{
      lightboxImage.src=card.dataset.image;
      lightboxText.textContent=card.dataset.title||"Safety Check Test Ltd";
      lightbox.classList.add("open");
    });
  });
}

async function loadGallery(){
  try{
    const res=await fetch(`${API_BASE}/gallery`,{cache:"no-store"});
    const data=await res.json();
    items=Array.isArray(data.items)?data.items:[];
    render();
  }catch(e){
    grid.innerHTML='<div class="gallery-empty">Gallery is being updated. Please check again shortly.</div>';
  }
}

document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.filter);
  });
});

closeLightbox.addEventListener("click",()=>lightbox.classList.remove("open"));
lightbox.addEventListener("click",e=>{if(e.target===lightbox)lightbox.classList.remove("open")});
loadGallery();
