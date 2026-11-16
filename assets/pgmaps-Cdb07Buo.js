import{$n as e,An as t,Bn as n,Bt as r,C as i,D as a,Dn as o,Dt as s,E as c,Et as l,Fn as u,Ft as d,G as f,Gn as p,Gt as m,In as h,It as g,Jn as _,Jt as v,Kn as y,Ln as b,Mn as x,Mt as S,N as C,On as w,Ot as T,Pn as E,Qn as D,Qt as O,Rt as k,Sn as A,T as j,Tt as M,U as N,Ut as ee,Vn as te,Vt as P,W as ne,Wn as F,Wt as re,X as I,Xn as ie,Xt as ae,Y as oe,Yn as se,Z as L,Zn as R,Zt as z,_ as ce,_n as le,_r as ue,_t as de,an as B,ar as fe,at as pe,b as me,bn as he,br as V,bt as ge,cr as _e,ct as ve,dn as H,dr as ye,en as be,er as xe,f as Se,fn as U,fr as Ce,ft as we,g as Te,gt as W,h as Ee,hn as De,hr as Oe,ht as ke,in as Ae,ir as je,it as Me,jn as Ne,jt as Pe,kn as Fe,l as Ie,ln as Le,lt as G,m as Re,mr as ze,mt as Be,n as Ve,nr as He,nt as K,on as Ue,ot as q,p as We,pn as J,pr as Ge,pt as Y,q as Ke,qn as qe,rn as Je,rr as Ye,sn as Xe,sr as Ze,t as Qe,tn as X,tr as $e,tt as et,u as tt,ur as nt,vn as rt,vr as it,vt as at,wn as ot,wt as Z,x as st,xr as ct,yn as lt,yr as ut,yt as dt,zn as Q,zt as ft}from"./nanite-lib-Bij3B-65.js";import{c as pt,d as mt,i as ht,l as gt,m as _t,n as vt,o as yt,r as bt,s as xt,t as St,u as Ct}from"./godrays-CLT9ppa5.js";import{t as wt}from"./OrbitControls-BThpa3Jw.js";var Tt=(e,t,n)=>({branch:{angle:{1:e},children:{0:110},gnarliness:{0:.03,1:.06}},leaves:{count:t,size:n,angle:22,sizeVariance:.25}}),Et={pine:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.92,.86,.8],leafTint:[.7,.78,1.05],options:Tt(98,16,2.4),seed:101},spruce:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.72,.68,.66],leafTint:[.5,.64,1.12],options:Tt(118,22,2.3),seed:202},fir:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.78,.78,.8],leafTint:[.42,.57,1.02],options:Tt(124,22,2.1),seed:303},douglasFir:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.8,.68,.6],leafTint:[.6,.72,.98],options:Tt(110,18,2.6),seed:404},aspen:{preset:`Aspen Large`,conifer:!1,bark:`birch`,leaf:`aspen`,barkTint:[.9,.95,.86],leafTint:[.4,.74,.82],options:{leaves:{count:22}},seed:505},birch:{preset:`Aspen Large`,conifer:!1,bark:`birch`,leaf:`ash`,barkTint:[1,1,1],leafTint:[.9,.9,.86],options:{branch:{angle:{1:38}},leaves:{count:24,size:2.6}},seed:606},snag:{preset:`Pine Large`,conifer:!0,bark:`pine`,leaf:`pine`,barkTint:[.36,.33,.37],leafTint:[.3,.3,.3],options:{branch:{angle:{1:96},children:{0:70},gnarliness:{0:.06,1:.25}},leaves:{count:0}},seed:707}},Dt=e=>Et[e]??Et.spruce,Ot=.08,kt=1.2,At=(kt/Ot)**(1/10),jt=Array.from({length:17},(e,t)=>t===10?kt:t>10?kt*At**(t-10):Ot*At**t);function Mt(e){if(!(e>0))return 0;let t=Math.round(Math.log(e/Ot)/Math.log(At));return Math.min(16,Math.max(0,t))}var Nt=e=>jt[e],Pt=(e,t)=>e+t*17;function Ft(e){let t=e.map(Mt);return{binOf:t,bins:[...new Set(t)].sort((e,t)=>e-t)}}function It(e){if(!e.length)return{mean:0,p90:0};let t=Float64Array.from(e).sort(),n=0;for(let e=0;e<t.length;e++)n+=t[e];return{mean:n/t.length,p90:t[Math.floor(t.length*.9)]??0}}function Lt(e){let t=e.length,n=0;for(let r=0;r<t;r++)e[r]>=n&&(n=e[r]+1);let r=new Uint32Array(n+1);for(let n=0;n<t;n++)r[e[n]+1]++;for(let e=0;e<n;e++)r[e+1]+=r[e];let i=new Uint32Array(t);for(let n=0;n<t;n++)i[r[e[n]]++]=n;return i}function Rt(e,t,n=.1){let r=Math.round(e/n)|0,i=Math.round(t/n)|0,a=2166136261^Math.imul(r,2654435761);return a=Math.imul(a^a>>>16,2246822507),a^=Math.imul(i,3266489909),a=Math.imul(a^a>>>13,668265263),(a^a>>>16)>>>0}function zt(e){let t=e>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Bt=new Float64Array(1),Vt=new Uint32Array(Bt.buffer),Ht={Null:1,Undefined:2,True:3,False:4,Number:5,Numbers:6,String:7,Array:8,Object:9,Typed:10,Other:11};function Ut(e){let t=2654435769,n=2246822507,r=3266489909,i=668265263,a=(e,a)=>{t=Math.imul(t^e,2654435761),t^=t>>>15,n=Math.imul(n^a,2246822519),n^=n>>>13,r=Math.imul(r^e,3266489917),r^=r>>>16,i=Math.imul(i^a,668265263),i^=i>>>14},o=e=>{a(Ht.String,e.length);for(let t=0;t+1<e.length;t+=2)a(e.charCodeAt(t),e.charCodeAt(t+1));e.length&1&&a(e.charCodeAt(e.length-1),1540483477)},s=e=>{a(Ht.Typed,e.byteLength),o(Object.prototype.toString.call(e));let s=e.byteLength>>>2,c=e.byteOffset%4==0?new Uint32Array(e.buffer,e.byteOffset,s):new Uint32Array(new Uint8Array(e.buffer,e.byteOffset,s*4).slice().buffer),l=t,u=n,d=r,f=i,p=0;for(;p+1<s;p+=2){let e=c[p],t=c[p+1];l=Math.imul(l^e,2654435761),l^=l>>>15,u=Math.imul(u^t,2246822519),u^=u>>>13,d=Math.imul(d^e,3266489917),d^=d>>>16,f=Math.imul(f^t,668265263),f^=f>>>14}t=l,n=u,r=d,i=f,p<s&&a(c[p],1540483477);let m=new Uint8Array(e.buffer,e.byteOffset+s*4,e.byteLength-s*4);for(let e of m)a(e,374761393)},c=e=>{if(typeof e==`number`)a(Ht.Number,0),Bt[0]=e,a(Vt[0],Vt[1]);else if(e===null)a(Ht.Null,0);else if(e===void 0)a(Ht.Undefined,0);else if(typeof e==`string`)o(e);else if(typeof e==`boolean`)a(e?Ht.True:Ht.False,0);else if(Array.isArray(e)){let t=e.length;a(Ht.Array,t);for(let n=0;n<t;){if(typeof e[n]!=`number`){c(e[n++]);continue}let r=n+1;for(;r<t&&typeof e[r]==`number`;)r++;for(a(Ht.Numbers,r-n);n<r;n++)Bt[0]=e[n],a(Vt[0],Vt[1])}}else if(ArrayBuffer.isView(e))s(e);else if(e instanceof ArrayBuffer)s(new Uint8Array(e));else if(typeof e==`object`){let t=Object.keys(e);a(Ht.Object,t.length);for(let n of t)o(n),c(e[n])}else a(Ht.Other,0),o(String(e))};c(e);let l=e=>(e^=e>>>16,e=Math.imul(e,2246822507),e^=e>>>13,e=Math.imul(e,3266489909),e^e>>>16);t=l(t),n=l(n^t),r=l(r^n),i=l(i^r),t=l(t^i);let u=e=>(e>>>0).toString(16).padStart(8,`0`);return u(t)+u(n)+u(r)+u(i)}function Wt(e){return Ut({...e,createdAt:void 0})}var Gt=419430400;function Kt(e,t){try{let n=JSON.parse(e).packages?.[`node_modules/${t}`];return!n||typeof n.version!=`string`||!n.version?null:typeof n.integrity==`string`&&n.integrity?`${n.version} ${n.integrity}`:n.version}catch{return null}}function qt(e){return!e.ezTree||!e.meshoptimizer||!e.engine?null:JSON.stringify({format:e.format??1,grow:e.grow??1,engine:e.engine,ezTree:e.ezTree,meshoptimizer:e.meshoptimizer})}function Jt(e,t){let{look:n,seed:r,height:i,ratio:a,crownBase:o,leafMask:s}=t;return`${e}\n${JSON.stringify({look:n,seed:r,height:i,ratio:a,crownBase:o})}\n${s?Ut([s.size,s.bits]):`no mask`}`}function Yt(e,t=``){let n=[];for(let r of Object.keys(e).sort()){let i=e[r],a=t?`${t}.${r}`:r;ArrayBuffer.isView(i)?n.push([a,i]):i&&typeof i==`object`&&n.push(...Yt(i,a))}return n}function Xt(e){return Yt(e).reduce((e,[,t])=>e+t.byteLength,0)}function Zt(e){let t=(e,n)=>{let r={};for(let i of Object.keys(e).sort()){if(i===`ms`||n&&i===`id`)continue;let a=e[i];r[i]=a&&typeof a==`object`&&!ArrayBuffer.isView(a)&&!Array.isArray(a)?t(a,!1):a}return r};return Ut(t(e,!0))}function Qt(e,t,n,r=Gt,i=new Set){let a=e.filter(e=>e.namespace!==t).map(e=>e.key),o=e.filter(e=>e.namespace===t).sort((e,t)=>e.at-t.at||(e.key<t.key?-1:1)),s=o.reduce((e,t)=>e+t.bytes,0)+n;for(let e of o){if(s<=r)break;i.has(e.key)||(a.push(e.key),s-=e.bytes)}return a}var $t=`pgmaps-tree-cache`,en=`entries`,tn=`trees`,nn=e=>new Promise((t,n)=>{e.onsuccess=()=>t(e.result),e.onerror=()=>n(e.error??Error(`IndexedDB request failed`))}),rn=e=>new Promise((t,n)=>{e.oncomplete=()=>t(),e.onerror=e.onabort=()=>n(e.error??Error(`IndexedDB transaction failed`))});function an(){try{indexedDB.deleteDatabase($t)}catch{}}async function on(e,t=Gt){let n,r=new Map;try{let e=indexedDB.open($t,1);e.onupgradeneeded=()=>{e.result.createObjectStore(en,{keyPath:`key`}),e.result.createObjectStore(tn)},n=await nn(e);for(let e of await nn(n.transaction(en).objectStore(en).getAll()))r.set(e.key,e)}catch{return null}let i={hits:0,misses:0,writes:0,evicted:0},a=null,o=new Set,s=e=>{a=e instanceof Error?e.message:String(e)},c=async e=>{if(!e.length)return;let t=n.transaction([en,tn],`readwrite`,{durability:`relaxed`});for(let n of e)t.objectStore(en).delete(n),t.objectStore(tn).delete(n);await rn(t);for(let t of e)r.delete(t);i.evicted+=e.length};try{await c(Qt([...r.values()],e,0,t))}catch(e){return s(e),null}let l=Promise.resolve();return{entry:e=>a?void 0:r.get(e),async read(e){let t=r.get(e);if(a||!t)return null;try{o.add(e);let r=await nn(n.transaction(tn).objectStore(tn).get(e));if(!r)return i.misses++,null;i.hits++,t.at=Date.now();try{n.transaction(en,`readwrite`,{durability:`relaxed`}).objectStore(en).put(t)}catch{}return r}catch(e){return s(e),null}},write(u,d){if(a)return Promise.resolve(!1);let f=l.then(async()=>{if(a)return!1;try{let a={key:u,namespace:e,bytes:Xt(d),at:Date.now(),digest:Zt(d)};o.add(u),await c(Qt([...r.values()].filter(e=>e.key!==u),e,a.bytes,t,o));let s=a.bytes;for(let e of r.values())e.key!==u&&(s+=e.bytes);if(s>t)return!1;let l=n.transaction([en,tn],`readwrite`,{durability:`relaxed`});return l.objectStore(en).put(a),l.objectStore(tn).put(d,u),await rn(l),r.set(u,a),i.writes++,!0}catch(e){return s(e),!1}});return l=f,f},async clear(){try{let e=n.transaction([en,tn],`readwrite`,{durability:`relaxed`});return e.objectStore(en).clear(),e.objectStore(tn).clear(),await rn(e),r.clear(),!0}catch(e){return s(e),!1}},stats:()=>{let n=[...r.values()].filter(t=>t.namespace===e);return{entries:n.length,bytes:n.reduce((e,t)=>e+t.bytes,0),capBytes:t,otherNamespaces:r.size-n.length,...i,failed:a}}}}var sn=`{
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
`,cn=`../textures/`,ln=1024,un=new Map,dn=(e,t)=>{let n=un.get(e);return n||un.set(e,n=yt(e,ln,t)),n},fn=e=>dn(`${cn}${e}_color_1k.jpg`,!1),pn=e=>dn(`${cn}${e}_color.png`,!0);function mn(e,[t,n,r]){let i=new Uint8ClampedArray(e.px);for(let e=0;e<i.length;e+=4)i[e]*=t,i[e+1]*=n,i[e+2]*=r;return{px:i,alphaScales:e.alphaScales,mask:e.mask}}var hn=Math.max(2,Math.min(6,(navigator.hardwareConcurrency||4)-1)),gn=0,_n=[];async function vn(e){gn>=hn?await new Promise(e=>_n.push(e)):gn++;try{return await e()}finally{let e=_n.shift();e?e():gn--}}var yn=3e4,bn=[],xn,Sn={spawned:0,jobs:0};function Cn(e,t){return vn(()=>new Promise((n,r)=>{let i=bn.pop();i||(i=new Worker(new URL(new URL(`tree-worker-BsWUkgJp.js`,import.meta.url).href,``+import.meta.url),{type:`module`}),Sn.spawned++),Sn.jobs++;let a=i;a.onmessage=e=>{a.onmessage=a.onerror=null,bn.push(a),clearTimeout(xn),xn=setTimeout(()=>bn.splice(0).forEach(e=>e.terminate()),yn),n(e.data)},a.onerror=e=>(a.terminate(),r(Error(`tree worker: ${e.message}`))),a.postMessage({...e,id:t})}))}var wn=new URLSearchParams(location.search).get(`treecache`)===`1`;wn||an();var Tn=null,En=null,Dn=()=>En??=(async()=>wn?(Tn=qt({engine:`1.0.0+5327a8f`,ezTree:Kt(sn,`@dgreenheck/ez-tree`),meshoptimizer:Kt(sn,`meshoptimizer`)}),Tn?on(Tn):null):null)().catch(()=>null),On=new Map;async function kn(e,t){let n=await Dn();if(!n||!Tn)return Cn(e,t);let r=Jt(Tn,e),i=e=>(`error`in e||n.write(r,e),e),a=n.entry(r);if(!a)return i(await Cn(e,t));let o=e.look.conifer,s=On.get(o);if(!s){let r=Cn(e,t);s=r.then(async e=>`error`in e?!1:Zt(e)===a.digest||(console.warn(`pgmaps trees: a cached tree no longer matches its growth (bump GROW_VERSION in tree-cache-key.ts); the cache is emptied`),await n.clear(),!1),()=>!1),On.set(o,s);let c=await r;return await s?c:i(c)}if(await s){let e=await n.read(r);if(e)return e}return i(await Cn(e,t))}var An=new Map;function jn(e,t){let n=JSON.stringify({...e,leafMask:null}),r=An.get(n);return r||(r=kn(e,t),An.set(n,r),r.then(e=>`error`in e&&An.delete(n),()=>An.delete(n))),r}Object.assign(globalThis,{pgmapsTrees:{stats:async()=>({cache:wn,pool:{...Sn,idle:bn.length},store:(await Dn())?.stats()??null,namespace:Tn}),clear:async()=>(await Dn())?.clear()??!1,replies:()=>Promise.all([...An].map(async([e,t])=>[e,await t]))}});var Mn=e=>{let t=Ue(e,`float`);return e=>t.element(Ae(e))};async function Nn(e,t,n=[]){let r=performance.now(),{fields:i,data:a,count:o}=e.trees,s=i.length,c=Object.fromEntries([`x`,`y`,`z`,`species`,`height`,`crownWidth`,`tone`].map(e=>[e,i.indexOf(e)]));if(c.x<0||c.y<0||c.z<0||c.species<0||c.height<0)throw Error(`The package's trees lack x, y, z, species or height.`);let l=new Map;for(let e=0;e<o;e++){let t=a[e*s+c.species];l.has(t)||l.set(t,[]),l.get(t).push(e)}for(let e of n)l.has(e.species)||l.set(e.species,[]);let u=[...l.keys()].sort((e,t)=>e-t),d=new Map,f=u.map(t=>e.trees.species[t]??`spruce`),p=[],m=new Int32Array(o),h=new Float64Array(o),g=[];for(let[t,r]of u.entries()){let i=f[t],o=Dt(i),u=e.species?.[i],_=l.get(r),v=_.map(e=>{let t=e*s,n=c.crownWidth>=0?a[t+c.crownWidth]:NaN;return Number.isFinite(n)&&n>0?n/Math.max(1,a[t+c.height]):u?.crownRatio??.25}),y=Ft(v),{binOf:b}=y,x=n.filter(e=>e.species===r).map(e=>Mt(e.ratio)),S=[...new Set([...y.bins,...x])].sort((e,t)=>e-t),C=(await pn(o.leaf)).mask,w=new Map;for(let e of S)w.set(e,p.length),p.push({job:{look:o,seed:Pt(o.seed,e),height:20,ratio:Nt(e),crownBase:u?.crownBase??null,leafMask:C},species:r,layer:t,bin:e});x.length&&d.set(r,[...new Set(x)].map(e=>w.get(e))),_.forEach((e,t)=>{m[e]=w.get(b[t]),h[e]=v[t]}),g.push(`${i}: ${_.length} stems, crown/height rungs ${S.map(e=>`${e}:${Nt(e).toFixed(2)}`).join(` / `)}`)}let _=await Promise.all(p.map(({job:e},t)=>jn(e,t))),v=_.map((e,t)=>{if(`error`in e)throw Error(`growing ${f[p[t].layer]}: ${e.error}`);let{src:n,radius:r,height:i}=e;return{...e,id:t,name:`${f[p[t].layer]}-${t}`,radius:r,height:i,src:n}});_.forEach((e,t)=>{`error`in e||g.push(`  type ${t}: rung ${p[t].bin} ratio ${p[t].job.ratio.toFixed(2)} grown ${e.grown.toFixed(2)} (x${e.squash.toFixed(2)} across), ${(e.idx.length/3).toLocaleString()} tris, ${Math.round(e.ms)} ms`)});let y=_.map((e,t)=>`error`in e?p[t].job.ratio:e.grown*e.squash),b=new Float64Array(o);for(let e=0;e<o;e++)b[e]=Math.abs(h[e]/y[m[e]]-1);let x=Lt(m),S=new Float32Array(o*4),C=new Float32Array(o*4);for(let e=0;e<o;e++){let t=x[e],n=t*s,r=e*4,i=Math.sin(a[n+c.x]*12.9898+a[n+c.y]*78.233)*43758.5453%1*Math.PI*2,o=c.tone>=0?a[n+c.tone]:.5;S[r]=a[n+c.x],S[r+1]=a[n+c.z],S[r+2]=-a[n+c.y],S[r+3]=a[n+c.height]/20,C[r]=Math.cos(i),C[r+1]=Math.sin(i),C[r+2]=m[t],C[r+3]=Number.isFinite(o)?o:.5}let w=await ht(f.map(async e=>mn(await fn(Dt(e).bark),Dt(e).barkTint)),ln),T=await ht(f.map(async e=>mn(await pn(Dt(e).leaf),Dt(e).leafTint)),ln);w.colorSpace=T.colorSpace=Ce,T.wrapS=T.wrapT=Fe;let E=p.map(e=>e.layer),D={bark:w,leaf:T,barkLayerOf:Mn(E),leafLayerOf:Mn(E),alphaToCoverage:t>1,leafDither:t===1&&ce},O=null,k=()=>O??=It(b);return{types:v,instances:{a:S,b:C},textures:D,barkLayers:E,leafLayers:E,residual:{get mean(){return k().mean},get p90(){return k().p90},lines:g},growMs:performance.now()-r,extraTypes:d}}var Pn=[.35,.6,.85],Fn=1e3,In=.35;function Ln(e){let t=t=>e.indexOf(t);return{x:t(`x`),y:t(`y`),z:t(`z`),species:t(`species`),height:t(`height`),crownWidth:t(`crownWidth`),tone:t(`tone`),stride:e.length}}function Rn(e,t,n=()=>void 0){let r=Ln(e.fields);if(r.crownWidth<0||r.height<0)return!1;let i=t*r.stride,a=e.data[i+r.crownWidth],o=e.data[i+r.height];if(!(a>0&&o>0))return!1;let s=n(e.species[e.data[i+r.species]]??``)??.2;return a/o>Math.max(1,4*s)}function zn(e,t={}){let n=t.cell??30,r=Ln(e.fields);if(r.x<0||r.y<0||r.height<0||r.species<0)return null;let i=t.extent?.west??1/0,a=t.extent?.south??1/0,o=t.extent?.east??-1/0,s=t.extent?.north??-1/0,c=!!t.extent,l=new Uint8Array(e.count),[u,d]=t.eye??[0,0],f=0,p=new Float64Array(e.species.length),m=[];for(let n=0;n<e.count;n++){let h=n*r.stride,g=e.data[h+r.species];if(g>=0&&g<p.length&&!t.notCommon?.(e.species[g]??``)&&p[g]++,m.push(e.data[h+r.height]),!Rn(e,n,t.speciesRatio)){f=Math.max(f,Math.hypot(e.data[h+r.x]-u,e.data[h+r.y]-d));continue}if(l[n]=1,c=!0,t.extent)continue;let _=e.data[h+r.crownWidth]/2;i=Math.min(i,e.data[h+r.x]-_),o=Math.max(o,e.data[h+r.x]+_),a=Math.min(a,e.data[h+r.y]-_),s=Math.max(s,e.data[h+r.y]+_)}if(!c)return null;i=Math.floor(i/n)*n,a=Math.floor(a/n)*n;let h=Math.max(1,Math.ceil((o-i)/n)),g=Math.max(1,Math.ceil((s-a)/n)),_=h*g,v=e.species.length,y=new Float64Array(_),b=new Float64Array(_),x=new Float64Array(_),S=new Float32Array(_*v),C=new Uint8Array(_),w=new Uint8Array(_);for(let t=0;t<e.count;t++){let o=t*r.stride,s=e.data[o+r.x],c=e.data[o+r.y],u=e.data[o+r.height],d=(r.crownWidth>=0&&e.data[o+r.crownWidth]>0?e.data[o+r.crownWidth]:u*.2)/2,f=e.data[o+r.species],p=Math.floor((s-d-i)/n),m=Math.floor((s+d-i)/n),_=Math.floor((c-d-a)/n),T=Math.floor((c+d-a)/n),E=Math.PI*d*d;for(let e=Math.max(0,_);e<=Math.min(g-1,T);e++)for(let r=Math.max(0,p);r<=Math.min(h-1,m);r++){let o=p===m&&_===T?1:Bn(s,c,d,i+r*n,a+e*n,n);if(o<=0)continue;let g=e*h+r,D=E*o;y[g]+=u*D,b[g]+=D,x[g]+=D,f>=0&&f<v&&(S[g*v+f]+=D),w[g]=1,l[t]&&(C[g]=1)}}let T=new Float32Array(_),E=new Float32Array(_);for(let e=0;e<_;e++){T[e]=b[e]>0?y[e]/b[e]:NaN,E[e]=Math.min(1,x[e]/(n*n));let t=0;for(let n=0;n<v;n++)t+=S[e*v+n];if(t>0)for(let n=0;n<v;n++)S[e*v+n]/=t}let D=0;p.forEach((e,t)=>e>p[D]&&(D=t)),m.sort((e,t)=>e-t);let O=m.length?m[Math.floor(m.length/2)]:22;return{west:i,south:a,cell:n,columns:h,rows:g,height:T,crownShare:E,shares:S,aggregate:C,touched:w,species:e.species,realReach:f,commonSpecies:D,medianHeight:O}}function Bn(e,t,n,r,i,a){let o=0,s=0;for(let c=0;c<4;c++)for(let l=0;l<4;l++){let u=e-n+(c+.5)/4*2*n,d=t-n+(l+.5)/4*2*n;(u-e)**2+(d-t)**2>n*n||(s++,u>=r&&u<r+a&&d>=i&&d<i+a&&o++)}return s?o/s:0}function Vn(e,t,n=0){let r=Math.imul(e|0,668265261)^Math.imul(t|0,374761393)^Math.imul(n|0,2654435761);return r=Math.imul(r^r>>>15,2246822507),r=Math.imul(r^r>>>13,3266489909),((r^r>>>16)>>>0)/4294967296}function Hn(e,t,n,r={}){let i=[[],[],[]],a=e.species.length,[o,s]=r.eye??[0,0],c=r.maxReach??1/0;for(let l=0;l<e.rows;l++)for(let u=0;u<e.columns;u++){let d=l*e.columns+u,f=e.west+(u+.5+(Vn(u,l,1)-.5)*.4)*e.cell,p=e.south+(l+.5+(Vn(u,l,2)-.5)*.4)*e.cell,m=Math.hypot(f-o,p-s);if(m>c)continue;let h=!e.touched[d]&&m>e.realReach+e.cell;if(!e.aggregate[d]&&!h)continue;let g=(n(f,p)??(e.touched[d]?e.crownShare[d]:0))*(r.keepAt?.(f,p)??1);if(!(g>=.08))continue;let _=e.commonSpecies,v=0;for(let t=0;t<a;t++)e.shares[d*a+t]>v&&(v=e.shares[d*a+t],_=t);let y=Number.isFinite(e.height[d])?e.height[d]:e.medianHeight,b=t(f,p),x=e.cell/4,S=(t(f+x,p)-t(f-x,p))/(2*x),C=(t(f,p+x)-t(f,p-x))/(2*x);Number.isFinite(b)&&(i[0].push(f,p,b,y),i[1].push(Number.isFinite(S)?S:0,Number.isFinite(C)?C:0,Math.min(1,g),_),i[2].push(Vn(u,l,3),0,0,0))}return{count:i[0].length/4,a:Float32Array.from(i[0]),b:Float32Array.from(i[1]),c:Float32Array.from(i[2])}}function Un(e,t){let n=Math.min(.97,Math.max(0,e)),r=Math.PI*t*t/4;return Math.max(0,Math.min(Fn,-Math.log(1-n)/r*1e4))}var Wn=(e,t,n)=>n*t/Math.max(.5,e),Gn=(e,t)=>e/2/Math.tan(t*Math.PI/360),Kn={pine:[.06,.085,.04],spruce:[.04,.065,.045],fir:[.035,.058,.042],douglasFir:[.05,.072,.045],aspen:[.075,.11,.05],birch:[.08,.11,.055]},qn={via:{chroma:.3,tint:[1,1,.98]},photo:{chroma:.22,tint:[.95,1,1.1]}};function Jn(e){let t=e.filter(e=>!!e);return(e,n)=>{for(let r of t){let t=(e-r.west)/r.spacing,i=(n-r.south)/r.spacing;if(t<0||i<0||t>r.columns-1||i>r.rows-1)continue;let a=Math.min(r.columns-2,Math.floor(t)),o=Math.min(r.rows-2,Math.floor(i)),s=t-a,c=i-o,l=0,u=0;for(let[e,t,n]of[[0,0,(1-s)*(1-c)],[1,0,s*(1-c)],[0,1,(1-s)*c],[1,1,s*c]]){let i=(o+t)*r.columns+a+e;!r.known[i]||n<=0||(l+=r.closure[i]*n,u+=n)}if(u>1e-6)return l/u}return null}}function Yn(e,t,n,r,i={}){let a=Math.max(i.cell??120,Math.max(e.east-e.west,e.north-e.south)/(i.maxSide??1024)),o=Math.max(2,Math.ceil((e.east-e.west)/a)),s=Math.max(2,Math.ceil((e.north-e.south)/a)),c=new Float32Array(o*s*4),l=new Float32Array(o*s*4),u=i.medianHeight??n?.medianHeight??22,d=i.commonSpecies??n?.commonSpecies??0,f=n?.species.length??0,p=Array.from({length:Math.max(f,d+1)},(e,t)=>r(t));for(let r=0;r<s;r++)for(let s=0;s<o;s++){let m=r*o+s,h=e.west+(s+.5)*a,g=e.south+(r+.5)*a,_=t(h,g),v=u,y=p[d];if(n){let e=Math.floor((h-n.west)/n.cell),t=Math.floor((g-n.south)/n.cell);if(e>=0&&t>=0&&e<n.columns&&t<n.rows){let r=t*n.columns+e;if(n.touched[r]){Number.isFinite(n.height[r])&&(v=n.height[r]);let e=[0,0,0];for(let t=0;t<f;t++){let i=n.shares[r*f+t];if(i>0)for(let n=0;n<3;n++)e[n]+=p[t][n]*i}e[0]+e[1]+e[2]>0&&(y=e)}}}c.set([(_??i.unknownClosure??.55)*(i.keepAt?.(h,g)??1),v,_===null?0:1,1],m*4),l.set([y[0],y[1],y[2],1],m*4)}return{west:e.west,south:e.south,cell:a,columns:o,rows:s,stand:c,colour:l}}var Xn=[0,5,11,20,35],Zn=384,Qn=256,$n=3,er=4,tr=Math.PI/180,nr=Number(new URLSearchParams(location.search).get(`patchcut`)??.42),rr=Number(new URLSearchParams(location.search).get(`patchacross`)??.35),ir=Number(new URLSearchParams(location.search).get(`patchupdown`)??1.4),ar=e=>{let t=e>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}};async function or(e,r,i,a,o){let s=Math.max(1,a.length)*Pn.length,c=s*Xn.length,u=Math.max(1,Math.min(c,Math.floor(8192/Zn))),d=Math.ceil(c/u),p=()=>new nt(u*Zn,d*Qn,{type:it,generateMipmaps:!0,minFilter:D,magFilter:R,depthBuffer:!0}),m=p(),h=p(),_=Xn.map(e=>$n+30*Math.sin(e*tr)+22*1.35*Math.cos(e*tr)+2),v=Array.from({length:o},()=>0);a.forEach((e,t)=>v[e.species]=t);let y=r.views,b=We(y),x=(e,t)=>{let n=t*y+r.viewBase.array[e],i=Math.floor(n/b.cols);return{u0:(n-i*b.cols)/b.cols,v0:i/b.rows,du:1/b.cols,dv:1/b.rows}},S=new le,C=new le,E=et(`uv`,`vec2`),O=et(`shade`,`vec2`),k=e=>ne(()=>{let t=X(r.texture,E);return f(t.a.lessThan(.5),()=>N()),e})();{let e=X(r.texture,E),t=T(W(.86),W(1),z(.05,.9,O.y));S.colorNode=k(J(q(e.rgb.div(l(e.a,.001)).mul(O.x).mul(t).mul(er),0,1),1));let n=X(r.normals,E);C.colorNode=k(J(g(n.xyz.add(U(0,0,1e-4))).mul(.5).add(.5),1))}let A={target:e.getRenderTarget(),clear:e.getClearColor(new t),alpha:e.getClearAlpha(),auto:e.autoClear,tone:e.toneMapping};e.toneMapping=0,e.setClearColor(0,0);for(let t of[m,h])e.setRenderTarget(t),e.clear();e.autoClear=!1;let j=new Ge;a.forEach((t,a)=>{Pn.forEach((o,s)=>{let c=Un(o,t.crownWidth),l=Math.max(1,Math.round(c*30*30/1e4)),d=Math.ceil(Math.sqrt(l)),f=30/d,p=ar(1e3+t.species*31+s*7),g=[],v=Array.from({length:d*d},(e,t)=>t).sort(()=>p()-.5).slice(0,l);for(let e of v){let n=(e%d+.15+.7*p())*f,r=(Math.floor(e/d)+.15+.7*p())*f,a=t.types[Math.floor(p()*t.types.length)]??0,o=22*(.72+.5*p());g.push({x:n,d:r,s:o/i[a].height,type:a,tint:.62+.7*p()})}Xn.forEach((t,i)=>{let o=Math.cos(t*tr),c=Math.sin(t*tr),l=+(t>=15),d=[],f=[],p=[],v=[];for(let e of g){let t=r.frames[e.type],n=t.w*e.s,i=t.h*e.s,a=i/2*o+e.d*c;for(let t of[0,-30,30]){let r=e.x+t;if(r+n/2<0||r-n/2>30)continue;let{u0:o,v0:s,du:c,dv:u}=x(e.type,l),m=d.length/3,h=-e.d;for(let[t,l]of[[0,0],[1,0],[1,1],[0,1]])d.push(r+(t-.5)*n,a+(l-.5)*i,h),f.push(o+t*c,s+(1-l)*u),p.push(e.tint,l*.9+e.d/30*.1);v.push(m,m+1,m+2,m,m+2,m+3)}}let y=new w;y.setAttribute(`position`,new n(d,3)),y.setAttribute(`uv`,new n(f,2)),y.setAttribute(`shade`,new n(p,2)),y.setIndex(v);let b=new Ye(0,30,_[i]-$n,-3,-1,40);b.position.set(0,0,1),b.updateMatrixWorld();let T=(a*Pn.length+s)*Xn.length+i,E=T%u,D=Math.floor(T/u);for(let[t,n]of[[m,S],[h,C]]){let r=new $e(y,n);r.frustumCulled=!1,j.add(r),e.setRenderTarget(t),t.viewport.set(E*Zn,D*Qn,Zn,Qn),t.scissor.set(E*Zn,D*Qn,Zn,Qn),t.scissorTest=!0,e.clearDepth(),e.render(j,b),j.remove(r)}y.dispose()})})});for(let e of[m,h])e.scissorTest=!1,e.viewport.set(0,0,u*Zn,d*Qn);e.autoClear=A.auto,e.toneMapping=A.tone,e.setRenderTarget(A.target),e.setClearColor(A.clear,A.alpha),S.dispose(),C.dispose();let M=Array.from({length:o},()=>null);try{let t=await e.readRenderTargetPixelsAsync(m,0,0,u*Zn,d*Qn),n=u*Zn*4;a.forEach((e,r)=>{let i=(r*Pn.length+1)*Xn.length+1,a=i%u,o=Math.floor(i/u),s=0,c=0,l=0,d=0;for(let e=o*Qn;e<(o+1)*Qn;e++)for(let r=a*Zn;r<(a+1)*Zn;r++){let i=e*n+r*4;t[i+3]<128||(s+=t[i],c+=t[i+1],l+=t[i+2],d++)}d&&(M[e.species]=[s/d/255/er,c/d/255/er,l/d/255/er])})}catch{}return{albedo:m,normals:h,cols:u,rows:d,frameH:_,slotOf:v,variants:s,meanAlbedo:M,dispose:()=>(m.dispose(),h.dispose())}}var sr=()=>({chroma:B(.4),tint:B(new V(1,1,1))});function cr(e,t=sr()){return{cutoff:B(4e3),band:B(.2),chroma:t.chroma,tint:t.tint,flat:B(0),hide:B(new ct(0,0,0,0)),hideSpan:B(new ut(0,360)),snow:e}}var lr=(e,t)=>{let n=Y(e,U(.2126,.7152,.0722));return T(U(n,n,n),e,t.chroma).mul(t.tint)},ur=(e,t)=>z(t.cutoff,t.cutoff.mul(t.band.add(1)),e),dr=e=>v(e.flat.greaterThan(.5),W(.5),me()),fr=(e,t,n)=>{let r=e.sub(n.hide.x),i=t.sub(n.hide.y),a=L(r,i).div(tr),o=dt(a.sub(n.hideSpan.x).div(360)).mul(360);return n.hide.z.greaterThan(0).and(r.mul(r).add(i.mul(i)).lessThan(n.hide.z.mul(n.hide.z))).and(o.lessThanEqual(n.hideSpan.y))};function pr(e,t,r,i){let a=new _;a.setAttribute(`position`,new n([0,0,0,1,0,0,1,1,0,0,1,0],3)),a.setIndex([0,1,2,0,2,3]),a.setAttribute(`pA`,new qe(e.a,4)),a.setAttribute(`pB`,new qe(e.b,4)),a.setAttribute(`pC`,new qe(e.c,4));let o=new qe(new Float32Array(e.count*4),4);a.setAttribute(`pClass`,o),a.instanceCount=e.count;let c=et(`pA`,`vec4`),u=et(`pB`,`vec4`),d=et(`pC`,`vec4`),f=et(`pClass`,`vec4`),p=Ue(t.frameH,`float`),h=Ue(t.slotOf.length?t.slotOf:[0],`float`),y=Xn.length,b=Pn.length,x=Le(W(0),`vPatchU`),S=Le(W(0),`vPatchV`),w=Le(J(0),`vPatchInfo`).setInterpolation(`flat`),E=Le(J(0),`vPatchSeed`).setInterpolation(`flat`),D=Le(U(0),`vPatchRight`).setInterpolation(`flat`),O=Le(U(0),`vPatchUp`).setInterpolation(`flat`),A=Le(U(0),`vPatchClass`).setInterpolation(`flat`),j=new rt({side:2,alphaTest:.5});j.positionNode=ne(()=>{let e=k.xy,t=U(c.x,c.z,c.y.negate()).sub(K),n=g(H(t.x,t.z).add(H(1e-4,0))),i=n.mul(-15),a=c.z.add(u.x.mul(i.x)).add(u.y.mul(i.y.negate())),o=U(c.x.add(i.x),a,c.y.negate().add(i.y)),s=g(o.sub(K)),m=g(ve(s,U(0,1,0))),_=ve(m,s),b=g(U(u.x.negate(),1,u.y)),C=I(q(Y(s.negate(),b),0,1)).div(tr),T=c.w.div(22),j=q(de(hr(C)),0,y-2),M=l(p.element(Ae(j)),p.element(Ae(j.add(1)))).mul(T),N=W(30).mul(Ke(n.x).add(Ke(n.y))),ee=Z(o.sub(K)).greaterThan(r.cutoff.mul(r.band.add(1)).add(30)),te=fr(c.x,c.y,r).or(ee);x.assign(e.x.sub(.5).mul(N).div(30)),S.assign(e.y.mul(M)),w.assign(J(C,u.z,h.element(Ae(u.w)),T)),E.assign(J(d.x,Z(o.sub(K)),v(te,W(0),W(1)),0)),D.assign(m),O.assign(_),A.assign(f.xyz);let P=o.add(m.mul(e.x.sub(.5).mul(N))).add(_.mul(e.y.mul(M).sub(T.mul($n))));return v(te,U(0,-1e6,0),P)})();let M=(e,n)=>{let r=de(e.div(t.cols)),i=e.sub(r.mul(t.cols)),a=dt(x.add(E.x.mul(7.31))),o=n.div(p.element(Ae(e.mod(y))).mul(w.w)),s=(e=>H(e.add(i).div(t.cols),W(1).sub(o).add(r).div(t.rows)))(a),c=H(x.dFdx().div(t.cols).mul(rr),o.dFdx().negate().div(t.rows).mul(ir)),l=H(x.dFdy().div(t.cols).mul(rr),o.dFdy().negate().div(t.rows).mul(ir)),u=o.greaterThanEqual(.01).and(o.lessThanEqual(.99)),d=X(t.albedo.texture,s).grad(c,l),f=X(t.normals.texture,s).grad(c,l);return{a:v(u,d,J(0)),n:f}},N=(()=>{let e=v(r.flat.greaterThan(.5),W(.5),st(m.xy)),t=q(hr(w.x),0,y-1),n=s(de(t).add(v(dt(t).greaterThan(e),W(1),W(0))),y-1),i=q(gr(w.y),0,b-1),a=s(de(i).add(v(dt(i).greaterThan(dt(e.mul(5.7))),W(1),W(0))),b-1),o=w.z.mul(b).add(a).mul(y).add(n);return M(o,S)})(),ee=N.a.a,te=ne(()=>{let e=ur(E.y,r),t=E.z.greaterThan(.5).and(dr(r).greaterThanEqual(e)),n=v(r.flat.greaterThan(.5),W(.5),W(nr));return v(t.and(ee.greaterThan(n)),W(1),W(0))})(),P=N.a.rgb.div(l(ee,.001)).div(er).mul(E.x.mul(.08).add(.96)),F=T(P,U(.78,.81,.86).mul(Y(P,U(.3,.59,.11)).mul(2).add(.55)),r.snow.mul(.2));j.colorNode=J(v(r.flat.greaterThan(.5),U(0),lr(F,r)),te),C(j,v(r.flat.greaterThan(.5),A,U(0))),j.normalNode=ne(()=>{let e=N.n.xyz.div(l(N.n.a,.001)).mul(2).sub(1),t=g(ve(O,D)),n=g(D.mul(e.x).add(O.mul(e.y)).add(t.mul(e.z)));return g(Me.mul(J(n,0)).xyz)})(),j.receivedShadowNode=i;let re=new $e(a,j);return re.frustumCulled=!1,re.receiveShadow=!0,re.name=`stand-patches`,{mesh:re,count:e.count,setClasses(t){let n=o.array;if(!t)n.fill(0);else for(let r=0;r<e.count;r++)n.set([mr(t[r*3]),mr(t[r*3+1]),mr(t[r*3+2]),1],r*4);o.needsUpdate=!0}}}var mr=e=>e/255;function hr(e){let t=Xn,n=W(t.length-1);for(let r=t.length-2;r>=0;r--)n=v(e.lessThan(t[r+1]),W(r).add(q(e.sub(t[r]).div(t[r+1]-t[r]),0,1)),n);return n}function gr(e){let t=Pn,n=W(t.length-1);for(let r=t.length-2;r>=0;r--)n=v(e.lessThan(t[r+1]),W(r).add(q(e.sub(t[r]).div(t[r+1]-t[r]),0,1)),n);return n}var _r=`snag`,vr=.12,yr=.2,br={label:`Snag (burnt)`,crownRatio:vr,crownBase:.12,broadleaf:!1},xr={ashGone:1.5,herbFull:3,shrubStart:4,shrubFull:14,regenStart:10,regenFull:25,fallStart:8,fallHalf:25},Sr=1950,Cr={ash:[.035,.032,.03],ashGrey:[.1,.095,.09],herbDry:[.25,.225,.1],herb:[.215,.235,.075],shrub:[.12,.14,.095],regen:[.05,.08,.037],snag:[.05,.044,.054],farStand:[.085,.09,.07]},wr=.6,Tr=.45;function Er(e,t){return(n,r)=>{let i=e(n,r),a=t(n,r)??0;return!(a>0)||i!==null?i:Tr*a}}var Dr=.3,Or=e=>{if(!e||Number.isNaN(e.getTime()))return null;let t=e.getUTCFullYear(),n=Date.UTC(t,0,1),r=Date.UTC(t+1,0,1);return t+(e.getTime()-n)/(r-n)};function kr(e,t){return typeof e!=`number`||!Number.isFinite(e)?3:Math.max(0,t-(Math.floor(e)+.6))}function Ar(e){let t=xr;return e<=t.fallStart?1:.1+.9*2**(-(e-t.fallStart)/(t.fallHalf-t.fallStart))}var jr=e=>Math.round(e-3-.6),Mr=e=>Math.min(1,Math.max(0,(e-Sr)/100));function Nr(e){let t=e?.burntYear??e?.fireYear;if(!e||!Array.isArray(t)||t.length!==e.columns*e.rows)return null;let n=new Float32Array(t.length).fill(NaN),r=!1;return t.forEach((e,t)=>{typeof e==`number`&&Number.isFinite(e)&&e>1800&&e<2200&&(n[t]=e,r=!0)}),r?n:null}var Pr=e=>e.some(e=>e.code.includes(7)),Fr=e=>e.some(e=>e.code.includes(7)||e.code.includes(Ir)),Ir=8;function Lr(e){return(t,n)=>{for(let r of e){let e=(t-r.west)/r.spacing,i=(n-r.south)/r.spacing;if(e<0||i<0||e>r.columns-1||i>r.rows-1)continue;let a=Math.min(r.columns-2,Math.floor(e)),o=Math.min(r.rows-2,Math.floor(i)),s=e-a,c=i-o,l=(e,t)=>+(r.code[t*r.columns+e]===7);return(l(a,o)*(1-s)+l(a+1,o)*s)*(1-c)+(l(a,o+1)*(1-s)+l(a+1,o+1)*s)*c}return null}}function Rr(e,t,n){for(let r of e){let e=(t-r.west)/r.spacing,i=(n-r.south)/r.spacing;if(e<-.5||i<-.5||e>r.columns-.5||i>r.rows-.5)continue;if(!r.fireYear)return null;let a=Math.floor(e),o=Math.floor(i),s=null,c=1/0;for(let[t,n]of[[a,o],[a+1,o],[a,o+1],[a+1,o+1]]){if(t<0||n<0||t>=r.columns||n>=r.rows)continue;let a=r.fireYear[n*r.columns+t],o=(e-t)**2+(i-n)**2;Number.isFinite(a)&&o<c&&(s=a,c=o)}return s}return null}function zr(e,t,n,r=()=>void 0){let i=e.fields.length,a=e.fields.indexOf(`x`),o=e.fields.indexOf(`y`),s=e.fields.indexOf(`species`),c=e.fields.indexOf(`crownWidth`),l=e.fields.indexOf(`height`);if(!Pr(t)||a<0||o<0||s<0)return{table:e,snags:0,fallen:0};let u=Lr(t),d=e.species.indexOf(_r),f=d>=0?d:e.species.length,p=e.data instanceof Float32Array?new Float32Array(e.count*i):Array(e.count*i),m=0,h=0,g=0;for(let d=0;d<e.count;d++){let _=d*i,v=e.data[_+a],y=e.data[_+o],b=u(v,y)??0,x=g*i;for(let t=0;t<i;t++)p[x+t]=e.data[_+t];if(b>0&&e.data[_+s]!==f&&Zr(v+.37,y-.21)<b){let i=kr(Rr(t,v,y),n);if(Zr(v-.53,y+.29)>=Ar(i)){h++;continue}c>=0&&l>=0&&!Rn(e,d,r)&&(p[x+c]=Math.min(e.data[_+c]>0?e.data[_+c]:1/0,vr*e.data[_+l])),p[x+s]=f,m++}g++}if(!m&&!h)return{table:e,snags:m,fallen:h};let _=g===e.count?p:p.slice(0,g*i);return{table:{...e,species:d>=0?e.species:[...e.species,_r],count:g,data:_},snags:m,fallen:h}}function Br(e,t,n){let r=zr(e.trees,t,n,t=>e.species?.[t]?.crownRatio);return r.table===e.trees?{scene:e,snags:0,fallen:0}:{scene:{...e,trees:r.table,species:{...e.species??{},[_r]:br}},snags:r.snags,fallen:r.fallen}}function Vr(e,t){let n=new Uint8Array(e.columns*e.rows*4);for(let r=0;r<e.code.length;r++){if(e.code[r]===Ir&&(n[r*4+2]=255),e.code[r]!==7)continue;let i=e.fireYear&&Number.isFinite(e.fireYear[r])?e.fireYear[r]:t;n[r*4]=255,n[r*4+1]=Math.round(Mr(Math.floor(i))*255)}return n}function Hr(e,t,n){let r=e.columns*e.rows,i=e.cover&&e.cover.length===r?e.cover.slice():Array(r).fill(0).map((n,r)=>e.heights[r]===null?null:e.west+r%e.columns*e.spacing>t?0:null),a=Array(r).fill(null);for(let r=0;r<i.length;r++)e.west+r%e.columns*e.spacing>t&&(i[r]===0||i[r]===1)&&(i[r]=7,a[r]=n);return{...e,cover:i,burntYear:a}}var Ur={forest:0,sparse:1,shrub:2,herb:3,rock:4,water:5,cut:6,burnt:7,rockyStand:8},Wr=new Set(Object.values(Ur)),Gr={0:1,1:.55,2:.2,3:.12,4:0,5:0,6:1,7:1,8:1},Kr={0:1,1:.5,2:0,3:0,4:0,5:0,6:1,7:1,8:1};function qr(e){if(!e?.cover||e.cover.length!==e.columns*e.rows)return null;let t=e.columns*e.rows,n=new Int8Array(t).fill(-1),r=!1;for(let i=0;i<t;i++){let t=e.cover[i];if(typeof t==`number`&&Wr.has(t)&&t!==Ur.rockyStand){let a=e.canopy?.[i];n[i]=t===Ur.rock&&typeof a==`number`&&a>=.1?Ur.rockyStand:t,r=!0}}return r?{west:e.west,south:e.south,spacing:e.spacing,columns:e.columns,rows:e.rows,code:n,fireYear:Nr(e)}:null}function Jr(e){return[e.terrain,e.farTerrain,e.skylineTerrain].map(qr).filter(e=>!!e)}function Yr(e){if(!e.length)return null;let t={forest:0,sparse:0,shrub:0,herb:0,rock:0,water:0,cut:0,burnt:0,rockyStand:0,unknown:0},n=Object.keys(Ur);for(let r of e)for(let e of r.code)e<0?t.unknown++:t[n[e]]++;return t}function Xr(e,t,n=1){return(r,i)=>{for(let a of e){let e=(r-a.west)/a.spacing,o=(i-a.south)/a.spacing;if(e<0||o<0||e>a.columns-1||o>a.rows-1)continue;let s=Math.min(a.columns-2,Math.floor(e)),c=Math.min(a.rows-2,Math.floor(o)),l=e-s,u=o-c,d=(e,r)=>{let i=a.code[r*a.columns+e];return i<0?n:t[i]};return(d(s,c)*(1-l)+d(s+1,c)*l)*(1-u)+(d(s,c+1)*(1-l)+d(s+1,c+1)*l)*u}return null}}function Zr(e,t){let n=Math.imul(Math.round(e*10)|0,668265261)^Math.imul(Math.round(t*10)|0,374761393)^1540483477;return n=Math.imul(n^n>>>15,2246822507),n=Math.imul(n^n>>>13,3266489909),((n^n>>>16)>>>0)/4294967296}function Qr(e,t){let n=e.fields.length,r=e.fields.indexOf(`x`),i=e.fields.indexOf(`y`),a=[];for(let o=0;o<e.count;o++){let s=e.data[o*n+r],c=e.data[o*n+i],l=t(s,c)??1;(l>=1||l>0&&Zr(s,c)<l)&&a.push(o)}return a}function $r(e,t){let n=Qr(e,t);if(n.length===e.count)return{table:e,removed:0};let r=e.fields.length,i=e.data instanceof Float32Array?new Float32Array(n.length*r):Array(n.length*r);return n.forEach((t,n)=>{for(let a=0;a<r;a++)i[n*r+a]=e.data[t*r+a]}),{table:{...e,count:n.length,data:i},removed:e.count-n.length}}function ei(e){let t=Jr(e);if(!t.length)return{scene:e,removed:0,rasters:t};let{table:n,removed:r}=$r(e.trees,Xr(t,Gr));return{scene:r?{...e,trees:n}:e,removed:r,rasters:t}}function ti(e){let t=new Uint8Array(e.columns*e.rows*4),n={[Ur.sparse]:0,[Ur.shrub]:1,[Ur.herb]:2,[Ur.rock]:3};for(let r=0;r<e.code.length;r++){let i=n[e.code[r]];i!==void 0&&(t[r*4+i]=255)}return t}var ni={via:{chroma:1,tint:[1,1,1]},photo:{chroma:.7,tint:[.96,.99,1.05]}};function ri(e,t=42){let{columns:n,rows:r,spacing:i,heights:a,canopy:o}=e,s=(e,t)=>a[Math.min(r-1,Math.max(0,t))*n+Math.min(n-1,Math.max(0,e))],c=Array(n*r).fill(null);for(let e=0;e<r;e++)for(let r=0;r<n;r++){let a=s(r,e),l=s(r+1,e),u=s(r-1,e),d=s(r,e+1),f=s(r,e-1);if(a===null||l===null||u===null||d===null||f===null)continue;let p=Math.atan(Math.hypot((l-u)/(2*i),(d-f)/(2*i)))*180/Math.PI,m=e*n+r;if(p>t){c[m]=Ur.rock;continue}let h=o?.[m];typeof h==`number`&&(c[m]=h<.05?Ur.herb:h<.2?Ur.shrub:h<.35?Ur.sparse:Ur.forest)}return c}function ii(e){let t=new Uint8Array(e.columns*e.rows*4);for(let n=0;n<e.code.length;n++)e.code[n]===Ur.water&&(t[n*4]=255);return t}function ai(e){if(!e.cover||e.cover.length!==e.columns*e.rows)return{grid:e,posts:0};let t=e.earthCurvature?.earthRadiusMeters??6371e3,n=e.earthCurvature?.refraction??.13,r=null,i=0;for(let a=0;a<e.cover.length;a++){if(e.cover[a]!==Ur.water)continue;let o=e.west+a%e.columns*e.spacing,s=e.south+Math.floor(a/e.columns)*e.spacing,c=-((o*o+s*s)/(2*t))*(1-n),l=e.heights[a];typeof l==`number`&&Number.isFinite(l)&&l>=c||(r??=e.heights.slice(),r[a]=c,i++)}return r?{grid:{...e,heights:r},posts:i}:{grid:e,posts:i}}function oi(e){let t=Math.max(1,...e.map(e=>e.raster.columns)),n=[],r=0;for(let t of e)n.push({row:r,columns:t.raster.columns,rows:t.raster.rows}),r+=t.raster.rows+2;let i=Math.max(1,r-2),a=new Uint8Array(t*i*4);return e.forEach((e,r)=>{let i=e.texels(e.raster),{columns:o,rows:s}=e.raster;for(let e=0;e<s;e++)a.set(i.subarray(e*o*4,(e+1)*o*4),(n[r].row+e)*t*4)}),{width:t,height:i,data:a,sections:n}}function si(e,t,n,r=2022){if(!e.length)return null;let i=e.map(e=>({raster:e,texels:ti}));t&&i.push({raster:t,texels:ii});let a=Fr(e);if(a)for(let t of e)i.push({raster:t,texels:e=>Vr(e,r)});let o=oi(i),s=new E(o.data,o.width,o.height);s.magFilter=R,s.minFilter=R,s.generateMipmaps=!1,s.wrapS=s.wrapT=Fe,s.needsUpdate=!0;let c=(e,t)=>({west:e.west,south:e.south,spacing:e.spacing,columns:e.columns,rows:e.rows,row:o.sections[t].row}),l=e.length+ +!!t;return{texture:s,width:o.width,height:o.height,grids:e.map(c),sea:t?{...c(t,e.length),inner:n}:null,burn:a?e.map((e,t)=>c(e,l+t)):null}}function ci(e,t,n,r){let i=n.x.sub(t.west).div(t.spacing),a=n.y.sub(t.south).div(t.spacing),o=s(s(i.add(.5),W(t.columns-.5).sub(i)),s(a.add(.5),W(t.rows-.5).sub(a))),c=q(i.add(.5),.5,t.columns-.5).div(e.width),l=q(a.add(.5),.5,t.rows-.5).add(t.row).div(e.height),u=X(e.texture,H(c,l));return{t:r?u.level(W(0)):u,posts:o}}function li(e,t,n=!1){let r=J(0,0,0,0);for(let i of[...e.grids].reverse()){let{t:a,posts:o}=ci(e,i,t,n);r=T(r,a,z(.5,2.5,o))}return r}function ui(e,t,n,r=!1){if(!e.burn)return{share:W(0),age:W(0),rocky:W(0)};let i=J(0,0,0,0);for(let n of[...e.burn].reverse()){let{t:a,posts:o}=ci(e,n,t,r);i=T(i,a,z(.5,2.5,o))}let a=i.y.div(l(i.x,1/255)).mul(100).add(Sr).round();return{share:i.x,age:l(n.sub(a.add(.6)),0),rocky:i.z}}function di(e,t,n=300){let r=e.sea;if(!r)return W(0);let i=r.inner,{t:a,posts:o}=ci(e,r,t,!1),c=s(s(t.x.sub(i.west),W(i.east).sub(t.x)),s(t.y.sub(i.south),W(i.north).sub(t.y)));return a.x.mul(z(.5,1.5,o)).mul(W(1).sub(z(-n,0,c)))}var fi=()=>({chroma:B(1),tint:B(new V(1,1,1)),via:B(1),viewYear:B(2025.5)});function pi(e,t,n){e.chroma.value=ni[t].chroma,e.tint.value.set(...ni[t].tint),e.via.value=+(t===`via`),typeof n==`number`&&Number.isFinite(n)&&(e.viewYear.value=n)}var mi=(e,t)=>{let n=Y(e,U(.2126,.7152,.0722));return T(U(n,n,n),e,t.chroma).mul(t.tint)},hi=1e3;function gi(){let e=r.sub(K),t=l(Z(e.xz),.001),n=H(L(e.x,e.z.negate()),L(e.y,t)).mul(hi),i=g(e);return{q:n,foot:l(Z(i.dFdx()).add(Z(i.dFdy())).mul(.5*hi),1e-4),dist:Z(e)}}function _i(e,t,n){let r=M(l(e.mul(n),t)),i=de(r),a=ke(i);return{s0:a,s1:a.mul(2),t:r.sub(i)}}function vi(e,t,n,r){let{s0:i,s1:a,t:o}=_i(t,W(r.minCell*hi).div(n),r.px),s=t=>S(H(e.x.div(t),e.y.div(t.mul(r.stretch))).add(r.offset));return T(s(i),s(a),o).mul(1.5)}var yi=(e,t)=>dt(ae(Y(e.add(t),H(12.9898,78.233))).mul(43758.5453));function bi(e,t,n,r,i){let{s0:a,s1:o,t:s}=_i(t,W(i.minCell*hi).div(n),i.px),c=t=>{let n=de(H(e.x.div(t),e.y.div(t.mul(i.stretch))));return v(yi(n,i.offset).lessThan(r),W(1),W(0))};return v(s.lessThan(.5),c(a),c(o))}function xi(e,t,n,r){let{s0:i,s1:a,t:o}=_i(t,W(r.minCell*hi).div(n),r.px),s=i.mul(n).div(hi),c=a.mul(n).div(hi),l=t=>S(e.div(t).add(r.offset));return T(l(s),l(c),o).mul(1.5)}var Si=.35,Ci=.32,wi=.12,Ti=8,Ei=null;function Di(){if(Ei)return Ei;let e=mt(41,Ti,3),t=new Uint8Array(262144);for(let n=0;n<256;n++)for(let r=0;r<256;r++)t.fill(Math.round(Math.min(1,Math.max(0,e(r/256,n/256)))*255),(n*256+r)*4,(n*256+r)*4+4);let n=new E(t,256,256);return n.wrapS=n.wrapT=ye,n.magFilter=R,n.minFilter=D,n.generateMipmaps=!0,n.needsUpdate=!0,Ei=n}function Oi(e){let t=e=>{let t=new Uint16Array(e.length);for(let n=0;n<e.length;n++)t[n]=u.toHalfFloat(e[n]);return t},n=n=>{let r=new E(t(n),e.columns,e.rows,_e,p);return r.magFilter=R,r.minFilter=R,r.generateMipmaps=!1,r.wrapS=r.wrapT=Fe,r.needsUpdate=!0,r};return{stand:n(e.stand),colour:n(e.colour)}}function ki(e,t,n,i,a,o=null,s=W(2025.5)){let c=(e,t,n)=>{if(!o)return W(0);let r=li(o,H(e,t),n);return q(r.y.add(r.z).add(r.w),0,1)},l=Oi(t),u=B(1),p=(e,n)=>H(e.sub(t.west).div(t.cell*t.columns),n.negate().sub(t.south).div(t.cell*t.rows)),m=e=>e.x.greaterThanEqual(0).and(e.x.lessThanEqual(1)).and(e.y.greaterThanEqual(0)).and(e.y.lessThanEqual(1)),h=new rt;h.positionNode=ne(()=>{let e=p(ft.x,ft.z),t=X(l.stand,e).level(W(0)),n=v(m(e),z(W(wi*.6),W(.35),t.x),W(0)),r=W(1).sub(z(.05,.5,c(ft.x,ft.z.negate(),!0))),i=o?.burn?ui(o,H(ft.x,ft.z.negate()),s,!0).share:W(0);return ft.add(U(0,t.y.mul(n).mul(r).mul(.92).mul(W(1).sub(i.mul(1-wr))),0))})();let g=r,_=X(Di()),y=e=>_.sample(e.div(Ti)).r.mul(2).sub(1),b=H(y(g.xz.mul(.011)),y(g.xz.mul(.011).add(19.3))).mul(t.cell*.45),x=p(g.x.add(b.x),g.z.add(b.y)),S=X(l.stand,x),w=v(m(x),S.x,W(0)),E=Z(g.sub(K)),{q:D,foot:O,dist:k}=gi(),A=vi(D,O,k,{px:1.1,stretch:5,minCell:4,offset:3.1}).mul(.65).add(vi(D,O,k,{px:3.2,stretch:4,minCell:12,offset:7.7}).mul(.35)).toVar(),j=y(g.xz.mul(.004).add(23.1)).mul(.07).add(y(g.xz.mul(.0011).add(29.3)).mul(.05)),M=W(1).sub(q(w,0,1)),ee=z(W(.2).sub(M.mul(.25)),W(.65).sub(M.mul(.25)),A.negate()).toVar(),te=T(W(1),W(Ci),ee).div(1-Si*.6799999999999999),P=X(l.colour,x).rgb.mul(u),F=o?.burn?ui(o,H(g.x,g.z.negate()),s):null,re=F?ee.mul(F.rocky).mul(.75):W(0),I=T(P.mul(A.mul(.2).add(j).add(1)).mul(te),U(.3,.28,.22),re),ie=F?F.share.toVar():W(0),ae=I;if(F){let e=Cr,t=xr,n=F.age,r=e=>U(e[0],e[1],e[2]),i=T(T(T(r(e.ash),r(e.herb),z(0,t.herbFull,n)),r(e.shrub),z(t.shrubStart,t.shrubFull,n)),r(e.regen),z(t.regenStart,t.regenFull,n)),a=z(.05,.5,vi(D,O,k,{px:1,stretch:7,minCell:3,offset:11.3}).negate()),o=T(T(r(e.farStand),i,.7).mul(A.mul(.15).add(j).add(1)),r(e.snag),a.mul(.6)).mul(T(W(1),W(.7),ee));ae=T(I,o,ie)}h.colorNode=ne(()=>{let e=ur(E,n);return f(dr(n).greaterThanEqual(e),()=>N()),f(w.lessThanEqual(wi).or(fr(g.x,g.z.negate(),n)).or(c(g.x,g.z.negate(),!1).greaterThan(.5)),()=>N()),F&&f(n.flat.greaterThan(.5).and(ie.greaterThan(.5)).and(bi(D,O,k,Dr,{px:1,stretch:6,minCell:3,offset:5.9}).lessThan(.5)),()=>N()),J(v(n.flat.greaterThan(.5),U(0),lr(ae,n)),1)})(),C(h,v(n.flat.greaterThan(.5),a,U(0))),h.normalNode=ne(()=>{let e=pe.mul(J(1,0,0,0)).xyz,t=q(A.dFdx().mul(.12),-.3,.3),n=d.add(e.mul(t)).normalize();return Me.mul(J(n,0)).xyz.normalize()})(),h.receivedShadowNode=i;let oe=new $e(e,h);return oe.frustumCulled=!1,oe.receiveShadow=!0,oe.name=`canopy-surface`,{mesh:oe,gain:u,dispose:()=>(h.dispose(),l.stand.dispose(),l.colour.dispose())}}var Ai={shrubStart:1,shrubFull:5,greenFull:10,standStart:13,standFull:20},ji=.5,Mi=.1;function Ni(e){let t=e.ageYears;return typeof t==`number`&&Number.isFinite(t)?Math.max(0,t):1}function Pi(e){let t=e.retainedShare;return typeof t==`number`&&Number.isFinite(t)?Math.min(1,Math.max(0,t)):0}var Fi=e=>Math.min(1,Math.max(0,e/40)),Ii={base:[.33,.225,.18],light:[.46,.355,.29],dark:[.15,.1,.085],maxAge:1,fade:.5},Li=2.5;function Ri(e){if(!e?.canopy||e.canopy.length!==e.columns*e.rows)return null;let t=e.columns*e.rows,n=new Float32Array(t),r=new Uint8Array(t),i=!1;for(let a=0;a<t;a++){let t=e.canopy[a];typeof t==`number`&&Number.isFinite(t)&&(n[a]=Math.min(1,Math.max(0,t)),r[a]=1,i=!0)}return i?{west:e.west,south:e.south,spacing:e.spacing,columns:e.columns,rows:e.rows,closure:n,known:r}:null}function zi(e,t,n){let{fields:r,data:i,count:a}=e.trees;if(!a)return null;let o=r.length,s=r.indexOf(`x`),c=r.indexOf(`y`),l=r.indexOf(`crownWidth`),u=r.indexOf(`height`),d=Math.max(2,Math.ceil((t.east-t.west)/n)+1),f=Math.max(2,Math.ceil((t.north-t.south)/n)+1),p=new Float32Array(d*f),[m,h]=e.camera?.position??[0,0],g=0;for(let e=0;e<a;e++){let r=e*o,a=i[r+s],_=i[r+c],v=l>=0&&i[r+l]>0?i[r+l]:u>=0?i[r+u]*.25:4;g=Math.max(g,Math.hypot(a-m,_-h));let y=(a-t.west)/n,b=(_-t.south)/n,x=Math.floor(y),S=Math.floor(b),C=y-x,w=b-S,T=Math.PI*(v/2)**2,E=(e,t,n)=>{e>=0&&t>=0&&e<d&&t<f&&(p[t*d+e]+=T*n)};E(x,S,(1-C)*(1-w)),E(x+1,S,C*(1-w)),E(x,S+1,(1-C)*w),E(x+1,S+1,C*w)}let _=Math.max(1,Math.round(30/n/2)),v=Bi(Bi(p,d,f,_),d,f,_),y=new Float32Array(d*f),b=new Uint8Array(d*f);for(let e=0;e<f;e++)for(let r=0;r<d;r++){let i=e*d+r;y[i]=1-Math.exp(-v[i]/(n*n)),b[i]=+(Math.hypot(t.west+r*n-m,t.south+e*n-h)<=g)}return{west:t.west,south:t.south,spacing:n,columns:d,rows:f,closure:y,known:b}}function Bi(e,t,n,r){let i=new Float32Array(e.length),a=new Float32Array(e.length),o=(e,t,n,i,a)=>{for(let o=0;o<n;o++){let n=0,s=0;for(let t=0;t<=Math.min(i-1,r);t++)n+=e[a(o,t)],s++;for(let c=0;c<i;c++){t[a(o,c)]=n/s;let l=c+r+1,u=c-r;l<i&&(n+=e[a(o,l)],s++),u>=0&&(n-=e[a(o,u)],s--)}}};return o(e,i,n,t,(e,n)=>e*t+n),o(i,a,t,n,(e,n)=>n*t+e),a}function Vi(e){let t=new Uint8Array(e.columns*e.rows*4);for(let n=0;n<e.columns*e.rows;n++)t[n*4]=e.known[n]?Math.round(e.closure[n]*255):0,t[n*4+1]=e.known[n]?255:0,t[n*4+3]=255;return t}var Hi=4e6,Ui=e=>!!e&&typeof e==`object`,Wi=e=>typeof e==`number`&&Number.isFinite(e);function Gi(e){if(e.quality!==`final`)return null;let t=Wi(e.samples)&&e.samples>=1?Math.min(256,Math.round(e.samples)):24,n=Wi(e.canopyCutoffPx)&&e.canopyCutoffPx>0?e.canopyCutoffPx:4;return{samples:t,stand:Ki(e.stand),canopyCutoffPx:n}}function Ki(e){if(e==null)return null;if(!Ui(e))throw Error(`The final stand is not an object.`);let t=Array.isArray(e.fields)?e.fields.map(String):null;if(!t||![`x`,`y`,`species`,`height`].every(e=>t.includes(e)))throw Error(`The final stand lacks x, y, species or height.`);let n=Array.isArray(e.species)?e.species.map(String):[],r=Wi(e.count)?Math.round(e.count):-1;if(r<0||r>4e6)throw Error(`The final stand's count must be 0 to ${Hi.toLocaleString(`en`)}.`);let i=e.data,a=i instanceof Float32Array?i:Array.isArray(i)?Float32Array.from(i):ArrayBuffer.isView(i)?new Float32Array(i.buffer):null;if(!a||a.length<r*t.length)throw Error(`The final stand's data is shorter than count × fields.`);let o=Wi(e.radiusMeters)&&e.radiusMeters>0?e.radiusMeters:0,s=Array.isArray(e.bearings)&&e.bearings.length===2&&e.bearings.every(Wi)?e.bearings:[0,360];return{fields:t,species:n,count:r,data:a,radiusMeters:o,bearings:[s[0],s[1]]}}function qi(e,[t,n]){let r=n-t;if(r>=360||r<=-360)return!0;let i=e=>(e%360+360)%360;return i(e-t)<=(r>=0?r:i(r))+1e-9}function Ji(e,t,n,r){let i=n-t[0],a=r-t[1];return i*i+a*a>e.radiusMeters*e.radiusMeters?!1:qi(Math.atan2(i,a)*180/Math.PI,e.bearings)}function Yi(e,t,n,r){let i=[...e.fields],a=[...e.species],o=t.species.map(e=>{let t=a.indexOf(e);return t<0&&(t=a.push(e)-1),t}),s=Ln(e.fields),c=i.length,l=[];for(let r=0;r<e.count;r++){let i=r*s.stride;Ji(t,n,e.data[i+s.x],e.data[i+s.y])||l.push(r)}let u=t.fields.indexOf(`x`),d=t.fields.indexOf(`y`),f=t.fields.indexOf(`height`),p=t.fields.length,m=[];for(let e=0;e<t.count;e++){let n=e*p,r=t.data[n+f];Number.isFinite(t.data[n+u])&&Number.isFinite(t.data[n+d])&&Number.isFinite(r)&&r>.5&&m.push(e)}let h=l.length+m.length,g=new Float32Array(h*c);l.forEach((t,n)=>{for(let r=0;r<c;r++)g[n*c+r]=e.data[t*s.stride+r]});let _=i.map(e=>t.fields.indexOf(e)),v=t.fields.indexOf(`x`),y=t.fields.indexOf(`y`),b=t.fields.indexOf(`species`),x=t.fields.length;return m.forEach((e,n)=>{let a=e*x,u=(l.length+n)*c,d=t.data[a+v],f=t.data[a+y];i.forEach((e,n)=>{if(n===s.species)g[u+n]=o[t.data[a+b]]??0;else{let i=_[n]>=0?t.data[a+_[n]]:NaN;g[u+n]=Number.isFinite(i)?i:r(e,d,f)}})}),{fields:i,species:a,count:h,data:g,fromStand:m.length,kept:l.length}}function Xi(e,t,n,r,i,a=.17){let o=Ln(e.fields),s=[`x`,`y`,`species`,`height`,`crownWidth`,`tone`],c=[],l={radiusMeters:n,bearings:r};for(let n=0;n<e.count;n++){let r=n*o.stride,s=e.data[r+o.x],u=e.data[r+o.y],d=e.data[r+o.height];if(!Ji(l,t,s,u))continue;let f=o.crownWidth>=0?e.data[r+o.crownWidth]:d*a;if(!Rn(e,n)){c.push(s,u,e.data[r+o.species],d,f,o.tone>=0?e.data[r+o.tone]:.5);continue}let p=Math.max(1,Math.round(Math.PI*(f/2)**2*i/1e4)),m=(Math.imul(Math.round(s*10),2654435761)^Math.imul(Math.round(u*10),2246822507))>>>0,h=()=>(m=Math.imul(m^m>>>15,739982445)+1831565813>>>0,m/4294967296);for(let n=0;n<p;n++){let n=f/2*Math.sqrt(h()),i=h()*Math.PI*2,p=s+n*Math.cos(i),m=u+n*Math.sin(i);if(!Ji(l,t,p,m))continue;let g=d*(.75+.5*h());c.push(p,m,e.data[r+o.species],g,g*a*(.85+.3*h()),h())}}return{fields:s,species:[...e.species],count:c.length/s.length,data:Float32Array.from(c),radiusMeters:n,bearings:r}}function Zi(e,t,n,r,i=500){if(e.count>0)return e;let a=Ln(e.fields),o=e.fields.map(e=>e===`tone`?.5:0);return a.x>=0&&(o[a.x]=t),a.y>=0&&(o[a.y]=n),a.z>=0&&(o[a.z]=r-i),a.height>=0&&(o[a.height]=1),a.crownWidth>=0&&(o[a.crownWidth]=.3),{...e,count:1,data:e.data instanceof Float32Array?Float32Array.from(o):o}}var Qi=8192,$i=e=>!!e&&typeof e==`object`,ea=e=>typeof e==`number`&&Number.isFinite(e),ta=(e,t)=>{if(!Array.isArray(e)||e.length!==3||!e.every(e=>ea(e)&&e>=0&&e<=255))throw Error(`The capture's ${t} colour is not [r, g, b] in 0-255.`);return[Math.round(e[0]),Math.round(e[1]),Math.round(e[2])]};function na(e){if(!$i(e)||e.type!==`pgmaps-capture`)throw Error(`Not a capture request.`);if(typeof e.id!=`string`||!e.id)throw Error(`The capture request has no id.`);let t=e.position;if(!Array.isArray(t)||t.length!==3||!t.every(ea))throw Error(`The capture position is not [x, y, z] in metres.`);if(!Array.isArray(e.frames)||!e.frames.length)throw Error(`The capture asks for no frames.`);let n=e.frames.map((e,t)=>{if(!$i(e))throw Error(`Frame ${t+1} is not a frame.`);let{bearingDegrees:n,pitchDegrees:r,horizontalFovDegrees:i,verticalFovDegrees:a,width:o,height:s}=e;if(![n,r,i,a,o,s].every(ea))throw Error(`Frame ${t+1} lacks a bearing, pitch, fields or size.`);let c=e=>e;if(!(c(i)>0&&c(i)<179&&c(a)>0&&c(a)<179))throw Error(`Frame ${t+1}'s fields must be between 0 and 179 degrees.`);if(Math.abs(c(r))>=90)throw Error(`Frame ${t+1}'s pitch must be under 90 degrees.`);if(!Number.isInteger(o)||!Number.isInteger(s)||c(o)<1||c(s)<1||c(o)>8192||c(s)>8192)throw Error(`Frame ${t+1}'s size must be whole pixels, 1 to ${Qi} a side.`);return{bearingDegrees:c(n),pitchDegrees:c(r),horizontalFovDegrees:c(i),verticalFovDegrees:c(a),width:c(o),height:c(s)}}),r=$i(e.classes)?e.classes:null;if(!r)throw Error(`The capture request has no classes.`);let i=(e,t)=>(Array.isArray(e)?e:[]).map((e,n)=>{if(!$i(e)||!Array.isArray(e.polygons))throw Error(`${t} layer ${n+1} has no polygons.`);return{id:typeof e.id==`string`?e.id:`layer-${n+1}`,rgb:ta(e.rgb,`${t.toLowerCase()} layer ${String(e.id??n+1)}`),polygons:e.polygons}}),a=i(r.layers,`Class`),o=$i(e.zones)?e.zones:null;return{type:`pgmaps-capture`,id:e.id,position:[t[0],t[1],t[2]],frames:n,classes:{terrain:ta(r.terrain,`terrain`),layers:a,vegetation:ta(r.vegetation,`vegetation`),water:ta(r.water,`water`)},...o?{zones:{terrain:ta(o.terrain,`zone terrain`),layers:i(o.layers,`Zone`)}}:{},final:Gi(e)}}var ra=Math.PI/180;function ia(e,t){let n=t.bearingDegrees*ra,r=t.pitchDegrees*ra,i=[e[0],e[2],-e[1]],a=[Math.sin(n)*Math.cos(r),Math.sin(r),-Math.cos(n)*Math.cos(r)];return{position:i,forward:a,target:[i[0]+a[0]*100,i[1]+a[1]*100,i[2]+a[2]*100],up:[0,1,0],fov:t.verticalFovDegrees,aspect:Math.tan(t.horizontalFovDegrees*ra/2)/Math.tan(t.verticalFovDegrees*ra/2)}}function aa(e,t,n,r=4096,i=1){let a=Math.max(1e-6,e.east-e.west),o=Math.max(1e-6,e.north-e.south),s=Math.max(1,Math.min(r,Math.ceil(a/i))),c=Math.max(1,Math.min(r,Math.ceil(o/i))),l=a/s,u=o/c,d=new Uint8Array(s*c*4),f=new Uint32Array(d.buffer),p=e=>new Uint32Array(new Uint8Array([e[0],e[1],e[2],255]).buffer)[0];f.fill(p(t));let m=[],h={},g=[];for(let t of n){let n=0,r=!1,i=p(t.rgb);for(let a of t.polygons){let t=a.filter(e=>Array.isArray(e)&&e.length>=3);if(!t.length)continue;let o=1/0,d=-1/0;for(let n of t)for(let[t,i]of n)(t<e.west||t>e.east||i<e.south||i>e.north)&&(r=!0),i<o&&(o=i),i>d&&(d=i);let p=Math.max(0,Math.ceil((e.north-d)/u-.5)),m=Math.min(c-1,Math.floor((e.north-o)/u-.5));for(let r=p;r<=m;r++){let a=e.north-(r+.5)*u;g.length=0;for(let e of t)for(let t=0,n=e.length-1;t<e.length;n=t++){let[r,i]=e[t],[o,s]=e[n];i>a!=s>a&&g.push(r+(a-i)*(o-r)/(s-i))}g.sort((e,t)=>e-t);for(let t=0;t+1<g.length;t+=2){let a=Math.max(0,Math.ceil((g[t]-e.west)/l-.5)),o=Math.min(s-1,Math.ceil((g[t+1]-e.west)/l-.5)-1);o>=a&&(f.fill(i,r*s+a,r*s+o+1),n+=o-a+1)}}}h[t.id]=n,r&&m.push(t.id)}return{data:d,width:s,height:c,bounds:e,texel:[l,u],cut:m,painted:h}}function oa(e,t,n){return Ut({grids:e.map(e=>[e.bounds.west,e.bounds.south,e.bounds.east,e.bounds.north,e.maxSide??4096,e.minTexel??1]),terrain:t,layers:n.map(e=>[e.id,e.rgb,e.polygons])})}var sa=(e,t,n)=>Math.ceil(e*t/256)*256/n;function ca(e){let t=e&32768?-1:1,n=e>>10&31,r=e&1023;return n===0?t*r*2**-24:n===31?r?NaN:t*(1/0):t*(1+r/1024)*2**(n-15)}function la(e,t,n,r,i,a=t){let o=new Float32Array(t*n);for(let s=0;s<n;s++)for(let n=0;n<t;n++){let c=e[s*a+n];o[s*t+n]=c>=1||!(c>=0)?0:r*i/(i-c*(i-r))}return o}function ua(e,t,n,r,i=t*4){let a=new Uint8ClampedArray(t*n*4);for(let o=0;o<n;o++)for(let n=0;n<t;n++){let s=o*t+n;if(!(r[s]>0))continue;let c=o*i+n*4;for(let t=0;t<3;t++)a[s*4+t]=Math.round(ca(e[c+t])*255);a[s*4+3]=255}return a}function da(e,t,n,r,i,a){let o=t*r;for(let t=0;t<n;t++)for(let n=0;n<o;n++)a[t*o+n]=e[t*i+n];return a}function fa(e,t,n,r,i){let a=t.bearingDegrees*ra,o=t.pitchDegrees*ra,s=[Math.sin(a)*Math.cos(o),Math.cos(a)*Math.cos(o),Math.sin(o)],c=[Math.cos(a),-Math.sin(a),0],l=[-Math.sin(a)*Math.sin(o),-Math.cos(a)*Math.sin(o),Math.cos(o)],u=Math.tan(t.horizontalFovDegrees*ra/2),d=Math.tan(t.verticalFovDegrees*ra/2);for(let a=Math.floor(r/2);a<t.height;a+=r)for(let o=Math.floor(r/2);o<t.width;o+=r){let r=n[a*t.width+o];if(!(r>0))continue;let f=((o+.5)/t.width*2-1)*u,p=(1-(a+.5)/t.height*2)*d;i(e[0]+r*(s[0]+c[0]*f+l[0]*p),e[1]+r*(s[1]+c[1]*f+l[1]*p),e[2]+r*(s[2]+c[2]*f+l[2]*p))}}var pa=e=>`${(e/1e3).toFixed(1)} km`,ma=(e,t)=>`${t?(100*e/t).toFixed(e&&e<t/1e3?2:1):`0`}%`;function ha(e){let{seen:t}=e,n=[],r=[];t.beyondTrees>0&&(e.treeReachMeters===null?(n.push(`no trees drawn`),r.push(`The package carries no stems: the frames' ground is bare, screening nothing.`)):(n.push(`trees past ${pa(e.treeReachMeters)} not drawn`),r.push(`Trees are drawn only as the package's ${e.stems.toLocaleString(`en-CA`)} stems, the farthest ${Math.round(e.treeReachMeters).toLocaleString(`en-CA`)} m from the eye; ground beyond them (${ma(t.beyondTrees,t.drawn)} of the frames' drawn pixels) is bare and screens nothing.`))),t.invented>0&&(n.push(`terrain past ${pa(e.realGroundMeters)} invented`),r.push(`Ground past the package's ${e.skylineTerrain?`skyline terrain`:e.farTerrain?`far terrain`:`terrain grid`} (its nearest edge ${pa(e.realGroundMeters)} from the eye) is invented: the edge's heights easing to the grid's mean, painted the terrain class (${ma(t.invented,t.drawn)} of the drawn pixels).`)),t.filled>0&&(n.push(`terrain gaps filled from neighbours`),r.push(`Posts the package's terrain leaves unknown are filled from their nearest known neighbours (${ma(t.filled,t.drawn)} of the drawn pixels).`));let i=(e,t)=>{let n=`${e.join(`, `)} cut at the terrain edge`;return n.length<=60?n:`${t} cut at the terrain edge`};return e.cut.length&&(n.push(i(e.cut,`class polygons`)),r.push(`Class polygons past the package's terrain are cut at its edge (${e.cut.join(`, `)}): their ground beyond it is the terrain class.`)),e.zonesCut?.length&&(n.push(i(e.zonesCut,`zone polygons`)),r.push(`Zone polygons past the package's terrain are cut at its edge (${e.zonesCut.join(`, `)}): beyond it, the zone pass's terrain colour.`)),{missing:n,missingDetail:r}}function ga(e,t,n){let r=Math.floor((t-e.bounds.west)/e.texel[0]),i=Math.floor((e.bounds.north-n)/e.texel[1]);if(!(r>=0&&i>=0&&r<e.width&&i<e.height))return null;let a=(i*e.width+r)*4;return[e.data[a],e.data[a+1],e.data[a+2]]}function _a(e){let t=Math.floor(e.stems.length/2),n=new Uint8Array(t*3),r=e=>e[0]<<16|e[1]<<8|e[2],i=r(e.terrain),a=new Map;for(let t of e.layers)!a.has(r(t.rgb))&&r(t.rgb)!==i&&a.set(r(t.rgb),t.id);let o={};for(let i=0;i<t;i++){let t=e.stems[i*2],s=e.stems[i*2+1],c=null;for(let n of e.rasters)if(c=ga(n,t,s))break;let l=c&&a.has(r(c))&&!e.onWater?.(t,s),u=l?c:e.vegetation;n.set(u,i*3);let d=l?a.get(r(c)):`vegetation`;o[d]=(o[d]??0)+1}return{rgb:n,counts:o}}var va=new URLSearchParams(location.search),ya=va.get(`farforest`)!==`0`,ba=Number(va.get(`cutoffpx`)??4),xa=15e3,Sa=600;function Ca(e,t){e.chroma.value=qn[t].chroma,e.tint.value.set(...qn[t].tint)}function wa(e){if(!ya)return null;let t=t=>e.species?.[t]?.crownRatio,n=e.trees,r=e.farTerrain??e.terrain,i=zn(n,{extent:{west:r.west,south:r.south,east:r.west+(r.columns-1)*r.spacing,north:r.south+(r.rows-1)*r.spacing},eye:[e.camera.position[0],e.camera.position[1]],speciesRatio:t,notCommon:e=>e===_r});if(!i)return null;let a=e.trees.fields.length,o=[];for(let r=0;r<e.trees.count;r++)Rn(n,r,t)||o.push(r);let s=Array(o.length*a);o.forEach((t,n)=>{for(let r=0;r<a;r++)s[n*a+r]=e.trees.data[t*a+r]});let c=e.trees.species.map((e,n)=>({species:n,ratio:Math.min(In,t(e)??.17)}));return{cells:i,trees:{...e.trees,count:o.length,data:s},extra:c,speciesRatio:t}}async function Ta(e){let t=performance.now(),{scene:n,plan:r,terrain:i}=e,a=r.cells,o=cr(e.snow,e.grade),s=(e,t)=>i.heightAt(e,-t),c=Jr(n),l=Jn([Ri(n.terrain),Ri(n.farTerrain),Ri(n.skylineTerrain)]),u=Pr(c)?Er(l,Lr(c)):l,d=[n.camera.position[0],n.camera.position[1]],f=c.length?Xr(c,Gr):void 0,p=c.length?Xr(c,Kr):void 0,m=Hn(a,s,u,{eye:d,maxReach:xa,keepAt:f}),h=n.trees.species.indexOf(_r);if(h>=0&&Pr(c)){let e=Lr(c);for(let t=0;t<m.count;t++)(e(m.a[t*4],m.a[t*4+1])??0)>.5&&(m.b[t*4+3]=h)}let g=new Set;for(let e=0;e<m.count;e++)g.add(m.b[e*4+3]);let _=new Map;for(let e=0;e<m.count;e++)_.set(m.b[e*4+3],(_.get(m.b[e*4+3])??0)+1);let y=h,b=[...g].sort((e,t)=>e-t).flatMap(t=>{let i=e.extraTypes.get(t);if(!i?.length)return[];let a=Array.from({length:12},()=>i).flat();for(let[n,r]of _){let i=e.extraTypes.get(n);if(n!==t&&t!==y&&n!==y&&i?.length)for(let e=0;e<Math.round(8*r/m.count);e++)a.push(...i)}let o=n.trees.species[t]??``,s=t===y?yr:Math.min(In,r.speciesRatio(o)??.17);return[{species:t,types:a,crownWidth:Math.max(2.5,s*22)}]}),x=await or(e.renderer,e.atlas,e.types,b,n.trees.species.length),S=pr(m,x,o,e.receivedShadow()),C=e=>x.meanAlbedo[e]??Kn[n.trees.species[e]??``]??[.045,.07,.045],w=i.ground.outer,T=Yn(w,u,a,C,{cell:90,maxSide:1024,keepAt:p}),E=v(Z(e.drape.colour.sub(e.drape.rest)).lessThan(.001),e.drape.vegetation,e.drape.colour),D=ki(i.mesh.geometry,T,o,e.receivedShadow(),E,e.cover,e.viewYear);D.gain.value=Number(va.get(`canopygain`)??1);let O=new F;O.name=`far-forest`,O.add(S.mesh,D.mesh),S.mesh.visible=va.get(`patches`)!==`0`,D.mesh.visible=va.get(`canopy`)!==`0`,D.mesh.renderOrder=1;let k=a.medianHeight||22,A=4e3;return{group:O,u:o,patches:m,patchMesh:S,canopy:D,update(e,t,n=ba){return A=Math.min(xa*.93,Math.max(Sa,Wn(n,Gn(t,e.fov),k))),o.cutoff.value=A,A},setLook(t){Ca(e.grade,t)},setClasses(e){if(!e){S.setClasses(null);return}let t=new Float32Array(m.count*2);for(let e=0;e<m.count;e++)t[e*2]=m.a[e*4],t[e*2+1]=m.a[e*4+1];let n=_a({stems:t,rasters:e.rasters,terrain:e.terrain,vegetation:e.vegetation,layers:e.layers,onWater:e.onWater});S.setClasses(n.rgb)},hide(e){if(!e){o.hide.value.set(0,0,0,0);return}o.hide.value.set(e.eye[0],e.eye[1],e.radius,0);let t=e.bearings[1]-e.bearings[0];o.hideSpan.value.set(e.bearings[0],Math.abs(t)>=360?360:(t%360+360)%360)},cutoff:()=>A,stats:{patches:m.count,bakeMs:Math.round(performance.now()-t)},dispose(){x.dispose(),D.dispose(),S.mesh.geometry.dispose()}}}var Ea=[250,700,1600,3500,8e3,16e3],Da=9e3,Oa=300,ka=e=>({west:e.west,south:e.south,east:e.west+(e.columns-1)*e.spacing,north:e.south+(e.rows-1)*e.spacing});function Aa(e,t){let{columns:n,rows:r,west:i,south:a,spacing:o}=e,s=new Float64Array(n*r),c=new Uint8Array(n*r),l=new Uint8Array(n*r),u=0,d=0;for(let f=0;f<n*r;f++){let r=e.heights[f];if(typeof r==`number`&&Number.isFinite(r))s[f]=r,c[f]=l[f]=1,u+=r,d++;else if(t){let e=t(i+f%n*o,a+Math.floor(f/n)*o);Number.isFinite(e)&&(s[f]=e,l[f]=1)}}let f=d?u/d:0,p=(e,t,n)=>{for(let r=0;r<t;r++){let t=NaN;for(let i=0;i<n;i++)l[e(r,i)]&&(t=s[e(r,i)]);for(let i=n-1;i>=0;i--){let n=e(r,i);l[n]?t=s[n]:Number.isFinite(t)&&(s[n]=t,l[n]=1)}}};p((e,t)=>e*n+t,r,n),p((e,t)=>t*n+e,n,r);for(let e=0;e<n*r;e++)l[e]||(s[e]=f);return{grid:e,bounds:ka(e),h:s,known:c,mean:f}}function ja(e,t,n){let{west:r,south:i,spacing:a,columns:o,rows:s}=e.grid,c=(t-r)/a,l=(n-i)/a,u=Math.min(o-1.0001,Math.max(0,c)),d=Math.min(s-1.0001,Math.max(0,l)),f=Math.floor(u),p=Math.floor(d),m=u-f,h=d-p,g=(t,n)=>e.h[Math.min(s-1,n)*o+Math.min(o-1,t)];return{v:g(f,p)*(1-m)*(1-h)+g(f+1,p)*m*(1-h)+g(f,p+1)*(1-m)*h+g(f+1,p+1)*m*h,out:Math.hypot(Math.max(0,Math.abs(c-u)-1e-4),Math.max(0,Math.abs(l-d)-1e-4))*a,cx:r+u*a,cy:i+d*a}}function Ma(e,t,n){let{west:r,south:i,spacing:a,columns:o,rows:s}=e.grid,c=Math.round((t-r)/a),l=Math.round((n-i)/a);return c>=0&&l>=0&&c<o&&l<s&&e.known[l*o+c]===1}var Na=(e,t,n,r=0)=>t>=e.west-r&&t<=e.east+r&&n>=e.south-r&&n<=e.north+r;function Pa(e,t,n){let r=ka(e),i=(t,n)=>{let r=Math.round((t-e.west)/e.spacing),i=Math.round((n-e.south)/e.spacing);if(r<0||i<0||r>=e.columns||i>=e.rows)return NaN;let a=e.heights[i*e.columns+r];return typeof a==`number`?a:NaN},a=e=>e&&e.columns>1&&e.rows>1&&e.heights?.length===e.columns*e.rows?e:null,o=a(t),s=a(n),c=o?Aa(o,(e,t)=>Na(r,e,t)?i(e,t):NaN):null,l=Aa(e,c?(e,t)=>Ma(c,e,t)?ja(c,e,t).v:NaN:void 0),u=s?Aa(s):null,d=(e,t)=>({west:Math.min(e.west,t.west),south:Math.min(e.south,t.south),east:Math.max(e.east,t.east),north:Math.max(e.north,t.north)}),f=c?d(c.bounds,l.bounds):l.bounds,p=u?d(u.bounds,f):f,m=c?Math.max(Oa,3*c.grid.spacing):0,h=u?Math.max(Oa,3*u.grid.spacing):0,g=l.mean,_=(e,t)=>{let n=ja(l,e,t);if(n.out===0||!c)return n;let r=ja(c,e,t),i=ja(c,n.cx,n.cy).v;return{v:r.v+(n.v-i)*Math.max(0,1-n.out/m),out:r.out,cx:r.cx,cy:r.cy}},v=(e,t)=>{let n=_(e,t);if(n.out===0)return n.v;let r=n.v,i=n.out;if(u){let a=ja(u,e,t),o=ja(u,n.cx,n.cy).v;r=a.v+(_(n.cx,n.cy).v-o)*Math.max(0,1-n.out/h),i=a.out}return i>0?r+(g-r)*Math.min(1,i/Da):r},y=(e,t)=>Na(l.bounds,e,t)?Ma(l,e,t)?`terrain`:c&&Ma(c,e,t)?`farTerrain`:`filled`:c&&Na(c.bounds,e,t)?Ma(c,e,t)?`farTerrain`:`filled`:u&&Na(u.bounds,e,t)?Ma(u,e,t)?`skylineTerrain`:`filled`:`invented`,b=(e,t,n,r)=>{let i=Array.from({length:e.count},(t,n)=>e.start+n*e.spacing);for(let e of t){let t=i[0],n=i[i.length-1],r=[],a=[];for(let i=0;i<e.count;i++){let o=e.start+i*e.spacing;o<t-e.spacing*.25?r.push(o):o>n+e.spacing*.25&&a.push(o)}i=[...r,...i,...a]}return[...Ea.slice().reverse().map(e=>n-e),...i,...Ea.map(e=>r+e)]},x=[c,u].filter(e=>!!e).map(e=>e.grid),S=b({start:e.west,spacing:e.spacing,count:e.columns},x.map(e=>({start:e.west,spacing:e.spacing,count:e.columns})),p.west,p.east),C=b({start:e.south,spacing:e.spacing,count:e.rows},x.map(e=>({start:e.south,spacing:e.spacing,count:e.rows})),p.south,p.north),w=0;if(c)for(let e=0;e<c.known.length;e++)c.known[e]||w++;return{near:l,far:c,skyline:u,outer:p,heightAt:v,sourceAt:y,xs:S,ys:C,farUnknown:w}}Ea[Ea.length-1];function Fa(e){let t=Pa(e.terrain,e.farTerrain,e.skylineTerrain),{west:n,south:r,spacing:i,columns:a,rows:s}=e.terrain,c=t.near.h,l=(e,t)=>c[t*a+e],u=t.heightAt,d=(e.water??[]).filter(e=>Array.isArray(e?.rings)&&e.rings[0]?.length>=3),f=d.map(e=>e.elevationMeters??Math.min(...e.rings[0].map(([e,t])=>u(e,t))));d.forEach((e,t)=>{let[o,...u]=e.rings,d=o.map(e=>e[0]),p=o.map(e=>e[1]),m=Math.max(0,Math.floor((Math.min(...d)-n)/i)),h=Math.min(a-1,Math.ceil((Math.max(...d)-n)/i)),g=Math.max(0,Math.floor((Math.min(...p)-r)/i)),_=Math.min(s-1,Math.ceil((Math.max(...p)-r)/i));for(let e=g;e<=_;e++)for(let s=m;s<=h;s++){let d=n+s*i,p=r+e*i;Ia(d,p,o)&&!u.some(e=>Ia(d,p,e))&&(c[e*a+s]=Math.min(l(s,e),f[t]-2))}});let{xs:p,ys:m}=t,h=p.length,g=m.length,_=new Float32Array(h*g*3);for(let e=0;e<g;e++)for(let t=0;t<h;t++)_.set([p[t],u(p[t],m[e]),-m[e]],(e*h+t)*3);let v=new Uint32Array((h-1)*(g-1)*6),y=0;for(let e=0;e<g-1;e++)for(let t=0;t<h-1;t++){let n=e*h+t,r=n+1,i=n+h,a=i+1;v.set([n,r,i,r,a,i],y),y+=6}let b=new w;b.setAttribute(`position`,new o(_,3)),b.setIndex(new o(v,1)),b.computeVertexNormals(),b.computeBoundingSphere();let x=new $e(b);return x.receiveShadow=!0,x.frustumCulled=!1,{mesh:x,heightAt:(e,t)=>u(e,-t),bounds:t.near.bounds,farBounds:t.far?.bounds??null,skylineBounds:t.skyline?.bounds??null,ground:t,waterLevels:f}}function Ia(e,t,n){let r=!1;for(let i=0,a=n.length-1;i<n.length;a=i++){let[o,s]=n[i],[c,l]=n[a];s>t!=l>t&&e<(c-o)*(t-s)/(l-s)+o&&(r=!r)}return r}function La(e,t,n=null,r=2025.5){let[i,a]=e.camera?.position??[0,0],{fields:o,data:s,count:c}=e.trees,l=o.length,u=o.indexOf(`x`),d=o.indexOf(`y`),f=o.indexOf(`crownWidth`),p=o.indexOf(`height`),m=[];for(let t of e.openings??[])m.push(...t.rings);for(let t of e.roadScars??[])m.push(t.ring);let h=(e,t)=>Math.hypot(e-i,t-a)<=900,g=()=>({x0:1/0,x1:-1/0,y0:1/0,y1:-1/0}),_=g(),v=g(),y=(e,t,n,r=0)=>{e.x0=Math.min(e.x0,t-r),e.x1=Math.max(e.x1,t+r),e.y0=Math.min(e.y0,n-r),e.y1=Math.max(e.y1,n+r)};for(let e=0;e<c;e++){let t=s[e*l+u],n=s[e*l+d];y(v,t,n,20),h(t,n)&&y(_,t,n,20)}for(let e of m)for(let[t,n]of e)y(v,t,n,10),h(t,n)&&y(_,t,n,10);Number.isFinite(_.x0)||y(_,i,a,100);let b=e=>{let t=e*l,n=f>=0?s[t+f]:p>=0?s[t+p]*.25:4;return Math.max(.8,n*.55)},x=(e,t)=>{e.beginPath();for(let n of t)n.forEach(([t,n],r)=>r?e.lineTo(t,n):e.moveTo(t,n));e.fill(`evenodd`)},S=(e,t,n,r,i)=>{let a=Math.max(e.x0,t.west),o=Math.min(e.x1,t.east),s=Math.max(e.y0,t.south),c=Math.min(e.y1,t.north),l=Math.max(o-a,c-s,50),u=Math.min(2048,Math.max(64,Math.ceil(l/n))),d=l/u,f=e=>{let t=new OffscreenCanvas(u,u),n=t.getContext(`2d`);n.setTransform(1/d,0,0,-1/d,-a/d,(s+l)/d),n.fillStyle=`#fff`,e(n);let r=new OffscreenCanvas(u,u).getContext(`2d`,{willReadFrequently:!0});return r.filter=`blur(${Math.max(.6,1/d).toFixed(2)}px)`,r.drawImage(t,0,0),r.getImageData(0,0,u,u).data},p=e=>{let t=new Uint8Array(u*u*4);e.forEach((e,n)=>{let r=f(e);for(let e=0;e<u*u;e++)t[e*4+n]=r[e*4]});let n=new E(t,u,u);return n.magFilter=R,n.minFilter=D,n.generateMipmaps=!0,n.wrapS=n.wrapT=Fe,n.needsUpdate=!0,n};return{texture:p(r),cuts:p(i),west:a,north:s+l,side:l}},C=t=>n=>(e.openings??[]).forEach(e=>{let r=Math.round(Math.min(1,Math.max(0,t(e)))*255);n.fillStyle=`rgb(${r},${r},${r})`,x(n,e.rings)}),w=[C(e=>Fi(Ni(e))),C(Pi)],T=e=>t=>{for(let n=0;n<c;n++){let r=s[n*l+u],i=s[n*l+d];e(r,i)&&(t.beginPath(),t.arc(r,i,b(n),0,Math.PI*2),t.fill())}},O=S(_,t,.5,[T((e,t)=>e>=_.x0-20&&e<=_.x1+20&&t>=_.y0-20&&t<=_.y1+20),t=>(e.openings??[]).forEach(e=>x(t,e.rings)),t=>(e.roadScars??[]).filter(e=>e.kind===`cut`).forEach(e=>x(t,[e.ring])),t=>(e.roadScars??[]).filter(e=>e.kind!==`cut`).forEach(e=>x(t,[e.ring]))],w),k=v.x0<_.x0-200||v.x1>_.x1+200||v.y0<_.y0-200||v.y1>_.y1+200,A=n??t,j=k?S(v,{west:Math.min(A.west,t.west),south:Math.min(A.south,t.south),east:Math.max(A.east,t.east),north:Math.max(A.north,t.north)},2,[T(()=>!0),t=>(e.openings??[]).forEach(e=>x(t,e.rings))],w):null,M=qr(e.skylineTerrain),N=Ri(e.terrain),ee=Ri(e.farTerrain),te=Ri(e.skylineTerrain),P=j??O,ne=!N&&!ee&&!te?zi(e,{west:P.west,south:P.north-P.side,east:P.west+P.side,north:P.north},Math.max(10,P.side/2048)):null;return{...O,far:j,canopy:{near:Ra(N),far:Ra(ee),skyline:Ra(te),stems:Ra(ne)},cover:si(Jr(e),M,n??t,jr(r))}}function Ra(e){if(!e)return null;let t=new E(Vi(e),e.columns,e.rows);return t.magFilter=R,t.minFilter=D,t.generateMipmaps=!0,t.wrapS=t.wrapT=Fe,t.needsUpdate=!0,{texture:t,west:e.west,south:e.south,spacing:e.spacing,columns:e.columns,rows:e.rows}}var za=1024,Ba=5,Va=5/Ct.pine,Ha={depth:4/100,tile:Ba,fade:40},Ua=120,Wa=.55,Ga=null;function Ka(){let e=e=>new Promise((t,n)=>{let r=new Worker(new URL(new URL(`floor-worker-J-wgGYZA.js`,import.meta.url).href,``+import.meta.url),{type:`module`});r.onmessage=e=>(r.terminate(),t(e.data.out)),r.onerror=e=>(r.terminate(),n(Error(`floor worker: ${e.message}`))),r.postMessage({leaf:e,size:za})});return Ga??=Promise.all([e(null),e(gt.indexOf(`pine`))]).then(([e,t])=>({soil:e,needles:t})),Ga}var qa=(e,t)=>{let n=new E(new Uint8Array(e.buffer.slice(0)),za,za);return n.wrapS=n.wrapT=ye,n.magFilter=R,n.minFilter=D,n.generateMipmaps=!0,n.anisotropy=8,t&&(n.colorSpace=Ce),n.needsUpdate=!0,n};async function Ja(e){let t=await Ka(),n={map:qa(t.soil.albedo,!0),normal:qa(t.soil.normal,!1),height:qa(t.soil.rough,!1),needles:qa(t.needles,!1)},{masks:i,snow:o}=e,c=new lt({roughness:.95,metalness:0}),u=r.xz,f=H(S(u.mul(.31)),S(u.mul(.31).add(17))).mul(1.4),p=H(u.x.add(f.x).sub(i.west).div(i.side),u.y.add(f.y).add(i.north).div(i.side)),m=v(p.x.greaterThan(0).and(p.x.lessThan(1)).and(p.y.greaterThan(0)).and(p.y.lessThan(1)),W(1),W(0)),h=X(i.texture,p),g=X(i.texture,p).level(W(4)).r,_=h.r.mul(m),y=z(.08,.5,g).mul(m),b=h.g.mul(m),x=h.b.mul(m),C=h.a.mul(m),w=i.far,E=w?H(u.x.sub(w.west).div(w.side),u.y.add(w.north).div(w.side)):null,D=w&&E?v(E.x.greaterThan(0).and(E.x.lessThan(1)).and(E.y.greaterThan(0)).and(E.y.lessThan(1)),W(1),W(0)).mul(W(1).sub(m)):W(0),k=w&&E?X(w.texture,E):null,A=k?k.g.mul(D):W(0),j=X(i.cuts,p),N=w&&E?X(w.cuts,E):null,ee=b.add(A),te=j.r.mul(m).add(N?N.r.mul(D):W(0)),F=v(ee.greaterThan(.004),s(te.div(l(ee,1/255)),1).mul(40),W(1)).toVar(),re=H(u.x.add(S(u.mul(.02).add(7)).mul(18)),u.y.negate().add(S(u.mul(.02).add(13)).mul(18))),I=W(Wa);for(let e of[i.canopy.stems,i.canopy.skyline,i.canopy.far,i.canopy.near]){if(!e)continue;let t=H(re.x.sub(e.west).div(e.spacing).add(.5).div(e.columns),re.y.sub(e.south).div(e.spacing).add(.5).div(e.rows)),n=v(t.x.greaterThan(0).and(t.x.lessThan(1)).and(t.y.greaterThan(0)).and(t.y.lessThan(1)),W(1),W(0)),r=X(e.texture,t),i=z(.3,.9,r.g).mul(n);I=T(I,s(r.r.div(l(r.g,1/255)),1),i)}let ie=i.cover?li(i.cover,re.add(H(S(u.mul(.09).add(3)),S(u.mul(.09).add(5))).mul(5))).toVar():J(0,0,0,0),ae=ie.x,oe=ie.y,se=ie.z,L=ie.w,R=i.cover?.burn?ui(i.cover,re.add(H(S(u.mul(.09).add(3)),S(u.mul(.09).add(5))).mul(5)),e.coverGrade.viewYear):null,ce=R?R.share.toVar():W(0),le=R?R.age.toVar():W(0),ue=R?R.rocky.toVar():W(0),de=i.cover?.sea?di(i.cover,H(u.x,u.y.negate())).toVar():W(0),B=q(W(1).sub(L.mul(1-Kr[Ur.rock])).sub(se.mul(1-Kr[Ur.herb])).sub(oe.mul(1-Kr[Ur.shrub])).sub(ae.mul(1-Kr[Ur.sparse])).sub(ce),0,1),fe=W(1).sub(P(W(1).sub(q(I.mul(B),0,1)),Li)).mul(W(1).sub(A)).toVar(),pe=z(.55,.93,d.y),me=S(u.mul(.07)).mul(.5).add(.5),he=S(u.mul(.45).add(3)).mul(.5).add(.5),V=S(u.mul(1.7).add(9)).mul(.5).add(.5),ge=q(o.mul(pe.mul(.8).add(.25).mul(T(W(1),W(.5),_)).add(b.mul(.3)).sub(he.mul(.25)).add(.12)),0,1).toVar(),_e=H(0).toVar();c.colorNode=ne(()=>{let t=r.sub(K).length().toVar(),a=u.div(Ba).toVar(),o={x:a.dFdx().toVar(),y:a.dFdy().toVar()},s=W(1).sub(z(Ua*.6,Ua,t)).toVar(),c=q(T(W(.25),W(.95),y).mul(W(1).sub(x.add(C))).add(b.mul(-.1)),0,1).toVar(),f=(e,t,r)=>X(n.needles,e.mul(Va)).level(M(l(O(Z(t).mul(Z(r))).mul(Va*za),1))),p=e=>v(e.r.greaterThan(.003).and(e.a.sub(.1).div(.9).lessThan(c)),W(1),W(0)),h=pt(n.height,a,o.x,o.y,Ha,(e,t,r,i)=>{let a=f(t,r,i);return l(X(n.height,t).grad(r,i).r,a.r.mul(p(a)))},s.mul(W(1).sub(ge))),g=X(n.map,h).grad(o.x,o.y).rgb.mul(2),_=g.mul(W(.5).div(g.add(.25)).min(1.2)),w=X(n.height,h).grad(o.x,o.y).r,E=X(n.normal,h).grad(o.x,o.y).xyz.mul(2).sub(1),D=f(h,o.x,o.y),k=T(p(D).mul(v(D.r.greaterThan(w),W(1),W(0))),c.mul(.85),W(1).sub(s)),j=T(D.a,W(.6),W(1).sub(s)),N=U(.22,.125,.07).mul(T(W(.55),W(1.1),j)).mul(dt(j.mul(37.1)).mul(.3).add(.85)),ee=T(_,N,k).toVar(),te=z(.5,.72,me.mul(.7).add(he.mul(.3))).mul(.55).mul(W(1).sub(k.mul(.7)));ee.assign(T(ee,U(.05,.095,.03).mul(V.mul(.3).add(.85)),te));let ne=T(U(.11,.14,.05),U(.19,.2,.09),me).mul(V.mul(.3).add(.85)),re=T(_,ne,z(.3,.7,he.mul(.6).add(.4)).mul(.75)),I=T(re,ee,y).toVar(),ie=_.mul(U(1.08,1,.92)),B=U(.2,.18,.1).mul(V.mul(.4).add(.75)),pe=U(.3,.24,.17).mul(V.mul(.25).add(.85)),ve=S(u.mul(6.3)).mul(.5).add(.5),ye=T(T(ie,B,z(.35,.75,he.mul(.6).add(ve.mul(.4))).mul(.6)),pe,z(.66,.82,me).mul(.45)),be=O(Z(u.dFdx()).mul(Z(u.dFdy()))).max(.01).toVar(),xe=(e,t)=>S(u.mul(e).add(t)).mul(W(1).sub(z(.2,.45,be.mul(e)))),Se=(e,t)=>q(e.add(t.mul(W(1).sub(Ke(e.mul(2).sub(1)).mul(.6)))),0,1),Ce=xe(.55,21),we=xe(.14,33),Te=xe(.055,37),Ee=S(u.mul(.03).add(41)),De=U(.17,.12,.078).mul(Ce.mul(.12).add(1)),Oe=U(.175,.152,.122).mul(Ce.mul(.18).add(.95)),ke=T(De,Oe,Se(W(.45),we.mul(.6).add(Te.mul(.6)).add(Ce.mul(.3)))).mul(Te.mul(.12).add(we.mul(.08)).add(Ee.mul(.05)).add(1)).toVar();ke.assign(T(ye,ke,z(Ua*.5,Ua*1.4,t)));let Ae=Ai,je=z(Ae.shrubStart,Ae.shrubFull,F).mul(ji).add(z(Ae.shrubFull,Ae.greenFull,F).mul(1-ji)).mul(1-Mi).add(Mi),Me=T(U(.045,.072,.03),U(.07,.095,.04),z(-.3,.5,Te)).mul(Ce.mul(.2).add(we.mul(.12)).add(1)),Ne=T(ke,Me,Se(je,we.mul(.6).add(Te.mul(.5)).add(Ee.mul(.15)))),Pe=U(.05,.082,.037).mul(xe(.3,51).mul(.3).add(xe(.07,53).mul(.25)).add(Te.mul(.1)).add(1)),Fe=T(Ne,Pe,z(Ae.standStart,Ae.standFull,F)).toVar(),{q:Ie,foot:Le,dist:G}=gi(),Re=xi(r,Le,G,{px:1,minCell:.3,offset:131}).mul(.8).add(xi(r,Le,G,{px:2.6,minCell:1.2,offset:137}).mul(.3)).toVar(),ze=e=>U(e[0],e[1],e[2]),Be=we.mul(.5).add(Te.mul(.5)).add(Ee.mul(.3)),Ve=T(T(ze(Ii.base),ze(Ii.dark),z(.35,.9,Re.negate()).mul(.65)),ze(Ii.light),z(.3,.85,Re).mul(.7)).mul(Be.mul(.07).add(1)),He=e.coverGrade.via.mul(W(1).sub(z(Ii.maxAge,Ii.maxAge+Ii.fade,F)));Fe.assign(T(Fe,Ve,He)),I.assign(T(I,T(Fe,N,k.mul(.6).mul(s)),b));let Ue=W(1).sub(z(.6,.8,d.y)).toVar(),We=xe(.022,101),J=xe(.09,103),Ge=xe(.35,107),Y=xe(1.4,109),qe=T(U(.4,.36,.27),U(.5,.455,.34),z(-.5,.6,We.mul(.6).add(J.mul(.4)))),Je=W(1).sub(z(.2,.45,be.mul(.1))),Ye=S(U(u.x.mul(.1),r.y.mul(.012),u.y.mul(.1)).add(31)).mul(Je),Xe=z(.72,.95,W(1).sub(Ke(xe(.03,113)))),Ze=q(Xe.mul(.3).add(Ye.mul(.5).add(.5).mul(Ue).mul(.3)),0,.6),Qe=Se(W(.12).mul(W(1).sub(Ue.mul(.5))),Ge.mul(.5).add(Y.mul(.4)).sub(.25)),$e=U(.48,.44,.34).mul(Y.mul(.12).add(Ge.mul(.08)).add(1)),et=qe.mul(J.mul(.08).add(Ge.mul(.1)).add(Y.mul(.08)).add(1)).mul(W(1).sub(Ze)).mul(T(W(1),W(.86),Ue)),tt=T(T($e,et,z(.15,.6,Ue)),U(.05,.065,.035),Qe),nt=T(U(.15,.18,.055),U(.24,.21,.11),z(-.35,.5,We.mul(.4).add(J.mul(.5)).add(Ge.mul(.3)))).mul(Ge.mul(.1).add(Y.mul(.1)).add(1)),rt=z(.35,.75,Ge.mul(.6).add(Y.mul(.4)).mul(.5).add(.5)),it=T(T(U(.05,.062,.03),U(.075,.088,.042),z(-.4,.5,J)).mul(T(W(1),W(.6),rt.mul(.6))),nt.mul(.8),z(.45,.8,We.mul(.5).add(J.mul(.5))).mul(.25)),at=T(nt.mul(U(1.05,1,.95)),qe.mul(.85),z(.2,.7,J.mul(.5).add(.5)).mul(.3)),ot=q(L.add(se).add(oe),0,1).toVar(),st=mi(tt.mul(L).add(nt.mul(se)).add(it.mul(oe)).div(l(ot,.001)),e.coverGrade).toVar(),ct=mi(at,e.coverGrade),lt=W(1).sub(b);I.assign(T(I,ct,ae.mul(W(1).sub(y.mul(.7))).mul(.85).mul(lt))),I.assign(T(I,st,L.add(se.add(oe).mul(W(1).sub(y.mul(.6)))).min(1).mul(lt)));let ut=Cr,Q=xr,ft=e=>U(e[0],e[1],e[2]),mt=T(ft(ut.ash),ft(ut.ashGrey),z(.1,.7,J.mul(.5).add(Ge.mul(.5)).mul(.5).add(.5)).mul(.6)),ht=T(ft(ut.herb),ft(ut.herbDry),z(-.3,.6,We.mul(.5).add(J.mul(.4)).add(Ge.mul(.2)))).mul(Ge.mul(.1).add(Y.mul(.1)).add(1)),gt=Se(z(Q.shrubStart,Q.shrubFull,le),J.mul(.5).add(Ge.mul(.4)).add(We.mul(.3))),_t=mi(T(T(T(mt,ht,z(0,Q.herbFull,le)),ft(ut.shrub).mul(Ge.mul(.15).add(1)),gt),Pe,z(Q.regenStart,Q.regenFull,le)),e.coverGrade).toVar();I.assign(T(I,_t,ce.mul(lt)));let vt=mi(tt.mul(.85),e.coverGrade);I.assign(T(I,vt,ue.mul(lt).mul(W(1).sub(y.mul(.45)))));let yt=U(.4,.39,.36).mul(V.mul(.3).add(.8)),bt=T(U(.44,.33,.21).mul(he.mul(.25).add(.85)),yt,z(.4,.7,S(u.mul(.9)).mul(.5).add(.5))),xt=T(U(.38,.35,.3),_.mul(1.4),.35).mul(V.mul(.2).add(.9));I.assign(T(I,bt,x)),I.assign(T(I,xt,C.mul(W(1).sub(x))));let St=vi(Ie,Le,G,{px:1.1,stretch:5,minCell:4,offset:61}),Ct=vi(Ie,Le,G,{px:3,stretch:4,minCell:10,offset:71}),wt=xe(.055,75),Tt=S(u.mul(.012).add(81)),Et=S(u.mul(.0035).add(91)),Dt=Se(fe,St.mul(.7).add(Ct.mul(.35)).add(wt.mul(.2))),Ot=T(U(.05,.08,.04),U(.08,.105,.05),z(.1,.8,Et).mul(.5)).mul(Tt.mul(.08).add(1)).mul(Ct.mul(.12).add(wt.mul(.06)).add(1)),kt=T(re.mul(.75),U(.14,.13,.105).mul(Te.mul(.15).add(Ee.mul(.1)).add(1)),.55),At=T(T(kt,re.mul(.35),z(0,.6,fe)),ct,ae),jt=vi(Ie,Le,G,{px:1,stretch:6,minCell:2,offset:151}).mul(.6).add(vi(Ie,Le,G,{px:2.5,stretch:5,minCell:6,offset:157}).mul(.4)).mul(z(800,2500,t)).mul(.14).add(1).toVar(),Mt=st.mul(T(jt,W(1),q(L.div(l(ot,.001)),0,1))),Nt=T(T(T(At.mul(jt),vt.mul(.85),ue),Ot,Dt),Mt,ot).toVar();if(R){let t=z(.05,.5,vi(Ie,Le,G,{px:1,stretch:7,minCell:3,offset:141}).negate());Nt.assign(T(Nt,T(_t.mul(.9),mi(ft(ut.snag),e.coverGrade),t.mul(.5)),ce))}if(I.assign(T(T(Nt,Fe,A),I,m)),i.cover?.sea){let t=W(1).sub(q(K.sub(r).normalize().y,0,1)),n=mi(T(U(.05,.08,.115),U(.2,.27,.36),P(t,8)),e.coverGrade);I.assign(T(I,n,de))}I.assign(I.mul(W(1).sub(e.wet.mul(.35))));let Pt=S(u.mul(.9).add(5)).mul(.5).add(.5),Ft=T(U(.58,.62,.7),U(.72,.74,.78),z(.2,.7,ge)).mul(he.mul(.1).add(Pt.mul(.06)).add(.88));I.assign(T(I,Ft,ge));let It=T(E,U(D.g.mul(2).sub(1),D.b.mul(2).sub(1),.5),k.mul(s));return _e.assign(H(It.x,It.y.negate()).mul(s.mul(.8).mul(W(1).sub(ge)).mul(m))),I})();let ve=d.add(U(_e.x,0,_e.y)).normalize();c.normalNode=Me.mul(J(ve,0)).xyz.normalize(),c.roughnessNode=T(T(T(W(.95),W(.55),e.wet),W(.8),ge),W(.35),de);let ye=W(1).sub(l(g.mul(m).mul(.6),W(1).sub(m).mul(fe).mul(.4)));return c.receivedShadowNode=a(e.fadeShadow(ye)),c}var Ya=(e,t,n=.85)=>T(e,U(.7,.73,.78),q(t.mul(z(.35,.8,d.y)).mul(n),0,1));async function Xa(e,t,n){let i=e.debris;if(!i?.count)return null;let a=i.fields.length,o=i.fields.indexOf(`x`),s=i.fields.indexOf(`y`),c=i.fields.indexOf(`z`),l=i.fields.indexOf(`footprint`),u=zt(0),d=[],f=[],p=[],m=new Ze,h=new Q,g=new V,_=new V,v=(e,n,r,i,a)=>(m.setFromEuler(h.set((u()-.5)*.3,u()*Math.PI*2,Math.PI/2+(u()-.5)*.35,`YXZ`)),new xe().compose(_.set(e,t(e,n)+i+r,n),m,g.set(i,a,i)));for(let e=0;e<i.count;e++){let n=e*a,r=i.data[n+o],y=-i.data[n+s],b=Math.max(1,l>=0?i.data[n+l]:3);u=zt(Rt(i.data[n+o],i.data[n+s]));let x=Number.isFinite(i.data[n+c])&&c>=0?Math.min(i.data[n+c],t(r,y)):t(r,y),S=.12+b*(.03+u()*.05);m.setFromEuler(h.set(0,u()*Math.PI*2,0)),d.push(new xe().compose(_.set(r,x-.06,y),m,g.set(b*.5,S,b*(.3+u()*.18))));let C=1+Math.floor(u()*Math.min(4,b*.8));for(let e=0;e<C;e++){let e=b*(.5+u()*.6)+1,t=.07+u()*.13;f.push(v(r+(u()-.5)*b*.7,y+(u()-.5)*b*.7,u()<.5?S*(.3+u()*.5):0,t,e))}let w=8+Math.round(b*4);for(let e=0;e<w;e++){let e=u()*Math.PI*2,t=Math.sqrt(u())*b*.75,n=1-t/(b*.75);p.push(v(r+Math.cos(e)*t,y+Math.sin(e)*t,S*n*(.4+u()*.7),.015+u()*.035,.6+u()*2.4))}}let y=new F;y.name=`debris`;let b=new lt({roughness:1,metalness:0});b.colorNode=ne(()=>{let e=r,t=S(U(e.x.mul(7),e.y.mul(3),e.z.mul(7))).mul(.5).add(.5),i=z(.35,.6,S(e.mul(14)).mul(.5).add(.5)),a=T(U(.05,.04,.03),T(U(.12,.095,.07),U(.17,.14,.105),t),i.mul(.7).add(.3));return Ya(T(a,U(.22,.1,.045).mul(i.mul(.6).add(.4)),z(.5,.8,S(e.xz.mul(.7))).mul(.6)),n)})();let C=new ue(1,20,6,0,Math.PI*2,0,Math.PI/2),w=C.attributes.position,O=zt(77),k=Array.from({length:7},()=>[O()*Math.PI*2,1+Math.floor(O()*4),O()*.14]);for(let e=0;e<w.count;e++){let t=w.getX(e),n=w.getY(e),r=w.getZ(e),i=Math.atan2(r,t),a=1+k.reduce((e,[t,r,a])=>e+Math.sin(i*r+t+n*5)*a,0);w.setXYZ(e,t*a,n*(.6+.6*a*O()),r*a)}C.computeVertexNormals();let A=new se(C,b,d.length);d.forEach((e,t)=>A.setMatrixAt(t,e));let j=await fn(`pine`),M=Math.round(Math.sqrt(j.px.length/4)),N=new E(new Uint8Array(j.px.buffer.slice(0)),M,M);N.colorSpace=Ce,N.wrapS=N.wrapT=ye,N.magFilter=R,N.minFilter=D,N.generateMipmaps=!0,N.needsUpdate=!0;let ee=e=>{let t=new lt({roughness:.92,metalness:0});return t.colorNode=ne(()=>{let t=et(`position`,`vec3`),r=et(`instanceLength`,`float`),i=X(N,H(Xe().x,t.y.mul(r).mul(.35))).rgb.mul(U(.75,.68,.62)),a=T(i,U(.32,.3,.27),W(e)),o=z(.49,.5,t.y.abs()).mul(z(.7,.9,et(`normal`,`vec3`).y.abs()));return Ya(T(a,U(.6,.48,.32),o),n,.7)})(),t},te=(e,t,n)=>{let r=new x(1,1,1,t,1),i=new Float32Array(e.length);e.forEach((e,t)=>i[t]=new V().setFromMatrixColumn(e,1).length()),r.setAttribute(`instanceLength`,new qe(i,1));let a=new se(r,ee(n),e.length);return e.forEach((e,t)=>a.setMatrixAt(t,e)),a},P=te(f,10,.15),re=te(p,5,.35);for(let e of[A,P,re])e.instanceMatrix.needsUpdate=!0,e.castShadow=e.receiveShadow=!0,e.layers.enable(1),e.computeBoundingSphere(),y.add(e);return y}function Za(e,t=30){let n=1/0,r=-1/0,i=1/0,a=-1/0;for(let t of e)for(let e of t)for(let t of e)n=Math.min(n,t[0]),r=Math.max(r,t[0]),i=Math.min(i,t[1]),a=Math.max(a,t[1]);n-=5,r+=5,i-=5,a+=5;let o=Math.max(16,Math.min(512,Math.ceil(Math.max(r-n,a-i)/2))),s=[];for(let t of e)for(let e of t)for(let t=0;t<e.length;t++){let n=[...e[t],...e[(t+1)%e.length]];s.push(n[0],n[1],n[2],n[3])}let c=s.length/4,l=Math.max(1,Math.floor((r-n)/t)+1),u=Math.max(1,Math.floor((a-i)/t)+1),d=(e,n,r)=>Math.min(r-1,Math.max(0,Math.floor((e-n)/t))),f=e=>{let o=s[e*4],c=s[e*4+1],f=s[e*4+2],p=s[e*4+3];if(!(Number.isFinite(o)&&Number.isFinite(c)&&Number.isFinite(f)&&Number.isFinite(p)))return[0,l-1,0,u-1];let m=Math.min(o,f)-t,h=Math.max(o,f)+t,g=Math.min(c,p)-t,_=Math.max(c,p)+t;return h<n-t||m>r+t||_<i-t||g>a+t?null:[Math.max(0,d(m,n,l)-1),Math.min(l-1,d(h,n,l)+1),Math.max(0,d(g,i,u)-1),Math.min(u-1,d(_,i,u)+1)]},p=new Uint32Array(l*u+1),m=[];for(let e=0;e<c;e++){let t=f(e);if(m.push(t),t)for(let e=t[2];e<=t[3];e++)for(let n=t[0];n<=t[1];n++)p[e*l+n+1]++}for(let e=0;e<l*u;e++)p[e+1]+=p[e];let h=new Uint32Array(p[l*u]),g=p.slice(0,l*u);for(let e=0;e<c;e++){let t=m[e];if(t)for(let n=t[2];n<=t[3];n++)for(let r=t[0];r<=t[1];r++)h[g[n*l+r]++]=e}let _=new Uint8Array(o*o*4);for(let e=0;e<o;e++){let c=i+(e+.5)/o*(a-i),f=d(c,i,u);for(let i=0;i<o;i++){let a=n+(i+.5)/o*(r-n),u=f*l+d(a,n,l),m=t*t;for(let e=p[u];e<p[u+1];e++){let n=h[e]*4,r=s[n],i=s[n+1],o=s[n+2],l=s[n+3];if(Math.min(r,o)-a>t||a-Math.max(r,o)>t||Math.min(i,l)-c>t||c-Math.max(i,l)>t)continue;let u=o-r,d=l-i,f=u*u+d*d,p=f>0?Math.max(0,Math.min(1,((a-r)*u+(c-i)*d)/f)):0;m=Math.min(m,(r+p*u-a)**2+(i+p*d-c)**2)}_[(e*o+i)*4]=Math.round(Math.sqrt(m)/t*255),_[(e*o+i)*4+3]=255}}return{px:_,size:o,west:n,south:i,east:r,north:a}}function Qa(){let e=mt(7,8,4),t=new Float32Array(65536);for(let n=0;n<256;n++)for(let r=0;r<256;r++)t[n*256+r]=e(r/256,n/256);let n=new Uint8Array(262144);for(let e=0;e<256;e++)for(let r=0;r<256;r++){let i=(t[e*256+(r+1)%256]-t[e*256+(r+256-1)%256])*18,a=(t[(e+1)%256*256+r]-t[(e+256-1)%256*256+r])*18,o=Math.hypot(i,a,1);n.set([(-i/o*.5+.5)*255,(-a/o*.5+.5)*255,(1/o*.5+.5)*255,255],(e*256+r)*4)}let r=new E(n,256,256);return r.wrapS=r.wrapT=ye,r.magFilter=R,r.minFilter=D,r.generateMipmaps=!0,r.needsUpdate=!0,r}var $a=Number(new URLSearchParams(location.search).get(`blursign`)??1),eo=e=>e>0?.003+.00512*e:0;function to(e,t=30){let{px:n,size:r,west:i,south:a,east:o,north:s}=Za(e,t),c=new E(n,r,r);return c.magFilter=c.minFilter=R,c.needsUpdate=!0,{texture:c,west:i,south:a,east:o,north:s}}function no(e,n,r){let i=(e.water??[]).filter(e=>Array.isArray(e?.rings)&&e.rings[0]?.length>=3);if(!i.length)return null;let a=Qa(),o=new Map;for(let[e,t]of i.entries()){let r=t.rings[0],i=Math.round(n[e]*10)/10,a=(e,t)=>(e.forEach(([e,n],r)=>r?t.lineTo(e,n):t.moveTo(e,n)),t),s=a(r,new ze);for(let e of t.rings.slice(1))e.length>=3&&s.holes.push(a(e,new je));o.has(i)||o.set(i,{shapes:[],rings:[]}),o.get(i).shapes.push(s),o.get(i).rings.push(t.rings.filter(e=>e.length>=3))}let s=new F;s.name=`water`;let c=B(r.sunDir.clone()),l=B(new V(r.sunColour.r,r.sunColour.g,r.sunColour.b)),u=new t(862762),d=B(new V(u.r,u.g,u.b)),f={slope:B(0),via:B(1)},p=[];for(let[e,{shapes:t,rings:n}]of o){let r=new Oe(t,4),i=to(n),o=new $e(r,ro(a,c,l,d,f,i,e=>o.add(e),e=>p.push(e)));o.rotation.x=-Math.PI/2,o.position.y=e,o.receiveShadow=!0,o.name=`water-${e}`,s.add(o)}return{group:s,update:()=>{c.value.copy(r.sunDir),l.value.set(r.sunColour.r,r.sunColour.g,r.sunColour.b)},setLook:e=>{f.slope.value=Math.sqrt(eo(e.windMs)),f.via.value=+(e.look===`via`);for(let t of p)t.resolutionScale=e.full?1:.5}}}function ro(e,t,n,i,a,o,s,c){let u=new he,d=X(e),f=n,p=i,m=(e=>{let t=oe(we(e,103),H(we(Je,17),we(Je,29))),n=we(e,107).sub(H(we(Je,-19),we(Je,31))),r=oe(we(e,H(897,983)),H(we(Je,101),we(Je,97))),i=be(we(e,H(1091,1027)),H(we(Je,109),we(Je,-113)));return d.sample(t).add(d.sample(n)).add(d.sample(r)).add(d.sample(i)).mul(.5).sub(1)})(r.xz.mul(56)),h=g(U(m.x.mul(a.slope.div(.35)),1,m.y.mul(a.slope.div(.35)))),_=K.sub(r),v=g(_),y=g(ee(t.negate(),h)),b=l(0,Y(v,y)),x=f.mul(P(b,l(W(60),W(2).div(l(a.slope.mul(a.slope),1e-4))))).mul(a.slope.greaterThan(0).select(W(2),W(.6))),S=f.mul(l(Y(t,h),0)).mul(.5),C=Z(_),w=h.xz.mul(W(.001).add(W(1).div(C))).mul(a.slope.mul(4)),E=H(r.x.sub(o.west).div(o.east-o.west),r.z.negate().sub(o.south).div(o.north-o.south)),D=X(o.texture,E).r.mul(30);return u.colorNode=ne(()=>{let e=re({resolutionScale:.5});c(e.reflector),e.uvNode=e.uvNode.add(w),s(e.target);let n=a.slope.mul($a*.05).div(l(C.div(400),1)),r=t=>{let r=re({reflector:e.reflector});return r.uvNode=e.uvNode.add(H(0,n.mul(t))),r.rgb},i=e.rgb.mul(.3).add(r(1).mul(.25)).add(r(2).mul(.2)).add(r(3).mul(.15)).add(r(4).mul(.1)),o=l(Y(v,h),0),u=W(.02),d=Pe(P(W(1).sub(o),5),W(1).sub(u)).add(u),m=p.mul(l(0,Y(h,v))),g=S.mul(.3).add(m),_=U(.16,.2,.25),y=T(i.mul(.85),T(i.mul(.78),_.mul(Y(i,U(.3,.59,.11)).mul(1.4)),.3),a.via),b=g.mul(W(1).sub(d)).add(y.add(x).mul(d)).toVar(),E=W(1).sub(z(0,6,D));b.assign(b.mul(T(W(1),W(.72),E)));let O=U(.42,.35,.25).mul(f.mul(l(t.y,.2)).mul(.35).add(.25));return b.assign(T(b,O,W(1).sub(z(.6,2.2,D)).mul(a.via))),b})(),u}var io={ground:`bare`,weather:`clear`},ao=[`bare`,`snow`],oo=[`clear`,`overcast`,`rain`,`snow`];function so(e){if(!e)return null;let t=e=>e==null||e===``||!Number.isFinite(Number(e))?void 0:Number(e),n=typeof e.dateTime==`string`&&!Number.isNaN(Date.parse(e.dateTime))?e.dateTime:void 0,r=typeof e.utc==`string`&&!Number.isNaN(Date.parse(e.utc))?e.utc:void 0,i=typeof e.timeZone==`string`&&co(e.timeZone)?e.timeZone:void 0,a=e.sun===`true`?`true`:`daylight`,o=ao.includes(e.ground)?e.ground:`bare`,s=oo.includes(e.weather)?e.weather:`clear`,c=e.sunPosition,l=t(c?.elevationDegrees),u=t(c?.azimuthDegrees),d=l!==void 0&&u!==void 0?{elevationDegrees:l,azimuthDegrees:u}:void 0,f=t(e.cloudCover),p=t(e.visibilityKm),m=f===void 0?void 0:Math.min(1,Math.max(0,f)),h=p!==void 0&&p>0?p:void 0,g=t(e.windMs),_=g===void 0?void 0:Math.min(20,Math.max(0,g)),v=e.look===`photo`?`photo`:e.look===`via`?`via`:void 0;return{dateTime:n,timeZone:i,utc:r,sun:a,latitude:t(e.latitude),longitude:t(e.longitude),sunPosition:d,ground:o,weather:s,cloudCover:m,visibilityKm:h,windMs:_,look:v}}function co(e){try{return new Intl.DateTimeFormat(`en-US`,{timeZone:e}),!0}catch{return!1}}function lo(e,t){let n=Date.parse(`${e}Z`),r=e=>{let n=Object.fromEntries(new Intl.DateTimeFormat(`en-US`,{timeZone:t,hourCycle:`h23`,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`}).formatToParts(new Date(e)).map(e=>[e.type,e.value]));return Date.UTC(+n.year,n.month-1,+n.day,+n.hour,+n.minute,+n.second)-Math.floor(e/1e3)*1e3},i=n-r(n);return i=n-r(i),new Date(i)}function uo(e){return e.utc?new Date(e.utc):e.dateTime?!/(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(e.dateTime)&&/T\d/.test(e.dateTime)&&e.timeZone&&!Number.isNaN(Date.parse(`${e.dateTime}Z`))?lo(e.dateTime,e.timeZone):new Date(e.dateTime):null}function fo(e){let t=e.get(`env`);if(t)try{return so(JSON.parse(t))}catch{return null}let n=[`dateTime`,`utc`,`timeZone`,`sun`,`latitude`,`longitude`,`ground`,`weather`,`cloudCover`,`visibilityKm`,`windMs`,`look`];return n.some(t=>e.has(t))?so(Object.fromEntries(n.map(t=>[t,e.get(t)??void 0]))):null}function po(e,t,n){let r=Math.PI/180,i=(e.getTime()/864e5+2440587.5-2451545)/36525,a=((280.46646+i*(36000.76983+i*3032e-7))%360+360)%360,o=357.52911+i*(35999.05029-1537e-7*i),s=.016708634-i*(42037e-9+1.267e-7*i),c=Math.sin(o*r)*(1.914602-i*(.004817+14e-6*i))+Math.sin(2*o*r)*(.019993-101e-6*i)+Math.sin(3*o*r)*289e-6,l=125.04-1934.136*i,u=a+c-.00569-.00478*Math.sin(l*r),d=23+(26+(21.448-i*(46.815+i*(59e-5-i*.001813)))/60)/60+.00256*Math.cos(l*r),f=Math.asin(Math.sin(d*r)*Math.sin(u*r)),p=Math.tan(d*r/2)**2,m=4/r*(p*Math.sin(2*a*r)-2*s*Math.sin(o*r)+4*s*p*Math.sin(o*r)*Math.cos(2*a*r)-.5*p*p*Math.sin(4*a*r)-1.25*s*s*Math.sin(2*o*r)),h=(((e.getUTCHours()*60+e.getUTCMinutes()+e.getUTCSeconds()/60+m+4*n)%1440+1440)%1440/4-180)*r,g=t*r,_=Math.min(1,Math.max(-1,Math.sin(g)*Math.sin(f)+Math.cos(g)*Math.cos(f)*Math.cos(h)));return{elevation:90-Math.acos(_)/r,azimuth:((Math.atan2(Math.sin(h),Math.cos(h)*Math.sin(g)-Math.tan(f)*Math.cos(g))/r+180)%360+360)%360}}var mo={elevation:50,azimuth:200};function ho(e,t){if(e.sunPosition)return{elevation:e.sunPosition.elevationDegrees,azimuth:e.sunPosition.azimuthDegrees};let n=uo(e);if(!n)return mo;let r=e.latitude??t?.lat,i=e.longitude??t?.lng;return r===void 0||i===void 0?mo:po(n,r,i)}var go=e=>e-Math.floor(e);function _o(e,t){let n=go(e*.1031),r=go(t*.103),i=go(e*.0973),a=n*(r+33.33)+r*(i+33.33)+i*(n+33.33);return n+=a,r+=a,i+=a,[go((n+r)*i)*2-1,go((n+i)*r)*2-1]}function vo(e,t){let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=e=>e*e*e*(e*(e*6-15)+10),s=o(i),c=o(a),l=(e,t)=>{let[o,s]=_o(n+e,r+t);return o*(i-e)+s*(a-t)},u=l(0,0),d=l(1,0),f=l(0,1),p=l(1,1);return((u+(d-u)*s)*(1-c)+(f+(p-f)*s)*c)*1.6}function yo(e,t){let n=0,r=1;for(let i=0;i<4;i++)n+=r*vo(e,t),r*=.5,e*=2,t*=2;return n}var bo=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)},xo={scale:2e-4,density:.4,elevation:.5},So=(()=>{let e=6e3,t=[],n=Math.PI*(3-Math.sqrt(5));for(let r=0;r<e;r++){let i=(r+.5)/e,a=Math.sqrt(1-i*i),o=r*n;t.push([Math.cos(o)*a,i,Math.sin(o)*a])}return t})();function Co(e,t,n=xo){if(!(e[1]>0)||!(t>0))return 0;let r=1+-.9*n.elevation,i=e[0]/(e[1]*r)*n.scale,a=e[2]/(e[1]*r)*n.scale,o=Math.min(1,Math.max(0,yo(i*1e3,a*1e3)*.7+.5)),s=vo(i*300,a*300)*.37+.5,c=1-Math.min(1,Math.max(0,t+(s-.5)*.6)),l=bo(0,.03+.06*n.elevation,e[1]),u=Math.max(0,o-c);return(1-Math.exp(-u*n.density*12))*l}function wo(e,t=xo){if(!(e>0))return 0;let n=0;for(let r of So)n+=Co(r,e,t);return n/So.length}var To=wo(1),Eo=new Map;function Do(e){let t=xo.density;if(!(e>0))return{coverage:0,density:t};let n=Math.round(Math.min(1,e)*1e3),r=Eo.get(n);if(r)return r;let i=(t,n,r)=>{for(let i=0;i<18;i++){let i=(n+r)/2;t(i)<e?n=i:r=i}return(n+r)/2},a=e<To?{coverage:i(e=>wo(e),0,1),density:t}:{coverage:1,density:i(e=>wo(1,{...xo,density:e}),t,40)};return Eo.set(n,a),a}var Oo=e=>3.912/(Math.max(.01,e)*1e3),ko=18e3,Ao=new URLSearchParams(location.search),jo=Number(Ao.get(`smap`)??4096),Mo=Number(Ao.get(`shalf`)??220),No=60,Po={clear:{sky:`clear`,grey:new t(.62,.66,.7),sun:3.2,hemi:1.3,shadows:!0,visibilityKm:50,exposure:.9,rays:!0},overcast:{sky:`grey`,grey:new t(.58,.61,.64),sun:.35,hemi:2.5,shadows:!1,visibilityKm:25,exposure:1,rays:!1},rain:{sky:`grey`,grey:new t(.42,.45,.48),sun:.2,hemi:2.3,shadows:!1,visibilityKm:8,exposure:1.05,rays:!1},snow:{sky:`grey`,grey:new t(.7,.72,.75),sun:.25,hemi:2.6,shadows:!1,visibilityKm:3,exposure:1,rays:!1}},Fo=.18,Io=1e3,Lo=.97;function Ro(n,i,a=0){let o=Math.max(ko,a),c=new bt;c.scale.setScalar(o),c.turbidity.value=2.4,c.rayleigh.value=1.6,c.mieCoefficient.value=.003,c.mieDirectionalG.value=.78,c.cloudCoverage.value=.18,c.cloudSpeed.value=0,c.material.fog=!1,c.renderOrder=2;let u=B(new t(.5,.53,.56)),d=B(new t(.62,.65,.68)),f=new le({side:1,depthWrite:!1,fog:!1});f.colorNode=T(d,u,z(-.05,.6,ft.normalize().y));let m=new $e(new ue(1,32,16),f);m.scale.setScalar(o*.98),m.renderOrder=2,m.frustumCulled=!1,n.add(c,m);let h=new Ge,g=new bt;for(let e of[`turbidity`,`rayleigh`,`mieCoefficient`,`mieDirectionalG`,`cloudCoverage`,`cloudSpeed`])g[e].value=c[e].value;g.scale.setScalar(100);let _=new $e(m.geometry,f);_.scale.setScalar(98),h.add(g,_);let v=new De(64,{type:p,generateMipmaps:!0,minFilter:D}),x=new Ne(1,1e3,v),S=B(Oo(50)),C=B(1.2),w=e=>{let t=e.sub(K),n=G(v.texture,U(t.x,Z(t.xz).mul(.02).add(.001),t.z).normalize()).level(W(2)).rgb,r=l(Y(n,U(.2126,.7152,.0722)),1e-4);return n.mul(s(W(1),C.div(r)))},E=B(0),O=e=>W(1).sub(Be(S.negate().mul(l(Z(e.sub(K)).sub(E),0))));n.fogNode=at(w(r),O(r));let k=new y(12375020,4867634,1.3),A=new b(16773596,3.2);A.castShadow=!0,A.shadow.mapSize.set(jo,jo),A.shadow.camera.layers.set(1);for(let e of[k,A])e.layers.enable(2);n.add(k,A,A.target);let j=new V(0,1,0),M=new V(0,1,0),N=B(0),ee=B(0),te=B(1),P=Po.clear,F=!0,re=B(A.shadow.matrix),I=(e,t=r)=>ne(([n])=>{let r=re.mul(J(t,1)).xy,i=l(Ke(r.x.sub(.5)),Ke(r.y.sub(.5))).mul(2);return T(T(W(1),n,te),T(W(1),e,te),z(.75,.97,i))}),ie=0,ae=0,oe=Mo,se=()=>ie*2.5+400;function L(e,t){let n=Math.max(.1,M.y),r=Math.sqrt(1-n*n),i=Math.min(e,e*n+t*r);(e!==ie||i!==ae)&&(ie=e,ae=i,Object.assign(A.shadow.camera,{left:-ie,right:ie,top:ae,bottom:-ae,near:1,far:2*se()}),A.shadow.camera.updateProjectionMatrix())}function R(e){let t=e.getWorldDirection(new V).setY(0);t.lengthSq()<1e-6&&t.set(0,0,-1),t.normalize();let n=e.position.clone().addScaledVector(t,oe*.6);n.y=i(n.x,n.z);let r=0;for(let e=-2;e<=2;e++)for(let t=-2;t<=2;t++)r=Math.max(r,Math.abs(i(n.x+e*oe/2,n.z+t*oe/2)-n.y));L(oe,Math.ceil((r+No)/10)*10);let a=Math.max(.1,M.y),o=Math.max(2*ie,2*ae/a)/jo;A.shadow.normalBias=o,A.shadow.bias=-o*a/(2*se());let s=2*ie/jo,c=2*ae/jo,l=new V().crossVectors(new V(0,1,0),M);l.lengthSq()<1e-10&&l.set(1,0,0),l.normalize();let u=new V().crossVectors(M,l),d=Math.round(n.dot(l)/s)*s,f=Math.round(n.dot(u)/c)*c,p=n.dot(M);n.copy(l).multiplyScalar(d).addScaledVector(u,f).addScaledVector(M,p),A.target.position.copy(n),A.position.copy(n).addScaledVector(M,se()),A.updateMatrixWorld(),A.target.updateMatrixWorld(),A.shadow.updateMatrices(A)}let ce=!0,de=.9,fe={cloudCover:Fo,visibilityKm:50,skyCoverage:Fo,skyDensity:.4,dome:!1,haze:!0};function pe(t,n){let r=ho(t,n),i=t.sun??`daylight`,a=i===`true`;P=Po[t.weather];let o=Math.PI/180,s=(e,t)=>t.set(Math.sin(r.azimuth*o)*Math.cos(e*o),Math.sin(e*o),-Math.cos(r.azimuth*o)*Math.cos(e*o));s(Math.max(r.elevation,-1),j);let l=a?r.elevation:Math.max(r.elevation,6);s(l,M);let f=a?+(r.elevation>0):1;c.sunPosition.value.copy(j),g.sunPosition.value.copy(j);let p=e.smoothstep(r.elevation,-4,10),h=e.smoothstep(r.elevation,2,28);A.color.setRGB(1,.5+.45*h,.28+.58*h),A.intensity=P.sun*p*f,k.intensity=P.hemi*(.32+.68*e.smoothstep(r.elevation,-8,18)),k.color.setRGB(.74-.2*(1-p),.83-.12*(1-p),.93),F=P.shadows&&p>.15&&f>0,A.shadow.intensity=+!!F,te.value=+!!F,A.shadow.needsUpdate=!0;let v=P.sky===`clear`&&r.elevation<-1.5;if(c.visible=g.visible=P.sky===`clear`&&!v,m.visible=_.visible=!c.visible,v){let t=e.smoothstep(r.elevation,-14,-1.5);d.value.setRGB(.1+.22*t,.12+.16*t,.2+.14*t),u.value.setRGB(.03+.05*t,.05+.09*t,.12+.16*t)}else d.value.copy(P.grey).multiplyScalar(.35+.65*p),u.value.copy(P.grey).multiplyScalar((.35+.65*p)*.82);let y=P.sky===`clear`?t.cloudCover:1,b=P.sky===`grey`||y!==void 0&&y>=Lo,x=y===void 0?{coverage:Fo,density:.4}:b?{coverage:0,density:.4}:Do(y);for(let e of[c,g])e.cloudCoverage.value=x.coverage,e.cloudDensity.value=x.density;b&&P.sky===`clear`&&!v&&(c.visible=g.visible=!1,m.visible=_.visible=!0,d.value.copy(Po.overcast.grey).multiplyScalar(.35+.65*p),u.value.copy(Po.overcast.grey).multiplyScalar((.35+.65*p)*.82)),C.value=Math.max(.03,(A.intensity*Math.max(0,M.y)+k.intensity)/Math.PI)*(t.look===`photo`?.55:1),E.value=t.look===`photo`?0:8e3;let w=t.visibilityKm??P.visibilityKm;S.value=w>=1e3?0:Oo(w),fe={cloudCover:+(y??wo(Fo)).toFixed(3),visibilityKm:w,skyCoverage:+x.coverage.toFixed(3),skyDensity:+x.density.toFixed(3),dome:b,haze:w<Io},N.value=+(t.ground===`snow`),de=P.exposure*(1+.9*(1-p))*(t.ground===`snow`?.72:1),ee.value=+(t.weather===`rain`),ce=!0;let T=e=>Math.round(e*10)/10;return{elevation:T(r.elevation),azimuth:T(r.azimuth),drawnElevation:T(l),drawnAzimuth:T(r.azimuth),exposure:+de.toFixed(3),mode:i}}function me(e,t,n=!0){ce&&(ce=!1,x.update(e,h)),e.toneMappingExposure=de;let r=F&&n;return r&&R(t),A.shadow.autoUpdate=!1,A.shadow.needsUpdate=r,r}return{setShadowHalf:e=>{oe=e??Mo},skyScale:o,sky:c,sun:A,hemi:k,sunDir:j,lightDir:M,extinction:S,fogColour:w,fogFactor:O,fadeShadow:I,snow:N,wet:ee,apply:pe,frame:me,raysOn:()=>P.rays&&F,skyReport:()=>fe}}var zo=14e3,Bo=new V(60,30,60);function Vo(){let e=new Float32Array(zo*4*4),t=new Float32Array(zo*4*2),n=new Uint32Array(zo*6);for(let r=0;r<zo;r++){let i=[Math.random(),Math.random(),Math.random(),Math.random()];for(let n=0;n<4;n++)e.set(i,(r*4+n)*4),t.set([n&1?.5:-.5,n&2?.5:-.5],(r*4+n)*2);n.set([r*4,r*4+1,r*4+2,r*4+1,r*4+3,r*4+2],r*6)}let i=new w;i.setAttribute(`position`,new o(new Float32Array(zo*4*3),3)),i.setAttribute(`seed`,new o(e,4)),i.setAttribute(`corner`,new o(t,2)),i.setIndex(new o(n,1));let a={time:B(0),snow:B(0),share:B(1),eye:B(new V)},s=U(Bo.x,Bo.y,Bo.z),c=et(`seed`,`vec4`),l=et(`corner`,`vec2`),u=T(W(9),W(1.1),a.snow),d=U(ae(a.time.mul(.7).add(c.w.mul(40))).mul(.6),0,ae(a.time.mul(.53).add(c.w.mul(23))).mul(.6)).mul(a.snow),f=U(.6,0,.3).mul(W(1).sub(a.snow)),p=c.xyz.mul(s).add(f.sub(U(0,1,0)).mul(u).mul(a.time)).add(d).sub(a.eye).add(s.mul(.5)),m=p.sub(s.mul(p.div(s).floor())).sub(s.mul(.5)),h=a.eye.add(m),_=g(U(K.x.sub(h.x),0,K.z.sub(h.z))),y=ve(U(0,1,0),_),b=T(U(.01,.38,0),U(.035,.035,0),a.snow).mul(c.w.mul(.6).add(.7)),x=v(c.w.lessThan(a.share),W(1),W(0)),S=new le({transparent:!0,depthWrite:!1,fog:!0,side:2});S.positionNode=h.add(y.mul(l.x.mul(b.x)).add(U(0,l.y.mul(b.y),0))).mul(x).add(a.eye.mul(W(1).sub(x))),S.colorNode=T(U(.62,.66,.7),U(.95,.96,1),a.snow),S.opacityNode=T(W(.22),W(.85),a.snow).mul(z(1.5,6,r.sub(K).length()));let C=new $e(i,S);return C.frustumCulled=!1,C.layers.set(2),C.visible=!1,C.name=`precipitation`,{mesh:C,set(e){C.visible=e!==null,a.snow.value=+(e===`snow`),a.share.value=e===`snow`?.75:1},update(e,t){a.time.value=e,a.eye.value.copy(t)}}}function Ho(e,t,n){if(!(Number.isFinite(t)&&t>0&&Number.isFinite(n)&&n>0))throw Error(`The camera needs a positive viewport.`);let r=e?.aspectRatio??t/n;if(e&&e.kind!==`perspective`||!Number.isFinite(r)||r<=0)throw Error(`Unsupported PGMaps camera projection.`);let i=Math.min(t,n*r),a=i/r;return{width:i,height:a,left:(t-i)/2,top:(n-a)/2,aspect:r}}var Uo=[`packed-arrays`,`scene-keys`],Wo=e=>typeof e==`object`&&!!e&&!Array.isArray(e)&&!ArrayBuffer.isView(e);function Go(e){if(Array.isArray(e)){let t=0;if(e.length&&Wo(e[0]))for(let n of e)t+=Go(n);return t}if(!Wo(e))return 0;let t=0;for(let n of Object.keys(e)){let r=e[n];if(r instanceof Float64Array){let i=Array(r.length);for(let e=0;e<r.length;e++){let t=r[e];i[e]=Number.isNaN(t)?null:t}e[n]=i,t++}else t+=Go(r)}return t}var Ko=new URLSearchParams(location.search),qo=e=>void Object.assign(globalThis,e);function Jo(){let e=document.getElementById(`info`),t=window.parent!==window,n=t||Ko.has(`embed`);return Ko.has(`embed`)&&e&&(e.hidden=!0),{worker:!1,embedded:t,baseUrl:document.baseURI,post:(e,n=[])=>{t&&window.parent.postMessage(e,{targetOrigin:`*`,transfer:n})},status:t=>{e&&(e.textContent=t)},canvas:()=>void 0,viewport:()=>({width:innerWidth,height:innerHeight,pixelRatio:devicePixelRatio}),onResize:e=>(addEventListener(`resize`,e),()=>removeEventListener(`resize`,e)),place:(e,t)=>{Object.assign(e.style,{position:`absolute`,left:`${t.left}px`,top:`${t.top}px`})},mount:e=>{document.body.appendChild(e),n&&(e.style.pointerEvents=`none`)},unmount:e=>e.remove(),expose:qo}}function Yo(){let e,t={width:1,height:1,pixelRatio:1},n=new Set,r=(e,t=[])=>globalThis.postMessage(e,{transfer:t}),i=e=>{let t=e;return!t||!(Number(t.width)>0)||!(Number(t.height)>0)?null:{width:Math.round(Number(t.width)),height:Math.round(Number(t.height)),pixelRatio:Number(t.pixelRatio)>0?Number(t.pixelRatio):1}};return addEventListener(`message`,r=>{let a=r.data;if(a?.type===`pgmaps-worker-init`&&a.canvas instanceof OffscreenCanvas)e=a.canvas,t=i(a.viewport)??t;else if(a?.type===`pgmaps-worker-viewport`){let e=i(a.viewport);if(!e||e.width===t.width&&e.height===t.height&&e.pixelRatio===t.pixelRatio)return;t=e;for(let e of n)e()}}),{worker:!0,embedded:!0,baseUrl:location.href,post:r,status:()=>{},canvas:()=>{if(!e)throw Error(`PGMaps has not handed this worker its canvas (pgmaps-worker-init).`);return e},viewport:()=>t,onResize:e=>(n.add(e),()=>n.delete(e)),place:(e,t)=>r({type:`pgmaps-engine-viewport`,...t}),mount:()=>{},unmount:()=>{},expose:qo}}var $=typeof document>`u`?Yo():Jo(),Xo=`1.0.0+5327a8f`,Zo=6,Qo=1200,$o=4e3,es=600,ts=new URLSearchParams(location.search),ns=`nanite`,rs=$.embedded,is=(e,t=[])=>$.post({engine:ns,...e},t),as=null,os=!1,ss=null,cs=null,ls=null,us=fo(ts)??io,ds=fo(ts)!==null,fs=null,ps=null,ms=null,hs=new WeakMap,gs=()=>{let e=performance.now(),t={};return{ms:t,lap:n=>{let r=performance.now();t[n]=Math.round(((t[n]??0)+r-e)*10)/10,e=r}}},_s={at:0,unpack:0,packed:0},vs={show:{},build:{},finalStand:{},capture:{}};async function ys(e,t=null){if(os)ss=e,cs=t;else{os=!0;try{ds||(us=so(e.environment)??io);let n=gs();vs.show=n.ms,n.ms.arrivedAt=_s.at,n.ms.unpack=_s.unpack,n.ms.packedArrays=_s.packed;let r=null;try{ts.get(`reuse`)!==`0`&&(r=t!==null&&e===ps?ms:Wt(e))}catch{}if(n.lap(`hash`),as&&r!==null&&r===ms&&as.sameAs(e,us))await as.again(e),n.ms.reused=1,n.lap(`again`);else if(t!==null){n.ms.reused=0,is({type:`pgmaps-engine-scene-needed`,key:t});return}else as&&await as.teardown(),as=null,ms=null,as=await Ds(e,us),ms=r,n.ms.reused=0,n.lap(`build`);ps=e,as.setEnvironment(us),ls&&as.setEye(ls),fs=null}catch(e){console.error(e),fs=e instanceof Error?e.message:String(e),bs(e)}finally{os=!1;let e=ss,t=cs;ss=null,cs=null,e&&ys(e,t)}}}function bs(e){let t=e instanceof Error?e.message:String(e);$.status(`failed: ${t}`),$.expose({pgmaps:{ready:!0,error:t}}),is({type:`pgmaps-engine-error`,message:t})}addEventListener(`message`,e=>{let t=performance.now(),n=e.data;if(n?.type===`pgmaps-scene`&&n.scene){let e=Go(n.scene);_s={at:Math.round(performance.timeOrigin+t),unpack:Math.round((performance.now()-t)*10)/10,packed:e},typeof n.key==`string`&&hs.set(n.scene,n.key),ls=null,ys(n.scene)}else if(n?.type===`pgmaps-scene`&&typeof n.key==`string`)!os&&as&&ps&&hs.get(ps)===n.key?(_s={at:Math.round(performance.timeOrigin+t),unpack:0,packed:0},ls=null,ys(ps,n.key)):is({type:`pgmaps-engine-scene-needed`,key:n.key});else if(n?.type===`pgmaps-camera`&&Array.isArray(n.position))ls=n,as&&!os&&as.setEye(ls);else if(n?.type===`pgmaps-capture`)ws(n,!0).then(e=>is(e,e.frames.flatMap(e=>[e.classes.buffer,e.screened.buffer,e.depth.buffer,...e.zones?[e.zones.buffer]:[]])),e=>is({type:`pgmaps-engine-capture`,id:typeof n.id==`string`?n.id:null,error:e instanceof Error?e.message:String(e)}));else if(n?.type===`pgmaps-environment`){let e=so(n);if(!e)return;ds=!0,us=e,as&&!os&&as.setEnvironment(e)}});async function xs(){for(;;){if(as&&!os&&!ss)return as;if(!as&&!os&&!ss)throw Error(fs?`The scene failed to build: ${fs}`:`No scene package to capture: send one first.`);await new Promise(e=>setTimeout(e,100))}}var Ss=Promise.resolve(),Cs={id:null,source:!1,done:0,total:0,perFrame:1,sentAt:0,begin(e,t){this.done=0,this.perFrame=Math.max(1,t),this.total=e*this.perFrame,this.sentAt=0},step(){if(!this.id||!this.source||!this.total)return;this.done=Math.min(this.total,this.done+1);let e=performance.now();if(e-this.sentAt<250&&this.done<this.total)return;this.sentAt=e;let t=`frame ${Math.min(this.total/this.perFrame,Math.floor((this.done-1)/this.perFrame)+1)} of ${this.total/this.perFrame}`;is({type:`pgmaps-capture-progress`,id:this.id,done:this.done,total:this.total,stage:t})}};function ws(e,t=!1){let n=Ss.then(async()=>{let n=na(e);Cs.id=t?n.id:null,Cs.source=t;try{return await(await xs()).capture(n)}finally{Cs.id=null,Cs.source=!1}});return Ss=n.catch(()=>void 0),n}async function Ts(){let e=ts.get(`scene`);if(e)return(await fetch(e)).json();$.status(`choose a PGMaps scene package (forestry-scene-package.json)`);let t=document.getElementById(`file`);return t.hidden=!1,new Promise(e=>{t.onchange=async()=>{let n=t.files?.[0];if(n)try{let r=JSON.parse(await n.text());t.hidden=!0,e(r)}catch{$.status(`Could not read that file as JSON. Choose a PGMaps scene package.`),t.value=``}}})}function Es(e,t){let n=e=>{let n=Y(e,U(.2126,.7152,.0722)),i=z(Qo,$o,Z(r.sub(K)));return T(e,T(U(n,n,n),e,t.chroma).mul(t.tint),i)},i=t=>n(T(t,U(.78,.81,.86).mul(Y(t,U(.3,.59,.11)).mul(2).add(.55)),e.mul(.2))),a=e=>q(e,0,1).mul(.3).add(.85);return{...Ve(),tint:e=>ge(e).mul(.24).add(.88),cardValue:(e,t)=>t.w,impostorValue:(e,t)=>t.w,solidColour:e=>e.mul(U(.9,.86,.8)),cardColour:(e,t,n,r)=>i(e.mul(n).mul(a(r))),impostorColour:(e,t,n,r)=>i(e.mul(t).mul(n).mul(a(r))),bakeCardColour:e=>e}}async function Ds(n,o){if(n?.format!==`pgmaps-forest-scene`||n.version!==1)throw Error(`Not a PGMaps forest scene package (v1).`);let s=performance.now(),l=gs();if(vs.build=l.ms,ts.has(`coverTest`)){let e=e=>e&&!e.cover?{...e,cover:ri(e)}:e;n={...n,terrain:e(n.terrain),farTerrain:e(n.farTerrain),skylineTerrain:e(n.skylineTerrain)}}if(ts.has(`burnTest`)){let e=Number(ts.get(`burnTest`))||2021,t=n.camera.position[0]+150,r=n=>n&&Hr(n,t,e);n={...n,terrain:r(n.terrain),farTerrain:r(n.farTerrain),skylineTerrain:r(n.skylineTerrain)}}let u=ei(n);n=u.scene;let d=n.createdAt,{origin:f}=n,m=(e,t)=>Or(uo(e))??Or(t?new Date(t):null),g=e=>m(e,d)??Or(new Date),_=g(o),y=Br(n,u.rasters,_);n=y.scene;let b=n.skylineTerrain?ai(n.skylineTerrain):null;b?.posts&&(n={...n,skylineTerrain:b.grid});let x={posts:Yr(u.rasters),stemsRemoved:u.removed,snags:y.snags,snagsFallen:y.fallen,skylineSeaPosts:b?.posts??0,test:ts.has(`coverTest`)};console.info(`pgmaps cover`,JSON.stringify(x));let S=u.rasters.length?Xr(u.rasters,Gr):null;l.lap(`cover`);let C=(await navigator.gpu?.requestAdapter({powerPreference:`high-performance`}))?.limits,w=new ot({canvas:$.canvas(),antialias:!1,powerPreference:`high-performance`,...C?{requiredLimits:{maxBufferSize:C.maxBufferSize,maxStorageBufferBindingSize:C.maxStorageBufferBindingSize,maxStorageBuffersPerShaderStage:C.maxStorageBuffersPerShaderStage,maxSampledTexturesPerShaderStage:C.maxSampledTexturesPerShaderStage}}:{}});if(await w.init(),!w.backend.isWebGPUBackend)throw Error(`this example needs WebGPU (compute)`);let T=$.viewport();w.setPixelRatio(Math.min(T.pixelRatio,1.5)),w.setSize(T.width,T.height,!$.worker),w.shadowMap.enabled=!0,w.shadowMap.type=1,w.toneMapping=4,$.mount(w.domElement),l.lap(`device`);let D=new Ge,{camera:O}=n,k=new fe(O.verticalFovDegrees,T.width/T.height,.3,3e4),M=new V,N=$.worker?{enabled:!1,target:M,update:()=>k.lookAt(M),dispose:()=>{}}:new wt(k,w.domElement);N.enabled=!ts.has(`embed`)&&!$.worker;let ee=O.projection,P=()=>{},ne=t=>{ee=t.projection;let n=e.degToRad(t.bearingDegrees),r=e.degToRad(t.pitchDegrees);k.position.set(t.position[0],t.position[2],-t.position[1]),t.verticalFovDegrees&&(k.fov=t.verticalFovDegrees),k.updateProjectionMatrix(),P(),N.target.copy(k.position).add(new V(Math.sin(n)*Math.cos(r),Math.sin(r),-Math.cos(n)*Math.cos(r)).multiplyScalar(100)),N.update()};ne(O);let F=Fa(n);l.lap(`terrain`);let{west:re,south:I,east:ae,north:oe}=F.ground.outer,se=Math.max(...[[re,I],[re,oe],[ae,I],[ae,oe]].map(([e,t])=>Math.hypot(e,t)))*1.02,L=Ro(D,F.heightAt,se);k.far=Math.max(3e4,L.skyScale+Math.hypot(O.position[0],O.position[1])+1e3),k.updateProjectionMatrix(),l.lap(`environment`);let R=La(n,F.bounds,F.farBounds,_);l.lap(`masks`);let z=fi();pi(z,o.look??`via`,_);let ce=wa(n),ue=e=>Zi(e,O.position[0],O.position[1],F.heightAt(O.position[0],-O.position[1])),[de,pe]=await Promise.all([Ja({masks:R,snow:L.snow,wet:L.wet,fadeShadow:e=>L.fadeShadow(e),coverGrade:z}),Nn({...n,trees:ue(ce?ce.trees:n.trees)},1,ce?.extra??[])]);l.lap(`floorAndStand`),F.mesh.material=de,F.mesh.renderOrder=1,D.add(F.mesh);let me=await Xa(n,F.heightAt,L.snow);me&&D.add(me),l.lap(`debris`);let he=no(n,F.waterLevels,{sunDir:L.lightDir,sunColour:L.sun.color});l.lap(`water`),he&&D.add(he.group);let ge=Vo();D.add(ge.mesh);let _e=sr();Ca(_e,o.look??`via`);let ve=Es(L.snow,_e),{types:ye}=pe,{fields:be,data:xe,count:U}=n.trees,Ce=be.indexOf(`x`),we=be.indexOf(`y`),De=(e,t)=>{let n=-1;for(let r=0;r<U;r++)n=Math.max(n,Math.hypot(xe[r*be.length+Ce]-e,xe[r*be.length+we]-t));return n>=0?n:null},Oe=W(.4),ke=e=>({color:L.fogColour(e),factor:L.fogFactor(e)}),Ae={},je=async e=>{let t=w.backend,n=async(n,r)=>{let i=Math.max(1,e.renderTarget.width>>r),a=Math.max(1,e.renderTarget.height>>r),o=Math.ceil(i*8/256)*256,s=t.device.createBuffer({size:o*a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),c=t.device.createCommandEncoder();c.copyTextureToBuffer({texture:t.get(n).texture,mipLevel:r},{buffer:s,bytesPerRow:o},{width:i,height:a}),t.device.queue.submit([c.finish()]),await s.mapAsync(GPUMapMode.READ);let l=Ut(new Uint8Array(s.getMappedRange()));return s.unmap(),s.destroy(),l},r=async e=>[await n(e,0),await n(e,1),await n(e,4),await n(e,8)];return{tiles:e.views,scales:Ut(e.coverage.scales),albedo:await r(e.texture),normals:await r(e.normals)}},Me=(e,n)=>{if(ts.get(`bake`)===`plain`)return n();let r=[e.renderTarget,e.normalsTarget],i={target:w.getRenderTarget(),colour:w.getClearColor(new t),alpha:w.getClearAlpha()};w.setClearColor(0,0);for(let e of r)w.setRenderTarget(e),w.clear();w.setRenderTarget(i.target),w.setClearColor(i.colour,i.alpha);for(let e of r)e.texture.generateMipmaps=!1;let a=w,o=w.render.bind(w),s=!1;a.clearDepth=()=>{s=!0},a.render=(e,t)=>{if(!s)return o(e,t);s=!1;let n=[w.autoClear,w.autoClearColor,w.autoClearDepth,w.autoClearStencil];w.autoClear=!0,w.autoClearColor=!1,w.autoClearDepth=!0,w.autoClearStencil=!1;try{return o(e,t)}finally{[w.autoClear,w.autoClearColor,w.autoClearDepth,w.autoClearStencil]=n}};try{n()}finally{delete a.clearDepth,delete a.render;let e=w.backend;for(let t of r)t.texture.generateMipmaps=!0,e.generateMipmaps(t.texture)}},Ne=async(e,t,{lap:n,ms:r})=>{let i=new Qe(w,e.types,e.instances,e.textures,ve);i.u.maxDist.value=t,i.u.tau.value=Number(ts.get(`tau`)??2),i.group.traverse(e=>{e instanceof $e&&!e.castShadow&&(e.material.receivedShadowNode=a(L.fadeShadow(Oe)))}),i.group.add(i.sw.buildResolveMesh({fadeShadow:e=>L.fadeShadow(Oe,e),fog:ke}));let o=Ee(e.types.length),s=i.buildImpostorMesh(o,e.types.map(()=>({side:[1,1,1],top:[1,1,1]})));return s.receiveShadow=!0,s.material.receivedShadowNode=a(L.fadeShadow(Oe)),i.group.add(s,i.splats.build(o,{fadeShadow:e=>L.fadeShadow(Oe,e),shadow:e=>L.fadeShadow(Oe,e),fog:ke}),i.buildImpostorShadowMesh(o)),n(`naniteRenderer`),Me(o,()=>Re(w,o,e.types,{bark:e.textures.bark,leaf:e.textures.leaf,barkLayers:e.barkLayers,leafLayers:e.leafLayers,leafAlpha:j(e.textures.leaf,et(`uv`,`vec2`))},ve,i.u.impostorPx.value)),n(`impostorBake`),await w.backend.device.queue.onSubmittedWorkDone(),n(`impostorBakeGpu`),await Te(w,o,Se),n(`impostorCoverage`),o.coverage.ms&&(r.coverageReadback=Math.round(o.coverage.ms.readback),r.coverageWork=Math.round(o.coverage.ms.work)),ts.has(`atlasdigest`)&&(Ae[e===pe?`live`:`final`]=await je(o)),i.impostorsBaked(o,e.types.map(()=>[1,1])),i.splats.enabled.value=1,{nanite:i,atlas:o}},Pe=await Ne(pe,Math.max(9e3,(De(O.position[0],O.position[1])??0)+1500),l),Fe=Pe.nanite,Le=Pe.atlas,G=Fe;D.add(G.group);let ze=null,Be=new nt(1,1,{type:p,samples:1,depthBuffer:!0});Be.depthTexture=new h(1,1,te),G.setDepthSource(Be.depthTexture,1);let Ve=new St(w,Be.depthTexture,L.sunDir,{enabled:ts.get(`rays`)!==`0`}),K=new vt(w,Be,1,{enabled:ts.get(`taa`)!==`0`,extra:Ve.at}),Ue=new A(w,J(K.displayNode,1)),q=new ut,We=0,Y=0,Ke=()=>{let e=$.viewport(),t=Ho(ee,e.width,e.height);Math.min(e.pixelRatio,1.5)!==w.getPixelRatio()&&(w.setPixelRatio(Math.min(e.pixelRatio,1.5)),We=0),k.aspect=t.aspect,k.updateProjectionMatrix(),(We!==t.width||Y!==t.height)&&(w.setSize(t.width,t.height,!$.worker),w.getDrawingBufferSize(q),Be.setSize(q.x,q.y),We=t.width,Y=t.height),$.place(w.domElement,t)};P=Ke;let qe=$.onResize(Ke);Ke();let Je=null,Ye=!1,Xe=o,Ze=e=>{Xe=e;let t=Je=L.apply(e,n.origin);Ca(_e,e.look??`via`),pi(z,e.look??`via`,g(e)),ge.set(e.weather===`rain`||e.weather===`snow`?e.weather:null),he?.update(),he?.setLook({windMs:e.windMs??0,look:e.look??`via`,full:Ye});let r=L.skyReport();Q.environment={...e,...r,sunElevation:+t.elevation.toFixed(2),sunAzimuth:+t.azimuth.toFixed(2)}},rt=new V,it=0,at=0,Z=!1,st=!1,ct=null,lt=0,dt=performance.now(),Q={frames:0,nanite:G,camera:k,controls:N,scene:D,ready:!1,residual:pe.residual,buildMs:0,environment:null,cover:x,timing:vs,atlasDigests:Ae,debug:{envr:L,rays:Ve,taa:K,terrain:F,reliefSteps:xt,noShadows:!1,noRays:!1}};$.expose({pgmaps:Q}),Ze(o);let ft=performance.now(),pt,mt=(e,t)=>{k.updateMatrixWorld(),ve.viewer.copy(k.position),_t.value.copy(k.position),ge.update(e,k.position);let n=Q.debug,r=L.frame(w,k,t&&!n.noShadows);Ve.enabled=t&&ts.get(`rays`)!==`0`&&L.raysOn()&&!n.noRays,t?K.jitter(k,q.x,q.y):(k.updateProjectionMatrix(),i.value.set(0,0)),c.value=0;let a=k.position.y-F.heightAt(k.position.x,k.position.z);G.sw.idle=G.splats.idle=a<(G.sw.idle?2e3:1400),ze?.update(k,q.y,pt),G.update(k,q,e,r?L.sun.shadow.camera:null),w.setRenderTarget(Be),k.layers.set(0),w.render(D,k),G.occlusion(k,q.x,q.y),G.rasterize(k,q.x,q.y);let o=w.autoClear;w.autoClear=!1,L.sun.shadow.needsUpdate=!1,k.layers.set(2),w.render(D,k),k.layers.set(0),w.autoClear=o},ht=()=>{Q.frames++;let e=performance.now();lt=lt?lt*.9+1e3/Math.max(1,e-dt)*.1:60,dt=e;let t=(e-ft)/1e3;N.update(),mt(t,!0),Ve.render(k,q.x,q.y),K.resolve(k,rt),w.setRenderTarget(null),Ue.render(),Q.frames===1?(l.lap(`firstFrame`),Q.buildMs=Math.round(performance.now()-s),is({type:`pgmaps-engine-ready`})):st&&is({type:`pgmaps-engine-ready`}),st=!1,t-it>.5&&!ct&&(it=t,ct=G.readStats().then(e=>{ct=null,e&&!Z&&($.status(`${n.trees.count.toLocaleString()} stems, ${ye.length} tree types (${pe.residual.lines.length-ye.length} species)\ndrawn: ${e.instances.toLocaleString()} as clusters, ${e.impostors.toLocaleString()} impostors, ${(e.splats??0).toLocaleString()} splats\ncrown width off by ${(pe.residual.mean*100).toFixed(1)}% mean, ${(pe.residual.p90*100).toFixed(1)}% p90`),Q.ready=Q.frames>10,t-at>=1&&(at=t,is({type:`pgmaps-engine-stats`,drawn:e.instances+e.impostors,fps:Math.round(lt),clusters:e.instances,impostors:e.impostors,splats:e.splats??0,stems:n.trees.count,crownErrorMean:+pe.residual.mean.toFixed(4),crownErrorP90:+pe.residual.p90.toFixed(4),sun:Je,environment:L.skyReport()})))},()=>ct=null))},gt=Math.max(1,Number(ts.get(`captureFrames`)??24)),yt=w.backend.device,bt=w.backend,Ct=new nt(1,1,{depthBuffer:!1}),Tt=e=>new V(e[0]/255,e[1]/255,e[2]/255),Et=B(new V),Dt=e=>H(r.x.sub(e.west).div(e.east-e.west),r.z.add(e.north).div(e.north-e.south)),Ot=e=>e.x.greaterThanEqual(0).and(e.x.lessThanEqual(1)).and(e.y.greaterThanEqual(0)).and(e.y.lessThanEqual(1)),kt=Dt(F.bounds),At=F.farBounds,jt=At?Dt(At):null,Mt=F.skylineBounds,Nt=Mt?Dt(Mt):null,Pt=()=>{let e=()=>new E(new Uint8Array(4),1,1),t=X(e(),kt),n=jt?X(e(),jt):null,r=Nt?X(e(),Nt):null,i=B(new V),a=new le({fog:!1}),o=r&&Nt?v(Ot(Nt),r.rgb,i):i;a.colorNode=v(Ot(kt),t.rgb,n&&jt?v(Ot(jt),n.rgb,o):o);let s=[],c=[{bounds:F.bounds},...n&&At?[{bounds:At,maxSide:4096,minTexel:2}]:[],...r&&Mt?[{bounds:Mt,maxSide:4096,minTexel:10}]:[]],l=null;return{material:a,set:(e,a)=>{let o=oa(c,e,a);if(l?.key===o)return l.set;l=null;for(let e of s)e.dispose();s=[];let u=e=>{let t=new E(e.data,e.width,e.height);return t.magFilter=t.minFilter=He,t.generateMipmaps=!1,t.needsUpdate=!0,s.push(t),t},d=c.map(t=>aa(t.bounds,e,a,t.maxSide,t.minTexel));return t.value=u(d[0]),i.value.copy(Tt(e)),n&&At&&(n.value=u(d[1])),r&&Mt&&(r.value=u(d[d.length-1])),l={key:o,set:{cut:d[d.length-1].cut,rasters:d}},l.set},colour:a.colorNode,rest:i}},Ft=Pt(),It=Pt();if(l.lap(`frameSetup`),ce)try{ze=await Ta({renderer:w,scene:n,plan:ce,terrain:F,types:ye,atlas:Le,extraTypes:pe.extraTypes,snow:L.snow,grade:_e,receivedShadow:()=>a(L.fadeShadow(Oe)),drape:{colour:Ft.colour,rest:Ft.rest,vegetation:Fe.u.classColour},cover:R.cover,viewYear:z.viewYear}),D.add(ze.group),ze.setLook(Xe.look??`via`),Q.farForest=ze.stats}catch(e){console.error(`far forest`,e),Q.farForestError=e instanceof Error?e.message:String(e)}l.lap(`farForest`);let Lt=new le({fog:!1,side:2});Lt.colorNode=Et;let Rt=he?he.group.children.filter(e=>e instanceof $e):[],zt=new Float32Array(pe.instances.a.length/2);for(let e=0;e<zt.length/2;e++)zt[e*2]=pe.instances.a[e*4],zt[e*2+1]=-pe.instances.a[e*4+2];let Bt=(n.water??[]).filter(e=>e?.rings?.[0]?.length>=3).map(e=>{let t=e.rings[0].map(e=>e[0]),n=e.rings[0].map(e=>e[1]);return{rings:e.rings,box:[Math.min(...t),Math.min(...n),Math.max(...t),Math.max(...n)]}}),Vt=(e,t)=>Bt.some(({rings:[n,...r],box:i})=>e>=i[0]&&t>=i[1]&&e<=i[2]&&t<=i[3]&&Ia(e,t,n)&&!r.some(n=>Ia(e,t,n))),Ht=be.indexOf(`height`),Wt=null;if(Ht>=0)for(let e=0;e<U;e++)Wt=Math.max(Wt??0,xe[e*be.length+Ht]);let Gt=e=>{let n=e===`zones`,r=t=>t===F.mesh||(t===G.group||t===ze?.group)&&e===`screened`||t===he?.group&&!n,i=D.children.filter(e=>e.visible&&!(e instanceof ie)&&!r(e)),a={debug:G.u.debug.value,extinction:L.extinction.value,sun:L.sun.intensity,hemi:L.hemi.intensity,terrain:F.mesh.material,water:Rt.map(e=>e.material),clear:w.getClearColor(new t),alpha:w.getClearAlpha()};for(let e of i)e.visible=!1;G.u.debug.value=7,ze&&(ze.u.flat.value=1),L.extinction.value=0,L.sun.intensity=L.hemi.intensity=0,F.mesh.material=n?It.material:Ft.material;for(let e of Rt)e.material=Lt;return w.setClearColor(0,0),()=>{for(let e of i)e.visible=!0;G.u.debug.value=a.debug,ze&&(ze.u.flat.value=0),L.extinction.value=a.extinction,L.sun.intensity=a.sun,L.hemi.intensity=a.hemi,F.mesh.material=a.terrain,Rt.forEach((e,t)=>e.material=a.water[t]),w.setClearColor(a.clear,a.alpha)}},Kt=()=>Promise.race([yt.queue.onSubmittedWorkDone(),new Promise(e=>setTimeout(e,2e3))]),qt=(e,t,n)=>{let r=new OffscreenCanvas(t,n);return r.getContext(`2d`).putImageData(new ImageData(e,t,n),0,0),r.convertToBlob({type:`image/png`})},Jt=180/Math.PI,Yt=async(e,t)=>{let n=w.readRenderTargetPixelsAsync(Be,0,0,e,t),r=bt.copyTextureToBuffer(Be.depthTexture,0,0,e,t,0);return{halfs:await n,raw:await r}},Xt=async(e,t,n,r=gt,i=0)=>{let a=ia(e,t);k.position.set(...a.position),k.up.set(...a.up),k.lookAt(...a.target),k.fov=a.fov,k.aspect=a.aspect,k.updateProjectionMatrix(),k.updateMatrixWorld();let{width:o,height:s}=t;q.set(o,s),Be.setSize(o,s),Ct.setSize(o,s),K.size=new ut(o,s),K.reset=!0;let c=performance.now(),l=0;for(let e=0;e<i+r;e++)e===i&&i&&(K.reset=!0),l=(performance.now()-ft)/1e3,mt(l,!0),Ve.render(k,o,s),K.resolve(k,rt),await Kt(),Cs.step();w.setRenderTarget(Ct),Ue.render(),w.setRenderTarget(null);let u=await w.readRenderTargetPixelsAsync(Ct,0,0,o,s),d=performance.now(),f=async(e,t)=>{let n=Gt(e);try{for(let e=0;e<t;e++)mt(l,!1),await Kt();return await Yt(o,s)}finally{n()}},p=await f(`screened`,2),m=performance.now(),h=await f(`ground`,1),g=n?await f(`zones`,1):null,_=performance.now(),v=la(p.raw,o,s,k.near,k.far,sa(o,4,4)),y=ua(p.halfs,o,s,v,sa(o,8,2)),b=e=>ua(e.halfs,o,s,la(e.raw,o,s,k.near,k.far,sa(o,4,4)),sa(o,8,2)),x=b(h),S=g?b(g):void 0,C=da(u,o,s,4,sa(o,4,1),new Uint8ClampedArray(o*s*4)),T=await qt(C,o,s),E=k.getWorldDirection(new V);return{frame:{width:o,height:s,image:T,classes:x,screened:y,depth:v,...S?{zones:S}:{},camera:{position:[k.position.x,-k.position.z,k.position.y],bearingDegrees:(Math.atan2(E.x,-E.z)*Jt+360)%360,pitchDegrees:Math.asin(Math.max(-1,Math.min(1,E.y)))*Jt,horizontalFovDegrees:2*Math.atan(Math.tan(k.fov/Jt/2)*k.aspect)*Jt,verticalFovDegrees:k.fov,near:k.near,far:k.far}},timing:{imageMs:Math.round(d-c),screenedMs:Math.round(m-d),bareMs:Math.round(_-m),readMs:Math.round(performance.now()-_)}}},Zt=null,Qt=e=>e.traverse(e=>{e instanceof $e&&(e.geometry.dispose(),(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>e.dispose()))}),$t=(e,t)=>Ut({fields:e.fields,species:e.species,count:e.count,radiusMeters:e.radiusMeters,bearings:e.bearings,eye:t,data:e.data}),en=async(e,t)=>{let r=performance.now(),i=$t(e,t);if(vs.capture.standKey=Math.round((performance.now()-r)*10)/10,Zt?.key===i)return Zt;Zt&&Qt(Zt.nanite.group),Zt=null;let a=gs();vs.finalStand=a.ms;let o=Yi(ce?ce.trees:n.trees,e,t,(e,t,n)=>e===`z`?F.heightAt(t,-n):e===`tone`?.5:NaN);a.lap(`merge`);let s=S?$r(o,S):{table:o,removed:0};a.lap(`thin`);let c=zr(s.table,u.rasters,_,e=>n.species?.[e]?.crownRatio).table;a.lap(`snags`),Q.finalCoverRemoved=s.removed;let l=await Nn({...n,trees:ue({fields:c.fields,species:c.species,count:c.count,data:c.data})},1);a.lap(`buildStand`);let{nanite:d}=await Ne(l,Math.max(9e3,e.radiusMeters+1500,Fe.u.maxDist.value),a);d.setDepthSource(Be.depthTexture,1);let f=new Float32Array(l.instances.a.length/2);for(let e=0;e<f.length/2;e++)f[e*2]=l.instances.a[e*4],f[e*2+1]=-l.instances.a[e*4+2];return Zt={key:i,nanite:d,stems:c.count,stemXY:f},a.lap(`finish`),Zt},tn=e=>{e!==G&&(D.remove(G.group),G=e,D.add(G.group),Q.nanite=G)},nn=K.u,rn=null,an=e=>{let t=on(e),n=rn=t.then(()=>void 0,()=>void 0).then(()=>{rn===n&&(rn=null)});return t},on=async e=>{for(;!Z&&Q.frames<3;)await new Promise(e=>setTimeout(e,50));if(Z)throw Error(`The scene was replaced before the capture.`);w.setAnimationLoop(null),await ct?.catch(()=>void 0);let t=e.final,n=gs();vs.capture=n.ms,Cs.begin(e.frames.length,t?Zo+t.samples:gt);let r=performance.now(),i=null;if(t){if(pt=t.canopyCutoffPx,t.stand&&t.stand.count>0){let n=await en(t.stand,[e.position[0],e.position[1]]);tn(n.nanite),ze?.hide({eye:[e.position[0],e.position[1]],radius:t.stand.radiusMeters,bearings:t.stand.bearings})}L.setShadowHalf(es),Ye=!0,Ze(Xe)}n.lap(`finalStand`);let a={position:k.position.clone(),quaternion:k.quaternion.clone(),up:k.up.clone(),fov:k.fov,aspect:k.aspect,size:q.clone(),taaSize:K.size,prepass:G.leafPrepass.mode,impMin:tt.value,impExact:Ie.value,maxWeight:nn.maxWeight.value},{cut:o,rasters:s}=Ft.set(e.classes.terrain,e.classes.layers),c=e.zones?It.set(e.zones.terrain,e.zones.layers).cut:[];n.lap(`classRasters`);let l=performance.now(),u=_a({stems:G===Fe?zt:Zt.stemXY,rasters:s,terrain:e.classes.terrain,vegetation:e.classes.vegetation,layers:e.classes.layers,onWater:Vt});G.setInstanceClasses(u.rgb),ze?.setClasses({rasters:s,terrain:e.classes.terrain,vegetation:e.classes.vegetation,layers:e.classes.layers,onWater:Vt}),Q.lastStemClasses={counts:u.counts,ms:Math.round(performance.now()-l)},Et.value.copy(Tt(e.classes.water)),G.u.classColour.value.copy(Tt(e.classes.vegetation)),n.lap(`stemClasses`);let p=[],m=[],h={drawn:0,invented:0,filled:0,far:0,beyondTrees:0},[g,_]=e.position,v=De(g,_);try{G.leafPrepass.mode=!1,Ie.value=1,tt.value=.01,t&&(nn.maxWeight.value=Math.max(1,t.samples-1));for(let n of e.frames){let{frame:r,timing:i}=t?await Xt(e.position,n,!!e.zones,t.samples,Zo):await Xt(e.position,n,!!e.zones);p.push(r),m.push(i),fa(e.position,n,r.depth,4,(e,t)=>{h.drawn++;let n=F.ground.sourceAt(e,t);n===`invented`?h.invented++:n===`filled`?h.filled++:n===`farTerrain`&&h.far++,(v===null||Math.hypot(e-g,t-_)>v)&&h.beyondTrees++})}}finally{k.position.copy(a.position),k.quaternion.copy(a.quaternion),k.up.copy(a.up),k.fov=a.fov,k.aspect=a.aspect,k.updateProjectionMatrix(),k.updateMatrixWorld(),q.copy(a.size),Be.setSize(q.x,q.y),K.size=a.taaSize,K.reset=!0,G.leafPrepass.mode=a.prepass,Ie.value=a.impExact,tt.value=a.impMin,G.setInstanceClasses(null),ze?.setClasses(null),nn.maxWeight.value=a.maxWeight,t&&(i={samples:t.samples,stems:G===Fe?pe.instances.a.length/4:Zt.stems,canopyCutoffMeters:ze?Math.round(ze.cutoff()):null,millis:Math.round(performance.now()-r)},tn(Fe),ze?.hide(null),L.setShadowHalf(null),pt=void 0,Ye=!1,Ze(Xe)),Z||w.setAnimationLoop(ht),n.lap(`frames`)}let y=F.ground.outer,{missing:b,missingDetail:x}=ha({seen:h,realGroundMeters:Math.max(0,Math.min(g-y.west,y.east-g,_-y.south,y.north-_)),farTerrain:!!F.farBounds,skylineTerrain:!!F.skylineBounds,treeReachMeters:v,stems:U,cut:o,zonesCut:c});return{type:`pgmaps-engine-capture`,engine:ns,id:e.id,version:Xo,frames:p,scene:{createdAt:d??null,origin:f??null},environment:{...Xe,...L.skyReport(),sun:Je},maxTreeHeightMeters:Wt,missing:b,missingDetail:x,stemClasses:u.counts,timings:m,final:i}};return Q.capture=e=>ws(e),Q.syntheticStand=(e,t=700)=>{let r=Math.min(...e.frames.map(e=>e.bearingDegrees-e.horizontalFovDegrees/2-2)),i=Math.max(...e.frames.map(e=>e.bearingDegrees+e.horizontalFovDegrees/2+2));return Xi(n.trees,[e.position[0],e.position[1]],Number(ts.get(`standRadius`)??6500),[r,i],t)},w.setAnimationLoop(ht),{setEye:ne,setEnvironment:Ze,capture:an,sameAs:(e,t)=>{let n=m(t,e.createdAt);return n!==null&&n===_&&(t.look??`via`)===(o.look??`via`)},again:async e=>{await rn,d=e.createdAt,ne(e.camera),K.reset=!0,Q.reused=(typeof Q.reused==`number`?Q.reused:0)+1,st=!0},teardown:async()=>{Z=!0,w.setAnimationLoop(null),await ct?.catch(()=>void 0),qe(),N.dispose(),await w.dispose(),$.unmount(w.domElement)}}}async function Os(e){let t=async(e,t,n)=>{let r=new OffscreenCanvas(t,n);return r.getContext(`2d`).putImageData(new ImageData(e,t,n),0,0),URL.createObjectURL(await r.convertToBlob({type:`image/png`}))};return Promise.all(e.frames.map(async e=>{let{width:n,height:r,depth:i,classes:a}=e,o=new Uint8ClampedArray(n*r*4),s=0;for(let e of i)s=Math.max(s,e);for(let e=0;e<n*r;e++){let t=i[e]>0?255-230*Math.log(1+i[e])/Math.log(1+s):0;o.set([t,t,t,255],e*4)}let c=await createImageBitmap(e.image),l=new OffscreenCanvas(n,r).getContext(`2d`);l.drawImage(c,0,0);let u=l.getImageData(0,0,n,r),d=e=>a[e*4]<<16|a[e*4+1]<<8|a[e*4+2]|(a[e*4+3]?1<<24:0);for(let e=0;e<r;e++)for(let t=0;t<n;t++){let i=e*n+t;(t+1<n&&d(i)!==d(i+1)||e+1<r&&d(i)!==d(i+n))&&u.data.set([255,0,255,255],i*4)}return{image:URL.createObjectURL(e.image),classes:await t(new Uint8ClampedArray(a),n,r),depth:await t(o,n,r),overlay:await t(u.data,n,r)}}))}async function ks(){for(;!(as&&ps&&globalThis.pgmaps?.ready);)await new Promise(e=>setTimeout(e,250));let e=ps.camera,t=e.bearingDegrees*Math.PI/180,n=Number(ts.get(`captureAhead`)??150),r=e.position[0]+Math.sin(t)*n,i=e.position[1]+Math.cos(t)*n,a=[[r-100,i-100],[r+100,i-100],[r+100,i+100],[r-100,i+100]],o={type:`pgmaps-capture`,id:`capture-test-${Date.now().toString(36)}`,position:e.position,frames:[{bearingDegrees:e.bearingDegrees,pitchDegrees:e.pitchDegrees,horizontalFovDegrees:60,verticalFovDegrees:2*Math.atan(540/960*Math.tan(60*Math.PI/360))*180/Math.PI,width:960,height:540}],classes:{terrain:[96,96,96],layers:[{id:`test-square`,rgb:[0,90,255],polygons:[[a]]}],vegetation:[255,255,255],water:[255,128,0]}};try{let e=await ws(o),t=await Os(e);Object.assign(globalThis.pgmaps,{lastCaptureRequest:o,lastCapture:e,captureUrls:t}),console.info(`captureTest`,e.timings,t)}catch(e){console.error(e),Object.assign(globalThis.pgmaps,{lastCaptureError:e instanceof Error?e.message:String(e)})}}ts.has(`captureTest`)&&ks(),$.expose({pgmapsCaptureUrls:Os}),ts.has(`scene`)||!rs?Ts().then(ys,bs):($.status(`waiting for a scene from the parent page`),is({type:`pgmaps-engine-hello`,accepts:[...Uo]}));