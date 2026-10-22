import { MagneticLink } from "@/components/site-ui";
import { ProjectCard } from "@/components/project-card";
import { ContactForm } from "@/components/contact-form";
import { LiquidEmblem } from "@/components/liquid-effects";

const resumeUrl =
  (process.env.NEXT_PUBLIC_BASE_PATH || "") +
  "/assets/docs/Amal_Joy_Resume.pdf";

const skills = [
  {
    index: "01",
    label: "CONTROL LOGIC",
    title: "Make the sequence dependable.",
    copy: "PLC logic, step sequences, permissives, safety interlocks, and redundant control for complex processes.",
    tags: ["PLC programming", "Interlocks", "Redundancy"],
    icon: "logic",
  },
  {
    index: "02",
    label: "MARINE SYSTEMS",
    title: "Keep every system in view.",
    copy: "Integrated automation, power management, machinery monitoring, and navigation safety for vessels.",
    tags: ["IAS", "PMS", "Navigation safety"],
    icon: "marine",
  },
  {
    index: "03",
    label: "SCADA & HMI",
    title: "Make operation clear.",
    copy: "Operator screens, alarm handling, event history, trends, and real-time process visibility.",
    tags: ["WinCC", "AVEVA", "Ignition"],
    icon: "scada",
  },
  {
    index: "04",
    label: "FIELD DELIVERY",
    title: "Prove it where it runs.",
    copy: "Instrumentation, drives, system integration, commissioning, troubleshooting, and operator support.",
    tags: ["Commissioning", "Instrumentation", "Testing"],
    icon: "field",
  },
];

const experience = [
  {
    year: "SEP 2026 — PRESENT",
    company: "Master Systems LLC",
    role: "Automation Engineer",
    place: "Marine systems",
    copy: "Delivering integrated automation, power management, and navigation safety systems for commercial vessels and offshore assets.",
    tags: ["IAS", "PMS", "Navigation safety"],
    current: true,
  },
  {
    year: "NOV 2025 — AUG 2026",
    company: "Proficient Automation and Controls Ltd.",
    role: "Project Engineer · ISRO SDSC SHAR",
    place: "Aerospace facilities",
    copy: "Developed PLC sequence logic for solid-propellant casting and bowl-cleaning systems. Integrated motor management, hydraulic control, field HMI, WinCC SCADA, and safety interlocks.",
    tags: ["S7-1500 / S7-405H", "WinCC", "SIMOCODE pro"],
  },
  {
    year: "OCT 2024 — OCT 2025",
    company: "SMEC Automation Pvt Ltd.",
    role: "Automation Engineer",
    place: "Marine & industrial",
    copy: "Designed and programmed marine and industrial PLC systems, developed SCADA applications, integrated communication protocols, and supported field instrumentation, installation, and troubleshooting.",
    tags: ["PLC programming", "SCADA", "Instrumentation"],
  },
];

