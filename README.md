# Anigo

<p align="center">
   ![Expo](https://img.shields.io/badge/Expo-SDK--52-blue?logo=expo)
   ![React Native](https://img.shields.io/badge/React%20Native-0.76-brightgreen?logo=react)
   ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
   ![License](https://img.shields.io/github/license/doombladeoff/anigo?style=flat)
</p>

**AniGO** is a cross-platform mobile application developed with Expo and React Native, aiming to provide anime fans with a seamless experience to explore and enjoy their favorite anime content.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A mobile device with [Expo Go](https://expo.dev/client) installed or an emulator/simulator

### Installation

### Manual Fix for `kodikwrapper`

To ensure correct functionality with the latest version of the Kodik player, replace the contents of the following file:

```
node_modules/kodikwrapper/video-links.js
```

with this updated implementation:

<details>
<summary>Click to expand the replacement code</summary>

```javascript
"use strict";

const { VideoLinksError } = require("./errors");

const KODIK_PLAYER_DOMAIN = "kodik.info";
const KODIK_VIDEO_INFO_ENDPOINT = "/ftor";
const kodikPlayerLinkRegexp =
  /^(?<protocol>http[s]?:|)\/\/(?<host>[a-z0-9]+\.[a-z]+)\/(?<type>[a-z]+)\/(?<id>\d+)\/(?<hash>[0-9a-z]+)\/(?<quality>\d+p)(?:.*)$/;

class VideoLinks {
  static _crypt_step = null;

  static async parseLink({ extended: extendedData, link }) {
    if (!link) {
      throw new VideoLinksError({
        code: "parse-link-invalid",
        description: "link is not provided",
        data: { link },
      });
    }

    const normalizedLink = this.normalizeKodikLink(link);

    if (!kodikPlayerLinkRegexp.test(normalizedLink)) {
      throw new VideoLinksError({
        code: "parse-link-invalid",
        description: "link is not valid",
        data: { link },
      });
    }

    const groups = kodikPlayerLinkRegexp.exec(normalizedLink).groups;
    const { host, hash, id, quality, type } = groups;

    const result = { host, hash, id, quality, type };

    if (!extendedData) {
      return result;
    }

    const pageText = await fetch(normalizedLink).then((response) =>
      response.text()
    );

    const urlParamsMatch = pageText.match(
      /var\s+urlParams\s*=\s*'(?<urlParams>[^']+)';/
    );
    const translationMatch = pageText.match(
      /var\s+translationId\s*=\s*(?<id>\d+);\s*var\s+translationTitle\s*=\s*"(?<title>[^"]+)";/is
    );
    const skipButtonsMatch = pageText.match(
      /parseSkipButtons?\("(?<data>[^"]+)"\s*,\s*"(?<type>[^"]+)"\)/is
    );
    const playerSingleUrlMatch = pageText.match(
      /src="(?<link>\/assets\/js\/app\.player_single\.[a-z0-9]+\.js)"/is
    );

    let voiceover = [];
    const translationsBoxMatch = pageText.match(
      /<div\s+class="movie-translations-box">.*?<select>(.*?)<\/select>.*?<\/div>/is
    );

    if (translationsBoxMatch && translationsBoxMatch[1]) {
      const selectContent = translationsBoxMatch[1];
      const optionRegex =
        /<option\s+value="([^"]*)"[^>]*data-title="([^"]*)"[^>]*>.*?<\/option>/gis;
      let optionMatch;
      while ((optionMatch = optionRegex.exec(selectContent)) !== null) {
        voiceover.push({
          id: Number(optionMatch[1]),
          name: optionMatch[2],
        });
      }
    } else {
      console.log(
        "Не удалось найти div с классом 'movie-translations-box' или select внутри него."
      );
    }

    if (!urlParamsMatch?.groups?.urlParams) {
      throw new VideoLinksError({
        code: "parse-link-ex-invalid",
        description: "cannot get url params",
        data: { link, page: pageText },
      });
    }

    if (!translationMatch?.groups?.id || !translationMatch.groups.title) {
      throw new VideoLinksError({
        code: "parse-link-ex-invalid",
        description: "cannot get translation",
        data: { link, page: pageText },
      });
    }

    const urlParams = JSON.parse(urlParamsMatch.groups.urlParams);
    const translation = {
      id: +translationMatch.groups.id,
      title: translationMatch.groups.title,
    };
    const skipButtons = skipButtonsMatch?.groups
      ? { ...skipButtonsMatch.groups }
      : null;
    const playerSingleUrl = playerSingleUrlMatch?.groups?.link || null;

    return {
      ...result,
      ex: { urlParams, translation, skipButtons, playerSingleUrl, voiceover },
    };
  }

  static normalizeKodikLink(link) {
    if (link.startsWith("//")) {
      return `https:${link}`;
    } else if (link.startsWith("http")) {
      return link;
    } else {
      return new URL(link, `https://${KODIK_PLAYER_DOMAIN}`).toString();
    }
  }

  static async getActualVideoInfoEndpoint(link) {
    const pageText = await fetch(this.normalizeKodikLink(link)).then((res) =>
      res.text()
    );
    const b64strMatch = pageText.match(
      /type:"POST",url:atob\("(?<b64str>[^"]+)"\)/i
    );
    const b64str = b64strMatch?.groups?.b64str || "";
    return b64str ? atob(b64str) : "/kor";
  }

  static _convertChar(char, num) {
    const low = char === char.toLowerCase();
    const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charUpper = char.toUpperCase();

    if (alph.includes(charUpper)) {
      const ch = alph[(alph.indexOf(charUpper) + num) % alph.length];
      return low ? ch.toLowerCase() : ch;
    } else {
      return char;
    }
  }

  static _convert(string) {
    // Попытка расшифровать с использованием сохраненного шага (если есть)
    if (typeof VideoLinks._crypt_step === "number") {
      let cryptedUrl = "";
      for (let i = 0; i < string.length; i++) {
        cryptedUrl += this._convertChar(string[i], VideoLinks._crypt_step);
      }
      const padding = (4 - (cryptedUrl.length % 4)) % 4;
      cryptedUrl += "=".repeat(padding);
      try {
        const result = atob(cryptedUrl);
        if (result.includes("mp4:hls:manifest.m3u8")) {
          return result;
        }
      } catch (error) {
        // Ошибка декодирования с сохраненным шагом, продолжаем попытки
      }
    }

    // Перебор всех возможных ротаций
    for (let rot = 0; rot < 26; rot++) {
      let cryptedUrl = "";
      for (let i = 0; i < string.length; i++) {
        cryptedUrl += this._convertChar(string[i], rot);
      }

      const padding = (4 - (cryptedUrl.length % 4)) % 4;
      cryptedUrl += "=".repeat(padding);

      try {
        const result = atob(cryptedUrl);
        if (result.includes("mp4:hls:manifest.m3u8")) {
          VideoLinks._crypt_step = rot;
          return result;
        }
      } catch (error) {
        continue;
      }
    }
    throw new Error("Decryption failed");
  }

  static async getLinks({
    link,
    videoInfoEndpoint = KODIK_VIDEO_INFO_ENDPOINT,
  }) {
    const { host, quality, ...rest } = await VideoLinks.parseLink({ link });
    const url = new URL(
      `${videoInfoEndpoint}?${new URLSearchParams(rest).toString()}`,
      `https://${host}`
    );
    const response = await fetch(url);

    if (response.headers.get("content-type") !== "application/json") {
      throw new VideoLinksError({
        code: "get-links-invalid-response",
        description: "videoInfoResponse is not json",
        data: { videoInfoResponse: response },
      });
    }

    const jsonData = await response.json();

    if (!jsonData?.links || typeof jsonData.links !== "object") {
      throw new VideoLinksError({
        code: "get-links-invalid-response",
        description: "videoInfoJson.links is not object",
        data: { videoInfoResponse: response, videoInfoJson: jsonData },
      });
    }

    const decryptedLinks = {};

    for (const quality in jsonData.links) {
      decryptedLinks[quality] = [];

      for (const linkObj of jsonData.links[quality]) {
        try {
          const decrypted = this._convert(linkObj.src);
          decryptedLinks[quality].push({ ...linkObj, src: decrypted });
        } catch (e) {
          console.error(`Failed to decrypt link: ${linkObj.src}`);
          decryptedLinks[quality].push({ ...linkObj });
        }
      }
    }

    return decryptedLinks;
  }

  static parseSkipButtons = (data) => {
    return data.data.split(",").map((item) => {
      const [from, to] = item.split("-");
      return { from, to };
    });
  };
}

