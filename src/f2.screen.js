f2.screen = {

	init() {
		const dashboardScreen = {
			id: 'f2-app-screen-dashboard',
			type: 'dashboard',
			title: 'Dashboard'
		}
		f2.screens.push(dashboardScreen)
		f2.models.forEach((model) => {
			const modelScreen = {
				id: 'f2-app-screen-model-'+model.key,
				type: 'model',
				title: model.storage.name
			}
			f2.screens.push(modelScreen)
		})
		const docsScreen = {
			id: 'f2-app-screen-docs',
			type: 'docs',
			title: 'Documentation'
		}
		f2.screens.push(docsScreen)
	},

	make() {
		f2.screens.forEach((screen) => {
			const el = document.createElement('div')
			el.id = screen.id
			el.className = 'hidden'
			f2.appEl.appendChild(el)
		})
	},

	show(screenId) {
		f2.screen.hideAll()
		f2.screen.el(screenId).classList.remove('hidden')
	},

	hideAll() {
		f2.screens.forEach((screen) => {
			const el = document.getElementById(screen.id)
			el.classList.add('hidden')
		})
	},

	el(id) {
		let screenMatch = false
		f2.screens.forEach((screen) => {
			if(screen.id === id) {screenMatch = document.getElementById(screen.id)}
		})
		return screenMatch
	},

}
