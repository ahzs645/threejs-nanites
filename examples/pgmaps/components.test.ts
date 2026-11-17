import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as THREE from 'three/webgpu';
import { componentStems, selectStems } from './components.ts';
import { buildComponents, buildTreated } from './component-mesh.ts';
import { isAggregate } from './far-forest.ts';
const fields=['x','y','z','species','height','crownWidth','tone','crownBase','dbhCm','expansion','form','source'];
const species=['pine','spruce','fir','douglasFir','aspen','birch','hemlock','blackSpruce','cottonwood'];
test('rich stems preserve broad measured crowns, ground crown base, DBH, forms and aligned ids',()=>{
  const t={fields,species,count:3,ids:['legacy','measured','shrub'],data:[0,1,100,0,20,3,.5,-1,0,1,0,0, 2,3,100,8,10,15,.5,0,40,1,0,2, 4,5,100,4,2,4,.5,-1,0,1,2,0]};
  const result=componentStems(t);
  assert.deepEqual(result.keep,[0]);assert.equal(result.components[0].width,15);assert.equal(result.components[0].crownBase,0);assert.equal(result.components[0].dbhMeters,.4);
  assert.equal(result.components[1].form,2);assert.equal(result.components[1].crownBase,0);
  assert.equal(isAggregate(t,1),false);assert.deepEqual(selectStems(t,result.keep).ids,['legacy']);
  const drawing=buildComponents(t);assert.equal(drawing.count,2);
  const crown=drawing.group.children.find(o=>o instanceof THREE.InstancedMesh && o.geometry instanceof THREE.SphereGeometry) as THREE.InstancedMesh;
  const m=new THREE.Matrix4();crown.getMatrixAt(0,m);const p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();m.decompose(p,q,s);
  assert.deepEqual(p.toArray(),[2,100,-3]);assert.deepEqual(s.toArray(),[15,10,15]);
  drawing.setClasses(new Uint8Array([255,128,0,0,255,0]));drawing.flat(true);drawing.transition(500);drawing.flat(false);drawing.setClasses(null);
});
test('large mixed stands have bounded spatial draw batches and conservative bounds',()=>{
  const data:number[]=[];const count=12000;
  for(let i=0;i<count;i++)data.push((i%120)*75,Math.floor(i/120)*75,100,i%9,10+i%20,3+i%12,.5,i%2?0:.5,20+i%30,1,i%3,2);
  const drawing=buildComponents({fields,species,count,data});
  assert.equal(drawing.count,count);assert.ok(drawing.chunks<=24);assert.ok(drawing.draws<=96);
  for(const child of drawing.group.children){assert.ok(child instanceof THREE.InstancedMesh);assert.ok(child.boundingSphere && Number.isFinite(child.boundingSphere.radius));}
});
test('prescribed treated stems retain geometry and lying heading in instanced batches',()=>{
  const group=buildTreated({fields:['x','y','z','kind','length','diameter','heading'],kinds:['stump','felled','log','snag'],count:4,data:[0,0,10,0,1,.4,0, 5,0,10,1,12,.3,90, 10,0,10,2,8,.2,0, 15,0,10,3,15,.3,0]});
  assert.ok(group);const mesh=group.children[0] as THREE.InstancedMesh;assert.equal(mesh.count,10);
  const matrix=new THREE.Matrix4();mesh.getMatrixAt(8,matrix);const axis=new THREE.Vector3(0,1,0).transformDirection(matrix);assert.ok(axis.z<-.99);
});

test('a normal-only table is retained without a second packed data allocation',()=>{
  const table={fields,species,count:1,data:[0,0,100,0,20,3,.5,-1,0,1,0,0]};
  assert.equal(buildComponents(table).naniteTrees,table);
});
