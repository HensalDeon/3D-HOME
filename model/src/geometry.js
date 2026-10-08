import plan from './plan-data.json' with {type:'json'};
import layout from './under-stair-layout.json' with {type:'json'};
import frame from './structural-frame.json' with {type:'json'};
import {revision,revisedWallBoxes,storageWallOpenings} from './revision.js';
export {plan};
export const LEVELS={ground:.45,first:3.45,roof:6.45};
// R8: 220 mm ground external walls, 170 mm on the first floor, 150 mm finished partitions including plaster.
// The west wall grew outward into the parking strip and the rear into the garden; the east and
// front walls thickened inward, so every inner face the stair and under-stair unit rely on is
// unmoved. ENVELOPE is the outer face of each level.
export const EXTERNAL_WALL={ground:.22,first:.17,roof:.17};
export const ENVELOPE={ground:[-.07,0,6,9.77],first:[-.02,0,6,9.72],roof:[-.02,0,6,9.72]};
export const rooms=[
 ['g-kitchen','ground','Kitchen / southeast',plan.dimensions.room_boxes_m['g-kitchen'],'','East-facing hob; separate sink on the north counter. Door opens from the stair passage.',3],
 ['g-living','ground','Living & dining',plan.dimensions.room_boxes_m['g-living'],'','R1: the passage partition is removed conditionally, opening the former passage into the living area. R14 holds the coordinated R10 opening in the stair-side partition from y = 3.20 to y = 5.20: cut away to +2.10 m, retained above as a plastered header to the 2.85 m slab soffit. A full-height opening is not assumed and needs separate structural and architectural verification. Nothing is built against that wall any more - R14 moves the TV joinery across the stairwell into the bay under the lower/west flight, so from the living room you look through the opening, under the header, to the fitted composition about 1.40 m beyond. Nothing projects into the open living connection. Beyond y = 5.20 the wall still opens directly onto the basin nook through the 0.90 m archway, with no doors. The living floor is open. Independent rear access is retained.',3],
 ['g-bed','ground','Bedroom 1 / southwest',plan.dimensions.room_boxes_m['g-bed'],'','Bed head faces south. R18: 1500 x 550 mm fitted ivory/oak wardrobe with 400 mm loft, narrow paired doors, and a lift-up storage bed base. Private sliding access to Ensuite 1; entrance from the level stair passage.',3],
 ['g-bath','ground','Ensuite 1',plan.dimensions.room_boxes_m['g-bath'],'','WC, basin and shower; accessible only from Bedroom 1.',3],
 ['g-sit','ground','East sit-out',plan.dimensions.room_boxes_m['g-sit'],'','Covered entry within the ground-floor external envelope. Three approach steps.',3],
 ['g-work','ground','Rear work area',plan.dimensions.room_boxes_m['g-work'],'','Sink, washing machine and preparation counter. Wash only; no rear cooking hearth. Direct backyard steps.',3],
 ['g-route','ground','Rear service passage',plan.dimensions.room_boxes_m['g-route'],'','Independent route from dining to the work area without entering a bedroom or ensuite.',3],
 ['g-stair','ground','South stair & passage',plan.dimensions.room_boxes_m['g-stair'],'','R9: south-going starter, west-going lower flight and shortened east-going upper flight; 5 + 7 + (4 + arrival) risers, 250 mm treads and 900 mm flights. The starter grows from 2 to 5 risers using floor inside the stair\'s own footprint beside the first riser; the west flight keeps its R2 tread positions, renumbered 3 risers higher; the upper return flight shrinks from 7 to 4 risers at the same going, so the intermediate landing rises from riser 9 to riser 12 and the first-floor trimmer moves from y = 3.45 to y = 4.2. It is built as a conceptual cast-in-situ RCC folded plate - a continuous 150 mm waist slab under each flight, monolithic with 150 mm landing slabs - carried on the plinth, the west external wall, a landing beam zone inside the bedroom cross-wall line and the floor-slab trimmer. No cantilevered treads, no stringers, no wall below the upper flight and no load on either 150 mm finished partition. Waist thickness, landing beams, supports, reinforcement and connections TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER. The R12 stair, all risers, flights, landings, trimmer, structural support conditions and retained +2.10 to +2.85 m plastered header are unchanged. The west-wall basin still faces EAST with its floating vanity, vessel, black mixer, mirror, standing zone and 0.90 m doorless access unchanged. The nook remains physically separate. The retained header conceals part of the upper flight; the lower flight and its diagonal can be seen through the space above the reduced panel.',7],
 ['f-study','first','Study / family',plan.dimensions.room_boxes_m['f-study'],'','Southeast family/tailoring room above the kitchen, open to the stair base after removal of the study/stair partition. Existing beam and stair structure retained. Three sewing stations use two compact workbenches, with a 650 mm occupied-chair aisle. A 750 x 450 mm shared linen/household cabinet is tucked against the side wall; 400 mm loft, open above. Gallery and balcony boundary retained.',4],
 ['f-master','first','Master / southwest',plan.dimensions.room_boxes_m['f-master'],'','South-facing bed head. R18: ivory/oak wardrobe with 400 mm loft and narrow paired doors; lift-up storage bed base. Private ensuite and a separate side door to the rear drying balcony.',4],
 ['f-child','first','Bedroom 3 / north',plan.dimensions.room_boxes_m['f-child'],'','North bedroom retained. R18: the 550 mm deep L wardrobe has matte ivory fronts, a muted oak accent bay, narrow paired corner-access doors and a 400 mm loft above the 2100 mm main unit. The lift-up storage bed keeps its footprint; bedroom door and north window remain clear.',4],
 ['f-bath2','first','Ensuite 2',plan.dimensions.room_boxes_m['f-bath2'],'','Master ensuite, stacked directly above Ensuite 1. Rear-facing high-level vent.',4],
 ['f-bath3','first','Ensuite 3',plan.dimensions.room_boxes_m['f-bath3'],'','Private to Bedroom 3; above the ground service passage. Rear vent and north-side window.',4],
 ['f-balcony','first','Front balcony',plan.dimensions.room_boxes_m['f-balcony'],'','Glass railing and recessed sliding door, reached from the common front gallery.',4],
 ['f-drying','first','Rear drying balcony',plan.dimensions.room_boxes_m['f-drying'],'','Covered and ventilated. Entry is from the master side wall, never through either bathroom.',4],
 ['f-gallery','first','Front gallery',plan.dimensions.room_boxes_m['f-gallery'],'','Common access between study, bedroom and front balcony.',4],
 ['f-passage','first','Common passage',plan.dimensions.room_boxes_m['f-passage'],'','900 mm clear between the retained stair wall and aligned central partition.',4],
 ['f-stair','first','Stair continuation',plan.dimensions.room_boxes_m['f-stair'],'','The upward flight remains open. Full stair access to +6.45 m, with a separate downward arrival from ground. The FF-to-roof stair repeats the same conceptual RCC waist and landing slabs, springing off the first-floor slab edge and framing into the roof slab. TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER.',8],
 ['r-head','roof','Roof stair enclosure',[0,2.15,2.2,6.25],'2.20 × 4.10 m outside','9.02 m² additional area. 2.40 m clear landing height; cap +9.00 m. North-side 900 mm outward-opening exit.',9],
 ['r-terrace','roof','Open roof terrace',[2.2,.15,5.85,9.55],'Roof level +6.45 m','Open to sky, with 1.10 m perimeter guarding. Drainage falls, outlet and overflow are indicative.',5],
 ['r-services','roof','Services reserve',[.35,7.5,1.8,9.05],'Indicative reserve','A reserved footprint only. No water tank or solar installation is specified in the plan.',5],
 ["g-media", "ground", "Fitted under-stair TV, lower-flight bay", revision.tv.unit, "2.25 \u00d7 0.35 m cabinet \u00b7 x = 0.69-1.04 \u00b7 faces east", "R14 builds the fitted TV joinery into the volume under the lower/west flight instead of against the stair-side wall. A 30 mm oak backing at x = 0.72-0.75 follows the measured underside of that flight, held 60 mm clear, rising from +0.569 m at y = 3.23 to +1.691 m at y = 4.82 and then running level at +1.888 m under the 12R landing to y = 5.45. A 2.25 x 0.35 m base cabinet capped at +0.45 m on a recessed lit plinth runs the whole length with its face at x = 1.04, just clear of the flight edge at x = 1.05 and its balustrade at x = 1.07. A 43-inch screen, 0.96 x 0.54 m, is surface-mounted on the backing at centreline y = 4.64 and centre +0.87 m; a low shelf sits beside it and a two-shelf end bay closes the run at the nook end. The unit faces EAST and is seen from the living room through the retained 2.00 m headed opening, about 1.40 m away. Nothing is built against the stair-side wall and nothing enters the open living connection. Enclosed storage is about 0.265 m3.", 7],
 ['g-wash','ground','Washbasin in the lower-flight bay, continuing the TV run',revision.wash.box,'0.62 \u00d7 0.35 m vanity \u00b7 x = 0.69-1.04, y = 5.48-6.10 \u00b7 faces east','R15 moves the basin out of the corner against the bedroom (west) wall and into the same band as the TV joinery, continuing that run past its end bay to the wall. It keeps the same 0.35 m depth, the same face plane at x = 1.04 and the same east-facing orientation as the screen across the bay, so you walk in through the 0.90 m archway and the basin is square in front of you instead of 90 degrees to your right. The +0.86 m rim, the 0.40 \u00d7 0.80 m vertical mirror at z = 1.00-1.80, the 750 \u00d7 600 mm standing zone and the archway itself are exactly as approved; the vanity gains 0.12 m only because the bay now runs to the wall. Clear height becomes a uniform 1.95 m under the flat 12R landing, because the standing zone no longer reaches the landing edge that gave the old position its 1.91 m. A full-height oak fin at y = 5.45-5.48 closes the TV run and screens the joinery from splash, so the two share one backing and one face plane while remaining separate bays. Supply and waste run behind the backing panel and turn into the y = 6.10 wall at the end of the run - TO BE COORDINATED WITH THE PLUMBING DESIGN. The corner it vacates, x = 1.25-2.05 and y = 5.15-6.10 against the already-panelled wall, is left clear for the enclosed storage this design has lacked since R9 deleted the under-stair store. Hand washing only.',3],
].map(([id,level,name,box,dimensions,description,sheet])=>({id,level,name,box,dimensions,description,sheet}));
// R17 room faces come from the coordinated drawing dimensions.
for(const room of rooms){
 const b=plan.dimensions.room_boxes_m?.[room.id];
 if(b){room.box=b;room.dimensions=`${(b[2]-b[0]).toFixed(3)} × ${(b[3]-b[1]).toFixed(3)} m clear`;}
 if(room.id==='g-stair')room.dimensions='17 risers · 0.90 m clear flights';
 if(room.id==='f-stair')room.dimensions='17 risers to roof · 0.90 m clear passage';
 room.clearAreaM2=plan.dimensions.room_clear_areas_m2?.[room.id];
 const regions=plan.dimensions.room_regions_m?.[room.id];if(regions)room.regions=regions;
}
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
   if(c.op==='opening'&&x===3.1&&y===6.6)kind='surface-slider';
   if(c.op==='door'&&c.kwargs?.leaf===false)kind='surface-slider';
   if(c.op==='window'&&axis==='v'&&x===5.83&&y===7){sill=1.65;height=.5;}
  }
  return {x,y,w,t,axis,sill,height,kind,assumed,swing,hinge,box:axis==='h'?[x,y,x+w,y+t]:[x,y,x+t,y+w]};
 });
 return level==='ground'?[...openings,...storageWallOpenings]:openings;
}
// Split every wall at real aperture edges in plan and elevation; no opaque wall behind glazing.
export function wallPieces(level){
 const ops=openingsFor(level),height=level==='roof'?2.4:2.85;
 const walls=revisedWallBoxes(level,plan.levels[level].filter(c=>c.op==='wall').map(c=>c.args.slice(0,4)));
 // The north rear privacy screen is drawn as a dark fill, not a wall command. R8: on the ground
 // floor it follows the thickened east and rear faces.
 if(level!=='roof'){const e=ENVELOPE[level];walls.push([6-EXTERNAL_WALL[level],8.50,6,e[3]]);}
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

// R9: the ground-to-first stair is fully custom (5 + 7 + 4-risers-and-arrival = 17); the
// first-to-roof stair keeps the original baseline (2 + 7 + 8-risers-and-arrival) untouched, so
// this no longer reuses baselineStairTreads() past index 0 for the ground level.
export function stairTreads(level='ground'){
 const retained=baselineStairTreads();
 if(level!=='ground')return retained;
 const r=3/17,steps=[];
 for(let i=0;i<4;i++)steps.push({box:[1.8-i*.25,2.3,2.05-i*.25,3.2],height:(i+1)*r,direction:'S'});
 steps.push({box:[.15,2.3,1.05,3.2],height:5*r,landing:true});
 for(let i=0;i<6;i++)steps.push({box:[.15,3.2+i*.25,1.05,3.45+i*.25],height:(6+i)*r,direction:'W'});
 steps.push({box:[.15,5.2,2.05,6.1],height:12*r,landing:true});
 for(let i=0;i<4;i++)steps.push({box:[1.15,4.95-i*.25,2.05,5.2-i*.25],height:(13+i)*r});
 steps.push({box:[1.15,2.3,2.05,4.2],height:3,arrival:true});
 return steps;
}
export function stairLandingExtensions(level='ground'){
 return level==='ground'?[{box:revision.stair.landingExtension,height:12*(3/17)}]:[];
}

// --- Conceptual RCC stair structure -------------------------------------------------
// R6: the stair is represented as a conventional cast-in-situ folded plate - a continuous
// waist slab under each flight, monolithic with the landing slabs at the turns. It bears on
// the plinth, the west external wall, a landing beam zone at the rear landing edge
// ending at x = 2.05 clear of the bedroom entrance, and the floor-slab trimmer.
// Bearing at the landing edge must be designed; the adjacent partition is not a support. The 150 mm finished stair-side and
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
 // Vertical depth of the concrete waist alone, measured down from the STRUCTURAL step corners.
 // The 20 mm finish is the rest of the construction zone and sits above those corners, so a slab
 // hung this far below them lands its soffit exactly waistVertical under the finished corner
 // line - which is what stairSoffit() reports and what the drawing set's WZONE draws.
 waistConcreteVertical:(layout.structure.waist+layout.structure.finish)*SLOPE/.25-layout.structure.finish,
 landingZone:layout.structure.landingSlab+layout.structure.finish,
};
// R9 moves the ground-to-first upper flight's trimmer to y = 4.2, but the first-to-roof stair
// keeps its own trimmer at y = 3.2-3.45 (unchanged), so the two levels need different zones here.
export function stairBeamZones(level='ground'){
 const [landingBeam,groundTrimmer]=layout.structure.beamZones;
 if(level==='ground')return [landingBeam,groundTrimmer];
 return [landingBeam,{...groundTrimmer,box:[1.05,3.2,2.05,3.45],within:'existing floor-slab edge at the stairwell opening (first-to-roof stair, unchanged by R9)'}];
}
export const STAIR_BEAM_ZONES=stairBeamZones('ground');

