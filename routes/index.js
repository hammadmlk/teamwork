
/*
 * GET home page.
 */

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
  
  res.writeHead(302, {
    'Location': '/index.html'
    });
  res.end();  
  
};

//get video page
exports.video = function(req, res){
  
  res.writeHead(302, {
    'Location': '/video.html'
    });
  res.end();  
  
};