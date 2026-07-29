# Kong Mile / Personal Desktop Portfolio

Local, dependency-free portfolio built around a desktop computer, sticky-note board, and editable retro file system.

## Interaction

- Wheel forward: Home -> Outside Board -> Pixel Desktop. Wheel backward reverses the path.
- Notes twist while pressed/dragged and settle back down when released.
- Every desktop file/folder can be dragged, edited, or deleted.
- Folders can contain files and nested folders. Nested folder windows include Back.
- Opening a file creates a separate overlapping window. Windows can move, resize, maximize, and close.
- File content supports Markdown: `> summary`, `## heading`, `` `tag` ``, `**bold**`, `*italic*`, lists, and links.
- The tower power button runs CRT-style power-off and power-on transitions.
- All user changes persist in browser `localStorage`.

## Run

Open `index.html`, or serve the folder with `python -m http.server 4173`.

## Verification

- `tests/smoke.cjs`: desktop interaction regression.
- `tests/mobile-smoke.cjs`: mobile viewport regression.

All changes are local; nothing is pushed or deployed.