import React, { useRef } from 'react';
import { Student, Assignment, Submission, ClassSettings } from '../types';
import { calculateStudentStats, calculateClassStats, STATUS_CONFIG } from '../utils/alertEngine';
import { 
  Printer, 
  X, 
  ExternalLink, 
  Download, 
  FileCheck, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  School,
  Calendar
} from 'lucide-react';

interface Props {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  settings: ClassSettings;
  reportType: 'daily' | 'weekly';
  aiReportContent: string | null;
  onClose: () => void;
}

export const PrintReportModal: React.FC<Props> = ({
  students,
  assignments,
  submissions,
  settings,
  reportType,
  aiReportContent,
  onClose,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const stats = calculateClassStats(students, assignments, submissions);
  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate self-contained HTML for printing
  const generatePrintableHtml = () => {
    const studentRows = students.map((s, idx) => {
      const sStats = calculateStudentStats(s.id, assignments, submissions);
      return `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
          <td style="padding: 6px 8px; text-align: center;">${idx + 1}</td>
          <td style="padding: 6px 8px; font-weight: bold; text-align: center;">${s.code}</td>
          <td style="padding: 6px 8px; font-weight: 600;">${s.fullName}</td>
          <td style="padding: 6px 8px; text-align: center;">Tổ ${s.group}</td>
          <td style="padding: 6px 8px; text-align: center; color: #16a34a; font-weight: bold;">${sStats.completedCount}/${sStats.totalAssigned}</td>
          <td style="padding: 6px 8px; text-align: center; color: ${sStats.incompleteCount > 0 ? '#dc2626' : '#64748b'}; font-weight: bold;">${sStats.incompleteCount}</td>
          <td style="padding: 6px 8px; text-align: center; color: #ea580c; font-weight: bold;">${sStats.lateCount}</td>
          <td style="padding: 6px 8px; text-align: center; font-weight: bold;">${sStats.averageGrade > 0 ? sStats.averageGrade : '—'}</td>
          <td style="padding: 6px 8px; font-size: 10px;">${sStats.completionRate >= 80 ? 'Hoàn thành tốt ⭐' : sStats.completionRate >= 50 ? 'Đạt yêu cầu' : 'Cần rèn luyện thêm'}</td>
        </tr>
      `;
    }).join('');

    const attentionList = stats.attentionStudents.map(s => 
      `<li><strong>${s.fullName}</strong> (${s.code} - Tổ ${s.group}) - SĐT PH: ${s.parentPhone}</li>`
    ).join('');

    const progressList = stats.progressStudents.map(s => 
      `<li><strong>${s.fullName}</strong> (${s.code} - Tổ ${s.group}) - Có tiến bộ vượt bậc, hoàn thành tốt nhiệm vụ</li>`
    ).join('');

    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>Báo cáo tình hình học tập - ${settings.className}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif, 'DejaVu Sans';
            color: #1e293b;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            background: #ffffff;
            font-size: 12px;
          }
          .header-table {
            width: 100%;
            margin-bottom: 20px;
          }
          .header-left {
            text-align: center;
            width: 45%;
            vertical-align: top;
          }
          .header-right {
            text-align: center;
            width: 55%;
            vertical-align: top;
          }
          .title-block {
            text-align: center;
            margin: 20px 0 15px;
          }
          .main-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
          }
          .sub-title {
            font-size: 12px;
            font-style: italic;
            margin-top: 4px;
            color: #475569;
          }
          .stats-grid {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          .stats-grid th, .stats-grid td {
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: center;
          }
          .stats-grid th {
            background-color: #f1f5f9;
            font-weight: bold;
          }
          .roster-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          .roster-table th, .roster-table td {
            border: 1px solid #cbd5e1;
            padding: 5px 6px;
          }
          .roster-table th {
            background-color: #e2e8f0;
            font-weight: bold;
            text-align: center;
            font-size: 11px;
          }
          .section-title {
            font-size: 13px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 5px;
            text-transform: uppercase;
            color: #0f172a;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 3px;
          }
          .footer-signatures {
            width: 100%;
            margin-top: 35px;
            page-break-inside: avoid;
          }
          .footer-signatures td {
            width: 50%;
            text-align: center;
            vertical-align: top;
          }
          .signature-space {
            height: 65px;
          }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td class="header-left">
              <strong>${settings.schoolName.toUpperCase()}</strong><br>
              <strong>LỚP: ${settings.className}</strong><br>
              <span>Năm học: ${settings.academicYear}</span>
            </td>
            <td class="header-right">
              <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
              <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
              <div style="width: 120px; border-bottom: 1px solid #334155; margin: 4px auto 0;"></div>
            </td>
          </tr>
        </table>

        <div class="title-block">
          <h1 class="main-title">BÁO CÁO TÌNH HÌNH HỌC TẬP VÀ HOÀN THÀNH NHIỆM VỤ</h1>
          <div class="sub-title">
            (Kỳ báo cáo: ${reportType === 'daily' ? 'Tổng hợp cuối ngày' : 'Tổng hợp cuối tuần'} • ${currentDate})
          </div>
          <div style="font-size: 11px; margin-top: 4px;">
            Giáo viên chủ nhiệm: <strong>${settings.teacherName}</strong>
          </div>
        </div>

        <div class="section-title">I. Tổng quan số liệu toàn lớp</div>
        <table class="stats-grid">
          <tr>
            <th>Sĩ số lớp</th>
            <th>Số bài đã giao</th>
            <th>Hoàn thành đúng hạn</th>
            <th>Chưa hoàn thành</th>
            <th>Nộp muộn</th>
            <th>Tỷ lệ hoàn thành</th>
          </tr>
          <tr>
            <td><strong>${students.length}</strong> học sinh</td>
            <td><strong>${stats.activeAssignmentsCount}</strong> bài</td>
            <td style="color: #16a34a; font-weight: bold;">${stats.completedCount}</td>
            <td style="color: #dc2626; font-weight: bold;">${stats.incompleteCount}</td>
            <td style="color: #ea580c; font-weight: bold;">${stats.lateCount}</td>
            <td style="color: #2563eb; font-weight: bold; font-size: 14px;">${stats.overallCompletionRate}%</td>
          </tr>
        </table>

        <div class="section-title">II. Danh sách chi tiết 30 học sinh</div>
        <table class="roster-table">
          <thead>
            <tr>
              <th style="width: 30px;">STT</th>
              <th style="width: 50px;">Mã HS</th>
              <th>Họ và tên học sinh</th>
              <th style="width: 45px;">Tổ</th>
              <th style="width: 75px;">Hoàn thành</th>
              <th style="width: 65px;">Chưa nộp</th>
              <th style="width: 60px;">Nộp muộn</th>
              <th style="width: 60px;">Điểm TB</th>
              <th>Đánh giá xếp loại</th>
            </tr>
          </thead>
          <tbody>
            ${studentRows}
          </tbody>
        </table>

        <div class="section-title">III. Đánh giá sư phạm & Phân loại học sinh</div>
        <div style="margin: 8px 0; font-size: 11.5px;">
          <p><strong>1. Học sinh có tiến bộ vượt bậc / Khen thưởng:</strong></p>
          <ul style="margin: 4px 0 10px 20px; padding: 0;">
            ${progressList || '<li>Cả lớp duy trì học tập đồng đều.</li>'}
          </ul>

          <p><strong>2. Học sinh cần quan tâm, nhắc nhở và phối hợp phụ huynh:</strong></p>
          <ul style="margin: 4px 0 10px 20px; padding: 0;">
            ${attentionList || '<li>Không có học sinh vi phạm hạn nộp bài.</li>'}
          </ul>

          <p><strong>3. Nhận xét tổng kết của Giáo viên & Trợ lý AI:</strong></p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px; font-style: italic;">
            ${(aiReportContent || 'Học sinh trong lớp có ý thức học tập tốt, phần lớn các em nộp bài đúng hẹn và trình bày sạch đẹp. Giáo viên tiếp tục đôn đốc nhóm học sinh còn chưa nộp để đảm bảo tiến độ chung.').replace(/\n/g, '<br>')}
          </div>
        </div>

        <table class="footer-signatures">
          <tr>
            <td>
              <strong>BAN GIÁM HIỆU NHÀ TRƯỜNG</strong><br>
              <em>(Ký và đóng dấu)</em>
              <div class="signature-space"></div>
            </td>
            <td>
              <em>Hà Nội, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</em><br>
              <strong>GIÁO VIÊN CHỦ NHIỆM</strong><br>
              <em>(Ký và ghi rõ họ tên)</em>
              <div class="signature-space"></div>
              <strong>${settings.teacherName}</strong>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  // Trigger real print execution via clean hidden iframe
  const handleExecutePrint = () => {
    const htmlContent = generatePrintableHtml();

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        // Remove iframe after print dialog closes
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 350);
    } else {
      // Fallback to window.print()
      window.print();
    }
  };

  // Open in independent new tab
  const handleOpenNewTab = () => {
    const htmlContent = generatePrintableHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Download HTML report
  const handleDownloadHtml = () => {
    const htmlContent = generatePrintableHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.download = `Bao_Cao_${settings.className}_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-5xl max-h-[95vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Action Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">Bản In Báo Cáo Học Tập Chuẩn Tiểu Học</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Khổ giấy A4
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {settings.schoolName} • Lớp {settings.className} • {currentDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Print Button */}
            <button
              id="btn-print-action"
              type="button"
              onClick={handleExecutePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all active:scale-95 ring-2 ring-indigo-400/40"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay / Xuất PDF</span>
            </button>

            {/* Open New Tab */}
            <button
              id="btn-open-tab-print"
              type="button"
              onClick={handleOpenNewTab}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              title="Mở sang tab mới để in độc lập"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mở tab in</span>
            </button>

            {/* Download HTML */}
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
              title="Lưu file báo cáo về máy"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tải về</span>
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body: Authentic Printed Document Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/70">
          
          <div 
            ref={printAreaRef}
            className="bg-white max-w-4xl mx-auto p-8 sm:p-12 shadow-xl rounded-2xl border border-slate-300 text-slate-900 font-serif leading-relaxed printable-card"
          >
            {/* Header: School & National Title */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6">
              <div className="text-center w-5/12 font-sans">
                <div className="font-extrabold text-xs sm:text-sm uppercase tracking-tight text-slate-800">
                  {settings.schoolName}
                </div>
                <div className="font-bold text-xs text-indigo-900 mt-0.5">
                  LỚP: {settings.className}
                </div>
                <div className="text-[11px] text-slate-500">
                  Năm học: {settings.academicYear}
                </div>
              </div>

              <div className="text-center w-6/12 font-sans">
                <div className="font-extrabold text-xs sm:text-sm uppercase text-slate-900">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="font-bold text-xs text-slate-700 mt-0.5">
                  Độc lập - Tự do - Hạnh phúc
                </div>
                <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-1" />
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-6">
              <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-slate-900 font-serif">
                BÁO CÁO TÌNH HÌNH HỌC TẬP & HOÀN THÀNH NHIỆM VỤ
              </h1>
              <p className="text-xs italic text-slate-600 mt-1 font-sans">
                (Kỳ báo cáo: {reportType === 'daily' ? 'Tổng hợp cuối ngày' : 'Tổng hợp cuối tuần'} • {currentDate})
              </p>
              <p className="text-xs text-slate-700 mt-1 font-sans">
                Giáo viên chủ nhiệm: <strong>{settings.teacherName}</strong> • Email: {settings.teacherEmail}
              </p>
            </div>

            {/* Section I: Stats */}
            <div className="mb-6 font-sans">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                I. TỔNG QUAN CHỈ SỐ LỚP HỌC
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Sĩ số</span>
                  <span className="font-extrabold text-slate-900 text-sm">{students.length} HS</span>
                </div>
                <div className="p-2 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Bài đang giao</span>
                  <span className="font-extrabold text-indigo-700 text-sm">{stats.activeAssignmentsCount}</span>
                </div>
                <div className="p-2 rounded-lg border border-emerald-200 bg-emerald-50">
                  <span className="text-[10px] text-emerald-700 block">Đã hoàn thành</span>
                  <span className="font-extrabold text-emerald-800 text-sm">{stats.completedCount}</span>
                </div>
                <div className="p-2 rounded-lg border border-rose-200 bg-rose-50">
                  <span className="text-[10px] text-rose-700 block">Chưa nộp</span>
                  <span className="font-extrabold text-rose-800 text-sm">{stats.incompleteCount}</span>
                </div>
                <div className="p-2 rounded-lg border border-orange-200 bg-orange-50">
                  <span className="text-[10px] text-orange-700 block">Nộp muộn</span>
                  <span className="font-extrabold text-orange-800 text-sm">{stats.lateCount}</span>
                </div>
                <div className="p-2 rounded-lg border border-indigo-200 bg-indigo-50">
                  <span className="text-[10px] text-indigo-700 block">Tỷ lệ đạt</span>
                  <span className="font-black text-indigo-900 text-sm">{stats.overallCompletionRate}%</span>
                </div>
              </div>
            </div>

            {/* Section II: 30 Students Roster Table */}
            <div className="mb-6 font-sans">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                II. KẾT QUẢ THEO DÕI CHI TIẾT 30 HỌC SINH
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="p-2 text-center w-8">STT</th>
                      <th className="p-2 text-center w-14">Mã HS</th>
                      <th className="p-2 min-w-[140px]">Họ và tên học sinh</th>
                      <th className="p-2 text-center w-12">Tổ</th>
                      <th className="p-2 text-center w-20">Hoàn thành</th>
                      <th className="p-2 text-center w-16">Chưa nộp</th>
                      <th className="p-2 text-center w-16">Nộp muộn</th>
                      <th className="p-2 text-center w-16">Điểm TB</th>
                      <th className="p-2 text-left min-w-[120px]">Xếp loại học tập</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {students.map((student, idx) => {
                      const sStats = calculateStudentStats(student.id, assignments, submissions);
                      return (
                        <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          <td className="p-2 text-center text-slate-500">{idx + 1}</td>
                          <td className="p-2 text-center font-bold text-slate-700">{student.code}</td>
                          <td className="p-2 font-bold text-slate-900">{student.fullName}</td>
                          <td className="p-2 text-center text-slate-600">Tổ {student.group}</td>
                          <td className="p-2 text-center font-bold text-emerald-700">
                            {sStats.completedCount}/{sStats.totalAssigned}
                          </td>
                          <td className="p-2 text-center font-bold text-rose-600">
                            {sStats.incompleteCount}
                          </td>
                          <td className="p-2 text-center font-bold text-orange-600">
                            {sStats.lateCount}
                          </td>
                          <td className="p-2 text-center font-bold text-slate-800">
                            {sStats.averageGrade > 0 ? sStats.averageGrade : '—'}
                          </td>
                          <td className="p-2 text-xs">
                            {sStats.completionRate >= 80 ? (
                              <span className="text-emerald-700 font-bold">Hoàn thành tốt ⭐</span>
                            ) : sStats.completionRate >= 50 ? (
                              <span className="text-indigo-700 font-medium">Đạt yêu cầu 🟢</span>
                            ) : (
                              <span className="text-rose-700 font-bold">Cần phụ đạo 🔴</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section III: Pedagogy & Comments */}
            <div className="mb-6 space-y-3 font-sans text-xs">
              <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                III. ĐÁNH GIÁ SƯ PHẠM & NHẬN XÉT CỦA GIÁO VIÊN
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="font-bold text-emerald-900 block mb-1">
                    🌟 Học sinh có tiến bộ vượt bậc / Khen thưởng:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-emerald-950 font-medium">
                    {stats.progressStudents.map(s => (
                      <li key={s.id}>{s.fullName} ({s.code} - Tổ {s.group})</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                  <span className="font-bold text-rose-900 block mb-1">
                    ⚠️ Học sinh cần quan tâm & phối hợp gia đình:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-rose-950 font-medium">
                    {stats.attentionStudents.map(s => (
                      <li key={s.id}>
                        {s.fullName} ({s.code} - SĐT PH: {s.parentPhone})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Teacher and AI Note */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">
                  Nhận xét chung của giáo viên chủ nhiệm & Trợ lý AI:
                </span>
                <p className="text-slate-700 italic leading-relaxed whitespace-pre-line">
                  {aiReportContent || 'Học sinh trong lớp có ý thức học tập tốt, phần lớn các em nộp bài đúng hẹn và trình bày sạch đẹp. Giáo viên tiếp tục đôn đốc nhóm học sinh còn chưa nộp để đảm bảo tiến độ chung.'}
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-4 flex justify-between items-start text-center font-sans text-xs">
              <div className="w-5/12">
                <div className="font-bold uppercase text-slate-900">BAN GIÁM HIỆU NHÀ TRƯỜNG</div>
                <div className="text-[11px] italic text-slate-500">(Ký duyệt và đóng dấu)</div>
                <div className="h-16" />
              </div>

              <div className="w-5/12">
                <div className="text-[11px] italic text-slate-600 mb-0.5">
                  Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </div>
                <div className="font-bold uppercase text-slate-900">GIÁO VIÊN CHỦ NHIỆM</div>
                <div className="text-[11px] italic text-slate-500">(Ký và ghi rõ họ tên)</div>
                <div className="h-16" />
                <div className="font-bold text-slate-900 text-sm">{settings.teacherName}</div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>💡 Thầy/cô có thể chọn máy in thực tế hoặc chọn "Save as PDF" trong hộp thoại in để lưu file PDF chất lượng cao.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors"
          >
            Đóng xem trước
          </button>
        </div>

      </div>
    </div>
  );
};
