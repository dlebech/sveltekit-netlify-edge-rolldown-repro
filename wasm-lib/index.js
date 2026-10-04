// Like resvg/satori-based packages, this imports a .wasm file directly
export async function add(a, b) {
	const wasm = await import('./add.wasm');
	return wasm.add(a, b);
}
