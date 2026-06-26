const {Resvg}=require('@resvg/resvg-js');const fs=require('fs');const path=require('path');
const OUT='/home/user/claude_skills/coopers-golf';const FONTS=path.join(__dirname,'fonts');
const PNGDIR=path.join(OUT,'renders-pro');fs.mkdirSync(PNGDIR,{recursive:true});
const A='Anton',B='Bebas Neue';
const ink='#13151A',bone='#F2EAD7',cream='#FBF5E8',coral='#FF5A36',green='#1C7A4D',gold='#FFB627',lime='#B9E532',shadow='rgba(0,0,0,0.12)';
const R=(svg,w)=>new Resvg(svg,{font:{fontDirs:[FONTS],loadSystemFonts:true},fitTo:{mode:'width',value:w}}).render().asPng();

function lockup(cP,cG,tag,rule,s=1,cx=500,cy=500){return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(${-500} ${-500})">
  <text x="500" y="452" font-family="${A}" font-size="205" fill="${cP}" text-anchor="middle" letter-spacing="3">COOPERS</text>
  <text x="500" y="636" font-family="${A}" font-size="205" fill="${cG}" text-anchor="middle" letter-spacing="34">GOLF</text>
  ${rule?`<rect x="262" y="690" width="476" height="7" fill="${rule}"/>`:''}
  ${tag?`<text x="500" y="760" font-family="${B}" font-size="62" fill="${tag}" text-anchor="middle" letter-spacing="12">AUSTRALIA’S BEST</text>`:''}</g>`;}
function icon(disc,ring,letters,cx,cy,r){const s=r/260;return `<g transform="translate(${cx} ${cy}) scale(${s})"><circle r="260" fill="${disc}"/><circle r="260" fill="none" stroke="${ring}" stroke-width="14"/><text x="0" y="100" font-family="${A}" font-size="300" fill="${letters}" text-anchor="middle" letter-spacing="-10">CG</text></g>`;}

// ---- apparel ----
function polo(body,collar,plk,logoFn){return `
  <ellipse cx="500" cy="900" rx="250" ry="34" fill="${shadow}"/>
  <path d="M 372 300 L 300 348 L 238 470 L 330 520 L 360 466 L 360 860 L 640 860 L 640 466 L 670 520 L 762 470 L 700 348 L 628 300 L 560 360 L 440 360 Z" fill="${body}"/>
  <path d="M 372 300 L 500 430 L 446 330 Z" fill="${collar}"/>
  <path d="M 628 300 L 500 430 L 554 330 Z" fill="${collar}"/>
  <rect x="490" y="330" width="20" height="120" fill="${plk}"/>
  <circle cx="500" cy="362" r="6" fill="${collar}"/><circle cx="500" cy="404" r="6" fill="${collar}"/>
  <rect x="330" y="500" width="40" height="10" fill="${collar}" opacity="0.6"/><rect x="630" y="500" width="40" height="10" fill="${collar}" opacity="0.6"/>
  ${logoFn}`;}
function cap(crown,brim,logoFn){return `
  <ellipse cx="500" cy="620" rx="240" ry="30" fill="${shadow}"/>
  <path d="M 290 470 Q 500 460 710 470 Q 700 560 500 560 Q 300 560 290 470 Z" fill="${brim}"/>
  <path d="M 296 478 Q 296 250 500 250 Q 704 250 704 478 Q 500 512 296 478 Z" fill="${crown}"/>
  <path d="M 500 250 L 500 492" stroke="rgba(0,0,0,0.12)" stroke-width="3"/>
  <path d="M 380 268 Q 500 470 500 492" stroke="rgba(0,0,0,0.1)" stroke-width="3" fill="none"/>
  <path d="M 620 268 Q 500 470 500 492" stroke="rgba(0,0,0,0.1)" stroke-width="3" fill="none"/>
  <circle cx="500" cy="262" r="10" fill="${crown}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
  ${logoFn}`;}
function hangtag(tag,edge,inner){return `
  <ellipse cx="510" cy="870" rx="150" ry="22" fill="${shadow}"/>
  <path d="M 500 150 L 360 220 L 360 840 L 660 840 L 660 220 Z" fill="${tag}" stroke="${edge}" stroke-width="4"/>
  <circle cx="500" cy="225" r="18" fill="${edge}"/><circle cx="500" cy="225" r="9" fill="${tag}"/>
  <path d="M 470 140 Q 360 120 392 215" stroke="${edge}" stroke-width="6" fill="none"/>
  ${inner}`;}

// ---- colourway strip cells ----
const ways=[['CORAL',coral],['TURF GREEN',green],['SUN GOLD',gold],['LOUD LIME',lime]];

// individual product files
const doc=i=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${i}</svg>`;
fs.writeFileSync(path.join(PNGDIR,'07-polo.png'),R(doc(`<rect width="1000" height="1000" fill="${cream}"/>`+polo(ink,coral,coral,icon(coral,bone,ink,380,540,52)+`<text x="380" y="640" font-family="${B}" font-size="30" fill="${bone}" text-anchor="middle" letter-spacing="3">COOPERS GOLF</text>`)),1000));
fs.writeFileSync(path.join(PNGDIR,'08-cap.png'),R(doc(`<rect width="1000" height="1000" fill="${cream}"/>`+cap(coral,ink,icon(ink,bone,coral,500,380,86))),1000));
fs.writeFileSync(path.join(PNGDIR,'09-hangtag.png'),R(doc(`<rect width="1000" height="1000" fill="${cream}"/>`+hangtag(ink,coral,lockup(coral,bone,bone,coral,0.42,510,470)+`<text x="510" y="690" font-family="${B}" font-size="40" fill="${bone}" text-anchor="middle" letter-spacing="6">EST · 2026</text>`)),1000));

// ---- applications board ----
const Wd=1600;
let top='';ways.forEach(([n,c],i)=>{const x=i*Wd/4;top+=`<g transform="translate(${x} 0)"><rect width="${Wd/4}" height="360" fill="${ink}"/><svg x="20" y="-40" width="360" height="360" viewBox="0 0 1000 1000">${lockup(c,bone,null,c,1,500,520)}</svg><rect x="0" y="316" width="${Wd/4}" height="44" fill="#0c0c0e"/><text x="${Wd/8}" y="345" font-family="${B}" font-size="26" fill="#ddd" text-anchor="middle" letter-spacing="4">${n}</text></g>`;});
const products=`<rect y="360" width="${Wd}" height="840" fill="${cream}"/>
 <svg x="40" y="430" width="700" height="700" viewBox="0 0 1000 1000">${polo(ink,coral,coral,icon(coral,bone,ink,380,540,52)+`<text x="380" y="640" font-family="${B}" font-size="30" fill="${bone}" text-anchor="middle" letter-spacing="3">COOPERS GOLF</text>`)}</svg>
 <svg x="720" y="470" width="560" height="560" viewBox="0 0 1000 1000">${cap(coral,ink,icon(ink,bone,coral,500,380,86))}</svg>
 <svg x="1180" y="430" width="420" height="700" viewBox="0 0 1000 1000">${hangtag(ink,coral,lockup(coral,bone,bone,coral,0.42,510,470)+`<text x="510" y="690" font-family="${B}" font-size="40" fill="${bone}" text-anchor="middle" letter-spacing="6">EST · 2026</text>`)}</svg>
 <text x="60" y="1170" font-family="${B}" font-size="34" fill="${ink}" letter-spacing="3">COOPERS GOLF — APPLICATIONS · POLO / CAP / HANGTAG</text>`;
const board=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Wd} 1200"><rect width="${Wd}" height="1200" fill="${cream}"/>${top}${products}</svg>`;
fs.writeFileSync(path.join(PNGDIR,'_applications.png'),R(board,2300));
// colourway board
const cb=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 460"><rect width="1600" height="460" fill="${ink}"/>${ways.map(([n,c],i)=>`<g transform="translate(${i*400} 0)"><svg x="20" y="-30" width="360" height="400" viewBox="0 0 1000 1000">${lockup(c,bone,'AUSTRALIA’S BEST',c,1,500,520)}</svg><text x="200" y="430" font-family="${B}" font-size="30" fill="#ddd" text-anchor="middle" letter-spacing="5">${n}</text></g>`).join('')}</svg>`;
fs.writeFileSync(path.join(PNGDIR,'_colourways.png'),R(cb,2000));
console.log('applications + colourways rendered');
