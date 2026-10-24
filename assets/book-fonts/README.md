# Offline Korean book fonts

These unmodified OpenType fonts are bundled for deterministic server-side PDF
generation without downloading fonts or sending manuscript content to a font
service at render time.

- Family: Noto Serif KR; weights: Regular (400) and Bold (700).
- Font version: `2.003;hotconv 1.1.1;makeotfexe 2.6.0`.
- Copyright embedded in both fonts: © 2017–2024 Adobe (http://www.adobe.com/).
- License: SIL Open Font License 1.1; the complete upstream license is in
  [OFL.txt](./OFL.txt). Keep the license with redistributed copies of these fonts.
- Official upstream repository: https://github.com/notofonts/noto-cjk
- Pinned upstream revision: `f8d157532fbfaeda587e826d4cd5b21a49186f7c`.
- Downloaded on 2026-10-24 from the upstream Korean subset OTF distribution.

## Exact sources and SHA-256 checksums

| Local file | Bytes | SHA-256 |
| --- | ---: | --- |
| `NotoSerifKR-Regular.otf` | 7,669,020 | `5ea012e15cb7eacc1f680aee1703f3b164791b1443ea3e52b65080cca5d179cf` |
| `NotoSerifKR-Bold.otf` | 7,910,236 | `263408609ef416d597718ea91055379867d3e7086fa32f049996995d4e715e55` |
| `OFL.txt` | 4,301 | `6a73f9541c2de74158c0e7cf6b0a58ef774f5a780bf191f2d7ec9cc53efe2bf2` |

- Regular: https://raw.githubusercontent.com/notofonts/noto-cjk/f8d157532fbfaeda587e826d4cd5b21a49186f7c/Serif/SubsetOTF/KR/NotoSerifKR-Regular.otf
- Bold: https://raw.githubusercontent.com/notofonts/noto-cjk/f8d157532fbfaeda587e826d4cd5b21a49186f7c/Serif/SubsetOTF/KR/NotoSerifKR-Bold.otf
- License: https://raw.githubusercontent.com/notofonts/noto-cjk/f8d157532fbfaeda587e826d4cd5b21a49186f7c/Serif/LICENSE

Both files were verified as OpenType font data using `file` and parsed with
`otfinfo -i`, confirming their family, weight, version, and OFL license metadata.
Their Unicode maps include all 11,172 modern Hangul syllables (U+AC00–U+D7A3).
The fonts are original upstream binaries; the project does not modify them.
