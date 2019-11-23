
const express = require('express')
const app = express()

// multer interbal storage
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    console.log(file)
    cb(null, file.originalname)
  }
})

// test api key
app.post('/upload', (req, res, next) => {
  const upload = multer({ storage }).single('img')
  upload(req, res, function(err) {
    if (err) {
      return res.send(err)
    }

    console.log('file uploaded to server')
    console.log(req.file)

    // Kirim file ke claudinary 
    const cloudinary = require('cloudinary').v2
    cloudinary.config({
      cloud_name: 'phsycode-id',
      api_key: '341517558128988',
      api_secret: 'oKkqofZ4Cqr1PFZFizbE1Pw5o8E'
    })

    const path = req.file.path
    const uniqueFilename = new Date().toISOString()

    cloudinary.uploader.upload(
      path,
      { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // kalo mau rubah blog los bebas
      function(err, image) {
        if (err) return res.send(err)
        console.log('file uploaded to Cloudinary')

        var fs = require('fs')
        fs.unlinkSync(path)

        res.json(image)
      }
    )
  })
})

app.listen(3000)