import Model from './Model'

export default class Contributor extends Model {

  constructor(obj) {
    super()
    this.attributes = ["id", "artist", "type"]
    this.requiredAttributes = ["id", "artist", "type", "approved", "pending"]
    this._parse(obj)
    this._setDefaults()
  }

  _setDefaults(obj) {
    if(!this.id) this.id = this.generateID()
    if(!this.contributor) this.contributor = {}
    if(!this.type) this.type = []
    if(!this.approved) this.approved = false
    if(!this.pending) this.pending = true
  }

  validate() {
    super.validate()
  }
}
