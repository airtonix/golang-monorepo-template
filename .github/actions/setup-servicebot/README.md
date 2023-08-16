# setup-servicebot

Configures the git commiter as our Service Bot

We have stored in our Secrets two entries relating to our Service Bot:

- `BOT_GIT_EMAIL` the email address that is used to author commits
- `BOT_GIT_NAME` the name that is used to author commits

Github treats the authoring information in commits with special regard, so in
some cases it's important that some commits appear to be authored by our 
Service Bot.


## Requirements

You **must** inform the `actions/checkout` action that it should not
persist credentials.

```yml
uses: actions/checkout@v3
  with:
    persist-credentials: false
```

## Usage

```yml
  Release:

    runs-on: ubuntu-latest

    permissions:
      contents: write
      deployments: write

    steps:
      - uses: actions/checkout@v3
        with:
          persist-credentials: false

      - name: Setup ServiceBot
        uses: ./pkg/ci/setup-servicebot
        with:
          Email: ${{secrets.BOT_GIT_EMAIL}}
          Name: ${{secrets.BOT_GIT_NAME}}

      - run: |
          echo "facekeyboard" > ./MythicalFileName
          git add .
          git commit -am "Magical commit message"
          git push origin HEAD
```

If you're using an action that wants to own the process of setting 
the git author:

```yml
        uses: someaction
        with:
          GIT_AUTHOR_EMAIL: ${{secrets.BOT_GIT_EMAIL}}
          GIT_AUTHOR_NAME: ${{secrets.BOT_GIT_NAME}}
          GIT_COMMITTER_EMAIL: ${{secrets.BOT_GIT_EMAIL}}
          GIT_COMMITTER_NAME: ${{secrets.BOT_GIT_NAME}}
```
