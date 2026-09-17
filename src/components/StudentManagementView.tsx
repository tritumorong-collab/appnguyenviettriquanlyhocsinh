import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  PhoneCall, 
  CheckCircle2, 
  Star, 
  AlertCircle, 
  TrendingUp, 
  Filter,
  ArrowUpDown,
  X,
  UploadCloud,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { calculateStudentStats } from '../utils/alertEngine';
import { downloadStudentTemplate, downloadStudentList } from '../utils/studentImportExport';
import { StudentImportModal } from './StudentImportModal';

export const StudentManagementView: React.FC = () => {
  const { 
    students, 
    assignments, 
    submissions, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    importStudents,
    setSelectedStudentForDetail,
    settings 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'code' | 'name' | 'grade' | 'completion'>('code');

  // Modal for Import & Template & Export
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Modal for Add / Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    dob: '2016-01-01',
    group: 1,
    parentName: '',
    parentPhone: '',
    avatar: '',
    notes: '',
    strengths: '',
    areasToImprove: '',
  });

  // Filter & Sort
  const filteredStudents = useMemo(() => {
    let list = students.filter(student => {
      const matchSearch = 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.code.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (selectedGroup !== 'all' && student.group !== selectedGroup) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.fullName.split(' ').pop() || '';
        const nameB = b.fullName.split(' ').pop() || '';
        return nameA.localeCompare(nameB, 'vi');
      }
      if (sortBy === 'grade') {
        const statsA = calculateStudentStats(a.id, assignments, submissions);
        const statsB = calculateStudentStats(b.id, assignments, submissions);
        return statsB.averageGrade - statsA.averageGrade;
      }
      if (sortBy === 'completion') {
        const statsA = calculateStudentStats(a.id, assignments, submissions);
        const statsB = calculateStudentStats(b.id, assignments, submissions);
        return statsB.completionRate - statsA.completionRate;
      }
      // default: code
      return a.code.localeCompare(b.code);
    });

    return list;
  }, [students, searchQuery, selectedGroup, sortBy, assignments, submissions]);

  const handleOpenAdd = () => {
    const nextNum = students.length + 1;
    const nextCode = `HS${nextNum < 10 ? '0' + nextNum : nextNum}`;
    setEditingStudent(null);
    setFormData({
      code: nextCode,
      fullName: '',
      gender: 'Nam',
      dob: '2016-05-15',
      group: 1,
      parentName: '',
      parentPhone: '0912 345 6' + (nextNum < 10 ? '0' + nextNum : nextNum),
      avatar: `https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80`,
      notes: 'Học sinh mới tiếp nhận vào lớp.',
      strengths: 'Chăm chỉ, lễ phép',
      areasToImprove: 'Làm quen với nề nếp lớp học',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: Student, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStudent(student);
    setFormData({
      code: student.code,
      fullName: student.fullName,
      gender: student.gender,
      dob: student.dob,
      group: student.group,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      avatar: student.avatar,
      notes: student.notes || '',
      strengths: (student.strengths || []).join(', '),
      areasToImprove: (student.areasToImprove || []).join(', '),
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Thầy/cô có chắc muốn xóa học sinh "${name}" (${id}) khỏi danh sách lớp không?`)) {
      deleteStudent(id);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const strengthsArray = formData.strengths.split(',').map(s => s.trim()).filter(Boolean);
    const areasArray = formData.areasToImprove.split(',').map(s => s.trim()).filter(Boolean);

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        code: formData.code,
        fullName: formData.fullName,
        gender: formData.gender,
        dob: formData.dob,
        group: Number(formData.group),
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        avatar: formData.avatar,
        notes: formData.notes,
        strengths: strengthsArray,
        areasToImprove: areasArray,
      });
    } else {
      const newId = formData.code || `HS${Date.now()}`;
      addStudent({
        id: newId,
        code: formData.code,
        fullName: formData.fullName,
        gender: formData.gender,
        dob: formData.dob,
        group: Number(formData.group),
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        avatar: formData.avatar,
        notes: formData.notes,
        strengths: strengthsArray,
        areasToImprove: areasArray,
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <span>👥 Quản lý sĩ số lớp học</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            HỒ SƠ 30 HỌC SINH {settings.className}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý thông tin học sinh, lịch sử làm bài, điểm mạnh, nội dung cần cải thiện và liên hệ phụ huynh.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="btn-download-student-template"
            type="button"
            onClick={downloadStudentTemplate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs"
            title="Tải về file mẫu Excel/CSV chuẩn để giáo viên điền thông tin"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-700" />
            <span>Tải file mẫu</span>
          </button>

          <button
            id="btn-upload-student-list"
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs"
            title="Tải lên danh sách học sinh từ file Excel hoặc CSV"
          >
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Tải danh sách lên</span>
          </button>

          <button
            id="btn-download-student-list"
            type="button"
            onClick={() => downloadStudentList(students, settings.className)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs"
            title="Tải xuống toàn bộ danh sách học sinh hiện tại thành file Excel (.csv)"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Tải danh sách xuống</span>
          </button>

          <button
            id="btn-add-student"
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Notification when list is imported successfully */}
      {importNotification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold text-xs sm:text-sm">{importNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setImportNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs p-1 rounded-lg hover:bg-emerald-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Toolbar: Search, Group filter, Sorting */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-students-search"
              type="text"
              placeholder="Tìm theo tên hoặc mã HS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedGroup === 'all' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({students.length})
            </button>
            {[1, 2, 3, 4].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGroup(g)}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  selectedGroup === g ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tổ {g}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="select-students-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-700 focus:bg-white focus:outline-hidden"
            >
              <option value="code">Sắp xếp theo Mã HS (HS01...)</option>
              <option value="name">Sắp xếp theo Tên (A - Z)</option>
              <option value="grade">Điểm trung bình (Cao - Thấp)</option>
              <option value="completion">Tỷ lệ hoàn thành (%)</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Đang hiển thị <span className="font-bold text-indigo-600">{filteredStudents.length}</span> / {students.length} học sinh
        </div>
      </div>

      {/* Grid of 30 Students */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => {
          const sStats = calculateStudentStats(student.id, assignments, submissions);

          return (
            <div
              key={student.id}
              onClick={() => setSelectedStudentForDetail(student)}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-200 transition-colors">
                      {student.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                          {student.code}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          Tổ {student.group}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5">
                        {student.fullName}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Sinh: {new Date(student.dob).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(student, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Sửa thông tin"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(student.id, student.fullName, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa học sinh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Performance overview tags */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center my-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Hoàn thành</span>
                    <span className="font-extrabold text-emerald-700">
                      {sStats.completedCount}/{sStats.totalAssigned}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Chưa nộp</span>
                    <span className={`font-extrabold ${sStats.incompleteCount > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                      {sStats.incompleteCount} bài
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Điểm TB</span>
                    <span className="font-extrabold text-indigo-700">
                      {sStats.averageGrade > 0 ? sStats.averageGrade : '—'}
                    </span>
                  </div>
                </div>

                {/* Parent Contact */}
                <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                  <span className="truncate max-w-[140px] text-slate-500">
                    PH: {student.parentName}
                  </span>
                  <a
                    href={`tel:${student.parentPhone.replace(/\s+/g, '')}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold text-xs"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{student.parentPhone}</span>
                  </a>
                </div>
              </div>

              {/* Bottom tag: View progress button */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 italic text-[11px] line-clamp-1">
                  {student.notes || 'Chăm chỉ, ngoan ngoãn.'}
                </span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                  Xem chi tiết &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Student Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingStudent ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới vào lớp'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 mt-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã học sinh</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổ / Nhóm</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>Tổ 1</option>
                    <option value={2}>Tổ 2</option>
                    <option value={3}>Tổ 3</option>
                    <option value={4}>Tổ 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ tên Phụ huynh</label>
                  <input
                    type="text"
                    placeholder="Bác Nguyễn Văn A"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại Phụ huynh</label>
                  <input
                    type="text"
                    required
                    placeholder="0912 345 678"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đặc điểm / Ghi chú sư phạm</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ghi chú về tính cách, ý thức học tập..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-md"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import danh sách học sinh từ file */}
      {isImportModalOpen && (
        <StudentImportModal
          currentStudentsCount={students.length}
          onClose={() => setIsImportModalOpen(false)}
          onImport={(importedList, mode) => {
            importStudents(importedList, mode);
            setImportNotification(
              mode === 'replace'
                ? `Đã cập nhật lại toàn bộ danh sách lớp: ${importedList.length} học sinh.`
                : `Đã nhập và cập nhật thành công ${importedList.length} học sinh vào lớp học.`
            );
          }}
        />
      )}

    </div>
  );
};
