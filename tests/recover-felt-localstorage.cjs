const fs = require("fs");
const path = require("path");

const source = process.argv[2];
const output = process.argv[3];
if (!source) throw new Error("Usage: node recover-felt-localstorage.cjs <leveldb-directory-or-file> [output.json]");
const wantedKey = "km-felt-canvas-notes-v1";

function varint(buffer, start) {
  let value = 0, shift = 0, offset = start;
  while (offset < buffer.length && shift < 56) {
    const byte = buffer[offset++];
    value += (byte & 0x7f) * (2 ** shift);
    if (!(byte & 0x80)) return { value, offset };
    shift += 7;
  }
  throw new Error(`Invalid varint at ${start}`);
}

function snappy(buffer) {
  const size = varint(buffer, 0);
  const result = Buffer.allocUnsafe(size.value);
  let input = size.offset, outputOffset = 0;
  while (input < buffer.length && outputOffset < result.length) {
    const tag = buffer[input++], type = tag & 3;
    if (type === 0) {
      let length = tag >>> 2;
      if (length < 60) length += 1;
      else {
        const bytes = length - 59; length = 0;
        for (let index = 0; index < bytes; index += 1) length += buffer[input++] * (2 ** (8 * index));
        length += 1;
      }
      buffer.copy(result, outputOffset, input, input + length);
      input += length; outputOffset += length;
      continue;
    }
    let length, distance;
    if (type === 1) {
      length = 4 + ((tag >>> 2) & 7);
      distance = ((tag & 0xe0) << 3) | buffer[input++];
    } else if (type === 2) {
      length = 1 + (tag >>> 2);
      distance = buffer.readUInt16LE(input); input += 2;
    } else {
      length = 1 + (tag >>> 2);
      distance = buffer.readUInt32LE(input); input += 4;
    }
    if (!distance || distance > outputOffset) throw new Error("Invalid snappy copy distance");
    for (let index = 0; index < length; index += 1) result[outputOffset + index] = result[outputOffset - distance + index];
    outputOffset += length;
  }
  if (outputOffset !== result.length) throw new Error(`Snappy size mismatch: ${outputOffset}/${result.length}`);
  return result;
}

function block(file, handle) {
  const raw = file.subarray(handle.offset, handle.offset + handle.size);
  const compression = file[handle.offset + handle.size];
  if (compression === 0) return raw;
  if (compression === 1) return snappy(raw);
  throw new Error(`Unsupported compression type ${compression}`);
}

function entries(buffer) {
  if (buffer.length < 4) return [];
  const restartCount = buffer.readUInt32LE(buffer.length - 4);
  const restartOffset = buffer.length - 4 - restartCount * 4;
  const result = [];
  let offset = 0, previous = Buffer.alloc(0);
  while (offset < restartOffset) {
    const shared = varint(buffer, offset); offset = shared.offset;
    const unshared = varint(buffer, offset); offset = unshared.offset;
    const valueSize = varint(buffer, offset); offset = valueSize.offset;
    const key = Buffer.concat([previous.subarray(0, shared.value), buffer.subarray(offset, offset + unshared.value)]);
    offset += unshared.value;
    const value = buffer.subarray(offset, offset + valueSize.value); offset += valueSize.value;
    result.push({ key, value }); previous = key;
  }
  return result;
}

function handle(buffer, start = 0) {
  const first = varint(buffer, start), second = varint(buffer, first.offset);
  return { offset: first.value, size: second.value, next: second.offset };
}

function tableEntries(filename) {
  const file = fs.readFileSync(filename);
  if (file.length < 48) return [];
  const footer = file.subarray(file.length - 48, file.length - 8);
  const meta = handle(footer, 0);
  const indexHandle = handle(footer, meta.next);
  const indexEntries = entries(block(file, indexHandle));
  const result = [];
  for (const indexEntry of indexEntries) result.push(...entries(block(file, handle(indexEntry.value))));
  return result;
}

function decodeValue(value) {
  if (!value.length) return "";
  if (value[0] === 0) return value.subarray(1).toString("utf16le");
  if (value[0] === 1) return value.subarray(1).toString("utf8");
  return value.toString("utf8");
}

const filenames = fs.statSync(source).isDirectory()
  ? fs.readdirSync(source).filter(name => name.endsWith(".ldb") || name.endsWith(".sst")).map(name => path.join(source, name))
  : [source];
const recovered = [];
for (const filename of filenames) {
  for (const entry of tableEntries(filename)) {
    const keyWithoutSequence = entry.key.length > 8 ? entry.key.subarray(0, -8) : entry.key;
    if (!keyWithoutSequence.includes(Buffer.from(wantedKey))) continue;
    const decoded = decodeValue(entry.value);
    try {
      const notes = JSON.parse(decoded);
      recovered.push({ filename, sequence: entry.key.length > 8 ? Number(entry.key.readBigUInt64LE(entry.key.length - 8) >> 8n) : 0, notes });
    } catch (error) {
      console.error("VALUE_PARSE_FAILED", path.basename(filename), entry.value.subarray(0, 20).toString("hex"), error.message);
    }
  }
}
recovered.sort((left, right) => left.sequence - right.sequence);
const summaries = recovered.map((item, version) => ({
  version: version + 1,
  file: path.basename(item.filename),
  sequence: item.sequence,
  count: item.notes.length,
  notes: item.notes.map(note => ({
    id: note.id,
    owner: note.owner,
    public: note.public,
    pendingSync: note.pendingSync,
    mode: note.mode,
    kind: note.kind,
    content: String(note.content || "").slice(0, 100),
    scale: note.scale,
    fontScale: note.fontScale,
    imageDataLength: String(note.imageData || "").length,
    imageUrl: note.imageUrl || "",
    doodleStrokes: Array.isArray(note.doodle) ? note.doodle.length : 0,
    pins: Array.isArray(note.pins) ? note.pins.length : 0
  }))
}));
console.log(JSON.stringify(summaries, null, 2));
if (output && recovered.length) {
  const best = recovered.reduce((selected, item) => item.notes.length > selected.notes.length ? item : selected, recovered[0]);
  const sanitized = best.notes.map(({ visitorId, pendingSync, public: publicState, remoteConfirmed, syncRejected, ...note }) => note);
  fs.writeFileSync(output, JSON.stringify(sanitized, null, 2));
  console.error(`RECOVERED ${best.notes.length} notes to ${output}`);
}
