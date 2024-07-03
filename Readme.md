# wikidata vernacular name fetcher

A crawler used to fetch from wikidata Sparql endpoint all the vernacular names of plants for all existing languages.

## Use

Use as input an array (or a single) of GBIF ids and output an object with associated langs to the given id.

```javascript
import { wikidataVernacular } from "./wikidataVernacular/index.js"

// 5290052 is the GBIF id for Zea mays (Corn), 3033894 is the GBIF id for Berberis Vulgaris
const vernaculars = await wikidataVernacular(["5290052", "3033894"])

console.log(vernaculars)

/*
vernaculars will be

{"5290052": {
    fr:["Maïs", ...],
    en:["Corn", ...]
    ...
    },
"3033894":{...}
...
}
*/
```

## crawler behavior

wikidataVernacular serializes calls and uses a timer of 2 seconds to avoid flooding for the wikidata endpoint.
