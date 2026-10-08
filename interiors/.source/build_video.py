"""Build the still-image interior tour without changing any source photograph.

Requires Pillow and imageio-ffmpeg (or FFMPEG_BIN pointing to a full encoder).
All video frames are streamed to FFmpeg; temporary review frames stay outside
the project. The MP4 and its small source/timing manifest are the deliverables.
"""
from pathlib import Path
import argparse
import hashlib
import json
import math
import os
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT, FPS = 1920, 1080, 24
FADE = 18  # 0.75 seconds
PAPER, INK, MUTED, OAK = '#F4F1EA', '#25343B', '#60747C', '#AE916B'
SHOTS = [
    ('01-entrance-wide', 'The entrance', 'WELCOME HOME'),
    ('02-living-wide', 'Living room', 'GROUND FLOOR'),
    ('03-stair-tv-wide', 'Stair & TV corner', 'GROUND FLOOR'),
    ('04-storage-wide', 'Under-stair storage', 'GROUND FLOOR'),
    ('16-dining-wide', 'Dining room', 'GROUND FLOOR'),
    ('06-kitchen-wide', 'Kitchen', 'GROUND FLOOR'),
    ('06-kitchen-detail', 'Kitchen details', 'GROUND FLOOR'),
    ('07-bedroom1-wide', 'Bedroom 1', 'GROUND FLOOR'),
    ('07-bedroom1-opposite', 'Bedroom 1 · fitted storage', 'GROUND FLOOR'),
    ('11-bathroom1-wide', 'Ensuite 1', 'GROUND FLOOR'),
    ('10-passage-wide', 'The upstairs passage', 'FIRST FLOOR'),
    ('10-study-storage', 'Family & tailoring room', 'FIRST FLOOR'),
    ('08-bedroom2-wide', 'The master bedroom', 'FIRST FLOOR'),
    ('08-bedroom2-opposite', 'Master bedroom · fitted storage', 'FIRST FLOOR'),
    ('12-bathroom2-wide', 'Master ensuite', 'FIRST FLOOR'),
    ('09-bedroom3-wide', 'Bedroom 3', 'FIRST FLOOR'),
    ('09-bedroom3-detail', 'Bedroom 3 · corner storage', 'FIRST FLOOR'),
    ('13-bathroom3-wide', 'Ensuite 3', 'FIRST FLOOR'),
    ('17-front-gallery-wide', 'Front gallery', 'FIRST FLOOR'),
    ('14-balcony-wide', 'Front balcony', 'FIRST FLOOR'),
    ('18-rear-gallery-wide', 'Rear drying balcony', 'FIRST FLOOR'),
    ('15-terrace-wide', 'Roof terrace', 'ROOF LEVEL'),
]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--output', type=Path, default=ROOT/'Hensal_Interior_Tour.mp4')
    ap.add_argument('--review-dir', type=Path)
    ap.add_argument('--preview-only', action='store_true')
    args = ap.parse_args()
    review = args.review_dir or Path(tempfile.mkdtemp(prefix='hensal-video-review-'))
    review.mkdir(parents=True, exist_ok=True)
    font_dir = Path('/System/Library/Fonts/Supplemental')
    def font(name, size):
        return ImageFont.truetype(str(font_dir/name), size)
    serif = font('Georgia.ttf', 43)
    sans = font('Arial.ttf', 23)
    brand = font('Arial.ttf', 27)
    large = font('Georgia.ttf', 94)
    title = font('Georgia.ttf', 56)
    note = font('Arial.ttf', 29)
    segments = [{'kind':'intro', 'frames':72}]
    sources = []
    for stem, caption, level in SHOTS:
        path = ROOT/'images'/(stem+'.png')
        with Image.open(path) as photo:
            photo = photo.convert('RGB')
        segments.append({'kind':'photo', 'frames':144, 'photo':photo, 'caption':caption, 'level':level})
        sources.append({'file':'images/'+path.name, 'sha256':digest(path), 'caption':caption, 'level':level})
    segments.append({'kind':'outro', 'frames':54})
    total = sum(s['frames'] for s in segments)-FADE*(len(segments)-1)
    assert total == 120*FPS

    def centred(draw, y, text, face, fill):
        box = draw.textbbox((0,0), text, font=face)
        draw.text(((WIDTH-(box[2]-box[0]))/2,y), text, font=face, fill=fill)

    def render(segment, frame, absolute_frame):
        canvas = Image.new('RGB', (WIDTH,HEIGHT), PAPER)
        draw = ImageDraw.Draw(canvas)
        if segment['kind']!='photo':
            draw.line((WIDTH/2-90,350,WIDTH/2+90,350), fill=OAK, width=3)
            centred(draw,392,'HENSAL',large,INK)
            centred(draw,528,'An interior tour' if segment['kind']=='intro' else 'Welcome home.',title,INK)
            centred(draw,650,'Ground floor · First floor · Roof terrace',note,MUTED)
            centred(draw,1002,'INTERIOR PRESENTATION · OCTOBER 2026',sans,MUTED)
        else:
            photo=segment['photo']
            fraction=frame/max(1,segment['frames']-1)
            smooth=fraction*fraction*(3-2*fraction)
            # Zoom within a fitted image frame. The whole source photograph
            # remains visible at every frame; no cover crop or stretched rooms.
            scale=min(1888/photo.width,936/photo.height)*(.975+.025*smooth)
            size=(round(photo.width*scale),round(photo.height*scale))
            fitted=photo.resize(size,Image.Resampling.LANCZOS)
            drift=math.sin(math.pi*fraction)*4
            x=round((WIDTH-size[0])/2+drift)
            y=round(18+(936-size[1])/2)
            canvas.paste(fitted,(x,y))
            draw.text((64,977),segment['caption'],font=serif,fill=INK)
            draw.text((66,1032),segment['level'],font=sans,fill=MUTED)
            draw.text((1740,1014),'HENSAL',font=brand,fill=INK)
            draw.line((64,1067,1856,1067), fill='#DDD9CF', width=2)
            draw.line((64,1067,64+1792*absolute_frame/(total-1),1067), fill=OAK, width=3)
        return canvas

    # Small visual samples permit inspection without retaining rendered frames
    # or a second video inside the project.
    checks=[]
    for i in [0,1,6,11,12,14,16,22,23]:
        sample=render(segments[i],segments[i]['frames']//2,total//2)
        sample.save(review/f'frame-{i:02}.png')
        checks.append((i,sample.copy()))
    contact=Image.new('RGB',(960,540),PAPER)
    for cell,(i,im) in enumerate(checks):
        im.thumbnail((320,180),Image.Resampling.LANCZOS)
        contact.paste(im,((cell%3)*320,(cell//3)*180))
    contact.save(review/'contact-sheet.png')
    if args.preview_only:
        print('Preview frames:',review,flush=True)
        return

    ffmpeg=os.environ.get('FFMPEG_BIN')
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
    args.output.parent.mkdir(parents=True,exist_ok=True)
    partial=args.output.with_suffix('.partial.mp4')
    command=[ffmpeg,'-hide_banner','-loglevel','warning','-y',
             '-f','rawvideo','-pixel_format','rgb24','-video_size',f'{WIDTH}x{HEIGHT}',
             '-framerate',str(FPS),'-i','pipe:0','-an','-c:v','libx264',
             '-preset','medium','-crf','20','-maxrate','6M','-bufsize','12M',
             '-threads','4','-pix_fmt','yuv420p','-movflags','+faststart',
             '-metadata','title=Hensal · Interior Tour',
             '-metadata','comment=Still-image tour; no generated camera walkthrough.',str(partial)]
    log=review/'encoder.log'
    with log.open('wb') as errors:
        process=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=errors)
        count=0
        def write(im):
            nonlocal count
            process.stdin.write(im.tobytes())
            count+=1
        try:
            previous=segments[0]
            for f in range(previous['frames']-FADE):
                write(render(previous,f,count))
            for i,current in enumerate(segments[1:],1):
                for f in range(FADE):
                    a=render(previous,previous['frames']-FADE+f,count)
                    b=render(current,f,count)
                    write(Image.blend(a,b,f/(FADE-1)))
                end=current['frames'] if i==len(segments)-1 else current['frames']-FADE
                for f in range(FADE,end):
                    write(render(current,f,count))
                previous=current
                print(f'Encoded {i}/{len(segments)-1} · {count/FPS:.1f}s of 120s',flush=True)
            assert count==total
        finally:
            process.stdin.close()
        result=process.wait()
    if result:
        raise RuntimeError(log.read_text())
    partial.replace(args.output)
    timeline=[]
    cursor=0
    for i,s in enumerate(segments):
        timeline.append({'kind':s['kind'],'start_seconds':cursor/FPS,'duration_seconds':s['frames']/FPS,**(sources[i-1] if s['kind']=='photo' else {})})
        cursor+=s['frames']-(FADE if i<len(segments)-1 else 0)
    manifest={'created':'2026-10-08','format':'Landscape still-image house tour',
              'resolution':[WIDTH,HEIGHT],'fps':FPS,'frames':total,'duration_seconds':total/FPS,
              'codec':'H.264','pixel_format':'yuv420p','container':'MP4','audio':'none',
              'transition':'0.75 second cross-dissolve',
              'motion':'Gentle fitted-image zoom and 4 px drift; complete source image remains visible.',
              'source_note':'Uses current canonical photographs, including the corrected square bedroom/ensuite wall corner, user-selected earlier staircase appearance and updated study end. Illustrative presentations; measured plans/model govern architecture.',
              'timeline':timeline,'video':{'file':args.output.name,'sha256':digest(args.output),'bytes':args.output.stat().st_size},
              'rebuild':'python interiors/.source/build_video.py (Pillow, imageio-ffmpeg; macOS fonts)',
              'review':'Encoding complete; final duration, decode and visual checks still pending.'}
    (ROOT/'.source/video-tour.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('Saved:',args.output,flush=True)
    print('Review frames:',review,flush=True)


if __name__=='__main__':
    main()
