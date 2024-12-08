document.addEventListener("DOMContentLoaded", function() {
    // Function to manage donation buttons visibility based on language preference
    function manageDonationButtonsVisibility() {
        var languagePreference = localStorage.getItem("languagePreference");
        var donateBtn = document.querySelector('.donate-btn');
        var paypalButtonContainer = document.getElementById('paypal-button-container');

        if (languagePreference === 'french') {
            donateBtn.style.display = 'none';
            paypalButtonContainer.style.display = 'none';
        } else {
            donateBtn.style.display = 'block';
            paypalButtonContainer.style.display = 'block';
        }
    }

    // Show the pop-up window
    var popup = document.getElementById("language-popup");
    popup.style.display = "flex"; // Use flex to center the content

    // Check if the language preference is already set
    var languagePreference = localStorage.getItem("languagePreference");

    // If no preference is set, show the pop-up window
    if (!languagePreference) {
        var popup = document.getElementById("language-popup");
        popup.style.display = "flex"; // Use flex to center the content
    }

    // Add event listeners to the buttons
    var englishButton = document.querySelector(".btn-english");
    var frenchButton = document.querySelector(".btn-french");

    englishButton.addEventListener("click", function() {
        localStorage.setItem("languagePreference", "english");
        manageDonationButtonsVisibility(); // Update visibility based on new selection
    });

    frenchButton.addEventListener("click", function() {
        localStorage.setItem("languagePreference", "french");
        manageDonationButtonsVisibility(); // Update visibility based on new selection
    });

    // Manage donation buttons visibility on page load
    manageDonationButtonsVisibility();

    // Donation amount selection logic
    const donationOptions = document.querySelectorAll('input[name="donation"]');
    const customAmountInput = document.getElementById('custom-amount');

    donationOptions.forEach(option => {
        option.addEventListener('change', function() {
            customAmountInput.value = '';
        });
    });

    customAmountInput.addEventListener('input', function() {
        donationOptions.forEach(option => option.checked = false);
    });

    document.querySelector('.donate-btn').addEventListener('click', function() {
        let selectedAmount = document.querySelector('input[name="donation"]:checked') ? document.querySelector('input[name="donation"]:checked').value : customAmountInput.value;
        if (!selectedAmount) {
            alert('Please select or enter a donation amount.');
        } else {
            // Process the donation with the selectedAmount
            alert('Thank you for your donation of $' + selectedAmount);
        }
    });

    // Stripe integration
    const stripe = Stripe('process.env.STRIPE_PUBLISHABLE_KEY');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { paymentIntent, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                // Include any additional collected billing details.
            },
        });

        if (error) {
            console.log(error);
            document.getElementById('payment-message').innerText = error.message;
            document.getElementById('payment-message').classList.remove('hidden');
        } else {
            // Proceed with the payment
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethodId: paymentIntent.id, amount: selectedAmount })
            });
            const paymentResult = await response.json();

            if (paymentResult.error) {
                document.getElementById('payment-message').innerText = paymentResult.error.message;
                document.getElementById('payment-message').classList.remove('hidden');
            } else {
                document.getElementById('payment-message').innerText = 'Payment successful!';
                document.getElementById('payment-message').classList.remove('hidden');
            }
        }
    });

    // PayPal button rendering
    paypal.Buttons({
        createOrder: function(data, actions) {
            let selectedAmount = document.querySelector('input[name="donation"]:checked') ? document.querySelector('input[name="donation"]:checked').value : customAmountInput.value;
            if (!selectedAmount) {
                alert('Please select or enter a donation amount.');
                return;
            }
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: selectedAmount
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Optionally, send the transaction details to your server
            });
        }
    }).render('#paypal-button-container');
});
document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;

    document.querySelector('.carousel-control-next').addEventListener('click', () => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % totalItems;
        items[currentIndex].classList.add('active');
    });

    document.querySelector('.carousel-control-prev').addEventListener('click', () => {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        items[currentIndex].classList.add('active');
    });
});


    // Get the modal
    var popup = document.getElementById("donationPopup");

    // Get the button that opens the modal
    var btn = document.getElementById("openPopup");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        popup.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        popup.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }


    document.getElementById("popupBtn").onclick = function() {
    document.getElementById("popup").style.display = "block";
};

document.getElementById("closeBtn").onclick = function() {
    document.getElementById("popup").style.display = "none";
};

window.onclick = function(event) {
    if (event.target == document.getElementById("popup")) {
        document.getElementById("popup").style.display = "none";
    }
};

function closeBanner() {
    const banner = document.querySelector('.announcement-banner');
    banner.style.display = 'none';
}

