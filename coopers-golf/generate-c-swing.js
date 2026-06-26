const {Resvg}=require('@resvg/resvg-js');const fs=require('fs');const path=require('path');
const OUT='/home/user/claude_skills/coopers-golf';const FONTS=path.join(__dirname,'fonts');
const DIR=path.join(OUT,'renders-athletic'),SV=path.join(OUT,'svg-athletic');
const ink='#0E0E10',white='#FFFFFF',bone='#F4F1EA',grey='#8E8E93';const A='Archivo';
const R=(svg,w)=>new Resvg(svg,{font:{fontDirs:[FONTS],loadSystemFonts:true},fitTo:{mode:'width',value:w}}).render().asPng();
const rad=d=>d*Math.PI/180;
function taperedArc(fg,cx,cy,Rc,a0,a1,w0,w1,roundStart,roundEnd){const N=80;let o=[],ii=[];
  for(let i=0;i<=N;i++){const t=i/N;const a=rad(a0+(a1-a0)*t);const w=w0+(w1-w0)*t;
    o.push([cx+(Rc+w)*Math.cos(a),cy+(Rc+w)*Math.sin(a)]);ii.push([cx+(Rc-w)*Math.cos(a),cy+(Rc-w)*Math.sin(a)]);}
  let d='M '+o[0].map(n=>n.toFixed(1)).join(' ');for(let i=1;i<=N;i++)d+=' L '+o[i].map(n=>n.toFixed(1)).join(' ');
  for(let i=N;i>=0;i--)d+=' L '+ii[i].map(n=>n.toFixed(1)).join(' ');d+=' Z';let caps='';
  if(roundStart)caps+=`<circle cx="${(cx+Rc*Math.cos(rad(a0))).toFixed(1)}" cy="${(cy+Rc*Math.sin(rad(a0))).toFixed(1)}" r="${w0}" fill="${fg}"/>`;
  if(roundEnd)caps+=`<circle cx="${(cx+Rc*Math.cos(rad(a1))).toFixed(1)}" cy="${(cy+Rc*Math.sin(rad(a1))).toFixed(1)}" r="${w1}" fill="${fg}"/>`;
  return `<path d="${d}" fill="${fg}"/>${caps}`;}
const tip=(cx,cy,Rc,a)=>[cx+Rc*Math.cos(rad(a)),cy+Rc*Math.sin(rad(a))];
const ball=(fg,x,y,r)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fg}"/>`;
const motion=(fg,x,y,w)=>`<g stroke="${fg}" stroke-width="11" stroke-linecap="round"><line x1="${x}" y1="${y}" x2="${x+w}" y2="${y-7}"/><line x1="${x+8}" y1="${y+28}" x2="${x+w*0.8}" y2="${y+21}"/></g>`;
const tee=(fg,cx,cy,s)=>`<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M -40 -34 L 40 -34 L 14 26 L 7 104 L -7 104 L -14 26 Z" fill="${fg}"/></g>`;

// primary C-swing (C1): bold C, thin->thick, ball launching off top tip + motion
function cSwing(fg,tx=500,ty=500,s=1){const CX=480,CY=500,RC=235,A0=312,A1=48;const t=tip(CX,CY,RC,A0);
  const inner=taperedArc(fg,CX,CY,RC,A0,A1,14,74,false,true)+ball(fg,t[0]+72,t[1]-66,50)+motion(fg,t[0]-26,t[1]-150,92);
  return `<g transform="translate(${tx} ${ty}) scale(${s}) translate(${-CX} ${-CY})">${inner}</g>`;}
// alt C-swing (C4): sharper swoosh taper, detached ball
function cSwingAlt(fg,tx=500,ty=500,s=1){const CX=480,CY=500,RC=235,A0=306,A1=58;const t=tip(CX,CY,RC,A0);
  const inner=taperedArc(fg,CX,CY,RC,A0,A1,10,68,false,true)+ball(fg,t[0]+98,t[1]-92,48);
  return `<g transform="translate(${tx} ${ty}) scale(${s}) translate(${-CX} ${-CY})">${inner}</g>`;}
function wstack(fg,cx,cy,size,ls2){return `<text x="${cx}" y="${cy}" font-family="${A}" font-weight="900" font-size="${size}" fill="${fg}" text-anchor="middle">COOPERS</text><text x="${cx}" y="${cy+size*0.92}" font-family="${A}" font-weight="900" font-size="${size}" fill="${fg}" text-anchor="middle" letter-spacing="${ls2}">GOLF</text>`;}

