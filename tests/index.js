import { wikidataVernacularDetail, wikidataVernacular } from "../index.js"
import assert from "assert"
import { expect } from "chai"
describe("wikidataVernacular tests ", () => {
  it('should find french vernacular name "Maïs" for Zea mays', (done) => {
    wikidataVernacularDetail("5290052")
      .then((data) => {
        assert.equal(data["5290052"].fr[0], "Maïs")
      })
      .then(done)
      .catch(done)
  }).timeout(2000)
  it('should find french vernacular name "Maïs" for Zea mays and both vernacular name "Epine-Vinette" "Épine-vinette vulgaire" in the list for Berberis Vulgaris', (done) => {
    wikidataVernacular(["5290052", "3033894"])
      .then((data) => {
        assert.equal(data["5290052"].fr[0], "Maïs")
        expect(data["3033894"].fr)
          .to.include("Epine-Vinette")
          .to.include("Épine-vinette vulgaire")
      })
      .then(done)
      .catch(done)
  }).timeout(8000)
  it("should fallback item as an array", (done) => {
    wikidataVernacular("5290052")
      .then((data) => {
        assert.equal(data["5290052"].fr[0], "Maïs")
      })
      .then(done)
      .catch(done)
  }).timeout(2000)
})
