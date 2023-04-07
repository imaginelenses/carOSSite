const sass = require('sass')
const path = require('path')
const Image = require('@11ty/eleventy-img')

module.exports = (config) => {
    
    config.setBrowserSyncConfig({
        files: './public/css'
    })

    // Favicon
    config.addPassthroughCopy('./src/assets/favicon.ico')
    
    // CNAME
    config.addPassthroughCopy('./src/CNAME')

    // Scripts
    config.addPassthroughCopy('./src/js')
    config.addWatchTarget('./src/js')

    // SASS -> CSS
    config.addWatchTarget('./src/sass')
    config.addShortcode('sass', (src) => {
        let result = sass.compile(src, {style: "compressed"})
        return `<style>${result.css}</style>`
    })

    // Images
    config.addShortcode('image', 
    async (dir, file, cls="", sizes="100vw", index="", statsOnly=false, lazy=true) => {
        let src = dir + file

        let extension = path.extname(src)
        let name = path.basename(src, extension)
        
        let metadata = await Image(src, {
            statsOnly,
            widths: [1000, 1500, 2000],
            formats: ['webp', 'jpeg'],
            urlPath: '/media/',
            outputDir: './public/media/',
            filenameFormat: (id, src, width, format, options) => {
                return `${name}-${width}w.${format}`
            }
        })
        
        let lowSrc = metadata.jpeg[0]
        let highSrc = metadata.jpeg[metadata.jpeg.length - 1]

        let alt = name.replaceAll('-', ' ')

        return (
        '<picture>' +
          `${Object.values(metadata).map(imageFormat => (
            `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(', ')}" sizes="${sizes}">`
          )).join('')}` +
          `<img src="${lowSrc.url}" width="${highSrc.width}" height="${highSrc.height}" alt="${alt}" class="${cls}" data-index="${index}" ${(lazy) ? 'loading="lazy" decoding="async"' : ''}>` +
        '</picture>')
    })

    // Date
    config.addShortcode('year', () => `${new Date().getFullYear()}`)

    return {
        dir: {
            input: 'src',
            output: 'public'
        },
        templateFormats: ['html', 'md', 'njk'],
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
    }
}