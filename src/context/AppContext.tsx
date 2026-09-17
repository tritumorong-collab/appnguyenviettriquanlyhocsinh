import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  Assignment, 
  Submission, 
  ClassSettings, 
  SmartAlert, 
  ActiveTab 
} from '../types';
import { 
  initialClassSettings, 
  initialStudents, 
  initialAssignments, 
  generateInitialSubmissions 
} from '../data/initialData';
import { 
  generateSmartAlerts, 
  evaluateSubmissionStatus 
} from '../utils/alertEngine';

interface AppContextType {
  // Role & Session
  role: 'teacher' | 'student';
  setRole: (role: 'teacher' | 'student') => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentStudent: Student | undefined;

  // Active navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Data
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  settings: ClassSettings;
  alerts: SmartAlert[];

  // Mutations
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  importStudents: (newStudents: Student[], mode: 'replace' | 'merge') => void;

  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (assignment: Assignment) => void;
  deleteAssignment: (id: string) => void;

  submitAssignment: (
    assignmentId: string, 
    studentId: string, 
    data: {
      answerText: string;
      attachmentUrl?: string;
      attachmentName?: string;
      studentQuestion?: string;
    }
  ) => void;

  gradeSubmission: (
    submissionId: string, 
    data: {
      grade: number;
      assessmentRank: Submission['assessmentRank'];
      teacherComment: string;
    }
  ) => void;

  reassignTask: (assignmentId: string, studentId: string) => void;

  updateSettings: (newSettings: Partial<ClassSettings>) => void;
  markAlertRead: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  resetToInitialData: () => void;

  // Selected student for detail modal
  selectedStudentForDetail: Student | null;
  setSelectedStudentForDetail: (s: Student | null) => void;

