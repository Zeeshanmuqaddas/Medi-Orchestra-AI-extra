import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, AlertTriangle, Info, Bot } from "lucide-react";

export function AgentFeed({ events }: { events: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-black/40 border border-primary/30 rounded-xl p-4 flex flex-col h-full backdrop-blur-md">
      <h3 className="font-mono uppercase text-primary mb-4 flex items-center gap-2">
        <BrainCircuit className="w-5 h-5" />
        Agent Orchestration Logs
      </h3>
      
      <div className="flex-1 pr-4 overflow-y-auto space-y-4" ref={scrollRef}>
          {events.length === 0 && (
            <div className="text-muted-foreground text-sm font-mono flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary/50 animate-pulse"></span>
               Waiting for Swarm activity...
            </div>
          )}
          {events.map((ev, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-lg border ${
                ev.type === 'CRITICAL' ? 'bg-destructive/10 border-destructive/50' : 
                ev.type === 'ALERT' ? 'bg-orange-500/10 border-orange-500/50' : 
                'bg-primary/5 border-primary/20'
              } animate-in slide-in-from-right-4 fade-in-0`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {ev.type === 'CRITICAL' ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Bot className="w-4 h-4 text-primary" />}
                  <span className="font-mono font-bold text-sm tracking-wider text-primary">{ev.agent}</span>
                </div>
                {ev.confidence && (
                  <Badge variant="outline" className="border-primary/50 text-xs py-0 h-5">
                    {Math.round(ev.confidence * 100)}% CONF
                  </Badge>
                )}
              </div>
              <p className="text-sm font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {ev.message}
              </p>
              <div className="mt-2 text-[10px] text-muted-foreground opacity-50 font-mono">
                {new Date(ev.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
