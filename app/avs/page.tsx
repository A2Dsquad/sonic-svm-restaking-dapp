import { HoverBorderGradient } from "@/components/aceternity/hover-border-gradient";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { shortenAddress } from "@/lib/utils";

interface AVS {
  address: string;
  name: string;
  avatar: string;
  description: string;
  totalRestaked: string;
  numOperators: number;
  numStakers: number;
  link: string;
}

const avsData: (AVS | null)[] = [
  {
    address: "0x73984...ab43271",
    name: "Sentra Bridge",
    avatar: "/assets/sentra-bridge-logo.png",
    description:
      "Sentra Bridge is an ETH-Aptos bridge service powered by Zero-knowledge technology",
    totalRestaked: "$1,200",
    numOperators: 5,
    numStakers: 12,
    link: "https://sonic-svm-senbridge.netlify.app",
  },
  null,
  null,
];

function AVSCard({ avs }: { avs: AVS | null }) {
  if (!avs) {
    return (
      <div className="min-h-[300px] w-full h-full">
        <Card className="w-full h-full">
          <CardContent className="w-full h-full flex items-center justify-center">
            <p className="text-4xl font-bold text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <a href={avs.link} target="_blank" rel="noopener noreferrer">
      <HoverBorderGradient
        containerClassName="min-h-[250px] w-full h-full"
        className="w-full h-full"
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Avatar className="w-16 h-16">
                <img src={avs.avatar} alt={avs.name} />
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{avs.name}</h2>
                <div className="flex items-center text-muted-foreground">
                  <span>{shortenAddress(avs.address)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base text-left text-muted-foreground mb-4 line-clamp-3 pb-4">
              {avs.description}
            </p>
            <div className="flex flex-col gap-2 text-base pt-2">
              <div className="flex items-center justify-between w-full">
                <p className="text-muted-foreground">Total Restaked</p>
                <p className="font-semibold">{avs.totalRestaked}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-muted-foreground">Num. Operators</p>
                <p className="font-semibold">{avs.numOperators}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-muted-foreground">Num. Stakers</p>
                <p className="font-semibold">{avs.numStakers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </HoverBorderGradient>
    </a>
  );
}

export default function AVSPage() {
  return (
    <main
      className="container mx-auto p-4 pt-16"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avsData.map((avs, index) => (
          <AVSCard key={index.toString()} avs={avs} />
        ))}
      </div>
    </main>
  );
}
