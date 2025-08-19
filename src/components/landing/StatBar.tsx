import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface StatBarProps {
    label: string;
    value: number;
    marketValue: number;
    status: 'green' | 'amber' | 'red';
}

const statusConfig = {
    green: { text: "Acima", color: "bg-green-500", progressClass: "bg-green-500" },
    amber: { text: "Atenção", color: "bg-amber-500", progressClass: "bg-amber-500" },
    red: { text: "Abaixo", color: "bg-primary", progressClass: "bg-primary" },
};

export default function StatBar({ label, value, marketValue, status }: StatBarProps) {
    const config = statusConfig[status] || statusConfig.red;
    
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground">{label}</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span>vs {marketValue}%</span>
                    <div className={cn("h-2 w-2 rounded-full", config.color)} />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Progress value={value} indicatorClassName={config.progressClass} className="h-2" />
                <span className="font-semibold text-foreground w-12 text-right text-sm">{value}%</span>
            </div>
        </div>
    );
}
