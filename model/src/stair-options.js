import {baselineStairTreads as stairTreads} from './geometry.js';
export const stairOptions=[
 {id:'compact-255',title:'Retain stair thickness',kitchenDepth:2.55,frontLandingY:2.8,starterRisers:2,westRisers:7,minHeadroom:2.85-2*(3/17),note:'2 + 7 + 8 risers. Keeps the retained flight, level and assumed 120 mm thickness. Kitchen depth 2.55 m; exact south–north–east ascent is not achieved.'},
 {id:'target-276',title:'Target kitchen depth',kitchenDepth:2.76,frontLandingY:3.05,starterRisers:3,westRisers:6,minHeadroom:13*(3/17)-.12,note:'3 + 6 + 8 risers. The retained 120 mm tread model gives 2.174 m at the tight crossing. To reach the 2.20 m benchmark, the upper construction zone must be ≤94 mm below its tread tops; engineering and finish allowances remain unresolved.'},
];
export function optionTreads(option){
 const r=3/17,steps=[],front=option.frontLandingY;
 for(let i=0;i<option.starterRisers-1;i++){
  const x=1.05+(option.starterRisers-2-i)*.25;
  steps.push({box:[x,front,x+.25,front+.9],height:(i+1)*r,direction:'S'});
 }
 steps.push({box:[.15,front,1.05,front+.9],height:option.starterRisers*r,landing:true});
 for(let i=0;i<option.westRisers-1;i++)steps.push({box:[.15,front+.9+i*.25,1.05,front+.9+(i+1)*.25],height:(option.starterRisers+1+i)*r,direction:'W'});
 steps.push(...stairTreads().slice(8));return steps;
}

export function modeledHeadroom(option){
 const overlap=(a,b)=>Math.min(a[2],b[2])-Math.max(a[0],b[0])>1e-8&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>1e-8;
 const original=stairTreads(),slabs=[[0,0,6,3.2],[0,3.2,.15,6.1],[2.05,3.2,6,6.1],[.15,6.1,6,9.7],[0,6.1,.15,9.7],[1.05,3.2,2.05,3.45]];
 const overhead=[...original.slice(8).map(s=>({box:s.box,underside:s.height-.12})),...slabs.map(box=>({box,underside:2.85})),...original.map(s=>({box:s.box,underside:3+s.height-.12}))];
 const clearances=optionTreads(option).slice(0,8).flatMap(s=>overhead.filter(o=>overlap(o.box,s.box)&&o.underside>s.height).map(o=>o.underside-s.height));
 return Math.min(...clearances);
}
