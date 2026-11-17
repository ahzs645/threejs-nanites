import{$n as e,An as t,Bt as n,C as r,Cr as i,D as a,Dn as o,Dt as s,E as c,Et as l,Ft as u,G as d,Gt as f,Hn as p,In as m,It as h,Jn as g,Jt as _,Kn as v,Ln as y,Mn as b,Mt as x,N as S,Nn as C,On as w,Ot as T,Pn as E,Qn as D,Qt as O,Rn as k,Rt as A,Sn as j,Sr as M,T as N,Tn as P,Tt as ee,U as te,Un as F,Ut as ne,Vn as I,Vt as re,W as L,Wt as ie,X as ae,Xn as oe,Xt as se,Y as ce,Yn as R,Z as le,Zn as ue,Zt as z,_ as de,_n as fe,_r as pe,_t as B,an as V,ar as me,at as he,b as ge,bn as _e,br as ve,bt as ye,ct as be,dn as H,en as xe,er as Se,f as Ce,fn as U,fr as we,ft as W,g as Te,gr as Ee,gt as G,h as De,hn as Oe,hr as ke,ht as Ae,in as je,ir as Me,it as Ne,jn as Pe,jt as Fe,kn as Ie,l as Le,ln as Re,lr as ze,lt as Be,m as Ve,mr as He,mt as Ue,n as We,nr as K,nt as q,on as J,or as Ge,ot as Y,p as Ke,pn as qe,pr as X,pt as Je,q as Ye,qn as Xe,rn as Ze,rr as Qe,sn as $e,sr as et,t as tt,tn as Z,tr as nt,tt as rt,u as it,ur as at,vn as ot,vr as st,vt as ct,wn as lt,wt as Q,x as ut,xr as dt,yn as ft,yr as pt,yt as mt,zn as ht,zt as gt}from"./nanite-lib-CX5czZ8O.js";import{c as _t,d as vt,i as yt,l as bt,m as xt,n as St,o as Ct,r as $,s as wt,t as Tt,u as Et}from"./godrays-jPnt69EE.js";import{t as Dt}from"./OrbitControls-BThpa3Jw.js";var Ot=(e,t,n)=>({branch:{angle:{1:e},children:{0:110},gnarliness:{0:.03,1:.06}},leaves:{count:t,size:n,angle:22,sizeVariance:.25}}),kt={pine:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.92,.86,.8],leafTint:[.7,.78,1.05],options:Ot(98,16,2.4),seed:101},spruce:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.72,.68,.66],leafTint:[.5,.64,1.12],options:Ot(118,22,2.3),seed:202},fir:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.78,.78,.8],leafTint:[.42,.57,1.02],options:Ot(124,22,2.1),seed:303},douglasFir:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.8,.68,.6],leafTint:[.6,.72,.98],options:Ot(110,18,2.6),seed:404},aspen:{preset:`Aspen Large`,conifer:!1,bark:`birch`,leaf:`aspen`,barkTint:[.9,.95,.86],leafTint:[.4,.74,.82],options:{leaves:{count:22}},seed:505},birch:{preset:`Aspen Large`,conifer:!1,bark:`birch`,leaf:`ash`,barkTint:[1,1,1],leafTint:[.9,.9,.86],options:{branch:{angle:{1:38}},leaves:{count:24,size:2.6}},seed:606},hemlock:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.76,.7,.67],leafTint:[.44,.6,.94],options:Ot(132,24,2.2),seed:808},blackSpruce:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.61,.59,.59],leafTint:[.4,.55,.98],options:Ot(115,20,1.8),seed:909},cottonwood:{preset:`Aspen Large`,conifer:!1,bark:`oak`,leaf:`aspen`,barkTint:[.82,.83,.75],leafTint:[.52,.82,.74],options:{branch:{angle:{1:48}},leaves:{count:28,size:3.3}},seed:1010},snag:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.36,.33,.37],leafTint:[.3,.3,.3],options:{branch:{angle:{1:96},children:{0:70},gnarliness:{0:.06,1:.25}},leaves:{count:0}},seed:707}},At=e=>kt[e]??kt.spruce;function jt(e){let t=t=>e.fields.indexOf(t),n=e.fields.length,r=t(`x`),i=t(`y`),a=t(`z`),o=t(`height`),s=t(`crownWidth`),c=t(`species`),l=t(`crownBase`),u=t(`dbhCm`),d=t(`form`),f=t(`source`),p=t(`tone`),m=[],h=[];for(let t=0;t<e.count;t++){let g=t*n,_=e.data[g+o],v=l>=0?e.data[g+l]:-1,y=u>=0?e.data[g+u]:0,b=d>=0?e.data[g+d]:0;if(!(f>=0&&e.data[g+f]===2||v>=0&&Number.isFinite(v)||y>0||b>0)||!Number.isFinite(_)||_<=0||![e.data[g+r],e.data[g+i],e.data[g+a]].every(Number.isFinite)){h.push(t);continue}let x=s>=0?e.data[g+s]:NaN;m.push({record:t,ordinal:m.length,tone:p>=0&&Number.isFinite(e.data[g+p])?Math.max(0,Math.min(1,e.data[g+p])):.5,x:e.data[g+r],y:e.data[g+i],z:e.data[g+a],species:e.species[e.data[g+c]]??`spruce`,height:_,width:Number.isFinite(x)&&x>0?x:_*.2,crownBase:Number.isFinite(v)&&v>=0?Math.min(1,v):b>0?0:.3,dbhMeters:Number.isFinite(y)&&y>0?y/100:Math.max(.025,_*.012),form:b===1||b===2?b:0})}return{components:m,keep:h}}function Mt(e,t){if(t.length===e.count)return e;let n=[];for(let r of t)for(let t=0;t<e.fields.length;t++)n.push(e.data[r*e.fields.length+t]);let r=e.ids;return{...e,count:t.length,data:n,...r?{ids:t.map(e=>r[e])}:{}}}function Nt(e,t=24){if(!e.length)return 250;let n=1/0,r=-1/0,i=1/0,a=-1/0;for(let t of e)n=Math.min(n,t.x),r=Math.max(r,t.x),i=Math.min(i,t.y),a=Math.max(a,t.y);let o=250,s=()=>(Math.floor(r/o)-Math.floor(n/o)+1)*(Math.floor(a/o)-Math.floor(i/o)+1);for(;s()>t;)o*=2;return o}function Pt(e,t=V(new dt)){let{components:r,keep:i}=jt(e),a=new v;a.name=`stand-components`;let o=new Map,s=Nt(r),c=new Set,u=V(1e10),d=V(0),p=V(new M),m=mt(Je(f.xy.add(t),H(.06711056,.00583715)).fract().mul(52.9829189)),h=_(d.greaterThan(.5),G(.5),m),g=z(u,l(u.mul(1.2),u.add(.001)),Q(n.sub(p))),y=_(h.greaterThanEqual(g),G(1),G(0));for(let e of r){let t=`${Math.floor(e.x/s)},${Math.floor(e.y/s)}`;c.add(t);let n=`${t}:${e.species===`snag`?`dead`:!At(e.species).conifer||e.form===2?`broad`:`conifer`}`,r=o.get(n)??[];r.push(e),o.set(n,r)}let x=new Float32Array(r.length*2);for(let e of r)x.set([e.x,e.y],e.ordinal*2);let S=[],C=new K,w=new ze,T=new M,D=new M;for(let e of o.values()){let t=e[0],n=!At(t.species).conifer||t.form===2?new pt(.5,10,7):new b(.5,1,10,3);n.translate(0,.5,0);let r=new E(.5,.5,1,8);r.translate(0,.5,0);for(let[i,o]of[[`crown`,n],[`trunk`,r]]){if(i===`crown`&&t.species===`snag`)continue;let n=new ft({roughness:1,metalness:0}),r=new fe({toneMapped:!1});n.opacityNode=r.opacityNode=y,n.alphaTest=r.alphaTest=.5;let s=new ue(o,n,e.length);s.layers.enable(1),s.castShadow=s.receiveShadow=!0;let c=new Float32Array(e.length*3),l=new Pe;e.forEach((e,t)=>{let n=e.height*e.crownBase,r=e.height-n,a=i===`crown`?e.width:e.dbhMeters,o=i===`crown`?r:e.height*.96;T.set(e.x,e.z+(i===`crown`?n:0),-e.y),D.set(a,o,a),s.setMatrixAt(t,C.compose(T,w,D));let u=At(e.species),d=i===`crown`?u.leafTint:u.barkTint,f=.8+.4*e.tone;l.setRGB(f*d[0]*(i===`crown`?.12:.2),f*d[1]*(i===`crown`?.18:.17),f*d[2]*(i===`crown`?.1:.13)),l.toArray(c,t*3),s.setColorAt(t,l)}),s.computeBoundingBox(),s.computeBoundingSphere(),a.add(s),S.push({mesh:s,normal:n,flat:r,rows:e,colours:c})}}return{group:a,xy:x,count:r.length,chunks:c.size,draws:S.length,chunkMeters:s,naniteTrees:Mt(e,i),culling(e){for(let t of S)t.mesh.frustumCulled=e},transition(e,t){u.value=e??1e10,t&&p.value.copy(t)},flat(e){d.value=+!!e;for(let t of S)t.mesh.material=e?t.flat:t.normal},setClasses(e){let t=new Pe;for(let n of S)n.rows.forEach((r,i)=>{let a=r.ordinal*3;e?t.setRGB(e[a]/255,e[a+1]/255,e[a+2]/255):t.fromArray(n.colours,i*3),n.mesh.setColorAt(i,t)}),n.mesh.instanceColor&&(n.mesh.instanceColor.needsUpdate=!0)}}}function Ft(e){if(!e?.count)return null;let t=t=>e.fields.indexOf(t),n=e.fields.length;if([`x`,`y`,`z`,`kind`,`length`,`diameter`,`heading`].some(e=>t(e)<0))return null;let r=new v;r.name=`treated-stems`;let i=new E(.45,.5,1,8);i.translate(0,.5,0);let a=new ft({color:6838346,roughness:1}),o=new Map,s=new ze,c=new M,l=new M;for(let r=0;r<e.count;r++){let i=i=>e.data[r*n+t(i)],a=i(`x`),u=i(`y`),d=i(`z`),f=i(`length`),p=i(`diameter`),m=e.kinds[i(`kind`)];if(![a,u,d,f,p].every(Number.isFinite)||f<=0||p<=0||![`stump`,`felled`,`log`,`snag`].includes(m))continue;let h=m===`felled`||m===`log`,g=(Number.isFinite(i(`heading`))?i(`heading`):0)*Math.PI/180;s.setFromUnitVectors(new M(0,1,0),h?new M(Math.sin(g),0,-Math.cos(g)):new M(0,1,0)),c.set(a,d+(h?p*.5:0),-u),l.set(p,f,p);let _=`${Math.floor(a/250)},${Math.floor(u/250)}`,v=o.get(_)??[];if(v.push(new K().compose(c,s,l)),o.set(_,v),m===`felled`)for(let e of[.55,.7,.85])for(let t of[-1,1]){let n=new M(Math.sin(g+t*.65),.1,-Math.cos(g+t*.65)).normalize();s.setFromUnitVectors(new M(0,1,0),n),c.set(a+Math.sin(g)*f*e,d+p*.5,-u-Math.cos(g)*f*e),v.push(new K().compose(c,s,l.set(p*.2,f*.13,p*.2)))}}for(let e of o.values()){let t=new ue(i,a,e.length);e.forEach((e,n)=>t.setMatrixAt(n,e)),t.computeBoundingBox(),t.computeBoundingSphere(),t.layers.enable(1),t.castShadow=t.receiveShadow=!0,r.add(t)}return r}var It=Object.freeze({resolutionScale:1,maxFps:0,maxInFlight:2,dissolveMode:`pixels`,dissolvePixels:4,dissolveReferenceHeight:1080,frustumCulling:!0});function Lt(e,t=It){let n={...t};if(!e||typeof e!=`object`||Array.isArray(e))return n;let r=e,i=(e,t,i,a=!1)=>{let o=r[e];typeof o==`number`&&Number.isFinite(o)&&Object.assign(n,{[e]:a?Math.round(Math.min(i,Math.max(t,o))):Math.min(i,Math.max(t,o))})};return i(`resolutionScale`,.5,1),i(`maxInFlight`,1,3,!0),i(`dissolvePixels`,.5,16),i(`dissolveReferenceHeight`,240,4320,!0),r.maxFps===0?n.maxFps=0:i(`maxFps`,15,120,!0),(r.dissolveMode===`pixels`||r.dissolveMode===`relative`)&&(n.dissolveMode=r.dissolveMode),typeof r.frustumCulling==`boolean`&&(n.frustumCulling=r.frustumCulling),n}function Rt(e){let t={};for(let[n,r]of[[`renderScale`,`resolutionScale`],[`maxfps`,`maxFps`],[`gpuqueue`,`maxInFlight`],[`cutoffpx`,`dissolvePixels`],[`referenceheight`,`dissolveReferenceHeight`]])e.has(n)&&(t[r]=e.get(n)?.trim()?Number(e.get(n)):NaN);return e.has(`dissolve`)&&(t.dissolveMode=e.get(`dissolve`)),(e.get(`culling`)===`0`||e.get(`culling`)===`1`)&&(t.frustumCulling=e.get(`culling`)===`1`),Lt(t)}function zt(e,t,n=e.dissolvePixels){return n*(e.dissolveMode===`relative`?t/e.dissolveReferenceHeight:1)}function Bt(e,t,n,r,i=90){return Math.max(0,Math.min(e,Math.max(0,Math.min(t-n,r)-i)/1.2))}var Vt=class extends tt{frustumCulling=!0;all=new Ie;_cull(e,t){this.all.projectionMatrix.makeScale(1e-10,1e-10,1e-10),super._cull(e,this.frustumCulling?t:this.all)}},Ht=class{inFlight=0;latencyMs=0;completed=0;skippedQueue=0;skippedFps=0;failures=0;last=-1/0;pending=new Set;allow(e,t,n){return this.inFlight>=n?(this.skippedQueue++,!1):t>0&&e-this.last+.01<1e3/t?(this.skippedFps++,!1):(this.last=e,!0)}submitted(e,t,n=()=>performance.now(),r){this.inFlight++;let i=!1,a,o=e.then(()=>{this.completed++},e=>{this.failures++,i=!0,a=e}).finally(()=>{let e=Math.max(0,n()-t);this.latencyMs=this.latencyMs?this.latencyMs*.8+e*.2:e,this.inFlight--,this.pending.delete(o),i&&r?.(a)});this.pending.add(o)}async drain(){await Promise.all(this.pending)}stats(){return{inFlight:this.inFlight,completionLatencyMs:this.latencyMs,completed:this.completed,skippedQueue:this.skippedQueue,skippedFps:this.skippedFps,failures:this.failures}}},Ut=.08,Wt=1.2,Gt=(Wt/Ut)**(1/10),Kt=Array.from({length:17},(e,t)=>t===10?Wt:t>10?Wt*Gt**(t-10):Ut*Gt**t);function qt(e){if(!(e>0))return 0;let t=Math.round(Math.log(e/Ut)/Math.log(Gt));return Math.min(16,Math.max(0,t))}var Jt=e=>Kt[e],Yt=(e,t)=>e+t*17;function Xt(e){let t=e.map(qt);return{binOf:t,bins:[...new Set(t)].sort((e,t)=>e-t)}}function Zt(e){if(!e.length)return{mean:0,p90:0};let t=Float64Array.from(e).sort(),n=0;for(let e=0;e<t.length;e++)n+=t[e];return{mean:n/t.length,p90:t[Math.floor(t.length*.9)]??0}}function Qt(e){let t=e.length,n=0;for(let r=0;r<t;r++)e[r]>=n&&(n=e[r]+1);let r=new Uint32Array(n+1);for(let n=0;n<t;n++)r[e[n]+1]++;for(let e=0;e<n;e++)r[e+1]+=r[e];let i=new Uint32Array(t);for(let n=0;n<t;n++)i[r[e[n]]++]=n;return i}function $t(e,t,n=.1){let r=Math.round(e/n)|0,i=Math.round(t/n)|0,a=2166136261^Math.imul(r,2654435761);return a=Math.imul(a^a>>>16,2246822507),a^=Math.imul(i,3266489909),a=Math.imul(a^a>>>13,668265263),(a^a>>>16)>>>0}function en(e){let t=e>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var tn=new Float64Array(1),nn=new Uint32Array(tn.buffer),rn={Null:1,Undefined:2,True:3,False:4,Number:5,Numbers:6,String:7,Array:8,Object:9,Typed:10,Other:11};function an(e){let t=2654435769,n=2246822507,r=3266489909,i=668265263,a=(e,a)=>{t=Math.imul(t^e,2654435761),t^=t>>>15,n=Math.imul(n^a,2246822519),n^=n>>>13,r=Math.imul(r^e,3266489917),r^=r>>>16,i=Math.imul(i^a,668265263),i^=i>>>14},o=e=>{a(rn.String,e.length);for(let t=0;t+1<e.length;t+=2)a(e.charCodeAt(t),e.charCodeAt(t+1));e.length&1&&a(e.charCodeAt(e.length-1),1540483477)},s=e=>{a(rn.Typed,e.byteLength),o(Object.prototype.toString.call(e));let s=e.byteLength>>>2,c=e.byteOffset%4==0?new Uint32Array(e.buffer,e.byteOffset,s):new Uint32Array(new Uint8Array(e.buffer,e.byteOffset,s*4).slice().buffer),l=t,u=n,d=r,f=i,p=0;for(;p+1<s;p+=2){let e=c[p],t=c[p+1];l=Math.imul(l^e,2654435761),l^=l>>>15,u=Math.imul(u^t,2246822519),u^=u>>>13,d=Math.imul(d^e,3266489917),d^=d>>>16,f=Math.imul(f^t,668265263),f^=f>>>14}t=l,n=u,r=d,i=f,p<s&&a(c[p],1540483477);let m=new Uint8Array(e.buffer,e.byteOffset+s*4,e.byteLength-s*4);for(let e of m)a(e,374761393)},c=e=>{if(typeof e==`number`)a(rn.Number,0),tn[0]=e,a(nn[0],nn[1]);else if(e===null)a(rn.Null,0);else if(e===void 0)a(rn.Undefined,0);else if(typeof e==`string`)o(e);else if(typeof e==`boolean`)a(e?rn.True:rn.False,0);else if(Array.isArray(e)){let t=e.length;a(rn.Array,t);for(let n=0;n<t;){if(typeof e[n]!=`number`){c(e[n++]);continue}let r=n+1;for(;r<t&&typeof e[r]==`number`;)r++;for(a(rn.Numbers,r-n);n<r;n++)tn[0]=e[n],a(nn[0],nn[1])}}else if(ArrayBuffer.isView(e))s(e);else if(e instanceof ArrayBuffer)s(new Uint8Array(e));else if(typeof e==`object`){let t=Object.keys(e);a(rn.Object,t.length);for(let n of t)o(n),c(e[n])}else a(rn.Other,0),o(String(e))};c(e);let l=e=>(e^=e>>>16,e=Math.imul(e,2246822507),e^=e>>>13,e=Math.imul(e,3266489909),e^e>>>16);t=l(t),n=l(n^t),r=l(r^n),i=l(i^r),t=l(t^i);let u=e=>(e>>>0).toString(16).padStart(8,`0`);return u(t)+u(n)+u(r)+u(i)}function on(e){return an({...e,createdAt:void 0})}var sn=419430400;function cn(e,t){try{let n=JSON.parse(e).packages?.[`node_modules/${t}`];return!n||typeof n.version!=`string`||!n.version?null:typeof n.integrity==`string`&&n.integrity?`${n.version} ${n.integrity}`:n.version}catch{return null}}function ln(e){return!e.ezTree||!e.meshoptimizer||!e.engine?null:JSON.stringify({format:e.format??1,grow:e.grow??2,engine:e.engine,ezTree:e.ezTree,meshoptimizer:e.meshoptimizer})}function un(e,t){let{look:n,seed:r,height:i,ratio:a,crownBase:o,leafMask:s}=t;return`${e}\n${JSON.stringify({look:n,seed:r,height:i,ratio:a,crownBase:o})}\n${s?an([s.size,s.bits]):`no mask`}`}function dn(e,t=``){let n=[];for(let r of Object.keys(e).sort()){let i=e[r],a=t?`${t}.${r}`:r;ArrayBuffer.isView(i)?n.push([a,i]):i&&typeof i==`object`&&n.push(...dn(i,a))}return n}function fn(e){return dn(e).reduce((e,[,t])=>e+t.byteLength,0)}function pn(e){let t=(e,n)=>{let r={};for(let i of Object.keys(e).sort()){if(i===`ms`||n&&i===`id`)continue;let a=e[i];r[i]=a&&typeof a==`object`&&!ArrayBuffer.isView(a)&&!Array.isArray(a)?t(a,!1):a}return r};return an(t(e,!0))}function mn(e,t,n,r=sn,i=new Set){let a=e.filter(e=>e.namespace!==t).map(e=>e.key),o=e.filter(e=>e.namespace===t).sort((e,t)=>e.at-t.at||(e.key<t.key?-1:1)),s=o.reduce((e,t)=>e+t.bytes,0)+n;for(let e of o){if(s<=r)break;i.has(e.key)||(a.push(e.key),s-=e.bytes)}return a}var hn=`pgmaps-tree-cache`,gn=`entries`,_n=`trees`,vn=e=>new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error??Error(`IndexedDB request failed`))}),yn=e=>new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=e.onabort=()=>n(e.error??Error(`IndexedDB transaction failed`))});function bn(){try{indexedDB.deleteDatabase(hn)}catch{}}async function xn(e,t=sn){let n,r=new Map;try{let e=indexedDB.open(hn,1);e.onupgradeneeded=()=>{e.result.createObjectStore(gn,{keyPath:`key`}),e.result.createObjectStore(_n)},n=await vn(e);for(let e of await vn(n.transaction(gn).objectStore(gn).getAll()))r.set(e.key,e)}catch{return null}let i={hits:0,misses:0,writes:0,evicted:0},a=null,o=new Set,s=e=>{a=e instanceof Error?e.message:String(e)},c=async e=>{if(!e.length)return;let t=n.transaction([gn,_n],`readwrite`,{durability:`relaxed`});for(let n of e)t.objectStore(gn).delete(n),t.objectStore(_n).delete(n);await yn(t);for(let t of e)r.delete(t);i.evicted+=e.length};try{await c(mn([...r.values()],e,0,t))}catch(e){return s(e),null}let l=Promise.resolve();return{entry:e=>a?void 0:r.get(e),async read(e){let t=r.get(e);if(a||!t)return null;try{o.add(e);let r=await vn(n.transaction(_n).objectStore(_n).get(e));if(!r)return i.misses++,null;i.hits++,t.at=Date.now();try{n.transaction(gn,`readwrite`,{durability:`relaxed`}).objectStore(gn).put(t)}catch{}return r}catch(e){return s(e),null}},write(u,d){if(a)return Promise.resolve(!1);let f=l.then(async()=>{if(a)return!1;try{let a={key:u,namespace:e,bytes:fn(d),at:Date.now(),digest:pn(d)};o.add(u),await c(mn([...r.values()].filter(e=>e.key!==u),e,a.bytes,t,o));let s=a.bytes;for(let e of r.values())e.key!==u&&(s+=e.bytes);if(s>t)return!1;let l=n.transaction([gn,_n],`readwrite`,{durability:`relaxed`});return l.objectStore(gn).put(a),l.objectStore(_n).put(d,u),await yn(l),r.set(u,a),i.writes++,!0}catch(e){return s(e),!1}});return l=f,f},async clear(){try{let e=n.transaction([gn,_n],`readwrite`,{durability:`relaxed`});return e.objectStore(gn).clear(),e.objectStore(_n).clear(),await yn(e),r.clear(),!0}catch(e){return s(e),!1}},stats:()=>{let n=[...r.values()].filter(t=>t.namespace===e);return{entries:n.length,bytes:n.reduce((e,t)=>e+t.bytes,0),capBytes:t,otherNamespaces:r.size-n.length,...i,failed:a}}}}var Sn=`{
  "name": "threejs-nanites",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "threejs-nanites",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@dgreenheck/ez-tree": "^1.1.0",
        "meshoptimizer": "^1.3.0",
        "three": "^0.186.1"
      },
      "devDependencies": {
        "@types/node": "^24.19.2",
        "@types/pngjs": "^6.0.5",
        "@types/three": "^0.186.0",
        "@webgpu/types": "^0.1.74",
        "playwright-core": "^1.64.0",
        "pngjs": "^7.0.0",
        "typescript": "^7.0.2",
        "vite": "^8.3.4"
      }
    },
    "node_modules/@dgreenheck/ez-tree": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@dgreenheck/ez-tree/-/ez-tree-1.1.0.tgz",
      "integrity": "sha512-6pvS6hD6B6h00dm0SnkgYeT4ABU5Y1Z9M44p1tXiV5C0eKrQy2sKECXshoaUv0qAOqYVL68w/PwadUxDFDiHUg==",
      "license": "MIT",
      "peerDependencies": {
        "three": ">=0.167"
      }
    },
    "node_modules/@dimforge/rapier3d-compat": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/@dimforge/rapier3d-compat/-/rapier3d-compat-0.12.0.tgz",
      "integrity": "sha512-uekIGetywIgopfD97oDL5PfeezkFpNhwlzlaEYNOA0N6ghdsOvh/HYjSMek5Q2O1PYvRSDFcqFVJl4r4ZBwOow==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/@oxc-project/types": {
      "version": "0.153.0",
      "resolved": "https://registry.npmjs.org/@oxc-project/types/-/types-0.153.0.tgz",
      "integrity": "sha512-jSNrRIyvPVLL5E1z/tS5zLAprosGz/FuI1PWwEOz59j3E4TTTzSpqKb/RDGqJhhW0QHYISGXxq582wGx6T11Tw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/oxc-project"
      }
    },
    "node_modules/@rolldown/binding-android-arm-eabi": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm-eabi/-/binding-android-arm-eabi-1.2.13.tgz",
      "integrity": "sha512-Vu/NICrgdRvUOeaJZIyB2FP63s6fO/4ud5l8dXmxDx9yDyn+mN0y+gsvsVviSli+T361Aqo0h46EuMoobrwawA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-android-arm64": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-android-arm64/-/binding-android-arm64-1.2.13.tgz",
      "integrity": "sha512-6LEoIrGy5vvCd2boNnv2soPSUZj/PRvhp8R/t9KlX+mIZxThIE/ZqxrGXxmuNX0FuvQFvLdZr7S4HrYpYBVhEQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-arm64": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-arm64/-/binding-darwin-arm64-1.2.13.tgz",
      "integrity": "sha512-CaJSRzlQ6Q+zkDMVA9OkVxBjVoPRCDEE3v0FSJ9kIQBgRjFApA3Si4ijhbNVUji7ZJt+PfO0e46qy4nPInHUPA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-darwin-x64": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-darwin-x64/-/binding-darwin-x64-1.2.13.tgz",
      "integrity": "sha512-e4r340I5hxSzJkD3YJBxgzq/rJ3wwxwdLLb2FPt1Zpyem20nrQPT11DDEEkazwxaHumH8wpglsp/Ozgj/wT6mw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-freebsd-x64": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-freebsd-x64/-/binding-freebsd-x64-1.2.13.tgz",
      "integrity": "sha512-hoBWDZ4/K/mJKVMbsgUd1jfpA2DiOrJ54mpegObU9TBHBBrtX4FLIXJJQRDPZ/2Dn91GvPob+Z2hwKJzf4E5SQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm-gnueabihf": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm-gnueabihf/-/binding-linux-arm-gnueabihf-1.2.13.tgz",
      "integrity": "sha512-oF9fZu3vTWnTiVAkDFxU9PJLt1nh20K9RRpuHsR7ZnE2L7XookBbDBVLojCVSLGbvtSlxeUNnjAj6DbNsKyzbg==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-gnu": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-gnu/-/binding-linux-arm64-gnu-1.2.13.tgz",
      "integrity": "sha512-DTpb/+jMiqWMPgphn4ksW1zW+XLJ6dJJ9FMvnIk9I291LhCctMPhMYJrP5t9p6C9qa3KXadDdUEZHBaPh3kNxQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-arm64-musl": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-arm64-musl/-/binding-linux-arm64-musl-1.2.13.tgz",
      "integrity": "sha512-xU+Kvv9N2A3SY35zFh1FWWNjxbadE/BKeqnkXe7vScU4GZsw757BlVmDLITZEq8DPpk6m7uoDYkK7P+x/uU5Ow==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-ppc64-gnu": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-ppc64-gnu/-/binding-linux-ppc64-gnu-1.2.13.tgz",
      "integrity": "sha512-XMk/hnhh25oQ756Lclb1Q11h4ll0xC0Esa5w4Vzp+mAE2S3AGJgeM0SonrIgY8fHhjarb6hcoTuwoFG0VVP2ig==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-s390x-gnu": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-s390x-gnu/-/binding-linux-s390x-gnu-1.2.13.tgz",
      "integrity": "sha512-U1BoTHYmlywE2n3HUWjzZ+8EQsKr+OwpxYuDWaubx42tUL8QSL7nOqRz/NVHanibbFP3M1Rxuprz/wNcbMKjqw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-gnu": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-gnu/-/binding-linux-x64-gnu-1.2.13.tgz",
      "integrity": "sha512-J4cm80Pc6wEwV5AZ42o62sIQgDk+Y7R2s646jIwuvO+4V46QB58N4vVuMPWCBaNgursXLpmUWJV//WQAkPvHBQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-linux-x64-musl": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.2.13.tgz",
      "integrity": "sha512-W0euZS40U4V6JkmEnVCIX9mcsL6cbXQ4X8c2w+MMOIjFg68TXUW+u3RT+2e1t1pv9mg/EP3pDtK3POXdQ7Rxyw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-openharmony-arm64": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-openharmony-arm64/-/binding-openharmony-arm64-1.2.13.tgz",
      "integrity": "sha512-do/AF/4n9MRshia3a5aXoy8xM2c6mgfT6D7H/dY6my5z+hfCIR4ab7mk4IRj++nsEQpKy39kd0DQnDq+r692tw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-arm64-msvc": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-arm64-msvc/-/binding-win32-arm64-msvc-1.2.13.tgz",
      "integrity": "sha512-6FtUf2cJZobutJdxnGYX8z0vtbgqU0b2v8vfBhkXb9wp2MppMFtkunE+IaOntyi01rkIQoPW2GHABtfzsC0BRQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/binding-win32-x64-msvc": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/@rolldown/binding-win32-x64-msvc/-/binding-win32-x64-msvc-1.2.13.tgz",
      "integrity": "sha512-UKhFaZTeTcbKrb3iU82m17jVcPEAoqDkCN5MBqgPyZSwp/cQmib21crTS0DdH7T1B7wZRWEI89YQAOJMet5yhg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      }
    },
    "node_modules/@rolldown/pluginutils": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.1.tgz",
      "integrity": "sha512-2j9bGt5Jh8hj+vPtgzPtl72j0yRxHAyumoo6TNfAjsLB04UtpSvPbPcDcBMxz7n+9CYB0c1GxQFxYRg2jimqGw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tweenjs/tween.js": {
      "version": "23.1.3",
      "resolved": "https://registry.npmjs.org/@tweenjs/tween.js/-/tween.js-23.1.3.tgz",
      "integrity": "sha512-vJmvvwFxYuGnF2axRtPYocag6Clbb5YS7kLL+SO/TeVFzHqDIWrNKYtcsPMibjDx9O+bu+psAy9NKfWklassUA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "24.19.2",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-24.19.2.tgz",
      "integrity": "sha512-93d49wCWJkCyN87MxLpNN6KXPCwFw7bVUg79mGUV1OS40JGWwVCr8n61DXCSqz7CV6/VfPkb7xec7uP2M+QHWQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": ">=7.24.0 <7.24.7"
      }
    },
    "node_modules/@types/pngjs": {
      "version": "6.0.5",
      "resolved": "https://registry.npmjs.org/@types/pngjs/-/pngjs-6.0.5.tgz",
      "integrity": "sha512-0k5eKfrA83JOZPppLtS2C7OUtyNAl2wKNxfyYl9Q5g9lPkgBl/9hNyAu6HuEH2J4XmIv2znEpkDd0SaZVxW6iQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/node": "*"
      }
    },
    "node_modules/@types/stats.js": {
      "version": "0.17.4",
      "resolved": "https://registry.npmjs.org/@types/stats.js/-/stats.js-0.17.4.tgz",
      "integrity": "sha512-jIBvWWShCvlBqBNIZt0KAshWpvSjhkwkEu4ZUcASoAvhmrgAUI2t1dXrjSL4xXVLB4FznPrIsX3nKXFl/Dt4vA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/three": {
      "version": "0.186.0",
      "resolved": "https://registry.npmjs.org/@types/three/-/three-0.186.0.tgz",
      "integrity": "sha512-mxYSBpDC+D0pLfSP6sW4WZTcT+nrtmZcimMqnVmy36Hte3XpeYSrvgg4TRdaM1GemGog1AWzI5qL2VoIfMXbJQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@dimforge/rapier3d-compat": "~0.12.0",
        "@tweenjs/tween.js": "~23.1.3",
        "@types/stats.js": "*",
        "@types/webxr": ">=0.5.17",
        "fflate": "~0.8.3",
        "meshoptimizer": "~1.1.1"
      }
    },
    "node_modules/@types/three/node_modules/meshoptimizer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/meshoptimizer/-/meshoptimizer-1.1.1.tgz",
      "integrity": "sha512-oRFNWJRDA/WTrVj7NWvqa5HqE1t9MYDj2VaWirQCzCCrAd2GHrqR/sQezCxiWATPNlKTcRaPRHPJwIRoPBAp5g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/webxr": {
      "version": "0.5.24",
      "resolved": "https://registry.npmjs.org/@types/webxr/-/webxr-0.5.24.tgz",
      "integrity": "sha512-h8fgEd/DpoS9CBrjEQXR+dIDraopAEfu4wYVNY2tEPwk60stPWhvZMf4Foo5FakuQ7HFZoa8WceaWFervK2Ovg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@typescript/typescript-aix-ppc64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-aix-ppc64/-/typescript-aix-ppc64-7.0.2.tgz",
      "integrity": "sha512-MTKKkWB7p/0E9xi1d1tHtZ5PiLkGEMIq88pK2CubZjOsLtYTLqhgIgi6zepFa+9GHZ6h05NMCkQxGKiPXMxXtQ==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-darwin-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-darwin-arm64/-/typescript-darwin-arm64-7.0.2.tgz",
      "integrity": "sha512-gowzar9MwS/aRWp6f3a4KUqzRjAZjOsmGNCM6LcTgXum+dBfgsBVMN+AgvOCCbguXyick6LJhpBszxMebJ8syA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-darwin-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-darwin-x64/-/typescript-darwin-x64-7.0.2.tgz",
      "integrity": "sha512-SZ9xZInqApNlNGc9s0W1VSsktYSOe9cFqNOIqmN1Gs8SmkjKZYFt017G4VwPxASInODuAdbTW7sXiFUf893RgA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-freebsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-freebsd-arm64/-/typescript-freebsd-arm64-7.0.2.tgz",
      "integrity": "sha512-W5NH4y/J0plIIS5b2xvTEkU7JFxyqdMAOgf+Ilhl0vHQXKO5dZoxd+C/jEtq56c4F3wk71RB4BMRQ2XdI+bwYQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-freebsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-freebsd-x64/-/typescript-freebsd-x64-7.0.2.tgz",
      "integrity": "sha512-UMGDx5sTpzNw3WiPebH7l90IWfJggEd+egHt/q6p7/Cm3zqoV7VxkGXt+3DxPIw8CcmvAB0j3sVVfbhX+M4Tpw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-arm": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-arm/-/typescript-linux-arm-7.0.2.tgz",
      "integrity": "sha512-gffT3xPz9sR7j/YJExkyPntrI0P2EP9XbOyWzth2/Gs0RstK+90RBcO0ncXoXy/beYll1SXw846Nf2zdnEz0QQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-arm64/-/typescript-linux-arm64-7.0.2.tgz",
      "integrity": "sha512-Qh4eU4/y3yDjnfjjyPYihMj5/ODIlmt+Bzu17OI+fiSRDW57QmU5SiN63exPRNJPKUzcc1INa1NXdrJ+MqHjUQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-loong64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-loong64/-/typescript-linux-loong64-7.0.2.tgz",
      "integrity": "sha512-uEHck9i8hoAzXPiYRib1O7miOnz23SxIeVl6F4LXox+qov1K35jHcEW6VHKvZI+pyvl7fZEP4MCU5LYvIq1GuQ==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-mips64el": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-mips64el/-/typescript-linux-mips64el-7.0.2.tgz",
      "integrity": "sha512-R4KvAMnE43W5Qeqb0Ly56O3mWMWIAgsMyz36DCaycd5nbg/9kzm0liw3JocfRqyJY0KPmzFjbswozXyW0DnIYA==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-ppc64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-ppc64/-/typescript-linux-ppc64-7.0.2.tgz",
      "integrity": "sha512-DORx5b3sd/4S7eayxm4FQv+A7CrkUIGRaHiwI8oiHTAI1fAPWhF4J0vAlkC8biAlHSVVwxMQ3tjZ2/DVbnQiiA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-riscv64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-riscv64/-/typescript-linux-riscv64-7.0.2.tgz",
      "integrity": "sha512-wf0jqEDOjrPRnKwYRyyJDRo11KMbvMFrU+q4zqKyChODBzvlkbhNQfKvLxQCcwTpdDaXSHZTVuh0JoCrKCUMHQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-s390x": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-s390x/-/typescript-linux-s390x-7.0.2.tgz",
      "integrity": "sha512-IkwJc3L7yhytWd/ewjyxNDfOmswCm9GWMJT/ue/dU4aZNbwZeYAetq42VyLmsmSjvoX7z74X6ZaYCtzAr0EuGw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-linux-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-linux-x64/-/typescript-linux-x64-7.0.2.tgz",
      "integrity": "sha512-EYdf2cNg7rgCWJnxCdJ+F3V39O8ihb37eHAu1LK8oAFizgTQbPOK7zHHXbPt8rX24COqODXeI3sIf0fCXG7H/A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-netbsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-netbsd-arm64/-/typescript-netbsd-arm64-7.0.2.tgz",
      "integrity": "sha512-+polYF4MF04aPpO5FTkHran9yUQDSXqy5GiSDKpsll5jy3l3+g9QLhpf39T+ePtefhXLOGrLl0QIjkQP6VnelA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-netbsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-netbsd-x64/-/typescript-netbsd-x64-7.0.2.tgz",
      "integrity": "sha512-8YIT0EHM/3dq10ZOVF/A7pc/YSMtbcecct4rWtexrnSCHOPcpC2KTLXfTCR6vDpnSiY12heNb1GiN/wu+T/FyA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-openbsd-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-openbsd-arm64/-/typescript-openbsd-arm64-7.0.2.tgz",
      "integrity": "sha512-APT8+ClYnuYm1u9+kgGXoMj2VzWzcymwh2gNSQVySHfkRDGOTVkoWLjCmOQSaO+PoqQ57B0flRp9SA+7GnnkzQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-openbsd-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-openbsd-x64/-/typescript-openbsd-x64-7.0.2.tgz",
      "integrity": "sha512-yX7s+Q0Dln0Dt9tEzZsAjXXR/+ytBM7AlglaqyeMPxQszJ1JhlJdZ6jLA+IzldHtflX81em7lDao1xXu+aRRkg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-sunos-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-sunos-x64/-/typescript-sunos-x64-7.0.2.tgz",
      "integrity": "sha512-dLJDGaLZ1D4HPQn62u1n8mBDkJREwMsAkCdkwd4Ieqw+x3TUyTsqY0YiBCtE6H6OzzgGk3iuZ3vFWRS+E8/d1g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-win32-arm64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-win32-arm64/-/typescript-win32-arm64-7.0.2.tgz",
      "integrity": "sha512-Gyl1Vy6OsWesLzmq+EP0Fb7b4Nid5232AvcA2SFcdYreldpNtYFFofPjnt62y9hQy7VTaZp65ICJjuAQRaVcIQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@typescript/typescript-win32-x64": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/@typescript/typescript-win32-x64/-/typescript-win32-x64-7.0.2.tgz",
      "integrity": "sha512-0BQ3HkAHHlKLSp1qRvf3SUhGpGsDuhB/jgFw75guyqbxJqEaS0Cw/VFO8i2nHglJUzQCRtMMR/IBAKE3ETMC4g==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16.20.0"
      }
    },
    "node_modules/@webgpu/types": {
      "version": "0.1.74",
      "resolved": "https://registry.npmjs.org/@webgpu/types/-/types-0.1.74.tgz",
      "integrity": "sha512-lgiI4hbuLcI9unnm2cL/tvCaQU45dp0xcLWJh5uB/9MBGvIA4F8XIk7nSiBeg+K4xWGYwgZKn80LmERI5CxoTA==",
      "dev": true,
      "license": "BSD-3-Clause"
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/fflate": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.8.3.tgz",
      "integrity": "sha512-tbZNuJrLwGUp3zshBtdy4W+ORxZuIh8a5ilyIEQDC5rY1f3U20JMry0Ll3WBzU58EZKsEuJFXhb5gwv8CsPvgA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.33.0.tgz",
      "integrity": "sha512-WkUDrojuJs0xkgGf2udWxa3yGBRxPtxUkB79i6aCZLRgc7PM8fZe9TosfPDcvEpQZbuFASnHYmRLBLUbmLOIIA==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.33.0",
        "lightningcss-darwin-arm64": "1.33.0",
        "lightningcss-darwin-x64": "1.33.0",
        "lightningcss-freebsd-x64": "1.33.0",
        "lightningcss-linux-arm-gnueabihf": "1.33.0",
        "lightningcss-linux-arm64-gnu": "1.33.0",
        "lightningcss-linux-arm64-musl": "1.33.0",
        "lightningcss-linux-x64-gnu": "1.33.0",
        "lightningcss-linux-x64-musl": "1.33.0",
        "lightningcss-win32-arm64-msvc": "1.33.0",
        "lightningcss-win32-x64-msvc": "1.33.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.33.0.tgz",
      "integrity": "sha512-gEpRTalKdosp4Bb8qWtc2iOgE5SeIHlpS1up9bFq2wAyYhl1UdTObYiHe98zEM9SQvSoqQZ1IQD0JNpg3Ml5pg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.33.0.tgz",
      "integrity": "sha512-Sciaz8eenNTKn9b3t7+xr0ipTp9YxKQY4npwQ3mrRuL0BAVHBLyZxofhaKBAVtzmtRZ/zTyo0/to4B1uWG/Djg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.33.0.tgz",
      "integrity": "sha512-Z5UPAxzrjlWNNyGy6i65cJzzvgJ5D3T6wMvs+gWpY9d7qRhANrxqAp6LhxIgZhWEw18RfJTGcRxjuLIBr+m8XQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.33.0.tgz",
      "integrity": "sha512-QQM/Ti/hQajJwCY+RiWuCZ9sdtI/XQk7nDK5vC8kkdwixezOlDgvDx7+RT+QjK6FcFT4MpsuoBnHIo/O3StRRg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.33.0.tgz",
      "integrity": "sha512-N7FVBe6iS24MlM6R/4RBTxGhQheZGs7tiQ9U32UtF75NzP5Q7xWPRqLBCKxlRQRk3rY1jCIPLzx7WzOhuUIRLQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.33.0.tgz",
      "integrity": "sha512-j2v/itmy4HlNxlc6voKXYgBqNi0Ng2LShg4z7GufpEgs05P+2suBVyi9I6YHq5uoVFx9ETin3eCEhLVyXGQnKg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.33.0.tgz",
      "integrity": "sha512-yiO5ROMuYQgXbC60yjZU5CYSFZGKXL0HFATXt9mHJn1+zW55oCtMI9NfcVhYLMFDL7gV7oBPon/EmMMGg2OvtQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.33.0.tgz",
      "integrity": "sha512-ar+Ju7LmcN0Jo4FpL4hpFybwNG9/3A/Br5KW2n2jyODg3MEZXaDYADdemoNS+BDNfMgKvylJLj4S5tyRActuAg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.33.0.tgz",
      "integrity": "sha512-RYiYbkokw0trfKqqzfF55lginwEPrD3OJDfTuJzFs1MK6iFnDenaz1fqLLtX4ITG3OktJQXOeTaw1awrBAlZPw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.33.0.tgz",
      "integrity": "sha512-1K+MPfLSFVpphzpdbfkhlWk6wBrTObBzS2T6db10PNOZgR9GoVsAWzwNyuhUYYbTp23j+4RrncfujZ4uAzXvwA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.33.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.33.0.tgz",
      "integrity": "sha512-OlEICDx/Xl0FqSp4bry8zFnCvGpig3Gl4gCquvYwHuqJKEC1+n9NgDniFvqHGmMv1ZkqDJrDqKKSykTDX+ehuA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/meshoptimizer": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/meshoptimizer/-/meshoptimizer-1.3.0.tgz",
      "integrity": "sha512-2oZqMAcEEiCtXWUjIGtZ71oPx1B0ZxYGTqIKsXB1wzWFhleNsCFxQuUJzgCV706bRcwPWtMGf1odmQvAcqKkIw==",
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.20",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.20.tgz",
      "integrity": "sha512-uKdg2G3GNCKQn9byYOpxbGqrT2fGO5KRt5J/8b3pok8rT6qxGWF6hxMyJiEYtAf+FVyYuD9hRaDqX5uPFYJ4ZQ==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/playwright-core": {
      "version": "1.64.0",
      "resolved": "https://registry.npmjs.org/playwright-core/-/playwright-core-1.64.0.tgz",
      "integrity": "sha512-T9r+MZkTECl2+oUcZ26YgZzTrYidTsIhYYkJix+6iDOymOb1FB2RLLSOxRGnZGv5DStt+aduIVbt+E8WygXYpg==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "playwright-core": "cli.js"
      },
      "engines": {
        "node": ">=20"
      }
    },
    "node_modules/pngjs": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/pngjs/-/pngjs-7.0.0.tgz",
      "integrity": "sha512-LKWqWJRhstyYo9pGvgor/ivk2w94eSjE3RGVuzLGlr3NmD8bf7RcYGze1mNdEHRP6TRP6rMuDHk5t44hnTRyow==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=14.19.0"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.29",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.29.tgz",
      "integrity": "sha512-49cGhUbXj8Qenv0iTMxA1cFBzxXoctpC9Ujd77t1WcbJIr6nF/eI7g/8MgxrYldFRuAXvja7xQRwavoW7kgrxQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.19",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.2"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/rolldown": {
      "version": "1.2.13",
      "resolved": "https://registry.npmjs.org/rolldown/-/rolldown-1.2.13.tgz",
      "integrity": "sha512-/5apOkwWxtACcQtZ5WlrAsKS4JwXVThQPJZ3RqIruRY9UG9M8e0VlXN068xum/JRKA4aIUoJ13ghe/kGCvidiQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@oxc-project/types": "=0.153.0",
        "@rolldown/pluginutils": "^1.0.0"
      },
      "bin": {
        "rolldown": "bin/cli.mjs"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "optionalDependencies": {
        "@rolldown/binding-android-arm-eabi": "1.2.13",
        "@rolldown/binding-android-arm64": "1.2.13",
        "@rolldown/binding-darwin-arm64": "1.2.13",
        "@rolldown/binding-darwin-x64": "1.2.13",
        "@rolldown/binding-freebsd-x64": "1.2.13",
        "@rolldown/binding-linux-arm-gnueabihf": "1.2.13",
        "@rolldown/binding-linux-arm64-gnu": "1.2.13",
        "@rolldown/binding-linux-arm64-musl": "1.2.13",
        "@rolldown/binding-linux-ppc64-gnu": "1.2.13",
        "@rolldown/binding-linux-s390x-gnu": "1.2.13",
        "@rolldown/binding-linux-x64-gnu": "1.2.13",
        "@rolldown/binding-linux-x64-musl": "1.2.13",
        "@rolldown/binding-openharmony-arm64": "1.2.13",
        "@rolldown/binding-win32-arm64-msvc": "1.2.13",
        "@rolldown/binding-win32-x64-msvc": "1.2.13"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz",
      "integrity": "sha512-KGj/8Y43x35aZVDtt+J4mK1hoLGHULMYfSkODJNQjNDC3oW1PqPoxMwo0pLUsWM/UEGzON/NxeHywEfNXNP3Vw==",
      "dev": true,
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/three": {
      "version": "0.186.1",
      "resolved": "https://registry.npmjs.org/three/-/three-0.186.1.tgz",
      "integrity": "sha512-blFeqb49wRCSGUGj7gtpfnSGHy2lwDk94RhUmS1c/hTby70kvChbWpkJ4Pm1390LqzzvTmzgXKHPEafJwCb8jA==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/typescript": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-7.0.2.tgz",
      "integrity": "sha512-8FYau96o3NKOhbjKi/qNvG/W5jhzxkbdm5sj9AbZ/5T5sWqn3hJgLfGx27sRKZWTvyzCP8dLRBTf5tBTSRVUNA==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc"
      },
      "engines": {
        "node": ">=16.20.0"
      },
      "optionalDependencies": {
        "@typescript/typescript-aix-ppc64": "7.0.2",
        "@typescript/typescript-darwin-arm64": "7.0.2",
        "@typescript/typescript-darwin-x64": "7.0.2",
        "@typescript/typescript-freebsd-arm64": "7.0.2",
        "@typescript/typescript-freebsd-x64": "7.0.2",
        "@typescript/typescript-linux-arm": "7.0.2",
        "@typescript/typescript-linux-arm64": "7.0.2",
        "@typescript/typescript-linux-loong64": "7.0.2",
        "@typescript/typescript-linux-mips64el": "7.0.2",
        "@typescript/typescript-linux-ppc64": "7.0.2",
        "@typescript/typescript-linux-riscv64": "7.0.2",
        "@typescript/typescript-linux-s390x": "7.0.2",
        "@typescript/typescript-linux-x64": "7.0.2",
        "@typescript/typescript-netbsd-arm64": "7.0.2",
        "@typescript/typescript-netbsd-x64": "7.0.2",
        "@typescript/typescript-openbsd-arm64": "7.0.2",
        "@typescript/typescript-openbsd-x64": "7.0.2",
        "@typescript/typescript-sunos-x64": "7.0.2",
        "@typescript/typescript-win32-arm64": "7.0.2",
        "@typescript/typescript-win32-x64": "7.0.2"
      }
    },
    "node_modules/undici-types": {
      "version": "7.24.6",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-7.24.6.tgz",
      "integrity": "sha512-WRNW+sJgj5OBN4/0JpHFqtqzhpbnV0GuB+OozA9gCL7a993SmU+1JBZCzLNxYsbMfIeDL+lTsphD5jN5N+n0zg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vite": {
      "version": "8.3.4",
      "resolved": "https://registry.npmjs.org/vite/-/vite-8.3.4.tgz",
      "integrity": "sha512-IftLE8phJhdNRIGNEV4JCCvfNScoZQVfcXaN8TQropWGJtOHcu+iAB9pHcuGvmEb/kddw0LBe/jS8ztdC6xdiQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "lightningcss": "^1.33.0",
        "picomatch": "^4.0.7",
        "postcss": "^8.5.29",
        "rolldown": "~1.2.12",
        "tinyglobby": "^0.2.17"
      },
      "bin": {
        "vite": "bin/vite.js"
      },
      "engines": {
        "node": "^20.19.0 || >=22.12.0"
      },
      "funding": {
        "url": "https://github.com/vitejs/vite?sponsor=1"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.3"
      },
      "peerDependencies": {
        "@types/node": "^20.19.0 || >=22.12.0",
        "@vitejs/devtools": "^0.7.1",
        "esbuild": "^0.27.0 || ^0.28.0",
        "jiti": ">=1.21.0",
        "less": "^4.0.0",
        "sass": "^1.70.0",
        "sass-embedded": "^1.70.0",
        "stylus": ">=0.54.8",
        "sugarss": "^5.0.0",
        "terser": "^5.16.0",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        },
        "@vitejs/devtools": {
          "optional": true
        },
        "esbuild": {
          "optional": true
        },
        "jiti": {
          "optional": true
        },
        "less": {
          "optional": true
        },
        "sass": {
          "optional": true
        },
        "sass-embedded": {
          "optional": true
        },
        "stylus": {
          "optional": true
        },
        "sugarss": {
          "optional": true
        },
        "terser": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    }
  }
}
`,Cn=`../textures/`,wn=1024,Tn=new Map,En=(e,t)=>{let n=Tn.get(e);return n||Tn.set(e,n=Ct(e,wn,t)),n},Dn=e=>En(`${Cn}${e}_color_1k.jpg`,!1),On=e=>En(`${Cn}${e}_color.png`,!0);function kn(e,[t,n,r]){let i=new Uint8ClampedArray(e.px);for(let e=0;e<i.length;e+=4)i[e]*=t,i[e+1]*=n,i[e+2]*=r;return{px:i,alphaScales:e.alphaScales,mask:e.mask}}var An=Math.max(2,Math.min(6,(navigator.hardwareConcurrency||4)-1)),jn=0,Mn=[];async function Nn(e){jn>=An?await new Promise(e=>Mn.push(e)):jn++;try{return await e()}finally{let e=Mn.shift();e?e():jn--}}var Pn=3e4,Fn=[],In,Ln={spawned:0,jobs:0};function Rn(e,t){return Nn(()=>new Promise((n,r)=>{let i=Fn.pop();i||(i=new Worker(new URL(new URL(`tree-worker-Zal_EyDl.js`,import.meta.url).href,``+import.meta.url),{type:`module`}),Ln.spawned++),Ln.jobs++;let a=i;a.onmessage=e=>{a.onmessage=a.onerror=null,Fn.push(a),clearTimeout(In),In=setTimeout(()=>Fn.splice(0).forEach(e=>e.terminate()),Pn),n(e.data)},a.onerror=e=>(a.terminate(),r(Error(`tree worker: ${e.message}`))),a.postMessage({...e,id:t})}))}var zn=new URLSearchParams(location.search).get(`treecache`)===`1`;zn||bn();var Bn=null,Vn=null,Hn=()=>Vn??=(async()=>zn?(Bn=ln({engine:`1.0.0+a913ca7`,ezTree:cn(Sn,`@dgreenheck/ez-tree`),meshoptimizer:cn(Sn,`meshoptimizer`)}),Bn?xn(Bn):null):null)().catch(()=>null),Un=new Map;async function Wn(e,t){let n=await Hn();if(!n||!Bn)return Rn(e,t);let r=un(Bn,e),i=e=>(`error`in e||n.write(r,e),e),a=n.entry(r);if(!a)return i(await Rn(e,t));let o=e.look.conifer,s=Un.get(o);if(!s){let r=Rn(e,t);s=r.then(async e=>`error`in e?!1:pn(e)===a.digest||(console.warn(`pgmaps trees: a cached tree no longer matches its growth (bump GROW_VERSION in tree-cache-key.ts); the cache is emptied`),await n.clear(),!1),()=>!1),Un.set(o,s);let c=await r;return await s?c:i(c)}if(await s){let e=await n.read(r);if(e)return e}return i(await Rn(e,t))}var Gn=new Map;function Kn(e,t){let n=JSON.stringify({...e,leafMask:null}),r=Gn.get(n);return r||(r=Wn(e,t),Gn.set(n,r),r.then(e=>`error`in e&&Gn.delete(n),()=>Gn.delete(n))),r}Object.assign(globalThis,{pgmapsTrees:{stats:async()=>({cache:zn,pool:{...Ln,idle:Fn.length},store:(await Hn())?.stats()??null,namespace:Bn}),clear:async()=>(await Hn())?.clear()??!1,replies:()=>Promise.all([...Gn].map(async([e,t])=>[e,await t]))}});var qn=e=>{let t=J(e,`float`);return e=>t.element(je(e))};async function Jn(e,n,r=[]){let i=performance.now(),{fields:a,data:o,count:s}=e.trees,c=a.length,l=Object.fromEntries([`x`,`y`,`z`,`species`,`height`,`crownWidth`,`tone`].map(e=>[e,a.indexOf(e)]));if(l.x<0||l.y<0||l.z<0||l.species<0||l.height<0)throw Error(`The package's trees lack x, y, z, species or height.`);let u=new Map;for(let e=0;e<s;e++){let t=o[e*c+l.species];u.has(t)||u.set(t,[]),u.get(t).push(e)}for(let e of r)u.has(e.species)||u.set(e.species,[]);let d=[...u.keys()].sort((e,t)=>e-t),f=new Map,p=d.map(t=>e.trees.species[t]??`spruce`),m=[],h=new Int32Array(s),g=new Float64Array(s),_=[];for(let[t,n]of d.entries()){let i=p[t],a=At(i),s=e.species?.[i],d=u.get(n),v=d.map(e=>{let t=e*c,n=l.crownWidth>=0?o[t+l.crownWidth]:NaN;return Number.isFinite(n)&&n>0?n/Math.max(1,o[t+l.height]):s?.crownRatio??.25}),y=Xt(v),{binOf:b}=y,x=r.filter(e=>e.species===n).map(e=>qt(e.ratio)),S=[...new Set([...y.bins,...x])].sort((e,t)=>e-t),C=(await On(a.leaf)).mask,w=new Map;for(let e of S)w.set(e,m.length),m.push({job:{look:a,seed:Yt(a.seed,e),height:20,ratio:Jt(e),crownBase:s?.crownBase??null,leafMask:C},species:n,layer:t,bin:e});x.length&&f.set(n,[...new Set(x)].map(e=>w.get(e))),d.forEach((e,t)=>{h[e]=w.get(b[t]),g[e]=v[t]}),_.push(`${i}: ${d.length} stems, crown/height rungs ${S.map(e=>`${e}:${Jt(e).toFixed(2)}`).join(` / `)}`)}let v=await Promise.all(m.map(({job:e},t)=>Kn(e,t))),y=v.map((e,t)=>{if(`error`in e)throw Error(`growing ${p[m[t].layer]}: ${e.error}`);let{src:n,radius:r,height:i}=e;return{...e,id:t,name:`${p[m[t].layer]}-${t}`,radius:r,height:i,src:n}});v.forEach((e,t)=>{`error`in e||_.push(`  type ${t}: rung ${m[t].bin} ratio ${m[t].job.ratio.toFixed(2)} grown ${e.grown.toFixed(2)} (x${e.squash.toFixed(2)} across), ${(e.idx.length/3).toLocaleString()} tris, ${Math.round(e.ms)} ms`)});let b=v.map((e,t)=>`error`in e?m[t].job.ratio:e.grown*e.squash),x=new Float64Array(s);for(let e=0;e<s;e++)x[e]=Math.abs(g[e]/b[h[e]]-1);let S=Qt(h),C=new Float32Array(s*4),w=new Float32Array(s*4);for(let e=0;e<s;e++){let t=S[e],n=t*c,r=e*4,i=Math.sin(o[n+l.x]*12.9898+o[n+l.y]*78.233)*43758.5453%1*Math.PI*2,a=l.tone>=0?o[n+l.tone]:.5;C[r]=o[n+l.x],C[r+1]=o[n+l.z],C[r+2]=-o[n+l.y],C[r+3]=o[n+l.height]/20,w[r]=Math.cos(i),w[r+1]=Math.sin(i),w[r+2]=h[t],w[r+3]=Number.isFinite(a)?a:.5}let T=await yt(p.map(async e=>kn(await Dn(At(e).bark),At(e).barkTint)),wn),E=await yt(p.map(async e=>kn(await On(At(e).leaf),At(e).leafTint)),wn);T.colorSpace=E.colorSpace=He,E.wrapS=E.wrapT=t;let D=m.map(e=>e.layer),O={bark:T,leaf:E,barkLayerOf:qn(D),leafLayerOf:qn(D),alphaToCoverage:n>1,leafDither:n===1&&de},k=null,A=()=>k??=Zt(x);return{types:y,instances:{a:C,b:w},textures:O,barkLayers:D,leafLayers:D,residual:{get mean(){return A().mean},get p90(){return A().p90},lines:_},growMs:performance.now()-i,extraTypes:f}}var Yn=[.35,.6,.85],Xn=1e3,Zn=.35;function Qn(e){let t=t=>e.indexOf(t);return{x:t(`x`),y:t(`y`),z:t(`z`),species:t(`species`),height:t(`height`),crownWidth:t(`crownWidth`),tone:t(`tone`),stride:e.length}}function $n(e,t,n=()=>void 0){let r=Qn(e.fields),i=e.fields.indexOf(`source`),a=e.fields.indexOf(`expansion`);if(i>=0&&e.data[t*r.stride+i]===2||a>=0&&e.data[t*r.stride+a]===1||r.crownWidth<0||r.height<0)return!1;let o=t*r.stride,s=e.data[o+r.crownWidth],c=e.data[o+r.height];if(!(s>0&&c>0))return!1;let l=n(e.species[e.data[o+r.species]]??``)??.2;return s/c>Math.max(1,4*l)}function er(e,t={}){let n=t.cell??30,r=Qn(e.fields);if(r.x<0||r.y<0||r.height<0||r.species<0)return null;let i=t.extent?.west??1/0,a=t.extent?.south??1/0,o=t.extent?.east??-1/0,s=t.extent?.north??-1/0,c=!!t.extent,l=new Uint8Array(e.count),[u,d]=t.eye??[0,0],f=0,p=new Float64Array(e.species.length),m=[];for(let n=0;n<e.count;n++){let h=n*r.stride,g=e.data[h+r.species];if(g>=0&&g<p.length&&!t.notCommon?.(e.species[g]??``)&&p[g]++,m.push(e.data[h+r.height]),!$n(e,n,t.speciesRatio)){f=Math.max(f,Math.hypot(e.data[h+r.x]-u,e.data[h+r.y]-d));continue}if(l[n]=1,c=!0,t.extent)continue;let _=e.data[h+r.crownWidth]/2;i=Math.min(i,e.data[h+r.x]-_),o=Math.max(o,e.data[h+r.x]+_),a=Math.min(a,e.data[h+r.y]-_),s=Math.max(s,e.data[h+r.y]+_)}if(!c)return null;i=Math.floor(i/n)*n,a=Math.floor(a/n)*n;let h=Math.max(1,Math.ceil((o-i)/n)),g=Math.max(1,Math.ceil((s-a)/n)),_=h*g,v=e.species.length,y=new Float64Array(_),b=new Float64Array(_),x=new Float64Array(_),S=new Float32Array(_*v),C=new Uint8Array(_),w=new Uint8Array(_);for(let t=0;t<e.count;t++){let o=t*r.stride,s=e.data[o+r.x],c=e.data[o+r.y],u=e.data[o+r.height],d=(r.crownWidth>=0&&e.data[o+r.crownWidth]>0?e.data[o+r.crownWidth]:u*.2)/2,f=e.data[o+r.species],p=Math.floor((s-d-i)/n),m=Math.floor((s+d-i)/n),_=Math.floor((c-d-a)/n),T=Math.floor((c+d-a)/n),E=Math.PI*d*d;for(let e=Math.max(0,_);e<=Math.min(g-1,T);e++)for(let r=Math.max(0,p);r<=Math.min(h-1,m);r++){let o=p===m&&_===T?1:tr(s,c,d,i+r*n,a+e*n,n);if(o<=0)continue;let g=e*h+r,D=E*o;y[g]+=u*D,b[g]+=D,x[g]+=D,f>=0&&f<v&&(S[g*v+f]+=D),w[g]=1,l[t]&&(C[g]=1)}}let T=new Float32Array(_),E=new Float32Array(_);for(let e=0;e<_;e++){T[e]=b[e]>0?y[e]/b[e]:NaN,E[e]=Math.min(1,x[e]/(n*n));let t=0;for(let n=0;n<v;n++)t+=S[e*v+n];if(t>0)for(let n=0;n<v;n++)S[e*v+n]/=t}let D=0;p.forEach((e,t)=>e>p[D]&&(D=t)),m.sort((e,t)=>e-t);let O=m.length?m[Math.floor(m.length/2)]:22;return{west:i,south:a,cell:n,columns:h,rows:g,height:T,crownShare:E,shares:S,aggregate:C,touched:w,species:e.species,realReach:f,commonSpecies:D,medianHeight:O}}function tr(e,t,n,r,i,a){let o=0,s=0;for(let c=0;c<4;c++)for(let l=0;l<4;l++){let u=e-n+(c+.5)/4*2*n,d=t-n+(l+.5)/4*2*n;(u-e)**2+(d-t)**2>n*n||(s++,u>=r&&u<r+a&&d>=i&&d<i+a&&o++)}return s?o/s:0}function nr(e,t,n=0){let r=Math.imul(e|0,668265261)^Math.imul(t|0,374761393)^Math.imul(n|0,2654435761);return r=Math.imul(r^r>>>15,2246822507),r=Math.imul(r^r>>>13,3266489909),((r^r>>>16)>>>0)/4294967296}function rr(e,t,n,r={}){let i=[[],[],[]],a=e.species.length,[o,s]=r.eye??[0,0],c=r.maxReach??1/0;for(let l=0;l<e.rows;l++)for(let u=0;u<e.columns;u++){let d=l*e.columns+u,f=e.west+(u+.5+(nr(u,l,1)-.5)*.4)*e.cell,p=e.south+(l+.5+(nr(u,l,2)-.5)*.4)*e.cell,m=Math.hypot(f-o,p-s);if(m>c)continue;let h=!e.touched[d]&&m>e.realReach+e.cell;if(!e.aggregate[d]&&!h)continue;let g=(n(f,p)??(e.touched[d]?e.crownShare[d]:0))*(r.keepAt?.(f,p)??1);if(!(g>=.08))continue;let _=e.commonSpecies,v=0;for(let t=0;t<a;t++)e.shares[d*a+t]>v&&(v=e.shares[d*a+t],_=t);let y=r.standAt?.(f,p),b=Number.isFinite(e.height[d])?e.height[d]:e.medianHeight;if(y){b=y.heightMeters;let t=y.species.filter(t=>t.share>0&&e.species.includes(t.species)),n=t.reduce((e,t)=>e+t.share,0),r=nr(u,l,7)*n;for(let n of t)if(r-=n.share,r<=0){_=e.species.indexOf(n.species),b=n.heightMeters??b;break}}let x=t(f,p),S=e.cell/4,C=(t(f+S,p)-t(f-S,p))/(2*S),w=(t(f,p+S)-t(f,p-S))/(2*S);Number.isFinite(x)&&(i[0].push(f,p,x,b),i[1].push(Number.isFinite(C)?C:0,Number.isFinite(w)?w:0,Math.min(1,g),_),i[2].push(nr(u,l,3),0,0,0))}return{count:i[0].length/4,a:Float32Array.from(i[0]),b:Float32Array.from(i[1]),c:Float32Array.from(i[2])}}function ir(e,t){let n=Math.min(.97,Math.max(0,e)),r=Math.PI*t*t/4;return Math.max(0,Math.min(Xn,-Math.log(1-n)/r*1e4))}var ar=(e,t,n)=>n*t/Math.max(1e-6,e),or=(e,t)=>e/2/Math.tan(t*Math.PI/360),sr={pine:[.06,.085,.04],spruce:[.04,.065,.045],fir:[.035,.058,.042],douglasFir:[.05,.072,.045],aspen:[.075,.11,.05],birch:[.08,.11,.055],hemlock:[.033,.058,.039],blackSpruce:[.031,.053,.041],cottonwood:[.075,.115,.055]},cr={via:{chroma:.3,tint:[1,1,.98]},photo:{chroma:.22,tint:[.95,1,1.1]}};function lr(e){let t=e.filter(e=>!!e);return(e,n)=>{for(let r of t){let t=(e-r.west)/r.spacing,i=(n-r.south)/r.spacing;if(t<0||i<0||t>r.columns-1||i>r.rows-1)continue;let a=Math.min(r.columns-2,Math.floor(t)),o=Math.min(r.rows-2,Math.floor(i)),s=t-a,c=i-o,l=0,u=0;for(let[e,t,n]of[[0,0,(1-s)*(1-c)],[1,0,s*(1-c)],[0,1,(1-s)*c],[1,1,s*c]]){let i=(o+t)*r.columns+a+e;!r.known[i]||n<=0||(l+=r.closure[i]*n,u+=n)}if(u>1e-6)return l/u}return null}}function ur(e,t,n,r,i={}){let a=Math.max(i.cell??120,Math.max(e.east-e.west,e.north-e.south)/(i.maxSide??1024)),o=Math.max(2,Math.ceil((e.east-e.west)/a)),s=Math.max(2,Math.ceil((e.north-e.south)/a)),c=new Float32Array(o*s*4),l=new Float32Array(o*s*4),u=i.medianHeight??n?.medianHeight??22,d=i.commonSpecies??n?.commonSpecies??0,f=n?.species.length??0,p=Array.from({length:Math.max(f,d+1)},(e,t)=>r(t));for(let r=0;r<s;r++)for(let s=0;s<o;s++){let m=r*o+s,h=e.west+(s+.5)*a,g=e.south+(r+.5)*a,_=t(h,g),v=u,y=p[d];if(n){let e=Math.floor((h-n.west)/n.cell),t=Math.floor((g-n.south)/n.cell);if(e>=0&&t>=0&&e<n.columns&&t<n.rows){let r=t*n.columns+e;if(n.touched[r]){Number.isFinite(n.height[r])&&(v=n.height[r]);let e=[0,0,0];for(let t=0;t<f;t++){let i=n.shares[r*f+t];if(i>0)for(let n=0;n<3;n++)e[n]+=p[t][n]*i}e[0]+e[1]+e[2]>0&&(y=e)}}}let b=i.standAt?.(h,g);if(b){v=b.heightMeters;let e=[0,0,0],t=0;for(let r of b.species){let i=n?.species.indexOf(r.species)??-1;if(!(i<0||!(r.share>0))){t+=r.share;for(let t=0;t<3;t++)e[t]+=p[i][t]*r.share}}t>0&&(y=e.map(e=>e/t))}c.set([(_??i.unknownClosure??.55)*(i.keepAt?.(h,g)??1),v,_===null?0:1,1],m*4),l.set([y[0],y[1],y[2],1],m*4)}return{west:e.west,south:e.south,cell:a,columns:o,rows:s,stand:c,colour:l}}function dr(e,t,n,r,i){let a=e.geometry,o=new Map;for(let e=0;e<t.count;e++){let n=`${Math.floor(t.a[e*4]/1e3)},${Math.floor(t.a[e*4+1]/1e3)}`,r=o.get(n)??[];r.push(e),o.set(n,r)}let s=[];for(let c of o.values()){let o=new oe;o.setIndex(a.index),o.setAttribute(`position`,a.attributes.position);for(let e of[`pA`,`pB`,`pC`,`pClass`]){let t=a.getAttribute(e),n=new Float32Array(c.length*4);c.forEach((e,r)=>{for(let i=0;i<4;i++)n[r*4+i]=t.array[e*4+i]});let r=new R(n,4);o.setAttribute(e,r),e===`pClass`&&s.push({target:r,indices:c})}o.instanceCount=c.length;let l=new P;for(let e of c){let a=e*4,o=t.a[a],s=t.a[a+2],c=-t.a[a+1],u=t.a[a+3],d=Math.hypot(t.b[a],t.b[a+1]),f=i*2+n*u/r+i*d;l.expandByPoint(new M(o-f,s-f,c-f)),l.expandByPoint(new M(o+f,s+f,c+f))}o.boundingBox=l,o.boundingSphere=l.getBoundingSphere(new st);let u=new Qe(o,e.material);u.name=`stand-patch-chunk`,u.receiveShadow=!0,e.add(u)}return a.instanceCount=0,{chunks:o.size,syncClasses(){let e=a.getAttribute(`pClass`);for(let{target:t,indices:n}of s)n.forEach((n,r)=>{for(let i=0;i<4;i++)t.array[r*4+i]=e.array[n*4+i]}),t.needsUpdate=!0}}}var fr=[0,5,11,20,35],pr=384,mr=256,hr=3,gr=4,_r=Math.PI/180,vr=Number(new URLSearchParams(location.search).get(`patchcut`)??.42),yr=Number(new URLSearchParams(location.search).get(`patchacross`)??.35),br=Number(new URLSearchParams(location.search).get(`patchupdown`)??1.4),xr=e=>{let t=e>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}};async function Sr(t,n,r,i,a){let o=Math.max(1,i.length)*Yn.length,s=o*fr.length,c=Math.max(1,Math.min(s,Math.floor(8192/pr))),u=Math.ceil(s/c),f=()=>new we(c*pr,u*mr,{type:ve,generateMipmaps:!0,minFilter:Se,magFilter:e,depthBuffer:!0}),m=f(),g=f(),_=fr.map(e=>hr+30*Math.sin(e*_r)+22*1.35*Math.cos(e*_r)+2),v=Array.from({length:a},()=>0);i.forEach((e,t)=>v[e.species]=t);let y=n.views,b=Ke(y),x=(e,t)=>{let r=t*y+n.viewBase.array[e],i=Math.floor(r/b.cols);return{u0:(r-i*b.cols)/b.cols,v0:i/b.rows,du:1/b.cols,dv:1/b.rows}},S=new fe,C=new fe,E=rt(`uv`,`vec2`),D=rt(`shade`,`vec2`),O=e=>L(()=>{let t=Z(n.texture,E);return d(t.a.lessThan(.5),()=>te()),e})();{let e=Z(n.texture,E),t=T(G(.86),G(1),z(.05,.9,D.y));S.colorNode=O(qe(Y(e.rgb.div(l(e.a,.001)).mul(D.x).mul(t).mul(gr),0,1),1));let r=Z(n.normals,E);C.colorNode=O(qe(h(r.xyz.add(U(0,0,1e-4))).mul(.5).add(.5),1))}let k={target:t.getRenderTarget(),clear:t.getClearColor(new Pe),alpha:t.getClearAlpha(),auto:t.autoClear,tone:t.toneMapping};t.toneMapping=0,t.setClearColor(0,0);for(let e of[m,g])t.setRenderTarget(e),t.clear();t.autoClear=!1;let A=new ke;i.forEach((e,i)=>{Yn.forEach((a,o)=>{let s=ir(a,e.crownWidth),l=Math.max(1,Math.round(s*30*30/1e4)),u=Math.ceil(Math.sqrt(l)),d=30/u,f=xr(1e3+e.species*31+o*7),h=[],v=Array.from({length:u*u},(e,t)=>t).sort(()=>f()-.5).slice(0,l);for(let t of v){let n=(t%u+.15+.7*f())*d,i=(Math.floor(t/u)+.15+.7*f())*d,a=e.types[Math.floor(f()*e.types.length)]??0,o=22*(.72+.5*f());h.push({x:n,d:i,s:o/r[a].height,type:a,tint:.62+.7*f()})}fr.forEach((e,r)=>{let a=Math.cos(e*_r),s=Math.sin(e*_r),l=+(e>=15),u=[],d=[],f=[],v=[];for(let e of h){let t=n.frames[e.type],r=t.w*e.s,i=t.h*e.s,o=i/2*a+e.d*s;for(let t of[0,-30,30]){let n=e.x+t;if(n+r/2<0||n-r/2>30)continue;let{u0:a,v0:s,du:c,dv:p}=x(e.type,l),m=u.length/3,h=-e.d;for(let[t,l]of[[0,0],[1,0],[1,1],[0,1]])u.push(n+(t-.5)*r,o+(l-.5)*i,h),d.push(a+t*c,s+(1-l)*p),f.push(e.tint,l*.9+e.d/30*.1);v.push(m,m+1,m+2,m,m+2,m+3)}}let y=new w;y.setAttribute(`position`,new p(u,3)),y.setAttribute(`uv`,new p(d,2)),y.setAttribute(`shade`,new p(f,2)),y.setIndex(v);let b=new me(0,30,_[r]-hr,-3,-1,40);b.position.set(0,0,1),b.updateMatrixWorld();let T=(i*Yn.length+o)*fr.length+r,E=T%c,D=Math.floor(T/c);for(let[e,n]of[[m,S],[g,C]]){let r=new Qe(y,n);r.frustumCulled=!1,A.add(r),t.setRenderTarget(e),e.viewport.set(E*pr,D*mr,pr,mr),e.scissor.set(E*pr,D*mr,pr,mr),e.scissorTest=!0,t.clearDepth(),t.render(A,b),A.remove(r)}y.dispose()})})});for(let e of[m,g])e.scissorTest=!1,e.viewport.set(0,0,c*pr,u*mr);t.autoClear=k.auto,t.toneMapping=k.tone,t.setRenderTarget(k.target),t.setClearColor(k.clear,k.alpha),S.dispose(),C.dispose();let j=Array.from({length:a},()=>null);try{let e=await t.readRenderTargetPixelsAsync(m,0,0,c*pr,u*mr),n=c*pr*4;i.forEach((t,r)=>{let i=(r*Yn.length+1)*fr.length+1,a=i%c,o=Math.floor(i/c),s=0,l=0,u=0,d=0;for(let t=o*mr;t<(o+1)*mr;t++)for(let r=a*pr;r<(a+1)*pr;r++){let i=t*n+r*4;e[i+3]<128||(s+=e[i],l+=e[i+1],u+=e[i+2],d++)}d&&(j[t.species]=[s/d/255/gr,l/d/255/gr,u/d/255/gr])})}catch{}return{albedo:m,normals:g,cols:c,rows:u,frameH:_,slotOf:v,variants:o,meanAlbedo:j,dispose:()=>(m.dispose(),g.dispose())}}var Cr=()=>({chroma:V(.4),tint:V(new M(1,1,1))});function wr(e,t=Cr()){return{cutoff:V(4e3),band:V(.2),chroma:t.chroma,tint:t.tint,flat:V(0),hide:V(new i(0,0,0,0)),hideSpan:V(new dt(0,360)),snow:e}}var Tr=(e,t)=>{let n=Je(e,U(.2126,.7152,.0722));return T(U(n,n,n),e,t.chroma).mul(t.tint)},Er=(e,t)=>z(t.cutoff,t.cutoff.mul(t.band.add(1)),e),Dr=e=>_(e.flat.greaterThan(.5),G(.5),ge()),Or=(e,t,n)=>{let r=e.sub(n.hide.x),i=t.sub(n.hide.y),a=le(r,i).div(_r),o=mt(a.sub(n.hideSpan.x).div(360)).mul(360);return n.hide.z.greaterThan(0).and(r.mul(r).add(i.mul(i)).lessThan(n.hide.z.mul(n.hide.z))).and(o.lessThanEqual(n.hideSpan.y))};function kr(e,t,n,r){let i=new oe;i.setAttribute(`position`,new p([0,0,0,1,0,0,1,1,0,0,1,0],3)),i.setIndex([0,1,2,0,2,3]),i.setAttribute(`pA`,new R(e.a,4)),i.setAttribute(`pB`,new R(e.b,4)),i.setAttribute(`pC`,new R(e.c,4));let a=new R(new Float32Array(e.count*4),4);i.setAttribute(`pClass`,a),i.instanceCount=e.count;let o=rt(`pA`,`vec4`),c=rt(`pB`,`vec4`),u=rt(`pC`,`vec4`),d=rt(`pClass`,`vec4`),m=J(t.frameH,`float`),g=J(t.slotOf.length?t.slotOf:[0],`float`),v=fr.length,y=Yn.length,b=Re(G(0),`vPatchU`),x=Re(G(0),`vPatchV`),C=Re(qe(0),`vPatchInfo`).setInterpolation(`flat`),w=Re(qe(0),`vPatchSeed`).setInterpolation(`flat`),E=Re(U(0),`vPatchRight`).setInterpolation(`flat`),D=Re(U(0),`vPatchUp`).setInterpolation(`flat`),O=Re(U(0),`vPatchClass`).setInterpolation(`flat`),k=new ot({side:2,alphaTest:.5});k.positionNode=L(()=>{let e=A.xy,t=U(o.x,o.z,o.y.negate()).sub(q),r=h(H(t.x,t.z).add(H(1e-4,0))),i=r.mul(-15),a=o.z.add(c.x.mul(i.x)).add(c.y.mul(i.y.negate())),s=U(o.x.add(i.x),a,o.y.negate().add(i.y)),f=h(s.sub(q)),p=h(be(f,U(0,1,0))),y=be(p,f),S=h(U(c.x.negate(),1,c.y)),T=ae(Y(Je(f.negate(),S),0,1)).div(_r),k=o.w.div(22),j=Y(B(jr(T)),0,v-2),M=l(m.element(je(j)),m.element(je(j.add(1)))).mul(k),N=G(30).mul(Ye(r.x).add(Ye(r.y))),P=Q(s.sub(q)).greaterThan(n.cutoff.mul(n.band.add(1)).add(30)),ee=Or(o.x,o.y,n).or(P);b.assign(e.x.sub(.5).mul(N).div(30)),x.assign(e.y.mul(M)),C.assign(qe(T,c.z,g.element(je(c.w)),k)),w.assign(qe(u.x,Q(s.sub(q)),_(ee,G(0),G(1)),0)),E.assign(p),D.assign(y),O.assign(d.xyz);let te=s.add(p.mul(e.x.sub(.5).mul(N))).add(y.mul(e.y.mul(M).sub(k.mul(hr))));return _(ee,U(0,-1e6,0),te)})();let j=(e,n)=>{let r=B(e.div(t.cols)),i=e.sub(r.mul(t.cols)),a=mt(b.add(w.x.mul(7.31))),o=n.div(m.element(je(e.mod(v))).mul(C.w)),s=(e=>H(e.add(i).div(t.cols),G(1).sub(o).add(r).div(t.rows)))(a),c=H(b.dFdx().div(t.cols).mul(yr),o.dFdx().negate().div(t.rows).mul(br)),l=H(b.dFdy().div(t.cols).mul(yr),o.dFdy().negate().div(t.rows).mul(br)),u=o.greaterThanEqual(.01).and(o.lessThanEqual(.99)),d=Z(t.albedo.texture,s).grad(c,l),f=Z(t.normals.texture,s).grad(c,l);return{a:_(u,d,qe(0)),n:f}},M=(()=>{let e=_(n.flat.greaterThan(.5),G(.5),ut(f.xy)),t=Y(jr(C.x),0,v-1),r=s(B(t).add(_(mt(t).greaterThan(e),G(1),G(0))),v-1),i=Y(Mr(C.y),0,y-1),a=s(B(i).add(_(mt(i).greaterThan(mt(e.mul(5.7))),G(1),G(0))),y-1),o=C.z.mul(y).add(a).mul(v).add(r);return j(o,x)})(),N=M.a.a,P=L(()=>{let e=Er(w.y,n),t=w.z.greaterThan(.5).and(Dr(n).greaterThanEqual(e)),r=_(n.flat.greaterThan(.5),G(.5),G(vr));return _(t.and(N.greaterThan(r)),G(1),G(0))})(),ee=M.a.rgb.div(l(N,.001)).div(gr).mul(w.x.mul(.08).add(.96)),te=T(ee,U(.78,.81,.86).mul(Je(ee,U(.3,.59,.11)).mul(2).add(.55)),n.snow.mul(.2));k.colorNode=qe(_(n.flat.greaterThan(.5),U(0),Tr(te,n)),P),S(k,_(n.flat.greaterThan(.5),O,U(0))),k.normalNode=L(()=>{let e=M.n.xyz.div(l(M.n.a,.001)).mul(2).sub(1),t=h(be(D,E)),n=h(E.mul(e.x).add(D.mul(e.y)).add(t.mul(e.z)));return h(Ne.mul(qe(n,0)).xyz)})(),k.receivedShadowNode=r;let F=new Qe(i,k);F.frustumCulled=!1,F.receiveShadow=!0,F.name=`stand-patches`;let ne=dr(F,e,Math.max(...t.frameH),22,30);return{mesh:F,count:e.count,setClasses(t){let n=a.array;if(!t)n.fill(0);else for(let r=0;r<e.count;r++)n.set([Ar(t[r*3]),Ar(t[r*3+1]),Ar(t[r*3+2]),1],r*4);a.needsUpdate=!0,ne.syncClasses()}}}var Ar=e=>e/255;function jr(e){let t=fr,n=G(t.length-1);for(let r=t.length-2;r>=0;r--)n=_(e.lessThan(t[r+1]),G(r).add(Y(e.sub(t[r]).div(t[r+1]-t[r]),0,1)),n);return n}function Mr(e){let t=Yn,n=G(t.length-1);for(let r=t.length-2;r>=0;r--)n=_(e.lessThan(t[r+1]),G(r).add(Y(e.sub(t[r]).div(t[r+1]-t[r]),0,1)),n);return n}var Nr=`snag`,Pr=.12,Fr=.2,Ir={label:`Snag (burnt)`,crownRatio:Pr,crownBase:.12,broadleaf:!1},Lr={ashGone:1.5,herbFull:3,shrubStart:4,shrubFull:14,regenStart:10,regenFull:25,fallStart:8,fallHalf:25},Rr=1950,zr={ash:[.035,.032,.03],ashGrey:[.1,.095,.09],herbDry:[.25,.225,.1],herb:[.215,.235,.075],shrub:[.12,.14,.095],regen:[.05,.08,.037],snag:[.05,.044,.054],farStand:[.085,.09,.07]},Br=.6,Vr=.45;function Hr(e,t){return(n,r)=>{let i=e(n,r),a=t(n,r)??0;return!(a>0)||i!==null?i:Vr*a}}var Ur=.3,Wr=e=>{if(!e||Number.isNaN(e.getTime()))return null;let t=e.getUTCFullYear(),n=Date.UTC(t,0,1),r=Date.UTC(t+1,0,1);return t+(e.getTime()-n)/(r-n)};function Gr(e,t){return typeof e!=`number`||!Number.isFinite(e)?3:Math.max(0,t-(Math.floor(e)+.6))}function Kr(e){let t=Lr;return e<=t.fallStart?1:.1+.9*2**(-(e-t.fallStart)/(t.fallHalf-t.fallStart))}var qr=e=>Math.round(e-3-.6),Jr=e=>Math.min(1,Math.max(0,(e-Rr)/100));function Yr(e){let t=e?.burntYear??e?.fireYear;if(!e||!Array.isArray(t)||t.length!==e.columns*e.rows)return null;let n=new Float32Array(t.length).fill(NaN),r=!1;return t.forEach((e,t)=>{typeof e==`number`&&Number.isFinite(e)&&e>1800&&e<2200&&(n[t]=e,r=!0)}),r?n:null}var Xr=e=>e.some(e=>e.code.includes(7)),Zr=e=>e.some(e=>e.code.includes(7)||e.code.includes(Qr)),Qr=8;function $r(e){return(t,n)=>{for(let r of e){let e=(t-r.west)/r.spacing,i=(n-r.south)/r.spacing;if(e<0||i<0||e>r.columns-1||i>r.rows-1)continue;let a=Math.min(r.columns-2,Math.floor(e)),o=Math.min(r.rows-2,Math.floor(i)),s=e-a,c=i-o,l=(e,t)=>+(r.code[t*r.columns+e]===7);return(l(a,o)*(1-s)+l(a+1,o)*s)*(1-c)+(l(a,o+1)*(1-s)+l(a+1,o+1)*s)*c}return null}}function ei(e,t,n){for(let r of e){let e=(t-r.west)/r.spacing,i=(n-r.south)/r.spacing;if(e<-.5||i<-.5||e>r.columns-.5||i>r.rows-.5)continue;if(!r.fireYear)return null;let a=Math.floor(e),o=Math.floor(i),s=null,c=1/0;for(let[t,n]of[[a,o],[a+1,o],[a,o+1],[a+1,o+1]]){if(t<0||n<0||t>=r.columns||n>=r.rows)continue;let a=r.fireYear[n*r.columns+t],o=(e-t)**2+(i-n)**2;Number.isFinite(a)&&o<c&&(s=a,c=o)}return s}return null}function ti(e,t,n,r=()=>void 0){let i=e.fields.length,a=e.fields.indexOf(`x`),o=e.fields.indexOf(`y`),s=e.fields.indexOf(`species`),c=e.fields.indexOf(`crownWidth`),l=e.fields.indexOf(`height`);if(!Xr(t)||a<0||o<0||s<0)return{table:e,snags:0,fallen:0};let u=$r(t),d=e.species.indexOf(Nr),f=d>=0?d:e.species.length,p=e.data instanceof Float32Array?new Float32Array(e.count*i):Array(e.count*i),m=[],h=0,g=0,_=0;for(let d=0;d<e.count;d++){let v=d*i,y=e.data[v+a],b=e.data[v+o],x=u(y,b)??0,S=_*i;for(let t=0;t<i;t++)p[S+t]=e.data[v+t];if(x>0&&e.data[v+s]!==f&&pi(y+.37,b-.21)<x){let i=Gr(ei(t,y,b),n);if(pi(y-.53,b+.29)>=Kr(i)){g++;continue}c>=0&&l>=0&&!$n(e,d,r)&&(p[S+c]=Math.min(e.data[v+c]>0?e.data[v+c]:1/0,Pr*e.data[v+l])),p[S+s]=f,h++}e.ids&&m.push(e.ids[d]),_++}if(!h&&!g)return{table:e,snags:h,fallen:g};let v=_===e.count?p:p.slice(0,_*i);return{table:{...e,species:d>=0?e.species:[...e.species,Nr],count:_,data:v,...e.ids?{ids:m}:{}},snags:h,fallen:g}}function ni(e,t,n){let r=ti(e.trees,t,n,t=>e.species?.[t]?.crownRatio);return r.table===e.trees?{scene:e,snags:0,fallen:0}:{scene:{...e,trees:r.table,species:{...e.species??{},[Nr]:Ir}},snags:r.snags,fallen:r.fallen}}function ri(e,t){let n=new Uint8Array(e.columns*e.rows*4);for(let r=0;r<e.code.length;r++){if(e.code[r]===Qr&&(n[r*4+2]=255),e.code[r]!==7)continue;let i=e.fireYear&&Number.isFinite(e.fireYear[r])?e.fireYear[r]:t;n[r*4]=255,n[r*4+1]=Math.round(Jr(Math.floor(i))*255)}return n}function ii(e,t,n){let r=e.columns*e.rows,i=e.cover&&e.cover.length===r?e.cover.slice():Array(r).fill(0).map((n,r)=>e.heights[r]===null?null:e.west+r%e.columns*e.spacing>t?0:null),a=Array(r).fill(null);for(let r=0;r<i.length;r++)e.west+r%e.columns*e.spacing>t&&(i[r]===0||i[r]===1)&&(i[r]=7,a[r]=n);return{...e,cover:i,burntYear:a}}var ai={forest:0,sparse:1,shrub:2,herb:3,rock:4,water:5,cut:6,burnt:7,rockyStand:8},oi=new Set(Object.values(ai)),si={0:1,1:.55,2:.2,3:.12,4:0,5:0,6:1,7:1,8:1},ci={0:1,1:.5,2:0,3:0,4:0,5:0,6:1,7:1,8:1};function li(e){if(!e?.cover||e.cover.length!==e.columns*e.rows)return null;let t=e.columns*e.rows,n=new Int8Array(t).fill(-1),r=!1;for(let i=0;i<t;i++){let t=e.cover[i];if(typeof t==`number`&&oi.has(t)&&t!==ai.rockyStand){let a=e.canopy?.[i];n[i]=t===ai.rock&&typeof a==`number`&&a>=.1?ai.rockyStand:t,r=!0}}return r?{west:e.west,south:e.south,spacing:e.spacing,columns:e.columns,rows:e.rows,code:n,fireYear:Yr(e)}:null}function ui(e){return[e.terrain,e.farTerrain,e.skylineTerrain].map(li).filter(e=>!!e)}function di(e){if(!e.length)return null;let t={forest:0,sparse:0,shrub:0,herb:0,rock:0,water:0,cut:0,burnt:0,rockyStand:0,unknown:0},n=Object.keys(ai);for(let r of e)for(let e of r.code)e<0?t.unknown++:t[n[e]]++;return t}function fi(e,t,n=1){return(r,i)=>{for(let a of e){let e=(r-a.west)/a.spacing,o=(i-a.south)/a.spacing;if(e<0||o<0||e>a.columns-1||o>a.rows-1)continue;let s=Math.min(a.columns-2,Math.floor(e)),c=Math.min(a.rows-2,Math.floor(o)),l=e-s,u=o-c,d=(e,r)=>{let i=a.code[r*a.columns+e];return i<0?n:t[i]};return(d(s,c)*(1-l)+d(s+1,c)*l)*(1-u)+(d(s,c+1)*(1-l)+d(s+1,c+1)*l)*u}return null}}function pi(e,t){let n=Math.imul(Math.round(e*10)|0,668265261)^Math.imul(Math.round(t*10)|0,374761393)^1540483477;return n=Math.imul(n^n>>>15,2246822507),n=Math.imul(n^n>>>13,3266489909),((n^n>>>16)>>>0)/4294967296}function mi(e,t){let n=e.fields.length,r=e.fields.indexOf(`x`),i=e.fields.indexOf(`y`),a=[];for(let o=0;o<e.count;o++){let s=e.data[o*n+r],c=e.data[o*n+i],l=t(s,c)??1;(l>=1||l>0&&pi(s,c)<l)&&a.push(o)}return a}function hi(e,t){let n=mi(e,t);if(n.length===e.count)return{table:e,removed:0};let r=e.fields.length,i=e.data instanceof Float32Array?new Float32Array(n.length*r):Array(n.length*r);return n.forEach((t,n)=>{for(let a=0;a<r;a++)i[n*r+a]=e.data[t*r+a]}),{table:{...e,count:n.length,data:i,...e.ids?{ids:n.map(t=>e.ids[t])}:{}},removed:e.count-n.length}}function gi(e){let t=ui(e);if(!t.length)return{scene:e,removed:0,rasters:t};let{table:n,removed:r}=hi(e.trees,fi(t,si));return{scene:r?{...e,trees:n}:e,removed:r,rasters:t}}function _i(e){let t=new Uint8Array(e.columns*e.rows*4),n={[ai.sparse]:0,[ai.shrub]:1,[ai.herb]:2,[ai.rock]:3};for(let r=0;r<e.code.length;r++){let i=n[e.code[r]];i!==void 0&&(t[r*4+i]=255)}return t}var vi={via:{chroma:1,tint:[1,1,1]},photo:{chroma:.7,tint:[.96,.99,1.05]}};function yi(e,t=42){let{columns:n,rows:r,spacing:i,heights:a,canopy:o}=e,s=(e,t)=>a[Math.min(r-1,Math.max(0,t))*n+Math.min(n-1,Math.max(0,e))],c=Array(n*r).fill(null);for(let e=0;e<r;e++)for(let r=0;r<n;r++){let a=s(r,e),l=s(r+1,e),u=s(r-1,e),d=s(r,e+1),f=s(r,e-1);if(a===null||l===null||u===null||d===null||f===null)continue;let p=Math.atan(Math.hypot((l-u)/(2*i),(d-f)/(2*i)))*180/Math.PI,m=e*n+r;if(p>t){c[m]=ai.rock;continue}let h=o?.[m];typeof h==`number`&&(c[m]=h<.05?ai.herb:h<.2?ai.shrub:h<.35?ai.sparse:ai.forest)}return c}function bi(e){let t=new Uint8Array(e.columns*e.rows*4);for(let n=0;n<e.code.length;n++)e.code[n]===ai.water&&(t[n*4]=255);return t}function xi(e){if(!e.cover||e.cover.length!==e.columns*e.rows)return{grid:e,posts:0};let t=e.earthCurvature?.earthRadiusMeters??6371e3,n=e.earthCurvature?.refraction??.13,r=null,i=0;for(let a=0;a<e.cover.length;a++){if(e.cover[a]!==ai.water)continue;let o=e.west+a%e.columns*e.spacing,s=e.south+Math.floor(a/e.columns)*e.spacing,c=-((o*o+s*s)/(2*t))*(1-n),l=e.heights[a];typeof l==`number`&&Number.isFinite(l)&&l>=c||(r??=e.heights.slice(),r[a]=c,i++)}return r?{grid:{...e,heights:r},posts:i}:{grid:e,posts:i}}function Si(e){let t=Math.max(1,...e.map(e=>e.raster.columns)),n=[],r=0;for(let t of e)n.push({row:r,columns:t.raster.columns,rows:t.raster.rows}),r+=t.raster.rows+2;let i=Math.max(1,r-2),a=new Uint8Array(t*i*4);return e.forEach((e,r)=>{let i=e.texels(e.raster),{columns:o,rows:s}=e.raster;for(let e=0;e<s;e++)a.set(i.subarray(e*o*4,(e+1)*o*4),(n[r].row+e)*t*4)}),{width:t,height:i,data:a,sections:n}}function Ci(n,r,i,a=2022){if(!n.length)return null;let o=n.map(e=>({raster:e,texels:_i}));r&&o.push({raster:r,texels:bi});let s=Zr(n);if(s)for(let e of n)o.push({raster:e,texels:e=>ri(e,a)});let c=Si(o),l=new m(c.data,c.width,c.height);l.magFilter=e,l.minFilter=e,l.generateMipmaps=!1,l.wrapS=l.wrapT=t,l.needsUpdate=!0;let u=(e,t)=>({west:e.west,south:e.south,spacing:e.spacing,columns:e.columns,rows:e.rows,row:c.sections[t].row}),d=n.length+ +!!r;return{texture:l,width:c.width,height:c.height,grids:n.map(u),sea:r?{...u(r,n.length),inner:i}:null,burn:s?n.map((e,t)=>u(e,d+t)):null}}function wi(e,t,n,r){let i=n.x.sub(t.west).div(t.spacing),a=n.y.sub(t.south).div(t.spacing),o=s(s(i.add(.5),G(t.columns-.5).sub(i)),s(a.add(.5),G(t.rows-.5).sub(a))),c=Y(i.add(.5),.5,t.columns-.5).div(e.width),l=Y(a.add(.5),.5,t.rows-.5).add(t.row).div(e.height),u=Z(e.texture,H(c,l));return{t:r?u.level(G(0)):u,posts:o}}function Ti(e,t,n=!1){let r=qe(0,0,0,0);for(let i of[...e.grids].reverse()){let{t:a,posts:o}=wi(e,i,t,n);r=T(r,a,z(.5,2.5,o))}return r}function Ei(e,t,n,r=!1){if(!e.burn)return{share:G(0),age:G(0),rocky:G(0)};let i=qe(0,0,0,0);for(let n of[...e.burn].reverse()){let{t:a,posts:o}=wi(e,n,t,r);i=T(i,a,z(.5,2.5,o))}let a=i.y.div(l(i.x,1/255)).mul(100).add(Rr).round();return{share:i.x,age:l(n.sub(a.add(.6)),0),rocky:i.z}}function Di(e,t,n=300){let r=e.sea;if(!r)return G(0);let i=r.inner,{t:a,posts:o}=wi(e,r,t,!1),c=s(s(t.x.sub(i.west),G(i.east).sub(t.x)),s(t.y.sub(i.south),G(i.north).sub(t.y)));return a.x.mul(z(.5,1.5,o)).mul(G(1).sub(z(-n,0,c)))}var Oi=()=>({chroma:V(1),tint:V(new M(1,1,1)),via:V(1),viewYear:V(2025.5)});function ki(e,t,n){e.chroma.value=vi[t].chroma,e.tint.value.set(...vi[t].tint),e.via.value=+(t===`via`),typeof n==`number`&&Number.isFinite(n)&&(e.viewYear.value=n)}var Ai=(e,t)=>{let n=Je(e,U(.2126,.7152,.0722));return T(U(n,n,n),e,t.chroma).mul(t.tint)},ji=1e3;function Mi(){let e=n.sub(q),t=l(Q(e.xz),.001),r=H(le(e.x,e.z.negate()),le(e.y,t)).mul(ji),i=h(e);return{q:r,foot:l(Q(i.dFdx()).add(Q(i.dFdy())).mul(.5*ji),1e-4),dist:Q(e)}}function Ni(e,t,n){let r=ee(l(e.mul(n),t)),i=B(r),a=Ae(i);return{s0:a,s1:a.mul(2),t:r.sub(i)}}function Pi(e,t,n,r){let{s0:i,s1:a,t:o}=Ni(t,G(r.minCell*ji).div(n),r.px),s=t=>x(H(e.x.div(t),e.y.div(t.mul(r.stretch))).add(r.offset));return T(s(i),s(a),o).mul(1.5)}var Fi=(e,t)=>mt(se(Je(e.add(t),H(12.9898,78.233))).mul(43758.5453));function Ii(e,t,n,r,i){let{s0:a,s1:o,t:s}=Ni(t,G(i.minCell*ji).div(n),i.px),c=t=>{let n=B(H(e.x.div(t),e.y.div(t.mul(i.stretch))));return _(Fi(n,i.offset).lessThan(r),G(1),G(0))};return _(s.lessThan(.5),c(a),c(o))}function Li(e,t,n,r){let{s0:i,s1:a,t:o}=Ni(t,G(r.minCell*ji).div(n),r.px),s=i.mul(n).div(ji),c=a.mul(n).div(ji),l=t=>x(e.div(t).add(r.offset));return T(l(s),l(c),o).mul(1.5)}var Ri=.35,zi=.32,Bi=.12,Vi=8,Hi=null;function Ui(){if(Hi)return Hi;let t=vt(41,Vi,3),n=new Uint8Array(262144);for(let e=0;e<256;e++)for(let r=0;r<256;r++)n.fill(Math.round(Math.min(1,Math.max(0,t(r/256,e/256)))*255),(e*256+r)*4,(e*256+r)*4+4);let r=new m(n,256,256);return r.wrapS=r.wrapT=X,r.magFilter=e,r.minFilter=Se,r.generateMipmaps=!0,r.needsUpdate=!0,Hi=r}function Wi(n){let r=e=>{let t=new Uint16Array(e.length);for(let n=0;n<e.length;n++)t[n]=y.toHalfFloat(e[n]);return t},i=i=>{let a=new m(r(i),n.columns,n.rows,at,Xe);return a.magFilter=e,a.minFilter=e,a.generateMipmaps=!1,a.wrapS=a.wrapT=t,a.needsUpdate=!0,a};return{stand:i(n.stand),colour:i(n.colour)}}function Gi(e,t,r,i,a,o=null,s=G(2025.5)){let c=(e,t,n)=>{if(!o)return G(0);let r=Ti(o,H(e,t),n);return Y(r.y.add(r.z).add(r.w),0,1)},l=Wi(t),f=V(1),p=(e,n)=>H(e.sub(t.west).div(t.cell*t.columns),n.negate().sub(t.south).div(t.cell*t.rows)),m=e=>e.x.greaterThanEqual(0).and(e.x.lessThanEqual(1)).and(e.y.greaterThanEqual(0)).and(e.y.lessThanEqual(1)),h=new ot;h.positionNode=L(()=>{let e=p(gt.x,gt.z),t=Z(l.stand,e).level(G(0)),n=_(m(e),z(G(Bi*.6),G(.35),t.x),G(0)),r=G(1).sub(z(.05,.5,c(gt.x,gt.z.negate(),!0))),i=o?.burn?Ei(o,H(gt.x,gt.z.negate()),s,!0).share:G(0);return gt.add(U(0,t.y.mul(n).mul(r).mul(.92).mul(G(1).sub(i.mul(1-Br))),0))})();let g=n,v=Z(Ui()),y=e=>v.sample(e.div(Vi)).r.mul(2).sub(1),b=H(y(g.xz.mul(.011)),y(g.xz.mul(.011).add(19.3))).mul(t.cell*.45),x=p(g.x.add(b.x),g.z.add(b.y)),C=Z(l.stand,x),w=_(m(x),C.x,G(0)),E=Q(g.sub(q)),{q:D,foot:O,dist:k}=Mi(),A=Pi(D,O,k,{px:1.1,stretch:5,minCell:4,offset:3.1}).mul(.65).add(Pi(D,O,k,{px:3.2,stretch:4,minCell:12,offset:7.7}).mul(.35)).toVar(),j=y(g.xz.mul(.004).add(23.1)).mul(.07).add(y(g.xz.mul(.0011).add(29.3)).mul(.05)),M=G(1).sub(Y(w,0,1)),N=z(G(.2).sub(M.mul(.25)),G(.65).sub(M.mul(.25)),A.negate()).toVar(),P=T(G(1),G(zi),N).div(1-Ri*.6799999999999999),ee=Z(l.colour,x).rgb.mul(f),F=o?.burn?Ei(o,H(g.x,g.z.negate()),s):null,ne=F?N.mul(F.rocky).mul(.75):G(0),I=T(ee.mul(A.mul(.2).add(j).add(1)).mul(P),U(.3,.28,.22),ne),re=F?F.share.toVar():G(0),ie=I;if(F){let e=zr,t=Lr,n=F.age,r=e=>U(e[0],e[1],e[2]),i=T(T(T(r(e.ash),r(e.herb),z(0,t.herbFull,n)),r(e.shrub),z(t.shrubStart,t.shrubFull,n)),r(e.regen),z(t.regenStart,t.regenFull,n)),a=z(.05,.5,Pi(D,O,k,{px:1,stretch:7,minCell:3,offset:11.3}).negate()),o=T(T(r(e.farStand),i,.7).mul(A.mul(.15).add(j).add(1)),r(e.snag),a.mul(.6)).mul(T(G(1),G(.7),N));ie=T(I,o,re)}h.colorNode=L(()=>{let e=Er(E,r);return d(Dr(r).greaterThanEqual(e),()=>te()),d(w.lessThanEqual(Bi).or(Or(g.x,g.z.negate(),r)).or(c(g.x,g.z.negate(),!1).greaterThan(.5)),()=>te()),F&&d(r.flat.greaterThan(.5).and(re.greaterThan(.5)).and(Ii(D,O,k,Ur,{px:1,stretch:6,minCell:3,offset:5.9}).lessThan(.5)),()=>te()),qe(_(r.flat.greaterThan(.5),U(0),Tr(ie,r)),1)})(),S(h,_(r.flat.greaterThan(.5),a,U(0))),h.normalNode=L(()=>{let e=he.mul(qe(1,0,0,0)).xyz,t=Y(A.dFdx().mul(.12),-.3,.3),n=u.add(e.mul(t)).normalize();return Ne.mul(qe(n,0)).xyz.normalize()})(),h.receivedShadowNode=i;let ae=new Qe(e,h);if(ae.frustumCulled=!1,ae.receiveShadow=!0,ae.name=`canopy-surface`,e.computeBoundingBox(),e.boundingBox){let n=0;for(let e=1;e<t.stand.length;e+=4)n=Math.max(n,t.stand[e]);e.boundingBox.max.y+=n,e.boundingSphere=e.boundingBox.getBoundingSphere(new st)}return{mesh:ae,gain:f,dispose:()=>(h.dispose(),l.stand.dispose(),l.colour.dispose())}}var Ki={shrubStart:1,shrubFull:5,greenFull:10,standStart:13,standFull:20},qi=.5,Ji=.1;function Yi(e){let t=e.ageYears;return typeof t==`number`&&Number.isFinite(t)?Math.max(0,t):1}function Xi(e){let t=e.retainedShare;return typeof t==`number`&&Number.isFinite(t)?Math.min(1,Math.max(0,t)):0}var Zi=e=>Math.min(1,Math.max(0,e/40)),Qi={base:[.33,.225,.18],light:[.46,.355,.29],dark:[.15,.1,.085],maxAge:1,fade:.5},$i=2.5;function ea(e){if(!e?.canopy||e.canopy.length!==e.columns*e.rows)return null;let t=e.columns*e.rows,n=new Float32Array(t),r=new Uint8Array(t),i=!1;for(let a=0;a<t;a++){let t=e.canopy[a];typeof t==`number`&&Number.isFinite(t)&&(n[a]=Math.min(1,Math.max(0,t)),r[a]=1,i=!0)}return i?{west:e.west,south:e.south,spacing:e.spacing,columns:e.columns,rows:e.rows,closure:n,known:r}:null}function ta(e,t,n){let{fields:r,data:i,count:a}=e.trees;if(!a)return null;let o=r.length,s=r.indexOf(`x`),c=r.indexOf(`y`),l=r.indexOf(`crownWidth`),u=r.indexOf(`height`),d=Math.max(2,Math.ceil((t.east-t.west)/n)+1),f=Math.max(2,Math.ceil((t.north-t.south)/n)+1),p=new Float32Array(d*f),[m,h]=e.camera?.position??[0,0],g=0;for(let e=0;e<a;e++){let r=e*o,a=i[r+s],_=i[r+c],v=l>=0&&i[r+l]>0?i[r+l]:u>=0?i[r+u]*.25:4;g=Math.max(g,Math.hypot(a-m,_-h));let y=(a-t.west)/n,b=(_-t.south)/n,x=Math.floor(y),S=Math.floor(b),C=y-x,w=b-S,T=Math.PI*(v/2)**2,E=(e,t,n)=>{e>=0&&t>=0&&e<d&&t<f&&(p[t*d+e]+=T*n)};E(x,S,(1-C)*(1-w)),E(x+1,S,C*(1-w)),E(x,S+1,(1-C)*w),E(x+1,S+1,C*w)}let _=Math.max(1,Math.round(30/n/2)),v=na(na(p,d,f,_),d,f,_),y=new Float32Array(d*f),b=new Uint8Array(d*f);for(let e=0;e<f;e++)for(let r=0;r<d;r++){let i=e*d+r;y[i]=1-Math.exp(-v[i]/(n*n)),b[i]=+(Math.hypot(t.west+r*n-m,t.south+e*n-h)<=g)}return{west:t.west,south:t.south,spacing:n,columns:d,rows:f,closure:y,known:b}}function na(e,t,n,r){let i=new Float32Array(e.length),a=new Float32Array(e.length),o=(e,t,n,i,a)=>{for(let o=0;o<n;o++){let n=0,s=0;for(let t=0;t<=Math.min(i-1,r);t++)n+=e[a(o,t)],s++;for(let c=0;c<i;c++){t[a(o,c)]=n/s;let l=c+r+1,u=c-r;l<i&&(n+=e[a(o,l)],s++),u>=0&&(n-=e[a(o,u)],s--)}}};return o(e,i,n,t,(e,n)=>e*t+n),o(i,a,t,n,(e,n)=>n*t+e),a}function ra(e){let t=new Uint8Array(e.columns*e.rows*4);for(let n=0;n<e.columns*e.rows;n++)t[n*4]=e.known[n]?Math.round(e.closure[n]*255):0,t[n*4+1]=e.known[n]?255:0,t[n*4+3]=255;return t}var ia=4e6,aa=e=>!!e&&typeof e==`object`,oa=e=>typeof e==`number`&&Number.isFinite(e);function sa(e){if(e.quality!==`final`)return null;let t=oa(e.samples)&&e.samples>=1?Math.min(256,Math.round(e.samples)):24,n=oa(e.canopyCutoffPx)&&e.canopyCutoffPx>0?e.canopyCutoffPx:4;return{samples:t,stand:ca(e.stand),canopyCutoffPx:n}}function ca(e){if(e==null)return null;if(!aa(e))throw Error(`The final stand is not an object.`);let t=Array.isArray(e.fields)?e.fields.map(String):null;if(!t||![`x`,`y`,`species`,`height`].every(e=>t.includes(e)))throw Error(`The final stand lacks x, y, species or height.`);let n=Array.isArray(e.species)?e.species.map(String):[],r=oa(e.count)?Math.round(e.count):-1;if(r<0||r>4e6)throw Error(`The final stand's count must be 0 to ${ia.toLocaleString(`en`)}.`);let i=e.data,a=i instanceof Float32Array?i:Array.isArray(i)||ArrayBuffer.isView(i)&&`length`in i?Float32Array.from(i):null;if(!a||a.length<r*t.length)throw Error(`The final stand's data is shorter than count × fields.`);let o=oa(e.radiusMeters)&&e.radiusMeters>0?e.radiusMeters:0,s=Array.isArray(e.bearings)&&e.bearings.length===2&&e.bearings.every(oa)?e.bearings:[0,360],c=Array.isArray(e.ids)&&e.ids.length===r&&e.ids.every(e=>typeof e==`string`)?e.ids:void 0;if(e.ids!==void 0&&!c)throw Error(`The final stand ids must align with count.`);return{fields:t,species:n,count:r,data:a,...c?{ids:c}:{},radiusMeters:o,bearings:[s[0],s[1]]}}function la(e,[t,n]){let r=n-t;if(r>=360||r<=-360)return!0;let i=e=>(e%360+360)%360;return i(e-t)<=(r>=0?r:i(r))+1e-9}function ua(e,t,n,r){let i=n-t[0],a=r-t[1];return i*i+a*a>e.radiusMeters*e.radiusMeters?!1:la(Math.atan2(i,a)*180/Math.PI,e.bearings)}function da(e,t,n,r){let i=[...new Set([...e.fields,...t.fields])],a=[...e.species],o=t.species.map(e=>{let t=a.indexOf(e);return t<0&&(t=a.push(e)-1),t}),s=Qn(e.fields),c=i.length,l=[];for(let r=0;r<e.count;r++){let i=r*s.stride;ua(t,n,e.data[i+s.x],e.data[i+s.y])||l.push(r)}let u=t.fields.indexOf(`x`),d=t.fields.indexOf(`y`),f=t.fields.indexOf(`height`),p=t.fields.length,m=[];for(let e=0;e<t.count;e++){let n=e*p,r=t.data[n+f];Number.isFinite(t.data[n+u])&&Number.isFinite(t.data[n+d])&&Number.isFinite(r)&&r>0&&m.push(e)}let h=l.length+m.length,g=new Float32Array(h*c);l.forEach((t,n)=>{for(let a=0;a<c;a++){let o=e.fields.indexOf(i[a]);g[n*c+a]=o>=0?e.data[t*s.stride+o]:r(i[a],e.data[t*s.stride+s.x],e.data[t*s.stride+s.y])}});let _=i.map(e=>t.fields.indexOf(e)),v=t.fields.indexOf(`x`),y=t.fields.indexOf(`y`),b=t.fields.indexOf(`species`),x=t.fields.length;return m.forEach((e,n)=>{let a=e*x,u=(l.length+n)*c,d=t.data[a+v],f=t.data[a+y];i.forEach((e,n)=>{if(n===s.species)g[u+n]=o[t.data[a+b]]??0;else{let i=_[n]>=0?t.data[a+_[n]]:NaN;g[u+n]=Number.isFinite(i)?i:r(e,d,f)}})}),{fields:i,species:a,count:h,data:g,ids:[...l.map(t=>e.ids?.[t]??`package-${t}`),...m.map(e=>t.ids?.[e]??`final-${e}`)],fromStand:m.length,kept:l.length}}function fa(e,t,n,r,i,a=.17){let o=Qn(e.fields),s=[`x`,`y`,`species`,`height`,`crownWidth`,`tone`],c=[],l={radiusMeters:n,bearings:r};for(let n=0;n<e.count;n++){let r=n*o.stride,s=e.data[r+o.x],u=e.data[r+o.y],d=e.data[r+o.height];if(!ua(l,t,s,u))continue;let f=o.crownWidth>=0?e.data[r+o.crownWidth]:d*a;if(!$n(e,n)){c.push(s,u,e.data[r+o.species],d,f,o.tone>=0?e.data[r+o.tone]:.5);continue}let p=Math.max(1,Math.round(Math.PI*(f/2)**2*i/1e4)),m=(Math.imul(Math.round(s*10),2654435761)^Math.imul(Math.round(u*10),2246822507))>>>0,h=()=>(m=Math.imul(m^m>>>15,739982445)+1831565813>>>0,m/4294967296);for(let n=0;n<p;n++){let n=f/2*Math.sqrt(h()),i=h()*Math.PI*2,p=s+n*Math.cos(i),m=u+n*Math.sin(i);if(!ua(l,t,p,m))continue;let g=d*(.75+.5*h());c.push(p,m,e.data[r+o.species],g,g*a*(.85+.3*h()),h())}}return{fields:s,species:[...e.species],count:c.length/s.length,data:Float32Array.from(c),radiusMeters:n,bearings:r}}function pa(e,t,n,r,i=500){if(e.count>0)return e;let a=Qn(e.fields),o=e.fields.map(e=>e===`tone`?.5:0);return a.x>=0&&(o[a.x]=t),a.y>=0&&(o[a.y]=n),a.z>=0&&(o[a.z]=r-i),a.height>=0&&(o[a.height]=1),a.crownWidth>=0&&(o[a.crownWidth]=.3),{...e,count:1,data:e.data instanceof Float32Array?Float32Array.from(o):o}}var ma=8192,ha=e=>!!e&&typeof e==`object`,ga=e=>typeof e==`number`&&Number.isFinite(e),_a=(e,t)=>{if(!Array.isArray(e)||e.length!==3||!e.every(e=>ga(e)&&e>=0&&e<=255))throw Error(`The capture's ${t} colour is not [r, g, b] in 0-255.`);return[Math.round(e[0]),Math.round(e[1]),Math.round(e[2])]};function va(e){if(!ha(e)||e.type!==`pgmaps-capture`)throw Error(`Not a capture request.`);if(typeof e.id!=`string`||!e.id)throw Error(`The capture request has no id.`);let t=e.position;if(!Array.isArray(t)||t.length!==3||!t.every(ga))throw Error(`The capture position is not [x, y, z] in metres.`);if(!Array.isArray(e.frames)||!e.frames.length)throw Error(`The capture asks for no frames.`);let n=e.frames.map((e,t)=>{if(!ha(e))throw Error(`Frame ${t+1} is not a frame.`);let{bearingDegrees:n,pitchDegrees:r,horizontalFovDegrees:i,verticalFovDegrees:a,width:o,height:s}=e;if(![n,r,i,a,o,s].every(ga))throw Error(`Frame ${t+1} lacks a bearing, pitch, fields or size.`);let c=e=>e;if(!(c(i)>0&&c(i)<179&&c(a)>0&&c(a)<179))throw Error(`Frame ${t+1}'s fields must be between 0 and 179 degrees.`);if(Math.abs(c(r))>=90)throw Error(`Frame ${t+1}'s pitch must be under 90 degrees.`);if(!Number.isInteger(o)||!Number.isInteger(s)||c(o)<1||c(s)<1||c(o)>8192||c(s)>8192)throw Error(`Frame ${t+1}'s size must be whole pixels, 1 to ${ma} a side.`);return{bearingDegrees:c(n),pitchDegrees:c(r),horizontalFovDegrees:c(i),verticalFovDegrees:c(a),width:c(o),height:c(s)}}),r=ha(e.classes)?e.classes:null;if(!r)throw Error(`The capture request has no classes.`);let i=(e,t)=>(Array.isArray(e)?e:[]).map((e,n)=>{if(!ha(e)||!Array.isArray(e.polygons))throw Error(`${t} layer ${n+1} has no polygons.`);return{id:typeof e.id==`string`?e.id:`layer-${n+1}`,rgb:_a(e.rgb,`${t.toLowerCase()} layer ${String(e.id??n+1)}`),polygons:e.polygons}}),a=i(r.layers,`Class`),o=ha(e.zones)?e.zones:null;return{type:`pgmaps-capture`,id:e.id,position:[t[0],t[1],t[2]],frames:n,classes:{terrain:_a(r.terrain,`terrain`),layers:a,vegetation:_a(r.vegetation,`vegetation`),water:_a(r.water,`water`)},...o?{zones:{terrain:_a(o.terrain,`zone terrain`),layers:i(o.layers,`Zone`)}}:{},final:sa(e),...e.renderOptions?{renderOptions:Lt(e.renderOptions)}:{}}}var ya=Math.PI/180;function ba(e,t){let n=t.bearingDegrees*ya,r=t.pitchDegrees*ya,i=[e[0],e[2],-e[1]],a=[Math.sin(n)*Math.cos(r),Math.sin(r),-Math.cos(n)*Math.cos(r)];return{position:i,forward:a,target:[i[0]+a[0]*100,i[1]+a[1]*100,i[2]+a[2]*100],up:[0,1,0],fov:t.verticalFovDegrees,aspect:Math.tan(t.horizontalFovDegrees*ya/2)/Math.tan(t.verticalFovDegrees*ya/2)}}function xa(e,t,n,r=4096,i=1){let a=Math.max(1e-6,e.east-e.west),o=Math.max(1e-6,e.north-e.south),s=Math.max(1,Math.min(r,Math.ceil(a/i))),c=Math.max(1,Math.min(r,Math.ceil(o/i))),l=a/s,u=o/c,d=new Uint8Array(s*c*4),f=new Uint32Array(d.buffer),p=e=>new Uint32Array(new Uint8Array([e[0],e[1],e[2],255]).buffer)[0];f.fill(p(t));let m=[],h={},g=[];for(let t of n){let n=0,r=!1,i=p(t.rgb);for(let a of t.polygons){let t=a.filter(e=>Array.isArray(e)&&e.length>=3);if(!t.length)continue;let o=1/0,d=-1/0;for(let n of t)for(let[t,i]of n)(t<e.west||t>e.east||i<e.south||i>e.north)&&(r=!0),i<o&&(o=i),i>d&&(d=i);let p=Math.max(0,Math.ceil((e.north-d)/u-.5)),m=Math.min(c-1,Math.floor((e.north-o)/u-.5));for(let r=p;r<=m;r++){let a=e.north-(r+.5)*u;g.length=0;for(let e of t)for(let t=0,n=e.length-1;t<e.length;n=t++){let[r,i]=e[t],[o,s]=e[n];i>a!=s>a&&g.push(r+(a-i)*(o-r)/(s-i))}g.sort((e,t)=>e-t);for(let t=0;t+1<g.length;t+=2){let a=Math.max(0,Math.ceil((g[t]-e.west)/l-.5)),o=Math.min(s-1,Math.ceil((g[t+1]-e.west)/l-.5)-1);o>=a&&(f.fill(i,r*s+a,r*s+o+1),n+=o-a+1)}}}h[t.id]=n,r&&m.push(t.id)}return{data:d,width:s,height:c,bounds:e,texel:[l,u],cut:m,painted:h}}function Sa(e,t,n){return an({grids:e.map(e=>[e.bounds.west,e.bounds.south,e.bounds.east,e.bounds.north,e.maxSide??4096,e.minTexel??1]),terrain:t,layers:n.map(e=>[e.id,e.rgb,e.polygons])})}var Ca=(e,t,n)=>Math.ceil(e*t/256)*256/n;function wa(e){let t=e&32768?-1:1,n=e>>10&31,r=e&1023;return n===0?t*r*2**-24:n===31?r?NaN:t*(1/0):t*(1+r/1024)*2**(n-15)}function Ta(e,t,n,r,i,a=t){let o=new Float32Array(t*n);for(let s=0;s<n;s++)for(let n=0;n<t;n++){let c=e[s*a+n];o[s*t+n]=c>=1||!(c>=0)?0:r*i/(i-c*(i-r))}return o}function Ea(e,t,n,r,i=t*4){let a=new Uint8ClampedArray(t*n*4);for(let o=0;o<n;o++)for(let n=0;n<t;n++){let s=o*t+n;if(!(r[s]>0))continue;let c=o*i+n*4;for(let t=0;t<3;t++)a[s*4+t]=Math.round(wa(e[c+t])*255);a[s*4+3]=255}return a}function Da(e,t,n,r,i,a){let o=t*r;for(let t=0;t<n;t++)for(let n=0;n<o;n++)a[t*o+n]=e[t*i+n];return a}function Oa(e,t,n,r,i){let a=t.bearingDegrees*ya,o=t.pitchDegrees*ya,s=[Math.sin(a)*Math.cos(o),Math.cos(a)*Math.cos(o),Math.sin(o)],c=[Math.cos(a),-Math.sin(a),0],l=[-Math.sin(a)*Math.sin(o),-Math.cos(a)*Math.sin(o),Math.cos(o)],u=Math.tan(t.horizontalFovDegrees*ya/2),d=Math.tan(t.verticalFovDegrees*ya/2);for(let a=Math.floor(r/2);a<t.height;a+=r)for(let o=Math.floor(r/2);o<t.width;o+=r){let r=n[a*t.width+o];if(!(r>0))continue;let f=((o+.5)/t.width*2-1)*u,p=(1-(a+.5)/t.height*2)*d;i(e[0]+r*(s[0]+c[0]*f+l[0]*p),e[1]+r*(s[1]+c[1]*f+l[1]*p),e[2]+r*(s[2]+c[2]*f+l[2]*p))}}var ka=e=>`${(e/1e3).toFixed(1)} km`,Aa=(e,t)=>`${t?(100*e/t).toFixed(e&&e<t/1e3?2:1):`0`}%`;function ja(e){let{seen:t}=e,n=[],r=[];t.beyondTrees>0&&(e.treeReachMeters===null?(n.push(`no trees drawn`),r.push(`The package carries no stems: the frames' ground is bare, screening nothing.`)):(n.push(`trees past ${ka(e.treeReachMeters)} not drawn`),r.push(`Trees are drawn only as the package's ${e.stems.toLocaleString(`en-CA`)} stems, the farthest ${Math.round(e.treeReachMeters).toLocaleString(`en-CA`)} m from the eye; ground beyond them (${Aa(t.beyondTrees,t.drawn)} of the frames' drawn pixels) is bare and screens nothing.`))),t.invented>0&&(n.push(`terrain past ${ka(e.realGroundMeters)} invented`),r.push(`Ground past the package's ${e.skylineTerrain?`skyline terrain`:e.farTerrain?`far terrain`:`terrain grid`} (its nearest edge ${ka(e.realGroundMeters)} from the eye) is invented: the edge's heights easing to the grid's mean, painted the terrain class (${Aa(t.invented,t.drawn)} of the drawn pixels).`)),t.filled>0&&(n.push(`terrain gaps filled from neighbours`),r.push(`Posts the package's terrain leaves unknown are filled from their nearest known neighbours (${Aa(t.filled,t.drawn)} of the drawn pixels).`));let i=(e,t)=>{let n=`${e.join(`, `)} cut at the terrain edge`;return n.length<=60?n:`${t} cut at the terrain edge`};return e.cut.length&&(n.push(i(e.cut,`class polygons`)),r.push(`Class polygons past the package's terrain are cut at its edge (${e.cut.join(`, `)}): their ground beyond it is the terrain class.`)),e.zonesCut?.length&&(n.push(i(e.zonesCut,`zone polygons`)),r.push(`Zone polygons past the package's terrain are cut at its edge (${e.zonesCut.join(`, `)}): beyond it, the zone pass's terrain colour.`)),{missing:n,missingDetail:r}}function Ma(e,t,n){let r=Math.floor((t-e.bounds.west)/e.texel[0]),i=Math.floor((e.bounds.north-n)/e.texel[1]);if(!(r>=0&&i>=0&&r<e.width&&i<e.height))return null;let a=(i*e.width+r)*4;return[e.data[a],e.data[a+1],e.data[a+2]]}function Na(e){let t=Math.floor(e.stems.length/2),n=new Uint8Array(t*3),r=e=>e[0]<<16|e[1]<<8|e[2],i=r(e.terrain),a=new Map;for(let t of e.layers)!a.has(r(t.rgb))&&r(t.rgb)!==i&&a.set(r(t.rgb),t.id);let o={};for(let i=0;i<t;i++){let t=e.stems[i*2],s=e.stems[i*2+1],c=null;for(let n of e.rasters)if(c=Ma(n,t,s))break;let l=c&&a.has(r(c))&&!e.onWater?.(t,s),u=l?c:e.vegetation;n.set(u,i*3);let d=l?a.get(r(c)):`vegetation`;o[d]=(o[d]??0)+1}return{rgb:n,counts:o}}function Pa(e){let t=e.filter(e=>!!e?.stand).sort((e,t)=>e.spacing-t.spacing);return(e,n)=>{for(let r of t){let t=(e-r.west)/r.spacing,i=(n-r.south)/r.spacing;if(t<0||i<0||t>r.columns-1||i>r.rows-1)continue;let a=r.stand.records[r.stand.cells[Math.round(i)*r.columns+Math.round(t)]];if(a&&Number.isFinite(a.heightMeters)&&a.heightMeters>0)return a}return null}}var Fa=new URLSearchParams(location.search),Ia=Fa.get(`farforest`)!==`0`,La=Number(Fa.get(`cutoffpx`)??4),Ra=15e3,za=600;function Ba(e,t){e.chroma.value=cr[t].chroma,e.tint.value.set(...cr[t].tint)}function Va(e){if(!Ia)return null;let t=t=>e.species?.[t]?.crownRatio,n=e.trees,r=e.farTerrain??e.terrain,i=er(n,{extent:{west:r.west,south:r.south,east:r.west+(r.columns-1)*r.spacing,north:r.south+(r.rows-1)*r.spacing},eye:[e.camera.position[0],e.camera.position[1]],speciesRatio:t,notCommon:e=>e===Nr});if(!i)return null;let a=e.trees.fields.length,o=[];for(let r=0;r<e.trees.count;r++)$n(n,r,t)||o.push(r);let s=Array(o.length*a);o.forEach((t,n)=>{for(let r=0;r<a;r++)s[n*a+r]=e.trees.data[t*a+r]});let c=e.trees.species.map((e,n)=>({species:n,ratio:Math.min(Zn,t(e)??.17)}));return{cells:i,trees:{...e.trees,count:o.length,data:s,...e.trees.ids?{ids:o.map(t=>e.trees.ids[t])}:{}},extra:c,speciesRatio:t}}async function Ha(e){let t=performance.now(),{scene:n,plan:r,terrain:i}=e,a=r.cells,o=wr(e.snow,e.grade),s=(e,t)=>i.heightAt(e,-t),c=ui(n),l=lr([ea(n.terrain),ea(n.farTerrain),ea(n.skylineTerrain)]),u=Xr(c)?Hr(l,$r(c)):l,d=[n.camera.position[0],n.camera.position[1]],f=c.length?fi(c,si):void 0,p=c.length?fi(c,ci):void 0,m=Pa([n.terrain,n.farTerrain,n.skylineTerrain]),h=rr(a,s,u,{eye:d,maxReach:Ra,keepAt:f,standAt:m}),g=n.trees.species.indexOf(Nr);if(g>=0&&Xr(c)){let e=$r(c);for(let t=0;t<h.count;t++)(e(h.a[t*4],h.a[t*4+1])??0)>.5&&(h.b[t*4+3]=g)}let y=new Set;for(let e=0;e<h.count;e++)y.add(h.b[e*4+3]);let b=new Map;for(let e=0;e<h.count;e++)b.set(h.b[e*4+3],(b.get(h.b[e*4+3])??0)+1);let x=g,S=[...y].sort((e,t)=>e-t).flatMap(t=>{let i=e.extraTypes.get(t);if(!i?.length)return[];let a=Array.from({length:12},()=>i).flat();for(let[r,i]of b){let o=e.extraTypes.get(r);if(!n.terrain.stand&&!n.farTerrain?.stand&&!n.skylineTerrain?.stand&&r!==t&&t!==x&&r!==x&&o?.length)for(let e=0;e<Math.round(8*i/h.count);e++)a.push(...o)}let o=n.trees.species[t]??``,s=t===x?Fr:Math.min(Zn,r.speciesRatio(o)??.17);return[{species:t,types:a,crownWidth:Math.max(2.5,s*22)}]}),C=await Sr(e.renderer,e.atlas,e.types,S,n.trees.species.length),w=kr(h,C,o,e.receivedShadow()),T=e=>C.meanAlbedo[e]??sr[n.trees.species[e]??``]??[.045,.07,.045],E=i.ground.outer,D=ur(E,u,a,T,{cell:90,maxSide:1024,keepAt:p,standAt:m}),O=_(Q(e.drape.colour.sub(e.drape.rest)).lessThan(.001),e.drape.vegetation,e.drape.colour),k=Gi(i.mesh.geometry,D,o,e.receivedShadow(),O,e.cover,e.viewYear);k.gain.value=Number(Fa.get(`canopygain`)??1);let A=new v;A.name=`far-forest`,A.add(w.mesh,k.mesh),w.mesh.visible=Fa.get(`patches`)!==`0`,k.mesh.visible=Fa.get(`canopy`)!==`0`,k.mesh.renderOrder=1;let j=n.farTerrain??n.terrain,M=a.medianHeight||22,N=4e3;return{group:A,u:o,patches:h,patchMesh:w,canopy:k,update(e,t,n=La){let r=e.position.x,i=-e.position.z,a=Math.hypot(r-d[0],i-d[1]),s=Math.min(r-j.west,j.west+(j.columns-1)*j.spacing-r,i-j.south,j.south+(j.rows-1)*j.spacing-i);return N=Bt(Math.max(za,ar(n,or(t,e.fov),M)),Ra,a,s),o.cutoff.value=N,N},setLook(t){Ba(e.grade,t)},setClasses(e){if(!e){w.setClasses(null);return}let t=new Float32Array(h.count*2);for(let e=0;e<h.count;e++)t[e*2]=h.a[e*4],t[e*2+1]=h.a[e*4+1];let n=Na({stems:t,rasters:e.rasters,terrain:e.terrain,vegetation:e.vegetation,layers:e.layers,onWater:e.onWater});w.setClasses(n.rgb)},hide(e){if(!e){o.hide.value.set(0,0,0,0);return}o.hide.value.set(e.eye[0],e.eye[1],e.radius,0);let t=e.bearings[1]-e.bearings[0];o.hideSpan.value.set(e.bearings[0],Math.abs(t)>=360?360:(t%360+360)%360)},cutoff:()=>N,stats:{patches:h.count,bakeMs:Math.round(performance.now()-t)},dispose(){C.dispose(),k.dispose(),w.mesh.traverse(e=>{e instanceof Qe&&e.geometry.dispose()})}}}var Ua=[250,700,1600,3500,8e3,16e3],Wa=9e3,Ga=300,Ka=e=>({west:e.west,south:e.south,east:e.west+(e.columns-1)*e.spacing,north:e.south+(e.rows-1)*e.spacing});function qa(e,t){let{columns:n,rows:r,west:i,south:a,spacing:o}=e,s=new Float64Array(n*r),c=new Uint8Array(n*r),l=new Uint8Array(n*r),u=0,d=0;for(let f=0;f<n*r;f++){let r=e.heights[f];if(typeof r==`number`&&Number.isFinite(r))s[f]=r,c[f]=l[f]=1,u+=r,d++;else if(t){let e=t(i+f%n*o,a+Math.floor(f/n)*o);Number.isFinite(e)&&(s[f]=e,l[f]=1)}}let f=d?u/d:0,p=(e,t,n)=>{for(let r=0;r<t;r++){let t=NaN;for(let i=0;i<n;i++)l[e(r,i)]&&(t=s[e(r,i)]);for(let i=n-1;i>=0;i--){let n=e(r,i);l[n]?t=s[n]:Number.isFinite(t)&&(s[n]=t,l[n]=1)}}};p((e,t)=>e*n+t,r,n),p((e,t)=>t*n+e,n,r);for(let e=0;e<n*r;e++)l[e]||(s[e]=f);return{grid:e,bounds:Ka(e),h:s,known:c,mean:f}}function Ja(e,t,n){let{west:r,south:i,spacing:a,columns:o,rows:s}=e.grid,c=(t-r)/a,l=(n-i)/a,u=Math.min(o-1.0001,Math.max(0,c)),d=Math.min(s-1.0001,Math.max(0,l)),f=Math.floor(u),p=Math.floor(d),m=u-f,h=d-p,g=(t,n)=>e.h[Math.min(s-1,n)*o+Math.min(o-1,t)];return{v:g(f,p)*(1-m)*(1-h)+g(f+1,p)*m*(1-h)+g(f,p+1)*(1-m)*h+g(f+1,p+1)*m*h,out:Math.hypot(Math.max(0,Math.abs(c-u)-1e-4),Math.max(0,Math.abs(l-d)-1e-4))*a,cx:r+u*a,cy:i+d*a}}function Ya(e,t,n){let{west:r,south:i,spacing:a,columns:o,rows:s}=e.grid,c=Math.round((t-r)/a),l=Math.round((n-i)/a);return c>=0&&l>=0&&c<o&&l<s&&e.known[l*o+c]===1}var Xa=(e,t,n,r=0)=>t>=e.west-r&&t<=e.east+r&&n>=e.south-r&&n<=e.north+r;function Za(e,t,n){let r=Ka(e),i=(t,n)=>{let r=Math.round((t-e.west)/e.spacing),i=Math.round((n-e.south)/e.spacing);if(r<0||i<0||r>=e.columns||i>=e.rows)return NaN;let a=e.heights[i*e.columns+r];return typeof a==`number`?a:NaN},a=e=>e&&e.columns>1&&e.rows>1&&e.heights?.length===e.columns*e.rows?e:null,o=a(t),s=a(n),c=o?qa(o,(e,t)=>Xa(r,e,t)?i(e,t):NaN):null,l=qa(e,c?(e,t)=>Ya(c,e,t)?Ja(c,e,t).v:NaN:void 0),u=s?qa(s):null,d=(e,t)=>({west:Math.min(e.west,t.west),south:Math.min(e.south,t.south),east:Math.max(e.east,t.east),north:Math.max(e.north,t.north)}),f=c?d(c.bounds,l.bounds):l.bounds,p=u?d(u.bounds,f):f,m=c?Math.max(Ga,3*c.grid.spacing):0,h=u?Math.max(Ga,3*u.grid.spacing):0,g=l.mean,_=(e,t)=>{let n=Ja(l,e,t);if(n.out===0||!c)return n;let r=Ja(c,e,t),i=Ja(c,n.cx,n.cy).v;return{v:r.v+(n.v-i)*Math.max(0,1-n.out/m),out:r.out,cx:r.cx,cy:r.cy}},v=(e,t)=>{let n=_(e,t);if(n.out===0)return n.v;let r=n.v,i=n.out;if(u){let a=Ja(u,e,t),o=Ja(u,n.cx,n.cy).v;r=a.v+(_(n.cx,n.cy).v-o)*Math.max(0,1-n.out/h),i=a.out}return i>0?r+(g-r)*Math.min(1,i/Wa):r},y=(e,t)=>Xa(l.bounds,e,t)?Ya(l,e,t)?`terrain`:c&&Ya(c,e,t)?`farTerrain`:`filled`:c&&Xa(c.bounds,e,t)?Ya(c,e,t)?`farTerrain`:`filled`:u&&Xa(u.bounds,e,t)?Ya(u,e,t)?`skylineTerrain`:`filled`:`invented`,b=(e,t,n,r)=>{let i=Array.from({length:e.count},(t,n)=>e.start+n*e.spacing);for(let e of t){let t=i[0],n=i[i.length-1],r=[],a=[];for(let i=0;i<e.count;i++){let o=e.start+i*e.spacing;o<t-e.spacing*.25?r.push(o):o>n+e.spacing*.25&&a.push(o)}i=[...r,...i,...a]}return[...Ua.slice().reverse().map(e=>n-e),...i,...Ua.map(e=>r+e)]},x=[c,u].filter(e=>!!e).map(e=>e.grid),S=b({start:e.west,spacing:e.spacing,count:e.columns},x.map(e=>({start:e.west,spacing:e.spacing,count:e.columns})),p.west,p.east),C=b({start:e.south,spacing:e.spacing,count:e.rows},x.map(e=>({start:e.south,spacing:e.spacing,count:e.rows})),p.south,p.north),w=0;if(c)for(let e=0;e<c.known.length;e++)c.known[e]||w++;return{near:l,far:c,skyline:u,outer:p,heightAt:v,sourceAt:y,xs:S,ys:C,farUnknown:w}}Ua[Ua.length-1];function Qa(e){let t=Za(e.terrain,e.farTerrain,e.skylineTerrain),{west:n,south:r,spacing:i,columns:a,rows:s}=e.terrain,c=t.near.h,l=(e,t)=>c[t*a+e],u=t.heightAt,d=(e.water??[]).filter(e=>Array.isArray(e?.rings)&&e.rings[0]?.length>=3),f=d.map(e=>e.elevationMeters??Math.min(...e.rings[0].map(([e,t])=>u(e,t))));d.forEach((e,t)=>{let[o,...u]=e.rings,d=o.map(e=>e[0]),p=o.map(e=>e[1]),m=Math.max(0,Math.floor((Math.min(...d)-n)/i)),h=Math.min(a-1,Math.ceil((Math.max(...d)-n)/i)),g=Math.max(0,Math.floor((Math.min(...p)-r)/i)),_=Math.min(s-1,Math.ceil((Math.max(...p)-r)/i));for(let e=g;e<=_;e++)for(let s=m;s<=h;s++){let d=n+s*i,p=r+e*i;$a(d,p,o)&&!u.some(e=>$a(d,p,e))&&(c[e*a+s]=Math.min(l(s,e),f[t]-2))}});let{xs:p,ys:m}=t,h=p.length,g=m.length,_=new Float32Array(h*g*3);for(let e=0;e<g;e++)for(let t=0;t<h;t++)_.set([p[t],u(p[t],m[e]),-m[e]],(e*h+t)*3);let v=new Uint32Array((h-1)*(g-1)*6),y=0;for(let e=0;e<g-1;e++)for(let t=0;t<h-1;t++){let n=e*h+t,r=n+1,i=n+h,a=i+1;v.set([n,r,i,r,a,i],y),y+=6}let b=new w;b.setAttribute(`position`,new o(_,3)),b.setIndex(new o(v,1)),b.computeVertexNormals(),b.computeBoundingSphere();let x=new Qe(b);return x.receiveShadow=!0,x.frustumCulled=!1,{mesh:x,heightAt:(e,t)=>u(e,-t),bounds:t.near.bounds,farBounds:t.far?.bounds??null,skylineBounds:t.skyline?.bounds??null,ground:t,waterLevels:f}}function $a(e,t,n){let r=!1;for(let i=0,a=n.length-1;i<n.length;a=i++){let[o,s]=n[i],[c,l]=n[a];s>t!=l>t&&e<(c-o)*(t-s)/(l-s)+o&&(r=!r)}return r}function eo(n,r,i=null,a=2025.5){let[o,s]=n.camera?.position??[0,0],{fields:c,data:l,count:u}=n.trees,d=c.length,f=c.indexOf(`x`),p=c.indexOf(`y`),h=c.indexOf(`crownWidth`),g=c.indexOf(`height`),_=[];for(let e of n.openings??[])_.push(...e.rings);for(let e of n.roadScars??[])_.push(e.ring);let v=(e,t)=>Math.hypot(e-o,t-s)<=900,y=()=>({x0:1/0,x1:-1/0,y0:1/0,y1:-1/0}),b=y(),x=y(),S=(e,t,n,r=0)=>{e.x0=Math.min(e.x0,t-r),e.x1=Math.max(e.x1,t+r),e.y0=Math.min(e.y0,n-r),e.y1=Math.max(e.y1,n+r)};for(let e=0;e<u;e++){let t=l[e*d+f],n=l[e*d+p];S(x,t,n,20),v(t,n)&&S(b,t,n,20)}for(let e of _)for(let[t,n]of e)S(x,t,n,10),v(t,n)&&S(b,t,n,10);Number.isFinite(b.x0)||S(b,o,s,100);let C=e=>{let t=e*d,n=h>=0?l[t+h]:g>=0?l[t+g]*.25:4;return Math.max(.8,n*.55)},w=(e,t)=>{e.beginPath();for(let n of t)n.forEach(([t,n],r)=>r?e.lineTo(t,n):e.moveTo(t,n));e.fill(`evenodd`)},T=(n,r,i,a,o)=>{let s=Math.max(n.x0,r.west),c=Math.min(n.x1,r.east),l=Math.max(n.y0,r.south),u=Math.min(n.y1,r.north),d=Math.max(c-s,u-l,50),f=Math.min(2048,Math.max(64,Math.ceil(d/i))),p=d/f,h=e=>{let t=new OffscreenCanvas(f,f),n=t.getContext(`2d`);n.setTransform(1/p,0,0,-1/p,-s/p,(l+d)/p),n.fillStyle=`#fff`,e(n);let r=new OffscreenCanvas(f,f).getContext(`2d`,{willReadFrequently:!0});return r.filter=`blur(${Math.max(.6,1/p).toFixed(2)}px)`,r.drawImage(t,0,0),r.getImageData(0,0,f,f).data},g=n=>{let r=new Uint8Array(f*f*4);n.forEach((e,t)=>{let n=h(e);for(let e=0;e<f*f;e++)r[e*4+t]=n[e*4]});let i=new m(r,f,f);return i.magFilter=e,i.minFilter=Se,i.generateMipmaps=!0,i.wrapS=i.wrapT=t,i.needsUpdate=!0,i};return{texture:g(a),cuts:g(o),west:s,north:l+d,side:d}},E=e=>t=>(n.openings??[]).forEach(n=>{let r=Math.round(Math.min(1,Math.max(0,e(n)))*255);t.fillStyle=`rgb(${r},${r},${r})`,w(t,n.rings)}),D=[E(e=>Zi(Yi(e))),E(Xi)],O=e=>t=>{for(let n=0;n<u;n++){let r=l[n*d+f],i=l[n*d+p];e(r,i)&&(t.beginPath(),t.arc(r,i,C(n),0,Math.PI*2),t.fill())}},k=T(b,r,.5,[O((e,t)=>e>=b.x0-20&&e<=b.x1+20&&t>=b.y0-20&&t<=b.y1+20),e=>(n.openings??[]).forEach(t=>w(e,t.rings)),e=>(n.roadScars??[]).filter(e=>e.kind===`cut`).forEach(t=>w(e,[t.ring])),e=>(n.roadScars??[]).filter(e=>e.kind!==`cut`).forEach(t=>w(e,[t.ring]))],D),A=x.x0<b.x0-200||x.x1>b.x1+200||x.y0<b.y0-200||x.y1>b.y1+200,j=i??r,M=A?T(x,{west:Math.min(j.west,r.west),south:Math.min(j.south,r.south),east:Math.max(j.east,r.east),north:Math.max(j.north,r.north)},2,[O(()=>!0),e=>(n.openings??[]).forEach(t=>w(e,t.rings))],D):null,N=li(n.skylineTerrain),P=ea(n.terrain),ee=ea(n.farTerrain),te=ea(n.skylineTerrain),F=M??k,ne=!P&&!ee&&!te?ta(n,{west:F.west,south:F.north-F.side,east:F.west+F.side,north:F.north},Math.max(10,F.side/2048)):null;return{...k,far:M,canopy:{near:to(P),far:to(ee),skyline:to(te),stems:to(ne)},cover:Ci(ui(n),N,i??r,qr(a))}}function to(n){if(!n)return null;let r=new m(ra(n),n.columns,n.rows);return r.magFilter=e,r.minFilter=Se,r.generateMipmaps=!0,r.wrapS=r.wrapT=t,r.needsUpdate=!0,{texture:r,west:n.west,south:n.south,spacing:n.spacing,columns:n.columns,rows:n.rows}}var no=1024,ro=5,io=5/Et.pine,ao={depth:4/100,tile:ro,fade:40},oo=120,so=.55,co=null;function lo(){let e=e=>new Promise((t,n)=>{let r=new Worker(new URL(new URL(`floor-worker-J-wgGYZA.js`,import.meta.url).href,``+import.meta.url),{type:`module`});r.onmessage=e=>(r.terminate(),t(e.data.out)),r.onerror=e=>(r.terminate(),n(Error(`floor worker: ${e.message}`))),r.postMessage({leaf:e,size:no})});return co??=Promise.all([e(null),e(bt.indexOf(`pine`))]).then(([e,t])=>({soil:e,needles:t})),co}var uo=(t,n)=>{let r=new m(new Uint8Array(t.buffer.slice(0)),no,no);return r.wrapS=r.wrapT=X,r.magFilter=e,r.minFilter=Se,r.generateMipmaps=!0,r.anisotropy=8,n&&(r.colorSpace=He),r.needsUpdate=!0,r};async function fo(e){let t=await lo(),r={map:uo(t.soil.albedo,!0),normal:uo(t.soil.normal,!1),height:uo(t.soil.rough,!1),needles:uo(t.needles,!1)},{masks:i,snow:o}=e,c=new ft({roughness:.95,metalness:0}),d=n.xz,f=H(x(d.mul(.31)),x(d.mul(.31).add(17))).mul(1.4),p=H(d.x.add(f.x).sub(i.west).div(i.side),d.y.add(f.y).add(i.north).div(i.side)),m=_(p.x.greaterThan(0).and(p.x.lessThan(1)).and(p.y.greaterThan(0)).and(p.y.lessThan(1)),G(1),G(0)),h=Z(i.texture,p),g=Z(i.texture,p).level(G(4)).r,v=h.r.mul(m),y=z(.08,.5,g).mul(m),b=h.g.mul(m),S=h.b.mul(m),C=h.a.mul(m),w=i.far,E=w?H(d.x.sub(w.west).div(w.side),d.y.add(w.north).div(w.side)):null,D=w&&E?_(E.x.greaterThan(0).and(E.x.lessThan(1)).and(E.y.greaterThan(0)).and(E.y.lessThan(1)),G(1),G(0)).mul(G(1).sub(m)):G(0),k=w&&E?Z(w.texture,E):null,A=k?k.g.mul(D):G(0),j=Z(i.cuts,p),M=w&&E?Z(w.cuts,E):null,N=b.add(A),P=j.r.mul(m).add(M?M.r.mul(D):G(0)),te=_(N.greaterThan(.004),s(P.div(l(N,1/255)),1).mul(40),G(1)).toVar(),F=H(d.x.add(x(d.mul(.02).add(7)).mul(18)),d.y.negate().add(x(d.mul(.02).add(13)).mul(18))),ne=G(so);for(let e of[i.canopy.stems,i.canopy.skyline,i.canopy.far,i.canopy.near]){if(!e)continue;let t=H(F.x.sub(e.west).div(e.spacing).add(.5).div(e.columns),F.y.sub(e.south).div(e.spacing).add(.5).div(e.rows)),n=_(t.x.greaterThan(0).and(t.x.lessThan(1)).and(t.y.greaterThan(0)).and(t.y.lessThan(1)),G(1),G(0)),r=Z(e.texture,t),i=z(.3,.9,r.g).mul(n);ne=T(ne,s(r.r.div(l(r.g,1/255)),1),i)}let I=i.cover?Ti(i.cover,F.add(H(x(d.mul(.09).add(3)),x(d.mul(.09).add(5))).mul(5))).toVar():qe(0,0,0,0),ie=I.x,ae=I.y,oe=I.z,se=I.w,ce=i.cover?.burn?Ei(i.cover,F.add(H(x(d.mul(.09).add(3)),x(d.mul(.09).add(5))).mul(5)),e.coverGrade.viewYear):null,R=ce?ce.share.toVar():G(0),le=ce?ce.age.toVar():G(0),ue=ce?ce.rocky.toVar():G(0),de=i.cover?.sea?Di(i.cover,H(d.x,d.y.negate())).toVar():G(0),fe=Y(G(1).sub(se.mul(1-ci[ai.rock])).sub(oe.mul(1-ci[ai.herb])).sub(ae.mul(1-ci[ai.shrub])).sub(ie.mul(1-ci[ai.sparse])).sub(R),0,1),pe=G(1).sub(re(G(1).sub(Y(ne.mul(fe),0,1)),$i)).mul(G(1).sub(A)).toVar(),B=z(.55,.93,u.y),V=x(d.mul(.07)).mul(.5).add(.5),me=x(d.mul(.45).add(3)).mul(.5).add(.5),he=x(d.mul(1.7).add(9)).mul(.5).add(.5),ge=Y(o.mul(B.mul(.8).add(.25).mul(T(G(1),G(.5),v)).add(b.mul(.3)).sub(me.mul(.25)).add(.12)),0,1).toVar(),_e=H(0).toVar();c.colorNode=L(()=>{let t=n.sub(q).length().toVar(),a=d.div(ro).toVar(),o={x:a.dFdx().toVar(),y:a.dFdy().toVar()},s=G(1).sub(z(oo*.6,oo,t)).toVar(),c=Y(T(G(.25),G(.95),y).mul(G(1).sub(S.add(C))).add(b.mul(-.1)),0,1).toVar(),f=(e,t,n)=>Z(r.needles,e.mul(io)).level(ee(l(O(Q(t).mul(Q(n))).mul(io*no),1))),p=e=>_(e.r.greaterThan(.003).and(e.a.sub(.1).div(.9).lessThan(c)),G(1),G(0)),h=_t(r.height,a,o.x,o.y,ao,(e,t,n,i)=>{let a=f(t,n,i);return l(Z(r.height,t).grad(n,i).r,a.r.mul(p(a)))},s.mul(G(1).sub(ge))),g=Z(r.map,h).grad(o.x,o.y).rgb.mul(2),v=g.mul(G(.5).div(g.add(.25)).min(1.2)),w=Z(r.height,h).grad(o.x,o.y).r,E=Z(r.normal,h).grad(o.x,o.y).xyz.mul(2).sub(1),D=f(h,o.x,o.y),k=T(p(D).mul(_(D.r.greaterThan(w),G(1),G(0))),c.mul(.85),G(1).sub(s)),j=T(D.a,G(.6),G(1).sub(s)),M=U(.22,.125,.07).mul(T(G(.55),G(1.1),j)).mul(mt(j.mul(37.1)).mul(.3).add(.85)),N=T(v,M,k).toVar(),P=z(.5,.72,V.mul(.7).add(me.mul(.3))).mul(.55).mul(G(1).sub(k.mul(.7)));N.assign(T(N,U(.05,.095,.03).mul(he.mul(.3).add(.85)),P));let F=T(U(.11,.14,.05),U(.19,.2,.09),V).mul(he.mul(.3).add(.85)),ne=T(v,F,z(.3,.7,me.mul(.6).add(.4)).mul(.75)),I=T(ne,N,y).toVar(),L=v.mul(U(1.08,1,.92)),fe=U(.2,.18,.1).mul(he.mul(.4).add(.75)),B=U(.3,.24,.17).mul(he.mul(.25).add(.85)),ve=x(d.mul(6.3)).mul(.5).add(.5),ye=T(T(L,fe,z(.35,.75,me.mul(.6).add(ve.mul(.4))).mul(.6)),B,z(.66,.82,V).mul(.45)),be=O(Q(d.dFdx()).mul(Q(d.dFdy()))).max(.01).toVar(),xe=(e,t)=>x(d.mul(e).add(t)).mul(G(1).sub(z(.2,.45,be.mul(e)))),Se=(e,t)=>Y(e.add(t.mul(G(1).sub(Ye(e.mul(2).sub(1)).mul(.6)))),0,1),Ce=xe(.55,21),we=xe(.14,33),W=xe(.055,37),Te=x(d.mul(.03).add(41)),Ee=U(.17,.12,.078).mul(Ce.mul(.12).add(1)),De=U(.175,.152,.122).mul(Ce.mul(.18).add(.95)),Oe=T(Ee,De,Se(G(.45),we.mul(.6).add(W.mul(.6)).add(Ce.mul(.3)))).mul(W.mul(.12).add(we.mul(.08)).add(Te.mul(.05)).add(1)).toVar();Oe.assign(T(ye,Oe,z(oo*.5,oo*1.4,t)));let ke=Ki,Ae=z(ke.shrubStart,ke.shrubFull,te).mul(qi).add(z(ke.shrubFull,ke.greenFull,te).mul(1-qi)).mul(1-Ji).add(Ji),je=T(U(.045,.072,.03),U(.07,.095,.04),z(-.3,.5,W)).mul(Ce.mul(.2).add(we.mul(.12)).add(1)),Me=T(Oe,je,Se(Ae,we.mul(.6).add(W.mul(.5)).add(Te.mul(.15)))),Ne=U(.05,.082,.037).mul(xe(.3,51).mul(.3).add(xe(.07,53).mul(.25)).add(W.mul(.1)).add(1)),Pe=T(Me,Ne,z(ke.standStart,ke.standFull,te)).toVar(),{q:Fe,foot:Ie,dist:Le}=Mi(),Re=Li(n,Ie,Le,{px:1,minCell:.3,offset:131}).mul(.8).add(Li(n,Ie,Le,{px:2.6,minCell:1.2,offset:137}).mul(.3)).toVar(),ze=e=>U(e[0],e[1],e[2]),Be=we.mul(.5).add(W.mul(.5)).add(Te.mul(.3)),Ve=T(T(ze(Qi.base),ze(Qi.dark),z(.35,.9,Re.negate()).mul(.65)),ze(Qi.light),z(.3,.85,Re).mul(.7)).mul(Be.mul(.07).add(1)),He=e.coverGrade.via.mul(G(1).sub(z(Qi.maxAge,Qi.maxAge+Qi.fade,te)));Pe.assign(T(Pe,Ve,He)),I.assign(T(I,T(Pe,M,k.mul(.6).mul(s)),b));let Ue=G(1).sub(z(.6,.8,u.y)).toVar(),We=xe(.022,101),K=xe(.09,103),J=xe(.35,107),Ge=xe(1.4,109),Ke=T(U(.4,.36,.27),U(.5,.455,.34),z(-.5,.6,We.mul(.6).add(K.mul(.4)))),qe=G(1).sub(z(.2,.45,be.mul(.1))),X=x(U(d.x.mul(.1),n.y.mul(.012),d.y.mul(.1)).add(31)).mul(qe),Je=z(.72,.95,G(1).sub(Ye(xe(.03,113)))),Xe=Y(Je.mul(.3).add(X.mul(.5).add(.5).mul(Ue).mul(.3)),0,.6),Ze=Se(G(.12).mul(G(1).sub(Ue.mul(.5))),J.mul(.5).add(Ge.mul(.4)).sub(.25)),Qe=U(.48,.44,.34).mul(Ge.mul(.12).add(J.mul(.08)).add(1)),$e=Ke.mul(K.mul(.08).add(J.mul(.1)).add(Ge.mul(.08)).add(1)).mul(G(1).sub(Xe)).mul(T(G(1),G(.86),Ue)),et=T(T(Qe,$e,z(.15,.6,Ue)),U(.05,.065,.035),Ze),tt=T(U(.15,.18,.055),U(.24,.21,.11),z(-.35,.5,We.mul(.4).add(K.mul(.5)).add(J.mul(.3)))).mul(J.mul(.1).add(Ge.mul(.1)).add(1)),nt=z(.35,.75,J.mul(.6).add(Ge.mul(.4)).mul(.5).add(.5)),rt=T(T(U(.05,.062,.03),U(.075,.088,.042),z(-.4,.5,K)).mul(T(G(1),G(.6),nt.mul(.6))),tt.mul(.8),z(.45,.8,We.mul(.5).add(K.mul(.5))).mul(.25)),it=T(tt.mul(U(1.05,1,.95)),Ke.mul(.85),z(.2,.7,K.mul(.5).add(.5)).mul(.3)),at=Y(se.add(oe).add(ae),0,1).toVar(),ot=Ai(et.mul(se).add(tt.mul(oe)).add(rt.mul(ae)).div(l(at,.001)),e.coverGrade).toVar(),st=Ai(it,e.coverGrade),ct=G(1).sub(b);I.assign(T(I,st,ie.mul(G(1).sub(y.mul(.7))).mul(.85).mul(ct))),I.assign(T(I,ot,se.add(oe.add(ae).mul(G(1).sub(y.mul(.6)))).min(1).mul(ct)));let lt=zr,ut=Lr,dt=e=>U(e[0],e[1],e[2]),ft=T(dt(lt.ash),dt(lt.ashGrey),z(.1,.7,K.mul(.5).add(J.mul(.5)).mul(.5).add(.5)).mul(.6)),pt=T(dt(lt.herb),dt(lt.herbDry),z(-.3,.6,We.mul(.5).add(K.mul(.4)).add(J.mul(.2)))).mul(J.mul(.1).add(Ge.mul(.1)).add(1)),ht=Se(z(ut.shrubStart,ut.shrubFull,le),K.mul(.5).add(J.mul(.4)).add(We.mul(.3))),gt=Ai(T(T(T(ft,pt,z(0,ut.herbFull,le)),dt(lt.shrub).mul(J.mul(.15).add(1)),ht),Ne,z(ut.regenStart,ut.regenFull,le)),e.coverGrade).toVar();I.assign(T(I,gt,R.mul(ct)));let vt=Ai(et.mul(.85),e.coverGrade);I.assign(T(I,vt,ue.mul(ct).mul(G(1).sub(y.mul(.45)))));let yt=U(.4,.39,.36).mul(he.mul(.3).add(.8)),bt=T(U(.44,.33,.21).mul(me.mul(.25).add(.85)),yt,z(.4,.7,x(d.mul(.9)).mul(.5).add(.5))),xt=T(U(.38,.35,.3),v.mul(1.4),.35).mul(he.mul(.2).add(.9));I.assign(T(I,bt,S)),I.assign(T(I,xt,C.mul(G(1).sub(S))));let St=Pi(Fe,Ie,Le,{px:1.1,stretch:5,minCell:4,offset:61}),Ct=Pi(Fe,Ie,Le,{px:3,stretch:4,minCell:10,offset:71}),$=xe(.055,75),wt=x(d.mul(.012).add(81)),Tt=x(d.mul(.0035).add(91)),Et=Se(pe,St.mul(.7).add(Ct.mul(.35)).add($.mul(.2))),Dt=T(U(.05,.08,.04),U(.08,.105,.05),z(.1,.8,Tt).mul(.5)).mul(wt.mul(.08).add(1)).mul(Ct.mul(.12).add($.mul(.06)).add(1)),Ot=T(ne.mul(.75),U(.14,.13,.105).mul(W.mul(.15).add(Te.mul(.1)).add(1)),.55),kt=T(T(Ot,ne.mul(.35),z(0,.6,pe)),st,ie),At=Pi(Fe,Ie,Le,{px:1,stretch:6,minCell:2,offset:151}).mul(.6).add(Pi(Fe,Ie,Le,{px:2.5,stretch:5,minCell:6,offset:157}).mul(.4)).mul(z(800,2500,t)).mul(.14).add(1).toVar(),jt=ot.mul(T(At,G(1),Y(se.div(l(at,.001)),0,1))),Mt=T(T(T(kt.mul(At),vt.mul(.85),ue),Dt,Et),jt,at).toVar();if(ce){let t=z(.05,.5,Pi(Fe,Ie,Le,{px:1,stretch:7,minCell:3,offset:141}).negate());Mt.assign(T(Mt,T(gt.mul(.9),Ai(dt(lt.snag),e.coverGrade),t.mul(.5)),R))}if(I.assign(T(T(Mt,Pe,A),I,m)),i.cover?.sea){let t=G(1).sub(Y(q.sub(n).normalize().y,0,1)),r=Ai(T(U(.05,.08,.115),U(.2,.27,.36),re(t,8)),e.coverGrade);I.assign(T(I,r,de))}I.assign(I.mul(G(1).sub(e.wet.mul(.35))));let Nt=x(d.mul(.9).add(5)).mul(.5).add(.5),Pt=T(U(.58,.62,.7),U(.72,.74,.78),z(.2,.7,ge)).mul(me.mul(.1).add(Nt.mul(.06)).add(.88));I.assign(T(I,Pt,ge));let Ft=T(E,U(D.g.mul(2).sub(1),D.b.mul(2).sub(1),.5),k.mul(s));return _e.assign(H(Ft.x,Ft.y.negate()).mul(s.mul(.8).mul(G(1).sub(ge)).mul(m))),I})();let ve=u.add(U(_e.x,0,_e.y)).normalize();c.normalNode=Ne.mul(qe(ve,0)).xyz.normalize(),c.roughnessNode=T(T(T(G(.95),G(.55),e.wet),G(.8),ge),G(.35),de);let ye=G(1).sub(l(g.mul(m).mul(.6),G(1).sub(m).mul(pe).mul(.4)));return c.receivedShadowNode=a(e.fadeShadow(ye)),c}var po=(e,t,n=.85)=>T(e,U(.7,.73,.78),Y(t.mul(z(.35,.8,u.y)).mul(n),0,1));async function mo(t,r,i){let a=t.debris;if(!a?.count)return null;let o=a.fields.length,s=a.fields.indexOf(`x`),c=a.fields.indexOf(`y`),l=a.fields.indexOf(`z`),u=a.fields.indexOf(`footprint`),d=en(0),f=[],p=[],h=[],g=new ze,_=new I,y=new M,b=new M,S=(e,t,n,i,a)=>(g.setFromEuler(_.set((d()-.5)*.3,d()*Math.PI*2,Math.PI/2+(d()-.5)*.35,`YXZ`)),new K().compose(b.set(e,r(e,t)+i+n,t),g,y.set(i,a,i)));for(let e=0;e<a.count;e++){let t=e*o,n=a.data[t+s],i=-a.data[t+c],m=Math.max(1,u>=0?a.data[t+u]:3);d=en($t(a.data[t+s],a.data[t+c]));let v=Number.isFinite(a.data[t+l])&&l>=0?Math.min(a.data[t+l],r(n,i)):r(n,i),x=.12+m*(.03+d()*.05);g.setFromEuler(_.set(0,d()*Math.PI*2,0)),f.push(new K().compose(b.set(n,v-.06,i),g,y.set(m*.5,x,m*(.3+d()*.18))));let C=1+Math.floor(d()*Math.min(4,m*.8));for(let e=0;e<C;e++){let e=m*(.5+d()*.6)+1,t=.07+d()*.13;p.push(S(n+(d()-.5)*m*.7,i+(d()-.5)*m*.7,d()<.5?x*(.3+d()*.5):0,t,e))}let w=8+Math.round(m*4);for(let e=0;e<w;e++){let e=d()*Math.PI*2,t=Math.sqrt(d())*m*.75,r=1-t/(m*.75);h.push(S(n+Math.cos(e)*t,i+Math.sin(e)*t,x*r*(.4+d()*.7),.015+d()*.035,.6+d()*2.4))}}let C=new v;C.name=`debris`;let w=new ft({roughness:1,metalness:0});w.colorNode=L(()=>{let e=n,t=x(U(e.x.mul(7),e.y.mul(3),e.z.mul(7))).mul(.5).add(.5),r=z(.35,.6,x(e.mul(14)).mul(.5).add(.5)),a=T(U(.05,.04,.03),T(U(.12,.095,.07),U(.17,.14,.105),t),r.mul(.7).add(.3));return po(T(a,U(.22,.1,.045).mul(r.mul(.6).add(.4)),z(.5,.8,x(e.xz.mul(.7))).mul(.6)),i)})();let D=new pt(1,20,6,0,Math.PI*2,0,Math.PI/2),O=D.attributes.position,k=en(77),A=Array.from({length:7},()=>[k()*Math.PI*2,1+Math.floor(k()*4),k()*.14]);for(let e=0;e<O.count;e++){let t=O.getX(e),n=O.getY(e),r=O.getZ(e),i=Math.atan2(r,t),a=1+A.reduce((e,[t,r,a])=>e+Math.sin(i*r+t+n*5)*a,0);O.setXYZ(e,t*a,n*(.6+.6*a*k()),r*a)}D.computeVertexNormals();let j=new ue(D,w,f.length);f.forEach((e,t)=>j.setMatrixAt(t,e));let N=await Dn(`pine`),P=Math.round(Math.sqrt(N.px.length/4)),ee=new m(new Uint8Array(N.px.buffer.slice(0)),P,P);ee.colorSpace=He,ee.wrapS=ee.wrapT=X,ee.magFilter=e,ee.minFilter=Se,ee.generateMipmaps=!0,ee.needsUpdate=!0;let te=e=>{let t=new ft({roughness:.92,metalness:0});return t.colorNode=L(()=>{let t=rt(`position`,`vec3`),n=rt(`instanceLength`,`float`),r=Z(ee,H($e().x,t.y.mul(n).mul(.35))).rgb.mul(U(.75,.68,.62)),a=T(r,U(.32,.3,.27),G(e)),o=z(.49,.5,t.y.abs()).mul(z(.7,.9,rt(`normal`,`vec3`).y.abs()));return po(T(a,U(.6,.48,.32),o),i,.7)})(),t},F=(e,t,n)=>{let r=new E(1,1,1,t,1),i=new Float32Array(e.length);e.forEach((e,t)=>i[t]=new M().setFromMatrixColumn(e,1).length()),r.setAttribute(`instanceLength`,new R(i,1));let a=new ue(r,te(n),e.length);return e.forEach((e,t)=>a.setMatrixAt(t,e)),a},ne=F(p,10,.15),re=F(h,5,.35);for(let e of[j,ne,re])e.instanceMatrix.needsUpdate=!0,e.castShadow=e.receiveShadow=!0,e.layers.enable(1),e.computeBoundingSphere(),C.add(e);return C}function ho(e,t=30){let n=1/0,r=-1/0,i=1/0,a=-1/0;for(let t of e)for(let e of t)for(let t of e)n=Math.min(n,t[0]),r=Math.max(r,t[0]),i=Math.min(i,t[1]),a=Math.max(a,t[1]);n-=5,r+=5,i-=5,a+=5;let o=Math.max(16,Math.min(512,Math.ceil(Math.max(r-n,a-i)/2))),s=[];for(let t of e)for(let e of t)for(let t=0;t<e.length;t++){let n=[...e[t],...e[(t+1)%e.length]];s.push(n[0],n[1],n[2],n[3])}let c=s.length/4,l=Math.max(1,Math.floor((r-n)/t)+1),u=Math.max(1,Math.floor((a-i)/t)+1),d=(e,n,r)=>Math.min(r-1,Math.max(0,Math.floor((e-n)/t))),f=e=>{let o=s[e*4],c=s[e*4+1],f=s[e*4+2],p=s[e*4+3];if(!(Number.isFinite(o)&&Number.isFinite(c)&&Number.isFinite(f)&&Number.isFinite(p)))return[0,l-1,0,u-1];let m=Math.min(o,f)-t,h=Math.max(o,f)+t,g=Math.min(c,p)-t,_=Math.max(c,p)+t;return h<n-t||m>r+t||_<i-t||g>a+t?null:[Math.max(0,d(m,n,l)-1),Math.min(l-1,d(h,n,l)+1),Math.max(0,d(g,i,u)-1),Math.min(u-1,d(_,i,u)+1)]},p=new Uint32Array(l*u+1),m=[];for(let e=0;e<c;e++){let t=f(e);if(m.push(t),t)for(let e=t[2];e<=t[3];e++)for(let n=t[0];n<=t[1];n++)p[e*l+n+1]++}for(let e=0;e<l*u;e++)p[e+1]+=p[e];let h=new Uint32Array(p[l*u]),g=p.slice(0,l*u);for(let e=0;e<c;e++){let t=m[e];if(t)for(let n=t[2];n<=t[3];n++)for(let r=t[0];r<=t[1];r++)h[g[n*l+r]++]=e}let _=new Uint8Array(o*o*4);for(let e=0;e<o;e++){let c=i+(e+.5)/o*(a-i),f=d(c,i,u);for(let i=0;i<o;i++){let a=n+(i+.5)/o*(r-n),u=f*l+d(a,n,l),m=t*t;for(let e=p[u];e<p[u+1];e++){let n=h[e]*4,r=s[n],i=s[n+1],o=s[n+2],l=s[n+3];if(Math.min(r,o)-a>t||a-Math.max(r,o)>t||Math.min(i,l)-c>t||c-Math.max(i,l)>t)continue;let u=o-r,d=l-i,f=u*u+d*d,p=f>0?Math.max(0,Math.min(1,((a-r)*u+(c-i)*d)/f)):0;m=Math.min(m,(r+p*u-a)**2+(i+p*d-c)**2)}_[(e*o+i)*4]=Math.round(Math.sqrt(m)/t*255),_[(e*o+i)*4+3]=255}}return{px:_,size:o,west:n,south:i,east:r,north:a}}function go(){let t=vt(7,8,4),n=new Float32Array(65536);for(let e=0;e<256;e++)for(let r=0;r<256;r++)n[e*256+r]=t(r/256,e/256);let r=new Uint8Array(262144);for(let e=0;e<256;e++)for(let t=0;t<256;t++){let i=(n[e*256+(t+1)%256]-n[e*256+(t+256-1)%256])*18,a=(n[(e+1)%256*256+t]-n[(e+256-1)%256*256+t])*18,o=Math.hypot(i,a,1);r.set([(-i/o*.5+.5)*255,(-a/o*.5+.5)*255,(1/o*.5+.5)*255,255],(e*256+t)*4)}let i=new m(r,256,256);return i.wrapS=i.wrapT=X,i.magFilter=e,i.minFilter=Se,i.generateMipmaps=!0,i.needsUpdate=!0,i}var _o=Number(new URLSearchParams(location.search).get(`blursign`)??1),vo=e=>e>0?.003+.00512*e:0;function yo(t,n=30){let{px:r,size:i,west:a,south:o,east:s,north:c}=ho(t,n),l=new m(r,i,i);return l.magFilter=l.minFilter=e,l.needsUpdate=!0,{texture:l,west:a,south:o,east:s,north:c}}function bo(e,t,n){let r=(e.water??[]).filter(e=>Array.isArray(e?.rings)&&e.rings[0]?.length>=3);if(!r.length)return null;let i=go(),a=new Map;for(let[e,n]of r.entries()){let r=n.rings[0],i=Math.round(t[e]*10)/10,o=(e,t)=>(e.forEach(([e,n],r)=>r?t.lineTo(e,n):t.moveTo(e,n)),t),s=o(r,new Ee);for(let e of n.rings.slice(1))e.length>=3&&s.holes.push(o(e,new Ge));a.has(i)||a.set(i,{shapes:[],rings:[]}),a.get(i).shapes.push(s),a.get(i).rings.push(n.rings.filter(e=>e.length>=3))}let o=new v;o.name=`water`;let s=V(n.sunDir.clone()),c=V(new M(n.sunColour.r,n.sunColour.g,n.sunColour.b)),l=new Pe(862762),u=V(new M(l.r,l.g,l.b)),d={slope:V(0),via:V(1)},f=[];for(let[e,{shapes:t,rings:n}]of a){let r=new pe(t,4),a=yo(n),l=new Qe(r,xo(i,s,c,u,d,a,e=>l.add(e),e=>f.push(e)));l.rotation.x=-Math.PI/2,l.position.y=e,l.receiveShadow=!0,l.name=`water-${e}`,o.add(l)}return{group:o,update:()=>{s.value.copy(n.sunDir),c.value.set(n.sunColour.r,n.sunColour.g,n.sunColour.b)},setLook:e=>{d.slope.value=Math.sqrt(vo(e.windMs)),d.via.value=+(e.look===`via`);for(let t of f)t.resolutionScale=e.full?1:.5}}}function xo(e,t,r,i,a,o,s,c){let u=new _e,d=Z(e),f=r,p=i,m=(e=>{let t=ce(W(e,103),H(W(Ze,17),W(Ze,29))),n=W(e,107).sub(H(W(Ze,-19),W(Ze,31))),r=ce(W(e,H(897,983)),H(W(Ze,101),W(Ze,97))),i=xe(W(e,H(1091,1027)),H(W(Ze,109),W(Ze,-113)));return d.sample(t).add(d.sample(n)).add(d.sample(r)).add(d.sample(i)).mul(.5).sub(1)})(n.xz.mul(56)),g=h(U(m.x.mul(a.slope.div(.35)),1,m.y.mul(a.slope.div(.35)))),_=q.sub(n),v=h(_),y=h(ne(t.negate(),g)),b=l(0,Je(v,y)),x=f.mul(re(b,l(G(60),G(2).div(l(a.slope.mul(a.slope),1e-4))))).mul(a.slope.greaterThan(0).select(G(2),G(.6))),S=f.mul(l(Je(t,g),0)).mul(.5),C=Q(_),w=g.xz.mul(G(.001).add(G(1).div(C))).mul(a.slope.mul(4)),E=H(n.x.sub(o.west).div(o.east-o.west),n.z.negate().sub(o.south).div(o.north-o.south)),D=Z(o.texture,E).r.mul(30);return u.colorNode=L(()=>{let e=ie({resolutionScale:.5});c(e.reflector),e.uvNode=e.uvNode.add(w),s(e.target);let n=a.slope.mul(_o*.05).div(l(C.div(400),1)),r=t=>{let r=ie({reflector:e.reflector});return r.uvNode=e.uvNode.add(H(0,n.mul(t))),r.rgb},i=e.rgb.mul(.3).add(r(1).mul(.25)).add(r(2).mul(.2)).add(r(3).mul(.15)).add(r(4).mul(.1)),o=l(Je(v,g),0),u=G(.02),d=Fe(re(G(1).sub(o),5),G(1).sub(u)).add(u),m=p.mul(l(0,Je(g,v))),h=S.mul(.3).add(m),_=U(.16,.2,.25),y=T(i.mul(.85),T(i.mul(.78),_.mul(Je(i,U(.3,.59,.11)).mul(1.4)),.3),a.via),b=h.mul(G(1).sub(d)).add(y.add(x).mul(d)).toVar(),E=G(1).sub(z(0,6,D));b.assign(b.mul(T(G(1),G(.72),E)));let O=U(.42,.35,.25).mul(f.mul(l(t.y,.2)).mul(.35).add(.25));return b.assign(T(b,O,G(1).sub(z(.6,2.2,D)).mul(a.via))),b})(),u}var So={ground:`bare`,weather:`clear`},Co=[`bare`,`snow`],wo=[`clear`,`overcast`,`rain`,`snow`];function To(e){if(!e)return null;let t=e=>e==null||e===``||!Number.isFinite(Number(e))?void 0:Number(e),n=typeof e.dateTime==`string`&&!Number.isNaN(Date.parse(e.dateTime))?e.dateTime:void 0,r=typeof e.utc==`string`&&!Number.isNaN(Date.parse(e.utc))?e.utc:void 0,i=typeof e.timeZone==`string`&&Eo(e.timeZone)?e.timeZone:void 0,a=e.sun===`true`?`true`:`daylight`,o=Co.includes(e.ground)?e.ground:`bare`,s=wo.includes(e.weather)?e.weather:`clear`,c=e.sunPosition,l=t(c?.elevationDegrees),u=t(c?.azimuthDegrees),d=l!==void 0&&u!==void 0?{elevationDegrees:l,azimuthDegrees:u}:void 0,f=t(e.cloudCover),p=t(e.visibilityKm),m=f===void 0?void 0:Math.min(1,Math.max(0,f)),h=p!==void 0&&p>0?p:void 0,g=t(e.windMs),_=g===void 0?void 0:Math.min(20,Math.max(0,g)),v=e.look===`photo`?`photo`:e.look===`via`?`via`:void 0;return{dateTime:n,timeZone:i,utc:r,sun:a,latitude:t(e.latitude),longitude:t(e.longitude),sunPosition:d,ground:o,weather:s,cloudCover:m,visibilityKm:h,windMs:_,look:v}}function Eo(e){try{return new Intl.DateTimeFormat(`en-US`,{timeZone:e}),!0}catch{return!1}}function Do(e,t){let n=Date.parse(`${e}Z`),r=e=>{let n=Object.fromEntries(new Intl.DateTimeFormat(`en-US`,{timeZone:t,hourCycle:`h23`,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`}).formatToParts(new Date(e)).map(e=>[e.type,e.value]));return Date.UTC(+n.year,n.month-1,+n.day,+n.hour,+n.minute,+n.second)-Math.floor(e/1e3)*1e3},i=n-r(n);return i=n-r(i),new Date(i)}function Oo(e){return e.utc?new Date(e.utc):e.dateTime?!/(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(e.dateTime)&&/T\d/.test(e.dateTime)&&e.timeZone&&!Number.isNaN(Date.parse(`${e.dateTime}Z`))?Do(e.dateTime,e.timeZone):new Date(e.dateTime):null}function ko(e){let t=e.get(`env`);if(t)try{return To(JSON.parse(t))}catch{return null}let n=[`dateTime`,`utc`,`timeZone`,`sun`,`latitude`,`longitude`,`ground`,`weather`,`cloudCover`,`visibilityKm`,`windMs`,`look`];return n.some(t=>e.has(t))?To(Object.fromEntries(n.map(t=>[t,e.get(t)??void 0]))):null}function Ao(e,t,n){let r=Math.PI/180,i=(e.getTime()/864e5+2440587.5-2451545)/36525,a=((280.46646+i*(36000.76983+i*3032e-7))%360+360)%360,o=357.52911+i*(35999.05029-1537e-7*i),s=.016708634-i*(42037e-9+1.267e-7*i),c=Math.sin(o*r)*(1.914602-i*(.004817+14e-6*i))+Math.sin(2*o*r)*(.019993-101e-6*i)+Math.sin(3*o*r)*289e-6,l=125.04-1934.136*i,u=a+c-.00569-.00478*Math.sin(l*r),d=23+(26+(21.448-i*(46.815+i*(59e-5-i*.001813)))/60)/60+.00256*Math.cos(l*r),f=Math.asin(Math.sin(d*r)*Math.sin(u*r)),p=Math.tan(d*r/2)**2,m=4/r*(p*Math.sin(2*a*r)-2*s*Math.sin(o*r)+4*s*p*Math.sin(o*r)*Math.cos(2*a*r)-.5*p*p*Math.sin(4*a*r)-1.25*s*s*Math.sin(2*o*r)),h=(((e.getUTCHours()*60+e.getUTCMinutes()+e.getUTCSeconds()/60+m+4*n)%1440+1440)%1440/4-180)*r,g=t*r,_=Math.min(1,Math.max(-1,Math.sin(g)*Math.sin(f)+Math.cos(g)*Math.cos(f)*Math.cos(h)));return{elevation:90-Math.acos(_)/r,azimuth:((Math.atan2(Math.sin(h),Math.cos(h)*Math.sin(g)-Math.tan(f)*Math.cos(g))/r+180)%360+360)%360}}var jo={elevation:50,azimuth:200};function Mo(e,t){if(e.sunPosition)return{elevation:e.sunPosition.elevationDegrees,azimuth:e.sunPosition.azimuthDegrees};let n=Oo(e);if(!n)return jo;let r=e.latitude??t?.lat,i=e.longitude??t?.lng;return r===void 0||i===void 0?jo:Ao(n,r,i)}var No=e=>e-Math.floor(e);function Po(e,t){let n=No(e*.1031),r=No(t*.103),i=No(e*.0973),a=n*(r+33.33)+r*(i+33.33)+i*(n+33.33);return n+=a,r+=a,i+=a,[No((n+r)*i)*2-1,No((n+i)*r)*2-1]}function Fo(e,t){let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=e=>e*e*e*(e*(e*6-15)+10),s=o(i),c=o(a),l=(e,t)=>{let[o,s]=Po(n+e,r+t);return o*(i-e)+s*(a-t)},u=l(0,0),d=l(1,0),f=l(0,1),p=l(1,1);return((u+(d-u)*s)*(1-c)+(f+(p-f)*s)*c)*1.6}function Io(e,t){let n=0,r=1;for(let i=0;i<4;i++)n+=r*Fo(e,t),r*=.5,e*=2,t*=2;return n}var Lo=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)},Ro={scale:2e-4,density:.4,elevation:.5},zo=(()=>{let e=6e3,t=[],n=Math.PI*(3-Math.sqrt(5));for(let r=0;r<e;r++){let i=(r+.5)/e,a=Math.sqrt(1-i*i),o=r*n;t.push([Math.cos(o)*a,i,Math.sin(o)*a])}return t})();function Bo(e,t,n=Ro){if(!(e[1]>0)||!(t>0))return 0;let r=1+-.9*n.elevation,i=e[0]/(e[1]*r)*n.scale,a=e[2]/(e[1]*r)*n.scale,o=Math.min(1,Math.max(0,Io(i*1e3,a*1e3)*.7+.5)),s=Fo(i*300,a*300)*.37+.5,c=1-Math.min(1,Math.max(0,t+(s-.5)*.6)),l=Lo(0,.03+.06*n.elevation,e[1]),u=Math.max(0,o-c);return(1-Math.exp(-u*n.density*12))*l}function Vo(e,t=Ro){if(!(e>0))return 0;let n=0;for(let r of zo)n+=Bo(r,e,t);return n/zo.length}var Ho=Vo(1),Uo=new Map;function Wo(e){let t=Ro.density;if(!(e>0))return{coverage:0,density:t};let n=Math.round(Math.min(1,e)*1e3),r=Uo.get(n);if(r)return r;let i=(t,n,r)=>{for(let i=0;i<18;i++){let i=(n+r)/2;t(i)<e?n=i:r=i}return(n+r)/2},a=e<Ho?{coverage:i(e=>Vo(e),0,1),density:t}:{coverage:1,density:i(e=>Vo(1,{...Ro,density:e}),t,40)};return Uo.set(n,a),a}var Go=e=>3.912/(Math.max(.01,e)*1e3),Ko=18e3,qo=new URLSearchParams(location.search),Jo=Number(qo.get(`smap`)??4096),Yo=Number(qo.get(`shalf`)??220),Xo=60,Zo={clear:{sky:`clear`,grey:new Pe(.62,.66,.7),sun:3.2,hemi:1.3,shadows:!0,visibilityKm:50,exposure:.9,rays:!0},overcast:{sky:`grey`,grey:new Pe(.58,.61,.64),sun:.35,hemi:2.5,shadows:!1,visibilityKm:25,exposure:1,rays:!1},rain:{sky:`grey`,grey:new Pe(.42,.45,.48),sun:.2,hemi:2.3,shadows:!1,visibilityKm:8,exposure:1.05,rays:!1},snow:{sky:`grey`,grey:new Pe(.7,.72,.75),sun:.25,hemi:2.6,shadows:!1,visibilityKm:3,exposure:1,rays:!1}},Qo=.18,$o=1e3,es=.97;function ts(e,t,r=0){let i=Math.max(Ko,r),a=new $;a.scale.setScalar(i),a.turbidity.value=2.4,a.rayleigh.value=1.6,a.mieCoefficient.value=.003,a.mieDirectionalG.value=.78,a.cloudCoverage.value=.18,a.cloudSpeed.value=0,a.material.fog=!1,a.renderOrder=2;let o=V(new Pe(.5,.53,.56)),c=V(new Pe(.62,.65,.68)),u=new fe({side:1,depthWrite:!1,fog:!1});u.colorNode=T(c,o,z(-.05,.6,gt.normalize().y));let d=new Qe(new pt(1,32,16),u);d.scale.setScalar(i*.98),d.renderOrder=2,d.frustumCulled=!1,e.add(a,d);let f=new ke,p=new $;for(let e of[`turbidity`,`rayleigh`,`mieCoefficient`,`mieDirectionalG`,`cloudCoverage`,`cloudSpeed`])p[e].value=a[e].value;p.scale.setScalar(100);let m=new Qe(d.geometry,u);m.scale.setScalar(98),f.add(p,m);let h=new Oe(64,{type:Xe,generateMipmaps:!0,minFilter:Se}),_=new C(1,1e3,h),v=V(Go(50)),y=V(1.2),b=e=>{let t=e.sub(q),n=Be(h.texture,U(t.x,Q(t.xz).mul(.02).add(.001),t.z).normalize()).level(G(2)).rgb,r=l(Je(n,U(.2126,.7152,.0722)),1e-4);return n.mul(s(G(1),y.div(r)))},x=V(0),S=e=>G(1).sub(Ue(v.negate().mul(l(Q(e.sub(q)).sub(x),0))));e.fogNode=ct(b(n),S(n));let w=new g(12375020,4867634,1.3),E=new ht(16773596,3.2);E.castShadow=!0,E.shadow.mapSize.set(Jo,Jo),E.shadow.camera.layers.set(1);for(let e of[w,E])e.layers.enable(2);e.add(w,E,E.target);let D=new M(0,1,0),O=new M(0,1,0),k=V(0),A=V(0),j=V(1),N=Zo.clear,P=!0,ee=V(E.shadow.matrix),te=(e,t=n)=>L(([n])=>{let r=ee.mul(qe(t,1)).xy,i=l(Ye(r.x.sub(.5)),Ye(r.y.sub(.5))).mul(2);return T(T(G(1),n,j),T(G(1),e,j),z(.75,.97,i))}),F=0,ne=0,I=Yo,re=()=>F*2.5+400;function ie(e,t){let n=Math.max(.1,O.y),r=Math.sqrt(1-n*n),i=Math.min(e,e*n+t*r);(e!==F||i!==ne)&&(F=e,ne=i,Object.assign(E.shadow.camera,{left:-F,right:F,top:ne,bottom:-ne,near:1,far:2*re()}),E.shadow.camera.updateProjectionMatrix())}function ae(e){let n=e.getWorldDirection(new M).setY(0);n.lengthSq()<1e-6&&n.set(0,0,-1),n.normalize();let r=e.position.clone().addScaledVector(n,I*.6);r.y=t(r.x,r.z);let i=0;for(let e=-2;e<=2;e++)for(let n=-2;n<=2;n++)i=Math.max(i,Math.abs(t(r.x+e*I/2,r.z+n*I/2)-r.y));ie(I,Math.ceil((i+Xo)/10)*10);let a=Math.max(.1,O.y),o=Math.max(2*F,2*ne/a)/Jo;E.shadow.normalBias=o,E.shadow.bias=-o*a/(2*re());let s=2*F/Jo,c=2*ne/Jo,l=new M().crossVectors(new M(0,1,0),O);l.lengthSq()<1e-10&&l.set(1,0,0),l.normalize();let u=new M().crossVectors(O,l),d=Math.round(r.dot(l)/s)*s,f=Math.round(r.dot(u)/c)*c,p=r.dot(O);r.copy(l).multiplyScalar(d).addScaledVector(u,f).addScaledVector(O,p),E.target.position.copy(r),E.position.copy(r).addScaledVector(O,re()),E.updateMatrixWorld(),E.target.updateMatrixWorld(),E.shadow.updateMatrices(E)}let oe=!0,se=.9,ce={cloudCover:Qo,visibilityKm:50,skyCoverage:Qo,skyDensity:.4,dome:!1,haze:!0};function R(e,t){let n=Mo(e,t),r=e.sun??`daylight`,i=r===`true`;N=Zo[e.weather];let s=Math.PI/180,l=(e,t)=>t.set(Math.sin(n.azimuth*s)*Math.cos(e*s),Math.sin(e*s),-Math.cos(n.azimuth*s)*Math.cos(e*s));l(Math.max(n.elevation,-1),D);let u=i?n.elevation:Math.max(n.elevation,6);l(u,O);let f=i?+(n.elevation>0):1;a.sunPosition.value.copy(D),p.sunPosition.value.copy(D);let h=nt.smoothstep(n.elevation,-4,10),g=nt.smoothstep(n.elevation,2,28);E.color.setRGB(1,.5+.45*g,.28+.58*g),E.intensity=N.sun*h*f,w.intensity=N.hemi*(.32+.68*nt.smoothstep(n.elevation,-8,18)),w.color.setRGB(.74-.2*(1-h),.83-.12*(1-h),.93),P=N.shadows&&h>.15&&f>0,E.shadow.intensity=+!!P,j.value=+!!P,E.shadow.needsUpdate=!0;let _=N.sky===`clear`&&n.elevation<-1.5;if(a.visible=p.visible=N.sky===`clear`&&!_,d.visible=m.visible=!a.visible,_){let e=nt.smoothstep(n.elevation,-14,-1.5);c.value.setRGB(.1+.22*e,.12+.16*e,.2+.14*e),o.value.setRGB(.03+.05*e,.05+.09*e,.12+.16*e)}else c.value.copy(N.grey).multiplyScalar(.35+.65*h),o.value.copy(N.grey).multiplyScalar((.35+.65*h)*.82);let b=N.sky===`clear`?e.cloudCover:1,S=N.sky===`grey`||b!==void 0&&b>=es,C=b===void 0?{coverage:Qo,density:.4}:S?{coverage:0,density:.4}:Wo(b);for(let e of[a,p])e.cloudCoverage.value=C.coverage,e.cloudDensity.value=C.density;S&&N.sky===`clear`&&!_&&(a.visible=p.visible=!1,d.visible=m.visible=!0,c.value.copy(Zo.overcast.grey).multiplyScalar(.35+.65*h),o.value.copy(Zo.overcast.grey).multiplyScalar((.35+.65*h)*.82)),y.value=Math.max(.03,(E.intensity*Math.max(0,O.y)+w.intensity)/Math.PI)*(e.look===`photo`?.55:1),x.value=e.look===`photo`?0:8e3;let T=e.visibilityKm??N.visibilityKm;v.value=T>=1e3?0:Go(T),ce={cloudCover:+(b??Vo(Qo)).toFixed(3),visibilityKm:T,skyCoverage:+C.coverage.toFixed(3),skyDensity:+C.density.toFixed(3),dome:S,haze:T<$o},k.value=+(e.ground===`snow`),se=N.exposure*(1+.9*(1-h))*(e.ground===`snow`?.72:1),A.value=+(e.weather===`rain`),oe=!0;let M=e=>Math.round(e*10)/10;return{elevation:M(n.elevation),azimuth:M(n.azimuth),drawnElevation:M(u),drawnAzimuth:M(n.azimuth),exposure:+se.toFixed(3),mode:r}}function le(e,t,n=!0){oe&&(oe=!1,_.update(e,f)),e.toneMappingExposure=se;let r=P&&n;return r&&ae(t),E.shadow.autoUpdate=!1,E.shadow.needsUpdate=r,r}return{setShadowHalf:e=>{I=e??Yo},skyScale:i,sky:a,sun:E,hemi:w,sunDir:D,lightDir:O,extinction:v,fogColour:b,fogFactor:S,fadeShadow:te,snow:k,wet:A,apply:R,frame:le,raysOn:()=>N.rays&&P,skyReport:()=>ce}}var ns=14e3,rs=new M(60,30,60);function is(){let e=new Float32Array(ns*4*4),t=new Float32Array(ns*4*2),r=new Uint32Array(ns*6);for(let n=0;n<ns;n++){let i=[Math.random(),Math.random(),Math.random(),Math.random()];for(let r=0;r<4;r++)e.set(i,(n*4+r)*4),t.set([r&1?.5:-.5,r&2?.5:-.5],(n*4+r)*2);r.set([n*4,n*4+1,n*4+2,n*4+1,n*4+3,n*4+2],n*6)}let i=new w;i.setAttribute(`position`,new o(new Float32Array(ns*4*3),3)),i.setAttribute(`seed`,new o(e,4)),i.setAttribute(`corner`,new o(t,2)),i.setIndex(new o(r,1));let a={time:V(0),snow:V(0),share:V(1),eye:V(new M)},s=U(rs.x,rs.y,rs.z),c=rt(`seed`,`vec4`),l=rt(`corner`,`vec2`),u=T(G(9),G(1.1),a.snow),d=U(se(a.time.mul(.7).add(c.w.mul(40))).mul(.6),0,se(a.time.mul(.53).add(c.w.mul(23))).mul(.6)).mul(a.snow),f=U(.6,0,.3).mul(G(1).sub(a.snow)),p=c.xyz.mul(s).add(f.sub(U(0,1,0)).mul(u).mul(a.time)).add(d).sub(a.eye).add(s.mul(.5)),m=p.sub(s.mul(p.div(s).floor())).sub(s.mul(.5)),g=a.eye.add(m),v=h(U(q.x.sub(g.x),0,q.z.sub(g.z))),y=be(U(0,1,0),v),b=T(U(.01,.38,0),U(.035,.035,0),a.snow).mul(c.w.mul(.6).add(.7)),x=_(c.w.lessThan(a.share),G(1),G(0)),S=new fe({transparent:!0,depthWrite:!1,fog:!0,side:2});S.positionNode=g.add(y.mul(l.x.mul(b.x)).add(U(0,l.y.mul(b.y),0))).mul(x).add(a.eye.mul(G(1).sub(x))),S.colorNode=T(U(.62,.66,.7),U(.95,.96,1),a.snow),S.opacityNode=T(G(.22),G(.85),a.snow).mul(z(1.5,6,n.sub(q).length()));let C=new Qe(i,S);return C.frustumCulled=!1,C.layers.set(2),C.visible=!1,C.name=`precipitation`,{mesh:C,set(e){C.visible=e!==null,a.snow.value=+(e===`snow`),a.share.value=e===`snow`?.75:1},update(e,t){a.time.value=e,a.eye.value.copy(t)}}}function as(e,t,n){if(!(Number.isFinite(t)&&t>0&&Number.isFinite(n)&&n>0))throw Error(`The camera needs a positive viewport.`);let r=e?.aspectRatio??t/n;if(e&&e.kind!==`perspective`||!Number.isFinite(r)||r<=0)throw Error(`Unsupported PGMaps camera projection.`);let i=Math.min(t,n*r),a=i/r;return{width:i,height:a,left:(t-i)/2,top:(n-a)/2,aspect:r}}var os=[`packed-arrays`,`scene-keys`,`stand-components-v1`,`stand-fields-v1`,`render-options-v1`],ss=e=>typeof e==`object`&&!!e&&!Array.isArray(e)&&!ArrayBuffer.isView(e);function cs(e){if(Array.isArray(e)){let t=0;if(e.length&&ss(e[0]))for(let n of e)t+=cs(n);return t}if(!ss(e))return 0;let t=0;for(let n of Object.keys(e)){let r=e[n];if(r instanceof Float64Array){let i=Array(r.length);for(let e=0;e<r.length;e++){let t=r[e];i[e]=Number.isNaN(t)?null:t}e[n]=i,t++}else t+=cs(r)}return t}var ls=new URLSearchParams(location.search),us=e=>void Object.assign(globalThis,e);function ds(){let e=document.getElementById(`info`),t=window.parent!==window,n=t||ls.has(`embed`);return ls.has(`embed`)&&e&&(e.hidden=!0),{worker:!1,embedded:t,baseUrl:document.baseURI,post:(e,n=[])=>{t&&window.parent.postMessage(e,{targetOrigin:`*`,transfer:n})},status:t=>{e&&(e.textContent=t)},canvas:()=>void 0,viewport:()=>({width:innerWidth,height:innerHeight,pixelRatio:devicePixelRatio}),onResize:e=>(addEventListener(`resize`,e),()=>removeEventListener(`resize`,e)),place:(e,t)=>{Object.assign(e.style,{position:`absolute`,left:`${t.left}px`,top:`${t.top}px`})},mount:e=>{document.body.appendChild(e),n&&(e.style.pointerEvents=`none`)},unmount:e=>e.remove(),expose:us}}function fs(){let e,t={width:1,height:1,pixelRatio:1},n=new Set,r=(e,t=[])=>globalThis.postMessage(e,{transfer:t}),i=e=>{let t=e;return!t||!(Number(t.width)>0)||!(Number(t.height)>0)?null:{width:Math.round(Number(t.width)),height:Math.round(Number(t.height)),pixelRatio:Number(t.pixelRatio)>0?Number(t.pixelRatio):1}};return addEventListener(`message`,r=>{let a=r.data;if(a?.type===`pgmaps-worker-init`&&a.canvas instanceof OffscreenCanvas)e=a.canvas,t=i(a.viewport)??t;else if(a?.type===`pgmaps-worker-viewport`){let e=i(a.viewport);if(!e||e.width===t.width&&e.height===t.height&&e.pixelRatio===t.pixelRatio)return;t=e;for(let e of n)e()}}),{worker:!0,embedded:!0,baseUrl:location.href,post:r,status:()=>{},canvas:()=>{if(!e)throw Error(`PGMaps has not handed this worker its canvas (pgmaps-worker-init).`);return e},viewport:()=>t,onResize:e=>(n.add(e),()=>n.delete(e)),place:(e,t)=>r({type:`pgmaps-engine-viewport`,...t}),mount:()=>{},unmount:()=>{},expose:us}}var ps=typeof document>`u`?fs():ds(),ms=`1.0.0+a913ca7`,hs=6,gs=1200,_s=4e3,vs=600,ys=new URLSearchParams(location.search),bs=`nanite`,xs=ps.embedded,Ss=(e,t=[])=>ps.post({engine:bs,...e},t),Cs=null,ws=!1,Ts=null,Es=null,Ds=null,Os=Rt(ys),ks=ko(ys)??So,As=ko(ys)!==null,js=null,Ms=null,Ns=null,Ps=new WeakMap,Fs=()=>{let e=performance.now(),t={};return{ms:t,lap:n=>{let r=performance.now();t[n]=Math.round(((t[n]??0)+r-e)*10)/10,e=r}}},Is={at:0,unpack:0,packed:0},Ls={show:{},build:{},finalStand:{},capture:{}};async function Rs(e,t=null){if(ws)Ts=e,Es=t;else{ws=!0;try{As||(ks=To(e.environment)??So);let n=Fs();Ls.show=n.ms,n.ms.arrivedAt=Is.at,n.ms.unpack=Is.unpack,n.ms.packedArrays=Is.packed;let r=null;try{ys.get(`reuse`)!==`0`&&(r=t!==null&&e===Ms?Ns:on(e))}catch{}if(n.lap(`hash`),Cs&&r!==null&&r===Ns&&Cs.sameAs(e,ks))await Cs.again(e),n.ms.reused=1,n.lap(`again`);else if(t!==null){n.ms.reused=0,Ss({type:`pgmaps-engine-scene-needed`,key:t});return}else Cs&&await Cs.teardown(),Cs=null,Ns=null,Cs=await Ks(e,ks),Ns=r,n.ms.reused=0,n.lap(`build`);Ms=e,Cs.setRenderOptions(Os),Cs.setEnvironment(ks),Ds&&Cs.setEye(Ds),js=null}catch(e){console.error(e),js=e instanceof Error?e.message:String(e),zs(e)}finally{ws=!1;let e=Ts,t=Es;Ts=null,Es=null,e&&Rs(e,t)}}}function zs(e){let t=e instanceof Error?e.message:String(e);ps.status(`failed: ${t}`),ps.expose({pgmaps:{ready:!0,error:t}}),Ss({type:`pgmaps-engine-error`,message:t})}addEventListener(`message`,e=>{let t=performance.now(),n=e.data;if(n?.type===`pgmaps-scene`&&n.scene){let e=cs(n.scene);Is={at:Math.round(performance.timeOrigin+t),unpack:Math.round((performance.now()-t)*10)/10,packed:e},typeof n.key==`string`&&Ps.set(n.scene,n.key),Ds=null,Rs(n.scene)}else if(n?.type===`pgmaps-scene`&&typeof n.key==`string`)!ws&&Cs&&Ms&&Ps.get(Ms)===n.key?(Is={at:Math.round(performance.timeOrigin+t),unpack:0,packed:0},Ds=null,Rs(Ms,n.key)):Ss({type:`pgmaps-engine-scene-needed`,key:n.key});else if(n?.type===`pgmaps-camera`&&Array.isArray(n.position))Ds=n,Cs&&!ws&&Cs.setEye(Ds);else if(n?.type===`pgmaps-capture`)Us(n,!0).then(e=>Ss(e,e.frames.flatMap(e=>[e.classes.buffer,e.screened.buffer,e.depth.buffer,...e.zones?[e.zones.buffer]:[]])),e=>Ss({type:`pgmaps-engine-capture`,id:typeof n.id==`string`?n.id:null,error:e instanceof Error?e.message:String(e)}));else if(n?.type===`pgmaps-render-options`)Os=Lt(n.options,Os),Cs&&!ws&&Cs.setRenderOptions(Os);else if(n?.type===`pgmaps-environment`){let e=To(n);if(!e)return;As=!0,ks=e,Cs&&!ws&&Cs.setEnvironment(e)}});async function Bs(){for(;;){if(Cs&&!ws&&!Ts)return Cs;if(!Cs&&!ws&&!Ts)throw Error(js?`The scene failed to build: ${js}`:`No scene package to capture: send one first.`);await new Promise(e=>setTimeout(e,100))}}var Vs=Promise.resolve(),Hs={id:null,source:!1,done:0,total:0,perFrame:1,sentAt:0,begin(e,t){this.done=0,this.perFrame=Math.max(1,t),this.total=e*this.perFrame,this.sentAt=0},step(){if(!this.id||!this.source||!this.total)return;this.done=Math.min(this.total,this.done+1);let e=performance.now();if(e-this.sentAt<250&&this.done<this.total)return;this.sentAt=e;let t=`frame ${Math.min(this.total/this.perFrame,Math.floor((this.done-1)/this.perFrame)+1)} of ${this.total/this.perFrame}`;Ss({type:`pgmaps-capture-progress`,id:this.id,done:this.done,total:this.total,stage:t})}};function Us(e,t=!1){let n=Vs.then(async()=>{let n=va(e);Hs.id=t?n.id:null,Hs.source=t;try{return await(await Bs()).capture(n)}finally{Hs.id=null,Hs.source=!1}});return Vs=n.catch(()=>void 0),n}async function Ws(){let e=ys.get(`scene`);if(e)return(await fetch(e)).json();ps.status(`choose a PGMaps scene package (forestry-scene-package.json)`);let t=document.getElementById(`file`);return t.hidden=!1,new Promise(e=>{t.onchange=async()=>{let n=t.files?.[0];if(n)try{let r=JSON.parse(await n.text());t.hidden=!0,e(r)}catch{ps.status(`Could not read that file as JSON. Choose a PGMaps scene package.`),t.value=``}}})}function Gs(e,t){let r=e=>{let r=Je(e,U(.2126,.7152,.0722)),i=z(gs,_s,Q(n.sub(q)));return T(e,T(U(r,r,r),e,t.chroma).mul(t.tint),i)},i=t=>r(T(t,U(.78,.81,.86).mul(Je(t,U(.3,.59,.11)).mul(2).add(.55)),e.mul(.2))),a=e=>Y(e,0,1).mul(.3).add(.85);return{...We(),tint:e=>ye(e).mul(.24).add(.88),cardValue:(e,t)=>t.w,impostorValue:(e,t)=>t.w,solidColour:e=>e.mul(U(.9,.86,.8)),cardColour:(e,t,n,r)=>i(e.mul(n).mul(a(r))),impostorColour:(e,t,n,r)=>i(e.mul(t).mul(n).mul(a(r))),bakeCardColour:e=>e}}async function Ks(e,t){if(e?.format!==`pgmaps-forest-scene`||e.version!==1)throw Error(`Not a PGMaps forest scene package (v1).`);let i={...Os},o=!1,s=null,l=new Ht,u=performance.now(),d=Fs();if(Ls.build=d.ms,ys.has(`coverTest`)){let t=e=>e&&!e.cover?{...e,cover:yi(e)}:e;e={...e,terrain:t(e.terrain),farTerrain:t(e.farTerrain),skylineTerrain:t(e.skylineTerrain)}}if(ys.has(`burnTest`)){let t=Number(ys.get(`burnTest`))||2021,n=e.camera.position[0]+150,r=e=>e&&ii(e,n,t);e={...e,terrain:r(e.terrain),farTerrain:r(e.farTerrain),skylineTerrain:r(e.skylineTerrain)}}let f=gi(e);e=f.scene;let p=e.createdAt,{origin:h}=e,g=(e,t)=>Wr(Oo(e))??Wr(t?new Date(t):null),v=e=>g(e,p)??Wr(new Date),y=v(t),b=ni(e,f.rasters,y);e=b.scene;let x=e.skylineTerrain?xi(e.skylineTerrain):null;x?.posts&&(e={...e,skylineTerrain:x.grid});let S={posts:di(f.rasters),stemsRemoved:f.removed,snags:b.snags,snagsFallen:b.fallen,skylineSeaPosts:x?.posts??0,test:ys.has(`coverTest`)};console.info(`pgmaps cover`,JSON.stringify(S));let C=f.rasters.length?fi(f.rasters,si):null;d.lap(`cover`);let w=(await navigator.gpu?.requestAdapter({powerPreference:`high-performance`}))?.limits,T=new lt({canvas:ps.canvas(),antialias:!1,powerPreference:`high-performance`,...w?{requiredLimits:{maxBufferSize:w.maxBufferSize,maxStorageBufferBindingSize:w.maxStorageBufferBindingSize,maxStorageBuffersPerShaderStage:w.maxStorageBuffersPerShaderStage,maxSampledTexturesPerShaderStage:w.maxSampledTexturesPerShaderStage}}:{}});if(await T.init(),!T.backend.isWebGPUBackend)throw Error(`this example needs WebGPU (compute)`);let E=ps.viewport();T.setPixelRatio(Math.min(E.pixelRatio,1.5)),T.setSize(E.width,E.height,!ps.worker),T.shadowMap.enabled=!0,T.shadowMap.type=1,T.toneMapping=4,ps.mount(T.domElement),d.lap(`device`);let O=new ke,{camera:A}=e,P=new et(A.verticalFovDegrees,E.width/E.height,.3,3e4),ee=new M,te=ps.worker?{enabled:!1,target:ee,update:()=>P.lookAt(ee),dispose:()=>{}}:new Dt(P,T.domElement);te.enabled=!ys.has(`embed`)&&!ps.worker;let ne=A.projection,I=()=>{},re=e=>{if(o){s=e;return}ne=e.projection;let t=nt.degToRad(e.bearingDegrees),n=nt.degToRad(e.pitchDegrees);P.position.set(e.position[0],e.position[2],-e.position[1]),e.verticalFovDegrees&&(P.fov=e.verticalFovDegrees),P.updateProjectionMatrix(),I(),te.target.copy(P.position).add(new M(Math.sin(t)*Math.cos(n),Math.sin(n),-Math.cos(t)*Math.cos(n)).multiplyScalar(100)),te.update()};re(A);let L=Qa(e);d.lap(`terrain`);let{west:ie,south:ae,east:oe,north:se}=L.ground.outer,ce=Math.max(...[[ie,ae],[ie,se],[oe,ae],[oe,se]].map(([e,t])=>Math.hypot(e,t)))*1.02,R=ts(O,L.heightAt,ce);P.far=Math.max(3e4,R.skyScale+Math.hypot(A.position[0],A.position[1])+1e3),P.updateProjectionMatrix(),d.lap(`environment`);let le=eo(e,L.bounds,L.farBounds,y);d.lap(`masks`);let ue=Oi();ki(ue,t.look??`via`,y);let z=Va(e),de=e=>pa(e,A.position[0],A.position[1],L.heightAt(A.position[0],-A.position[1])),pe=Pt(z?z.trees:e.trees,r),B=pe;O.add(B.group);let[me,he]=await Promise.all([fo({masks:le,snow:R.snow,wet:R.wet,fadeShadow:e=>R.fadeShadow(e),coverGrade:ue}),Jn({...e,trees:de(pe.naniteTrees)},1,z?.extra??[])]);d.lap(`floorAndStand`),L.mesh.material=me,L.mesh.renderOrder=1,O.add(L.mesh);let ge=await mo(e,L.heightAt,R.snow);ge&&O.add(ge);let _e=Ft(e.treated);_e&&O.add(_e),d.lap(`debris`);let ve=bo(e,L.waterLevels,{sunDir:R.lightDir,sunColour:R.sun.color});d.lap(`water`),ve&&O.add(ve.group);let ye=is();O.add(ye.mesh);let be=Cr();Ba(be,t.look??`via`);let xe=Gs(R.snow,be),{types:Se}=he,{fields:U,data:W,count:Ee}=e.trees,Oe=U.indexOf(`x`),Ae=U.indexOf(`y`),je=(e,t)=>{let n=-1;for(let r=0;r<Ee;r++)n=Math.max(n,Math.hypot(W[r*U.length+Oe]-e,W[r*U.length+Ae]-t));return n>=0?n:null},Ne=G(.4),Fe=e=>({color:R.fogColour(e),factor:R.fogFactor(e)}),Ie={},Re=async e=>{let t=T.backend,n=async(n,r)=>{let i=Math.max(1,e.renderTarget.width>>r),a=Math.max(1,e.renderTarget.height>>r),o=Math.ceil(i*8/256)*256,s=t.device.createBuffer({size:o*a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),c=t.device.createCommandEncoder();c.copyTextureToBuffer({texture:t.get(n).texture,mipLevel:r},{buffer:s,bytesPerRow:o},{width:i,height:a}),t.device.queue.submit([c.finish()]),await s.mapAsync(GPUMapMode.READ);let l=an(new Uint8Array(s.getMappedRange()));return s.unmap(),s.destroy(),l},r=async e=>[await n(e,0),await n(e,1),await n(e,4),await n(e,8)];return{tiles:e.views,scales:an(e.coverage.scales),albedo:await r(e.texture),normals:await r(e.normals)}},ze=(e,t)=>{if(ys.get(`bake`)===`plain`)return t();let n=[e.renderTarget,e.normalsTarget],r={target:T.getRenderTarget(),colour:T.getClearColor(new Pe),alpha:T.getClearAlpha()};T.setClearColor(0,0);for(let e of n)T.setRenderTarget(e),T.clear();T.setRenderTarget(r.target),T.setClearColor(r.colour,r.alpha);for(let e of n)e.texture.generateMipmaps=!1;let i=T,a=T.render.bind(T),o=!1;i.clearDepth=()=>{o=!0},i.render=(e,t)=>{if(!o)return a(e,t);o=!1;let n=[T.autoClear,T.autoClearColor,T.autoClearDepth,T.autoClearStencil];T.autoClear=!0,T.autoClearColor=!1,T.autoClearDepth=!0,T.autoClearStencil=!1;try{return a(e,t)}finally{[T.autoClear,T.autoClearColor,T.autoClearDepth,T.autoClearStencil]=n}};try{t()}finally{delete i.clearDepth,delete i.render;let e=T.backend;for(let t of n)t.texture.generateMipmaps=!0,e.generateMipmaps(t.texture)}},Be=async(e,t,{lap:n,ms:r})=>{let i=new Vt(T,e.types,e.instances,e.textures,xe);i.u.maxDist.value=t,i.u.tau.value=Number(ys.get(`tau`)??2),i.group.traverse(e=>{e instanceof Qe&&!e.castShadow&&(e.material.receivedShadowNode=a(R.fadeShadow(Ne)))}),i.group.add(i.sw.buildResolveMesh({fadeShadow:e=>R.fadeShadow(Ne,e),fog:Fe}));let o=De(e.types.length),s=i.buildImpostorMesh(o,e.types.map(()=>({side:[1,1,1],top:[1,1,1]})));return s.receiveShadow=!0,s.material.receivedShadowNode=a(R.fadeShadow(Ne)),i.group.add(s,i.splats.build(o,{fadeShadow:e=>R.fadeShadow(Ne,e),shadow:e=>R.fadeShadow(Ne,e),fog:Fe}),i.buildImpostorShadowMesh(o)),n(`naniteRenderer`),ze(o,()=>Ve(T,o,e.types,{bark:e.textures.bark,leaf:e.textures.leaf,barkLayers:e.barkLayers,leafLayers:e.leafLayers,leafAlpha:N(e.textures.leaf,rt(`uv`,`vec2`))},xe,i.u.impostorPx.value)),n(`impostorBake`),await T.backend.device.queue.onSubmittedWorkDone(),n(`impostorBakeGpu`),await Te(T,o,Ce),n(`impostorCoverage`),o.coverage.ms&&(r.coverageReadback=Math.round(o.coverage.ms.readback),r.coverageWork=Math.round(o.coverage.ms.work)),ys.has(`atlasdigest`)&&(Ie[e===he?`live`:`final`]=await Re(o)),i.impostorsBaked(o,e.types.map(()=>[1,1])),i.splats.enabled.value=1,{nanite:i,atlas:o}},He=await Be(he,Math.max(9e3,(je(A.position[0],A.position[1])??0)+1500),d),Ue=He.nanite,We=He.atlas,K=Ue;O.add(K.group);let q=null,J=new we(1,1,{type:Xe,samples:1,depthBuffer:!0});J.depthTexture=new k(1,1,F),K.setDepthSource(J.depthTexture,1);let Ge=new Tt(T,J.depthTexture,R.sunDir,{enabled:ys.get(`rays`)!==`0`}),Y=new St(T,J,1,{enabled:ys.get(`taa`)!==`0`,extra:Ge.at}),Ke=new j(T,qe(Y.displayNode,1)),X=new dt,Je=0,Ye=0,Ze=()=>{if(o)return;let e=ps.viewport(),t=as(ne,e.width,e.height);Math.min(e.pixelRatio,1.5)*i.resolutionScale!==T.getPixelRatio()&&(T.setPixelRatio(Math.min(e.pixelRatio,1.5)*i.resolutionScale),Je=0),P.aspect=t.aspect,P.updateProjectionMatrix(),(Je!==t.width||Ye!==t.height)&&(T.setSize(t.width,t.height,!ps.worker),T.getDrawingBufferSize(X),J.setSize(X.x,X.y),Je=t.width,Ye=t.height),ps.place(T.domElement,t)},$e=()=>{K.frustumCulling=i.frustumCulling,B.culling(i.frustumCulling);for(let e of[_e,q?.group])e?.traverse(e=>{e instanceof Qe&&(e.frustumCulled=i.frustumCulling)})},tt=e=>{o||(i={...e},$e(),Ze())};I=Ze;let at=ps.onResize(Ze);Ze();let ot=null,st=!1,ct=t,Q=t=>{ct=t;let n=ot=R.apply(t,e.origin);Ba(be,t.look??`via`),ki(ue,t.look??`via`,v(t)),ye.set(t.weather===`rain`||t.weather===`snow`?t.weather:null),ve?.update(),ve?.setLook({windMs:t.windMs??0,look:t.look??`via`,full:st});let r=R.skyReport();$.environment={...t,...r,sunElevation:+n.elevation.toFixed(2),sunAzimuth:+n.azimuth.toFixed(2)}},ut=new M,ft=0,pt=0,mt=!1,ht=!1,gt=0,_t=performance.now(),vt=!1,yt=null,bt=0,Ct=performance.now(),$={frames:0,nanite:K,camera:P,controls:te,scene:O,ready:!1,residual:he.residual,buildMs:0,environment:null,cover:S,timing:Ls,atlasDigests:Ie,debug:{envr:R,rays:Ge,taa:Y,terrain:L,reliefSteps:wt,noShadows:!1,noRays:!1}};ps.expose({pgmaps:$}),Q(t),$e();let Et=performance.now(),Ot,kt=(e,t)=>{P.updateMatrixWorld(),xe.viewer.copy(P.position),xt.value.copy(P.position),ye.update(e,P.position);let n=$.debug,a=R.frame(T,P,t&&!n.noShadows);Ge.enabled=t&&ys.get(`rays`)!==`0`&&R.raysOn()&&!n.noRays,t?Y.jitter(P,X.x,X.y):(P.updateProjectionMatrix(),r.value.set(0,0)),c.value=0;let o=P.position.y-L.heightAt(P.position.x,P.position.z);K.sw.idle=K.splats.idle=o<(K.sw.idle?2e3:1400);let s=q?.update(P,X.y,zt(i,X.y,Ot));B.transition(s,P.position),K.frustumCulling=i.frustumCulling,K.update(P,X,e,a?R.sun.shadow.camera:null),T.setRenderTarget(J),P.layers.set(0),T.render(O,P),K.occlusion(P,X.x,X.y),K.rasterize(P,X.x,X.y);let l=T.autoClear;T.autoClear=!1,R.sun.shadow.needsUpdate=!1,P.layers.set(2),T.render(O,P),P.layers.set(0),T.autoClear=l},At=e=>{if($.queue=l.stats(),ht||mt)return;ht=!0,T.setAnimationLoop(null);let t=`GPU completion failed: ${e instanceof Error?e.message:String(e)}`;js=t,$.error=t,$.lastError=t,$.queue=l.stats(),ps.status(t),Ss({type:`pgmaps-engine-error`,message:t})},jt=()=>{if(ht||mt)return;let t=performance.now();if(te.update(),!l.allow(t,i.maxFps,i.maxInFlight))return;$.frames++,bt=bt?bt*.9+1e3/Math.max(1,t-Ct)*.1:60,Ct=t;let n=(t-Et)/1e3;kt(n,!0),Ge.render(P,X.x,X.y),Y.resolve(P,ut),T.setRenderTarget(null),Ke.render(),l.submitted(Nt.queue.onSubmittedWorkDone(),t,()=>performance.now(),At),$.renderOptions={...i},$.queue=l.stats(),$.rendererInfo={memory:{...T.info.memory},render:{...T.info.render}},$.frames===1?(d.lap(`firstFrame`),$.buildMs=Math.round(performance.now()-u),Ss({type:`pgmaps-engine-ready`})):vt&&Ss({type:`pgmaps-engine-ready`}),vt=!1,n-ft>.5&&!yt&&(ft=n,yt=K.readStats().then(t=>{if(yt=null,t&&!mt&&(ps.status(`${e.trees.count.toLocaleString()} stems, ${Se.length} tree types (${he.residual.lines.length-Se.length} species)\ndrawn: ${t.instances.toLocaleString()} as clusters, ${t.impostors.toLocaleString()} impostors, ${(t.splats??0).toLocaleString()} splats\ncrown width off by ${(he.residual.mean*100).toFixed(1)}% mean, ${(he.residual.p90*100).toFixed(1)}% p90`),$.ready=$.frames>10,n-pt>=1)){pt=n;let r=performance.now(),a=(l.completed-gt)*1e3/Math.max(1,r-_t);gt=l.completed,_t=r,Ss({type:`pgmaps-engine-stats`,completedFps:Math.round(a),drawn:t.instances+t.impostors+B.count,fps:Math.round(bt),clusters:t.instances,impostors:t.impostors,splats:t.splats??0,stems:e.trees.count,crownErrorMean:+he.residual.mean.toFixed(4),crownErrorP90:+he.residual.p90.toFixed(4),sun:ot,environment:R.skyReport(),renderOptions:i,queue:l.stats(),rendererInfo:$.rendererInfo,representation:{components:B.count,componentChunks:B.chunks,componentDraws:B.draws,componentChunkMeters:B.chunkMeters,binnedTrees:pe.naniteTrees.count,topology:`instanced dimensional envelopes / binned ez-tree`}})}},()=>yt=null))},Mt=Math.max(1,Number(ys.get(`captureFrames`)??24)),Nt=T.backend.device,It=T.backend,Rt=new we(1,1,{depthBuffer:!1}),Bt=e=>new M(e[0]/255,e[1]/255,e[2]/255),Ut=V(new M),Wt=e=>H(n.x.sub(e.west).div(e.east-e.west),n.z.add(e.north).div(e.north-e.south)),Gt=e=>e.x.greaterThanEqual(0).and(e.x.lessThanEqual(1)).and(e.y.greaterThanEqual(0)).and(e.y.lessThanEqual(1)),Kt=Wt(L.bounds),qt=L.farBounds,Jt=qt?Wt(qt):null,Yt=L.skylineBounds,Xt=Yt?Wt(Yt):null,Zt=()=>{let e=()=>new m(new Uint8Array(4),1,1),t=Z(e(),Kt),n=Jt?Z(e(),Jt):null,r=Xt?Z(e(),Xt):null,i=V(new M),a=new fe({fog:!1}),o=r&&Xt?_(Gt(Xt),r.rgb,i):i;a.colorNode=_(Gt(Kt),t.rgb,n&&Jt?_(Gt(Jt),n.rgb,o):o);let s=[],c=[{bounds:L.bounds},...n&&qt?[{bounds:qt,maxSide:4096,minTexel:2}]:[],...r&&Yt?[{bounds:Yt,maxSide:4096,minTexel:10}]:[]],l=null;return{material:a,set:(e,a)=>{let o=Sa(c,e,a);if(l?.key===o)return l.set;l=null;for(let e of s)e.dispose();s=[];let u=e=>{let t=new m(e.data,e.width,e.height);return t.magFilter=t.minFilter=Me,t.generateMipmaps=!1,t.needsUpdate=!0,s.push(t),t},d=c.map(t=>xa(t.bounds,e,a,t.maxSide,t.minTexel));return t.value=u(d[0]),i.value.copy(Bt(e)),n&&qt&&(n.value=u(d[1])),r&&Yt&&(r.value=u(d[d.length-1])),l={key:o,set:{cut:d[d.length-1].cut,rasters:d}},l.set},colour:a.colorNode,rest:i}},Qt=Zt(),$t=Zt();if(d.lap(`frameSetup`),z)try{q=await Ha({renderer:T,scene:e,plan:z,terrain:L,types:Se,atlas:We,extraTypes:he.extraTypes,snow:R.snow,grade:be,receivedShadow:()=>a(R.fadeShadow(Ne)),drape:{colour:Qt.colour,rest:Qt.rest,vegetation:Ue.u.classColour},cover:le.cover,viewYear:ue.viewYear}),O.add(q.group),q.setLook(ct.look??`via`),$e(),$.farForest=q.stats}catch(e){console.error(`far forest`,e),$.farForestError=e instanceof Error?e.message:String(e)}d.lap(`farForest`);let en=new fe({fog:!1,side:2});en.colorNode=Ut;let tn=ve?ve.group.children.filter(e=>e instanceof Qe):[],nn=new Float32Array(pe.naniteTrees.count?he.instances.a.length/2:0);for(let e=0;e<nn.length/2;e++)nn[e*2]=he.instances.a[e*4],nn[e*2+1]=-he.instances.a[e*4+2];let rn=(e.water??[]).filter(e=>e?.rings?.[0]?.length>=3).map(e=>{let t=e.rings[0].map(e=>e[0]),n=e.rings[0].map(e=>e[1]);return{rings:e.rings,box:[Math.min(...t),Math.min(...n),Math.max(...t),Math.max(...n)]}}),on=(e,t)=>rn.some(({rings:[n,...r],box:i})=>e>=i[0]&&t>=i[1]&&e<=i[2]&&t<=i[3]&&$a(e,t,n)&&!r.some(n=>$a(e,t,n))),sn=U.indexOf(`height`),cn=null;if(sn>=0)for(let e=0;e<Ee;e++)cn=Math.max(cn??0,W[e*U.length+sn]);let ln=e=>{let t=e===`zones`,n=n=>n===L.mesh||(n===K.group||n===B.group||n===q?.group)&&e===`screened`||n===ve?.group&&!t,r=O.children.filter(e=>e.visible&&!(e instanceof D)&&!n(e)),i={debug:K.u.debug.value,extinction:R.extinction.value,sun:R.sun.intensity,hemi:R.hemi.intensity,terrain:L.mesh.material,water:tn.map(e=>e.material),clear:T.getClearColor(new Pe),alpha:T.getClearAlpha()};for(let e of r)e.visible=!1;B.flat(!0),K.u.debug.value=7,q&&(q.u.flat.value=1),R.extinction.value=0,R.sun.intensity=R.hemi.intensity=0,L.mesh.material=t?$t.material:Qt.material;for(let e of tn)e.material=en;return T.setClearColor(0,0),()=>{for(let e of r)e.visible=!0;B.flat(!1),K.u.debug.value=i.debug,q&&(q.u.flat.value=0),R.extinction.value=i.extinction,R.sun.intensity=i.sun,R.hemi.intensity=i.hemi,L.mesh.material=i.terrain,tn.forEach((e,t)=>e.material=i.water[t]),T.setClearColor(i.clear,i.alpha)}},un=()=>Promise.race([Nt.queue.onSubmittedWorkDone(),new Promise(e=>setTimeout(e,2e3))]),dn=(e,t,n)=>{let r=new OffscreenCanvas(t,n);return r.getContext(`2d`).putImageData(new ImageData(e,t,n),0,0),r.convertToBlob({type:`image/png`})},fn=180/Math.PI,pn=async(e,t)=>{let n=T.readRenderTargetPixelsAsync(J,0,0,e,t),r=It.copyTextureToBuffer(J.depthTexture,0,0,e,t,0);return{halfs:await n,raw:await r}},mn=async(e,t,n,r=Mt,i=0)=>{let a=ba(e,t);P.position.set(...a.position),P.up.set(...a.up),P.lookAt(...a.target),P.fov=a.fov,P.aspect=a.aspect,P.updateProjectionMatrix(),P.updateMatrixWorld();let{width:o,height:s}=t;X.set(o,s),J.setSize(o,s),Rt.setSize(o,s),Y.size=new dt(o,s),Y.reset=!0;let c=performance.now(),l=0;for(let e=0;e<i+r;e++)e===i&&i&&(Y.reset=!0),l=(performance.now()-Et)/1e3,kt(l,!0),Ge.render(P,o,s),Y.resolve(P,ut),await un(),Hs.step();T.setRenderTarget(Rt),Ke.render(),T.setRenderTarget(null);let u=await T.readRenderTargetPixelsAsync(Rt,0,0,o,s),d=performance.now(),f=async(e,t)=>{let n=ln(e);try{for(let e=0;e<t;e++)kt(l,!1),await un();return await pn(o,s)}finally{n()}},p=await f(`screened`,2),m=performance.now(),h=await f(`ground`,1),g=n?await f(`zones`,1):null,_=performance.now(),v=Ta(p.raw,o,s,P.near,P.far,Ca(o,4,4)),y=Ea(p.halfs,o,s,v,Ca(o,8,2)),b=e=>Ea(e.halfs,o,s,Ta(e.raw,o,s,P.near,P.far,Ca(o,4,4)),Ca(o,8,2)),x=b(h),S=g?b(g):void 0,C=Da(u,o,s,4,Ca(o,4,1),new Uint8ClampedArray(o*s*4)),w=await dn(C,o,s),E=P.getWorldDirection(new M);return{frame:{width:o,height:s,image:w,classes:x,screened:y,depth:v,...S?{zones:S}:{},camera:{position:[P.position.x,-P.position.z,P.position.y],bearingDegrees:(Math.atan2(E.x,-E.z)*fn+360)%360,pitchDegrees:Math.asin(Math.max(-1,Math.min(1,E.y)))*fn,horizontalFovDegrees:2*Math.atan(Math.tan(P.fov/fn/2)*P.aspect)*fn,verticalFovDegrees:P.fov,near:P.near,far:P.far}},timing:{imageMs:Math.round(d-c),screenedMs:Math.round(m-d),bareMs:Math.round(_-m),readMs:Math.round(performance.now()-_)}}},hn=null,gn=e=>e.traverse(e=>{e instanceof Qe&&(e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>e.dispose()))}),_n=(e,t)=>an({fields:e.fields,species:e.species,count:e.count,radiusMeters:e.radiusMeters,bearings:e.bearings,eye:t,data:e.data}),vn=async(t,n)=>{let i=performance.now(),a=_n(t,n);if(Ls.capture.standKey=Math.round((performance.now()-i)*10)/10,hn?.key===a)return hn;hn&&(gn(hn.nanite.group),gn(hn.components.group)),hn=null;let o=Fs();Ls.finalStand=o.ms;let s=da(z?z.trees:e.trees,t,n,(e,t,n)=>e===`z`?L.heightAt(t,-n):e===`tone`?.5:NaN);o.lap(`merge`);let c=C?hi(s,C):{table:s,removed:0};o.lap(`thin`);let l=ti(c.table,f.rasters,y,t=>e.species?.[t]?.crownRatio).table;o.lap(`snags`),$.finalCoverRemoved=c.removed;let u=Pt({fields:l.fields,species:l.species,count:l.count,data:Array.from(l.data),ids:l.ids?Array.from(l.ids):void 0},r),d=await Jn({...e,trees:de(u.naniteTrees)},1);o.lap(`buildStand`);let{nanite:p}=await Be(d,Math.max(9e3,t.radiusMeters+1500,Ue.u.maxDist.value),o);p.setDepthSource(J.depthTexture,1);let m=new Float32Array(u.naniteTrees.count?d.instances.a.length/2:0);for(let e=0;e<m.length/2;e++)m[e*2]=d.instances.a[e*4],m[e*2+1]=-d.instances.a[e*4+2];return hn={key:a,nanite:p,components:u,stems:l.count,stemXY:m},o.lap(`finish`),hn},yn=e=>{e!==K&&(O.remove(K.group,B.group),B=e===Ue?pe:hn.components,O.add(B.group),B.culling(i.frustumCulling),K=e,O.add(K.group),$.nanite=K)},bn=Y.u,xn=null,Sn=e=>{let t=Cn(e),n=xn=t.then(()=>void 0,()=>void 0).then(()=>{xn===n&&(xn=null)});return t},Cn=async t=>{for(;!mt&&!ht&&$.frames<3;)await new Promise(e=>setTimeout(e,50));if(mt)throw Error(`The scene was replaced before the capture.`);if(ht)throw Error(js??`The GPU backend failed.`);T.setAnimationLoop(null),o=!0,await l.drain(),await yt?.catch(()=>void 0);let n={...i},r={position:P.position.clone(),quaternion:P.quaternion.clone(),up:P.up.clone(),fov:P.fov,aspect:P.aspect,size:X.clone(),taaSize:Y.size,prepass:Ue.leafPrepass.mode,impMin:it.value,impExact:Le.value,maxWeight:bn.maxWeight.value};i=Lt(t.renderOptions,i);let a={...i};$e();try{let n=t.final,r=Fs();Ls.capture=r.ms,Hs.begin(t.frames.length,n?hs+n.samples:Mt);let i=performance.now(),o=null;if(n){if(Ot=n.canopyCutoffPx,n.stand){let e=await vn(n.stand,[t.position[0],t.position[1]]);yn(e.nanite),q?.hide({eye:[t.position[0],t.position[1]],radius:n.stand.radiusMeters,bearings:n.stand.bearings})}R.setShadowHalf(vs),st=!0,Q(ct)}r.lap(`finalStand`);let s={position:P.position.clone(),quaternion:P.quaternion.clone(),up:P.up.clone(),fov:P.fov,aspect:P.aspect,size:X.clone(),taaSize:Y.size,prepass:K.leafPrepass.mode,impMin:it.value,impExact:Le.value,maxWeight:bn.maxWeight.value},{cut:c,rasters:l}=Qt.set(t.classes.terrain,t.classes.layers),u=t.zones?$t.set(t.zones.terrain,t.zones.layers).cut:[];r.lap(`classRasters`);let d=performance.now(),f=Na({stems:K===Ue?nn:hn.stemXY,rasters:l,terrain:t.classes.terrain,vegetation:t.classes.vegetation,layers:t.classes.layers,onWater:on});K.setInstanceClasses(f.rgb);let m=Na({stems:B.xy,rasters:l,terrain:t.classes.terrain,vegetation:t.classes.vegetation,layers:t.classes.layers,onWater:on});B.setClasses(m.rgb);for(let[e,t]of Object.entries(m.counts))f.counts[e]=(f.counts[e]??0)+t;q?.setClasses({rasters:l,terrain:t.classes.terrain,vegetation:t.classes.vegetation,layers:t.classes.layers,onWater:on}),$.lastStemClasses={counts:f.counts,ms:Math.round(performance.now()-d)},Ut.value.copy(Bt(t.classes.water)),K.u.classColour.value.copy(Bt(t.classes.vegetation)),r.lap(`stemClasses`);let g=[],_=[],v={drawn:0,invented:0,filled:0,far:0,beyondTrees:0},[y,b]=t.position,x=je(y,b),S={components:B.count,binnedTrees:B.naniteTrees.count,topology:`instanced dimensional envelopes / binned ez-tree`};try{K.leafPrepass.mode=!1,Le.value=1,it.value=.01,n&&(bn.maxWeight.value=Math.max(1,n.samples-1));for(let e of t.frames){let{frame:r,timing:i}=n?await mn(t.position,e,!!t.zones,n.samples,hs):await mn(t.position,e,!!t.zones);g.push(r),_.push(i),Oa(t.position,e,r.depth,4,(e,t)=>{v.drawn++;let n=L.ground.sourceAt(e,t);n===`invented`?v.invented++:n===`filled`?v.filled++:n===`farTerrain`&&v.far++,(x===null||Math.hypot(e-y,t-b)>x)&&v.beyondTrees++})}}finally{P.position.copy(s.position),P.quaternion.copy(s.quaternion),P.up.copy(s.up),P.fov=s.fov,P.aspect=s.aspect,P.updateProjectionMatrix(),P.updateMatrixWorld(),X.copy(s.size),J.setSize(X.x,X.y),Y.size=s.taaSize,Y.reset=!0,K.leafPrepass.mode=s.prepass,Le.value=s.impExact,it.value=s.impMin,K.setInstanceClasses(null),B.setClasses(null),q?.setClasses(null),bn.maxWeight.value=s.maxWeight,n&&(o={samples:n.samples,stems:K===Ue?pe.naniteTrees.count+B.count:hn.stems,canopyCutoffMeters:q?Math.round(q.cutoff()):null,millis:Math.round(performance.now()-i)},yn(Ue),q?.hide(null),R.setShadowHalf(null),Ot=void 0,st=!1,Q(ct)),r.lap(`frames`)}let C=L.ground.outer,{missing:w,missingDetail:T}=ja({seen:v,realGroundMeters:Math.max(0,Math.min(y-C.west,C.east-y,b-C.south,C.north-b)),farTerrain:!!L.farBounds,skylineTerrain:!!L.skylineBounds,treeReachMeters:x,stems:Ee,cut:c,zonesCut:u});return{type:`pgmaps-engine-capture`,engine:bs,id:t.id,version:ms,frames:g,scene:{createdAt:p??null,origin:h??null},environment:{...ct,...R.skyReport(),sun:ot},dissolve:{requestedPixels:n?.canopyCutoffPx??a.dissolvePixels,mode:a.dissolveMode,referenceHeight:a.dissolveReferenceHeight,cutoffMeters:q?.cutoff()??null,patchRadiusMeters:Ra,eyeOffsetMeters:Math.hypot(y-e.camera.position[0],b-e.camera.position[1]),guardMeters:90},renderOptions:a,canopyCutoffMeters:o?.canopyCutoffMeters??q?.cutoff()??null,representation:S,maxTreeHeightMeters:cn,missing:w,missingDetail:T,stemClasses:f.counts,timings:_,final:o}}finally{if(P.position.copy(r.position),P.quaternion.copy(r.quaternion),P.up.copy(r.up),P.fov=r.fov,P.aspect=r.aspect,P.updateProjectionMatrix(),P.updateMatrixWorld(),X.copy(r.size),J.setSize(X.x,X.y),Y.size=r.taaSize,Y.reset=!0,it.value=r.impMin,Le.value=r.impExact,bn.maxWeight.value=r.maxWeight,Ue.leafPrepass.mode=r.prepass,K.setInstanceClasses(null),B.setClasses(null),B.flat(!1),q?.setClasses(null),q&&(q.u.flat.value=0),Ot=void 0,yn(Ue),q?.hide(null),R.setShadowHalf(null),st=!1,i=n,o=!1,tt(Os),Q(ct),s){let e=s;s=null,re(e)}!mt&&!ht&&T.setAnimationLoop(jt)}};return $.capture=e=>Us(e),$.syntheticStand=(t,n=700)=>{let r=Math.min(...t.frames.map(e=>e.bearingDegrees-e.horizontalFovDegrees/2-2)),i=Math.max(...t.frames.map(e=>e.bearingDegrees+e.horizontalFovDegrees/2+2));return fa(e.trees,[t.position[0],t.position[1]],Number(ys.get(`standRadius`)??6500),[r,i],n)},T.setAnimationLoop(jt),{setEye:re,setEnvironment:Q,setRenderOptions:tt,capture:Sn,sameAs:(e,n)=>{let r=g(n,e.createdAt);return!ht&&r!==null&&r===y&&(n.look??`via`)===(t.look??`via`)},again:async e=>{await xn,p=e.createdAt,re(e.camera),Y.reset=!0,$.reused=(typeof $.reused==`number`?$.reused:0)+1,vt=!0},teardown:async()=>{mt=!0,T.setAnimationLoop(null),await yt?.catch(()=>void 0),at(),te.dispose(),await T.dispose(),ps.unmount(T.domElement)}}}async function qs(e){let t=async(e,t,n)=>{let r=new OffscreenCanvas(t,n);return r.getContext(`2d`).putImageData(new ImageData(e,t,n),0,0),URL.createObjectURL(await r.convertToBlob({type:`image/png`}))};return Promise.all(e.frames.map(async e=>{let{width:n,height:r,depth:i,classes:a}=e,o=new Uint8ClampedArray(n*r*4),s=0;for(let e of i)s=Math.max(s,e);for(let e=0;e<n*r;e++){let t=i[e]>0?255-230*Math.log(1+i[e])/Math.log(1+s):0;o.set([t,t,t,255],e*4)}let c=await createImageBitmap(e.image),l=new OffscreenCanvas(n,r).getContext(`2d`);l.drawImage(c,0,0);let u=l.getImageData(0,0,n,r),d=e=>a[e*4]<<16|a[e*4+1]<<8|a[e*4+2]|(a[e*4+3]?1<<24:0);for(let e=0;e<r;e++)for(let t=0;t<n;t++){let i=e*n+t;(t+1<n&&d(i)!==d(i+1)||e+1<r&&d(i)!==d(i+n))&&u.data.set([255,0,255,255],i*4)}return{image:URL.createObjectURL(e.image),classes:await t(new Uint8ClampedArray(a),n,r),depth:await t(o,n,r),overlay:await t(u.data,n,r)}}))}async function Js(){for(;!(Cs&&Ms&&globalThis.pgmaps?.ready);)await new Promise(e=>setTimeout(e,250));let e=Ms.camera,t=e.bearingDegrees*Math.PI/180,n=Number(ys.get(`captureAhead`)??150),r=e.position[0]+Math.sin(t)*n,i=e.position[1]+Math.cos(t)*n,a=[[r-100,i-100],[r+100,i-100],[r+100,i+100],[r-100,i+100]],o={type:`pgmaps-capture`,id:`capture-test-${Date.now().toString(36)}`,position:e.position,frames:[{bearingDegrees:e.bearingDegrees,pitchDegrees:e.pitchDegrees,horizontalFovDegrees:60,verticalFovDegrees:2*Math.atan(540/960*Math.tan(60*Math.PI/360))*180/Math.PI,width:960,height:540}],classes:{terrain:[96,96,96],layers:[{id:`test-square`,rgb:[0,90,255],polygons:[[a]]}],vegetation:[255,255,255],water:[255,128,0]}};try{let e=await Us(o),t=await qs(e);Object.assign(globalThis.pgmaps,{lastCaptureRequest:o,lastCapture:e,captureUrls:t}),console.info(`captureTest`,e.timings,t)}catch(e){console.error(e),Object.assign(globalThis.pgmaps,{lastCaptureError:e instanceof Error?e.message:String(e)})}}ys.has(`captureTest`)&&Js(),ps.expose({pgmapsCaptureUrls:qs}),ys.has(`scene`)||!xs?Ws().then(Rs,zs):(ps.status(`waiting for a scene from the parent page`),Ss({type:`pgmaps-engine-hello`,accepts:[...os]}));