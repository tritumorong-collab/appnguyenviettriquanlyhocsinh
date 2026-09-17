import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Database, 
  Save, 
  RotateCcw, 
  Download, 
  ShieldCheck, 
  Check, 
  School, 
  Mail, 
  Key, 
  HardDrive,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToInitialData, students, assignments, submissions } = useApp();

  const [className, setClassName] = useState(settings.className);
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [teacherName, setTeacherName] = useState(settings.teacherName);
  const [teacherEmail, setTeacherEmail] = useState(settings.teacherEmail);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);

  // Firebase Config
  const [apiKey, setApiKey] = useState(settings.firebaseConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(settings.firebaseConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(settings.firebaseConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(settings.firebaseConfig?.storageBucket || '');
  const [appId, setAppId] = useState(settings.firebaseConfig?.appId || '');

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      className,
      schoolName,
      teacherName,
      teacherEmail,
      academicYear,
      firebaseConfig: {
        apiKey,
        projectId,
        authDomain,
        storageBucket,
        appId,
      },
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  // Download backup JSON
  const handleExportBackupJson = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      settings: { ...settings, className, teacherName, teacherEmail },
      students,
      assignments,
      submissions,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Sao_Luu_Lop_${className}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (window.confirm('Thầy/cô có chắc muốn đặt lại toàn bộ dữ liệu mẫu 30 học sinh ban đầu không?')) {
      resetToInitialData();
      alert('Đã khôi phục dữ liệu ban đầu thành công!');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <span>⚙️ Thiết lập hệ thống</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            CÀI ĐẶT LỚP HỌC & CẤU HÌNH FIREBASE
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tùy chỉnh thông tin lớp {className}, thiết lập email giáo viên và thông số kết nối đám mây Firebase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportBackupJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Sao lưu JSON</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Khôi phục mẫu 30 HS</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu các thiết lập thành công! Dữ liệu được bảo toàn tự động.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Section 1: Class and Teacher Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <School className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Thông tin lớp học & Giáo viên chủ nhiệm
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên trường tiểu học</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên lớp</label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ tên Giáo viên</label>
              <input
                type="text"
                required
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email nhận báo cáo tự động</label>
              <input
                type="email"
                required
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                placeholder="anthonydong.genz@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">Báo cáo cuối ngày/tuần sẽ gửi tự động tới địa chỉ này.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Năm học</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Firebase Firestore & Storage Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Cấu hình Firebase (Authentication, Firestore & Storage)
                </h3>
                <p className="text-xs text-slate-500">
                  Đồng bộ dữ liệu thời gian thực trên mọi thiết bị máy tính và điện thoại.
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sẵn sàng kết nối</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Firebase API Key</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Firebase Project ID</label>
              <input
                type="text"
                placeholder="tro-ly-hoc-tap-3a"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Auth Domain</label>
              <input
                type="text"
                placeholder="tro-ly-hoc-tap-3a.firebaseapp.com"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage Bucket</label>
              <input
                type="text"
                placeholder="tro-ly-hoc-tap-3a.appspot.com"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Firebase App ID</label>
              <input
                type="text"
                placeholder="1:1234567890:web:abcdef123456"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-amber-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Khi chưa nhập thông số Firebase cá nhân, hệ thống vẫn hoạt động độc lập và lưu trữ dữ liệu an toàn ngay trên trình duyệt (Local Storage) để thầy cô trải nghiệm ngay lập tức.
            </p>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu tất cả thiết lập</span>
          </button>
        </div>

      </form>

    </div>
  );
};
