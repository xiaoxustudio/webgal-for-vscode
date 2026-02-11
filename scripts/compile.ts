import concurrently from "concurrently";

const { result } = concurrently([
	{
		command: "tsc -p ."
	}
]);

result
	.then(() => {
		concurrently([
			{
				command: "tsc-alias -p tsconfig.json"
			}
		]);
	})
	.catch((error) => {
		console.error("Error:", error);
	});
