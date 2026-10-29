module.exports = function(eleventyConfig) {
  // Passthrough file copy
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/public": "/" });

  // Custom filter to check active navigation item
  eleventyConfig.addFilter("isActiveNav", function(currentUrl, navUrl) {
    if (!currentUrl || !navUrl) return false;
    if (navUrl === "/" || navUrl === "/index.html") {
      return currentUrl === "/" || currentUrl === "/index.html";
    }
    return currentUrl.startsWith(navUrl) || currentUrl.replace(".html", "") === navUrl.replace(".html", "");
  });

  // Year filter for copyright
  eleventyConfig.addFilter("currentYear", function() {
    return new Date().getFullYear();
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
