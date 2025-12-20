"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = login(username, password)

    if (user) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      })

      // Wait a bit before redirect
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Force a hard redirect
      window.location.href = "/"
    } else {
      setError("Invalid username or password. Please try again.")
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Use admin/123456",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_70%)]" />

      <Card className="w-full max-w-md p-8 space-y-6 relative z-10 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150" />
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-2xl">
                <Image
                  src="/images/twist-logo.jpeg"
                  alt="TWIST ERP Logo"
                  width={100}
                  height={100}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TWIST ERP
            </h1>
            <p className="text-muted-foreground text-sm mt-2 font-medium">Construction Management System</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p className="font-mono text-xs">
            Username: <strong className="text-primary">admin</strong> | Password:{" "}
            <strong className="text-primary">123456</strong>
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2">
          <p>© 2025 TWIST ERP. All rights reserved.</p>
        </div>
      </Card>
    </div>
  )
}
