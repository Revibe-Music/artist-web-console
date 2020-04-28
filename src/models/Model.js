
export default class Model {

  constructor(obj) {
    this.hasError = false
    this.hasWarning = false
    this.errors = []
    this.warnings = []
  }

  _parse(obj) {
    var objKeys = Object.keys(obj)
    for(var x=0; x<objKeys.length; x++) {
      if(this.attributes.includes(objKeys[x])) {
        this[objKeys[x]] = obj[objKeys[x]]
      }
    }
  }

  generateID() {
    return Math.floor(Math.random() * 1000000000)
  }

  addError(location, message) {
    this.errors.push({location: location, message: message})
  }

  addWarning(location, message) {
    this.warning.push({location: location, message: message})
  }

  clearErrors(location=null) {
    this.errors = location ? [...this.errors].filter(x => x.location !== location) : []
  }

  formatErrors() {
    var errors = 7
  }


  isValid() {
    return this.errors.length < 1
  }

  validate() {
    for(var x=0; x<this.requiredAttributes.length; x++) {
      if(!this[this.requiredAttributes[x]]) {
        this.hasError = true
        this.errors.push({location: this.requiredAttributes[x], message: `${this.requiredAttributes[x]} is required.`})
      }
    }
  }

}
