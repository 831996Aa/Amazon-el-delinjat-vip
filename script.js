document.addEventListener('DOMContentLoaded', () => {
    const orderButtons = document.querySelectorAll('.order-btn');
    const modal = document.getElementById('order-form-modal');
    const closeButton = document.querySelector('.close-button');
    const orderForm = document.getElementById('order-form');
    const modalProductName = document.getElementById('modal-product-name');
    const searchInput = document.getElementById('searchInput');
    const productCards = document.querySelectorAll('.product-card');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    let currentProductOrdered = ''; // To store the name of the product being ordered
    let currentProductQuantity = 1; // To store the quantity of the product

    // Telegram Bot Configuration (REPLACE WITH YOUR ACTUAL VALUES)
    const TELEGRAM_BOT_TOKEN = '7915109680:AAGjx83MDdssw9gGCDGfaKzRIt-RXAQs3u8'; // Replace with your bot token
    const TELEGRAM_CHAT_ID = '1986203156';     // Replace with your chat ID

    // Function to show "Added to Cart" message
    const showAddedToCartMessage = (productCard) => {
        let messageElement = productCard.querySelector('.added-to-cart-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'added-to-cart-message';
            messageElement.textContent = 'تم إضافة المنتج للطلب!';
            productCard.appendChild(messageElement);
        }
        messageElement.classList.add('show');
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 2000); // Hide after 2 seconds
    };

    // Function to open the modal
    orderButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            currentProductOrdered = productCard.dataset.productName;
            currentProductQuantity = productCard.querySelector('.product-quantity').value;

            modalProductName.innerHTML = `
                <p><strong>المنتج:</strong> ${currentProductOrdered}</p>
                <p><strong>الكمية:</strong> ${currentProductQuantity}</p>
            `;
            modal.classList.add('show'); // Use class to show with transition

            showAddedToCartMessage(productCard); // Show confirmation message on the product card
        });
    });

    // Function to close the modal
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show'); // Use class to hide with transition
        orderForm.reset(); // Clear the form when closed
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
            orderForm.reset();
        }
    });

    // Handle form submission
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const fullName = document.getElementById('full-name').value;
        const mobileNumber = document.getElementById('mobile-number').value;
        const address = document.getElementById('address').value;

        // Basic validation
        if (!fullName || !mobileNumber || !address) {
            alert('الرجاء تعبئة جميع الحقول المطلوبة.');
            return;
        }

        // Construct the message for Telegram
        const message = `
        طلب منتج جديد!
        المنتج: ${currentProductOrdered}
        الكمية: ${currentProductQuantity}
        الاسم الكامل: ${fullName}
        رقم الموبايل: ${mobileNumber}
        العنوان/المكان: ${address}
        `;

        // Send data to Telegram bot
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        try {
            const response = await fetch(telegramApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message
                })
            });

            const data = await response.json();

            if (data.ok) {
                alert('تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.');
                modal.classList.remove('show'); // Close modal after successful submission
                orderForm.reset(); // Clear the form
            } else {
                alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
                console.error('Telegram API error:', data);
            }
        } catch (error) {
            alert('حدث خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
            console.error('Network or Telegram API call failed:', error);
        }
    });

    // Search functionality
    searchInput.addEventListener('keyup', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        productCards.forEach(card => {
            const productName = card.dataset.productName.toLowerCase();
            if (productName.includes(searchTerm)) {
                card.style.display = 'flex'; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    });

    // Scroll-to-top button functionality
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll animation
        });
    });
});
