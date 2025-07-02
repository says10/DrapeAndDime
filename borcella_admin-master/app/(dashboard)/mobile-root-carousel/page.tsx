import MobileRootCarouselForm from "@/components/MobileRootCarouselForm";

export default function MobileRootCarouselPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mobile Root Carousel (Mobile Only)</h1>
      <p className="text-sm text-blue-600 mb-6">This carousel is for the <b>mobile version of the store root page only</b>. You can upload multiple images or videos to create a vertical carousel for mobile users.</p>
      <MobileRootCarouselForm />
    </div>
  );
} 