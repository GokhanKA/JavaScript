function getProductsFromLocalStorage() {
    
}

const products = getProductsFromLocalStorage() || [];
let selectedProduct = null;
let totalPrice = 0;

function addProductToLocalStorage(product) {
    const products = getProductsFromLocalStorage();
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

function getProductById(id) {
    let product = null;
    products.forEach(function(prd) {
        if (prd.id == id) {
            product = prd;
        }
    })
    return product;
}

function addProduct(name, price) {
    let id;
    if (products.length > 0) {
        id = products[products.length - 1].id + 1;
    } else {
        id = 0;
    }
    const newProduct = {
        id,
        name,
        price: parseFloat(price)
    };

    products.push(newProduct);
    addProductToLocalStorage(newProduct);
    return newProduct;
}

function updateProduct(name, price) {
    products.forEach(function(prd) {
        if (prd.id == currentProduct.id) {
            prd.name = name;
            prd.price = parseFloat(price);
        }
    });
}

function deleteProduct(product) {
    products.forEach(function(prd, index) {
        if (prd.id == product.id) {
            products.splice(index, 1);
        }
    });
}

function updateTotal() {
    let total = 0;
    products.forEach(function(item) {
        total += item.price;
    });
    totalPrice = total;
}


//UI Controller

const UIController = (function() {

    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        cancelButton: '.cancelBtn',
        deleteButton: '.deleteBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'

    }

    return {
        createProductList: function(products) {
            let html = "";


            products.forEach(prd => {
                html += `<tr>
                            <td>${prd.id}</td>
                            <td>${prd.name}</td>
                            <td>${prd.price}$</td>
                            <td class="text-right">  
                            <i class="far fa-edit edit-product" ></i>

                         </tr>`;

            });




            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function() {
            return Selectors;
        },
        setCurrentProduct: function(product) {
            currentProduct = product;
        },

        addProduct: function(prd) {

            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = `            
                <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">    
                <i class="far fa-edit edit-product" ></i>        
            </td>
            </tr>              
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: function(name, price) {
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if (item.classList.contains("bg-warning")) {
                    item.children[1].textContent = name;
                    item.children[2].textContent = price + " $ ";
                    updatedItem = item;

                }
            });
            return updatedItem;
        },
        clearInputs: function() {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        clearWarnings: function() {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if (item.classList.contains("bg-warning")) {
                    item.classList.remove("bg-warning");
                }
            });

        },
        hideCard: function() {
            document.querySelector(Selectors.productCard).style.display = 'none';


        },
        showTotal: function() {
            document.querySelector(Selectors.totalDolar).textContent = totalPrice;
            document.querySelector(Selectors.totalTL).textContent = totalPrice * 4;

        },
        addProductToForm: function() {
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        deleteProduct: function() {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item) {
                if (item.classList.contains("bg-warning")) {
                    item.remove();
                }
            });
        },
        addingState: function(item) {
            UIController.clearWarnings();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function(tr) {

            tr.classList.add("bg-warning");
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';

        }

    }

})();


//App Controller
const App = (function(UICtrl) {
    const UISelectors = UICtrl.getSelectors();


    //Load Event Listeners
    const loadEventListeners = function() {
        //add product event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);


        //edit product click
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick);

        //edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener("click", editProductSubmit);

        //cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener("click", cancelUpdate);

        //delete button click
        document.querySelector(UISelectors.deleteButton).addEventListener("click", deleteProductSubmit);

    }

    const productAddSubmit = function(e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== "" && productPrice !== "") {
            //add product
            const newProduct = addProduct(productName, productPrice);
            // add item to list
            UICtrl.addProduct(newProduct);

            //get total
            updateTotal();

            //show total
            UICtrl.showTotal();

            // clear inputs
            UICtrl.clearInputs();



        }

        e.preventDefault();
    }
    const productEditClick = function(e) {
        if (e.target.classList.contains("edit-product")) {

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected
            const product = getProductById(id);

            //set current product
            currentProduct = product;

            //add product to UI
            UICtrl.addProductToForm();
            UICtrl.clearWarnings();

            UICtrl.editState(e.target.parentNode.parentNode);

        }
        e.preventDefault();
    }
    const editProductSubmit = function(e) {
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        if (productName !== "" && productPrice !== "") {
            //update product
            updateProduct(productName, productPrice);
            //update ui
            UICtrl.updateProduct(productName, productPrice);
            //get total
            updateTotal();

            //show total
            UICtrl.showTotal();
            UICtrl.addingState();



        }
        e.preventDefault();
    }
    const cancelUpdate = function(e) {
        UICtrl.addingState();
        UICtrl.clearWarnings();


        e.preventDefault();
    }
    const deleteProductSubmit = function(e) {

        //delete product
        deleteProduct(selectedProduct);

        //delete ui
        UICtrl.deleteProduct();
        //get total
        updateTotal();

        //show total
        UICtrl.showTotal(totalPrice);
        UICtrl.addingState();
        if (total == 0) {
            UICtrl.hideCard();
        }

        e.preventDefault();
    }

    return {
        init: function() {

            UICtrl.addingState();
            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }
            // get total
            updateTotal();

            // show total
            UICtrl.showTotal(totalPrice);

            loadEventListeners()
        }
    }

})(UIController);

App.init();