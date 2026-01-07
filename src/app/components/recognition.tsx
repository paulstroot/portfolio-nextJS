"use client"
import Image from "next/image"
import { A11y, Keyboard, Navigation, Pagination, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"

const content = [
  {
    title: "Shopify Certification",
    description:
      'Shopify Development Fundamentals. Issued to learners who successfully pass the assessment for the "Developer Fundamentals Learning Path that teaches the basics of how to start developing and extending on Shopify’s platform.',
    icon: "/images/shopify.svg",
    link: "https://www.credly.com/badges/f696c678-0ff2-4817-baeb-a2600af37748/public_url",
  },
  {
    title: "Hubspot CMS for Developers I & II",
    description:
      "Certification from Hubspot Academy. HubSpot Academy is the worldwide leader in free online training for inbound marketing, sales, and customer service professionals. ",
    icon: "/images/hubspot.svg",
    link: "https://app-na2.hubspot.com/academy/achievements/9kbtj9w5/en/1/paul-stroot/hubspot-cms-for-developers-ii-best-practices",
  },
  {
    title: "Webby Award",
    description: "Winner of best personal website at the 2001 Webby Awards.",
    icon: "/images/webby.svg",
    link: "https://winners.webbyawards.com/2001/websites-and-mobile-sites/general-desktop-mobile-sites/personal-blogwebsite/157618/dancing-paul",
  },
  {
    title: "Patent US7739255B2 ",
    description:
      "Patent for work on visual GUI for audio files in 2010. I worked on the Flash/ActionScript interface for a tool that allows uses to scrub media files and comment or flag specific timestamp in an easy-to-use GUI.",
    icon: "/images/patent.svg",
    link: "https://patents.google.com/patent/US7739255B2",
  },
  {
    title: "Associates degree in Advertising Design",
    description:
      "Graduated at the top of my class from Brown Institute in Minneapolis in 1997 with a degree in Advertising design.",
    icon: "/images/brown-college.gif",
    link: null,
  },
]

export default function Recognition() {
  return (
    <section id="recognition" className="bg-primary text-primary-contrast recognition py-8 my-0">
      <div className="container m-auto ">
        <h2>Certifications / Recognition</h2>

        <Swiper
          // install Swiper modules
          modules={[Keyboard, Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={false}
          keyboard={{ enabled: true }}
          pagination={{
            el: ".recognition-pagination",
            clickable: true,
          }}
          scrollbar={false}
          loop={true}
          breakpoints={{
            500: {
              spaceBetween: 50,
              slidesPerView: 2,
            },
            768: {
              spaceBetween: 50,
              slidesPerView: 3,
            },
          }}
          // onSwiper={(swiper) => console.log(swiper)}
          // onSlideChange={() => console.log("slide change")}
        >
          {content.map((item, i) => (
            <SwiperSlide key={i}>
              {({ isActive }) => (
                <div>
                  <Image
                    src={item.icon}
                    width={153}
                    height={153}
                    loading="lazy"
                    alt={`${item.title} badge icon`}
                    className="w-auto h-auto max-h-16 mb-4"
                  />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary mt-4 !inline-block !text-xs leading-10"
                      tabIndex={isActive ? 0 : -1}
                      aria-label={`View ${item.title} (opens in new tab)`}
                    >
                      View
                    </a>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="recognition-pagination"></div>
      </div>
    </section>
  )
}
