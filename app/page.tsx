import { HeroSection } from "@/components/layout/sections/hero";
import { IntroductionSection } from "@/components/layout/sections/introduction";
import { ShowcaseSection } from "@/components/layout/sections/showcase";
import { TutorialSection } from "@/components/layout/sections/tutorial";
import { FooterSection } from "@/components/layout/sections/footer";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FAQSection } from "@/components/layout/sections/faq";

export const metadata = {
  metadataBase: new URL('https://only-90s-rnb.com'),
  title: "Only 90s R&B - AI Music Generator",
  description: "Generate authentic 90s Black R&B music with AI. Choose from New Jack Swing, Hip-Hop Soul, Contemporary R&B and more classic genres.",
  openGraph: {
    type: "website",
    url: "https://only-90s-rnb.com",
    title: "Only 90s R&B - AI Music Generator",
    description: "Generate authentic 90s Black R&B music with AI. Choose from New Jack Swing, Hip-Hop Soul, Contemporary R&B and more classic genres.",
    images: [
      {
        url: "/hero-image-dark.jpeg",
        width: 1200,
        height: 630,
        alt: "Only 90s R&B Music Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://only-90s-rnb.com",
    title: "Only 90s R&B - AI Music Generator",
    description: "Generate authentic 90s Black R&B music with AI. Choose from New Jack Swing, Hip-Hop Soul, Contemporary R&B and more classic genres.",
    images: [
      "/hero-image-dark.jpeg",
    ],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroductionSection />
      <ShowcaseSection />
      <TutorialSection />
      <FeaturesSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
