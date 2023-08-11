export const getFillColor = (number) => {
  if (number >= 100)
    return 'white'
  if (number < 5) { 
    return 'green';
  } else if (number >= 5 && number < 10) {
    return 'orange';
  } else {
    return 'red';
  }
};

export const getShape = (cont_len, total) => {
  if (cont_len <= 0.3 * total)
    return 'M 0,0 l -5,8 l 10,0 z' // triangle
  if (cont_len > 0.3 * total && cont_len <= 0.6 * total)
    return 'M -5,-5 l 10,0 l 0,10 l -10,0 z' // square
  else
    return 'M 0,0 m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0' //circle
}

export const circleIcon = (number, cont_len, total) => ({
  path: getShape(cont_len, total),
  fillColor: getFillColor(number),
  fillOpacity: 1, 
  strokeWeight: 2,
  scale: 2,  
}); 
 
export const spacing = ""; 