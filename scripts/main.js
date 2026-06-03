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
	const catalogFilterCloseButtons = document.querySelectorAll('.js-catalog-filter-close')
	const catalogFilterMedia = window.matchMedia('(max-width: 992px)')

	// Page scroll lock
	const syncBodyLock = () => {
		const hasOpenMenu = Boolean(menu?.classList.contains('is-open'))
		const hasOpenModal = Boolean(
			document.querySelector('.modal.is-open, .video-modal.is-open')
		)

		body.classList.toggle('is-fixed', hasOpenMenu || hasOpenModal)
	}

	// Mobile catalog screen
	const openMobileCatalog = () => {
		if (!menu || !mobileMenuView || !mobileCatalogView) {
			return
		}

		closeProductLightbox()
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

		closeProductLightbox()
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
		catalogFilter.removeAttribute('aria-hidden')
		catalogFilterToggle.classList.add('is-active')
		catalogFilterToggle.setAttribute('aria-expanded', 'true')
	}

	const closeCatalogFilter = () => {
		if (!catalogFilter || !catalogFilterToggle) {
			return
		}

		catalogFilter.classList.remove('is-open')
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

	const closeProductLightbox = () => {
		const lightbox = document.querySelector('.js-product-lightbox')

		if (!lightbox) {
			return
		}

		lightbox.classList.remove('is-open')
		lightbox.setAttribute('aria-hidden', 'true')
		body.classList.remove('is-lock')
	}

	// Video modal
	const videoModal = document.querySelector('.js-video-modal')
	const videoIframe = videoModal?.querySelector('.js-video-iframe')
	const videoTitle = videoModal?.querySelector('.js-video-title')
	const videoProvider = videoModal?.querySelector('.js-video-provider')
	let activeVideoTrigger = null

	const closeVideoModal = () => {
		if (!videoModal) {
			return
		}

		videoModal.classList.remove('is-open')
		videoModal.setAttribute('aria-hidden', 'true')

		if (videoIframe) {
			videoIframe.src = ''
		}

		requestAnimationFrame(syncBodyLock)
		activeVideoTrigger?.focus()
		activeVideoTrigger = null
	}

	document.querySelectorAll('.js-video-open').forEach(button => {
		button.addEventListener('click', () => {
			const source = button.dataset.videoSrc

			if (!videoModal || !videoIframe || !source) {
				return
			}

			const title = button.dataset.videoTitle || 'Видеообзор DESEW'
			const provider = button.dataset.videoProvider || 'Видео'

			activeVideoTrigger = button
			videoIframe.src = source
			videoIframe.title = title
			if (videoTitle) {
				videoTitle.textContent = title
			}
			if (videoProvider) {
				videoProvider.textContent = provider
			}

			closeProductLightbox()
			videoModal.classList.add('is-open')
			videoModal.setAttribute('aria-hidden', 'false')
			syncBodyLock()
		})
	})

	videoModal?.querySelectorAll('.js-video-close').forEach(button => {
		button.addEventListener('click', closeVideoModal)
	})

	document.addEventListener('keydown', event => {
		if (event.key === 'Escape' && videoModal?.classList.contains('is-open')) {
			closeVideoModal()
		}
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

			if (isOpen && dropdown.closest('.header')) {
				closeProductLightbox()
			}
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

	const parseRangeValue = value => {
		const normalizedValue = String(value).trim().replace(',', '.')

		if (!/^-?\d+(\.\d+)?$/.test(normalizedValue)) {
			return null
		}

		const number = Number(normalizedValue)

		return Number.isFinite(number) ? number : null
	}

	const getStepPrecision = step => {
		const stepString = String(step)
		const decimals = stepString.includes('.') ? stepString.split('.')[1].length : 0

		return decimals
	}

	const clampRangeValue = (value, min, max) => Math.min(Math.max(value, min), max)

	const snapRangeValue = (value, min, step) => {
		const precision = getStepPrecision(step)
		const snappedValue = min + Math.round((value - min) / step) * step

		return Number(snappedValue.toFixed(precision))
	}

	const updateRangeScale = (slider, values) => {
		const labels = slider.querySelectorAll('.catalog-filter__scale-value')

		if (labels.length < 2) {
			return
		}

		labels[0].textContent = formatRangeValue(values[0])
		labels[1].textContent = formatRangeValue(values[1])
	}

	const prepareRangeScale = (slider, values) => {
		const scale = slider.querySelector('.catalog-filter__scale')
		const handles = slider.querySelectorAll('.ui-slider-handle')

		if (handles.length < 2) {
			return
		}

		let labels = Array.from(slider.querySelectorAll('.catalog-filter__scale-value'))

		if (labels.length < 2) {
			const scaleLabels = Array.from(scale?.querySelectorAll('span') || [])
			const fromLabel = scaleLabels[0] || document.createElement('span')
			const toLabel = scaleLabels[scaleLabels.length - 1] || document.createElement('span')

			labels = [fromLabel, toLabel]
		}

		labels[0].classList.add('catalog-filter__scale-value')
		labels[1].classList.add('catalog-filter__scale-value')
		handles[0].append(labels[0])
		handles[1].append(labels[1])
		scale?.remove()

		updateRangeScale(slider, values)
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

		updateRangeScale(slider, values)
	}

	const setRangeValueFromInput = (slider, input, handleIndex) => {
		const value = parseRangeValue(input.value)

		if (value === null || !window.jQuery || typeof window.jQuery.fn.slider !== 'function') {
			return
		}

		const $slider = window.jQuery(slider)
		const min = Number(slider.dataset.min)
		const max = Number(slider.dataset.max)
		const step = Number(slider.dataset.step || 1)
		const values = $slider.slider('values')
		const boundaryMin = handleIndex === 0 ? min : values[0]
		const boundaryMax = handleIndex === 0 ? values[1] : max
		const nextValue = clampRangeValue(snapRangeValue(value, min, step), boundaryMin, boundaryMax)

		$slider.slider('values', handleIndex, nextValue)
	}

	const prepareRangeInputs = slider => {
		const range = slider.closest('.catalog-filter__range')
		const step = Number(slider.dataset.step || 1)
		const inputs = [
			range?.querySelector('.js-range-from'),
			range?.querySelector('.js-range-to'),
		]

		inputs.forEach((input, handleIndex) => {
			if (!input) {
				return
			}

			input.removeAttribute('readonly')
			input.setAttribute('inputmode', Number.isInteger(step) ? 'numeric' : 'decimal')

			input.addEventListener('input', () => {
				setRangeValueFromInput(slider, input, handleIndex)
			})

			input.addEventListener('change', () => {
				setRangeValueFromInput(slider, input, handleIndex)
				updateRangeFields(slider, window.jQuery(slider).slider('values'))
			})

			input.addEventListener('blur', () => {
				updateRangeFields(slider, window.jQuery(slider).slider('values'))
			})
		})
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

			prepareRangeScale(slider, [from, to])
			updateRangeFields(slider, [from, to])
			prepareRangeInputs(slider)
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
			if (!target) {
				return
			}

			tabs.dataset.activeTab = target

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

		document.querySelectorAll('.js-product-tab-link').forEach(link => {
			link.addEventListener('click', event => {
				const target = link.dataset.tabTarget
				const panel = tabs.querySelector(`[data-tab-panel="${target}"]`)

				if (!panel) {
					return
				}

				event.preventDefault()
				activateTab(target)
				tabs.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
			closeProductLightbox()
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

		const createHeroPaginationButton = index => {
			const button = document.createElement('button')
			const image = document.createElement('img')

			button.className = 'hero-pagination__button'
			button.type = 'button'
			button.dataset.slideIndex = String(index)
			button.dataset.paginationSize = '04'
			button.setAttribute('aria-label', `Слайд ${index + 1}`)

			image.src = '/images/icons/slider-pagination-button-size-04.svg'
			image.alt = ''

			button.append(image)

			return button
		}

		const renderHeroPagination = (pagination, slidesCount) => {
			if (!pagination) {
				return []
			}

			const fragment = document.createDocumentFragment()
			const buttons = Array.from({ length: slidesCount }, (_, index) => createHeroPaginationButton(index))

			buttons.forEach(button => fragment.append(button))
			pagination.replaceChildren(fragment)

			return buttons
		}

		const updateHeroPagination = (pagination, activeIndex) => {
			pagination?.querySelectorAll('.hero-pagination__button').forEach(button => {
				const buttonIndex = Number(button.dataset.slideIndex)
				const distance = Math.abs(buttonIndex - activeIndex)
				const size = getHeroPaginationSize(distance)
				const image = button.querySelector('img')
				const isActive = buttonIndex === activeIndex

				button.classList.toggle('is-active', isActive)
				button.dataset.paginationSize = size

				if (isActive) {
					button.setAttribute('aria-current', 'true')
				} else {
					button.removeAttribute('aria-current')
				}

				if (image) {
					image.src = `/images/icons/slider-pagination-button-size-${size}.svg`
				}
			})
		}

		document.querySelectorAll('.js-hero-slider').forEach(hero => {
			const swiperElement = hero.querySelector('.swiper')
			const pagination = hero.querySelector('.js-hero-pagination')
			const slidesCount = swiperElement?.querySelectorAll('.swiper-slide').length || 0
			const heroAutoplayMedia = window.matchMedia('(max-width: 992px)')

			if (!swiperElement || swiperElement.dataset.swiperInitialized) {
				return
			}

			swiperElement.dataset.swiperInitialized = 'true'
			const buttons = renderHeroPagination(pagination, slidesCount)
			const syncHeroAutoplay = swiper => {
				if (!swiper.autoplay) {
					return
				}

				if (heroAutoplayMedia.matches && slidesCount > 1) {
					swiper.autoplay.start()
				} else {
					swiper.autoplay.stop()
				}
			}

			const heroSwiper = new Swiper(swiperElement, {
				slidesPerView: 1,
				effect: 'fade',
				speed: 550,
				rewind: slidesCount > 1,
				allowTouchMove: true,
				autoplay: {
					delay: 4200,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				},
				fadeEffect: {
					crossFade: true,
				},
				on: {
					init(swiper) {
						updateHeroPagination(pagination, swiper.activeIndex)
						syncHeroAutoplay(swiper)
					},
					slideChange(swiper) {
						updateHeroPagination(pagination, swiper.activeIndex)
					},
				},
			})

			heroAutoplayMedia.addEventListener('change', () => syncHeroAutoplay(heroSwiper))

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
					el: slider.querySelector('.products__pagination'),
					clickable: true,
				},
			})
		})

		document.querySelectorAll('.js-product-marketplaces-slider').forEach(slider => {
			const swiperElement = slider.querySelector('.swiper')

			if (!swiperElement || swiperElement.dataset.swiperInitialized) {
				return
			}

			swiperElement.dataset.swiperInitialized = 'true'

			new Swiper(swiperElement, {
				slidesPerView: 3,
				spaceBetween: 18,
				speed: 450,
				loop: true,
				a11y: false,
				navigation: {
					prevEl: slider.querySelector('.product-marketplaces__button--prev'),
					nextEl: slider.querySelector('.product-marketplaces__button--next'),
				},
				breakpoints: {
					768: {
						spaceBetween: 22,
					},
					1024: {
						spaceBetween: 26,
					},
				},
			})
		})

		document.querySelectorAll('.js-dealers-markets-slider').forEach(slider => {
			const swiperElement = slider.querySelector('.dealers__markets-slider')
			const list = slider.querySelector('.dealers__markets')
			const slides = list ? Array.from(list.children) : []

			if (!swiperElement || !list || slides.length <= 5 || swiperElement.dataset.swiperInitialized) {
				return
			}

			swiperElement.dataset.swiperInitialized = 'true'
			swiperElement.classList.add('swiper')
			list.classList.add('swiper-wrapper')
			slides.forEach(slide => slide.classList.add('swiper-slide'))

			new Swiper(swiperElement, {
				slidesPerView: 3,
				spaceBetween: 12,
				speed: 450,
				freeMode: true,
				watchOverflow: true,
				a11y: false,
				breakpoints: {
					768: {
						slidesPerView: 4,
						spaceBetween: 18,
					},
					1024: {
						slidesPerView: 5,
						spaceBetween: 30,
					},
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
