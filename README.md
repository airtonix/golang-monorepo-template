# GoMonorepoNX

A Golang monorepo using nx.dev

- apps are in `apps`
- packages are in `packages`
- build artifacts are in `dist/`

# Setup

1. Clone repo
2. `./setup.sh` (this installs [asdf](https://asdf-vm.com/) and any plugins in `.tool-versions`, then installs the described tools)
3. `just help`


# Usage

```shell
$ just help
```

# Development

1. get setup ☝️
2. add deps only to root package.json
3. add go deps to individual `go.mod`
4. run `just pr-check`


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

