import fs from 'fs'
import path from 'path'

type BumpType = 'major' | 'minor' | 'patch'

const type: BumpType = (process.argv[2] as BumpType) || 'patch'

const pkgPath = path.resolve(__dirname, '../package.json')
const pkgRaw = fs.readFileSync(pkgPath, 'utf-8')
const pkg = JSON.parse(pkgRaw) as { version: string }

function bumpVersion(version: string, type: BumpType): string {
  const [major, minor, patch] = version.split('.').map(Number)
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
  }
}

pkg.version = bumpVersion(pkg.version, type)

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

console.log(`Bumped version to ${pkg.version}`)
