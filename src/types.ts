export type Subject = 
  | 'Toán' 
  | 'Tiếng Việt' 
  | 'Tiếng Anh' 
  | 'Tự nhiên & Xã hội' 
  | 'Tin học' 
  | 'Mỹ thuật' 
  | 'Đạo đức';

export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';

export type AssessmentRank = 
  | 'Hoàn thành tốt' 
  | 'Hoàn thành' 
  | 'Chưa hoàn thành' 
  | 'Yêu cầu làm lại';

export type TaskVisualStatus = 
  | 'completed_ontime' // 🟢 Đã hoàn thành đúng hạn
  | 'needs_revision'  // 🟡 Đã nộp nhưng cần sửa
  | 'incomplete'      // 🔴 Chưa hoàn thành (quá hạn hoặc chưa làm)
  | 'submitted_late'  // 🟠 Nộp muộn
  | 'assigned'        // 🔵 Đã giao (đang trong hạn)
  | 'excellent';      // ⭐ Hoàn thành tốt

export interface Attachment {
  type: 'image' | 'pdf' | 'link';
  name: string;
  url: string;
}

export interface Student {
  id: string;             // e.g. "HS01"
  code: string;           // e.g. "HS01"
  fullName: string;       // e.g. "Nguyễn Minh Anh"
  gender: 'Nam' | 'Nữ';
  dob: string;            // "2016-03-15"
  group: number;          // Tổ 1, Tổ 2, Tổ 3, Tổ 4
  parentPhone: string;    // "0912 345 678"
  parentName: string;     // "Bác Nguyễn Văn Thành"
  avatar?: string;        // Optional avatar URL
  notes?: string;
  strengths?: string[];
  areasToImprove?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: Subject;
  content?: string;
  description?: string;
  attachments?: Attachment[];
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf' | 'link';
  attachmentName?: string;
  assignedDate: string;   // ISO String (e.g. 2026-09-12T08:00:00Z)
  dueDate: string;        // ISO String (e.g. 2026-09-15T20:00:00Z)
  difficulty: Difficulty;
  targetType: 'all' | 'selected' | 'specific';
  targetStudentIds: string[]; // student IDs
  status: 'active' | 'archived';
  createdAt?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string | null;     // ISO timestamp when submitted
  status: TaskVisualStatus;
  answerText: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'file';
  isCompletedMarked: boolean;
  studentQuestion?: string;      // Câu hỏi/thắc mắc gửi thầy cô
  grade?: number;                // 0 - 10
  assessmentRank?: AssessmentRank;
  teacherComment?: string;
  gradedAt?: string;
  reassignedCount?: number;
}

export type AlertType = 
  | 'new_submission'     // 1. Học sinh vừa nộp bài
  | 'overdue'            // 2. Hết hạn nhưng học sinh chưa nộp
  | 'low_performance'    // 3. Học sinh có kết quả thấp liên tiếp hoặc chưa hoàn thành nhiều bài
  | 'progress'           // 4. Học sinh có tiến bộ rõ rệt
  | 'daily_report'       // Báo cáo tổng hợp cuối ngày
  | 'weekly_report';     // Báo cáo tổng hợp cuối tuần

export interface SmartAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  studentId?: string;
  studentName?: string;
  assignmentId?: string;
  assignmentTitle?: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  actionLabel?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  isConfigured: boolean;
}

export interface ClassSettings {
  className: string;         // e.g. "Lớp 3A"
  schoolName: string;        // e.g. "Trường Tiểu học Chu Văn An"
  teacherName: string;       // e.g. "Cô Hoàng Mai Lan"
  teacherEmail: string;      // e.g. "anthonydong.genz@gmail.com"
  teacherPhone: string;      // e.g. "0903 123 456"
  academicYear: string;      // e.g. "2025 - 2026"
  autoEmailAlerts: boolean;
  autoDailyReport: boolean;
  firebaseConfig: FirebaseConfig;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'students' 
  | 'assignments' 
  | 'grading' 
  | 'reports' 
  | 'settings';

export type StudentFilterTab = 
  | 'today' 
  | 'expiring' 
  | 'completed' 
  | 'rework';