// Each flight as the top plane of its waist slab: the line through the steps' internal corners,
// one riser below the nosing line, given as a to b in (plan y, height above the floor it starts
// from). Solid steps are cast on top of it, so the construction depth at each nosing is one
// riser plus the waist.
export function stairFlights(level='ground'){
 // runIn is how far each end is run into the slab it frames into, for representation only. The
 // ends that meet the intermediate landing get none: there the waist stops at the landing edge
 // and the landing slab takes over, so nothing hangs into the store below it.
 // R9: the ground-to-first upper flight sheds 3 risers (7 -> 4) and its trimmer moves from
 // y = 3.45 to y = 4.2; the first-to-roof upper flight is untouched, so the two levels now need
 // separate 'upper' flight objects instead of one shared between them.
 const r=3/17;
 const upperGround={id:'upper',x:[1.15,2.05],a:[5.2,12*r],b:[4.2,16*r],runIn:[0,.15],bearing:['intermediate landing slab','floor-slab trimmer at y = 4.2']};
 const upperFirst={id:'upper',x:[1.15,2.05],a:[5.2,9*r],b:[3.45,16*r],runIn:[0,.15],bearing:['intermediate landing slab','floor-slab trimmer at y = 3.45']};
 return level==='ground'
  ?[{id:'lower',x:[.15,1.05],a:[3.2,5*r],b:[4.7,11*r],runIn:[.15,0],bearing:['starter landing on plinth fill','intermediate landing slab']},upperGround]
  :[{id:'lower',x:[.15,1.05],a:[3.2,0],b:[5.2,8*r],runIn:[.15,0],bearing:['floor slab edge at y = 3.20','intermediate landing slab']},upperFirst];
}
export function stairLandingSlabs(level='ground'){
 const r=3/17,top=level==='ground'?12*r:9*r;
 const slabs=[{id:'intermediate',box:[.15,5.2,2.05,6.1],top,bearing:'indicative landing beam ending at x = 2.05; end bearing to be designed'}];
 if(level==='ground')slabs.push(
  {id:'extension',box:[.15,4.7,1.05,5.2],top,bearing:'monolithic with the intermediate landing'},
  {id:'starter',box:[.15,2.3,1.05,3.2],top:5*r,bearing:'plinth fill / ground slab',onGround:true});
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
