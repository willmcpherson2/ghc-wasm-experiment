import { WASI } from "@bjorn3/browser_wasi_shim/src";

const wasi = new WASI([], [], []);
const wasiImportObj = { wasi_snapshot_preview1: wasi.wasiImport };
const wasm = await WebAssembly.instantiateStreaming(fetch("experiment.wasm"), wasiImportObj);
wasi.inst = wasm.instance;
const exports = wasm.instance.exports;
const memory = exports.memory;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

exports._initialize();
exports.hs_init(0, 0);

async function handleKey(key) {
    const inputLen = Buffer.byteLength(key);
    const inputPtr = exports.malloc(inputLen);
    const inputArr = new Uint8Array(memory.buffer, inputPtr, inputLen);
    encoder.encodeInto(key, inputArr);

    const outputPtrPtr = exports.mallocPtr();
    const outputLen = exports.addExclamationToInput(inputPtr, inputLen, outputPtrPtr);
    const outputPtrArr = new Uint32Array(memory.buffer, outputPtrPtr, 1);
    const outputPtr = outputPtrArr[0];
    const outputArr = new Uint8Array(memory.buffer, outputPtr, outputLen);
    const output = decoder.decode(outputArr);
    console.log(output);
    exports.free(outputPtr);
}

document.addEventListener("keydown", event => handleKey(event.key), false);
