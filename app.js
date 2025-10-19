window.onload = () => {
    localStorage.removeItem("productItems");
    localStorage.removeItem("productItemsBK");
    $('#product-table-body').parent().hide();
    $("#priceAsc").hide();
    $("#titleAsc").hide();
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        if (xhttp.status === 200) {
            const data = JSON.parse(xhttp.responseText);
            displayProducts(data);
            localStorage.setItem("productItems", xhttp.responseText);
        } else {
            $('#product-summary').remove();
            $('#product-summary').append($(`<div><p class="error">${JSON.parse(xhttp.responseText).message}</p></div>`));
        }
    }
    xhttp.open("GET", `https://api.escuelajs.co/api/v1/products`, true);
    xhttp.send();

    const xhttp2 = new XMLHttpRequest();
    xhttp2.onload = function () {
        const categoriData = JSON.parse(xhttp2.responseText);
        categoriesMenu(categoriData);
    }
    xhttp2.open("GET", `https://api.escuelajs.co/api/v1/categories`, true);
    xhttp2.send();

    //When the sort icon cick
    $("#priceId > svg").click((e) => {
        let direction = $(e.target).attr("id");
        let arrow = "";
        if (direction == "priceFilter") {
            $("#priceFilterPopup").fadeIn("slow");
        } else {
            //animation
            $(e.target).fadeOut("slow", () => {
                switch (direction) {
                    case "priceAsc":
                        arrow = $("#priceDesc");
                        break;
                    case "priceDesc":
                        arrow = $("#priceAsc");
                        break;

                }
                arrow.fadeIn("slow");
            });

            //call function;
            priceSort(direction);
        }
    })

    $("#applyFilterButton").click((e) => {
        let low = $("#low").val() != "" ? $("#low").val() : 0;
        let high = $("#high").val() != "" ? $("#high").val() : 9999;

        if (low > high) {
            $("#priceFilterPopup p").remove();
            $("#priceFilterPopup > div").first().append($(`<p> This price is error</>`));
            return;
        }

        console.log("low" + low + "high" + high)
        priceFilter(low, high);
    });

    $("#searchButtonId").click((e) => {
        let searchText = $("#searchTextId").val();

        if (searchText == "") {
            $("#searchPopup p").remove();
            $("#searchPopup > div").first().append($(`<p> Enter some words</>`));
            return;
        }

        search(searchText.toLowerCase());
    });

    //When the sort icon cick
    $("#titleId > svg").click((e) => {
        let direction = $(e.target).attr("id");
        let arrow = "";

        if (direction == "search") {
            $("#searchPopup").fadeIn("slow");
        } else {
            //animation
            $(e.target).fadeOut("slow", () => {
                switch (direction) {
                    case "titleAsc":
                        arrow = $("#titleDesc");
                        break;
                    case "titleDesc":
                        arrow = $("#titleAsc");
                        break;

                }
                arrow.fadeIn("slow");
            });
            //call function;
            titleSort(direction);
        }

    });

    function displayProducts(productsArray) {
        let productContainer = $('#product-table-body');
        let productSummary = $('#product-summary');
        let updateDate = "";
        let averageprice = 0;
        let minprice = 999;
        let maxprice = 0;
        if (productsArray.length == 0) {
            $('#product-summary').children().remove();
            productContainer.children().remove();
            productSummary.append($(`<div><p>No Result</p></div>`));
            return;
        }
        if (productContainer.children().length != 0) {
            productContainer.children().remove();
            productSummary.children().remove();
        }
        productsArray.forEach(product => {
            //display products
            updateDate = new Date(product.updatedAt);
            let productTr = $(`<tr>
                <td><img src="${product.images[0]}" class="product"/></td>
                <td>${product.title}</td>
                <td><img src="${product.category.image}" class="category" /></td>
                <td>$${product.price}</td>
                <td>${updateDate.toLocaleDateString()}</td>
            </tr>`).hide();
            productContainer.append(productTr.fadeIn());
            //calclate averages
            averageprice += product.price;
            if (minprice > product.price) minprice = product.price;
            if (product.price > maxprice) maxprice = product.price;


        });

        let summary = $(`<div> <p>average</p> <p>${averageprice / productsArray.length}</p> </div>`).hide();
        let min = $(`<div> <p>Minimum-price</p> <p>${minprice}</p> </div>`).hide();
        let max = $(`<div> <p>Maximum-price</p> <p>${maxprice}</p> </div>`).hide();
        productSummary.append(summary.fadeIn());
        productSummary.append(min.fadeIn());
        productSummary.append(max.fadeIn());

        productContainer.parent().show();
    }


    function categoriesMenu(categoriesArray) {
        let container = $("<ul class='category-List'></ul>");
        categoriesArray.forEach((category, index) => {
            let categoryElement = $(`<li id='${index}'><img src="${category.image}" class="category" />${category.name}</li>`);
            container.append(categoryElement);
        })
        $("#categoryId").append(container.hide());
        $("#categoryId").click(() => {
            $(".category-List").fadeIn("slow");
        });
        $(".category-List li").click((e) => {
            //console.log($(e.target).text());
            categoryfilter($(e.target).text());
        })

    }
    function search(searchText) {
        let productArray = JSON.parse(localStorage.getItem("productItems"));
        if (localStorage.getItem("productItemsBK")) {
            productArray = JSON.parse(localStorage.getItem("productItemsBK"));
        }

        const filteredProducts = productArray.filter(product => {
            let string = product.title.toLowerCase();
            return string.includes(searchText);
        });

        //localStorage.setItem("productItems", JSON.stringify(filteredProducts));
        if (filteredProducts.length > 0) {
            localStorage.setItem("productItemsBK", JSON.stringify(filteredProducts));
        }
        displayProducts(filteredProducts);
    }

    function priceFilter(low = 0, high) {
        let productArray = JSON.parse(localStorage.getItem("productItems"));
        if (localStorage.getItem("productItemsBK")) {
            productArray = JSON.parse(localStorage.getItem("productItemsBK"));
        }


        const filteredProducts = productArray.filter(product => {
            if (product.price > low && high > product.price) {
                return true;
            } else {
                return false;
            }
        });

        //localStorage.setItem("productItems", JSON.stringify(filteredProducts));
        if (filteredProducts.length > 0) {
            localStorage.setItem("productItemsBK", JSON.stringify(filteredProducts));
        }
        displayProducts(filteredProducts);
    }

    function categoryfilter(categoryName) {
        let ctgArray = JSON.parse(localStorage.getItem("productItems"));
        if (localStorage.getItem("productItemsBK")) {
            ctgArray = JSON.parse(localStorage.getItem("productItemsBK"));
        }
        const filteredProducts = ctgArray.filter(product => {
            return product.category.name === categoryName;
        });

        //localStorage.setItem("productItems", JSON.stringify(filteredProducts));
        if (filteredProducts.length > 0) {
            localStorage.setItem("productItemsBK", JSON.stringify(filteredProducts));
        }
        displayProducts(filteredProducts);
    }

    function titleSort(direction) {
        let objArray = JSON.parse(localStorage.getItem("productItems"));
        let afterSort = [];

        switch (direction) {
            case "titleAsc":
                afterSort = objArray.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "titleDesc":
                afterSort = objArray.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        // console.log(afterSort);
        localStorage.setItem("productItems", JSON.stringify(afterSort));
        displayProducts(afterSort);
    }

    function priceSort(direction) {
        let objArray = JSON.parse(localStorage.getItem("productItems"));
        let afterSort = [];

        switch (direction) {
            case "priceAsc":
                afterSort = objArray.sort((a, b) => a.price - b.price);
                break;
            case "priceDesc":
                afterSort = objArray.sort((a, b) => b.price - a.price);
                break;
        }
        // console.log(afterSort);
        localStorage.setItem("productItems", JSON.stringify(afterSort));
        displayProducts(afterSort);

    }

    //click handler
    $(document).click((e) => {
        let pricePopup = $("#priceFilterPopup");
        let searchPopup = $("#searchPopup");
        let categoryPopup = $(".category-List");

        if (e.target.tagName == "svg") {
            console.log("bbbbbbbbb" + e.target.tagName);
            return;
        }

        if (!categoryPopup && (!searchPopup || searchPopup[0].style.display === "none") && (!pricePopup || pricePopup[0].style.display === "none")) {
            return;
        }
        console.log("aaaaaaa" + pricePopup[0]);

        if (pricePopup[0] && !pricePopup[0].contains(e.target)) {
            pricePopup.fadeOut("slow");
        }
        if (searchPopup[0] && !searchPopup[0].contains(e.target)) {
            searchPopup.fadeOut("slow");
        }
        if (categoryPopup[0] && !categoryPopup[0].contains(e.target)) {
            categoryPopup.fadeOut("slow");
        }
    });
}