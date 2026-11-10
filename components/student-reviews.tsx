export function StudentReviews() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="flex justify-center bg-[#fff7fb] px-6 py-16 min-[1100px]:px-10 min-[1100px]:py-24 min-[1440px]:px-[60px]">
      <div className="flex w-full max-w-[342px] flex-col gap-[30px] min-[1100px]:max-w-[1200px] min-[1100px]:gap-[44px]">
        <div className="flex flex-col gap-2.5 min-[1100px]:w-[600px] min-[1100px]:gap-3">
          <h2 id="testimonials-heading" className="text-eduvert-h2-mobile leading-eduvert-h2-mobile font-eduvert-700 tracking-[-0.025em] text-eduvert-text-primary min-[1100px]:text-eduvert-h2 min-[1100px]:leading-eduvert-h2">
            What Students Say
          </h2>
          <p className="text-eduvert-body leading-[26px] text-[#5b6070] min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
            Experiences shared by students who have learned with EduVert.
          </p>
        </div>
        <div className="flex flex-col gap-[22px] min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-16">
          <figure className="flex min-w-0 flex-col gap-3.5 min-[1100px]:flex-1 min-[1100px]:gap-[22px] min-[1440px]:w-[660px] min-[1440px]:shrink-0 min-[1440px]:flex-none">
            <blockquote className="max-w-[326px] text-[26px] leading-[35px] font-eduvert-600 tracking-[-0.023em] text-eduvert-text-primary min-[1100px]:max-w-[470px] min-[1100px]:text-[36px] min-[1100px]:leading-[47px]">
              {featuredReview.quote}
            </blockquote>
            <figcaption className="flex flex-col gap-[3px] min-[1100px]:max-w-[420px]">
              <span className="text-eduvert-body leading-[27px] font-eduvert-700 text-eduvert-text-primary min-[1100px]:text-eduvert-body-large min-[1100px]:leading-[30px]">
                {featuredReview.name}
              </span>
              <span className="text-eduvert-support leading-[21px] text-[#5b6070]">{reviewSource}</span>
            </figcaption>
          </figure>
          <div className="flex min-w-0 flex-col gap-[22px] min-[1100px]:w-[40%] min-[1100px]:shrink-0 min-[1100px]:gap-6 min-[1100px]:border-l min-[1100px]:border-eduvert-border-subtle min-[1100px]:pl-6 min-[1440px]:w-[476px] min-[1440px]:pl-[39px]">
            {supportingReviews.map((review, index) => (
              <figure key={review.name} className={`flex w-full flex-col gap-3 border-t border-eduvert-border-subtle pt-[22px] min-[1100px]:pt-0 min-[1440px]:w-[436px] ${index === 0 ? "min-[1100px]:border-t-0" : "min-[1100px]:pt-6"}`}>
                <blockquote className={`text-[19px] leading-[27px] font-eduvert-500 tracking-[-0.008em] text-eduvert-text-primary min-[1100px]:max-w-[436px] min-[1100px]:text-[21px] min-[1100px]:leading-[30px] ${review.mobileWidth}`}>
                  {review.quote}
                </blockquote>
                <figcaption className="flex flex-col gap-0.5">
                  <span className="text-eduvert-body leading-[27px] font-eduvert-700 text-eduvert-text-primary">{review.name}</span>
                  <span className="text-eduvert-support leading-[21px] text-[#5b6070]">{reviewSource}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:border-t min-[1100px]:border-eduvert-border-subtle min-[1100px]:pt-[14px]">
          <p className="text-eduvert-support leading-[21px] text-[#5b6070] min-[1100px]:w-[600px] min-[1100px]:shrink-0">
            Selected excerpts from reviews displayed on EduVert&apos;s existing website.
          </p>
          <a href={reviewsHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-fit items-center gap-2.5 text-eduvert-button leading-[21px] font-eduvert-700 text-eduvert-action-primary">
            Read More Student Reviews
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
              <path d="M3.5 9h10.3M9.5 4.7 14 9l-4.5 4.3" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

const reviewsHref = "https://www.eduvert.co/"

const reviewSource = "Student review · Via Google on EduVert website"

const featuredReview: Review = {
  name: "Vinay Kashid",
  quote: "“The live case studies are the real game changer.”",
}

const supportingReviews: Review[] = [
  {
    name: "Ismail Deshmukh",
    quote: "“practical knowledge on live campaign management and live projects.”",
    mobileWidth: "max-w-[271px]",
  },
  {
    name: "Prathamesh Patil",
    quote: "“live projects and interactive assignments.”",
    mobileWidth: "max-w-[250px]",
  },
]

interface Review {
  name: string
  quote: string
  mobileWidth?: string
}
