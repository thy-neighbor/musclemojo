'use strict'

const wgerApiKey='6ad1d1db9b0607d006ae6fb8cb0cfdc584612600';
const wgerExerciseEndpoint='https://wger.de/api/v2/exercise/';
const wgerMuscleEndpoint='https://wger.de/api/v2/muscle/';
//GIPHY
const giphyApiKey='UnCdyM9ShwqrX4qAOYTxTxf4UNMlealT';
const giphyEndpoint='https://api.giphy.com/v1/gifs/';

function mainFunction(){

  generatePageOne();    //generates the intro page
  //generatePageTwo();  

  onClickSubmit(); //random testing button to get data and understand it

  onClickExercise();  //event when an exercise is clicked, pop out screen

  onClickExitExercise();  //exit pop out screen

  onClickStart(); //start button on page one, simple navigation

  onKeypressExercise();

}
$(mainFunction);

//generates the intro page
function generatePageOne(){
  $('#row-one').html(`
    <div id=intro class="col-12">
    <h2>Welcome to Muscle Mojo!</h2>
    <p>The site where you select your desired muscle groups to target and learn what exercises work the best for your routine!</p>
    <img src="Flexing.png" alt="muscle man">
    <p>WARNING! All of the suggested exercises are user logged, therefore some are in German or incomplete :)</p>
    <!--<button id="start-button">Start</button>-->
    <button id="start-button" class="button" >
      Start
      <div class="button__horizontal"></div>
      <div class="button__vertical"></div>
    </button>
    </div>
    `);
}

//start button on page one, simple navigation
function onClickStart(){
  $('main').on('click','#start-button',function(){
    console.log('Start Button Pressed');
    generatePageTwo();
  });
}


//generates the page two
function generatePageTwo(){
  $('#intro').remove();
  $('#row-one').html(`
      <div class="col-4">
        <div id="muscle-image"></div> 
      </div>
    `);
  getDataFromApi(wgerMuscleEndpoint,wgerMuscleCallBack);
  //generateMuscleList(data.results);  
}

// get data from api, custom fit for wger data at the moment
function getDataFromApi(endpoint,callback){

    const params={
      key: "value"
    }

  $.getJSON(endpoint,params,callback);

}


/*******************************************************************
 * MUSCLE FUNCTIONS
 * 
 * wgerMuscleCallBack(data) // muscle callback function to initiate the muscle list compilations
 * 
 * generateMuscleList(results) //generates the muscle list dynamically
 * 
 * function muscleListOnHover(results) //image event when an item on the list is hovered over
 *
 * function onClickSubmit()    //muscle list form submit
 *
 * 
 ********************************************************/


// muscle callback function to initiate the muscle list compilations
function wgerMuscleCallBack(data){
  console.log('wgerCallBackSuccess ran');
  console.log(data);
  generateMuscleList(data.results);
  
}

//generates the muscle list dynamically
function generateMuscleList(results){

  let htmlCodeToAppendFront=[];
  let htmlCodeToAppendBack=[];

  $('#row-one.col-4').append(`
    <div id="muscle-image"></div>     
    `);

  for(let i=0;i<results.length;i++){
    if(results[i].is_front){
      htmlCodeToAppendFront.push(`
      <li id=${results[i].id}>
        <input type="checkbox" class="styled-checkbox" id="${results[i].name}" data-id="${results[i].id}" name="muscle" value="${results[i].name}" >
        <label for="${results[i].name}">${results[i].name}</label>
      </li>`);

    }else if(!results[i].is_front){
      htmlCodeToAppendBack.push(`
      <li id=${results[i].id}>
        <input type="checkbox" class="styled-checkbox" id="${results[i].name}" data-id="${results[i].id}" name="muscle" value="${results[i].name}" >
        <label for="${results[i].name}">${results[i].name}</label>
      </li>`);

    }else{
      console.log('`htmlCodeToAppend` ERROR---->Data <li value='+results[i].id+'>'+results[i].name+'</li>');
    }
  }

  $('#row-one').append(`
      <div class="col-4">
        <form id="muscle-form">
        <legend>
          <h2>Choose muscles</h2>
          <p>Select up to 3 for most precise results</p>
        </legend>
          <ul id="js-muscle-list">
            <li>Front
              <ul id="front-muscle-list"></ul>
            </li>
            <li>Back
              <ul id="back-muscle-list"></ul>
            </li>
          </ul>
          <button id="muscle-button" type="submit">Submit</button>
        <form>
      </div>`);
  $('#front-muscle-list').append(htmlCodeToAppendFront);
  $('#back-muscle-list').append(htmlCodeToAppendBack);
  

  muscleListOnHover(results);

}

