import { MagneticLink } from "@/components/site-ui";
import { SceneLayer } from "@/components/scene-layer";
import { ProjectCard } from "@/components/project-card";
import { ContactForm } from "@/components/contact-form";

const resumeUrl =
  (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/assets/docs/Amal_Joy_Resume.pdf";

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
    items: ["Siemens S7-1200 / 1500 / 300 / 400 / 405H / 200", "Schneider M221 / M340 / M580", "Allen-Bradley CompactLogix L33R", "MicroLogix 1400 / 1500", "Honeywell C300 DCS"],
  },
  {
    group: "02 / VISUALIZATION",
    title: "Operator systems",
    items: ["Siemens WinCC / Unified / OA", "AVEVA InTouch / Edge", "Plant SCADA / FactoryTalk View", "Ignition / Vijeo Designer"],
  },
  {
    group: "03 / DEVELOPMENT",
    title: "Logic & data",
    items: ["STL / SCL / LAD / FBD / SFC", "TIA Portal", "Python / VBScript", "C / Java / SQL Server"],
  },
  {
    group: "04 / INTEGRATION",
    title: "Industrial networks",
    items: ["PROFINET / PROFIBUS", "Ethernet/IP / Modbus RTU & TCP", "OPC UA / MQTT / HART", "IEC 61850 / SNMP"],
  },
];

const certifications = [
  "Post Graduate Diploma in Industrial Automation",
  "Advanced Diploma in Distributed Control System · Honeywell C300",
  "Ignition 8.1 Credential · Inductive Automation",
  "Google IT Automation with Python · Coursera",
];