module.exports = {
  KODIK_PLAYER_DOMAIN,
  KODIK_VIDEO_INFO_ENDPOINT,
  VideoLinks,
  kodikPlayerLinkRegexp,
};
```

</details>

1. **Clone the repository:**

   ```bash
   git clone https://github.com/doombladeoff/anigo.git
   cd anigo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Make prebuild:**

   ```bash
   npx expo prebuild
   ```

   This will launch the Expo development tools in your browser.

4. **Run the app:**

   ```bash
   npx expo run:ios
   ```

---

## 📁 Project Structure

The project is organized as follows:

- `api/` - Handles API requests and integrations.
- `app/` - Main application components and screens.
- `assets/` - Images, fonts, and other static assets.
- `components/` - Reusable UI components.
- `constants/` - Application-wide constants.
- `context/` - React context providers for state management.
- `hooks/` - Custom React hooks.
- `interfaces/` - TypeScript interfaces and types.
- `lib/` - Utility libraries and helper functions.
- `scripts/` - Automation scripts.
- `utils/` - General utility functions.

---

## ⚙️ Configuration

The project includes an `example.env` file, indicating the use of environment variables for configuration.

1. **Create a `.env` file in the root directory:**

   ```bash
   cp example.env .env
   ```

2. **Populate the `.env` file with your configuration values.**
   Ensure you have the necessary API keys and endpoints if the application interacts with external services.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to Anigo:

1. **Fork the repository.**
2. **Create a new branch:**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make your changes and commit them:**

   ```bash
   git commit -m 'Add some feature'
   ```

4. **Push to the branch:**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a pull request.**

Please ensure your code adheres to the project's coding standards and includes relevant tests.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For questions or suggestions, feel free to reach out to the repository owner via [GitHub](https://github.com/doombladeoff).
