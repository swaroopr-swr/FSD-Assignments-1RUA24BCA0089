/**
 * Jadoo Travel Landing Page - Main Application Logic
 * Coordinates navbar, hero search, dynamic destinations, modals,
 * testimonials carousel, and form validations.
 */

import { destinations, testimonials } from './data.js';

/* ==========================================================================
   Global State
   ========================================================================== */
const state = {
  activeTestimonialIndex: 0,
  activeFilter: null,
  isExpandedView: false,
  lastFocusedElement: null
};

const INITIAL_VISIBLE_COUNT = 3;

/* ==========================================================================
   DOM Ready Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSearch();
  initDestinations();
  initTripCardInteractions();
  initTestimonials();
  initModals();
  initNewsletter();
});

/* ==========================================================================
   1. Navbar & Header Interactions (Sticky scroll, Mobile menu, Lang selector)
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const langSelector = document.getElementById('langSelector');
  const langOptions = document.querySelectorAll('.lang-option');
  const langText = document.querySelector('.lang-text');

  // Sticky navbar shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target) && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Language selector dropdown
  if (langSelector) {
    langSelector.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langSelector.classList.toggle('open');
      langSelector.setAttribute('aria-expanded', String(isOpen));
    });

    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        langOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        const code = option.textContent.slice(0, 2);
        if (langText) langText.textContent = code;
        langSelector.classList.remove('open');
        langSelector.setAttribute('aria-expanded', 'false');
        showToast(`Language switched to ${option.textContent.trim()}`);
      });
    });

    document.addEventListener('click', () => {
      langSelector.classList.remove('open');
      langSelector.setAttribute('aria-expanded', 'false');
    });
  }
}

/* ==========================================================================
   2. Hero Search Bar (Section 5.2)
   ========================================================================== */
function initHeroSearch() {
  const form = document.getElementById('heroSearchForm');
  const input = document.getElementById('searchDestination');
  const errorEl = document.getElementById('searchError');
  const feedbackBar = document.getElementById('searchFeedbackBar');
  const filterTermEl = document.getElementById('searchFilterTerm');
  const clearBtn = document.getElementById('clearSearchFilterBtn');

  if (!form || !input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim().toLowerCase();

    // Validate destination presence
    if (!query) {
      errorEl.textContent = 'Please enter a destination to search (e.g. Rome, London, Greece).';
      errorEl.classList.add('visible');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }

    // Clear error
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
    input.removeAttribute('aria-invalid');

    // Filter matching destinations across all 6 destinations
    const matched = destinations.filter(dest =>
      dest.city.toLowerCase().includes(query) ||
      dest.country.toLowerCase().includes(query) ||
      dest.category.toLowerCase().includes(query) ||
      dest.description.toLowerCase().includes(query)
    );

    state.activeFilter = query;

    if (filterTermEl && feedbackBar) {
      filterTermEl.textContent = `"${input.value.trim()}" (${matched.length} found)`;
      feedbackBar.style.display = 'flex';
    }

    renderDestinations(matched, true);

    // Smoothly scroll down to destinations section
    const destSection = document.getElementById('destinations');
    if (destSection) {
      destSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Clear search filter button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      state.activeFilter = null;
      if (feedbackBar) feedbackBar.style.display = 'none';
      renderDefaultDestinations();
      showToast('Showing top selling destinations');
    });
  }

  // Clear inline error upon user typing
  input.addEventListener('input', () => {
    if (errorEl.classList.contains('visible')) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
      input.removeAttribute('aria-invalid');
    }
  });
}

/* ==========================================================================
   3. Destinations Dynamic Rendering & Detail Modal (Section 5.4 & 6)
   ========================================================================== */
function initDestinations() {
  renderDefaultDestinations();
}

function renderDefaultDestinations() {
  const itemsToRender = state.isExpandedView ? destinations : destinations.slice(0, INITIAL_VISIBLE_COUNT);
  renderDestinations(itemsToRender, false);
}

