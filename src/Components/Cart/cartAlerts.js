import Swal from 'sweetalert2';

const baseCustom = {
  buttonsStyling: false,
  showClass: { popup: 'animate__animated animate__fadeIn animate__faster' },
  hideClass: { popup: 'animate__animated animate__fadeOut animate__faster' },
  customClass: {
    popup: 'rounded-2xl shadow-2xl border-0 p-0',
    htmlContainer: 'p-6 m-0',
    actions: 'px-6 pb-6 pt-0 gap-3 flex-row-reverse'
  }
};

const trashIcon = (size) => `
  <svg style="width:${size}px;height:${size}px" class="text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
  </svg>`;

export function confirmRemoveItem(title) {
  return Swal.fire({
    ...baseCustom,
    title: '',
    showCancelButton: true,
    confirmButtonText: 'Remove',
    cancelButtonText: 'Cancel',
    customClass: {
      ...baseCustom.customClass,
      confirmButton:
        'bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all',
      cancelButton:
        'bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all'
    },
    html: `
      <div class="text-center py-2">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Remove Item?</h3>
        <p class="text-gray-500 text-sm leading-relaxed">Remove <span class="font-semibold text-gray-700">${title
          .slice(0, 40)
          .replace(/</g, '&lt;')}${title.length > 40 ? '...' : ''}</span> from your cart?</p>
      </div>`
  });
}

export function confirmClearCart() {
  return Swal.fire({
    ...baseCustom,
    title: '',
    showCancelButton: true,
    confirmButtonText: 'Yes, Clear All',
    cancelButtonText: 'Keep Shopping',
    customClass: {
      ...baseCustom.customClass,
      confirmButton:
        'bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-red-500/20',
      cancelButton:
        'bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all'
    },
    html: `
      <div class="text-center py-2">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-red-50 to-orange-50 flex items-center justify-center">
          ${trashIcon('10')}
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Clear Your Cart?</h3>
        <p class="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">All items will be removed from your cart. This action cannot be undone.</p>
      </div>`
  });
}

export function cartClearedSuccess() {
  return Swal.fire({
    ...baseCustom,
    title: '',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: true,
    confirmButtonText: 'Continue Shopping',
    customClass: {
      ...baseCustom.customClass,
      actions: 'px-6 pb-6 pt-0',
      confirmButton:
        'bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all w-full'
    },
    html: `
      <div class="text-center py-2">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Cart Cleared!</h3>
        <p class="text-gray-500 text-sm">Your cart is now empty.</p>
      </div>`
  });
}