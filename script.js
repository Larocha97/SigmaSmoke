const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addresInput = document.getElementById("addres");
const addresWarn = document.getElementById("addres-warn");
const addToCartButtons = document.querySelectorAll('.add-to-card-btn');

let cart = [];

//abrir modal do carrinho
cartBtn.addEventListener("click", function () {
    updataCartModal();
    cartModal.style.display = "flex";
});

//fechar modal do carrinho quando clica fora
cartModal.addEventListener("click", function (event){
   if(event.target === cartModal) {
       cartModal.style.display = "none";
   }
});

//fechar carrinho quando clica no fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function (event){
   let parentButton = event.target.closest(".add-to-card-btn");

   if (parentButton) {
       const name = parentButton.getAttribute("data-name");
       const price = parseFloat(parentButton.getAttribute("data-price"));
       let sabor = "";

       const comboBox = parentButton.closest('div').querySelector('select');
       if (comboBox !== null) {
            sabor = comboBox.value;
       }

       addTocart(name, price, sabor);
   }
});

//função para adicionar no carrinho
function addTocart(name, price, sabor) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;

        if (Array.isArray(existingItem.sabor)) {
            existingItem.sabor.push(sabor);
        } else {
            // Se sabor ainda não for um array, converte para array e adiciona o novo sabor
            existingItem.sabor = [existingItem.sabor, sabor];
        }

    } else {
        cart.push({
            name,
            price,
            sabor: [sabor],
            quantity:1,
        });
    }
    updataCartModal();
}

//atuliza carrinho
function updataCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p class="font-medium">${item.sabor}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//função remove item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            if (item.sabor.length > 1) {
                item.sabor.pop()
            }
            updataCartModal();
            return;
        }

        cart.splice(index, 1);
        updataCartModal();
    }
}

addresInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addresInput.classList.remove("border-red-500");
        addresWarn.classList.add("hidden");
    }
})

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkTabacariaOpen();
    // if (!isOpen) {
    //     Toastify({
    //         text: "Ops estamos fechados!",
    //         duration: 3000,
    //         close: true,
    //         gravity: "top", // `top` or `bottom`
    //         position: "right", // `left`, `center` or `right`
    //         stopOnFocus: true, // Prevents dismissing of toast on hover
    //         style: {
    //             background: "#ef4444",
    //         },
    //     }).showToast();
    //
    //     return;
    // }

    if (cart.length === 0) return;
    if (addresInput.value === "") {
        addresWarn.classList.remove("hidden");
        addresInput.classList.add("border-red-500");
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("");

    const messagem = encodeURIComponent(cartItems);
    const phone = "44997362393";

    window.open(`https://wa.me/${phone}?text=${messagem} Endereço: ${addresInput.value}`, "_blank");

    cart = [];
    updataCartModal();
})

function checkTabacariaOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("data-span");
const isOpen = checkTabacariaOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
