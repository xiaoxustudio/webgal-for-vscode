// @ts-nocheck
import concurrently from "concurrently";

concurrently(["tsc -p ."], {
	killOthersOn: "failure"
})
	.result.then(() => {
		concurrently([{ command: "tsc -w -p ." }], {
			killOthersOn: "failure"
		}).result.catch((e) => {
			console.error("Error(step2)", e);
			process.exit(1);
		});
		concurrently([{ command: "tsc-alias -w" }], {
			killOthersOn: "failure"
		}).result.catch((e) => {
			console.error("Error(step3)", e);
			process.exit(1);
		});
	})
	.catch((e) => {
		console.error("Error(step1)", e);
		process.exit(1);
	});
