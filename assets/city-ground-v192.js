/* V1.9.2 青石仙街：僅裝飾主城地表；不影響碰撞、互動與存檔 */
(function(global){'use strict';
const T=global.THREE;if(!T)return;
function install(add){
 const root=new T.Group();root.name='V192_青石仙街';add(root);
 let seed=19241;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.97,metalness:0});
 // 三種灰褐石材：避免過白，並保持廣場、道路層次
 const colors=[0x858b7f,0x97978a,0xaaa697,0x777f75,0xb0aa97];
 const roadGeo=new T.BoxGeometry(1,1,1);
 const roadMats=colors.map(mat);
 const placements=colors.map(()=>[]);
 // 沿南北大道鋪設不規則石板，中心廣場留白供環形步道
 for(let z=-40;z<45;z+=1.45){
  if(z>-5&&z<21)continue;
  for(let x=-6.2;x<6.2;x+=1.55){
   const px=x+(rand()-.5)*.13,pz=z+(rand()-.5)*.16;
   placements[Math.floor(rand()*colors.length)].push([px,.051,pz,1.36,.045,1.26]);
  }
 }
 // 廣場環外圈鋪環狀碎石，留出中央靈泉與建築入口
 for(let r=12.9;r<16.8;r+=1.35){
  const n=Math.round(2*Math.PI*r/1.5);
  for(let j=0;j<n;j++){
   const a=2*Math.PI*j/n,px=Math.cos(a)*r,pz=8+Math.sin(a)*r;
   if(Math.abs(px)<7.5)continue;
   placements[Math.floor(rand()*colors.length)].push([px,.065,pz,1.16,.035,1.12]);
  }
 }
 const dummy=new T.Object3D();
 placements.forEach((arr,i)=>{
  if(!arr.length)return;
  const mesh=new T.InstancedMesh(roadGeo,roadMats[i],arr.length);
  arr.forEach((v,j)=>{dummy.position.set(v[0],v[1],v[2]);dummy.scale.set(v[3],v[4],v[5]);dummy.rotation.set(0,0,0);dummy.updateMatrix();mesh.setMatrixAt(j,dummy.matrix)});
  mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;mesh.frustumCulled=false;root.add(mesh);
 });
 // 地表深淺斑塊：稀疏苔草，避開主路與靈泉
 const patchColors=[0x587b60,0x628569,0x829774,0x506f59];
 const patchGeo=new T.CircleGeometry(1,7);
 patchColors.forEach((c,ci)=>{
  const items=[];
  for(let i=0;i<115;i++){
   const x=rand()*89-44.5,z=rand()*89-44.5;
   if(Math.abs(x)<8||Math.hypot(x,z-8)<17)continue;
   items.push([x,z,.28+rand()*.83,rand()*Math.PI]);
  }
  const mesh=new T.InstancedMesh(patchGeo,new T.MeshStandardMaterial({color:c,roughness:1,side:T.DoubleSide,transparent:true,opacity:.78,depthWrite:false}),items.length);
  items.forEach((v,j)=>{dummy.position.set(v[0],.031+ci*.001,v[1]);dummy.rotation.set(-Math.PI/2,0,v[3]);dummy.scale.set(v[2],v[2]*(.65+rand()*.5),1);dummy.updateMatrix();mesh.setMatrixAt(j,dummy.matrix)});
  mesh.instanceMatrix.needsUpdate=true;mesh.frustumCulled=false;root.add(mesh);
 });
 // 主街兩側的暖色碎石路肩
 const gravel=new T.InstancedMesh(new T.DodecahedronGeometry(.18,0),mat(0x837b68),280);
 let count=0;
 for(let i=0;i<280;i++){
  const side=i%2?-1:1,x=side*(7.25+rand()*1.1),z=rand()*82-40;
  if(z>-6&&z<23)continue;
  dummy.position.set(x,.07,z);dummy.rotation.set(rand(),rand()*6,rand());dummy.scale.setScalar(.45+rand()*.8);dummy.updateMatrix();gravel.setMatrixAt(count++,dummy.matrix);
 }
 gravel.count=count;gravel.instanceMatrix.needsUpdate=true;root.add(gravel);
}
global.TaichuGround192={install};
})(window);
