import plan from './plan-data.json' with {type:'json'};
import layout from './under-stair-layout.json' with {type:'json'};
import frame from './structural-frame.json' with {type:'json'};
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
 ['g-stair','ground','South stair & passage',[.15,2.3,3.05,6.1],'17 risers · 0.90 m flights','R2 geometry unchanged: south-going starter, west-going lower flight and retained east-going upper flight; 2 + 7 + 8 equal risers, 250 mm treads and 900 mm flights. The lower-side intermediate landing extends 500 mm to meet the shorter lower run. R6 builds it as a conceptual cast-in-situ RCC folded plate - a continuous 150 mm waist slab under each flight, monolithic with 150 mm landing slabs - carried on the plinth, the west external wall, a landing beam zone inside the bedroom cross-wall line and the floor-slab trimmer. No cantilevered treads, no stringers, no wall below the upper flight and no load on either 100 mm partition. Waist thickness, landing beams, supports, reinforcement and connections TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER.',7],
 ['f-study','first','Study / family',[.15,.15,3.05,2.2],'2.90 × 2.05 m','Southeast study above the kitchen, with a front window and access to the gallery.',4],
 ['f-master','first','Master / southwest',[.15,6.2,3.05,9.55],'2.90 × 3.35 m','South-facing bed head. Private ensuite and a separate side door to the rear drying balcony.',4],
 ['f-child','first','Bedroom 3 / north',[3.15,2.5,5.85,6.1],'2.70 × 3.60 m','North bedroom retained. The existing 0.55 m deep, 2.10 m high oak wardrobe now returns along the entrance wall with paired corner-access doors; the bedroom door and north window remain clear.',4],
 ['f-bath2','first','Ensuite 2',[3.15,6.2,4.45,8.2],'1.30 × 2.00 m','Master ensuite, stacked directly above Ensuite 1. Rear-facing high-level vent.',4],
 ['f-bath3','first','Ensuite 3',[4.55,6.2,5.85,8.2],'1.30 × 2.00 m','Private to Bedroom 3; above the ground service passage. Rear vent and north-side window.',4],
 ['f-balcony','first','Front balcony',[3.15,0,5.85,1.2],'2.70 × 1.20 m','Glass railing and recessed sliding door, reached from the common front gallery.',4],
 ['f-drying','first','Rear drying balcony',[3.15,8.3,5.85,9.7],'2.70 × 1.40 m','Covered and ventilated. Entry is from the master side wall, never through either bathroom.',4],
 ['f-gallery','first','Front gallery',[3.15,1.35,5.85,2.4],'2.70 × 1.05 m','Common access between study, bedroom and front balcony.',4],
 ['f-stair','first','Stair continuation',[.15,2.3,3.05,6.1],'17 risers to roof','The upward flight remains open. Full stair access to +6.45 m, with a separate downward arrival from ground. The FF-to-roof stair repeats the same conceptual RCC waist and landing slabs, springing off the first-floor slab edge and framing into the roof slab. TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER.',8],
 ['r-head','roof','Roof stair enclosure',[0,2.15,2.2,6.25],'2.20 × 4.10 m outside','9.02 m² additional area. 2.40 m clear landing height; cap +9.00 m. North-side 900 mm outward-opening exit.',9],
 ['r-terrace','roof','Open roof terrace',[2.2,.15,5.85,9.55],'Roof level +6.45 m','Open to sky, with 1.10 m perimeter guarding. Drainage falls, outlet and overflow are indicative.',5],
 ['r-services','roof','Services reserve',[.35,7.5,1.8,9.05],'Indicative reserve','A reserved footprint only. No water tank or solar installation is specified in the plan.',5],
 ['g-wash','ground','Stepped vanity / user faces WEST',revision.wash.box,'0.50 × 0.35 m basin · 1.40–1.75 m from the bedroom wall','R6: the R5 basin, counter, drawer and standing zone do not move, and the user faces WEST as before. Under the conceptual RCC waist slab the soffit is an inclined plane rather than a flat lid under each tread, so the clear heights fall: 1.98 m over the 150 mm leaning strip, 2.09 m over the body line, 2.40 m at the rear and 1.73 m at the back of the bowl. The whole standing zone is now below the 2.20 m benchmark; the disclosed fallback of a 2.00 m front edge gives 2.16 m. The mirror partition drops from 1.75 to 1.65 m to stay 45 mm clear of the soffit. Reached through the existing 900 mm stair-entry opening behind the TV panel. Hand washing only.',3],
 ['g-storage','ground','Rectangular cabinet / lower flight',revision.storage[0].box,'500 W × 550 D × 800 H mm','R6: the cabinet keeps its R3 footprint beneath the last two lower-flight treads, with its flat top and two 250 mm doors. Its height comes down from 1080 to 800 mm to stay 45 mm clear of the 0.85 m lower-flight waist soffit: a waist slab hangs one riser plus its own thickness below each nosing, which the superseded flat-lid tread model did not account for. Access is still from the wash side through a 400 mm strip beside the basin, now under a 1.73–2.09 m soffit: stoop access to a low cabinet, not a passage. The former 600 mm passage opening is closed by a fixed oak panel on the TV line, which sits beside the flight and is unaffected. Existing aperture unchanged; structural review remains applicable.',3],
 ['g-store','ground','Under-landing store / low zone',revision.store.box,'1.90 × 1.35 m · 1.38–1.56 m clear','R6: the R5 store keeps its 1.90 × 1.35 m footprint and about 2.6 m², but the conceptual RCC landing slab and waist lower every soffit, so the stepped carcass top becomes 1.37 m under the landing slab, 1.33 m where the waist springs off it and 1.51 m under riser 11, holding about 3.5 m³. The two 450 mm bifold leaves stay 1.40 m high and still clear the 1.42 m landing soffit, opening from the passage beside the bedroom door where the person stands under the full 2.85 m slab; the deeper pocket under the lower landing is crouch-in bulk storage. R6 carries the landing on a beam zone inside the bedroom cross-wall line rather than on the 100 mm stair-side partition, so the 900 × 1400 mm opening no longer depends on that partition being non-bearing, but the whole support system and the cut still need the structural engineer.',3],
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
   const z=points[i+1];
   // Adjoining apertures whose edges differ only by float noise would leave a zero-width sliver.
   if(z-a<1e-6)return [];
   const mid=(a+z)/2,ap=cuts.filter(o=>mid>(axis==='h'?o.box[0]:o.box[1])-1e-6&&mid<(axis==='h'?o.box[2]:o.box[3])+1e-6);
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

