"use client";

import React, { useEffect } from 'react';
import { useDiagnostic } from '@/contexts/DiagnosticContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight, ArrowLeft, RefreshCw, Bot, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const questions = [
  {
    key: 'biggestChallenge',
    label: 'What is your biggest sales challenge right now?',
    type: 'textarea',
    placeholder: 'e.g., generating qualified leads, long sales cycles, low closing rates...'
  },
  {
    key: 'pipelineTracking',
    label: 'How do you currently track your sales pipeline?',
    type: 'radio',
    options: ['CRM', 'Spreadsheet', 'Pen & Paper', 'Other']
  },
  {
    key: 'salesCycleLength',
    label: 'What is your average sales cycle length?',
    type: 'text',
    placeholder: 'e.g., 30 days, 3-6 months...'
  },
  {
    key: 'idealCustomer',
    label: 'Briefly describe your ideal customer profile.',
    type: 'textarea',
    placeholder: 'e.g., company size, industry, job titles of buyers...'
  }
];

const DiagnosisSection = () => {
  const {
    responses,
    diagnosis,
    isLoading,
    submitDiagnosis,
    currentQuestion,
    setCurrentQuestion,
    updateResponse,
    resetDiagnosis,
    error,
  } = useDiagnostic();
  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (error) {
      // The toast is shown from the context
    }
  }, [error]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitDiagnosis();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const isNextDisabled = !responses[currentQ.key];

  if (diagnosis) {
    return (
      <section id="diagnosis" className="bg-card/50 py-24 sm:py-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-2xl shadow-primary/10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline text-4xl tracking-wider">Your AI Sales Diagnosis</CardTitle>
              <CardDescription>Here are the key insights and recommendations based on your responses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="flex items-center text-2xl font-bold text-primary"><Lightbulb className="mr-2 h-6 w-6" />Diagnosis</h3>
                <p className="mt-2 text-foreground/80 whitespace-pre-wrap">{diagnosis.diagnosis}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-2xl font-bold">Recommendations</h3>
                <p className="mt-2 text-foreground/80 whitespace-pre-wrap">{diagnosis.recommendations}</p>
              </div>
              <div className="pt-4 text-center">
                <Button onClick={resetDiagnosis}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="diagnosis" className="bg-card/50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-headline text-sm uppercase tracking-widest text-primary">Free Diagnostic Tool</p>
          <h2 className="font-headline mt-2 text-4xl tracking-wider md:text-5xl">
            Pinpoint Your Sales Bottlenecks
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Answer a few questions and our AI will instantly analyze your sales process to identify your biggest opportunities for growth.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-xl">
          <Card className="p-6 sm:p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-semibold">Analyzing your responses...</p>
                <p className="text-center text-foreground/70">Our AI is crunching the numbers to find your key growth levers.</p>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <p className="text-sm text-foreground/60">Question {currentQuestion + 1} of {questions.length}</p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-1.5 rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="min-h-[200px]">
                  <Label htmlFor={currentQ.key} className="text-lg font-semibold">{currentQ.label}</Label>
                  {currentQ.type === 'textarea' && (
                    <Textarea
                      id={currentQ.key}
                      value={responses[currentQ.key] || ''}
                      onChange={(e) => updateResponse(currentQ.key, e.target.value)}
                      placeholder={currentQ.placeholder}
                      className="mt-2 min-h-[120px]"
                    />
                  )}
                  {currentQ.type === 'text' && (
                    <Input
                      id={currentQ.key}
                      value={responses[currentQ.key] || ''}
                      onChange={(e) => updateResponse(currentQ.key, e.target.value)}
                      placeholder={currentQ.placeholder}
                      className="mt-2"
                    />
                  )}
                  {currentQ.type === 'radio' && (
                    <RadioGroup
                      id={currentQ.key}
                      value={responses[currentQ.key]}
                      onValueChange={(value) => updateResponse(currentQ.key, value)}
                      className="mt-4 space-y-2"
                    >
                      {currentQ.options?.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${currentQ.key}-${option}`} />
                          <Label htmlFor={`${currentQ.key}-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handleBack} disabled={currentQuestion === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} disabled={isNextDisabled}>
                    {currentQuestion < questions.length - 1 ? 'Next' : 'Get My Diagnosis'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisSection;
