# Software City's Modded-Minecraft Launcher

> Developed by [Davis_Software](https://github.com/Davis-Software) &copy; 2022

![GitHub release (latest by date)](https://img.shields.io/github/v/release/Davis-Software/swc_mclauncher?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues-raw/Davis-Software/swc_mclauncher?style=for-the-badge)
![GitHub closed issues](https://img.shields.io/github/issues-closed/Davis-Software/swc_mclauncher?style=for-the-badge)
![GitHub all releases](https://img.shields.io/github/downloads/Davis-Software/swc_mclauncher/total?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/Davis-Software/swc_mclauncher?style=for-the-badge)

> The Recode: Now with a new awesome looking UI and microsoft account support!

[TOC]

# Image Preview
![image](.github/img/img_0.png)
![image](.github/img/img_1.png)

# Features

* ❌ Not planned
* ⏳ Planning
* 🛠 Work in progress
* ✅ Finished

Feature|Description|State
---|---|---
Bundled Java|Java installation bundled with the launcher (Java 8 and 16)|⏳
Minecraft Account Support|Support for Minecraft account logins|✅
Mojang Account Support|Support for Mojang account logins|❌
Session Handling|Store and refresh Microsoft login sessions as needed|✅
Minecraft Vanilla|Launch Minecraft Vanilla|✅
Minecraft Forge|Launch Minecraft Forge (only custom SWC modpacks)|✅
Support for Windows|Support for Windows|✅
Support for Linux|Support for Linux|🛠
Support for MacOS|Support for MacOS|🛠
Configurable|Most minecraft and java launch options are accessible|✅
Easy Account Switching|Switch between multiple accounts easily|✅
Multiple Instances|Launch multiple instances of Minecraft|✅


# Installation
* Download an installer
    * Go to the [releases](https://github.com/Davis-Software/swc_mclauncher/releases) page and download an installer compatible with your OS
* Compile yourself:
    * Clone the repository `git clone https://github.com/Davis-Software/swc_mclauncher.git`
    * Enter directory `cd swc_mclauncher-master`
    * Install required packages `npm install` and `npm install --save-dev`
    * Install required packages for the react frontend `cd front_src`, `npm install` and `npm install --save-dev`
    * Compile the frontend `npm run build`
    * Go back to the root directory `cd ..`
    * Run the application to check if it's working `npm start`
    * Compile the application into an installer `npm run dist` (for win64)
    * Consult `package.json` and `front_src/package.json` for more commands & info
