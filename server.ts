import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini SDK with telemetry header as required by skill
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI suggested comment for primary school student
app.post("/api/ai/suggest-comment", async (req, res) => {
  try {
    const { studentName, subject, assignmentTitle, grade, status, submissionTime, answerText, history } = req.body;

    const ai = getGenAI();
    if (!ai) {
      // Fallback thoughtful primary school teacher comments if key is missing
      const fallbackTemplates: Record<string, string> = {
        high: `Thầy/Cô khen ngợi con ${studentName} đã hoàn thành xuất sắc bài ${subject}! Lời giải rõ ràng, tính toán cẩn thận và nộp bài rất đúng giờ. Hãy tiếp tục phát huy con nhé!`,
        medium: `Con ${studentName} có nhiều cố gắng trong bài ${assignmentTitle || subject}. Đa số các câu đều làm tốt, chỉ cần chú ý kiểm tra lại một vài chi tiết nhỏ để bài làm thêm hoàn hảo nhé!`,
        revision: `Con ${studentName} đã nộp bài, tuy nhiên còn một vài chỗ chưa chính xác. Con hãy xem lại gợi ý của thầy/cô và chỉnh sửa lại để nắm vững bài hơn nhé. Cố lên con!`,
      };

      const key = (grade && grade >= 8.5) ? "high" : (grade && grade >= 5) ? "medium" : "revision";
      return res.json({
        comment: fallbackTemplates[key],
        source: "local-template",
      });
    }

    const prompt = `Bạn là một giáo viên tiểu học mẫu mực, giàu lòng yêu thương, ân cần và giàu kinh nghiệm sư phạm tại Việt Nam.
Hãy viết một nhận xét ngắn gọn (từ 2-3 câu), tích cực, động viên và phù hợp lứa tuổi học sinh tiểu học (lớp 3) cho bài tập của học sinh sau:
- Tên học sinh: ${studentName || "Con"}
- Môn học: ${subject || "Học tập"}
- Tên bài: ${assignmentTitle || "Bài tập"}
- Điểm số: ${grade !== undefined ? grade + "/10" : "Chưa chấm"}
- Đánh giá: ${status || "Hoàn thành"}
- Thời gian nộp: ${submissionTime || "Đúng hạn"}
- Bài làm của học sinh: ${answerText ? `"${answerText.slice(0, 200)}"` : "Đã gửi bài"}
- Lịch sử gần đây: ${history || "Chăm chỉ học tập"}

Yêu cầu nhận xét:
1. Xưng hô thân mật phù hợp tiểu học ("Thầy/Cô khen con...", "Con đã rất cố gắng...", "Cố gắng lên nhé!").
2. Chỉ rõ điểm con làm tốt hoặc điều con cần lưu ý nhẹ nhàng, không gây áp lực tiêu cực.
3. Độ dài ngắn gọn (khoảng 25 - 45 từ), giàu tính khích lệ.
Chỉ trả về duy nhất nội dung câu nhận xét, không thêm dấu ngoặc kép thừa hay giải thích.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const comment = response.text?.trim() || `Con ${studentName} đã hoàn thành bài tập rất đáng khen ngợi!`;

    return res.json({
      comment,
      source: "gemini-ai",
    });
  } catch (error: any) {
    console.error("Error generating comment:", error);
    return res.json({
      comment: `Thầy/Cô ghi nhận sự cố gắng của con trong bài học này. Hãy luôn giữ tinh thần tự giác học tập nhé!`,
      source: "fallback",
    });
  }
});

// AI Classroom Alert and Daily/Weekly Summary Report
app.post("/api/ai/generate-report", async (req, res) => {
  try {
    const { reportType, stats, pendingStudents, overdueList, topProgressStudents } = req.body;
    const ai = getGenAI();

    if (!ai) {
      const summary = `Báo cáo ${reportType === "daily" ? "cuối ngày" : "cuối tuần"} lớp 3A: Hiện có ${stats?.completedCount || 0}/${stats?.totalAssignmentsCount || 30} lượt hoàn thành bài tập. Cần đôn đốc ${pendingStudents?.length || 0} học sinh chưa nộp bài. Khen ngợi tinh thần học tập của các em có tiến bộ vượt bậc trong tuần.`;
      return res.json({ reportText: summary, source: "template" });
    }

    const prompt = `Bạn là Trợ lý giáo dục AI hỗ trợ giáo viên chủ nhiệm tiểu học.
Hãy tạo một bản tóm tắt phân tích sư phạm cô đọng cho ${reportType === "daily" ? "Báo cáo cuối ngày" : "Báo cáo tổng kết tuần"}:
- Tổng số học sinh: 30 em
- Số bài hoàn thành: ${stats?.completedCount || 24}
- Số học sinh chưa hoàn thành/chưa nộp: ${pendingStudents?.length || 4} (${pendingStudents?.join(", ") || "Không có"})
- Danh sách nộp muộn/quá hạn: ${overdueList?.length || 2} (${overdueList?.join(", ") || "Không có"})
- Học sinh tiến bộ nổi bật: ${topProgressStudents?.join(", ") || "Nguyễn Minh Anh, Trần Gia Huy"}

Yêu cầu:
1. Đưa ra 1 câu cảnh báo nổi bật quan trọng nhất (Highlight alert) giúp giáo viên biết ngay cần nhắc nhở ai.
2. Tóm tắt nhanh tình hình học tập và tỷ lệ hoàn thành.
3. Đề xuất hành động sư phạm cụ thể trong 2 gạch đầu dòng (ví dụ: gửi tin nhắn cho phụ huynh những em chưa làm bài, tuyên dương em tiến bộ).
Giữ phong cách chuyên nghiệp, sư phạm, thiết thực.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({
      reportText: response.text?.trim(),
      source: "gemini-ai",
    });
  } catch (error: any) {
    console.error("Error generating report:", error);
    return res.json({
      reportText: "Hệ thống đã ghi nhận tình hình bài tập của lớp. Thầy/cô vui lòng kiểm tra danh sách học sinh chưa nộp bài để có biện pháp hỗ trợ kịp thời.",
      source: "fallback",
    });
  }
});

// Send simulated or real email report to teacher
app.post("/api/email/send-report", async (req, res) => {
  const { recipientEmail, subject, reportContent } = req.body;
  
  // Log and simulate email dispatch
  console.log(`[Email Service] Sending report to ${recipientEmail}`);
  console.log(`[Email Service] Subject: ${subject}`);
  
  // Return success response with receipt timestamp
  return res.json({
    success: true,
    sentTo: recipientEmail,
    sentAt: new Date().toISOString(),
    message: `Đã gửi báo cáo thành công tới hòm thư: ${recipientEmail}`,
  });
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Teacher Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
