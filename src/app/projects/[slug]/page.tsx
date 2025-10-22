import { ProjectItem } from "@/app/types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { createClient } from "contentful";
import type { Metadata } from "next";
import Image from "next/image";

const client = createClient({
  space: process.env.SPACE_ID!,
  accessToken: process.env.ACCESS_TOKEN!,
});

export async function generateStaticParams() {
  const queryOptions = {
    content_type: "project",
    select: "fields.slug",
  };

  const projects = await client.getEntries(queryOptions);

  return projects.items.map((article) => ({
    slug: article.fields.slug,
  }));
}

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const fetchProjectData = async (slug: string): Promise<ProjectItem> => {
  const queryOptions = {
    content_type: "project",
    "fields.slug[match]": slug,
  };

  const queryResult = await client.getEntries(queryOptions);

  return queryResult.items[0] as unknown as ProjectItem;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const activeProject = await fetchProjectData(slug);
  return {
    title: `${activeProject.fields.title} | Paul Stroot`,
    description: documentToPlainTextString(activeProject.fields.summary),
  };
}

export default async function ProjectPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const activeProject = await fetchProjectData(slug);
  const { title, description } = activeProject.fields;

  return (
    <main className="min-h-screen p-24 flex justify-center bg-background text-background-contrast">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold leading-tight tracking-tight mb-4">
          {title}
        </h1>

        <Image
          src={`https:${activeProject.fields.featuredImage.fields.file.url}`}
          width={672}
          height={672}
          alt={activeProject.fields.title}
          className="w-full h-auto mb-8"
        />

        <div className="[&>p]:mb-8 [&>h3]:font-extrabold">
          {documentToReactComponents(description)}
        </div>
      </div>
    </main>
  );
}
