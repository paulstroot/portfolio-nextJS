"use client";
import {
  sanitizeContentfulRichText,
  sanitizeImageUrl,
} from "@/app/utilities/sanitize";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";

import Image from "next/image";
import { useState } from "react";
import {
  A11y,
  Keyboard,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProjectCard from "./ProjectCard";
// Import Swiper styles
import { ProjectItem } from "@/app/types";
import { escapeHtml, isValidUrl } from "@/app/utilities/sanitize";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function ProjectCarousel({
  projects,
}: {
  projects: ProjectItem[];
}) {
  const [openModal, setOpenModal] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const showProject = (data: ProjectItem) => {
    setActiveProject(data);
    setOpenModal(true);
  };

  return (
    <>
      <Swiper
        // install Swiper modules
        modules={[Keyboard, Navigation, Pagination, Scrollbar, A11y]}
        navigation={false}
        a11y={{
          prevSlideMessage: "Previous project",
          nextSlideMessage: "Next project",
          firstSlideMessage: "This is the first project",
          lastSlideMessage: "This is the last project",
        }}
        keyboard={{ enabled: true }}
        spaceBetween={0}
        slidesPerView={1.2}
        centeredSlides={true}
        pagination={{
          el: ".project-pagination",
          clickable: true,
        }}
        scrollbar={false}
        loop={true}
        onActiveIndexChange={(swiper) => {
          console.log("Changed!");
          console.log(swiper.realIndex);
          setActiveSlideIndex(swiper.realIndex);
        }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
        breakpoints={{
          768: {
            slidesPerView: 1.8,
          },
          1024: {
            slidesPerView: 3,
          },
          1300: {
            slidesPerView: 3.5,
          },
          1500: {
            spaceBetween: -100,
            slidesPerView: 4,
          },
        }}
      >
        {projects.map((project: ProjectItem, i: number) => (
          <SwiperSlide key={i}>
            <ProjectCard
              project={project}
              showProject={showProject}
              isActive={i === activeSlideIndex}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="project-pagination"></div>
      {activeProject && (
        <Modal
          dismissible
          // size="md"
          show={openModal}
          onClose={() => setOpenModal(false)}
          className="project-modal"
        >
          <ModalHeader className="modal-header">
            {escapeHtml(activeProject.fields.title)}
          </ModalHeader>
          <ModalBody className="modal-body">
            <div className="modal-body space-y-6">
              <Image
                src={sanitizeImageUrl(
                  activeProject.fields.featuredImage.fields.file.url
                )}
                width={577}
                height={500}
                alt={escapeHtml(activeProject.fields.title)}
              />
              <aside className="">
                <h4>Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {(activeProject.fields.skills ?? []).map(
                    (skill, i: number) => {
                      const icon = skill.fields.icon?.fields.file.url && (
                        <Image
                          src={sanitizeImageUrl(
                            skill.fields.icon?.fields.file.url
                          )}
                          width={5}
                          height={5}
                          alt="desktop-monitor"
                          className="frame h-4 inline-block mr-2 w-auto"
                        />
                      );
                      return (
                        <Badge
                          key={i}
                          className="inline-flex rounded-full py-1 bg-primary/20 hover:bg-primary/30 font-normal  text-[12px]"
                        >
                          {icon}
                          {escapeHtml(skill.fields.name)}
                        </Badge>
                      );
                    }
                  )}
                </div>
              </aside>
              {sanitizeContentfulRichText(activeProject.fields.description)}
            </div>
          </ModalBody>
          {activeProject.fields.url && isValidUrl(activeProject.fields.url) && (
            <ModalFooter className="flex flex-col items-end py-2 ">
              <Link
                href={activeProject.fields.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View Live Site (opens in new tab)`}
              >
                <Button className="btn btn-sm btn-accent">Live Site</Button>
              </Link>
            </ModalFooter>
          )}
        </Modal>
      )}
    </>
  );
}
