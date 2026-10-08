import layout from './under-stair-layout.json' with {type:'json'};
import storage from './storage-layout.json' with {type:'json'};
const northWardrobe=storage.units.find(u=>u.id==='bedroom3');
export const revision={
 id:'R18',status:"R18 adds 400 mm wardrobe lofts, ivory fronts with oak accents, narrow paired doors, lift-up storage bed bases and shared study linen storage. The study/stair partition is removed below the retained beam; the family/tailoring room gains 0.4425 m2 of clear floor area and retains three sewing stations, with a 750 x 450 mm cabinet at its side. Bedroom storage footprints are retained. The 2500 mm cabinet tops clear the indicative 2550 mm beam soffit; the space above remains open, with no cosmetic ceiling band. Bedroom 3 uses a continuous 90-degree L carcass and paired corner access, with no solid filler. R17 aligns the 150 mm finished wall faces on both floors, including the rear pier caps. The central wall follows x = 3.10-3.25 throughout; bedroom and bathroom front walls share y = 6.10-6.25. The upstairs passage stays 900 mm, stairs and under-stair joinery/basin stay fixed. Southwest bedrooms are 2.950 x 3.300 m; Bedroom 3 is 2.580 x 3.575 m. All ensuites are rebalanced to 1.215 x 2.100 m with 900 mm shower depth and a maximum installed WC projection of 550 mm, leaving 665 mm in front. Bedroom 3 has a surface-sliding ensuite door. Beds and wardrobes are coordinated to the clearances. Gross footprint and directional room placement are retained. The conceptual frame and final fixture/cistern/tile installations still require professional coordination.",
 demolitionStatus:'Conditional: the affected partitions must be confirmed non-load-bearing; retain or engineer support for the first-floor walls above. The intermediate landing is carried on a landing beam zone inside the bedroom cross-wall line, so the 150 mm finished stair-side partition is not assumed to support it. R9 moved the first-floor stairwell trimmer from y = 3.45 to y = 4.2 m. R10 cuts that same 150 mm finished stair-side partition away below +2.10 m between y = 3.20 and y = 5.20 and retains it above as a plastered header to the 2.85 m slab soffit, and R12 holds that headed condition unchanged. The header is 0.75 m deep over a 2.00 m span and is hung off the stair-side trimmer zone, which already runs the full length of this wall line at the first-floor slab. A full-height removal with no header is NOT assumed and must not be inferred from the joinery: it would have to be separately verified, structurally and architecturally, before it could be drawn. The whole stair support system still requires structural design and verification.',
 tv:layout.tv,
 oldSlopedStorageFootprint:layout.oldSlopedStorageFootprint,
 wash:layout.wash,
 stair:layout.stair,
 structure:layout.structure,
 bedroomWallFace:layout.bedroomWallFace,
 wardrobe:{existing:northWardrobe.segments[1].box,extension:northWardrobe.segments[0].box,filler:northWardrobe.corner,depth:.55,height:storage.mainHeight,loftHeight:storage.loftTop-storage.mainHeight,finish:storage.finish,corner:'paired doors with no fixed corner post'},
 headroomBenchmark:2.2,supersededTreadZone:layout.structure.supersededTreadZone,
 sourceHeadroom:'https://lsgkerala.gov.in/system/files/2019-11/kerala-municipality-building-rules-2019.pdf',
};
export function revisedWallBoxes(level,original){
 if(level!=='ground')return original;
 // R8: the spine wall now runs to the grown rear face, so match on its span rather than 9.70.
 return original.flatMap(b=>b[0]===3.05&&b[1]===0&&b[2]===3.15&&b[3]>9.6?[[3.05,0,3.15,2.3],[3.05,6.1,3.15,b[3]]]:[b]);
}
// Two apertures are cut in the 150 mm finished stair-side partition at x = 2.05-2.20.
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
 {x:2.05,y:3.2,w:2.0,t:.15,axis:'v',sill:0,height:layout.tv.wallOpening.height,kind:'joinery',assumed:true,swing:1,hinge:'lo',box:layout.tv.wallOpening.box},
 {x:2.05,y:5.2,w:.9,t:.15,axis:'v',sill:0,height:2.0,kind:'joinery',assumed:true,swing:1,hinge:'lo',box:[2.05,5.2,2.2,6.1]},
];
