const express = require('express')
const router = express.Router()
const axios = require('axios')
const token = process.env.MOVIEAPI_TOKEN;
const User = require('../models/users')

const rootUrl = 'https://api.themoviedb.org/3/'

const popularMovies = `${rootUrl}movie/popular?api_key=${token}&page=1`
const topMovies= `${rootUrl}movie/top_rated?api_key=${token}&page=1`



// show all popular movies
// route /movies
router.get('/', (req, res) => {
    axios.get(popularMovies)
        .then(response => {
            console.log(response)
            res.render('movies/index', {
                latestMovies: response.data.results
            })
        }).catch(err => console.log(err))
})

//show all top rated
//route /movies/toprated
router.get('/top-rated', (req, res) => {
    axios.get(topMovies)
        .then(response => {
            console.log(response)
            res.render('movies/index', {
                latestMovies: response.data.results
            })
        }).catch(err => console.log(err))
})



// show one movie
// route /movies/:id
router.get('/:id', async (req, res) => {
    const allUsersWithReview = await User.find({'review.movieId': req.params.id})
    axios.get(`${rootUrl}movie/${req.params.id}?api_key=${token}`)
        .then(response => {
            res.render('movies/show', {
                movie: response.data,
                allUsersWithReview,
                user: {
                    name: req.session.username,
                    id: req.session.userId,
                }
            })
        }).catch(err => console.log(err))
})



module.exports = router