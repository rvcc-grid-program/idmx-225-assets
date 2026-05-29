// Eleventy build for the public asset gallery. The GitHub Actions workflow
// (.github/workflows/pages.yml) runs `npx @11ty/eleventy` on every push and
// deploys _site/ to GitHub Pages — so adding a file to assets/ and pushing
// updates the gallery automatically.
export default function (eleventyConfig) {
  // Copy the media through verbatim; Eleventy only renders index.njk.
  eleventyConfig.addPassthroughCopy("assets");

  // Repo docs are not gallery pages.
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("NOTICE.md");

  return {
    dir: { input: ".", output: "_site", data: "_data" },
    // URLs in the gallery are absolute (built from site.baseUrl), so no
    // pathPrefix is needed for them to work on the project Pages subpath.
  };
}
