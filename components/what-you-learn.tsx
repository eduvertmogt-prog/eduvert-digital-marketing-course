"use client"

import { useState } from "react"

export function WhatYouLearn() {
  const [selectedId, setSelectedId] = useState(curriculumModules[0].id)
  const selected = curriculumModules.find((module) => module.id === selectedId) ?? curriculumModules[0]

  return (
    <section id="what-you-learn" aria-labelledby="what-you-learn-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-6 py-16 min-[1100px]:gap-[38px] min-[1100px]:px-10 min-[1100px]:py-24 min-[1440px]:px-[120px]">
        <div className="flex max-w-[700px] flex-col gap-2.5 min-[1100px]:gap-3">
          <h2 id="what-you-learn-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            What You&apos;ll Learn
          </h2>
          <p className="max-w-[342px] text-eduvert-body leading-[26px] text-eduvert-text-secondary min-[1100px]:max-w-[520px] min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
            Explore the seven core modules in our four-month Professional Digital Marketing Program.
          </p>
        </div>
        <div className="flex w-full flex-col min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-8 min-[1440px]:gap-12">
          <div className="w-full border-t border-eduvert-border-subtle min-[1100px]:w-[40%] min-[1100px]:min-w-0 min-[1100px]:shrink-0 min-[1440px]:w-[484px]">
            {curriculumModules.map((module) => {
              const isSelected = module.id === selected.id
              return (
                <div key={module.id}>
                  <button
                    type="button"
                    aria-expanded={isSelected}
                    aria-controls={isSelected ? `module-${module.id}` : undefined}
                    onClick={() => setSelectedId(module.id)}
                    className={`relative flex h-[58px] w-full items-center gap-2.5 border-b border-eduvert-border-subtle px-3 text-left min-[1100px]:h-14 min-[1100px]:gap-4 min-[1100px]:px-[18px] ${isSelected ? "bg-eduvert-tint-magenta" : ""}`}
                  >
                    {isSelected ? <span className="absolute top-0 left-0 h-[57px] w-0.5 bg-eduvert-action-primary min-[1100px]:h-[55px]" /> : null}
                    <span className={`w-[25px] shrink-0 text-eduvert-support leading-[21px] font-eduvert-600 ${isSelected ? "text-eduvert-action-primary" : "text-eduvert-text-secondary"}`}>
                      {module.index}
                    </span>
                    <span className={`min-w-0 flex-1 text-eduvert-body leading-[26px] font-eduvert-600 min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px] ${isSelected ? "text-eduvert-action-primary" : "text-eduvert-text-primary"}`}>
                      {module.label}
                    </span>
                    <span className={isSelected ? "text-eduvert-action-primary" : "text-eduvert-text-secondary"}>
                      <ArrowIcon />
                    </span>
                  </button>
                  {isSelected ? (
                    <div id={`module-${module.id}`} className="border-b border-eduvert-border-subtle bg-eduvert-surface-white pt-5 pr-6 pb-[13px] pl-[47px] min-[1100px]:hidden">
                      <ModuleCopy module={module} />
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
          <div className="hidden min-w-0 flex-1 flex-col gap-3.5 min-[1100px]:flex min-[1440px]:w-[668px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
            <article id={`module-${selected.id}-desktop`} className="flex h-[393px] items-center gap-2.5 overflow-hidden rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-surface-white px-6 min-[1440px]:px-9">
              <div className="flex min-w-0 flex-1 flex-col gap-[22px] min-[1440px]:w-[330px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
                <h3 className="text-eduvert-h3 leading-[34px] font-eduvert-700 tracking-[-0.016em] text-eduvert-text-primary">{selected.title}</h3>
                {selected.tools ? (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-eduvert-support leading-[21px] font-eduvert-600 text-eduvert-text-secondary">Topics &amp; tools</p>
                    <p className="max-w-[253px] text-eduvert-body-large leading-[30px] text-eduvert-text-secondary">{selected.tools}</p>
                  </div>
                ) : null}
              </div>
              <HeatmapGraphic />
            </article>
            <CurriculumLink />
          </div>
        </div>
      </div>
    </section>
  )
}

function ModuleCopy({ module }: { module: CurriculumModule }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="max-w-[271px] text-eduvert-h3-mobile leading-[30px] font-eduvert-700 tracking-[-0.015em] text-eduvert-text-primary">{module.title}</h3>
      {module.tools ? <p className="max-w-[225px] text-eduvert-body leading-[26px] text-eduvert-text-secondary">{module.tools}</p> : null}
      <CurriculumLink />
    </div>
  )
}

function CurriculumLink() {
  return (
    <a href={curriculumHref} className="inline-flex h-11 w-fit items-center gap-2.5 text-eduvert-button leading-[21px] font-eduvert-700 text-eduvert-action-primary">
      View Full Curriculum
      <ArrowIcon />
    </a>
  )
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <path d="M3.5 9h10.3M9.5 4.7 14 9l-4.5 4.3" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function HeatmapGraphic() {
  return (
    <div className="h-[230px] w-[252px] shrink-0 bg-[radial-gradient(circle,rgb(255,245,251)_0%,rgb(255,255,255)_73%)]" aria-hidden="true">
      <svg width="252" height="230" viewBox="0 0 252 230">
        <rect x="23" y="39" width="201" height="151" rx="7" fill="none" stroke="#75667440" strokeWidth="1.25" />
        <path d="M23 62H224M45 82h53m-53 12h38m-38 40h61m-61 13h42m53-63h50m-50 61h55m-55 13h34" fill="none" stroke="#7566744F" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="38" cy="51" r="2" fill="#57B7E273" />
        <circle cx="47" cy="51" r="2" fill="#CF5EB973" />
        <circle cx="56" cy="51" r="2" fill="#F6CD6573" />
        <path d="M72 124C71 106 97 88 116 91c17 3 21 16 36 15 22-2 48-16 55 1 8 20-20 35-41 38-17 3-30-9-48-5-21 5-43 3-46-16Z" fill="#57B7E21F" stroke="#57B7E275" />
        <path d="M89 120c0-12 15-23 28-22 12 2 19 14 31 14 16 0 31-10 43-6 10 4 8 13-1 20-12 10-25 13-39 11-15-3-21-9-33-6-12 4-29 2-29-11Z" fill="none" stroke="#CF5EB97A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="108" cy="118" r="8" fill="#F6CD6580" />
        <circle cx="175" cy="120" r="5" fill="#CF5EB966" />
        <path d="M50 170c20-15 34-12 48-27s23-26 45-27 40 5 59-28" fill="none" stroke="#CF5EB96B" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

const curriculumHref = "/programs/professional-digital-marketing#curriculum"

const curriculumModules: CurriculumModule[] = [
  {
    id: "analytics",
    index: "01",
    label: "Analytics & Heatmaps",
    title: "Web Analytics, Digital Analytics & Heatmaps",
    tools: "Google Analytics 4 (GA4) · Google Tag Manager · Microsoft Clarity · Hotjar",
  },
  {
    id: "social",
    index: "02",
    label: "Social Media & AI",
    title: "Advanced Social Media Marketing & Automation with AI",
    tools: "Meta Ads · Instagram · LinkedIn · X Advertising",
  },
  {
    id: "search",
    index: "03",
    label: "Paid Search & Performance",
    title: "Search Engine Marketing with Google Ads & Bing Ads",
    tools: "Google Ads · Bing Ads · YouTube Marketing",
  },
  {
    id: "email",
    index: "04",
    label: "Email & Automation",
    title: "Email Marketing & Automation",
    tools: "Newsletters · A/B Split Testing · Email Automation",
  },
  {
    id: "mobile",
    index: "05",
    label: "Mobile Marketing",
    title: "Mobile Marketing",
    tools: "SMS Marketing · WhatsApp Automation · Mobile Advertising",
  },
  {
    id: "seo",
    index: "06",
    label: "Advanced SEO, AEO & GEO",
    title: "Advanced Search Engine Optimization: AEO, GEO & AI SEO",
    tools: "Google Search Console · Keyword Research · AEO, GEO & AI SEO",
  },
  {
    id: "projects",
    index: "07",
    label: "Live Projects & Capstone",
    title: "Live Projects & Capstone",
  },
]

interface CurriculumModule {
  id: string
  index: string
  label: string
  title: string
  tools?: string
}
