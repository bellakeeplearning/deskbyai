const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const SCHEMES_DIR = path.join(ROOT, "schemes");
const schemes = JSON.parse(fs.readFileSync(path.join(ROOT, "data.json"), "utf-8"));
function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
const _PAGE_TOP = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="google-site-verification" content="BpmSXLqNp8iHnepdt2I4P-cNQAjhk6z1HBBpD563t3I" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
const _FONT = '  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">\n';
const _CSS = '  <link rel="stylesheet" href="css/style.css">\n';
const _CSS_SUB = '  <link rel="stylesheet" href="../css/style.css">\n';
function _hd(isSub) { const p = isSub?"../":""; return `<header>\n  <div class="container">\n    <a href="${p}index.html" class="logo">OutechLife</a>\n    <nav><a href="${p}index.html">Schemes</a><a href="${p}blog/index.html" style="margin-left:16px">Blog</a></nav>\n  </div>\n</header>`; }
function _ft() { return `<footer>\n  <div class="container">\n    <p>OutechLife &mdash; Curated workspace inspiration. As an Amazon Associate we earn from qualifying purchases.</p>\n  </div>\n</footer>`; }
function genIndex() {
  const sd = schemes.map(s => ({id:s.id,title:s.title,desc:s.desc[0].length>120?s.desc[0].substring(0,120)+"...":s.desc[0],tags:s.tags,budget:s.budget?"$"+s.budget:"",img:s.img}));
  const cards = sd.map(s => `    <a href="schemes/${s.id}.html" class="scheme-card"><div class="card-image"><img src="${s.img}" alt="${esc(s.title)}" loading="lazy"></div><div class="card-body"><div class="card-tags">${s.tags.map(t=>'<span class="tag">'+esc(t)+'</span>').join("")}</div><h2>${esc(s.title)}</h2><p class="card-desc">${esc(s.desc)}</p><span class="price-tag">From ${s.budget}</span></div></a>`).join("\n");
  const html = _PAGE_TOP+'  <title>OutechLife &mdash; Curated Desk Setups, Built for You</title>\n  <meta name="description" content="Beautiful desk setup schemes with AI-generated visuals and complete shopping lists.">\n  <meta property="og:title" content="OutechLife &mdash; Curated Desk Setups">\n  <meta property="og:description" content="Beautiful desk setup schemes with AI-generated visuals and complete shopping lists.">\n  <meta property="og:url" content="https://outechlife.com">\n  <meta property="og:type" content="website">\n'+_FONT+_CSS+'</head>\n<body>\n'+_hd(false)+'<main>\n  <section class="hero"><div class="container"><h1>Your perfect desk, visualized and ready to buy</h1><p>Browse complete desk makeover schemes &mdash; see the setup, love the look, buy everything in one click.</p></div></section>\n  <div class="container">\n    <div class="filter-bar">\n      <button class="filter-btn active" data-filter="all">All</button>\n      <button class="filter-btn" data-filter="minimalist">Minimalist</button>\n      <button class="filter-btn" data-filter="warm">Warm &amp; Cozy</button>\n      <button class="filter-btn" data-filter="cyberpunk">Cyberpunk</button>\n      <button class="filter-btn" data-filter="budget">Budget</button>
      <button class="filter-btn" data-filter="clean">Clean</button>\n    </div>\n    <div class="scheme-grid" id="schemeGrid"></div>\n  </div>\n</main>\n'+_ft()+'\n<script>\nconst schemes = '+JSON.stringify(sd)+';\nfunction renderCards(f){f=f||"all";const g=document.getElementById("schemeGrid");const fl=f==="all"?schemes:schemes.filter(s=>s.tags.some(t=>t.toLowerCase()===f));if(fl.length===0){g.innerHTML="<p style=\'grid-column:1/-1;text-align:center;color:var(--text-muted);padding:48px 0;\'>No schemes match this filter yet. Coming soon!</p>";return}g.innerHTML=fl.map(s=>\'<a href="schemes/\'+s.id+\'.html" class="scheme-card"><div class="card-image"><img src="\'+s.img+\'" alt="\'+s.title+\'" loading="lazy"></div><div class="card-body"><div class="card-tags">\'+s.tags.map(t=>"<span class=\'tag\'>"+t+"</span>").join("")+\'</div><h2>\'+s.title+\'</h2><p class="card-desc">\'+s.desc+\'</p><span class="price-tag">From \'+s.budget+\'</span></div></a>\').join("")}\ndocument.querySelectorAll(".filter-btn").forEach(b=>{b.addEventListener("click",()=>{document.querySelectorAll(".filter-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderCards(b.dataset.filter)})});\nrenderCards("all");\n</script>\n</body>\n</html>\n';
  fs.writeFileSync(path.join(ROOT, "index.html"), html, "utf-8");
  console.log("Wrote index.html");
}
function genScheme(s) {
  const phtml = s.products.map(p => `      <div class="product-item"><div class="p-image" style="background:${p.color};"></div><div class="p-info"><div class="p-name">${esc(p.name)}</div><div class="p-note">${esc(p.note)}</div></div>${p.price?'<div class="p-price">'+esc(p.price)+'</div>':""}<a class="p-btn" href="${esc(p.link)}" target="_blank" rel="nofollow">View on Amazon</a></div>`).join("\n");
  const dhtml = s.desc.map(p => "      <p>" + esc(p) + "</p>").join("\n");
  const bhtml = s.budget ? '<span class="total-price">Total: $'+s.budget+'</span>' : '<span class="total-price"></span>';
  const html = _PAGE_TOP+'  <title>'+esc(s.title)+' &mdash; OutechLife</title>\n  <meta name="description" content="'+esc(s.desc[0].substring(0,150))+'">\n'+_FONT+_CSS_SUB+'</head>\n<body>\n'+_hd(true)+'<main>\n  <div class="container">\n    <div class="scheme-header">\n      <div class="breadcrumb"><a href="../index.html">Schemes</a> / '+esc(s.title)+'</div>\n      <h1>'+esc(s.title)+'</h1>\n      <div class="meta">\n        '+bhtml+'\n        <div class="tags">'+s.tags.map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div>\n      </div>\n    </div>\n    <div class="scheme-hero">\n      <img src="../'+s.img+'" alt="'+esc(s.title)+' desk setup">\n    </div>\n    <div class="scheme-desc">\n'+dhtml+'\n    </div>\n    <div class="product-list">\n      <h2>What\'s in this scheme</h2>\n'+phtml+'\n    </div>\n  </div>\n</main>\n'+_ft()+'\n</body>\n</html>\n';
  const fp = path.join(SCHEMES_DIR, s.id+".html");
  fs.writeFileSync(fp, html, "utf-8");
  console.log("Wrote " + fp);
}
if(!fs.existsSync(SCHEMES_DIR)) fs.mkdirSync(SCHEMES_DIR,{recursive:true});
genIndex();
schemes.forEach(genScheme);
console.log("Done &mdash; " + schemes.length + " schemes");
