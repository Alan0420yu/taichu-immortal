/* 太初仙域 V1.9 - 原創程序化主城美術資產。無第三方模型依賴。 */
(function(global){'use strict';
 const T=global.THREE;if(!T)return;
 const M=(c,em=0)=>new T.MeshStandardMaterial({color:c,roughness:.82,metalness:.04,emissive:em||0x000000,emissiveIntensity:em?.23:0});
 const mesh=(g,c,x=0,y=0,z=0)=>{const o=new T.Mesh(g,typeof c==='number'?M(c):c);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o};
 const cube=(w,h,d,c,x=0,y=0,z=0)=>mesh(new T.BoxGeometry(w,h,d),c,x,y,z);
 const cyl=(rt,rb,h,c,x=0,y=0,z=0,n=10)=>mesh(new T.CylinderGeometry(rt,rb,h,n),c,x,y,z);
 const sphere=(r,c,x=0,y=0,z=0)=>mesh(new T.IcosahedronGeometry(r,1),c,x,y,z);
 const roof=(g,w,d,y,color,up=.9)=>{
  // 兩片斜屋面與翹起的飛簷端部：屋頂不再是圓錐。
  for(const s of [-1,1]){
   const sh=cube(w/2+.55,.20,d+.65,color,s*(w/4),y+up*.48,0);
   sh.rotation.z=-s*Math.atan2(up,w/2);g.add(sh);
   const lip=cube(.48,.23,d+1.0,color,s*(w/2+.16),y+.15,0);lip.rotation.z=s*.22;g.add(lip);
   for(const zz of [-d/2-.43,d/2+.43]){
    const end=cube(.26,.19,.32,0xd3b776,s*(w/2+.25),y+.21,zz);end.rotation.z=s*.22;g.add(end);
   }
  }
  const ridge=cube(.33,.28,d+.9,0xc8ac79,0,y+up+.08,0);g.add(ridge);
 };
 function timber(g,w,h,d,wall=0xeee1c7){
  g.add(cube(w,h,d,wall,0,h/2,0));
  for(const x of [-w/2+.3,w/2-.3])for(const z of [-d/2+.25,d/2-.25])g.add(cyl(.19,.22,h+.15,0x714738,x,h/2,z,8));
  for(const y of [.5,h-.4])for(const z of [-d/2-.05,d/2+.05])g.add(cube(w+.18,.18,.18,0x704b39,0,y,z));
  g.add(cube(1.65,2.1,.12,0x5c4032,0,1.05,d/2+.08));
  for(const x of [-w*.31,w*.31]){
   g.add(cube(.98,1.08,.13,0x83b7ae,x,2.0,d/2+.1));
   g.add(cube(.11,1.12,.17,0x654331,x,2.0,d/2+.19));
   g.add(cube(1.03,.12,.17,0x654331,x,2.0,d/2+.2));
  }
 }
 function lantern(g,x,y,z){g.add(cyl(.1,.1,.38,0x9d7c4f,x,y+.4,z,6));g.add(cyl(.3,.25,.58,M(0xffd293,0xffac52),x,y,z,8));g.add(cyl(.34,.34,.11,0x8e4b3e,x,y+.33,z,8));g.add(cyl(.34,.34,.11,0x8e4b3e,x,y-.33,z,8));}
 function sign(g,z,y=3.45){g.add(cube(2.7,.67,.18,0x463e38,0,y,z));for(const x of [-1.45,1.45])g.add(sphere(.11,0xffd27d,x,y,z+.12));}
 function createBuilding(name){const g=new T.Group();
  if(name==='宗門大殿'){
   g.add(cyl(5.1,5.4,.6,0xc7c6b7,0,.3,0,8));timber(g,9.5,5.0,6.8,0xe9e1ce);
   roof(g,11,8,5.15,0x346f76,1.75);
   for(const x of [-4.3,4.3])for(const z of [-3.15,3.15])g.add(cyl(.32,.36,5.5,0x954d3f,x,2.75,z));
   g.add(cube(6.3,2.1,4.6,0xd7d9c7,0,7.0,0));roof(g,7.6,5.4,8.15,0x477f86,1.4);
   g.add(cube(3.4,1.35,2.9,0xd8c9aa,0,9.6,0));roof(g,4.5,3.7,10.35,0x2e6870,.95);
   for(let i=0;i<5;i++)g.add(cube(7.5-i*.85,.28,1.1,0xc6bba6,0,.12+i*.21,5.2+i*.7));
   for(const x of [-4.7,4.7]){g.add(sphere(.67,0x9caaac,x,.7,5.1));lantern(g,x,4.5,3.8)}
   sign(g,3.65,4.2);
  }else if(name==='靈寶商會'){
   timber(g,7.8,4.8,5.9,0xeee0c9);roof(g,9.2,7,5.0,0x8b4e43,1.35);
   g.add(cube(6.8,2.45,4.4,0xd9bf9c,0,6.2,-.25));roof(g,7.9,5.3,7.55,0xa7654d,1.12);
   g.add(cube(8.1,.2,1.6,0x6b4936,0,3.2,3.75));
   for(const x of [-3.2,3.2]){g.add(cyl(.13,.13,2.6,0x714d37,x,4.35,4.2));lantern(g,x,4.7,3.65);g.add(cube(1.5,.85,1.0,0x9b7045,x,.43,4.7));g.add(sphere(.47,0xf5cf7e,x,1.38,4.7));}
   sign(g,3.13);
  }else if(name==='丹鼎閣'){
   g.add(cyl(4.1,4.25,.45,0xc3b9a6,0,.23,0,8));g.add(cyl(3.3,3.6,5.3,0xd4b99b,0,3,0,8));
   for(let i=0;i<8;i++){const a=i*Math.PI/4;g.add(cyl(.18,.18,5.5,0x704e3a,Math.sin(a)*3.35,3,Math.cos(a)*3.35,6))}
   g.add(mesh(new T.ConeGeometry(5.2,2.25,8),0x7e618e,0,6.7,0));
   g.add(cyl(2.25,2.55,2.6,0xcbb8a5,0,8.8,0,8));g.add(mesh(new T.ConeGeometry(3.7,1.9,8),0x6a577c,0,10.85,0));
   g.add(cyl(.85,1.02,1.4,0x536e67,-2.4,.8,4.6,12));g.add(mesh(new T.TorusGeometry(.83,.16,8,20),0xc2ad7a,-2.4,1.55,4.6).rotateX(Math.PI/2));
   for(const x of [1.6,2.4,3.2])g.add(sphere(.3,0x77dfac,x,.6,4.4));sign(g,3.55,3.7);
  }else if(name==='修煉洞府'){
   for(let i=0;i<13;i++){const a=i*Math.PI*2/13,r=3.4+(i%3)*.35;const stone=mesh(new T.DodecahedronGeometry(1.5+(i%4)*.2,0),i%2?0x829c94:0x738d87,Math.sin(a)*r,1.5,Math.cos(a)*r-.9);stone.scale.y=1.4+(i%3)*.15;g.add(stone)}
   g.add(mesh(new T.SphereGeometry(2.05,16,12,0,Math.PI*2,0,Math.PI),0x394d4c,0,2.15,2.4));
   g.add(cube(3.4,3.5,.15,0x344b4a,0,1.75,2.75));
   const halo=mesh(new T.TorusGeometry(2.2,.12,8,36),M(0x9bdbe3,0x6dc4dd),0,2.2,2.82);g.add(halo);
   for(const x of [-3,3]){g.add(mesh(new T.OctahedronGeometry(.62),M(0x95dce6,0x55bedb),x,1.1,3.4));g.add(cyl(.6,.75,.3,0xb9ada2,x,.2,3.4))}
   g.add(cube(4.3,.22,1.8,0xc3b8a2,0,.12,4.0));
  }else{
   timber(g,8.3,4.7,6.4,0xe4d5b7);roof(g,9.6,7.4,4.95,0x9d6e4b,1.15);
   g.add(cube(6.9,2.25,4.9,0xd5b998,0,6.05,-.4));roof(g,8.1,5.8,7.3,0x815b45,1.05);
   g.add(cube(8.4,.2,1.6,0x76533b,0,3.2,4.0));
   for(const x of [-3.3,3.3]){g.add(cyl(.15,.15,2.5,0x76533b,x,4.25,4.4));lantern(g,x,4.25,3.65)}
   for(const x of [-2.4,2.4]){g.add(cyl(.75,.82,.52,0x97714d,x,.3,5.0,8));g.add(cyl(.68,.68,.11,0xb9a07a,x,.61,5,8))}sign(g,3.35);
  }
  return g;
 }
 function decorate(add,obstacle){
  // 以既有 95x95 城市尺度佈置；保留中央幹道、建築門口與傳送點。
  const place=(obj,x,z,rot=0)=>{obj.position.set(x,0,z);obj.rotation.y=rot;add(obj);return obj};
  const stand=(x,z,shade)=>{const g=new T.Group();g.add(cube(2.9,.18,1.7,0x8e6344,0,1.05,0));for(const xx of [-1.2,1.2])for(const zz of [-.65,.65])g.add(cyl(.1,.12,1.05,0x775039,xx,.52,zz,6));g.add(cube(3.25,.16,2.05,shade,0,2.85,0));for(const xx of [-1.35,1.35])g.add(cyl(.09,.1,1.7,0x76563e,xx,1.98,-.75,6));for(let i=0;i<5;i++)g.add(sphere(.24,[0x8fd5a3,0xf0d58b,0xa4b6e8][i%3],-1+i*.5,1.28,.25));place(g,x,z);obstacle(x,z,1.25)};
  [[-33,-12,0xc86e6a],[-33,4,0x6b91a8],[32,-12,0xd4a66c],[32,4,0x8b76a8],[-31,26,0x77a393]].forEach(v=>stand(...v));
  const bamboo=(x,z)=>{const g=new T.Group();for(let i=0;i<5;i++){const xx=(i%3-1)*.35,zz=(Math.floor(i/3)-.5)*.5,h=2.8+(i%3)*.55;g.add(cyl(.065,.08,h,0x4c9774,xx,h/2,zz,7));for(let k=0;k<3;k++){const leaf=mesh(new T.ConeGeometry(.46,.85,5),0x65ae79,xx+.18,h*.5+k*.5,zz);leaf.rotation.z=.55;g.add(leaf)}}place(g,x,z)};
  [[-37,13],[-38,18],[-36,23],[36,19],[37,24],[-36,35],[36,35]].forEach(v=>bamboo(...v));
  const flower=(x,z,c)=>{const g=new T.Group();g.add(cyl(.025,.03,.5,0x5d9d65,0,.25,0,5));g.add(sphere(.17,c,0,.55,0));place(g,x,z)};
  for(let i=0;i<105;i++){const x=-40+(i*17%81),z=-37+(i*29%76);if(Math.abs(x)<8||Math.hypot(x,z-8)<13||[[-18,-7],[18,-7],[-18,17],[18,17],[-18,33]].some(p=>Math.hypot(x-p[0],z-p[1])<8))continue;flower(x,z,[0xf2b9c5,0xe9dca2,0xc8b5e9][i%3])}
  const banner=(x,z,c)=>{const g=new T.Group();g.add(cyl(.11,.12,4.7,0x856448,0,2.35,0,7));g.add(cube(1.4,2.2,.09,c,.72,3.35,0));g.add(sphere(.22,0xe5c781,0,4.9,0));place(g,x,z)};
  [[-11,31,0x8a5874],[11,31,0x587d91],[-11,-27,0xa46b50],[11,-27,0x628c73]].forEach(v=>banner(...v));
  // 地面鋪石：以 InstancedMesh 減少 draw calls，不加入碰撞。
  const geometry=new T.BoxGeometry(1.1,.035,.7),material=M(0xd3c7af),tiles=new T.InstancedMesh(geometry,material,240),dummy=new T.Object3D();let count=0;
  for(let z=-32;z<=37;z+=2.3)for(let x of [-5.0,-2.5,2.5,5.0]){dummy.position.set(x+((Math.round(z)%2)*.18),.055,z);dummy.rotation.set(0,0,0);dummy.updateMatrix();tiles.setMatrixAt(count++,dummy.matrix)}
  for(let x=-29;x<=29;x+=2.3)for(let z of [-3,1]){if(count>=240)break;dummy.position.set(x,.06,z);dummy.rotation.set(0,0,0);dummy.updateMatrix();tiles.setMatrixAt(count++,dummy.matrix)}
  tiles.count=count;tiles.receiveShadow=true;add(tiles);
 }
 global.TaichuArt={createBuilding,decorate};
})(window);
