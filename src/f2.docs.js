f2.docs = {

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
		screenEl = f2.screen.el('f2-app-screen-docs')
		screenEl.appendChild(el)
	}

}