const projects = [
  {
    id: "01",
    type: "MARINE AUTOMATION",
    name: "Integrated Vessel Systems",
    domain: "MARINE · IAS / PMS",
    copy: "Automation, power management, machinery monitoring, and navigation safety brought into one clear operating picture.",
    tags: ["IAS", "PMS", "Safety"],
    variant: "marine" as const,
    data: "MACHINERY / POWER / BRIDGE",
  },
  {
    id: "02",
    type: "SEQUENCE CONTROL",
    name: "Bowl Cleaning Facility",
    domain: "AEROSPACE · ISRO SDSC SHAR",
    copy: "Automated cleaning sequence for propellant casting preparation, integrating S7-1500 logic, SIMOCODE motor management, Parker hydraulics, field HMI, and WinCC.",
    tags: ["S7-1500", "WinCC", "Hydraulics"],
    variant: "sequence" as const,
    data: "STEP SEQUENCE / 12 PHASES",
  },
  {
    id: "03",
    type: "HIGH AVAILABILITY",
    name: "Solid Propellant Casting",
    domain: "AEROSPACE · ISRO SDSC SHAR",
    copy: "Automatic process sequencing for GSLV and Gaganyaan launch-vehicle programs with redundant Siemens S7-405H control and SCADA monitoring.",
    tags: ["S7-405H", "Redundancy", "Interlocks"],
    variant: "redundant" as const,
    data: "S7-405H / REDUNDANT",
  },
  {
    id: "04",
    type: "ALARM MANAGEMENT",
    name: "Hybrid Propulsion Monitoring",
    domain: "PROPULSION",
    copy: "Configured alarms, acknowledgement, event handling, and historical diagnostics for redundant Siemens PCS 7 and S7-405H propulsion control.",
    tags: ["PCS 7", "S7-405H", "Diagnostics"],
    variant: "events" as const,
    data: "EVENTS / ACK / HISTORY",
  },
  {
    id: "05",
    type: "PROCESS AUTOMATION",
    name: "Boiler Control System",
    domain: "PROCESS CONTROL",
    copy: "Schneider Modicon M340 control and SCADA monitoring for start-up, shutdown, pressure and temperature monitoring, and protective interlocks.",
    tags: ["M340", "SCADA", "Safety logic"],
    variant: "boiler" as const,
    data: "PRESSURE / TEMPERATURE",
  },
  {
    id: "06",
    type: "SCADA + ALARMS",
    name: "Inert Gas Generator",
    domain: "GAS PROCESSING",
    copy: "WinCC monitoring with gas-flow and pressure visibility, safety interlocks, alarm handling, trends, and reporting.",
    tags: ["WinCC", "Alarms", "Trend logging"],
    variant: "gas" as const,
    data: "FLOW / PRESSURE / O₂",
  },
  {
    id: "07",
    type: "TEMPERATURE CONTROL",
    name: "Calorifier Control",
    domain: "MARINE · THERMAL",
    copy: "Automated hot-water control using Schneider M221 and AVEVA InTouch for operator control, alarms, and real-time process monitoring.",
    tags: ["M221", "AVEVA InTouch", "SCADA"],
    variant: "thermal" as const,
    data: "THERMAL LOOP / AUTO",
  },
];

const platformStack = [
  {
    group: "01 / CONTROL",
    title: "Programmable logic",
    items: [
      "Siemens S7-1200 / 1500 / 300 / 400 / 405H / 200",
      "Schneider M221 / M340 / M580",
      "Allen-Bradley CompactLogix L33R",
      "MicroLogix 1400 / 1500",
      "Honeywell C300 DCS",
    ],
  },
  {
    group: "02 / VISUALIZATION",
    title: "Operator systems",
    items: [
      "Siemens WinCC / Unified / OA",
      "AVEVA InTouch / Edge",
      "Plant SCADA / FactoryTalk View",
      "Ignition / Vijeo Designer",
    ],
  },
  {
    group: "03 / DEVELOPMENT",
    title: "Logic & data",
    items: [
      "STL / SCL / LAD / FBD / SFC",
      "TIA Portal",
      "Python / VBScript",
      "C / Java / SQL Server",
    ],
  },
  {
    group: "04 / INTEGRATION",
    title: "Industrial networks",
    items: [
      "PROFINET / PROFIBUS",
      "Ethernet/IP / Modbus RTU & TCP",
      "OPC UA / MQTT / HART",
      "IEC 61850 / SNMP",
    ],
  },
];

const certifications = [
  "Post Graduate Diploma in Industrial Automation",
  "Advanced Diploma in Distributed Control System · Honeywell C300",
  "Ignition 8.1 Credential · Inductive Automation",
  "Google IT Automation with Python · Coursera",
];

function SplitWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className={"split-visual " + className} aria-hidden="true">
        {text.split(" ").map((word, index) => (
          <span className="split-word" key={word + "-" + index}>
            {word}&nbsp;
          </span>
        ))}
      </span>
    </>
  );
}

function SectionLabel({ number, name }: { number: string; name: string }) {
  return (
    <div className="section-label" data-reveal>
      <span className="section-number">{number}</span>
      <span className="section-label-line" />
      <span>{name}</span>
    </div>
  );
}