//image event when an item on the list is hovered over
function muscleListOnHover(results){
  results.forEach(function(item){
    $(`li[id='${item.id}']`).hover(function(){//mouseOver event
      if(item.is_front){
        $('#muscle-image').css("background-image",`url(https://wger.de/static/images/muscles/main/muscle-${item.id}.svg), 
        url(https://wger.de/static/images/muscles/muscular_system_front.svg)`);        
      }else if(!item.is_front){
        $('#muscle-image').css("background-image",`url(https://wger.de/static/images/muscles/main/muscle-${item.id}.svg), 
        url(https://wger.de/static/images/muscles/muscular_system_back.svg)`); 
      }
    },function(){//mouseleave event
      $('#muscle-image').css("background-image",`
      url(https://wger.de/static/images/muscles/muscular_system_front.svg)`);
    });
  });

}

//muscle list form submit
function onClickSubmit(){
  $('main').on('submit','#muscle-form','#muscle-button',function(event){
    $()
    event.preventDefault();
    console.log($('input[name="muscle"]'));
    let answers=$('input[name="muscle"]').filter(function(){
      if(this.checked){
        return(true);
      }else{
        return(false);
      }

    });

    console.log(answers);

    //get the data numbers
    let dataName = $("input:checkbox:checked").map(function () {
      return $(this).data('id')
  }).get();

  console.log(dataName);    
  findExerciseMatch(dataName);  
  });
}
/*******************************************************************
 * EXERCISE LIST FUNCTIONS
 * 
 * function findExerciseMatch(dataName) //find the exercises that target the selected muscles(dataName variable)
 * 
 * function renderExercises(ratingArr,maxMuscleNum) //render exercise list 
 * 
 * function onClickExercise() //exercise item onClick events
 *
 * function onClickExitExercise() //exit exercise pop out
 *
 * function renderExercisePage() //shows pop out information for the 
 * 
 ********************************************************/
//find the exercises that target the selected muscles(dataName variable)
function findExerciseMatch(dataName){


  let ratingArray=[];
  let exerciseArray=[];
  let arr=[];

  data.forEach(function(exercise){ 
    exercise.results.forEach(function(e){ 
        
        let obj={exercise:e};
        exerciseArray.push(e);
        let rating=0;
        
        //for each of the input id's selected by user corresponding to muscles (i.e. muscleId)
        dataName.forEach(function(muscleId){
          //two cases:
          //if the muscle is found in the exercise's muscle array add 1
          //else if the muslce is found in the exercise's secondary muscle array add 1
          //else keep rating the same
          if(e.muscles.indexOf(muscleId)>=0){
            rating++;
          }else if(e.muscles_secondary.indexOf(muscleId)>=0){
            rating++;
          }
          
        });
        obj.rating=rating;
        arr.push(obj);
        ratingArray.push(rating);
         
    }) 

  })
  console.log(arr);
  console.log(ratingArray);
  console.log(exerciseArray);

  renderExercises(arr,dataName.length);

}


//render exercise list  
function renderExercises(ratingArr,maxMuscleNum){

  let html=[];

  $('#exercise-section').remove();
  $('#row-one').append(`
  <!--Exercise Section-->
  <div class="col-4" id=exercise-section>
  <h2>Target Area Exercises</h2>
  <p>Red: Targets every selected muscle</p>
  <ul id="exercise-list"></ul>
  </div>`
  );


  ratingArr.sort(function(a,b){
    return(-(a.rating-b.rating));//descending order
  });

  console.log(ratingArr);


  for(let i=0;i<10;i++){  //show the best match only
    console.log(ratingArr[i]);
    if(ratingArr[i].rating===maxMuscleNum){
      html.push(`<li class="exercise red" data-description="${ratingArr[i].exercise.description}" tabindex="${i+1}">${ratingArr[i].exercise.name}</li>`);
      continue;
    }else if((ratingArr[i].rating<maxMuscleNum)&&(ratingArr[i].rating>0)){
      html.push(`<li class="exercise" data-description="${ratingArr[i].exercise.description}" tabindex="${i+1}">${ratingArr[i].exercise.name}</li>`);
    }
    
  }

  $('#exercise-list').append(html);

}

//exercise item onClick events
function onClickExercise(){   //nodal comes up
  $('main').on('click','.exercise',function(){
    let exerciseName=$(this).text();
    let description=$(this).data("description");
    console.log($(this).text());
    $.get(`https://api.giphy.com/v1/gifs/search?q=${$(this).text()}&tag=workout&api_key=${giphyApiKey}&limit=5`,function(result){
      $('#exercise-page .giph').html(`<iframe src="${result.data[0].embed_url}" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`);
      $('#exercise-page .description').html(`
      <h1>${exerciseName}</h1>
      ${description}
      <a href="https://www.youtube.com/results?search_query=${exerciseName}+workout" target="_blank" role="link">Youtube Search Exercise</a>
      `);
      console.log(result);
      renderExercisePage();
    });
  });
}

function onKeypressExercise(){
  $(document).keydown(function(e){
      if(e.keyCode === 13){
              console.log(document.activeElement);
              $(document.activeElement).click();
              $('#start-buttton').click();
       }  
  });
}

function onClickExitExercise(){
  $('.fa-times').on('click',function(){
    renderExercisePage();
  });
}

//shows pop out information for the 
function renderExercisePage(){
  $('#exercise-page').toggleClass('show')
  
}