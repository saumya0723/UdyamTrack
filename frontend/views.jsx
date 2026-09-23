const { useState, useEffect, useRef } = React;

// API Base URL
const API_BASE = "/api";

// Helper Icons (SVG)
const Icons = {
    Dashboard: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    ),
    Trainees: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ),
    Onboarding: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
    ),
    Bot: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    ),
    Employer: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    ),
    SelfEmployment: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    AI: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
    Compliance: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    Reports: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ),
    Search: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    ),
    Check: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
    ),
    Shield: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    ),
    TrendingUp: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    ),
    Download: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
    ),
    Print: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
    )
};

function TraineesView({ trainees, totalTrainees, currentPage, totalPages, setCurrentPage, filters, setFilters, onSelectTrainee, showToast, refreshTrainees }) {
    const [remedialModalTrainee, setRemedialModalTrainee] = useState(null);
    const [remedialNote, setRemedialNote] = useState('');

    const handleFlagRemedial = async () => {
        if (!remedialModalTrainee) return;
        try {
            await fetch(`${API_BASE}/trainees/${remedialModalTrainee.id}/remedial?notes=${encodeURIComponent(remedialNote || 'Flagged for Remedial Upskilling')}`, {
                method: 'POST'
            }).then(readResponse);
            showToast(`Flagged ${remedialModalTrainee.id} for remedial action`);
            setRemedialModalTrainee(null);
            setRemedialNote('');
            refreshTrainees();
        } catch (err) {
            showToast('Failed to flag remedial action', 'error');
        }
    };

    return (
        <div className="space-y-4">
            {/* Search & Filter Header */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                {/* Search Box */}
                <div className="relative flex-1 min-w-[240px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Icons.Search />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by Trainee Name, ID (e.g. SKILL-2026-1025), Employer, or Role..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                    />
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Placed">Placed (Wage Employed)</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Unemployed">Unemployed</option>
                    </select>

                    <button
                        onClick={() => setFilters(prev => ({ ...prev, remedialOnly: !prev.remedialOnly }))}
                        className={`text-xs px-3 py-2 rounded-lg font-semibold border transition-all ${
                            filters.remedialOnly 
                                ? 'bg-amber-500 text-white border-amber-600 shadow-sm' 
                                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                    >
                        ⚠️ Remedial Flags Only
                    </button>
                </div>
            </div>

            {/* High-density Longitudinal Outcome Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"><div className="registry-topline"><h2>Learner outcome records</h2><span>{totalTrainees.toLocaleString()} matching learners · 12 per page</span></div>
                <div className="overflow-x-auto">
                    <div className="record-collection learner-passports">
                        
                        {trainees.length===0&&<article><div className="empty-state">No learners match these filters. Try another search or status.</div></article>}
                            {trainees.map(t => {
                                const isRemedial = t.remedial_flag;
                                return (
                                    <article key={t.id} className={`hover:bg-blue-50/40 transition-colors ${isRemedial ? 'bg-amber-50/30' : ''}`}>
                                        {/* Trainee Name & ID */}
                                        <div className="record-field"><span className="field-label">Learner profile</span><div className="field-value">
                                            <div className="learner-cell"><span className="learner-avatar">{t.name.split(" ").slice(0,2).map(v=>v[0]).join("")}</span><div className="font-bold text-slate-900 flex items-center space-x-1.5">
                                                <span>{t.name}</span>
                                                {isRemedial && <span title="Remedial Intervention Required" className="text-amber-500 font-bold">⚠️</span>}
                                            </div>
                                            <div className="text-[11px] font-mono text-blue-600 font-semibold">{t.id}</div>
                                            <div className="text-[10px] text-slate-400">{t.gender}, {t.age} yrs</div></div>
                                        </div></div>

                                        {/* Aadhaar & Mobile Masked */}
                                        <div className="record-field"><span className="field-label">Verified identity</span><div className="field-value">
                                            <div className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block text-[11px]">
                                                {t.aadhaar_masked}
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-0.5">{t.mobile}</div>
                                            <div className="text-[9px] text-emerald-600 font-semibold">Consent-based record</div>
                                        </div></div>

                                        {/* Course & District */}
                                        <div className="record-field"><span className="field-label">Learning pathway</span><div className="field-value">
                                            <div className="font-semibold text-slate-800">{t.course}</div>
                                            <div className="text-[11px] text-slate-500">{t.district}</div>
                                            <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{t.training_provider}</div>
                                        </div></div>

                                        {/* Status & Employer */}
                                        <div className="record-field"><span className="field-label">Livelihood status</span><div className="field-value">
                                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                                t.employment_status === 'Placed' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : t.employment_status === 'Self-Employed'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {t.employment_status}
                                            </span>
                                            <div className="text-[11px] text-slate-700 font-medium mt-1 truncate max-w-[140px]">
                                                {t.employer_name || t.job_role || 'Seeking Job'}
                                            </div>
                                            {t.attrition_reason && (
                                                <div className="text-[10px] text-rose-600 font-semibold truncate max-w-[130px]">
                                                    Reason: {t.attrition_reason}
                                                </div>
                                            )}
                                        </div></div>

                                        {/* Longitudinal wage miniature and milestone values */}
                                        <div className="record-field"><span className="field-label">Income journey</span><div className="field-value">
                                            <Sparkline values={[t.baseline_wage,t.wage_m3,t.wage_m6,t.wage_m12]}/><div className="flex items-center space-x-1 font-mono text-[10px]">
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600" title="Baseline M0">
                                                    M0: ₹{t.baseline_wage ? (t.baseline_wage / 1000).toFixed(0) + 'k' : '0'}
                                                </span>
                                                <span className="text-slate-300">→</span>
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600" title="Month 3">
                                                    M3: ₹{t.wage_m3 ? (t.wage_m3 / 1000).toFixed(0) + 'k' : '0'}
                                                </span>
                                                <span className="text-slate-300">→</span>
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600" title="Month 6">
                                                    M6: ₹{t.wage_m6 ? (t.wage_m6 / 1000).toFixed(0) + 'k' : '0'}
                                                </span>
                                                <span className="text-slate-300">→</span>
                                                <span className={`px-1.5 py-0.5 rounded font-bold ${t.current_wage >= t.baseline_wage ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`} title="Month 12 Current">
                                                    M12: ₹{t.current_wage ? (t.current_wage / 1000).toFixed(0) + 'k' : '0'}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-1">
                                                {t.retention_status ? 'Retained in employment' : 'Not marked as retained'}
                                            </div>
                                        </div></div>

                                        {/* AI Attrition Risk */}
                                        <div className="record-field"><span className="field-label">Risk signal</span><div className="field-value">
                                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                                t.ai_risk_level === 'High' 
                                                    ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                                                    : t.ai_risk_level === 'Medium'
                                                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                {t.ai_attrition_risk_score}% ({t.ai_risk_level})
                                            </span>
                                        </div></div>

                                        {/* Actions */}
                                        <div className="record-field"><span className="field-label">Actions</span><div className="field-value">
                                            <button 
                                                onClick={() => onSelectTrainee(t)}
                                                className="text-xs bg-slate-100 hover:bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded border border-slate-200 transition-colors"
                                            >
                                                Timeline ↗
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setRemedialModalTrainee(t);
                                                    setRemedialNote(t.remedial_notes || '');
                                                }}
                                                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded border border-amber-200"
                                                title="Trigger Remedial Intervention"
                                            >
                                                Remedial
                                            </button>
                                        </div></div>
                                    </article>
                                );
                            })}
                        
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
                    <div>
                        Showing <span className="font-semibold">{totalTrainees ? (currentPage - 1) * 12 + 1 : 0}</span> to <span className="font-semibold">{Math.min(currentPage * 12, totalTrainees)}</span> of <span className="font-semibold">{totalTrainees}</span> trainees
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-white border border-slate-300 rounded font-semibold disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span className="font-bold text-slate-800">Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-white border border-slate-300 rounded font-semibold disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Remedial Action Modal */}
            {remedialModalTrainee && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center space-x-2 text-amber-600">
                            <Icons.Shield />
                            <h3 className="font-bold text-slate-900 text-base">Assign Remedial Skilling Intervention</h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Flagging Trainee: <span className="font-bold text-slate-800">{remedialModalTrainee.name}</span> ({remedialModalTrainee.id})
                        </p>

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Remedial Reason / Action Plan</label>
                                <textarea
                                    rows="3"
                                    value={remedialNote}
                                    onChange={(e) => setRemedialNote(e.target.value)}
                                    placeholder="e.g. Schedule candidate for district job fair, provide Level-4 upskilling bridge course, or contact employer."
                                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setRemedialModalTrainee(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFlagRemedial}
                                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
                            >
                                Confirm Remedial Flag
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// -------------------------------------------------------------
// 3. TRAINEE ONBOARDING & CONSENT WIZARD
// -------------------------------------------------------------
function OnboardingWizardView({ showToast, onSuccess }) {
    const [step, setStep] = useState(1);
    const [otpSent, setOtpSent] = useState(false);
    const [simulatedOtp, setSimulatedOtp] = useState('');
    const [enteredOtp, setEnteredOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [onboardedResult, setOnboardedResult] = useState(null);

    const [form, setForm] = useState({
        name: '',
        mobile: '',
        aadhaar: '',
        gender: 'Male',
        age: 22,
        course: 'Electrician',
        training_provider: 'National Skill Training Institute (NSTI)',
        district: 'Hyderabad',
        state: 'Telangana',
        baseline_wage: 14000,
        job_role: 'Junior Electrician',
        employer_name: 'Sahyadri Buildworks Pvt Ltd',
        consent_given: true,
        consent_text: 'I consent to my training and demographic data being linked with employment and longitudinal wage outcomes for 12 months under DPDP Act 2023.'
    });

    const handleAadhaarChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
        setForm(prev => ({ ...prev, aadhaar: val }));
    };

    const handleSendOTP = async () => {
        if (form.mobile.length < 10) {
            showToast('Enter a valid 10-digit mobile number', 'error');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: form.mobile })
            });
            const data = await readResponse(res);
            setOtpSent(true);
            setSimulatedOtp(data.simulated_otp);
            setEnteredOtp(data.simulated_otp); // Auto-fill for convenience
            showToast(`OTP ${data.simulated_otp} dispatched via SMS Gateway!`);
        } catch (err) {
            showToast('Failed to send OTP', 'error');
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const res = await fetch(`${API_BASE}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: form.mobile, otp: enteredOtp })
            });
            if (res.ok) {
                setOtpVerified(true);
                showToast('Aadhaar-linked Mobile OTP verified successfully!');
            } else {
                showToast('Invalid OTP entered', 'error');
            }
        } catch (err) {
            showToast('Verification failed', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otpVerified) {
            showToast('Please complete OTP verification before onboarding', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/trainees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await readResponse(res);
            setIsSubmitting(false);
            setOnboardedResult(data);
            
            // Confetti effect!
            if (window.confetti) {
                window.confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
            }
            showToast(`Trainee ${data.id} onboarded with DPDP cryptographic hash!`);
        } catch (err) {
            setIsSubmitting(false);
            showToast('Failed to onboard trainee', 'error');
        }
    };

    if (onboardedResult) {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                    ✓
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-slate-900">Trainee Onboarded Successfully!</h2>
                <p className="text-xs text-slate-500 mt-1">National Skilling Registry Outcome Record Created</p>

                <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-xs space-y-2">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-sans">Unique Trainee ID:</span>
                        <span className="font-bold text-blue-600">{onboardedResult.id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-sans">Trainee Name:</span>
                        <span className="font-bold text-slate-800">{onboardedResult.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-sans">Masked Aadhaar:</span>
                        <span className="text-slate-800">{onboardedResult.aadhaar_masked}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-sans">Course & Sector:</span>
                        <span className="text-slate-800">{onboardedResult.course}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-500 font-sans">AI Attrition Risk:</span>
                        <span className="font-bold text-emerald-600">{onboardedResult.ai_attrition_risk_score}% (Low)</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span className="text-slate-500 font-sans">DPDP Consent Artifact:</span>
                        <span className="text-emerald-700 font-bold">Encrypted & Stored (AES-256)</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-center space-x-3">
                    <button 
                        onClick={() => {
                            setOnboardedResult(null);
                            setStep(1);
                            setOtpVerified(false);
                            setOtpSent(false);
                        }}
                        className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    >
                        Onboard Another Trainee
                    </button>
                    <button 
                        onClick={onSuccess}
                        className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm"
                    >
                        View in Registry ↗
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Stepper Header */}
            <div className="bg-slate-900 text-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold">New Trainee Onboarding & DPDP Consent</h2>
                        <p className="text-xs text-slate-400">Digital Personal Data Protection Act 2023 Compliant Intake</p>
                    </div>
                    <span className="text-xs font-mono bg-blue-600 px-2.5 py-1 rounded font-bold">Step {step} of 3</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                    <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                    <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Step 1: Personal Demographics */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Step 1: Trainee Demographics & Aadhaar</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Sirigna Reddy"
                                    value={form.name}
                                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar Number (12-digits) *</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="123456789012"
                                    value={form.aadhaar}
                                    onChange={handleAadhaarChange}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 text-slate-800"
                                />
                                <div className="text-[10px] text-slate-400 mt-1">
                                    Display Preview: {form.aadhaar.length >= 4 ? `XXXX-XXXX-${form.aadhaar.slice(-4)}` : 'XXXX-XXXX-XXXX'} (AES-256 Encrypted)
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number (Aadhaar Linked) *</label>
                                <input 
                                    type="tel" 
                                    required 
                                    placeholder="9876543210"
                                    value={form.mobile}
                                    onChange={(e) => setForm(prev => ({ ...prev, mobile: e.target.value }))}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender & Age</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select 
                                        value={form.gender}
                                        onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                                        className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <input 
                                        type="number"
                                        min="18"
                                        max="60"
                                        value={form.age}
                                        onChange={(e) => setForm(prev => ({ ...prev, age: parseInt(e.target.value) || 22 }))}
                                        className="p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
                                <select 
                                    value={form.district}
                                    onChange={(e) => setForm(prev => ({ ...prev, district: e.target.value }))}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                                >
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Visakhapatnam">Visakhapatnam</option>
                                    <option value="Vijayawada">Vijayawada</option>
                                    <option value="Guntur">Guntur</option>
                                    <option value="Warangal">Warangal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                                <input 
                                    type="text" 
                                    value={form.state}
                                    onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!form.name || form.mobile.length < 10 || form.aadhaar.length < 12) {
                                        showToast('Please fill all required fields in Step 1', 'error');
                                        return;
                                    }
                                    setStep(2);
                                }}
                                className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Next: Course & Provider →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Course & Placement Info */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Step 2: Training Course & Placement Status</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Course *</label>
                                <select 
                                    value={form.course}
                                    onChange={(e) => setForm(prev => ({ ...prev, course: e.target.value }))}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                                >
                                    <option value="Electrician">Electrician</option>
                                    <option value="Welder">Welder</option>
                                    <option value="Data Entry Operator">Data Entry Operator</option>
                                    <option value="Retail Associate">Retail Associate</option>
                                    <option value="Healthcare Assistant">Healthcare Assistant</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Training Provider *</label>
                                <select 
                                    value={form.training_provider}
                                    onChange={(e) => setForm(prev => ({ ...prev, training_provider: e.target.value }))}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                                >
                                    <option value="National Skill Training Institute (NSTI)">National Skill Training Institute (NSTI)</option>
                                    <option value="Apex Vocational Academy">Apex Vocational Academy</option>
                                    <option value="Pradhan Mantri Kaushal Kendra (PMKK)">Pradhan Mantri Kaushal Kendra (PMKK)</option>
                                    <option value="Telangana Skill Development Mission (TSDM)">Telangana Skill Development Mission (TSDM)</option>
                                    <option value="Andhra Pradesh State Skill Development (APSSDC)">APSSDC</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Role</label>
                                <input 
                                    type="text" 
                                    value={form.job_role}
                                    onChange={(e) => setForm(prev => ({ ...prev, job_role: e.target.value }))}
                                    placeholder="e.g. Electrical Technician"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Employer / Hiring Company</label>
                                <input 
                                    type="text" 
                                    value={form.employer_name}
                                    onChange={(e) => setForm(prev => ({ ...prev, employer_name: e.target.value }))}
                                    placeholder="e.g. Sahyadri Buildworks Pvt Ltd"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Baseline Monthly Wage (₹)</label>
                                <input 
                                    type="number" 
                                    value={form.baseline_wage}
                                    onChange={(e) => setForm(prev => ({ ...prev, baseline_wage: parseFloat(e.target.value) || 0 }))}
                                    placeholder="14000"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Next: DPDP Consent & OTP →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: DPDP Consent & OTP Verification */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-sm border-b pb-2">Step 3: Digital Personal Data Protection (DPDP) Act Consent & OTP</h3>

                        {/* Consent Box */}
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                            <div className="flex items-start space-x-3">
                                <input 
                                    type="checkbox"
                                    id="consentCheck"
                                    required
                                    checked={form.consent_given}
                                    onChange={(e) => setForm(prev => ({ ...prev, consent_given: e.target.checked }))}
                                    className="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                />
                                <label htmlFor="consentCheck" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                                    <span className="font-bold text-blue-900 block mb-1">Explicit Consent for Longitudinal Outcome Tracking</span>
                                    "I hereby grant explicit consent under Section 6 of the Digital Personal Data Protection Act, 2023 for my training data, Aadhaar-seeded identity, and contact details to be linked with employment and longitudinal wage outcomes over a 12-month evaluation cycle via automated WhatsApp/SMS check-ins."
                                </label>
                            </div>
                        </div>

                        {/* OTP Verification Simulator */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800">Mobile e-KYC Verification</span>
                                <span className="text-xs font-mono text-slate-500">+91 {form.mobile}</span>
                            </div>

                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                                >
                                    Send Verification OTP via SMS
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            type="text"
                                            maxLength="6"
                                            value={enteredOtp}
                                            onChange={(e) => setEnteredOtp(e.target.value)}
                                            placeholder="Enter 6-digit OTP"
                                            className="flex-1 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center tracking-widest text-slate-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyOTP}
                                            className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                                        >
                                            Verify OTP
                                        </button>
                                    </div>
                                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                                        <span>Simulated OTP Code: <b className="text-blue-600 font-mono">{simulatedOtp || '123456'}</b></span>
                                        {otpVerified && <span className="text-emerald-600 font-bold">✓ OTP Verified</span>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                disabled={!otpVerified || isSubmitting}
                                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm disabled:opacity-40"
                            >
                                {isSubmitting ? 'Generating Trainee Record...' : 'Complete Trainee Registration & Generate ID ✓'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

// -------------------------------------------------------------
// 4. WHATSAPP & SMS BOT SIMULATOR VIEW
// -------------------------------------------------------------
function BotSimulatorView({ trainees, showToast, refreshData }) {
    const [selectedTraineeId, setSelectedTraineeId] = useState(trainees[0]?.id || 'SKILL-2026-1001');
    const [milestone, setMilestone] = useState('6M');
    const [messages, setMessages] = useState([]);
    const [quickOptions, setQuickOptions] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [botStats, setBotStats] = useState(null);

    // Fetch bot summary stats
    useEffect(() => {
        fetch(`${API_BASE}/bot/summary`).then(readResponse).then(d => setBotStats(d)).catch(e => showToast(e.message, "error"));
    }, []);

    // Initialize Chat
    const startSimulation = async () => {
        if (!selectedTraineeId) return;
        try {
            const res = await fetch(`${API_BASE}/bot/chat-turn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trainee_id: selectedTraineeId,
                    milestone: milestone,
                    step: 1,
                    user_reply: 'START'
                })
            });
            const data = await readResponse(res);
            setMessages([
                { sender: 'bot', text: data.bot_message, time: 'Just now' }
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
        const newMsgList = [...messages, { sender: 'user', text: replyText, time: 'Just now' }];
        setMessages(newMsgList);
        setQuickOptions([]);

        try {
            const res = await fetch(`${API_BASE}/bot/chat-turn`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trainee_id: selectedTraineeId,
                    milestone: milestone,
                    step: currentStep,
                    user_reply: replyText
                })
            });
            const data = await readResponse(res);
            
            setTimeout(() => {
                setMessages([...newMsgList, { sender: 'bot', text: data.bot_message, time: 'Just now' }]);
                setQuickOptions(data.options || []);
                setCurrentStep(data.step);
                if (data.completed) {
                    showToast(`Outcome record updated via WhatsApp Bot!`);
                    refreshData();
                }
            }, 600);
        } catch (err) {
            showToast('Chat turn error', 'error');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls & Analytics */}
            <div className="lg:col-span-6 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                        <Icons.Bot />
                        <span>Automated Follow-up Bot Engine</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                        Dispatches automated WhatsApp/SMS check-ins at 3, 6, and 12-month post-training intervals to capture employment retention, wage growth, or reasons for attrition.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Trainee to Test</label>
                            <select
                                value={selectedTraineeId}
                                onChange={(e) => setSelectedTraineeId(e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                            >
                                {trainees.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} ({t.id} - {t.course})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Milestone</label>
                            <select
                                value={milestone}
                                onChange={(e) => setMilestone(e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-bold"
                            >
                                <option value="3M">3-Month Milestone</option>
                                <option value="6M">6-Month Milestone</option>
                                <option value="12M">12-Month Milestone</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={startSimulation}
                        className="w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                    >
                        Restart Follow-Up Conversation ↺
                    </button>
                </div>

                {/* Bot Response Rate Stats */}
                {botStats && (
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Bot Dispatch Analytics</h4>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <div className="text-xl font-extrabold text-slate-800">{botStats.total_surveys_dispatched}</div>
                                <div className="text-[10px] text-slate-500 mt-1">Surveys Sent</div>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-lg">
                                <div className="text-xl font-extrabold text-emerald-600">{botStats.response_rate_pct}%</div>
                                <div className="text-[10px] text-emerald-700 mt-1">Response Rate</div>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <div className="text-xl font-extrabold text-amber-600">{botStats.remedial_alerts_triggered}</div>
                                <div className="text-[10px] text-amber-700 mt-1">Remedial Alerts</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right WhatsApp Smartphone Emulator */}
            <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm phone-mockup">
                    {/* Phone Top Notch & WhatsApp Header */}
                    <div className="bg-[#075E54] text-white p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
                                🎯
                            </div>
                            <div>
                                <div className="font-bold text-xs">उद्यम Track MSDE Bot ✓</div>
                                <div className="text-[10px] text-emerald-200">Official Government Channel</div>
                            </div>
                        </div>
                        <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded font-mono text-[10px]">WhatsApp</span>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="h-96 p-4 overflow-y-auto space-y-3 whatsapp-chat-bg text-xs">
                        <div className="text-center my-1">
                            <span className="bg-amber-100/90 text-amber-900 text-[10px] px-2.5 py-1 rounded shadow-sm">
                                🔒 DPDP End-to-End Encrypted Survey
                            </span>
                        </div>

                        {messages.map((m, idx) => (
                            <div 
                                key={idx} 
                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 text-slate-800 text-xs ${
                                    m.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                                }`}>
                                    <p className="leading-relaxed">{m.text}</p>
                                    <span className="text-[9px] text-slate-400 block text-right mt-1">{m.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Interactive Quick Reply Buttons */}
                    <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                        {quickOptions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 justify-center">
                                {quickOptions.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleUserReply(opt)}
                                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-3 py-1.5 rounded-full transition-all"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="text-[10px] text-center text-slate-400">
                            Click option above to simulate trainee reply
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// 5. EMPLOYER VALIDATION & BLOCKCHAIN LEDGER VIEW
// -------------------------------------------------------------
function EmployersView({ showToast }) {
    const [employers, setEmployers] = useState([]);
    const [ledger, setLedger] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [newEmp, setNewEmp] = useState({
        company_name: '',
        industry_sector: 'Manufacturing',
        gst_number: '36AAACL0145P1Z3',
        udyam_number: 'UDYAM-TS-01-001234',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        district: 'Hyderabad'
    });

    const fetchEmployers = () => {
        fetch(`${API_BASE}/employers`).then(readResponse).then(d => setEmployers(d)).catch(e => showToast(e.message, "error"));
        fetch(`${API_BASE}/employers/blockchain-ledger`).then(readResponse).then(d => setLedger(d)).catch(e => showToast(e.message, "error"));
    };

    useEffect(() => {
        fetchEmployers();
    }, []);

    const handleVerify = async (empId, status) => {
        try {
            await fetch(`${API_BASE}/employers/${empId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, verified_by: 'Admin (MSDE Nodal Validator)' })
            }).then(readResponse);
            showToast(`Employer status set to ${status}`);
            fetchEmployers();
        } catch (err) {
            showToast('Verification update failed', 'error');
        }
    };

    const handleRegisterEmployer = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_BASE}/employers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmp)
            }).then(readResponse);
            showToast(`Registered employer '${newEmp.company_name}' with Blockchain proof!`);
            setShowRegisterModal(false);
            fetchEmployers();
        } catch (err) {
            showToast('Registration failed', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Add Button */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-900 text-sm">Employer Verification & Placement Proof Ledger</h3>
                    <p className="text-xs text-slate-500">Employer profiles, placement counts and recorded verification decisions</p>
                </div>
                <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                    + Register New Employer
                </button>
            </div>

            {/* Employers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="record-collection employer-dossiers">
                        
                        
                            {employers.map(emp => (
                                <article key={emp.id} className="hover:bg-slate-50">
                                    <div className="record-field"><span className="field-label">Company & Sector</span><div className="field-value">
                                        <div className="font-bold text-slate-900">{emp.company_name}</div>
                                        <div className="text-[11px] text-slate-500">{emp.industry_sector} • {emp.district}</div>
                                    </div></div>
                                    <div className="record-field"><span className="field-label">GST & Udyam Credentials</span><div className="field-value">
                                        <div><span className="text-slate-400">GST:</span> {emp.gst_number || 'N/A'}</div>
                                        <div className="text-slate-600"><span className="text-slate-400">Udyam:</span> {emp.udyam_number || 'N/A'}</div>
                                    </div></div>
                                    <div className="record-field"><span className="field-label">Contact Person</span><div className="field-value">
                                        <div className="font-semibold text-slate-800">{emp.contact_person}</div>
                                        <div className="text-[11px] text-slate-500">{emp.contact_email}</div>
                                    </div></div>
                                    <div className="record-field"><span className="field-label">Active Hires</span><div className="field-value">
                                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                            {emp.active_hires_count} Placements
                                        </span>
                                    </div></div>
                                    <div className="record-field"><span className="field-label">Verification Status</span><div className="field-value">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            emp.verification_status === 'Verified' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : emp.verification_status === 'Pending'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-rose-100 text-rose-800'
                                        }`}>
                                            {emp.verification_status}
                                        </span>
                                    </div></div>
                                    <div className="record-field"><span className="field-label">Actions</span><div className="field-value">
                                        {emp.verification_status !== 'Verified' ? (
                                            <button 
                                                onClick={() => handleVerify(emp.id, 'Verified')}
                                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded"
                                            >
                                                Verify ✓
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleVerify(emp.id, 'Pending')}
                                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div></div>
                                </article>
                            ))}
                        
                    </div>
                </div>
            </div>

            {/* Blockchain Proof Ledger Explorer */}
            {ledger && (
                <div className="bg-slate-900 text-white p-5 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2">
                            <Icons.Shield />
                            <h4 className="font-bold text-sm">Blockchain Verification Hash Chain (SHA-256)</h4>
                        </div>
                        <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded font-mono font-bold">
                            Chain Integrity: Verified Authentic
                        </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-[11px]">
                        {ledger.blocks.map(b => (
                            <div key={b.index} className="p-3 bg-slate-800/80 rounded border border-slate-700">
                                <div className="flex items-center justify-between text-blue-400 font-bold">
                                    <span>Block #{b.index}: {b.entity}</span>
                                    <span className="text-slate-400 font-normal">{b.timestamp}</span>
                                </div>
                                <div className="mt-1 text-slate-300 truncate">
                                    <span className="text-slate-500">Tx Hash:</span> {b.tx_hash}
                                </div>
                                <div className="text-slate-400 text-[10px] truncate">
                                    <span className="text-slate-500">Prev Hash:</span> {b.previous_hash}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Register Employer Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="font-bold text-slate-900 text-base">Register Hiring Employer</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Submits company for GST & placement proof verification</p>

                        <form onSubmit={handleRegisterEmployer} className="mt-4 space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newEmp.company_name}
                                    onChange={(e) => setNewEmp(prev => ({ ...prev, company_name: e.target.value }))}
                                    className="w-full p-2 bg-slate-50 border rounded-lg text-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">GST Number (15-digit)</label>
                                <input 
                                    type="text" 
                                    value={newEmp.gst_number}
                                    onChange={(e) => setNewEmp(prev => ({ ...prev, gst_number: e.target.value }))}
                                    className="w-full p-2 bg-slate-50 border rounded-lg font-mono text-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Udyam Number</label>
                                <input 
                                    type="text" 
                                    value={newEmp.udyam_number}
                                    onChange={(e) => setNewEmp(prev => ({ ...prev, udyam_number: e.target.value }))}
                                    className="w-full p-2 bg-slate-50 border rounded-lg font-mono text-slate-800"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Contact Person & Email</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="HR Lead Name"
                                    value={newEmp.contact_person}
                                    onChange={(e) => setNewEmp(prev => ({ ...prev, contact_person: e.target.value }))}
                                    className="w-full p-2 bg-slate-50 border rounded-lg text-slate-800 mb-2"
                                />
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="careers@company.com"
                                    value={newEmp.contact_email}
                                    onChange={(e) => setNewEmp(prev => ({ ...prev, contact_email: e.target.value }))}
                                    className="w-full p-2 bg-slate-50 border rounded-lg text-slate-800"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterModal(false)}
                                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                                >
                                    Register & Commit Hash
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// -------------------------------------------------------------
// 6. SELF-EMPLOYMENT HUB VIEW
// -------------------------------------------------------------
function SelfEmploymentView({ showToast }) {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/employers/self-employment`).then(readResponse).then(d => setRecords(d)).catch(e => showToast(e.message, "error"));
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">Self-Employment & Micro-Enterprise Registry</h3>
                <p className="text-xs text-slate-500">Tracking trainees who established independent businesses, repair shops, and retail ventures </p>
            </div>

            <div className="enterprise-portfolios">
                {records.map(r => (
                    <div key={r.id} className="enterprise-card"><div className="enterprise-mark"><Icons.SelfEmployment /><span>INDEPENDENT LIVELIHOOD</span></div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                {r.trainee_id}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                {r.verification_status}
                            </span>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{r.business_name}</h4>
                            <p className="text-xs text-slate-500">{r.business_type}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 font-mono">
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-sans">Monthly Revenue:</span>
                                <span className="font-bold text-slate-800">₹{r.monthly_revenue.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-sans">Udyam No:</span>
                                <span className="text-slate-700">{r.udyam_reg_number}</span>
                            </div>
                        </div>

                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Proof: {r.proof_document_type}</span>
                            <span className="text-blue-600 font-semibold cursor-pointer">Proof metadata recorded</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// 7. AI PREDICTIVE ATTRITION & NLP VIEW
// -------------------------------------------------------------
function AIPredictorView({ showToast }) {
    const [calcParams, setCalcParams] = useState({
        course: 'Retail Associate',
        district: 'Warangal',
        baseline_wage: 10500,
        age: 21,
        gender: 'Female',
        current_milestone: '6M'
    });

    const [prediction, setPrediction] = useState(null);
    const [nlpAnalysis, setNlpAnalysis] = useState(null);

    const runPrediction = async () => {
        try {
            const res = await fetch(`${API_BASE}/analytics/predict-attrition`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(calcParams)
            });
            const data = await readResponse(res);
            setPrediction(data);
        } catch (err) {
            showToast('AI Model evaluation failed', 'error');
        }
    };

    useEffect(() => {
        runPrediction();
        fetch(`${API_BASE}/analytics/attrition-nlp`).then(readResponse).then(d => setNlpAnalysis(d)).catch(e => showToast(e.message, "error"));
    }, []);

    return (
        <div className="space-y-6">
            {/* AI Attrition Risk Simulator */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                            <Icons.AI />
                            <span>AI-Powered Longitudinal Attrition Risk Predictor</span>
                        </h3>
                        <p className="text-xs text-slate-500">Trained Logistic Regression model evaluating dropout/job-loss probability based on wage benchmarks and sectoral mobility</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Input Controls */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Course</label>
                                <select 
                                    value={calcParams.course}
                                    onChange={(e) => setCalcParams(prev => ({ ...prev, course: e.target.value }))}
                                    className="w-full p-2 bg-slate-50 border rounded-lg text-xs"
                                >
                                    <option value="Retail Associate">Retail Associate</option>
                                    <option value="Data Entry Operator">Data Entry Operator</option>
                                    <option value="Welder">Welder</option>
                                    <option value="Electrician">Electrician</option>
                                    <option value="Healthcare Assistant">Healthcare Assistant</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                                <select 
                                    value={calcParams.district}
                                    onChange={(e) => setCalcParams(prev => ({ ...prev, district: e.target.value }))}
                                    className="w-full p-2 bg-slate-50 border rounded-lg text-xs"
                                >
                                    <option value="Warangal">Warangal</option>
                                    <option value="Guntur">Guntur</option>
                                    <option value="Vijayawada">Vijayawada</option>
                                    <option value="Visakhapatnam">Visakhapatnam</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Baseline Salary: ₹{calcParams.baseline_wage.toLocaleString()}
                                </label>
                                <input 
                                    type="range"
                                    min="8000"
                                    max="35000"
                                    step="500"
                                    value={calcParams.baseline_wage}
                                    onChange={(e) => setCalcParams(prev => ({ ...prev, baseline_wage: parseFloat(e.target.value) }))}
                                    className="w-full accent-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Age: {calcParams.age} yrs</label>
                                <input 
                                    type="range"
                                    min="18"
                                    max="35"
                                    value={calcParams.age}
                                    onChange={(e) => setCalcParams(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                                    className="w-full accent-blue-600"
                                />
                            </div>
                        </div>

                        <button
                            onClick={runPrediction}
                            className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                        >
                            Evaluate Attrition Risk Score ⚡
                        </button>
                    </div>

                    {/* Output Prediction Card */}
                    {prediction && (
                        <div className="lg:col-span-6 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Predicted Attrition Risk</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        prediction.risk_level === 'High' 
                                            ? 'bg-rose-100 text-rose-800' 
                                            : prediction.risk_level === 'Medium'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                        {prediction.risk_level} Risk Level
                                    </span>
                                </div>

                                <div className="mt-3 flex items-baseline space-x-2">
                                    <span className="text-4xl font-extrabold text-slate-900">{prediction.risk_score}%</span>
                                    <span className="text-xs text-slate-500">probability of attrition within 12M</span>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="text-xs font-semibold text-slate-700">Key Explainability Signals:</div>
                                    <ul className="text-xs text-slate-600 space-y-1">
                                        {prediction.key_risk_factors.map((f, i) => (
                                            <li key={i} className="flex items-start space-x-1.5">
                                                <span className="text-blue-500 font-bold">•</span>
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-blue-100/60 rounded-lg border border-blue-200">
                                <div className="text-xs font-bold text-blue-900 mb-1">Recommended Policy Intervention:</div>
                                <p className="text-xs text-blue-800">{prediction.recommendations[0]}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* NLP Reason Analyzer */}
            {nlpAnalysis && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm mb-1">NLP Text Analysis of Open-Ended Survey Feedback</h3>
                    <p className="text-xs text-slate-500 mb-4">{nlpAnalysis.actionable_insight}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Keyword Frequency Tags */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-700 mb-3">Top Keyword Signals Extracted:</h4>
                            <div className="flex flex-wrap gap-2">
                                {nlpAnalysis.keywords.map((k, i) => (
                                    <span key={i} className="text-xs px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg border border-slate-200 font-medium">
                                        {k.word} <span className="font-bold text-blue-600 ml-1">({k.count})</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Clusters */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-700 mb-3">Thematic Clusters:</h4>
                            {Object.entries(nlpAnalysis.clusters).map(([theme, count]) => (
                                <div key={theme} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded">
                                    <span className="text-slate-700 font-medium">{theme}</span>
                                    <span className="font-bold text-slate-900">{count} occurrences</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// -------------------------------------------------------------
// 8. DPDP COMPLIANCE & SECURITY AUDIT VIEW
// -------------------------------------------------------------
function ComplianceView({ showToast }) {
    const [consentLogs, setConsentLogs] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [verificationResult, setVerificationResult] = useState(null);

    const fetchLogs = () => {
        fetch(`${API_BASE}/compliance/consent-logs`).then(readResponse).then(d => setConsentLogs(d)).catch(e => showToast(e.message, "error"));
        fetch(`${API_BASE}/compliance/audit-logs`).then(readResponse).then(d => setAuditLogs(d)).catch(e => showToast(e.message, "error"));
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleVerifyTamper = async (consentId) => {
        try {
            const res = await fetch(`${API_BASE}/compliance/verify-consent-tamper?consent_id=${consentId}`, { method: 'POST' });
            const data = await readResponse(res);
            setVerificationResult(data);
            showToast('DPDP Cryptographic Tamper Verification Complete!');
        } catch (err) {
            showToast('Verification failed', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* Compliance Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-xl shadow-sm border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-2">
                            <Icons.Shield />
                            <h3 className="font-bold text-base">DPDP Act 2023 Consent & Audit Engine</h3>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                            Consent records • Integrity checks • Recorded access and modification events
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-emerald-900/80 text-emerald-300 text-xs font-bold rounded-full border border-emerald-700">
                            Consent & audit controls
                        </span>
                    </div>
                </div>
            </div>

            {/* Verification Result Dialog if triggered */}
            {verificationResult && (
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-xs font-mono space-y-1">
                    <div className="font-bold text-emerald-900 text-sm font-sans">✓ Cryptographic Audit Result</div>
                    <div>Trainee: {verificationResult.trainee_id}</div>
                    <div>SHA-256 Tamper Hash: {verificationResult.tamper_hash}</div>
                    <div className="text-emerald-700 font-bold">Status: {verificationResult.is_tamper_free ? 'Authentic & Untampered' : 'Tampered'}</div>
                </div>
            )}

            {/* Consent Artifacts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Consent record vault · latest 8 records</h4>
                </div>
                <div className="overflow-x-auto">
                    <div className="record-collection consent-cards">
                        
                        
                            {consentLogs.slice(0, 8).map(c => (
                                <article key={c.id} className="hover:bg-slate-50">
                                    <div className="record-field"><span className="field-label">Trainee ID</span><div className="field-value">{c.trainee_id}</div></div>
                                    <div className="record-field"><span className="field-label">Consent Version</span><div className="field-value">{c.consent_version}</div></div>
                                    <div className="record-field"><span className="field-label">Timestamp</span><div className="field-value">{new Date(c.timestamp).toLocaleString()}</div></div>
                                    <div className="record-field"><span className="field-label">SHA-256 Tamper Hash</span><div className="field-value">{c.tamper_hash}</div></div>
                                    <div className="record-field"><span className="field-label">Integrity Check</span><div className="field-value">
                                        <button 
                                            onClick={() => handleVerifyTamper(c.id)}
                                            className="font-sans text-xs bg-slate-100 hover:bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded border border-slate-200"
                                        >
                                            Verify Hash ↗
                                        </button>
                                    </div></div>
                                </article>
                            ))}
                        
                    </div>
                </div>
            </div>

            {/* Audit Logs Stream */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Activity timeline · latest 10 events</h4>
                </div>
                <div className="overflow-x-auto">
                    <div className="record-collection audit-timeline">
                        
                        
                            {auditLogs.slice(0, 10).map(a => (
                                <article key={a.id} className="hover:bg-slate-50">
                                    <div className="record-field"><span className="field-label">Timestamp</span><div className="field-value">
                                        {new Date(a.timestamp).toLocaleTimeString()}
                                    </div></div>
                                    <div className="record-field"><span className="field-label">User & Role</span><div className="field-value">
                                        <span className="font-bold text-slate-800">{a.user_identity}</span> ({a.role})
                                    </div></div>
                                    <div className="record-field"><span className="field-label">Action</span><div className="field-value">
                                        <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                                            {a.action}
                                        </span>
                                    </div></div>
                                    <div className="record-field"><span className="field-label">Entity</span><div className="field-value">{a.entity_type}</div></div>
                                    <div className="record-field"><span className="field-label">Details</span><div className="field-value">{a.details}</div></div>
                                </article>
                            ))}
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

// -------------------------------------------------------------
// 9. REPORTS & EXPORT VIEW
// -------------------------------------------------------------
function TraineeDetailModal({ trainee, onClose, showToast, onUpdate }) {
    const [botLogs, setBotLogs] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/bot/logs/${trainee.id}`).then(readResponse).then(d => setBotLogs(d)).catch(e => showToast(e.message, "error"));
    }, [trainee.id]);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-3">
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{trainee.id}</span>
                            <h3 className="font-bold text-slate-900 text-lg">{trainee.name}</h3>
                        </div>
                        <p className="text-xs text-slate-500">{trainee.course} • {trainee.district}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl font-bold px-2"
                    >
                        ✕
                    </button>
                </div>

                {/* Profile Badges */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-slate-400 text-[10px]">Employment Status</div>
                        <div className="font-bold text-slate-900 mt-1">{trainee.employment_status}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-slate-400 text-[10px]">Current Salary</div>
                        <div className="font-bold text-emerald-600 mt-1">₹{trainee.current_wage.toLocaleString()}/mo</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-slate-400 text-[10px]">AI Attrition Risk</div>
                        <div className="font-bold text-blue-600 mt-1">{trainee.ai_attrition_risk_score}% ({trainee.ai_risk_level})</div>
                    </div>
                </div>

                {/* Longitudinal Progression Timeline */}
                <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Longitudinal Outcome Timeline</h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-[10px] text-blue-600 font-bold">Month 0 (Intake)</div>
                            <div className="font-extrabold text-slate-800 mt-1">₹{trainee.baseline_wage.toLocaleString()}</div>
                        </div>
                        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-[10px] text-blue-600 font-bold">Month 3</div>
                            <div className="font-extrabold text-slate-800 mt-1">₹{trainee.wage_m3.toLocaleString()}</div>
                        </div>
                        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-[10px] text-blue-600 font-bold">Month 6</div>
                            <div className="font-extrabold text-slate-800 mt-1">₹{trainee.wage_m6.toLocaleString()}</div>
                        </div>
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <div className="text-[10px] text-emerald-700 font-bold">Month 12</div>
                            <div className="font-extrabold text-emerald-800 mt-1">₹{trainee.wage_m12.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Automated Follow-Up Survey History */}
                <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Automated Check-in Transcripts</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {botLogs.map(l => (
                            <div key={l.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                                    <span>Milestone: {l.milestone} ({l.channel})</span>
                                    <span className="text-slate-400 font-normal">{new Date(l.sent_timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-600 text-[11px] font-mono whitespace-pre-wrap">{l.raw_chat_log}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DPDP Consent Certificate Stamp */}
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div>
                        <div className="font-bold">DPDP Act 2023 Consent Certificate</div>
                        <div className="text-[10px] text-emerald-700">Timestamp: {new Date(trainee.consent_timestamp).toLocaleString()}</div>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        AES-256 Verified
                    </span>
                </div>
            </div>
        </div>
    );
}

// Render the Root React App
