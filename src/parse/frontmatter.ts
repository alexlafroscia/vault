import { find } from "unist-util-find";
import yaml from "yaml";
import remarkFrontmatter from "remark-frontmatter";

import type { Root, Yaml } from "../mdast.js";

export { remarkFrontmatter };

export type Frontmatter = Record<string, any>;

export function matter(doc: Root): Frontmatter {
    const node = find<Yaml>(doc, { type: "yaml" });

    if (!node) {
        return {};
    }

    return yaml.parse(node.value);
}
