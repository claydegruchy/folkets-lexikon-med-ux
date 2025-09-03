export function parseXDXFDefs(elements: Element[]) {
	const tagMap: Record<string, string> = {
		gr: "part_of_speech",
		dtrn: "translations",
		tr: "transcription",
		iref: "audio",
		sr: "synonyms",
		kref: "synonym_ref",
		ex_orig: "example_original",
		ex_transl: "example_translation",
		def: "definition"
	};

	let items: Record<string, any>[] = [];

	for (const element of elements) {
		const entry: Record<string, any> = {};

		for (const [tag, humanName] of Object.entries(tagMap)) {
			const els = Array.from(element.getElementsByTagName(tag));

			if (!els.length) continue;

			const values = els.map(el =>
				el.hasAttribute("href") ? el.getAttribute("href") : el.textContent?.trim() || ""
			);

			entry[humanName] = values.length === 1 ? values[0] : values;
		}


		items.push(entry);
	}


	return items;
}




export function parseXDXF(xmlString) {
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(xmlString, "application/xml");

	let items = {}
	let elements = [...xmlDoc.getElementsByTagName("ar")]
	// .filter((e, i) => i < 10)
	for (let index = 0; index < elements.length; index++) {
		const element = elements[index];
		let key: string = (element.getElementsByTagName("k")[0]?.textContent.trim() || "").toLowerCase();
		const defs = parseXDXFDefs(element.getElementsByTagName("def"))

		if (!items[key]) items[key] = []

		items[key].push(defs)


	}

	return items

	// [...xmlDoc.getElementsByTagName("ar")].filter((e, i) => i < 10)((ar, i) => {

	// 	key = key.toLowerCase()
	// 	const defs = [...ar.getElementsByTagName("def")].map(d => d.textContent.trim());
	// 	return { key, definitions: defs };
	// });

	// return entries;
}

