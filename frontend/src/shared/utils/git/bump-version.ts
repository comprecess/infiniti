/* eslint-disable no-console */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'

type BumpType = 'major' | 'minor' | 'patch'

const preRelease = 'alpha'
const bumpType: BumpType = (process.argv[2] as BumpType) || 'patch'

if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('Usage: git-bump.ts <patch|minor|major>')
  process.exit(1)
}

// Сначала делаем lint
execSync('yarn lint:fix', { stdio: 'inherit' })

// Пути
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pkgPath = path.resolve(__dirname, '../../../../package.json')
const swPath = path.resolve(__dirname, '../../../../public/OneSignalSDKWorker.js')

// Чтение package.json
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
  if (v.suffix === preRelease) v.number += 1
  else {
    v.suffix = preRelease
    v.number = 1
  }
  v.letters = randomLetters(2)

  return `${v.major}.${v.minor}.${v.patch}-${v.suffix}.${v.number}${v.letters}`
}

// Обновляем версию
pkg.version = bumpVersion(pkg.version, bumpType)
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

// Обновляем SDK Worker
let swContent = fs.readFileSync(swPath, 'utf-8')
swContent = swContent.replace(/const APP_VERSION = '.*?'/, `const APP_VERSION = '${pkg.version}'`)
fs.writeFileSync(swPath, swContent)

console.log(`Version bumped to ${pkg.version}`)
