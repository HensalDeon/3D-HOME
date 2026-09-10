import {baselineStairTreads as stairTreads,STAIR_STRUCTURE,stairSoffit} from './geometry.js';
export const stairOptions=[
 {id:'compact-255',title:'Retain stair thickness',kitchenDepth:2.55,frontLandingY:2.8,starterRisers:2,westRisers:7,minHeadroom:14*(3/17)-STAIR_STRUCTURE.waistVertical,note:'2 + 7 + 8 risers. Keeps the retained flight and level. Against the R6 150 mm RCC waist slab the tightest crossing is 2.29 m, still clear of the 2.20 m benchmark; the superseded 120 mm tread model read 2.50 m. Kitchen depth 2.55 m; exact south–north–east ascent is not achieved.'},
 {id:'target-276',title:'Target kitchen depth',kitchenDepth:2.76,frontLandingY:3.05,starterRisers:3,westRisers:6,minHeadroom:12*(3/17)-STAIR_STRUCTURE.waistVertical,note:'3 + 6 + 8 risers. Against the R6 150 mm RCC waist slab the tight crossing falls to 1.934 m, 0.266 m under the 2.20 m benchmark (the superseded 120 mm tread model read 2.174 m). A conventional cast-in-situ waist slab cannot recover it; this option stays rejected.'},
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
 const slabs=[[0,0,6,3.2],[0,3.2,.15,6.1],[2.05,3.2,6,6.1],[.15,6.1,6,9.7],[0,6.1,.15,9.7],[1.05,3.2,2.05,3.45]];
 // R6: overhead is the RCC waist/landing soffit, not the old 120 mm tread underside. The option
 // only restudies the ground lower flight, so that flight and its landing extension are not overhead.
 return Math.min(...optionTreads(option).slice(0,8).map(s=>{
  const c=[stairSoffit(s.box,'ground',{exclude:['lower','extension']}),stairSoffit(s.box,'first',{offset:3})]
   .filter(v=>Number.isFinite(v)&&v>s.height).map(v=>v-s.height);
  for(const b of slabs)if(overlap(b,s.box))c.push(2.85-s.height);
  return Math.min(...c);
 }));
}
