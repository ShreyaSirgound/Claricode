/*import React, { useState, useEffect } from 'react';
import { generateLesson } from '../services/geminiService';
import { Lesson, Concept, Folder } from '../types';
import { SpinnerIcon, PlusIcon, CodeIcon, ImageIcon, TextFileIcon, XIcon } from './Icons';

interface NewLessonFormProps {
  folders: Folder[];
  onLessonCreated: (lesson: Lesson, folderId: string) => void;
}

const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
        return <ImageIcon className="w-5 h-5 text-purple-600 dark:text-[#C084FC] flex-shrink-0" />;
    }
    if (/\.(java|py|js|ts|c|cpp|cs|html|css|json)$/i.test(file.name)) {
        return <CodeIcon className="w-5 h-5 text-blue-600 dark:text-[#60A5FA] flex-shrink-0" />;
    }
    return <TextFileIcon className="w-5 h-5 text-gray-600 dark:text-[#B0B0B0] flex-shrink-0" />;
}

export const NewLessonForm: React.FC<NewLessonFormProps> = ({ folders, onLessonCreated }) => {
  const [topic, setTopic] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [lessonNotes, setLessonNotes] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Key to reset file input

  useEffect(() => {
    if (folders.length > 0) {
        setSelectedFolderId(folders[0].id);
    }
  }, [folders]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(event.target.files!)]);
      // Reset the input by changing its key, forcing a re-mount.
      // This is a more robust React-idiomatic way than setting event.target.value = ''.
      setFileInputKey(Date.now());
    }
  };
  
  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!topic || files.length === 0) {
      setError('Please provide a topic and at least one file.');
      return;
    }
    if (!selectedFolderId) {
        setError('Please select a folder.');
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const concepts = await generateLesson(topic, files, lessonNotes);
      const newLesson: Lesson = {
        id: self.crypto.randomUUID(),
        topic,
        concepts,
        annotations: [],
      };
      onLessonCreated(newLesson, selectedFolderId);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-transparent overflow-y-auto">
        <div className="new-lesson-form-wrapper flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl p-8 space-y-8 bg-white text-gray-900 dark:bg-[#212121] backdrop-blur-2xl border border-gray-300 dark:border-[#4A4A4A] rounded-2xl shadow-2xl shadow-purple-500/10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Create a New Lesson</h1>
                    <p className="mt-2 text-gray-700 dark:text-gray-400">Upload your code files and let AI build your learning guide.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="topic" className="block font-medium text-gray-800 dark:text-gray-300 mb-2">Lesson Topic</label>
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., 'UML Diagrams and Java Inheritance'"
                            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#333333] dark:text-gray-200 dark:border-[#4A4A4A]"
                        />
                    </div>

                    <div>
                        <label htmlFor="folder" className="block font-medium text-gray-800 dark:text-gray-300 mb-2">Save to Folder</label>
                        <select
                            id="folder"
                            value={selectedFolderId}
                            onChange={(e) => setSelectedFolderId(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#333333] dark:text-gray-200 dark:border-[#4A4A4A]"
                            disabled={folders.length === 0}
                        >
                            {folders.map(folder => (
                                <option key={folder.id} value={folder.id}>{folder.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block font-medium text-gray-800 dark:text-gray-300 mb-2">Lesson Instructions (Optional)</label>
                        <textarea
                            id="notes"
                            value={lessonNotes}
                            onChange={(e) => setLessonNotes(e.target.value)}
                            placeholder="e.g., 'Focus on beginner-friendly explanations. Compare the Java code to Python equivalents.'"
                            className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#333333] dark:text-gray-200 dark:border-[#4A4A4A]"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-800 dark:text-gray-300 mb-2">Upload Files</label>
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-[#4A4A4A]">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-600 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-gray-700 dark:text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 dark:text-[#60A5FA] hover:text-blue-700 dark:hover:text-[#4F46E5] focus-within:outline-none">
                                        <span>Upload files</span>
                                        <input key={fileInputKey} id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-500">.java, .py, .js, .png, .jpg, etc.</p>
                            </div>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-300">Selected files:</h3>
                            <ul className="mt-2 space-y-2 text-gray-800 dark:text-gray-400 max-h-40 overflow-y-auto border border-gray-300 rounded p-3 bg-gray-100 dark:bg-[#333333] dark:border-[#4A4A4A]">
                                {files.map((file, i) => (
                                    <li key={`${file.name}-${i}`} className="flex items-center justify-between space-x-2">
                                        <div className="flex items-center space-x-2 truncate">
                                            {getFileIcon(file)}
                                            <span className="truncate">{file.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(i)}
                                            className="p-1 text-gray-600 hover:text-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                            aria-label={`Remove ${file.name}`}
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-500"
                        >
                            {isLoading ? <SpinnerIcon className="w-5 h-5 mr-2" /> : <PlusIcon className="w-5 h-5 mr-2" />}
                            {isLoading ? 'Generating Lesson...' : 'Create Lesson'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};
*/
import React, { useState } from 'react';
import { Folder, Lesson, Concept } from '../types';
import { FileIcon, SparklesIcon } from './Icons';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface NewLessonFormProps {
    folders: Folder[];
    onLessonCreated: (lesson: Lesson, folderId: string) => void;
}

