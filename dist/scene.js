import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
const wrap=document.querySelector('#scene-wrap'),canvas=document.querySelector('#axis-canvas'),reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
try{
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,9.5);const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
const material=new THREE.MeshPhysicalMaterial({color:0xd8fc71,metalness:.86,roughness:.21,clearcoat:1,clearcoatRoughness:.1}),geometries=[new THREE.TorusKnotGeometry(1.2,.37,180,28,2,3),new THREE.TorusGeometry(1.5,.46,32,110),new THREE.IcosahedronGeometry(1.75,1)],group=new THREE.Group(),mesh=new THREE.Mesh(geometries[0],material);mesh.rotation.set(.25,-.4,.2);group.add(mesh);scene.add(group);const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-3,5,5);scene.add(key);const fill=new THREE.DirectionalLight(0xffffff,2);fill.position.set(5,-2,-3);scene.add(fill);
let targetX=0,targetY=0,visible=true,themeColor=new THREE.Color(document.documentElement.dataset.theme==='dark'?0xd8fc71:0x284fff),transition=1;
let drag=null,manual=false,rotationX=0,rotationY=0;
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
material.color.copy(themeColor);
const resize=()=>{const w=wrap.clientWidth,h=wrap.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(wrap);resize();const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});visibilityObserver.observe(wrap);
function hitsObject(event){const r=canvas.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObject(mesh).length>0;}
function startManual(){if(manual)return;manual=true;rotationX=group.rotation.x;rotationY=group.rotation.y;targetX=0;targetY=0;}
function rotate(dx,dy){startManual();rotationY+=dx;rotationX=THREE.MathUtils.clamp(rotationX+dy,-Math.PI/2,Math.PI/2);}
function stopDrag(){const current=drag;drag=null;wrap.classList.remove('is-dragging');if(current&&canvas.hasPointerCapture(current.id))canvas.releasePointerCapture(current.id);}
function reset(){stopDrag();manual=false;rotationX=0;rotationY=0;targetX=0;targetY=0;mesh.rotation.set(.25,-.4,.2);group.rotation.set(0,0,0);group.position.y=0;}
canvas.addEventListener('pointerdown',event=>{if(drag||!event.isPrimary||event.button!==0||!hitsObject(event))return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,touch:event.pointerType==='touch',started:false};canvas.setPointerCapture(event.pointerId);if(!drag.touch)canvas.focus({preventScroll:true});});
canvas.addEventListener('pointermove',event=>{
 if(drag&&drag.id===event.pointerId){const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(!drag.started&&Math.hypot(dx,dy)<6)return;if(!drag.started&&drag.touch&&Math.abs(dy)>Math.abs(dx)){stopDrag();return;}drag.started=true;wrap.classList.add('is-dragging');rotate(dx*.009,drag.touch?0:dy*.009);drag.x=event.clientX;drag.y=event.clientY;return;}
 if(event.pointerType!=='touch')wrap.classList.toggle('can-drag',hitsObject(event));
});
canvas.addEventListener('pointerup',stopDrag);canvas.addEventListener('pointercancel',stopDrag);canvas.addEventListener('lostpointercapture',stopDrag);
canvas.addEventListener('pointerleave',()=>wrap.classList.remove('can-drag'));
canvas.addEventListener('keydown',event=>{const steps={ArrowLeft:[-.18,0],ArrowRight:[.18,0],ArrowUp:[0,-.18],ArrowDown:[0,.18]};if(steps[event.key]){event.preventDefault();rotate(...steps[event.key]);}else if(event.key==='Home'){event.preventDefault();reset();}});
document.querySelectorAll('[data-rotate]').forEach(button=>button.addEventListener('click',()=>rotate(Number(button.dataset.rotate)*.3,0)));
document.querySelector('#scene-reset').addEventListener('click',reset);
wrap.addEventListener('pointermove',event=>{if(manual||drag||reducedMotion.matches||event.pointerType==='touch')return;const r=wrap.getBoundingClientRect();targetX=(event.clientX-r.left)/r.width-.5;targetY=(event.clientY-r.top)/r.height-.5;});wrap.addEventListener('pointerleave',()=>{targetX=0;targetY=0;});window.addEventListener('blur',stopDrag);
window.addEventListener('axis-theme',event=>{themeColor.set(event.detail==='dark'?0xd8fc71:0x284fff);});window.addEventListener('axis-shape',event=>{if(!geometries[event.detail])return;reset();mesh.geometry=geometries[event.detail];transition=reducedMotion.matches?1:.15;});
let last=performance.now();function animate(now){const dt=Math.min((now-last)/1000,.05);last=now;if(visible&&!document.hidden){const motion=!reducedMotion.matches;if(motion&&!manual)mesh.rotation.y+=dt*.12;group.rotation.x=manual?rotationX:THREE.MathUtils.lerp(group.rotation.x,motion?targetY*.35:0,.05);group.rotation.z=manual?0:THREE.MathUtils.lerp(group.rotation.z,motion?targetX*.22:0,.05);group.position.y=motion&&!manual?Math.sin(now*.0007)*.1:0;group.rotation.y=manual?rotationY:THREE.MathUtils.lerp(group.rotation.y,motion?window.scrollY/window.innerHeight*.55+targetX*.5:0,.06);transition=THREE.MathUtils.lerp(transition,1,.11);group.scale.setScalar(transition);material.color.lerp(themeColor,reducedMotion.matches?1:.08);renderer.render(scene,camera);}requestAnimationFrame(animate);}requestAnimationFrame(animate);
window.addEventListener('pagehide',event=>{if(event.persisted)return;stopDrag();resizeObserver.disconnect();visibilityObserver.disconnect();geometries.forEach(g=>g.dispose());material.dispose();scene.environment.dispose();renderer.dispose();});
}catch(error){canvas.hidden=true;document.querySelector('#scene-fallback').hidden=false;document.querySelector('.shape-selector').hidden=true;console.warn('3D indisponível; conteúdo da página preservado.');}
