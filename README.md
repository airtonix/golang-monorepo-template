# GoMonorepoNX

A Golang monorepo using nx.dev

- apps are in `apps`
- packages are in `packages`
- build artifacts are in `dist/`

# Setup

1. Clone repo
2. `./setup.sh`
3. `just help`


# Usage

```shell
$ just help
```

# Development


## Running Apps

```shell
$ just serve app-one
```

## Generating Apps

```shell
$ just generate app mynewappname
```

## Generating Packages

```shell
$ just generate lib mynewlibname
```

## Nx

```shell
$ just nx ...
```

## Other NX commands

You're free to execute nx commands directly `./node_modules/nx ...`

