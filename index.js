const pretty = require('prettysize')
const sqlite3 = require('better-sqlite3')
const path = require('path')
const chalk = require('chalk')

const render = (size, threshold) => {
  if (size >= threshold) {
    return chalk.red(pretty(size))
  } else if (size > threshold / 2) {
    return chalk.yellow(pretty(size))
  } else {
    return pretty(size)
  }
}

const check = (mbtilesPath) => {
  const db = sqlite3(mbtilesPath, { readonly: true })
  for (let z = 6; z <= 15; z++) {
    const r = db.prepare(`
SELECT max(length(tile_data)) AS max, avg(length(tile_data)) AS avg
FROM tiles WHERE zoom_level=${z}`).get()
    console.log(`${path.basename(mbtilesPath)} ${z}: max ${render(r.max, 256 * 1024)} avg ${render(r.avg, 50 * 1024)}`)
  }
  db.close()
}

const checkWhole = (mbtilesPath) => {
  const db = sqlite3(mbtilesPath, { readonly: true })
  const r = db.prepare(`
SELECT max(length(tile_data)) AS max, avg(length(tile_data)) AS avg
FROM tiles`).get()
    console.log(`${path.basename(mbtilesPath)}: max ${render(r.max, 256 * 1024)} avg ${render(r.avg, 50 * 1024)}`)
  db.close()
}

const main = async (mbtilesPaths) => {
  for (const mbtilesPath of mbtilesPaths) {
    await checkWhole(mbtilesPath)
  }
}

main(process.argv.slice(2, process.argv.length))
