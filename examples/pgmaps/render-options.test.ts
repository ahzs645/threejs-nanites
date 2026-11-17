import assert from 'node:assert/strict';
import { test } from 'node:test';
import { coverageCutoff, DEFAULT_RENDER_OPTIONS, dissolvePixels, readRenderOptions, renderOptionsFromUrl } from './render-options.ts';
import { cutoffMeters, focalPixels } from './far-forest.ts';
import { FramePacing } from './frame-pacing.ts';

test('adapter controls validate messages and URL values using the same limits',()=>{
  const message=readRenderOptions({resolutionScale:.2,maxFps:30.7,maxInFlight:7,dissolveMode:'relative',dissolvePixels:30,dissolveReferenceHeight:100.2,frustumCulling:false});
  const url=renderOptionsFromUrl(new URLSearchParams('renderScale=.2&maxfps=30.7&gpuqueue=7&dissolve=relative&cutoffpx=30&referenceheight=100.2&culling=0'));
  assert.deepEqual(message,url);
  assert.deepEqual(message,{resolutionScale:.5,maxFps:31,maxInFlight:3,dissolveMode:'relative',dissolvePixels:16,dissolveReferenceHeight:240,frustumCulling:false});
  assert.deepEqual(readRenderOptions({resolutionScale:NaN,maxFps:'60',frustumCulling:'false',dissolveMode:'bad'}),DEFAULT_RENDER_OPTIONS);
  assert.deepEqual(renderOptionsFromUrl(new URLSearchParams('renderScale=&maxfps=bad&gpuqueue=Infinity')),DEFAULT_RENDER_OPTIONS);
});
test('relative dissolve preserves distance across resolutions and the whole fade fits actual coverage',()=>{
  const options=readRenderOptions({dissolveMode:'relative'});
  const distances=[540,1080,2160].map(h=>cutoffMeters(dissolvePixels(options,h),focalPixels(h,40),22));
  assert.ok(Math.max(...distances)-Math.min(...distances)<1e-9);
  const cut=coverageCutoff(20000,15000,4000,8000);
  assert.ok(cut*1.2+90<=8000+1e-9);
  assert.equal(coverageCutoff(20000,15000,16000,8000),0);
});
test('live pacing bounds pending submissions, recovers on rejection and gates FPS independently',async()=>{
  const pacing=new FramePacing(); let done!:()=>void;
  const promise=new Promise<void>(resolve=>done=resolve);
  assert.equal(pacing.allow(0,30,1),true);pacing.submitted(promise,0,()=>40);
  assert.equal(pacing.allow(100,30,1),false);done();await pacing.drain();
  assert.equal(pacing.inFlight,0);assert.equal(pacing.completed,1);assert.equal(pacing.latencyMs,40);
  assert.equal(pacing.allow(10,30,1),false);assert.equal(pacing.allow(34,30,1),true);
  pacing.submitted(Promise.reject(new Error('device loss')),34,()=>50);await pacing.drain();
  assert.equal(pacing.inFlight,0);assert.equal(pacing.failures,1);assert.equal(pacing.allow(70,30,1),true);
});

test('a rejected completion reports the error after its queue slot is released',async()=>{
  const pacing=new FramePacing(),failure=new Error('device gone');let reports=0;
  pacing.submitted(Promise.reject(failure),0,()=>1,reason=>{reports++;assert.equal(reason,failure);assert.equal(pacing.inFlight,0);});
  await pacing.drain();assert.equal(reports,1);assert.equal(pacing.failures,1);assert.equal(pacing.completed,0);
});
