import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// --- IMPORT MANAGERS ---
import PointManager from "../../points/PointManager";
import SolutionManager from "../../Solutions/SolutionManager";
import Model3DManager from "../../Model3D/Model3DManager";
import CourseManager from "../../course/CourseManager";
import ExamManager from "../../exam/ExamManager";
import UserManager from "../../UserManager/UserManager";
import DisplaySettingsManager from "../../DisplaySettings/DisplaySettingsManager/DisplaySettingsManager";
import LookupManager from "../../lookup/LookupManager";

import "./Admin.css";

// =====================================================================
// LOADING SCREEN COMPONENT
// =====================================================================
const LoadingScreen = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(10px)'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px'
    }}>
      {/* Animated spinner */}
      <div style={{
        width: '60px',
        height: '60px',
        border: '4px solid rgba(0, 80, 184, 0.2)',
        borderTop: '4px solid #0050b8',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      
      <div style={{
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <h2 style={{
          margin: '0 0 10px 0',
          fontSize: '24px',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>Đang tải dữ liệu</h2>
        <p style={{
          margin: 0,
          opacity: 0.7,
          fontSize: '14px'
        }}>Vui lòng chờ...</p>
      </div>

      {/* Dot animation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center'
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#0050b8',
              animation: `bounce 1.4s infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>

    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes bounce {
        0%, 80%, 100% { opacity: 0.5; transform: scale(0.8); }
        40% { opacity: 1; transform: scale(1.2); }
      }
    `}</style>
  </div>
);

export default function Admin() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Đổi tab mặc định hoặc giữ nguyên tùy bạn
  const [activeTab, setActiveTab] = useState("model3d");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      // Simulate loading delay for initial load (optional)
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 800); // Show loading screen for 800ms

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-container">
      {/* Show loading screen during initial load */}
      {isInitialLoading && <LoadingScreen />}

      {/* 1. HEADER & NAVIGATION */}
      <header className="admin-header">
        <div className="header-brand" style={{ position: "relative" }}>
          <div
            onClick={() => setOpenMenu(!openMenu)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <h1 style={{ margin: 0 }}>UAV ADMIN</h1>
            <span style={{ fontSize: 12 }}>▼</span>
          </div>

          {openMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 6,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 6,
                minWidth: 140,
                zIndex: 999
              }}
            >
              <div
                onClick={handleLogout}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  color: "red",
                  fontWeight: 600
                }}
              >
                Đăng xuất
              </div>
            </div>
          )}
        </div>

        <nav className="header-nav">
          <button
            className={`nav-item ${activeTab === "model3d" ? "active" : ""}`}
            onClick={() => setActiveTab("model3d")}
          >
            Quản lý Model 3D
          </button>

          <button
            className={`nav-item ${activeTab === "training" ? "active" : ""}`}
            onClick={() => setActiveTab("training")}
          >
            Đào tạo & Khóa học
          </button>

          <button
            className={`nav-item ${activeTab === "exams" ? "active" : ""}`}
            onClick={() => setActiveTab("exams")}
          >
            Quản lý Lịch thi
          </button>

          <button
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Quản lý Người dùng
          </button>

          <button
            className={`nav-item ${activeTab === "points" ? "active" : ""}`}
            onClick={() => setActiveTab("points")}
          >
            Quản lý Điểm 3D
          </button>

          <button
            className={`nav-item ${activeTab === "solutions" ? "active" : ""}`}
            onClick={() => setActiveTab("solutions")}
          >
            Quản lý Giải pháp
          </button>

          {/* === CẬP NHẬT TAB NÀY === */}
          <button
            className={`nav-item ${activeTab === "display" ? "active" : ""}`}
            onClick={() => setActiveTab("display")}
          >
            Giao diện & Thông báo
          </button>

          <button
            className={`nav-item ${activeTab === "lookup" ? "active" : ""}`}
            onClick={() => setActiveTab("lookup")}
          >
            Quản lý Giấy phép
          </button>
        </nav>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <div className="admin-content-wrapper">
        {activeTab === "model3d" && <Model3DManager />}

        {activeTab === "training" && <CourseManager />}

        {activeTab === "exams" && <ExamManager />}

        {activeTab === "users" && <UserManager />}

        {activeTab === "points" && <PointManager />}

        {activeTab === "solutions" && <div className="panel"><SolutionManager /></div>}

        {/* === CẬP NHẬT RENDER COMPONENT MỚI === */}
        {activeTab === "display" && (
          <div className="panel" style={{ border: "none", boxShadow: "none", background: "transparent", padding: 0 }}>
            {/* Component mới xử lý cả Footer và Thông báo */}
            <DisplaySettingsManager />
          </div>
        )}

        {activeTab === "lookup" && <LookupManager />}
      </div>
    </div>
  );
}