const sass = require('sass')
const path = require('path')
const Image = require('@11ty/eleventy-img')

module.exports = (config) => {
    
    config.setBrowserSyncConfig({
        files: './public/css'
    })

    // Icons
    config.addPassthroughCopy('./src/icons')
    
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

    // lite-youtube-embed
    config.addPassthroughCopy({
        'node_modules/lite-youtube-embed/src/lite-yt-embed.css': 'css/lite-yt-embed.css',
        'node_modules/lite-youtube-embed/src/lite-yt-embed.js': 'js/lite-yt-embed.js'
    })
    config.addShortcode('youtube', (id, title, res="maxres", cls="") => (
    `<lite-youtube videoid="${id}" style="background-image: url('https://i.ytimg.com/vi/${id}/${res}default.jpg'); max-width: unset !important;" class="${cls}">` +
        `<button type="button" class="lty-playbtn">` +
        `<span class="lyt-visually-hidden">Play Video: ${title}</span>` +
        `</button>` +
    `</lite-youtube>`
    ))

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