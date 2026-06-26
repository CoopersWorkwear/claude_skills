const {Resvg}=require('@resvg/resvg-js');const fs=require('fs');const path=require('path');
const OUT='/home/user/claude_skills/coopers-golf';const FONTS=path.join(__dirname,'fonts');
const DIR=path.join(OUT,'renders-50'),SV=path.join(OUT,'svg-50');
fs.mkdirSync(DIR,{recursive:true});fs.mkdirSync(SV,{recursive:true});
const ink='#0E0E10',white='#FFFFFF';const A='Archivo';
const R=(svg,w)=>new Resvg(svg,{font:{fontDirs:[FONTS],loadSystemFonts:true},fitTo:{mode:'width',value:w}}).render().asPng();
const C=(a)=>Math.cos(a*Math.PI/180),S=(a)=>Math.sin(a*Math.PI/180);

// ---------- components ----------
function swoosh(fg,cx=500,cy=470,s=1){return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-500 -470)"><path d="M 120 660 C 380 790 700 760 900 200 C 740 480 470 600 320 552 C 250 530 175 580 120 660 Z" fill="${fg}"/></g>`;}
function swooshBall(fg,cx=500,cy=470,s=1){return swoosh(fg,cx,cy,s)+`<circle cx="${cx+368*s}" cy="${cy-274*s}" r="${60*s}" fill="${fg}"/>`;}
function swooshSteep(fg,cx=500,cy=480,s=1){return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-500 -480)"><path d="M 180 720 C 360 760 640 700 820 160 C 720 470 470 580 360 600 C 290 612 220 660 180 720 Z" fill="${fg}"/><circle cx="800" cy="150" r="56" fill="${fg}"/></g>`;}
function dblSwoosh(fg,cx=500,cy=480,s=1){return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-500 -480)"><path d="M 150 560 C 360 660 660 640 880 200 C 720 430 470 520 320 470 C 255 450 195 490 150 560 Z" fill="${fg}"/><path d="M 200 720 C 380 800 640 780 840 420" fill="none" stroke="${fg}" stroke-width="34" stroke-linecap="round"/></g>`;}
function cArc(fg,cx=500,cy=470,r=230,sw=92){return `<path d="M ${cx+r*0.62} ${cy-r*0.78} A ${r} ${r} 0 1 0 ${cx+r*0.62} ${cy+r*0.78}" fill="none" stroke="${fg}" stroke-width="${sw}" stroke-linecap="round"/>`;}
function cSwoosh(fg){return `<path d="M 660 320 A 235 235 0 1 0 470 720 C 660 786 850 716 905 470 C 815 612 612 632 524 566 A 158 158 0 1 1 660 384 Z" fill="${fg}"/>`;}
function ball(fg,cx,cy,r){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fg}"/>`;}
function ballRing(fg,cx,cy,r){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fg}" stroke-width="${r*0.22}"/>`;}
function tee(fg,cx,cy,s=1){return `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M -46 -40 L 46 -40 L 16 30 L 8 120 L -8 120 L -16 30 Z" fill="${fg}"/></g>`;}
function flag(fg,cx,cy,h){return `<rect x="${cx-5}" y="${cy-h}" width="10" height="${h}" rx="5" fill="${fg}"/><path d="M ${cx} ${cy-h+4} L ${cx+96} ${cy-h+32} L ${cx} ${cy-h+60} Z" fill="${fg}"/>`;}
function motion(fg,x,y,w){return `<g stroke="${fg}" stroke-width="${w*0.22}" stroke-linecap="round"><line x1="${x}" y1="${y}" x2="${x+w}" y2="${y}"/><line x1="${x+10}" y1="${y+w*0.5}" x2="${x+w*0.8}" y2="${y+w*0.5}"/><line x1="${x}" y1="${y+w}" x2="${x+w}" y2="${y+w}"/></g>`;}
function cg(fg,cx=500,cy=470,size=300,ls=-30){return `<text x="${cx}" y="${cy+size*0.34}" font-family="${A}" font-weight="900" font-size="${size}" fill="${fg}" text-anchor="middle" letter-spacing="${ls}">CG</text>`;}
function cgOutline(fg,cx,cy,size,ls){return `<text x="${cx}" y="${cy+size*0.34}" font-family="${A}" font-weight="900" font-size="${size}" fill="none" stroke="${fg}" stroke-width="9" text-anchor="middle" letter-spacing="${ls}">CG</text>`;}
function circ(fg,cx,cy,r,sw){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fg}" stroke-width="${sw}"/>`;}
function disc(fg,cx,cy,r){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fg}"/>`;}
function rsq(fg,cx,cy,s,rad,sw){return `<rect x="${cx-s/2}" y="${cy-s/2}" width="${s}" height="${s}" rx="${rad}" fill="none" stroke="${fg}" stroke-width="${sw}"/>`;}
function shield(fg,cx,cy,w,h,sw,fill='none'){const x=cx-w/2,y=cy-h/2;return `<path d="M ${x} ${y} L ${x+w} ${y} L ${x+w} ${y+h*0.52} Q ${x+w} ${y+h*0.88} ${cx} ${y+h} Q ${x} ${y+h*0.88} ${x} ${y+h*0.52} Z" fill="${fill}" stroke="${fg}" stroke-width="${sw}"/>`;}
function hexa(fg,cx,cy,r,sw,fill='none'){let p='';for(let i=0;i<6;i++){const a=i*60-90;p+=`${cx+r*C(a)},${cy+r*S(a)} `;}return `<polygon points="${p}" fill="${fill}" stroke="${fg}" stroke-width="${sw}"/>`;}
function pill(fg,cx,cy,w,h,sw,fill='none'){return `<rect x="${cx-w/2}" y="${cy-h/2}" width="${w}" height="${h}" rx="${h/2}" fill="${fill}" stroke="${fg}" stroke-width="${sw}"/>`;}
function wstack(fg,cx,cy,size,ls2){return `<text x="${cx}" y="${cy}" font-family="${A}" font-weight="900" font-size="${size}" fill="${fg}" text-anchor="middle">COOPERS</text><text x="${cx}" y="${cy+size*0.92}" font-family="${A}" font-weight="900" font-size="${size}" fill="${fg}" text-anchor="middle" letter-spacing="${ls2}">GOLF</text>`;}
function whoriz(fg,cx,cy,size){return `<text x="${cx}" y="${cy}" font-family="${A}" font-weight="900" font-size="${size}" fill="${fg}" text-anchor="middle" letter-spacing="-1">COOPERS GOLF</text>`;}
function ringText(p,cx,cy,r,top,bot,fg,size){const a=`r${p}t`,b=`r${p}b`;let s=`<defs><path id="${a}" d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}"/><path id="${b}" d="M ${cx-r} ${cy} A ${r} ${r} 0 0 0 ${cx+r} ${cy}"/></defs>`;if(top)s+=`<text font-family="${A}" font-weight="800" font-size="${size}" fill="${fg}" letter-spacing="6" text-anchor="middle"><textPath href="#${a}" startOffset="50%">${top}</textPath></text>`;if(bot)s+=`<text font-family="${A}" font-weight="800" font-size="${size}" fill="${fg}" letter-spacing="6" text-anchor="middle"><textPath href="#${b}" startOffset="50%">${bot}</textPath></text>`;return s;}

