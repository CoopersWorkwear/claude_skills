const {Resvg} = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const OUT = '/home/user/claude_skills/coopers-golf';
const SVGDIR = path.join(OUT,'svg');
const PNGDIR = path.join(OUT,'renders');
fs.mkdirSync(SVGDIR,{recursive:true});
fs.mkdirSync(PNGDIR,{recursive:true});

const C={navy:'#14213D',navy2:'#1B2C4F',green:'#1F5135',pine:'#14402B',brass:'#C8A24B',brassL:'#DCC07E',
  cream:'#F4EFE3',chalk:'#FBF8F1',ink:'#15171A',clay:'#B5402F',stone:'#E7DEC9',oak:'#8A5A2B',sky:'#EAD9B0'};
const SERIF='Liberation Serif', SANS='Liberation Sans';

// ---------- helpers ----------
const W=1000;
function bg(c){return `<rect width="1000" height="1000" fill="${c}"/>`;}
function ringText(cx,cy,r,top,bot,color,size,ls=6){
  const idT=`t${cx}_${cy}_${r}`, idB=`b${cx}_${cy}_${r}`;
  const topPath=`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`;
  const botPath=`M ${cx-r} ${cy} A ${r} ${r} 0 0 0 ${cx+r} ${cy}`;
  let s=`<defs><path id="${idT}" d="${topPath}"/><path id="${idB}" d="${botPath}"/></defs>`;
  if(top)s+=`<text font-family="${SANS}" font-weight="bold" font-size="${size}" fill="${color}" letter-spacing="${ls}" text-anchor="middle"><textPath href="#${idT}" startOffset="50%">${top}</textPath></text>`;
  if(bot)s+=`<text font-family="${SANS}" font-weight="bold" font-size="${size}" fill="${color}" letter-spacing="${ls}" text-anchor="middle"><textPath href="#${idB}" startOffset="50%">${bot}</textPath></text>`;
  return s;
}
function golfBall(cx,cy,r,fill,dot,op=0.5){
  let d='';const step=r/3.4;
  for(let i=-r;i<=r;i+=step)for(let j=-r;j<=r;j+=step){if(i*i+j*j<(r-r*0.12)*(r-r*0.12))d+=`<circle cx="${(cx+i).toFixed(1)}" cy="${(cy+j).toFixed(1)}" r="${(r/11).toFixed(1)}" fill="${dot}" opacity="${op}"/>`;}
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>${d}`;
}
function clubV(scale,color){ // head at bottom, shaft up
  const len=300*scale, sw=15*scale;
  return `<g>
    <rect x="${-sw/2}" y="${-len}" width="${sw}" height="${len}" rx="${sw/2}" fill="${color}"/>
    <rect x="${-sw/2-3}" y="${-len}" width="${sw+6}" height="${len*0.2}" rx="${sw/2}" fill="${color}"/>
    <g transform="rotate(-22)"><rect x="${-sw*0.5}" y="${-sw*0.6}" width="${56*scale}" height="${30*scale}" rx="${15*scale}" fill="${color}"/></g>
  </g>`;
}
function crossedClubs(cx,cy,scale,color){
  return `<g transform="translate(${cx} ${cy})">
    <g transform="rotate(26)">${clubV(scale,color)}</g>
    <g transform="rotate(-26) scale(-1,1)">${clubV(scale,color)}</g>
  </g>`;
}
function shield(cx,cy,w,h,fill,stroke,sw){
  const x=cx-w/2,y=cy-h/2;
  return `<path d="M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h*0.52} Q ${x+w} ${y+h*0.88} ${cx} ${y+h} Q ${x} ${y+h*0.88} ${x} ${y+h*0.52} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function laurel(cx,cy,r,color,leaves=13,spread=62){
  let out='';
  for(const side of [-1,1]){
    for(let t=0;t<=leaves;t++){
      const a=(-spread+t*(2*spread/leaves));
      const rad=a*Math.PI/180;
      const px=cx+side*Math.sin(rad)*r;
      const py=cy-Math.cos(rad)*r;
      const rot=side*(90)-side*a; // tangent
      out+=`<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="22" ry="9" fill="${color}" transform="rotate(${rot.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
    }
  }
  return out;
}
function star(cx,cy,r,color,pts=5,rot=-90){
  let d='';for(let i=0;i<pts*2;i++){const rr=i%2?r*0.42:r;const a=(rot+i*180/pts)*Math.PI/180;d+=(i?'L':'M')+` ${(cx+rr*Math.cos(a)).toFixed(1)} ${(cy+rr*Math.sin(a)).toFixed(1)} `;}
  return `<path d="${d}Z" fill="${color}"/>`;
}
function southernCross(cx,cy,s,color){
  // 5 stars (Crux)
  const pts=[[0,-150,34],[ -8,150,34],[120,30,30],[-130,10,30],[40,-10,20]];
  return pts.map(([x,y,r])=>star(cx+x*s,cy+y*s,r*s,color)).join('');
}
function flag(cx,cy,h,poleC,flagC,dir=1){ // pole bottom at cx,cy
  return `<g>
    <rect x="${cx-4}" y="${cy-h}" width="8" height="${h}" rx="4" fill="${poleC}"/>
    <circle cx="${cx}" cy="${cy-h}" r="7" fill="${poleC}"/>
    <path d="M ${cx} ${cy-h+6} L ${cx+dir*92} ${cy-h+30} L ${cx} ${cy-h+58} Z" fill="${flagC}"/>
  </g>`;
}
function wordmark(cx,cy,str,size,color,family=SERIF,weight='normal',ls=14){
  return `<text x="${cx}" y="${cy}" font-family="${family}" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="middle" letter-spacing="${ls}">${str}</text>`;
}
function lettersRow(cx,cy,str,adv,size,family,weight,color,skip=[]){
  const n=str.length, total=(n-1)*adv; let x=cx-total/2; let out=''; const pos=[];
  str.split('').forEach((ch,i)=>{pos.push({x,ch});if(!skip.includes(i)&&ch!==' ')out+=`<text x="${x.toFixed(1)}" y="${cy}" font-family="${family}" font-weight="${weight}" font-size="${size}" fill="${color}" text-anchor="middle">${ch}</text>`;x+=adv;});
  return {svg:out,pos};
}
function monoCG(cx,cy,r,color,sw){
  const c=`<path d="M ${cx+r*0.5} ${cy-r*0.8} A ${r} ${r} 0 1 0 ${cx+r*0.5} ${cy+r*0.8}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const r2=r*0.6;
  const g=`<path d="M ${cx+r2*0.55} ${cy-r2*0.8} A ${r2} ${r2} 0 1 0 ${cx+r2*0.66} ${cy+r2*0.86}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
   <rect x="${cx+r2*0.06}" y="${cy+r2*0.2}" width="${r2*0.66}" height="${sw}" rx="${sw/2}" fill="${color}"/>`;
  return c+g;
}
function barrel(cx,cy,w,h,body,band,stave){
  const x=cx-w/2,y=cy-h/2;
  let s=`<path d="M ${x} ${y} Q ${cx} ${y-18} ${x+w} ${y} L ${x+w} ${y+h} Q ${cx} ${y+h+18} ${x} ${y+h} Z" fill="${body}"/>`;
  // bulge sides
  s=`<path d="M ${x+10} ${y} Q ${x-18} ${cy} ${x+10} ${y+h} L ${x+w-10} ${y+h} Q ${x+w+18} ${cy} ${x+w-10} ${y} Z" fill="${body}"/>`;
  // staves
  for(let i=1;i<5;i++){const sx=x+10+i*(w-20)/5;s+=`<line x1="${sx}" y1="${y+6}" x2="${sx}" y2="${y+h-6}" stroke="${stave}" stroke-width="4" opacity="0.5"/>`;}
  // hoops
  s+=`<rect x="${x-4}" y="${y+12}" width="${w+8}" height="14" fill="${band}"/><rect x="${x-4}" y="${y+h-26}" width="${w+8}" height="14" fill="${band}"/>`;
  s+=`<rect x="${x-12}" y="${cy-9}" width="${w+24}" height="18" fill="${band}"/>`;
  return s;
}

// ---------- 25 concepts ----------
const L=[];
const add=(name,draw)=>L.push({n:L.length+1,name,draw});

// 1 Interlock CG monogram (brass on navy, ring)
add('interlock-cg',()=>bg(C.navy)+`<circle cx="500" cy="500" r="430" fill="none" stroke="${C.brass}" stroke-width="8"/>`+monoCG(500,500,250,C.brass,72)+wordmark(500,860,'GOLF',54,C.brassL,SANS,'bold',30));
// 2 Hole-in-C (green C with flag in the gap)
add('hole-in-c',()=>bg(C.chalk)+`<path d="M 660 300 A 220 220 0 1 0 660 700" fill="none" stroke="${C.green}" stroke-width="86" stroke-linecap="round"/>`+`<ellipse cx="640" cy="640" rx="120" ry="34" fill="${C.green}" opacity="0.18"/>`+flag(620,648,210,C.ink,C.clay)+wordmark(500,860,'COOPERS GOLF',52,C.green,SERIF,'normal',8));
// 3 Block CG (slab, ink on chalk)
add('block-cg',()=>bg(C.chalk)+wordmark(500,600,'CG',440,C.ink,SERIF,'bold',-10)+`<rect x="250" y="660" width="500" height="10" fill="${C.brass}"/>`+wordmark(500,740,'COOPERS GOLF',40,C.ink,SANS,'bold',16));
// 4 Club Crest Roundel
add('club-crest-roundel',()=>bg(C.navy)+`<circle cx="500" cy="500" r="445" fill="none" stroke="${C.brass}" stroke-width="10"/><circle cx="500" cy="500" r="360" fill="none" stroke="${C.brass}" stroke-width="3"/>`+ringText(500,500,405,'COOPERS GOLF','AUSTRALIA',C.brass,52)+crossedClubs(500,470,1.05,C.cream)+`<rect x="430" y="600" width="140" height="3" fill="${C.brass}"/>`+wordmark(500,660,'EST 2026',34,C.brass,SANS,'bold',10));
// 5 Green & Flag Roundel
add('green-flag-roundel',()=>bg(C.pine)+`<circle cx="500" cy="500" r="445" fill="none" stroke="${C.cream}" stroke-width="8"/>`+ringText(500,500,405,'COOPERS GOLF CO','· AUSTRALIA ·',C.cream,50)+`<path d="M 300 600 Q 500 540 700 600 L 700 640 Q 500 590 300 640 Z" fill="${C.cream}" opacity="0.9"/>`+flag(500,604,200,C.cream,C.brass)+golfBall(560,604,16,C.cream,C.pine,0.4));
// 6 Southern Ball Roundel
add('southern-ball-roundel',()=>bg(C.navy)+`<circle cx="500" cy="500" r="445" fill="none" stroke="${C.brass}" stroke-width="9"/>`+ringText(500,500,405,'COOPERS GOLF','EST · 2026',C.brass,52)+golfBall(500,490,150,C.cream,C.navy)+southernCross(500,490,0.42,C.brass));
// 7 Heraldic Shield
add('heraldic-shield',()=>bg(C.chalk)+laurel(500,520,300,C.green,11,55)+shield(500,500,470,600,C.navy,C.brass,12)+crossedClubs(500,500,0.95,C.brass)+golfBall(500,360,52,C.cream,C.navy)+`<rect x="300" y="650" width="400" height="56" rx="6" fill="${C.brass}"/>`+wordmark(500,690,'COOPERS',40,C.navy,SERIF,'bold',8));
// 8 Flagstick Shield (minimal)
add('flagstick-shield',()=>bg(C.cream)+shield(500,490,420,540,C.green,C.green,0)+`<rect x="492" y="300" width="16" height="360" fill="${C.cream}"/>`+`<path d="M 508 312 L 620 344 L 508 376 Z" fill="${C.brass}"/>`+golfBall(500,690,30,C.cream,C.green,0.3)+wordmark(500,900,'COOPERS GOLF',46,C.green,SANS,'bold',12));
// 9 Wreath Monogram
add('wreath-cg',()=>bg(C.cream)+laurel(500,470,300,C.green,15,68)+wordmark(500,540,'CG',230,C.green,SERIF,'bold',-6)+`<rect x="360" y="600" width="280" height="3" fill="${C.brass}"/>`+wordmark(500,660,'GOLF',44,C.green,SANS,'bold',24));
// 10 Pin Lockup
add('pin-lockup',()=>bg(C.chalk)+`<ellipse cx="500" cy="420" rx="120" ry="26" fill="${C.green}" opacity="0.15"/>`+flag(500,430,230,C.ink,C.clay)+golfBall(560,430,14,C.ink,C.chalk,0.25)+wordmark(500,620,'COOPERS',104,C.ink,SERIF,'normal',10)+`<rect x="250" y="660" width="500" height="3" fill="${C.brass}"/>`+wordmark(500,728,'GOLF',40,C.brass,SANS,'bold',30));
// 11 Crossed Clubs Lockup
add('crossed-clubs-lockup',()=>bg(C.navy)+crossedClubs(500,360,1.1,C.brass)+wordmark(500,640,'COOPERS',96,C.cream,SANS,'bold',6)+wordmark(500,740,'GOLF',96,C.cream,SANS,'bold',40));
// 12 Swing Roundel (stylized golfer)
add('swing-roundel',()=>{const g=`<g transform="translate(470 360)" stroke="${C.clay}" stroke-width="26" fill="none" stroke-linecap="round"><circle cx="40" cy="-150" r="26" fill="${C.clay}" stroke="none"/><path d="M 40 -120 L 30 -30"/><path d="M 30 -60 L 110 -110"/><path d="M 30 -60 L -60 -150"/><path d="M 30 -30 L -10 70"/><path d="M 30 -30 L 80 70"/><path d="M -60 -150 L -150 -120" stroke-width="14"/></g>`;
  return bg(C.cream)+`<circle cx="500" cy="430" r="300" fill="none" stroke="${C.green}" stroke-width="12"/>`+`<path d="M 230 560 Q 500 500 770 560" stroke="${C.green}" stroke-width="14" fill="none"/>`+g+wordmark(500,830,'COOPERS GOLF',54,C.green,SERIF,'normal',8);});
// 13 Cask & Clubs
add('cask-clubs',()=>bg(C.chalk)+crossedClubs(500,470,1.0,C.navy)+barrel(500,520,300,260,C.oak,C.brass,C.ink)+wordmark(500,840,'COOPERS GOLF',56,C.navy,SERIF,'bold',8));
// 14 Barrel-Stave Ring
add('barrel-stave-ring',()=>{let staves='';const r=300;for(let i=0;i<24;i++){const a=i*15*Math.PI/180;const x=500+Math.cos(a)*r,y=500+Math.sin(a)*r;staves+=`<rect x="${x-16}" y="${y-40}" width="32" height="80" rx="6" fill="${C.oak}" transform="rotate(${i*15+90} ${x} ${y})"/>`;}
  return bg(C.ink)+`<circle cx="500" cy="500" r="350" fill="none" stroke="${C.brass}" stroke-width="16"/>`+staves+`<circle cx="500" cy="500" r="250" fill="none" stroke="${C.brass}" stroke-width="10"/>`+golfBall(500,500,140,C.cream,C.ink)+wordmark(500,520,'',1,C.ink);});
// 15 Sunrise Links
add('sunrise-links',()=>{let rays='';for(let i=0;i<9;i++){const a=(-180+i*22.5)*Math.PI/180;rays+=`<line x1="500" y1="470" x2="${500+Math.cos(a)*250}" y2="${470+Math.sin(a)*250}" stroke="${C.brass}" stroke-width="8"/>`;}
  return bg(C.navy)+`<circle cx="500" cy="470" r="430" fill="none" stroke="${C.brass}" stroke-width="8"/>`+`<clipPath id="cc15"><circle cx="500" cy="470" r="426"/></clipPath><g clip-path="url(#cc15)"><circle cx="500" cy="700" r="150" fill="${C.brass}"/>${rays}<path d="M 70 560 Q 500 470 930 560 L 930 900 L 70 900 Z" fill="${C.green}"/><path d="M 70 620 Q 500 560 930 620 L 930 900 L 70 900 Z" fill="${C.pine}"/></g>`+flag(560,640,120,C.cream,C.clay)+wordmark(500,960,'COOPERS GOLF',46,C.brass,SERIF,'normal',8);});
// 16 Coastal Dune
add('coastal-dune',()=>bg(C.navy)+`<circle cx="500" cy="460" r="360" fill="none" stroke="${C.cream}" stroke-width="6"/><clipPath id="cc16"><circle cx="500" cy="460" r="357"/></clipPath><g clip-path="url(#cc16)"><path d="M 140 640 Q 360 470 620 560 Q 800 620 860 560 L 860 820 L 140 820 Z" fill="${C.cream}"/></g>`+flag(470,610,150,C.cream,C.brass)+`<path d="M 600 360 q 18 -16 36 0 q 18 -16 36 0" stroke="${C.cream}" stroke-width="6" fill="none"/>`+wordmark(500,900,'COOPERS GOLF',48,C.cream,SERIF,'normal',8));
// 17 Eucalyptus Crest
add('eucalyptus-crest',()=>{let leaves='';for(const side of[-1,1]){for(let t=0;t<7;t++){const px=500+side*(60+t*8),py=440-t*44;leaves+=`<ellipse cx="${px}" cy="${py}" rx="13" ry="30" fill="${C.green}" transform="rotate(${side*35} ${px} ${py})"/>`;}}
  return bg(C.cream)+`<g transform="translate(500 560)"><g transform="rotate(24)"><rect x="-7" y="-230" width="14" height="230" rx="7" fill="${C.brass}"/><rect x="-26" y="-30" width="52" height="14" fill="${C.brass}"/></g><g transform="rotate(-24)"><rect x="-7" y="-230" width="14" height="230" rx="7" fill="${C.brass}"/><rect x="-26" y="-30" width="52" height="14" fill="${C.brass}"/></g></g>`+leaves+wordmark(500,760,'COOPERS GOLF',54,C.green,SERIF,'normal',8)+wordmark(500,820,'AUSTRALIA',32,C.brass,SANS,'bold',18);});
// 18 Double-O Balls
add('double-o-balls',()=>{const cy=540,size=150,adv=118;const {pos}=lettersRow(500,cy,'COOPERS',adv,size,SERIF,'bold',C.ink,[1,2]);const r=lettersRow(500,cy,'COOPERS',adv,size,SERIF,'bold',C.ink,[1,2]);let balls='';[1,2].forEach(i=>{balls+=golfBall(r.pos[i].x,cy-48,58,C.cream,C.green,0.45)+`<circle cx="${r.pos[i].x}" cy="${cy-48}" r="58" fill="none" stroke="${C.ink}" stroke-width="6"/>`;});
  return bg(C.chalk)+r.svg+balls+wordmark(500,650,'GOLF · AUSTRALIA',40,C.green,SANS,'bold',16);});
// 19 Ball on Tee C
add('ball-on-tee-c',()=>bg(C.cream)+`<path d="M 640 320 A 210 210 0 1 0 640 680" fill="none" stroke="${C.green}" stroke-width="80" stroke-linecap="round"/>`+`<path d="M 500 560 L 480 640 L 520 640 Z" fill="${C.brass}"/><rect x="470" y="628" width="60" height="12" fill="${C.brass}"/>`+golfBall(500,520,60,C.chalk,C.green,0.4)+`<circle cx="500" cy="520" r="60" fill="none" stroke="${C.green}" stroke-width="5"/>`+wordmark(500,860,'COOPERS GOLF',50,C.green,SERIF,'normal',8));
// 20 Flag-G
add('flag-g',()=>bg(C.navy)+`<path d="M 600 360 A 170 170 0 1 0 600 640" fill="none" stroke="${C.brass}" stroke-width="64" stroke-linecap="round"/><rect x="568" y="490" width="120" height="60" fill="${C.brass}"/>`+`<rect x="612" y="210" width="14" height="300" fill="${C.cream}"/><path d="M 626 220 L 740 250 L 626 280 Z" fill="${C.clay}"/>`+wordmark(500,840,'COOPERS GOLF',50,C.cream,SERIF,'normal',8));
// 21 Signature (italic serif)
add('signature',()=>bg(C.navy)+`<text x="500" y="520" font-family="${SERIF}" font-style="italic" font-size="150" fill="${C.cream}" text-anchor="middle">Coopers</text>`+`<rect x="250" y="560" width="500" height="3" fill="${C.brass}"/>`+wordmark(500,635,'GOLF',46,C.brass,SANS,'bold',30));
// 22 Condensed Stack
add('condensed-stack',()=>bg(C.ink)+`<g transform="translate(500 300) scale(1,1.55)"><text x="0" y="0" font-family="${SANS}" font-weight="bold" font-size="150" fill="${C.cream}" text-anchor="middle" letter-spacing="2">COOPERS</text></g>`+`<g transform="translate(500 470) scale(1,1.55)"><text x="0" y="0" font-family="${SANS}" font-weight="bold" font-size="150" fill="${C.brass}" text-anchor="middle" letter-spacing="40">GOLF</text></g>`+wordmark(500,720,'AUSTRALIA’S BEST',34,C.cream,SANS,'bold',14));
// 23 Engraved Club
add('engraved-club',()=>bg(C.navy)+`<rect x="170" y="420" width="660" height="5" fill="${C.brass}"/><rect x="170" y="432" width="660" height="2" fill="${C.brass}"/><rect x="170" y="566" width="660" height="2" fill="${C.brass}"/><rect x="170" y="575" width="660" height="5" fill="${C.brass}"/>`+wordmark(500,530,'COOPERS GOLF',74,C.cream,SERIF,'normal',6)+wordmark(500,650,'AUSTRALIA · EST 2026',30,C.brassL,SANS,'bold',14));
// 24 Pineapple Ball (playful)
add('pineapple-ball',()=>{let crown='';for(let i=-3;i<=3;i++){const lx=500+i*30;const hh=200-Math.abs(i)*22;crown+=`<path d="M ${lx} 330 L ${lx-15} ${330-hh*0.5} L ${lx} ${330-hh} L ${lx+15} ${330-hh*0.5} Z" fill="${C.green}"/>`;}
  let net='';for(let i=-4;i<=4;i++){net+=`<line x1="${500+i*44}" y1="330" x2="${500+i*44+90}" y2="740" stroke="${C.navy}" stroke-width="4" opacity="0.6"/><line x1="${500+i*44}" y1="330" x2="${500+i*44-90}" y2="740" stroke="${C.navy}" stroke-width="4" opacity="0.6"/>`;}
  return bg(C.navy)+`<circle cx="500" cy="520" r="300" fill="none" stroke="${C.brass}" stroke-width="10"/><clipPath id="cc24"><ellipse cx="500" cy="530" rx="190" ry="215"/></clipPath>`+`<ellipse cx="500" cy="530" rx="190" ry="215" fill="${C.cream}"/><g clip-path="url(#cc24)">${net}</g><ellipse cx="500" cy="530" rx="190" ry="215" fill="none" stroke="${C.brass}" stroke-width="6"/>`+crown+wordmark(500,880,'COOPERS GOLF',48,C.brass,SANS,'bold',10);});
// 25 Roo Swing (kangaroo silhouette + roundel)
add('roo-swing',()=>{const roo=`<g transform="translate(440 540)" fill="${C.cream}"><path d="M 0 0 q -40 -30 -30 -90 q 5 -40 35 -55 q -10 -25 6 -45 q 18 -20 40 -6 q 20 -16 30 6 q 8 18 -6 32 q 30 18 30 60 l 40 -10 q 30 50 -6 70 q -30 16 -60 -4 l 10 70 l 30 60 l -34 0 l -34 -70 l -40 60 l 40 60 l -34 0 l -44 -64 q -10 -20 6 -44 Z"/></g>`;
  return bg(C.green)+`<circle cx="500" cy="500" r="445" fill="none" stroke="${C.cream}" stroke-width="9"/>`+ringText(500,500,405,'COOPERS GOLF','AUSTRALIA',C.cream,52)+roo+`<rect x="560" y="360" width="10" height="150" fill="${C.brass}"/><path d="M 570 366 L 650 388 L 570 410 Z" fill="${C.brass}"/>`;});

// ---------- render ----------
function svgDoc(inner){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${inner}</svg>`;}
const num=n=>String(n).padStart(2,'0');
L.forEach(l=>{
  const doc=svgDoc(l.draw());
  fs.writeFileSync(path.join(SVGDIR,`${num(l.n)}-${l.name}.svg`),doc);
  const png=new Resvg(doc,{font:{loadSystemFonts:true},fitTo:{mode:'width',value:900}}).render().asPng();
  fs.writeFileSync(path.join(PNGDIR,`${num(l.n)}-${l.name}.png`),png);
});

// contact sheet 5x5 with labels
const cols=5,rows=5,cw=560,ch=600,pad=0;
let cells='';
L.forEach((l,idx)=>{const cx=(idx%cols)*cw,cy=Math.floor(idx/cols)*ch;
  cells+=`<g transform="translate(${cx} ${cy})"><rect width="${cw}" height="${ch}" fill="#ffffff"/><svg x="20" y="20" width="520" height="520" viewBox="0 0 1000 1000">${l.draw()}</svg>`+
  `<text x="${cw/2}" y="565" font-family="${SANS}" font-weight="bold" font-size="22" fill="#222" text-anchor="middle">${num(l.n)} · ${l.name.replace(/-/g,' ').toUpperCase()}</text></g>`;
});
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols*cw} ${rows*ch}"><rect width="${cols*cw}" height="${rows*ch}" fill="#cfcfcf"/>${cells}</svg>`;
fs.writeFileSync(path.join(PNGDIR,'_contact-sheet.png'),new Resvg(sheet,{font:{loadSystemFonts:true},fitTo:{mode:'width',value:2600}}).render().asPng());
console.log('rendered',L.length,'logos + contact sheet');
