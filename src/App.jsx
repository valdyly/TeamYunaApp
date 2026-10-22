import { useState, useEffect } from 'react';
import { 
  Users, FolderPlus, FileText, LayoutDashboard,
  Printer, Trash2, Building2, BarChart3, Download, Search, AlertCircle, CheckSquare, Square, Upload, Menu, X,
  Rabbit, Cat, Sparkles, Heart, Star, Smile
} from 'lucide-react';

// Import logo dari folder assets
import logoImg from './assets/logo.png';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Master Data Talent / Dubber
  const [talents, setTalents] = useState(() => {
    try {
      const saved = localStorage.getItem('yuna_talents');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Data Proyek VOVA
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('yuna_projects');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Data Klien & Invoice B2B
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('yuna_clients');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('yuna_invoices');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Riwayat Kasbon Audit Trail dengan CRUD
  const [cashbonHistory, setCashbonHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('yuna_cashbon_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // State Form CRUD Audit Trail Kasbon
  const [editingCashbonId, setEditingCashbonId] = useState(null);
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);
  const [historyTalentName, setHistoryTalentName] = useState('');
  const [historyType, setHistoryType] = useState('Ambil Kasbon');
  const [historyAmount, setHistoryAmount] = useState('');

  // State Form Proyek
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectDate, setProjectDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectDeadline, setProjectDeadline] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [paypalRate, setPaypalRate] = useState(17300);
  const [selectedTalents, setSelectedTalents] = useState([]);

  // State Master Talent
  const [editingTalentId, setEditingTalentId] = useState(null);
  const [newTalentName, setNewTalentName] = useState('');
  const [newTalentBank, setNewTalentBank] = useState('BCA');
  const [newTalentRek, setNewTalentRek] = useState('');
  const [newTalentAn, setNewTalentAn] = useState('');
  const [newTalentRate, setNewTalentRate] = useState(3);
  const [newTalentCashbon, setNewTalentCashbon] = useState(0);

  // State Form Klien
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [clientContact, setClientContact] = useState('');

  // State Invoice Klien (Support USD & IDR)
  const [invClient, setInvClient] = useState('');
  const [invTitle, setInvTitle] = useState('');
  const [invCurrency, setInvCurrency] = useState('USD');
  const [invAmount, setInvAmount] = useState('');
  const [invExchangeRate, setInvExchangeRate] = useState(17300);
  const [invDueDate, setInvDueDate] = useState('');
  const [invStatus, setInvStatus] = useState('Belum Lunas');

  // State Resi Cetak (Sinkron dengan ID Talent)
  const [multiClientName, setMultiClientName] = useState('');
  const [multiTalentId, setMultiTalentId] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [manualSlipDate, setManualSlipDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualInvoiceNo, setManualInvoiceNo] = useState('01-IX.X-2026');

  // State Filter Bulanan & Rekap
  const [selectedMonthFilter, setSelectedMonthFilter] = useState('ALL');
  const [selectedReportClient, setSelectedReportClient] = useState('');
  const [selectedReportProjectId, setSelectedReportProjectId] = useState('');

  // State Search
  const [searchDashboardProject, setSearchDashboardProject] = useState('');
  const [searchMasterTalent, setSearchMasterTalent] = useState('');

  // Auto-Save LocalStorage
  useEffect(() => { localStorage.setItem('yuna_talents', JSON.stringify(talents)); }, [talents]);
  useEffect(() => { localStorage.setItem('yuna_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('yuna_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('yuna_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('yuna_cashbon_history', JSON.stringify(cashbonHistory)); }, [cashbonHistory]);

  // --- EKSPOR BACKUP DATA FILE JSON (DESKTOP & MOBILE COMPATIBLE) ---
  const handleExportBackup = async () => {
    try {
      const fullData = { talents, projects, clients, invoices, cashbonHistory, exportedAt: new Date().toISOString() };
      const jsonString = JSON.stringify(fullData, null, 2);
      const fileName = `Backup_TeamYunaDub_${new Date().toISOString().split('T')[0]}.json`;

      // 1. Cek jika di lingkungan Electron (Desktop)
      if (window.require) {
        try {
          const { ipcRenderer } = window.require('electron');
          const result = await ipcRenderer.invoke('save-backup-file', fileName, jsonString);
          if (result && result.success) {
            alert(`Backup berhasil disimpan di:\n${result.filePath}`);
            return;
          }
        } catch (e) {
          console.warn('Fallback dari Electron IPC');
        }
      }

      // 2. Cek jika di lingkungan Capacitor (Android/iOS Mobile)
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        try {
          const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem');
          await Filesystem.writeFile({
            path: fileName,
            data: jsonString,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
          alert(`Backup JSON berhasil disimpan di Folder Dokumen HP:\n${fileName}`);
          return;
        } catch (e) {
          console.warn('Fallback dari Capacitor Filesystem');
        }
      }

      // 3. Fallback standar Browser (Web Download)
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      downloadAnchor.download = fileName;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal membuat file backup: ' + err.message);
    }
  };

  const handleImportBackup = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed && typeof parsed === 'object') {
            if (Array.isArray(parsed.talents)) setTalents(parsed.talents);
            if (Array.isArray(parsed.projects)) setProjects(parsed.projects);
            if (Array.isArray(parsed.clients)) setClients(parsed.clients);
            if (Array.isArray(parsed.invoices)) setInvoices(parsed.invoices);
            if (Array.isArray(parsed.cashbonHistory)) setCashbonHistory(parsed.cashbonHistory);
            alert('Data berhasil di-restore dari file JSON!');
          }
        } catch (err) {
          alert('Format file backup tidak valid!');
        }
      };
    }
  };

  // --- KONTROL TALENT ---
  const handleSaveTalent = (e) => {
    e.preventDefault();
    if (!newTalentName.trim()) return;

    if (editingTalentId) {
      setTalents(talents.map(t => t.id === editingTalentId ? {
        ...t, name: newTalentName.trim(), bank: newTalentBank, noRek: newTalentRek.trim(), atasNama: newTalentAn.trim() || newTalentName.trim(), rateUSD: Number(newTalentRate) || 0, cashbon: Number(newTalentCashbon) || 0
      } : t));
      setEditingTalentId(null);
      alert('Data talent berhasil diperbarui!');
    } else {
      const talent = {
        id: Date.now(), name: newTalentName.trim(), bank: newTalentBank, noRek: newTalentRek.trim(), atasNama: newTalentAn.trim() || newTalentName.trim(), rateUSD: Number(newTalentRate) || 3, cashbon: Number(newTalentCashbon) || 0
      };
      setTalents([...talents, talent]);
      alert('Master talent berhasil ditambahkan!');
    }

    setNewTalentName('');
    setNewTalentBank('BCA');
    setNewTalentRek('');
    setNewTalentAn('');
    setNewTalentRate(3);
    setNewTalentCashbon(0);
  };

  const handleEditTalent = (t) => {
    setEditingTalentId(t.id);
    setNewTalentName(t.name);
    setNewTalentBank(t.bank);
    setNewTalentRek(t.noRek);
    setNewTalentAn(t.atasNama);
    setNewTalentRate(t.rateUSD);
    setNewTalentCashbon(t.cashbon);
  };

  const handleDeleteTalent = (id) => {
    if (confirm('Yakin ingin menghapus talent ini dari master data?')) {
      setTalents(talents.filter(t => t.id !== id));
    }
  };

  // --- KONTROL CRUD RIWAYAT KASBON (AUDIT TRAIL) ---
  const handleSaveCashbonHistory = (e) => {
    e.preventDefault();
    if (!historyTalentName || !historyAmount) return;

    const amt = Number(historyAmount);

    if (editingCashbonId) {
      setCashbonHistory(cashbonHistory.map(item => item.id === editingCashbonId ? {
        ...item,
        date: historyDate,
        talentName: historyTalentName,
        type: historyType,
        amount: amt
      } : item));
      setEditingCashbonId(null);
      alert('Riwayat kasbon berhasil diperbarui!');
    } else {
      const newItem = {
        id: Date.now(),
        date: historyDate,
        talentName: historyTalentName,
        type: historyType,
        amount: amt
      };
      setCashbonHistory([newItem, ...cashbonHistory]);
      alert('Riwayat kasbon berhasil ditambahkan!');
    }

    setHistoryDate(new Date().toISOString().split('T')[0]);
    setHistoryTalentName('');
    setHistoryType('Ambil Kasbon');
    setHistoryAmount('');
  };

  const handleEditCashbonHistory = (item) => {
    setEditingCashbonId(item.id);
    setHistoryDate(item.date);
    setHistoryTalentName(item.talentName);
    setHistoryType(item.type);
    setHistoryAmount(item.amount);
  };

  const handleDeleteCashbonHistory = (id) => {
    if (confirm('Yakin ingin menghapus riwayat transaksi kasbon ini?')) {
      setCashbonHistory(cashbonHistory.filter(item => item.id !== id));
    }
  };

  // --- KONTROL KLIEN & INVOICE ---
  const handleSaveClient = (e) => {
    e.preventDefault();
    if (!clientCompanyName.trim()) return;
    
    const isExist = clients.some(c => c.name.toLowerCase() === clientCompanyName.trim().toLowerCase());
    if (isExist) {
      alert('Nama klien ini sudah terdaftar!');
      return;
    }

    setClients([...clients, { id: Date.now(), name: clientCompanyName.trim(), contact: clientContact.trim() }]);
    setClientCompanyName('');
    setClientContact('');
    alert('Klien berhasil ditambahkan!');
  };

  const handleDeleteClient = (id) => {
    if (confirm('Yakin ingin menghapus klien ini?')) {
      setClients(clients.filter(c => c.id !== id));
    }
  };

  const handleSaveInvoice = (e) => {
    e.preventDefault();
    if (!invClient || !invTitle.trim() || !invAmount) return;

    const rawAmount = Number(invAmount) || 0;
    const finalAmountIDR = invCurrency === 'USD' ? rawAmount * Number(invExchangeRate) : rawAmount;

    setInvoices([...invoices, {
      id: 'INV-' + Date.now().toString().slice(-6),
      client: invClient,
      title: invTitle.trim(),
      currency: invCurrency,
      originalAmount: rawAmount,
      exchangeRate: Number(invExchangeRate),
      amount: finalAmountIDR,
      dueDate: invDueDate || new Date().toISOString().split('T')[0],
      status: invStatus
    }]);

    setInvClient('');
    setInvTitle('');
    setInvAmount('');
    setInvDueDate('');
    setInvStatus('Belum Lunas');
    alert('Invoice B2B klien berhasil diterbitkan!');
  };

  // --- KONTROL PROYEK & SINKRONISASI KASBON ---
  const handleAddTalentToProject = (talentId) => {
    const t = talents.find(item => item.id === Number(talentId));
    if (!t) return;
    setSelectedTalents([...selectedTalents, {
      talentId: t.id,
      name: t.name,
      role: '',
      minutes: 0,
      seconds: 0,
      rateUSD: t.rateUSD,
      bonusIDR: 0,
      cashbonCut: 0,
      status: 'Belum Upload',
      paymentStatus: 'Belum Dibayar',
      audioLink: ''
    }]);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectName.trim() || selectedTalents.length === 0) {
      alert('Mohon isi nama proyek dan minimal pilih 1 talent!');
      return;
    }

    let updatedTalents = [...talents];
    let newHistoryEntries = [];

    if (editingProjectId) {
      const oldProj = projects.find(p => p.id === editingProjectId);
      if (oldProj) {
        oldProj.talentsData.forEach(oldSt => {
          if (oldSt.cashbonCut > 0) {
            updatedTalents = updatedTalents.map(t => t.id === oldSt.talentId ? { ...t, cashbon: t.cashbon + Number(oldSt.cashbonCut) } : t);
          }
        });
      }

      selectedTalents.forEach(st => {
        if (st.cashbonCut > 0) {
          updatedTalents = updatedTalents.map(t => {
            if (t.id === st.talentId) {
              return { ...t, cashbon: Math.max(0, t.cashbon - Number(st.cashbonCut)) };
            }
            return t;
          });
          newHistoryEntries.push({
            id: Date.now() + Math.random(),
            date: projectDate,
            talentName: st.name,
            amount: Number(st.cashbonCut),
            type: `Potongan Proyek (${projectName})`
          });
        }
      });

      setProjects(projects.map(p => p.id === editingProjectId ? {
        ...p,
        projectName: projectName.trim(),
        clientName: clientName || 'Klien Umum',
        date: projectDate,
        deadline: projectDeadline,
        notes: revisionNotes.trim(),
        paypalRate: Number(paypalRate) || 17300,
        talentsData: selectedTalents
      } : p));
      setEditingProjectId(null);
      alert('Data proyek berhasil diperbarui!');
    } else {
      const newPrj = {
        id: 'PRJ-' + Date.now(),
        projectName: projectName.trim(),
        clientName: clientName || 'Klien Umum',
        date: projectDate,
        deadline: projectDeadline,
        notes: revisionNotes.trim(),
        paypalRate: Number(paypalRate) || 17300,
        talentsData: selectedTalents
      };

      selectedTalents.forEach(st => {
        if (st.cashbonCut > 0) {
          updatedTalents = updatedTalents.map(t => {
            if (t.id === st.talentId) {
              return { ...t, cashbon: Math.max(0, t.cashbon - Number(st.cashbonCut)) };
            }
            return t;
          });
          newHistoryEntries.push({
            id: Date.now() + Math.random(),
            date: projectDate,
            talentName: st.name,
            amount: Number(st.cashbonCut),
            type: `Potongan Proyek (${projectName})`
          });
        }
      });

      setProjects([...projects, newPrj]);
      alert('Proyek berhasil disimpan!');
    }

    setTalents(updatedTalents);
    if (newHistoryEntries.length > 0) {
      setCashbonHistory([...newHistoryEntries, ...cashbonHistory]);
    }

    setProjectName('');
    setClientName('');
    setProjectDate(new Date().toISOString().split('T')[0]);
    setProjectDeadline('');
    setRevisionNotes('');
    setSelectedTalents([]);
    setActiveTab('dashboard');
  };

  const handleEditProject = (p) => {
    setEditingProjectId(p.id);
    setProjectName(p.projectName);
    setClientName(p.clientName);
    setProjectDate(p.date || new Date().toISOString().split('T')[0]);
    setProjectDeadline(p.deadline || '');
    setRevisionNotes(p.notes || '');
    setPaypalRate(p.paypalRate);
    setSelectedTalents(p.talentsData);
    setActiveTab('input-project');
  };

  const handleDeleteProject = (id) => {
    if (confirm('Yakin ingin menghapus riwayat proyek ini? Saldo kasbon talent yang dipotong pada proyek ini akan dikembalikan ke master talent.')) {
      const targetProj = projects.find(p => p.id === id);
      if (targetProj) {
        let updatedTalents = [...talents];
        targetProj.talentsData.forEach(st => {
          if (st.cashbonCut > 0) {
            updatedTalents = updatedTalents.map(t => t.id === st.talentId ? { ...t, cashbon: t.cashbon + Number(st.cashbonCut) } : t);
          }
        });
        setTalents(updatedTalents);
      }
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  // --- FILTER BULANAN PROYEK ---
  const filteredProjectsByMonth = projects.filter(p => {
    if (selectedMonthFilter === 'ALL') return true;
    if (!p.date) return false;
    return p.date.substring(0, 7) === selectedMonthFilter;
  });

  // --- KALKULASI FINANSIAL ---
  const currentTalentMaster = talents.find(t => t.id === Number(multiTalentId));

  const getCalculatedValues = (item, rate) => {
    if (!item) return { decMin: 0, totalUSD: 0, grossIDR: 0, totalNetIDR: 0 };
    const decMin = Number(item.minutes) + (Number(item.seconds) / 60);
    const totalUSD = decMin * Number(item.rateUSD);
    const grossIDR = totalUSD * Number(rate);
    const totalNetIDR = grossIDR + Number(item.bonusIDR || 0) - Number(item.cashbonCut || 0);
    return { decMin, totalUSD, grossIDR, totalNetIDR };
  };

  const totalPenggajianGlobal = filteredProjectsByMonth.reduce((acc, p) => {
    const projSum = p.talentsData.reduce((sub, st) => {
      const calc = getCalculatedValues(st, p.paypalRate);
      return sub + calc.totalNetIDR;
    }, 0);
    return acc + projSum;
  }, 0);

  const totalPendapatanKlien = invoices
    .filter(inv => inv.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const profitBersihAgensi = totalPendapatanKlien - totalPenggajianGlobal;

  // --- REKAP LAPORAN ---
  const allClientProjects = projects.filter(p => p.clientName === selectedReportClient);
  const filteredReportProjects = selectedReportProjectId ? allClientProjects.filter(p => p.id === selectedReportProjectId) : allClientProjects;
  const clientInvoices = invoices.filter(inv => inv.client === selectedReportClient);
  const clientTotalRevenue = clientInvoices.filter(inv => inv.status === 'Lunas').reduce((acc, curr) => acc + curr.amount, 0);
  const clientTotalPayroll = filteredReportProjects.reduce((acc, p) => {
    return acc + p.talentsData.reduce((sub, st) => sub + getCalculatedValues(st, p.paypalRate).totalNetIDR, 0);
  }, 0);
  const clientNetProfit = clientTotalRevenue - clientTotalPayroll;

  // --- EKSPOR CSV TERFORMAT BERKOLOM RAPI (EXCEL COMPATIBLE) ---
  const handleExportCSV = () => {
    if (!selectedReportClient) return;

    // Tambahkan Byte Order Mark (BOM) UTF-8 agar Excel membaca karakter dan kolom secara otomatis
    let csvString = "\uFEFF";

    // Helper untuk escape tanda petik ganda
    const cleanCell = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    // Header Ringkasan Klien
    csvString += `${cleanCell("LAPORAN KLIEN")},${cleanCell(selectedReportClient)}\n`;
    csvString += `${cleanCell("Total Pendapatan (Revenue)")},${cleanCell("Rp " + clientTotalRevenue.toLocaleString('id-ID'))}\n`;
    csvString += `${cleanCell("Total Gaji Talent (Payroll)")},${cleanCell("Rp " + Math.round(clientTotalPayroll).toLocaleString('id-ID'))}\n`;
    csvString += `${cleanCell("Profit Bersih Agensi")},${cleanCell("Rp " + Math.round(clientNetProfit).toLocaleString('id-ID'))}\n\n`;

    // Iterasi Proyek
    filteredReportProjects.forEach(proj => {
      csvString += `${cleanCell("NAMA PROYEK")},${cleanCell(proj.projectName)},${cleanCell("TANGGAL")},${cleanCell(proj.date)},${cleanCell("KURS PAYPAL")},${cleanCell("Rp " + proj.paypalRate.toLocaleString('id-ID'))}\n`;
      
      // Table Header Berkolom
      csvString += [
        cleanCell("Nama Dubber"),
        cleanCell("Peran"),
        cleanCell("Status Gaji"),
        cleanCell("Durasi Teks"),
        cleanCell("Durasi (Menit)"),
        cleanCell("Rate ($/min)"),
        cleanCell("Total ($)"),
        cleanCell("Bonus (IDR)"),
        cleanCell("Potong Kasbon (IDR)"),
        cleanCell("Total Bersih (IDR)")
      ].join(",") + "\n";

      let projTotalUSD = 0;
      let projTotalIDR = 0;

      proj.talentsData.forEach((t) => {
        const calc = getCalculatedValues(t, proj.paypalRate);
        projTotalUSD += calc.totalUSD;
        projTotalIDR += calc.totalNetIDR;
        const durasiText = `${t.minutes || 0}m ${t.seconds || 0}s`;

        csvString += [
          cleanCell(t.name),
          cleanCell(t.role || "-"),
          cleanCell(t.paymentStatus || "Belum Dibayar"),
          cleanCell(durasiText),
          cleanCell(calc.decMin.toFixed(2)),
          cleanCell(t.rateUSD),
          cleanCell("$" + calc.totalUSD.toFixed(2)),
          cleanCell(t.bonusIDR || 0),
          cleanCell(t.cashbonCut || 0),
          cleanCell(Math.round(calc.totalNetIDR))
        ].join(",") + "\n";
      });

      csvString += `${cleanCell("TOTAL PROYEK")},,,,,${cleanCell("$" + projTotalUSD.toFixed(2))},,,${cleanCell("Rp " + Math.round(projTotalIDR).toLocaleString('id-ID'))}\n\n`;
    });

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Dub_${selectedReportClient.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getDeadlineBadge = (deadlineStr) => {
    if (!deadlineStr) return <span className="text-pink-300">Tanpa Deadline</span>;
    const today = new Date().toISOString().split('T')[0];
    if (deadlineStr < today) {
      return <span className="bg-rose-900/60 text-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit border border-rose-700/50"><AlertCircle size={12} /> Terlewat ({deadlineStr})</span>;
    } else if (deadlineStr === today) {
      return <span className="bg-amber-500/20 text-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit border border-amber-500/40"><AlertCircle size={12} /> Hari Ini!</span>;
    } else {
      return <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold w-fit border border-emerald-500/30">{deadlineStr}</span>;
    }
  };

  const availableMultiProjects = projects.filter(p => 
    p.clientName === multiClientName && 
    p.talentsData.some(t => t.talentId === Number(multiTalentId))
  );

  const toggleSelectProject = (id) => {
    setSelectedProjectIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#5b5264] font-sans flex flex-col text-pink-100 relative overflow-x-hidden">
      
      {/* CSS STYLING UNTUK ANIMASI SAKURA & CETAK PDF RAPI */}
      <style>{`
        @keyframes sakuraFall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(80px) rotate(360deg); opacity: 0; }
        }
        .sakura-petal {
          position: fixed;
          top: -20px;
          background: linear-gradient(135deg, #ffb7c5 0%, #ffc0cb 100%);
          border-radius: 150% 0 150% 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.7;
          box-shadow: 0 0 5px rgba(255, 183, 197, 0.4);
          animation: sakuraFall linear infinite;
        }
        @media print {
          body * { visibility: hidden; }
          #receipt-template, #receipt-template * { visibility: visible; }
          #receipt-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>

      {/* ELEMEN KELOPAK SAKURA BERJATUHAN */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 print:hidden">
        <div className="sakura-petal" style={{ left: '5%', width: '12px', height: '8px', animationDuration: '9s', animationDelay: '0s' }}></div>
        <div className="sakura-petal" style={{ left: '18%', width: '16px', height: '10px', animationDuration: '12s', animationDelay: '2s' }}></div>
        <div className="sakura-petal" style={{ left: '32%', width: '10px', height: '7px', animationDuration: '8s', animationDelay: '4s' }}></div>
        <div className="sakura-petal" style={{ left: '45%', width: '14px', height: '9px', animationDuration: '14s', animationDelay: '1s' }}></div>
        <div className="sakura-petal" style={{ left: '60%', width: '12px', height: '8px', animationDuration: '10s', animationDelay: '3s' }}></div>
        <div className="sakura-petal" style={{ left: '75%', width: '15px', height: '10px', animationDuration: '11s', animationDelay: '5s' }}></div>
        <div className="sakura-petal" style={{ left: '88%', width: '11px', height: '7px', animationDuration: '13s', animationDelay: '2.5s' }}></div>
        <div className="sakura-petal" style={{ left: '95%', width: '13px', height: '9px', animationDuration: '9.5s', animationDelay: '0.5s' }}></div>
      </div>

      {/* MOBILE TOP BAR */}
      <div className="bg-[#483f51] text-pink-100 p-4 flex items-center justify-between shadow-lg border-b border-pink-900/20 print:hidden shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#393141] border border-amber-400/50 flex items-center justify-center font-bold text-amber-300 shrink-0 overflow-hidden shadow-inner">
            <img src={logoImg} alt="Team Yuna Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-pink-50 flex items-center gap-1.5">
              TEAM YUNA DUB <Rabbit size={16} className="text-pink-300 inline animate-bounce" />
            </span>
            <span className="text-[10px] text-amber-300 font-medium block">Payroll Application</span>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#2a2232] transition font-bold flex items-center gap-1.5 text-xs shadow-md ml-auto"
        >
          Menu {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION / DRAWER */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-[#3c3344] text-pink-100 p-6 flex flex-col justify-between print:hidden shadow-2xl shrink-0 transition-transform duration-300 ease-in-out border-l border-pink-900/20
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8 border-b border-pink-900/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2a2232] border border-amber-400/60 flex items-center justify-center font-bold text-amber-300 shrink-0 overflow-hidden shadow">
                <img src={logoImg} alt="Team Yuna Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-pink-50 leading-tight flex items-center gap-1">
                  TEAM YUNA <Cat size={14} className="text-pink-300" />
                </h1>
                <p className="text-[11px] text-pink-300/70 mt-0.5">VO / VA Studio 🌸</p>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-pink-300/60 hover:text-white p-1">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'dashboard' ? 'bg-amber-400 text-[#2a2232] shadow-md font-bold' : 'hover:bg-[#4a4053] text-pink-200'}`}>
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button onClick={() => { setActiveTab('talents'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'talents' ? 'bg-amber-400 text-[#2a2232] shadow-md font-bold' : 'hover:bg-[#4a4053] text-pink-200'}`}>
              <Users size={18} /> Master Talent & Kasbon
            </button>
            <button onClick={() => { setActiveTab('invoices'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'invoices' ? 'bg-amber-400 text-[#2a2232] shadow-md font-bold' : 'hover:bg-[#4a4053] text-pink-200'}`}>
              <Building2 size={18} /> Klien & Invoice B2B
            </button>
            <button onClick={() => { setEditingProjectId(null); setProjectName(''); setSelectedTalents([]); setActiveTab('input-project'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'input-project' ? 'bg-amber-400 text-[#2a2232] shadow-md font-bold' : 'hover:bg-[#4a4053] text-pink-200'}`}>
              <FolderPlus size={18} /> Input Proyek & Workflow
            </button>
            <button onClick={() => { setActiveTab('payslips'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'payslips' ? 'bg-amber-400 text-[#2a2232] shadow-md font-bold' : 'hover:bg-[#4a4053] text-pink-200'}`}>
              <FileText size={18} /> Resi & Invoice Talent
            </button>
            <button onClick={() => { setActiveTab('client-report'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${activeTab === 'client-report' ? 'bg-amber-400 text-[#2a2232] shadow-md font-bold' : 'hover:bg-[#4a4053] text-pink-200'}`}>
              <BarChart3 size={18} /> Rekap Klien & Profit
            </button>
          </nav>
        </div>

        {/* UTILITAS BACKUP DATA FILE JSON */}
        <div className="border-t border-pink-900/30 pt-4 space-y-2 mt-6 relative z-10">
          <p className="text-[10px] text-pink-300/80 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} /> Backup & Restore (JSON)
          </p>
          <div className="flex gap-2">
            <button onClick={handleExportBackup} className="flex-1 bg-[#2a2232] hover:bg-[#201927] text-pink-200 p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-pink-900/30">
              <Download size={14} /> Backup
            </button>
            <label className="flex-1 bg-[#2a2232] hover:bg-[#201927] text-pink-200 p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition border border-pink-900/30">
              <Upload size={14} /> Restore
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
          <p className="text-[10px] text-pink-300/40 text-center pt-2">Team Yuna Dub • v6.0</p>
        </div>
      </aside>

      {/* OVERLAY GELAP */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm print:hidden"
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto print:p-0 print:bg-white w-full max-w-7xl mx-auto relative z-10">
        
        {/* TAB 1 DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-pink-50 flex items-center gap-2">
                  Dashboard Agensi <Cat size={20} className="text-pink-300" /> <Star size={16} className="text-amber-300" />
                </h2>
                <p className="text-xs text-pink-200/70 mt-0.5">Pusat kontrol finansial (USD Client ke IDR Talent), Profit Agensi, dan Status Pengerjaan.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-pink-200">Filter Periode</span>
                <select 
                  value={selectedMonthFilter} 
                  onChange={e => setSelectedMonthFilter(e.target.value)}
                  className="p-2 border border-pink-900/30 rounded-xl text-xs font-bold bg-[#6e6378] text-pink-50 shadow-sm flex-1 sm:flex-none focus:outline-none"
                >
                  <option value="ALL">Semua Periode (All-Time)</option>
                  {Array.from(new Set(projects.map(p => (p.date || '').substring(0, 7)))).filter(Boolean).sort().reverse().map(m => (
                    <option key={m} value={m}>Bulan {m}</option>
                  ))}
                </select>
                <button onClick={() => { setEditingProjectId(null); setProjectName(''); setSelectedTalents([]); setActiveTab('input-project'); }} className="bg-amber-400 hover:bg-amber-300 text-[#2a2232] font-bold px-4 py-2 rounded-xl text-xs shadow-md flex items-center gap-2 transition ml-auto sm:ml-2">
                  + Proyek Baru
                </button>
              </div>
            </div>
            
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#6f6479] p-4 rounded-2xl shadow-md border border-pink-300/10 relative overflow-hidden">
                <p className="text-[10px] text-pink-200/80 font-bold uppercase tracking-wider">Pendapatan Klien (USD & IDR)</p>
                <p className="text-xl font-extrabold text-emerald-300 mt-1">Rp {totalPendapatanKlien.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-pink-200/60 mt-0.5">Invoice B2B Terbayar</p>
                <Star size={16} className="absolute right-3 top-3 text-amber-300/30" />
              </div>
              <div className="bg-[#6f6479] p-4 rounded-2xl shadow-md border border-pink-300/10 relative overflow-hidden">
                <p className="text-[10px] text-pink-200/80 font-bold uppercase tracking-wider">Gaji Keluar Talent (Payroll IDR)</p>
                <p className="text-xl font-extrabold text-sky-300 mt-1">Rp {Math.round(totalPenggajianGlobal).toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-pink-200/60 mt-0.5">{selectedMonthFilter === 'ALL' ? 'Total Seluruh Proyek' : `Periode ${selectedMonthFilter}`}</p>
                <Cat size={18} className="absolute right-3 top-3 text-pink-300/30" />
              </div>
              <div className="bg-[#6f6479] p-4 rounded-2xl shadow-md border border-pink-300/10 relative overflow-hidden">
                <p className="text-[10px] text-pink-200/80 font-bold uppercase tracking-wider">Profit Bersih Agensi</p>
                <p className={`text-xl font-extrabold mt-1 ${profitBersihAgensi >= 0 ? 'text-pink-200' : 'text-rose-300'}`}>
                  Rp {Math.round(profitBersihAgensi).toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-pink-200/60 mt-0.5">Pendapatan - Gaji Talent</p>
                <Rabbit size={18} className="absolute right-3 top-3 text-pink-300/30" />
              </div>
              <div className="bg-[#6f6479] p-4 rounded-2xl shadow-md border border-pink-300/10 relative overflow-hidden">
                <p className="text-[10px] text-pink-200/80 font-bold uppercase tracking-wider">Total Kasbon Talent</p>
                <p className="text-xl font-extrabold text-amber-300 mt-1">
                  Rp {talents.reduce((acc, curr) => acc + (curr.cashbon || 0), 0).toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-pink-200/60 mt-0.5">Sisa Piutang Keseluruhan</p>
                <Smile size={18} className="absolute right-3 top-3 text-amber-300/30" />
              </div>
            </div>

            {/* TABEL PROYEK */}
            <div className="bg-[#6f6479] rounded-2xl shadow-md border border-pink-300/10 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="font-bold text-base text-pink-50 flex items-center gap-1.5">
                  Riwayat Proyek & Deadline Terbaru <Heart size={14} className="text-pink-300 inline" />
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 text-pink-300/60" size={14} />
                  <input 
                    type="text" 
                    placeholder="Cari proyek atau klien..." 
                    value={searchDashboardProject}
                    onChange={e => setSearchDashboardProject(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-100 placeholder-pink-300/40 focus:outline-none"
                  />
                </div>
              </div>

              {filteredProjectsByMonth.length === 0 ? (
                <p className="text-pink-200/50 text-xs py-2">Belum ada proyek tercatat pada periode ini.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[600px]">
                    <thead className="bg-[#5a5063] text-pink-200/80 border-b border-pink-900/30">
                      <tr>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">Klien</th>
                        <th className="p-2.5">Nama Proyek</th>
                        <th className="p-2.5">Deadline</th>
                        <th className="p-2.5">Talent & Status Gaji</th>
                        <th className="p-2.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-900/20">
                      {filteredProjectsByMonth
                        .slice()
                        .reverse()
                        .filter(p => p.projectName.toLowerCase().includes(searchDashboardProject.toLowerCase()) || p.clientName.toLowerCase().includes(searchDashboardProject.toLowerCase()))
                        .map(p => (
                        <tr key={p.id} className="hover:bg-[#786c82] transition">
                          <td className="p-2.5 text-pink-200/80">{p.date}</td>
                          <td className="p-2.5 font-medium text-pink-100">{p.clientName}</td>
                          <td className="p-2.5 font-bold text-pink-50">{p.projectName}</td>
                          <td className="p-2.5">{getDeadlineBadge(p.deadline)}</td>
                          <td className="p-2.5">
                            <div className="space-y-1">
                              {p.talentsData.map((st, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="font-semibold">{st.name}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${st.paymentStatus === 'Sudah Dibayar' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                                    {st.paymentStatus || 'Belum Dibayar'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-2.5 text-right space-x-1.5 whitespace-nowrap">
                            <button onClick={() => { setMultiClientName(p.clientName); setActiveTab('payslips'); }} className="bg-amber-400 text-[#2a2232] font-bold px-2.5 py-1 rounded-lg text-[11px]">Resi</button>
                            <button onClick={() => handleEditProject(p)} className="bg-sky-500/20 text-sky-200 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-sky-400/30">Edit</button>
                            <button onClick={() => handleDeleteProject(p.id)} className="bg-rose-500/20 text-rose-300 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-rose-500/30">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2 MASTER TALENT & AUDIT TRAIL KASBON */}
        {activeTab === 'talents' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-pink-50 flex items-center gap-2">
              Manajemen Master Talent & Sisa Kasbon <Cat size={20} className="text-pink-300" />
            </h2>

            <form onSubmit={handleSaveTalent} className="bg-[#6f6479] p-5 rounded-2xl shadow-md border border-pink-300/10 space-y-3">
              <h3 className="font-bold text-sm text-pink-50">{editingTalentId ? 'Edit Data Talent' : 'Tambah Talent Baru'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-pink-200 mb-1">Nama Dubber</label>
                  <input type="text" value={newTalentName} onChange={e => setNewTalentName(e.target.value)} required placeholder="Contoh: Seira" className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-pink-200 mb-1">Bank / E-Wallet</label>
                  <select value={newTalentBank} onChange={e => setNewTalentBank(e.target.value)} className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50">
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BNI">BNI</option>
                    <option value="BRI">BRI</option>
                    <option value="PayPal">PayPal</option>
                    <option value="SeaBank">SeaBank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-pink-200 mb-1">No. Rekening</label>
                  <input type="text" value={newTalentRek} onChange={e => setNewTalentRek(e.target.value)} placeholder="Nomor rekening" className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-pink-200 mb-1">Atas Nama</label>
                  <input type="text" value={newTalentAn} onChange={e => setNewTalentAn(e.target.value)} placeholder="Pemilik rekening" className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-300 mb-1">Rate Standar ($/60s)</label>
                  <input type="number" step="0.1" value={newTalentRate} onChange={e => setNewTalentRate(e.target.value)} required className="w-full p-2 border border-amber-400/40 rounded-xl text-xs font-bold text-amber-200 bg-[#5a5063]" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-rose-300 mb-1">Sisa Kasbon Aktif (IDR)</label>
                  <input type="number" value={newTalentCashbon} onChange={e => setNewTalentCashbon(e.target.value)} className="w-full p-2 border border-rose-400/40 rounded-xl text-xs text-rose-200 font-semibold bg-[#5a5063]" />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="bg-amber-400 hover:bg-amber-300 text-[#2a2232] font-bold px-4 py-2 rounded-xl text-xs transition">{editingTalentId ? 'Simpan Perubahan' : '+ Tambah Talent'}</button>
                {editingTalentId && <button type="button" onClick={() => setEditingTalentId(null)} className="bg-[#5a5063] text-pink-200 px-3 py-2 rounded-xl text-xs font-semibold">Batal</button>}
              </div>
            </form>

            <div className="bg-[#6f6479] rounded-2xl shadow-md border border-pink-300/10 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="font-bold text-base text-pink-50">Daftar Talent & Sisa Kasbon Aktif</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 text-pink-300/60" size={14} />
                  <input 
                    type="text" 
                    placeholder="Cari nama talent..." 
                    value={searchMasterTalent}
                    onChange={e => setSearchMasterTalent(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-100 placeholder-pink-300/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[500px]">
                  <thead className="bg-[#5a5063] text-pink-200/80 border-b border-pink-900/30">
                    <tr>
                      <th className="p-2.5">Nama Dubber</th>
                      <th className="p-2.5">Info Rekening</th>
                      <th className="p-2.5 text-center">Rate Standar</th>
                      <th className="p-2.5 text-center">Sisa Kasbon</th>
                      <th className="p-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-900/20">
                    {talents
                      .filter(t => t.name.toLowerCase().includes(searchMasterTalent.toLowerCase()))
                      .map(t => (
                      <tr key={t.id} className="hover:bg-[#786c82] transition">
                        <td className="p-2.5 font-bold text-pink-50">{t.name}</td>
                        <td className="p-2.5"><span className="font-semibold text-pink-100">{t.bank}</span> - {t.noRek} <br /><span className="text-[10px] text-pink-300/60">a.n {t.atasNama}</span></td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-300">${t.rateUSD} / 60s</td>
                        <td className="p-2.5 text-center font-mono text-rose-300 font-bold">Rp {(t.cashbon || 0).toLocaleString('id-ID')}</td>
                        <td className="p-2.5 text-right space-x-1.5 whitespace-nowrap">
                          <button onClick={() => handleEditTalent(t)} className="bg-sky-500/20 text-sky-200 font-bold px-2.5 py-1 rounded text-[11px] border border-sky-400/30">Edit</button>
                          <button onClick={() => handleDeleteTalent(t.id)} className="bg-rose-500/20 text-rose-300 font-bold px-2.5 py-1 rounded text-[11px] border border-rose-500/30">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AUDIT TRAIL RIWAYAT KASBON */}
            <div className="bg-[#6f6479] rounded-2xl shadow-md border border-pink-300/10 p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-pink-900/30 pb-3">
                <h3 className="font-bold text-sm text-pink-50">📜 Riwayat Potongan & Pelunasan Kasbon (Audit Trail & CRUD)</h3>
              </div>

              <form onSubmit={handleSaveCashbonHistory} className="bg-[#5a5063] p-4 rounded-xl border border-pink-900/20 space-y-3 text-xs">
                <p className="font-bold text-pink-200">{editingCashbonId ? '✏️ Edit Catatan Riwayat Kasbon' : '➕ Tambah Catatan Riwayat Kasbon Manual'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-pink-200 mb-1">Tanggal</label>
                    <input type="date" value={historyDate} onChange={e => setHistoryDate(e.target.value)} required className="w-full p-2 border border-pink-900/20 rounded-lg bg-[#483f51] text-pink-100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-pink-200 mb-1">Nama Talent</label>
                    <select value={historyTalentName} onChange={e => setHistoryTalentName(e.target.value)} required className="w-full p-2 border border-pink-900/20 rounded-lg bg-[#483f51] text-pink-100">
                      <option value="">-- Pilih Talent --</option>
                      {talents.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-pink-200 mb-1">Keterangan / Jenis</label>
                    <input type="text" value={historyType} onChange={e => setHistoryType(e.target.value)} placeholder="Contoh: Potongan Proyek / Ambil Kasbon" required className="w-full p-2 border border-pink-900/20 rounded-lg bg-[#483f51] text-pink-100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-pink-200 mb-1">Nominal (IDR)</label>
                    <input type="number" value={historyAmount === 0 ? '' : historyAmount} placeholder="0" onChange={e => setHistoryAmount(e.target.value === '' ? 0 : Number(e.target.value))} required className="w-full p-2 border border-pink-900/20 rounded-lg bg-[#483f51] text-pink-100 font-bold" />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="bg-amber-400 text-[#2a2232] font-bold px-4 py-1.5 rounded-lg">{editingCashbonId ? 'Simpan Perubahan' : 'Tambah Riwayat'}</button>
                  {editingCashbonId && <button type="button" onClick={() => { setEditingCashbonId(null); setHistoryTalentName(''); setHistoryAmount(''); }} className="bg-[#483f51] px-3 py-1.5 rounded-lg font-semibold text-pink-200">Batal</button>}
                </div>
              </form>

              {cashbonHistory.length === 0 ? (
                <p className="text-pink-200/50 text-xs">Belum ada riwayat potongan kasbon tercatat.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[500px]">
                    <thead className="bg-[#5a5063] text-pink-200/80 border-b border-pink-900/30">
                      <tr>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">Nama Talent</th>
                        <th className="p-2.5">Keterangan</th>
                        <th className="p-2.5 text-right">Nominal</th>
                        <th className="p-2.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-900/20">
                      {cashbonHistory.map(item => (
                        <tr key={item.id} className="hover:bg-[#786c82] transition">
                          <td className="p-2.5 text-pink-200/80">{item.date}</td>
                          <td className="p-2.5 font-bold text-pink-50">{item.talentName}</td>
                          <td className="p-2.5 text-pink-200">{item.type}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-rose-300">
                            Rp {(item.amount || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="p-2.5 text-right space-x-1.5 whitespace-nowrap">
                            <button onClick={() => handleEditCashbonHistory(item)} className="bg-sky-500/20 text-sky-200 font-bold px-2 py-0.5 rounded text-[11px] border border-sky-400/30">Edit</button>
                            <button onClick={() => handleDeleteCashbonHistory(item.id)} className="bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded text-[11px] border border-rose-500/30">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3 KLIEN & INVOICE B2B */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-pink-50 flex items-center gap-2">
              Manajemen Klien & Tagihan (Invoice B2B USD/IDR) <Star size={20} className="text-amber-300" />
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <form onSubmit={handleSaveClient} className="bg-[#6f6479] p-5 rounded-2xl shadow-md border border-pink-300/10 space-y-3">
                <h3 className="font-bold text-sm text-pink-50">Tambah Klien Baru</h3>
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">Nama Studio / Perusahaan Klien</label>
                  <input type="text" value={clientCompanyName} onChange={e => setClientCompanyName(e.target.value)} required placeholder="Contoh: Studio Animasi Nusantara" className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">Kontak / Email</label>
                  <input type="text" value={clientContact} onChange={e => setClientContact(e.target.value)} placeholder="Email atau No WA Klien" className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" />
                </div>
                <button type="submit" className="w-full bg-amber-400 text-[#2a2232] font-bold py-2 rounded-xl text-xs">Simpan Klien</button>
              </form>

              <form onSubmit={handleSaveInvoice} className="bg-[#6f6479] p-5 rounded-2xl shadow-md border border-pink-300/10 space-y-3">
                <h3 className="font-bold text-sm text-pink-50">Terbitkan Invoice Tagihan ke Klien</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 mb-1">Pilih Klien</label>
                    <select value={invClient} onChange={e => setInvClient(e.target.value)} required className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50">
                      <option value="">-- Pilih Klien --</option>
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 mb-1">Judul Tagihan</label>
                    <input type="text" value={invTitle} onChange={e => setInvTitle(e.target.value)} required placeholder="Dubbing Episode 1" className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 mb-1">Mata Uang</label>
                    <select value={invCurrency} onChange={e => setInvCurrency(e.target.value)} className="w-full p-2 border border-pink-900/20 rounded-xl text-xs font-bold bg-[#5a5063] text-amber-300">
                      <option value="USD">USD ($)</option>
                      <option value="IDR">IDR (Rp)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 mb-1">Nominal Tagihan</label>
                    <input type="number" step="any" value={invAmount} onChange={e => setInvAmount(e.target.value)} required placeholder={invCurrency === 'USD' ? 'Contoh 150' : 'Contoh 2500000'} className="w-full p-2 border border-pink-900/20 rounded-xl text-xs font-bold bg-[#5a5063] text-pink-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 mb-1">Kurs Konversi (IDR)</label>
                    <input type="number" value={invExchangeRate} onChange={e => setInvExchangeRate(e.target.value)} required disabled={invCurrency === 'IDR'} className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50 disabled:opacity-50" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 mb-1">Jatuh Tempo</label>
                    <input type="date" value={invDueDate} onChange={e => setInvDueDate(e.target.value)} className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-pink-200 mb-1">Status Pembayaran</label>
                    <select value={invStatus} onChange={e => setInvStatus(e.target.value)} className="w-full p-2 border border-pink-900/20 rounded-xl text-xs font-semibold bg-[#5a5063] text-pink-50">
                      <option value="Belum Lunas">Belum Lunas</option>
                      <option value="Lunas">Lunas (Paid)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-500/80 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition">Terbitkan Invoice B2B</button>
              </form>
            </div>

            <div className="bg-[#6f6479] rounded-2xl shadow-md border border-pink-300/10 p-5">
              <h3 className="font-bold text-base mb-3 text-pink-50">Daftar Master Klien Terdaftar</h3>
              {clients.length === 0 ? (
                <p className="text-pink-200/50 text-xs">Belum ada klien yang terdaftar.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[400px]">
                    <thead className="bg-[#5a5063] text-pink-200/80 border-b border-pink-900/30">
                      <tr>
                        <th className="p-2.5">Nama Klien / Studio</th>
                        <th className="p-2.5">Kontak</th>
                        <th className="p-2.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-900/20">
                      {clients.map((c) => (
                        <tr key={c.id} className="hover:bg-[#786c82] transition">
                          <td className="p-2.5 font-bold text-pink-50">{c.name}</td>
                          <td className="p-2.5 text-pink-200/80">{c.contact || '-'}</td>
                          <td className="p-2.5 text-right">
                            <button onClick={() => handleDeleteClient(c.id)} className="text-rose-300 text-[11px] font-bold bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 rounded-md transition">Hapus Klien</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-[#6f6479] rounded-2xl shadow-md border border-pink-300/10 p-5">
              <h3 className="font-bold text-base mb-3 text-pink-50">Daftar Tagihan Invoice Klien</h3>
              {invoices.length === 0 ? (
                <p className="text-pink-200/50 text-xs">Belum ada invoice yang diterbitkan.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[600px]">
                    <thead className="bg-[#5a5063] text-pink-200/80 border-b border-pink-900/30">
                      <tr>
                        <th className="p-2.5">No. Invoice</th>
                        <th className="p-2.5">Klien</th>
                        <th className="p-2.5">Keterangan</th>
                        <th className="p-2.5">Nilai Tagihan Asli</th>
                        <th className="p-2.5">Nilai Konversi (IDR)</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-pink-900/20">
                      {invoices.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-[#786c82] transition">
                          <td className="p-2.5 font-mono font-bold text-pink-100">{inv.id}</td>
                          <td className="p-2.5 font-medium text-pink-100">{inv.client}</td>
                          <td className="p-2.5 text-pink-200/90">{inv.title}</td>
                          <td className="p-2.5 font-mono font-bold text-amber-300">
                            {inv.currency === 'USD' ? `$${inv.originalAmount}` : `Rp ${inv.originalAmount.toLocaleString('id-ID')}`}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-emerald-300">Rp {inv.amount.toLocaleString('id-ID')}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'Lunas' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">
                            <button onClick={() => setInvoices(invoices.filter((_, i) => i !== idx))} className="text-rose-300 text-[11px] font-bold bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded">Hapus Invoice</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4 INPUT PROYEK */}
        {activeTab === 'input-project' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-pink-50 flex items-center gap-2">
                {editingProjectId ? 'Edit Data Proyek' : 'Input Proyek & Workflow'} <Heart size={20} className="text-pink-300" />
              </h2>
              {editingProjectId && (
                <button onClick={() => { setEditingProjectId(null); setProjectName(''); setSelectedTalents([]); setActiveTab('dashboard'); }} className="text-xs bg-[#5a5063] text-pink-200 px-3 py-1.5 rounded-lg font-semibold">Batal</button>
              )}
            </div>
            
            <form onSubmit={handleSaveProject} className="bg-[#6f6479] p-5 rounded-2xl shadow-md border border-pink-300/10 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">Nama Klien</label>
                  <select value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50">
                    <option value="">-- Pilih Klien --</option>
                    {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">Judul Proyek</label>
                  <input type="text" value={projectName} onChange={e => setProjectName(e.target.value)} required placeholder="Stokes Twin" className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">Tanggal Masuk</label>
                  <input type="date" value={projectDate} onChange={e => setProjectDate(e.target.value)} required className="w-full p-2 border border-pink-900/20 rounded-xl text-xs font-semibold bg-[#5a5063] text-pink-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">Deadline</label>
                  <input type="date" value={projectDeadline} onChange={e => setProjectDeadline(e.target.value)} className="w-full p-2 border border-pink-900/20 rounded-xl text-xs text-rose-300 font-semibold bg-[#5a5063]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-pink-200 mb-1">Kurs PayPal (IDR)</label>
                  <input type="number" value={paypalRate} onChange={e => setPaypalRate(e.target.value)} required className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50 font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">Catatan Revisi / Instruksi Khusus dari Klien</label>
                <textarea value={revisionNotes} onChange={e => setRevisionNotes(e.target.value)} placeholder="Contoh: Nada suara agak ditegaskan di menit ke-2..." className="w-full p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] text-pink-50" rows="2"></textarea>
              </div>

              <div className="border-t border-pink-900/30 pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                  <h3 className="font-bold text-sm text-pink-50">Daftar Dubber Terlibat & Status Gaji Talent</h3>
                  <select onChange={(e) => { handleAddTalentToProject(e.target.value); e.target.value = ""; }} className="w-full sm:w-auto p-2 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] font-semibold text-pink-100">
                    <option value="">+ Pilih & Tambahkan Talent</option>
                    {talents.map(t => (
                      <option key={t.id} value={t.id}>{t.name} (Sisa Kasbon Rp {(t.cashbon || 0).toLocaleString('id-ID')})</option>
                    ))}
                  </select>
                </div>

                {selectedTalents.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-pink-900/30 rounded-xl text-pink-200/40 text-xs">Belum ada talent yang ditambahkan.</div>
                ) : (
                  <div className="space-y-3">
                    {selectedTalents.map((item, idx) => {
                      const talentMaster = talents.find(t => t.id === item.talentId);
                      return (
                        <div key={idx} className="p-3.5 bg-[#5a5063] border border-pink-900/20 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center text-xs">
                          <div className="md:col-span-2">
                            <span className="font-bold block text-pink-50">{item.name}</span>
                            <span className="text-[10px] text-rose-300 font-medium">Kasbon Rp {(talentMaster?.cashbon || 0).toLocaleString('id-ID')}</span>
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[10px] font-semibold text-pink-200/70 block">Peran</label>
                            <input type="text" placeholder="MC" value={item.role} onChange={e => { const copy = [...selectedTalents]; copy[idx].role = e.target.value; setSelectedTalents(copy); }} className="w-full p-1 border border-pink-900/20 rounded-lg text-xs bg-[#483f51] text-pink-50" />
                          </div>
                          <div className="flex gap-1 md:col-span-2">
                            <div className="flex-1">
                              <label className="text-[10px] font-semibold text-pink-200/70 block">Menit</label>
                              <input type="number" value={item.minutes} onChange={e => { const copy = [...selectedTalents]; copy[idx].minutes = e.target.value; setSelectedTalents(copy); }} className="w-full p-1 border border-pink-900/20 rounded-lg text-xs bg-[#483f51] text-pink-50 text-center" />
                            </div>
                            <div className="flex-1">
                              <label className="text-[10px] font-semibold text-pink-200/70 block">Detik</label>
                              <input type="number" value={item.seconds} onChange={e => { const copy = [...selectedTalents]; copy[idx].seconds = e.target.value; setSelectedTalents(copy); }} className="w-full p-1 border border-pink-900/20 rounded-lg text-xs bg-[#483f51] text-pink-50 text-center" />
                            </div>
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[10px] font-semibold text-amber-300 block">Rate ($)</label>
                            <input type="number" step="0.1" value={item.rateUSD} onChange={e => { const copy = [...selectedTalents]; copy[idx].rateUSD = e.target.value; setSelectedTalents(copy); }} className="w-full p-1 border border-amber-400/30 rounded-lg text-xs bg-[#483f51] font-bold text-center text-amber-300" />
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[10px] font-semibold text-emerald-300 block">Bonus (Rp)</label>
                            <input 
                              type="number" 
                              value={item.bonusIDR === 0 ? '' : item.bonusIDR} 
                              placeholder="0"
                              onChange={e => { 
                                const copy = [...selectedTalents]; 
                                copy[idx].bonusIDR = e.target.value === '' ? 0 : Number(e.target.value); 
                                setSelectedTalents(copy); 
                              }} 
                              className="w-full p-1 border border-pink-900/20 rounded-lg text-xs bg-[#483f51] text-pink-50 text-center" 
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[10px] font-semibold text-rose-300 block">Potong Kasbon</label>
                            <input 
                              type="number" 
                              value={item.cashbonCut === 0 ? '' : item.cashbonCut} 
                              placeholder="0"
                              onChange={e => { 
                                const copy = [...selectedTalents]; 
                                copy[idx].cashbonCut = e.target.value === '' ? 0 : Number(e.target.value); 
                                setSelectedTalents(copy); 
                              }} 
                              className="w-full p-1 border border-rose-400/30 rounded-lg text-xs bg-[#483f51] font-bold text-center text-rose-300" 
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-[10px] font-semibold text-pink-200/70 block">Status Gaji</label>
                            <select value={item.paymentStatus || 'Belum Dibayar'} onChange={e => { const copy = [...selectedTalents]; copy[idx].paymentStatus = e.target.value; setSelectedTalents(copy); }} className="w-full p-1 border border-pink-900/20 rounded-lg text-[10px] bg-[#483f51] font-bold text-sky-300">
                              <option value="Belum Dibayar">Belum</option>
                              <option value="Sudah Dibayar">Lunas (Paid)</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-semibold text-pink-200/70 block">Status Audio</label>
                            <select value={item.status || 'Belum Upload'} onChange={e => { const copy = [...selectedTalents]; copy[idx].status = e.target.value; setSelectedTalents(copy); }} className="w-full p-1 border border-pink-900/20 rounded-lg text-[10px] bg-[#483f51] font-medium text-pink-50">
                              <option value="Belum Upload">Belum</option>
                              <option value="Sudah Upload">Sudah</option>
                              <option value="Perlu Redub">Redub</option>
                            </select>
                          </div>
                          <div className="md:col-span-1 text-right">
                            <button type="button" onClick={() => setSelectedTalents(selectedTalents.filter((_, i) => i !== idx))} className="text-rose-300 p-1"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-amber-400 text-[#2a2232] font-bold py-3 rounded-xl hover:bg-amber-300 text-xs transition shadow-md">Simpan Proyek Agensi</button>
            </form>
          </div>
        )}

        {/* TAB 5 RESI & INVOICE TALENT */}
        {activeTab === 'payslips' && (
          <div className="space-y-6">
            <div className="print:hidden space-y-4">
              <h2 className="text-xl font-bold text-pink-50 flex items-center gap-2">
                Resi & Slip Pembayaran Talent <Smile size={20} className="text-amber-300" />
              </h2>
              
              <div className="bg-[#6f6479] p-4 rounded-xl border border-pink-300/10 shadow-md text-xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-pink-200 mb-1">1. Pilih Klien</label>
                    <select value={multiClientName} onChange={e => { setMultiClientName(e.target.value); setMultiTalentId(''); setSelectedProjectIds([]); }} className="w-full p-2 border border-pink-900/20 rounded-xl font-medium bg-[#5a5063] text-pink-50">
                      <option value="">-- Pilih Nama Klien --</option>
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-pink-200 mb-1">2. Pilih Talent / Dubber</label>
                    <select value={multiTalentId} onChange={e => { setMultiTalentId(e.target.value); setSelectedProjectIds([]); }} disabled={!multiClientName} className="w-full p-2 border border-pink-900/20 rounded-xl font-medium bg-[#5a5063] text-pink-50 disabled:opacity-50">
                      <option value="">-- Pilih Nama Talent --</option>
                      {talents.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-pink-200 mb-1">3. Tanggal Pembuatan Resi</label>
                    <input type="date" value={manualSlipDate} onChange={e => setManualSlipDate(e.target.value)} className="w-full p-2 border border-pink-900/20 rounded-xl font-semibold bg-[#5a5063] text-pink-50" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-pink-200 mb-1">4. Batch / No. Resi (Manual)</label>
                    <input 
                      type="text" 
                      value={manualInvoiceNo} 
                      onChange={e => setManualInvoiceNo(e.target.value)} 
                      placeholder="01-IX.X-2026" 
                      className="w-full p-2 border border-amber-400/40 rounded-xl font-mono font-bold text-amber-300 bg-[#5a5063]"
                    />
                  </div>
                </div>

                {multiClientName && multiTalentId && (
                  <div className="bg-[#5a5063] p-3 rounded-xl border border-pink-900/20">
                    <label className="block text-[11px] font-bold text-pink-100 mb-2">
                      Pilih Proyek Klien yang Mau Digabungkan ke 1 Resi untuk <span className="text-amber-300">{currentTalentMaster?.name}</span>
                    </label>
                    {availableMultiProjects.length === 0 ? (
                      <p className="text-pink-200/50 text-xs italic">Tidak ada proyek tercatat dari klien ini yang melibatkan talent ini.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {availableMultiProjects.map(p => {
                          const isChecked = selectedProjectIds.includes(p.id);
                          const tItem = p.talentsData.find(t => t.talentId === Number(multiTalentId));
                          return (
                            <div 
                              key={p.id} 
                              onClick={() => toggleSelectProject(p.id)} 
                              className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${isChecked ? 'bg-amber-400/20 border-amber-400 font-bold text-amber-200' : 'bg-[#483f51] border-pink-900/20 text-pink-100 hover:bg-[#52485c]'}`}
                            >
                              <div>
                                <p className="leading-tight">{p.projectName}</p>
                                <p className="text-[10px] text-pink-300/60 font-normal">{p.date} • {tItem?.role || 'Dubber'}</p>
                              </div>
                              {isChecked ? <CheckSquare size={16} className="text-amber-300 shrink-0" /> : <Square size={16} className="text-pink-300/40 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* TEMPLATE RESI CETAK PDF */}
            {multiTalentId && selectedProjectIds.length > 0 && (
              <div className="space-y-4">
                <div className="flex gap-3 print:hidden">
                  <button 
                    onClick={() => window.print()} 
                    className="bg-amber-400 hover:bg-amber-300 text-[#2a2232] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition"
                  >
                    <Printer size={16} /> Cetak / Simpan PDF
                  </button>
                </div>

                <div 
                  id="receipt-template" 
                  className="bg-white p-6 sm:p-12 rounded-2xl border border-slate-300 shadow-xl max-w-2xl mx-auto font-sans text-black relative overflow-hidden"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
                    <img src={logoImg} alt="Watermark Logo" className="w-96 h-96 object-contain" />
                  </div>

                  <div className="text-center mb-8 relative z-10">
                    <img src={logoImg} alt="Team Yuna Logo" className="w-20 h-20 mx-auto mb-2 object-contain" />
                    <h2 className="tracking-[0.25em] text-xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                      T E A M   Y U N A   D U B
                    </h2>
                    <p className="text-xs text-slate-600 italic mt-1 font-serif">Team Yuna Dub</p>
                  </div>

                  <div className="flex justify-between items-start mb-8 text-xs relative z-10 font-bold">
                    <div className="space-y-1">
                      <p className="tracking-wider text-slate-900 uppercase">KEPADA</p>
                      <p className="text-sm font-extrabold uppercase bg-yellow-300 px-2 py-0.5 rounded w-fit text-black leading-none">{currentTalentMaster?.name}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div><span className="text-slate-800 uppercase tracking-wider">INVOICE NO: </span><span className="font-mono">{manualInvoiceNo || '-'}</span></div>
                      <div><span className="text-slate-800 uppercase tracking-wider">TANGGAL: </span><span className="font-mono">{manualSlipDate}</span></div>
                    </div>
                  </div>

                  <div className="overflow-x-auto relative z-10 mb-8">
                    <table className="w-full text-xs text-left border-collapse min-w-[450px]">
                      <thead>
                        <tr className="bg-[#a3cf93] text-black font-extrabold uppercase tracking-wide">
                          <th className="py-2.5 px-3">PROYEK - PERAN</th>
                          <th className="py-2.5 px-3 text-center">DURASI</th>
                          <th className="py-2.5 px-3 text-center">$ / menit</th>
                          <th className="py-2.5 px-3 text-center">KURS</th>
                          <th className="py-2.5 px-3 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProjectIds.map(prjId => {
                          const p = projects.find(item => item.id === prjId);
                          const tItem = p?.talentsData.find(t => t.talentId === Number(multiTalentId));
                          if (!p || !tItem) return null;

                          const calc = getCalculatedValues(tItem, p.paypalRate);

                          return (
                            <tr key={p.id} className="border-b border-slate-200">
                              <td className="py-2.5 px-3 font-bold text-slate-900">{p.projectName} {tItem.role ? `- ${tItem.role}` : ''}</td>
                              <td className="py-2.5 px-3 text-center font-mono">{tItem.minutes}m {tItem.seconds}s ({calc.decMin.toFixed(2)}m)</td>
                              <td className="py-2.5 px-3 text-center font-mono">${Number(tItem.rateUSD).toFixed(2)}</td>
                              <td className="py-2.5 px-3 text-center font-mono">Rp {p.paypalRate.toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right font-bold font-mono text-slate-900">Rp {Math.round(calc.grossIDR).toLocaleString('id-ID')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {(() => {
                    let sumGross = 0;
                    let sumBonus = 0;
                    let sumCashbon = 0;

                    selectedProjectIds.forEach(prjId => {
                      const p = projects.find(item => item.id === prjId);
                      const tItem = p?.talentsData.find(t => t.talentId === Number(multiTalentId));
                      if (p && tItem) {
                        const calc = getCalculatedValues(tItem, p.paypalRate);
                        sumGross += calc.grossIDR;
                        sumBonus += Number(tItem.bonusIDR || 0);
                        sumCashbon += Number(tItem.cashbonCut || 0);
                      }
                    });

                    const totalNet = sumGross + sumBonus - sumCashbon;

                    return (
                      <div className="w-full ml-auto text-xs space-y-2 mb-10 font-bold relative z-10">
                        <div className="flex justify-between items-center px-3 py-1">
                          <span className="text-slate-800 uppercase tracking-wider">SUBTOTAL ({selectedProjectIds.length} Proyek)</span>
                          <span className="font-mono text-sm">Rp {Math.round(sumGross).toLocaleString('id-ID')}</span>
                        </div>
                        {sumBonus > 0 && (
                          <div className="flex justify-between items-center px-3 py-1 italic text-emerald-800">
                            <span>TOTAL BONUS</span>
                            <span className="font-mono">+ Rp {Math.round(sumBonus).toLocaleString('id-ID')}</span>
                          </div>
                        )}
                        {sumCashbon > 0 && (
                          <div className="flex justify-between items-center px-3 py-1 text-rose-700">
                            <span>POTONGAN KASBON</span>
                            <span className="font-mono">- Rp {Math.round(sumCashbon).toLocaleString('id-ID')}</span>
                          </div>
                        )}
                        <div className="bg-[#a3cf93] text-black flex justify-between items-center px-3 py-2.5 font-extrabold uppercase text-sm mt-2">
                          <span>TOTAL</span>
                          <span className="font-mono">Rp {Math.round(totalNet).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 relative z-10 font-bold">
                    <div className="space-y-1">
                      <p className="uppercase tracking-wider text-slate-900 mb-2">KETERANGAN TRANSFER</p>
                      <div className="grid grid-cols-3"><span className="text-slate-700">BANK</span><span className="col-span-2 font-mono">{currentTalentMaster?.bank || '-'}</span></div>
                      <div className="grid grid-cols-3"><span className="text-slate-700">NO. REK</span><span className="col-span-2 font-mono">{currentTalentMaster?.noRek || '-'}</span></div>
                      <div className="grid grid-cols-3"><span className="text-slate-700">ATAS NAMA</span><span className="col-span-2">{currentTalentMaster?.atasNama || '-'}</span></div>
                    </div>
                    <div className="text-right flex flex-col justify-end mt-4 sm:mt-0">
                      <p className="font-serif font-extrabold tracking-widest text-sm text-slate-900 uppercase">TERIMA KASIH</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6 REKAP KLIEN & PROFIT */}
        {activeTab === 'client-report' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-pink-50 flex items-center gap-2">
                Rekap Data Klien & Profitabilitas <Sparkles size={20} className="text-pink-300" />
              </h2>
              {selectedReportClient && (
                <button onClick={handleExportCSV} className="bg-emerald-500/80 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow flex items-center gap-2 transition">
                  <Download size={16} /> Ekspor Laporan ke CSV (Excel)
                </button>
              )}
            </div>

            <div className="bg-[#6f6479] p-5 rounded-2xl shadow-md border border-pink-300/10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-2">1. Pilih Klien</label>
                <select 
                  value={selectedReportClient} 
                  onChange={e => { 
                    setSelectedReportClient(e.target.value); 
                    setSelectedReportProjectId('');
                  }} 
                  className="w-full p-2.5 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] font-medium text-pink-50"
                >
                  <option value="">-- Pilih Nama Klien --</option>
                  {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-2">2. Pilih Proyek Klien (Opsional)</label>
                <select 
                  value={selectedReportProjectId} 
                  onChange={e => setSelectedReportProjectId(e.target.value)} 
                  disabled={!selectedReportClient}
                  className="w-full p-2.5 border border-pink-900/20 rounded-xl text-xs bg-[#5a5063] font-medium text-pink-50 disabled:opacity-50"
                >
                  <option value="">-- Semua Proyek ({allClientProjects.length}) --</option>
                  {allClientProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.projectName} ({p.date})</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedReportClient && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#6f6479] p-4 rounded-2xl shadow-md border border-pink-300/10">
                    <p className="text-[10px] text-pink-200/80 font-bold uppercase tracking-wider">Total Pendapatan (Revenue)</p>
                    <p className="text-xl font-extrabold text-emerald-300 mt-1">Rp {clientTotalRevenue.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-pink-200/60 mt-0.5">Dari invoice lunas klien ini</p>
                  </div>
                  <div className="bg-[#6f6479] p-4 rounded-2xl shadow-md border border-pink-300/10">
                    <p className="text-[10px] text-pink-200/80 font-bold uppercase tracking-wider">Total Gaji Talent (Payroll)</p>
                    <p className="text-xl font-extrabold text-sky-300 mt-1">Rp {Math.round(clientTotalPayroll).toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-pink-200/60 mt-0.5">{selectedReportProjectId ? 'Gaji proyek terpilih' : 'Akumulasi honor semua proyek'}</p>
                  </div>
                  <div className="bg-[#6f6479] p-4 rounded-2xl shadow-md border border-pink-300/10">
                    <p className="text-[10px] text-pink-200/80 font-bold uppercase tracking-wider">Profit Bersih Agensi</p>
                    <p className={`text-xl font-extrabold mt-1 ${clientNetProfit >= 0 ? 'text-pink-200' : 'text-rose-300'}`}>
                      Rp {Math.round(clientNetProfit).toLocaleString('id-ID')}
                    </p>
                    <p className="text-[10px] text-pink-200/60 mt-0.5">Pendapatan - Gaji Talent</p>
                  </div>
                </div>

                <div className="bg-[#6f6479] rounded-2xl shadow-md border border-pink-300/10 p-5 space-y-4">
                  <h3 className="font-bold text-base text-pink-50">
                    Daftar Proyek & Talent Terlibat untuk <span className="text-amber-300">{selectedReportClient}</span>
                  </h3>
                  
                  {filteredReportProjects.length === 0 ? (
                    <p className="text-pink-200/50 text-xs">Belum ada proyek tercatat untuk filter ini.</p>
                  ) : (
                    <div className="space-y-4">
                      {filteredReportProjects.map(proj => (
                        <div key={proj.id} className="p-4 bg-[#5a5063] border border-pink-900/20 rounded-xl space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-pink-900/30 pb-2">
                            <div>
                              <h4 className="font-bold text-sm text-pink-50">{proj.projectName}</h4>
                              <p className="text-[11px] text-pink-200/60">Tanggal {proj.date} • Deadline {proj.deadline || '-'}</p>
                            </div>
                            <span className="text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-full">
                              Kurs Rp {proj.paypalRate.toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left min-w-[500px]">
                              <thead className="text-pink-200/70 border-b border-pink-900/30">
                                <tr>
                                    <th className="py-2">Nama Talent</th>
                                    <th className="py-2">Peran</th>
                                    <th className="py-2 text-center">Durasi</th>
                                    <th className="py-2 text-center">Status Gaji</th>
                                    <th className="py-2 text-right">Total Bersih (IDR)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-pink-900/20">
                                {proj.talentsData.map((t, idx) => {
                                  const calc = getCalculatedValues(t, proj.paypalRate);
                                  return (
                                    <tr key={idx}>
                                      <td className="py-2 font-bold text-pink-50">{t.name}</td>
                                      <td className="py-2 text-pink-200/80">{t.role || '-'}</td>
                                      <td className="py-2 text-center font-mono text-pink-100">{t.minutes}m {t.seconds}s</td>
                                      <td className="py-2 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.paymentStatus === 'Sudah Dibayar' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                                          {t.paymentStatus || 'Belum Dibayar'}
                                        </span>
                                      </td>
                                      <td className="py-2 text-right font-mono font-bold text-pink-50">Rp {Math.round(calc.totalNetIDR).toLocaleString('id-ID')}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}