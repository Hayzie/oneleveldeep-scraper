const cheerio = require('cheerio');
const  axios = require('axios');
const express = require('express');
const path = require('path');
const { response } = require('express');
const app = express()

const links =[];
const parentDomain = 'https://www.classcentral.com';

app.get('/links',function(req, res){
      res.json(links);
})

app.get('/tranlated',function(req, res){
 const url = req.query.url;
 axios.get(url)
  .then(function (response) {
    const html = response.data;
    const $ = cheerio.load(html);
    
    //insert google translate links into the header
    $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js" integrity="sha512-STof4xm1wgkfm7heWqFJVn58Hm3EtS31XFaagaa8VMReCXAkQnJZ+jEy8PCC/iT18dFy95WcExNHFTqLyp72eQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js" integrity="sha512-3j3VU6WC5rPQB4Ld1jnLV7Kd5xr+cq9avvhwqzbH/taCRNURoeEpoPBK9pDyeukwSxwRPJ8fDgvYXd6SkaZ2TA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>`);
    
    //hide google translate widgets
    $('head').append(`<style type="text/css">
		.goog-te-banner-frame.skiptranslate{display:none!important;}
		body{top:0px!important;}
		</style>`);

     //insert google translate element
    $('body').append(`<div style="{display:none;}" id="google_translate_element"></div>
     <script type="text/javascript">
     $.cookie('googtrans','/en/hi');
     </script>
    <script type="text/javascript">
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    }
    </script>
    
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>`);
    $.html();

    res.send($.html());
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
})

app.get('/', function (req, res) {
  
  axios.get(parentDomain+'/')
  .then(function (response) {
    const html = response.data;
    const $ = cheerio.load(html);
    //get links one level deeper
    $('.hover-bg-purple-light',html).each(function(){
      const text = $(this).text();
      const url  = $(this).attr('href');
      const image  = $(this).find('img').attr('src')
      links.push({title:text,url:parentDomain+url, image:image});
    })
    //return links
    res.sendFile(path.join(__dirname+'/index.html'));
    console.log(links); //debug
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
})

app.listen(3000)