// ---------- 50 concepts: draw(fg) ----------
const L=[];const add=(name,draw,dark=false)=>L.push({n:L.length+1,name,draw,dark});
// swoosh family
add('swoosh',fg=>swoosh(fg,500,500,0.95));
add('swoosh-ball',fg=>swooshBall(fg,500,500,0.92));
add('swoosh-steep',fg=>swooshSteep(fg,500,500,0.95));
add('swoosh-double',fg=>dblSwoosh(fg,500,500,0.95));
add('swoosh-circle',fg=>circ(fg,500,480,300,16)+swoosh(fg,500,470,0.5));
add('swoosh-ball-circle',fg=>circ(fg,500,480,300,16)+swooshBall(fg,500,470,0.46));
add('swoosh-rsq',fg=>rsq(fg,500,480,560,90,16)+swoosh(fg,500,470,0.5));
add('swoosh-disc',fg=>disc(fg,500,480,300)+swooshBall(white==fg?ink:white,500,470,0.46),true);
add('swoosh-mirror',fg=>`<g transform="translate(1000 0) scale(-1 1)">${swooshBall(fg,500,500,0.9)}</g>`);
add('swoosh-pill',fg=>pill(fg,500,480,640,300,16)+swoosh(fg,500,470,0.5));
// C-swoosh family
add('c-swoosh',fg=>cSwoosh(fg));
add('c-swoosh-circle',fg=>circ(fg,500,500,310,16)+`<g transform="translate(500 500) scale(0.62) translate(-500 -500)">${cSwoosh(fg)}</g>`);
add('c-arc-tail',fg=>cArc(fg,470,480,210,86)+swoosh(fg,640,470,0.42));
add('c-ball',fg=>cArc(fg,500,480,220,92)+ball(fg,500,480,70));
add('c-ball-tee',fg=>cArc(fg,500,440,210,84)+ball(fg,500,430,64)+tee(fg,500,560,1.1));
add('c-motion',fg=>cArc(fg,560,480,210,90)+motion(fg,150,420,150));
// CG monogram family
add('cg-tight',fg=>cg(fg,500,470,330,-40));
add('cg-circle',fg=>circ(fg,500,470,330,16)+cg(fg,500,440,300,-44));
add('cg-disc',fg=>disc(fg,500,470,330)+cg(fg==white?ink:white==fg?ink:ink,500,440,300,-44),true);
add('cg-rsq',fg=>rsq(fg,500,470,600,110,16)+cg(fg,500,440,300,-44));
add('cg-shield',fg=>shield(fg,500,480,440,560,14)+cg(fg,500,420,250,-40));
add('cg-hexa',fg=>hexa(fg,500,480,330,16)+cg(fg,500,440,280,-44));
add('cg-outline',fg=>cgOutline(fg,500,470,330,-40));
add('cg-stack',fg=>`<text x="500" y="430" font-family="${A}" font-weight="900" font-size="300" fill="${fg}" text-anchor="middle">C</text><text x="500" y="720" font-family="${A}" font-weight="900" font-size="300" fill="${fg}" text-anchor="middle">G</text>`);
add('cg-swoosh-thru',fg=>cg(fg,500,440,300,-40)+swoosh(fg,500,640,0.4));
add('cg-ball-counter',fg=>cArc(fg,430,470,180,76)+ball(fg,430,470,52)+`<text x="640" y="560" font-family="${A}" font-weight="900" font-size="300" fill="${fg}" text-anchor="middle">G</text>`);
add('cg-pill',fg=>pill(fg,500,470,680,300,16)+cg(fg,500,440,260,-40));
add('cg-badge-line',fg=>circ(fg,500,470,330,10)+circ(fg,500,470,300,4)+cg(fg,500,440,260,-44));
// wordmark family
add('word-stack',fg=>wstack(fg,500,440,150,44));
add('word-horiz',fg=>whoriz(fg,500,510,118));
add('word-underline',fg=>whoriz(fg,500,470,120)+swoosh(fg,500,600,0.42));
add('word-over',fg=>swoosh(fg,500,360,0.42)+whoriz(fg,500,560,118));
add('word-stack-rule',fg=>wstack(fg,500,420,150,44)+`<rect x="300" y="660" width="400" height="6" fill="${fg}"/><text x="500" y="730" font-family="${A}" font-weight="700" font-size="34" fill="${fg}" text-anchor="middle" letter-spacing="14">AUSTRALIA’S BEST</text>`);
add('word-condensed',fg=>`<g transform="translate(500 360) scale(0.86 1.5)"><text x="0" y="0" font-family="${A}" font-weight="900" font-size="150" fill="${fg}" text-anchor="middle">COOPERS</text></g><g transform="translate(500 520) scale(0.86 1.5)"><text x="0" y="0" font-family="${A}" font-weight="900" font-size="150" fill="${fg}" text-anchor="middle" letter-spacing="40">GOLF</text></g>`);
add('word-bar',fg=>`<rect x="120" y="420" width="760" height="160" fill="${fg}"/><text x="500" y="535" font-family="${A}" font-weight="900" font-size="110" fill="${fg==white?ink:white}" text-anchor="middle">COOPERS GOLF</text>`,true);
add('lockup-horizontal',fg=>circ(fg,300,470,150,12)+cg(fg,300,452,150,-22)+`<text x="500" y="452" font-family="${A}" font-weight="900" font-size="92" fill="${fg}" text-anchor="start">COOPERS</text><text x="500" y="548" font-family="${A}" font-weight="900" font-size="92" fill="${fg}" text-anchor="start" letter-spacing="38">GOLF</text>`);
add('word-swoosh-tail',fg=>whoriz(fg,470,500,120)+swoosh(fg,760,440,0.34));
add('word-vert',fg=>`<g transform="translate(470 500) rotate(-90)"><text x="0" y="0" font-family="${A}" font-weight="900" font-size="120" fill="${fg}" text-anchor="middle">COOPERS</text></g><g transform="translate(580 500) rotate(-90)"><text x="0" y="0" font-family="${A}" font-weight="900" font-size="120" fill="${fg}" text-anchor="middle" letter-spacing="20">GOLF</text></g>`);
// ball / tee / flag / abstract
add('ball-motion',fg=>ball(fg,560,480,150)+motion(fg,150,400,150));
add('ball-tee',fg=>tee(fg,500,640,1.7)+ball(fg,500,420,130));
add('flag-min',fg=>flag(fg,440,640,330)+ball(fg,470,650,30));
add('ball-swoosh-circle',fg=>circ(fg,500,480,300,16)+swoosh(fg,470,470,0.4)+ball(fg,640,360,40));
add('tee-swoosh',fg=>tee(fg,420,560,1.4)+swoosh(fg,600,440,0.4));
add('arc-ball',fg=>`<path d="M 200 680 Q 500 240 840 560" fill="none" stroke="${fg}" stroke-width="34" stroke-linecap="round"/>`+ball(fg,840,560,58));
add('ball-split',fg=>`<clipPath id="bs"><circle cx="500" cy="480" r="220"/></clipPath><circle cx="500" cy="480" r="220" fill="none" stroke="${fg}" stroke-width="14"/><g clip-path="url(#bs)"><path d="M 280 480 A 220 220 0 0 1 720 480 Z" fill="${fg}"/></g>`);
add('swing-arc-flag',fg=>`<path d="M 200 700 Q 460 300 720 520" fill="none" stroke="${fg}" stroke-width="30" stroke-linecap="round"/>`+flag(fg,720,520,150));
// badges / emblems
add('badge-swoosh',fg=>circ(fg,500,500,445,12)+ringText('a',500,500,400,'COOPERS GOLF','AUSTRALIA',fg,52)+swoosh(fg,500,500,0.5));
add('badge-cg',fg=>circ(fg,500,500,445,12)+circ(fg,500,500,360,4)+ringText('b',500,500,405,'COOPERS GOLF','EST 2026',fg,52)+cg(fg,500,470,210,-30));
add('badge-shield-cg',fg=>shield(fg,500,500,470,600,12)+cg(fg,500,450,230,-38)+swoosh(fg,500,640,0.34));
add('primary-lockup',fg=>swooshBall(fg,500,300,0.5)+wstack(fg,500,520,140,40)+`<rect x="310" y="650" width="380" height="6" fill="${fg}"/><text x="500" y="712" font-family="${A}" font-weight="700" font-size="32" fill="${fg}" text-anchor="middle" letter-spacing="13">AUSTRALIA’S BEST</text>`);

