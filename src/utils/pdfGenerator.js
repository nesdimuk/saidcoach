import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateAndSavePdf = async (htmlContent, fileName) => {
  try {
    const element = document.getElementById(htmlContent);
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
    console.log(`PDF ${fileName} generado y guardado con éxito.`);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
  }
};
