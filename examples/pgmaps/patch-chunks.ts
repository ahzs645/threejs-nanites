/** Split shader-positioned cards into spatial draws; their ordinary quad positions cannot provide culling bounds. */
import * as THREE from 'three/webgpu';
import type { Patches } from './far-forest.ts';
export function chunkPatchMesh(root:THREE.Mesh<THREE.InstancedBufferGeometry>, patches:Patches, frameHeight:number, bakeHeight:number, patchWidth:number): { syncClasses():void; chunks:number } {
  const original=root.geometry;
  const buckets=new Map<string,number[]>();
  for(let i=0;i<patches.count;i++) {
    const key=`${Math.floor(patches.a[i*4]/1000)},${Math.floor(patches.a[i*4+1]/1000)}`;
    const indices=buckets.get(key)??[];indices.push(i);buckets.set(key,indices);
  }
  const classes:Array<{target:THREE.InstancedBufferAttribute;indices:number[]}>=[];
  for(const indices of buckets.values()) {
    const g=new THREE.InstancedBufferGeometry();
    g.setIndex(original.index);g.setAttribute('position',original.attributes.position);
    for(const name of ['pA','pB','pC','pClass']) {
      const from=original.getAttribute(name),data=new Float32Array(indices.length*4);
      indices.forEach((i,k)=>{for(let j=0;j<4;j++)data[k*4+j]=from.array[i*4+j];});
      const attribute=new THREE.InstancedBufferAttribute(data,4);g.setAttribute(name,attribute);
      if(name==='pClass')classes.push({target:attribute,indices});
    }
    g.instanceCount=indices.length;
    const box=new THREE.Box3();
    for(const i of indices) {
      const o=i*4,x=patches.a[o],y=patches.a[o+2],z=-patches.a[o+1],h=patches.a[o+3];
      const slope=Math.hypot(patches.b[o],patches.b[o+1]);
      // Includes front-edge offset, diagonal width, any billboard orientation, slope lift and below-ground bake margin.
      const radius=patchWidth*2+frameHeight*h/bakeHeight+patchWidth*slope;
      box.expandByPoint(new THREE.Vector3(x-radius,y-radius,z-radius));
      box.expandByPoint(new THREE.Vector3(x+radius,y+radius,z+radius));
    }
    g.boundingBox=box;g.boundingSphere=box.getBoundingSphere(new THREE.Sphere());
    const child=new THREE.Mesh(g,root.material);child.name='stand-patch-chunk';child.receiveShadow=true;root.add(child);
  }
  // Root keeps the shared material and attributes for class updates; only its bounded children issue draws.
  original.instanceCount=0;
  return {chunks:buckets.size,syncClasses(){const from=original.getAttribute('pClass');for(const {target,indices} of classes){indices.forEach((i,k)=>{for(let j=0;j<4;j++)target.array[k*4+j]=from.array[i*4+j];});target.needsUpdate=true;}}};
}