// --- Conceptual RCC stair structure -------------------------------------------------
// R6: the stair is represented as a conventional cast-in-situ folded plate - a continuous
// waist slab under each flight, monolithic with the landing slabs at the turns. It bears on
// the plinth, the 150 mm west external wall, a landing beam zone inside the existing bedroom
// cross-wall line, and the floor-slab trimmer at the stairwell edge. The 100 mm stair-side and
// bedroom partitions carry nothing. Thicknesses are indicative massing shared with the drawings
// through under-stair-layout.json; the final design is the structural engineer's.
const SLOPE=Math.hypot(.25,3/17);
export const STAIR_STRUCTURE={
 ...layout.structure,
 tread:.25,riser:3/17,slope:SLOPE,pitchCos:.25/SLOPE,
 pitchDeg:Math.atan2(3/17,.25)*180/Math.PI,
 // Vertical depth of the inclined waist, measured down from the nosing line.
 // Vertical construction zone under the finished nosing line: the walking levels are fixed, so
 // the 20 mm stone finish sits above the concrete and the waist hangs below it.
 waistVertical:(layout.structure.waist+layout.structure.finish)*SLOPE/.25,
 landingZone:layout.structure.landingSlab+layout.structure.finish,
};
export const STAIR_BEAM_ZONES=layout.structure.beamZones;

