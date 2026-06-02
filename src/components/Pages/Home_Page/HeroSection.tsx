import RevealHero from "@/src/components/Hero/RevealHero";

type Props = {
  beforeSrc?: string;
  afterSrc?: string;
};

export default function HeroSection(props: Props) {
  return <RevealHero {...props} />;
}
