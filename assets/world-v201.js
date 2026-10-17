/* 太初仙域 V2.0.1: scene embellishment, performance-safe, no gameplay changes. */
(function(){'use strict';const T=window.THREE;if(!T)return;
const themes={city:[0x668c69,0x9ebc84,0xd9bb7e],forest:[0x426d49,0x729e62,0x9ecb85],valley:[0x4c837d,0x78b2a0,0xc1e2c8],dungeon:[0x3c6668,0x609997,0xa8d9d0],firelands:[0x673c32,0x995640,0xe79b59],snowlands:[0x739fae,0xb4d7df,0xeaf4f4],skylands:[0x648d81,0xa5bda1,0xe7d9a5]};
let active=null,quality=1,elapsed=0;try{quality=Math.max(0,Math.min(2,Number(localStorage.getItem('taichu_visual_quality')??1)||0))}catch(e){}
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296}}
const groundGeo=new T.IcosahedronGeometry(1,0),bushGeo=new T.ConeGeometry(1,1.8,5),rockGeo=new T.DodecahedronGeometry(1,0),dummy=new T.Object3D();
const materials=new Map();function material(color){if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.97,flatShading:true}));return materials.get(color)}
function instanced(group,geometry,color,points){if(!points.length)return;const mesh=new T.InstancedMesh(geometry,material(color),points.length);for(let i=0;i<points.length;i++){const [x,y,z,sx,sy,sz,angle]=points[i];dummy.position.set(x,y,z);dummy.rotation.set(0,angle,0);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)}mesh.instanceMatrix.needsUpdate=true;mesh.frustumCulled=false;group.add(mesh)}
function create(zone,world){if(!world||!themes[zone])return null;let g=world.getObjectByName('V201_'+zone);if(g)return g;g=new T.Group();g.name='V201_'+zone;const colors=themes[zone],r=rng(20100+Object.keys(themes).indexOf(zone)*107),groups=[[],[],[]],bush=[[],[],[]],rock=[[],[],[]];const isCity=zone==='city';
for(let i=0;i<(isCity?100:180);i++){let x=(r()-.5)*88,z=(r()-.5)*88;if(Math.abs(x)<(isCity?32:13)||Math.abs(z)<(isCity?26:9))continue;const sz=.3+r()*.7;groups[i%3].push([x,.02,z,sz,.03,sz*.7,r()*6.28])}
for(let i=0;i<(isCity?25:85);i++){let x=(r()-.5)*86,z=(r()-.5)*86;if(Math.abs(x)<(isCity?33:15)||Math.abs(z)<(isCity?28:12))continue;const sz=.25+r()*.65;bush[i%3].push([x,sz*.85,z,sz,sz,sz,r()*6.28])}
for(let i=0;i<(isCity?35:65);i++){let x=(r()-.5)*86,z=(r()-.5)*86;if(Math.abs(x)<(isCity?33:14)||Math.abs(z)<(isCity?27:11))continue;const sz=.2+r()*.55;rock[i%3].push([x,.15*sz,z,sz,sz*.45,sz*.8,r()*6.28])}
for(let k=0;k<3;k++){instanced(g,groundGeo,colors[k],groups[k]);instanced(g,bushGeo,colors[k],bush[k]);instanced(g,rockGeo,colors[k],rock[k])}
// Decorative detail only: no colliders, no changes to enemy spawning or save schema.
world.add(g);return g}
function apply(){if(active)active.visible=quality>0}
function activate(zone,world){active=create(zone,world);apply()}
function update(zone,dt){if(active&&active.name!=='V201_'+zone)active=null;elapsed+=Math.min(dt||0,.05);if(Math.floor(elapsed)%2===0){let next=quality;try{next=Math.max(0,Math.min(2,Number(localStorage.getItem('taichu_visual_quality')??1)||0))}catch(e){}if(next!==quality){quality=next;apply()}}}
window.TaichuWorld201={activate,update};})();