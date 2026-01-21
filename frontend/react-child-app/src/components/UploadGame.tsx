import { useState } from 'react';

const UploadWebGame = () => {
  const [_step, _setStep] = useState(1);
  const [_isUploading, _setIsUploading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Web_Runtime_Deploy</h1>
          <span className="text-[10px] bg-[#822C2C]/20 text-[#822C2C] px-3 py-1 rounded-full border border-[#822C2C]/50 font-black uppercase">
            Platform: WebGL / HTML5
          </span>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left: Form */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-[#151515] p-8 rounded-2xl border border-white/10">
              <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Build Configuration</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2">Entry Point</label>
                  <input
                    type="text"
                    placeholder="index.html"
                    className="w-full bg-black border border-white/5 p-3 rounded font-mono text-sm text-[#822C2C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-2">Canvas Width</label>
                    <input type="text" placeholder="1280" className="w-full bg-black border border-white/5 p-3 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-2">Canvas Height</label>
                    <input type="text" placeholder="720" className="w-full bg-black border border-white/5 p-3 rounded text-sm" />
                  </div>
                </div>

                <div className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-[#822C2C] transition-all cursor-pointer bg-black/20">
                  <p className="text-2xl mb-2">📂</p>
                  <p className="text-xs font-bold uppercase">Drop your build folder (.zip)</p>
                  <p className="text-[10px] text-gray-600 mt-2 italic">Must contain an index.html and assets folder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Architecture Preview */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-[#822C2C]/5 p-6 rounded-2xl border border-[#822C2C]/20">
              <h3 className="text-xs font-black uppercase mb-4 text-[#822C2C]">How it launches</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                When a user clicks "Play" in the browser, our system will mount your files into an
                <b> Isolated Iframe Sandbox</b>.
              </p>
              <ul className="text-[10px] space-y-2 text-gray-500 font-mono">
                <li>+ CORS Policy: Restricted</li>
                <li>+ Storage: IndexedDB Enabled</li>
                <li>+ Network: Enabled</li>
              </ul>
            </div>

            <button className="w-full py-4 bg-[#822C2C] hover:bg-[#a13737] font-black uppercase tracking-widest text-sm rounded-lg shadow-xl shadow-red-900/20">
              Validate & Publish
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UploadWebGame;