import { execSync } from 'child_process'
import process from 'process'

const bumpType = process.argv[2] as 'patch' | 'minor' | 'major'

if (!bumpType) {
  console.error('Usage: git-bump.ts <patch|minor|major>')
  process.exit(1)
}

try {
  execSync('yarn lint:fix', { stdio: 'inherit' })
  execSync(`ts-node src/shared/utils/git/bump-version.ts ${bumpType}`, { stdio: 'inherit' })
  execSync('git add .', { stdio: 'inherit' })

  let commitMsg = ''
  switch (bumpType) {
    case 'patch':
      commitMsg = 'chore: small update [patch]'
      break
    case 'minor':
      commitMsg = 'chore: medium update [minor]'
      break
    case 'major':
      commitMsg = 'chore: major update [major]'
      break
  }

  execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' })
} catch (err) {
  console.error('Error during git-bump:', err)
  process.exit(1)
}
