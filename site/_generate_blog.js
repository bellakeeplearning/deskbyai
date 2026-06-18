const fs=require("fs");
const path=require("path");

const BLOG="site/blog";
const IMG=BLOG+"/images";
const articles=JSON.parse(fs.readFileSync("site/articles.json","utf8"));
const existing=JSON.parse(fs.readFileSync("site/data.json","utf8"));
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
fs.mkdirSync(IMG,{recursive:true});

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}

function pageTop(title,desc,img){
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="google-site-verification" content="BpmSXLqNp8iHnepdt2I4P-cNQAjhk6z1HBBpD563t3I" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>'+esc(title)+' &mdash; OutechLife</title>\n  <meta name="description" content="'+esc(desc)+'">\n  <meta property="og:title" content="'+esc(title)+'">\n  <meta property="og:description" content="'+esc(desc)+'">\n  <meta property="og:url" content="https://outechlife.com/blog/'+esc(articles.find(a=>title.includes(a.title))?.slug||'')+'.html">\n  <meta property="og:type" content="article">\n  <meta property="og:image" content="https://outechlife.com/blog/images/'+esc(img)+'">\n  <link rel="preconnect" href="https://fonts.googleapis.com">\n  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">\n  <link rel="stylesheet" href="../css/style.css">\n  <link rel="stylesheet" href="../css/blog.css">\n</head>\n<body>\n<header>\n  <div class="container">\n    <a href="../index.html" class="logo">OutechLife</a>\n    <nav><a href="../index.html">Schemes</a><a href="index.html" style="margin-left:16px">Blog</a></nav>\n  </div>\n</header>';
}
function footer(){
  return '<footer>\n  <div class="container">\n    <p>OutechLife &mdash; Curated workspace inspiration. As an Amazon Associate we earn from qualifying purchases.</p>\n  </div>\n</footer>\n</body>\n</html>';
}

// Generate article pages
articles.forEach(a=>{
  // Find related scheme
  let scheme=existing.find(s=>s.id===a.sl.replace('.html',''));
  let imgFile=a.slug+'.webp';
  
  // Create placeholder SVG image if doesn't exist
  if(!fs.existsSync(path.join(IMG,imgFile))){
    let svg='<svg xmlns="http://www.w3.org/2000/svg" width="1216" height="832"><rect width="1216" height="832" fill="#f0eeec"/><text x="608" y="400" text-anchor="middle" fill="#999" font-family="Geist,sans-serif" font-size="28">'+esc(a.title)+'</text></svg>';
    fs.writeFileSync(path.join(IMG,imgFile.replace('.webp','.svg')),svg,'utf8');
    imgFile=imgFile.replace('.webp','.svg');
  }

  // Build scheme links block
  let schemeBlock=scheme?'<p><strong>Explore more desk setups:</strong> <a href="../schemes/'+a.sl+'">'+a.sn+'</a></p>':'';

  let html=pageTop(a.title,a.desc,imgFile)+'<main>\n  <article class="blog-post">\n    <div class="container blog-container">\n      <div class="blog-breadcrumb"><a href="index.html">Blog</a> / '+esc(a.title)+'</div>\n      <h1>'+esc(a.title)+'</h1>\n      <div class="blog-meta">\n        <span class="blog-date">'+a.date+'</span>\n        <span class="blog-reading">'+a.rt+' min read</span>\n      </div>\n      <div class="blog-featured-image">\n        <img src="images/'+imgFile+'" alt="'+esc(a.title)+'" loading="lazy">\n      </div>\n      <div class="blog-content">\n'+a.body+'\n'+schemeBlock+'\n      </div>\n    </div>\n  </article>\n</main>\n'+footer();
  
  fs.writeFileSync(path.join(BLOG,a.slug+'.html'),html,'utf8');
  console.log(a.slug);
});

// Update blog index
let blogIndex=fs.readFileSync(path.join(BLOG,'index.html'),'utf8');

// Build new cards
let cards=articles.map(a=>{
  let imgFile=fs.existsSync(path.join(IMG,a.slug+'.webp'))?a.slug+'.webp':a.slug+'.svg';
  let excerpt=a.desc.length>120?a.desc.slice(0,120)+'...':a.desc;
  return '      <a href="'+a.slug+'.html" class="blog-card">\n        <div class="blog-card-image">\n          <img src="images/'+imgFile+'" alt="'+esc(a.title)+'" loading="lazy">\n        </div>\n        <div class="blog-card-body">\n          <span class="blog-card-date">'+a.date+'</span>\n          <h2>'+esc(a.title)+'</h2>\n          <p>'+esc(excerpt)+'</p>\n          <span class="blog-card-read">Read article →</span>\n        </div>\n      </a>';
}).join('\n');

// Replace blog grid content
blogIndex=blogIndex.replace(/<div class="blog-grid"[^>]*>[\s\S]*?<\/div>\s*<\/main>/, '<div class="blog-grid">\n'+cards+'\n    </div>\n  </div>\n</main>');

fs.writeFileSync(path.join(BLOG,'index.html'),blogIndex,'utf8');
console.log('Blog index updated with '+articles.length+' articles');
