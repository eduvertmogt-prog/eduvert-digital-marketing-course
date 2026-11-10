import { ContactForm } from "@/components/contact/contact-form"
import { counsellorActions } from "@/components/programs/program-content"

export function ContactPage() {
  return (
    <>
      <section aria-labelledby="contact-heading" className="bg-eduvert-canvas-warm">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-6 py-12 min-[1100px]:grid-cols-[minmax(0,1fr)_480px] min-[1100px]:items-start min-[1100px]:gap-16 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-3.5">
              <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">CONTACT</p>
              <h1 id="contact-heading" className="max-w-[560px] text-eduvert-h1-mobile leading-eduvert-h1-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-[46px] min-[1100px]:leading-[54px] min-[1440px]:text-eduvert-h1 min-[1440px]:leading-[59px]">
                Let’s Talk About Your Next Step.
              </h1>
              <p className="max-w-[460px] text-eduvert-body-large-mobile leading-[27px] text-eduvert-text-secondary min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
                Ask about courses, available batches, or booking a free demo.
              </p>
            </div>
            <ul className="flex flex-col gap-4">
              {contactMethods.map((method) => (
                <li key={method.label}>
                  <p className="text-[12px] leading-4 font-eduvert-500 text-eduvert-text-secondary">{method.label}</p>
                  <a href={method.href} className="mt-1 inline-flex items-center gap-2 text-[16px] leading-6 font-eduvert-600 text-eduvert-text-primary hover:text-eduvert-action-primary" target={method.external ? "_blank" : undefined} rel={method.external ? "noopener noreferrer" : undefined}>
                    {method.value}
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 min-[1100px]:flex-row">
              <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover">
                {counsellorActions.demoLabel}
              </a>
              <a href={counsellorActions.demoHref} className="flex h-12 items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-text-primary hover:bg-eduvert-tint-magenta">
                {counsellorActions.talkLabel}
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-eduvert-16 bg-eduvert-surface-white p-6 shadow-[0_12px_32px_rgba(36,37,43,0.06)] min-[1100px]:p-7">
              <ContactForm />
            </div>
            <p className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">
              EduVert uses these details to respond to your enquiry.
            </p>
          </div>
        </div>
      </section>
      <section aria-labelledby="visit-heading" className="bg-eduvert-surface-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-12 min-[1100px]:grid-cols-2 min-[1100px]:items-stretch min-[1100px]:gap-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
          <div className="flex flex-col justify-center gap-3">
            <h2 id="visit-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
              Visit EduVert
            </h2>
            <p className="text-[20px] leading-7 font-eduvert-700 text-eduvert-text-primary">EduVert · Seawoods</p>
            <p className="max-w-[420px] text-eduvert-body leading-[26px] text-eduvert-text-secondary">{campusAddress}</p>
          </div>
          <a href={mapHref} target="_blank" rel="noopener noreferrer" className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-eduvert-16 bg-eduvert-tint-blue px-6 py-10 text-center">
            <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-eduvert-surface-white text-eduvert-action-primary">
              <MapPin />
            </span>
            <span className="text-eduvert-support leading-[21px] font-eduvert-600 text-eduvert-text-secondary">Map placeholder</span>
          </a>
        </div>
      </section>
    </>
  )
}

function MapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 16s5-4.2 5-8.1A5 5 0 1 0 4 7.9C4 11.8 9 16 9 16Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="7.5" r="1.6" fill="currentColor" />
    </svg>
  )
}

const campusAddress = "S-10-B, Haware Centurion Mall, 2nd Floor, Seawoods, Navi Mumbai – 400706"

const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campusAddress)}`

const contactMethods = [
  { label: "Phone", value: "+91 96196 78085", href: "tel:+919619678085", external: false },
  { label: "Email", value: "communication@eduvert.co", href: "mailto:communication@eduvert.co", external: false },
  { label: "WhatsApp", value: "Chat on WhatsApp", href: "https://wa.me/919619678085", external: true },
]
