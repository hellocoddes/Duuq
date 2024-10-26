import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Calendar, Upload, Zap, Shield, Eye, AlertTriangle, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import "../globals.css";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 font-sans">
      {/* Modern Gradient Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground opacity-20" />
                  <Eye className="text-primary w-6 h-6 relative z-10" />
                </div>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                KiwqGuard
              </span>
            </div>
            <nav className="hidden md:flex space-x-6">
              {['Features', 'How It Works', 'Dashboard', 'FAQ'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-foreground/60 hover:text-foreground transition-colors duration-200 text-sm font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hover:bg-primary/5">Login</Button>
              <Button className="relative overflow-hidden group">
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Animation */}
      <main className="container mx-auto px-4 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary-foreground/5 rounded-3xl blur-3xl" />
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-center mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Real-time hazard detection
            <br />powered by AI
          </h1>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="group">
              Learn More
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

           {/* Dashboard Preview with Modern Frame */}
      <section id="dashboard" className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl bg-background/50 backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-8 bg-background/90 backdrop-blur-sm border-b border-border/40 flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="pt-8">
              <img 
                src="https://github.com/hellocoddes/Duuq/blob/main/dashboard/app/frontpage/image.png?raw=true" 
                alt="KiwqGuard Dashboard" 
                className="w-full h-full object-cover rounded-b-2xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>
        </div>
      </main>


      {/* How It Works with Hover Effects */}
      <section id="how-it-works" className="relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            How KiwqGuard works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "1. Connect Cameras",
                description: "Easily integrate KiwqGuard with your existing camera systems."
              },
              {
                icon: Eye,
                title: "2. AI Analysis",
                description: "Our advanced AI algorithms continuously analyze video feeds for potential hazards."
              },
              {
                icon: AlertTriangle,
                title: "3. Instant Alerts",
                description: "Receive immediate notifications on your dashboard and mobile devices when issues are detected."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <item.icon className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section with Enhanced Accordion */}
      <section id="faq" className="py-24 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="max-w-2xl mx-auto">
            {[
              {
                question: "What is KiwqGuard?",
                answer: "KiwqGuard is an AI-powered real-time hazard detection system that uses advanced vision technology to identify potential safety risks in various environments."
              },
              {
                question: "How does KiwqGuard detect hazards?",
                answer: "KiwqGuard uses sophisticated AI algorithms to analyze video feeds in real-time, identifying patterns and anomalies that may indicate potential hazards or safety risks."
              },
              {
                question: "Can KiwqGuard integrate with existing camera systems?",
                answer: "Yes, KiwqGuard is designed to easily integrate with most existing camera systems, making it simple to enhance your current security infrastructure."
              },
              {
                question: "Is KiwqGuard suitable for all types of environments?",
                answer: "KiwqGuard is versatile and can be adapted for various environments, including industrial facilities, public spaces, and commercial buildings. Our team can help customize the system to your specific needs."
              }
            ].map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index + 1}`}
                className="border border-border/40 rounded-lg mb-4 bg-background/50 backdrop-blur-sm hover:border-primary/40 transition-colors duration-300"
              >
                <AccordionTrigger className="px-6">{item.question}</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-center mt-12 text-muted-foreground">
            Still have questions?{" "}
            <a 
              href="mailto:support@kiwqguard.ai" 
              className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
              support@kiwqguard.ai
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}