const express = require('express')
const app = express();
const ShortUrl = require('./models/shorturl')

let mongodbURI = '';
const mongoose = require('mongoose');
mongoose.connect(mongodbURI)
.then(() => {console.log('Connected to mongoose!')})
.catch((err) => {console.log('Couldn\'t connet to mongoose! Error: ' + err)})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('./index', { req: req, res: res, shortUrls: shortUrls })
})

app.post('/', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    .then(() => {
        res.redirect('/')
    })
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
})

app.post('/:shortUrl', async (req, res) => {
    await ShortUrl.deleteOne({ short: req.params.shortUrl })
    res.redirect('/')
})

app.listen(5000, () => {
    console.log(`App running on port 5000.`)
})