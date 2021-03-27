const fs = require("fs");
const safeMkdir = dir => {
	try {
		fs.mkdirSync(dir);
	} catch (e) {
	}
};
const {Worker, MessageChannel} = require("worker_threads");

safeMkdir(`${__dirname}/src`);
safeMkdir(`${__dirname}/dist`);

(async () => {
	let ps = [];
	for (let file of fs.readdirSync(`${__dirname}/src/`)) {
		let real = `${__dirname}/src/${file}`;
		if (fs.statSync(real).isFile() && real.substr(real.length - 4, 4) === ".pdf") {
			let worker = new Worker(`${__dirname}/worker.js`);
			let ch = new MessageChannel();
			worker.postMessage({
				port: ch.port1,
				realpath: `${__dirname}/src/${file}`,
				filename: file,
			}, [ch.port1]);
			ps.push(new Promise(r => ch.port2.on("message", () => {
				worker.terminate();
				r();
			})));
		}
	}

	await Promise.all(ps);
	process.exit(0);
})();
