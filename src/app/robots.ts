import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/superadmin/", "/api/"],
    },
    sitemap: "https://exxclusiveservicex.vercel.app/sitemap.xml",
  };
}
