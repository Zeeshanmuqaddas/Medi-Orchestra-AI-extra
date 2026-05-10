import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Play, Square, Mic, ShieldAlert } from "lucide-react";
import { EcgWave } from "./components/dashboard/EcgWave";
import { TelemetryPanel } from "./components/dashboard/TelemetryPanel";
import { AgentFeed } from "./components/dashboard/AgentFeed";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FhirViewer } from "./components/dashboard/FhirViewer";

export default function App() {
  const [active, setActive] = useState(false);
  const [vitals, setVitals] = useState({ heartRate: 0, spO2: 100, map: 90, respiratoryRate: 14 });
  const [events, setEvents] = useState<any[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [voiceQuery, setVoiceQuery] = useState("");

  const startSimulation = () => {
    if(!ws || ws.readyState !== WebSocket.OPEN) {
      const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);
      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'START_SIMULATION' }));
        setWs(socket);
        setActive(true);
      };
      
      socket.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'TELEMETRY_UPDATE') {
          setVitals(msg.payload);
        } else if (msg.type === 'AGENT_REASONING') {
          setEvents(prev => [...prev, { ...msg.payload, timestamp: msg.timestamp }]);
        } else if (msg.type === 'SIMULATION_STOPPED') {
          setActive(false);
        }
      };

      socket.onclose = () => {
         setActive(false);
         setWs(null);
      };
    } else {
      ws.send(JSON.stringify({ type: 'START_SIMULATION' }));
      setActive(true);
    }
  };

  const stopSimulation = () => {
     if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'STOP_SIMULATION' }));
     }
  };

  const askVoiceCopilot = () => {
    if (ws && ws.readyState === WebSocket.OPEN && voiceQuery) {
      ws.send(JSON.stringify({ type: 'ASK_VOICE_COPILOT', payload: { query: voiceQuery } }));
      setVoiceQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 md:p-6 lg:p-8 gap-6 font-sans">
      <header className="flex justify-between items-center pb-4 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-primary animate-pulse" />
          <h1 className="text-3xl font-bold tracking-tighter uppercase font-mono text-white shadow-primary">
            Medi-Orchestra <span className="text-primary">AI</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
           {active ? (
              <Button onClick={stopSimulation} variant="destructive" className="font-mono font-bold uppercase tracking-widest gap-2">
                 <Square className="w-4 h-4" fill="currentColor"/> Stop Sim
              </Button>
           ) : (
             <Button onClick={startSimulation} className="bg-primary text-background hover:bg-primary/90 font-mono font-bold uppercase tracking-widest gap-2 shadow-[0_0_15px_rgba(20,200,255,0.5)]">
                <Play className="w-4 h-4" fill="currentColor"/> Simulate Emergency
             </Button>
           )}
        </div>
      </header>
      
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
             {/* Left Panel: Telemetry Grid */}
             <TelemetryPanel vitals={vitals} />
             
             {/* Right Panel: Patient Bio & ECG */}
             <div className="bg-black/40 border border-primary/30 rounded-xl p-4 flex flex-col justify-between backdrop-blur-md">
                <div>
                   <h3 className="font-mono text-sm text-primary uppercase tracking-widest mb-4 flex gap-2 items-center">
                     Patient Profile <ShieldAlert className="w-4 h-4 text-orange-500"/>
                   </h3>
                   <div className="grid grid-cols-2 gap-4 font-mono text-sm mb-4">
                     <div><span className="text-muted-foreground mr-2">ID:</span> PT-99842</div>
                     <div><span className="text-muted-foreground mr-2">AGE:</span> 64</div>
                     <div><span className="text-muted-foreground mr-2">ADMIT:</span> SEPSIS WATCH</div>
                     <div><span className="text-muted-foreground mr-2">FHIR:</span> CONNECTED</div>
                   </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-end">
                   <div className="font-mono text-xs text-primary/70 mb-2">LIVE ECG FEED</div>
                   <EcgWave active={active} />
                </div>
             </div>
          </div>
          
          <div className="flex-1 bg-black/40 border border-primary/30 rounded-xl p-4 backdrop-blur-md flex flex-col min-h-[400px]">
             <Tabs defaultValue="copilot" className="h-full flex flex-col">
               <TabsList className="bg-black/50 border border-primary/20 p-1 mb-4 grid grid-cols-2">
                 <TabsTrigger value="copilot" className="font-mono text-xs uppercase data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Voice Copilot & Analytics</TabsTrigger>
                 <TabsTrigger value="fhir" className="font-mono text-xs uppercase data-[state=active]:bg-primary/20 data-[state=active]:text-primary">FHIR Explorer</TabsTrigger>
               </TabsList>
               
               <TabsContent value="copilot" className="flex-1 flex flex-col mt-0 border-0 p-0 shadow-none min-h-0">
                 <h3 className="font-mono text-sm text-primary uppercase tracking-widest mb-4">
                    Voice AI Copilot
                 </h3>
                 <div className="flex gap-4">
                    <Input 
                       className="font-mono bg-white/5 border-primary/40 focus-visible:ring-primary h-12"
                       placeholder="Ask about patient status (e.g. 'Summarize patient deterioration risk')"
                       value={voiceQuery}
                       onChange={e => setVoiceQuery(e.target.value)}
                       onKeyDown={e => { if(e.key === 'Enter') askVoiceCopilot()} }
                       disabled={!active}
                    />
                    <Button disabled={!active} onClick={askVoiceCopilot} className="h-12 w-12 bg-primary/20 text-primary hover:bg-primary/40 flex-shrink-0">
                       <Mic className="w-5 h-5"/>
                    </Button>
                 </div>
                 
                 <div className="mt-6 flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-primary/5 border border-primary/20 rounded p-3 text-center flex flex-col justify-center">
                      <div className="text-xl font-bold font-mono text-primary">-45%</div>
                      <div className="text-[10px] uppercase text-muted-foreground mt-1">Diagnosis Delay</div>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded p-3 text-center flex flex-col justify-center">
                      <div className="text-xl font-bold font-mono text-orange-500">-18%</div>
                      <div className="text-[10px] uppercase text-muted-foreground mt-1">Sepsis Mortality</div>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded p-3 text-center flex flex-col justify-center">
                      <div className="text-xl font-bold font-mono text-primary">Sub-2m</div>
                      <div className="text-[10px] uppercase text-muted-foreground mt-1">Triage Time</div>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded p-3 text-center flex flex-col justify-center">
                      <div className="text-xl font-bold font-mono text-primary">-22%</div>
                      <div className="text-[10px] uppercase text-muted-foreground mt-1">Clinician Burnout</div>
                    </div>
                 </div>
               </TabsContent>

               <TabsContent value="fhir" className="flex-1 mt-0 min-h-0">
                 <FhirViewer />
               </TabsContent>
             </Tabs>
          </div>
        </div>

        <div className="lg:col-span-4 max-h-[800px] flex flex-col">
          <AgentFeed events={events} />
        </div>
      </main>

      <footer className="pt-4 border-t border-primary/20 text-center font-mono text-xs text-muted-foreground flex justify-between">
         <span>SYSTEM STATUS: {active ? 'MONITORING' : 'STANDBY'}</span>
         <span className="text-orange-500 font-bold uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">AI recommendation only. Doctor approval required.</span>
         <span>FHIR STREAMS: ENCRYPTED</span>
      </footer>
    </div>
  );
}
