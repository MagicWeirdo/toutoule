var count = 0;

var interval = setInterval(function() {
  console.log(++count);

  if(count === 30) {
    clearInterval(interval);
  }
}, 1000);
