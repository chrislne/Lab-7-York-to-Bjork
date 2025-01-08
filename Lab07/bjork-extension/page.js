const mydomain = window.location.hostname.split('.');

/**
 * This extension only works if the domain name includes 'yorku'!
 * No other websites will be ... Bjorked.
 */
if (mydomain.includes("yorku")) 
  {

  const BJORK = { //words to BJORKIFY
    "York": "Bjork",
    "YORK": "BJORK",
    "York's": "Bjork's",
    "YORK'S": "BJORK'S" 
  };

  const UNBJORK = 
  { //words to UNBJORKIFY
    "Bjork": "York",
    "BJORK": "YORK",
    "Bjork's": "York's",
    "BJORK'S": "YORK'S" 
  };
  
  const CURSOR = chrome.runtime.getURL('assets/bjork-cursor.gif'); //change cursor and BG when BJORKED
  const BG = chrome.runtime.getURL('assets/shine.gif');

  /* create a button to Bjorkify */
  const button = document.createElement('button')
  button.innerText = 'Click to Bjorkify!'
  button.classList.add('bjorkbutton');
  button.style.backgroundColor = 'white';
  button.style.color = 'red';
  button.style.fontSize = '1.5em';
  button.style.width = '100%';
  button.style.height = '50px';
  button.style.padding = '10px';
  button.style.zIndex = '99';

  var flag = false; //tells us if the page is bjorked, or debjorked

  async function transformTextNodes(node, type) 
  {

    if (type) words = BJORK; //select the right keys and values
    else words = UNBJORK;

    if (node.nodeType == Node.TEXT_NODE)
    { //is the node a text node?

      // The code below will wrap the node in a DOM span element of class 'bjork', 
      // if this has not already been done.
      if (node.parentNode.className.split(' ').indexOf('bjork')<0) 
      {
        var s = document.createElement('span');
        s.classList.add('bjork');
        node.parentNode.insertBefore(s,node);        
        s.appendChild(node);          
      }

      //Access the words in the nodes 'textContent'
      let alltext = node.textContent;
      let strings = alltext.split(" ");

      for (var i = 0; i < strings.length; i++)
      {
        //Search for words that are keys in the the "words" dictionary variable
        if (words.hasOwnProperty(strings[i]))
        {
          //Replace words that are keys with the corresponding words that are **values**
          strings[i] = words[strings[i]];
        }
      }

      //Then, replace the nodes 'textContent' with the adjusted string.
      node.textContent = strings.join(" ");
    }

    //Access the children of the node and call textTransform recursively on all of these children.
    node.childNodes.forEach(child => transformTextNodes(child, type));
  }


   function onmouseover(event)
   {
    //Store the DOM element that activated the event
    const target = event.currentTarget();
    
    //Change the image of the cursor to bjork
    target.style.cursor = "url('assests/bjork-cursor.gif'), auto";
    target.style.opacity = 0.8;
  }

  function onmouseout(event)
  {
    //Store the DOM element that activated the event
    const target = event.currentTarget();

    //Change the image of the bjork cursor to the regular cursor
    target.style.cursor = "auto";
    target.style.opacity = 1;
  }

  /** BjorkIt
   * 
   * This function will find all nodes of class "bjork".
   * It will then modify the cursor style of these nodes and
   * add mouse listeners to each and every one of them.
   */
  function bjorkIt()
  {
    const bjorks = document.querySelectorAll(".bjork");
    var counter = 0
    for (let bjork of bjorks){
      bjork.style.cursor = 'url(' + CURSOR + ') 4 12, auto'; //Bjork cursor!
      bjork.addEventListener('mouseover', onmouseover);
      bjork.addEventListener('mouseout', onmouseout);
      counter++;
    }
    
    if (counter == 0) 
    {
      button.style.display = 'hidden'; //no bjorks found!
    }
    
    console.log('Bjorks added', counter);
  }

  /** BjorkIt
   * 
   * This function will find all nodes of class "bjork".
   * It will then reset the cursor style of these nodes and
   * remove mouse listeners to each and every one of them.
   */
  function unBjorkIt()
  {
    const bjorks = document.querySelectorAll(".bjork");
    var counter = 0;
    for (let bjork of bjorks){
      bjork.style.cursor = 'auto'; //normal cursor!
      bjork.removeEventListener('mouseover', onmouseover);
      bjork.removeEventListener('mouseout', onmouseout);
      counter++;
    }
    if (counter == 0) {
      button.style.display = 'hidden'; //no bjorks found!
    }
    console.log('Bjorks removed', counter);
  }

  // Log statement to test that the extension loaded properly.
  console.log('York to Bjork extension loaded!');
  console.log('Extension updated');

  //add a button to the header of the page
  const buttonarea = document.getElementsByTagName("header")[0];
  if (buttonarea) { //if there is a header, add the button to it

    // Attach the "click" event to the button
    button.addEventListener('click', () => 
    {
      if (!flag) 
      { //flag tells us if we are Bjorking or De-Bjorking
        button.innerText = 'Click to De-Bjorkify!'
        transformTextNodes(document.body, true).then( function(value) { bjorkIt(); });
        flag = true;  
      }

      else 
      {
        button.innerText = 'Click to Bjorkify!'
        transformTextNodes(document.body, false).then( function(value) { unBjorkIt(); });
        flag = false;     
      }
    })

    buttonarea.appendChild(button); 
  }

}



