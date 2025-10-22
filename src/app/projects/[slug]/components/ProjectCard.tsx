"use client";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Button, Card, createTheme } from "flowbite-react";
import parse from "html-react-parser";
import Image from "next/image";
import { JSX } from "react";
import Pin from "../../../components/icons/pin.js";
import { ProjectItem } from "../../../types";

// bg-primary-200 border-none hover:bg-primary-100 text-background
const customCardTheme = createTheme({
  root: {
    base: "flex rounded-lg border border-none bg-light text-dark shadow-md ",
    children: "flex h-full flex-col justify-center gap-4 p-6",
    horizontal: {
      off: "flex-col",
      on: "flex-col md:max-w-xl md:flex-row",
    },
    href: "hover:bg-gray-100 dark:hover:bg-gray-700",
  },
  img: {
    base: "",
    horizontal: {
      off: "rounded-t-lg",
      on: "h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg",
    },
  },
});

function CardImage({
  desktopUrl,
  mobileUrl,
  featuredImage,
  alt,
}: {
  desktopUrl: string;
  mobileUrl: string;
  featuredImage: string;
  alt: string;
}): JSX.Element {
  return (
    <div className="relative ">
      {desktopUrl ? (
        <>
          <div className="slow-scroll desktop w-[66%] mb-[5%] mt-[5%] ml-[50%] mr-[50%] translate-x-[-58%] relative z-0 overflow-hidden">
            <Image
              src={`/images/desktop-frame.png`}
              width={253}
              height={210}
              alt="desktop-monitor"
              className="frame w-full relative z-[1]"
            />
            <Image
              className="screen w-full h-full absolute top-0 left-0 z-0 pt-[3.9%] pl-[3.4%] pr-[3.4%] pb-[27%] object-cover object-top"
              src={`https:${desktopUrl}`}
              width={270}
              height={2000}
              alt={alt}
            />
          </div>
          {mobileUrl && (
            <div className="slow-scroll mobile absolute w-[20%] z-[1] right-0 left-0 bottom-[7%] ml-[72%] overflow-hidden">
              <Image
                src={`/images/mobile-frame.png`}
                width={77}
                height={150}
                alt="mobile-frame"
                className="frame w-full relative z-[3] "
              />
              <Image
                className="screen w-full h-full absolute top-0 left-0 pt-[4%] pl-[8%] pr-[8%] pb-[8%] z-2 object-cover object-top"
                src={`https:${mobileUrl}`}
                width={77}
                height={1000}
                alt={alt}
              />
            </div>
          )}
        </>
      ) : featuredImage ? (
        <div className=" z-[1] right-0 left-0 overflow-hidden">
          <Image
            className="screen w-full h-full  top-0 left-0 z-2 object-cover object-top"
            src={`https:${featuredImage}`}
            width={380}
            height={300}
            alt={alt}
          />
        </div>
      ) : (
        <div>No Image</div>
      )}
    </div>
  );
}

export default function ProjectCard({
  project,
  showProject,
  isActive,
}: {
  project: ProjectItem;
  showProject: (data: ProjectItem) => void;
  isActive: boolean;
}) {
  const {
    slug,
    title,
    url,
    desktopLayout,
    mobileLayout,
    featuredImage,
    summary,
  } = project.fields;

  return (
    <div className="card project-card flex h-full" key={slug}>
      <Card
        className="group max-w-full overflow-hidden   transition-all duration-300 ease-in-out"
        theme={customCardTheme}
        renderImage={() => (
          <CardImage
            desktopUrl={desktopLayout?.fields.file.url}
            mobileUrl={mobileLayout?.fields.file.url}
            featuredImage={featuredImage?.fields.file.url}
            alt={title}
          />
        )}
      >
        {/* <Link href={`/projects/${slug}`}> */}
        <h3 className="tracking-tight" aria-hidden={!isActive}>
          {title}
        </h3>
        <div className="flex-1" aria-hidden={!isActive}>
          {url && (
            <div className="flex items-center cursor-pointer mb-2">
              <div className="w-5 mr-2 h-auto text-accent">
                <Pin />
              </div>
              <small className="hover:underline">{url}</small>
            </div>
          )}

          <div className="small font-normal">
            {parse(documentToHtmlString(summary))}
          </div>
        </div>

        <Button
          onClick={() => showProject(project)}
          className="btn btn-accent w-full mt-4"
          aria-hidden={!isActive}
          tab-index={isActive ? undefined : -1}
        >
          Read More
        </Button>
        {/* </Link> */}
      </Card>
    </div>
  );
}
