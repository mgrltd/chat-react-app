import React ,{useState} from 'react'
import '../cssFiles/demo.css'

const Demo = () => {
  var w = window.innerWidth;
  var h = window.innerHeight;

  const [arr,setarr]=useState(["ram","neela","raju","haresh","pavan"]);


  const home=()=>{
    return(
      <div>
        <h1>h</h1>
      </div>
    )
  } 
  function scrollToBottom() {
    const scrollContainer = document.getElementById('container');
    scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        left: 0,
        behavior: 'smooth'
    });
}

// // initialize dummy content
// const scrollContainer = document.getElementById('container');
// const numCards = 10;
// let contentInnerHtml = '';
// for (let i=0; i<numCards; i++) {
//   contentInnerHtml += `<div class="card mb-2"><div class="card-body">Card ${i + 1}</div></div>`;
// }
// scrollContainer.innerHTML = contentInnerHtml;

  return (
    <div className='body'>
      demo
      <div>
  <div id="container" class="overflow-y-scroll">
  
  </div>
  <div>
  <button class="btn btn-primary" onClick={scrollToBottom} >Scroll to bottom</button> 
  </div>
  
</div>
<div>
    
      </div>

      </div>
  )
}



export default Demo

