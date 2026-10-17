/* 太初仙域 V1.9.5 五階段仙城大改造：建築、街道、靈泉、生活、光影 */
(function(global){'use strict';
const T=global.THREE;if(!T)return;
const mats=new Map();function mat(c,em=0){const k=c+':'+em;if(!mats.has(k))mats.set(k,new T.MeshStandardMaterial({color:c,roughness:.78,metalness:.05,emissive:em,emissiveIntensity:em?.3:0}));return mats.get(k)}
const stone=mat(0x71827a),stoneDark=mat(0x52665e),slate=mat(0x425c66),roofRed=mat(0x70474c),gold=mat(0xc9ad72),wood=mat(0x72533d),cream=mat(0xcbbda4),moss=mat(0x557c62),green=mat(0x6b9871),water=mat(0x73c9d4,0x3b9da9),glow=mat(0xa1f6e5,0x54c9d7);
let seed=19519;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
function obj(g,geo,m,x=0,y=0,z=0){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.receiveShadow=true;g.add(o);return o}
function bx(g,w,h,d,m,x,y,z){return obj(g,new T.BoxGeometry(w,h,d),m,x,y,z)}
function cyl(g,a,b,h,m,x,y,z,n=10){return obj(g,new T.CylinderGeometry(a,b,h,n),m,x,y,z)}
function ball(g,r,m,x,y,z){return obj(g,new T.IcosahedronGeometry(r,0),m,x,y,z)}
function ring(g,r,t,m,x,y,z){const o=obj(g,new T.TorusGeometry(r,t,6,40),m,x,y,z);o.rotation.x=Math.PI/2;return o}
function batch(g,geo,m,positions){if(!positions.length)return;const inst=new T.InstancedMesh(geo,m,positions.length),o=new T.Object3D();for(let i=0;i<positions.length;i++){const p=positions[i];o.position.set(p[0],p[1],p[2]);o.rotation.set(0,p[6]||0,0);o.scale.set(p[3]||1,p[4]||1,p[5]||1);o.updateMatrix();inst.setMatrixAt(i,o.matrix)}inst.instanceMatrix.needsUpdate=true;inst.receiveShadow=true;g.add(inst)}
function banner(g,x,z,c){bx(g,.11,3.6,.11,wood,x,1.8,z);bx(g,.8,1.15,.09,mat(c),x+.43,2.95,z);ball(g,.13,gold,x,3.75,z)}
function lamp(g,x,z,h=2.5){bx(g,.16,h,.16,wood,x,h/2,z);bx(g,.63,.12,.63,slate,x,h+.3,z);bx(g,.44,.48,.44,mat(0xf0d9a1,0xd4a35a),x,h-.03,z);bx(g,.65,.12,.65,gold,x,h-.37,z)}
function roof(g,x,y,z,w,d,c){for(const s of [-1,1]){const r=bx(g,w/2+.42,.22,d+.6,c,x+s*w/4,y+.44,z);r.rotation.z=-s*.22;const tip=bx(g,.44,.18,d+.95,c,x+s*(w/2+.12),y+.19,z);tip.rotation.z=s*.28}bx(g,.25,.24,d+.75,gold,x,y+.98,z);for(const zz of [-1,1])for(const xx of [-1,1])ball(g,.14,gold,x+xx*(w/2+.22),y+.27,z+zz*(d/2+.34))}
// 第一階段：各建築的附屬院落與辨識性屋簷（避開原互動點 z+5.6）
function facade(g,x,z,type){const group=new T.Group();group.position.set(x,0,z);g.add(group);const c=[slate,roofRed,mat(0x4f7371),mat(0x4f647e),mat(0x9a7559)][type];
roof(group,0,7.55,0,9.3,7.5,c);roof(group,0,9.15,-.45,5.2,4.8,c);
for(const side of [-1,1]){bx(group,.25,3.0,.26,wood,side*4.15,1.55,3.2);bx(group,.42,.45,.45,gold,side*4.15,3.2,3.2);lamp(group,side*4.6,4.3,2.35)}
for(let k=-3;k<=3;k++){if(k===0)continue;bx(group,.12,.58,.08,wood,k*.76,3.42,3.58)}
// 每棟建築的專屬庭院道具，避免壓住門口互動
if(type===0){for(const s of [-1,1]){ring(group,.88,.08,glow,s*3.6,.12,-4.7);ball(group,.48,glow,s*3.6,1.2,-4.7)}}
if(type===1){for(const s of [-1,1]){bx(group,1.5,.9,.8,wood,s*3.9,.5,-4.7);ball(group,.45,gold,s*3.9,1.35,-4.7)}}
if(type===2){for(const s of [-1,1]){cyl(group,.63,.78,1.1,stoneDark,s*3.7,.65,-4.6);ball(group,.3,green,s*3.7,1.4,-4.6)}}
if(type===3){for(const s of [-1,1])banner(group,s*5.4,-3.3,s===1?0x8f6e94:0x5d8591)}
if(type===4){for(const s of [-1,1]){bx(group,1.25,.12,1.1,wood,s*3.9,.62,-4.6);cyl(group,.42,.55,.65,stone,s*3.9,.38,-4.6)}}
}
// 第二階段：石板紋理、巷弄支線、路邊青苔（低繪製成本）
function streets(g){const tiles=[[],[],[]],cracks=[],mosses=[],pebbles=[];for(let z=-42;z<=40;z+=1.55){for(let x=-5.7;x<=5.7;x+=1.65){if(z>1&&z<17&&Math.abs(x)<5.4)continue;const xx=x+(Math.floor(z/1.55)%2)*.33;tiles[(Math.floor(rnd()*3))].push([xx,.082,z,1.51,.045,1.38,0]);if(rnd()<.18)cracks.push([xx+.5,.113,z,.025,.014,.67,rnd()*3]);}}
for(const z of [-24,25,39])for(let x=-36;x<=36;x+=1.75){if(Math.abs(x)<7)continue;tiles[Math.floor(rnd()*3)].push([x,.077,z,1.58,.035,1.6,0])}
for(let i=0;i<260;i++){const x=(rnd()-.5)*80,z=(rnd()-.5)*81;if(Math.abs(x)<8||Math.hypot(x,z-8)<12)continue;if(rnd()<.64)mosses.push([x,.08,z,.25+rnd()*.7,.025,.2+rnd()*.6,rnd()*6.28]);else pebbles.push([x,.12,z,.1+rnd()*.22,.12,.12+rnd()*.24,rnd()*6.28])}
for(let i=0;i<3;i++)batch(g,new T.BoxGeometry(1,1,1),mat([0x697c73,0x829087,0x9ba398][i]),tiles[i]);batch(g,new T.BoxGeometry(1,1,1),stoneDark,cracks);batch(g,new T.BoxGeometry(1,1,1),moss,mosses.map(p=>[p[0],p[1],p[2],p[3],.012,p[5],p[6]]));batch(g,new T.DodecahedronGeometry(1,0),stone,pebbles);
// 橫向巷道的邊界石與植栽分隔
for(const z of [-24,25,39])for(const s of [-1,1])for(let x=8;x<39;x+=2.8){const xx=x*s;bx(g,2.6,.14,.2,stoneDark,xx,.12,z+2.2)}
}
// 第三階段：靈泉外圈水道、蓮池、浮空靈珠
const animated=[];function fountain(g){const f=new T.Group();f.position.set(0,0,8);g.add(f);ring(f,5.92,.16,gold,0,.26,0);ring(f,6.38,.2,stoneDark,0,.22,0);for(let i=0;i<32;i++){const a=i*Math.PI/16,r=5.9;const leaf=cyl(f,.22,.26,.035,i%3?green:moss,Math.cos(a)*r,.27,Math.sin(a)*r,7);leaf.rotation.y=a;}
for(let i=0;i<12;i++){const a=i*Math.PI/6,r=3.38;ball(f,.16,mat(i%2?0xe9d9df:0xf1e5c5),Math.cos(a)*r,1.05,Math.sin(a)*r)}
const orbs=[];for(let i=0;i<9;i++){const a=i*Math.PI*2/9;const b=ball(f,.14+(i%3)*.055,glow,Math.cos(a)*2.6,2.2,Math.sin(a)*2.6);orbs.push(b)}animated.push({type:'orbs',orbs});
const halo=ring(f,2.55,.04,glow,0,4.2,0);halo.rotation.x=.3;animated.push({type:'halo',halo});}
// 第四階段：街市貨架、守衛/遊客裝飾模型（不修改 NPC 任務或碰撞）
function person(g,x,z,robe=0x6b8e8a,phase=0){const p=new T.Group();p.position.set(x,0,z);g.add(p);cyl(p,.35,.49,1.25,mat(robe),0,.82,0,8);ball(p,.33,mat(0xd9b69a),0,1.65,0);bx(p,.8,.16,.25,mat(robe),0,1.32,0);bx(p,.26,.62,.25,mat(0x594d45),0,2.01,-.02);for(const s of [-1,1])bx(p,.17,.72,.18,mat(0x66564a),s*.21,.32,0);animated.push({type:'person',p,phase,baseY:0});}
function life(g){const places=[[-37,-9],[-36,-3],[36,-9],[37,-3],[-36,28],[36,29]];places.forEach(([x,z],i)=>{const stall=new T.Group();stall.position.set(x,0,z);g.add(stall);bx(stall,2.7,.85,1.2,wood,0,.7,0);roof(stall,0,2.7,0,3.3,2.2,i%2?roofRed:slate);for(let k=-1;k<=1;k++)ball(stall,.2,mat([0xe1b46b,0x9dca94,0xbba0cf][(i+k+3)%3]),k*.65,1.25,.25);lamp(stall,-1.8,1.0,1.9)});
[[-27,3,0x71908e],[-28,30,0x96745d],[27,3,0x78957e],[28,30,0x8375a1],[-11,-30,0x74849e],[11,-30,0x7d9a8a]].forEach((a,i)=>person(g,...a,i*.9));
for(const [x,z] of [[-37,12],[37,12],[-37,36],[37,36]]){bx(g,2.1,.15,.62,wood,x,.62,z);for(const s of [-1,1])bx(g,.18,.55,.65,wood,x+s*.8,.32,z)}
}
// 第五階段：無大量即時燈光的暖色照明、遠山剪影與雲霧
function atmosphere(g){const mountains=new T.Group();g.add(mountains);for(let i=0;i<24;i++){const a=i*Math.PI*2/24,r=81+(i%4)*8,h=12+(i%7)*4;const mountain=obj(mountains,new T.ConeGeometry(12+(i%3)*4,h,5),mat(i%2?0x6d9290:0x769b93),Math.cos(a)*r,h*.28-6,Math.sin(a)*r);mountain.rotation.y=a;}
const mist=[];for(let i=0;i<20;i++){const a=i*Math.PI*2/20,r=42+(i%3)*5;mist.push([Math.cos(a)*r,1.4,Math.sin(a)*r,5+(i%4)*2,.5,3+(i%3)*2,a])}batch(g,new T.SphereGeometry(1,8,5),new T.MeshBasicMaterial({color:0xb5d9d1,transparent:true,opacity:.075,depthWrite:false}),mist);
for(const x of [-39,39])for(const z of [-28,-14,0,14,28,40])lamp(g,x,z,2.85);
for(const [x,z] of [[-9,-35],[9,-35],[-8,36],[8,36]]){cyl(g,.55,.68,.38,stoneDark,x,.23,z);ball(g,.36,mat(0xf2e2a8,0xd2b65b),x,.72,z)}
}
function install(add){seed=19519;animated.length=0;const root=new T.Group();root.name='Taichu-V195-FiveStages';add(root);facade(root,-18,-7,0);facade(root,18,-7,1);facade(root,-18,17,2);facade(root,18,17,3);facade(root,-18,33,4);streets(root);fountain(root);life(root);atmosphere(root)}
function update(t){for(const a of animated){if(a.type==='orbs')a.orbs.forEach((o,i)=>{const p=t*.36+i*Math.PI*2/9;o.position.x=Math.cos(p)*2.6;o.position.z=Math.sin(p)*2.6;o.position.y=2.2+Math.sin(t*1.3+i)*.22});if(a.type==='halo')a.halo.rotation.z=t*.13;if(a.type==='person')a.p.position.y=a.baseY+Math.sin(t*1.2+a.phase)*.035}}
global.TaichuCity195={install,update};
})(window);
