/* 太初仙域 V1.9.7：六境場景美術；僅裝飾，不改動碰撞、怪物、傳送、存檔。 */
(function(){'use strict';
const T=window.THREE;if(!T)return;
const cache=new Map();
function material(color,glow=0){const k=color+'-'+glow;if(!cache.has(k))cache.set(k,new T.MeshStandardMaterial({color,roughness:.86,metalness:.06,flatShading:true,emissive:glow?color:0x000000,emissiveIntensity:glow}));return cache.get(k)}
function seedFor(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296}}
function mesh(g,c,x,y,z,glow=0){const m=new T.Mesh(g,material(c,glow));m.position.set(x,y,z);m.receiveShadow=true;return m}
function b(w,h,d,c,x,y,z){return mesh(new T.BoxGeometry(w,h,d),c,x,y,z)}
function cyl(rt,rb,h,c,x,y,z,n=8){return mesh(new T.CylinderGeometry(rt,rb,h,n),c,x,y,z)}
function cone(r,h,c,x,y,z,n=7){return mesh(new T.ConeGeometry(r,h,n),c,x,y,z)}
function orb(r,c,x,y,z,glow=0){return mesh(new T.IcosahedronGeometry(r,0),c,x,y,z,glow)}
function safe(x,z){return Math.abs(x)<47&&Math.abs(z)<47&&Math.abs(x)>10&&Math.abs(z)<34}
function instanced(group,geo,colors,items){const dummy=new T.Object3D();for(const [idx,color] of colors.entries()){const sub=items.filter((_,i)=>i%colors.length===idx);if(!sub.length)continue;const m=new T.InstancedMesh(geo,material(color),sub.length);m.receiveShadow=true;sub.forEach(([x,y,z,sx,sy,sz,rot],i)=>{dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(0,rot||0,0);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix)});m.instanceMatrix.needsUpdate=true;group.add(m)}}
function tilework(group,zone,r){const items=[];for(let i=0;i<215;i++){const x=r()*91-45.5,z=r()*90-45;if(Math.abs(x)<7.4&&Math.abs(z)<44)continue;if(Math.hypot(x,z-40)<9)continue;items.push([x,.045,z,.5+r()*.9,.05,.45+r()*.75,r()*6.28])}const palettes={forest:[0x56875c,0x66956c,0x457750],valley:[0x79a895,0x91b5a2,0x6d9e8c],dungeon:[0x708980,0x7b8c84,0x607b76],firelands:[0x744a3f,0x945846,0x583c38],snowlands:[0xd0e8ed,0xb4d6e2,0xe4f1ef],skylands:[0x99c5b9,0x82b9b4,0xb1d5c5]};instanced(group,new T.BoxGeometry(1,1,1),palettes[zone],items);
const slabs=[];for(let z=-35;z<=32;z+=3.1)for(let x=-3.7;x<=3.7;x+=3.7){slabs.push([x+(r()-.5)*.25,.078,z+(r()-.5)*.25,3.35,.095,2.55,r()*.045])}
const stone={forest:[0x8b9780,0x9ca78d,0x7c8d77],valley:[0xaaa997,0xb8b4a0,0x8d9f91],dungeon:[0x6b7778,0x889496,0x7b8583],firelands:[0x8b6255,0x9f7662,0x77554c],snowlands:[0x9dbdc8,0xb6d3da,0x85adb9],skylands:[0xd6d2b7,0xe4dfc8,0xb8c9b8]};instanced(group,new T.BoxGeometry(1,1,1),stone[zone],slabs)}
function pavilion(group,x,z,color){const g=new T.Group();g.position.set(x,0,z);g.add(cyl(3.2,3.35,.35,0x827d73,0,.2,0,10));for(let i=0;i<6;i++){const a=i*Math.PI/3;g.add(cyl(.14,.17,3.1,0x664c39,Math.sin(a)*2.6,1.83,Math.cos(a)*2.6))}const roof=cone(4.4,2.3,color,0,4.25,0,6);roof.rotation.y=Math.PI/6;g.add(roof);g.add(cone(2.1,1.05,0xd9b77e,0,5.43,0,6));g.add(orb(.32,0xffd69a,0,6.12,0,.45));group.add(g)}
function lantern(group,x,z,color=0xffcc79){const g=new T.Group();g.position.set(x,0,z);g.add(cyl(.12,.17,3.3,0x56493e,0,1.65,0));g.add(b(.9,.12,.2,0x57493d,.42,3.2,0));g.add(cyl(.31,.31,.65,color,.75,2.8,0,8));g.add(cyl(.38,.38,.09,0x6a4d35,.75,3.2,0));g.add(cyl(.38,.38,.09,0x6a4d35,.75,2.43,0));group.add(g)}
function shrine(group,x,z,roof=0x537c76){const g=new T.Group();g.position.set(x,0,z);g.add(b(5,.4,4.2,0x888b7d,0,.22,0));g.add(b(4.3,3.1,3.2,0xc8bba1,0,2,0));for(const q of [-1,1])g.add(cyl(.19,.2,3.5,0x725742,q*1.75,2.2,1.75));g.add(b(1.1,2.25,.15,0x604b3c,0,1.6,1.66));const top=cone(4.2,2.15,roof,0,4.55,0,4);top.rotation.y=Math.PI/4;g.add(top);g.add(cone(2.35,1.15,0xb6a07a,0,5.7,0,4));group.add(g)}
function bamboo(group,x,z,r){const g=new T.Group();g.position.set(x,0,z);for(let k=0;k<4;k++){const px=(r()-.5)*1.8,pz=(r()-.5)*1.8,h=2.6+r()*2.2;g.add(cyl(.065,.085,h,0x4e8863,px,h/2,pz,6));for(let t=0;t<3;t++){const yy=h*(.46+t*.18);const leaf=cone(.52,.85,0x43866a,px+(r()-.5)*.45,yy,pz+(r()-.5)*.45,5);leaf.rotation.z=(r()-.5)*.9;g.add(leaf)}}group.add(g)}
function crystal(group,x,z,color,r){const g=new T.Group();g.position.set(x,0,z);for(let k=0;k<3;k++){const xx=(r()-.5)*1.25,zz=(r()-.5)*1.25,h=.9+r()*1.9;g.add(cyl(.03,.36,h,color,xx,h*.5,zz,5));g.add(cone(.35,.65,color,xx,h+.24,zz,5))}group.add(g)}
function ruin(group,x,z,color){const g=new T.Group();g.position.set(x,0,z);g.add(cyl(2.1,2.3,.35,color,0,.2,0,9));for(const q of [-1,1]){g.add(cyl(.28,.35,2.9,color,q*1.6,1.7,0));g.add(b(.65,.25,.6,0xb2a995,q*1.6,3.25,0))}g.add(b(4.2,.3,.65,color,0,3.4,0));group.add(g)}
function bridge(group,x,z,color){const g=new T.Group();g.position.set(x,0,z);g.add(b(8,.35,3.1,color,0,.42,0));for(const q of [-1,1]){g.add(b(8,.15,.16,0x776c61,0,1.4,q*1.35));for(let k=-3;k<=3;k+=2)g.add(b(.15,.95,.15,0x776c61,k,.95,q*1.35))}group.add(g)}
function zoneProps(group,zone,r){if(zone==='forest'){
 for(const [x,z] of [[-30,20],[30,22],[-30,-16],[30,-22],[-19,-33],[23,-35]])bamboo(group,x,z,r);
 shrine(group,-24,-25,0x587a59);pavilion(group,28,-29,0x4e806c);
 for(const [x,z] of [[-10,28],[10,6],[-10,-17],[10,-31]])lantern(group,x,z);
 const flowers=[];for(let i=0;i<155;i++){let x=r()*92-46,z=r()*92-46;if(Math.abs(x)<7||!safe(x,z))continue;flowers.push([x,.13,z,.12,.17,.12,r()*6.28])}instanced(group,new T.IcosahedronGeometry(1,0),[0xeab3cc,0xffe5a6,0xadd4ec,0x9cd99d],flowers);
}else if(zone==='valley'){
 pavilion(group,28,-27,0x507f78);bridge(group,-36,4,0x9b9789);ruin(group,-25,-24,0x758f86);
 for(const [x,z] of [[-26,27],[28,20],[-29,-12],[28,-9]])crystal(group,x,z,0x87e2dd,r);
 for(const [x,z] of [[-10,22],[10,0],[-10,-24]])lantern(group,x,z,0xb8eddb);
 const reeds=[];for(let i=0;i<90;i++){let x=-39+r()*8,z=r()*85-42;reeds.push([x,.25,z,.13,.5+r()*.45,.13,r()*6.28])}instanced(group,new T.ConeGeometry(1,1,5),[0x4c997b,0x6ca98b,0x83baa0],reeds);
}else if(zone==='dungeon'){
 for(const [x,z] of [[-29,25],[29,25],[-29,-25],[29,-25]])ruin(group,x,z,0x657774);
 shrine(group,27,-30,0x4c6569);
 for(const [x,z] of [[-19,29],[19,29],[-19,-4],[19,-4],[-19,-32],[19,-32]])crystal(group,x,z,0x74d8d7,r);
 const tiles=[];for(let i=0;i<75;i++){let x=r()*89-44,z=r()*90-45;if(Math.abs(x)<10)continue;tiles.push([x,.12,z,.45,.15,.8,r()*6.28])}instanced(group,new T.BoxGeometry(1,1,1),[0x647874,0x5b6e6a,0x86978d],tiles);
}else if(zone==='firelands'){
 for(const [x,z] of [[-28,24],[29,21],[-28,-28],[28,-27]])ruin(group,x,z,0x513c37);
 shrine(group,30,-34,0x7d3c31);
 for(const [x,z] of [[-23,5],[24,-8],[-34,-16],[34,32]])crystal(group,x,z,0xf3793f,r);
 const embers=[];for(let i=0;i<115;i++){let x=r()*92-46,z=r()*92-46;if(Math.abs(x)<9)continue;embers.push([x,.12,z,.2,.06,.2,r()*6.28])}instanced(group,new T.DodecahedronGeometry(1,0),[0xd77b45,0x9f5438,0x6e3933],embers);
}else if(zone==='snowlands'){
 shrine(group,30,-31,0x608aa5);pavilion(group,-28,26,0x739bb6);
 for(const [x,z] of [[-28,-25],[29,25],[-34,8],[33,-9]])crystal(group,x,z,0xa6f1fc,r);
 const drifts=[];for(let i=0;i<100;i++){let x=r()*92-46,z=r()*92-46;if(Math.abs(x)<9)continue;drifts.push([x,.11,z,.55+r(),.17,.4+r()*.8,r()*6.28])}instanced(group,new T.IcosahedronGeometry(1,0),[0xddeff4,0xc7e4ee,0xeff7f6],drifts);
 for(const [x,z] of [[-10,27],[10,-5],[-10,-29]])lantern(group,x,z,0xa1efff);
}else if(zone==='skylands'){
 shrine(group,-28,-27,0xb4a06c);pavilion(group,29,26,0xd1b57d);
 for(const [x,z] of [[-29,20],[30,-18],[-33,-3],[30,-35]])crystal(group,x,z,0xffe2a3,r);
 const petals=[];for(let i=0;i<125;i++){let x=r()*91-45,z=r()*90-45;if(Math.abs(x)<9)continue;petals.push([x,.11,z,.17,.055,.26,r()*6.28])}instanced(group,new T.IcosahedronGeometry(1,0),[0xf0d1dd,0xf7e8c1,0xd5e8e7],petals);
 for(const [x,z] of [[-11,25],[11,0],[-11,-27]])lantern(group,x,z,0xffe6ad);
}}
function decorate(zone,world){if(!['forest','valley','dungeon','firelands','snowlands','skylands'].includes(zone))return;const r=rng(seedFor('taichu-v197-'+zone));const group=new T.Group();group.name='V197_'+zone;tilework(group,zone,r);zoneProps(group,zone,r);world.add(group)}
window.TaichuWorld197={decorate};
})();
