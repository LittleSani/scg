'use client'

import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import SceneGraphVisualizer from '@/components/SceneGraphVisualizer'
import { Button } from '@/components/ui/button'
import { useImageProcessing } from '@/hooks/useImageProcessing'
import { useState } from 'react';

export default function Home() {
  const { file, preview, loading, result, onDrop, handleAnalyze, handleClear } = useImageProcessing();
  const [showMiniMap, setShowMiniMap] = useState(true);

  const toggleMiniMap = () => {
    setShowMiniMap((prev) => !prev);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl"
      >
        <header className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-gray-900">SceneGraph AI</h1>
          <p className="text-xl text-gray-600 mt-2">
            Generate scene graphs and descriptions from your images.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center" 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Input Image</h2>
            <motion.div
              {...getRootProps()}
              className={`w-full h-80 border-4 border-dashed rounded-xl flex items-center justify-center text-center cursor-pointer transition-colors duration-300 ${
                isDragActive ? 'border-blue-500 bg-gray-50' : 'border-gray-300 hover:border-blue-400'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <input {...getInputProps()} />
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <div className="text-gray-500">
                  <p className="text-2xl">Drop your image here</p>
                  <p className="text-sm">or click to select a file</p>
                </div>
              )}
            </motion.div>

            <div className="flex mt-8 space-x-4">
              <Button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </Button>
              <Button
                onClick={handleClear}
                className="px-10 py-4 bg-red-500 text-white font-semibold rounded-lg shadow-md"
              >
                Clear
              </Button>
            </div>
          </motion.div>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="loader"></div>
              </motion.div>
            )}
            {result && (
              <>
                <motion.div 
                  className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Processed Image</h2>
                  <div className="w-full h-80 flex items-center justify-center border border-gray-300 rounded-xl overflow-hidden">
                    <img src={`data:image/png;base64,${result.processed_image}`} alt="Processed" className="h-full w-full object-contain rounded-lg" />
                  </div>
                </motion.div>
                <motion.div 
                  className="bg-white p-8 rounded-2xl shadow-lg h-full relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Visual Scene Graph</h2>
                  <SceneGraphVisualizer sceneGraph={result.scene_graph} showMiniMap={showMiniMap} />
                  <button 
                    onClick={toggleMiniMap} 
                    className="absolute bottom-4 right-4 z-10 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                  >
                    {showMiniMap ? 'Hide MiniMap' : 'Show MiniMap'}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-7xl mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Analysis Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <h3 className="text-2xl font-semibold text-gray-800">Description</h3>
                  <p className="text-gray-600 mt-2">{result.description}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <h3 className="text-2xl font-semibold text-gray-800">Objects</h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    {result.scene_graph.objects.map((obj: any, index: number) => (
                      <li key={index}>{obj.id}</li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                  <h3 className="text-2xl font-semibold text-gray-800">Relationships</h3>
                  <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                    {result.scene_graph.relationships.map((rel: string, index: number) => (
                      <li key={index}>{rel}</li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}