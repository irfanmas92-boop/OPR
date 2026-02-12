
import React from 'react';
import { ReportData } from '../types';

interface ReportPreviewProps {
  data: ReportData;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ data }) => {
  // Using the direct link to the image provided by the user
  const backgroundImage = "https://iili.io/q97MM4S.png"; 
  const schoolLogo = "https://freeimage.host/i/q97YTZP";

  return (
    <div 
      className="a4-page relative bg-white shadow-2xl mx-auto flex flex-col p-14 text-gray-800"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98)), url('${backgroundImage}')`,
        backgroundSize: '35%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 60%'
      }}
    >
      {/* Decorative Border Overlay */}
      <div className="absolute inset-8 border border-gray-100 pointer-events-none rounded-sm opacity-40"></div>

      {/* Header Section */}
      <header className="flex flex-col items-center justify-center mb-12 border-b border-gray-100 pb-10 relative z-10">
        <div className="bg-white p-1.5 rounded-full shadow-sm mb-4 border border-gray-50">
          <img 
            src={schoolLogo} 
            alt="School Logo" 
            className="h-16 w-16 object-contain"
          />
        </div>
        <h1 className="text-2xl font-black tracking-[0.35em] text-gray-900 uppercase leading-none">
          ONE PAGE REPORT
        </h1>
        <p className="text-[10px] font-bold tracking-[0.25em] text-gray-400 mt-3 uppercase">
          Sekolah Rendah Islam Hidayah Pasirris
        </p>
      </header>

      {/* Main Content Body - Stacked Layout for Text */}
      <div className="flex-1 grid grid-cols-12 gap-12 relative z-10 overflow-hidden">
        
        {/* Left Column - All info stacks vertically here */}
        <div className="col-span-8 flex flex-col space-y-9">
          <section>
            <h3 className="text-[9px] font-bold text-blue-600 uppercase tracking-[0.15em] mb-2 border-l-2 border-blue-600 pl-3">Tajuk Program</h3>
            <p className="text-xl font-black text-gray-900 leading-tight uppercase tracking-tight">
              {data.tajukProgram || "[ISI TAJUK PROGRAM]"}
            </p>
          </section>

          <section>
            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 border-l-2 border-gray-200 pl-3">Anjuran</h3>
            <p className="text-[15px] font-bold text-gray-700">
              {data.anjuran || "[ISI ANJURAN]"}
            </p>
          </section>

          <section>
            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 border-l-2 border-gray-200 pl-3">Peserta</h3>
            <p className="text-[15px] font-medium text-gray-700">
              {data.peserta || "[ISI PESERTA]"}
            </p>
          </section>

          <section className="bg-gray-50/40 p-5 rounded-lg border border-gray-100/50">
            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 border-l-2 border-gray-200 pl-3">Caption</h3>
            <p className="text-[13px] text-gray-600 leading-relaxed italic font-medium">
              "{data.caption || "[ISI CAPTION RINGKAS DAN PADAT]"}"
            </p>
          </section>

          <section>
            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2.5 border-l-2 border-gray-200 pl-3">Pencapaian / Impak</h3>
            <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
              {data.pencapaian || "[ISI PENCAPAIAN ATAU IMPAK PROGRAM]"}
            </p>
          </section>
        </div>

        {/* Right Column - Gallery */}
        <div className="col-span-4 flex flex-col pt-1">
          <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
            <span>Gambar Program</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </h3>
          
          <div className="flex flex-col gap-5">
            {data.images.map((img, idx) => (
              <div key={idx} className="w-full rounded-xl shadow-sm overflow-hidden bg-gray-50 border border-gray-100 ring-1 ring-gray-100">
                <img 
                  src={img || `https://picsum.photos/seed/placeholder${idx}/400/300`} 
                  alt={`Report Image ${idx + 1}`} 
                  className="w-full h-auto object-cover block transition-all duration-300 hover:scale-105"
                  style={{ maxHeight: '135px' }}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-auto py-6 flex flex-col items-center justify-center opacity-20">
             <img src={schoolLogo} className="h-10 grayscale mb-1" alt="watermark" />
             <p className="text-[7px] font-bold uppercase tracking-widest text-center">Dokumentasi Digital</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-10 border-t border-gray-100 pt-8 flex justify-end relative z-10">
        <div className="text-right">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Disediakan oleh</span>
          <div className="w-28 h-[1px] bg-blue-100 mb-3 ml-auto"></div>
          <p className="text-sm font-black text-gray-900 tracking-tight">
            {data.preparedBy || "[NAMA PENYEDIA / UNIT MEDIA]"}
          </p>
          <p className="text-[9px] font-bold text-blue-500 mt-1 tracking-wider">UNIT MEDIA HIDAYAH PASIRRIS</p>
        </div>
      </footer>
    </div>
  );
};

export default ReportPreview;
