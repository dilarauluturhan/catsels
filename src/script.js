const imgWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".fa-xmark");
const downloadImgBtn = lightBox.querySelector(".fa-download");

// api key
const apiKey = "FxdhBTu5tZkSczqAvVgOMQuCvUgbuP3xd9xGi78c2dsjSD9mK5xnwGCp";
// sayfaya gelecek fotoğraf sayısı
const perPage = 12;
// inifinite scroll yaptığımda gelecek olan sayfa sayısı
let currentPage = 1;
// search'ün başlangıç değeri null
let searchTerm = null;

const downloadImg = (imgURL) => {
    fetch(imgURL) // belirtilen resim URL'ine istek gönderir ve resmi alır
        .then(res => res.blob()) // isteğin sonucunu blob(binary large object) olarak alır
        .then(file => { // file, alınan resmi temsil eden blob nesnesi
            const a = document.createElement("a"); // a elementi indirmeyi temsil eder
            a.href = URL.createObjectURL(file); // a elementinin href özelliğine alınan resmin blob URL'ini ekler böylece indirme bağlantısı oluşur
            // a.download = new Date().getTime(): "a" elementinin "download" özelliğine yeni bir indirme dosya adı atanır
            // burada dosya adı ve geçerli zamanı kullanarak oluşturulur, bu indirilen resme bir dosya adı sağlar
            a.download = new Date().getTime();
            a.click(); // indirme işlemini tetikler
        }).catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img); // butona tıkladığımızda indirelecek resmin URL'ini tutar
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden"; // lightbox açıldığında kaydırma etkileşimi engellenir
}

const hideLigthbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

// alınan resimleri kullanarak listeleme yapan html içeriğini oluşturur
const generateHTML = (images) => {
    // images alınan resimleri temsil eder
    // imgWrapper, sayfada resimlerin listeleneceği bir HTML elementine erişim sağlayan bir değişken
    imgWrapper.innerHTML += images.map(img =>
        // her resim için <li> ögesi
        `<li onclick="showLightbox('${img.photographer}','${img.src.original}')" class="list-none mb-4 border rounded group relative flex">
        <img class="cursor-pointer" src="${img.src.original}" alt="img" loading="lazy">
        <div
          class="absolute bottom-0 bg-gradient-to-t from-slate-500 invisible group-hover:visible group-hover:ease-in duration-500 w-full px-3 py-3 flex items-center justify-between">
          <div class="text-amber-50">
            <i class="fa-solid fa-camera text-xl mr-1.1 text-zinc-900"></i>
            <span class="text-lg">${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.original}');event.stopPropagation();" class="px-1 py-1 text-xl bg-amber-50 text-zinc-900 border rounded"><i class="fa-solid fa-download"
            ></i></button>
        </div>
      </li>`
    ).join("");
}

// apiURL'ine fetch API kullanarak istek atıyoruz
const getImages = (apiURL) => {
    fetch(apiURL, {
        // API anahtarını Authorization başlığı altında gönderiyoruz
        // böylece API istekleri doğrulayabilir ve yetkilendirme yapabilir
        headers: { Authorization: apiKey }
    })
        .then(res => res.json()) // istek sonucunu json formatında alıyoruz
        .then(data => {
            // alınan JSON verilerini işleyen bir fonksiyonu çağırıyoruz
            // burada verileri "data" değişkenine atayarak generateHTML fonksiyonuna gönderiyoruz
            console.log(data);
            generateHTML(data.photos);
        }).catch(() => alert("Failed to load images!")); // istek başarısız olursa...
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`; // varsayılan olarak "curated" kategorisinden resimleri alır
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL; // kullanıcı arama yaptıysa farklı bir URL gelir yapmadıysa mevcut URL kalır
    getImages(apiURL); // getImages'le apiURL'e istek atıyoruz bu istek yeni resimleri alarak mevcut sayfaya ekler
}

const loadSearchImages = (e) => {
    // 400 bad request(tarayıcının gönderdiği istek geçersiz) => search'te aramayı silip enter'a basınca bu hatayı aldım
    // eğer arama kutusu boş ise searchTerm'i null yaparak arama sorgusunu temizliyoruz
    if (e.target.value === "") return searchTerm = null;
    if (e.key === "Enter") {
        currentPage = 1; // eğer kullanıcı Enter'a bastıysa sayfa numarasını sıfırlıyoruz çünkü yeni bir aramaya ilk sayfadan başlıcaz
        searchTerm = e.target.value; // searchTerm'i kullanıcının arama kutusuna yazdığı değerle güncelliyoruz 
        imgWrapper.innerHTML = ""; // yeni arama sonuçları geldiğinde eski resimlerin üzerine eklenmemesi için
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

const handleScroll = () => {
    const scrollPosition = window.scrollY; // sayfanın mevcut kaydırma pozisyonu
    const windowHeight = window.innerHeight; // tarayıcıda görünen pencerenin yüksekliği
    const documentHeight = document.documentElement.scrollHeight; // sayfanın toplam yükseliği(içeriğin uzunluğu)
    // sayfanın alt kısmına 100px kala yaklaştıysak daha fazla resim yüklemek için loadMoreImages(); çağırılsın 
    if (scrollPosition + windowHeight >= documentHeight - 100) {
        loadMoreImages();
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`); //bu fonk API ile resimleri almak için

searchInput.addEventListener("keyup", loadSearchImages);
window.addEventListener("scroll", handleScroll);
closeBtn.addEventListener("click", hideLigthbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img)); // indirmek için resim URL'ini kullanır