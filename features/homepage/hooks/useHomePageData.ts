"use client"

import { articleApi } from "@/services/api/articleApi" // Assuming you have this
import { bannerApi } from "@/services/api/bannerApi" // Assuming you have this
import { productApi } from "@/services/api/productApi" // Assuming you have this
import { useEffect, useState } from "react"

export function useHomePageData() {
  const [bestSellingProducts, setBestSellingProducts] = useState([])
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [banners, setBanners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHomePageData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [productsData, articlesData, bannersData] = await Promise.all([
          productApi.getBestSellingProducts(),
          articleApi.getFeaturedArticles(),
          bannerApi.getHomeBanners(),
        ])

        setBestSellingProducts(productsData)
        setFeaturedArticles(articlesData)
        setBanners(bannersData)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomePageData()
  }, [])

  return {
    bestSellingProducts,
    featuredArticles,
    banners,
    isLoading,
    error,
  }
}
