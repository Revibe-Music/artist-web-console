import Contributor from './Contributor'
import Model from './Model'

export default class Song extends Model {

  static contributionStringTests = [
    " ft ", "ft.", "ft:", "ft-",
    " feat ", "feat.", "feat-", "feat:",
    " feature ", "feature-", " feature:",
    " features ", "features-", "features:",
    " featuring ", "featuring-", "featuring:",
    " prod by ", "prod by-", "prod by:",
    " produced by ", "produced by-", "produced by:",
  ]

  static fileExtensionTests = [".mp3", ".mp4", ".wav", ".flac", ".ogg"]

  constructor(obj) {
    super()
    this.attributes = ["id", "title", "duration", "file", "explicit", "contributors", "genres", "tags","displayed"]
    this.requiredAttributes = ["id", "title", "duration", "file", "explicit", "contributors", "displayed"]
    if(obj) this._parse(obj)
    this._setDefaults()

  }

  _setDefaults(obj) {
    if(!this.id) this.id = this.generateID()
    if(!this.title) this.title = ""
    if(!this.explicit) this.explicit = false
    if(!this.contributors) this.contributors = []
    if(!this.genres) this.genres = []
    if(!this.tags) this.tags = []
    if(!this.displayed) this.displayed = true
  }

  validate = () => {
    // super.validate()
    if(this.title.trim() === "") {
      this.hasError = true
      this.errors.push({location: "title", message: "Title may not be blank.", critial: true})
    }
    if (Song.contributionStringTests.some(contributionString => this.title.trim().toLowerCase().includes(contributionString))) {
      this.hasError = true
      this.errors.push({location: "contributors", message: "Must actually tag contributors in order to give them create.", critial: false})
    }
    if(isNaN(this.duration)) {
      this.hasError = true
      this.errors.push({location: "duration", message: "Duration is invalid.", critial: true})
    }
    if (Song.fileExtensionTests.some(fileExtension => this.title.toLowerCase().includes(fileExtension))) {
      this.hasError = true
      this.errors.push({location: "title", message: "Title contains a file extension.", critial: false})
    }
    for(var i=0; i<this.contributors.length; i++) {
      if(this.contributors[i].type.length < 1) {
        this.hasError = true
        this.errors.push({location: "contributors", message: `${this.contributors[i].contributor.name} has not been assigned a contribution type.`, critial: true})
      }
    }
  }

  setTitle = (title) => {
    this.title = title
    this.clearErrors("title")
  }

  removeFileExtensionFromTitle = () => {
    for(var y=0; y<Song.fileExtensionTests.length; y++) {
      if (Song.fileExtensionTests.some(fileExtension => this.title.toLowerCase().includes(fileExtension))) {
        this.title = this.title.replace(Song.fileExtensionTests[y],'')
      }
    }
  }

  formatTitle = () => {
    this.removeFileExtensionFromTitle()
  }

  displayTitle = () => {
    var featuring = []
    var producedBy = []
    for(var x=0; x<this.contributors.length; x++) {
      if(this.contributors[x].type.includes("Feature")) {
        featuring.push(this.contributors[x].contributor.name)
      }
      if(this.contributors[x].type.includes("Producer")) {
        producedBy.push(this.contributors[x].contributor.name)
      }
    }
    var title = this.title
    if(featuring.length > 0) {
      title += ` (feat. ${featuring.join(" ,")})`
    }
    if(producedBy.length > 0) {
      title += ` (prod. by ${producedBy.join(" ,")})`
    }
    return title

  }

  setExplicit = (explicit) => {
    this.explicit = explicit
    this.clearErrors("explicit")
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

  /// SONG GENRE OPRERATIONS ///

  setGenres = (genres) => {
    this.genres = genres
    this.clearErrors("genres")
  }

  addGenre = (genre) => {
    this.genres = [...this.genres, genre]
    console.log(this.genres);
    this.clearErrors("genres")
  }

  removeGenre = (genre) => {
    this.genres = [...this.genres].filter(x => x !== genre)
    console.log(this.genres);
    this.clearErrors("genres")
  }

  /// SONG TAG OPRERATIONS ///
  setTags = (tags) => {
    this.tags = tags
    this.clearErrors("tags")
  }

  addTag = (tag) => {
    this.tags = [...this.tags, tag]
    this.clearErrors("tags")
  }

  removeTag = (tag) => {
    this.tags = [...this.tags].filter(x => x !== tag)
    this.clearErrors("tags")
  }

}
