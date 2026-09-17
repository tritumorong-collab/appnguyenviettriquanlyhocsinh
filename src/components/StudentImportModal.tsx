import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  FileText,
  RefreshCw,
  Info
} from 'lucide-react';
import { parseStudentCSV, downloadStudentTemplate } from '../utils/studentImportExport';

interface StudentImportModalProps {
  onClose: () => void;
  onImport: (newStudents: Student[], mode: 'replace' | 'merge') => void;
  currentStudentsCount: number;
}

export const StudentImportModal: React.FC<StudentImportModalProps> = ({
  onClose,
  onImport,
  currentStudentsCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileProcess = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    setErrors([]);
    setWarnings([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const result = parseStudentCSV(text);
        if (result.success) {
          setParsedStudents(result.students);
          setWarnings(result.warnings);
          setErrors([]);
        } else {
          setParsedStudents([]);
          setErrors(result.errors);
        }
      } catch (err) {
        setErrors(['Lỗi khi đọc file. Vui lòng kiểm tra lại định dạng file CSV/Excel UTF-8.']);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setErrors(['Không thể đọc file từ thiết bị của bạn.']);
      setIsProcessing(false);
    };

    reader.readAsText(file, 'utf-8');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (parsedStudents.length === 0) return;
    onImport(parsedStudents, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <UploadCloud className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Tải Lên Danh Sách Học Sinh</h3>
              <p className="text-xs text-indigo-200">
                Hỗ trợ định dạng CSV, Excel UTF-8 với đầy đủ thông tin học sinh tiểu học
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          
          {/* Action Row: Download template helper */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block">Thầy/cô chưa có mẫu danh sách?</span>
                <span className="text-amber-700">
                  Tải file mẫu Excel chuẩn gồm các cột: Mã HS, Họ và tên, Giới tính, Ngày sinh, Tổ, Phụ huynh, SĐT...
                </span>
              </div>
            </div>
            <button
              id="btn-modal-download-template"
              type="button"
              onClick={downloadStudentTemplate}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-xs shrink-0 self-start sm:self-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file mẫu Excel (.csv)</span>
            </button>
          </div>

          {/* Upload Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragActive 
                ? 'border-indigo-600 bg-indigo-50/60 scale-[1.01]' 
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleInputChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <p className="font-extrabold text-sm sm:text-base text-slate-800">
                {fileName ? `File đã chọn: ${fileName}` : 'Kéo thả file danh sách vào đây hoặc bấm để duyệt file'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Chấp nhận file định dạng .csv hoặc .txt (chuẩn mã UTF-8 tiếng Việt)
              </p>
            </div>
            {fileName && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 font-bold hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Chọn file khác
              </button>
            )}
          </div>

          {/* Error Message */}
          {errors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Không thể xử lý dữ liệu:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700 pl-1">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings Message */}
          {warnings.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-0.5 text-xs">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Lưu ý khi đọc dữ liệu ({warnings.length} dòng):</span>
              </div>
              <ul className="list-disc list-inside text-amber-700 max-h-20 overflow-y-auto pl-1">
                {warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedStudents.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-extrabold text-sm text-slate-900">
                    Đã đọc thành công {parsedStudents.length} học sinh
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  (Hiển thị trước 5 học sinh đầu tiên)
                </span>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Mã HS</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Phái</th>
                      <th className="py-2.5 px-3">Ngày sinh</th>
                      <th className="py-2.5 px-3">Tổ</th>
                      <th className="py-2.5 px-3">Phụ huynh</th>
                      <th className="py-2.5 px-3">SĐT Phụ huynh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {parsedStudents.slice(0, 5).map((s, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-extrabold text-indigo-700">{s.code}</td>
                        <td className="py-2 px-3 font-bold">{s.fullName}</td>
                        <td className="py-2 px-3">{s.gender}</td>
                        <td className="py-2 px-3 text-slate-600">{s.dob}</td>
                        <td className="py-2 px-3">Tổ {s.group}</td>
                        <td className="py-2 px-3 text-slate-600">{s.parentName}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono">{s.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Import Mode Options */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="font-bold text-xs text-slate-700 block">
                  Tùy chọn nhập danh sách:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label 
                    onClick={() => setImportMode('replace')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                      importMode === 'replace'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <span className="text-xs font-bold block">Ghi đè danh sách lớp</span>
                      <span className="text-[11px] font-normal text-slate-500 block mt-0.5">
                        Thay thế {currentStudentsCount} học sinh hiện tại bằng {parsedStudents.length} học sinh trong file.
                      </span>
                    </div>
                  </label>

                  <label 
                    onClick={() => setImportMode('merge')}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                      importMode === 'merge'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <span className="text-xs font-bold block">Cập nhật & Thêm mới</span>
                      <span className="text-[11px] font-normal text-slate-500 block mt-0.5">
                        Cập nhật học sinh trùng mã và bổ sung các học sinh mới vào danh sách.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all"
          >
            Hủy bỏ
          </button>

          <button
            id="btn-confirm-import-students"
            type="button"
            disabled={parsedStudents.length === 0 || isProcessing}
            onClick={handleConfirmImport}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
              parsedStudents.length > 0 && !isProcessing
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {parsedStudents.length > 0 
                ? `Nhập ${parsedStudents.length} học sinh vào hệ thống` 
                : 'Vui lòng chọn file hợp lệ'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
