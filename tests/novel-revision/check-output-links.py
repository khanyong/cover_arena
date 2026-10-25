import os,json,zipfile,posixpath,xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote
p=Path(os.environ['ROS_EXEC02_FIXTURE_DIR']);results=[]
for lang in ['EN','KO']:
 with zipfile.ZipFile(p/'output'/(lang+'.epub')) as z:
  assert z.testzip() is None
  documents={name:ET.fromstring(z.read(name)) for name in z.namelist() if name.endswith('.xhtml')}
  ids={name:{n.get('id') for n in root.iter() if n.get('id')} for name,root in documents.items()};links=0
  for name,root in documents.items():
   for node in root.iter():
    href=node.get('href')
    if not href or href.startswith(('http:','https:','mailto:')):continue
    file,sep,anchor=href.partition('#');target=posixpath.normpath(posixpath.join(posixpath.dirname(name),unquote(file))) if file else name
    assert target in z.namelist(),(name,href)
    if sep:assert unquote(anchor) in ids.get(target,set()),(name,href)
    links+=1
  details=sum(sum(x.startswith('equation-detail-') for x in group) for group in ids.values())
  assert details==4,details
  results.append({'language':lang,'valid_internal_links':links,'existing_endnote_targets':details,'crc':'PASS'})
(p/'output-links.json').write_text(json.dumps(results,indent=2));print(json.dumps(results))
