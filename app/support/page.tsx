"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react"
import { submitSupportRequest } from "./actions"

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await submitSupportRequest(formData)
      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setIsSuccess(true)
      }
    } catch (e) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 py-12 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Support & Requests
          </h1>
          <p className="text-muted text-lg">
            Having an issue or want to request a new application? Send us a message below.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-green-500/20 text-green-500 rounded-full p-4 mb-2">
               <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-white">Message Sent!</h2>
            <p className="text-muted max-w-md">
              Thank you for reaching out. We have received your request and our team will review it shortly.
            </p>
            <Link
              href="/"
              className="mt-6 bg-white hover:bg-white/90 text-black font-bold h-12 px-8 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-white/80">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-mono"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/80">
                  Email Address <span className="text-muted text-xs">(Optional)</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-mono"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-white/80">
                  Message / Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="I would like to request the following application..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-white/20 transition-all h-32 resize-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-white/90 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-black font-bold h-12 rounded-full transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="w-4 h-4 ml-1" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
