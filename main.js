'use strict'

const wgerApiKey='6ad1d1db9b0607d006ae6fb8cb0cfdc584612600';
const wgerExerciseEndpoint='https://wger.de/api/v2/exercise/';
const wgerMuscleEndpoint='https://wger.de/api/v2/muscle/';
//GIPHY
const giphyApiKey='UnCdyM9ShwqrX4qAOYTxTxf4UNMlealT';
const giphyEndpoint='https://api.giphy.com/v1/gifs/';

function mainFunction(){

  getDataFromApi(wgerMuscleEndpoint,wgerMuscleCallBack);

  onClickSubmit(); //random testing button to get data and understand it

  onClickExercise();

  onClickExitExercise();
}
$(mainFunction);



function getDataFromApi(endpoint,callback){

    const params={
      key: "value"
    }

  $.getJSON(endpoint,params,callback);

}


/*******************************************************************
 * MUSCLE FUNCTIONS
 * 
 * wgerMuscleCallBack(data)
 * 
 * generateMuscleList(results)
 * 
 * function muscleListOnHover()
 * 
 ********************************************************/
/*const allData=[];
window.allData=allData;
*/
//allData.push(data);



function wgerMuscleCallBack(data){
  console.log('wgerCallBackSuccess ran');
  console.log(data);
  generateMuscleList(data.results);
  
}

function generateMuscleList(results){

  let htmlCodeToAppendFront=[];
  let htmlCodeToAppendBack=[];

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
        <legend><h2>Choose 3 muscles</h2></legend>
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
  

  //muscleListOnHover(results);

}


function muscleListOnHover(results){
  results.forEach(function(item){
    $(`li[id='${item.id}']`).hover(function(){//mouseOver event
      //$(this).css({"color":"yellow","font-size":"125%"});
      if(item.is_front){
        $('#muscle-image').css("background-image",`url(https://wger.de/static/images/muscles/main/muscle-${item.id}.svg), 
        url(https://wger.de/static/images/muscles/muscular_system_front.svg)`);        
      }else if(!item.is_front){
        $('#muscle-image').css("background-image",`url(https://wger.de/static/images/muscles/main/muscle-${item.id}.svg), 
        url(https://wger.de/static/images/muscles/muscular_system_back.svg)`); 
      }
    },function(){//mouseleave event
      //$(this).css({"color":"black","font-size":"100%"});
      $('#muscle-image').css("background-image",`
      url(https://wger.de/static/images/muscles/muscular_system_front.svg)`);
    });
  });

}


function onClickSubmit(){
  $('main').on('submit','#muscle-form','#muscle-button',function(event){
    event.preventDefault();
    console.log($('input[name="muscle"]'));
    //console.log($('#muscle-list').children('ul'));
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

function findExerciseMatch(dataName){

//loop through muscle and muscle secondary and see if each element is inside dataname 
//dataName  dataname.indexOf(element) > -1
//and add matchs to an array specifying type 3 2 or 1  

  let ratingArray=[];
  let exerciseArray=[];
  let arr=[];

  data.forEach(function(exercise){ 
    exercise.results.forEach(function(e){ 
        //console.log(e.name,e.muscles,e.muscles_secondary)
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
  
function renderExercises(ratingArr,maxMuscleNum){

  let html=[];

  $('#exercise-section').empty();
  $('#row-one').append(`<div class="col-4" id=exercise-section>
  <h2>Target Area Exercises</h2>
  <ul id="exercise-list"></ul>
  </div>`
  );


  ratingArr.sort(function(a,b){
    return(-(a.rating-b.rating));//descending order
  });

  console.log(ratingArr);


  for(let i=0;i<20;i++){  //show the best match only
    console.log(ratingArr[i]);
    if(ratingArr[i].rating===maxMuscleNum){
      html.push(`<li class="exercise red" data-description="${ratingArr[i].exercise.description}">${ratingArr[i].exercise.name}</li>`);
      continue;
    }else if((ratingArr[i].rating<maxMuscleNum)&&(ratingArr[i].rating>0)){
      html.push(`<li class="exercise" data-description="${ratingArr[i].exercise.description}">${ratingArr[i].exercise.name}</li>`);
    }
    
  }

  $('#exercise-list').append(html);

}

function onClickExercise(){   //nodal comes up
  $('main').on('click','.exercise',function(){
    let exerciseName=$(this).text();
    let description=$(this).data("description");
    console.log($(this).text());
    $.get(`http://api.giphy.com/v1/gifs/search?q=${$(this).text()}&tag=workout&api_key=${giphyApiKey}&limit=5`,function(result){
      $('#exercise-page .giph').html(`<iframe src="${result.data[0].embed_url}" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`);
      $('#exercise-page .description').html(`
      <h1>${exerciseName}</h1>
      ${description}
      `);
      console.log(result);
      renderExercisePage();
    });
    //$.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5");
  });

}

function onClickExitExercise(){
  $('.fa-times').on('click',function(){
    renderExercisePage();
  });
}

function renderExercisePage(){
  $('#exercise-page').toggleClass('show')
  
}