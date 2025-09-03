// public/search.worker.js
self.onmessage = (e) => {
	const { items, query } = e.data;
	if (!query) {
		postMessage([]);
		return;
	}
	// prefix match only
	const results = items.filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
		.slice(0, 10); // limit results for performance
	postMessage(results);
};
