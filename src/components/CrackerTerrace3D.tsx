import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export type IndianCracker = 'rocket'|'flower-pot'|'anar'|'chakri'|'sparkler'|'phooljhadi'|'ladi'|'bijili'|'atom-bomb'|'sutli-bomb'|'snake-pill'|'1000-wala'|'multi-shot'
export type PlacedCracker = { id:number; kind:IndianCracker; x:number; z:number; hue:number }
type Props = {
  placements:PlacedCracker[]
  placementMode:boolean
  selected:IndianCracker
  onPlace:(x:number,z:number)=>void
  onIgnite:(kind:IndianCracker,x:number,y:number,hue:number)=>void
  onSky:(x:number,y:number)=>void
}
const mat=(color:number,metalness=.5,roughness=.32)=>new THREE.MeshStandardMaterial({color,metalness,roughness})
function printedFoil(base:string,accent:string,highlight:string){
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256
  const c=canvas.getContext('2d')!
  const grad=c.createLinearGradient(0,0,256,256);grad.addColorStop(0,highlight);grad.addColorStop(.28,base);grad.addColorStop(.72,base);grad.addColorStop(1,'#191b37')
  c.fillStyle=grad;c.fillRect(0,0,256,256)
  c.strokeStyle=accent;c.lineWidth=7;c.strokeRect(10,10,236,236)
  c.lineWidth=2;c.strokeRect(19,19,218,218)
  for(let y=32;y<240;y+=32){for(let x=32;x<240;x+=32){c.save();c.translate(x,y);c.rotate(Math.PI/4);c.strokeStyle=accent;c.lineWidth=2;c.strokeRect(-7,-7,14,14);c.restore()}}
  c.beginPath();c.arc(128,128,60,0,Math.PI*2);c.fillStyle=accent;c.globalAlpha=.2;c.fill();c.globalAlpha=1
  for(let i=0;i<16;i++){const a=i*Math.PI/8;c.beginPath();c.moveTo(128+Math.cos(a)*34,128+Math.sin(a)*34);c.lineTo(128+Math.cos(a)*56,128+Math.sin(a)*56);c.strokeStyle=accent;c.lineWidth=3;c.stroke()}
  c.beginPath();c.arc(128,128,28,0,Math.PI*2);c.strokeStyle=highlight;c.lineWidth=4;c.stroke()
  c.beginPath();c.arc(128,128,12,0,Math.PI*2);c.fillStyle=highlight;c.fill()
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4
  return new THREE.MeshStandardMaterial({map:texture,metalness:.34,roughness:.38})
}
const mesh=(g:THREE.Group,geo:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0)=>{
  const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o
}
const cyl=(g:THREE.Group,rt:number,rb:number,h:number,m:THREE.Material,x=0,y=0,z=0,n=16)=>mesh(g,new THREE.CylinderGeometry(rt,rb,h,n),m,x,y,z)
const ring=(g:THREE.Group,r:number,t:number,m:THREE.Material,x=0,y=0,z=0)=>{
  const o=mesh(g,new THREE.TorusGeometry(r,t,8,36),m,x,y,z);o.rotation.x=Math.PI/2;return o
}
function commonBase(g:THREE.Group,gold:THREE.Material){
  const shadow=mesh(g,new THREE.CircleGeometry(.45,36),new THREE.MeshBasicMaterial({color:0x080d18,transparent:true,opacity:.22,depthWrite:false}),0,.012,0)
  shadow.rotation.x=-Math.PI/2
  ring(g,.43,.012,gold,0,.024,0)
}
function disposeTree(root:THREE.Object3D){
  root.traverse(o=>{
    if(o instanceof THREE.Mesh){
      o.geometry.dispose()
      const materials=Array.isArray(o.material)?o.material:[o.material]
      materials.forEach(material=>{
        const textured=material as THREE.MeshStandardMaterial
        textured.map?.dispose()
        material.dispose()
      })
    }
  })
}
function model(kind:IndianCracker):THREE.Group{
  const g=new THREE.Group()
  const gold=mat(0xf5c76d,.78,.23),red=printedFoil('#a81d3c','#f8ca68','#e95c78'),green=printedFoil('#08765a','#f0c36a','#37bb91'),teal=printedFoil('#087f89','#f4ca75','#2cc8bb'),blue=printedFoil('#183b80','#f4cb70','#477ee4'),cream=mat(0xf5e4bc,.18,.3),dark=printedFoil('#211b39','#c3a0ee','#57417e'),pink=printedFoil('#9d2767','#ffe18e','#e466a8')
  commonBase(g,gold)
  if(kind==='rocket'){
    const body=cyl(g,.105,.14,.78,red,0,.57,0,16);body.rotation.z=-.07
    const cone=mesh(g,new THREE.ConeGeometry(.14,.34,16),gold,0,1.13,0);cone.rotation.z=-.07
    cyl(g,.145,.145,.065,gold,0,.27,0);cyl(g,.115,.115,.04,cream,0,.79,0)
    const window=mesh(g,new THREE.SphereGeometry(.047,14,12),teal,0,.58,.13);window.scale.z=.3
    for(let i=0;i<3;i++){const fin=mesh(g,new THREE.ConeGeometry(.1,.3,3),i===1?gold:red,Math.cos(i*2.094)*.15,.19,Math.sin(i*2.094)*.15);fin.rotation.z=Math.PI/2;fin.scale.set(.7,1,.35)}
    cyl(g,.014,.014,.18,cream,.035,1.36,0,7)
  }else if(kind==='flower-pot'||kind==='anar'){
    const primary=kind==='anar'?green:red,secondary=kind==='anar'?pink:teal
    cyl(g,.105,.27,.63,primary,0,.34,0,20)
    cyl(g,.14,.14,.065,gold,0,.66,0,20);cyl(g,.115,.115,.07,secondary,0,.72,0,16)
    ring(g,.17,.014,gold,0,.52,0);ring(g,.125,.012,secondary,0,.22,0)
    for(let i=0;i<8;i++){const a=i*Math.PI/4;mesh(g,new THREE.SphereGeometry(.021,8,8),gold,Math.cos(a)*.19,.36,Math.sin(a)*.19)}
  }else if(kind==='chakri'){
    cyl(g,.39,.39,.11,red,0,.1,0,40);cyl(g,.3,.3,.055,teal,0,.18,0,40)
    ring(g,.35,.04,gold,0,.18,0);ring(g,.23,.025,blue,0,.216,0);cyl(g,.07,.07,.07,gold,0,.24,0)
    for(let i=0;i<12;i++){const a=i*Math.PI/6;const b=mesh(g,new THREE.BoxGeometry(.055,.02,.16),i%2?gold:pink,Math.cos(a)*.27,.22,Math.sin(a)*.27);b.rotation.y=-a}
    const fuse=cyl(g,.012,.012,.2,cream,.36,.12,.02,7);fuse.rotation.z=-.7
  }else if(kind==='sparkler'||kind==='phooljhadi'){
    const stick=cyl(g,.012,.012,.95,cream,0,.52,0,8);stick.rotation.z=-.13
    cyl(g,.024,.024,.17,red,0,.17,0,8);ring(g,.025,.01,gold,0,.25,0)
    mesh(g,new THREE.SphereGeometry(.07,10,10),gold,0,1.02,0)
    for(let i=0;i<18;i++){const a=i*Math.PI/9;const spark=mesh(g,new THREE.SphereGeometry(.016,6,6),i%3===0?cream:gold,Math.cos(a)*(.1+Math.random()*.07),1.02+Math.sin(a)*(.1+Math.random()*.07),Math.sin(a)*.08);spark.scale.setScalar(.75+Math.random()*.8)}
  }else if(kind==='ladi'||kind==='1000-wala'){
    const count=kind==='1000-wala'?14:9,spacing=.105
    for(let i=0;i<count;i++){const x=(i-(count-1)/2)*spacing;const r=cyl(g,.038,.038,.21,i%3===0?green:red,x,.08,0,12);r.rotation.z=Math.PI/2;ring(g,.038,.007,gold,x,.08,-.1);ring(g,.038,.007,gold,x,.08,.1)}
    const points=[new THREE.Vector3(-.65,.15,.14),new THREE.Vector3(-.3,.17,.17),new THREE.Vector3(0,.14,.13),new THREE.Vector3(.35,.17,.16),new THREE.Vector3(.65,.14,.13)]
    mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),36,.01,6,false),gold)
    if(kind==='1000-wala')g.scale.set(1.2,1,1)
  }else if(kind==='bijili'){
    const b=cyl(g,.09,.09,.34,green,0,.2,0,16);b.rotation.z=Math.PI/2
    ring(g,.085,.014,gold,0,.2,-.15);ring(g,.085,.014,gold,0,.2,.15)
    mesh(g,new THREE.BoxGeometry(.035,.11,.23),red,.02,.2,.08)
    const wick=cyl(g,.01,.01,.13,gold,.07,.43,0,6);wick.rotation.z=.7
  }else if(kind==='atom-bomb'||kind==='sutli-bomb'){
    mesh(g,new THREE.SphereGeometry(.215,24,18),green,0,.23,0);ring(g,.21,.018,gold,0,.23,0)
    cyl(g,.075,.075,.08,red,0,.46,0,12)
    const wick=cyl(g,.011,.011,.16,gold,.04,.58,0,6);wick.rotation.z=-.3
    for(let i=0;i<4;i++){const a=i*Math.PI/2;mesh(g,new THREE.SphereGeometry(.012,6,6),gold,Math.cos(a)*.18,.23,Math.sin(a)*.18)}
  }else if(kind==='snake-pill'){
    const pts:THREE.Vector3[]=[]
    for(let i=0;i<=100;i++){const t=i/100*Math.PI*5,r=.055+t/(Math.PI*5)*.32;pts.push(new THREE.Vector3(Math.cos(t)*r,.065,Math.sin(t)*r))}
    mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),100,.05,8,false),dark)
    mesh(g,new THREE.SphereGeometry(.075,10,10),green,.32,.09,0)
    const wick=cyl(g,.01,.01,.11,gold,.4,.15,0,6);wick.rotation.z=-.4
  }else if(kind==='multi-shot'){
    mesh(g,new THREE.BoxGeometry(.92,.44,.68),red,0,.25,0)
    mesh(g,new THREE.BoxGeometry(.88,.03,.64),gold,0,.49,0)
    for(let row=0;row<3;row++)for(let col=0;col<4;col++){const x=(col-1.5)*.18,z=(row-1)*.17;cyl(g,.052,.058,.25,teal,x,.63,z,12);ring(g,.053,.008,gold,x,.76,z)}
    ring(g,.15,.008,gold,0,.51,0)
  }
  g.userData.kind=kind
  return g
}

