# Pozwolenie
A program supporting learning for the Polish examination for a permit to possess a firearm for collecting purposes conducted by the WPA police departments.

## Prerequites
For developing you should have [node.js](https://nodejs.org/en/download/current) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/) installed.  
For install packages just execute in main repo directory:
```bash
yarn
```

##  Local testing
For local test execute:
```bash
yarn dev
```

## Building
For build app execute:
```bash
yarn build
```

## Adjusting to your requirements
If you want to use own fork of this app, you should change logo and base path.  
Put your logo in [src/assets](src/assets/) directory and edit path in [src/pages/index.vue](src/pages/index.vue). The orginal path looks like:
```html
       <v-img
         class="mb-4"
         height="120"
         src="@/assets/logo.png"
       />
```
Base path is a path where app will be stored at yours server, like in `https://mydomain.pl/Pozwolenie/` the base path is `/Pozwolenie/`, what is default. Changes should be done in [package.json](package.json) file, in "build-only" script.

## GitHub Pages
Current version is available for preview at GitHub Pages: [https://valutcizen.github.io/Pozwolenie/](https://valutcizen.github.io/Pozwolenie/)

## Source code structure
In `src` path you find:
- *assets* Binary files used by app like images
- *components* Vue based views and UI components [More](src/components/README.md)
- *data* Current question base with answers
- *model* Type files
- *services* Bussiness logic files [More](src/services/README.md)
- other paths contains things needed by Vue and Vuetify and propably you don't want change anything there