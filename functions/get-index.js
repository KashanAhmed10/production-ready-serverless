// const fs = require("fs")
// const Mustache = require('mustache')
// const aws4 = require('aws4')
// const http = require('axios')

// const restaurantsApiRoot = process.env.restaurants_api
// const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// let html

// function loadHtml () {
//   if (!html) {
//     console.log('loading index.html...')
//     html = fs.readFileSync('static/index.html', 'utf-8')
//     console.log('loaded')
//   }
  
//   return html
// }

// const getRestaurants = async () => {
//   const httpReq = http.get(restaurantsApiRoot)
  
//   return (await httpReq).data
// }


// module.exports.handler = async (event, context) => {
//   const template = loadHtml()
//   const restaurants = await getRestaurants()
//   const dayOfWeek = days[new Date().getDay()]
//   const html = Mustache.render(template, { dayOfWeek, restaurants })
//   const response = {
//     statusCode: 200,
//     headers: {
//       'Content-Type': 'text/html; charset=UTF-8'
//     },
//     body: html
//   }

//   return response
// }
const fs = require("fs")
const Mustache = require('mustache')
const http = require('axios')
const aws4 = require('aws4')
const URL = require('url')

const restaurantsApiRoot = process.env.restaurants_api
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const template = fs.readFileSync('static/index.html', 'utf-8')

const getRestaurants = async () => {
  console.log(`loading restaurants from ${restaurantsApiRoot}...`)
  const url = URL.parse(restaurantsApiRoot)
  const opts = {
    host: url.hostname,
    path: url.pathname
  }

  aws4.sign(opts)

  const httpReq = http.get(restaurantsApiRoot, {
    headers: opts.headers
  })
  return (await httpReq).data
}

module.exports.handler = async (event, context) => {
  const restaurants = await getRestaurants()
  console.log(`found ${restaurants.length} restaurants`)  
  const dayOfWeek = days[new Date().getDay()]
  const html = Mustache.render(template, { dayOfWeek, restaurants })
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    },
    body: html
  }

  return response
}
