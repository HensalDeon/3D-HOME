import layout from './under-stair-layout.json' with {type:'json'};
export const revision={
 id:'R5',status:'One built-in unit under the upper flight: under-landing store, mirror partition and west-facing basin; TV panel, cabinet and stair fixed',
 demolitionStatus:'Conditional: the affected partitions must be confirmed non-load-bearing; retain or engineer support for the first-floor walls above. The R5 store opening in the stair-side partition needs confirmation that the intermediate landing does not bear on it.',
 tv:layout.tv,
 closingPanel:layout.closingPanel,
 oldSlopedStorageFootprint:layout.oldSlopedStorageFootprint,
 storage:layout.storage,
 store:layout.store,
 partition:layout.partition,
 wash:layout.wash,
 stair:layout.stair,
 bedroomWallFace:layout.bedroomWallFace,
 wardrobe:{existing:[5.3,2.6,5.85,3.35],extension:[4.2,2.5,5.3,3.05],filler:[5.3,2.5,5.85,2.6],depth:.55,height:2.1,finish:'oak',corner:'paired doors with no fixed corner post'},
 headroomBenchmark:2.2,assumedStairThickness:.12,
 sourceHeadroom:'https://lsgkerala.gov.in/system/files/2019-11/kerala-municipality-building-rules-2019.pdf',
};
export function revisedWallBoxes(level,original){
 if(level!=='ground')return original;
 return original.flatMap(b=>b[0]===3.05&&b[1]===0&&b[2]===3.15&&b[3]===9.7?[[3.05,0,3.15,2.3],[3.05,6.1,3.15,9.7]]:[b]);
}
// One open under-upper-flight recess provides basin and cabinet access.
// R5 adds the store-door aperture in the retained stair-side partition beside the bedroom door;
// the wall above the 1.40 m head stays, and the cut is subject to structural confirmation.
export const storageWallOpenings=[
 {x:2.05,y:3.25,w:1.95,t:.10,axis:'v',sill:0,height:2.55,kind:'joinery',assumed:true,swing:1,hinge:'lo',box:[2.05,3.25,2.15,5.20]},
 {x:2.05,y:layout.store.door.box[1],w:layout.store.door.box[3]-layout.store.door.box[1],t:.10,axis:'v',sill:0,height:layout.store.door.height,kind:'joinery',assumed:true,swing:1,hinge:'lo',box:layout.store.door.box,storeDoor:true},
];
