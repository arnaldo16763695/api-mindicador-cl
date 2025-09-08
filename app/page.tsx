import IndicatorTypeSelect from "@/components/IndicadorTypeSelect";
import MainIndicator from "@/components/MainIndicator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div>
        <h1>Dashboard Economico Chile (Mindicador)</h1>
      </div>

      <MainIndicator types={["dolar", "uf", "euro", "ipc"]} />

      <div className="flex flex-wrap gap-4">
            <div>
                <IndicatorTypeSelect value="dolar" />
            </div>

            <div>
              Card
            </div>
      </div>
    </div>
  );
}
