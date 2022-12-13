const fs = require("node:fs");
const cheerio = require("cheerio");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt) {
  let metadata = await Image(src, {
    urlPath: "img/",
    widths: ["auto", 257, 257 * 2, 257 * 3],
    formats: ["avif", "webp", "jpeg"],
  });

  let imageAttributes = {
    alt,
    sizes: "(max-width: 450px) 100vw, 257px",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

/** @type {(config: import('@11ty/eleventy/src/UserConfig')) => void} */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("assets/maps/roads.svg");
  eleventyConfig.addPassthroughCopy("*.css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("jquery-3.6.1.min.js");
  eleventyConfig.addPassthroughCopy({
    "node_modules/colorjs.io/dist/color.js": "js/color.js",
  });
  eleventyConfig.addShortcode("include_map", (name) => {
    const source = fs.readFileSync(`./assets/maps/${name}.svg`, "utf8");
    const $ = cheerio.load(source);
    if (
      $("svg").children().length > 1 ||
      $("svg > :first-child")[0].name !== "g"
    ) {
      return `<g id="map-${name}-raw" class="map-content">${$(
        "svg"
      ).html()}</g>`;
    }
    return `<g id="map-${name}-raw" class="map-content">${$("svg")
      .children()
      .toArray()
      .map((c) => $(c).html())
      .join("")}</g>`;
  });
  eleventyConfig.addShortcode("separator", (name) => {
    return fs.readFileSync(`./assets/separators/${name}.svg`, "utf8");
  });
  eleventyConfig.addAsyncShortcode("image", imageShortcode);
};
