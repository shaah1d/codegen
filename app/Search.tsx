"use client";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/ui/aurora-background";

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
    const defaultPrompt = "Generate in JSON format with three properties: heading, code, and content. Remove the ```json tags from the first and last lines.";
    return `${defaultPrompt} : ${input}`;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const genAI = new GoogleGenerativeAI('AIzaSyDvO1wNf6PYMJzVUIl-WNwP3E0PlEMXwV4');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = processInput(input);

    try {
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text(); // Await the text here
      console.log(responseText);

      // Parse the JSON response
      const jsonfile = JSON.parse(responseText);

      // Update the state with parsed JSON
      setData(jsonfile);
      setError('');

    } catch (err) {
      console.error('Error:', err);  // Use `err` instead of `error`
      setData(''); // Clear data on error
      if (err instanceof Error && err.message.includes('SAFETY')) {
        setError('The generated content was blocked due to safety concerns. Please try a different prompt.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="bg-black color-white">
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="h-screen flex flex-col justify-center items-center px-4">
            {data ? (
              <>
                <h1 className="font-bold">{data.heading}</h1>
                <code>{data.code}</code>
                <p>{data.content}</p>
              </>
            ) : (
              <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl text-black font-bold">
                Ask <span style={{ color: "darkblue" }}>CodeGen</span> Anything.
              </h2>
            )}

            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>
        </motion.div>
      </AuroraBackground>
    </div>
  );
}
