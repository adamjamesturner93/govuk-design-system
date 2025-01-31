# GOV.UK Design System

**One place for service teams to find styles, components and patterns for
designing government services.**

## Government Frontend Survey 2021 📝

We want to find out about which frontend technologies and resources you use to support your project.

[We've run the Government Frontend survey about every 2 years since 2016](https://technology.blog.gov.uk/2019/03/18/learn-the-results-from-the-cross-government-frontend-technology-survey/) and it helps us understand how to best support service teams across government.

We'll share what we learn along with a comparison of our results.

[Fill in the Government Frontend survey by 30 June 2021](https://surveys.publishing.service.gov.uk/s/2021_GovernmentFrontend_Survey/)

This survey is open to anyone that does frontend in government or the public sector, even if it's not their main role, so please share with your wider communities if you can 🙂

## Run locally

You'll need [Git](https://help.github.com/articles/set-up-git/) and [Node.js](https://nodejs.org/en/) installed to get this project running.

Note: You will need the [active LTS (Long-term support)](https://github.com/nodejs/Release#release-schedule) Node.js version for this project (as specified in [.nvmrc](./.nvmrc))

### Fork repository (optional)
If you're an external contributor make sure to [fork this project first](https://help.github.com/articles/fork-a-repo/)

### Clone repository
```
git clone git@github.com:alphagov/govuk-design-system.git # or clone your own fork

cd govuk-design-system
```

### Using nvm (optional)
If you work across multiple Node.js projects there's a good chance they require different Node.js and npm versions.

To enable this we use [nvm (Node Version Manager)](https://github.com/creationix/nvm) to switch between versions easily.

1. [install nvm](https://github.com/creationix/nvm#installation)
2. Run `nvm install` in the project directory (this will use [.nvmrc](./.nvmrc))

### Install npm dependencies
```
npm install
```

### Start a local server
This will build sources, serve pages and watch for changes.
```
npm start
```

## Build
Build `./src` to `./deploy/public`
```
npm run build
```

## Run the Sass linter

We are using the tool [sass-lint][sass-lint] to lint the Sass files in
`source/stylesheets`. You can run the linter from command line by running:

```
npm run lint
```

[sass-lint]: https://github.com/sasstools/sass-lint

## GOV.UK Frontend packages

Design System consumes the [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) package via [NPM](https://www.npmjs.com/).
This is defined in the [package.json](package.json) file.

--------------------

## Continuous integration

When changes are pushed to GitHub, [Github Actions][github-actions] will:

- run the tests
- lint the Sass stylesheets in `source/stylesheets`
- run the `npm run build` command to ensure that the site can be generated

If any of these fail, this will be reported in the GitHub status checks
interface.

[github-actions]: https://github.com/alphagov/govuk-design-system/actions

## Deployment

- [How the Design System is deployed to production](docs/deployment/production.md)
- [How branch and PR previews are deployed](docs/deployment/previews.md)
