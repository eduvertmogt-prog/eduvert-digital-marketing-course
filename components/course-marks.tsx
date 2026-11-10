export function CourseMark({ name, className }: CourseMarkProps) {
  return (
    <svg viewBox="0 0 200 184" aria-hidden="true" className={className}>
      {markShapes(name)}
    </svg>
  )
}

function markShapes(name: CourseMarkName) {
  switch (name) {
    case "flagship":
      return (
        <>
          <path d="M16 61h166M16 83h166M16 105h166M16 127h166M16 149h166M42 48v112M67 48v112M92 48v112M117 48v112M142 48v112M167 48v112" fill="none" stroke="#A52B86" strokeWidth="0.65" strokeLinecap="round" />
          <circle cx="91" cy="87" r="59" fill="none" stroke="#CF5EB9" />
          <circle cx="125" cy="96" r="57" fill="none" stroke="#57B7E2" />
          <circle cx="106" cy="118" r="54" fill="none" stroke="#F6CD65" />
          <path d="M39 112c29-33 51-19 67-29 18-11 27-41 62-45" fill="none" stroke="#A52B86" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="39" cy="112" r="3" fill="#A52B86" />
          <circle cx="106" cy="83" r="3" fill="#A52B86" />
          <circle cx="168" cy="38" r="3" fill="#A52B86" />
        </>
      )
    case "seo":
      return <path d="M23 37h154v31H23zM32 85h106m-106 12h79m-79 24h127m-127 12h93m-93 24h63m-63 12h113M35 51a6 6 0 1 1 12 0a6 6 0 1 1-12 0m10 5 5 5m10-8h81" fill="none" stroke="#126F96" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    case "sem":
      return <path d="M26 134h152m-148-5V48m6 69 31-17 26 8 29-39 29 8 22-27m-17 0h17v17M51 126v-13m28 13v-9m29 9v-26m26 26v-34m26 34V85M38 151h112" fill="none" stroke="#90631C" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    case "smm":
      return <path d="M38 28h122v136H38zM50 42h98v66H50zM50 97l27-26 16 13 21-24 34 37M52 127h74m-74 14h52m24 0h17" fill="none" stroke="#A52B86" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    case "data":
      return <path d="M23 35h153v117H23zM23 58h153M23 80h153M23 102h153M23 124h153M59 35v117m39-117v117m38-117v117m-107-19 30-26 36 2 40-28 31 2" fill="none" stroke="#3B5D79" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    default: {
      const unhandled: never = name
      return unhandled
    }
  }
}

interface CourseMarkProps {
  name: CourseMarkName
  className: string
}

export type CourseMarkName = "flagship" | "seo" | "sem" | "smm" | "data"
