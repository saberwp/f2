const f2 = {

	appId: 0,
	appEl: null,
	model: null, // First or main model.
	models: [], // Array of all app models.
	modelLookup: {}, // Object with models keyed by model.key.
	modelContainers: {},
	records: {},
	screens: [], // Array of application screens.

	init() {

		const appEl = document.getElementById('f2app')
		f2.appEl = appEl // Stash app element into controller object.
		if(!appEl) {
			console.error('F2 application controller was unable to find the required DOM element #f2app. Exiting render process, error code 811.')
			return; // Exit if there is no container element.
		}

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
		f2.screensInit()
		f2.screensMake()
		screen.show('f2-app-screen-dashboard')

		// Do app model init.
		f2.models.forEach((model, index) => {

			// Set flag to determine if model is shown by default.
			let showModelByDefault = false
			if( 0 === index ) {
				showModelByDefault = true
			}

			f2.modelContainerCreate(model, showModelByDefault)

			f2.modelRender(model)
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
		f2.slideoverInit()

		// Init dashboard.
		dashboard.make()

		// Init docs.
		docs.make()

	},

	screensInit() {
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

	screensMake() {
		f2.screens.forEach((screen) => {
			const el = document.createElement('div')
			el.id = screen.id
			el.className = 'hidden'
			f2.appEl.appendChild(el)
		})
	},

	screenEl(id) {
		let screenMatch = false
		f2.screens.forEach((screen) => {
			if(screen.id === id) {screenMatch = document.getElementById(screen.id)}
		})
		return screenMatch
	},

	appMenuSetup() {

		const menuContainer = document.getElementById('f2-app-menu')
		let menuHtml = ''
		f2.screens.forEach((screen) => {
			menuHtml += '<a href="#" class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"><svg class="text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>'+screen.title+'</a>'
		})
		menuContainer.innerHTML = menuHtml
		const menuItems = menuContainer.querySelectorAll('a')

		console.log(menuItems)

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

	modelRender(model) {

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

		const cont = f2.screenEl('f2-app-screen-model-'+model.key)
		console.log(cont)
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
		model.form.fieldGroups.forEach((fieldGroup, index) => {
			f2.renderField(fieldGroup, formEl)
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
		f2.slideoverClear()
		const cont = f2.slideoverContentEl()
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

			// @TODO validate form values.

			/* Set post data. */
			let postData = {
			  title: "New Object",
			  status: "publish",
			  meta: formValues,
			}

			// Choose endpoint, protocol based on objectId.
			let endpoint = 'http://sabermarketing.local/wp-json/wp/v2/'+model.key
			let protocol = 'POST'
			if( objectId > 0 ) {
				endpoint += '/' + objectId
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
				f2.triggerRecordsChangedEvent(model)
			})
			.catch(err => console.log(err));

		})
	},

	fetchRecords(model) {
		let endpoint = 'http://sabermarketing.local/wp-json/wp/v2/' + model.key
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
			f2.records[model.key].collection = records
			f2.recordLookup(model.key)
			f2.renderRecords(model.key)
		})
		.catch(err => console.log(err));
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
		const screenEl = f2.screenEl('f2-app-screen-model-'+modelKey)
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
		f2.modelLookup[modelKey].form.fieldGroups.forEach((field) => {
			const headerElField = document.createElement('th')
			console.log(field)
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
		createButton.innerHTML = 'Create '+f2.modelLookup[modelKey].storage.singleName
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
		let fieldEl = document.createElement('div')
		fieldEl.className = 'flex flex-col gap-px mb-3'
		field.elements.forEach( (fieldElement, index) => {
			const fieldElementEl = f2.makeFieldElement(fieldElement)
			fieldEl.appendChild(fieldElementEl)
		})
		targetEl.appendChild(fieldEl)
	},

	makeFieldElement(fieldElement) {
		let el = ''
		if( 'control' === fieldElement.elementType ) {
			console.log(fieldElement.type)
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
				let choiceOptions = '<option value="0">Select Author</option>'
				if( null !== fieldElement.choices && undefined !== fieldElement.choices && fieldElement.choices.length > 0 ) {
					fieldElement.choices.forEach((choice) => {
						choiceOptions += '<option value="' + choice.value + '">' + choice.label + '</option>'
					})
				}
				el.innerHTML = choiceOptions
			}
			if( fieldElement.type === 'text' || fieldElement.type == 'Text Not Set') {
				console.log('hello hello!!!')
				el = fieldTypeText.make(fieldElement)
				console.log(el)
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
		f2.slideoverSetTitle("Edit "+model.storage.singleName)
		f2.formProcessor(model)

		// Open slideover.
		f2.slideoverOpen()

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
		f2.slideoverSetTitle("Create "+model.storage.singleName)
		f2.formProcessor(model)

		// Open slideover.
		f2.slideoverOpen()

	},

	deleteClick( btn ) {

		const modelKey = btn.getAttribute('model-key')
		const objectId = btn.getAttribute('object-id')

		/* DELETE request. */
		fetch( 'http://sabermarketing.local/wp-json/wp/v2/' + modelKey + '/' + objectId + '?force=true', {
			method:'DELETE',
      credentials: 'include',
			headers: {
			  'Content-Type': 'application/json',
				'Authorization': "Basic " + btoa('admin' + ':' + 'hcLS qRJv LQxT 1bqa G6Xe OozD'),
			},
		})
		.then(response => response.json())
		.then(json => {
			f2.triggerRecordsChangedEvent(f2.modelLookup[modelKey])
		})
		.catch(err => console.log(err));

	},

	triggerRecordsChangedEvent(model) {
		const event = new CustomEvent('f2_records_changed', {
      detail: {
        model: model
      }
		});
		document.dispatchEvent(event);
	},

	slideoverInit() {
		const close = document.getElementById('f2-slideover-close')
		close.addEventListener('click', f2.slideoverClose)
	},

	slideoverEl() {
		return document.getElementById('f2-slideover')
	},

	slideoverContentEl() {
		return document.getElementById('f2-slideover-content')
	},

	slideoverOpen() {
		const so = document.getElementById('f2-slideover')
		so.classList.remove('hidden')
	},

	slideoverClose() {
		const so = document.getElementById('f2-slideover')
		so.classList.add('hidden')
	},

	slideoverClear() {
		f2.slideoverContentEl().innerHTML = ''
	},

	slideoverSetTitle(title) {
		document.getElementById('slide-over-title').innerHTML = title
	}

}

/*
 * Field Type: Text
 */
const fieldTypeText = {
	make(field) {
		let el = document.createElement('input')
		el.type = 'text'
		el.className = 'border border-solid border-gray-800 p-2'
		el.id = field.key
		el.placeholder = field.placeholder
		return el
	}
}

const screen = {
	show(screenId) {
		screen.hideAll()
		f2.screenEl(screenId).classList.remove('hidden')
	},
	hideAll() {
		f2.screens.forEach((screen) => {
			const el = document.getElementById(screen.id)
			el.classList.add('hidden')
		})
	}
}

/*
 * Dashboard
 */
const dashboard = {
	make() {
		el = document.createElement('div')
		let h = '<div><h2 class="text-sm font-medium text-gray-500">App Models</h2><ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">'
		f2.models.forEach((model) => {
			h += '<li class="col-span-1 flex rounded-md shadow-sm"><div class="flex-shrink-0 flex items-center justify-center w-16 bg-pink-600 text-white text-sm font-medium rounded-l-md">AM</div><div class="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white"><div class="flex-1 truncate px-4 py-2 text-sm"><a href="#" class="font-medium text-gray-900 hover:text-gray-600">'+model.storage.name+'</a><p class="text-gray-500">0 records</p></div><div class="flex-shrink-0 pr-2"><button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><span class="sr-only">Open options</span><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"/></svg></button></div></div></li>'
		})
		h += '</ul></div>'
		el.innerHTML = h
		screenEl = f2.screenEl('f2-app-screen-dashboard')
		screenEl.appendChild(el)
	}

}

const docs = {
	make() {
		el = document.createElement('div')
		let h = '<ul>'
		f2.models.forEach((model) => {

			// Get collection.
			h+='<li class="font-mono text-xs text-zinc-400">'
			h+='<span class="font-mono text-[0.625rem] font-semibold leading-6 rounded-lg px-1.5 ring-1 ring-inset ring-emerald-300 dark:ring-emerald-400/30 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400">GET</span>'
			h+='<span class="font-bold">/wp-json/wp/v2/'+model.key+'</span></li>'

			// Post create.
			h+='<li class="font-mono text-xs text-zinc-400">'
			h+='<span class="font-mono text-[0.625rem] font-semibold leading-6 rounded-lg px-1.5 ring-1 ring-inset ring-emerald-300 dark:ring-emerald-400/30 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400">POST</span>'
			h+='<span class="font-bold">/wp-json/wp/v2/'+model.key+'</span></li>'
		})
		h += '</ul>'
		el.innerHTML = h
		screenEl = f2.screenEl('f2-app-screen-docs')
		screenEl.appendChild(el)
	}
}

// Initiatization.
f2.init()
