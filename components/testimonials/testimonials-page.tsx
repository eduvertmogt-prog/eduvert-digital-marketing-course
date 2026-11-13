import { demoHref } from "@/components/site-nav"
import { ClassroomVideo } from "@/components/testimonials/classroom-video"
import { ShortsStrip } from "@/components/testimonials/shorts-strip"

export function TestimonialsPage() {
  return (
    <>
      <Reviews />
      <ShortsStrip />
      <ClassroomVideo />
      <DemoCta />
    </>
  )
}

function Reviews() {
  return (
    <section aria-labelledby="testimonials-page-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">TESTIMONIALS</p>
          <h1 id="testimonials-page-heading" className="eduvert-h1 text-eduvert-text-primary">
            Real Experiences. Real Learning.
          </h1>
        </div>
        <figure className="flex flex-col justify-between gap-8 rounded-eduvert-16 bg-eduvert-tint-soft-blue px-6 py-7 min-[1100px]:px-8 min-[1100px]:py-9">
          <div className="flex flex-col gap-4">
            <p className="eduvert-support font-eduvert-700 text-eduvert-action-primary">FEATURED REVIEW</p>
            <blockquote className="max-w-[560px] eduvert-h3 tracking-[-0.02em] text-eduvert-text-primary">
              {featuredReview.quote}
            </blockquote>
          </div>
          <ReviewCredit name={featuredReview.name} />
        </figure>
        <ul className="grid gap-4 min-[1100px]:grid-cols-3">
          {otherReviews.map((review) => (
            <li key={review.name}>
              <figure className="flex h-full flex-col justify-between gap-6 rounded-eduvert-16 bg-eduvert-surface-white px-6 py-6">
                <blockquote className="eduvert-body-large font-eduvert-600 text-eduvert-text-primary">{review.quote}</blockquote>
                <ReviewCredit name={review.name} />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function DemoCta() {
  return (
    <section aria-labelledby="testimonials-cta-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex flex-col gap-8 rounded-eduvert-16 bg-eduvert-tint-yellow px-6 py-8 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:px-12 min-[1100px]:py-11">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 id="testimonials-cta-heading" className="eduvert-h2 text-eduvert-text-primary">
              Experience a Class for Yourself
            </h2>
            <p className="eduvert-body text-eduvert-text-secondary">
              Book a free demo to get a feel for EduVert’s approach to practical learning.
            </p>
          </div>
          <a href={demoHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 eduvert-button text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
            Book a Free Demo
          </a>
        </div>
      </div>
    </section>
  )
}

function ReviewCredit({ name }: { name: string }) {
  return (
    <figcaption className="flex flex-col gap-0.5">
      <span className="eduvert-body font-eduvert-700 text-eduvert-text-primary">{name}</span>
      <span className="eduvert-support text-eduvert-text-secondary">{reviewSource}</span>
    </figcaption>
  )
}

const reviewSource = "Review excerpt · Via Google"

const featuredReview = {
  name: "Vinay Kashid",
  quote: "“The live case studies are the real game changer.”",
}

const otherReviews = [
  { name: "Ismail Deshmukh", quote: "“practical knowledge on live campaign management and live projects.”" },
  { name: "Prathamesh Patil", quote: "“live projects and interactive assignments.”" },
  { name: "Tejas Dandekar", quote: "“ensuring that we understand concepts thoroughly and are equipped with practical skills.”" },
  { name: "Ruma Kazi", quote: "“giving me valuable experience in implementing digital marketing strategies.”" },
  { name: "Nihad Ubare", quote: "“personalized guidance and support.”" },
  { name: "Rahil Kazi", quote: "“Great ambiance and faculties”" },
  {
    name: "Sabaali Khan",
    quote:
      "“Eduvert is the one of the best institute in Navi Mumbai.Got to learn many things .Had a great experience learning digital marketing from Sandeep Sir.”",
  },
  {
    name: "SIDD",
    quote:
      "“The institute where I finally got what i wanted to learn. the best digital marketing program. I had tried many digital marketing courses before joining eduvert but none of them fulfilled my expectations. Eduvet's DM program, the staff,the faculty really helped me out and suppressed my past experiences and filled every gap that I could have emcountered before !!!”",
  },
]
