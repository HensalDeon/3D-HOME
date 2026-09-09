import * as THREE from 'three';
// Reference-specific open ribbons, in front-elevation metres (x, height).
// The opening and termination topology follows front-original.jpeg, not the old rounded rectangle.
export const facadeProfiles={
 first:{width:.145,depth:.08,start:[.39,4.98],segments:[
  ['L',.39,5.73],['C',.39,6.02,.58,6.20,.94,6.20],
  ['L',5.02,6.20],['C',5.49,6.20,5.78,5.98,5.78,5.54],
  ['L',5.78,4.31],['C',5.78,3.88,5.49,3.65,5.04,3.65],
  ['L',3.64,3.65],['C',3.29,3.65,3.14,3.83,3.14,4.12],['L',3.14,4.48]
 ]},
 ground:{width:.145,depth:.08,start:[3.15,.535],segments:[
  ['L',.72,.535],['C',.34,.535,.16,.735,.16,1.095],
  ['L',.16,2.55],['C',.16,2.96,.39,3.15,.81,3.15],
  ['L',5.10,3.15],['C',5.57,3.15,5.80,2.95,5.80,2.51],
  ['L',5.80,1.17],['C',5.80,.76,5.58,.535,5.22,.535]
 ]}
};
export function profilePoints(level){
 const p=facadeProfiles[level],path=new THREE.CurvePath();let last=new THREE.Vector2(...p.start);
 for(const s of p.segments){if(s[0]==='L'){const to=new THREE.Vector2(s[1],s[2]);path.add(new THREE.LineCurve(last,to));last=to;}else{const to=new THREE.Vector2(s[5],s[6]);path.add(new THREE.CubicBezierCurve(last,new THREE.Vector2(s[1],s[2]),new THREE.Vector2(s[3],s[4]),to));last=to;}}
 return path.getSpacedPoints(240);
}
export function facadeBand(level,material){
 const p=facadeProfiles[level],pts=profilePoints(level),left=[],right=[];
 for(let i=0;i<pts.length;i++){
  const tangent=pts[Math.min(i+1,pts.length-1)].clone().sub(pts[Math.max(i-1,0)]).normalize(),normal=new THREE.Vector2(-tangent.y,tangent.x).multiplyScalar(p.width/2);
  left.push(pts[i].clone().add(normal));right.push(pts[i].clone().sub(normal));
 }
 const shape=new THREE.Shape([...left,...right.reverse()]);shape.closePath();
 const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:p.depth,bevelEnabled:false,curveSegments:32}),material);
 mesh.position.set(-3,0,4.85);mesh.castShadow=true;mesh.receiveShadow=true;mesh.name=`${level}-reference-charcoal-band`;mesh.userData.profile=p;return mesh;
}
