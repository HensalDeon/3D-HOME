import layout from './under-stair-layout.json' with {type:'json'};
export const revision={
 id:'R13',status:"R13 reduces the TV joinery within the unchanged R12 architecture. A 30 mm oak backing at x = 1.90-1.93 starts at y = 3.30, caps at +1.40 m to y = 4.20, then falls parallel to the actual upper-flight soffit to +0.729 m at y = 5.15. It leaves about 1.20 m of open vertical space below the raking soffit. The 43-inch screen is 0.96 x 0.54 m, centreline y = 3.88 and centre +0.97 m, in the taller portion. The low cabinet is 1.95 x 0.35 m, top +0.45 m, fronts flush at x = 2.15. Three small open boxes step down beyond the TV, tops +0.94 and +0.66 m. Upper shelves and the tall oak end trim are removed. Nothing projects into the 1.00 m passage. The R12 stair, all risers, flights, landings, trimmer, structural support conditions and retained +2.10 to +2.85 m plastered header are unchanged. The west-wall basin still faces EAST with its floating vanity, vessel, black mixer, mirror, standing zone and 0.90 m doorless access unchanged. The nook remains physically separate. The retained header conceals part of the upper flight; the lower flight and its diagonal can be seen through the space above the reduced panel.",
 demolitionStatus:'Conditional: the affected partitions must be confirmed non-load-bearing; retain or engineer support for the first-floor walls above. The intermediate landing is carried on a landing beam zone inside the bedroom cross-wall line, so the 100 mm stair-side partition is not assumed to support it. R9 moved the first-floor stairwell trimmer from y = 3.45 to y = 4.2 m. R10 cuts that same 100 mm stair-side partition away below +2.10 m between y = 3.20 and y = 5.20 and retains it above as a plastered header to the 2.85 m slab soffit, and R12 holds that headed condition unchanged. The header is 0.75 m deep over a 2.00 m span and is hung off the stair-side trimmer zone, which already runs the full length of this wall line at the first-floor slab. A full-height removal with no header is NOT assumed and must not be inferred from the joinery: it would have to be separately verified, structurally and architecturally, before it could be drawn. The whole stair support system still requires structural design and verification.',
 tv:layout.tv,
 oldSlopedStorageFootprint:layout.oldSlopedStorageFootprint,
 wash:layout.wash,
 stair:layout.stair,
 structure:layout.structure,
 bedroomWallFace:layout.bedroomWallFace,
 wardrobe:{existing:[5.3,2.6,5.85,3.35],extension:[4.2,2.5,5.3,3.05],filler:[5.3,2.5,5.85,2.6],depth:.55,height:2.1,finish:'oak',corner:'paired doors with no fixed corner post'},
 headroomBenchmark:2.2,supersededTreadZone:layout.structure.supersededTreadZone,
 sourceHeadroom:'https://lsgkerala.gov.in/system/files/2019-11/kerala-municipality-building-rules-2019.pdf',
};
export function revisedWallBoxes(level,original){
 if(level!=='ground')return original;
 // R8: the spine wall now runs to the grown rear face, so match on its span rather than 9.70.
 return original.flatMap(b=>b[0]===3.05&&b[1]===0&&b[2]===3.15&&b[3]>9.6?[[3.05,0,3.15,2.3],[3.05,6.1,3.15,b[3]]]:[b]);
}
// Two apertures are cut in the 100 mm stair-side partition at x = 2.05-2.15.
//
// R9 gave the basin nook its own 0.90 m archway at y = 5.2-6.10 (the old store-door position,
// without doors), because the starter flight now fills the whole y = 2.3-3.2 band and the old
// route - entering before the TV panel and walking down inside the nook - no longer exists.
//
// R10 cuts the remaining solid span, y = 3.2-5.2, from floor level to +2.10 m and retains the
// wall above it as a plastered header to the 2.85 m slab soffit. R12 holds that condition: the
// opening is sized to the joinery and the open view, not taken out full height. It is a partition,
// never assumed load-bearing, and the stair-side trimmer zone already spans the whole wall line at
// the first-floor slab and carries both the first-floor wall and the header over it. Because the
// aperture is 2.10 m in a 2.85 m wall, wallPieces() leaves the header standing by itself - which
// is the coordinated condition sheet 11 and structural-frame.json are drawn to. Raising this to a
// full-height opening is a separate structural and architectural verification, not a data edit.
export const storageWallOpenings=[
 {x:2.05,y:3.2,w:2.0,t:.10,axis:'v',sill:0,height:layout.tv.wallOpening.height,kind:'joinery',assumed:true,swing:1,hinge:'lo',box:layout.tv.wallOpening.box},
 {x:2.05,y:5.2,w:.9,t:.10,axis:'v',sill:0,height:2.0,kind:'joinery',assumed:true,swing:1,hinge:'lo',box:[2.05,5.2,2.15,6.1]},
];
