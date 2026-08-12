/* AI School Guardian — Shared Demo Store / Router Helpers */
(function (window) {
  'use strict';

  const CASE_KEY = 'schoolGuardianCases';
  const SESSION_KEY = 'asg_demo_session_v1';
  const NOTIFY_KEY = 'asg_notifications_v1';

  const seedCases = [
    {
      id: 'SG-1082', studentId: '#1082', grade: 'ม.5', type: 'ความรุนแรงทางร่างกาย', incident: 'เกิดเหตุทะเลาะวิวาทบริเวณโรงยิม', urgency: 'วิกฤต', location: 'โรงยิม', time: '10:45', privacy: 'identity', aiRisk: 'CRITICAL', aiAnalysis: 'ตรวจพบเหตุการณ์ความรุนแรงทางร่างกาย ต้องมีบุคลากรเข้าช่วยเหลือทันที', status: 'INTERVENTION', teacher: 'ครูเวร A', notes: 'รอการเข้าช่วยเหลือ', timeline: [{status:'NEW',at:'2026-08-12T10:45:00+07:00'},{status:'AI_ANALYZED',at:'2026-08-12T10:45:20+07:00'},{status:'TEACHER_NOTIFIED',at:'2026-08-12T10:46:00+07:00'},{status:'ACCEPTED',at:'2026-08-12T10:47:00+07:00'},{status:'INTERVENTION',at:'2026-08-12T10:48:00+07:00'}], createdAt: '2026-08-12T10:45:00+07:00', acceptedAt: '2026-08-12T10:47:00+07:00'
    },
    {
      id: 'SG-1102', studentId: '#1102', grade: 'ม.4', type: 'ความขัดแย้ง', incident: 'มีความขัดแย้งระหว่างนักเรียนในโรงอาหาร', urgency: 'ปานกลาง', location: 'โรงอาหาร', time: '11:10', privacy: 'identity', aiRisk: 'MEDIUM', aiAnalysis: 'พบสัญญาณความขัดแย้ง ควรติดตามสถานการณ์', status: 'TEACHER_NOTIFIED', teacher: '', notes: '', timeline: [{status:'NEW',at:'2026-08-12T11:10:00+07:00'},{status:'AI_ANALYZED',at:'2026-08-12T11:10:20+07:00'},{status:'TEACHER_NOTIFIED',at:'2026-08-12T11:11:00+07:00'}], createdAt: '2026-08-12T11:10:00+07:00'
    },
    {
      id: 'SG-1091', studentId: '#1091', grade: 'ม.6', type: 'การคุกคาม / การรบกวน', incident: 'มีการรบกวนซ้ำในห้องสมุด', urgency: 'ต่ำ', location: 'ห้องสมุด', time: '09:20', privacy: 'identity', aiRisk: 'LOW', aiAnalysis: 'ไม่พบสัญญาณความเสี่ยงผิดปกติ', status: 'RESOLVED', teacher: 'ครูประจำชั้น', notes: 'แก้ไขแล้ว', timeline: [{status:'NEW',at:'2026-08-12T09:20:00+07:00'},{status:'AI_ANALYZED',at:'2026-08-12T09:20:20+07:00'},{status:'TEACHER_NOTIFIED',at:'2026-08-12T09:21:00+07:00'},{status:'ACCEPTED',at:'2026-08-12T09:25:00+07:00'},{status:'RESOLVED',at:'2026-08-12T10:00:00+07:00'}], createdAt: '2026-08-12T09:20:00+07:00', acceptedAt: '2026-08-12T09:25:00+07:00'
    },
    {
      id: 'SG-1011', studentId: '#1011', grade: 'ม.4', type: 'การกลั่นแกล้ง', incident: 'ถูกรังแกซ้ำบริเวณอาคาร B ช่วงพักกลางวัน', urgency: 'สูง', location: 'อาคาร B — ชั้น 2', time: '12:15', privacy: 'confidential', aiRisk: 'HIGH', aiAnalysis: 'ตรวจพบเหตุการณ์ลักษณะคล้ายกันซ้ำในพื้นที่และช่วงเวลาเดียวกัน', status: 'FOLLOW_UP', teacher: 'ครูที่ปรึกษา', notes: 'อยู่ระหว่างติดตาม', timeline: [{status:'NEW',at:'2026-08-11T12:15:00+07:00'},{status:'AI_ANALYZED',at:'2026-08-11T12:15:20+07:00'},{status:'TEACHER_NOTIFIED',at:'2026-08-11T12:16:00+07:00'},{status:'ACCEPTED',at:'2026-08-11T12:20:00+07:00'},{status:'FOLLOW_UP',at:'2026-08-12T08:30:00+07:00'}], createdAt: '2026-08-11T12:15:00+07:00', acceptedAt: '2026-08-11T12:20:00+07:00'
    }
  ];

  const FILE_STATE_KEY = '__ASG_FILE_STATE_V1__';
  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function now(){ return new Date().toISOString(); }
  function isFileMode(){ return window.location.protocol === 'file:'; }
  function readFileState(){
    try {
      const raw = window.name && window.name.indexOf(FILE_STATE_KEY + '=') === 0 ? window.name.slice(FILE_STATE_KEY.length + 1) : '';
      return raw ? JSON.parse(decodeURIComponent(raw)) : {};
    } catch(e){ return {}; }
  }
  function writeFileState(state){
    try { window.name = FILE_STATE_KEY + '=' + encodeURIComponent(JSON.stringify(state)); } catch(e) {}
  }
  function getItem(key){
    // Prefer localStorage even in file:// mode so data survives refresh/reopen
    // when the browser permits file-origin storage. Fall back to window.name.
    try {
      const value = localStorage.getItem(key);
      if (value !== null) return value;
    } catch(e) {}
    if (isFileMode()) return readFileState()[key] ?? null;
    return null;
  }
  function setItem(key,value){
    let saved = false;
    try { localStorage.setItem(key,value); saved = true; } catch(e) {}
    if (!saved && isFileMode()) {
      const state=readFileState(); state[key]=value; writeFileState(state);
    }
  }
  function removeItem(key){
    try { localStorage.removeItem(key); } catch(e) {}
    if (isFileMode()) { const state=readFileState(); delete state[key]; writeFileState(state); }
  }
  let cloudClient = null;
  let cloudReady = false;
  let cloudLastSync = 0;
  let cloudChannel = null;

  function cloudConfigured(){
    const cfg = window.ASG_SUPABASE_CONFIG || {};
    return !!(window.supabase && cfg.url && cfg.publishableKey && !String(cfg.url).includes('YOUR-PROJECT-REF') && !String(cfg.publishableKey).includes('YOUR_SUPABASE'));
  }

  function caseToRow(c){
    return {
      id:c.id, student_id:c.studentId || '', grade:c.grade || '', type:c.type || '', incident:c.incident || '',
      urgency:c.urgency || '', location:c.location || '', privacy:c.privacy || '', ai_risk:c.aiRisk || '',
      ai_analysis:c.aiAnalysis || '', status:c.status || 'NEW', teacher:c.teacher || '', notes:c.notes || '',
      timeline:c.timeline || [], created_at:c.createdAt || now(), updated_at:c.updatedAt || now(), accepted_at:c.acceptedAt || null
    };
  }
  function rowToCase(r){
    return { id:r.id, studentId:r.student_id, grade:r.grade, type:r.type, incident:r.incident, urgency:r.urgency, location:r.location,
      privacy:r.privacy, aiRisk:r.ai_risk, aiAnalysis:r.ai_analysis, status:r.status, teacher:r.teacher, notes:r.notes,
      timeline:r.timeline || [], createdAt:r.created_at, updatedAt:r.updated_at, acceptedAt:r.accepted_at || undefined };
  }
  function localCases(){
    try { const raw=getItem(CASE_KEY); if(raw) return JSON.parse(raw); } catch(e) {}
    const seeded=clone(seedCases); setItem(CASE_KEY,JSON.stringify(seeded)); return seeded;
  }
  function loadCases(){ return localCases(); }
  function saveCases(cases){
    setItem(CASE_KEY, JSON.stringify(cases));
    window.dispatchEvent(new window.CustomEvent('asg:cases-updated',{detail:{key:CASE_KEY}}));
    if(cloudReady) cloudUpsert(cases).catch(()=>{});
  }
  async function cloudUpsert(cases){
    if(!cloudClient) return;
    const rows=cases.map(caseToRow);
    if(!rows.length) return;
    const {error}=await cloudClient.from('school_guardian_cases').upsert(rows,{onConflict:'id'});
    if(error) console.warn('[ASG] Supabase upsert failed:',error.message);
    else cloudLastSync=Date.now();
  }
  async function cloudHydrate(){
    if(!cloudClient) return;
    const {data,error}=await cloudClient.from('school_guardian_cases').select('*').order('created_at',{ascending:true});
    if(error){ console.warn('[ASG] Supabase read failed:',error.message); return; }
    if(Array.isArray(data) && data.length){
      const cases=data.map(rowToCase); setItem(CASE_KEY,JSON.stringify(cases));
    } else {
      const seeded=clone(seedCases); setItem(CASE_KEY,JSON.stringify(seeded)); await cloudUpsert(seeded);
    }
    cloudLastSync=Date.now();
    window.dispatchEvent(new window.CustomEvent('asg:cases-updated',{detail:{key:CASE_KEY,source:'cloud'}}));
  }
  async function cloudPoll(){
    if(!cloudClient) return;
    const {data,error}=await cloudClient.from('school_guardian_cases').select('*').order('created_at',{ascending:true});
    if(error || !Array.isArray(data)) return;
    const cases=data.map(rowToCase); const signature=JSON.stringify(cases); const localSig=JSON.stringify(localCases());
    if(signature!==localSig){ setItem(CASE_KEY,signature); window.dispatchEvent(new window.CustomEvent('asg:cases-updated',{detail:{key:CASE_KEY,source:'cloud-poll'}})); }
    cloudLastSync=Date.now();
  }
  function initCloud(){
    if(!cloudConfigured()) return;
    try {
      const cfg=window.ASG_SUPABASE_CONFIG;
      cloudClient=window.supabase.createClient(cfg.url,cfg.publishableKey);
      cloudReady=true;
      cloudHydrate();
      cloudChannel=cloudClient.channel('asg-school-guardian-cases')
        .on('postgres_changes',{event:'*',schema:'public',table:'school_guardian_cases'},payload=>{
          if(payload.eventType==='DELETE') return cloudHydrate();
          const incoming=rowToCase(payload.new); const cases=localCases(); const i=cases.findIndex(c=>c.id===incoming.id);
          if(i>=0) cases[i]=incoming; else cases.push(incoming); setItem(CASE_KEY,JSON.stringify(cases));
          window.dispatchEvent(new window.CustomEvent('asg:cases-updated',{detail:{key:CASE_KEY,source:'realtime'}}));
        }).subscribe();
      setInterval(cloudPoll,5000);
    } catch(e){ console.warn('[ASG] Supabase initialization failed:',e); cloudClient=null; cloudReady=false; }
  }
  function loadNotifications(){ try { return JSON.parse(getItem(NOTIFY_KEY) || '[]'); } catch(e){ return []; } }
  function saveNotifications(items){ setItem(NOTIFY_KEY, JSON.stringify(items)); }

  const statusLabel = {
    NEW: 'รายงานใหม่', AI_ANALYZED: 'AI วิเคราะห์แล้ว', TEACHER_NOTIFIED: 'แจ้งครูแล้ว', ACCEPTED: 'ครูรับเรื่องแล้ว', INTERVENTION: 'กำลังช่วยเหลือ', FOLLOW_UP: 'ติดตามผล', RESOLVED: 'แก้ไขแล้ว'
  };

  function riskLabel(r){ return ({CRITICAL:'วิกฤต',HIGH:'สูง',MEDIUM:'ปานกลาง',LOW:'ต่ำ'})[r] || r || 'ต่ำ'; }
  function riskFromUrgency(urgency, type, incident){
    const text = `${type || ''} ${incident || ''}`;
    if (urgency === 'วิกฤต' || /ความรุนแรง|ฉุกเฉิน|ทำร้าย/.test(text)) return 'CRITICAL';
    if (urgency === 'สูง' || /กลั่นแกล้ง|ข่มขู่|ล้อ|ซ้ำ/.test(text)) return 'HIGH';
    if (urgency === 'ปานกลาง') return 'MEDIUM';
    return 'LOW';
  }
  function timeFromIso(iso){ return new Date(iso).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit',hour12:false}); }
  function nextCaseId(){
    const cases = loadCases();
    const nums = cases.map(c => Number(String(c.id).replace(/\D/g,''))).filter(Boolean);
    return `SG-${Math.max(1023, ...nums) + 1}`;
  }

  const ASG = {
    statusLabel,
    riskLabel,
    riskFromUrgency,
    login(role){ setItem(SESSION_KEY, JSON.stringify({role, at: now()})); },
    logout(){ removeItem(SESSION_KEY); },
    currentRole(){ try { return JSON.parse(getItem(SESSION_KEY) || 'null')?.role || null; } catch(e){ return null; } },
    goRole(role){ window.location.href = `${role}/index.html`; },
    goLogin(){ window.location.href = '../index.html'; },
    requireRole(role){ return this.currentRole() === role; },
    getCases(){ return clone(loadCases()); },
    getCase(id){ return loadCases().find(c => c.id === id) || null; },
    getStudentCases(studentId='#1024'){ return loadCases().filter(c => c.studentId === studentId); },
    createCase(input){
      const cases = loadCases();
      const id = input.id || nextCaseId();
      const created = now();
      const risk = input.aiRisk || riskFromUrgency(input.urgency, input.type, input.incident);
      const c = {
        id, studentId: input.studentId || '#1024', grade: input.grade || 'ม.4', type: input.type || 'อื่น ๆ', incident: input.incident || '', urgency: input.urgency || riskLabel(risk), location: input.location || 'อาคาร B — ชั้น 2', time: input.time || timeFromIso(created), privacy: input.privacy || 'identity', aiRisk: risk, aiAnalysis: input.aiAnalysis || 'ตรวจพบสัญญาณที่ควรให้บุคลากรตรวจสอบต่อ', status: 'TEACHER_NOTIFIED', teacher: '', notes: '', timeline: [{status:'NEW',at:created},{status:'AI_ANALYZED',at:created},{status:'TEACHER_NOTIFIED',at:created}], createdAt: created
      };
      const existing = cases.findIndex(x => x.id === id);
      if (existing >= 0) cases[existing] = c; else cases.push(c);
      saveCases(cases);
      this.notify('teacher', `New ${riskLabel(risk)}-Risk Safety Report`, id);
      this.notify('admin', `Case #${id} has been created.`, id);
      return clone(c);
    },
    updateCase(id, patch){
      const cases = loadCases(); const i = cases.findIndex(c => c.id === id); if(i < 0) return null;
      const at = now();
      cases[i] = {...cases[i], ...clone(patch), updatedAt: patch.updatedAt || at};
      saveCases(cases);
      return clone(cases[i]);
    },
    acceptCase(id, teacher='ครู Demo'){
      const at = now();
      const updated = this.updateCase(id, {
        status:'ACCEPTED',
        teacher,
        acceptedAt:at,
        updatedAt:at,
        timeline:[...(this.getCase(id)?.timeline || []), {action:'ACCEPTED',status:'ACCEPTED',by:'Teacher',at}]
      });
      if (!updated) return null;
      this.notify('student', 'Your report has been accepted by a teacher.', id);
      this.notify('admin', `Case #${id} has been updated.`, id);
      return updated;
    },
    setStatus(id,status,notes='',by='Teacher'){
      const current=this.getCase(id); if(!current)return null;
      const at=now();
      const updated=this.updateCase(id,{
        status,
        ...(notes?{notes}:{}),
        updatedAt:at,
        timeline:[...(current.timeline||[]), {action:status,status,by,at}]
      });
      if(updated){
        this.notify('student', `Case #${id}: ${this.statusLabel[status] || status}`, id);
        this.notify('admin', `Case #${id} has been updated.`, id);
      }
      return updated;
    },

    notify(role,message,caseId){
      const items=loadNotifications(); items.push({id:`N-${Date.now()}-${Math.random().toString(16).slice(2)}`,role,message,caseId,at:now(),read:false}); saveNotifications(items);
    },
    consumeNotifications(role){
      const items=loadNotifications(); const mine=items.filter(n=>n.role===role && !n.read); if(!mine.length)return [];
      const ids=new Set(mine.map(n=>n.id)); saveNotifications(items.map(n=>ids.has(n.id)?{...n,read:true}:n)); return mine;
    },
    metrics(){
      const cases=loadCases();
      return {total:cases.length, critical:cases.filter(c=>c.aiRisk==='CRITICAL').length, high:cases.filter(c=>c.aiRisk==='HIGH').length, pending:cases.filter(c=>!['RESOLVED'].includes(c.status)).length, resolved:cases.filter(c=>c.status==='RESOLVED').length};
    },
    pattern(){
      const cases=loadCases();
      const locationCounts={}, typeCounts={}, hourCounts={};
      cases.forEach(c=>{locationCounts[c.location]=(locationCounts[c.location]||0)+1; typeCounts[c.type]=(typeCounts[c.type]||0)+1; const h=Number(String(c.time||'').split(':')[0]); if(!Number.isNaN(h)) hourCounts[h]=(hourCounts[h]||0)+1;});
      const top = obj => Object.entries(obj).sort((a,b)=>b[1]-a[1])[0] || ['-',0];
      const [location,locationCount]=top(locationCounts); const [type,typeCount]=top(typeCounts); const [hour,hourCount]=top(hourCounts); const start=String(hour).padStart(2,'0'); const end=String((Number(hour)+1)%24).padStart(2,'0');
      return {location,locationCount,type,typeCount,peakTime: hour==='-'?'-':`${start}:00–${end}:00`,peakCount:hourCount, repeated:locationCount>=2 || typeCount>=2};
    },
    startSync(callback, intervalMs=900){
      if (typeof callback !== 'function') return () => {};
      let last='';
      const signature=()=>{ try{return JSON.stringify(loadCases());}catch(e){return '';} };
      const check=()=>{ const next=signature(); if(last && next!==last) callback(); last=next; };
      last=signature();
      const onStorage=()=>check();
      const onCustom=()=>check();
      window.addEventListener('storage', onStorage);
      window.addEventListener('asg:cases-updated', onCustom);
      const timer=setInterval(check, intervalMs);
      return ()=>{window.removeEventListener('storage',onStorage);window.removeEventListener('asg:cases-updated',onCustom);clearInterval(timer);};
    },
    cloudStatus(){ return {configured:cloudConfigured(), connected:!!cloudReady, lastSync:cloudLastSync}; },
    refreshFromCloud(){ return cloudHydrate(); },
    locationRisk(location){
      const cases=loadCases().filter(c=>c.location===location); const count=cases.length; const critical=cases.some(c=>c.aiRisk==='CRITICAL'); const high=cases.some(c=>c.aiRisk==='HIGH'); const level=critical?'CRITICAL':high||count>=2?'HIGH':count===1?'WATCH':'SAFE';
      const typeCounts={}; cases.forEach(c=>typeCounts[c.type]=(typeCounts[c.type]||0)+1); const type=Object.entries(typeCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'อื่น ๆ';
      const hours={}; cases.forEach(c=>{const h=Number(String(c.time).split(':')[0]); if(!Number.isNaN(h))hours[h]=(hours[h]||0)+1;}); const top=Object.entries(hours).sort((a,b)=>b[1]-a[1])[0]; const peak=top?`${String(top[0]).padStart(2,'0')}:00–${String((Number(top[0])+1)%24).padStart(2,'0')}:00`:'-';
      return {count,level,type,peak};
    }
  };
  window.ASG = ASG;
  initCloud();
})(window);
