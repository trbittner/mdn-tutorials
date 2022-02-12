const { DateTime } = require("luxon")

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AuthorSchema = new Schema(
  {
    first_name: {type:String,required:true,maxLength:100},
    family_name: {type:String,required:true,maxLength:100},
    date_of_birth: {type:Date},
    date_of_death: {type:Date},
  }
)

//Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function() {
  //To avoid errors in cases where an author doesn't have a family name or
  //first name, we want to make sure we return an empty string for that case.
  var fullname =''
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }
  
  if (!this.first_name || !this.family_name) {
    fullname = ''
  }
  
  return fullname
})

//Virtual for author's birth
AuthorSchema
.virtual('date_of_birth_formatted')
.get(function() {
  return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : ''
})

//Virtual for author's death
AuthorSchema
.virtual('date_of_death_formatted')
.get(function() {
  return  this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : ''
})

//Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function() {
  return `${this.date_of_birth_formatted} - ${this.date_of_death_formatted}`
})

//Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function() {
  return '/catalog/author/' + this._id
})

//Export model
module.exports = mongoose.model('Author',AuthorSchema)