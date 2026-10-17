/* 太初仙域 V1.9.1 仙城繁華：獨立場景美術模組，不修改存檔資料 */
(function(global){'use strict';
const T=global.THREE;if(!T)return;
const material=(color,emissive=0)=>new T.MeshStandardMaterial({color,roughness:.75,metalness:.07,emissive:emissive||0,emissiveIntensity:emissive?.48:0});
const box=(w,h,d,c,x=0,y=0,z=0)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),material(c));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;return o};
const cylinder=(a,b,h,c,x=0,y=0,z=0,n=12)=>{const o=new T.Mesh(new T.CylinderGeometry(a,b,h,n),material(c));o.position.set(x,y,z);o.castShadow=true;return o};
const sphere=(r,c,x=0,y=0,z=0)=>{const o=new T.Mesh(new T.SphereGeometry(r,9,7),material(c));o.position.set(x,y,z);return o};
let animated=[];
function clear(){animated=[]}
function install(add){
 const make=(x,z,build)=>{const g=new T.Group();g.position.set(x,0,z);build(g);add(g);return g};
 // 靈泉水紋、環繞星塵、浮空水珠，所有動畫僅在主城更新
 const f=make(0,8,g=>{
  const water=new T.Mesh(new T.CircleGeometry(3.62,56),new T.MeshStandardMaterial({color:0x72dce7,emissive:0x2c8eab,emissiveIntensity:.18,metalness:.28,roughness:.2,transparent:true,opacity:.78}));water.rotation.x=-Math.PI/2;water.position.y=.965;g.add(water);
  for(let i=0;i<3;i++){const ring=new T.Mesh(new T.TorusGeometry(1.55+i*.7,.025,5,64),new T.MeshBasicMaterial({color:i===1?0xb3fff0:0xd6ffff,transparent:true,opacity:.42,depthWrite:false}));ring.rotation.x=Math.PI/2;ring.position.y=.99+i*.007;g.add(ring);animated.push({kind:'ripple',obj:ring,offset:i*1.8})}
  for(let i=0;i<14;i++){const a=i*Math.PI*2/14;const p=sphere(.085+(i%3)*.025,i%3?0x9ff8ff:0xfff3c9,Math.cos(a)*2.5,2.0+(i%4)*.23,Math.sin(a)*2.5);p.material=material(0xb5f9ff,0x6cc9e6);g.add(p);animated.push({kind:'orb',obj:p,angle:a,radius:2.45+(i%3)*.13,offset:i*.47})}
  const aura=new T.Mesh(new T.TorusGeometry(2.5,.065,7,60),new T.MeshBasicMaterial({color:0x9af8ff,transparent:true,opacity:.42,depthWrite:false}));aura.rotation.x=Math.PI/2.3;aura.position.y=3.05;g.add(aura);animated.push({kind:'aura',obj:aura});
 });
 // 路邊木質休憩長椅與盆栽，避開主路和建築門口
 const bench=(x,z,rot=0)=>make(x,z,g=>{g.rotation.y=rot;g.add(box(2.15,.18,.67,0x906449,0,.75,0));g.add(box(2.15,.78,.15,0x79523d,0,1.15,-.29));for(const xx of [-.82,.82]){g.add(box(.13,.75,.13,0x584c41,xx,.37,-.22));g.add(box(.13,.75,.13,0x584c41,xx,.37,.22))}});
 [[-11,-18,0],[11,-18,0],[-11,25,0],[11,25,0],[-30,-22,Math.PI/2],[30,-22,Math.PI/2]].forEach(p=>bench(...p));
 const planter=(x,z,color)=>make(x,z,g=>{g.add(cylinder(.54,.42,.63,0xb7a48e,0,.34,0,10));g.add(cylinder(.57,.57,.12,0xe0c9a5,0,.67,0,10));for(let i=0;i<7;i++){const a=i*Math.PI*2/7;g.add(sphere(.22,color,Math.cos(a)*.25,.89+(i%2)*.18,Math.sin(a)*.25))}});
 [[-10,-13,0xe8b7c9],[10,-13,0xb9d7ec],[-10,20,0xf4d7a3],[10,20,0xc8b9ec],[-27,31,0xf3b7cb],[27,31,0xb9e4ca]].forEach(p=>planter(...p));
 // 城門琉璃簷與迎賓燈籠（避免新增大型阻擋物）
 make(0,-35,g=>{for(const y of [7.52,8.08]){g.add(box(18.5-y*.17,.18,3.3,y>8?0x496f7a:0xb78b61,0,y,0))}for(const x of [-5.2,5.2]){g.add(cylinder(.055,.055,.55,0x9d7a51,x,6.95,1.3,6));g.add(cylinder(.31,.26,.54,0xffcc83,x,6.5,1.3,8));g.add(cylinder(.34,.34,.1,0x995b4c,x,6.81,1.3,8))}});
 // 巷口石燈：不添加碰撞，不影響原有通行與互動
 const lantern=(x,z)=>make(x,z,g=>{g.add(cylinder(.28,.38,.25,0xa5a79b,0,.15,0));g.add(cylinder(.16,.2,1.45,0x9a9c92,0,.98,0,8));g.add(box(.68,.14,.68,0x778783,0,1.75,0));const light=box(.48,.55,.48,0xffd9a2,0,2.08,0);light.material=material(0xffd9a2,0xffae58);g.add(light);g.add(box(.85,.13,.85,0x64766d,0,2.43,0))});
 [[-28,-28],[28,-28],[-28,8],[28,8],[-28,36],[28,36]].forEach(p=>lantern(...p));
}
function update(t){for(const a of animated){if(a.kind==='ripple'){const s=.92+.09*Math.sin(t*.8+a.offset);a.obj.scale.setScalar(s);a.obj.material.opacity=.3+.12*Math.sin(t*1.1+a.offset)}else if(a.kind==='orb'){const v=t*.3+a.angle;a.obj.position.x=Math.cos(v)*a.radius;a.obj.position.z=Math.sin(v)*a.radius;a.obj.position.y=2.15+.34*Math.sin(t*1.7+a.offset)}else if(a.kind==='aura'){a.obj.rotation.z=t*.14;a.obj.position.y=3.05+.12*Math.sin(t*.9)}}}
global.TaichuCity191={install,update,clear};
})(window);
