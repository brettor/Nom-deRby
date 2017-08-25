//derby name jammerator
//getting blocked on your derby name? need some O?

//add a function to the data input that converts the first letter to uppercase to prevent errors down the line
$(function(){
	console.log('engaged');
	var inputFirstName = '';
	var inputLastName = '';
	var firstArray = [];
	var lastArray = [];
	var outputFirstName = '';
	var outputLastName = '';
	
  $.getJSON("scripts/names.json", function(data){
    console.log(data);
    for (var i = 0; i < data.length; i++) {
    	if (data[i]['First'] != '') {
    		firstArray.push(data[i]['First']);
    	};
    	if (data[i]['Last'] != '') {
    		lastArray.push(data[i]['Last']);
    	};
    };
   	console.log(firstArray);
   	console.log(lastArray);
  });
 
  //on load pull the url after a hash tag
  var urlHash = window.location.hash.substr(1); 
  console.log(urlHash);
  //check if there is actually anything in the hasharea
  if (urlHash != ''){
  	// console.log('not blank url');
  	//splits urlHash at + seperators
  	var hashArray = urlHash.split("+");
  	// console.log(hashArray);
  	//logs the names in to the outputNames variables
  	outputFirstName = hashArray[0];
  	outputLastName = hashArray[1];
  	//calls the displayNames function to display the names containb
  	displayNames(outputFirstName,outputLastName);
  };

  //the generateName() function resets the output variables, stores the value of the inputs in variables, calls the appropriate generation function based on user seleciton, and then calls the display function. It takes no arguments and returns nothing
	function generateName(){
		//check if the user selected name based or random
		// console.log($('#random').is(":checked"));
		outputFirstName = '';
		outputLastName = '';
		inputFirstName = $('#firstName').val();
		inputLastName = $('#lastName').val();
		// console.log(`inputFirst is ${inputFirstName}`);
		// console.log(`inputLast is ${inputLastName}`);
		if ($("#random").is(":checked") == true){
			generateRandom();
		}else{
			generateSimilar();
		};
		console.log(outputFirstName);
		console.log(outputLastName);
		displayNames(outputFirstName,outputLastName);
	};

	//if they selected name based
	function generateSimilar(){
		//check if either box is locked
		if ($('#saveFirst').is(":checked") == true || $('#saveLast').is(":checked") == true){
			console.log('save checked');
			//check if both boxes are locked
			if ($('#saveFirst').is(":checked") == true && $('#saveLast').is(":checked") == true){
				outputFirstName = inputFirstName;
				outputLastName = inputLastName;
			}else if ($('#saveFirst').is(":checked") == true){
				//if first box is locked
				//store locked name in box in a variable
				outputFirstName = inputFirstName;
				//generate similar other name
				outputLastName = getSimilar('last', inputLastName);
			}else{
				//else being if second box is locked 
				outputLastName = inputLastName;
				outputFirstName = getSimilar('first', inputFirstName);
			};
		}else{
			//if box is unlocked
				outputFirstName = getSimilar('first', inputFirstName);
				outputLastName = getSimilar('last', inputLastName);
		}
			
	};

	//if the user selected random
	function generateRandom(){
		console.log('random name')
		//check if either box is locked
		if ($('#saveFirst').is(":checked") == true || $('#saveLast').is(":checked") == true){
			console.log('save checked');
			//check if both boxes are locked
			if ($('#saveFirst').is(":checked") == true && $('#saveLast').is(":checked") == true){
				outputFirstName = inputFirstName;
				outputLastName = inputLastName;
			}else if ($('#saveFirst').is(":checked") == true){
				//if first box is locked
				//store locked name in box in a variable
				outputFirstName = inputFirstName;
				//generate similar other name
				outputLastName = getRandom('last');
			}else{
				//else being if second box is locked 
				outputLastName = inputLastName;
				outputFirstName = getRandom('first');
			};
		}else{
			outputFirstName = getRandom('first');
			outputLastName = getRandom('last');
		};
	};
		
		//if box is locked
			//store locked box in a variable
		//else
			//select a random name from the dataset and store in a vairable

	//get similar selects a similar name from the array, it takes two arguments, the position of the name[first,last] and the name it has to be similar to and it returns one string
	function getSimilar(position, input){
		console.log('getSimilar go!');
		var firstLetter = '';
		var matchArray = [];
		var matchIndex;
					//select a random match from the array of matching names
		if (position == 'first') {
			//error check for input
			if (input != '') {
				//slice the first letter from the name convert to uppercase and store in a variable
				firstLetter = inputFirstName.slice(0,1).toUpperCase();
				//search array for names matching firstLetter and store matches in an array
				matchArray = firstArray.filter(function(name){
					return name.slice(0,1) == firstLetter;
				});
				//select a random index from the array of matches
				matchIndex = Math.floor(Math.random()* matchArray.length);
				//return the random name from the list of matches 
				return matchArray[matchIndex];
			}else{
				//if no input then return a random name
				console.log('no input first');
				return getRandom('first');
			};
		}else if (position == 'last'){
			if (input != '') {
				//slice the first letter from the name convert to uppercase and store in a variable
				firstLetter = inputLastName.slice(0,1).toUpperCase();
				//search array for names matching firstLetter and store matches in an array
				matchArray = lastArray.filter(function(name){
					return name.slice(0,1) == firstLetter;
				});
				//select a random index from the array of matches
				matchIndex = Math.floor(Math.random()* matchArray.length);
				//return the random name from the list of matches 
				return matchArray[matchIndex];
			}else{
				//if no input then return a random name
				console.log('no input last');
				return getRandom('last');
			};
		};
	};
	//get random selects a random name from the array, it takes one argument, the position of the name[first,last] and it returns one string
	function getRandom(position){
		var randomIndex = 0;
		if (position == 'first') {
			randomIndex = Math.floor(Math.random()* firstArray.length);
			return firstArray[randomIndex];
		}else if (position == 'last'){
			randomIndex = Math.floor(Math.random()* lastArray.length);
			return lastArray[randomIndex];
		};
	};
	//displayNames is a function that accepts two strings [displayFirst, displayLast] it outputs the arguments passed to it in to the buttons on the page
	function displayNames(displayFirst,displayLast){
		$('#firstButton').text(displayFirst);
		$('#lastButton').text(displayLast);
		window.location.hash = `${displayFirst}+${displayLast}`;
	}
	
	//when user clicks the submit button run name funciton
	$('form').on('submit', function(event){
		event.preventDefault();
		generateName();
	});
	//if user clicks on first or last name
		//pass the clicked name to the matching input box
		//clear the other box
		//check the locked button
		//run the submit function

   // Twitter pop-up - thanks to webpop.com
    $(function(){
        $('.popup').click(function(event) {
            var width  = 575,
            height = 400,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            url = $(this).attr('href'),
            opts = 'status=1' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
            window.open(url, 'twitter', opts);
            return false; 
        });
    });
    $('a').on('click', function() {
    	 	var tempUrl = encodeURIComponent(window.location.href);
        $(this).attr('href', `http://twitter.com/share?text=My Derby name is: ${outputFirstName} ${outputLastName}, generate your own here!&url=${tempUrl}`);
       
    });
    // grabs the text after the hash in the url

});