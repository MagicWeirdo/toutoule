function a() {
  console.log("hello world!");

  setTimeout(function() {
    b();
  }, 500);
}

function b() {
  a();
}

a();
