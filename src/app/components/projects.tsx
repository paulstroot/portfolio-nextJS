import { createClient } from "contentful";

import ProjectCarousel from "../projects/[slug]/components/ProjectCarousel";
import { ProjectQueryResult } from "../types";

const client = createClient({
  space: process.env.SPACE_ID!,
  accessToken: process.env.ACCESS_TOKEN!,
});

const getProjects = async (): Promise<ProjectQueryResult> => {
  const entries = await client.getEntries({
    content_type: "project",
  });
  return entries as unknown as ProjectQueryResult;
};

export default async function Projects() {
  const projects = await getProjects();
  const orderedProjects = projects.items
    .sort((a, b) => {
      const dateA = new Date(a.fields.order);
      const dateB = new Date(b.fields.order);
      return dateA.getTime() - dateB.getTime();
    })
    .filter((project) => project.fields.displayOnSite);
  return (
    <section
      id="projects"
      className="bg-gradient-to-b from-secondary to-background text-secondary-contrast py-8 my-0"
    >
      <div className="container m-auto ">
        <h2>Projects</h2>
        {/* <h3>How does one go about showcasing development work?</h3> */}
        {/* <p className="max-w-2xl">
          That’s a tough one. I mean, it’s not like looking at a really cool
          design and saying, “That’s super sweet!”. With development, as long as
          the page doesn’t give you a big 404 not found, or loading spinner of
          death, you kinda assume everything was built properly, right? Can I
          get by with just saying, “Trust me.”?
        </p> */}
      </div>

      <ProjectCarousel projects={orderedProjects} />
    </section>
  );
}
