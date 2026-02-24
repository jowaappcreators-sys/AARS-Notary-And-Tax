export type Language = 'en' | 'es';

export interface User {
  id: number;
  full_name: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface Note {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  booking_date: string;
  booking_time: string;
  service_type: string;
  status: string;
  created_at: string;
}

export interface Archive {
  id: number;
  user_id: number;
  file_name: string;
  extracted_text: string;
  created_at: string;
}

export const translations = {
  en: {
    welcome: "Welcome to AARS Notary And Tax",
    onboarding: "Please provide your details to get started",
    fullName: "Full Name",
    address: "Address",
    phone: "Phone Number",
    email: "Email Address",
    submit: "Submit",
    dashboard: "Dashboard",
    upload: "Upload Documents",
    downloads: "Tax Forms",
    booking: "Appointments",
    notaryBooking: "Notary Services",
    videoCall: "Video Consultation",
    notes: "My Notes",
    archive: "My Archive",
    admin: "Admin Panel",
    payment: "Payments",
    extractText: "Extract Text",
    downloadToAARS: "Send to AARS",
    oklahomaForms: "Oklahoma State Tax Forms",
    federalForms: "IRS Federal Tax Forms",
    selectService: "Select Service",
    notary: "Notary Public",
    taxPrep: "Tax Preparation",
    consultation: "General Consultation",
    bookNow: "Book Now",
    startCall: "Start Video Call",
    addNote: "Add a Note",
    saveNote: "Save Note",
    payBill: "Pay My Bill",
    stripeLink: "Click here to pay via Stripe",
    language: "Español",
    logout: "Logout",
    notaryMethod: "Notary Method",
    mobileNotary: "Mobile Notary (We come to you)",
    inOffice: "In-Office",
    onlineNotary: "Online Notary",
    documentType: "Type of Document",
    documentPlaceholder: "e.g. Power of Attorney, Deed, etc.",
    appointmentDetails: "Appointment Details",
    legalShield: "LegalShield",
    legalShieldDesc: "AARS Notary And Tax is an authorized LegalShield provider. Get access to legal advice and services for a low monthly fee.",
    contactUs: "Contact AARS",
    callUs: "Call (918) 313-4512",
    emailUs: "Email aarsnt.info@gmail.com",
    visitWebsite: "Visit Website",
    officeLocation: "Office Location",
    officeAddress: "3171 S 129th East Avenue, Suite A, Tulsa, OK 74134",
  },
  es: {
    welcome: "Bienvenido a AARS Notary And Tax",
    onboarding: "Por favor, proporcione sus datos para comenzar",
    fullName: "Nombre Completo",
    address: "Dirección",
    phone: "Número de Teléfono",
    email: "Correo Electrónico",
    submit: "Enviar",
    dashboard: "Panel de Control",
    upload: "Subir Documentos",
    downloads: "Formularios de Impuestos",
    booking: "Citas",
    notaryBooking: "Servicios de Notaría",
    videoCall: "Consulta por Video",
    notes: "Mis Notas",
    archive: "Mi Archivo",
    admin: "Panel de Administración",
    payment: "Pagos",
    extractText: "Extraer Texto",
    downloadToAARS: "Enviar a AARS",
    oklahomaForms: "Formularios de Impuestos de Oklahoma",
    federalForms: "Formularios de Impuestos Federales del IRS",
    selectService: "Seleccionar Servicio",
    notary: "Notario Público",
    taxPrep: "Preparación de Impuestos",
    consultation: "Consulta General",
    bookNow: "Reservar Ahora",
    startCall: "Iniciar Videollamada",
    addNote: "Agregar una Nota",
    saveNote: "Guardar Nota",
    payBill: "Pagar mi Factura",
    stripeLink: "Haga clic aquí para pagar a través de Stripe",
    language: "English",
    logout: "Cerrar Sesión",
    notaryMethod: "Método de Notario",
    mobileNotary: "Notario Móvil (Vamos a usted)",
    inOffice: "En la Oficina",
    onlineNotary: "Notario en Línea",
    documentType: "Tipo de Documento",
    documentPlaceholder: "ej. Poder Notarial, Escritura, etc.",
    appointmentDetails: "Detalles de la Cita",
    legalShield: "LegalShield",
    legalShieldDesc: "AARS Notary And Tax es un proveedor autorizado de LegalShield. Obtenga acceso a asesoramiento y servicios legales por una baja cuota mensual.",
    contactUs: "Contactar a AARS",
    callUs: "Llamar al (918) 313-4512",
    emailUs: "Correo a aarsnt.info@gmail.com",
    visitWebsite: "Visitar Sitio Web",
    officeLocation: "Ubicación de la Oficina",
    officeAddress: "3171 S 129th East Avenue, Suite A, Tulsa, OK 74134",
  }
};
