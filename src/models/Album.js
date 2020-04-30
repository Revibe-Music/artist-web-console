import Contributor from './Contributor'
import Model from './Model'

export default class Album extends Model{

  static contributionStringTests = [
    " ft ", "ft.", "ft:", "ft-",
    " feat ", "feat.", "feat-", "feat:",
    " feature ", "feature-", " feature:",
    " features ", "features-", "features:",
    " featuring ", "featuring-", "featuring:",
    " prod by ", "prod by-", "prod by:",
    " produced by ", "produced by-", "produced by:",
  ]

  constructor(obj) {
    super()
    this.attributes = ["id", "name", "type", "images", "uploadedBy", "contributors", "displayed", "totalStreams", "uploadDate", "datePublished"]
    this.requiredAttributes = ["id", "name", "type", "images", "contributors", "displayed"]
    if(obj) this._parse(obj)
    this._setDefaults()
  }


  _setDefaults(obj) {
    if(!this.id) this.id = this.generateID()
    if(!this.name) this.name = ""
    if(!this.type) this.type = ""
    if(!this.images) this.images = []
    if(!this.uploadedBy) this.uploadedBy = null
    if(!this.contributors) this.contributors = []
    if(!this.displayed) this.displayed = true
    if(!this.totalStreams) this.totalStreams = 0
  }

  validate = () => {
    if (this.name=== "") {
      this.hasError = true
      this.errors.push({location: "name", message: "Name may not be blank.", critial: true})
    }
    if (this.type=== "") {
      this.hasError = true
      this.errors.push({location: "type", message: "Type may not be blank.", critial: true})
    }
    if (this.image === null) {
      this.hasError = true
      this.errors.push({location: "image", message: "Image may not be blank.", critial: true})
    }
    for(var i=0; i<this.contributors.length; i++) {
      if(this.contributors[i].type.length < 1) {
        this.hasError = true
        this.errors.push({location: "contributors", message: `${this.contributors[i].contributor.name} has not been assigned a contribution type.`, critial: true})
      }
    }
    if (Album.contributionStringTests.some(contributionString => this.name.trim().toLowerCase().includes(contributionString))) {
      this.hasError = true
      this.errors.push({location: "contributors", message: "Must actually tag contributors in order to give them create.", critial: false})
    }
  }

  setName = (name) => {
    this.name = name
    this.clearErrors("name")
  }

  setType = (type) => {
    this.type = type
    this.clearErrors("type")
  }

  setImage= (image) => {
    this.image = image
    this.clearErrors("image")
  }

  addContributor = (contributor)  => {
    contributor = contributor.constructor.name !== "Contributor" ? new Contributor({contributor: contributor}) : contributor
    this.contributors = [...this.contributors, contributor]
    this.clearErrors("contributors")
  }

  removeContributor = (artistId) => {
    const contributors = [...this.contributors]
    var contributorIndex = contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artistId)
    contributors.splice(contributorIndex, 1)
    this.contributors = contributors
    this.clearErrors("contributors")
  }

  updateContribution = (contribution) => {
    const contributors = [...this.contributors]
    var contributorIndex = contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(contribution.contributor.artist_id)
    contributors[contributorIndex] = contribution
    this.contributors = contributors
    this.clearErrors("contributors")
  }


  addContributor(contributor) {
    if(contributor.constructor.name !== "Contributor") {
      contributor = new Contributor(contributor)
    }
    this.contributors = [...this.contributors, contributor]
    this.clearErrors("contributors")
  }

  removeContributor(artistId) {
    const contributors = [...this.contributors]
    var contributorIndex = contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artistId)
    contributors.splice(contributorIndex, 1)
    this.contributors = contributors
    this.clearErrors("contributors")
  }

  updateContribution(artistId, contribution) {
    const contributors = [...this.contributors]
    var contributorIndex = contributors.map(function(x) {return x.contributor.artist_id; }).indexOf(artistId)
    contributors[contributorIndex] = contribution
    this.contributors = contributors
    this.clearErrors("contributors")
  }
}