function SplitWords({ text, className = "" }: { text: string; className?: string }) {
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
            <pattern id={pid + "-grid"} width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" stroke="rgba(155,255,227,.08)" strokeWidth="1" />
            </pattern>
            <linearGradient id={pid + "-beam"} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b9fff0" />
              <stop offset=".48" stopColor="#72e5cb" />
              <stop offset="1" stopColor="#4d92d8" />
            </linearGradient>
          </defs>
          <rect width="620" height="330" fill="#0b1517" />
          <rect width="620" height="330" fill={"url(#" + pid + "-grid)"} />
          <path d="M0 282H620M0 44H620" stroke="rgba(220,255,245,.12)" />
          <circle cx="514" cy="82" r="38" fill="none" stroke="rgba(131,245,209,.18)" />
          <circle cx="514" cy="82" r="27" fill="none" stroke="rgba(131,245,209,.2)" />
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
              <path d="M68 257h120m0 0v-22m100 22v-26m102 26v-22m115 22v-27" opacity=".36" />
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
              <path d="M104 132h25m-25 16h78M104 224h25m-25 16h78" opacity=".55" />
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
              <rect x="440" y="111" width="78" height="75" rx="5" opacity=".5" />
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

export function Portfolio() {
  return (
    <>
      <SceneLayer />
      <main id="main">
        <section className="hero-section" id="home" aria-labelledby="hero-title">
          <div className="hero-light hero-light-a" aria-hidden="true" />
          <div className="hero-light hero-light-b" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-radar">
              <span />
              <i />
            </div>
            <div className="hero-hud hero-hud-top">
              <span className="hud-live-dot" />
              <span>FIELD / SYSTEM STUDY</span>
              <b>AJ—01</b>
            </div>
            <div className="hero-hud hero-hud-bottom">
              <span>CONTROL → PROCESS → PEOPLE</span>
              <span>ILLUSTRATIVE 3D / NOT LIVE DATA</span>
            </div>
          </div>
          <div className="hero-content page-gutter">
            <p className="hero-kicker hero-intro">
              <span className="status-pulse" />
              AUTOMATION / ROBOTICS / CONTROLS
              <span className="kicker-location">ERNAKULAM, INDIA</span>
            </p>
            <h1 id="hero-title">
              <span className="sr-only">Engineering Intelligent Automation</span>
              <span className="hero-line" aria-hidden="true">
                <span className="split-word">Engineering</span>
              </span>
              <span className="hero-line" aria-hidden="true">
                <span className="split-word">Intelligent</span>
              </span>
              <span className="hero-line hero-line-accent" aria-hidden="true">
                <span className="split-word">Automation</span>
              </span>
            </h1>
            <p className="hero-specialty hero-intro">
              <span>Automation Engineer</span><i />
              <span>Robotics Engineer</span><i />
              <span>PLC</span><i />
              <span>SCADA</span><i />
              <span>Industry 4.0</span>
            </p>
            <p className="hero-summary hero-intro">
              I build the logic behind what moves — engineering automation for marine vessels, aerospace facilities, and industrial processes.
            </p>
            <div className="hero-actions hero-intro">
              <MagneticLink className="button button-primary" href={resumeUrl} download="Amal_Joy_Resume.pdf">
                <span>Download resume</span>
                <span className="button-icon" aria-hidden="true">↓</span>
              </MagneticLink>
              <a className="button button-quiet" href="#projects">
                Discover selected work <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="hero-baseline hero-intro">
              <span>MARINE</span><i /><span>AEROSPACE</span><i /><span>INDUSTRIAL</span>
            </div>
          </div>
          <a className="scroll-cue hero-intro" href="#about" aria-label="Scroll to About Amal">
            <span>SCROLL TO EXPLORE</span>
            <span className="scroll-cue-line" aria-hidden="true" />
            <span>01 — 08</span>
          </a>
          <div className="hero-index mono-label" aria-hidden="true">SYSTEMS / 2026</div>
        </section>

        <section className="story-section about-section" id="about" aria-labelledby="about-title">
          <div className="section-wash section-wash-about" aria-hidden="true" />
          <div className="page-gutter">
            <SectionLabel number="01" name="A FIELD-FIRST PRACTICE" />
            <div className="about-layout">
              <div className="about-lead" data-reveal>
                <p className="eyebrow">FROM SIGNAL TO SYSTEM</p>
                <h2 id="about-title">
                  <SplitWords text="Make the complex feel certain." />
                </h2>
              </div>
              <div className="about-copy" data-reveal>
                <p>
                  I connect equipment, process logic, and the people who operate them. My work spans marine automation and power management, industrial control, and mission-critical aerospace facilities.
                </p>
                <p>
                  At ISRO&apos;s SDSC SHAR, I contributed to automated bowl-cleaning and solid-propellant casting systems supporting GSLV and Gaganyaan programs. Today, I work on integrated automation, power management, and navigation safety for commercial vessels and offshore assets.
                </p>
                <div className="about-facts">
                  <div><span>BASED</span><strong>Ernakulam, Kerala</strong></div>
                  <div><span>EDUCATION</span><strong>B.Tech · Robotics &amp; Automation</strong></div>
                  <div><span>APPROACH</span><strong>Design · Integrate · Commission</strong></div>
                </div>
              </div>
            </div>
            <div className="proof-stats" aria-label="Portfolio overview" data-reveal>
              <div className="proof-stat" aria-label="Seven featured project studies">
                <span className="proof-stat-value" data-count="7" aria-hidden="true">07</span>
                <span className="mono-label">SYSTEM STUDIES</span>
              </div>
              <div className="proof-stat" aria-label="Three engineering sectors">
                <span className="proof-stat-value" data-count="3" aria-hidden="true">03</span>
                <span className="mono-label">ENGINEERING SECTORS</span>
              </div>
              <div className="proof-stat" aria-label="Four professional certifications">
                <span className="proof-stat-value" data-count="4" aria-hidden="true">04</span>
                <span className="mono-label">CERTIFICATIONS</span>
              </div>
            </div>
            <div className="about-quote" data-reveal>
              <span className="quote-mark">“</span>
              <p>Reliable systems are built long before anyone presses start.</p>
              <span className="quote-signoff mono-label">ENGINEERING PRINCIPLE / 001</span>
            </div>
          </div>
        </section>

        <section className="story-section skills-section" id="skills" aria-labelledby="skills-title">
          <div className="section-wash section-wash-skills" aria-hidden="true" />
          <div className="page-gutter">
            <SectionLabel number="02" name="WHAT I BRING TO THE SYSTEM" />
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">CAPABILITIES</p>
                <h2 id="skills-title"><SplitWords text="Built to work together." /></h2>
              </div>
              <p>Practical controls work across the full lifecycle: logic, operators, equipment, and the field.</p>
            </div>
            <div className="skills-grid">
              {skills.map((skill) => (
                <article className="skill-card glass-card" key={skill.index} data-reveal>
                  <div className={"skill-icon skill-icon-" + skill.icon} aria-hidden="true">
                    <span /><span /><span /><i />
                  </div>
                  <div className="skill-card-meta"><span>{skill.index} / CAPABILITY</span><span className="card-cross">↗</span></div>
                  <p className="eyebrow">{skill.label}</p>
                  <h3>{skill.title}</h3>
                  <p className="skill-copy">{skill.copy}</p>
                  <div className="tag-row">{skill.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="story-section experience-section" id="experience" aria-labelledby="experience-title">
          <div className="section-wash section-wash-experience" aria-hidden="true" />
          <div className="page-gutter">
            <SectionLabel number="03" name="EXPERIENCE IN THE FIELD" />
            <div className="section-heading experience-heading" data-reveal>
              <div>
                <p className="eyebrow">CAREER TIMELINE</p>
                <h2 id="experience-title"><SplitWords text="Learned where it matters." /></h2>
              </div>
              <p>Controls work on the factory floor, inside aerospace facilities, and aboard commercial vessels.</p>
            </div>
            <div className="timeline">
              {experience.map((item, index) => (
                <article className="timeline-item" data-reveal key={item.company}>
                  <div className="timeline-rail"><span>{String(index + 1).padStart(2, "0")}</span><i /></div>
                  <div className="timeline-date mono-label">{item.year}</div>
                  <div className="timeline-content">
                    <div className="timeline-title">
                      <div><h3>{item.company}</h3><p>{item.role}</p></div>
                      {item.current && <span className="current-badge"><i /> CURRENT</span>}
                    </div>
                    <p className="timeline-place">{item.place}</p>
                    <p className="timeline-copy">{item.copy}</p>
                    <div className="tag-row">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="story-section work-section" id="projects" aria-labelledby="projects-title">
          <div className="section-wash section-wash-work" aria-hidden="true" />
          <div className="page-gutter work-heading-wrap">
            <SectionLabel number="04" name="SELECTED SYSTEMS" />
            <div className="section-heading work-heading" data-reveal>
              <div>
                <p className="eyebrow">PROJECT ARCHIVE / 2024—26</p>
                <h2 id="projects-title"><SplitWords text="Control with purpose." /></h2>
              </div>
              <p>Systems designed for real processes, dependable operation, and people in the loop.</p>
            </div>
          </div>
          <div className="work-stage">
            <div className="project-track">
              {projects.map((project) => (
                <ProjectCard key={project.id} id={project.id} systemNote={project.data}>
                  <div className="project-topline">
                    <span>SYS / {project.id}</span>
                    <span>{project.domain}</span>
                  </div>
                  <ProjectArt variant={project.variant} index={project.id} data={project.data} />
                  <div className="project-copy">
                    <p className="eyebrow">{project.type}</p>
                    <h3>{project.name}</h3>
                    <p>{project.copy}</p>
                    <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                  <div className="project-bottomline">
                    <span>CONTROL / MONITOR / IMPROVE</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </ProjectCard>
              ))}
            </div>
            <div className="work-stage-note mono-label"><span>DRAG / SCROLL TO EXPLORE</span><span>01 — 07</span></div>
          </div>
        </section>

        <section className="story-section stack-section" id="stack" aria-labelledby="stack-title">
          <div className="section-wash section-wash-stack" aria-hidden="true" />
          <div className="page-gutter">
            <SectionLabel number="05" name="PLATFORMS & PROTOCOLS" />
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">ENGINEERING STACK</p>
                <h2 id="stack-title"><SplitWords text="Every layer connected." /></h2>
              </div>
              <p>From field instruments and drives to controllers, operator stations, and plant networks.</p>
            </div>
            <div className="stack-grid">
              {platformStack.map((platform) => (
                <article className="stack-card" key={platform.group} data-reveal>
                  <p className="mono-label">{platform.group}</p>
                  <h3>{platform.title}</h3>
                  <div className="stack-rule"><span /></div>
                  <ul>{platform.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="field-note glass-card" data-reveal>
              <span className="field-note-symbol" aria-hidden="true">↗</span>
              <p><strong>Field engineering:</strong> VFD and servo setup, instrumentation calibration, installation, testing, troubleshooting, operator support, and commissioning.</p>
              <span className="mono-label">METHOD / 05.01</span>
            </div>
          </div>
        </section>

        <section className="story-section certification-section" id="certifications" aria-labelledby="certifications-title">
          <div className="section-wash section-wash-certifications" aria-hidden="true" />
          <div className="page-gutter">
            <SectionLabel number="06" name="FOUNDATION & CONTINUING STUDY" />
            <div className="credentials-layout">
              <article className="education-card glass-card" data-reveal>
                <p className="eyebrow">EDUCATION</p>
                <span className="credential-year mono-label">2020 — 2024</span>
                <h2 id="certifications-title">B.Tech <span>Robotics &amp; Automation</span></h2>
                <p>Kerala Technological University</p>
                <div className="education-schematic" aria-hidden="true"><span /><span /><i /></div>
                <small className="mono-label">ENGINEERING FOUNDATION / 01</small>
              </article>
              <div className="certifications-list" aria-labelledby="certifications-label">
                <p className="eyebrow" id="certifications-label" data-reveal>CERTIFICATIONS</p>
                {certifications.map((certification, index) => (
                  <article className="certification-row" data-reveal key={certification}>
                    <span className="cert-number mono-label">{String(index + 1).padStart(2, "0")}</span>
                    <strong>{certification}</strong>
                    <span className="cert-arrow" aria-hidden="true">↗</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="story-section contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-orbit" aria-hidden="true"><span /><i /></div>
          <div className="page-gutter">
            <div className="contact-panel glass-card" data-reveal>
              <div className="contact-topline">
                <SectionLabel number="07" name="OPEN CHANNEL" />
                <span className="contact-status"><i /> OPEN TO ENGINEERING CONVERSATIONS</span>
              </div>
              <div className="contact-layout">
                <div className="contact-copy">
                  <p className="eyebrow">LET&apos;S CONNECT</p>
                  <h2 id="contact-title">Good systems start with a conversation.</h2>
                  <p>For automation roles, project conversations, and engineering collaboration.</p>
                  <MagneticLink className="button button-primary contact-button" href="mailto:amaljoy519@gmail.com?subject=Automation%20Engineering%20Enquiry">
                    <span>Start a conversation</span><span className="button-icon" aria-hidden="true">↗</span>
                  </MagneticLink>
                </div>
                <div className="contact-details">
                  <a href="mailto:amaljoy519@gmail.com"><span>EMAIL</span><strong>amaljoy519@gmail.com</strong><b aria-hidden="true">↗</b></a>
                  <a href="tel:+918086962561"><span>PHONE</span><strong>+91 80869 62561</strong><b aria-hidden="true">↗</b></a>
                  <a href="https://www.linkedin.com/in/amal-joy-9622a4202" target="_blank" rel="noopener noreferrer"><span>LINKEDIN</span><strong>amal-joy-9622a4202</strong><b aria-hidden="true">↗</b></a>
                  <div><span>LOCATION</span><strong>Ernakulam, Kerala, India</strong></div>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer page-gutter">
        <a className="footer-brand" href="#home" aria-label="Back to top, Amal Joy">
          <span className="brand-mark brand-mark-small" aria-hidden="true"><span>AJ</span><i /></span>
          <span>AMAL JOY</span>
        </a>
        <p className="mono-label">CONTROL <i>·</i> AUTOMATION <i>·</i> RELIABILITY</p>
        <div className="footer-links">
          <a className="footer-social" href="https://github.com/amalj007" target="_blank" rel="noopener noreferrer">GITHUB <span aria-hidden="true">↗</span></a>
          <a className="footer-social" href="https://www.linkedin.com/in/amal-joy-9622a4202" target="_blank" rel="noopener noreferrer">LINKEDIN <span aria-hidden="true">↗</span></a>
          <a className="back-top" href="#home">BACK TO TOP <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </>
  );
}

