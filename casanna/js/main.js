window.addEventListener('load', function () {
    setTimeout(function () {
        var loader = document.getElementById('loader');
        var content = document.getElementById('content');
        if (loader) loader.classList.add('hidden');
        if (content) content.style.display = 'block';
    }, 1400);
});

function navigateTo(network) {
    var loader = document.getElementById('loader');
    var content = document.getElementById('content');
    if (content) content.style.display = 'none';
    if (loader) { loader.classList.remove('hidden'); loader.style.opacity = '1'; loader.style.visibility = 'visible'; }
    setTimeout(function () { window.location.href = network + '.html'; }, 500);
}

function goHome() {
    var loader = document.getElementById('loader');
    var content = document.getElementById('content');
    if (content) content.style.display = 'none';
    if (loader) { loader.classList.remove('hidden'); loader.style.opacity = '1'; loader.style.visibility = 'visible'; }
    setTimeout(function () { window.location.href = 'index.html'; }, 500);
}

function openModal(packageName, price, networkColor) {
    var modal = document.getElementById('payment-modal');
    var packageNameEl = document.getElementById('package-name');
    var packagePriceEl = document.getElementById('package-price');
    var selectedInfo = document.getElementById('selected-info');
    var btnPay = document.querySelector('.btn-pay');
    var headerStrip = document.querySelector('.modal-header-strip');
    var iconWrap = document.querySelector('.modal-icon-wrap');
    var labels = document.querySelectorAll('.form-group label');

    if (packageNameEl) packageNameEl.textContent = packageName;
    if (packagePriceEl) packagePriceEl.textContent = 'GHS ' + price;

    if (modal) { modal.removeAttribute('class'); modal.className = 'modal active modal-' + networkColor; }
    if (selectedInfo) { selectedInfo.removeAttribute('class'); selectedInfo.className = 'selected-package pkg-' + networkColor; }
    if (btnPay) { btnPay.removeAttribute('class'); btnPay.className = 'btn-pay pay-' + networkColor; }
    if (headerStrip) { headerStrip.removeAttribute('class'); headerStrip.className = 'modal-header-strip strip-' + networkColor; }
    if (iconWrap) {
        iconWrap.removeAttribute('class');
        iconWrap.className = 'modal-icon-wrap icon-' + networkColor;
        var icons = { mtn: '📱', telecel: '📱', tigo: '📱' };
        iconWrap.textContent = icons[networkColor] || '📱';
    }

    for (var i = 0; i < labels.length; i++) {
        labels[i].removeAttribute('class');
        labels[i].className = 'label-' + networkColor;
    }

    document.body.style.overflow = 'hidden';
}

function closeModal() {
    var modal = document.getElementById('payment-modal');
    var feedback = document.getElementById('payment-feedback');
    var form = document.getElementById('payment-form');
    if (modal) modal.classList.remove('active');
    if (feedback) { feedback.className = 'payment-feedback'; feedback.textContent = ''; }
    if (form) form.reset();
    document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});
