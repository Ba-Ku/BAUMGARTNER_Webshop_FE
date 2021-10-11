class webshopElements {
    constructor() {
        this.routedUrl = "http://localhost/BAUMGARTNER_Webshop/index.php?";
    }

    initGUIEvents() {
        let self = this;
        self.loadProductTypesList();
        self.loadShoppingCart();
        $('#button-to-empty-cart').on('click', function () {
            self.ajaxCallToEmptyCart();
        })
    }

    loadProductTypesList() {
        let self = this;
        $(document).ready(function () {
            self.ajaxCallForProductTypeList();
        })
    }

    ajaxCallForProductTypeList() {
        let self = this;
        $.ajax({
            url: self.routedUrl + "action=listTypes",
            method: "GET",
            dataType: "json"
        })
            .done(function (json) {
                self.fillTableWithProductTypes(json);
            })
            .fail(function (errorMessage, error) {
                self.makeElementVisible("table-for-errormessages-shop");
                self.displayErrorMessageShop(errorMessage, error);
            });
    }

    fillTableWithProductTypes(json) {
        let self = this;
        for (let item in json) {
            let $tablerow = $("<tr></tr>");
            let $productType = "<td>" + json[item].productType + "</td>";
            $tablerow.append($productType);
            $tablerow.on('click', function () {
                let $url = json[item].url;
                self.ajaxCallForProductList($url);
            });
            $tablerow.mouseover(function () {
                $tablerow.css('color', 'red');
            });
            $tablerow.mouseout(function () {
                $tablerow.css('color', 'black');
            });
            $("#table-for-producttypes-tablebody").append($tablerow);
        }

    }

    displayErrorMessageShop(errorMessage, error) {//vielleicht nur konsolenausgabe
        let $tablerow = $("<tr></tr>");
        let $errorType = "<td> Error occured: " + error + "</td>";
        let $errorMessage = "<td>" + errorMessage + "</td>";
        $tablerow.append($errorType);
        $tablerow.append($errorMessage);
        $('#table-for-errormessages-tablebody-shop').append($tablerow);
    }

    ajaxCallForProductList(inputUrl) {
        let self = this;
        $.ajax({
            url: inputUrl,
            method: "GET",
            datatype: "json"
        })
            .done(function (json) {
                self.makeElementVisible("table-for-products");
                self.resetProductsTableBody();
                self.fillTableWithProducts(json);
            })
            .fail(function (errorMessage, error) {
                self.makeElementVisible("table-for-errormessages-shop");
                self.displayErrorMessageShop(errorMessage, error);
            })
    }

    fillTableWithProducts(json) {
        let self = this;
        for (let item in json) {
            if (item == "products") {
                self.iterateOverProducts(json[item]);
            }
            self.hideElement("table-for-errormessages-shop");
        }
    }

    iterateOverProducts(json) {
        let self = this;
        for (let product in json) {
            let $tablerow = $("<tr></tr>");
            let $productName = "<td>" + json[product].name + "</td>";
            let $productDescription = "<td>" + json[product].description + "</td>";
            let $productId = json[product].id;
            let $productPicture = "<td><img src=\'CSS/products/" + $productId + ".png\' class='picture-extra-small' alt='productpicture'></td>";
            let $productUnit = "<td>" + json[product].unit + "</td>";
            let $productPrice = "<td>" + json[product].price + "</td>";
            $tablerow.append($productName);
            $tablerow.append($productDescription);
            $tablerow.append($productPicture);
            $tablerow.append($productUnit);
            $tablerow.append($productPrice);
            $tablerow.attr("data-toggle", "modal");
            $tablerow.attr("data-target", "#shop-modal");
            $tablerow.on('click', function () {
                self.ajaxCallToAddItemToCart($productId);
            });
            $('#table-for-products-tablebody').append($tablerow);
        }
    }

    resetProductsTableBody() {
        $('#table-for-products-tablebody').html(" ");
    }

    makeElementVisible(htmlElement) {
        $("#" + htmlElement + "").removeClass("d-none");
    }

    hideElement(htmlElement) {
        $("#" + htmlElement + "").addClass("d-none");
    }

    ajaxCallToAddItemToCart(articleId) {
        let self = this;
        $.ajax({
            url: self.routedUrl + "action=addArticle&articleId=" + articleId,
            method: "GET",
            dataType: "json"
        })
            .done(function (json) {
                self.displayModalTextShop(json);
            })
            .fail(function (errorMessage, error) {
                self.makeElementVisible("table-for-errormessages-shop");
                self.displayErrorMessageShop(errorMessage, error);
            })
    }

    getOrderState(json) {
        let orderstate = 0;
        for (let state in json) {
            orderstate = json[state];
        }
        return orderstate;
    }

    clearModalTextShop() {
        $('#shop-modal-title').html(" ");
        $('#shop-modal-body').html(" ");
    }

    orderStateSuccessMessage() {
        let shopModalHeaderText = "<div>Herzlichen Glückwunsch!</div>";
        let shopModalBodyText = "<div>Ihre Bestellung wurde hinzugefügt!</div>";
        $('#shop-modal-title').append(shopModalHeaderText);
        $('#shop-modal-body').append(shopModalBodyText);
    }

    orderStateFailedMessage() {
        let shopModalHeaderText = "<div>Es tut uns leid!</div>";
        let shopModalBodyText = "<div>Ihre Bestellung konnte nicht hinzugefügt werden!</div>";
        $('#shop-modal-title').append(shopModalHeaderText);
        $('#shop-modal-body').append(shopModalBodyText);
    }

    displayModalTextShop(json) {
        let orderstate = this.getOrderState(json);
        this.clearModalTextShop();
        switch (orderstate) {
            case "OK":
                this.orderStateSuccessMessage();
                break;
            case "ERROR":
                this.orderStateFailedMessage();
                break;
            default:
                console.log("An Error occured");
                break;
        }
    }

    displayErrorMessageCart(errorMessage, error) {//vielleicht nur konsolenausgabe
        let $tablerow = $("<tr></tr>");
        let $errorType = "<td> Error occured: " + error + "</td>";
        let $errorMessage = "<td>" + errorMessage + "</td>";
        $tablerow.append($errorType);
        $tablerow.append($errorMessage);
        $('#table-for-errormessages-tablebody-cart').append($tablerow);
    }

    ajaxCallToRemoveItemFromCart(articleId) {
        let self = this;
        $.ajax({
            url: self.routedUrl + "action=removeArticle&articleId=" + articleId,
            method: "GET",
            datatype: "json"
        })
            .done(function (json) {
                    self.displayModalTextCart(json);
                }
            )
            .fail(function (errorMessage, error) {
                self.makeElementVisible("table-for-errormessages-cart");
                self.displayErrorMessageCart(errorMessage, error);
            })
    }

    clearModalTextCart() {
        $('#cart-modal-title').html(" ");
        $('#cart-modal-body').html(" ");
    }

    decreaseStateSuccessMessage() {
        let cartModalHeaderText = "<div>Natürlich gerne!</div>";
        let cartModalBodyText = "<div>Der Artikel wurde entfernt!</div>";
        $('#cart-modal-title').append(cartModalHeaderText);
        $('#cart-modal-body').append(cartModalBodyText);
    }

    decreaseStateFailedMessage() {
        let cartModalHeaderText = "<div>Es tut uns leid!</div>";
        let cartModalBodyText = "<div>Der Artikel konnte nicht entfernt werden!</div>";
        $('#cart-modal-title').append(cartModalHeaderText);
        $('#cart-modal-body').append(cartModalBodyText);
    }

    displayModalTextCart(json) {
        let orderstate = this.getOrderState(json);
        this.clearModalTextCart();
        switch (orderstate) {
            case "OK":
                this.decreaseStateSuccessMessage();
                break;
            case "ERROR":
                this.decreaseStateFailedMessage();
                break;
            default:
                console.log("An Error occured");
                break;
        }
    }

    loadShoppingCart() {
        let self = this;
        $(document).ready(function () {
            self.ajaxCallToShowCartContent();
        });
    }

    ajaxCallToShowCartContent() {
        let self = this;
        $.ajax({
            url: self.routedUrl + "action=listCart",
            method: "GET",
            dataType: "json"
        })
            .done(function (json) {
                self.resetShoppingCartTableBody();
                self.hideElement("table-for-errormessages-cart");
                self.fillCartTable(json);
                self.ajaxCallToCalculateTotalSum();
            })
            .fail(function (errorMessage, error) {
                self.makeElementVisible("table-for-errormessages-cart");
                self.displayErrorMessageCart(errorMessage, error);
            })
    }

    resetShoppingCartTableBody() {
        $('#table-for-shoppingcart-body').html(" ");
    }

    fillCartTable(json) {
        let self = this;
        for (let article in json) {
            let $articleId = json[article].articleId;
            let $tablerow = $("<tr></tr>");
            let $articleName = "<td>" + json[article].articleName + "</td>";
            let $articleCount = "<td>" + json[article].amount + "</td>";
            let $articlePricePerUnit = "<td>" + json[article].articlePrice + "</td>";
            let calculatedPrice = json[article].totalSumForArticle;
            let roundedTotalPrice = Math.round(calculatedPrice * 100) / 100;
            let $articleTotalPrice = "<td>" + roundedTotalPrice + "</td>";
            let $buttonToDecreaseArticles = $("<td><button type='button' class='btn btn-danger' data-toggle='modal' data-target='#cart-modal'>-</button></td>");
            $buttonToDecreaseArticles.on('click', function () {
                self.ajaxCallToRemoveItemFromCart($articleId);
                self.ajaxCallToShowCartContent();
            })
            let $buttonToDeleteArticleGroup = $("<td><button type='button' class='btn btn-danger' data-toggle='modal' data-target='#cart-modal'>Alle löschen</button></td>");
            $buttonToDeleteArticleGroup.on('click', function () {
                self.ajaxCallToDeleteArticleGroupFromCart($articleId);
                self.ajaxCallToShowCartContent();
            })
            $tablerow.append($articleName);
            $tablerow.append($articleCount);
            $tablerow.append($articlePricePerUnit);
            $tablerow.append($articleTotalPrice);
            $tablerow.append($buttonToDecreaseArticles);
            $tablerow.append($buttonToDeleteArticleGroup);
            $('#table-for-shoppingcart-body').append($tablerow);
        }
    }

    ajaxCallToEmptyCart() {
        let self = this;
        $.ajax({
            url: this.routedUrl + "action=emptyCart",
            method: "GET",
            datatype: "json"
        })
            .done(function (json) {
                self.displayModalTextEmptyCart(json);
                self.ajaxCallToShowCartContent();
            })
            .fail(function (errorMessage, error) {
                self.makeElementVisible("table-for-errormessages-cart");
                self.displayErrorMessageCart(errorMessage, error);
            });
    }

    emptyCartStateSuccessMessage() {
        let emptyCartModalHeaderText = "<div>Natürlich gerne!</div>";
        let emptyCartModalBodyText = "<div>Alle Artikel wurden entfernt!</div>";
        $('#cart-modal-title').append(emptyCartModalHeaderText);
        $('#cart-modal-body').append(emptyCartModalBodyText);
    }

    emptyCartStateFailedMessage() {
        let emptyCartModalHeaderText = "<div>Es tut uns leid!</div>";
        let emptyCartModalBodyText = "<div>Der Artikel konnte nicht entfernt werden!</div>";
        $('#cart-modal-title').append(emptyCartModalHeaderText);
        $('#cart-modal-body').append(emptyCartModalBodyText);
    }

    displayModalTextEmptyCart(json) {
        let orderstate = this.getOrderState(json);
        this.clearModalTextCart();
        switch (orderstate) {
            case "OK":
                this.emptyCartStateSuccessMessage();
                break;
            case "ERROR":
                this.emptyCartStateFailedMessage();
                break;
            default:
                console.log("An Error occured");
                break;
        }
    }

    ajaxCallToDeleteArticleGroupFromCart(articleId) {
        let self = this;
        $.ajax({
            url: this.routedUrl + "action=deleteArticleType&articleId=" + articleId,
            method: "GET",
            datatype: "json"
        })
            .done(function (json) {
                self.displayModalTextDeleteArticleGroup(json);
                self.ajaxCallToShowCartContent();
            })
            .fail(function (errorMessage, error) {
                self.makeElementVisible("table-for-errormessages-cart");
                self.displayErrorMessageCart(errorMessage, error);
            });
    }

    deleteArticleGroupStateSuccessMessage() {
        let deleteArticleGroupModalHeaderText = "<div>Natürlich gerne!</div>";
        let deleteArticleGroupModalBodyText = "<div>Alle Artikel dieses Typs wurden entfernt!</div>";
        $('#cart-modal-title').append(deleteArticleGroupModalHeaderText);
        $('#cart-modal-body').append(deleteArticleGroupModalBodyText);
    }

    deleteArticleGroupStateFailedMessage() {
        let deleteArticleGroupModalHeaderText = "<div>Es tut uns leid!</div>";
        let deleteArticleGroupModalBodyText = "<div>Der Artikel konnte nicht entfernt werden!</div>";
        $('#cart-modal-title').append(deleteArticleGroupModalHeaderText);
        $('#cart-modal-body').append(deleteArticleGroupModalBodyText);
    }

    displayModalTextDeleteArticleGroup(json) {
        let orderstate = this.getOrderState(json);
        this.clearModalTextCart();
        switch (orderstate) {
            case "OK":
                this.deleteArticleGroupStateSuccessMessage();
                break;
            case "ERROR":
                this.deleteArticleGroupStateFailedMessage();
                break;
            default:
                console.log("An Error occured");
                break;
        }
    }

    ajaxCallToCalculateTotalSum() {
        let self = this;
        $.ajax({
            url: this.routedUrl + "action=calculateTotalSum",
            method: "GET",
            datatype: "json"
        })
            .done(function (json) {
                self.clearTotalSumTable();
                self.displayTotalSum(json)
            })
            .fail(function (errorMessage, error) {
                self.makeElementVisible("table-for-errormessages-cart");
                self.displayErrorMessageCart(errorMessage, error);
            });
    }

    displayTotalSum(json) {
        let $totalSum;
        let $tablerow = $("<tr></tr>");
        let $tableColumn = $("<td class='text-end'></td>");
        $totalSum = json['totalSum'];
        let $roundedTotalSum = Math.round($totalSum * 100) / 100;
        $tableColumn.append($roundedTotalSum);
        $tablerow.append($tableColumn);

        $('#table-for-shoppingcart-totalbill-body').append($tablerow);
    }

    clearTotalSumTable() {
        $('#table-for-shoppingcart-totalbill-body').html(" ");
    }
}