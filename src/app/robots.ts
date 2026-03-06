import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/superadmin/",
    },
    sitemap: "https://tudominio.com/sitemap.xml",
  };
}
