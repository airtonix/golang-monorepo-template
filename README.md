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

$ just app one help
```

# Development


## Running Apps

```shell
$ just app one dev
```

- uses the `app` command in the root `Justfile` 
- calls the `dev` command in the `apps/one/Justfile`

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

# 

You're free to execute nx commands directly `./node_modules/nx ...`

## Apps