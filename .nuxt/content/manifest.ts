export const checksums = {
  "blog": "v3.5.0--Y13eA45ymAAMsClsMzlepXW0vibNo9wYJ3URwMEeaZs"
}
export const checksumsStructure = {
  "blog": "Y13eA45ymAAMsClsMzlepXW0vibNo9wYJ3URwMEeaZs"
}

export const tables = {
  "blog": "_content_blog",
  "info": "_content_info"
}

export default {
  "blog": {
    "type": "page",
    "fields": {
      "id": "string",
      "title": "string",
      "body": "json",
      "date": "string",
      "description": "string",
      "draft": "boolean",
      "extension": "string",
      "layout": "string",
      "meta": "json",
      "navigation": "json",
      "path": "string",
      "seo": "json",
      "stem": "string",
      "tags": "json"
    }
  },
  "info": {
    "type": "data",
    "fields": {}
  }
}