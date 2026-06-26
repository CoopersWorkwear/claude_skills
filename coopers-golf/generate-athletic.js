const {Resvg}=require('@resvg/resvg-js');const fs=require('fs');const path=require('path');
const OUT='/home/user/claude_skills/coopers-golf';const FONTS=path.join(__dirname,'fonts');
const DIR=path.join(OUT,'renders-athletic'),SV=path.join(OUT,'svg-athletic');
fs.mkdirSync(DIR,{recursive:true});fs.mkdirSync(SV,{recursive:true});
const ink='#0E0E10',white='#FFFFFF',bone='#F4F1EA',grey='#8E8E93',volt='#E8FE57';
const A='Archivo';
const R=(svg,w)=>new Resvg(svg,{font:{fontDirs:[FONTS],loadSystemFonts:true},fitTo:{mode:'width',value:w}}).render().asPng();

// refined bold swoosh (motion / swing). origin box ~1000
function swoosh(c,cx=500,cy=480,s=1){return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-500 -480)">
  <path d="M 120 660 C 380 790 700 760 900 200 C 740 480 470 600 320 552 C 250 530 175 580 120 660 Z" fill="${c}"/></g>`;}
function swooshBall(c,cx=500,cy=470,s=1){return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-500 -470)">
  <path d="M 120 660 C 380 790 700 760 900 210 C 740 480 470 600 320 552 C 250 530 175 580 120 660 Z" fill="${c}"/>
  <circle cx="868" cy="196" r="60" fill="${c}"/></g>`;}
function cgMono(c,cx=500,cy=500,s=1){return `<text x="${cx}" y="${cy+138}" font-family="${A}" font-weight="900" font-size="440" fill="${c}" text-anchor="middle" letter-spacing="-46" transform="translate(0 ${(s-1)*0})" >CG</text>`;}
function word(c,cx=500,cy=500,size=170){return `<text x="${cx}" y="${cy}" font-family="${A}" font-weight="900" font-size="${size}" fill="${c}" text-anchor="middle" letter-spacing="-2">COOPERS GOLF</text>`;}
function wordStack(cP,cG,cx,cy,size){return `<text x="${cx}" y="${cy}" font-family="${A}" font-weight="900" font-size="${size}" fill="${cP}" text-anchor="middle" letter-spacing="0">COOPERS</text><text x="${cx}" y="${cy+size*0.92}" font-family="${A}" font-weight="900" font-size="${size}" fill="${cG}" text-anchor="middle" letter-spacing="${size*0.30}">GOLF</text>`;}
function tag(c,cx,cy,size=40){return `<text x="${cx}" y="${cy}" font-family="${A}" font-weight="700" font-size="${size}" fill="${c}" text-anchor="middle" letter-spacing="${size*0.36}">AUSTRALIA’S BEST</text>`;}
// full stacked lockup with safe spacing: icon, COOPERS, GOLF, rule, tagline
function lockupFull(cW,cRule,cTag,cx,iconY,iconS){return swooshBall(cW,cx,iconY,iconS)
 +`<text x="${cx}" y="510" font-family="${A}" font-weight="900" font-size="150" fill="${cW}" text-anchor="middle" letter-spacing="-1">COOPERS</text>`
 +`<text x="${cx+22}" y="640" font-family="${A}" font-weight="900" font-size="150" fill="${cW}" text-anchor="middle" letter-spacing="44">GOLF</text>`
 +`<rect x="${cx-205}" y="690" width="410" height="6" fill="${cRule}"/>`
 +`<text x="${cx}" y="752" font-family="${A}" font-weight="700" font-size="36" fill="${cTag}" text-anchor="middle" letter-spacing="14">AUSTRALIA’S BEST</text>`;}
function chestCG(c,cx,cy){return `<text x="${cx}" y="${cy+34}" font-family="${A}" font-weight="900" font-size="118" fill="${c}" text-anchor="middle" letter-spacing="-14">CG</text>`;}

