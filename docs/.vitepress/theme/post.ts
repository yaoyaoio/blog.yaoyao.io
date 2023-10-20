import {data as posts} from "./posts.data.js";
import type {PostPageFrontmatter} from "./types";
import type {VPHomeFeatures} from "vitepress/theme";



export function usePosts(): PostPageFrontmatter[] {
  return posts;
}

export function useHomePosts():PostPageFrontmatter[] {
  return posts.filter((post) => post.isHome);
}
