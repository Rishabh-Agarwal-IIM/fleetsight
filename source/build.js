// Builds public/index.html from the readable source files in source/src.
// Usage (from the project folder):  node source/build.js
const fs = require('fs'), path = require('path');
const S = p => fs.readFileSync(path.join(__dirname, 'src', p), 'utf8');
const JS = ['0-map.js','1-core.js','2-ui.js','3-ops.js','4-fin.js','6-extra.js','7-ask.js','8-profile-img.js','8-profile.js','5-app.js'];
const LIBS = [
  'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js',
  'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js',
  'https://cdn.jsdelivr.net/npm/prop-types@15.8.1/prop-types.min.js',
  'https://cdn.jsdelivr.net/npm/recharts@2.12.7/umd/Recharts.js',
  'https://cdn.jsdelivr.net/npm/htm@3.1.1/dist/htm.umd.js'];
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>FleetSight — Monitor. Analyse. Improve.</title>
<meta name="description" content="FleetSight: monitor, analyse and improve fleet operations and cost.">
<meta name="theme-color" content="#064E5A">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="FleetSight">
<meta property="og:type" content="website">
<meta property="og:title" content="FleetSight — Monitor. Analyse. Improve.">
<meta property="og:description" content="Fleet operations and cost intelligence for 7 centres and 250 vehicles, with an assistant that cites its sources. Built by Rishabh Agarwal.">
<meta property="og:image" content="/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap" rel="stylesheet">
<style>
${S('style.css')}
</style>
</head>
<body>
<div id="root"></div>
${LIBS.map(u => `<script src="${u}"></script>`).join('\n')}
<script>
${JS.map(S).join('\n')}
</script>
<script>if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}</script>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, '..', 'public', 'index.html'), html);
console.log('Built public/index.html (' + Math.round(html.length / 1024) + ' KB)');
