import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin that upgrades `http://` image URLs to `https://`.
 *
 * This prevents Mixed Content blocking in browsers when a post contains
 * `http://` image links.  Applied at the mdast level so it is transparent
 * to post authors and requires no changes to existing posts.
 */
export function remarkUpgradeHttpImages() {
  return function (tree: Root) {
    visit(tree, 'image', (node) => {
      if (node.url.startsWith('http://')) {
        node.url = 'https://' + node.url.slice(7)
      }
    })
  }
}
