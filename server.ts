import express from "express";
import { createServer as createViteServer } from "vite";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
const PORT = 3000;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Telemetry & Agent Simulator
let clients: Set<WebSocket> = new Set();
let simulationActive = false;
let simulationInterval: any = null;

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  clients.add(ws);

  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());
    
    if (data.type === 'START_SIMULATION') {
      if (!simulationActive) {
        startSimulation();
      }
    } else if (data.type === 'STOP_SIMULATION') {
      stopSimulation();
    } else if (data.type === 'ASK_VOICE_COPILOT') {
      handleVoiceCopilotRequest(ws, data.payload.query);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

function broadcast(type: string, payload: any) {
  const message = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });
  clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) {
      c.send(message);
    }
  });
}

function startSimulation() {
  simulationActive = true;
  broadcast('SIMULATION_STARTED', {});
  
  let hr = 85;
  let spO2 = 98;
  let map = 85; // Mean Arterial Pressure
  let rr = 16;
  
  simulationInterval = setInterval(() => {
    // Random walk for vitals
    hr += (Math.random() - 0.5) * 5;
    spO2 += (Math.random() - 0.5) * 1;
    map += (Math.random() - 0.5) * 3;
    rr += (Math.random() - 0.5) * 2;
    
    // Clamp values
    hr = Math.max(50, Math.min(180, hr));
    spO2 = Math.max(80, Math.min(100, spO2));
    map = Math.max(40, Math.min(120, map));
    rr = Math.max(8, Math.min(40, rr));
    
    // Deterioration scenario after random time
    if (Math.random() < 0.05) {
       map -= 10;
       hr += 15;
    }
    
    broadcast('TELEMETRY_UPDATE', {
      heartRate: Math.round(hr),
      spO2: Math.max(0, Math.min(100, Number(spO2.toFixed(1)))),
      map: Math.round(map),
      respiratoryRate: Math.round(rr),
      ecg: Math.random() // trigger a new frame
    });
    
    checkAgentTriggers({ hr, spO2, map, rr });
  }, 1000);
}

function stopSimulation() {
  simulationActive = false;
  if(simulationInterval) clearInterval(simulationInterval);
  broadcast('SIMULATION_STOPPED', {});
}

async function checkAgentTriggers(vitals: any) {
  if (vitals.map < 60 && Math.random() < 0.3) {
    // Trigger ICU Monitor Agent
    broadcast('AGENT_REASONING', {
      agent: 'ICU_MONITOR',
      message: 'Detected sustained hypotension (MAP < 60). Escalating to Supervisor.',
      confidence: 0.95,
      type: 'ALERT'
    });
    
    // Trigger Supervisor
    setTimeout(() => runSupervisorAgent(vitals), 1000);
  }
}

async function runSupervisorAgent(vitals: any) {
  broadcast('AGENT_REASONING', {
    agent: 'SUPERVISOR',
    message: 'Analyzing multi-system telemetry and historical FHIR data...',
    confidence: 0.88,
    type: 'INFO'
  });
  
  try {
     const res = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: `You are the Supervisor Agent of a healthcare AI OS. The patient's MAP is exactly ${Math.round(vitals.map)} and HR is ${Math.round(vitals.hr)}. Give a 1 sentence clinical reasoning about sepsis risk. Include confidence % and recommendation. Make it sound highly advanced and analytical.`,
     });
     
     broadcast('AGENT_REASONING', {
        agent: 'SUPERVISOR',
        message: res.text,
        confidence: 0.92,
        type: 'CRITICAL'
     });
  } catch(e) {
     console.log(e);
  }
}

async function handleVoiceCopilotRequest(ws: WebSocket, query: string) {
   broadcast('AGENT_REASONING', { agent: 'VOICE_COPILOT', message: `Analyzing request: "${query}"`, type: 'INFO', confidence: 0.99});
   try{
       const res = await ai.models.generateContent({
           model: "gemini-3-flash-preview",
           contents: `You are a voice AI copilot in an advanced hospital command center. The doctor asked: "${query}". Respond concisely with high-level clinical intelligence.`,
       });
       ws.send(JSON.stringify({ type: 'VOICE_COPILOT_RESPONSE', payload: { text: res.text } }));
   } catch (e) {
       console.log(e);
   }
}


async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
