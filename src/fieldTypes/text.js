f2.fieldTypes.text = {
	make(field) {
		let el = document.createElement('input')
		el.type = 'text'
		el.className = 'border border-solid border-gray-800 p-2'
		el.id = field.key
		el.placeholder = field.placeholder
		return el
	}
}
