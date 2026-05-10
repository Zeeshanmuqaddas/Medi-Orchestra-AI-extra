import React from "react";
import { Badge } from "@/components/ui/badge";

export function TelemetryPanel({ vitals }: { vitals: any }) {
  const getStatusColor = (val: number, min: number, max: number) => {
    if (val < min || val > max) return "text-destructive shadow-destructive/50";
    return "text-primary shadow-primary/50";
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="bg-black/40 border border-primary/30 rounded-xl p-4 flex flex-col justify-between backdrop-blur-md">
        <div className="flex justify-between items-center text-muted-foreground text-sm uppercase tracking-wider font-mono">
          <span>Heart Rate</span>
          <Badge variant="outline" className="border-primary/50 text-primary">mg/dL</Badge>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-5xl font-bold font-mono ${getStatusColor(vitals.heartRate, 60, 100)}`}>
            {vitals.heartRate || "--"}
          </span>
          <span className="text-xl text-muted-foreground mb-1">bpm</span>
        </div>
      </div>

      <div className="bg-black/40 border border-primary/30 rounded-xl p-4 flex flex-col justify-between backdrop-blur-md">
        <div className="flex justify-between items-center text-muted-foreground text-sm uppercase tracking-wider font-mono">
          <span>SpO2</span>
          <Badge variant="outline" className="border-primary/50 text-primary">%</Badge>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-5xl font-bold font-mono ${getStatusColor(vitals.spO2, 94, 100)}`}>
            {vitals.spO2 || "--"}
          </span>
          <span className="text-xl text-muted-foreground mb-1">%</span>
        </div>
      </div>

      <div className="bg-black/40 border border-primary/30 rounded-xl p-4 flex flex-col justify-between backdrop-blur-md">
        <div className="flex justify-between items-center text-muted-foreground text-sm uppercase tracking-wider font-mono">
          <span>MAP</span>
          <Badge variant="outline" className="border-primary/50 text-primary">mmHg</Badge>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-5xl font-bold font-mono ${getStatusColor(vitals.map, 65, 110)}`}>
            {vitals.map || "--"}
          </span>
          <span className="text-xl text-muted-foreground mb-1">mmHg</span>
        </div>
      </div>

      <div className="bg-black/40 border border-primary/30 rounded-xl p-4 flex flex-col justify-between backdrop-blur-md">
        <div className="flex justify-between items-center text-muted-foreground text-sm uppercase tracking-wider font-mono">
          <span>Resp Rate</span>
          <Badge variant="outline" className="border-primary/50 text-primary">/min</Badge>
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-5xl font-bold font-mono ${getStatusColor(vitals.respiratoryRate, 12, 20)}`}>
            {vitals.respiratoryRate || "--"}
          </span>
          <span className="text-xl text-muted-foreground mb-1">rpm</span>
        </div>
      </div>
    </div>
  );
}
