/* ==========================================================================
   TAG É DEL É - INTERACTIVE CLIENT JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Permanent Fixed Header (handled via CSS .site-header-wrapper)

  // 2. Mobile Drawer Navigation Toggle
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  mobileToggleBtn?.addEventListener('click', () => {
    mobileDrawer?.classList.add('active');
  });

  closeDrawerBtn?.addEventListener('click', () => {
    mobileDrawer?.classList.remove('active');
  });

  // Close drawer on background click
  document.addEventListener('click', (e) => {
    if (mobileDrawer?.classList.contains('active') && 
        !mobileDrawer.contains(e.target) && 
        !mobileToggleBtn?.contains(e.target)) {
      mobileDrawer.classList.remove('active');
    }
  });

  // 3. Search Modal Toggle
  const searchToggleBtn = document.getElementById('searchToggleBtn');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchModal = document.getElementById('searchModal');

  searchToggleBtn?.addEventListener('click', () => {
    searchModal?.classList.add('active');
    searchModal?.querySelector('input')?.focus();
  });

  searchCloseBtn?.addEventListener('click', () => {
    searchModal?.classList.remove('active');
  });

  // 4. Wishlist Handler
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      const isLiked = btn.classList.contains('active');
      btn.innerHTML = isLiked ? '♥' : '♡';

      // Simple Toast Notification
      showToast(isLiked ? 'Added to Wishlist' : 'Removed from Wishlist');
    });
  });

  // 5. Trending Now Filter Tabs
  const filterTabs = document.querySelectorAll('.tab-btn');
  const trendingProducts = document.querySelectorAll('.trending-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-filter')?.toLowerCase();

      trendingProducts.forEach(item => {
        const itemCat = item.getAttribute('data-category')?.toLowerCase();
        if (filterCategory === 'all' || itemCat === filterCategory) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 7. Draggable Image Gallery Handler (Click + Drag & Touch Swipe)
  const dragContainers = document.querySelectorAll('.drag-gallery-container');
  dragContainers.forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('dragging');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  });

  // 8. Add to Cart Button Feedback State
  const cartForms = document.querySelectorAll('form[action="cart.php"]');
  cartForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('.btn-add-cart');
      if (submitBtn && !submitBtn.disabled) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '✓ ADDED TO CART';
        submitBtn.classList.add('added-state');
        setTimeout(() => {
          submitBtn.innerHTML = originalHtml;
          submitBtn.classList.remove('added-state');
        }, 1800);
      }
    });
  });

  // 9. Scroll Reveal Observer for About and Store Pages
  const revealElements = document.querySelectorAll('.about-reveal, .store-reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 10. Store Hero Parallax Effect
  const storeHeroBg = document.querySelector('.store-hero-bg');
  if (storeHeroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 1200) {
        storeHeroBg.style.transform = `translateY(${scrollY * 0.2}px) scale(1.02)`;
      }
    }, { passive: true });
  }

  // 11. Password Visibility Toggle Handler
  const eyeButtons = document.querySelectorAll('.td-eye-btn');
  eyeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.td-password-wrapper')?.querySelector('input');
      const eyeShow = btn.querySelector('.eye-show');
      const eyeHide = btn.querySelector('.eye-hide');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (eyeShow) eyeShow.style.display = 'none';
          if (eyeHide) eyeHide.style.display = 'block';
        } else {
          input.type = 'password';
          if (eyeShow) eyeShow.style.display = 'block';
          if (eyeHide) eyeHide.style.display = 'none';
        }
      }
    });
  });

  // 12. CATEGORY PRODUCT FILTER SIDEBAR ENGINE
  const filterSidebar = document.getElementById('filterSidebar');
  const categoryProductsGrid = document.getElementById('categoryProductsGrid');

  if (filterSidebar && categoryProductsGrid) {
    const productCards = Array.from(categoryProductsGrid.querySelectorAll('.product-card'));
    
    // Accordions Toggle
    const accordionHeaders = filterSidebar.querySelectorAll('.filter-accordion-header');
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordion = header.closest('.filter-accordion');
        accordion?.classList.toggle('open');
      });
    });

    // Mobile Filter Drawer Handlers
    const openMobileFilterBtn = document.getElementById('openMobileFilterBtn');
    const closeMobileFilterBtn = document.getElementById('closeMobileFilterBtn');
    const applyMobileFilterBtn = document.getElementById('applyMobileFilterBtn');

    openMobileFilterBtn?.addEventListener('click', () => {
      filterSidebar.classList.add('mobile-open');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      filterSidebar.classList.remove('mobile-open');
      document.body.style.overflow = '';
    };

    closeMobileFilterBtn?.addEventListener('click', closeDrawer);
    applyMobileFilterBtn?.addEventListener('click', closeDrawer);

    // Color indicators map
    const colorMap = {
      'Black': '#111111',
      'White': '#FFFFFF',
      'Blue': '#1E3A8A',
      'Red': '#991B1B',
      'Green': '#065F46',
      'Beige': '#D4B996',
      'Grey': '#4B5563',
      'Brown': '#78350F',
      'Purple': '#581C87'
    };

    // Extract unique filter options from DOM product cards
    const brandsSet = new Set();
    const colorsSet = new Set();
    const fabricsSet = new Set();
    const patternsSet = new Set();
    const sizesSet = new Set();
    const fitsSet = new Set();

    productCards.forEach(card => {
      const b = card.getAttribute('data-brand');
      const c = card.getAttribute('data-color');
      const f = card.getAttribute('data-fabric');
      const p = card.getAttribute('data-pattern');
      const sz = card.getAttribute('data-sizes');
      const fit = card.getAttribute('data-fit');

      if (b) brandsSet.add(b);
      if (c) colorsSet.add(c);
      if (f) fabricsSet.add(f);
      if (p) patternsSet.add(p);
      if (fit) fitsSet.add(fit);
      if (sz) {
        sz.split(',').forEach(s => sizesSet.add(s.trim()));
      }
    });

    // Populate Brand Checklist
    const brandListEl = document.getElementById('brandOptionsList');
    if (brandListEl) {
      const brandsArr = Array.from(brandsSet).sort();
      brandListEl.innerHTML = brandsArr.map(brand => `
        <label class="filter-option-item">
          <input type="checkbox" class="filter-real-chk filter-input" data-type="brand" value="${brand}">
          <span class="custom-chk-box"></span>
          <span class="filter-option-text">${brand}</span>
        </label>
      `).join('');
    }

    // Brand Search Filter
    const brandSearchInput = document.getElementById('brandSearchInput');
    brandSearchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const items = brandListEl?.querySelectorAll('.filter-option-item');
      items?.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });

    // Populate Color Checklist
    const colorListEl = document.getElementById('colorOptionsList');
    if (colorListEl) {
      const colorsArr = Array.from(colorsSet).sort();
      colorListEl.innerHTML = colorsArr.map(color => {
        const hex = colorMap[color] || '#888888';
        const isWhite = color.toLowerCase() === 'white';
        return `
          <label class="filter-option-item">
            <input type="checkbox" class="filter-real-chk filter-input" data-type="color" value="${color}">
            <span class="custom-chk-box"></span>
            <span class="color-dot" style="background:${hex};${isWhite ? 'border:1px solid #CBD5E1;' : ''}"></span>
            <span class="filter-option-text">${color}</span>
          </label>
        `;
      }).join('');
    }

    // Populate Fabric Checklist
    const fabricListEl = document.getElementById('fabricOptionsList');
    if (fabricListEl) {
      const fabricArr = Array.from(fabricsSet).sort();
      fabricListEl.innerHTML = fabricArr.map(fab => `
        <label class="filter-option-item">
          <input type="checkbox" class="filter-real-chk filter-input" data-type="fabric" value="${fab}">
          <span class="custom-chk-box"></span>
          <span class="filter-option-text">${fab}</span>
        </label>
      `).join('');
    }

    // Populate Pattern Checklist
    const patternListEl = document.getElementById('patternOptionsList');
    if (patternListEl) {
      const patternArr = Array.from(patternsSet).sort();
      patternListEl.innerHTML = patternArr.map(pat => `
        <label class="filter-option-item">
          <input type="checkbox" class="filter-real-chk filter-input" data-type="pattern" value="${pat}">
          <span class="custom-chk-box"></span>
          <span class="filter-option-text">${pat}</span>
        </label>
      `).join('');
    }

    // Populate Size Chips Grid
    const sizeListEl = document.getElementById('sizeOptionsList');
    if (sizeListEl) {
      const sizesArr = Array.from(sizesSet).sort((a, b) => {
        const order = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38'];
        return order.indexOf(a) - order.indexOf(b);
      });
      sizeListEl.innerHTML = sizesArr.map(sz => `
        <label class="filter-option-item size-grid-item">
          <input type="checkbox" class="filter-real-chk filter-input" data-type="size" value="${sz}">
          <span class="custom-chk-box"></span>
          <span class="filter-option-text">${sz}</span>
        </label>
      `).join('');
    }

    // Populate Fit Checklist
    const fitListEl = document.getElementById('fitOptionsList');
    if (fitListEl) {
      const fitArr = Array.from(fitsSet).sort();
      fitListEl.innerHTML = fitArr.map(fit => `
        <label class="filter-option-item">
          <input type="checkbox" class="filter-real-chk filter-input" data-type="fit" value="${fit}">
          <span class="custom-chk-box"></span>
          <span class="filter-option-text">${fit}</span>
        </label>
      `).join('');
    }

    // Populate Price Checklist
    const priceListEl = document.getElementById('priceOptionsList');
    if (priceListEl) {
      const priceRanges = [
        { label: 'Under ₹999', val: '0-999' },
        { label: '₹1,000 – ₹1,499', val: '1000-1499' },
        { label: '₹1,500 – ₹1,999', val: '1500-1999' },
        { label: '₹2,000 – ₹2,999', val: '2000-2999' },
        { label: '₹3,000+', val: '3000-99999' }
      ];
      priceListEl.innerHTML = priceRanges.map(pr => `
        <label class="filter-option-item">
          <input type="checkbox" class="filter-real-chk filter-input" data-type="price" value="${pr.val}">
          <span class="custom-chk-box"></span>
          <span class="filter-option-text">${pr.label}</span>
        </label>
      `).join('');
    }

    // Filter Logic Core
    function applyFilters() {
      const selectedFilters = {
        brand: [],
        color: [],
        fabric: [],
        pattern: [],
        size: [],
        fit: [],
        price: []
      };

      const checkedInputs = filterSidebar.querySelectorAll('.filter-input:checked');
      checkedInputs.forEach(input => {
        const type = input.getAttribute('data-type');
        if (selectedFilters[type]) {
          selectedFilters[type].push(input.value);
        }
      });

      let visibleCount = 0;

      productCards.forEach(card => {
        const cBrand = card.getAttribute('data-brand');
        const cColor = card.getAttribute('data-color');
        const cFabric = card.getAttribute('data-fabric');
        const cPattern = card.getAttribute('data-pattern');
        const cFit = card.getAttribute('data-fit');
        const cSizes = (card.getAttribute('data-sizes') || '').split(',').map(s => s.trim());
        const cPrice = parseFloat(card.getAttribute('data-price') || '0');

        // Brand Match
        const matchBrand = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(cBrand);
        // Color Match
        const matchColor = selectedFilters.color.length === 0 || selectedFilters.color.includes(cColor);
        // Fabric Match
        const matchFabric = selectedFilters.fabric.length === 0 || selectedFilters.fabric.includes(cFabric);
        // Pattern Match
        const matchPattern = selectedFilters.pattern.length === 0 || selectedFilters.pattern.includes(cPattern);
        // Fit Match
        const matchFit = selectedFilters.fit.length === 0 || selectedFilters.fit.includes(cFit);
        // Size Match
        const matchSize = selectedFilters.size.length === 0 || selectedFilters.size.some(sz => cSizes.includes(sz));
        // Price Match
        const matchPrice = selectedFilters.price.length === 0 || selectedFilters.price.some(range => {
          const [min, max] = range.split('-').map(Number);
          return cPrice >= min && cPrice <= max;
        });

        const isMatch = matchBrand && matchColor && matchFabric && matchPattern && matchFit && matchSize && matchPrice;

        if (isMatch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update visible products counter
      const visibleProductsCountEl = document.getElementById('visibleProductsCount');
      if (visibleProductsCountEl) {
        visibleProductsCountEl.textContent = visibleCount;
      }

      // Update Active Filter Count Badge
      const totalChecked = checkedInputs.length;
      const activeFilterBadge = document.getElementById('activeFilterBadge');
      if (activeFilterBadge) {
        if (totalChecked > 0) {
          activeFilterBadge.textContent = totalChecked;
          activeFilterBadge.style.display = 'inline-flex';
        } else {
          activeFilterBadge.style.display = 'none';
        }
      }

      // Render Active Filter Chips
      const activeFilterChips = document.getElementById('activeFilterChips');
      if (activeFilterChips) {
        if (totalChecked > 0) {
          activeFilterChips.style.display = 'flex';
          let chipsHtml = '';
          checkedInputs.forEach(input => {
            const val = input.value;
            let displayVal = val;
            if (val === '0-999') displayVal = 'Under ₹999';
            else if (val === '1000-1499') displayVal = '₹1,000 – ₹1,499';
            else if (val === '1500-1999') displayVal = '₹1,500 – ₹1,999';
            else if (val === '2000-2999') displayVal = '₹2,000 – ₹2,999';
            else if (val === '3000-99999') displayVal = '₹3,000+';

            chipsHtml += `
              <span class="active-filter-chip">
                ${displayVal}
                <button type="button" class="remove-chip-btn" data-val="${val}">✕</button>
              </span>
            `;
          });
          chipsHtml += `<button type="button" class="clear-all-chips-btn" id="clearAllChipsBtn">Clear All</button>`;
          activeFilterChips.innerHTML = chipsHtml;

          // Add removal handlers for chips
          activeFilterChips.querySelectorAll('.remove-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const targetVal = btn.getAttribute('data-val');
              const targetInput = filterSidebar.querySelector(`.filter-input[value="${targetVal}"]`);
              if (targetInput) {
                targetInput.checked = false;
                applyFilters();
              }
            });
          });

          document.getElementById('clearAllChipsBtn')?.addEventListener('click', resetAllFilters);
        } else {
          activeFilterChips.style.display = 'none';
          activeFilterChips.innerHTML = '';
        }
      }

      // Handle Empty State Display
      let emptyMsg = document.getElementById('filterEmptyMessage');
      if (visibleCount === 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = 'filterEmptyMessage';
          emptyMsg.className = 'empty-cart-card';
          emptyMsg.style.gridColumn = '1 / -1';
          emptyMsg.innerHTML = `
            <div style="font-size:3.5rem; margin-bottom:12px;">🔍</div>
            <h2>NO MATCHING PRODUCTS</h2>
            <p class="section-subtitle">No products match your selected filters. Try clearing some filters.</p>
            <br>
            <button class="btn-primary" id="emptyResetBtn">CLEAR ALL FILTERS</button>
          `;
          categoryProductsGrid.appendChild(emptyMsg);
          document.getElementById('emptyResetBtn')?.addEventListener('click', resetAllFilters);
        }
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    }

    // Reset All Filters Handler
    function resetAllFilters() {
      const checkedInputs = filterSidebar.querySelectorAll('.filter-input:checked');
      checkedInputs.forEach(input => input.checked = false);
      if (brandSearchInput) brandSearchInput.value = '';
      const brandItems = brandListEl?.querySelectorAll('.filter-option-item');
      brandItems?.forEach(item => item.style.display = 'flex');
      applyFilters();
    }

    // Attach Change Event Listeners to Sidebar Checkboxes
    filterSidebar.addEventListener('change', (e) => {
      if (e.target.classList.contains('filter-input')) {
        applyFilters();
      }
    });

    const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');
    clearAllFiltersBtn?.addEventListener('click', resetAllFilters);

    // Initial Filter Run to setup count and states
    applyFilters();

    // Sorting functionality
    function sortProducts(criteria) {
      let sortedCards = productCards.slice();
      if (criteria === 'price-low') {
        sortedCards.sort((a, b) => parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price')));
      } else if (criteria === 'price-high') {
        sortedCards.sort((a, b) => parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price')));
      } else if (criteria === 'newest') {
        sortedCards.sort((a, b) => parseInt(b.getAttribute('data-id')) - parseInt(a.getAttribute('data-id')));
      }
      sortedCards.forEach(card => categoryProductsGrid.appendChild(card));
    }

    const desktopSortSelect = document.getElementById('desktopSortSelect');
    const mobileSortSelect = document.getElementById('mobileSortSelect');

    desktopSortSelect?.addEventListener('change', (e) => sortProducts(e.target.value));
    mobileSortSelect?.addEventListener('change', (e) => sortProducts(e.target.value));
  }

  // 13. MODELVIDEO SCROLL-CONTROLLED FRAME-BY-FRAME ENGINE
  const modelvideoSection = document.getElementById('modelvideoScrollSection');
  const modelvideoElem = document.getElementById('modelVideoElem');
  const modelvideoCanvas = document.getElementById('modelVideoCanvas');
  const modelvideoLoader = document.getElementById('modelvideoLoader');

  if (modelvideoSection && modelvideoElem && modelvideoCanvas) {
    const ctx = modelvideoCanvas.getContext('2d');
    let videoDuration = 0;
    let isVideoReady = false;
    let targetTime = 0;
    let currentTime = 0;
    let isSeeking = false;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeModelCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = modelvideoCanvas.getBoundingClientRect();
      modelvideoCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
      modelvideoCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
      drawCurrentFrame();
    }

    function drawCurrentFrame() {
      if (!ctx || !modelvideoElem || modelvideoElem.readyState < 2) return;
      const cw = modelvideoCanvas.width;
      const ch = modelvideoCanvas.height;
      if (cw === 0 || ch === 0) return;

      const vw = modelvideoElem.videoWidth || 1920;
      const vh = modelvideoElem.videoHeight || 1080;

      const videoRatio = vw / vh;
      const canvasRatio = cw / ch;

      let drawW, drawH, drawX, drawY;

      if (canvasRatio > videoRatio) {
        drawW = cw;
        drawH = cw / videoRatio;
        drawX = 0;
        drawY = (ch - drawH) / 2;
      } else {
        drawH = ch;
        drawW = ch * videoRatio;
        drawX = (cw - drawW) / 2;
        drawY = 0;
      }

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(modelvideoElem, drawX, drawY, drawW, drawH);
    }

    function initVideo() {
      videoDuration = modelvideoElem.duration || 5;
      isVideoReady = true;
      if (modelvideoLoader) {
        modelvideoLoader.classList.add('loaded');
      }
      resizeModelCanvas();
    }

    modelvideoElem.addEventListener('loadedmetadata', initVideo);
    modelvideoElem.addEventListener('canplaythrough', () => {
      if (modelvideoLoader) modelvideoLoader.classList.add('loaded');
      drawCurrentFrame();
    });
    modelvideoElem.addEventListener('seeked', () => {
      isSeeking = false;
      drawCurrentFrame();
    });

    window.addEventListener('resize', resizeModelCanvas, { passive: true });

    function onScrollScrub() {
      if (!isVideoReady || !videoDuration) return;

      const rect = modelvideoSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollableDistance = rect.height - viewportHeight;

      if (scrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, (-rect.top) / scrollableDistance));

      if (prefersReducedMotion) {
        targetTime = 0.5;
      } else {
        targetTime = progress * (videoDuration - 0.05);
      }
    }

    function tick() {
      if (isVideoReady && videoDuration > 0) {
        const diff = targetTime - currentTime;
        if (Math.abs(diff) > 0.005) {
          currentTime += diff * 0.22;
          if (!isSeeking) {
            isSeeking = true;
            try {
              if (modelvideoElem.fastSeek) {
                modelvideoElem.fastSeek(currentTime);
              } else {
                modelvideoElem.currentTime = currentTime;
              }
            } catch (e) {
              isSeeking = false;
            }
          }
          drawCurrentFrame();
        }
      }
      requestAnimationFrame(tick);
    }

    modelvideoElem.load();
    window.addEventListener('scroll', onScrollScrub, { passive: true });
    onScrollScrub();
    tick();
  }
});

// Toast notification helper
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(11, 15, 23, 0.95);
      border: 1px solid #E06D53;
      color: #FFFFFF;
      padding: 14px 24px;
      border-radius: 9999px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.88rem;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}