function renderDestinations(items, isSearchResult = false) {
  const grid = document.getElementById('destinationsGrid');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px;">
        <h3 style="font-size: 1.5rem; color: var(--navy); margin-bottom: 12px;">No matching destinations found</h3>
        <p style="color: var(--text-muted); margin-bottom: 20px;">Try searching for "Rome", "London", "Europe", "Greece", or "Tokyo".</p>
        <button type="button" class="btn btn-primary" id="resetSearchEmptyBtn">View All Destinations</button>
      </div>
    `;
    const resetBtn = document.getElementById('resetSearchEmptyBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const input = document.getElementById('searchDestination');
        if (input) input.value = '';
        const feedbackBar = document.getElementById('searchFeedbackBar');
        if (feedbackBar) feedbackBar.style.display = 'none';
        state.activeFilter = null;
        renderDefaultDestinations();
      });
    }
    return;
  }

  // Render cards
  const cardsHtml = items.map(dest => `
    <article class="destination-card" data-id="${dest.id}" tabindex="0" role="button" aria-label="View details for trip to ${dest.city}, ${dest.country}">
      <div class="dest-img-container">
        <img src="${dest.image}" alt="Scenic view of ${dest.city}, ${dest.country}" class="dest-img" loading="lazy" />
      </div>
      <div class="dest-body">
        <div class="dest-top-row">
          <span class="dest-name">${dest.city}, ${dest.country}</span>
          <span class="dest-price">${dest.priceFormatted}</span>
        </div>
        <div class="dest-bottom-row">
          <svg class="dest-plane-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          <span>${dest.days} Days Trip</span>
        </div>
      </div>
    </article>
  `).join('');

  // Add view all / collapse toggle when not in search mode
  let toggleHtml = '';
  if (!isSearchResult) {
    toggleHtml = `
      <div class="destinations-toggle-row" style="grid-column: 1 / -1; text-align: center; margin-top: 24px;">
        <button type="button" class="btn btn-outline btn-dest-toggle" id="destViewToggleBtn">
          ${state.isExpandedView ? 'Show Top 3 Destinations' : 'Explore All 6 Destinations'}
        </button>
      </div>
    `;
  }

  grid.innerHTML = cardsHtml + toggleHtml;

  // Toggle button event
  const toggleBtn = document.getElementById('destViewToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      state.isExpandedView = !state.isExpandedView;
      renderDefaultDestinations();
    });
  }

  // Attach click & enter key handlers to cards
  const cards = grid.querySelectorAll('.destination-card');
  cards.forEach(card => {
    const id = Number(card.getAttribute('data-id'));
    const destinationData = destinations.find(d => d.id === id);

    const openModal = () => {
      if (destinationData) {
        state.lastFocusedElement = card;
        populateAndOpenDestinationModal(destinationData);
      }
    };

    card.addEventListener('click', openModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  });
}

function populateAndOpenDestinationModal(dest) {
  const modal = document.getElementById('destinationModal');
  if (!modal) return;

  const img = document.getElementById('modalDestImage');
  const cat = document.getElementById('modalDestCategory');
  const title = document.getElementById('modalCityTitle');
  const country = document.getElementById('modalCountryText');
  const price = document.getElementById('modalPriceTag');
  const days = document.getElementById('modalDaysTag');
  const rating = document.getElementById('modalRatingText');
  const reviews = document.getElementById('modalReviewsText');
  const desc = document.getElementById('modalDescriptionText');

  if (img) {
    img.src = dest.image;
    img.alt = `Photo of ${dest.city}`;
  }
  if (cat) cat.textContent = dest.category;
  if (title) title.textContent = `${dest.city}`;
  if (country) country.textContent = `${dest.country} • Handpicked Experience`;
  if (price) price.textContent = `${dest.priceFormatted}`;
  if (days) days.textContent = `${dest.days} Days Total`;
  if (rating) rating.textContent = `${dest.rating}`;
  if (reviews) reviews.textContent = `(${dest.reviews} reviews)`;
  if (desc) desc.textContent = dest.description;

  openModalDialog(modal);
}

/* ==========================================================================
   4. Booking Trip Card & Heart Favorite Toggle
   ========================================================================== */
function initTripCardInteractions() {
  const heartBtn = document.getElementById('tripHeartBtn');
  if (heartBtn) {
    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isLiked = heartBtn.classList.toggle('active');
      heartBtn.setAttribute('aria-pressed', String(isLiked));
      if (isLiked) {
        showToast('Saved Trip To Greece to your favorite adventures! ❤️');
      } else {
        showToast('Removed Trip To Greece from saved list.');
      }
    });
  }
}

/* ==========================================================================
   5. Testimonials Carousel (Section 5.6 & 4A)
   ========================================================================== */
function initTestimonials() {
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonialBtn');
  const nextBtn = document.getElementById('nextTestimonialBtn');

  if (!dotsContainer || testimonials.length === 0) return;

  // Render pagination dots
  dotsContainer.innerHTML = testimonials.map((_, idx) => `
    <button type="button" class="testimonial-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Go to testimonial ${idx + 1}" role="tab" aria-selected="${idx === 0}"></button>
  `).join('');

  const dots = dotsContainer.querySelectorAll('.testimonial-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.getAttribute('data-index'));
      setTestimonial(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = (state.activeTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      setTestimonial(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = (state.activeTestimonialIndex + 1) % testimonials.length;
      setTestimonial(newIndex);
    });
  }

  // Initial display without fade delay
  setTestimonial(0, false);
}

function setTestimonial(index, animate = true) {
  state.activeTestimonialIndex = index;
  const current = testimonials[index];
  const nextItem = testimonials[(index + 1) % testimonials.length];

  const frontCard = document.getElementById('activeTestimonialCard');
  const avatar = document.getElementById('testimonialAvatar');
  const quote = document.getElementById('testimonialQuote');
  const name = document.getElementById('testimonialName');
  const location = document.getElementById('testimonialLocation');

  const backName = document.getElementById('backTestimonialName');
  const backLocation = document.getElementById('backTestimonialLocation');

  const updateCardContent = () => {
    if (avatar) {
      avatar.src = current.avatar;
      avatar.alt = `${current.name} portrait`;
    }
    if (quote) quote.textContent = `“${current.quote}”`;
    if (name) name.textContent = current.name;
    if (location) location.textContent = `${current.location} • ${current.role}`;

    if (backName) backName.textContent = nextItem.name;
    if (backLocation) backLocation.textContent = `${nextItem.location} • ${nextItem.role}`;
  };

  if (animate && frontCard) {
    frontCard.style.opacity = '0';
    frontCard.style.transform = 'translateY(6px)';

    setTimeout(() => {
      updateCardContent();
      frontCard.style.opacity = '1';
      frontCard.style.transform = 'translateY(0)';
    }, 150);
  } else {
    updateCardContent();
    if (frontCard) {
      frontCard.style.opacity = '1';
      frontCard.style.transform = 'translateY(0)';
    }
  }

  // Update dots
  const dots = document.querySelectorAll('.testimonial-dot');
  dots.forEach((dot, i) => {
    const isActive = i === index;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', String(isActive));
  });
}

/* ==========================================================================
   6. Modals (Destination Details & Demo Video)
   ========================================================================== */
function initModals() {
  const destModal = document.getElementById('destinationModal');
  const demoModal = document.getElementById('demoModal');
  const closeDestBtn = document.getElementById('closeDestinationModalBtn');
  const cancelDestBtn = document.getElementById('modalCancelBtn');
  const bookNowBtn = document.getElementById('modalBookNowBtn');
  const playDemoBtn = document.getElementById('playDemoBtn');
  const closeDemoBtn = document.getElementById('closeDemoModalBtn');
  const demoExploreBtn = document.getElementById('demoExploreBtn');
  const videoPlayTrigger = document.getElementById('videoPlayTrigger');

  // Close destination modal buttons
  if (closeDestBtn) closeDestBtn.addEventListener('click', () => closeModalDialog(destModal));
  if (cancelDestBtn) cancelDestBtn.addEventListener('click', () => closeModalDialog(destModal));

  // "Book Now" CTA
  if (bookNowBtn) {
    bookNowBtn.addEventListener('click', () => {
      const city = document.getElementById('modalCityTitle')?.textContent || 'this trip';
      closeModalDialog(destModal);
      showToast(`🎉 Booking request submitted for ${city}! Our travel concierge will reach out within 2 hours.`);
    });
  }

  // Play Demo Button
  if (playDemoBtn && demoModal) {
    playDemoBtn.addEventListener('click', () => {
      state.lastFocusedElement = playDemoBtn;
      openModalDialog(demoModal);
    });
  }

  if (closeDemoBtn) closeDemoBtn.addEventListener('click', () => closeModalDialog(demoModal));

  if (demoExploreBtn) {
    demoExploreBtn.addEventListener('click', () => {
      closeModalDialog(demoModal);
    });
  }

  // Mock Video Play Trigger
  if (videoPlayTrigger) {
    videoPlayTrigger.addEventListener('click', () => {
      showToast('▶ Playing 4K Jadoo destination reel preview...');
      videoPlayTrigger.style.transform = 'scale(0.9)';
      setTimeout(() => {
        videoPlayTrigger.style.transform = 'scale(1)';
      }, 200);
    });
  }

  // Close on outside backdrop click
  [destModal, demoModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModalDialog(modal);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (destModal && destModal.classList.contains('open')) closeModalDialog(destModal);
      if (demoModal && demoModal.classList.contains('open')) closeModalDialog(demoModal);
    }
  });
}

function openModalDialog(modal) {
  if (!modal) return;
  modal.removeAttribute('hidden');
  // Trigger CSS transition
  requestAnimationFrame(() => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    const closeBtn = modal.querySelector('.btn-close-modal');
    if (closeBtn) closeBtn.focus();
  });
}

function closeModalDialog(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';

  setTimeout(() => {
    modal.setAttribute('hidden', '');
    if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
      state.lastFocusedElement.focus();
    }
  }, 200);
}

/* ==========================================================================
   7. Newsletter Form Validation (Section 5.8 & 4A)
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  const feedbackEl = document.getElementById('newsletterFeedback');

  if (!form || !emailInput || !feedbackEl) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = emailInput.value.trim();

    if (!value) {
      feedbackEl.textContent = 'Please enter your email address.';
      feedbackEl.className = 'newsletter-feedback error';
      emailInput.focus();
      return;
    }

    if (!emailRegex.test(value)) {
      feedbackEl.textContent = 'Please provide a valid email format (e.g., name@example.com).';
      feedbackEl.className = 'newsletter-feedback error';
      emailInput.focus();
      return;
    }

    // Success response
    feedbackEl.textContent = '✓ Thank you for subscribing! Check your inbox for exclusive Jadoo travel deals.';
    feedbackEl.className = 'newsletter-feedback success';
    emailInput.value = '';

    showToast('Subscribed to Jadoo newsletter!');
  });

  // Clear error upon typing
  emailInput.addEventListener('input', () => {
    if (feedbackEl.classList.contains('error')) {
      feedbackEl.textContent = '';
      feedbackEl.className = 'newsletter-feedback';
    }
  });
}

/* ==========================================================================
   8. Accessible Toast Notification System
   ========================================================================== */
let toastTimeoutId = null;

function showToast(message, duration = 3800) {
  const toast = document.getElementById('toastNotification');
  const messageEl = document.getElementById('toastMessage');

  if (!toast || !messageEl) return;

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  messageEl.textContent = message;
  toast.classList.add('show');

  toastTimeoutId = setTimeout(() => {
    toast.classList.remove('show');
    toastTimeoutId = null;
  }, duration);
}
