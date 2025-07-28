"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  Clock,
  DollarSign,
  Users,
  Check,
  Zap,
  Target,
  Mail,
  MessageSquare,
  Sparkles,
  Play,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const waitlistFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  feedback: z.string().optional(),
});

const LessonRushLanding = () => {
  const [mounted, setMounted] = useState(false);
  const form = useForm<z.infer<typeof waitlistFormSchema>>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: "",
      feedback: "",
    },
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); // Add this line
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [showPainSolution, setShowPainSolution] = useState(false);

  // Ensure component is mounted before showing animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Pain points for course creators (Problem-Agitation-Solution)
  const creatorPainPoints = [
    {
      pain: "I spend weeks setting up my course platform instead of creating content",
      solution:
        "Launch-ready course platform in under 5 minutes with zero technical setup",
      icon: <Clock className="h-5 w-5 text-chart-2" />,
    },
    {
      pain: "Technical setup costs eat into my course profits",
      solution:
        "All-in-one solution that eliminates expensive developers and monthly tool subscriptions",
      icon: <DollarSign className="h-5 w-5 text-chart-5" />,
    },
    {
      pain: "I lose students during complicated enrollment processes",
      solution:
        "Streamlined, conversion-optimized enrollment that maximizes student sign-ups",
      icon: <Users className="h-5 w-5 text-chart-4" />,
    },
    {
      pain: "Managing payments, emails, and content delivery is overwhelming",
      solution:
        "Automated systems handle everything while you focus on teaching and growing",
      icon: <Target className="h-5 w-5 text-chart-3" />,
    },
  ];

  // Core MVP features
  const coreFeatures = [
    {
      title: "5-Minute Course Setup",
      description:
        "Upload content, set pricing, go live. No coding, no complicated configurations.",
      icon: <Zap className="h-6 w-6 text-chart-1" />,
      status: "planned",
    },
    {
      title: "Built-in Payment Processing",
      description:
        "Secure payments, automatic tax handling, instant payouts to your account.",
      icon: <CreditCard className="h-6 w-6 text-chart-5" />,
      status: "planned",
    },
    {
      title: "Student Progress Tracking",
      description:
        "Quizzes, certificates, progress tracking that boost completion rates.",
      icon: <BarChart3 className="h-6 w-6 text-chart-4" />,
      status: "planned",
    },
    {
      title: "Content Drip System",
      description:
        "Automatically release lessons to keep students engaged and coming back.",
      icon: <Play className="h-6 w-6 text-chart-3" />,
      status: "planned",
    },
  ];

  const submitToWaitlist = async (
    values: z.infer<typeof waitlistFormSchema>
  ) => {
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          feedback: values.feedback,
          painPoints,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("API error:", result.message);
        return alert(result.message || "Something went wrong");
      }

      // Set success state based on whether feedback was provided
      if (values.feedback && values.feedback.trim()) {
        setFeedbackSubmitted(true);
      } else {
        setIsSubmitted(true);
      }

      form.reset();
      setPainPoints([]);
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Network or server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (
    values: z.infer<typeof waitlistFormSchema>
  ) => {
    setIsSubmitting(true);
    await submitToWaitlist(values);
  };

  const handleButtonClick = async () => {
    const isValid = await form.trigger("email");
    if (!isValid) return;

    const values = form.getValues();
    setIsSubmitting(true);
    await submitToWaitlist(values);
  };

  // Handle pain point selection
  const togglePainPoint = (pain: string) => {
    if (painPoints.includes(pain)) {
      setPainPoints(painPoints.filter((p) => p !== pain));
    } else {
      setPainPoints([...painPoints, pain]);
    }
  };

  // Show solution after selecting pain points
  useEffect(() => {
    if (painPoints.length > 0 && !showPainSolution) {
      const timer = setTimeout(() => setShowPainSolution(true), 500);
      return () => clearTimeout(timer);
    }
  }, [painPoints, showPainSolution]);

  // Don't render animations until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-chart-1/5">
        {/* Header */}
        <header className="relative z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-chart-1 to-chart-4 rounded-lg flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">
                  LessonRush
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-chart-1/10 text-chart-1 border-chart-1/20"
              >
                Coming Soon
              </Badge>
            </div>
          </div>
        </header>

        {/* Loading state */}
        <section className="relative py-20 overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-chart-1/10 rounded-full w-64 mx-auto mb-6"></div>
              <div className="h-16 bg-foreground/10 rounded-lg w-full max-w-3xl mx-auto mb-6"></div>
              <div className="h-6 bg-muted-foreground/10 rounded w-full max-w-2xl mx-auto mb-12"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-chart-1/5">
      {/* Header */}
      <header className="relative z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-chart-1 to-chart-4 rounded-lg flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">
                LessonRush
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-chart-1/10 text-chart-1 border-chart-1/20"
            >
              Coming Soon
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-4/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-chart-1/10 px-4 py-2 rounded-full text-sm font-medium text-chart-1 mb-6 border border-chart-1/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Building the future of online course creation</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="bg-gradient-to-r from-chart-1 via-chart-4 to-chart-1 bg-clip-text text-transparent">
              Launch Your Course Business
            </span>
            <br />
            <span className="text-foreground">in Minutes, Not Months</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            We're building the simplest way to create, launch, and scale your
            online course. No technical skills required. No expensive setup
            costs. Just your expertise and our platform.
          </motion.p>

          {/* Early Access Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-4"
                >
                  <Form {...form}>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email for early access"
                                className="h-12 text-base border-chart-1/20 focus:border-chart-1 focus:ring-chart-1"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        onClick={handleButtonClick}
                        disabled={isSubmitting}
                        className="h-12 px-6 bg-gradient-to-r from-chart-1 to-chart-4 hover:from-chart-1/90 hover:to-chart-4/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>Get Early Access</>
                        )}
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={() => (
                        <FormItem>
                          <FormMessage className="text-center mt-2" />
                        </FormItem>
                      )}
                    />
                  </Form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-chart-5/10 border border-chart-5/20 rounded-lg p-6 text-center"
                >
                  <Check className="h-8 w-8 text-chart-5 mx-auto mb-3" />
                  <h3 className="font-semibold text-chart-5 mb-2">
                    You're on the list! 🎉
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We'll notify you as soon as LessonRush is ready to launch.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust Signals */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground mt-6"
          >
            ✅ No spam, ever • ✅ Be the first to know • ✅ Early bird pricing
          </motion.p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Are These Course Creation Challenges{" "}
              <span className="text-chart-1">Slowing You Down?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Tell us what you're struggling with:
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {creatorPainPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => togglePainPoint(point.pain)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  painPoints.includes(point.pain)
                    ? "border-chart-1 bg-chart-1/5"
                    : "border-border hover:border-chart-1/50 bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                      painPoints.includes(point.pain)
                        ? "bg-chart-1 border-chart-1"
                        : "border-muted-foreground"
                    }`}
                  >
                    {painPoints.includes(point.pain) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-lg ${
                        painPoints.includes(point.pain) ? "font-semibold" : ""
                      }`}
                    >
                      {point.pain}
                    </span>
                  </div>
                  <div className="flex-shrink-0">{point.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solutions appear after selection */}
          <AnimatePresence>
            {painPoints.length > 0 && showPainSolution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-r from-chart-1/10 to-chart-4/10 rounded-xl p-6 border border-chart-1/20"
              >
                <h3 className="text-2xl font-bold text-center mb-6 text-chart-1">
                  LessonRush Will Solve These Exact Problems:
                </h3>
                <div className="space-y-4">
                  {creatorPainPoints
                    .filter((p) => painPoints.includes(p.pain))
                    .map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-chart-1 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-chart-1">
                            {point.pain}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            ✅ {point.solution}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We're Building for <span className="text-chart-1">You</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              The core features that will make course creation effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="p-6 h-full border-border hover:border-chart-1/50 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center group-hover:bg-chart-1/20 transition-colors">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {feature.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs text-chart-1 border-chart-1/30"
                          >
                            Planned
                          </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-muted/30" id="feedback-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Help Us Build <span className="text-chart-1">Exactly</span> What
              You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              What features would make your course creation journey easier?
            </p>
          </div>

          <Card className="p-8 border-chart-1/20">
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {!feedbackSubmitted ? (
                  <motion.div
                    key="feedback-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-foreground">
                                Email Address *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="your@email.com"
                                  className="h-12 border-chart-1/20 focus:border-chart-1 focus:ring-chart-1"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="feedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-foreground">
                                What features do you need most? What problems
                                should we solve first?
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Tell us about your course creation challenges, feature requests, or what would make this platform perfect for you..."
                                  className="min-h-[120px] border-chart-1/20 focus:border-chart-1 focus:ring-chart-1 resize-none"
                                  rows={5}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-12 bg-gradient-to-r from-chart-1 to-chart-4 hover:from-chart-1/90 hover:to-chart-4/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              Join Waitlist & Share Feedback
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="feedback-success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-chart-5/10 border border-chart-5/20 rounded-lg p-8 text-center"
                  >
                    <Check className="h-12 w-12 text-chart-5 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-chart-5 mb-3">
                      Thank you for your feedback! 🎉
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Your insights are invaluable in helping us build the
                      perfect course creation platform.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We've added you to our waitlist and will keep you updated
                      on our progress.
                    </p>
                    <Button
                      onClick={() => {
                        setFeedbackSubmitted(false);
                        form.reset();
                      }}
                      variant="outline"
                      className="mt-4 border-chart-1/30 text-chart-1 hover:bg-chart-1/10"
                    >
                      Submit More Feedback
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-chart-1 to-chart-4 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Be Among the First to Experience LessonRush
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our waitlist and get exclusive early access, special pricing,
            and the chance to shape the product.
          </p>

          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-90 mb-8">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Early bird pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Beta access</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Shape the product</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>No spam, ever</span>
            </div>
          </div>

          <Button
            onClick={() =>
              document
                .getElementById("feedback-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            size="lg"
            className="bg-white text-chart-1 hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Mail className="mr-2 h-5 w-5" />
            Join the Waitlist
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-chart-1 to-chart-4 rounded-lg flex items-center justify-center">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-4 bg-clip-text text-transparent">
                LessonRush
              </span>
            </div>

            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a
                href="mailto:hello@lessonrush.com"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
            © 2025 LessonRush. Building the future of online course creation.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LessonRushLanding;
