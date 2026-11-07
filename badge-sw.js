/* badge-sw.js
   Service worker add-on: puts a badge (red dot / number) on the installed app icon
   when a new version of the site has been deployed.
   Loaded from sw.js with:  importScripts("badge-sw.js");  (first line of sw.js) */

function awnSetBadge(n){
  try{
    if(n>0&&self.navigator&&navigator.setAppBadge)return navigator.setAppBadge(n).catch(function(){});
    if(n===0&&self.navigator&&navigator.clearAppBadge)return navigator.clearAppBadge().catch(function(){});
  }catch(e){}
  return Promise.resolve();
}

/* Runs by itself every so often (Chrome decides when) even if the app is closed. */
self.addEventListener("periodicsync",function(event){
  if(event.tag!=="awn-check-update")return;
  event.waitUntil((async function(){
    try{
      await self.registration.update();            /* downloads sw.js again, finds out if it changed */
      var reg=self.registration;
      var w=reg.installing||reg.waiting;
      if(w&&w.state==="installing"){
        await new Promise(function(res){
          var t=setTimeout(res,20000);
          w.addEventListener("statechange",function(){if(w.state!=="installing"){clearTimeout(t);res()}});
        });
      }
      if(reg.waiting)await awnSetBadge(1);
    }catch(e){}
  })());
});

/* The page can ask the worker to set or clear the badge. */
self.addEventListener("message",function(event){
  var d=event.data;
  if(d&&d.type==="AWN_BADGE")event.waitUntil(awnSetBadge(d.count|0));
});

/* Also works if you later add real push messages (Firebase / OneSignal). */
self.addEventListener("push",function(event){
  event.waitUntil(awnSetBadge(1));
});
