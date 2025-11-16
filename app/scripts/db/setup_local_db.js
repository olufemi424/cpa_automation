import { promises as fs } from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const execAsync = promisify(exec)

async function copyRecursive(src, dest, prefix = '', fileOrder = []) {
  const files = await fs.readdir(src)
  for (const file of files) {
    const srcFilePath = path.join(src, file)
    const stats = await fs.lstat(srcFilePath)

    if (stats.isDirectory()) {
      // Extract the directory number prefix if it exists (e.g., "01_" from "01_db_creation")
      const dirPrefix = file.match(/^(\d+)_/)
      const newPrefix = dirPrefix ? dirPrefix[1] + '_' : prefix
      await copyRecursive(srcFilePath, dest, newPrefix, fileOrder)
    } else {
      fileOrder.push({
        srcPath: srcFilePath,
        prefix: prefix,
        originalName: file,
      })
    }
  }
  return fileOrder
}

async function copyFiles(rootPath) {
  const tempLocalDbScriptsPath = path.join(
    rootPath,
    'scripts',
    'db',
    'temp_local_db_scripts'
  )
  const folderPath = path.join(rootPath, 'scripts', 'db', 'sql')

  // Create sql directory if it doesn't exist
  try {
    await fs.access(folderPath, fs.constants.F_OK)
  } catch (error) {
    await fs.mkdir(folderPath, { recursive: true })
  }

  // Clean up existing temp directory
  try {
    await fs.rm(tempLocalDbScriptsPath, { recursive: true, force: true })
  } catch (error) {
    console.error('Error cleaning up temp directory:', error)
  }

  // Create fresh temp directory
  await fs.mkdir(tempLocalDbScriptsPath, { recursive: true })

  const fullPath = path.join(rootPath, 'scripts', 'db', 'sql')

  try {
    await fs.access(fullPath, fs.constants.F_OK)
  } catch (error) {
    console.error('Source folder does not exist:', error)
    return
  }

  // Collect all files with their prefixes
  const fileOrder = await copyRecursive(fullPath, tempLocalDbScriptsPath)

  // Sort files based on prefix and name
  fileOrder.sort((a, b) => {
    const prefixA = a.prefix || '0'
    const prefixB = b.prefix || '0'
    return (
      prefixA.localeCompare(prefixB) ||
      a.originalName.localeCompare(b.originalName)
    )
  })

  // Copy files with ordered numbering
  for (let i = 0; i < fileOrder.length; i++) {
    const { srcPath, originalName } = fileOrder[i]
    const paddedIndex = String(i + 1).padStart(2, '0')
    const fileExtension = path.extname(originalName)
    const baseName = path.basename(originalName, fileExtension)

    // Create new filename with ordered numbering
    const newFileName = `${paddedIndex}_${baseName}${fileExtension}`
    const destPath = path.join(tempLocalDbScriptsPath, newFileName)

    await fs.copyFile(srcPath, destPath)
  }

  console.log('✅ SQL files flattened and copied to temp_local_db_scripts/')
  console.log(`Total files: ${fileOrder.length}`)
}

const rootPath = path.join(__dirname, '..', '..')
copyFiles(rootPath).catch(console.error)
