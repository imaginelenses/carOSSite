const sass = require('sass')

module.exports = (config) => {
    
    config.setBrowserSyncConfig({
        files: './public/css'
    })

    config.addShortcode('year', () => `${new Date().getFullYear()}`)

    config.addPassthroughCopy('./src/assets')
    
    config.addPassthroughCopy('./src/CNAME')

    config.addPassthroughCopy('./src/js')
    config.addWatchTarget('./src/js')


    // SASS
    config.addWatchTarget('./src/sass')
    config.addShortcode('sass', (src) => {
        let result = sass.compile(src, {style: "compressed"})
        return `<style>${result.css}</style>`
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