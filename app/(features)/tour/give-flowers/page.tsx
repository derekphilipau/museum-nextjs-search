import { GiveFlowersCard } from '@/components/feature/give-flowers-card';

export default async function Page() {
  return (
    <>
      <section className="container pt-6 pb-8">
        <h3 className="mb-2 text-xl font-extrabold leading-tight tracking-tighter sm:text-xl md:text-3xl lg:text-4xl">
          The American Galleries
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
          <a href="#" className="text-indigo-600">To Give Flowers</a>
          <a href="/tour/black-white" className="">The Black & White Show</a>
          <a href="#" className="">Surface Tension</a>
          <a href="#" className="">Several Seats</a>
          <a href="#" className="">A Quiet Place</a>
          <a href="#" className="">Can I Get a Witness</a>
          <a href="#" className="">Trouble the Water</a>
          <a href="#" className="">Fantasies & Futures</a>
        </div>
        
      </section>
      <section className="container pt-6 pb-8">
        <h3 className="text-xl font-light italic leading-tight tracking-tighter sm:text-xl md:text-3xl lg:text-4xl">
          from our Mother&apos;s gardens
        </h3>
        <h1 className="mt-2 text-3xl font-extrabold uppercase leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          &quot;To Give Flowers&quot;
        </h1>
      </section>
      <section className="grid content-center gap-6 bg-[url('/img/tour/bg2.jpg')] py-32 px-6 sm:grid-cols-3 lg:grid-cols-4">
        <div className="">
          <GiveFlowersCard
            id={2090}
            title="Woman with Bouquet"
            date="1940"
            artistDate="American, 1887-1948"
            artist="Laura Wheeler Waring"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/CUR.2016.2.JPG"
            isLight={true}
            bgColor="bg-[#975D33]"
          />
        </div>
        <div className="">
          <GiveFlowersCard
            id={2090}
            title="Flowers on a Japanese Tray on a Mahogany Table"
            date="1879"
            artistDate="American, 1835-1910"
            artist="John La Farge"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/2001.47.1_SL1.jpg"
            isLight={true}
            bgColor="bg-[#975D33]"
          />
        </div>
        <div className="">
          <GiveFlowersCard
            id={2090}
            title="Summer Clouds and Flowers"
            date="1942"
            artistDate="American, 1877-1943"
            artist="Marsden Hartley"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/1992.11.19_SL1.jpg"
            isLight={true}
            bgColor="bg-[#975D33]"
          />
        </div>
        <div className="">
          <GiveFlowersCard
            id={26}
            title="Meadow Flowers (Golden Rod and Wild Aster)"
            date="1892"
            artistDate="American, 1853-1902"
            artist="John Henry Twachtman"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/13.36_edited_SL1.jpg"
            isLight={true}
            bgColor="bg-[#975D33]"
          />
        </div>
        <div className="">
          <GiveFlowersCard
            id={102325}
            title="Vase"
            date="ca. 1900"
            artistDate="American, 1857-1918"
            artist="George E. Ohr"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/76.64_detail_PS6.jpg"
            isLight={true}
            bgColor="bg-[#975D33]"
          />
        </div>
        <div className="">
          <GiveFlowersCard
            id={767}
            title="Urn or Pot"
            date="ca. 1880"
            artistDate="American, 1817-1882"
            artist="Solomon Bell"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/44.196.13.jpg"
            isLight={true}
            bgColor="bg-[#975D33]"
          />
        </div>
      </section>
      <section className="gap-6 bg-[#1D4774] py-32 px-6 sm:flex sm:items-center sm:justify-center">
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={2889}
            title="Poppies"
            date="1882"
            artistDate="American, 1846-1888"
            artist="Elizabeth Boott Duveneck"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/2005.54.1_2005.54.2_2005.54.3_2005.54.4_2005.54.5_PS2.jpg"
            isLight={true}
          />
        </div>
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={474}
            title="Flowers in a Vase (Zinnias)"
            date="ca. 1910-1913"
            artistDate="American, 1858-1924"
            artist="Maurice Brazil Prendergast"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/39.53_SL1.jpg"
            isLight={true}
          />
        </div>
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={2096}
            title="Ram's Head, White Hollyhock-Hills"
            date="1935"
            artistDate="American, 1887-1986"
            artist="Georgia O'Keeffe"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/1992.11.28_PS11.jpg"
            isLight={true}
          />
        </div>
      </section>
      <section className="gap-4 bg-[url('/img/tour/bg1.jpg')] py-32 px-6 sm:flex sm:items-center sm:justify-center">
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={2090}
            title="Woman with Bouquet"
            date="1940"
            artistDate="American, 1887-1948"
            artist="Laura Wheeler Waring"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/CUR.2016.2.JPG"
            isLight={true}
            bgColor="bg-[#7F8C9B]"
          />
        </div>
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={2090}
            title="Flowers on a Japanese Tray on a Mahogany Table"
            date="1879"
            artistDate="American, 1835-1910"
            artist="John La Farge"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/2001.47.1_SL1.jpg"
            isLight={true}
            bgColor="bg-[#7F8C9B]"
          />
        </div>
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={2090}
            title="Summer Clouds and Flowers"
            date="1942"
            artistDate="American, 1877-1943"
            artist="Marsden Hartley"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/1992.11.19_SL1.jpg"
            isLight={true}
            bgColor="bg-[#7F8C9B]"
          />
        </div>
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={26}
            title="Meadow Flowers (Golden Rod and Wild Aster)"
            date="1892"
            artistDate="American, 1853-1902"
            artist="John Henry Twachtman"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/13.36_edited_SL1.jpg"
            isLight={true}
            bgColor="bg-[#7F8C9B]"
          />
        </div>
      </section>
      <section className="gap-6 bg-[#8C884D] py-32 px-6 sm:flex sm:items-center sm:justify-center">
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={2889}
            title="Poppies"
            date="1882"
            artistDate="American, 1846-1888"
            artist="Elizabeth Boott Duveneck"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/2005.54.1_2005.54.2_2005.54.3_2005.54.4_2005.54.5_PS2.jpg"
            isLight={true}
          />
        </div>
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={474}
            title="Flowers in a Vase (Zinnias)"
            date="ca. 1910-1913"
            artistDate="American, 1858-1924"
            artist="Maurice Brazil Prendergast"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/39.53_SL1.jpg"
            isLight={true}
          />
        </div>
        <div className="py-6 sm:py-0">
          <GiveFlowersCard
            id={2096}
            title="Ram's Head, White Hollyhock-Hills"
            date="1935"
            artistDate="American, 1887-1986"
            artist="Georgia O'Keeffe"
            imgSrc="https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/1992.11.28_PS11.jpg"
            isLight={true}
          />
        </div>
      </section>
    </>
  );
}
