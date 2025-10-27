import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import { fetchMemories, getPublicIdFromUrl, getFormatFromUrl } from "../../utils/fetchMemories";
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";
import type { ImageProps } from "../../utils/types";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560,q_auto:best/${currentPhoto.public_id}.${currentPhoto.format}`;

  return (
    <>
      <Head>
        <title>{currentPhoto.title ? `${currentPhoto.title} - Cursor Kenya Memories` : 'Cursor Kenya - Memories'}</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
        {currentPhoto.title && <meta property="og:title" content={currentPhoto.title} />}
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  // Fetch memories from Supabase
  const memories = await fetchMemories();
  
  let reducedResults: ImageProps[] = [];
  let i = 0;
  for (let memory of memories) {
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
      });
      i++;
    }
  }

  const currentPhoto = reducedResults.find(
    (img) => img.id === Number(context.params.photoId),
  );
  
  if (!currentPhoto) {
    return {
      notFound: true,
    };
  }
  
  currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto);

  return {
    props: {
      currentPhoto: currentPhoto,
    },
    revalidate: 60,
  };
};

export async function getStaticPaths() {
  // Fetch memories from Supabase
  const memories = await fetchMemories();
  
  let imageCount = 0;
  for (let memory of memories) {
    imageCount += memory.images.length;
  }

  let fullPaths = [];
  for (let i = 0; i < imageCount; i++) {
    fullPaths.push({ params: { photoId: i.toString() } });
  }

  return {
    paths: fullPaths,
    fallback: "blocking",
  };
}
