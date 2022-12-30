const f2 = {

	init() {

		const appEl = document.getElementById('f2app')
		if(!appEl) {
			console.error('F2 application controller was unable to find the required DOM element #f2app. Exiting render process, error code 811.')
			return; // Exit if there is no container element.
		}

		// Render the create button
		const createButton = f2.makeCreateButton()
		appEl.appendChild(createButton)

		// Render the record list container.
		const recordContEl = document.createElement('ul')
		recordContEl.id = 'f2-records'
		recordContEl.className = 'list-none flex flex-col gap-4'
		appEl.appendChild(recordContEl)

		// Initial record fetch.
		f2.fetchRecords()

		// Render save form.
		const contEl = document.createElement('div')
		contEl.className = 'border border-gray-300 border-solid p-10'
		const formEl = document.createElement('form')
		formEl.id = 'f2-app-form'
		const objectIdEl = document.createElement('input')
		objectIdEl.type = 'hidden'
		objectIdEl.id = 'object-id'
		objectIdEl.value = 0
		formEl.appendChild(objectIdEl)

		// Render field groups.
		f2app.form.fieldGroups.forEach((fieldGroup, index) => {
			f2.renderFieldGroup(fieldGroup, formEl)
		})

		// Add save button.
		const buttonEl = document.createElement('button')
		buttonEl.type = 'submit'
		buttonEl.innerHTML = 'SAVE'
		buttonEl.className = 'mt-8 px-4 py-2 border border-solid border-gray-600 bg-gray-400 text-white'
		formEl.appendChild(buttonEl)

		// Append form element to container element.
		contEl.appendChild(formEl)

		// Append form container to app.
		appEl.appendChild(contEl)

		// Add submit handling.
		const appFormEl = document.getElementById('f2-app-form')
		appFormEl.addEventListener('submit', function(e) {

			// Prevent default post submit.
			e.preventDefault()

			// Get object ID if set.
			const idEl = document.getElementById('object-id')
			const objectId = idEl.value

			// Parse form values.
			const formValues = {}
			f2app.form.fields.forEach((field) => {
				const el = document.getElementById(field.key)
				formValues[field.key] = el.value
			})

			// @TODO validate form values.

			/* Set post data. */
			let postData = {
			  title: "New Object",
			  status: "publish",
			  meta: formValues,
			}

			// Choose endpoint, protocol based on objectId.
			let endpoint = 'http://sabermarketing.local/wp-json/wp/v2/quote/'
			let protocol = 'POST'
			if( objectId > 0 ) {
				endpoint += objectId
				protocol = 'PUT'
			}

			fetch(endpoint, {
			  method: protocol,
			  body: JSON.stringify(postData),
			  headers: {
					"Content-type": "application/json; charset=UTF-8",
					'Authorization': "Basic " + btoa('admin' + ':' + 'hcLS qRJv LQxT 1bqa G6Xe OozD'),
				}
			})
			.then(response => response.json())
			.then(data => {
				f2.triggerRecordsChangedEvent()
			})
			.catch(err => console.log(err));

		})

		// Add event listener for f2_records_changed to refresh the record collection.
		document.addEventListener('f2_records_changed', function(e) {
			f2.fetchRecords()
		})

	},

	makeCreateButton() {
		const el1 = document.createElement('div')
		el1.className = 'my-2'
		const el2 = document.createElement('button')
		el2.type = 'button'
		el2.className = 'bg-green-800 text-white py-3 px-8'
		el2.innerHTML = 'Create'
		el2.addEventListener('click', f2.createClick)
		el1.appendChild(el2)
		return el1
	},

	fetchRecords() {
		let endpoint = 'http://sabermarketing.local/wp-json/wp/v2/quote/'
		let protocol = 'GET'
		fetch(endpoint, {
			method: protocol,
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				'Authorization': "Basic " + btoa('admin' + ':' + 'hcLS qRJv LQxT 1bqa G6Xe OozD'),
			}
		})
		.then(response => response.json())
		.then(records => {
			f2app.records = records
			f2.recordLookup()
			f2.renderRecords()
		})
		.catch(err => console.log(err));
	},

	recordLookup() {
		f2app.recordLookup = [];
		f2app.records.forEach((record) => {
			f2app.recordLookup[record.id] = record
		})
	},

	renderRecords() {
		const rcEl = document.getElementById('f2-records')
		rcEl.innerHTML = '' // Clear existing records.
		f2app.records.forEach((record, index) => {
			const recordEl = document.createElement('li')
			recordEl.className = 'flex gap-4 space-between'
			let content = ''
			content += '<div>' + record.id + '</div>'
			f2app.form.fields.forEach((field) => {
				content += '<div>' + record.meta[field.key] + '</div>'
			})
			content += '<button onclick="f2.editClick(this)" object-id="' + record.id + '" type="button">Edit</button>'
			content += '<button onclick="f2.deleteClick(this)" object-id="' + record.id + '" type="button">Delete</button>'
			recordEl.innerHTML = content
			rcEl.appendChild(recordEl)
		})
	},

	renderFieldGroup( fieldGroup, targetEl ) {
		let fgEl = document.createElement('div')
		fgEl.className = 'flex flex-col gap-px mb-3'
		fieldGroup.elements.forEach( (fieldElement, index) => {
			const fieldElementEl = f2.makeFieldElement(fieldElement)
			fgEl.appendChild(fieldElementEl)
		})
		targetEl.appendChild(fgEl)
	},

	makeFieldElement(fieldElement) {

		let el = ''

		if( 'field' === fieldElement.type ) {
			el = document.createElement('input')
			el.type = 'text'
			el.className = 'border border-solid border-gray-800 p-2'
			el.id = fieldElement.key
		}

		if( 'label' === fieldElement.type ) {
			el = document.createElement('label')
			el.innerHTML = fieldElement.text
		}

		console.log(el)
		return el

	},

	editClick( btn ) {

		// Get object from records.
		const objectId = btn.getAttribute('object-id')
		const object = f2app.recordLookup[ objectId ]

		console.log(object)

		// Set form object ID.
		const idEl = document.getElementById('object-id')
		idEl.value = objectId

		f2app.form.fields.forEach((field) => {
			const el = document.getElementById(field.key)
			el.value = object.meta[field.key]
		})

	},

	// Handle click on create button.
	// Clear the form to prepare it for create.
	createClick( btn ) {

		// Reset value of the object ID to 0 which will trigger create mode.
		const idEl = document.getElementById('object-id')
		idEl.value = 0

		// Reset value of each field.
		f2app.form.fields.forEach((field, i) => {
			const el = document.getElementById(field.key)
			el.value = ''
		})

	},

	deleteClick( btn ) {

		const objectId = btn.getAttribute('object-id')

		/* DELETE request. */
		fetch( 'http://sabermarketing.local/wp-json/wp/v2/quote/' + objectId + '?force=true', {
			method:'DELETE',
      credentials: 'include',
			headers: {
			  'Content-Type': 'application/json',
				'Authorization': "Basic " + btoa('admin' + ':' + 'hcLS qRJv LQxT 1bqa G6Xe OozD'),
			},
		})
		.then(response => response.json())
		.then(json => {
			f2.triggerRecordsChangedEvent()
		})
		.catch(err => console.log(err));

	},

	triggerRecordsChangedEvent() {
		event = document.createEvent("HTMLEvents");
		event.initEvent("f2_records_changed", true, true);
		event.eventName = "f2_records_changed";
		document.dispatchEvent(event);
	}

}

f2.init()
