/** CPU-only construction benchmark: node --expose-gc tools/pgmaps-components-bench.ts [count]. */
import { performance } from 'node:perf_hooks';
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildComponents } from '../examples/pgmaps/component-mesh.ts';
const wanted=Number(process.argv[2]??100000);
if(!Number.isInteger(wanted)||wanted<1||wanted>1000000)throw new Error('count must be 1 to 1,000,000');
const fields=['x','y','z','species','height','crownWidth','tone','crownBase','dbhCm','expansion','form','source'];
const species=['pine','spruce','fir','douglasFir','aspen','birch','hemlock','blackSpruce','cottonwood'];
const data=new Array<number>(wanted*fields.length);
for(let i=0;i<wanted;i++){
  const row=[(i%400)*30,Math.floor(i/400)*30,100,i%9,10+i%20,3+i%12,.5,i%2?0:.5,20+i%30,1,i%3,2];
  for(let j=0;j<fields.length;j++)data[i*fields.length+j]=row[j];
}
globalThis.gc?.();const before=process.memoryUsage(),start=performance.now();
const drawing=buildComponents({fields,species,count:wanted,data});
const constructionMs=performance.now()-start;globalThis.gc?.();const after=process.memoryUsage();
const result={count:wanted,constructionMs,chunks:drawing.chunks,draws:drawing.draws,chunkMeters:drawing.chunkMeters,
  heapUsedMiB:after.heapUsed/1024/1024,heapDeltaMiB:(after.heapUsed-before.heapUsed)/1024/1024,arrayBufferDeltaMiB:(after.arrayBuffers-before.arrayBuffers)/1024/1024,
  node:process.version,gc:typeof globalThis.gc==='function',scope:'CPU geometry/matrices/bounds construction only; no GPU or FPS measurement'};
mkdirSync('tools/out',{recursive:true});writeFileSync(`tools/out/component-construction-${wanted}.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