// ----- key artboards (1000x1000) -----
const doc=i=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${i}</svg>`;
const arts={
 'primary-lockup':`<rect width="1000" height="1000" fill="${ink}"/>${lockupFull(white,white,grey,500,300,0.58)}`,
 'icon-swoosh':`<rect width="1000" height="1000" fill="${ink}"/>${swoosh(white,500,500,0.92)}`,
 'icon-swoosh-ball':`<rect width="1000" height="1000" fill="${ink}"/>${swooshBall(white,500,500,0.92)}`,
 'monogram-cg':`<rect width="1000" height="1000" fill="${ink}"/><circle cx="500" cy="500" r="360" fill="none" stroke="${white}" stroke-width="14"/>${cgMono(white,500,470,1)}`,
 'wordmark':`<rect width="1000" height="1000" fill="${white}"/>${word(ink,500,480,150)}${swoosh(ink,500,600,0.4)}${tag(grey,500,690,30)}`,
 'reversed':`<rect width="1000" height="1000" fill="${bone}"/>${lockupFull(ink,ink,'#6b6b70',500,300,0.58)}`,
};
Object.entries(arts).forEach(([k,v])=>{fs.writeFileSync(path.join(SV,k+'.svg'),doc(v));fs.writeFileSync(path.join(DIR,k+'.png'),R(doc(v),1000));});

// ----- product mocks -----
function cap(crown,brim,mark){return `<ellipse cx="500" cy="620" rx="240" ry="28" fill="rgba(0,0,0,0.12)"/><path d="M 290 470 Q 500 460 710 470 Q 700 558 500 558 Q 300 558 290 470 Z" fill="${brim}"/><path d="M 296 478 Q 296 250 500 250 Q 704 250 704 478 Q 500 510 296 478 Z" fill="${crown}"/><circle cx="500" cy="262" r="10" fill="${crown}"/>${mark}`;}
function polo(body,collar,mark){return `<ellipse cx="500" cy="895" rx="250" ry="32" fill="rgba(0,0,0,0.12)"/><path d="M 372 300 L 300 348 L 238 470 L 330 520 L 360 466 L 360 860 L 640 860 L 640 466 L 670 520 L 762 470 L 700 348 L 628 300 L 560 360 L 440 360 Z" fill="${body}"/><path d="M 372 300 L 500 430 L 446 330 Z" fill="${collar}"/><path d="M 628 300 L 500 430 L 554 330 Z" fill="${collar}"/><rect x="490" y="330" width="20" height="120" fill="${collar}"/>${mark}`;}

// ----- master system board -----
const Wd=1600;
const hero=`<rect width="${Wd}" height="640" fill="${ink}"/><svg x="${Wd/2-320}" y="30" width="640" height="640" viewBox="0 0 1000 1000">${lockupFull(white,white,grey,500,310,0.6)}</svg>`;
const iconrow=`<g transform="translate(0 640)"><rect width="${Wd}" height="430" fill="${white}"/>`+
 [['SWOOSH',swoosh(ink,500,500,0.8)],['SWOOSH + BALL',swooshBall(ink,500,500,0.8)],['CG MONOGRAM',`<circle cx="500" cy="500" r="330" fill="none" stroke="${ink}" stroke-width="14"/>${cgMono(ink,500,470,1)}`]].map(([n,m],i)=>`<svg x="${120+i*490}" y="20" width="330" height="330" viewBox="0 0 1000 1000">${m}</svg><text x="${285+i*490}" y="400" font-family="${A}" font-weight="800" font-size="26" fill="${ink}" text-anchor="middle" letter-spacing="2">${n}</text>`).join('')+`</g>`;
const prod=`<g transform="translate(0 1070)"><rect width="${Wd}" height="540" fill="${bone}"/>`+
 `<svg x="120" y="20" width="500" height="500" viewBox="0 0 1000 1000">${polo(ink,white,chestCG(white,402,452)+swoosh(white,402,512,0.12))}</svg>`+
 `<svg x="640" y="40" width="460" height="460" viewBox="0 0 1000 1000">${cap(ink,ink,swooshBall(white,500,360,0.5))}</svg>`+
 `<svg x="1120" y="60" width="440" height="440" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${ink}"/>${swooshBall(white,500,420,0.62)}${word(white,500,640,90)}</svg>`+
 `<text x="120" y="510" font-family="${A}" font-weight="800" font-size="26" fill="${ink}" letter-spacing="2">POLO · CAP · TAG</text></g>`;
const foot=`<g transform="translate(0 1610)"><rect width="${Wd}" height="90" fill="${ink}"/><text x="120" y="56" font-family="${A}" font-weight="800" font-size="30" fill="${white}" letter-spacing="2">COOPERS GOLF</text><text x="${Wd-120}" y="56" font-family="${A}" font-weight="600" font-size="26" fill="${grey}" text-anchor="end" letter-spacing="2">TYPE — ARCHIVO BLACK · MONOCHROME SYSTEM</text></g>`;
const board=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Wd} 1700"><rect width="${Wd}" height="1700" fill="${ink}"/>${hero}${iconrow}${prod}${foot}</svg>`;
fs.writeFileSync(path.join(DIR,'_athletic-system.png'),R(board,2400));
console.log('athletic system rendered');
