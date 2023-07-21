const imgWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");

/***************************************ABOUT API****************************************/
// api key
const apiKey = "FxdhBTu5tZkSczqAvVgOMQuCvUgbuP3xd9xGi78c2dsjSD9mK5xnwGCp";
// sayfaya gelecek fotoğraf sayısı
const perPage = 12;
// "load more" butonuna tıkladığımda gelecek olan sayfa sayısı
let currentPage = 1;

const generateHTML = (images) => {
    imgWrapper.innerHTML += images.map(img =>
        `<li class="list-none mb-4 border rounded group relative flex">
        <img class="w-full cursor-pointer" src="${img.src.original}" alt="img">
        <div
          class="absolute bottom-0 bg-gradient-to-t from-slate-500 invisible group-hover:visible group-hover:ease-in duration-500 w-full px-3 py-3 flex items-center justify-between">
          <div class="text-amber-50">
            <i class="fa-solid fa-camera text-xl mr-1.1" style="color: #893c21;"></i>
            <span class="text-lg">${img.photographer}</span>
          </div>
          <button class="px-1 py-1 text-xl bg-amber-50 border rounded"><i class="fa-solid fa-download"
              style="color: #893c21;"></i></button>
        </div>
      </li>`
    ).join("");
}

const getImages = (apiURL) => {
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        console.log(data);
        generateHTML(data.photos);
    })
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
/***************************************ABOUT API****************************************/

loadMoreBtn.addEventListener("click", loadMoreImages);


// let openModal = () => {
//     // console.log("başarılı");
//     document.getElementById("myModal").style.display = "block";
// }

// let closeModal = () => {
//     document.getElementById("myModal").style.display = "none";
// }

// let lightBoxIndex = 1;
// showLightBox(lightBoxIndex);

// let plusLightBox = (n) => {
//     showLightBox(lightBoxIndex += n);
// }

// let currentLightBox = (n) => {
//     showLightBox(lightBoxIndex = n);
// }

// let showLightBox = (n) => {
//     let i;
//     let boxex = document.getElementsByClassName("myBoxex");
//     if (n > boxex.length) { lightBoxIndex = 1 }
//     if (n < 1) { lightBoxIndex = boxex.length }
//     for (i = 0; i < boxex.length; i++) {
//         boxex[i].style.display="none";
//     }
//     boxex[lightBoxIndex-1].style.display = "block";
// }