import React, { useEffect } from 'react'

const ContentsAds = () => {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle
        // console.log({ adsbygoogle })
        adsbygoogle.push({})
      } catch (e) {
        console.error(e)
      }
    }

    let interval = setInterval(() => {
      // Check if Adsense script is loaded every 300ms
      if (window.adsbygoogle) {
        pushAd()
        // clear the interval once the ad is pushed so that function isn't called indefinitely
        clearInterval(interval)
      }
    }, 300)

    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <ins
      className='adsbygoogle'
      style={{
        display: 'inline-block',
        textAlign: 'center',
      }}
      data-ad-layout='in-article'
      data-ad-format='fluid'
      data-ad-client='ca-pub-7748316956330968'
      data-ad-slot='2827520535'
    ></ins>
  )
}

export default ContentsAds
