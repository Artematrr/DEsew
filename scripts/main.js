document.addEventListener('DOMContentLoaded', () => {
	// Base state
	const body = document.body
	const menu = document.querySelector('.js-mobile-menu')
	const menuToggle = document.querySelector('.js-menu-toggle')
	const menuCloseButtons = document.querySelectorAll('.js-menu-close')
	const mobileMenuView = document.querySelector('.js-mobile-menu-view')
	const mobileCatalogView = document.querySelector('.js-mobile-catalog-view')
	const mobileCatalogOpen = document.querySelector('.js-mobile-catalog-open')
	const mobileCatalogClose = document.querySelector('.js-mobile-catalog-close')
	const catalogFilter = document.querySelector('.js-catalog-filter')
	const catalogFilterToggle = document.querySelector('.js-catalog-filter-toggle')
	const catalogFilterOverlay = document.querySelector('.js-catalog-filter-overlay')
	const catalogFilterCloseButtons = document.querySelectorAll('.js-catalog-filter-close')
	const catalogFilterMedia = window.matchMedia('(max-width: 992px)')

	// Page scroll lock
	const syncBodyLock = () => {
		const hasOpenMenu = Boolean(menu?.classList.contains('is-open'))
		const hasOpenModal = Boolean(document.querySelector('.modal.is-open'))

		body.classList.toggle('is-fixed', hasOpenMenu || hasOpenModal)
	}

	// Mobile catalog screen
	const openMobileCatalog = () => {
		if (!menu || !mobileMenuView || !mobileCatalogView) {
			return
		}

		menu.classList.add('is-catalog-open')
		mobileMenuView.setAttribute('aria-hidden', 'true')
		mobileCatalogView.setAttribute('aria-hidden', 'false')
	}

	const closeMobileCatalog = () => {
		if (!menu || !mobileMenuView || !mobileCatalogView) {
			return
		}

		menu.classList.remove('is-catalog-open')
		mobileMenuView.setAttribute('aria-hidden', 'false')
		mobileCatalogView.setAttribute('aria-hidden', 'true')
	}

	// Mobile menu
	const openMenu = () => {
		if (!menu || !menuToggle) {
			return
		}

		menu.classList.add('is-open')
		menu.setAttribute('aria-hidden', 'false')
		menuToggle.classList.add('is-active')
		menuToggle.setAttribute('aria-expanded', 'true')
		syncBodyLock()
	}

	const closeMenu = () => {
		if (!menu || !menuToggle) {
			return
		}

		menu.classList.remove('is-open')
		menu.setAttribute('aria-hidden', 'true')
		menuToggle.classList.remove('is-active')
		menuToggle.setAttribute('aria-expanded', 'false')
		closeMobileCatalog()
		syncBodyLock()
	}

	menuToggle?.addEventListener('click', () => {
		if (menu?.classList.contains('is-open')) {
			closeMenu()
		} else {
			openMenu()
		}
	})

	menuCloseButtons.forEach(button => {
		button.addEventListener('click', closeMenu)
	})

	mobileCatalogOpen?.addEventListener('click', openMobileCatalog)
	mobileCatalogClose?.addEventListener('click', closeMobileCatalog)

	// Catalog mobile filter
	const openCatalogFilter = () => {
		if (!catalogFilter || !catalogFilterToggle) {
			return
		}

		catalogFilter.classList.add('is-open')
		catalogFilterOverlay?.classList.add('is-open')
		catalogFilter.removeAttribute('aria-hidden')
		catalogFilterToggle.classList.add('is-active')
		catalogFilterToggle.setAttribute('aria-expanded', 'true')
	}

	const closeCatalogFilter = () => {
		if (!catalogFilter || !catalogFilterToggle) {
			return
		}

		catalogFilter.classList.remove('is-open')
		catalogFilterOverlay?.classList.remove('is-open')
		if (catalogFilterMedia.matches) {
			catalogFilter.setAttribute('aria-hidden', 'true')
		} else {
			catalogFilter.removeAttribute('aria-hidden')
		}
		catalogFilterToggle.classList.remove('is-active')
		catalogFilterToggle.setAttribute('aria-expanded', 'false')
	}

	catalogFilterToggle?.addEventListener('click', () => {
		if (catalogFilter?.classList.contains('is-open')) {
			closeCatalogFilter()
		} else {
			openCatalogFilter()
		}
	})

	catalogFilterCloseButtons.forEach(button => {
		button.addEventListener('click', closeCatalogFilter)
	})

	// Modals
	if (typeof MicroModal !== 'undefined') {
		MicroModal.init({
			openClass: 'is-open',
			disableScroll: true,
			awaitOpenAnimation: false,
			awaitCloseAnimation: false,
			onShow: syncBodyLock,
			onClose: () => {
				requestAnimationFrame(syncBodyLock)
			},
		})
	}

	// Header search
	document.querySelectorAll('.js-search').forEach(search => {
		const toggle = search.querySelector('.js-search-toggle')
		const input = search.querySelector('.js-search-input')

		toggle?.addEventListener('click', () => {
			search.classList.add('is-open')
			input?.focus()
		})

		document.addEventListener('click', event => {
			const isSearchClick = search.contains(event.target)

			if (!isSearchClick && !input?.value) {
				search.classList.remove('is-open')
			}
		})
	})

	// Dropdowns
	document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
		const toggle = dropdown.querySelector('[data-dropdown-toggle]')
		const label = dropdown.querySelector('[data-dropdown-label]')
		const closeDropdown = () => {
			dropdown.classList.remove('is-open')
			toggle?.setAttribute('aria-expanded', 'false')
		}

		toggle?.addEventListener('click', () => {
			const isOpen = dropdown.classList.toggle('is-open')

			toggle.setAttribute('aria-expanded', String(isOpen))
		})

		dropdown.querySelectorAll('[data-dropdown-option]').forEach(option => {
			option.addEventListener('click', () => {
				const value = option.dataset.dropdownValue || option.textContent.trim()

				if (label) {
					label.textContent = value
				}

				dropdown.querySelectorAll('[data-dropdown-option]').forEach(item => {
					const isSelected = item === option

					item.classList.toggle('is-active', isSelected)
					item.setAttribute('aria-selected', String(isSelected))
				})

				closeDropdown()
			})
		})

		dropdown.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', closeDropdown)
		})

		document.addEventListener('click', event => {
			if (!dropdown.contains(event.target)) {
				closeDropdown()
			}
		})
	})

	// Accordions
	document.querySelectorAll('[data-accordion]').forEach(accordion => {
		const toggle = accordion.querySelector('[data-accordion-toggle]')

		toggle?.addEventListener('click', () => {
			const isExpanded = accordion.classList.toggle('is-expanded')

			toggle.setAttribute('aria-expanded', String(isExpanded))
		})
	})

	// Catalog filter groups
	document.querySelectorAll('.js-filter-group-toggle').forEach(toggle => {
		const group = toggle.closest('.catalog-filter__group')

		toggle.addEventListener('click', () => {
			if (!group) {
				return
			}

			const isExpanded = group.classList.toggle('is-expanded')

			toggle.setAttribute('aria-expanded', String(isExpanded))
		})
	})

	// Catalog range filters
	const formatRangeValue = value => {
		const number = Number(value)

		if (Number.isInteger(number)) {
			return String(number)
		}

		return String(Math.round(number * 10) / 10).replace('.', ',')
	}

	const updateRangeFields = (slider, values) => {
		const range = slider.closest('.catalog-filter__range')
		const fromInput = range?.querySelector('.js-range-from')
		const toInput = range?.querySelector('.js-range-to')

		if (fromInput) {
			fromInput.value = formatRangeValue(values[0])
		}

		if (toInput) {
			toInput.value = formatRangeValue(values[1])
		}
	}

	if (window.jQuery && typeof window.jQuery.fn.slider === 'function') {
		document.querySelectorAll('.js-range-slider').forEach(slider => {
			const min = Number(slider.dataset.min)
			const max = Number(slider.dataset.max)
			const from = Number(slider.dataset.from || min)
			const to = Number(slider.dataset.to || max)
			const step = Number(slider.dataset.step || 1)
			const $slider = window.jQuery(slider)

			slider.dataset.defaultFrom = String(from)
			slider.dataset.defaultTo = String(to)

			$slider.slider({
				range: true,
				min,
				max,
				step,
				values: [from, to],
				slide(event, ui) {
					updateRangeFields(slider, ui.values)
				},
				change(event, ui) {
					updateRangeFields(slider, ui.values)
				},
			})

			updateRangeFields(slider, [from, to])
		})
	}

	document.querySelectorAll('[data-catalog-filter-form]').forEach(form => {
		form.addEventListener('submit', event => {
			event.preventDefault()
			closeCatalogFilter()
		})

		form.addEventListener('reset', () => {
			requestAnimationFrame(() => {
				form.querySelectorAll('.js-range-slider').forEach(slider => {
					if (!window.jQuery || typeof window.jQuery.fn.slider !== 'function') {
						return
					}

					const from = Number(slider.dataset.defaultFrom || slider.dataset.min)
					const to = Number(slider.dataset.defaultTo || slider.dataset.max)

					window.jQuery(slider).slider('values', [from, to])
					updateRangeFields(slider, [from, to])
				})
			})
		})
	})

	// Static forms
	document.querySelectorAll('.js-static-form').forEach(form => {
		form.addEventListener('submit', event => {
			event.preventDefault()
		})
	})

	// Dealer cards
	document.querySelectorAll('.js-dealer-card').forEach(card => {
		card.addEventListener('click', event => {
			if (event.target.closest('a')) {
				return
			}

			const group = card.closest('.dealers__shops')

			group?.querySelectorAll('.js-dealer-card').forEach(item => {
				item.classList.toggle('is-active', item === card)
			})
		})
	})

	// Product tabs
	document.querySelectorAll('.js-product-tabs').forEach(tabs => {
		const tabButtons = tabs.querySelectorAll('.js-product-tab')
		const panels = tabs.querySelectorAll('.js-product-panel')

		const activateTab = target => {
			tabButtons.forEach(button => {
				const isActive = button.dataset.tabTarget === target

				button.classList.toggle('is-active', isActive)
				button.setAttribute('aria-selected', String(isActive))
			})

			panels.forEach(panel => {
				const isActive = panel.dataset.tabPanel === target

				panel.classList.toggle('is-active', isActive)
				panel.toggleAttribute('hidden', !isActive)
			})
		}

		tabButtons.forEach(button => {
			button.addEventListener('click', () => {
				activateTab(button.dataset.tabTarget)
			})
		})
	})

	// Product gallery and lightbox
	document.querySelectorAll('.js-product-gallery').forEach(gallery => {
		const mainButton = gallery.querySelector('.js-product-gallery-main')
		const mainImage = gallery.querySelector('.js-product-gallery-image')
		const thumbs = gallery.querySelectorAll('.js-product-gallery-thumb')
		const lightbox = document.querySelector('.js-product-lightbox')
		const lightboxImage = lightbox?.querySelector('.js-product-lightbox-image')
		const lightboxThumbs = lightbox?.querySelectorAll('.js-product-lightbox-thumb') || []
		const closeButtons = lightbox?.querySelectorAll('.js-product-lightbox-close') || []
		const prevButton = lightbox?.querySelector('.js-product-lightbox-prev')
		const nextButton = lightbox?.querySelector('.js-product-lightbox-next')
		const images = Array.from(thumbs).map(thumb => {
			const image = thumb.querySelector('img')

			return {
				src: image?.getAttribute('src') || '',
				alt: image?.getAttribute('alt') || mainImage?.getAttribute('alt') || '',
			}
		})
		let activeIndex = 0

		const updateThumbs = (items, index) => {
			items.forEach((thumb, thumbIndex) => {
				const isActive = thumbIndex === index

				thumb.classList.toggle('is-active', isActive)
				thumb.toggleAttribute('aria-current', isActive)
			})
		}

		const setActiveImage = index => {
			if (!images.length) {
				return
			}

			activeIndex = (index + images.length) % images.length
			const activeImage = images[activeIndex]

			if (mainImage) {
				mainImage.src = activeImage.src
				mainImage.alt = activeImage.alt || 'DESEW SmartStitch 500'
			}

			if (lightboxImage) {
				lightboxImage.src = activeImage.src
				lightboxImage.alt = activeImage.alt || 'DESEW SmartStitch 500'
			}

			updateThumbs(thumbs, activeIndex)
			updateThumbs(lightboxThumbs, activeIndex)
		}

		const openLightbox = () => {
			if (!lightbox) {
				return
			}

			lightbox.classList.add('is-open')
			lightbox.setAttribute('aria-hidden', 'false')
			body.classList.add('is-lock')
			setActiveImage(activeIndex)
		}

		const closeLightbox = () => {
			if (!lightbox) {
				return
			}

			lightbox.classList.remove('is-open')
			lightbox.setAttribute('aria-hidden', 'true')
			body.classList.remove('is-lock')
		}

		thumbs.forEach((thumb, index) => {
			thumb.addEventListener('click', () => {
				setActiveImage(index)
			})
		})

		lightboxThumbs.forEach((thumb, index) => {
			thumb.addEventListener('click', () => {
				setActiveImage(index)
			})
		})

		mainButton?.addEventListener('click', openLightbox)
		closeButtons.forEach(button => {
			button.addEventListener('click', closeLightbox)
		})
		prevButton?.addEventListener('click', () => setActiveImage(activeIndex - 1))
		nextButton?.addEventListener('click', () => setActiveImage(activeIndex + 1))

		document.addEventListener('keydown', event => {
			if (event.key === 'Escape') {
				closeLightbox()
			}
		})
	})

	// Sliders
	if (typeof Swiper !== 'undefined') {
		const getHeroPaginationSize = distance => {
			if (distance === 0) {
				return '01'
			}

			if (distance <= 2) {
				return '02'
			}

			if (distance === 3) {
				return '03'
			}

			return '04'
		}

		const updateHeroPagination = (pagination, activeIndex) => {
			pagination?.querySelectorAll('.hero-pagination__button').forEach(button => {
				const buttonIndex = Number(button.dataset.slideIndex)
				const distance = Math.abs(buttonIndex - activeIndex)
				const size = getHeroPaginationSize(distance)
				const image = button.querySelector('img')
				const isActive = buttonIndex === activeIndex

				button.classList.toggle('is-active', isActive)
				button.toggleAttribute('aria-current', isActive)

				if (image) {
					image.src = `/images/icons/slider-pagination-button-size-${size}.svg`
				}
			})
		}

		document.querySelectorAll('.js-hero-slider').forEach(hero => {
			const swiperElement = hero.querySelector('.swiper')
			const pagination = hero.querySelector('.js-hero-pagination')
			const buttons = pagination?.querySelectorAll('.hero-pagination__button') || []

			if (!swiperElement || swiperElement.dataset.swiperInitialized) {
				return
			}

			swiperElement.dataset.swiperInitialized = 'true'

			const heroSwiper = new Swiper(swiperElement, {
				slidesPerView: 1,
				effect: 'fade',
				speed: 550,
				allowTouchMove: true,
				fadeEffect: {
					crossFade: true,
				},
				on: {
					init(swiper) {
						updateHeroPagination(pagination, swiper.activeIndex)
					},
					slideChange(swiper) {
						updateHeroPagination(pagination, swiper.activeIndex)
					},
				},
			})

			buttons.forEach(button => {
				button.addEventListener('click', () => {
					heroSwiper.slideTo(Number(button.dataset.slideIndex))
				})
			})
		})

		document.querySelectorAll('.js-products-slider').forEach(slider => {
			const swiperElement = slider.querySelector('.swiper')
			const productsSliderMedia = window.matchMedia('(min-width: 993px)')

			if (!swiperElement || swiperElement.dataset.swiperInitialized || !productsSliderMedia.matches) {
				return
			}

			swiperElement.dataset.swiperInitialized = 'true'

			new Swiper(swiperElement, {
				slidesPerView: 4,
				spaceBetween: 24,
				speed: 500,
				loop: true,
				pagination: {
					el: slider.querySelector('.popular-products__pagination'),
					clickable: true,
				},
			})
		})

		document.querySelectorAll('.js-slider').forEach(slider => {
			const swiperElement = slider.querySelector('.swiper')

			if (!swiperElement || swiperElement.dataset.swiperInitialized) {
				return
			}

			swiperElement.dataset.swiperInitialized = 'true'

			new Swiper(swiperElement, {
				slidesPerView: 1,
				spaceBetween: 24,
				pagination: {
					el: slider.querySelector('.slider__pagination'),
					clickable: true,
				},
				navigation: {
					prevEl: slider.querySelector('.slider__button--prev'),
					nextEl: slider.querySelector('.slider__button--next'),
				},
				breakpoints: {
					768: {
						slidesPerView: 2,
					},
					1024: {
						slidesPerView: 3,
					},
				},
			})
		})
	}

	// Global keyboard handlers
	document.addEventListener('keydown', event => {
		if (event.key !== 'Escape') {
			return
		}

		closeMenu()
		closeCatalogFilter()

		document.querySelectorAll('[data-dropdown].is-open').forEach(dropdown => {
			dropdown.classList.remove('is-open')
			dropdown
				.querySelector('[data-dropdown-toggle]')
				?.setAttribute('aria-expanded', 'false')
		})

		document.querySelectorAll('.js-search.is-open').forEach(search => {
			search.classList.remove('is-open')
		})
	})
})
