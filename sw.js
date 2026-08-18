const CACHE="nakuna-usuarios-v6";
const ASSETS=["./","./index.html","./manifest.webmanifest","./favicon.svg"];

const LOGO_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 566 210" role="img" aria-label="Fundación Nakuna">
<rect width="566" height="210" fill="#ffffff"/>
<path d="M0 0h219l39 64-39 146H0z" fill="#184f5f"/>
<g fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
<path d="M91 165c2-28 8-52 18-76 7-17 15-33 26-49"/>
<path d="M91 165c22-12 42-27 59-47"/>
<path d="M104 123c-18-7-31-17-41-30"/>
</g>
<g fill="#fff">
<ellipse cx="70" cy="52" rx="14" ry="6" transform="rotate(20 70 52)"/>
<ellipse cx="92" cy="35" rx="14" ry="6" transform="rotate(25 92 35)"/>
<ellipse cx="121" cy="27" rx="14" ry="6" transform="rotate(-18 121 27)"/>
<ellipse cx="65" cy="75" rx="13" ry="6" transform="rotate(7 65 75)"/>
<ellipse cx="90" cy="75" rx="14" ry="6" transform="rotate(-18 90 75)"/>
<ellipse cx="117" cy="59" rx="14" ry="6" transform="rotate(-25 117 59)"/>
<ellipse cx="75" cy="101" rx="13" ry="6" transform="rotate(-10 75 101)"/>
</g>
<ellipse cx="142" cy="56" rx="15" ry="7" transform="rotate(-32 142 56)" fill="#e6a12b"/>
<text x="276" y="72" font-family="cursive" font-size="52" font-style="italic" fill="#184f5f">Fundación</text>
<text x="272" y="137" font-family="Arial,Helvetica,sans-serif" font-size="70" font-weight="700" letter-spacing="-4" fill="#184f5f">nakuna</text>
<path d="M399 108l13-23 13 9-14 22z" fill="#e6a12b"/>
<text x="373" y="166" font-family="Arial,Helvetica,sans-serif" font-size="19" fill="#e6a12b">re-evolución social</text>
</svg>`;

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",e=>{
  const url=new URL(e.request.url);
  if(url.pathname.endsWith("/assets/logo-nakuna.jpg")){
    e.respondWith(new Response(LOGO_SVG,{headers:{"Content-Type":"image/svg+xml; charset=utf-8","Cache-Control":"no-store"}}));
    return;
  }
  if(e.request.method!=="GET") return;
  e.respondWith(
    caches.match(e.request).then(cached=>cached||fetch(e.request).then(resp=>{
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return resp;
    }).catch(()=>caches.match("./index.html")))
  );
});
