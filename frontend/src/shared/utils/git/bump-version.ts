import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

type BumpType = 'major' | 'minor' | 'patch'

const preRelease = 'alpha'
const type: BumpType = (process.argv[2] as BumpType) || 'patch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pkgPath = path.resolve(__dirname, '../../../../package.json')
const swPath = path.resolve(__dirname, '../../../../public/OneSignalSDKWorker.js')

const pkgRaw = fs.readFileSync(pkgPath, 'utf-8')
const pkg = JSON.parse(pkgRaw) as { version: string }

function parseVersion(version: string) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\w+)\.(\d+)([a-z]*)?)?$/)

  if (!match) throw new Error('Invalid version format')

  const [, major, minor, patch, suffix, number, letters] = match

  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    suffix: suffix || null,
    number: number ? Number(number) : 0,
    letters: letters || '',
  }
}

function randomLetters(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz'

  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }

  return result
}

function bumpVersion(version: string, type: BumpType) {
  const v = parseVersion(version)

  switch (type) {
    case 'major':
      v.major += 1
      v.minor = 0
      v.patch = 0
      break
    case 'minor':
      v.minor += 1
      v.patch = 0
      break
    case 'patch':
      v.patch += 1
      break
  }

  if (v.suffix === preRelease) {
    v.number += 1
  } else {
    v.suffix = preRelease
    v.number = 1
  }

  v.letters = randomLetters(2)

  return `${v.major}.${v.minor}.${v.patch}-${v.suffix}.${v.number}${v.letters}`
}

pkg.version = bumpVersion(pkg.version, type)
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

let swContent = fs.readFileSync(swPath, 'utf-8')

swContent = swContent.replace(/const APP_VERSION = '.*?'/, `const APP_VERSION = '${pkg.version}'`)
fs.writeFileSync(swPath, swContent)

try {
  execSync('git add package.json', { stdio: 'inherit' })

  const commitMsg = `chore: bump version to ${pkg.version}`

  execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' })
  execSync('git push', { stdio: 'inherit' })
} catch (err) {
  console.error('[Git] Error during commit/push:', err)
}
