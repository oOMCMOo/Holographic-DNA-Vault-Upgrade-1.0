
/**
 * Converts binary data (Uint8Array) to DNA sequence (A, T, C, G)
 * Standard mapping:
 * 00 -> A
 * 01 -> T
 * 10 -> C
 * 11 -> G
 */
export const binaryToDNA = (buffer: Uint8Array, onProgress?: (progress: number) => void): string => {
  let dna = "";
  const total = buffer.length;
  for (let i = 0; i < total; i++) {
    const byte = buffer[i];
    for (let j = 7; j >= 0; j -= 2) {
      const bitPair = (byte >> (j - 1)) & 0x03;
      switch (bitPair) {
        case 0: dna += "A"; break;
        case 1: dna += "T"; break;
        case 2: dna += "C"; break;
        case 3: dna += "G"; break;
      }
    }
    if (onProgress && i % 50000 === 0) {
      onProgress(Math.floor((i / total) * 100));
    }
  }
  if (onProgress) onProgress(100);
  return dna;
};

export const dnaToBinary = (dna: string): Uint8Array => {
  const bytes = new Uint8Array(Math.floor(dna.length / 4));
  for (let i = 0; i < bytes.length; i++) {
    let byte = 0;
    for (let j = 0; j < 4; j++) {
      const char = dna[i * 4 + j];
      let val = 0;
      switch (char) {
        case "A": val = 0; break;
        case "T": val = 1; break;
        case "C": val = 2; break;
        case "G": val = 3; break;
      }
      byte = (byte << 2) | val;
    }
    bytes[i] = byte;
  }
  return bytes;
};

export const downloadFileFromDNA = (dna: string, fileName: string, fileType: string) => {
  const binary = dnaToBinary(dna);
  const blob = new Blob([binary], { type: fileType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export const fileToDNA = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  return binaryToDNA(bytes, onProgress);
};
