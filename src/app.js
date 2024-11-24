
const productsWrapper = document.querySelector(".products-wrapper");
const productDetailsWrapper = document.querySelector(".product-details-wrapper");

const addedProductWrapper = document.querySelector(".added-products");
const cartCloseBtn = document.querySelector(".cart-close-btn");
const cartOpenBtn = document.querySelector(".cart-open-btn");
const cartModal = document.querySelector(".modal");
const cartCounter = document.querySelector(".cart-count");






function getProducts(endPoints) {
    if (endPoints == "") {
        fetch(`https://sk-fahim-hossain.github.io/host_api/products.json`)
            .then(res => {
                if (!res.ok) throw new Error("Something went wrong..!")
                return res.json()
            }).then(data => {
               
                renderProducts(data, endPoints)
                loadingLocalData(data)
              
            })
            .catch(error => renderError(error))
    } 
}

getProducts('')




function currencyFormateder(price) {
    return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    })
}





function renderProducts(products, category) {
    products.forEach(product => {
        const html = `
                <div class="product w-96 lg:w-86  h-auto overflow-hidden bg-white/75 backdrop-blur-lg mx-2  rounded-xl shadow-lg shadow-gray-100 ">
                    <div class="product-img h-75 overflow-hidden flex justify-center items-center">
                        <img data-id=${product.id} src=${product.image} alt=${product.title} class="w-full h-full block cursor-pointer product-details"/>
                    </div>
                    <div class="product-text p-5 flex flex-col gap-2">
                        <p class="text-rose-500 text-xs uppercase tracking-widest">${product.category}</p>
                        <h3 data-id=${product.id} class="text-2xl capitalize font-semiboldm truncate cursor-pointer product-details">${product.title}</h3>
                        <p>USD ${currencyFormateder(product.price)} <span class="text-sm font-semibold">( ${product.reviews} reviews)</span></p>
                        <button data-id=${product.id} class="add-to-cart-btn cart-open-btn bg-sky-500 self-start text-sky-50 py-2 px-5 rounded-md font-semibold shadow-lg hover:bg-rose-500 hover:shadow-rose-200 duration-300 mt-2">Add to Cart</button>
                    </div>
                </div>
        `;


        if (category == "") {
            productsWrapper.insertAdjacentHTML('afterbegin', html)

        }
        

    })




    // add to cart event
    const addToCartBtns = document.querySelectorAll(".add-to-cart-btn")
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const id = e.target.dataset.id;

            cartModal.classList.remove("hidden")
            getSingleProductData(id)
        })
    })


    const productDetails = document.querySelectorAll(".product-details")
    productDetails.forEach(detail => {
        detail.addEventListener('click', function (e) {
            productDetailsWrapper.classList.remove('hidden')
            getProductDetails(e.target.dataset.id)
            console.log(e)
        })
    })


}

function getSingleProductData(id) {
    fetch(`https://sk-fahim-hossain.github.io/host_api/product/${id}.json`)
        .then(res => res.json())
        .then(data => {
            renderSingleProduct(data)
            saveInLocalStorage(data)
        })
}
function getProductDetails(id) {
    fetch(`https://sk-fahim-hossain.github.io/host_api/product/${id}.json`)
        .then(res => res.json())
        .then(data => {
            showProductDetails(data)
        })
}


// closre

function handleCloseDetail() {
    const closingArea = document.querySelector('.closing-area'); // Target the dynamically created wrapper
    if (closingArea) {
        closingArea.remove(); // Remove the modal entirely
        console.log("Closing area removed.");
    } else {
        console.error("Closing area not found!");
    }
}

function showProductDetails(productDetails) {
    // Remove any existing modal to avoid duplicates
    const existingModal = document.querySelector('.closing-area');
    if (existingModal) {
        existingModal.remove(); // Clean up the previous modal
    }

    // Create the modal HTML
    const html = `<div class="closing-area w-full h-full bg-black/75 fixed z-30 flex justify-center items-center">
            <div class="w-[90%] md:w-[75%] bg-white/95 rounded-lg relative">
                <div class="px-3 py-1 mt-1 cursor-pointer bg-red-400 text-black rounded absolute top-0 right-2 close-btn">x</div>
                <div class="p-4 flex-col md:flex lg:flex xl:flex">
                    <div class="max-w-1/3 overflow-hidden rounded-md">
                        <img src="${productDetails.image}" alt="" class="w-full h-full">
                    </div>
                    <div class="ml-3 flex flex-col gap-4">
                        <p class="text-sm">Reviews (${productDetails.reviews})</p>
                        <h3 class="text-2xl md:text-3xl lg:text-3xl xl:text-3xl">${productDetails.title}</h3>
                        <p class="text-2xl">USD ${productDetails.price}</p>
                        <button data-id="${productDetails.id}" class="add-to-cart-btn cart-open-btn bg-sky-500 text-sky-50 py-2 px-5 rounded-md font-semibold shadow-lg hover:bg-rose-500 hover:shadow-rose-200 duration-300 mt-2">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

    // Append the HTML to the body (or relevant wrapper)
    productDetailsWrapper.insertAdjacentHTML("beforeend", html);

    // Attach event listener to the close button
    productDetailsWrapper.querySelector('.close-btn').addEventListener('click', handleCloseDetail);
}
// close




function saveInLocalStorage(product) {
    const gettingLocalData = JSON.parse(localStorage.getItem(`item-${product.id}`));
    if (gettingLocalData) return null;
    if (!gettingLocalData) {
        localStorage.setItem(`item-${product.id}`, JSON.stringify(product))
    }
}



function loadingLocalData(products) {
    let localData = [];

    for (i = 1; i <= products.length; i++) {
        const dataParsing = JSON.parse(localStorage.getItem(`item-${i}`))
        if (dataParsing) localData.push(dataParsing)
    }

    localData.forEach(product => renderSingleProduct(product))

    const itemCount = localData.length;
    cartCounter.textContent = itemCount;
}



function renderSingleProduct(product) {
    const html = `
                <div class="added-product grid grid-cols-4 border-b-2">
                    <div class="img w-20 flex justify-center items-center rounded-sm overflow-hidden">
                        <img src=${product.image}
                            alt=${product.title} class="w-full block rounded">
                    </div>
                    <div class="cart-product-info col-span-2 flex flex-col gap-3">
                        <h4 class="font-semibold text-sm">${product.title}</h4>
                        <div class="flex justify-between pb-2">
                            <p class="price text-rose-400 font-semibold">${currencyFormateder(product.price)}</p>
                            <p class="flex space-x-2"><span
                                    class="px-2 bg-sky-400 active:bg-black">-</span><span>1</span><span
                                    class="px-2 bg-sky-400 active:bg-black">+</span></p>
                        </div>
                    </div>
                        <button class="remove-item-btn justify-self-end ">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-7 hover:text-rose-400">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                </div>
    `;

    addedProductWrapper.insertAdjacentHTML('beforeend', html)
}


function renderError(errorMsg) {
    const html = `
    <p>${errorMsg}</p>
    `;
    productsWrapper.insertAdjacentHTML('afterbegin', html)
}

// cart event
cartCloseBtn.addEventListener('click', function () {
    cartModal.classList.add("hidden")
})
cartOpenBtn.addEventListener('click', function () {
    cartModal.classList.remove("hidden")
})