const doc=i=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${i}</svg>`;
// individual marks
const marks={
 'c-swing-mark':`<rect width="1000" height="1000" fill="${white}"/>${cSwing(ink,500,500,0.95)}`,
 'c-swing-mark-reversed':`<rect width="1000" height="1000" fill="${ink}"/>${cSwing(white,500,500,0.95)}`,
 'c-swing-alt':`<rect width="1000" height="1000" fill="${white}"/>${cSwingAlt(ink,500,500,0.95)}`,
 'c-swing-lockup':`<rect width="1000" height="1000" fill="${ink}"/>${cSwing(white,500,330,0.6)}${wstack(white,500,640,140,40)}<rect x="312" y="770" width="376" height="6" fill="${white}"/><text x="500" y="828" font-family="${A}" font-weight="700" font-size="32" fill="${grey}" text-anchor="middle" letter-spacing="13">AUSTRALIA’S BEST</text>`,
};
Object.entries(marks).forEach(([k,v])=>{fs.writeFileSync(path.join(SV,k+'.svg'),doc(v));fs.writeFileSync(path.join(DIR,k+'.png'),R(doc(v),1000));});

// presentation board
const Wd=1600;
const hero=`<rect width="${Wd}" height="660" fill="${ink}"/><svg x="${Wd/2-330}" y="20" width="660" height="660" viewBox="0 0 1000 1000">${cSwing(white,500,330,0.62)}${wstack(white,500,650,140,40)}<rect x="312" y="780" width="376" height="6" fill="${white}"/><text x="500" y="838" font-family="${A}" font-weight="700" font-size="32" fill="${grey}" text-anchor="middle" letter-spacing="13">AUSTRALIA’S BEST</text></svg>`;
const detail=`<g transform="translate(0 660)"><rect width="${Wd}" height="560" fill="${white}"/>`+
 `<svg x="80" y="40" width="480" height="480" viewBox="0 0 1000 1000">${cSwing(ink,500,500,0.92)}</svg>`+
 `<text x="320" y="540" font-family="${A}" font-weight="800" font-size="26" fill="#222" text-anchor="middle">PRIMARY — C-SWING</text>`+
 `<svg x="600" y="40" width="480" height="480" viewBox="0 0 1000 1000">${cSwingAlt(ink,500,500,0.92)}</svg>`+
 `<text x="840" y="540" font-family="${A}" font-weight="800" font-size="26" fill="#222" text-anchor="middle">ALT — SHARP SWOOSH</text>`+
 // legibility tests, small
 `<svg x="1190" y="70" width="180" height="180" viewBox="0 0 1000 1000">${cSwing(ink,500,500,0.92)}</svg>`+
 `<svg x="1330" y="120" width="110" height="110" viewBox="0 0 1000 1000">${cSwing(ink,500,500,0.92)}</svg>`+
 `<svg x="1430" y="150" width="70" height="70" viewBox="0 0 1000 1000">${cSwing(ink,500,500,0.92)}</svg>`+
 `<text x="1300" y="320" font-family="${A}" font-weight="800" font-size="24" fill="#222" text-anchor="middle">SCALES DOWN</text>`+
 `<g transform="translate(1190 360)"><rect width="320" height="150" rx="12" fill="${ink}"/><svg x="20" y="15" width="120" height="120" viewBox="0 0 1000 1000">${cSwing(white,500,500,0.92)}</svg><text x="240" y="85" font-family="${A}" font-weight="800" font-size="30" fill="${white}" text-anchor="middle">CAP /</text><text x="240" y="120" font-family="${A}" font-weight="800" font-size="30" fill="${white}" text-anchor="middle">APP</text></g>`+
 `</g>`;
const foot=`<g transform="translate(0 1220)"><rect width="${Wd}" height="80" fill="${ink}"/><text x="80" y="52" font-family="${A}" font-weight="800" font-size="28" fill="${white}" letter-spacing="2">COOPERS GOLF — THE C IS THE SWING</text></g>`;
fs.writeFileSync(path.join(DIR,'_c-swing-board.png'),R(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Wd} 1300"><rect width="${Wd}" height="1300" fill="${white}"/>${hero}${detail}${foot}</svg>`,2300));
console.log('c-swing final rendered');
