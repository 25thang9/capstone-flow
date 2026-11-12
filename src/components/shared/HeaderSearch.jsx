"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CloseIcon, SearchIcon } from "@/components/shared/PortalIcons";

export default function HeaderSearch({ lecturer = false }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapper = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const closeOutside = (event) => {
      if (!wrapper.current?.contains(event.target)) setOpen(false);
    };
    const closeEscape = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  function submit(event) {
    event.preventDefault();
    const text = query.trim();
    const path = lecturer ? "/lecturer/topics" : "/topics";
    router.push(text ? `${path}?search=${encodeURIComponent(text)}` : path);
    setOpen(false);
  }

  return (
    <div className="portal-tool" ref={wrapper}>
      <button type="button" className="portal-icon-button" aria-label="Tìm kiếm đề tài" aria-expanded={open} aria-controls="header-search-panel" onClick={() => setOpen((current) => !current)}><SearchIcon /></button>
      {open ? (
        <div className="portal-toolbar-panel portal-search-panel" id="header-search-panel">
          <div className="portal-panel-title"><strong>{lecturer ? "Tìm trong đề tài của tôi" : "Tìm kiếm đề tài"}</strong><button type="button" className="portal-panel-close" aria-label="Đóng tìm kiếm" onClick={() => setOpen(false)}><CloseIcon /></button></div>
          <form onSubmit={submit} className="portal-toolbar-search-form" role="search">
            <label htmlFor="header-search-input">Từ khóa</label>
            <div><input ref={input} id="header-search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nhập tên đề tài..." maxLength={200} type="search"/><button type="submit">Tìm</button></div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
