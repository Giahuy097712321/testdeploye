import React, { useState, useEffect } from "react";
// Import icon từ lucide-react
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Plus, 
  Save, 
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import "../admin/AdminStyles.css"; 

// === CẤU HÌNH SERVER ===
const API_BASE_URL = "http://localhost:5000";
const API_EXAM_URL = `${API_BASE_URL}/api/exams`;

const initialExamState = {
  id: "",
  type: "Kỳ thi Hạng A",
  location: "",
  address: "",
  exam_date: "",
  exam_time: "",
  spots_left: 20,
  is_active: true
};

export default function ExamManager() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState(initialExamState);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // === FETCH DATA ===
  const fetchExams = async () => {
    try {
      const response = await fetch(API_EXAM_URL);
      if (!response.ok) throw new Error("Không thể kết nối Server");
      const data = await response.json();
      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi fetch:", error);
      setMessage({ type: "error", text: "Lỗi kết nối Server: " + error.message });
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // === HANDLERS ===
  const handleAddNew = () => {
    setForm(initialExamState);
    setIsEditing(false);
    setMessage(null);
  };

  const handleEditClick = (exam) => {
    let formattedDate = "";
    if (exam.exam_date) {
        formattedDate = new Date(exam.exam_date).toISOString().split('T')[0];
    }

    setForm({
      ...exam,
      exam_date: formattedDate,
      is_active: exam.is_active === 1 || exam.is_active === true
    });
    setIsEditing(true);
    setMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_EXAM_URL}/${form.id}` : API_EXAM_URL;

      const payload = {
          type: form.type,
          location: form.location,
          address: form.address,
          exam_date: form.exam_date,
          exam_time: form.exam_time,
          spots_left: parseInt(form.spots_left) || 0,
          is_active: form.is_active 
      };

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Lỗi khi lưu dữ liệu");
      
      setMessage({
        type: "success",
        text: `${isEditing ? "Cập nhật" : "Tạo mới"} thành công!`,
      });

      if (!isEditing) handleAddNew();
      fetchExams();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch thi này?")) return;
    try {
      await fetch(`${API_EXAM_URL}/${id}`, { method: "DELETE" });
      setMessage({ type: "success", text: "Đã xóa thành công!" });
      fetchExams();
      if (form.id === id) handleAddNew();
    } catch (error) {
      setMessage({ type: "error", text: "Lỗi khi xóa" });
    }
  };

  const getTypeBadgeColor = (typeString) => {
    if (!typeString) return "#666";
    if (typeString.includes("Hạng A")) return "#0066cc"; 
    if (typeString.includes("Hạng B")) return "#d97706"; 
    return "#22c55e"; 
  };

  return (
    <div
      className="solution-manager-container"
      style={{
        display: "flex",
        gap: "24px",
        marginTop: "20px",
        flexDirection: "row-reverse", 
      }}
    >
      {/* --- PANEL 1: FORM NHẬP LIỆU --- */}
      <div className="panel" style={{ flex: 1 }}>
        <div className="panel-header" style={{ justifyContent: "space-between" }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditing ? <Edit size={18} /> : <Plus size={18} />}
            {isEditing ? `Sửa Lịch Thi #${form.id}` : "Thêm Lịch Thi Mới"}
          </span>
          {isEditing && (
            <button
              type="button"
              onClick={handleAddNew}
              className="btn btn-sm btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={14} /> Hủy
            </button>
          )}
        </div>

        <div className="form-section">
          {message && (
            <div className={`message-box ${message.type === "success" ? "msg-success" : "msg-error"}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Loại Chứng Chỉ</label>
              <select
                className="form-control"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Kỳ thi Hạng A">Kỳ thi Hạng A (UAV &lt; 250g)</option>
                <option value="Kỳ thi Hạng B">Kỳ thi Hạng B (UAV &gt; 250g)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tên Trung Tâm / Địa điểm</label>
              <div className="input-group-icon" style={{ position: 'relative' }}>
                <input
                  className="form-control"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="VD: Trung tâm Đào tạo & Sát hạch Hà Nội"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ chi tiết</label>
              <textarea
                className="form-control"
                rows="2"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="VD: 123 Nguyễn Xiển, Thanh Xuân..."
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Ngày thi</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.exam_date}
                  onChange={(e) => setForm({ ...form, exam_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Giờ thi</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.exam_time}
                  onChange={(e) => setForm({ ...form, exam_time: e.target.value })}
                  placeholder="VD: 08:00 - 12:00"
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Số chỗ</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.spots_left}
                  onChange={(e) => setForm({ ...form, spots_left: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-control"
                  value={form.is_active ? "true" : "false"}
                  onChange={(e) => setForm({ ...form, is_active: e.target.value === "true" })}
                >
                  <option value="true">Đang mở đăng ký</option>
                  <option value="false">Đã đóng / Ẩn</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: 20 }}>
              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                {loading ? "Đang xử lý..." : isEditing ? "CẬP NHẬT LỊCH THI" : "TẠO LỊCH THI MỚI"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- PANEL 2: DANH SÁCH --- */}
      <div className="panel" style={{ flex: 1.5 }}>
        <div className="panel-header" style={{ justifyContent: "space-between" }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} /> Danh sách Lịch Thi
          </span>
          <button 
            className="btn btn-success btn-sm" 
            onClick={fetchExams}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RefreshCw size={14} /> Làm mới
          </button>
        </div>

        <div className="list-group">
          {exams.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", color: "#999", display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Calendar size={40} strokeWidth={1} />
              Chưa có lịch thi nào.
            </div>
          )}

          {exams.map((exam) => (
            <div key={exam.id} className="list-item" style={{ alignItems: "flex-start", padding: "15px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  background: "#f0f7ff",
                  border: "1px solid #cce3ff",
                  color: "#0066cc",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {exam.exam_date ? new Date(exam.exam_date).getDate() : "--"}
                </span>
                <span style={{ fontSize: "11px", textTransform: "uppercase" }}>
                    {exam.exam_date ? new Date(exam.exam_date).toLocaleString('vi-VN', { month: 'short' }) : ""}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div className="item-title" style={{ fontSize: "15px", fontWeight: "bold" }}>
                        {exam.location}
                    </div>
                    <span 
                        style={{ 
                            fontSize: "10px", 
                            padding: "2px 8px", 
                            borderRadius: "10px", 
                            color: "#fff",
                            backgroundColor: getTypeBadgeColor(exam.type),
                            height: "fit-content",
                            whiteSpace: "nowrap",
                            fontWeight: "600"
                        }}
                    >
                        {exam.type}
                    </span>
                </div>
                
                <div style={{ fontSize: "13px", color: "#555", marginBottom: "6px", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                   <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                   <span>{exam.address}</span>
                </div>
                
                <div style={{ fontSize: "12px", color: "#888", display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={14} />
                      {exam.exam_time}
                   </div>
                   
                   <div style={{ display: "flex", alignItems: "center", gap: "4px", color: exam.spots_left > 0 ? "green" : "red", fontWeight: "500" }}>
                      <Users size={14} />
                      {exam.spots_left > 0 ? `Còn ${exam.spots_left} chỗ` : "Hết chỗ"}
                   </div>

                   {!exam.is_active && (
                       <span style={{
                         fontSize: "10px", 
                         background: "#f3f4f6", 
                         padding: "2px 6px", 
                         borderRadius: "4px", 
                         border: "1px solid #ddd",
                         color: "#666"
                       }}>
                         Đã ẩn
                       </span>
                   )}
                </div>

                <div className="item-actions" style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <button 
                    onClick={() => handleEditClick(exam)} 
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={14} /> Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(exam.id)} 
                    className="btn btn-danger btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}