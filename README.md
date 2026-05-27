# Liberty Website

This repository contains the source code for the official Liberty website - a static site built for the Liberty Gaming
community, which runs Halo: Custom Edition servers.

[![VISIT WEBSITE](https://img.shields.io/badge/Visit-Website-6ee7b7?style=for-the-badge&logo=github)](https://chalwk.github.io/liberty-ce)

---

## Dynamic Data Files

The following files are dynamically maintained and consumed by different parts of the site and build system:

- [/data/maps.txt](/data/maps.txt)  
  Used by:
    - [servers.html](./pages/servers.html)
    - [build-maps.yml](.github/workflows/build-maps.yml) - GitHub Actions workflow

- [/data/members.txt](/data/members.txt) - Active member list used across the site.

- [/data/race_stats.json](/data/race_stats.json)  
  Used by:
    - [race_stats.html](./pages/race_stats.html)

- [/data/bans.txt](/data/bans.txt) - Ban list used for server moderation (Discord + Halo Servers)

---

## License

© 2026 Liberty Gaming - Halo CE. All rights reserved.

All content in this repository, including source code, images, and documentation, is proprietary. You may not copy,
redistribute, or use any assets without explicit prior written permission.

For the full legal terms, please read the [LICENSE](LICENSE) file.

Website developed by [Chalwk](https://github.com/Chalwk) for Liberty.

---