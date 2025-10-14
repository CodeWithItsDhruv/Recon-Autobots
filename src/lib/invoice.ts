import jsPDF from 'jspdf';

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
}

class InvoiceService {
  private companyInfo = {
    name: 'RECON AUTOBOTS',
    tagline: 'Premium Motorcycle Riding Gear & Accessories',
    address: '123 Gear Street, Motor City',
    city: 'Mumbai, Maharashtra 400001',
    phone: '+91 98765 43210',
    email: 'orders@reconautobots.com',
    website: 'www.reconautobots.com',
    gst: '27ABCDE1234F1Z5'
  };

  // Generate PDF Invoice
  generatePDFInvoice(invoiceData: InvoiceData): jsPDF {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colors
    const primaryColor = [245, 158, 11]; // #F59E0B
    const darkColor = [31, 41, 55]; // #1F2937
    const lightGray = [243, 244, 246]; // #F3F4F6

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Company Logo/Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(this.companyInfo.name, 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(this.companyInfo.tagline, 20, 32);

    // Invoice Title
    doc.setTextColor(...darkColor);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 60, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${invoiceData.invoiceNumber}`, pageWidth - 60, 32);

    // Company Details
    doc.setTextColor(...darkColor);
    doc.setFontSize(9);
    doc.text(this.companyInfo.address, 20, 50);
    doc.text(this.companyInfo.city, 20, 55);
    doc.text(`Phone: ${this.companyInfo.phone}`, 20, 60);
    doc.text(`Email: ${this.companyInfo.email}`, 20, 65);
    doc.text(`GST: ${this.companyInfo.gst}`, 20, 70);

    // Invoice Details
    doc.text(`Invoice Date: ${invoiceData.date}`, pageWidth - 60, 50);
    doc.text(`Order ID: ${invoiceData.orderNumber}`, pageWidth - 60, 55);
    doc.text(`Payment: ${invoiceData.paymentMethod}`, pageWidth - 60, 60);
    if (invoiceData.paymentId) {
      doc.text(`Payment ID: ${invoiceData.paymentId}`, pageWidth - 60, 65);
    }

    // Customer Details
    doc.setFillColor(...lightGray);
    doc.rect(20, 80, pageWidth - 40, 40, 'F');
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 25, 90);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.customer.name, 25, 98);
    doc.text(invoiceData.customer.email, 25, 103);
    doc.text(invoiceData.customer.phone, 25, 108);
    doc.text(invoiceData.customer.address, 25, 113);
    doc.text(`${invoiceData.customer.city}, ${invoiceData.customer.state} - ${invoiceData.customer.pincode}`, 25, 118);

    // Items Table Header
    const tableTop = 140;
    doc.setFillColor(...primaryColor);
    doc.rect(20, tableTop, pageWidth - 40, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    doc.text('Item', 25, tableTop + 10);
    doc.text('Qty', 120, tableTop + 10);
    doc.text('Price', 140, tableTop + 10);
    doc.text('Total', pageWidth - 40, tableTop + 10);

    // Items
    let currentY = tableTop + 25;
    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'normal');
    
    invoiceData.items.forEach((item, index) => {
      if (currentY > pageHeight - 60) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.text(item.name, 25, currentY);
      doc.text(item.quantity.toString(), 120, currentY);
      doc.text(`₹${item.price.toLocaleString()}`, 140, currentY);
      doc.text(`₹${item.total.toLocaleString()}`, pageWidth - 40, currentY);
      
      currentY += 8;
    });

    // Totals
    const totalsY = Math.max(currentY + 10, pageHeight - 80);
    
    doc.setFillColor(...lightGray);
    doc.rect(pageWidth - 80, totalsY - 5, 60, 40, 'F');
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    doc.text('Subtotal:', pageWidth - 75, totalsY + 5);
    doc.text('Tax (18%):', pageWidth - 75, totalsY + 15);
    doc.text('Shipping:', pageWidth - 75, totalsY + 25);
    doc.text('Total:', pageWidth - 75, totalsY + 35);
    
    doc.text(`₹${invoiceData.subtotal.toLocaleString()}`, pageWidth - 25, totalsY + 5);
    doc.text(`₹${invoiceData.tax.toLocaleString()}`, pageWidth - 25, totalsY + 15);
    doc.text(`₹${invoiceData.shipping.toLocaleString()}`, pageWidth - 25, totalsY + 25);
    doc.text(`₹${invoiceData.total.toLocaleString()}`, pageWidth - 25, totalsY + 35);

    // Footer
    doc.setTextColor(...darkColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', 20, pageHeight - 20);
    doc.text('For any queries, contact us at orders@reconautobots.com', 20, pageHeight - 15);
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - 60, pageHeight - 15);

    return doc;
  }

  // Download Invoice
  downloadInvoice(invoiceData: InvoiceData): void {
    const doc = this.generatePDFInvoice(invoiceData);
    const fileName = `Invoice_${invoiceData.invoiceNumber}_${invoiceData.customer.name.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  }

  // Generate Invoice Number
  generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;
