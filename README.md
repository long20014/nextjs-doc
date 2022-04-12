# LandPress Template Docs

LandPress Template Docs is a template that enables developers quickly prepare their own docs page.

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

Wiki: https://wiki.linecorp.com/display/LINEFE/LandPress+Template+-+Docs

### Installation

```
$ yarn
```

### Usage
#### 1. Fetch LPCv2 project data

```bash
$ export PROJECT_URL=https://landpress-content.line-scdn.net/contents/projects/312 && printenv && yarn fetch-project
```

If you cannot fetch data, please copy all files from default-data folder to fetched-data folder and continue.

### 2. Build data tree

```bash
$ yarn build-data-tree
```

### 3. Prepare docs

```bash
$ yarn prepare-docs
```

### 4. Start project

```bash
$ yarn start
```

### Local Development

```
$ yarn start 
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

```
$ yarn serve
```

This command will start your build at localhost.

For locale build and serve, check here for more detail: https://docusaurus.io/docs/i18n/tutorial#deploy-your-site

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
