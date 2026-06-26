const {Resvg}=require('@resvg/resvg-js');const fs=require('fs');const path=require('path');
const OUT='/home/user/claude_skills/coopers-golf';const FONTS=path.join(__dirname,'fonts');
const DIR=path.join(OUT,'renders-c10'),SV=path.join(OUT,'svg-c10');
fs.mkdirSync(DIR,{recursive:true});fs.mkdirSync(SV,{recursive:true});
const ink='#0E0E10',white='#FFFFFF';const A='Archivo';
const R=(svg,w)=>new Resvg(svg,{font:{fontDirs:[FONTS],loadSystemFonts:true},fitTo:{mode:'width',value:w}}).render().asPng();
const rad=d=>d*Math.PI/180;
function taperedArc(fg,cx,cy,Rc,a0,a1,w0,w1,rs,re){const N=80;let o=[],ii=[];
  for(let i=0;i<=N;i++){const t=i/N;const a=rad(a0+(a1-a0)*t);const w=w0+(w1-w0)*t;
    o.push([cx+(Rc+w)*Math.cos(a),cy+(Rc+w)*Math.sin(a)]);ii.push([cx+(Rc-w)*Math.cos(a),cy+(Rc-w)*Math.sin(a)]);}
  let d='M '+o[0].map(n=>n.toFixed(1)).join(' ');for(let i=1;i<=N;i++)d+=' L '+o[i].map(n=>n.toFixed(1)).join(' ');
  for(let i=N;i>=0;i--)d+=' L '+ii[i].map(n=>n.toFixed(1)).join(' ');d+=' Z';let caps='';
  if(rs)caps+=`<circle cx="${(cx+Rc*Math.cos(rad(a0))).toFixed(1)}" cy="${(cy+Rc*Math.sin(rad(a0))).toFixed(1)}" r="${w0}" fill="${fg}"/>`;
  if(re)caps+=`<circle cx="${(cx+Rc*Math.cos(rad(a1))).toFixed(1)}" cy="${(cy+Rc*Math.sin(rad(a1))).toFixed(1)}" r="${w1}" fill="${fg}"/>`;
  return `<path d="${d}" fill="${fg}"/>${caps}`;}
const tip=(cx,cy,Rc,a)=>[cx+Rc*Math.cos(rad(a)),cy+Rc*Math.sin(rad(a))];
const ball=(fg,x,y,r)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fg}"/>`;
function dball(fg,bg,x,y,r){let d='';const st=r/2.4;for(let i=-r;i<=r;i+=st)for(let j=-r;j<=r;j+=st){if(i*i+j*j<(r-r*0.18)*(r-r*0.18))d+=`<circle cx="${(x+i).toFixed(1)}" cy="${(y+j).toFixed(1)}" r="${(r/9).toFixed(1)}" fill="${bg}"/>`;}return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fg}"/>${d}`;}
const motion=(fg,x,y,w,n=2)=>{let s='<g stroke="'+fg+'" stroke-width="11" stroke-linecap="round">';for(let i=0;i<n;i++)s+=`<line x1="${x+i*8}" y1="${y+i*26}" x2="${x+w-i*16}" y2="${y+i*26-7}"/>`;return s+'</g>';};
const tee=(fg,cx,cy,s)=>`<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M -40 -34 L 40 -34 L 14 26 L 7 104 L -7 104 L -14 26 Z" fill="${fg}"/></g>`;
function clubhead(fg,x,y,ang){return `<g transform="translate(${x} ${y}) rotate(${ang})"><rect x="-20" y="-26" width="120" height="56" rx="26" fill="${fg}"/></g>`;}
const CX=480,CY=500,RC=235,A0=312,A1=48;

