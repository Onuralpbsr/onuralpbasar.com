import Hero from "@/components/Hero";
import VideoGallery from "@/components/VideoGallery";
import References from "@/components/References";
import Services from "@/components/Services";
import Packages from "@/components/Packages";
import Equipment from "@/components/Equipment";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import {
  getVideos,
  getBrands,
  getServices,
  getEquipment,
  getContact,
  getBackgroundVideos,
} from "@/lib/content";

// Force dynamic rendering - disable caching so content updates appear immediately
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [videos, brands, services, equipment, contact, backgrounds] =
    await Promise.all([
      getVideos(),
      getBrands(),
      getServices(),
      getEquipment(),
      getContact(),
      getBackgroundVideos(),
    ]);

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ONR Dijital Medya Ajansı — Video Portföy",
    description: "Profesyonel video prodüksiyon çalışmaları",
    numberOfItems: videos.length,
    itemListElement: videos.map((video: { id: string; title: string; description: string; thumbnail: string; videoUrl: string }, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: video.title,
        description: video.description,
        thumbnailUrl: `https://onuralpbasar.com${video.thumbnail}`,
        contentUrl: `https://onuralpbasar.com${video.videoUrl}`,
        uploadDate: "2024-01-01",
        publisher: {
          "@type": "Organization",
          name: "ONR Dijital Medya Ajansı",
          url: "https://onuralpbasar.com",
        },
      },
    })),
  };

  return (
    <main className="min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <ScrollProgress />
      <AnimatedBackground />
      <Navigation />
      <Hero backgroundVideo={backgrounds.hero} />
      <VideoGallery videos={videos} backgroundVideo={backgrounds.gallery} />
      <References brands={brands} />
      <Services services={services} backgroundVideo={backgrounds.services} />
      <Packages />
      <Equipment
        equipment={equipment.items}
        categories={equipment.categories}
      />
      <Contact
        contactData={contact}
        backgroundVideo={backgrounds.contact}
      />
      <Footer contactData={contact} />
      <WhatsAppButton phone={contact.phone} />
    </main>
  );
}

