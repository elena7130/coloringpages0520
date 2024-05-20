// utils/generatePdf.ts

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates a PDF from a given element.
 * @param element HTML element to render as PDF.
 */
export const generatePdf = async (element: HTMLElement) => {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  pdf.addImage(imgData, 'PNG', 0, 0);
  pdf.save('download.pdf');
};
