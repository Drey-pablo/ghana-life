// Ghana Life service worker: web push + notification clicks + minimal offline shell. No caching of game data.
const V='gl-sw-1';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data&&e.data.text()}}
 const title=String(d.title||'Ghana Life').slice(0,60),body=String(d.body||'Something happened in Ghana Life').slice(0,160);
 e.waitUntil((async()=>{const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  const vis=cs.some(c=>c.visibilityState==='visible');
  if(vis&&d.tag&&String(d.tag).startsWith('dm-')){cs.forEach(c=>c.postMessage({gl:'push',d}));return}
  if(self.navigator&&navigator.setAppBadge)try{await navigator.setAppBadge()}catch(_){}
  await self.registration.showNotification(title,{body,tag:String(d.tag||'gl'),renotify:true,icon:'icon-192.png',badge:'icon-192.png',data:{url:d.url||self.registration.scope}})})())});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=new URL((e.notification.data&&e.notification.data.url)||self.registration.scope,self.registration.scope);
 if(url.origin!==self.location.origin)return;
 e.waitUntil((async()=>{const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});for(const c of cs){if(new URL(c.url).origin===url.origin){await c.focus();c.postMessage({gl:'open',hash:url.hash});return}}await self.clients.openWindow(url.href)})())});
