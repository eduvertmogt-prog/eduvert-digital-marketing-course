import { demoHref } from "@/components/site-nav"

export function TestimonialsPage() {
  return (
    <>
      <Featured />
      <MoreReviews />
      <DemoCta />
    </>
  )
}

function Featured() {
  return (
    <section aria-labelledby="testimonials-page-heading" className="bg-eduvert-canvas-warm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <div className="flex max-w-[720px] flex-col gap-3.5">
          <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">TESTIMONIALS</p>
          <h1 id="testimonials-page-heading" className="text-eduvert-h1-mobile leading-eduvert-h1-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-[46px] min-[1100px]:leading-[54px] min-[1440px]:text-eduvert-h1 min-[1440px]:leading-[59px]">
            Real Experiences. Real Learning.
          </h1>
          <p className="text-eduvert-body-large-mobile leading-[27px] text-eduvert-text-secondary min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
            Selected excerpts from student reviews displayed on EduVert’s existing website.
          </p>
        </div>
        <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <figure className="flex flex-col justify-between gap-8 rounded-eduvert-16 bg-eduvert-tint-magenta px-6 py-7 min-[1100px]:px-8 min-[1100px]:py-9">
            <div className="flex flex-col gap-4">
              <p className="text-[12px] leading-[17px] font-eduvert-700 text-eduvert-action-primary">FEATURED REVIEW</p>
              <blockquote className="max-w-[560px] text-[26px] leading-[34px] font-eduvert-600 tracking-[-0.02em] text-eduvert-text-primary min-[1100px]:text-[34px] min-[1100px]:leading-[44px]">
                {featuredReview.quote}
              </blockquote>
            </div>
            <ReviewCredit name={featuredReview.name} />
          </figure>
          <div className="grid gap-4">
            {sideReviews.map((review) => (
              <figure key={review.name} className="flex flex-col justify-between gap-5 rounded-eduvert-16 bg-eduvert-surface-white px-6 py-6">
                <blockquote className="text-[18px] leading-7 font-eduvert-600 text-eduvert-text-primary">{review.quote}</blockquote>
                <ReviewCredit name={review.name} />
              </figure>
            ))}
          </div>
        </div>
        <a href={moreReviewsHref} target="_blank" rel="noopener noreferrer" className="flex h-12 w-full items-center justify-center rounded-eduvert-8 border border-eduvert-border-subtle bg-eduvert-surface-white px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-text-primary hover:bg-eduvert-tint-magenta min-[1100px]:w-fit">
          Read More Reviews
        </a>
      </div>
    </section>
  )
}

function MoreReviews() {
  return (
    <section aria-labelledby="more-reviews-heading" className="bg-eduvert-surface-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-6 py-12 min-[1100px]:px-10 min-[1100px]:py-20 min-[1440px]:px-[120px]">
        <h2 id="more-reviews-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
          More Student Reviews
        </h2>
        <ul className="grid gap-4 min-[1100px]:grid-cols-3">
          {moreReviews.map((review) => (
            <li key={review.name}>
              <figure className="flex h-full flex-col justify-between gap-6 rounded-eduvert-16 bg-eduvert-canvas-warm px-6 py-6">
                <blockquote className="text-[18px] leading-7 font-eduvert-600 text-eduvert-text-primary">{review.quote}</blockquote>
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
            <h2 id="testimonials-cta-heading" className="text-eduvert-h3-mobile leading-[30px] font-eduvert-700 text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
              Experience a Class for Yourself
            </h2>
            <p className="text-eduvert-body leading-[26px] text-eduvert-text-secondary">
              Book a free demo to get a feel for EduVert’s approach to practical learning.
            </p>
          </div>
          <a href={demoHref} className="flex h-12 w-full items-center justify-center rounded-eduvert-8 bg-eduvert-action-primary px-5 text-eduvert-button leading-[21px] font-eduvert-600 text-eduvert-surface-white hover:bg-eduvert-action-hover min-[1100px]:w-fit">
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
      <span className="text-eduvert-body leading-6 font-eduvert-700 text-eduvert-text-primary">{name}</span>
      <span className="text-eduvert-support leading-[21px] text-eduvert-text-secondary">{reviewSource}</span>
    </figcaption>
  )
}

const moreReviewsHref = "https://www.eduvert.co/testimonials/"

const reviewSource = "Review excerpt · Via Google"

const featuredReview = {
  name: "Vinay Kashid",
  quote: "“The live case studies are the real game changer.”",
}

const sideReviews = [
  { name: "Ismail Deshmukh", quote: "“practical knowledge on live campaign management and live projects.”" },
  { name: "Prathamesh Patil", quote: "“live projects and interactive assignments.”" },
]

const moreReviews = [
  { name: "Tejas Dandekar", quote: "“ensuring that we understand concepts thoroughly and are equipped with practical skills.”" },
  { name: "Ruma Kazi", quote: "“giving me valuable experience in implementing digital marketing strategies.”" },
  { name: "Nihad Ubare", quote: "“personalized guidance and support.”" },
]
