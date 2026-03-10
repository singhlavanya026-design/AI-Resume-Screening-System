import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '../lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

// Set up worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onTextExtracted, onFileSelect }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File) => {
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      onTextExtracted(fullText);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      alert('Failed to extract text from PDF. Please try pasting the text instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type === 'application/pdf') {
      setFileName(file.name);
      onFileSelect(file);
      await extractTextFromPDF(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
      setFileName(file.name);
      onFileSelect(file);
      // For DOCX, we might need a library like mammoth.js, but for now let's suggest PDF or Paste
      alert('DOCX support is limited in this preview. Please use PDF or paste your resume text.');
    } else {
      alert('Please upload a PDF or Word document.');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all',
        isDragging ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400',
        fileName && 'border-emerald-200 bg-emerald-50/30'
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent" />
          <p className="text-sm font-medium text-zinc-600">Extracting text from resume...</p>
        </div>
      ) : fileName ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <FileText size={24} />
          </div>
          <div className="text-center">
            <p className="font-medium text-zinc-900">{fileName}</p>
            <button
              onClick={() => { setFileName(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              className="mt-2 text-xs font-medium text-zinc-500 hover:text-red-500"
            >
              Remove file
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <Upload size={24} />
          </div>
          <p className="mb-1 text-sm font-medium text-zinc-900">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-zinc-500">PDF or Word (max. 5MB)</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </>
      )}
    </div>
  );
};
