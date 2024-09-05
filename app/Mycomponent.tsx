"use client";
import { motion } from "framer-motion";
import { LampContainer } from "../components/ui/lamp";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function MyComponent() {
  const [data, setData] = useState<string>("");
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const placeholders = [
    "What is the story of Donald Trump?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(evt.target.value);
  };

  const processInput = (input: string): string => {
    const defaultPrompt = "While generating always generate with heading between ## ##";
    return `${defaultPrompt} : ${input}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const genAI = new GoogleGenerativeAI('AIzaSyDvO1wNf6PYMJzVUIl-WNwP3E0PlEMXwV4');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = processInput(input);

    model.generateContent(prompt)
      .then(result => {
        const responseText = result.response.text();
        console.log(responseText);

        setData(responseText);
        setError('');
      })
      .catch(err => {
        console.error('Error:', err);
        setData(''); // Clear data on error
        if (err.message.includes('SAFETY')) {
          setError('The generated content was blocked due to safety concerns. Please try a different prompt.');
        } else {
          setError('An error occurred. Please try again.');
        }
      });
  };

  return (
    <>
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          <div className="grid grid-cols-12">
            <div className="col-span-3"></div>
            <div className="col-span-6">
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <p>{data}</p>

              {/* Render the custom input component */}
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
            <div className="col-span-3"></div>
          </div>
        </motion.h1>
      </LampContainer>