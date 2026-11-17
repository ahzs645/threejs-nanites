import * as THREE from 'three/webgpu';
import { dot, float, fract, length, max, positionWorld, screenCoordinate, select, smoothstep, uniform, vec2 } from 'three/tsl';
import { lookOf } from './species.ts';
import { componentChunkSize, componentStems, selectStems, type ComponentStem } from './components.ts';
import type { ScenePackage } from './package.ts';

export interface ComponentDrawing {
  group: THREE.Group; xy: Float32Array; count: number; chunks: number; draws: number; chunkMeters: number; naniteTrees: ScenePackage['trees'];
  setClasses(rgb: Uint8Array | null): void;
  flat(on:boolean):void;
  transition(cutoff:number|undefined, eye?:THREE.Vector3):void;
  culling(on:boolean):void;
}
/** Adaptive chunks start at 250 m; at most 24 tiles bound draw cost and include complete crown/trunk bounds. */
export function buildComponents(t:ScenePackage['trees'], shift=uniform(new THREE.Vector2())): ComponentDrawing {
  const {components,keep}=componentStems(t), group=new THREE.Group(); group.name='stand-components';
  const chunks=new Map<string,ComponentStem[]>();
  const chunkMeters=componentChunkSize(components), tiles=new Set<string>();
  const cutoff=uniform(1e10), flatFlag=uniform(0),viewer=uniform(new THREE.Vector3());
  const noise=fract(dot(screenCoordinate.xy.add(shift),vec2(.06711056,.00583715)).fract().mul(52.9829189));
  const threshold=select(flatFlag.greaterThan(.5),float(.5),noise);
  const share=smoothstep(cutoff,max(cutoff.mul(1.2),cutoff.add(.001)),length(positionWorld.sub(viewer)));
  const opacity=select(threshold.greaterThanEqual(share),float(1),float(0));
  for(const s of components) {
    const tile=`${Math.floor(s.x/chunkMeters)},${Math.floor(s.y/chunkMeters)}`;tiles.add(tile);
    const key=`${tile}:${s.species==='snag'?'dead':!lookOf(s.species).conifer||s.form===2?'broad':'conifer'}`;
    const a=chunks.get(key)??[];a.push(s);chunks.set(key,a);
  }
  const xy=new Float32Array(components.length*2);
  for(const s of components)xy.set([s.x,s.y],s.ordinal*2);
  const batches:Array<{mesh:THREE.InstancedMesh;normal:THREE.Material;flat:THREE.Material;rows:ComponentStem[];colours:Float32Array}>=[];
  const matrix=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),scale=new THREE.Vector3();
  for(const rows of chunks.values()) {
    const first=rows[0],look=lookOf(first.species);
    const broad=!look.conifer || first.form===2;
    const crown=broad?new THREE.SphereGeometry(.5,10,7):new THREE.ConeGeometry(.5,1,10,3);
    crown.translate(0,.5,0);
    const trunk=new THREE.CylinderGeometry(.5,.5,1,8);trunk.translate(0,.5,0);
    for(const [part,geometry] of [['crown',crown],['trunk',trunk]] as const) {
      if(part==='crown' && first.species==='snag')continue;
      const normal=new THREE.MeshStandardNodeMaterial({roughness:1,metalness:0});
      const flat=new THREE.MeshBasicNodeMaterial({toneMapped:false});
      normal.opacityNode=flat.opacityNode=opacity;normal.alphaTest=flat.alphaTest=.5;
      const mesh=new THREE.InstancedMesh(geometry,normal,rows.length);mesh.layers.enable(1);mesh.castShadow=mesh.receiveShadow=true;
      const colours=new Float32Array(rows.length*3),color=new THREE.Color();
      rows.forEach((s,i)=>{
        const base=s.height*s.crownBase, crownHeight=s.height-base;
        const diameter=part==='crown'?s.width:s.dbhMeters, height=part==='crown'?crownHeight:s.height*.96;
        p.set(s.x,s.z+(part==='crown'?base:0),-s.y);scale.set(diameter,height,diameter);
        mesh.setMatrixAt(i,matrix.compose(p,q,scale));
        const own=lookOf(s.species),tint=part==='crown'?own.leafTint:own.barkTint;
        const tone=.8+.4*s.tone;
        color.setRGB(tone*tint[0]*(part==='crown'?.12:.2),tone*tint[1]*(part==='crown'?.18:.17),tone*tint[2]*(part==='crown'?.1:.13));
        color.toArray(colours,i*3);mesh.setColorAt(i,color);
      });
      mesh.computeBoundingBox();mesh.computeBoundingSphere();group.add(mesh);batches.push({mesh,normal,flat,rows,colours});
    }
  }
  return {group,xy,count:components.length,chunks:tiles.size,draws:batches.length,chunkMeters,naniteTrees:selectStems(t,keep),
    culling(on){for(const b of batches)b.mesh.frustumCulled=on;},
    transition(value,eye){cutoff.value=value??1e10;if(eye)viewer.value.copy(eye);},
    flat(on){flatFlag.value=on?1:0;for(const b of batches)b.mesh.material=on?b.flat:b.normal;},
    setClasses(rgb){const color=new THREE.Color();for(const b of batches){b.rows.forEach((s,i)=>{
      const k=s.ordinal*3;
      if(rgb)color.setRGB(rgb[k]/255,rgb[k+1]/255,rgb[k+2]/255);else color.fromArray(b.colours,i*3);
      b.mesh.setColorAt(i,color);
    });if(b.mesh.instanceColor)b.mesh.instanceColor.needsUpdate=true;}},
  };
}
/** Prescribed material uses the supplied dimensions and heading; no extra trees are invented. */
export function buildTreated(t:ScenePackage['treated']):THREE.Group|null {
  if(!t?.count)return null;
  const f=(key:string)=>t.fields.indexOf(key),st=t.fields.length;
  if(['x','y','z','kind','length','diameter','heading'].some(k=>f(k)<0))return null;
  const group=new THREE.Group();group.name='treated-stems';
  const geometry=new THREE.CylinderGeometry(.45,.5,1,8);geometry.translate(0,.5,0);
  const material=new THREE.MeshStandardNodeMaterial({color:0x68584a,roughness:1});
  const buckets=new Map<string,THREE.Matrix4[]>(),q=new THREE.Quaternion(),p=new THREE.Vector3(),scale=new THREE.Vector3();
  for(let i=0;i<t.count;i++){
    const at=(key:string)=>t.data[i*st+f(key)],x=at('x'),y=at('y'),z=at('z'),len=at('length'),d=at('diameter'),kind=t.kinds[at('kind')];
    if(![x,y,z,len,d].every(Number.isFinite)||len<=0||d<=0||!['stump','felled','log','snag'].includes(kind))continue;
    const lying=kind==='felled'||kind==='log',heading=(Number.isFinite(at('heading'))?at('heading'):0)*Math.PI/180;
    q.setFromUnitVectors(new THREE.Vector3(0,1,0),lying?new THREE.Vector3(Math.sin(heading),0,-Math.cos(heading)):new THREE.Vector3(0,1,0));
    p.set(x,z+(lying?d*.5:0),-y);scale.set(d,len,d);
    const key=`${Math.floor(x/250)},${Math.floor(y/250)}`,a=buckets.get(key)??[];
    a.push(new THREE.Matrix4().compose(p,q,scale));buckets.set(key,a);
    if(kind==='felled') { // Short side branches make the prescribed felled crown visible, within its length.
      for(const fraction of [.55,.7,.85]) for(const side of [-1,1]) {
        const axis=new THREE.Vector3(Math.sin(heading+side*.65),.1,-Math.cos(heading+side*.65)).normalize();
        q.setFromUnitVectors(new THREE.Vector3(0,1,0),axis);p.set(x+Math.sin(heading)*len*fraction,z+d*.5,-y-Math.cos(heading)*len*fraction);
        a.push(new THREE.Matrix4().compose(p,q,scale.set(d*.2,len*.13,d*.2)));
      }
    }
  }
  for(const matrices of buckets.values()){
    const mesh=new THREE.InstancedMesh(geometry,material,matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));
    mesh.computeBoundingBox();mesh.computeBoundingSphere();mesh.layers.enable(1);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
  }
  return group;
}
