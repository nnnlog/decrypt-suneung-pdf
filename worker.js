const {Worker, isMainThread, parentPort} = require('worker_threads');
const pdftk = require('node-pdftk');
const fs = require("fs");
const replace = require('buffer-replace');

pdftk.configure({
	ignoreWarnings: true,
});

parentPort.on('message', async ({port, filepath, realpath}) => {
	let data = await pdftk.input(fs.readFileSync(realpath)).uncompress().output();

	data = replace(data, Buffer.from("/ExportState /ON"), Buffer.from("/ExportState /OFF"));
	data = replace(data, Buffer.from("/ViewState /ON"), Buffer.from("/ViewState /OFF"));
	data = replace(data, Buffer.from("/PrintState /ON"), Buffer.from("/PrintState /OFF"));
	fs.writeFileSync(`${__dirname}/dist/${filepath}`, data);

	ps.push(pdftk.input(data).compress().output(false, `${__dirname}/dist/${filepath}`));
	port.postMessage("");
});