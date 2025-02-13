/**
 * Compress a string with browser native APIs into a binary string representation
 *
 * @param data - Input string that should be compressed
 * @param encoding - Compression algorithm to use
 * @returns The compressed binary string
 */
export async function compressRaw(data: string, encoding: CompressionFormat): Promise<string> {
  const stream = (
    new Blob([new TextEncoder().encode(data)]).stream() as unknown as ReadableStream
  ).pipeThrough(new CompressionStream(encoding));
  const buffer = await new Response(stream).arrayBuffer();

  return Array.from(new Uint8Array(buffer), (x) => String.fromCodePoint(x)).join("");
}

/**
 *	Compress a string with browser native APIs into a string representation
 *
 * @param data - Input string that should be compressed
 * @param encoding - Compression algorithm to use
 * @returns The compressed string
 */
export async function compress(data: string, encoding: CompressionFormat): Promise<string> {
  return window.btoa(await compressRaw(data, encoding));
}

/**
 * Decompress a binary string representation with browser native APIs in to a normal js string
 *
 * @param binary - Binary string that should be decompressed, e.g. the output from `atob`
 * @param encoding - Decompression algorithm to use
 * @returns The decompressed string
 */
export async function decompressRaw(binary: string, encoding: CompressionFormat): Promise<string> {
  const stream = (
    new Blob([
      Uint8Array.from(binary, (m) => m.codePointAt(0)!),
    ]).stream() as unknown as ReadableStream
  ).pipeThrough(new DecompressionStream(encoding));

  return new Response(stream).text();
}

/**
 * Decompress a string representation with browser native APIs in to a normal js string
 *
 * @param data - String that should be decompressed
 * @param encoding - Decompression algorithm to use
 * @returns The decompressed string
 */
export async function decompress(data: string, encoding: CompressionFormat): Promise<string> {
  return decompressRaw(window.atob(data), encoding);
}
