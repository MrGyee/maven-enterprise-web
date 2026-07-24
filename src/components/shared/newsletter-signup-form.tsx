"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitNewsletterSignup } from "@/app/actions/leads";

export function NewsletterSignupForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitNewsletterSignup({ email });
      if (result.success) {
        toast.success("Subscribed! Watch your inbox for interior tips and offers.");
        setEmail("");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <Input
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-background"
        aria-label="Email address"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}
