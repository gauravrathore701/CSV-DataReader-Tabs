# CSV DataReader — Tabs

A desktop CSV reader built with ElectronJS that opens multiple files at
once, each in its own tab, so several datasets can be compared in one
window. Everything is read locally.

## Stack

- ElectronJS — `main.js` (main process), `preload.js` (context bridge)
- Vanilla JavaScript + HTML in `renderer/`

## Running it

```bash
npm install
npm start
```

`data.csv` in the repo root is a sample file to try it against.

## Related

Grew out of
[CSV-DataReader-Electron](https://github.com/gauravrathore701/CSV-DataReader-Electron),
which is the single-file version.