// ---------- render ----------
const doc=i=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${i}</svg>`;
const num=n=>String(n).padStart(2,'0');
L.forEach(l=>{const fg=l.dark?white:ink;const bg=l.dark?ink:white;const inner=`<rect width="1000" height="1000" fill="${bg}"/>${l.draw(fg)}`;
 fs.writeFileSync(path.join(SV,`${num(l.n)}-${l.name}.svg`),doc(inner));
 fs.writeFileSync(path.join(DIR,`${num(l.n)}-${l.name}.png`),R(doc(inner),800));});
// contact sheet 5 x 10
const cols=5,rows=10,cw=440,ch=470;let cells='';
L.forEach((l,idx)=>{const x=(idx%cols)*cw,y=Math.floor(idx/cols)*ch;const fg=l.dark?white:ink;const bg=l.dark?ink:white;
 cells+=`<g transform="translate(${x} ${y})"><rect width="${cw}" height="${ch}" fill="${bg}" stroke="#e3e3e3"/><svg x="40" y="20" width="360" height="360" viewBox="0 0 1000 1000">${l.draw(fg)}</svg><text x="${cw/2}" y="440" font-family="${A}" font-weight="700" font-size="22" fill="${l.dark?white:'#222'}" text-anchor="middle" letter-spacing="1">${num(l.n)}  ${l.name.replace(/-/g,' ').toUpperCase()}</text></g>`;});
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols*cw} ${rows*ch}"><rect width="${cols*cw}" height="${rows*ch}" fill="#d7d7d7"/>${cells}</svg>`;
fs.writeFileSync(path.join(DIR,'_contact-sheet-50.png'),R(sheet,2400));
console.log('rendered',L.length,'concepts');
