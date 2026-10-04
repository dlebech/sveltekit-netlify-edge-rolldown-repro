import { add } from 'wasm-lib';

export async function GET() {
	return new Response(`2 + 3 = ${await add(2, 3)}`);
}
