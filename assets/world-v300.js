/* 太初仙域 V3.0.0 - 七景美術里程碑。獨立視覺模組，不增加碰撞與存檔欄位。 */
(function(){'use strict';
const T=window.THREE;if(!T)return;
const configs={
city:{a:0xd7b887,b:0x7a8f79,c:0xfce9a8,kind:'pagoda'},
forest:{a:0x466b48,b:0x8fbb79,c:0xb4f3a5,kind:'tree'},
valley:{a:0x5b9c96,b:0xa6d8c2,c:0xa7fff1,kind:'crystal'},
dungeon:{a:0x3c5865,b:0x668f91,c:0x88e7ed,kind:'portal'},
firelands:{a:0x68382f,b:0x9f5c3e,c:0xffa04e,kind:'spire'},
snowlands:{a:0x7799b4,b:0xbdd8e9,c:0xc7f5ff,kind:'ice'},
skylands:{a:0x859b89,b:0xc7c9a3,c:0xffe7a2,kind:'ring'}
};
let current=null,elapsed=0,quality=1,lastCheck=0;
function q(){try{let v=Number(localStorage.getItem('taichu_visual_quality'));return Number.isFinite(v)?Math.max(0,Math.min(2,Math.floor(v))):1}catch(e){return 1}}
quality=q();
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296}}
const mats=new Map();function mat(color,glow=false){const key=color+'-'+glow;if(!mats.has(key))mats.set(key,new T.MeshStandardMaterial({color,roughness:glow?.48:.94,metalness:glow?.14:0,flatShading:true,emissive:glow?color:0,emissiveIntensity:glow?.35:0}));return mats.get(key)}
function mesh(g,geo,color,x,y,z,s=1,glow=false){const o=new T.Mesh(geo,mat(color,glow));o.position.set(x,y,z);o.scale.setScalar(s);g.add(o);return o}
function pillar(g,x,z,h,c){mesh(g,new T.CylinderGeometry(.36,.54,h,7),c,x,h/2,z);mesh(g,new T.ConeGeometry(.58,.9,7),c,x,h+.35,z)}
function landmark(g,c,x,z){const a=c.a,b=c.b,l=c.c,k=c.kind;const root=new T.Group();root.position.set(x,0,z);g.add(root);
if(k==='pagoda'){pillar(root,0,0,4.4,a);for(let j=0;j<3;j++){const roof=mesh(root,new T.ConeGeometry(2.4-j*.4,.75,8),b,0,2.1+j*1.3,0);roof.rotation.y=Math.PI/8}mesh(root,new T.SphereGeometry(.3,8,6),l,0,5.2,0,1,true)}
if(k==='tree'){mesh(root,new T.CylinderGeometry(.5,.9,4.5,7),a,0,2.25,0);for(let j=0;j<3;j++)mesh(root,new T.IcosahedronGeometry(2.1-j*.27,1),j%2?b:a,0,4.2+j*1.05,0);mesh(root,new T.OctahedronGeometry(.3),l,0,7.7,0,1,true)}
if(k==='crystal'||k==='ice'){for(let j=0;j<6;j++){let ang=j*Math.PI/3;const p=mesh(root,new T.OctahedronGeometry(.65,0),j%2?b:l,Math.cos(ang)*1.5,1.3+(.3*j%3),Math.sin(ang)*1.5,1.5+j*.08,j%2===0);p.scale.y=2.2+j*.14}mesh(root,new T.OctahedronGeometry(1.25,0),l,0,3.2,0,1.25,true)}
if(k==='portal'){pillar(root,-2,0,4,a);pillar(root,2,0,4,a);const ring=mesh(root,new T.TorusGeometry(2, .27,7,28),l,0,3.3,0,1,true);ring.rotation.y=.14;root.userData.spin=ring}
if(k==='spire'){for(let j=0;j<5;j++){let ang=j*2*Math.PI/5;pillar(root,Math.cos(ang)*1.9,Math.sin(ang)*1.9,2.8+(j%3)*1.3,a)}mesh(root,new T.ConeGeometry(1.3,5.5,6),b,0,3,0);mesh(root,new T.OctahedronGeometry(.65),l,0,6.2,0,1,true)}
if(k==='ring'){for(let j=0;j<4;j++){const ring=mesh(root,new T.TorusGeometry(1.5+j*.38,.11,6,40),j%2?l:b,0,3.3+j*.34,0,1,j%2===1);ring.rotation.x=Math.PI/2.8+j*.2;(root.userData.rings||(root.userData.rings=[])).push(ring)}pillar(root,0,0,2.2,a)}
return root}
const bladeGeo=new T.ConeGeometry(1,1.8,5),rockGeo=new T.DodecahedronGeometry(1,0),patchGeo=new T.CylinderGeometry(1,1,1,7),dummy=new T.Object3D();
function instanced(g,geo,color,points){if(!points.length)return;const o=new T.InstancedMesh(geo,mat(color),points.length);points.forEach((p,i)=>{dummy.position.set(p[0],p[1],p[2]);dummy.rotation.set(0,p[6],0);dummy.scale.set(p[3],p[4],p[5]);dummy.updateMatrix();o.setMatrixAt(i,dummy.matrix)});o.instanceMatrix.needsUpdate=true;o.frustumCulled=false;g.add(o)}
function build(zone,world){if(!world||!configs[zone])return null;let g=world.getObjectByName('V300_'+zone);if(g)return g;const c=configs[zone],r=rng(30000+Object.keys(configs).indexOf(zone)*937);g=new T.Group();g.name='V300_'+zone;g.userData.floaters=[];
// Keep major paths and the city plaza clear. Landmarks are intentionally beyond the travel corridor.
const locations=zone==='city'?[[36,-34],[-36,-34]]:[[30,-30],[-30,-28],[31,24]];
for(const [x,z] of locations){const landmarkGroup=landmark(g,c,x,z);g.userData.floaters.push({o:landmarkGroup,phase:r()*6.28,origin:landmarkGroup.position.y});}
const rock=[],patch=[],grass=[];const city=zone==='city';
for(let i=0;i<(city?70:130);i++){const x=(r()-.5)*88,z=(r()-.5)*88;if(Math.abs(x)<(city?29:14)||city&&Math.abs(z)<26||Math.hypot(x-30,z+30)<8||Math.hypot(x+30,z+28)<8)continue;const s=.3+r()*.7;rock.push([x,.14*s,z,s,.5*s,s,r()*6.28]);}
for(let i=0;i<(city?90:180);i++){const x=(r()-.5)*88,z=(r()-.5)*88;if(Math.abs(x)<(city?30:13)||city&&Math.abs(z)<27)continue;const s=.35+r()*.9;patch.push([x,.012,z,s,.017,s*.85,r()*6.28]);}
for(let i=0;i<(city?45:110);i++){const x=(r()-.5)*88,z=(r()-.5)*88;if(Math.abs(x)<(city?30:14)||city&&Math.abs(z)<27)continue;const s=.24+r()*.48;grass.push([x,.25*s,z,s,s,s,r()*6.28]);}
instanced(g,rockGeo,c.a,rock);instanced(g,patchGeo,c.b,patch);instanced(g,bladeGeo,c.b,grass);
// V3 glow motes: deterministic and limited; no individual point lights.
const orbGeo=new T.OctahedronGeometry(.14,0);for(let i=0;i<(city?10:18);i++){let x=(r()-.5)*78,z=(r()-.5)*78;if(Math.abs(x)<12)x+=(x>=0?13:-13);const o=mesh(g,orbGeo,c.c,x,1.5+r()*3,z,.6+r()*.7,true);g.userData.floaters.push({o,phase:r()*6.28,origin:o.position.y,orb:true})}
world.add(g);return g}
function activate(zone,world){current=build(zone,world);quality=q();if(current)current.visible=quality>0}
function update(zone,dt){if(!current||current.name!=='V300_'+zone)return;elapsed+=Math.min(Math.max(dt||0,0),.1);if(elapsed-lastCheck>1){lastCheck=elapsed;quality=q();current.visible=quality>0}if(quality===0)return;const t=elapsed;for(const f of current.userData.floaters){if(f.orb)f.o.position.y=f.origin+Math.sin(t*.9+f.phase)*.28;else {if(f.o.userData.spin)f.o.userData.spin.rotation.z=t*.13;if(f.o.userData.rings)f.o.userData.rings.forEach((ring,i)=>ring.rotation.z=t*(i%2?-.09:.09));}}}
window.TaichuWorld300={activate,update};
})();