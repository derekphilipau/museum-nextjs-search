# museum-nextjs-search

Powerful platforms like [Elasticsearch](https://www.elastic.co/) & [Next.js](https://nextjs.org/) make it possible for museums to easily build performant, responsive and accessible faceted searches for their online collections.

## Demo

This project has been deployed on Vercel at https://bkm-next-search.vercel.app/

## Overview

A typical approach for building a collections website is to periodically sync data from a backend collections management system (sometimes augmented with data from an internal CMS) into a relational database which is queried by a frontend website.

This project takes a different approach, using Elasticsearch as the primary data store and Next.js as the frontend.  Note that the collections data is read-only, the actual datastore is in the backend system.  Using the last exported files, the Elasticsearch indices can be rebuilt within a handful of minutes, even with collections of 200,000 documents.

TODO: Implement the "Cloud Function Periodic Sync" using AWS Lambda or Google Cloud Functions.  For the time being, Elasticsearch indices are updated manually via command line scripts.

![System Design](./doc/img/CollectionsSystem.png)

### Importing data

This project completely rebuilds the indices each sync, which is a simplistic approach that has some advantages:  it only takes a few minutes for a typical collection of 200,000 documents, indices can easily be completely restored in casae of an issue, and by using Elasticsearch indices there is almost no downtime.

![Loading data into timestamped index with index alias](./doc/img/IndexAliases.png)

## Datasets

### Collections Data

All data was collected via the [Brooklyn Museum Open API](https://www.brooklynmuseum.org/opencollection/api/docs).

### Archives Data

The Archives data was collected using the OAI-PMH harvesting API of Brooklyn Museum's [ArchivesSpace](https://archivesspace.org/) service.

The Dublin Core metadata is limited.  It would be better to use ArchivesSpace's native API to index all the metadata fields like Language, Type, Names, etc.

### Getty Union List of Artist Names (ULAN) Data

ULAN XML was downloaded from [Getty's website](http://ulandownloads.getty.edu/) and converted to JSON using the `transformUlan.ts` script.  When updating the `terms` index, the script attempts to find a matching artist name from this JSON file.  If found, the ULAN artist data is added to the terms index document.


## Elasticsearch

### Elasticsearch DSL

This project uses Elasticsearch [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html) with the Elasticsearch [Javascript Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html) to manage indices and query data.

### Elasticsearch Field Types

Basic Elasticsearch index, field types, analyzers, and filters are defined in `util/elasticsearch/settings.ts`.

### Index Definition

Adjust number_of_shards and number_of_replicas for your use case.

#### Analyzers & Filters

[Mapping Character Filters](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-mapping-charfilter.html):
* `hyphenApostropheMappingFilter` - replaces hyphens with spaces and removes single quotes.
* `articleCharFilter` - UNUSED - replaces common articles (de, van, der, etc.) with spaces.  Originally intended to help with searching names containing many articles.

[Filters](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenfilters.html):
* `enSnowball` - stems words using a [Snowball-generated stemmer](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-snowball-tokenfilter.html) for English language

[Analyzers](https://www.elastic.co/guide/en/elasticsearch/reference/current/analyzer.html):
* `unaggregatedStandardAnalyzer` - For common text fields that are not aggregated.
* `aggregatedKeywordAnalyzer` - For aggregated keyword fields
* `aggregatedSimpleKeywordAnalyzer` - Not filtered, although converted to lowercase.
* `suggestAnalyzer` - For search_as_you_type fields, not currently implemented. TODO.

#### Field definitions

Most definitions are straight-forward.  Some search and suggest fields contain subfields "search" and "suggest" used for those use-cases.

### Elasticsearch Indices

Indices are defined in `/util/elasticsearch/indices.ts`.

### Re-used Object Fields

Some object fields are re-used across multiple indices.  

Constituent:
* `id` - Source-dependent ID of the constituent
* `name` - Name of the constituent, e.g. "Pablo Picasso"
* `dates` - A free-form string representing the dates of a constituent, often the birth & death of an artist, e.g. "ca. 1483–1556"
* `birthYear` - Birth year of the constituent
* `deathYear` - Death year of the constituent
* `nationality` - Array of nationalities of the constituent
* `gender` - Gender.  Note that ULAN seems to only record 'Male', 'Female', and 'N/A'
* `role` - Role of the constituent, e.g. "Artist", "Maker", "Photographer", etc.
* `source` - Source of the constituent, e.g. "Brooklyn Museum", "Getty ULAN"
* `sourceId` - Source-dependent ID of the constituent
* `wikiQid` - Wikidata QID of the constituent
* `ulanId` - ULAN ID of the constituent

Geographical Location:
* `id` - Source-dependent ID of the location
* `name` - Name of the location, e.g. "New York, New York, United States"
* `continent` - Continent of the location, e.g. "North America"
* `country` - Country of the location, e.g. "United States"
* `type` - Type of location, e.g. "City", "State", "Country", etc.

Image:
* `url` - The URL of the image
* `thumbnailUrl` - The URL of the thumbnail
* `alt` - The alt text for the image
* `dominantColorsHsl` - An array of arrays of HSL colors, used for color search
* `histogram` - An array of numbers, used for color search
* `year` - The year of the image
* `view` - The view of the image, e.g. "front", "back", "detail", etc.
* `rank` - The rank of the image, used for sorting

Museum Location:
* `id` - Source-dependent ID of the location
* `name` - Name of the location, e.g. ""
* `isPublic` - Whether the location is public
* `isFloor` - Whether the location is a floor
* `parentId` - The ID of the parent location

#### Base Document

The base document defines common fields for all indices, these are the fields used for cross-index search.  The Elasticsearch Base Document fields are defined in `indices.ts` and the associated Typescript interface is defined in `/types/baseDocument.ts`.

* `type` - The type of document, e.g. "collections", "archives", "terms"
* `source` - The source of the document, e.g. "Brooklyn Museum", "Getty ULAN"
* `url` - The URL of the document
* `id` - The unique ID of the document
* `title` - The title of the document
* `description` - The description of the document
* `searchText` - The text used for full-text search.  This can be configured on a per-index basis to allow global search to include special fields like accession number.
* `keywords` - An array of keywords for the document
* `boostedKeywords` - An array of keywords that should be boosted in search results
* `primaryConstituent` - The primary constituent of the document, e.g. the artist of a painting.
* `image` - Image.  The main image of the document
* `date` - A string representing the date, no strict format.
* `startDate` - A date representing the start date.  Used for date range filtering.
* `endDate` - A date representing the end date.  Used for date range filtering.

#### Collection Document

Includes all Base Document fields as well as:

* `constituents` - Constituent array.  Entities associated with the document, e.g. artists, photographers, organization, etc.
* `images` - Image array.  Images associated with the document.
* `accessionNumber` - The accession number.
* `accessionDate` - Free-form date field for accession date.
* `period` - The period, e.g. "Edo Period", "Middle Kingdom", etc.
* `dynasty` - The dynasty, e.g. "Qing Dynasty", "Mughal", etc.
* `provenance` - Free-text field describing provenance.
* `medium` - The medium, e.g. "Oil on canvas", "Woodblock print", etc.
* `dimensions` - The dimensions, e.g. "Sheet: 14 1/2 x 10 1/4 in. (36.8 x 26 cm)"  TODO: Normalize dimensions into standardized fields.
* `edition` - The edition, e.g. "Edition: 23/50"
* `portfolio` - The portfolio, e.g. "Scenes from the Life of Saint Lawrence"
* `markings` - Markings on object, e.g. "Stamped on back: 'HERTER BRO'S.'"
* `signed` - Signature on object, e.g. "Kunichika ga 国周画"
* `inscribed` - Inscription on object
* `creditLine` - Credit line, e.g. "Dick S. Ramsay Fund"
* `copyright` - Copyright, e.g. "© Park McArthur"
* `classification` - Classification, e.g. "Print", "Sculpture", "Painting", etc.
* `publicAccess` - Boolean, if true is public access.
* `copyrightRestricted` - Boolean, if true images are restricted.
* `highlight` - Boolean whether or not object is highlighted.  TODO: Remove, Brooklyn Museum-specific.
* `section` - Museum-specific gallery section, e.g. "Old Kingdom"
* `museumLocation` - Museum Location. Museum-specific location within museum
* `onView` - Whether or not the object is currently on view.
* `rightsType` - Specifies copyright type, e.g. "Creative Commons-BY"
* `labels` - Array of gallery labels.  TODO: Define type & add to searchText?
* `collections` - An array of collections the object belongs to.
* `exhibitions` - An array of exhibitions the object has been in.  TODO: Assumes exhibitions have unique names.
* `geographicLocations` - Geographical Location array. Geographic locations associated with the object.
* `primaryGeographicalLocation` - Geographical Location. The primary location associated with the object.


#### Content Document

Content documents represent a web page or resource, typically from a museum's website.  The fields are the same as Base Document.

#### Archives Document

Archives documents represent archival collections.  The fields are the same as Base Document with the addition of:

* `accessionNumber` - (`dc:identifier`) The accession number.
* `primaryConstituent` - (`dc:creator`) Primary constituent, often the primary maker, e.g. the artist.
* `subject` - (`dc:subject`) The subject of the archival collection.
* `language` - (`dc:language`) The language of the archival collection, e.g. "en".
* `publisher` - (`dc:publisher`) The publisher of the record, e.g. "Brooklyn Museum Archives"
* `format` - (`dc:format`) e.g. "17.916 Linear Feet; 43 document boxes"
* `rights` - (`dc:rights`) e.g. "Collection is open for research; permission of archivist required..."
* `relation` - (`dc:relation`) e.g. "Office of the Director records, DIR"

#### Terms Document

Terms documents represent terms from a controlled vocabulary.  These are queried for "did you mean?" searches.  The fields are the same as Base Document with the addition of:

* `sourceId`: The ID of the term in the source vocabulary.
* `sourceType`: The type of the term within the source vocabulary.
* `index`: The index the term belongs to, e.g. "collections".
* `field`: The field the term belongs to, e.g. "classification", "primaryConstituent.name"
* `value`: The value of the term, e.g. "Painting", "Pablo Picasso", etc.
* `preferred`: The preferred term, e.g. "Pablo Picasso"
* `alternates`: An array of alternate terms, e.g. ["Picasso, Pablo", "Picasso", etc.]
* `summary`: A summary of the term.  Deprecated, use data fields instead.
* `description`: A description of the term.  Deprecated, use data fields instead.
* `data`: The raw data of the term, e.g. the JSON from the Getty ULAN.

### Elasticsearch Queries

##### Multi-match Search

Text queries are currently searched with multi_match default [`best_fields`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html).  Fields can be weighted to give priority, in this case `boostedKeywords` is very heavily weighted for cases where you want a document to appear first if it contains an important keyword.

```
multi_match: {
    query: q,
    type: 'best_fields',
    operator: 'and',
    fields: [
        'boostedKeywords^20',
        'constituents^4', // TODO
        'title^2',
        'keywords^2',
        'description',
        'searchText',
        'accessionNumber',
    ],
},
```

#### Collection Object Similarity

How one defines object similarity will vary from institution to institution.  There are a number of approaches to querying Elasticsearch for similar documents, notably [`more_like_this`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-mlt-query.html).

This project uses a custom bool query of boosted should terms.  [similarObjects.ts](./util/elasticsearch/search/similarObjects.ts) specifies which fields are used along with a boost value for each.  The primary constituent (e.g. Artist, Maker, etc.) is given the most weight.  These fields can be adjusted based on your institution's concept of object similarity.  The current weights are:

* `primaryConstituent.name` - 4
* `dynasty` - 2
* `period` - 2
* `classification` - 1.5
* `medium` - 1
* `collections` - 1
* `exhibitions` - 1
* `primaryGeographicalLocation.name` - 1

## Next.js template

Based on https://github.com/shadcn/next-template ([Website](https://template.shadcn.com/), [UI Components](https://ui.shadcn.com/)),
which is an implementation of [Radix UI](https://www.radix-ui.com/) with [Tailwind](https://tailwindcss.com/) and other helpful utilities.

## Features

- Full-text search, including accession number
- API Endpoints for search & document retrieval
- Searchable filters
- Linked object properties
- Custom similarity algorithm with combined weighted terms (can be adjusted)
- Histogram similarity using HSV color space.
- Embedded JSON-LD (Schema.org [VisualArtwork](https://schema.org/VisualArtwork)) for better SEO and sharing
- Image Zoom with [Openseadragon](https://openseadragon.github.io/)
- Image carousel with [embla-carousel](https://www.embla-carousel.com/get-started/react/)
- Form handling via [Formspree](https://formspree.io/)
- Meta & OG meta tags
- [lucide-react icons](https://github.com/lucide-icons/lucide)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes) dark/light modes
- [@next/font](https://nextjs.org/docs/api-reference/next/font) font loading

## Adopt it yourself

It's hoped that all one will need to do is be able to export TMS data to JSON matching the format of the Elasticsearch index.

## API Endpoints

### Search API

Searches can be performed against any index. Search requests are of the form:
GET `http://localhost:3000/api/search/[index]?[querystring]`

Querystring parameters are the same as those for the Web UI:
GET `http://localhost:3000/api/search/collections?f=true&.name=George%20Bradford%20Brainerd`

### Document API

Document requests are of the form:
GET `http://localhost:3000/api/[index]/[documentId]`

For example, to get collection object #53453:
GET `http://localhost:3000/api/collections/53453`

## Installation & Running

### Set up Elasticsearch

You can run Elasticsearch in a Docker container, or sign up for an Elasticsearch Cloud account. [For Docker, follow the instructions here.](https://www.elastic.co/guide/en/elasticsearch/reference/8.6/docker.html) [Sign up for an Elasticsearch Cloud account here.](https://cloud.elastic.co/)

### Environment Variables

Once you have a running Elasticsearch service, you can add the connection details to the environment variables.

For local development, add a local `.env.local` file in the root directory. If `ELASTICSEARCH_USE_CLOUD` is "true", the Elastic Cloud vars will be used, otherwise the \_HOST, \_PROTOCOL, \_PORT, \_CA_FILE, and \_API_KEY vars will be used. You may need to copy the http_ca.crt from the Elasticsearch Docker container to a local directory like `./secrets`.

On [Formspree](https://formspree.io/) you should set up a basic contact form and enter the `FORMSPREE_FORM_ID` env variable.

For cloud deployments (for example on Vercel), add the same variables to the Environment Variables of your deployment.

```
DATASET=brooklynMuseum
ELASTICSEARCH_USE_CLOUD=true
ELASTICSEARCH_CLOUD_ID=elastic-museum-test:dXMtY2VudlasfdkjfdwLmNsb3VkLmVzLmlvOjQ0MyQ5ZDhiNWQ2NDM0NTA0ODgwadslfjk;ldfksjfdlNmE2M2IwMmaslfkjfdlksj2ZTU5MzZmMg==
ELASTICSEARCH_CLOUD_USERNAME=elastic
ELASTICSEARCH_CLOUD_PASSWORD=aslflsafdkjlkjslakdfj
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PROTOCOL=https
ELASTICSEARCH_PORT=9200
ELASTICSEARCH_CA_FILE=./secrets/http_ca.crt
ELASTICSEARCH_API_KEY=DssaSLfdsFKJidsljfakslfjfLIJEWLiMkJPQzNwSzVmQQ==
ELASTICSEARCH_BULK_LIMIT=1000
FORMSPREE_FORM_ID=mskbksar
```

### Download & Install

Fork/download this project and run `npm i` to install dependencies.

Then, run the development server with `npm run dev` and open http://localhost:3000 with your browser to see the result.

If you have not yet loaded the Elasticsearch data, you should see an error on the search page that the index does not exist.

### Loading the data

The main data file with collection objects is `./data/BrooklynMuseum/archivesSpaceDCRecords.jsonl.gz`.  `importDataCommand.ts` will load compressed data from .jsonl.gz files in the `data/BrooklynMuseum/` directory into Elasticsearch indices. **_Warning: This will erase Elasticsearch indices._**

From the command line, run:

```
npx ts-node --compiler-options {\"module\":\"CommonJS\"} ./util/data/import/importDataCommand.ts
```

This command will:
1. Load environment variables from `.env.local`
2. Ask if you want to proceed with the import
3. Ask if you want to import the collections index (all records)
4. Ask if you want to import the content index (all records)
5. Ask if you want to import the archives index (all records)
6. Ask if you want to update the terms index.  Queries collections index for collections, classifications, and primaryConstituent fields, then adds unique values to the terms index.
7. Ask if you want to update the ULAN terms index.  Queries collections index for all unique primaryConstituent values, then searches ULAN data files for each name.  If a match is found, ULAN data is added to the term.

```
Loaded env from /Users/aud/Projects/bkm/museum-nextjs-search/.env.local
Import Elasticsearch data from JSON files.
WARNING: Using Elasticsearch Cloud
Proceeding will overwrite existing Elasticsearch indices & data. Continue? (y/n) y
Beginning import of Elasticsearch data from JSON files...
Import collections index from ./data/brooklynMuseum/collections.jsonl.gz? (y/n) n
Import content index from ./data/brooklynMuseum/content.jsonl.gz? (y/n) n
Import archives index from ./data/brooklynMuseum/archivesSpaceDCRecords.jsonl.gz? (y/n) n
Update terms? (y/n) n
Update ULAN terms? (y/n) y
```

The import process will take some time, as it inserts 1000 documents at a time using Elasticsearch bulk and then rests for a couple seconds.  There are about 100,000 documents in the collections dataset, 800 in content, and 31,000 in the archives dataset.

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).

## Lighthouse Score

One should see 100's across the board for the Lighthouse score.  Slightly lower score for performance due to relying on Brooklyn Museum image CDN.

![Lighthouse Score](./doc/img/Lighthouse.png)


## Screenshots

Light mode example:

![Light Mode Screenshot](./doc/img/ui_light.jpg)

Dark mode example:

![Dark Mode Screenshot](./doc/img/ui_dark.jpg)

Object page example:

![Object page sample](./doc/img/ui_object_view.jpg)
