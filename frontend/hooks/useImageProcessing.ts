import { useState, useCallback } from 'react';
import { analyzeImage } from '@/lib/api';

export const useImageProcessing = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const data = await analyzeImage(file);
      setResult(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return {
    file, 
    preview, 
    loading, 
    result, 
    onDrop, 
    handleAnalyze, 
    handleClear, 
    setResult
  };
};