  // Selected submission for grading modal
  selectedSubmissionForGrading: { assignment: Assignment; submission: Submission; student: Student } | null;
  setSelectedSubmissionForGrading: (item: { assignment: Assignment; submission: Submission; student: Student } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'qlhs_students_v1',
  ASSIGNMENTS: 'qlhs_assignments_v1',
  SUBMISSIONS: 'qlhs_submissions_v1',
  SETTINGS: 'qlhs_settings_v1',
  ROLE: 'qlhs_user_role_v1',
  CURRENT_STUDENT: 'qlhs_current_student_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : initialStudents;
    } catch {
      return initialStudents;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return saved ? JSON.parse(saved) : initialAssignments;
    } catch {
      return initialAssignments;
    }
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : generateInitialSubmissions();
    } catch {
      return generateInitialSubmissions();
    }
  });

  const [settings, setSettings] = useState<ClassSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialClassSettings;
    } catch {
      return initialClassSettings;
    }
  });

  const [role, setRole] = useState<'teacher' | 'student'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved === 'student' ? 'student' : 'teacher');
    } catch {
      return 'teacher';
    }
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
      return saved || 'HS01';
    } catch {
      return 'HS01';
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [selectedSubmissionForGrading, setSelectedSubmissionForGrading] = useState<{
    assignment: Assignment;
    submission: Submission;
    student: Student;
  } | null>(null);

  // Dynamic alerts
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);

  // Update dynamic alerts when data changes
  useEffect(() => {
    const generated = generateSmartAlerts(students, assignments, submissions);
    setAlerts(generated);
  }, [students, assignments, submissions]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Failed to save students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch (e) {
      console.warn('Failed to save assignments to localStorage', e);
    }
  }, [assignments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.warn('Failed to save submissions to localStorage', e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch (e) {
      console.warn('Failed to save role to localStorage', e);
    }
  }, [role]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, currentStudentId);
    } catch (e) {
      console.warn('Failed to save current student to localStorage', e);
    }
  }, [currentStudentId]);

  // Student mutations
  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setSubmissions(prev => prev.filter(s => s.studentId !== id));
  };

  const importStudents = (imported: Student[], mode: 'replace' | 'merge') => {
    let finalStudents: Student[] = [];
    if (mode === 'replace') {
      finalStudents = imported;
    } else {
      const existingMap = new Map<string, Student>();
      students.forEach(s => existingMap.set(s.code.toUpperCase(), s));
      imported.forEach(s => existingMap.set(s.code.toUpperCase(), s));
      finalStudents = Array.from(existingMap.values());
    }

    setStudents(finalStudents);

    if (finalStudents.length > 0 && !finalStudents.some(s => s.id === currentStudentId)) {
      setCurrentStudentId(finalStudents[0].id);
    }

    // Ensure assignments have submissions for new students if targetType === 'all'
    setSubmissions(prev => {
      const existingSubKeys = new Set(prev.map(sub => `${sub.assignmentId}-${sub.studentId}`));
      const additionalSubs: Submission[] = [];

      assignments.forEach(a => {
        if (a.targetType === 'all') {
          finalStudents.forEach(st => {
            const key = `${a.id}-${st.id}`;
            if (!existingSubKeys.has(key)) {
              additionalSubs.push({
                id: `SUB-${a.id}-${st.id}-${Date.now()}`,
                assignmentId: a.id,
                studentId: st.id,
                submittedAt: null,
                status: 'assigned',
                answerText: '',
                isCompletedMarked: false,
              });
              existingSubKeys.add(key);
            }
          });
        }
      });

      if (mode === 'replace') {
        const validStudentIds = new Set(finalStudents.map(s => s.id));
        const filteredPrev = prev.filter(s => validStudentIds.has(s.studentId));
        return [...filteredPrev, ...additionalSubs];
      }

      return [...prev, ...additionalSubs];
    });
  };

  // Assignment mutations
  const addAssignment = (assignment: Assignment) => {
    setAssignments(prev => [assignment, ...prev]);
    // Create baseline submission records for targets
    const targets = assignment.targetType === 'all'
      ? students
      : students.filter(s => assignment.targetStudentIds.includes(s.id));

    const newSubs: Submission[] = targets.map(s => ({
      id: `SUB-${assignment.id}-${s.id}-${Date.now()}`,
      assignmentId: assignment.id,
      studentId: s.id,
      submittedAt: null,
      status: 'assigned',
      answerText: '',
      isCompletedMarked: false,
    }));

    setSubmissions(prev => [...newSubs, ...prev]);
  };

  const updateAssignment = (updated: Assignment) => {
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    setSubmissions(prev => prev.filter(s => s.assignmentId !== id));
  };

  // Student submits assignment
  const submitAssignment = (
    assignmentId: string,
    studentId: string,
    data: {
      answerText: string;
      attachmentUrl?: string;
      attachmentName?: string;
      studentQuestion?: string;
    }
  ) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const now = new Date();
    const isLate = now.getTime() > new Date(assignment.dueDate).getTime();
    const newStatus = isLate ? 'submitted_late' : 'completed_ontime';

    setSubmissions(prev => {
      const index = prev.findIndex(s => s.assignmentId === assignmentId && s.studentId === studentId);
      const updatedSub: Submission = {
        id: index >= 0 ? prev[index].id : `SUB-${assignmentId}-${studentId}-${Date.now()}`,
        assignmentId,
        studentId,
        submittedAt: now.toISOString(),
        status: newStatus,
        answerText: data.answerText,
        attachmentUrl: data.attachmentUrl,
        attachmentName: data.attachmentName,
        attachmentType: data.attachmentUrl ? 'image' : undefined,
        isCompletedMarked: true,
        studentQuestion: data.studentQuestion,
        // Reset grade for new review if re-submitted
        grade: undefined,
        assessmentRank: undefined,
        teacherComment: undefined,
        gradedAt: undefined,
      };

      if (index >= 0) {
        const copy = [...prev];
        copy[index] = updatedSub;
        return copy;
      } else {
        return [updatedSub, ...prev];
      }
    });
  };

  // Teacher grades submission
  const gradeSubmission = (
    submissionId: string,
    data: {
      grade: number;
      assessmentRank: Submission['assessmentRank'];
      teacherComment: string;
    }
  ) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        let newStatus = s.status;
        if (data.assessmentRank === 'Hoàn thành tốt' || data.grade >= 9) {
          newStatus = 'excellent';
        } else if (data.assessmentRank === 'Yêu cầu làm lại') {
          newStatus = 'needs_revision';
        } else {
          newStatus = s.submittedAt && new Date(s.submittedAt).getTime() > new Date().getTime() ? 'submitted_late' : 'completed_ontime';
        }

        return {
          ...s,
          grade: data.grade,
          assessmentRank: data.assessmentRank,
          teacherComment: data.teacherComment,
          gradedAt: new Date().toISOString(),
          status: newStatus,
        };
      }
      return s;
    }));
  };

  // Re-assign task to a student requiring rework
  const reassignTask = (assignmentId: string, studentId: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.assignmentId === assignmentId && s.studentId === studentId) {
        return {
          ...s,
          status: 'needs_revision',
          assessmentRank: 'Yêu cầu làm lại',
          reassignedCount: (s.reassignedCount || 0) + 1,
        };
      }
      return s;
    }));
  };

  const updateSettings = (newSettings: Partial<ClassSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const markAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const resetToInitialData = () => {
    setStudents(initialStudents);
    setAssignments(initialAssignments);
    setSubmissions(generateInitialSubmissions());
    setSettings(initialClassSettings);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        activeTab,
        setActiveTab,
        students,
        assignments,
        submissions,
        settings,
        alerts,
        addStudent,
        updateStudent,
        deleteStudent,
        importStudents,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        gradeSubmission,
        reassignTask,
        updateSettings,
        markAlertRead,
        dismissAlert,
        resetToInitialData,
        selectedStudentForDetail,
        setSelectedStudentForDetail,
        selectedSubmissionForGrading,
        setSelectedSubmissionForGrading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
