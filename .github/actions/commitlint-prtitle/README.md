# commitlint-prtitle

Lints the PR title according to the configured commitlint preset.

## Usage

```yml
  Release:

    runs-on: ubuntu-latest

    permissions:
      contents: write
      deployments: write

    steps:

      - uses: actions/checkout@v3

      - name: Lint PR Title
        uses: ./pkg/ci/commitlint-prtitle

```

if you want to use your already installed commitlint and config

```yml
  Release:

    runs-on: ubuntu-latest

    permissions:
      contents: write
      deployments: write

    steps:

      - uses: actions/checkout@v3

      - name: Lint PR Title
        uses: ./pkg/ci/commitlint-prtitle
        with:
          InstallCommitLint: false
```
