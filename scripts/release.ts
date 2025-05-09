/**
 * modified from https://github.com/vuejs/vue-next/blob/master/scripts/release.js
 */
import path from 'node:path'
import fs from 'node:fs'
import { execa } from 'execa'
import semver from 'semver'
import pc from 'picocolors'
import enquirer from 'enquirer'
import minimist from 'minimist'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

const args = minimist(process.argv.slice(2))
const name = args._[0]?.trim() || 'nurajs'

const pkg = jsPackage()

/**
 * @type {boolean}
 */
const isDryRun = args.dry
/**
 * @type {boolean}
 */
const skipBuild = args.skipBuild

/**
 * @type {import('semver').ReleaseType[]}
 */
const versionIncrements = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
]

/**
 * @param {import('semver').ReleaseType} i
 */
function inc(i) {
  return semver.inc(pkg.version, i)
}

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {object} opts
 */
async function run(bin, args, opts = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts })
}

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {object} opts
 */
async function dryRun(bin, args, opts = {}) {
  console.info(pc.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
}

/**
 * @param {string} msg
 */
function step(msg) {
  console.info(pc.cyan(msg))
}

/**
 * @param {string} paths
 */
function resolve(paths) {
  return path.resolve(__dirname, `../packages/iles/${paths}`)
}

function jsPackage() {
  const path = resolve('package.json')
  const content = fs.readFileSync(path, 'utf-8')
  return {
    type: 'package',
    path,
    content,
    ...require(path),
    updateVersion(version) {
      const newContent = { ...JSON.parse(content), version }
      fs.writeFileSync(path, `${JSON.stringify(newContent, null, 2)}\n`)
    },
  }
}

async function main() {
  const runIfNotDry = isDryRun ? dryRun : run

  /**
   * @type {{ release: string }}
   */
  const { release } = await enquirer.prompt<{ release: string }>({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements
      .map(i => `${i} (${inc(i)})`)
      .concat(['custom']),
  })

  let targetVersion
  if (release === 'custom') {
    /**
     * @type {{ version: string }}
     */
    const res = await enquirer.prompt<{ version: string }>({
      type: 'input',
      name: 'version',
      message: 'Input custom version',
      initial: pkg.version,
    })
    targetVersion = res.version
  }
  else {
    targetVersion = release.match(/\((.*)\)/)[1]
  }

  if (!semver.valid(targetVersion)) throw new Error(`invalid target version: ${targetVersion}`)

  const tag = name === 'nurajs' ? `v${targetVersion}` : `${name}@${targetVersion}`

  /**
   * @type {{ yes: boolean }}
   */
  const { yes } = await enquirer.prompt<{ yes: boolean }>({
    type: 'confirm',
    name: 'yes',
    message: `Releasing ${tag}. Confirm?`,
  })

  if (!yes) return

  step(`\nUpdating ${pkg.type} version...`)
  pkg.updateVersion(targetVersion)

  step(`\nBuilding ${pkg.type}...`)
  if (!skipBuild && !isDryRun) await run('pnpm', ['nx', 'run', `${pkg.name}:build`], { cwd: path.resolve(__dirname, '..') })
  else console.info('(skipped)')

  step('\nGenerating changelog...')
  await run('pnpm', ['changelog', name])

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: ${tag}`])
  }
  else {
    console.info('No changes to commit.')
  }

  step(`\nPublishing ${pkg.type}...`)
  await publishPackage(targetVersion, runIfNotDry)

  step('\nPushing to GitHub...')
  await runIfNotDry('git', ['tag', tag])
  await runIfNotDry('git', ['push', 'origin', `refs/tags/${tag}`])
  await runIfNotDry('git', ['push'])

  if (isDryRun) console.info(`\nDry run finished - run git diff to see ${pkg.type} changes.`)

  console.info()
}

/**
 * @param {string} version
 * @param {Function} runIfNotDry
 */
async function publishPackage(version, runIfNotDry) {
  try {
    await runIfNotDry('pnpm', ['publish', '--access', 'public'], {
      stdio: 'inherit',
      cwd: resolve('.'),
    })
    console.info(pc.green(`Successfully published ${name}@${version}`))
  }
  catch (e) {
    if (e.stderr.match(/previously published/)) console.info(pc.red(`Skipping already published: ${name}`))
    else throw e
  }
}

main().catch((err) => {
  console.error(err)
})
