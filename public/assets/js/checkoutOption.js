const $ = (name) => {
    return document.getElementById(name);
};

function OptionChange() {
    let options = document.getElementsByName("method-payment");
    let length = options.length;
    // let handlePayment = $("handlePayment");
    for (let i = 0; i < length; i++) {
        if (options[i].checked) {
            if (options[i].value === "cart") {
                // handlePayment.innerText = "Complete Payment";
                $("handlePayment").classList.add("active");
                $("handlePaymentPaypal").classList.remove("active");
                $("show-paypal").classList.add("hidden");
                $("show-cart").classList.remove("hidden");
            } else {
                // handlePayment.innerText = "Proceed";
                $("handlePaymentPaypal").classList.add("active");
                $("handlePayment").classList.remove("active");
                $("show-cart").classList.add("hidden");
                $("show-paypal").classList.remove("hidden");
            }
        }
    }
}
