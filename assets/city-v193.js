/* 太初仙域 V1.9.3 仙街萬象：純視覺、可重現、無額外網路資源 */
(function(global){'use strict';const T=global.THREE;if(!T)return;
let seed=1932026;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
const mat=(c,em=0)=>new T.MeshStandardMaterial({color:c,roughness:.88,metalness:.02,emissive:em,emissiveIntensity:em?.35:0});
const stone=[0x686f69,0x7a8278,0x909486,0x777b71,0xa09d8c].map(mat);
const foliage=[0x446e53,0x567c59,0x6c946a,0x779b76].map(mat);
const trunk=mat(0x735a42),roof=mat(0x385d64),gold=mat(0xc2a36c),wood=mat(0x75513d);
function box(g,w,h,d,m,x,y,z){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o}
function mesh(g,geo,m,x,y,z){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;g.add(o);return o}
function inst(g,geo,m,items){if(!items.length)return;const o=new T.InstancedMesh(geo,m,items.length),d=new T.Object3D();items.forEach((v,i)=>{d.position.set(v[0],v[1],v[2]);d.rotation.set(v[6]||0,v[7]||0,v[8]||0);d.scale.set(v[3],v[4],v[5]);d.updateMatrix();o.setMatrixAt(i,d.matrix)});o.instanceMatrix.needsUpdate=true;o.receiveShadow=true;g.add(o)}
function install(add){seed=1932026;const root=new T.Group();root.name='V193_仙街萬象';add(root);
// 主路：以深色石縫與局部青苔降低大面積白亮，沿用 V1.9.2 石板
const joints=[];for(let z=-40;z<44;z+=1.45){if(z>-5&&z<21)continue;for(let x=-6.2;x<6.2;x+=1.55){if(rnd()<.38)joints.push([x+.69,.077,z, .055,.009,1.15]);}}
inst(root,new T.BoxGeometry(1,1,1),mat(0x555e58),joints);
// 地面落葉、碎石與小花：實例化降低 draw calls，避開中央道路、靈泉
const gravel=[[],[],[]],leaves=[[],[],[]],flowers=[[],[],[]];
for(let i=0;i<1500;i++){const x=rnd()*85-42.5,z=rnd()*85-42.5;if(Math.abs(x)<8.9||Math.hypot(x,z-8)<17.2)continue;const t=Math.floor(rnd()*3);if(i<620)gravel[t].push([x,.09,z,.28+rnd()*.65,.18+rnd()*.45,.28+rnd()*.65,0,rnd()*6.28,0]);else if(i<1190)leaves[t].push([x,.066,z,.11+rnd()*.22,.01,.17+rnd()*.26,0,rnd()*6.28,0]);else flowers[t].push([x,.11,z,.09+rnd()*.09,.08+rnd()*.12,.09+rnd()*.09]);}
gravel.forEach((v,i)=>inst(root,new T.DodecahedronGeometry(.24,0),stone[i],v));
leaves.forEach((v,i)=>inst(root,new T.BoxGeometry(1,1,1),mat([0x97794e,0x9a865a,0x687d4b][i]),v));
flowers.forEach((v,i)=>inst(root,new T.IcosahedronGeometry(1,0),mat([0xf3c8d2,0xe6d9a4,0xd8c9f0][i]),v));
// 竹林：每叢 3-5 枝，採用幾何共享與 instancing
const bambooStems=[],bambooLeaves=[[],[],[]];
const clusters=[[-38,-23],[-38,-8],[-38,26],[-36,36],[38,-22],[38,-5],[38,26],[36,36],[-28,-37],[28,-37]];
for(const [cx,cz] of clusters){for(let j=0;j<5;j++){const x=cx+(rnd()-.5)*3,z=cz+(rnd()-.5)*3,h=2.5+rnd()*2.2;bambooStems.push([x,h/2,z,.09,h,.09]);for(let k=0;k<5;k++){const a=rnd()*Math.PI*2,y=h*(.5+k*.105);bambooLeaves[k%3].push([x+Math.cos(a)*.38,y,z+Math.sin(a)*.38,.68,.045,.18,0,a,0]);}}}
inst(root,new T.CylinderGeometry(.5,.5,1,6),mat(0x628b5e),bambooStems);
bambooLeaves.forEach((v,i)=>inst(root,new T.BoxGeometry(1,1,1),foliage[i],v));
// 街角花圃：木製矮邊框 + 多色花叢
for(const [x,z] of [[-11,-29],[11,-29],[-11,32],[11,32],[-30,2],[30,2]]){const p=new T.Group();p.position.set(x,0,z);root.add(p);box(p,3,.32,.18,wood,0,.22,-.85);box(p,3,.32,.18,wood,0,.22,.85);box(p,.18,.32,1.85,wood,-1.5,.22,0);box(p,.18,.32,1.85,wood,1.5,.22,0);box(p,2.8,.08,1.6,mat(0x506e4e),0,.13,0);for(let i=0;i<12;i++){const xx=(rnd()-.5)*2.4,zz=(rnd()-.5)*1.25;mesh(p,new T.IcosahedronGeometry(.12,0),mat([0xeeb2bc,0xf1d69b,0xd7c4f3][i%3]),xx,.36+rnd()*.13,zz)}}
// 道旁小型石階、排水溝與橋形邊框（純裝飾，不增加碰撞）
for(const side of [-1,1]){for(let z=-39;z<-8;z+=3.3){box(root,.26,.1,2.5,stone[1],side*7.13,.095,z)}for(let z=25;z<42;z+=3.3){box(root,.26,.1,2.5,stone[1],side*7.13,.095,z)}}
// 小亭：放在城牆內緣、避開主建築入口；層疊屋簷與木柱
for(const [x,z] of [[-36,2],[36,2]]){const p=new T.Group();p.position.set(x,0,z);root.add(p);mesh(p,new T.CylinderGeometry(2.35,2.45,.23,8),stone[2],0,.16,0);for(const a of [0,Math.PI/2,Math.PI,3*Math.PI/2]){const xx=Math.cos(a)*1.55,zz=Math.sin(a)*1.55;box(p,.18,2.9,.18,wood,xx,1.65,zz)}const r=mesh(p,new T.ConeGeometry(3.05,1.28,4),roof,0,3.56,0);r.rotation.y=Math.PI/4;mesh(p,new T.ConeGeometry(2.5,.65,4),mat(0x54767a),0,4.04,0).rotation.y=Math.PI/4;mesh(p,new T.SphereGeometry(.18,8,6),gold,0,4.5,0)}
// 靈泉外圈：細金紋和石雕裝飾，避免遮住互動地標
for(let i=0;i<32;i++){const a=i*Math.PI/16,x=Math.cos(a)*11.55,z=8+Math.sin(a)*11.55;const m=mesh(root,new T.BoxGeometry(.56,.026,.12),i%4===0?gold:stone[0],x,.258,z);m.rotation.y=-a;}
// 橋燈：暖色光球不建立額外 PointLight，避免效能下降
for(const [x,z] of [[-7.7,-32],[7.7,-32],[-7.7,35],[7.7,35]]){const p=new T.Group();p.position.set(x,0,z);root.add(p);box(p,.16,2.25,.16,wood,0,1.2,0);box(p,.66,.12,.66,roof,0,2.43,0);mesh(p,new T.SphereGeometry(.23,10,8),mat(0xffd89b,0xffae50),0,2.1,0);box(p,.76,.12,.76,roof,0,2.65,0)}
}
global.TaichuCity193={install};
})(window);
