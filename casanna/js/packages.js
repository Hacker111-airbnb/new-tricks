var PAYSTACK_PUBLIC_KEY = 'pk_live_cc5205d1995a63c9bbfab852b0e52c24b90ac916';

var selectedPackage = null;

function getCurrentNetwork() {
    var path = window.location.pathname;
    if (path.includes('mtn')) return 'MTN';
    if (path.includes('telecel')) return 'Telecel';
    if (path.includes('tigo')) return 'Tigo';
    return 'MTN';
}

function generateDropdown() {
    var list = document.getElementById('dropdown-list');
    var btnBuy = document.getElementById('btn-buy-now');
    if (!list) return;

    var network = getCurrentNetwork();
    var networkKey = network.toLowerCase();
    list.innerHTML = '';

    var packages = [
        { gb: 3, price: 15 },
        { gb: 4, price: 21 },
        { gb: 5, price: 27 },
        { gb: 6, price: 29 },
        { gb: 8, price: 39 },
        { gb: 10, price: 49 },
        { gb: 15, price: 65 },
        { gb: 20, price: 70 },
        { gb: 25, price: 100 },
        { gb: 30, price: 120 }
    ];

    for (var i = 0; i < packages.length; i++) {
        var gb = packages[i].gb;
        var price = packages[i].price;
        var item = document.createElement('div');
        item.className = 'dropdown-item dropdown-item-' + networkKey;
        item.setAttribute('data-gb', gb);
        item.setAttribute('data-price', price);

        item.innerHTML =
            '<span class="item-name">' + gb + 'GB</span>' +
            '<span class="item-price">GHS ' + price + '</span>';

        item.onclick = (function (g, p, nk, el) {
            return function (e) {
                e.stopPropagation();
                selectPackage(g, p, nk, el);
            };
        })(gb, price, networkKey, item);

        list.appendChild(item);
    }

    if (btnBuy) {
        btnBuy.removeAttribute('class');
        btnBuy.className = 'btn-buy-now btn-' + networkKey;
    }
}

function toggleDropdown() {
    var dropdown = document.getElementById('data-dropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('open');
}

function selectPackage(gb, price, networkKey, element) {
    var dropdown = document.getElementById('data-dropdown');
    var dropdownText = document.getElementById('dropdown-text');
    var dropdownSelected = document.getElementById('dropdown-selected');
    var btnBuy = document.getElementById('btn-buy-now');
    var list = document.getElementById('dropdown-list');

    selectedPackage = { gb: gb, price: price, networkKey: networkKey };

    if (dropdownText) dropdownText.textContent = gb + 'GB — GHS ' + price;
    if (dropdownSelected) dropdownSelected.classList.add('has-value');
    if (dropdown) { dropdown.classList.remove('open'); dropdown.classList.add('dropdown-' + networkKey); }
    if (btnBuy) btnBuy.disabled = false;

    var items = list.querySelectorAll('.dropdown-item');
    for (var i = 0; i < items.length; i++) { items[i].classList.remove('item-active'); }
    if (element) element.classList.add('item-active');
}

function buySelected() {
    if (!selectedPackage) return;
    var nk = selectedPackage.networkKey;
    openModal(nk.toUpperCase() + ' ' + selectedPackage.gb + 'GB', selectedPackage.price.toFixed(2), nk);
}

function processPayment(event) {
    event.preventDefault();

    var phoneNumber = document.getElementById('phone-number').value.trim();
    var dataNumber = document.getElementById('data-number').value.trim();
    var feedback = document.getElementById('payment-feedback');
    var submitBtn = event.target.querySelector('.btn-pay');

    if (!phoneNumber) {
        feedback.className = 'payment-feedback error';
        feedback.textContent = 'Enter your phone number';
        return;
    }

    if (!dataNumber) {
        feedback.className = 'payment-feedback error';
        feedback.textContent = 'Enter the data number';
        return;
    }

    feedback.className = 'payment-feedback loading';
    feedback.innerHTML = 'Initializing payment<span class="loading-dots"></span>';
    submitBtn.disabled = true;

    var packageName = document.getElementById('package-name').textContent;
    var priceText = document.getElementById('package-price').textContent;
    var price = parseFloat(priceText.replace('GHS ', '')) * 100;

    var handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: phoneNumber + '@cheapdata.gh',
        amount: Math.round(price),
        currency: 'GHS',
        metadata: {
            custom_fields: [
                { display_name: 'Network', variable_name: 'network', value: getCurrentNetwork() },
                { display_name: 'Package', variable_name: 'package', value: packageName },
                { display_name: 'Phone Number', variable_name: 'phone_number', value: phoneNumber },
                { display_name: 'Data Number', variable_name: 'data_number', value: dataNumber }
            ]
        },
        callback: function (response) {
            feedback.className = 'payment-feedback success';
            feedback.innerHTML = '✅ <strong>Payment Successful!</strong><br>Ref: ' + response.reference + '<br>Your data will be delivered shortly.';
            submitBtn.style.display = 'none';
            setTimeout(function () {
                closeModal();
                submitBtn.style.display = '';
                submitBtn.disabled = false;
            }, 4000);
        },
        onClose: function () {
            feedback.className = 'payment-feedback error';
            feedback.textContent = 'Payment cancelled. Try again.';
            submitBtn.disabled = false;
        }
    });

    handler.openIframe();
}

document.addEventListener('DOMContentLoaded', function () {
    generateDropdown();
});

document.addEventListener('click', function (e) {
    var dropdown = document.getElementById('data-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
});
