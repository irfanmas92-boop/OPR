
export interface ReportData {
  tajukProgram: string;
  anjuran: string;
  peserta: string;
  caption: string;
  pencapaian: string;
  images: string[];
  preparedBy: string;
}

export const DEFAULT_REPORT: ReportData = {
  tajukProgram: "NAMA PROGRAM SEKOLAH",
  anjuran: "UNIT KOKURIKULUM",
  peserta: "SEMUA PELAJAR TAHAP 2",
  caption: "Program ini bertujuan untuk meningkatkan kesedaran tentang kebersihan dan keceriaan kawasan sekolah melalui aktiviti gotong-royong perdana.",
  pencapaian: "Seramai 250 orang pelajar telah menyertai program ini dengan jayanya. Kawasan angkat setiap kelas kini lebih bersih dan ceria.",
  images: [
    "https://picsum.photos/seed/report1/400/300",
    "https://picsum.photos/seed/report2/400/300",
    "https://picsum.photos/seed/report3/400/300"
  ],
  preparedBy: "UNIT MEDIA & DOKUMENTASI"
};
