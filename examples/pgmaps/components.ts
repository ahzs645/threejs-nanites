/** Rich components use exact dimensional envelopes; topology remains a species/form approximation. */
import type { StemTable } from './far-forest.ts';
export interface ComponentStem {
  record: number; ordinal: number; tone: number; x: number; y: number; z: number; species: string; height: number;
  width: number; crownBase: number; dbhMeters: number; form: number;
}
export function componentStems(t: StemTable): { components: ComponentStem[]; keep: number[] } {
  const f=(key:string)=>t.fields.indexOf(key), stride=t.fields.length;
  const ix=f('x'), iy=f('y'), iz=f('z'), ih=f('height'), iw=f('crownWidth'), isp=f('species');
  const ib=f('crownBase'), id=f('dbhCm'), iff=f('form'), src=f('source'), it=f('tone');
  const components:ComponentStem[]=[], keep:number[]=[];
  for(let i=0;i<t.count;i++) {
    const o=i*stride, h=t.data[o+ih], base=ib>=0?t.data[o+ib]:-1, dbh=id>=0?t.data[o+id]:0, form=iff>=0?t.data[o+iff]:0;
    const rich=(src>=0 && t.data[o+src]===2) || (base>=0 && Number.isFinite(base)) || dbh>0 || form>0;
    if(!rich || !Number.isFinite(h) || h<=0 || ![t.data[o+ix],t.data[o+iy],t.data[o+iz]].every(Number.isFinite)) { keep.push(i); continue; }
    const width=iw>=0?t.data[o+iw]:NaN;
    components.push({ record:i,ordinal:components.length,tone:it>=0&&Number.isFinite(t.data[o+it])?Math.max(0,Math.min(1,t.data[o+it])):.5,x:t.data[o+ix],y:t.data[o+iy],z:t.data[o+iz],species:t.species[t.data[o+isp]]??'spruce',height:h,
      width:Number.isFinite(width)&&width>0?width:h*.2,crownBase:Number.isFinite(base)&&base>=0?Math.min(1,base):(form>0?0:.3),
      dbhMeters:Number.isFinite(dbh)&&dbh>0?dbh/100:Math.max(.025,h*.012),form:form===1||form===2?form:0 });
  }
  return {components,keep};
}
export function selectStems<T extends StemTable>(t:T, keep:readonly number[]): T {
  if(keep.length===t.count)return t;
  const data:number[]=[];
  for(const i of keep) for(let j=0;j<t.fields.length;j++) data.push(t.data[i*t.fields.length+j]);
  const ids=t.ids;
  return {...t,count:keep.length,data,...(ids?{ids:keep.map(i=>ids[i])}:{})};
}

/** Bound draw submissions while retaining spatially useful culling on large imported stands. */
export function componentChunkSize(stems: readonly Pick<ComponentStem,'x'|'y'>[], maxTiles=24): number {
  if(!stems.length)return 250;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const s of stems){minX=Math.min(minX,s.x);maxX=Math.max(maxX,s.x);minY=Math.min(minY,s.y);maxY=Math.max(maxY,s.y);}
  let size=250;
  const cells=()=> (Math.floor(maxX/size)-Math.floor(minX/size)+1)*(Math.floor(maxY/size)-Math.floor(minY/size)+1);
  while(cells()>maxTiles)size*=2;
  return size;
}
