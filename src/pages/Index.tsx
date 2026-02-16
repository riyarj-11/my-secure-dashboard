import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LayoutDashboard, Shield, Zap, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-accent" />
          <span className="text-xl font-display font-bold">TaskFlow</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-24 text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
          Manage tasks with<br />
          <span className="text-accent">clarity & speed</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          A scalable task management app with secure authentication, real-time CRUD operations, and a beautiful dashboard.
        </p>
        <div className="flex gap-3 justify-center">
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/auth">
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Secure Auth", desc: "JWT-based authentication with email verification and password hashing." },
            { icon: Zap, title: "Real-time CRUD", desc: "Create, read, update, and delete tasks instantly with optimistic updates." },
            { icon: CheckCircle2, title: "Smart Filters", desc: "Search, filter by status and priority to find exactly what you need." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t border-border text-center text-sm text-muted-foreground">
        © 2026 TaskFlow. Built with Lovable Cloud.
      </footer>
    </div>
  );
}
