import { CardWithHover, CardHeader, CardTitle } from "./ui/card";

export default function WhyIs() {
  const steps = [
    {
      number: 1,
      title: "Live Chess Academy with Expert Coaches",
    },
    {
      number: 2,
      title: "AI Training Tools",
    },
    {
      number: 3,
      title: "Tournaments",
    },
    {
      number: 4,
      title: "Classes",
    },
    {
      number:5,
      title:"Structure curriculum with periodiac progress review"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Why Azroute Is Unique
          </h2>
          {/* <p className="text-muted-foreground">
            A complete chess learning ecosystem in one place
          </p> */}
        </div>

        {/* ✅ 4 boxes */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">

          {steps.map((step) => (
            <CardWithHover key={step.number} className="text-center p-0">
              <CardHeader className="flex flex-col items-center p-6">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <CardTitle className="text-xl text-center">
                  {step.title}
                </CardTitle>
              </CardHeader>
            </CardWithHover>
          ))}
        </div>
      </div>
    </section>
  );
}