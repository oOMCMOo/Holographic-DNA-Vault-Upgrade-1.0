import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef, useMemo } from "react";
import { 
  Dna, 
  Database, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Lock, 
  Cpu, 
  Binary,
  Layers,
  CircleDot,
  Upload,
  Key,
  Wallet,
  Eye,
  Settings,
  X,
  ChevronRight,
  Maximize2,
  Search,
  FileAudio,
  FileVideo,
  FileArchive,
  FileCode,
  FileText,
  File as FileIcon,
  Download
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Helix3D, VaultBackground } from "./components/Vault3D/VaultScene.tsx";
import { encryptData, decryptData } from "./lib/cryptoUtils.ts";
import { fileToDNA, downloadFileFromDNA } from "./lib/dnaUtils.ts";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// --- Types ---
type ViewMode = "TERMINAL" | "VAULT_3D" | "WALLETS" | "CONVERTER" | "CIPHER" | "GENOMIC_MAP";

interface VaultFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dnaSequence: string;
  timestamp: number;
}

interface ActivityLog {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning';
  timestamp: number;
}

// --- Components ---

const SacredGeometry = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none overflow-hidden">
      <motion.svg
        viewBox="0 0 1000 1000"
        className="w-[1200px] h-[1200px] text-cyan-500/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Metatron's Cube / Flower of Life Construction */}
        <g filter="url(#glow)">
          <circle cx="500" cy="500" r="480" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="500" cy="500" r="320" fill="none" stroke="currentColor" strokeWidth="0.3" strokeDasharray="10 5" />
          
          {/* Hexagonal Grid */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 500 500)`}>
              <circle cx="500" cy="340" r="160" fill="none" stroke="currentColor" strokeWidth="0.2" />
              <line x1="500" y1="500" x2="500" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
              {/* Internal Lines */}
              <line x1="500" y1="500" x2="638" y2="260" stroke="currentColor" strokeWidth="0.2" opacity="0.3" />
              <line x1="500" y1="500" x2="362" y2="260" stroke="currentColor" strokeWidth="0.2" opacity="0.3" />
            </g>
          ))}
          
          {/* Inner Flower */}
          <circle cx="500" cy="500" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
        </g>
      </motion.svg>
    </div>
  );
};

const CodeStream = () => {
  const [streams, setStreams] = useState<string[]>([]);

  useEffect(() => {
    const chars = "ATCG01";
    const generateStream = () => {
      let s = "";
      for (let i = 0; i < 20; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
      return s;
    };
    setStreams(Array.from({ length: 15 }, generateStream));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {streams.map((s, i) => (
        <motion.div
          key={i}
          initial={{ x: -100, y: Math.random() * 100 + "%", opacity: 0 }}
          animate={{ x: "120%", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            delay: Math.random() * 20,
            ease: "linear",
          }}
          className="absolute whitespace-nowrap text-[8px] font-mono tracking-[1em] text-cyan-500"
        >
          {s}
        </motion.div>
      ))}
    </div>
  );
};

const DNAHelix = () => {
  const points = Array.from({ length: 24 });
  
  return (
    <div className="relative z-10 flex items-center justify-center h-[550px] w-64 perspective-1000">
      {/* Helix 1 */}
      <div className="absolute inset-0 flex flex-col justify-between items-center py-4">
        {points.map((_, i) => (
          <motion.div
            key={`a-${i}`}
            className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] flex items-center justify-center"
            animate={{
              x: Math.sin(i * 0.4) * 80,
              z: Math.cos(i * 0.4) * 80,
              opacity: [0.2, 1, 0.2],
              scale: [0.7, 1.3, 0.7]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15
            }}
          >
            <div className="text-[6px] font-bold text-black select-none">
              {['A', 'T', 'G', 'C'][Math.floor((i + Math.random() * 4) % 4)]}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Helix 2 */}
      <div className="absolute inset-0 flex flex-col justify-between items-center py-4">
        {points.map((_, i) => (
          <motion.div
            key={`b-${i}`}
            className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_20px_#a78bfa] flex items-center justify-center"
            animate={{
              x: Math.sin(i * 0.4 + Math.PI) * 80,
              z: Math.cos(i * 0.4 + Math.PI) * 80,
              opacity: [1, 0.2, 1],
              scale: [1.3, 0.7, 1.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15
            }}
          >
            <div className="text-[6px] font-bold text-black select-none">
              {['A', 'T', 'G', 'C'][Math.floor((i + 2) % 4)]}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rungs (Bonding lines) */}
      <div className="absolute inset-0 flex flex-col justify-between items-center py-4 overflow-visible">
        {points.map((_, i) => (
          <motion.div
            key={`rung-${i}`}
            className="h-[0.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: Math.abs(Math.sin(i * 0.4)) * 2,
              opacity: [0.05, 0.2, 0.05]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15
            }}
            style={{ width: '160px' }}
          />
        ))}
      </div>
    </div>
  );
};

const CipherPanel = () => {
  const [passphrase, setPassphrase] = useState("");
  const [data, setData] = useState("");
  const [result, setResult] = useState("");

  const handleAction = (mode: 'encrypt' | 'decrypt') => {
    if (mode === 'encrypt') {
      const encrypted = encryptData(data, passphrase);
      setResult(encrypted);
    } else {
      const decrypted = decryptData(data, passphrase);
      setResult(decrypted || "DECRYPTION_FAILED: Invalid identity key");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="hud-panel p-6 rounded-2xl w-full max-w-2xl bg-black/80 border-violet-500/30">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-5 h-5 text-violet-400" />
        <h2 className="glitch-text text-lg">Cryptographic Core (AES-256-GCM)</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="glitch-text opacity-50 block mb-2">Security Passphrase</label>
          <input 
            type="password" 
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 font-mono text-violet-300 focus:border-violet-500/50 outline-none transition-colors"
            placeholder="Enter quantum-resistant key..."
          />
        </div>
        
        <div>
          <label className="glitch-text opacity-50 block mb-2">Input Payload / Cipher</label>
          <textarea 
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 font-mono text-sm h-32 focus:border-violet-500/50 outline-none transition-colors resize-none"
            placeholder="Raw sensitive data or DNA sequence..."
          />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => handleAction('encrypt')}
            className="flex-1 px-6 py-3 bg-violet-600/20 border border-violet-500/40 rounded-xl glitch-text hover:bg-violet-600/40 transition-colors cursor-pointer"
          >
            Encrypt to Vault
          </button>
          <button 
            onClick={() => handleAction('decrypt')}
            className="flex-1 px-6 py-3 bg-emerald-600/20 border border-emerald-500/40 rounded-xl glitch-text hover:bg-emerald-600/40 transition-colors cursor-pointer"
          >
            Decrypt Fragment
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-lg">
            <label className="glitch-text opacity-40 block mb-2">Result Hash</label>
            <div className="font-mono text-xs break-all text-blue-300 max-h-32 overflow-y-auto">
              {result}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FilePreview = ({ file }: { file: File }) => {
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (file.type.startsWith('image/')) {
    return (
      <div className="w-full h-32 rounded-lg overflow-hidden border border-white/10 bg-black/40 relative group">
        <img src={previewUrl} alt="preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] glitch-text bg-black/60 px-2 py-1 rounded">IMAGE_LOADED</span>
        </div>
      </div>
    );
  }

  if (file.type.startsWith('video/')) {
    return (
      <div className="w-full h-32 rounded-lg overflow-hidden border border-white/10 bg-black/40 relative group">
        <video 
          src={previewUrl} 
          autoPlay 
          muted 
          loop 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" 
        />
        <div className="absolute top-2 right-2">
          <FileVideo className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_#22d3ee]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] glitch-text bg-black/60 px-2 py-1 rounded">VIDEO_STREAM_READY</span>
        </div>
      </div>
    );
  }

  if (file.type.startsWith('audio/')) {
    return (
      <div className="w-full h-32 rounded-lg border border-white/10 bg-black/40 flex flex-col items-center justify-center gap-3 relative group">
        <div className="flex items-center gap-1 h-8">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-cyan-400/60 rounded-full"
              animate={{ height: [8, 24, 12, 28, 10] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <FileAudio className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] glitch-text text-slate-400 uppercase">Acoustic_Signature_Detected</span>
        </div>
        <audio src={previewUrl} className="hidden" />
      </div>
    );
  }

  // Generic Icons for Arvhices, Code, etc.
  let Icon = FileIcon;
  let label = "SYNTHESIZING_BINARY";
  let color = "text-slate-400";

  if (file.name.match(/\.(zip|rar|7z|tar)$/i)) {
    Icon = FileArchive;
    label = "ARCHIVE_ENCODED";
    color = "text-amber-400";
  } else if (file.name.match(/\.(js|ts|tsx|html|css|py|cpp)$/i)) {
    Icon = FileCode;
    label = "SOURCE_CODE_EXTRACTED";
    color = "text-blue-400";
  } else if (file.name.match(/\.(txt|pdf|doc|docx)$/i)) {
    Icon = FileText;
    label = "DOCUMENT_STAGED";
    color = "text-violet-400";
  }

  return (
    <div className="w-full h-32 rounded-lg border border-white/10 bg-black/40 flex flex-col items-center justify-center gap-2 group">
      <Icon className={`w-8 h-8 ${color} opacity-40 group-hover:opacity-100 transition-opacity`} />
      <span className={`text-[10px] glitch-text ${color} opacity-60`}>{label}</span>
      <span className="text-[8px] font-mono opacity-20 uppercase tracking-widest">{file.name.split('.').pop()}_BLOCK_ID: {Math.random().toString(16).substring(2, 6)}</span>
    </div>
  );
};

const FileConverter = ({ onStore, addLog }: { onStore: (file: File, dna: string) => void, addLog: (text: string, type: any) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dnaSequence, setDnaSequence] = useState("");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setConverting(true);
      setProgress(0);
      setStatus("Initializing binary scanner...");
      
      addLog(`Selected file: ${f.name} for molecular synthesis`, 'info');
      
      const dna = await fileToDNA(f, (p) => {
        setProgress(p);
        if (p < 30) setStatus("Fragmenting binary data...");
        else if (p < 70) setStatus("Synthesizing nucleotide clusters...");
        else if (p < 100) setStatus("Optimizing molecular density...");
        else setStatus("Synthesis complete");
      });
      
      setDnaSequence(dna);
      setConverting(false);
      addLog(`Successfully synthesized ${f.name} into DNA sequence`, 'success');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="hud-panel p-6 rounded-2xl w-full max-w-2xl bg-black/80 border-cyan-500/30 shadow-[0_0_50px_-20px_rgba(34,211,238,0.2)]">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-5 h-5 text-cyan-400" />
        <h2 className="glitch-text text-lg">Molecular File Synthesizer</h2>
      </div>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 hover:border-cyan-500/30 transition-all group relative overflow-hidden bg-white/[0.02]">
        <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" disabled={converting} />
        <div className="flex flex-col items-center gap-4 text-slate-400 group-hover:text-cyan-300">
          <Layers className={`w-12 h-12 ${converting ? 'animate-pulse text-cyan-400' : ''}`} />
          <p className="glitch-text">Drop archive to sequence (MP3, ZIP, MP4...)</p>
          {file && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-1">
              <span className="text-sm font-mono text-emerald-400">Selected: {file.name}</span>
              <span className="text-[10px] text-slate-500 font-mono italic">Signature: {file.type || 'RAW_BINARY'}</span>
            </motion.div>
          )}
        </div>
      </div>

      {converting && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-4">
          <div className="flex justify-between items-end mb-1">
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                <CircleDot className="w-4 h-4 text-cyan-400" />
              </motion.div>
              <span className="glitch-text text-[11px] text-cyan-400 tracking-wider uppercase">{status}</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-500/60">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 relative"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
          <div className="flex justify-between px-1">
            <span className="text-[8px] font-mono text-slate-600">OFFSET_0x{Math.floor(progress * 1.5).toString(16).toUpperCase()}</span>
            <span className="text-[8px] font-mono text-slate-600">PARITY_CHECK_PASS</span>
          </div>
        </motion.div>
      )}

      {dnaSequence && !converting && (
        <div className="mt-8 flex flex-col gap-6">
          {file && <FilePreview file={file} />}
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <label className="glitch-text opacity-40 text-[11px]">Synthesized Sequence Fragment</label>
                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-500/60">Size: {(file?.size || 0) / 1024} KB</span>
                <button 
                  onClick={() => {
                    if (file) {
                      onStore(file, dnaSequence);
                      setDnaSequence("");
                      setFile(null);
                      addLog(`Committed ${file.name} to core vault`, 'success');
                    }
                  }}
                  className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] glitch-text hover:bg-emerald-500/20 text-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]"
                >
                  COMMIT TO VAULT
                </button>
              </div>
            </div>
            <div className="bg-black/60 p-5 rounded-2xl font-mono text-[10px] break-all h-48 overflow-y-auto text-emerald-300/80 leading-relaxed border border-white/5 backdrop-blur-md custom-scrollbar">
              {dnaSequence.substring(0, 8000)}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const GenomicMap = ({ sequence, fileName }: { sequence: string, fileName: string }) => {
  const chars = sequence.substring(0, 4800).split(""); // Limit for performance grid
  
  const getBaseColor = (base: string) => {
    switch (base) {
      case 'A': return 'bg-cyan-500';
      case 'T': return 'bg-violet-500';
      case 'G': return 'bg-emerald-500';
      case 'C': return 'bg-amber-500';
      default: return 'bg-slate-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="hud-panel p-8 rounded-3xl w-full max-w-5xl bg-black/90 border-violet-500/20 flex flex-col gap-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="glitch-text text-2xl text-violet-300 uppercase tracking-widest">Molecular Mapping</h2>
          <p className="text-[10px] text-slate-500 font-mono mt-1">STRUCTURAL_ANALYSIS: {fileName}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]" />
            <span className="text-[9px] font-mono opacity-60">ADENINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_5px_#8b5cf6]" />
            <span className="text-[9px] font-mono opacity-60">THYMINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
            <span className="text-[9px] font-mono opacity-60">GUANINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_#f59e0b]" />
            <span className="text-[9px] font-mono opacity-60">CYTOSINE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-px bg-white/5 p-2 rounded-xl border border-white/5 backdrop-blur-md overflow-hidden max-h-[500px]">
        {chars.map((base, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.0001 }}
            className={`aspect-square rounded-sm ${getBaseColor(base)} opacity-60 hover:opacity-100 hover:scale-125 transition-all cursor-crosshair group relative`}
            title={`Index: ${i} | Base: ${base}`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between items-end">
        <div className="hud-panel px-4 py-2 rounded-lg border-white/5">
          <span className="glitch-text text-violet-400 block text-[9px] mb-1">Density Index</span>
          <span className="text-xl font-mono">{(sequence.length / 1024).toFixed(2)} kb/sq</span>
        </div>
        <div className="text-right flex flex-col gap-1 items-end">
          <span className="glitch-text text-emerald-400 text-[10px]">STABLE_GENOME_STREAMS</span>
          <div className="flex gap-1 h-3 items-end">
            {[1, 0.4, 0.8, 0.2, 1, 0.6].map((h, i) => (
              <motion.div 
                key={i} 
                className="w-1 bg-emerald-500/40 rounded-t-sm" 
                animate={{ height: h * 20 }} 
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VaultInventory = ({ files, onHighlight, onVisualise, addLog }: { files: VaultFile[], onHighlight: (dna: string) => void, onVisualise: (file: VaultFile) => void, addLog: (text: string, type: any) => void }) => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="hud-panel p-6 rounded-2xl w-full max-w-2xl bg-black/80 border-emerald-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-emerald-400" />
          <h2 className="glitch-text text-lg">Vault Inventory</h2>
        </div>
        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{files.length} Fragments Encoded</div>
      </div>

      {files.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-4 text-slate-500 border border-white/5 rounded-xl bg-black/20">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <Binary className="w-6 h-6 opacity-20" />
          </div>
          <div className="italic font-mono text-[10px] uppercase tracking-tighter">Vault is currently empty. Sequenced strands pending...</div>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
          {files.map(file => (
            <motion.div 
              layout
              key={file.id} 
              className="p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.05] transition-all flex items-center justify-between group"
            >
              <div className="flex gap-4 items-center">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <FileIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="glitch-text text-[11px] text-emerald-100 group-hover:text-white transition-colors">{file.name}</div>
                  <div className="font-mono text-[8.5px] text-slate-500 uppercase flex gap-2">
                    <span>{file.type}</span>
                    <span className="opacity-40">|</span>
                    <span>{ (file.size / 1024).toFixed(1) } KB</span>
                    <span className="opacity-40">|</span>
                    <span className="text-emerald-500/50">SECURED</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={() => onVisualise(file)}
                  className="p-2 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-all hover:scale-110 active:scale-90"
                  title="Genomic Mapping"
                >
                  <Dna className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onHighlight(file.dnaSequence.substring(0, 10))}
                  className="p-2 hover:bg-violet-500/20 rounded-lg text-violet-400 transition-all hover:scale-110 active:scale-90"
                  title="Highlight in 3D Core"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    downloadFileFromDNA(file.dnaSequence, file.name, file.type);
                    addLog(`Decoding and downloading fragment: ${file.name}`, 'info');
                  }}
                  className="p-2 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-all hover:scale-110 active:scale-90"
                  title="Decode & Restore File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const WalletInterface = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0.00");

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      const bal = await provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(bal));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="hud-panel p-6 rounded-2xl w-full max-w-xl bg-black/80 border-gold-500/30">
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="w-5 h-5 text-amber-500" />
        <h2 className="glitch-text text-lg">Web3 Asset Bridge</h2>
      </div>

      {!address ? (
        <button 
          onClick={connectWallet}
          className="w-full flex items-center justify-center gap-4 px-8 py-12 border border-amber-500/20 rounded-2xl hover:bg-amber-500/10 hover:border-amber-500/50 transition-all group"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="glitch-text group-hover:text-amber-400">Initialize Neural Wallet Link</span>
            <span className="text-[10px] text-slate-500 font-serif italic text-center">Compatible with MetaMask, Phantom, & WalletConnect</span>
          </div>
        </button>
      ) : (
        <div className="space-y-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <label className="glitch-text opacity-40 block mb-1">Contract Identity</label>
            <div className="font-mono text-amber-300 text-sm">{address}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="hud-panel p-4 rounded-xl border-amber-500/20">
              <span className="glitch-text opacity-40 block mb-1">Vault Registry</span>
              <span className="text-xl font-mono">0.0 ETH</span>
            </div>
            <div className="hud-panel p-4 rounded-xl border-emerald-500/20">
              <span className="glitch-text opacity-40 block mb-1">Wallet Link Balance</span>
              <span className="text-xl font-mono text-emerald-400">{parseFloat(balance).toFixed(4)} ETH</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] glitch-text text-emerald-400">Multi-Functional Asset Storage Enabled</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-20"
          initial={{
            x: Math.random() * 1920,
            y: Math.random() * 1080,
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
        />
      ))}
    </div>
  );
};

const HUDElement = ({ title, value, icon: Icon, color = "text-emerald-400" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="hud-panel p-4 rounded-xl flex flex-col gap-2 min-w-[200px] cursor-pointer group active:scale-95 transition-all"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color} group-hover:animate-pulse`} />
          <span className="glitch-text text-slate-400 text-[11px]">{title}</span>
        </div>
        <div className={`w-1.5 h-1.5 rounded-full ${color} opacity-40 group-hover:opacity-100 transition-opacity`} />
      </div>
      <div className={`text-xl font-mono ${color} glow-text tabular-nums tracking-tighter`}>{value}</div>
      <div className="w-full bg-slate-800 h-[3px] rounded-full overflow-hidden">
        <motion.div 
          className={`h-full bg-current ${color}`}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.random() * 40 + 50}%` }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/60 rounded-lg mt-2"
          >
            <div className="p-3 text-[9px] font-mono space-y-1.5 text-slate-500">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>PARITY_STATUS:</span>
                <span className="text-emerald-400">OPTIMAL</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>LATENCY_SYNC:</span>
                <span className="text-cyan-400">0.03ms</span>
              </div>
              <div className="flex justify-between">
                <span>ENCRYPTION_ID:</span>
                <span className="text-violet-400 text-[8px]">{Math.random().toString(16).substring(2, 10).toUpperCase()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("TERMINAL");
  const [dataIndex, setDataIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<VaultFile | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: '1', text: 'Neural link established with DNA Core', type: 'success', timestamp: Date.now() },
    { id: '2', text: 'Rotating security keys for VX-990 node', type: 'info', timestamp: Date.now() - 2000 },
  ]);

  const addLog = (text: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substring(2),
      text,
      type,
      timestamp: Date.now()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50
  };

  const [vaultedFiles, setVaultedFiles] = useState<VaultFile[]>([]);

  const totalBytesVal = useMemo(() => vaultedFiles.reduce((acc, f) => acc + f.size, 0), [vaultedFiles]);

  const capacity = useMemo(() => {
    return 142.8 + (totalBytesVal / (1024 ** 4)); // Baseline + PB offset
  }, [totalBytesVal]);

  const humanReadableSize = useMemo(() => {
    if (totalBytesVal === 0) return "0.00 B";
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(totalBytesVal) / Math.log(k));
    return parseFloat((totalBytesVal / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, [totalBytesVal]);

  const activeUnits = useMemo(() => {
    return 12.8 + vaultedFiles.length * 0.12;
  }, [vaultedFiles]);

  const handleStore = (file: File, dna: string) => {
    const newFile: VaultFile = {
      id: Math.random().toString(36).substring(2),
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      dnaSequence: dna,
      timestamp: Date.now()
    };
    setVaultedFiles(prev => [newFile, ...prev]);
  };

  const handleHighlight = (dna: string) => {
    setSearchQuery(dna);
    setViewMode("VAULT_3D");
  };

  const handleVisualise = (file: VaultFile) => {
    setSelectedFile(file);
    setViewMode("GENOMIC_MAP");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDataIndex(prev => (prev + 1) % 100);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const NavItem = ({ mode, icon: Icon, label }: { mode: ViewMode, icon: any, label: string }) => (
    <button 
      onClick={() => setViewMode(mode)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${viewMode === mode ? 'bg-violet-500/20 text-violet-300 border-l-2 border-violet-500' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
    >
      <Icon className="w-4 h-4" />
      <span className="glitch-text text-[10px]">{label}</span>
      {viewMode === mode && <motion.div layoutId="nav-glow" className="ml-auto w-1 h-1 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />}
    </button>
  );

  return (
    <div className="relative min-h-screen w-full flex text-slate-100 overflow-hidden bg-black">
      <div className="atmosphere" />
      <div className="circuit-pattern" />
      <div className="scanline" />
      <CodeStream />
      <FloatingParticles />

      {/* Sidebar Navigation */}
      <aside className="relative z-30 w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-black/40 backdrop-blur-xl">
        <div className="flex flex-col">
          <h1 className="text-xl font-light tracking-[0.2em] text-white opacity-90 uppercase">
            HOLOGRAPHIC <br /><span className="text-violet-400">DNA VAULT</span>
            <div className="text-[10px] mt-1 opacity-40 text-violet-300 normal-case tracking-normal">by oOMCMOo</div>
          </h1>
          <div className="h-px w-12 bg-violet-500/30 mt-4" />
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem mode="TERMINAL" icon={Layers} label="Interface HUD" />
          <NavItem mode="VAULT_3D" icon={Maximize2} label="3D Vault Core" />
          <NavItem mode="CIPHER" icon={Lock} label="Cipher Engine" />
          <NavItem mode="CONVERTER" icon={Upload} label="Molecular Sync" />
          {selectedFile && <NavItem mode="GENOMIC_MAP" icon={Dna} label="Sequencer Map" />}
          <NavItem mode="WALLETS" icon={Wallet} label="Web3 Bridge" />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="hud-panel p-3 rounded-lg border-white/5">
            <span className="glitch-text opacity-40 block mb-1">Signal</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 text-[9px] text-slate-500 font-mono">
            <CircleDot className="w-2 h-2 text-emerald-500 animate-pulse" />
            STABLE_LUNA_LINK
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex-1 flex flex-col p-8 overflow-hidden z-20">
        
        {/* Header HUD info - persistent across some views if needed */}
        <header className="flex justify-between items-start mb-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <div className="flex gap-4">
              <span className="glitch-text text-slate-500">Node_ID: VX-990</span>
              <span className="glitch-text text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> SECURE_SENSE_ENABLED
              </span>
            </div>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="glitch-text opacity-40">System Entropy</p>
              <p className="font-mono text-emerald-400">0.0004%</p>
            </div>
            <div className="hud-panel px-4 py-2 rounded-lg flex flex-col items-end gap-1 border-white/5 bg-black/40">
              <div className="flex items-center gap-4">
                <span className="glitch-text text-[10px] opacity-40">Stored Data:</span>
                <span className="font-mono text-emerald-400 tabular-nums uppercase">{humanReadableSize}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="glitch-text text-[10px] opacity-40">Total Capacity:</span>
                <span className="font-mono text-slate-300 tabular-nums">{capacity.toFixed(2)} TB</span>
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            {viewMode === "TERMINAL" && (
              <motion.div 
                key="terminal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full h-full flex flex-col items-center justify-center gap-12"
              >
                <SacredGeometry />
                <div className="flex items-center justify-center gap-24 lg:gap-32">
                  <div className="flex flex-col gap-6">
                    <HUDElement title="Molecular Storage" value="4.2 PB" icon={Database} />
                    <HUDElement title="Encoded Units" value={`${activeUnits.toFixed(2)}M`} icon={Binary} color="text-violet-400" />
                    <HUDElement title="Neural Sync" value="ACTIVE" icon={Cpu} color="text-emerald-400" />
                  </div>
                  
                  <div className="relative group cursor-crosshair">
                    <DNAHelix />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-[500px] h-[500px] border border-emerald-500/10 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <HUDElement title="Ambient Nebula" value="0.04μg" icon={Activity} color="text-amber-400" />
                    <HUDElement title="Encr. Layers" value="14,204" icon={Lock} color="text-slate-300" />
                    <HUDElement title="Active Streams" value="1.2k/s" icon={Layers} color="text-emerald-400" />
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === "VAULT_3D" && (
              <motion.div 
                key="vault3d"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 group bg-slate-950"
              >
                {/* Search Interface Overlay */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-4">
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="hud-panel p-1.5 rounded-full flex items-center gap-2 bg-black/60 border-violet-500/20 backdrop-blur-md"
                  >
                    <div className="p-2 bg-violet-500/10 rounded-full">
                      <Search className="w-4 h-4 text-violet-400" />
                    </div>
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value.toUpperCase().replace(/[^ATGC]/g, ""))}
                      placeholder="Input sequence: ATGC..."
                      className="bg-transparent border-none outline-none font-mono text-[10px] w-full text-violet-100 placeholder:text-slate-600 tracking-[0.2em]"
                    />
                    {searchQuery && (
                      <div className="flex items-center gap-2 pr-2">
                        <span className={`text-[8px] font-mono whitespace-nowrap ${( "ATGC".repeat(15) ).includes(searchQuery.toUpperCase()) ? 'text-emerald-400' : 'text-red-400'}`}>
                          {( "ATGC".repeat(15) ).includes(searchQuery.toUpperCase()) ? '[MATCH_FOUND]' : '[NO_MATCH]'}
                        </span>
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="p-1 px-3 hover:bg-white/5 rounded-full transition-colors text-[9px] font-mono text-slate-500"
                        >
                          CLEAR
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>

                <Canvas>
                  <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
                  <VaultBackground />
                  <Helix3D searchQuery={searchQuery} />
                  <OrbitControls 
                    enableDamping 
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    maxDistance={25}
                    minDistance={5}
                  />
                </Canvas>
                <div className="absolute bottom-6 left-6 flex flex-col gap-1 pointer-events-none">
                  <span className="glitch-text text-violet-400">3D Neural Visualizer</span>
                  <span className="text-[9px] text-slate-500 font-mono">Use Mouse to Orbit // Scroll to Zoom</span>
                </div>
              </motion.div>
            )}

            {viewMode === "CIPHER" && <CipherPanel key="cipher" />}
            {viewMode === "CONVERTER" && (
              <div className="flex flex-col gap-12 items-center w-full max-w-4xl h-full overflow-y-auto py-8 custom-scrollbar">
                <FileConverter key="converter" onStore={handleStore} addLog={addLog} />
                <VaultInventory files={vaultedFiles} onHighlight={handleHighlight} onVisualise={handleVisualise} addLog={addLog} />
              </div>
            )}
            {viewMode === "GENOMIC_MAP" && selectedFile && (
              <GenomicMap key="genomic-map" sequence={selectedFile.dnaSequence} fileName={selectedFile.name} />
            )}
            {viewMode === "WALLETS" && <WalletInterface key="wallets" />}
          </AnimatePresence>
        </div>

        {/* Console Log Footer */}
        <footer className="mt-8 flex justify-between items-end border-t border-white/5 pt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hud-panel w-[400px] p-4 rounded-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <div className="flex justify-between items-center mb-3">
              <p className="glitch-text text-[10px] flex items-center gap-2">
                <Activity className="w-3 h-3 text-cyan-400" />
                VAULT_ACTIVITY_STREAM
              </p>
              <span className="text-[8px] font-mono opacity-30">LIVE_METRICS</span>
            </div>
            
            <div className="font-mono text-[9px] space-y-1.5 h-20 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {logs.map((log) => (
                  <motion.div 
                    layout
                    key={log.id} 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-2 ${log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-slate-400'}`}
                  >
                    <span className="opacity-30">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                    <span className="flex-1 leading-tight">{log.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <div className="text-right">
              <span className="glitch-text opacity-40 block">Archive Cluster</span>
              <span className="text-[10px] font-mono text-slate-400">VOID_HEX_721</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
