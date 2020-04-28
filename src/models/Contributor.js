import Model from './Model'

export default class Contributor extends Model {

  constructor(obj) {
    super()
    this.attributes = ["id", "contributor", "type"]
    this.requiredAttributes = ["id", "contributor", "type"]
    this._parse(obj)
    this._setDefaults()
  }

  _setDefaults(obj) {
    if(!this.id) this.id = this.generateID()
    if(!this.contributor) this.contributor = {}
    if(!this.type) this.type = []
  }

  validate() {
    super.validate()
  }
}
