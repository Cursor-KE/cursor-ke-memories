import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import UploadModal from "../components/UploadModal";
import { fetchMemories, getPublicIdFromUrl, getFormatFromUrl } from "../utils/fetchMemories";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Cursor Kenya - Memories</title>
        <meta
          property="og:image"
          content="https://hackimage.vercel.app/cursor-community-avatar.png"
        />
        <meta
          name="twitter:image"
          content="https://hackimage.vercel.app/cursor-community-avatar.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-black text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
            <Image
              src="/nai.png"
              alt="Nairobi Skyline"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 50vw"
            />
            <div className="relative z-10 flex flex-col items-center gap-4 px-6 pb-16">
              <Logo />
              <h1 className="mt-8 mb-4 text-base font-bold uppercase tracking-widest">
                Cursor Kenya Memories
              </h1>
              <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
                Relive the amazing moments from Cursor Kenya events and meetups!
              </p>
            </div>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl, title, is_black_white }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <div className="relative">
                <Image
                  alt={title || "Cursor Kenya Memory"}
                  className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720,q_auto:best${is_black_white ? ',e_grayscale' : ''}/${public_id}.${format}`}
                  width={720}
                  height={480}
                  sizes="(max-width: 640px) 100vw,
                    (max-width: 1280px) 50vw,
                    (max-width: 1536px) 33vw,
                    25vw"
                />
                {/* Title overlay - always visible with subtle background */}
                <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3">
                  <p className="text-sm font-semibold text-white line-clamp-2 drop-shadow-lg">
                    {title || "Untitled Memory"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Made with ❤️ for the Cursor Kenya community
      </footer>

      {/* Upload Button */}
      <button
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-8 right-8 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition"
        title="Upload your memory"
      >
        <Icon icon="mdi:plus" className="h-6 w-6" />
      </button>

      {/* Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </>
  );
};

export default Home;

export async function getStaticProps() {
  // Fetch memories from Supabase
  const memories = await fetchMemories();
  
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let memory of memories) {
    // Process each image URL in the images array
    for (let imageUrl of memory.images) {
      const public_id = getPublicIdFromUrl(imageUrl);
      const format = getFormatFromUrl(imageUrl);
      
      reducedResults.push({
        id: i,
        height: "480",
        width: "720",
        public_id: public_id,
        format: format,
        title: memory.title, // Include the memory title
        is_black_white: memory.is_black_white, // Include black and white flag
      });
      i++;
    }
  }

  // Generate blur placeholders for all images
  const blurImagePromises = reducedResults.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
