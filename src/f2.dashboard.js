f2.dashboard = {
	make() {
		el = document.createElement('div')
		let h = '<div><h2 class="text-sm font-medium text-gray-500">App Models</h2><ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">'
		f2.models.forEach((model) => {
			const recordCount = f2.records[model.key].collection.length
			h += '<li class="col-span-1 flex rounded-md shadow-sm"><div class="flex-shrink-0 flex items-center justify-center w-16 bg-pink-600 text-white text-sm font-medium rounded-l-md">AM</div><div class="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white"><div class="flex-1 truncate px-4 py-2 text-sm"><a href="#" class="font-medium text-gray-900 hover:text-gray-600">'+model.storage.name+'</a><p class="text-gray-500">'
			h += '<span id="dashboard-record-count-' + model.key + '">-</span> records</p></div><div class="flex-shrink-0 pr-2"><button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"><span class="sr-only">Open options</span><svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"/></svg></button></div></div></li>'
		})
		h += '</ul></div>'
		el.innerHTML = h
		screenEl = f2.screen.el('f2-app-screen-dashboard')
		screenEl.appendChild(el)
	}
}
