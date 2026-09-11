import layout from './under-stair-layout.json' with {type:'json'};
export const revision={
 id:'R6',status:'R5 built-in unit unchanged in plan; the stair is now represented as a conceptual cast-in-situ RCC waist-slab system and the joinery tops are re-checked against the new soffit',
 demolitionStatus:'Conditional: the affected partitions must be confirmed non-load-bearing; retain or engineer support for the first-floor walls above. R6 carries the intermediate landing on a landing beam zone inside the bedroom cross-wall line, so the 100 mm stair-side partition is not assumed to support it, but the store opening and the whole stair support system still require structural design and verification.',
 tv:layout.tv,
 closingPanel:layout.closingPanel,
 oldSlopedStorageFootprint:layout.oldSlopedStorageFootprint,
 storage:layout.storage,
 store:layout.store,
 partition:layout.partition,
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
// One open under-upper-flight recess provides basin and cabinet access.
// R5 adds the store-door aperture in the retained stair-side partition beside the bedroom door;
// the wall above the 1.40 m head stays, and the cut is subject to structural confirmation.
export const storageWallOpenings=[
 // R6: this joinery opening used to start at y = 3.25, 50 mm clear of the stair-entry opening
 // that ends at 3.20, which left a 50 mm x 2.85 m sliver of the partition standing on its own in
 // the stair entry - a modelling leftover, not a wall. The two openings now meet at 3.20.
 {x:2.05,y:3.2,w:2.0,t:.10,axis:'v',sill:0,height:2.55,kind:'joinery',assumed:true,swing:1,hinge:'lo',box:[2.05,3.2,2.15,5.20]},
 {x:2.05,y:layout.store.door.box[1],w:layout.store.door.box[3]-layout.store.door.box[1],t:.10,axis:'v',sill:0,height:layout.store.door.height,kind:'joinery',assumed:true,swing:1,hinge:'lo',box:layout.store.door.box,storeDoor:true},
];
