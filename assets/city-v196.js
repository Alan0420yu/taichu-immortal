/* V1.9.6 仙城巡遊：巡邏路徑、行走動畫、避開主建築的路線、效能自適應 */
(function(global){'use strict';
const T=global.THREE;if(!T)return;
let walkers=[],root=null,elapsed=0,frames=0,slow=0,fast=0,quality=1;
function material(c){return new T.MeshLambertMaterial({color:c,flatShading:true})}
const shared={skin:material(0xd6af92),hair:material(0x302d36),shoe:material(0x3d393c),gold:material(0xbba36a)};
function mesh(group,geo,mat,x,y,z){const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=false;o.receiveShadow=false;group.add(o);return o}
function npc(x,z,role,color,route,speed){const g=new T.Group();g.position.set(x,0,z);root.add(g);
 const robe=material(color),sleeve=material(new T.Color(color).multiplyScalar(.78));
 mesh(g,new T.CylinderGeometry(.26,.4,1.05,7),robe,0,1.0,0);
 mesh(g,new T.SphereGeometry(.28,9,7),shared.skin,0,1.75,0);
 mesh(g,new T.BoxGeometry(.54,.18,.38),shared.hair,0,2.02,-.02);
 const arms=[],legs=[];
 for(const s of [-1,1]){
  const a=new T.Group();a.position.set(s*.35,1.48,0);g.add(a);mesh(a,new T.BoxGeometry(.19,.67,.24),sleeve,0,-.32,0);arms.push({joint:a,side:s});
  const l=new T.Group();l.position.set(s*.17,.61,0);g.add(l);mesh(l,new T.BoxGeometry(.2,.55,.24),shared.shoe,0,-.28,0);legs.push({joint:l,side:s});
 }
 if(role==='guard'){mesh(g,new T.ConeGeometry(.34,.36,7),shared.gold,0,2.24,0);mesh(g,new T.BoxGeometry(.09,1.35,.09),shared.gold,.49,1.16,.1)}
 if(role==='monk'){const hat=mesh(g,new T.ConeGeometry(.57,.29,9),shared.gold,0,2.11,0);hat.rotation.z=.06}
 const points=route.map(([a,b])=>new T.Vector2(a,b));
 walkers.push({g,arms,legs,points,target:1,role,speed,phase:walkers.length*.83,wait:0});
}
function install(add){walkers=[];elapsed=0;frames=0;slow=0;fast=0;root=new T.Group();root.name='Taichu-V196-Patrols';add(root);
 // 城門守衛：沿城門前東西向路段往返，避開主建築與中央靈泉
 npc(-5,-34,'guard',0x476b7a,[[-5,-34],[-11,-34],[-11,-29],[-5,-29]],1.35);
 npc(5,-34,'guard',0x476b7a,[[5,-34],[11,-34],[11,-29],[5,-29]],1.35);
 // 外環巡城：兩側寬敞街道；不穿越中央建築
 npc(-32,-27,'guard',0x596e82,[[-32,-27],[-32,-17],[-32,-2],[-32,12],[-32,26],[-32,36]],1.18);
 npc(32,35,'guard',0x596e82,[[32,35],[32,26],[32,12],[32,-2],[32,-17],[32,-27]],1.18);
 // 生活區散步修士：固定路線，不靠近建築入口
 npc(-10,-27,'monk',0x8b749a,[[-10,-27],[-10,-19],[-10,-13],[-10,-27]],.95);
 npc(10,-26,'monk',0x779c88,[[10,-26],[10,-18],[10,-12],[10,-26]],.9);
 npc(-30,6,'monk',0x8b8a6a,[[-30,6],[-30,12],[-30,21],[-30,6]],.83);
 npc(30,9,'monk',0x977c8e,[[30,9],[30,16],[30,24],[30,9]],.87);
 // 主城街道南段
 npc(-3,-39,'monk',0x719b8d,[[-3,-39],[-3,-30],[-3,-24],[-3,-39]],.85);
 npc(3,-22,'monk',0x8a9ba8,[[3,-22],[3,-29],[3,-38],[3,-22]],.88);
}
function update(dt,renderer){if(!root||!root.parent)return;elapsed+=dt;
 for(const w of walkers){if(w.wait>0){w.wait-=dt;continue}const goal=w.points[w.target];const dx=goal.x-w.g.position.x,dz=goal.y-w.g.position.z,d=Math.hypot(dx,dz);
 if(d<.16){w.target=(w.target+1)%w.points.length;w.wait=w.role==='guard'?.45:.25;continue}
 const step=Math.min(d,w.speed*dt);w.g.position.x+=dx/d*step;w.g.position.z+=dz/d*step;
 const heading=Math.atan2(dx,dz);let diff=Math.atan2(Math.sin(heading-w.g.rotation.y),Math.cos(heading-w.g.rotation.y));w.g.rotation.y+=diff*Math.min(1,dt*7);
 const cycle=elapsed*7*w.speed+w.phase;
 for(const a of w.arms)a.joint.rotation.x=Math.sin(cycle)*.36*a.side;
 for(const l of w.legs)l.joint.rotation.x=-Math.sin(cycle)*.38*l.side;
 }
 // 每 3 秒估算 FPS，僅調整像素比例，不改變玩法/鏡頭
 frames++;if(elapsed>=3){const fps=frames/elapsed;frames=0;elapsed=0;
 if(fps<32){slow++;fast=0}else if(fps>55){fast++;slow=0}else{slow=0;fast=0}
 if(slow>=2&&quality>0.75){quality=Math.max(.75,quality-.12);slow=0;renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)*quality)}
 if(fast>=3&&quality<1){quality=Math.min(1,quality+.08);fast=0;renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)*quality)}
 }
}
global.TaichuCity196={install,update};
})(window);
