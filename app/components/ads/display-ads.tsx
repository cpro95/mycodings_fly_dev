import { useEffect } from "react";

const DisplayAds = () => {
  useEffect(() => {
    const pushAd = () => {
      try {
        // @ts-ignore
        const adsbygoogle = window.adsbygoogle;
        adsbygoogle.push({});
      } catch (e) {
        console.error(e);
      }
    };

    let interval = setInterval(() => {
      // Check if Adsense script is loaded every 300ms
      // @ts-ignore
      if (window.adsbygoogle) {
        pushAd();
        // clear the interval once the ad is pushed so that function isn't called indefinitely
        clearInterval(interval);
      }
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-7748316956330968"
      data-ad-slot="3545458418"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default DisplayAds;
