/**
	react-native can't import files dynamically through generated names 
	than it needs a map of all files in format { 001_003: require('files/001_003.mp3') }

	this node module reads files in /content and writes map of them to /src/assets
 */

const fs = require('fs')
const path = require('path')

const isFile = path => fs.statSync(path).isFile()
const isDirectory = path => fs.statSync(path).isDirectory()

const getSubDirsOfDir = (dir) => fs.readdirSync(dir).filter(elem => isDirectory(path.join(dir, elem)))

const getFileMapOfDir = (dir) => fs.readdirSync(dir)
    .filter(elem => isFile(path.join(dir, elem)))
    .reduce((prev, elem) => {
        const fileId = elem.replace(/\.[^.]+$/, '')
        const filePath = path.join('../../', dir, elem)
        return {...prev, [fileId]: `require("${filePath}")` }
    }, {})

const baseDir = './content'

// types of files, like: /audio, /images, etc. 
const mediaTypes = getSubDirsOfDir(baseDir)

// subchapters (semantic types of files, like: /words, /phrases, etc. )
// console.log('mediaTypes', mediaTypes)

const mediaMaps = []

mediaTypes.forEach(mediaType => {
    const subchapters = getSubDirsOfDir(path.join(baseDir, mediaType))
    subchapters.forEach(subchapter => {
        const mapFiles = getFileMapOfDir(path.join(path.join(baseDir, mediaType, subchapter)))
        mediaMaps.push({ mediaType, subchapter, mapFiles })
    })
})



// console.log('mediaMaps',mediaMaps)

// console.log('subchapters', subchapters)
mediaMaps.forEach(elem => {
    const { mediaType, subchapter } = elem
    const beforeContent = `// autogenerated from /content/${mediaType}/${subchapter} 
// via /src/utils/createMapOfMedia.js
export default `
    fs.mkdirSync(path.join('../../assets', mediaType), { recursive: true })
    const jsString = JSON.stringify(elem.mapFiles, null, "\t").replace(/"(require\(.+\))"/g, '$1').replace(/\\"/g, '"')
    fs.writeFileSync(`${path.join('./assets', mediaType, subchapter)}.js`, beforeContent + jsString, 'utf-8')
})

console.log('maps of media updated')