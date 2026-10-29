/**
 * Property Office Form Confirmation Handler
 * Replaces inline onsubmit="return confirm(...)" handlers to satisfy Content Security Policy (C9).
 */
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('submit', function (event) {
    const form = event.target;
    if (form && form.matches && form.matches('[data-confirm]')) {
      const confirmationMessage = form.getAttribute('data-confirm');
      if (confirmationMessage && !window.confirm(confirmationMessage)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });
});