// Each flight as the top plane of its waist slab: the line through the steps' internal corners,
// one riser below the nosing line, given as a to b in (plan y, height above the floor it starts
// from). Solid steps are cast on top of it, so the construction depth at each nosing is one
// riser plus the waist.
export function stairFlights(level='ground'){
 // runIn is how far each end is run into the slab it frames into, for representation only. The
 // ends that meet the intermediate landing get none: there the waist stops at the landing edge
 // and the landing slab takes over, so nothing hangs into the store below it.
 const r=3/17,upper={id:'upper',x:[1.15,2.05],a:[5.2,9*r],b:[3.45,16*r],runIn:[0,.15],bearing:['intermediate landing slab','floor-slab trimmer at y = 3.45']};
 return level==='ground'
  ?[{id:'lower',x:[.15,1.05],a:[3.2,2*r],b:[4.7,8*r],runIn:[.15,0],bearing:['starter landing on plinth fill','intermediate landing slab']},upper]
  :[{id:'lower',x:[.15,1.05],a:[3.2,0],b:[5.2,8*r],runIn:[.15,0],bearing:['floor slab edge at y = 3.20','intermediate landing slab']},upper];
}
export function stairLandingSlabs(level='ground'){
 const r=3/17,slabs=[{id:'intermediate',box:[.15,5.2,2.05,6.1],top:9*r,bearing:'landing beam zone in the bedroom cross-wall line'}];
 if(level==='ground')slabs.push(
  {id:'extension',box:[.15,4.7,1.05,5.2],top:9*r,bearing:'monolithic with the intermediate landing'},
  {id:'starter',box:[.15,2.3,1.05,3.2],top:2*r,bearing:'plinth fill / ground slab',onGround:true});
 return slabs;
}
const boxesOverlap=(a,b)=>Math.min(a[2],b[2])-Math.max(a[0],b[0])>1e-9&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>1e-9;
// Lowest structural soffit of the stair over a plan box, in that level's own floor datum.
// Infinity when no flight or landing passes above the box.
export function stairSoffit(box,level='ground',{exclude=[],offset=0}={}){
 const v=[];
 for(const f of stairFlights(level)){
  if(exclude.includes(f.id))continue;
  const lo=Math.min(f.a[0],f.b[0]),hi=Math.max(f.a[0],f.b[0]);
  if(!boxesOverlap(box,[f.x[0],lo,f.x[1],hi]))continue;
  const h=y=>f.a[1]+(f.b[1]-f.a[1])*(y-f.a[0])/(f.b[0]-f.a[0]);
  for(const y of [Math.max(box[1],lo),Math.min(box[3],hi)])v.push(h(y)-STAIR_STRUCTURE.waistVertical);
 }
 for(const s of stairLandingSlabs(level)){
  if(s.onGround||exclude.includes(s.id))continue;
  if(boxesOverlap(box,s.box))v.push(s.top-STAIR_STRUCTURE.landingZone);
 }
 return v.length?offset+Math.min(...v):Infinity;
}

// --- Conceptual whole-house structural framing ---------------------------------------
// R7: one coordinated framing option for the engineer to accept or replace. Columns sit
// inside wall lines and piers that already exist, beams run on the grid, floor slabs are the
// 150 mm already assumed. Sizes are indicative massing only; nothing here is a design.
export const FRAME=frame;
export const frameColumns=()=>frame.columns;
export const frameBeams=()=>frame.beams;
export const frameTrimmers=()=>frame.trimmers;
// Structural levels a member appears at: floor slabs above the ground and first storeys, and
// the roof-enclosure cover. The ground floor is on grade, so no beams sit at +0.45.
export const frameLevels=()=>frame.slabs.levels;
export function frameSpans(){
 return frame.beams.map(b=>({id:`${b.grid}: ${b.from}-${b.to}`,span:b.span,within:b.within}));
}
