<div align="center">

# 📋 subtrack

**Online aboneliklerini takip etmek için minimalist bir web uygulaması.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-subtrack-5b4cf5?style=for-the-badge&logo=vercel&logoColor=white)](https://subtrack-fawn-sigma.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

</div>

---

## Özellikler

- 📦 Abonelik ekleme, düzenleme, silme
- 📅 Yenileme tarihi ve kalan gün takibi
- 📊 Aylık / yıllık harcama analizi
- 🗓 Yenileme takvimi
- 🔔 Tarayıcı bildirimleri — siteyi açtığında 3 gün, 1 gün ve gün içi uyarı verir (site kapalıyken bildirim gelmez)
- 🌙 Açık / koyu tema
- 💾 Veriler tarayıcıda saklanır (localStorage) — hesap gerekmez

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

## Test

```bash
npm test
```

## Deploy

Vercel'e bağlı GitHub reposuna her `git push`'ta otomatik deploy olur.

## Lisans

[MIT](./LICENSE) © 2026 Umut Gülden
