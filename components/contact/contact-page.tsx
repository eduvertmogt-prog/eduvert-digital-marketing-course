import { ContactForm } from "@/components/contact/contact-form"
import { counsellorActions } from "@/components/programs/program-content"
import { phoneHref, whatsAppHref } from "@/components/site-nav"

export function ContactPage() {
  return (
    <>
      <section aria-labelledby="contact-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 py-10 min-[1100px]:grid-cols-[minmax(0,1fr)_480px] min-[1100px]:items-start min-[1100px]:gap-16 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-3.5">
              <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">CONTACT</p>
              <h1 id="contact-heading" className="max-w-[560px] eduvert-h1 text-eduvert-text-primary">
                Let’s Talk About Your Next Step.
              </h1>
              <p className="max-w-[460px] eduvert-body-large text-eduvert-text-secondary">
                Ask about courses and available batches, or request a live class.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {contactMethods.map((method) => (
                <li key={method.label}>
                  <p className="eduvert-support font-eduvert-500 text-eduvert-text-secondary">{method.label}</p>
                  <a href={method.href} className="mt-1 inline-flex items-center gap-2 eduvert-body font-eduvert-600 text-eduvert-text-primary hover:text-eduvert-action-primary" target={method.external ? "_blank" : undefined} rel={method.external ? "noopener noreferrer" : undefined}>
                    {method.value}
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 min-[1100px]:flex-row">
              <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover">
                {counsellorActions.demoLabel}
              </a>
              <a href={counsellorActions.demoHref} data-demo-intent="counsellor_callback" className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 eduvert-button text-eduvert-text-primary hover:bg-eduvert-tint-soft-blue">
                {counsellorActions.talkLabel}
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-eduvert-16 bg-eduvert-surface-white p-6 shadow-[0_12px_32px_color-mix(in_srgb,var(--color-eduvert-text-primary)_6%,transparent)] min-[1100px]:p-7">
              <ContactForm />
            </div>
            <p className="eduvert-support text-eduvert-text-secondary">
              EduVert uses these details to respond to your enquiry.
            </p>
          </div>
        </div>
      </section>
      <section aria-labelledby="visit-heading" className="bg-eduvert-surface-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-10 min-[1100px]:grid-cols-2 min-[1100px]:items-stretch min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-16 min-[1440px]:px-[120px]">
          <div className="flex flex-col justify-center gap-3">
            <h2 id="visit-heading" className="eduvert-h2 tracking-[-0.025em] text-eduvert-text-primary">
              Visit EduVert
            </h2>
            <p className="eduvert-h4 text-eduvert-text-primary">EduVert · Seawoods</p>
            <p className="max-w-[420px] eduvert-body text-eduvert-text-secondary">{campusAddress}</p>
            <a href={mapHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-fit items-center eduvert-button text-eduvert-link underline underline-offset-4">
              Open in Google Maps
            </a>
          </div>
          <iframe
            src={mapEmbedHref}
            title="Map of EduVert’s Seawoods campus"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="block h-[320px] w-full rounded-eduvert-16 border border-eduvert-border-subtle bg-eduvert-tint-blue min-[1100px]:h-[380px]"
          />
        </div>
      </section>
    </>
  )
}

const campusAddress = "S-10-B, Haware Centurion Mall, 2nd Floor, Seawoods, Navi Mumbai – 400706"

const mapQuery = encodeURIComponent("EduVert, S-10-B, Hawares Centurion Mall, Nerul East, Sector 19, Nerul, Navi Mumbai, Maharashtra 400706")
const mapHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
const mapEmbedHref = `https://maps.google.com/maps?iwloc=near&output=embed&q=${mapQuery}&t=m&z=18`

const contactMethods = [
  { label: "Phone", value: "+91 96196 78085", href: phoneHref, external: false },
  { label: "Email", value: "communication@eduvert.co", href: "mailto:communication@eduvert.co", external: false },
  { label: "WhatsApp", value: "Chat on WhatsApp", href: whatsAppHref, external: true },
]
