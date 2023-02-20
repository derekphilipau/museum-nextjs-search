# mext-elastic-museum-search

Powerful services & frameworks like [Elasticsearch](https://www.elastic.co/) & [Next.js](https://nextjs.org/) make it possible for museums to easily build performant, responsive and accessible faceted searches for their online collections.

## Dataset

All data was collected via the [Brooklyn Museum Open API](https://www.brooklynmuseum.org/opencollection/api/docs).

## Next.js template

Based on https://github.com/shadcn/next-template ([Website](https://template.shadcn.com/), [UI Components](https://ui.shadcn.com/)), 
which is an implementation of [Radix UI](https://www.radix-ui.com/) with [Tailwind](https://tailwindcss.com/) and other helpful utilities.

## Features

* Image Zoom with https://openseadragon.github.io/
* Form handling via https://formspree.io/
* Embedded JSON-LD Schema.org e.g. https://schema.org/VisualArtwork
* Meta & OG meta tags
* lucide-react fonts
* tailwindcss
* next-themes dark/light modes
* @next/font font loading

## Adopt it yourself

It's hoped that all one will need to do is be able to export TMS data to JSON matching the format of the Elasticsearch index.


## Installation & Running

### Environment Variables

Add a local `.env.local` file.  If `ELASTICSEARCH_USE_CLOUD` is "true", the Elastic Cloud vars will be used.
```
ELASTICSEARCH_USE_CLOUD=true
ELASTICSEARCH_CLOUD_ID=elastic-brooklyn-museum:dXMtY2VudlasfdkjfdwLmNsb3VkLmVzLmlvOjQ0MyQ5ZDhiNWQ2NDM0NTA0ODgwadslfjk;ldfksjfdlNmE2M2IwMmaslfkjfdlksj2ZTU5MzZmMg==
ELASTICSEARCH_CLOUD_USERNAME=elastic
ELASTICSEARCH_CLOUD_PASSWORD=aslflsafdkjlkjslakdfj
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PROTOCOL=https
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_CA_FILE=./secrets/http_ca.crt
ELASTICSEARCH_API_KEY=DssaSLfdsFKJidsljfakslfjfLIJEWLiMkJPQzNwSzVmQQ==
```


## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).


### Notes:
try 'embla-carousel-react'
