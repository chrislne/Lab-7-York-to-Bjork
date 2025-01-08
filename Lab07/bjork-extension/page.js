const mydomain = window.location.hostname.split('.');

/**
 * We will only use this extension if the domain name includes 'yorku'!
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

  /** The function below you must complete, and it should be ... recursive!!
   * Some of the work has been done for you.
   * 
   * Your completed function should:
   * 
   * 1. Determine if the node received is one containing text (i.e. if its nodeType == Node.TEXT_NODE)
   * 2. If yes we will:
   * -- Wrap the node in a span of class 'bjork', if needed (this has been written for you).
   * -- Access the value of the node's `textContent' attribute.
   * -- Create an array of words by splitting this text content around white space characters (" ").
   * -- Iterate over the array of words. If the page is to be BJORKIFIED, search for words
   * that are keys in the the "BJORK" dictionary variable.  If you are to UNBJORK a page,
   * search for words that are keys in the the "UNBJORK" dictionary variable.
   * -- Each time you encounter a word in the BJORK (or UNBJORK) dictionary, **replace** 
   * it with the corresponding **value** in the dictionary above in your array.
   * -- When you are done, join all of the words in your array using the 'join' function to 
   * create a string, and make the text content of the node equal to this string.
   * 3. THEN, iterate over every CHILD of the input node and **recursively** call 'transformTextNodes' on 
   * each of these children!!
   
   * @param {Object} node, the node to change the text within.
   * @param {boolean} type, true if we are to turn YORK to BJORK (BJORKIFY), 
   * false if we are to turn BJORK to YORK (UNBJORKIFY). 
   */
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

      // WRITE CODE HERE TO:
      // -- Access the words in the nodes 'textContent'.
      // -- Search for words that are keys in the the "words" dictionary variable. 
      // -- Replace words that are keys with the corresponding words that are **values**. 
      // -- Then, replace the nodes 'textContent' with your adjusted string.

      let alltext = node.textContent;
      let strings = alltext.split(" ");

      for (var i = 0; i < strings.length; i++)
      {
        if (words.hasOwnProperty(strings[i]))
        {
          strings[i] = words[strings[i]];
        }
      }

      node.textContent = strings.join(" ");
    }

    // WRITE CODE HERE TO:
    // -- Access the children of the node
    // -- Call textTransform recursively on all of these children.
    node.childNodes.forEach(child => transformTextNodes(child, type));
  }


   /** onmouseover. This will NOT be a recursive function.
   * 
   * Your function should:
   * 1. Locate the DOM element that triggered the event (you can use event.currentTarget for this).
   * 2. Change the background image of this DOM element to the image stored in the BG variable.
   * 3. Change the opacity of the DOM element to 0.8.
   * 
   * @param {Object} event, the mouse event triggering the function
   */
   function onmouseover(event)
   {
    // WRITE YOUR CODE HERE!
    const target = event.currentTarget();
    target.style.cursor = "url('assests/bjork-cursor.gif'), auto";
    target.style.opacity = 0.8;
  }

    /** onmouseout. This will NOT be a recursive function.
   * 
   * Your function should:
   * 1. Locate the DOM element that triggered the event (you can use event.currentTarget for this).
   * 2. Change the background image of this DOM element to nothing ('').
   * 3. Change the opacity of the DOM element to nothing ('').
   * 
   * @param {Object} event, the mouse event triggering the function
   */
  function onmouseout(event)
  {
    // WRITE YOUR CODE HERE!
    const target = event.currentTarget();
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



