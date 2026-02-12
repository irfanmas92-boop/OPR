
import React, { useState, useCallback } from 'react';
import { ReportData, DEFAULT_REPORT } from './types';
import ReportPreview from './components/ReportPreview';
import Editor from './components/Editor';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>(DEFAULT_REPORT);
  const [isRefining, setIsRefining] = useState(false);

  const handleDataChange = useCallback((newData: Partial<ReportData>) => {
    setReportData(prev => ({ ...prev, ...newData }));
  }, []);

  const handleImageChange = useCallback((index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...reportData.images];
        newImages[index] = reader.result as string;
        setReportData(prev => ({ ...prev, images: newImages }));
      };
      reader.readAsDataURL(file);
    }
  }, [reportData.images]);

  const handleRefineContent = async (field: 'caption' | 'pencapaian') => {
    if (!reportData[field]) return;
    
    setIsRefining(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a professional school report writer. 
      The school is "Sekolah Rendah Islam Hidayah Pasirris". 
      The program is "${reportData.tajukProgram}".
      Refine the following ${field} text to be more formal, professional, and impactful in Bahasa Melayu. 
      Keep it concise and clear.
      
      Original text: "${reportData[field]}"
      
      Return ONLY the refined text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const refinedText = response.text;
      if (refinedText) {
        setReportData(prev => ({ ...prev, [field]: refinedText.trim() }));
      }
    } catch (error) {
      console.error("AI Refinement Error:", error);
      alert("Maaf, ralat berlaku semasa memproses teks anda. Sila cuba lagi.");
    } finally {
      setIsRefining(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-8 p-4 md:p-8 bg-slate-50">
      {/* Sidebar Editor - Hidden when printing */}
      <aside className="w-full lg:w-[380px] space-y-6 no-print order-2 lg:order-1 overflow-y-auto max-h-screen pb-20 scrollbar-hide">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-blue-200 shadow-lg">
            R
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">OnePageReport</h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">Professional Suite</p>
          </div>
        </div>

        <Editor 
          data={reportData} 
          onChange={handleDataChange} 
          onImageChange={handleImageChange}
          onRefine={handleRefineContent}
          isRefining={isRefining}
        />

        <div className="flex flex-col gap-3">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl transition shadow-xl group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Generate PDF Report
          </button>
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-[10px] text-blue-800 leading-relaxed shadow-sm">
            <p className="font-bold flex items-center gap-2 mb-1 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Arahan Percetakan
            </p>
            <p>Untuk hasil terbaik, pilih <strong>Save as PDF</strong>, tetapkan <strong>Layout: Portrait</strong>, dan pastikan <strong>Background Graphics</strong> diaktifkan dalam tetapan pelayar anda.</p>
          </div>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 order-1 lg:order-2 flex justify-center items-start overflow-auto py-8 lg:py-0 px-4">
        <div className="transform scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.8] xl:scale-95 origin-top transition-transform duration-500">
          <ReportPreview data={reportData} />
        </div>
      </main>

      {/* Print-only container to ensure high-fidelity printing */}
      <div className="print-only hidden absolute inset-0 bg-white">
        <ReportPreview data={reportData} />
      </div>

      {/* AI Loading Overlay */}
      {isRefining && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center no-print">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 border border-blue-100">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="font-bold text-gray-800 animate-pulse uppercase tracking-widest text-xs">Gemini Memperhalusi Teks...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
