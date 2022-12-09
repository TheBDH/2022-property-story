const fs = require("node:fs");
const cheerio = require("cheerio");

/** @type {(config: import('@11ty/eleventy/src/UserConfig')) => void} */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("maps/roads.svg");
  eleventyConfig.addPassthroughCopy("*.css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("jquery-3.6.1.min.js");
  eleventyConfig.addPassthroughCopy({
    "node_modules/colorjs.io/dist/color.js": "js/color.js",
  });
  eleventyConfig.addShortcode("include_map", (name) => {
    const source = fs.readFileSync(`./assets/maps/${name}.svg`, "utf8");
    const $ = cheerio.load(source);
    if ($("svg").children().length > 1) {
      return $("svg").html();
    }
    return `<g id="map-${name}-raw">${$("svg")
      .children()
      .toArray()
      .map((c) => $(c).html())
      .join("")}</g>`;
  });
  eleventyConfig.addShortcode("separator", (name) => {
    return fs.readFileSync(`./assets/separators/${name}.svg`, "utf8");
  });
};
