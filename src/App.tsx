import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Video, 
  StickyNote, 
  Archive as ArchiveIcon, 
  CreditCard, 
  Settings, 
  LogOut,
  Languages,
  Menu,
  X,
  Plus,
  Send,
  ExternalLink,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Camera,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, User, Note, Booking, Archive, translations } from './types';
import { extractTextFromImage } from './services/geminiService';

// --- Components ---

const Button = ({ children, onClick, className = "", variant = "primary", disabled = false }: any) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: any = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50",
    outline: "border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white",
    ghost: "text-zinc-600 hover:bg-zinc-100",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const Input = ({ label, ...props }: any) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</label>}
    <input 
      {...props} 
      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
    />
  </div>
);

// --- Pages ---

const Onboarding = ({ onComplete, lang }: { onComplete: (user: User) => void, lang: Language }) => {
  const [formData, setFormData] = useState({ fullName: '', address: '', phone: '', email: '' });
  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    onComplete({ ...formData, id: data.id, full_name: formData.fullName, created_at: new Date().toISOString() } as User);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{t.welcome}</h1>
            <p className="text-zinc-500">{t.onboarding}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label={t.fullName} value={formData.fullName} onChange={(e: any) => setFormData({...formData, fullName: e.target.value})} required />
            <Input label={t.address} value={formData.address} onChange={(e: any) => setFormData({...formData, address: e.target.value})} required />
            <Input label={t.phone} value={formData.phone} onChange={(e: any) => setFormData({...formData, phone: e.target.value})} required />
            <Input label={t.email} type="email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} required />
            <Button className="w-full py-3 mt-4">{t.submit}</Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, lang, setActiveTab }: { user: User, lang: Language, setActiveTab: (tab: string) => void }) => {
  const t = translations[lang];
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{t.dashboard}</h1>
          <p className="text-zinc-500">Welcome back, {user.full_name}</p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="text-zinc-900" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.upload}</h3>
            <p className="text-zinc-500 text-sm">Scan or upload your tax documents for processing.</p>
          </div>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              <Camera className="text-zinc-900" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.notaryBooking}</h3>
            <p className="text-zinc-500 text-sm">Book mobile, in-office, or online notary services.</p>
          </div>
          <Button onClick={() => setActiveTab('notary')} variant="secondary" className="mt-4 w-full">
            Book Notary
          </Button>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="text-zinc-900" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.booking}</h3>
            <p className="text-zinc-500 text-sm">Schedule a session with our tax experts.</p>
          </div>
          <Button onClick={() => setActiveTab('booking')} variant="secondary" className="mt-4 w-full">
            Book Appointment
          </Button>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              <Video className="text-zinc-900" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.videoCall}</h3>
            <p className="text-zinc-500 text-sm">Join your scheduled video consultation.</p>
          </div>
        </Card>
        <Card className="flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0">
            <div className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
              2025-26
            </div>
          </div>
          <div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              <Download className="text-zinc-900" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.downloads}</h3>
            <p className="text-zinc-500 text-sm">Access and download essential tax forms for the 2025-2026 season.</p>
          </div>
          <Button onClick={() => setActiveTab('downloads')} variant="secondary" className="mt-4 w-full">
            View Forms
          </Button>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="text-zinc-900" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.legalShield}</h3>
            <p className="text-zinc-500 text-sm">{t.legalShieldDesc}</p>
          </div>
          <Button onClick={() => setActiveTab('legalshield')} variant="secondary" className="mt-4 w-full">
            Learn More
          </Button>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              <ExternalLink className="text-zinc-900" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.visitWebsite}</h3>
            <p className="text-zinc-500 text-sm">Visit our official website to learn more about our history and values.</p>
          </div>
          <Button onClick={() => window.open('https://www.aarsntok.com/about-us', '_blank')} variant="secondary" className="mt-4 w-full">
            Open Website
          </Button>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center">
              <MapPin className="text-zinc-900" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">{t.officeLocation}</h3>
              <p className="text-zinc-500 text-sm">{t.officeAddress}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.officeAddress)}`, '_blank')}
          >
            Get Directions
          </Button>
        </div>
        <div className="h-[300px] w-full bg-zinc-100">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={import.meta.env.VITE_GOOGLE_MAPS_API_KEY 
              ? `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(t.officeAddress)}`
              : `https://maps.google.com/maps?q=${encodeURIComponent(t.officeAddress)}&output=embed`
            }
            allowFullScreen
            title="Office Location"
          ></iframe>
        </div>
      </Card>
    </div>
  );
};

