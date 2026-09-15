"""Render approved Three.js meshes in Cycles. No geometry modifiers or remeshing."""
from pathlib import Path
import bpy, json, math, os, hashlib
from mathutils import Vector

SRC=Path(__file__).resolve().parent
DATA=json.loads((SRC/'render/approved-model.json').read_text())
OUT=SRC/'render'
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def linear(hexcode):
    values=[int(hexcode[i:i+2],16)/255 for i in (0,2,4)]
    return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values)+(1,)

def material(name,color,roughness=.5,metallic=0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=linear(color)
    bs.inputs['Roughness'].default_value=roughness
    bs.inputs['Metallic'].default_value=metallic
    # Normal-only edge highlights; silhouettes, vertices and topology are untouched.
    if name in ['oak','wood','beige','stone']:
        bevel=m.node_tree.nodes.new('ShaderNodeBevel');bevel.samples=2
        bevel.inputs['Radius'].default_value=.001
        m.node_tree.links.new(bevel.outputs['Normal'],bs.inputs['Normal'])
    return m,bs

def texture(m,bs,kind):
    ns=m.node_tree.nodes;ls=m.node_tree.links
    coord=ns.new('ShaderNodeTexCoord')
    mapping=ns.new('ShaderNodeVectorMath');mapping.operation='MULTIPLY'
    mapping.inputs[1].default_value=(22,22,.85) if kind=='oak' else (1,1,1)
    ls.new(coord.outputs['Position'] if 'Position' in coord.outputs else coord.outputs['Object'],mapping.inputs[0])
    noise=ns.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=3 if kind=='oak' else 9
    noise.inputs['Detail'].default_value=3;noise.inputs['Roughness'].default_value=.7
    ls.new(mapping.outputs['Vector'],noise.inputs['Vector'])
    ramp=ns.new('ShaderNodeValToRGB')
    colors={'oak':('9d7751','b9966d'),'stone':('d3cebf','e0dbcd'),'plaster':('e6e4db','eeece5'),'fabric':('cfccb8','dbd8c8')}
    a,b=colors[kind]
    ramp.color_ramp.elements[0].position=.12;ramp.color_ramp.elements[0].color=linear(a)
    ramp.color_ramp.elements[1].position=.88;ramp.color_ramp.elements[1].color=linear(b)
    ls.new(noise.outputs['Fac'],ramp.inputs[0]);ls.new(ramp.outputs[0],bs.inputs['Base Color'])
    fine=ns.new('ShaderNodeTexNoise');fine.inputs['Scale'].default_value=550 if kind!='oak' else 45
    fine.inputs['Detail'].default_value=2
    ls.new(mapping.outputs['Vector'],fine.inputs['Vector'])
    bump=ns.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.12
    bump.inputs['Distance'].default_value=.0003 if kind!='fabric' else .0007
    bevel=next((n for n in ns if n.bl_idname=='ShaderNodeBevel'),None)
    if bevel:ls.new(bevel.outputs['Normal'],bump.inputs['Normal'])
    ls.new(fine.outputs['Fac'],bump.inputs['Height']);ls.new(bump.outputs['Normal'],bs.inputs['Normal'])

def photographed_oak(m,bs):
    ns=m.node_tree.nodes;ls=m.node_tree.links
    coord=ns.new('ShaderNodeTexCoord')
    maps={}
    for channel in ['diff','rough']:
        node=ns.new('ShaderNodeTexImage')
        node.image=bpy.data.images.load(str(SRC/'materials'/f'oak_veneer_01_{channel}_2k.jpg'),check_existing=True)
        if channel=='rough':node.image.colorspace_settings.name='Non-Color'
        ls.new(coord.outputs['UV'],node.inputs['Vector']);maps[channel]=node
    ls.new(maps['diff'].outputs['Color'],bs.inputs['Base Color'])
    rough=ns.new('ShaderNodeMapRange')
    rough.inputs['To Min'].default_value=.28;rough.inputs['To Max'].default_value=.48
    ls.new(maps['rough'].outputs['Color'],rough.inputs['Value']);ls.new(rough.outputs['Result'],bs.inputs['Roughness'])
    bump=ns.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.15;bump.inputs['Distance'].default_value=.00035
    bevel=next((n for n in ns if n.bl_idname=='ShaderNodeBevel'),None)
    if bevel:ls.new(bevel.outputs['Normal'],bump.inputs['Normal'])
    ls.new(maps['rough'].outputs['Color'],bump.inputs['Height']);ls.new(bump.outputs['Normal'],bs.inputs['Normal'])

palette={'wall':('eeeee5',.75,0),'stone':('d7d5c8',.28,0),'concrete':('c5c5bc',.8,0),'dark':('252b28',.32,.35),'wood':('956b49',.4,0),'oak':('b69873',.35,0),'fabric':('d3d4bd',.9,0),'linen':('f8f4e7',.9,0),'beige':('ddd0ba',.4,0),'green':('738e76',.8,0),'tile':('dce8e2',.3,0),'glass':('ffffff',.06,0),'metal':('717b72',.25,.8),'water':('809f98',.08,.1),'white':('f5f3e8',.16,0),'mirror':('f6f6f6',.015,1),'noir':('1e2220',.3,.15),'glow':('f7e3bd',.5,0)}
materials={}
for name,(color,rough,metal) in palette.items():
    m,bs=material(name,color,rough,metal);materials[name]=m
    if name in ['oak','wood']:photographed_oak(m,bs)
    elif name=='stone':texture(m,bs,'stone')
    elif name=='wall':texture(m,bs,'plaster')
    elif name in ['fabric','linen']:texture(m,bs,'fabric')
    elif name=='glass':bs.inputs['Transmission Weight'].default_value=1;bs.inputs['IOR'].default_value=1.45
    elif name=='glow':bs.inputs['Emission Color'].default_value=linear('ffcf91');bs.inputs['Emission Strength'].default_value=6
screen,bs=material('screen glass','101313',.14,.25)
bs.inputs['Coat Weight'].default_value=.35
invisible=bpy.data.materials.new('source invisible picking plane');invisible.use_nodes=True
nodes=invisible.node_tree.nodes;nodes.clear()
transparent=nodes.new('ShaderNodeBsdfTransparent');output=nodes.new('ShaderNodeOutputMaterial')
invisible.node_tree.links.new(transparent.outputs[0],output.inputs['Surface']);materials['invisible']=invisible
materials['obscured'],obscured_bs=material('frosted glazing','e0e5df',.4)
obscured_bs.inputs['Transmission Weight'].default_value=1
materials['concrete']=materials['stone']

max_error=0;shadow_adjustments=[];shelf_shadow_adjustments=[]
for item in DATA['objects']:
    vertices=item['positions'];idx=item['indices']
    mesh=bpy.data.meshes.new(f"approved-{item['id']}")
    mesh.from_pydata(vertices,[],[idx[i:i+3] for i in range(0,len(idx),3)]);mesh.update()
    obj=bpy.data.objects.new(f"{item['id']:03d} {item['name']}",mesh);bpy.context.collection.objects.link(obj)
    obj.hide_render=not item.get('visible',True)
    obj.data.materials.append(materials[item['material']])
    if item['material'] in ['oak','wood']:
        # UV coordinates only: vertical veneer on existing vertical faces.
        uv=mesh.uv_layers.new(name='metre-scaled veneer')
        for face in mesh.polygons:
            axis=max(range(3),key=lambda k:abs(face.normal[k]))
            for loop_id in face.loop_indices:
                v=mesh.vertices[mesh.loops[loop_id].vertex_index].co
                uv.data[loop_id].uv=((v[1] if axis==0 else v[0])/1.8,(v[1] if axis==2 else v[2])/1.8)
    # Smooth shading uses the original normals; neither vertices nor topology change.
    if item['normals']:
        for p in mesh.polygons:p.use_smooth=True
        mesh.normals_split_custom_set_from_vertices(item['normals'])
    bounds=[max(v[k] for v in vertices)-min(v[k] for v in vertices) for k in range(3)]
    # The source uses intersecting concrete primitives. Avoid their coplanar
    # self-shadow artifacts without unioning/remeshing them. Actual stone finishes,
    # walls, landings, railings and joinery keep their normal shadow behavior.
    if item['material']=='concrete':
        obj.visible_shadow=False;shadow_adjustments.append(item['id'])
    # The six shelf boards intersect at their flush ends. Keep their geometry
    # and camera/reflection visibility while avoiding coplanar shadow bands.
    # The main cabinet, backing and diagonal lining retain normal shadows.
    if item['material']=='oak' and 'TV joinery' in item['name'] and abs(bounds[0]-.27)<.00001:
        obj.visible_shadow=False;shelf_shadow_adjustments.append(item['id'])
    if item['material']=='noir' and 'TV joinery' in item['name'] and bounds[1]>.9 and .5<bounds[2]<.6:
        obj.data.materials[0]=screen
    max_error=max(max_error,max(abs(mesh.vertices[i].co[k]-v[k]) for i,v in enumerate(vertices) for k in range(3)))

scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=int(os.environ.get('RENDER_SAMPLES','128'))
scene.cycles.use_denoising=True;scene.cycles.adaptive_threshold=.025
scene.cycles.max_bounces=12;scene.cycles.diffuse_bounces=6;scene.cycles.glossy_bounces=6
scene.cycles.transmission_bounces=8;scene.cycles.sample_clamp_indirect=5
scene.render.resolution_x=int(os.environ.get('RENDER_WIDTH','1800'));scene.render.resolution_y=scene.render.resolution_x*2//3
scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB'
scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast';scene.view_settings.exposure=.6
scene.world.use_nodes=True
scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.78,.85,1,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.35
try:
    prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='METAL';prefs.get_devices()
    for d in prefs.devices:d.use=d.type=='METAL'
    if any(d.type=='METAL' for d in prefs.devices) and not os.environ.get('RENDER_CPU'):scene.cycles.device='GPU'
    print('Render devices:',[(d.name,d.type,d.use) for d in prefs.devices],flush=True)
except Exception as exc:print('CPU rendering:',exc,flush=True)

def area(name,location,target,power,size,color):
    data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;data.color=color
    obj=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(obj);obj.location=location
    obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()
    return obj

# Light sources only. No new architectural fixtures or meshes are added.
area('soft daylight at front opening',(-.6,-5.1,2.4),(-.6,0,1.4),800,2.4,(.89,.94,1))
area('photographic bounce',(2.1,-1.0,3.12),(-1.6,0,1.3),40,2.5,(1,.91,.79))
area('soft ceiling bounce',(.1,-2.8,3.14),(-1.9,.1,1.1),55,2,(1,.94,.85))
sun_data=bpy.data.lights.new('daylight through existing openings','SUN')
sun_data.energy=1.6;sun_data.angle=math.radians(5);sun_data.color=(1,.94,.85)
sun=bpy.data.objects.new('daylight through existing openings',sun_data);bpy.context.collection.objects.link(sun)
sun.rotation_euler=Vector((.4,.85,-.35)).to_track_quat('-Z','Y').to_euler()

cam_data=bpy.data.cameras.new('approved camera');cam=bpy.data.objects.new('approved camera',cam_data);bpy.context.collection.objects.link(cam);scene.camera=cam
cam_data.type='PERSP';cam_data.sensor_fit='VERTICAL';cam_data.sensor_height=24;cam_data.clip_start=.05;cam_data.clip_end=60
def V(v):return Vector((v[0]-3,v[1]-4.85,.45+v[2]))
audit={'method':'Blender Cycles; actual approved mesh vertices and topology','sourceHashes':DATA['sourceHashes'],'meshCount':len(DATA['objects']),'triangles':sum(len(o['indices'])//3 for o in DATA['objects']),'maxVertexImportErrorMetres':max_error,'geometryModifiers':0,'cameras':DATA['cameras'],'blenderVersion':bpy.app.version_string,'samples':scene.cycles.samples,'resolution':[scene.render.resolution_x,scene.render.resolution_y]}
audit['renderOnlyAdjustments']={'invisibleSelectionPlanes':'source opacity zero retained','clonedMaterials':'matched by original color/transparency','normalOnlyBevelMetres':.001,'concreteShadowRaySuppression':shadow_adjustments,'reason':'avoid coplanar self-shadow artifacts without modifying approved meshes'}
audit['renderOnlyAdjustments']['joineryShelfShadowRaySuppression']=shelf_shadow_adjustments
audit['adaptiveNoiseThreshold']=scene.cycles.adaptive_threshold
audit['materials']=json.loads((SRC/'materials/manifest.json').read_text())
audit['rendererSha256']=hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
for entry in audit['materials']:
    assert hashlib.sha256((SRC/'materials'/entry['file']).read_bytes()).hexdigest()==entry['sha256']
fingerprint=hashlib.sha256(json.dumps(audit,sort_keys=True).encode()).hexdigest()
audit['renderFingerprint']=fingerprint
audit['outputs']={}
audit_path=OUT/'render-audit.json'
if audit_path.exists():
    previous=json.loads(audit_path.read_text())
    if previous.get('renderFingerprint')==fingerprint:
        audit['outputs']=previous.get('outputs',{})
assert max_error<.000002,'Geometry conversion tolerance exceeded'
for view in DATA['cameras']:
    if os.environ.get('RENDER_ONLY') and view['file']!=os.environ['RENDER_ONLY']:continue
    path=OUT/view['file']
    if path.exists() and hashlib.sha256(path.read_bytes()).hexdigest()==audit['outputs'].get(view['file']):
        print('Reusing verified render',view['file'],flush=True);continue
    cam.location=V(view['eye']);cam.rotation_euler=(V(view['at'])-cam.location).to_track_quat('-Z','Y').to_euler()
    cam_data.lens=12/math.tan(math.radians(view['fov'])/2)
    scene.render.filepath=str(OUT/view['file'])
    print('Rendering',view['file'],flush=True);bpy.ops.render.render(write_still=True)
    audit['outputs'][view['file']]=hashlib.sha256(path.read_bytes()).hexdigest()
    temporary=OUT/'render-audit.tmp.json';temporary.write_text(json.dumps(audit,indent=2)+'\n');temporary.replace(audit_path)
print('Geometry audit:',max_error,'metres maximum import error;',len(DATA['objects']),'meshes preserved.',flush=True)