function ProjectArt({
  variant,
  index,
  data,
}: {
  variant: (typeof projects)[number]["variant"];
  index: string;
  data: string;
}) {
  const pid = "art-" + index;

  return (
    <div className={"project-art project-art-" + variant} aria-hidden="true">
      <div className="art-coordinate art-coordinate-top">{data}</div>
      <div className="project-art-frame">
        <svg viewBox="0 0 620 330" role="presentation" focusable="false">
          <defs>
            <pattern
              id={pid + "-grid"}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M24 0H0V24"
                fill="none"
                stroke="rgba(155,255,227,.08)"
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id={pid + "-beam"} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#dff5ff" />
              <stop offset=".48" stopColor="#5abfff" />
              <stop offset="1" stopColor="#4474f4" />
            </linearGradient>
          </defs>
          <rect width="620" height="330" fill="#0a1b35" />
          <rect width="620" height="330" fill={"url(#" + pid + "-grid)"} />
          <path d="M0 282H620M0 44H620" stroke="rgba(220,255,245,.12)" />
          <circle
            cx="514"
            cy="82"
            r="38"
            fill="none"
            stroke="rgba(131,245,209,.18)"
          />
          <circle
            cx="514"
            cy="82"
            r="27"
            fill="none"
            stroke="rgba(131,245,209,.2)"
          />
          <path d="M493 82h42M514 61v42" stroke="rgba(131,245,209,.36)" />
          {variant === "marine" && (
            <g fill="none" stroke={"url(#" + pid + "-beam)"} strokeWidth="2">
              <path d="M64 208h100l32-42h118l30 42h96l34-70h64" />
              <path d="M64 236h112m218 0h138" opacity=".44" />
              <rect x="199" y="126" width="108" height="82" rx="7" />
              <rect x="215" y="140" width="24" height="16" rx="2" />
              <rect x="254" y="140" width="36" height="16" rx="2" />
              <path d="M211 179h82M220 193h62" opacity=".56" />
              <circle cx="168" cy="208" r="5" fill="#00e5ff" />
              <circle cx="474" cy="208" r="5" fill="#00e5ff" />
              <circle cx="540" cy="138" r="5" fill="#00e5ff" />
            </g>
          )}
          {variant === "sequence" && (
            <g fill="none" stroke={"url(#" + pid + "-beam)"} strokeWidth="2">
              <path d="M68 227h95V161h92v50h88V119h99v58h108" />
              <path
                d="M68 257h120m0 0v-22m100 22v-26m102 26v-22m115 22v-27"
                opacity=".36"
              />
              <circle cx="163" cy="161" r="7" fill="#00e5ff" />
              <circle cx="255" cy="211" r="7" fill="#00e5ff" />
              <circle cx="343" cy="119" r="7" fill="#00e5ff" />
              <circle cx="442" cy="177" r="7" fill="#00e5ff" />
              <path d="M163 112v29m92 46v16m88-111v20m99 31v26" opacity=".52" />
            </g>
          )}
          {variant === "redundant" && (
            <g fill="none" stroke={"url(#" + pid + "-beam)"} strokeWidth="2">
              <rect x="81" y="112" width="154" height="60" rx="4" />
              <rect x="81" y="204" width="154" height="60" rx="4" />
              <rect x="410" y="151" width="104" height="72" rx="5" />
              <path d="M235 142h93q30 0 30 28v17h52M235 234h93q30 0 30-28v-19h52" />
              <path
                d="M104 132h25m-25 16h78M104 224h25m-25 16h78"
                opacity=".55"
              />
              <circle cx="462" cy="187" r="19" />
              <path d="M452 187h20m-10-10v20" />
            </g>
          )}
          {variant === "events" && (
            <g fill="none" stroke={"url(#" + pid + "-beam)"} strokeWidth="2">
              <path d="M74 218h76l28-53 41 28 40-74 45 58 43-32 34 42 44-68 53 22 63-49" />
              <path d="M74 249h474" opacity=".35" />
              <circle cx="178" cy="165" r="6" fill="#00e5ff" />
              <circle cx="259" cy="119" r="6" fill="#00e5ff" />
              <circle cx="404" cy="187" r="6" fill="#00e5ff" />
              <circle cx="457" cy="119" r="6" fill="#00e5ff" />
              <path d="M105 94h96M105 108h51M418 256h72" opacity=".5" />
            </g>
          )}
          {variant === "boiler" && (
            <g fill="none" stroke={"url(#" + pid + "-beam)"} strokeWidth="2">
              <circle cx="286" cy="170" r="82" />
              <circle cx="286" cy="170" r="65" opacity=".32" />
              <path d="M286 170l45-49" strokeWidth="4" />
              <circle cx="286" cy="170" r="5" fill="#00e5ff" />
              <path d="M90 224h98V135h48m100 92h63v-80h67m-296 64h103" />
              <rect
                x="440"
                y="111"
                width="78"
                height="75"
                rx="5"
                opacity=".5"
              />
            </g>
          )}
          {variant === "gas" && (
            <g fill="none" stroke={"url(#" + pid + "-beam)"} strokeWidth="2">
              <path d="M75 225h106l35-81h78l35 53h78l38-63h105" />
              <path d="M75 255h480" opacity=".3" />
              <rect x="216" y="108" width="82" height="44" rx="4" />
              <path d="M233 125h48m-48 12h30" opacity=".5" />
              <circle cx="181" cy="225" r="7" fill="#00e5ff" />
              <circle cx="407" cy="197" r="7" fill="#00e5ff" />
              <path d="M475 114l18-18 18 18" opacity=".6" />
            </g>
          )}
          {variant === "thermal" && (
            <g fill="none" stroke={"url(#" + pid + "-beam)"} strokeWidth="2">
              <path d="M74 227h92q18 0 18-18V123q0-16 17-16h216q18 0 18 18v88q0 18 18 18h92" />
              <path d="M222 177c20-35 39 34 60 0s39 35 60 0 39 33 60 0" />
              <circle cx="184" cy="227" r="7" fill="#00e5ff" />
              <circle cx="436" cy="227" r="7" fill="#00e5ff" />
              <path d="M259 140v19m45-19v19m45-19v19" opacity=".4" />
            </g>
          )}
        </svg>
        <div className="project-art-wipe" />
      </div>
      <div className="art-coordinate art-coordinate-bottom">
        <span>FIG. {index}</span>
        <span>ILLUSTRATIVE SYSTEM STUDY</span>
      </div>
    </div>
  );
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const projectPhotos: Record<string, { file: string; alt: string }> = {
  "01": {
    file: "ship-bridge-real.webp",
    alt: "Navigation bridge of a commercial vessel",
  },
  "02": {
    file: "control-cabinet-real.webp",
    alt: "Industrial control cabinet with PLC equipment and wiring",
  },
  "04": {
    file: "engine-control-real.webp",
    alt: "Vessel engine control room with monitoring equipment",
  },
};

export function Portfolio() {
  return (
    <>
      <main id="main">
        <section
          className="hero-section page-gutter"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-topline hero-intro">
            <p className="mono-label">
              AMAL JOY — AUTOMATION & ROBOTICS ENGINEER
            </p>
            <p className="mono-label hero-location">
              <span className="status-pulse" /> ERNAKULAM, INDIA
            </p>
          </div>
          <h1 id="hero-title">
            <span className="sr-only">
              Engineering what moves. Intelligent automation by Amal Joy.
            </span>
            <span className="hero-line" aria-hidden="true">
              <span className="split-word">ENGINEERING</span>
            </span>
            <span className="hero-line hero-line-impact" aria-hidden="true">
              <span className="split-word">
                WHAT MOVES<span className="accent-period">.</span>
              </span>
            </span>
          </h1>
          <div className="hero-bottom">
            <figure className="hero-film hero-intro">
              <div className="hero-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hero-image"
                  src={basePath + "/assets/images/hero-robotics-real.webp"}
                  width="1600"
                  height="1067"
                  alt="Industrial robotic arm in a blue-lit laboratory, representative engineering photography"
                  fetchPriority="high"
                  decoding="async"
                />
                <span className="image-cross cross-top" aria-hidden="true">
                  +
                </span>
                <span className="image-cross cross-bottom" aria-hidden="true">
                  +
                </span>
                <span className="film-label mono-label">
                  INTELLIGENT SYSTEMS. REAL-WORLD IMPACT.
                </span>
                <span className="film-orbit" aria-hidden="true">
                  ↗
                </span>
              </div>
              <figcaption className="mono-label">
                <span>01 / IN MOTION</span>
                <span>REPRESENTATIVE PHOTOGRAPHY</span>
              </figcaption>
            </figure>
            <div className="hero-description hero-intro glass-surface">
              <LiquidEmblem />
              <p>I build the logic behind what moves.</p>
              <p className="hero-summary">
                Intelligent automation for marine vessels, aerospace facilities,
                and industrial processes. Built with purpose. Proven in the
                field.
              </p>
              <a className="text-link" href="#projects">
                Explore selected work <span aria-hidden="true">↘</span>
              </a>
              <p className="hero-current">
                <span className="status-pulse" /> Currently at Master Systems
                LLC
              </p>
            </div>
          </div>
          <div className="hero-baseline hero-intro">
            <span>MARINE / AEROSPACE / INDUSTRIAL</span>
            <a href="#about">
              SCROLL TO DISCOVER <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section
          className="story-section about-section page-gutter"
          id="about"
          aria-labelledby="about-title"
        >
          <SectionLabel number="01" name="THE PERSON BEHIND THE PROCESS" />
          <div className="about-layout">
            <h2 className="statement" id="about-title">
              <SplitWords text="Complex systems. Clear thinking. Dependable outcomes." />
            </h2>
            <div className="about-copy" data-reveal>
              <p>
                I’m Amal, an automation and robotics engineer connecting
                equipment, process logic, and the people who operate them.
              </p>
              <p>
                From automated bowl-cleaning and solid-propellant casting at
                ISRO’s SDSC SHAR to integrated marine automation, my work brings
                clarity to systems where every sequence matters.
              </p>
              <MagneticLink
                className="text-link"
                href={resumeUrl}
                download="Amal_Joy_Resume.pdf"
              >
                Download resume <span aria-hidden="true">↓</span>
              </MagneticLink>
            </div>
          </div>
          <div className="proof-stats glass-surface" data-reveal>
            <div className="proof-stat">
              <span className="proof-stat-value">07</span>
              <span className="mono-label">SELECTED SYSTEMS</span>
            </div>
            <div className="proof-stat">
              <span className="proof-stat-value">03</span>
              <span className="mono-label">ENGINEERING SECTORS</span>
            </div>
            <div className="proof-stat">
              <span className="proof-stat-value">04</span>
              <span className="mono-label">CERTIFICATIONS</span>
            </div>
            <p className="stats-note">
              Design.
              <br />
              Integrate.
              <br />
              Commission.
            </p>
          </div>
        </section>

        <section
          className="story-section work-section"
          id="projects"
          aria-labelledby="projects-title"
        >
          <div className="page-gutter">
            <SectionLabel number="02" name="A SELECTION OF SYSTEMS" />
            <div className="section-heading" data-reveal>
              <h2 id="projects-title">
                <SplitWords text="CONTROL WITH PURPOSE." />
              </h2>
              <p>
                Real processes. Thoughtful engineering.
                <br />
                Explore the systems behind the work.
              </p>
            </div>
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  systemNote={project.data}
                >
                  <div className="project-media">
                    {projectPhotos[project.id] ? (
                      <figure className="project-photo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            basePath +
                            "/assets/images/" +
                            projectPhotos[project.id].file
                          }
                          alt={projectPhotos[project.id].alt}
                          width="1200"
                          height="800"
                          loading="lazy"
                          decoding="async"
                        />
                        <figcaption className="mono-label">
                          REPRESENTATIVE PHOTOGRAPHY
                        </figcaption>
                      </figure>
                    ) : (
                      <ProjectArt
                        variant={project.variant}
                        index={project.id}
                        data={project.data}
                      />
                    )}
                    <span className="project-number mono-label">
                      {project.id} / 07
                    </span>
                    <span className="project-media-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <div className="project-copy">
                    <p className="eyebrow">{project.domain}</p>
                    <h3>{project.name}</h3>
                    <p>{project.copy}</p>
                    <div className="tag-row">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </ProjectCard>
              ))}
            </div>
            <div className="work-end mono-label">
              <span>SELECTED WORK / 2024—2026</span>
              <span>ENGINEERED TO MAKE A DIFFERENCE ↗</span>
            </div>
          </div>
        </section>

        <section
          className="story-section skills-section page-gutter"
          id="skills"
          aria-labelledby="skills-title"
        >
          <SectionLabel number="03" name="FROM LOGIC TO REAL LIFE" />
          <div className="section-heading" data-reveal>
            <h2 id="skills-title">
              <SplitWords text="EVERY PART. CONNECTED." />
            </h2>
            <p>
              Practical engineering across the entire lifecycle, from the first
              signal to final commissioning.
            </p>
          </div>
          <div className="capability-list">
            {skills.map((skill) => (
              <article className="capability-row" key={skill.index} data-reveal>
                <span className="capability-number mono-label">
                  /{skill.index}
                </span>
                <div>
                  <p className="eyebrow">{skill.label}</p>
                  <h3>{skill.title}</h3>
                </div>
                <div className="capability-description">
                  <p>{skill.copy}</p>
                  <div className="tag-row">
                    {skill.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <span className="capability-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </section>

        <section
          className="story-section experience-section page-gutter"
          id="experience"
          aria-labelledby="experience-title"
        >
          <SectionLabel number="04" name="EXPERIENCE IN THE FIELD" />
          <div className="experience-layout">
            <div className="experience-intro">
              <h2 id="experience-title">
                <SplitWords text="LEARNED WHERE IT MATTERS." />
              </h2>
              <p>
                On the factory floor.
                <br />
                Inside aerospace facilities.
                <br />
                Aboard commercial vessels.
              </p>
              <span className="experience-asterisk" aria-hidden="true">
                ✳
              </span>
            </div>
            <div className="timeline">
              {experience.map((item) => (
                <article
                  className="timeline-item glass-surface"
                  key={item.company}
                  data-reveal
                >
                  <div className="timeline-date mono-label">
                    {item.year}
                    {item.current && (
                      <span className="current-badge">CURRENT</span>
                    )}
                  </div>
                  <h3>{item.company}</h3>
                  <p className="timeline-role">{item.role}</p>
                  <p className="timeline-copy">{item.copy}</p>
                  <div className="tag-row">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="story-section stack-section page-gutter"
          id="stack"
          aria-labelledby="stack-title"
        >
          <SectionLabel number="05" name="TOOLS OF THE TRADE" />
          <div className="section-heading" data-reveal>
            <h2 id="stack-title">
              <SplitWords text="THE RIGHT CONNECTIONS." />
            </h2>
            <p>
              Controllers, operator systems, and networks.
              <br />
              The tools that bring it all together.
            </p>
          </div>
          <div className="stack-grid">
            {platformStack.map((platform) => (
              <article
                className="stack-card glass-surface"
                key={platform.group}
                data-reveal
              >
                <p className="mono-label">{platform.group}</p>
                <h3>{platform.title}</h3>
                <ul>
                  {platform.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="field-note" data-reveal>
            <span aria-hidden="true">↗</span> VFD and servo setup ·
            Instrumentation · Testing · Troubleshooting · Commissioning
          </p>
        </section>

        <section
          className="story-section certification-section page-gutter"
          id="certifications"
          aria-labelledby="certifications-title"
        >
          <SectionLabel number="06" name="ALWAYS BUILDING KNOWLEDGE" />
          <div className="credentials-layout">
            <div className="education-card glass-surface" data-reveal>
              <p className="eyebrow">EDUCATION / 2020—2024</p>
              <h2 id="certifications-title">
                Robotics &<br />
                Automation.
              </h2>
              <p>B.Tech · Kerala Technological University</p>
            </div>
            <div className="certifications-list">
              <p className="eyebrow">FURTHER STUDY</p>
              {certifications.map((certification, index) => (
                <article
                  className="certification-row"
                  key={certification}
                  data-reveal
                >
                  <span className="mono-label">0{index + 1}</span>
                  <h3>{certification}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="story-section contact-section page-gutter"
          id="contact"
          aria-labelledby="contact-title"
        >
          <SectionLabel number="07" name="THE NEXT GOOD CONNECTION" />
          <div className="contact-heading" data-reveal>
            <h2 id="contact-title">
              LET’S TALK
              <span className="contact-star" aria-hidden="true">
                ✳
              </span>
              <br />
              POSSIBILITIES.
            </h2>
          </div>
          <div className="contact-layout">
            <div className="contact-copy" data-reveal>
              <p>Good systems start with a conversation.</p>
              <p>
                For automation roles, engineering projects, and ideas worth
                building.
              </p>
              <MagneticLink
                className="contact-email"
                href="mailto:amaljoy519@gmail.com"
              >
                amaljoy519@gmail.com <span aria-hidden="true">↗</span>
              </MagneticLink>
              <div className="contact-links">
                <a className="text-link" href="tel:+918086962561">
                  +91 80869 62561 <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="text-link"
                  href="https://www.linkedin.com/in/amal-joy-9622a4202"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </div>
              <span className="mono-label contact-location">
                ERNAKULAM, KERALA, INDIA
              </span>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="site-footer page-gutter">
        <a className="footer-brand" href="#home">
          AMAL JOY<span className="accent-period">.</span>
        </a>
        <p className="mono-label">
          ENGINEERING WHAT MOVES / {new Date().getFullYear()}
        </p>
        <div className="footer-links">
          <a
            href="https://github.com/amalj007"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB ↗
          </a>
          <a href="#home" className="back-top">
            BACK TO TOP ↑
          </a>
        </div>
      </footer>
    </>
  );
}
