import Hero from "@/components/Hero";
import VideoGallery from "@/components/VideoGallery";
import References from "@/components/References";
import Services from "@/components/Services";
import Equipment from "@/components/Equipment";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  getVideos,
  getBrands,
  getServices,
  getEquipment,
  getContact,
  getBackgroundVideos,
} from "@/lib/content";

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

  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <Navigation />
      <Hero backgroundVideo={backgrounds.hero} />
      <VideoGallery videos={videos} backgroundVideo={backgrounds.gallery} />
      <References brands={brands} />
      <Services services={services} backgroundVideo={backgrounds.services} />
      <Equipment
        equipment={equipment.items}
        categories={equipment.categories}
      />
      <Contact
        contactData={contact}
        backgroundVideo={backgrounds.contact}
      />
    </main>
  );
}

