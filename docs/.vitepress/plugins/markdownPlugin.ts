import MarkdownIt from "markdown-it";

export const markdownImagePlugin: MarkdownIt.PluginSimple = (md) => {
  const defaultRender = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    tokens[idx].attrSet("data-src", tokens[idx].attrs![0][1]);
    tokens[idx].attrSet("data-original-src", tokens[idx].attrs![0][1]);
    return defaultRender!(tokens, idx, options, env, self);
  };
};


export const markdownCodeEnhancePlugin: MarkdownIt.PluginSimple = (md) => {
  const defaultRender = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {
    const rawCode = defaultRender!(...args);
    const fullButton = `<div class="fullscreen-code-button"></div>`
    return rawCode
      .replace(/<\/div>$/, `${fullButton}</div>`)
      .replace(/"(language-[^"]*?)"/, '"$1 fullscreen-code-inserted"')
  }
}
