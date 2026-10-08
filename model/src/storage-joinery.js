import layout from './storage-layout.json' with {type:'json'};
import {Group} from 'three';

// All dimensions are metres. Cabinets keep the R17 footprints; lofts stop below beams.
export function addStorageJoinery({parent,level,z,box,materials}){
 const groups=[];
 for(const unit of layout.units.filter(u=>u.level===level)){
  const g=new Group();g.name=unit.label;parent.add(g);groups.push(g);
  const main=unit.mainHeight??layout.mainHeight,p=layout.panel;
  const put=(b,lo,hi,m,name)=>{const o=box(g,...b,z+lo,z+hi,m);if(o)o.name=name;return o;};
  const corner=unit.id==='bedroom3';
  if(corner){
   // One continuous right-angle carcass. No solid filler or shared internal end wall.
   const [front,side]=unit.segments;
   const [x0,y0,xj,yf]=front.box,[,,,y1]=side.box,x1=side.box[2];
   const footprint=[[x0,y0,x1,yf],[xj,yf,x1,y1]];
   for(const b of footprint){
    put(b,layout.plinth,layout.plinth+p,materials.oak,'base shelf');
    for(const h of [main-p,layout.loftTop-p])put(b,h,h+p,materials.oak,'top / loft shelf');
   }
   for(const b of [[x0,y0,x0+p,yf],[x0,y0,x1,y0+p],[x1-p,y0,x1,y1],[xj,y1-p,x1,y1]])
    put(b,layout.plinth,layout.loftTop,materials.ivory,'continuous L perimeter panel');
   for(const h of [.7,1.2,1.75])put([xj,y0+p,x1-p,y1-p],h,h+p,materials.oak,'accessible corner shelf');
  }
  for(const s of unit.segments){
   const [x0,y0,x1,y1]=s.box,alongX=s.face.startsWith('y'),positive=s.face.endsWith('1'),a0=s.doorRange?.[0]??(alongX?x0:y0),a1=s.doorRange?.[1]??(alongX?x1:y1);
   const span=a1-a0;
   // Panel-lined carcass, not a solid box; main shelves and loft cavity remain real voids.
   if(!corner){
   put([x0,y0,x1,y1],layout.plinth,layout.plinth+p,materials.oak,'base shelf');
   for(const h of [main-p,layout.loftTop-p])put([x0,y0,x1,y1],h,h+p,materials.oak,'top / loft shelf');
   if(alongX){
    put([x0,y0,x0+p,y1],layout.plinth,layout.loftTop,materials.ivory,'end panel');
    put([x1-p,y0,x1,y1],layout.plinth,layout.loftTop,materials.ivory,'end panel');
    put([x0,y0,x1,y0+p],layout.plinth,layout.loftTop,materials.ivory,'back panel');
   }else{
    put([x0,y0,x1,y0+p],layout.plinth,layout.loftTop,materials.ivory,'end panel');
    put([x0,y1-p,x1,y1],layout.plinth,layout.loftTop,materials.ivory,'end panel');
    put(positive?[x0,y0,x0+p,y1]:[x1-p,y0,x1,y1],layout.plinth,layout.loftTop,materials.ivory,'back panel');
   }
   }
   const module=span/s.modules;
   for(let bay=0;bay<s.modules;bay++){
    const left=a0+module*bay,right=left+module;
    if(bay){const b=alongX?[left-p/2,y0,x0+span*(bay/s.modules)+p/2,y1]:[x0,left-p/2,x1,left+p/2];put(b,layout.plinth,layout.loftTop,materials.oak,'internal partition');}
    // Two narrow leaves per bay reduce swing into the 625 mm bedside aisle.
    for(let leaf=0;leaf<2;leaf++){
     const a=left+leaf*module/2+.002,b=left+(leaf+1)*module/2-.002;
     const front=alongX?[a,y1-p,b,y1]:positive?[x1-p,a,x1,b]:[x0,a,x0+p,b];
     put(front,layout.plinth+.003,main-.003,bay===s.oakModule?materials.oak:materials.ivory,'main door');
     put(front,main+.003,layout.loftTop-.003,materials.ivory,'loft door');
     const handleAt=leaf===0?b-.012:a+.012;
     const pull=alongX?[handleAt-.004,y1-.004,handleAt+.004,y1+.0001]:positive?[x1-.004,handleAt-.004,x1+.0001,handleAt+.004]:[x0-.0001,handleAt-.004,x0+.004,handleAt+.004];
     put(pull,.95,1.14,materials.noir,'recessed main pull');
     put(pull,2.16,2.22,materials.noir,'recessed loft pull');
    }
    const shelfBox=alongX?[left+p,y0+p,right-p,y1-p]:[x0+p,left+p,x1-p,right-p];
    if(unit.id==='linen'){
     if(bay===0)for(const h of [.45,.85,1.25,1.65])put(shelfBox,h,h+p,materials.oak,'linen shelf');
     else put(shelfBox,1.75,1.75+p,materials.oak,'household tall bay top shelf');
    }else{
     for(const h of bay===0?[.45,.7,.95,1.2,1.65]:[1.75])put(shelfBox,h,h+p,materials.oak,'adjustable shelf');
    }
   }
   const plinth=alongX?[x0+.035,y0+.025,x1-.035,y1-.04]:[x0+.04,y0+.035,x1-.025,y1-.035];
   put(plinth,0,layout.plinth,materials.noir,'recessed plinth');

  }
 }
 return groups;
}

export function addStorageBed({parent,b,z,box,materials}){
 const [x0,y0,x1,y1]=b,p=layout.beds.panel,lo=layout.beds.bottom,hi=layout.beds.top;
 const g=new Group();g.name='Lift-up storage bed base';parent.add(g);
 const put=(b,a,c,name)=>{const m=box(g,...b,z+a,z+c,materials.oak);m.name=name;};
 put(b,lo,lo+p,'base');put(b,hi-p,hi,'closed lift-up lid');
 for(const wall of [[x0,y0,x0+p,y1],[x1-p,y0,x1,y1],[x0,y0,x1,y0+p],[x0,y1-p,x1,y1]])put(wall,lo+p,hi-p,'side panel');
 return g;
}
