const handlePayment = document.getElementById('handlePayment');
const handlePaymentPaypal = document.getElementById('handlePaymentPaypal');
const paymentForm = document.getElementById('cartForm');
const paymentFormPaypal = document.getElementById('cartFormPaypal');
handlePayment.onclick = () =>{
    paymentForm.submit();
}
handlePaymentPaypal.onclick = () =>{
    paymentFormPaypal.submit();
}