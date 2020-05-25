document.querySelector('.app-btn__category').onclick = showList;
document.querySelector('.app-btn__chosen').onclick = showChosenImage;
let outputField = document.querySelector('.app-body');
let list = document.querySelector('.app-list');
let con = 0;

function showList () {  
    fetch('https://json.medrating.org/users')    
    .then(response => response.json())
    .then(data => {
        if (!data[con].name) {
            return false;
        }               
        outputField.innerHTML += `<h3 class="app-body__item1"><details><summary>${data[con].name}<summary></details></h3>`    
    })
    .then(() => fetch(`https://json.medrating.org/albums?userId=3`))
    .then(response =>  response.json())
    .then(data => {
        outputField.innerHTML += `<div class="app-body__item2 app-body__modal_hide"><details><summary>${data[con].title}<summary></details><div>`
    })
    .then(() => fetch(`https://json.medrating.org/photos?albumId=2`))
    .then(response => response.json())
    .then(data => {
        outputField.innerHTML += `<details class="app-body__modal_hide app-body__item3"><summary>${data[con].title}</summary>
        <span class="app-body__star"><i class="far fa-star"></i></span><img class="app-body__image" src="${data[con].thumbnailUrl}">
        <span class="app-body__star"><i class="far fa-star"></i></span><img class="app-body__image app-body__image_large" src="${data[con].url}">
        </details>`
        con++;

        document.querySelectorAll('.app-body__item1').forEach((item) => {            
            item.onclick = toggleAlbum;
        })  

        document.querySelectorAll('.app-body__item2').forEach((item) => {            
            item.onclick = toggleImage;
        })   

        document.querySelectorAll('.app-body__star').forEach((item) => {            
            item.onclick = storeImage;
        })    
        document.querySelectorAll('.app-body__image').forEach((item) => {
            item.onclick = zoomImage;
            item.onmouseover = zoomInTitle;
            item.onmouseout = zoomOutTitle;
            })
        }) 
    .catch((err) => {
        console.log('Чёт не то, ошибка : ' + err);
    })   
}

function storeImage () {
    let star = this.children[0];  
    let images;    
    star.classList.toggle('app-body__star_yellow');    
    if (star.classList.contains('app-body__star_yellow')) {
        if (localStorage.getItem('image') === null) {
            images = [];
        }
        else {
            images = JSON.parse(localStorage.getItem('image'));
        }
        images.push(this.nextElementSibling.src);
        localStorage.setItem('image', JSON.stringify(images));    
    }    
}

function zoomImage () {
    let modal = document.querySelector('.app-body__modal');
    this.classList.add('app-body__image_effect');
    modal.classList.remove('app-body__modal_hide');
    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.add('app-body__modal_hide'); 
            this.classList.remove('app-body__image_effect');  
        }
    })   
}

function toggleAlbum () {
    this.nextElementSibling.classList.toggle('app-body__modal_hide');
}

function toggleImage () {
    this.nextElementSibling.classList.toggle('app-body__modal_hide'); 
}

function zoomInTitle () {
    if (this.classList.contains('app-body__image_effect')) {
        return false;
    }
    else {
        this.parentNode.firstChild.classList.add('app-body__title_effect');
    }
}

function zoomOutTitle () {
    setTimeout(() => {
        this.parentNode.firstChild.classList.remove('app-body__title_effect');
    },800);
}

function showChosenImage () {    
    let images;
    if (localStorage.getItem('image') === null) {
        return false;        
    }
    else {
        list.innerHTML = '';
        images = JSON.parse(localStorage.getItem('image'));
        images.forEach((item) => {       
            let imageDiv = document.createElement('div');
            let star = document.createElement('span');
            star.classList.add('app-body__star1');
            let i = document.createElement('i');
            star.appendChild(i);
            i.classList.add('far', 'fa-star', 'app-body__star_yellow');
            imageDiv.classList.add('app-list__div');        
            let newImg = document.createElement('img');          
            newImg.src = item;
            newImg.classList.add('app-list__image', 'app-body__image_large');
            imageDiv.appendChild(star);
            imageDiv.appendChild(newImg);        
            list.appendChild(imageDiv);
        })
    }
    document.querySelectorAll('.app-body__star1').forEach((item) => {            
        item.onclick = deleteChosenImage;
        item.nextSibling.onclick = zoomImage;
    })    
}

function deleteChosenImage () {   
    let images; 
    if (localStorage.getItem('image') === null) {
        return false;        
    }
    else {
        images = JSON.parse(localStorage.getItem('image'));
        images.splice(images, 1);
        localStorage.setItem("image", JSON.stringify(images));
        this.parentNode.remove();
    }
}

