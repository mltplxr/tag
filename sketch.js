let x_displace_slider, y_displace_slider, n_dots_slider, n_lines_slider, 
    coupling_slider, space_width_slider;
let n_lines = 10;
let n_dots = 70;
let y_padding = 20;
let y_start = 185;
let x_padding = 10;
let radius = 4;

function setup() {
  createCanvas(windowWidth, 600);
  
  //create sliders
  x_displace_slider = createSlider(1, 100, 1);
  y_displace_slider = createSlider(1, 100, 4);
  n_dots_slider = createSlider(20, 200, n_dots);
  n_lines_slider = createSlider(2, 100, n_lines);
  max_spaces_slider = createSlider(3, 20, 5);
  coupling_slider = createSlider(0, 100, 0);
  space_width_slider = createSlider(1, 10, 2);
  //position sliders
  x_displace_slider.position(width / 2 - x_displace_slider.width/2, 10);
  y_displace_slider.position(width / 2 -  y_displace_slider.width/2, 38);
  n_dots_slider.position(width / 2 -  n_dots_slider.width/2, 65);
  n_lines_slider.position(width / 2 -  n_lines_slider.width/2, 90);
  coupling_slider.position(width/2- coupling_slider.width/2, 115);
  max_spaces_slider.position(width/2- max_spaces_slider.width/2, 140);
  space_width_slider.position(width/2- space_width_slider.width/2, 165);
  //trigger draw event when sliders change
  x_displace_slider.input(redraw);
  y_displace_slider.input(redraw);
  n_dots_slider.input(redraw);
  n_lines_slider.input(redraw);
  coupling_slider.input(redraw);
  max_spaces_slider.input(redraw);
  space_width_slider.input(redraw);
  strokeWeight(1);
  
}

function draw() {
smooth();
  background(255);
  fill(0);
  //draw slider labels
  //text('x shift', x_displace_slider.x + x_displace_slider.width + 10, 23);
 // text('y shift', y_displace_slider.x + y_displace_slider.width + 10, 52);
 // text('num dots', n_dots_slider.x + n_dots_slider.width + 10, 77);
  //text('num lines', n_lines_slider.x + n_lines_slider.width + 10, 102);
  //text('coupling', coupling_slider.x + coupling_slider.width + 10, 128);
  //text('max spaces', max_spaces_slider.x + max_spaces_slider.width + 10, 151);
  //text('space width', space_width_slider.x + space_width_slider.width + 10, 177);


  noFill();
  //get values from slider
  let x_displacement = x_displace_slider.value()/3;
  let y_displacement = y_displace_slider.value()/3
  let n_dots = n_dots_slider.value();
  let n_lines = n_lines_slider.value();
  let coupling = coupling_slider.value()/100;
  let max_spaces = max_spaces_slider.value();
  let space_width = space_width_slider.value();
  noLoop();
  let padded_width = width - 2 * x_padding;
  let padded_height = height - 2 * y_padding - y_start;
  for (let i = 0; i < n_lines; i++) {
    y = y_start + y_padding + i * padded_height / (n_lines - 1);
    // determine how many words to place
    let num_words = floor(random(2, max_spaces));
    
    //draw n random segments
    let starts = new Array(num_words);
    let ends = new Array(num_words);
    let total = 0;

    //start at 0
    Array[0]=0;
    for(let i=1; i<=num_words;i++) {
      Array[i] = random(0, 1);
      total = total + Array[i];
    }

    // normalize lengths
    for(let i=1; i<=num_words;i++) {
      Array[i] *= (n_dots-1-space_width*(num_words-1))/total;
    }

    let rem = 0;
    total = 0;
    starts[0]=0;
    ends[num_words-1] = n_dots;

    // addition with remainder
    for(let i=0;i<=num_words;i++) {
      // get the updated remainder
      let new_rem = (Array[i]+rem)%1;

      Array[i] = total + round(Array[i]+rem);

      // only add spaces after the first word
      if(i>0) {
        ends[i-1] = Array[i];
        total = Array[i]+space_width;
              }

      starts[i] = total;
      
       // if we rounded up, subtract 1 from the remainder
      rem = new_rem-round(new_rem);
    }
    
    let word_number = 0;
    let skip_counter = 1;
    
    // word always starts at beginning of section
    beginShape();
    
    for (let j = 0; j < n_dots; j++) {
      //determine if this is the end of our word
      if(j==ends[word_number]) {
        word_number++;
        skip_counter = 2+space_width;
      }
      
      
      x = x_padding + j * padded_width / (n_dots - 1);
     let x_delta = random(-x_displacement, x_displacement);
      let y_delta = (1-coupling)*random(-y_displacement, y_displacement) 
      y_delta -=coupling * x_delta*y_displacement/x_displacement;
      
      if(skip_counter==2+space_width) {
        // This is the end of our shape
        curveVertex(x + x_delta, y + y_delta);
        curveVertex(x + x_delta, y + y_delta);
        endShape();
        skip_counter--;
      } else if (skip_counter<2*space_width & skip_counter>1) {
        // this is the space
        skip_counter--;
      } else if (skip_counter==1) {
        //this is the start of the next word
        beginShape();
        curveVertex(x + x_delta, y + y_delta);
        curveVertex(x + x_delta, y + y_delta);
        skip_counter --;
      } else {
        //this is inside of a word
        curveVertex(x + x_delta, y + y_delta);
      }
      
    }
  }
}
// save png
let lapse = 0;    // mouse timer
function keyPressed(){
  if (millis() - lapse > 400){
    save("img_" + month() + '-' + day() + '_' + hour() + '-' + minute() + '-' + second() + ".png"); 
    lapse = millis();
    
  }
  
}
function touchStarted () {
  var fs = fullscreen();
  if (!fs) {
    fullscreen(true);
  }
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
 */
document.ontouchmove = function(event) {
    event.preventDefault();
};

