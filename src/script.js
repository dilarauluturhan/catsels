const imgWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input")

/***************************************ABOUT API****************************************/
// api key
const apiKey = "FxdhBTu5tZkSczqAvVgOMQuCvUgbuP3xd9xGi78c2dsjSD9mK5xnwGCp";
// sayfaya gelecek fotoğraf sayısı
const perPage = 12;
// "load more" butonuna tıkladığımda gelecek olan sayfa sayısı
let currentPage = 1;
// search'ün başlangıç değeri null
let searchTerm = null;

const downloadImg = (imgURL) => {
    // console.log(imgURL);
    fetch(imgURL).then(res => res.blob()).then(file => {
        // console.log(file)
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

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
          <button onclick="downloadImg('${img.src.original}')" class="px-1 py-1 text-xl bg-amber-50 border rounded"><i class="fa-solid fa-download"
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
    }).catch(() => alert("Failed to load images!"));
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // 400 bad request(tarayıcının gönderdiği istek geçersiz) => search'te aramayı silip enter'a basınca bu hatayı aldım
    if (e.target.value === "") return searchTerm = null;
    if (e.key === "Enter") {
        // console.log("Enter'a basıldı!");
        currentPage = 1;
        searchTerm = e.target.value;
        imgWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollPosition + windowHeight >= documentHeight - 100) {
        loadMoreImages();
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
/***************************************ABOUT API****************************************/

// loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
window.addEventListener("scroll", handleScroll);