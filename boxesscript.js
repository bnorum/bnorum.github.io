const container = document.querySelector('.container')
const sizeEl = document.querySelector('.size')
const sizeOut = document.querySelector('.size-out')
let sizeout = sizeOut.value
let size = sizeEl.value
const color = document.querySelector('.color')
const resetBtn = document.querySelector('.reset')
const updateBtn = document.querySelector('.updatearr')

let draw = false

// 2D array to hold colors
let colors = []

function populate(size) {
  container.style.setProperty('--size', size)
  colors = [] // Clear the colors array
  for (let i = 0; i < size; i++) {
    colors[i] = [] // Create an empty array for each row
    for (let j = 0; j < size; j++) {
      colors[i][j] = 'drawsomethingplease' // Initialize each cell with an empty string
      const div = document.createElement('div')
      div.classList.add('pixel')

      div.addEventListener('mouseover', function(){
          if(!draw) return
          div.style.backgroundColor = color.value
          colors[i][j] = color.value // Update the color in the array
      })
      div.addEventListener('mousedown', function(){
          div.style.backgroundColor = color.value
          colors[i][j] = color.value // Update the color in the array
      })

      container.appendChild(div)
    }
  }
}

function convertArrayToString(arr) {
  return arr.map(row => row.join(' ')).join('<br>');
}

updateBtn.addEventListener('click', function(){
  document.getElementById("cssoutput").innerHTML = createBoxShadow(size);
})

window.addEventListener("mousedown", function(){
    draw = true
})
window.addEventListener("mouseup", function(){
    draw = false
})

function reset(){
    container.innerHTML = ''
    populate(size)
}

resetBtn.addEventListener('click', reset)

sizeEl.addEventListener('keyup', function(){
    size = sizeEl.value
    reset()
})
sizeOut.addEventListener('keyup', function(){
  sizeout = sizeOut.value
})
populate(size)


function createBoxShadow(size) {
  let boxShadow = ''
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if(colors[i][j] == 'drawsomethingplease') continue
      boxShadow += `<br>${j*sizeout}px ${i*sizeout}px 0 0 ${colors[i][j]},`
    }
  }
  if (colors [0][0] == 'drawsomethingplease') return "Output:<br><br>.boxShadow {<br>background-color: #ffffff" +";<br>height: " +sizeout+ "px;<br>width: " +sizeout+ "px;<br>&emsp;box-shadow: " + boxShadow.slice(0, -1) + "<br>}"
  else return "Output:<br><br>.boxShadow {<br>background-color: " + colors[0][0] +";<br>height: " +sizeout+ "px;<br>width: " +sizeout+ "px;<br>box-shadow: " + boxShadow.slice(0, -1) + "<br>}"
}

const style = document.createElement('style')
style.innerHTML = cssClass
document.head.appendChild(style)
