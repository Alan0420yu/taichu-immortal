/* 太初仙域 V1.9.4：仙城盛景。額外美術模組，不變更遊戲存檔或戰鬥邏輯。 */
(function(global){'use strict';const T=global.THREE;if(!T)return;
const M=(c,e=0)=>new T.MeshStandardMaterial({color:c,roughness:.78,metalness:.07,emissive:e,emissiveIntensity:e?.28:0});
const stone=[0x66766f,0x798980,0x8d9990,0x5f6c66].map(c=>M(c)),wood=M(0x684b3b),wood2=M(0x967154),tile=M(0x385963),tile2=M(0x51747a),gold=M(0xd6b777),red=M(0x9e5557),paper=M(0xf3d4a1,0xe3a85a),water=M(0x65bfc7,0x2c889e);
let seed=19426;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
function mesh(g,geo,mat,x,y,z){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.receiveShadow=true;g.add(m);return m}
function box(g,w,h,d,mat,x,y,z){return mesh(g,new T.BoxGeometry(w,h,d),mat,x,y,z)}
function cylinder(g,rt,rb,h,mat,x,y,z,n=10){return mesh(g,new T.CylinderGeometry(rt,rb,h,n),mat,x,y,z)}
function inst(g,geo,mat,items){if(!items.length)return;const m=new T.InstancedMesh(geo,mat,items.length),o=new T.Object3D();items.forEach((v,i)=>{o.position.set(v[0],v[1],v[2]);o.scale.set(v[3],v[4],v[5]);o.rotation.y=v[6]||0;o.updateMatrix();m.setMatrixAt(i,o.matrix)});m.instanceMatrix.needsUpdate=true;m.receiveShadow=true;g.add(m)}
function roof(g,x,y,z,w,d){box(g,w+.7,.18,d+.7,tile,x,y,z);const top=mesh(g,new T.ConeGeometry(Math.max(w,d)*.75,1.65,4),tile2,x,y+.72,z);top.rotation.y=Math.PI/4;for(const sx of [-1,1])for(const sz of [-1,1]){const tip=mesh(g,new T.ConeGeometry(.32,.95,4),tile,x+sx*(w/2+.23),y+.45,z+sz*(d/2+.23));tip.rotation.z=sx*.35;tip.rotation.x=sz*.35}box(g,w+.85,.12,.18,gold,x,y-.14,z+d/2+.28)}
function lantern(g,x,y,z){const l=new T.Group();l.position.set(x,y,z);g.add(l);cylinder(l,.035,.035,.42,wood,0,.35,0,6);cylinder(l,.22,.22,.43,red,0,0,0,8);cylinder(l,.16,.16,.36,paper,0,0,0,8);cylinder(l,.24,.24,.09,gold,0,.26,0,8);cylinder(l,.24,.24,.09,gold,0,-.26,0,8);cylinder(l,.03,.03,.34,red,0,-.48,0,6)}
function marketStall(g,x,z,s){const a=new T.Group();a.position.set(x,0,z);g.add(a);box(a,3.1,.18,1.55,wood2,0,1.2,0);for(const dx of [-1.35,1.35])for(const dz of [-.57,.57])box(a,.12,2.7,.12,wood,dx,1.45,dz);roof(a,0,2.82,0,3.3,2.1);box(a,2.4,.55,.9,s%2?M(0x748c77):M(0x926b55),0,.62,0);for(let i=0;i<5;i++){const c=[0xd7ac69,0x85aa79,0x9bc7b4][(i+s)%3];mesh(a,new T.DodecahedronGeometry(.22,0),M(c),-1+i*.48,1.4,.22)}lantern(a,-1.55,2.18,.87);lantern(a,1.55,2.18,.87)}
function gateway(g,x,z){const a=new T.Group();a.position.set(x,0,z);g.add(a);for(const s of [-1,1]){box(a,.8,5.4,.9,stone[1],s*4.5,2.7,0);box(a,1.08,.38,1.1,gold,s*4.5,5.48,0)}box(a,10,.75,1.4,wood,0,5.38,0);roof(a,0,6.05,0,11,2.8);box(a,3.5,.9,.17,wood2,0,4.78,.8);for(const s of [-1,1])lantern(a,s*3.65,4.55,1)}
function tower(g,x,z){const a=new T.Group();a.position.set(x,0,z);g.add(a);cylinder(a,2.1,2.3,.42,stone[1],0,.24,0,8);for(const s of [-1,1])for(const t of [-1,1])box(a,.22,4.5,.22,wood,s*1.45,2.5,t*1.45);roof(a,0,4.86,0,4.6,4.6);cylinder(a,.22,.3,.7,gold,0,6.3,0,8);for(const s of [-1,1])lantern(a,s*1.5,3.8,1.55)}
function install(add){seed=19426;const root=new T.Group();root.name='V194_仙城盛景';add(root);
// 由灰白色廣場改成暖灰色石磚圖騰；高度高於舊地板，低於靈泉。
const plaza=[];for(let i=0;i<58;i++){const a=i*Math.PI*2/58;for(const r of [7.65,8.65,9.62]){const x=Math.cos(a)*r,z=8+Math.sin(a)*r;plaza.push([x,.271,z,.58,.016,.9,-a])}}inst(root,new T.BoxGeometry(1,1,1),stone[1],plaza);
// 雙向青石路面：不遮住角色或互動地標。
const paving=[[],[],[],[]];for(let z=-41;z<=42;z+=1.7){if(z>-5&&z<22)continue;for(let x=-6.25;x<6.25;x+=1.7){const jitter=(rnd()-.5)*.14;paving[Math.floor(rnd()*4)].push([x+jitter,.085,z,.99,.027,1.12,rnd()*.05])}}paving.forEach((a,i)=>inst(root,new T.BoxGeometry(1,1,1),stone[i],a));
// 外圍小徑與不規則踏石，避免空白地面。
const stepping=[[],[],[]];for(const side of [-1,1])for(let z=-38;z<=39;z+=2.15){for(const dx of [0,2.4]){if(Math.hypot(side*(11+dx),z-8)<15)continue;stepping[Math.floor(rnd()*3)].push([side*(11+dx),.095,z,.85,.075,1.1,(rnd()-.5)*.2])}}stepping.forEach((a,i)=>inst(root,new T.DodecahedronGeometry(.5,0),stone[i],a));
// 城市外緣：苔石、草叢、落葉、花朵，使用 instancing 降低開銷。
const tufts=[[],[],[]],pebbles=[[],[],[]],petals=[[],[],[]];for(let i=0;i<1750;i++){const x=rnd()*83-41.5,z=rnd()*83-41.5;if(Math.abs(x)<9||Math.hypot(x,z-8)<15||Math.abs(x)>40||Math.abs(z)>40)continue;const k=Math.floor(rnd()*3);if(i<730)tufts[k].push([x,.13,z,.25+rnd()*.35,.25+rnd()*.5,.25+rnd()*.35,rnd()*6.28]);else if(i<1300)pebbles[k].push([x,.11,z,.2+rnd()*.35,.09+rnd()*.17,.2+rnd()*.35,rnd()*6.28]);else petals[k].push([x,.11,z,.09+rnd()*.12,.025,.13+rnd()*.18,rnd()*6.28])}
tufts.forEach((a,i)=>inst(root,new T.ConeGeometry(.5,1,4),M([0x446d4c,0x66855a,0x829a67][i]),a));pebbles.forEach((a,i)=>inst(root,new T.DodecahedronGeometry(.5,0),stone[i],a));petals.forEach((a,i)=>inst(root,new T.BoxGeometry(1,1,1),M([0xe0b1ae,0xf1dca6,0xb6abc9][i]),a));
// 中央聚靈泉：石欄、蓮葉與環狀靈石。保留原水池及互動標記。
for(let i=0;i<16;i++){const a=i*Math.PI/8,x=Math.cos(a)*5.3,z=8+Math.sin(a)*5.3;cylinder(root,.25,.31,.55,stone[2],x,.45,z,8);const cap=mesh(root,new T.SphereGeometry(.22,8,6),gold,x,.81,z);cap.scale.y=.65}
for(let i=0;i<12;i++){const a=i*Math.PI/6,x=Math.cos(a)*3.12,z=8+Math.sin(a)*3.12;const leaf=mesh(root,new T.CircleGeometry(.38,9),M(0x4d927b),x,.969,z);leaf.rotation.x=-Math.PI/2;const bud=mesh(root,new T.ConeGeometry(.17,.38,7),M(i%2?0xf5d6e4:0xe8f3ef),x,.21+1,z)}
// 西側商街與東側修行街，避開主路及既有建築互動中心。
for(const [x,z,s] of [[-31,-19,0],[-31,-12,1],[31,-19,2],[31,-12,3]])marketStall(root,x,z,s);
for(const [x,z] of [[-35,-36],[35,-36]])tower(root,x,z);
// 城門上方增加完整多重屋簷、兩側燈籠。
gateway(root,0,-35);
// 沿牆彩旗，保持視線通透。
for(const side of [-1,1])for(let z=-30;z<=31;z+=10){const x=side*40;box(root,.1,4,.1,wood,x,2.1,z);const flag=box(root,.12,1.45,1.05,z%3?M(0x7b637d):M(0x6b8580),x,3.1,z+.57);flag.rotation.y=.08;mesh(root,new T.SphereGeometry(.12,7,6),gold,x,4.25,z)}
// 仙燈與庭院門柱：不新增 PointLight，控制渲染成本。
for(const [x,z] of [[-26,-6],[-10,-6],[10,-6],[26,-6],[-26,17],[-10,17],[10,17],[26,17],[-26,32],[-10,32]]){box(root,.22,2.3,.22,wood,x,1.15,z);box(root,.65,.14,.65,tile,x,2.35,z);mesh(root,new T.BoxGeometry(.39,.49,.39),paper,x,1.94,z);box(root,.65,.14,.65,tile,x,1.58,z)}
// 建築前方裝飾地毯、花盆、木牌：不覆蓋互動位置。
for(const [x,z] of [[-18,-7],[18,-7],[-18,17],[18,17],[-18,33]]){for(const side of [-1,1]){const px=x+side*5.6;cylinder(root,.47,.38,.45,stone[2],px,.29,z+2.9,8);for(let j=0;j<4;j++)mesh(root,new T.IcosahedronGeometry(.19,0),M([0x68976c,0x82a880,0x9eb57d][j%3]),px+(j-1.5)*.16,.63,z+2.9)}box(root,2.7,.055,1.8,M(0x6d756b),x,.11,z+4.8)}
}
global.TaichuCity194={install};
})(window);
