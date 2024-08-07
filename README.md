<p align="center">
  <img src="docs/images/spoiler-shield-ai.png" width="100" />
</p>
<p align="center">
    <h1 align="center">SPOILER-SHIELD-AI</h1>
</p>
<p align="center">
    <em>Enjoy your favorite content without the fear of spoilers!</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/LuloDev/spoiler-shield-ai?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/LuloDev/spoiler-shield-ai?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/LuloDev/spoiler-shield-ai?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/LuloDev/spoiler-shield-ai?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
	<img src="https://img.shields.io/badge/Svelte-FF3E00.svg?style=flat&logo=Svelte&logoColor=white" alt="Svelte">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white" alt="Axios">
</p>
<hr>

## 🔗 Quick Links

> - [📍 Overview](#-overview)
> - [🚀 Getting Started](#-getting-started)
> - [📦 Features](#-features)
>   - [⚙️ Installation](#️-installation)
>   - [🤖 Running spoiler-shield-ai](#-running-spoiler-shield-ai)
> - [🛠 Project Roadmap](#-project-roadmap)
> - [🤝 Contributing](#-contributing)
> - [📄 License](#-license)
> - [👏 Acknowledgments](#-acknowledgments)

---

## 📍 Overview

"Spoiler Shield AI" is a chrome extension designed to detect and hide spoilers on the web using advanced AI technologies. The project leverages the Vercel AI package to make calls to various AI services, including OpenAI, Anthropic, and Ollama. This ensures robust and accurate spoiler detection across different platforms, particularly focusing on YouTube, TV shows and movies.

---

## 🚀 Getting Started

### Compile the extension yourself

**_Requirements_**

Ensure you have the following dependencies installed on your system:

- **node**: `version 20`

#### ⚙️ Installation

1. Clone the spoiler-shield-ai repository:

```sh
git clone https://github.com/LuloDev/spoiler-shield-ai.git
```

2. Change to the project directory:

```sh
cd spoiler-shield-ai
```

3. Install the dependencies:

```sh
pnpm install
```

#### 🤖 Running spoiler-shield-ai

Use the following command to run spoiler-shield-ai:

```sh
pnpm run build
```

### Upload Extension to Chrome (Developer Mode)

To test your "Spoiler Shield AI" extension in Chrome's Developer Mode, follow these steps:

This will generate the necessary files in the [`dist`]

1. **Open Chrome Extensions Page**:
   Open Google Chrome and navigate to the Extensions page by entering the following URL in the address bar:

   ```sh
   chrome://extensions/
   ```

2. **Enable Developer Mode**:
   In the top right corner of the Extensions page, toggle the "Developer mode" switch to enable it.

3. **Load Unpacked Extension**:

   - Click on the "Load unpacked" button.
   - In the file dialog that opens, navigate to the [`dist`]directory where your extension files are located.
   - Select the [`dist`]directory and click "Open".

4. **Test Extension**:
   The extension should now be loaded in Chrome. You can test its functionality by navigating to websites and verifying that spoilers are detected and hidden as expected.

---

## 📦 Features

|     | Feature           | Description                                                                                                                                                                                                                                                |
| --- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⚙️  | **Architecture**  | The project follows a modular architecture using components in Svelte with TypeScript for strong typing. It utilizes Tailwind CSS for styling and Axios for API interactions, enhancing user experience and code maintainability.                          |
| 🔩  | **Code Quality**  | Codebase maintains good quality with TypeScript support, clear component structure, and adherence to coding standards. Linting tools like svelte-check and postcss.config.js contribute to consistent coding practices.                                    |
| 📄  | **Documentation** | Documentation is well-maintained with configuration files like package.json, tsconfig.json, and postcss.config.js explained. README provides an overview of project setup and usage. Inline code comments help in understanding specific functionality.    |
| 🔌  | **Integrations**  | Key integrations include vite. External dependencies like axios for API requests, shadcn-svelte, Tailwind CSS for styling are integrated for enhanced project capabilities.                                                                                |
| 🧩  | **Modularity**    | The codebase is highly modular with components organized in separate directories. Dependencies management in package.json and TypeScript usage promotes code reusability and easier maintenance.                                                           |
| ⚡️ | **Performance**   | Performance can be optimized further by considering bundle size reduction techniques, lazy loading, and efficient data fetching strategies. Utilizing Vite for fast builds and optimizations can improve overall performance.                              |
| 🛡️  | **Security**      | Security measures like data validation using Zod, secure API handling with Axios, and maintaining secure coding practices with TypeScript contribute to data protection. Access control mechanisms can be further enhanced based on specific requirements. |
| 📦  | **Dependencies**  | Key external libraries and dependencies include Tailwind CSS for styling, Axios for API requests, and Zod for data validation. These dependencies play crucial roles in the functionality and user experience of the project.                              |
| 🚀  | **Scalability**   | The project's scalability is supported by the modularity of the codebase and the use of modern tools like Vite and SvelteKit. Adopting microservices architecture and implementing caching mechanisms can further scale the project effectively.           |

---

## 🛠 Project Roadmap

- [x] `► Block Youtube`
- [x] `► Block TV shows`
- [x] `► Block Movies`
- [ ] `► Customize Prompt Configuration`

---

## 🤝 Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github.com/LuloDev/spoiler-shield-ai/pulls)**: Review open PRs, and submit your own PRs.

- **[Report Issues](https://github.com/LuloDev/spoiler-shield-ai/issues)**: Submit bugs found or log feature requests for Spoiler-shield-ai.

<details closed>
    <summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone https://github.com/LuloDev/spoiler-shield-ai.git
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

## 📄 License

This project is protected under the [MIT](https://choosealicense.com/licenses/mit/) License. For more details, refer to the [LICENSE](https://github.com/LuloDev/spoiler-shield-ai/blob/main/LICENSE) file.

---

## 👏 Acknowledgments

- [Hackaton vercel 2024](https://github.com/midudev/hackaton-vercel-2024)

[**Return**](#-overview)

---
