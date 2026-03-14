/* eslint-disable no-console */
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

function nowMinus(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function run() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "bl4ckdot";

  if (!uri) {
    throw new Error("Missing MONGODB_URI in environment");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const users = db.collection("users");
  const apprenticeship = db.collection("apprenticeshipapplications");
  const contacts = db.collection("contactmessages");
  const innovations = db.collection("innovationsubmissions");
  const projects = db.collection("projects");
  const research = db.collection("research");
  const timeline = db.collection("timelineevents");

  const hashedAdmin = await bcrypt.hash(process.env.ADMIN_PASSWORD || "ChangeMe123!", 10);
  const hashedStudent = await bcrypt.hash("Student123!", 10);

  const userDocs = [
    {
      name: "BL4CKDOT Admin",
      email: process.env.ADMIN_EMAIL || "admin@bl4ckdot.dev",
      password: hashedAdmin,
      role: "admin",
      skills: ["management", "security"],
      profileInfo: { bio: "Platform administrator" },
      created_at: nowMinus(10),
      updated_at: new Date(),
    },
    {
      name: "Aadhil Student",
      email: "aadhil.student@bl4ckdot.dev",
      password: hashedStudent,
      role: "student",
      skills: ["Python", "IoT", "Node.js"],
      profileInfo: { bio: "Student innovator", portfolio: "https://github.com/aadhil" },
      created_at: nowMinus(8),
      updated_at: new Date(),
    },
    {
      name: "Nexa Labs",
      email: "contact@nexalabs.com",
      password: hashedStudent,
      role: "company",
      skills: ["AI integration", "R&D"],
      profileInfo: { bio: "Innovation partner organization" },
      created_at: nowMinus(7),
      updated_at: new Date(),
    },
  ];

  for (const doc of userDocs) {
    await users.updateOne({ email: doc.email }, { $set: doc }, { upsert: true });
  }

  const student = await users.findOne({ email: "aadhil.student@bl4ckdot.dev" });

  const apprenticeshipDocs = [
    {
      user_id: student ? student._id : null,
      name: "Aadhil Student",
      email: "aadhil.student@bl4ckdot.dev",
      track: "AI",
      resume_link: "https://drive.google.com/file/d/sample-resume-1",
      motivation: "I want to build micro-LLM systems for edge devices.",
      status: "pending",
      submitted_at: nowMinus(6),
      updated_at: new Date(),
    },
    {
      user_id: student ? student._id : null,
      name: "Aadhil Student",
      email: "aadhil.student@bl4ckdot.dev",
      track: "IoT",
      resume_link: "https://drive.google.com/file/d/sample-resume-2",
      motivation: "I want to secure IoT firmware end-to-end.",
      status: "approved",
      submitted_at: nowMinus(5),
      updated_at: new Date(),
    },
  ];

  for (const doc of apprenticeshipDocs) {
    await apprenticeship.updateOne(
      { email: doc.email, track: doc.track, motivation: doc.motivation },
      { $set: doc },
      { upsert: true },
    );
  }

  const contactDocs = [
    {
      name: "Nexa Labs",
      email: "contact@nexalabs.com",
      subject: "IoT Security Collaboration",
      message: "We want to collaborate on secure edge gateway prototypes.",
      submitted_at: nowMinus(4),
      updated_at: new Date(),
    },
    {
      name: "Future Foundry",
      email: "hello@futurefoundry.io",
      subject: "AI Idea Incubation",
      message: "Need support turning our AI prototype into a production system.",
      submitted_at: nowMinus(3),
      updated_at: new Date(),
    },
  ];

  for (const doc of contactDocs) {
    await contacts.updateOne(
      { email: doc.email, subject: doc.subject },
      { $set: doc },
      { upsert: true },
    );
  }

  const innovationDocs = [
    {
      submission_type: "student",
      title: "Campus Threat Radar",
      description: "Anomaly detection system for campus networks using lightweight ML.",
      category: "security",
      submitted_by: { name: "Aadhil Student", email: "aadhil.student@bl4ckdot.dev" },
      target_users: "students",
      technology_stack: ["Python", "FastAPI", "Wireshark", "ML"],
      status: "idea",
      details: { skills: "Python, networking", portfolio_link: "https://github.com/aadhil" },
      created_at: nowMinus(4),
      updated_at: new Date(),
    },
    {
      submission_type: "innovator",
      title: "Rural IoT Water Monitor",
      description: "IoT sensor mesh for water quality alerts and predictive maintenance.",
      category: "IoT",
      submitted_by: { name: "Meera Rao", email: "meera@agrinova.org", organization: "AgriNova" },
      target_users: "innovators",
      technology_stack: ["ESP32", "MQTT", "Node.js"],
      status: "review",
      details: { collaboration_request: "Need embedded + cloud mentorship" },
      created_at: nowMinus(3),
      updated_at: new Date(),
    },
    {
      submission_type: "company",
      title: "Enterprise SOC Co-Pilot",
      description: "Micro-LLM based assistant for triaging SOC alerts at scale.",
      category: "AI",
      submitted_by: { name: "Rahul Menon", email: "rahul@cybermatrix.com", organization: "CyberMatrix", contact_person: "Rahul Menon" },
      target_users: "companies",
      technology_stack: ["LLM", "SIEM", "Python"],
      status: "prototype",
      details: { industry: "Cybersecurity", project_budget_range: "$50k-$100k" },
      created_at: nowMinus(2),
      updated_at: new Date(),
    },
  ];

  for (const doc of innovationDocs) {
    await innovations.updateOne(
      { title: doc.title, "submitted_by.email": doc.submitted_by.email },
      { $set: doc },
      { upsert: true },
    );
  }

  const projectDocs = [
    {
      name: "Secure Certificate Verification System",
      description: "Blockchain-backed certificate validation with tamper-proof audit trails.",
      tech_stack: ["Next.js", "Node.js", "MongoDB", "JWT"],
      team_members: ["Dwarak", "Pranav", "Goutham"],
      status: "released",
      repository_link: "https://github.com/bl4ckdot/secure-cert-verify",
      created_at: nowMinus(9),
      updated_at: new Date(),
    },
    {
      name: "IoT Device Authentication Network",
      description: "Mutual TLS and hardware attestation for IoT fleets.",
      tech_stack: ["C++", "MQTT", "PKI", "Raspberry Pi"],
      team_members: ["Anto", "Kalaiarasan", "Deepak"],
      status: "development",
      repository_link: "https://github.com/bl4ckdot/iot-auth-network",
      created_at: nowMinus(7),
      updated_at: new Date(),
    },
    {
      name: "Micro-LLM Assistant",
      description: "Quantized LLM assistant optimized for edge deployment.",
      tech_stack: ["Python", "GGUF", "FastAPI"],
      team_members: ["Sarvesh", "Goutham"],
      status: "research",
      repository_link: "https://github.com/bl4ckdot/micro-llm-assistant",
      created_at: nowMinus(5),
      updated_at: new Date(),
    },
  ];

  for (const doc of projectDocs) {
    await projects.updateOne({ name: doc.name }, { $set: doc }, { upsert: true });
  }

  const researchDocs = [
    {
      title: "Deploying Quantized LLMs on ARM Edge Devices",
      abstract: "Practical benchmarks and optimization strategies for low-latency edge inference.",
      domain: "AI",
      publication_link: "https://research.bl4ckdot.dev/llm-arm-edge",
      created_at: nowMinus(6),
      updated_at: new Date(),
    },
    {
      title: "Secure Firmware Architecture for ESP32 IoT Devices",
      abstract: "A hardened approach to secure boot, attestation, and OTA chain trust.",
      domain: "IoT",
      publication_link: "https://research.bl4ckdot.dev/esp32-firmware-security",
      created_at: nowMinus(5),
      updated_at: new Date(),
    },
    {
      title: "Autonomous Vulnerability Detection with Agentic LLMs",
      abstract: "Using autonomous agents to identify OWASP patterns in CI pipelines.",
      domain: "Cybersecurity",
      publication_link: "https://research.bl4ckdot.dev/agentic-vuln-detection",
      created_at: nowMinus(4),
      updated_at: new Date(),
    },
  ];

  for (const doc of researchDocs) {
    await research.updateOne({ title: doc.title }, { $set: doc }, { upsert: true });
  }

  const timelineDocs = [
    { year: 2026, title: "BL4CKDOT founded", description: "BL4CKDOT founded as a student innovation initiative." },
    { year: 2027, title: "Innovation lab launch", description: "Launch of innovation lab platform." },
    { year: 2028, title: "First AI and IoT prototype released", description: "First AI and IoT prototype released." },
    { year: 2029, title: "Research partnerships", description: "Partnerships with research organizations." },
    { year: 2030, title: "Incubation platform expansion", description: "Expansion into a full technology incubation platform." },
  ];

  for (const doc of timelineDocs) {
    await timeline.updateOne({ year: doc.year, title: doc.title }, { $set: { ...doc, updated_at: new Date(), created_at: nowMinus(2) } }, { upsert: true });
  }

  console.log("SEED_COMPLETE", JSON.stringify({
    users: await users.countDocuments(),
    apprenticeshipapplications: await apprenticeship.countDocuments(),
    contactmessages: await contacts.countDocuments(),
    innovationsubmissions: await innovations.countDocuments(),
    projects: await projects.countDocuments(),
    research: await research.countDocuments(),
    timelineevents: await timeline.countDocuments(),
  }));

  await client.close();
}

run().catch((err) => {
  console.error("SEED_ERROR", err.message || err);
  process.exit(1);
});
