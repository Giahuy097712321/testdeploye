import React, { useState, useEffect } from 'react';

const API_NOTI_URL = "http://localhost:5000/api/notifications";

const initialFormState = {
  id: null,
  title: "",
  date: "",
  description: "",
  link: "",
  isNew: true
};

export default function NotificationManager() {
  const [notis, setNotis] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- FETCH DATA ---
  const fetchNotis = async () => {
    try {
      const res = await fetch(API_NOTI_URL);
      const data = await res.json();
      setNotis(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải thông báo:", error);
    }
  };

  useEffect(() => { fetchNotis(); }, []);

  // --- HANDLERS ---
  const handleEdit = (item) => {
    setForm({
      ...item,
      isNew: item.isNew // Đã được server convert sang boolean
    });
    setIsEditing(true);
    setMessage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    try {
      await fetch(`${API_NOTI_URL}/${id}`, { method: "DELETE" });
      setMessage({ type: 'success', text: "Đã xóa thành công!" });
      fetchNotis();
      if (form.id === id) handleCancel();
    } catch (err) {
      setMessage({ type: 'error', text: "Lỗi khi xóa: " + err.message });
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setIsEditing(false);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${API_NOTI_URL}/${form.id}` : API_NOTI_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!" });
        handleCancel(); // Reset form
        fetchNotis();   // Reload list
      } else {
        setMessage({ type: 'error', text: "Có lỗi xảy ra khi lưu." });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="split-layout">
      {/* 1. DANH SÁCH (BÊN TRÁI) */}
      <aside className="panel">
        <div className="panel-header">Danh Sách Thông Báo</div>
        <div className="list-group">
          {notis.map(item => (
            <div key={item.id} className="list-item">
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <div style={{ fontWeight: '600', color: '#0066cc', marginBottom: '4px' }}>
                   {item.isNew && <span style={{ 
                      background: '#0066cc', color:'white', fontSize:'10px', 
                      padding:'2px 6px', borderRadius:'4px', marginRight:'6px' 
                   }}>MỚI</span>}
                   {item.title}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Ngày đăng: {item.date}</div>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(item)} className="btn btn-primary btn-sm">Sửa</button>
                <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm">Xóa</button>
              </div>
            </div>
          ))}
          {notis.length === 0 && <div style={{ padding: '20px', textAlign:'center', color:'#999' }}>Chưa có dữ liệu</div>}
        </div>
      </aside>

      {/* 2. FORM (BÊN PHẢI) */}
      <main className="panel">
        <div className="panel-header panel-header-actions">
          <span>{isEditing ? "Chỉnh Sửa Thông Báo" : "Thêm Thông Báo Mới"}</span>
          {isEditing && <button onClick={handleCancel} className="btn btn-sm btn-secondary">Hủy</button>}
        </div>

        <div className="form-section">
          {message && (
            <div className={`message-box ${message.type === 'success' ? 'msg-success' : 'msg-error'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Tiêu đề */}
            <div className="form-group">
              <label className="form-label">Tiêu đề thông báo</label>
              <input 
                type="text" className="form-control" required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                placeholder="VD: Nghị định số 288/2025/NĐ-CP"
              />
            </div>

            {/* Hàng: Ngày & Toggle Mới */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label className="form-label">Ngày hiển thị (Text)</label>
                    <input 
                        type="text" className="form-control"
                        value={form.date}
                        onChange={e => setForm({...form, date: e.target.value})}
                        placeholder="VD: 05/11/2025"
                    />
                </div>
                
                {/* Toggle Badge MỚI (Sử dụng lại class CSS đã có) */}
                <div className="form-group">
                    <label className="form-label">Trạng thái Badge</label>
                    <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                        <span className={`toggle-status-label ${form.isNew ? 'on' : ''}`}>
                          {form.isNew ? 'Hiện chữ "MỚI"' : 'Không hiện'}
                        </span>
                        <label className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={form.isNew}
                            onChange={(e) => setForm(prev => ({ ...prev, isNew: e.target.checked }))} 
                          />
                          <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Mô tả */}
            <div className="form-group">
              <label className="form-label">Mô tả ngắn</label>
              <textarea 
                className="form-control" rows="3"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="VD: Quy định về quản lý tàu bay không người lái..."
              />
            </div>

            {/* Link */}
            <div className="form-group">
              <label className="form-label">Đường dẫn (Link)</label>
              <input 
                type="text" className="form-control"
                value={form.link}
                onChange={e => setForm({...form, link: e.target.value})}
                placeholder="https://..."
              />
            </div>

            {/* Nút Submit */}
            <div className="form-actions-footer">
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Đang xử lý..." : (isEditing ? "CẬP NHẬT" : "ĐĂNG THÔNG BÁO")}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}