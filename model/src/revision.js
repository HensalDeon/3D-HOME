import layout from './under-stair-layout.json' with {type:'json'};
export const revision={
 id:'R15',status:"R15 moves the washbasin out of the corner against the bedroom (west) wall and into the same band as the R14 TV joinery, continuing that run past its end bay to the wall. The vanity is 0.62 x 0.35 m at x = 0.69-1.04, y = 5.48-6.10, on the same 0.35 m depth and the same face plane (x = 1.04) as the TV cabinet, and it faces the same way - east across the stairwell, out through the retained 0.90 m archway - so you walk in and the basin is square in front of you instead of 90 degrees to your right. The TV unit's own 30 mm oak backing runs on behind it to the wall, carrying the unchanged 0.40 x 0.80 m backlit mirror at z = 1.00-1.80, and a full-height oak fin at y = 5.45-5.48 closes the joinery run and screens it from basin splash. The under-stair volume now reads as one continuous 2.90 m fitted composition at a single depth rather than a 2.25 m run plus a separate corner fitting. The +0.86 m rim, the 750 x 600 mm standing zone, the archway, the 12R landing over it, the stair and the retained +2.10 m headed opening are all unchanged, and clear height becomes a uniform 1.95 m because the standing zone no longer reaches the landing edge that gave the old position its 1.91 m. The R14 joinery itself does not move. Supply and waste now run behind the backing panel and turn into the y = 6.10 wall at the end of the run - TO BE COORDINATED WITH THE PLUMBING DESIGN. The corner the basin vacates, x = 1.25-2.05 and y = 5.15-6.10 against the already-panelled wall, is left clear for the enclosed storage this design has lacked since R9 deleted the under-stair store.",
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
