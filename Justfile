# JUSTFILE
# https://github.com/casey/just
#
stage := "dev"
export PATH := justfile_directory() + "/node_modules/.bin:" + env_var('PATH')

default:
    @just --choose

something $FOO='bar':
  @echo $FOO {{ stage }}

help:
    @just --list

# Project setup
setup:
    @echo '⛳ Begin project setup'
    pnpm install
    just fix
    husky install

# Process recorded changesets
version:
    multi-semantic-release --dry-run

generate projecttype="lib" name="":
    nx generate @nx-go/nx-go:{{projecttype}} {{name}}

# build all the things
build project="affected" *ARGS='':
    nx run-many \
        --target=build \
        --all \
        -- {{ ARGS }}

# lint changed packages
lint project="affected" *ARGS='':
    nx {{project}} \
        --target=lint \
        -- {{ ARGS }}

# test changed packages
test project="affected" *ARGS='':
    nx {{project}} \
    --target=test \
    -- --ci --reporters=default --reporters=jest-junit {{ ARGS }}

# test changed packages
serve project="" config="":
    nx serve {{project}} --configuration={{config}}

# typecheck changed packages
typecheck project="affected":
    nx {{project}} \
    --target=typecheck

# ensure nx workspace is good
workspacelint:
    nx workspace-lint

# run all pullrequest checks
prcheck: lint test typecheck

# omg reset!
clean:
    git clean -xdf

# fix monorepo issues
fix:
    @echo "👨‍⚕️ Fixing monorepo problems"
    syncpack format
    syncpack set-semver-ranges

# nx shortcut
nx *ARGS='':
    @# This exists so we can tell developers:
    @#
    @#   "You only need to remember `just`"
    @#
    @#    $ just this and that
    @#
    nx {{ARGS}}

