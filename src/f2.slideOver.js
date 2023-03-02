f2.slideOver = {

	init() {
		const close = document.getElementById('f2-slideover-close')
		close.addEventListener('click', f2.slideOver.close)
	},

	contentEl() {
		return document.getElementById('f2-slideover-content')
	},

	open() {
		const so = document.getElementById('f2-slideover')
		so.classList.remove('hidden')
	},

	close() {
		const so = document.getElementById('f2-slideover')
		so.classList.add('hidden')
	},

	clear() {
		f2.slideOver.contentEl().innerHTML = ''
	},

	setTitle(title) {
		document.getElementById('slide-over-title').innerHTML = title
	}

}
