import type { PageCollectionItemBase, DataCollectionItemBase } from '@nuxt/content'

declare module '@nuxt/content' {
   interface BlogCollectionItem extends PageCollectionItemBase {
    title: string
    description?: string
    date: string
    tags?: string[]
    draft?: boolean
    layout?: string
  }
  

  interface PageCollections {
    blog: BlogCollectionItem
  }

  interface Collections {
    blog: BlogCollectionItem
  }
}
