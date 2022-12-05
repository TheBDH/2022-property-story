const fs = require('node:fs');
const cheerio = require('cheerio');

/** @type {(config: import('@11ty/eleventy/src/UserConfig')) => void} */
module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("maps/roads.svg");
    eleventyConfig.addPassthroughCopy("*.css");
    eleventyConfig.addPassthroughCopy("jquery-3.6.1.min.js");
    eleventyConfig.addPassthroughCopy({
        "node_modules/colorjs.io/dist/color.js": "js/color.js",
    });
    eleventyConfig.addShortcode('include_map', (name) => {
        const source = fs.readFileSync(`./maps/${name}.svg`, 'utf8');
        const $ = cheerio.load(source);
        return $('svg').children().toArray().map(c => $(c).html())
    })
}
