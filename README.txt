AWN website: how to put it online
=================================
1. Upload everything in this folder to your hosting, keeping the same structure
   (index.html, sw.js, manifest.webmanifest, the "images" folder and the "icons" folder).
2. The site must be served over https (most hosts, GitHub Pages and Netlify do this).
3. Open the site on a phone: Chrome shows "Install the AWN app" at the bottom of the page.
   On iPhone (Safari): tap Share, then "Add to Home Screen".
4. Adding an upcoming session: open index.html, find "UPCOMING SESSIONS: edit here", copy the example line.
5. After you change index.html or images, change VERSION in sw.js (for example "awn-v2") so installed apps update.
