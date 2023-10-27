import type {HeadConfig, TransformContext} from "vitepress";


export function handleHeadMeta(context: TransformContext): HeadConfig[] {
  const {pageData} = context;
  const head: HeadConfig[] = [];
  const ogUrl: HeadConfig = ["meta", {property: "og:url", content: addBase(pageData.relativePath.slice(0, -3)) + '.html'}]
  const ogTitle: HeadConfig = ["meta", {property: "og:title", content: pageData.title || context.title}];
  const ogDescription: HeadConfig = ["meta", {property: "og:description", content: pageData.description || context.description}];
  const ogImage: HeadConfig = ["meta", {property: "og:image", content: pageData.frontmatter.image || "https://blog.yaoyao.io/logo2.jpeg"}];
  head.push(ogUrl, ogTitle, ogDescription, ogImage);

  const twitterCard: HeadConfig = ["meta", {name: "twitter:card", content: "summary_large_image"}];
  const twitterTitle: HeadConfig = ["meta", {name: "twitter:title", content: pageData.title || context.title}];
  const twitterImage: HeadConfig = ["meta", {name: "twitter:image", content: pageData.frontmatter.image || "https://blog.yaoyao.io/logo2.jpeg"}];
  const twitterDescription: HeadConfig = ["meta", {name: "twitter:description", content: pageData.description || context.description}];
  head.push(twitterCard, twitterTitle, twitterImage, twitterDescription);

  return head;
}

export function addBase(relativePath: string) {
  const host = 'https://blog.yaoyao.io'
  if (relativePath && relativePath.startsWith('/')) {
    return host + relativePath
  } else {
    return host + '/' + relativePath
  }
}
