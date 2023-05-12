## (cf-cli-ga) Cloud Foundry CLI Github Actions

### [STATE: IN-DEVELOPMENT]

The main idea of the project is to wrap CF CLI into nodejs github actions.

### Authorization flow

Exists two authorization flows:
* Automatic
* Manual

Automatic is used by default. It performs login before action and logout right after action. To make it work - specify cf/login parameters for action you running (all of actions which requires to be logged in borrows cf/login action inputs).
Example 
```yaml
name: test
on: 
  workflow_dispatch
jobs:
  test:
    runs-on: [self-hosted]
    steps:   
      - name: Deploy
        id: cf-deploy
        uses: ./cf/deploy
        with:
          mtaFile: ./mta_archives/sample_1.0.0.mtar
          credentials: ${{secrets.CFCLIGA_JSON}}
```

Manual authorization flow requires manual handling log in and log out with cf/login and cf/logout actions.
To use manual authorization flow specify "manualLogin: true" input parameter for action.

Example 
```yaml
name: test
on: 
  workflow_dispatch
jobs:
  test:
    runs-on: [self-hosted]
    steps:   
      - name: Install CF CLI
        id: cf-install-cli
        uses: ./cf/install-cli
        with:
          plugins: multiapps, html5-plugin
      - name: Login
        id: cf-login
        uses: ./cf/login
        with:
          credentials: ${{secrets.CFCLIGA_JSON}}
      - name: Deploy
        id: cf-deploy
        uses: ./cf/deploy
        with:
          mtaFile: ./mta_archives/sample_1.0.0.mtar
          manualLogin: true
      - name: Logout
        id: cf-logout
        uses: ./cf/logout
```

### Availible actions:

| Action         | Equivalent in CF CLI | Description                                                                     | Docs                               |
| :--------------- | ---------------------- | --------------------------------------------------------------------------------- | ------------------------------------ |
| cf/install-cli | -                    | Downloads and installs CF CLI into worker. Supports installation of CF plugins. | [doc](docs/actions/install-cli.md) |
| cf/login       | cf login             | Wrapper for "cf login"                                                          |                                    |
| cf/logout      | cf logout            | Wrapper for "cf logout"                                                         |                                    |
| cf/deploy      | cf deploy            | Wrapper for "cf deploy"                                                         |                                    |
| cf/dmol        | cf dmol              | Wrapper for "cf dmol"                                                           |                                    |


### Deployment sample with PPiper

```yaml
#Workflow to test github actions with act
name: test-trial-act-ppiper
on: 
  workflow_dispatch
jobs:
  test-trial-act-ppiper:
    runs-on: "ubuntu-latest"
    container:
      image: ppiper/cf-cli:latest
      options: --user piper
      env:
        CF_PLUGIN_HOME: /home/piper
    steps:   
      - uses: actions/checkout@v2
      - name: Install CF CLI
        id: cf-install-cli
        uses: m4drive/cf-cli-ga/cf/install-cli@master
        with:
          plugins: multiapps, html5-plugin, blue-green-deploy
      - name: Login
        id: cf-login
        uses: m4drive/cf-cli-ga/cf/login@master
        with:
          credentials: ${{secrets.CFCLIGA_JSON}}
      - name: Deploy
        id: cf-deploy
        uses: m4drive/cf-cli-ga/cf/deploy@master
        with:
          mtaFile: ./mta_archives/sample_1.0.0.mtar
          manualLogin: true
      - name: Check Command
        id: cf-command
        uses: m4drive/cf-cli-ga/cf/command@master
        with:
          command: html5-list
          flags: "-d"
          hideOutput: false
          manualLogin: true
      - name: Logout
        id: cf-logout
        uses: m4drive/cf-cli-ga/cf/logout@master
```
