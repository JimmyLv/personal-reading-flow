const mongoose = require('mongoose')
// import Story schema
const StorySchema = require('../models/Story')

module.exports = {
  // Connect/Disconnect middleware
  connectDisconnect: (req, res, next) => {
    // Create connection using Mongo Lab URL
    // available in Webtask context
    const connection = mongoose.createConnection(req.webtaskContext.secrets.MONGO_URL)
// Create a mongoose model using the Schema
    req.storyModel = connection.model('Story', StorySchema)
    req.on('end', () => {
      // Disconnect when request
      // processing is completed
      mongoose.connection.close()
    })
// Call next to move to
// the next Express middleware
    next()
  }
}
