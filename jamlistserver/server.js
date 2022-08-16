const express = require('express')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express()
const port = 3001

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors());
app.use(bodyParser.json());


let list = [
  {
    "link": "https://www.youtube.com/watch?v=OnzkhQsmSag",
        "title": "Electric Callboy - PUMP IT (OFFICIAL VIDEO)",
        "author": "Electric Callboy",
        "thumbnail_url": "https://i.ytimg.com/vi/OnzkhQsmSag/hqdefault.jpg",
        "votes": 1
  },
  {
    "link": "https://www.youtube.com/watch?v=4TV_128Fz2g",
        "title": "Princess Chelsea - The Cigarette Duet",
        "author": "Princess Chelsea",
        "thumbnail_url": "https://i.ytimg.com/vi/4TV_128Fz2g/hqdefault.jpg",
        "votes": 5
  }
]


app.get('/api/list', (req, res) => {

  res.send(list);
})

app.post('/api/request', (req, res) => {
  if(req.body.link==''){
    res.send({error : "cannot process empty request" });
  }else{
    let baseurl = "https://noembed.com/embed?url=" + req.body.link;
    //fetch videodata:
    fetch(baseurl)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        let video = {};
        video.link = req.body.link;
        video.title = data.title;
        video.author = data.author_name;
        video.thumbnail_url = data.thumbnail_url; 
        video.votes = 0;
        list.push(video);
      })
      .then(()=> res.send(list));
  } 
  
  //console.log(req.body.link);
  
})

app.post('/api/vote', (req, res) => {
  //console.log(req.body.link);
  console.log(list);
  console.log(req.body);  
  list.find(element => element.target == req.body.link).votes += req.body.vote;
  
  res.send(list);
})



app.listen(port, () => {
  console.log(`Active on ${port}`)
})
