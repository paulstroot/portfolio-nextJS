import { createClient } from "contentful";
import Image from "next/image";
import {
  SkillCategoryItem,
  SkillCategoryQueryResult,
  SkillItem,
  SkillQueryResult,
} from "../types";

const getSkillCategories = async (): Promise<SkillCategoryQueryResult> => {
  const entries = await client.getEntries({
    content_type: "skillCategory",
  });
  return entries as unknown as SkillCategoryQueryResult;
};

const getAllSkills = async (): Promise<SkillQueryResult> => {
  const entries = await client.getEntries({
    content_type: "skills",
  });
  return entries as unknown as SkillQueryResult;
};

const client = createClient({
  space: process.env.SPACE_ID!,
  accessToken: process.env.ACCESS_TOKEN!,
});

export default async function Skills() {
  const categories = await getSkillCategories();
  const sortedCategories = categories.items.sort(
    (a, b) => a.fields.order - b.fields.order
  );
  const allSkills = await getAllSkills();

  return (
    <section
      id="skills"
      className="skills bg-primary text-primary-contrast py-8 my-0"
    >
      <div className="container m-auto">
        <h2>Skills</h2>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          {sortedCategories.map((cat: SkillCategoryItem, i: number) => {
            const theseSkills = allSkills.items
              .filter((s) => {
                return s.fields?.category.find(
                  (c) => c.fields?.name == cat.fields.name
                );
              })
              .sort((a, b) => a.fields.order - b.fields.order);

            return (
              <div
                key={"category-" + i}
                className="category-section  bg-primary-700 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-4">
                  {cat.fields.name}
                </h3>

                <ul className="flex flex-row flex-wrap gap-6">
                  {theseSkills.map((skill: SkillItem) => {
                    const { name, slug, icon } = skill.fields;
                    return (
                      <li key={slug} className="">
                        <div className="flex flex-col items-center justify-center text-xs text-center">
                          <Image
                            src={`https:${icon?.fields?.file?.url}`}
                            alt={icon?.fields?.file?.title ?? name}
                            width={32}
                            height={32}
                            className="w-8 h-8 object-contain mb-2"
                          />
                          {name}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
