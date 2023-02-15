f2.inlineCreate = {

	buttonClick() {

		const button = f2.inlineCreate.buttonEl()

		console.log(button)

		button.addEventListener('click', (e) => {
			console.log('inline create click...')
		})

	},

	buttonEl() {
		return document.getElementById('f2-inline-create')
	}


}
