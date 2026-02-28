export const SITE = {
  name: "Meteory",
  url: import.meta.env.VITE_SITE_URL || "https://meteory-eg.com",
  ogImage: (import.meta.env.VITE_OG_IMAGE_URL as string | undefined) || "https://meteory-eg.com/og.jpg",
};
