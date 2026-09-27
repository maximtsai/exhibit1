# Dev and testing tools

## Run the game locally

```
node tools/devserver.js
```

Serves the game at http://localhost:8125/ with caching off, and receives screenshots
from capture mode (saved to `tools/snapshots/current/`).

## Jump anywhere: `?debug`

`scripts/debug.js` is loaded in development only (the release build leaves it out).
It does nothing unless the URL has `?debug`.

| URL | What it does |
|---|---|
| `index.html?debug&room=13&phase=horror` | Skip the menu and intro, start in room 13 in the horror phase |
| `&phase=normal` / `dark` / `horror` | Story phase for `room=` |
| `&speed=3` | Run tweens and game timers 3x faster |
| `&nosandbox` | Let saves use the real save slot (by default debug sessions never touch it) |

Rooms: 1 lobby, 2 pump, 3 faucet, 4 clown 1, 5 handy, 6 stretch, 7 clown 2,
8-12 flower corridor, 13 jack, 14 clown 3, 15 exit.

In the browser console, `gameDebug` has `state()`, `goto(room, phase)`,
`exportSave()` / `load(save)` (to return to any state reached by playing),
`advance(ms)`, `setSpeed(k)`, and `errors` / `warnings`.

## Screenshot every room and compare

Captures are deterministic: fixed random seed and fixed 16ms frames, so the same
code produces the same pixels. That makes them a regression test.

1. Open `http://localhost:8125/index.html?debug` and run
   `gameDebug.captureAll("all")` in the console. It screenshots all 15 rooms in all
   3 phases (about 3 minutes; the tab can stay in the background).
2. Move `tools/snapshots/current` to `tools/snapshots/baseline`.
3. Make your change, capture again, then:

```
node tools/compare-snapshots.js
```

Lists which screenshots changed and writes highlighted diffs to
`tools/snapshots/current/_diff/`. Each capture also saves a `.json` fingerprint
(errors, warnings, random-number trace) next to its PNG.

## Sprites live in raw/

All game art is loaded straight from `raw/`:

- **Sprite sheets** are folders, e.g. `raw/roomjack/`. Every PNG in the folder is a
  frame named after the file (`raw/roomjack/doll.png` is frame `doll` of the
  `roomJack` sheet). Which folder feeds which sheet is set in `SPRITE_SHEETS` /
  `DEFERRED_SPRITE_SHEETS` in `scripts/config.js`.
- **Single images** (cursors, lighting overlays, full-screen images, the page
  background and border images, the favicon) are in `raw/standalone/`, loaded by
  the paths in `PRELOAD_IMAGES` / `IMAGES` / `DEFERRED_IMAGES` in `scripts/config.js`.

To change a sprite, edit its PNG (any size) and refresh. To add one, drop the PNG
in the folder and refresh: `tools/devserver.js` regenerates the frame list
(`scripts/spritemanifest.js`) on every page load, and `node build.js` does too.
With another static server, run `node tools/sprite-manifest.js` after adding or
removing files.

## Checking assets

```
node tools/check-assets.js
```

Checks that every file named in `scripts/config.js` exists (with exact letter case,
which Windows doesn't enforce but most web servers do), every sprite sheet folder
has PNGs, and every sprite frame, image and sound named in the code exists.
`node build.js` runs it and stops if anything is missing.

## When assets fail to load

- **Loading screen:** each file is retried 3 times, then "Tap to retry" appears.
  It also retries by itself when the browser comes back online.
- **Background assets** (loaded after the game starts): the same quick retries,
  then stand-ins so the game keeps working: a missing sound is silent, a missing
  image or sprite frame draws as nothing. They're retried again after 5s, 15s,
  30s, 1min and 2min, and immediately when the browser comes back online. Only if
  all of that fails does a small "Some effects didn't load. Retry" notice appear.
  A sheet with a few missing frames keeps them blank until the page is reloaded.
- Code that needs background assets waits with `whenDeferredAssetsReady(cb, onTimeout)`
  (main.js) and gives up after 10 seconds, so nothing in the story waits forever.

To try it: `index.html?debug&room=1&phase=dark&failassets=clown2|clown_horn` makes
matching downloads fail. `gameDebug.setFailAssets(null)` then
`window.dispatchEvent(new Event("online"))` simulates the network coming back.
