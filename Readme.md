# subtrack

Online aboneliklerini takip etmek için minimalist bir web uygulaması.

## Özellikler

- Abonelik ekleme, düzenleme, silme
- Yenileme tarihi ve kalan gün takibi
- Aylık / yıllık harcama analizi
- Yenileme takvimi
- Tarayıcı bildirimleri — siteyi açtığında 3 gün, 1 gün ve gün içi uyarı verir (site kapalıyken bildirim gelmez)
- Açık / koyu tema
- Veriler tarayıcıda saklanır (localStorage) — hesap gerekmez

## Tech Stack

- [Next.js 16](https://nextjs.org)
- TypeScript
- Chart.js
- Service Worker (Web Push API)

## Kurulum

```bash
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.
