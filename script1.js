let counter = 1;
setInterval(() => {
  document.querySelector('h1').innertext=counter;
  counter++;
  if(counter>5)
  location.reload();
},1000);
