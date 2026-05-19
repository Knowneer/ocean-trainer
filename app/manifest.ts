import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Океан Тренажер',
    short_name: 'Океан',
    description: 'Тренажер меню и стандартов сервиса ресторана',
    start_url: '/',
    display: 'standalone', // Именно это убирает адресную строку браузера
    background_color: '#ffffff',
    theme_color: '#0f172a', // Цвет верхней панели телефона (статус-бара)
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
