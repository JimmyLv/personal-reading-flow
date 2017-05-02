const mongoose = require('mongoose')

const Story = require('../models/Story')

module.exports = (app) => {
  app.get('/stories', (req, res) => {
    req.storyModel.find({}).sort({ 'created_at': -1 }).exec((err, stories) => res.json(stories))
  })

  app.post('/stories', (req, res) => {
    const newStory = new req.storyModel(Object.assign({}, req.body, { created_at: Date.now() }))
    newStory.save((err, savedStory) => {
      res.json(savedStory)
    })
  })

  app.put('/stories', (req, res) => {
    const idParam = req.webtaskContext.query.id
    req.storyModel.findOne({ _id: idParam }, (err, storyToUpdate) => {
      const updatedStory = Object.assign(storyToUpdate, req.body)
      updatedStory.save((err, story) => res.json(story))
    })
  })

  app.delete('/stories', (req, res) => {
    const idParam = req.webtaskContext.query.id
    req.storyModel.remove({ _id: idParam }, (err, removedStory) => res.json(removedStory))
  })
}
