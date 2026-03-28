import os

DIR = '.'

rename_map = {
    1540011: 'gyuriha.png',
     965097: 'world_map.png',
     386849: 'ryun_pei.png',
    1593008: 'last_inn.png',
    1717694: 'baiso_mt.png',
     753574: 'bihyung_1.png',
    1119658: 'bihyung_2.png',
    1305849: 'samo_pei.png',
     393832: 'ashwarital.png',
    1769624: 'toll_road.png',
    1650042: 'last_forge.png',
     853238: 'kaygan_1.png',
    1334068: 'kaygan_2.png',
    1884716: 'kaygan_3.png',
     478585: 'kaygan_4.png',
    2017140: 'kiboren.png',
      55874: 'tinahan_1.jpg',
    1176709: 'tinahan_2.png',
    1831546: 'hainsya.png',
    3804446: 'orenol.png',
    234791:  'marunarae.jpg',
    468320:  'recon.png',
}

for filename in os.listdir(DIR):
    filepath = os.path.join(DIR, filename)
    if not os.path.isfile(filepath): continue
    
    size = os.path.getsize(filepath)
    if size in rename_map:
        new_name = rename_map[size]
        new_path = os.path.join(DIR, new_name)
        if filepath != new_path:
            os.rename(filepath, new_path)
            print(f"Renamed {filename} -> {new_name}")
    else:
        # Delete duplicate size files with ' 2'
        if " 2.png" in filename or " 2" in filename:
            os.remove(filepath)
            print(f"Deleted duplicate {filename}")
