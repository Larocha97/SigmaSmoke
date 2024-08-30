const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addresInput = document.getElementById("addres");
const warnTroco = document.getElementById("warn-troco");
const warnPagamento = document.getElementById("warn-pagamento");
const addresWarn = document.getElementById("addres-warn");
const addToCartButtons = document.querySelectorAll('.add-to-card-btn');
const dinheiroRadio = document.getElementById('dinheiro');
const trocoInput = document.getElementById('troco-input');
const paymentOptions = document.querySelectorAll('input[name="payment"]');
const nomeInput = document.getElementById('nome-input');
const warnNome = document.getElementById("warn-nome");
const numberInput = document.getElementById('number');
const warnNumber = document.getElementById("number-warn");
const complementoInput = document.getElementById('complemento');

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

    Toastify({
        text: "Produto adicionado!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#ef4444",
        },
    }).showToast();

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
    window.minhaVariavelGlobal = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

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

numberInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        numberInput.classList.remove("border-red-500");
        warnNumber.classList.add("hidden");
    }
})

nomeInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        warnNome.classList.add("hidden");
    }
})

paymentOptions.forEach(option => {
    option.addEventListener("change", function () {
        warnPagamento.classList.add("hidden"); // Remove o aviso ao selecionar qualquer opção de pagamento
    });
});


trocoInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        trocoInput.classList.remove("border-red-500");
        warnTroco.classList.add("hidden");
    }
})

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkTabacariaOpen();
    /* if (!isOpen) {
        Toastify({
            text: "Ops estamos fechados!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    } */

    if (cart.length === 0) {
        Toastify({
            text: "Carinho vazio!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    const pagamento = verificarPagamentoSelecionado();
    if (pagamento === null) {
        warnPagamento.classList.remove("hidden");
        /* trocoInput.classList.add("border-red-500");  */
        return;
    }

    if (pagamento === "dinheiro" && trocoInput.value ==="") {
        warnTroco.classList.remove("hidden");
        trocoInput.classList.add("border-red-500"); 
        return;
    }

    if (addresInput.value === "") {
        addresWarn.classList.remove("hidden");
        addresInput.classList.add("border-red-500");
        return;
    }

    if (numberInput.value === "") {
        warnNumber.classList.remove("hidden");
        numberInput.classList.add("border-red-500");
        return;
    }

    if (nomeInput.value === "") {
        warnNome.classList.remove("hidden");
        nomeInput.classList.add("border-red-500");
        return;
    }
    
    const cartItems = cart.map((item) => {
        return (
            `- ${item.name} Quantidade: (${item.quantity}) | Preço: R$${item.price} | Sabor: ${item.sabor};`
        )
    }).join("\n");
    
    let opcaoPagamento = ``;
    const totalFinal = `\nTotal: ${minhaVariavelGlobal}`; 
    const nome = `Olá ${nomeInput.value}.`;
    const endereco = `\n\nEndereço: ${addresInput.value}, Número: ${numberInput.value}, Complemento: ${complementoInput.value}`;
    
    if (pagamento === "dinheiro") {
        opcaoPagamento = `\nForma pagamento: ${verificarPagamentoSelecionado()}, Troco para: ${trocoInput.value}`;
    } else {
        opcaoPagamento = `\nForma pagamento: ${verificarPagamentoSelecionado()}`;
    }
    const messagem = encodeURIComponent(nome + `\n\n` + cartItems + endereco + totalFinal + opcaoPagamento + `\n\nObrigado pela preferencia!`);
    const phone = "44997362393";

    window.open(`https://wa.me/${phone}?text=${messagem}`, "_blank");

    cart = [];
    updataCartModal();
    limpaCampos();
})

function limpaCampos() {
    addresInput.value = "";
    numberInput.value = "";
    complementoInput.value = "";
    trocoInput.value = "";
    minhaVariavelGlobal.value = "";
    nomeInput.value = "";
}

function checkTabacariaOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
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

dinheiroRadio.addEventListener('change', function() {
    if (this.checked) {
        trocoInput.classList.remove('hidden');
    }
});

// Função para esconder o campo do troco ao clicar em outras opções
document.querySelectorAll('input[name="payment"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        if (!dinheiroRadio.checked) {
            trocoInput.classList.add('hidden');
        }
    });
});

// Função para verificar qual opção de pagamento está marcada
function verificarPagamentoSelecionado() {
    const pagamentoSelecionado = document.querySelector('input[name="payment"]:checked');
    
    if (pagamentoSelecionado) {
        return pagamentoSelecionado.value; // Retorna o valor selecionado
    } else {
        return null; // Retorna null se nenhuma opção estiver selecionada
    }
}