export const NewLessonForm: React.FC<NewLessonFormProps> = ({ folders, onLessonCreated }) => {
    const [topic, setTopic] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState(folders[0]?.id || '');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUploadedFiles(Array.from(event.target.files));
        }
    };

    const generateMermaidPrompt = (conceptTerm: string, definition: string): string => {
        return `Create a Mermaid diagram that visually represents the concept of "${conceptTerm}". 
Definition: ${definition}

Choose the most appropriate diagram type (flowchart, sequence, class, state, etc.) that best illustrates this concept.
Return ONLY the Mermaid code without any explanation, markdown code blocks, or additional text.
The diagram should be clear, educational, and help students understand the concept visually.`;
    };

    const callGeminiAPI = async (prompt: string): Promise<string> => {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    };

    const generateLesson = async () => {
        if (!topic.trim() && uploadedFiles.length === 0) {
            setError('Please enter a topic or upload files.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let prompt = '';
            const promptParts: string[] = [];

            if (uploadedFiles.length > 0) {
                prompt = `Analyze the following code files and create a comprehensive lesson. For each major concept, provide:
1. A clear term/title
2. A detailed definition
3. Important notes or tips
4. A practical code example

Topic context: ${topic || 'General analysis'}

Return your response in the following JSON format:
{
  "topic": "lesson topic",
  "concepts": [
    {
      "term": "concept name",
      "definition": "detailed explanation",
      "notes": "important tips and context",
      "codeExample": "practical code example"
    }
  ]
}`;

                for (const file of uploadedFiles) {
                    const text = await file.text();
                    promptParts.push(`File: ${file.name}\n\`\`\`\n${text}\n\`\`\``);
                }
            } else {
                prompt = `Create a comprehensive lesson about "${topic}". Identify 3-5 key concepts and for each provide:
1. A clear term/title
2. A detailed definition
3. Important notes or tips
4. A practical code example

Return your response in the following JSON format:
{
  "topic": "${topic}",
  "concepts": [
    {
      "term": "concept name",
      "definition": "detailed explanation",
      "notes": "important tips and context",
      "codeExample": "practical code example"
    }
  ]
}`;
            }

            const fullPrompt = prompt + '\n\n' + promptParts.join('\n\n');
            const responseText = await callGeminiAPI(fullPrompt);

            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from AI');
            }

            const lessonData = JSON.parse(jsonMatch[0]);

            // Generate Mermaid diagrams for each concept
            const conceptsWithMermaid: Concept[] = await Promise.all(
                lessonData.concepts.map(async (concept: any) => {
                    try {
                        // Generate Mermaid diagram code
                        const mermaidPrompt = generateMermaidPrompt(concept.term, concept.definition);
                        const mermaidResponse = await callGeminiAPI(mermaidPrompt);
                        let mermaidCode = mermaidResponse.trim();
                        
                        // Clean up the response - remove markdown code blocks if present
                        mermaidCode = mermaidCode
                            .replace(/```mermaid\n?/g, '')
                            .replace(/```\n?/g, '')
                            .trim();

                        return {
                            id: self.crypto.randomUUID(),
                            term: concept.term,
                            definition: concept.definition,
                            notes: concept.notes,
                            visualExample: mermaidCode, // Store Mermaid code instead of image
                            codeExample: concept.codeExample,
                        };
                    } catch (err) {
                        console.error(`Error generating Mermaid for ${concept.term}:`, err);
                        // Fallback to a simple flowchart if generation fails
                        return {
                            id: self.crypto.randomUUID(),
                            term: concept.term,
                            definition: concept.definition,
                            notes: concept.notes,
                            visualExample: `flowchart TD\n    A[${concept.term}] --> B[See definition for details]`,
                            codeExample: concept.codeExample,
                        };
                    }
                })
            );

            const newLesson: Lesson = {
                id: self.crypto.randomUUID(),
                topic: lessonData.topic,
                concepts: conceptsWithMermaid,
                annotations: [],
            };

            onLessonCreated(newLesson, selectedFolderId);
            setTopic('');
            setUploadedFiles([]);
        } catch (err) {
            console.error('Error generating lesson:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate lesson');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 new-lesson-form-wrapper">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600/50">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create a New Lesson</h2>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Select Folder
                    </label>
                    <select
                        value={selectedFolderId}
                        onChange={(e) => setSelectedFolderId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
                                {folder.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Lesson Topic
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., React Hooks, Python Lists, Data Structures"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Upload Code Files (Optional)
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.rb,.go,.php,.html,.css,.json,.md"
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors bg-gray-50 dark:bg-gray-800"
                        >
                            <FileIcon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                                {uploadedFiles.length > 0
                                    ? `${uploadedFiles.length} file(s) selected`
                                    : 'Click to upload files'}
                            </span>
                        </label>
                    </div>
                    {uploadedFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                    <span className="truncate">📄 {file.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <button
                    onClick={generateLesson}
                    disabled={loading || (!topic.trim() && uploadedFiles.length === 0)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed font-medium"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Generating Lesson with Mermaid Diagrams...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            Generate Lesson
                        </>
                    )}
                </button>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                    AI will generate diagrams using Mermaid.js for visual representations
                </p>
            </div>
        </div>
    );
};