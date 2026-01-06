import { Button } from "flowbite-react";

export default async function DesignSystem() {
  return (
    <main id="main" className="flex-1">
      <section className="">
        <div className="container">
          <h1>Headlines</h1>
          <h2>This is an H2 Headline</h2>
          <h3>This is an H3 Headline</h3>
          <h4>This is an H4 Headline</h4>
          <h5>This is an H5 Headline</h5>
          <h6>This is an H6 Headline</h6>
          <div className="md:grid md:grid-cols-2 md:gap-20">
            <div className="">
              <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
                faucibus ex sapien vitae pellentesque sem placerat. In id cursus
                mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
                urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
                egestas. Iaculis massa nisl malesuada lacinia integer nunc
                posuere. Ut hendrerit semper vel class aptent taciti sociosqu.
                Ad litora torquent per conubia nostra inceptos himenaeos.
              </p>
            </div>
            <div>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
              faucibus ex sapien vitae pellentesque sem placerat. In id cursus
              mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
              urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
              egestas. Iaculis massa nisl malesuada lacinia integer nunc
              posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
              litora torquent per conubia nostra inceptos himenaeos.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-500">
        <div className="container">
          <h1>Buttons</h1>

          <div className="flex flex-wrap gap-2 my-4">
            <Button>Default </Button>
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="accent">Accent</Button>
            <Button color="dark">Dark</Button>
            <Button color="light">Light</Button>

            <Button color="success">Success</Button>
            <Button color="info">Info</Button>
            <Button color="warning">Warning</Button>
            <Button color="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-2 my-4">
            <Button pill>Default</Button>
            <Button color="primary" pill>
              Primary
            </Button>
            <Button color="secondary" pill>
              Secondary
            </Button>
            <Button color="accent" pill>
              Accent
            </Button>
            <Button color="dark" pill>
              Dark
            </Button>
            <Button color="light" pill>
              Light
            </Button>

            <Button color="success" pill>
              Success
            </Button>
            <Button color="info" pill>
              Info
            </Button>
            <Button color="warning" pill>
              Warning
            </Button>
            <Button color="danger" pill>
              Danger
            </Button>
          </div>
          <div className="flex flex-wrap items-start gap-2 my-4">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Base</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra large</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
