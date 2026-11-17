import assert from 'node:assert/strict';
import {test} from 'node:test';
import {standSampler} from './stand-palette.ts';
import {canopyField,standCells,standPatches} from './far-forest.ts';
import type {TerrainGrid} from './package.ts';
test('known fine stand palette overrides local stem median/mix; unknown fine cells fall through',()=>{
  const record={heightMeters:9,species:[{species:'hemlock',share:.25},{species:'cottonwood',share:.75}],source:'inventory' as const};
  const grid:TerrainGrid={west:0,south:0,spacing:100,columns:2,rows:2,heights:[0,0,0,0],stand:{cells:[0,0,0,0],records:[record]}};
  const fine:TerrainGrid={...grid,spacing:50,stand:{cells:[-1,-1,-1,-1],records:[]}};
  const at=standSampler([fine,grid]);assert.equal(at(20,20),record);assert.equal(at(101,20),null);
  const table={fields:['x','y','species','height','crownWidth'],species:['pine','hemlock','cottonwood'],count:1,data:[0,0,0,40,3]};
  const cells=standCells(table,{extent:{west:0,south:0,east:100,north:100}})!;
  const field=canopyField({west:0,south:0,east:100,north:100},()=>.6,cells,i=>i===1?[1,0,0]:i===2?[0,1,0]:[0,0,1],{cell:50,standAt:at});
  assert.equal(field.stand[1],9);assert.deepEqual(Array.from(field.colour.slice(0,4)),[.25,.75,0,1]);
  const patches=standPatches(cells,()=>0,()=>.6,{standAt:at});assert.ok(patches.count>0);
  for(let i=0;i<patches.count;i++){if(!at(patches.a[i*4],patches.a[i*4+1]))continue;assert.equal(patches.a[i*4+3],9);assert.ok(patches.b[i*4+3]===1||patches.b[i*4+3]===2);}
});
