const { useState, useEffect, useRef } = React;
const API_BASE = "/api";
const Icons = {
  Dashboard: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" })),
  Trainees: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" })),
  Onboarding: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" })),
  Bot: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" })),
  Employer: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" })),
  SelfEmployment: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 10V3L4 14h7v7l9-11h-7z" })),
  AI: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" })),
  Compliance: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" })),
  Reports: () => /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })),
  Search: () => /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" })),
  Check: () => /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M5 13l4 4L19 7" })),
  Shield: () => /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" })),
  TrendingUp: () => /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" })),
  Download: () => /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
  Print: () => /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" }))
};
function TraineesView({ trainees, totalTrainees, currentPage, totalPages, setCurrentPage, filters, setFilters, onSelectTrainee, showToast, refreshTrainees }) {
  const [remedialModalTrainee, setRemedialModalTrainee] = useState(null);
  const [remedialNote, setRemedialNote] = useState("");
  const handleFlagRemedial = async () => {
    if (!remedialModalTrainee) return;
    try {
      await fetch(`${API_BASE}/trainees/${remedialModalTrainee.id}/remedial?notes=${encodeURIComponent(remedialNote || "Flagged for Remedial Upskilling")}`, {
        method: "POST"
      }).then(readResponse);
      showToast(`Flagged ${remedialModalTrainee.id} for remedial action`);
      setRemedialModalTrainee(null);
      setRemedialNote("");
      refreshTrainees();
    } catch (err) {
      showToast("Failed to flag remedial action", "error");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1 min-w-[240px]" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400" }, /* @__PURE__ */ React.createElement(Icons.Search, null)), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Search by Trainee Name, ID (e.g. SKILL-2026-1025), Employer, or Role...",
      value: filters.search,
      onChange: (e) => setFilters((prev) => ({ ...prev, search: e.target.value })),
      className: "w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: filters.status,
      onChange: (e) => setFilters((prev) => ({ ...prev, status: e.target.value })),
      className: "text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700"
    },
    /* @__PURE__ */ React.createElement("option", { value: "All" }, "All Statuses"),
    /* @__PURE__ */ React.createElement("option", { value: "Placed" }, "Placed (Wage Employed)"),
    /* @__PURE__ */ React.createElement("option", { value: "Self-Employed" }, "Self-Employed"),
    /* @__PURE__ */ React.createElement("option", { value: "Unemployed" }, "Unemployed")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setFilters((prev) => ({ ...prev, remedialOnly: !prev.remedialOnly })),
      className: `text-xs px-3 py-2 rounded-lg font-semibold border transition-all ${filters.remedialOnly ? "bg-amber-500 text-white border-amber-600 shadow-sm" : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"}`
    },
    "\u26A0\uFE0F Remedial Flags Only"
  ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "registry-topline" }, /* @__PURE__ */ React.createElement("h2", null, "Learner outcome records"), /* @__PURE__ */ React.createElement("span", null, totalTrainees.toLocaleString(), " matching learners \xB7 12 per page")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("div", { className: "record-collection learner-passports" }, trainees.length === 0 && /* @__PURE__ */ React.createElement("article", null, /* @__PURE__ */ React.createElement("div", { className: "empty-state" }, "No learners match these filters. Try another search or status.")), trainees.map((t) => {
    const isRemedial = t.remedial_flag;
    return /* @__PURE__ */ React.createElement("article", { key: t.id, className: `hover:bg-blue-50/40 transition-colors ${isRemedial ? "bg-amber-50/30" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Learner profile"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("div", { className: "learner-cell" }, /* @__PURE__ */ React.createElement("span", { className: "learner-avatar" }, t.name.split(" ").slice(0, 2).map((v) => v[0]).join("")), /* @__PURE__ */ React.createElement("div", { className: "font-bold text-slate-900 flex items-center space-x-1.5" }, /* @__PURE__ */ React.createElement("span", null, t.name), isRemedial && /* @__PURE__ */ React.createElement("span", { title: "Remedial Intervention Required", className: "text-amber-500 font-bold" }, "\u26A0\uFE0F")), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] font-mono text-blue-600 font-semibold" }, t.id), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400" }, t.gender, ", ", t.age, " yrs")))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Verified identity"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("div", { className: "font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block text-[11px]" }, t.aadhaar_masked), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-500 mt-0.5" }, t.mobile), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] text-emerald-600 font-semibold" }, "Consent-based record"))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Learning pathway"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("div", { className: "font-semibold text-slate-800" }, t.course), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500" }, t.district), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 truncate max-w-[150px]" }, t.training_provider))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Livelihood status"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded-full text-[11px] font-bold ${t.employment_status === "Placed" ? "bg-blue-100 text-blue-800" : t.employment_status === "Self-Employed" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}` }, t.employment_status), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-700 font-medium mt-1 truncate max-w-[140px]" }, t.employer_name || t.job_role || "Seeking Job"), t.attrition_reason && /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-rose-600 font-semibold truncate max-w-[130px]" }, "Reason: ", t.attrition_reason))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Income journey"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement(Sparkline, { values: [t.baseline_wage, t.wage_m3, t.wage_m6, t.wage_m12] }), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-1 font-mono text-[10px]" }, /* @__PURE__ */ React.createElement("span", { className: "bg-slate-100 px-1.5 py-0.5 rounded text-slate-600", title: "Baseline M0" }, "M0: \u20B9", t.baseline_wage ? (t.baseline_wage / 1e3).toFixed(0) + "k" : "0"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-300" }, "\u2192"), /* @__PURE__ */ React.createElement("span", { className: "bg-slate-100 px-1.5 py-0.5 rounded text-slate-600", title: "Month 3" }, "M3: \u20B9", t.wage_m3 ? (t.wage_m3 / 1e3).toFixed(0) + "k" : "0"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-300" }, "\u2192"), /* @__PURE__ */ React.createElement("span", { className: "bg-slate-100 px-1.5 py-0.5 rounded text-slate-600", title: "Month 6" }, "M6: \u20B9", t.wage_m6 ? (t.wage_m6 / 1e3).toFixed(0) + "k" : "0"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-300" }, "\u2192"), /* @__PURE__ */ React.createElement("span", { className: `px-1.5 py-0.5 rounded font-bold ${t.current_wage >= t.baseline_wage ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`, title: "Month 12 Current" }, "M12: \u20B9", t.current_wage ? (t.current_wage / 1e3).toFixed(0) + "k" : "0")), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 mt-1" }, t.retention_status ? "Retained in employment" : "Not marked as retained"))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Risk signal"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-0.5 rounded font-bold text-[10px] ${t.ai_risk_level === "High" ? "bg-rose-100 text-rose-700 border border-rose-200" : t.ai_risk_level === "Medium" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}` }, t.ai_attrition_risk_score, "% (", t.ai_risk_level, ")"))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Actions"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => onSelectTrainee(t),
        className: "text-xs bg-slate-100 hover:bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded border border-slate-200 transition-colors"
      },
      "Timeline \u2197"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setRemedialModalTrainee(t);
          setRemedialNote(t.remedial_notes || "");
        },
        className: "text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded border border-amber-200",
        title: "Trigger Remedial Intervention"
      },
      "Remedial"
    ))));
  }))), /* @__PURE__ */ React.createElement("div", { className: "p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600" }, /* @__PURE__ */ React.createElement("div", null, "Showing ", /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, totalTrainees ? (currentPage - 1) * 12 + 1 : 0), " to ", /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, Math.min(currentPage * 12, totalTrainees)), " of ", /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, totalTrainees), " trainees"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
      disabled: currentPage === 1,
      className: "px-3 py-1 bg-white border border-slate-300 rounded font-semibold disabled:opacity-40"
    },
    "Previous"
  ), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-800" }, "Page ", currentPage, " of ", totalPages), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
      disabled: currentPage === totalPages,
      className: "px-3 py-1 bg-white border border-slate-300 rounded font-semibold disabled:opacity-40"
    },
    "Next"
  )))), remedialModalTrainee && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2 text-amber-600" }, /* @__PURE__ */ React.createElement(Icons.Shield, null), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-base" }, "Assign Remedial Skilling Intervention")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, "Flagging Trainee: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-800" }, remedialModalTrainee.name), " (", remedialModalTrainee.id, ")"), /* @__PURE__ */ React.createElement("div", { className: "mt-4 space-y-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Remedial Reason / Action Plan"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: "3",
      value: remedialNote,
      onChange: (e) => setRemedialNote(e.target.value),
      placeholder: "e.g. Schedule candidate for district job fair, provide Level-4 upskilling bridge course, or contact employer.",
      className: "w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 flex items-center justify-end space-x-3" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setRemedialModalTrainee(null),
      className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
    },
    "Cancel"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleFlagRemedial,
      className: "px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
    },
    "Confirm Remedial Flag"
  )))));
}
function OnboardingWizardView({ showToast, onSuccess }) {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardedResult, setOnboardedResult] = useState(null);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    aadhaar: "",
    gender: "Male",
    age: 22,
    course: "Electrician",
    training_provider: "National Skill Training Institute (NSTI)",
    district: "Hyderabad",
    state: "Telangana",
    baseline_wage: 14e3,
    job_role: "Junior Electrician",
    employer_name: "Sahyadri Buildworks Pvt Ltd",
    consent_given: true,
    consent_text: "I consent to my training and demographic data being linked with employment and longitudinal wage outcomes for 12 months under DPDP Act 2023."
  });
  const handleAadhaarChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 12);
    setForm((prev) => ({ ...prev, aadhaar: val }));
  };
  const handleSendOTP = async () => {
    if (form.mobile.length < 10) {
      showToast("Enter a valid 10-digit mobile number", "error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: form.mobile })
      });
      const data = await readResponse(res);
      setOtpSent(true);
      setSimulatedOtp(data.simulated_otp);
      setEnteredOtp(data.simulated_otp);
      showToast(`OTP ${data.simulated_otp} dispatched via SMS Gateway!`);
    } catch (err) {
      showToast("Failed to send OTP", "error");
    }
  };
  const handleVerifyOTP = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: form.mobile, otp: enteredOtp })
      });
      if (res.ok) {
        setOtpVerified(true);
        showToast("Aadhaar-linked Mobile OTP verified successfully!");
      } else {
        showToast("Invalid OTP entered", "error");
      }
    } catch (err) {
      showToast("Verification failed", "error");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      showToast("Please complete OTP verification before onboarding", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/trainees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await readResponse(res);
      setIsSubmitting(false);
      setOnboardedResult(data);
      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }
      showToast(`Trainee ${data.id} onboarded with DPDP cryptographic hash!`);
    } catch (err) {
      setIsSubmitting(false);
      showToast("Failed to onboard trainee", "error");
    }
  };
  if (onboardedResult) {
    return /* @__PURE__ */ React.createElement("div", { className: "max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl" }, "\u2713"), /* @__PURE__ */ React.createElement("h2", { className: "mt-4 text-xl font-extrabold text-slate-900" }, "Trainee Onboarded Successfully!"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-1" }, "National Skilling Registry Outcome Record Created"), /* @__PURE__ */ React.createElement("div", { className: "mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between border-b pb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-500 font-sans" }, "Unique Trainee ID:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-blue-600" }, onboardedResult.id)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between border-b pb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-500 font-sans" }, "Trainee Name:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-800" }, onboardedResult.name)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between border-b pb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-500 font-sans" }, "Masked Aadhaar:"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-800" }, onboardedResult.aadhaar_masked)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between border-b pb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-500 font-sans" }, "Course & Sector:"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-800" }, onboardedResult.course)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between border-b pb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-500 font-sans" }, "AI Attrition Risk:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-600" }, onboardedResult.ai_attrition_risk_score, "% (Low)")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between pt-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-500 font-sans" }, "DPDP Consent Artifact:"), /* @__PURE__ */ React.createElement("span", { className: "text-emerald-700 font-bold" }, "Encrypted & Stored (AES-256)"))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 flex justify-center space-x-3" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setOnboardedResult(null);
          setStep(1);
          setOtpVerified(false);
          setOtpSent(false);
        },
        className: "px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
      },
      "Onboard Another Trainee"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onSuccess,
        className: "px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
      },
      "View in Registry \u2197"
    )));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900 text-white p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-base font-bold" }, "New Trainee Onboarding & DPDP Consent"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-400" }, "Digital Personal Data Protection Act 2023 Compliant Intake")), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-mono bg-blue-600 px-2.5 py-1 rounded font-bold" }, "Step ", step, " of 3")), /* @__PURE__ */ React.createElement("div", { className: "mt-4 grid grid-cols-3 gap-2" }, /* @__PURE__ */ React.createElement("div", { className: `h-1.5 rounded-full ${step >= 1 ? "bg-blue-500" : "bg-slate-700"}` }), /* @__PURE__ */ React.createElement("div", { className: `h-1.5 rounded-full ${step >= 2 ? "bg-blue-500" : "bg-slate-700"}` }), /* @__PURE__ */ React.createElement("div", { className: `h-1.5 rounded-full ${step >= 3 ? "bg-blue-500" : "bg-slate-700"}` }))), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit, className: "p-6 space-y-6" }, step === 1 && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-sm border-b pb-2" }, "Step 1: Trainee Demographics & Aadhaar"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Full Legal Name *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "e.g. Sirigna Reddy",
      value: form.name,
      onChange: (e) => setForm((prev) => ({ ...prev, name: e.target.value })),
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Aadhaar Number (12-digits) *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "123456789012",
      value: form.aadhaar,
      onChange: handleAadhaarChange,
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 text-slate-800"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 mt-1" }, "Display Preview: ", form.aadhaar.length >= 4 ? `XXXX-XXXX-${form.aadhaar.slice(-4)}` : "XXXX-XXXX-XXXX", " (AES-256 Encrypted)")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Mobile Number (Aadhaar Linked) *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "tel",
      required: true,
      placeholder: "9876543210",
      value: form.mobile,
      onChange: (e) => setForm((prev) => ({ ...prev, mobile: e.target.value })),
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Gender & Age"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: form.gender,
      onChange: (e) => setForm((prev) => ({ ...prev, gender: e.target.value })),
      className: "p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Male" }, "Male"),
    /* @__PURE__ */ React.createElement("option", { value: "Female" }, "Female"),
    /* @__PURE__ */ React.createElement("option", { value: "Other" }, "Other")
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "18",
      max: "60",
      value: form.age,
      onChange: (e) => setForm((prev) => ({ ...prev, age: parseInt(e.target.value) || 22 })),
      className: "p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    }
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "District *"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: form.district,
      onChange: (e) => setForm((prev) => ({ ...prev, district: e.target.value })),
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Hyderabad" }, "Hyderabad"),
    /* @__PURE__ */ React.createElement("option", { value: "Visakhapatnam" }, "Visakhapatnam"),
    /* @__PURE__ */ React.createElement("option", { value: "Vijayawada" }, "Vijayawada"),
    /* @__PURE__ */ React.createElement("option", { value: "Guntur" }, "Guntur"),
    /* @__PURE__ */ React.createElement("option", { value: "Warangal" }, "Warangal")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "State"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: form.state,
      onChange: (e) => setForm((prev) => ({ ...prev, state: e.target.value })),
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end pt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => {
        if (!form.name || form.mobile.length < 10 || form.aadhaar.length < 12) {
          showToast("Please fill all required fields in Step 1", "error");
          return;
        }
        setStep(2);
      },
      className: "px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    },
    "Next: Course & Provider \u2192"
  ))), step === 2 && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-sm border-b pb-2" }, "Step 2: Training Course & Placement Status"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Skill Course *"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: form.course,
      onChange: (e) => setForm((prev) => ({ ...prev, course: e.target.value })),
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Electrician" }, "Electrician"),
    /* @__PURE__ */ React.createElement("option", { value: "Welder" }, "Welder"),
    /* @__PURE__ */ React.createElement("option", { value: "Data Entry Operator" }, "Data Entry Operator"),
    /* @__PURE__ */ React.createElement("option", { value: "Retail Associate" }, "Retail Associate"),
    /* @__PURE__ */ React.createElement("option", { value: "Healthcare Assistant" }, "Healthcare Assistant")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Training Provider *"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: form.training_provider,
      onChange: (e) => setForm((prev) => ({ ...prev, training_provider: e.target.value })),
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    },
    /* @__PURE__ */ React.createElement("option", { value: "National Skill Training Institute (NSTI)" }, "National Skill Training Institute (NSTI)"),
    /* @__PURE__ */ React.createElement("option", { value: "Apex Vocational Academy" }, "Apex Vocational Academy"),
    /* @__PURE__ */ React.createElement("option", { value: "Pradhan Mantri Kaushal Kendra (PMKK)" }, "Pradhan Mantri Kaushal Kendra (PMKK)"),
    /* @__PURE__ */ React.createElement("option", { value: "Telangana Skill Development Mission (TSDM)" }, "Telangana Skill Development Mission (TSDM)"),
    /* @__PURE__ */ React.createElement("option", { value: "Andhra Pradesh State Skill Development (APSSDC)" }, "APSSDC")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Job Role"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: form.job_role,
      onChange: (e) => setForm((prev) => ({ ...prev, job_role: e.target.value })),
      placeholder: "e.g. Electrical Technician",
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Employer / Hiring Company"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: form.employer_name,
      onChange: (e) => setForm((prev) => ({ ...prev, employer_name: e.target.value })),
      placeholder: "e.g. Sahyadri Buildworks Pvt Ltd",
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Baseline Monthly Wage (\u20B9)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value: form.baseline_wage,
      onChange: (e) => setForm((prev) => ({ ...prev, baseline_wage: parseFloat(e.target.value) || 0 })),
      placeholder: "14000",
      className: "w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between pt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setStep(1),
      className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
    },
    "\u2190 Back"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setStep(3),
      className: "px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    },
    "Next: DPDP Consent & OTP \u2192"
  ))), step === 3 && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-sm border-b pb-2" }, "Step 3: Digital Personal Data Protection (DPDP) Act Consent & OTP"), /* @__PURE__ */ React.createElement("div", { className: "p-4 rounded-xl bg-blue-50 border border-blue-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start space-x-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      id: "consentCheck",
      required: true,
      checked: form.consent_given,
      onChange: (e) => setForm((prev) => ({ ...prev, consent_given: e.target.checked })),
      className: "mt-1 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
    }
  ), /* @__PURE__ */ React.createElement("label", { htmlFor: "consentCheck", className: "text-xs text-slate-700 leading-relaxed cursor-pointer" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-blue-900 block mb-1" }, "Explicit Consent for Longitudinal Outcome Tracking"), '"I hereby grant explicit consent under Section 6 of the Digital Personal Data Protection Act, 2023 for my training data, Aadhaar-seeded identity, and contact details to be linked with employment and longitudinal wage outcomes over a 12-month evaluation cycle via automated WhatsApp/SMS check-ins."'))), /* @__PURE__ */ React.createElement("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-slate-800" }, "Mobile e-KYC Verification"), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-mono text-slate-500" }, "+91 ", form.mobile)), !otpSent ? /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: handleSendOTP,
      className: "w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
    },
    "Send Verification OTP via SMS"
  ) : /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      maxLength: "6",
      value: enteredOtp,
      onChange: (e) => setEnteredOtp(e.target.value),
      placeholder: "Enter 6-digit OTP",
      className: "flex-1 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center tracking-widest text-slate-800"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: handleVerifyOTP,
      className: "px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
    },
    "Verify OTP"
  )), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Simulated OTP Code: ", /* @__PURE__ */ React.createElement("b", { className: "text-blue-600 font-mono" }, simulatedOtp || "123456")), otpVerified && /* @__PURE__ */ React.createElement("span", { className: "text-emerald-600 font-bold" }, "\u2713 OTP Verified")))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between pt-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setStep(2),
      className: "px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
    },
    "\u2190 Back"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      disabled: !otpVerified || isSubmitting,
      className: "px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-40"
    },
    isSubmitting ? "Generating Trainee Record..." : "Complete Trainee Registration & Generate ID \u2713"
  )))));
}
function BotSimulatorView({ trainees, showToast, refreshData }) {
  const [selectedTraineeId, setSelectedTraineeId] = useState(trainees[0]?.id || "SKILL-2026-1001");
  const [milestone, setMilestone] = useState("6M");
  const [messages, setMessages] = useState([]);
  const [quickOptions, setQuickOptions] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [botStats, setBotStats] = useState(null);
  useEffect(() => {
    fetch(`${API_BASE}/bot/summary`).then(readResponse).then((d) => setBotStats(d)).catch((e) => showToast(e.message, "error"));
  }, []);
  const startSimulation = async () => {
    if (!selectedTraineeId) return;
    try {
      const res = await fetch(`${API_BASE}/bot/chat-turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainee_id: selectedTraineeId,
          milestone,
          step: 1,
          user_reply: "START"
        })
      });
      const data = await readResponse(res);
      setMessages([
        { sender: "bot", text: data.bot_message, time: "Just now" }
      ]);
      setQuickOptions(data.options || []);
      setCurrentStep(data.step);
    } catch (err) {
      console.error("Bot start failed", err);
    }
  };
  useEffect(() => {
    startSimulation();
  }, [selectedTraineeId, milestone]);
  const handleUserReply = async (replyText) => {
    const newMsgList = [...messages, { sender: "user", text: replyText, time: "Just now" }];
    setMessages(newMsgList);
    setQuickOptions([]);
    try {
      const res = await fetch(`${API_BASE}/bot/chat-turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainee_id: selectedTraineeId,
          milestone,
          step: currentStep,
          user_reply: replyText
        })
      });
      const data = await readResponse(res);
      setTimeout(() => {
        setMessages([...newMsgList, { sender: "bot", text: data.bot_message, time: "Just now" }]);
        setQuickOptions(data.options || []);
        setCurrentStep(data.step);
        if (data.completed) {
          showToast(`Outcome record updated via WhatsApp Bot!`);
          refreshData();
        }
      }, 600);
    } catch (err) {
      showToast("Chat turn error", "error");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-6 space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-base flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(Icons.Bot, null), /* @__PURE__ */ React.createElement("span", null, "Automated Follow-up Bot Engine")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, "Dispatches automated WhatsApp/SMS check-ins at 3, 6, and 12-month post-training intervals to capture employment retention, wage growth, or reasons for attrition."), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3 pt-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Select Trainee to Test"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: selectedTraineeId,
      onChange: (e) => setSelectedTraineeId(e.target.value),
      className: "w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
    },
    trainees.map((t) => /* @__PURE__ */ React.createElement("option", { key: t.id, value: t.id }, t.name, " (", t.id, " - ", t.course, ")"))
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Follow-up Milestone"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: milestone,
      onChange: (e) => setMilestone(e.target.value),
      className: "w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-bold"
    },
    /* @__PURE__ */ React.createElement("option", { value: "3M" }, "3-Month Milestone"),
    /* @__PURE__ */ React.createElement("option", { value: "6M" }, "6-Month Milestone"),
    /* @__PURE__ */ React.createElement("option", { value: "12M" }, "12-Month Milestone")
  ))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: startSimulation,
      className: "w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
    },
    "Restart Follow-Up Conversation \u21BA"
  )), botStats && /* @__PURE__ */ React.createElement("div", { className: "bg-white p-5 rounded-xl shadow-sm border border-slate-200" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-800 text-xs uppercase tracking-wider mb-3" }, "Bot Dispatch Analytics"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-3 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-slate-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-extrabold text-slate-800" }, botStats.total_surveys_dispatched), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-500 mt-1" }, "Surveys Sent")), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-emerald-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-extrabold text-emerald-600" }, botStats.response_rate_pct, "%"), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-emerald-700 mt-1" }, "Response Rate")), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-amber-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-xl font-extrabold text-amber-600" }, botStats.remedial_alerts_triggered), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-amber-700 mt-1" }, "Remedial Alerts"))))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-6 flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-sm phone-mockup" }, /* @__PURE__ */ React.createElement("div", { className: "bg-[#075E54] text-white p-3 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white" }, "\u{1F3AF}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-xs" }, "\u0909\u0926\u094D\u092F\u092E Track MSDE Bot \u2713"), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-emerald-200" }, "Official Government Channel"))), /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-emerald-800 px-2 py-0.5 rounded font-mono text-[10px]" }, "WhatsApp")), /* @__PURE__ */ React.createElement("div", { className: "h-96 p-4 overflow-y-auto space-y-3 whatsapp-chat-bg text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "text-center my-1" }, /* @__PURE__ */ React.createElement("span", { className: "bg-amber-100/90 text-amber-900 text-[10px] px-2.5 py-1 rounded shadow-sm" }, "\u{1F512} DPDP End-to-End Encrypted Survey")), messages.map((m, idx) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: idx,
      className: `flex ${m.sender === "user" ? "justify-end" : "justify-start"}`
    },
    /* @__PURE__ */ React.createElement("div", { className: `max-w-[80%] p-3 text-slate-800 text-xs ${m.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"}` }, /* @__PURE__ */ React.createElement("p", { className: "leading-relaxed" }, m.text), /* @__PURE__ */ React.createElement("span", { className: "text-[9px] text-slate-400 block text-right mt-1" }, m.time))
  ))), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-white border-t border-slate-200 space-y-2" }, quickOptions.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5 justify-center" }, quickOptions.map((opt, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      onClick: () => handleUserReply(opt),
      className: "text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-3 py-1.5 rounded-full transition-all"
    },
    opt
  ))), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-center text-slate-400" }, "Click option above to simulate trainee reply")))));
}
function EmployersView({ showToast }) {
  const [employers, setEmployers] = useState([]);
  const [ledger, setLedger] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    company_name: "",
    industry_sector: "Manufacturing",
    gst_number: "36AAACL0145P1Z3",
    udyam_number: "UDYAM-TS-01-001234",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    district: "Hyderabad"
  });
  const fetchEmployers = () => {
    fetch(`${API_BASE}/employers`).then(readResponse).then((d) => setEmployers(d)).catch((e) => showToast(e.message, "error"));
    fetch(`${API_BASE}/employers/blockchain-ledger`).then(readResponse).then((d) => setLedger(d)).catch((e) => showToast(e.message, "error"));
  };
  useEffect(() => {
    fetchEmployers();
  }, []);
  const handleVerify = async (empId, status) => {
    try {
      await fetch(`${API_BASE}/employers/${empId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, verified_by: "Admin (MSDE Nodal Validator)" })
      }).then(readResponse);
      showToast(`Employer status set to ${status}`);
      fetchEmployers();
    } catch (err) {
      showToast("Verification update failed", "error");
    }
  };
  const handleRegisterEmployer = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/employers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmp)
      }).then(readResponse);
      showToast(`Registered employer '${newEmp.company_name}' with Blockchain proof!`);
      setShowRegisterModal(false);
      fetchEmployers();
    } catch (err) {
      showToast("Registration failed", "error");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-sm" }, "Employer Verification & Placement Proof Ledger"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, "Employer profiles, placement counts and recorded verification decisions")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowRegisterModal(true),
      className: "px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
    },
    "+ Register New Employer"
  )), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("div", { className: "record-collection employer-dossiers" }, employers.map((emp) => /* @__PURE__ */ React.createElement("article", { key: emp.id, className: "hover:bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Company & Sector"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-slate-900" }, emp.company_name), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500" }, emp.industry_sector, " \u2022 ", emp.district))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "GST & Udyam Credentials"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, "GST:"), " ", emp.gst_number || "N/A"), /* @__PURE__ */ React.createElement("div", { className: "text-slate-600" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400" }, "Udyam:"), " ", emp.udyam_number || "N/A"))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Contact Person"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("div", { className: "font-semibold text-slate-800" }, emp.contact_person), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-slate-500" }, emp.contact_email))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Active Hires"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded" }, emp.active_hires_count, " Placements"))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Verification Status"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("span", { className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold ${emp.verification_status === "Verified" ? "bg-emerald-100 text-emerald-800" : emp.verification_status === "Pending" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}` }, emp.verification_status))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Actions"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, emp.verification_status !== "Verified" ? /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => handleVerify(emp.id, "Verified"),
      className: "text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded"
    },
    "Verify \u2713"
  ) : /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => handleVerify(emp.id, "Pending"),
      className: "text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
    },
    "Reset"
  )))))))), ledger && /* @__PURE__ */ React.createElement("div", { className: "bg-slate-900 text-white p-5 rounded-xl shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4 border-b border-slate-800 pb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(Icons.Shield, null), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm" }, "Blockchain Verification Hash Chain (SHA-256)")), /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded font-mono font-bold" }, "Chain Integrity: Verified Authentic")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 max-h-56 overflow-y-auto font-mono text-[11px]" }, ledger.blocks.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.index, className: "p-3 bg-slate-800/80 rounded border border-slate-700" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-blue-400 font-bold" }, /* @__PURE__ */ React.createElement("span", null, "Block #", b.index, ": ", b.entity), /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 font-normal" }, b.timestamp)), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-slate-300 truncate" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, "Tx Hash:"), " ", b.tx_hash), /* @__PURE__ */ React.createElement("div", { className: "text-slate-400 text-[10px] truncate" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-500" }, "Prev Hash:"), " ", b.previous_hash))))), showRegisterModal && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-base" }, "Register Hiring Employer"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mt-0.5" }, "Submits company for GST & placement proof verification"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleRegisterEmployer, className: "mt-4 space-y-3 text-xs" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-semibold text-slate-700 mb-1" }, "Company Name *"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      required: true,
      value: newEmp.company_name,
      onChange: (e) => setNewEmp((prev) => ({ ...prev, company_name: e.target.value })),
      className: "w-full p-2 bg-slate-50 border rounded-lg text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-semibold text-slate-700 mb-1" }, "GST Number (15-digit)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: newEmp.gst_number,
      onChange: (e) => setNewEmp((prev) => ({ ...prev, gst_number: e.target.value })),
      className: "w-full p-2 bg-slate-50 border rounded-lg font-mono text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-semibold text-slate-700 mb-1" }, "Udyam Number"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: newEmp.udyam_number,
      onChange: (e) => setNewEmp((prev) => ({ ...prev, udyam_number: e.target.value })),
      className: "w-full p-2 bg-slate-50 border rounded-lg font-mono text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block font-semibold text-slate-700 mb-1" }, "Contact Person & Email"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      required: true,
      placeholder: "HR Lead Name",
      value: newEmp.contact_person,
      onChange: (e) => setNewEmp((prev) => ({ ...prev, contact_person: e.target.value })),
      className: "w-full p-2 bg-slate-50 border rounded-lg text-slate-800 mb-2"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      required: true,
      placeholder: "careers@company.com",
      value: newEmp.contact_email,
      onChange: (e) => setNewEmp((prev) => ({ ...prev, contact_email: e.target.value })),
      className: "w-full p-2 bg-slate-50 border rounded-lg text-slate-800"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end space-x-2 pt-3" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowRegisterModal(false),
      className: "px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
    },
    "Cancel"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "submit",
      className: "px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
    },
    "Register & Commit Hash"
  ))))));
}
function SelfEmploymentView({ showToast }) {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/employers/self-employment`).then(readResponse).then((d) => setRecords(d)).catch((e) => showToast(e.message, "error"));
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-5 rounded-xl shadow-sm border border-slate-200" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-sm" }, "Self-Employment & Micro-Enterprise Registry"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, "Tracking trainees who established independent businesses, repair shops, and retail ventures ")), /* @__PURE__ */ React.createElement("div", { className: "enterprise-portfolios" }, records.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, className: "enterprise-card" }, /* @__PURE__ */ React.createElement("div", { className: "enterprise-mark" }, /* @__PURE__ */ React.createElement(Icons.SelfEmployment, null), /* @__PURE__ */ React.createElement("span", null, "INDEPENDENT LIVELIHOOD")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded" }, r.trainee_id), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full" }, r.verification_status)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-900 text-sm" }, r.business_name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, r.business_type)), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-slate-50 rounded-lg text-xs space-y-1 font-mono" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 font-sans" }, "Monthly Revenue:"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-800" }, "\u20B9", r.monthly_revenue.toLocaleString(), "/mo")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 font-sans" }, "Udyam No:"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-700" }, r.udyam_reg_number))), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-slate-400 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", null, "Proof: ", r.proof_document_type), /* @__PURE__ */ React.createElement("span", { className: "text-blue-600 font-semibold cursor-pointer" }, "Proof metadata recorded"))))));
}
function AIPredictorView({ showToast }) {
  const [calcParams, setCalcParams] = useState({
    course: "Retail Associate",
    district: "Warangal",
    baseline_wage: 10500,
    age: 21,
    gender: "Female",
    current_milestone: "6M"
  });
  const [prediction, setPrediction] = useState(null);
  const [nlpAnalysis, setNlpAnalysis] = useState(null);
  const runPrediction = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/predict-attrition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(calcParams)
      });
      const data = await readResponse(res);
      setPrediction(data);
    } catch (err) {
      showToast("AI Model evaluation failed", "error");
    }
  };
  useEffect(() => {
    runPrediction();
    fetch(`${API_BASE}/analytics/attrition-nlp`).then(readResponse).then((d) => setNlpAnalysis(d)).catch((e) => showToast(e.message, "error"));
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4 border-b pb-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-sm flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(Icons.AI, null), /* @__PURE__ */ React.createElement("span", null, "AI-Powered Longitudinal Attrition Risk Predictor")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, "Trained Logistic Regression model evaluating dropout/job-loss probability based on wage benchmarks and sectoral mobility"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-6 space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Course"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: calcParams.course,
      onChange: (e) => setCalcParams((prev) => ({ ...prev, course: e.target.value })),
      className: "w-full p-2 bg-slate-50 border rounded-lg text-xs"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Retail Associate" }, "Retail Associate"),
    /* @__PURE__ */ React.createElement("option", { value: "Data Entry Operator" }, "Data Entry Operator"),
    /* @__PURE__ */ React.createElement("option", { value: "Welder" }, "Welder"),
    /* @__PURE__ */ React.createElement("option", { value: "Electrician" }, "Electrician"),
    /* @__PURE__ */ React.createElement("option", { value: "Healthcare Assistant" }, "Healthcare Assistant")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "District"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: calcParams.district,
      onChange: (e) => setCalcParams((prev) => ({ ...prev, district: e.target.value })),
      className: "w-full p-2 bg-slate-50 border rounded-lg text-xs"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Warangal" }, "Warangal"),
    /* @__PURE__ */ React.createElement("option", { value: "Guntur" }, "Guntur"),
    /* @__PURE__ */ React.createElement("option", { value: "Vijayawada" }, "Vijayawada"),
    /* @__PURE__ */ React.createElement("option", { value: "Visakhapatnam" }, "Visakhapatnam"),
    /* @__PURE__ */ React.createElement("option", { value: "Hyderabad" }, "Hyderabad")
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Baseline Salary: \u20B9", calcParams.baseline_wage.toLocaleString()), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min: "8000",
      max: "35000",
      step: "500",
      value: calcParams.baseline_wage,
      onChange: (e) => setCalcParams((prev) => ({ ...prev, baseline_wage: parseFloat(e.target.value) })),
      className: "w-full accent-blue-600"
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-slate-700 mb-1" }, "Age: ", calcParams.age, " yrs"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min: "18",
      max: "35",
      value: calcParams.age,
      onChange: (e) => setCalcParams((prev) => ({ ...prev, age: parseInt(e.target.value) })),
      className: "w-full accent-blue-600"
    }
  ))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: runPrediction,
      className: "w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
    },
    "Evaluate Attrition Risk Score \u26A1"
  )), prediction && /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-6 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold uppercase tracking-wider text-slate-500" }, "Predicted Attrition Risk"), /* @__PURE__ */ React.createElement("span", { className: `px-2.5 py-0.5 rounded-full text-xs font-bold ${prediction.risk_level === "High" ? "bg-rose-100 text-rose-800" : prediction.risk_level === "Medium" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}` }, prediction.risk_level, " Risk Level")), /* @__PURE__ */ React.createElement("div", { className: "mt-3 flex items-baseline space-x-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-4xl font-extrabold text-slate-900" }, prediction.risk_score, "%"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-slate-500" }, "probability of attrition within 12M")), /* @__PURE__ */ React.createElement("div", { className: "mt-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs font-semibold text-slate-700" }, "Key Explainability Signals:"), /* @__PURE__ */ React.createElement("ul", { className: "text-xs text-slate-600 space-y-1" }, prediction.key_risk_factors.map((f, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "flex items-start space-x-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "text-blue-500 font-bold" }, "\u2022"), /* @__PURE__ */ React.createElement("span", null, f)))))), /* @__PURE__ */ React.createElement("div", { className: "mt-4 p-3 bg-blue-100/60 rounded-lg border border-blue-200" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs font-bold text-blue-900 mb-1" }, "Recommended Policy Intervention:"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-blue-800" }, prediction.recommendations[0]))))), nlpAnalysis && /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-slate-200" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-sm mb-1" }, "NLP Text Analysis of Open-Ended Survey Feedback"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500 mb-4" }, nlpAnalysis.actionable_insight), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold text-slate-700 mb-3" }, "Top Keyword Signals Extracted:"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, nlpAnalysis.keywords.map((k, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "text-xs px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-medium" }, k.word, " ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-blue-600 ml-1" }, "(", k.count, ")"))))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("h4", { className: "text-xs font-bold text-slate-700 mb-3" }, "Thematic Clusters:"), Object.entries(nlpAnalysis.clusters).map(([theme, count]) => /* @__PURE__ */ React.createElement("div", { key: theme, className: "flex items-center justify-between text-xs p-2 bg-slate-50 rounded" }, /* @__PURE__ */ React.createElement("span", { className: "text-slate-700 font-medium" }, theme), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-900" }, count, " occurrences")))))));
}
function ComplianceView({ showToast }) {
  const [consentLogs, setConsentLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const fetchLogs = () => {
    fetch(`${API_BASE}/compliance/consent-logs`).then(readResponse).then((d) => setConsentLogs(d)).catch((e) => showToast(e.message, "error"));
    fetch(`${API_BASE}/compliance/audit-logs`).then(readResponse).then((d) => setAuditLogs(d)).catch((e) => showToast(e.message, "error"));
  };
  useEffect(() => {
    fetchLogs();
  }, []);
  const handleVerifyTamper = async (consentId) => {
    try {
      const res = await fetch(`${API_BASE}/compliance/verify-consent-tamper?consent_id=${consentId}`, { method: "POST" });
      const data = await readResponse(res);
      setVerificationResult(data);
      showToast("DPDP Cryptographic Tamper Verification Complete!");
    } catch (err) {
      showToast("Verification failed", "error");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-xl shadow-sm border border-slate-800" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(Icons.Shield, null), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-base" }, "DPDP Act 2023 Consent & Audit Engine")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-300 mt-1" }, "Consent records \u2022 Integrity checks \u2022 Recorded access and modification events")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { className: "px-3 py-1 bg-emerald-900/80 text-emerald-300 text-xs font-bold rounded-full border border-emerald-700" }, "Consent & audit controls")))), verificationResult && /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs font-mono space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-emerald-900 text-sm font-sans" }, "\u2713 Cryptographic Audit Result"), /* @__PURE__ */ React.createElement("div", null, "Trainee: ", verificationResult.trainee_id), /* @__PURE__ */ React.createElement("div", null, "SHA-256 Tamper Hash: ", verificationResult.tamper_hash), /* @__PURE__ */ React.createElement("div", { className: "text-emerald-700 font-bold" }, "Status: ", verificationResult.is_tamper_free ? "Authentic & Untampered" : "Tampered")), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-slate-50 border-b border-slate-200" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-900 text-xs uppercase tracking-wider" }, "Consent record vault \xB7 latest 8 records")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("div", { className: "record-collection consent-cards" }, consentLogs.slice(0, 8).map((c) => /* @__PURE__ */ React.createElement("article", { key: c.id, className: "hover:bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Trainee ID"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, c.trainee_id)), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Consent Version"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, c.consent_version)), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Timestamp"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, new Date(c.timestamp).toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "SHA-256 Tamper Hash"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, c.tamper_hash)), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Integrity Check"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => handleVerifyTamper(c.id),
      className: "font-sans text-xs bg-slate-100 hover:bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded border border-slate-200"
    },
    "Verify Hash \u2197"
  )))))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-slate-50 border-b border-slate-200" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-900 text-xs uppercase tracking-wider" }, "Activity timeline \xB7 latest 10 events")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("div", { className: "record-collection audit-timeline" }, auditLogs.slice(0, 10).map((a) => /* @__PURE__ */ React.createElement("article", { key: a.id, className: "hover:bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Timestamp"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, new Date(a.timestamp).toLocaleTimeString())), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "User & Role"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-800" }, a.user_identity), " (", a.role, ")")), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Action"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, /* @__PURE__ */ React.createElement("span", { className: "font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold text-[10px]" }, a.action))), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Entity"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, a.entity_type)), /* @__PURE__ */ React.createElement("div", { className: "record-field" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, "Details"), /* @__PURE__ */ React.createElement("div", { className: "field-value" }, a.details))))))));
}
function TraineeDetailModal({ trainee, onClose, showToast, onUpdate }) {
  const [botLogs, setBotLogs] = useState([]);
  useEffect(() => {
    fetch(`${API_BASE}/bot/logs/${trainee.id}`).then(readResponse).then((d) => setBotLogs(d)).catch((e) => showToast(e.message, "error"));
  }, [trainee.id]);
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between border-b pb-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded" }, trainee.id), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-slate-900 text-lg" }, trainee.name)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-slate-500" }, trainee.course, " \u2022 ", trainee.district)), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
    },
    "\u2715"
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-3 text-center text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-slate-50 rounded-lg border border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "text-slate-400 text-[10px]" }, "Employment Status"), /* @__PURE__ */ React.createElement("div", { className: "font-bold text-slate-900 mt-1" }, trainee.employment_status)), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-slate-50 rounded-lg border border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "text-slate-400 text-[10px]" }, "Current Salary"), /* @__PURE__ */ React.createElement("div", { className: "font-bold text-emerald-600 mt-1" }, "\u20B9", trainee.current_wage.toLocaleString(), "/mo")), /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-slate-50 rounded-lg border border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "text-slate-400 text-[10px]" }, "AI Attrition Risk"), /* @__PURE__ */ React.createElement("div", { className: "font-bold text-blue-600 mt-1" }, trainee.ai_attrition_risk_score, "% (", trainee.ai_risk_level, ")"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-900 text-xs uppercase tracking-wider mb-3" }, "Longitudinal Outcome Timeline"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-4 gap-2 text-center text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-blue-50 border border-blue-200 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-blue-600 font-bold" }, "Month 0 (Intake)"), /* @__PURE__ */ React.createElement("div", { className: "font-extrabold text-slate-800 mt-1" }, "\u20B9", trainee.baseline_wage.toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-blue-50 border border-blue-200 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-blue-600 font-bold" }, "Month 3"), /* @__PURE__ */ React.createElement("div", { className: "font-extrabold text-slate-800 mt-1" }, "\u20B9", trainee.wage_m3.toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-blue-50 border border-blue-200 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-blue-600 font-bold" }, "Month 6"), /* @__PURE__ */ React.createElement("div", { className: "font-extrabold text-slate-800 mt-1" }, "\u20B9", trainee.wage_m6.toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-emerald-700 font-bold" }, "Month 12"), /* @__PURE__ */ React.createElement("div", { className: "font-extrabold text-emerald-800 mt-1" }, "\u20B9", trainee.wage_m12.toLocaleString())))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-slate-900 text-xs uppercase tracking-wider mb-2" }, "Automated Check-in Transcripts"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 max-h-40 overflow-y-auto" }, botLogs.map((l) => /* @__PURE__ */ React.createElement("div", { key: l.id, className: "p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1" }, /* @__PURE__ */ React.createElement("span", null, "Milestone: ", l.milestone, " (", l.channel, ")"), /* @__PURE__ */ React.createElement("span", { className: "text-slate-400 font-normal" }, new Date(l.sent_timestamp).toLocaleDateString())), /* @__PURE__ */ React.createElement("p", { className: "text-slate-600 text-[11px] font-mono whitespace-pre-wrap" }, l.raw_chat_log))))), /* @__PURE__ */ React.createElement("div", { className: "p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-bold" }, "DPDP Act 2023 Consent Certificate"), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-emerald-700" }, "Timestamp: ", new Date(trainee.consent_timestamp).toLocaleString())), /* @__PURE__ */ React.createElement("span", { className: "bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold" }, "AES-256 Verified"))));
}
const money = (value) => "\u20B9" + Number(value || 0).toLocaleString("en-IN");
const number = (value) => Number(value || 0).toLocaleString("en-IN");
const palette = ["#315d4b", "#bc733f", "#847093", "#ba5b62", "#658a91", "#a99c52"];
const sections = [
  { id: "dashboard", label: "Impact Overview", icon: "Dashboard", group: "OVERVIEW", subtitle: "A clearer view of skills, livelihoods and lasting progress." },
  { id: "trainees", label: "Learner Directory", icon: "Trainees", group: "", subtitle: "Every learner. Every milestone. One connected record." },
  { id: "onboarding", label: "Enrolment Desk", icon: "Onboarding", group: "OPERATIONS", subtitle: "Start a verified, consent-based learning journey." },
  { id: "bot", label: "Outreach Studio", icon: "Bot", group: "", subtitle: "Keep the conversation going beyond certification." },
  { id: "employers", label: "Employer Connect", icon: "Employer", group: "", subtitle: "Verify opportunities and strengthen placement confidence." },
  { id: "self_employment", label: "Enterprise Pathways", icon: "SelfEmployment", group: "", subtitle: "Recognise the livelihoods created through self-employment." },
  { id: "ai_predictor", label: "Insights Lab", icon: "AI", group: "INTELLIGENCE", subtitle: "Understand risk factors and identify timely interventions." },
  { id: "compliance", label: "Trust & Consent", icon: "Compliance", group: "", subtitle: "Review consent records, audit events and data integrity." },
  { id: "reports", label: "Evidence Centre", icon: "Reports", group: "", subtitle: "Turn outcome records into evidence for decisions." }
];
async function readResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.detail === "string" ? body.detail : "Request failed (" + response.status + ")");
  }
  return response.json();
}
const getJSON = (path, signal) => fetch(API_BASE + path, { signal }).then(readResponse);
function Icon({ name, ...props }) {
  const C = Icons[name] || Icons.Dashboard;
  return /* @__PURE__ */ React.createElement("span", { ...props }, /* @__PURE__ */ React.createElement(C, null));
}
function Sparkline({ values, color = "#22766e" }) {
  const nums = values.map((v) => Number(v) || 0), max = Math.max(...nums, 1), min = Math.min(...nums, 0);
  const points = nums.map((v, i) => `${i * 104 / Math.max(nums.length - 1, 1) + 3},${31 - (v - min) / (max - min || 1) * 26}`).join(" ");
  return /* @__PURE__ */ React.createElement("svg", { className: "sparkline", viewBox: "0 0 110 36", role: "img", "aria-label": "Wages: " + nums.map(money).join(", ") }, /* @__PURE__ */ React.createElement("polyline", { points, fill: "none", stroke: color, strokeWidth: "2.5", strokeLinejoin: "round" }), nums.map((v, i) => /* @__PURE__ */ React.createElement("circle", { key: i, cx: i * 104 / Math.max(nums.length - 1, 1) + 3, cy: 31 - (v - min) / (max - min || 1) * 26, r: "2.5", fill: color })));
}
function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [role, setRole] = useState("Admin");
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState(null), [trainees, setTrainees] = useState([]);
  const [totalTrainees, setTotalTrainees] = useState(0), [currentPage, setCurrentPage] = useState(1), [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ course: "All", provider: "All", district: "All", status: "All", remedialOnly: false, search: "" });
  const [selectedTrainee, setSelectedTrainee] = useState(null), [toasts, setToasts] = useState([]);
  const [failure, setFailure] = useState(""), [busy, setBusy] = useState(false), [revision, setRevision] = useState(0);
  const [query, setQuery] = useState("");
  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((v) => [...v, { id, message, type }]);
    setTimeout(() => setToasts((v) => v.filter((t) => t.id !== id)), 4500);
  };
  const navigate = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const refresh = () => setRevision((n) => n + 1);
  const changeFilters = (value) => {
    setCurrentPage(1);
    setFilters(value);
  };
  useEffect(() => {
    const controller = new AbortController();
    setBusy(true);
    setFailure("");
    const params = new URLSearchParams();
    ["course", "provider", "district"].forEach((k) => {
      if (filters[k] !== "All") params.set(k, filters[k]);
    });
    getJSON("/outcomes/dashboard-stats?" + params, controller.signal).then(setStats).catch((e) => {
      if (e.name !== "AbortError") setFailure(e.message);
    }).finally(() => {
      if (!controller.signal.aborted) setBusy(false);
    });
    return () => controller.abort();
  }, [filters.course, filters.provider, filters.district, revision]);
  useEffect(() => {
    const controller = new AbortController(), params = new URLSearchParams({ page: currentPage, page_size: 12 });
    ["course", "provider", "district", "status"].forEach((k) => {
      if (filters[k] !== "All") params.set(k, filters[k]);
    });
    if (filters.search) params.set("search", filters.search);
    if (filters.remedialOnly) params.set("remedial_only", "true");
    getJSON("/trainees?" + params, controller.signal).then((d) => {
      setTrainees(d.items || []);
      setTotalTrainees(d.total || 0);
      setTotalPages(d.total_pages || 1);
    }).catch((e) => {
      if (e.name !== "AbortError") setFailure(e.message);
    });
    return () => controller.abort();
  }, [filters, currentPage, revision]);
  const selectTrainee = async (t) => {
    try {
      setSelectedTrainee(await getJSON("/trainees/" + encodeURIComponent(typeof t === "string" ? t : t.id)));
    } catch (e) {
      showToast(e.message, "error");
    }
  };
  const page = sections.find((s) => s.id === activeTab);
  return /* @__PURE__ */ React.createElement("div", { className: "portal" }, menuOpen && /* @__PURE__ */ React.createElement("button", { "aria-label": "Close menu", className: "sidebar-scrim", onClick: () => setMenuOpen(false) }), /* @__PURE__ */ React.createElement("aside", { className: "portal-sidebar " + (menuOpen ? "is-open" : "") }, /* @__PURE__ */ React.createElement("div", { className: "republic" }, /* @__PURE__ */ React.createElement("img", { src: "/static/assets/satyamev-jayate.jpg", alt: "National Emblem of India, Satyamev Jayate" }), /* @__PURE__ */ React.createElement("strong", null, "\u092D\u093E\u0930\u0924 \u0938\u0930\u0915\u093E\u0930"), /* @__PURE__ */ React.createElement("span", null, "Government of India")), /* @__PURE__ */ React.createElement("nav", { "aria-label": "Main navigation" }, sections.map((s) => /* @__PURE__ */ React.createElement(React.Fragment, { key: s.id }, s.group && /* @__PURE__ */ React.createElement("div", { className: "nav-group" }, s.group), /* @__PURE__ */ React.createElement("button", { "aria-current": activeTab === s.id ? "page" : void 0, onClick: () => navigate(s.id), className: "portal-nav " + (activeTab === s.id ? "selected" : "") }, /* @__PURE__ */ React.createElement(Icon, { name: s.icon }), /* @__PURE__ */ React.createElement("span", null, s.label), activeTab === s.id && /* @__PURE__ */ React.createElement("i", null))))), /* @__PURE__ */ React.createElement("div", { className: "sidebar-bottom" }, /* @__PURE__ */ React.createElement("span", { className: "mini-tricolour" }), /* @__PURE__ */ React.createElement("strong", null, "Measure impact."), /* @__PURE__ */ React.createElement("span", null, "Not just participation."), /* @__PURE__ */ React.createElement("small", null, "Government evaluator prototype"))), /* @__PURE__ */ React.createElement("div", { className: "portal-body" }, /* @__PURE__ */ React.createElement("div", { className: "national-strip" }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null)), /* @__PURE__ */ React.createElement("header", { className: "portal-header" }, /* @__PURE__ */ React.createElement("button", { className: "menu-toggle", onClick: () => setMenuOpen((v) => !v), "aria-label": "Toggle navigation" }, "\u2630"), /* @__PURE__ */ React.createElement("button", { className: "brand", onClick: () => navigate("dashboard") }, /* @__PURE__ */ React.createElement("img", { src: "/static/assets/udyam-logo.jpeg", alt: "\u0909\u0926\u094D\u092F\u092E Track project logo" }), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, "\u0909\u0926\u094D\u092F\u092E ", /* @__PURE__ */ React.createElement("b", null, "Track")), /* @__PURE__ */ React.createElement("small", null, "From Training Records to Livelihood Intelligence"))), /* @__PURE__ */ React.createElement("form", { className: "global-search", onSubmit: (e) => {
    e.preventDefault();
    changeFilters((v) => ({ ...v, search: query }));
    navigate("trainees");
  } }, /* @__PURE__ */ React.createElement(Icon, { name: "Search" }), /* @__PURE__ */ React.createElement("input", { "aria-label": "Search learners", placeholder: "Search learners, IDs or employers\u2026", value: query, onChange: (e) => setQuery(e.target.value) }), /* @__PURE__ */ React.createElement("button", { type: "submit", "aria-label": "Search" }, "\u2197")), /* @__PURE__ */ React.createElement("div", { className: "profile" }, /* @__PURE__ */ React.createElement("span", { className: "profile-avatar" }, role === "Admin" ? "A" : role === "Training Provider" ? "P" : "E"), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("small", null, "DEMO PERSPECTIVE"), /* @__PURE__ */ React.createElement("select", { "aria-label": "View perspective", value: role, onChange: (e) => {
    setRole(e.target.value);
    showToast("Perspective: " + e.target.value + " (demo)");
  } }, /* @__PURE__ */ React.createElement("option", null, "Admin"), /* @__PURE__ */ React.createElement("option", null, "Training Provider"), /* @__PURE__ */ React.createElement("option", null, "Employer"))))), /* @__PURE__ */ React.createElement("main", { className: "portal-main page-" + activeTab }, /* @__PURE__ */ React.createElement("div", { className: "breadcrumb" }, "\u0909\u0926\u094D\u092F\u092E Track ", /* @__PURE__ */ React.createElement("span", null, "/"), " ", page.label, /* @__PURE__ */ React.createElement("span", { className: "sync-state" }, /* @__PURE__ */ React.createElement("i", { className: failure ? "offline" : "" }), failure ? "Connection issue" : busy ? "Refreshing\u2026" : "Connected to outcome data")), failure && /* @__PURE__ */ React.createElement("div", { className: "error-banner", role: "alert" }, failure, /* @__PURE__ */ React.createElement("button", { onClick: refresh }, "Retry connection")), activeTab !== "dashboard" && /* @__PURE__ */ React.createElement("div", { className: "page-heading" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, "OUTCOME MONITORING PORTAL"), /* @__PURE__ */ React.createElement("h1", null, page.label), /* @__PURE__ */ React.createElement("p", null, page.subtitle)), /* @__PURE__ */ React.createElement("button", { className: "quiet-button", onClick: refresh }, "\u21BB Refresh data")), activeTab === "dashboard" && /* @__PURE__ */ React.createElement(ImpactDashboard, { stats, filters, setFilters: changeFilters, navigate, refresh, revision }), activeTab === "trainees" && /* @__PURE__ */ React.createElement(TraineesView, { trainees, totalTrainees, currentPage, totalPages, setCurrentPage, filters, setFilters: changeFilters, onSelectTrainee: selectTrainee, showToast, refreshTrainees: refresh }), activeTab === "onboarding" && /* @__PURE__ */ React.createElement(OnboardingWizardView, { showToast, onSuccess: () => {
    refresh();
    navigate("trainees");
  } }), activeTab === "bot" && /* @__PURE__ */ React.createElement(BotSimulatorView, { trainees, showToast, refreshData: refresh }), activeTab === "employers" && /* @__PURE__ */ React.createElement(EmployersView, { showToast }), activeTab === "self_employment" && /* @__PURE__ */ React.createElement(SelfEmploymentView, { showToast }), activeTab === "ai_predictor" && /* @__PURE__ */ React.createElement(AIPredictorView, { showToast }), activeTab === "compliance" && /* @__PURE__ */ React.createElement(ComplianceView, { showToast }), activeTab === "reports" && /* @__PURE__ */ React.createElement(ReportsView, { stats, showToast }), /* @__PURE__ */ React.createElement("footer", { className: "portal-footer" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "\u0909\u0926\u094D\u092F\u092E Track"), /* @__PURE__ */ React.createElement("span", null, "From Training Records to Livelihood Intelligence"), /* @__PURE__ */ React.createElement("small", null, "Government evaluator prototype \xB7 Demonstration data")), /* @__PURE__ */ React.createElement("div", { className: "team-credit" }, /* @__PURE__ */ React.createElement("span", null, "Presented by Team Manthan EK SOACH"), /* @__PURE__ */ React.createElement("img", { src: "/static/assets/manthan logo.png", alt: "MANTHAN" })), /* @__PURE__ */ React.createElement("a", { href: "/docs", target: "_blank", rel: "noreferrer" }, "API documentation \u2197")))), selectedTrainee && /* @__PURE__ */ React.createElement(TraineeDetailModal, { trainee: selectedTrainee, onClose: () => setSelectedTrainee(null), showToast, onUpdate: () => {
    refresh();
    selectTrainee(selectedTrainee);
  } }), /* @__PURE__ */ React.createElement("div", { className: "portal-toasts", role: "status" }, toasts.map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, className: "toast " + t.type }, t.message))));
}
function ImpactDashboard({ stats, filters, setFilters, navigate, refresh, revision }) {
  const [data, setData] = useState(null), [error, setError] = useState(""), [journey, setJourney] = useState(0);
  useEffect(() => {
    const ctrl = new AbortController();
    setError("");
    Promise.all(["course-placement", "wage-progression", "status-breakdown", "district-distribution", "attrition-breakdown"].map((p) => getJSON("/outcomes/" + p, ctrl.signal))).then(([courses, wages, status, districts, attrition]) => setData({ courses, wages, status, districts, attrition })).catch((e) => {
      if (e.name !== "AbortError") setError(e.message);
    });
    return () => ctrl.abort();
  }, [revision]);
  const s = stats, scope = filters.course !== "All" || filters.provider !== "All" || filters.district !== "All";
  const milestones = s ? [
    { label: "Training", value: number(s.total_trainees), unit: "learners evaluated", description: "The starting point: consent-based learner records linked to training, course and provider information.", action: "Explore learner records", target: "trainees", icon: "Trainees" },
    { label: "Employment", value: number(s.placed_count + s.self_employed_count), unit: "earning livelihoods", description: `${number(s.placed_count)} wage-employed learners and ${number(s.self_employed_count)} self-employed learners in the selected cohort.`, action: "Explore enterprise pathways", target: "self_employment", icon: "Employer" },
    { label: "Retention", value: s.retention_rate_pct + "%", unit: "retained across the cohort", description: "The share of all evaluated learner records marked as retained by the backend, including its existing denominator.", action: "View learner timelines", target: "trainees", icon: "Compliance" },
    { label: "Wage growth", value: (s.wage_growth_pct >= 0 ? "+" : "") + s.wage_growth_pct + "%", unit: "average wage progression", description: `${money(s.avg_baseline_wage)} baseline \u2192 ${money(s.avg_current_wage)} current average wage for earning learners with a recorded baseline.`, action: "Open evidence centre", target: "reports", icon: "TrendingUp" }
  ] : [];
  return /* @__PURE__ */ React.createElement("div", { className: "impact-dashboard" }, /* @__PURE__ */ React.createElement("section", { className: "hero" }, /* @__PURE__ */ React.createElement("div", { className: "hero-copy" }, /* @__PURE__ */ React.createElement("div", { className: "hero-kicker" }, /* @__PURE__ */ React.createElement("span", { className: "mini-tricolour" }), " OUTCOMES THAT MATTER"), /* @__PURE__ */ React.createElement("h1", null, "Udyam Bharat,", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", null, "Prabal Bharat.")), /* @__PURE__ */ React.createElement("p", null, "Real outcomes. Real opportunities. Lasting impact."), /* @__PURE__ */ React.createElement("div", { className: "system-caption" }, "AI-Powered Longitudinal Outcome & Omnichannel Impact Measurement System"), /* @__PURE__ */ React.createElement("blockquote", null, "\u201CEvery skill is a beginning. Every livelihood is progress.\u201D", /* @__PURE__ */ React.createElement("cite", null, "THE \u0909\u0926\u094D\u092F\u092E TRACK VISION"))), /* @__PURE__ */ React.createElement(DashboardCarousel, null)), /* @__PURE__ */ React.createElement("div", { className: "cohort-toolbar" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Icon, { name: "Compliance" }), " Cohort lens"), /* @__PURE__ */ React.createElement("select", { "aria-label": "Dashboard course", value: filters.course, onChange: (e) => setFilters((v) => ({ ...v, course: e.target.value })) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All courses"), ["Electrician", "Welder", "Data Entry Operator", "Retail Associate", "Healthcare Assistant"].map((v) => /* @__PURE__ */ React.createElement("option", { key: v }, v))), /* @__PURE__ */ React.createElement("select", { "aria-label": "Dashboard district", value: filters.district, onChange: (e) => setFilters((v) => ({ ...v, district: e.target.value })) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All districts"), ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Warangal"].map((v) => /* @__PURE__ */ React.createElement("option", { key: v }, v))), /* @__PURE__ */ React.createElement("select", { "aria-label": "Dashboard provider", value: filters.provider, onChange: (e) => setFilters((v) => ({ ...v, provider: e.target.value })) }, /* @__PURE__ */ React.createElement("option", { value: "All" }, "All providers"), ["National Skill Training Institute (NSTI)", "Apex Vocational Academy", "Pradhan Mantri Kaushal Kendra (PMKK)", "Telangana Skill Development Mission (TSDM)", "Andhra Pradesh State Skill Development (APSSDC)"].map((v) => /* @__PURE__ */ React.createElement("option", { key: v }, v))), /* @__PURE__ */ React.createElement("button", { className: "quiet-button", onClick: () => {
    setFilters((v) => ({ ...v, course: "All", district: "All", provider: "All" }));
    refresh();
  } }, "\u21BB Reset")), !s ? /* @__PURE__ */ React.createElement("div", { className: "loading-panel" }, "Connecting to your outcome records\u2026") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "metric-strip", "aria-label": "Key outcome indicators" }, /* @__PURE__ */ React.createElement(Metric, { label: "Learners evaluated", value: number(s.total_trainees), note: "Selected cohort", icon: "Trainees", color: "violet" }), /* @__PURE__ */ React.createElement(Metric, { label: "Wage placement", value: s.placed_pct + "%", note: number(s.placed_count) + " learners placed", icon: "Employer", color: "teal" }), /* @__PURE__ */ React.createElement(Metric, { label: "Retention rate", value: s.retention_rate_pct + "%", note: "Share of all evaluated learners", icon: "Compliance", color: "amber" }), /* @__PURE__ */ React.createElement(Metric, { label: "Wage progression", value: (s.wage_growth_pct >= 0 ? "+" : "") + s.wage_growth_pct + "%", note: money(s.avg_baseline_wage) + " \u2192 " + money(s.avg_current_wage), icon: "TrendingUp", color: "rose" })), /* @__PURE__ */ React.createElement("section", { className: "journey-card" }, /* @__PURE__ */ React.createElement("div", { className: "journey-main" }, /* @__PURE__ */ React.createElement("div", { className: "card-top" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, "FROM PARTICIPATION TO PROGRESS"), /* @__PURE__ */ React.createElement("h2", null, "The Livelihood Journey")), /* @__PURE__ */ React.createElement("span", { className: "small-tag" }, "INTERACTIVE VIEW")), /* @__PURE__ */ React.createElement("div", { className: "journey-stages", role: "tablist", "aria-label": "Livelihood stages" }, milestones.map((m, i) => /* @__PURE__ */ React.createElement("button", { key: m.label, role: "tab", "aria-selected": journey === i, className: journey === i ? "active" : "", onClick: () => setJourney(i) }, /* @__PURE__ */ React.createElement("span", { className: "stage-number" }, "0", i + 1), /* @__PURE__ */ React.createElement("strong", null, m.label), /* @__PURE__ */ React.createElement("small", null, m.value)))), /* @__PURE__ */ React.createElement("p", { className: "journey-caption" }, "One connected story, from a first skill to a sustained livelihood.")), /* @__PURE__ */ React.createElement("div", { className: "journey-detail", role: "tabpanel" }, /* @__PURE__ */ React.createElement(Icon, { name: milestones[journey].icon }), /* @__PURE__ */ React.createElement("strong", null, milestones[journey].value), /* @__PURE__ */ React.createElement("span", null, milestones[journey].unit), /* @__PURE__ */ React.createElement("p", null, milestones[journey].description), /* @__PURE__ */ React.createElement("button", { onClick: () => navigate(milestones[journey].target) }, milestones[journey].action, " \u2197")))), error && /* @__PURE__ */ React.createElement("div", { className: "error-banner" }, error, /* @__PURE__ */ React.createElement("button", { onClick: refresh }, "Retry charts")), data && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "section-label" }, /* @__PURE__ */ React.createElement("h2", null, "Outcome intelligence"), /* @__PURE__ */ React.createElement("span", null, "Charts show all cohorts", scope ? " \xB7 KPI cards above reflect your filters" : "")), /* @__PURE__ */ React.createElement("div", { className: "chart-row" }, /* @__PURE__ */ React.createElement("section", { className: "panel wage-panel" }, /* @__PURE__ */ React.createElement(PanelTitle, { title: "Income, over time", subtitle: "Average wages at recorded follow-up milestones", tag: "M0 \u2192 M12" }), /* @__PURE__ */ React.createElement(WageChart, { timeline: data.wages.overall_timeline }), /* @__PURE__ */ React.createElement("div", { className: "chart-foot" }, /* @__PURE__ */ React.createElement("span", { className: "legend-dot teal" }), "Average monthly income ", /* @__PURE__ */ React.createElement("span", null, "All earning learners with a baseline"))), /* @__PURE__ */ React.createElement("section", { className: "panel distribution-panel" }, /* @__PURE__ */ React.createElement(PanelTitle, { title: "Pathways to livelihood", subtitle: "Employment status across your complete dataset" }), /* @__PURE__ */ React.createElement(StatusDonut, { rows: data.status }))), /* @__PURE__ */ React.createElement("div", { className: "chart-row secondary" }, /* @__PURE__ */ React.createElement("section", { className: "panel" }, /* @__PURE__ */ React.createElement(PanelTitle, { title: "Skills that open doors", subtitle: "Earning outcomes by course \xB7 wage + self-employment", tag: "COURSE VIEW" }), /* @__PURE__ */ React.createElement("div", { className: "course-bars" }, data.courses.map((c, i) => /* @__PURE__ */ React.createElement("div", { className: "course-row", key: c.course }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, c.course), /* @__PURE__ */ React.createElement("span", null, c.placement_rate, "%")), /* @__PURE__ */ React.createElement("div", { className: "bar-track" }, /* @__PURE__ */ React.createElement("i", { style: { width: c.placement_rate + "%", background: palette[i % palette.length] } })), /* @__PURE__ */ React.createElement("small", null, number(c.total), " learners ", /* @__PURE__ */ React.createElement("span", null, "Avg. ", money(c.avg_wage), "/mo")))))), /* @__PURE__ */ React.createElement("section", { className: "panel" }, /* @__PURE__ */ React.createElement(PanelTitle, { title: "District pulse", subtitle: "Earning outcomes in the backend's recorded districts", tag: "REGIONAL VIEW" }), /* @__PURE__ */ React.createElement("div", { className: "district-list" }, data.districts.map((d, i) => /* @__PURE__ */ React.createElement("button", { key: d.district, onClick: () => {
    setFilters((v) => ({ ...v, district: d.district }));
    navigate("trainees");
  } }, /* @__PURE__ */ React.createElement("span", { className: "district-rank" }, "0", i + 1), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, d.district), /* @__PURE__ */ React.createElement("small", null, number(d.total), " learners \xB7 ", money(d.avg_wage), " avg. wage"), /* @__PURE__ */ React.createElement("div", { className: "bar-track" }, /* @__PURE__ */ React.createElement("i", { style: { width: d.placement_rate + "%", background: palette[i % palette.length] } }))), /* @__PURE__ */ React.createElement("b", null, d.placement_rate, "%", /* @__PURE__ */ React.createElement("small", null, "earning"))))))), /* @__PURE__ */ React.createElement("div", { className: "chart-row final-row" }, /* @__PURE__ */ React.createElement("section", { className: "panel" }, /* @__PURE__ */ React.createElement(PanelTitle, { title: "Listen. Understand. Intervene.", subtitle: "Reported reasons for attrition" }), /* @__PURE__ */ React.createElement("div", { className: "reason-grid" }, data.attrition.length ? data.attrition.map((a, i) => /* @__PURE__ */ React.createElement("div", { key: a.reason }, /* @__PURE__ */ React.createElement("i", { style: { background: palette[i % palette.length] } }), /* @__PURE__ */ React.createElement("span", null, a.reason), /* @__PURE__ */ React.createElement("strong", null, a.count))) : /* @__PURE__ */ React.createElement("p", null, "No attrition reasons recorded."))), /* @__PURE__ */ React.createElement("section", { className: "action-card" }, /* @__PURE__ */ React.createElement(Icon, { name: "Shield" }), /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, "TURN EVIDENCE INTO ACTION"), /* @__PURE__ */ React.createElement("h2", null, s ? number(s.remedial_count) : "\u2014", " learners.", /* @__PURE__ */ React.createElement("br", null), "A chance to change their story."), /* @__PURE__ */ React.createElement("p", null, "Review flagged cases and plan the next support step."), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setFilters((v) => ({ ...v, remedialOnly: true }));
    navigate("trainees");
  } }, "Open intervention queue ", /* @__PURE__ */ React.createElement("span", null, "\u2197"))))));
}
function ReportsView({ showToast }) {
  const [report, setReport] = useState(null), [error, setError] = useState(""), [downloading, setDownloading] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    getJSON("/reports/cohort-summary", controller.signal).then(setReport).catch((e) => {
      if (e.name !== "AbortError") setError(e.message);
    });
    return () => controller.abort();
  }, []);
  const download = async () => {
    setDownloading(true);
    try {
      const res = await fetch(API_BASE + "/reports/export-csv");
      if (!res.ok) throw Error("Export failed");
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = "Udyam_Track_Outcomes.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1e3);
      showToast("Outcome records exported.");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setDownloading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "report-actions no-print" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "Evidence, ready to share."), /* @__PURE__ */ React.createElement("p", null, "A current summary generated from your backend records.")), /* @__PURE__ */ React.createElement("button", { className: "quiet-button", disabled: downloading, onClick: download }, downloading ? "Preparing\u2026" : "\u2193 Export all records"), /* @__PURE__ */ React.createElement("button", { className: "primary-button", disabled: !report, onClick: () => window.print() }, "Print / Save as PDF")), error && /* @__PURE__ */ React.createElement("div", { className: "error-banner" }, error), !report && !error && /* @__PURE__ */ React.createElement("div", { className: "loading-panel" }, "Preparing the cohort summary\u2026"), report && /* @__PURE__ */ React.createElement("article", { className: "report-page print-container" }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("img", { src: "/static/assets/udyam-logo.jpeg", alt: "\u0909\u0926\u094D\u092F\u092E Track" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, "\u0909\u0926\u094D\u092F\u092E TRACK \xB7 EVALUATOR PREVIEW"), /* @__PURE__ */ React.createElement("h2", null, "Longitudinal Outcome Summary"), /* @__PURE__ */ React.createElement("p", null, report.cohort, " \xB7 ", report.generated_at))), /* @__PURE__ */ React.createElement("div", { className: "report-metrics" }, [["Evaluated learners", number(report.summary.total_evaluated)], ["Earning livelihoods", report.summary.overall_placement_rate], ["Wage employment", report.summary.wage_employment_share], ["Self-employment", report.summary.self_employment_share]].map(([label, val]) => /* @__PURE__ */ React.createElement("div", { key: label }, /* @__PURE__ */ React.createElement("small", null, label), /* @__PURE__ */ React.createElement("strong", null, val)))), /* @__PURE__ */ React.createElement("h3", null, "Income & opportunity"), /* @__PURE__ */ React.createElement("div", { className: "report-facts" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Average entry wage"), /* @__PURE__ */ React.createElement("strong", null, report.summary.avg_entry_wage)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Average 12-month wage"), /* @__PURE__ */ React.createElement("strong", null, report.summary.avg_12m_wage)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Net wage progression"), /* @__PURE__ */ React.createElement("strong", null, report.summary.net_wage_progression)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Seeking employment"), /* @__PURE__ */ React.createElement("strong", null, report.summary.unemployment_share)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, "Remedial interventions flagged"), /* @__PURE__ */ React.createElement("strong", null, number(report.summary.remedial_intervention_count)))), /* @__PURE__ */ React.createElement("aside", null, "Measure impact, not just participation."), /* @__PURE__ */ React.createElement("p", { className: "report-note" }, "Source: cohort summary API \xB7 Full dataset, independent of dashboard filters. Earning livelihoods combines wage employment and self-employment. This is a project demonstration report, not an issued government certificate.")));
}
function DashboardCarousel() {
  const slides = [{ src: "skills-banner.png", alt: "Training, experience and knowledge build skills", title: "The foundation of opportunity", subtitle: "Learning today. Livelihoods tomorrow." }, { src: "skill-india.jpg", alt: "Directorate General of Training, Skill India and Ministry of Skill Development and Entrepreneurship", title: "Skills for a stronger India", subtitle: "Training \u2192 Employment \u2192 Lasting progress" }, { src: "kaushal.jpg", alt: "Kaushalyam Balam skill development emblem", title: "\u0915\u094C\u0936\u0932\u094D\u092F\u092E\u094D \u092C\u0932\u092E\u094D", subtitle: "Skill is strength." }];
  const [index, setIndex] = useState(0), [paused, setPaused] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches), [hover, setHover] = useState(false);
  useEffect(() => {
    if (paused || hover) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [paused, hover]);
  return /* @__PURE__ */ React.createElement("section", { className: "hero-gallery", "aria-label": "Skill development highlights", "aria-roledescription": "carousel", onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onFocusCapture: () => setHover(true), onBlurCapture: (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setHover(false);
  } }, /* @__PURE__ */ React.createElement("div", { className: "gallery-images" }, slides.map((s, i) => /* @__PURE__ */ React.createElement("img", { key: s.src, src: "/static/assets/" + s.src, alt: s.alt, "aria-hidden": i !== index, className: (i === index ? "visible " : "") + (i === 0 ? "cover" : "contain") }))), /* @__PURE__ */ React.createElement("div", { className: "gallery-caption" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("small", null, "SKILLING / ", String(index + 1).padStart(2, "0")), /* @__PURE__ */ React.createElement("h2", null, slides[index].title), /* @__PURE__ */ React.createElement("p", null, slides[index].subtitle)), /* @__PURE__ */ React.createElement("div", { className: "gallery-controls" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIndex((i) => (i + slides.length - 1) % slides.length), "aria-label": "Previous slide" }, "\u2190"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPaused((v) => !v), "aria-label": paused ? "Play slideshow" : "Pause slideshow" }, paused ? "\u25B6" : "\u2161"), /* @__PURE__ */ React.createElement("button", { onClick: () => setIndex((i) => (i + 1) % slides.length), "aria-label": "Next slide" }, "\u2192"))), /* @__PURE__ */ React.createElement("div", { className: "gallery-dots" }, slides.map((s, i) => /* @__PURE__ */ React.createElement("button", { key: s.src, "aria-label": "Show slide " + (i + 1), "aria-pressed": index === i, onClick: () => setIndex(i) }))));
}
function Metric({ label, value, note, icon, color }) {
  return /* @__PURE__ */ React.createElement("article", { className: "metric-card " + color }, /* @__PURE__ */ React.createElement("span", { className: "metric-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: icon })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", null, label), /* @__PURE__ */ React.createElement("strong", null, value), /* @__PURE__ */ React.createElement("small", null, note)));
}
function PanelTitle({ title, subtitle, tag }) {
  return /* @__PURE__ */ React.createElement("div", { className: "panel-title" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, title), /* @__PURE__ */ React.createElement("p", null, subtitle)), tag && /* @__PURE__ */ React.createElement("span", { className: "small-tag" }, tag));
}
function WageChart({ timeline = [] }) {
  if (!timeline.length) return /* @__PURE__ */ React.createElement("p", { className: "empty-state" }, "No wage observations yet.");
  const max = Math.max(...timeline.map((t) => t.average_wage), 1) * 1.2;
  const x = (i) => 65 + i * 500 / Math.max(timeline.length - 1, 1), y = (v) => 205 - v / max * 165;
  const points = timeline.map((t, i) => x(i) + "," + y(t.average_wage)).join(" ");
  return /* @__PURE__ */ React.createElement("svg", { className: "wage-chart", viewBox: "0 0 610 265", role: "img", "aria-label": "Average wage progression" }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "wageFill", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "#2e8c85", stopOpacity: ".2" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "#2e8c85", stopOpacity: ".01" }))), [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: "65", x2: "565", y1: 205 - i * 55, y2: 205 - i * 55, stroke: "#dee8eb", strokeDasharray: "3 5" }), /* @__PURE__ */ React.createElement("text", { x: "49", y: 209 - i * 55, textAnchor: "end" }, Math.round(max * i / 3 / 1e3), "k"))), /* @__PURE__ */ React.createElement("polygon", { points: "65,205 " + points + " 565,205", fill: "url(#wageFill)" }), /* @__PURE__ */ React.createElement("polyline", { points, fill: "none", stroke: "#22766e", strokeWidth: "3.5", strokeLinecap: "round", strokeLinejoin: "round" }), timeline.map((t, i) => /* @__PURE__ */ React.createElement("g", { key: t.short }, /* @__PURE__ */ React.createElement("circle", { cx: x(i), cy: y(t.average_wage), r: "5", stroke: "#22766e", strokeWidth: "2.5", fill: "#fff" }), /* @__PURE__ */ React.createElement("text", { x: x(i), y: y(t.average_wage) - 15, textAnchor: "middle", className: "value-label" }, money(t.average_wage)), /* @__PURE__ */ React.createElement("text", { x: x(i), y: "235", textAnchor: "middle" }, t.short === "M0" ? "Baseline" : t.short), /* @__PURE__ */ React.createElement("title", null, t.milestone, ": ", money(t.average_wage), ", sample ", t.sample_size))));
}
function StatusDonut({ rows = [] }) {
  const total = rows.reduce((n, r) => n + r.value, 0);
  let offset = 0;
  return /* @__PURE__ */ React.createElement("div", { className: "donut-layout" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 200", role: "img", "aria-label": "Employment status distribution" }, /* @__PURE__ */ React.createElement("circle", { cx: "100", cy: "100", r: "73", fill: "none", stroke: "#ecf0f2", strokeWidth: "23" }), rows.map((r, i) => {
    const p = total ? r.value / total * 100 : 0, start = offset;
    offset += p;
    return /* @__PURE__ */ React.createElement("circle", { key: r.name, cx: "100", cy: "100", r: "73", pathLength: "100", fill: "none", stroke: palette[i], strokeWidth: "23", strokeDasharray: Math.max(p - 1.4, 0) + " " + (100 - Math.max(p - 1.4, 0)), strokeDashoffset: -start, transform: "rotate(-90 100 100)" }, /* @__PURE__ */ React.createElement("title", null, r.name, ": ", r.value));
  }), /* @__PURE__ */ React.createElement("text", { x: "100", y: "100", textAnchor: "middle", className: "donut-number" }, number(total)), /* @__PURE__ */ React.createElement("text", { x: "100", y: "121", textAnchor: "middle", className: "donut-caption" }, "LEARNERS")), /* @__PURE__ */ React.createElement("div", { className: "donut-legend" }, rows.map((r, i) => /* @__PURE__ */ React.createElement("div", { key: r.name }, /* @__PURE__ */ React.createElement("i", { style: { background: palette[i] } }), /* @__PURE__ */ React.createElement("span", null, r.name.replace("Wage Employed (Placed)", "Wage employed").replace("Self-Employed / Enterprise", "Self-employed").replace("Unemployed / Seeking", "Seeking work")), /* @__PURE__ */ React.createElement("strong", null, r.percentage, "%")))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
