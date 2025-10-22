import Image from "next/image";

export default async function Profile() {
  return (
    <section
      id="profile"
      className="bg-gradient-to-t from-secondary to-background text-secondary-contrast profile py-8 my-0"
    >
      <div className="container m-auto ">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 ">
            <Image
              src={"/images/Paul_image@2x.png"}
              width={510}
              height={510}
              loading="lazy"
              alt=""
              className="max-w-full h-auto w-sm mx-auto"
              aria-hidden="true"
            />
          </div>
          <div className="w-full md:w-1/2 prose">
            <h2>About Paul</h2>
            <p>
              Born and raised in Wisconsin but a proud Minnesotan for the past
              three decades, I&apos;ve made South Minneapolis my home. As a
              contract developer who&apos;s been writing code since, well,
              forever, I&apos;ve had the privilege of working on diverse
              projects that keep every day interesting and challenging.
            </p>

            <p>
              Life&apos;s too short not to have hobbies that keep your hands
              busy and your mind engaged. When not coding, you can probably find
              me doing one of the following:
            </p>
            <ul>
              <li>Snowboarding</li>
              <li>Biking</li>
              <li>Bagel Baking</li>
              <li>Crafting Crochet Flora</li>
              <li>Parenting a rad {sawyersAge()} year old.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
const sawyersAge = () => {
  const birthDateString = "2015-09-11";
  const today = new Date();
  const birthDate = new Date(birthDateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the birthday hasn't occurred yet this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
