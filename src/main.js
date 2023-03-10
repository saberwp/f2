const f2 = {

	appId: 0,
	appEl: null,
	model: null, // First or main model.
	models: [], // Array of all app models.
	modelLookup: {}, // Object with models keyed by model.key.
	modelContainers: {},
	records: {},
	screens: [], // Array of application screens.
	fieldTypes: {},

	init() {

		// Find required #f2app element. Exit if not found.
		const appEl = document.getElementById('f2app')
		if(!appEl) {
			console.error('F2 application controller was unable to find the required DOM element #f2app. Exiting render process, error code 811.')
			return; // Exit if there is no container element.
		}
		f2.appEl = appEl // Stash app element into controller object.

		// Set app ID.
		f2.appId = parseInt(appEl.getAttribute('app-id'))

		// Set models.
		f2app.models.forEach((model) => {
			f2.modelLookup[model.key] = model
		})
		f2.models = f2app.models
		f2.model = f2app.models[0]

		// Exit early if app has no models.
		if( null === f2.models || f2.models.length === 0 ) {
			return;
		}

		// Setup app screens.
		f2.screen.init()
		f2.screen.make()
		f2.screen.show('f2-app-screen-dashboard')

		// Do app model init.
		f2.models.forEach((model, index) => {

			// Set flag to determine if model is shown by default.
			let showModelByDefault = false
			if( 0 === index ) {
				showModelByDefault = true
			}

			f2.modelContainerCreate(model, showModelByDefault)

			f2.makeCollectionContainer(model)
			f2.recordsChangeHandler(model)

			// Setup record store for each model.
			f2.records[model.key] = {
				collection: [],
				lookup: {}
			}
			f2.fetchRecords(model)
		})

		// Setup app menu.
		f2.appMenuSetup()

		// Slideover init.
		f2.slideOver.init()

		// Init dashboard.
		f2.dashboard.make()

		// Init docs.
		console.log(f2.docs)
		f2.docs.make()

	},

	appMenuSetup() {

		const menuContainer = document.getElementById('f2-app-menu')
		let menuHtml = ''
		f2.screens.forEach((screen) => {
			menuHtml += '<a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"><svg class="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>'+screen.title+'</a>'
		})
		menuContainer.innerHTML = menuHtml
		const menuItems = menuContainer.querySelectorAll('a')
		for (let i = 0; i < menuItems.length; i++) {
		  const menuItem = menuItems[i]
			const screen = f2.screens[i]

			// Assign screen ID.
			menuItem.id = 'f2-menu-item-'+i
			menuItem.setAttribute('targetScreen', screen.id)

			menuItem.addEventListener('click', (e) => {
				const screenId = e.target.id
				const targetId = e.target.getAttribute('targetScreen')
				const targetEl = document.getElementById(targetId)
				f2.screens.forEach((screen) => {
					const el = document.getElementById(screen.id)
					el.classList.add('hidden')
				})
				targetEl.classList.remove('hidden')
			})
		}

	},

	getModelContainer(modelKey) {
		return f2.modelContainers[modelKey]
	},

	/*
	 * Create model container DOM element.
	 */
	modelContainerCreate(model, showModelByDefault) {
		const el = document.createElement('div')
		el.id = 'app-model-' +model.key
		el.className = ''

		if(showModelByDefault) {
				// @TODO set screen to show? Or maybe do this under screen init?
		}

		const cont = f2.screen.el('f2-app-screen-model-'+model.key)
		cont.appendChild(el)
		f2.modelContainers[model.key] = el
	},

	appFormCreate(model) {

		// Render save form.
		const contEl = document.createElement('div')
		contEl.className = ''
		const formEl = document.createElement('form')
		formEl.id = 'f2-app-form-'+model.key
		formEl.setAttribute('modelKey', model.key)
		const objectIdEl = document.createElement('input')
		objectIdEl.type = 'hidden'
		objectIdEl.id = 'object-id'
		objectIdEl.value = 0
		formEl.appendChild(objectIdEl)

		// Render field groups.
		model.form.fields.forEach((field, index) => {
			f2.renderField(field, formEl)
		})

		// Add save button.
		const buttonEl = document.createElement('button')
		buttonEl.type = 'submit'
		buttonEl.innerHTML = 'SAVE'
		buttonEl.className = 'mt-8 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white'
		formEl.appendChild(buttonEl)

		// Append form element to container element.
		contEl.appendChild(formEl)

		// Append form to slideover.
		f2.slideOver.clear()
		const cont = f2.slideOver.contentEl()
		cont.appendChild(contEl)

	},

	// Add event listener for f2_records_changed to refresh the record collection.
	recordsChangeHandler(model) {
		document.addEventListener('f2_records_changed', function(e) {
			f2.fetchRecords(e.detail.model)
		})
	},

	// Render the record list containers for each model.
	makeCollectionContainer(model) {
		const el = document.createElement('ul')
		el.id = 'f2-records-' + model.key
		el.className = 'list-none flex flex-col gap-4'
		const mc = f2.getModelContainer(model.key)
		mc.appendChild(el)
	},

	appCreateProcess(objectId, formValues) {

		// Saving existing app.
		if( objectId > 0 ) {

			let app = new wp.api.models.App({
				id: objectId,
				title: formValues.app_name,
				meta: {
					app_name: formValues.app_name,
					models: formValues.models,
				},
			})
			app.save().done((app) => {
				f2.triggerRecordsChangedEvent( f2.modelLookup['app'] )
			})

		}

		// If saving new app, then we make related objects.
		if( 0 == objectId ) {

			// Make form.
			let formPoster = new wp.api.models.Form({
				title: formValues.app_name+ ' Form',
				meta: {
					name: formValues.app_name+ ' Form',
					fields: '1,2,3'
				},
				status: 'publish'
			})
			formPoster.save().done((formObj) => {

				// Make model.
				let modelPoster = new wp.api.models.Model({
					title: formValues.app_name+ ' Model',
					meta: {
						name: formValues.app_name+ ' Model',
						forms: String(formObj.id)
					},
					status: 'publish'
				})
				modelPoster.save().done((modelObj) => {

					// Make app.
					let app = new wp.api.models.App({
						title: formValues.app_name,
						meta: {
							app_name: formValues.app_name,
							models: String(modelObj.id)
						},
						status: 'publish'
					})
					app.save().done((app) => {
						f2.triggerRecordsChangedEvent( f2.modelLookup['app'] )
					})

				})

			})

		}

	},

	modelNameFromKey(modelKey) {
		return modelKey.charAt(0).toUpperCase() + modelKey.slice(1)
	},

	formProcessor(model) {

		const appFormEl = document.getElementById('f2-app-form-'+model.key)
		appFormEl.addEventListener('submit', function(e) {

			const modelKey = e.target.getAttribute('modelKey')
			const appFormEl = document.getElementById('f2-app-form-'+modelKey)

			// Prevent default post submit.
			e.preventDefault()

			// Get object ID if set.
			const idEl = appFormEl.querySelector('#object-id')
			const objectId = idEl.value

			// Parse form values.
			const formValues = {}
			model.form.fields.forEach((field) => {
				const el = document.getElementById(field.key)
				formValues[field.key] = el.value
			})

			// Initialize special process for "app" models.
			if('app' === modelKey) {
				f2.appCreateProcess(objectId, formValues)
				return
			}

			// @TODO validate form values.

			/* Set post data. */
			let postData = {
			  title: "New Object",
			  status: "publish",
			  meta: formValues,
			}

			// Set Backbone POST/PUT vars.
			let postObject = {
				meta: formValues,
				status: 'publish',
			}
			if( objectId > 0 ) {
				postObject.id = objectId
			}

			// Get capitalized model name from key.
			const modelName = f2.modelNameFromKey(modelKey)
			let post = new wp.api.models[modelName](postObject)
			const fetchResult = post.save().done((resp) => {
				f2.triggerRecordsChangedEvent(model)
			})
		})
	},

	fetchRecords(model) {

		const modelName = f2.modelNameFromKey(model.key)

		let post = new wp.api.models[modelName]()
		post.fetch({ data: { per_page: 25 } }).done((resp) => {

			f2.records[model.key].collection = resp
			f2.recordLookup(model.key)
			f2.renderRecords(model.key)

			// Update dashboard count.
			const recordCountEl = document.getElementById('dashboard-record-count-' + model.key)
			recordCountEl.innerHTML = f2.records[model.key].collection.length

			f2.triggerRecordsLoadedEvent(model)

		})

	},

	recordLookup(modelKey) {
		f2.records[modelKey].lookup = [];
		f2.records[modelKey].collection.forEach((record) => {
			f2.records[modelKey].lookup[record.id] = record
		})
	},

	renderRecords(modelKey) {

		// Get template and insert into DOM with ID set.
		const tableEl = document.createElement('div')
		tableEl.className = 'f2-app-table'
		tableEl.innerHTML = f2.tableTemplate()
		tableEl.id = 'f2-app-table-'+modelKey

		// Get the container screen and append.
		const screenEl = f2.screen.el('f2-app-screen-model-'+modelKey)
		screenEl.innerHTML = ''
		screenEl.appendChild(tableEl)

		// Set the table headers.
		const tableHeaderRowEl = tableEl.querySelector('thead tr')

		// Table header ID.
		const headerElId = document.createElement('th')
		headerElId.innerHTML = 'ID'
		headerElId.className = 'py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900';
		tableHeaderRowEl.appendChild(headerElId)

		// Field headers.

		// This should be a loop over "Fields" that contain "Elements", but it is not!
		// Core app seems to be a loop over "Controls" under form.fields[].
		// @TODO address inconsistencies in field/element structure under forms (in CoreApp).

		f2.modelLookup[modelKey].form.fields.forEach((field) => {

			console.log('in the fields loop during header output...')
			console.log(field)

			const headerElField = document.createElement('th')
			headerElField.innerHTML = field.elements[0].text
			headerElField.className = 'py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900';
			tableHeaderRowEl.appendChild(headerElField)

		})

		// Table header controls.
		const headerElControls = document.createElement('th')
		headerElControls.innerHTML = ''
		headerElControls.className = 'py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900';
		tableHeaderRowEl.appendChild(headerElControls)

		// Get the table body.
		const tableBodyEl = tableEl.querySelector('tbody')

		// Set create button text.
		const createButton = tableEl.querySelector('.f2-create-button')
		createButton.innerHTML = 'Create '+f2.modelLookup[modelKey].storage.single_name
		createButton.setAttribute('modelKey',modelKey)
		createButton.addEventListener('click', f2.createClick)

		// Set table heading title.
		const tableHeading = tableEl.querySelector('h2')
		tableHeading.innerHTML = f2.modelLookup[modelKey].storage.name

		// Loop over loaded records.
		f2.records[modelKey].collection.forEach((record, index) => {
			const recordEl = document.createElement('tr')
			recordEl.className = ''
			let content = ''
			content += '<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">' + record.id + '</td>'
			f2.modelLookup[modelKey].form.fields.forEach((field) => {
				content += '<td class="overflow-hidden px-3 py-4 text-sm text-gray-500">' + record.meta[field.key] + '</td>'
			})
			content += '<td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"><button onclick="f2.editClick(this)" object-id="' + record.id + '" model-key="' + modelKey + '" " type="button" class="mr-3">Edit</button><button onclick="f2.deleteClick(this)" object-id="' + record.id + '" model-key="' + modelKey + '" " type="button">Delete</button></td>'
			recordEl.innerHTML = content
			tableBodyEl.appendChild(recordEl)

		})

	},

	tableTemplate() {
		return '<div class="sm:flex sm:items-center"><div class="sm:flex-auto"><h2 class="text-xl font-semibold text-gray-900"></h2></div><div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"><button type="button" class="f2-create-button inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"></button></div></div><div class="mt-8 flex flex-col"><div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8"><div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"><div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"><table class="min-w-full divide-y divide-gray-300"><thead class="bg-gray-50"><tr></tr></thead><tbody class="bg-white"></tbody></table></div></div></div></div>'
	},

	renderField( field, targetEl ) {

		console.log('renderField called here...')
		console.log( field )
		console.log( field.type )

		let fieldEl = document.createElement('div')
		fieldEl.className = 'flex flex-col gap-px mb-3'
		field.elements.forEach( (fieldElement, index) => {
			const fieldElementEl = f2.makeFieldElement(fieldElement)
			fieldEl.appendChild(fieldElementEl)
		})

		// Handle post_select with inline create.
		if(field.typeKey === 'post_select') {
			const inlineCreateButton = document.createElement('button')
			inlineCreateButton.id = 'f2-inline-create'
			inlineCreateButton.innerHTML = 'INLINE CREATE +'
			fieldEl.appendChild(inlineCreateButton)
		}

		targetEl.appendChild(fieldEl)

		// Handle post_select with inline create.
		if(field.typeKey === 'post_select') {
			// Init button click event.
			f2.inlineCreate.buttonClick()
		}

	},

	makeFieldElement(fieldElement) {

		let el = ''
		if( 'control' === fieldElement.elementType ) {
			if( fieldElement.type === 'text_area' ) {
				el = document.createElement('textarea')
				el.className = 'border border-solid border-gray-800 p-2'
				el.id = fieldElement.key
			}
			if( fieldElement.type === 'post_select' ) {
				el = document.createElement('select')
				el.className = 'border border-solid border-gray-800 p-2'
				el.id = fieldElement.key
				let choiceOptions = '<option value="0">Select Post</option>'
				if( null !== fieldElement.choices && undefined !== fieldElement.choices && fieldElement.choices.length > 0 ) {
					fieldElement.choices.forEach((choice) => {
						choiceOptions += '<option value="' + choice.value + '">' + choice.label + '</option>'
					})
				}
				el.innerHTML = choiceOptions
			}
			if( fieldElement.type === 'select' ) {

				el = document.createElement('select')
				el.className = 'border border-solid border-gray-800 p-2'
				el.id = fieldElement.key
				let choiceOptions = '<option value="0">Select Choice</option>'

				if( null !== fieldElement.choices && undefined !== fieldElement.choices && fieldElement.choices.length > 0 ) {
					fieldElement.choices.forEach((choice) => {
						choiceOptions += '<option value="' + choice.value + '">' + choice.label + '</option>'
					})
				}
				el.innerHTML = choiceOptions
			}
			if( fieldElement.type === 'text' || fieldElement.type == 'Text Not Set') {
				el = f2.fieldTypes.text.make(fieldElement)
			}
		}
		if( 'label' === fieldElement.elementType ) {
			el = document.createElement('label')
			el.innerHTML = fieldElement.text
		}
		return el
	},

	editClick(btn) {

		// Get object from records.
		const objectId = btn.getAttribute('object-id')
		const modelKey = btn.getAttribute('model-key')
		const model = f2.modelLookup[modelKey]
		const object = f2.records[modelKey].lookup[objectId]

		// Add form to slideover.
		f2.appFormCreate(model)
		f2.slideOver.setTitle("Edit "+model.storage.single_name)
		f2.formProcessor(model)

		// Open slideover.
		f2.slideOver.open()

		// Set form object ID.
		const appFormEl = document.getElementById('f2-app-form-'+modelKey)
		const idEl = appFormEl.querySelector('#object-id')
		idEl.value = objectId

		f2.modelLookup[modelKey].form.fields.forEach((field) => {
			const el = document.getElementById(field.key)
			el.value = object.meta[field.key]
		})

	},

	// Handle click on create button.
	// Clear the form to prepare it for create.
	createClick(e) {

		// Get the model key from the button attribute "modelKey".
		const modelKey = e.target.getAttribute('modelKey')
		const model = f2.modelLookup[modelKey]

		// Add form to slideover.
		f2.appFormCreate(model)
		f2.slideOver.setTitle("Create "+model.storage.single_name)
		f2.formProcessor(model)

		// Open slideover.
		f2.slideOver.open()

	},

	deleteClick( btn ) {

		const modelKey = btn.getAttribute('model-key')
		const objectId = btn.getAttribute('object-id')

		// Get capitalized model name from key.
		const modelName = f2.modelNameFromKey(modelKey)

		const postObject = {
			id: objectId
		}

		let post = new wp.api.models[modelName](postObject)
		const fetchResult = post.destroy().done((resp) => {
			const model = f2.modelLookup[modelKey]
			f2.triggerRecordsChangedEvent(model)
		})


	},

	triggerRecordsLoadedEvent(model) {
		const event = new CustomEvent('f2_records_loaded', {
      detail: {
        model: model
      }
		});
		document.dispatchEvent(event);
	},

	triggerRecordsChangedEvent(model) {
		const event = new CustomEvent('f2_records_changed', {
      detail: {
        model: model
      }
		});
		document.dispatchEvent(event);
	},

}
