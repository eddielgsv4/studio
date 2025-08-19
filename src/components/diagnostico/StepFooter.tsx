
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";

interface StepFooterProps {
    backHref: string;
    onNextClick?: () => void;
    isNextDisabled?: boolean;
    children?: React.ReactNode;
}

export function StepFooter({ backHref, onNextClick, isNextDisabled, children }: StepFooterProps) {
    return (
        <footer className="sticky bottom-0 z-10 border-t border-border bg-background/80 backdrop-blur-sm">
            <div className="container flex max-w-7xl items-center justify-between py-4">
                <Button variant="outline" asChild>
                    <Link href={backHref}>
                        <Icons.arrowRight className="mr-2 h-4 w-4 rotate-180" />
                        Voltar
                    </Link>
                </Button>
                
                <div className="flex items-center gap-4">
                    {children ? (
                        children
                    ) : (
                        <Button onClick={onNextClick} disabled={isNextDisabled} size="lg">
                            Avançar
                            <Icons.arrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </footer>
    );
}
