import OmmPeersSlide from "./OmmPeersSlide"
import { WaccCalculation } from "./AccountingValuationSlides"

export function MarketValuationSlide({ kind }: { kind: "wacc" | "peers" }) {
  return kind === "wacc" ? <WaccCalculation /> : <OmmPeersSlide />
}
