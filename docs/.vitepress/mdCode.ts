import MarkdownIt from "markdown-it";


const markdownCodeEnhance: MarkdownIt.PluginSimple = (md) => {
  const defaultRender = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {
    const rawCode = defaultRender!(...args);
    const fullButton = `<div class="fullscreen-code-button"></div>`
    return rawCode
      .replace(/<\/div>$/, `${fullButton}</div>`)
      .replace(/"(language-[^"]*?)"/, '"$1 fullscreen-code-inserted"')
  }
}

export default markdownCodeEnhance;
