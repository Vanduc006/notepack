"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, EyeOff, Sun, Moon } from "lucide-react"

interface FlashcardData {
  question: string
  answer: string
}

interface FlashcardProps {
  cards: FlashcardData[]
  className?: string
}

export function Flashcard({ cards, className = "" }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const currentCard = cards[currentIndex]

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
    setIsFlipped(false)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    setIsFlipped(false)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePrevious()
      } else if (event.key === "ArrowRight") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentIndex, cards.length])

  if (!cards || cards.length === 0) {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <Card
          className={`p-8 text-center ${isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-600"}`}
        >
          <p>No flashcards available</p>
        </Card>
      </div>
    )
  }

  return (
    <div className={`w-full max-w-md mx-auto space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          {currentIndex + 1} of {cards.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      <div className="relative w-full h-80 md:h-64 [perspective:1000px]">
        <div
          className={`relative w-full h-full cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
          }`}
          onClick={handleFlip}
        >
          <Card
            className={`absolute inset-0 w-full h-full [backface-visibility:hidden] hover:shadow-lg transition-shadow duration-300 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
            style={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff" }}
          >
            <div className="flex flex-col h-full p-4 md:p-6">
              <div className="text-center mb-3">
                <span
                  className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full"
                  style={{
                    color: isDarkMode ? "#fbbf24" : "#dc2626",
                    backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.2)" : "#fef2f2",
                  }}
                >
                  Question
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div
                  className={`w-full max-h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent hover:scrollbar-thumb-gray-400 ${
                    isDarkMode ? "scrollbar-thumb-gray-600" : "scrollbar-thumb-gray-300"
                  }`}
                >
                  <p
                    className="text-base md:text-lg font-semibold leading-relaxed text-center px-2"
                    style={{ color: isDarkMode ? "#f9fafb" : "#000000" }}
                  >
                    {currentCard.question}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1">
                <Eye className="w-3 h-3" style={{ color: isDarkMode ? "#d1d5db" : "#374151" }} />
                <span className="text-xs" style={{ color: isDarkMode ? "#d1d5db" : "#374151" }}>
                  Tap to reveal answer
                </span>
              </div>
            </div>
          </Card>

          <Card
            className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] hover:shadow-lg transition-shadow duration-300 ${
              isDarkMode ? "border-gray-600" : "border-gray-700"
            }`}
            style={{ backgroundColor: isDarkMode ? "#111827" : "#1f2937" }}
          >
            <div className="flex flex-col h-full p-4 md:p-6">
              <div className="text-center mb-3">
                <span
                  className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full"
                  style={{
                    color: "#ffffff",
                    backgroundColor: isDarkMode ? "#059669" : "#10b981",
                  }}
                >
                  Answer
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div
                  className={`w-full max-h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent ${
                    isDarkMode
                      ? "scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400"
                      : "scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
                  }`}
                >
                  <p
                    className="text-base md:text-lg font-medium leading-relaxed text-center px-2"
                    style={{ color: "#ffffff" }}
                  >
                    {currentCard.answer}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1">
                <EyeOff className="w-3 h-3" style={{ color: "#e5e7eb" }} />
                <span className="text-xs" style={{ color: "#e5e7eb" }}>
                  Tap to see question
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 md:gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={cards.length <= 1}
          className={`p-3 md:p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div
          className={`px-3 py-1 rounded-full ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"}`}
        >
          <span className="text-sm font-medium">
            {currentIndex + 1}/{cards.length}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={cards.length <= 1}
          className={`p-3 md:p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}