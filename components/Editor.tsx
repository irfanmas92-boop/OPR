
import React from 'react';
import { ReportData } from '../types';

interface EditorProps {
  data: ReportData;
  onChange: (newData: Partial<ReportData>) => void;
  onImageChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefine: (field: 'caption' | 'pencapaian') => Promise<void>;
  isRefining: boolean;
}

const Editor: React.FC<EditorProps> = ({ data, onChange, onImageChange, onRefine, isRefining }) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Report Content Editor
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tajuk Program</label>
          <input 
            type="text" 
            placeholder="Contoh: Program Gotong-Royong Perdana"
            value={data.tajukProgram}
            onChange={(e) => onChange({ tajukProgram: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Anjuran</label>
          <input 
            type="text" 
            placeholder="Contoh: Unit Kokurikulum"
            value={data.anjuran}
            onChange={(e) => onChange({ anjuran: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Peserta</label>
          <input 
            type="text" 
            placeholder="Contoh: Semua Pelajar Tahap 2"
            value={data.peserta}
            onChange={(e) => onChange({ peserta: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Caption Ringkas</label>
            <button 
              onClick={() => onRefine('caption')}
              disabled={isRefining || !data.caption}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI POLISH
            </button>
          </div>
          <textarea 
            rows={2}
            value={data.caption}
            onChange={(e) => onChange({ caption: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Pencapaian / Impak</label>
            <button 
              onClick={() => onRefine('pencapaian')}
              disabled={isRefining || !data.pencapaian}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI POLISH
            </button>
          </div>
          <textarea 
            rows={3}
            value={data.pencapaian}
            onChange={(e) => onChange({ pencapaian: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-colors"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gambar Program (3 keping)</label>
          <div className="grid grid-cols-1 gap-3">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200 transition-all hover:bg-white hover:shadow-sm">
                <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden border border-gray-300">
                  <img src={data.images[idx]} className="w-full h-full object-cover" alt={`Prev ${idx}`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => onImageChange(idx, e)}
                    className="text-[10px] text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Disediakan Oleh</label>
          <input 
            type="text" 
            placeholder="Nama Penyedia"
            value={data.preparedBy}
            onChange={(e) => onChange({ preparedBy: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
