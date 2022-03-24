//side bar automation

let sideBar = document.querySelector('.side-bar'),
    homeContent = document.querySelector('.home-content'),
    items = Array.from(document.querySelectorAll('.side-bar .menu a')),
    dropped = document.querySelectorAll('.side-bar .menu'),
    arrowDown = document.querySelector('.side-bar .menu.coll .fa-angle-down'),
    arrowRight = document.querySelector('.side-bar .menu.coll .fa-angle-right');

function minimizeBar(){
    sideBar.classList.remove('active');
    homeContent.classList.remove('active');
}

function maximizeBar(){
    sideBar.classList.add('active');
    homeContent.classList.add('active');
}

function dropItems(){
    for(let i = 3 ; i < 6 ; i++){
        if(dropped[i].className.includes('active')){
            dropped[i].classList.remove('active');
            arrowRight.style.display = "inline-block";
            arrowDown.style.display = "none";
        }else{
            dropped[i].classList.add('active');
            arrowRight.style.display = "none";
            arrowDown.style.display = "inline-block";
        }
    }
}

items.forEach((item , index) =>{
    item.addEventListener('click' , () => {
        if(!sideBar.className.includes('active')){
            if(index == 0 || index == 2){
                maximizeBar();
                arrowRight.style.display = "inline-block";
                arrowDown.style.display = "none";
            }
        }else{
            if(index != 2){
                minimizeBar();
                for(let i = 3 ; i < 6 ; i++){
                    dropped[i].classList.remove('active');
                }
            }else{
                dropItems();
            }
        }
    });
});

//menuBar at 500 px

 let menuBar = document.querySelector('.header .bars');



menuBar.addEventListener('click' , () =>{
    if(!sideBar.className.includes('active')){
        maximizeBar();
        arrowRight.style.display = "inline-block";
        arrowDown.style.display = "none";
    }else{
        minimizeBar();
        for(let i = 3 ; i < 6 ; i++){
            dropped[i].classList.remove('active');
        }
    }
});

//Home section design

let sildeContainer = document.querySelector('.home-content .slide'),
    images = Array.from(document.querySelectorAll('.home-content .slide .slider img')),
    slider = document.querySelector('.home-content .slide .slider'),
    circles = document.querySelectorAll('.home-content .slide .circles .circle');

let isDragging = false, 
    startPos = 0,
    currentPos = 0,
    currentTranslate = 0,
    previousTranslate = 0,
    currentIndex = 0,
    animationID = 0,
    length = images.length;

function animateCircles(currIndex){
    for(let i = 0 ; i <= length -1 ; i++)
        circles[i].className = 'circle';
    
    circles[currIndex].classList.add('active');
}

images.forEach((image , index) =>{
    image.addEventListener('touchstart' , touchStart(index));
    image.addEventListener('touchmove' , touchMove);
    image.addEventListener('touchend' , touchEnd);
});

//touch start event
function touchStart(index){
    return function(event){
        isDragging = true;
        currentIndex = index;
        startPos = getPosition(event); 
        animationID = requestAnimationFrame(animation);
    }
} 

function getPosition(event){
    return event.touches[0].clientX;
}

function animation(){
    setPosition();

    if(isDragging)
        requestAnimationFrame(animation);
}

function setPosition(){
    slider.style.transform = `translateX(${currentTranslate}px)`;
}

//touch move event
function touchMove(event){
    if(isDragging){
        currentPos = getPosition(event);
        currentTranslate = previousTranslate + currentPos - startPos;
    }
}

//touch end event
function touchEnd(){
    isDragging = false;
    cancelAnimationFrame(animationID);

    let movedBy = currentTranslate - previousTranslate;
    if(movedBy > 70 && currentIndex > 0)
        currentIndex--;
    if(movedBy < -70 && currentIndex < length -1)
        currentIndex++;

    setPositionByIndex();

    animateCircles(currentIndex);
}

function setPositionByIndex(){
    currentTranslate = currentIndex * -window.innerWidth;
    previousTranslate = currentTranslate;

    setPosition();
}

//get the image by clicking circles
Array.from(circles).forEach((cir , index) =>{
    cir.addEventListener('click' , getPic(index));
});

function getPic(index){
    return function(){
        currentIndex = index;  
        setPositionByIndex();
        animateCircles(currentIndex);
    }
}

//get the pic with time intervals
function getPicWithTime(){
    if(currentIndex == 3)
        currentIndex = -1;
    currentIndex++;
    setPositionByIndex();
    animateCircles(currentIndex);
}

setInterval( getPicWithTime , 5000);

// get the photoes of images while hovering to it


//there is aproblem with focus event

let cards = Array.from(document.querySelectorAll('.home-content .collection .card')),
    photoes = Array.from(document.querySelectorAll('.home-content .collection .card .images img')),
    photoslider = document.querySelectorAll('.home-content .collection .card .images');

let currentTranslation = 0,
    timerID = 0,
    executed = false;

cards.forEach((card , index) =>{
    card.addEventListener('mouseover' , getphotoes(index));
    card.addEventListener('mouseout' , stoptimer(index));

    card.addEventListener('touchstart' , getphotoes(index));
    card.addEventListener('touchend' , stoptimer2(index));
});


function getphotoes(sliderIndex){
    return function(){
        if(!executed){
            let currentphoto = 0;
            getFirstImage();
            timerID = setInterval(() => {
                if (currentphoto < 4)
                    currentphoto++;
                else
                    currentphoto = 0;

                setPositionByindexnew(currentphoto , sliderIndex);
                circlesAnimation(currentphoto , sliderIndex);
            }, 2000);
            executed = true;
        }
    }
}

function stoptimer(sliderIndex){
    return function(e){
        if(e.relatedTarget.className == 'collection' || e.relatedTarget.className == 'men' || e.relatedTarget.className == 'header' || e.relatedTarget == null){
        clearInterval(timerID);
        executed = false;
        getFirstImage();
        circlesAnimation(0 , sliderIndex);
        }
    }
}

function getFirstImage(){
    for(let i = 0 ; i < cards.length ; i++)
        photoslider[i].style.transform = `translateX(0)`;
}

function stoptimer2(sliderIndex){
    return function(){
        clearInterval(timerID);
        executed = false;
        photoslider[sliderIndex].style.transform = `translateX(0)`;
        circlesAnimation(0 , sliderIndex);    
    }
}

function setPositionByindexnew(index , sliderIndex){
    currentTranslation = index * -cards[0].clientWidth;

    photoslider[sliderIndex].style.transform = `translateX(${currentTranslation}px)`;
}  

function circlesAnimation(index , sliderIndex){
    let imageCircles = cards[sliderIndex].querySelectorAll('.words .circle');

    for(let i = 0 ; i <= 4 ; i++)
        imageCircles[i].className = 'circle';

    imageCircles[index].classList.add('activeted');
}

//dark theme styling
let mode = document.querySelector('.header .mode'),
    body = document.body;

let theme = "";

mode.addEventListener('click' , changeMode);

function changeMode(){
    if(body.className.includes('dark-theme')){
        body.classList.remove('dark-theme');
        theme = "light";
    }else{
        body.classList.add('dark-theme');  
        theme = "dark";
    }
    localStorage.setItem('theme', theme);
}

//storage the theme with localStorage
window.addEventListener('load' , ()=>{
    if(localStorage.getItem('theme') == 'light')
        body.className = "";
    else
        body.className = "dark-theme";
});

