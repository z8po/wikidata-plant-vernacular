import { mapSeries } from "async"

/* prefix are used as shorthand to syntaxicaly compress sparql queries and avoid to write the whole url of domain */
const PREFIX = `
    # wikidata prefixes
    PREFIX wdt: <http://www.wikidata.org/prop/direct/>
`

/**
 * @name wikidataQuery
 * @description A sparql query formater to select bound vernacular plant name records (property key P1843) and their bound language for a given gbif ID (property key P846)
 * @param {string | number} gbif gbif id of the plant
 * @returns {string} a formated sparql query for wikidata endpoint
 */
const wikidataQuery = (gbif) => `
    ${PREFIX}
    SELECT DISTINCT ?vernacular ?lang
    WHERE {
        ?subject wdt:P846 "${gbif}".
        ?subject wdt:P1843 ?vernacular
        BIND(LANG(?vernacular) AS ?lang)
    } LIMIT 1000
`
/**
 * @name sparqlFetch
 * @description A sparql query executer for wikidata endpoint.
 * @param {string} query a Sparql query
 * @returns {Promise} a promise resolving a json sparql bindings
 */
const sparqlFetch = (query) =>
  fetch(
    `https://query.wikidata.org/bigdata/namespace/wdq/sparql?query=${encodeURIComponent(
      query
    )}&format=json`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
        accept: "application/sparql-results+json",
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(`Request Failed : ${response.status}`)
      }
    })
    .then((data) => data?.results?.bindings ?? [])
    .catch((error) => ({ error }))

/**
 * @name wikidataVernacularDetail
 * @description a function to fetch wikidata sparql with a sparql request with gbif taxon ID and associated vernacular bindings
 * @param {string | number} gbif the GBIF id of a plant taxon
 * @returns {object} a vernacular lang object with key lang and associated value an array of vernacular names
 */
export const wikidataVernacularDetail = async (gbif = "") => {
  const bindings = await sparqlFetch(wikidataQuery(gbif))

  return bindings.error
    ? { [gbif]: bindings.error }
    : {
        // reducing all values in a proper object
        [gbif]: bindings.reduce(
          (accumulator, binding) =>
            (accumulator[binding.lang.value] = [
              ...(accumulator[binding.lang.value] ?? []),
              binding.vernacular.value,
            ]) && accumulator,
          {}
        ),
      }
}

/**
 * @name wikidataVernacular
 * @description a function to fetch wikidata a list of gbif ids, managing time to request for large list
 * @param {number | string | Array.<string> | Array.<number>} gbifList a list of GBIF ID of plant taxons; single gbif as string or integer accepted as fallback
 * @returns {object} an object with gbif id as key and associated value a vernacular lang object
 */
export const wikidataVernacular = async (gbifList) => {
  // if id is single, bypass mapseries process
  if (typeof gbifList === "string" || typeof gbifList === "number") {
    return await wikidataVernacularDetail(gbifList)
  }
  const vernaculars = await mapSeries(
    gbifList,
    async (gbif) =>
      new Promise((resolve) => {
        setTimeout(async () => {
          resolve(await wikidataVernacularDetail(gbif))
        }, 2000)
      })
  )
  return vernaculars.reduce(
    (accumulator, vernacular) => ({
      ...accumulator,
      ...vernacular,
    }),
    {}
  )
}