export default function CrackerTerrace3D({placements,placementMode,selected,onPlace,onIgnite,onSky}:Props){
  const host=useRef<HTMLDivElement>(null)
  const sceneRef=useRef<THREE.Scene|null>(null)
  const rendererRef=useRef<THREE.WebGLRenderer|null>(null)
  const cameraRef=useRef<THREE.PerspectiveCamera|null>(null)
  const layerRef=useRef<THREE.Group|null>(null)
  const objectsRef=useRef(new Map<number,THREE.Group>())
  const previewRef=useRef<THREE.Group|null>(null)
  const callbacks=useRef({placements,placementMode,onPlace,onIgnite,onSky})
  callbacks.current={placements,placementMode,onPlace,onIgnite,onSky}

  useEffect(()=>{
    const root=host.current;if(!root)return
    const mobile=window.matchMedia('(max-width:760px)').matches
    let renderer:THREE.WebGLRenderer
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power'})}catch{return}
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,mobile?1:1.35))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.12
    renderer.setSize(root.clientWidth,root.clientHeight);renderer.setClearColor(0,0)
    root.appendChild(renderer.domElement);rendererRef.current=renderer
    const scene=new THREE.Scene();sceneRef.current=scene
    const camera=new THREE.PerspectiveCamera(38,root.clientWidth/Math.max(1,root.clientHeight),.1,70);camera.position.set(0,8.5,15);camera.lookAt(0,2.35,0);cameraRef.current=camera
    scene.add(new THREE.HemisphereLight(0xfff1d3,0x1b2840,1.65))
    const key=new THREE.DirectionalLight(0xffdfaa,2);key.position.set(-4,8,5);scene.add(key)
    const goldLight=new THREE.PointLight(0xffa64d,18,20);goldLight.position.set(1,3,2);scene.add(goldLight)
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(13,7.4),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}))
    plane.rotation.x=-Math.PI/2;plane.position.y=.005;scene.add(plane);plane.userData.placementPlane=true
    const layer=new THREE.Group();scene.add(layer);layerRef.current=layer
    const preview=new THREE.Group();preview.position.set(0,.035,0);scene.add(preview);previewRef.current=preview
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2()
    let raf=0,last=0,targetX=0,targetY=0
    const resize=()=>{const w=root.clientWidth,h=root.clientHeight;camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();renderer.setSize(w,h);renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,mobile?1:1.35))}
    const move=(e:PointerEvent)=>{targetX=(e.clientX/window.innerWidth-.5)*2;targetY=(e.clientY/window.innerHeight-.5)*-2}
    const down=(e:PointerEvent)=>{
      if((e.target as HTMLElement).closest('button,a,input,select,textarea'))return
      const rect=renderer.domElement.getBoundingClientRect();pointer.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);raycaster.setFromCamera(pointer,camera)
      if(callbacks.current.placementMode){
        const hit=raycaster.intersectObject(plane)[0]
        if(hit){callbacks.current.onPlace(Math.max(-5.8,Math.min(5.8,hit.point.x)),Math.max(-3.2,Math.min(3.2,hit.point.z)));e.stopPropagation();return}
      }
      const hit=raycaster.intersectObjects(layer.children,true)[0]
      if(hit){
        let parent:THREE.Object3D|null=hit.object
        while(parent&&!parent.userData.crackerId)parent=parent.parent
        if(parent){
          const p=callbacks.current.placements.find(item=>item.id===parent!.userData.crackerId)
          if(p){const pos=parent.position.clone();pos.y+=.55;pos.project(camera);callbacks.current.onIgnite(p.kind,(pos.x+1)/2,(1-pos.y)/2,p.hue);e.stopPropagation();return}
        }
      }
      if(!callbacks.current.placementMode)callbacks.current.onSky(e.clientX/window.innerWidth,e.clientY/window.innerHeight)
    }
    renderer.domElement.addEventListener('pointerdown',down)
    renderer.domElement.addEventListener('pointermove',move,{passive:true})
    window.addEventListener('resize',resize)
    const clock=new THREE.Clock()
    const animate=()=>{raf=requestAnimationFrame(animate);const t=clock.getElapsedTime();camera.position.x+=(targetX*.22-camera.position.x)*.025;camera.position.y+=(8.5+targetY*.1-camera.position.y)*.025;camera.lookAt(0,2.35,0);for(const [id,g] of objectsRef.current){if(g.userData.kind==='chakri')g.rotation.y=t*1.35;g.position.y=.026+Math.sin(t*1.5+id)*.012}if(t-last>.025){renderer.render(scene,camera);last=t}}
    animate()
    const ro=new ResizeObserver(resize);ro.observe(root)
    return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointermove',move);window.removeEventListener('resize',resize);disposeTree(scene);renderer.dispose();renderer.domElement.remove();sceneRef.current=null;rendererRef.current=null;cameraRef.current=null;layerRef.current=null;previewRef.current=null;objectsRef.current.clear()}
  },[])

  useEffect(()=>{
    const preview=previewRef.current
    if(preview){preview.children.forEach(disposeTree);preview.clear();const ghost=model(selected);ghost.traverse(o=>{if(o instanceof THREE.Mesh){const source=o.material as THREE.MeshStandardMaterial;o.material=source.clone();const material=o.material as THREE.MeshStandardMaterial;material.transparent=true;material.opacity=.72;material.depthWrite=false}});preview.add(ghost);preview.visible=placements.length===0}
    const layer=layerRef.current;if(!layer)return
    layer.children.forEach(disposeTree);layer.clear();objectsRef.current.clear()
    for(const p of placements){
      const g=model(p.kind);g.position.set(p.x,.03,p.z);g.rotation.y=(p.id%7)*.27;g.userData.crackerId=p.id
      layer.add(g);objectsRef.current.set(p.id,g)
    }
    if(sceneRef.current&&cameraRef.current&&rendererRef.current)rendererRef.current.render(sceneRef.current,cameraRef.current)
  },[placements,selected])

  return <div ref={host} className={'cracker-map3d '+(placementMode?'is-placement':'')} aria-label={placementMode?'Choose a place on the 3D terrace':'3D cracker models. Click a placed cracker to ignite it.'}/>
}
