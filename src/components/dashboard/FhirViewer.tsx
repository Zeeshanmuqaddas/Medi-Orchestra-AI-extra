import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Thermometer, Pill, FileText, User, Microscope, Stethoscope, Clock } from "lucide-react";

const fhirData = {
  patient: {
    resourceType: "Patient",
    id: "PT-99842",
    active: true,
    name: [{ use: "official", family: "Doe", given: ["John"] }],
    gender: "male",
    birthDate: "1960-04-12",
    address: [{ line: ["123 Main St"], city: "Metropolis", state: "NY", postalCode: "10001" }],
    telecom: [
      { system: "phone", value: "555-0199", use: "mobile" },
      { system: "email", value: "john.doe@example.com", use: "home" }
    ]
  },
  observations: [
    { id: "obs-1", code: "Heart rate", value: "88 beats/min", status: "final", date: "2023-10-25T10:00:00Z" },
    { id: "obs-2", code: "Blood pressure", value: "115/75 mmHg", status: "final", date: "2023-10-25T10:00:00Z" },
    { id: "obs-3", code: "Lactate", value: "2.4 mmol/L", status: "preliminary", date: "2023-10-25T14:30:00Z" },
    { id: "obs-4", code: "White Blood Cells", value: "14.2 10^3/uL", status: "final", date: "2023-10-25T14:30:00Z" }
  ],
  conditions: [
    { id: "cond-1", clinicalStatus: "active", verificationStatus: "confirmed", category: "problem-list-item", code: "Sepsis", recordedDate: "2023-10-25" },
    { id: "cond-2", clinicalStatus: "active", verificationStatus: "confirmed", category: "problem-list-item", code: "Type 2 Diabetes Mellitus", recordedDate: "2015-06-10" }
  ],
  medications: [
    { id: "med-1", status: "active", intent: "order", medication: "Norepinephrine 4mg/250mL", dosage: "0.05 mcg/kg/min", requester: "Dr. Smith" },
    { id: "med-2", status: "active", intent: "order", medication: "Piperacillin/Tazobactam 4.5g", dosage: "IV q6h", requester: "Dr. Smith" },
    { id: "med-3", status: "active", intent: "order", medication: "Metformin 500mg", dosage: "PO BID", requester: "Dr. Adams" }
  ],
  diagnosticReports: [
    { id: "diag-1", status: "final", code: "Chest X-Ray", effectiveDateTime: "2023-10-25T11:00:00Z", conclusion: "Diffuse bilateral infiltrates consistent with ARDS or severe pneumonia." },
    { id: "diag-2", status: "preliminary", code: "CT Head", effectiveDateTime: "2023-10-25T15:30:00Z", conclusion: "No acute intracranial hemorrhage or mass effect." }
  ],
  procedures: [
    { id: "proc-1", status: "completed", code: "Central Venous Catheter Insertion", performedDateTime: "2023-10-25T09:15:00Z" },
    { id: "proc-2", status: "completed", code: "Endotracheal Intubation", performedDateTime: "2023-10-25T12:00:00Z" }
  ],
  history: [
    { id: "hist-1", type: "Admission", title: "Emergency Room Admission", date: "2023-10-25", description: "Admitted to ER with acute respiratory distress and suspected sepsis." },
    { id: "hist-2", type: "Condition", title: "Type 2 Diabetes Mellitus Diagnosis", date: "2015-06-10", description: "Diagnosed with T2DM. Initially managed with Metformin." },
    { id: "hist-3", type: "ICU", title: "ICU Transfer", date: "2023-10-25", description: "Transferred to ICU due to worsening hypotension and increasing lactate levels." },
    { id: "hist-4", type: "Admission", title: "Previous Admission", date: "2020-11-15", description: "Admitted for community-acquired pneumonia. Discharged after 4 days of antibiotic therapy." }
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
};

export function FhirViewer() {
  return (
    <div className="h-full flex flex-col border border-primary/20 rounded-lg bg-black/20 overflow-hidden">
      <div className="bg-primary/10 p-3 border-b border-primary/20 flex items-center justify-between">
        <h3 className="font-mono text-sm text-primary uppercase flex items-center gap-2">
          <FileText className="w-4 h-4" />
          FHIR Structured Data
        </h3>
        <Badge variant="outline" className="border-primary/50 text-xs text-primary font-mono bg-primary/10">v4.0.1</Badge>
      </div>

      <Tabs defaultValue="patient" className="flex-1 flex flex-col">
        <TabsList className="bg-black/40 border-b border-primary/20 p-0 rounded-none h-auto w-full justify-start overflow-x-auto">
          <TabsTrigger value="patient" className="font-mono text-xs uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">
            <User className="w-3 h-3 mr-2" /> Patient
          </TabsTrigger>
          <TabsTrigger value="demographics" className="font-mono text-xs uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">
            <User className="w-3 h-3 mr-2" /> Demographics
          </TabsTrigger>
          <TabsTrigger value="obs" className="font-mono text-xs uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">
            <Activity className="w-3 h-3 mr-2" /> Observations
          </TabsTrigger>
          <TabsTrigger value="cond" className="font-mono text-xs uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">
            <Thermometer className="w-3 h-3 mr-2" /> Conditions
          </TabsTrigger>
          <TabsTrigger value="med" className="font-mono text-xs uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">
            <Pill className="w-3 h-3 mr-2" /> Medications
          </TabsTrigger>
          <TabsTrigger value="diag" className="font-mono text-xs uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">
            <Microscope className="w-3 h-3 mr-2" /> Diagnostics
          </TabsTrigger>
          <TabsTrigger value="proc" className="font-mono text-xs uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">
            <Stethoscope className="w-3 h-3 mr-2" /> Procedures
          </TabsTrigger>
          <TabsTrigger value="history" className="font-mono text-xs uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3">
            <Clock className="w-3 h-3 mr-2" /> History
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
          <TabsContent value="patient" className="m-0 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div><span className="text-muted-foreground mr-2">ID:</span> {fhirData.patient.id}</div>
                <div><span className="text-muted-foreground mr-2">Status:</span> <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-[10px]">Active</Badge></div>
                <div><span className="text-muted-foreground mr-2">Name:</span> {fhirData.patient.name[0].given[0]} {fhirData.patient.name[0].family}</div>
                <div><span className="text-muted-foreground mr-2">DOB:</span> {fhirData.patient.birthDate}</div>
                <div><span className="text-muted-foreground mr-2">Gender:</span> {fhirData.patient.gender}</div>
             </div>
             <div className="mt-4 bg-black/60 p-4 rounded border border-primary/20 overflow-x-auto text-xs text-primary/70 font-mono shadow-inner">
                <pre>{JSON.stringify(fhirData.patient, null, 2)}</pre>
             </div>
          </TabsContent>

          <TabsContent value="demographics" className="m-0 space-y-6">
             <div className="space-y-4">
                <h4 className="text-primary uppercase tracking-widest text-xs border-b border-primary/20 pb-2">Basic Details</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div><span className="text-muted-foreground mr-2">Name:</span> {fhirData.patient.name[0].given[0]} {fhirData.patient.name[0].family}</div>
                   <div><span className="text-muted-foreground mr-2">Gender:</span> <span className="capitalize">{fhirData.patient.gender}</span></div>
                   <div><span className="text-muted-foreground mr-2">Date of Birth:</span> {fhirData.patient.birthDate}</div>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-primary uppercase tracking-widest text-xs border-b border-primary/20 pb-2">Contact Information</h4>
                <div className="grid grid-cols-1 gap-4">
                   <div>
                     <span className="text-muted-foreground mr-2">Address:</span>
                     {fhirData.patient.address[0].line.join(', ')}, {fhirData.patient.address[0].city}, {fhirData.patient.address[0].state} {fhirData.patient.address[0].postalCode}
                   </div>
                   <div className="flex flex-col gap-2">
                     {fhirData.patient.telecom.map((t, idx) => (
                       <div key={idx}>
                         <span className="text-muted-foreground mr-2 capitalize">{t.system} ({t.use}):</span> {t.value}
                       </div>
                     ))}
                   </div>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="obs" className="m-0">
             <Table>
                <TableHeader>
                   <TableRow className="border-primary/20 hover:bg-transparent">
                      <TableHead className="text-primary/70 uppercase text-xs">Code</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Value</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Status</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {fhirData.observations.map(obs => (
                      <TableRow key={obs.id} className="border-primary/10 hover:bg-primary/5">
                         <TableCell>{obs.code}</TableCell>
                         <TableCell className="text-primary font-bold">{obs.value}</TableCell>
                         <TableCell>
                            <Badge variant="outline" className={obs.status === 'final' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-orange-500/30 text-orange-500 bg-orange-500/10'}>
                               {obs.status}
                            </Badge>
                         </TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          </TabsContent>

          <TabsContent value="cond" className="m-0">
             <Table>
                <TableHeader>
                   <TableRow className="border-primary/20 hover:bg-transparent">
                      <TableHead className="text-primary/70 uppercase text-xs">Condition</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Status</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Date</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {fhirData.conditions.map(cond => (
                      <TableRow key={cond.id} className="border-primary/10 hover:bg-primary/5">
                         <TableCell className="font-bold text-red-400">{cond.code}</TableCell>
                         <TableCell>
                            <Badge variant="outline" className="border-red-500/30 text-red-500 bg-red-500/10">
                               {cond.clinicalStatus}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-muted-foreground">{cond.recordedDate}</TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          </TabsContent>

          <TabsContent value="med" className="m-0">
             <Table>
                <TableHeader>
                   <TableRow className="border-primary/20 hover:bg-transparent">
                      <TableHead className="text-primary/70 uppercase text-xs">Medication</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Dosage</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Status</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {fhirData.medications.map(med => (
                      <TableRow key={med.id} className="border-primary/10 hover:bg-primary/5">
                         <TableCell className="text-cyan-400">{med.medication}</TableCell>
                         <TableCell>{med.dosage}</TableCell>
                         <TableCell>
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-500 bg-cyan-500/10">
                               {med.status}
                            </Badge>
                         </TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          </TabsContent>

          <TabsContent value="diag" className="m-0">
             <Table>
                <TableHeader>
                   <TableRow className="border-primary/20 hover:bg-transparent">
                      <TableHead className="text-primary/70 uppercase text-xs">Test</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs w-[50%]">Conclusion</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Status</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {fhirData.diagnosticReports.map(diag => (
                      <TableRow key={diag.id} className="border-primary/10 hover:bg-primary/5">
                         <TableCell className="font-bold text-primary">{diag.code}</TableCell>
                         <TableCell className="text-muted-foreground">{diag.conclusion}</TableCell>
                         <TableCell>
                            <Badge variant="outline" className={diag.status === 'final' ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'}>
                               {diag.status}
                            </Badge>
                         </TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          </TabsContent>

          <TabsContent value="proc" className="m-0">
             <Table>
                <TableHeader>
                   <TableRow className="border-primary/20 hover:bg-transparent">
                      <TableHead className="text-primary/70 uppercase text-xs">Procedure</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Date Performed</TableHead>
                      <TableHead className="text-primary/70 uppercase text-xs">Status</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {fhirData.procedures.map(proc => (
                      <TableRow key={proc.id} className="border-primary/10 hover:bg-primary/5">
                         <TableCell className="font-bold text-purple-400">{proc.code}</TableCell>
                         <TableCell className="text-muted-foreground">{proc.performedDateTime}</TableCell>
                         <TableCell>
                            <Badge variant="outline" className="border-purple-500/30 text-purple-500 bg-purple-500/10">
                               {proc.status}
                            </Badge>
                         </TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          </TabsContent>

          <TabsContent value="history" className="m-0 space-y-4">
             <div className="border-l-2 border-primary/20 ml-2 pl-4 py-2 space-y-6">
                {fhirData.history.map(item => (
                   <div key={item.id} className="relative">
                      <div className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 border-background flex items-center justify-center top-1 shadow-[0_0_8px_rgba(20,200,255,0.4)] ${
                         item.type === 'ICU' ? 'bg-destructive' : 
                         item.type === 'Admission' ? 'bg-orange-500' : 'bg-primary'
                      }`} />
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-mono text-xs text-primary/70">{item.date}</span>
                         <Badge variant="outline" className={`text-[10px] py-0 h-4 ${
                            item.type === 'ICU' ? 'border-destructive/50 text-destructive bg-destructive/10' : 
                            item.type === 'Admission' ? 'border-orange-500/50 text-orange-500 bg-orange-500/10' : 'border-primary/50 text-primary bg-primary/10'
                         }`}>
                           {item.type}
                         </Badge>
                      </div>
                      <h4 className="font-mono text-sm font-bold text-foreground mb-1">{item.title}</h4>
                      <p className="text-sm font-mono text-muted-foreground">{item.description}</p>
                   </div>
                ))}
             </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
