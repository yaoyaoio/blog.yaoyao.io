import {data as posts} from "./posts.data.js";
import type {PostPageFrontmatter} from "./types";

export function usePosts(): PostPageFrontmatter[] {
  return posts;
}
