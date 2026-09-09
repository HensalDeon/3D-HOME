import plan from './plan-data.json' with {type:'json'};
import {revision,revisedWallBoxes,storageWallOpenings} from './revision.js';
export {plan};
export const LEVELS={ground:.45,first:3.45,roof:6.45};
export const rooms=[
 ['g-kitchen','ground','Kitchen / southeast',[.15,.15,3.05,2.2],'2.90 × 2.05 m','East-facing hob; separate sink on the north counter. Door opens from the stair passage.',3],
 ['g-living','ground','Living & dining',[3.15,1.35,5.85,6.1],'2.70 × 4.75 m bay','R1: the passage partition is removed conditionally, opening the former passage into the living area. The TV is built into a slim stair-boundary panel centered on the old cabinet span, and R5 continues that line with a fixed oak panel so the passage reads as one joinery wall: TV, panel, store doors. The living floor is open; the basin and cabinet are reached through the stair entry behind the panel. Independent rear access is retained.',3],
 ['g-bed','ground','Bedroom 1 / southwest',[.15,6.2,3.05,9.55],'2.90 × 3.35 m','Bed head faces south. Private sliding access to Ensuite 1; entrance from the level stair passage.',3],
 ['g-bath','ground','Ensuite 1',[3.15,6.2,4.45,8.2],'1.30 × 2.00 m','WC, basin and shower; accessible only from Bedroom 1.',3],
 ['g-sit','ground','East sit-out',[3.15,0,5.85,1.2],'2.70 × 1.20 m','Covered entry within the 6.00 × 9.70 m envelope. Three approach steps.',3],
 ['g-work','ground','Rear work area',[3.15,8.3,5.85,9.7],'2.70 × 1.40 m','Sink, washing machine and preparation counter. Wash only; no rear cooking hearth. Direct backyard steps.',3],
 ['g-route','ground','Rear service passage',[4.55,6.2,5.85,8.2],'1.30 m clear','Independent route from dining to the work area without entering a bedroom or ensuite.',3],
 ['g-stair','ground','South stair & passage',[.15,2.3,3.05,6.1],'17 risers · 0.90 m flights','R2: south-going starter, west-going lower flight and retained east-going upper flight; 2 + 7 + 8 equal risers, 250 mm treads and 900 mm flights. The lower-side intermediate landing extends 500 mm to meet the shorter lower run. Kitchen boundary stays fixed to protect the wash standing space and stair entry.',7],
 ['f-study','first','Study / family',[.15,.15,3.05,2.2],'2.90 × 2.05 m','Southeast study above the kitchen, with a front window and access to the gallery.',4],
 ['f-master','first','Master / southwest',[.15,6.2,3.05,9.55],'2.90 × 3.35 m','South-facing bed head. Private ensuite and a separate side door to the rear drying balcony.',4],
 ['f-child','first','Bedroom 3 / north',[3.15,2.5,5.85,6.1],'2.70 × 3.60 m','North bedroom retained. The existing 0.55 m deep, 2.10 m high oak wardrobe now returns along the entrance wall with paired corner-access doors; the bedroom door and north window remain clear.',4],
 ['f-bath2','first','Ensuite 2',[3.15,6.2,4.45,8.2],'1.30 × 2.00 m','Master ensuite, stacked directly above Ensuite 1. Rear-facing high-level vent.',4],
 ['f-bath3','first','Ensuite 3',[4.55,6.2,5.85,8.2],'1.30 × 2.00 m','Private to Bedroom 3; above the ground service passage. Rear vent and north-side window.',4],
 ['f-balcony','first','Front balcony',[3.15,0,5.85,1.2],'2.70 × 1.20 m','Glass railing and recessed sliding door, reached from the common front gallery.',4],
 ['f-drying','first','Rear drying balcony',[3.15,8.3,5.85,9.7],'2.70 × 1.40 m','Covered and ventilated. Entry is from the master side wall, never through either bathroom.',4],
 ['f-gallery','first','Front gallery',[3.15,1.35,5.85,2.4],'2.70 × 1.05 m','Common access between study, bedroom and front balcony.',4],
 ['f-stair','first','Stair continuation',[.15,2.3,3.05,6.1],'17 risers to roof','The upward flight remains open. Full stair access to +6.45 m, with a separate downward arrival from ground.',8],
 ['r-head','roof','Roof stair enclosure',[0,2.15,2.2,6.25],'2.20 × 4.10 m outside','9.02 m² additional area. 2.40 m clear landing height; cap +9.00 m. North-side 900 mm outward-opening exit.',9],
 ['r-terrace','roof','Open roof terrace',[2.2,.15,5.85,9.55],'Roof level +6.45 m','Open to sky, with 1.10 m perimeter guarding. Drainage falls, outlet and overflow are indicative.',5],
 ['r-services','roof','Services reserve',[.35,7.5,1.8,9.05],'Indicative reserve','A reserved footprint only. No water tank or solar installation is specified in the plan.',5],
 ['g-wash','ground','Stepped vanity / user faces WEST',revision.wash.box,'0.50 × 0.35 m basin · 1.40–1.75 m from the bedroom wall','R5: a semi-recessed basin on a 350 mm counter with a drawer, backed by the mirror partition 1.40 m from the bedroom wall. The user faces WEST from a 750 × 600 mm standing zone 1.75–2.35 m from the wall: 2.17 m clear over the 150 mm leaning strip, 2.35 m over the body line and 2.53 m at the rear, with 2.00 m over the bowl. The basin is 0.53 m closer to the bedroom wall than R4, the westernmost usable line, and is reached through the existing 900 mm stair-entry opening behind the TV panel. Hand washing only.',3],
 ['g-storage','ground','Rectangular cabinet / lower flight',revision.storage[0].box,'500 W × 550 D × 1080 H mm','R5: the R3 cabinet stays beneath the last two lower-flight treads with its flat top and two 250 mm doors. Its access moves to the wash side through a 400 mm strip beside the basin under a 2.00–2.17 m soffit: stoop access to a low cabinet, not a passage. The former 600 mm passage opening is closed by a fixed oak panel on the TV line. Existing aperture unchanged; original structural review remains applicable.',3],
 ['g-store','ground','Under-landing store / low zone',revision.store.box,'1.90 × 1.35 m · 1.42–1.77 m clear','R5: the 1.47 m-high zone under the intermediate landing becomes one built-in store of about 2.6 m² and 3.7 m³, with a stepped carcass top following the landing and riser soffits. Two 450 mm bifold leaves open from the passage beside the bedroom door, where the person stands under the full 2.85 m slab; the deeper pocket under the lower landing is crouch-in bulk storage. The 900 × 1400 mm opening is cut in the retained 100 mm stair-side partition and needs the structural engineer to confirm the landing does not bear on it; the fallback is a mirror-fronted door with no wall change.',3],
].map(([id,level,name,box,dimensions,description,sheet])=>({id,level,name,box,dimensions,description,sheet}));
rooms.find(r=>r.id==='g-living').regions=[[3.15,1.35,5.85,6.1],[2.15,2.3,3.15,6.1]];
export function openingsFor(level){
 const front=plan.openings[level==='ground'?'FRONT_GF':'FRONT_FF'];
 const rear=plan.openings[level==='ground'?'REAR_GF':'REAR_FF'];
 const openings=plan.levels[level].filter(c=>['door','window','opening'].includes(c.op)).filter(c=>!(level==='ground'&&c.op==='opening'&&c.args[0]===3.05&&[2.45,5.2].includes(c.args[1]))).map(c=>{
  let [x,y,w,t,axis,swing=1,hinge='lo']=c.args;
  if(level==='ground'&&c.op==='opening'&&x===2.05&&y===2.35){y=2.3;w=.9;}
  let sill=0,height=2.1,kind=c.op,assumed=true;
  if(c.op==='window'){sill=1;height=1.2;}
  if(level==='roof'){
   if(c.op==='window'){sill=1.5;height=.45;kind='obscured';} else height=2.1;
   assumed=false;
  }else{
   const schedule=axis==='h' ? (y<=1.2?front:y>=8.2?rear:[]) : [];
   const match=schedule.find(a=>Math.abs(a[0]-x)<1e-6&&Math.abs(a[1]-w)<1e-6);
   if(match){[, ,sill,height,kind]=match;assumed=false;}
   if(c.op==='opening'&&x===3.05&&y===6.4)kind='pocket';
   if(c.op==='window'&&axis==='v'&&x===5.85&&y===7){sill=1.65;height=.5;}
  }
  return {x,y,w,t,axis,sill,height,kind,assumed,swing,hinge,box:axis==='h'?[x,y,x+w,y+t]:[x,y,x+t,y+w]};
 });
 return level==='ground'?[...openings,...storageWallOpenings]:openings;
}
// Split every wall at real aperture edges in plan and elevation; no opaque wall behind glazing.
export function wallPieces(level){
 const ops=openingsFor(level),height=level==='roof'?2.4:2.85;
 const walls=revisedWallBoxes(level,plan.levels[level].filter(c=>c.op==='wall').map(c=>c.args.slice(0,4)));
 // The north rear privacy screen is drawn as a dark fill, not a wall command.
 if(level!=='roof')walls.push([5.85,8.3,6,9.7]);
 return walls.flatMap(b=>{
  const axis=b[2]-b[0]>=b[3]-b[1]?'h':'v',lo=axis==='h'?b[0]:b[1],hi=axis==='h'?b[2]:b[3];
  const cuts=ops.filter(o=>Math.min(o.box[2],b[2])-Math.max(o.box[0],b[0])>1e-5&&Math.min(o.box[3],b[3])-Math.max(o.box[1],b[1])>1e-5);
  const points=[...new Set([lo,hi,...cuts.flatMap(o=>[Math.max(lo,axis==='h'?o.box[0]:o.box[1]),Math.min(hi,axis==='h'?o.box[2]:o.box[3])])])].sort((a,b)=>a-b);
  return points.slice(0,-1).flatMap((a,i)=>{
   const z=points[i+1],mid=(a+z)/2,ap=cuts.filter(o=>mid>(axis==='h'?o.box[0]:o.box[1])-1e-6&&mid<(axis==='h'?o.box[2]:o.box[3])+1e-6);
   let intervals=[[0,height]];
   for(const o of ap) intervals=intervals.flatMap(([s,e])=>[[s,Math.min(e,o.sill)],[Math.max(s,o.sill+o.height),e]].filter(([u,v])=>v-u>1e-5));
   return intervals.map(([s,e])=>({box:axis==='h'?[a,b[1],z,b[3]]:[b[0],a,b[2],z],bottom:s,top:e}));
  });
 });
}
export function baselineStairTreads(){
 const r=3/17,steps=[];
 for(let i=0;i<8;i++)steps.push({box:[.15,3.2+i*.25,1.05,3.45+i*.25],height:(i+1)*r});
 steps.push({box:[.15,5.2,2.05,6.1],height:9*r,landing:true});
 for(let i=0;i<7;i++)steps.push({box:[1.15,4.95-i*.25,2.05,5.2-i*.25],height:(10+i)*r});
 steps.push({box:[1.15,2.3,2.05,3.45],height:3,arrival:true});
 return steps;
}

export function stairTreads(level='ground'){
 const retained=baselineStairTreads();
 if(level!=='ground')return retained;
 const r=3/17,steps=[{box:[1.05,2.3,1.3,3.2],height:r,direction:'S'},
  {box:[.15,2.3,1.05,3.2],height:2*r,landing:true}];
 for(let i=0;i<6;i++)steps.push({box:[.15,3.2+i*.25,1.05,3.45+i*.25],height:(3+i)*r,direction:'W'});
 return [...steps,...retained.slice(8)];
}
export function stairLandingExtensions(level='ground'){
 return level==='ground'?[{box:revision.stair.landingExtension,height:9*(3/17)}]:[];
}
