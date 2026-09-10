"""Generate one interior candidate per job into qa/corrections/, from the current source cameras."""
from pathlib import Path
import base64, json, mimetypes, os, re, sys, time, urllib.error, urllib.request

SRC = Path(__file__).resolve().parent
MODEL = os.environ.get('IMAGE_MODEL', 'gemini-3-pro-image')
KEY = os.environ['GEMINI_API_KEY']
URL = f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}'
OUT = SRC / 'qa/corrections'
OUT.mkdir(parents=True, exist_ok=True)


def part(path):
    p = Path(path)
    return {'inline_data': {'mime_type': mimetypes.guess_type(p.name)[0] or 'image/png',
                            'data': base64.b64encode(p.read_bytes()).decode()}}


def call(body, tries=8):
    # The free tier limits requests per minute and answers 429 with a retryDelay.
    for attempt in range(tries):
        req = urllib.request.Request(URL, json.dumps(body).encode(), {'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == tries - 1:
                raise SystemExit(f'HTTP {e.code}: ' + e.read().decode()[:400])
            m = re.search(r'"retryDelay":\s*"(\d+)s"', e.read().decode())
            wait = int(m.group(1)) + 5 if m else 30
            print(f'  rate limited, waiting {wait}s', flush=True)
            time.sleep(wait)


def run(job):
    body = {'contents': [{'role': 'user', 'parts': [part(r) for r in job['refs']] + [{'text': job['prompt']}]}]}
    data = call(body)
    cands = data.get('candidates') or []
    if not cands:
        raise SystemExit(job['id'] + ': no candidate - ' + json.dumps(data)[:600])
    images = [p['inlineData']['data'] for p in cands[0]['content']['parts'] if 'inlineData' in p]
    if not images:
        text = ' '.join(p.get('text', '') for p in cands[0]['content']['parts'])
        raise SystemExit(job['id'] + ': no image returned - ' + text[:600])
    dest = OUT / (job['id'] + '.png')
    dest.write_bytes(base64.b64decode(images[0]))
    print(dest)


jobs = json.loads(Path(sys.argv[1]).read_text())
only = sys.argv[2:]
for job in jobs:
    if not only or job['id'] in only:
        run(job)
