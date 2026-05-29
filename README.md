# Liberty Website

This repository contains the source code for the official Liberty website - a static site built for the Liberty Gaming
community, which runs Halo: Custom Edition servers.

<div align="center">
  <a href="https://liberty-ce.net/">
    <img src="https://img.shields.io/badge/VISIT_WEBSITE-6ee7b7?style=for-the-badge&logo=github" 
         alt="Visit Website" 
         style="height: 60px;">
  </a>
</div>

---

## Dynamic Data Files

The following files are dynamically maintained and consumed by different parts of the site and build system:

| File                                           | Description                                                  | Used by                                                                                                                 |
|------------------------------------------------|--------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| [/data/maps.txt](/data/maps.txt)               | Dynamic map list used across the build system                | - [servers.html](/pages/servers.html)<br>- [build-maps.yml](.github/workflows/build-maps.yml) (GitHub Actions workflow) |
| [/data/members.txt](/data/members.txt)         | Active member list used across the site                      | -                                                                                                                       |
| [/data/race_stats.json](/data/race_stats.json) | Race statistics data file                                    | - [race_stats.html](/pages/race_stats.html)                                                                             |
| [/data/bans.txt](/data/bans.txt)               | Ban list used for server moderation (Discord + Halo Servers) | -                                                                                                                       |

---

## License

© 2026 Liberty Gaming - Halo CE. All rights reserved.

All content in this repository, including source code, images, and documentation, is proprietary. You may not copy,
redistribute, or use any assets without explicit prior written permission.

For the full legal terms, please read the [LICENSE](LICENSE) file.

Website developed by [Chalwk](https://github.com/Chalwk) for Liberty.

---