const L=[];const add=(name,fn)=>L.push({n:L.length+1,name,fn});
// 1 launch (primary)
add('launch',fg=>{const t=tip(CX,CY,RC,A0);return taperedArc(fg,CX,CY,RC,A0,A1,14,74,false,true)+ball(fg,t[0]+72,t[1]-66,50)+motion(fg,t[0]-26,t[1]-150,92);});
// 2 sharp swoosh
add('sharp',fg=>{const t=tip(CX,CY,RC,306);return taperedArc(fg,CX,CY,RC,306,58,10,68,false,true)+ball(fg,t[0]+98,t[1]-92,48);});
// 3 impact (ball at bottom tip)
add('impact',fg=>{const t=tip(CX,CY,RC,A1);return taperedArc(fg,CX,CY,RC,A0,A1,74,16,true,false)+ball(fg,t[0]+62,t[1]+42,50);});
// 4 clean uniform + ball top (quiet)
add('clean',fg=>{const t=tip(CX,CY,RC,A0);return taperedArc(fg,CX,CY,RC,A0,A1,60,60,true,true)+ball(fg,t[0]+80,t[1]-72,52);});
// 5 clubhead terminal at bottom
add('clubhead',fg=>{const t=tip(CX,CY,RC,A0);const b=tip(CX,CY,RC,A1);return taperedArc(fg,CX,CY,RC,A0,A1,40,58,true,false)+clubhead(fg,b[0]-10,b[1]+6,28)+ball(fg,t[0]+78,t[1]-70,48);});
// 6 dimpled launching ball
add('dimpled',fg=>{const t=tip(CX,CY,RC,A0);return taperedArc(fg,CX,CY,RC,A0,A1,14,74,false,true)+dball(fg,white,t[0]+74,t[1]-68,56)+motion(fg,t[0]-22,t[1]-156,92);});
// 7 flight trail (3 balls)
add('trail',fg=>{const t=tip(CX,CY,RC,A0);return taperedArc(fg,CX,CY,RC,A0,A1,14,74,false,true)+ball(fg,t[0]+60,t[1]-52,50)+ball(fg,t[0]+150,t[1]-118,30)+ball(fg,t[0]+218,t[1]-170,18);});
// 8 flat launch (long low trajectory)
add('flat-launch',fg=>{const t=tip(CX,CY,RC,A0);return taperedArc(fg,CX,CY,RC,A0,A1,16,72,false,true)+ball(fg,t[0]+96,t[1]-30,48)+motion(fg,t[0]+30,t[1]-92,150,3);});
// 9 steep/open swoosh C
add('steep',fg=>{const t=tip(CX,CY,RC,300);return taperedArc(fg,CX,CY,RC,300,40,12,70,false,true)+ball(fg,t[0]+86,t[1]-84,50)+motion(fg,t[0]-6,t[1]-160,90);});
// 10 ball nestled at the mouth/opening
add('mouth',fg=>taperedArc(fg,CX,CY,RC,A0,A1,66,66,true,true)+ball(fg,CX+RC+6,CY,58)+motion(fg,CX+RC+70,CY-40,80));

const doc=i=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${i}</svg>`;
const num=n=>String(n).padStart(2,'0');
L.forEach(l=>{const inner=`<rect width="1000" height="1000" fill="${white}"/>${l.fn(ink)}`;
 fs.writeFileSync(path.join(SV,`${num(l.n)}-${l.name}.svg`),doc(inner));
 fs.writeFileSync(path.join(DIR,`${num(l.n)}-${l.name}.png`),R(doc(inner),900));
 // reversed
 fs.writeFileSync(path.join(DIR,`${num(l.n)}-${l.name}-rev.png`),R(doc(`<rect width="1000" height="1000" fill="${ink}"/>${l.fn(white)}`),900));});
// contact sheet 5x2 with small legibility test
const cols=5,rows=2,cw=440,ch=480;let cells='';
L.forEach((l,idx)=>{const x=(idx%cols)*cw,y=Math.floor(idx/cols)*ch;
 cells+=`<g transform="translate(${x} ${y})"><rect width="${cw}" height="${ch}" fill="#fff" stroke="#e3e3e3"/><svg x="40" y="20" width="330" height="330" viewBox="0 0 1000 1000">${l.fn(ink)}</svg><svg x="330" y="250" width="90" height="90" viewBox="0 0 1000 1000">${l.fn(ink)}</svg><text x="${cw/2}" y="445" font-family="${A}" font-weight="800" font-size="24" fill="#222" text-anchor="middle">${num(l.n)}  ${l.name.toUpperCase()}</text></g>`;});
fs.writeFileSync(path.join(DIR,'_c-swing-10.png'),R(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols*cw} ${rows*ch}"><rect width="${cols*cw}" height="${rows*ch}" fill="#d7d7d7"/>${cells}</svg>`,2200));
console.log('rendered',L.length,'C-swing variations');
