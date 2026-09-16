import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as Three from '../dist/vendor/three.module.js';

function setup(reduced=false){
  const elements=new Map();
  function element(){const handlers=new Map(),classes=new Set(),captures=new Set();return {hidden:false,clientWidth:800,clientHeight:600,handlers,classes,addEventListener(name,fn){handlers.set(name,fn);},emit(name,event={}){handlers.get(name)?.(event);},getBoundingClientRect(){return {left:0,top:0,width:800,height:600};},setPointerCapture(id){captures.add(id);},hasPointerCapture(id){return captures.has(id);},releasePointerCapture(id){captures.delete(id);},focus(){this.focused=true;},classList:{add(v){classes.add(v);},remove(v){classes.delete(v);},toggle(v,on){on?classes.add(v):classes.delete(v);}}};}
  for(const id of ['#scene-wrap','#axis-canvas','#scene-reset','#scene-fallback','.shape-selector'])elements.set(id,element());
  const buttons=[element(),element()];buttons[0].dataset={rotate:'-1'};buttons[1].dataset={rotate:'1'};
  const window=element();Object.assign(window,{devicePixelRatio:1,innerHeight:600,scrollY:0,matchMedia:()=>({matches:reduced})});
  let frame,rendered,camera;
  const THREE={...Three,WebGLRenderer:class{setPixelRatio(){}setSize(){}render(scene,view){rendered=scene;camera=view;}dispose(){}},PMREMGenerator:class{fromScene(){return {texture:new Three.Texture()};}dispose(){}}};
  const observer=class{observe(){}disconnect(){}};
  const source=readFileSync(new URL('../dist/scene.js',import.meta.url),'utf8').replace(/^\uFEFF/,'').replace(/^import .*;\r?\n/gm,'');
  vm.runInNewContext(source,{THREE,RoomEnvironment:class{dispose(){}},document:{hidden:false,documentElement:{dataset:{theme:'dark'}},querySelector:s=>elements.get(s),querySelectorAll:()=>buttons},window,ResizeObserver:observer,IntersectionObserver:observer,performance:{now:()=>0},requestAnimationFrame:fn=>{frame=fn;},console});
  const tick=()=>frame(16);tick();
  assert.equal(elements.get('#axis-canvas').hidden,false,'scene initialized');
  rendered.updateMatrixWorld(true);camera.updateMatrixWorld(true);
  const ray=new Three.Raycaster();let hit;
  for(let y=200;y<400&&!hit;y+=10)for(let x=300;x<500&&!hit;x+=10){ray.setFromCamera(new Three.Vector2(x/800*2-1,-y/600*2+1),camera);if(ray.intersectObject(rendered.children[0].children[0]).length)hit={x,y};}
  assert.ok(hit,'geometry has a draggable visible surface');
  return {canvas:elements.get('#axis-canvas'),wrap:elements.get('#scene-wrap'),reset:elements.get('#scene-reset'),buttons,window,tick,group:rendered.children[0],hit};
}
const down=(type='mouse',x=400,y=300)=>({pointerId:1,isPrimary:true,button:0,pointerType:type,clientX:x,clientY:y});
const move=(x,y,type='mouse')=>({pointerId:1,pointerType:type,clientX:x,clientY:y});

test('drag rotates a hit sculpture, freezes automatic movement and resets',()=>{
 const s=setup(),{x,y}=s.hit;s.canvas.emit('pointerdown',down('mouse',x,y));assert.equal(s.canvas.hasPointerCapture(1),true);s.canvas.emit('pointermove',move(x+50,y+20));s.tick();assert.ok(s.group.rotation.y>.4);assert.ok(s.group.rotation.x>.1);assert.ok(s.wrap.classes.has('is-dragging'));s.canvas.emit('pointerup');assert.equal(s.canvas.hasPointerCapture(1),false);const angle=s.group.rotation.y;s.tick();assert.equal(s.group.rotation.y,angle);s.reset.emit('click');assert.equal(s.group.rotation.y,0);assert.equal(s.group.children[0].rotation.y,-.4);
});
test('background does not capture; vertical touch leaves scroll available',()=>{
 const s=setup(),{x,y}=s.hit;s.canvas.emit('pointerdown',down('touch',0,0));assert.equal(s.canvas.hasPointerCapture(1),false);s.canvas.emit('pointerdown',down('touch',x,y));s.canvas.emit('pointermove',move(x+2,y+40,'touch'));assert.equal(s.canvas.hasPointerCapture(1),false);assert.equal(s.wrap.classes.has('is-dragging'),false);s.canvas.emit('pointerdown',down('touch',x,y));s.canvas.emit('pointermove',move(x+40,y+2,'touch'));s.tick();assert.ok(s.group.rotation.y>.3);assert.equal(s.group.rotation.x,0);s.canvas.emit('pointercancel');assert.equal(s.canvas.hasPointerCapture(1),false);
});
test('keyboard and buttons work with reduced motion; shape change resets',()=>{
 const s=setup(true);let prevented=false;s.canvas.emit('keydown',{key:'ArrowRight',preventDefault(){prevented=true;}});s.tick();assert.equal(prevented,true);assert.equal(s.group.rotation.y,.18);s.buttons[1].emit('click');s.tick();assert.equal(s.group.rotation.y,.48);s.canvas.emit('keydown',{key:'ArrowUp',preventDefault(){}});s.tick();assert.equal(s.group.rotation.x,-.18);s.window.emit('axis-shape',{detail:1});s.tick();assert.equal(s.group.rotation.y,0);assert.equal(s.group.children[0].geometry.type,'TorusGeometry');s.canvas.emit('keydown',{key:'Home',preventDefault(){}});assert.equal(s.group.rotation.x,0);
});
