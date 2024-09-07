"use client";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GoogleGenerativeAI } from "@google/generative-ai";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "What is the difference between an array and a linked list?",
    "Explain the concept of Object-Oriented Programming (OOP).",
    "What is a REST API and how does it work?",
    "How do you implement recursion in a function?",
    "What is the difference between binary search and linear search",
  ];

  const [data, setData] = useState<any>(""); // Use `any` if the structure of `data` varies
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const processInput = (input: string): string => {
    const defaultPrompt = "Generate a JSON with properties: heading, code, content, and language; then in the content property add other properties which are the subheadings of the content; omit ```json tags, and use /n for line breaking.";
    return `${defaultPrompt} : ${input}`;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_APP_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = processInput(input);

    try {
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text(); 
      console.log(responseText);

      const jsonfile = JSON.parse(responseText);

      setData(jsonfile);
      setError('');

    } catch (err) {
      console.error('Error:', err);  
      setData('');
      if (err instanceof Error && err.message.includes('SAFETY')) {
        setError('The generated content was blocked due to safety concerns. Please try a different prompt.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 min-h-screen">
    
      <div className="hidden sm:block sm:col-span-3"></div>

     
      <div className="flex flex-col col-span-1 sm:col-span-6 justify-center items-center px-4">
        {data ? (
          <>
            <h1 className="font-bold text-3xl sm:text-4xl p-8">{data.heading}</h1>

 
            <SyntaxHighlighter language={data.language} style={materialLight} className="block whitespace-pre-wrap bg-gray-100 text-black p-4 rounded-lg mb-4 font-mono text-sm leading-relaxed">
              {data.code}
            </SyntaxHighlighter>

          
            {data.content && typeof data.content === 'object' ? (
              Object.entries(data.content).map(([key, value], index) => (
                <div key={index}>
                  <h3 className="font-bold text-xl">{key}</h3>
                  <p className="mb-4">{value}</p>
                </div>
              ))
            ) : (
              <p>{data.content}</p>
            )}

          </>
        ) : (
          <h2 className="mb-10 sm:mb-20 text-2xl sm:text-5xl text-center text-black font-bold">
            Ask <span className="text-blue-700">CodeGen</span> Anything.
          </h2>
        )}
        <div className="sticky bottom-0 w-full bg-white">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>

      <div className="hidden sm:block sm:col-span-3"></div>
    </div>

  );
}
