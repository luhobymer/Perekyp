import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'react-native-fs';
import { PDFDocument } from 'pdf-lib';
import { useFile } from './useFile';

// Типи для PDF
export interface PDFHook {
  loading: boolean;
  error: string | null;
  createPDF: (content: string) => Promise<string>;
  mergePDFs: (pdfPaths: string[]) => Promise<string>;
  addPageToPDF: (pdfPath: string, content: string) => Promise<string>;
  extractPages: (pdfPath: string, pageNumbers: number[]) => Promise<string>;
}

export const usePDF = (): PDFHook => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { saveFile, openFile } = useFile();

  const createPDF = useCallback(async (content: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      page.drawText(content, {
        x: 50,
        y: height - 50,
        size: 12,
      });

      const pdfBytes = await pdfDoc.save();
      const tempPath = `${FileSystem.CachesDirectoryPath}/temp.pdf`;
      await FileSystem.writeFile(tempPath, pdfBytes.toString('base64'), 'base64');

      return tempPath;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const mergePDFs = useCallback(async (pdfPaths: string[]): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const mergedPdf = await PDFDocument.create();
      
      for (const path of pdfPaths) {
        const pdfBytes = await FileSystem.readFile(path, 'base64');
        const pdf = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const tempPath = `${FileSystem.CachesDirectoryPath}/merged.pdf`;
      await FileSystem.writeFile(tempPath, mergedPdfBytes.toString('base64'), 'base64');

      return tempPath;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPageToPDF = useCallback(async (pdfPath: string, content: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const pdfBytes = await FileSystem.readFile(pdfPath, 'base64');
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      
      page.drawText(content, {
        x: 50,
        y: height - 50,
        size: 12,
      });

      const newPdfBytes = await pdfDoc.save();
      const tempPath = `${FileSystem.CachesDirectoryPath}/updated.pdf`;
      await FileSystem.writeFile(tempPath, newPdfBytes.toString('base64'), 'base64');

      return tempPath;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const extractPages = useCallback(async (pdfPath: string, pageNumbers: number[]): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const pdfBytes = await FileSystem.readFile(pdfPath, 'base64');
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      
      for (const pageNum of pageNumbers) {
        if (pageNum > 0 && pageNum <= pdfDoc.getPageCount()) {
          const [page] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
          newPdf.addPage(page);
        }
      }

      const newPdfBytes = await newPdf.save();
      const tempPath = `${FileSystem.CachesDirectoryPath}/extracted.pdf`;
      await FileSystem.writeFile(tempPath, newPdfBytes.toString('base64'), 'base64');

      return tempPath;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPDF,
    mergePDFs,
    addPageToPDF,
    extractPages,
  };
};

export default usePDF;
