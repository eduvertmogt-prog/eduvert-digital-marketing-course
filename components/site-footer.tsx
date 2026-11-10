import type { ReactNode } from "react"
import { dataCourseHref, flagshipProgramHref, primaryNavigation, semCourseHref, seoCourseHref, smmCourseHref } from "@/components/site-nav"

export function SiteFooter() {
  return (
    <footer className="flex justify-center border-t border-eduvert-border-subtle bg-eduvert-surface-white px-6 pt-10 pb-11 min-[1100px]:px-10 min-[1100px]:pt-16 min-[1100px]:pb-9 min-[1440px]:px-[60px]">
      <div className="flex w-full max-w-[1200px] flex-col gap-6 min-[1100px]:gap-11">
        <div className="flex flex-col gap-6 min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-8 min-[1440px]:gap-10">
          <div className="flex flex-col gap-4 min-[1100px]:w-[210px] min-[1100px]:shrink-0 min-[1440px]:w-[246px]">
            <a href="/" className="w-fit">
              <img src="/images/eduvert-logo.webp" alt="EduVert" width={146} height={43} className="h-[35px] w-[118px] min-[1100px]:h-[43px] min-[1100px]:w-[146px]" />
            </a>
            <p className="text-[15px] leading-6 text-eduvert-text-secondary min-[1100px]:text-eduvert-support min-[1100px]:leading-[22px] min-[1440px]:w-[216px]">
              Practical Digital Marketing and Data Analytics courses in Navi Mumbai and live online.
            </p>
          </div>
          <FooterColumn title="Contact" className="order-2 border-t border-eduvert-border-subtle pt-6 min-[1100px]:order-4 min-[1100px]:min-w-0 min-[1100px]:flex-1 min-[1100px]:border-0 min-[1100px]:pt-0 min-[1440px]:w-[350px] min-[1440px]:flex-none">
            <ul className={linkListClass}>
              <li>
                <a href="tel:+919619678085">+91 96196 78085</a>
              </li>
              <li>
                <a href="mailto:communication@eduvert.co">communication@eduvert.co</a>
              </li>
              <li className="min-[1100px]:max-w-[316px]">S-10-B, Haware Centurion Mall, 2nd Floor, Seawoods, Navi Mumbai – 400706</li>
            </ul>
          </FooterColumn>
          <FooterColumn title="Programs" className="order-3 border-t border-eduvert-border-subtle pt-6 min-[1100px]:order-2 min-[1100px]:min-w-0 min-[1100px]:flex-1 min-[1100px]:border-0 min-[1100px]:pt-0 min-[1440px]:w-[310px] min-[1440px]:flex-none">
            <FooterLinks links={programLinks} />
          </FooterColumn>
          <FooterColumn title="Explore" className="order-4 border-t border-eduvert-border-subtle pt-6 min-[1100px]:order-3 min-[1100px]:w-[150px] min-[1100px]:shrink-0 min-[1100px]:border-0 min-[1100px]:pt-0 min-[1440px]:w-[174px]">
            <FooterLinks links={exploreLinks} />
          </FooterColumn>
        </div>
        <div className="flex flex-col gap-5 border-t border-eduvert-border-subtle pt-6 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:gap-6">
          <p className="order-2 text-eduvert-support leading-[21px] text-eduvert-text-secondary min-[1100px]:order-1 min-[1100px]:shrink-0 min-[1440px]:w-[400px]">
            © 2026 EduVert. All rights reserved.
          </p>
          <ul className={`${linkListClass} order-1 min-[1100px]:order-2 min-[1100px]:flex-row min-[1100px]:flex-wrap min-[1100px]:justify-end min-[1100px]:gap-6`}>
            {policyLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, className, children }: FooterColumnProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <h2 className="text-eduvert-body leading-6 font-eduvert-600 text-eduvert-text-primary">{title}</h2>
      {children}
    </div>
  )
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <ul className={`${linkListClass} min-[1100px]:gap-[11px]`}>
      {links.map((link) => (
        <li key={link.label}>
          <a href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

const linkListClass = "flex flex-col gap-2.5 text-[16px] leading-6 text-eduvert-text-secondary min-[1100px]:text-[15px] min-[1100px]:leading-[22px]"

const programLinks: FooterLink[] = [
  { label: "Professional Digital Marketing Program", href: flagshipProgramHref },
  { label: "SEO Certification", href: seoCourseHref },
  { label: "SEM Certification", href: semCourseHref },
  { label: "Social Media Marketing", href: smmCourseHref },
  { label: "Data Analytics with Python & Excel", href: dataCourseHref },
]

const exploreLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  ...primaryNavigation.filter((item) => item.label !== "Programs"),
]

const policyLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
  { label: "Return & Refund Policy", href: "/return-refund-policy" },
]

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

interface FooterColumnProps {
  title: string
  className: string
  children: ReactNode
}