const DocumentUpload = ({ user, lang }: { user: User, lang: Language }) => {
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const t = translations[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleExtract = async () => {
    if (!file) return;
    if (!process.env.GEMINI_API_KEY) {
      alert("Gemini API Key is missing. Please configure it in the Secrets panel.");
      return;
    }
    setExtracting(true);
    setResult(null);
    
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      const text = await extractTextFromImage(base64, file.type);
      setResult(text || "No text found.");
      
      // Save to archive
      await fetch('/api/archives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, fileName: file.name, extractedText: text })
      });
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Failed to extract text from document. Please try again.");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t.upload}</h1>
      <Card>
        <div className="border-2 border-dashed border-zinc-200 rounded-xl p-12 text-center space-y-4 relative">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center">
              <Camera className="text-zinc-400" />
            </div>
          </div>
          <div>
            <p className="text-zinc-600 font-medium">Click to upload or drag and drop</p>
            <p className="text-zinc-400 text-sm">PNG, JPG or PDF (MAX. 10MB)</p>
          </div>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="hidden" 
            id="file-upload" 
            accept="image/*,.pdf"
          />
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="hidden" 
            id="camera-upload" 
            accept="image/*" 
            capture="environment"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => document.getElementById('file-upload')?.click()} variant="secondary">
              Select File
            </Button>
            <Button onClick={() => document.getElementById('camera-upload')?.click()} variant="secondary" className="flex items-center gap-2">
              <Camera size={18} /> Take Photo
            </Button>
          </div>
          {file && (
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 inline-block">
              <p className="text-sm font-medium text-zinc-900 flex items-center gap-2">
                <FileText size={14} className="text-zinc-400" />
                {file.name}
              </p>
            </div>
          )}
        </div>
        {file && (
          <div className="mt-6 flex gap-3">
            <Button onClick={handleExtract} disabled={extracting} className="flex-1 py-4 text-lg">
              {extracting ? (
                <span className="flex items-center justify-center gap-2">
                  <Clock className="animate-spin" size={20} />
                  Processing Document...
                </span>
              ) : t.extractText}
            </Button>
          </div>
        )}
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <h3 className="font-bold mb-4">Extracted Text</h3>
            <pre className="bg-zinc-50 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono text-zinc-700 border border-zinc-200">
              {result}
            </pre>
            <div className="mt-4 flex gap-3">
              <Button variant="secondary" onClick={() => {
                const blob = new Blob([result], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `extracted-${file?.name}.txt`;
                a.click();
              }}>
                <Download size={18} /> Download
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = `mailto:info@aarsnotary.com?subject=Document Extract&body=${encodeURIComponent(result)}`}>
                <Send size={18} /> Email to AARS
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

const Downloads = ({ lang, setActiveTab }: { lang: Language, setActiveTab: (tab: string) => void }) => {
  const t = translations[lang];
  const forms = {
    oklahoma: [
      { name: "Form 511 - Oklahoma Resident Income Tax Return", url: "https://oklahoma.gov/content/dam/ok/en/tax/documents/forms/income/511.pdf", year: "2025-2026" },
      { name: "Form 511-NR - Oklahoma Nonresident/Part-Year Resident", url: "https://oklahoma.gov/content/dam/ok/en/tax/documents/forms/income/511nr.pdf", year: "2025-2026" },
      { name: "Form 511-V - Oklahoma Individual Income Tax Payment Voucher", url: "https://oklahoma.gov/content/dam/ok/en/tax/documents/forms/income/511-v.pdf", year: "2025-2026" }
    ],
    federal: [
      { name: "Form 1040 - U.S. Individual Income Tax Return", url: "https://www.irs.gov/pub/irs-pdf/f1040.pdf", year: "2025-2026" },
      { name: "Form 1040-SR - U.S. Tax Return for Seniors", url: "https://www.irs.gov/pub/irs-pdf/f1040s.pdf", year: "2025-2026" },
      { name: "Form W-9 - Request for Taxpayer Identification Number", url: "https://www.irs.gov/pub/irs-pdf/fw9.pdf", year: "Current" },
      { name: "Form 1040-ES - Estimated Tax for Individuals", url: "https://www.irs.gov/pub/irs-pdf/f1040es.pdf", year: "2025-2026" }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t.downloads}</h1>
          <p className="text-zinc-500 text-sm">Download the latest state and federal tax forms for the 2025-2026 season.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-zinc-900 text-white text-xs font-bold rounded-full uppercase tracking-wider">Tax Year 2025-2026</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">OK</div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700">{t.oklahomaForms}</h2>
          </div>
          <div className="grid gap-3">
            {forms.oklahoma.map((f, i) => (
              <Card key={i} className="group hover:border-zinc-300 transition-all p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{f.name}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Year: {f.year}</p>
                  </div>
                  <a 
                    href={f.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-shrink-0 w-10 h-10 bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white rounded-xl flex items-center justify-center transition-all"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
            <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-bold text-xs">IRS</div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700">{t.federalForms}</h2>
          </div>
          <div className="grid gap-3">
            {forms.federal.map((f, i) => (
              <Card key={i} className="group hover:border-zinc-300 transition-all p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{f.name}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Year: {f.year}</p>
                  </div>
                  <a 
                    href={f.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-shrink-0 w-10 h-10 bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white rounded-xl flex items-center justify-center transition-all"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-4 items-start">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex-shrink-0 flex items-center justify-center">
          <CheckCircle2 size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-emerald-900">2025-2026 Forms are now available!</p>
          <p className="text-xs text-emerald-700 leading-relaxed">
            We've updated our library with the latest forms for the upcoming tax season. If you need assistance filing, please book an appointment with our team.
          </p>
          <div className="pt-2 flex gap-3">
            <button onClick={() => setActiveTab('booking')} className="text-xs font-bold text-emerald-900 underline underline-offset-4">Book Appointment</button>
            <button onClick={() => setActiveTab('upload')} className="text-xs font-bold text-emerald-900 underline underline-offset-4">Upload for Review</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotaryPage = ({ user, lang }: { user: User, lang: Language }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [method, setMethod] = useState('Office');
  const [docType, setDocType] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: user.full_name || '',
    phone: user.phone || '',
    email: user.email || ''
  });
  const [success, setSuccess] = useState(false);
  const t = translations[lang];

  const handleBook = async () => {
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user.id, 
        date, 
        time, 
        serviceType: 'Notary Public',
        notaryMethod: method,
        documentType: docType,
        ...contactInfo
      })
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-emerald-500" size={32} />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">Notary Booking Confirmed!</h2>
        <p className="text-zinc-500 mb-6">We've received your request for Notary services on {date} at {time}.</p>
        <Button onClick={() => setSuccess(false)} variant="secondary">Book Another</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <h1 className="text-2xl font-bold">{t.notaryBooking}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Camera size={20} className="text-zinc-400" />
              Notary Details
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.notaryMethod}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Office', label: t.inOffice, icon: <MapPin size={16} /> },
                    { id: 'Mobile', label: t.mobileNotary, icon: <Clock size={16} /> },
                    { id: 'Online', label: t.onlineNotary, icon: <Video size={16} /> }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                        method === m.id 
                          ? 'bg-zinc-900 text-white border-zinc-900' 
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      {m.icon}
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <Input 
                label={t.documentType} 
                placeholder={t.documentPlaceholder}
                value={docType}
                onChange={(e: any) => setDocType(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" value={date} onChange={(e: any) => setDate(e.target.value)} />
                <Input label="Time" type="time" value={time} onChange={(e: any) => setTime(e.target.value)} />
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <UserIcon size={20} className="text-zinc-400" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <Input 
                label={t.fullName} 
                value={contactInfo.name} 
                onChange={(e: any) => setContactInfo({...contactInfo, name: e.target.value})} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label={t.phone} 
                  value={contactInfo.phone} 
                  onChange={(e: any) => setContactInfo({...contactInfo, phone: e.target.value})} 
                />
                <Input 
                  label={t.email} 
                  type="email" 
                  value={contactInfo.email} 
                  onChange={(e: any) => setContactInfo({...contactInfo, email: e.target.value})} 
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-900 text-white border-none">
            <h3 className="font-bold mb-4">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Method</span>
                <span className="text-white">{method}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Date</span>
                <span className="text-white">{date || 'Not selected'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Time</span>
                <span className="text-white">{time || 'Not selected'}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Button 
                onClick={handleBook} 
                className="w-full py-3 bg-white text-zinc-900 hover:bg-zinc-100" 
                disabled={!date || !time || !docType}
              >
                {t.bookNow}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const LegalShieldPage = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{t.legalShield}</h1>
          <p className="text-zinc-500">Authorized Provider</p>
        </div>
      </div>

      <Card className="p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Protect Your Rights with LegalShield</h2>
          <p className="text-zinc-600 leading-relaxed">
            AARS Notary And Tax is proud to be an authorized LegalShield provider. LegalShield gives you the power to speak with an attorney about any personal legal matter without worrying about high hourly costs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
            <h3 className="font-bold text-zinc-900">Personal Legal Plans</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Legal Advice & Consultation</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Document Review</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Letters/Calls on Your Behalf</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Will Preparation</li>
            </ul>
          </div>
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
            <h3 className="font-bold text-zinc-900">Small Business Plans</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Business Legal Advice</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Contract Review</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Debt Collection Assistance</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Trial Defense Services</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-100">
          <Button className="w-full py-4 text-lg flex items-center justify-center gap-2" onClick={() => window.location.href = 'mailto:aarsnt.info@gmail.com?subject=LegalShield Inquiry'}>
            <Mail size={20} /> {t.emailUs}
          </Button>
        </div>
      </Card>

      <div className="bg-zinc-900 text-white p-8 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold">Why LegalShield?</h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          LegalShield has been providing legal protection to millions of people for over 45 years. With a dedicated law firm in every state and Canadian province, you can rest assured that you have expert legal help whenever you need it.
        </p>
      </div>
    </div>
  );
};

const BookingPage = ({ user, lang }: { user: User, lang: Language }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('Notary Public');
  const [method, setMethod] = useState('Office');
  const [docType, setDocType] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: user.full_name || '',
    phone: user.phone || '',
    email: user.email || ''
  });
  const [success, setSuccess] = useState(false);
  const t = translations[lang];

  const handleBook = async () => {
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user.id, 
        date, 
        time, 
        serviceType: service,
        notaryMethod: service === 'Notary Public' ? method : null,
        documentType: docType,
        ...contactInfo
      })
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-emerald-500" size={32} />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-zinc-500 mb-6">We've received your request for {service} on {date} at {time}.</p>
        <Button onClick={() => setSuccess(false)} variant="secondary">Book Another</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <h1 className="text-2xl font-bold">{t.booking}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={20} className="text-zinc-400" />
              {t.appointmentDetails}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.selectService}</label>
                <select 
                  value={service} 
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                >
                  <option value="Notary Public">{t.notary}</option>
                  <option value="Tax Preparation">{t.taxPrep}</option>
                  <option value="Consultation">{t.consultation}</option>
                </select>
              </div>

              {service === 'Notary Public' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.notaryMethod}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'Office', label: t.inOffice, icon: <MapPin size={16} /> },
                      { id: 'Mobile', label: t.mobileNotary, icon: <Clock size={16} /> },
                      { id: 'Online', label: t.onlineNotary, icon: <Video size={16} /> }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                          method === m.id 
                            ? 'bg-zinc-900 text-white border-zinc-900' 
                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        {m.icon}
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Input 
                label={t.documentType} 
                placeholder={t.documentPlaceholder}
                value={docType}
                onChange={(e: any) => setDocType(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" value={date} onChange={(e: any) => setDate(e.target.value)} />
                <Input label="Time" type="time" value={time} onChange={(e: any) => setTime(e.target.value)} />
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <UserIcon size={20} className="text-zinc-400" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <Input 
                label={t.fullName} 
                value={contactInfo.name} 
                onChange={(e: any) => setContactInfo({...contactInfo, name: e.target.value})} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label={t.phone} 
                  value={contactInfo.phone} 
                  onChange={(e: any) => setContactInfo({...contactInfo, phone: e.target.value})} 
                />
                <Input 
                  label={t.email} 
                  type="email" 
                  value={contactInfo.email} 
                  onChange={(e: any) => setContactInfo({...contactInfo, email: e.target.value})} 
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-900 text-white border-none">
            <h3 className="font-bold mb-4">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Service</span>
                <span className="text-white">{service}</span>
              </div>
              {service === 'Notary Public' && (
                <div className="flex justify-between text-zinc-400">
                  <span>Method</span>
                  <span className="text-white">{method}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Date</span>
                <span className="text-white">{date || 'Not selected'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Time</span>
                <span className="text-white">{time || 'Not selected'}</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Button 
                onClick={handleBook} 
                className="w-full py-3 bg-white text-zinc-900 hover:bg-zinc-100" 
                disabled={!date || !time || !docType}
              >
                {t.bookNow}
              </Button>
            </div>
          </Card>
          
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Note:</strong> Mobile notary services may incur additional travel fees based on your location. Online notary requires a valid government-issued ID and a stable internet connection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoCall = ({ lang }: { lang: Language }) => {
  const [active, setActive] = useState(false);
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t.videoCall}</h1>
      {!active ? (
        <Card className="text-center py-20">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
              <Video size={40} className="text-zinc-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Ready to start?</h2>
          <p className="text-zinc-500 mb-8 max-w-sm mx-auto">Connect with a tax professional via secure video call to review your documents.</p>
          <Button onClick={() => setActive(true)} className="px-8 py-3">{t.startCall}</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="aspect-video bg-zinc-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-zinc-800">
            <div className="text-white text-center">
              <div className="w-24 h-24 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <UserIcon size={48} className="text-zinc-600" />
              </div>
              <p className="font-medium">Connecting to AARS Professional...</p>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <button className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">
                <Phone size={20} />
              </button>
              <button onClick={() => setActive(false)} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="absolute top-4 right-4 w-48 aspect-video bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">You</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-zinc-500 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Secure Connection Active
            </div>
            <div>00:00:00</div>
          </div>
        </div>
      )}
    </div>
  );
};

const NotesPage = ({ user, lang }: { user: User, lang: Language }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const t = translations[lang];

  const fetchNotes = async () => {
    const res = await fetch(`/api/notes/${user.id}`);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleAdd = async () => {
    if (!newNote) return;
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, content: newNote })
    });
    setNewNote('');
    fetchNotes();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t.notes}</h1>
      <Card className="space-y-4">
        <textarea 
          placeholder={t.addNote}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all resize-none"
        />
        <Button onClick={handleAdd} className="w-full py-3">{t.saveNote}</Button>
      </Card>
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className="relative group">
            <p className="text-zinc-800 leading-relaxed">{note.content}</p>
            <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                {new Date(note.created_at).toLocaleDateString()}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ArchivePage = ({ user, lang }: { user: User, lang: Language }) => {
  const [archives, setArchives] = useState<Archive[]>([]);
  const t = translations[lang];

  useEffect(() => {
    fetch(`/api/archives/${user.id}`).then(r => r.json()).then(setArchives);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t.archive}</h1>
      <div className="grid gap-4">
        {archives.map((a) => (
          <Card key={a.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center">
                <FileText className="text-zinc-400" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{a.file_name}</h4>
                <p className="text-xs text-zinc-500">{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => {
              const blob = new Blob([a.extracted_text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `archive-${a.file_name}.txt`;
              link.click();
            }}>
              <Download size={16} />
            </Button>
          </Card>
        ))}
        {archives.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            <ArchiveIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>No archived documents yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentPage = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t.payment}</h1>
      <Card className="text-center py-12 space-y-6">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
          <CreditCard className="text-zinc-900" size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">{t.payBill}</h2>
          <p className="text-zinc-500">Your current balance is $0.00</p>
        </div>
        <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
          <p className="text-sm text-zinc-600 mb-4">When a bill is generated, you will receive a secure Stripe payment link here.</p>
          <Button className="w-full py-3" onClick={() => window.open('https://buy.stripe.com/test_fsq9B59B59B5', '_blank')}>
            {t.stripeLink}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const AdminPage = ({ lang }: { lang: Language }) => {
  const [users, setUsers] = useState<User[]>([]);
  const t = translations[lang];

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t.admin}</h1>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50 border-bottom border-zinc-200">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">{t.fullName}</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">{t.email}</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">{t.phone}</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">{t.address}</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{u.full_name}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{u.phone}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{u.address}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  console.log("App rendering, user:", !!user);
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAdminEnabled, setIsAdminEnabled] = useState(false);

  const t = translations[lang];

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminEnabled(true);
        return 0;
      }
      return next;
    });
  };

  if (!user) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50">
          <Button variant="secondary" onClick={() => setLang(lang === 'en' ? 'es' : 'en')}>
            <Languages size={18} /> {t.language}
          </Button>
        </div>
        <Onboarding onComplete={setUser} lang={lang} />
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: <Settings size={20} /> },
    { id: 'upload', label: t.upload, icon: <FileText size={20} /> },
    { id: 'downloads', label: t.downloads, icon: <Download size={20} /> },
    { id: 'legalshield', label: t.legalShield, icon: <Shield size={20} /> },
    { id: 'notary', label: t.notaryBooking, icon: <Camera size={20} /> },
    { id: 'booking', label: t.booking, icon: <Calendar size={20} /> },
    { id: 'video', label: t.videoCall, icon: <Video size={20} /> },
    { id: 'notes', label: t.notes, icon: <StickyNote size={20} /> },
    { id: 'archive', label: t.archive, icon: <ArchiveIcon size={20} /> },
    { id: 'payment', label: t.payment, icon: <CreditCard size={20} /> },
    ...(isAdminEnabled ? [{ id: 'admin', label: t.admin, icon: <UserIcon size={20} /> }] : []),
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-zinc-200 flex flex-col fixed h-full z-40"
      >
        <div 
          onClick={handleLogoClick}
          className="p-6 flex items-center gap-3 overflow-hidden cursor-pointer select-none active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold">A</div>
          {isSidebarOpen && <span className="font-bold text-lg whitespace-nowrap">AARS Notary And Tax</span>}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' 
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100 space-y-2">
          <a 
            href="https://www.aarsntok.com/about-us"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-all"
          >
            <ExternalLink size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">{t.visitWebsite}</span>}
          </a>
          <button 
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 transition-all"
          >
            <Languages size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">{t.language}</span>}
          </button>
          <button 
            onClick={() => setUser(null)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">{t.logout}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'} p-8`}>
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard user={user} lang={lang} setActiveTab={setActiveTab} />}
              {activeTab === 'upload' && <DocumentUpload user={user} lang={lang} />}
              {activeTab === 'downloads' && <Downloads lang={lang} setActiveTab={setActiveTab} />}
              {activeTab === 'legalshield' && <LegalShieldPage lang={lang} />}
              {activeTab === 'notary' && <NotaryPage user={user} lang={lang} />}
              {activeTab === 'booking' && <BookingPage user={user} lang={lang} />}
              {activeTab === 'video' && <VideoCall lang={lang} />}
              {activeTab === 'notes' && <NotesPage user={user} lang={lang} />}
              {activeTab === 'archive' && <ArchivePage user={user} lang={lang} />}
              {activeTab === 'payment' && <PaymentPage lang={lang} />}
              {activeTab === 'admin' && isAdminEnabled && <AdminPage lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Toggle */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <a 
          href="tel:9183134512"
          className="w-12 h-12 bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
          title={t.callUs}
        >
          <Phone size={24} />
        </a>
        <a 
          href="mailto:aarsnt.info@gmail.com"
          className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
          title={t.emailUs}
        >
          <Mail size={24} />
        </a>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-12 h-12 bg-zinc-900 text-white rounded-full shadow-xl flex items-center justify-center lg:hidden"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  );
}
