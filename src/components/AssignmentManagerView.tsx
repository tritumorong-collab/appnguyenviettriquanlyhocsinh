import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Assignment, Subject, Difficulty } from '../types';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  Paperclip, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Link as LinkIcon, 
  FileText, 
  Image, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';
import { STATUS_CONFIG, evaluateSubmissionStatus } from '../utils/alertEngine';

export const AssignmentManagerView: React.FC = () => {
  const { 
    assignments, 
    students, 
    submissions, 
    addAssignment, 
    updateAssignment, 
    deleteAssignment,
    setSelectedSubmissionForGrading,
    reassignTask,
    settings 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignments[0]?.id || null);

  // Form states
  const [subject, setSubject] = useState<Subject>('Toán');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'pdf' | 'link'>('link');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(20, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [difficulty, setDifficulty] = useState<Difficulty>('Trung bình');

  const handleOpenCreate = () => {
    setTitle('');
    setDescription('');
    setAttachmentUrl('');
    setAttachmentName('');
    setTargetType('all');
    setSelectedStudentIds([]);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(20, 0, 0, 0);
    setDueDate(d.toISOString().slice(0, 16));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAssignment: Assignment = {
      id: `ASN-${Date.now()}`,
      title: title.trim(),
      subject,
      description: description.trim(),
      attachmentUrl: attachmentUrl.trim() || undefined,
      attachmentType: attachmentUrl.trim() ? attachmentType : undefined,
      attachmentName: attachmentName.trim() || (attachmentUrl ? 'Tài liệu bài tập' : undefined),
      targetType,
      targetStudentIds: targetType === 'all' ? students.map(s => s.id) : selectedStudentIds,
      assignedDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(dueDate).toISOString(),
      difficulty,
      status: 'active',
    };

    addAssignment(newAssignment);
    setSelectedAssignmentId(newAssignment.id);
    setIsModalOpen(false);
  };

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId) || assignments[0];

  const toggleStudentSelection = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <span>📝 Nhiệm vụ học tập</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            QUẢN LÝ & GIAO BÀI TẬP ({assignments.length} BÀI)
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tạo bài tập kèm file/ảnh/link, đặt hạn nộp, chọn học sinh và theo dõi tiến độ nộp bài.
          </p>
        </div>

        <button
          id="btn-create-assignment"
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo bài tập mới</span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: List of assignments (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Danh sách bài tập ({assignments.length})
            </span>
            <span className="text-xs text-indigo-600 font-bold">
              {assignments.filter(a => a.status === 'active').length} đang hoạt động
            </span>
          </div>

          <div className="space-y-2.5">
            {assignments.map(assignment => {
              const targetCount = assignment.targetType === 'all' ? students.length : assignment.targetStudentIds.length;
              const completedCount = submissions.filter(
                s => s.assignmentId === assignment.id && (s.status === 'completed_ontime' || s.status === 'excellent' || s.status === 'submitted_late')
              ).length;
              const isSelected = assignment.id === selectedAssignment?.id;

              return (
                <div
                  key={assignment.id}
                  onClick={() => setSelectedAssignmentId(assignment.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-50'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 text-indigo-800">
                        {assignment.subject}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        assignment.difficulty === 'Khó' ? 'bg-rose-100 text-rose-800' : assignment.difficulty === 'Dễ' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {assignment.difficulty}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-500">
                      {completedCount}/{targetCount} đã nộp
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-2 line-clamp-1">
                    {assignment.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {assignment.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Hạn: {new Date(assignment.dueDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                      Xem lớp &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Selected Assignment Details & Student Roster (7 cols) */}
        <div className="lg:col-span-7">
          {selectedAssignment ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-indigo-100 text-indigo-800">
                      Môn: {selectedAssignment.subject}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900">
                      Mức độ: {selectedAssignment.difficulty}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                      Đối tượng: {selectedAssignment.targetType === 'all' ? 'Cả lớp (30 HS)' : `${selectedAssignment.targetStudentIds.length} em`}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {selectedAssignment.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Xóa bài tập "${selectedAssignment.title}"?`)) {
                      deleteAssignment(selectedAssignment.id);
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors self-start"
                  title="Xóa bài tập"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Description & Attachments */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Nội dung yêu cầu bài tập:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                  {selectedAssignment.description}
                </p>

                {selectedAssignment.attachmentUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedAssignment.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{selectedAssignment.attachmentName || 'Tài liệu đính kèm (Xem)'}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Progress Summary */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-slate-900">
                    Tình trạng nộp bài của học sinh
                  </h3>
                  <span className="text-xs text-slate-500">
                    Hạn nộp: {new Date(selectedAssignment.dueDate).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {students
                    .filter(s => selectedAssignment.targetType === 'all' || selectedAssignment.targetStudentIds.includes(s.id))
                    .map(student => {
                      const sub = submissions.find(s => s.assignmentId === selectedAssignment.id && s.studentId === student.id);
                      const status = evaluateSubmissionStatus(selectedAssignment, sub);
                      const cfg = STATUS_CONFIG[status];

                      return (
                        <div
                          key={student.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                              {student.code}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs sm:text-sm text-slate-900">
                                  {student.fullName}
                                </span>
                                <span className="text-[10px] text-slate-400">({student.code} • Tổ {student.group})</span>
                              </div>
                              {sub?.submittedAt && (
                                <p className="text-[11px] text-slate-500">
                                  Nộp: {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ({new Date(sub.submittedAt).toLocaleDateString('vi-VN')})
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${cfg.badgeBg} ${cfg.textColor} ${cfg.border}`}>
                              <span>{cfg.icon}</span>
                              <span>{sub?.grade !== undefined ? `${sub.grade}đ` : cfg.label}</span>
                            </span>

                            {sub && (
                              <button
                                type="button"
                                onClick={() => setSelectedSubmissionForGrading({
                                  assignment: selectedAssignment,
                                  submission: sub,
                                  student,
                                })}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
                              >
                                Chấm
                              </button>
                            )}

                            {/* Reassign button as requested */}
                            {(status === 'needs_revision' || status === 'incomplete') && (
                              <button
                                type="button"
                                onClick={() => reassignTask(selectedAssignment.id, student.id)}
                                className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1"
                                title="Giao lại bài cho học sinh làm lại"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span className="hidden sm:inline">Giao lại</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
              Chọn bài tập từ danh sách bên trái để xem chi tiết.
            </div>
          )}
        </div>

      </div>

      {/* Create Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-indigo-50/50">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Tạo bài tập mới cho học sinh
                </h3>
                <p className="text-xs text-slate-500">Giáo viên nhập thông tin, hạn nộp và chọn học sinh nhận bài</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Môn học</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Toán">Toán</option>
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Tự nhiên & Xã hội">Tự nhiên & Xã hội</option>
                    <option value="Mỹ thuật">Mỹ thuật</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Đạo đức">Đạo đức</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức độ bài tập</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-semibold"
                  >
                    <option value="Dễ">Dễ (Dành cho củng cố kiến thức)</option>
                    <option value="Trung bình">Trung bình (Chuẩn kiến thức)</option>
                    <option value="Khó">Khó (Vận dụng & Nâng cao)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bài tập</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn tập phép nhân trong phạm vi 1000 - Bài 1, 2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung đề bài / Hướng dẫn</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung bài tập hoặc yêu cầu học sinh làm bài tập số mấy trong sách giáo khoa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại đính kèm</label>
                  <select
                    value={attachmentType}
                    onChange={(e) => setAttachmentType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="link">Đường link (Google Drive / Trang web)</option>
                    <option value="image">Hình ảnh đề bài</option>
                    <option value="pdf">Tài liệu PDF</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hạn nộp (Ngày và Giờ)</label>
                  <input
                    type="datetime-local"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn file đính kèm (URL)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Target Selection: All or Specific */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Đối tượng nhận bài</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="targetType"
                      checked={targetType === 'all'}
                      onChange={() => setTargetType('all')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Toàn lớp (30 học sinh)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="targetType"
                      checked={targetType === 'specific'}
                      onChange={() => setTargetType('specific')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">Chọn một số học sinh</span>
                  </label>
                </div>

                {targetType === 'specific' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-40 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {students.map(s => (
                      <label key={s.id} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(s.id)}
                          onChange={() => toggleStudentSelection(s.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="truncate">{s.code} - {s.fullName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Giao bài tập ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
