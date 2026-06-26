const {Resvg}=require('@resvg/resvg-js');const fs=require('fs');const path=require('path');
const OUT='/home/user/claude_skills/coopers-golf';
const FONTS=path.join(__dirname,'fonts');
const PNGDIR=path.join(OUT,'renders-pro'),SVGDIR=path.join(OUT,'svg-pro');
fs.mkdirSync(PNGDIR,{recursive:true});fs.mkdirSync(SVGDIR,{recursive:true});

const P={ink:'#13151A',char:'#1E2128',bone:'#F2EAD7',cream:'#FBF5E8',
 coral:'#FF5A36,',coralC:'#FF5A36',lime:'#B9E532',sun:'#FFB627',teal:'#0BBFB0',green:'#1C7A4D'};
const ANTON='Anton',BEBAS='Bebas Neue';

function lockup(cP,cG,tag,rule){return `
  <text x="500" y="452" font-family="${ANTON}" font-size="205" fill="${cP}" text-anchor="middle" letter-spacing="3">COOPERS</text>
  <text x="500" y="636" font-family="${ANTON}" font-size="205" fill="${cG}" text-anchor="middle" letter-spacing="34">GOLF</text>
  ${rule?`<rect x="262" y="690" width="476" height="7" fill="${rule}"/>`:''}
  ${tag?`<text x="500" y="760" font-family="${BEBAS}" font-size="62" fill="${tag}" text-anchor="middle" letter-spacing="12">AUSTRALIA’S BEST</text>`:''}`;}
function horiz(c1,c2,tag){return `
  <text x="500" y="500" font-family="${ANTON}" font-size="150" fill="${c1}" text-anchor="middle" letter-spacing="2">COOPERS <tspan fill="${c2}">GOLF</tspan></text>
  ${tag?`<text x="500" y="575" font-family="${BEBAS}" font-size="46" fill="${tag}" text-anchor="middle" letter-spacing="16">AUSTRALIA’S BEST · EST 2026</text>`:''}`;}
function ball(cx,cy,r,fill,dot){let d='';const st=r/3.2;for(let i=-r;i<=r;i+=st)for(let j=-r;j<=r;j+=st){if(i*i+j*j<(r-r*0.13)*(r-r*0.13))d+=`<circle cx="${(cx+i).toFixed(1)}" cy="${(cy+j).toFixed(1)}" r="${(r/12).toFixed(1)}" fill="${dot}" opacity="0.45"/>`;}return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>${d}`;}
function iconCG(disc,ring,letters){return `<circle cx="500" cy="480" r="260" fill="${disc}"/><circle cx="500" cy="480" r="260" fill="none" stroke="${ring}" stroke-width="14"/><text x="500" y="582" font-family="${ANTON}" font-size="300" fill="${letters}" text-anchor="middle" letter-spacing="-10">CG</text>`;}

const cells=[
 {label:'PRIMARY · STACKED',bg:P.ink,draw:lockup(P.coralC,P.bone,P.coralC,P.coralC)},
 {label:'ICON · MONOGRAM',bg:P.ink,draw:iconCG(P.coralC,P.bone,P.ink)},
 {label:'HORIZONTAL LOCKUP',bg:P.ink,draw:horiz(P.bone,P.coralC,'#8c8c8c')},
 {label:'REVERSED · ON LIGHT',bg:P.bone,draw:lockup(P.ink,P.coralC,P.ink,P.ink)},
 {label:'LOUD COLOURWAY',bg:P.ink,draw:lockup(P.lime,P.coralC,P.bone,P.lime)},
 {label:'ONE-COLOUR',bg:P.bone,draw:lockup(P.ink,P.ink,P.ink,P.ink)},
];

// individual artboards
const doc=inner=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${inner}</svg>`;
cells.forEach((c,i)=>{const slug=c.label.toLowerCase().replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'');const d=doc(`<rect width="1000" height="1000" fill="${c.bg}"/>${c.draw}`);
 fs.writeFileSync(path.join(SVGDIR,`0${i+1}-${slug}.svg`),d);
 fs.writeFileSync(path.join(PNGDIR,`0${i+1}-${slug}.png`),new Resvg(d,{font:{fontDirs:[FONTS],loadSystemFonts:true,defaultFontFamily:'Liberation Sans'},fitTo:{mode:'width',value:1000}}).render().asPng());});

// brand board
const cw=520,ch=560,cols=3,rows=2,footer=120;
let g='';cells.forEach((c,idx)=>{const x=(idx%cols)*cw,y=Math.floor(idx/cols)*ch;
 g+=`<g transform="translate(${x} ${y})"><rect width="${cw}" height="${ch}" fill="${c.bg}"/><svg x="20" y="10" width="480" height="480" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="${c.bg}"/>${c.draw}</svg>`+
 `<rect x="0" y="${ch-44}" width="${cw}" height="44" fill="#0c0c0e"/><text x="${cw/2}" y="${ch-15}" font-family="${BEBAS}" font-size="26" fill="#cfcfcf" text-anchor="middle" letter-spacing="4">${c.label}</text></g>`;});
const sw=[['INK','#13151A'],['CORAL','#FF5A36'],['BONE','#F2EAD7'],['LIME','#B9E532'],['SUN','#FFB627'],['TEAL','#0BBFB0']];
let fy=rows*ch;let foot=`<rect x="0" y="${fy}" width="${cols*cw}" height="${footer}" fill="#0c0c0e"/>`;
sw.forEach(([n,hex],i)=>{const x=40+i*150;foot+=`<rect x="${x}" y="${fy+34}" width="52" height="52" rx="8" fill="${hex}" stroke="#333" stroke-width="1"/><text x="${x+26}" y="${fy+104}" font-family="${BEBAS}" font-size="20" fill="#bbb" text-anchor="middle" letter-spacing="2">${n}</text>`;});
foot+=`<text x="${cols*cw-40}" y="${fy+58}" font-family="${BEBAS}" font-size="30" fill="#eee" text-anchor="end" letter-spacing="3">TYPE — ANTON / BEBAS NEUE</text><text x="${cols*cw-40}" y="${fy+92}" font-family="${BEBAS}" font-size="24" fill="#888" text-anchor="end" letter-spacing="2">COOPERS GOLF · IDENTITY SYSTEM</text>`;
const board=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols*cw} ${rows*ch+footer}"><rect width="${cols*cw}" height="${rows*ch+footer}" fill="#0c0c0e"/>${g}${foot}</svg>`;
fs.writeFileSync(path.join(PNGDIR,'_brand-board.png'),new Resvg(board,{font:{fontDirs:[FONTS],loadSystemFonts:true},fitTo:{mode:'width',value:2340}}).render().asPng());
console.log('done; fonts present:',fs.readdirSync(FONTS).join(', '));
