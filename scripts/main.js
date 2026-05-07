var projectSwiper = new Swiper('.projects__swiper', {
	slidesPerView: 1,
	spaceBetween: 50,
	effect: 'fade',
	keyboard: {
		enabled: true,
	},
	navigation: {
		prevEl: '.projects__swiper-prev',
		nextEl: '.projects__swiper-next',
	},
})

const slideCount = 7

for (let i = 1; i <= slideCount; i++) {
	$(`#project-${i}`).click(projectSwiper, function () {
		projectSwiper.slideTo(i - 1)
	})
}

$(document).ready(function () {
	$('.projects__item-inner').on('click touchend', function () {
		$('.projects__swiper-wrapper').removeClass('is-hidden')
		$('.projects__wrapper').addClass('is-hidden')
	})
})
$(document).ready(function () {
	$('.projects__card-close-button').on('click touchend', function () {
		$('.projects__swiper-wrapper').addClass('is-hidden')
		$('.projects__wrapper').removeClass('is-hidden')
	})
})

new Swiper('.animals__tabs', {
	slidesPerView: 'auto',
	spaceBetween: 10,
	mousewheel: true,
	freeMode: true,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
})

new Swiper('.animals__swiper', {
	spaceBetween: 0,
	breakpoints: {
		320: {
			centeredSlides: true,
			slidesPerView: 1,
		},
		540: {
			slidesPerView: 2,
		},
		1024: {
			slidesPerView: 3,
		},
		1240: {
			slidesPerView: 4,
		},
		1920: {
			slidesPerView: 5,
		},
	},
})

new Swiper('.partners__swiper', {
	grid: {
		fill: 'row',
		rows: 2,
	},
	spaceBetween: 15,
	breakpoints: {
		320: {
			slidesPerView: 1,
			centeredSlides: true,
			grid: {
				fill: 'row',
				rows: 1,
			},
		},
		540: {
			slidesPerView: 2,
		},
		768: {
			slidesPerView: 3,
		},
		1024: {
			slidesPerView: 4,
		},
		1440: {
			slidesPerView: 5,
		},
	},
	navigation: {
		prevEl: '.partners__swiper-prev',
		nextEl: '.partners__swiper-next',
	},
})

new Swiper('.news__swiper', {
	spaceBetween: 0,
	breakpoints: {
		320: {
			centeredSlides: true,
			slidesPerView: 1,
		},
		540: {
			slidesPerView: 2,
		},
		1024: {
			slidesPerView: 3,
		},
		1240: {
			slidesPerView: 4,
		},
	},
})

new Swiper('.help-now__tabs', {
	slidesPerView: 'auto',
	spaceBetween: 10,
	mousewheel: true,
	freeMode: true,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
})

new Swiper('.projects-tile__tabs', {
	slidesPerView: 'auto',
	spaceBetween: 10,
	mousewheel: true,
	freeMode: true,
	scrollbar: {
		el: '.swiper-scrollbar',
	},
})

jQuery(document).ready(function () {
	$("input[type='tel']").mask('+7 (999) 999-99-99')

	$('.js-aside-menu-open').on('click touchend', function () {
		$('.aside-menu').addClass('is-open')
	})
	$('.js-aside-menu-close').on('click touchend', function () {
		$('.aside-menu').removeClass('is-open')
	})
})
