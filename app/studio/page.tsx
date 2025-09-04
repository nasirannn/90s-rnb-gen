import { StudioSection } from "@/components/layout/sections/studio";
import { FooterSection } from "@/components/layout/sections/footer";

export const metadata = {
  title: "Music Studio - Only 90s R&B",
  description: "Generate authentic 90s Black R&B music with AI. Customize your music with custom options and create professional-quality tracks.",
};

export default function StudioPage() {
  return (
    <>
      <StudioSection />
      <FooterSection />
    </>
  );
}
