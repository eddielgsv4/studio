import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { faqData } from "@/lib/data";
import { Icons } from "../icons";

export default function Faq() {
    return (
        <section id="faq" className="w-full bg-background">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="mx-auto text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Perguntas <span className="text-primary italic">Frequentes</span>
                    </h2>
                </div>
                <div className="mt-12">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqData.items.map((item, index) => (
                            <AccordionItem key={item.id} value={item.id} className="rounded-lg border bg-card px-6 shadow-lg data-[state=open]:border-primary/50" data-analytics-id={`faq_open_${index}`}>
                                <AccordionTrigger className="py-5 text-left text-lg font-semibold hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-base text-muted-foreground">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
