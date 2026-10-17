/* 太初仙域 V1.9.8：六境環境精修；純視覺物件，無碰撞、無存檔變更。 */
(function(){'use strict';
const T=window.THREE;if(!T)return;
const zones=['forest','valley','dungeon','firelands','snowlands','skylands'];
const palettes={
 forest:{soil:[0x365c42,0x54754d,0x78875b],foliage:[0x35704b,0x599263,0x83a46b],light:0xb4e7a0},
 valley:{soil:[0x557c72,0x76968a,0x9eb4a1],foliage:[0x458a79,0x73ae98,0xa2cdb7],light:0xa2f1df},
 dungeon:{soil:[0x384c4d,0x506968,0x778784],foliage:[0x50716b,0x6d9690,0x9fb7ae],light:0x84e3dc},
 firelands:{soil:[0x49302c,0x6d4036,0x89513a],foliage:[0x6d3730,0xa45032,0xc2773d],light:0xff9b58},
 snowlands:{soil:[0x92b5c2,0xb2d1db,0xd6e8eb],foliage:[0x6f9aa5,0xa4cbd0,0xe5f3f2],light:0xa7e9ff},
 skylands:{soil:[0x6f9c8d,0x9cbaa5,0xc8cdb1],foliage:[0x6cae91,0x9cc6ac,0xd8e2bb],light:0xffe9b3}
};
function random(seed){return()=>{seed|=0;seed=seed+0x6d2b79f5|0;let t=Math.imul(seed^seed>>>15,1|seed);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296}}
const materialCache=new Map();
function mat(color,glow=false){const key=color+'_'+glow;if(!materialCache.has(key))materialCache.set(key,new T.MeshStandardMaterial({color,roughness:glow?.55:.96,metalness:glow?.16:0,flatShading:true,emissive:glow?color:0,emissiveIntensity:glow?.35:0}));return materialCache.get(key)}
function scatter(g,geometry,colors,items){const dummy=new T.Object3D();colors.forEach((c,k)=>{const selected=items.filter((v,i)=>i%colors.length===k);if(!selected.length)return;const m=new T.InstancedMesh(geometry,mat(c),selected.length);selected.forEach((p,i)=>{dummy.position.set(p[0],p[1],p[2]);dummy.rotation.set(0,p[6]||0,0);dummy.scale.set(p[3],p[4],p[5]);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix)});m.instanceMatrix.needsUpdate=true;m.receiveShadow=true;m.frustumCulled=false;g.add(m)})}
function decorate(zone,world){
 if(!zones.includes(zone)||!world||world.getObjectByName('V198_'+zone))return;
 const p=palettes[zone],r=random(19800+zones.indexOf(zone)*1729),g=new T.Group();g.name='V198_'+zone;
 const ground=[],shrubs=[],stones=[];
 for(let i=0;i<260;i++){const x=r()*92-46,z=r()*92-46;if(Math.abs(x)<9&&Math.abs(z)<40)continue;
  const size=.35+r()*1.35;ground.push([x,.025,z,size,.022,size*.7,r()*6.283]);
 }
 for(let i=0;i<100;i++){const x=r()*89-44.5,z=r()*89-44.5;if(Math.abs(x)<12||Math.hypot(x,z-40)<10)continue;
  const s=.32+r()*.8;shrubs.push([x,.35*s,z,s,s*.9,s,r()*6.283]);
 }
 for(let i=0;i<75;i++){const x=r()*88-44,z=r()*88-44;if(Math.abs(x)<11)continue;
  const s=.24+r()*.6;stones.push([x,.11*s,z,s,s*.35,s*.7,r()*6.283]);
 }
 scatter(g,new T.CylinderGeometry(1,1,1,6),p.soil,ground);
 scatter(g,new T.IcosahedronGeometry(1,0),p.foliage,shrubs);
 scatter(g,new T.DodecahedronGeometry(1,0),p.soil,stones);
 // The edge markers keep the central travel corridor clear.
 const posts=[];for(let z=-33;z<=31;z+=8){for(const x of [-8.8,8.8])posts.push([x,.44,z,.16,.88,.16,0])}
 scatter(g,new T.CylinderGeometry(1,1,1,6),[p.soil[1],p.soil[2]],posts);
 const glow=mat(p.light,true),orbGeo=new T.IcosahedronGeometry(.22,1),lights=[];
 for(let i=0;i<20;i++){const x=(r()-.5)*84,z=(r()-.5)*84;if(Math.abs(x)<10)continue;
 const o=new T.Mesh(orbGeo,glow);o.position.set(x,1.1+r()*2.6,z);o.scale.setScalar(.5+r()*.8);g.add(o);lights.push({mesh:o,phase:r()*6.28,base:o.position.y})}
 g.userData.ambientLights=lights;world.add(g);
}
function update(zone,dt){const group=window.__taichuWorld198Current;if(!group||group.name!=='V198_'+zone)return;
 const t=performance.now()*.001;for(const [i,o] of group.userData.ambientLights.entries())o.mesh.position.y=o.base+Math.sin(t*1.15+o.phase)*.18;
}
function activate(zone,world){decorate(zone,world);window.__taichuWorld198Current=world?.getObjectByName('V198_'+zone)||null}
window.TaichuWorld198={activate,update};
})();