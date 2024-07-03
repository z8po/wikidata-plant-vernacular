# wikidata vernacular name fetcher

A crawler used to fetch from wikidata Sparql endpoint all the vernacular names of plants for all existing languages

## Use

Use as input an array (or a single) of GBIF ids and output an object with associated langs to the given id

```
import {wikidataVernacular} from "./wikidataVernacular/index.js"
wikidataVernacular(["5290052", "3033894"])

/* should return
{"5290052": {
    fr:["Maïs", ...],
    en:["Corn", ...]
    ...
    }
"3033894":{...}
...
}
*/

```

## crawler behavior

wikidataVernacular serializes calls and uses a timer of 2 seconds to avoid flooding for the wikidata endpoint.
