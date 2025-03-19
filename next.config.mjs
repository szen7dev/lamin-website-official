let userConfig = undefined
try {
  userConfig = await import("./v0-user-next.config")
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  images: {
    domains: [
      "images.glints.com",
      "glints-dashboard.oss-ap-southeast-1.aliyuncs.com",
      "res.cloudinary.com",
      "cloudinary.com",
      "ui-avatars.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "randomuser.me",
      "picsum.photos",
      "loremflickr.com",
      "placekitten.com",
      "placeimg.com",
      "via.placeholder.com",
      "source.unsplash.com",
      "images.unsplash.com",
      "avatars.githubusercontent.com",
      "cdn.pixabay.com",
      "media.istockphoto.com",
      "i.imgur.com",
      "imgur.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (typeof nextConfig[key] === "object" && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
