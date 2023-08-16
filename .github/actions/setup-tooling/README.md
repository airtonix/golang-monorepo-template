# setup-tooling

Installs ASDF with plugins

## Requirements

- Netlify site id
- Netlify deploy token

## Usage

```yml
  Release:

    runs-on: ubuntu-latest

    permissions:
      contents: write
      deployments: write

    steps:

      - uses: actions/checkout@v3

      - name: Setup tooling
        uses: ./pkg/ci/setup-tooling
        env:
          ASDF_PLUGIN_URL_something: https://get.thething/asdf-plugin
```

- installs asdf plugins for each item listed in your `.tools-version`
- if one of your plugins isn't on the official asdf list, then provide the
  install url by defining an ENVVAR of `ASDF_PLUGIN_URL_pluginname=url`

### Custom ASDF Setup command

with your own version of the setup command:

```yml
  Release:

    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v3

      - name: Setup tooling
        uses: ./pkg/ci/setup-tooling
        with:
          SetupCommand: ./your/tools/an-executable.bash
```
